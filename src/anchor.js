"use strict";
/**
 * @typedef {import("./document").Document} Document
 */
var oop = require("./lib/oop");
var EventEmitter = require("./lib/event_emitter").EventEmitter;

/**
 * Defines a floating pointer in the document. Whenever text is inserted or deleted before the cursor, the position of the anchor is updated.
 **/
class Anchor {
    /**
     * Creates a new `Anchor` and associates it with a document.
     *
     * @param {Document} doc The document to associate with the anchor
     * @param {Number|import("../ace-internal").Ace.Point} row The starting row position
     * @param {Number} [column] The starting column position
     **/
    constructor(doc, row, column) {
        this.$onChange = this.onChange.bind(this);
        this.attach(doc);

        if (typeof row != "number")
            this.setPosition(row.row, row.column);
        else
            this.setPosition(row, column);
    }
    
    /**
     * Returns an object identifying the `row` and `column` position of the current anchor.
     * @returns {import("../ace-internal").Ace.Point}
     **/
    getPosition() {
        return this.$clipPositionToDocument(this.row, this.column);
    }

    /**
     *
     * Returns the current document.
     * @returns {Document}
     **/
    getDocument() {
        return this.document;
    }
    
    /**
     * Internal function called when `"change"` event fired.
     * @param {import("../ace-internal").Ace.Delta} delta
     */
    onChange(delta) {
        if (delta.start.row == delta.end.row && delta.start.row != this.row)
            return;

        if (delta.start.row > this.row)
            return;
            
        var point = $getTransformedPoint(delta, {row: this.row, column: this.column}, this.$insertRight);
        this.setPosition(point.row, point.column, true);
    }

    /**
     * Sets the anchor position to the specified row and column. If `noClip` is `true`, the position is not clipped.
     * @param {Number} row The row index to move the anchor to
     * @param {Number} column The column index to move the anchor to
     * @param {Boolean} [noClip] Identifies if you want the position to be clipped
     **/
    setPosition(row, column, noClip) {
        var pos;
        if (noClip) {
            pos = {
                row: row,
                column: column
            };
        } else {
            pos = this.$clipPositionToDocument(row, column);
        }

        if (this.row == pos.row && this.column == pos.column)
            return;

        var old = {
            row: this.row,
            column: this.column
        };

        this.row = pos.row;
        this.column = pos.column;
        this._signal("change", {
            old: old,
            value: pos
        });
    }

    /**
     * When called, the `"change"` event listener is removed.
     *
     **/
    detach() {
        this.document.off("change", this.$onChange);
    }

    /**
     * When called, the `"change"` event listener is appended.
     * @param {Document} doc The document to associate with
     *
     **/
    attach(doc) {
        /**@type{Document}*/
        this.document = doc || this.document;
        this.document.on("change", this.$onChange);
    }

    /**
     * Clips the anchor position to the specified row and column.
     * @param {Number} row The row index to clip the anchor to
     * @param {Number} column The column index to clip the anchor to
     * @returns {import("../ace-internal").Ace.Point}
     *
     **/
    $clipPositionToDocument(row, column) {
        var pos = {};

        if (row >= this.document.getLength()) {
            pos.row = Math.max(0, this.document.getLength() - 1);
            pos.column = this.document.getLine(pos.row).length;
        }
        else if (row < 0) {
            pos.row = 0;
            pos.column = 0;
        }
        else {
            pos.row = row;
            pos.column = Math.min(this.document.getLine(pos.row).length, Math.max(0, column));
        }

        if (column < 0)
            pos.column = 0;

        return pos;
    }
}

/**
 * experimental: allows anchor to stick to the next on the left
 */
Anchor.prototype.$insertRight = false;

oop.implement(Anchor.prototype, EventEmitter);

function $pointsInOrder(point1, point2, equalPointsInOrder) {
    var bColIsAfter = equalPointsInOrder ? point1.column <= point2.column : point1.column < point2.column;
    return (point1.row < point2.row) || (point1.row == point2.row && bColIsAfter);
}

function $getTransformedPoint(delta, point, moveIfEqual) {
    // Get delta info.
    var deltaIsInsert = delta.action == "insert";
    var deltaRowShift = (deltaIsInsert ? 1 : -1) * (delta.end.row    - delta.start.row);
    var deltaColShift = (deltaIsInsert ? 1 : -1) * (delta.end.column - delta.start.column);
    var deltaStart = delta.start;
    var deltaEnd = deltaIsInsert ? deltaStart : delta.end; // Collapse insert range.

    // DELTA AFTER POINT: No change needed.
    if ($pointsInOrder(point, deltaStart, moveIfEqual)) {
        return {
            row: point.row,
            column: point.column
        };
    }

    // DELTA BEFORE POINT: Move point by delta shift.
    if ($pointsInOrder(deltaEnd, point, !moveIfEqual)) {
        return {
            row: point.row + deltaRowShift,
            column: point.column + (point.row == deltaEnd.row ? deltaColShift : 0)
        };
    }

    // DELTA ENVELOPS POINT (delete only): Move point to delta start.
    // TODO warn if delta.action != "remove" ?

    return {
        row: deltaStart.row,
        column: deltaStart.column
    };
}

exports.Anchor = Anchor;
