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
var PhpHighlightRules = require("./php_highlight_rules").PhpHighlightRules;

var PHPLaravelBladeHighlightRules = function() {
    PhpHighlightRules.call(this);

    var bladeRules = {
        start: [{
            include: "comments"
        }, {
            include: "directives"
        }, {
            include: "parenthesis"
        }],
        comments: [{
            token: "punctuation.definition.comment.blade",
            regex: "(\\/\\/(.)*)|(\\#(.)*)",
            next: "pop"
        }, {
            token: "punctuation.definition.comment.begin.php",
            regex: "(?:\\/\\*)",
            push: [{
                token: "punctuation.definition.comment.end.php",
                regex: "(?:\\*\\/)",
                next: "pop"
            }, {
                defaultToken: "comment.block.blade"
            }]
        }, {
            token: "punctuation.definition.comment.begin.blade",
            regex: "(?:\\{\\{\\-\\-)",
            push: [{
                token: "punctuation.definition.comment.end.blade",
                regex: "(?:\\-\\-\\}\\})",
                next: "pop"
            }, {
                defaultToken: "comment.block.blade"
            }]
        }],
        parenthesis: [{
            token: "parenthesis.begin.blade",
            regex: "\\(",
            push: [{
                token: "parenthesis.end.blade",
                regex: "\\)",
                next: "pop"
            }, {
                include: "strings"
            }, {
                include: "variables"
            }, {
                include: "lang"
            }, {
                include: "parenthesis"
            }, {
                defaultToken: "source.blade"
            }]
        }],
        directives: [{
                token: ["directive.declaration.blade", "keyword.directives.blade"],
                regex: "(@)(endunless|endisset|endempty|endauth|endguest|endcomponent|endslot|endalert|endverbatim|endsection|show|php|endphp|endpush|endprepend|endenv|endforelse|isset|empty|component|slot|alert|json|verbatim|section|auth|guest|hasSection|forelse|includeIf|includeWhen|includeFirst|each|push|stack|prepend|inject|env|elseenv|unless|yield|extends|parent|include|acfrepeater|block|can|cannot|choice|debug|elsecan|elsecannot|embed|hipchat|lang|layout|macro|macrodef|minify|partial|render|servers|set|slack|story|task|unset|wpposts|acfend|after|append|breakpoint|endafter|endcan|endcannot|endembed|endmacro|endmarkdown|endminify|endpartial|endsetup|endstory|endtask|endunless|markdown|overwrite|setup|stop|wpempty|wpend|wpquery)"

            }, {
                token: ["directive.declaration.blade", "keyword.control.blade"],
                regex: "(@)(if|else|elseif|endif|foreach|endforeach|switch|case|break|default|endswitch|for|endfor|while|endwhile|continue)"
            }, {
                token: ["directive.ignore.blade", "injections.begin.blade"],
                regex: "(@?)(\\{\\{)",
                push: [{
                    token: "injections.end.blade",
                    regex: "\\}\\}",
                    next: "pop"
                }, {
                    include: "strings"
                }, {
                    include: "variables"
                }, {
                    defaultToken: "source.blade"
                }]
            }, {
                token: "injections.unescaped.begin.blade",
                regex: "\\{\\!\\!",
                push: [{
                    token: "injections.unescaped.end.blade",
                    regex: "\\!\\!\\}",
                    next: "pop"
                }, {
                    include: "strings"
                }, {
                    include: "variables"
                }, {
                    defaultToken: "source.blade"
                }]
            }

        ],

        lang: [{
            token: "keyword.operator.blade",
            regex: "(?:!=|!|<=|>=|<|>|===|==|=|\\+\\+|\\;|\\,|%|&&|\\|\\|)|\\b(?:and|or|eq|neq|ne|gte|gt|ge|lte|lt|le|not|mod|as)\\b"
        }, {
            token: "constant.language.blade",
            regex: "\\b(?:TRUE|FALSE|true|false)\\b"
        }],
        strings: [{
            token: "punctuation.definition.string.begin.blade",
            regex: "\"",
            push: [{
                token: "punctuation.definition.string.end.blade",
                regex: "\"",
                next: "pop"
            }, {
                token: "string.character.escape.blade",
                regex: "\\\\."
            }, {
                defaultToken: "string.quoted.single.blade"
            }]
        }, {
            token: "punctuation.definition.string.begin.blade",
            regex: "'",
            push: [{
                token: "punctuation.definition.string.end.blade",
                regex: "'",
                next: "pop"
            }, {
                token: "string.character.escape.blade",
                regex: "\\\\."
            }, {
                defaultToken: "string.quoted.double.blade"
            }]
        }],
        variables: [{
            token: "variable.blade",
            regex: "\\$([a-zA-Z_][a-zA-Z0-9_]*)\\b"
        }, {
            token: ["keyword.operator.blade", "constant.other.property.blade"],
            regex: "(->)([a-zA-Z_][a-zA-Z0-9_]*)\\b"
        }, {
            token: ["keyword.operator.blade",
                "meta.function-call.object.blade",
                "punctuation.definition.variable.blade",
                "variable.blade",
                "punctuation.definition.variable.blade"
            ],
            regex: "(->)([a-zA-Z_][a-zA-Z0-9_]*)(\\()(.*?)(\\))"
        }]
    };

    var bladeStart = bladeRules.start;

    for (var rule in this.$rules) {
        this.$rules[rule].unshift.apply(this.$rules[rule], bladeStart);
    }

    Object.keys(bladeRules).forEach(function(x) {
        if (!this.$rules[x])
            this.$rules[x] = bladeRules[x];
    }, this);

    this.normalizeRules();
};


oop.inherits(PHPLaravelBladeHighlightRules, PhpHighlightRules);

exports.PHPLaravelBladeHighlightRules = PHPLaravelBladeHighlightRules;
});
