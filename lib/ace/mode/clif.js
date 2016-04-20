
define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var ClifHighlightRules = require("./clif_highlight_rules").ClifHighlightRules;
var TextMode = require("./text").Mode;						  

var Mode = function() {
    this.HighlightRules = ClifHighlightRules;
	
};
oop.inherits(Mode, TextMode);

(function() {

	
    this.$id = "ace/mode/Clif";  
}).call(Mode.prototype);         
								

exports.Mode = Mode;
});