"use strict";

var keys = require('../lib/keys');
var keyboardFocusClassName = "ace_keyboard-focus";

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

        foldWidget.setAttribute("tabindex", 0);
        foldWidget.classList.add(this.editor.keyboardFocusClassName);
        foldWidget.setAttribute('role', 'button');
        foldWidget.setAttribute('aria-label', `Fold code row ${row + 1}`);
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
        if (e.target === this.element) {
            if (e.keyCode === keys['enter']){
                e.stopPropagation();
                e.preventDefault();
                this.$focusFoldWidget(this.activeRowIndex);
                return;
            }
        } else {
            if (e.keyCode === keys['escape']){
                e.stopPropagation();
                e.preventDefault();
                this.$blurFoldWidget(this.activeRowIndex);
                this.element.focus();
                return;
            }

            if (e.keyCode === keys['tab']){
                e.stopPropagation();
                e.preventDefault();
                return;
            }

            if (e.keyCode === keys['up']){
                e.stopPropagation();
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

            if (e.keyCode === keys['down']){
                e.stopPropagation();
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

            if (e.keyCode === keys['enter']){
                e.stopPropagation();
                e.preventDefault();
                this.editor.session.onFoldWidgetClick(this.$rowIndexToRow(this.activeRowIndex), e);
                var foldWidget = this.$getFoldWidget(this.activeRowIndex);
                foldWidget.classList.add(keyboardFocusClassName);
                return;
            }
        }
    };
}

exports.GutterKeyboardHandler = GutterKeyboardHandler;