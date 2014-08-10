define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var LatexHighlightRules = function() {  

    this.$rules = {
        "start" : [{
            token : "keyword",
            regex : "\\\\(documentclass|usepackage|label)"
        },{
            // Escaped character (including new line)
            token : "constant.character.escape",
            regex : "\\\\[^a-zA-Z]"
        },{
            // A block
            token : "storage.type",
            regex : "\\\\(:?begin|end)",
            next  : "block"
        },{
            // A tex command e.g. \foo
            token : "storage.type",
            regex : "\\\\[a-zA-Z\\d]+"
        }, {
            // Curly and square braces
            token : "lparen",
            regex : "[[({]"
        }, {
            // Curly and square braces
            token : "rparen",
            regex : "[\\])}]"
        }, {
            // A comment. Tex comments start with % and go to 
            // the end of the line
            token : "comment",
            regex : "%.*$"
        },{
            // An equation
            token : "string",
            regex : "\\${1,2}",
            next  : "equation"
        }],
        "block" : [{
            token : ["","variable.parameter",""],
            regex : "({)([^}\\s]*)(}?)",
            next  : "start"
        },{
            token : "",
            regex : "",
            next  : "start"
        }],
        "equation" : [{
            token : "string",
            regex : "\\${1,2}",
            next  : "start"
        },{
            token : "constant.character.escape",
            regex : "\\\\(?:[^a-zA-Z]|[a-zA-Z]+)"
        },{
            token : "string",
            regex : "."
        }]

    };
};
oop.inherits(LatexHighlightRules, TextHighlightRules);

exports.LatexHighlightRules = LatexHighlightRules;

});
