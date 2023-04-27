"use strict";

var keys = require('../lib/keys');

class GutterKeyboardHandler {
    constructor(editor) {
        this.editor = editor;
        this.gutterLayer = editor.renderer.$gutterLayer;
        this.element = editor.renderer.$gutter;
        this.lines = editor.renderer.$gutterLayer.$lines;
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
            if (e.keyCode === keys['enter']){
                e.preventDefault();
                
                var row = this.editor.getCursorPosition().row;
                var index = this.$rowToRowIndex(row)
                this.activeRowIndex = this.$findNearestFoldWidgetAtIndex(index);

                if (this.activeRowIndex == null) {return;}

                this.$focusFoldWidget(this.activeRowIndex);
                return;
            }
        } else {
            // If focus is on a gutter icon, set focus to gutter on escape press.
            if (e.keyCode === keys['escape']){
                e.preventDefault();
                this.$blurFoldWidget(this.activeRowIndex);
                this.element.focus();
                return;
            }

            // Prevent tabbing when interacting with the gutter icons.
            if (e.keyCode === keys['tab']){
                e.preventDefault();
                return;
            }

            // Navigate up to next available fold widget.
            if (e.keyCode === keys['up']){
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
            if (e.keyCode === keys['down']){
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

            // When focus on foldwidget, fold lines on enter press.
            if (e.keyCode === keys['enter']){
                e.preventDefault();

                if (this.gutterLayer.session.foldWidgets[this.$rowIndexToRow(this.activeRowIndex)] === 'start') {
                    this.editor.session.onFoldWidgetClick(this.$rowIndexToRow(this.activeRowIndex), e);
                } else if (this.gutterLayer.session.foldWidgets[this.$rowIndexToRow(this.activeRowIndex)] === 'end') {
                    /* to do: deal with 'end' fold widgets correctly */
                }

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

    // Given an index, find the nearest index with a foldwidget
    $findNearestFoldWidgetAtIndex(index) {
        var foldWidgets = this.gutterLayer.session.foldWidgets;
        var row = this.$rowIndexToRow(index);

        // If fold widget exists at index, return that index.
        if (foldWidgets[row])
            return index;

        // else, find the nearest index which has a fold widget.
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

    // Blur the fold widget at given index.
    $blurFoldWidget(index) {
        var foldWidget = this.$getFoldWidget(index);

        foldWidget.setAttribute("tabindex", -1);
        foldWidget.classList.remove(this.editor.keyboardFocusClassName);
        foldWidget.setAttribute('role', '');
        foldWidget.setAttribute('aria-label', '');
        foldWidget.blur();
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