"use strict";

var keys = require('../lib/keys');

class GutterKeyboardHandler {
    constructor(editor) {
        this.editor = editor;
        this.gutterLayer = editor.renderer.$gutterLayer;
        this.element = editor.renderer.$gutter;
        this.lines = editor.renderer.$gutterLayer.$lines;

        this.activeRowIndex = 0;
    }

    addListener() {
        this.element.addEventListener("keydown", this.$onGutterKeyDown.bind(this));
    }

    removeListener() {
        this.element.removeEventListener("keydown", this.$onGutterKeyDown.bind(this));
    }

    $getFoldWidget(index) {
        var cell = this.lines.get(index);
        var element = cell.element;
        return element.childNodes[1];
    }

    $focusFoldWidget(index) {
        var foldWidget = this.$getFoldWidget(index);
        var activeRow = this.$rowIndexToRow(this.activeRowIndex) + 1;

        foldWidget.setAttribute("tabindex", 0);
        foldWidget.classList.add(this.editor.keyboardFocusClassName);
        foldWidget.setAttribute('role', 'button');
        foldWidget.setAttribute('aria-label', `Fold code row ${activeRow}`);
        foldWidget.focus();
    }

    $blurFoldWidget(index) {
        var foldWidget = this.$getFoldWidget(index);

        foldWidget.setAttribute("tabindex", -1);
        foldWidget.classList.remove(this.editor.keyboardFocusClassName);
        foldWidget.setAttribute('role', '');
        foldWidget.setAttribute('aria-label', '');
        foldWidget.blur();
    }

    $rowIndexToRow(index) {
        var cell = this.lines.get(index);
        return cell.row;
    }

    $onGutterKeyDown(e) {
        // If focus is on the gutter element, set focus to fold widget on enter press.
        if (e.target === this.element) {
            if (e.keyCode === keys['enter']){
                e.preventDefault();
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

                    if (this.gutterLayer.session.foldWidgets[this.$rowIndexToRow(index)] === 'start'){
                        this.$blurFoldWidget(this.activeRowIndex);
                        this.$focusFoldWidget(index);
                        this.activeRowIndex = index;
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

                    if (this.gutterLayer.session.foldWidgets[this.$rowIndexToRow(index)] === 'start'){
                        this.$blurFoldWidget(this.activeRowIndex);
                        this.$focusFoldWidget(index);
                        this.activeRowIndex = index;
                        return;
                    }
                }
                return;
            }

            // When focus on foldwidget, fold lines on enter press.
            if (e.keyCode === keys['enter']){
                e.preventDefault();
                this.editor.session.onFoldWidgetClick(this.$rowIndexToRow(this.activeRowIndex), e);
                return;
            }
        }
    };
}

exports.GutterKeyboardHandler = GutterKeyboardHandler;