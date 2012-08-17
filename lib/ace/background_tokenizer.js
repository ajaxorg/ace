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

// tokenizing lines longer than this makes editor very slow
var MAX_LINE_LENGTH = 5000;

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
    this.states = [];
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
            self.$tokenizeRow(self.currentLine);
            while (self.lines[self.currentLine])
                self.currentLine++;

            // only check every 5 lines
            processedLines ++;
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
        this.states = [];

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
        this.states = [];

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
        this.currentLine = Math.min(startRow || 0, this.currentLine, this.doc.getLength());

        // remove all cached items below this line
        this.lines.splice(this.currentLine, this.lines.length);
        this.states.splice(this.currentLine, this.states.length);

        this.stop();
        // pretty long delay to prevent the tokenizer from interfering with the user
        this.running = setTimeout(this.$worker, 700);
    };

    this.$updateOnChange = function(delta) {
        var range = delta.range;
        var startRow = range.start.row;
        var len = range.end.row - startRow;

        if (len === 0) {
            this.lines[startRow] = null;
        } else if (delta.action == "removeText" || delta.action == "removeLines") {
            this.lines.splice(startRow, len + 1, null);
            this.states.splice(startRow, len + 1, null);
        } else {
            var args = Array(len + 1);
            args.unshift(startRow, 1);
            this.lines.splice.apply(this.lines, args);
            this.states.splice.apply(this.states, args);
        }

        this.currentLine = Math.min(startRow, this.currentLine, this.doc.getLength());

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

    /**
     * BackgroundTokenizer.getTokens(row) -> [Object]
     * - firstRow (Number): The row to get tokens at
     *
     * Gives list of tokens of the row. (tokens are cached)
     *
     **/
    this.getTokens = function(row) {
        return this.lines[row] || this.$tokenizeRow(row);
    };

    /**
     * BackgroundTokenizer.getState(row) -> String
     * - row (Number): The row to get state at
     *
     * [Returns the state of tokenization at the end of a row.]{: #BackgroundTokenizer.getState}
     **/
    this.getState = function(row) {
        if (this.currentLine == row)
            this.$tokenizeRow(row);
        return this.states[row] || "start";
    };

    this.$tokenizeRow = function(row) {
        var line = this.doc.getLine(row);
        var state = this.states[row - 1];

        if (line.length > MAX_LINE_LENGTH) {
            var overflow = {value: line.substr(MAX_LINE_LENGTH), type: "text"};
            line = line.slice(0, MAX_LINE_LENGTH);
        }
        var data = this.tokenizer.getLineTokens(line, state);
        if (overflow) {
            data.tokens.push(overflow);
            data.state = "start";
        }

        if (this.states[row] !== data.state) {
            this.states[row] = data.state;
            this.lines[row + 1] = null;
            if (this.currentLine > row + 1)
                this.currentLine = row + 1;
        } else if (this.currentLine == row) {
            this.currentLine = row + 1;
        }

        return this.lines[row] = data.tokens;
    };

}).call(BackgroundTokenizer.prototype);

exports.BackgroundTokenizer = BackgroundTokenizer;
});
