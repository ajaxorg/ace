"use strict";

/**
 * This object is used to communicate inline code completions rendered into an editor with ghost text to screen reader users.
 */
class AceInlineScreenReader {
    /**
     * Creates the off-screen div in which the ghost text content in redered and which the screen reader reads.
     * @param {import("../editor").Editor} editor
     */
    constructor(editor) {
        this.editor = editor;

        this.screenReaderDiv = document.createElement("div");
        this.screenReaderDiv.classList.add("ace_screenreader-only");
        this.editor.container.appendChild(this.screenReaderDiv);
    }

    /**
     * Set the ghost text content to the screen reader div
     * @param {string} content
     */
    setScreenReaderContent(content) {
        // Path for when inline preview is used with 'normal' completion popup.
        if (!this.popup && this.editor.completer && /**@type{import("../autocomplete").Autocomplete}*/(this.editor.completer).popup) {
            this.popup = /**@type{import("../autocomplete").Autocomplete}*/(this.editor.completer).popup;

            this.popup.renderer.on("afterRender", function() {
                let row = this.popup.getRow();
                let t = this.popup.renderer.$textLayer;
                let selected = t.element.childNodes[row - t.config.firstRow];
                if (selected) {
                    let idString = "doc-tooltip ";
                    for (let lineIndex = 0; lineIndex < this._lines.length; lineIndex++) {
                        idString += `ace-inline-screenreader-line-${lineIndex} `;
                    }
                    selected.setAttribute("aria-describedby", idString);      
                }
            }.bind(this));
        }

        // TODO: Path for when special inline completion popup is used.
        // https://github.com/ajaxorg/ace/issues/5348

        // Remove all children of the div
        while (this.screenReaderDiv.firstChild) {
            this.screenReaderDiv.removeChild(this.screenReaderDiv.firstChild);
        }
        this._lines = content.split(/\r\n|\r|\n/);
        const codeElement = this.createCodeBlock();
        this.screenReaderDiv.appendChild(codeElement);
    }

    destroy() {
        this.screenReaderDiv.remove();
    }

    /**
     * Take this._lines, render it as <code> blocks and add those to the screen reader div.
     */
    createCodeBlock() {
        const container = document.createElement("pre");
        container.setAttribute("id", "ace-inline-screenreader");

        for (let lineIndex = 0; lineIndex < this._lines.length; lineIndex++) {
            const codeElement = document.createElement("code");
            codeElement.setAttribute("id", `ace-inline-screenreader-line-${lineIndex}`);
            const line = document.createTextNode(this._lines[lineIndex]);

            codeElement.appendChild(line);
            container.appendChild(codeElement);
        }

        return container;
    }
}

exports.AceInlineScreenReader = AceInlineScreenReader;
