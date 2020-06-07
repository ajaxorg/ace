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

define(function (require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var TerraformHighlightRules = function () {


    this.$rules = {
        "start": [
            {
                token: ['storage.function.terraform'],
                regex: '\\b(output|resource|data|variable|module|export)\\b'
            },
            {
                token: "variable.terraform",
                regex: "\\$\\s",
                push: [
                    {
                        token: "keyword.terraform",
                        regex: "(-var-file|-var)"
                    },
                    {
                        token: "variable.terraform",
                        regex: "\\n|$",
                        next: "pop"
                    },

                    {include: "strings"},
                    {include: "variables"},
                    {include: "operators"},

                    {defaultToken: "text"}
                ]
            },
            {
                token: "language.support.class",
                regex: "\\b(timeouts|provider|connection|provisioner|lifecycleprovider|atlas)\\b"
            },

            {
                token: "singleline.comment.terraform",
                regex: '#.*$'
            },
            {
                token: "singleline.comment.terraform",
                regex: '//.*$'
            },
            {
                token: "multiline.comment.begin.terraform",
                regex: /\/\*/,
                push: "blockComment"
            },
            {
                token: "storage.function.terraform",
                regex: "^\\s*(locals|terraform)\\s*{"
            },
            {
                token: "paren.lparen",
                regex: "[[({]"
            },

            {
                token: "paren.rparen",
                regex: "[\\])}]"
            },
            {include: "constants"},
            {include: "strings"},
            {include: "operators"},
            {include: "variables"}
        ],
        blockComment: [{
            regex: /\*\//,
            token: "multiline.comment.end.terraform",
            next: "pop"
        }, {
            defaultToken: "comment"
        }],
        "constants": [
            {
                token: "constant.language.terraform",
                regex: "\\b(true|false|yes|no|on|off|EOF)\\b"
            },
            {
                token: "constant.numeric.terraform",
                regex: "(\\b([0-9]+)([kKmMgG]b?)?\\b)|(\\b(0x[0-9A-Fa-f]+)([kKmMgG]b?)?\\b)"
            }
        ],
        "variables": [
            {
                token: ["variable.assignment.terraform", "keyword.operator"],
                regex: "\\b([a-zA-Z_]+)(\\s*=)"
            }
        ],
        "interpolated_variables": [
            {
                token: "variable.terraform",
                regex: "\\b(var|self|count|path|local)\\b(?:\\.*[a-zA-Z_-]*)?"
            }
        ],
        "strings": [
            {
                token: "punctuation.quote.terraform",
                regex: "'",
                push:
                    [{
                        token: 'punctuation.quote.terraform',
                        regex: "'",
                        next: 'pop'
                    },
                        {include: "escaped_chars"},
                        {defaultToken: 'string'}]
            },
            {
                token: "punctuation.quote.terraform",
                regex: '"',
                push:
                    [{
                        token: 'punctuation.quote.terraform',
                        regex: '"',
                        next: 'pop'
                    },
                        {include: "interpolation"},
                        {include: "escaped_chars"},
                        {defaultToken: 'string'}]
            }
        ],
        "escaped_chars": [
            {
                token: "constant.escaped_char.terraform",
                regex: "\\\\."
            }
        ],
        "operators": [
            {
                token: "keyword.operator",
                regex: "\\?|:|==|!=|>|<|>=|<=|&&|\\|\\\||!|%|&|\\*|\\+|\\-|/|="
            }
        ],
        "interpolation": [
            {// TODO: double $
                token: "punctuation.interpolated.begin.terraform",
                regex: "\\$?\\$\\{",
                push: [{
                    token: "punctuation.interpolated.end.terraform",
                    regex: "\\}",
                    next: "pop"
                },
                    {include: "interpolated_variables"},
                    {include: "operators"},
                    {include: "constants"},
                    {include: "strings"},
                    {include: "functions"},
                    {include: "parenthesis"},
                    {defaultToken: "punctuation"}
                ]
            }
        ],
        "functions": [
            {
                token: "keyword.function.terraform",
                regex: "\\b(abs|basename|base64decode|base64encode|base64gzip|base64sha256|base64sha512|bcrypt|ceil|chomp|chunklist|cidrhost|cidrnetmask|cidrsubnet|coalesce|coalescelist|compact|concat|contains|dirname|distinct|element|file|floor|flatten|format|formatlist|indent|index|join|jsonencode|keys|length|list|log|lookup|lower|map|matchkeys|max|merge|min|md5|pathexpand|pow|replace|rsadecrypt|sha1|sha256|sha512|signum|slice|sort|split|substr|timestamp|timeadd|title|transpose|trimspace|upper|urlencode|uuid|values|zipmap)\\b"
            }
        ],
        "parenthesis": [
            {
                token: "paren.lparen",
                regex: "\\["
            },
            {
                token: "paren.rparen",
                regex: "\\]"
            }
        ]
    };
    this.normalizeRules();
};

oop.inherits(TerraformHighlightRules, TextHighlightRules);

exports.TerraformHighlightRules = TerraformHighlightRules;
});
