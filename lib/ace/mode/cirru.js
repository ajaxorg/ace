
define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var CirruHighlightRules = require("./cirru_highlight_rules").CirruHighlightRules;
var CoffeeFoldMode = require("./folding/coffee").FoldMode;

var Mode = function() {
    this.HighlightRules = CirruHighlightRules;
    this.foldingRules = new CoffeeFoldMode();
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "--";
    this.$id = "ace/mode/cirru";
}).call(Mode.prototype);

exports.Mode = Mode;
});
