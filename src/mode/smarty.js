"use strict";

var oop = require("../lib/oop");
var HtmlMode = require("./html").Mode;
var SmartyHighlightRules = require("./smarty_highlight_rules").SmartyHighlightRules;

var Mode = function() {
    HtmlMode.call(this);
    this.HighlightRules = SmartyHighlightRules;
};

oop.inherits(Mode, HtmlMode);

(function() {
    
    this.$id = "ace/mode/smarty";
}).call(Mode.prototype);

exports.Mode = Mode;
