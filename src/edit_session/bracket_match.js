"use strict";
/**
 * @typedef {import("../edit_session").EditSession} EditSession
 * @typedef {import("../edit_session").Point} Point
 */
var TokenIterator = require("../token_iterator").TokenIterator;
var Range = require("../range").Range;

function BracketMatch() {

    /**
     * 
     * @param {Point} position
     * @param {string} [chr]
     * @this {EditSession}
     */
    this.findMatchingBracket = function(position, chr) {
        if (position.column == 0) return null;

        var charBeforeCursor = chr || this.getLine(position.row).charAt(position.column-1);
        if (charBeforeCursor == "") return null;

        var match = charBeforeCursor.match(/([\(\[\{])|([\)\]\}])/);
        if (!match)
            return null;

        if (match[1])
            return this.$findClosingBracket(match[1], position);
        else
            return this.$findOpeningBracket(match[2], position);
    };

    /**
     * @param {Point} pos
     * @return {null|Range}
     * @this {EditSession}
     */
    this.getBracketRange = function(pos) {
        var line = this.getLine(pos.row);
        var before = true, range;

        var chr = line.charAt(pos.column - 1);
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
            var bracketPos = this.$findClosingBracket(match[1], pos);
            if (!bracketPos)
                return null;
            range = Range.fromPoints(pos, bracketPos);
            if (!before) {
                range.end.column++;
                range.start.column--;
            }
            range.cursor = range.end;
        } else {
            var bracketPos = this.$findOpeningBracket(match[2], pos);
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

    /**
     * Returns:
     * * null if there is no any bracket at `pos`;
     * * two Ranges if there is opening and closing brackets;
     * * one Range if there is only one bracket
     *
     * @param {Point} pos
     * @param {boolean} [isBackwards]
     * @returns {null|Range[]}
     * @this {EditSession}
     */
    this.getMatchingBracketRanges = function(pos, isBackwards) {
        var line = this.getLine(pos.row);
        var bracketsRegExp = /([\(\[\{])|([\)\]\}])/;
        var chr = !isBackwards && line.charAt(pos.column - 1);
        var match = chr && chr.match(bracketsRegExp);
        if (!match) {
            chr = (isBackwards === undefined || isBackwards) && line.charAt(pos.column);
            pos = {
                row: pos.row,
                column: pos.column + 1
            };
            match = chr && chr.match(bracketsRegExp);
        }

        if (!match)
            return null;

        var startRange = new Range(pos.row, pos.column - 1, pos.row, pos.column);
        var bracketPos = match[1] ? this.$findClosingBracket(match[1], pos)
            : this.$findOpeningBracket(match[2], pos);
        if (!bracketPos)
            return [startRange];
        var endRange = new Range(bracketPos.row, bracketPos.column, bracketPos.row, bracketPos.column + 1);

        return [startRange, endRange];
    };

    this.$brackets = {
        ")": "(",
        "(": ")",
        "]": "[",
        "[": "]",
        "{": "}",
        "}": "{",
        "<": ">",
        ">": "<"
    };

    /**
     * 
     * @param {string} bracket
     * @param {Point} position
     * @param {RegExp} [typeRe]
     * @return {Point|null}
     * @this {EditSession}
     */
    this.$findOpeningBracket = function(bracket, position, typeRe) {
        var openBracket = this.$brackets[bracket];
        var depth = 1;

        var iterator = new TokenIterator(this, position.row, position.column);
        var token = iterator.getCurrentToken();
        if (!token)
            token = iterator.stepForward();
        if (!token)
            return;
        
         if (!typeRe){
            typeRe = new RegExp(
                "(\\.?" +
                token.type.replace(".", "\\.").replace("rparen", ".paren")
                    .replace(/\b(?:end)\b/, "(?:start|begin|end)")
                    .replace(/-close\b/, "-(close|open)")
                + ")+"
            );
        }
        
        // Start searching in token, just before the character at position.column
        var valueIndex = position.column - iterator.getCurrentTokenColumn() - 2;
        var value = token.value;
        
        while (true) {
        
            while (valueIndex >= 0) {
                var chr = value.charAt(valueIndex);
                if (chr == openBracket) {
                    depth -= 1;
                    if (depth == 0) {
                        return {row: iterator.getCurrentTokenRow(),
                            column: valueIndex + iterator.getCurrentTokenColumn()};
                    }
                }
                else if (chr == bracket) {
                    depth += 1;
                }
                valueIndex -= 1;
            }

            // Scan backward through the document, looking for the next token
            // whose type matches typeRe
            do {
                token = iterator.stepBackward();
            } while (token && !typeRe.test(token.type));

            if (token == null)
                break;
                
            value = token.value;
            valueIndex = value.length - 1;
        }
        
        return null;
    };

    /**
     *
     * @param {string} bracket
     * @param {Point} position
     * @param {RegExp} [typeRe]
     * @return {Point|null}
     * @this {EditSession}
     */
    this.$findClosingBracket = function(bracket, position, typeRe) {
        var closingBracket = this.$brackets[bracket];
        var depth = 1;

        var iterator = new TokenIterator(this, position.row, position.column);
        var token = iterator.getCurrentToken();
        if (!token)
            token = iterator.stepForward();
        if (!token)
            return;

        if (!typeRe){
            typeRe = new RegExp(
                "(\\.?" +
                token.type.replace(".", "\\.").replace("lparen", ".paren")
                    .replace(/\b(?:start|begin)\b/, "(?:start|begin|end)")
                    .replace(/-open\b/, "-(close|open)")
                + ")+"
            );
        }

        // Start searching in token, after the character at position.column
        var valueIndex = position.column - iterator.getCurrentTokenColumn();

        while (true) {

            var value = token.value;
            var valueLength = value.length;
            while (valueIndex < valueLength) {
                var chr = value.charAt(valueIndex);
                if (chr == closingBracket) {
                    depth -= 1;
                    if (depth == 0) {
                        return {row: iterator.getCurrentTokenRow(),
                            column: valueIndex + iterator.getCurrentTokenColumn()};
                    }
                }
                else if (chr == bracket) {
                    depth += 1;
                }
                valueIndex += 1;
            }

            // Scan forward through the document, looking for the next token
            // whose type matches typeRe
            do {
                token = iterator.stepForward();
            } while (token && !typeRe.test(token.type));

            if (token == null)
                break;

            valueIndex = 0;
        }
        
        return null;
    };

    /**
     * Returns [[Range]]'s for matching tags and tag names, if there are any
     * @param {Point} pos
     * @returns {{closeTag: Range, closeTagName: Range, openTag: Range, openTagName: Range} | undefined}
     * @this {EditSession}
     */
    this.getMatchingTags = function (pos) {
        var iterator = new TokenIterator(this, pos.row, pos.column);
        var token = this.$findTagName(iterator);
        if (!token) return;

        var prevToken = iterator.stepBackward();

        if (prevToken.value === '<') {
            return this.$findClosingTag(iterator, token);
        }
        else {
            return this.$findOpeningTag(iterator, token);
        }
    };

    this.$findTagName = function (iterator) {
        var token = iterator.getCurrentToken();
        var found = false;
        var backward = false;
        if (token && token.type.indexOf('tag-name') === -1) {
            do {
                if (backward) token = iterator.stepBackward(); else token = iterator.stepForward();
                if (token) {
                    if (token.value === "/>") {
                        //changing iterator direction for self-closing tags, when cursor is in between tag
                        //name and tag closing
                        backward = true;
                    }
                    else if (token.type.indexOf('tag-name') !== -1) {
                        found = true;
                    }
                }
            } while (token && !found);
        }
        return token;
    };

    this.$findClosingTag = function (iterator, token) {
        var prevToken;
        var currentTag = token.value;
        var tag = token.value;
        var depth = 0;

        var openTagStart = new Range(iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn(),
            iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() + 1
        );
        token = iterator.stepForward();
        var openTagName = new Range(iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn(),
            iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() + token.value.length
        );
        var foundOpenTagEnd = false;
        do {
            prevToken = token;
            if (prevToken.type.indexOf('tag-close') !== -1 && !foundOpenTagEnd) {
                var openTagEnd = new Range(iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn(),
                    iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() + 1
                ); //Range for `>`
                foundOpenTagEnd = true;
            }
            token = iterator.stepForward();
            if (token) {
                if (token.value === '>' && !foundOpenTagEnd) {
                    var openTagEnd = new Range(iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn(),
                        iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() + 1
                    ); //Range for `>`
                    foundOpenTagEnd = true;
                }
                if (token.type.indexOf('tag-name') !== -1) {
                    currentTag = token.value;
                    if (tag === currentTag) {
                        if (prevToken.value === '<') {
                            depth++;
                        }
                        else if (prevToken.value === '</') {
                            depth--;
                            if (depth < 0) {//found closing tag
                                iterator.stepBackward();
                                var closeTagStart = new Range(iterator.getCurrentTokenRow(),
                                    iterator.getCurrentTokenColumn(), iterator.getCurrentTokenRow(),
                                    iterator.getCurrentTokenColumn() + 2
                                ); //Range for </
                                token = iterator.stepForward();
                                var closeTagName = new Range(iterator.getCurrentTokenRow(),
                                    iterator.getCurrentTokenColumn(), iterator.getCurrentTokenRow(),
                                    iterator.getCurrentTokenColumn() + token.value.length
                                );
                                if (token.type.indexOf('tag-close') === -1) {
                                    token = iterator.stepForward();
                                }
                                if (token && token.value === '>') {
                                    var closeTagEnd = new Range(iterator.getCurrentTokenRow(),
                                        iterator.getCurrentTokenColumn(), iterator.getCurrentTokenRow(),
                                        iterator.getCurrentTokenColumn() + 1
                                    ); //Range for >
                                }
                                else {
                                    return;
                                }
                            }
                        }
                    }
                }
                else if (tag === currentTag && token.value === '/>') { // self-closing tag
                    depth--;
                    if (depth < 0) {//found self-closing tag end
                        //Example: <tagName attr/>
                        //`<tagName ` - opening part of tag consist of `openTagStart`, `openTagName` and `openTagEnd`
                        //`/>` - closing part of tag consist of `closeTagStart`, `closeTagName` and `closeTagEnd`
                        var closeTagStart = new Range(iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn(),
                            iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() + 2
                        );
                        var closeTagName = closeTagStart;
                        var closeTagEnd = closeTagName;

                        var openTagEnd = new Range(openTagName.end.row, openTagName.end.column, openTagName.end.row,
                            openTagName.end.column + 1
                        );

                    }
                }
            }
        } while (token && depth >= 0);

        if (openTagStart && openTagEnd && closeTagStart && closeTagEnd && openTagName && closeTagName) {
            return {
                openTag: new Range(openTagStart.start.row, openTagStart.start.column, openTagEnd.end.row,
                    openTagEnd.end.column
                ),
                closeTag: new Range(closeTagStart.start.row, closeTagStart.start.column, closeTagEnd.end.row,
                    closeTagEnd.end.column
                ),
                openTagName: openTagName,
                closeTagName: closeTagName
            };
        }
    };

    this.$findOpeningTag = function (iterator, token) {
        var prevToken = iterator.getCurrentToken();
        var tag = token.value;
        var depth = 0;

        var startRow = iterator.getCurrentTokenRow();
        var startColumn = iterator.getCurrentTokenColumn();
        var endColumn = startColumn + 2;

        //closing tag
        var closeTagStart = new Range(startRow, startColumn, startRow, endColumn); //Range for </
        iterator.stepForward();
        var closeTagName = new Range(iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn(),
            iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() + token.value.length
        );

        if (token.type.indexOf('tag-close') === -1) {
            token = iterator.stepForward();
        }
        if (!token || token.value !== ">") return;
        var closeTagEnd = new Range(iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn(),
            iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() + 1
        ); //Range for >

        iterator.stepBackward();
        iterator.stepBackward();
        do {
            token = prevToken;
            startRow = iterator.getCurrentTokenRow();
            startColumn = iterator.getCurrentTokenColumn();
            endColumn = startColumn + token.value.length;

            prevToken = iterator.stepBackward();

            if (token) {
                if (token.type.indexOf('tag-name') !== -1) {
                    if (tag === token.value) {
                        if (prevToken.value === '<') {
                            depth++;
                            if (depth > 0) {//found opening tag
                                var openTagName = new Range(startRow, startColumn, startRow, endColumn);
                                var openTagStart = new Range(iterator.getCurrentTokenRow(),
                                    iterator.getCurrentTokenColumn(), iterator.getCurrentTokenRow(),
                                    iterator.getCurrentTokenColumn() + 1
                                ); //Range for <
                                do {
                                    token = iterator.stepForward();
                                } while (token && token.value !== '>');
                                var openTagEnd = new Range(iterator.getCurrentTokenRow(),
                                    iterator.getCurrentTokenColumn(), iterator.getCurrentTokenRow(),
                                    iterator.getCurrentTokenColumn() + 1
                                ); //Range for >
                            }
                        }
                        else if (prevToken.value === '</') {
                            depth--;
                        }
                    }
                }
                else if (token.value === '/>') { // self-closing tag
                    var stepCount = 0;
                    var tmpToken = prevToken;
                    while (tmpToken) {
                        if (tmpToken.type.indexOf('tag-name') !== -1 && tmpToken.value === tag) {
                            depth--;
                            break;
                        }
                        else if (tmpToken.value === '<') {
                            break;
                        }
                        tmpToken = iterator.stepBackward();
                        stepCount++;
                    }
                    for (var i = 0; i < stepCount; i++) {
                        iterator.stepForward();
                    }
                }
            }
        } while (prevToken && depth <= 0);

        if (openTagStart && openTagEnd && closeTagStart && closeTagEnd && openTagName && closeTagName) {
            return {
                openTag: new Range(openTagStart.start.row, openTagStart.start.column, openTagEnd.end.row,
                    openTagEnd.end.column
                ),
                closeTag: new Range(closeTagStart.start.row, closeTagStart.start.column, closeTagEnd.end.row,
                    closeTagEnd.end.column
                ),
                openTagName: openTagName,
                closeTagName: closeTagName
            };
        }
    };
}
exports.BracketMatch = BracketMatch;
