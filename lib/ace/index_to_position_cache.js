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

define(function(require, exports, module) {
"use strict";


var oop = require("./lib/oop");

/**
 * Speedup conversions between document character index and row/column positions.
 * 
 * Start with simple binary search. Should eventually be a tree lookup.
 * 
 * @constructor
 **/
var IndexToPositionCache = function(document) {
    this.lookup = null;
    this.document = document;
    document.on("change", this.$onDocumentChange.bind(this));
};

(function(){

    this.$onDocumentChange = function(delta) {
        this.lookup = null;
    };

    this.$rebuildCache = function() {
        this.lookup = [];
        const newlineLength = this.document.getNewLineCharacter().length;

        let charsUntilNow = 0;
        for (let i=0; i<this.document.getLength(); i++) {
            this.lookup.push(charsUntilNow);
            charsUntilNow += this.document.getLine(i).length + newlineLength;
        }
        this.lookup.push(charsUntilNow);
    };

    /**
     * Converts an index position in a document to a `{row, column}` object.
     *
     * Index refers to the "absolute position" of a character in the document. For example:
     *
     * ```javascript
     * var x = 0; // 10 characters, plus one for newline
     * var y = -1;
     * ```
     * 
     * Here, `y` is an index 15: 11 characters for the first row, and 5 characters until `y` in the second.
     *
     * @param {Number} index An index to convert
     * @returns {Object} A `{row, column}` object of the `index` position
     */
    this.indexToPosition = function(index) {
        if (!this.lookup) {
            this.$rebuildCache();
        }

        if (this.lookup.length == 0) {
            return {row: 0, column: 0};
        }

        if (index >= this.lookup[this.lookup.length - 1]) {
            return {
                row: this.document.getLength()-1,
                column: this.document.getLine(this.document.getLength()-1).length
            }
        }

        let start = 0;
        let end = this.lookup.length - 2;
        while(true) {
            let pivot = start + ((end - start) >> 1);
            if (this.lookup[pivot] <= index && this.lookup[pivot+1] > index) {
                return {
                    row: pivot,
                    column: index - this.lookup[pivot]
                }
                break;
            }

            if (this.lookup[pivot] > index) {
                end = pivot;
            } else {
                start = pivot;
            }
        }
    }
}).call(IndexToPositionCache.prototype);


exports.IndexToPositionCache = IndexToPositionCache;

});