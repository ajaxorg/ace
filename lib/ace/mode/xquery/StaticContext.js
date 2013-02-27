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
  var StaticContext = exports.StaticContext = function(pos, parent){
    
    this.pos = pos;

    this.parent = parent;
    
    this.children = [];
    
    this.varDecls = {};
    this.varRefs = {};
    
    this.getVarRefs = function(name) {
      if(this.varDecls[name] !== undefined) {
        return this.varRefs[name];
      } else if(this.parent !== undefined) {
        return this.parent.getVarRefs(name); 
      } else {
        return null;
      }
    };

    this.getVarDecl = function(name) {
      if(this.varDecls[name] !== undefined) {
        return this.varDecls[name];
      } else if(this.parent !== undefined) {
        return this.parent.getVarDecl(name); 
      } else {
        return null;
      }
    };

    this.getVarDecls = function(parent) {
      if(this.parent === undefined) {
        return this.varDecls;
      } else {
        var varDecls = this.parent.getVarDecls(true);
        for(var i in this.varDecls) {
          //if(parent === true || FLWORDecls.indexOf(this.varDecls[i].kind) === -1)
            varDecls[i] = this.varDecls[i]; 
        }
        return varDecls;
      }
    };
  };
});
