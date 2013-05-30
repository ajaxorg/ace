define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var lang = require("../lib/lang");
var xmlUtil = require("./xml_util");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var CssHighlightRules = require("./css_highlight_rules").CssHighlightRules;
var JavaScriptHighlightRules = require("./javascript_highlight_rules").JavaScriptHighlightRules;

var VelocityHighlightRules = function() {
    var builtinConstants = lang.arrayToMap(
        ('true|false|null').split('|')
    );

    var builtinFunctions = lang.arrayToMap(
        ("_DateTool|_DisplayTool|_EscapeTool|_FieldTool|_MathTool|_NumberTool|_SerializerTool|_SortTool|_StringTool|_XPathTool").split('|')
    );

    var builtinVariables = lang.arrayToMap(
        ('$contentRoot|$foreach').split('|')
    );

    var keywords = lang.arrayToMap(
        ("#set|#macro|#include|#parse|" +
        "#if|#elseif|#else|#foreach|" +
        "#break|#end|#stop"
        ).split('|')
    );

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [
            {
                token : "meta.tag",
                regex : "<\\!\\[CDATA\\[",
                next : "cdata"
            }, {
                token : "xml-pe",
                regex : "<\\?.*?\\?>"
            }, {
                token : "comment",
                regex : "<\\!--",
                next : "comment"
            }, {
                token : "meta.tag",
                regex : "<(?=\\s*script\\b)",
                next : "script"
            }, {
                token : "meta.tag",
                regex : "<(?=\\s*style\\b)",
                next : "style"
            }, {
                token : "meta.tag", // opening tag
                regex : "<\\/?(?=[a-z])",
                next : "tag"
            }, {
                token : "comment",
                regex : "##.*$"
            },{
                token : "comment.block", // multi line comment
                regex : "#\\*",
                next : "comment"
            }, {
                token : "string.regexp",
                regex : "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)"
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
                token : function(value) {
                    if (keywords.hasOwnProperty(value))
                        return "keyword";
                    else if (builtinConstants.hasOwnProperty(value))
                        return "constant.language";
                    else if (builtinVariables.hasOwnProperty(value))
                        return "variable.language";
                    else if (builtinFunctions.hasOwnProperty(value) || builtinFunctions.hasOwnProperty(value.substring(1)))
                        return "support.function";
                    else if (value == "debugger")
                        return "invalid.deprecated";
                    else
                        if(value.match(/^(\$[a-zA-Z_][a-zA-Z0-9_]*)$/))
                            return "variable";
                        return "identifier";
                },
                // TODO: Unicode escape sequences
                // TODO: Unicode identifiers
                regex : "[a-zA-Z$#][a-zA-Z0-9_]*\\b"
            }, {
                token : "keyword.operator",
                regex : "!|&|\\*|\\-|\\+|=|!=|<=|>=|<|>|&&|\\|\\|"
            }, {
                token : "lparen",
                regex : "[[({]"
            }, {
                token : "rparen",
                regex : "[\\])}]"
            }, {
                token : "text",
                regex : "\\s+"
            }
        ],
        "cdata" : [
            {
                token : "text",
                regex : "\\]\\]>",
                next : "start"
            }, {
                token : "text",
                regex : "\\s+"
            }, {
                token : "text",
                regex : ".+"
            }
        ],
        "comment" : [
            {
                token : "comment", // closing comment
                regex : "\\*#|-->",
                next : "start"
            }, {
                defaultToken: "comment"
            }
        ],
        "vm_start" : [
            {
                token: "variable",
                regex: "}",
                next: "start"
            }, {
                token : "string.regexp",
                regex : "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)"
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
                token : function(value) {
                    if (keywords.hasOwnProperty(value))
                        return "keyword";
                    else if (builtinConstants.hasOwnProperty(value))
                        return "constant.language";
                    else if (builtinVariables.hasOwnProperty(value))
                        return "variable.language";
                    else if (builtinFunctions.hasOwnProperty(value) || builtinFunctions.hasOwnProperty(value.substring(1)))
                        return "support.function";
                    else if (value == "debugger")
                        return "invalid.deprecated";
                    else
                        if(value.match(/^(\$[a-zA-Z_$][a-zA-Z0-9_]*)$/))
                            return "variable";
                        return "identifier";
                },
                // TODO: Unicode escape sequences
                // TODO: Unicode identifiers
                regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }, {
                token : "keyword.operator",
                regex : "!|&|\\*|\\-|\\+|=|!=|<=|>=|<|>|&&|\\|\\|"
            }, {
                token : "lparen",
                regex : "[[({]"
            }, {
                token : "rparen",
                regex : "[\\])}]"
            }, {
                token : "text",
                regex : "\\s+"
            }
        ]
    };

    xmlUtil.tag(this.$rules, "tag", "start");
    xmlUtil.tag(this.$rules, "style", "css-start");
    xmlUtil.tag(this.$rules, "script", "js-start");

    this.embedRules(JavaScriptHighlightRules, "js-", [{
        token: "comment",
        regex: "\\/\\/.*(?=<\\/script>)",
        next: "tag"
    }, {
        token: "meta.tag",
        regex: "<\\/(?=script)",
        next: "tag"
    }]);

    this.embedRules(CssHighlightRules, "css-", [{
        token: "meta.tag",
        regex: "<\\/(?=style)",
        next: "tag"
    }]);

    for (var i in this.$rules) {
        this.$rules[i].unshift({
            token: "variable",
            regex: "\\${",
            next: "vm_start"
        });
    }
};

oop.inherits(VelocityHighlightRules, TextHighlightRules);

exports.VelocityHighlightRules = VelocityHighlightRules;
});