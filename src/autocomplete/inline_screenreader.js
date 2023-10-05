class AceInlineScreenReader {
    constructor(editor) {
        this.editor = editor;

        this.screenReaderDiv = document.createElement("div");
        this.screenReaderDiv.classList.add("ace_screenreader_only");
        this.editor.container.appendChild(this.screenReaderDiv);
    }

    setScreenReaderContent(content) {
        // Path for when inline preview is used with 'normal' completion popup.
        if (!this.popup && this.editor.completer && this.editor.completer.popup) {
            this.popup = this.editor.completer.popup;

            this.popup.renderer.on("afterRender", function() {
                let row = this.popup.getRow();
                let t = this.popup.renderer.$textLayer;
                let selected = t.element.childNodes[row - t.config.firstRow];
                if (selected) {
                    let idString = "";
                    for (let lineIndex = 0; lineIndex < this._lines.length; lineIndex++) {
                        idString += `ace-inline-screenreader-line-${lineIndex} `
                    }
                    selected.setAttribute("aria-details", idString);      
                };
            }.bind(this));
        };

        // TODO: Path for when special inline completion popup is used.

        // Remove all children of the div
        while (this.screenReaderDiv.firstChild) {
            this.screenReaderDiv.removeChild(this.screenReaderDiv.firstChild);
        }
        this._lines = content.split(/\r\n|\r|\n/);
        const codeElement = this.createCodeBlock();
        this.screenReaderDiv.appendChild(codeElement);
    }

    destroy() {
        // Remove all children of the div
        while (this.screenReaderDiv.firstChild) {
            this.screenReaderDiv.removeChild(this.screenReaderDiv.firstChild);
        }

        this.screenReaderDiv.remove();
    }

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
    };
    
}

exports.AceInlineScreenReader = AceInlineScreenReader;