"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var PascalHighlightRules = function() {
    var keywordMapper = this.createKeywordMapper({
        "keyword.control": "absolute|abstract|all|and|and_then|array|as|asm|attribute|begin|bindable|case|class" +
            "|const|constructor|destructor|div|do|do|else|end|except|export|exports|external|far|file|finalization" +
            "|finally|for|forward|goto|if|implementation|import|in|inherited|initialization|interface|interrupt|is" +
            "|label|library|mod|module|name|near|nil|not|object|of|only|operator|or|or_else|otherwise|packed|pow|private" +
            "|program|property|protected|public|published|qualified|record|repeat|resident|restricted|segment|set|shl|shr" +
            "|then|to|try|type|unit|until|uses|value|var|view|virtual|while|with|xor"
    }, "identifier", true);

    this.$rules = {
        start: [{
                caseInsensitive: true,
                token: ['variable', "text",
                    'storage.type.prototype',
                    'entity.name.function.prototype'
                ],
                regex: '\\b(function|procedure)(\\s+)(\\w+)(\\.\\w+)?(?=(?:\\(.*?\\))?;\\s*(?:attribute|forward|external))'
            }, {
                caseInsensitive: true,
                token: ['variable', "text", 'storage.type.function', 'entity.name.function'],
                regex: '\\b(function|procedure)(\\s+)(\\w+)(\\.\\w+)?'
            }, {
                caseInsensitive: true,
                token: keywordMapper,
                regex: /\b[a-z_]+\b/
            }, {
                token: 'constant.numeric',
                regex: '\\b((0(x|X)[0-9a-fA-F]*)|(([0-9]+\\.?[0-9]*)|(\\.[0-9]+))((e|E)(\\+|-)?[0-9]+)?)(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b'
            }, {
                token: 'punctuation.definition.comment',
                regex: '--.*$'
            }, {
                token: 'punctuation.definition.comment',
                regex: '//.*$'
            }, {
                token: 'punctuation.definition.comment',
                regex: '\\(\\*',
                push: [{
                        token: 'punctuation.definition.comment',
                        regex: '\\*\\)',
                        next: 'pop'
                    },
                    { defaultToken: 'comment.block.one' }
                ]
            }, {
                token: 'punctuation.definition.comment',
                regex: '\\{',
                push: [{
                        token: 'punctuation.definition.comment',
                        regex: '\\}',
                        next: 'pop'
                    },
                    { defaultToken: 'comment.block.two' }
                ]
            }, {
                token: 'punctuation.definition.string.begin',
                regex: '"',
                push: [{ token: 'constant.character.escape', regex: '\\\\.' },
                    {
                        token: 'punctuation.definition.string.end',
                        regex: '"',
                        next: 'pop'
                    },
                    { defaultToken: 'string.quoted.double' }
                ]
                //Double quoted strings are an extension and (generally) support C-style escape sequences.
            }, {
                token: 'punctuation.definition.string.begin',
                regex: '\'',
                push: [{
                        token: 'constant.character.escape.apostrophe',
                        regex: '\'\''
                    },
                    {
                        token: 'punctuation.definition.string.end',
                        regex: '\'',
                        next: 'pop'
                    },
                    { defaultToken: 'string.quoted.single' }
                ]
            }, {
                token: 'keyword.operator',
                regex: '[+\\-;,/*%]|:=|='
            }
        ]
    };

    this.normalizeRules();
};

oop.inherits(PascalHighlightRules, TextHighlightRules);

exports.PascalHighlightRules = PascalHighlightRules;
