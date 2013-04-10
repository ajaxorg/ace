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
  
  var JSONiqTokenizer = require("./JSONiqTokenizer").JSONiqTokenizer;
  
  var TokenHandler = function(code) {
      
    var input = code;
    
    this.tokens = [];
 
    this.reset = function(code) {
      input = input;
      this.tokens = [];
    };
    
    this.startNonterminal = function(name, begin) {};

    this.endNonterminal = function(name, end) {};

    this.terminal = function(name, begin, end) {
      this.tokens.push({
        name: name,
        value: input.substring(begin, end)
      });
    };

    this.whitespace = function(begin, end) {
      this.tokens.push({
        name: "WS",
        value: input.substring(begin, end)
      });
    };
  };
    var keys = "NaN|after|allowing|ancestor|ancestor-or-self|and|append|array|as|ascending|at|attribute|base-uri|before|boundary-space|break|by|case|cast|castable|catch|child|collation|comment|constraint|construction|contains|context|continue|copy|copy-namespaces|count|decimal-format|decimal-separator|declare|default|delete|descendant|descendant-or-self|descending|digit|div|document|document-node|element|else|empty|empty-sequence|encoding|end|eq|every|except|exit|external|false|first|following|following-sibling|for|from|ft-option|function|ge|greatest|group|grouping-separator|gt|idiv|if|import|in|index|infinity|insert|instance|integrity|intersect|into|is|item|json|json-item|jsoniq|last|lax|le|least|let|loop|lt|minus-sign|mod|modify|module|namespace|namespace-node|ne|next|node|nodes|not|null|object|of|only|option|or|order|ordered|ordering|paragraphs|parent|pattern-separator|per-mille|percent|preceding|preceding-sibling|previous|processing-instruction|rename|replace|return|returning|revalidation|satisfies|schema|schema-attribute|schema-element|score|select|self|sentences|sliding|some|stable|start|strict|switch|text|then|times|to|treat|true|try|tumbling|type|typeswitch|union|unordered|updating|validate|value|variable|version|when|where|while|window|with|words|xquery|zero-digit".split("|");
    var keywords = keys.map(
      function(val) { return { name: "'" + val + "'", token: "keyword" }; }
    );
    
    var ncnames = keys.map(
      function(val) { return { name: "'" + val + "'", token: "text", next: function(stack){ stack.pop(); } }; }
    );

    var cdata = "constant.language";
    var number = "constant";
    var xmlcomment = "comment";
    var pi = "xml-pe";
    var pragma = "constant.buildin";
    
    var Rules = {
      start: [
        { name: "'(#'", token: pragma, next: function(stack){ stack.push("Pragma"); } },
        { name: "'(:'", token: "comment", next: function(stack){ stack.push("Comment"); } },
        { name: "'(:~'", token: "comment.doc", next: function(stack){ stack.push("CommentDoc"); } },
        { name: "'<!--'", token: xmlcomment, next: function(stack){ stack.push("XMLComment"); } },
        { name: "'<?'", token: pi, next: function(stack) { stack.push("PI"); } },
        { name: "''''", token: "string", next: function(stack){ stack.push("AposString"); } },
        { name: "'\"'", token: "string", next: function(stack){ stack.push("QuotString"); } },
        { name: "Annotation", token: "support.function" },
        { name: "ModuleDecl", token: "keyword", next: function(stack){ stack.push("Prefix"); } },
        { name: "OptionDecl", token: "keyword", next: function(stack){ stack.push("_EQName"); } },
        { name: "AttrTest", token: "support.type" },
        { name: "Variable",  token: "variable" },
        { name: "'<![CDATA['", token: cdata, next: function(stack){ stack.push("CData"); } },
        { name: "IntegerLiteral", token: number },
        { name: "DecimalLiteral", token: number },
        { name: "DoubleLiteral", token: number },
        { name: "Operator", token: "keyword.operator" },
        { name: "EQName", token: function(val) { return keys.indexOf(val) !== -1 ? "keyword" : "support.function"; } },
        { name: "'('", token:"lparen" },
        { name: "')'", token:"rparen" },
        { name: "Tag", token: "meta.tag", next: function(stack){ stack.push("StartTag"); } },
        { name: "'}'", token: "text", next: function(stack){ if(stack.length > 1) stack.pop();  } },
        { name: "'{'", token: "text", next: function(stack){ stack.push("start"); } } //, next: function(stack){ if(stack.length > 1) { stack.pop(); } } }
      ].concat(keywords),
      _EQName: [
        { name: "EQName", token: "text", next: function(stack) { stack.pop(); } }
      ].concat(ncnames),
      Prefix: [
        { name: "NCName", token: "text", next: function(stack) { stack.pop(); } }
      ].concat(ncnames),
      StartTag: [
        { name: "'>'", token: "meta.tag", next: function(stack){ stack.push("TagContent"); } },
        { name: "QName", token: "entity.other.attribute-name" },
        { name: "'='", token: "text" },
        { name: "''''", token: "string", next: function(stack){ stack.push("AposAttr"); } },
        { name: "'\"'", token: "string", next: function(stack){ stack.push("QuotAttr"); } },
        { name: "'/>'", token: "meta.tag.r", next: function(stack){ stack.pop(); } }
      ],
      TagContent: [
        { name: "ElementContentChar", token: "text" },
        { name: "'<![CDATA['", token: cdata, next: function(stack){ stack.push("CData"); } },
        { name: "'<!--'", token: xmlcomment, next: function(stack){ stack.push("XMLComment"); } },
        { name: "Tag", token: "meta.tag", next: function(stack){ stack.push("StartTag"); } },
        { name: "PredefinedEntityRef", token: "constant.language.escape" },
        { name: "CharRef", token: "constant.language.escape" },
        { name: "'{{'", token: "text" },
        { name: "'}}'", token: "text" },
        { name: "'{'", token: "text", next: function(stack){ stack.push("start"); } },
        { name: "EndTag", token: "meta.tag", next: function(stack){ stack.pop(); stack.pop(); } }
      ],
      AposAttr: [
        { name: "''''", token: "string", next: function(stack){ stack.pop(); } },
        { name: "EscapeApos", token: "constant.language.escape" },
        { name: "AposAttrContentChar", token: "string" },
        { name: "PredefinedEntityRef", token: "constant.language.escape" },
        { name: "CharRef", token: "constant.language.escape" },
        { name: "'{{'", token: "string" },
        { name: "'}}'", token: "string" },
        { name: "'{'", token: "text", next: function(stack){ stack.push("start"); } }
      ],
      QuotAttr: [
        { name: "'\"'", token: "string", next: function(stack){ stack.pop(); } },
        { name: "EscapeQuot", token: "constant.language.escape" },
        { name: "QuotAttrContentChar", token: "string" },
        { name: "PredefinedEntityRef", token: "constant.language.escape" },
        { name: "CharRef", token: "constant.language.escape" },
        { name: "'{{'", token: "string" },
        { name: "'}}'", token: "string" },
        { name: "'{'", token: "text", next: function(stack){ stack.push("start"); } }
      ],
      Pragma: [
        { name: "PragmaContents", token: pragma },
        { name: "'#'", token: pragma },
        { name: "'#)'", token: pragma, next: function(stack){ stack.pop(); } }
      ],
      Comment: [
        { name: "CommentContents", token: "comment" },
        { name: "'(:'", token: "comment", next: function(stack){ stack.push("Comment"); } },
        { name: "':)'", token: "comment", next: function(stack){ stack.pop(); } }
      ],
      CommentDoc: [
        { name: "DocCommentContents", token: "comment.doc" },
        { name: "DocTag", token: "comment.doc.tag" },
        { name: "'(:'", token: "comment.doc", next: function(stack){ stack.push("CommentDoc"); } },
        { name: "':)'", token: "comment.doc", next: function(stack){ stack.pop(); } }
      ],
      XMLComment: [
        { name: "DirCommentContents", token: xmlcomment },
        { name: "'-->'", token: xmlcomment, next: function(stack){ stack.pop(); } }
      ],
      CData: [
        { name: "CDataSectionContents", token: cdata },
        { name: "']]>'", token: cdata, next: function(stack){ stack.pop(); } }
      ],
      PI: [
        { name: "DirPIContents", token: pi },
        { name: "'?'", token: pi },
        { name: "'?>'", token: pi, next: function(stack){ stack.pop(); } }
      ],
      AposString: [
        { name: "''''", token: "string", next: function(stack){ stack.pop(); } },
        { name: "PredefinedEntityRef", token: "constant.language.escape" },
        { name: "CharRef", token: "constant.language.escape" },
        { name: "EscapeApos", token: "constant.language.escape" },
        { name: "AposChar", token: "string" }
      ],
      QuotString: [
        { name: "'\"'", token: "string", next: function(stack){ stack.pop(); } },
        { name: "PredefinedEntityRef", token: "constant.language.escape" },
        { name: "CharRef", token: "constant.language.escape" },
        { name: "EscapeQuot", token: "constant.language.escape" },
        { name: "QuotChar", token: "string" }
      ]
    };
    
