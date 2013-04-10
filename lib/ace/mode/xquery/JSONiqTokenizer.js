// This file was generated on Mon Mar 18, 2013 16:57 (UTC+01) by REx v5.24 which is Copyright (c) 1979-2013 by Gunther Rademacher <grd@gmx.net>
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
                                    // S^WS | EOF | '!' | '"' | "'" | '(' | '(#' | '(:' | '(:~' | ')' | ',' | '.' |
                                    // '/' | ':' | ';' | '<!--' | '<![CDATA[' | '<?' | '[' | ']' | 'after' |
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
    case 55:                        // '<![CDATA['
      shift(55);                    // '<![CDATA['
      break;
    case 54:                        // '<!--'
      shift(54);                    // '<!--'
      break;
    case 56:                        // '<?'
      shift(56);                    // '<?'
      break;
    case 40:                        // '(#'
      shift(40);                    // '(#'
      break;
    case 42:                        // '(:~'
      shift(42);                    // '(:~'
      break;
    case 41:                        // '(:'
      shift(41);                    // '(:'
      break;
    case 35:                        // '"'
      shift(35);                    // '"'
      break;
    case 38:                        // "'"
      shift(38);                    // "'"
      break;
    case 274:                       // '}'
      shift(274);                   // '}'
      break;
    case 271:                       // '{'
      shift(271);                   // '{'
      break;
    case 39:                        // '('
      shift(39);                    // '('
      break;
    case 43:                        // ')'
      shift(43);                    // ')'
      break;
    case 49:                        // '/'
      shift(49);                    // '/'
      break;
    case 62:                        // '['
      shift(62);                    // '['
      break;
    case 63:                        // ']'
      shift(63);                    // ']'
      break;
    case 46:                        // ','
      shift(46);                    // ','
      break;
    case 48:                        // '.'
      shift(48);                    // '.'
      break;
    case 53:                        // ';'
      shift(53);                    // ';'
      break;
    case 51:                        // ':'
      shift(51);                    // ':'
      break;
    case 34:                        // '!'
      shift(34);                    // '!'
      break;
    case 273:                       // '|'
      shift(273);                   // '|'
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
    case 58:                        // '>'
      shift(58);                    // '>'
      break;
    case 50:                        // '/>'
      shift(50);                    // '/>'
      break;
    case 27:                        // QName
      shift(27);                    // QName
      break;
    case 57:                        // '='
      shift(57);                    // '='
      break;
    case 35:                        // '"'
      shift(35);                    // '"'
      break;
    case 38:                        // "'"
      shift(38);                    // "'"
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
    case 55:                        // '<![CDATA['
      shift(55);                    // '<![CDATA['
      break;
    case 54:                        // '<!--'
      shift(54);                    // '<!--'
      break;
    case 18:                        // PredefinedEntityRef
      shift(18);                    // PredefinedEntityRef
      break;
    case 29:                        // CharRef
      shift(29);                    // CharRef
      break;
    case 272:                       // '{{'
      shift(272);                   // '{{'
      break;
    case 275:                       // '}}'
      shift(275);                   // '}}'
      break;
    case 271:                       // '{'
      shift(271);                   // '{'
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
    case 272:                       // '{{'
      shift(272);                   // '{{'
      break;
    case 275:                       // '}}'
      shift(275);                   // '}}'
      break;
    case 271:                       // '{'
      shift(271);                   // '{'
      break;
    case 38:                        // "'"
      shift(38);                    // "'"
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
    case 272:                       // '{{'
      shift(272);                   // '{{'
      break;
    case 275:                       // '}}'
      shift(275);                   // '}}'
      break;
    case 271:                       // '{'
      shift(271);                   // '{'
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
    case 64:                        // ']]>'
      shift(64);                    // ']]>'
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
    case 47:                        // '-->'
      shift(47);                    // '-->'
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
    case 59:                        // '?'
      shift(59);                    // '?'
      break;
    case 60:                        // '?>'
      shift(60);                    // '?>'
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
    case 52:                        // ':)'
      shift(52);                    // ':)'
      break;
    case 41:                        // '(:'
      shift(41);                    // '(:'
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
    case 52:                        // ':)'
      shift(52);                    // ':)'
      break;
    case 41:                        // '(:'
      shift(41);                    // '(:'
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
    case 38:                        // "'"
      shift(38);                    // "'"
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
    case 77:                        // 'attribute'
      shift(77);                    // 'attribute'
      break;
    case 91:                        // 'comment'
      shift(91);                    // 'comment'
      break;
    case 115:                       // 'document-node'
      shift(115);                   // 'document-node'
      break;
    case 116:                       // 'element'
      shift(116);                   // 'element'
      break;
    case 119:                       // 'empty-sequence'
      shift(119);                   // 'empty-sequence'
      break;
    case 140:                       // 'function'
      shift(140);                   // 'function'
      break;
    case 147:                       // 'if'
      shift(147);                   // 'if'
      break;
    case 160:                       // 'item'
      shift(160);                   // 'item'
      break;
    case 180:                       // 'namespace-node'
      shift(180);                   // 'namespace-node'
      break;
    case 186:                       // 'node'
      shift(186);                   // 'node'
      break;
    case 211:                       // 'processing-instruction'
      shift(211);                   // 'processing-instruction'
      break;
    case 221:                       // 'schema-attribute'
      shift(221);                   // 'schema-attribute'
      break;
    case 222:                       // 'schema-element'
      shift(222);                   // 'schema-element'
      break;
    case 238:                       // 'switch'
      shift(238);                   // 'switch'
      break;
    case 239:                       // 'text'
      shift(239);                   // 'text'
      break;
    case 248:                       // 'typeswitch'
      shift(248);                   // 'typeswitch'
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
    case 65:                        // 'after'
      shift(65);                    // 'after'
      break;
    case 68:                        // 'ancestor'
      shift(68);                    // 'ancestor'
      break;
    case 69:                        // 'ancestor-or-self'
      shift(69);                    // 'ancestor-or-self'
      break;
    case 70:                        // 'and'
      shift(70);                    // 'and'
      break;
    case 74:                        // 'as'
      shift(74);                    // 'as'
      break;
    case 75:                        // 'ascending'
      shift(75);                    // 'ascending'
      break;
    case 79:                        // 'before'
      shift(79);                    // 'before'
      break;
    case 83:                        // 'case'
      shift(83);                    // 'case'
      break;
    case 84:                        // 'cast'
      shift(84);                    // 'cast'
      break;
    case 85:                        // 'castable'
      shift(85);                    // 'castable'
      break;
    case 88:                        // 'child'
      shift(88);                    // 'child'
      break;
    case 89:                        // 'collation'
      shift(89);                    // 'collation'
      break;
    case 98:                        // 'copy'
      shift(98);                    // 'copy'
      break;
    case 100:                       // 'count'
      shift(100);                   // 'count'
      break;
    case 103:                       // 'declare'
      shift(103);                   // 'declare'
      break;
    case 104:                       // 'default'
      shift(104);                   // 'default'
      break;
    case 105:                       // 'delete'
      shift(105);                   // 'delete'
      break;
    case 106:                       // 'descendant'
      shift(106);                   // 'descendant'
      break;
    case 107:                       // 'descendant-or-self'
      shift(107);                   // 'descendant-or-self'
      break;
    case 108:                       // 'descending'
      shift(108);                   // 'descending'
      break;
    case 113:                       // 'div'
      shift(113);                   // 'div'
      break;
    case 114:                       // 'document'
      shift(114);                   // 'document'
      break;
    case 117:                       // 'else'
      shift(117);                   // 'else'
      break;
    case 118:                       // 'empty'
      shift(118);                   // 'empty'
      break;
    case 121:                       // 'end'
      shift(121);                   // 'end'
      break;
    case 123:                       // 'eq'
      shift(123);                   // 'eq'
      break;
    case 124:                       // 'every'
      shift(124);                   // 'every'
      break;
    case 126:                       // 'except'
      shift(126);                   // 'except'
      break;
    case 129:                       // 'first'
      shift(129);                   // 'first'
      break;
    case 130:                       // 'following'
      shift(130);                   // 'following'
      break;
    case 131:                       // 'following-sibling'
      shift(131);                   // 'following-sibling'
      break;
    case 132:                       // 'for'
      shift(132);                   // 'for'
      break;
    case 141:                       // 'ge'
      shift(141);                   // 'ge'
      break;
    case 143:                       // 'group'
      shift(143);                   // 'group'
      break;
    case 145:                       // 'gt'
      shift(145);                   // 'gt'
      break;
    case 146:                       // 'idiv'
      shift(146);                   // 'idiv'
      break;
    case 148:                       // 'import'
      shift(148);                   // 'import'
      break;
    case 154:                       // 'insert'
      shift(154);                   // 'insert'
      break;
    case 155:                       // 'instance'
      shift(155);                   // 'instance'
      break;
    case 157:                       // 'intersect'
      shift(157);                   // 'intersect'
      break;
    case 158:                       // 'into'
      shift(158);                   // 'into'
      break;
    case 159:                       // 'is'
      shift(159);                   // 'is'
      break;
    case 165:                       // 'last'
      shift(165);                   // 'last'
      break;
    case 167:                       // 'le'
      shift(167);                   // 'le'
      break;
    case 169:                       // 'let'
      shift(169);                   // 'let'
      break;
    case 173:                       // 'lt'
      shift(173);                   // 'lt'
      break;
    case 175:                       // 'mod'
      shift(175);                   // 'mod'
      break;
    case 176:                       // 'modify'
      shift(176);                   // 'modify'
      break;
    case 177:                       // 'module'
      shift(177);                   // 'module'
      break;
    case 179:                       // 'namespace'
      shift(179);                   // 'namespace'
      break;
    case 181:                       // 'ne'
      shift(181);                   // 'ne'
      break;
    case 193:                       // 'only'
      shift(193);                   // 'only'
      break;
    case 195:                       // 'or'
      shift(195);                   // 'or'
      break;
    case 196:                       // 'order'
      shift(196);                   // 'order'
      break;
    case 197:                       // 'ordered'
      shift(197);                   // 'ordered'
      break;
    case 201:                       // 'parent'
      shift(201);                   // 'parent'
      break;
    case 207:                       // 'preceding'
      shift(207);                   // 'preceding'
      break;
    case 208:                       // 'preceding-sibling'
      shift(208);                   // 'preceding-sibling'
      break;
    case 213:                       // 'rename'
      shift(213);                   // 'rename'
      break;
    case 214:                       // 'replace'
      shift(214);                   // 'replace'
      break;
    case 215:                       // 'return'
      shift(215);                   // 'return'
      break;
    case 219:                       // 'satisfies'
      shift(219);                   // 'satisfies'
      break;
    case 224:                       // 'self'
      shift(224);                   // 'self'
      break;
    case 230:                       // 'some'
      shift(230);                   // 'some'
      break;
    case 231:                       // 'stable'
      shift(231);                   // 'stable'
      break;
    case 232:                       // 'start'
      shift(232);                   // 'start'
      break;
    case 243:                       // 'to'
      shift(243);                   // 'to'
      break;
    case 244:                       // 'treat'
      shift(244);                   // 'treat'
      break;
    case 245:                       // 'try'
      shift(245);                   // 'try'
      break;
    case 249:                       // 'union'
      shift(249);                   // 'union'
      break;
    case 251:                       // 'unordered'
      shift(251);                   // 'unordered'
      break;
    case 255:                       // 'validate'
      shift(255);                   // 'validate'
      break;
    case 261:                       // 'where'
      shift(261);                   // 'where'
      break;
    case 265:                       // 'with'
      shift(265);                   // 'with'
      break;
    case 269:                       // 'xquery'
      shift(269);                   // 'xquery'
      break;
    case 67:                        // 'allowing'
      shift(67);                    // 'allowing'
      break;
    case 76:                        // 'at'
      shift(76);                    // 'at'
      break;
    case 78:                        // 'base-uri'
      shift(78);                    // 'base-uri'
      break;
    case 80:                        // 'boundary-space'
      shift(80);                    // 'boundary-space'
      break;
    case 81:                        // 'break'
      shift(81);                    // 'break'
      break;
    case 86:                        // 'catch'
      shift(86);                    // 'catch'
      break;
    case 93:                        // 'construction'
      shift(93);                    // 'construction'
      break;
    case 96:                        // 'context'
      shift(96);                    // 'context'
      break;
    case 97:                        // 'continue'
      shift(97);                    // 'continue'
      break;
    case 99:                        // 'copy-namespaces'
      shift(99);                    // 'copy-namespaces'
      break;
    case 101:                       // 'decimal-format'
      shift(101);                   // 'decimal-format'
      break;
    case 120:                       // 'encoding'
      shift(120);                   // 'encoding'
      break;
    case 127:                       // 'exit'
      shift(127);                   // 'exit'
      break;
    case 128:                       // 'external'
      shift(128);                   // 'external'
      break;
    case 136:                       // 'ft-option'
      shift(136);                   // 'ft-option'
      break;
    case 149:                       // 'in'
      shift(149);                   // 'in'
      break;
    case 150:                       // 'index'
      shift(150);                   // 'index'
      break;
    case 156:                       // 'integrity'
      shift(156);                   // 'integrity'
      break;
    case 166:                       // 'lax'
      shift(166);                   // 'lax'
      break;
    case 187:                       // 'nodes'
      shift(187);                   // 'nodes'
      break;
    case 194:                       // 'option'
      shift(194);                   // 'option'
      break;
    case 198:                       // 'ordering'
      shift(198);                   // 'ordering'
      break;
    case 217:                       // 'revalidation'
      shift(217);                   // 'revalidation'
      break;
    case 220:                       // 'schema'
      shift(220);                   // 'schema'
      break;
    case 223:                       // 'score'
      shift(223);                   // 'score'
      break;
    case 229:                       // 'sliding'
      shift(229);                   // 'sliding'
      break;
    case 235:                       // 'strict'
      shift(235);                   // 'strict'
      break;
    case 246:                       // 'tumbling'
      shift(246);                   // 'tumbling'
      break;
    case 247:                       // 'type'
      shift(247);                   // 'type'
      break;
    case 252:                       // 'updating'
      shift(252);                   // 'updating'
      break;
    case 256:                       // 'value'
      shift(256);                   // 'value'
      break;
    case 257:                       // 'variable'
      shift(257);                   // 'variable'
      break;
    case 258:                       // 'version'
      shift(258);                   // 'version'
      break;
    case 262:                       // 'while'
      shift(262);                   // 'while'
      break;
    case 92:                        // 'constraint'
      shift(92);                    // 'constraint'
      break;
    case 171:                       // 'loop'
      shift(171);                   // 'loop'
      break;
    default:
      shift(216);                   // 'returning'
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
    case 65:                        // 'after'
      shift(65);                    // 'after'
      break;
    case 70:                        // 'and'
      shift(70);                    // 'and'
      break;
    case 74:                        // 'as'
      shift(74);                    // 'as'
      break;
    case 75:                        // 'ascending'
      shift(75);                    // 'ascending'
      break;
    case 79:                        // 'before'
      shift(79);                    // 'before'
      break;
    case 83:                        // 'case'
      shift(83);                    // 'case'
      break;
    case 84:                        // 'cast'
      shift(84);                    // 'cast'
      break;
    case 85:                        // 'castable'
      shift(85);                    // 'castable'
      break;
    case 89:                        // 'collation'
      shift(89);                    // 'collation'
      break;
    case 100:                       // 'count'
      shift(100);                   // 'count'
      break;
    case 104:                       // 'default'
      shift(104);                   // 'default'
      break;
    case 108:                       // 'descending'
      shift(108);                   // 'descending'
      break;
    case 113:                       // 'div'
      shift(113);                   // 'div'
      break;
    case 117:                       // 'else'
      shift(117);                   // 'else'
      break;
    case 118:                       // 'empty'
      shift(118);                   // 'empty'
      break;
    case 121:                       // 'end'
      shift(121);                   // 'end'
      break;
    case 123:                       // 'eq'
      shift(123);                   // 'eq'
      break;
    case 126:                       // 'except'
      shift(126);                   // 'except'
      break;
    case 132:                       // 'for'
      shift(132);                   // 'for'
      break;
    case 141:                       // 'ge'
      shift(141);                   // 'ge'
      break;
    case 143:                       // 'group'
      shift(143);                   // 'group'
      break;
    case 145:                       // 'gt'
      shift(145);                   // 'gt'
      break;
    case 146:                       // 'idiv'
      shift(146);                   // 'idiv'
      break;
    case 155:                       // 'instance'
      shift(155);                   // 'instance'
      break;
    case 157:                       // 'intersect'
      shift(157);                   // 'intersect'
      break;
    case 158:                       // 'into'
      shift(158);                   // 'into'
      break;
    case 159:                       // 'is'
      shift(159);                   // 'is'
      break;
    case 167:                       // 'le'
      shift(167);                   // 'le'
      break;
    case 169:                       // 'let'
      shift(169);                   // 'let'
      break;
    case 173:                       // 'lt'
      shift(173);                   // 'lt'
      break;
    case 175:                       // 'mod'
      shift(175);                   // 'mod'
      break;
    case 176:                       // 'modify'
      shift(176);                   // 'modify'
      break;
    case 181:                       // 'ne'
      shift(181);                   // 'ne'
      break;
    case 193:                       // 'only'
      shift(193);                   // 'only'
      break;
    case 195:                       // 'or'
      shift(195);                   // 'or'
      break;
    case 196:                       // 'order'
      shift(196);                   // 'order'
      break;
    case 215:                       // 'return'
      shift(215);                   // 'return'
      break;
    case 219:                       // 'satisfies'
      shift(219);                   // 'satisfies'
      break;
    case 231:                       // 'stable'
      shift(231);                   // 'stable'
      break;
    case 232:                       // 'start'
      shift(232);                   // 'start'
      break;
    case 243:                       // 'to'
      shift(243);                   // 'to'
      break;
    case 244:                       // 'treat'
      shift(244);                   // 'treat'
      break;
    case 249:                       // 'union'
      shift(249);                   // 'union'
      break;
    case 261:                       // 'where'
      shift(261);                   // 'where'
      break;
    case 265:                       // 'with'
      shift(265);                   // 'with'
      break;
    case 68:                        // 'ancestor'
      shift(68);                    // 'ancestor'
      break;
    case 69:                        // 'ancestor-or-self'
      shift(69);                    // 'ancestor-or-self'
      break;
    case 77:                        // 'attribute'
      shift(77);                    // 'attribute'
      break;
    case 88:                        // 'child'
      shift(88);                    // 'child'
      break;
    case 91:                        // 'comment'
      shift(91);                    // 'comment'
      break;
    case 98:                        // 'copy'
      shift(98);                    // 'copy'
      break;
    case 103:                       // 'declare'
      shift(103);                   // 'declare'
      break;
    case 105:                       // 'delete'
      shift(105);                   // 'delete'
      break;
    case 106:                       // 'descendant'
      shift(106);                   // 'descendant'
      break;
    case 107:                       // 'descendant-or-self'
      shift(107);                   // 'descendant-or-self'
      break;
    case 114:                       // 'document'
      shift(114);                   // 'document'
      break;
    case 115:                       // 'document-node'
      shift(115);                   // 'document-node'
      break;
    case 116:                       // 'element'
      shift(116);                   // 'element'
      break;
    case 119:                       // 'empty-sequence'
      shift(119);                   // 'empty-sequence'
      break;
    case 124:                       // 'every'
      shift(124);                   // 'every'
      break;
    case 129:                       // 'first'
      shift(129);                   // 'first'
      break;
    case 130:                       // 'following'
      shift(130);                   // 'following'
      break;
    case 131:                       // 'following-sibling'
      shift(131);                   // 'following-sibling'
      break;
    case 140:                       // 'function'
      shift(140);                   // 'function'
      break;
    case 147:                       // 'if'
      shift(147);                   // 'if'
      break;
    case 148:                       // 'import'
      shift(148);                   // 'import'
      break;
    case 154:                       // 'insert'
      shift(154);                   // 'insert'
      break;
    case 160:                       // 'item'
      shift(160);                   // 'item'
      break;
    case 165:                       // 'last'
      shift(165);                   // 'last'
      break;
    case 177:                       // 'module'
      shift(177);                   // 'module'
      break;
    case 179:                       // 'namespace'
      shift(179);                   // 'namespace'
      break;
    case 180:                       // 'namespace-node'
      shift(180);                   // 'namespace-node'
      break;
    case 186:                       // 'node'
      shift(186);                   // 'node'
      break;
    case 197:                       // 'ordered'
      shift(197);                   // 'ordered'
      break;
    case 201:                       // 'parent'
      shift(201);                   // 'parent'
      break;
    case 207:                       // 'preceding'
      shift(207);                   // 'preceding'
      break;
    case 208:                       // 'preceding-sibling'
      shift(208);                   // 'preceding-sibling'
      break;
    case 211:                       // 'processing-instruction'
      shift(211);                   // 'processing-instruction'
      break;
    case 213:                       // 'rename'
      shift(213);                   // 'rename'
      break;
    case 214:                       // 'replace'
      shift(214);                   // 'replace'
      break;
    case 221:                       // 'schema-attribute'
      shift(221);                   // 'schema-attribute'
      break;
    case 222:                       // 'schema-element'
      shift(222);                   // 'schema-element'
      break;
    case 224:                       // 'self'
      shift(224);                   // 'self'
      break;
    case 230:                       // 'some'
      shift(230);                   // 'some'
      break;
    case 238:                       // 'switch'
      shift(238);                   // 'switch'
      break;
    case 239:                       // 'text'
      shift(239);                   // 'text'
      break;
    case 245:                       // 'try'
      shift(245);                   // 'try'
      break;
    case 248:                       // 'typeswitch'
      shift(248);                   // 'typeswitch'
      break;
    case 251:                       // 'unordered'
      shift(251);                   // 'unordered'
      break;
    case 255:                       // 'validate'
      shift(255);                   // 'validate'
      break;
    case 257:                       // 'variable'
      shift(257);                   // 'variable'
      break;
    case 269:                       // 'xquery'
      shift(269);                   // 'xquery'
      break;
    case 67:                        // 'allowing'
      shift(67);                    // 'allowing'
      break;
    case 76:                        // 'at'
      shift(76);                    // 'at'
      break;
    case 78:                        // 'base-uri'
      shift(78);                    // 'base-uri'
      break;
    case 80:                        // 'boundary-space'
      shift(80);                    // 'boundary-space'
      break;
    case 81:                        // 'break'
      shift(81);                    // 'break'
      break;
    case 86:                        // 'catch'
      shift(86);                    // 'catch'
      break;
    case 93:                        // 'construction'
      shift(93);                    // 'construction'
      break;
    case 96:                        // 'context'
      shift(96);                    // 'context'
      break;
    case 97:                        // 'continue'
      shift(97);                    // 'continue'
      break;
    case 99:                        // 'copy-namespaces'
      shift(99);                    // 'copy-namespaces'
      break;
    case 101:                       // 'decimal-format'
      shift(101);                   // 'decimal-format'
      break;
    case 120:                       // 'encoding'
      shift(120);                   // 'encoding'
      break;
    case 127:                       // 'exit'
      shift(127);                   // 'exit'
      break;
    case 128:                       // 'external'
      shift(128);                   // 'external'
      break;
    case 136:                       // 'ft-option'
      shift(136);                   // 'ft-option'
      break;
    case 149:                       // 'in'
      shift(149);                   // 'in'
      break;
    case 150:                       // 'index'
      shift(150);                   // 'index'
      break;
    case 156:                       // 'integrity'
      shift(156);                   // 'integrity'
      break;
    case 166:                       // 'lax'
      shift(166);                   // 'lax'
      break;
    case 187:                       // 'nodes'
      shift(187);                   // 'nodes'
      break;
    case 194:                       // 'option'
      shift(194);                   // 'option'
      break;
    case 198:                       // 'ordering'
      shift(198);                   // 'ordering'
      break;
    case 217:                       // 'revalidation'
      shift(217);                   // 'revalidation'
      break;
    case 220:                       // 'schema'
      shift(220);                   // 'schema'
      break;
    case 223:                       // 'score'
      shift(223);                   // 'score'
      break;
    case 229:                       // 'sliding'
      shift(229);                   // 'sliding'
      break;
    case 235:                       // 'strict'
      shift(235);                   // 'strict'
      break;
    case 246:                       // 'tumbling'
      shift(246);                   // 'tumbling'
      break;
    case 247:                       // 'type'
      shift(247);                   // 'type'
      break;
    case 252:                       // 'updating'
      shift(252);                   // 'updating'
      break;
    case 256:                       // 'value'
      shift(256);                   // 'value'
      break;
    case 258:                       // 'version'
      shift(258);                   // 'version'
      break;
    case 262:                       // 'while'
      shift(262);                   // 'while'
      break;
    case 92:                        // 'constraint'
      shift(92);                    // 'constraint'
      break;
    case 171:                       // 'loop'
      shift(171);                   // 'loop'
      break;
    default:
      shift(216);                   // 'returning'
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
  for (var i = 0; i < 276; i += 32)
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
  /*     0 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*    15 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*    30 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*    45 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*    60 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*    75 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*    90 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   105 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   120 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   135 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   150 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   165 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   180 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   195 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   210 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   225 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   240 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   255 */ 17590, 22874, 18847, 17152, 19027, 19252, 17687, 19027, 17173, 30771, 36436, 17330, 17349, 18940, 17189,
  /*   270 */ 17208, 17281, 17675, 17991, 17308, 17327, 17346, 18937, 17365, 21855, 18660, 18676, 19025, 17265, 22008,
  /*   285 */ 17292, 17421, 21157, 17192, 21217, 21848, 17311, 18669, 19018, 19027, 17447, 17470, 17497, 17520, 17251,
  /*   300 */ 36410, 17824, 20322, 20663, 20490, 17543, 17559, 17585, 21862, 17504, 17527, 17258, 36417, 18199, 21915,
  /*   315 */ 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730, 17772, 33538, 21921, 17617, 36472, 18265, 36530,
  /*   330 */ 17477, 19171, 17902, 17934, 17744, 17795, 17874, 17590, 21595, 17481, 17890, 17922, 18742, 17960, 36550,
  /*   345 */ 17714, 17976, 18021, 18738, 18065, 36544, 18632, 18081, 18098, 18114, 18159, 18185, 18215, 18094, 18251,
  /*   360 */ 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849, 36402, 19251, 17838, 17163, 30650, 18400, 17858,
  /*   375 */ 32918, 17756, 18816, 18429, 18445, 18143, 17393, 18500, 18516, 18546, 17590, 17590, 17590, 17590, 17590,
  /*   390 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   405 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   420 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   435 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   450 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   465 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   480 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   495 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   510 */ 17590, 17590, 18590, 21686, 17152, 19027, 19252, 17687, 19027, 28677, 30771, 36436, 17330, 17349, 18940,
  /*   525 */ 17189, 17208, 17281, 17675, 17991, 17308, 17327, 17346, 18937, 17365, 21855, 18660, 18676, 19025, 17265,
  /*   540 */ 22008, 17292, 17421, 21157, 17192, 21217, 21848, 17311, 18669, 19018, 19027, 17447, 17470, 17497, 17520,
  /*   555 */ 17251, 36410, 17824, 20322, 20663, 20490, 17543, 17559, 17585, 21862, 17504, 17527, 17258, 36417, 18199,
  /*   570 */ 21915, 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730, 17772, 33538, 21921, 17617, 36472, 18265,
  /*   585 */ 36530, 17477, 19171, 17902, 17934, 17744, 17795, 17874, 17590, 21595, 17481, 17890, 17922, 18742, 17960,
  /*   600 */ 36550, 17714, 17976, 18021, 18738, 18065, 36544, 18632, 18081, 18098, 18114, 18159, 18185, 18215, 18094,
  /*   615 */ 18251, 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849, 36402, 19251, 17838, 17163, 30650, 18400,
  /*   630 */ 17858, 32918, 17756, 18816, 18429, 18445, 18143, 17393, 18500, 18516, 18546, 17590, 17590, 17590, 17590,
  /*   645 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   660 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   675 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   690 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   705 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   720 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   735 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   750 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   765 */ 17590, 17590, 17590, 20083, 18847, 18648, 19027, 19252, 21242, 19027, 17173, 30771, 36436, 17330, 17349,
  /*   780 */ 18940, 17189, 17208, 17281, 17675, 17991, 17308, 17327, 17346, 18937, 18460, 21855, 18660, 18676, 19025,
  /*   795 */ 17265, 22008, 17292, 17421, 21157, 17192, 21217, 21848, 17311, 18669, 19018, 19027, 17447, 32909, 17497,
  /*   810 */ 17520, 17251, 36410, 17824, 20322, 20663, 20490, 17543, 17559, 17585, 21862, 17504, 17527, 17258, 36417,
  /*   825 */ 21890, 21915, 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730, 17772, 33538, 21921, 17617, 36472,
  /*   840 */ 18265, 36530, 17477, 19171, 17902, 17934, 17744, 17795, 17874, 17590, 21595, 17481, 19175, 17906, 18742,
  /*   855 */ 17960, 36550, 17714, 17976, 18021, 18738, 18692, 18413, 18632, 18081, 18098, 18114, 18159, 18185, 18717,
  /*   870 */ 18094, 18251, 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849, 36402, 19251, 17838, 17163, 30650,
  /*   885 */ 18400, 17858, 32918, 17645, 18816, 18429, 18445, 18530, 17393, 18758, 18516, 18546, 17590, 17590, 17590,
  /*   900 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   915 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   930 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   945 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   960 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   975 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*   990 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1005 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1020 */ 17590, 17590, 17590, 17590, 18774, 18789, 18805, 19027, 19252, 17687, 19027, 17173, 30771, 36436, 17330,
  /*  1035 */ 17349, 18940, 17189, 17208, 17281, 17675, 17991, 17308, 17327, 17346, 18937, 18460, 21855, 18660, 18676,
  /*  1050 */ 19025, 17265, 22008, 17292, 17421, 21157, 17192, 21217, 21848, 17311, 18669, 19018, 19027, 17447, 32909,
  /*  1065 */ 17497, 17520, 17251, 36410, 17824, 20322, 20663, 20490, 17543, 17559, 17585, 21862, 17504, 17527, 17258,
  /*  1080 */ 36417, 21890, 21915, 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730, 17772, 33538, 21921, 17617,
  /*  1095 */ 36472, 18265, 36530, 17477, 19171, 17902, 17934, 17744, 17795, 17874, 17590, 21595, 17481, 19175, 17906,
  /*  1110 */ 18742, 17960, 36550, 17714, 17976, 18021, 18738, 18692, 18413, 18632, 18081, 18098, 18114, 18159, 18185,
  /*  1125 */ 18717, 18094, 18251, 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849, 36402, 19251, 17838, 17163,
  /*  1140 */ 30650, 18400, 17858, 32918, 17645, 18816, 18429, 18445, 18530, 17393, 18758, 18516, 18546, 17590, 17590,
  /*  1155 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1170 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1185 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1200 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1215 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1230 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1245 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1260 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1275 */ 17590, 17590, 17590, 17590, 17590, 18832, 22889, 18925, 19027, 19252, 17569, 19027, 17173, 30771, 36436,
  /*  1290 */ 17330, 17349, 18940, 17189, 17208, 17281, 17675, 17991, 17308, 17327, 17346, 18937, 18956, 21855, 18660,
  /*  1305 */ 18676, 19025, 17265, 22008, 17292, 17421, 21157, 17192, 21217, 19073, 17311, 18669, 19018, 19027, 17447,
  /*  1320 */ 32909, 17497, 17520, 17251, 36410, 17824, 20322, 20663, 20490, 17543, 17559, 18972, 21862, 17504, 17527,
  /*  1335 */ 17258, 36417, 21890, 21915, 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730, 17772, 33538, 21921,
  /*  1350 */ 17617, 36472, 18265, 36530, 17477, 19171, 17902, 17934, 17744, 17795, 17874, 17590, 21595, 17481, 19175,
  /*  1365 */ 17906, 18742, 17960, 36550, 17714, 17976, 18021, 18738, 18692, 18413, 18632, 18081, 18098, 18114, 18159,
  /*  1380 */ 18185, 18717, 18094, 18251, 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849, 36402, 19251, 17838,
  /*  1395 */ 17163, 30650, 18400, 17858, 32918, 17645, 18816, 18429, 18445, 18530, 17393, 18758, 18516, 18546, 17590,
  /*  1410 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1425 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1440 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1455 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1470 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1485 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1500 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1515 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1530 */ 17590, 17590, 17590, 17590, 17590, 17590, 21818, 18847, 19006, 19027, 19252, 17687, 19027, 17173, 30771,
  /*  1545 */ 36436, 17330, 17349, 18940, 17189, 17208, 17281, 17675, 17991, 17308, 17327, 17346, 18937, 18460, 21855,
  /*  1560 */ 18660, 18676, 19025, 17265, 22008, 17292, 17421, 21157, 17192, 21217, 21848, 17311, 18669, 19018, 19027,
  /*  1575 */ 17447, 32909, 17497, 17520, 17251, 36410, 17824, 20322, 20663, 20490, 17543, 17559, 17585, 21862, 17504,
  /*  1590 */ 17527, 17258, 36417, 21890, 21915, 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730, 17772, 33538,
  /*  1605 */ 21921, 17617, 36472, 18265, 36530, 17477, 19171, 17902, 17934, 17744, 17795, 17874, 17590, 21595, 17481,
  /*  1620 */ 19175, 17906, 18742, 17960, 36550, 17714, 17976, 18021, 18738, 18692, 18413, 18632, 18081, 18098, 18114,
  /*  1635 */ 18159, 18185, 18717, 18094, 18251, 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849, 36402, 19251,
  /*  1650 */ 17838, 17163, 30650, 18400, 17858, 32918, 17645, 18816, 18429, 18445, 18530, 17393, 18758, 18516, 18546,
  /*  1665 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1680 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1695 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1710 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1725 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1740 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1755 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1770 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1785 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 21671, 18847, 19006, 19027, 19252, 17687, 19027, 17173,
  /*  1800 */ 30771, 36436, 17330, 17349, 18940, 17189, 17208, 17281, 17675, 17991, 17308, 17327, 17346, 18937, 18460,
  /*  1815 */ 21855, 18660, 18676, 19025, 17265, 22008, 17292, 17421, 21157, 17192, 21217, 21848, 17311, 18669, 19018,
  /*  1830 */ 19027, 17447, 32909, 17497, 17520, 17251, 36410, 17824, 20322, 20663, 20490, 17543, 17559, 17585, 21862,
  /*  1845 */ 17504, 17527, 17258, 36417, 21890, 21915, 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730, 17772,
  /*  1860 */ 33538, 21921, 17617, 36472, 18265, 36530, 17477, 19171, 17902, 17934, 17744, 17795, 17874, 17590, 21595,
  /*  1875 */ 17481, 19175, 17906, 18742, 17960, 36550, 17714, 17976, 18021, 18738, 18692, 18413, 18632, 18081, 18098,
  /*  1890 */ 18114, 18159, 18185, 18717, 18094, 18251, 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849, 36402,
  /*  1905 */ 19251, 17838, 17163, 30650, 18400, 17858, 32918, 17645, 18816, 18429, 18445, 18530, 17393, 18758, 18516,
  /*  1920 */ 18546, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1935 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1950 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1965 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1980 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  1995 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2010 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2025 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2040 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22395, 20098, 18731, 19027, 19252, 17687, 19027,
  /*  2055 */ 17173, 23525, 36436, 17330, 17349, 18940, 17189, 17208, 17281, 17675, 18129, 17308, 17327, 17346, 18937,
  /*  2070 */ 18460, 21855, 18660, 18676, 19025, 17265, 22008, 17292, 17421, 21157, 17192, 20746, 19130, 17311, 18669,
  /*  2085 */ 19018, 19027, 17447, 32909, 17497, 17520, 17251, 36410, 17824, 20322, 20663, 20490, 17543, 17559, 17585,
  /*  2100 */ 21862, 17504, 17527, 17258, 36417, 21890, 21915, 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730,
  /*  2115 */ 17772, 33538, 21921, 17617, 36472, 18265, 36530, 17477, 19171, 17902, 17934, 17744, 17795, 17874, 17590,
  /*  2130 */ 21595, 17481, 19175, 17906, 18742, 17960, 36550, 17714, 17976, 18021, 18738, 18692, 18413, 18632, 18081,
  /*  2145 */ 18098, 18114, 18159, 18185, 18717, 18094, 18251, 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849,
  /*  2160 */ 36402, 19251, 17838, 17163, 30650, 18400, 17858, 32918, 17645, 18816, 18429, 18445, 18530, 17393, 18758,
  /*  2175 */ 18516, 18546, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2190 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2205 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2220 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2235 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2250 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2265 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2280 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2295 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 19043, 18847, 18620, 19027, 19252, 17687,
  /*  2310 */ 19027, 17173, 30771, 36436, 17330, 17349, 18940, 17189, 17208, 17281, 17675, 17991, 17308, 17327, 17346,
  /*  2325 */ 18937, 18460, 21855, 18660, 18676, 19025, 17265, 22008, 17292, 17421, 21157, 17192, 21217, 21848, 17311,
  /*  2340 */ 18669, 19018, 19027, 17447, 32909, 17497, 17520, 17251, 36410, 17824, 20322, 20663, 20490, 17543, 17559,
  /*  2355 */ 17585, 21862, 17504, 17527, 17258, 36417, 21890, 21915, 17611, 36466, 18259, 17633, 17661, 18368, 17703,
  /*  2370 */ 17730, 17772, 33538, 21921, 17617, 36472, 18265, 36530, 17477, 19171, 17902, 17934, 17744, 17795, 17874,
  /*  2385 */ 17590, 21595, 17481, 19175, 17906, 18742, 17960, 36550, 17714, 17976, 18021, 18738, 18692, 18413, 18632,
  /*  2400 */ 18081, 18098, 18114, 18159, 18185, 18717, 18094, 18251, 18292, 18281, 18308, 18005, 18338, 18354, 18384,
  /*  2415 */ 17849, 36402, 19251, 17838, 17163, 30650, 18400, 17858, 32918, 17645, 18816, 18429, 18445, 18530, 17393,
  /*  2430 */ 18758, 18516, 18546, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2445 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2460 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2475 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2490 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2505 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2520 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2535 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2550 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 19100, 22410, 19006, 19027, 19252,
  /*  2565 */ 17687, 19027, 19084, 30771, 36436, 17330, 17349, 18940, 17189, 17208, 17281, 17675, 17991, 17308, 17327,
  /*  2580 */ 17346, 18937, 18460, 21855, 18660, 18676, 19025, 17265, 22008, 17292, 17421, 21157, 17192, 21217, 21848,
  /*  2595 */ 17311, 18669, 19018, 19027, 17447, 32909, 17497, 17520, 17251, 36410, 17824, 20322, 20663, 20490, 17543,
  /*  2610 */ 17559, 17585, 21862, 17504, 17527, 17258, 36417, 21890, 21915, 17611, 36466, 18259, 17633, 17661, 18368,
  /*  2625 */ 17703, 17730, 17772, 33538, 21921, 17617, 36472, 18265, 36530, 17477, 19171, 17902, 17934, 17744, 17795,
  /*  2640 */ 17874, 17590, 21595, 17481, 19175, 17906, 18742, 17960, 36550, 17714, 17976, 18021, 18738, 18692, 18413,
  /*  2655 */ 18632, 18081, 18098, 18114, 18159, 18185, 18717, 18094, 18251, 18292, 18281, 18308, 18005, 18338, 18354,
  /*  2670 */ 18384, 17849, 36402, 19251, 17838, 17163, 30650, 18400, 17858, 32918, 17645, 18816, 18429, 18445, 18530,
  /*  2685 */ 17393, 18758, 18516, 18546, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2700 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2715 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2730 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2745 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2760 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2775 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2790 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2805 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 21967, 21982, 19006, 19027,
  /*  2820 */ 19252, 17687, 19027, 18701, 30771, 36436, 17330, 17349, 18940, 17189, 17208, 17281, 17675, 17991, 17308,
  /*  2835 */ 17327, 17346, 18937, 18460, 21855, 18660, 18676, 19025, 17265, 22008, 17292, 17421, 21157, 17192, 21217,
  /*  2850 */ 21848, 17311, 18669, 19018, 19027, 17447, 32909, 17497, 17520, 17251, 36410, 17824, 20322, 20663, 20490,
  /*  2865 */ 17543, 17559, 17585, 21862, 17504, 17527, 17258, 36417, 21890, 21915, 17611, 36466, 18259, 17633, 17661,
  /*  2880 */ 18368, 17703, 17730, 17772, 33538, 21921, 17617, 36472, 18265, 36530, 17477, 19171, 17902, 17934, 17744,
  /*  2895 */ 17795, 17874, 17590, 21595, 17481, 19175, 17906, 18742, 17960, 36550, 17714, 17976, 18021, 18738, 18692,
  /*  2910 */ 18413, 18632, 18081, 18098, 18114, 18159, 18185, 18717, 18094, 18251, 18292, 18281, 18308, 18005, 18338,
  /*  2925 */ 18354, 18384, 17849, 36402, 19251, 17838, 17163, 30650, 18400, 17858, 32918, 17645, 18816, 18429, 18445,
  /*  2940 */ 18530, 17393, 18758, 18516, 18546, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2955 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2970 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  2985 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3000 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3015 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3030 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3045 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3060 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22380, 18847, 19006,
  /*  3075 */ 19027, 19252, 30659, 19027, 17173, 30771, 36436, 17330, 17349, 18940, 17189, 17208, 17281, 17675, 19157,
  /*  3090 */ 17308, 17327, 17346, 18937, 18460, 21855, 18660, 18676, 19025, 17265, 22008, 17292, 17421, 21157, 17192,
  /*  3105 */ 21217, 19299, 17311, 18669, 19018, 19027, 17447, 32909, 17497, 17520, 17251, 36410, 17824, 20322, 20663,
  /*  3120 */ 20490, 17543, 17559, 19191, 21862, 17504, 17527, 17258, 36417, 21890, 21915, 17611, 36466, 18259, 17633,
  /*  3135 */ 17661, 18368, 17703, 17730, 17772, 33538, 21921, 17617, 36472, 18265, 36530, 17477, 19171, 17902, 17934,
  /*  3150 */ 17744, 17795, 17874, 17590, 21595, 17481, 19175, 17906, 18742, 17960, 36550, 17714, 17976, 18021, 18738,
  /*  3165 */ 18692, 18413, 18632, 18081, 18098, 18114, 18159, 18185, 18717, 18094, 18251, 18292, 18281, 18308, 18005,
  /*  3180 */ 18338, 18354, 18384, 17849, 36402, 19251, 17838, 17163, 30650, 18400, 17858, 32918, 17645, 18816, 18429,
  /*  3195 */ 18445, 18530, 17393, 18758, 18516, 18546, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3210 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3225 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3240 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3255 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3270 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3285 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3300 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3315 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 21758, 18847,
  /*  3330 */ 19006, 19027, 19252, 17687, 19027, 17173, 30771, 36436, 17330, 17349, 18940, 17189, 17208, 17281, 17675,
  /*  3345 */ 19237, 17308, 17327, 17346, 18937, 18460, 21855, 18660, 18676, 19025, 17265, 22008, 17292, 17421, 21157,
  /*  3360 */ 17192, 21217, 21848, 17311, 18669, 19018, 19027, 17447, 32909, 17497, 17520, 17251, 36410, 17824, 20322,
  /*  3375 */ 20663, 20490, 17543, 17559, 17585, 21862, 17504, 17527, 17258, 36417, 21890, 21915, 17611, 36466, 18259,
  /*  3390 */ 17633, 17661, 18368, 17703, 17730, 17772, 33538, 21921, 17617, 36472, 18265, 36530, 17477, 19171, 17902,
  /*  3405 */ 17934, 17744, 17795, 17874, 17590, 21595, 17481, 19175, 17906, 18742, 17960, 36550, 17714, 17976, 18021,
  /*  3420 */ 18738, 18692, 18413, 18632, 18081, 18098, 18114, 18159, 18185, 18717, 18094, 18251, 18292, 18281, 18308,
  /*  3435 */ 18005, 18338, 18354, 18384, 17849, 36402, 19251, 17838, 17163, 30650, 18400, 17858, 32918, 17645, 18816,
  /*  3450 */ 18429, 18445, 18530, 17393, 18758, 18516, 18546, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3465 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3480 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3495 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3510 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3525 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3540 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3555 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3570 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 21626,
  /*  3585 */ 18847, 19006, 19027, 19252, 17687, 19027, 17173, 30771, 36436, 17330, 17349, 18940, 17189, 17208, 17281,
  /*  3600 */ 17675, 17991, 17308, 17327, 17346, 18937, 18460, 21855, 18660, 18676, 19025, 17265, 22008, 17292, 17421,
  /*  3615 */ 21157, 17192, 21217, 21848, 17311, 18669, 19018, 19027, 17447, 32909, 17497, 17520, 17251, 36410, 17824,
  /*  3630 */ 20322, 20663, 20490, 17543, 17559, 17585, 21862, 17504, 17527, 17258, 36417, 21890, 21915, 17611, 36466,
  /*  3645 */ 18259, 17633, 17661, 18368, 17703, 17730, 17772, 33538, 21921, 17617, 36472, 18265, 36530, 17477, 19171,
  /*  3660 */ 17902, 17934, 17744, 17795, 17874, 17590, 21595, 17481, 19175, 17906, 18742, 17960, 36550, 17714, 17976,
  /*  3675 */ 18021, 18738, 18692, 18413, 18632, 18081, 18098, 18114, 18159, 18185, 18717, 18094, 18251, 18292, 18281,
  /*  3690 */ 18308, 18005, 18338, 18354, 18384, 17849, 36402, 19251, 17838, 17163, 30650, 18400, 17858, 32918, 17645,
  /*  3705 */ 18816, 18429, 18445, 18530, 17393, 18758, 18516, 18546, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3720 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3735 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3750 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3765 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3780 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3795 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3810 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3825 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3840 */ 19268, 19284, 19326, 18482, 27869, 30509, 24384, 31417, 23323, 18482, 19370, 18482, 18484, 27202, 19389,
  /*  3855 */ 27202, 27202, 19411, 24384, 34295, 24384, 24384, 25485, 18482, 18482, 18482, 18482, 18482, 25794, 27202,
  /*  3870 */ 27202, 27202, 27202, 28530, 19459, 24384, 24384, 24384, 24384, 24017, 18036, 24041, 18482, 18482, 18482,
  /*  3885 */ 18484, 19487, 27202, 27202, 27202, 27202, 19503, 35523, 19539, 24384, 24384, 24384, 19647, 18482, 35623,
  /*  3900 */ 18482, 18482, 23052, 27202, 19557, 27202, 27202, 30764, 23993, 24384, 19579, 24384, 24384, 26758, 18482,
  /*  3915 */ 18482, 19346, 27867, 27202, 27202, 19599, 17590, 23998, 24384, 24384, 19619, 25683, 18482, 18482, 28511,
  /*  3930 */ 27202, 27203, 23997, 19639, 19887, 28419, 18902, 18483, 19663, 27202, 24325, 35844, 19887, 30991, 19713,
  /*  3945 */ 19395, 19736, 22259, 19754, 22073, 19770, 35154, 19795, 19816, 19836, 19859, 25794, 34248, 24116, 19720,
  /*  3960 */ 19875, 30988, 23482, 30981, 28304, 19438, 27956, 19678, 27944, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3975 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  3990 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4005 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4020 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4035 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4050 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4065 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4080 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4095 */ 17590, 21743, 18847, 19006, 19027, 19252, 17431, 19027, 17173, 30771, 36436, 17330, 17349, 18940, 17189,
  /*  4110 */ 17208, 17281, 17675, 17991, 17308, 17327, 17346, 18937, 18460, 21855, 18660, 18676, 19025, 17265, 22008,
  /*  4125 */ 17292, 17421, 21157, 17192, 21217, 21848, 17311, 18669, 19018, 19027, 17447, 32909, 17497, 17520, 17251,
  /*  4140 */ 36410, 17824, 20322, 20663, 20490, 17543, 17559, 17585, 21862, 17504, 17527, 17258, 36417, 21890, 21915,
  /*  4155 */ 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730, 17772, 33538, 21921, 17617, 36472, 18265, 36530,
  /*  4170 */ 17477, 19171, 17902, 17934, 17744, 17795, 17874, 17590, 21595, 17481, 19175, 17906, 18742, 17960, 36550,
  /*  4185 */ 17714, 17976, 18021, 18738, 18692, 18413, 18632, 18081, 18098, 18114, 18159, 18185, 18717, 18094, 18251,
  /*  4200 */ 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849, 36402, 19251, 17838, 17163, 30650, 18400, 17858,
  /*  4215 */ 32918, 17645, 18816, 18429, 18445, 18530, 17393, 18758, 18516, 18546, 17590, 17590, 17590, 17590, 17590,
  /*  4230 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4245 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4260 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4275 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4290 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4305 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4320 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4335 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4350 */ 17590, 17590, 22365, 18847, 19907, 19027, 19252, 17687, 19027, 17173, 30771, 36436, 17330, 17349, 18940,
  /*  4365 */ 17189, 17208, 17281, 17675, 17991, 17308, 17327, 17346, 18937, 18460, 21855, 18660, 18676, 19025, 17265,
  /*  4380 */ 22008, 17292, 17421, 21157, 17192, 21217, 21848, 17311, 18669, 19018, 19027, 17447, 32909, 17497, 17520,
  /*  4395 */ 17251, 36410, 17824, 20322, 20663, 20490, 17543, 17559, 17585, 21862, 17504, 17527, 17258, 36417, 21890,
  /*  4410 */ 21915, 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730, 17772, 33538, 21921, 17617, 36472, 18265,
  /*  4425 */ 36530, 17477, 19171, 17902, 17934, 17744, 17795, 17874, 17590, 21595, 17481, 19175, 17906, 18742, 17960,
  /*  4440 */ 36550, 17714, 17976, 18021, 18738, 18692, 18413, 18632, 18081, 18098, 18114, 18159, 18185, 18717, 18094,
  /*  4455 */ 18251, 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849, 36402, 19251, 17838, 17163, 30650, 18400,
  /*  4470 */ 17858, 32918, 17645, 18816, 18429, 18445, 18530, 17393, 18758, 18516, 18546, 17590, 17590, 17590, 17590,
  /*  4485 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4500 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4515 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4530 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4545 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4560 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4575 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4590 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4605 */ 17590, 17590, 17590, 21641, 18847, 19326, 18482, 27869, 30544, 24384, 29176, 21442, 18482, 18482, 18482,
  /*  4620 */ 18484, 27202, 27202, 27202, 27202, 19935, 24384, 24384, 24384, 24384, 32316, 18482, 18482, 18482, 18482,
  /*  4635 */ 18482, 25794, 27202, 27202, 27202, 27202, 28530, 19965, 24384, 24384, 24384, 24384, 31473, 18475, 18482,
  /*  4650 */ 18482, 18482, 18482, 18484, 27202, 27202, 27202, 27202, 27202, 19988, 24384, 24384, 24384, 24384, 24384,
  /*  4665 */ 33654, 18482, 18482, 18482, 18482, 23052, 27202, 27202, 27202, 27202, 29523, 29939, 24384, 24384, 24384,
  /*  4680 */ 24384, 26114, 18482, 18482, 18482, 27867, 27202, 27202, 27202, 20017, 22934, 24384, 24384, 24384, 18481,
  /*  4695 */ 18482, 18482, 27202, 27202, 35771, 20047, 24385, 19887, 25677, 18482, 18483, 27202, 27202, 19738, 23870,
  /*  4710 */ 19887, 30991, 18484, 27202, 31802, 19425, 19466, 23052, 23296, 19847, 30990, 27868, 34251, 19859, 25794,
  /*  4725 */ 34248, 19856, 25793, 19779, 30988, 23482, 30981, 22080, 19438, 27956, 19678, 27944, 17590, 17590, 17590,
  /*  4740 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4755 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4770 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4785 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4800 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4815 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4830 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4845 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  4860 */ 17590, 17590, 17590, 17590, 20068, 19058, 20158, 20367, 20884, 17944, 20276, 20853, 25651, 20604, 20460,
  /*  4875 */ 20185, 20209, 17189, 17208, 17281, 17675, 20232, 20273, 20295, 20338, 22456, 20777, 20600, 21329, 20635,
  /*  4890 */ 20365, 20937, 21207, 17292, 17421, 21157, 17192, 21217, 22425, 20279, 25549, 22436, 20276, 20383, 18983,
  /*  4905 */ 20421, 20446, 21317, 21051, 20476, 20322, 20663, 20490, 17543, 17559, 17585, 22463, 20540, 19523, 20246,
  /*  4920 */ 20556, 20257, 20430, 20585, 20620, 20193, 20651, 17661, 18368, 17703, 17730, 17772, 19513, 20679, 20692,
  /*  4935 */ 22446, 21027, 21097, 18990, 21111, 20708, 20736, 17744, 17795, 17874, 17590, 25536, 20349, 20762, 20812,
  /*  4950 */ 20169, 20828, 21376, 17714, 17976, 18021, 18560, 20844, 20569, 25560, 20869, 20900, 18114, 18159, 20916,
  /*  4965 */ 20953, 21013, 21043, 21067, 18281, 21083, 18574, 21127, 21143, 21181, 20515, 20930, 20883, 20504, 21197,
  /*  4980 */ 21233, 21258, 20524, 20216, 17405, 21270, 21286, 21302, 20720, 20310, 21345, 21361, 21392, 17590, 17590,
  /*  4995 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5010 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5025 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5040 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5055 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5070 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5085 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5100 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5115 */ 17590, 17590, 17590, 17590, 17590, 21952, 18847, 19006, 19027, 19252, 17687, 19027, 17173, 30771, 36436,
  /*  5130 */ 17330, 17349, 18940, 17189, 17208, 17281, 17675, 17991, 17308, 17327, 17346, 18937, 21427, 21855, 18660,
  /*  5145 */ 18676, 19025, 17265, 22008, 17292, 17421, 21157, 17192, 21217, 21848, 17311, 18669, 19018, 19027, 21479,
  /*  5160 */ 32909, 17497, 17520, 17251, 36410, 17824, 20322, 20663, 20490, 17543, 17559, 17585, 21862, 17504, 17527,
  /*  5175 */ 17258, 36417, 36500, 21915, 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730, 17772, 28667, 21921,
  /*  5190 */ 17617, 36472, 18265, 17237, 17477, 19171, 17902, 17934, 17744, 17795, 17874, 21550, 21509, 17481, 19175,
  /*  5205 */ 17906, 18742, 17960, 36550, 17714, 17976, 21535, 30636, 18692, 18413, 18632, 18081, 18098, 18114, 18159,
  /*  5220 */ 18185, 18717, 18094, 18251, 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849, 36402, 19251, 17838,
  /*  5235 */ 17163, 30650, 18400, 17858, 32918, 17645, 18816, 18429, 18445, 18530, 17393, 18758, 18516, 18546, 17590,
  /*  5250 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5265 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5280 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5295 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5310 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5325 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5340 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5355 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5370 */ 17590, 17590, 17590, 17590, 17590, 17590, 21773, 18847, 21587, 19027, 19252, 17687, 19027, 17173, 30771,
  /*  5385 */ 36436, 17330, 17349, 18940, 17189, 17208, 17281, 17675, 17991, 17308, 17327, 17346, 18937, 18460, 21855,
  /*  5400 */ 18660, 18676, 19025, 17265, 22008, 17292, 17421, 21157, 17192, 21217, 21848, 17311, 18669, 19018, 19027,
  /*  5415 */ 17447, 32909, 17497, 17520, 17251, 36410, 17824, 20322, 20663, 20490, 17543, 17559, 17585, 21862, 17504,
  /*  5430 */ 17527, 17258, 36417, 21890, 21915, 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730, 17772, 33538,
  /*  5445 */ 21921, 17617, 36472, 18265, 36530, 17477, 19171, 17902, 17934, 17744, 17795, 17874, 17590, 21595, 17481,
  /*  5460 */ 19175, 17906, 18742, 17960, 36550, 17714, 17976, 18021, 18738, 18692, 18413, 18632, 18081, 18098, 18114,
  /*  5475 */ 18159, 18185, 18717, 18094, 18251, 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849, 36402, 19251,
  /*  5490 */ 17838, 17163, 30650, 18400, 17858, 32918, 17645, 18816, 18429, 18445, 18530, 17393, 18758, 18516, 18546,
  /*  5505 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5520 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5535 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5550 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5565 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5580 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5595 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5610 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5625 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 21611, 18847, 19006, 19027, 19252, 18169, 19027, 17173,
  /*  5640 */ 30771, 36436, 17330, 17349, 18940, 17189, 17208, 17281, 17675, 17991, 17308, 17327, 17346, 18937, 18460,
  /*  5655 */ 21855, 18660, 18676, 19025, 17265, 22008, 17292, 17421, 21157, 17192, 21217, 21848, 17311, 18669, 19018,
  /*  5670 */ 19027, 17447, 32909, 17497, 17520, 17251, 36410, 17824, 20322, 20663, 20490, 17543, 17559, 17585, 21862,
  /*  5685 */ 17504, 17527, 17258, 36417, 21890, 21915, 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730, 17772,
  /*  5700 */ 33538, 21921, 17617, 36472, 18265, 36530, 17477, 19171, 17902, 17934, 17744, 17795, 17874, 17590, 21595,
  /*  5715 */ 17481, 19175, 17906, 18742, 17960, 36550, 17714, 17976, 18021, 18738, 18692, 18413, 18632, 18081, 18098,
  /*  5730 */ 18114, 18159, 18185, 18717, 18094, 18251, 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849, 36402,
  /*  5745 */ 19251, 17838, 17163, 30650, 18400, 17858, 32918, 17645, 18816, 18429, 18445, 18530, 17393, 18758, 18516,
  /*  5760 */ 18546, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5775 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5790 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5805 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5820 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5835 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5850 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5865 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  5880 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 21728, 19115, 21878, 19027, 19252, 17687, 19027,
  /*  5895 */ 19310, 30771, 36436, 17330, 17349, 18940, 17189, 17208, 17281, 17675, 17991, 17308, 17327, 17346, 18937,
  /*  5910 */ 17379, 21855, 18660, 18676, 19025, 17265, 22008, 17292, 17421, 21157, 17192, 21217, 21848, 17311, 18669,
  /*  5925 */ 19018, 19027, 17447, 21906, 17497, 17520, 17251, 36410, 17824, 20322, 20663, 20490, 17543, 17559, 17585,
  /*  5940 */ 21862, 17504, 17527, 17258, 36417, 18322, 21915, 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730,
  /*  5955 */ 17772, 33538, 21921, 17617, 36472, 18265, 36530, 17477, 19171, 17902, 17934, 17744, 17795, 17874, 17590,
  /*  5970 */ 21595, 17481, 19175, 17906, 18742, 17960, 36550, 17714, 17976, 18021, 18738, 18692, 18413, 18632, 18081,
  /*  5985 */ 18098, 18114, 18159, 18185, 18717, 18094, 18251, 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849,
  /*  6000 */ 36402, 19251, 17838, 17163, 30650, 18400, 17858, 32918, 17645, 18816, 18429, 18445, 18530, 17393, 18758,
  /*  6015 */ 18516, 18546, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6030 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6045 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6060 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6075 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6090 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6105 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6120 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6135 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 21937, 18605, 19006, 19027, 19252, 22018,
  /*  6150 */ 19027, 17173, 30771, 36436, 17330, 17349, 18940, 17189, 17208, 17281, 17675, 17991, 17308, 17327, 17346,
  /*  6165 */ 18937, 18460, 21855, 18660, 18676, 19025, 17265, 22008, 17292, 17421, 21157, 17192, 21217, 21848, 17311,
  /*  6180 */ 18669, 19018, 19027, 17447, 32909, 17497, 17520, 17251, 36410, 17824, 20322, 20663, 20490, 17543, 17559,
  /*  6195 */ 17585, 21862, 17504, 17527, 17258, 36417, 21890, 21915, 17611, 36466, 18259, 17633, 17661, 18368, 17703,
  /*  6210 */ 17730, 17772, 33538, 21921, 17617, 36472, 18265, 36530, 17477, 19171, 17902, 17934, 17744, 17795, 17874,
  /*  6225 */ 17590, 21595, 17481, 19175, 17906, 18742, 17960, 36550, 17714, 17976, 18021, 18738, 18692, 18413, 18632,
  /*  6240 */ 18081, 18098, 18114, 18159, 18185, 18717, 18094, 18251, 18292, 18281, 18308, 18005, 18338, 18354, 18384,
  /*  6255 */ 17849, 36402, 19251, 17838, 17163, 30650, 18400, 17858, 32918, 17645, 18816, 18429, 18445, 18530, 17393,
  /*  6270 */ 18758, 18516, 18546, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6285 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6300 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6315 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6330 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6345 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6360 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6375 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6390 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 21656, 21833, 19006, 19027, 19252,
  /*  6405 */ 17687, 19027, 21519, 30771, 36436, 17330, 17349, 18940, 17189, 17208, 17281, 17675, 17991, 17308, 17327,
  /*  6420 */ 17346, 18937, 18460, 21855, 18660, 18676, 19025, 17265, 22008, 17292, 17421, 21157, 17192, 21217, 21848,
  /*  6435 */ 17311, 18669, 19018, 19027, 17447, 32909, 17497, 17520, 17251, 36410, 17824, 20322, 20663, 20490, 17543,
  /*  6450 */ 17559, 17585, 21862, 17504, 17527, 17258, 36417, 21890, 21915, 17611, 36466, 18259, 17633, 17661, 18368,
  /*  6465 */ 17703, 17730, 17772, 33538, 21921, 17617, 36472, 18265, 36530, 17477, 19171, 17902, 17934, 17744, 17795,
  /*  6480 */ 17874, 17590, 21595, 17481, 19175, 17906, 18742, 17960, 36550, 17714, 17976, 18021, 18738, 18692, 18413,
  /*  6495 */ 18632, 18081, 18098, 18114, 18159, 18185, 18717, 18094, 18251, 18292, 18281, 18308, 18005, 18338, 18354,
  /*  6510 */ 18384, 17849, 36402, 19251, 17838, 17163, 30650, 18400, 17858, 32918, 17645, 18816, 18429, 18445, 18530,
  /*  6525 */ 17393, 18758, 18516, 18546, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6540 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6555 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6570 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6585 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6600 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6615 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6630 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6645 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22305, 18847, 22034, 18482,
  /*  6660 */ 27869, 25325, 24384, 29176, 22062, 18482, 18482, 18482, 18484, 27202, 27202, 27202, 27202, 22096, 24384,
  /*  6675 */ 24384, 24384, 24384, 30621, 18482, 18482, 18482, 18482, 18482, 25794, 27202, 27202, 27202, 27202, 35010,
  /*  6690 */ 22148, 24384, 24384, 24384, 24384, 31473, 31659, 18482, 18482, 18482, 18482, 18484, 27202, 27202, 27202,
  /*  6705 */ 27202, 27202, 19503, 24384, 24384, 24384, 24384, 24384, 32253, 18482, 18482, 18482, 18482, 23052, 27202,
  /*  6720 */ 27202, 27202, 27202, 30764, 21406, 24384, 24384, 24384, 24384, 26114, 18482, 18482, 18482, 27867, 27202,
  /*  6735 */ 27202, 27202, 22171, 22934, 24384, 24384, 24384, 22228, 18482, 18482, 27202, 27202, 35771, 20047, 24385,
  /*  6750 */ 19887, 25677, 18482, 18483, 27202, 27202, 19738, 23870, 19887, 30991, 18484, 27202, 31802, 19425, 19466,
  /*  6765 */ 23052, 23296, 19847, 30990, 27868, 34251, 19859, 25794, 34248, 19856, 25793, 19779, 30988, 23482, 30981,
  /*  6780 */ 22080, 19438, 27956, 19678, 27944, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6795 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6810 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6825 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6840 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6855 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6870 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6885 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  6900 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22305, 18847, 22034,
  /*  6915 */ 18482, 27869, 25325, 24384, 29176, 22062, 18482, 18482, 18482, 18484, 27202, 27202, 27202, 27202, 22096,
  /*  6930 */ 24384, 24384, 24384, 24384, 30621, 18482, 18482, 18482, 18482, 18482, 25794, 27202, 27202, 27202, 27202,
  /*  6945 */ 35010, 22148, 24384, 24384, 24384, 24384, 31473, 31659, 18482, 18482, 18482, 18482, 18484, 27202, 27202,
  /*  6960 */ 27202, 27202, 27202, 19503, 24384, 24384, 24384, 24384, 24384, 31154, 18482, 18482, 18482, 18482, 23052,
  /*  6975 */ 27202, 27202, 27202, 27202, 30764, 21406, 24384, 24384, 24384, 24384, 26114, 18482, 18482, 18482, 27867,
  /*  6990 */ 27202, 27202, 27202, 22171, 22934, 24384, 24384, 24384, 18481, 18482, 18482, 27202, 27202, 35771, 20047,
  /*  7005 */ 24385, 19887, 25677, 18482, 18483, 27202, 27202, 19738, 23870, 19887, 30991, 18484, 27202, 31802, 19425,
  /*  7020 */ 19466, 23052, 23296, 19847, 30990, 27868, 34251, 19859, 25794, 34248, 19856, 25793, 19779, 30988, 23482,
  /*  7035 */ 30981, 22080, 19438, 27956, 19678, 27944, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7050 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7065 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7080 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7095 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7110 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7125 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7140 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7155 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22305, 18847,
  /*  7170 */ 22034, 18482, 27869, 25325, 24384, 29176, 22062, 18482, 18482, 18482, 18484, 27202, 27202, 27202, 27202,
  /*  7185 */ 22096, 24384, 24384, 24384, 24384, 31644, 18482, 18482, 18482, 18482, 18482, 25794, 27202, 27202, 27202,
  /*  7200 */ 27202, 35010, 22148, 24384, 24384, 24384, 24384, 31473, 31659, 18482, 18482, 18482, 18482, 18484, 27202,
  /*  7215 */ 27202, 27202, 27202, 27202, 19503, 24384, 24384, 24384, 24384, 24384, 31154, 18482, 18482, 18482, 18482,
  /*  7230 */ 23052, 27202, 27202, 27202, 27202, 30764, 21406, 24384, 24384, 24384, 24384, 26114, 18482, 18482, 18482,
  /*  7245 */ 27867, 27202, 27202, 27202, 22171, 22934, 24384, 24384, 24384, 18481, 18482, 18482, 27202, 27202, 35771,
  /*  7260 */ 20047, 24385, 19887, 25677, 18482, 18483, 27202, 27202, 19738, 23870, 19887, 30991, 18484, 27202, 31802,
  /*  7275 */ 19425, 19466, 23052, 23296, 19847, 30990, 27868, 34251, 19859, 25794, 34248, 19856, 25793, 19779, 30988,
  /*  7290 */ 23482, 30981, 22080, 19438, 27956, 19678, 27944, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7305 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7320 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7335 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7350 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7365 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7380 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7395 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7410 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22305,
  /*  7425 */ 18847, 22034, 18482, 27869, 25325, 24384, 29176, 22062, 18482, 18482, 18482, 18484, 27202, 27202, 27202,
  /*  7440 */ 27202, 22096, 24384, 24384, 24384, 24384, 30621, 18482, 18482, 18482, 18482, 18482, 25794, 27202, 27202,
  /*  7455 */ 27202, 27202, 35010, 22148, 24384, 24384, 24384, 24384, 33557, 31659, 18482, 18482, 18482, 18482, 18484,
  /*  7470 */ 27202, 27202, 27202, 27202, 27202, 19503, 24384, 24384, 24384, 24384, 24384, 31154, 18482, 18482, 18482,
  /*  7485 */ 18482, 23052, 27202, 27202, 27202, 27202, 30764, 21406, 24384, 24384, 24384, 24384, 26114, 18482, 18482,
  /*  7500 */ 18482, 27867, 27202, 27202, 27202, 22171, 22934, 24384, 24384, 24384, 18481, 18482, 18482, 27202, 27202,
  /*  7515 */ 35771, 20047, 24385, 19887, 25677, 18482, 18483, 27202, 27202, 19738, 23870, 19887, 30991, 18484, 27202,
  /*  7530 */ 31802, 19425, 19466, 23052, 23296, 19847, 30990, 27868, 34251, 19859, 25794, 34248, 19856, 25793, 19779,
  /*  7545 */ 30988, 23482, 30981, 22080, 19438, 27956, 19678, 27944, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7560 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7575 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7590 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7605 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7620 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7635 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7650 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7665 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7680 */ 22305, 18847, 22034, 18482, 27869, 34068, 24384, 29176, 22062, 18482, 18482, 18482, 18484, 27202, 27202,
  /*  7695 */ 27202, 27202, 22245, 24384, 24384, 24384, 24384, 30621, 18482, 18482, 18482, 18482, 18482, 25794, 27202,
  /*  7710 */ 27202, 27202, 27202, 35010, 22148, 24384, 24384, 24384, 24384, 31473, 31659, 18482, 18482, 18482, 18482,
  /*  7725 */ 18484, 27202, 27202, 27202, 27202, 27202, 19503, 24384, 24384, 24384, 24384, 24384, 31154, 18482, 18482,
  /*  7740 */ 18482, 18482, 23052, 27202, 27202, 27202, 27202, 30764, 21406, 24384, 24384, 24384, 24384, 26114, 18482,
  /*  7755 */ 18482, 18482, 27867, 27202, 27202, 27202, 22171, 22934, 24384, 24384, 24384, 18481, 18482, 18482, 27202,
  /*  7770 */ 27202, 35771, 20047, 24385, 19887, 25677, 18482, 18483, 27202, 27202, 19738, 23870, 19887, 30991, 18484,
  /*  7785 */ 27202, 31802, 19425, 19466, 23052, 23296, 19847, 30990, 27868, 34251, 19859, 25794, 34248, 19856, 25793,
  /*  7800 */ 19779, 30988, 23482, 30981, 22080, 19438, 27956, 19678, 27944, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7815 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7830 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7845 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7860 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7875 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7890 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7905 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7920 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  7935 */ 17590, 22305, 18847, 22034, 18482, 27869, 25325, 24384, 29176, 22062, 18482, 18482, 18482, 18484, 27202,
  /*  7950 */ 27202, 27202, 27202, 22096, 24384, 24384, 24384, 24384, 18877, 18482, 18482, 18482, 18482, 18482, 25794,
  /*  7965 */ 27202, 27202, 27202, 27202, 35010, 22148, 24384, 24384, 24384, 24384, 24017, 31659, 18482, 18482, 18482,
  /*  7980 */ 18482, 18484, 27202, 27202, 27202, 27202, 27202, 19503, 24384, 24384, 24384, 24384, 24384, 19647, 18482,
  /*  7995 */ 18482, 18482, 18482, 23052, 27202, 27202, 27202, 27202, 30764, 23993, 24384, 24384, 24384, 24384, 26758,
  /*  8010 */ 18482, 18482, 18482, 27867, 27202, 27202, 27202, 17590, 23998, 24384, 24384, 24384, 18481, 18482, 18482,
  /*  8025 */ 27202, 27202, 27203, 23997, 24385, 19887, 25677, 18482, 18483, 27202, 27202, 19738, 23870, 19887, 30991,
  /*  8040 */ 18484, 27202, 31802, 19425, 19466, 23052, 23296, 19847, 30990, 27868, 34251, 19859, 25794, 34248, 19856,
  /*  8055 */ 25793, 19779, 30988, 23482, 30981, 22080, 19438, 27956, 19678, 27944, 17590, 17590, 17590, 17590, 17590,
  /*  8070 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8085 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8100 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8115 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8130 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8145 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8160 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8175 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8190 */ 17590, 17590, 22290, 18847, 22034, 18482, 27869, 34957, 24384, 29176, 22062, 18482, 18482, 18482, 18484,
  /*  8205 */ 27202, 27202, 27202, 27202, 22096, 24384, 24384, 24384, 24384, 18877, 18482, 18482, 18482, 18482, 18482,
  /*  8220 */ 25794, 27202, 27202, 27202, 27202, 35010, 22148, 24384, 24384, 24384, 24384, 24017, 31659, 18482, 18482,
  /*  8235 */ 18482, 18482, 18484, 27202, 27202, 27202, 27202, 27202, 19503, 24384, 24384, 24384, 24384, 24384, 19647,
  /*  8250 */ 18482, 18482, 18482, 18482, 23052, 27202, 27202, 27202, 27202, 30764, 23993, 24384, 24384, 24384, 24384,
  /*  8265 */ 26758, 18482, 18482, 18482, 27867, 27202, 27202, 27202, 17590, 23998, 24384, 24384, 24384, 18481, 18482,
  /*  8280 */ 18482, 27202, 27202, 27203, 23997, 24385, 19887, 25677, 18482, 18483, 27202, 27202, 19738, 23870, 19887,
  /*  8295 */ 30991, 18484, 27202, 31802, 19425, 19466, 23052, 23296, 19847, 30990, 27868, 34251, 19859, 25794, 34248,
  /*  8310 */ 19856, 25793, 19779, 30988, 23482, 30981, 22080, 19438, 27956, 19678, 27944, 17590, 17590, 17590, 17590,
  /*  8325 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8340 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8355 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8370 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8385 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8400 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8415 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8430 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8445 */ 17590, 17590, 17590, 22305, 18847, 22034, 18482, 27869, 25325, 24384, 29176, 22062, 18482, 18482, 18482,
  /*  8460 */ 18484, 27202, 27202, 27202, 27202, 22096, 24384, 24384, 24384, 24384, 18877, 18482, 18482, 18482, 18482,
  /*  8475 */ 18482, 25794, 27202, 27202, 27202, 27202, 35010, 22148, 24384, 24384, 24384, 24384, 24017, 31659, 18482,
  /*  8490 */ 18482, 18482, 18482, 18484, 27202, 27202, 27202, 27202, 27202, 19503, 24384, 24384, 24384, 24384, 24384,
  /*  8505 */ 19647, 18482, 18482, 18482, 18482, 23052, 27202, 27202, 27202, 27202, 30764, 23993, 24384, 24384, 24384,
  /*  8520 */ 24384, 34436, 18482, 18482, 18482, 27867, 27202, 27202, 27202, 17590, 23998, 24384, 24384, 24384, 18481,
  /*  8535 */ 18482, 18482, 27202, 27202, 27203, 23997, 24385, 19887, 25677, 18482, 18483, 27202, 27202, 19738, 23870,
  /*  8550 */ 19887, 30991, 18484, 27202, 31802, 19425, 19466, 23052, 23296, 19847, 30990, 27868, 34251, 19859, 25794,
  /*  8565 */ 34248, 19856, 25793, 19779, 30988, 23482, 30981, 22080, 19438, 27956, 19678, 27944, 17590, 17590, 17590,
  /*  8580 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8595 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8610 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8625 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8640 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8655 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8670 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8685 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8700 */ 17590, 17590, 17590, 17590, 22320, 18847, 19006, 19027, 19252, 17687, 19027, 17173, 27077, 36436, 17330,
  /*  8715 */ 17349, 18940, 17189, 17208, 17281, 17675, 17991, 17308, 17327, 17346, 18937, 18460, 21855, 18660, 18676,
  /*  8730 */ 19025, 17265, 22008, 17292, 17421, 21157, 17192, 21217, 21848, 17311, 18669, 19018, 19027, 17447, 32909,
  /*  8745 */ 17497, 17520, 17251, 36410, 17824, 20322, 20663, 20490, 17543, 17559, 17585, 21862, 17504, 17527, 17258,
  /*  8760 */ 36417, 21890, 21915, 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730, 17772, 33538, 21921, 17617,
  /*  8775 */ 36472, 18265, 36530, 17477, 19171, 17902, 17934, 17744, 17795, 17874, 17590, 21595, 17481, 19175, 17906,
  /*  8790 */ 18742, 17960, 36550, 17714, 17976, 18021, 18738, 18692, 18413, 19919, 18081, 18098, 18114, 18159, 18185,
  /*  8805 */ 18717, 18094, 18251, 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849, 36402, 19251, 17838, 17163,
  /*  8820 */ 30650, 18400, 17858, 32918, 17645, 18816, 18429, 18445, 18530, 17393, 18758, 18516, 18546, 17590, 17590,
  /*  8835 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8850 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8865 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8880 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8895 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8910 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8925 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8940 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  8955 */ 17590, 17590, 17590, 17590, 17590, 21803, 18847, 19006, 19027, 19252, 17687, 19027, 17173, 30771, 36436,
  /*  8970 */ 17330, 17349, 18940, 17189, 17208, 17281, 17675, 17991, 17308, 17327, 17346, 18937, 18460, 21855, 18660,
  /*  8985 */ 18676, 19025, 17265, 22008, 17292, 17421, 21157, 17192, 21217, 21848, 17311, 18669, 19018, 19027, 17447,
  /*  9000 */ 32909, 17497, 17520, 17251, 36410, 17824, 20322, 20663, 20490, 17543, 17559, 17585, 21862, 17504, 17527,
  /*  9015 */ 17258, 36417, 21890, 21915, 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730, 17772, 33538, 21921,
  /*  9030 */ 17617, 36472, 18265, 36530, 17477, 19171, 17902, 17934, 17744, 17795, 17874, 17590, 21595, 17481, 19175,
  /*  9045 */ 17906, 18742, 17960, 36550, 17714, 17976, 18021, 18738, 18692, 18413, 18632, 18081, 18098, 18114, 18159,
  /*  9060 */ 18185, 18717, 18094, 18251, 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849, 36402, 19251, 17838,
  /*  9075 */ 17163, 30650, 18400, 17858, 32918, 17645, 18816, 18429, 18445, 18530, 17393, 18758, 18516, 18546, 17590,
  /*  9090 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9105 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9120 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9135 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9150 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9165 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9180 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9195 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9210 */ 17590, 17590, 17590, 17590, 17590, 17590, 22275, 22479, 19006, 19027, 19252, 17687, 19027, 19141, 30771,
  /*  9225 */ 36436, 17330, 17349, 18940, 17189, 17208, 17281, 17675, 17991, 17308, 17327, 17346, 18937, 22510, 21855,
  /*  9240 */ 18660, 18676, 19025, 17265, 22008, 17292, 17421, 21157, 17192, 21217, 21848, 17311, 18669, 19018, 19027,
  /*  9255 */ 17447, 32909, 17497, 17520, 17251, 36410, 17824, 20322, 20663, 20490, 17543, 17559, 17585, 21862, 17504,
  /*  9270 */ 17527, 17258, 36417, 21890, 21915, 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730, 17772, 33538,
  /*  9285 */ 21921, 17617, 36472, 18265, 36530, 17477, 19171, 17902, 17934, 17744, 17795, 17874, 17590, 21595, 17481,
  /*  9300 */ 19175, 17906, 18742, 17960, 36550, 17714, 17976, 18021, 18738, 18692, 18413, 18632, 18081, 18098, 18114,
  /*  9315 */ 18159, 18185, 18717, 18094, 18251, 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849, 36402, 19251,
  /*  9330 */ 17838, 17163, 30650, 18400, 17858, 32918, 17645, 18816, 18429, 18445, 18530, 17393, 18758, 18516, 18546,
  /*  9345 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9360 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9375 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9390 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9405 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9420 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9435 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9450 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9465 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22574, 18847, 22954, 22970, 27597, 22986, 23002, 23033,
  /*  9480 */ 22062, 18482, 18482, 18482, 23049, 27202, 27202, 27202, 23068, 22096, 24384, 24384, 24384, 23088, 31359,
  /*  9495 */ 31082, 19693, 18482, 28112, 28225, 19443, 35045, 27202, 27202, 23108, 23139, 23155, 23178, 24384, 24384,
  /*  9510 */ 23212, 35330, 31659, 23228, 18482, 23256, 23274, 27795, 26712, 23293, 35214, 34879, 33340, 23312, 18235,
  /*  9525 */ 23359, 32708, 23949, 24384, 23380, 35255, 23429, 18482, 33884, 23408, 23448, 27202, 27202, 23498, 23518,
  /*  9540 */ 21406, 23541, 24384, 24384, 23570, 26114, 23601, 23623, 18482, 33444, 23651, 32875, 27202, 22171, 18862,
  /*  9555 */ 23702, 36589, 24384, 18481, 23731, 32601, 27202, 23750, 23768, 20047, 32969, 24367, 25677, 18482, 18483,
  /*  9570 */ 27202, 27202, 19738, 23870, 23784, 30991, 18484, 27202, 31802, 19425, 19466, 23052, 23296, 19847, 28217,
  /*  9585 */ 31795, 23804, 26925, 34916, 23831, 26501, 25793, 23859, 23895, 23482, 30981, 22080, 19438, 27956, 19678,
  /*  9600 */ 29812, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9615 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9630 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9645 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9660 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9675 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9690 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9705 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9720 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22589, 18847, 22034, 18482, 27869, 25325, 24384,
  /*  9735 */ 29176, 22062, 18482, 18482, 18482, 18484, 27202, 27202, 27202, 27202, 22096, 24384, 24384, 24384, 24384,
  /*  9750 */ 30621, 18482, 18482, 18482, 18482, 28902, 25794, 27202, 27202, 27202, 34019, 23914, 22148, 24384, 24384,
  /*  9765 */ 24384, 28393, 23930, 31659, 18482, 18482, 18482, 18482, 18484, 27202, 27202, 27202, 27202, 27202, 19503,
  /*  9780 */ 24384, 24384, 24384, 24384, 24384, 31154, 26591, 18482, 18482, 18482, 31585, 23965, 27202, 27202, 27202,
  /*  9795 */ 23986, 22185, 24014, 24384, 24384, 24384, 24033, 18482, 18482, 18482, 27867, 27202, 27202, 27202, 22171,
  /*  9810 */ 22934, 24384, 24384, 24384, 18481, 18482, 18482, 27202, 27202, 35771, 20047, 24385, 19887, 25677, 18482,
  /*  9825 */ 18483, 27202, 27202, 19738, 23870, 19887, 30991, 18484, 27202, 31802, 19425, 19466, 23052, 23296, 19847,
  /*  9840 */ 30990, 27868, 34251, 26504, 24057, 24107, 24132, 25793, 19779, 30988, 23482, 30981, 22080, 19438, 27956,
  /*  9855 */ 19678, 27944, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9870 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9885 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9900 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9915 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9930 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9945 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9960 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /*  9975 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22604, 18847, 22034, 19697, 27869, 24166,
  /*  9990 */ 24384, 24182, 24198, 26600, 18482, 18482, 18484, 24233, 24249, 27202, 27202, 22096, 24268, 24284, 24384,
  /* 10005 */ 24384, 30621, 19800, 35427, 35999, 32609, 18482, 25794, 24303, 28959, 23752, 27202, 35010, 22148, 24341,
  /* 10020 */ 32040, 26837, 24383, 31473, 31659, 18482, 18482, 18482, 24784, 18484, 27202, 27202, 27202, 27202, 24401,
  /* 10035 */ 19503, 24384, 24384, 24384, 24384, 20134, 31154, 18482, 18482, 18482, 27845, 23052, 27202, 27202, 33502,
  /* 10050 */ 27202, 30764, 21406, 24384, 24384, 22938, 24384, 26114, 18482, 36246, 18482, 27867, 27202, 24423, 27202,
  /* 10065 */ 22171, 22934, 24384, 24442, 24384, 36762, 28438, 18482, 34466, 34508, 35771, 24461, 24385, 24477, 25677,
  /* 10080 */ 18482, 36220, 27202, 27202, 24498, 30954, 23715, 30991, 18484, 27202, 31802, 19425, 19466, 23052, 23296,
  /* 10095 */ 24521, 30990, 27868, 34251, 30090, 23343, 24546, 19856, 25793, 19779, 30988, 23482, 26152, 22080, 19438,
  /* 10110 */ 29824, 24562, 27944, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10125 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10140 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10155 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10170 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10185 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10200 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10215 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10230 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22619, 18847, 22034, 25767, 22132,
  /* 10245 */ 25325, 23162, 29176, 24597, 24091, 23607, 24656, 26122, 24680, 24426, 24696, 28551, 22096, 24731, 24445,
  /* 10260 */ 24747, 23364, 30621, 18482, 18482, 18482, 18482, 24781, 25794, 27202, 27202, 27202, 34210, 35010, 22148,
  /* 10275 */ 24384, 24384, 24384, 33259, 31473, 22525, 24087, 24213, 18482, 18482, 34908, 24800, 30419, 27202, 27202,
  /* 10290 */ 32418, 19503, 29781, 35065, 24384, 24384, 19891, 31154, 24835, 18482, 18482, 24854, 29214, 27202, 27202,
  /* 10305 */ 32006, 27202, 30764, 35344, 24384, 24384, 31544, 24384, 26114, 33098, 27814, 27002, 27867, 34668, 25625,
  /* 10320 */ 24871, 22171, 22934, 19214, 34531, 24889, 18481, 18482, 18482, 27202, 27202, 35771, 20047, 24385, 19887,
  /* 10335 */ 25677, 18482, 33615, 27202, 27202, 24907, 24930, 23554, 30991, 18484, 27202, 31802, 22199, 19466, 23052,
  /* 10350 */ 23296, 19847, 30877, 31015, 24955, 19859, 24983, 34248, 30871, 25793, 19779, 30988, 23482, 30981, 22080,
  /* 10365 */ 19438, 24999, 19678, 27944, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10380 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10395 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10410 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10425 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10440 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10455 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10470 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10485 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22634, 18847, 25024, 25040,
  /* 10500 */ 31293, 25056, 25072, 25088, 22062, 34734, 24217, 36253, 34808, 32637, 25104, 23072, 32848, 22245, 36623,
  /* 10515 */ 25120, 30679, 27356, 30621, 25136, 26455, 25174, 25208, 22540, 23240, 25224, 25240, 25256, 25306, 25341,
  /* 10530 */ 25357, 25418, 25446, 25470, 26739, 25522, 31659, 23635, 25576, 27398, 25593, 28592, 25945, 25617, 27202,
  /* 10545 */ 32546, 27295, 25641, 25850, 25667, 24384, 34758, 25699, 25716, 22552, 27787, 30221, 25756, 25789, 25810,
  /* 10560 */ 25828, 28333, 28988, 30764, 21493, 33405, 25848, 25866, 25904, 26114, 31227, 26677, 30167, 27867, 25941,
  /* 10575 */ 25961, 27202, 22171, 22934, 25977, 25997, 24384, 23394, 27775, 25740, 25270, 26013, 26048, 26064, 26104,
  /* 10590 */ 26138, 26178, 26211, 26230, 26247, 30500, 26380, 26282, 28388, 30991, 33711, 27202, 33645, 26324, 36716,
  /* 10605 */ 26353, 26374, 35300, 30990, 26396, 26415, 30927, 26358, 33832, 26442, 26471, 26487, 26520, 23482, 33146,
  /* 10620 */ 26539, 26555, 27956, 31266, 27944, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10635 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10650 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10665 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10680 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10695 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10710 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10725 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10740 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22649, 18847, 26576,
  /* 10755 */ 26189, 26616, 25325, 26643, 29176, 22062, 26669, 18482, 18482, 18484, 26693, 27202, 27202, 27202, 22096,
  /* 10770 */ 26728, 24384, 24384, 24384, 30621, 18482, 18482, 18482, 18482, 26782, 25794, 27202, 27202, 27202, 26258,
  /* 10785 */ 35010, 22148, 24384, 24384, 24384, 21571, 31473, 31659, 18482, 18482, 33949, 18482, 18484, 27202, 27202,
  /* 10800 */ 25812, 27202, 27202, 19503, 24384, 24384, 24384, 26800, 24384, 31154, 18482, 18482, 18482, 35570, 23052,
  /* 10815 */ 27202, 27202, 27202, 26817, 30764, 21406, 24384, 24384, 24384, 26836, 26114, 18482, 18482, 18482, 27867,
  /* 10830 */ 27202, 27202, 27202, 22171, 22934, 24384, 24384, 24384, 18481, 18482, 18482, 27202, 27202, 35771, 20047,
  /* 10845 */ 24385, 19887, 25677, 31882, 18483, 35699, 27202, 19738, 26853, 19887, 30991, 18484, 27202, 31802, 19425,
  /* 10860 */ 19466, 23052, 23296, 26913, 30990, 27868, 34251, 19859, 25794, 34248, 19856, 25793, 19779, 30988, 23482,
  /* 10875 */ 24967, 31061, 19438, 26953, 27663, 27944, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10890 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10905 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10920 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10935 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10950 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10965 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10980 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 10995 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22664, 18847,
  /* 11010 */ 26990, 18482, 27869, 25325, 24384, 29176, 22062, 18482, 18482, 18482, 18484, 27202, 27202, 27202, 27202,
  /* 11025 */ 22096, 24384, 24384, 24384, 24384, 23017, 18482, 18482, 18482, 18482, 18482, 25794, 27202, 27202, 27202,
  /* 11040 */ 27202, 35010, 27024, 24384, 24384, 24384, 24384, 24017, 31659, 18482, 18482, 27047, 18482, 18484, 27202,
  /* 11055 */ 27202, 27331, 27202, 27202, 27066, 24384, 24384, 29025, 24384, 24384, 19647, 18482, 18482, 18482, 18482,
  /* 11070 */ 23052, 27202, 27202, 27202, 27202, 30764, 23993, 24384, 24384, 24384, 24384, 26758, 18482, 18482, 33957,
  /* 11085 */ 27867, 27202, 27202, 27093, 17590, 23998, 24384, 24384, 27114, 27135, 36322, 27153, 27201, 27219, 28359,
  /* 11100 */ 18229, 34780, 34405, 27235, 35972, 27268, 27293, 27311, 36040, 33984, 20980, 31851, 21453, 30535, 27347,
  /* 11115 */ 32520, 27372, 23052, 23296, 19847, 30990, 27868, 34251, 19859, 25794, 34248, 19856, 25793, 19779, 30988,
  /* 11130 */ 23482, 30981, 22080, 26337, 30118, 19678, 27944, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11145 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11160 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11175 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11190 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11205 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11220 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11235 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11250 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22305,
  /* 11265 */ 18847, 22034, 27397, 27414, 27436, 27452, 27473, 22062, 18482, 18482, 30171, 18484, 27202, 27202, 27982,
  /* 11280 */ 27202, 22096, 24384, 24384, 25700, 24384, 18877, 18482, 18482, 18482, 18482, 18482, 34013, 27202, 27202,
  /* 11295 */ 27202, 27202, 29731, 22148, 24384, 24384, 24384, 24384, 27119, 31659, 27489, 18482, 18482, 18482, 18484,
  /* 11310 */ 27185, 27202, 27202, 27202, 27202, 19503, 27457, 24384, 24384, 24384, 24384, 19647, 18482, 18482, 18482,
  /* 11325 */ 27050, 23052, 27202, 27202, 27202, 32469, 30764, 23993, 24384, 24384, 24384, 34982, 26758, 18482, 18482,
  /* 11340 */ 18482, 27867, 27202, 27202, 27202, 17590, 23998, 24384, 24384, 24384, 18481, 18482, 18482, 27202, 27202,
  /* 11355 */ 27203, 23997, 24385, 19887, 25677, 18482, 18483, 27202, 27202, 19738, 23870, 19887, 30991, 20796, 27202,
  /* 11370 */ 29362, 22110, 33940, 23052, 23296, 19847, 30990, 27868, 34251, 19859, 25794, 34248, 19856, 25793, 19779,
  /* 11385 */ 30988, 23482, 30981, 22080, 19438, 27956, 19678, 27944, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11400 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11415 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11430 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11445 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11460 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11475 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11490 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11505 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11520 */ 22679, 18847, 22034, 27508, 27528, 27553, 35182, 27569, 22062, 29693, 26300, 23258, 27585, 24715, 27613,
  /* 11535 */ 27202, 27648, 22096, 36597, 27698, 24384, 27733, 18877, 18482, 27811, 18482, 27830, 22046, 27865, 32194,
  /* 11550 */ 27202, 25158, 27885, 27913, 22148, 29458, 24384, 29977, 34392, 26750, 27763, 26889, 18482, 18482, 27252,
  /* 11565 */ 29886, 27929, 27202, 27202, 27202, 27981, 27998, 28024, 28045, 24384, 24384, 28062, 28081, 28128, 25506,
  /* 11580 */ 28145, 26088, 28160, 27202, 28173, 24640, 28189, 30764, 31496, 24384, 28205, 34154, 36166, 24939, 28241,
  /* 11595 */ 28259, 28283, 21463, 33034, 28320, 28349, 17590, 20967, 23092, 28375, 28409, 28095, 28435, 28454, 28474,
  /* 11610 */ 28509, 28527, 20001, 33682, 25879, 25677, 18482, 18483, 27202, 27202, 19738, 23870, 19887, 30272, 28267,
  /* 11625 */ 28546, 28567, 19425, 28583, 23052, 23296, 19847, 19471, 28608, 28653, 31075, 25794, 34248, 19856, 25793,
  /* 11640 */ 19779, 29644, 35950, 30318, 22080, 19438, 27956, 23123, 28693, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11655 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11670 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11685 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11700 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11715 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11730 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11745 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11760 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11775 */ 17590, 22305, 18847, 22034, 18482, 27869, 25325, 24384, 29176, 22062, 18482, 18482, 18482, 18484, 27202,
  /* 11790 */ 27202, 27202, 27202, 22096, 24384, 24384, 24384, 24384, 18877, 18482, 18482, 18482, 18482, 18482, 25794,
  /* 11805 */ 27202, 27202, 27202, 27202, 35010, 22148, 24384, 24384, 24384, 24384, 24017, 22494, 18482, 18482, 18482,
  /* 11820 */ 18482, 18484, 25283, 27202, 27202, 27202, 27202, 19503, 29397, 24384, 24384, 24384, 24384, 19647, 18482,
  /* 11835 */ 18482, 18482, 18482, 23052, 27202, 27202, 27202, 27202, 30764, 23993, 24384, 24384, 24384, 24384, 26758,
  /* 11850 */ 18482, 18482, 18482, 27867, 27202, 27202, 27202, 17590, 23998, 24384, 24384, 24384, 18481, 18482, 18482,
  /* 11865 */ 27202, 27202, 27203, 23997, 24385, 19887, 25677, 18482, 18483, 27202, 27202, 19738, 23870, 19887, 30991,
  /* 11880 */ 18484, 27202, 31802, 19425, 19466, 23052, 23296, 19847, 30990, 27868, 34251, 19859, 25794, 34248, 19856,
  /* 11895 */ 25793, 19779, 30988, 23482, 30981, 22080, 19438, 27956, 19678, 27944, 17590, 17590, 17590, 17590, 17590,
  /* 11910 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11925 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11940 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11955 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11970 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 11985 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12000 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12015 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12030 */ 17590, 17590, 22694, 18847, 28740, 28775, 28810, 28834, 28850, 28873, 28889, 24142, 28936, 31945, 36329,
  /* 12045 */ 25290, 28954, 27632, 28975, 29004, 24505, 29020, 25454, 29041, 23017, 27512, 29083, 29103, 30721, 18482,
  /* 12060 */ 23478, 29123, 24819, 27202, 29148, 28920, 27024, 29166, 23196, 24384, 29192, 35529, 31659, 18482, 18482,
  /* 12075 */ 25601, 32589, 29211, 27202, 27202, 31434, 30700, 29230, 27066, 24384, 24384, 24384, 29255, 29306, 19647,
  /* 12090 */ 18482, 33383, 18482, 18482, 23052, 27202, 29333, 27202, 27202, 30764, 23993, 35925, 24384, 24384, 24384,
  /* 12105 */ 27717, 36123, 18482, 18482, 29350, 29413, 27202, 35642, 17590, 21411, 29432, 24384, 25981, 18481, 33866,
  /* 12120 */ 18482, 27202, 26967, 27203, 23997, 32729, 19887, 25677, 18482, 26897, 27202, 27202, 29451, 23870, 24354,
  /* 12135 */ 30991, 18484, 27202, 31802, 19425, 19466, 23052, 23296, 19847, 30990, 27868, 31737, 19859, 25794, 34248,
  /* 12150 */ 19856, 29474, 29539, 29283, 29581, 29637, 22080, 32533, 29501, 19678, 27944, 17590, 17590, 17590, 17590,
  /* 12165 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12180 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12195 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12210 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12225 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12240 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12255 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12270 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12285 */ 17590, 17590, 17590, 22709, 18847, 22034, 29660, 29512, 25325, 33242, 29176, 29682, 27245, 18482, 29709,
  /* 12300 */ 33286, 26974, 27202, 29725, 29747, 22096, 19221, 24384, 32702, 29772, 18877, 26784, 33892, 28458, 18482,
  /* 12315 */ 18482, 25794, 29797, 27202, 29840, 27202, 35010, 22148, 35817, 24384, 29859, 24384, 24017, 36756, 25192,
  /* 12330 */ 18482, 18482, 29879, 18484, 27202, 29902, 27202, 26032, 27202, 29925, 24384, 29960, 24384, 33594, 24384,
  /* 12345 */ 19647, 18482, 18482, 18482, 18482, 23052, 27202, 27202, 27202, 27202, 29239, 29993, 24384, 24384, 24384,
  /* 12360 */ 24384, 26758, 18482, 18482, 18482, 27867, 27202, 27202, 27202, 17590, 23998, 24384, 24384, 24384, 31665,
  /* 12375 */ 18482, 18482, 19603, 27202, 27203, 23997, 30013, 19887, 25677, 18482, 18483, 27202, 27202, 19738, 23870,
  /* 12390 */ 19887, 30991, 18484, 27202, 31802, 19949, 19466, 36661, 19563, 19847, 30029, 30128, 30062, 19859, 25794,
  /* 12405 */ 30078, 19856, 25793, 19779, 30988, 23482, 30981, 22080, 19438, 27956, 19678, 30106, 17590, 17590, 17590,
  /* 12420 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12435 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12450 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12465 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12480 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12495 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12510 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12525 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12540 */ 17590, 17590, 17590, 17590, 22724, 18847, 30152, 30187, 30237, 30288, 30304, 30344, 22062, 35616, 32797,
  /* 12555 */ 25773, 18484, 29909, 34096, 26820, 27202, 22096, 24914, 23189, 29195, 24384, 18877, 34444, 30360, 18482,
  /* 12570 */ 18482, 18482, 23413, 24707, 27202, 27202, 27202, 35010, 30378, 34990, 24384, 24384, 24384, 24017, 29554,
  /* 12585 */ 18482, 18482, 27137, 18482, 31281, 30394, 27202, 27202, 30413, 30566, 19503, 30435, 24384, 24384, 29969,
  /* 12600 */ 35678, 19647, 28759, 30455, 35459, 35606, 23052, 28724, 30490, 30525, 30560, 30764, 23993, 20123, 30582,
  /* 12615 */ 30606, 30675, 26291, 33426, 28938, 27682, 30695, 23675, 33466, 28493, 17590, 23944, 20405, 34338, 20997,
  /* 12630 */ 32331, 26308, 30716, 30737, 24315, 30756, 21563, 36372, 30787, 26653, 24611, 33177, 32448, 30814, 31804,
  /* 12645 */ 25430, 25917, 26523, 18484, 28818, 31802, 29269, 19466, 28297, 34240, 23815, 26076, 30842, 30858, 32115,
  /* 12660 */ 30893, 30915, 32757, 25793, 30943, 30988, 23482, 30981, 30970, 31007, 27956, 19678, 29489, 17590, 17590,
  /* 12675 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12690 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12705 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12720 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12735 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12750 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12765 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12780 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12795 */ 17590, 17590, 17590, 17590, 17590, 22739, 18847, 31031, 31047, 32397, 31098, 31114, 31170, 22062, 18482,
  /* 12810 */ 29565, 35577, 36725, 27202, 33216, 31186, 24407, 22096, 24384, 20142, 31202, 34301, 27748, 31218, 33388,
  /* 12825 */ 27166, 18482, 29087, 27277, 27202, 31251, 31309, 27202, 31328, 31344, 24384, 31375, 31391, 24384, 31410,
  /* 12840 */ 31659, 18482, 36130, 32801, 18482, 18484, 27202, 27202, 31433, 31450, 27202, 19503, 24384, 24384, 31470,
  /* 12855 */ 33588, 24384, 32977, 18482, 18482, 18482, 18482, 30038, 27202, 27202, 27202, 27202, 31489, 32244, 24384,
  /* 12870 */ 24384, 24384, 24384, 31512, 18482, 28755, 18482, 24634, 35732, 27202, 27202, 28637, 31538, 35788, 24384,
  /* 12885 */ 24384, 19337, 31986, 18482, 33208, 25316, 27203, 29997, 29863, 19887, 25677, 18482, 18483, 27202, 27202,
  /* 12900 */ 19738, 31560, 19887, 31601, 32369, 33316, 30136, 31629, 19972, 31681, 31726, 31753, 31781, 30046, 31820,
  /* 12915 */ 31847, 25794, 34282, 19856, 25793, 19779, 30988, 23482, 30981, 22080, 19438, 27956, 31867, 30252, 17590,
  /* 12930 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12945 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12960 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12975 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 12990 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13005 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13020 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13035 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13050 */ 17590, 17590, 17590, 17590, 17590, 17590, 22754, 18847, 22034, 18909, 30474, 31902, 24287, 31918, 31934,
  /* 13065 */ 32767, 35262, 27008, 29621, 34103, 19820, 29416, 33323, 22096, 27031, 30439, 29435, 28857, 29596, 18482,
  /* 13080 */ 18482, 18482, 31961, 18482, 25794, 27202, 27202, 35038, 27202, 35010, 22148, 24384, 24384, 29389, 24384,
  /* 13095 */ 24017, 31979, 18482, 26937, 18482, 18482, 18484, 27202, 31454, 32002, 27202, 27202, 32022, 24384, 33015,
  /* 13110 */ 32056, 24384, 24384, 33690, 18482, 18482, 33119, 18482, 23052, 27202, 27202, 27624, 27202, 29756, 32078,
  /* 13125 */ 24384, 24384, 34332, 24384, 26758, 18482, 18482, 18482, 27867, 27202, 27202, 27202, 36691, 23998, 24384,
  /* 13140 */ 24384, 24384, 18481, 18482, 18482, 27202, 27202, 27203, 23997, 24385, 19887, 25677, 18482, 18483, 27202,
  /* 13155 */ 27202, 19738, 23870, 19887, 30991, 18484, 27202, 31802, 31710, 22155, 33181, 24252, 32103, 30990, 27868,
  /* 13170 */ 34251, 19859, 25794, 34248, 30265, 25793, 19779, 30988, 23482, 30981, 22080, 19438, 27956, 19678, 27944,
  /* 13185 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13200 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13215 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13230 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13245 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13260 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13275 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13290 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13305 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22305, 18847, 32138, 32166, 32186, 30826, 33252, 29067,
  /* 13320 */ 22062, 18482, 18482, 18482, 18484, 27202, 27202, 27202, 27202, 22096, 24384, 24384, 24384, 24384, 23585,
  /* 13335 */ 18482, 18482, 18482, 18482, 18482, 25794, 27202, 27202, 27202, 27202, 35010, 32210, 24384, 24384, 24384,
  /* 13350 */ 24384, 24017, 31659, 18482, 18482, 18482, 18482, 18484, 27202, 27202, 27202, 27202, 27202, 32233, 24384,
  /* 13365 */ 24384, 24384, 24384, 24384, 19647, 18482, 18482, 18482, 18482, 23052, 27202, 27202, 27202, 27202, 30764,
  /* 13380 */ 23993, 24384, 24384, 24384, 24384, 26758, 18482, 18482, 18482, 27867, 27202, 27202, 27202, 17590, 23998,
  /* 13395 */ 24384, 24384, 24384, 18481, 18482, 18482, 27202, 27202, 27203, 23997, 24385, 19887, 25677, 33857, 18483,
  /* 13410 */ 36057, 27202, 19738, 35289, 19887, 30991, 18484, 27202, 31802, 19425, 19466, 23052, 23296, 19847, 30990,
  /* 13425 */ 27868, 34251, 19859, 25794, 34248, 19856, 25793, 19779, 30988, 23482, 30981, 22080, 19438, 27956, 19678,
  /* 13440 */ 27944, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13455 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13470 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13485 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13500 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13515 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13530 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13545 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13560 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22769, 18847, 32269, 31613, 34604, 32285, 32301,
  /* 13575 */ 32351, 22062, 18482, 32367, 19354, 32385, 27202, 32413, 27098, 32434, 22096, 24384, 32485, 20052, 32506,
  /* 13590 */ 18877, 25396, 23734, 18482, 18482, 32562, 32625, 27202, 32653, 27202, 23664, 32673, 32689, 24384, 32724,
  /* 13605 */ 24384, 25888, 32745, 34706, 18482, 27381, 32783, 24577, 24838, 32817, 24873, 32838, 32864, 27202, 32899,
  /* 13620 */ 32934, 24384, 32957, 29317, 24384, 30798, 26214, 27678, 33875, 18482, 23052, 36352, 27202, 32993, 27202,
  /* 13635 */ 30764, 23993, 32087, 24384, 33013, 24384, 35853, 18482, 18482, 30362, 27965, 27202, 27202, 33754, 17590,
  /* 13650 */ 20112, 24384, 24384, 34576, 20792, 18482, 18482, 33031, 27202, 27203, 36159, 24385, 19887, 25677, 18482,
  /* 13665 */ 18483, 27202, 27202, 19738, 23870, 19887, 30991, 18484, 27202, 31802, 19425, 34554, 24150, 33050, 33080,
  /* 13680 */ 33114, 27868, 34251, 23843, 26560, 31696, 19856, 25793, 19779, 30988, 23482, 30981, 33135, 22123, 27956,
  /* 13695 */ 23463, 27944, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13710 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13725 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13740 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13755 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13770 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13785 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13800 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13815 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22784, 18847, 33162, 28106, 33197, 25325,
  /* 13830 */ 33232, 29176, 22062, 33275, 35433, 18482, 18484, 33302, 26399, 33339, 27202, 22096, 33356, 28065, 33404,
  /* 13845 */ 24384, 18877, 22229, 18482, 33421, 18482, 18482, 33442, 33460, 24811, 27202, 27202, 26627, 22148, 24758,
  /* 13860 */ 35190, 24384, 24384, 25925, 29611, 18482, 18482, 29290, 25186, 33482, 33501, 27202, 27202, 33518, 36276,
  /* 13875 */ 19503, 33554, 24384, 24384, 33573, 32490, 19647, 18482, 18482, 31235, 33610, 23052, 27202, 27202, 33631,
  /* 13890 */ 27202, 30764, 23993, 24384, 24384, 33670, 24384, 26862, 27492, 18482, 33706, 27867, 32883, 34639, 27202,
  /* 13905 */ 17590, 32036, 24765, 23788, 24384, 18481, 18482, 18482, 27202, 27202, 27203, 33727, 36097, 19887, 25677,
  /* 13920 */ 18482, 23334, 27202, 29150, 19738, 23870, 35357, 30328, 18484, 33748, 34675, 33770, 19466, 34050, 33824,
  /* 13935 */ 31831, 30990, 27868, 34251, 33848, 28913, 33908, 19856, 30469, 33973, 25385, 36033, 34000, 22080, 19438,
  /* 13950 */ 27956, 19678, 27944, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13965 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13980 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 13995 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14010 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14025 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14040 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14055 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14070 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22799, 18847, 34035, 32576, 34084,
  /* 14085 */ 34119, 34135, 34170, 34186, 32150, 36005, 31522, 31886, 34202, 34226, 34267, 29334, 34317, 34354, 34378,
  /* 14100 */ 34421, 26801, 18877, 26195, 29666, 25402, 18482, 35091, 25794, 34460, 34482, 34504, 25832, 35010, 22148,
  /* 14115 */ 34524, 34547, 34570, 19623, 24017, 36654, 35111, 24664, 18482, 32335, 34592, 31312, 34620, 34636, 27202,
  /* 14130 */ 34655, 34691, 28046, 34750, 34774, 24384, 33785, 19647, 34796, 32170, 34844, 24581, 33485, 26704, 34828,
  /* 14145 */ 34860, 35493, 29132, 36704, 33800, 35368, 32941, 34146, 26758, 34895, 18482, 18482, 34932, 34948, 27202,
  /* 14160 */ 32997, 17590, 29944, 34973, 24384, 36296, 25500, 30202, 35875, 35006, 35026, 26266, 20396, 31146, 35061,
  /* 14175 */ 35081, 35127, 24623, 28484, 27897, 19738, 35143, 35170, 26162, 28794, 35206, 35230, 33064, 35245, 23052,
  /* 14190 */ 23296, 29054, 30990, 27868, 34251, 19859, 25794, 34248, 24530, 25147, 35278, 31765, 35316, 33370, 22080,
  /* 14205 */ 19438, 27956, 24072, 28623, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14220 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14235 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14250 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14265 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14280 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14295 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14310 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14325 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22814, 18847, 22034, 34720,
  /* 14340 */ 34059, 35384, 20989, 35400, 35416, 35449, 18482, 18482, 23432, 35475, 27202, 27202, 27202, 35509, 31127,
  /* 14355 */ 24384, 24384, 24384, 35545, 18482, 26871, 35101, 35593, 24855, 25794, 30397, 23502, 26024, 35639, 35658,
  /* 14370 */ 22148, 19541, 19583, 30590, 35674, 27709, 35560, 29107, 18482, 18482, 18482, 18484, 27202, 35694, 27202,
  /* 14385 */ 27202, 27202, 35715, 24384, 36580, 24384, 24384, 24384, 19647, 30215, 18482, 18482, 18482, 23052, 35731,
  /* 14400 */ 27202, 27202, 27202, 27537, 22904, 24384, 24384, 24384, 24384, 23879, 35748, 18482, 18482, 25008, 35770,
  /* 14415 */ 27202, 27202, 17590, 20031, 35787, 24384, 24384, 18481, 18482, 18482, 27202, 27202, 27203, 23997, 24385,
  /* 14430 */ 19887, 25677, 18482, 18483, 27202, 27202, 19738, 23870, 19887, 23898, 18484, 34488, 31802, 25371, 19466,
  /* 14445 */ 23052, 23296, 26426, 30990, 27868, 34251, 19859, 25794, 35804, 19856, 27178, 35833, 33092, 23482, 30981,
  /* 14460 */ 22080, 22212, 28705, 19678, 27944, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14475 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14490 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14505 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14520 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14535 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14550 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14565 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14580 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22829, 18847, 22034,
  /* 14595 */ 35869, 28716, 25325, 31137, 29176, 22062, 26766, 18482, 22558, 18484, 23970, 27202, 29843, 27202, 22096,
  /* 14610 */ 33732, 24384, 31394, 24384, 18877, 18482, 18482, 26880, 18482, 18482, 25794, 27202, 30740, 27202, 27202,
  /* 14625 */ 35010, 22148, 24384, 24891, 24384, 24384, 24017, 31659, 18482, 18482, 18482, 18482, 18484, 27202, 27202,
  /* 14640 */ 27202, 27202, 27202, 19503, 24384, 24384, 24384, 24384, 24384, 19647, 18482, 18482, 18482, 18482, 23052,
  /* 14655 */ 27202, 27202, 27202, 27202, 30764, 23993, 24384, 24384, 24384, 24384, 26758, 18482, 18482, 18482, 27867,
  /* 14670 */ 27202, 27202, 27202, 17590, 23998, 24384, 24384, 24384, 18481, 18482, 18482, 27202, 27202, 27203, 23997,
  /* 14685 */ 24385, 19887, 25677, 18482, 18483, 27202, 27202, 19738, 23870, 19887, 30991, 18484, 27202, 31802, 19425,
  /* 14700 */ 19466, 23052, 23296, 19847, 30990, 27868, 34251, 19859, 25794, 34248, 19856, 25793, 19779, 30988, 23482,
  /* 14715 */ 30981, 22080, 19438, 27956, 19678, 27944, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14730 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14745 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14760 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14775 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14790 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14805 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14820 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14835 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22844, 18847,
  /* 14850 */ 22034, 27849, 27869, 35891, 24384, 35907, 22062, 18482, 18482, 18482, 18484, 27202, 27202, 27202, 27202,
  /* 14865 */ 22096, 24384, 24384, 24384, 24384, 18877, 18482, 18482, 18482, 18482, 18482, 25794, 27202, 27202, 27202,
  /* 14880 */ 27202, 35010, 22148, 24384, 24384, 24384, 24384, 24017, 31575, 18482, 18482, 18482, 18482, 26231, 27202,
  /* 14895 */ 27202, 27202, 27202, 27202, 19503, 35923, 24384, 24384, 24384, 24384, 19647, 18482, 28129, 18482, 18482,
  /* 14910 */ 35941, 27202, 32822, 27202, 32657, 30764, 23993, 24384, 32217, 24384, 32062, 26758, 18482, 18482, 18482,
  /* 14925 */ 27867, 27202, 27202, 27202, 17590, 23998, 24384, 24384, 24384, 18481, 18482, 18482, 27202, 27202, 27203,
  /* 14940 */ 23997, 24385, 19887, 25677, 18482, 18483, 27202, 27202, 19738, 23870, 19887, 30991, 18484, 27202, 31802,
  /* 14955 */ 19425, 19466, 23052, 23296, 19847, 30990, 27868, 34251, 19859, 25794, 34248, 19856, 25793, 19779, 30988,
  /* 14970 */ 23482, 30981, 22080, 19438, 27956, 19678, 27944, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 14985 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15000 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15015 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15030 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15045 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15060 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15075 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15090 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 22859,
  /* 15105 */ 18847, 22034, 35966, 34820, 25325, 33931, 29176, 35988, 18482, 23277, 18482, 36021, 27202, 27202, 36056,
  /* 15120 */ 36073, 22096, 24384, 24384, 36096, 33921, 18877, 18482, 18482, 18482, 18482, 18482, 25794, 27202, 27202,
  /* 15135 */ 27202, 27202, 35010, 22148, 24384, 24384, 24384, 24384, 24017, 36113, 18482, 25577, 18482, 18482, 18484,
  /* 15150 */ 27202, 27202, 27324, 27202, 27202, 36146, 24384, 24384, 34362, 24384, 24384, 19647, 28243, 18482, 18482,
  /* 15165 */ 18482, 23052, 30899, 27202, 27202, 27202, 23686, 23993, 33808, 24384, 24384, 24384, 26758, 18482, 18482,
  /* 15180 */ 18482, 27867, 27202, 27202, 27202, 17590, 23998, 24384, 24384, 24384, 18481, 18482, 18482, 27202, 27202,
  /* 15195 */ 27203, 23997, 24385, 19887, 25677, 18482, 18483, 27202, 27202, 19738, 23870, 19887, 30991, 18484, 27202,
  /* 15210 */ 31802, 19425, 19466, 23052, 23296, 19847, 30990, 27868, 34251, 19859, 25794, 34248, 19856, 25793, 19779,
  /* 15225 */ 30988, 23482, 30981, 22080, 19438, 27956, 19678, 27944, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15240 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15255 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15270 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15285 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15300 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15315 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15330 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15345 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15360 */ 22305, 18847, 22034, 19373, 27869, 36182, 24384, 36198, 22062, 18482, 18482, 18482, 18049, 27202, 27202,
  /* 15375 */ 27202, 35485, 22096, 24384, 24384, 24384, 29371, 18877, 18482, 36214, 18482, 28788, 18482, 25794, 34872,
  /* 15390 */ 27202, 27420, 27202, 35010, 22148, 29380, 24384, 24482, 24384, 24017, 31659, 18482, 36236, 18482, 18482,
  /* 15405 */ 18484, 27202, 36080, 27202, 27202, 27202, 19503, 24384, 28029, 24384, 24384, 24384, 19647, 18482, 18482,
  /* 15420 */ 32122, 18482, 35754, 27202, 27202, 36269, 27202, 33531, 23993, 24384, 24384, 36292, 24384, 36312, 18482,
  /* 15435 */ 18482, 18482, 27867, 27202, 27202, 27202, 17590, 23998, 24384, 24384, 24384, 25730, 18482, 18482, 36345,
  /* 15450 */ 27202, 27203, 19203, 24385, 19887, 25677, 31963, 18483, 27202, 32462, 19738, 23870, 36368, 30991, 18484,
  /* 15465 */ 27202, 31802, 19425, 19466, 23052, 23296, 19847, 30990, 27868, 34251, 19859, 25794, 34248, 19856, 25793,
  /* 15480 */ 19779, 30988, 23482, 30981, 22080, 19438, 27956, 19678, 27944, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15495 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15510 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15525 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15540 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15555 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15570 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15585 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15600 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15615 */ 17590, 22350, 18847, 36388, 19027, 19252, 17687, 36433, 17173, 17595, 36436, 17330, 17349, 18940, 17189,
  /* 15630 */ 17208, 17281, 17675, 36452, 17308, 17327, 17346, 18937, 18460, 21855, 18660, 18676, 19025, 17265, 22008,
  /* 15645 */ 17292, 17421, 21157, 17192, 17682, 21701, 17311, 18669, 19018, 19027, 17447, 32909, 17497, 17520, 17251,
  /* 15660 */ 36410, 17824, 20322, 20663, 20490, 17543, 17559, 17585, 21862, 17504, 17527, 17258, 36417, 21890, 21915,
  /* 15675 */ 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730, 17772, 33538, 21921, 17617, 36472, 18265, 36530,
  /* 15690 */ 17477, 19171, 17902, 17934, 17744, 17795, 17874, 17590, 21595, 17481, 19175, 17906, 18742, 17960, 36550,
  /* 15705 */ 17714, 17976, 18021, 18738, 18692, 18413, 18632, 18081, 18098, 18114, 18159, 18185, 18717, 18094, 18251,
  /* 15720 */ 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849, 36402, 19251, 17838, 17163, 30650, 18400, 17858,
  /* 15735 */ 32918, 17645, 18816, 18429, 18445, 18530, 17393, 18758, 18516, 18546, 17590, 17590, 17590, 17590, 17590,
  /* 15750 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15765 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15780 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15795 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15810 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15825 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15840 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15855 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 15870 */ 17590, 17590, 22335, 18847, 19006, 19027, 19252, 17687, 19027, 21712, 30771, 36436, 17330, 17349, 18940,
  /* 15885 */ 17189, 17208, 17281, 17675, 17991, 17308, 17327, 17346, 18937, 18460, 21855, 18660, 18676, 19025, 17265,
  /* 15900 */ 22008, 17292, 17421, 21157, 17192, 21217, 21848, 17311, 18669, 19018, 19027, 17447, 32909, 17497, 17520,
  /* 15915 */ 17251, 36410, 17824, 20322, 20663, 20490, 17543, 17559, 17585, 21862, 17504, 17527, 17258, 36417, 21890,
  /* 15930 */ 21915, 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730, 17772, 33538, 21921, 17617, 36472, 18265,
  /* 15945 */ 36530, 17477, 19171, 17902, 17934, 17744, 17795, 17874, 17590, 21595, 17481, 19175, 17906, 18742, 17960,
  /* 15960 */ 36550, 17714, 17976, 18021, 18738, 18692, 18413, 18632, 18081, 18098, 18114, 18159, 18185, 18717, 18094,
  /* 15975 */ 18251, 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849, 36402, 19251, 17838, 17163, 30650, 18400,
  /* 15990 */ 17858, 32918, 17645, 18816, 18429, 18445, 18530, 17393, 18758, 18516, 18546, 17590, 17590, 17590, 17590,
  /* 16005 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16020 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16035 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16050 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16065 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16080 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16095 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16110 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16125 */ 17590, 17590, 17590, 21788, 18847, 36488, 19027, 19252, 17687, 19027, 17173, 17779, 36436, 17330, 17349,
  /* 16140 */ 18940, 17189, 17208, 17281, 17675, 17810, 17308, 17327, 17346, 18937, 18460, 21855, 18660, 18676, 19025,
  /* 16155 */ 17265, 22008, 17292, 17421, 21157, 17192, 21165, 21997, 17311, 18669, 19018, 19027, 17447, 32909, 17497,
  /* 16170 */ 17520, 17251, 36410, 17824, 20322, 20663, 20490, 17543, 17559, 17585, 21862, 17504, 17527, 17258, 36417,
  /* 16185 */ 21890, 21915, 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730, 17772, 33538, 21921, 17617, 36472,
  /* 16200 */ 18265, 36530, 17477, 19171, 17902, 17934, 17744, 17795, 17874, 17590, 21595, 17481, 19175, 17906, 18742,
  /* 16215 */ 17960, 36550, 17714, 17976, 18021, 18738, 18692, 18413, 18632, 18081, 18098, 18114, 18159, 18185, 18717,
  /* 16230 */ 18094, 18251, 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849, 36402, 19251, 17838, 17163, 30650,
  /* 16245 */ 18400, 17858, 32918, 17645, 18816, 18429, 18445, 18530, 17393, 18758, 18516, 18546, 17590, 17590, 17590,
  /* 16260 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16275 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16290 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16305 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16320 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16335 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16350 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16365 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16380 */ 17590, 17590, 17590, 17590, 21803, 18847, 19006, 19027, 19252, 17687, 19027, 17173, 30771, 36436, 17330,
  /* 16395 */ 17349, 18940, 17189, 17208, 17281, 17675, 36516, 17308, 17327, 17346, 18937, 18460, 21855, 18660, 18676,
  /* 16410 */ 19025, 17265, 22008, 17292, 17421, 21157, 17192, 21217, 21848, 17311, 18669, 19018, 19027, 17447, 32909,
  /* 16425 */ 17497, 17520, 17251, 36410, 17824, 20322, 20663, 20490, 17543, 17559, 17585, 21862, 17504, 17527, 17258,
  /* 16440 */ 36417, 21890, 21915, 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730, 17772, 33538, 21921, 17617,
  /* 16455 */ 36472, 18265, 36530, 17477, 19171, 17902, 17934, 17744, 17795, 17874, 17590, 21595, 17481, 19175, 17906,
  /* 16470 */ 18742, 17960, 36550, 17714, 17976, 18021, 18738, 18692, 18413, 18632, 18081, 18098, 18114, 18159, 18185,
  /* 16485 */ 18717, 18094, 18251, 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849, 36402, 19251, 17838, 17163,
  /* 16500 */ 30650, 18400, 17858, 32918, 17645, 18816, 18429, 18445, 18530, 17393, 18758, 18516, 18546, 17590, 17590,
  /* 16515 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16530 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16545 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16560 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16575 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16590 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16605 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16620 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16635 */ 17590, 17590, 17590, 17590, 17590, 21803, 18847, 19326, 18482, 27869, 30764, 24384, 29176, 28008, 18482,
  /* 16650 */ 18482, 18482, 18484, 27202, 27202, 27202, 27202, 36566, 24384, 24384, 24384, 24384, 22919, 18482, 18482,
  /* 16665 */ 18482, 18482, 18482, 25794, 27202, 27202, 27202, 27202, 28530, 36613, 24384, 24384, 24384, 24384, 24017,
  /* 16680 */ 18892, 18482, 18482, 18482, 18482, 18484, 27202, 27202, 27202, 27202, 27202, 19503, 24384, 24384, 24384,
  /* 16695 */ 24384, 24384, 19647, 18482, 18482, 18482, 18482, 23052, 27202, 27202, 27202, 27202, 30764, 23993, 24384,
  /* 16710 */ 24384, 24384, 24384, 26758, 18482, 18482, 18482, 27867, 27202, 27202, 27202, 17590, 23998, 24384, 24384,
  /* 16725 */ 24384, 18481, 18482, 18482, 27202, 27202, 27203, 23997, 24385, 19887, 25677, 18482, 18483, 27202, 27202,
  /* 16740 */ 19738, 23870, 19887, 30991, 18484, 27202, 31802, 19425, 19466, 23052, 23296, 19847, 30990, 27868, 34251,
  /* 16755 */ 19859, 25794, 34248, 19856, 25793, 19779, 30988, 23482, 30981, 22080, 19438, 27956, 19678, 27944, 17590,
  /* 16770 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16785 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16800 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16815 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16830 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16845 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16860 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16875 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 16890 */ 17590, 17590, 17590, 17590, 17590, 17590, 36639, 36677, 18731, 19027, 19252, 17687, 19027, 17454, 17595,
  /* 16905 */ 36436, 17330, 17349, 18940, 17189, 17208, 17281, 17675, 17223, 17308, 17327, 17346, 18937, 36741, 21855,
  /* 16920 */ 18660, 18676, 19025, 17265, 22008, 17292, 17421, 21157, 17192, 17682, 21701, 17311, 18669, 19018, 19027,
  /* 16935 */ 17447, 32909, 17497, 17520, 17251, 36410, 17824, 20322, 20663, 20490, 17543, 17559, 17585, 21862, 17504,
  /* 16950 */ 17527, 17258, 36417, 21890, 21915, 17611, 36466, 18259, 17633, 17661, 18368, 17703, 17730, 17772, 33538,
  /* 16965 */ 21921, 17617, 36472, 18265, 36530, 17477, 19171, 17902, 17934, 17744, 17795, 17874, 17590, 21595, 17481,
  /* 16980 */ 19175, 17906, 18742, 17960, 36550, 17714, 17976, 18021, 18738, 18692, 18413, 18632, 18081, 18098, 18114,
  /* 16995 */ 18159, 18185, 18717, 18094, 18251, 18292, 18281, 18308, 18005, 18338, 18354, 18384, 17849, 36402, 19251,
  /* 17010 */ 17838, 17163, 30650, 18400, 17858, 32918, 17645, 18816, 18429, 18445, 18530, 17393, 18758, 18516, 18546,
  /* 17025 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 17040 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 17055 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 17070 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 17085 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 17100 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 17115 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 17130 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590, 17590,
  /* 17145 */ 17590, 17590, 17590, 17590, 17590, 17590, 17590, 0, 94242, 0, 118820, 0, 2211840, 102439, 0, 0, 106538,
  /* 17162 */ 98347, 0, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2482176, 2158592,
  /* 17174 */ 2158592, 2158592, 2158592, 2158592, 2158592, 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27, 2207744, 2404352,
  /* 17191 */ 2412544, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 17202 */ 2207744, 2207744, 2207744, 2207744, 2207744, 3104768, 2605056, 2207744, 2207744, 2207744, 2207744,
  /* 17213 */ 2207744, 2207744, 2678784, 2207744, 2695168, 2207744, 2703360, 2207744, 2711552, 2752512, 2207744, 0, 0,
  /* 17226 */ 0, 0, 0, 0, 2166784, 0, 0, 0, 0, 0, 0, 2158592, 2158592, 3170304, 3174400, 2158592, 0, 139, 0, 2158592,
  /* 17246 */ 2158592, 2158592, 2158592, 2158592, 2424832, 2158592, 2158592, 2158592, 2748416, 2756608, 2777088,
  /* 17257 */ 2801664, 2158592, 2158592, 2158592, 2863104, 2891776, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 17268 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 3104768, 2158592, 2158592, 2158592, 2158592,
  /* 17279 */ 2158592, 2158592, 2207744, 2785280, 2207744, 2809856, 2207744, 2207744, 2842624, 2207744, 2207744,
  /* 17290 */ 2207744, 2899968, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 17301 */ 2207744, 2207744, 2207744, 2564096, 2207744, 2207744, 2207744, 2158592, 2404352, 2412544, 2158592,
  /* 17312 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 17323 */ 2158592, 2564096, 2158592, 2158592, 2605056, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 17334 */ 2678784, 2158592, 2695168, 2158592, 2703360, 2158592, 2711552, 2752512, 2158592, 2158592, 2785280,
  /* 17345 */ 2158592, 2158592, 2785280, 2158592, 2809856, 2158592, 2158592, 2842624, 2158592, 2158592, 2158592,
  /* 17356 */ 2899968, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 18, 0, 0, 0, 0,
  /* 17371 */ 0, 0, 0, 2211840, 0, 0, 641, 0, 2158592, 0, 0, 0, 0, 0, 0, 0, 0, 2211840, 0, 0, 32768, 0, 2158592, 0,
  /* 17395 */ 2158592, 2158592, 2158592, 2383872, 2158592, 2158592, 2158592, 2158592, 3006464, 2383872, 2207744,
  /* 17406 */ 2207744, 2207744, 2207744, 2158877, 2158877, 2158877, 2158877, 0, 0, 0, 2158877, 2572573, 2158877,
  /* 17419 */ 2158877, 0, 2207744, 2207744, 2596864, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2641920,
  /* 17431 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 0, 0, 0, 0, 0, 0, 2162968, 0, 0, 3104768,
  /* 17448 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 17459 */ 2158592, 0, 0, 0, 2146304, 2146304, 2224128, 2224128, 2232320, 2232320, 2232320, 641, 0, 0, 0, 0, 0, 0,
  /* 17477 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2531328, 2158592,
  /* 17488 */ 2158592, 2158592, 2158592, 2158592, 2617344, 2158592, 2158592, 2158592, 2158592, 2441216, 2445312,
  /* 17499 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2502656, 2158592, 2158592, 2158592, 2158592,
  /* 17510 */ 2158592, 2158592, 2158592, 2158592, 2580480, 2158592, 2158592, 2158592, 2158592, 2621440, 2158592,
  /* 17521 */ 2580480, 2158592, 2158592, 2158592, 2158592, 2621440, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 17532 */ 2158592, 2699264, 2158592, 2158592, 2158592, 2158592, 2158592, 2748416, 2756608, 2777088, 2801664,
  /* 17543 */ 2207744, 2863104, 2891776, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 17554 */ 2207744, 2207744, 2207744, 2207744, 3018752, 2207744, 3043328, 2207744, 2207744, 2207744, 2207744,
  /* 17565 */ 3080192, 2207744, 2207744, 3112960, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 0, 0,
  /* 17578 */ 0, 167936, 0, 0, 2162688, 0, 0, 2207744, 2207744, 2207744, 3186688, 2207744, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 17600 */ 0, 0, 0, 0, 0, 0, 2158592, 2158592, 2158592, 2404352, 2412544, 2158592, 2510848, 2158592, 2158592,
  /* 17615 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2584576, 2158592, 2609152, 2158592, 2158592, 2629632,
  /* 17626 */ 2158592, 2158592, 2158592, 2686976, 2158592, 2715648, 2158592, 2158592, 3121152, 2158592, 2158592,
  /* 17637 */ 2158592, 3149824, 2158592, 2158592, 3170304, 3174400, 2158592, 2367488, 2207744, 2207744, 2207744,
  /* 17648 */ 2207744, 2158592, 2158592, 2158592, 2158592, 0, 0, 0, 2158592, 2572288, 2158592, 2158592, 0, 2207744,
  /* 17662 */ 2207744, 2207744, 2433024, 2207744, 2453504, 2461696, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 17673 */ 2207744, 2510848, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 3096576, 2207744, 2207744,
  /* 17684 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 0, 0, 0, 0, 0,
  /* 17699 */ 0, 2162688, 0, 0, 2715648, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2867200,
  /* 17712 */ 2207744, 2904064, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2473984,
  /* 17723 */ 2207744, 2207744, 2494464, 2207744, 2207744, 2207744, 2523136, 2207744, 2207744, 2207744, 2207744,
  /* 17734 */ 3014656, 2207744, 2207744, 3051520, 2207744, 2207744, 3100672, 2207744, 2207744, 3121152, 2207744,
  /* 17745 */ 2207744, 2207744, 2207744, 2207744, 2531328, 2207744, 2207744, 2207744, 2207744, 2207744, 2617344,
  /* 17756 */ 2207744, 2207744, 2207744, 2207744, 2158592, 2158592, 2158592, 2158592, 0, 0, 0, 2158592, 2572288,
  /* 17769 */ 2158592, 2158592, 1508, 2207744, 3149824, 2207744, 2207744, 3170304, 3174400, 2207744, 0, 0, 0, 0, 0, 0,
  /* 17785 */ 0, 0, 0, 0, 138, 2158592, 2158592, 2158592, 2404352, 2412544, 2707456, 2732032, 2207744, 2207744, 2207744,
  /* 17800 */ 2822144, 2826240, 2207744, 2895872, 2207744, 2207744, 2924544, 2207744, 2207744, 2973696, 2207744, 0, 0,
  /* 17813 */ 0, 0, 0, 0, 2166784, 0, 0, 0, 0, 0, 285, 2158592, 2158592, 3112960, 2158592, 2158592, 2158592, 2158592,
  /* 17831 */ 2158592, 2158592, 2158592, 2158592, 2158592, 3186688, 2158592, 2207744, 2207744, 2158592, 2158592,
  /* 17842 */ 2158592, 2158592, 2158592, 0, 0, 0, 2158592, 2158592, 2158592, 2158592, 0, 0, 2535424, 2543616, 2158592,
  /* 17857 */ 2158592, 2158592, 0, 0, 0, 2158592, 2158592, 2158592, 2990080, 2158592, 2158592, 2158592, 2158592,
  /* 17870 */ 2158592, 2158592, 2158592, 2572288, 2981888, 2207744, 2207744, 3002368, 2207744, 3047424, 3063808,
  /* 17881 */ 3076096, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 3203072, 2708960, 2732032,
  /* 17892 */ 2158592, 2158592, 2158592, 2822144, 2827748, 2158592, 2895872, 2158592, 2158592, 2924544, 2158592,
  /* 17903 */ 2158592, 2973696, 2158592, 2981888, 2158592, 2158592, 3002368, 2158592, 3047424, 3063808, 3076096,
  /* 17914 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 3203072, 2981888, 2158592, 2158592,
  /* 17925 */ 3003876, 2158592, 3047424, 3063808, 3076096, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 17936 */ 2158592, 3203072, 2207744, 2207744, 2207744, 2207744, 2207744, 2424832, 2207744, 2207744, 2207744,
  /* 17947 */ 2207744, 2207744, 2207744, 2207744, 0, 0, 0, 172310, 279, 0, 2162688, 0, 0, 2523136, 2527232, 2158592,
  /* 17963 */ 2158592, 2576384, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 17974 */ 2158592, 2908160, 2527232, 2207744, 2207744, 2576384, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 17985 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2908160, 2207744, 0, 0, 0, 0, 0, 0, 2166784, 0, 0, 0, 0, 0,
  /* 18004 */ 286, 2158592, 2158592, 0, 0, 2158592, 2158592, 2158592, 2158592, 2633728, 2658304, 0, 0, 2740224, 2744320,
  /* 18019 */ 0, 2834432, 2207744, 2207744, 2977792, 2207744, 2207744, 2207744, 2207744, 3039232, 2207744, 2207744,
  /* 18031 */ 2207744, 2207744, 2207744, 2207744, 3158016, 0, 0, 29315, 0, 0, 0, 0, 45, 45, 45, 45, 45, 933, 45, 45, 45,
  /* 18052 */ 45, 442, 45, 45, 45, 45, 45, 45, 45, 45, 45, 67, 67, 2494464, 2158592, 2158592, 2158592, 2524757, 2527232,
  /* 18071 */ 2158592, 2158592, 2576384, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 1504, 2158592, 2498560,
  /* 18083 */ 2158592, 2158592, 2158592, 2158592, 2568192, 2158592, 2592768, 2625536, 2158592, 2158592, 2674688,
  /* 18094 */ 2736128, 2158592, 2158592, 0, 2158592, 2912256, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 18106 */ 2158592, 3108864, 2158592, 2158592, 3133440, 3145728, 3153920, 2375680, 2379776, 2207744, 2207744,
  /* 18117 */ 2420736, 2207744, 2449408, 2207744, 2207744, 2207744, 2498560, 2207744, 2207744, 2207744, 2207744,
  /* 18128 */ 2568192, 2207744, 0, 0, 0, 0, 0, 0, 2166784, 0, 0, 0, 0, 0, 551, 2158592, 2158592, 2158592, 2158592,
  /* 18147 */ 2207744, 2506752, 2207744, 2207744, 2207744, 2207744, 2207744, 2158592, 2506752, 0, 2020, 2158592,
  /* 18159 */ 2592768, 2625536, 2207744, 2207744, 2674688, 2736128, 2207744, 2207744, 2207744, 2912256, 2207744,
  /* 18170 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 20480, 0, 0, 0, 0, 0, 2162688, 20480, 0, 2207744,
  /* 18186 */ 3108864, 2207744, 2207744, 3133440, 3145728, 3153920, 2375680, 2379776, 2158592, 2158592, 2420736,
  /* 18197 */ 2158592, 2449408, 2158592, 2158592, 2158592, 2158592, 2158592, 3186688, 2158592, 0, 641, 0, 0, 0, 0, 0, 0,
  /* 18214 */ 2367488, 2158592, 2498560, 2158592, 2158592, 1621, 2158592, 2158592, 2568192, 2158592, 2592768, 2625536,
  /* 18226 */ 2158592, 2158592, 2674688, 0, 0, 0, 0, 0, 1608, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1107, 97, 97,
  /* 18248 */ 1110, 97, 97, 3133440, 3145728, 3153920, 2158592, 2408448, 2416640, 2158592, 2465792, 2158592, 2158592,
  /* 18261 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 3014656, 2158592, 2158592, 3051520, 2158592,
  /* 18272 */ 2158592, 3100672, 2158592, 2158592, 3121152, 2158592, 2158592, 2158592, 3149824, 2416640, 2207744,
  /* 18283 */ 2465792, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2633728, 2658304,
  /* 18294 */ 2740224, 2744320, 2834432, 2949120, 2158592, 2985984, 2158592, 2998272, 2158592, 2158592, 2158592,
  /* 18305 */ 3129344, 2207744, 2408448, 2949120, 2207744, 2985984, 2207744, 2998272, 2207744, 2207744, 2207744,
  /* 18316 */ 3129344, 2158592, 2408448, 2416640, 2158592, 2465792, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 18327 */ 3186688, 2158592, 0, 32768, 0, 0, 0, 0, 0, 0, 2367488, 2949120, 2158592, 2985984, 2158592, 2998272,
  /* 18343 */ 2158592, 2158592, 2158592, 3129344, 2158592, 2158592, 2478080, 2158592, 2158592, 2158592, 2535424,
  /* 18354 */ 2543616, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 3117056,
  /* 18365 */ 2207744, 2207744, 2478080, 2207744, 2207744, 2207744, 2207744, 2207744, 2584576, 2207744, 2609152,
  /* 18376 */ 2207744, 2207744, 2629632, 2207744, 2207744, 2207744, 2686976, 2207744, 2207744, 2535424, 2543616,
  /* 18387 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 3117056, 2158592,
  /* 18398 */ 2158592, 2478080, 2207744, 2207744, 2990080, 2207744, 2207744, 2158592, 2158592, 2482176, 2158592,
  /* 18409 */ 2158592, 0, 0, 0, 2158592, 2158592, 2158592, 0, 2158592, 2908160, 2158592, 2158592, 2158592, 2977792,
  /* 18423 */ 2158592, 2158592, 2158592, 2158592, 3039232, 2158592, 2158592, 3010560, 2207744, 2428928, 2207744,
  /* 18434 */ 2514944, 2207744, 2588672, 2207744, 2838528, 2207744, 2207744, 2207744, 3010560, 2158592, 2428928,
  /* 18445 */ 2158592, 2514944, 0, 0, 2158592, 2588672, 2158592, 0, 2838528, 2158592, 2158592, 2158592, 3010560,
  /* 18458 */ 2158592, 2506752, 2158592, 18, 0, 0, 0, 0, 0, 0, 0, 2211840, 0, 0, 0, 0, 2158592, 0, 0, 29315, 922, 0, 0,
  /* 18481 */ 0, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 67, 67, 3006464, 2383872, 0, 2020,
  /* 18504 */ 2158592, 2158592, 2158592, 2158592, 3006464, 2158592, 2637824, 2953216, 2158592, 2207744, 2637824,
  /* 18515 */ 2953216, 2207744, 0, 0, 2158592, 2637824, 2953216, 2158592, 2539520, 2158592, 2539520, 2207744, 0, 0,
  /* 18529 */ 2539520, 2158592, 2158592, 2158592, 2158592, 2207744, 2506752, 2207744, 2207744, 2207744, 2207744,
  /* 18540 */ 2207744, 2158592, 2506752, 0, 0, 2158592, 2207744, 0, 2158592, 2158592, 2207744, 0, 2158592, 2158592,
  /* 18554 */ 2207744, 0, 2158592, 2965504, 2965504, 2965504, 0, 0, 0, 0, 0, 2158877, 2158877, 2158877, 2158877,
  /* 18569 */ 2158877, 2158877, 2158877, 2158877, 2474269, 2158877, 2158877, 0, 0, 2158877, 2158877, 2158877, 2158877,
  /* 18582 */ 2634013, 2658589, 0, 0, 2740509, 2744605, 0, 2834717, 40976, 18, 36884, 45078, 24, 28, 90143, 94242,
  /* 18598 */ 118820, 102439, 106538, 98347, 118820, 118820, 118820, 40976, 18, 18, 36884, 0, 0, 0, 24, 24, 24, 27, 27,
  /* 18617 */ 27, 27, 90143, 0, 0, 86016, 0, 0, 2211840, 102439, 0, 0, 0, 98347, 0, 2158592, 2158592, 2158592, 2158592,
  /* 18636 */ 2158592, 3158016, 0, 2375680, 2379776, 2158592, 2158592, 2420736, 2158592, 2449408, 2158592, 2158592, 0,
  /* 18649 */ 94242, 0, 0, 0, 2211840, 102439, 0, 0, 106538, 98347, 135, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 18665 */ 2158592, 2564096, 2158592, 2158592, 2158592, 2158592, 2158592, 2596864, 2158592, 2158592, 2158592,
  /* 18676 */ 2158592, 2158592, 2158592, 2641920, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 18687 */ 2158592, 2158592, 2158592, 2781184, 2793472, 2494464, 2158592, 2158592, 2158592, 2523136, 2527232,
  /* 18698 */ 2158592, 2158592, 2576384, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 0, 40976, 0, 18, 18, 24,
  /* 18713 */ 0, 27, 27, 0, 2158592, 2498560, 2158592, 2158592, 0, 2158592, 2158592, 2568192, 2158592, 2592768, 2625536,
  /* 18728 */ 2158592, 2158592, 2674688, 0, 0, 0, 0, 0, 2211840, 0, 0, 0, 0, 0, 0, 2158592, 2158592, 2158592, 2158592,
  /* 18747 */ 2158592, 2158592, 2158592, 2158592, 2473984, 2158592, 2158592, 2494464, 2158592, 2158592, 2158592,
  /* 18758 */ 3006464, 2383872, 0, 0, 2158592, 2158592, 2158592, 2158592, 3006464, 2158592, 2637824, 2953216, 2158592,
  /* 18771 */ 2207744, 2637824, 2953216, 40976, 18, 36884, 45078, 24, 27, 147488, 94242, 147456, 147488, 106538, 98347,
  /* 18786 */ 0, 0, 147456, 40976, 18, 18, 36884, 0, 45078, 0, 24, 24, 24, 27, 27, 27, 27, 0, 81920, 0, 94242, 0, 0, 0,
  /* 18810 */ 2211840, 0, 0, 0, 106538, 98347, 0, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2428928,
  /* 18824 */ 2158592, 2514944, 2158592, 2588672, 2158592, 2838528, 2158592, 2158592, 40976, 18, 151573, 45078, 24, 27,
  /* 18838 */ 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 0, 40976, 18, 18, 36884, 0, 45078, 0, 24, 24, 24, 27, 27,
  /* 18859 */ 27, 27, 90143, 0, 0, 1315, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1487, 97, 18, 131427, 0, 0, 0, 0, 0,
  /* 18885 */ 0, 362, 0, 0, 365, 29315, 367, 0, 0, 29315, 0, 0, 0, 0, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1663, 45, 45,
  /* 18911 */ 45, 45, 45, 45, 45, 45, 45, 183, 45, 45, 45, 45, 201, 45, 130, 94242, 0, 0, 0, 2211840, 102439, 0, 0,
  /* 18934 */ 106538, 98347, 0, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 3096576, 2158592, 2158592,
  /* 18946 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2207744, 2207744, 2158592, 18, 0,
  /* 18959 */ 0, 0, 0, 0, 0, 0, 2211840, 0, 0, 0, 0, 2158592, 644, 2207744, 2207744, 2207744, 3186688, 2207744, 0, 1080,
  /* 18979 */ 0, 1084, 0, 1088, 0, 0, 0, 0, 0, 0, 0, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730,
  /* 18997 */ 2158730, 2158730, 2531466, 2158730, 2158730, 2158730, 2158730, 2158730, 2617482, 0, 94242, 0, 0, 0,
  /* 19011 */ 2211840, 102439, 0, 0, 106538, 98347, 0, 2158592, 2158592, 2158592, 2158592, 2158592, 2781184, 2793472,
  /* 19025 */ 2158592, 2818048, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 19036 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 40976, 18, 36884, 45078, 24, 27, 90143,
  /* 19050 */ 159779, 159744, 102439, 159779, 98347, 0, 0, 159744, 40976, 18, 18, 36884, 0, 45078, 0, 2224253, 172032,
  /* 19067 */ 2224253, 2232448, 2232448, 172032, 2232448, 90143, 0, 0, 2170880, 0, 0, 550, 829, 2158592, 2158592,
  /* 19082 */ 2158592, 2387968, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 0, 40976, 0, 18, 18, 124, 124,
  /* 19097 */ 127, 127, 127, 40976, 18, 36884, 45078, 25, 29, 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 163931,
  /* 19115 */ 40976, 18, 18, 36884, 0, 45078, 249856, 24, 24, 24, 27, 27, 27, 27, 90143, 0, 0, 2170880, 0, 0, 827, 0,
  /* 19137 */ 2158592, 2158592, 2158592, 2387968, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 0, 40976, 0,
  /* 19150 */ 4243810, 4243810, 24, 24, 27, 27, 27, 2207744, 0, 0, 0, 0, 0, 0, 2166784, 0, 0, 0, 0, 57344, 286, 2158592,
  /* 19172 */ 2158592, 2158592, 2158592, 2707456, 2732032, 2158592, 2158592, 2158592, 2822144, 2826240, 2158592,
  /* 19183 */ 2895872, 2158592, 2158592, 2924544, 2158592, 2158592, 2973696, 2158592, 2207744, 2207744, 2207744,
  /* 19194 */ 3186688, 2207744, 0, 0, 0, 0, 0, 0, 53248, 0, 0, 0, 0, 0, 97, 97, 97, 97, 97, 1613, 97, 97, 97, 97, 97,
  /* 19219 */ 97, 1495, 97, 97, 97, 97, 97, 97, 97, 97, 97, 566, 97, 97, 97, 97, 97, 97, 2207744, 0, 0, 0, 0, 0, 0,
  /* 19244 */ 2166784, 546, 0, 0, 0, 0, 286, 2158592, 2158592, 2158592, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 19259 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 17, 18, 36884, 45078, 24,
  /* 19273 */ 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 20480, 120, 121, 18, 18, 36884, 0, 45078, 0, 24, 24, 24,
  /* 19294 */ 27, 27, 27, 27, 90143, 0, 0, 2170880, 0, 53248, 550, 0, 2158592, 2158592, 2158592, 2387968, 2158592,
  /* 19311 */ 2158592, 2158592, 2158592, 2158592, 2158592, 0, 40976, 196608, 18, 266240, 24, 24, 27, 27, 27, 0, 94242,
  /* 19328 */ 0, 0, 0, 38, 102439, 0, 0, 106538, 98347, 0, 45, 45, 45, 45, 45, 45, 45, 1535, 45, 45, 45, 45, 45, 45, 45,
  /* 19353 */ 1416, 45, 45, 45, 45, 45, 45, 45, 45, 424, 45, 45, 45, 45, 45, 45, 45, 45, 45, 405, 45, 45, 45, 45, 45,
  /* 19378 */ 45, 45, 45, 45, 45, 45, 45, 45, 199, 45, 45, 67, 67, 67, 67, 67, 491, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 19404 */ 67, 67, 1766, 67, 67, 67, 1767, 67, 24850, 24850, 12564, 12564, 0, 0, 2166784, 546, 0, 53531, 53531, 0,
  /* 19424 */ 286, 97, 97, 0, 0, 97, 97, 97, 97, 97, 97, 0, 0, 97, 97, 0, 97, 97, 97, 45, 45, 45, 45, 45, 45, 67, 67,
  /* 19451 */ 67, 67, 67, 67, 67, 67, 67, 743, 57889, 0, 2170880, 0, 0, 550, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 45,
  /* 19476 */ 45, 45, 45, 45, 45, 45, 45, 1856, 45, 1858, 1859, 67, 67, 67, 1009, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 19500 */ 67, 67, 1021, 67, 67, 67, 67, 67, 25398, 0, 13112, 0, 54074, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2367773, 2158877,
  /* 19524 */ 2158877, 2158877, 2158877, 2158877, 2158877, 2699549, 2158877, 2158877, 2158877, 2158877, 2158877,
  /* 19535 */ 2748701, 2756893, 2777373, 2801949, 97, 1115, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 857,
  /* 19556 */ 97, 67, 67, 67, 67, 67, 1258, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1826, 67, 97, 97, 97, 97, 97,
  /* 19581 */ 97, 1338, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 870, 97, 97, 67, 67, 67, 1463, 67, 67, 67,
  /* 19606 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1579, 67, 67, 97, 97, 97, 1518, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 19631 */ 97, 97, 97, 97, 97, 904, 905, 97, 97, 97, 97, 1620, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 0, 921, 0,
  /* 19657 */ 0, 0, 0, 0, 0, 45, 1679, 67, 67, 67, 1682, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1690, 67, 0, 0, 97, 97, 97,
  /* 19684 */ 97, 45, 45, 67, 67, 0, 0, 97, 97, 45, 45, 45, 669, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 189,
  /* 19710 */ 45, 45, 45, 1748, 45, 45, 45, 1749, 1750, 45, 45, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 1959, 67, 67,
  /* 19734 */ 67, 67, 1768, 67, 67, 67, 67, 67, 67, 67, 67, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1791, 97, 97, 97, 97,
  /* 19759 */ 97, 97, 97, 97, 45, 45, 45, 45, 45, 45, 1802, 67, 1817, 67, 67, 67, 67, 67, 67, 1823, 67, 67, 67, 67, 97,
  /* 19784 */ 97, 97, 97, 0, 0, 0, 97, 97, 97, 97, 0, 97, 97, 97, 97, 1848, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 19811 */ 659, 45, 45, 45, 45, 45, 45, 45, 1863, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 495, 67, 67, 67,
  /* 19836 */ 67, 67, 1878, 97, 97, 97, 97, 0, 0, 0, 97, 97, 97, 97, 0, 0, 97, 97, 97, 97, 97, 0, 0, 0, 97, 97, 97, 97,
  /* 19864 */ 97, 97, 45, 45, 45, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 97, 97, 97, 97, 0, 0, 0, 1973, 97, 97, 97, 0,
  /* 19891 */ 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1165, 97, 1167, 0, 94242, 0, 0, 0, 2211840, 102439, 0,
  /* 19915 */ 0, 106538, 98347, 136, 2158592, 2158592, 2158592, 2158592, 2158592, 3158016, 229376, 2375680, 2379776,
  /* 19928 */ 2158592, 2158592, 2420736, 2158592, 2449408, 2158592, 2158592, 67, 24850, 24850, 12564, 12564, 0, 0, 280,
  /* 19943 */ 547, 0, 53531, 53531, 0, 286, 97, 97, 0, 0, 97, 97, 97, 97, 97, 97, 0, 0, 97, 97, 1789, 97, 57889, 547,
  /* 19967 */ 547, 0, 0, 550, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 45, 45, 45, 1799, 45, 45, 45, 67, 67, 67, 67, 67,
  /* 19993 */ 25398, 0, 13112, 0, 54074, 0, 0, 1092, 0, 0, 0, 0, 0, 97, 97, 97, 97, 1612, 97, 97, 97, 97, 1616, 97,
  /* 20017 */ 1297, 1472, 0, 0, 0, 0, 1303, 1474, 0, 0, 0, 0, 1309, 1476, 0, 0, 0, 0, 97, 97, 97, 1481, 97, 97, 97, 97,
  /* 20043 */ 97, 97, 1488, 97, 0, 1474, 0, 1476, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 607, 97, 97, 97, 97,
  /* 20068 */ 40976, 18, 36884, 45078, 26, 30, 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 213080, 40976, 18, 36884,
  /* 20086 */ 45078, 24, 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 143448, 40976, 18, 18, 36884, 0, 45078, 0,
  /* 20105 */ 24, 24, 24, 27, 27, 27, 27, 0, 0, 0, 0, 97, 97, 97, 97, 1482, 97, 1483, 97, 97, 97, 97, 97, 97, 1326, 97,
  /* 20131 */ 97, 1329, 1330, 97, 97, 97, 97, 97, 97, 1159, 1160, 97, 97, 97, 97, 97, 97, 97, 97, 590, 97, 97, 97, 97,
  /* 20155 */ 97, 97, 97, 0, 94242, 0, 0, 0, 2211974, 102439, 0, 0, 106538, 98347, 0, 2158730, 2158730, 2158730,
  /* 20173 */ 2158730, 2158730, 2158730, 2158730, 2158730, 2474122, 2158730, 2158730, 2494602, 2158730, 2158730,
  /* 20184 */ 2158730, 2809994, 2158730, 2158730, 2842762, 2158730, 2158730, 2158730, 2900106, 2158730, 2158730,
  /* 20195 */ 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 3014794, 2158730, 2158730, 3051658, 2158730,
  /* 20206 */ 2158730, 3100810, 2158730, 2158730, 2158730, 2158730, 3096714, 2158730, 2158730, 2158730, 2158730,
  /* 20217 */ 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 20228 */ 2572288, 2207744, 2207744, 2207744, 2207744, 541, 541, 543, 543, 0, 0, 2166784, 0, 548, 549, 549, 0, 286,
  /* 20246 */ 2158877, 2158877, 2158877, 2863389, 2892061, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877,
  /* 20257 */ 2158877, 2158877, 2158877, 2158877, 2158877, 3186973, 2158877, 0, 0, 0, 0, 0, 0, 0, 0, 2367626, 2158877,
  /* 20274 */ 2404637, 2412829, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877,
  /* 20285 */ 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2564381, 2158877, 2158877, 2605341,
  /* 20296 */ 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2679069, 2158877, 2695453, 2158877, 2703645,
  /* 20307 */ 2158877, 2711837, 2752797, 2158877, 0, 2158877, 2158877, 2158877, 2384010, 2158730, 2158730, 2158730,
  /* 20319 */ 2158730, 3006602, 2383872, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2441216,
  /* 20330 */ 2445312, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2502656, 2158877, 2785565, 2158877,
  /* 20341 */ 2810141, 2158877, 2158877, 2842909, 2158877, 2158877, 2158877, 2900253, 2158877, 2158877, 2158877,
  /* 20352 */ 2158877, 2158877, 2531613, 2158877, 2158877, 2158877, 2158877, 2158877, 2617629, 2158877, 2158877,
  /* 20363 */ 2158877, 2158877, 2158730, 2818186, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730,
  /* 20374 */ 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 3105053, 2158877,
  /* 20385 */ 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 0, 0,
  /* 20398 */ 0, 0, 0, 97, 97, 97, 1611, 97, 97, 97, 97, 97, 97, 97, 1496, 97, 97, 1499, 97, 97, 97, 97, 97, 2441354,
  /* 20422 */ 2445450, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2502794, 2158730, 2158730, 2158730,
  /* 20433 */ 2158730, 2158730, 2158730, 2158730, 2433162, 2158730, 2453642, 2461834, 2158730, 2158730, 2158730,
  /* 20444 */ 2158730, 2158730, 2158730, 2580618, 2158730, 2158730, 2158730, 2158730, 2621578, 2158730, 2158730,
  /* 20455 */ 2158730, 2158730, 2158730, 2158730, 2699402, 2158730, 2158730, 2158730, 2158730, 2678922, 2158730,
  /* 20466 */ 2695306, 2158730, 2703498, 2158730, 2711690, 2752650, 2158730, 2158730, 2785418, 2158730, 2158730,
  /* 20477 */ 2158730, 3113098, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730,
  /* 20488 */ 3186826, 2158730, 2207744, 2207744, 2207744, 2207744, 2699264, 2207744, 2207744, 2207744, 2207744,
  /* 20499 */ 2207744, 2748416, 2756608, 2777088, 2801664, 2207744, 2207744, 2158877, 2158877, 2158877, 2158877,
  /* 20510 */ 2158877, 0, 0, 0, 2158877, 2158877, 2158877, 2158877, 0, 0, 2535709, 2543901, 2158877, 2158877, 2158877,
  /* 20525 */ 0, 0, 0, 2158877, 2158877, 2158877, 2990365, 2158877, 2158877, 2158730, 2158730, 2158730, 2158730,
  /* 20538 */ 2158730, 2572426, 2158877, 2502941, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877,
  /* 20549 */ 2158877, 2580765, 2158877, 2158877, 2158877, 2158877, 2621725, 2158877, 3019037, 2158877, 3043613,
  /* 20560 */ 2158877, 2158877, 2158877, 2158877, 3080477, 2158877, 2158877, 3113245, 2158877, 2158877, 2158877,
  /* 20571 */ 2158877, 0, 2158877, 2908445, 2158877, 2158877, 2158877, 2978077, 2158877, 2158877, 2158877, 2158877,
  /* 20583 */ 3039517, 2158877, 2158730, 2510986, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730,
  /* 20594 */ 2584714, 2158730, 2609290, 2158730, 2158730, 2629770, 2158730, 2158730, 2158730, 2388106, 2158730,
  /* 20605 */ 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730,
  /* 20616 */ 2158730, 2605194, 2158730, 2158730, 2158730, 2158730, 2687114, 2158730, 2715786, 2158730, 2158730,
  /* 20627 */ 2158730, 2158730, 2158730, 2158730, 2158730, 2867338, 2158730, 2904202, 2158730, 2158730, 2158730,
  /* 20638 */ 2642058, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730,
  /* 20649 */ 2781322, 2793610, 2158730, 3121290, 2158730, 2158730, 2158730, 3149962, 2158730, 2158730, 3170442,
  /* 20660 */ 3174538, 2158730, 2367488, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 20671 */ 2580480, 2207744, 2207744, 2207744, 2207744, 2621440, 2207744, 2207744, 2158877, 2433309, 2158877,
  /* 20682 */ 2453789, 2461981, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2511133, 2158877, 2158877,
  /* 20693 */ 2158877, 2158877, 2584861, 2158877, 2609437, 2158877, 2158877, 2629917, 2158877, 2158877, 2158877,
  /* 20704 */ 2687261, 2158877, 2715933, 2158877, 2158730, 2158730, 2973834, 2158730, 2982026, 2158730, 2158730,
  /* 20715 */ 3002506, 2158730, 3047562, 3063946, 3076234, 2158730, 2158730, 2158730, 2158730, 2207744, 2506752,
  /* 20726 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2158877, 2507037, 0, 0, 2158877, 2158730, 2158730, 2158730,
  /* 20739 */ 3203210, 2207744, 2207744, 2207744, 2207744, 2207744, 2424832, 2207744, 2207744, 2207744, 2207744,
  /* 20750 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 0, 823, 0, 825, 2707741, 2732317,
  /* 20764 */ 2158877, 2158877, 2158877, 2822429, 2826525, 2158877, 2896157, 2158877, 2158877, 2924829, 2158877,
  /* 20775 */ 2158877, 2973981, 2158877, 18, 0, 0, 0, 0, 0, 0, 0, 2211840, 0, 0, 642, 0, 2158592, 0, 45, 1529, 45, 45,
  /* 20797 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1755, 45, 67, 67, 2982173, 2158877, 2158877, 3002653, 2158877,
  /* 20817 */ 3047709, 3064093, 3076381, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 3203357,
  /* 20828 */ 2523274, 2527370, 2158730, 2158730, 2576522, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730,
  /* 20839 */ 2158730, 2158730, 2158730, 2158730, 2908298, 2494749, 2158877, 2158877, 2158877, 2523421, 2527517,
  /* 20850 */ 2158877, 2158877, 2576669, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 0, 40976, 0, 18, 18,
  /* 20864 */ 4321280, 2224253, 2232448, 4329472, 2232448, 2158730, 2498698, 2158730, 2158730, 2158730, 2158730,
  /* 20875 */ 2568330, 2158730, 2592906, 2625674, 2158730, 2158730, 2674826, 2736266, 2158730, 2158730, 2158730,
  /* 20886 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 20897 */ 2207744, 2207744, 2207744, 2158730, 2912394, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730,
  /* 20908 */ 2158730, 3109002, 2158730, 2158730, 3133578, 3145866, 3154058, 2375680, 2207744, 3108864, 2207744,
  /* 20919 */ 2207744, 3133440, 3145728, 3153920, 2375965, 2380061, 2158877, 2158877, 2421021, 2158877, 2449693,
  /* 20930 */ 2158877, 2158877, 2158877, 3117341, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730,
  /* 20941 */ 2158730, 2158730, 2158730, 2158730, 2158730, 3104906, 2158730, 2158730, 2158730, 2158730, 2158730,
  /* 20952 */ 2158730, 2158877, 2498845, 2158877, 2158877, 0, 2158877, 2158877, 2568477, 2158877, 2593053, 2625821,
  /* 20964 */ 2158877, 2158877, 2674973, 0, 0, 0, 0, 97, 97, 1480, 97, 97, 97, 97, 97, 1485, 97, 97, 97, 0, 97, 97,
  /* 20986 */ 1729, 97, 1731, 97, 97, 97, 97, 97, 97, 97, 311, 97, 97, 97, 97, 97, 97, 97, 97, 1520, 97, 97, 1523, 97,
  /* 21010 */ 97, 1526, 97, 2736413, 2158877, 2158877, 0, 2158877, 2912541, 2158877, 2158877, 2158877, 2158877, 2158877,
  /* 21024 */ 2158877, 2158877, 3109149, 2158877, 2158877, 3014941, 2158877, 2158877, 3051805, 2158877, 2158877,
  /* 21035 */ 3100957, 2158877, 2158877, 3121437, 2158877, 2158877, 2158877, 3150109, 3133725, 3146013, 3154205,
  /* 21046 */ 2158730, 2408586, 2416778, 2158730, 2465930, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730,
  /* 21057 */ 2158730, 2158730, 3018890, 2158730, 3043466, 2158730, 2158730, 2158730, 2158730, 3080330, 2633866,
  /* 21068 */ 2658442, 2740362, 2744458, 2834570, 2949258, 2158730, 2986122, 2158730, 2998410, 2158730, 2158730,
  /* 21079 */ 2158730, 3129482, 2207744, 2408448, 2949120, 2207744, 2985984, 2207744, 2998272, 2207744, 2207744,
  /* 21090 */ 2207744, 3129344, 2158877, 2408733, 2416925, 2158877, 2466077, 2158877, 2158877, 3170589, 3174685,
  /* 21101 */ 2158877, 0, 0, 0, 2158730, 2158730, 2158730, 2158730, 2158730, 2424970, 2158730, 2158730, 2158730,
  /* 21114 */ 2158730, 2707594, 2732170, 2158730, 2158730, 2158730, 2822282, 2826378, 2158730, 2896010, 2158730,
  /* 21125 */ 2158730, 2924682, 2949405, 2158877, 2986269, 2158877, 2998557, 2158877, 2158877, 2158877, 3129629,
  /* 21136 */ 2158730, 2158730, 2478218, 2158730, 2158730, 2158730, 2535562, 2543754, 2158730, 2158730, 2158730,
  /* 21147 */ 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 3117194, 2207744, 2207744, 2478080, 2207744,
  /* 21158 */ 2207744, 2207744, 2207744, 2781184, 2793472, 2207744, 2818048, 2207744, 2207744, 2207744, 2207744,
  /* 21169 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 0, 541, 0, 543, 2207744, 2535424,
  /* 21183 */ 2543616, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 3117056,
  /* 21194 */ 2158877, 2158877, 2478365, 0, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158730, 2158730,
  /* 21206 */ 2482314, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730, 2207744, 2207744, 2207744, 2387968,
  /* 21217 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744,
  /* 21228 */ 2207744, 0, 542, 0, 544, 2158730, 2158730, 2158730, 2990218, 2158730, 2158730, 2207744, 2207744, 2482176,
  /* 21242 */ 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 0, 0, 0, 0, 0, 0, 2162688, 135, 0, 2207744,
  /* 21259 */ 2207744, 2990080, 2207744, 2207744, 2158877, 2158877, 2482461, 2158877, 2158877, 0, 0, 0, 2158877,
  /* 21272 */ 2158877, 2158877, 2158877, 2158877, 2158730, 2429066, 2158730, 2515082, 2158730, 2588810, 2158730,
  /* 21283 */ 2838666, 2158730, 2158730, 2158730, 3010698, 2207744, 2428928, 2207744, 2514944, 2207744, 2588672,
  /* 21294 */ 2207744, 2838528, 2207744, 2207744, 2207744, 3010560, 2158877, 2429213, 2158877, 2515229, 0, 0, 2158877,
  /* 21307 */ 2588957, 2158877, 0, 2838813, 2158877, 2158877, 2158877, 3010845, 2158730, 2506890, 2158730, 2158730,
  /* 21319 */ 2158730, 2748554, 2756746, 2777226, 2801802, 2158730, 2158730, 2158730, 2863242, 2891914, 2158730,
  /* 21330 */ 2158730, 2158730, 2158730, 2158730, 2158730, 2564234, 2158730, 2158730, 2158730, 2158730, 2158730,
  /* 21341 */ 2597002, 2158730, 2158730, 2158730, 3006464, 2384157, 0, 0, 2158877, 2158877, 2158877, 2158877, 3006749,
  /* 21354 */ 2158730, 2637962, 2953354, 2158730, 2207744, 2637824, 2953216, 2207744, 0, 0, 2158877, 2638109, 2953501,
  /* 21367 */ 2158877, 2539658, 2158730, 2539520, 2207744, 0, 0, 2539805, 2158877, 2158730, 2158730, 2158730, 2977930,
  /* 21380 */ 2158730, 2158730, 2158730, 2158730, 3039370, 2158730, 2158730, 2158730, 2158730, 2158730, 2158730,
  /* 21391 */ 3158154, 2207744, 0, 2158877, 2158730, 2207744, 0, 2158877, 2158730, 2207744, 0, 2158877, 2965642,
  /* 21404 */ 2965504, 2965789, 0, 0, 0, 0, 1315, 0, 0, 0, 0, 97, 97, 97, 97, 97, 97, 97, 1484, 97, 97, 97, 97, 2158592,
  /* 21428 */ 18, 0, 122880, 0, 0, 0, 77824, 0, 2211840, 0, 0, 0, 0, 2158592, 0, 356, 0, 0, 0, 0, 0, 0, 28809, 0, 139,
  /* 21453 */ 45, 45, 45, 45, 45, 45, 1751, 45, 45, 45, 45, 45, 45, 45, 67, 67, 1427, 67, 67, 67, 67, 67, 1432, 67, 67,
  /* 21478 */ 67, 3104768, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 21490 */ 2158592, 2158592, 122880, 0, 0, 0, 0, 1315, 0, 0, 0, 0, 97, 97, 97, 97, 97, 97, 1322, 550, 0, 286, 0,
  /* 21513 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2424832, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 21524 */ 2158592, 0, 40976, 0, 18, 18, 24, 24, 4329472, 27, 27, 2207744, 2207744, 2977792, 2207744, 2207744,
  /* 21540 */ 2207744, 2207744, 3039232, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 3158016, 542, 0, 0, 0,
  /* 21554 */ 542, 0, 544, 0, 0, 0, 544, 0, 550, 0, 0, 0, 0, 0, 97, 97, 1610, 97, 97, 97, 97, 97, 97, 97, 97, 898, 97,
  /* 21581 */ 97, 97, 97, 97, 97, 97, 0, 94242, 0, 0, 0, 2211840, 0, 0, 0, 0, 0, 0, 2158592, 2158592, 2158592, 2158592,
  /* 21603 */ 2158592, 2424832, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 40976, 18, 36884, 45078, 24, 27,
  /* 21617 */ 90143, 94242, 237568, 102439, 106538, 98347, 0, 0, 20480, 40976, 18, 36884, 45078, 24, 27, 90143, 94242,
  /* 21634 */ 0, 102439, 106538, 98347, 0, 0, 192512, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 0, 102439, 106538,
  /* 21652 */ 98347, 0, 0, 94, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 96, 40976,
  /* 21672 */ 18, 36884, 45078, 24, 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 12378, 40976, 18, 18, 36884, 0,
  /* 21691 */ 45078, 0, 24, 24, 24, 126, 126, 126, 126, 90143, 0, 0, 2170880, 0, 0, 0, 0, 2158592, 2158592, 2158592,
  /* 21711 */ 2387968, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 20480, 40976, 0, 18, 18, 24, 24, 27, 27,
  /* 21727 */ 27, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 241664, 102439, 106538, 98347, 0, 0, 20568, 40976, 18,
  /* 21745 */ 36884, 45078, 24, 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 200797, 40976, 18, 36884, 45078, 24,
  /* 21763 */ 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 20480, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 0,
  /* 21782 */ 0, 0, 44, 0, 0, 20575, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 0, 41, 41, 41, 0, 0, 1126400, 40976,
  /* 21804 */ 18, 36884, 45078, 24, 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 0, 40976, 18, 36884, 45078, 24,
  /* 21823 */ 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 89, 40976, 18, 18, 36884, 0, 45078, 0, 24, 24, 24, 27,
  /* 21844 */ 131201, 27, 27, 90143, 0, 0, 2170880, 0, 0, 550, 0, 2158592, 2158592, 2158592, 2387968, 2158592, 2158592,
  /* 21861 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2441216,
  /* 21872 */ 2445312, 2158592, 2158592, 2158592, 2158592, 2158592, 0, 94242, 0, 0, 208896, 2211840, 102439, 0, 0,
  /* 21887 */ 106538, 98347, 0, 2158592, 2158592, 2158592, 2158592, 2158592, 3186688, 2158592, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 21905 */ 2367488, 32768, 0, 0, 0, 0, 0, 0, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 21921 */ 2158592, 2433024, 2158592, 2453504, 2461696, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 21932 */ 2510848, 2158592, 2158592, 2158592, 2158592, 40976, 18, 36884, 245783, 24, 27, 90143, 94242, 0, 102439,
  /* 21947 */ 106538, 98347, 0, 0, 20480, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0,
  /* 21966 */ 221184, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 180224, 40976, 18,
  /* 21984 */ 18, 36884, 155648, 45078, 0, 24, 24, 217088, 27, 27, 27, 217088, 90143, 0, 0, 2170880, 0, 0, 828, 0,
  /* 22004 */ 2158592, 2158592, 2158592, 2387968, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2207744,
  /* 22015 */ 2207744, 2207744, 2387968, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 0, 0, 0, 0, 0,
  /* 22030 */ 0, 2162688, 233472, 0, 0, 94242, 0, 0, 0, 38, 102439, 0, 0, 106538, 98347, 28809, 45, 45, 45, 45, 45, 718,
  /* 22052 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 727, 131427, 0, 0, 0, 0, 362, 0, 365, 28809, 367, 139, 45, 45, 45, 45,
  /* 22077 */ 45, 45, 1808, 45, 45, 45, 45, 67, 67, 67, 67, 67, 67, 67, 97, 97, 0, 0, 97, 67, 24850, 24850, 12564,
  /* 22100 */ 12564, 0, 57889, 0, 0, 0, 53531, 53531, 367, 286, 97, 97, 0, 0, 97, 97, 97, 97, 97, 97, 0, 1788, 97, 97,
  /* 22124 */ 0, 97, 2024, 97, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 67, 67, 67, 235, 67, 67, 67, 67, 67, 57889,
  /* 22149 */ 0, 0, 54074, 54074, 550, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 45, 1798, 45, 45, 1800, 45, 45, 0, 1472,
  /* 22173 */ 0, 0, 0, 0, 0, 1474, 0, 0, 0, 0, 0, 1476, 0, 0, 0, 0, 1315, 0, 0, 0, 0, 97, 97, 97, 97, 1320, 97, 97, 0,
  /* 22202 */ 0, 97, 97, 97, 97, 97, 97, 1787, 0, 97, 97, 0, 97, 97, 97, 45, 45, 45, 45, 2029, 45, 67, 67, 67, 67, 2033,
  /* 22228 */ 1527, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 663, 67, 24850, 24850, 12564, 12564, 0,
  /* 22251 */ 57889, 281, 0, 0, 53531, 53531, 367, 286, 97, 97, 0, 0, 97, 97, 97, 97, 1786, 97, 0, 0, 97, 97, 0, 1790,
  /* 22275 */ 40976, 19, 36884, 45078, 24, 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 262144, 40976, 18, 36884,
  /* 22293 */ 45078, 24, 27, 90143, 94242, 38, 102439, 106538, 98347, 46, 67, 98, 40976, 18, 36884, 45078, 24, 27,
  /* 22311 */ 90143, 94242, 38, 102439, 106538, 98347, 45, 67, 97, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 0,
  /* 22329 */ 102439, 106538, 98347, 0, 0, 258048, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 0, 102439, 106538,
  /* 22346 */ 98347, 0, 0, 1122423, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 0, 1114152, 1114152, 1114152, 0, 0,
  /* 22364 */ 1114112, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 37, 102439, 106538, 98347, 0, 0, 204800, 40976,
  /* 22381 */ 18, 36884, 45078, 24, 27, 90143, 94242, 0, 102439, 106538, 98347, 0, 0, 57436, 40976, 18, 36884, 45078,
  /* 22399 */ 24, 27, 33, 33, 0, 33, 33, 33, 0, 0, 0, 40976, 18, 18, 36884, 0, 45078, 0, 124, 124, 124, 127, 127, 127,
  /* 22423 */ 127, 90143, 0, 0, 2170880, 0, 0, 550, 0, 2158877, 2158877, 2158877, 2388253, 2158877, 2158877, 2158877,
  /* 22439 */ 2158877, 2158877, 2781469, 2793757, 2158877, 2818333, 2158877, 2158877, 2158877, 2158877, 2158877,
  /* 22450 */ 2158877, 2158877, 2867485, 2158877, 2904349, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877,
  /* 22461 */ 2158877, 3096861, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877,
  /* 22472 */ 2441501, 2445597, 2158877, 2158877, 2158877, 2158877, 2158877, 40976, 122, 123, 36884, 0, 45078, 0, 24,
  /* 22487 */ 24, 24, 27, 27, 27, 27, 90143, 0, 921, 29315, 0, 0, 0, 0, 45, 45, 45, 45, 45, 45, 45, 45, 936, 2158592,
  /* 22511 */ 4243810, 0, 0, 0, 0, 0, 0, 0, 2211840, 0, 0, 0, 0, 2158592, 0, 921, 29315, 0, 0, 0, 0, 45, 45, 45, 45, 45,
  /* 22537 */ 45, 45, 935, 45, 45, 45, 715, 45, 45, 45, 45, 45, 45, 45, 723, 45, 45, 45, 45, 45, 1182, 45, 45, 45, 45,
  /* 22562 */ 45, 45, 45, 45, 45, 45, 430, 45, 45, 45, 45, 45, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38,
  /* 22583 */ 102439, 106538, 98347, 47, 68, 99, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38, 102439, 106538,
  /* 22600 */ 98347, 48, 69, 100, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38, 102439, 106538, 98347, 49, 70, 101,
  /* 22619 */ 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38, 102439, 106538, 98347, 50, 71, 102, 40976, 18, 36884,
  /* 22637 */ 45078, 24, 27, 90143, 94242, 38, 102439, 106538, 98347, 51, 72, 103, 40976, 18, 36884, 45078, 24, 27,
  /* 22655 */ 90143, 94242, 38, 102439, 106538, 98347, 52, 73, 104, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38,
  /* 22673 */ 102439, 106538, 98347, 53, 74, 105, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38, 102439, 106538,
  /* 22690 */ 98347, 54, 75, 106, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38, 102439, 106538, 98347, 55, 76, 107,
  /* 22709 */ 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38, 102439, 106538, 98347, 56, 77, 108, 40976, 18, 36884,
  /* 22727 */ 45078, 24, 27, 90143, 94242, 38, 102439, 106538, 98347, 57, 78, 109, 40976, 18, 36884, 45078, 24, 27,
  /* 22745 */ 90143, 94242, 38, 102439, 106538, 98347, 58, 79, 110, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38,
  /* 22763 */ 102439, 106538, 98347, 59, 80, 111, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38, 102439, 106538,
  /* 22780 */ 98347, 60, 81, 112, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38, 102439, 106538, 98347, 61, 82, 113,
  /* 22799 */ 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38, 102439, 106538, 98347, 62, 83, 114, 40976, 18, 36884,
  /* 22817 */ 45078, 24, 27, 90143, 94242, 38, 102439, 106538, 98347, 63, 84, 115, 40976, 18, 36884, 45078, 24, 27,
  /* 22835 */ 90143, 94242, 38, 102439, 106538, 98347, 64, 85, 116, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38,
  /* 22853 */ 102439, 106538, 98347, 65, 86, 117, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 38, 102439, 106538,
  /* 22870 */ 98347, 66, 87, 118, 40976, 18, 36884, 45078, 24, 27, 90143, 94242, 118820, 102439, 106538, 98347, 118820,
  /* 22887 */ 118820, 118820, 40976, 18, 18, 0, 0, 45078, 0, 24, 24, 24, 27, 27, 27, 27, 90143, 0, 0, 1314, 0, 0, 0, 0,
  /* 22911 */ 0, 0, 97, 97, 97, 97, 97, 1321, 97, 18, 131427, 0, 0, 0, 0, 0, 0, 362, 0, 0, 365, 0, 367, 0, 0, 1315, 0,
  /* 22938 */ 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1360, 97, 97, 131, 94242, 0, 0, 0, 38, 102439, 0, 0,
  /* 22963 */ 106538, 98347, 28809, 45, 45, 45, 145, 149, 45, 45, 45, 45, 45, 174, 45, 179, 45, 185, 45, 188, 45, 45,
  /* 22985 */ 202, 67, 255, 67, 67, 269, 67, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809, 53531, 97, 97, 97, 292, 296, 97,
  /* 23008 */ 97, 97, 97, 97, 321, 97, 326, 97, 332, 97, 18, 131427, 0, 0, 0, 0, 0, 0, 362, 0, 0, 365, 29315, 367, 646,
  /* 23033 */ 335, 97, 97, 349, 97, 97, 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27, 437, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 23058 */ 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 67, 67, 67, 523, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 23084 */ 511, 67, 67, 67, 97, 97, 97, 620, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1501, 1502, 97, 793,
  /* 23109 */ 67, 67, 796, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 808, 67, 0, 0, 97, 97, 97, 97, 45, 45, 67, 67, 0, 0,
  /* 23136 */ 97, 97, 2052, 67, 67, 67, 67, 813, 67, 67, 67, 67, 67, 67, 67, 25398, 542, 13112, 544, 57889, 0, 0, 54074,
  /* 23159 */ 54074, 550, 830, 97, 97, 97, 97, 97, 97, 97, 97, 97, 315, 97, 97, 97, 97, 97, 97, 841, 97, 97, 97, 97, 97,
  /* 23184 */ 97, 97, 97, 97, 854, 97, 97, 97, 97, 97, 97, 589, 97, 97, 97, 97, 97, 97, 97, 97, 97, 867, 97, 97, 97, 97,
  /* 23210 */ 97, 97, 97, 891, 97, 97, 894, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 906, 45, 937, 45, 45, 940, 45, 45,
  /* 23235 */ 45, 45, 45, 45, 948, 45, 45, 45, 45, 45, 734, 735, 67, 737, 67, 738, 67, 740, 67, 67, 67, 45, 967, 45, 45,
  /* 23260 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 435, 45, 45, 45, 980, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 23286 */ 45, 45, 45, 45, 415, 45, 45, 67, 67, 1024, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 97, 97, 97,
  /* 23312 */ 67, 67, 67, 67, 67, 25398, 1081, 13112, 1085, 54074, 1089, 0, 0, 0, 0, 0, 0, 363, 0, 28809, 0, 139, 45,
  /* 23335 */ 45, 45, 45, 45, 45, 1674, 45, 45, 45, 45, 45, 45, 45, 45, 67, 1913, 67, 1914, 67, 67, 67, 1918, 67, 67,
  /* 23359 */ 97, 97, 97, 97, 1118, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 630, 97, 97, 97, 97, 97, 1169, 97, 97,
  /* 23384 */ 97, 97, 97, 0, 921, 0, 1175, 0, 0, 0, 0, 45, 45, 45, 45, 45, 45, 1534, 45, 45, 45, 45, 45, 1538, 45, 45,
  /* 23410 */ 45, 45, 1233, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 67, 67, 67, 742, 67, 45, 45, 1191, 45, 45, 45,
  /* 23435 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 454, 67, 67, 67, 67, 1243, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 23461 */ 67, 1251, 67, 0, 0, 97, 97, 97, 97, 45, 45, 67, 67, 2050, 0, 97, 97, 45, 45, 45, 732, 45, 45, 67, 67, 67,
  /* 23487 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 97, 97, 67, 67, 67, 1284, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 23513 */ 67, 772, 67, 67, 67, 1293, 67, 67, 67, 67, 67, 67, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 368, 2158592, 2158592,
  /* 23538 */ 2158592, 2404352, 2412544, 1323, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1331, 97, 97, 97, 0, 97, 97,
  /* 23560 */ 97, 97, 97, 97, 97, 97, 97, 97, 97, 1737, 97, 1364, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1373,
  /* 23585 */ 97, 18, 131427, 0, 0, 0, 0, 0, 0, 362, 0, 0, 365, 29315, 367, 647, 45, 45, 1387, 45, 45, 1391, 45, 45, 45,
  /* 23610 */ 45, 45, 45, 45, 45, 45, 45, 410, 45, 45, 45, 45, 45, 1400, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1407,
  /* 23635 */ 45, 45, 45, 45, 45, 941, 45, 943, 45, 45, 45, 45, 45, 45, 951, 45, 67, 1438, 67, 67, 67, 67, 67, 67, 67,
  /* 23660 */ 67, 67, 67, 1447, 67, 67, 67, 67, 67, 67, 799, 67, 67, 67, 804, 67, 67, 67, 67, 67, 67, 67, 1443, 67, 67,
  /* 23685 */ 1446, 67, 67, 67, 67, 67, 67, 67, 1298, 0, 0, 0, 1304, 0, 0, 0, 1310, 97, 1491, 97, 97, 97, 97, 97, 97,
  /* 23710 */ 97, 97, 97, 97, 1500, 97, 97, 97, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1736, 97, 45, 45, 1541, 45,
  /* 23735 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 677, 45, 45, 67, 1581, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 23761 */ 67, 67, 67, 67, 67, 791, 792, 67, 67, 67, 67, 1598, 67, 1600, 67, 67, 67, 67, 67, 67, 67, 67, 1472, 97,
  /* 23785 */ 97, 97, 1727, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1513, 97, 97, 67, 67, 97, 1879, 97,
  /* 23809 */ 1881, 97, 0, 1884, 0, 97, 97, 97, 97, 0, 0, 97, 97, 97, 97, 97, 0, 0, 0, 1842, 97, 97, 67, 67, 67, 67, 67,
  /* 23836 */ 97, 97, 97, 97, 1928, 0, 0, 0, 97, 97, 97, 97, 97, 97, 45, 45, 45, 45, 45, 1903, 45, 45, 45, 67, 67, 67,
  /* 23862 */ 67, 97, 97, 97, 97, 1971, 0, 0, 97, 97, 97, 97, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 0, 0, 0, 45, 45,
  /* 23889 */ 45, 1381, 45, 45, 45, 45, 1976, 97, 97, 97, 97, 97, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1747,
  /* 23914 */ 809, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 25398, 542, 13112, 544, 97, 907, 97, 97, 97, 97, 97, 97,
  /* 23938 */ 97, 97, 97, 97, 97, 638, 0, 0, 0, 0, 1478, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1150, 97, 97, 97,
  /* 23964 */ 97, 67, 67, 67, 67, 1244, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 477, 67, 67, 67, 67, 67, 67, 1294,
  /* 23989 */ 67, 67, 67, 67, 0, 0, 0, 0, 0, 0, 0, 0, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1324,
  /* 24017 */ 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 0, 0, 0, 1374, 97, 97, 97, 97, 0, 1175, 0, 45, 45, 45,
  /* 24044 */ 45, 45, 45, 45, 45, 945, 45, 45, 45, 45, 45, 45, 45, 45, 1908, 45, 45, 1910, 45, 67, 67, 67, 67, 67, 67,
  /* 24069 */ 67, 67, 1919, 67, 0, 0, 97, 97, 97, 97, 45, 2048, 67, 2049, 0, 0, 97, 2051, 45, 45, 45, 939, 45, 45, 45,
  /* 24094 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 397, 45, 45, 45, 1921, 67, 67, 1923, 67, 97, 97, 97, 97, 97, 0, 0, 0,
  /* 24120 */ 97, 97, 97, 97, 97, 97, 45, 45, 45, 45, 1947, 45, 1935, 0, 0, 0, 97, 1939, 97, 97, 1941, 97, 45, 45, 45,
  /* 24145 */ 45, 45, 45, 382, 389, 45, 45, 45, 45, 45, 45, 45, 45, 1810, 45, 45, 1812, 67, 67, 67, 67, 67, 256, 67, 67,
  /* 24170 */ 67, 67, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809, 53531, 336, 97, 97, 97, 97, 97, 0, 40976, 0, 18, 18, 24,
  /* 24194 */ 24, 27, 27, 27, 131427, 0, 0, 0, 0, 362, 0, 365, 28809, 367, 139, 45, 45, 371, 373, 45, 45, 45, 955, 45,
  /* 24218 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 413, 45, 45, 45, 457, 459, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 24243 */ 473, 67, 478, 67, 67, 482, 67, 67, 485, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 97, 1828, 97,
  /* 24268 */ 554, 556, 97, 97, 97, 97, 97, 97, 97, 97, 570, 97, 575, 97, 97, 579, 97, 97, 582, 97, 97, 97, 97, 97, 97,
  /* 24293 */ 97, 97, 97, 97, 97, 97, 97, 330, 97, 97, 67, 746, 67, 67, 67, 67, 67, 67, 67, 67, 67, 758, 67, 67, 67, 67,
  /* 24319 */ 67, 67, 67, 1587, 67, 1589, 67, 67, 67, 67, 67, 67, 67, 97, 1706, 97, 97, 97, 1709, 97, 97, 97, 97, 97,
  /* 24343 */ 844, 97, 97, 97, 97, 97, 97, 97, 97, 97, 856, 97, 97, 97, 0, 97, 97, 97, 97, 97, 97, 97, 97, 1735, 97, 97,
  /* 24369 */ 97, 0, 97, 97, 97, 97, 97, 97, 97, 1642, 97, 1644, 97, 97, 890, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 24394 */ 97, 97, 97, 97, 97, 97, 0, 67, 67, 67, 67, 1065, 1066, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 532, 67,
  /* 24419 */ 67, 67, 67, 67, 67, 67, 1451, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 496, 67, 67, 97, 97,
  /* 24444 */ 1505, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 593, 97, 97, 0, 1474, 0, 1476, 0, 97, 97, 97,
  /* 24469 */ 97, 97, 97, 97, 97, 97, 97, 1617, 97, 97, 1635, 0, 1637, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 885,
  /* 24494 */ 97, 97, 97, 97, 67, 67, 1704, 67, 67, 67, 67, 97, 97, 97, 97, 97, 97, 97, 97, 97, 565, 572, 97, 97, 97,
  /* 24519 */ 97, 97, 97, 97, 97, 1832, 0, 97, 97, 97, 97, 97, 0, 0, 0, 97, 97, 97, 97, 97, 97, 45, 45, 45, 1946, 45,
  /* 24545 */ 45, 67, 67, 67, 67, 67, 97, 1926, 97, 1927, 97, 0, 0, 0, 97, 97, 1934, 2043, 0, 0, 97, 97, 97, 2047, 45,
  /* 24570 */ 45, 67, 67, 0, 1832, 97, 97, 45, 45, 45, 981, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1227, 45,
  /* 24595 */ 45, 45, 131427, 0, 0, 0, 0, 362, 0, 365, 28809, 367, 139, 45, 45, 372, 45, 45, 45, 45, 1661, 1662, 45, 45,
  /* 24619 */ 45, 45, 45, 1666, 45, 45, 45, 45, 45, 1673, 45, 1675, 45, 45, 45, 45, 45, 45, 45, 67, 1426, 67, 67, 67,
  /* 24643 */ 67, 67, 67, 67, 67, 67, 67, 1275, 67, 67, 67, 67, 67, 45, 418, 45, 45, 420, 45, 45, 423, 45, 45, 45, 45,
  /* 24668 */ 45, 45, 45, 45, 959, 45, 45, 962, 45, 45, 45, 45, 458, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 24694 */ 67, 483, 67, 67, 67, 67, 504, 67, 67, 506, 67, 67, 509, 67, 67, 67, 67, 67, 67, 67, 753, 67, 67, 67, 67,
  /* 24719 */ 67, 67, 67, 67, 467, 67, 67, 67, 67, 67, 67, 67, 555, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 24745 */ 97, 580, 97, 97, 97, 97, 601, 97, 97, 603, 97, 97, 606, 97, 97, 97, 97, 97, 97, 848, 97, 97, 97, 97, 97,
  /* 24770 */ 97, 97, 97, 97, 1498, 97, 97, 97, 97, 97, 97, 45, 45, 714, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 24796 */ 45, 989, 990, 45, 67, 67, 67, 67, 67, 1011, 67, 67, 67, 67, 1015, 67, 67, 67, 67, 67, 67, 67, 768, 67, 67,
  /* 24821 */ 67, 67, 67, 67, 67, 67, 769, 67, 67, 67, 67, 67, 67, 67, 45, 45, 1179, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 24847 */ 45, 45, 45, 45, 1003, 1004, 67, 1217, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 728, 67,
  /* 24872 */ 1461, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1034, 67, 97, 1516, 97, 97, 97, 97, 97, 97,
  /* 24897 */ 97, 97, 97, 97, 97, 97, 97, 97, 871, 97, 67, 67, 67, 1705, 67, 67, 67, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 24923 */ 567, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1715, 97, 97, 97, 97, 97, 97, 97, 97, 97, 0, 0, 0, 45, 45,
  /* 24949 */ 1380, 45, 45, 45, 45, 45, 67, 67, 97, 97, 97, 97, 97, 0, 0, 0, 97, 1887, 97, 97, 0, 0, 97, 97, 97, 0, 97,
  /* 24976 */ 97, 97, 97, 97, 2006, 45, 45, 1907, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1920, 67, 97,
  /* 25001 */ 0, 2035, 97, 97, 97, 97, 97, 45, 45, 45, 45, 67, 67, 67, 1428, 67, 67, 67, 67, 67, 67, 1435, 67, 0, 94242,
  /* 25026 */ 0, 0, 0, 38, 102439, 0, 0, 106538, 98347, 28809, 45, 45, 45, 146, 45, 152, 45, 45, 165, 45, 175, 45, 180,
  /* 25049 */ 45, 45, 187, 190, 195, 45, 203, 254, 257, 262, 67, 270, 67, 67, 0, 24850, 12564, 0, 0, 0, 281, 28809,
  /* 25071 */ 53531, 97, 97, 97, 293, 97, 299, 97, 97, 312, 97, 322, 97, 327, 97, 97, 334, 337, 342, 97, 350, 97, 97, 0,
  /* 25095 */ 40976, 0, 18, 18, 24, 24, 27, 27, 27, 67, 484, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 499,
  /* 25120 */ 97, 581, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 596, 648, 45, 650, 45, 651, 45, 653, 45, 45,
  /* 25145 */ 45, 657, 45, 45, 45, 45, 45, 45, 1954, 67, 67, 67, 1958, 67, 67, 67, 67, 67, 67, 67, 783, 67, 67, 67, 788,
  /* 25170 */ 67, 67, 67, 67, 680, 45, 45, 45, 45, 45, 45, 45, 45, 688, 689, 691, 45, 45, 45, 45, 45, 983, 45, 45, 45,
  /* 25195 */ 45, 45, 45, 45, 45, 45, 45, 947, 45, 45, 45, 45, 952, 45, 45, 698, 699, 45, 45, 702, 703, 45, 45, 45, 45,
  /* 25220 */ 45, 45, 45, 711, 744, 67, 67, 67, 67, 67, 67, 67, 67, 67, 757, 67, 67, 67, 67, 761, 67, 67, 67, 67, 765,
  /* 25245 */ 67, 767, 67, 67, 67, 67, 67, 67, 67, 67, 775, 776, 778, 67, 67, 67, 67, 67, 67, 785, 786, 67, 67, 789,
  /* 25269 */ 790, 67, 67, 67, 67, 67, 67, 1574, 67, 67, 67, 67, 67, 1578, 67, 67, 67, 67, 67, 67, 1012, 67, 67, 67, 67,
  /* 25294 */ 67, 67, 67, 67, 67, 468, 475, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 798, 67, 67, 67, 802, 67, 67, 67,
  /* 25319 */ 67, 67, 67, 67, 67, 1588, 67, 67, 67, 67, 67, 67, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809, 53531, 67, 810,
  /* 25343 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 821, 25398, 542, 13112, 544, 57889, 0, 0, 54074, 54074, 550, 0, 833,
  /* 25365 */ 97, 835, 97, 836, 97, 838, 97, 97, 0, 0, 97, 97, 97, 1785, 97, 97, 0, 0, 97, 97, 0, 97, 97, 1979, 97, 97,
  /* 25391 */ 45, 45, 1983, 45, 1984, 45, 45, 45, 45, 45, 652, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 690, 45, 45, 694,
  /* 25416 */ 45, 45, 97, 842, 97, 97, 97, 97, 97, 97, 97, 97, 97, 855, 97, 97, 97, 97, 0, 1717, 1718, 97, 97, 97, 97,
  /* 25441 */ 97, 1722, 97, 0, 0, 859, 97, 97, 97, 97, 863, 97, 865, 97, 97, 97, 97, 97, 97, 97, 97, 604, 97, 97, 97,
  /* 25466 */ 97, 97, 97, 97, 873, 874, 876, 97, 97, 97, 97, 97, 97, 883, 884, 97, 97, 887, 888, 97, 18, 131427, 0, 0,
  /* 25490 */ 0, 0, 0, 0, 362, 225280, 0, 365, 0, 367, 0, 45, 45, 45, 1531, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 25516 */ 1199, 45, 45, 45, 45, 45, 97, 97, 908, 97, 97, 97, 97, 97, 97, 97, 97, 97, 919, 638, 0, 0, 0, 0, 2158877,
  /* 25541 */ 2158877, 2158877, 2158877, 2158877, 2425117, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877,
  /* 25552 */ 2597149, 2158877, 2158877, 2158877, 2158877, 2158877, 2158877, 2642205, 2158877, 2158877, 2158877,
  /* 25563 */ 2158877, 2158877, 3158301, 0, 2375818, 2379914, 2158730, 2158730, 2420874, 2158730, 2449546, 2158730,
  /* 25575 */ 2158730, 953, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 965, 978, 45, 45, 45, 45, 45,
  /* 25599 */ 45, 985, 45, 45, 45, 45, 45, 45, 45, 45, 971, 45, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 1027, 67,
  /* 25624 */ 1029, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1455, 67, 67, 67, 67, 67, 67, 67, 1077, 1078, 67, 67, 25398, 0,
  /* 25648 */ 13112, 0, 54074, 0, 0, 0, 0, 0, 0, 0, 0, 366, 0, 139, 2158730, 2158730, 2158730, 2404490, 2412682, 1113,
  /* 25668 */ 97, 97, 97, 97, 97, 97, 1121, 97, 1123, 97, 97, 97, 97, 97, 97, 0, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 25694 */ 45, 45, 45, 45, 1540, 1155, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 615, 1168, 97, 97,
  /* 25719 */ 1171, 1172, 97, 97, 0, 921, 0, 1175, 0, 0, 0, 0, 45, 45, 45, 45, 45, 1533, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 25745 */ 45, 1559, 1561, 45, 45, 45, 1564, 45, 1566, 1567, 45, 45, 45, 1219, 45, 45, 45, 45, 45, 45, 45, 1226, 45,
  /* 25768 */ 45, 45, 45, 45, 168, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 427, 45, 45, 45, 45, 45, 45, 45, 1231, 45,
  /* 25793 */ 45, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1242, 67, 67, 67, 67, 67, 67, 67,
  /* 25819 */ 67, 67, 67, 67, 67, 67, 67, 1046, 67, 67, 1254, 67, 1256, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 25844 */ 806, 807, 67, 67, 97, 1336, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1111, 97, 97, 97, 97,
  /* 25869 */ 97, 1351, 97, 97, 97, 1354, 97, 97, 97, 1359, 97, 97, 97, 0, 97, 97, 97, 97, 1640, 97, 97, 97, 97, 97, 97,
  /* 25894 */ 97, 897, 97, 97, 97, 902, 97, 97, 97, 97, 97, 97, 97, 97, 1366, 97, 97, 97, 97, 97, 97, 97, 1371, 97, 97,
  /* 25919 */ 97, 0, 97, 97, 97, 1730, 97, 97, 97, 97, 97, 97, 97, 97, 915, 97, 97, 97, 97, 0, 360, 0, 67, 67, 67, 1440,
  /* 25945 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1017, 67, 1019, 67, 67, 67, 67, 67, 1453, 67, 67, 67, 67,
  /* 25970 */ 67, 67, 67, 67, 67, 67, 1459, 97, 97, 97, 1493, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1525,
  /* 25995 */ 97, 97, 97, 97, 97, 97, 1507, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1514, 67, 67, 67, 67, 1584, 67, 67,
  /* 26020 */ 67, 67, 67, 1590, 67, 67, 67, 67, 67, 67, 67, 784, 67, 67, 67, 67, 67, 67, 67, 67, 1055, 67, 67, 67, 67,
  /* 26045 */ 1060, 67, 67, 67, 67, 67, 67, 67, 1599, 1601, 67, 67, 67, 1604, 67, 1606, 1607, 67, 1472, 0, 1474, 0,
  /* 26067 */ 1476, 0, 97, 97, 97, 97, 97, 97, 1614, 97, 97, 97, 97, 45, 45, 1850, 45, 45, 45, 45, 1855, 45, 45, 45, 45,
  /* 26092 */ 45, 1222, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1229, 97, 1618, 97, 97, 97, 97, 97, 97, 97, 1625, 97, 97,
  /* 26116 */ 97, 97, 97, 0, 1175, 0, 45, 45, 45, 45, 45, 45, 45, 45, 447, 45, 45, 45, 45, 45, 67, 67, 1633, 97, 97, 0,
  /* 26142 */ 97, 97, 97, 97, 97, 97, 97, 97, 1643, 1645, 97, 97, 0, 0, 97, 97, 97, 2002, 97, 97, 97, 97, 97, 45, 45,
  /* 26167 */ 45, 45, 45, 1740, 45, 45, 45, 1744, 45, 45, 45, 97, 1648, 97, 1650, 1651, 97, 0, 45, 45, 45, 1654, 45, 45,
  /* 26191 */ 45, 45, 45, 169, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 658, 45, 45, 45, 45, 664, 45, 45, 1659, 45, 45,
  /* 26216 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1187, 45, 45, 1669, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 26241 */ 45, 45, 45, 45, 67, 1005, 67, 67, 1681, 67, 67, 67, 67, 67, 67, 67, 1686, 67, 67, 67, 67, 67, 67, 67, 800,
  /* 26266 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 1603, 67, 67, 67, 67, 67, 0, 97, 97, 1713, 97, 0, 97, 97, 97, 97, 97,
  /* 26292 */ 97, 97, 97, 97, 0, 0, 0, 1378, 45, 45, 45, 45, 45, 45, 45, 408, 45, 45, 45, 45, 45, 45, 45, 45, 1547, 45,
  /* 26318 */ 1549, 45, 45, 45, 45, 45, 97, 97, 1780, 0, 97, 97, 97, 97, 97, 97, 0, 0, 97, 97, 0, 97, 97, 97, 45, 45,
  /* 26344 */ 2027, 2028, 45, 45, 67, 67, 2031, 2032, 67, 45, 45, 1804, 45, 45, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67,
  /* 26368 */ 67, 67, 1917, 67, 67, 67, 67, 67, 67, 67, 1819, 67, 67, 67, 67, 67, 67, 67, 67, 97, 97, 97, 1708, 97, 97,
  /* 26393 */ 97, 97, 97, 45, 45, 1862, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 497, 67, 67, 67, 1877, 97,
  /* 26418 */ 97, 97, 97, 97, 0, 0, 0, 97, 97, 97, 97, 0, 0, 97, 97, 97, 97, 97, 1839, 0, 0, 97, 97, 97, 97, 1936, 0, 0,
  /* 26446 */ 97, 97, 97, 97, 97, 97, 1943, 1944, 1945, 45, 45, 45, 45, 670, 45, 45, 45, 45, 674, 45, 45, 45, 45, 678,
  /* 26470 */ 45, 1948, 45, 1950, 45, 45, 45, 45, 1955, 1956, 1957, 67, 67, 67, 1960, 67, 1962, 67, 67, 67, 67, 1967,
  /* 26492 */ 1968, 1969, 97, 0, 0, 0, 97, 97, 1974, 97, 0, 1936, 0, 97, 97, 97, 97, 97, 97, 45, 45, 45, 45, 45, 45, 45,
  /* 26518 */ 45, 1906, 0, 1977, 97, 97, 97, 97, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1746, 45, 45, 45, 45, 2011,
  /* 26543 */ 67, 67, 2013, 67, 67, 67, 2017, 97, 97, 0, 0, 2021, 97, 8192, 97, 97, 2025, 45, 45, 45, 45, 45, 45, 67,
  /* 26567 */ 67, 67, 67, 67, 1916, 67, 67, 67, 67, 0, 94242, 0, 0, 0, 38, 102439, 0, 0, 106538, 98347, 28809, 45, 45,
  /* 26590 */ 140, 45, 45, 45, 1180, 45, 45, 45, 45, 1184, 45, 45, 45, 45, 45, 45, 45, 387, 45, 392, 45, 45, 396, 45,
  /* 26614 */ 45, 399, 45, 45, 67, 207, 67, 67, 67, 67, 67, 67, 236, 67, 67, 67, 67, 67, 67, 67, 817, 67, 67, 67, 67,
  /* 26639 */ 25398, 542, 13112, 544, 97, 97, 287, 97, 97, 97, 97, 97, 97, 316, 97, 97, 97, 97, 97, 97, 0, 45, 45, 45,
  /* 26663 */ 45, 45, 45, 45, 1656, 1657, 45, 376, 45, 45, 45, 45, 45, 388, 45, 45, 45, 45, 45, 45, 45, 45, 1406, 45,
  /* 26687 */ 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 462, 67, 67, 67, 67, 67, 474, 67, 67, 67, 67, 67, 67, 67, 1245,
  /* 26712 */ 67, 67, 67, 67, 67, 67, 67, 67, 1013, 67, 67, 1016, 67, 67, 67, 67, 97, 97, 97, 97, 559, 97, 97, 97, 97,
  /* 26737 */ 97, 571, 97, 97, 97, 97, 97, 97, 896, 97, 97, 97, 900, 97, 97, 97, 97, 97, 97, 912, 914, 97, 97, 97, 97,
  /* 26762 */ 97, 0, 0, 0, 45, 45, 45, 45, 45, 45, 45, 45, 391, 45, 45, 45, 45, 45, 45, 45, 45, 713, 45, 45, 45, 45, 45,
  /* 26789 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 662, 45, 1140, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 26815 */ 97, 636, 67, 67, 1283, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 513, 67, 67, 1363, 97, 97, 97,
  /* 26840 */ 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 889, 97, 97, 97, 1714, 0, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 26866 */ 97, 0, 0, 926, 45, 45, 45, 45, 45, 45, 45, 45, 672, 45, 45, 45, 45, 45, 45, 45, 45, 686, 45, 45, 45, 45,
  /* 26892 */ 45, 45, 45, 45, 944, 45, 45, 45, 45, 45, 45, 45, 45, 1676, 45, 45, 45, 45, 45, 45, 67, 97, 97, 97, 1833,
  /* 26917 */ 0, 97, 97, 97, 97, 97, 0, 0, 0, 97, 97, 97, 97, 97, 97, 45, 45, 45, 45, 1902, 45, 45, 45, 45, 45, 957, 45,
  /* 26944 */ 45, 45, 45, 961, 45, 963, 45, 45, 45, 67, 97, 2034, 0, 97, 97, 97, 97, 97, 2040, 45, 45, 45, 2042, 67, 67,
  /* 26969 */ 67, 67, 67, 67, 1586, 67, 67, 67, 67, 67, 67, 67, 67, 67, 469, 67, 67, 67, 67, 67, 67, 132, 94242, 0, 0,
  /* 26994 */ 0, 38, 102439, 0, 0, 106538, 98347, 28809, 45, 45, 45, 45, 45, 1414, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 27017 */ 45, 428, 45, 45, 45, 45, 45, 57889, 0, 0, 54074, 54074, 550, 831, 97, 97, 97, 97, 97, 97, 97, 97, 97, 568,
  /* 27041 */ 97, 97, 97, 97, 578, 97, 45, 45, 968, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1228, 45, 45,
  /* 27066 */ 67, 67, 67, 67, 67, 25398, 1082, 13112, 1086, 54074, 1090, 0, 0, 0, 0, 0, 0, 364, 0, 0, 0, 139, 2158592,
  /* 27089 */ 2158592, 2158592, 2404352, 2412544, 67, 67, 67, 67, 1464, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 510,
  /* 27110 */ 67, 67, 67, 67, 97, 97, 97, 97, 1519, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 918, 97, 0, 0, 0, 0,
  /* 27136 */ 1528, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 976, 45, 1554, 45, 45, 45, 45, 45, 45, 45,
  /* 27161 */ 45, 1562, 45, 45, 1565, 45, 45, 45, 45, 683, 45, 45, 45, 687, 45, 45, 692, 45, 45, 45, 45, 45, 1953, 45,
  /* 27185 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 1014, 67, 67, 67, 67, 67, 67, 1568, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 27210 */ 67, 67, 67, 67, 67, 67, 67, 67, 0, 67, 67, 67, 67, 67, 1585, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1594, 97,
  /* 27236 */ 97, 1649, 97, 97, 97, 0, 45, 45, 1653, 45, 45, 45, 45, 45, 45, 383, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 27261 */ 986, 45, 45, 45, 45, 45, 45, 45, 45, 1670, 45, 1672, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 67, 736, 67,
  /* 27286 */ 67, 67, 67, 67, 741, 67, 67, 67, 1680, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1074, 67,
  /* 27311 */ 67, 67, 1692, 67, 67, 67, 67, 67, 67, 67, 1697, 67, 1699, 67, 67, 67, 67, 67, 67, 1041, 67, 67, 67, 67,
  /* 27335 */ 67, 67, 67, 67, 67, 1044, 67, 67, 67, 67, 67, 67, 67, 1769, 67, 67, 67, 67, 67, 67, 67, 97, 97, 97, 97,
  /* 27360 */ 97, 97, 97, 624, 97, 97, 97, 97, 97, 97, 634, 97, 97, 1792, 97, 97, 97, 97, 97, 97, 97, 45, 45, 45, 45,
  /* 27385 */ 45, 45, 45, 958, 45, 45, 45, 45, 45, 45, 964, 45, 150, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 27411 */ 45, 45, 977, 204, 45, 67, 67, 67, 217, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 787, 67, 67, 67, 67, 67,
  /* 27436 */ 67, 67, 67, 67, 67, 271, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809, 53531, 97, 97, 97, 97, 297, 97, 97, 97,
  /* 27460 */ 97, 97, 97, 97, 97, 97, 97, 97, 1108, 97, 97, 97, 97, 97, 97, 97, 97, 351, 97, 0, 40976, 0, 18, 18, 24,
  /* 27485 */ 24, 27, 27, 27, 45, 45, 938, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1398, 45, 45, 45, 153,
  /* 27510 */ 45, 161, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 660, 661, 45, 45, 205, 45, 67, 67, 67, 67, 220,
  /* 27535 */ 67, 228, 67, 67, 67, 67, 67, 67, 67, 0, 0, 0, 1302, 0, 0, 0, 1308, 0, 67, 67, 67, 67, 67, 272, 67, 0,
  /* 27561 */ 24850, 12564, 0, 0, 0, 0, 28809, 53531, 97, 97, 97, 97, 352, 97, 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27,
  /* 27585 */ 45, 439, 45, 45, 45, 45, 45, 445, 45, 45, 45, 452, 45, 45, 67, 67, 212, 216, 67, 67, 67, 67, 67, 241, 67,
  /* 27610 */ 246, 67, 252, 67, 67, 486, 67, 67, 67, 67, 67, 67, 67, 494, 67, 67, 67, 67, 67, 67, 67, 1272, 67, 67, 67,
  /* 27635 */ 67, 67, 67, 67, 67, 507, 67, 67, 67, 67, 67, 67, 67, 67, 521, 67, 67, 525, 67, 67, 67, 67, 67, 531, 67,
  /* 27660 */ 67, 67, 538, 67, 0, 0, 2046, 97, 97, 97, 45, 45, 67, 67, 0, 0, 97, 97, 45, 45, 45, 1192, 45, 45, 45, 45,
  /* 27686 */ 45, 45, 45, 45, 45, 45, 45, 45, 1418, 45, 45, 1421, 97, 97, 583, 97, 97, 97, 97, 97, 97, 97, 591, 97, 97,
  /* 27711 */ 97, 97, 97, 97, 913, 97, 97, 97, 97, 97, 97, 0, 0, 0, 45, 45, 45, 45, 45, 45, 45, 1384, 97, 618, 97, 97,
  /* 27737 */ 622, 97, 97, 97, 97, 97, 628, 97, 97, 97, 635, 97, 18, 131427, 0, 0, 0, 639, 0, 132, 362, 0, 0, 365,
  /* 27761 */ 29315, 367, 0, 921, 29315, 0, 0, 0, 0, 45, 45, 45, 45, 932, 45, 45, 45, 45, 45, 1544, 45, 45, 45, 45, 45,
  /* 27786 */ 1550, 45, 45, 45, 45, 45, 1194, 45, 1196, 45, 45, 45, 45, 45, 45, 45, 45, 999, 45, 45, 45, 45, 45, 67, 67,
  /* 27811 */ 45, 45, 667, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1408, 45, 45, 45, 696, 45, 45, 45, 701,
  /* 27836 */ 45, 45, 45, 45, 45, 45, 45, 45, 710, 45, 45, 45, 1220, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 27861 */ 194, 45, 45, 45, 729, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 27887 */ 67, 67, 797, 67, 67, 67, 67, 67, 67, 805, 67, 67, 67, 67, 67, 67, 67, 1695, 67, 67, 67, 67, 67, 1700, 67,
  /* 27912 */ 1702, 67, 67, 67, 67, 67, 814, 816, 67, 67, 67, 67, 67, 25398, 542, 13112, 544, 67, 67, 1008, 67, 67, 67,
  /* 27935 */ 67, 67, 67, 67, 67, 67, 67, 67, 1020, 67, 0, 97, 45, 67, 0, 97, 45, 67, 0, 97, 45, 67, 97, 0, 0, 97, 97,
  /* 27962 */ 97, 97, 97, 45, 45, 45, 45, 67, 67, 67, 67, 1429, 67, 1430, 67, 67, 67, 67, 67, 1062, 67, 67, 67, 67, 67,
  /* 27987 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 518, 1076, 67, 67, 67, 67, 25398, 0, 13112, 0, 54074, 0, 0, 0, 0,
  /* 28012 */ 0, 0, 0, 0, 28809, 0, 139, 45, 45, 45, 45, 45, 97, 97, 97, 97, 1102, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 28038 */ 97, 97, 1124, 97, 1126, 97, 97, 1114, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1112,
  /* 28062 */ 97, 97, 1156, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 594, 97, 97, 97, 97, 1170, 97, 97, 97,
  /* 28087 */ 97, 0, 921, 0, 0, 0, 0, 0, 0, 45, 45, 45, 45, 1532, 45, 45, 45, 45, 1536, 45, 45, 45, 45, 45, 172, 45, 45,
  /* 28114 */ 45, 45, 45, 45, 45, 45, 45, 45, 706, 45, 45, 709, 45, 45, 1177, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 28139 */ 45, 45, 45, 45, 45, 1202, 45, 1204, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1215, 45, 45, 45,
  /* 28163 */ 1232, 45, 45, 45, 45, 45, 45, 45, 67, 1237, 67, 67, 67, 67, 67, 67, 1259, 67, 67, 67, 67, 67, 67, 1264,
  /* 28187 */ 67, 67, 67, 1282, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1289, 67, 67, 67, 1292, 97, 97, 97, 97, 1339, 97,
  /* 28211 */ 97, 97, 97, 97, 97, 1344, 97, 97, 97, 97, 45, 1849, 45, 1851, 45, 45, 45, 45, 45, 45, 45, 45, 721, 45, 45,
  /* 28236 */ 45, 45, 45, 726, 45, 1385, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1188, 45, 45, 1401,
  /* 28261 */ 1402, 45, 45, 45, 45, 1405, 45, 45, 45, 45, 45, 45, 45, 45, 1752, 45, 45, 45, 45, 45, 67, 67, 1410, 45,
  /* 28285 */ 45, 45, 1413, 45, 1415, 45, 45, 45, 45, 45, 45, 1419, 45, 45, 45, 45, 1806, 45, 45, 45, 45, 45, 45, 67,
  /* 28309 */ 67, 67, 67, 67, 67, 67, 97, 97, 2019, 0, 97, 67, 67, 67, 1452, 67, 67, 67, 67, 67, 67, 67, 67, 1457, 67,
  /* 28334 */ 67, 67, 67, 67, 67, 1271, 67, 67, 67, 1274, 67, 67, 67, 1279, 67, 1460, 67, 1462, 67, 67, 67, 67, 67, 67,
  /* 28358 */ 1466, 67, 67, 67, 67, 67, 67, 67, 67, 1602, 67, 67, 1605, 67, 67, 67, 0, 97, 97, 97, 1506, 97, 97, 97, 97,
  /* 28383 */ 97, 97, 97, 97, 1512, 97, 97, 97, 0, 1728, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 901, 97, 97, 97,
  /* 28408 */ 97, 1515, 97, 1517, 97, 97, 97, 97, 97, 97, 1521, 97, 97, 97, 97, 97, 97, 0, 45, 1652, 45, 45, 45, 1655,
  /* 28432 */ 45, 45, 45, 45, 45, 1542, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1552, 1553, 45, 45, 45,
  /* 28456 */ 1556, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 693, 45, 45, 45, 67, 67, 67, 67, 1572, 67, 67,
  /* 28481 */ 67, 67, 1576, 67, 67, 67, 67, 67, 67, 67, 67, 1685, 67, 67, 67, 67, 67, 67, 67, 67, 1465, 67, 67, 1468,
  /* 28505 */ 67, 67, 1471, 67, 67, 1582, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1580, 67, 67, 1596,
  /* 28529 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 0, 542, 0, 544, 67, 67, 67, 67, 1759, 67, 67, 67, 67,
  /* 28555 */ 67, 67, 67, 67, 67, 67, 67, 533, 67, 67, 67, 67, 67, 67, 67, 1770, 67, 67, 67, 67, 67, 97, 97, 97, 97, 97,
  /* 28581 */ 97, 1777, 97, 97, 97, 1793, 97, 97, 97, 97, 97, 45, 45, 45, 45, 45, 45, 45, 998, 45, 45, 1001, 1002, 45,
  /* 28605 */ 45, 67, 67, 45, 1861, 45, 67, 67, 67, 67, 67, 67, 67, 67, 1871, 67, 1873, 1874, 67, 0, 97, 45, 67, 0, 97,
  /* 28630 */ 45, 67, 16384, 97, 45, 67, 97, 0, 0, 0, 1473, 0, 1082, 0, 0, 0, 1475, 0, 1086, 0, 0, 0, 1477, 1876, 67,
  /* 28655 */ 97, 97, 97, 97, 97, 1883, 0, 1885, 97, 97, 97, 1889, 0, 0, 0, 286, 0, 0, 0, 286, 0, 2367488, 2158592,
  /* 28678 */ 2158592, 2158592, 2158592, 2158592, 2158592, 0, 40976, 0, 18, 18, 24, 24, 126, 126, 126, 2053, 0, 2055,
  /* 28696 */ 45, 67, 0, 97, 45, 67, 0, 97, 45, 67, 97, 0, 0, 97, 97, 97, 2039, 97, 45, 45, 45, 45, 67, 67, 67, 67, 67,
  /* 28723 */ 226, 67, 67, 67, 67, 67, 67, 67, 67, 1246, 67, 67, 1249, 1250, 67, 67, 67, 132, 94242, 0, 0, 0, 38,
  /* 28746 */ 102439, 0, 0, 106538, 98347, 28809, 45, 45, 141, 45, 45, 45, 1403, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 28769 */ 45, 45, 1186, 45, 45, 1189, 45, 45, 155, 45, 45, 45, 45, 45, 45, 45, 45, 45, 191, 45, 45, 45, 45, 700, 45,
  /* 28794 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1753, 45, 45, 45, 67, 67, 45, 45, 67, 208, 67, 67, 67, 222, 67,
  /* 28819 */ 67, 67, 67, 67, 67, 67, 67, 67, 1764, 67, 67, 67, 67, 67, 67, 67, 258, 67, 67, 67, 67, 67, 0, 24850,
  /* 28843 */ 12564, 0, 0, 0, 0, 28809, 53531, 97, 97, 288, 97, 97, 97, 302, 97, 97, 97, 97, 97, 97, 97, 97, 97, 627,
  /* 28867 */ 97, 97, 97, 97, 97, 97, 338, 97, 97, 97, 97, 97, 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27, 131427, 0, 0, 0,
  /* 28893 */ 0, 362, 0, 365, 28809, 367, 139, 45, 370, 45, 45, 45, 45, 716, 45, 45, 45, 45, 45, 722, 45, 45, 45, 45,
  /* 28917 */ 45, 45, 1912, 67, 67, 67, 67, 67, 67, 67, 67, 67, 819, 67, 67, 25398, 542, 13112, 544, 45, 403, 45, 45,
  /* 28940 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1409, 45, 67, 67, 67, 67, 489, 67, 67, 67, 67, 67, 67, 67,
  /* 28966 */ 67, 67, 67, 67, 771, 67, 67, 67, 67, 520, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 534, 67, 67, 67, 67,
  /* 28992 */ 67, 67, 1286, 67, 67, 67, 67, 67, 67, 67, 1291, 67, 67, 24850, 24850, 12564, 12564, 0, 57889, 0, 0, 0,
  /* 29014 */ 53531, 53531, 367, 286, 97, 553, 97, 97, 97, 97, 586, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1138,
  /* 29037 */ 97, 97, 97, 97, 617, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 631, 97, 97, 97, 0, 1834, 97, 97, 97, 97,
  /* 29063 */ 97, 0, 0, 0, 97, 97, 97, 97, 97, 353, 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27, 45, 45, 668, 45, 45, 45,
  /* 29089 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 724, 45, 45, 45, 45, 45, 682, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 29115 */ 45, 45, 45, 45, 949, 45, 45, 45, 67, 67, 747, 748, 67, 67, 67, 67, 755, 67, 67, 67, 67, 67, 67, 67, 0, 0,
  /* 29141 */ 1301, 0, 0, 0, 1307, 0, 0, 67, 794, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1701, 67, 97,
  /* 29167 */ 97, 97, 845, 846, 97, 97, 97, 97, 853, 97, 97, 97, 97, 97, 97, 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27,
  /* 29192 */ 97, 97, 892, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 610, 97, 97, 45, 992, 45, 45, 45, 45, 45,
  /* 29218 */ 45, 45, 45, 45, 45, 45, 45, 67, 67, 67, 1239, 67, 67, 67, 1063, 67, 67, 67, 67, 67, 1068, 67, 67, 67, 67,
  /* 29243 */ 67, 67, 67, 0, 1299, 0, 0, 0, 1305, 0, 0, 0, 97, 1141, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1152,
  /* 29269 */ 97, 97, 0, 0, 97, 97, 1784, 97, 97, 97, 0, 0, 97, 97, 0, 97, 1978, 97, 97, 97, 1982, 45, 45, 45, 45, 45,
  /* 29295 */ 45, 45, 45, 45, 972, 973, 45, 45, 45, 45, 45, 97, 97, 97, 97, 1157, 97, 97, 97, 97, 97, 1162, 97, 97, 97,
  /* 29320 */ 97, 97, 97, 1145, 97, 97, 97, 97, 97, 1151, 97, 97, 97, 1253, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 29345 */ 67, 67, 67, 67, 539, 45, 1423, 45, 45, 67, 67, 67, 67, 67, 67, 67, 1431, 67, 67, 67, 67, 67, 67, 67, 1773,
  /* 29370 */ 67, 97, 97, 97, 97, 97, 97, 97, 625, 97, 97, 97, 97, 97, 97, 97, 97, 850, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 29396 */ 880, 97, 97, 97, 97, 97, 97, 97, 97, 1106, 97, 97, 97, 97, 97, 97, 97, 67, 67, 1439, 67, 67, 67, 67, 67,
  /* 29421 */ 67, 67, 67, 67, 67, 67, 67, 67, 514, 67, 67, 97, 97, 1492, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 29447 */ 97, 611, 97, 97, 1703, 67, 67, 67, 67, 67, 67, 97, 97, 97, 97, 97, 97, 97, 97, 97, 852, 97, 97, 97, 97,
  /* 29472 */ 97, 97, 45, 1949, 45, 1951, 45, 45, 45, 67, 67, 67, 67, 67, 67, 67, 1961, 67, 0, 97, 45, 67, 0, 97, 2060,
  /* 29497 */ 2061, 0, 2062, 45, 67, 97, 0, 0, 2036, 97, 97, 97, 97, 45, 45, 45, 45, 67, 67, 67, 67, 67, 223, 67, 67,
  /* 29522 */ 237, 67, 67, 67, 67, 67, 67, 67, 1297, 0, 0, 0, 1303, 0, 0, 0, 1309, 1963, 67, 67, 67, 97, 97, 97, 97, 0,
  /* 29548 */ 1972, 0, 97, 97, 97, 1975, 0, 921, 29315, 0, 0, 0, 0, 45, 45, 45, 931, 45, 45, 45, 45, 45, 407, 45, 45,
  /* 29573 */ 45, 45, 45, 45, 45, 45, 45, 417, 45, 45, 1989, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1996, 97, 18,
  /* 29598 */ 131427, 0, 0, 360, 0, 0, 0, 362, 0, 0, 365, 29315, 367, 0, 921, 29315, 0, 0, 0, 0, 45, 45, 930, 45, 45,
  /* 29623 */ 45, 45, 45, 45, 444, 45, 45, 45, 45, 45, 45, 45, 67, 67, 97, 97, 1998, 0, 97, 97, 97, 0, 97, 97, 97, 97,
  /* 29649 */ 97, 45, 45, 45, 45, 45, 45, 1985, 45, 1986, 45, 45, 45, 156, 45, 45, 170, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 29674 */ 45, 45, 675, 45, 45, 45, 45, 679, 131427, 0, 358, 0, 0, 362, 0, 365, 28809, 367, 139, 45, 45, 45, 45, 45,
  /* 29698 */ 381, 45, 45, 45, 45, 45, 45, 45, 45, 45, 400, 45, 45, 419, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 29724 */ 436, 67, 67, 67, 67, 67, 505, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 820, 67, 25398, 542, 13112, 544, 67,
  /* 29748 */ 67, 522, 67, 67, 67, 67, 67, 529, 67, 67, 67, 67, 67, 67, 67, 0, 1300, 0, 0, 0, 1306, 0, 0, 0, 97, 97,
  /* 29774 */ 619, 97, 97, 97, 97, 97, 626, 97, 97, 97, 97, 97, 97, 97, 1105, 97, 97, 97, 97, 1109, 97, 97, 97, 67, 67,
  /* 29799 */ 67, 67, 749, 67, 67, 67, 67, 67, 67, 67, 67, 67, 760, 67, 0, 97, 45, 67, 2058, 97, 45, 67, 0, 97, 45, 67,
  /* 29825 */ 97, 0, 0, 97, 97, 97, 97, 97, 45, 45, 45, 2041, 67, 67, 67, 67, 67, 780, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 29851 */ 67, 67, 67, 67, 67, 516, 67, 67, 97, 97, 97, 878, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 29876 */ 1629, 97, 0, 45, 979, 45, 45, 45, 45, 984, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1000, 45, 45, 45, 45, 67,
  /* 29901 */ 67, 67, 1023, 67, 67, 67, 67, 1028, 67, 67, 67, 67, 67, 67, 67, 67, 67, 470, 67, 67, 67, 67, 67, 67, 67,
  /* 29926 */ 67, 67, 67, 67, 25398, 0, 13112, 0, 54074, 0, 0, 0, 1094, 0, 0, 0, 1092, 1315, 0, 0, 0, 0, 97, 97, 97, 97,
  /* 29952 */ 97, 97, 97, 97, 97, 1486, 97, 1489, 97, 97, 97, 1117, 97, 97, 97, 97, 1122, 97, 97, 97, 97, 97, 97, 97,
  /* 29976 */ 1146, 97, 97, 97, 97, 97, 97, 97, 97, 881, 97, 97, 97, 886, 97, 97, 97, 1311, 0, 0, 0, 0, 0, 0, 0, 0, 97,
  /* 30003 */ 97, 97, 97, 97, 97, 97, 1615, 97, 97, 97, 97, 97, 1619, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 30028 */ 1631, 97, 97, 1847, 97, 45, 45, 45, 45, 1852, 45, 45, 45, 45, 45, 45, 45, 1235, 45, 45, 45, 67, 67, 67,
  /* 30052 */ 67, 67, 1868, 67, 67, 67, 1872, 67, 67, 67, 67, 67, 97, 97, 97, 97, 1882, 0, 0, 0, 97, 97, 97, 97, 0,
  /* 30077 */ 1891, 67, 67, 67, 67, 67, 97, 97, 97, 97, 97, 1929, 0, 0, 97, 97, 97, 97, 97, 97, 45, 1900, 45, 1901, 45,
  /* 30102 */ 45, 45, 1905, 45, 67, 2054, 97, 45, 67, 0, 97, 45, 67, 0, 97, 45, 67, 97, 0, 0, 97, 2037, 2038, 97, 97,
  /* 30127 */ 45, 45, 45, 45, 67, 67, 67, 67, 1867, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1774, 97, 97, 97, 97, 97, 97, 0,
  /* 30153 */ 94242, 0, 0, 0, 38, 102439, 0, 0, 106538, 98347, 28809, 45, 45, 142, 45, 45, 45, 1412, 45, 45, 45, 45, 45,
  /* 30176 */ 45, 45, 45, 45, 45, 45, 45, 432, 45, 45, 45, 45, 45, 157, 45, 45, 171, 45, 45, 45, 182, 45, 45, 45, 45,
  /* 30201 */ 200, 45, 45, 45, 1543, 45, 45, 45, 45, 45, 45, 45, 45, 1551, 45, 45, 45, 45, 1181, 45, 45, 45, 45, 45, 45,
  /* 30226 */ 45, 45, 45, 45, 45, 1211, 45, 45, 45, 1214, 45, 45, 45, 67, 209, 67, 67, 67, 224, 67, 67, 238, 67, 67, 67,
  /* 30251 */ 249, 67, 0, 97, 2056, 2057, 0, 2059, 45, 67, 0, 97, 45, 67, 97, 0, 0, 1937, 97, 97, 97, 97, 97, 97, 45,
  /* 30276 */ 45, 45, 45, 45, 45, 1741, 45, 45, 45, 45, 45, 45, 67, 67, 67, 267, 67, 67, 67, 0, 24850, 12564, 0, 0, 0,
  /* 30301 */ 0, 28809, 53531, 97, 97, 289, 97, 97, 97, 304, 97, 97, 318, 97, 97, 97, 329, 97, 97, 0, 0, 97, 97, 2001,
  /* 30325 */ 0, 97, 2003, 97, 97, 97, 45, 45, 45, 1739, 45, 45, 45, 1742, 45, 45, 45, 45, 45, 97, 97, 347, 97, 97, 97,
  /* 30350 */ 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27, 45, 666, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 30376 */ 1420, 45, 57889, 0, 0, 54074, 54074, 550, 0, 97, 97, 97, 97, 97, 97, 97, 97, 840, 67, 1007, 67, 67, 67,
  /* 30399 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 759, 67, 67, 67, 67, 67, 67, 67, 1052, 67, 67, 67, 67, 67, 67,
  /* 30425 */ 67, 67, 67, 67, 1031, 67, 67, 67, 67, 67, 97, 97, 97, 1101, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 30450 */ 97, 592, 97, 97, 97, 1190, 45, 45, 45, 45, 45, 1195, 45, 1197, 45, 45, 45, 45, 1201, 45, 45, 45, 45, 1952,
  /* 30474 */ 45, 45, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 250, 67, 67, 67, 1255, 67, 1257, 67, 67, 67, 67,
  /* 30499 */ 1261, 67, 67, 67, 67, 67, 67, 67, 67, 1696, 67, 67, 67, 67, 67, 67, 67, 0, 0, 0, 0, 0, 0, 2162688, 0, 0,
  /* 30525 */ 67, 67, 1267, 67, 67, 67, 67, 67, 67, 1273, 67, 67, 67, 67, 67, 67, 67, 67, 1763, 67, 67, 67, 67, 67, 67,
  /* 30550 */ 67, 0, 0, 0, 0, 0, 280, 94, 0, 0, 1281, 67, 67, 67, 67, 1285, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 30576 */ 1070, 67, 67, 67, 67, 67, 1335, 97, 1337, 97, 97, 97, 97, 1341, 97, 97, 97, 97, 97, 97, 97, 97, 882, 97,
  /* 30600 */ 97, 97, 97, 97, 97, 97, 1347, 97, 97, 97, 97, 97, 97, 1353, 97, 97, 97, 97, 97, 97, 1361, 97, 18, 131427,
  /* 30624 */ 0, 638, 0, 0, 0, 0, 362, 0, 0, 365, 29315, 367, 0, 544, 0, 550, 0, 2158592, 2158592, 2158592, 2158592,
  /* 30645 */ 2158592, 2158592, 2158592, 2158592, 2473984, 2158592, 2158592, 2158592, 2990080, 2158592, 2158592,
  /* 30656 */ 2207744, 2207744, 2482176, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 2207744, 0, 0, 0, 0, 0,
  /* 30671 */ 0, 2162688, 0, 53530, 97, 97, 97, 1365, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 608, 97, 97, 97,
  /* 30695 */ 45, 45, 1424, 45, 1425, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1058, 67, 67, 67, 67, 45, 1555, 45,
  /* 30719 */ 45, 1557, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 707, 45, 45, 45, 45, 67, 67, 1570, 67, 67, 67, 67,
  /* 30744 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 773, 67, 67, 1595, 67, 67, 1597, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 30769 */ 67, 67, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 2158592, 2158592, 2158592, 2404352, 2412544, 97, 97, 97, 1636,
  /* 30791 */ 97, 97, 97, 1639, 97, 97, 1641, 97, 97, 97, 97, 97, 97, 1173, 0, 921, 0, 0, 0, 0, 0, 0, 45, 67, 67, 67,
  /* 30817 */ 1693, 67, 67, 67, 67, 67, 67, 67, 1698, 67, 67, 67, 67, 67, 67, 273, 0, 24850, 12564, 0, 0, 0, 0, 28809,
  /* 30841 */ 53531, 1860, 45, 45, 67, 67, 1865, 67, 67, 67, 67, 1870, 67, 67, 67, 67, 1875, 67, 67, 97, 97, 1880, 97,
  /* 30864 */ 97, 0, 0, 0, 97, 97, 1888, 97, 0, 0, 0, 1938, 97, 97, 97, 97, 97, 45, 45, 45, 45, 45, 45, 1854, 45, 45,
  /* 30890 */ 45, 45, 45, 45, 45, 1909, 45, 45, 1911, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1248, 67, 67, 67, 67, 67,
  /* 30915 */ 67, 1922, 67, 67, 1924, 97, 97, 97, 97, 97, 0, 0, 0, 97, 97, 97, 97, 97, 1898, 45, 45, 45, 45, 45, 45,
  /* 30940 */ 1904, 45, 45, 67, 67, 67, 67, 97, 97, 97, 97, 0, 0, 16384, 97, 97, 97, 97, 0, 97, 97, 97, 97, 97, 97, 97,
  /* 30966 */ 97, 97, 0, 1724, 2008, 2009, 45, 45, 67, 67, 67, 2014, 2015, 67, 67, 97, 97, 0, 0, 97, 97, 97, 0, 97, 97,
  /* 30991 */ 97, 97, 97, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 2022, 0, 2023, 97, 97, 45, 45, 45, 45, 45,
  /* 31017 */ 45, 67, 67, 67, 67, 67, 67, 1869, 67, 67, 67, 67, 67, 67, 0, 94242, 0, 0, 0, 38, 102439, 0, 0, 106538,
  /* 31041 */ 98347, 28809, 45, 45, 45, 147, 151, 154, 45, 162, 45, 45, 176, 178, 181, 45, 45, 45, 192, 196, 45, 45, 45,
  /* 31064 */ 45, 2012, 67, 67, 67, 67, 67, 67, 2018, 97, 0, 0, 97, 1894, 1895, 97, 1897, 97, 45, 45, 45, 45, 45, 45,
  /* 31088 */ 45, 45, 45, 656, 45, 45, 45, 45, 45, 45, 67, 259, 263, 67, 67, 67, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809,
  /* 31113 */ 53531, 97, 97, 97, 294, 298, 301, 97, 309, 97, 97, 323, 325, 328, 97, 97, 97, 97, 97, 560, 97, 97, 97,
  /* 31136 */ 569, 97, 97, 97, 97, 97, 97, 306, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1624, 97, 97, 97, 97, 97, 97, 97, 0,
  /* 31162 */ 921, 0, 1175, 0, 0, 0, 0, 45, 339, 343, 97, 97, 97, 97, 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27, 67, 67,
  /* 31188 */ 503, 67, 67, 67, 67, 67, 67, 67, 67, 67, 512, 67, 67, 519, 97, 97, 600, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 31213 */ 97, 609, 97, 97, 616, 45, 649, 45, 45, 45, 45, 45, 654, 45, 45, 45, 45, 45, 45, 45, 45, 1393, 45, 45, 45,
  /* 31238 */ 45, 45, 45, 45, 45, 1209, 45, 45, 45, 45, 45, 45, 45, 67, 763, 67, 67, 67, 67, 67, 67, 67, 67, 770, 67,
  /* 31263 */ 67, 67, 774, 67, 0, 2045, 97, 97, 97, 97, 45, 45, 67, 67, 0, 0, 97, 97, 45, 45, 45, 994, 45, 45, 45, 45,
  /* 31289 */ 45, 45, 45, 45, 45, 45, 67, 67, 213, 67, 219, 67, 67, 232, 67, 242, 67, 247, 67, 67, 67, 779, 67, 67, 67,
  /* 31314 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1018, 67, 67, 67, 67, 811, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 31340 */ 25398, 542, 13112, 544, 57889, 0, 0, 54074, 54074, 550, 0, 97, 834, 97, 97, 97, 97, 97, 839, 97, 18,
  /* 31361 */ 131427, 0, 638, 0, 0, 0, 0, 362, 0, 0, 365, 29315, 367, 645, 97, 97, 861, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 31386 */ 868, 97, 97, 97, 872, 97, 97, 877, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 613, 97, 97, 97,
  /* 31411 */ 97, 97, 909, 97, 97, 97, 97, 97, 97, 97, 97, 97, 0, 0, 0, 18, 18, 24, 24, 27, 27, 27, 1036, 67, 67, 67,
  /* 31437 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1047, 67, 67, 67, 1050, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 31462 */ 67, 67, 67, 67, 1033, 67, 67, 67, 97, 97, 1130, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 638,
  /* 31487 */ 0, 0, 67, 67, 67, 1295, 67, 67, 67, 0, 0, 0, 0, 0, 0, 0, 0, 0, 97, 1317, 97, 97, 97, 97, 97, 97, 1375, 97,
  /* 31515 */ 97, 97, 0, 0, 0, 45, 1379, 45, 45, 45, 45, 45, 45, 422, 45, 45, 45, 429, 431, 45, 45, 45, 45, 0, 1090, 0,
  /* 31541 */ 0, 97, 1479, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1357, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1716, 97,
  /* 31566 */ 97, 97, 97, 97, 97, 97, 97, 97, 1723, 0, 921, 29315, 0, 0, 0, 0, 45, 929, 45, 45, 45, 45, 45, 45, 45,
  /* 31591 */ 1234, 45, 45, 45, 45, 67, 67, 67, 67, 1240, 97, 97, 97, 1738, 45, 45, 45, 45, 45, 45, 45, 1743, 45, 45,
  /* 31615 */ 45, 45, 166, 45, 45, 45, 45, 184, 186, 45, 45, 197, 45, 45, 97, 1779, 0, 0, 97, 97, 97, 97, 97, 97, 0, 0,
  /* 31641 */ 97, 97, 0, 97, 18, 131427, 0, 638, 0, 0, 0, 0, 362, 0, 640, 365, 29315, 367, 0, 921, 29315, 0, 0, 0, 0,
  /* 31666 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1539, 45, 45, 1803, 45, 45, 45, 45, 45, 1809, 45, 45,
  /* 31691 */ 45, 67, 67, 67, 1814, 67, 67, 67, 67, 67, 97, 97, 97, 97, 97, 0, 0, 0, 1932, 97, 97, 0, 1781, 97, 97, 97,
  /* 31717 */ 97, 97, 97, 0, 0, 97, 97, 0, 97, 67, 67, 67, 1818, 67, 67, 67, 67, 67, 1824, 67, 67, 67, 97, 97, 97, 97,
  /* 31743 */ 97, 0, 0, 0, 97, 97, 97, 97, 1890, 0, 1829, 97, 97, 0, 0, 97, 97, 1836, 97, 97, 0, 0, 0, 97, 97, 97, 97,
  /* 31770 */ 1981, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1987, 1845, 97, 97, 97, 45, 45, 45, 45, 45, 1853, 45, 45, 45,
  /* 31794 */ 1857, 45, 45, 45, 67, 1864, 67, 1866, 67, 67, 67, 67, 67, 67, 67, 67, 67, 97, 97, 97, 97, 97, 97, 97,
  /* 31818 */ 1710, 1711, 67, 67, 97, 97, 97, 97, 97, 0, 0, 0, 1886, 97, 97, 97, 0, 0, 97, 97, 97, 97, 1838, 0, 0, 0,
  /* 31844 */ 97, 1843, 97, 0, 1893, 97, 97, 97, 97, 97, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1745, 45, 45, 67, 2044,
  /* 31869 */ 0, 97, 97, 97, 97, 45, 45, 67, 67, 0, 0, 97, 97, 45, 45, 45, 1660, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 31896 */ 45, 45, 453, 45, 455, 67, 67, 67, 67, 268, 67, 67, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809, 53531, 97, 97,
  /* 31920 */ 348, 97, 97, 97, 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27, 131427, 0, 359, 0, 0, 362, 0, 365, 28809, 367,
  /* 31944 */ 139, 45, 45, 45, 45, 45, 421, 45, 45, 45, 45, 45, 45, 45, 434, 45, 45, 695, 45, 45, 45, 45, 45, 45, 45,
  /* 31969 */ 45, 45, 45, 45, 45, 45, 45, 45, 1667, 45, 0, 921, 29315, 0, 925, 0, 0, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 31995 */ 1548, 45, 45, 45, 45, 45, 45, 67, 1037, 67, 1039, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1277,
  /* 32019 */ 67, 67, 67, 67, 67, 67, 67, 67, 25398, 0, 13112, 0, 54074, 0, 0, 0, 1095, 0, 0, 0, 1096, 97, 97, 97, 97,
  /* 32044 */ 97, 97, 97, 97, 97, 97, 97, 97, 869, 97, 97, 97, 97, 97, 97, 1131, 97, 1133, 97, 97, 97, 97, 97, 97, 97,
  /* 32069 */ 97, 97, 97, 1370, 97, 97, 97, 97, 97, 1312, 0, 0, 0, 0, 1096, 0, 0, 0, 97, 97, 97, 97, 97, 97, 97, 1327,
  /* 32095 */ 97, 97, 97, 97, 97, 1332, 97, 97, 97, 1830, 97, 0, 0, 97, 97, 97, 97, 97, 0, 0, 0, 97, 97, 97, 1896, 97,
  /* 32121 */ 97, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1210, 45, 45, 45, 45, 45, 45, 133, 94242, 0, 0, 0, 38, 102439, 0,
  /* 32146 */ 0, 106538, 98347, 28809, 45, 45, 45, 45, 380, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 401, 45, 45, 158,
  /* 32169 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1200, 45, 45, 45, 45, 206, 67, 67, 67, 67, 67, 225,
  /* 32194 */ 67, 67, 67, 67, 67, 67, 67, 67, 754, 67, 67, 67, 67, 67, 67, 67, 57889, 0, 0, 54074, 54074, 550, 832, 97,
  /* 32218 */ 97, 97, 97, 97, 97, 97, 97, 97, 1342, 97, 97, 97, 97, 97, 97, 67, 67, 67, 67, 67, 25398, 1083, 13112,
  /* 32241 */ 1087, 54074, 1091, 0, 0, 0, 0, 0, 0, 1316, 0, 831, 97, 97, 97, 97, 97, 97, 97, 1174, 921, 0, 1175, 0, 0,
  /* 32266 */ 0, 0, 45, 0, 94242, 0, 0, 0, 38, 102439, 0, 0, 106538, 98347, 28809, 45, 45, 45, 148, 67, 67, 264, 67, 67,
  /* 32290 */ 67, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809, 53531, 97, 97, 97, 295, 97, 97, 97, 97, 313, 97, 97, 97, 97,
  /* 32314 */ 331, 333, 97, 18, 131427, 356, 638, 0, 0, 0, 0, 362, 0, 0, 365, 0, 367, 0, 45, 45, 1530, 45, 45, 45, 45,
  /* 32339 */ 45, 45, 45, 45, 45, 45, 45, 45, 988, 45, 45, 45, 97, 344, 97, 97, 97, 97, 0, 40976, 0, 18, 18, 24, 24, 27,
  /* 32365 */ 27, 27, 402, 404, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1756, 67, 438, 45, 45, 45, 45,
  /* 32390 */ 45, 45, 45, 45, 449, 450, 45, 45, 45, 67, 67, 214, 218, 221, 67, 229, 67, 67, 243, 245, 248, 67, 67, 67,
  /* 32414 */ 67, 67, 488, 490, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1071, 67, 1073, 67, 67, 67, 67, 67, 524, 67,
  /* 32439 */ 67, 67, 67, 67, 67, 67, 67, 535, 536, 67, 67, 67, 67, 67, 67, 1683, 1684, 67, 67, 67, 67, 1688, 1689, 67,
  /* 32463 */ 67, 67, 67, 67, 67, 1694, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1288, 67, 67, 67, 67, 67, 67, 97, 97, 97,
  /* 32488 */ 585, 587, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1163, 97, 97, 97, 97, 97, 97, 97, 621, 97, 97, 97,
  /* 32513 */ 97, 97, 97, 97, 97, 632, 633, 97, 97, 0, 0, 97, 1783, 97, 97, 97, 97, 0, 0, 97, 97, 0, 97, 97, 97, 45,
  /* 32539 */ 2026, 45, 45, 45, 45, 67, 2030, 67, 67, 67, 67, 67, 67, 1053, 1054, 67, 67, 67, 67, 67, 67, 1061, 67, 712,
  /* 32563 */ 45, 45, 45, 717, 45, 45, 45, 45, 45, 45, 45, 45, 725, 45, 45, 45, 163, 167, 173, 177, 45, 45, 45, 45, 45,
  /* 32588 */ 193, 45, 45, 45, 45, 982, 45, 45, 45, 45, 45, 45, 987, 45, 45, 45, 45, 45, 1558, 45, 1560, 45, 45, 45, 45,
  /* 32613 */ 45, 45, 45, 45, 704, 705, 45, 45, 45, 45, 45, 45, 45, 45, 731, 45, 45, 45, 67, 67, 67, 67, 67, 739, 67,
  /* 32638 */ 67, 67, 67, 67, 67, 464, 67, 67, 67, 67, 67, 67, 479, 67, 67, 67, 67, 67, 764, 67, 67, 67, 67, 67, 67, 67,
  /* 32664 */ 67, 67, 67, 67, 67, 1290, 67, 67, 67, 67, 67, 67, 812, 67, 67, 67, 67, 818, 67, 67, 67, 25398, 542, 13112,
  /* 32688 */ 544, 57889, 0, 0, 54074, 54074, 550, 0, 97, 97, 97, 97, 97, 837, 97, 97, 97, 97, 97, 602, 97, 97, 97, 97,
  /* 32712 */ 97, 97, 97, 97, 97, 97, 1137, 97, 97, 97, 97, 97, 97, 97, 97, 97, 862, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 32738 */ 97, 97, 1627, 97, 97, 97, 0, 97, 97, 97, 97, 910, 97, 97, 97, 97, 916, 97, 97, 97, 0, 0, 0, 97, 97, 1940,
  /* 32764 */ 97, 97, 1942, 45, 45, 45, 45, 45, 45, 385, 45, 45, 45, 45, 395, 45, 45, 45, 45, 966, 45, 969, 45, 45, 45,
  /* 32789 */ 45, 45, 45, 45, 45, 45, 45, 975, 45, 45, 45, 406, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 974, 45,
  /* 32815 */ 45, 45, 67, 67, 67, 67, 1010, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1262, 67, 67, 67, 67, 67, 67,
  /* 32840 */ 67, 67, 67, 1040, 67, 1042, 67, 1045, 67, 67, 67, 67, 67, 67, 67, 527, 67, 67, 67, 67, 67, 67, 537, 67,
  /* 32864 */ 67, 67, 67, 67, 1051, 67, 67, 67, 67, 67, 1057, 67, 67, 67, 67, 67, 67, 67, 1454, 67, 67, 67, 67, 67, 67,
  /* 32889 */ 67, 67, 67, 1445, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1079, 25398, 0, 13112, 0, 54074, 0, 0, 0, 0, 0,
  /* 32914 */ 0, 0, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2207744, 2207744,
  /* 32927 */ 2207744, 2207744, 2207744, 2572288, 2207744, 2207744, 2207744, 1098, 97, 97, 97, 97, 97, 1104, 97, 97, 97,
  /* 32944 */ 97, 97, 97, 97, 97, 97, 1356, 97, 97, 97, 97, 97, 97, 1128, 97, 97, 97, 97, 97, 97, 1134, 97, 1136, 97,
  /* 32968 */ 1139, 97, 97, 97, 97, 97, 97, 1622, 97, 97, 97, 97, 97, 97, 97, 97, 0, 921, 0, 0, 0, 1176, 0, 646, 45, 67,
  /* 32994 */ 67, 67, 1268, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1469, 67, 67, 67, 97, 1348, 97, 97, 97, 97,
  /* 33019 */ 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1127, 97, 67, 1569, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 33044 */ 67, 67, 67, 1448, 1449, 67, 1816, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1825, 67, 67, 1827, 97, 97, 0, 0,
  /* 33068 */ 1782, 97, 97, 97, 97, 97, 0, 0, 97, 97, 0, 97, 97, 97, 1831, 0, 0, 97, 97, 97, 97, 97, 0, 0, 0, 97, 97,
  /* 33095 */ 97, 1980, 97, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1395, 45, 45, 45, 45, 45, 97, 1846, 97, 97, 45, 45,
  /* 33120 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1212, 45, 45, 45, 45, 45, 45, 2010, 45, 67, 67, 67, 67, 67, 2016,
  /* 33145 */ 67, 97, 97, 0, 0, 97, 97, 97, 0, 97, 97, 97, 97, 97, 45, 45, 2007, 0, 94242, 0, 0, 0, 38, 102439, 0, 0,
  /* 33171 */ 106538, 98347, 28809, 45, 45, 143, 45, 45, 45, 1671, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 67, 1813,
  /* 33194 */ 67, 67, 1815, 45, 45, 67, 210, 67, 67, 67, 67, 67, 67, 239, 67, 67, 67, 67, 67, 67, 67, 1575, 67, 67, 67,
  /* 33219 */ 67, 67, 67, 67, 67, 493, 67, 67, 67, 67, 67, 67, 67, 97, 97, 290, 97, 97, 97, 97, 97, 97, 319, 97, 97, 97,
  /* 33245 */ 97, 97, 97, 303, 97, 97, 317, 97, 97, 97, 97, 97, 97, 305, 97, 97, 97, 97, 97, 97, 97, 97, 97, 899, 97,
  /* 33270 */ 97, 97, 97, 97, 97, 375, 45, 45, 45, 379, 45, 45, 390, 45, 45, 394, 45, 45, 45, 45, 45, 443, 45, 45, 45,
  /* 33295 */ 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 461, 67, 67, 67, 465, 67, 67, 476, 67, 67, 480, 67, 67, 67, 67,
  /* 33320 */ 67, 67, 1761, 67, 67, 67, 67, 67, 67, 67, 67, 67, 530, 67, 67, 67, 67, 67, 67, 500, 67, 67, 67, 67, 67,
  /* 33345 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1075, 97, 97, 97, 558, 97, 97, 97, 562, 97, 97, 573, 97, 97, 577,
  /* 33370 */ 97, 97, 0, 1999, 97, 97, 97, 0, 97, 97, 2004, 2005, 97, 45, 45, 45, 45, 1193, 45, 45, 45, 45, 45, 45, 45,
  /* 33395 */ 45, 45, 45, 45, 676, 45, 45, 45, 45, 597, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 33420 */ 1334, 45, 681, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1396, 45, 45, 1399, 45, 45, 730,
  /* 33444 */ 45, 45, 45, 45, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1434, 67, 67, 67, 67, 67, 67, 750, 67, 67, 67, 67,
  /* 33470 */ 67, 67, 67, 67, 67, 67, 1456, 67, 67, 67, 67, 67, 45, 45, 993, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 33496 */ 67, 67, 1238, 67, 67, 1006, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1280, 1048, 1049,
  /* 33520 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1059, 67, 67, 67, 67, 67, 67, 1296, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 33547 */ 2367488, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 97, 97, 1100, 97, 97, 97, 97, 97, 97, 97,
  /* 33564 */ 97, 97, 97, 97, 97, 97, 638, 0, 920, 97, 97, 1142, 1143, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1153, 97,
  /* 33589 */ 97, 97, 97, 97, 1144, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1149, 97, 97, 97, 97, 1154, 45, 1218, 45,
  /* 33613 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1678, 45, 45, 45, 67, 67, 67, 67, 67, 1269, 67, 67,
  /* 33638 */ 67, 67, 67, 67, 67, 67, 1278, 67, 67, 67, 67, 67, 67, 1772, 67, 67, 97, 97, 97, 97, 97, 97, 97, 0, 921,
  /* 33663 */ 922, 1175, 0, 0, 0, 0, 45, 97, 97, 1349, 97, 97, 97, 97, 97, 97, 97, 97, 1358, 97, 97, 97, 97, 97, 97,
  /* 33688 */ 1623, 97, 97, 97, 97, 97, 97, 97, 97, 0, 921, 0, 0, 926, 0, 0, 0, 45, 45, 1411, 45, 45, 45, 45, 45, 45,
  /* 33714 */ 45, 45, 45, 45, 45, 45, 45, 45, 1754, 45, 45, 67, 67, 1301, 0, 1307, 0, 1313, 97, 97, 97, 97, 97, 97, 97,
  /* 33739 */ 97, 97, 97, 97, 21054, 97, 97, 97, 97, 67, 1757, 67, 67, 67, 1760, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 33764 */ 1467, 67, 67, 67, 67, 67, 1778, 97, 0, 0, 97, 97, 97, 97, 97, 97, 0, 0, 97, 97, 0, 97, 97, 97, 97, 97,
  /* 33790 */ 1158, 97, 97, 97, 1161, 97, 97, 97, 97, 1166, 97, 97, 97, 97, 97, 1325, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 33814 */ 97, 97, 1328, 97, 97, 97, 97, 97, 97, 97, 67, 67, 67, 67, 67, 1820, 67, 1822, 67, 67, 67, 67, 67, 97, 97,
  /* 33839 */ 97, 97, 97, 0, 0, 0, 97, 1933, 97, 1892, 97, 97, 97, 97, 97, 97, 1899, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 33864 */ 1664, 45, 45, 45, 45, 45, 45, 45, 45, 1546, 45, 45, 45, 45, 45, 45, 45, 45, 1208, 45, 45, 45, 45, 45, 45,
  /* 33889 */ 45, 45, 1224, 45, 45, 45, 45, 45, 45, 45, 45, 673, 45, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 1925,
  /* 33914 */ 97, 97, 97, 97, 0, 0, 0, 97, 97, 97, 97, 97, 623, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 307, 97, 97, 97,
  /* 33941 */ 97, 97, 97, 97, 97, 97, 1796, 97, 45, 45, 45, 45, 45, 45, 45, 970, 45, 45, 45, 45, 45, 45, 45, 45, 1417,
  /* 33966 */ 45, 45, 45, 45, 45, 45, 45, 67, 1964, 67, 67, 97, 97, 97, 97, 0, 0, 0, 97, 97, 97, 97, 0, 97, 97, 97, 97,
  /* 33993 */ 97, 97, 1721, 97, 97, 0, 0, 1997, 97, 0, 0, 2000, 97, 97, 0, 97, 97, 97, 97, 97, 45, 45, 45, 45, 733, 45,
  /* 34019 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 803, 67, 67, 67, 67, 67, 0, 94242, 0, 0, 0, 38, 102439, 0, 0,
  /* 34044 */ 106538, 98347, 28809, 45, 45, 144, 45, 45, 45, 1805, 45, 1807, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 67,
  /* 34067 */ 231, 67, 67, 67, 67, 67, 67, 67, 0, 24850, 12564, 0, 0, 0, 281, 28809, 53531, 45, 45, 67, 211, 67, 67, 67,
  /* 34091 */ 67, 230, 234, 240, 244, 67, 67, 67, 67, 67, 67, 492, 67, 67, 67, 67, 67, 67, 67, 67, 67, 471, 67, 67, 67,
  /* 34116 */ 67, 481, 67, 67, 260, 67, 67, 67, 67, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809, 53531, 97, 97, 291, 97, 97,
  /* 34140 */ 97, 97, 310, 314, 320, 324, 97, 97, 97, 97, 97, 97, 1367, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1355, 97,
  /* 34164 */ 97, 97, 97, 97, 97, 1362, 340, 97, 97, 97, 97, 97, 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27, 131427, 0, 0,
  /* 34189 */ 360, 0, 362, 0, 365, 28809, 367, 139, 369, 45, 45, 45, 374, 67, 67, 460, 67, 67, 67, 67, 466, 67, 67, 67,
  /* 34213 */ 67, 67, 67, 67, 67, 801, 67, 67, 67, 67, 67, 67, 67, 67, 67, 487, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 34239 */ 498, 67, 67, 67, 67, 67, 67, 1821, 67, 67, 67, 67, 67, 67, 97, 97, 97, 97, 97, 0, 0, 0, 97, 97, 97, 97, 0,
  /* 34266 */ 0, 67, 502, 67, 67, 67, 67, 67, 67, 67, 508, 67, 67, 67, 515, 517, 67, 67, 67, 67, 67, 97, 97, 97, 97, 97,
  /* 34292 */ 0, 0, 1931, 97, 97, 97, 97, 97, 588, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 629, 97, 97, 97, 97, 97, 67,
  /* 34318 */ 24850, 24850, 12564, 12564, 0, 57889, 0, 0, 0, 53531, 53531, 367, 286, 552, 97, 97, 97, 97, 97, 1352, 97,
  /* 34339 */ 97, 97, 97, 97, 97, 97, 97, 97, 97, 1511, 97, 97, 97, 97, 97, 97, 97, 557, 97, 97, 97, 97, 563, 97, 97,
  /* 34364 */ 97, 97, 97, 97, 97, 97, 1135, 97, 97, 97, 97, 97, 97, 97, 97, 97, 584, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 34390 */ 97, 595, 97, 97, 97, 97, 97, 895, 97, 97, 97, 97, 97, 97, 903, 97, 97, 97, 0, 97, 97, 1638, 97, 97, 97,
  /* 34415 */ 97, 97, 97, 97, 97, 1646, 97, 599, 97, 97, 97, 97, 97, 97, 97, 605, 97, 97, 97, 612, 614, 97, 97, 97, 97,
  /* 34440 */ 97, 1377, 0, 0, 45, 45, 45, 45, 45, 45, 45, 45, 655, 45, 45, 45, 45, 45, 45, 45, 745, 67, 67, 67, 67, 751,
  /* 34466 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1577, 67, 67, 67, 67, 67, 762, 67, 67, 67, 67, 766, 67, 67, 67,
  /* 34491 */ 67, 67, 67, 67, 67, 67, 67, 1765, 67, 67, 67, 67, 67, 777, 67, 67, 781, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 34516 */ 67, 67, 67, 67, 1592, 1593, 67, 67, 97, 843, 97, 97, 97, 97, 849, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 34540 */ 1510, 97, 97, 97, 97, 97, 97, 97, 860, 97, 97, 97, 97, 864, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1797, 45,
  /* 34565 */ 45, 45, 45, 1801, 45, 97, 875, 97, 97, 879, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1522, 97, 97, 97,
  /* 34590 */ 97, 97, 991, 45, 45, 45, 45, 996, 45, 45, 45, 45, 45, 45, 45, 45, 67, 67, 215, 67, 67, 67, 67, 233, 67,
  /* 34615 */ 67, 67, 67, 251, 253, 1022, 67, 67, 67, 1026, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1035, 67, 67, 1038,
  /* 34639 */ 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1458, 67, 67, 67, 67, 67, 1064, 67, 67, 67, 1067, 67,
  /* 34664 */ 67, 67, 67, 1072, 67, 67, 67, 67, 67, 67, 1442, 67, 67, 67, 67, 67, 67, 67, 67, 67, 97, 97, 97, 1775, 97,
  /* 34689 */ 97, 97, 67, 67, 67, 67, 67, 25398, 0, 13112, 0, 54074, 0, 0, 0, 0, 1096, 0, 921, 29315, 0, 0, 0, 0, 928,
  /* 34714 */ 45, 45, 45, 45, 45, 934, 45, 45, 45, 164, 45, 45, 45, 45, 45, 45, 45, 45, 45, 198, 45, 45, 45, 378, 45,
  /* 34739 */ 45, 45, 45, 45, 45, 393, 45, 45, 45, 398, 45, 97, 97, 1116, 97, 97, 97, 1120, 97, 97, 97, 97, 97, 97, 97,
  /* 34764 */ 97, 97, 1147, 1148, 97, 97, 97, 97, 97, 97, 97, 1129, 97, 97, 1132, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 34788 */ 97, 97, 1626, 97, 97, 97, 97, 0, 45, 1178, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1185, 45, 45, 45, 45, 441,
  /* 34813 */ 45, 45, 45, 45, 45, 45, 451, 45, 45, 67, 67, 67, 67, 67, 227, 67, 67, 67, 67, 67, 67, 67, 67, 1260, 67,
  /* 34838 */ 67, 67, 1263, 67, 67, 1265, 1203, 45, 45, 1205, 45, 1206, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1216, 67,
  /* 34861 */ 1266, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1276, 67, 67, 67, 67, 67, 67, 752, 67, 67, 67, 67, 67, 67, 67,
  /* 34886 */ 67, 67, 1056, 67, 67, 67, 67, 67, 67, 45, 1386, 45, 1389, 45, 45, 45, 45, 1394, 45, 45, 45, 1397, 45, 45,
  /* 34910 */ 45, 45, 995, 45, 997, 45, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 1915, 67, 67, 67, 67, 67, 1422, 45, 45,
  /* 34935 */ 45, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1433, 67, 1436, 67, 67, 67, 67, 1441, 67, 67, 67, 1444, 67, 67,
  /* 34959 */ 67, 67, 67, 67, 67, 0, 24851, 12565, 0, 0, 0, 0, 28809, 53532, 97, 97, 97, 97, 1494, 97, 97, 97, 1497, 97,
  /* 34983 */ 97, 97, 97, 97, 97, 97, 1368, 97, 97, 97, 97, 97, 97, 97, 97, 851, 97, 97, 97, 97, 97, 97, 97, 67, 67, 67,
  /* 35009 */ 1571, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 25398, 542, 13112, 544, 67, 67, 1583, 67, 67, 67,
  /* 35032 */ 67, 67, 67, 67, 67, 1591, 67, 67, 67, 67, 67, 67, 782, 67, 67, 67, 67, 67, 67, 67, 67, 67, 756, 67, 67,
  /* 35057 */ 67, 67, 67, 67, 97, 1634, 97, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1125, 97, 97, 97, 1647,
  /* 35082 */ 97, 97, 97, 97, 97, 0, 45, 45, 45, 45, 45, 45, 45, 45, 45, 719, 720, 45, 45, 45, 45, 45, 45, 45, 45, 685,
  /* 35108 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 942, 45, 45, 946, 45, 45, 45, 950, 45, 45, 1658, 45, 45, 45, 45, 45,
  /* 35133 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 1668, 1712, 97, 97, 97, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 0, 0,
  /* 35159 */ 1835, 97, 97, 97, 97, 0, 0, 0, 97, 97, 1844, 97, 97, 1726, 0, 97, 97, 97, 97, 97, 1732, 97, 1734, 97, 97,
  /* 35184 */ 97, 97, 97, 300, 97, 308, 97, 97, 97, 97, 97, 97, 97, 97, 866, 97, 97, 97, 97, 97, 97, 97, 67, 67, 67,
  /* 35209 */ 1758, 67, 67, 67, 1762, 67, 67, 67, 67, 67, 67, 67, 67, 1043, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 35234 */ 67, 1771, 67, 67, 67, 97, 97, 97, 97, 97, 1776, 97, 97, 97, 97, 97, 1794, 97, 97, 97, 45, 45, 45, 45, 45,
  /* 35259 */ 45, 45, 1183, 45, 45, 45, 45, 45, 45, 45, 45, 45, 409, 45, 45, 45, 45, 45, 45, 67, 67, 67, 1966, 97, 97,
  /* 35284 */ 97, 1970, 0, 0, 0, 97, 97, 97, 97, 0, 97, 97, 97, 1720, 97, 97, 97, 97, 97, 0, 0, 97, 97, 97, 1837, 97, 0,
  /* 35311 */ 1840, 1841, 97, 97, 97, 1988, 45, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1994, 1995, 67, 97, 97, 97, 97, 97,
  /* 35335 */ 911, 97, 97, 97, 97, 97, 97, 97, 638, 0, 0, 0, 0, 1315, 0, 0, 0, 0, 97, 97, 97, 1319, 97, 97, 97, 0, 97,
  /* 35362 */ 97, 97, 97, 97, 97, 1733, 97, 97, 97, 97, 97, 97, 1340, 97, 97, 97, 1343, 97, 97, 1345, 97, 1346, 67, 67,
  /* 35386 */ 265, 67, 67, 67, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809, 53531, 97, 345, 97, 97, 97, 97, 0, 40976, 0, 18,
  /* 35410 */ 18, 24, 24, 27, 27, 27, 131427, 0, 0, 0, 361, 362, 0, 365, 28809, 367, 139, 45, 45, 45, 45, 45, 671, 45,
  /* 35434 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 411, 45, 45, 414, 45, 45, 45, 45, 377, 45, 45, 45, 386, 45, 45, 45,
  /* 35459 */ 45, 45, 45, 45, 45, 45, 1207, 45, 45, 45, 45, 45, 45, 1213, 45, 45, 67, 67, 67, 67, 67, 463, 67, 67, 67,
  /* 35484 */ 472, 67, 67, 67, 67, 67, 67, 67, 528, 67, 67, 67, 67, 67, 67, 67, 67, 1287, 67, 67, 67, 67, 67, 67, 67,
  /* 35509 */ 540, 24850, 24850, 12564, 12564, 0, 57889, 0, 0, 0, 53531, 53531, 367, 286, 97, 97, 97, 97, 97, 1103, 97,
  /* 35530 */ 97, 97, 97, 97, 97, 97, 97, 97, 97, 917, 97, 97, 0, 0, 0, 637, 18, 131427, 0, 0, 0, 0, 0, 0, 362, 0, 0,
  /* 35557 */ 365, 29315, 367, 0, 921, 29315, 0, 0, 0, 927, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1223, 45, 45, 45, 45,
  /* 35581 */ 45, 45, 45, 45, 45, 426, 45, 45, 433, 45, 45, 45, 45, 697, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 708,
  /* 35606 */ 45, 45, 45, 45, 1221, 45, 45, 45, 45, 1225, 45, 45, 45, 45, 45, 45, 384, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 35631 */ 45, 1198, 45, 45, 45, 45, 45, 45, 67, 67, 795, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1470,
  /* 35656 */ 67, 67, 67, 67, 67, 67, 67, 815, 67, 67, 67, 67, 67, 67, 25398, 542, 13112, 544, 97, 97, 97, 893, 97, 97,
  /* 35680 */ 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1164, 97, 97, 97, 67, 67, 67, 1025, 67, 67, 67, 67, 67, 67, 67,
  /* 35705 */ 67, 67, 67, 67, 67, 1687, 67, 67, 67, 67, 67, 67, 67, 67, 67, 25398, 0, 13112, 0, 54074, 0, 0, 0, 0, 0,
  /* 35730 */ 1097, 1241, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1450, 45, 45, 1388, 45, 1390, 45,
  /* 35754 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1236, 67, 67, 67, 67, 67, 1437, 67, 67, 67, 67, 67, 67, 67, 67,
  /* 35779 */ 67, 67, 67, 67, 67, 67, 67, 1472, 1490, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1503,
  /* 35804 */ 67, 67, 67, 67, 67, 97, 97, 97, 97, 97, 0, 1930, 0, 97, 97, 97, 97, 97, 847, 97, 97, 97, 97, 97, 97, 97,
  /* 35830 */ 97, 97, 858, 67, 67, 1965, 67, 97, 97, 97, 97, 0, 0, 0, 97, 97, 97, 97, 0, 97, 97, 1719, 97, 97, 97, 97,
  /* 35856 */ 97, 97, 0, 0, 0, 45, 45, 45, 45, 1382, 45, 1383, 45, 45, 45, 159, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 35882 */ 45, 45, 45, 1563, 45, 45, 45, 45, 45, 67, 261, 67, 67, 67, 67, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809,
  /* 35906 */ 53531, 341, 97, 97, 97, 97, 97, 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27, 97, 1099, 97, 97, 97, 97, 97, 97,
  /* 35931 */ 97, 97, 97, 97, 97, 97, 97, 97, 1333, 97, 1230, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67,
  /* 35956 */ 67, 67, 1992, 67, 1993, 67, 67, 67, 97, 97, 45, 45, 160, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 35981 */ 45, 1665, 45, 45, 45, 45, 45, 131427, 357, 0, 0, 0, 362, 0, 365, 28809, 367, 139, 45, 45, 45, 45, 45, 684,
  /* 36005 */ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 412, 45, 45, 45, 416, 45, 45, 45, 440, 45, 45, 45, 45, 45, 45, 45,
  /* 36031 */ 45, 45, 45, 45, 67, 67, 1990, 67, 1991, 67, 67, 67, 67, 67, 67, 67, 97, 97, 1707, 97, 97, 97, 97, 97, 97,
  /* 36056 */ 501, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 1691, 67, 67, 67, 67, 67, 526, 67, 67,
  /* 36081 */ 67, 67, 67, 67, 67, 67, 67, 67, 1030, 67, 1032, 67, 67, 67, 67, 598, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 36106 */ 97, 97, 97, 97, 97, 97, 1632, 0, 921, 29315, 923, 0, 0, 0, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1392, 45,
  /* 36131 */ 45, 45, 45, 45, 45, 45, 45, 45, 960, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 25398, 0, 13112, 0,
  /* 36155 */ 54074, 0, 0, 1093, 0, 0, 0, 0, 0, 97, 1609, 97, 97, 97, 97, 97, 97, 97, 97, 97, 1369, 97, 97, 97, 1372,
  /* 36180 */ 97, 97, 67, 67, 266, 67, 67, 67, 67, 0, 24850, 12564, 0, 0, 0, 0, 28809, 53531, 97, 346, 97, 97, 97, 97,
  /* 36204 */ 0, 40976, 0, 18, 18, 24, 24, 27, 27, 27, 665, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
  /* 36230 */ 1677, 45, 45, 45, 45, 67, 45, 45, 954, 45, 956, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1404, 45, 45,
  /* 36255 */ 45, 45, 45, 45, 45, 45, 45, 425, 45, 45, 45, 45, 45, 45, 67, 67, 67, 67, 67, 1270, 67, 67, 67, 67, 67, 67,
  /* 36281 */ 67, 67, 67, 67, 1069, 67, 67, 67, 67, 67, 67, 97, 97, 97, 1350, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 36306 */ 97, 97, 1524, 97, 97, 97, 97, 97, 97, 97, 1376, 0, 0, 0, 45, 45, 45, 45, 45, 45, 45, 45, 1545, 45, 45, 45,
  /* 36332 */ 45, 45, 45, 45, 45, 45, 448, 45, 45, 45, 45, 67, 456, 67, 67, 67, 67, 67, 1573, 67, 67, 67, 67, 67, 67,
  /* 36357 */ 67, 67, 67, 67, 1247, 67, 67, 67, 67, 67, 1252, 97, 1725, 97, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 97,
  /* 36382 */ 97, 97, 1628, 97, 1630, 0, 0, 94242, 0, 0, 0, 2211840, 0, 1118208, 0, 0, 0, 0, 2158592, 2158731, 2158592,
  /* 36403 */ 2158592, 2158592, 3117056, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 36414 */ 2158592, 2158592, 2158592, 2158592, 3018752, 2158592, 3043328, 2158592, 2158592, 2158592, 2158592,
  /* 36425 */ 3080192, 2158592, 2158592, 3112960, 2158592, 2158592, 2158592, 2158592, 2158592, 2158878, 2158592,
  /* 36436 */ 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 36447 */ 2158592, 2158592, 2605056, 2158592, 2158592, 2207744, 0, 542, 0, 544, 0, 0, 2166784, 0, 0, 0, 550, 0, 0,
  /* 36466 */ 2158592, 2158592, 2686976, 2158592, 2715648, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 36477 */ 2158592, 2867200, 2158592, 2904064, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 0,
  /* 36489 */ 94242, 0, 0, 0, 2211840, 0, 0, 1130496, 0, 0, 0, 2158592, 2158592, 2158592, 2158592, 2158592, 3186688,
  /* 36506 */ 2158592, 0, 0, 139, 0, 0, 0, 139, 0, 2367488, 2207744, 0, 0, 0, 0, 176128, 0, 2166784, 0, 0, 0, 0, 0, 286,
  /* 36530 */ 2158592, 2158592, 3170304, 3174400, 2158592, 0, 0, 0, 2158592, 2158592, 2158592, 2158592, 2158592,
  /* 36543 */ 2424832, 2158592, 2158592, 2158592, 1508, 2158592, 2908160, 2158592, 2158592, 2158592, 2977792, 2158592,
  /* 36555 */ 2158592, 2158592, 2158592, 3039232, 2158592, 2158592, 2158592, 2158592, 2158592, 2158592, 3158016, 67,
  /* 36567 */ 24850, 24850, 12564, 12564, 0, 0, 0, 0, 0, 53531, 53531, 0, 286, 97, 97, 97, 97, 97, 1119, 97, 97, 97, 97,
  /* 36590 */ 97, 97, 97, 97, 97, 97, 1509, 97, 97, 97, 97, 97, 97, 97, 97, 564, 97, 97, 97, 97, 97, 97, 97, 57889, 0,
  /* 36615 */ 0, 0, 0, 550, 0, 97, 97, 97, 97, 97, 97, 97, 97, 97, 561, 97, 97, 97, 97, 97, 97, 576, 97, 97, 139264,
  /* 36640 */ 139264, 139264, 139264, 139264, 139264, 139264, 139264, 139264, 139264, 139264, 139264, 0, 0, 139264, 0,
  /* 36655 */ 921, 29315, 0, 0, 926, 0, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1811, 45, 67, 67, 67, 67, 67, 0, 2146304,
  /* 36679 */ 2146304, 0, 0, 0, 0, 2224128, 2224128, 2224128, 2232320, 2232320, 2232320, 2232320, 0, 0, 1301, 0, 0, 0,
  /* 36697 */ 0, 0, 1307, 0, 0, 0, 0, 0, 1313, 0, 0, 0, 0, 0, 0, 0, 97, 97, 1318, 97, 97, 97, 97, 97, 97, 1795, 97, 97,
  /* 36725 */ 45, 45, 45, 45, 45, 45, 45, 446, 45, 45, 45, 45, 45, 45, 67, 67, 2158592, 2146304, 0, 0, 0, 0, 0, 0, 0,
  /* 36750 */ 2211840, 0, 0, 0, 0, 2158592, 0, 921, 29315, 0, 924, 0, 0, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 1537,
  /* 36774 */ 45, 45, 45, 45
];

