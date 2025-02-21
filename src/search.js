"use strict";
/**
 * @typedef {import("./edit_session").EditSession} EditSession
 * @typedef {import("../ace-internal").Ace.SearchOptions} SearchOptions
 */
var lang = require("./lib/lang");
var oop = require("./lib/oop");
var Range = require("./range").Range;

/**
 * A class designed to handle all sorts of text searches within a [[Document `Document`]].
 **/
class Search {

    constructor() {
        /**@type {Partial<SearchOptions>}*/
        this.$options = {};
    }

    /**
     * Sets the search options via the `options` parameter.
     * @param {Partial<SearchOptions>} options An object containing all the new search properties
     * @returns {Search}
     * @chainable
    **/
    set(options) {
        oop.mixin(this.$options, options);
        return this;
    }

    /**
     * [Returns an object containing all the search options.]{: #Search.getOptions}
     * @returns {Partial<SearchOptions>}
    **/
    getOptions() {
        return lang.copyObject(this.$options);
    }

    /**
     * Sets the search options via the `options` parameter.
     * @param {Partial<SearchOptions>} options object containing all the search propertie
     * @related Search.set
    **/
    setOptions(options) {
        this.$options = options;
    }

    /**
     * Searches for `options.needle`. If found, this method returns the [[Range `Range`]] where the text first occurs. If `options.backwards` is `true`, the search goes backwards in the session.
     * @param {EditSession} session The session to search with
     * @returns {Range | null | false}
     **/
    find(session) {
        var options = this.$options;
        var iterator = this.$matchIterator(session, options);
        if (!iterator)
            return false;

        var firstRange = null;
        iterator.forEach(function(sr, sc, er, ec) {
            firstRange = new Range(sr, sc, er, ec);
            if (sc == ec && options.start && /**@type{Range}*/(options.start).start
                && options.skipCurrent != false && firstRange.isEqual(/**@type{Range}*/(options.start))
            ) {
                firstRange = null;
                return false;
            }

            return true;
        });

        return firstRange;
    }

    /**
     * Searches for all occurrances `options.needle`. If found, this method returns an array of [[Range `Range`s]] where the text first occurs. If `options.backwards` is `true`, the search goes backwards in the session.
     * @param {EditSession} session The session to search with
     * @returns {Range[]}
    **/
    findAll(session) {
        var options = this.$options;
        if (!options.needle)
            return [];
        this.$assembleRegExp(options);

        var range = options.range;
        var lines = range
            ? session.getLines(range.start.row, range.end.row)
            : session.doc.getAllLines();

        var ranges = [];
        var re = options.re;
        if (options.$isMultiLine) {
            var len = re.length;
            var maxRow = lines.length - len;
            var prevRange;
            outer: for (var row = re.offset || 0; row <= maxRow; row++) {
                for (var j = 0; j < len; j++)
                    if (lines[row + j].search(re[j]) == -1)
                        continue outer;

                var startLine = lines[row];
                var line = lines[row + len - 1];
                var startIndex = startLine.length - startLine.match(re[0])[0].length;
                var endIndex = line.match(re[len - 1])[0].length;

                if (prevRange && prevRange.end.row === row &&
                    prevRange.end.column > startIndex
                ) {
                    continue;
                }
                ranges.push(prevRange = new Range(
                    row, startIndex, row + len - 1, endIndex
                ));
                if (len > 2)
                    row = row + len - 2;
            }
        } else {
            for (var matches, i = 0; i < lines.length; i++) {
                if (this.$isMultilineSearch(options)) {
                    var lng = lines.length - 1;
                    matches = this.$multiLineForward(session, re, i, lng);
                    if (matches) {
                        var end_row = matches.endRow <= lng ? matches.endRow - 1 : lng;
                        if (end_row > i)
                            i = end_row;
                        ranges.push(new Range(matches.startRow, matches.startCol, matches.endRow, matches.endCol));
                    }
                }
                else {
                    matches = lang.getMatchOffsets(lines[i], re);
                    for (var j = 0; j < matches.length; j++) {
                        var match = matches[j];
                        ranges.push(new Range(i, match.offset, i, match.offset + match.length));
                    }
                }
            }
        }

        if (range) {
            var startColumn = range.start.column;
            var endColumn = range.end.column;
            var i = 0, j = ranges.length - 1;
            while (i < j && ranges[i].start.column < startColumn && ranges[i].start.row == 0)
                i++;

            var endRow = range.end.row - range.start.row;
            while (i < j && ranges[j].end.column > endColumn && ranges[j].end.row == endRow)
                j--;

            ranges = ranges.slice(i, j + 1);
            for (i = 0, j = ranges.length; i < j; i++) {
                ranges[i].start.row += range.start.row;
                ranges[i].end.row += range.start.row;
            }
        }

        return ranges;
    }

