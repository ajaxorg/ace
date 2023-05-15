"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var BibTeXHighlightRules = require("./bibtex_highlight_rules").BibTeXHighlightRules;
var FoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = BibTeXHighlightRules;
    this.foldingRules = new FoldMode();
};
oop.inherits(Mode, TextMode);

(function() {
    this.$id = "ace/mode/bibtex";
}).call(Mode.prototype);

exports.Mode = Mode;