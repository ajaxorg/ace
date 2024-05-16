"use strict";

var keys = require('../lib/keys');
var GutterTooltip = require("../mouse/default_gutter_handler").GutterTooltip;

class GutterKeyboardHandler {
    constructor(editor) {
        this.editor = editor;
        this.gutterLayer = editor.renderer.$gutterLayer;
        this.element = editor.renderer.$gutter;
        this.lines = editor.renderer.$gutterLayer.$lines;

        this.activeRowIndex = null;
        this.activeLane = null;

        this.annotationTooltip = new GutterTooltip(this.editor);
    }

    addListener() {
        this.element.addEventListener("keydown", this.$onGutterKeyDown.bind(this));
        this.element.addEventListener("focusout", this.$blurGutter.bind(this));
        this.editor.on("mousewheel", this.$blurGutter.bind(this));
    }

    removeListener() {
        this.element.removeEventListener("keydown", this.$onGutterKeyDown.bind(this));
        this.element.removeEventListener("focusout", this.$blurGutter.bind(this));
        this.editor.off("mousewheel", this.$blurGutter.bind(this));
    }

    $onGutterKeyDown(e) {
        // if the tooltip is open, we only want to respond to commands to close it (like a modal)
        if (this.annotationTooltip.isOpen) {
            e.preventDefault();

            if (e.keyCode === keys["escape"])
                this.annotationTooltip.hideTooltip();

            return;
        }

        // If focus is on the gutter element, set focus to nearest gutter icon on enter press.
        if (e.target === this.element) {
            if (e.keyCode != keys["enter"]) {return;}
            e.preventDefault();

            // Scroll if the cursor is not currently within the viewport.
            var row = this.editor.getCursorPosition().row;       
            if (!this.editor.isRowVisible(row))
                this.editor.scrollToLine(row, true, true);

            // After scrolling is completed, find the nearest gutter icon and set focus to it.
            setTimeout(
                /** @this {GutterKeyboardHandler} */
                function () {
                    var index = this.$rowToRowIndex(this.gutterLayer.$cursorCell.row);
                    var nearestFoldIndex = this.$findNearestFoldWidget(index);
                    var nearestAnnotationIndex = this.$findNearestAnnotation(index);

                    if (nearestFoldIndex === null && nearestAnnotationIndex === null) return;

                    if (nearestFoldIndex === null && nearestAnnotationIndex !== null) {
                        this.activeRowIndex = nearestAnnotationIndex;
                        this.activeLane = "annotation";
                        this.$focusAnnotation(this.activeRowIndex);
                        return;
                    }

                    if (nearestFoldIndex !== null && nearestAnnotationIndex === null) {
                        this.activeRowIndex = nearestFoldIndex;
                        this.activeLane = "fold";
                        this.$focusFoldWidget(this.activeRowIndex);
                        return;
                    }

                    if (Math.abs(nearestAnnotationIndex - index) < Math.abs(nearestFoldIndex - index)) {
                        this.activeRowIndex = nearestAnnotationIndex;
                        this.activeLane = "annotation";
                        this.$focusAnnotation(this.activeRowIndex);
                        return;
                    }
                    else {
                        this.activeRowIndex = nearestFoldIndex;
                        this.activeLane = "fold";
                        this.$focusFoldWidget(this.activeRowIndex);
                        return;
                    }
                }.bind(this), 10);
            return;
        } 

        // After here, foucs is on a gutter icon and we want to interact with them.
        this.$handleGutterKeyboardInteraction(e);

        // Wait until folding is completed and then signal gutterkeydown to the editor.
        setTimeout(function() {
            // Signal to the editor that a key is pressed inside the gutter.
            this.editor._signal("gutterkeydown", new GutterKeyboardEvent(e, this));
        }.bind(this), 10);
    }

