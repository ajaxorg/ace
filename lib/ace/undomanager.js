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

/**
 * This object maintains the undo stack for an [[EditSession `EditSession`]].
 * @class UndoManager
 **/

/**
 * Resets the current undo state and creates a new `UndoManager`.
 * 
 * @constructor
 **/
var UndoManager = function() {
    this.$maxRev = 0;
    this.$fromUndo = false;
    this.reset();
};

(function() {
    
    this.addSession = function(session) {
        this.$session = session;
    };
    /**
     * Provides a means for implementing your own undo manager. `options` has one property, `args`, an [[Array `Array`]], with two elements:
     *
     * - `args[0]` is an array of deltas
     * - `args[1]` is the document to associate with
     *
     * @param {Object} options Contains additional properties
     *
     **/
    this.add = function(delta, allowMerge, session) {
        if (this.$fromUndo) return;
        if (delta == this.$lastDelta) return;
        if (allowMerge === false || !this.lastDeltas) {
            this.lastDeltas = [];
            this.$undoStack.push(this.lastDeltas);
            delta.id = this.$rev = ++this.$maxRev;
        }
        if (delta.action == "remove" || delta.action == "insert")
            this.$lastDelta = delta;
        this.lastDeltas.push(delta);
    };
    
    this.addSelection = function(selection, rev) {
        this.selections.push({
            value: selection,
            rev: rev || this.$rev
        });
    };
    
    this.startNewGroup = function() {
        this.lastDeltas = null;
        return this.$rev;
    };
    
    this.markIgnored = function(from, to) {
        if (to == null) to = this.$rev + 1;
        var stack = this.$undoStack;
        for (var i = stack.length; i--;) {
            var delta = stack[i][0];
            if (delta.id <= from)
                break;
            if (delta.id < to)
                delta.ignore = true;
        }
        this.lastDeltas = null;
    };
    
    this.getSelection = function(rev, after) {
        var stack = this.selections;
        for (var i = stack.length; i--;) {
            var selection = stack[i];
            if (selection.rev < rev) {
                if (after)
                    selection = stack[i + 1];
                return selection;
            }
        }
    };
    
    this.getRevision = function() {
        return this.$rev;
    };
    
    this.getDeltas = function(from, to) {
        if (to == null) to = this.$rev + 1;
        var stack = this.$undoStack;
        var end = null, start = 0;
        for (var i = stack.length; i--;) {
            var delta = stack[i][0];
            if (delta.id < to && !end)
                end = i+1;
            if (delta.id <= from) {
                start = i + 1;
                break;
            }
        }
        return stack.slice(start, end);
    };
    
    this.getChangedRanges = function(from, to) {
        if (to == null) to = this.$rev + 1;
        
    };
    
    this.getChangedLines = function(from, to) {
        if (to == null) to = this.$rev + 1;
        
    };
    
    /**
     * [Perform an undo operation on the document, reverting the last change.]{: #UndoManager.undo}
     * @param {Boolean} dontSelect {:dontSelect}
     *
     * @returns {Range} The range of the undo.
     **/
    this.undo = function(session, dontSelect) {
        this.lastDeltas = null;
        var stack = this.$undoStack;
        
        if (!rearrangeUndoStack(stack, stack.length))
            return;
        
        if (!session)
            session = this.$session;
        
        if (this.$redoStackBaseRev !== this.$rev && this.$redoStack.length)
            this.$redoStack = [];
        
        this.$fromUndo = true;
        
        var deltaSet = stack.pop();
        var undoSelectionRange = null;
        if (deltaSet && deltaSet.length) {
            undoSelectionRange = session.undoChanges(deltaSet, dontSelect);
            this.$redoStack.push(deltaSet);
            this.$syncRev();
        }
        
        this.$fromUndo = false;

        return undoSelectionRange;
    };
    
    /**
     * [Perform a redo operation on the document, reimplementing the last change.]{: #UndoManager.redo}
     * @param {Boolean} dontSelect {:dontSelect}
     *
     **/
    this.redo = function(session, dontSelect) {
        this.lastDeltas = null;
        
        if (!session)
            session = this.$session;
        
        this.$fromUndo = true;
        if (this.$redoStackBaseRev != this.$rev) {
            var diff = this.getDeltas(this.$redoStackBaseRev, this.$rev + 1);
            rebaseRedoStack(this.$redoStack, diff);
            this.$redoStackBaseRev = this.$rev;
            this.$redoStack.forEach(function(x) {
                x[0].id = ++this.$maxRev;
            }, this);
        }
        var deltaSet = this.$redoStack.pop();
        var redoSelectionRange = null;
        
        if (deltaSet) {
            redoSelectionRange = session.redoChanges(deltaSet, dontSelect);
            this.$undoStack.push(deltaSet);
            this.$syncRev();
        }
        this.$fromUndo = false;
        
        return redoSelectionRange;
    };
    
    this.$syncRev = function() {
        var stack = this.$undoStack;
        var nextDelta = stack[stack.length - 1];
        var id = nextDelta && nextDelta[0].id || 0;
        this.$redoStackBaseRev = id;
        this.$rev = id;
    };

    /**
     * Destroys the stack of undo and redo redo operations.
     **/
    this.reset = function() {
        this.lastDeltas = null;
        this.$lastDelta = null;
        this.$undoStack = [];
        this.$redoStack = [];
        this.$rev = 0;
        this.mark = 0;
        this.$redoStackBaseRev = this.$rev;
        this.selections = [];
    };

    
    /**
     * Returns `true` if there are undo operations left to perform.
     * @returns {Boolean}
     **/
    this.canUndo = function() {
        return this.$undoStack.length > 0;
    };

    /**
     * Returns `true` if there are redo operations left to perform.
     * @returns {Boolean}
     **/
    this.canRedo = function() {
        return this.$redoStack.length > 0;
    };
    
    /**
     * Marks the current status clean
     **/
    this.bookmark = function(rev) {
        if (rev == undefined)
            rev = this.$rev;
        this.mark = rev;
    };

    /**
     * Returns if the current status is clean
     * @returns {Boolean}
     **/
    this.isAtBookmark = function() {
        return this.$rev === this.mark;
    };
    
    this.toJSON = function() {
        
    };
    
    this.fromJSON = function() {
        
    };
    
    this.hasUndo = this.canUndo;
    this.hasRedo = this.canRedo;
    this.isClean = this.isAtBookmark;
    this.markClean = this.bookmark;
    
    this.$prettyPrint = function(delta) {
        if (delta) return stringifyDelta(delta);
        return stringifyDelta(this.$undoStack) + "\n---\n" + stringifyDelta(this.$redoStack);
    };
}).call(UndoManager.prototype);

