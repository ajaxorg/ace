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
  var CommentHandler = exports.CommentHandler = function(code) {

    var ast = null;
    var ptr = null;
    var remains = code;
    var cursor = 0;
    var lineCursor = 0;
    var line = 0;
    var col = 0;

    function createNode(name){
      return { name: name, children: [], getParent: null, pos: { sl: 0, sc: 0, el: 0, ec: 0 } };
    }
  
    function pushNode(name, begin){
      var node = createNode(name);
      if(ast === null) {
        ast = node;
        ptr = node;
      } else {
        node.getParent = ptr;
        ptr.children.push(node);
        ptr = ptr.children[ptr.children.length - 1];
      }
    }
    
    function popNode(name, end){
     
      if(ptr.children.length > 0) {
        var s = ptr.children[0];
        var e = ptr.children[ptr.children.length - 1];
        ptr.pos.sl = s.pos.sl;
        ptr.pos.sc = s.pos.sc;
        ptr.pos.el = e.pos.el;
        ptr.pos.ec = e.pos.ec;
      }
      
      if(ptr.getParent !== null) {
        ptr = ptr.getParent;
        for(var i in ptr.children) {
          delete ptr.children[i].getParent;
        }
      } else {
        delete ptr.getParent;
      }
    }
 
    this.peek = function() {
      return ptr;    
    };
    
    this.getParseTree = function() {
      return ast;
    };
 
    this.reset = function(input) {};

    this.startNonterminal = function(name, begin) {
      pushNode(name, begin);
    };

    this.endNonterminal = function(name, end) {
      popNode(name, end);
    };

    this.terminal = function(name, begin, end) {
      name = (name.substring(0, 1) === "'" && name.substring(name.length - 1) === "'") ? "TOKEN" : name;
      pushNode(name, begin); 
      setValue(ptr, begin, end);
      popNode(name, end);
    };

    this.whitespace = function(begin, end) {
      var name = "WS";
      pushNode(name, begin);
      setValue(ptr, begin, end);
      popNode(name, end);
    };

    function setValue(node, begin, end) {
      var e = end - cursor;
      ptr.value = remains.substring(0, e); 
      var sl = line;
      var sc = line === 0 ? lineCursor : lineCursor - 1;
      var el = sl + ptr.value.split("\n").length - 1;
      var lastIdx = ptr.value.lastIndexOf("\n");
      var ec = lastIdx === -1 ? sc + ptr.value.length : ptr.value.substring(lastIdx).length;
      remains = remains.substring(e);
      cursor = end;
      lineCursor = lastIdx === -1 ? lineCursor + (ptr.value.length) : ec; 
      line = el; 
      ptr.pos.sl = sl; 
      ptr.pos.sc = sc; 
      ptr.pos.el = el; 
      ptr.pos.ec = ec; 
    } 
  };
});
