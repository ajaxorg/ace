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
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var LiquidLangHighlightRules = function() {

        // https://github.com/Shopify/liquid/wiki/Liquid-for-Designers
        var builtinFunctions = (
          // Default Filters
          "abs|append|capitalize|ceil|compact|date|default|divided_by|downcase|" +
          "escape|escape_once|first|floor|join|last|lstrip|map|minus|modulo|" +
          "newline_to_br|plus|prepend|remove|remove_first|replace|replace_first|" +
          "reverse|round|rstrip|size|slice|sort|sort_natural|split|strip|" +
          "strip_html|strip_newlines|times|truncate|truncatewords|uniq|upcase|" +
          "url_decode|url_encode"
        );

        var keywords = (
          // Standard Tags
          "capture|endcapture|case|endcase|when|cycle|for|" +
          "endfor|in|reversed|if|endif|else|elsif|include|endinclude|unless|" +
          "endunless|break|continue|" +
          // Commonly used tags
          "style|text|image|widget|plugin|marker|endmarker|tablerow|endtablerow"
        );

        var builtinVariables = 'forloop|tablerowloop';
            // "forloop\\.(length|index|index0|rindex|rindex0|first|last)|limit|offset|range" +
            // "tablerowloop\\.(length|index|index0|rindex|rindex0|first|last|col|col0|"+
            // "col_first|col_last)"

        var definitions = ("assign");

        var keywordMapper = this.createKeywordMapper({
            "variable.language": builtinVariables,
            "keyword": keywords,
            "support.function": builtinFunctions,
            "keyword.definition": definitions
        }, "identifier");

        this.$rules = {
            "start" : [{
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
                token : keywordMapper,
                regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }, {
                token : "keyword.operator",
                regex : "/|\\*|\\-|\\+|=|!=|\\?\\:"
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
    };
    oop.inherits(LiquidLangHighlightRules, TextHighlightRules);
    exports.LiquidLangHighlightRules = LiquidLangHighlightRules;



    var LiquidHighlightRules = function() {
        TextHighlightRules.call(this);

        // TODO: DRY - used in "./yaml_liquid_highlight_rules" and "./html_liquid_highlight_rules"
        var startRules = [{
            token : "comment.start.liquid",
            regex : "{% comment %}",
            push  : [{
                token        : "comment.end.liquid",
                regex        : "{% endcomment %}",
                next         : "pop",
                defaultToken : "comment"
            }]
        }, {
            // TODO: [optional] Inbetween raw tags text highlighting should still be 
            // present but no liquid highlighting. (text has no specific highlighting)
            token : "support.constant",
            regex : "{% raw %}",
            push  : [{
                token : "support.constant",
                regex : "{% endraw %}",
                next  : "pop"
            }]
        }, {
            token : "support.liquid_tag.start",
            regex : "{(?:{|%) ",
            push  : "liquid-start"
        }];

        var endRules = [{
                token : "support.liquid_tag.end",
                regex : " (?:}|%)}",
                next  : "pop"
        }];

        for (var key in this.$rules)
            this.$rules[key].unshift.apply(this.$rules[key], startRules);

        this.embedRules(LiquidLangHighlightRules, "liquid-", endRules, ["start"]);

        this.normalizeRules();
    };
    oop.inherits(LiquidHighlightRules, TextHighlightRules);
    exports.LiquidHighlightRules = LiquidHighlightRules;
});
