"use strict";

var keys = require('../lib/keys');
var GutterTooltip = require("../mouse/default_gutter_handler").GutterTooltip;

class GutterKeyboardHandler {
    constructor(editor) {
        this.editor = editor;
        this.gutterLayer = editor.renderer.$gutterLayer;
        this.element = editor.renderer.$gutter;
        this.lines = editor.renderer.$gutterLayer.$lines;

        this.activeRowIndex = 0;
        this.lane = "fold";

        this.annotationTooltip = new GutterTooltip(this.editor);
    }

    addListener() {
        this.element.addEventListener("keydown", this.$onGutterKeyDown.bind(this));
    }

    removeListener() {
        this.element.removeEventListener("keydown", this.$onGutterKeyDown.bind(this));
    }

    $onGutterKeyDown(e) {
        // if the tooltip is open, we only want to respond to commands to close it (like a modal)
        if (this.annotationTooltip.isOpen) {
            e.preventDefault();

            if (e.keyCode === keys['escape'])
                this.annotationTooltip.hide();
            return;
        }

        // If focus is on the gutter element, set focus to fold widget on enter press.
        if (e.target === this.element) {
            if (e.keyCode != keys["enter"]) {return;}
            e.preventDefault();

            // Scroll if the cursor is not currently within the viewport.
            var row = this.editor.getCursorPosition().row;

            if (!this.editor.isRowVisible(row))
                this.editor.scrollToLine(row, true, true);

            switch (this.lane) {
                case "fold":
                    // Wait until the scrolling is completed to check the viewport.
                    setTimeout(function() {
                        var index = this.$rowToRowIndex(row);

                        this.activeRowIndex = this.$findNearestFoldWidgetAtIndex(index);
                        if (this.activeRowIndex == null) {
                            this.activeRowIndex = this.$findNearestAnnotationAtIndex(index);
                            if (this.activeRowIndex == null) {return;}
                            this.lane = "annotation";
                            this.$focusAnnotation(this.activeRowIndex);
                            return;
                        }
                        this.$focusFoldWidget(this.activeRowIndex);
                    }.bind(this), 10);
                    break;
                
                case "annotation":
                    // Wait until the scrolling is completed to check the viewport.
                    setTimeout(function() {
                        var index = this.$rowToRowIndex(row);

                        this.activeRowIndex = this.$findNearestAnnotationAtIndex(index);
                        if (this.activeRowIndex == null) {
                            this.activeRowIndex = this.$findNearestFoldWidgetAtIndex(index);
                            if (this.activeRowIndex == null) {return;}
                            this.lane = "fold";
                            this.$focusFoldWidget(this.activeRowIndex);
                            return;
                        }
                        this.$focusAnnotation(this.activeRowIndex);
                    }.bind(this), 10);
                    break;
            }
            return;
        } 

        // Focus not on the gutter div:

        // Prevent tabbing when interacting with the gutter icons.
        if (e.keyCode === keys['tab']){
            e.preventDefault();
            return;
        } 

        // If focus is on a gutter icon, set focus to gutter on escape press.
        if (e.keyCode === keys['escape']) {
            e.preventDefault();

            switch (this.lane) {
                case "fold":
                    this.$blurFoldWidget(this.activeRowIndex);
                    this.element.focus();
                    break;

                case "annotation":
                    this.$blurAnnotation(this.activeRowIndex);
                    this.element.focus();
                    break;     
            }
            return;
        }

        if (e.keyCode === keys["up"]) {
            e.preventDefault();
            var index = this.activeRowIndex;

            switch (this.lane){
                case "fold":
                    while (index > 0){
                        index--;
        
                        if (this.$isFoldWidgetVisible(index)){
                            this.$blurFoldWidget(this.activeRowIndex);
                            this.activeRowIndex = index;
                            this.$focusFoldWidget(this.activeRowIndex);
                            break;
                        }
                    }
                    break;
                
                case "annotation":
                    while (index > 0){
                        index--;
        
                        if (this.$isAnnotationVisible(index)){
                            this.$blurAnnotation(this.activeRowIndex);
                            this.activeRowIndex = index;
                            this.$focusAnnotation(this.activeRowIndex);
                            break;
                        }
                    }
            }
            return;
        }

        if (e.keyCode === keys["down"]) {
            e.preventDefault();
            var index = this.activeRowIndex;

            switch (this.lane){
                case "fold":
                    while (index < this.lines.getLength() - 1){
                        index++;
        
                        if (this.$isFoldWidgetVisible(index)){
                            this.$blurFoldWidget(this.activeRowIndex);
                            this.activeRowIndex = index;
                            this.$focusFoldWidget(this.activeRowIndex);
                            break;
                        }
                    }
                    break;
                
                case "annotation":
                    while (index < this.lines.getLength() - 1){
                        index++;

                        if (this.$isAnnotationVisible(index)){
                            this.$blurAnnotation(this.activeRowIndex);
                            this.activeRowIndex = index;
                            this.$focusAnnotation(this.activeRowIndex);
                            break;
                        }
                    }
            }
            return;
        }

        if (e.keyCode === keys["left"]){
            e.preventDefault();
            
            if (this.lane === "annotation") {return;}
            var annotationIndex = this.$findNearestAnnotationAtIndex(this.activeRowIndex);
            if (annotationIndex == null) {return;}

            this.lane = "annotation";

            this.$blurFoldWidget(this.activeRowIndex);
            this.activeRowIndex = annotationIndex;
            this.$focusAnnotation(this.activeRowIndex);

            return;
        }

        if (e.keyCode === keys["right"]){
            e.preventDefault();
            
            if (this.lane === "fold") {return;}
            var foldWidgetIndex = this.$findNearestFoldWidgetAtIndex(this.activeRowIndex);
            if (foldWidgetIndex == null) {return;}

            this.lane = "fold";

            this.$blurAnnotation(this.activeRowIndex);
            this.activeRowIndex = foldWidgetIndex;
            this.$focusFoldWidget(this.activeRowIndex);
            
            return;
        }

        if (e.keyCode === keys["enter"] || e.keyCode === keys["space"]){
            e.preventDefault();

            switch (this.lane) {
                case "fold":
                    if (this.gutterLayer.session.foldWidgets[this.$rowIndexToRow(this.activeRowIndex)] === 'start') {
                        this.editor.session.onFoldWidgetClick(this.$rowIndexToRow(this.activeRowIndex), e);
                        break;
                    } else if (this.gutterLayer.session.foldWidgets[this.$rowIndexToRow(this.activeRowIndex)] === 'end') {
                        /* TO DO: deal with 'end' fold widgets */
                        break;
                    }
                    return; 
                
                case "annotation":
                    var gutterElement = this.lines.cells[this.activeRowIndex].element.querySelector("[class*=ace_icon]");
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

    $isFoldWidgetVisible(index) {
        return this.$getFoldWidget(index).style.display !== "none";
    }

    $isAnnotationVisible(index) {
        return this.$getAnnotation(index).style.display !== "none";
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
    $findNearestFoldWidgetAtIndex(index) {
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
    $findNearestAnnotationAtIndex(index) {
        // If fold widget exists at index, return index.
        if (this.$isAnnotationVisible(index))
            return index;

        // else, find the nearest index with fold widget within viewport.
        var i = 0;
        while (index - i > 0 || index + i < this.lines.getLength() - 1){
            i++;

            if (index - i >= 0 && this.$isAnnotationVisible(index - i))
                return index - i;

            if (index + i <= this.lines.getLength() - 1 && this.$isAnnotationVisible(index + i))
                return index + i;
        }

        // If there are no fold widgets within the viewport, return null.
        return null;
    }

    $focusFoldWidget(index) {
        if (index == null)
            return;

        var foldWidget = this.$getFoldWidget(index);

        foldWidget.setAttribute("tabindex", 0);
        foldWidget.classList.add(this.editor.keyboardFocusClassName);
        foldWidget.focus();
    }

    $focusAnnotation(index) {
        if (index == null)
            return;

        var annotation = this.$getAnnotation(index);

        annotation.setAttribute("tabindex", 0);
        annotation.classList.add(this.editor.keyboardFocusClassName);
        annotation.setAttribute("role", "button");
        annotation.focus();
    }

    $blurFoldWidget(index) {
        var foldWidget = this.$getFoldWidget(index);

        foldWidget.setAttribute("tabindex", -1);
        foldWidget.classList.remove(this.editor.keyboardFocusClassName);
        foldWidget.blur();
    }

    $blurAnnotation(index) {
        var annotation = this.$getAnnotation(index);

        annotation.setAttribute("tabindex", -1);
        annotation.classList.remove(this.editor.keyboardFocusClassName);
        annotation.setAttribute("role", "");
        annotation.blur();
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