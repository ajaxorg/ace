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
        this.lane = 'fold';

        this.annotationTooltip = new GutterTooltip(this.editor.container);
    }

    addListener() {
        this.element.addEventListener("keydown", this.$onGutterKeyDown.bind(this));
    }

    removeListener() {
        this.element.removeEventListener("keydown", this.$onGutterKeyDown.bind(this));
    }

    $onGutterKeyDown(e) {
        // If focus is on the gutter element, set focus to fold widget on enter press.
        if (e.target === this.element) {
            if (this.lane === 'fold' && e.keyCode === keys['enter']){
                e.preventDefault();
                
                // Scroll if the cursor is not currently within the viewport.
                var row = this.editor.getCursorPosition().row;
                this.editor.renderer.scrollToRow(row, true, true);
         
                // Wait until the scrolling is completed to check the viewport.
                setTimeout(function() {
                    var index = this.$rowToRowIndex(row);

                    this.activeRowIndex = this.$findNearestFoldWidgetAtIndex(index);
                    if (this.activeRowIndex == null) {return;}
                    this.$focusFoldWidget(this.activeRowIndex);
                }.bind(this), 10);
            }

            if (this.lane === 'annotation' && e.keyCode === keys['enter']){
                e.preventDefault();
                
                // Scroll if the cursor is not currently within the viewport.
                var row = this.editor.getCursorPosition().row;
                this.editor.renderer.scrollToRow(row, true, true);
         
                // Wait until the scrolling is completed to check the viewport.
                setTimeout(function() {
                    var index = this.$rowToRowIndex(row);

                    this.activeRowIndex = this.$findNearestAnnotationAtIndex(index);
                    if (this.activeRowIndex == null) {return;}
                    this.$focusAnnotation(this.activeRowIndex);
                }.bind(this), 10);
            }
        } else {
            // If focus is on a gutter icon, set focus to gutter on escape press.
            if (this.lane === 'fold' && e.keyCode === keys['escape']){
                e.preventDefault();
                this.$blurFoldWidget(this.activeRowIndex);
                this.element.focus();
                return;
            }

            if (this.lane === 'annotation' && e.keyCode === keys['escape']){
                e.preventDefault();
                this.$blurAnnotation(this.activeRowIndex);
                this.element.focus();
                return;
            }

            // Prevent tabbing when interacting with the gutter icons.
            if (e.keyCode === keys['tab']){
                e.preventDefault();
                return;
            }

            // Navigate up to next available fold widget.
            if (this.lane === 'fold' && e.keyCode === keys['up']){
                e.preventDefault();

                var index = this.activeRowIndex;

                while (index > 0){
                    index--;

                    if (this.gutterLayer.session.foldWidgets[this.$rowIndexToRow(index)]){
                        this.$blurFoldWidget(this.activeRowIndex);
                        this.activeRowIndex = index;
                        this.$focusFoldWidget(this.activeRowIndex);
                        return;
                    }
                }
                return;
            }

            // Navigate down to next available fold widget.
            if (this.lane === 'fold' && e.keyCode === keys['down']){
                e.preventDefault();
                
                var index = this.activeRowIndex;

                while (index < this.lines.getLength() - 1){
                    index++;

                    if (this.gutterLayer.session.foldWidgets[this.$rowIndexToRow(index)]){
                        this.$blurFoldWidget(this.activeRowIndex);
                        this.activeRowIndex = index;
                        this.$focusFoldWidget(this.activeRowIndex);
                        return;
                    }
                }
                return;
            }

            if (this.lane === 'annotation' && e.keyCode === keys['up']){
                e.preventDefault();

                var index = this.activeRowIndex;

                while (index > 0){
                    index--;

                    if (this.gutterLayer.$annotations[this.$rowIndexToRow(index)]){
                        this.$blurAnnotation(this.activeRowIndex);
                        this.activeRowIndex = index;
                        this.$focusAnnotation(this.activeRowIndex);
                        return;
                    }
                }
                return;
            }

            if (this.lane === 'annotation' && e.keyCode === keys['down']){
                e.preventDefault();
                
                var index = this.activeRowIndex;

                while (index < this.lines.getLength() - 1){
                    index++;
                    console.log(index)
                    console.log(this.gutterLayer.annotations)
                    if (this.gutterLayer.$annotations[this.$rowIndexToRow(index)]){
                        this.$blurAnnotation(this.activeRowIndex);
                        this.activeRowIndex = index;
                        this.$focusAnnotation(this.activeRowIndex);
                        return;
                    }
                }
                return;
            }

            if (e.keyCode === keys['left']){
                e.preventDefault();
                
                if (this.lane === 'annotation') {return;}
                this.lane = 'annotation';

                this.activeRowIndex = this.$findNearestAnnotationAtIndex(this.activeRowIndex);
                if (this.activeRowIndex == null) {return;}
                this.$focusAnnotation(this.activeRowIndex);

                return;
            }

            if (e.keyCode === keys['right']){
                e.preventDefault();
                
                if (this.lane === 'fold') {return;}
                this.lane = 'fold';

                this.activeRowIndex = this.$findNearestFoldWidgetAtIndex(this.activeRowIndex);
                if (this.activeRowIndex == null) {return;}
                this.$focusFoldWidget(this.activeRowIndex);
                
                return;
            }

            // When focus on foldwidget, fold lines on enter press.
            if (this.lane === 'fold' && e.keyCode === keys['enter']){
                e.preventDefault();

                if (this.gutterLayer.session.foldWidgets[this.$rowIndexToRow(this.activeRowIndex)] === 'start') {
                    this.editor.session.onFoldWidgetClick(this.$rowIndexToRow(this.activeRowIndex), e);
                    return;
                } else if (this.gutterLayer.session.foldWidgets[this.$rowIndexToRow(this.activeRowIndex)] === 'end') {
                    /* TO DO: deal with 'end' fold widgets */
                    return;
                }
                return;
            }

            if (this.lane === 'annotation' && e.keyCode === keys['enter']){
                e.preventDefault();
                this.annotationTooltip.showTooltip(this.editor, this.$rowIndexToRow(this.activeRowIndex));                
                return;
            }
        }
    }

    // Get the foldwidget element given an index.
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
        var foldWidgets = this.gutterLayer.session.foldWidgets;
        var row = this.$rowIndexToRow(index);

        // If fold widget exists at index, return index.
        if (foldWidgets[row])
            return index;

        // else, find the nearest index with fold widget within viewport.
        var i = 0;
        while (index - i > 0 || index + i < this.lines.getLength() - 1){
            i++;

            if (foldWidgets[row - i]){
                return index - i;
            }
            if (foldWidgets[row + i]){
                return index + i;
            }
        }

        // If there are no fold widgets within the viewport, return null.
        return null;
    }

    // Given an index, find the nearest index with an annotation.
    $findNearestAnnotationAtIndex(index) {
        var annotations = this.gutterLayer.$annotations;
        var row = this.$rowIndexToRow(index);

        console.log(annotations)

        // If fold widget exists at index, return index.
        if (annotations[row])
            return index;

        // else, find the nearest index with fold widget within viewport.
        var i = 0;
        while (index - i > 0 || index + i < this.lines.getLength() - 1){
            i++;

            if (annotations[row - i]){
                return index - i;
            }
            if (annotations[row + i]){
                return index + i;
            }
        }

        // If there are no fold widgets within the viewport, return null.
        return null;
    }

    // Focus the fold widget at given index.
    $focusFoldWidget(index) {
        // If there are no fold widgets within the current viewport, do nothing.
        if (index == null)
            return;

        var foldWidget = this.$getFoldWidget(index);
        var activeRow = this.$rowIndexToRow(index) + 1;

        foldWidget.setAttribute("tabindex", 0);
        foldWidget.classList.add(this.editor.keyboardFocusClassName);
        foldWidget.setAttribute('role', 'button');
        foldWidget.setAttribute('aria-label', `Fold code row ${activeRow}`);
        foldWidget.focus();
    }

    $focusAnnotation(index) {
        if (index == null)
            return;

        var annotation = this.$getAnnotation(index);
        var activeRow = this.$rowIndexToRow(index) + 1;

        annotation.setAttribute("tabindex", 0);
        annotation.classList.add(this.editor.keyboardFocusClassName);
        annotation.setAttribute('role', 'button');
        annotation.setAttribute('aria-label', `Read annotations row ${activeRow}`);
        annotation.focus();
    }

    // Blur the fold widget at given index.
    $blurFoldWidget(index) {
        var foldWidget = this.$getFoldWidget(index);

        foldWidget.setAttribute("tabindex", -1);
        foldWidget.classList.remove(this.editor.keyboardFocusClassName);
        foldWidget.setAttribute('role', '');
        foldWidget.setAttribute('aria-label', '');
        foldWidget.blur();
    }

    $blurAnnotation(index) {
        var annotation = this.$getAnnotation(index);

        annotation.setAttribute("tabindex", -1);
        annotation.classList.remove(this.editor.keyboardFocusClassName);
        annotation.setAttribute('role', '');
        annotation.setAttribute('aria-label', '');
        annotation.blur();
    }

    // Convert row index (viewport space) to row (document space).
    $rowIndexToRow(index) {
        var cell = this.lines.get(index);
        return cell.row;
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