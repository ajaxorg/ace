define(function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var CStyleFoldMode = require("./cstyle").FoldMode;
var Range = require("../../range").Range;

var FoldMode = exports.FoldMode = function() {};
oop.inherits(FoldMode, CStyleFoldMode);

(function() {
    this.importStartLine = null;
    this.importRegex = /^import .*/;

    this.getFoldWidget = function(session, foldStyle, row) {
        if(foldStyle !== "markbegin")
            return;

        if(row === 0)
            this.importStartLine = null;

        var line = session.getLine(row);
        if (this.importStartLine === null && this.importRegex.test(line)) {
            this.importStartLine = row;
            return "start";
        }

        return CStyleFoldMode.prototype.getFoldWidget.call(this, session, foldStyle, row);
    };

    this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
        var line = session.getLine(row);
        var match = line.match(this.importRegex);
        if(! match || foldStyle !== "markbegin") {
            return CStyleFoldMode.prototype.getFoldWidgetRange.call(this, session, foldStyle, row, forceMultiline);
        }

        var startColumn = 6; // Import Word Length (To show the Import word before the folding)
        var maxRow = session.getLength();
        var startRow = row;
        var endRow = row;

        while (++row < maxRow) {
            var line = session.getLine(row);
            if(line.match(/^\s*$/))
                continue;

            if(!line.match(this.importRegex))
                break;

            endRow = row;
        }

        if (endRow > startRow) {
            var endColumn = session.getLine(endRow).length;
            return new Range(startRow, startColumn, endRow, endColumn);
        }
    }

}).call(FoldMode.prototype);

});
