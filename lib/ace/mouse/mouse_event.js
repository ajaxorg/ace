"use strict";

var event = require("../lib/event");
var useragent = require("../lib/useragent");

/*
 * Custom Ace mouse event
 */
var MouseEvent = exports.MouseEvent = function(domEvent, editor) {
    this.domEvent = domEvent;
    this.editor = editor;
    
    this.x = this.clientX = domEvent.clientX;
    this.y = this.clientY = domEvent.clientY;

    this.$pos = null;
    this.$inSelection = null;
    
    this.propagationStopped = false;
    this.defaultPrevented = false;
};

(function() {  
    
    this.stopPropagation = function() {
        event.stopPropagation(this.domEvent);
        this.propagationStopped = true;
    };
    
    this.preventDefault = function() {
        event.preventDefault(this.domEvent);
        this.defaultPrevented = true;
    };
    
    this.stop = function() {
        this.stopPropagation();
        this.preventDefault();
    };

    /*
     * Get the document position below the mouse cursor
     * 
     * @return {Object} 'row' and 'column' of the document position
     */
    this.getDocumentPosition = function() {
        if (this.$pos)
            return this.$pos;
        
        this.$pos = this.editor.renderer.screenToTextCoordinates(this.clientX, this.clientY);
        return this.$pos;
    };
    
    /*
     * Check if the mouse cursor is inside of the text selection
     * 
     * @return {Boolean} whether the mouse cursor is inside of the selection
     */
    this.inSelection = function() {
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
    };
    
    /*
     * Get the clicked mouse button
     * 
     * @return {Number} 0 for left button, 1 for middle button, 2 for right button
     */
    this.getButton = function() {
        return event.getButton(this.domEvent);
    };
    
    /*
     * @return {Boolean} whether the shift key was pressed when the event was emitted
     */
    this.getShiftKey = function() {
        return this.domEvent.shiftKey;
    };
    
    this.getAccelKey = useragent.isMac
        ? function() { return this.domEvent.metaKey; }
        : function() { return this.domEvent.ctrlKey; };
    
}).call(MouseEvent.prototype);