    parseReplaceString(replaceString) {
        var CharCode = {
            DollarSign: 36,
            Ampersand: 38,
            Digit0: 48,
            Digit1: 49,
            Digit9: 57,
            Backslash: 92,
            n: 110,
            t: 116
        };

        var replacement = '';
        for (var i = 0, len = replaceString.length; i < len; i++) {
            var chCode = replaceString.charCodeAt(i);
            if (chCode === CharCode.Backslash) {
                // move to next char
                i++;
                if (i >= len) {
                    // string ends with a \
                    replacement += "\\";
                    break;
                }
                var nextChCode = replaceString.charCodeAt(i);
                switch (nextChCode) {
                    case CharCode.Backslash:
                        // \\ => inserts a "\"
                        replacement += "\\";
                        break;
                    case CharCode.n:
                        // \n => inserts a LF
                        replacement += "\n";
                        break;
                    case CharCode.t:
                        // \t => inserts a TAB
                        replacement += "\t";
                        break;
                }
                continue;
            }

            if (chCode === CharCode.DollarSign) {
                // move to next char
                i++;
                if (i >= len) {
                    // string ends with a $
                    replacement += "$";
                    break;
                }
                const nextChCode = replaceString.charCodeAt(i);
                if (nextChCode === CharCode.DollarSign) {
                    // $$ => inserts a "$"
                    replacement += "$$";
                    continue;
                }
                if (nextChCode === CharCode.Digit0 || nextChCode === CharCode.Ampersand) {
                    // replace $0 to $&, making it compatible with JavaScript
                    // $0 and $& => inserts the matched substring.
                    replacement += "$&";
                    continue;
                }
                if (CharCode.Digit1 <= nextChCode && nextChCode <= CharCode.Digit9) {
                    // $n
                    replacement += "$" + replaceString[i];
                    continue;
                }
            }

            replacement += replaceString[i];
        }
        return replacement || replaceString;
    }

    /**
     * Searches for `options.needle` in `input`, and, if found, replaces it with `replacement`.
     * @param {String} input The text to search in
     * @param {any} replacement The replacing text
     * + (String): If `options.regExp` is `true`, this function returns `input` with the replacement already made. Otherwise, this function just returns `replacement`.<br/>
     * If `options.needle` was not found, this function returns `null`.
     *
     *
     * @returns {String}
    **/
    replace(input, replacement) {
        var options = this.$options;

        var re = this.$assembleRegExp(options);
        if (options.$isMultiLine)
            return replacement;

        if (!re)
            return;

        /**
         * Convert all line ending variations to Unix-style = \n
         * Windows (\r\n), MacOS Classic (\r), and Unix (\n)
         */
        var mtSearch = this.$isMultilineSearch(options);
        if (mtSearch)
            input = input.replace(/\r\n|\r|\n/g, "\n");

        var match = re.exec(input);
        if (!match || (!mtSearch && match[0].length != input.length))
            return null;

        replacement = options.regExp
            ? this.parseReplaceString(replacement)
            : replacement.replace(/\$/g, "$$$$");

        replacement = input.replace(re, replacement);
        if (options.preserveCase) {
            replacement = replacement.split("");
            for (var i = Math.min(input.length, input.length); i--; ) {
                var ch = input[i];
                if (ch && ch.toLowerCase() != ch)
                    replacement[i] = replacement[i].toUpperCase();
                else
                    replacement[i] = replacement[i].toLowerCase();
            }
            replacement = replacement.join("");
        }

        return replacement;
    }

    /**
     *
     * @param {Partial<SearchOptions>} options
     * @param {boolean} [$disableFakeMultiline]
     * @return {RegExp|boolean|*[]|*}
     */
    $assembleRegExp(options, $disableFakeMultiline) {
        if (options.needle instanceof RegExp)
            return options.re = options.needle;

        var needle = options.needle;

        if (!options.needle)
            return options.re = false;

        if (!options.regExp)
            needle = lang.escapeRegExp(needle);

        var modifier = options.caseSensitive ? "gm" : "gmi";

        try {
            new RegExp(needle, "u");
            options.$supportsUnicodeFlag = true;
            modifier += "u";
        } catch (e) {
            options.$supportsUnicodeFlag = false; //left for backward compatibility with previous versions for cases like /ab\{2}/gu
        }

        if (options.wholeWord)
            needle = addWordBoundary(needle, options);

        options.$isMultiLine = !$disableFakeMultiline && /[\n\r]/.test(needle);
        if (options.$isMultiLine)
            return options.re = this.$assembleMultilineRegExp(needle, modifier);

        try {
            /**@type {RegExp|false}*/
            var re = new RegExp(needle, modifier);
        } catch(e) {
            re = false;
        }
        return options.re = re;
    }

