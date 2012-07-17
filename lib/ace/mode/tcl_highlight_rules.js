/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Christoph Hochreiner <ch.hochreiner AT gmail DOT com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var lang = require("../lib/lang");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var TclHighlightRules = function() {

    var builtinFunctions = lang.arrayToMap(
        ("").split("|")
        
    ); 
    this.$rules = {
        "start" : [
           {
                token : "comment",
                merge : true,
                regex : "#.*\\\\$",
                next  : "commentfollow"
            }, {
                token : "comment",
                regex : "#.*$"
            }, {
                token : "support.function",
                regex : '[\\\\]$',
                next  : "splitlineStart"
            }, {
                token : "text",
                regex : '[\\\\](?:["]|[{]|[}]|[[]|[]]|[$]|[\])'
            }, {
                token : "text", // last value before command
                regex : '^|[^{][;][^}]|[/\r/]',
                next  : "commandItem"
            }, {
                token : "string", // single line
                regex : '[ ]*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token : "string", // multi line """ string start
                merge : true,
                regex : '[ ]*["]',
                next  : "qqstring"
            }, {
                token : "variable.instancce", // variable xotcl with braces
                merge : true,
                regex : "[$]",
                next  : "variable"
            }, {
                token : "support.function",
                regex : "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|{\\*}|;|::"
            }, {
                token : function(value) {
                    if (builtinFunctions.hasOwnProperty(value))
                        return "keyword";
                    else
                        return "identifier";
                },
                regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }, {
                token : "paren.lparen",
                regex : "[[{]",
                next  : "commandItem"
            }, {
                token : "paren.lparen",
                regex : "[(]"
            },  {
                token : "paren.rparen",
                regex : "[\\])}]"
            }, {
                token : "text",
                regex : "\\s+"
            }
        ],
        "commandItem" : [
            {
                token : "comment",
                merge : true,
                regex : "#.*\\\\$",
                next  : "commentfollow"
            }, {
                token : "comment",
                regex : "#.*$",
                next  : "start"
            }, {
                token : "string", // single line
                regex : '[ ]*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token : "variable.instancce", // variable xotcl with braces
                merge : true,
                regex : "[$]",
                next  : "variable"
            }, {
                token : "support.function",
                regex : "(?:[:][:])[a-zA-Z0-9_/]+(?:[:][:])",
                next  : "commandItem"
            }, {
                token : "support.function",
                regex : "[a-zA-Z0-9_/]+(?:[:][:])",
                next  : "commandItem"
            }, {
                token : "support.function",
                regex : "(?:[:][:])",
                next  : "commandItem"
            }, {
                token : "support.function",
                regex : "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|{\\*}|;|::"
            }, {
                token : "keyword",
                regex : "[a-zA-Z0-9_/]+",
                next  : "start"
            } ],
        "commentfollow" : [ 
            {
                token : "comment",
                regex : ".*\\\\$",
                next  : "commentfollow"
            }, {
                token : "comment",
                merge : true,
                regex : '.+',
                next  : "start"
        } ],
        "splitlineStart" : [ 
            {
                token : "text",
                regex : "^.",
                next  : "start"
            }],
        "variable" : [ 
            {
                token : "variable.instancce", // variable xotcl with braces
                regex : "(?:[:][:])?(?:[a-zA-Z_]|\d)+(?:(?:[:][:])?(?:[a-zA-Z_]|\d)+)?(?:[(](?:[a-zA-Z_]|\d)+[)])?",
                next : "start"
            }, {
                token : "variable.instancce", // variable tcl
                regex : "(?:[a-zA-Z_]|\d)+(?:[(](?:[a-zA-Z_]|\d)+[)])?",
                next  : "start"
            }, {
                token : "variable.instancce", // variable tcl with braces
                regex : "{?(?:[a-zA-Z_]|\d)+}?",
                next  : "start"
            }],  
        "qqstring" : [ {
            token : "string", // multi line """ string end
            regex : '(?:[^\\\\]|\\\\.)*?["]',
            next : "start"
        }, {
            token : "string",
            merge : true,
            regex : '.+'
        } ]
    };
};

oop.inherits(TclHighlightRules, TextHighlightRules);

exports.TclHighlightRules = TclHighlightRules;
});
