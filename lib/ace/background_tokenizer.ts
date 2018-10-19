/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

import { EventEmitter } from "./lib/event_emitter";
import { Tokenizer } from "./tokenizer";
import { Editor } from "./editor";
import { Document } from "./document";
import { Delta } from "./undomanager";

/**
 * Tokenizes the current [[Document `Document`]] in the background, and caches the tokenized rows for future use. 
 * 
 * If a certain row is changed, everything below that row is re-tokenized.
 *
 * @class BackgroundTokenizer
 **/

/**
 * Creates a new `BackgroundTokenizer` object.
 * @param {Tokenizer} tokenizer The tokenizer to use
 * @param {Editor} editor The editor to associate with
 *
 * @constructor
 **/

export class BackgroundTokenizer extends EventEmitter{

    doc: Document;
    private $worker: () => void;
    tokenizer: Tokenizer;
    currentLine: number;
    states: (string|string[])[];
    lines: string[];
    running: number;

    constructor(tokenizer: Tokenizer, editor: Editor) {
        super();
        this.running = 0;
        this.lines = [];
        this.states = [];
        this.currentLine = 0;
        this.tokenizer = tokenizer;

        this.$worker = () => {
            if (!this.running) { return; }

            var workerStart = Date.now();
            var currentLine = this.currentLine;
            var endLine = -1;
            var doc = this.doc;

            var startLine = currentLine;
            while (this.lines[currentLine])
                currentLine++;
            
            var len = doc.getLength();
            var processedLines = 0;
            this.running = 0;
            while (currentLine < len) {
                this.$tokenizeRow(currentLine);
                endLine = currentLine;
                do {
                    currentLine++;
                } while (this.lines[currentLine]);

                // only check every 5 lines
                processedLines ++;
                if ((processedLines % 5 === 0) && (Date.now() - workerStart) > 20) {                
                    this.running = setTimeout(this.$worker, 20);
                    break;
                }
            }
            this.currentLine = currentLine;
            
            if (endLine == -1)
                endLine = currentLine;
            
            if (startLine <= endLine)
                this.fireUpdateEvent(startLine, endLine);
        };
    }

    /**
     * Sets a new tokenizer for this object.
     *
     * @param {Tokenizer} tokenizer The new tokenizer to use
     *
     **/
    setTokenizer(tokenizer: Tokenizer) {
        this.tokenizer = tokenizer;
        this.lines = [];
        this.states = [];

        this.start(0);
    };

    /**
     * Sets a new document to associate with this object.
     * @param {Document} doc The new document to associate with
     **/
    setDocument(doc: Document) {
        this.doc = doc;
        this.lines = [];
        this.states = [];

        this.stop();
    };

     /**
     * Fires whenever the background tokeniziers between a range of rows are going to be updated.
     * 
     * @event update
     * @param {Object} e An object containing two properties, `first` and `last`, which indicate the rows of the region being updated.
     *
     **/
    /**
     * Emits the `'update'` event. `firstRow` and `lastRow` are used to define the boundaries of the region to be updated.
     * @param {Number} firstRow The starting row region
     * @param {Number} lastRow The final row region
     *
     **/
    fireUpdateEvent(firstRow: number, lastRow: number) {
        var data = {
            first: firstRow,
            last: lastRow
        };
        this._signal("update", {data: data});
    };

    /**
     * Starts tokenizing at the row indicated.
     *
     * @param {Number} startRow The row to start at
     *
     **/
    start(startRow: number) {
        this.currentLine = Math.min(startRow || 0, this.currentLine, this.doc.getLength());

        // remove all cached items below this line
        this.lines.splice(this.currentLine, this.lines.length);
        this.states.splice(this.currentLine, this.states.length);

        this.stop();
        // pretty long delay to prevent the tokenizer from interfering with the user
        this.running = setTimeout(this.$worker, 700);
    };
    
    scheduleStart() {
        if (!this.running)
            this.running = setTimeout(this.$worker, 700);
    };

    $updateOnChange(delta: Delta) {
        var startRow = delta.start.row;
        var len = delta.end.row - startRow;

        if (len === 0) {
            this.lines[startRow] = null;
        } else if (delta.action == "remove") {
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
    };

    /**
     * Stops tokenizing.
     *
     **/
    stop() {
        if (this.running)
            clearTimeout(this.running);
        this.running = 0;
    };

    /**
     * Gives list of tokens of the row. (tokens are cached)
     * 
     * @param {Number} row The row to get tokens at
     *
     * 
     *
     **/
    getTokens(row: number) {
        return this.lines[row] || this.$tokenizeRow(row);
    };

    /**
     * [Returns the state of tokenization at the end of a row.]{: #BackgroundTokenizer.getState}
     *
     * @param {Number} row The row to get state at
     **/
    getState(row: number) {
        if (this.currentLine == row)
            this.$tokenizeRow(row);
        return this.states[row] || "start";
    };

    $tokenizeRow(row: number) {
        var line = this.doc.getLine(row);
        var state = this.states[row - 1];

        var data = this.tokenizer.getLineTokens(line, state);

        if (this.states[row] + "" !== data.state + "") {
            this.states[row] = data.state;
            this.lines[row + 1] = null;
            if (this.currentLine > row + 1)
                this.currentLine = row + 1;
        } else if (this.currentLine == row) {
            this.currentLine = row + 1;
        }

        return this.lines[row] = data.tokens;
    };

};
