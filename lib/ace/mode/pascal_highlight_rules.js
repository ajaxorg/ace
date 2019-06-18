/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
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
});
