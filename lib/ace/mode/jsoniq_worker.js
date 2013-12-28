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
var Mirror = require("../worker/mirror").Mirror;
var JSONParseTreeHandler  = require("./xquery/JSONParseTreeHandler").JSONParseTreeHandler;
var JSONiqParser  = require("./xquery/JSONiqParser").JSONiqParser;
var Translator = require("./xquery/Translator").Translator;
var SemanticHighlighter = require("./xquery/visitors/SemanticHighlighter").SemanticHighlighter;
var Utils = require('./xquery/utils').Utils;  
var completeUtil = require("./xquery/complete_util");
var xqCompletion = require('./xquery/completion');
var Modules = require('./xquery/modules').Modules;
var Schemas = require("./xquery/schemas").Schemas;

var JSONiqWorker = exports.JSONiqWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(200);

    this.ast = null;

    var that = this;
    this.sender.on("complete", function(e){
        var pos = { line: e.data.pos.row, col: e.data.pos.column };
        var currentNode = Utils.findNode(that.ast, pos);
        var result = that.complete(that.doc, that.ast, pos, currentNode, function(result){
          var r = []
          result.forEach(function(m){
            r.push({
              name: m.name,
              value: m.name,
              score: m.priority,
              meta: "Zorba"
            });
          });
          that.sender.emit("complete", r);
        });
    });
};

oop.inherits(JSONiqWorker, Mirror);

(function() {
    
  this.onUpdate = function() {
    this.sender.emit("start");
    this.ast = null;
    var value = this.doc.getValue();    
    var h = new JSONParseTreeHandler(value);
    var parser = new JSONiqParser(value, h);
    var markers = [];
    try {
      parser.parse_XQuery();
      this.sender.emit("ok");
      //var highlighter = new SemanticHighlighter(ast, value);
      //var tokens = highlighter.getTokens();
      //this.sender.emit("highlight", { tokens: tokens, lines: highlighter.lines });
    } catch(e) {
      if(e instanceof parser.ParseException) {
          h.closeParseTree();
          var pos = Utils.convertPosition(value, e.getBegin(), e.getEnd());
          var message = parser.getErrorMessage(e);
          if(pos.sc === pos.ec) {
            pos.ec++;
          }
          var error = {
            pos: pos,
            type: "error",
            level: "error",
            rexError: true,
            message: message
          };
          markers.push(error);
      } else {
        throw e;
      }
    }
    var translator = new Translator(h.getParseTree());
    this.ast = translator.translate();
    this.sender.emit("markers", markers.concat(this.ast.markers));
 };
 
 this.complete = function(doc, fullAst, pos, currentNode, callback) {
   
   var builtin = Modules; 
   var schemas = Schemas
   
   var line = doc.getLine(pos.row);
   
   if(currentNode !== undefined && currentNode.name === "URILiteral" && currentNode.getParent && currentNode.getParent.name === "SchemaImport") {
       var p = currentNode.getParent;
       var idx = 0;
       for(var i=0; i < p.children.length; i++) {
         var child = p.children[i];
         if(child.pos.sl === currentNode.pos.sl && child.pos.sc === currentNode.pos.sc &&
            child.pos.el === currentNode.pos.el && child.pos.ec === currentNode.pos.ec) {
           if(idx > 0) {
        console.log("completePath");
             callback(xqCompletion.completePath(line, pos, paths));
           } else {
        console.log("completeSchemaURI");
             callback(xqCompletion.completeSchemaURI(line, pos, schemas));
           }
         } else if(child.name === "URILiteral") {
           idx++;
         }
       }
   } else if (currentNode !== undefined && currentNode.name === "URILiteral" && currentNode.getParent) {
       var p = currentNode.getParent;
       var idx = 0;
       for(var i=0; i < p.children.length; i++) {
         var child = p.children[i];
         if(child.pos.sl === currentNode.pos.sl && child.pos.sc === currentNode.pos.sc &&
            child.pos.el === currentNode.pos.el && child.pos.ec === currentNode.pos.ec) {
           if(idx > 0) {
        console.log("completePath");
             callback(xqCompletion.completePath(line, pos, paths));
           } else {
        console.log("completeURI");
             callback(xqCompletion.completeURI(line, pos, builtin));
           }
         } else if(child.name === "URILiteral") {
           idx++;
         }
       }
   }
   else {
        console.log("completeExpr");
       callback(xqCompletion.completeExpr(line, pos, builtin, fullAst));
   }
   
 };
}).call(JSONiqWorker.prototype);

});
