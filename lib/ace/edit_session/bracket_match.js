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

var TokenIterator = require("../token_iterator").TokenIterator;
var Range = require("../range").Range;


function BracketMatch() {

    this.findMatchingBracket = function(position, chr) {
        if (position.column == 0) return null;

        var charBeforeCursor = chr || this.getLine(position.row).charAt(position.column - 1);
        if (charBeforeCursor == "") return null;

        var match = charBeforeCursor.match(/([\(\[\{])|([\)\]\}])/);
        if (!match)
            return null;

        if (match[1])
            return this.$findClosingBracket(match[1], position, this.$newDefaultForwardIterator(position));
        else
            return this.$findOpeningBracket(match[2], position, this.$newDefaultBackwardIterator(position));
    };

    this.getBracketRange = function(pos) {
        var line = this.getLine(pos.row);
        var before = true, range;

        var chr = line.charAt(pos.column-1);
        var match = chr && chr.match(/([\(\[\{])|([\)\]\}])/);
        if (!match) {
            chr = line.charAt(pos.column);
            pos = {row: pos.row, column: pos.column + 1};
            match = chr && chr.match(/([\(\[\{])|([\)\]\}])/);
            before = false;
        }
        if (!match)
            return null;

        if (match[1]) {
            var bracketPos = this.$findClosingBracket(match[1], pos, this.$newDefaultForwardIterator(pos));
            if (!bracketPos)
                return null;
            range = Range.fromPoints(pos, bracketPos);
            if (!before) {
                range.end.column++;
                range.start.column--;
            }
            range.cursor = range.end;
        } else {
            var bracketPos = this.$findOpeningBracket(match[2], pos, this.$newDefaultBackwardIterator(pos));
            if (!bracketPos)
                return null;
            range = Range.fromPoints(bracketPos, pos);
            if (!before) {
                range.start.column++;
                range.end.column--;
            }
            range.cursor = range.start;
        }

        return range;
    };

    this.$brackets = {
        ")": "(",
        "(": ")",
        "]": "[",
        "[": "]",
        "{": "}",
        "}": "{"
    };

    this.$newFilteringIterator = function(tokenIterator, getNext) {
        var result = {
            $currentToken: function() {
                return tokenIterator.getCurrentToken();
            },
            $currentRow: function() {
                return tokenIterator.getCurrentTokenRow();
            },
            $currentColumn: function() {
                return tokenIterator.getCurrentTokenColumn();
            },
            $current: null,
            $updateCurrent: function() {
                this.$current = {
                    token: this.$currentToken(),
                    row: this.$currentRow(),
                    column: this.$currentColumn(),
                    contains: function(pos) {
                        return this.row == pos.row && this.column + this.token.value.length >= pos.column;
                    }
                };
            },
            current: function() {
                return this.$current;
            },
            next: function() {
                return getNext(this);
            }
        }
        return result;
    }

    this.$newDefaultBackwardIterator = function(position, typeRe) {
        var tokenIterator = new TokenIterator(this, position.row, position.column);
        var token = tokenIterator.getCurrentToken();
        if (!token)
            token = tokenIterator.stepForward();
        if (!token)
            return null;
        if (!typeRe) {
           typeRe = new RegExp(
               "(\\.?" +
               token.type.replace(".", "\\.").replace("rparen", ".paren")
                   .replace(/\b(?:end)\b/, "(?:start|begin|end)")
               + ")+"
           );
        }
        var result = this.$newFilteringIterator(tokenIterator, function(filteringIterator) {
            // Scan backward through the document, looking for the next token
            // whose type matches typeRe
            do {
                token = tokenIterator.stepBackward();
            } while (token && !typeRe.test(token.type));

            if (token == null)
                return false;
            filteringIterator.$updateCurrent();
            return true;
        });
        result.$updateCurrent();
        return result;
    }

    this.$findOpeningBracket = function(bracket, position, filteringIterator) {
        if (!filteringIterator) {
            return null;
        }
        var openBracket = this.$brackets[bracket];
        var depth = 1;

        // Start searching in token, just before the character at position.column
        // If filtering iterator starts with the current token then we start searching from the cursor position
        var valueIndex = filteringIterator.current().contains(position)
            ? position.column - filteringIterator.current().column - 2
            : filteringIterator.current().token.value.length - 1;

        while (true) {
            var value = filteringIterator.current().token.value;
            while (valueIndex >= 0) {
                var chr = value.charAt(valueIndex);
                if (chr == openBracket) {
                    depth -= 1;
                    if (depth == 0) {
                        return {row: filteringIterator.current().row,
                            column: valueIndex + filteringIterator.current().column};
                    }
                }
                else if (chr == bracket) {
                    depth += 1;
                }
                valueIndex -= 1;
            }
            if (!filteringIterator.next()) {
                break;
            }
            valueIndex = filteringIterator.current().token.value.length - 1;
        }

        return null;
    };

    this.$newDefaultForwardIterator = function(position, typeRe) {
        var tokenIterator = new TokenIterator(this, position.row, position.column);
        var token = tokenIterator.getCurrentToken();
        if (!token)
            token = tokenIterator.stepForward();
        if (!token)
            return null;
        if (!typeRe) {
            typeRe = new RegExp(
                "(\\.?" +
                token.type.replace(".", "\\.").replace("lparen", ".paren")
                    .replace(/\b(?:start|begin)\b/, "(?:start|begin|end)")
                + ")+"
            );
        }
        var result = this.$newFilteringIterator(tokenIterator, function(filteringIterator) {
            // Scan forward through the document, looking for the next token
            // whose type matches typeRe
            do {
                token = tokenIterator.stepForward();
            } while (token && !typeRe.test(token.type));
            if (token) {
                filteringIterator.$updateCurrent();
                return true;
            } else {
                filteringIterator.$current = null;
                return false;
            }
        });
        result.$updateCurrent();
        return result;
    }
    this.$findClosingBracket = function(bracket, position, filteringIterator) {
        if (!filteringIterator) {
            return null;
        }
        var closingBracket = this.$brackets[bracket];
        var depth = 1;

        // If filtering iterator starts with the current token then we start searching from the cursor position
        var valueIndex = filteringIterator.current().contains(position) ? position.column - filteringIterator.current().column : 0;
        while (true) {
            var value = filteringIterator.current().token.value;
            var valueLength = value.length;
            while (valueIndex < valueLength) {
                var chr = value.charAt(valueIndex);
                if (chr == closingBracket) {
                    depth -= 1;
                    if (depth == 0) {
                        return {row: filteringIterator.current().row,
                            column: valueIndex + filteringIterator.current().column};
                    }
                }
                else if (chr == bracket) {
                    depth += 1;
                }
                valueIndex += 1;
            }
            if (!filteringIterator.next()) {
                break;
            }
            valueIndex = 0;
        }

        return null;
    };
}
exports.BracketMatch = BracketMatch;

});
