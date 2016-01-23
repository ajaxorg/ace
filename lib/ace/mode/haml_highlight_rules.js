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
    this.$rules.start.unshift(
        {
            token : "punctuation.section.comment",
            regex : /^\s*\/.*/
        },
        {
            token: "string.quoted.double",
            regex: "==.+?=="
        },
        {
            token: "keyword.other.doctype",
            regex: "^!!!\\s*(?:[a-zA-Z0-9-_]+)?"
        },
        RubyExports.qString,
        RubyExports.qqString,
        RubyExports.tString,
        {
            token: "character.escape.haml",
            regex: "^\\s*\\\\."
        },
        {
            token: "text",
            regex: /^\s*/,
            next: "tag_single"
        },
        RubyExports.constantNumericHex,
        RubyExports.constantNumericFloat,
        
        RubyExports.constantOtherSymbol,
        {
            token: "text",
            regex: "=|-|~",
            next: "embedded_ruby"
        }
    );
    this.$rules.tag_single = [
        {
            token: "meta.tag.haml",
            regex: /(%[\w:\-]+)/
        },
        {
            token: "keyword.attribute-name.class.haml",
            regex: "\\.[\\w-]+"
        },
        {
            token: "keyword.attribute-name.id.haml",
            regex: "#[\\w-]+"
        },
        {
            token: "punctuation.section",
            regex: "\\{",
            next: "section"
        },
        
        RubyExports.constantOtherSymbol,
        
        {
            token: "text",
            regex: /\s/,
            next: "start"
        },
        {
            token: "empty",
            regex: "$|(?!\\.|#|\\{|\\[|=|-|~|\\/)",
            next: "start"
        }
    ];
    this.$rules.section = [
        RubyExports.constantOtherSymbol,
        
        RubyExports.qString,
        RubyExports.qqString,
        RubyExports.tString,
        
        RubyExports.constantNumericHex,
        RubyExports.constantNumericFloat,
        {
            token: "punctuation.section",
            regex: "\\}",
            next: "start"
        } 
    ];
    
    this.$rules.embedded_ruby = [ 
        RubyExports.constantNumericHex,
        RubyExports.constantNumericFloat,
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
    ];

    this.normalizeRules();
};

oop.inherits(HamlHighlightRules, HtmlHighlightRules);

exports.HamlHighlightRules = HamlHighlightRules;
});
