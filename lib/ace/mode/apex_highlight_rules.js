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
var TextHighlightRules = require("../mode/text_highlight_rules").TextHighlightRules;
var DocCommentHighlightRules = require("../mode/doc_comment_highlight_rules").DocCommentHighlightRules;

var ApexHighlightRules = function() {
    var mainKeywordMapper = this.createKeywordMapper({
        "variable.language": "activate|any|autonomous|begin|bigdecimal|byte|cast|char|collect|const"
             + "|end|exit|export|float|goto|group|having|hint|import|inner|into|join|loop|number|object|of|outer"
             + "|parallel|pragma|retrieve|returning|search|short|stat|synchronized|then|this_month"
             + "|transaction|type|when",
        "keyword": "private|protected|public|native|synchronized|abstract|threadsafe|transient|static|final"
             + "|and|array|as|asc|break|bulk|by|catch|class|commit|continue|convertcurrency"
             + "|delete|desc|do|else|enum|extends|false|final|finally|for|from|future|global"
             + "|if|implements|in|insert|instanceof|interface|last_90_days|last_month"
             + "|last_n_days|last_week|like|limit|list|map|merge|new|next_90_days|next_month|next_n_days"
             + "|next_week|not|null|nulls|on|or|override|package|return"
             + "|rollback|savepoint|select|set|sort|super|testmethod|this|this_week|throw|today"
             + "|tolabel|tomorrow|trigger|true|try|undelete|update|upsert|using|virtual|webservice"
             + "|where|while|yesterday|switch|case|default",
        "storage.type":
            "def|boolean|byte|char|short|int|float|pblob|date|datetime|decimal|double|id|integer|long|string|time|void|blob|Object",
        "constant.language":
            "true|false|null|after|before|count|excludes|first|includes|last|order|sharing|with",
        "support.function":
            "system|apex|label|apexpages|userinfo|schema"
    }, "identifier", true);
    function keywordMapper(value) {
        if (value.slice(-3) == "__c") return "support.function";
        return mainKeywordMapper(value);
    }
    
    function string(start, options) {
        return {
            regex: start + (options.multiline ? "" : "(?=.)"),
            token: "string.start",
            next: [{
                regex: options.escape,
                token: "character.escape"
            }, {
                regex: options.error,
                token: "error.invalid"
            }, {
                regex: start + (options.multiline ? "" : "|$"),
                token: "string.end",
                next: options.next || "start"
            }, {
                defaultToken: "string"
            }]
        };
    }
    
    function comments() {
        return [{
                token : "comment",
                regex : "\\/\\/(?=.)",
                next : [
                    DocCommentHighlightRules.getTagRule(),
                    {token : "comment", regex : "$|^", next : "start"},
                    {defaultToken : "comment", caseInsensitive: true}
                ]
            },
            DocCommentHighlightRules.getStartRule("doc-start"),
            {
                token : "comment", // multi line comment
                regex : /\/\*/,
                next : [
                    DocCommentHighlightRules.getTagRule(),
                    {token : "comment", regex : "\\*\\/", next : "start"},
                    {defaultToken : "comment", caseInsensitive: true}
                ]
            }
        ];
    }
    
    this.$rules = {
        start: [
            string("'", {
                escape: /\\[nb'"\\]/,
                error: /\\./,
                multiline: false
            }),
            comments("c"),
            {
                type: "decoration",
                token: [
                    "meta.package.apex",
                    "keyword.other.package.apex",
                    "meta.package.apex",
                    "storage.modifier.package.apex",
                    "meta.package.apex",
                    "punctuation.terminator.apex"
                ],
                regex: /^(\s*)(package)\b(?:(\s*)([^ ;$]+)(\s*)((?:;)?))?/
            }, {
                 regex: /@[a-zA-Z_$][a-zA-Z_$\d\u0080-\ufffe]*/,
                 token: "constant.language"
            },
            {
                regex: /[a-zA-Z_$][a-zA-Z_$\d\u0080-\ufffe]*/,
                token: keywordMapper
            },  
            {
                regex: "`#%",
                token: "error.invalid"
            }, {
                token : "constant.numeric", // float
                regex : /[+-]?\d+(?:(?:\.\d*)?(?:[LlDdEe][+-]?\d+)?)\b|\.\d+[LlDdEe]/
            }, {
                token : "keyword.operator",
                regex : /--|\+\+|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\|\||\?\:|[!$%&*+\-~\/^]=?/,
                next  : "start"
            }, {
                token : "punctuation.operator",
                regex : /[?:,;.]/,
                next  : "start"
            }, {
                token : "paren.lparen",
                regex : /[\[]/,
                next  : "maybe_soql",
                merge : false
            }, {
                token : "paren.lparen",
                regex : /[\[({]/,
                next  : "start",
                merge : false
            }, {
                token : "paren.rparen",
                regex : /[\])}]/,
                merge : false
            } 
        ], 
        maybe_soql: [{
            regex: /\s+/,
            token: "text"
        }, {
            regex: /(SELECT|FIND)\b/,
            token: "keyword",
            caseInsensitive: true,
            next: "soql"
        }, {
            regex: "",
            token: "none",
            next: "start"
        }],
        soql: [{
            regex: "(:?ASC|BY|CATEGORY|CUBE|DATA|DESC|END|FIND|FIRST|FOR|FROM|GROUP|HAVING|IN|LAST"
                + "|LIMIT|NETWORK|NULLS|OFFSET|ORDER|REFERENCE|RETURNING|ROLLUP|SCOPE|SELECT"
                + "|SNIPPET|TRACKING|TYPEOF|UPDATE|USING|VIEW|VIEWSTAT|WHERE|WITH|AND|OR)\\b",
            token: "keyword",
            caseInsensitive: true
        }, {
            regex: "(:?target_length|toLabel|convertCurrency|count|Contact|Account|User|FIELDS)\\b",
            token: "support.function",
            caseInsensitive: true
        }, {
            token : "paren.rparen",
            regex : /[\]]/,
            next  : "start",
            merge : false
        }, 
        string("'", {
            escape: /\\[nb'"\\]/,
            error: /\\./,
            multiline: false,
            next: "soql"
        }),
        string('"', {
            escape: /\\[nb'"\\]/,
            error: /\\./,
            multiline: false,
            next: "soql"
        }),
        {
            regex: /\\./,
            token: "character.escape"
        },
        {
            regex : /[\?\&\|\!\{\}\[\]\(\)\^\~\*\:\"\'\+\-\,\.=\\\/]/,
            token : "keyword.operator"
        }],
        
        "log-start" : [ {
            token : "timestamp.invisible",
            regex : /^[\d:.() ]+\|/, 
            next: "log-header"
        },  {
            token : "timestamp.invisible",
            regex : /^  (Number of|Maximum)[^:]*:/,
            next: "log-comment"
        }, {
            token : "invisible",
            regex : /^Execute Anonymous:/,
            next: "log-comment"
        },  {
            defaultToken: "text"
        }],
        "log-comment": [{
            token : "log-comment",
            regex : /.*$/,
            next: "log-start"
        }],
        "log-header": [{
            token : "timestamp.invisible",
            regex : /((USER_DEBUG|\[\d+\]|DEBUG)\|)+/
        },
        {
            token : "keyword",
            regex: "(?:EXECUTION_FINISHED|EXECUTION_STARTED|CODE_UNIT_STARTED"
                + "|CUMULATIVE_LIMIT_USAGE|LIMIT_USAGE_FOR_NS"
                + "|CUMULATIVE_LIMIT_USAGE_END|CODE_UNIT_FINISHED)"
        }, {
            regex: "",
            next: "log-start"
        }]
    };
    this.embedRules(DocCommentHighlightRules, "doc-",
        [ DocCommentHighlightRules.getEndRule("start") ]);
        

    this.normalizeRules();
};


oop.inherits(ApexHighlightRules, TextHighlightRules);

exports.ApexHighlightRules = ApexHighlightRules;
});
