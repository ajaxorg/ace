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
  
  var Position = require("./Position").Position;
  var XQuerySemanticHighlighter = exports.XQuerySemanticHighlighter = function() {
    this.tokenizer = null;
    this.plain = null;
    this.source = [];
    this.lines = [];

    this.getTokens = function() {
      var resultLines  = new Array(this.source.length);
      var resultStates = new Array(this.source.length);
      var previousState = "start";
      var i = 0;
      for(i in this.source){
        var lineTokens = [];
        var tokens = [];
        if(this.lines[i]) {
          tokens = this.lines[i].sort(function(a, b){ return a.position.getOffset() - b.position.getOffset();  });
        }
        var sourceLine = this.source[i];
        var tokenizedLine = "";
        var cursor = 0;
        var j = 0;
        for(j in tokens)
        {
          var token = tokens[j];
          var position = token.position;
          if(position.getOffset() > cursor) {
            var value = sourceLine.substring(cursor, position.getOffset());
            tokenizedLine += value;
            lineTokens.push({
              type: "text",
              value: value
            });
          }
          cursor = position.getOffset() + position.getLength();
          value = sourceLine.substring(position.getOffset(), cursor);
          tokenizedLine += value;
          lineTokens.push({
            type: token.type,
            value: value 
          });
        }
        
        var nextState = "start";
        if(lineTokens.length > 0) {
          lineTokens[lineTokens.length - 1].type;
        }
        nextState = (nextState != "comment" && nextState != "string" && nextState != "cdata" && nextState != "tag") ? "start" : nextState;
        
        if(cursor < (sourceLine.length )) {
          value = sourceLine.substring(cursor);
          lineTokens.push({
             type: "text",
             value: value
          });
          tokenizedLine += value; 
        }
        //Check if the tokenized line is equal to the original one:
        if(sourceLine == tokenizedLine) {
          resultLines[i] = lineTokens;
          resultStates[i] = nextState;
          //result[i] = { line: sourceLine, startState: previousState, tokens: { tokens: lineTokens, state: nextState } };
        } else {
          //console.log("sourceLine: " + sourceLine);
          //console.log("tokenizedLine: " + tokenizedLine);
          resultLines[i] = [{ type: "text", value: sourceLine }];
          resultStates[i] = nextState;
          //result[i] = { tokens: [ { type: "text", value: sourceLine } ], state: nextState };
        }

        if(resultLines[i].length === 1 && resultLines[i][0].type === "text" && this.tokenizer instanceof Object) {
          var prev = resultStates[i - 1] ?  resultStates[i - 1] : "start";
          var result = this.tokenizer.getLineTokens(resultLines[i][0].value, prev);
          resultLines[i] = result.tokens;
          resultStates[i] = result.state;
        }
      }
      return {states: resultStates, lines: resultLines};
    };

    this.addToken = function(start, stop, type) {
      var before = this.plain.substring(0, start);
      var startLine = this.plain.substring(0, start).split("\n").length;
      startLine = startLine == 0 ? 0 : startLine - 1;
      
      var offset = before.lastIndexOf("\n");
      offset = offset == -1 ? start : start - before.lastIndexOf("\n") - 1;

      var cursor = start;

      var text = this.plain.substring(start, stop);

      var currentLine = startLine;
      for(var i in text)
      {
        var c = text[i];
        if(c == "\n") {
          var s = i;
          s = s < stop ? s : stop; 
          this.addPosition(new Position(currentLine, offset, s), type);
          currentLine++;
          offset = 0;
          cursor = i;
        } 
      };
      this.addPosition(new Position(currentLine, offset, stop - cursor + 1), type); 
    };
    
    this.addPosition = function(position, type)
    {
      var line = position.getLine();
      if(!this.lines[line]) {
        this.lines[line] = [];
      }
      this.lines[line].push({
        type: type,
        position: position
      });
    };

    this.setSource = function(source)
    {
      this.plain  = source.data;
      this.source = this.plain.split("\n");
    };
      //console.log("Line: " + token.getLine());
      //console.log(token.getText());
      //console.log(type);
  };
});
