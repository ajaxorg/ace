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
        "wend": -1,
        "exit": 0,
        "until": 0
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
        if (/(?:\s*|^)Exit\s+(Do|For|Sub|Function|Property)\b/i.test(line)) return "";
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

        var firstRange = stream.getCurrentTokenRange();

        var doubleKeywordResult = this.$isDoubleKeyword(token, stream);
        if (doubleKeywordResult === "ignore") {
            return;
        }
        var doubleKeywordPosition = null;
        if (doubleKeywordResult) {
            firstRange = doubleKeywordResult.range;
            doubleKeywordPosition = doubleKeywordResult.position;
            if (doubleKeywordResult.position === "second") {
                val = doubleKeywordResult.keyword;
                startTokenValue = val;
            }
        }

        var stack = [val];
        var dir = this.indentKeywords[val];

        if (!dir)
            return;

        if (doubleKeywordPosition === "first" && dir === 1) {
            stream.stepForward();
            stream.stepForward();
        } else if (doubleKeywordPosition === "second" && dir === -1) {
            stream.stepBackward();
            stream.stepBackward();
        }

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
                case "until":
                case "exit":
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
                    var doubleKeyword = this.$isDoubleKeyword(token, stream);
                    if (doubleKeyword === "ignore" || (doubleKeyword && doubleKeyword.position === "second")) {
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
                                    outputRange.setEnd(nextTokenPos.row, endColumn);
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
                            var doDouble = this.$isDoubleKeyword(token, stream);
                            outputRange = (doDouble && doDouble.position === "first")
                                ? doDouble.range
                                : stream.getCurrentTokenRange();
                            break;
                        case "loop":
                            if (startTokenValue != "do")
                                ranges.shift();
                            var loopDouble = this.$isDoubleKeyword(token, stream);
                            outputRange = (loopDouble && loopDouble.position === "first")
                                ? loopDouble.range
                                : stream.getCurrentTokenRange();
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

    /**
     * @param {Token} currentToken
     * @param {TokenIterator} stream
     * @return {false | "ignore" | { range: Range, position: "first" | "second", keyword: string }}
     */
    this.$isDoubleKeyword = function (currentToken, stream) {
        var val = currentToken.value.toLowerCase();
        var tokenIndex = stream.$tokenIndex;
        var rowTokens = stream.$rowTokens;

        var prevKeywordIndex = tokenIndex - 2;
        var prevKeyword = prevKeywordIndex >= 0 ? rowTokens[prevKeywordIndex] : null;
        if (prevKeyword) {
            var prevVal = prevKeyword.value.toLowerCase();

            // Do While / Do Until
            if ((val === "while" || val === "until") && prevVal === "do") {
                return {
                    range: this.$getDoubleKeywordRange(prevKeywordIndex, tokenIndex, stream),
                    position: "second",
                    keyword: "do"
                };
            }

            // Loop While / Loop Until
            if ((val === "while" || val === "until") && prevVal === "loop") {
                return {
                    range: this.$getDoubleKeywordRange(prevKeywordIndex, tokenIndex, stream),
                    position: "second",
                    keyword: "loop"
                };
            }

            if (prevVal === "exit" && (val === "for" || val === "do" || val === "sub" || val === "function" || val === "property")) {
                return "ignore";
            }
        }

        var nextKeywordIndex = tokenIndex + 2;
        var nextKeyword = nextKeywordIndex < rowTokens.length ? rowTokens[nextKeywordIndex] : null;
        if (nextKeyword) {
            var nextVal = nextKeyword.value.toLowerCase();

            // Do While / Do Until
            if (val === "do" && (nextVal === "while" || nextVal === "until")) {
                return {
                    range: this.$getDoubleKeywordRange(tokenIndex, nextKeywordIndex, stream),
                    position: "first",
                    keyword: "do"
                };
            }

            // Loop While / Loop Until
            if (val === "loop" && (nextVal === "while" || nextVal === "until")) {
                return {
                    range: this.$getDoubleKeywordRange(tokenIndex, nextKeywordIndex, stream),
                    position: "first",
                    keyword: "loop"
                };
            }

            if (val === "exit" && (nextVal === "for" || nextVal === "do" || nextVal === "sub" || nextVal === "function" || nextVal === "property")) {
                return "ignore";
            }
        }

        return false;
    };

    /**
     * Calculate range spanning both tokens of a double keyword
     * @param {number} firstTokenIndex
     * @param {number} secondTokenIndex
     * @param {TokenIterator} stream
     * @return {Range}
     */
    this.$getDoubleKeywordRange = function (firstTokenIndex, secondTokenIndex, stream) {
        var row = stream.$row;
        var rowTokens = stream.$rowTokens;

        var firstStart = 0;
        for (var i = 0; i < firstTokenIndex; i++) {
            firstStart += rowTokens[i].value.length;
        }

        var secondEnd = 0;
        for (var i = 0; i <= secondTokenIndex; i++) {
            secondEnd += rowTokens[i].value.length;
        }

        return new Range(row, firstStart, row, secondEnd);
    };

}).call(FoldMode.prototype);
