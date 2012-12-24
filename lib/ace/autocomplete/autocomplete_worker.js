/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
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

var oop = require("../lib/oop");
var Mirror = require("../worker/mirror").Mirror;

var SyntaxDetector = require("./syntax_detector");
var completer = require("./text_completer");

var AutocompleteWorker = exports.AutocompleteWorker = function(sender) {
    this.setTimeout(0);
    Mirror.call(this, sender);
    this.setDeferredUpdate(false);
};

oop.inherits(AutocompleteWorker, Mirror);

(function() {
    // For code completion
    function removeDuplicateMatches(matches) {
        // First sort
        matches.sort(function(a, b) {
            if (a.name < b.name)
                return 1;
            else if (a.name > b.name)
                return -1;
            else
                return 0;
        });

        for(var i = 1; i < matches.length; ){
            if (matches[i - 1] == matches[i]){
                matches.splice(i, 1);
            } else {
                i++;
            }
        }

        return matches;
    };

    this.onUpdate = function() {
        var _self = this;

        var doc = this.doc.getValue();  
        var pos = this.data.cursor;
        var part = SyntaxDetector.getContextSyntaxPart(this.doc, this.data.cursor, "javascript");
        var language = part.language;

        var currentPos = { line: pos.row, col: pos.column };
        var currentNode = null;
        var matches = [], ast = null;

        completer.complete(_self.doc, ast, this.data.cursor, currentNode, function(identifier, completions) { 
            if (completions)
                matches = matches.concat(completions);
            removeDuplicateMatches(matches);
            // Sort by priority, score
            matches.sort(function(a, b) {
                if (a.priority < b.priority)
                    return 1;
                else if (a.priority > b.priority)
                    return -1;
                else if (a.score < b.score)
                    return 1;
                else if (a.score > b.score)
                    return -1;
                else if (a.id && a.id === b.id) {
                    if (a.isFunction)
                        return -1;
                    else if (b.isFunction)
                        return 1;
                }
                if (a.name < b.name)
                    return -1;
                else if(a.name > b.name)
                    return 1;
                else
                    return 0;
            });
            _self.sender.emit("complete", {
                startRow: pos.row,
                startColumn: pos.column - identifier.length,
                endRow: pos.row,
                endColumn: Infinity,
                matches: matches,
                line: _self.doc.getLine(pos.row)
            });
            return;
        });
    };

}).call(AutocompleteWorker.prototype);

});