    $handleGutterKeyboardInteraction(e) {
        // Prevent tabbing when interacting with the gutter icons.
        if (e.keyCode === keys["tab"]){
            e.preventDefault();
            return;
        } 

        // If focus is on a gutter icon, set focus to gutter on escape press.
        if (e.keyCode === keys["escape"]) {
            e.preventDefault();
            this.$blurGutter();
            this.element.focus();
            this.lane = null;
            return;
        }

        if (e.keyCode === keys["up"]) {
            e.preventDefault();
  
            switch (this.activeLane){
                case "fold":
                    this.$moveFoldWidgetUp();
                    break;
                
                case "annotation":
                    this.$moveAnnotationUp();
                    break;
            }
            return;
        }

        if (e.keyCode === keys["down"]) {
            e.preventDefault();

            switch (this.activeLane){
                case "fold":
                    this.$moveFoldWidgetDown();
                    break;
                
                case "annotation":
                    this.$moveAnnotationDown();
                    break;
            }
            return;
        }

        // Try to switch from fold widgets to annotations.
        if (e.keyCode === keys["left"]){
            e.preventDefault();
            this.$switchLane("annotation");
            return;
        }

        // Try to switch from annotations to fold widgets.
        if (e.keyCode === keys["right"]){
            e.preventDefault();
            this.$switchLane("fold");
            return;
        }

        if (e.keyCode === keys["enter"] || e.keyCode === keys["space"]){
            e.preventDefault();

            switch (this.activeLane) {
                case "fold":
                    if (this.gutterLayer.session.foldWidgets[this.$rowIndexToRow(this.activeRowIndex)] === 'start') {
                        var rowFoldingWidget = this.$rowIndexToRow(this.activeRowIndex);
                        this.editor.session.onFoldWidgetClick(this.$rowIndexToRow(this.activeRowIndex), e);

                        // After folding, check that the right fold widget is still in focus.
                        // If not (e.g. folding close to bottom of doc), put right widget in focus.
                        setTimeout(
                            /** @this {GutterKeyboardHandler} */
                            function () {
                                if (this.$rowIndexToRow(this.activeRowIndex) !== rowFoldingWidget) {
                                    this.$blurFoldWidget(this.activeRowIndex);
                                    this.activeRowIndex = this.$rowToRowIndex(rowFoldingWidget);
                                    this.$focusFoldWidget(this.activeRowIndex);
                                }
                        }.bind(this), 10);

                        break;
                    } else if (this.gutterLayer.session.foldWidgets[this.$rowIndexToRow(this.activeRowIndex)] === 'end') {
                        /* TO DO: deal with 'end' fold widgets */
                        break;
                    }
                    return; 
                
                case "annotation":
                    var gutterElement = this.lines.cells[this.activeRowIndex].element.childNodes[2];
                    var rect = gutterElement.getBoundingClientRect();
                    var style = this.annotationTooltip.getElement().style;
                    style.left = rect.right + "px";
                    style.top = rect.bottom + "px";
                    this.annotationTooltip.showTooltip(this.$rowIndexToRow(this.activeRowIndex));                
                    break;
            }
            return;
        }   
    }

    $blurGutter() {
        if (this.activeRowIndex !== null){
            switch (this.activeLane){
                case "fold":
                    this.$blurFoldWidget(this.activeRowIndex);
                    break;

                case "annotation":
                    this.$blurAnnotation(this.activeRowIndex);
                    break;
            }
        }

        if (this.annotationTooltip.isOpen)
            this.annotationTooltip.hideTooltip();

        return;
    }

    $isFoldWidgetVisible(index) {
        var isRowFullyVisible = this.editor.isRowFullyVisible(this.$rowIndexToRow(index));
        var isIconVisible = this.$getFoldWidget(index).style.display !== "none";
        return isRowFullyVisible && isIconVisible;
    }

    $isAnnotationVisible(index) {
        var isRowFullyVisible = this.editor.isRowFullyVisible(this.$rowIndexToRow(index));
        var isIconVisible = this.$getAnnotation(index).style.display !== "none";
        return isRowFullyVisible && isIconVisible;
    }

    $getFoldWidget(index) {
        var cell = this.lines.get(index);
        var element = cell.element;
        return element.childNodes[1];
    }

    $getAnnotation(index) {
        var cell = this.lines.get(index);
        var element = cell.element;
        return element.childNodes[2];
    }

    // Given an index, find the nearest index with a foldwidget
    $findNearestFoldWidget(index) {
        // If fold widget exists at index, return index.
        if (this.$isFoldWidgetVisible(index))
            return index;

        // else, find the nearest index with fold widget within viewport.
        var i = 0;
        while (index - i > 0 || index + i < this.lines.getLength() - 1){
            i++;

            if (index - i >= 0 && this.$isFoldWidgetVisible(index - i))
                return index - i;

            if (index + i <= this.lines.getLength() - 1 && this.$isFoldWidgetVisible(index + i))
                return index + i;
        }

        // If there are no fold widgets within the viewport, return null.
        return null;
    }

    // Given an index, find the nearest index with an annotation.
    $findNearestAnnotation(index) {
        // If annotation exists at index, return index.
        if (this.$isAnnotationVisible(index))
            return index;

        // else, find the nearest index with annotation within viewport.
        var i = 0;
        while (index - i > 0 || index + i < this.lines.getLength() - 1){
            i++;

            if (index - i >= 0 && this.$isAnnotationVisible(index - i))
                return index - i;

            if (index + i <= this.lines.getLength() - 1 && this.$isAnnotationVisible(index + i))
                return index + i;
        }

        // If there are no annotations within the viewport, return null.
        return null;
    }

    $focusFoldWidget(index) {
        if (index == null)
            return;

        var foldWidget = this.$getFoldWidget(index);

        foldWidget.classList.add(this.editor.renderer.keyboardFocusClassName);
        foldWidget.focus();
    }

