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

    var keywordMapper = this.createKeywordMapper({
        keyword: "after|ancestor|ancestor-or-self|and|as|ascending|attribute|before|case|cast|castable|child|collation|comment|copy|count|declare|default|delete|descendant|descendant-or-self|descending|div|document|document-node|element|else|empty|empty-sequence|end|eq|every|except|first|following|following-sibling|for|function|ge|group|gt|idiv|if|import|insert|instance|intersect|into|is|item|last|le|let|lt|mod|modify|module|namespace|namespace-node|ne|node|only|or|order|ordered|parent|preceding|preceding-sibling|processing-instruction|rename|replace|return|satisfies|schema-attribute|schema-element|self|some|stable|start|switch|text|to|treat|try|typeswitch|union|unordered|validate|where|with|xquery|contains|paragraphs|sentences|times|words|by|collectionreturn|variable|version|option|when|encoding|toswitch|catch|tumbling|sliding|window|at|using|stemming|collection|schema|while|on|nodes|index|external|then|in|updating|value|of|containsbreak|loop|continue|exit|returning|append|json|position"
    }, "identifier");

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
            token: "text", // opening tag
            regex: "<\\/?",
            next: "tag"
        }, {
            token: "constant", // number
            regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
        }, {
            token: "variable", // variable
            regex: "\\$[a-zA-Z_][a-zA-Z0-9_\\-:]*\\b"
        }, {
            token: "string",
            regex: '".*?"'
        }, {
            token: "string",
            regex: "'.*?'"
        }, {
            token: "string",
            regex: "'.*?",
            next:  "apos-string"
        }, {
            token: "string",
            regex: '".*?',
            next:  "quot-string"
        }, {
            token: "text",
            regex: "\\s+"
        }, {
            token: "support.function",
            regex: "\\w[\\w+_\\-:]+(?=\\()"
        }, {
            token: keywordMapper,
            regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token: "keyword.operator",
            regex: "\\*|=|<|>|\\-|\\+"
        }, {
            token: "lparen",
            regex: "[[({]"
        }, {
            token: "rparen",
            regex: "[\\])}]"
        }],
    
        tag: [{
            token: "text",
            regex: ">",
            next: "start"
        }, {
            token: "meta.tag",
            regex: "[-_a-zA-Z0-9:]+"
        }, {
            token: "text",
            regex: "\\s+"
        }, {
            token: "string",
            regex: '".*?"'
        }, {
            token: "string",
            regex: "'.*?'"
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
          regex: ".*?'",
          next: "start"
        }, {
          token: "string",
          regex: ".*"
        }],

        "quot-string": [{
          token: "string",
          regex: '.*?"',
          next: "start"
        }, {
          token: "string",
          regex: ".*"
        }]
    };
};

oop.inherits(XQueryHighlightRules, TextHighlightRules);

exports.XQueryHighlightRules = XQueryHighlightRules;
});