    /**
     * @param {string} needle
     * @param {string} modifier
     */
    $assembleMultilineRegExp(needle, modifier) {
        var parts = needle.replace(/\r\n|\r|\n/g, "$\n^").split("\n");
        var re = [];
        for (var i = 0; i < parts.length; i++) try {
            re.push(new RegExp(parts[i], modifier));
        } catch(e) {
            return false;
        }
        return re;
    }

    $isMultilineSearch(options) {
        return options.re && /\\r\\n|\\r|\\n/.test(options.re.source) && options.regExp && !options.$isMultiLine;
    }

    $multiLineForward(session, re, start, last) {
        var line,
            chunk = chunkEnd(session, start);

        for (var row = start; row <= last;) {
            for (var i = 0; i < chunk; i++) {
                if (row > last)
                    break;
                var next = session.getLine(row++);
                line = line == null ? next : line + "\n" + next;
            }

            var match = re.exec(line);
            re.lastIndex = 0;
            if (match) {
                var beforeMatch = line.slice(0, match.index).split("\n");
                var matchedText = match[0].split("\n");
                var startRow = start + beforeMatch.length - 1;
                var startCol = beforeMatch[beforeMatch.length - 1].length;
                var endRow = startRow + matchedText.length - 1;
                var endCol = matchedText.length == 1
                    ? startCol + matchedText[0].length
                    : matchedText[matchedText.length - 1].length;

                return {
                    startRow: startRow,
                    startCol: startCol,
                    endRow: endRow,
                    endCol: endCol
                };
            }
        }
        return null;
    }

    $multiLineBackward(session, re, endIndex, start, first) {
        var line,
            chunk = chunkEnd(session, start),
            endMargin = session.getLine(start).length - endIndex;

        for (var row = start; row >= first;) {
            for (var i = 0; i < chunk && row >= first; i++) {
                var next = session.getLine(row--);
                line = line == null ? next : next + "\n" + line;
            }

            var match = multiLineBackwardMatch(line, re, endMargin);
            if (match) {
                var beforeMatch = line.slice(0, match.index).split("\n");
                var matchedText = match[0].split("\n");
                var startRow = row + beforeMatch.length;
                var startCol = beforeMatch[beforeMatch.length - 1].length;
                var endRow = startRow + matchedText.length - 1;
                var endCol = matchedText.length == 1
                    ? startCol + matchedText[0].length
                    : matchedText[matchedText.length - 1].length;

                return {
                    startRow: startRow,
                    startCol: startCol,
                    endRow: endRow,
                    endCol: endCol
                };
            }
        }
        return null;
    }

