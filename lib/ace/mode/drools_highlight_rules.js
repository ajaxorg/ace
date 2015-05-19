define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var JavaHighlightRules = require("./java_highlight_rules").JavaHighlightRules;

var DroolsHighlightRules = function() {

    // taken from http://docs.jboss.org/drools/release/6.2.0.Final/drools-docs/html/ch07.html#d0e5835
    var coreKeywords = (
        "entry-point|package|import|rule|" +
        "extend|when|then|template|query|declare|" +
        "function|global|eval|not|in|or|and|exists|" +
        "forall|accumulate|collect|from|action|" +
        "reverse|result|end|over|init|attributes"
    );

    var coreKeywordMapper = this.createKeywordMapper({
        "variable.language": "this",
        "keyword": coreKeywords
    }, "identifier");
    
        this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : "\\/\\/.*$"
            }, {
                token : "comment", // multi line comment
                regex : "\\/\\*",
                next : "comment"
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
            },
            DocCommentHighlightRules.getStartRule("doc-start"),
            {   token : "keyword",
                regex : "rule\\b",
                next : "attribute-start"
            }, {
                token : "keyword",
                regex : "then\\b",
                next : "java-start"
            }, {
                token : coreKeywordMapper,
                regex : "[a-zA-Z]+\\b"
            }, {
                token : "keyword.operator",
                regex : "!|\\*|\\-\\+|==|!=|<=|>=|<|>|&&|\\|\\||\\s+(matches|contains|memberof|after|before|coincides|during|finishes|finished by|includes|meets|met by|overlaps|overlapped by|starts|started by)"
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
        "comment" : [
            {
                token : "comment", // closing comment
                regex : ".*?\\*\\/",
                next : "start"
            }, {
                token : "comment", // comment spanning whole line
                regex : ".+"
            }
        ]
    };


    var attributeKeywords = (
        "lock-on-active|date-effective|date-expires|duration|" +
        "no-loop|auto-focus|activation-group|agenda-group|" +
        "ruleflow-group|dialect|salience|enabled"
    );

    var attributeKeywordMapper = this.createKeywordMapper({
        "keyword": attributeKeywords
    }, "identifier");
    
    var DroolsRuleAttributes = {
        "start" : [
            {
                token : "comment",
                regex : "\\/\\/.*$"
            }, {
                token : "comment", // multi line comment
                regex : "\\/\\*",
                next : "comment"
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
                regex : "(?:true|false)"
            }, {
                token : attributeKeywordMapper,
                regex : "[a-zA-Z_$]+[\\-]*[a-zA-Z0-9_$]+[\\-]*[a-zA-Z0-9_$]+\\b"
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
        "comment" : [
            {
                token : "comment", // closing comment
                regex : ".*?\\*\\/",
                next : "start"
            }, {
                token : "comment", // comment spanning whole line
                regex : ".+"
            }
        ]
    };

    this.embedRules(DocCommentHighlightRules, "doc-",
        [ DocCommentHighlightRules.getEndRule("start") ]);

    this.embedRules(DroolsRuleAttributes, "attribute-", [
        {
            token: "keyword",
            regex: "when\\b",
            next: "start"
        }
    ]);

    this.embedRules(JavaHighlightRules, "java-", [
        {
            token: "keyword",
            regex: "modify\\b"
        },
        {
            token: "keyword",
            regex: "end\\b",
            next: "start"
        }
    ]);

};

oop.inherits(DroolsHighlightRules, JavaHighlightRules, TextHighlightRules);

exports.DroolsHighlightRules = DroolsHighlightRules;
});
