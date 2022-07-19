"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var CirruHighlightRules = require("./cirru_highlight_rules").CirruHighlightRules;
var CoffeeFoldMode = require("./folding/coffee").FoldMode;

var Mode = function() {
    this.HighlightRules = CirruHighlightRules;
    this.foldingRules = new CoffeeFoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "--";
    this.$id = "ace/mode/cirru";
}).call(Mode.prototype);

exports.Mode = Mode;