    $focusAnnotation(index) {
        if (index == null)
            return;

        var annotation = this.$getAnnotation(index);

        annotation.classList.add(this.editor.renderer.keyboardFocusClassName);
        annotation.focus();
    }

    $blurFoldWidget(index) {
        var foldWidget = this.$getFoldWidget(index);

        foldWidget.classList.remove(this.editor.renderer.keyboardFocusClassName);
        foldWidget.blur();
    }

    $blurAnnotation(index) {
        var annotation = this.$getAnnotation(index);

        annotation.classList.remove(this.editor.renderer.keyboardFocusClassName);
        annotation.blur();
    }

    $moveFoldWidgetUp() {
        var index = this.activeRowIndex;

        while (index > 0){
            index--;

            if (this.$isFoldWidgetVisible(index)){
                this.$blurFoldWidget(this.activeRowIndex);
                this.activeRowIndex = index;
                this.$focusFoldWidget(this.activeRowIndex);
                return;
            }
        }
        return;
    }

    $moveFoldWidgetDown() {
        var index = this.activeRowIndex;

        while (index < this.lines.getLength() - 1){
            index++;

            if (this.$isFoldWidgetVisible(index)){
                this.$blurFoldWidget(this.activeRowIndex);
                this.activeRowIndex = index;
                this.$focusFoldWidget(this.activeRowIndex);
                return;
            }
        }
        return;
    }

    $moveAnnotationUp() {
        var index = this.activeRowIndex;

        while (index > 0){
            index--;

            if (this.$isAnnotationVisible(index)){
                this.$blurAnnotation(this.activeRowIndex);
                this.activeRowIndex = index;
                this.$focusAnnotation(this.activeRowIndex);
                return;
            }
        }
        return;
    }

    $moveAnnotationDown() {
        var index = this.activeRowIndex;

        while (index < this.lines.getLength() - 1){
            index++;

            if (this.$isAnnotationVisible(index)){
                this.$blurAnnotation(this.activeRowIndex);
                this.activeRowIndex = index;
                this.$focusAnnotation(this.activeRowIndex);
                return;
            }
        }
        return;
    }

    $switchLane(desinationLane){
        switch (desinationLane) {
            case "annotation":
                if (this.activeLane === "annotation") {break;}
                var annotationIndex = this.$findNearestAnnotation(this.activeRowIndex);
                if (annotationIndex == null) {break;}

                this.activeLane = "annotation";

                this.$blurFoldWidget(this.activeRowIndex);
                this.activeRowIndex = annotationIndex;
                this.$focusAnnotation(this.activeRowIndex);

                break;

            case "fold": 
                if (this.activeLane === "fold") {break;}
                var foldWidgetIndex = this.$findNearestFoldWidget(this.activeRowIndex);
                if (foldWidgetIndex == null) {break;}

                this.activeLane = "fold";

                this.$blurAnnotation(this.activeRowIndex);
                this.activeRowIndex = foldWidgetIndex;
                this.$focusFoldWidget(this.activeRowIndex);
                
                break;
        }
        return;
    }

    // Convert row index (viewport space) to row (document space).
    $rowIndexToRow(index) {
        var cell = this.lines.get(index);
        if (cell)
            return cell.row;

        return null;
    }

    // Convert row (document space) to row index (viewport space).
    $rowToRowIndex(row) {
        for (var i = 0; i < this.lines.getLength(); i++){
            var cell = this.lines.get(i);
            if (cell.row == row)
                return i;
        }

        return null;
    }
}

exports.GutterKeyboardHandler = GutterKeyboardHandler;

/*
 * Custom Ace gutter keyboard event
 */
class GutterKeyboardEvent {
    constructor(domEvent, gutterKeyboardHandler) {
        this.gutterKeyboardHandler = gutterKeyboardHandler;
        this.domEvent = domEvent;
    }

    /**
     * Returns the key that was presssed.
     * 
     * @return {string} the key that was pressed.
     */
    getKey() {
        return keys.keyCodeToString(this.domEvent.keyCode);
    }

    /**
     * Returns the row in the gutter that was focused after the keyboard event was handled.
     * 
     * @return {number} the key that was pressed.
     */
    getRow() {
        return this.gutterKeyboardHandler.$rowIndexToRow(this.gutterKeyboardHandler.activeRowIndex);
    }

    /**
     * Returns whether focus is on the annotation lane after the keyboard event was handled.
     * 
     * @return {boolean} true if focus was on the annotation lane after the keyboard event.
     */
    isInAnnotationLane() {
        return this.gutterKeyboardHandler.activeLane === "annotation";
    }

    /**
     * Returns whether focus is on the fold lane after the keyboard event was handled.
     * 
     * @return {boolean} true if focus was on the fold lane after the keyboard event.
     */
    isInFoldLane() {
        return this.gutterKeyboardHandler.activeLane === "fold";
    }
}

exports.GutterKeyboardEvent = GutterKeyboardEvent;
