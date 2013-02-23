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
var JavaScriptHighlightRules = require("./javascript_highlight_rules").JavaScriptHighlightRules;
var XmlHighlightRules = require("./xml_highlight_rules").XmlHighlightRules;
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;
var CssHighlightRules = require("./css_highlight_rules").CssHighlightRules;

function github_embed(tag, prefix) {
    return { // Github style block
        token : "support.function",
        regex : "^```" + tag + "\\s*$",
        next  : prefix + "start"
    };
}

var MarkdownHighlightRules = function() {

    // regexp must not have capturing parentheses
    // regexps are ordered -> the first match is used

    this.$rules = {
        "basic" : [{ // code span `
            token : "support.function",
            regex : "(`+)(.*?[^`])(\\1)"
        }, { // reference
            token : ["text", "constant", "text", "url", "string", "text"],
            regex : "^([ ]{0,3}\\[)([^\\]]+)(\\]:\\s*)([^ ]+)(\\s*(?:[\"][^\"]+[\"])?(\\s*))$"
        }, { // link by reference
            token : ["text", "string", "text", "constant", "text"],
            regex : "(\\[)((?:[[^\\]]*\\]|[^\\[\\]])*)(\\][ ]?(?:\\n[ ]*)?\\[)(.*?)(\\])"
        }, { // link by url
            token : ["text", "string", "text", "markup.underline", "string", "text"],
            regex : "(\\[)"+
                    "(\\[[^\\]]*\\]|[^\\[\\]]*)"+
                    "(\\]\\([ \\t]*)"+
                    "(<?(?:(?:[^\\(]*?\\([^\\)]*?\\)\\S*?)|(?:.*?))>?)"+
                    "((?:[ \t]*\"(?:.*?)\"[ \\t]*)?)"+
                    "(\\))"
        }, { // strong ** __
            token : "string",
            regex : "([*]{2}|[_]{2}(?=\\S))(.*?\\S[*_]*)(\\1)"
        }, { // emphasis * _
            token : "string",
            regex : "([*]|[_](?=\\S))(.*?\\S[*_]*)(\\1)"
        }, { //
            token : ["text", "url", "text"],
            regex : "(<)("+
                      "(?:https?|ftp|dict):[^'\">\\s]+"+
                      "|"+
                      "(?:mailto:)?[-.\\w]+\\@[-a-z0-9]+(?:\\.[-a-z0-9]+)*\\.[a-z]+"+
                    ")(>)"
        }],

        // code block
        "allowBlock": [
            {token : "support.function", regex : "^ {4}.+", next : "allowBlock"},
            {token : "empty", regex : "", next : "start"}
        ],

        "start" : [{
            token : "empty_line",
            regex : '^$',
            next: "allowBlock"
        }, { // h1
            token: "markup.heading.1",
            regex: "^=+(?=\\s*$)"
        }, { // h2
            token: "markup.heading.2",
            regex: "^\\-+(?=\\s*$)"
        }, {
            token : function(value) {
                return "markup.heading." + value.length;
            },
            regex : /^#{1,6}(?=\s*[^ #]|\s+#.)/,
            next : "header"
        },
           github_embed("(?:javascript|js)", "js-"),
           github_embed("xml", "xml-"),
           github_embed("html", "html-"),
           github_embed("css", "css-"),
        { // Github style block
            token : "support.function",
            regex : "^```\\s*[a-zA-Z]*(?:{.*?\\})?\\s*$",
            next  : "githubblock"
        }, { // block quote
            token : "string",
            regex : "^>[ ].+$",
            next  : "blockquote"
        }, { // HR * - _
            token : "constant",
            regex : "^ {0,2}(?:(?: ?\\* ?){3,}|(?: ?\\- ?){3,}|(?: ?\\_ ?){3,})\\s*$",
            next: "allowBlock"
        }, { // list
            token : "markup.list",
            regex : "^\\s{0,3}(?:[*+-]|\\d+\\.)\\s+",
            next  : "listblock-start"
        }, {
            include : "basic"
        }],
        
        "header" : [{
            regex: "$",
            next : "start"
        }, {
            include: "basic"
        }, {
            defaultToken : "markup.heading"
        } ],

        "listblock-start" : [{
            token : "support.variable",
            regex : /(?:\[[ x]\])?/,
            next  : "listblock"
        }],

        "listblock" : [ { // Lists only escape on completely blank lines.
            token : "empty_line",
            regex : "^$",
            next  : "start"
        }, { // list
            token : "markup.list",
            regex : "^\\s{0,3}(?:[*+-]|\\d+\\.)\\s+",
            next  : "listblock-start"
        }, {
            include : "basic", noEscape: true
        }, {
            defaultToken : "markup.list"
        } ],

        "blockquote" : [ { // BLockquotes only escape on blank lines.
            token : "empty_line",
            regex : "^\\s*$",
            next  : "start"
        }, {
            token : "string",
            regex : ".+"
        } ],

        "githubblock" : [ {
            token : "support.function",
            regex : "^```",
            next  : "start"
        }, {
            token : "support.function",
            regex : ".+"
        } ]
    };

    this.embedRules(JavaScriptHighlightRules, "js-", [{
       token : "support.function",
       regex : "^```",
       next  : "start"
    }]);

    this.embedRules(HtmlHighlightRules, "html-", [{
       token : "support.function",
       regex : "^```",
       next  : "start"
    }]);

    this.embedRules(CssHighlightRules, "css-", [{
       token : "support.function",
       regex : "^```",
       next  : "start"
    }]);

    this.embedRules(XmlHighlightRules, "xml-", [{
       token : "support.function",
       regex : "^```",
       next  : "start"
    }]);

    var html = new HtmlHighlightRules().getRules();
    for (var i in html) {
        if (this.$rules[i])
            this.$rules[i] = this.$rules[i].concat(html[i]);
        else
            this.$rules[i] = html[i];
    }

    this.normalizeRules();
};
oop.inherits(MarkdownHighlightRules, TextHighlightRules);

exports.MarkdownHighlightRules = MarkdownHighlightRules;
});
