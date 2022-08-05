"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;

var LiquidHighlightRules = function() {
    HtmlHighlightRules.call(this);

    // see: https://developer.mozilla.org/en/Liquid/Reference/Global_Objects
    var functions = (
      // Standard Filters
        "date|capitalize|downcase|upcase|first|last|join|sort|map|size|escape|" +
         "escape_once|strip_html|strip_newlines|newline_to_br|replace|replace_first|" +
         "truncate|truncatewords|prepend|append|minus|plus|times|divided_by|split"
    );

    var keywords = (
      // Standard Tags
        "capture|endcapture|case|endcase|when|comment|endcomment|" +
        "cycle|for|endfor|in|reversed|if|endif|else|elsif|include|endinclude|unless|endunless|" +
      // Commonly used tags
        "style|text|image|widget|plugin|marker|endmarker|tablerow|endtablerow"
    );
    
    // common standard block tags that require to be closed with an end[block] token
    var blocks = 'for|if|case|capture|unless|tablerow|marker|comment';

    var builtinVariables = 'forloop|tablerowloop';
        // "forloop\\.(length|index|index0|rindex|rindex0|first|last)|limit|offset|range" +
        // "tablerowloop\\.(length|index|index0|rindex|rindex0|first|last|col|col0|"+
        // "col_first|col_last)"

    var definitions = ("assign");

    var keywordMapper = this.createKeywordMapper({
        "variable.language": builtinVariables,
        "keyword": keywords,
        "keyword.block": blocks,
        "support.function": functions,
        "keyword.definition": definitions
    }, "identifier");

    // add liquid start tags to the HTML start tags
    for (var rule in this.$rules) {
        this.$rules[rule].unshift({
            token : "variable",
            regex : "{%",
            push : "liquid-start"
        }, {
            token : "variable",
            regex : "{{",
            push : "liquid-start"
        });
    }

    this.addRules({
        "liquid-start" : [{
            token: "variable",
            regex: "}}",
            next: "pop"
        }, {
            token: "variable",
            regex: "%}",
            next: "pop"
        }, {
            token : "string", // single line
            regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
        }, {
            token : "string", // single line
            regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
        }, {
            token : "constant.numeric", // hex
            regex : "0[xX][0-9a-fA-F]+\\b"
        }, {
            token : "constant.numeric", // float
            regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
        }, {
            token : "constant.language.boolean",
            regex : "(?:true|false)\\b"
        }, {
            token : keywordMapper,
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token : "keyword.operator",
            regex : "/|\\*|\\-|\\+|=|!=|\\?\\:"
        }, {
            token : "paren.lparen",
            regex : /[\[\({]/
        }, {
            token : "paren.rparen",
            regex : /[\])}]/
        }, {
            token : "text",
            regex : "\\s+"
        }]
    });

    this.normalizeRules();
};
oop.inherits(LiquidHighlightRules, TextHighlightRules);

exports.LiquidHighlightRules = LiquidHighlightRules;
