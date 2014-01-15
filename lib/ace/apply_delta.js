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

var Range = require("./range").Range;

function splitLine (docLines, position) {
    var text = docLines[position.row];
    docLines[position.row] = text.slice(0, position.column);
    docLines.splice(position.row + 1, 0, text.slice(position.column));
}

function joinLineWithNext(docLines, row) {
    docLines[row] += docLines[row + 1];
    docLines.splice(row + 1, 1);            
}

function throwDeltaError(delta, errorText){
    console.log('Invalid Delta:', delta);    
    throw 'Invalid Delta: ' + errorText;
}

function positionInDocument(docLines, position) {
    return position.row    >= 0 && position.row    <  docLines.length &&
           position.column >= 0 && position.column <= docLines[position.row].length;
}

function validateDelta(docLines, delta) {

    // Validate action string.
    if (delta.action != 'insert' && delta.action != 'remove')
        throwDeltaError(delta, 'delta.action must be "insert" or "remove"');
    
    // Validate lines type.
    if (!(delta.lines instanceof Array))
        throwDeltaError(delta, 'delta.lines must be an Array');

    // Validate range type.
    if (!(delta.range instanceof Range))
       throwDeltaError(delta, 'delta.range must be an instance of the Range class');        

    // Validate that the start point is contained in the document.
    var start = delta.range.start;
    if (!positionInDocument(docLines, delta.range.start))
        throwDeltaError(delta, 'delta.range.start must be contained in document');
    
    // Validate that the end point is contained in the document (remove deltas only).
    var end = delta.range.end;
    if (delta.action == 'remove' && !positionInDocument(docLines, end))
        throwDeltaError(delta, 'delta.range.end must contained in document for "remove" actions');
    
    // Validate that the .range size matches the .lines size.
    var numRangeRows = end.row - start.row;
    var numRangeLastLineChars = (end.column - (numRangeRows == 0 ? start.column : 0));
    if (numRangeRows != delta.lines.length - 1 || delta.lines[numRangeRows].length != numRangeLastLineChars)
        throwDeltaError(delta, 'delta.range must match delta lines');
}

exports.applyDelta = function(docLines, delta, doNotValidate) {
            
    // Validate delta.
    if (!doNotValidate)
        validateDelta(docLines, delta);
    
    // Apply delta.
    if (delta.range.start.row == delta.range.end.row) {
        // Apply single-line delta.
        // Note: The multi-line code below correctly handle single-line
        //       deltas too, but we need to short-circuit for speed.
        var row         = delta.range.start.row;
        var startColumn = delta.range.start.column;
        var endColumn   = delta.range.end.column;
        var line        = docLines[row];
        switch (delta.action) {
            
            case 'insert':
                docLines[row] = line.substring(0, startColumn) + delta.lines[0] + line.substring(startColumn);
                break;
            
            case 'remove':
                docLines[row] = line.substring(0, startColumn) + line.substring(endColumn);
                break;
        }
    } else {
        
        // Apply multi-line delta.
        switch (delta.action) {
            
            case 'insert':
                splitLine(docLines, delta.range.start);
                docLines.splice.apply(docLines, [delta.range.start.row + 1, 0].concat(delta.lines));
                joinLineWithNext(docLines, delta.range.start.row);
                joinLineWithNext(docLines, delta.range.end.row);
                break;
            
            case 'remove':                
                splitLine(docLines, delta.range.end);
                splitLine(docLines, delta.range.start);
                docLines.splice(
                    delta.range.start.row + 1,                       // Where to start deleting
                    delta.range.end.row - delta.range.start.row + 1  // Num lines to delete.
                );
                joinLineWithNext(docLines, delta.range.start.row);
                break;
        }
    }
}
});
