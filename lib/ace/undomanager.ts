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

import { Range, Position } from "./range";
import { EditSession } from "./edit_session";

export type Selection = any; // TODO TS

export interface IUndoManager {
    undo: (session: EditSession, dontSelect?: boolean) => void,
    redo: (session: EditSession, dontSelect?: boolean) => void,
    reset: () => void,
    add: (delta: Delta, allowMerge?: boolean) => void
    addSelection: (selection: Selection, rev?: number) => void,
    startNewGroup: () => void,
    addSession: (session: EditSession) => void;
}

export interface Delta {
    action?: string,
    start?: Position,
    end?: Position,
    lines?: string[],
    id?: number,
    ignore?: boolean,
    value?: Range|Range[],
    rev?: number,
    folds?: any // TODO TS
}

export interface DeltaSet extends Array<Delta> {
    selectionBefore?: Selection,
    selectionAfter?: Selection
}
type UndoStack = DeltaSet[];

/**
 * This object maintains the undo stack for an [[EditSession `EditSession`]].
 * @class UndoManager
 **/

/**
 * Resets the current undo state and creates a new `UndoManager`.
 * 
 * @constructor
 **/
export class UndoManager implements IUndoManager {
    
    $redoStackBaseRev: number;
    mark: number;
    selections: {value: Selection, rev: number}[];
    private $rev: number;
    private $undoStack: UndoStack;
    private $redoStack: UndoStack;
    lastDeltas: Delta[]|null;
    private $lastDelta: Delta|null;
    private $session: EditSession;
    private $fromUndo: boolean;
    private $maxRev: number;

    constructor() {
        this.$maxRev = 0;
        this.$fromUndo = false;
        this.reset();
    };
    
