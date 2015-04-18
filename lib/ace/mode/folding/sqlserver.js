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

var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var BaseFoldMode = require("./fold_mode").FoldMode;

var FoldMode = exports.FoldMode = function() {};

oop.inherits(FoldMode, BaseFoldMode);

(function() {
    
    // Currently the only supported folding is #region comments
    // TODO: add more folding (will require in depth testing because this has never existed before) for things like:
    //      CASE ... END     https://msdn.microsoft.com/en-us/library/ms181765.aspx
    //      BEGIN ... END    https://msdn.microsoft.com/en-us/library/ms182717.aspx
    // -- LEFT OFF TRYING TO ADD ADVANCED FOLDING... UNCOMMENT TO CONTINUE
    
    
    //this.foldingStartMarker = /\bCASE\b|\bBEGIN\b/i;
    this.foldingStartMarker = /(\bCASE\b|\bBEGIN\b)|^\s*(\/\*)/;
    this.foldingStopMarker = /\bEND\b/i;
    
    
    this.startRegionRe = /^\s*(\/\*|--)#region\b/;
    
    this._getFoldWidgetBase = this.getFoldWidget;
   
    this.getFoldWidget = function(session, foldStyle, row) {
        var line = session.getLine(row);
        
        var fw = this._getFoldWidgetBase(session, foldStyle, row);
        
        if (!fw && this.startRegionRe.test(line))
            return "start";
    
        return fw;
    };

    //this is called when a fold widget is clicked
    this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
        var line = session.getLine(row);
    
        if (this.startRegionRe.test(line)) return this.getCommentRegionBlock(session, line, row);
    
        var match = line.match(this.foldingStartMarker);
        if (match) {
            var i = match.index;
    
            //if first capturing group, then match is for bracket, either '{' or '[', which match[1] will contain
            if (match[1]) return this.getEndBlock(session, row, i, match[1]);
            //return this.openingBracketBlock(session, match[1], row, i);
    
            //still going: match is for second capturing group, which is blockcomment
            var range = session.getCommentFoldRange(row, i + match[0].length, 1);
    
            if (range && !range.isMultiLine()) {
                if (forceMultiline) {
                    range = this.getSectionRange(session, row);
                }
                else if (foldStyle != "all") range = null;
            }
    
            return range;
        }
    
        if (foldStyle === "markbegin") return;
    /* this is when end fold has marker, and user clicks it, in which case we want to find the opening braket
        var match = line.match(this.foldingStopMarker);
        if (match) {
            var i = match.index + match[0].length;
    
            if (match[1]) return this.closingBracketBlock(session, match[1], row, i);
    
            return session.getCommentFoldRange(row, i, - 1);
        }*/
    
        return;
    };
    
    
    /**
     * finds the next 'END' for closing a fold range
     * @param {string} matchSequence - the sequence of charaters that started the fold widget, which should remain visible when the fold widget is folded
     */
    this.getEndBlock = function(session, row, column, matchSequence) {
        var start = {
            row: row,
            column: column + matchSequence.length
        };
        var maxRow = session.getLength();
        var line;
        
        var depth = 1;
        var re = /\bEND\b/i; ///^\s*(?:\/\*|--)#(end)?region\b/;
        while (++row < maxRow) {
            line = session.getLine(row);
            var m = re.exec(line);
            if (!m) continue;
            if (m[0]) depth--;
            else depth++;

            if (!depth) break;
        }
        var endRow = row;
        if (endRow > start.row) {
            return new Range(start.row, start.column, endRow, line.length);
        }
        
        
       /* var end = session.$findClosingBracket(bracket, start, typeRe);
        if (!end) return;
    
        var fw = session.foldWidgets[end.row];
        if (fw == null) fw = session.getFoldWidget(end.row);
    
        if (fw == "start" && end.row > start.row) {
            end.row--;
            end.column = session.getLine(end.row).length;
        }
        return Range.fromPoints(start, end);*/
    };
    
    
    this.getCommentRegionBlock = function(session, line, row) {
        var startColumn = line.search(/\s*$/);
        var maxRow = session.getLength();
        var startRow = row;
        
        var re = /^\s*(?:\/\*|--)#(end)?region\b/;
        var depth = 1;
        while (++row < maxRow) {
            line = session.getLine(row);
            var m = re.exec(line);
            if (!m) continue;
            if (m[1]) depth--;
            else depth++;

            if (!depth) break;
        }

        var endRow = row;
        if (endRow > startRow) {
            return new Range(startRow, startColumn, endRow, line.length);
        }
    };

}).call(FoldMode.prototype);

});
