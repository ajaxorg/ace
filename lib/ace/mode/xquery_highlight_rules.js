/*
 *  eXide - web-based XQuery IDE
 *  
 *  Copyright (C) 2011 Wolfgang Meier
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var lang = require("../lib/lang");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var XQueryHighlightRules = function() {

  var keywords = lang.arrayToMap(
    ("return|for|let|where|order|by|declare|function|variable|xquery|version|option|namespace|import|module|when|encoding|" +
     "switch|default|try|catch|group|tumbling|sliding|window|start|end|at|only|" +
     "using|stemming|" +
     "while|" + 
     "external|" +
     "if|then|else|as|and|or|typeswitch|case|ascending|descending|empty|in|count|updating|insert|delete|replace|value|node|attribute|text|element|into|of|with|contains").split("|")
    );

    // regexp must not have capturing parentheses
    // regexps are ordered -> the first match is used

    this.$rules = {
        start : [ {
            token : "text",
            regex : "<\\!\\[CDATA\\[",
            next : "cdata"
        }, {
            token : "xml_pe",
            regex : "<\\?.*?\\?>"
        }, {
            token : "comment",
            regex : "<\\!--",
            next : "comment"
    }, {
      token : "comment",
      regex : "\\(:",
      next : "comment"
        }, {
            token : "text", // opening tag
            regex : "<\\/?",
            next : "tag"
        }, {
            token : "constant", // number
            regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
    }, {
            token : "variable", // variable
            regex : "\\$[a-zA-Z_][a-zA-Z0-9_\\-:]*\\b"
    }, {
      token: "string",
      regex : '".*?"'
    }, {
      token: "string",
      regex : "'.*?'"
        }, {
            token : "text",
            regex : "\\s+"
        }, {
            token: "support.function",
            regex: "\\w[\\w+_\\-:]+(?=\\()"
        }, {
      token : function(value) {
            if (keywords[value])
                return "keyword";
            else
                return "identifier";
      },
      regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
    }, {
            token: "keyword.operator",
            regex: "\\*|=|<|>|\\-|\\+|and|or|eq|ne|lt|gt"
        }, {
            token: "lparen",
            regex: "[[({]"
        }, {
            token: "rparen",
            regex: "[\\])}]"
        } ],

        tag : [ {
            token : "text",
            regex : ">",
            next : "start"
        }, {
            token : "meta.tag",
            regex : "[-_a-zA-Z0-9:]+"
        }, {
            token : "text",
            regex : "\\s+"
        }, {
            token : "string",
            regex : '".*?"'
        }, {
            token : "string",
            regex : "'.*?'"
        } ],

        cdata : [ {
            token : "text",
            regex : "\\]\\]>",
            next : "start"
        }, {
            token : "text",
            regex : "\\s+"
        }, {
            token : "text",
            regex : "(?:[^\\]]|\\](?!\\]>))+"
        } ],

        comment : [ {
            token : "comment",
            regex : ".*?-->",
            next : "start"
        }, {
      token: "comment",
      regex : ".*:\\)",
      next : "start"
        }, {
            token : "comment",
            regex : ".+"
    } ]
    };
};

oop.inherits(XQueryHighlightRules, TextHighlightRules);

exports.XQueryHighlightRules = XQueryHighlightRules;
});