function rearrangeUndoStack(stack, pos) {
    for (var i = pos; i--; ) {
        var deltaSet = stack[i];
        if (deltaSet && !deltaSet[0].ignore) {
            while(i < pos - 1) {
                var swapped = swapGroups(stack[i], stack[i + 1]);
                stack[i] = swapped[0];
                stack[i + 1] = swapped[1];
                i++;
            }
            return true;
        }
    }
}

var Range = require("./range").Range;
var cmp = Range.comparePoints;
var comparePoints = Range.comparePoints;

function $updateMarkers(delta) {
    var isInsert = delta.action == "insert";
    var start = delta.start;
    var end = delta.end;
    var rowShift = (end.row - start.row) * (isInsert ? 1 : -1);
    var colShift = (end.column - start.column) * (isInsert ? 1 : -1);
    if (isInsert) end = start;

    for (var i in this.marks) {
        var point = this.marks[i];
        var cmp = comparePoints(point, start);
        if (cmp < 0) {
            continue; // delta starts after the range
        }
        if (cmp === 0) {
            if (isInsert) {
                if (point.bias == 1) {
                    cmp = 1;
                }
                else {
                    point.bias == -1;
                    continue;
                }
            }
        }
        var cmp2 = isInsert ? cmp : comparePoints(point, end);
        if (cmp2 > 0) {
            point.row += rowShift;
            point.column += point.row == end.row ? colShift : 0;
            continue;
        }
        if (!isInsert && cmp2 <= 0) {
            point.row = start.row;
            point.column = start.column;
            if (cmp2 === 0)
                point.bias = 1;
        }
    }
}