JSONiqTokenizer.EXPECTED =
[
  /*    0 */ 290, 300, 304, 353, 296, 309, 305, 319, 315, 324, 328, 352, 354, 334, 338, 330, 320, 345, 349, 293, 358,
  /*   21 */ 362, 341, 366, 312, 370, 374, 378, 382, 386, 390, 394, 398, 737, 402, 634, 439, 604, 634, 634, 634, 634,
  /*   42 */ 408, 634, 634, 634, 404, 634, 634, 634, 457, 634, 634, 963, 634, 634, 413, 634, 634, 634, 634, 634, 634,
  /*   63 */ 634, 663, 418, 422, 903, 902, 426, 431, 548, 634, 437, 521, 919, 443, 615, 409, 449, 455, 624, 731, 751,
  /*   84 */ 634, 461, 465, 672, 470, 469, 474, 481, 485, 477, 489, 493, 629, 542, 497, 505, 603, 602, 991, 648, 510,
  /*  105 */ 804, 634, 515, 958, 526, 525, 530, 768, 634, 546, 552, 711, 710, 593, 558, 562, 618, 566, 570, 574, 578,
  /*  126 */ 582, 586, 590, 608, 612, 660, 822, 821, 634, 622, 596, 444, 628, 533, 724, 633, 640, 653, 647, 652, 536,
  /*  147 */ 1008, 451, 450, 445, 657, 670, 676, 685, 689, 693, 697, 701, 704, 707, 715, 719, 798, 815, 634, 723, 762,
  /*  168 */ 996, 634, 728, 969, 730, 735, 908, 634, 741, 679, 889, 511, 747, 634, 750, 755, 499, 666, 499, 501, 759,
  /*  189 */ 772, 776, 780, 634, 787, 784, 797, 802, 809, 808, 427, 814, 1006, 517, 634, 519, 853, 634, 813, 850, 793,
  /*  210 */ 634, 819, 826, 833, 832, 837, 843, 847, 857, 861, 863, 867, 871, 875, 879, 883, 643, 887, 539, 980, 979,
  /*  231 */ 634, 893, 944, 634, 900, 896, 634, 907, 933, 506, 912, 917, 828, 433, 636, 635, 554, 961, 923, 930, 927,
  /*  252 */ 937, 941, 634, 634, 634, 974, 948, 952, 985, 913, 968, 967, 743, 634, 973, 839, 634, 978, 599, 634, 984,
  /*  273 */ 989, 765, 444, 995, 1000, 634, 1003, 790, 955, 1012, 681, 634, 634, 634, 634, 634, 414, 1016, 1020, 1024,
  /*  293 */ 1085, 1027, 1090, 1090, 1046, 1080, 1137, 1108, 1215, 1049, 1032, 1039, 1085, 1085, 1085, 1085, 1058, 1062,
  /*  311 */ 1068, 1085, 1086, 1090, 1090, 1091, 1072, 1064, 1107, 1090, 1090, 1090, 1118, 1123, 1138, 1078, 1074, 1084,
  /*  329 */ 1085, 1085, 1085, 1087, 1090, 1062, 1052, 1060, 1114, 1062, 1104, 1085, 1085, 1090, 1090, 1028, 1122, 1063,
  /*  347 */ 1128, 1139, 1127, 1158, 1085, 1085, 1151, 1090, 1090, 1090, 1095, 1090, 1132, 1073, 1136, 1143, 1061, 1150,
  /*  365 */ 1085, 1155, 1098, 1101, 1146, 1162, 1169, 1101, 1185, 1151, 1090, 1110, 1173, 1054, 1087, 1109, 1177, 1165,
  /*  383 */ 1089, 1204, 1184, 1107, 1189, 1193, 1088, 1197, 1180, 1201, 1208, 1042, 1212, 1219, 1223, 1227, 1231, 1235,
  /*  401 */ 1245, 1777, 1527, 1686, 1686, 1238, 1686, 1254, 1686, 1686, 1686, 1294, 1669, 1686, 1686, 1686, 1322, 1625,
  /*  419 */ 1534, 1268, 1624, 1275, 1281, 1443, 1292, 1300, 1686, 1686, 1686, 1350, 1826, 1306, 1686, 1686, 1240, 2032,
  /*  437 */ 1317, 1321, 1686, 1686, 1253, 1686, 1326, 1686, 1686, 1686, 1418, 1709, 1446, 1686, 1686, 1686, 1492, 1686,
  /*  455 */ 1295, 1447, 1686, 1686, 1258, 1686, 1736, 1686, 1686, 1520, 1355, 1686, 1288, 1348, 1361, 1686, 1359, 1686,
  /*  473 */ 1364, 1498, 1368, 1302, 1362, 1381, 1389, 1395, 1486, 1686, 1371, 1377, 1370, 1686, 1375, 1382, 1384, 1402,
  /*  491 */ 1408, 1385, 1383, 1619, 1413, 1423, 1428, 1433, 1686, 1686, 1270, 1686, 1338, 1686, 1440, 1686, 1686, 1686,
  /*  509 */ 1499, 1465, 1686, 1686, 1686, 1639, 1473, 1884, 1686, 1686, 1293, 1864, 1686, 1686, 1296, 1321, 1483, 1686,
  /*  527 */ 1686, 1686, 1646, 1686, 1748, 1496, 1686, 1418, 1675, 1686, 1418, 1702, 1686, 1418, 1981, 1686, 1429, 1409,
  /*  545 */ 1427, 1504, 1692, 1686, 1686, 1313, 1448, 1651, 1508, 1686, 1686, 1340, 1686, 1903, 1686, 1686, 1435, 1513,
  /*  563 */ 1686, 1283, 1287, 1519, 1686, 1524, 1363, 1568, 1938, 1539, 1566, 1579, 1479, 1533, 1538, 1553, 1544, 1552,
  /*  581 */ 1557, 1563, 1574, 1557, 1583, 1589, 1590, 1759, 1594, 1603, 1607, 1611, 1686, 1436, 1514, 1686, 1434, 1656,
  /*  599 */ 1686, 1434, 1680, 1686, 1453, 1686, 1686, 1686, 1559, 1617, 1686, 1770, 1418, 1623, 1769, 1629, 1686, 1515,
  /*  617 */ 1335, 1686, 1285, 1686, 1671, 1921, 1650, 1686, 1686, 1344, 1308, 1666, 1686, 1686, 1686, 1659, 1685, 1686,
  /*  635 */ 1686, 1686, 1686, 1241, 1686, 1686, 1844, 1691, 1686, 1630, 1977, 1970, 1362, 1686, 1686, 1686, 1693, 1698,
  /*  653 */ 1686, 1686, 1686, 1697, 1686, 1764, 1715, 1686, 1634, 1638, 1686, 1599, 1585, 1686, 1271, 1686, 1269, 1686,
  /*  671 */ 1721, 1686, 1686, 1354, 1686, 1801, 1686, 1799, 1686, 1640, 1686, 1686, 1461, 1686, 1686, 1732, 1686, 1944,
  /*  689 */ 1686, 1740, 1686, 1746, 1415, 1396, 1686, 1598, 1547, 1417, 1597, 1416, 1577, 1546, 1397, 1577, 1547, 1548,
  /*  707 */ 1570, 1398, 1753, 1686, 1652, 1509, 1686, 1686, 1686, 1757, 1686, 1419, 1686, 1763, 1418, 1768, 1781, 1686,
  /*  725 */ 1686, 1686, 1705, 1686, 2048, 1792, 1686, 1686, 1686, 1735, 1686, 1797, 1686, 1686, 1404, 1686, 1639, 1815,
  /*  743 */ 1686, 1686, 1418, 2017, 1820, 1686, 1686, 1803, 1686, 1686, 1686, 1736, 1489, 1686, 1686, 1825, 1338, 1260,
  /*  761 */ 1263, 1686, 1686, 1785, 1686, 1686, 1728, 1686, 1686, 1749, 1497, 1830, 1830, 1262, 1248, 1261, 1329, 1260,
  /*  779 */ 1264, 1329, 1248, 1249, 1259, 1540, 1849, 1842, 1686, 1686, 1835, 1686, 1686, 1816, 1686, 1686, 1831, 1882,
  /*  797 */ 1848, 1686, 1686, 1686, 1774, 2071, 1854, 1686, 1686, 1469, 1884, 1686, 1821, 1859, 1686, 1686, 1350, 1883,
  /*  815 */ 1686, 1686, 1686, 1781, 1391, 1875, 1686, 1686, 1613, 1644, 1686, 1686, 1889, 1686, 1686, 1662, 1884, 1686,
  /*  833 */ 1885, 1890, 1686, 1686, 1686, 1894, 1686, 1686, 1678, 1686, 1907, 1686, 1686, 1529, 1914, 1686, 1838, 1686,
  /*  851 */ 1686, 1881, 1686, 1686, 1872, 1876, 1836, 1919, 1686, 1837, 1692, 1910, 1686, 1925, 1928, 1742, 1686, 1811,
  /*  869 */ 1811, 1930, 1810, 1929, 1935, 1928, 1900, 1942, 1867, 1868, 1931, 1035, 1788, 1948, 1952, 1956, 1960, 1964,
  /*  887 */ 1686, 1976, 1686, 1686, 1686, 2065, 1686, 1992, 2037, 1686, 1686, 1998, 2009, 1972, 2002, 1686, 1686, 1686,
  /*  905 */ 2077, 1300, 2023, 1686, 1686, 1686, 1807, 2031, 1686, 1686, 1686, 1860, 1500, 2032, 1686, 1686, 1686, 2083,
  /*  923 */ 1686, 2036, 1686, 1277, 1276, 2042, 1877, 1686, 1686, 2041, 1686, 1686, 2027, 2037, 2012, 1686, 2012, 1855,
  /*  941 */ 1850, 1686, 2046, 1686, 1686, 2054, 1996, 1686, 1897, 1309, 2059, 2052, 1686, 2058, 1686, 1686, 2081, 1686,
  /*  959 */ 1717, 1477, 1686, 1331, 1686, 1686, 1687, 1686, 1860, 1681, 1686, 1686, 1686, 1966, 1724, 1686, 1686, 1686,
  /*  977 */ 1984, 2015, 1686, 1686, 1686, 1988, 1686, 2063, 1686, 1686, 1686, 2005, 1686, 1727, 1686, 1686, 1711, 1457,
  /*  995 */ 2069, 1686, 1686, 1686, 2019, 2075, 1686, 1686, 1915, 1686, 1686, 1793, 1874, 1686, 1686, 1491, 1362, 1449,
  /* 1013 */ 1686, 1686, 1460, 2098, 2087, 2091, 2095, 2184, 2102, 2113, 2780, 2117, 2134, 2142, 2281, 2146, 2146, 2146,
  /* 1031 */ 2304, 2296, 2181, 2639, 2591, 2872, 2592, 2873, 2313, 2195, 2200, 2281, 2146, 2273, 2226, 2204, 2152, 2219,
  /* 1049 */ 2276, 2167, 2177, 2276, 2235, 2276, 2276, 2230, 2281, 2276, 2296, 2276, 2293, 2276, 2276, 2276, 2276, 2234,
  /* 1067 */ 2276, 2311, 2314, 2210, 2199, 2217, 2222, 2276, 2276, 2276, 2240, 2276, 2294, 2276, 2276, 2173, 2276, 2198,
  /* 1085 */ 2281, 2281, 2281, 2281, 2282, 2146, 2146, 2146, 2146, 2205, 2146, 2204, 2248, 2276, 2235, 2276, 2297, 2276,
  /* 1103 */ 2276, 2276, 2277, 2256, 2281, 2283, 2146, 2146, 2146, 2275, 2276, 2295, 2276, 2276, 2293, 2146, 2304, 2264,
  /* 1121 */ 2269, 2221, 2276, 2276, 2276, 2293, 2295, 2276, 2276, 2276, 2295, 2263, 2205, 2268, 2220, 2172, 2276, 2276,
  /* 1139 */ 2276, 2296, 2276, 2276, 2296, 2294, 2276, 2276, 2278, 2281, 2281, 2280, 2281, 2281, 2281, 2283, 2206, 2223,
  /* 1157 */ 2276, 2276, 2279, 2281, 2281, 2146, 2273, 2276, 2276, 2281, 2281, 2281, 2276, 2292, 2276, 2298, 2225, 2276,
  /* 1175 */ 2298, 2169, 2224, 2292, 2298, 2171, 2229, 2281, 2281, 2171, 2236, 2281, 2281, 2281, 2146, 2275, 2225, 2292,
  /* 1193 */ 2299, 2276, 2229, 2281, 2146, 2276, 2290, 2297, 2283, 2146, 2146, 2274, 2224, 2227, 2298, 2225, 2297, 2276,
  /* 1211 */ 2230, 2170, 2230, 2282, 2146, 2147, 2151, 2156, 2288, 2276, 2230, 2303, 2308, 2236, 2284, 2228, 2318, 2318,
  /* 1229 */ 2318, 2326, 2335, 2339, 2343, 2349, 2416, 2693, 2357, 2592, 2109, 2592, 2592, 2162, 2943, 2823, 2646, 2592,
  /* 1247 */ 2361, 2592, 2122, 2592, 2592, 2122, 2470, 2592, 2592, 2592, 2109, 2107, 2592, 2592, 2592, 2123, 2592, 2592,
  /* 1265 */ 2592, 2125, 2592, 2413, 2592, 2592, 2592, 2127, 2592, 2592, 2414, 2592, 2592, 2592, 2130, 2952, 2592, 2594,
  /* 1283 */ 2592, 2592, 2212, 2609, 2252, 2592, 2592, 2592, 2446, 2434, 2592, 2592, 2592, 2212, 2446, 2450, 2456, 2431,
  /* 1301 */ 2435, 2592, 2592, 2243, 2478, 2448, 2439, 2946, 2592, 2592, 2592, 2368, 2809, 2813, 2450, 2441, 2212, 2812,
  /* 1319 */ 2449, 2440, 2947, 2592, 2592, 2592, 2345, 2451, 2457, 2948, 2592, 2124, 2592, 2592, 2650, 2823, 2449, 2455,
  /* 1337 */ 2946, 2592, 2128, 2592, 2592, 2649, 2952, 2592, 2810, 2448, 2461, 2991, 2467, 2592, 2592, 2329, 2817, 2474,
  /* 1355 */ 2990, 2466, 2592, 2592, 2373, 2447, 2992, 2469, 2592, 2592, 2592, 2373, 2447, 2477, 2468, 2592, 2592, 2353,
  /* 1373 */ 2469, 2592, 2495, 2592, 2592, 2415, 2483, 2592, 2415, 2496, 2592, 2592, 2352, 2592, 2592, 2352, 2352, 2469,
  /* 1391 */ 2592, 2592, 2363, 2331, 2494, 2592, 2592, 2592, 2375, 2592, 2375, 2415, 2504, 2592, 2592, 2367, 2372, 2503,
  /* 1409 */ 2592, 2592, 2592, 2389, 2418, 2415, 2592, 2592, 2373, 2592, 2592, 2592, 2593, 2732, 2417, 2415, 2592, 2417,
  /* 1427 */ 2520, 2592, 2592, 2592, 2390, 2521, 2521, 2592, 2592, 2592, 2401, 2599, 2585, 2526, 2531, 2120, 2592, 2212,
  /* 1445 */ 2426, 2450, 2463, 2948, 2592, 2592, 2592, 2213, 2389, 2527, 2532, 2121, 2542, 2551, 2105, 2592, 2213, 2592,
  /* 1463 */ 2592, 2592, 2558, 2538, 2544, 2553, 2557, 2537, 2543, 2552, 2421, 2572, 2576, 2546, 2543, 2547, 2592, 2592,
  /* 1481 */ 2373, 2615, 2575, 2545, 2105, 2592, 2244, 2479, 2592, 2129, 2592, 2592, 2628, 2690, 2469, 2562, 2566, 2592,
  /* 1499 */ 2592, 2592, 2415, 2928, 2934, 2401, 2570, 2574, 2564, 2572, 2585, 2590, 2592, 2592, 2585, 2965, 2592, 2592,
  /* 1517 */ 2592, 2445, 2251, 2592, 2592, 2592, 2474, 2592, 2609, 2892, 2592, 2362, 2592, 2592, 2138, 2851, 2159, 2592,
  /* 1535 */ 2592, 2592, 2509, 2888, 2892, 2592, 2592, 2592, 2490, 2418, 2891, 2592, 2592, 2376, 2592, 2592, 2374, 2592,
  /* 1553 */ 2889, 2388, 2592, 2373, 2373, 2890, 2592, 2592, 2387, 2592, 2887, 2505, 2892, 2592, 2373, 2610, 2388, 2592,
  /* 1571 */ 2592, 2376, 2373, 2592, 2887, 2891, 2592, 2374, 2592, 2592, 2608, 2159, 2614, 2620, 2592, 2592, 2394, 2594,
  /* 1589 */ 2887, 2399, 2592, 2887, 2397, 2508, 2374, 2507, 2592, 2375, 2592, 2592, 2592, 2595, 2508, 2506, 2592, 2506,
  /* 1607 */ 2505, 2505, 2592, 2507, 2637, 2505, 2592, 2592, 2401, 2661, 2592, 2643, 2592, 2592, 2417, 2592, 2655, 2592,
  /* 1625 */ 2592, 2592, 2510, 2414, 2656, 2592, 2592, 2592, 2516, 2592, 2593, 2660, 2665, 2880, 2592, 2592, 2592, 2522,
  /* 1643 */ 2767, 2666, 2881, 2592, 2592, 2420, 2571, 2696, 2592, 2592, 2592, 2580, 2572, 2686, 2632, 2698, 2592, 2383,
  /* 1661 */ 2514, 2592, 2163, 2932, 2465, 2685, 2631, 2697, 2592, 2388, 2592, 2592, 2212, 2604, 2671, 2632, 2678, 2592,
  /* 1679 */ 2401, 2405, 2409, 2592, 2592, 2592, 2679, 2592, 2592, 2592, 2592, 2108, 2677, 2591, 2592, 2592, 2592, 2419,
  /* 1697 */ 2592, 2683, 2187, 2191, 2469, 2671, 2189, 2467, 2592, 2401, 2629, 2633, 2702, 2468, 2592, 2592, 2421, 2536,
  /* 1715 */ 2703, 2469, 2592, 2592, 2422, 2573, 2593, 2672, 2467, 2592, 2402, 2406, 2592, 2402, 2979, 2592, 2592, 2626,
  /* 1733 */ 2673, 2467, 2592, 2446, 2259, 2947, 2592, 2377, 2709, 2592, 2592, 2522, 2862, 2713, 2468, 2592, 2592, 2581,
  /* 1751 */ 2572, 2562, 2374, 2374, 2592, 2376, 2721, 2724, 2592, 2592, 2624, 2373, 2731, 2592, 2592, 2592, 2626, 2732,
  /* 1769 */ 2592, 2592, 2592, 2755, 2656, 2726, 2736, 2741, 2592, 2486, 2593, 2381, 2592, 2727, 2737, 2742, 2715, 2747,
  /* 1787 */ 2753, 2592, 2498, 2469, 2873, 2743, 2592, 2592, 2592, 2791, 2759, 2763, 2592, 2592, 2627, 2704, 2592, 2592,
  /* 1805 */ 2522, 2789, 2593, 2761, 2753, 2592, 2498, 2863, 2592, 2592, 2767, 2592, 2592, 2592, 2792, 2789, 2592, 2592,
  /* 1823 */ 2592, 2803, 2126, 2592, 2592, 2592, 2811, 2122, 2592, 2592, 2592, 2834, 2777, 2592, 2592, 2592, 2848, 2936,
  /* 1841 */ 2591, 2489, 2797, 2592, 2592, 2670, 2631, 2490, 2798, 2592, 2592, 2592, 2963, 2807, 2592, 2592, 2592, 2965,
  /* 1859 */ 2838, 2592, 2592, 2592, 2975, 2330, 2818, 2829, 2592, 2498, 2939, 2592, 2498, 2592, 2791, 2331, 2819, 2830,
  /* 1877 */ 2592, 2592, 2592, 2982, 2834, 2817, 2828, 2106, 2592, 2592, 2592, 2405, 2405, 2817, 2828, 2592, 2592, 2415,
  /* 1895 */ 2849, 2842, 2592, 2522, 2773, 2592, 2522, 2868, 2592, 2580, 2600, 2586, 2137, 2850, 2843, 2592, 2592, 2855,
  /* 1913 */ 2937, 2844, 2592, 2592, 2592, 2987, 2936, 2591, 2592, 2592, 2684, 2630, 2592, 2856, 2938, 2592, 2592, 2860,
  /* 1931 */ 2939, 2592, 2592, 2872, 2592, 2861, 2591, 2592, 2592, 2887, 2616, 2592, 2867, 2592, 2592, 2708, 2592, 2498,
  /* 1949 */ 2469, 2498, 2497, 2785, 2773, 2499, 2783, 2770, 2877, 2877, 2877, 2772, 2592, 2592, 2345, 2885, 2592, 2592,
  /* 1967 */ 2592, 2715, 2762, 2515, 2896, 2592, 2592, 2715, 2917, 2516, 2897, 2592, 2592, 2592, 2901, 2906, 2911, 2592,
  /* 1985 */ 2592, 2956, 2960, 2715, 2902, 2907, 2912, 2593, 2916, 2920, 2820, 2922, 2822, 2592, 2592, 2715, 2927, 2921,
  /* 2003 */ 2821, 2106, 2592, 2592, 2974, 2408, 2321, 2821, 2106, 2592, 2592, 2983, 2592, 2593, 2404, 2408, 2592, 2592,
  /* 2021 */ 2717, 2749, 2716, 2928, 2322, 2822, 2593, 2926, 2919, 2820, 2934, 2823, 2592, 2592, 2592, 2651, 2824, 2592,
  /* 2039 */ 2592, 2592, 2130, 2952, 2592, 2592, 2592, 2592, 2964, 2592, 2592, 2716, 2748, 2592, 2969, 2592, 2592, 2716,
  /* 2057 */ 2918, 2368, 2970, 2592, 2592, 2592, 2403, 2407, 2592, 2592, 2787, 2211, 2404, 2409, 2592, 2592, 2802, 2837,
  /* 2075 */ 2987, 2592, 2592, 2592, 2809, 2427, 2592, 2793, 2592, 2592, 2809, 2447, 1073741824, 0x80000000, 539754496,
  /* 2090 */ 542375936, 402653184, 554434560, 571736064, 545521856, 268451840, 335544320, 268693630, 512, 2048, 256,
  /* 2101 */ 1024, 0, 1024, 0, 1073741824, 0x80000000, 0, 0, 0, 8388608, 0, 0, 1073741824, 1073741824, 0, 0x80000000,
  /* 2117 */ 537133056, 4194304, 1048576, 268435456, -1073741824, 0, 0, 0, 1048576, 0, 0, 0, 1572864, 0, 0, 0, 4194304,
  /* 2134 */ 0, 134217728, 16777216, 0, 0, 32, 64, 98304, 0, 33554432, 8388608, 192, 67108864, 67108864, 67108864,
  /* 2149 */ 67108864, 16, 32, 4, 0, 8192, 196608, 196608, 229376, 80, 4096, 524288, 8388608, 0, 0, 32, 128, 256, 24576,
  /* 2168 */ 24600, 24576, 24576, 2, 24576, 24576, 24576, 24584, 24592, 24576, 24578, 24576, 24578, 24576, 24576, 16,
  /* 2184 */ 512, 2048, 2048, 256, 4096, 32768, 1048576, 4194304, 67108864, 134217728, 268435456, 262144, 134217728, 0,
  /* 2198 */ 128, 128, 64, 16384, 16384, 16384, 67108864, 32, 32, 4, 4, 4096, 262144, 134217728, 0, 0, 0, 2, 0, 8192,
  /* 2218 */ 131072, 131072, 4096, 4096, 4096, 4096, 24576, 24576, 24576, 8, 8, 24576, 24576, 16384, 16384, 16384,
  /* 2234 */ 24576, 24584, 24576, 24576, 24576, 16384, 24576, 536870912, 262144, 0, 0, 32, 2048, 8192, 4, 4096, 4096,
  /* 2251 */ 4096, 786432, 8388608, 16777216, 0, 128, 16384, 16384, 16384, 32768, 65536, 2097152, 32, 32, 32, 32, 4, 4,
  /* 2269 */ 4, 4, 4, 4096, 67108864, 67108864, 67108864, 24576, 24576, 24576, 24576, 0, 16384, 16384, 16384, 16384,
  /* 2285 */ 67108864, 67108864, 8, 67108864, 24576, 8, 8, 8, 24576, 24576, 24576, 24578, 24576, 24576, 24576, 2, 2, 2,
  /* 2303 */ 16384, 67108864, 67108864, 67108864, 32, 67108864, 8, 8, 24576, 2048, 0x80000000, 536870912, 262144,
  /* 2316 */ 262144, 262144, 67108864, 8, 24576, 16384, 32768, 1048576, 4194304, 25165824, 67108864, 24576, 32770, 2, 4,
  /* 2331 */ 112, 512, 98304, 524288, 50, 402653186, 1049090, 1049091, 10, 66, 100925514, 10, 66, 12582914, 0, 0,
  /* 2347 */ -1678194207, -1678194207, -1041543218, 0, 32768, 0, 0, 32, 65536, 268435456, 1, 1, 513, 1048577, 0,
  /* 2362 */ 12582912, 0, 0, 0, 4, 1792, 0, 0, 0, 7, 29360128, 0, 0, 0, 8, 0, 0, 0, 12, 1, 1, 0, 0, -604102721,
  /* 2386 */ -604102721, 4194304, 8388608, 0, 0, 0, 31, 925600, 997981306, 997981306, 997981306, 0, 0, 2048, 8388608, 0,
  /* 2402 */ 0, 1, 2, 4, 32, 64, 512, 8192, 0, 0, 0, 245760, 997720064, 0, 0, 0, 32, 0, 0, 0, 3, 12, 16, 32, 8, 112,
  /* 2428 */ 3072, 12288, 16384, 32768, 65536, 131072, 7864320, 16777216, 973078528, 0, 0, 65536, 131072, 3670016,
  /* 2442 */ 4194304, 16777216, 33554432, 2, 8, 48, 2048, 8192, 16384, 32768, 65536, 131072, 524288, 131072, 524288,
  /* 2457 */ 3145728, 4194304, 16777216, 33554432, 65536, 131072, 2097152, 4194304, 16777216, 33554432, 134217728,
  /* 2468 */ 268435456, 536870912, 0, 0, 0, 1024, 0, 8, 48, 2048, 8192, 65536, 33554432, 268435456, 536870912, 65536,
  /* 2484 */ 268435456, 536870912, 0, 0, 32768, 0, 0, 126, 623104, 65011712, 0, 32, 65536, 536870912, 0, 0, 65536,
  /* 2501 */ 524288, 0, 32, 65536, 0, 0, 0, 2048, 0, 0, 0, 15482, 245760, -604102721, 0, 0, 0, 18913, 33062912, 925600,
  /* 2521 */ -605028352, 0, 0, 0, 65536, 31, 8096, 131072, 786432, 3145728, 3145728, 12582912, 50331648, 134217728,
  /* 2535 */ 268435456, 160, 256, 512, 7168, 131072, 786432, 131072, 786432, 1048576, 2097152, 12582912, 16777216,
  /* 2548 */ 268435456, 1073741824, 0x80000000, 12582912, 16777216, 33554432, 268435456, 1073741824, 0x80000000, 3, 12,
  /* 2559 */ 16, 160, 256, 7168, 786432, 1048576, 12582912, 16777216, 268435456, 1073741824, 0, 8, 16, 32, 128, 256,
  /* 2575 */ 512, 7168, 786432, 1048576, 2097152, 0, 1, 2, 8, 16, 7168, 786432, 1048576, 8388608, 16777216, 16777216,
  /* 2591 */ 1073741824, 0, 0, 0, 0, 1, 0, 0, 8, 32, 128, 256, 7168, 8, 32, 0, 3072, 0, 8, 32, 3072, 4096, 524288, 8,
  /* 2615 */ 32, 0, 0, 3072, 4096, 0, 2048, 524288, 8388608, 8, 2048, 0, 0, 1, 12, 256, 4096, 32768, 262144, 1048576,
  /* 2635 */ 4194304, 67108864, 0, 2048, 0, 2048, 2048, 1073741824, -58805985, -58805985, -58805985, 0, 0, 262144, 0, 0,
  /* 2651 */ 32, 4194304, 16777216, 134217728, 4382, 172032, -58982400, 0, 0, 2, 28, 256, 4096, 8192, 8192, 32768,
  /* 2667 */ 131072, 262144, 524288, 1, 2, 12, 256, 4096, 0, 0, 4194304, 67108864, 134217728, 805306368, 1073741824, 0,
  /* 2683 */ 0, 1, 2, 12, 16, 256, 4096, 1048576, 67108864, 134217728, 268435456, 0, 512, 1048576, 4194304, 201326592,
  /* 2699 */ 1879048192, 0, 0, 12, 256, 4096, 134217728, 268435456, 536870912, 12, 256, 268435456, 536870912, 0, 12,
  /* 2714 */ 256, 0, 0, 1, 32, 64, 512, 0, 0, 205236961, 205236961, 0, 0, 0, 1, 96, 640, 1, 10976, 229376, 204996608, 0,
  /* 2736 */ 640, 2048, 8192, 229376, 1572864, 1572864, 2097152, 201326592, 0, 0, 0, 64, 512, 2048, 229376, 1572864,
  /* 2752 */ 201326592, 1572864, 201326592, 0, 0, 1, 4382, 0, 1, 32, 2048, 65536, 131072, 1572864, 201326592, 131072,
  /* 2768 */ 1572864, 134217728, 0, 0, 524288, 524288, 0, 0, 0, -68582786, -68582786, -68582786, 0, 0, 2097152, 524288,
  /* 2784 */ 0, 524288, 0, 0, 65536, 131072, 1572864, 0, 0, 2, 4, 0, 0, 65011712, -134217728, 0, 0, 0, 0, 2, 4, 120,
  /* 2806 */ 512, -268435456, 0, 0, 0, 2, 8, 48, 64, 2048, 8192, 98304, 524288, 2097152, 4194304, 25165824, 33554432,
  /* 2823 */ 134217728, 268435456, 0x80000000, 0, 0, 25165824, 33554432, 134217728, 1879048192, 0x80000000, 0, 0, 4,
  /* 2836 */ 112, 512, 622592, 65011712, 134217728, -268435456, 16777216, 33554432, 134217728, 1610612736, 0, 0, 0, 64,
  /* 2850 */ 98304, 524288, 4194304, 16777216, 33554432, 0, 98304, 524288, 16777216, 33554432, 0, 65536, 524288,
  /* 2863 */ 33554432, 536870912, 1073741824, 0, 65536, 524288, 536870912, 1073741824, 0, 0, 65536, 524288, 536870912,
  /* 2876 */ 0, 524288, 0, 524288, 524288, 1048576, 2086666240, 0x80000000, 0, -1678194207, 0, 0, 0, 8, 32, 2048,
  /* 2892 */ 524288, 8388608, 0, 0, 33062912, 436207616, 0x80000000, 0, 0, 32, 64, 2432, 16384, 32768, 32768, 524288,
  /* 2908 */ 3145728, 4194304, 25165824, 25165824, 167772160, 268435456, 0x80000000, 0, 32, 64, 384, 2048, 16384, 32768,
  /* 2922 */ 1048576, 2097152, 4194304, 25165824, 32, 64, 128, 256, 2048, 16384, 2048, 16384, 1048576, 4194304,
  /* 2936 */ 16777216, 33554432, 134217728, 536870912, 1073741824, 0, 0, 2048, 16384, 4194304, 16777216, 33554432,
  /* 2948 */ 134217728, 805306368, 0, 0, 16777216, 134217728, 268435456, 0x80000000, 0, 622592, 622592, 622592, 8807,
  /* 2961 */ 8807, 434791, 0, 0, 16777216, 0, 0, 0, 7, 608, 8192, 0, 0, 0, 3, 4, 96, 512, 32, 64, 8192, 0, 0, 16777216,
  /* 2985 */ 134217728, 0, 0, 2, 4, 8192, 16384, 65536, 2097152, 33554432, 268435456
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

                                                            // line 543 "JSONiqTokenizer.ebnf"
                                                            });
                                                            // line 4205 "JSONiqTokenizer.js"
// End
