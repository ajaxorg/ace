"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var JadeHighlightRules = require("./jade_highlight_rules").JadeHighlightRules;
var FoldMode = require("./folding/coffee").FoldMode;

var Mode = function() {
    this.HighlightRules = JadeHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() { 
	this.lineCommentStart = "//";
    this.$id = "ace/mode/jade";
}).call(Mode.prototype);

exports.Mode = Mode;
