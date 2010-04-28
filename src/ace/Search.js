ace.provide("ace.Search");

ace.Search = function() {
    this.$options = {
        needle: "",
        backwards: false,
        wrap: false,
        caseSensitive: false,
        wholeWord: false,
        scope: ace.Search.ALL
    };
};

ace.Search.ALL = 1;
ace.Search.SELECTION = 2;

(function() {

    this.set = function(options) {
        ace.mixin(this.$options, options);
        return this;
    };

    this.find = function(doc) {
        var needle = this.$options.needle;
        if (!this.$options.needle)
            return null;

        if (this.$options.backwards) {
            return this.$findBackward(doc);
        } else {
            return this.$findForward(doc);
        }
    };

    this.$findForward = function(doc) {
        var re = this.$assembleRegExp();
        var match = null;
        var matchedRow = -1;

        this.$forwardLineIterator(doc).forEach(function(line, startIndex, row) {
            re.lastIndex = startIndex;
            match = re.exec(line);

            if (match) {
                matchedRow = row;
                return true;
            }
        });

        if (!match)
            return null;

        return this.$rangeFromMatch(matchedRow, match.index, match[0].length);
    };

    this.$findBackward = function(doc) {
        var re = this.$assembleRegExp();

        var found = false;
        var lastOffset = 0;
        var lastRow = -1;
        var match = "";

        this.$backwardLineIterator(doc).forEach(function(line, startIndex, row) {
            if (startIndex) {
                line = line.substring(startIndex);
            }
            line.replace(re, function(str, offset) {
                match = str;
                found = true;
                lastOffset = startIndex + offset;
                lastRow = row;
                return str;
            });

            if (found) return true;
        });

        if (!found) {
            return null;
        }

        return this.$rangeFromMatch(lastRow, lastOffset, match.length);
    };

    this.$rangeFromMatch = function(row, column, length) {
        var range = {
            start: {
                row: row,
                column: column
            },
            end: {
                row: row,
                column: column + length
            }
        };
        return range;
    };

    this.$assembleRegExp = function() {
        var needle = ace.escapeRegExp(this.$options.needle);
        if (this.$options.wholeWord) {
            needle = "\\b" + needle + "\\b";
        }

        var modifier = "g";
        if (this.$options.caseSensitive) {
            modifier += "i";
        }

        var re = new RegExp(needle, modifier);
        return re;
    };

    this.$forwardLineIterator = function(doc) {
        var searchSelection = this.$options.scope == ace.Search.SELECTION;

        var range = doc.getSelection().getRange();
        var start = doc.getSelection().getCursor();

        var firstRow = searchSelection ? range.start.row : 0;
        var firstColumn = searchSelection ? range.start.column : 0;
        var lastRow = searchSelection ? range.end.row : doc.getLength() - 1;

        var wrap = this.$options.wrap;

        function getLine(row) {
            var line = doc.getLine(row);
            if (searchSelection && row == range.end.row) {
                line = line.substring(0, range.end.column);
            }
            return line;
        }

        return {
            forEach: function(callback) {
                var row = start.row;

                var line = getLine(row);
                startIndex = start.column;

                var stop = false;

                while (!callback(line, startIndex, row)) {

                    if (stop) {
                        return;
                    }

                    row++;
                    startIndex = 0;

                    if (row > lastRow) {
                        if (wrap) {
                            row = firstRow;
                            startIndex = firstColumn;
                        } else {
                            return;
                        }
                    }

                    if (row == start.row)
                        stop = true;

                    var line = getLine(row);
                }
            }
        };
    };

    this.$backwardLineIterator = function(doc) {
        var searchSelection = this.$options.scope == ace.Search.SELECTION;

        var range = doc.getSelection().getRange();
        var start = searchSelection ? range.end : range.start;

        var firstRow = searchSelection ? range.start.row : 0;
        var firstColumn = searchSelection ? range.start.column : 0;
        var lastRow = searchSelection ? range.end.row : doc.getLength() - 1;

        var wrap = this.$options.wrap;

        return {
            forEach : function(callback) {
                var row = start.row;

                var line = doc.getLine(row).substring(0, start.column);
                var startIndex = 0;
                var stop = false;

                while (!callback(line, startIndex, row)) {

                    if (stop)
                        return;

                    row--;
                    var startIndex = 0;

                    if (row < firstRow) {
                        if (wrap) {
                            row = lastRow;
                        } else {
                            return;
                        }
                    }

                    if (row == start.row)
                        stop = true;

                    line = doc.getLine(row);
                    if (searchSelection) {
                        if (row == firstRow)
                            startIndex = firstColumn;
                        else if (row == lastRow)
                            line = line.substring(0, range.end.column);
                    }
                }
            }
        };
    };

}).call(ace.Search.prototype);