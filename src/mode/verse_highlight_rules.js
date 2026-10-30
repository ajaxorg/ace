"use strict";

// Based on the Verse TextMate grammar and Pygments lexer that Epic Games
// publishes under CC0 in https://github.com/verselang/book

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var SPECIFIERS = "abstract|allocates|castable|closed|computes|concrete|constructor|converges|decides|"
    + "epic_internal|final|final_super|inline|internal|localizes|module_scoped_var_weak_map_key|native|"
    + "native_callable|no_rollback|open|override|persistable|predicts|private|protected|public|reads|"
    + "scoped|suspends|transacts|unique|writes";

var VerseHighlightRules = function() {
    var keywordMapper = this.createKeywordMapper({
        "keyword.control": "block|branch|break|case|catch|continue|defer|do|else|first|for|if|loop|"
            + "of|profile|race|return|rush|spawn|sync|then|until|upon|when|where|while|with|yield",
        "keyword": "alias|class|const|enum|in|interface|is|live|module|mutable|ref|set|struct|using|var",
        "keyword.operator": "and|not|or",
        "storage.type": "any|array|char|char32|comparable|float|int|logic|map|option|rational|string|"
            + "subtype|tuple|type|void|weak_map",
        "constant.language.boolean": "false|true",
        "variable.language": "Self|super"
    }, "identifier");

    var identifierRe = "[a-zA-Z_]\\w*";
    var specifierRe = "<(?:" + SPECIFIERS + ")(?:\\{[^}]*\\})?>";
    var escapeRe = /\\[trn"'\\{}<>&#~]/;

    var indentWidth = function(str) {
        return /^\s*/.exec(str)[0].replace(/\t/g, "    ").length;
    };

    this.$rules = {
        "start": [
            {
                // <#> comments out the rest of the line and every line indented below it
                token: "comment.block",
                regex: /<#>.*$/,
                onMatch: function(value, currentState, stack, line) {
                    stack.unshift(this.next, indentWidth(line));
                    return this.token;
                },
                next: "indented_comment"
            }, {
                token: "comment.block",
                regex: /<#/,
                push: "block_comment"
            }, {
                token: "comment.line",
                regex: /#.*$/
            }, {
                token: "string",
                regex: /"/,
                push: "string"
            }, {
                token: ["string", "constant.language.escape", "string"],
                regex: "(')(" + escapeRe.source + ")(')"
            }, {
                token: "string",
                regex: /'(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|[^'\\])'/
            }, {
                token: ["keyword", "text", "paren.lparen", "text", "constant.language.path", "text", "paren.rparen"],
                regex: /(using)(\s*)(\{)(\s*)(\/[^\s{}]*)(\s*)(\})/
            }, {
                token: "storage.modifier",
                regex: specifierRe
            }, {
                token: "storage.type.annotation",
                regex: "@" + identifierRe
            }, {
                // qualifiers such as (super:) or (/Verse.org/Simulation:)
                token: "variable.language",
                regex: /\((?:[a-zA-Z_]\w*|\/[^\s()]*):\)/
            }, {
                // 0oXX is a char and 0uXXXXXX a char32
                token: "string",
                regex: /0[ou][0-9a-fA-F]+/
            }, {
                token: "constant.numeric",
                regex: /0x[0-9a-fA-F]+/
            }, {
                token: "constant.numeric",
                regex: /\d+\.\d+(?:[eE][+-]?\d+)?(?:f64)?|\d+/
            }, {
                token: function(value) {
                    var type = keywordMapper(value);
                    return type == "identifier" ? "entity.name.function" : type;
                },
                regex: identifierRe + "(?=\\s*(?:" + specifierRe + "\\s*)*\\()"
            }, {
                token: keywordMapper,
                regex: identifierRe
            }, {
                // braces inside a string interpolation are counted on the stack
                regex: /[{}]/,
                onMatch: function(value, currentState, stack) {
                    this.next = currentState;
                    if (value == "{") {
                        if (stack.length)
                            stack.unshift("start", currentState);
                        return "paren.lparen";
                    }
                    if (stack.length) {
                        stack.shift();
                        this.next = stack.shift();
                        if (this.next == "string")
                            return "paren.quasi.end";
                    }
                    return "paren.rparen";
                },
                next: "start"
            }, {
                token: "paren.lparen",
                regex: /[[(]/
            }, {
                token: "paren.rparen",
                regex: /[\])]/
            }, {
                token: "keyword.operator",
                regex: /:=|=>|->|\.\.|[-+*/]=|<>|<=|>=|[-+*/=<>?:^]/
            }, {
                token: "punctuation.operator",
                regex: /[.,;]/
            }, {
                token: "text",
                regex: /\s+/
            }
        ],

        "string": [
            {
                token: "constant.language.escape",
                regex: escapeRe
            }, {
                // comments are stripped from string literals too
                token: "comment.block",
                regex: /<#(?!>)/,
                push: "block_comment"
            }, {
                token: "paren.quasi.start",
                regex: /\{/,
                push: "start"
            }, {
                token: "string",
                regex: /"|$/,
                next: "pop"
            }, {
                defaultToken: "string"
            }
        ],

        "block_comment": [
            {
                token: "comment.block",
                regex: /<#>/
            }, {
                token: "comment.block",
                regex: /<#/,
                push: "block_comment"
            }, {
                token: "comment.block",
                regex: /#>/,
                next: "pop"
            }, {
                defaultToken: "comment.block"
            }
        ],

        "indented_comment": [
            {
                token: "comment.block",
                regex: /^\s*$/
            }, {
                regex: /^\s*/,
                onMatch: function(value, currentState, stack) {
                    if (indentWidth(value) > stack[1]) {
                        this.next = currentState;
                        return "comment.block";
                    }
                    stack.shift();
                    stack.shift();
                    this.next = stack[0] || "start";
                    return "text";
                },
                next: "start"
            }, {
                defaultToken: "comment.block"
            }
        ]
    };

    this.normalizeRules();
};

oop.inherits(VerseHighlightRules, TextHighlightRules);

exports.VerseHighlightRules = VerseHighlightRules;
