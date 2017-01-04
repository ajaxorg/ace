define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var GobstonesHighlightRules = function() {

    var keywords = (
    "program|procedure|function|interactive|if|then|else|switch|repeat|while|foreach|in|not|div|mod|Skip|return"
    );

    var buildinConstants = (
        "False|True"
    );


    var langClasses = (
        "Poner|Sacar|Mover|IrAlBorde|VaciarTablero|" +
        "nroBolitas|hayBolitas|puedeMover|siguiente|previo|opuesto|minBool|maxBool|" +
        "minDir|maxDir|minColor|maxColor"
    );

    var supportType = (
        "Verde|Rojo|Azul|Negro|Norte|Sur|Este|Oeste"
    );

    var keywordMapper = this.createKeywordMapper({
        "keyword": keywords,
        "constant.language": buildinConstants,
        "support.function": langClasses,
        "support.type": supportType
    }, "identifier");

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : "\\/\\/.*$"
            },
            {
                token : "comment",
                regex : "\\-\\-.*$"
            },
            {
                token : "comment",
                regex : "#.*$"
            },
            DocCommentHighlightRules.getStartRule("doc-start"),
            {
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
                regex : /0(?:[xX][0-9a-fA-F][0-9a-fA-F_]*|[bB][01][01_]*)[LlSsDdFfYy]?\b/
            }, {
                token : "constant.numeric", // float
                regex : /[+-]?\d[\d_]*(?:(?:\.[\d_]*)?(?:[eE][+-]?[\d_]+)?)?[LlSsDdFfYy]?\b/
            }, {
                token : "constant.language.boolean",
                regex : "(?:True|False)\\b"
            }, {
                token : "keyword.operator",
                regex : ":=|\\.\\.|,|;|\\|\\||\\/\\/|\\+|\\-|\\^|\\*|>|<|>=|=>|==|&&"
            }, {
                token : keywordMapper,
                // TODO: Unicode escape sequences
                // TODO: Unicode identifiers
                regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
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
};

oop.inherits(GobstonesHighlightRules, TextHighlightRules);

exports.GobstonesHighlightRules = GobstonesHighlightRules;
});