exports.JSONiqLexer = function() {
  
  this.tokens = [];
  
  this.getLineTokens = function(line, state, row) {
    state = (state === "start" || !state) ? '["start"]' : state;
    var stack = JSON.parse(state);
    var h = new TokenHandler(line);
    var tokenizer = new JSONiqTokenizer(line, h);
    var tokens = [];
    
    while(true) {
      var currentState = stack[stack.length - 1];
      try {
        
        h.tokens = [];
        tokenizer["parse_" + currentState]();
        var info = null;
        
        if(h.tokens.length > 1 && h.tokens[0].name === "WS") {
          tokens.push({
            type: "text",
            value: h.tokens[0].value
          });
          h.tokens.splice(0, 1);
        }
        
        var token = h.tokens[0];
        var rules  = Rules[currentState];
        for(var k = 0; k < rules.length; k++) {
          var rule = Rules[currentState][k];
          if((typeof(rule.name) === "function" && rule.name(token)) || rule.name === token.name) {
            info = rule;
            break;
          }
        }
        
        if(token.name === "EOF") { break; }
        if(token.value === "") { throw "Encountered empty string lexical rule."; }
        
        tokens.push({
          type: info === null ? "text" : (typeof(info.token) === "function" ? info.token(token.value) : info.token),
          value: token.value
        });
        
        if(info && info.next) {
          info.next(stack);    
        }
      
      } catch(e) {
        if(e instanceof tokenizer.ParseException) {
          var index = 0;
          for(var i=0; i < tokens.length; i++) {
            index += tokens[i].value.length;
          }
          tokens.push({ type: "text", value: line.substring(index) });
          return {
            tokens: tokens,
            state: JSON.stringify(["start"])
          };
        } else {
          throw e;
        }  
      }
    }
   
    
    if(this.tokens[row] !== undefined) {
      var cachedLine = this.lines[row];
      var begin = sharedStart([line, cachedLine]);
      var diff = cachedLine.length - line.length;
      var idx = 0;
      var col = 0;
      for(var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        for(var j = 0; j < this.tokens[row].length; j++) {
          var semanticToken = this.tokens[row][j];
          if(
             ((col + token.value.length) <= begin.length && semanticToken.sc === col && semanticToken.ec === (col + token.value.length)) ||
             (semanticToken.sc === (col + diff) && semanticToken.ec === (col + token.value.length + diff))
            ) {
            idx = i;
            tokens[i].type = semanticToken.type;
          }
        }
        col += token.value.length;
      }
    }

    return {
      tokens: tokens,
      state: JSON.stringify(stack)
    };
  };
  
  function sharedStart(A) {
    var tem1, tem2, s, A = A.slice(0).sort();
    tem1 = A[0];
    s = tem1.length;
    tem2 = A.pop();
    while(s && tem2.indexOf(tem1) == -1) {
        tem1 = tem1.substring(0, --s);
    }
    return tem1;
  }
};
});
