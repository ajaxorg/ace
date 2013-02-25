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

  var JSONParseTreeHandler = exports.JSONParseTreeHandler = function(code) {

    //List of nodes that are not targeted by the parse tree size optimization.
    var list = [
        "OrExpr", "AndExpr", "ComparisonExpr", "StringConcatExpr", "RangeExpr"
        //, "AdditiveExpr", "MultiplicativeExpr"
        , "UnionExpr", "IntersectExceptExpr", "InstanceofExpr", "TreatExpr", "CastableExpr"
        , "CastExpr", "UnaryExpr", "ValueExpr", "FTContainsExpr", "SimpleMapExpr", "PathExpr", "RelativePathExpr"
        , "PostfixExpr", "StepExpr"
    ];
    
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
    
    function popNode(){
     
      if(ptr.children.length > 0) {
        var s = ptr.children[0];
        var e = null;
        //We want to skip empty non terminals. For instance PredicateList:
        // [108] AxisStep ::= (ReverseStep | ForwardStep) PredicateList
        // [120] PredicateList ::= Predicate*
        for(var i= ptr.children.length - 1; i >= 0;i--) {
          e = ptr.children[i];
          if(e.pos.el !== 0 || e.pos.ec !== 0) {
            break;
          }
        }
        ptr.pos.sl = s.pos.sl;
        ptr.pos.sc = s.pos.sc;
        ptr.pos.el = e.pos.el;
        ptr.pos.ec = e.pos.ec;
      }
      
      //Normalize EQName && FunctionName
      if(ptr.name === "FunctionName") {
        ptr.name = "EQName";  
      }
      if(ptr.name === "EQName" && ptr.value === undefined) {
        ptr.value = ptr.children[0].value;
        ptr.children.pop();
      }
      
      if(ptr.getParent !== null) {
        ptr = ptr.getParent;
        //for(var i in ptr.children) {
          //delete ptr.children[i].getParent;
        //}
      } else {
        //delete ptr.getParent;
      }

      //Parse tree size optimization
      if(ptr.children.length > 0) {
        var lastChild = ptr.children[ptr.children.length - 1];
        if(lastChild.children.length === 1 && list.indexOf(lastChild.name) !== -1) {
          ptr.children[ptr.children.length - 1] = lastChild.children[0];
        }
      }
    }
    
    this.closeParseTree = function() {
      while(ptr.getParent !== null) {
        popNode();
      }
      popNode();
    };

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
      popNode();
    };

    this.terminal = function(name, begin, end) {
      name = (name.substring(0, 1) === "'" && name.substring(name.length - 1) === "'") ? "TOKEN" : name;
      pushNode(name, begin); 
      setValue(ptr, begin, end);
      popNode();
    };

    this.whitespace = function(begin, end) {
      var name = "WS";
      pushNode(name, begin);
      setValue(ptr, begin, end);
      popNode();
    };

    function setValue(node, begin, end) {
      
      var e = end - cursor;
      ptr.value = remains.substring(0, e); 
      remains = remains.substring(e);
      cursor = end;
      
      var sl = line;
      var sc = lineCursor;
      var el = sl + ptr.value.split("\n").length - 1;
      var lastIdx = ptr.value.lastIndexOf("\n");
      var ec = lastIdx === -1 ? sc + ptr.value.length : ptr.value.substring(lastIdx + 1).length;
//      ec = ec === 0 ? 0 : ec - 1;
      
      line = el;
      //lineCursor = ec === 0 ? 0 : ec;
      lineCursor = ec;

      ptr.pos.sl = sl; 
      ptr.pos.sc = sc; 
      ptr.pos.el = el; 
      ptr.pos.ec = ec; 
    } 
  };
});
