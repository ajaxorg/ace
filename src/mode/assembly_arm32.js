"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var AssemblyARM32HighlightRules = require("./assembly_arm32_highlight_rules").AssemblyARM32HighlightRules;
var FoldMode = require("./folding/coffee").FoldMode;

var Mode = function() {
    this.HighlightRules = AssemblyARM32HighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = [";"];
	this.blockComment = {start: "/*", end: "*/"};
    this.$id = "ace/mode/assembly_arm32";
}).call(Mode.prototype);

exports.Mode = Mode;