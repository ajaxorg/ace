"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var BibTeXHighlightRules = function() {
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        start: [
            {
                token: "comment",
                regex: /@Comment\{/,
                stateName: "bibtexComment",
                push: [
                    {
                        token: "comment",
                        regex: /}/,
                        next: "pop"
                    }, {
                        token: "comment",
                        regex: /\{/,
                        push: "bibtexComment"
                    }, {
                        defaultToken: "comment"
                    }
                ]
            }, {
                token: [
                    "keyword", "text", "paren.lparen", "text", "variable", "text", "keyword.operator"
                ],
                regex: /(@String)(\s*)(\{)(\s*)([a-zA-Z]*)(\s*)(=)/,
                push: [
                    {
                        token: "paren.rparen",
                        regex: /\}/,
                        next: "pop"
                    }, {
                        include: "#misc"
                    }, {
                        defaultToken: "text"
                    }
                ]
            }, {
                token: [
                    "keyword", "text", "paren.lparen", "text", "variable", "text", "keyword.operator"
                ],
                regex: /(@String)(\s*)(\()(\s*)([a-zA-Z]*)(\s*)(=)/,
                push: [
                    {
                        token: "paren.rparen",
                        regex: /\)/,
                        next: "pop"
                    }, {
                        include: "#misc"
                    }, {
                        defaultToken: "text"
                    }
                ]
            }, {
                token: [
                    "keyword", "text", "paren.lparen"
                ],
                regex: /(@preamble)(\s*)(\()/,
                push: [
                    {
                        token: "paren.rparen",
                        regex: /\)/,
                        next: "pop"
                    }, {
                        include: "#misc"
                    }, {
                        defaultToken: "text"
                    }
                ]
            }, {
                token: [
                    "keyword", "text", "paren.lparen"
                ],
                regex: /(@preamble)(\s*)(\{)/,
                push: [
                    {
                        token: "paren.rparen",
                        regex: /\}/,
                        next: "pop"
                    }, {
                        include: "#misc"
                    }, {
                        defaultToken: "text"
                    }
                ]
            }, {
                token: [
                    "keyword", "text", "paren.lparen", "text", "support.class"
                ],
                regex: /(@[a-zA-Z]+)(\s*)(\{)(\s*)([\w-]+)/,
                push: [
                    {
                        token: "paren.rparen",
                        regex: /\}/,
                        next: "pop"
                    }, {
                        token: [
                            "variable", "text", "keyword.operator"
                        ],
                        regex: /([a-zA-Z0-9\!\$\&\*\+\-\.\/\:\;\<\>\?\[\]\^\_\`\|]+)(\s*)(=)/,
                        push: [
                            {
                                token: "text",
                                regex: /(?=[,}])/,
                                next: "pop"
                            }, {
                                include: "#misc"
                            }, {
                                include: "#integer"
                            }, {
                                defaultToken: "text"
                            }
                        ]
                    }, {
                        token: "punctuation",
                        regex: /,/
                    }, {
                        defaultToken: "text"
                    }
                ]
            }, {
                defaultToken: "comment"
            }
        ],
        "#integer": [
            {
                token: "constant.numeric.bibtex",
                regex: /\d+/
            }
        ],
        "#misc": [
            {
                token: "string",
                regex: /"/,
                push: "#string_quotes"
            }, {
                token: "paren.lparen",
                regex: /\{/,
                push: "#string_braces"
            }, {
                token: "keyword.operator",
                regex: /#/
            }
        ],
        "#string_braces": [
            {
                token: "paren.rparen",
                regex: /\}/,
                next: "pop"
            }, {
                token: "invalid.illegal",
                regex: /@/
            }, {
                include: "#misc"
            }, {
                defaultToken: "string"
            }
        ],
        "#string_quotes": [
            {
                token: "string",
                regex: /"/,
                next: "pop"
            }, {
                include: "#misc"
            }, {
                defaultToken: "string"
            }
        ]
    };
    
    this.normalizeRules();
};

oop.inherits(BibTeXHighlightRules, TextHighlightRules);

exports.BibTeXHighlightRules = BibTeXHighlightRules;