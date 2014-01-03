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

function splitLine (lines, point) {
    var text = lines[point.row];
    lines[point.row] = text.slice(0, point.column);
    lines.splice(point.row + 1, 0, text.slice(point.column));
}

function joinLineWithNext(lines, row) {
    lines[row] += lines[row + 1];
    lines.splice(row + 1, 1);            
}

function throwDeltaError(delta, errorText){
    errorText = 'Invalid Delta: ' + errorText;
    console.log(errorText, delta);            
    throw errorText;        
}

function validateDelta(lines, delta) {

    // Validate action.
    if (delta.action != 'insert' && delta.action != 'delete')
        fnThrow('Delta action must be "insert" or "delete".');
    
    // Validate lines.
    if (!delta.lines instanceof Array)
        fnThrow('Delta lines must be an array');
    
    // Validate range type.
    if (!delta.range instanceof Range)
        fnThrow('Range object is not an instance of the Range class');
    
    // Validate start point.
    var start = delta.range.start;
    if (Math.min(Math.max(start.row,    0), lines.length - 1       ) != start.row ||
        Math.min(Math.max(start.column, 0), lines[start.row].length) != start.column)
    {
        fnThrow('Range start point not contained in document');
    }
    
    // Validate ending row offset.
    if (delta.lines.length - 1 != delta.range.end.row - delta.range.start.row)
        fnThrow('Range row offsets does not match delta lines');
    
    // TODO:
    //   - Validate that the ending column offset matches the lines.
    //   - Validate the deleted lines match the lines in the document.
}


exports.applyDelta = function(lines, delta) {
            
    // Validate delta.
    validateDelta(lines, delta);
    
    // Apply delta.
    if (delta.range.start.row == delta.range.end.row)
    {
        // Apply single-line delta.
        // Note: The multi-line code below correctly handle single-line
        //       deltas too, but we need to short-circuit for speed.
        var row         = delta.range.start.row;
        var startColumn = delta.range.start.column;
        var endColumn   = delta.range.end.column;
        var line        = lines[row];
        switch (delta.action) {
            
            case 'insert':
                lines[row] = line.substring(0, startColumn) + delta.lines[0] + line.substring(startColumn);
                break;
            
            case 'delete':
                lines[row] = line.substring(0, startColumn) + line.substring(endColumn);
                break;
        }
    } else {
        
        // Apply multi-line delta.
        switch (delta.action) {
            
            case 'insert':
                splitLine(lines, delta.range.start);
                for (var i = 0; i < delta.lines.length; i++) {
                    var row = delta.range.start.row + 1 + i;
                    lines.splice(row, 0, delta.lines[i]);
                }
                joinLineWithNext(lines, delta.range.start.row);
                joinLineWithNext(lines, delta.range.end.row);
                break;
            
            case 'delete':                
                splitLine(lines, delta.range.end);
                splitLine(lines, delta.range.start);
                lines.splice(
                    delta.range.start.row + 1,                       // Where to start deleting
                    delta.range.end.row - delta.range.start.row + 1  // Num lines to delete.
                );
                joinLineWithNext(lines, delta.range.start.row);
                break;
        }
    }
}
});
