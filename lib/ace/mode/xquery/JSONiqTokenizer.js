// This file was generated on Thu May 2, 2013 15:11 (UTC+01) by REx v5.25 which is Copyright (c) 1979-2013 by Gunther Rademacher <grd@gmx.net>
// REx command line: JSONiqTokenizer.ebnf -ll 2 -backtrack -tree -javascript -a xqlint

                                                            // line 2 "JSONiqTokenizer.ebnf"
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

                                                            define(function(require, exports, module){
                                                            var JSONiqTokenizer = exports.JSONiqTokenizer = function JSONiqTokenizer(string, parsingEventHandler)
                                                            {
                                                              init(string, parsingEventHandler);
                                                            // line 40 "JSONiqTokenizer.js"
  var self = this;

  this.ParseException = function(b, e, s, o, x)
  {
    var
      begin = b,
      end = e,
      state = s,
      offending = o,
      expected = x;

    this.getBegin = function() {return begin;};
    this.getEnd = function() {return end;};
    this.getState = function() {return state;};
    this.getExpected = function() {return expected;};
    this.getOffending = function() {return offending;};

    this.getMessage = function()
    {
      return offending < 0 ? "lexical analysis failed" : "syntax error";
    };
  };

  function init(string, parsingEventHandler)
  {
    eventHandler = parsingEventHandler;
    input = string;
    size = string.length;
    reset(0, 0, 0);
  }

  this.getInput = function()
  {
    return input;
  };

  function reset(l, b, e)
  {
            b0 = b; e0 = b;
    l1 = l; b1 = b; e1 = e;
    end = e;
    eventHandler.reset(input);
  }

  this.getOffendingToken = function(e)
  {
    var o = e.getOffending();
    return o >= 0 ? JSONiqTokenizer.TOKEN[o] : null;
  };

  this.getExpectedTokenSet = function(e)
  {
    var expected;
    if (e.getExpected() < 0)
    {
      expected = JSONiqTokenizer.getTokenSet(- e.getState());
    }
    else
    {
      expected = [JSONiqTokenizer.TOKEN[e.getExpected()]];
    }
    return expected;
  };

  this.getErrorMessage = function(e)
  {
    var tokenSet = this.getExpectedTokenSet(e);
    var found = this.getOffendingToken(e);
    var prefix = input.substring(0, e.getBegin());
    var lines = prefix.split("\n");
    var line = lines.length;
    var column = lines[line - 1].length + 1;
    var size = e.getEnd() - e.getBegin();
    return e.getMessage()
         + (found == null ? "" : ", found " + found)
         + "\nwhile expecting "
         + (tokenSet.length == 1 ? tokenSet[0] : ("[" + tokenSet.join(", ") + "]"))
         + "\n"
         + (size == 0 || found != null ? "" : "after successfully scanning " + size + " characters beginning ")
         + "at line " + line + ", column " + column + ":\n..."
         + input.substring(e.getBegin(), Math.min(input.length, e.getBegin() + 64))
         + "...";
  };

  this.parse_start = function()
  {
    eventHandler.startNonterminal("start", e0);
    lookahead1W(14);                // ModuleDecl | Annotation | OptionDecl | Operator | Variable | Tag | AttrTest |
                                    // Wildcard | EQName^Token | IntegerLiteral | DecimalLiteral | DoubleLiteral |
                                    // S^WS | EOF | '!' | '"' | '$$' | "'" | '(' | '(#' | '(:' | '(:~' | ')' | ',' |
                                    // '.' | '/' | ':' | ';' | '<!--' | '<![CDATA[' | '<?' | '[' | ']' | 'after' |
                                    // 'allowing' | 'ancestor' | 'ancestor-or-self' | 'and' | 'as' | 'ascending' |
                                    // 'at' | 'attribute' | 'base-uri' | 'before' | 'boundary-space' | 'break' |
                                    // 'case' | 'cast' | 'castable' | 'catch' | 'child' | 'collation' | 'comment' |
                                    // 'constraint' | 'construction' | 'context' | 'continue' | 'copy' |
                                    // 'copy-namespaces' | 'count' | 'decimal-format' | 'declare' | 'default' |
                                    // 'delete' | 'descendant' | 'descendant-or-self' | 'descending' | 'div' |
                                    // 'document' | 'document-node' | 'element' | 'else' | 'empty' | 'empty-sequence' |
                                    // 'encoding' | 'end' | 'eq' | 'every' | 'except' | 'exit' | 'external' | 'first' |
                                    // 'following' | 'following-sibling' | 'for' | 'ft-option' | 'function' | 'ge' |
                                    // 'group' | 'gt' | 'idiv' | 'if' | 'import' | 'in' | 'index' | 'insert' |
                                    // 'instance' | 'integrity' | 'intersect' | 'into' | 'is' | 'item' | 'last' |
                                    // 'lax' | 'le' | 'let' | 'loop' | 'lt' | 'mod' | 'modify' | 'module' |
                                    // 'namespace' | 'namespace-node' | 'ne' | 'node' | 'nodes' | 'only' | 'option' |
                                    // 'or' | 'order' | 'ordered' | 'ordering' | 'parent' | 'preceding' |
                                    // 'preceding-sibling' | 'processing-instruction' | 'rename' | 'replace' |
                                    // 'return' | 'returning' | 'revalidation' | 'satisfies' | 'schema' |
                                    // 'schema-attribute' | 'schema-element' | 'score' | 'self' | 'sliding' | 'some' |
                                    // 'stable' | 'start' | 'strict' | 'switch' | 'text' | 'to' | 'treat' | 'try' |
                                    // 'tumbling' | 'type' | 'typeswitch' | 'union' | 'unordered' | 'updating' |
                                    // 'validate' | 'value' | 'variable' | 'version' | 'where' | 'while' | 'with' |
                                    // 'xquery' | '{' | '|' | '}'
    switch (l1)
    {
    case 56:                        // '<![CDATA['
      shift(56);                    // '<![CDATA['
      break;
    case 55:                        // '<!--'
      shift(55);                    // '<!--'
      break;
    case 57:                        // '<?'
      shift(57);                    // '<?'
      break;
    case 41:                        // '(#'
      shift(41);                    // '(#'
      break;
    case 43:                        // '(:~'
      shift(43);                    // '(:~'
      break;
    case 42:                        // '(:'
      shift(42);                    // '(:'
      break;
    case 35:                        // '"'
      shift(35);                    // '"'
      break;
    case 39:                        // "'"
      shift(39);                    // "'"
      break;
    case 275:                       // '}'
      shift(275);                   // '}'
      break;
    case 272:                       // '{'
      shift(272);                   // '{'
      break;
    case 40:                        // '('
      shift(40);                    // '('
      break;
    case 44:                        // ')'
      shift(44);                    // ')'
      break;
    case 50:                        // '/'
      shift(50);                    // '/'
      break;
    case 63:                        // '['
      shift(63);                    // '['
      break;
    case 64:                        // ']'
      shift(64);                    // ']'
      break;
    case 47:                        // ','
      shift(47);                    // ','
      break;
    case 49:                        // '.'
      shift(49);                    // '.'
      break;
    case 54:                        // ';'
      shift(54);                    // ';'
      break;
    case 52:                        // ':'
      shift(52);                    // ':'
      break;
    case 34:                        // '!'
      shift(34);                    // '!'
      break;
    case 274:                       // '|'
      shift(274);                   // '|'
      break;
    case 38:                        // '$$'
      shift(38);                    // '$$'
      break;
    case 2:                         // Annotation
      shift(2);                     // Annotation
      break;
    case 1:                         // ModuleDecl
      shift(1);                     // ModuleDecl
      break;
    case 3:                         // OptionDecl
      shift(3);                     // OptionDecl
      break;
    case 12:                        // AttrTest
      shift(12);                    // AttrTest
      break;
    case 13:                        // Wildcard
      shift(13);                    // Wildcard
      break;
    case 15:                        // IntegerLiteral
      shift(15);                    // IntegerLiteral
      break;
    case 16:                        // DecimalLiteral
      shift(16);                    // DecimalLiteral
      break;
    case 17:                        // DoubleLiteral
      shift(17);                    // DoubleLiteral
      break;
    case 5:                         // Variable
      shift(5);                     // Variable
      break;
    case 6:                         // Tag
      shift(6);                     // Tag
      break;
    case 4:                         // Operator
      shift(4);                     // Operator
      break;
    case 33:                        // EOF
      shift(33);                    // EOF
      break;
    default:
      parse_EQName();
    }
    eventHandler.endNonterminal("start", e0);
  };

  this.parse_StartTag = function()
  {
    eventHandler.startNonterminal("StartTag", e0);
    lookahead1W(8);                 // QName | S^WS | EOF | '"' | "'" | '/>' | '=' | '>'
    switch (l1)
    {
    case 59:                        // '>'
      shift(59);                    // '>'
      break;
    case 51:                        // '/>'
      shift(51);                    // '/>'
      break;
    case 27:                        // QName
      shift(27);                    // QName
      break;
    case 58:                        // '='
      shift(58);                    // '='
      break;
    case 35:                        // '"'
      shift(35);                    // '"'
      break;
    case 39:                        // "'"
      shift(39);                    // "'"
      break;
    default:
      shift(33);                    // EOF
    }
    eventHandler.endNonterminal("StartTag", e0);
  };

  this.parse_TagContent = function()
  {
    eventHandler.startNonterminal("TagContent", e0);
    lookahead1(11);                 // Tag | EndTag | PredefinedEntityRef | ElementContentChar | CharRef | EOF |
                                    // '<!--' | '<![CDATA[' | '{' | '{{' | '}}'
    switch (l1)
    {
    case 23:                        // ElementContentChar
      shift(23);                    // ElementContentChar
      break;
    case 6:                         // Tag
      shift(6);                     // Tag
      break;
    case 7:                         // EndTag
      shift(7);                     // EndTag
      break;
    case 56:                        // '<![CDATA['
      shift(56);                    // '<![CDATA['
      break;
    case 55:                        // '<!--'
      shift(55);                    // '<!--'
      break;
    case 18:                        // PredefinedEntityRef
      shift(18);                    // PredefinedEntityRef
      break;
    case 29:                        // CharRef
      shift(29);                    // CharRef
      break;
    case 273:                       // '{{'
      shift(273);                   // '{{'
      break;
    case 276:                       // '}}'
      shift(276);                   // '}}'
      break;
    case 272:                       // '{'
      shift(272);                   // '{'
      break;
    default:
      shift(33);                    // EOF
    }
    eventHandler.endNonterminal("TagContent", e0);
  };

  this.parse_AposAttr = function()
  {
    eventHandler.startNonterminal("AposAttr", e0);
    lookahead1(10);                 // PredefinedEntityRef | EscapeApos | AposAttrContentChar | CharRef | EOF | "'" |
                                    // '{' | '{{' | '}}'
    switch (l1)
    {
    case 20:                        // EscapeApos
      shift(20);                    // EscapeApos
      break;
    case 25:                        // AposAttrContentChar
      shift(25);                    // AposAttrContentChar
      break;
    case 18:                        // PredefinedEntityRef
      shift(18);                    // PredefinedEntityRef
      break;
    case 29:                        // CharRef
      shift(29);                    // CharRef
      break;
    case 273:                       // '{{'
      shift(273);                   // '{{'
      break;
    case 276:                       // '}}'
      shift(276);                   // '}}'
      break;
    case 272:                       // '{'
      shift(272);                   // '{'
      break;
    case 39:                        // "'"
      shift(39);                    // "'"
      break;
    default:
      shift(33);                    // EOF
    }
    eventHandler.endNonterminal("AposAttr", e0);
  };

  this.parse_QuotAttr = function()
  {
    eventHandler.startNonterminal("QuotAttr", e0);
    lookahead1(9);                  // PredefinedEntityRef | EscapeQuot | QuotAttrContentChar | CharRef | EOF | '"' |
                                    // '{' | '{{' | '}}'
    switch (l1)
    {
    case 19:                        // EscapeQuot
      shift(19);                    // EscapeQuot
      break;
    case 24:                        // QuotAttrContentChar
      shift(24);                    // QuotAttrContentChar
      break;
    case 18:                        // PredefinedEntityRef
      shift(18);                    // PredefinedEntityRef
      break;
    case 29:                        // CharRef
      shift(29);                    // CharRef
      break;
    case 273:                       // '{{'
      shift(273);                   // '{{'
      break;
    case 276:                       // '}}'
      shift(276);                   // '}}'
      break;
    case 272:                       // '{'
      shift(272);                   // '{'
      break;
    case 35:                        // '"'
      shift(35);                    // '"'
      break;
    default:
      shift(33);                    // EOF
    }
    eventHandler.endNonterminal("QuotAttr", e0);
  };

  this.parse_CData = function()
  {
    eventHandler.startNonterminal("CData", e0);
    lookahead1(1);                  // CDataSectionContents | EOF | ']]>'
    switch (l1)
    {
    case 11:                        // CDataSectionContents
      shift(11);                    // CDataSectionContents
      break;
    case 65:                        // ']]>'
      shift(65);                    // ']]>'
      break;
    default:
      shift(33);                    // EOF
    }
    eventHandler.endNonterminal("CData", e0);
  };

  this.parse_XMLComment = function()
  {
    eventHandler.startNonterminal("XMLComment", e0);
    lookahead1(0);                  // DirCommentContents | EOF | '-->'
    switch (l1)
    {
    case 9:                         // DirCommentContents
      shift(9);                     // DirCommentContents
      break;
    case 48:                        // '-->'
      shift(48);                    // '-->'
      break;
    default:
      shift(33);                    // EOF
    }
    eventHandler.endNonterminal("XMLComment", e0);
  };

  this.parse_PI = function()
  {
    eventHandler.startNonterminal("PI", e0);
    lookahead1(3);                  // DirPIContents | EOF | '?' | '?>'
    switch (l1)
    {
    case 10:                        // DirPIContents
      shift(10);                    // DirPIContents
      break;
    case 60:                        // '?'
      shift(60);                    // '?'
      break;
    case 61:                        // '?>'
      shift(61);                    // '?>'
      break;
    default:
      shift(33);                    // EOF
    }
    eventHandler.endNonterminal("PI", e0);
  };

  this.parse_Pragma = function()
  {
    eventHandler.startNonterminal("Pragma", e0);
    lookahead1(2);                  // PragmaContents | EOF | '#' | '#)'
    switch (l1)
    {
    case 8:                         // PragmaContents
      shift(8);                     // PragmaContents
      break;
    case 36:                        // '#'
      shift(36);                    // '#'
      break;
    case 37:                        // '#)'
      shift(37);                    // '#)'
      break;
    default:
      shift(33);                    // EOF
    }
    eventHandler.endNonterminal("Pragma", e0);
  };

  this.parse_Comment = function()
  {
    eventHandler.startNonterminal("Comment", e0);
    lookahead1(4);                  // CommentContents | EOF | '(:' | ':)'
    switch (l1)
    {
    case 53:                        // ':)'
      shift(53);                    // ':)'
      break;
    case 42:                        // '(:'
      shift(42);                    // '(:'
      break;
    case 30:                        // CommentContents
      shift(30);                    // CommentContents
      break;
    default:
      shift(33);                    // EOF
    }
    eventHandler.endNonterminal("Comment", e0);
  };

  this.parse_CommentDoc = function()
  {
    eventHandler.startNonterminal("CommentDoc", e0);
    lookahead1(5);                  // DocTag | DocCommentContents | EOF | '(:' | ':)'
    switch (l1)
    {
    case 31:                        // DocTag
      shift(31);                    // DocTag
      break;
    case 32:                        // DocCommentContents
      shift(32);                    // DocCommentContents
      break;
    case 53:                        // ':)'
      shift(53);                    // ':)'
      break;
    case 42:                        // '(:'
      shift(42);                    // '(:'
      break;
    default:
      shift(33);                    // EOF
    }
    eventHandler.endNonterminal("CommentDoc", e0);
  };

  this.parse_QuotString = function()
  {
    eventHandler.startNonterminal("QuotString", e0);
    lookahead1(6);                  // PredefinedEntityRef | EscapeQuot | QuotChar | CharRef | EOF | '"'
    switch (l1)
    {
    case 18:                        // PredefinedEntityRef
      shift(18);                    // PredefinedEntityRef
      break;
    case 29:                        // CharRef
      shift(29);                    // CharRef
      break;
    case 19:                        // EscapeQuot
      shift(19);                    // EscapeQuot
      break;
    case 21:                        // QuotChar
      shift(21);                    // QuotChar
      break;
    case 35:                        // '"'
      shift(35);                    // '"'
      break;
    default:
      shift(33);                    // EOF
    }
    eventHandler.endNonterminal("QuotString", e0);
  };

  this.parse_AposString = function()
  {
    eventHandler.startNonterminal("AposString", e0);
    lookahead1(7);                  // PredefinedEntityRef | EscapeApos | AposChar | CharRef | EOF | "'"
    switch (l1)
    {
    case 18:                        // PredefinedEntityRef
      shift(18);                    // PredefinedEntityRef
      break;
    case 29:                        // CharRef
      shift(29);                    // CharRef
      break;
    case 20:                        // EscapeApos
      shift(20);                    // EscapeApos
      break;
    case 22:                        // AposChar
      shift(22);                    // AposChar
      break;
    case 39:                        // "'"
      shift(39);                    // "'"
      break;
    default:
      shift(33);                    // EOF
    }
    eventHandler.endNonterminal("AposString", e0);
  };

  this.parse_Prefix = function()
  {
    eventHandler.startNonterminal("Prefix", e0);
    lookahead1W(13);                // NCName^Token | S^WS | 'after' | 'allowing' | 'ancestor' | 'ancestor-or-self' |
                                    // 'and' | 'as' | 'ascending' | 'at' | 'attribute' | 'base-uri' | 'before' |
                                    // 'boundary-space' | 'break' | 'case' | 'cast' | 'castable' | 'catch' | 'child' |
                                    // 'collation' | 'comment' | 'constraint' | 'construction' | 'context' |
                                    // 'continue' | 'copy' | 'copy-namespaces' | 'count' | 'decimal-format' |
                                    // 'declare' | 'default' | 'delete' | 'descendant' | 'descendant-or-self' |
                                    // 'descending' | 'div' | 'document' | 'document-node' | 'element' | 'else' |
                                    // 'empty' | 'empty-sequence' | 'encoding' | 'end' | 'eq' | 'every' | 'except' |
                                    // 'exit' | 'external' | 'first' | 'following' | 'following-sibling' | 'for' |
                                    // 'ft-option' | 'function' | 'ge' | 'group' | 'gt' | 'idiv' | 'if' | 'import' |
                                    // 'in' | 'index' | 'insert' | 'instance' | 'integrity' | 'intersect' | 'into' |
                                    // 'is' | 'item' | 'last' | 'lax' | 'le' | 'let' | 'loop' | 'lt' | 'mod' |
                                    // 'modify' | 'module' | 'namespace' | 'namespace-node' | 'ne' | 'node' | 'nodes' |
                                    // 'only' | 'option' | 'or' | 'order' | 'ordered' | 'ordering' | 'parent' |
                                    // 'preceding' | 'preceding-sibling' | 'processing-instruction' | 'rename' |
                                    // 'replace' | 'return' | 'returning' | 'revalidation' | 'satisfies' | 'schema' |
                                    // 'schema-attribute' | 'schema-element' | 'score' | 'self' | 'sliding' | 'some' |
                                    // 'stable' | 'start' | 'strict' | 'switch' | 'text' | 'to' | 'treat' | 'try' |
                                    // 'tumbling' | 'type' | 'typeswitch' | 'union' | 'unordered' | 'updating' |
                                    // 'validate' | 'value' | 'variable' | 'version' | 'where' | 'while' | 'with' |
                                    // 'xquery'
    whitespace();
    parse_NCName();
    eventHandler.endNonterminal("Prefix", e0);
  };

  this.parse__EQName = function()
  {
    eventHandler.startNonterminal("_EQName", e0);
    lookahead1W(12);                // EQName^Token | S^WS | 'after' | 'allowing' | 'ancestor' | 'ancestor-or-self' |
                                    // 'and' | 'as' | 'ascending' | 'at' | 'attribute' | 'base-uri' | 'before' |
                                    // 'boundary-space' | 'break' | 'case' | 'cast' | 'castable' | 'catch' | 'child' |
                                    // 'collation' | 'comment' | 'constraint' | 'construction' | 'context' |
                                    // 'continue' | 'copy' | 'copy-namespaces' | 'count' | 'decimal-format' |
                                    // 'declare' | 'default' | 'delete' | 'descendant' | 'descendant-or-self' |
                                    // 'descending' | 'div' | 'document' | 'document-node' | 'element' | 'else' |
                                    // 'empty' | 'empty-sequence' | 'encoding' | 'end' | 'eq' | 'every' | 'except' |
                                    // 'exit' | 'external' | 'first' | 'following' | 'following-sibling' | 'for' |
                                    // 'ft-option' | 'function' | 'ge' | 'group' | 'gt' | 'idiv' | 'if' | 'import' |
                                    // 'in' | 'index' | 'insert' | 'instance' | 'integrity' | 'intersect' | 'into' |
                                    // 'is' | 'item' | 'last' | 'lax' | 'le' | 'let' | 'loop' | 'lt' | 'mod' |
                                    // 'modify' | 'module' | 'namespace' | 'namespace-node' | 'ne' | 'node' | 'nodes' |
                                    // 'only' | 'option' | 'or' | 'order' | 'ordered' | 'ordering' | 'parent' |
                                    // 'preceding' | 'preceding-sibling' | 'processing-instruction' | 'rename' |
                                    // 'replace' | 'return' | 'returning' | 'revalidation' | 'satisfies' | 'schema' |
                                    // 'schema-attribute' | 'schema-element' | 'score' | 'self' | 'sliding' | 'some' |
                                    // 'stable' | 'start' | 'strict' | 'switch' | 'text' | 'to' | 'treat' | 'try' |
                                    // 'tumbling' | 'type' | 'typeswitch' | 'union' | 'unordered' | 'updating' |
                                    // 'validate' | 'value' | 'variable' | 'version' | 'where' | 'while' | 'with' |
                                    // 'xquery'
    whitespace();
    parse_EQName();
    eventHandler.endNonterminal("_EQName", e0);
  };

  function parse_EQName()
  {
    eventHandler.startNonterminal("EQName", e0);
    switch (l1)
    {
    case 78:                        // 'attribute'
      shift(78);                    // 'attribute'
      break;
    case 92:                        // 'comment'
      shift(92);                    // 'comment'
      break;
    case 116:                       // 'document-node'
      shift(116);                   // 'document-node'
      break;
    case 117:                       // 'element'
      shift(117);                   // 'element'
      break;
    case 120:                       // 'empty-sequence'
      shift(120);                   // 'empty-sequence'
      break;
    case 141:                       // 'function'
      shift(141);                   // 'function'
      break;
    case 148:                       // 'if'
      shift(148);                   // 'if'
      break;
    case 161:                       // 'item'
      shift(161);                   // 'item'
      break;
    case 181:                       // 'namespace-node'
      shift(181);                   // 'namespace-node'
      break;
    case 187:                       // 'node'
      shift(187);                   // 'node'
      break;
    case 212:                       // 'processing-instruction'
      shift(212);                   // 'processing-instruction'
      break;
    case 222:                       // 'schema-attribute'
      shift(222);                   // 'schema-attribute'
      break;
    case 223:                       // 'schema-element'
      shift(223);                   // 'schema-element'
      break;
    case 239:                       // 'switch'
      shift(239);                   // 'switch'
      break;
    case 240:                       // 'text'
      shift(240);                   // 'text'
      break;
    case 249:                       // 'typeswitch'
      shift(249);                   // 'typeswitch'
      break;
    default:
      parse_FunctionName();
    }
    eventHandler.endNonterminal("EQName", e0);
  }

  function parse_FunctionName()
  {
    eventHandler.startNonterminal("FunctionName", e0);
    switch (l1)
    {
    case 14:                        // EQName^Token
      shift(14);                    // EQName^Token
      break;
    case 66:                        // 'after'
      shift(66);                    // 'after'
      break;
    case 69:                        // 'ancestor'
      shift(69);                    // 'ancestor'
      break;
    case 70:                        // 'ancestor-or-self'
      shift(70);                    // 'ancestor-or-self'
      break;
    case 71:                        // 'and'
      shift(71);                    // 'and'
      break;
    case 75:                        // 'as'
      shift(75);                    // 'as'
      break;
    case 76:                        // 'ascending'
      shift(76);                    // 'ascending'
      break;
    case 80:                        // 'before'
      shift(80);                    // 'before'
      break;
    case 84:                        // 'case'
      shift(84);                    // 'case'
      break;
    case 85:                        // 'cast'
      shift(85);                    // 'cast'
      break;
    case 86:                        // 'castable'
      shift(86);                    // 'castable'
      break;
    case 89:                        // 'child'
      shift(89);                    // 'child'
      break;
    case 90:                        // 'collation'
      shift(90);                    // 'collation'
      break;
    case 99:                        // 'copy'
      shift(99);                    // 'copy'
      break;
    case 101:                       // 'count'
      shift(101);                   // 'count'
      break;
    case 104:                       // 'declare'
      shift(104);                   // 'declare'
      break;
    case 105:                       // 'default'
      shift(105);                   // 'default'
      break;
    case 106:                       // 'delete'
      shift(106);                   // 'delete'
      break;
    case 107:                       // 'descendant'
      shift(107);                   // 'descendant'
      break;
    case 108:                       // 'descendant-or-self'
      shift(108);                   // 'descendant-or-self'
      break;
    case 109:                       // 'descending'
      shift(109);                   // 'descending'
      break;
    case 114:                       // 'div'
      shift(114);                   // 'div'
      break;
    case 115:                       // 'document'
      shift(115);                   // 'document'
      break;
    case 118:                       // 'else'
      shift(118);                   // 'else'
      break;
    case 119:                       // 'empty'
      shift(119);                   // 'empty'
      break;
    case 122:                       // 'end'
      shift(122);                   // 'end'
      break;
    case 124:                       // 'eq'
      shift(124);                   // 'eq'
      break;
    case 125:                       // 'every'
      shift(125);                   // 'every'
      break;
    case 127:                       // 'except'
      shift(127);                   // 'except'
      break;
    case 130:                       // 'first'
      shift(130);                   // 'first'
      break;
    case 131:                       // 'following'
      shift(131);                   // 'following'
      break;
    case 132:                       // 'following-sibling'
      shift(132);                   // 'following-sibling'
      break;
    case 133:                       // 'for'
      shift(133);                   // 'for'
      break;
    case 142:                       // 'ge'
      shift(142);                   // 'ge'
      break;
    case 144:                       // 'group'
      shift(144);                   // 'group'
      break;
    case 146:                       // 'gt'
      shift(146);                   // 'gt'
      break;
    case 147:                       // 'idiv'
      shift(147);                   // 'idiv'
      break;
    case 149:                       // 'import'
      shift(149);                   // 'import'
      break;
    case 155:                       // 'insert'
      shift(155);                   // 'insert'
      break;
    case 156:                       // 'instance'
      shift(156);                   // 'instance'
      break;
    case 158:                       // 'intersect'
      shift(158);                   // 'intersect'
      break;
    case 159:                       // 'into'
      shift(159);                   // 'into'
      break;
    case 160:                       // 'is'
      shift(160);                   // 'is'
      break;
    case 166:                       // 'last'
      shift(166);                   // 'last'
      break;
    case 168:                       // 'le'
      shift(168);                   // 'le'
      break;
    case 170:                       // 'let'
      shift(170);                   // 'let'
      break;
    case 174:                       // 'lt'
      shift(174);                   // 'lt'
      break;
    case 176:                       // 'mod'
      shift(176);                   // 'mod'
      break;
    case 177:                       // 'modify'
      shift(177);                   // 'modify'
      break;
    case 178:                       // 'module'
      shift(178);                   // 'module'
      break;
    case 180:                       // 'namespace'
      shift(180);                   // 'namespace'
      break;
    case 182:                       // 'ne'
      shift(182);                   // 'ne'
      break;
    case 194:                       // 'only'
      shift(194);                   // 'only'
      break;
    case 196:                       // 'or'
      shift(196);                   // 'or'
      break;
    case 197:                       // 'order'
      shift(197);                   // 'order'
      break;
    case 198:                       // 'ordered'
      shift(198);                   // 'ordered'
      break;
    case 202:                       // 'parent'
      shift(202);                   // 'parent'
      break;
    case 208:                       // 'preceding'
      shift(208);                   // 'preceding'
      break;
    case 209:                       // 'preceding-sibling'
      shift(209);                   // 'preceding-sibling'
      break;
    case 214:                       // 'rename'
      shift(214);                   // 'rename'
      break;
    case 215:                       // 'replace'
      shift(215);                   // 'replace'
      break;
    case 216:                       // 'return'
      shift(216);                   // 'return'
      break;
    case 220:                       // 'satisfies'
      shift(220);                   // 'satisfies'
      break;
    case 225:                       // 'self'
      shift(225);                   // 'self'
      break;
    case 231:                       // 'some'
      shift(231);                   // 'some'
      break;
    case 232:                       // 'stable'
      shift(232);                   // 'stable'
      break;
    case 233:                       // 'start'
      shift(233);                   // 'start'
      break;
    case 244:                       // 'to'
      shift(244);                   // 'to'
      break;
    case 245:                       // 'treat'
      shift(245);                   // 'treat'
      break;
    case 246:                       // 'try'
      shift(246);                   // 'try'
      break;
    case 250:                       // 'union'
      shift(250);                   // 'union'
      break;
    case 252:                       // 'unordered'
      shift(252);                   // 'unordered'
      break;
    case 256:                       // 'validate'
      shift(256);                   // 'validate'
      break;
    case 262:                       // 'where'
      shift(262);                   // 'where'
      break;
    case 266:                       // 'with'
      shift(266);                   // 'with'
      break;
    case 270:                       // 'xquery'
      shift(270);                   // 'xquery'
      break;
    case 68:                        // 'allowing'
      shift(68);                    // 'allowing'
      break;
    case 77:                        // 'at'
      shift(77);                    // 'at'
      break;
    case 79:                        // 'base-uri'
      shift(79);                    // 'base-uri'
      break;
    case 81:                        // 'boundary-space'
      shift(81);                    // 'boundary-space'
      break;
    case 82:                        // 'break'
      shift(82);                    // 'break'
      break;
    case 87:                        // 'catch'
      shift(87);                    // 'catch'
      break;
    case 94:                        // 'construction'
      shift(94);                    // 'construction'
      break;
    case 97:                        // 'context'
      shift(97);                    // 'context'
      break;
    case 98:                        // 'continue'
      shift(98);                    // 'continue'
      break;
    case 100:                       // 'copy-namespaces'
      shift(100);                   // 'copy-namespaces'
      break;
    case 102:                       // 'decimal-format'
      shift(102);                   // 'decimal-format'
      break;
    case 121:                       // 'encoding'
      shift(121);                   // 'encoding'
      break;
    case 128:                       // 'exit'
      shift(128);                   // 'exit'
      break;
    case 129:                       // 'external'
      shift(129);                   // 'external'
      break;
    case 137:                       // 'ft-option'
      shift(137);                   // 'ft-option'
      break;
    case 150:                       // 'in'
      shift(150);                   // 'in'
      break;
    case 151:                       // 'index'
      shift(151);                   // 'index'
      break;
    case 157:                       // 'integrity'
      shift(157);                   // 'integrity'
      break;
    case 167:                       // 'lax'
      shift(167);                   // 'lax'
      break;
    case 188:                       // 'nodes'
      shift(188);                   // 'nodes'
      break;
    case 195:                       // 'option'
      shift(195);                   // 'option'
      break;
    case 199:                       // 'ordering'
      shift(199);                   // 'ordering'
      break;
    case 218:                       // 'revalidation'
      shift(218);                   // 'revalidation'
      break;
    case 221:                       // 'schema'
      shift(221);                   // 'schema'
      break;
    case 224:                       // 'score'
      shift(224);                   // 'score'
      break;
    case 230:                       // 'sliding'
      shift(230);                   // 'sliding'
      break;
    case 236:                       // 'strict'
      shift(236);                   // 'strict'
      break;
    case 247:                       // 'tumbling'
      shift(247);                   // 'tumbling'
      break;
    case 248:                       // 'type'
      shift(248);                   // 'type'
      break;
    case 253:                       // 'updating'
      shift(253);                   // 'updating'
      break;
    case 257:                       // 'value'
      shift(257);                   // 'value'
      break;
    case 258:                       // 'variable'
      shift(258);                   // 'variable'
      break;
    case 259:                       // 'version'
      shift(259);                   // 'version'
      break;
    case 263:                       // 'while'
      shift(263);                   // 'while'
      break;
    case 93:                        // 'constraint'
      shift(93);                    // 'constraint'
      break;
    case 172:                       // 'loop'
      shift(172);                   // 'loop'
      break;
    default:
      shift(217);                   // 'returning'
    }
    eventHandler.endNonterminal("FunctionName", e0);
  }

  function parse_NCName()
  {
    eventHandler.startNonterminal("NCName", e0);
    switch (l1)
    {
    case 26:                        // NCName^Token
      shift(26);                    // NCName^Token
      break;
    case 66:                        // 'after'
      shift(66);                    // 'after'
      break;
    case 71:                        // 'and'
      shift(71);                    // 'and'
      break;
    case 75:                        // 'as'
      shift(75);                    // 'as'
      break;
    case 76:                        // 'ascending'
      shift(76);                    // 'ascending'
      break;
    case 80:                        // 'before'
      shift(80);                    // 'before'
      break;
    case 84:                        // 'case'
      shift(84);                    // 'case'
      break;
    case 85:                        // 'cast'
      shift(85);                    // 'cast'
      break;
    case 86:                        // 'castable'
      shift(86);                    // 'castable'
      break;
    case 90:                        // 'collation'
      shift(90);                    // 'collation'
      break;
    case 101:                       // 'count'
      shift(101);                   // 'count'
      break;
    case 105:                       // 'default'
      shift(105);                   // 'default'
      break;
    case 109:                       // 'descending'
      shift(109);                   // 'descending'
      break;
    case 114:                       // 'div'
      shift(114);                   // 'div'
      break;
    case 118:                       // 'else'
      shift(118);                   // 'else'
      break;
    case 119:                       // 'empty'
      shift(119);                   // 'empty'
      break;
    case 122:                       // 'end'
      shift(122);                   // 'end'
      break;
    case 124:                       // 'eq'
      shift(124);                   // 'eq'
      break;
    case 127:                       // 'except'
      shift(127);                   // 'except'
      break;
    case 133:                       // 'for'
      shift(133);                   // 'for'
      break;
    case 142:                       // 'ge'
      shift(142);                   // 'ge'
      break;
    case 144:                       // 'group'
      shift(144);                   // 'group'
      break;
    case 146:                       // 'gt'
      shift(146);                   // 'gt'
      break;
    case 147:                       // 'idiv'
      shift(147);                   // 'idiv'
      break;
    case 156:                       // 'instance'
      shift(156);                   // 'instance'
      break;
    case 158:                       // 'intersect'
      shift(158);                   // 'intersect'
      break;
    case 159:                       // 'into'
      shift(159);                   // 'into'
      break;
    case 160:                       // 'is'
      shift(160);                   // 'is'
      break;
    case 168:                       // 'le'
      shift(168);                   // 'le'
      break;
    case 170:                       // 'let'
      shift(170);                   // 'let'
      break;
    case 174:                       // 'lt'
      shift(174);                   // 'lt'
      break;
    case 176:                       // 'mod'
      shift(176);                   // 'mod'
      break;
    case 177:                       // 'modify'
      shift(177);                   // 'modify'
      break;
    case 182:                       // 'ne'
      shift(182);                   // 'ne'
      break;
    case 194:                       // 'only'
      shift(194);                   // 'only'
      break;
    case 196:                       // 'or'
      shift(196);                   // 'or'
      break;
    case 197:                       // 'order'
      shift(197);                   // 'order'
      break;
    case 216:                       // 'return'
      shift(216);                   // 'return'
      break;
    case 220:                       // 'satisfies'
      shift(220);                   // 'satisfies'
      break;
    case 232:                       // 'stable'
      shift(232);                   // 'stable'
      break;
    case 233:                       // 'start'
      shift(233);                   // 'start'
      break;
    case 244:                       // 'to'
      shift(244);                   // 'to'
      break;
    case 245:                       // 'treat'
      shift(245);                   // 'treat'
      break;
    case 250:                       // 'union'
      shift(250);                   // 'union'
      break;
    case 262:                       // 'where'
      shift(262);                   // 'where'
      break;
    case 266:                       // 'with'
      shift(266);                   // 'with'
      break;
    case 69:                        // 'ancestor'
      shift(69);                    // 'ancestor'
      break;
    case 70:                        // 'ancestor-or-self'
      shift(70);                    // 'ancestor-or-self'
      break;
    case 78:                        // 'attribute'
      shift(78);                    // 'attribute'
      break;
    case 89:                        // 'child'
      shift(89);                    // 'child'
      break;
    case 92:                        // 'comment'
      shift(92);                    // 'comment'
      break;
    case 99:                        // 'copy'
      shift(99);                    // 'copy'
      break;
    case 104:                       // 'declare'
      shift(104);                   // 'declare'
      break;
    case 106:                       // 'delete'
      shift(106);                   // 'delete'
      break;
    case 107:                       // 'descendant'
      shift(107);                   // 'descendant'
      break;
    case 108:                       // 'descendant-or-self'
      shift(108);                   // 'descendant-or-self'
      break;
    case 115:                       // 'document'
      shift(115);                   // 'document'
      break;
    case 116:                       // 'document-node'
      shift(116);                   // 'document-node'
      break;
    case 117:                       // 'element'
      shift(117);                   // 'element'
      break;
    case 120:                       // 'empty-sequence'
      shift(120);                   // 'empty-sequence'
      break;
    case 125:                       // 'every'
      shift(125);                   // 'every'
      break;
    case 130:                       // 'first'
      shift(130);                   // 'first'
      break;
    case 131:                       // 'following'
      shift(131);                   // 'following'
      break;
    case 132:                       // 'following-sibling'
      shift(132);                   // 'following-sibling'
      break;
    case 141:                       // 'function'
      shift(141);                   // 'function'
      break;
    case 148:                       // 'if'
      shift(148);                   // 'if'
      break;
    case 149:                       // 'import'
      shift(149);                   // 'import'
      break;
    case 155:                       // 'insert'
      shift(155);                   // 'insert'
      break;
    case 161:                       // 'item'
      shift(161);                   // 'item'
      break;
    case 166:                       // 'last'
      shift(166);                   // 'last'
      break;
    case 178:                       // 'module'
      shift(178);                   // 'module'
      break;
    case 180:                       // 'namespace'
      shift(180);                   // 'namespace'
      break;
    case 181:                       // 'namespace-node'
      shift(181);                   // 'namespace-node'
      break;
    case 187:                       // 'node'
      shift(187);                   // 'node'
      break;
    case 198:                       // 'ordered'
      shift(198);                   // 'ordered'
      break;
    case 202:                       // 'parent'
      shift(202);                   // 'parent'
      break;
    case 208:                       // 'preceding'
      shift(208);                   // 'preceding'
      break;
    case 209:                       // 'preceding-sibling'
      shift(209);                   // 'preceding-sibling'
      break;
    case 212:                       // 'processing-instruction'
      shift(212);                   // 'processing-instruction'
      break;
    case 214:                       // 'rename'
      shift(214);                   // 'rename'
      break;
    case 215:                       // 'replace'
      shift(215);                   // 'replace'
      break;
    case 222:                       // 'schema-attribute'
      shift(222);                   // 'schema-attribute'
      break;
    case 223:                       // 'schema-element'
      shift(223);                   // 'schema-element'
      break;
    case 225:                       // 'self'
      shift(225);                   // 'self'
      break;
    case 231:                       // 'some'
      shift(231);                   // 'some'
      break;
    case 239:                       // 'switch'
      shift(239);                   // 'switch'
      break;
    case 240:                       // 'text'
      shift(240);                   // 'text'
      break;
    case 246:                       // 'try'
      shift(246);                   // 'try'
      break;
    case 249:                       // 'typeswitch'
      shift(249);                   // 'typeswitch'
      break;
    case 252:                       // 'unordered'
      shift(252);                   // 'unordered'
      break;
    case 256:                       // 'validate'
      shift(256);                   // 'validate'
      break;
    case 258:                       // 'variable'
      shift(258);                   // 'variable'
      break;
    case 270:                       // 'xquery'
      shift(270);                   // 'xquery'
      break;
    case 68:                        // 'allowing'
      shift(68);                    // 'allowing'
      break;
    case 77:                        // 'at'
      shift(77);                    // 'at'
      break;
    case 79:                        // 'base-uri'
      shift(79);                    // 'base-uri'
      break;
    case 81:                        // 'boundary-space'
      shift(81);                    // 'boundary-space'
      break;
    case 82:                        // 'break'
      shift(82);                    // 'break'
      break;
    case 87:                        // 'catch'
      shift(87);                    // 'catch'
      break;
    case 94:                        // 'construction'
      shift(94);                    // 'construction'
      break;
    case 97:                        // 'context'
      shift(97);                    // 'context'
      break;
    case 98:                        // 'continue'
      shift(98);                    // 'continue'
      break;
    case 100:                       // 'copy-namespaces'
      shift(100);                   // 'copy-namespaces'
      break;
    case 102:                       // 'decimal-format'
      shift(102);                   // 'decimal-format'
      break;
    case 121:                       // 'encoding'
      shift(121);                   // 'encoding'
      break;
    case 128:                       // 'exit'
      shift(128);                   // 'exit'
      break;
    case 129:                       // 'external'
      shift(129);                   // 'external'
      break;
    case 137:                       // 'ft-option'
      shift(137);                   // 'ft-option'
      break;
    case 150:                       // 'in'
      shift(150);                   // 'in'
      break;
    case 151:                       // 'index'
      shift(151);                   // 'index'
      break;
    case 157:                       // 'integrity'
      shift(157);                   // 'integrity'
      break;
    case 167:                       // 'lax'
      shift(167);                   // 'lax'
      break;
    case 188:                       // 'nodes'
      shift(188);                   // 'nodes'
      break;
    case 195:                       // 'option'
      shift(195);                   // 'option'
      break;
    case 199:                       // 'ordering'
      shift(199);                   // 'ordering'
      break;
    case 218:                       // 'revalidation'
      shift(218);                   // 'revalidation'
      break;
    case 221:                       // 'schema'
      shift(221);                   // 'schema'
      break;
    case 224:                       // 'score'
      shift(224);                   // 'score'
      break;
    case 230:                       // 'sliding'
      shift(230);                   // 'sliding'
      break;
    case 236:                       // 'strict'
      shift(236);                   // 'strict'
      break;
    case 247:                       // 'tumbling'
      shift(247);                   // 'tumbling'
      break;
    case 248:                       // 'type'
      shift(248);                   // 'type'
      break;
    case 253:                       // 'updating'
      shift(253);                   // 'updating'
      break;
    case 257:                       // 'value'
      shift(257);                   // 'value'
      break;
    case 259:                       // 'version'
      shift(259);                   // 'version'
      break;
    case 263:                       // 'while'
      shift(263);                   // 'while'
      break;
    case 93:                        // 'constraint'
      shift(93);                    // 'constraint'
      break;
    case 172:                       // 'loop'
      shift(172);                   // 'loop'
      break;
    default:
      shift(217);                   // 'returning'
    }
    eventHandler.endNonterminal("NCName", e0);
  }

  function shift(t)
  {
    if (l1 == t)
    {
      whitespace();
      eventHandler.terminal(JSONiqTokenizer.TOKEN[l1], b1, e1 > size ? size : e1);
      b0 = b1; e0 = e1; l1 = 0;
    }
    else
    {
      error(b1, e1, 0, l1, t);
    }
  }

  function whitespace()
  {
    if (e0 != b1)
    {
      b0 = e0;
      e0 = b1;
      eventHandler.whitespace(b0, e0);
    }
  }

  function matchW(set)
  {
    var code;
    for (;;)
    {
      code = match(set);
      if (code != 28)               // S^WS
      {
        break;
      }
    }
    return code;
  }

  function lookahead1W(set)
  {
    if (l1 == 0)
    {
      l1 = matchW(set);
      b1 = begin;
      e1 = end;
    }
  }

  function lookahead1(set)
  {
    if (l1 == 0)
    {
      l1 = match(set);
      b1 = begin;
      e1 = end;
    }
  }

  function error(b, e, s, l, t)
  {
    throw new self.ParseException(b, e, s, l, t);
  }

  var lk, b0, e0;
  var l1, b1, e1;
  var eventHandler;

  var input;
  var size;
  var begin;
  var end;

  function match(tokenSetId)
  {
    var nonbmp = false;
    begin = end;
    var current = end;
    var result = JSONiqTokenizer.INITIAL[tokenSetId];
    var state = 0;

    for (var code = result & 4095; code != 0; )
    {
      var charclass;
      var c0 = current < size ? input.charCodeAt(current) : 0;
      ++current;
      if (c0 < 0x80)
      {
        charclass = JSONiqTokenizer.MAP0[c0];
      }
      else if (c0 < 0xd800)
      {
        var c1 = c0 >> 4;
        charclass = JSONiqTokenizer.MAP1[(c0 & 15) + JSONiqTokenizer.MAP1[(c1 & 31) + JSONiqTokenizer.MAP1[c1 >> 5]]];
      }
      else
      {
        if (c0 < 0xdc00)
        {
          var c1 = current < size ? input.charCodeAt(current) : 0;
          if (c1 >= 0xdc00 && c1 < 0xe000)
          {
            ++current;
            c0 = ((c0 & 0x3ff) << 10) + (c1 & 0x3ff) + 0x10000;
            nonbmp = true;
          }
        }
        var lo = 0, hi = 5;
        for (var m = 3; ; m = (hi + lo) >> 1)
        {
          if (JSONiqTokenizer.MAP2[m] > c0) hi = m - 1;
          else if (JSONiqTokenizer.MAP2[6 + m] < c0) lo = m + 1;
          else {charclass = JSONiqTokenizer.MAP2[12 + m]; break;}
          if (lo > hi) {charclass = 0; break;}
        }
      }

      state = code;
      var i0 = (charclass << 12) + code - 1;
      code = JSONiqTokenizer.TRANSITION[(i0 & 15) + JSONiqTokenizer.TRANSITION[i0 >> 4]];

      if (code > 4095)
      {
        result = code;
        code &= 4095;
        end = current;
      }
    }

    result >>= 12;
    if (result == 0)
    {
      end = current - 1;
      var c1 = end < size ? input.charCodeAt(end) : 0;
      if (c1 >= 0xdc00 && c1 < 0xe000) --end;
      return error(begin, end, state, -1, -1);
    }

    if (nonbmp)
    {
      for (var i = result >> 9; i > 0; --i)
      {
        --end;
        var c1 = end < size ? input.charCodeAt(end) : 0;
        if (c1 >= 0xdc00 && c1 < 0xe000) --end;
      }
    }
    else
    {
      end -= result >> 9;
    }

    return (result & 511) - 1;
  }
}

JSONiqTokenizer.getTokenSet = function(tokenSetId)
{
  var set = [];
  var s = tokenSetId < 0 ? - tokenSetId : INITIAL[tokenSetId] & 4095;
  for (var i = 0; i < 277; i += 32)
  {
    var j = i;
    var i0 = (i >> 5) * 2062 + s - 1;
    var i1 = i0 >> 2;
    var i2 = i1 >> 2;
    var f = JSONiqTokenizer.EXPECTED[(i0 & 3) + JSONiqTokenizer.EXPECTED[(i1 & 3) + JSONiqTokenizer.EXPECTED[(i2 & 3) + JSONiqTokenizer.EXPECTED[i2 >> 2]]]];
    for ( ; f != 0; f >>>= 1, ++j)
    {
      if ((f & 1) != 0)
      {
        set.push(JSONiqTokenizer.TOKEN[j]);
      }
    }
  }
  return set;
};

JSONiqTokenizer.MAP0 =
[
  /*   0 */ 66, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 4, 5,
  /*  36 */ 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 20, 21, 22, 23, 24,
  /*  64 */ 25, 26, 27, 28, 29, 30, 27, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 32, 31, 31, 33, 31, 31, 31, 31, 31, 31,
  /*  91 */ 34, 35, 36, 35, 31, 35, 37, 38, 39, 40, 41, 42, 43, 44, 45, 31, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
  /* 118 */ 57, 58, 59, 60, 31, 61, 62, 63, 64, 35
];

JSONiqTokenizer.MAP1 =
[
  /*   0 */ 108, 124, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 156, 181, 181, 181, 181,
  /*  21 */ 181, 214, 215, 213, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214,
  /*  42 */ 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214,
  /*  63 */ 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214,
  /*  84 */ 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214, 214,
  /* 105 */ 214, 214, 214, 247, 261, 277, 293, 309, 347, 363, 379, 416, 416, 416, 408, 331, 323, 331, 323, 331, 331,
  /* 126 */ 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 433, 433, 433, 433, 433, 433, 433,
  /* 147 */ 316, 331, 331, 331, 331, 331, 331, 331, 331, 394, 416, 416, 417, 415, 416, 416, 331, 331, 331, 331, 331,
  /* 168 */ 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 416, 416, 416, 416, 416, 416, 416, 416,
  /* 189 */ 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416,
  /* 210 */ 416, 416, 416, 330, 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 331,
  /* 231 */ 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 331, 416, 66, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 256 */ 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  /* 290 */ 15, 16, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 27, 31,
  /* 317 */ 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 35, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31,
  /* 344 */ 31, 31, 31, 31, 32, 31, 31, 33, 31, 31, 31, 31, 31, 31, 34, 35, 36, 35, 31, 35, 37, 38, 39, 40, 41, 42, 43,
  /* 371 */ 44, 45, 31, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 31, 61, 62, 63, 64, 35, 35, 35, 35,
  /* 398 */ 35, 35, 35, 35, 35, 35, 35, 35, 31, 31, 35, 35, 35, 35, 35, 35, 35, 65, 35, 35, 35, 35, 35, 35, 35, 35, 35,
  /* 425 */ 35, 35, 35, 35, 35, 35, 35, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65
];

JSONiqTokenizer.MAP2 =
[
  /*  0 */ 57344, 63744, 64976, 65008, 65536, 983040, 63743, 64975, 65007, 65533, 983039, 1114111, 35, 31, 35, 31, 31,
  /* 17 */ 35
];

JSONiqTokenizer.INITIAL =
[
  /*  0 */ 1, 2, 36867, 45060, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
];

JSONiqTokenizer.TRANSITION =
[
  /*     0 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*    15 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*    30 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*    45 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*    60 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*    75 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*    90 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   105 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   120 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   135 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   150 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   165 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   180 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   195 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   210 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   225 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   240 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   255 */ 17614, 22890, 18871, 17152, 19051, 19276, 17768, 19051, 17173, 30787, 36452, 17330, 17349, 18964, 17189,
  /*   270 */ 17208, 17281, 17756, 18003, 17308, 17327, 17346, 18961, 17365, 21871, 18684, 18700, 19049, 17265, 22024,
  /*   285 */ 17726, 17421, 17447, 17192, 20736, 21864, 17311, 18693, 19042, 19051, 17471, 17494, 17521, 17544, 17251,
  /*   300 */ 36426, 17836, 17699, 20346, 21147, 17567, 17583, 17609, 21878, 17528, 17551, 17258, 36433, 18211, 21931,
  /*   315 */ 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742, 17784, 33554, 21937, 17641, 36488, 18277, 36546,
  /*   330 */ 17501, 19195, 17914, 17946, 18380, 17807, 17886, 17614, 21611, 17505, 17902, 17934, 18766, 17972, 36566,
  /*   345 */ 20653, 17988, 18033, 18762, 18077, 36560, 18656, 18093, 18110, 18126, 18171, 18197, 18227, 18106, 18263,
  /*   360 */ 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861, 36418, 19275, 17850, 17163, 30666, 18424, 17870,
  /*   375 */ 32934, 18392, 18840, 18453, 18469, 18155, 17393, 18524, 18540, 18570, 17614, 17614, 17614, 17614, 17614,
  /*   390 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   405 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   420 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   435 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   450 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   465 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   480 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   495 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   510 */ 17614, 17614, 18614, 21702, 17152, 19051, 19276, 17768, 19051, 28693, 30787, 36452, 17330, 17349, 18964,
  /*   525 */ 17189, 17208, 17281, 17756, 18003, 17308, 17327, 17346, 18961, 17365, 21871, 18684, 18700, 19049, 17265,
  /*   540 */ 22024, 17726, 17421, 17447, 17192, 20736, 21864, 17311, 18693, 19042, 19051, 17471, 17494, 17521, 17544,
  /*   555 */ 17251, 36426, 17836, 17699, 20346, 21147, 17567, 17583, 17609, 21878, 17528, 17551, 17258, 36433, 18211,
  /*   570 */ 21931, 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742, 17784, 33554, 21937, 17641, 36488, 18277,
  /*   585 */ 36546, 17501, 19195, 17914, 17946, 18380, 17807, 17886, 17614, 21611, 17505, 17902, 17934, 18766, 17972,
  /*   600 */ 36566, 20653, 17988, 18033, 18762, 18077, 36560, 18656, 18093, 18110, 18126, 18171, 18197, 18227, 18106,
  /*   615 */ 18263, 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861, 36418, 19275, 17850, 17163, 30666, 18424,
  /*   630 */ 17870, 32934, 18392, 18840, 18453, 18469, 18155, 17393, 18524, 18540, 18570, 17614, 17614, 17614, 17614,
  /*   645 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   660 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   675 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   690 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   705 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   720 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   735 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   750 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   765 */ 17614, 17614, 17614, 20107, 18871, 18672, 19051, 19276, 21258, 19051, 17173, 30787, 36452, 17330, 17349,
  /*   780 */ 18964, 17189, 17208, 17281, 17756, 18003, 17308, 17327, 17346, 18961, 18484, 21871, 18684, 18700, 19049,
  /*   795 */ 17265, 22024, 17726, 17421, 17447, 17192, 20736, 21864, 17311, 18693, 19042, 19051, 17471, 32925, 17521,
  /*   810 */ 17544, 17251, 36426, 17836, 17699, 20346, 21147, 17567, 17583, 17609, 21878, 17528, 17551, 17258, 36433,
  /*   825 */ 21906, 21931, 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742, 17784, 33554, 21937, 17641, 36488,
  /*   840 */ 18277, 36546, 17501, 19195, 17914, 17946, 18380, 17807, 17886, 17614, 21611, 17505, 19199, 17918, 18766,
  /*   855 */ 17972, 36566, 20653, 17988, 18033, 18762, 18716, 18437, 18656, 18093, 18110, 18126, 18171, 18197, 18741,
  /*   870 */ 18106, 18263, 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861, 36418, 19275, 17850, 17163, 30666,
  /*   885 */ 18424, 17870, 32934, 17669, 18840, 18453, 18469, 18554, 17393, 18782, 18540, 18570, 17614, 17614, 17614,
  /*   900 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   915 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   930 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   945 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   960 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   975 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*   990 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1005 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1020 */ 17614, 17614, 17614, 17614, 18798, 18813, 18829, 19051, 19276, 17768, 19051, 17173, 30787, 36452, 17330,
  /*  1035 */ 17349, 18964, 17189, 17208, 17281, 17756, 18003, 17308, 17327, 17346, 18961, 18484, 21871, 18684, 18700,
  /*  1050 */ 19049, 17265, 22024, 17726, 17421, 17447, 17192, 20736, 21864, 17311, 18693, 19042, 19051, 17471, 32925,
  /*  1065 */ 17521, 17544, 17251, 36426, 17836, 17699, 20346, 21147, 17567, 17583, 17609, 21878, 17528, 17551, 17258,
  /*  1080 */ 36433, 21906, 21931, 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742, 17784, 33554, 21937, 17641,
  /*  1095 */ 36488, 18277, 36546, 17501, 19195, 17914, 17946, 18380, 17807, 17886, 17614, 21611, 17505, 19199, 17918,
  /*  1110 */ 18766, 17972, 36566, 20653, 17988, 18033, 18762, 18716, 18437, 18656, 18093, 18110, 18126, 18171, 18197,
  /*  1125 */ 18741, 18106, 18263, 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861, 36418, 19275, 17850, 17163,
  /*  1140 */ 30666, 18424, 17870, 32934, 17669, 18840, 18453, 18469, 18554, 17393, 18782, 18540, 18570, 17614, 17614,
  /*  1155 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1170 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1185 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1200 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1215 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1230 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1245 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1260 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1275 */ 17614, 17614, 17614, 17614, 17614, 18856, 22905, 18949, 19051, 19276, 17593, 19051, 17173, 30787, 36452,
  /*  1290 */ 17330, 17349, 18964, 17189, 17208, 17281, 17756, 18003, 17308, 17327, 17346, 18961, 18980, 21871, 18684,
  /*  1305 */ 18700, 19049, 17265, 22024, 17726, 17421, 17447, 17192, 20736, 19097, 17311, 18693, 19042, 19051, 17471,
  /*  1320 */ 32925, 17521, 17544, 17251, 36426, 17836, 17699, 20346, 21147, 17567, 17583, 18996, 21878, 17528, 17551,
  /*  1335 */ 17258, 36433, 21906, 21931, 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742, 17784, 33554, 21937,
  /*  1350 */ 17641, 36488, 18277, 36546, 17501, 19195, 17914, 17946, 18380, 17807, 17886, 17614, 21611, 17505, 19199,
  /*  1365 */ 17918, 18766, 17972, 36566, 20653, 17988, 18033, 18762, 18716, 18437, 18656, 18093, 18110, 18126, 18171,
  /*  1380 */ 18197, 18741, 18106, 18263, 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861, 36418, 19275, 17850,
  /*  1395 */ 17163, 30666, 18424, 17870, 32934, 17669, 18840, 18453, 18469, 18554, 17393, 18782, 18540, 18570, 17614,
  /*  1410 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1425 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1440 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1455 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1470 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1485 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1500 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1515 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1530 */ 17614, 17614, 17614, 17614, 17614, 17614, 21834, 18871, 19030, 19051, 19276, 18181, 19051, 17173, 30787,
  /*  1545 */ 36452, 17330, 17349, 18964, 17189, 17208, 17281, 17756, 18003, 17308, 17327, 17346, 18961, 18484, 21871,
  /*  1560 */ 18684, 18700, 19049, 17265, 22024, 17726, 17421, 17447, 17192, 20736, 21864, 17311, 18693, 19042, 19051,
  /*  1575 */ 17471, 32925, 17521, 17544, 17251, 36426, 17836, 17699, 20346, 21147, 17567, 17583, 17609, 21878, 17528,
  /*  1590 */ 17551, 17258, 36433, 21906, 21931, 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742, 17784, 33554,
  /*  1605 */ 21937, 17641, 36488, 18277, 36546, 17501, 19195, 17914, 17946, 18380, 17807, 17886, 17614, 21611, 17505,
  /*  1620 */ 19199, 17918, 18766, 17972, 36566, 20653, 17988, 18033, 18762, 18716, 18437, 18656, 18093, 18110, 18126,
  /*  1635 */ 18171, 18197, 18741, 18106, 18263, 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861, 36418, 19275,
  /*  1650 */ 17850, 17163, 30666, 18424, 17870, 32934, 17669, 18840, 18453, 18469, 18554, 17393, 18782, 18540, 18570,
  /*  1665 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1680 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1695 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1710 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1725 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1740 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1755 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1770 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1785 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 21687, 18871, 19030, 19051, 19276, 17768, 19051, 17173,
  /*  1800 */ 30787, 36452, 17330, 17349, 18964, 17189, 17208, 17281, 17756, 18003, 17308, 17327, 17346, 18961, 18484,
  /*  1815 */ 21871, 18684, 18700, 19049, 17265, 22024, 17726, 17421, 17447, 17192, 20736, 21864, 17311, 18693, 19042,
  /*  1830 */ 19051, 17471, 32925, 17521, 17544, 17251, 36426, 17836, 17699, 20346, 21147, 17567, 17583, 17609, 21878,
  /*  1845 */ 17528, 17551, 17258, 36433, 21906, 21931, 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742, 17784,
  /*  1860 */ 33554, 21937, 17641, 36488, 18277, 36546, 17501, 19195, 17914, 17946, 18380, 17807, 17886, 17614, 21611,
  /*  1875 */ 17505, 19199, 17918, 18766, 17972, 36566, 20653, 17988, 18033, 18762, 18716, 18437, 18656, 18093, 18110,
  /*  1890 */ 18126, 18171, 18197, 18741, 18106, 18263, 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861, 36418,
  /*  1905 */ 19275, 17850, 17163, 30666, 18424, 17870, 32934, 17669, 18840, 18453, 18469, 18554, 17393, 18782, 18540,
  /*  1920 */ 18570, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1935 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1950 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1965 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1980 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  1995 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2010 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2025 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2040 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22411, 20122, 18755, 19051, 19276, 17768, 19051,
  /*  2055 */ 17173, 23541, 36452, 17330, 17349, 18964, 17189, 17208, 17281, 17756, 18141, 17308, 17327, 17346, 18961,
  /*  2070 */ 18484, 21871, 18684, 18700, 19049, 17265, 22024, 17726, 17421, 17447, 17192, 17292, 19154, 17311, 18693,
  /*  2085 */ 19042, 19051, 17471, 32925, 17521, 17544, 17251, 36426, 17836, 17699, 20346, 21147, 17567, 17583, 17609,
  /*  2100 */ 21878, 17528, 17551, 17258, 36433, 21906, 21931, 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742,
  /*  2115 */ 17784, 33554, 21937, 17641, 36488, 18277, 36546, 17501, 19195, 17914, 17946, 18380, 17807, 17886, 17614,
  /*  2130 */ 21611, 17505, 19199, 17918, 18766, 17972, 36566, 20653, 17988, 18033, 18762, 18716, 18437, 18656, 18093,
  /*  2145 */ 18110, 18126, 18171, 18197, 18741, 18106, 18263, 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861,
  /*  2160 */ 36418, 19275, 17850, 17163, 30666, 18424, 17870, 32934, 17669, 18840, 18453, 18469, 18554, 17393, 18782,
  /*  2175 */ 18540, 18570, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2190 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2205 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2220 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2235 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2250 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2265 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2280 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2295 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 19067, 18871, 18644, 19051, 19276, 17768,
  /*  2310 */ 19051, 17173, 30787, 36452, 17330, 17349, 18964, 17189, 17208, 17281, 17756, 18003, 17308, 17327, 17346,
  /*  2325 */ 18961, 18484, 21871, 18684, 18700, 19049, 17265, 22024, 17726, 17421, 17447, 17192, 20736, 21864, 17311,
  /*  2340 */ 18693, 19042, 19051, 17471, 32925, 17521, 17544, 17251, 36426, 17836, 17699, 20346, 21147, 17567, 17583,
  /*  2355 */ 17609, 21878, 17528, 17551, 17258, 36433, 21906, 21931, 17635, 36482, 18271, 17657, 17685, 20514, 17715,
  /*  2370 */ 17742, 17784, 33554, 21937, 17641, 36488, 18277, 36546, 17501, 19195, 17914, 17946, 18380, 17807, 17886,
  /*  2385 */ 17614, 21611, 17505, 19199, 17918, 18766, 17972, 36566, 20653, 17988, 18033, 18762, 18716, 18437, 18656,
  /*  2400 */ 18093, 18110, 18126, 18171, 18197, 18741, 18106, 18263, 18304, 18293, 18320, 18017, 18350, 18366, 18408,
  /*  2415 */ 17861, 36418, 19275, 17850, 17163, 30666, 18424, 17870, 32934, 17669, 18840, 18453, 18469, 18554, 17393,
  /*  2430 */ 18782, 18540, 18570, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2445 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2460 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2475 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2490 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2505 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2520 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2535 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2550 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 19124, 22426, 19030, 19051, 19276,
  /*  2565 */ 17768, 19051, 19108, 30787, 36452, 17330, 17349, 18964, 17189, 17208, 17281, 17756, 18003, 17308, 17327,
  /*  2580 */ 17346, 18961, 18484, 21871, 18684, 18700, 19049, 17265, 22024, 17726, 17421, 17447, 17192, 20736, 21864,
  /*  2595 */ 17311, 18693, 19042, 19051, 17471, 32925, 17521, 17544, 17251, 36426, 17836, 17699, 20346, 21147, 17567,
  /*  2610 */ 17583, 17609, 21878, 17528, 17551, 17258, 36433, 21906, 21931, 17635, 36482, 18271, 17657, 17685, 20514,
  /*  2625 */ 17715, 17742, 17784, 33554, 21937, 17641, 36488, 18277, 36546, 17501, 19195, 17914, 17946, 18380, 17807,
  /*  2640 */ 17886, 17614, 21611, 17505, 19199, 17918, 18766, 17972, 36566, 20653, 17988, 18033, 18762, 18716, 18437,
  /*  2655 */ 18656, 18093, 18110, 18126, 18171, 18197, 18741, 18106, 18263, 18304, 18293, 18320, 18017, 18350, 18366,
  /*  2670 */ 18408, 17861, 36418, 19275, 17850, 17163, 30666, 18424, 17870, 32934, 17669, 18840, 18453, 18469, 18554,
  /*  2685 */ 17393, 18782, 18540, 18570, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2700 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2715 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2730 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2745 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2760 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2775 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2790 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2805 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 21983, 21998, 19030, 19051,
  /*  2820 */ 19276, 17768, 19051, 18725, 30787, 36452, 17330, 17349, 18964, 17189, 17208, 17281, 17756, 18003, 17308,
  /*  2835 */ 17327, 17346, 18961, 18484, 21871, 18684, 18700, 19049, 17265, 22024, 17726, 17421, 17447, 17192, 20736,
  /*  2850 */ 21864, 17311, 18693, 19042, 19051, 17471, 32925, 17521, 17544, 17251, 36426, 17836, 17699, 20346, 21147,
  /*  2865 */ 17567, 17583, 17609, 21878, 17528, 17551, 17258, 36433, 21906, 21931, 17635, 36482, 18271, 17657, 17685,
  /*  2880 */ 20514, 17715, 17742, 17784, 33554, 21937, 17641, 36488, 18277, 36546, 17501, 19195, 17914, 17946, 18380,
  /*  2895 */ 17807, 17886, 17614, 21611, 17505, 19199, 17918, 18766, 17972, 36566, 20653, 17988, 18033, 18762, 18716,
  /*  2910 */ 18437, 18656, 18093, 18110, 18126, 18171, 18197, 18741, 18106, 18263, 18304, 18293, 18320, 18017, 18350,
  /*  2925 */ 18366, 18408, 17861, 36418, 19275, 17850, 17163, 30666, 18424, 17870, 32934, 17669, 18840, 18453, 18469,
  /*  2940 */ 18554, 17393, 18782, 18540, 18570, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2955 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2970 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  2985 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3000 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3015 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3030 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3045 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3060 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22396, 18871, 19030,
  /*  3075 */ 19051, 19276, 30675, 19051, 17173, 30787, 36452, 17330, 17349, 18964, 17189, 17208, 17281, 17756, 19181,
  /*  3090 */ 17308, 17327, 17346, 18961, 18484, 21871, 18684, 18700, 19049, 17265, 22024, 17726, 17421, 17447, 17192,
  /*  3105 */ 20736, 19323, 17311, 18693, 19042, 19051, 17471, 32925, 17521, 17544, 17251, 36426, 17836, 17699, 20346,
  /*  3120 */ 21147, 17567, 17583, 19215, 21878, 17528, 17551, 17258, 36433, 21906, 21931, 17635, 36482, 18271, 17657,
  /*  3135 */ 17685, 20514, 17715, 17742, 17784, 33554, 21937, 17641, 36488, 18277, 36546, 17501, 19195, 17914, 17946,
  /*  3150 */ 18380, 17807, 17886, 17614, 21611, 17505, 19199, 17918, 18766, 17972, 36566, 20653, 17988, 18033, 18762,
  /*  3165 */ 18716, 18437, 18656, 18093, 18110, 18126, 18171, 18197, 18741, 18106, 18263, 18304, 18293, 18320, 18017,
  /*  3180 */ 18350, 18366, 18408, 17861, 36418, 19275, 17850, 17163, 30666, 18424, 17870, 32934, 17669, 18840, 18453,
  /*  3195 */ 18469, 18554, 17393, 18782, 18540, 18570, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3210 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3225 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3240 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3255 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3270 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3285 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3300 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3315 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 21774, 18871,
  /*  3330 */ 19030, 19051, 19276, 17768, 19051, 17173, 30787, 36452, 17330, 17349, 18964, 17189, 17208, 17281, 17756,
  /*  3345 */ 19261, 17308, 17327, 17346, 18961, 18484, 21871, 18684, 18700, 19049, 17265, 22024, 17726, 17421, 17447,
  /*  3360 */ 17192, 20736, 21864, 17311, 18693, 19042, 19051, 17471, 32925, 17521, 17544, 17251, 36426, 17836, 17699,
  /*  3375 */ 20346, 21147, 17567, 17583, 17609, 21878, 17528, 17551, 17258, 36433, 21906, 21931, 17635, 36482, 18271,
  /*  3390 */ 17657, 17685, 20514, 17715, 17742, 17784, 33554, 21937, 17641, 36488, 18277, 36546, 17501, 19195, 17914,
  /*  3405 */ 17946, 18380, 17807, 17886, 17614, 21611, 17505, 19199, 17918, 18766, 17972, 36566, 20653, 17988, 18033,
  /*  3420 */ 18762, 18716, 18437, 18656, 18093, 18110, 18126, 18171, 18197, 18741, 18106, 18263, 18304, 18293, 18320,
  /*  3435 */ 18017, 18350, 18366, 18408, 17861, 36418, 19275, 17850, 17163, 30666, 18424, 17870, 32934, 17669, 18840,
  /*  3450 */ 18453, 18469, 18554, 17393, 18782, 18540, 18570, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3465 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3480 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3495 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3510 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3525 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3540 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3555 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3570 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 21642,
  /*  3585 */ 18871, 19030, 19051, 19276, 17768, 19051, 17173, 30787, 36452, 17330, 17349, 18964, 17189, 17208, 17281,
  /*  3600 */ 17756, 18003, 17308, 17327, 17346, 18961, 18484, 21871, 18684, 18700, 19049, 17265, 22024, 17726, 17421,
  /*  3615 */ 17447, 17192, 20736, 21864, 17311, 18693, 19042, 19051, 17471, 32925, 17521, 17544, 17251, 36426, 17836,
  /*  3630 */ 17699, 20346, 21147, 17567, 17583, 17609, 21878, 17528, 17551, 17258, 36433, 21906, 21931, 17635, 36482,
  /*  3645 */ 18271, 17657, 17685, 20514, 17715, 17742, 17784, 33554, 21937, 17641, 36488, 18277, 36546, 17501, 19195,
  /*  3660 */ 17914, 17946, 18380, 17807, 17886, 17614, 21611, 17505, 19199, 17918, 18766, 17972, 36566, 20653, 17988,
  /*  3675 */ 18033, 18762, 18716, 18437, 18656, 18093, 18110, 18126, 18171, 18197, 18741, 18106, 18263, 18304, 18293,
  /*  3690 */ 18320, 18017, 18350, 18366, 18408, 17861, 36418, 19275, 17850, 17163, 30666, 18424, 17870, 32934, 17669,
  /*  3705 */ 18840, 18453, 18469, 18554, 17393, 18782, 18540, 18570, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3720 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3735 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3750 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3765 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3780 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3795 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3810 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3825 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3840 */ 19292, 19308, 19350, 18506, 27885, 30525, 24400, 31433, 23339, 18506, 19394, 18506, 18508, 27218, 19413,
  /*  3855 */ 27218, 27218, 19435, 24400, 34311, 24400, 24400, 25501, 18506, 18506, 18506, 18506, 18506, 25810, 27218,
  /*  3870 */ 27218, 27218, 27218, 28546, 19483, 24400, 24400, 24400, 24400, 24033, 18048, 24057, 18506, 18506, 18506,
  /*  3885 */ 18508, 19511, 27218, 27218, 27218, 27218, 19527, 35539, 19563, 24400, 24400, 24400, 19671, 18506, 35639,
  /*  3900 */ 18506, 18506, 23068, 27218, 19581, 27218, 27218, 30780, 24009, 24400, 19603, 24400, 24400, 26774, 18506,
  /*  3915 */ 18506, 19370, 27883, 27218, 27218, 19623, 17614, 24014, 24400, 24400, 19643, 25699, 18506, 18506, 28527,
  /*  3930 */ 27218, 27219, 24013, 19663, 19911, 28435, 18926, 18507, 19687, 27218, 24341, 35860, 19911, 31007, 19737,
  /*  3945 */ 19419, 19760, 22275, 19778, 22089, 19794, 35170, 19819, 19840, 19860, 19883, 25810, 34264, 24132, 19744,
  /*  3960 */ 19899, 31004, 23498, 30997, 28320, 19462, 27972, 19702, 27960, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3975 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  3990 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4005 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4020 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4035 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4050 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4065 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4080 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4095 */ 17614, 21759, 18871, 19030, 19051, 19276, 17431, 19051, 17173, 30787, 36452, 17330, 17349, 18964, 17189,
  /*  4110 */ 17208, 17281, 17756, 18003, 17308, 17327, 17346, 18961, 18484, 21871, 18684, 18700, 19049, 17265, 22024,
  /*  4125 */ 17726, 17421, 17447, 17192, 20736, 21864, 17311, 18693, 19042, 19051, 17471, 32925, 17521, 17544, 17251,
  /*  4140 */ 36426, 17836, 17699, 20346, 21147, 17567, 17583, 17609, 21878, 17528, 17551, 17258, 36433, 21906, 21931,
  /*  4155 */ 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742, 17784, 33554, 21937, 17641, 36488, 18277, 36546,
  /*  4170 */ 17501, 19195, 17914, 17946, 18380, 17807, 17886, 17614, 21611, 17505, 19199, 17918, 18766, 17972, 36566,
  /*  4185 */ 20653, 17988, 18033, 18762, 18716, 18437, 18656, 18093, 18110, 18126, 18171, 18197, 18741, 18106, 18263,
  /*  4200 */ 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861, 36418, 19275, 17850, 17163, 30666, 18424, 17870,
  /*  4215 */ 32934, 17669, 18840, 18453, 18469, 18554, 17393, 18782, 18540, 18570, 17614, 17614, 17614, 17614, 17614,
  /*  4230 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4245 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4260 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4275 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4290 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4305 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4320 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4335 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4350 */ 17614, 17614, 22381, 18871, 19931, 19051, 19276, 17768, 19051, 17173, 30787, 36452, 17330, 17349, 18964,
  /*  4365 */ 17189, 17208, 17281, 17756, 18003, 17308, 17327, 17346, 18961, 18484, 21871, 18684, 18700, 19049, 17265,
  /*  4380 */ 22024, 17726, 17421, 17447, 17192, 20736, 21864, 17311, 18693, 19042, 19051, 17471, 32925, 17521, 17544,
  /*  4395 */ 17251, 36426, 17836, 17699, 20346, 21147, 17567, 17583, 17609, 21878, 17528, 17551, 17258, 36433, 21906,
  /*  4410 */ 21931, 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742, 17784, 33554, 21937, 17641, 36488, 18277,
  /*  4425 */ 36546, 17501, 19195, 17914, 17946, 18380, 17807, 17886, 17614, 21611, 17505, 19199, 17918, 18766, 17972,
  /*  4440 */ 36566, 20653, 17988, 18033, 18762, 18716, 18437, 18656, 18093, 18110, 18126, 18171, 18197, 18741, 18106,
  /*  4455 */ 18263, 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861, 36418, 19275, 17850, 17163, 30666, 18424,
  /*  4470 */ 17870, 32934, 17669, 18840, 18453, 18469, 18554, 17393, 18782, 18540, 18570, 17614, 17614, 17614, 17614,
  /*  4485 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4500 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4515 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4530 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4545 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4560 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4575 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4590 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4605 */ 17614, 17614, 17614, 21657, 18871, 19350, 18506, 27885, 30560, 24400, 29192, 21458, 18506, 18506, 18506,
  /*  4620 */ 18508, 27218, 27218, 27218, 27218, 19959, 24400, 24400, 24400, 24400, 32332, 18506, 18506, 18506, 18506,
  /*  4635 */ 18506, 25810, 27218, 27218, 27218, 27218, 28546, 19989, 24400, 24400, 24400, 24400, 31489, 18499, 18506,
  /*  4650 */ 18506, 18506, 18506, 18508, 27218, 27218, 27218, 27218, 27218, 20012, 24400, 24400, 24400, 24400, 24400,
  /*  4665 */ 33670, 18506, 18506, 18506, 18506, 23068, 27218, 27218, 27218, 27218, 29539, 29955, 24400, 24400, 24400,
  /*  4680 */ 24400, 26130, 18506, 18506, 18506, 27883, 27218, 27218, 27218, 20041, 22950, 24400, 24400, 24400, 18505,
  /*  4695 */ 18506, 18506, 27218, 27218, 35787, 20071, 24401, 19911, 25693, 18506, 18507, 27218, 27218, 19762, 23886,
  /*  4710 */ 19911, 31007, 18508, 27218, 31818, 19449, 19490, 23068, 23312, 19871, 31006, 27884, 34267, 19883, 25810,
  /*  4725 */ 34264, 19880, 25809, 19803, 31004, 23498, 30997, 22096, 19462, 27972, 19702, 27960, 17614, 17614, 17614,
  /*  4740 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4755 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4770 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4785 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4800 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4815 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4830 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4845 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  4860 */ 17614, 17614, 17614, 17614, 20092, 19082, 20182, 20391, 20874, 17956, 20300, 20843, 25667, 20594, 20484,
  /*  4875 */ 20209, 20233, 17189, 17208, 17281, 17756, 20256, 20297, 20319, 20362, 22472, 20767, 20590, 21345, 20625,
  /*  4890 */ 20389, 20927, 21223, 17726, 17421, 17447, 17192, 20736, 22441, 20303, 25565, 22452, 20300, 20407, 19007,
  /*  4905 */ 20445, 20470, 21333, 21041, 20500, 17699, 20346, 21147, 17567, 17583, 17609, 22479, 20530, 19547, 20270,
  /*  4920 */ 20546, 20281, 20454, 20575, 20610, 20217, 20641, 17685, 20514, 17715, 17742, 17784, 19537, 20669, 20682,
  /*  4935 */ 22462, 21017, 21087, 19014, 21101, 20698, 20726, 18380, 17807, 17886, 17614, 25552, 20373, 20752, 20802,
  /*  4950 */ 20193, 20818, 21392, 20653, 17988, 18033, 18584, 20834, 20559, 25576, 20859, 20890, 18126, 18171, 20906,
  /*  4965 */ 20943, 21003, 21033, 21057, 18293, 21073, 18598, 21117, 21133, 21197, 21172, 20920, 20873, 21161, 21213,
  /*  4980 */ 21249, 21274, 21181, 20240, 17405, 21286, 21302, 21318, 20710, 20334, 21361, 21377, 21408, 17614, 17614,
  /*  4995 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5010 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5025 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5040 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5055 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5070 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5085 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5100 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5115 */ 17614, 17614, 17614, 17614, 17614, 21968, 18871, 19030, 19051, 19276, 17768, 19051, 17173, 30787, 36452,
  /*  5130 */ 17330, 17349, 18964, 17189, 17208, 17281, 17756, 18003, 17308, 17327, 17346, 18961, 21443, 21871, 18684,
  /*  5145 */ 18700, 19049, 17265, 22024, 17726, 17421, 17447, 17192, 20736, 21864, 17311, 18693, 19042, 19051, 21495,
  /*  5160 */ 32925, 17521, 17544, 17251, 36426, 17836, 17699, 20346, 21147, 17567, 17583, 17609, 21878, 17528, 17551,
  /*  5175 */ 17258, 36433, 36516, 21931, 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742, 17784, 28683, 21937,
  /*  5190 */ 17641, 36488, 18277, 17237, 17501, 19195, 17914, 17946, 18380, 17807, 17886, 21566, 21525, 17505, 19199,
  /*  5205 */ 17918, 18766, 17972, 36566, 20653, 17988, 21551, 30652, 18716, 18437, 18656, 18093, 18110, 18126, 18171,
  /*  5220 */ 18197, 18741, 18106, 18263, 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861, 36418, 19275, 17850,
  /*  5235 */ 17163, 30666, 18424, 17870, 32934, 17669, 18840, 18453, 18469, 18554, 17393, 18782, 18540, 18570, 17614,
  /*  5250 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5265 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5280 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5295 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5310 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5325 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5340 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5355 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5370 */ 17614, 17614, 17614, 17614, 17614, 17614, 21789, 18871, 21603, 19051, 19276, 17768, 19051, 17173, 30787,
  /*  5385 */ 36452, 17330, 17349, 18964, 17189, 17208, 17281, 17756, 18003, 17308, 17327, 17346, 18961, 18484, 21871,
  /*  5400 */ 18684, 18700, 19049, 17265, 22024, 17726, 17421, 17447, 17192, 20736, 21864, 17311, 18693, 19042, 19051,
  /*  5415 */ 17471, 32925, 17521, 17544, 17251, 36426, 17836, 17699, 20346, 21147, 17567, 17583, 17609, 21878, 17528,
  /*  5430 */ 17551, 17258, 36433, 21906, 21931, 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742, 17784, 33554,
  /*  5445 */ 21937, 17641, 36488, 18277, 36546, 17501, 19195, 17914, 17946, 18380, 17807, 17886, 17614, 21611, 17505,
  /*  5460 */ 19199, 17918, 18766, 17972, 36566, 20653, 17988, 18033, 18762, 18716, 18437, 18656, 18093, 18110, 18126,
  /*  5475 */ 18171, 18197, 18741, 18106, 18263, 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861, 36418, 19275,
  /*  5490 */ 17850, 17163, 30666, 18424, 17870, 32934, 17669, 18840, 18453, 18469, 18554, 17393, 18782, 18540, 18570,
  /*  5505 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5520 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5535 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5550 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5565 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5580 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5595 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5610 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5625 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 21627, 18871, 19030, 19051, 19276, 21233, 19051, 17173,
  /*  5640 */ 30787, 36452, 17330, 17349, 18964, 17189, 17208, 17281, 17756, 18003, 17308, 17327, 17346, 18961, 18484,
  /*  5655 */ 21871, 18684, 18700, 19049, 17265, 22024, 17726, 17421, 17447, 17192, 20736, 21864, 17311, 18693, 19042,
  /*  5670 */ 19051, 17471, 32925, 17521, 17544, 17251, 36426, 17836, 17699, 20346, 21147, 17567, 17583, 17609, 21878,
  /*  5685 */ 17528, 17551, 17258, 36433, 21906, 21931, 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742, 17784,
  /*  5700 */ 33554, 21937, 17641, 36488, 18277, 36546, 17501, 19195, 17914, 17946, 18380, 17807, 17886, 17614, 21611,
  /*  5715 */ 17505, 19199, 17918, 18766, 17972, 36566, 20653, 17988, 18033, 18762, 18716, 18437, 18656, 18093, 18110,
  /*  5730 */ 18126, 18171, 18197, 18741, 18106, 18263, 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861, 36418,
  /*  5745 */ 19275, 17850, 17163, 30666, 18424, 17870, 32934, 17669, 18840, 18453, 18469, 18554, 17393, 18782, 18540,
  /*  5760 */ 18570, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5775 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5790 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5805 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5820 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5835 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5850 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5865 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  5880 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 21744, 19139, 21894, 19051, 19276, 17768, 19051,
  /*  5895 */ 19334, 30787, 36452, 17330, 17349, 18964, 17189, 17208, 17281, 17756, 18003, 17308, 17327, 17346, 18961,
  /*  5910 */ 17379, 21871, 18684, 18700, 19049, 17265, 22024, 17726, 17421, 17447, 17192, 20736, 21864, 17311, 18693,
  /*  5925 */ 19042, 19051, 17471, 21922, 17521, 17544, 17251, 36426, 17836, 17699, 20346, 21147, 17567, 17583, 17609,
  /*  5940 */ 21878, 17528, 17551, 17258, 36433, 18334, 21931, 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742,
  /*  5955 */ 17784, 33554, 21937, 17641, 36488, 18277, 36546, 17501, 19195, 17914, 17946, 18380, 17807, 17886, 17614,
  /*  5970 */ 21611, 17505, 19199, 17918, 18766, 17972, 36566, 20653, 17988, 18033, 18762, 18716, 18437, 18656, 18093,
  /*  5985 */ 18110, 18126, 18171, 18197, 18741, 18106, 18263, 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861,
  /*  6000 */ 36418, 19275, 17850, 17163, 30666, 18424, 17870, 32934, 17669, 18840, 18453, 18469, 18554, 17393, 18782,
  /*  6015 */ 18540, 18570, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6030 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6045 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6060 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6075 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6090 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6105 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6120 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6135 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 21953, 18629, 19030, 19051, 19276, 22034,
  /*  6150 */ 19051, 17173, 30787, 36452, 17330, 17349, 18964, 17189, 17208, 17281, 17756, 18003, 17308, 17327, 17346,
  /*  6165 */ 18961, 18484, 21871, 18684, 18700, 19049, 17265, 22024, 17726, 17421, 17447, 17192, 20736, 21864, 17311,
  /*  6180 */ 18693, 19042, 19051, 17471, 32925, 17521, 17544, 17251, 36426, 17836, 17699, 20346, 21147, 17567, 17583,
  /*  6195 */ 17609, 21878, 17528, 17551, 17258, 36433, 21906, 21931, 17635, 36482, 18271, 17657, 17685, 20514, 17715,
  /*  6210 */ 17742, 17784, 33554, 21937, 17641, 36488, 18277, 36546, 17501, 19195, 17914, 17946, 18380, 17807, 17886,
  /*  6225 */ 17614, 21611, 17505, 19199, 17918, 18766, 17972, 36566, 20653, 17988, 18033, 18762, 18716, 18437, 18656,
  /*  6240 */ 18093, 18110, 18126, 18171, 18197, 18741, 18106, 18263, 18304, 18293, 18320, 18017, 18350, 18366, 18408,
  /*  6255 */ 17861, 36418, 19275, 17850, 17163, 30666, 18424, 17870, 32934, 17669, 18840, 18453, 18469, 18554, 17393,
  /*  6270 */ 18782, 18540, 18570, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6285 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6300 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6315 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6330 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6345 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6360 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6375 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6390 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 21672, 21849, 19030, 19051, 19276,
  /*  6405 */ 17768, 19051, 21535, 30787, 36452, 17330, 17349, 18964, 17189, 17208, 17281, 17756, 18003, 17308, 17327,
  /*  6420 */ 17346, 18961, 18484, 21871, 18684, 18700, 19049, 17265, 22024, 17726, 17421, 17447, 17192, 20736, 21864,
  /*  6435 */ 17311, 18693, 19042, 19051, 17471, 32925, 17521, 17544, 17251, 36426, 17836, 17699, 20346, 21147, 17567,
  /*  6450 */ 17583, 17609, 21878, 17528, 17551, 17258, 36433, 21906, 21931, 17635, 36482, 18271, 17657, 17685, 20514,
  /*  6465 */ 17715, 17742, 17784, 33554, 21937, 17641, 36488, 18277, 36546, 17501, 19195, 17914, 17946, 18380, 17807,
  /*  6480 */ 17886, 17614, 21611, 17505, 19199, 17918, 18766, 17972, 36566, 20653, 17988, 18033, 18762, 18716, 18437,
  /*  6495 */ 18656, 18093, 18110, 18126, 18171, 18197, 18741, 18106, 18263, 18304, 18293, 18320, 18017, 18350, 18366,
  /*  6510 */ 18408, 17861, 36418, 19275, 17850, 17163, 30666, 18424, 17870, 32934, 17669, 18840, 18453, 18469, 18554,
  /*  6525 */ 17393, 18782, 18540, 18570, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6540 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6555 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6570 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6585 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6600 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6615 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6630 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6645 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22321, 18871, 22050, 18506,
  /*  6660 */ 27885, 25341, 24400, 29192, 22078, 18506, 18506, 18506, 18508, 27218, 27218, 27218, 27218, 22112, 24400,
  /*  6675 */ 24400, 24400, 24400, 30637, 18506, 18506, 18506, 18506, 18506, 25810, 27218, 27218, 27218, 27218, 35026,
  /*  6690 */ 22164, 24400, 24400, 24400, 24400, 31489, 31675, 18506, 18506, 18506, 18506, 18508, 27218, 27218, 27218,
  /*  6705 */ 27218, 27218, 19527, 24400, 24400, 24400, 24400, 24400, 32269, 18506, 18506, 18506, 18506, 23068, 27218,
  /*  6720 */ 27218, 27218, 27218, 30780, 21422, 24400, 24400, 24400, 24400, 26130, 18506, 18506, 18506, 27883, 27218,
  /*  6735 */ 27218, 27218, 22187, 22950, 24400, 24400, 24400, 22244, 18506, 18506, 27218, 27218, 35787, 20071, 24401,
  /*  6750 */ 19911, 25693, 18506, 18507, 27218, 27218, 19762, 23886, 19911, 31007, 18508, 27218, 31818, 19449, 19490,
  /*  6765 */ 23068, 23312, 19871, 31006, 27884, 34267, 19883, 25810, 34264, 19880, 25809, 19803, 31004, 23498, 30997,
  /*  6780 */ 22096, 19462, 27972, 19702, 27960, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6795 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6810 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6825 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6840 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6855 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6870 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6885 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  6900 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22321, 18871, 22050,
  /*  6915 */ 18506, 27885, 25341, 24400, 29192, 22078, 18506, 18506, 18506, 18508, 27218, 27218, 27218, 27218, 22112,
  /*  6930 */ 24400, 24400, 24400, 24400, 30637, 18506, 18506, 18506, 18506, 18506, 25810, 27218, 27218, 27218, 27218,
  /*  6945 */ 35026, 22164, 24400, 24400, 24400, 24400, 31489, 31675, 18506, 18506, 18506, 18506, 18508, 27218, 27218,
  /*  6960 */ 27218, 27218, 27218, 19527, 24400, 24400, 24400, 24400, 24400, 31170, 18506, 18506, 18506, 18506, 23068,
  /*  6975 */ 27218, 27218, 27218, 27218, 30780, 21422, 24400, 24400, 24400, 24400, 26130, 18506, 18506, 18506, 27883,
  /*  6990 */ 27218, 27218, 27218, 22187, 22950, 24400, 24400, 24400, 18505, 18506, 18506, 27218, 27218, 35787, 20071,
  /*  7005 */ 24401, 19911, 25693, 18506, 18507, 27218, 27218, 19762, 23886, 19911, 31007, 18508, 27218, 31818, 19449,
  /*  7020 */ 19490, 23068, 23312, 19871, 31006, 27884, 34267, 19883, 25810, 34264, 19880, 25809, 19803, 31004, 23498,
  /*  7035 */ 30997, 22096, 19462, 27972, 19702, 27960, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7050 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7065 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7080 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7095 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7110 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7125 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7140 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7155 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22321, 18871,
  /*  7170 */ 22050, 18506, 27885, 25341, 24400, 29192, 22078, 18506, 18506, 18506, 18508, 27218, 27218, 27218, 27218,
  /*  7185 */ 22112, 24400, 24400, 24400, 24400, 31660, 18506, 18506, 18506, 18506, 18506, 25810, 27218, 27218, 27218,
  /*  7200 */ 27218, 35026, 22164, 24400, 24400, 24400, 24400, 31489, 31675, 18506, 18506, 18506, 18506, 18508, 27218,
  /*  7215 */ 27218, 27218, 27218, 27218, 19527, 24400, 24400, 24400, 24400, 24400, 31170, 18506, 18506, 18506, 18506,
  /*  7230 */ 23068, 27218, 27218, 27218, 27218, 30780, 21422, 24400, 24400, 24400, 24400, 26130, 18506, 18506, 18506,
  /*  7245 */ 27883, 27218, 27218, 27218, 22187, 22950, 24400, 24400, 24400, 18505, 18506, 18506, 27218, 27218, 35787,
  /*  7260 */ 20071, 24401, 19911, 25693, 18506, 18507, 27218, 27218, 19762, 23886, 19911, 31007, 18508, 27218, 31818,
  /*  7275 */ 19449, 19490, 23068, 23312, 19871, 31006, 27884, 34267, 19883, 25810, 34264, 19880, 25809, 19803, 31004,
  /*  7290 */ 23498, 30997, 22096, 19462, 27972, 19702, 27960, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7305 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7320 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7335 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7350 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7365 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7380 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7395 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7410 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22321,
  /*  7425 */ 18871, 22050, 18506, 27885, 25341, 24400, 29192, 22078, 18506, 18506, 18506, 18508, 27218, 27218, 27218,
  /*  7440 */ 27218, 22112, 24400, 24400, 24400, 24400, 30637, 18506, 18506, 18506, 18506, 18506, 25810, 27218, 27218,
  /*  7455 */ 27218, 27218, 35026, 22164, 24400, 24400, 24400, 24400, 33573, 31675, 18506, 18506, 18506, 18506, 18508,
  /*  7470 */ 27218, 27218, 27218, 27218, 27218, 19527, 24400, 24400, 24400, 24400, 24400, 31170, 18506, 18506, 18506,
  /*  7485 */ 18506, 23068, 27218, 27218, 27218, 27218, 30780, 21422, 24400, 24400, 24400, 24400, 26130, 18506, 18506,
  /*  7500 */ 18506, 27883, 27218, 27218, 27218, 22187, 22950, 24400, 24400, 24400, 18505, 18506, 18506, 27218, 27218,
  /*  7515 */ 35787, 20071, 24401, 19911, 25693, 18506, 18507, 27218, 27218, 19762, 23886, 19911, 31007, 18508, 27218,
  /*  7530 */ 31818, 19449, 19490, 23068, 23312, 19871, 31006, 27884, 34267, 19883, 25810, 34264, 19880, 25809, 19803,
  /*  7545 */ 31004, 23498, 30997, 22096, 19462, 27972, 19702, 27960, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7560 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7575 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7590 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7605 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7620 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7635 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7650 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7665 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7680 */ 22321, 18871, 22050, 18506, 27885, 34084, 24400, 29192, 22078, 18506, 18506, 18506, 18508, 27218, 27218,
  /*  7695 */ 27218, 27218, 22261, 24400, 24400, 24400, 24400, 30637, 18506, 18506, 18506, 18506, 18506, 25810, 27218,
  /*  7710 */ 27218, 27218, 27218, 35026, 22164, 24400, 24400, 24400, 24400, 31489, 31675, 18506, 18506, 18506, 18506,
  /*  7725 */ 18508, 27218, 27218, 27218, 27218, 27218, 19527, 24400, 24400, 24400, 24400, 24400, 31170, 18506, 18506,
  /*  7740 */ 18506, 18506, 23068, 27218, 27218, 27218, 27218, 30780, 21422, 24400, 24400, 24400, 24400, 26130, 18506,
  /*  7755 */ 18506, 18506, 27883, 27218, 27218, 27218, 22187, 22950, 24400, 24400, 24400, 18505, 18506, 18506, 27218,
  /*  7770 */ 27218, 35787, 20071, 24401, 19911, 25693, 18506, 18507, 27218, 27218, 19762, 23886, 19911, 31007, 18508,
  /*  7785 */ 27218, 31818, 19449, 19490, 23068, 23312, 19871, 31006, 27884, 34267, 19883, 25810, 34264, 19880, 25809,
  /*  7800 */ 19803, 31004, 23498, 30997, 22096, 19462, 27972, 19702, 27960, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7815 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7830 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7845 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7860 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7875 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7890 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7905 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7920 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  7935 */ 17614, 22321, 18871, 22050, 18506, 27885, 25341, 24400, 29192, 22078, 18506, 18506, 18506, 18508, 27218,
  /*  7950 */ 27218, 27218, 27218, 22112, 24400, 24400, 24400, 24400, 18901, 18506, 18506, 18506, 18506, 18506, 25810,
  /*  7965 */ 27218, 27218, 27218, 27218, 35026, 22164, 24400, 24400, 24400, 24400, 24033, 31675, 18506, 18506, 18506,
  /*  7980 */ 18506, 18508, 27218, 27218, 27218, 27218, 27218, 19527, 24400, 24400, 24400, 24400, 24400, 19671, 18506,
  /*  7995 */ 18506, 18506, 18506, 23068, 27218, 27218, 27218, 27218, 30780, 24009, 24400, 24400, 24400, 24400, 26774,
  /*  8010 */ 18506, 18506, 18506, 27883, 27218, 27218, 27218, 17614, 24014, 24400, 24400, 24400, 18505, 18506, 18506,
  /*  8025 */ 27218, 27218, 27219, 24013, 24401, 19911, 25693, 18506, 18507, 27218, 27218, 19762, 23886, 19911, 31007,
  /*  8040 */ 18508, 27218, 31818, 19449, 19490, 23068, 23312, 19871, 31006, 27884, 34267, 19883, 25810, 34264, 19880,
  /*  8055 */ 25809, 19803, 31004, 23498, 30997, 22096, 19462, 27972, 19702, 27960, 17614, 17614, 17614, 17614, 17614,
  /*  8070 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8085 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8100 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8115 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8130 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8145 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8160 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8175 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8190 */ 17614, 17614, 22306, 18871, 22050, 18506, 27885, 34973, 24400, 29192, 22078, 18506, 18506, 18506, 18508,
  /*  8205 */ 27218, 27218, 27218, 27218, 22112, 24400, 24400, 24400, 24400, 18901, 18506, 18506, 18506, 18506, 18506,
  /*  8220 */ 25810, 27218, 27218, 27218, 27218, 35026, 22164, 24400, 24400, 24400, 24400, 24033, 31675, 18506, 18506,
  /*  8235 */ 18506, 18506, 18508, 27218, 27218, 27218, 27218, 27218, 19527, 24400, 24400, 24400, 24400, 24400, 19671,
  /*  8250 */ 18506, 18506, 18506, 18506, 23068, 27218, 27218, 27218, 27218, 30780, 24009, 24400, 24400, 24400, 24400,
  /*  8265 */ 26774, 18506, 18506, 18506, 27883, 27218, 27218, 27218, 17614, 24014, 24400, 24400, 24400, 18505, 18506,
  /*  8280 */ 18506, 27218, 27218, 27219, 24013, 24401, 19911, 25693, 18506, 18507, 27218, 27218, 19762, 23886, 19911,
  /*  8295 */ 31007, 18508, 27218, 31818, 19449, 19490, 23068, 23312, 19871, 31006, 27884, 34267, 19883, 25810, 34264,
  /*  8310 */ 19880, 25809, 19803, 31004, 23498, 30997, 22096, 19462, 27972, 19702, 27960, 17614, 17614, 17614, 17614,
  /*  8325 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8340 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8355 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8370 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8385 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8400 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8415 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8430 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8445 */ 17614, 17614, 17614, 22321, 18871, 22050, 18506, 27885, 25341, 24400, 29192, 22078, 18506, 18506, 18506,
  /*  8460 */ 18508, 27218, 27218, 27218, 27218, 22112, 24400, 24400, 24400, 24400, 18901, 18506, 18506, 18506, 18506,
  /*  8475 */ 18506, 25810, 27218, 27218, 27218, 27218, 35026, 22164, 24400, 24400, 24400, 24400, 24033, 31675, 18506,
  /*  8490 */ 18506, 18506, 18506, 18508, 27218, 27218, 27218, 27218, 27218, 19527, 24400, 24400, 24400, 24400, 24400,
  /*  8505 */ 19671, 18506, 18506, 18506, 18506, 23068, 27218, 27218, 27218, 27218, 30780, 24009, 24400, 24400, 24400,
  /*  8520 */ 24400, 34452, 18506, 18506, 18506, 27883, 27218, 27218, 27218, 17614, 24014, 24400, 24400, 24400, 18505,
  /*  8535 */ 18506, 18506, 27218, 27218, 27219, 24013, 24401, 19911, 25693, 18506, 18507, 27218, 27218, 19762, 23886,
  /*  8550 */ 19911, 31007, 18508, 27218, 31818, 19449, 19490, 23068, 23312, 19871, 31006, 27884, 34267, 19883, 25810,
  /*  8565 */ 34264, 19880, 25809, 19803, 31004, 23498, 30997, 22096, 19462, 27972, 19702, 27960, 17614, 17614, 17614,
  /*  8580 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8595 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8610 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8625 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8640 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8655 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8670 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8685 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8700 */ 17614, 17614, 17614, 17614, 22336, 18871, 19030, 19051, 19276, 17768, 19051, 17173, 27093, 36452, 17330,
  /*  8715 */ 17349, 18964, 17189, 17208, 17281, 17756, 18003, 17308, 17327, 17346, 18961, 18484, 21871, 18684, 18700,
  /*  8730 */ 19049, 17265, 22024, 17726, 17421, 17447, 17192, 20736, 21864, 17311, 18693, 19042, 19051, 17471, 32925,
  /*  8745 */ 17521, 17544, 17251, 36426, 17836, 17699, 20346, 21147, 17567, 17583, 17609, 21878, 17528, 17551, 17258,
  /*  8760 */ 36433, 21906, 21931, 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742, 17784, 33554, 21937, 17641,
  /*  8775 */ 36488, 18277, 36546, 17501, 19195, 17914, 17946, 18380, 17807, 17886, 17614, 21611, 17505, 19199, 17918,
  /*  8790 */ 18766, 17972, 36566, 20653, 17988, 18033, 18762, 18716, 18437, 19943, 18093, 18110, 18126, 18171, 18197,
  /*  8805 */ 18741, 18106, 18263, 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861, 36418, 19275, 17850, 17163,
  /*  8820 */ 30666, 18424, 17870, 32934, 17669, 18840, 18453, 18469, 18554, 17393, 18782, 18540, 18570, 17614, 17614,
  /*  8835 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8850 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8865 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8880 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8895 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8910 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8925 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8940 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  8955 */ 17614, 17614, 17614, 17614, 17614, 21819, 18871, 19030, 19051, 19276, 17768, 19051, 17173, 30787, 36452,
  /*  8970 */ 17330, 17349, 18964, 17189, 17208, 17281, 17756, 18003, 17308, 17327, 17346, 18961, 18484, 21871, 18684,
  /*  8985 */ 18700, 19049, 17265, 22024, 17726, 17421, 17447, 17192, 20736, 21864, 17311, 18693, 19042, 19051, 17471,
  /*  9000 */ 32925, 17521, 17544, 17251, 36426, 17836, 17699, 20346, 21147, 17567, 17583, 17609, 21878, 17528, 17551,
  /*  9015 */ 17258, 36433, 21906, 21931, 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742, 17784, 33554, 21937,
  /*  9030 */ 17641, 36488, 18277, 36546, 17501, 19195, 17914, 17946, 18380, 17807, 17886, 17614, 21611, 17505, 19199,
  /*  9045 */ 17918, 18766, 17972, 36566, 20653, 17988, 18033, 18762, 18716, 18437, 18656, 18093, 18110, 18126, 18171,
  /*  9060 */ 18197, 18741, 18106, 18263, 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861, 36418, 19275, 17850,
  /*  9075 */ 17163, 30666, 18424, 17870, 32934, 17669, 18840, 18453, 18469, 18554, 17393, 18782, 18540, 18570, 17614,
  /*  9090 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9105 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9120 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9135 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9150 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9165 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9180 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9195 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9210 */ 17614, 17614, 17614, 17614, 17614, 17614, 22291, 22495, 19030, 19051, 19276, 17768, 19051, 19165, 30787,
  /*  9225 */ 36452, 17330, 17349, 18964, 17189, 17208, 17281, 17756, 18003, 17308, 17327, 17346, 18961, 22526, 21871,
  /*  9240 */ 18684, 18700, 19049, 17265, 22024, 17726, 17421, 17447, 17192, 20736, 21864, 17311, 18693, 19042, 19051,
  /*  9255 */ 17471, 32925, 17521, 17544, 17251, 36426, 17836, 17699, 20346, 21147, 17567, 17583, 17609, 21878, 17528,
  /*  9270 */ 17551, 17258, 36433, 21906, 21931, 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742, 17784, 33554,
  /*  9285 */ 21937, 17641, 36488, 18277, 36546, 17501, 19195, 17914, 17946, 18380, 17807, 17886, 17614, 21611, 17505,
  /*  9300 */ 19199, 17918, 18766, 17972, 36566, 20653, 17988, 18033, 18762, 18716, 18437, 18656, 18093, 18110, 18126,
  /*  9315 */ 18171, 18197, 18741, 18106, 18263, 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861, 36418, 19275,
  /*  9330 */ 17850, 17163, 30666, 18424, 17870, 32934, 17669, 18840, 18453, 18469, 18554, 17393, 18782, 18540, 18570,
  /*  9345 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9360 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9375 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9390 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9405 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9420 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9435 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9450 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9465 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22590, 18871, 22970, 22986, 27613, 23002, 23018, 23049,
  /*  9480 */ 22078, 18506, 18506, 18506, 23065, 27218, 27218, 27218, 23084, 22112, 24400, 24400, 24400, 23104, 31375,
  /*  9495 */ 31098, 19717, 18506, 28128, 28241, 19467, 35061, 27218, 27218, 23124, 23155, 23171, 23194, 24400, 24400,
  /*  9510 */ 23228, 35346, 31675, 23244, 18506, 23272, 23290, 27811, 26728, 23309, 35230, 34895, 33356, 23328, 18247,
  /*  9525 */ 23375, 32724, 23965, 24400, 23396, 35271, 23445, 18506, 33900, 23424, 23464, 27218, 27218, 23514, 23534,
  /*  9540 */ 21422, 23557, 24400, 24400, 23586, 26130, 23617, 23639, 18506, 33460, 23667, 32891, 27218, 22187, 18886,
  /*  9555 */ 23718, 36605, 24400, 18505, 23747, 32617, 27218, 23766, 23784, 20071, 32985, 24383, 25693, 18506, 18507,
  /*  9570 */ 27218, 27218, 19762, 23886, 23800, 31007, 18508, 27218, 31818, 19449, 19490, 23068, 23312, 19871, 28233,
  /*  9585 */ 31811, 23820, 26941, 34932, 23847, 26517, 25809, 23875, 23911, 23498, 30997, 22096, 19462, 27972, 19702,
  /*  9600 */ 29828, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9615 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9630 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9645 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9660 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9675 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9690 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9705 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9720 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22605, 18871, 22050, 18506, 27885, 25341, 24400,
  /*  9735 */ 29192, 22078, 18506, 18506, 18506, 18508, 27218, 27218, 27218, 27218, 22112, 24400, 24400, 24400, 24400,
  /*  9750 */ 30637, 18506, 18506, 18506, 18506, 28918, 25810, 27218, 27218, 27218, 34035, 23930, 22164, 24400, 24400,
  /*  9765 */ 24400, 28409, 23946, 31675, 18506, 18506, 18506, 18506, 18508, 27218, 27218, 27218, 27218, 27218, 19527,
  /*  9780 */ 24400, 24400, 24400, 24400, 24400, 31170, 26607, 18506, 18506, 18506, 31601, 23981, 27218, 27218, 27218,
  /*  9795 */ 24002, 22201, 24030, 24400, 24400, 24400, 24049, 18506, 18506, 18506, 27883, 27218, 27218, 27218, 22187,
  /*  9810 */ 22950, 24400, 24400, 24400, 18505, 18506, 18506, 27218, 27218, 35787, 20071, 24401, 19911, 25693, 18506,
  /*  9825 */ 18507, 27218, 27218, 19762, 23886, 19911, 31007, 18508, 27218, 31818, 19449, 19490, 23068, 23312, 19871,
  /*  9840 */ 31006, 27884, 34267, 26520, 24073, 24123, 24148, 25809, 19803, 31004, 23498, 30997, 22096, 19462, 27972,
  /*  9855 */ 19702, 27960, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9870 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9885 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9900 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9915 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9930 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9945 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9960 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /*  9975 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22620, 18871, 22050, 19721, 27885, 24182,
  /*  9990 */ 24400, 24198, 24214, 26616, 18506, 18506, 18508, 24249, 24265, 27218, 27218, 22112, 24284, 24300, 24400,
  /* 10005 */ 24400, 30637, 19824, 35443, 36015, 32625, 18506, 25810, 24319, 28975, 23768, 27218, 35026, 22164, 24357,
  /* 10020 */ 32056, 26853, 24399, 31489, 31675, 18506, 18506, 18506, 24800, 18508, 27218, 27218, 27218, 27218, 24417,
  /* 10035 */ 19527, 24400, 24400, 24400, 24400, 20158, 31170, 18506, 18506, 18506, 27861, 23068, 27218, 27218, 33518,
  /* 10050 */ 27218, 30780, 21422, 24400, 24400, 22954, 24400, 26130, 18506, 36262, 18506, 27883, 27218, 24439, 27218,
  /* 10065 */ 22187, 22950, 24400, 24458, 24400, 36778, 28454, 18506, 34482, 34524, 35787, 24477, 24401, 24493, 25693,
  /* 10080 */ 18506, 36236, 27218, 27218, 24514, 30970, 23731, 31007, 18508, 27218, 31818, 19449, 19490, 23068, 23312,
  /* 10095 */ 24537, 31006, 27884, 34267, 30106, 23359, 24562, 19880, 25809, 19803, 31004, 23498, 26168, 22096, 19462,
  /* 10110 */ 29840, 24578, 27960, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10125 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10140 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10155 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10170 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10185 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10200 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10215 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10230 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22635, 18871, 22050, 25783, 22148,
  /* 10245 */ 25341, 23178, 29192, 24613, 24107, 23623, 24672, 26138, 24696, 24442, 24712, 28567, 22112, 24747, 24461,
  /* 10260 */ 24763, 23380, 30637, 18506, 18506, 18506, 18506, 24797, 25810, 27218, 27218, 27218, 34226, 35026, 22164,
  /* 10275 */ 24400, 24400, 24400, 33275, 31489, 22541, 24103, 24229, 18506, 18506, 34924, 24816, 30435, 27218, 27218,
  /* 10290 */ 32434, 19527, 29797, 35081, 24400, 24400, 19915, 31170, 24851, 18506, 18506, 24870, 29230, 27218, 27218,
  /* 10305 */ 32022, 27218, 30780, 35360, 24400, 24400, 31560, 24400, 26130, 33114, 27830, 27018, 27883, 34684, 25641,
  /* 10320 */ 24887, 22187, 22950, 19238, 34547, 24905, 18505, 18506, 18506, 27218, 27218, 35787, 20071, 24401, 19911,
  /* 10335 */ 25693, 18506, 33631, 27218, 27218, 24923, 24946, 23570, 31007, 18508, 27218, 31818, 22215, 19490, 23068,
  /* 10350 */ 23312, 19871, 30893, 31031, 24971, 19883, 24999, 34264, 30887, 25809, 19803, 31004, 23498, 30997, 22096,
  /* 10365 */ 19462, 25015, 19702, 27960, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10380 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10395 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10410 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10425 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10440 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10455 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10470 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10485 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22650, 18871, 25040, 25056,
  /* 10500 */ 31309, 25072, 25088, 25104, 22078, 34750, 24233, 36269, 34824, 32653, 25120, 23088, 32864, 22261, 36639,
  /* 10515 */ 25136, 30695, 27372, 30637, 25152, 26471, 25190, 25224, 22556, 23256, 25240, 25256, 25272, 25322, 25357,
  /* 10530 */ 25373, 25434, 25462, 25486, 26755, 25538, 31675, 23651, 25592, 27414, 25609, 28608, 25961, 25633, 27218,
  /* 10545 */ 32562, 27311, 25657, 25866, 25683, 24400, 34774, 25715, 25732, 22568, 27803, 30237, 25772, 25805, 25826,
  /* 10560 */ 25844, 28349, 29004, 30780, 21509, 33421, 25864, 25882, 25920, 26130, 31243, 26693, 30183, 27883, 25957,
  /* 10575 */ 25977, 27218, 22187, 22950, 25993, 26013, 24400, 23410, 27791, 25756, 25286, 26029, 26064, 26080, 26120,
  /* 10590 */ 26154, 26194, 26227, 26246, 26263, 30516, 26396, 26298, 28404, 31007, 33727, 27218, 33661, 26340, 36732,
  /* 10605 */ 26369, 26390, 35316, 31006, 26412, 26431, 30943, 26374, 33848, 26458, 26487, 26503, 26536, 23498, 33162,
  /* 10620 */ 26555, 26571, 27972, 31282, 27960, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10635 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10650 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10665 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10680 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10695 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10710 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10725 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10740 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22665, 18871, 26592,
  /* 10755 */ 26205, 26632, 25341, 26659, 29192, 22078, 26685, 18506, 18506, 18508, 26709, 27218, 27218, 27218, 22112,
  /* 10770 */ 26744, 24400, 24400, 24400, 30637, 18506, 18506, 18506, 18506, 26798, 25810, 27218, 27218, 27218, 26274,
  /* 10785 */ 35026, 22164, 24400, 24400, 24400, 21587, 31489, 31675, 18506, 18506, 33965, 18506, 18508, 27218, 27218,
  /* 10800 */ 25828, 27218, 27218, 19527, 24400, 24400, 24400, 26816, 24400, 31170, 18506, 18506, 18506, 35586, 23068,
  /* 10815 */ 27218, 27218, 27218, 26833, 30780, 21422, 24400, 24400, 24400, 26852, 26130, 18506, 18506, 18506, 27883,
  /* 10830 */ 27218, 27218, 27218, 22187, 22950, 24400, 24400, 24400, 18505, 18506, 18506, 27218, 27218, 35787, 20071,
  /* 10845 */ 24401, 19911, 25693, 31898, 18507, 35715, 27218, 19762, 26869, 19911, 31007, 18508, 27218, 31818, 19449,
  /* 10860 */ 19490, 23068, 23312, 26929, 31006, 27884, 34267, 19883, 25810, 34264, 19880, 25809, 19803, 31004, 23498,
  /* 10875 */ 24983, 31077, 19462, 26969, 27679, 27960, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10890 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10905 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10920 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10935 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10950 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10965 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10980 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 10995 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22680, 18871,
  /* 11010 */ 27006, 18506, 27885, 25341, 24400, 29192, 22078, 18506, 18506, 18506, 18508, 27218, 27218, 27218, 27218,
  /* 11025 */ 22112, 24400, 24400, 24400, 24400, 23033, 18506, 18506, 18506, 18506, 18506, 25810, 27218, 27218, 27218,
  /* 11040 */ 27218, 35026, 27040, 24400, 24400, 24400, 24400, 24033, 31675, 18506, 18506, 27063, 18506, 18508, 27218,
  /* 11055 */ 27218, 27347, 27218, 27218, 27082, 24400, 24400, 29041, 24400, 24400, 19671, 18506, 18506, 18506, 18506,
  /* 11070 */ 23068, 27218, 27218, 27218, 27218, 30780, 24009, 24400, 24400, 24400, 24400, 26774, 18506, 18506, 33973,
  /* 11085 */ 27883, 27218, 27218, 27109, 17614, 24014, 24400, 24400, 27130, 27151, 36338, 27169, 27217, 27235, 28375,
  /* 11100 */ 18241, 34796, 34421, 27251, 35988, 27284, 27309, 27327, 36056, 34000, 20970, 31867, 21469, 30551, 27363,
  /* 11115 */ 32536, 27388, 23068, 23312, 19871, 31006, 27884, 34267, 19883, 25810, 34264, 19880, 25809, 19803, 31004,
  /* 11130 */ 23498, 30997, 22096, 26353, 30134, 19702, 27960, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11145 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11160 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11175 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11190 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11205 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11220 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11235 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11250 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22321,
  /* 11265 */ 18871, 22050, 27413, 27430, 27452, 27468, 27489, 22078, 18506, 18506, 30187, 18508, 27218, 27218, 27998,
  /* 11280 */ 27218, 22112, 24400, 24400, 25716, 24400, 18901, 18506, 18506, 18506, 18506, 18506, 34029, 27218, 27218,
  /* 11295 */ 27218, 27218, 29747, 22164, 24400, 24400, 24400, 24400, 27135, 31675, 27505, 18506, 18506, 18506, 18508,
  /* 11310 */ 27201, 27218, 27218, 27218, 27218, 19527, 27473, 24400, 24400, 24400, 24400, 19671, 18506, 18506, 18506,
  /* 11325 */ 27066, 23068, 27218, 27218, 27218, 32485, 30780, 24009, 24400, 24400, 24400, 34998, 26774, 18506, 18506,
  /* 11340 */ 18506, 27883, 27218, 27218, 27218, 17614, 24014, 24400, 24400, 24400, 18505, 18506, 18506, 27218, 27218,
  /* 11355 */ 27219, 24013, 24401, 19911, 25693, 18506, 18507, 27218, 27218, 19762, 23886, 19911, 31007, 20786, 27218,
  /* 11370 */ 29378, 22126, 33956, 23068, 23312, 19871, 31006, 27884, 34267, 19883, 25810, 34264, 19880, 25809, 19803,
  /* 11385 */ 31004, 23498, 30997, 22096, 19462, 27972, 19702, 27960, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11400 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11415 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11430 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11445 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11460 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11475 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11490 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11505 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11520 */ 22695, 18871, 22050, 27524, 27544, 27569, 35198, 27585, 22078, 29709, 26316, 23274, 27601, 24731, 27629,
  /* 11535 */ 27218, 27664, 22112, 36613, 27714, 24400, 27749, 18901, 18506, 27827, 18506, 27846, 22062, 27881, 32210,
  /* 11550 */ 27218, 25174, 27901, 27929, 22164, 29474, 24400, 29993, 34408, 26766, 27779, 26905, 18506, 18506, 27268,
  /* 11565 */ 29902, 27945, 27218, 27218, 27218, 27997, 28014, 28040, 28061, 24400, 24400, 28078, 28097, 28144, 25522,
  /* 11580 */ 28161, 26104, 28176, 27218, 28189, 24656, 28205, 30780, 31512, 24400, 28221, 34170, 36182, 24955, 28257,
  /* 11595 */ 28275, 28299, 21479, 33050, 28336, 28365, 17614, 20957, 23108, 28391, 28425, 28111, 28451, 28470, 28490,
  /* 11610 */ 28525, 28543, 20025, 33698, 25895, 25693, 18506, 18507, 27218, 27218, 19762, 23886, 19911, 30288, 28283,
  /* 11625 */ 28562, 28583, 19449, 28599, 23068, 23312, 19871, 19495, 28624, 28669, 31091, 25810, 34264, 19880, 25809,
  /* 11640 */ 19803, 29660, 35966, 30334, 22096, 19462, 27972, 23139, 28709, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11655 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11670 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11685 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11700 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11715 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11730 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11745 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11760 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11775 */ 17614, 22321, 18871, 22050, 18506, 27885, 25341, 24400, 29192, 22078, 18506, 18506, 18506, 18508, 27218,
  /* 11790 */ 27218, 27218, 27218, 22112, 24400, 24400, 24400, 24400, 18901, 18506, 18506, 18506, 18506, 18506, 25810,
  /* 11805 */ 27218, 27218, 27218, 27218, 35026, 22164, 24400, 24400, 24400, 24400, 24033, 22510, 18506, 18506, 18506,
  /* 11820 */ 18506, 18508, 25299, 27218, 27218, 27218, 27218, 19527, 29413, 24400, 24400, 24400, 24400, 19671, 18506,
  /* 11835 */ 18506, 18506, 18506, 23068, 27218, 27218, 27218, 27218, 30780, 24009, 24400, 24400, 24400, 24400, 26774,
  /* 11850 */ 18506, 18506, 18506, 27883, 27218, 27218, 27218, 17614, 24014, 24400, 24400, 24400, 18505, 18506, 18506,
  /* 11865 */ 27218, 27218, 27219, 24013, 24401, 19911, 25693, 18506, 18507, 27218, 27218, 19762, 23886, 19911, 31007,
  /* 11880 */ 18508, 27218, 31818, 19449, 19490, 23068, 23312, 19871, 31006, 27884, 34267, 19883, 25810, 34264, 19880,
  /* 11895 */ 25809, 19803, 31004, 23498, 30997, 22096, 19462, 27972, 19702, 27960, 17614, 17614, 17614, 17614, 17614,
  /* 11910 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11925 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11940 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11955 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11970 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 11985 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12000 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12015 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12030 */ 17614, 17614, 22710, 18871, 28756, 28791, 28826, 28850, 28866, 28889, 28905, 24158, 28952, 31961, 36345,
  /* 12045 */ 25306, 28970, 27648, 28991, 29020, 24521, 29036, 25470, 29057, 23033, 27528, 29099, 29119, 30737, 18506,
  /* 12060 */ 23494, 29139, 24835, 27218, 29164, 28936, 27040, 29182, 23212, 24400, 29208, 35545, 31675, 18506, 18506,
  /* 12075 */ 25617, 32605, 29227, 27218, 27218, 31450, 30716, 29246, 27082, 24400, 24400, 24400, 29271, 29322, 19671,
  /* 12090 */ 18506, 33399, 18506, 18506, 23068, 27218, 29349, 27218, 27218, 30780, 24009, 35941, 24400, 24400, 24400,
  /* 12105 */ 27733, 36139, 18506, 18506, 29366, 29429, 27218, 35658, 17614, 21427, 29448, 24400, 25997, 18505, 33882,
  /* 12120 */ 18506, 27218, 26983, 27219, 24013, 32745, 19911, 25693, 18506, 26913, 27218, 27218, 29467, 23886, 24370,
  /* 12135 */ 31007, 18508, 27218, 31818, 19449, 19490, 23068, 23312, 19871, 31006, 27884, 31753, 19883, 25810, 34264,
  /* 12150 */ 19880, 29490, 29555, 29299, 29597, 29653, 22096, 32549, 29517, 19702, 27960, 17614, 17614, 17614, 17614,
  /* 12165 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12180 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12195 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12210 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12225 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12240 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12255 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12270 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12285 */ 17614, 17614, 17614, 22725, 18871, 22050, 29676, 29528, 25341, 33258, 29192, 29698, 27261, 18506, 29725,
  /* 12300 */ 33302, 26990, 27218, 29741, 29763, 22112, 19245, 24400, 32718, 29788, 18901, 26800, 33908, 28474, 18506,
  /* 12315 */ 18506, 25810, 29813, 27218, 29856, 27218, 35026, 22164, 35833, 24400, 29875, 24400, 24033, 36772, 25208,
  /* 12330 */ 18506, 18506, 29895, 18508, 27218, 29918, 27218, 26048, 27218, 29941, 24400, 29976, 24400, 33610, 24400,
  /* 12345 */ 19671, 18506, 18506, 18506, 18506, 23068, 27218, 27218, 27218, 27218, 29255, 30009, 24400, 24400, 24400,
  /* 12360 */ 24400, 26774, 18506, 18506, 18506, 27883, 27218, 27218, 27218, 17614, 24014, 24400, 24400, 24400, 31681,
  /* 12375 */ 18506, 18506, 19627, 27218, 27219, 24013, 30029, 19911, 25693, 18506, 18507, 27218, 27218, 19762, 23886,
  /* 12390 */ 19911, 31007, 18508, 27218, 31818, 19973, 19490, 36677, 19587, 19871, 30045, 30144, 30078, 19883, 25810,
  /* 12405 */ 30094, 19880, 25809, 19803, 31004, 23498, 30997, 22096, 19462, 27972, 19702, 30122, 17614, 17614, 17614,
  /* 12420 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12435 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12450 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12465 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12480 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12495 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12510 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12525 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12540 */ 17614, 17614, 17614, 17614, 22740, 18871, 30168, 30203, 30253, 30304, 30320, 30360, 22078, 35632, 32813,
  /* 12555 */ 25789, 18508, 29925, 34112, 26836, 27218, 22112, 24930, 23205, 29211, 24400, 18901, 34460, 30376, 18506,
  /* 12570 */ 18506, 18506, 23429, 24723, 27218, 27218, 27218, 35026, 30394, 35006, 24400, 24400, 24400, 24033, 29570,
  /* 12585 */ 18506, 18506, 27153, 18506, 31297, 30410, 27218, 27218, 30429, 30582, 19527, 30451, 24400, 24400, 29985,
  /* 12600 */ 35694, 19671, 28775, 30471, 35475, 35622, 23068, 28740, 30506, 30541, 30576, 30780, 24009, 20147, 30598,
  /* 12615 */ 30622, 30691, 26307, 33442, 28954, 27698, 30711, 23691, 33482, 28509, 17614, 23960, 20429, 34354, 20987,
  /* 12630 */ 32347, 26324, 30732, 30753, 24331, 30772, 21579, 36388, 30803, 26669, 24627, 33193, 32464, 30830, 31820,
  /* 12645 */ 25446, 25933, 26539, 18508, 28834, 31818, 29285, 19490, 28313, 34256, 23831, 26092, 30858, 30874, 32131,
  /* 12660 */ 30909, 30931, 32773, 25809, 30959, 31004, 23498, 30997, 30986, 31023, 27972, 19702, 29505, 17614, 17614,
  /* 12675 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12690 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12705 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12720 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12735 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12750 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12765 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12780 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12795 */ 17614, 17614, 17614, 17614, 17614, 22755, 18871, 31047, 31063, 32413, 31114, 31130, 31186, 22078, 18506,
  /* 12810 */ 29581, 35593, 36741, 27218, 33232, 31202, 24423, 22112, 24400, 20166, 31218, 34317, 27764, 31234, 33404,
  /* 12825 */ 27182, 18506, 29103, 27293, 27218, 31267, 31325, 27218, 31344, 31360, 24400, 31391, 31407, 24400, 31426,
  /* 12840 */ 31675, 18506, 36146, 32817, 18506, 18508, 27218, 27218, 31449, 31466, 27218, 19527, 24400, 24400, 31486,
  /* 12855 */ 33604, 24400, 32993, 18506, 18506, 18506, 18506, 30054, 27218, 27218, 27218, 27218, 31505, 32260, 24400,
  /* 12870 */ 24400, 24400, 24400, 31528, 18506, 28771, 18506, 24650, 35748, 27218, 27218, 28653, 31554, 35804, 24400,
  /* 12885 */ 24400, 19361, 32002, 18506, 33224, 25332, 27219, 30013, 29879, 19911, 25693, 18506, 18507, 27218, 27218,
  /* 12900 */ 19762, 31576, 19911, 31617, 32385, 33332, 30152, 31645, 19996, 31697, 31742, 31769, 31797, 30062, 31836,
  /* 12915 */ 31863, 25810, 34298, 19880, 25809, 19803, 31004, 23498, 30997, 22096, 19462, 27972, 31883, 30268, 17614,
  /* 12930 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12945 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12960 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12975 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 12990 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13005 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13020 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13035 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13050 */ 17614, 17614, 17614, 17614, 17614, 17614, 22770, 18871, 22050, 18933, 30490, 31918, 24303, 31934, 31950,
  /* 13065 */ 32783, 35278, 27024, 29637, 34119, 19844, 29432, 33339, 22112, 27047, 30455, 29451, 28873, 29612, 18506,
  /* 13080 */ 18506, 18506, 31977, 18506, 25810, 27218, 27218, 35054, 27218, 35026, 22164, 24400, 24400, 29405, 24400,
  /* 13095 */ 24033, 31995, 18506, 26953, 18506, 18506, 18508, 27218, 31470, 32018, 27218, 27218, 32038, 24400, 33031,
  /* 13110 */ 32072, 24400, 24400, 33706, 18506, 18506, 33135, 18506, 23068, 27218, 27218, 27640, 27218, 29772, 32094,
  /* 13125 */ 24400, 24400, 34348, 24400, 26774, 18506, 18506, 18506, 27883, 27218, 27218, 27218, 36707, 24014, 24400,
  /* 13140 */ 24400, 24400, 18505, 18506, 18506, 27218, 27218, 27219, 24013, 24401, 19911, 25693, 18506, 18507, 27218,
  /* 13155 */ 27218, 19762, 23886, 19911, 31007, 18508, 27218, 31818, 31726, 22171, 33197, 24268, 32119, 31006, 27884,
  /* 13170 */ 34267, 19883, 25810, 34264, 30281, 25809, 19803, 31004, 23498, 30997, 22096, 19462, 27972, 19702, 27960,
  /* 13185 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13200 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13215 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13230 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13245 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13260 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13275 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13290 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13305 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22321, 18871, 32154, 32182, 32202, 30842, 33268, 29083,
  /* 13320 */ 22078, 18506, 18506, 18506, 18508, 27218, 27218, 27218, 27218, 22112, 24400, 24400, 24400, 24400, 23601,
  /* 13335 */ 18506, 18506, 18506, 18506, 18506, 25810, 27218, 27218, 27218, 27218, 35026, 32226, 24400, 24400, 24400,
  /* 13350 */ 24400, 24033, 31675, 18506, 18506, 18506, 18506, 18508, 27218, 27218, 27218, 27218, 27218, 32249, 24400,
  /* 13365 */ 24400, 24400, 24400, 24400, 19671, 18506, 18506, 18506, 18506, 23068, 27218, 27218, 27218, 27218, 30780,
  /* 13380 */ 24009, 24400, 24400, 24400, 24400, 26774, 18506, 18506, 18506, 27883, 27218, 27218, 27218, 17614, 24014,
  /* 13395 */ 24400, 24400, 24400, 18505, 18506, 18506, 27218, 27218, 27219, 24013, 24401, 19911, 25693, 33873, 18507,
  /* 13410 */ 36073, 27218, 19762, 35305, 19911, 31007, 18508, 27218, 31818, 19449, 19490, 23068, 23312, 19871, 31006,
  /* 13425 */ 27884, 34267, 19883, 25810, 34264, 19880, 25809, 19803, 31004, 23498, 30997, 22096, 19462, 27972, 19702,
  /* 13440 */ 27960, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13455 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13470 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13485 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13500 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13515 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13530 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13545 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13560 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22785, 18871, 32285, 31629, 34620, 32301, 32317,
  /* 13575 */ 32367, 22078, 18506, 32383, 19378, 32401, 27218, 32429, 27114, 32450, 22112, 24400, 32501, 20076, 32522,
  /* 13590 */ 18901, 25412, 23750, 18506, 18506, 32578, 32641, 27218, 32669, 27218, 23680, 32689, 32705, 24400, 32740,
  /* 13605 */ 24400, 25904, 32761, 34722, 18506, 27397, 32799, 24593, 24854, 32833, 24889, 32854, 32880, 27218, 32915,
  /* 13620 */ 32950, 24400, 32973, 29333, 24400, 30814, 26230, 27694, 33891, 18506, 23068, 36368, 27218, 33009, 27218,
  /* 13635 */ 30780, 24009, 32103, 24400, 33029, 24400, 35869, 18506, 18506, 30378, 27981, 27218, 27218, 33770, 17614,
  /* 13650 */ 20136, 24400, 24400, 34592, 20782, 18506, 18506, 33047, 27218, 27219, 36175, 24401, 19911, 25693, 18506,
  /* 13665 */ 18507, 27218, 27218, 19762, 23886, 19911, 31007, 18508, 27218, 31818, 19449, 34570, 24166, 33066, 33096,
  /* 13680 */ 33130, 27884, 34267, 23859, 26576, 31712, 19880, 25809, 19803, 31004, 23498, 30997, 33151, 22139, 27972,
  /* 13695 */ 23479, 27960, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13710 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13725 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13740 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13755 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13770 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13785 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13800 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13815 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22800, 18871, 33178, 28122, 33213, 25341,
  /* 13830 */ 33248, 29192, 22078, 33291, 35449, 18506, 18508, 33318, 26415, 33355, 27218, 22112, 33372, 28081, 33420,
  /* 13845 */ 24400, 18901, 22245, 18506, 33437, 18506, 18506, 33458, 33476, 24827, 27218, 27218, 26643, 22164, 24774,
  /* 13860 */ 35206, 24400, 24400, 25941, 29627, 18506, 18506, 29306, 25202, 33498, 33517, 27218, 27218, 33534, 36292,
  /* 13875 */ 19527, 33570, 24400, 24400, 33589, 32506, 19671, 18506, 18506, 31251, 33626, 23068, 27218, 27218, 33647,
  /* 13890 */ 27218, 30780, 24009, 24400, 24400, 33686, 24400, 26878, 27508, 18506, 33722, 27883, 32899, 34655, 27218,
  /* 13905 */ 17614, 32052, 24781, 23804, 24400, 18505, 18506, 18506, 27218, 27218, 27219, 33743, 36113, 19911, 25693,
  /* 13920 */ 18506, 23350, 27218, 29166, 19762, 23886, 35373, 30344, 18508, 33764, 34691, 33786, 19490, 34066, 33840,
  /* 13935 */ 31847, 31006, 27884, 34267, 33864, 28929, 33924, 19880, 30485, 33989, 25401, 36049, 34016, 22096, 19462,
  /* 13950 */ 27972, 19702, 27960, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13965 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13980 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 13995 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14010 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14025 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14040 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14055 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14070 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22815, 18871, 34051, 32592, 34100,
  /* 14085 */ 34135, 34151, 34186, 34202, 32166, 36021, 31538, 31902, 34218, 34242, 34283, 29350, 34333, 34370, 34394,
  /* 14100 */ 34437, 26817, 18901, 26211, 29682, 25418, 18506, 35107, 25810, 34476, 34498, 34520, 25848, 35026, 22164,
  /* 14115 */ 34540, 34563, 34586, 19647, 24033, 36670, 35127, 24680, 18506, 32351, 34608, 31328, 34636, 34652, 27218,
  /* 14130 */ 34671, 34707, 28062, 34766, 34790, 24400, 33801, 19671, 34812, 32186, 34860, 24597, 33501, 26720, 34844,
  /* 14145 */ 34876, 35509, 29148, 36720, 33816, 35384, 32957, 34162, 26774, 34911, 18506, 18506, 34948, 34964, 27218,
  /* 14160 */ 33013, 17614, 29960, 34989, 24400, 36312, 25516, 30218, 35891, 35022, 35042, 26282, 20420, 31162, 35077,
  /* 14175 */ 35097, 35143, 24639, 28500, 27913, 19762, 35159, 35186, 26178, 28810, 35222, 35246, 33080, 35261, 23068,
  /* 14190 */ 23312, 29070, 31006, 27884, 34267, 19883, 25810, 34264, 24546, 25163, 35294, 31781, 35332, 33386, 22096,
  /* 14205 */ 19462, 27972, 24088, 28639, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14220 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14235 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14250 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14265 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14280 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14295 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14310 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14325 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22830, 18871, 22050, 34736,
  /* 14340 */ 34075, 35400, 20979, 35416, 35432, 35465, 18506, 18506, 23448, 35491, 27218, 27218, 27218, 35525, 31143,
  /* 14355 */ 24400, 24400, 24400, 35561, 18506, 26887, 35117, 35609, 24871, 25810, 30413, 23518, 26040, 35655, 35674,
  /* 14370 */ 22164, 19565, 19607, 30606, 35690, 27725, 35576, 29123, 18506, 18506, 18506, 18508, 27218, 35710, 27218,
  /* 14385 */ 27218, 27218, 35731, 24400, 36596, 24400, 24400, 24400, 19671, 30231, 18506, 18506, 18506, 23068, 35747,
  /* 14400 */ 27218, 27218, 27218, 27553, 22920, 24400, 24400, 24400, 24400, 23895, 35764, 18506, 18506, 25024, 35786,
  /* 14415 */ 27218, 27218, 17614, 20055, 35803, 24400, 24400, 18505, 18506, 18506, 27218, 27218, 27219, 24013, 24401,
  /* 14430 */ 19911, 25693, 18506, 18507, 27218, 27218, 19762, 23886, 19911, 23914, 18508, 34504, 31818, 25387, 19490,
  /* 14445 */ 23068, 23312, 26442, 31006, 27884, 34267, 19883, 25810, 35820, 19880, 27194, 35849, 33108, 23498, 30997,
  /* 14460 */ 22096, 22228, 28721, 19702, 27960, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14475 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14490 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14505 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14520 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14535 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14550 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14565 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14580 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22845, 18871, 22050,
  /* 14595 */ 35885, 28732, 25341, 31153, 29192, 22078, 26782, 18506, 22574, 18508, 23986, 27218, 29859, 27218, 22112,
  /* 14610 */ 33748, 24400, 31410, 24400, 18901, 18506, 18506, 26896, 18506, 18506, 25810, 27218, 30756, 27218, 27218,
  /* 14625 */ 35026, 22164, 24400, 24907, 24400, 24400, 24033, 31675, 18506, 18506, 18506, 18506, 18508, 27218, 27218,
  /* 14640 */ 27218, 27218, 27218, 19527, 24400, 24400, 24400, 24400, 24400, 19671, 18506, 18506, 18506, 18506, 23068,
  /* 14655 */ 27218, 27218, 27218, 27218, 30780, 24009, 24400, 24400, 24400, 24400, 26774, 18506, 18506, 18506, 27883,
  /* 14670 */ 27218, 27218, 27218, 17614, 24014, 24400, 24400, 24400, 18505, 18506, 18506, 27218, 27218, 27219, 24013,
  /* 14685 */ 24401, 19911, 25693, 18506, 18507, 27218, 27218, 19762, 23886, 19911, 31007, 18508, 27218, 31818, 19449,
  /* 14700 */ 19490, 23068, 23312, 19871, 31006, 27884, 34267, 19883, 25810, 34264, 19880, 25809, 19803, 31004, 23498,
  /* 14715 */ 30997, 22096, 19462, 27972, 19702, 27960, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14730 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14745 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14760 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14775 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14790 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14805 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14820 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14835 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22860, 18871,
  /* 14850 */ 22050, 27865, 27885, 35907, 24400, 35923, 22078, 18506, 18506, 18506, 18508, 27218, 27218, 27218, 27218,
  /* 14865 */ 22112, 24400, 24400, 24400, 24400, 18901, 18506, 18506, 18506, 18506, 18506, 25810, 27218, 27218, 27218,
  /* 14880 */ 27218, 35026, 22164, 24400, 24400, 24400, 24400, 24033, 31591, 18506, 18506, 18506, 18506, 26247, 27218,
  /* 14895 */ 27218, 27218, 27218, 27218, 19527, 35939, 24400, 24400, 24400, 24400, 19671, 18506, 28145, 18506, 18506,
  /* 14910 */ 35957, 27218, 32838, 27218, 32673, 30780, 24009, 24400, 32233, 24400, 32078, 26774, 18506, 18506, 18506,
  /* 14925 */ 27883, 27218, 27218, 27218, 17614, 24014, 24400, 24400, 24400, 18505, 18506, 18506, 27218, 27218, 27219,
  /* 14940 */ 24013, 24401, 19911, 25693, 18506, 18507, 27218, 27218, 19762, 23886, 19911, 31007, 18508, 27218, 31818,
  /* 14955 */ 19449, 19490, 23068, 23312, 19871, 31006, 27884, 34267, 19883, 25810, 34264, 19880, 25809, 19803, 31004,
  /* 14970 */ 23498, 30997, 22096, 19462, 27972, 19702, 27960, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 14985 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15000 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15015 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15030 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15045 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15060 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15075 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15090 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 22875,
  /* 15105 */ 18871, 22050, 35982, 34836, 25341, 33947, 29192, 36004, 18506, 23293, 18506, 36037, 27218, 27218, 36072,
  /* 15120 */ 36089, 22112, 24400, 24400, 36112, 33937, 18901, 18506, 18506, 18506, 18506, 18506, 25810, 27218, 27218,
  /* 15135 */ 27218, 27218, 35026, 22164, 24400, 24400, 24400, 24400, 24033, 36129, 18506, 25593, 18506, 18506, 18508,
  /* 15150 */ 27218, 27218, 27340, 27218, 27218, 36162, 24400, 24400, 34378, 24400, 24400, 19671, 28259, 18506, 18506,
  /* 15165 */ 18506, 23068, 30915, 27218, 27218, 27218, 23702, 24009, 33824, 24400, 24400, 24400, 26774, 18506, 18506,
  /* 15180 */ 18506, 27883, 27218, 27218, 27218, 17614, 24014, 24400, 24400, 24400, 18505, 18506, 18506, 27218, 27218,
  /* 15195 */ 27219, 24013, 24401, 19911, 25693, 18506, 18507, 27218, 27218, 19762, 23886, 19911, 31007, 18508, 27218,
  /* 15210 */ 31818, 19449, 19490, 23068, 23312, 19871, 31006, 27884, 34267, 19883, 25810, 34264, 19880, 25809, 19803,
  /* 15225 */ 31004, 23498, 30997, 22096, 19462, 27972, 19702, 27960, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15240 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15255 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15270 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15285 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15300 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15315 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15330 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15345 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15360 */ 22321, 18871, 22050, 19397, 27885, 36198, 24400, 36214, 22078, 18506, 18506, 18506, 18061, 27218, 27218,
  /* 15375 */ 27218, 35501, 22112, 24400, 24400, 24400, 29387, 18901, 18506, 36230, 18506, 28804, 18506, 25810, 34888,
  /* 15390 */ 27218, 27436, 27218, 35026, 22164, 29396, 24400, 24498, 24400, 24033, 31675, 18506, 36252, 18506, 18506,
  /* 15405 */ 18508, 27218, 36096, 27218, 27218, 27218, 19527, 24400, 28045, 24400, 24400, 24400, 19671, 18506, 18506,
  /* 15420 */ 32138, 18506, 35770, 27218, 27218, 36285, 27218, 33547, 24009, 24400, 24400, 36308, 24400, 36328, 18506,
  /* 15435 */ 18506, 18506, 27883, 27218, 27218, 27218, 17614, 24014, 24400, 24400, 24400, 25746, 18506, 18506, 36361,
  /* 15450 */ 27218, 27219, 19227, 24401, 19911, 25693, 31979, 18507, 27218, 32478, 19762, 23886, 36384, 31007, 18508,
  /* 15465 */ 27218, 31818, 19449, 19490, 23068, 23312, 19871, 31006, 27884, 34267, 19883, 25810, 34264, 19880, 25809,
  /* 15480 */ 19803, 31004, 23498, 30997, 22096, 19462, 27972, 19702, 27960, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15495 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15510 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15525 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15540 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15555 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15570 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15585 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15600 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15615 */ 17614, 22366, 18871, 36404, 19051, 19276, 17768, 36449, 17173, 17619, 36452, 17330, 17349, 18964, 17189,
  /* 15630 */ 17208, 17281, 17756, 36468, 17308, 17327, 17346, 18961, 18484, 21871, 18684, 18700, 19049, 17265, 22024,
  /* 15645 */ 17726, 17421, 17447, 17192, 17763, 21717, 17311, 18693, 19042, 19051, 17471, 32925, 17521, 17544, 17251,
  /* 15660 */ 36426, 17836, 17699, 20346, 21147, 17567, 17583, 17609, 21878, 17528, 17551, 17258, 36433, 21906, 21931,
  /* 15675 */ 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742, 17784, 33554, 21937, 17641, 36488, 18277, 36546,
  /* 15690 */ 17501, 19195, 17914, 17946, 18380, 17807, 17886, 17614, 21611, 17505, 19199, 17918, 18766, 17972, 36566,
  /* 15705 */ 20653, 17988, 18033, 18762, 18716, 18437, 18656, 18093, 18110, 18126, 18171, 18197, 18741, 18106, 18263,
  /* 15720 */ 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861, 36418, 19275, 17850, 17163, 30666, 18424, 17870,
  /* 15735 */ 32934, 17669, 18840, 18453, 18469, 18554, 17393, 18782, 18540, 18570, 17614, 17614, 17614, 17614, 17614,
  /* 15750 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15765 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15780 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15795 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15810 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15825 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15840 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15855 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 15870 */ 17614, 17614, 22351, 18871, 19030, 19051, 19276, 17768, 19051, 21728, 30787, 36452, 17330, 17349, 18964,
  /* 15885 */ 17189, 17208, 17281, 17756, 18003, 17308, 17327, 17346, 18961, 18484, 21871, 18684, 18700, 19049, 17265,
  /* 15900 */ 22024, 17726, 17421, 17447, 17192, 20736, 21864, 17311, 18693, 19042, 19051, 17471, 32925, 17521, 17544,
  /* 15915 */ 17251, 36426, 17836, 17699, 20346, 21147, 17567, 17583, 17609, 21878, 17528, 17551, 17258, 36433, 21906,
  /* 15930 */ 21931, 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742, 17784, 33554, 21937, 17641, 36488, 18277,
  /* 15945 */ 36546, 17501, 19195, 17914, 17946, 18380, 17807, 17886, 17614, 21611, 17505, 19199, 17918, 18766, 17972,
  /* 15960 */ 36566, 20653, 17988, 18033, 18762, 18716, 18437, 18656, 18093, 18110, 18126, 18171, 18197, 18741, 18106,
  /* 15975 */ 18263, 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861, 36418, 19275, 17850, 17163, 30666, 18424,
  /* 15990 */ 17870, 32934, 17669, 18840, 18453, 18469, 18554, 17393, 18782, 18540, 18570, 17614, 17614, 17614, 17614,
  /* 16005 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16020 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16035 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16050 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16065 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16080 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16095 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16110 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16125 */ 17614, 17614, 17614, 21804, 18871, 36504, 19051, 19276, 17768, 19051, 17173, 17791, 36452, 17330, 17349,
  /* 16140 */ 18964, 17189, 17208, 17281, 17756, 17822, 17308, 17327, 17346, 18961, 18484, 21871, 18684, 18700, 19049,
  /* 16155 */ 17265, 22024, 17726, 17421, 17447, 17192, 17455, 22013, 17311, 18693, 19042, 19051, 17471, 32925, 17521,
  /* 16170 */ 17544, 17251, 36426, 17836, 17699, 20346, 21147, 17567, 17583, 17609, 21878, 17528, 17551, 17258, 36433,
  /* 16185 */ 21906, 21931, 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742, 17784, 33554, 21937, 17641, 36488,
  /* 16200 */ 18277, 36546, 17501, 19195, 17914, 17946, 18380, 17807, 17886, 17614, 21611, 17505, 19199, 17918, 18766,
  /* 16215 */ 17972, 36566, 20653, 17988, 18033, 18762, 18716, 18437, 18656, 18093, 18110, 18126, 18171, 18197, 18741,
  /* 16230 */ 18106, 18263, 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861, 36418, 19275, 17850, 17163, 30666,
  /* 16245 */ 18424, 17870, 32934, 17669, 18840, 18453, 18469, 18554, 17393, 18782, 18540, 18570, 17614, 17614, 17614,
  /* 16260 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16275 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16290 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16305 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16320 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16335 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16350 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16365 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16380 */ 17614, 17614, 17614, 17614, 21819, 18871, 19030, 19051, 19276, 17768, 19051, 17173, 30787, 36452, 17330,
  /* 16395 */ 17349, 18964, 17189, 17208, 17281, 17756, 36532, 17308, 17327, 17346, 18961, 18484, 21871, 18684, 18700,
  /* 16410 */ 19049, 17265, 22024, 17726, 17421, 17447, 17192, 20736, 21864, 17311, 18693, 19042, 19051, 17471, 32925,
  /* 16425 */ 17521, 17544, 17251, 36426, 17836, 17699, 20346, 21147, 17567, 17583, 17609, 21878, 17528, 17551, 17258,
  /* 16440 */ 36433, 21906, 21931, 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742, 17784, 33554, 21937, 17641,
  /* 16455 */ 36488, 18277, 36546, 17501, 19195, 17914, 17946, 18380, 17807, 17886, 17614, 21611, 17505, 19199, 17918,
  /* 16470 */ 18766, 17972, 36566, 20653, 17988, 18033, 18762, 18716, 18437, 18656, 18093, 18110, 18126, 18171, 18197,
  /* 16485 */ 18741, 18106, 18263, 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861, 36418, 19275, 17850, 17163,
  /* 16500 */ 30666, 18424, 17870, 32934, 17669, 18840, 18453, 18469, 18554, 17393, 18782, 18540, 18570, 17614, 17614,
  /* 16515 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16530 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16545 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16560 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16575 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16590 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16605 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16620 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16635 */ 17614, 17614, 17614, 17614, 17614, 21819, 18871, 19350, 18506, 27885, 30780, 24400, 29192, 28024, 18506,
  /* 16650 */ 18506, 18506, 18508, 27218, 27218, 27218, 27218, 36582, 24400, 24400, 24400, 24400, 22935, 18506, 18506,
  /* 16665 */ 18506, 18506, 18506, 25810, 27218, 27218, 27218, 27218, 28546, 36629, 24400, 24400, 24400, 24400, 24033,
  /* 16680 */ 18916, 18506, 18506, 18506, 18506, 18508, 27218, 27218, 27218, 27218, 27218, 19527, 24400, 24400, 24400,
  /* 16695 */ 24400, 24400, 19671, 18506, 18506, 18506, 18506, 23068, 27218, 27218, 27218, 27218, 30780, 24009, 24400,
  /* 16710 */ 24400, 24400, 24400, 26774, 18506, 18506, 18506, 27883, 27218, 27218, 27218, 17614, 24014, 24400, 24400,
  /* 16725 */ 24400, 18505, 18506, 18506, 27218, 27218, 27219, 24013, 24401, 19911, 25693, 18506, 18507, 27218, 27218,
  /* 16740 */ 19762, 23886, 19911, 31007, 18508, 27218, 31818, 19449, 19490, 23068, 23312, 19871, 31006, 27884, 34267,
  /* 16755 */ 19883, 25810, 34264, 19880, 25809, 19803, 31004, 23498, 30997, 22096, 19462, 27972, 19702, 27960, 17614,
  /* 16770 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16785 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16800 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16815 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16830 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16845 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16860 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16875 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 16890 */ 17614, 17614, 17614, 17614, 17614, 17614, 36655, 36693, 18755, 19051, 19276, 17768, 19051, 17478, 17619,
  /* 16905 */ 36452, 17330, 17349, 18964, 17189, 17208, 17281, 17756, 17223, 17308, 17327, 17346, 18961, 36757, 21871,
  /* 16920 */ 18684, 18700, 19049, 17265, 22024, 17726, 17421, 17447, 17192, 17763, 21717, 17311, 18693, 19042, 19051,
  /* 16935 */ 17471, 32925, 17521, 17544, 17251, 36426, 17836, 17699, 20346, 21147, 17567, 17583, 17609, 21878, 17528,
  /* 16950 */ 17551, 17258, 36433, 21906, 21931, 17635, 36482, 18271, 17657, 17685, 20514, 17715, 17742, 17784, 33554,
  /* 16965 */ 21937, 17641, 36488, 18277, 36546, 17501, 19195, 17914, 17946, 18380, 17807, 17886, 17614, 21611, 17505,
  /* 16980 */ 19199, 17918, 18766, 17972, 36566, 20653, 17988, 18033, 18762, 18716, 18437, 18656, 18093, 18110, 18126,
  /* 16995 */ 18171, 18197, 18741, 18106, 18263, 18304, 18293, 18320, 18017, 18350, 18366, 18408, 17861, 36418, 19275,
  /* 17010 */ 17850, 17163, 30666, 18424, 17870, 32934, 17669, 18840, 18453, 18469, 18554, 17393, 18782, 18540, 18570,
  /* 17025 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 17040 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 17055 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 17070 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 17085 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 17100 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 17115 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 17130 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614, 17614,
  /* 17145 */ 17614, 17614, 17614, 17614, 17614, 17614, 17614, 0, 94242, 0, 118820, 0, 2211840, 102439, 0, 0, 106538,
  /* 17162 */ 98347, 0, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2486272, 2158592,
  /* 17174 */ 2158592, 2158592, 2158592, 2158592, 2158592, 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27, 2207744, 2408448,
  /* 17191 */ 2416640, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 17202 */ 2207744, 2207744, 2207744, 2207744, 2207744, 3108864, 2609152, 2207744, 2207744, 2207744, 2207744,
  /* 17213 */ 2207744, 2207744, 2682880, 2207744, 2699264, 2207744, 2707456, 2207744, 2715648, 2756608, 2207744, 0, 0,
  /* 17226 */ 0, 0, 0, 0, 2166784, 0, 0, 0, 0, 0, 0, 2158592, 2158592, 3174400, 3178496, 2158592, 0, 139, 0, 2158592,
  /* 17246 */ 2158592, 2158592, 2158592, 2158592, 2428928, 2158592, 2158592, 2158592, 2752512, 2760704, 2781184,
  /* 17257 */ 2805760, 2158592, 2158592, 2158592, 2867200, 2895872, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 17268 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 3108864, 2158592, 2158592, 2158592, 2158592,
  /* 17279 */ 2158592, 2158592, 2207744, 2789376, 2207744, 2813952, 2207744, 2207744, 2846720, 2207744, 2207744,
  /* 17290 */ 2207744, 2904064, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 17301 */ 2207744, 2207744, 2207744, 0, 823, 0, 825, 2158592, 2408448, 2416640, 2158592, 2158592, 2158592, 2158592,
  /* 17315 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2568192, 2158592,
  /* 17326 */ 2158592, 2609152, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2682880, 2158592, 2699264,
  /* 17337 */ 2158592, 2707456, 2158592, 2715648, 2756608, 2158592, 2158592, 2789376, 2158592, 2158592, 2789376,
  /* 17348 */ 2158592, 2813952, 2158592, 2158592, 2846720, 2158592, 2158592, 2158592, 2904064, 2158592, 2158592,
  /* 17359 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 18, 0, 0, 0, 0, 0, 0, 0, 2211840, 0, 0,
  /* 17377 */ 641, 0, 2158592, 0, 0, 0, 0, 0, 0, 0, 0, 2211840, 0, 0, 32768, 0, 2158592, 0, 2158592, 2158592, 2158592,
  /* 17398 */ 2387968, 2158592, 2158592, 2158592, 2158592, 3010560, 2387968, 2207744, 2207744, 2207744, 2207744,
  /* 17409 */ 2158877, 2158877, 2158877, 2158877, 0, 0, 0, 2158877, 2576669, 2158877, 2158877, 0, 2207744, 2207744,
  /* 17423 */ 2600960, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2646016, 2207744, 2207744, 2207744,
  /* 17434 */ 2207744, 2207744, 2207744, 2207744, 0, 0, 0, 0, 0, 0, 2162968, 0, 0, 2207744, 2207744, 2207744, 2207744,
  /* 17451 */ 2785280, 2797568, 2207744, 2822144, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 17462 */ 2207744, 2207744, 2207744, 2207744, 2207744, 0, 541, 0, 543, 3108864, 2158592, 2158592, 2158592, 2158592,
  /* 17476 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 0, 0, 0, 2146304, 2146304,
  /* 17489 */ 2224128, 2224128, 2232320, 2232320, 2232320, 641, 0, 0, 0, 0, 0, 0, 2158592, 2158592, 2158592, 2158592,
  /* 17505 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2535424, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 17516 */ 2621440, 2158592, 2158592, 2158592, 2158592, 2445312, 2449408, 2158592, 2158592, 2158592, 2158592,
  /* 17527 */ 2158592, 2158592, 2506752, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 17538 */ 2584576, 2158592, 2158592, 2158592, 2158592, 2625536, 2158592, 2584576, 2158592, 2158592, 2158592,
  /* 17549 */ 2158592, 2625536, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2703360, 2158592, 2158592,
  /* 17560 */ 2158592, 2158592, 2158592, 2752512, 2760704, 2781184, 2805760, 2207744, 2867200, 2895872, 2207744,
  /* 17571 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 17582 */ 3022848, 2207744, 3047424, 2207744, 2207744, 2207744, 2207744, 3084288, 2207744, 2207744, 3117056,
  /* 17593 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 0, 0, 0, 172032, 0, 0, 2162688, 0, 0,
  /* 17609 */ 2207744, 2207744, 2207744, 3190784, 2207744, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2158592,
  /* 17631 */ 2158592, 2158592, 2408448, 2416640, 2158592, 2514944, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 17642 */ 2158592, 2158592, 2588672, 2158592, 2613248, 2158592, 2158592, 2633728, 2158592, 2158592, 2158592,
  /* 17653 */ 2691072, 2158592, 2719744, 2158592, 2158592, 3125248, 2158592, 2158592, 2158592, 3153920, 2158592,
  /* 17664 */ 2158592, 3174400, 3178496, 2158592, 2371584, 2207744, 2207744, 2207744, 2207744, 2158592, 2158592,
  /* 17675 */ 2158592, 2158592, 0, 0, 0, 2158592, 2576384, 2158592, 2158592, 0, 2207744, 2207744, 2207744, 2437120,
  /* 17689 */ 2207744, 2457600, 2465792, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2514944, 2207744,
  /* 17700 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2445312, 2449408, 2207744, 2207744, 2207744,
  /* 17711 */ 2207744, 2207744, 2207744, 2506752, 2719744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 17722 */ 2207744, 2871296, 2207744, 2908160, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 17733 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2568192, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 17744 */ 2207744, 2207744, 3018752, 2207744, 2207744, 3055616, 2207744, 2207744, 3104768, 2207744, 2207744,
  /* 17755 */ 3125248, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 3100672, 2207744, 2207744, 2207744,
  /* 17766 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 0, 0, 0, 0, 0, 0,
  /* 17781 */ 2162688, 0, 0, 2207744, 3153920, 2207744, 2207744, 3174400, 3178496, 2207744, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 17800 */ 0, 138, 2158592, 2158592, 2158592, 2408448, 2416640, 2711552, 2736128, 2207744, 2207744, 2207744, 2826240,
  /* 17813 */ 2830336, 2207744, 2899968, 2207744, 2207744, 2928640, 2207744, 2207744, 2977792, 2207744, 0, 0, 0, 0, 0,
  /* 17828 */ 0, 2166784, 0, 0, 0, 0, 0, 285, 2158592, 2158592, 3117056, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 17844 */ 2158592, 2158592, 2158592, 2158592, 3190784, 2158592, 2207744, 2207744, 2158592, 2158592, 2158592,
  /* 17855 */ 2158592, 2158592, 0, 0, 0, 2158592, 2158592, 2158592, 2158592, 0, 0, 2539520, 2547712, 2158592, 2158592,
  /* 17870 */ 2158592, 0, 0, 0, 2158592, 2158592, 2158592, 2994176, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 17883 */ 2158592, 2158592, 2576384, 2985984, 2207744, 2207744, 3006464, 2207744, 3051520, 3067904, 3080192,
  /* 17894 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 3207168, 2713056, 2736128, 2158592,
  /* 17905 */ 2158592, 2158592, 2826240, 2831844, 2158592, 2899968, 2158592, 2158592, 2928640, 2158592, 2158592,
  /* 17916 */ 2977792, 2158592, 2985984, 2158592, 2158592, 3006464, 2158592, 3051520, 3067904, 3080192, 2158592,
  /* 17927 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 3207168, 2985984, 2158592, 2158592, 3007972,
  /* 17938 */ 2158592, 3051520, 3067904, 3080192, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 17949 */ 3207168, 2207744, 2207744, 2207744, 2207744, 2207744, 2428928, 2207744, 2207744, 2207744, 2207744,
  /* 17960 */ 2207744, 2207744, 2207744, 0, 0, 0, 176406, 279, 0, 2162688, 0, 0, 2527232, 2531328, 2158592, 2158592,
  /* 17976 */ 2580480, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 17987 */ 2912256, 2531328, 2207744, 2207744, 2580480, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 17998 */ 2207744, 2207744, 2207744, 2207744, 2912256, 2207744, 0, 0, 0, 0, 0, 0, 2166784, 0, 0, 0, 0, 0, 286,
  /* 18017 */ 2158592, 2158592, 0, 0, 2158592, 2158592, 2158592, 2158592, 2637824, 2662400, 0, 0, 2744320, 2748416, 0,
  /* 18032 */ 2838528, 2207744, 2207744, 2981888, 2207744, 2207744, 2207744, 2207744, 3043328, 2207744, 2207744,
  /* 18043 */ 2207744, 2207744, 2207744, 2207744, 3162112, 0, 0, 29315, 0, 0, 0, 0, 45, 45, 45, 45, 45, 933, 45, 45, 45,
  /* 18064 */ 45, 442, 45, 45, 45, 45, 45, 45, 45, 45, 45, 67, 67, 2498560, 2158592, 2158592, 2158592, 2528853, 2531328,
  /* 18083 */ 2158592, 2158592, 2580480, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 1504, 2158592, 2502656,
  /* 18095 */ 2158592, 2158592, 2158592, 2158592, 2572288, 2158592, 2596864, 2629632, 2158592, 2158592, 2678784,
  /* 18106 */ 2740224, 2158592, 2158592, 0, 2158592, 2916352, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 18118 */ 2158592, 3112960, 2158592, 2158592, 3137536, 3149824, 3158016, 2379776, 2383872, 2207744, 2207744,
  /* 18129 */ 2424832, 2207744, 2453504, 2207744, 2207744, 2207744, 2502656, 2207744, 2207744, 2207744, 2207744,
  /* 18140 */ 2572288, 2207744, 0, 0, 0, 0, 0, 0, 2166784, 0, 0, 0, 0, 0, 551, 2158592, 2158592, 2158592, 2158592,
  /* 18159 */ 2207744, 2510848, 2207744, 2207744, 2207744, 2207744, 2207744, 2158592, 2510848, 0, 2020, 2158592,
  /* 18171 */ 2596864, 2629632, 2207744, 2207744, 2678784, 2740224, 2207744, 2207744, 2207744, 2916352, 2207744,
  /* 18182 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 0, 159744, 0, 0, 0, 0, 2162688, 0, 0, 2207744,
  /* 18198 */ 3112960, 2207744, 2207744, 3137536, 3149824, 3158016, 2379776, 2383872, 2158592, 2158592, 2424832,
  /* 18209 */ 2158592, 2453504, 2158592, 2158592, 2158592, 2158592, 2158592, 3190784, 2158592, 0, 641, 0, 0, 0, 0, 0, 0,
  /* 18226 */ 2371584, 2158592, 2502656, 2158592, 2158592, 1621, 2158592, 2158592, 2572288, 2158592, 2596864, 2629632,
  /* 18238 */ 2158592, 2158592, 2678784, 0, 0, 0, 0, 0, 1608, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1107, 97, 97,
  /* 18260 */ 1110, 97, 97, 3137536, 3149824, 3158016, 2158592, 2412544, 2420736, 2158592, 2469888, 2158592, 2158592,
  /* 18273 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 3018752, 2158592, 2158592, 3055616, 2158592,
  /* 18284 */ 2158592, 3104768, 2158592, 2158592, 3125248, 2158592, 2158592, 2158592, 3153920, 2420736, 2207744,
  /* 18295 */ 2469888, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2637824, 2662400,
  /* 18306 */ 2744320, 2748416, 2838528, 2953216, 2158592, 2990080, 2158592, 3002368, 2158592, 2158592, 2158592,
  /* 18317 */ 3133440, 2207744, 2412544, 2953216, 2207744, 2990080, 2207744, 3002368, 2207744, 2207744, 2207744,
  /* 18328 */ 3133440, 2158592, 2412544, 2420736, 2158592, 2469888, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 18339 */ 3190784, 2158592, 0, 32768, 0, 0, 0, 0, 0, 0, 2371584, 2953216, 2158592, 2990080, 2158592, 3002368,
  /* 18355 */ 2158592, 2158592, 2158592, 3133440, 2158592, 2158592, 2482176, 2158592, 2158592, 2158592, 2539520,
  /* 18366 */ 2547712, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 3121152,
  /* 18377 */ 2207744, 2207744, 2482176, 2207744, 2207744, 2207744, 2207744, 2207744, 2535424, 2207744, 2207744,
  /* 18388 */ 2207744, 2207744, 2207744, 2621440, 2207744, 2207744, 2207744, 2207744, 2158592, 2158592, 2158592,
  /* 18399 */ 2158592, 0, 0, 0, 2158592, 2576384, 2158592, 2158592, 1508, 2207744, 2539520, 2547712, 2207744, 2207744,
  /* 18413 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 3121152, 2158592, 2158592, 2482176,
  /* 18424 */ 2207744, 2207744, 2994176, 2207744, 2207744, 2158592, 2158592, 2486272, 2158592, 2158592, 0, 0, 0,
  /* 18437 */ 2158592, 2158592, 2158592, 0, 2158592, 2912256, 2158592, 2158592, 2158592, 2981888, 2158592, 2158592,
  /* 18449 */ 2158592, 2158592, 3043328, 2158592, 2158592, 3014656, 2207744, 2433024, 2207744, 2519040, 2207744,
  /* 18460 */ 2592768, 2207744, 2842624, 2207744, 2207744, 2207744, 3014656, 2158592, 2433024, 2158592, 2519040, 0, 0,
  /* 18473 */ 2158592, 2592768, 2158592, 0, 2842624, 2158592, 2158592, 2158592, 3014656, 2158592, 2510848, 2158592, 18,
  /* 18486 */ 0, 0, 0, 0, 0, 0, 0, 2211840, 0, 0, 0, 0, 2158592, 0, 0, 29315, 922, 0, 0, 0, 45, 45, 45, 45, 45, 45, 45,
  /* 18513 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 67, 67, 3010560, 2387968, 0, 2020, 2158592, 2158592, 2158592, 2158592,
  /* 18532 */ 3010560, 2158592, 2641920, 2957312, 2158592, 2207744, 2641920, 2957312, 2207744, 0, 0, 2158592, 2641920,
  /* 18545 */ 2957312, 2158592, 2543616, 2158592, 2543616, 2207744, 0, 0, 2543616, 2158592, 2158592, 2158592, 2158592,
  /* 18558 */ 2207744, 2510848, 2207744, 2207744, 2207744, 2207744, 2207744, 2158592, 2510848, 0, 0, 2158592, 2207744,
  /* 18571 */ 0, 2158592, 2158592, 2207744, 0, 2158592, 2158592, 2207744, 0, 2158592, 2969600, 2969600, 2969600, 0, 0,
  /* 18586 */ 0, 0, 0, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2478365, 2158877,
  /* 18599 */ 2158877, 0, 0, 2158877, 2158877, 2158877, 2158877, 2638109, 2662685, 0, 0, 2744605, 2748701, 0, 2838813,
  /* 18614 */ 40976, 18, 36884, 45078, 24, 28, 90143, 94242, 118820, 102439, 106538, 98347, 118820, 118820, 118820,
  /* 18629 */ 40976, 18, 18, 36884, 0, 0, 0, 24, 24, 24, 27, 27, 27, 27, 90143, 0, 0, 86016, 0, 0, 2211840, 102439, 0,
  /* 18652 */ 0, 0, 98347, 0, 2158592, 2158592, 2158592, 2158592, 2158592, 3162112, 0, 2379776, 2383872, 2158592,
  /* 18666 */ 2158592, 2424832, 2158592, 2453504, 2158592, 2158592, 0, 94242, 0, 0, 0, 2211840, 102439, 0, 0, 106538,
  /* 18682 */ 98347, 135, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2568192, 2158592, 2158592, 2158592,
  /* 18694 */ 2158592, 2158592, 2600960, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2646016, 2158592,
  /* 18705 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2785280, 2797568,
  /* 18716 */ 2498560, 2158592, 2158592, 2158592, 2527232, 2531328, 2158592, 2158592, 2580480, 2158592, 2158592,
  /* 18727 */ 2158592, 2158592, 2158592, 2158592, 0, 40976, 0, 18, 18, 24, 0, 27, 27, 0, 2158592, 2502656, 2158592,
  /* 18744 */ 2158592, 0, 2158592, 2158592, 2572288, 2158592, 2596864, 2629632, 2158592, 2158592, 2678784, 0, 0, 0, 0,
  /* 18759 */ 0, 2211840, 0, 0, 0, 0, 0, 0, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 18775 */ 2478080, 2158592, 2158592, 2498560, 2158592, 2158592, 2158592, 3010560, 2387968, 0, 0, 2158592, 2158592,
  /* 18788 */ 2158592, 2158592, 3010560, 2158592, 2641920, 2957312, 2158592, 2207744, 2641920, 2957312, 40976, 18,
  /* 18800 */ 36884, 45078, 24, 27, 147488, 94242, 147456, 147488, 106538, 98347, 0, 0, 147456, 40976, 18, 18, 36884, 0,
  /* 18818 */ 45078, 0, 24, 24, 24, 27, 27, 27, 27, 0, 81920, 0, 94242, 0, 0, 0, 2211840, 0, 0, 0, 106538, 98347, 0,
  /* 18841 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2433024, 2158592, 2519040, 2158592, 2592768,
  /* 18852 */ 2158592, 2842624, 2158592, 2158592, 40976, 18, 151573, 45078, 24, 27, 90143, 94242, 0, 102439, 106538,
  /* 18867 */ 98347, 0, 0, 0, 40976, 18, 18, 36884, 0, 45078, 0, 24, 24, 24, 27, 27, 27, 27, 90143, 0, 0, 1315, 0, 97,
  /* 18891 */ 97, 97, 97, 97, 97, 97, 97, 97, 97, 1487, 97, 18, 131427, 0, 0, 0, 0, 0, 0, 362, 0, 0, 365, 29315, 367, 0,
  /* 18917 */ 0, 29315, 0, 0, 0, 0, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1663, 45, 45, 45, 45, 45, 45, 45, 45, 45, 183,
  /* 18943 */ 45, 45, 45, 45, 201, 45, 130, 94242, 0, 0, 0, 2211840, 102439, 0, 0, 106538, 98347, 0, 2158592, 2158592,
  /* 18963 */ 2158592, 2158592, 2158592, 2158592, 3100672, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 18974 */ 2158592, 2158592, 2158592, 2158592, 2207744, 2207744, 2158592, 18, 0, 0, 0, 0, 0, 0, 0, 2211840, 0, 0, 0,
  /* 18993 */ 0, 2158592, 644, 2207744, 2207744, 2207744, 3190784, 2207744, 0, 1080, 0, 1084, 0, 1088, 0, 0, 0, 0, 0, 0,
  /* 19013 */ 0, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2535562, 2158730,
  /* 19025 */ 2158730, 2158730, 2158730, 2158730, 2621578, 0, 94242, 0, 0, 0, 2211840, 102439, 0, 0, 106538, 98347, 0,
  /* 19042 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2785280, 2797568, 2158592, 2822144, 2158592, 2158592,
  /* 19053 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 19064 */ 2158592, 2158592, 2158592, 40976, 18, 36884, 45078, 24, 27, 90143, 163875, 163840, 102439, 163875, 98347,
  /* 19079 */ 0, 0, 163840, 40976, 18, 18, 36884, 0, 45078, 0, 2224253, 176128, 2224253, 2232448, 2232448, 176128,
  /* 19095 */ 2232448, 90143, 0, 0, 2170880, 0, 0, 550, 829, 2158592, 2158592, 2158592, 2392064, 2158592, 2158592,
  /* 19110 */ 2158592, 2158592, 2158592, 2158592, 0, 40976, 0, 18, 18, 124, 124, 127, 127, 127, 40976, 18, 36884, 45078,
  /* 19128 */ 25, 29, 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 168027, 40976, 18, 18, 36884, 0, 45078, 253952, 24,
  /* 19147 */ 24, 24, 27, 27, 27, 27, 90143, 0, 0, 2170880, 0, 0, 827, 0, 2158592, 2158592, 2158592, 2392064, 2158592,
  /* 19166 */ 2158592, 2158592, 2158592, 2158592, 2158592, 0, 40976, 0, 4243810, 4243810, 24, 24, 27, 27, 27, 2207744,
  /* 19182 */ 0, 0, 0, 0, 0, 0, 2166784, 0, 0, 0, 0, 57344, 286, 2158592, 2158592, 2158592, 2158592, 2711552, 2736128,
  /* 19201 */ 2158592, 2158592, 2158592, 2826240, 2830336, 2158592, 2899968, 2158592, 2158592, 2928640, 2158592,
  /* 19212 */ 2158592, 2977792, 2158592, 2207744, 2207744, 2207744, 3190784, 2207744, 0, 0, 0, 0, 0, 0, 53248, 0, 0, 0,
  /* 19230 */ 0, 0, 97, 97, 97, 97, 97, 1613, 97, 97, 97, 97, 97, 97, 1495, 97, 97, 97, 97, 97, 97, 97, 97, 97, 566, 97,
  /* 19256 */ 97, 97, 97, 97, 97, 2207744, 0, 0, 0, 0, 0, 0, 2166784, 546, 0, 0, 0, 0, 286, 2158592, 2158592, 2158592,
  /* 19278 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 19289 */ 2207744, 2207744, 2207744, 17, 18, 36884, 45078, 24, 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0,
  /* 19306 */ 20480, 120, 121, 18, 18, 36884, 0, 45078, 0, 24, 24, 24, 27, 27, 27, 27, 90143, 0, 0, 2170880, 0, 53248,
  /* 19328 */ 550, 0, 2158592, 2158592, 2158592, 2392064, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 0,
  /* 19341 */ 40976, 200704, 18, 270336, 24, 24, 27, 27, 27, 0, 94242, 0, 0, 0, 38, 102439, 0, 0, 106538, 98347, 0, 45,
  /* 19363 */ 45, 45, 45, 45, 45, 45, 1535, 45, 45, 45, 45, 45, 45, 45, 1416, 45, 45, 45, 45, 45, 45, 45, 45, 424, 45,
  /* 19388 */ 45, 45, 45, 45, 45, 45, 45, 45, 405, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 199, 45, 45, 67,
  /* 19414 */ 67, 67, 67, 67, 491, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1766, 67, 67, 67, 1767, 67, 24850, 24850,
  /* 19438 */ 12564, 12564, 0, 0, 2166784, 546, 0, 53531, 53531, 0, 286, 97, 97, 0, 0, 97, 97, 97, 97, 97, 97, 0, 0, 97,
  /* 19462 */ 97, 0, 97, 97, 97, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 67, 67, 67, 67, 743, 57889, 0, 2170880, 0,
  /* 19487 */ 0, 550, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 45, 45, 45, 45, 45, 45, 45, 45, 1856, 45, 1858, 1859, 67,
  /* 19512 */ 67, 67, 1009, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1021, 67, 67, 67, 67, 67, 25398, 0, 13112, 0,
  /* 19536 */ 54074, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2371869, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2703645,
  /* 19554 */ 2158877, 2158877, 2158877, 2158877, 2158877, 2752797, 2760989, 2781469, 2806045, 97, 1115, 97, 97, 97, 97,
  /* 19569 */ 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 857, 97, 67, 67, 67, 67, 67, 1258, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 19595 */ 67, 67, 67, 1826, 67, 97, 97, 97, 97, 97, 97, 1338, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 19620 */ 870, 97, 97, 67, 67, 67, 1463, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1579, 67, 67, 97, 97,
  /* 19645 */ 97, 1518, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 904, 905, 97, 97, 97, 97, 1620, 97, 97, 97,
  /* 19670 */ 97, 97, 97, 97, 97, 97, 97, 97, 0, 921, 0, 0, 0, 0, 0, 0, 45, 1679, 67, 67, 67, 1682, 67, 67, 67, 67, 67,
  /* 19697 */ 67, 67, 67, 67, 1690, 67, 0, 0, 97, 97, 97, 97, 45, 45, 67, 67, 0, 0, 97, 97, 45, 45, 45, 669, 45, 45, 45,
  /* 19724 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 189, 45, 45, 45, 1748, 45, 45, 45, 1749, 1750, 45, 45, 45, 45, 45, 45,
  /* 19749 */ 45, 45, 67, 67, 67, 67, 1959, 67, 67, 67, 67, 1768, 67, 67, 67, 67, 67, 67, 67, 67, 97, 97, 97, 97, 97,
  /* 19774 */ 97, 97, 97, 97, 1791, 97, 97, 97, 97, 97, 97, 97, 97, 45, 45, 45, 45, 45, 45, 1802, 67, 1817, 67, 67, 67,
  /* 19799 */ 67, 67, 67, 1823, 67, 67, 67, 67, 97, 97, 97, 97, 0, 0, 0, 97, 97, 97, 97, 0, 97, 97, 97, 97, 1848, 45,
  /* 19825 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 659, 45, 45, 45, 45, 45, 45, 45, 1863, 67, 67, 67, 67, 67, 67, 67,
  /* 19851 */ 67, 67, 67, 67, 67, 495, 67, 67, 67, 67, 67, 1878, 97, 97, 97, 97, 0, 0, 0, 97, 97, 97, 97, 0, 0, 97, 97,
  /* 19878 */ 97, 97, 97, 0, 0, 0, 97, 97, 97, 97, 97, 97, 45, 45, 45, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 97, 97,
  /* 19905 */ 97, 97, 0, 0, 0, 1973, 97, 97, 97, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1165, 97, 1167,
  /* 19931 */ 0, 94242, 0, 0, 0, 2211840, 102439, 0, 0, 106538, 98347, 136, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 19948 */ 3162112, 233472, 2379776, 2383872, 2158592, 2158592, 2424832, 2158592, 2453504, 2158592, 2158592, 67,
  /* 19960 */ 24850, 24850, 12564, 12564, 0, 0, 280, 547, 0, 53531, 53531, 0, 286, 97, 97, 0, 0, 97, 97, 97, 97, 97, 97,
  /* 19983 */ 0, 0, 97, 97, 1789, 97, 57889, 547, 547, 0, 0, 550, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 45, 45, 45,
  /* 20008 */ 1799, 45, 45, 45, 67, 67, 67, 67, 67, 25398, 0, 13112, 0, 54074, 0, 0, 1092, 0, 0, 0, 0, 0, 97, 97, 97,
  /* 20033 */ 97, 1612, 97, 97, 97, 97, 1616, 97, 1297, 1472, 0, 0, 0, 0, 1303, 1474, 0, 0, 0, 0, 1309, 1476, 0, 0, 0,
  /* 20058 */ 0, 97, 97, 97, 1481, 97, 97, 97, 97, 97, 97, 1488, 97, 0, 1474, 0, 1476, 0, 97, 97, 97, 97, 97, 97, 97,
  /* 20083 */ 97, 97, 97, 97, 607, 97, 97, 97, 97, 40976, 18, 36884, 45078, 26, 30, 90143, 94242, 0, 102439, 106538,
  /* 20103 */ 98347, 0, 0, 217176, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0,
  /* 20121 */ 143448, 40976, 18, 18, 36884, 0, 45078, 0, 24, 24, 24, 27, 27, 27, 27, 0, 0, 0, 0, 97, 97, 97, 97, 1482,
  /* 20145 */ 97, 1483, 97, 97, 97, 97, 97, 97, 1326, 97, 97, 1329, 1330, 97, 97, 97, 97, 97, 97, 1159, 1160, 97, 97,
  /* 20168 */ 97, 97, 97, 97, 97, 97, 590, 97, 97, 97, 97, 97, 97, 97, 0, 94242, 0, 0, 0, 2211974, 102439, 0, 0, 106538,
  /* 20192 */ 98347, 0, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2478218, 2158730,
  /* 20204 */ 2158730, 2498698, 2158730, 2158730, 2158730, 2814090, 2158730, 2158730, 2846858, 2158730, 2158730,
  /* 20215 */ 2158730, 2904202, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 3018890,
  /* 20226 */ 2158730, 2158730, 3055754, 2158730, 2158730, 3104906, 2158730, 2158730, 2158730, 2158730, 3100810,
  /* 20237 */ 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2207744,
  /* 20248 */ 2207744, 2207744, 2207744, 2207744, 2576384, 2207744, 2207744, 2207744, 2207744, 541, 541, 543, 543, 0, 0,
  /* 20263 */ 2166784, 0, 548, 549, 549, 0, 286, 2158877, 2158877, 2158877, 2867485, 2896157, 2158877, 2158877, 2158877,
  /* 20278 */ 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 3191069, 2158877, 0, 0, 0, 0, 0,
  /* 20293 */ 0, 0, 0, 2371722, 2158877, 2408733, 2416925, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877,
  /* 20306 */ 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2568477,
  /* 20317 */ 2158877, 2158877, 2609437, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2683165, 2158877,
  /* 20328 */ 2699549, 2158877, 2707741, 2158877, 2715933, 2756893, 2158877, 0, 2158877, 2158877, 2158877, 2388106,
  /* 20340 */ 2158730, 2158730, 2158730, 2158730, 3010698, 2387968, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 20351 */ 2207744, 2207744, 2207744, 2584576, 2207744, 2207744, 2207744, 2207744, 2625536, 2207744, 2207744,
  /* 20362 */ 2158877, 2789661, 2158877, 2814237, 2158877, 2158877, 2847005, 2158877, 2158877, 2158877, 2904349,
  /* 20373 */ 2158877, 2158877, 2158877, 2158877, 2158877, 2535709, 2158877, 2158877, 2158877, 2158877, 2158877,
  /* 20384 */ 2621725, 2158877, 2158877, 2158877, 2158877, 2158730, 2822282, 2158730, 2158730, 2158730, 2158730,
  /* 20395 */ 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730,
  /* 20406 */ 2158730, 3109149, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877,
  /* 20417 */ 2158877, 2158877, 2158877, 0, 0, 0, 0, 0, 97, 97, 97, 1611, 97, 97, 97, 97, 97, 97, 97, 1496, 97, 97,
  /* 20439 */ 1499, 97, 97, 97, 97, 97, 2445450, 2449546, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2506890,
  /* 20454 */ 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2437258, 2158730, 2457738, 2465930,
  /* 20465 */ 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2584714, 2158730, 2158730, 2158730, 2158730,
  /* 20476 */ 2625674, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2703498, 2158730, 2158730, 2158730,
  /* 20487 */ 2158730, 2683018, 2158730, 2699402, 2158730, 2707594, 2158730, 2715786, 2756746, 2158730, 2158730,
  /* 20498 */ 2789514, 2158730, 2158730, 2158730, 3117194, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730,
  /* 20509 */ 2158730, 2158730, 2158730, 3190922, 2158730, 2207744, 2207744, 2207744, 2207744, 2207744, 2588672,
  /* 20520 */ 2207744, 2613248, 2207744, 2207744, 2633728, 2207744, 2207744, 2207744, 2691072, 2207744, 2158877,
  /* 20531 */ 2507037, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2584861, 2158877,
  /* 20542 */ 2158877, 2158877, 2158877, 2625821, 2158877, 3023133, 2158877, 3047709, 2158877, 2158877, 2158877,
  /* 20553 */ 2158877, 3084573, 2158877, 2158877, 3117341, 2158877, 2158877, 2158877, 2158877, 0, 2158877, 2912541,
  /* 20565 */ 2158877, 2158877, 2158877, 2982173, 2158877, 2158877, 2158877, 2158877, 3043613, 2158877, 2158730,
  /* 20576 */ 2515082, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2588810, 2158730, 2613386,
  /* 20587 */ 2158730, 2158730, 2633866, 2158730, 2158730, 2158730, 2392202, 2158730, 2158730, 2158730, 2158730,
  /* 20598 */ 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2609290, 2158730,
  /* 20609 */ 2158730, 2158730, 2158730, 2691210, 2158730, 2719882, 2158730, 2158730, 2158730, 2158730, 2158730,
  /* 20620 */ 2158730, 2158730, 2871434, 2158730, 2908298, 2158730, 2158730, 2158730, 2646154, 2158730, 2158730,
  /* 20631 */ 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2785418, 2797706, 2158730,
  /* 20642 */ 3125386, 2158730, 2158730, 2158730, 3154058, 2158730, 2158730, 3174538, 3178634, 2158730, 2371584,
  /* 20653 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2478080, 2207744, 2207744,
  /* 20664 */ 2498560, 2207744, 2207744, 2207744, 2527232, 2158877, 2437405, 2158877, 2457885, 2466077, 2158877,
  /* 20675 */ 2158877, 2158877, 2158877, 2158877, 2158877, 2515229, 2158877, 2158877, 2158877, 2158877, 2588957,
  /* 20686 */ 2158877, 2613533, 2158877, 2158877, 2634013, 2158877, 2158877, 2158877, 2691357, 2158877, 2720029,
  /* 20697 */ 2158877, 2158730, 2158730, 2977930, 2158730, 2986122, 2158730, 2158730, 3006602, 2158730, 3051658,
  /* 20708 */ 3068042, 3080330, 2158730, 2158730, 2158730, 2158730, 2207744, 2510848, 2207744, 2207744, 2207744,
  /* 20719 */ 2207744, 2207744, 2158877, 2511133, 0, 0, 2158877, 2158730, 2158730, 2158730, 3207306, 2207744, 2207744,
  /* 20732 */ 2207744, 2207744, 2207744, 2428928, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 20743 */ 2207744, 2207744, 2207744, 2207744, 2207744, 0, 542, 0, 544, 2711837, 2736413, 2158877, 2158877, 2158877,
  /* 20757 */ 2826525, 2830621, 2158877, 2900253, 2158877, 2158877, 2928925, 2158877, 2158877, 2978077, 2158877, 18, 0,
  /* 20770 */ 0, 0, 0, 0, 0, 0, 2211840, 0, 0, 642, 0, 2158592, 0, 45, 1529, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 20796 */ 45, 45, 1755, 45, 67, 67, 2986269, 2158877, 2158877, 3006749, 2158877, 3051805, 3068189, 3080477, 2158877,
  /* 20811 */ 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 3207453, 2527370, 2531466, 2158730, 2158730,
  /* 20822 */ 2580618, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730,
  /* 20833 */ 2912394, 2498845, 2158877, 2158877, 2158877, 2527517, 2531613, 2158877, 2158877, 2580765, 2158877,
  /* 20844 */ 2158877, 2158877, 2158877, 2158877, 2158877, 0, 40976, 0, 18, 18, 4321280, 2224253, 2232448, 4329472,
  /* 20858 */ 2232448, 2158730, 2502794, 2158730, 2158730, 2158730, 2158730, 2572426, 2158730, 2597002, 2629770,
  /* 20869 */ 2158730, 2158730, 2678922, 2740362, 2158730, 2158730, 2158730, 2207744, 2207744, 2207744, 2207744,
  /* 20880 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2158730,
  /* 20891 */ 2916490, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 3113098, 2158730, 2158730,
  /* 20902 */ 3137674, 3149962, 3158154, 2379776, 2207744, 3112960, 2207744, 2207744, 3137536, 3149824, 3158016,
  /* 20913 */ 2380061, 2384157, 2158877, 2158877, 2425117, 2158877, 2453789, 2158877, 2158877, 2158877, 3121437,
  /* 20924 */ 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730,
  /* 20935 */ 2158730, 3109002, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158877, 2502941, 2158877,
  /* 20946 */ 2158877, 0, 2158877, 2158877, 2572573, 2158877, 2597149, 2629917, 2158877, 2158877, 2679069, 0, 0, 0, 0,
  /* 20961 */ 97, 97, 1480, 97, 97, 97, 97, 97, 1485, 97, 97, 97, 0, 97, 97, 1729, 97, 1731, 97, 97, 97, 97, 97, 97, 97,
  /* 20986 */ 311, 97, 97, 97, 97, 97, 97, 97, 97, 1520, 97, 97, 1523, 97, 97, 1526, 97, 2740509, 2158877, 2158877, 0,
  /* 21007 */ 2158877, 2916637, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 3113245, 2158877,
  /* 21018 */ 2158877, 3019037, 2158877, 2158877, 3055901, 2158877, 2158877, 3105053, 2158877, 2158877, 3125533,
  /* 21029 */ 2158877, 2158877, 2158877, 3154205, 3137821, 3150109, 3158301, 2158730, 2412682, 2420874, 2158730,
  /* 21040 */ 2470026, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 3022986, 2158730,
  /* 21051 */ 3047562, 2158730, 2158730, 2158730, 2158730, 3084426, 2637962, 2662538, 2744458, 2748554, 2838666,
  /* 21062 */ 2953354, 2158730, 2990218, 2158730, 3002506, 2158730, 2158730, 2158730, 3133578, 2207744, 2412544,
  /* 21073 */ 2953216, 2207744, 2990080, 2207744, 3002368, 2207744, 2207744, 2207744, 3133440, 2158877, 2412829,
  /* 21084 */ 2421021, 2158877, 2470173, 2158877, 2158877, 3174685, 3178781, 2158877, 0, 0, 0, 2158730, 2158730,
  /* 21097 */ 2158730, 2158730, 2158730, 2429066, 2158730, 2158730, 2158730, 2158730, 2711690, 2736266, 2158730,
  /* 21108 */ 2158730, 2158730, 2826378, 2830474, 2158730, 2900106, 2158730, 2158730, 2928778, 2953501, 2158877,
  /* 21119 */ 2990365, 2158877, 3002653, 2158877, 2158877, 2158877, 3133725, 2158730, 2158730, 2482314, 2158730,
  /* 21130 */ 2158730, 2158730, 2539658, 2547850, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730,
  /* 21141 */ 2158730, 2158730, 3121290, 2207744, 2207744, 2482176, 2207744, 2207744, 2207744, 2207744, 2703360,
  /* 21152 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2752512, 2760704, 2781184, 2805760, 2207744, 2207744,
  /* 21163 */ 2158877, 2158877, 2158877, 2158877, 2158877, 0, 0, 0, 2158877, 2158877, 2158877, 2158877, 0, 0, 2539805,
  /* 21178 */ 2547997, 2158877, 2158877, 2158877, 0, 0, 0, 2158877, 2158877, 2158877, 2994461, 2158877, 2158877,
  /* 21191 */ 2158730, 2158730, 2158730, 2158730, 2158730, 2576522, 2207744, 2539520, 2547712, 2207744, 2207744,
  /* 21202 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 3121152, 2158877, 2158877, 2482461, 0,
  /* 21214 */ 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158730, 2158730, 2486410, 2158730, 2158730,
  /* 21225 */ 2158730, 2158730, 2158730, 2158730, 2207744, 2207744, 2207744, 2392064, 2207744, 2207744, 2207744,
  /* 21236 */ 2207744, 2207744, 2207744, 2207744, 20480, 0, 0, 0, 0, 0, 2162688, 20480, 0, 2158730, 2158730, 2158730,
  /* 21252 */ 2994314, 2158730, 2158730, 2207744, 2207744, 2486272, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 21263 */ 2207744, 2207744, 0, 0, 0, 0, 0, 0, 2162688, 135, 0, 2207744, 2207744, 2994176, 2207744, 2207744, 2158877,
  /* 21280 */ 2158877, 2486557, 2158877, 2158877, 0, 0, 0, 2158877, 2158877, 2158877, 2158877, 2158877, 2158730,
  /* 21293 */ 2433162, 2158730, 2519178, 2158730, 2592906, 2158730, 2842762, 2158730, 2158730, 2158730, 3014794,
  /* 21304 */ 2207744, 2433024, 2207744, 2519040, 2207744, 2592768, 2207744, 2842624, 2207744, 2207744, 2207744,
  /* 21315 */ 3014656, 2158877, 2433309, 2158877, 2519325, 0, 0, 2158877, 2593053, 2158877, 0, 2842909, 2158877,
  /* 21328 */ 2158877, 2158877, 3014941, 2158730, 2510986, 2158730, 2158730, 2158730, 2752650, 2760842, 2781322,
  /* 21339 */ 2805898, 2158730, 2158730, 2158730, 2867338, 2896010, 2158730, 2158730, 2158730, 2158730, 2158730,
  /* 21350 */ 2158730, 2568330, 2158730, 2158730, 2158730, 2158730, 2158730, 2601098, 2158730, 2158730, 2158730,
  /* 21361 */ 3010560, 2388253, 0, 0, 2158877, 2158877, 2158877, 2158877, 3010845, 2158730, 2642058, 2957450, 2158730,
  /* 21374 */ 2207744, 2641920, 2957312, 2207744, 0, 0, 2158877, 2642205, 2957597, 2158877, 2543754, 2158730, 2543616,
  /* 21387 */ 2207744, 0, 0, 2543901, 2158877, 2158730, 2158730, 2158730, 2982026, 2158730, 2158730, 2158730, 2158730,
  /* 21400 */ 3043466, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 3162250, 2207744, 0, 2158877, 2158730,
  /* 21412 */ 2207744, 0, 2158877, 2158730, 2207744, 0, 2158877, 2969738, 2969600, 2969885, 0, 0, 0, 0, 1315, 0, 0, 0,
  /* 21430 */ 0, 97, 97, 97, 97, 97, 97, 97, 1484, 97, 97, 97, 97, 2158592, 18, 0, 122880, 0, 0, 0, 77824, 0, 2211840,
  /* 21453 */ 0, 0, 0, 0, 2158592, 0, 356, 0, 0, 0, 0, 0, 0, 28809, 0, 139, 45, 45, 45, 45, 45, 45, 1751, 45, 45, 45,
  /* 21479 */ 45, 45, 45, 45, 67, 67, 1427, 67, 67, 67, 67, 67, 1432, 67, 67, 67, 3108864, 2158592, 2158592, 2158592,
  /* 21499 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 122880, 0, 0, 0, 0, 1315,
  /* 21514 */ 0, 0, 0, 0, 97, 97, 97, 97, 97, 97, 1322, 550, 0, 286, 0, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 21534 */ 2428928, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 0, 40976, 0, 18, 18, 24, 24, 4329472, 27,
  /* 21550 */ 27, 2207744, 2207744, 2981888, 2207744, 2207744, 2207744, 2207744, 3043328, 2207744, 2207744, 2207744,
  /* 21562 */ 2207744, 2207744, 2207744, 3162112, 542, 0, 0, 0, 542, 0, 544, 0, 0, 0, 544, 0, 550, 0, 0, 0, 0, 0, 97,
  /* 21585 */ 97, 1610, 97, 97, 97, 97, 97, 97, 97, 97, 898, 97, 97, 97, 97, 97, 97, 97, 0, 94242, 0, 0, 0, 2211840, 0,
  /* 21610 */ 0, 0, 0, 0, 0, 2158592, 2158592, 2158592, 2158592, 2158592, 2428928, 2158592, 2158592, 2158592, 2158592,
  /* 21625 */ 2158592, 2158592, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 241664, 102439, 106538, 98347, 0, 0,
  /* 21641 */ 20480, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 196608, 40976, 18,
  /* 21659 */ 36884, 45078, 24, 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 94, 40976, 18, 36884, 45078, 24, 27,
  /* 21678 */ 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 96, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 0,
  /* 21696 */ 102439, 106538, 98347, 0, 0, 12378, 40976, 18, 18, 36884, 0, 45078, 0, 24, 24, 24, 126, 126, 126, 126,
  /* 21716 */ 90143, 0, 0, 2170880, 0, 0, 0, 0, 2158592, 2158592, 2158592, 2392064, 2158592, 2158592, 2158592, 2158592,
  /* 21732 */ 2158592, 2158592, 20480, 40976, 0, 18, 18, 24, 24, 27, 27, 27, 40976, 18, 36884, 45078, 24, 27, 90143,
  /* 21751 */ 94242, 245760, 102439, 106538, 98347, 0, 0, 20568, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 0,
  /* 21768 */ 102439, 106538, 98347, 0, 0, 204893, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 0, 102439, 106538,
  /* 21785 */ 98347, 0, 0, 20480, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 0, 0, 0, 44, 0, 0, 20575, 40976, 18,
  /* 21806 */ 36884, 45078, 24, 27, 90143, 94242, 0, 41, 41, 41, 0, 0, 1130496, 40976, 18, 36884, 45078, 24, 27, 90143,
  /* 21826 */ 94242, 0, 102439, 106538, 98347, 0, 0, 0, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 0, 102439,
  /* 21844 */ 106538, 98347, 0, 0, 89, 40976, 18, 18, 36884, 0, 45078, 0, 24, 24, 24, 27, 131201, 27, 27, 90143, 0, 0,
  /* 21866 */ 2170880, 0, 0, 550, 0, 2158592, 2158592, 2158592, 2392064, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 21880 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2445312, 2449408, 2158592, 2158592,
  /* 21891 */ 2158592, 2158592, 2158592, 0, 94242, 0, 0, 212992, 2211840, 102439, 0, 0, 106538, 98347, 0, 2158592,
  /* 21907 */ 2158592, 2158592, 2158592, 2158592, 3190784, 2158592, 0, 0, 0, 0, 0, 0, 0, 0, 2371584, 32768, 0, 0, 0, 0,
  /* 21927 */ 0, 0, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2437120, 2158592,
  /* 21940 */ 2457600, 2465792, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2514944, 2158592, 2158592,
  /* 21951 */ 2158592, 2158592, 40976, 18, 36884, 249879, 24, 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 20480,
  /* 21968 */ 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 225280, 40976, 18, 36884,
  /* 21986 */ 45078, 24, 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 184320, 40976, 18, 18, 36884, 155648, 45078,
  /* 22004 */ 0, 24, 24, 221184, 27, 27, 27, 221184, 90143, 0, 0, 2170880, 0, 0, 828, 0, 2158592, 2158592, 2158592,
  /* 22023 */ 2392064, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2207744, 2207744, 2207744, 2392064,
  /* 22034 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 0, 0, 0, 0, 0, 0, 2162688, 237568, 0, 0,
  /* 22051 */ 94242, 0, 0, 0, 38, 102439, 0, 0, 106538, 98347, 28809, 45, 45, 45, 45, 45, 718, 45, 45, 45, 45, 45, 45,
  /* 22074 */ 45, 45, 45, 727, 131427, 0, 0, 0, 0, 362, 0, 365, 28809, 367, 139, 45, 45, 45, 45, 45, 45, 1808, 45, 45,
  /* 22098 */ 45, 45, 67, 67, 67, 67, 67, 67, 67, 97, 97, 0, 0, 97, 67, 24850, 24850, 12564, 12564, 0, 57889, 0, 0, 0,
  /* 22122 */ 53531, 53531, 367, 286, 97, 97, 0, 0, 97, 97, 97, 97, 97, 97, 0, 1788, 97, 97, 0, 97, 2024, 97, 45, 45,
  /* 22146 */ 45, 45, 45, 45, 67, 67, 67, 67, 67, 67, 67, 67, 235, 67, 67, 67, 67, 67, 57889, 0, 0, 54074, 54074, 550,
  /* 22170 */ 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 45, 1798, 45, 45, 1800, 45, 45, 0, 1472, 0, 0, 0, 0, 0, 1474, 0, 0,
  /* 22197 */ 0, 0, 0, 1476, 0, 0, 0, 0, 1315, 0, 0, 0, 0, 97, 97, 97, 97, 1320, 97, 97, 0, 0, 97, 97, 97, 97, 97, 97,
  /* 22225 */ 1787, 0, 97, 97, 0, 97, 97, 97, 45, 45, 45, 45, 2029, 45, 67, 67, 67, 67, 2033, 1527, 45, 45, 45, 45, 45,
  /* 22250 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 663, 67, 24850, 24850, 12564, 12564, 0, 57889, 281, 0, 0, 53531,
  /* 22272 */ 53531, 367, 286, 97, 97, 0, 0, 97, 97, 97, 97, 1786, 97, 0, 0, 97, 97, 0, 1790, 40976, 19, 36884, 45078,
  /* 22295 */ 24, 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 266240, 40976, 18, 36884, 45078, 24, 27, 90143,
  /* 22313 */ 94242, 38, 102439, 106538, 98347, 46, 67, 98, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38, 102439,
  /* 22331 */ 106538, 98347, 45, 67, 97, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0,
  /* 22350 */ 262144, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 1126519, 40976, 18,
  /* 22368 */ 36884, 45078, 24, 27, 90143, 94242, 0, 1118248, 1118248, 1118248, 0, 0, 1118208, 40976, 18, 36884, 45078,
  /* 22385 */ 24, 27, 90143, 94242, 37, 102439, 106538, 98347, 0, 0, 208896, 40976, 18, 36884, 45078, 24, 27, 90143,
  /* 22403 */ 94242, 0, 102439, 106538, 98347, 0, 0, 57436, 40976, 18, 36884, 45078, 24, 27, 33, 33, 0, 33, 33, 33, 0,
  /* 22424 */ 0, 0, 40976, 18, 18, 36884, 0, 45078, 0, 124, 124, 124, 127, 127, 127, 127, 90143, 0, 0, 2170880, 0, 0,
  /* 22446 */ 550, 0, 2158877, 2158877, 2158877, 2392349, 2158877, 2158877, 2158877, 2158877, 2158877, 2785565, 2797853,
  /* 22459 */ 2158877, 2822429, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2871581, 2158877,
  /* 22470 */ 2908445, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 3100957, 2158877, 2158877,
  /* 22481 */ 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2445597, 2449693, 2158877, 2158877,
  /* 22492 */ 2158877, 2158877, 2158877, 40976, 122, 123, 36884, 0, 45078, 0, 24, 24, 24, 27, 27, 27, 27, 90143, 0, 921,
  /* 22512 */ 29315, 0, 0, 0, 0, 45, 45, 45, 45, 45, 45, 45, 45, 936, 2158592, 4243810, 0, 0, 0, 0, 0, 0, 0, 2211840, 0,
  /* 22537 */ 0, 0, 0, 2158592, 0, 921, 29315, 0, 0, 0, 0, 45, 45, 45, 45, 45, 45, 45, 935, 45, 45, 45, 715, 45, 45, 45,
  /* 22563 */ 45, 45, 45, 45, 723, 45, 45, 45, 45, 45, 1182, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 430, 45, 45, 45,
  /* 22588 */ 45, 45, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38, 102439, 106538, 98347, 47, 68, 99, 40976, 18,
  /* 22607 */ 36884, 45078, 24, 27, 90143, 94242, 38, 102439, 106538, 98347, 48, 69, 100, 40976, 18, 36884, 45078, 24,
  /* 22625 */ 27, 90143, 94242, 38, 102439, 106538, 98347, 49, 70, 101, 40976, 18, 36884, 45078, 24, 27, 90143, 94242,
  /* 22643 */ 38, 102439, 106538, 98347, 50, 71, 102, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38, 102439, 106538,
  /* 22661 */ 98347, 51, 72, 103, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38, 102439, 106538, 98347, 52, 73, 104,
  /* 22680 */ 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38, 102439, 106538, 98347, 53, 74, 105, 40976, 18, 36884,
  /* 22698 */ 45078, 24, 27, 90143, 94242, 38, 102439, 106538, 98347, 54, 75, 106, 40976, 18, 36884, 45078, 24, 27,
  /* 22716 */ 90143, 94242, 38, 102439, 106538, 98347, 55, 76, 107, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38,
  /* 22734 */ 102439, 106538, 98347, 56, 77, 108, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38, 102439, 106538,
  /* 22751 */ 98347, 57, 78, 109, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38, 102439, 106538, 98347, 58, 79, 110,
  /* 22770 */ 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38, 102439, 106538, 98347, 59, 80, 111, 40976, 18, 36884,
  /* 22788 */ 45078, 24, 27, 90143, 94242, 38, 102439, 106538, 98347, 60, 81, 112, 40976, 18, 36884, 45078, 24, 27,
  /* 22806 */ 90143, 94242, 38, 102439, 106538, 98347, 61, 82, 113, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38,
  /* 22824 */ 102439, 106538, 98347, 62, 83, 114, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38, 102439, 106538,
  /* 22841 */ 98347, 63, 84, 115, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38, 102439, 106538, 98347, 64, 85, 116,
  /* 22860 */ 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38, 102439, 106538, 98347, 65, 86, 117, 40976, 18, 36884,
  /* 22878 */ 45078, 24, 27, 90143, 94242, 38, 102439, 106538, 98347, 66, 87, 118, 40976, 18, 36884, 45078, 24, 27,
  /* 22896 */ 90143, 94242, 118820, 102439, 106538, 98347, 118820, 118820, 118820, 40976, 18, 18, 0, 0, 45078, 0, 24,
  /* 22913 */ 24, 24, 27, 27, 27, 27, 90143, 0, 0, 1314, 0, 0, 0, 0, 0, 0, 97, 97, 97, 97, 97, 1321, 97, 18, 131427, 0,
  /* 22939 */ 0, 0, 0, 0, 0, 362, 0, 0, 365, 0, 367, 0, 0, 1315, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 22967 */ 1360, 97, 97, 131, 94242, 0, 0, 0, 38, 102439, 0, 0, 106538, 98347, 28809, 45, 45, 45, 145, 149, 45, 45,
  /* 22989 */ 45, 45, 45, 174, 45, 179, 45, 185, 45, 188, 45, 45, 202, 67, 255, 67, 67, 269, 67, 67, 0, 24850, 12564, 0,
  /* 23013 */ 0, 0, 0, 28809, 53531, 97, 97, 97, 292, 296, 97, 97, 97, 97, 97, 321, 97, 326, 97, 332, 97, 18, 131427, 0,
  /* 23037 */ 0, 0, 0, 0, 0, 362, 0, 0, 365, 29315, 367, 646, 335, 97, 97, 349, 97, 97, 0, 40976, 0, 18, 18, 24, 24, 27,
  /* 23063 */ 27, 27, 437, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 67, 67, 67, 523, 67,
  /* 23089 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 511, 67, 67, 67, 97, 97, 97, 620, 97, 97, 97, 97, 97, 97, 97,
  /* 23115 */ 97, 97, 97, 97, 97, 97, 1501, 1502, 97, 793, 67, 67, 796, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 808, 67,
  /* 23140 */ 0, 0, 97, 97, 97, 97, 45, 45, 67, 67, 0, 0, 97, 97, 2052, 67, 67, 67, 67, 813, 67, 67, 67, 67, 67, 67, 67,
  /* 23167 */ 25398, 542, 13112, 544, 57889, 0, 0, 54074, 54074, 550, 830, 97, 97, 97, 97, 97, 97, 97, 97, 97, 315, 97,
  /* 23189 */ 97, 97, 97, 97, 97, 841, 97, 97, 97, 97, 97, 97, 97, 97, 97, 854, 97, 97, 97, 97, 97, 97, 589, 97, 97, 97,
  /* 23215 */ 97, 97, 97, 97, 97, 97, 867, 97, 97, 97, 97, 97, 97, 97, 891, 97, 97, 894, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 23241 */ 97, 97, 906, 45, 937, 45, 45, 940, 45, 45, 45, 45, 45, 45, 948, 45, 45, 45, 45, 45, 734, 735, 67, 737, 67,
  /* 23266 */ 738, 67, 740, 67, 67, 67, 45, 967, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 435, 45, 45,
  /* 23291 */ 45, 980, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 415, 45, 45, 67, 67, 1024, 67, 67, 67, 67,
  /* 23316 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 97, 97, 97, 67, 67, 67, 67, 67, 25398, 1081, 13112, 1085, 54074, 1089,
  /* 23339 */ 0, 0, 0, 0, 0, 0, 363, 0, 28809, 0, 139, 45, 45, 45, 45, 45, 45, 1674, 45, 45, 45, 45, 45, 45, 45, 45, 67,
  /* 23366 */ 1913, 67, 1914, 67, 67, 67, 1918, 67, 67, 97, 97, 97, 97, 1118, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 23390 */ 97, 630, 97, 97, 97, 97, 97, 1169, 97, 97, 97, 97, 97, 0, 921, 0, 1175, 0, 0, 0, 0, 45, 45, 45, 45, 45,
  /* 23416 */ 45, 1534, 45, 45, 45, 45, 45, 1538, 45, 45, 45, 45, 1233, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 67,
  /* 23441 */ 67, 67, 742, 67, 45, 45, 1191, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 454, 67, 67, 67, 67,
  /* 23466 */ 1243, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1251, 67, 0, 0, 97, 97, 97, 97, 45, 45, 67, 67, 2050, 0,
  /* 23492 */ 97, 97, 45, 45, 45, 732, 45, 45, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 97, 97, 67, 67, 67, 1284,
  /* 23518 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 772, 67, 67, 67, 1293, 67, 67, 67, 67, 67, 67, 0, 0, 0, 0,
  /* 23545 */ 0, 0, 0, 0, 0, 0, 368, 2158592, 2158592, 2158592, 2408448, 2416640, 1323, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 23566 */ 97, 97, 97, 1331, 97, 97, 97, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1737, 97, 1364, 97, 97, 97,
  /* 23591 */ 97, 97, 97, 97, 97, 97, 97, 97, 97, 1373, 97, 18, 131427, 0, 0, 0, 0, 0, 0, 362, 0, 0, 365, 29315, 367,
  /* 23616 */ 647, 45, 45, 1387, 45, 45, 1391, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 410, 45, 45, 45, 45, 45, 1400,
  /* 23640 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1407, 45, 45, 45, 45, 45, 941, 45, 943, 45, 45, 45, 45, 45, 45,
  /* 23665 */ 951, 45, 67, 1438, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1447, 67, 67, 67, 67, 67, 67, 799, 67, 67, 67,
  /* 23690 */ 804, 67, 67, 67, 67, 67, 67, 67, 1443, 67, 67, 1446, 67, 67, 67, 67, 67, 67, 67, 1298, 0, 0, 0, 1304, 0,
  /* 23715 */ 0, 0, 1310, 97, 1491, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1500, 97, 97, 97, 0, 97, 97, 97, 97, 97, 97,
  /* 23741 */ 97, 97, 97, 97, 1736, 97, 45, 45, 1541, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 677, 45, 45,
  /* 23766 */ 67, 1581, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 791, 792, 67, 67, 67, 67, 1598, 67,
  /* 23790 */ 1600, 67, 67, 67, 67, 67, 67, 67, 67, 1472, 97, 97, 97, 1727, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 23815 */ 97, 97, 1513, 97, 97, 67, 67, 97, 1879, 97, 1881, 97, 0, 1884, 0, 97, 97, 97, 97, 0, 0, 97, 97, 97, 97,
  /* 23840 */ 97, 0, 0, 0, 1842, 97, 97, 67, 67, 67, 67, 67, 97, 97, 97, 97, 1928, 0, 0, 0, 97, 97, 97, 97, 97, 97, 45,
  /* 23867 */ 45, 45, 45, 45, 1903, 45, 45, 45, 67, 67, 67, 67, 97, 97, 97, 97, 1971, 0, 0, 97, 97, 97, 97, 0, 97, 97,
  /* 23893 */ 97, 97, 97, 97, 97, 97, 97, 0, 0, 0, 45, 45, 45, 1381, 45, 45, 45, 45, 1976, 97, 97, 97, 97, 97, 45, 45,
  /* 23919 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1747, 809, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 25398, 542,
  /* 23944 */ 13112, 544, 97, 907, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 638, 0, 0, 0, 0, 1478, 97, 97, 97, 97,
  /* 23969 */ 97, 97, 97, 97, 97, 97, 97, 1150, 97, 97, 97, 97, 67, 67, 67, 67, 1244, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 23994 */ 67, 67, 67, 477, 67, 67, 67, 67, 67, 67, 1294, 67, 67, 67, 67, 0, 0, 0, 0, 0, 0, 0, 0, 0, 97, 97, 97, 97,
  /* 24022 */ 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1324, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 0, 0, 0,
  /* 24049 */ 1374, 97, 97, 97, 97, 0, 1175, 0, 45, 45, 45, 45, 45, 45, 45, 45, 945, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 24074 */ 1908, 45, 45, 1910, 45, 67, 67, 67, 67, 67, 67, 67, 67, 1919, 67, 0, 0, 97, 97, 97, 97, 45, 2048, 67,
  /* 24098 */ 2049, 0, 0, 97, 2051, 45, 45, 45, 939, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 397, 45, 45, 45,
  /* 24123 */ 1921, 67, 67, 1923, 67, 97, 97, 97, 97, 97, 0, 0, 0, 97, 97, 97, 97, 97, 97, 45, 45, 45, 45, 1947, 45,
  /* 24148 */ 1935, 0, 0, 0, 97, 1939, 97, 97, 1941, 97, 45, 45, 45, 45, 45, 45, 382, 389, 45, 45, 45, 45, 45, 45, 45,
  /* 24173 */ 45, 1810, 45, 45, 1812, 67, 67, 67, 67, 67, 256, 67, 67, 67, 67, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809,
  /* 24197 */ 53531, 336, 97, 97, 97, 97, 97, 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27, 131427, 0, 0, 0, 0, 362, 0, 365,
  /* 24222 */ 28809, 367, 139, 45, 45, 371, 373, 45, 45, 45, 955, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 413,
  /* 24246 */ 45, 45, 45, 457, 459, 67, 67, 67, 67, 67, 67, 67, 67, 473, 67, 478, 67, 67, 482, 67, 67, 485, 67, 67, 67,
  /* 24271 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 97, 1828, 97, 554, 556, 97, 97, 97, 97, 97, 97, 97, 97, 570, 97,
  /* 24296 */ 575, 97, 97, 579, 97, 97, 582, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 330, 97, 97, 67, 746,
  /* 24321 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 758, 67, 67, 67, 67, 67, 67, 67, 1587, 67, 1589, 67, 67, 67, 67, 67,
  /* 24346 */ 67, 67, 97, 1706, 97, 97, 97, 1709, 97, 97, 97, 97, 97, 844, 97, 97, 97, 97, 97, 97, 97, 97, 97, 856, 97,
  /* 24371 */ 97, 97, 0, 97, 97, 97, 97, 97, 97, 97, 97, 1735, 97, 97, 97, 0, 97, 97, 97, 97, 97, 97, 97, 1642, 97,
  /* 24396 */ 1644, 97, 97, 890, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 0, 67, 67, 67, 67,
  /* 24421 */ 1065, 1066, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 532, 67, 67, 67, 67, 67, 67, 67, 1451, 67, 67, 67, 67,
  /* 24446 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 496, 67, 67, 97, 97, 1505, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 24472 */ 97, 97, 593, 97, 97, 0, 1474, 0, 1476, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1617, 97, 97, 1635, 0,
  /* 24497 */ 1637, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 885, 97, 97, 97, 97, 67, 67, 1704, 67, 67, 67, 67, 97,
  /* 24522 */ 97, 97, 97, 97, 97, 97, 97, 97, 565, 572, 97, 97, 97, 97, 97, 97, 97, 97, 1832, 0, 97, 97, 97, 97, 97, 0,
  /* 24548 */ 0, 0, 97, 97, 97, 97, 97, 97, 45, 45, 45, 1946, 45, 45, 67, 67, 67, 67, 67, 97, 1926, 97, 1927, 97, 0, 0,
  /* 24574 */ 0, 97, 97, 1934, 2043, 0, 0, 97, 97, 97, 2047, 45, 45, 67, 67, 0, 1832, 97, 97, 45, 45, 45, 981, 45, 45,
  /* 24599 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1227, 45, 45, 45, 131427, 0, 0, 0, 0, 362, 0, 365, 28809, 367,
  /* 24623 */ 139, 45, 45, 372, 45, 45, 45, 45, 1661, 1662, 45, 45, 45, 45, 45, 1666, 45, 45, 45, 45, 45, 1673, 45,
  /* 24646 */ 1675, 45, 45, 45, 45, 45, 45, 45, 67, 1426, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1275, 67, 67, 67, 67,
  /* 24671 */ 67, 45, 418, 45, 45, 420, 45, 45, 423, 45, 45, 45, 45, 45, 45, 45, 45, 959, 45, 45, 962, 45, 45, 45, 45,
  /* 24696 */ 458, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 483, 67, 67, 67, 67, 504, 67, 67, 506, 67,
  /* 24721 */ 67, 509, 67, 67, 67, 67, 67, 67, 67, 753, 67, 67, 67, 67, 67, 67, 67, 67, 467, 67, 67, 67, 67, 67, 67, 67,
  /* 24747 */ 555, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 580, 97, 97, 97, 97, 601, 97, 97, 603, 97,
  /* 24772 */ 97, 606, 97, 97, 97, 97, 97, 97, 848, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1498, 97, 97, 97, 97, 97, 97,
  /* 24797 */ 45, 45, 714, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 989, 990, 45, 67, 67, 67, 67, 67, 1011,
  /* 24822 */ 67, 67, 67, 67, 1015, 67, 67, 67, 67, 67, 67, 67, 768, 67, 67, 67, 67, 67, 67, 67, 67, 769, 67, 67, 67,
  /* 24847 */ 67, 67, 67, 67, 45, 45, 1179, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1003, 1004, 67, 1217,
  /* 24871 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 728, 67, 1461, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 24897 */ 67, 67, 67, 67, 67, 67, 1034, 67, 97, 1516, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 871,
  /* 24922 */ 97, 67, 67, 67, 1705, 67, 67, 67, 97, 97, 97, 97, 97, 97, 97, 97, 97, 567, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 24948 */ 97, 97, 1715, 97, 97, 97, 97, 97, 97, 97, 97, 97, 0, 0, 0, 45, 45, 1380, 45, 45, 45, 45, 45, 67, 67, 97,
  /* 24974 */ 97, 97, 97, 97, 0, 0, 0, 97, 1887, 97, 97, 0, 0, 97, 97, 97, 0, 97, 97, 97, 97, 97, 2006, 45, 45, 1907,
  /* 25000 */ 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1920, 67, 97, 0, 2035, 97, 97, 97, 97, 97, 45, 45,
  /* 25026 */ 45, 45, 67, 67, 67, 1428, 67, 67, 67, 67, 67, 67, 1435, 67, 0, 94242, 0, 0, 0, 38, 102439, 0, 0, 106538,
  /* 25050 */ 98347, 28809, 45, 45, 45, 146, 45, 152, 45, 45, 165, 45, 175, 45, 180, 45, 45, 187, 190, 195, 45, 203,
  /* 25072 */ 254, 257, 262, 67, 270, 67, 67, 0, 24850, 12564, 0, 0, 0, 281, 28809, 53531, 97, 97, 97, 293, 97, 299, 97,
  /* 25095 */ 97, 312, 97, 322, 97, 327, 97, 97, 334, 337, 342, 97, 350, 97, 97, 0, 40976, 0, 18, 18, 24, 24, 27, 27,
  /* 25119 */ 27, 67, 484, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 499, 97, 581, 97, 97, 97, 97, 97, 97, 97,
  /* 25145 */ 97, 97, 97, 97, 97, 97, 596, 648, 45, 650, 45, 651, 45, 653, 45, 45, 45, 657, 45, 45, 45, 45, 45, 45,
  /* 25169 */ 1954, 67, 67, 67, 1958, 67, 67, 67, 67, 67, 67, 67, 783, 67, 67, 67, 788, 67, 67, 67, 67, 680, 45, 45, 45,
  /* 25194 */ 45, 45, 45, 45, 45, 688, 689, 691, 45, 45, 45, 45, 45, 983, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 947,
  /* 25219 */ 45, 45, 45, 45, 952, 45, 45, 698, 699, 45, 45, 702, 703, 45, 45, 45, 45, 45, 45, 45, 711, 744, 67, 67, 67,
  /* 25244 */ 67, 67, 67, 67, 67, 67, 757, 67, 67, 67, 67, 761, 67, 67, 67, 67, 765, 67, 767, 67, 67, 67, 67, 67, 67,
  /* 25269 */ 67, 67, 775, 776, 778, 67, 67, 67, 67, 67, 67, 785, 786, 67, 67, 789, 790, 67, 67, 67, 67, 67, 67, 1574,
  /* 25293 */ 67, 67, 67, 67, 67, 1578, 67, 67, 67, 67, 67, 67, 1012, 67, 67, 67, 67, 67, 67, 67, 67, 67, 468, 475, 67,
  /* 25318 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 798, 67, 67, 67, 802, 67, 67, 67, 67, 67, 67, 67, 67, 1588, 67, 67,
  /* 25343 */ 67, 67, 67, 67, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809, 53531, 67, 810, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 25367 */ 67, 821, 25398, 542, 13112, 544, 57889, 0, 0, 54074, 54074, 550, 0, 833, 97, 835, 97, 836, 97, 838, 97,
  /* 25388 */ 97, 0, 0, 97, 97, 97, 1785, 97, 97, 0, 0, 97, 97, 0, 97, 97, 1979, 97, 97, 45, 45, 1983, 45, 1984, 45, 45,
  /* 25414 */ 45, 45, 45, 652, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 690, 45, 45, 694, 45, 45, 97, 842, 97, 97, 97,
  /* 25439 */ 97, 97, 97, 97, 97, 97, 855, 97, 97, 97, 97, 0, 1717, 1718, 97, 97, 97, 97, 97, 1722, 97, 0, 0, 859, 97,
  /* 25464 */ 97, 97, 97, 863, 97, 865, 97, 97, 97, 97, 97, 97, 97, 97, 604, 97, 97, 97, 97, 97, 97, 97, 873, 874, 876,
  /* 25489 */ 97, 97, 97, 97, 97, 97, 883, 884, 97, 97, 887, 888, 97, 18, 131427, 0, 0, 0, 0, 0, 0, 362, 229376, 0, 365,
  /* 25514 */ 0, 367, 0, 45, 45, 45, 1531, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1199, 45, 45, 45, 45, 45, 97, 97,
  /* 25540 */ 908, 97, 97, 97, 97, 97, 97, 97, 97, 97, 919, 638, 0, 0, 0, 0, 2158877, 2158877, 2158877, 2158877,
  /* 25560 */ 2158877, 2429213, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2601245, 2158877, 2158877,
  /* 25571 */ 2158877, 2158877, 2158877, 2158877, 2646301, 2158877, 2158877, 2158877, 2158877, 2158877, 3162397, 0,
  /* 25583 */ 2379914, 2384010, 2158730, 2158730, 2424970, 2158730, 2453642, 2158730, 2158730, 953, 45, 45, 45, 45, 45,
  /* 25598 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 965, 978, 45, 45, 45, 45, 45, 45, 985, 45, 45, 45, 45, 45, 45, 45,
  /* 25624 */ 45, 971, 45, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 1027, 67, 1029, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 25649 */ 67, 1455, 67, 67, 67, 67, 67, 67, 67, 1077, 1078, 67, 67, 25398, 0, 13112, 0, 54074, 0, 0, 0, 0, 0, 0, 0,
  /* 25674 */ 0, 366, 0, 139, 2158730, 2158730, 2158730, 2408586, 2416778, 1113, 97, 97, 97, 97, 97, 97, 1121, 97, 1123,
  /* 25693 */ 97, 97, 97, 97, 97, 97, 0, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1540, 1155, 97, 97, 97,
  /* 25719 */ 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 615, 1168, 97, 97, 1171, 1172, 97, 97, 0, 921, 0, 1175, 0,
  /* 25744 */ 0, 0, 0, 45, 45, 45, 45, 45, 1533, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1559, 1561, 45, 45, 45, 1564, 45,
  /* 25769 */ 1566, 1567, 45, 45, 45, 1219, 45, 45, 45, 45, 45, 45, 45, 1226, 45, 45, 45, 45, 45, 168, 45, 45, 45, 45,
  /* 25793 */ 45, 45, 45, 45, 45, 45, 427, 45, 45, 45, 45, 45, 45, 45, 1231, 45, 45, 45, 45, 45, 45, 45, 45, 67, 67, 67,
  /* 25819 */ 67, 67, 67, 67, 67, 67, 67, 67, 1242, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1046, 67,
  /* 25844 */ 67, 1254, 67, 1256, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 806, 807, 67, 67, 97, 1336, 97, 97,
  /* 25868 */ 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1111, 97, 97, 97, 97, 97, 1351, 97, 97, 97, 1354, 97, 97,
  /* 25893 */ 97, 1359, 97, 97, 97, 0, 97, 97, 97, 97, 1640, 97, 97, 97, 97, 97, 97, 97, 897, 97, 97, 97, 902, 97, 97,
  /* 25918 */ 97, 97, 97, 97, 97, 97, 1366, 97, 97, 97, 97, 97, 97, 97, 1371, 97, 97, 97, 0, 97, 97, 97, 1730, 97, 97,
  /* 25943 */ 97, 97, 97, 97, 97, 97, 915, 97, 97, 97, 97, 0, 360, 0, 67, 67, 67, 1440, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 25969 */ 67, 67, 67, 67, 1017, 67, 1019, 67, 67, 67, 67, 67, 1453, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1459,
  /* 25993 */ 97, 97, 97, 1493, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1525, 97, 97, 97, 97, 97, 97, 1507,
  /* 26018 */ 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1514, 67, 67, 67, 67, 1584, 67, 67, 67, 67, 67, 1590, 67, 67, 67,
  /* 26043 */ 67, 67, 67, 67, 784, 67, 67, 67, 67, 67, 67, 67, 67, 1055, 67, 67, 67, 67, 1060, 67, 67, 67, 67, 67, 67,
  /* 26068 */ 67, 1599, 1601, 67, 67, 67, 1604, 67, 1606, 1607, 67, 1472, 0, 1474, 0, 1476, 0, 97, 97, 97, 97, 97, 97,
  /* 26091 */ 1614, 97, 97, 97, 97, 45, 45, 1850, 45, 45, 45, 45, 1855, 45, 45, 45, 45, 45, 1222, 45, 45, 45, 45, 45,
  /* 26115 */ 45, 45, 45, 45, 1229, 97, 1618, 97, 97, 97, 97, 97, 97, 97, 1625, 97, 97, 97, 97, 97, 0, 1175, 0, 45, 45,
  /* 26140 */ 45, 45, 45, 45, 45, 45, 447, 45, 45, 45, 45, 45, 67, 67, 1633, 97, 97, 0, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 26166 */ 1643, 1645, 97, 97, 0, 0, 97, 97, 97, 2002, 97, 97, 97, 97, 97, 45, 45, 45, 45, 45, 1740, 45, 45, 45,
  /* 26190 */ 1744, 45, 45, 45, 97, 1648, 97, 1650, 1651, 97, 0, 45, 45, 45, 1654, 45, 45, 45, 45, 45, 169, 45, 45, 45,
  /* 26214 */ 45, 45, 45, 45, 45, 45, 45, 658, 45, 45, 45, 45, 664, 45, 45, 1659, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 26239 */ 45, 45, 45, 45, 1187, 45, 45, 1669, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 67, 1005, 67,
  /* 26264 */ 67, 1681, 67, 67, 67, 67, 67, 67, 67, 1686, 67, 67, 67, 67, 67, 67, 67, 800, 67, 67, 67, 67, 67, 67, 67,
  /* 26289 */ 67, 67, 1603, 67, 67, 67, 67, 67, 0, 97, 97, 1713, 97, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 0, 0, 0,
  /* 26315 */ 1378, 45, 45, 45, 45, 45, 45, 45, 408, 45, 45, 45, 45, 45, 45, 45, 45, 1547, 45, 1549, 45, 45, 45, 45, 45,
  /* 26340 */ 97, 97, 1780, 0, 97, 97, 97, 97, 97, 97, 0, 0, 97, 97, 0, 97, 97, 97, 45, 45, 2027, 2028, 45, 45, 67, 67,
  /* 26366 */ 2031, 2032, 67, 45, 45, 1804, 45, 45, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 67, 1917, 67, 67, 67,
  /* 26390 */ 67, 67, 67, 67, 1819, 67, 67, 67, 67, 67, 67, 67, 67, 97, 97, 97, 1708, 97, 97, 97, 97, 97, 45, 45, 1862,
  /* 26415 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 497, 67, 67, 67, 1877, 97, 97, 97, 97, 97, 0, 0, 0,
  /* 26441 */ 97, 97, 97, 97, 0, 0, 97, 97, 97, 97, 97, 1839, 0, 0, 97, 97, 97, 97, 1936, 0, 0, 97, 97, 97, 97, 97, 97,
  /* 26468 */ 1943, 1944, 1945, 45, 45, 45, 45, 670, 45, 45, 45, 45, 674, 45, 45, 45, 45, 678, 45, 1948, 45, 1950, 45,
  /* 26491 */ 45, 45, 45, 1955, 1956, 1957, 67, 67, 67, 1960, 67, 1962, 67, 67, 67, 67, 1967, 1968, 1969, 97, 0, 0, 0,
  /* 26514 */ 97, 97, 1974, 97, 0, 1936, 0, 97, 97, 97, 97, 97, 97, 45, 45, 45, 45, 45, 45, 45, 45, 1906, 0, 1977, 97,
  /* 26539 */ 97, 97, 97, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1746, 45, 45, 45, 45, 2011, 67, 67, 2013, 67, 67,
  /* 26564 */ 67, 2017, 97, 97, 0, 0, 2021, 97, 8192, 97, 97, 2025, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 1916,
  /* 26588 */ 67, 67, 67, 67, 0, 94242, 0, 0, 0, 38, 102439, 0, 0, 106538, 98347, 28809, 45, 45, 140, 45, 45, 45, 1180,
  /* 26611 */ 45, 45, 45, 45, 1184, 45, 45, 45, 45, 45, 45, 45, 387, 45, 392, 45, 45, 396, 45, 45, 399, 45, 45, 67, 207,
  /* 26636 */ 67, 67, 67, 67, 67, 67, 236, 67, 67, 67, 67, 67, 67, 67, 817, 67, 67, 67, 67, 25398, 542, 13112, 544, 97,
  /* 26660 */ 97, 287, 97, 97, 97, 97, 97, 97, 316, 97, 97, 97, 97, 97, 97, 0, 45, 45, 45, 45, 45, 45, 45, 1656, 1657,
  /* 26685 */ 45, 376, 45, 45, 45, 45, 45, 388, 45, 45, 45, 45, 45, 45, 45, 45, 1406, 45, 45, 45, 45, 45, 45, 45, 67,
  /* 26710 */ 67, 67, 67, 462, 67, 67, 67, 67, 67, 474, 67, 67, 67, 67, 67, 67, 67, 1245, 67, 67, 67, 67, 67, 67, 67,
  /* 26735 */ 67, 1013, 67, 67, 1016, 67, 67, 67, 67, 97, 97, 97, 97, 559, 97, 97, 97, 97, 97, 571, 97, 97, 97, 97, 97,
  /* 26760 */ 97, 896, 97, 97, 97, 900, 97, 97, 97, 97, 97, 97, 912, 914, 97, 97, 97, 97, 97, 0, 0, 0, 45, 45, 45, 45,
  /* 26786 */ 45, 45, 45, 45, 391, 45, 45, 45, 45, 45, 45, 45, 45, 713, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 26812 */ 45, 45, 662, 45, 1140, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 636, 67, 67, 1283, 67,
  /* 26837 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 513, 67, 67, 1363, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 26863 */ 97, 97, 97, 97, 97, 889, 97, 97, 97, 1714, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 0, 0, 926, 45, 45, 45,
  /* 26889 */ 45, 45, 45, 45, 45, 672, 45, 45, 45, 45, 45, 45, 45, 45, 686, 45, 45, 45, 45, 45, 45, 45, 45, 944, 45, 45,
  /* 26915 */ 45, 45, 45, 45, 45, 45, 1676, 45, 45, 45, 45, 45, 45, 67, 97, 97, 97, 1833, 0, 97, 97, 97, 97, 97, 0, 0,
  /* 26941 */ 0, 97, 97, 97, 97, 97, 97, 45, 45, 45, 45, 1902, 45, 45, 45, 45, 45, 957, 45, 45, 45, 45, 961, 45, 963,
  /* 26966 */ 45, 45, 45, 67, 97, 2034, 0, 97, 97, 97, 97, 97, 2040, 45, 45, 45, 2042, 67, 67, 67, 67, 67, 67, 1586, 67,
  /* 26991 */ 67, 67, 67, 67, 67, 67, 67, 67, 469, 67, 67, 67, 67, 67, 67, 132, 94242, 0, 0, 0, 38, 102439, 0, 0,
  /* 27015 */ 106538, 98347, 28809, 45, 45, 45, 45, 45, 1414, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 428, 45, 45, 45,
  /* 27038 */ 45, 45, 57889, 0, 0, 54074, 54074, 550, 831, 97, 97, 97, 97, 97, 97, 97, 97, 97, 568, 97, 97, 97, 97, 578,
  /* 27062 */ 97, 45, 45, 968, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1228, 45, 45, 67, 67, 67, 67, 67,
  /* 27087 */ 25398, 1082, 13112, 1086, 54074, 1090, 0, 0, 0, 0, 0, 0, 364, 0, 0, 0, 139, 2158592, 2158592, 2158592,
  /* 27107 */ 2408448, 2416640, 67, 67, 67, 67, 1464, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 510, 67, 67, 67, 67,
  /* 27130 */ 97, 97, 97, 97, 1519, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 918, 97, 0, 0, 0, 0, 1528, 45, 45, 45,
  /* 27156 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 976, 45, 1554, 45, 45, 45, 45, 45, 45, 45, 45, 1562, 45, 45,
  /* 27181 */ 1565, 45, 45, 45, 45, 683, 45, 45, 45, 687, 45, 45, 692, 45, 45, 45, 45, 45, 1953, 45, 67, 67, 67, 67, 67,
  /* 27206 */ 67, 67, 67, 67, 1014, 67, 67, 67, 67, 67, 67, 1568, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 27231 */ 67, 67, 67, 0, 67, 67, 67, 67, 67, 1585, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1594, 97, 97, 1649, 97, 97,
  /* 27256 */ 97, 0, 45, 45, 1653, 45, 45, 45, 45, 45, 45, 383, 45, 45, 45, 45, 45, 45, 45, 45, 45, 986, 45, 45, 45, 45,
  /* 27282 */ 45, 45, 45, 45, 1670, 45, 1672, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 67, 736, 67, 67, 67, 67, 67, 741,
  /* 27307 */ 67, 67, 67, 1680, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1074, 67, 67, 67, 1692, 67, 67,
  /* 27332 */ 67, 67, 67, 67, 67, 1697, 67, 1699, 67, 67, 67, 67, 67, 67, 1041, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 27356 */ 1044, 67, 67, 67, 67, 67, 67, 67, 1769, 67, 67, 67, 67, 67, 67, 67, 97, 97, 97, 97, 97, 97, 97, 624, 97,
  /* 27381 */ 97, 97, 97, 97, 97, 634, 97, 97, 1792, 97, 97, 97, 97, 97, 97, 97, 45, 45, 45, 45, 45, 45, 45, 958, 45,
  /* 27406 */ 45, 45, 45, 45, 45, 964, 45, 150, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 977, 204,
  /* 27431 */ 45, 67, 67, 67, 217, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 787, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 27457 */ 271, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809, 53531, 97, 97, 97, 97, 297, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 27481 */ 97, 97, 97, 1108, 97, 97, 97, 97, 97, 97, 97, 97, 351, 97, 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27, 45,
  /* 27506 */ 45, 938, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1398, 45, 45, 45, 153, 45, 161, 45, 45, 45,
  /* 27531 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 660, 661, 45, 45, 205, 45, 67, 67, 67, 67, 220, 67, 228, 67, 67, 67,
  /* 27556 */ 67, 67, 67, 67, 0, 0, 0, 1302, 0, 0, 0, 1308, 0, 67, 67, 67, 67, 67, 272, 67, 0, 24850, 12564, 0, 0, 0, 0,
  /* 27583 */ 28809, 53531, 97, 97, 97, 97, 352, 97, 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27, 45, 439, 45, 45, 45, 45,
  /* 27607 */ 45, 445, 45, 45, 45, 452, 45, 45, 67, 67, 212, 216, 67, 67, 67, 67, 67, 241, 67, 246, 67, 252, 67, 67,
  /* 27631 */ 486, 67, 67, 67, 67, 67, 67, 67, 494, 67, 67, 67, 67, 67, 67, 67, 1272, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 27656 */ 507, 67, 67, 67, 67, 67, 67, 67, 67, 521, 67, 67, 525, 67, 67, 67, 67, 67, 531, 67, 67, 67, 538, 67, 0, 0,
  /* 27682 */ 2046, 97, 97, 97, 45, 45, 67, 67, 0, 0, 97, 97, 45, 45, 45, 1192, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 27708 */ 45, 45, 1418, 45, 45, 1421, 97, 97, 583, 97, 97, 97, 97, 97, 97, 97, 591, 97, 97, 97, 97, 97, 97, 913, 97,
  /* 27733 */ 97, 97, 97, 97, 97, 0, 0, 0, 45, 45, 45, 45, 45, 45, 45, 1384, 97, 618, 97, 97, 622, 97, 97, 97, 97, 97,
  /* 27759 */ 628, 97, 97, 97, 635, 97, 18, 131427, 0, 0, 0, 639, 0, 132, 362, 0, 0, 365, 29315, 367, 0, 921, 29315, 0,
  /* 27783 */ 0, 0, 0, 45, 45, 45, 45, 932, 45, 45, 45, 45, 45, 1544, 45, 45, 45, 45, 45, 1550, 45, 45, 45, 45, 45,
  /* 27808 */ 1194, 45, 1196, 45, 45, 45, 45, 45, 45, 45, 45, 999, 45, 45, 45, 45, 45, 67, 67, 45, 45, 667, 45, 45, 45,
  /* 27833 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1408, 45, 45, 45, 696, 45, 45, 45, 701, 45, 45, 45, 45, 45, 45,
  /* 27858 */ 45, 45, 710, 45, 45, 45, 1220, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 194, 45, 45, 45, 729, 45,
  /* 27883 */ 45, 45, 45, 45, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 797, 67, 67, 67,
  /* 27909 */ 67, 67, 67, 805, 67, 67, 67, 67, 67, 67, 67, 1695, 67, 67, 67, 67, 67, 1700, 67, 1702, 67, 67, 67, 67, 67,
  /* 27934 */ 814, 816, 67, 67, 67, 67, 67, 25398, 542, 13112, 544, 67, 67, 1008, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 27957 */ 67, 67, 1020, 67, 0, 97, 45, 67, 0, 97, 45, 67, 0, 97, 45, 67, 97, 0, 0, 97, 97, 97, 97, 97, 45, 45, 45,
  /* 27984 */ 45, 67, 67, 67, 67, 1429, 67, 1430, 67, 67, 67, 67, 67, 1062, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 28009 */ 67, 67, 67, 67, 518, 1076, 67, 67, 67, 67, 25398, 0, 13112, 0, 54074, 0, 0, 0, 0, 0, 0, 0, 0, 28809, 0,
  /* 28034 */ 139, 45, 45, 45, 45, 45, 97, 97, 97, 97, 1102, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1124, 97, 1126,
  /* 28059 */ 97, 97, 1114, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1112, 97, 97, 1156, 97, 97, 97,
  /* 28084 */ 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 594, 97, 97, 97, 97, 1170, 97, 97, 97, 97, 0, 921, 0, 0, 0, 0, 0,
  /* 28111 */ 0, 45, 45, 45, 45, 1532, 45, 45, 45, 45, 1536, 45, 45, 45, 45, 45, 172, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 28136 */ 45, 45, 706, 45, 45, 709, 45, 45, 1177, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1202,
  /* 28161 */ 45, 1204, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1215, 45, 45, 45, 1232, 45, 45, 45, 45, 45, 45,
  /* 28186 */ 45, 67, 1237, 67, 67, 67, 67, 67, 67, 1259, 67, 67, 67, 67, 67, 67, 1264, 67, 67, 67, 1282, 67, 67, 67,
  /* 28210 */ 67, 67, 67, 67, 67, 67, 1289, 67, 67, 67, 1292, 97, 97, 97, 97, 1339, 97, 97, 97, 97, 97, 97, 1344, 97,
  /* 28234 */ 97, 97, 97, 45, 1849, 45, 1851, 45, 45, 45, 45, 45, 45, 45, 45, 721, 45, 45, 45, 45, 45, 726, 45, 1385,
  /* 28258 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1188, 45, 45, 1401, 1402, 45, 45, 45, 45,
  /* 28282 */ 1405, 45, 45, 45, 45, 45, 45, 45, 45, 1752, 45, 45, 45, 45, 45, 67, 67, 1410, 45, 45, 45, 1413, 45, 1415,
  /* 28306 */ 45, 45, 45, 45, 45, 45, 1419, 45, 45, 45, 45, 1806, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 67, 67,
  /* 28331 */ 97, 97, 2019, 0, 97, 67, 67, 67, 1452, 67, 67, 67, 67, 67, 67, 67, 67, 1457, 67, 67, 67, 67, 67, 67, 1271,
  /* 28356 */ 67, 67, 67, 1274, 67, 67, 67, 1279, 67, 1460, 67, 1462, 67, 67, 67, 67, 67, 67, 1466, 67, 67, 67, 67, 67,
  /* 28380 */ 67, 67, 67, 1602, 67, 67, 1605, 67, 67, 67, 0, 97, 97, 97, 1506, 97, 97, 97, 97, 97, 97, 97, 97, 1512, 97,
  /* 28405 */ 97, 97, 0, 1728, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 901, 97, 97, 97, 97, 1515, 97, 1517, 97, 97,
  /* 28430 */ 97, 97, 97, 97, 1521, 97, 97, 97, 97, 97, 97, 0, 45, 1652, 45, 45, 45, 1655, 45, 45, 45, 45, 45, 1542, 45,
  /* 28455 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1552, 1553, 45, 45, 45, 1556, 45, 45, 45, 45, 45, 45, 45,
  /* 28480 */ 45, 45, 45, 45, 45, 45, 693, 45, 45, 45, 67, 67, 67, 67, 1572, 67, 67, 67, 67, 1576, 67, 67, 67, 67, 67,
  /* 28505 */ 67, 67, 67, 1685, 67, 67, 67, 67, 67, 67, 67, 67, 1465, 67, 67, 1468, 67, 67, 1471, 67, 67, 1582, 67, 67,
  /* 28529 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1580, 67, 67, 1596, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 28554 */ 67, 67, 67, 67, 0, 542, 0, 544, 67, 67, 67, 67, 1759, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 533, 67,
  /* 28580 */ 67, 67, 67, 67, 67, 67, 1770, 67, 67, 67, 67, 67, 97, 97, 97, 97, 97, 97, 1777, 97, 97, 97, 1793, 97, 97,
  /* 28605 */ 97, 97, 97, 45, 45, 45, 45, 45, 45, 45, 998, 45, 45, 1001, 1002, 45, 45, 67, 67, 45, 1861, 45, 67, 67, 67,
  /* 28630 */ 67, 67, 67, 67, 67, 1871, 67, 1873, 1874, 67, 0, 97, 45, 67, 0, 97, 45, 67, 16384, 97, 45, 67, 97, 0, 0,
  /* 28655 */ 0, 1473, 0, 1082, 0, 0, 0, 1475, 0, 1086, 0, 0, 0, 1477, 1876, 67, 97, 97, 97, 97, 97, 1883, 0, 1885, 97,
  /* 28680 */ 97, 97, 1889, 0, 0, 0, 286, 0, 0, 0, 286, 0, 2371584, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 28698 */ 2158592, 0, 40976, 0, 18, 18, 24, 24, 126, 126, 126, 2053, 0, 2055, 45, 67, 0, 97, 45, 67, 0, 97, 45, 67,
  /* 28722 */ 97, 0, 0, 97, 97, 97, 2039, 97, 45, 45, 45, 45, 67, 67, 67, 67, 67, 226, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 28748 */ 1246, 67, 67, 1249, 1250, 67, 67, 67, 132, 94242, 0, 0, 0, 38, 102439, 0, 0, 106538, 98347, 28809, 45, 45,
  /* 28770 */ 141, 45, 45, 45, 1403, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1186, 45, 45, 1189, 45, 45, 155,
  /* 28794 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 191, 45, 45, 45, 45, 700, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 28820 */ 1753, 45, 45, 45, 67, 67, 45, 45, 67, 208, 67, 67, 67, 222, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1764, 67,
  /* 28845 */ 67, 67, 67, 67, 67, 67, 258, 67, 67, 67, 67, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809, 53531, 97, 97, 288,
  /* 28869 */ 97, 97, 97, 302, 97, 97, 97, 97, 97, 97, 97, 97, 97, 627, 97, 97, 97, 97, 97, 97, 338, 97, 97, 97, 97, 97,
  /* 28895 */ 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27, 131427, 0, 0, 0, 0, 362, 0, 365, 28809, 367, 139, 45, 370, 45,
  /* 28919 */ 45, 45, 45, 716, 45, 45, 45, 45, 45, 722, 45, 45, 45, 45, 45, 45, 1912, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 28944 */ 67, 819, 67, 67, 25398, 542, 13112, 544, 45, 403, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 28968 */ 1409, 45, 67, 67, 67, 67, 489, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 771, 67, 67, 67, 67, 520, 67,
  /* 28993 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 534, 67, 67, 67, 67, 67, 67, 1286, 67, 67, 67, 67, 67, 67, 67,
  /* 29018 */ 1291, 67, 67, 24850, 24850, 12564, 12564, 0, 57889, 0, 0, 0, 53531, 53531, 367, 286, 97, 553, 97, 97, 97,
  /* 29039 */ 97, 586, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1138, 97, 97, 97, 97, 617, 97, 97, 97, 97, 97, 97,
  /* 29064 */ 97, 97, 97, 97, 97, 631, 97, 97, 97, 0, 1834, 97, 97, 97, 97, 97, 0, 0, 0, 97, 97, 97, 97, 97, 353, 0,
  /* 29090 */ 40976, 0, 18, 18, 24, 24, 27, 27, 27, 45, 45, 668, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 29115 */ 724, 45, 45, 45, 45, 45, 682, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 949, 45, 45, 45, 67, 67,
  /* 29141 */ 747, 748, 67, 67, 67, 67, 755, 67, 67, 67, 67, 67, 67, 67, 0, 0, 1301, 0, 0, 0, 1307, 0, 0, 67, 794, 67,
  /* 29167 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1701, 67, 97, 97, 97, 845, 846, 97, 97, 97, 97, 853,
  /* 29192 */ 97, 97, 97, 97, 97, 97, 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27, 97, 97, 892, 97, 97, 97, 97, 97, 97, 97,
  /* 29218 */ 97, 97, 97, 97, 97, 97, 610, 97, 97, 45, 992, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 67, 67, 67,
  /* 29244 */ 1239, 67, 67, 67, 1063, 67, 67, 67, 67, 67, 1068, 67, 67, 67, 67, 67, 67, 67, 0, 1299, 0, 0, 0, 1305, 0,
  /* 29269 */ 0, 0, 97, 1141, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1152, 97, 97, 0, 0, 97, 97, 1784, 97, 97, 97,
  /* 29295 */ 0, 0, 97, 97, 0, 97, 1978, 97, 97, 97, 1982, 45, 45, 45, 45, 45, 45, 45, 45, 45, 972, 973, 45, 45, 45, 45,
  /* 29321 */ 45, 97, 97, 97, 97, 1157, 97, 97, 97, 97, 97, 1162, 97, 97, 97, 97, 97, 97, 1145, 97, 97, 97, 97, 97,
  /* 29345 */ 1151, 97, 97, 97, 1253, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 539, 45, 1423, 45, 45,
  /* 29370 */ 67, 67, 67, 67, 67, 67, 67, 1431, 67, 67, 67, 67, 67, 67, 67, 1773, 67, 97, 97, 97, 97, 97, 97, 97, 625,
  /* 29395 */ 97, 97, 97, 97, 97, 97, 97, 97, 850, 97, 97, 97, 97, 97, 97, 97, 97, 880, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 29421 */ 1106, 97, 97, 97, 97, 97, 97, 97, 67, 67, 1439, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 514,
  /* 29446 */ 67, 67, 97, 97, 1492, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 611, 97, 97, 1703, 67, 67, 67,
  /* 29471 */ 67, 67, 67, 97, 97, 97, 97, 97, 97, 97, 97, 97, 852, 97, 97, 97, 97, 97, 97, 45, 1949, 45, 1951, 45, 45,
  /* 29496 */ 45, 67, 67, 67, 67, 67, 67, 67, 1961, 67, 0, 97, 45, 67, 0, 97, 2060, 2061, 0, 2062, 45, 67, 97, 0, 0,
  /* 29521 */ 2036, 97, 97, 97, 97, 45, 45, 45, 45, 67, 67, 67, 67, 67, 223, 67, 67, 237, 67, 67, 67, 67, 67, 67, 67,
  /* 29546 */ 1297, 0, 0, 0, 1303, 0, 0, 0, 1309, 1963, 67, 67, 67, 97, 97, 97, 97, 0, 1972, 0, 97, 97, 97, 1975, 0,
  /* 29571 */ 921, 29315, 0, 0, 0, 0, 45, 45, 45, 931, 45, 45, 45, 45, 45, 407, 45, 45, 45, 45, 45, 45, 45, 45, 45, 417,
  /* 29597 */ 45, 45, 1989, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1996, 97, 18, 131427, 0, 0, 360, 0, 0, 0, 362,
  /* 29622 */ 0, 0, 365, 29315, 367, 0, 921, 29315, 0, 0, 0, 0, 45, 45, 930, 45, 45, 45, 45, 45, 45, 444, 45, 45, 45,
  /* 29647 */ 45, 45, 45, 45, 67, 67, 97, 97, 1998, 0, 97, 97, 97, 0, 97, 97, 97, 97, 97, 45, 45, 45, 45, 45, 45, 1985,
  /* 29673 */ 45, 1986, 45, 45, 45, 156, 45, 45, 170, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 675, 45, 45, 45, 45, 679,
  /* 29698 */ 131427, 0, 358, 0, 0, 362, 0, 365, 28809, 367, 139, 45, 45, 45, 45, 45, 381, 45, 45, 45, 45, 45, 45, 45,
  /* 29722 */ 45, 45, 400, 45, 45, 419, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 436, 67, 67, 67, 67, 67, 505,
  /* 29747 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 820, 67, 25398, 542, 13112, 544, 67, 67, 522, 67, 67, 67, 67, 67,
  /* 29771 */ 529, 67, 67, 67, 67, 67, 67, 67, 0, 1300, 0, 0, 0, 1306, 0, 0, 0, 97, 97, 619, 97, 97, 97, 97, 97, 626,
  /* 29797 */ 97, 97, 97, 97, 97, 97, 97, 1105, 97, 97, 97, 97, 1109, 97, 97, 97, 67, 67, 67, 67, 749, 67, 67, 67, 67,
  /* 29822 */ 67, 67, 67, 67, 67, 760, 67, 0, 97, 45, 67, 2058, 97, 45, 67, 0, 97, 45, 67, 97, 0, 0, 97, 97, 97, 97, 97,
  /* 29849 */ 45, 45, 45, 2041, 67, 67, 67, 67, 67, 780, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 516, 67,
  /* 29874 */ 67, 97, 97, 97, 878, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1629, 97, 0, 45, 979, 45, 45, 45,
  /* 29900 */ 45, 984, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1000, 45, 45, 45, 45, 67, 67, 67, 1023, 67, 67, 67, 67, 1028,
  /* 29925 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 470, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 25398, 0, 13112, 0,
  /* 29950 */ 54074, 0, 0, 0, 1094, 0, 0, 0, 1092, 1315, 0, 0, 0, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1486, 97, 1489,
  /* 29976 */ 97, 97, 97, 1117, 97, 97, 97, 97, 1122, 97, 97, 97, 97, 97, 97, 97, 1146, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 30001 */ 881, 97, 97, 97, 886, 97, 97, 97, 1311, 0, 0, 0, 0, 0, 0, 0, 0, 97, 97, 97, 97, 97, 97, 97, 1615, 97, 97,
  /* 30028 */ 97, 97, 97, 1619, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1631, 97, 97, 1847, 97, 45, 45, 45, 45,
  /* 30053 */ 1852, 45, 45, 45, 45, 45, 45, 45, 1235, 45, 45, 45, 67, 67, 67, 67, 67, 1868, 67, 67, 67, 1872, 67, 67,
  /* 30077 */ 67, 67, 67, 97, 97, 97, 97, 1882, 0, 0, 0, 97, 97, 97, 97, 0, 1891, 67, 67, 67, 67, 67, 97, 97, 97, 97,
  /* 30103 */ 97, 1929, 0, 0, 97, 97, 97, 97, 97, 97, 45, 1900, 45, 1901, 45, 45, 45, 1905, 45, 67, 2054, 97, 45, 67, 0,
  /* 30128 */ 97, 45, 67, 0, 97, 45, 67, 97, 0, 0, 97, 2037, 2038, 97, 97, 45, 45, 45, 45, 67, 67, 67, 67, 1867, 67, 67,
  /* 30154 */ 67, 67, 67, 67, 67, 67, 67, 1774, 97, 97, 97, 97, 97, 97, 0, 94242, 0, 0, 0, 38, 102439, 0, 0, 106538,
  /* 30178 */ 98347, 28809, 45, 45, 142, 45, 45, 45, 1412, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 432, 45, 45,
  /* 30202 */ 45, 45, 45, 157, 45, 45, 171, 45, 45, 45, 182, 45, 45, 45, 45, 200, 45, 45, 45, 1543, 45, 45, 45, 45, 45,
  /* 30227 */ 45, 45, 45, 1551, 45, 45, 45, 45, 1181, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1211, 45, 45, 45,
  /* 30251 */ 1214, 45, 45, 45, 67, 209, 67, 67, 67, 224, 67, 67, 238, 67, 67, 67, 249, 67, 0, 97, 2056, 2057, 0, 2059,
  /* 30275 */ 45, 67, 0, 97, 45, 67, 97, 0, 0, 1937, 97, 97, 97, 97, 97, 97, 45, 45, 45, 45, 45, 45, 1741, 45, 45, 45,
  /* 30301 */ 45, 45, 45, 67, 67, 67, 267, 67, 67, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809, 53531, 97, 97, 289, 97, 97,
  /* 30325 */ 97, 304, 97, 97, 318, 97, 97, 97, 329, 97, 97, 0, 0, 97, 97, 2001, 0, 97, 2003, 97, 97, 97, 45, 45, 45,
  /* 30350 */ 1739, 45, 45, 45, 1742, 45, 45, 45, 45, 45, 97, 97, 347, 97, 97, 97, 0, 40976, 0, 18, 18, 24, 24, 27, 27,
  /* 30375 */ 27, 45, 666, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1420, 45, 57889, 0, 0, 54074, 54074,
  /* 30399 */ 550, 0, 97, 97, 97, 97, 97, 97, 97, 97, 840, 67, 1007, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 30425 */ 67, 759, 67, 67, 67, 67, 67, 67, 67, 1052, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1031, 67, 67, 67, 67,
  /* 30450 */ 67, 97, 97, 97, 1101, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 592, 97, 97, 97, 1190, 45, 45, 45,
  /* 30475 */ 45, 45, 1195, 45, 1197, 45, 45, 45, 45, 1201, 45, 45, 45, 45, 1952, 45, 45, 67, 67, 67, 67, 67, 67, 67,
  /* 30499 */ 67, 67, 67, 67, 67, 250, 67, 67, 67, 1255, 67, 1257, 67, 67, 67, 67, 1261, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 30524 */ 1696, 67, 67, 67, 67, 67, 67, 67, 0, 0, 0, 0, 0, 0, 2162688, 0, 0, 67, 67, 1267, 67, 67, 67, 67, 67, 67,
  /* 30550 */ 1273, 67, 67, 67, 67, 67, 67, 67, 67, 1763, 67, 67, 67, 67, 67, 67, 67, 0, 0, 0, 0, 0, 280, 94, 0, 0,
  /* 30576 */ 1281, 67, 67, 67, 67, 1285, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1070, 67, 67, 67, 67, 67, 1335, 97,
  /* 30600 */ 1337, 97, 97, 97, 97, 1341, 97, 97, 97, 97, 97, 97, 97, 97, 882, 97, 97, 97, 97, 97, 97, 97, 1347, 97, 97,
  /* 30625 */ 97, 97, 97, 97, 1353, 97, 97, 97, 97, 97, 97, 1361, 97, 18, 131427, 0, 638, 0, 0, 0, 0, 362, 0, 0, 365,
  /* 30650 */ 29315, 367, 0, 544, 0, 550, 0, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 30665 */ 2478080, 2158592, 2158592, 2158592, 2994176, 2158592, 2158592, 2207744, 2207744, 2486272, 2207744,
  /* 30676 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 0, 0, 0, 0, 0, 0, 2162688, 0, 53530, 97, 97, 97,
  /* 30694 */ 1365, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 608, 97, 97, 97, 45, 45, 1424, 45, 1425, 67, 67, 67,
  /* 30719 */ 67, 67, 67, 67, 67, 67, 67, 67, 1058, 67, 67, 67, 67, 45, 1555, 45, 45, 1557, 45, 45, 45, 45, 45, 45, 45,
  /* 30744 */ 45, 45, 45, 45, 707, 45, 45, 45, 45, 67, 67, 1570, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 30769 */ 773, 67, 67, 1595, 67, 67, 1597, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 30797 */ 139, 2158592, 2158592, 2158592, 2408448, 2416640, 97, 97, 97, 1636, 97, 97, 97, 1639, 97, 97, 1641, 97,
  /* 30815 */ 97, 97, 97, 97, 97, 1173, 0, 921, 0, 0, 0, 0, 0, 0, 45, 67, 67, 67, 1693, 67, 67, 67, 67, 67, 67, 67,
  /* 30841 */ 1698, 67, 67, 67, 67, 67, 67, 273, 0, 24850, 12564, 0, 0, 0, 0, 28809, 53531, 1860, 45, 45, 67, 67, 1865,
  /* 30864 */ 67, 67, 67, 67, 1870, 67, 67, 67, 67, 1875, 67, 67, 97, 97, 1880, 97, 97, 0, 0, 0, 97, 97, 1888, 97, 0, 0,
  /* 30890 */ 0, 1938, 97, 97, 97, 97, 97, 45, 45, 45, 45, 45, 45, 1854, 45, 45, 45, 45, 45, 45, 45, 1909, 45, 45, 1911,
  /* 30915 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1248, 67, 67, 67, 67, 67, 67, 1922, 67, 67, 1924, 97, 97, 97, 97,
  /* 30940 */ 97, 0, 0, 0, 97, 97, 97, 97, 97, 1898, 45, 45, 45, 45, 45, 45, 1904, 45, 45, 67, 67, 67, 67, 97, 97, 97,
  /* 30966 */ 97, 0, 0, 16384, 97, 97, 97, 97, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 0, 1724, 2008, 2009, 45, 45, 67,
  /* 30991 */ 67, 67, 2014, 2015, 67, 67, 97, 97, 0, 0, 97, 97, 97, 0, 97, 97, 97, 97, 97, 45, 45, 45, 45, 45, 45, 45,
  /* 31017 */ 45, 45, 45, 45, 45, 45, 2022, 0, 2023, 97, 97, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 67, 1869, 67,
  /* 31042 */ 67, 67, 67, 67, 67, 0, 94242, 0, 0, 0, 38, 102439, 0, 0, 106538, 98347, 28809, 45, 45, 45, 147, 151, 154,
  /* 31065 */ 45, 162, 45, 45, 176, 178, 181, 45, 45, 45, 192, 196, 45, 45, 45, 45, 2012, 67, 67, 67, 67, 67, 67, 2018,
  /* 31089 */ 97, 0, 0, 97, 1894, 1895, 97, 1897, 97, 45, 45, 45, 45, 45, 45, 45, 45, 45, 656, 45, 45, 45, 45, 45, 45,
  /* 31114 */ 67, 259, 263, 67, 67, 67, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809, 53531, 97, 97, 97, 294, 298, 301, 97,
  /* 31137 */ 309, 97, 97, 323, 325, 328, 97, 97, 97, 97, 97, 560, 97, 97, 97, 569, 97, 97, 97, 97, 97, 97, 306, 97, 97,
  /* 31162 */ 97, 97, 97, 97, 97, 97, 97, 1624, 97, 97, 97, 97, 97, 97, 97, 0, 921, 0, 1175, 0, 0, 0, 0, 45, 339, 343,
  /* 31188 */ 97, 97, 97, 97, 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27, 67, 67, 503, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 31214 */ 512, 67, 67, 519, 97, 97, 600, 97, 97, 97, 97, 97, 97, 97, 97, 97, 609, 97, 97, 616, 45, 649, 45, 45, 45,
  /* 31239 */ 45, 45, 654, 45, 45, 45, 45, 45, 45, 45, 45, 1393, 45, 45, 45, 45, 45, 45, 45, 45, 1209, 45, 45, 45, 45,
  /* 31264 */ 45, 45, 45, 67, 763, 67, 67, 67, 67, 67, 67, 67, 67, 770, 67, 67, 67, 774, 67, 0, 2045, 97, 97, 97, 97,
  /* 31289 */ 45, 45, 67, 67, 0, 0, 97, 97, 45, 45, 45, 994, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 67, 67, 213, 67,
  /* 31315 */ 219, 67, 67, 232, 67, 242, 67, 247, 67, 67, 67, 779, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 31340 */ 67, 1018, 67, 67, 67, 67, 811, 67, 67, 67, 67, 67, 67, 67, 67, 67, 25398, 542, 13112, 544, 57889, 0, 0,
  /* 31363 */ 54074, 54074, 550, 0, 97, 834, 97, 97, 97, 97, 97, 839, 97, 18, 131427, 0, 638, 0, 0, 0, 0, 362, 0, 0,
  /* 31387 */ 365, 29315, 367, 645, 97, 97, 861, 97, 97, 97, 97, 97, 97, 97, 97, 868, 97, 97, 97, 872, 97, 97, 877, 97,
  /* 31411 */ 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 613, 97, 97, 97, 97, 97, 909, 97, 97, 97, 97, 97, 97, 97,
  /* 31437 */ 97, 97, 0, 0, 0, 18, 18, 24, 24, 27, 27, 27, 1036, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 31464 */ 67, 1047, 67, 67, 67, 1050, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1033, 67, 67, 67, 97, 97,
  /* 31488 */ 1130, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 638, 0, 0, 67, 67, 67, 1295, 67, 67, 67, 0, 0,
  /* 31514 */ 0, 0, 0, 0, 0, 0, 0, 97, 1317, 97, 97, 97, 97, 97, 97, 1375, 97, 97, 97, 0, 0, 0, 45, 1379, 45, 45, 45,
  /* 31541 */ 45, 45, 45, 422, 45, 45, 45, 429, 431, 45, 45, 45, 45, 0, 1090, 0, 0, 97, 1479, 97, 97, 97, 97, 97, 97,
  /* 31566 */ 97, 97, 97, 97, 1357, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1716, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1723,
  /* 31591 */ 0, 921, 29315, 0, 0, 0, 0, 45, 929, 45, 45, 45, 45, 45, 45, 45, 1234, 45, 45, 45, 45, 67, 67, 67, 67,
  /* 31616 */ 1240, 97, 97, 97, 1738, 45, 45, 45, 45, 45, 45, 45, 1743, 45, 45, 45, 45, 166, 45, 45, 45, 45, 184, 186,
  /* 31640 */ 45, 45, 197, 45, 45, 97, 1779, 0, 0, 97, 97, 97, 97, 97, 97, 0, 0, 97, 97, 0, 97, 18, 131427, 0, 638, 0,
  /* 31666 */ 0, 0, 0, 362, 0, 640, 365, 29315, 367, 0, 921, 29315, 0, 0, 0, 0, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 31692 */ 45, 45, 45, 1539, 45, 45, 1803, 45, 45, 45, 45, 45, 1809, 45, 45, 45, 67, 67, 67, 1814, 67, 67, 67, 67,
  /* 31716 */ 67, 97, 97, 97, 97, 97, 0, 0, 0, 1932, 97, 97, 0, 1781, 97, 97, 97, 97, 97, 97, 0, 0, 97, 97, 0, 97, 67,
  /* 31743 */ 67, 67, 1818, 67, 67, 67, 67, 67, 1824, 67, 67, 67, 97, 97, 97, 97, 97, 0, 0, 0, 97, 97, 97, 97, 1890, 0,
  /* 31769 */ 1829, 97, 97, 0, 0, 97, 97, 1836, 97, 97, 0, 0, 0, 97, 97, 97, 97, 1981, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 31795 */ 45, 1987, 1845, 97, 97, 97, 45, 45, 45, 45, 45, 1853, 45, 45, 45, 1857, 45, 45, 45, 67, 1864, 67, 1866,
  /* 31818 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 97, 97, 97, 97, 97, 97, 97, 1710, 1711, 67, 67, 97, 97, 97, 97, 97, 0,
  /* 31844 */ 0, 0, 1886, 97, 97, 97, 0, 0, 97, 97, 97, 97, 1838, 0, 0, 0, 97, 1843, 97, 0, 1893, 97, 97, 97, 97, 97,
  /* 31870 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1745, 45, 45, 67, 2044, 0, 97, 97, 97, 97, 45, 45, 67, 67, 0, 0,
  /* 31896 */ 97, 97, 45, 45, 45, 1660, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 453, 45, 455, 67, 67, 67, 67,
  /* 31921 */ 268, 67, 67, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809, 53531, 97, 97, 348, 97, 97, 97, 0, 40976, 0, 18, 18,
  /* 31945 */ 24, 24, 27, 27, 27, 131427, 0, 359, 0, 0, 362, 0, 365, 28809, 367, 139, 45, 45, 45, 45, 45, 421, 45, 45,
  /* 31969 */ 45, 45, 45, 45, 45, 434, 45, 45, 695, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1667,
  /* 31994 */ 45, 0, 921, 29315, 0, 925, 0, 0, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1548, 45, 45, 45, 45, 45, 45, 67,
  /* 32019 */ 1037, 67, 1039, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1277, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 32043 */ 25398, 0, 13112, 0, 54074, 0, 0, 0, 1095, 0, 0, 0, 1096, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 32068 */ 869, 97, 97, 97, 97, 97, 97, 1131, 97, 1133, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1370, 97, 97, 97, 97,
  /* 32093 */ 97, 1312, 0, 0, 0, 0, 1096, 0, 0, 0, 97, 97, 97, 97, 97, 97, 97, 1327, 97, 97, 97, 97, 97, 1332, 97, 97,
  /* 32119 */ 97, 1830, 97, 0, 0, 97, 97, 97, 97, 97, 0, 0, 0, 97, 97, 97, 1896, 97, 97, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 32146 */ 45, 1210, 45, 45, 45, 45, 45, 45, 133, 94242, 0, 0, 0, 38, 102439, 0, 0, 106538, 98347, 28809, 45, 45, 45,
  /* 32169 */ 45, 380, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 401, 45, 45, 158, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 32195 */ 45, 45, 45, 1200, 45, 45, 45, 45, 206, 67, 67, 67, 67, 67, 225, 67, 67, 67, 67, 67, 67, 67, 67, 754, 67,
  /* 32220 */ 67, 67, 67, 67, 67, 67, 57889, 0, 0, 54074, 54074, 550, 832, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1342, 97,
  /* 32244 */ 97, 97, 97, 97, 97, 67, 67, 67, 67, 67, 25398, 1083, 13112, 1087, 54074, 1091, 0, 0, 0, 0, 0, 0, 1316, 0,
  /* 32268 */ 831, 97, 97, 97, 97, 97, 97, 97, 1174, 921, 0, 1175, 0, 0, 0, 0, 45, 0, 94242, 0, 0, 0, 38, 102439, 0, 0,
  /* 32294 */ 106538, 98347, 28809, 45, 45, 45, 148, 67, 67, 264, 67, 67, 67, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809,
  /* 32316 */ 53531, 97, 97, 97, 295, 97, 97, 97, 97, 313, 97, 97, 97, 97, 331, 333, 97, 18, 131427, 356, 638, 0, 0, 0,
  /* 32340 */ 0, 362, 0, 0, 365, 0, 367, 0, 45, 45, 1530, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 988, 45, 45,
  /* 32366 */ 45, 97, 344, 97, 97, 97, 97, 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27, 402, 404, 45, 45, 45, 45, 45, 45,
  /* 32391 */ 45, 45, 45, 45, 45, 45, 45, 45, 1756, 67, 438, 45, 45, 45, 45, 45, 45, 45, 45, 449, 450, 45, 45, 45, 67,
  /* 32416 */ 67, 214, 218, 221, 67, 229, 67, 67, 243, 245, 248, 67, 67, 67, 67, 67, 488, 490, 67, 67, 67, 67, 67, 67,
  /* 32440 */ 67, 67, 67, 67, 67, 1071, 67, 1073, 67, 67, 67, 67, 67, 524, 67, 67, 67, 67, 67, 67, 67, 67, 535, 536, 67,
  /* 32465 */ 67, 67, 67, 67, 67, 1683, 1684, 67, 67, 67, 67, 1688, 1689, 67, 67, 67, 67, 67, 67, 1694, 67, 67, 67, 67,
  /* 32489 */ 67, 67, 67, 67, 67, 1288, 67, 67, 67, 67, 67, 67, 97, 97, 97, 585, 587, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 32514 */ 97, 97, 97, 1163, 97, 97, 97, 97, 97, 97, 97, 621, 97, 97, 97, 97, 97, 97, 97, 97, 632, 633, 97, 97, 0, 0,
  /* 32540 */ 97, 1783, 97, 97, 97, 97, 0, 0, 97, 97, 0, 97, 97, 97, 45, 2026, 45, 45, 45, 45, 67, 2030, 67, 67, 67, 67,
  /* 32566 */ 67, 67, 1053, 1054, 67, 67, 67, 67, 67, 67, 1061, 67, 712, 45, 45, 45, 717, 45, 45, 45, 45, 45, 45, 45,
  /* 32590 */ 45, 725, 45, 45, 45, 163, 167, 173, 177, 45, 45, 45, 45, 45, 193, 45, 45, 45, 45, 982, 45, 45, 45, 45, 45,
  /* 32615 */ 45, 987, 45, 45, 45, 45, 45, 1558, 45, 1560, 45, 45, 45, 45, 45, 45, 45, 45, 704, 705, 45, 45, 45, 45, 45,
  /* 32640 */ 45, 45, 45, 731, 45, 45, 45, 67, 67, 67, 67, 67, 739, 67, 67, 67, 67, 67, 67, 464, 67, 67, 67, 67, 67, 67,
  /* 32666 */ 479, 67, 67, 67, 67, 67, 764, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1290, 67, 67, 67, 67, 67,
  /* 32691 */ 67, 812, 67, 67, 67, 67, 818, 67, 67, 67, 25398, 542, 13112, 544, 57889, 0, 0, 54074, 54074, 550, 0, 97,
  /* 32713 */ 97, 97, 97, 97, 837, 97, 97, 97, 97, 97, 602, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1137, 97, 97, 97,
  /* 32738 */ 97, 97, 97, 97, 97, 97, 862, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1627, 97, 97, 97, 0, 97, 97, 97,
  /* 32764 */ 97, 910, 97, 97, 97, 97, 916, 97, 97, 97, 0, 0, 0, 97, 97, 1940, 97, 97, 1942, 45, 45, 45, 45, 45, 45,
  /* 32789 */ 385, 45, 45, 45, 45, 395, 45, 45, 45, 45, 966, 45, 969, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 975, 45,
  /* 32814 */ 45, 45, 406, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 974, 45, 45, 45, 67, 67, 67, 67, 1010, 67,
  /* 32839 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1262, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1040, 67, 1042, 67,
  /* 32863 */ 1045, 67, 67, 67, 67, 67, 67, 67, 527, 67, 67, 67, 67, 67, 67, 537, 67, 67, 67, 67, 67, 1051, 67, 67, 67,
  /* 32888 */ 67, 67, 1057, 67, 67, 67, 67, 67, 67, 67, 1454, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1445, 67, 67, 67, 67,
  /* 32913 */ 67, 67, 67, 67, 67, 67, 1079, 25398, 0, 13112, 0, 54074, 0, 0, 0, 0, 0, 0, 0, 2158592, 2158592, 2158592,
  /* 32935 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 32946 */ 2576384, 2207744, 2207744, 2207744, 1098, 97, 97, 97, 97, 97, 1104, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 32966 */ 1356, 97, 97, 97, 97, 97, 97, 1128, 97, 97, 97, 97, 97, 97, 1134, 97, 1136, 97, 1139, 97, 97, 97, 97, 97,
  /* 32990 */ 97, 1622, 97, 97, 97, 97, 97, 97, 97, 97, 0, 921, 0, 0, 0, 1176, 0, 646, 45, 67, 67, 67, 1268, 67, 67, 67,
  /* 33016 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 1469, 67, 67, 67, 97, 1348, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 33041 */ 97, 97, 97, 97, 1127, 97, 67, 1569, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1448, 1449,
  /* 33065 */ 67, 1816, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1825, 67, 67, 1827, 97, 97, 0, 0, 1782, 97, 97, 97, 97, 97,
  /* 33090 */ 0, 0, 97, 97, 0, 97, 97, 97, 1831, 0, 0, 97, 97, 97, 97, 97, 0, 0, 0, 97, 97, 97, 1980, 97, 45, 45, 45,
  /* 33117 */ 45, 45, 45, 45, 45, 45, 45, 1395, 45, 45, 45, 45, 45, 97, 1846, 97, 97, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 33142 */ 45, 45, 45, 45, 1212, 45, 45, 45, 45, 45, 45, 2010, 45, 67, 67, 67, 67, 67, 2016, 67, 97, 97, 0, 0, 97,
  /* 33167 */ 97, 97, 0, 97, 97, 97, 97, 97, 45, 45, 2007, 0, 94242, 0, 0, 0, 38, 102439, 0, 0, 106538, 98347, 28809,
  /* 33190 */ 45, 45, 143, 45, 45, 45, 1671, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 67, 1813, 67, 67, 1815, 45, 45,
  /* 33215 */ 67, 210, 67, 67, 67, 67, 67, 67, 239, 67, 67, 67, 67, 67, 67, 67, 1575, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 33240 */ 493, 67, 67, 67, 67, 67, 67, 67, 97, 97, 290, 97, 97, 97, 97, 97, 97, 319, 97, 97, 97, 97, 97, 97, 303,
  /* 33265 */ 97, 97, 317, 97, 97, 97, 97, 97, 97, 305, 97, 97, 97, 97, 97, 97, 97, 97, 97, 899, 97, 97, 97, 97, 97, 97,
  /* 33291 */ 375, 45, 45, 45, 379, 45, 45, 390, 45, 45, 394, 45, 45, 45, 45, 45, 443, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 33316 */ 67, 67, 67, 67, 67, 461, 67, 67, 67, 465, 67, 67, 476, 67, 67, 480, 67, 67, 67, 67, 67, 67, 1761, 67, 67,
  /* 33341 */ 67, 67, 67, 67, 67, 67, 67, 530, 67, 67, 67, 67, 67, 67, 500, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 33367 */ 67, 67, 67, 67, 1075, 97, 97, 97, 558, 97, 97, 97, 562, 97, 97, 573, 97, 97, 577, 97, 97, 0, 1999, 97, 97,
  /* 33392 */ 97, 0, 97, 97, 2004, 2005, 97, 45, 45, 45, 45, 1193, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 676, 45,
  /* 33417 */ 45, 45, 45, 597, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1334, 45, 681, 45, 45, 45,
  /* 33442 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1396, 45, 45, 1399, 45, 45, 730, 45, 45, 45, 45, 67, 67, 67,
  /* 33467 */ 67, 67, 67, 67, 67, 67, 67, 1434, 67, 67, 67, 67, 67, 67, 750, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 33492 */ 1456, 67, 67, 67, 67, 67, 45, 45, 993, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 67, 67, 1238, 67, 67,
  /* 33517 */ 1006, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1280, 1048, 1049, 67, 67, 67, 67, 67,
  /* 33541 */ 67, 67, 67, 67, 67, 1059, 67, 67, 67, 67, 67, 67, 1296, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2371584, 2158592,
  /* 33565 */ 2158592, 2158592, 2158592, 2158592, 2158592, 97, 97, 1100, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 33585 */ 97, 638, 0, 920, 97, 97, 1142, 1143, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1153, 97, 97, 97, 97, 97,
  /* 33609 */ 1144, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1149, 97, 97, 97, 97, 1154, 45, 1218, 45, 45, 45, 45, 45,
  /* 33633 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 1678, 45, 45, 45, 67, 67, 67, 67, 67, 1269, 67, 67, 67, 67, 67, 67,
  /* 33658 */ 67, 67, 1278, 67, 67, 67, 67, 67, 67, 1772, 67, 67, 97, 97, 97, 97, 97, 97, 97, 0, 921, 922, 1175, 0, 0,
  /* 33683 */ 0, 0, 45, 97, 97, 1349, 97, 97, 97, 97, 97, 97, 97, 97, 1358, 97, 97, 97, 97, 97, 97, 1623, 97, 97, 97,
  /* 33708 */ 97, 97, 97, 97, 97, 0, 921, 0, 0, 926, 0, 0, 0, 45, 45, 1411, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 33735 */ 45, 45, 45, 1754, 45, 45, 67, 67, 1301, 0, 1307, 0, 1313, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 33759 */ 21054, 97, 97, 97, 97, 67, 1757, 67, 67, 67, 1760, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1467, 67, 67,
  /* 33783 */ 67, 67, 67, 1778, 97, 0, 0, 97, 97, 97, 97, 97, 97, 0, 0, 97, 97, 0, 97, 97, 97, 97, 97, 1158, 97, 97, 97,
  /* 33810 */ 1161, 97, 97, 97, 97, 1166, 97, 97, 97, 97, 97, 1325, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1328, 97,
  /* 33834 */ 97, 97, 97, 97, 97, 97, 67, 67, 67, 67, 67, 1820, 67, 1822, 67, 67, 67, 67, 67, 97, 97, 97, 97, 97, 0, 0,
  /* 33860 */ 0, 97, 1933, 97, 1892, 97, 97, 97, 97, 97, 97, 1899, 45, 45, 45, 45, 45, 45, 45, 45, 1664, 45, 45, 45, 45,
  /* 33885 */ 45, 45, 45, 45, 1546, 45, 45, 45, 45, 45, 45, 45, 45, 1208, 45, 45, 45, 45, 45, 45, 45, 45, 1224, 45, 45,
  /* 33910 */ 45, 45, 45, 45, 45, 45, 673, 45, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 1925, 97, 97, 97, 97, 0, 0,
  /* 33936 */ 0, 97, 97, 97, 97, 97, 623, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 307, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 33962 */ 97, 1796, 97, 45, 45, 45, 45, 45, 45, 45, 970, 45, 45, 45, 45, 45, 45, 45, 45, 1417, 45, 45, 45, 45, 45,
  /* 33987 */ 45, 45, 67, 1964, 67, 67, 97, 97, 97, 97, 0, 0, 0, 97, 97, 97, 97, 0, 97, 97, 97, 97, 97, 97, 1721, 97,
  /* 34013 */ 97, 0, 0, 1997, 97, 0, 0, 2000, 97, 97, 0, 97, 97, 97, 97, 97, 45, 45, 45, 45, 733, 45, 67, 67, 67, 67,
  /* 34039 */ 67, 67, 67, 67, 67, 67, 803, 67, 67, 67, 67, 67, 0, 94242, 0, 0, 0, 38, 102439, 0, 0, 106538, 98347,
  /* 34062 */ 28809, 45, 45, 144, 45, 45, 45, 1805, 45, 1807, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 67, 231, 67, 67,
  /* 34086 */ 67, 67, 67, 67, 67, 0, 24850, 12564, 0, 0, 0, 281, 28809, 53531, 45, 45, 67, 211, 67, 67, 67, 67, 230,
  /* 34109 */ 234, 240, 244, 67, 67, 67, 67, 67, 67, 492, 67, 67, 67, 67, 67, 67, 67, 67, 67, 471, 67, 67, 67, 67, 481,
  /* 34134 */ 67, 67, 260, 67, 67, 67, 67, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809, 53531, 97, 97, 291, 97, 97, 97, 97,
  /* 34158 */ 310, 314, 320, 324, 97, 97, 97, 97, 97, 97, 1367, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1355, 97, 97, 97,
  /* 34182 */ 97, 97, 97, 1362, 340, 97, 97, 97, 97, 97, 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27, 131427, 0, 0, 360, 0,
  /* 34207 */ 362, 0, 365, 28809, 367, 139, 369, 45, 45, 45, 374, 67, 67, 460, 67, 67, 67, 67, 466, 67, 67, 67, 67, 67,
  /* 34231 */ 67, 67, 67, 801, 67, 67, 67, 67, 67, 67, 67, 67, 67, 487, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 498, 67,
  /* 34257 */ 67, 67, 67, 67, 67, 1821, 67, 67, 67, 67, 67, 67, 97, 97, 97, 97, 97, 0, 0, 0, 97, 97, 97, 97, 0, 0, 67,
  /* 34284 */ 502, 67, 67, 67, 67, 67, 67, 67, 508, 67, 67, 67, 515, 517, 67, 67, 67, 67, 67, 97, 97, 97, 97, 97, 0, 0,
  /* 34310 */ 1931, 97, 97, 97, 97, 97, 588, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 629, 97, 97, 97, 97, 97, 67, 24850,
  /* 34335 */ 24850, 12564, 12564, 0, 57889, 0, 0, 0, 53531, 53531, 367, 286, 552, 97, 97, 97, 97, 97, 1352, 97, 97, 97,
  /* 34357 */ 97, 97, 97, 97, 97, 97, 97, 1511, 97, 97, 97, 97, 97, 97, 97, 557, 97, 97, 97, 97, 563, 97, 97, 97, 97,
  /* 34382 */ 97, 97, 97, 97, 1135, 97, 97, 97, 97, 97, 97, 97, 97, 97, 584, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 34407 */ 595, 97, 97, 97, 97, 97, 895, 97, 97, 97, 97, 97, 97, 903, 97, 97, 97, 0, 97, 97, 1638, 97, 97, 97, 97,
  /* 34432 */ 97, 97, 97, 97, 1646, 97, 599, 97, 97, 97, 97, 97, 97, 97, 605, 97, 97, 97, 612, 614, 97, 97, 97, 97, 97,
  /* 34457 */ 1377, 0, 0, 45, 45, 45, 45, 45, 45, 45, 45, 655, 45, 45, 45, 45, 45, 45, 45, 745, 67, 67, 67, 67, 751, 67,
  /* 34483 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 1577, 67, 67, 67, 67, 67, 762, 67, 67, 67, 67, 766, 67, 67, 67, 67,
  /* 34508 */ 67, 67, 67, 67, 67, 67, 1765, 67, 67, 67, 67, 67, 777, 67, 67, 781, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 34533 */ 67, 67, 67, 1592, 1593, 67, 67, 97, 843, 97, 97, 97, 97, 849, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1510,
  /* 34557 */ 97, 97, 97, 97, 97, 97, 97, 860, 97, 97, 97, 97, 864, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1797, 45, 45,
  /* 34582 */ 45, 45, 1801, 45, 97, 875, 97, 97, 879, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1522, 97, 97, 97, 97,
  /* 34607 */ 97, 991, 45, 45, 45, 45, 996, 45, 45, 45, 45, 45, 45, 45, 45, 67, 67, 215, 67, 67, 67, 67, 233, 67, 67,
  /* 34632 */ 67, 67, 251, 253, 1022, 67, 67, 67, 1026, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1035, 67, 67, 1038, 67,
  /* 34656 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1458, 67, 67, 67, 67, 67, 1064, 67, 67, 67, 1067, 67, 67,
  /* 34681 */ 67, 67, 1072, 67, 67, 67, 67, 67, 67, 1442, 67, 67, 67, 67, 67, 67, 67, 67, 67, 97, 97, 97, 1775, 97, 97,
  /* 34706 */ 97, 67, 67, 67, 67, 67, 25398, 0, 13112, 0, 54074, 0, 0, 0, 0, 1096, 0, 921, 29315, 0, 0, 0, 0, 928, 45,
  /* 34731 */ 45, 45, 45, 45, 934, 45, 45, 45, 164, 45, 45, 45, 45, 45, 45, 45, 45, 45, 198, 45, 45, 45, 378, 45, 45,
  /* 34756 */ 45, 45, 45, 45, 393, 45, 45, 45, 398, 45, 97, 97, 1116, 97, 97, 97, 1120, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 34781 */ 97, 1147, 1148, 97, 97, 97, 97, 97, 97, 97, 1129, 97, 97, 1132, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 34805 */ 97, 1626, 97, 97, 97, 97, 0, 45, 1178, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1185, 45, 45, 45, 45, 441, 45,
  /* 34830 */ 45, 45, 45, 45, 45, 451, 45, 45, 67, 67, 67, 67, 67, 227, 67, 67, 67, 67, 67, 67, 67, 67, 1260, 67, 67,
  /* 34855 */ 67, 1263, 67, 67, 1265, 1203, 45, 45, 1205, 45, 1206, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1216, 67, 1266,
  /* 34878 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 1276, 67, 67, 67, 67, 67, 67, 752, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 34904 */ 1056, 67, 67, 67, 67, 67, 67, 45, 1386, 45, 1389, 45, 45, 45, 45, 1394, 45, 45, 45, 1397, 45, 45, 45, 45,
  /* 34928 */ 995, 45, 997, 45, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 1915, 67, 67, 67, 67, 67, 1422, 45, 45, 45, 67,
  /* 34953 */ 67, 67, 67, 67, 67, 67, 67, 67, 1433, 67, 1436, 67, 67, 67, 67, 1441, 67, 67, 67, 1444, 67, 67, 67, 67,
  /* 34977 */ 67, 67, 67, 0, 24851, 12565, 0, 0, 0, 0, 28809, 53532, 97, 97, 97, 97, 1494, 97, 97, 97, 1497, 97, 97, 97,
  /* 35001 */ 97, 97, 97, 97, 1368, 97, 97, 97, 97, 97, 97, 97, 97, 851, 97, 97, 97, 97, 97, 97, 97, 67, 67, 67, 1571,
  /* 35026 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 25398, 542, 13112, 544, 67, 67, 1583, 67, 67, 67, 67, 67,
  /* 35050 */ 67, 67, 67, 1591, 67, 67, 67, 67, 67, 67, 782, 67, 67, 67, 67, 67, 67, 67, 67, 67, 756, 67, 67, 67, 67,
  /* 35075 */ 67, 67, 97, 1634, 97, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1125, 97, 97, 97, 1647, 97, 97,
  /* 35100 */ 97, 97, 97, 0, 45, 45, 45, 45, 45, 45, 45, 45, 45, 719, 720, 45, 45, 45, 45, 45, 45, 45, 45, 685, 45, 45,
  /* 35126 */ 45, 45, 45, 45, 45, 45, 45, 942, 45, 45, 946, 45, 45, 45, 950, 45, 45, 1658, 45, 45, 45, 45, 45, 45, 45,
  /* 35151 */ 45, 45, 45, 45, 45, 45, 45, 1668, 1712, 97, 97, 97, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 0, 0, 1835, 97,
  /* 35177 */ 97, 97, 97, 0, 0, 0, 97, 97, 1844, 97, 97, 1726, 0, 97, 97, 97, 97, 97, 1732, 97, 1734, 97, 97, 97, 97,
  /* 35202 */ 97, 300, 97, 308, 97, 97, 97, 97, 97, 97, 97, 97, 866, 97, 97, 97, 97, 97, 97, 97, 67, 67, 67, 1758, 67,
  /* 35227 */ 67, 67, 1762, 67, 67, 67, 67, 67, 67, 67, 67, 1043, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1771,
  /* 35252 */ 67, 67, 67, 97, 97, 97, 97, 97, 1776, 97, 97, 97, 97, 97, 1794, 97, 97, 97, 45, 45, 45, 45, 45, 45, 45,
  /* 35277 */ 1183, 45, 45, 45, 45, 45, 45, 45, 45, 45, 409, 45, 45, 45, 45, 45, 45, 67, 67, 67, 1966, 97, 97, 97, 1970,
  /* 35302 */ 0, 0, 0, 97, 97, 97, 97, 0, 97, 97, 97, 1720, 97, 97, 97, 97, 97, 0, 0, 97, 97, 97, 1837, 97, 0, 1840,
  /* 35328 */ 1841, 97, 97, 97, 1988, 45, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1994, 1995, 67, 97, 97, 97, 97, 97, 911,
  /* 35352 */ 97, 97, 97, 97, 97, 97, 97, 638, 0, 0, 0, 0, 1315, 0, 0, 0, 0, 97, 97, 97, 1319, 97, 97, 97, 0, 97, 97,
  /* 35379 */ 97, 97, 97, 97, 1733, 97, 97, 97, 97, 97, 97, 1340, 97, 97, 97, 1343, 97, 97, 1345, 97, 1346, 67, 67, 265,
  /* 35403 */ 67, 67, 67, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809, 53531, 97, 345, 97, 97, 97, 97, 0, 40976, 0, 18, 18,
  /* 35427 */ 24, 24, 27, 27, 27, 131427, 0, 0, 0, 361, 362, 0, 365, 28809, 367, 139, 45, 45, 45, 45, 45, 671, 45, 45,
  /* 35451 */ 45, 45, 45, 45, 45, 45, 45, 45, 411, 45, 45, 414, 45, 45, 45, 45, 377, 45, 45, 45, 386, 45, 45, 45, 45,
  /* 35476 */ 45, 45, 45, 45, 45, 1207, 45, 45, 45, 45, 45, 45, 1213, 45, 45, 67, 67, 67, 67, 67, 463, 67, 67, 67, 472,
  /* 35501 */ 67, 67, 67, 67, 67, 67, 67, 528, 67, 67, 67, 67, 67, 67, 67, 67, 1287, 67, 67, 67, 67, 67, 67, 67, 540,
  /* 35526 */ 24850, 24850, 12564, 12564, 0, 57889, 0, 0, 0, 53531, 53531, 367, 286, 97, 97, 97, 97, 97, 1103, 97, 97,
  /* 35547 */ 97, 97, 97, 97, 97, 97, 97, 97, 917, 97, 97, 0, 0, 0, 637, 18, 131427, 0, 0, 0, 0, 0, 0, 362, 0, 0, 365,
  /* 35574 */ 29315, 367, 0, 921, 29315, 0, 0, 0, 927, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1223, 45, 45, 45, 45, 45, 45,
  /* 35599 */ 45, 45, 45, 426, 45, 45, 433, 45, 45, 45, 45, 697, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 708, 45, 45,
  /* 35624 */ 45, 45, 1221, 45, 45, 45, 45, 1225, 45, 45, 45, 45, 45, 45, 384, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1198,
  /* 35649 */ 45, 45, 45, 45, 45, 45, 67, 67, 795, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1470, 67, 67, 67,
  /* 35675 */ 67, 67, 67, 67, 815, 67, 67, 67, 67, 67, 67, 25398, 542, 13112, 544, 97, 97, 97, 893, 97, 97, 97, 97, 97,
  /* 35699 */ 97, 97, 97, 97, 97, 97, 97, 1164, 97, 97, 97, 67, 67, 67, 1025, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 35724 */ 67, 67, 1687, 67, 67, 67, 67, 67, 67, 67, 67, 67, 25398, 0, 13112, 0, 54074, 0, 0, 0, 0, 0, 1097, 1241,
  /* 35748 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1450, 45, 45, 1388, 45, 1390, 45, 45, 45, 45,
  /* 35773 */ 45, 45, 45, 45, 45, 45, 45, 1236, 67, 67, 67, 67, 67, 1437, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 35798 */ 67, 67, 67, 67, 1472, 1490, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1503, 67, 67, 67,
  /* 35823 */ 67, 67, 97, 97, 97, 97, 97, 0, 1930, 0, 97, 97, 97, 97, 97, 847, 97, 97, 97, 97, 97, 97, 97, 97, 97, 858,
  /* 35849 */ 67, 67, 1965, 67, 97, 97, 97, 97, 0, 0, 0, 97, 97, 97, 97, 0, 97, 97, 1719, 97, 97, 97, 97, 97, 97, 0, 0,
  /* 35876 */ 0, 45, 45, 45, 45, 1382, 45, 1383, 45, 45, 45, 159, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 35901 */ 1563, 45, 45, 45, 45, 45, 67, 261, 67, 67, 67, 67, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809, 53531, 341, 97,
  /* 35925 */ 97, 97, 97, 97, 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27, 97, 1099, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 35951 */ 97, 97, 97, 97, 1333, 97, 1230, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 67, 1992, 67,
  /* 35976 */ 1993, 67, 67, 67, 97, 97, 45, 45, 160, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1665, 45, 45,
  /* 36001 */ 45, 45, 45, 131427, 357, 0, 0, 0, 362, 0, 365, 28809, 367, 139, 45, 45, 45, 45, 45, 684, 45, 45, 45, 45,
  /* 36025 */ 45, 45, 45, 45, 45, 45, 412, 45, 45, 45, 416, 45, 45, 45, 440, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 36051 */ 67, 67, 1990, 67, 1991, 67, 67, 67, 67, 67, 67, 67, 97, 97, 1707, 97, 97, 97, 97, 97, 97, 501, 67, 67, 67,
  /* 36076 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1691, 67, 67, 67, 67, 67, 526, 67, 67, 67, 67, 67, 67, 67,
  /* 36102 */ 67, 67, 67, 1030, 67, 1032, 67, 67, 67, 67, 598, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 36127 */ 97, 1632, 0, 921, 29315, 923, 0, 0, 0, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1392, 45, 45, 45, 45, 45, 45,
  /* 36152 */ 45, 45, 45, 960, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 25398, 0, 13112, 0, 54074, 0, 0, 1093, 0, 0,
  /* 36177 */ 0, 0, 0, 97, 1609, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1369, 97, 97, 97, 1372, 97, 97, 67, 67, 266, 67,
  /* 36202 */ 67, 67, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809, 53531, 97, 346, 97, 97, 97, 97, 0, 40976, 0, 18, 18, 24,
  /* 36226 */ 24, 27, 27, 27, 665, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1677, 45, 45, 45, 45, 67,
  /* 36252 */ 45, 45, 954, 45, 956, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1404, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 36277 */ 45, 425, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 1270, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1069,
  /* 36302 */ 67, 67, 67, 67, 67, 67, 97, 97, 97, 1350, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1524, 97, 97,
  /* 36327 */ 97, 97, 97, 97, 97, 1376, 0, 0, 0, 45, 45, 45, 45, 45, 45, 45, 45, 1545, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 36353 */ 45, 448, 45, 45, 45, 45, 67, 456, 67, 67, 67, 67, 67, 1573, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1247,
  /* 36378 */ 67, 67, 67, 67, 67, 1252, 97, 1725, 97, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1628, 97, 1630,
  /* 36403 */ 0, 0, 94242, 0, 0, 0, 2211840, 0, 1122304, 0, 0, 0, 0, 2158592, 2158731, 2158592, 2158592, 2158592,
  /* 36421 */ 3121152, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 36432 */ 2158592, 2158592, 3022848, 2158592, 3047424, 2158592, 2158592, 2158592, 2158592, 3084288, 2158592,
  /* 36443 */ 2158592, 3117056, 2158592, 2158592, 2158592, 2158592, 2158592, 2158878, 2158592, 2158592, 2158592,
  /* 36454 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 36465 */ 2609152, 2158592, 2158592, 2207744, 0, 542, 0, 544, 0, 0, 2166784, 0, 0, 0, 550, 0, 0, 2158592, 2158592,
  /* 36484 */ 2691072, 2158592, 2719744, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2871296,
  /* 36495 */ 2158592, 2908160, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 0, 94242, 0, 0, 0,
  /* 36509 */ 2211840, 0, 0, 1134592, 0, 0, 0, 2158592, 2158592, 2158592, 2158592, 2158592, 3190784, 2158592, 0, 0, 139,
  /* 36526 */ 0, 0, 0, 139, 0, 2371584, 2207744, 0, 0, 0, 0, 180224, 0, 2166784, 0, 0, 0, 0, 0, 286, 2158592, 2158592,
  /* 36548 */ 3174400, 3178496, 2158592, 0, 0, 0, 2158592, 2158592, 2158592, 2158592, 2158592, 2428928, 2158592,
  /* 36561 */ 2158592, 2158592, 1508, 2158592, 2912256, 2158592, 2158592, 2158592, 2981888, 2158592, 2158592, 2158592,
  /* 36573 */ 2158592, 3043328, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 3162112, 67, 24850, 24850, 12564,
  /* 36586 */ 12564, 0, 0, 0, 0, 0, 53531, 53531, 0, 286, 97, 97, 97, 97, 97, 1119, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 36611 */ 97, 1509, 97, 97, 97, 97, 97, 97, 97, 97, 564, 97, 97, 97, 97, 97, 97, 97, 57889, 0, 0, 0, 0, 550, 0, 97,
  /* 36637 */ 97, 97, 97, 97, 97, 97, 97, 97, 561, 97, 97, 97, 97, 97, 97, 576, 97, 97, 139264, 139264, 139264, 139264,
  /* 36659 */ 139264, 139264, 139264, 139264, 139264, 139264, 139264, 139264, 0, 0, 139264, 0, 921, 29315, 0, 0, 926, 0,
  /* 36677 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 1811, 45, 67, 67, 67, 67, 67, 0, 2146304, 2146304, 0, 0, 0, 0,
  /* 36700 */ 2224128, 2224128, 2224128, 2232320, 2232320, 2232320, 2232320, 0, 0, 1301, 0, 0, 0, 0, 0, 1307, 0, 0, 0,
  /* 36719 */ 0, 0, 1313, 0, 0, 0, 0, 0, 0, 0, 97, 97, 1318, 97, 97, 97, 97, 97, 97, 1795, 97, 97, 45, 45, 45, 45, 45,
  /* 36746 */ 45, 45, 446, 45, 45, 45, 45, 45, 45, 67, 67, 2158592, 2146304, 0, 0, 0, 0, 0, 0, 0, 2211840, 0, 0, 0, 0,
  /* 36771 */ 2158592, 0, 921, 29315, 0, 924, 0, 0, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1537, 45, 45, 45, 45
];

JSONiqTokenizer.EXPECTED =
[
  /*    0 */ 290, 300, 304, 353, 296, 309, 305, 319, 315, 324, 328, 352, 354, 334, 338, 330, 320, 345, 349, 293, 358,
  /*   21 */ 362, 341, 366, 312, 370, 374, 378, 382, 386, 390, 394, 398, 526, 402, 428, 435, 509, 428, 428, 428, 428,
  /*   42 */ 408, 428, 428, 428, 441, 428, 428, 428, 457, 428, 428, 639, 428, 428, 414, 428, 428, 428, 428, 428, 428,
  /*   63 */ 428, 633, 419, 423, 933, 932, 427, 433, 648, 428, 439, 939, 995, 445, 676, 519, 450, 455, 756, 808, 827,
  /*   84 */ 428, 461, 465, 821, 470, 469, 474, 481, 485, 477, 489, 493, 429, 912, 497, 503, 780, 779, 922, 781, 508,
  /*  105 */ 833, 428, 513, 717, 504, 518, 523, 642, 428, 538, 544, 865, 864, 800, 550, 554, 558, 562, 566, 570, 574,
  /*  126 */ 578, 582, 586, 593, 597, 630, 815, 814, 428, 646, 618, 451, 652, 612, 984, 657, 711, 653, 532, 662, 714,
  /*  147 */ 529, 534, 533, 669, 861, 667, 673, 686, 690, 694, 698, 702, 705, 708, 729, 733, 738, 966, 428, 737, 636,
  /*  168 */ 1005, 428, 963, 514, 965, 742, 764, 428, 748, 754, 499, 663, 760, 428, 763, 768, 723, 772, 723, 725, 776,
  /*  189 */ 785, 789, 793, 428, 679, 797, 807, 812, 978, 977, 1000, 826, 819, 918, 428, 920, 803, 428, 825, 720, 682,
  /*  210 */ 428, 831, 837, 844, 843, 848, 854, 858, 869, 873, 875, 879, 883, 887, 891, 895, 899, 903, 615, 990, 989,
  /*  231 */ 428, 909, 750, 428, 916, 744, 428, 926, 589, 658, 931, 937, 905, 404, 410, 409, 850, 624, 943, 603, 947,
  /*  252 */ 956, 960, 428, 428, 428, 540, 970, 974, 546, 927, 983, 982, 626, 428, 988, 952, 428, 994, 621, 446, 999,
  /*  273 */ 950, 839, 451, 1004, 1009, 428, 1012, 600, 606, 1016, 609, 428, 428, 428, 428, 428, 415, 1020, 1024, 1028,
  /*  293 */ 1086, 1031, 1091, 1091, 1047, 1081, 1138, 1109, 1216, 1050, 1036, 1040, 1086, 1086, 1086, 1086, 1059, 1063,
  /*  311 */ 1069, 1086, 1087, 1091, 1091, 1092, 1073, 1065, 1108, 1091, 1091, 1091, 1119, 1124, 1139, 1079, 1075, 1085,
  /*  329 */ 1086, 1086, 1086, 1088, 1091, 1063, 1053, 1061, 1115, 1063, 1105, 1086, 1086, 1091, 1091, 1032, 1123, 1064,
  /*  347 */ 1129, 1140, 1128, 1159, 1086, 1086, 1152, 1091, 1091, 1091, 1096, 1091, 1133, 1074, 1137, 1144, 1062, 1151,
  /*  365 */ 1086, 1156, 1099, 1102, 1147, 1163, 1170, 1102, 1186, 1152, 1091, 1111, 1174, 1055, 1088, 1110, 1178, 1166,
  /*  383 */ 1090, 1205, 1185, 1108, 1190, 1194, 1089, 1198, 1181, 1202, 1209, 1043, 1213, 1220, 1224, 1228, 1232, 1236,
  /*  401 */ 1250, 1689, 1612, 1270, 1270, 1245, 2021, 1786, 1270, 1270, 1270, 1246, 1270, 1679, 1270, 1270, 1270, 1258,
  /*  419 */ 1637, 1605, 1277, 1636, 1282, 1535, 1914, 1287, 1292, 1270, 1270, 1270, 1270, 1242, 1758, 1298, 1270, 1270,
  /*  437 */ 1257, 1270, 1309, 1313, 1270, 1270, 1262, 1270, 1318, 1270, 1270, 1270, 1278, 1917, 1270, 1270, 1270, 1283,
  /*  455 */ 1576, 1918, 1270, 1270, 1269, 1270, 1857, 1270, 1270, 1643, 1343, 1270, 1453, 1336, 1597, 1270, 1595, 1270,
  /*  473 */ 1593, 1496, 1347, 1614, 1598, 1359, 1367, 1373, 1239, 1270, 1265, 1355, 1264, 1270, 1353, 1360, 1362, 1378,
  /*  491 */ 1384, 1363, 1361, 1753, 1390, 1396, 1502, 1405, 1270, 1270, 1270, 2068, 1418, 1270, 1270, 1270, 1349, 1439,
  /*  509 */ 1270, 1270, 1270, 1509, 1447, 1270, 1270, 1270, 1543, 1457, 1270, 1270, 1270, 1575, 1270, 1739, 1468, 1270,
  /*  527 */ 1270, 1907, 1270, 1270, 1705, 1598, 1270, 1270, 1270, 1706, 1270, 1475, 1642, 1270, 1270, 1270, 2080, 1385,
  /*  545 */ 1479, 1270, 1270, 1270, 2086, 1658, 1270, 1270, 1470, 1484, 1270, 1764, 1768, 1270, 1766, 1270, 1716, 1490,
  /*  563 */ 1270, 1979, 1406, 1737, 2002, 1501, 1735, 1803, 1664, 1495, 1500, 1514, 1507, 1513, 1518, 1524, 1532, 1518,
  /*  581 */ 1541, 1547, 1548, 1809, 1552, 1559, 1563, 1567, 1270, 1270, 2016, 2027, 2046, 1270, 1722, 1599, 1573, 1721,
  /*  599 */ 1581, 1270, 1270, 2028, 1270, 1270, 2032, 1270, 1270, 2084, 1270, 1270, 2091, 1270, 1283, 1625, 1270, 1283,
  /*  617 */ 1976, 1270, 1288, 1609, 1270, 1288, 1630, 1270, 1294, 1270, 1270, 1599, 1462, 1270, 1621, 1586, 1270, 1301,
  /*  635 */ 1520, 1270, 1270, 1748, 1270, 1270, 1781, 1270, 1270, 1740, 1452, 1435, 1604, 1270, 1270, 1305, 1919, 1618,
  /*  653 */ 1270, 1270, 1270, 1647, 1635, 1270, 1270, 1270, 1681, 1648, 1270, 1270, 1270, 1727, 1270, 1676, 1270, 1270,
  /*  671 */ 1314, 1662, 1697, 1270, 1695, 1270, 1414, 1325, 1270, 1270, 1821, 1270, 1270, 1822, 1862, 1270, 1686, 1270,
  /*  689 */ 1939, 1270, 1693, 1270, 1703, 1407, 1410, 1270, 1413, 1671, 1409, 1412, 1408, 1751, 1670, 1411, 1751, 1671,
  /*  707 */ 1672, 1699, 1776, 1710, 1270, 1421, 1641, 1270, 1314, 1652, 1270, 1380, 1451, 1270, 1270, 1861, 1270, 1270,
  /*  725 */ 1865, 1270, 1801, 1270, 1270, 1714, 1270, 1600, 1270, 1720, 1599, 1726, 1744, 1270, 1270, 1270, 1732, 1270,
  /*  743 */ 1762, 1270, 1270, 1321, 2006, 1727, 1780, 1270, 1270, 1328, 1994, 1270, 1728, 1270, 1270, 1332, 1300, 1785,
  /*  761 */ 1270, 1270, 1900, 1270, 1270, 1270, 1773, 1790, 1270, 1270, 1796, 1270, 1866, 1270, 1864, 1801, 1840, 1848,
  /*  779 */ 1270, 1425, 1270, 1270, 1270, 1374, 1816, 1816, 1842, 1815, 1841, 1807, 1840, 1849, 1807, 1815, 1813, 1839,
  /*  797 */ 1769, 1833, 1826, 1270, 1471, 1485, 1270, 1270, 1927, 1931, 1832, 1270, 1270, 1270, 1856, 1792, 1838, 1270,
  /*  815 */ 1270, 1338, 1591, 1270, 1582, 1929, 1270, 1270, 1342, 1270, 2008, 1863, 1270, 1270, 1270, 1857, 1392, 1930,
  /*  833 */ 1270, 1270, 1443, 1270, 1270, 1870, 1270, 1270, 1528, 1270, 1270, 1920, 1862, 1270, 1270, 1270, 1877, 1270,
  /*  851 */ 1270, 1537, 1270, 1885, 1270, 1270, 2074, 1893, 1270, 1273, 1270, 1486, 1668, 1270, 1386, 1480, 1270, 1270,
  /*  869 */ 1271, 1898, 1270, 1272, 1642, 2039, 1270, 1904, 2054, 1828, 1270, 1889, 1889, 2056, 1888, 2055, 1911, 2054,
  /*  887 */ 1924, 1937, 1880, 1881, 2057, 1428, 1873, 1943, 1947, 1951, 1955, 1959, 1270, 1817, 1971, 1964, 1270, 1970,
  /*  905 */ 1270, 1270, 1555, 1270, 1270, 1990, 2027, 1270, 1503, 1491, 1400, 1253, 2000, 1270, 1270, 1574, 1853, 1270,
  /*  923 */ 1270, 1369, 1432, 2012, 1270, 1270, 1270, 1894, 2020, 1270, 1270, 1270, 1966, 1292, 1682, 2021, 1270, 1270,
  /*  941 */ 1577, 1313, 1270, 2026, 1270, 1933, 1932, 2033, 1834, 1270, 1527, 1270, 1270, 1628, 1270, 1464, 1270, 1464,
  /*  959 */ 1843, 1797, 1270, 2037, 1270, 1569, 1757, 1270, 1270, 1270, 1744, 1270, 2043, 1401, 2062, 2052, 1270, 2061,
  /*  977 */ 1270, 1587, 1847, 1270, 1270, 1894, 1631, 1270, 1270, 1270, 1982, 1655, 1270, 1270, 1270, 1986, 1270, 1460,
  /*  995 */ 1270, 1270, 1270, 1996, 2066, 1270, 1270, 1270, 2008, 2072, 1270, 1270, 1270, 2048, 2078, 1270, 1270, 1960,
  /* 1013 */ 1270, 1270, 1972, 2022, 1270, 1270, 2090, 2102, 2113, 2095, 2099, 2169, 2110, 2176, 2670, 2117, 2121, 2129,
  /* 1031 */ 2295, 2133, 2133, 2133, 2988, 2310, 2166, 2173, 2249, 2322, 2180, 2234, 2295, 2133, 2287, 2210, 2189, 2139,
  /* 1049 */ 2203, 2290, 2152, 2162, 2290, 2219, 2290, 2290, 2214, 2295, 2290, 2310, 2290, 2307, 2290, 2290, 2290, 2290,
  /* 1067 */ 2218, 2290, 2320, 2323, 2195, 2233, 2201, 2206, 2290, 2290, 2290, 2224, 2290, 2308, 2290, 2290, 2158, 2290,
  /* 1085 */ 2232, 2295, 2295, 2295, 2295, 2296, 2133, 2133, 2133, 2133, 2190, 2133, 2189, 2238, 2290, 2219, 2290, 2311,
  /* 1103 */ 2290, 2290, 2290, 2291, 2268, 2295, 2297, 2133, 2133, 2133, 2289, 2290, 2309, 2290, 2290, 2307, 2133, 2988,
  /* 1121 */ 2278, 2283, 2205, 2290, 2290, 2290, 2307, 2309, 2290, 2290, 2290, 2309, 2277, 2190, 2282, 2204, 2157, 2290,
  /* 1139 */ 2290, 2290, 2310, 2290, 2290, 2310, 2308, 2290, 2290, 2292, 2295, 2295, 2294, 2295, 2295, 2295, 2297, 2191,
  /* 1157 */ 2207, 2290, 2290, 2293, 2295, 2295, 2133, 2287, 2290, 2290, 2295, 2295, 2295, 2290, 2306, 2290, 2312, 2209,
  /* 1175 */ 2290, 2312, 2154, 2208, 2306, 2312, 2156, 2213, 2295, 2295, 2156, 2220, 2295, 2295, 2295, 2133, 2289, 2209,
  /* 1193 */ 2306, 2313, 2290, 2213, 2295, 2133, 2290, 2304, 2311, 2297, 2133, 2133, 2288, 2208, 2211, 2312, 2209, 2311,
  /* 1211 */ 2290, 2214, 2155, 2214, 2296, 2133, 2134, 2138, 2143, 2302, 2290, 2214, 2987, 2317, 2220, 2298, 2212, 2327,
  /* 1229 */ 2327, 2327, 2335, 2345, 2349, 2353, 2361, 2796, 2935, 2370, 2250, 2125, 2148, 2250, 2197, 2536, 2250, 2250,
  /* 1247 */ 2980, 2493, 2918, 2512, 2250, 2374, 2250, 2250, 3001, 2907, 2550, 2250, 2250, 2250, 2197, 2250, 2763, 2250,
  /* 1265 */ 2250, 2228, 2249, 2250, 2761, 2250, 2250, 2250, 2250, 2182, 2836, 2577, 2425, 2250, 2250, 2250, 2251, 2426,
  /* 1283 */ 2250, 2250, 2250, 2252, 2443, 2250, 2250, 2250, 2253, 2440, 2444, 2250, 2250, 2365, 2918, 2463, 2448, 2454,
  /* 1301 */ 2250, 2250, 2250, 2264, 2735, 2739, 2465, 2450, 2541, 2738, 2464, 2449, 2455, 2250, 2250, 2250, 2262, 2466,
  /* 1319 */ 2472, 2456, 2250, 2250, 3001, 2928, 2464, 2470, 2454, 2250, 2250, 3002, 2908, 2250, 2736, 2463, 2476, 2272,
  /* 1337 */ 2247, 2250, 2250, 2377, 2680, 2490, 2271, 2246, 2250, 2250, 2146, 2248, 2250, 2250, 2384, 2605, 2521, 2250,
  /* 1355 */ 2250, 2537, 2509, 2250, 2537, 2522, 2250, 2250, 2227, 2250, 2250, 2227, 2227, 2249, 2250, 2250, 2385, 2564,
  /* 1373 */ 2520, 2250, 2250, 2250, 2383, 2537, 2530, 2250, 2250, 2386, 2607, 2529, 2250, 2250, 2250, 2398, 2606, 2540,
  /* 1391 */ 2537, 2250, 2250, 2391, 2818, 2539, 2537, 2250, 2539, 2548, 2250, 2250, 2250, 2405, 2549, 2250, 2250, 2250,
  /* 1409 */ 2427, 2250, 2250, 2250, 2429, 2250, 2250, 2250, 2460, 2554, 2559, 2576, 2250, 2251, 2338, 2503, 2531, 2555,
  /* 1427 */ 2560, 2577, 2855, 2250, 2861, 2570, 2587, 2577, 2250, 2251, 2704, 2502, 2594, 2566, 2572, 2589, 2593, 2565,
  /* 1445 */ 2571, 2588, 2385, 2606, 2610, 2574, 2571, 2575, 2250, 2250, 2250, 2461, 2609, 2573, 2577, 2250, 2252, 2256,
  /* 1463 */ 2260, 2250, 2250, 2865, 2250, 2598, 2575, 2250, 2250, 2397, 2619, 2614, 2397, 2604, 2608, 2600, 2606, 2614,
  /* 1481 */ 2496, 2250, 2250, 2614, 2805, 2250, 2250, 2250, 2498, 2628, 2250, 2250, 2250, 2531, 2639, 2250, 2250, 2250,
  /* 1499 */ 2537, 2776, 2780, 2250, 2250, 2250, 2532, 2549, 2540, 2779, 2250, 2250, 2403, 2250, 2250, 2777, 2404, 2250,
  /* 1517 */ 2427, 2427, 2778, 2250, 2250, 2409, 2263, 2775, 2578, 2780, 2250, 2254, 2972, 2250, 2250, 2250, 2775, 2779,
  /* 1535 */ 2250, 2263, 2250, 2250, 2364, 2933, 2649, 2663, 2250, 2250, 2419, 2787, 2775, 2417, 2250, 2775, 2415, 2581,
  /* 1553 */ 2428, 2580, 2250, 2357, 2241, 2245, 2581, 2579, 2250, 2579, 2578, 2578, 2250, 2580, 2661, 2578, 2250, 2250,
  /* 1571 */ 2420, 2768, 2674, 2250, 2250, 2250, 2541, 2461, 2465, 2471, 2675, 2250, 2250, 2250, 2542, 2684, 2250, 2250,
  /* 1589 */ 2250, 2544, 2331, 2685, 2250, 2250, 2427, 2462, 2273, 2249, 2250, 2250, 2250, 2376, 2744, 2689, 2250, 2250,
  /* 1607 */ 2250, 2582, 2706, 2504, 2691, 2250, 2375, 2250, 2250, 2124, 2147, 2705, 2503, 2690, 2250, 2376, 2679, 2330,
  /* 1625 */ 2339, 2504, 2698, 2250, 2377, 2257, 2261, 2250, 2250, 2250, 2699, 2250, 2250, 2250, 2583, 2426, 2697, 2577,
  /* 1643 */ 2250, 2250, 2250, 2490, 2250, 2703, 2710, 2714, 2249, 2339, 2712, 2247, 2250, 2378, 2258, 2250, 2398, 2620,
  /* 1661 */ 2615, 2722, 2248, 2250, 2250, 2427, 2650, 2723, 2249, 2250, 2250, 2430, 2250, 2250, 2428, 2262, 2340, 2247,
  /* 1679 */ 2250, 2404, 2250, 2250, 2355, 2929, 2243, 2498, 2341, 2247, 2250, 2412, 2251, 2395, 2431, 2729, 2250, 2250,
  /* 1697 */ 2499, 2724, 2250, 2250, 2430, 2427, 2733, 2248, 2250, 2250, 2500, 2718, 2249, 2428, 2428, 2250, 2430, 2946,
  /* 1715 */ 2949, 2250, 2250, 2541, 2624, 2743, 2250, 2250, 2250, 2657, 2675, 2744, 2250, 2250, 2250, 2693, 2792, 2748,
  /* 1733 */ 2753, 2758, 2250, 2427, 2635, 2404, 2250, 2250, 2399, 2606, 2598, 2250, 2749, 2754, 2759, 2419, 2767, 2773,
  /* 1751 */ 2250, 2428, 2250, 2250, 2539, 2250, 2760, 2250, 2250, 2250, 2737, 2784, 2788, 2250, 2250, 2541, 2634, 2629,
  /* 1769 */ 2250, 2250, 2250, 2516, 2262, 2786, 2773, 2250, 2429, 2250, 2429, 2792, 2250, 2250, 2250, 2762, 2878, 2250,
  /* 1787 */ 2250, 2250, 2763, 2250, 2957, 2250, 2250, 2543, 2105, 2954, 2250, 2250, 2250, 2803, 2250, 2956, 2250, 2250,
  /* 1805 */ 2633, 2639, 2250, 2952, 2250, 2250, 2655, 2427, 2950, 2250, 2250, 2950, 2250, 2250, 2250, 2807, 2800, 2250,
  /* 1823 */ 2250, 2250, 2832, 2515, 2811, 2250, 2250, 2693, 2850, 2516, 2812, 2250, 2250, 2250, 2864, 2692, 2250, 2250,
  /* 1841 */ 2250, 2951, 2250, 2250, 2250, 2805, 2106, 2250, 2250, 2250, 2953, 2250, 2817, 2823, 2827, 2250, 2461, 2486,
  /* 1859 */ 2455, 2250, 2832, 2822, 2826, 2250, 2250, 2250, 2955, 2250, 2250, 2257, 2822, 2826, 2250, 2524, 2249, 2861,
  /* 1877 */ 2537, 2183, 2480, 2250, 2524, 2839, 2250, 2524, 2880, 2184, 2481, 2250, 2524, 2851, 2250, 2250, 2482, 2250,
  /* 1895 */ 2250, 2250, 2968, 2836, 2577, 2250, 2250, 2693, 2878, 2250, 2844, 2838, 2250, 2538, 2382, 2390, 2250, 2849,
  /* 1913 */ 2577, 2250, 2541, 2435, 2465, 2478, 2456, 2250, 2250, 2250, 2257, 2250, 2693, 2857, 2250, 2542, 2818, 2824,
  /* 1931 */ 2828, 2250, 2250, 2250, 2958, 2933, 2250, 2856, 2250, 2250, 2728, 2250, 2524, 2249, 2524, 2523, 2874, 2645,
  /* 1949 */ 2525, 2872, 2642, 2869, 2869, 2869, 2644, 2250, 2250, 2975, 2978, 2250, 2250, 2250, 2984, 2806, 2885, 2250,
  /* 1967 */ 2250, 2735, 2436, 2807, 2886, 2250, 2250, 2250, 2992, 2890, 2895, 2900, 2250, 2634, 2780, 2250, 2253, 2501,
  /* 1985 */ 2505, 3001, 2891, 2896, 2901, 2252, 2906, 2910, 2825, 2912, 2917, 2250, 2250, 2735, 2462, 2911, 2916, 2250,
  /* 2003 */ 2250, 2775, 2651, 2922, 2916, 2250, 2250, 2816, 2822, 3002, 2929, 2923, 2917, 2252, 2927, 2909, 2825, 2243,
  /* 2021 */ 2918, 2250, 2250, 2250, 2998, 2366, 2902, 2250, 2250, 2250, 2993, 2958, 2933, 2250, 2250, 2250, 2250, 2804,
  /* 2039 */ 2250, 2250, 2843, 2837, 2250, 2693, 2645, 2250, 2667, 2250, 2250, 2421, 2769, 2250, 2962, 2250, 2250, 2848,
  /* 2057 */ 2839, 2250, 2250, 2855, 2405, 2963, 2250, 2250, 2250, 2255, 2259, 2250, 2250, 2876, 2794, 2256, 2261, 2250,
  /* 2075 */ 2250, 2881, 2185, 2984, 2250, 2250, 2250, 2939, 2943, 2251, 2994, 2250, 2250, 2967, 2260, 2250, 2998, 2250,
  /* 2093 */ 2250, 2250, 402653184, 554434560, 571736064, 545521856, 268451840, 335544320, 268693630, 512, 2048, 256,
  /* 2105 */ 1024, 1245184, 130023424, 268435456, -536870912, 0, 1024, 0, 1073741824, 0x80000000, 539754496, 542375936,
  /* 2117 */ 537133056, 4194304, 1048576, 268435456, 0, 134217728, 16777216, 0, 0, 64, 4096, 16384, 0, 33554432,
  /* 2131 */ 8388608, 192, 67108864, 67108864, 67108864, 67108864, 16, 32, 4, 0, 8192, 196608, 196608, 229376, 80, 4096,
  /* 2147 */ 16384, 131072, 67108864, 536870912, 1073741824, 24576, 24600, 24576, 24576, 2, 24576, 24576, 24576, 24584,
  /* 2161 */ 24592, 24576, 24578, 24576, 24578, 24576, 24576, 16, 512, 2048, 2048, 256, 0, 2048, 2048, 1073741824,
  /* 2177 */ 1073741824, 0, 0x80000000, 262144, 134217728, 0, 128, 196608, 1048576, 8388608, 33554432, 67108864,
  /* 2189 */ 67108864, 32, 32, 4, 4, 4096, 262144, 134217728, 0, 0, -1208205442, -1208205442, 8192, 131072, 131072,
  /* 2204 */ 4096, 4096, 4096, 4096, 24576, 24576, 24576, 8, 8, 24576, 24576, 16384, 16384, 16384, 24576, 24584, 24576,
  /* 2221 */ 24576, 24576, 16384, 24576, 536870912, 262144, 0, 0, 64, 131072, 536870912, 128, 128, 64, 16384, 16384,
  /* 2237 */ 16384, 4, 4096, 4096, 4096, 32768, 2097152, 8388608, 33554432, 67108864, 268435456, 536870912, 1073741824,
  /* 2250 */ 0, 0, 0, 0, 1, 2, 4, 8, 64, 128, 1024, 16384, 0, 0, 0, 2, 0, 0, 128, 16384, 16384, 16384, 32768, 131072,
  /* 2274 */ 4194304, 67108864, 536870912, 32, 32, 32, 32, 4, 4, 4, 4, 4, 4096, 67108864, 67108864, 67108864, 24576,
  /* 2291 */ 24576, 24576, 24576, 0, 16384, 16384, 16384, 16384, 67108864, 67108864, 8, 67108864, 24576, 8, 8, 8, 24576,
  /* 2308 */ 24576, 24576, 24578, 24576, 24576, 24576, 2, 2, 2, 67108864, 8, 8, 24576, 2048, 0x80000000, 536870912,
  /* 2324 */ 262144, 262144, 262144, 67108864, 8, 24576, 16384, 65536, 262144, 524288, 1048576, 67108864, 24576, 65538,
  /* 2338 */ 2, 4, 24, 512, 8192, 0, 0, 50, 805306370, 2098178, 2098179, 10, 130, 201851018, 10, 130, 25165826, 0, 0, 1,
  /* 2358 */ 64, 256, 512, -2083086386, 0, 65536, 0, 0, 64, 8388608, 33554432, 268435456, 1, 1, 1025, 2097153, 0,
  /* 2375 */ 25165824, 0, 0, 0, 3, 4, 8, 3584, 0, 0, 0, 6, 24, 32, 64, 58720256, 0, 0, 0, 8, 1, 1, 0, 0, 2, 4, 16, 32,
  /* 2403 */ 8388608, 16777216, 0, 0, 0, 15, 1995962612, 1995962612, 1995962613, 0, 0, 65536, 0, 0, 4096, 16777216, 0,
  /* 2420 */ 0, 2, 64, 128, 1024, 491520, 1995440128, 0, 0, 0, 16, 0, 0, 0, 24, 16, 224, 6144, 24576, 32768, 65536,
  /* 2441 */ 131072, 262144, 15728640, 33554432, 1946157056, 0, 0, 131072, 262144, 7340032, 8388608, 33554432, 67108864,
  /* 2454 */ 33554432, 67108864, 268435456, 1610612736, 0, 0, 4, 16, 96, 4096, 16384, 32768, 65536, 131072, 262144,
  /* 2469 */ 1048576, 262144, 1048576, 6291456, 8388608, 33554432, 67108864, 131072, 262144, 4194304, 8388608, 33554432,
  /* 2481 */ 67108864, 268435456, -1073741824, 0, 0, 32768, 65536, 131072, 4194304, 0, 16, 96, 4096, 32768, 8388608,
  /* 2496 */ 33554432, 0x80000000, 0, 0, 2, 24, 512, 8192, 65536, 524288, 2097152, 8388608, 134217728, 131072,
  /* 2510 */ 536870912, 1073741824, 0, 0, 524288, 0, 0, 252, 1246208, 130023424, 0, 64, 131072, 1073741824, 0, 0,
  /* 2526 */ 131072, 1048576, 0, 64, 131072, 0, 0, 0, 62, 1851200, -1208205442, 0, 0, 0, 64, 0, 0, 0, 4, 8, 240, 1024,
  /* 2548 */ 1851200, -1210056704, 0, 0, 0, 2048, 62, 16192, 262144, 1572864, 6291456, 6291456, 25165824, 100663296,
  /* 2562 */ 268435456, 536870912, 320, 512, 1024, 14336, 262144, 1572864, 262144, 1572864, 2097152, 4194304, 25165824,
  /* 2575 */ 33554432, 536870912, 0x80000000, 0, 0, 0, 4096, 0, 0, 0, 30964, 491520, 25165824, 33554432, 67108864,
  /* 2590 */ 536870912, 0x80000000, 0, 6, 24, 32, 320, 512, 14336, 1572864, 2097152, 25165824, 33554432, 536870912, 16,
  /* 2605 */ 32, 64, 256, 512, 1024, 14336, 1572864, 2097152, 4194304, 14336, 1572864, 2097152, 16777216, 33554432, 16,
  /* 2620 */ 64, 256, 512, 14336, 16, 64, 0, 6144, 8192, 1572864, 16777216, 33554432, 0, 0, 16, 64, 6144, 8192, 1048576,
  /* 2639 */ 8192, 1048576, 16777216, 0, 0, 1048576, 1048576, 0, 0, 0, 16, 64, 0, 0, 6144, 8192, 16, 4096, 0, 0, 3,
  /* 2660 */ 8764, 0, 4096, 0, 4096, 1048576, 16777216, -117611969, -117611969, -117611969, 0, 0, 2097152, 524288, 8764,
  /* 2675 */ 344064, -117964800, 0, 0, 4, 56, 512, 8192, 16384, 1048576, 2097152, -121634816, 0, 0, 2097152, 8388608,
  /* 2691 */ 402653184, -536870912, 0, 0, 0, 131072, 8388608, 134217728, 268435456, 1610612736, 0x80000000, 0, 0, 2, 4,
  /* 2706 */ 24, 32, 512, 8192, 512, 8192, 65536, 2097152, 8388608, 134217728, 268435456, 536870912, 2097152, 134217728,
  /* 2720 */ 268435456, 536870912, 24, 512, 8192, 268435456, 536870912, 1073741824, 24, 512, 536870912, 1073741824, 0,
  /* 2733 */ 24, 512, 0, 0, 4, 16, 96, 128, 4096, 16384, 3, 21952, 458752, 409993216, 0, 0, 1, 2, 192, 1280, 1280, 4096,
  /* 2755 */ 16384, 458752, 3145728, 3145728, 4194304, 402653184, 0, 0, 0, 16777216, 0, 0, 128, 1024, 4096, 458752,
  /* 2771 */ 3145728, 402653184, 3145728, 402653184, 0, 0, 16, 64, 4096, 1048576, 16777216, 0, 0, 0, 2, 64, 4096,
  /* 2788 */ 131072, 262144, 3145728, 402653184, 262144, 3145728, 268435456, 0, 0, 0, 32, 0, -137165572, -137165572,
  /* 2802 */ -137165572, 0, 0, 33554432, 0, 0, 0, 37827, 66125824, 130023424, -268435456, 0, 0, 0, 4, 8, 224, 1024,
  /* 2820 */ 196608, 1048576, 196608, 1048576, 4194304, 8388608, 50331648, 67108864, 268435456, -536870912, 0, 0, 0, 8,
  /* 2834 */ 224, 1024, 33554432, 67108864, 268435456, 1073741824, 0x80000000, 0, 0, 0, 196608, 1048576, 33554432,
  /* 2847 */ 67108864, 0, 131072, 1048576, 67108864, 1073741824, 0x80000000, 0, 0, 131072, 1048576, 1073741824,
  /* 2859 */ 0x80000000, 0, 131072, 1048576, 1073741824, 0, 0, 33554432, 268435456, 0, 1048576, 0, 1048576, 1048576, 0,
  /* 2874 */ 1048576, 0, 0, 131072, 262144, 3145728, 0, 0, 64, 128, 196608, 66125824, 872415232, 0, 0, 0, 64, 128, 4864,
  /* 2893 */ 32768, 65536, 65536, 1048576, 6291456, 8388608, 50331648, 50331648, 335544320, 536870912, 0, 0, 0, 64, 128,
  /* 2908 */ 768, 4096, 32768, 65536, 2097152, 4194304, 8388608, 50331648, 50331648, 67108864, 268435456, 536870912, 0,
  /* 2921 */ 0, 32768, 65536, 2097152, 8388608, 50331648, 64, 128, 256, 512, 4096, 32768, 33554432, 268435456,
  /* 2935 */ 536870912, 0, 1024, 2097152, 0, 1245184, 1245184, 1245184, 17615, 17615, 869583, 0, 0, 410473923,
  /* 2949 */ 410473923, 0, 0, 0, 2097152, 0, 0, 0, 3145728, 0, 0, 0, 8388608, 15, 1216, 16384, 0, 0, 0, 7, 8, 192, 1024,
  /* 2972 */ 64, 128, 16384, 0, 0, 938578883, 938578883, 0, 0, 0, 64, 256, 1, 4, 8, 16384, 67108864, 67108864, 67108864,
  /* 2991 */ 32, 0, 1, 4, 8, 0, 0, 0, 1, 4, 0, 1, 2, 64, 128
];

JSONiqTokenizer.TOKEN =
[
  "(0)",
  "ModuleDecl",
  "Annotation",
  "OptionDecl",
  "Operator",
  "Variable",
  "Tag",
  "EndTag",
  "PragmaContents",
  "DirCommentContents",
  "DirPIContents",
  "CDataSectionContents",
  "AttrTest",
  "Wildcard",
  "EQName",
  "IntegerLiteral",
  "DecimalLiteral",
  "DoubleLiteral",
  "PredefinedEntityRef",
  "'\"\"'",
  "EscapeApos",
  "QuotChar",
  "AposChar",
  "ElementContentChar",
  "QuotAttrContentChar",
  "AposAttrContentChar",
  "NCName",
  "QName",
  "S",
  "CharRef",
  "CommentContents",
  "DocTag",
  "DocCommentContents",
  "EOF",
  "'!'",
  "'\"'",
  "'#'",
  "'#)'",
  "'$$'",
  "''''",
  "'('",
  "'(#'",
  "'(:'",
  "'(:~'",
  "')'",
  "'*'",
  "'*'",
  "','",
  "'-->'",
  "'.'",
  "'/'",
  "'/>'",
  "':'",
  "':)'",
  "';'",
  "'<!--'",
  "'<![CDATA['",
  "'<?'",
  "'='",
  "'>'",
  "'?'",
  "'?>'",
  "'NaN'",
  "'['",
  "']'",
  "']]>'",
  "'after'",
  "'all'",
  "'allowing'",
  "'ancestor'",
  "'ancestor-or-self'",
  "'and'",
  "'any'",
  "'append'",
  "'array'",
  "'as'",
  "'ascending'",
  "'at'",
  "'attribute'",
  "'base-uri'",
  "'before'",
  "'boundary-space'",
  "'break'",
  "'by'",
  "'case'",
  "'cast'",
  "'castable'",
  "'catch'",
  "'check'",
  "'child'",
  "'collation'",
  "'collection'",
  "'comment'",
  "'constraint'",
  "'construction'",
  "'contains'",
  "'content'",
  "'context'",
  "'continue'",
  "'copy'",
  "'copy-namespaces'",
  "'count'",
  "'decimal-format'",
  "'decimal-separator'",
  "'declare'",
  "'default'",
  "'delete'",
  "'descendant'",
  "'descendant-or-self'",
  "'descending'",
  "'diacritics'",
  "'different'",
  "'digit'",
  "'distance'",
  "'div'",
  "'document'",
  "'document-node'",
  "'element'",
  "'else'",
  "'empty'",
  "'empty-sequence'",
  "'encoding'",
  "'end'",
  "'entire'",
  "'eq'",
  "'every'",
  "'exactly'",
  "'except'",
  "'exit'",
  "'external'",
  "'first'",
  "'following'",
  "'following-sibling'",
  "'for'",
  "'foreach'",
  "'foreign'",
  "'from'",
  "'ft-option'",
  "'ftand'",
  "'ftnot'",
  "'ftor'",
  "'function'",
  "'ge'",
  "'greatest'",
  "'group'",
  "'grouping-separator'",
  "'gt'",
  "'idiv'",
  "'if'",
  "'import'",
  "'in'",
  "'index'",
  "'infinity'",
  "'inherit'",
  "'insensitive'",
  "'insert'",
  "'instance'",
  "'integrity'",
  "'intersect'",
  "'into'",
  "'is'",
  "'item'",
  "'json'",
  "'json-item'",
  "'key'",
  "'language'",
  "'last'",
  "'lax'",
  "'le'",
  "'least'",
  "'let'",
  "'levels'",
  "'loop'",
  "'lowercase'",
  "'lt'",
  "'minus-sign'",
  "'mod'",
  "'modify'",
  "'module'",
  "'most'",
  "'namespace'",
  "'namespace-node'",
  "'ne'",
  "'next'",
  "'no'",
  "'no-inherit'",
  "'no-preserve'",
  "'node'",
  "'nodes'",
  "'not'",
  "'object'",
  "'occurs'",
  "'of'",
  "'on'",
  "'only'",
  "'option'",
  "'or'",
  "'order'",
  "'ordered'",
  "'ordering'",
  "'paragraph'",
  "'paragraphs'",
  "'parent'",
  "'pattern-separator'",
  "'per-mille'",
  "'percent'",
  "'phrase'",
  "'position'",
  "'preceding'",
  "'preceding-sibling'",
  "'preserve'",
  "'previous'",
  "'processing-instruction'",
  "'relationship'",
  "'rename'",
  "'replace'",
  "'return'",
  "'returning'",
  "'revalidation'",
  "'same'",
  "'satisfies'",
  "'schema'",
  "'schema-attribute'",
  "'schema-element'",
  "'score'",
  "'self'",
  "'sensitive'",
  "'sentence'",
  "'sentences'",
  "'skip'",
  "'sliding'",
  "'some'",
  "'stable'",
  "'start'",
  "'stemming'",
  "'stop'",
  "'strict'",
  "'strip'",
  "'structured-item'",
  "'switch'",
  "'text'",
  "'then'",
  "'thesaurus'",
  "'times'",
  "'to'",
  "'treat'",
  "'try'",
  "'tumbling'",
  "'type'",
  "'typeswitch'",
  "'union'",
  "'unique'",
  "'unordered'",
  "'updating'",
  "'uppercase'",
  "'using'",
  "'validate'",
  "'value'",
  "'variable'",
  "'version'",
  "'weight'",
  "'when'",
  "'where'",
  "'while'",
  "'wildcards'",
  "'window'",
  "'with'",
  "'without'",
  "'word'",
  "'words'",
  "'xquery'",
  "'zero-digit'",
  "'{'",
  "'{{'",
  "'|'",
  "'}'",
  "'}}'"
];

                                                            // line 544 "JSONiqTokenizer.ebnf"
                                                            });
                                                            // line 4210 "JSONiqTokenizer.js"
// End
