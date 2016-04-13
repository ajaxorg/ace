
define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var OwlHighlightRules = require("./owl_highlight_rules").OwlHighlightRules;
var TextMode = require("./text").Mode;						  

var Mode = function() {
    this.HighlightRules = OwlHighlightRules;
	
};
oop.inherits(Mode, TextMode);

(function() {

	
    this.lineCommentStart = "//";
    this.blockComment = {start: "/*", end: "*/"};

	
    this.$id = "ace/mode/Owl";   // Should be created in the mode folder.
}).call(Mode.prototype);         // A proper modifications should be done in the modelist.js , should add the new mode
								// to the supportedModes in the modelist.js and maybe more modifications are required (don't know yet)

exports.Mode = Mode;
});