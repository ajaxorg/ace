ace.provide("ace.Search");

ace.Search = function() {
    this.$options = {
        needle: "",
        backwards: false,
        wrap: false,
        caseSensitive: false,
        wholeWord: false
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

    this.$findForward = function(doc) {
        var start = doc.getSelection().getCursor();
        var row = start.row;
        var column = start.column;

        var startRow = row;

        var line = doc.getLine(row);
        var wrapped = false;

        var re = this.$assembleRegExp();
        re.lastIndex = column;

        do {
            var match = re.exec(line);
            if (!match) {
                if (row == startRow && wrapped) {
                    return null;
                }

                row++;

                if (row >= doc.getLength()) {
                    if (this.$options.wrap) {
                        row = 0;
                        wrapped = true;
                    } else {
                        return null;
                    }
                }

                line = doc.getLine(row);
                re.lastIndex = 0;
            }
        } while(!match);

        var range = {
            start: {
                row: row,
                column: match.index
            },
            end: {
                row: row,
                column: match.index + match[0].length
            }
        };
        return range;
    };

    this.$findBackward = function(doc) {
        var start = doc.getSelection().getRange().start;
        var row = start.row;
        var column = start.column;

        var startRow = row;

        var line = doc.getLine(row).substring(0, column);
        var wrapped = false;

        var re = this.$assembleRegExp();

        var found = false;
        var lastOffset = 0;
        var match = "";

        do {
            line.replace(re, function(str, offset) {
                match = str;
                found = true;
                lastOffset = offset;
                return str;
            });

            if (!found) {
                if (row == startRow && wrapped) {
                    return null;
                }

                row--;

                if (row < 0) {
                    if (this.$options.wrap) {
                        row = doc.getLength() - 1;
                        wrapped = true;
                    } else {
                        return null;
                    }
                }

                line = doc.getLine(row);
            }
        } while(!found);

        var range = {
            start: {
                row: row,
                column: lastOffset
            },
            end: {
                row: row,
                column: lastOffset + match.length
            }
        };
        return range;
    };

}).call(ace.Search.prototype);