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

/* This file was autogenerated from C:\Users\steve02081504\Documents\workstation\Taromati2_workdirs\ayaya\syntaxes\aya.tmLanguage.json (uuid: ) */
/****************************************************************************************
 * IT MIGHT NOT BE PERFECT ...But it's a good start from an existing *.tmlanguage file. *
 * fileTypes                                                                            *
 ****************************************************************************************/

define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var ayayaHighlightRules = function() {
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        start: [{
            include: "#line-comment"
        }, {
            include: "#block-comment"
        }, {
            include: "#preprocessor-define"
        }, {
            include: "#keywords"
        }, {
            include: "#operators"
        }, {
            include: "#double-quoted-strings"
        }, {
            include: "#signal-quoted-strings"
        }, {
            include: "#numeric-values"
        }, {
            include: "#global-functions"
        }, {
            include: "#global-variables"
        }, {
            include: "#local-variables"
        }, {
            include: "#brackets"
        }],
        "#line-comment": [{
            token: "comment.line.aya",
            regex: /\/\//,
            push: [{
                token: "comment.line.aya",
                regex: /$|\Z/,
                next: "pop"
            }, {
                defaultToken: "comment.line.aya"
            }]
        }],
        "#block-comment": [{
            token: "comment.block.aya",
            regex: /\/\*/,
            push: [{
                token: "comment.block.aya",
                regex: /\*\//,
                next: "pop"
            }, {
                defaultToken: "comment.block.aya"
            }]
        }],
        "#preprocessor-define": [{
            token: [
                "meta.preprocessor.define.aya",
                "meta.preprocessor.define.aya",
                "meta.preprocessor.define.aya",
                "meta.preprocessor.define.aya"
            ],
            regex: /(#)(globaldefine|define)(\s+[^\s]+\s+)(.+)/,
            push: [{
                token: "meta.preprocessor.define.aya",
                regex: /$|\Z/,
                next: "pop"
            }, {
                defaultToken: "meta.preprocessor.define.aya"
            }]
        }],
        "#keywords": [{
            token: "keyword.control.aya",
            regex: /\b(?:if|elseif|else|case|when|others|switch|while|for|break|continue|return|foreach|parallel|void)\b/
        }],
        "#operators": [{
            token: "operator.aya",
            regex: /[+\-*\/%=!<>&|]+|_in_|!_in_/
        }],
        "#global-functions": [{
            token: "entity.name.function.aya",
            regex: /\b[^!"#$%&'()*+,\-\/:;<=>?@\[\\\]`{|}\s]+\s*(?=\()/
        }],
        "#global-variables": [{
            token: "variable.global.aya",
            regex: /\b[^!"#$%&'()*+,\-\/:;<=>?@\[\\\]`{|}\s]+\b/
        }],
        "#local-variables": [{
            token: "variable.local.aya",
            regex: /\b_[^!"#$%&'()*+,\-\/:;<=>?@\[\\\]`{|}\s]+\b/
        }],
        "#numeric-values": [{
            token: "constant.numeric.aya",
            regex: /\b(?:\d+\.?\d*|0b[01]+|0x[0-9a-fA-F]+)\b/
        }],
        "#signal-quoted-strings": [{
            token: "string.quoted.signal.aya",
            regex: /'/,
            push: [{
                token: "string.quoted.signal.aya",
                regex: /'/,
                next: "pop"
            }, {
                token: "constant.character.selfescape.aya",
                regex: /\'\'/
            }, {
                defaultToken: "string.quoted.signal.aya"
            }]
        }],
        "#double-quoted-strings": [{
            token: "string.quoted.double.aya",
            regex: /"/,
            push: [{
                token: "string.quoted.double.aya",
                regex: /"/,
                next: "pop"
            }, {
                token: "constant.character.selfescape.aya",
                regex: /\"\"/
            }, {
                token: "constant.character.exprforment.aya",
                regex: /%\(/,
                push: [{
                    token: "constant.character.exprforment.aya",
                    regex: /\)/,
                    next: "pop"
                }, {
                    include: "source.ayaya"
                }, {
                    defaultToken: "constant.character.exprforment.aya"
                }]
            }, {
                token: "constant.character.nameforment.aya",
                regex: /%/
            }, {
                defaultToken: "string.quoted.double.aya"
            }]
        }],
        "#brackets": [{
            token: "punctuation.section.bracket.aya",
            regex: /\(/,
            push: [{
                token: "punctuation.section.bracket.aya",
                regex: /\)/,
                next: "pop"
            }, {
                include: "source.ayaya"
            }, {
                defaultToken: "punctuation.section.bracket.aya"
            }]
        }, {
            token: "punctuation.section.brace.aya",
            regex: /\{/,
            push: [{
                token: "punctuation.section.brace.aya",
                regex: /\}/,
                next: "pop"
            }, {
                include: "source.ayaya"
            }, {
                token: "constant.character.lineend",
                regex: /;/
            }, {
                defaultToken: "punctuation.section.brace.aya"
            }]
        }, {
            token: "punctuation.section.parenthesis.aya",
            regex: /\[/,
            push: [{
                token: "punctuation.section.parenthesis.aya",
                regex: /\]/,
                next: "pop"
            }, {
                include: "source.ayaya"
            }, {
                defaultToken: "punctuation.section.parenthesis.aya"
            }]
        }]
    }
    
    this.normalizeRules();
};

ayayaHighlightRules.metaData = {
    "$schema": "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
    name: "ayaya",
    scopeName: "source.ayaya"
}


oop.inherits(ayayaHighlightRules, TextHighlightRules);

exports.ayayaHighlightRules = ayayaHighlightRules;
});