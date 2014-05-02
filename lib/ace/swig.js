define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var lang = require("../lib/lang");
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var SwigHighlightRules = function() {
    // inherit from html
    HtmlHighlightRules.call(this);

    var tags = "autoescape|block|else|elif|extends|filter|for|if|import|include|macro|parent|raw|set|spaceless";
    tags = tags + "|end" + tags.replace(/\|/g, "|end");
    var filters = "addslashes|capitalize|date|default|escape|first|groupBy|join|json|last|lower|raw|replace|reverse|safe|sort|striptags|title|uniq|upper|url_encode|url_decode";
    var special = "first|last|index|index0|revindex|revindex0|key"
    var constants = "null|none|true|false|loop";
    var operators = "in|is|and|or|not|as|with|only";

    var keywordMapper = this.createKeywordMapper({
        "keyword.control.swig": tags,
        "support.function.swig": filters+"|"+special,
        "keyword.operator.swig":  operators,
        "constant.language.swig": constants,
    }, "identifier");

    // add swig start tags to the HTML start tags
    for (var rule in this.$rules) {
        this.$rules[rule].unshift({
            token : "variable.other.readwrite.local.swig",
            regex : "\\{\\{-?",
            push : "swig-start"
        }, {
            token : "meta.tag.swig",
            regex : "\\{%-?",
            push : "swig-start"
        }, {
            token : "comment.block.swig",
            regex : "\\{#-?",
            push : "swig-comment"
        });
    }

    // add swig closing comment to HTML comments
    this.$rules["swig-comment"] = [{
        token : "comment.block.swig",
        regex : ".*-?#}",
        next : "pop"
    }];

    this.$rules["swig-start"] = [{
        token : "variable.other.readwrite.local.swig",
        regex : "-?\\}\\}",
        next : "pop"
    }, {
        token : "meta.tag.swig",
        regex : "-?%\\}",
        next : "pop"
    }, {
        token : "string",
        regex : "'",
        next  : "swig-qstring"
    }, {
        token : "string",
        regex : '"',
        next  : "swig-qqstring"
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
        token : "keyword.operator.assignment",
        regex : "=|~"
    }, {
        token : "keyword.operator.comparison",
        regex : "==|!=|<|>|>=|<=|==="
    }, {
        token : "keyword.operator.arithmetic",
        regex : "\\+|-|/|%|//|\\*|\\*\\*"
    }, {
        token : "keyword.operator.other",
        regex : "\\.\\.|\\|"
    }, {
        token : "punctuation.operator",
        regex : /\?|\:|\,|\;|\./
    }, {
        token : "paren.lparen",
        regex : /[\[\({]/
    }, {
        token : "paren.rparen",
        regex : /[\])}]/
    }, {
        token : "text",
        regex : "\\s+"
    } ];
    
    this.$rules["swig-qqstring"] = [{
            token : "constant.language.escape",
            regex : /\\[\\"$#ntr]|#{[^"}]*}/
        }, {
            token : "string",
            regex : '"',
            next  : "swig-start"
        }, {
            defaultToken : "string"
        }
    ];

    this.$rules["swig-qstring"] = [{
            token : "constant.language.escape",
            regex : /\\[\\'ntr]}/
        }, {
            token : "string",
            regex : "'",
            next  : "swig-start"
        }, {
            defaultToken : "string"
        }
    ];
    
    this.normalizeRules();
};

oop.inherits(SwigHighlightRules, TextHighlightRules);

exports.SwigHighlightRules = SwigHighlightRules;
});
