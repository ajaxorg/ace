"use strict";
/**
 * @typedef {import("./mouse_handler").MouseHandler} MouseHandler
 * @typedef {import("./mouse_event").MouseEvent} MouseEvent
 */
var useragent = require("../lib/useragent");

var DRAG_OFFSET = 0; // pixels
var SCROLL_COOLDOWN_T = 550; // milliseconds

class DefaultHandlers {
    /**
     * @param {MouseHandler} mouseHandler
     */
    constructor(mouseHandler) {
        mouseHandler.$clickSelection = null;

        var editor = mouseHandler.editor;
        editor.setDefaultHandler("mousedown", this.onMouseDown.bind(mouseHandler));
        editor.setDefaultHandler("dblclick", this.onDoubleClick.bind(mouseHandler));
        editor.setDefaultHandler("tripleclick", this.onTripleClick.bind(mouseHandler));
        editor.setDefaultHandler("quadclick", this.onQuadClick.bind(mouseHandler));
        editor.setDefaultHandler("mousewheel", this.onMouseWheel.bind(mouseHandler));

        var exports = ["select", "startSelect", "selectEnd", "selectAllEnd", "selectByWordsEnd",
            "selectByLinesEnd", "dragWait", "dragWaitEnd", "focusWait"];

        exports.forEach(function(x) {
            mouseHandler[x] = this[x];
        }, this);

        mouseHandler["selectByLines"] = this.extendSelectionBy.bind(mouseHandler, "getLineRange");
        mouseHandler["selectByWords"] = this.extendSelectionBy.bind(mouseHandler, "getWordRange");
    }

    /**
     * @param {MouseEvent} ev
     * @this {MouseHandler}
     */
    onMouseDown(ev) {
        var inSelection = ev.inSelection();
        var pos = ev.getDocumentPosition();
        this.mousedownEvent = ev;
        var editor = this.editor;

        var button = ev.getButton();
        if (button !== 0) {
            var selectionRange = editor.getSelectionRange();
            var selectionEmpty = selectionRange.isEmpty();
            if (selectionEmpty || button == 1)
                editor.selection.moveToPosition(pos);
            // 2: contextmenu, 1: linux paste
            if (button == 2) {
                editor.textInput.onContextMenu(ev.domEvent);
                if (!useragent.isMozilla)
                    ev.preventDefault();
            }
            // stopping event here breaks contextmenu on ff mac
            // not stoping breaks it on chrome mac
            return;
        }

        this.mousedownEvent.time = Date.now();
        // if this click caused the editor to be focused should not clear the
        // selection
        if (inSelection && !editor.isFocused()) {
            editor.focus();
            if (this.$focusTimeout && !this.$clickSelection && !editor.inMultiSelectMode) {
                this.setState("focusWait");
                this.captureMouse(ev);
                return;
            }
        }

        this.captureMouse(ev);
        this.startSelect(pos, ev.domEvent._clicks > 1);
        return ev.preventDefault();
    }

    /**
     * 
     * @param {import("../../ace-internal").Ace.Position} [pos]
     * @param {boolean} [waitForClickSelection]
     * @this {MouseHandler}
     */
    startSelect(pos, waitForClickSelection) {
        pos = pos || this.editor.renderer.screenToTextCoordinates(this.x, this.y);
        var editor = this.editor;
        if (!this.mousedownEvent) return;
        // allow double/triple click handlers to change selection
        if (this.mousedownEvent.getShiftKey())
            editor.selection.selectToPosition(pos);
        else if (!waitForClickSelection)
            editor.selection.moveToPosition(pos);
        if (!waitForClickSelection)
            this.select();
        editor.setStyle("ace_selecting");
        this.setState("select");
    }

    /**
     * @this {MouseHandler}
     */
    select() {
        var anchor, editor = this.editor;
        var cursor = editor.renderer.screenToTextCoordinates(this.x, this.y);
        if (this.$clickSelection) {
            var cmp = this.$clickSelection.comparePoint(cursor);

            if (cmp == -1) {
                anchor = this.$clickSelection.end;
            } else if (cmp == 1) {
                anchor = this.$clickSelection.start;
            } else {
                var orientedRange = calcRangeOrientation(this.$clickSelection, cursor);
                cursor = orientedRange.cursor;
                anchor = orientedRange.anchor;
            }
            editor.selection.setSelectionAnchor(anchor.row, anchor.column);
        }
        editor.selection.selectToPosition(cursor);
        editor.renderer.scrollCursorIntoView();
    }

    /**
     * @param {string | number} unitName
     * @this {MouseHandler}
     */
    extendSelectionBy(unitName) {
        var anchor, editor = this.editor;
        var cursor = editor.renderer.screenToTextCoordinates(this.x, this.y);
        var range = editor.selection[unitName](cursor.row, cursor.column);
        if (this.$clickSelection) {
            var cmpStart = this.$clickSelection.comparePoint(range.start);
            var cmpEnd = this.$clickSelection.comparePoint(range.end);

            if (cmpStart == -1 && cmpEnd <= 0) {
                anchor = this.$clickSelection.end;
                if (range.end.row != cursor.row || range.end.column != cursor.column)
                    cursor = range.start;
            } else if (cmpEnd == 1 && cmpStart >= 0) {
                anchor = this.$clickSelection.start;
                if (range.start.row != cursor.row || range.start.column != cursor.column)
                    cursor = range.end;
            } else if (cmpStart == -1 && cmpEnd == 1) {
                cursor = range.end;
                anchor = range.start;
            } else {
                var orientedRange = calcRangeOrientation(this.$clickSelection, cursor);
                cursor = orientedRange.cursor;
                anchor = orientedRange.anchor;
            }
            editor.selection.setSelectionAnchor(anchor.row, anchor.column);
        }
        editor.selection.selectToPosition(cursor);
        editor.renderer.scrollCursorIntoView();
    }

