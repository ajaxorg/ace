/**
 * Haskell Cabal files highlighter (https://www.haskell.org/cabal/users-guide/developing-packages.html)
 **/

"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var CabalHighlightRules = function() {

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used
    this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : "^\\s*--.*$"
            }, {
                token: ["keyword"],
                regex: /^(\s*\w.*?)(:(?:\s+|$))/
            }, {
                token : "constant.numeric", // float
                regex : /[\d_]+(?:(?:[\.\d_]*)?)/
            }, {
                token : "constant.language.boolean",
                regex : "(?:true|false|TRUE|FALSE|True|False|yes|no)\\b"
            }, {
                token : "markup.heading",
                regex : /^(\w.*)$/
            }
        ]};

};

oop.inherits(CabalHighlightRules, TextHighlightRules);

exports.CabalHighlightRules = CabalHighlightRules;
