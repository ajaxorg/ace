/* vim:ts=4:sts=4:sw=4:
 * ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *      Mihai Sucan <mihai DOT sucan AT gmail DOT com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

var lang = require("./lib/lang");
var oop = require("./lib/oop");
var Range = require("./range").Range;

/**
 * class Search
 *
 * A class designed to handle all sorts of text searches within a [[Document `Document`]].
 *
 **/

/**
 * new Search()
 *
 * Creates a new `Search` object. The search options contain the following defaults:
 *
 * * `needle`: `""`
 * * `backwards`: `false`
 * * `wrap`: `false`
 * * `caseSensitive`: `false`
 * * `wholeWord`: `false`
 * * `scope`: `ALL`
 * * `regExp`: `false`
 *
**/

var Search = function() {
    this.$options = {
        needle: "",
        backwards: false,
        wrap: false,
        caseSensitive: false,
        wholeWord: false,
        scope: Search.ALL,
        regExp: false
    };
};

Search.ALL = 1;
Search.SELECTION = 2;

(function() {

    /**
     * Search.set(options) -> Search
     * - options (Object): An object containing all the new search properties
     *
     * Sets the search options via the `options` parameter.
     *
    **/
    this.set = function(options) {
        oop.mixin(this.$options, options);
        return this;
    };

    /**
     * Search.getOptions() -> Object
     *
     * [Returns an object containing all the search options.]{: #Search.getOptions}
     *
    **/
    this.getOptions = function() {
        return lang.copyObject(this.$options);
    };

    /**
     * Search.find(session) -> Range
     * - session (EditSession): The session to search with
     *
     * Searches for `options.needle`. If found, this method returns the [[Range `Range`]] where the text first occurs. If `options.backwards` is `true`, the search goes backwards in the session.
     *
    **/
    this.find = function(session) {
        if (!this.$options.needle)
            return null;

        var iterator = this.$matchIterator(session);

        if (!iterator)
            return false;

        var firstRange = null;
        iterator.forEach(function(range) {
            firstRange = range;
            return true;
        });

        return firstRange;
    };

    /**
     * Search.findAll(session) -> [Range]
     * - session (EditSession): The session to search with
     *
     * Searches for all occurances `options.needle`. If found, this method returns an array of [[Range `Range`s]] where the text first occurs. If `options.backwards` is `true`, the search goes backwards in the session.
     *
    **/
    this.findAll = function(session) {
        var options = this.$options;
        if (!options.needle)
            return [];

        var iterator = this.$matchIterator(session);

        if (!iterator)
            return false;

        var ignoreCursor = !options.start && options.wrap && options.scope == Search.ALL;
        if (ignoreCursor)
            options.start = {row: 0, column: 0};

        var ranges = [];
        iterator.forEach(function(range) {
            ranges.push(range);
        });

        if (ignoreCursor)
            options.start = null;

        return ranges;
    };

    /**
     * Search.replace(input, replacement) -> String
     * - input (String): The text to search in
     * - replacement (String): The replacing text
     * + (String): If `options.regExp` is `true`, this function returns `input` with the replacement already made. Otherwise, this function just returns `replacement`.<br/>
     * If `options.needle` was not found, this function returns `null`.
     *
     * Searches for `options.needle` in `input`, and, if found, replaces it with `replacement`.
     *
    **/
    this.replace = function(input, replacement) {
        if (!this.$options.regExp)
            return input == this.$options.needle ? replacement : null;
        
        var re = this.$assembleRegExp();
        if (!re)
            return;

        var match = re.exec(input);
        if (match && match[0].length == input.length) {
            return input.replace(re, replacement);
        } 
        else {
            return null;
        }
    };

    /** internal, hide
     * Search.$matchIterator(session) -> String | Boolean
     * - session (EditSession): The session to search with
     *
     *
     *
    **/
    this.$matchIterator = function(session) {
        var re = this.$assembleRegExp();
        if (!re)
            return false;

        var self = this, callback, backwards = this.$options.backwards;

        if (this.$options.$isMultiLine) {
            var matchIterator = function(line, startIndex, row) {
                var startLine = line;
                if (startIndex)
                    line = line.substring(startIndex);

                var len = re.length;
                var part = re[0];
                if (line.slice(-part.length) != part)
                    return;

                for (var i = 1; i < len - 1; i++)
                    if (re[i] != session.getLine(row + i))
                        return;

                part = re[len - 1];
                if (session.getLine(row + len - 1).slice(0, part.length) != part)
                    return;

                var range = new Range(
                    row, startLine.length - re[0].length,
                    row + len - 1, re[len - 1].length
                );
                if (callback(range))
                    return true;
            }
        } else if (backwards) {
            var matchIterator = function(line, startIndex, row) {
                if (startIndex)
                    line = line.substring(startIndex);

                var matches = [];

                line.replace(re, function(str) {
                    var offset = arguments[arguments.length-2];
                    matches.push({
                        str: str,
                        offset: startIndex + offset
                    });
                    return str;
                });

                for (var i=matches.length-1; i>= 0; i--) {
                    var match = matches[i];
                    var range = self.$rangeFromMatch(row, match.offset, match.str.length);
                    if (callback(range))
                        return true;
                }
            }
        } else {
            var matchIterator = function(line, startIndex, row) {
                if (startIndex)
                    line = line.substring(startIndex);

                var matches = [];

                line.replace(re, function(str) {
                    var offset = arguments[arguments.length-2];
                    matches.push({
                        str: str,
                        offset: startIndex + offset
                    });
                    return str;
                });

                for (var i=0; i<matches.length; i++) {
                    var match = matches[i];
                    var range = self.$rangeFromMatch(row, match.offset, match.str.length);
                    if (callback(range))
                        return true;
                }
            }
        }

        return {forEach: function(_callback) {
            callback = _callback;
            self.$lineIterator(session).forEach(matchIterator);
        }};
    };

    this.$rangeFromMatch = function(row, column, length) {
        return new Range(row, column, row, column+length);
    };

    this.$assembleRegExp = function() {
        if (typeof this.$options.needle != 'string')
            return this.$options.needle;

        var needle = this.$options.needle;

        if (!this.$options.regExp) {
            if (/[\n\r]/.test(needle)){
                this.$options.$isMultiLine = true;
                return needle.split(/\r\n|\r|\n/)
            }
            needle = lang.escapeRegExp(needle);
        }

        this.$options.$isMultiLine = false;

        if (this.$options.wholeWord) {
            needle = "\\b" + needle + "\\b";
        }

        var modifier = "g";
        if (!this.$options.caseSensitive) {
            modifier += "i";
        }

        try {
            var re = new RegExp(needle, modifier);
        }
        catch(e) {
            return false;
        }

        return re;
    };

    this.$lineIterator = function(session) {
        var searchSelection = this.$options.scope == Search.SELECTION;
        var backwards = this.$options.backwards;

        var range = this.$options.range || session.getSelection().getRange();
        var start = this.$options.start || range[searchSelection != backwards ? "start" : "end"];

        var firstRow = searchSelection ? range.start.row : 0;
        var firstColumn = searchSelection ? range.start.column : 0;
        var lastRow = searchSelection ? range.end.row : session.getLength() - 1;

        var wrap = this.$options.wrap;
        var inWrap = false;

        function getLine(row) {
            var line = session.getLine(row);
            if (searchSelection && row == range.end.row) {
                line = line.substring(0, range.end.column);
            }
            if (inWrap && row == start.row) {
                line = line.substring(0, start.column);
            }
            return line;
        }

        if (!backwards) {
            var forEach = function(callback) {
                var row = start.row;

                var line = getLine(row);
                var startIndex = start.column;

                var stop = false;
                inWrap = false;

                while (!callback(line, startIndex, row)) {
                    if (stop)
                        return;

                    row++;
                    startIndex = 0;

                    if (row > lastRow) {
                        if (wrap) {
                            row = firstRow;
                            startIndex = firstColumn;
                            inWrap = true;
                        } else {
                            return;
                        }
                    }

                    if (row == start.row)
                        stop = true;

                    line = getLine(row);
                }
            }
        } else {
            var forEach = function(callback) {
                var row = start.row;

                var line = session.getLine(row).substring(0, start.column);
                var startIndex = 0;
                var stop = false;
                var inWrap = false;

                while (!callback(line, startIndex, row)) {
                    if (stop)
                        return;

                    row--;
                    startIndex = 0;

                    if (row < firstRow) {
                        if (wrap) {
                            row = lastRow;
                            inWrap = true;
                        } else {
                            return;
                        }
                    }

                    if (row == start.row)
                        stop = true;

                    line = session.getLine(row);
                    if (searchSelection) {
                        if (row == firstRow)
                            startIndex = firstColumn;
                        else if (row == lastRow)
                            line = line.substring(0, range.end.column);
                    }

                    if (inWrap && row == start.row)
                        startIndex = start.column;
                }
            }
        }

        return {forEach: forEach};
    };

}).call(Search.prototype);

exports.Search = Search;
});
