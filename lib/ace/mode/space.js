define(function(require, exports, module) {
"use strict";
var oop = require("../lib/oop");
// defines the parent mode
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var FoldMode = require("./folding/coffee").FoldMode;
// defines the language specific highlighters and folding rules
var SpaceHighlightRules = require("./space_highlight_rules").SpaceHighlightRules;
var Mode = function() {
    // set everything up
    var highlighter = new SpaceHighlightRules();
    this.$tokenizer = new Tokenizer(highlighter.getRules());
    this.foldingRules = new FoldMode();
};
oop.inherits(Mode, TextMode);
(function() {
    
}).call(Mode.prototype);
exports.Mode = Mode;
});
