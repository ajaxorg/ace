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

var XQueryHighlightRules = function() {

    var keywords = "after|ancestor|ancestor-or-self|and|as|ascending|attribute|before|case|cast|castable|child|collation|comment|copy|count|declare|default|delete|descendant|descendant-or-self|descending|div|document|document-node|element|else|empty|empty-sequence|end|eq|every|except|first|following|following-sibling|for|function|ge|group|gt|idiv|if|import|insert|instance|intersect|into|is|item|last|le|let|lt|mod|modify|module|namespace|namespace-node|ne|node|only|or|order|ordered|parent|preceding|preceding-sibling|processing-instruction|rename|replace|return|satisfies|schema-attribute|schema-element|self|some|stable|start|switch|text|to|treat|try|typeswitch|union|unordered|validate|where|with|xquery|contains|paragraphs|sentences|times|words|by|collectionreturn|variable|version|option|when|encoding|toswitch|catch|tumbling|sliding|window|at|using|stemming|collection|schema|while|on|nodes|index|external|then|in|updating|value|of|containsbreak|loop|continue|exit|returning|append|json|position".split("|");

    var nameStartChar = "[_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02ff\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]";
    var nameChar = "[-._A-Za-z0-9\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02ff\u0300-\u037D\u037F-\u1FFF\u200C\u200D\u203f\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]";
    var ncname = nameStartChar + nameChar + "*";
    var qname = "(?:" + ncname + ":)?" + ncname;
    var eqname = "(?:(?:Q{.*}" + ncname + ")|(?:" + qname + "))";

    // regexp must not have capturing parentheses
    // regexps are ordered -> the first match is used
    this.$rules = {
        start: [{
            token: "support.type",
            regex: "<\\!\\[CDATA\\[",
            next: "cdata"
        }, {
            token: "xml-pe",
            regex: "<\\?",
            next: "pi"
        }, {
            token: "comment",
            regex: "<\\!--",
            next: "xmlcomment"
        }, {
            token: "comment.doc",
            regex: "\\(:~",
            next: "comment.doc"
        },
        {
            token: "comment",
            regex: "\\(:",
            next: "comment"
        },
        {
            token: ["text", "meta.tag"], // opening tag
            regex: "(<\\/?)(" + qname + ")",
            next: "tag"
        }, {
            token: "constant", // number
            regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
        }, {
            token: "variable", // variable
            regex: "\\$" + eqname
        }, {
            token: "string",
            regex: "'",
            next:  "apos-string"
        }, {
            token: "string",
            regex: '"',
            next:  "quot-string"
        }, {
            token: "text",
            regex: "\\s+"
        }, {
            token: function(match) {
              if(keywords.indexOf(match.toLowerCase()) !== -1) {
                return "keyword"
              } else {
                return "support.function"
              }
            }, 
            regex: eqname
        }, {
            token: "keyword.operator",
            regex: "\\*|:=|=|<|>|\\-|\\+"
        }, {
            token: "lparen",
            regex: "[[({]"
        }, {
            token: "rparen",
            regex: "[\\])}]"
        }],
    
        tag: [{
            token: "text",
            regex: "\\/?>",
            next: "start"
        }, {
            token: ["text", "meta.tag"],
            regex: "(<\\/)(" + qname + ")",
            next:  "start"
        }, {
            token: "meta.tag",
            regex: qname
        }, {
            token: "text",
            regex: "\\s+"
        }, {
            token: "string",
            regex: "'",
            next:  "apos-attr"
        }, {
           token: "string",
           regex: '"',
           next:  "quot-attr"
        }, {
            token: "string",
            regex: "'.*?'"
        }, {
            token: "text",
            regex: "="
        }],
        
        pi: [{
          token: "xml-pe",
          regex: ".*\\?>",
          next: "start"
        },
        {
          token: "xml-pe",
          regex: ".*"
        }],

        cdata: [{
            token: "support.type",
            regex: "\\]\\]>",
            next: "start"
        }, {
            token: "support.type",
            regex: "\\s+"
        }, {
            token: "support.type",
            regex: "(?:[^\\]]|\\](?!\\]>))+"
        }],
        
        "comment.doc": [
          {
            token: "comment.doc",
            regex: ":\\)",
            next:  "start"
          }, {
            token: "comment.doc.tag",
            regex: "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[a-zA-Z]{2,6}"
          }, {
            token : "comment.doc.tag",
            regex : "@[\\w\\d_]+"
          }, {
              token : "comment.doc",
              regex : "\\s+"
          }, {
              token : "comment.doc.tag",
              regex : "TODO"
          }, {
              token : "comment.doc",
              regex : "[^@:^\\s]+"
          }, {
              token : "comment.doc",
              regex : "."
          }
        ], 

        comment: [{
            token: "comment",
            regex: ".*:\\)",
            next: "start"
        }, {
            token: "comment",
            regex: ".+"
        }],
        
        xmlcomment: [{
            token: "comment",
            regex: ".*?-->",
            next: "start"
        }, {
            token: "comment",
            regex: ".+"
        }],

        "apos-string": [{
          token: "string",
          regex: ".*'",
          next: "start"
        }, {
          token: "string",
          regex: ".*"
        }],

        "quot-string": [{
          token: "string",
          regex: '.*"',
          next: "start"
        }, {
          token: "string",
          regex: ".*"
        }],

        "apos-attr": [{
          token: "string",
          regex: ".*'",
          next: "tag"
        }, {
          token: "string",
          regex: ".*"
        }],

        "quot-attr": [{
          token: "string",
          regex: '.*"',
          next: "tag"
        }, {
          token: "string",
          regex: ".*"
        }]
    };
};

oop.inherits(XQueryHighlightRules, TextHighlightRules);

exports.XQueryHighlightRules = XQueryHighlightRules;
});
