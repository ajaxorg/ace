"use strict";
/**
 * @typedef {import("./edit_session").EditSession} EditSession
 */
var Range = require("./range").Range;
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var oop = require("./lib/oop");

class PlaceHolder { 
    /**
     * @param {EditSession} session
     * @param {Number} length
     * @param {import("../ace-internal").Ace.Point} pos
     * @param {any[]} others
     * @param {String} mainClass
     * @param {String} othersClass
     **/
    constructor(session, length, pos, others, mainClass, othersClass) {
        var _self = this;
        this.length = length;
        this.session = session;
        this.doc = session.getDocument();
        this.mainClass = mainClass;
        this.othersClass = othersClass;
        this.$onUpdate = this.onUpdate.bind(this);
        this.doc.on("change", this.$onUpdate, true);
        this.$others = others;

        this.$onCursorChange = function() {
            setTimeout(function() {
                _self.onCursorChange();
            });
        };

        this.$pos = pos;
        // Used for reset
        var undoStack = session.getUndoManager().$undoStack || session.getUndoManager()["$undostack"] || {length: -1};
        this.$undoStackDepth = undoStack.length;
        this.setup();

        session.selection.on("changeCursor", this.$onCursorChange);
    }

    /**
     * PlaceHolder.setup()
     *
     * TODO
     *
     **/
    setup() {
        var _self = this;
        var doc = this.doc;
        var session = this.session;
        
        this.selectionBefore = session.selection.toJSON();
        if (session.selection.inMultiSelectMode)
            session.selection.toSingleRange();

        this.pos = doc.createAnchor(this.$pos.row, this.$pos.column);
        var pos = this.pos;
        pos.$insertRight = true;
        pos.detach();
        pos.markerId = session.addMarker(new Range(pos.row, pos.column, pos.row, pos.column + this.length), this.mainClass, null, false);
        this.others = [];
        this.$others.forEach(function(other) {
            var anchor = doc.createAnchor(other.row, other.column);
            anchor.$insertRight = true;
            anchor.detach();
            _self.others.push(anchor);
        });
        session.setUndoSelect(false);
    }
    
    /**
     * PlaceHolder.showOtherMarkers()
     *
     * TODO
     *
     **/
    showOtherMarkers() {
        if (this.othersActive) return;
        var session = this.session;
        var _self = this;
        this.othersActive = true;
        this.others.forEach(function(anchor) {
            anchor.markerId = session.addMarker(new Range(anchor.row, anchor.column, anchor.row, anchor.column+_self.length), _self.othersClass, null, false);
        });
    }
    
    /**
     * PlaceHolder.hideOtherMarkers()
     *
     * Hides all over markers in the [[EditSession `EditSession`]] that are not the currently selected one.
     *
     **/
    hideOtherMarkers() {
        if (!this.othersActive) return;
        this.othersActive = false;
        for (var i = 0; i < this.others.length; i++) {
            this.session.removeMarker(this.others[i].markerId);
        }
    }

    /**
     * PlaceHolder@onUpdate(e)
     * 
     * Emitted when the place holder updates.
     * @param {import("../ace-internal").Ace.Delta} delta
     */
    onUpdate(delta) {
        if (this.$updating)
            return this.updateAnchors(delta);
            
        var range = delta;
        if (range.start.row !== range.end.row) return;
        if (range.start.row !== this.pos.row) return;
        this.$updating = true;
        var lengthDiff = delta.action === "insert" ? range.end.column - range.start.column : range.start.column - range.end.column;
        var inMainRange = range.start.column >= this.pos.column && range.start.column <= this.pos.column + this.length + 1;
        var distanceFromStart = range.start.column - this.pos.column;
        
        this.updateAnchors(delta);
        
        if (inMainRange)
            this.length += lengthDiff;

        if (inMainRange && !this.session.$fromUndo) {
            if (delta.action === 'insert') {
                for (var i = this.others.length - 1; i >= 0; i--) {
                    var otherPos = this.others[i];
                    var newPos = {row: otherPos.row, column: otherPos.column + distanceFromStart};
                    this.doc.insertMergedLines(newPos, delta.lines);
                }
            } else if (delta.action === 'remove') {
                for (var i = this.others.length - 1; i >= 0; i--) {
                    var otherPos = this.others[i];
                    var newPos = {row: otherPos.row, column: otherPos.column + distanceFromStart};
                    this.doc.remove(new Range(newPos.row, newPos.column, newPos.row, newPos.column - lengthDiff));
                }
            }
        }
        
        this.$updating = false;
        this.updateMarkers();
    }

    /**
     * @param {import("../ace-internal").Ace.Delta} delta
     */
    updateAnchors(delta) {
        this.pos.onChange(delta);
        for (var i = this.others.length; i--;)
            this.others[i].onChange(delta);
        this.updateMarkers();
    }
    
    updateMarkers() {
        if (this.$updating)
            return;
        var _self = this;
        var session = this.session;
        var updateMarker = function(pos, className) {
            session.removeMarker(pos.markerId);
            pos.markerId = session.addMarker(new Range(pos.row, pos.column, pos.row, pos.column+_self.length), className, null, false);
        };
        updateMarker(this.pos, this.mainClass);
        for (var i = this.others.length; i--;)
            updateMarker(this.others[i], this.othersClass);
    }


    /**
     * PlaceHolder@onCursorChange(e)
     * 
     * Emitted when the cursor changes.
     * @param {any} [event]
     */
    onCursorChange(event) {
        if (this.$updating || !this.session) return;
        var pos = this.session.selection.getCursor();
        if (pos.row === this.pos.row && pos.column >= this.pos.column && pos.column <= this.pos.column + this.length) {
            this.showOtherMarkers();
            this._emit("cursorEnter", event);
        } else {
            this.hideOtherMarkers();
            this._emit("cursorLeave", event);
        }
    }
    
    /**
     * PlaceHolder.detach()
     * 
     * TODO
     *
     **/    
    detach() {
        this.session.removeMarker(this.pos && this.pos.markerId);
        this.hideOtherMarkers();
        this.doc.off("change", this.$onUpdate);
        this.session.selection.off("changeCursor", this.$onCursorChange);
        this.session.setUndoSelect(true);
        this.session = null;
    }
    
    /**
     * PlaceHolder.cancel()
     * 
     * TODO
     *
     **/
    cancel() {
        if (this.$undoStackDepth === -1)
            return;
        var undoManager = this.session.getUndoManager();
        var undosRequired = (undoManager.$undoStack || undoManager["$undostack"]).length - this.$undoStackDepth;
        for (var i = 0; i < undosRequired; i++) {
            undoManager.undo(this.session, true);
        }
        if (this.selectionBefore)
            this.session.selection.fromJSON(this.selectionBefore);
    }
}

oop.implement(PlaceHolder.prototype, EventEmitter);

exports.PlaceHolder = PlaceHolder;
