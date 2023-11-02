"use strict";

var oop = require("../../lib/oop");
var CoffeeFoldMode = require("./coffee").FoldMode;
var Range = require("../../range").Range;

var FoldMode = exports.FoldMode = function() {};
oop.inherits(FoldMode, CoffeeFoldMode);

(function() {
    this.getFoldWidgetRange = function(session, foldStyle, row) {
        var re = /\S/;
        var line = session.getLine(row);
        var startLevel = line.search(re);
        var isCommentFold = line[startLevel] === "#";
        var isDashFold = line[startLevel] === "-";
        
        if (startLevel == -1)
            return;

        var startColumn = line.length;
        var maxRow = session.getLength();
        var startRow = row;
        var endRow = row;

        // Comment folding
        if (isCommentFold) {
            var range = this.commentBlock(session, row);
            if (range)
                return range;
        // Indentation folding (used for indentations that start with a '-').
        } else if (isDashFold) {
            var range = this.indentationBlock(session, row);
            if (range)
                return range;
        // List folding (used for indentations that don't start with a '-')..
        } else {
            while (++row < maxRow) {
                var line = session.getLine(row);
                var level = line.search(re);

                if (level == -1)
                    continue;

                if (level <= startLevel && line[startLevel] !== '-') {
                    var token = session.getTokenAt(row, 0);
                    if (!token || token.type !== "string")
                        break;
                }

                endRow = row;
            }
        }

        if (endRow > startRow) {
            var endColumn = session.getLine(endRow).length;
            return new Range(startRow, startColumn, endRow, endColumn);
        }
    };

    // must return "" if there's no fold, to enable caching
    this.getFoldWidget = function(session, foldStyle, row) {
        var line = session.getLine(row);
        var indent = line.search(/\S/);
        var next = session.getLine(row + 1);
        var prev = session.getLine(row - 1);
        var prevIndent = prev.search(/\S/);
        var nextIndent = next.search(/\S/);

        var lineStartsWithDash = line[indent] === '-';

        if (indent == -1) {
            session.foldWidgets[row - 1] = prevIndent!= -1 && prevIndent < nextIndent ? "start" : "";
            return "";
        }

        // documentation comments
        if (prevIndent == -1) {
            if (indent == nextIndent && line[indent] == "#" && next[indent] == "#") {
                session.foldWidgets[row - 1] = "";
                session.foldWidgets[row + 1] = "";
                return "start";
            }
        } else if (prevIndent == indent && line[indent] == "#" && prev[indent] == "#") {
            if (session.getLine(row - 2).search(/\S/) == -1) {
                session.foldWidgets[row - 1] = "start";
                session.foldWidgets[row + 1] = "";
                return "";
            }
        }

        // Indentation fold
        if (prevIndent!= -1 && prevIndent < indent) {
            session.foldWidgets[row - 1] = "start";
        // Fold non-indented list
        } else if (prevIndent!= -1 &&  (prevIndent == indent && lineStartsWithDash)) {
            session.foldWidgets[row - 1] = "start";
        } else {
            session.foldWidgets[row - 1] = "";
        }

        if (indent < nextIndent)
            return "start";
        else
            return "";
    };

}).call(FoldMode.prototype);
