"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var FlixHighlightRules = function() {
    
    var keywords = (
        "use|checked_cast|checked_ecast|unchecked_cast|masked_cast|as|discard|from|" +
        "into|inject|project|solve|query|where|select|force|import|region|red|deref"
    );
    var controlKeywords = (
        "choose|debug|do|for|forA|forM|foreach|yield|if|else|case|" +
        "match|typematch|try|catch|resume|spawn|par|branch|jumpto"
    );
    var operators = "not|and|or|fix";
    var declarations = "eff|def|law|enum|case|type|alias|class|instance|mod|let";
    var modifiers = "with|without|opaque|lazy|lawful|pub|override|sealed|static";
    var primitives = "Unit|Bool|Char|Float32|Float64|Int8|Int16|Int32|Int64|BigInt|String";

    var keywordMapper = this.createKeywordMapper({
        "keyword": keywords,
        "keyword.control": controlKeywords,
        "keyword.operator": operators,
        "storage.type": declarations,
        "storage.modifier": modifiers,
        "support.type": primitives
    }, "identifier");

    this.$rules = {
        "start" : [
            {
                token : "comment.line",
                regex : "\\/\\/.*$"
            }, {
                token : "comment.block",
                regex : "\\/\\*",
                next : "comment"
            }, {
                token : "string",
                regex : '"',
                next : "string"
            }, {
                token : "string.regexp",
                regex : 'regex"',
                next : "regex"
            }, {
                token : "constant.character",
                regex : "'",
                next : "char"
            }, {
                token : "constant.numeric", // hex
                regex : "0x[a-fA-F0-9](_*[a-fA-F0-9])*(i8|i16|i32|i64|ii)?\\b"
            }, {
                token : "constant.numeric", // float
                regex : "[0-9](_*[0-9])*\\.[0-9](_*[0-9])*(f32|f64)?\\b"
            }, {
                token : "constant.numeric", // integer
                regex : "[0-9](_*[0-9])*(i8|i16|i32|i64|ii)?\\b"
            }, {
                token : "constant.language.boolean",
                regex : "(true|false)\\b"
            }, {
                token : "constant.language",
                regex : "null\\b"
            }, {
                token : "keyword.operator",
                regex : "\\->|~>|<\\-|=>"
            }, {
                token : "storage.modifier",
                regex : "@(Deprecated|Experimental|Internal|ParallelWhenPure|Parallel|LazyWhenPure|Lazy|Skip|Test)\\b"
            }, {
                token : "keyword", // hole
                regex : "(\\?\\?\\?|\\?[a-zA-Z0-9]+)"
            }, {
                token : keywordMapper,
                regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }, {
                token : "paren.lparen",
                regex : "[[({]"
            }, {
                token : "paren.rparen",
                regex : "[\\])}]"
            }, {
                token : "text",
                regex : "\\s+"
            }
        ],
        "comment" : [
            {
                token : "comment.block",
                regex : "\\*\\/",
                next : "start"
            }, {
                defaultToken : "comment.block"
            }
        ],
        "string" : [
            {
                token : "constant.character.escape", // unicode
                regex : "\\\\(u[0-9a-fA-F]{4})"
            }, {
                token : "constant.character.escape",
                regex : '\\\\.'
            }, {
                token : "string",
                regex : '"',
                next : "start"
            }, {
                token : "string",
                regex : '[^"\\\\]+'
            }
        ],
        "regex" : [
            {
                token : "constant.character.escape", // unicode
                regex : "\\\\(u[0-9a-fA-F]{4})"
            }, {
                token : "constant.character.escape",
                regex : '\\\\.'
            }, {
                token : "string.regexp",
                regex : '"',
                next : "start"
            }, {
                token : "string.regexp",
                regex : '[^"\\\\]+'
            }
        ],
        "char" : [
            {
                token : "constant.character.escape", // unicode
                regex : "\\\\(u[0-9a-fA-F]{4})"
            }, {
                token : "constant.character.escape",
                regex : '\\\\.'
            }, {
                token : "constant.character",
                regex : "'",
                next : "start"
            }, {
                token : "constant.character",
                regex : "[^'\\\\]+"
            }
        ]
    };

};

oop.inherits(FlixHighlightRules, TextHighlightRules);

exports.FlixHighlightRules = FlixHighlightRules;