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
 *
 * Contributor(s):
 * 
 *
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var JadeHighlightRules = function() {

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = 
        {
    "start": [
        {
            "token": "keyword.control.import.include.jade",
            "regex": "^\\s*\\binclude\\b"
        },
        {
            "token": "keyword.other.doctype.jade",
            "regex": "^!!!\\s*[a-zA-Z0-9-_]+?"
        },
        {
            "token": "punctuation.section.comment.jade",
            "regex": "^ *//\\s*\\S.*$\\n?"
        },
        {
            "token": "punctuation.section.comment.jade",
            "regex": "^\\s*//\\s*$",
            "next": "block_comment"
        },
        /*{
            "token": "entity.name.function.jade",
            "regex": "^\\s*\\:markdown",
            "next": "markdown_filter"
        },
        {
            "token": "entity.name.function.jade",
            "regex": "^\\s*\\:sass",
            "next": "sass_filter"
        },
        {
            "token": "entity.name.function.jade",
            "regex": "^\\s*\\:less",
            "next": "less_filter"
        },
        {
            "token": "entity.name.function.jade",
            "regex": "^\\s*\\:coffeescript",
            "next": "coffeescript_filter"
        },
        {
            "token": "entity.name.function.jade",
            "regex": "^\\s*\\:cdata",
            "next": "cdata_9"
        },*/
        // match stuff like: mixin dialog-title-desc(title, desc)
        {
            "token": [ "storage.type.function.jade", 
                       "entity.name.function.jade", 
                       "punctuation.definition.parameters.begin.jade", 
                       "variable.parameter.function.jade", 
                       "punctuation.definition.parameters.end.jade"
                     ],
            "regex": "^(\\s*mixin) ([\\w\\-]+)(\\s*\\()(.*?)(\\))"
        },
        // match stuff like: mixin dialog-title-desc
        {
            "token": ["storage.type.function.jade",
                      "entity.name.function.jade"
                     ],
            "regex": "^(\\s*mixin)( [\\w\\-]+)"
        },
        {
            "regex": "^\\s*(-|=|!=)",
            "next": "state_12"
        },
        {
            "token": {
                "2": {
                    "name": "entity.name.tag.script.jade"
                }
            },
            "regex": "^(\\s*)(script)",
            "next": "state_13"
        },
        {
            "token": "string.interpolated.jade",
            "regex": "[#!]\\{[^\\}]+\\}"
        },
        // Match any tag, id or class. skip AST filters
        {
            "token": {
                "1": {
                    "name": "meta.tag.any.jade"
                },
                "2": {
                    "name": "entity.name.tag.jade"
                }
            },
            "regex": "^\\s*(?!\\w+\\:)(?:(([\\w]+))|(?=\\.|#))",
            "next": "state_15"
        },
        {
            "regex": "(?<=\\w)\\s*\\(", // ERROR: This contains a lookbehind, which JS does not support :(",
            "next": "state_16"
        }
    ],
    "block_comment": [
        {
            "token": "text",
            "regex": "^(?!\\1\\s+|$)",
            "next": "start"
        },
        {
            "token": "text",
            "regex": ".+",
            "next": "block_comment"
        }
    ],
    /*"markdown_filter": [
        {
            "include": "text.html.markdown"
        },
        {
            "token": "TODO",
            "regex": "^(?!\\1\\s+)",
            "next": "start"
        }
    ],
    "sass_filter": [
        {
            "include": "source.sass"
        },
        {
            "token": "TODO",
            "regex": "^(?!\\1\\s+)",
            "next": "start"
        }
    ],
    "less_filter": [
        {
            "include": "source.css.less"
        },
        {
            "token": "TODO",
            "regex": "^(?!\\1\\s+)",
            "next": "start"
        }
    ],
    "coffee_filter": [
        {
            "include": "source.coffee"
        },
        {
            "token": "TODO",
            "regex": "^(?!\\1\\s+)",
            "next": "start"
        }
    ],
    "cdata_filter": [
        {
            "token": "TODO",
            "regex": "^(?!\\1\\s+)",
            "next": "start"
        },
        {
            "token": "TODO",
            "regex": ".+",
            "next": "state_9"
        }
    ],*/
    "state_12": [
        {
            "include": "source.js"
        },
        {
            "token": "keyword.control.js",
            "regex": "\\b(each)\\b"
        },
        {
            "token": "TODO",
            "regex": "$",
            "next": "start"
        }
    ],
    "state_13": [
        {},
        {
            "include": "source.js"
        },
        {
            "token": "TODO",
            "regex": "^((?=(\\1)([\\w#\\.]|$\\n?))|^$\\n?)",
            "next": "start"
        }
    ],
    "state_15": [
        {
            "token": "meta.tag.attribute.class.jade",
            "regex": "\\.[\\w-]+"
        },
        {
            "token": "meta.tag.attribute.id.jade",
            "regex": "#[\\w-]+"
        },
        {
            "token": "TODO",
            "regex": "$|(?!\\.|#|=|-)",
            "next": "start"
        }
    ],
    "state_16": [
        {
            "include": "#tag-stuff"
        },
        {
            "token": "TODO",
            "regex": "\\)",
            "next": "start"
        }
    ]
}
};

oop.inherits(JadeHighlightRules, TextHighlightRules);

exports.JadeHighlightRules = JadeHighlightRules;
});