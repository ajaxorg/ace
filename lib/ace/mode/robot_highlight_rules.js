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
'use strict';

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var RobotHighlightRules = function() {
    var builtinConstantsRegex = new RegExp(
        /\$\{CURDIR\}|\$\{TEMPDIR\}|\$\{EXECDIR\}|\$\{\/\}|\$\{\:\}|\$\{\\n\}|\$\{true\}|\$\{false\}|\$\{none\}|\$\{null\}|\$\{space(?:\s*\*\s+[0-9]+)?\}|\$\{empty\}|&\{empty\}|@\{empty\}|\$\{TEST NAME\}|@\{TEST[\s_]TAGS\}|\$\{TEST[\s_]DOCUMENTATION\}|\$\{TEST[\s_]STATUS\}|\$\{TEST[\s_]MESSAGE\}|\$\{PREV[\s_]TEST[\s_]NAME\}|\$\{PREV[\s_]TEST[\s_]STATUS\}|\$\{PREV[\s_]TEST[\s_]MESSAGE\}|\$\{SUITE[\s_]NAME\}|\$\{SUITE[\s_]SOURCE\}|\$\{SUITE[\s_]DOCUMENTATION\}|&\{SUITE[\s_]METADATA\}|\$\{SUITE[\s_]STATUS\}|\$\{SUITE[\s_]MESSAGE\}|\$\{KEYWORD[\s_]STATUS\}|\$\{KEYWORD[\s_]MESSAGE\}|\$\{LOG[\s_]LEVEL\}|\$\{OUTPUT[\s_]FILE\}|\$\{LOG[\s_]FILE\}|\$\{REPORT[\s_]FILE\}|\$\{DEBUG[\s_]FILE\}|\$\{OUTPUT[\s_]DIR\}/
    );

    this.$rules = {
        "start" : [ {
            token: "string.robot.header",
            regex: /^\*{3}\s+(?:settings?|metadata|(?:user )?keywords?|test ?cases?|tasks?|variables?)/,
            caseInsensitive: true,
            push: [{
                token: "string.robot.header",
                regex: /$/,
                next: "pop"
            }, {
                defaultToken: "string.robot.header"
            }],
            comment: "start of a table"
        }, {
            token: "comment.robot",
            regex: /(?:^| {2,}|	|\| {1,})(?<!\\)#/,
            push: [{
                token: "comment.robot",
                regex: /$/,
                next: "pop"
            }, {
                defaultToken: "comment.robot"
            }]
        }, {
            token: "comment",
            regex: /^\s*\[?Documentation\]?/,
            caseInsensitive: true,
            push: [{
                token: "comment",
                regex: /^(?!\s*\.\.\.)/,
                next: "pop"
            }, {
                defaultToken: "comment"
            }]
        }, {
            token: "storage.type.method.robot",
            regex: /\[(?:Arguments|Setup|Teardown|Precondition|Postcondition|Template|Return|Timeout)\]/,
            caseInsensitive: true,
            comment: "testcase settings"
        }, {
            token: "storage.type.method.robot",
            regex: /\[Tags\]/,
            caseInsensitive: true,
            push: [{
                token: "storage.type.method.robot",
                regex: /^(?!\s*\.\.\.)/,
                next: "pop"
            }, {
                token: "comment",
                regex: /^\s*\.\.\./
            }, {
                defaultToken: "storage.type.method.robot"
            }],
            comment: "test tags"
        }, {
            token: "constant.language",
            regex: builtinConstantsRegex,
            caseInsensitive: true
        }, {
            token: "entity.name.variable.wrapper",
            regex: /[$@&%]\{\{?/,
            push: [{
                token: "entity.name.variable.wrapper",
                regex: /\}\}?(\s?=)?/,
                next: "pop"
            }, {
                include: "$self"
            }, {
                token: "entity.name.variable",
                regex: /./
            }, {
                defaultToken: "entity.name.variable"
            }]
        }, {
            token: "keyword.control.robot",
            regex: /^[^ \t\*$\|]+|(?<=^\|)\s+[^ \t\*$\|]+/,
            push: [{
                token: "keyword.control.robot",
                regex: /(?=\s{2})|\t|$|\s+(?=\|)/,
                next: "pop"
            }, {
                defaultToken: "keyword.control.robot"
            }]
        }, {
            token: "constant.numeric.robot",
            regex: /\b[0-9]+(?:\.[0-9]+)?\b/
        }, {
            token: "keyword",
            regex: /\s{2,}(for|in range|in|end|else if|if|else|with name)/,
            caseInsensitive: true
        }, {
            token: "storage.type.function",
            // regex: /^\s{2,}[a-z]+?/,
            regex: /^\s{2,}\s+[^ \t\*$@&%\[.\|]+/,
            push: [{
                token: "storage.type.function",
                regex: /(?=\s{2})|\t|$|\s+(?=\|)/,
                next: "pop"
            }, {
                defaultToken: "storage.type.function"
            }]
        }]
    };
    this.normalizeRules();
};

RobotHighlightRules.metadata = {
  fileTypes: ['robot'],
  name: 'Robot',
  scopeName: 'source.robot'
};

oop.inherits(RobotHighlightRules, TextHighlightRules);

exports.RobotHighlightRules = RobotHighlightRules;
});