function clonePos(pos) {
    return {row: pos.row,column: pos.column};
}
function cloneDelta(d) {
    return {
        start: clonePos(d.start),
        end: clonePos(d.end),
        action: d.action,
        lines: d.lines.slice()
    };
}
function stringifyDelta(d) {
    d = d || this;
    if (Array.isArray(d)) {
        return d.map(stringifyDelta).join("\n");
    }
    var type = "";
    if (d.action) {
        type = d.action == "insert" ? "+" : "-";
        type += "[" + d.lines + "]";
    } else if (d.value) {
        if (Array.isArray(d.value)) {
            type = d.value.map(stringifyRange).join("\n");
        } else {
            type = stringifyRange(d.value);
        }
    }
    if (d.start) {
        type += stringifyRange(d);
    }
    if (d.id || d.rev) {
        type += "\t(" + (d.id || d.rev) + ")";
    }
    return type;
}
function stringifyRange(r) {
    return r.start.row + ":" + r.start.column 
        + "=>" + r.end.row + ":" + r.end.column;
}
/*
 * i i  d1  d2
 *      |/  |/  d2.s >= d1.e shift(d2, d1, -1)
 *              d2.s <= d1.s shift(d1, d2, +1)
 *       d1.s < d2.s < d1.e // can split
 * 
 * i r  d1  d2
 *      |/  |\  d2.s >= d1.e shift(d2, d1, -1)
 *              d2.e <= d1.s shift(d1, d2, -1)
 *       else // can't swap
 * 
 * r i  d1  d2
 *      |\  |/  d2.s >= d1.s shift(d2, d1, +1)
 *              d2.s <= d1.s shift(d1, d2, +1)
 *       // no else
 * 
 * r r  d1  d2
 *      |\  |\  d2.s >= d1.s shift(d2, d1, +1)
 *              d2.e <= d1.s shift(d1, d2, -1)
 *       d2.s < d1.s < d2.e // can split
 */

function swap(d1, d2) {
    var i1 = d1.action == "insert";
    var i2 = d2.action == "insert";
    
    if (i1 && i2) {
        if (cmp(d2.start, d1.end) >= 0) {
            shift(d2, d1, -1);
        } else if (cmp(d2.start, d1.start) <= 0) {
            shift(d1, d2, +1);
        } else {
            return null;
        }
    } else if (i1 && !i2) {
        if (cmp(d2.start, d1.end) >= 0) {
            shift(d2, d1, -1);
        } else if (cmp(d2.end, d1.start) <= 0) {
            shift(d1, d2, -1);
        } else {
            return null;
        }
    } else if (!i1 && i2) {
        if (cmp(d2.start, d1.start) >= 0) {
            shift(d2, d1, +1);
        } else if (cmp(d2.start, d1.start) <= 0) {
            shift(d1, d2, +1);
        } else {
            return null;
        }
    } else if (!i1 && !i2) {
        if (cmp(d2.start, d1.start) >= 0) {
            shift(d2, d1, +1);
        } else if (cmp(d2.end, d1.start) <= 0) {
            shift(d1, d2, -1);
        } else {
            return null;
        }
    }
    return [d2, d1];
}
function swapGroups(ds1, ds2) {
    for (var i = ds1.length; i--; ) {
        for (var j = 0; j < ds2.length; j++) {
            if (!swap(ds1[i], ds2[j])) {
                // rollback, we have to undo ds2 first
                while (i < ds1.length) {
                    while (j--) {
                        swap(ds2[j], ds1[i]);
                    }
                    j = ds2.length;
                    i++;
                }                
                return [ds1, ds2];
            }
        }
    }
    ds1.selectionBefore = ds2.selectionBefore = 
    ds1.selectionAfter = ds2.selectionAfter = null;
    return [ds2, ds1];
}

