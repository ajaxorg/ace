"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;


var CsvHighlightRules = function() {
    TextHighlightRules.call(this);
};

oop.inherits(CsvHighlightRules, TextHighlightRules);

exports.CsvHighlightRules = CsvHighlightRules;
