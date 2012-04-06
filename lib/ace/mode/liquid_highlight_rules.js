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
 *      Fabian Jakobs <fabian AT ajax DOT org>
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
var CssHighlightRules = require("./css_highlight_rules").CssHighlightRules;
var JavaScriptHighlightRules = require("./javascript_highlight_rules").JavaScriptHighlightRules;
var lang = require("../lib/lang");
var xmlUtil = require("./xml_util");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var LiquidHighlightRules = function() {

    // see: https://developer.mozilla.org/en/Liquid/Reference/Global_Objects
    var functions = lang.arrayToMap(
      // Standard Filters
        ("date|capitalize|downcase|upcase|first|last|join|sort|map|size|escape|" +
         "escape_once|strip_html|strip_newlines|newline_to_br|replace|replace_first|" +
         "truncate|truncatewords|prepend|append|minus|plus|times|divided_by|split"
      ).split("|")
    );

    var keywords = lang.arrayToMap(
      // Standard Tags
        ("capture|endcapture|case|endcase|when|comment|endcomment|" +
        "cycle|for|endfor|in|reversed|if|endif|else|elsif|include|endinclude|unless|endunless|" +
     // Commonly used tags
        "style|text|image|widget|plugin|marker|endmarker|tablerow|endtablerow").split("|")
    );

    var builtinVariables = lang.arrayToMap(
        ['forloop']
        // ("forloop\\.(length|index|index0|rindex|rindex0|first|last)|limit|offset|range" +
        // "tablerowloop\\.(length|index|index0|rindex|rindex0|first|last|col|col0|"+
        // "col_first|col_last)").split("|")
    );

    var definitions = lang.arrayToMap(("assign").split("|"));

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
            start : [{
                token : "variable",
                regex : "{%",
                next : "liquid_start"
            }, {
                token : "variable",
                regex : "{{",
                next : "liquid_start"
            }, {
                token : "meta.tag",
                merge : true,
                regex : "<\\!\\[CDATA\\[",
                next : "cdata"
            }, {
                token : "xml_pe",
                regex : "<\\?.*?\\?>"
            }, {
                token : "comment",
                merge : true,
                regex : "<\\!--",
                next : "comment"
            }, {
                token : "meta.tag",
                regex : "<(?=\\s*script\\b)",
                next : "script"
            }, {
                token : "meta.tag",
                regex : "<(?=\\s*style\\b)",
                next : "style"
            }, {
                token : "meta.tag", // opening tag
                regex : "<\\/?",
                next : "tag"
            }, {
                token : "text",
                regex : "\\s+"
            }, {
                token : "text",
                regex : "[^<]+"
            } ],

            cdata : [ {
                token : "text",
                regex : "\\]\\]>",
                next : "start"
            }, {
                token : "text",
                merge : true,
                regex : "\\s+"
            }, {
                token : "text",
                merge : true,
                regex : ".+"
            } ],

            comment : [ {
                token : "comment",
                regex : ".*?-->",
                next : "start"
            }, {
                token : "comment",
                merge : true,
                regex : ".+"
            } ] ,

            liquid_start : [{
                token: "variable",
                regex: "}}",
                next: "start"
            }, {
                token: "variable",
                regex: "%}",
                next: "start"
            }, {
                token : "string", // single line
                regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token : "string", // single line
                regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
            }, {
                token : "constant.numeric", // hex
                regex : "0[xX][0-9a-fA-F]+\\b"
            }, {
                token : "constant.numeric", // float
                regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
            }, {
                token : "constant.language.boolean",
                regex : "(?:true|false)\\b"
            }, {
                token : function(value) {
                    if (functions.hasOwnProperty(value))
                        return "support.function";
                    else if (keywords.hasOwnProperty(value))
                        return "keyword";
                    else if (builtinVariables.hasOwnProperty(value))
                        return "variable.language";
                    else if (definitions.hasOwnProperty(value))
                        return "keyword.definition";
                    else
                        return "identifier";
                },
                regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }, {
                token : "keyword.operator",
                regex : "\/|\\*|\\-|\\+|=|!=|\\?\\:"
            }, {
                token : "paren.lparen",
                regex : /[\[\({]/
            }, {
                token : "paren.rparen",
                regex : /[\])}]/
            }, {
                token : "text",
                regex : "\\s+"
            }]
    };

    xmlUtil.tag(this.$rules, "tag", "start");
    xmlUtil.tag(this.$rules, "style", "css-start");
    xmlUtil.tag(this.$rules, "script", "js-start");

    this.embedRules(JavaScriptHighlightRules, "js-", [{
        token: "comment",
        regex: "\\/\\/.*(?=<\\/script>)",
        next: "tag"
    }, {
        token: "meta.tag",
        regex: "<\\/(?=script)",
        next: "tag"
    }]);

    this.embedRules(CssHighlightRules, "css-", [{
        token: "meta.tag",
        regex: "<\\/(?=style)",
        next: "tag"
    }]);
};
oop.inherits(LiquidHighlightRules, TextHighlightRules);

exports.LiquidHighlightRules = LiquidHighlightRules;
});
