class AceInlineScreenReader {
    constructor(editor) {
        this.editor = editor;

        this.screenReaderDiv = document.createElement("div");
        this.screenReaderDiv.classList.add("ace_screenreader_only");
        this.screenReaderDiv.setAttribute("id", "ace-inline-screenreader");
        this.editor.container.appendChild(this.screenReaderDiv);
    }

    setScreenReaderContent(content) {
        // Remove all children of the div
        while (this.screenReaderDiv.firstChild) {
            this.screenReaderDiv.removeChild(this.screenReaderDiv.firstChild);
        }

        const codeElement = AceInlineScreenReader.createCodeBlock(content);
        this.screenReaderDiv.appendChild(codeElement);

        const popup = editor.completer.popup;

        var popupTextLayer = popup.renderer.$textLayer;
        var row = popup.getRow();
        var selectedPopupElement = popupTextLayer.element.childNodes[row - popupTextLayer.config.firstRow];
        selectedPopupElement.setAttribute("aria-describedby", "ace-inline-screenreader");
    }

    destroy() {
        // Remove all children of the div
        while (this.screenReaderDiv.firstChild) {
            this.screenReaderDiv.removeChild(this.screenReaderDiv.firstChild);
        }

        this.screenReaderDiv.remove();
    }

    static createCodeBlock(content) {
        const container = document.createElement("pre");
        this._lines = content.split(/\r\n|\r|\n/);

        for (let lineIndex = 0; lineIndex < this._lines.length; lineIndex++) {
            const lineElement = document.createElement("div");
            lineElement.className = "ace_line";
            
            const codeElement = document.createElement("code");
            const line = document.createTextNode(this._lines[lineIndex]);

            codeElement.appendChild(line);
            container.appendChild(codeElement);
        }

        return container;
    };
    
}

exports.AceInlineScreenReader = AceInlineScreenReader;