    addSession(session: EditSession) {
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
    add(delta: Delta, allowMerge=true) {
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
    
    addSelection(selection: Selection, rev: number) {
        this.selections.push({
            value: selection,
            rev: rev || this.$rev
        });
    };
    
    startNewGroup() {
        this.lastDeltas = null;
        return this.$rev;
    };
    
    markIgnored(from: number, to: number|null) {
        if (to == null) to = this.$rev + 1;
        var stack = this.$undoStack;
        for (var i = stack.length; i--;) {
            var delta = stack[i][0];
            if (!delta)
                continue;
            if (delta!.id <= from)
                break;
            if (delta!.id < to)
                delta.ignore = true;
        }
        this.lastDeltas = null;
    };
    
    getSelection(rev: number, after=false) {
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
    
    getRevision() {
        return this.$rev;
    };
    
    getDeltas(from: number, to: number) {
        if (to == null) to = this.$rev + 1;
        var stack = this.$undoStack;
        var end = undefined, start = 0;
        for (var i = stack.length; i--;) {
            var delta = stack[i][0];
            if (!delta)
                continue;
            if (delta.id < to && !end)
                end = i+1;
            if (delta.id <= from) {
                start = i + 1;
                break;
            }
        }
        return stack.slice(start, end);
    };
    
    getChangedRanges(from: number, to: number) {
        if (to == null) to = this.$rev + 1;
        
    };
    
    getChangedLines(from: number, to: number) {
        if (to == null) to = this.$rev + 1;
        
    };

    /**
     * [Perform an undo operation on the document, reverting the last change.]{: #UndoManager.undo}
     * @param {Boolean} dontSelect {:dontSelect}
     **/
    undo(session: EditSession, dontSelect: boolean): void {
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
        if (deltaSet && (<Delta[]>deltaSet).length) {
            session.undoChanges(deltaSet, dontSelect);
            this.$redoStack.push(<Delta[]>deltaSet);
            this.$syncRev();
        }
        
        this.$fromUndo = false;
    };
    
    /**
     * [Perform a redo operation on the document, reimplementing the last change.]{: #UndoManager.redo}
     * @param {Boolean} dontSelect {:dontSelect}
     *
     **/
    redo(session: EditSession, dontSelect: boolean) {
        this.lastDeltas = null;
        
        if (!session)
            session = this.$session;
        
        this.$fromUndo = true;
        if (this.$redoStackBaseRev != this.$rev) {
            var diff = this.getDeltas(this.$redoStackBaseRev, this.$rev + 1);
            rebaseRedoStack(this.$redoStack, diff);
            this.$redoStackBaseRev = this.$rev;
            this.$redoStack.forEach((x) => {
                x[0].id = ++this.$maxRev;
            });
        }
        var deltaSet = this.$redoStack.pop();
        
        if (deltaSet) {
            session.redoChanges(deltaSet, dontSelect);
            this.$undoStack.push(deltaSet);
            this.$syncRev();
        }
        this.$fromUndo = false;
    };
    
    $syncRev() {
        var stack = this.$undoStack;
        var nextDelta = stack[stack.length - 1];
        var id = nextDelta && nextDelta[0].id || 0;
        this.$redoStackBaseRev = id;
        this.$rev = id;
    };

    /**
     * Destroys the stack of undo and redo redo operations.
     **/
    reset() {
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
    canUndo() {
        return this.$undoStack.length > 0;
    };

    /**
     * Returns `true` if there are redo operations left to perform.
     * @returns {Boolean}
     **/
    canRedo() {
        return this.$redoStack.length > 0;
    };
    
    /**
     * Marks the current status clean
     **/
    bookmark(rev: number) {
        if (rev == undefined)
            rev = this.$rev;
        this.mark = rev;
    };

    /**
     * Returns if the current status is clean
     * @returns {Boolean}
     **/
    isAtBookmark() {
        return this.$rev === this.mark;
    };
    
    toJSON() {
        
    };
    
    fromJSON() {
        
    };
    
    // this.hasUndo = this.canUndo; // TODO TS
    // this.hasRedo = this.canRedo;
    // this.isClean = this.isAtBookmark;
    // this.markClean = this.bookmark;
    
    $prettyPrint(delta: Delta) {
        if (delta) return stringifyDelta(delta);
        return stringifyDelta(this.$undoStack) + "\n---\n" + stringifyDelta(this.$redoStack);
    };
}

function rearrangeUndoStack(stack: UndoStack, pos: number) {
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

var cmp = Range.comparePoints;
var comparePoints = Range.comparePoints;

function clonePos(pos: Position) {
    return {row: pos.row,column: pos.column};
}
function cloneDelta(d: Delta) {
    return {
        start: clonePos(d.start),
        end: clonePos(d.end),
        action: d.action,
        lines: d.lines && d.lines.slice()
    };
}
function stringifyDelta(d: Delta|Delta[]|Delta[][]): string {
    if (Array.isArray(d)) {
        var deltas: string[] = [];
        for (var delta of d) {
            deltas.push(stringifyDelta(delta));
        }
        return deltas.join("\n");
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
        type += stringifyRange(<Range>d);
    }
    if (d.id || d.rev) {
        type += "\t(" + (d.id || d.rev) + ")";
    }
    return type;
}
function stringifyRange(r: {start: Position, end: Position}) {
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

function swap(d1: Delta, d2: Delta) {
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
function swapGroups(ds1: DeltaSet, ds2: DeltaSet) {
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
function xform(d1: Delta, c1: Delta): Delta[] {
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
            var before, after: Delta|undefined;
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

            return <Delta[]>[c1, before, after].filter(Boolean);
        }
    }
    return [c1, d1];
}
    
function shift(d1: Delta, d2: Delta, dir: 1|-1) {
    shiftPos(d1.start, d2.start, d2.end, dir);
    shiftPos(d1.end, d2.start, d2.end, dir);
}
function shiftPos(pos: Position, start: Position, end: Position, dir: 1|-1) {
    if (pos.row == (dir == 1 ? start : end).row) {
        pos.column += dir * (end.column - start.column);
    }
    pos.row += dir * (end.row - start.row);
}
function splitDelta(c: Delta, pos: Position) {
    var lines = c.lines || [];
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

function moveDeltasByOne(redoStack: UndoStack, d: Delta) {
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
function rebaseRedoStack(redoStack: UndoStack, deltaSets: DeltaSet[]) {
    for (var i = 0; i < deltaSets.length; i++) {
        var deltas = deltaSets[i];
        for (var j = 0; j < deltas.length; j++) {
            moveDeltasByOne(redoStack, deltas[j]);
        }
    }
}
