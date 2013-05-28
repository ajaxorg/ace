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
var lang = require("../lib/lang");
var CssHighlightRules = require("./css_highlight_rules").CssHighlightRules;
var JavaScriptHighlightRules = require("./javascript_highlight_rules").JavaScriptHighlightRules;
var xmlUtil = require("./xml_util");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var tagMap = lang.createMap({
    a           : 'anchor',
    button      : 'form',
    form        : 'form',
    img         : 'image',
    input       : 'form',
    label       : 'form',
    script      : 'script',
    select      : 'form',
    textarea    : 'form',
    style       : 'style',
    table       : 'table',
    tbody       : 'table',
    td          : 'table',
    tfoot       : 'table',
    th          : 'table',
    tr          : 'table'
});

var HtmlHighlightRules = function() {
    var keywords = (
        // Completable tags
        "<base|<link|<meta|<style|"+
        "<script|<blockquote|<a|"+
        "<abbr|<img|<iframe|<embed|<object|<param|<video|<audio|<source|<track|<canvas|"+
        "<form|<label|<input|<button|<select|<optgroup|<option|<textarea|"+
        // All the tags (without <)
        "html|head|title|base|link|meta|style|script|noscript|"+
        "body|section|nav|article|aside|h1|h2|h3|h4|h5|h6|"+
        "header|footer|address|main|p|hr|ol|ul|li|dl|dt|dd|"+
        "pre|div|blockquote|figure|figcaption|"+
        "a|em|s|q|i|b|u|rt|rp|bdi|bdo|br|wbr|"+
        "strong|small|cite|dfn|abbr|data|time|code|var|samp|mark|ruby|span|"+
        "ins|del|img|iframe|embed|object|param|video|audio|source|track|canvas|map|area|svg|math|"+
        "table|caption|colgroup|col|tbody|thead|tfoot|tr|td|th|"+
        "form|fieldset|legend|label|input|button|select|datalist|optgroup|option|textarea|keygen|output|progress|meter|"+
        "details|summary|command|menu|"+
        // Global attributes
        "accesskey|class|contenteditable|contextmenu|dir|draggable|dropzone|hidden|"+
        "id|itemid|itemprop|itemref|itemscope|itemtype|lang|spellcheck|style|tabindex|"+
        // Other common attributes
        "name|type|href|label|src|data|"+
        ""
    );

    // Completion Wrappers for XML
    //----------------------------
    var lt = "<";
    var gt = ">";
    var bs = "/";
    var sp = " ";
    var nl = "\n";
    var empty = "";

    // Completing attributes
    function completeAttributes(that) {
        if (that.attributes === null)
            return empty;
        if (typeof that.attributes === "string")
            return that.attributes;
        var attributes = empty;
        for (var k in that.attributes) {
            attributes += sp;
            attributes += k + "=\"" + that.attributes[k] + "\"";
        }
        that.attributes = attributes;
        return that.attributes;
    }

    // <tag attributes... ></tag>
    function tagClose(tag) {
        var attributes = completeAttributes(this);
        return tag + attributes + gt +
               // nl + nl +
               tag.replace(lt, lt + bs) + gt;
    }
    // <tag attributes... />
    function selfClose(tag) {
        var attributes = completeAttributes(this);
        return tag + attributes + bs + gt;
    }
    // <tag attributes... >
    function noEndClose(tag) {
        var attributes = completeAttributes(this);
        return tag + attributes + gt;
    }

    // keywordsWrappers object to be added to the mode
    this.keywordsWrappers = {
        // We could have wrappers
        // for html, head, title,
        // but they don't have
        // attributes, so I'm not
        // sure it will be useful.
        "<base" : {
            attributes : { href : empty, target : "_blank" },
            wrapper : noEndClose
        },
        "<link" : {
            attributes : { href : empty, rel : "stylesheet", type : "text/css", title : empty },
            wrapper : noEndClose
        },
        "<meta" : {
            attributes : { charset : "utf-8" },
            wrapper : noEndClose
        },
        "<style" : {
            attributes : { type : "text/css" },
            wrapper : tagClose
        },
        "<script" : {
            attributes : { type : "text/javascript", src : empty },
            wrapper : tagClose
        },
        "<blockquote" : {
            attributes : { cite : empty },
            wrapper : tagClose
        },
        "<a" : {
            attributes : { href : empty, rel : empty, target : "_blank" },
            wrapper : tagClose
        },
        "<abbr" : {
            attributes : { title : empty },
            wrapper : tagClose
        },
        "<img" : {
            attributes : { src : empty, alt : empty },
            wrapper : tagClose
        },
        "<iframe" : {
            attributes : { src : empty, width : empty, height : empty },
            wrapper : tagClose
        },
        "<embed" : {
            attributes : { src : empty, width : empty, height : empty, type : empty },
            wrapper : tagClose
        },
        "<object" : {
            attributes : { data : empty, type : "application/x-shockwave-flash" },
            wrapper : tagClose
        },
        "<param" : {
            attributes : { name : empty, value : empty },
            wrapper : noEndClose
        },
        "<video" : {
            attributes : { src : empty, poster : empty },
            wrapper : tagClose
        },
        "<audio" : {
            attributes : { src : empty },
            wrapper : tagClose
        },
        "<source" : {
            attributes : { src : empty, type : empty },
            wrapper : noEndClose
        },
        "<track" : {
            attributes : { kind : empty, src : empty, srclang : empty, label : empty },
            wrapper : noEndClose
        },
        "<canvas" : {
            attributes : { id : empty, width : empty, height : empty },
            wrapper : tagClose
        },
        "<form" : {
            attributes : { action : empty, method : empty },
            wrapper : tagClose
        },
        "<label" : {
            attributes : { for : empty },
            wrapper : tagClose
        },
        "<input" : {
            attributes : { type : "text", name : empty, value : empty },
            wrapper : noEndClose
        },
        "<button" : {
            attributes : { name : empty },
            wrapper : tagClose
        },
        "<select" : {
            attributes : { name : empty },
            wrapper : tagClose
        },
        "<optgroup" : {
            attributes : { label : empty },
            wrapper : tagClose
        },
        "<option" : {
            attributes : { value : empty },
            wrapper : tagClose
        },
        "<textarea" : {
            attributes : { name : empty, rows : empty, cols : empty },
            wrapper : tagClose
        },
        "<menu" : {
            attributes : { type : empty, label : empty },
            wrapper : tagClose
        }
    };

    var keywordMapper = this.$keywords = this.createKeywordMapper({
        "variable.language": "this",
        "keyword": keywords,
    }, "identifier");


    // regexp must not have capturing parentheses
    // regexps are ordered -> the first match is used
    this.$rules = {
        start : [{
            token : "text",
            regex : "<\\!\\[CDATA\\[",
            next : "cdata"
        }, {
            token : "xml-pe",
            regex : "<\\?.*?\\?>"
        }, {
            token : "comment",
            regex : "<\\!--",
            next : "comment"
        }, {
            token : "xml-pe",
            regex : "<\\!.*?>"
        }, {
            token : "meta.tag",
            regex : "<(?=script\\b)",
            next : "script"
        }, {
            token : "meta.tag",
            regex : "<(?=style\\b)",
            next : "style"
        }, {
            token : "meta.tag", // opening tag
            regex : "<\\/?",
            next : "tag"
        }, {
            token : "text",
            regex : "\\s+"
        }, {
            token : "constant.character.entity",
            regex : "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)"
        }],
    
        cdata : [ {
            token : "text",
            regex : "\\]\\]>",
            next : "start"
        } ],

        comment : [ {
            token : "comment",
            regex : ".*?-->",
            next : "start"
        }, {
            defaultToken : "comment"
        } ]
    };
    
    xmlUtil.tag(this.$rules, "tag", "start", tagMap);
    xmlUtil.tag(this.$rules, "style", "css-start", tagMap);
    xmlUtil.tag(this.$rules, "script", "js-start", tagMap);
    
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

oop.inherits(HtmlHighlightRules, TextHighlightRules);

exports.HtmlHighlightRules = HtmlHighlightRules;
});
