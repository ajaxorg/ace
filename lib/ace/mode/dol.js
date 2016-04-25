
define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var DolHighlightRules = require("./dol_highlight_rules").DolHighlightRules;
var TextMode = require("./text").Mode;						  

var Mode = function() {
    this.HighlightRules = DolHighlightRules;
	
};
oop.inherits(Mode, TextMode);

(function() {

	
    this.$id = "ace/mode/Dol";  
}).call(Mode.prototype);         
								

exports.Mode = Mode;
});