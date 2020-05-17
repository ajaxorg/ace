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

define(function (require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var BaseFoldMode = require("./fold_mode").FoldMode;
var Range = require("../../range").Range;
var TokenIterator = require("../../token_iterator").TokenIterator;


var FoldMode = exports.FoldMode = function () {
};

oop.inherits(FoldMode, BaseFoldMode);

(function () {
    this.indentKeywords = {
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
        "rescue": 0,
        "ensure": 0,
        "when": 0,
        "end": -1,
        "case": 1,
        "=begin": 1,
        "=end": -1
    };

    this.foldingStartMarker = /(?:\s|^)(def|do|while|class|unless|module|if|for|until|begin|else|elsif|case|rescue|ensure|when)\b|({\s*$)|(=begin)/;
    this.foldingStopMarker = /(=end(?=$|\s.*$))|(^\s*})|\b(end)\b/;

    this.getFoldWidget = function (session, foldStyle, row) {
        var line = session.getLine(row);
        var isStart = this.foldingStartMarker.test(line);
        var isEnd = this.foldingStopMarker.test(line);

        if (isStart && !isEnd) {
            var match = line.match(this.foldingStartMarker);
            if (match[1]) {
                if (match[1] == "if" || match[1] == "else" || match[1] == "while" || match[1] == "until" || match[1] == "unless") {
                    if (match[1] == "else" && /^\s*else\s*$/.test(line) === false) {
                        return;
                    }
                    if (/^\s*(?:if|else|while|until|unless)\s*/.test(line) === false) {
                        return;
                    }
                }

                if (match[1] == "when") {
                    if (/\sthen\s/.test(line) === true) {
                        return;
                    }
                }
                if (session.getTokenAt(row, match.index + 2).type === "keyword")
                    return "start";
            } else if (match[3]) {
                if (session.getTokenAt(row, match.index + 1).type === "comment.multiline")
                    return "start";
            } else {
                return "start";
            }
        }
        if (foldStyle != "markbeginend" || !isEnd || isStart && isEnd)
            return "";

        var match = line.match(this.foldingStopMarker);
        if (match[3] === "end") {
            if (session.getTokenAt(row, match.index + 1).type === "keyword")
                return "end";
        } else if (match[1]) {
            if (session.getTokenAt(row, match.index + 1).type === "comment.multiline")
                return "end";
        } else
            return "end";
    };

    this.getFoldWidgetRange = function (session, foldStyle, row) {
        var line = session.doc.getLine(row);
        var match = this.foldingStartMarker.exec(line);
        if (match) {
            if (match[1] || match[3])
                return this.rubyBlock(session, row, match.index + 2);

            return this.openingBracketBlock(session, "{", row, match.index);
        }

        var match = this.foldingStopMarker.exec(line);
        if (match) {
            if (match[3] === "end") {
                if (session.getTokenAt(row, match.index + 1).type === "keyword")
                    return this.rubyBlock(session, row, match.index + 1);
            }

            if (match[1] === "=end") {
                if (session.getTokenAt(row, match.index + 1).type === "comment.multiline")
                    return this.rubyBlock(session, row, match.index + 1);
            }

            return this.closingBracketBlock(session, "}", row, match.index + match[0].length);
        }
    };

    this.rubyBlock = function (session, row, column, tokenRange) {
        var stream = new TokenIterator(session, row, column);

        var token = stream.getCurrentToken();
        if (!token || (token.type != "keyword" && token.type != "comment.multiline"))
            return;

        var val = token.value;
        var line = session.getLine(row);
        switch (token.value) {
            case "if":
            case "unless":
            case "while":
            case "until":
                var checkToken = new RegExp("^\\s*" + token.value);
                if (!checkToken.test(line)) {
                    return;
                }
                var dir = this.indentKeywords[val];
                break;
            case "when":
                if (/\sthen\s/.test(line)) {
                    return;
                }
            case "elsif":
            case "rescue":
            case "ensure":
                var dir = 1;
                break;
            case "else":
                var checkToken = new RegExp("^\\s*" + token.value + "\\s*$");
                if (!checkToken.test(line)) {
                    return;
                }
                var dir = 1;
                break;
            default:
                var dir = this.indentKeywords[val];
                break;
        }

        var stack = [val];
        if (!dir)
            return;

        var startColumn = dir === -1 ? session.getLine(row - 1).length : session.getLine(row).length;
        var startRow = row;
        var ranges = [];
        ranges.push(stream.getCurrentTokenRange());

        stream.step = dir === -1 ? stream.stepBackward : stream.stepForward;
        if (token.type == "comment.multiline") {
            while (token = stream.step()) {
                if (token.type !== "comment.multiline")
                    continue;
                if (dir == 1) {
                    startColumn = 6;
                    if (token.value == "=end") {
                        break;
                    }
                } else {
                    if (token.value == "=begin") {
                        break;
                    }
                }
            }
        } else {
            while (token = stream.step()) {
                var ignore = false;
                if (token.type !== "keyword")
                    continue;
                var level = dir * this.indentKeywords[token.value];
                line = session.getLine(stream.getCurrentTokenRow());
                switch (token.value) {
                    case "do":
                        for (var i = stream.$tokenIndex - 1; i >= 0; i--) {
                            var prevToken = stream.$rowTokens[i];
                            if (prevToken && (prevToken.value == "while" || prevToken.value == "until" || prevToken.value == "for")) {
                                level = 0;
                                break;
                            }
                        }
                        break;
                    case "else":
                        var checkToken = new RegExp("^\\s*" + token.value + "\\s*$");
                        if (!checkToken.test(line) || val == "case") {
                            level = 0;
                            ignore = true;
                        }
                        break;
                    case "if":
                    case "unless":
                    case "while":
                    case "until":
                        var checkToken = new RegExp("^\\s*" + token.value);
                        if (!checkToken.test(line)) {
                            level = 0;
                            ignore = true;
                        }
                        break;
                    case "when":
                        if (/\sthen\s/.test(line) || val == "case") {
                            level = 0;
                            ignore = true;
                        }
                        break;
                }

                if (level > 0) {
                    stack.unshift(token.value);
                } else if (level <= 0 && ignore === false) {
                    stack.shift();
                    if (!stack.length) {
                        if ((val == "while" || val == "until" || val == "for") && token.value != "do") {
                            break;
                        }
                        if (token.value == "do" && dir == -1 && level != 0)
                            break;
                        if (token.value != "do")
                            break;
                    }

                    if (level === 0) {
                        stack.unshift(token.value);
                    }
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
        if (dir === -1) {
            if (token.type === "comment.multiline") {
                var endColumn = 6;
            } else {
                var endColumn = session.getLine(row).length;
            }
            return new Range(row, endColumn, startRow - 1, startColumn);
        } else
            return new Range(startRow, startColumn, row - 1, session.getLine(row - 1).length);
    };

}).call(FoldMode.prototype);

});
