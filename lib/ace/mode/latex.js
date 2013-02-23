define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var LatexHighlightRules = require("./latex_highlight_rules").LatexHighlightRules;
var LatexFoldMode = require("./folding/latex").FoldMode;
var Range = require("../range").Range;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new LatexHighlightRules().getRules());
    this.foldingRules = new LatexFoldMode();
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "%";

}).call(Mode.prototype);

exports.Mode = Mode;

});
