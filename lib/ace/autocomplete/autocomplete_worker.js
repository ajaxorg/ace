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

var completer = require("./text_completer");

var AutocompleteWorker = exports.AutocompleteWorker = function(sender) {
    this.setTimeout(0);
    Mirror.call(this, sender);
    this.setDeferredUpdate(false);
};

oop.inherits(AutocompleteWorker, Mirror);

(function() {
    this.onUpdate = function() {
        var _self = this;

        var doc = this.doc.getValue();
        var pos = this.data.cursor;

        var currentPos = { line: pos.row, col: pos.column };

        completer.complete(_self.doc, this.data.cursor, this.data.keywords, function(identifier, completions) { 
            if (!identifier) {
                _self.sender.emit("complete", {
                    matches: []
                });
            }

            else {
                _self.sender.emit("complete", {
                    startRow: pos.row,
                    startColumn: pos.column - identifier.length,
                    endRow: pos.row,
                    endColumn: Infinity,
                    matches: completions,
                    line: _self.doc.getLine(pos.row)
                });
            }

            return;
        });
    };

}).call(AutocompleteWorker.prototype);

});