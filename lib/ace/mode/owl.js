
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

	
    this.lineCommentStart = "#";
  

	
    this.$id = "ace/mode/Owl";      
}).call(Mode.prototype);            
								    

exports.Mode = Mode;
});