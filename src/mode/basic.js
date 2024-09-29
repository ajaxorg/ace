"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var BasicHighlightRules = require("./basic_highlight_rules").BasicHighlightRules;
var FoldMode = require("./folding/basic").FoldMode;

var Mode = function() {
    this.HighlightRules = BasicHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = this.$defaultBehaviour;
    this.indentKeywords = this.foldingRules.indentKeywords;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = ["REM"];

    this.getMatching = function(session, row, column, tokenRange) {
        if (row == undefined) {
            var pos = session.selection.lead;
            column = pos.column;
            row = pos.row;
        }
        if (tokenRange == undefined)
            tokenRange = true;

        var startToken = session.getTokenAt(row, column);
        if (startToken) {
            var val = startToken.value.toLowerCase();
            if (val in this.indentKeywords)
                return this.foldingRules.basicBlock(session, row, column, tokenRange);
        }
    };

    this.$id = "ace/mode/basic";
}).call(Mode.prototype);

exports.Mode = Mode;
