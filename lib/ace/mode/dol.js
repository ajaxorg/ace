
define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
//var OwlHighlightRules = require("./owl_highlight_rules").OwlHighlightRules;
//var CLifHighlightRules = require("./clif_highlight_rules").ClifHighlightRules;
var DolHighlightRules = require("./dol_highlight_rules").DolHighlightRules;

  

var Mode = function() {
    this.HighlightRules = DolHighlightRules;
	
};
oop.inherits(Mode, TextMode);

(function() {

	
    this.$id = "ace/mode/Dol";  
}).call(Mode.prototype);         
								

exports.Mode = Mode;
});