    /**
     * @this {MouseHandler}
     */
    selectByLinesEnd() {
        this.$clickSelection = null;
        this.editor.unsetStyle("ace_selecting");
    }

    /**
     * @this {MouseHandler}
     */
    focusWait() {
        var distance = calcDistance(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
        var time = Date.now();

        if (distance > DRAG_OFFSET || time - this.mousedownEvent.time > this.$focusTimeout)
            this.startSelect(this.mousedownEvent.getDocumentPosition());
    }
    
    /**
     * @param {MouseEvent} ev
     * @this {MouseHandler}
     */
    onDoubleClick(ev) {
        var pos = ev.getDocumentPosition();
        var editor = this.editor;
        var session = editor.session;

        var range = session.getBracketRange(pos);
        if (range) {
            if (range.isEmpty()) {
                range.start.column--;
                range.end.column++;
            }
            this.setState("select");
        } else {
            range = editor.selection.getWordRange(pos.row, pos.column);
            this.setState("selectByWords");
        }
        this.$clickSelection = range;
        this.select();
    }

    /**
     * @param {MouseEvent} ev
     * @this {MouseHandler}
     */
    onTripleClick(ev) {
        var pos = ev.getDocumentPosition();
        var editor = this.editor;

        this.setState("selectByLines");
        var range = editor.getSelectionRange();
        if (range.isMultiLine() && range.contains(pos.row, pos.column)) {
            this.$clickSelection = editor.selection.getLineRange(range.start.row);
            this.$clickSelection.end = editor.selection.getLineRange(range.end.row).end;
        } else {
            this.$clickSelection = editor.selection.getLineRange(pos.row);
        }
        this.select();
    }

    /**
     * @param {MouseEvent} ev
     * @this {MouseHandler}
     */
    onQuadClick(ev) {
        var editor = this.editor;

        editor.selectAll();
        this.$clickSelection = editor.getSelectionRange();
        this.setState("selectAll");
    }

    /**
     * @param {MouseEvent} ev
     * @this {MouseHandler}
     */
    onMouseWheel(ev) {
        if (ev.getAccelKey())
            return;

        // shift wheel to horizontal scroll
        if (ev.getShiftKey() && ev.wheelY && !ev.wheelX) {
            ev.wheelX = ev.wheelY;
            ev.wheelY = 0;
        }
        
        var editor = this.editor;
        
        if (!this.$lastScroll)
            this.$lastScroll = { t: 0, vx: 0, vy: 0, allowed: 0 };
        
        var prevScroll = this.$lastScroll;
        var t = ev.domEvent.timeStamp;
        var dt = t - prevScroll.t;
        var vx = dt ? ev.wheelX / dt : prevScroll.vx;
        var vy = dt ? ev.wheelY / dt : prevScroll.vy;
        
        // touchbar keeps sending scroll events after touchend, if we do not stop these events,
        // users can't scrol editor without scrolling the parent node
        if (dt < SCROLL_COOLDOWN_T) {
            vx = (vx + prevScroll.vx) / 2;
            vy = (vy + prevScroll.vy) / 2;
        }
        
        var direction = Math.abs(vx / vy);
        
        var canScroll = false;
        if (direction >= 1 && editor.renderer.isScrollableBy(ev.wheelX * ev.speed, 0))
            canScroll = true;
        if (direction <= 1 && editor.renderer.isScrollableBy(0, ev.wheelY * ev.speed))
            canScroll = true;
            
        if (canScroll) {
            prevScroll.allowed = t;
        } else if (t - prevScroll.allowed < SCROLL_COOLDOWN_T) {
            var isSlower = Math.abs(vx) <= 1.5 * Math.abs(prevScroll.vx)
                && Math.abs(vy) <= 1.5 * Math.abs(prevScroll.vy);
            if (isSlower) {
                canScroll = true;
                prevScroll.allowed = t;
            }
            else {
                prevScroll.allowed = 0;
            }
        }
        
        prevScroll.t = t;
        prevScroll.vx = vx;
        prevScroll.vy = vy;

        if (canScroll) {
            editor.renderer.scrollBy(ev.wheelX * ev.speed, ev.wheelY * ev.speed);
            return ev.stop();
        }
    }

}
DefaultHandlers.prototype.selectEnd = DefaultHandlers.prototype.selectByLinesEnd;
DefaultHandlers.prototype.selectAllEnd = DefaultHandlers.prototype.selectByLinesEnd;
DefaultHandlers.prototype.selectByWordsEnd = DefaultHandlers.prototype.selectByLinesEnd;

exports.DefaultHandlers = DefaultHandlers;

function calcDistance(ax, ay, bx, by) {
    return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
}

function calcRangeOrientation(range, cursor) {
    if (range.start.row == range.end.row)
        var cmp = 2 * cursor.column - range.start.column - range.end.column;
    else if (range.start.row == range.end.row - 1 && !range.start.column && !range.end.column)
        var cmp = cursor.column - 4;
    else
        var cmp = 2 * cursor.row - range.start.row - range.end.row;

    if (cmp < 0)
        return {cursor: range.start, anchor: range.end};
    else
        return {cursor: range.end, anchor: range.start};
}
