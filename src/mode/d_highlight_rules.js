"use strict";

var oop = require("../lib/oop");
var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var DHighlightRules = function() {

    var keywords = (
        "this|super|import|module|body|mixin|__traits|invariant|alias|asm|delete|"+
        "typeof|typeid|sizeof|cast|new|in|is|typedef|__vector|__parameters"
    );

    var keywordControls = (
        "break|case|continue|default|do|else|for|foreach|foreach_reverse|goto|if|" +
        "return|switch|while|catch|try|throw|finally|version|assert|unittest|with"
    );
    
    var types = (
        "auto|bool|char|dchar|wchar|byte|ubyte|float|double|real|" +
        "cfloat|creal|cdouble|cent|ifloat|ireal|idouble|" +
        "int|long|short|void|uint|ulong|ushort|ucent|" +
        "function|delegate|string|wstring|dstring|size_t|ptrdiff_t|hash_t|Object"
    );

    var modifiers = (
        "abstract|align|debug|deprecated|export|extern|const|final|in|inout|out|" +
        "ref|immutable|lazy|nothrow|override|package|pragma|private|protected|" +
        "public|pure|scope|shared|__gshared|synchronized|static|volatile"
    );
    
    var storages = (
        "class|struct|union|template|interface|enum|macro"
    );
    
    var stringEscapesSeq =  {
        token: "constant.language.escape",
        regex: "\\\\(?:(?:x[0-9A-F]{2})|(?:[0-7]{1,3})|(?:['\"\\?0abfnrtv\\\\])|" +
            "(?:u[0-9a-fA-F]{4})|(?:U[0-9a-fA-F]{8}))"
    };

    var builtinConstants = (
        "null|true|false|"+
        "__DATE__|__EOF__|__TIME__|__TIMESTAMP__|__VENDOR__|__VERSION__|"+
        "__FILE__|__MODULE__|__LINE__|__FUNCTION__|__PRETTY_FUNCTION__"
    );
    
    var operators = (
        "/|/\\=|&|&\\=|&&|\\|\\|\\=|\\|\\||\\-|\\-\\=|\\-\\-|\\+|" +
        "\\+\\=|\\+\\+|\\<|\\<\\=|\\<\\<|\\<\\<\\=|\\<\\>|\\<\\>\\=|\\>|\\>\\=|\\>\\>\\=|" +
        "\\>\\>\\>\\=|\\>\\>|\\>\\>\\>|\\!|\\!\\=|\\!\\<\\>|\\!\\<\\>\\=|\\!\\<|\\!\\<\\=|" +
        "\\!\\>|\\!\\>\\=|\\?|\\$|\\=|\\=\\=|\\*|\\*\\=|%|%\\=|" +
        "\\^|\\^\\=|\\^\\^|\\^\\^\\=|~|~\\=|\\=\\>|#"
    );

    var keywordMapper = this.$keywords = this.createKeywordMapper({
        "keyword.modifier" : modifiers,
        "keyword.control" :  keywordControls,
        "keyword.type" :     types,
        "keyword":           keywords,
        "keyword.storage":   storages,
        "punctation": "\\.|\\,|;|\\.\\.|\\.\\.\\.",
        "keyword.operator" : operators,
        "constant.language": builtinConstants
    }, "identifier");
    
    var identifierRe = "[a-zA-Z_\u00a1-\uffff][a-zA-Z\\d_\u00a1-\uffff]*\\b";

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [
            {     //-------------------------------------------------------- COMMENTS
                token : "comment",
                regex : "\\/\\/.*$"
            },
            DocCommentHighlightRules.getStartRule("doc-start"),
            {
                token : "comment", // multi line comment
                regex : "\\/\\*",
                next : "star-comment"
            }, {
                token: "comment.shebang",
                regex: "^\\s*#!.*"
            }, {
                token : "comment",
                regex : "\\/\\+",
                next: "plus-comment"
            }, {  //-------------------------------------------------------- STRINGS
                onMatch: function(value, currentState, state) {
                    state.unshift(this.next, value.substr(2));
                    return "string";
                },
                regex: 'q"(?:[\\[\\(\\{\\<]+)',
                next: 'operator-heredoc-string'
            }, {
                onMatch: function(value, currentState, state) {
                    state.unshift(this.next, value.substr(2));
                    return "string";
                },
                regex: 'q"(?:[a-zA-Z_]+)$',
                next: 'identifier-heredoc-string'
            }, {
                token : "string", // multi line string start
                regex : '[xr]?"',
                next : "quote-string"
            }, {
                token : "string", // multi line string start
                regex : '[xr]?`',
                next : "backtick-string"
            }, {
                token : "string", // single line
                regex : "[xr]?['](?:(?:\\\\.)|(?:[^'\\\\]))*?['][cdw]?"
            }, {  //-------------------------------------------------------- RULES
                token: ["keyword", "text", "paren.lparen"],
                regex: /(asm)(\s*)({)/,
                next: "d-asm"
            }, {
                token: ["keyword", "text", "paren.lparen", "constant.language"],
                regex: "(__traits)(\\s*)(\\()("+identifierRe+")"
            }, { // import|module abc
                token: ["keyword", "text", "variable.module"],
                regex: "(import|module)(\\s+)((?:"+identifierRe+"\\.?)*)"
            }, { // storage Name
                token: ["keyword.storage", "text", "entity.name.type"],
                regex: "("+storages+")(\\s*)("+identifierRe+")"
            }, { // alias|typedef foo bar;
                token: ["keyword", "text", "variable.storage", "text"],
                regex: "(alias|typedef)(\\s*)("+identifierRe+")(\\s*)"
            }, {  //-------------------------------------------------------- OTHERS
                token : "constant.numeric", // hex
                regex : "0[xX][0-9a-fA-F_]+(l|ul|u|f|F|L|U|UL)?\\b"
            }, {
                token : "constant.numeric", // float
                regex : "[+-]?\\d[\\d_]*(?:(?:\\.[\\d_]*)?(?:[eE][+-]?[\\d_]+)?)?(l|ul|u|f|F|L|U|UL)?\\b"
            }, {
                token: "entity.other.attribute-name",
                regex: "@"+identifierRe
            }, {
                token : keywordMapper,
                regex : "[a-zA-Z_][a-zA-Z0-9_]*\\b"
            }, {
                token : "keyword.operator",
                regex : operators
            }, {
                token : "punctuation.operator",
                regex : "\\?|\\:|\\,|\\;|\\.|\\:"
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
        "star-comment" : [
            {
                token : "comment", // closing comment
                regex : "\\*\\/",
                next : "start"
            }, {
                defaultToken: 'comment'
            }
        ],
        "plus-comment" : [
            {
                token : "comment", // closing comment
                regex : "\\+\\/",
                next : "start"
            }, {
                defaultToken: 'comment'
            }
        ],
        
        "quote-string" : [
           stringEscapesSeq,
           {
                token : "string",
                regex : '"[cdw]?',
                next : "start"
            }, {
                defaultToken: 'string'
            }
        ],
        
        "backtick-string" : [
           stringEscapesSeq,
           {
                token : "string",
                regex : '`[cdw]?',
                next : "start"
            }, {
                defaultToken: 'string'
            }
        ],
        
        "operator-heredoc-string": [
            {
                onMatch: function(value, currentState, state) {
                    value = value.substring(value.length-2, value.length-1);
                    var map = {'>':'<',']':'[',')':'(','}':'{'};
                    if(Object.keys(map).indexOf(value) != -1)
                        value = map[value];
                    if(value != state[1]) return "string";
                    state.shift();
                    state.shift();
                    
                    return "string";
                },
                regex: '(?:[\\]\\)}>]+)"',
                next: 'start'
            }, {
                token: 'string',
                regex: '[^\\]\\)}>]+'
            }
        ],
        
        "identifier-heredoc-string": [
            {
                onMatch: function(value, currentState, state) {
                    value = value.substring(0, value.length-1);
                    if(value != state[1]) return "string";
                    state.shift();
                    state.shift();
                    
                    return "string";
                },
                regex: '^(?:[A-Za-z_][a-zA-Z0-9]+)"',
                next: 'start'
            }, {
                token: 'string',
                regex: '[^\\]\\)}>]+'
            }
        ],
        
        "d-asm": [
            {
                token: "paren.rparen",
                regex: "\\}",
                next: "start"
            }, {
                token: 'keyword.instruction',
                regex: '[a-zA-Z]+',
                next: 'd-asm-instruction' 
            }, {
                token: "text",
                regex: "\\s+"
            }
        ],
        
        // minimal asm support
        'd-asm-instruction': [
            {
                token: 'constant.language',
                regex: /AL|AH|AX|EAX|BL|BH|BX|EBX|CL|CH|CX|ECX|DL|DH|DX|EDX|BP|EBP|SP|ESP|DI|EDI|SI|ESI/i
            }, {
                token: 'identifier',
                regex: '[a-zA-Z]+'
            }, {
                token: 'string',
                regex: '"[^"]*"'
            }, {
                token: 'comment',
                regex: '//.*$'
            }, {
                token: 'constant.numeric',
                regex: '[0-9.xA-F]+'
            }, {
                token: 'punctuation.operator',
                regex: '\\,'
            }, {
                token: 'punctuation.operator',
                regex: ';',
                next: 'd-asm'
            }, {
                token: 'text',
                regex: '\\s+'
            }
        ]
    };

    this.embedRules(DocCommentHighlightRules, "doc-",
        [ DocCommentHighlightRules.getEndRule("start") ]);
};

DHighlightRules.metaData = {
      comment: 'D language',
      fileTypes: [ 'd', 'di' ],
      firstLineMatch: '^#!.*\\b[glr]?dmd\\b.',
      foldingStartMarker: '(?x)/\\*\\*(?!\\*)|^(?![^{]*?//|[^{]*?/\\*(?!.*?\\*/.*?\\{)).*?\\{\\s*($|//|/\\*(?!.*?\\*/.*\\S))',
      foldingStopMarker: '(?<!\\*)\\*\\*/|^\\s*\\}',
      keyEquivalent: '^~D',
      name: 'D',
      scopeName: 'source.d'
};
oop.inherits(DHighlightRules, TextHighlightRules);

exports.DHighlightRules = DHighlightRules;
