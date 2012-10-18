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

var SyntaxHighlighter = exports.SyntaxHighlighter = function(source, tree)
{
   var keywords = ['after', 'ancestor', 'ancestor-or-self', 'and', 'as', 'ascending', 'attribute', 'before', 'case', 'cast', 'castable', 'child', 'collation', 'comment', 'copy', 'count', 'declare', 'default', 'delete', 'descendant', 'descendant-or-self', 'descending', 'div', 'document', 'document-node', 'element', 'else', 'empty', 'empty-sequence', 'end', 'eq', 'every', 'except', 'first', 'following', 'following-sibling', 'for', 'function', 'ge', 'group', 'gt', 'idiv', 'if', 'then', 'import', 'insert', 'instance', 'intersect', 'into', 'is', 'item', 'last', 'le', 'let', 'lt', 'mod', 'modify', 'module', 'namespace', 'namespace-node', 'ne', 'node', 'only', 'or', 'order', 'ordered', 'parent', 'preceding', 'preceding-sibling', 'processing-instruction', 'rename', 'replace', 'return', 'satisfies', 'schema-attribute', 'schema-element', 'self', 'some', 'stable', 'start', 'switch', 'text', 'to', 'treat', 'try', 'typeswitch', 'union', 'unordered', 'validate', 'where', 'with', 'xquery', 'contains', 'paragraphs', 'sentences', 'times', 'words', 'by', 'collection', 'allowing', 'at', 'base-uri', 'boundary-space', 'break', 'catch', 'construction', 'context', 'continue', 'copy-namespaces', 'decimal-format', 'encoding', 'exit', 'external', 'ft-option', 'in', 'index', 'integrity', 'lax', 'nodes', 'option', 'ordering', 'revalidation', 'schema', 'score', 'sliding', 'strict', 'tumbling', 'type', 'updating', 'value', 'variable', 'version', 'while', 'constraint', 'loop', 'returning', 'append', 'array', 'json-item', 'object', 'structured-item', 'when', 'next', 'previous'];
   var states  = ["cdata", "comment", "tag"];
   var info = { lines: [ [] ], states: [] };
   var inName = false;

   this.getTokens = function() {
     this.visit(tree);
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

   this.getNodeValue = function(node)
   {
     return source.substring(node.begin, node.end);
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
   
   this.FunctionName = function(node)
   {
     for(var i in node.children) {
       var child = node.children[i];
       if(child.name === "EQName" || child.name === "TOKEN") {
         var value = child.children[0].value;
         this.addTokens(value, "support.function");
       } else {
         this.visit(child);
       }
     }
     return true;
   };

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

   this.NCName = function(node)
   {
     inName = true;
     for(var i in node.children)
     {
       var child = node.children[i];
       this.visit(child);
     }
     inName = false;
     return true;
   };

   this.EQName = function(node)
   {
     inName = true;
     for(var i in node.children)
     {
       var child = node.children[i];
       this.visit(child);
     }
     inName = false;
     return true;
   };

   this.TOKEN = function(node)
   {
     value = node.children[0].value;
     if(keywords.indexOf(value) > -1 && !inName) {
       this.addTokens(value, "keyword");
       return true;
     } else {
       return false;
     }
   };

   this.EverythingElse = function(node)
   {
     if(typeof node["pos"] === "object")
     {
       var value = node.value;
       var openingIdx = value.indexOf("(:");
       while(openingIdx > -1) {
         var text = value.substring(0, openingIdx);
         this.addTokens(text, "text");
         var closingIdx = value.substring(openingIdx).indexOf(":)") + 3;
         var comment = value.substring(openingIdx, closingIdx);
         this.addTokens(comment, "comment");
         value = value.substring(closingIdx);
         openingIdx = value.indexOf("(:");
       }
       this.addTokens(value, "text");
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
       for(var i = 0; i < node.children.length; i++)
       {
         var child = node.children[i];
         if(child.name === "TOKEN" && child.children[0].value === "$") {
           i++;
           var next = node.children[i];
           var value = source.substring(child.children[0].pos.begin, next.end);
           this.addTokens(value, "variable");
         } else {
           this.visit(child);
         }
       }
     } 
   };
};

});
