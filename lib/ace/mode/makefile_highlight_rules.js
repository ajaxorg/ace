/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
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
 * Contributor(s):
 *
 * Garen J. Torikian < gjtorikian AT gmail DOT com >
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var ShHighlightFile = require("./sh_highlight_rules");

var MakefileHighlightRules = function() {

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    var keywordMapper = this.createKeywordMapper({
        "keyword": ShHighlightFile.reservedKeywords,
        "support.function.builtin": ShHighlightFile.languageConstructs,
        "invalid.deprecated": "debugger"
    }, "string");

    this.$rules = 
        {
    "start": [
        {
            "token": [ "variable.other.makefile" ],
            "regex": "^(?:\\w|[-_])+\\s*\\??=",
            "next": "state_1"
        },
        {
            "token": "string.interpolated.backtick.makefile",
            "regex": "`",
            "next": "shell-start"
        },
        {
            "token": "punctuation.definition.comment.makefile",
            "regex": /#(?=.)/,
            "next": "comment"
        },
        {
            "token": [ "keyword.control.makefile", "keyword.control.makefile"],
            "regex": "^(\\s*)\\b(\\-??include|ifeq|ifneq|ifdef|ifndef|else|endif|vpath|export|unexport|define|endef|override)\\b"
        },
        {
            "token": ["entity.name.function.makefile", "text"],
            "regex": "(^(?:[^\t ]+(?:\s[^\t ]+)*:))(\s*.*)"
        }
    ],
    "state_1": [
        {
            "regex": "\\\\\\n"
        },
        {
            "token": "TODO",
            "regex": "$",
            "next": "start"
        }
    ],
    "comment": [
        {
            "token" : "punctuation.definition.comment.makefile",
            "regex" : /.+\\/
        },
        {
            "token" : "punctuation.definition.comment.makefile",
            "regex" : ".+",
            "next"  : "start"
        }
    ],
    "shell-start": [
        {
            "token": keywordMapper,
            "regex" : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, 
        {
            "token": "string",
            "regex" : "\\w+"
        }, 
        {
            "token" : "string.interpolated.backtick.makefile",
            "regex" : "`",
            "next"  : "start"
        }
    ]
}

};

oop.inherits(MakefileHighlightRules, TextHighlightRules);

exports.MakefileHighlightRules = MakefileHighlightRules;
});
