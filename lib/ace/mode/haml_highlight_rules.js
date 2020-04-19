define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;
var RubyExports = require("./ruby_highlight_rules");
var RubyHighlightRules = RubyExports.RubyHighlightRules;

var HamlHighlightRules = function() {

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used
    HtmlHighlightRules.call(this);

    this.$rules = {
        "start": [
            {
                token: "comment.block", // multiline HTML comment
                regex: /^\/$/,
                next: "comment"
            },
            {
                token: "comment.block", // multiline HAML comment
                regex: /^\-#$/,
                next: "comment"
            },
            {
                token: "comment.line", // HTML comment
                regex: /\/\s*.*/
            },
            {
                token: "comment.line", // HAML comment
                regex: /-#\s*.*/
            },
            {
                token: "keyword.other.doctype",
                regex: "^!!!\\s*(?:[a-zA-Z0-9-_]+)?"
            },
            RubyExports.qString,
            RubyExports.qqString,
            RubyExports.tString,
            {
                token: "meta.tag.haml",
                regex: /(%[\w:\-]+)/
            },
            {
                token: "keyword.attribute-name.class.haml",
                regex: /\.[\w-]+/
            },
            {
                token: "keyword.attribute-name.id.haml",
                regex: /#[\w-]+/,
                next: "element_class"
            },
            RubyExports.constantNumericHex,
            RubyExports.constantNumericFloat,
            RubyExports.constantOtherSymbol,
            {
                token: "text",
                regex: /=|-|~/,
                next: "embedded_ruby"
            }
        ],
        "element_class": [
            {
                token: "keyword.attribute-name.class.haml",
                regex: /\.[\w-]+/
            },
            {
                token: "punctuation.section",
                regex: /\{/,
                next: "element_attributes"
            },
            RubyExports.constantOtherSymbol,
            {
                token: "empty",
                regex: "$|(?!\\.|#|\\{|\\[|=|-|~|\\/])",
                next: "start"
            }
        ],
        "element_attributes": [
            RubyExports.constantOtherSymbol,
            RubyExports.qString,
            RubyExports.qqString,
            RubyExports.tString,
            RubyExports.constantNumericHex,
            RubyExports.constantNumericFloat,
            {
                token: "punctuation.section",
                regex: /$|\}/,
                next: "start"
            }
        ],
        "embedded_ruby": [
            RubyExports.constantNumericHex,
            RubyExports.constantNumericFloat,
            RubyExports.instanceVariable,
            RubyExports.qString,
            RubyExports.qqString,
            RubyExports.tString,
            {
                token : "support.class", // class name
                regex : "[A-Z][a-zA-Z_\\d]+"
            },
            {
                token : new RubyHighlightRules().getKeywords(),
                regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            },
            {
                token : ["keyword", "text", "text"],
                regex : "(?:do|\\{)(?: \\|[^|]+\\|)?$",
                next  : "start"
            },
            {
                token : ["text"],
                regex : "^$",
                next  : "start"
            },
            {
                token : ["text"],
                regex : "^(?!.*\\|\\s*$)",
                next  : "start"
            }
        ],
        "comment": [
            {
                token: "comment.block",
                regex: /^$/,
                next: "start"
            },
            {
                token: "comment.block", // comment spanning the whole line
                regex: /\s+.*/
            }
        ]

    };

    this.normalizeRules();
};

oop.inherits(HamlHighlightRules, HtmlHighlightRules);

exports.HamlHighlightRules = HamlHighlightRules;
});
