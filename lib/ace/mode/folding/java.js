define(function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var CStyleFoldMode = require("./cstyle").FoldMode;
var Range = require("../../range").Range;

var FoldMode = exports.FoldMode = function() {};
oop.inherits(FoldMode, CStyleFoldMode);

(function() {
    this.importRegex = /^import /;
    this.getCStyleFoldWidget = this.getFoldWidget;
    this.getFoldWidget = function(session, foldStyle, row) {
        if (foldStyle === "markbegin") {
            var line = session.getLine(row);
            if (this.importRegex.test(line)) {
                if (row == 0 || !this.importRegex.test(session.getLine(row - 1)))
                    return "start";
            }
        }

        return this.getCStyleFoldWidget(session, foldStyle, row);
    };
    
    this.getCstyleFoldWidgetRange = this.getFoldWidgetRange;
    this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
        var line = session.getLine(row);
        var match = line.match(this.importRegex);
        if (!match || foldStyle !== "markbegin")
            return this.getCstyleFoldWidgetRange(session, foldStyle, row, forceMultiline);

        var startColumn = match[0].length;
        var maxRow = session.getLength();
        var startRow = row;
        var endRow = row;

        while (++row < maxRow) {
            var line = session.getLine(row);
            if (line.match(/^\s*$/))
                continue;

            if (!line.match(this.importRegex))
                break;

            endRow = row;
        }

        if (endRow > startRow) {
            var endColumn = session.getLine(endRow).length;
            return new Range(startRow, startColumn, endRow, endColumn);
        }
    };

}).call(FoldMode.prototype);

});
