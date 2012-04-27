/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

var oop = require("./lib/oop");
var EventEmitter = require("./lib/event_emitter").EventEmitter;

/**
 * class BackgroundTokenizer
 *
 * Tokenizes the current [[Document `Document`]] in the background, and caches the tokenized rows for future use. If a certain row is changed, everything below that row is re-tokenized.
 *
 **/

/**
 * new BackgroundTokenizer(tokenizer, editor)
 * - tokenizer (Tokenizer): The tokenizer to use
 * - editor (Editor): The editor to associate with
 *
 * Creates a new `BackgroundTokenizer` object.
 *
 *
 **/

var BackgroundTokenizer = function(tokenizer, editor) {
    this.running = false;    
    this.lines = [];
    this.currentLine = 0;
    this.tokenizer = tokenizer;

    var self = this;

    this.$worker = function() {
        if (!self.running) { return; }

        var workerStart = new Date();
        var startLine = self.currentLine;
        var doc = self.doc;

        var processedLines = 0;

        var len = doc.getLength();
        while (self.currentLine < len) {
            self.lines[self.currentLine] = self.$tokenizeRows(self.currentLine, self.currentLine)[0];
            self.currentLine++;

            // only check every 5 lines
            processedLines += 1;
            if ((processedLines % 5 == 0) && (new Date() - workerStart) > 20) {
                self.fireUpdateEvent(startLine, self.currentLine-1);
                self.running = setTimeout(self.$worker, 20);
                return;
            }
        }

        self.running = false;

        self.fireUpdateEvent(startLine, len - 1);
    };
};

(function(){

    oop.implement(this, EventEmitter);

    /**
     * BackgroundTokenizer.setTokenizer(tokenizer)
     * - tokenizer (Tokenizer): The new tokenizer to use
     *
     * Sets a new tokenizer for this object.
     *
     **/

    this.setTokenizer = function(tokenizer) {
        this.tokenizer = tokenizer;
        this.lines = [];

        this.start(0);
    };

    /**
     * BackgroundTokenizer.setDocument(doc)
     * - doc (Document): The new document to associate with
     *
     * Sets a new document to associate with this object.
     *
     **/

    this.setDocument = function(doc) {
        this.doc = doc;
        this.lines = [];

        this.stop();
    };

    /**
     * BackgroundTokenizer.fireUpdateEvent(firstRow, lastRow)
     * - firstRow (Number): The starting row region
     * - lastRow (Number): The final row region
     *
     * Emits the `'update'` event. `firstRow` and `lastRow` are used to define the boundaries of the region to be updated.
     *
     **/

    this.fireUpdateEvent = function(firstRow, lastRow) {
        var data = {
            first: firstRow,
            last: lastRow
        };
        this._emit("update", {data: data});
    };

    /**
     * BackgroundTokenizer.start(startRow)
     * - startRow (Number): The row to start at
     *
     * Starts tokenizing at the row indicated.
     *
     **/

    this.start = function(startRow) {
        this.currentLine = Math.min(startRow || 0, this.currentLine,
                                    this.doc.getLength());

        // remove all cached items below this line
        this.lines.splice(this.currentLine, this.lines.length);

        this.stop();
        // pretty long delay to prevent the tokenizer from interfering with the user
        this.running = setTimeout(this.$worker, 700);
    };

    /**
     * BackgroundTokenizer.stop()
     *
     * Stops tokenizing.
     *
     **/

    this.stop = function() {
        if (this.running)
            clearTimeout(this.running);
        this.running = false;
    };

    /** related to: BackgroundTokenizer.$tokenizeRows
     * BackgroundTokenizer.getTokens(firstRow, lastRow) -> [Object]
     * - firstRow (Number): The row to start at
     * - lastRow (Number): The row to finish at
     *
     * Starts tokenizing at the row indicated. Returns a list of objects of the tokenized rows.
     *
     **/

    this.getTokens = function(firstRow, lastRow) {
        return this.$tokenizeRows(firstRow, lastRow);
    };

    /** 
     * BackgroundTokenizer.getState(row) -> String
     * - row (Number): The row to start at
     *
     * [Returns the state of tokenization for a row.]{: #BackgroundTokenizer.getState}
     *
     **/

    this.getState = function(row) {
        return this.$tokenizeRows(row, row)[0].state;
    };

    /**
     * BackgroundTokenizer.$tokenizeRows(firstRow, lastRow) -> [Object]
     * - startRow (Number): The row to start at
     * - lastRow (Number): The row to finish at
     * + ([Object]): A list of the tokenized rows. Each item in the list is an object with two properties, `state` and `start`.
     *
     * Tokenizes all the rows within the specified region. 
     *
     *
     **/
    this.$tokenizeRows = function(firstRow, lastRow) {
        if (!this.doc || isNaN(firstRow) || isNaN(lastRow))
            return [{'state':'start','tokens':[]}];
            
        var rows = [];

        // determine start state
        var state = "start";
        var doCache = false;
        if (firstRow > 0 && this.lines[firstRow - 1]) {
            state = this.lines[firstRow - 1].state;
            doCache = true;
        } else if (firstRow == 0) {
            state = "start";
            doCache = true;
        } else if (this.lines.length > 0) {
            // Guess that we haven't changed state.
            state = this.lines[this.lines.length-1].state;
        }

        var lines = this.doc.getLines(firstRow, lastRow);
        for (var row=firstRow; row<=lastRow; row++) {
            if (!this.lines[row]) {
                var tokens = this.tokenizer.getLineTokens(lines[row-firstRow] || "", state);
                var state = tokens.state;
                rows.push(tokens);

                if (doCache) {
                    this.lines[row] = tokens;
                }
            }
            else {
                var tokens = this.lines[row];
                state = tokens.state;
                rows.push(tokens);
            }
        }
        return rows;
    };

}).call(BackgroundTokenizer.prototype);

exports.BackgroundTokenizer = BackgroundTokenizer;
});
