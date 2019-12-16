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

    var oop = require("../../lib/oop");
    var BaseFoldMode = require("./fold_mode").FoldMode;
    var Range = require("../../range").Range;
    var TokenIterator = require("../../token_iterator").TokenIterator;


    var FoldMode = exports.FoldMode = function() {};

    oop.inherits(FoldMode, BaseFoldMode);

    (function() {

        this.getFoldWidgetRange = function(session, foldStyle, row) {
            var range = this.indentationBlock(session, row);
            if (range)
                return range;

            var re = /\S/;
            var line = session.getLine(row);
            var startLevel = line.search(re);
            if (startLevel == -1 || line[startLevel] != "#")
                return;

            var startColumn = line.length;
            var maxRow = session.getLength();
            var startRow = row;
            var endRow = row;

            while (++row < maxRow) {
                line = session.getLine(row);
                var level = line.search(re);

                if (level == -1)
                    continue;

                if (line[level] != "#")
                    break;

                endRow = row;
            }

            if (endRow > startRow) {
                var endColumn = session.getLine(endRow).length;
                return new Range(startRow, startColumn, endRow, endColumn);
            }
        };

        // must return "" if there's no fold, to enable caching
        this.getFoldWidget = function(session, foldStyle, row) {
            var line = session.getLine(row);
            var indent = line.search(/\S/);
            var next = session.getLine(row + 1);
            var prev = session.getLine(row - 1);
            var prevIndent = prev.search(/\S/);
            var nextIndent = next.search(/\S/);

            if (indent == -1) {
                session.foldWidgets[row - 1] = prevIndent!= -1 && prevIndent < nextIndent ? "start" : "";
                return "";
            }

            // documentation comments
            if (prevIndent == -1) {
                if (indent == nextIndent && line[indent] == "#" && next[indent] == "#") {
                    session.foldWidgets[row - 1] = "";
                    session.foldWidgets[row + 1] = "";
                    return "start";
                }
            } else if (prevIndent == indent && line[indent] == "#" && prev[indent] == "#") {
                if (session.getLine(row - 2).search(/\S/) == -1) {
                    session.foldWidgets[row - 1] = "start";
                    session.foldWidgets[row + 1] = "";
                    return "";
                }
            }

            if (prevIndent!= -1 && prevIndent < indent)
                session.foldWidgets[row - 1] = "start";
            else
                session.foldWidgets[row - 1] = "";

            if (indent < nextIndent)
                return "start";
            else
                return "";
        };

        this.rubyBlock = function(session, row, column, tokenRange) {
            var stream = new TokenIterator(session, row, column);
            var indentKeywords = {
                "class": 1,
                "def": 1,
                "module": 1,
                "do": 1,
                "unless": 1,
                "if": 1,
                "while": 1,
                "for": 1,
                "until": 1,
                "begin": 1,
                "else": 0,
                "elsif": 0,
                "end": -1,
                "case": 1
            };

            var token = stream.getCurrentToken();
            if (!token || token.type != "keyword")
                return;

            var val = token.value;
            if (token.value == "if" || token.value == "unless" || token.value == "while" || token.value == "until") {
                var line = session.getLine(row);
                if (/^\s*(if|else|while|until|unless)\s*/.test(line) === false) {
                    return ;
                }
            }
            var stack = [val];
            var dir = indentKeywords[val];

            if (!dir)
                return;

            var startColumn = dir === -1 ? stream.getCurrentTokenColumn() : session.getLine(row).length;
            var startRow = row;
            var ranges = [];
            ranges.push(stream.getCurrentTokenRange());

            stream.step = dir === -1 ? stream.stepBackward : stream.stepForward;
            while(token = stream.step()) {
                var ignore = false;
                if (token.type !== "keyword")
                    continue;

                var level = dir * indentKeywords[token.value];

                if (token.value == "do") {
                    for (var i = stream.$tokenIndex - 1; i >= 0; i--) {
                        var prevToken = stream.$rowTokens[i];
                        if (prevToken && (prevToken.value == "while" || prevToken.value == "until" || prevToken.value == "for")) {
                            level = 0;
                            break;
                        }
                    }
                }

                if ((token.value == "if" || token.value == "unless" || token.value == "while" || token.value == "until")) {
                    var line = session.getLine(stream.getCurrentTokenRow());
                    if (/^\s*(if|while|until|unless)\s*/.test(line) === false) {
                        level = 0;
                        ignore = true;
                    }
                }
                if (level > 0) {
                    stack.unshift(token.value);
                } else if (level <= 0) {
                    stack.shift();
                    if (!stack.length && ignore === false) {
                        if ((val == "while" || val == "until" || val == "for") && token.value != "do") {
                            break;
                        }
                        if (token.value == "do" && dir == -1 && level != 0)
                            break;
                        if (token.value != "elsif" && token.value != "else" && token.value != "do")
                            break;
                    }

                    if (level === 0 && ignore === false){
                        stack.unshift(token.value);
                    }
                }
            }

            if (!token)
                return null;

            if (tokenRange) {
                ranges.push(stream.getCurrentTokenRange());
                return ranges;
            }

            var row = stream.getCurrentTokenRow();
            if (dir === -1)
                return new Range(row, session.getLine(row).length, startRow, startColumn);
            else
                return new Range(startRow, startColumn, row, stream.getCurrentTokenColumn());
        };

    }).call(FoldMode.prototype);

});