    /**
     * @param {EditSession} session
     */
    $matchIterator(session, options) {
        var re = this.$assembleRegExp(options);
        if (!re)
            return false;

        var mtSearch = this.$isMultilineSearch(options);
        var mtForward = this.$multiLineForward;
        var mtBackward = this.$multiLineBackward;

        var backwards = options.backwards == true;
        var skipCurrent = options.skipCurrent != false;
        var supportsUnicodeFlag = re.unicode;

        var range = options.range;
        var start = options.start;
        if (!start)
            start = range ? range[backwards ? "end" : "start"] : session.selection.getRange();

        if (start.start)
            start = start[skipCurrent != backwards ? "end" : "start"];

        var firstRow = range ? range.start.row : 0;
        var lastRow = range ? range.end.row : session.getLength() - 1;

        if (backwards) {
            var forEach = function(callback) {
                var row = start.row;
                if (forEachInLine(row, start.column, callback))
                    return;
                for (row--; row >= firstRow; row--)
                    if (forEachInLine(row, Number.MAX_VALUE, callback))
                        return;
                if (options.wrap == false)
                    return;
                for (row = lastRow, firstRow = start.row; row >= firstRow; row--)
                    if (forEachInLine(row, Number.MAX_VALUE, callback))
                        return;
            };
        }
        else {
            var forEach = function(callback) {
                var row = start.row;
                if (forEachInLine(row, start.column, callback))
                    return;
                for (row = row + 1; row <= lastRow; row++)
                    if (forEachInLine(row, 0, callback))
                        return;
                if (options.wrap == false)
                    return;
                for (row = firstRow, lastRow = start.row; row <= lastRow; row++)
                    if (forEachInLine(row, 0, callback))
                        return;
            };
        }

        if (options.$isMultiLine) {
            var len = re.length;
            var forEachInLine = function(row, offset, callback) {
                var startRow = backwards ? row - len + 1 : row;
                if (startRow < 0 || startRow + len > session.getLength()) return;
                var line = session.getLine(startRow);
                var startIndex = line.search(re[0]);
                if (!backwards && startIndex < offset || startIndex === -1) return;
                for (var i = 1; i < len; i++) {
                    line = session.getLine(startRow + i);
                    if (line.search(re[i]) == -1)
                        return;
                }
                var endIndex = line.match(re[len - 1])[0].length;
                if (backwards && endIndex > offset) return;
                if (callback(startRow, startIndex, startRow + len - 1, endIndex))
                    return true;
            };
        }
        else if (backwards) {
            var forEachInLine = function(row, endIndex, callback) {
                if (mtSearch) {
                    var pos = mtBackward(session, re, endIndex, row, firstRow);
                    if (!pos)
                        return false;
                    if (callback(pos.startRow, pos.startCol, pos.endRow, pos.endCol))
                        return true;
                }
                else {
                    var line = session.getLine(row);
                    var matches = [];
                    var m, last = 0;
                    re.lastIndex = 0;
                    while((m = re.exec(line))) {
                        var length = m[0].length;
                        last = m.index;
                        if (!length) {
                            if (last >= line.length) break;
                            re.lastIndex = last += lang.skipEmptyMatch(line, last, supportsUnicodeFlag);
                        }
                        if (m.index + length > endIndex)
                            break;
                        matches.push(m.index, length);
                    }
                    for (var i = matches.length - 1; i >= 0; i -= 2) {
                        var column = matches[i - 1];
                        var length = matches[i];
                        if (callback(row, column, row, column + length))
                            return true;
                    }
                }
            };
        }
        else {
            var forEachInLine = function(row, startIndex, callback) {
                re.lastIndex = startIndex;
                if (mtSearch) {
                    var pos = mtForward(session, re, row, lastRow);
                    if (pos) {
                        var end_row = pos.endRow <= lastRow ? pos.endRow - 1 : lastRow;
                        if (end_row > row)
                            row = end_row;
                    }
                    if (!pos)
                        return false;
                    if (callback(pos.startRow, pos.startCol, pos.endRow, pos.endCol))
                        return true;
                }
                else {
                    var line = session.getLine(row);
                    var last;
                    var m;
                    while((m = re.exec(line))) {
                        var length = m[0].length;
                        last = m.index;
                        if (callback(row, last, row, last + length))
                            return true;
                        if (!length) {
                            re.lastIndex = last += lang.skipEmptyMatch(line, last, supportsUnicodeFlag);
                            if (last >= line.length) return false;
                        }
                    }
                }
            };
        }
        return {forEach: forEach};
    }

}

/**
 *
 * @param {string} needle
 * @param {Partial<SearchOptions>} options
 * @return {string}
 */
function addWordBoundary(needle, options) {
    let supportsLookbehind = lang.supportsLookbehind();

    function wordBoundary(c, firstChar = true) {
        let wordRegExp = supportsLookbehind && options.$supportsUnicodeFlag ? new RegExp("[\\p{L}\\p{N}_]","u") : new RegExp("\\w");

        if (wordRegExp.test(c) || options.regExp) {
            if (supportsLookbehind && options.$supportsUnicodeFlag) {
                if (firstChar) return "(?<=^|[^\\p{L}\\p{N}_])";
                return "(?=[^\\p{L}\\p{N}_]|$)";
            }
            return "\\b";
        }
        return "";
    }

    let needleArray = Array.from(needle);
    let firstChar = needleArray[0];
    let lastChar = needleArray[needleArray.length - 1];

    return wordBoundary(firstChar) + needle + wordBoundary(lastChar, false);
}

function multiLineBackwardMatch(line, re, endMargin) {
    var match = null;
    var from = 0;
    while (from <= line.length) {
        re.lastIndex = from;
        var newMatch = re.exec(line);
        if (!newMatch)
            break;
        var end = newMatch.index + newMatch[0].length;
        if (end > line.length - endMargin)
            break;
        if (!match || end > match.index + match[0].length)
            match = newMatch;
        from = newMatch.index + 1;
    }
    return match;
}

function chunkEnd(session, start) {
    var base = 5000,
        startPosition = { row: start, column: 0 },
        startIndex = session.doc.positionToIndex(startPosition),
        targetIndex = startIndex + base,
        targetPosition = session.doc.indexToPosition(targetIndex),
        targetLine = targetPosition.row;
    return targetLine + 1;
}

exports.Search = Search;
