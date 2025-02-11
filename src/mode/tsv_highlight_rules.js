"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;


var TsvHighlightRules = function() {
    TextHighlightRules.call(this);
};

oop.inherits(TsvHighlightRules, TextHighlightRules);

exports.TsvHighlightRules = TsvHighlightRules;
