define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var NixHighlightRules = function() {

    var constantLanguage = "true|false";
    var keywordControl = "with|import|if|else|then";
    var keywordDeclaration = "let|in|rec";

    var keywordMapper = this.createKeywordMapper({
        "constant.language.nix": constantLanguage,
        "keyword.control.nix": keywordControl,
        "keyword.declaration.nix": keywordDeclaration
    }, "identifier");

    this.$rules = {
        "start": [{
            token: "comment",
            regex: /#.*$/
        }, {
            token: "comment",
            regex: /\/\*/,
            next: "comment"
        }, {
            regex: "(==|!=|<=?|>=?)",
            token: ["keyword.operator.comparison.nix"]
        }, {
            regex: "((?:[+*/%-]|\\~)=)",
            token: ["keyword.operator.assignment.arithmetic.nix"]
        }, {
            regex: "=",
            token: "keyword.operator.assignment.nix"
        }, {
            token: "string",
            regex: "''",
            next: "qqdoc"
        }, {
            token: "string",
            regex: "'",
            next: "qstring"
        }, {
            token: "string",
            regex: '"',
            next: "qqstring"
        }, {
            token: "constant.numeric", // hex
            regex: "0[xX][0-9a-fA-F]+\\b"
        }, {
            token: "constant.numeric", // float
            regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
        }, {
            token: keywordMapper,
            regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }],
        "comment": [{
            token: "comment", // closing comment
            regex: ".*?\\*\\/",
            next: "start"
        }, {
            token: "comment", // comment spanning whole line
            regex: ".+"
        }],
        "qqdoc": [{
            token: "constant.language.escape",
            regex: /\$\{[^}]+\}/
        }, {
            token: "string",
            regex: "''",
            next: "start"
        }, {
            defaultToken: "string"
        }],

        "qqstring": [{
            token: "constant.language.escape",
            regex: /\$\{[^}]+\}/
        }, {
            token: "string",
            regex: '"',
            next: "start"
        }, {
            defaultToken: "string"
        }],

        "qstring": [{
            token: "constant.language.escape",
            regex: /\$\{[^}]+\}/
        }, {
            token: "string",
            regex: "'",
            next: "start"
        }, {
            defaultToken: "string"
        }]
    };

};

oop.inherits(NixHighlightRules, TextHighlightRules);

exports.NixHighlightRules = NixHighlightRules;
});