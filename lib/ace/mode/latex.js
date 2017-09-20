define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var LatexHighlightRules = require("./latex_highlight_rules").LatexHighlightRules;
var CstyleBehaviour = require("./behaviour/cstyle").CstyleBehaviour;
var LatexFoldMode = require("./folding/latex").FoldMode;

var Mode = function() {
    this.HighlightRules = LatexHighlightRules;
    this.foldingRules = new LatexFoldMode();
    this.$behaviour = new CstyleBehaviour({ braces: true });
};
oop.inherits(Mode, TextMode);

(function() {
    this.type = "text";
    
    this.lineCommentStart = "%";

    this.$id = "ace/mode/latex";
    
    this.getMatching = function(session, row, column) {
        if (row == undefined)
            row = session.selection.lead;
        if (typeof row == "object") {
            column = row.column;
            row = row.row;
        }

        var startToken = session.getTokenAt(row, column);
        if (!startToken)
            return;
        if (startToken.value == "\\begin" || startToken.value == "\\end") {
            return this.foldingRules.latexBlock(session, row, column, true);
        }
    };
}).call(Mode.prototype);

exports.Mode = Mode;

});
