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

var CommentParser  = require("../CommentParser").CommentParser;
var CommentHandler = require("../CommentHandler").CommentHandler; 
 
var SyntaxHighlighter = exports.SyntaxHighlighter = function(tree)
{
   var keywords = ['after', 'ancestor', 'ancestor-or-self', 'and', 'as', 'ascending', 'attribute', 'before', 'case', 'cast', 'castable', 'child', 'collation', 'comment', 'copy', 'count', 'declare', 'default', 'delete', 'descendant', 'descendant-or-self', 'descending', 'div', 'document', 'document-node', 'element', 'else', 'empty', 'empty-sequence', 'end', 'eq', 'every', 'except', 'first', 'following', 'following-sibling', 'for', 'function', 'ge', 'group', 'gt', 'idiv', 'if', 'then', 'import', 'insert', 'instance', 'intersect', 'into', 'is', 'item', 'last', 'le', 'let', 'lt', 'mod', 'modify', 'module', 'namespace', 'namespace-node', 'ne', 'node', 'only', 'or', 'order', 'ordered', 'parent', 'preceding', 'preceding-sibling', 'processing-instruction', 'rename', 'replace', 'return', 'satisfies', 'schema-attribute', 'schema-element', 'self', 'some', 'stable', 'start', 'switch', 'text', 'to', 'treat', 'try', 'typeswitch', 'union', 'unordered', 'validate', 'where', 'with', 'xquery', 'contains', 'paragraphs', 'sentences', 'times', 'words', 'by', 'collection', 'allowing', 'at', 'base-uri', 'boundary-space', 'break', 'catch', 'construction', 'context', 'continue', 'copy-namespaces', 'decimal-format', 'encoding', 'exit', 'external', 'ft-option', 'in', 'index', 'integrity', 'lax', 'nodes', 'option', 'ordering', 'revalidation', 'schema', 'score', 'sliding', 'strict', 'tumbling', 'type', 'updating', 'value', 'variable', 'version', 'while', 'constraint', 'loop', 'returning', 'append', 'array', 'json-item', 'object', 'structured-item', 'when', 'next', 'previous', 'window'];

   var docTags = "([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[a-zA-Z]{2,6})|(@[\\w\\d_]+)|(TODO)";
   
   var states  = ["cdata", "comment", "tag", "comment.doc"];
   var info = { lines: [ [] ], states: [] };

   this.getTokens = function(recover) {
     this.visit(tree);
     if(recover === true) {
       var computed = "";
       for(var i in info.lines) {
         for(var j in info.lines[i]) {
           var token = info.lines[i][j];
           computed += token.value;
         }
         if(i < info.lines.length - 1)
           computed += "\n";
       }
       this.addTokens(source.substring(computed.length), "text");
     }
     return info;
   };
 
   this.addTokens = function(value, type)
   {
     var tokens = value.split("\n");
     var lastState = "start";
     for(var i in tokens)
     {
       if(i > 0) {
         info.lines.push([]);
         info.states.push(lastState);
       }
       var value = tokens[i];
       var linesLength = info.lines.length - 1;
       var linesIdx = info.lines[linesLength];
       linesIdx.push({ value: value, type: type });
       lastState = states.indexOf(type) != -1 ? type : "start"; 
     }
   };

   this.getNodeValue = function(node) {
     var value = "";
     if(node.value === undefined) {
       for(var i in node.children)
       {
         var child = node.children[i];
         value += this.getNodeValue(child);
       }
     } else {
       value += node.value;
     }
     return value;
   };
 
   
   this.DirPIConstructor = function(node)
   {
     var value = this.getNodeValue(node);
     this.addTokens(value, "xml_pe");
     return true;
   };

   this.DirElemConstructor = function(node)
   {
     for(var i in node.children)
     {
       var child = node.children[i];
       if(child.name === "TOKEN" || child.name === "QName") {
         var value = this.getNodeValue(child);
         this.addTokens(value, "meta.tag");
       } else {
         this.visit(child);
       }
     }
     return true; 
   };
   
   this.DirAttributeList = function(node)
   {
     for(var i in node.children)
     {
       var child = node.children[i];
       if(child.name === "QName") {
         var value = this.getNodeValue(child);
         this.addTokens(value, "meta.tag");
       } else {
         this.visit(child);
       }
     }
     return true; 
   };

   this.DirAttributeValue =  function(node)
   {
     for(var i in node.children)
     {
       var child = node.children[i];
       if(child.name === "TOKEN") {
         var value = this.getNodeValue(child);
         this.addTokens(value, "string");
       } else {
         this.visit(child);
       }
     }
     return true; 
   };

   this.QuotAttrContentChar = function(node)
   {
     var value = this.getNodeValue(node);
     this.addTokens(value, "string");
     return true;
   };

   //this.EQName = function(node)
   //{
   //  var value = source.substring(node.begin, node.end);
   //  this.addTokens(value, "support.function");
   //  return true;
   //};
   
   //this.FunctionName = function(node)
   //{
   //  for(var i in node.children) {
   //    var child = node.children[i];
   //    if(child.children[0] && (child.name === "EQName" || child.name === "TOKEN")) {
   //      var value = this.getNodeValue(child.children[0]);
   //      this.addTokens(value, "support.function");
   //    } else {
   //      this.visit(child);
   //    }
   //  }
   //  return true;
   //};

   this.StringConcatExpr = function(node)
   {
     for(var i in node.children) {
       var child = node.children[i];
       if(child.name === "TOKEN") {
         var value = this.getNodeValue(child);
         this.addTokens(value, "keyword.operator");
       } else {
         this.visit(child);
       }
     }
     return true;
   };

   this.AdditiveExpr = function(node)
   {
     for(var i in node.children) {
       var child = node.children[i];
       if(child.name === "TOKEN") {
         var value = this.getNodeValue(child);
         this.addTokens(value, "keyword.operator");
       } else {
         this.visit(child);
       }
     }
     return true;
   };

   this.MultiplicativeExpr = function(node)
   {
     for(var i in node.children) {
       var child = node.children[i];
       if(child.name === "TOKEN") {
         var value = this.getNodeValue(child);
         this.addTokens(value, "keyword.operator");
       } else {
         this.visit(child);
       }
     }
     return true;
   };

   this.UnaryExpr = function(node)
   {
     for(var i in node.children) {
       var child = node.children[i];
       if(child.name === "TOKEN") {
         var value = this.getNodeValue(child);
         this.addTokens(value, "keyword.operator");
       } else {
         this.visit(child);
       }
     }
     return true;
   };
   
   this.GeneralComp = function(node)
   {
     for(var i in node.children) {
       var child = node.children[i];
       if(child.name === "TOKEN") {
         var value = this.getNodeValue(child);
         this.addTokens(value, "keyword.operator");
       } else {
         this.visit(child);
       }
     }
     return true;
   };

   this.NumericLiteral = function(node)
   {
     for(var i in node.children) {
       var child = node.children[i];
       if(child.name != "TEXT") {
         var value = this.getNodeValue(child);
         this.addTokens(value, "constant");
       } else {
         this.visit(child);
       }
     }return true;
   }
 
   this.DirCommentConstructor = function(node)
   {
     for(var i in node.children) {
       var child = node.children[i];
       if(child.name != "TEXT") {
         var value = this.getNodeValue(child);
         this.addTokens(value, "comment");
       } else {
         this.visit(child);
       }
     }return true;
   }
   
   this.CDataSection = function(node)
   {
     var value = this.getNodeValue(node);
     this.addTokens(value, "support.type");
     return true;
   };

   this.Comment = function(node)
   {
     return true;
   };

   this.URILiteral = function(node)
   {
     var value = this.getNodeValue(node);
     this.addTokens(value, "string");
     return true;
   };

   this.StringLiteral = function(node)
   {
     var value = this.getNodeValue(node);
     this.addTokens(value, "string");
     return true;
   };

//   this.NCName = function(node)
//   {
//     inName = true;
//     for(var i in node.children)
//     {
//       var child = node.children[i];
//       this.visit(child);
//     }
//     inName = false;
//     return true;
//   };
   this.NCName = function(node) {
     var value = this.getNodeValue(node);
     this.addTokens(value, "support.function");
     return true;
   };

   this.EQName = function(node)
   {
     var value = this.getNodeValue(node);
     this.addTokens(value, "support.function");
     //inName = true;
     //for(var i in node.children)
     //{
     //  var child = node.children[i];
     //  this.visit(child);
     //}
     //inName = false;
     
     return true;
   };

   this.TOKEN = function(node)
   {
     var value = this.getNodeValue(node);
     if(keywords.indexOf(value) > -1 ) {//&& !inName) {
       this.addTokens(value, "keyword");
     } else if(value === "$") {
       
     } else {
       this.addTokens(value, "text");
     }
     return true;
   };
  
   this.WS = function(node) {
     var value = node.value;
     var h = new CommentHandler(value);
     var parser = new CommentParser(value, h);
     parser.parse_Comments();
     var ast = h.getParseTree();
     var children = ast.children;
     for(var i in children)
     {
       var child = children[i];
       if(child.name === "Comment" && child.children[1] && child.children[1].value.substring(0, 1) === "~")
       {
         var remains = this.getNodeValue(child);
         while(remains.length > 0) {
           var match = remains.match(docTags);
           if(match !== null) {
             var str = match[0];
             var index = match.index;
             if(index > 0) {
               this.addTokens(remains.substring(0, index), "comment.doc");
               remains = remains.substring(index);
             }
             this.addTokens(remains.substring(0, str.length), "comment.doc.tag");
             remains = remains.substring(str.length);
           } else {
             this.addTokens(remains, "comment.doc");
             break;
           }
         }
       }
       else if(child.name === "Comment")
       {
         this.addTokens(this.getNodeValue(child), "comment");
       } else if(child.name === "S") {
         this.addTokens(child.value, "text");
       }
     }
     return true;
   };
   
   this.EverythingElse = function(node)
   {
     if(node.children.length === 0) {
       var value = this.getNodeValue(node);
       this.addTokens(value, "text");
       return true;
     }
     return false;
   };

   this.visit = function(node){
     var name = node.name;
     var skip = false;
     
     if(typeof this[name] === "function")
       skip = this[name](node) === true ? true : false ;
     else
       skip = this.EverythingElse(node) === true ? true : false;
     
     if(!skip && typeof node.children === "object")
     {
       var isVarEQName = false;
       for(var i = 0; i < node.children.length; i++)
       {
         var child = node.children[i];
         var value = this.getNodeValue(child);
         if(child.name === "TOKEN" && value === "$")
         {
           isVarEQName = true;
         } else if(isVarEQName) {
           this.addTokens("$" + value, "variable"); 
           isVarEQName = false;
         } else {
           this.visit(child);
         }
       }
     } 
   };
};

});
