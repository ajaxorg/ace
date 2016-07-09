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
/*
* Folding mode for Cabal files (Haskell): allow folding each seaction, including
* the initial general section.
*/
define(function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var BaseFoldMode = require("./fold_mode").FoldMode;
var Range = require("../../range").Range;

var FoldMode = exports.FoldMode = function() {};
oop.inherits(FoldMode, BaseFoldMode);

(function() {
  /**
  is the row a heading?
  */
  this.isHeading = function (session,row) {
      var heading = "markup.heading";
      var token = session.getTokens(row)[0];
      return row==0 || (token && token.type.lastIndexOf(heading, 0) === 0);
  };

  this.getFoldWidget = function(session, foldStyle, row) {
      if (this.isHeading(session,row)){
        return "start";
      } else if (foldStyle === "markbeginend" && !(/^\s*$/.test(session.getLine(row)))){
        var maxRow = session.getLength();
        while (++row < maxRow) {
          if (!(/^\s*$/.test(session.getLine(row)))){
              break;
          }
        }
        if (row==maxRow || this.isHeading(session,row)){
          return "end";
        }
      }
      return "";
  };


  this.getFoldWidgetRange = function(session, foldStyle, row) {
      var line = session.getLine(row);
      var startColumn = line.length;
      var maxRow = session.getLength();
      var startRow = row;
      var endRow = row;
      // go until next heading
      if (this.isHeading(session,row)) {
          while (++row < maxRow) {
              if (this.isHeading(session,row)){
                row--;
                break;
              }
          }

          endRow = row;
          // remove empty lines at end
          if (endRow > startRow) {
              while (endRow > startRow && /^\s*$/.test(session.getLine(endRow)))
                  endRow--;
          }

          if (endRow > startRow) {
              var endColumn = session.getLine(endRow).length;
              return new Range(startRow, startColumn, endRow, endColumn);
          }
      // go back to heading
      } else if (this.getFoldWidget(session, foldStyle, row)==="end"){
        var endRow = row;
        var endColumn = session.getLine(endRow).length;
        while (--row>=0){
          if (this.isHeading(session,row)){
            break;
          }
        }
        var line = session.getLine(row);
        var startColumn = line.length;
        return new Range(row, startColumn, endRow, endColumn);
      }
    };

}).call(FoldMode.prototype);

});
