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
  var Utils = exports.Utils = {
    convertPosition: function(code, begin, end)
    {
      var before = code.substring(0, begin);
      var after  = code.substring(0, end);
      var startline = before.split("\n").length;
      var startcolumn = begin - before.lastIndexOf("\n");
      var endline = after.split("\n").length;
      var endcolumn = end - after.lastIndexOf("\n");
      return {sl: startline - 1, sc: startcolumn - 1, el: endline - 1, ec: endcolumn - 1};
    },

    findNode: function(ast, pos) {
      var p = ast.pos;
      if(Utils.inRange(p, pos) === true) {
        for(var i in ast.children) {
          var child = ast.children[i];
          var n = Utils.findNode(child, pos);
          if(n !== null)
            return n;
        }
        return ast;
      } else {
        return null;
      }
    },
    
    inRange: function(p, pos, exclusive) {
        if(p && p.sl <= pos.line && pos.line <= p.el) {
            if(p.sl < pos.line && pos.line < p.el)
                return true;
            else if(p.sl == pos.line && pos.line < p.el)
                return p.sc <= pos.col;
            else if(p.sl == pos.line && p.el === pos.line)
                return p.sc <= pos.col && pos.col <= p.ec + (exclusive ? 1 : 0);
            else if(p.sl < pos.line && p.el === pos.line)
                return pos.col <= p.ec + (exclusive ? 1 : 0);
        }
    },

    removeParentPtr: function(ast)
    {
      if(ast.getParent !== undefined) {
        delete ast.getParent;
      }
      for(var i in ast.children) {
       var child = ast.children[i];
       Utils.removeParentPtr(child);
      }
    }
  };
});
