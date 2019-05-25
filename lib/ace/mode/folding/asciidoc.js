"use strict";

var oop = require("../../lib/oop");
var BaseFoldMode = require("./fold_mode").FoldMode;
var Range = require("../../range").Range;

var FoldMode = exports.FoldMode = function() {};
oop.inherits(FoldMode, BaseFoldMode);

(function() {
    this.foldingStartMarker = /^(?:\|={10,}|[\.\/=\-~^+]{4,}\s*$|={1,5} )/;
    this.singleLineHeadingRe = /^={1,5}(?=\s+\S)/;

    this.getFoldWidget = function(session, foldStyle, row) {
        var line = session.getLine(row);
        if (!this.foldingStartMarker.test(line))
            return "";

        if (line[0] == "=") {
            if (this.singleLineHeadingRe.test(line))
                return "start";
            if (session.getLine(row - 1).length != session.getLine(row).length)
                return "";
            return "start";
        }
        if (session.bgTokenizer.getState(row) == "dissallowDelimitedBlock")
            return "end";
        return "start";
    };

    this.getFoldWidgetRange = function(session, foldStyle, row) {
        var line = session.getLine(row);
        var startColumn = line.length;
        var maxRow = session.getLength();
        var startRow = row;
        var endRow = row;
        if (!line.match(this.foldingStartMarker))
            return;

        var token;
        function getTokenType(row) {
            token = session.getTokens(row)[0];
            return token && token.type;
        }

        var levels = ["=","-","~","^","+"];
        var heading = "markup.heading";
        var singleLineHeadingRe = this.singleLineHeadingRe;
        function getLevel() {
            var match = token.value.match(singleLineHeadingRe);
            if (match)
                return match[0].length;
            var level = levels.indexOf(token.value[0]) + 1;
            if (level == 1) {
                if (session.getLine(row - 1).length != session.getLine(row).length)
                    return Infinity;
            }
            return level;
        }

        if (getTokenType(row) == heading) {
            var startHeadingLevel = getLevel();
            while (++row < maxRow) {
                if (getTokenType(row) != heading)
                    continue;
                var level = getLevel();
                if (level <= startHeadingLevel)
                    break;
            }

            var isSingleLineHeading = token && token.value.match(this.singleLineHeadingRe);
            endRow = isSingleLineHeading ? row - 1 : row - 2;

            if (endRow > startRow) {
                while (endRow > startRow && (!getTokenType(endRow) || token.value[0] == "["))
                    endRow--;
            }

            if (endRow > startRow) {
                var endColumn = session.getLine(endRow).length;
                return new Range(startRow, startColumn, endRow, endColumn);
            }
        } else {
            var state = session.bgTokenizer.getState(row);
            if (state == "dissallowDelimitedBlock") {
                while (row -- > 0) {
                    if (session.bgTokenizer.getState(row).lastIndexOf("Block") == -1)
                        break;
                }
                endRow = row + 1;
                if (endRow < startRow) {
                    var endColumn = session.getLine(row).length;
                    return new Range(endRow, 5, startRow, startColumn - 5);
                }
            } else {
                while (++row < maxRow) {
                    if (session.bgTokenizer.getState(row) == "dissallowDelimitedBlock")
                        break;
                }
                endRow = row;
                if (endRow > startRow) {
                    var endColumn = session.getLine(row).length;
                    return new Range(startRow, 5, endRow, endColumn - 5);
                }
            }
        }
    };

}).call(FoldMode.prototype);
