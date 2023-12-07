"use strict";

var event = require("../lib/event");
var useragent = require("../lib/useragent");

/*
 * Custom Ace mouse event
 */
class MouseEvent {
    constructor(domEvent, editor) {
        /** @type {number} */this.speed;
        /** @type {number} */this.wheelX;
        /** @type {number} */this.wheelY;
        this.domEvent = domEvent;
        this.editor = editor;

        this.x = this.clientX = domEvent.clientX;
        this.y = this.clientY = domEvent.clientY;

        this.$pos = null;
        this.$inSelection = null;

        this.propagationStopped = false;
        this.defaultPrevented = false;
    }
    
    stopPropagation() {
        event.stopPropagation(this.domEvent);
        this.propagationStopped = true;
    }
    
    preventDefault() {
        event.preventDefault(this.domEvent);
        this.defaultPrevented = true;
    }
    
    stop() {
        this.stopPropagation();
        this.preventDefault();
    }

    /**
     * Get the document position below the mouse cursor
     * 
     * @return {Object} 'row' and 'column' of the document position
     */
    getDocumentPosition() {
        if (this.$pos)
            return this.$pos;
        
        this.$pos = this.editor.renderer.screenToTextCoordinates(this.clientX, this.clientY);
        return this.$pos;
    }

    /**
     * Get the relative position within the gutter.
     * 
     * @return {Number} 'row' within the gutter. 
     */
    getGutterRow() {
        var documentRow = this.getDocumentPosition().row;
        var screenRow = this.editor.session.documentToScreenRow(documentRow, 0);
        var screenTopRow = this.editor.session.documentToScreenRow(this.editor.renderer.$gutterLayer.$lines.get(0).row, 0);
        return screenRow - screenTopRow;
    }
    
    /**
     * Check if the mouse cursor is inside of the text selection
     * 
     * @return {Boolean} whether the mouse cursor is inside of the selection
     */
    inSelection() {
        if (this.$inSelection !== null)
            return this.$inSelection;
            
        var editor = this.editor;
        

        var selectionRange = editor.getSelectionRange();
        if (selectionRange.isEmpty())
            this.$inSelection = false;
        else {
            var pos = this.getDocumentPosition();
            this.$inSelection = selectionRange.contains(pos.row, pos.column);
        }

        return this.$inSelection;
    }
    
    /**
     * Get the clicked mouse button
     * 
     * @return {Number} 0 for left button, 1 for middle button, 2 for right button
     */
    getButton() {
        return event.getButton(this.domEvent);
    }
    
    /**
     * @return {Boolean} whether the shift key was pressed when the event was emitted
     */
    getShiftKey() {
        return this.domEvent.shiftKey;
    }

    getAccelKey() {
        return useragent.isMac ? this.domEvent.metaKey : this.domEvent.ctrlKey;
    }
}

exports.MouseEvent = MouseEvent;
