"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var TclHighlightRules = function() {

    //TODO var builtinFunctions = "";

    this.$rules = {
        "start" : [
           {
                token : "comment",
                regex : "#.*\\\\$",
                next  : "commentfollow"
            }, {
                token : "comment",
                regex : "#.*$"
            }, {
                token : "support.function",
                regex : '[\\\\]$',
                next  : "splitlineStart"
            }, {
                token : "text",
                regex : /\\(?:["{}\[\]$\\])/
            }, {
                token : "text", // last value before command
                regex : '^|[^{][;][^}]|[/\r/]',
                next  : "commandItem"
            }, {
                token : "string", // single line
                regex : '[ ]*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token : "string", // multi line """ string start
                regex : '[ ]*["]',
                next  : "qqstring"
            }, {
                token : "variable.instance",
                regex : "[$]",
                next  : "variable"
            }, {
                token : "support.function",
                regex : "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|{\\*}|;|::"
            }, {
                token : "identifier",
                regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }, {
                token : "paren.lparen",
                regex : "[[{]",
                next  : "commandItem"
            }, {
                token : "paren.lparen",
                regex : "[(]"
            },  {
                token : "paren.rparen",
                regex : "[\\])}]"
            }, {
                token : "text",
                regex : "\\s+"
            }
        ],
        "commandItem" : [
            {
                token : "comment",
                regex : "#.*\\\\$",
                next  : "commentfollow"
            }, {
                token : "comment",
                regex : "#.*$",
                next  : "start"
            }, {
                token : "string", // single line
                regex : '[ ]*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token : "variable.instance", 
                regex : "[$]",
                next  : "variable"
            }, {
                token : "support.function",
                regex : "(?:[:][:])[a-zA-Z0-9_/]+(?:[:][:])",
                next  : "commandItem"
            }, {
                token : "support.function",
                regex : "[a-zA-Z0-9_/]+(?:[:][:])",
                next  : "commandItem"
            }, {
                token : "support.function",
                regex : "(?:[:][:])",
                next  : "commandItem"
            }, {
                token : "paren.rparen",
                regex : "[\\])}]"
            }, {
                token : "paren.lparen",
                regex : "[[({]"
            }, {
                token : "support.function",
                regex : "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|{\\*}|;|::"
            }, {
                token : "keyword",
                regex : "[a-zA-Z0-9_/]+",
                next  : "start"
            } ],
        "commentfollow" : [ 
            {
                token : "comment",
                regex : ".*\\\\$",
                next  : "commentfollow"
            }, {
                token : "comment",
                regex : '.+',
                next  : "start"
        } ],
        "splitlineStart" : [ 
            {
                token : "text",
                regex : "^.",
                next  : "start"
            }],
        "variable" : [ 
            {
                token : "variable.instance", // variable tcl
                regex : "[a-zA-Z_\\d]+(?:[(][a-zA-Z_\\d]+[)])?",
                next  : "start"
            }, {
                token : "variable.instance", // variable tcl with braces
                regex : "{?[a-zA-Z_\\d]+}?",
                next  : "start"
            }],  
        "qqstring" : [ {
            token : "string", // multi line """ string end
            regex : '(?:[^\\\\]|\\\\.)*?["]',
            next : "start"
        }, {
            token : "string",
            regex : '.+'
        } ]
    };
};

oop.inherits(TclHighlightRules, TextHighlightRules);

exports.TclHighlightRules = TclHighlightRules;
