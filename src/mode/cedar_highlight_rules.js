"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var CedarHighlightRules = function() {
    var keywordMapper = this.createKeywordMapper({
        "keyword": "permit|forbid|when|unless|in|has|like|if|then|else|is",
        "variable.other.constant": "principal|action|resource|context",
        "constant.language.boolean": "true|false",
        "support.function": "ip|decimal|datetime|duration"
    }, "identifier");

    this.$rules = {
    "start": [
        {
            token: "comment.line.double-slash",
            regex: /\/\/.*$/
        },
        {
            token: ["meta.decorator", "paren.lparen"],
            regex: /(@[_a-zA-Z][_a-zA-Z0-9]*)([\(])/
        },
        {
            token: "variable.other",
            regex: /\?(principal|resource)\b/
        },
        {
            token: "string.quoted.double",
            regex: '"',
            next: "cedar-string"
        },
        {
            token: "entity.name.type",
            regex: /[_a-zA-Z][_a-zA-Z0-9]*(?:::[_a-zA-Z][_a-zA-Z0-9]*)*(?=::")/
        },
        {
            token: "entity.name.type",
            regex: /[_a-zA-Z][_a-zA-Z0-9]*(?:::[_a-zA-Z][_a-zA-Z0-9]*)+/
        },
        {
            token: ["punctuation.operator", "entity.name.function.member", "paren.lparen"],
            regex: /(\.)(contains|containsAll|containsAny|isEmpty|getTag|hasTag|isIpv4|isIpv6|isLoopback|isMulticast|isInRange|lessThan|lessThanOrEqual|greaterThan|greaterThanOrEqual|offset|durationSince|toDate|toTime|toMilliseconds|toSeconds|toMinutes|toHours|toDays)(\()/
        },
        {
            token: ["support.function", "paren.lparen"],
            regex: /(ip|decimal|datetime|duration)(\()/
        },
        {
            token: "constant.numeric",
            regex: /[1-9][0-9]*|0\b/
        },
        {
            token: keywordMapper,
            regex: /[a-zA-Z_][a-zA-Z0-9_]*\b/
        },
        {
            token: "punctuation.operator",
            regex: /::/
        },
        {
            token: "keyword.operator",
            regex: /==|!=|<=|>=|<|>|&&|\|\||!/
        },
        {
            token: "keyword.operator",
            regex: /[+\-*]/
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
            regex: /[,;.]/
        },
        {
            token: "text",
            regex: /\s+/
        }
    ],
    "cedar-string": [
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

oop.inherits(CedarHighlightRules, TextHighlightRules);

exports.CedarHighlightRules = CedarHighlightRules;
