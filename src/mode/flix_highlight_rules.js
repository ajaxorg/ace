var oop = require("ace/lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var FlixHighlightRules = function() {

    this.$rules = new TextHighlightRules().getRules();
    
};

oop.inherits(FlixHighlightRules, TextHighlightRules);

exports.FlixHighlightRules = FlixHighlightRules;