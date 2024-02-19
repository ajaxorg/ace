"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var AssemblyARMHighlightRules = require("./assembly_arm_highlight_rules").AssemblyARMHighlightRules;
var FoldMode = require("./folding/coffee").FoldMode;

var Mode = function() {
    this.HighlightRules = AssemblyARMHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = [";"];
	this.blockComment = {start: "/*", end: "*/"};
    this.$id = "ace/mode/assembly_arm";
}).call(Mode.prototype);

exports.Mode = Mode;