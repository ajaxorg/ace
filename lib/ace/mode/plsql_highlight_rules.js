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

define(
    function(require, exports, module) {
        "use strict";

        var oop = require("../lib/oop");
        var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

        var PLSQLHighlightRules = function() {

            var builtinFunctions = (
                'lag lead rank ' +
                'avg count min max sum ' +
                'length lpad rpad ltrim trim rtrim trunc ' +
                'lower translate upper ' +
                'coalesce nullif nvl ' +
                'abs ceil floor log mod sign sqrt power ' +
                'substr regexp_substr instr regexp_instr ' +
                'to_char to_clob to_date to_number to_timestamp'
            );

            var keywords = (
                'create or replace package body is as begin end ' +
                'exception raise others ' +
                'constant pragma ' +
                'in out nocopy ' +
                'function procedure return ' +
                'if then else elsif end case when ' +
                'for while loop exit continue ' +
                '%found %rowcount %type ' +
                'sqlerrm sqlcode ' +
                'select from join where insert into values update set delete ' +
                'group by order asc desc having ' +
                'unique distinct ' +
                'minus intersect union ' +
                'exists'
            );

            var builtinConstants = (
                'true false null'
            );

            var builtinTypes = (
                'boolean ' +
                'date timestamp with local timezone ' +
                'char varchar varchar2 nvarchar ' +
                'number pls_integer binary_integer integer long raw rowid ' +
                'blob clob nclob log'
            );

            var keywordMapper = this.createKeywordMapper(
                {   "keyword":              keywords,
                    "constant.language":    builtinConstants,
                    "storage.type":         builtinTypes,
                    "support.function":     builtinFunctions
                },
                "identifier",
                true,
                " "
            );

            this.$rules = {
                start: [
                    {   token: 'comment.block',
                        regex: '/\\*',
                        push: [ 
                            {   token: 'comment.block',
                                regex: '\\*/',
                                next: 'pop'
                            },
                            {   defaultToken: 'comment.block' }
                        ]
                    },
                    {   token: 'comment.block.documentation',
                        regex: '^\\s*--\\+-*\\s*$',
                        push: [
                            {   token: 'comment.block.documentation',
                                regex: '^(?!\\s*\\-\\-)|^\\s*--\\+-*\\s*$',
                                next: 'pop'
                            },
                            {   token: 'comment.block.documentation',
                                regex: '--.*'
                            },
                            {   defaultToken: 'comment.block.documentation'   }
                        ]
                    },
                    {   token: 'comment.line',
                        regex: '--.*'
                    },
                    {   token : keywordMapper,
                        regex : '[a-zA-Z_$][a-zA-Z0-9_$#]*\\b'
                    },
                    {   token : "keyword.operator",
                        regex : 'in|between|like|not|and|or|=|!=|<>|<=|>=|<|>|:=|-|\\+|\\*|/'
                    },
                    {   token: 'constant.numeric',
                        regex: '\\.\\d+\\b|\\b\\d+(?:\\.\\d+)?(?:e(?:\\+|-)?\\d+)?\\b'
                    },
                    {   token: 'string',
                        regex: '\'[^\'\\\\]*\''
                    },
                    {   token: 'string',
                        regex: '"[^"\\\\]*"'
                    }
                ]
            }
            
            this.normalizeRules();
        };

        oop.inherits(PLSQLHighlightRules, TextHighlightRules);

        exports.PLSQLHighlightRules = PLSQLHighlightRules;
    }
);