/*
      d2          xform(d1, c1) = [d2, c2]
    o<---o        xform(c1, d1) = [c2, d2]
 c2 |    | d1     
    o<---o
      c1
*/
function xform(d1, c1) {
    var i1 = d1.action == "insert";
    var i2 = c1.action == "insert";
    
    if (i1 && i2) {
        if (cmp(d1.start, c1.start) < 0) {
            shift(c1, d1, 1);
        } else {
            shift(d1, c1, 1);
        }
    } else if (i1 && !i2) {
        if (cmp(d1.start, c1.end) >= 0) {
            shift(d1, c1, -1);
        } else if (cmp(d1.start, c1.start) <= 0) {
            shift(c1, d1, +1);
        } else {
            shift(d1, Range.fromPoints(c1.start, d1.start), -1);
            shift(c1, d1, +1);
        }
    } else if (!i1 && i2) {
        if (cmp(c1.start, d1.end) >= 0) {
            shift(c1, d1, -1);
        } else if (cmp(c1.start, d1.start) <= 0) {
            shift(d1, c1, +1);
        } else {
            shift(c1, Range.fromPoints(d1.start, c1.start), -1);
            shift(d1, c1, +1);
        }
    } else if (!i1 && !i2) {
        if (cmp(c1.start, d1.end) >= 0) {
            shift(c1, d1, -1);
        } else if (cmp(c1.end, d1.start) <= 0) {
            shift(d1, c1, -1);
        } else {
            var before, after;
            if (cmp(d1.start, c1.start) < 0) {
                before = d1;
                d1 = splitDelta(d1, c1.start);
            }
            if (cmp(d1.end, c1.end) > 0) {
                after = splitDelta(d1, c1.end);
            }

            shiftPos(c1.end, d1.start, d1.end, -1);
            if (after && !before) {
                d1.lines = after.lines;
                d1.start = after.start;
                d1.end = after.end;
                after = d1;
            }

            return [c1, before, after].filter(Boolean);
        }
    }
    return [c1, d1];
}
    
function shift(d1, d2, dir) {
    shiftPos(d1.start, d2.start, d2.end, dir);
    shiftPos(d1.end, d2.start, d2.end, dir);
}
function shiftPos(pos, start, end, dir) {
    if (pos.row == (dir == 1 ? start : end).row) {
        pos.column += dir * (end.column - start.column);
    }
    pos.row += dir * (end.row - start.row);
}
function splitDelta(c, pos) {
    var lines = c.lines;
    var end = c.end;
    c.end = clonePos(pos);    
    var rowsBefore = c.end.row - c.start.row;
    var otherLines = lines.splice(rowsBefore, lines.length);
    
    var col = rowsBefore ? pos.column : pos.column - c.start.column;
    lines.push(otherLines[0].substring(0, col));
    otherLines[0] = otherLines[0].substr(col)   ; 
    var rest = {
        start: clonePos(pos),
        end: end,
        lines: otherLines,
        action: c.action
    };
    return rest;
}

function moveDeltasByOne(redoStack, d) {
    d = cloneDelta(d);
    for (var j = redoStack.length; j--;) {
        var deltaSet = redoStack[j];
        for (var i = 0; i < deltaSet.length; i++) {
            var x = deltaSet[i];
            var xformed = xform(x, d);
            d = xformed[0];
            if (xformed.length != 2) {
                if (xformed[2]) {
                    deltaSet.splice(i + 1, 1, xformed[1], xformed[2]);
                    i++;
                } else if (!xformed[1]) {
                    deltaSet.splice(i, 1);
                    i--;
                }
            }
        }
        if (!deltaSet.length) {
            redoStack.splice(j, 1); 
        }
    }
    return redoStack;
}
function rebaseRedoStack(redoStack, deltaSets) {
    for (var i = 0; i < deltaSets.length; i++) {
        var deltas = deltaSets[i];
        for (var j = 0; j < deltas.length; j++) {
            moveDeltasByOne(redoStack, deltas[j]);
        }
    }
}

exports.UndoManager = UndoManager;

});
