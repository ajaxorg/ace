/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      William Candillon <wcandillon AT gmail DOT com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL. *
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
      for(i in this.source){
        var lineTokens = [];
        var tokens = [];
        if(this.lines[i]) {
          tokens = this.lines[i].sort(function(a, b){ return a.position.getOffset() - b.position.getOffset();  });
        }
        var sourceLine = this.source[i];
        var tokenizedLine = "";
        var cursor = 0;
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
