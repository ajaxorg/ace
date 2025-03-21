"use strict";

var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var BaseFoldMode = require("./fold_mode").FoldMode;
var TokenIterator = require("../../token_iterator").TokenIterator;

var FoldMode = exports.FoldMode = function() {};
oop.inherits(FoldMode, BaseFoldMode);

(function () {

    // regular expressions that identify starting and stopping points
    this.foldingStartMarker = /\b(rule|declare|query|when|then)\b/;
    this.foldingStopMarker = /\bend\b/;
    this.importRegex = /^import /;
    this.globalRegex = /^global /;
    this.getBaseFoldWidget = this.getFoldWidget;

    this.getFoldWidget = function (session, foldStyle, row) {
        if (foldStyle === "markbegin") {
            var line = session.getLine(row);
            if (this.importRegex.test(line)) {
                if (row === 0 || !this.importRegex.test(session.getLine(row - 1)))
                    return "start";
            }
            if (this.globalRegex.test(line)) {
                if (row === 0 || !this.globalRegex.test(session.getLine(row - 1)))
                    return "start";
            }
        }

        return this.getBaseFoldWidget(session, foldStyle, row);
    };

    this.getFoldWidgetRange = function (session, foldStyle, row) {
        var line = session.getLine(row);
        var match = line.match(this.foldingStartMarker);

        if (match) {
            if (match[1]) {
                var position = {row: row, column: line.length};
                var iterator = new TokenIterator(session, position.row, position.column);
                var seek = "end";
                var token = iterator.getCurrentToken();
                if (token.value == "when") {
                    seek = "then";
                }
                while (token) {
                    if (token.value == seek) {
                        return Range.fromPoints(position ,{
                            row: iterator.getCurrentTokenRow(),
                            column: iterator.getCurrentTokenColumn()
                        });
                    }
                    token = iterator.stepForward();
                }
            }

        }
        match = line.match(this.importRegex);
        if (match) {
            return getMatchedFoldRange(session, this.importRegex, match, row);
        }
        match = line.match(this.globalRegex);
        if (match) {
            return getMatchedFoldRange(session, this.globalRegex, match, row);
        }
        // test each line, and return a range of segments to collapse
    };

}).call(FoldMode.prototype);

function getMatchedFoldRange(session, regex, match, row) {
    let startColumn = match[0].length;
    let maxRow = session.getLength();
    let startRow = row;
    let endRow = row;

    while (++row < maxRow) {
        let line = session.getLine(row);
        if (line.match(/^\s*$/))
            continue;

        if (!line.match(regex))
            break;

        endRow = row;
    }

    if (endRow > startRow) {
        let endColumn = session.getLine(endRow).length;
        return new Range(startRow, startColumn, endRow, endColumn);
    }
}
