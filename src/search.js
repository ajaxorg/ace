"use strict";
/**
 * @typedef {import("./edit_session").EditSession} EditSession
 */
var lang = require("./lib/lang");
var oop = require("./lib/oop");
var Range = require("./range").Range;

/**
 * A class designed to handle all sorts of text searches within a [[Document `Document`]].
 **/
class Search {
    /**
     * Creates a new `Search` object. The following search options are available:
     * @typedef SearchOptions
     * 
     * @property {string|RegExp} [needle] - The string or regular expression you're looking for
     * @property {boolean} [backwards] - Whether to search backwards from where cursor currently is
     * @property {boolean} [wrap] - Whether to wrap the search back to the beginning when it hits the end
     * @property {boolean} [caseSensitive] - Whether the search ought to be case-sensitive
     * @property {boolean} [wholeWord] - Whether the search matches only on whole words
     * @property {Range|null} [range] - The [[Range]] to search within. Set this to `null` for the whole document
     * @property {boolean} [regExp] - Whether the search is a regular expression or not
     * @property {Range|import("../ace-internal").Ace.Position} [start] - The starting [[Range]] or cursor position to begin the search
     * @property {boolean} [skipCurrent] - Whether or not to include the current line in the search
     * @property {boolean} [$isMultiLine] - true, if needle has \n or \r\n
     * @property {boolean} [preserveCase]
     * @property {boolean} [preventScroll]
     * @property {boolean} [$supportsUnicodeFlag] - internal property, determine if browser supports unicode flag
     * @property {any} [re]
     **/
    
    constructor() {
        /**@type {SearchOptions}*/
        this.$options = {};
    }
    
    /**
     * Sets the search options via the `options` parameter.
     * @param {Partial<import("../ace-internal").Ace.SearchOptions>} options An object containing all the new search properties
     * @returns {Search}
     * @chainable
    **/
    set(options) {
        oop.mixin(this.$options, options);
        return this;
    }

    /**
     * [Returns an object containing all the search options.]{: #Search.getOptions}
     * @returns {Partial<import("../ace-internal").Ace.SearchOptions>}
    **/
    getOptions() {
        return lang.copyObject(this.$options);
    }
    
    /**
     * Sets the search options via the `options` parameter.
     * @param {SearchOptions} options object containing all the search propertie
     * @related Search.set
    **/
    setOptions(options) {
        this.$options = options;
    }

    /**
     * Searches for `options.needle`. If found, this method returns the [[Range `Range`]] where the text first occurs. If `options.backwards` is `true`, the search goes backwards in the session.
     * @param {EditSession} session The session to search with
     * @returns {Range|false}
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
            for (var i = 0; i < lines.length; i++) {
                var matches = lang.getMatchOffsets(lines[i], re);
                for (var j = 0; j < matches.length; j++) {
                    var match = matches[j];
                    ranges.push(new Range(i, match.offset, i, match.offset + match.length));
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

        var match = re.exec(input);
        if (!match || match[0].length != input.length)
            return null;
        if (!options.regExp) {
            replacement = replacement.replace(/\$/g, "$$$$");
        }
        
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
     * @param {SearchOptions} options
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

    /**
     * @param {EditSession} session
     */
    $matchIterator(session, options) {
        var re = this.$assembleRegExp(options);
        if (!re)
            return false;
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
            };
        }
        else {
            var forEachInLine = function(row, startIndex, callback) {
                var line = session.getLine(row);
                var last;
                var m;
                re.lastIndex = startIndex;
                while((m = re.exec(line))) {
                    var length = m[0].length;
                    last = m.index;
                    if (callback(row, last, row,last + length))
                        return true;
                    if (!length) {
                        re.lastIndex = last += lang.skipEmptyMatch(line, last, supportsUnicodeFlag);
                        if (last >= line.length) return false;
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
 * @param {SearchOptions} options
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

exports.Search = Search;
