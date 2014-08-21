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
    
   
var ERROR = "error";
var WARNING = "warning";
    
exports.Errors = {
    
    warning: function(pos, msg) {
      return {
        pos: pos,
        type: WARNING,
        level: WARNING,
        message: msg
      };
    },
    
    unusedVar: function(pos, name) {
      var msg = '$' + name + ': unused variable.';
      return {
        pos: pos,
        type: WARNING,
        level: WARNING,
        message: msg
      };
    },
    
    countOnGroupingVar: function(pos, name) {
      var msg = "Count on grouping variable ($" + name + ") always returns 1. Use count clause instead.";
      return {
        pos: pos,
        type: WARNING,
        level: WARNING,
        message: msg
      };
    },

    XPST0008: function(pos, varname) {
      return {
        pos: pos,
        type: ERROR,
        level: ERROR,
        message: '[XPST0008] "' + varname + '": undeclared variable.'
      };
    },
    
    XQST0033: function(pos, prefix, ns) {
      return {
        pos: pos,
        type: ERROR,
        level: ERROR,
        message: '[XQST0033] "' + prefix + '": namespace prefix already bound to "' + ns + '".'
      };
    },
    
    XPST0081: function(pos, prefix) {
      return {
        pos: pos,
        type: ERROR,
        level: ERROR,
        message: '[XPST0081] "' + prefix + '": can not expand namespace prefix to URI.'
      };
    },
    
    XQST0049: function(pos, varname) {
        
    },
    
    XQST0039: function(pos, varname) {
      return {
        pos: pos,
        type: ERROR,
        level: ERROR,
        message: '[XQST0039] "' + varname + '": duplicate parameter name.'
      };
    },
    
    XQST0049: function(pos, varname) {
      return {
        pos: pos,
        type: ERROR,
        level: ERROR,
        message: '[XQST0049] "' + varname + '": duplicate variable declaration.'
      };
    },

    XQST0034: function(pos, functionName) {
      return {
        pos: pos,
        type: ERROR,
        level: ERROR,
        message: '[XQST0034] "' + functionName + '": duplicate function declaration.'
      };
    }
  };
});
