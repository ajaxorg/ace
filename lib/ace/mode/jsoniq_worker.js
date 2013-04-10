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

var JSONiqWorker = exports.JSONiqWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(200);
};

oop.inherits(JSONiqWorker, Mirror);

(function() {
    
  this.onUpdate = function() {
    this.sender.emit("start");
    var value = this.doc.getValue();    
    var h = new JSONParseTreeHandler(value);
    var parser = new JSONiqParser(value, h);
    var ast = null;
    var markers = [];
    try {
      parser.parse_XQuery();
      this.sender.emit("ok");
      ast = h.getParseTree();
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
    ast = translator.translate();
    //for(var i = 0; i < ast.markers.length; i++) {
    //  var marker = ast.markers[i];
    //  annotations.push({
    //    row: marker.pos.sl,
    //    column: marker.pos.sc,
    //    text: marker.message,
    //    type: marker.type
    //  });
    //}
    this.sender.emit("markers", markers.concat(ast.markers));
 };
    
}).call(JSONiqWorker.prototype);

});
