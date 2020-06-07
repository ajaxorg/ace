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
    this.indentKeywords = {
        "class": 1,
        "function": 1,
        "sub": 1,
        "if": 1,
        "select": 1,
        "do": 1,
        "for": 1,
        "while": 1,
        "with": 1,
        "property": 1,
        "else": 1,
        "elseif": 1,
        "end": -1,
        "loop": -1,
        "next": -1,
        "wend": -1
    };

    this.foldingStartMarker = /(?:\s|^)(class|function|sub|if|select|do|for|while|with|property|else|elseif)\b/i;
    this.foldingStopMarker = /\b(end|loop|next|wend)\b/i;

    this.getFoldWidgetRange = function (session, foldStyle, row) {
        var line = session.getLine(row);
        var isStart = this.foldingStartMarker.test(line);
        var isEnd = this.foldingStopMarker.test(line);
        if (isStart || isEnd) {
            var match = (isEnd) ? this.foldingStopMarker.exec(line) : this.foldingStartMarker.exec(line);
            var keyword = match && match[1].toLowerCase();
            if (keyword) {
                var type = session.getTokenAt(row, match.index + 2).type;
                if (type === "keyword.control.asp" || type === "storage.type.function.asp")
                    return this.vbsBlock(session, row, match.index + 2);
            }
        }
    };


    // must return "" if there's no fold, to enable caching
    this.getFoldWidget = function(session, foldStyle, row) {
        var line = session.getLine(row);
        var isStart = this.foldingStartMarker.test(line);
        var isEnd = this.foldingStopMarker.test(line);
        if (isStart && !isEnd) {
            var match = this.foldingStartMarker.exec(line);
            var keyword = match && match[1].toLowerCase();
            if (keyword) {
                var type = session.getTokenAt(row, match.index + 2).type;
                if (type == "keyword.control.asp" || type == "storage.type.function.asp") {
                    if (keyword == "if" && !/then\s*('|$)/i.test(line))
                        return "";
                    return "start";
                }
            }
        }
        return "";
    };

    this.vbsBlock = function(session, row, column, tokenRange) {
        var stream = new TokenIterator(session, row, column);

        var endOpenings = {
            "class": 1,
            "function": 1,
            "sub": 1,
            "if": 1,
            "select": 1,
            "with": 1,
            "property": 1,
            "else": 1,
            "elseif": 1
        };

        var token = stream.getCurrentToken();
        if (!token || (token.type != "keyword.control.asp" && token.type != "storage.type.function.asp"))
            return;

        var startTokenValue = token.value.toLowerCase();
        var val = token.value.toLowerCase();

        var stack = [val];
        var dir = this.indentKeywords[val];

        if (!dir)
            return;

        var firstRange = stream.getCurrentTokenRange();
        switch (val) {
            case "property":
            case "sub":
            case "function":
            case "if":
            case "select":
            case "do":
            case "for":
            case "class":
            case "while":
            case "with":
                var line = session.getLine(row);
                var singleLineCondition = /^\s*If\s+.*\s+Then(?!')\s+(?!')\S/i.test(line);
                if (singleLineCondition)
                    return;
                var checkToken = new RegExp("(?:^|\\s)" + val, "i");
                var endTest = /^\s*End\s(If|Sub|Select|Function|Class|With|Property)\s*/i.test(line);
                if (!checkToken.test(line) && !endTest) {
                    return;
                }
                if (endTest) {
                    var tokenRange = stream.getCurrentTokenRange();
                    stream.step = stream.stepBackward;
                    stream.step();
                    stream.step();
                    token = stream.getCurrentToken();
                    if (token) {
                        val = token.value.toLowerCase();
                        if (val == "end") {
                            firstRange = stream.getCurrentTokenRange();
                            firstRange = new Range(firstRange.start.row, firstRange.start.column, tokenRange.start.row, tokenRange.end.column);
                        }
                    }
                    dir = -1;
                }
                break;
            case "end":
                var tokenPos = stream.getCurrentTokenPosition();
                firstRange = stream.getCurrentTokenRange();
                stream.step = stream.stepForward;
                stream.step();
                stream.step();
                token = stream.getCurrentToken();
                if (token) {
                    val = token.value.toLowerCase();
                    if (val in endOpenings) {
                        startTokenValue = val;
                        var nextTokenPos = stream.getCurrentTokenPosition();
                        var endColumn = nextTokenPos.column + val.length;
                        firstRange = new Range(tokenPos.row, tokenPos.column, nextTokenPos.row, endColumn);
                    }
                }
                stream.step = stream.stepBackward;
                stream.step();
                stream.step();
                break;
        }
        var startColumn = dir === -1 ? session.getLine(row - 1).length : session.getLine(row).length;
        var startRow = row;
        var ranges = [];
        ranges.push(firstRange);

        stream.step = dir === -1 ? stream.stepBackward : stream.stepForward;
        while(token = stream.step()) {
            var outputRange = null;
            var ignore = false;
            if (token.type != "keyword.control.asp" && token.type != "storage.type.function.asp")
                continue;
            val = token.value.toLowerCase();
            var level = dir * this.indentKeywords[val];

            switch (val) {
                case "property":
                case "sub":
                case "function":
                case "if":
                case "select":
                case "do":
                case "for":
                case "class":
                case "while":
                case "with":
                    var line = session.getLine(stream.getCurrentTokenRow());
                    var singleLineCondition = /^\s*If\s+.*\s+Then(?!')\s+(?!')\S/i.test(line);
                    if (singleLineCondition) {
                        level = 0;
                        ignore = true;
                    }
                    var checkToken = new RegExp("^\\s* end\\s+" + val, "i");
                    if (checkToken.test(line)) {
                        level = 0;
                        ignore = true;
                    }
                    break;
                case "elseif":
                case "else":
                    level = 0;
                    if (startTokenValue != "elseif") {
                        ignore = true;
                    }
                    break;
            }

            if (level > 0) {
                stack.unshift(val);
            } else if (level <= 0 && ignore === false) {
                stack.shift();
                if (!stack.length) {
                        switch (val) {
                            case "end":
                                var tokenPos = stream.getCurrentTokenPosition();
                                outputRange = stream.getCurrentTokenRange();
                                stream.step();
                                stream.step();
                                token = stream.getCurrentToken();
                                if (token) {
                                    val = token.value.toLowerCase();
                                    if (val in endOpenings) {
                                        if ((startTokenValue == "else" || startTokenValue == "elseif")) {
                                            if (val !== "if") {
                                                ranges.shift();
                                            }
                                        } else {
                                            if (val != startTokenValue)
                                                ranges.shift();
                                        }
                                        var nextTokenPos = stream.getCurrentTokenPosition();
                                        var endColumn = nextTokenPos.column + val.length;
                                        outputRange = new Range(tokenPos.row, tokenPos.column, nextTokenPos.row, endColumn);
                                    } else {
                                        ranges.shift();
                                    }
                                } else {
                                    ranges.shift();
                                }
                                stream.step = stream.stepBackward;
                                stream.step();
                                stream.step();
                                token = stream.getCurrentToken();
                                val = token.value.toLowerCase();
                                break;
                            case "select":
                            case "sub":
                            case "if":
                            case "function":
                            case "class":
                            case "with":
                            case "property":
                                if (val != startTokenValue)
                                    ranges.shift();
                                break;
                            case "do":
                                if (startTokenValue != "loop")
                                    ranges.shift();
                                break;
                            case "loop":
                                if (startTokenValue != "do")
                                    ranges.shift();
                                break;
                            case "for":
                                if (startTokenValue != "next")
                                    ranges.shift();
                                break;
                            case "next":
                                if (startTokenValue != "for")
                                    ranges.shift();
                                break;
                            case "while":
                                if (startTokenValue != "wend")
                                    ranges.shift();
                                break;
                            case "wend":
                                if (startTokenValue != "while")
                                    ranges.shift();
                                break;
                        }
                        break;
                }

                if (level === 0){
                    stack.unshift(val);
                }
            }
        }

        if (!token)
            return null;

        if (tokenRange) {
            if (!outputRange) {
                ranges.push(stream.getCurrentTokenRange());
            } else {
                ranges.push(outputRange);
            }
            return ranges;
        }

        var row = stream.getCurrentTokenRow();
        if (dir === -1) {
            var endColumn = session.getLine(row).length;
            return new Range(row, endColumn, startRow - 1, startColumn);
        } else
            return new Range(startRow, startColumn, row - 1, session.getLine(row - 1).length);
    };

}).call(FoldMode.prototype);

});
