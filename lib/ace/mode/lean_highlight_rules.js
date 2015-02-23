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
var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var leanHighlightRules = function() {

    var keywordControls = (
        ["import", "tactic_hint", "protected", "find_decl",
         "private", "opaque", "definition", "renaming", "hiding", "exposing",
         "parameter", "parameters", "begin", "proof", "qed", "conjecture", "premise", "premises",
         "constant", "constants", "example", "attribute", "local",
         "hypothesis", "lemma", "corollary", "variable", "variables", "print",
         "theorem", "context", "open", "as", "export", "axiom", "inductive",
         "with", "structure", "record", "universe", "universes", "alias", "help", "environment",
         "options", "precedence", "postfix", "prefix", "calc_trans",
         "calc_subst", "calc_refl", "infix", "infixl", "infixr", "notation",
         "eval", "check", "exit", "end", "using", "namespace",
         "section", "set_option", "omit", "classes", "instances", "coercions", "raw",
         "add_rewrite", "extends", "calc", "have", "obtains", "show", "by", "in", "let",
         "forall", "fun", "exists", "if", "then", "else", "assume", "match",
         "take", "obtain", "from", "axioms", "fields"].join("|")
    );

    var storageType = (
        ["Prop", "Type", "Type'", "Type₊", "Type₁", "Type₂", "Type₃"].join("|")
    );

    var storageModifiers = (
        "\\[(" +
            ["persistent", "notation", "parsing-only", "visible", "instance", "class", "prefix", "axioms", "fields",
             "multiple-instances", "classes", "instances", "coercions", "options", "trust",
             "coercion", "reducible", "irreducible", "raw"].join("|") +
            ")\\]"
    );

    var keywordOperators = (
        [].join("|")
    );

    var builtinConstants = (
        "NULL|true|false|TRUE|FALSE"
    );

    var keywordMapper = this.$keywords = this.createKeywordMapper({
        "keyword.control" : keywordControls,
        "storage.type" : storageType,
        "keyword.operator" : keywordOperators,
        "variable.language": "sorry",
        "constant.language": builtinConstants
    }, "identifier");

    var identifierRe = "[A-Za-z_\u03b1-\u03ba\u03bc-\u03fb\u1f00-\u1ffe\u2100-\u214f][A-Za-z0-9_'\u03b1-\u03ba\u03bc-\u03fb\u1f00-\u1ffe\u2070-\u2079\u207f-\u2089\u2090-\u209c\u2100-\u214f]*";
    var operatorRe = new RegExp(["#", "@", "->", "∼", "↔", "/", "==", "=", ":=", "<->",
                                 "/\\", "\\/", "∧", "∨", "≠", "<", ">", "≤", "≥", "¬",
                                 "<=", ">=", "⁻¹", "⬝", "▸", "\\+", "\\*", "-", "/",
                                 "λ", "→", "∃", "∀", ":="].join("|"));
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [
            {
                token : "comment", // single line comment "--"
                regex : "--.*$"
            },
            DocCommentHighlightRules.getStartRule("doc-start"),
            {
                token : "comment", // multi line comment "/-"
                regex : "\\/-",
                next : "comment"
            }, {
                token : "string", // single line
                regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token : "string", // multi line string start
                regex : '["].*\\\\$',
                next : "qqstring"
            }, {
                token : "string", // single line
                regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
            }, {
                token : "string", // multi line string start
                regex : "['].*\\\\$",
                next : "qstring"
            }, {
                token : "constant.numeric", // hex
                regex : "0[xX][0-9a-fA-F]+(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"
            }, {
                token : "constant.numeric", // float
                regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"
            }, {
                token : "storage.modifier",
                regex : storageModifiers
            }, {
                token : "keyword", // pre-compiler directives
                regex : "#\\s*(?:include|import|pragma|line|define|undef|if|ifdef|else|elif|ifndef)\\b",
                next  : "directive"
            }, {
                token : "keyword", // special case pre-compiler directive
                regex : "(?:#\\s*endif)\\b"
            }, {
                token : keywordMapper,
                regex : identifierRe
            }, {
                token : "operator",
                regex : operatorRe
            }, {
              token : "punctuation.operator",
              regex : "\\?|\\:|\\,|\\;|\\."
            }, {
                token : "paren.lparen",
                regex : "[[({]"
            }, {
                token : "paren.rparen",
                regex : "[\\])}]"
            }, {
                token : "text",
                regex : "\\s+"
            }
        ],
        "comment" : [
            {
                token : "comment", // closing comment
                regex : ".*?-\\/",
                next : "start"
            }, {
                token : "comment", // comment spanning whole line
                regex : ".+"
            }
        ],
        "qqstring" : [
            {
                token : "string",
                regex : '(?:(?:\\\\.)|(?:[^"\\\\]))*?"',
                next : "start"
            }, {
                token : "string",
                regex : '.+'
            }
        ],
        "qstring" : [
            {
                token : "string",
                regex : "(?:(?:\\\\.)|(?:[^'\\\\]))*?'",
                next : "start"
            }, {
                token : "string",
                regex : '.+'
            }
        ],
        "directive" : [
            {
                token : "constant.other.multiline",
                regex : /\\/
            },
            {
                token : "constant.other.multiline",
                regex : /.*\\/
            },
            {
                token : "constant.other",
                regex : "\\s*<.+?>",
                next : "start"
            },
            {
                token : "constant.other", // single line
                regex : '\\s*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]',
                next : "start"
            },
            {
                token : "constant.other", // single line
                regex : "\\s*['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']",
                next : "start"
            },
            // "\" implies multiline, while "/" implies comment
            {
                token : "constant.other",
                regex : /[^\\\/]+/,
                next : "start"
            }
        ]
    };

    this.embedRules(DocCommentHighlightRules, "doc-",
        [ DocCommentHighlightRules.getEndRule("start") ]);
};

oop.inherits(leanHighlightRules, TextHighlightRules);

exports.leanHighlightRules = leanHighlightRules;
});
