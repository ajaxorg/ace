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
 * class UndoManager
 *
 * This object maintains the undo stack for an [[EditSession `EditSession`]].
 *
 **/

/**
 * new UndoManager()
 * 
 * Resets the current undo state and creates a new `UndoManager`.
 **/
var UndoManager = function() {
    this.reset();
};

(function() {

    /**
    * UndoManager.execute(options) -> Void
    * - options (Object): Contains additional properties
    *
    * Provides a means for implementing your own undo manager. `options` has one property, `args`, an [[Array `Array`]], with two elements:
    *
    * * `args[0]` is an array of deltas
    * * `args[1]` is the document to associate with
    *
    **/
    this.execute = function(options) {
        var deltas = options.args[0];
        this.$doc  = options.args[1];
        this.$undoStack.push(deltas);
        this.$redoStack = [];
    };

    /**
    * UndoManager.undo(dontSelect) -> Range
    * - dontSelect (Boolean): {:dontSelect}
    *
    * [Perform an undo operation on the document, reverting the last change. Returns the range of the undo.]{: #UndoManager.undo}
    **/
    this.undo = function(dontSelect) {
        var deltas = this.$undoStack.pop();
        var undoSelectionRange = null;
        if (deltas) {
            undoSelectionRange =
                this.$doc.undoChanges(deltas, dontSelect);
            this.$redoStack.push(deltas);
        }
        return undoSelectionRange;
    };

    /**
    * UndoManager.redo(dontSelect) -> Void
    * - dontSelect (Boolean): {:dontSelect}
    *
    * [Perform a redo operation on the document, reimplementing the last change.]{: #UndoManager.redo}
    **/
    this.redo = function(dontSelect) {
        var deltas = this.$redoStack.pop();
        var redoSelectionRange = null;
        if (deltas) {
            redoSelectionRange =
                this.$doc.redoChanges(deltas, dontSelect);
            this.$undoStack.push(deltas);
        }
        return redoSelectionRange;
    };

    /**
    * UndoManager.reset() -> Void
    *
    * Destroys the stack of undo and redo redo operations.
    **/
    this.reset = function() {
        this.$undoStack = [];
        this.$redoStack = [];
    };

    /**
    * UndoManager.hasUndo() -> Boolean
    *
    * Returns `true` if there are undo operations left to perform.
    **/
    this.hasUndo = function() {
        return this.$undoStack.length > 0;
    };

    /**
    * UndoManager.hasRedo() -> Boolean
    *
    * Returns `true` if there are redo operations left to perform.
    **/
    this.hasRedo = function() {
        return this.$redoStack.length > 0;
    };

}).call(UndoManager.prototype);

exports.UndoManager = UndoManager;
});
