"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var CedarSchemaHighlightRules = function() {
    this.$rules = {
    "start": [
        {
            token: "comment.line.double-slash",
            regex: /\/\/.*$/
        },
        {
            token: ["keyword", "text", "entity.name.namespace"],
            regex: /(namespace)(\s+)([_a-zA-Z][_a-zA-Z0-9]*(?:::[_a-zA-Z][_a-zA-Z0-9]*)*)/
        },
        {
            token: "keyword",
            regex: /^\s*(?:type|entity|action)(?=\s+)/
        },
        {
            token: "keyword",
            regex: /\b(appliesTo)\b/
        },
        {
            token: ["keyword", "text", "paren.lparen"],
            regex: /\b(enum|in)(\s*)(\[)/
        },
        {
            token: ["paren.rparen", "text", "keyword"],
            regex: /(\})(\s*)(tags)\b/
        },
        {
            token: "variable.other.property",
            regex: /\b[_a-zA-Z][_a-zA-Z0-9]*(?=[?]?:(?!:))/
        },
        {
            token: "string.quoted.double",
            regex: '"',
            next: "schema-string"
        },
        {
            token: "entity.name.type",
            regex: /[_a-zA-Z][_a-zA-Z0-9]*(?:::[_a-zA-Z][_a-zA-Z0-9]*)+/
        },
        {
            token: "punctuation.operator",
            regex: /::/
        },
        {
            token: "paren.lparen",
            regex: /[\[({]/
        },
        {
            token: "paren.rparen",
            regex: /[\])}]/
        },
        {
            token: "punctuation.operator",
            regex: /[,;?:]/
        },
        {
            token: "identifier",
            regex: /[a-zA-Z_][a-zA-Z0-9_]*\b/
        },
        {
            token: "text",
            regex: /\s+/
        }
    ],
    "schema-string": [
        {
            token: "constant.character.escape",
            regex: /\\./
        },
        {
            token: "string.quoted.double",
            regex: '"',
            next: "start"
        },
        {
            defaultToken: "string.quoted.double"
        }
    ]
    };
};

oop.inherits(CedarSchemaHighlightRules, TextHighlightRules);

exports.CedarSchemaHighlightRules = CedarSchemaHighlightRules;
