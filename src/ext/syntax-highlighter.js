"use strict";
const { Tokenizer } = require("../tokenizer_internal");
const isTextToken = require("../layer/text_util").isTextToken;

class SimpleTokenizer {
    /**
     * @param {string} content 
     * @param {Tokenizer} tokenizer 
     */
    constructor(content, tokenizer) {
        this._lines = content.split(/\r\n|\r|\n/);
        this._states = [];
        this._tokenizer = tokenizer;
    }   

    /**
     * @param {number} row 
     * @returns {import("../../ace").Ace.Token[]}
     */
    getTokens(row) {
        const line = this._lines[row];
        const previousState = this._states[row - 1];
        
        const data = this._tokenizer.getLineTokens(line, previousState, row);
        this._states[row] = data.state;
        return data.tokens;
    }

    /**
     * @returns {number} 
     */
    getLength() {
        return this._lines.length;
    }
}

/**
 * @param {import("ace-code/src/ext/syntax-highlighter").SyntaxHighlighterProps} props 
 * @returns {HTMLElement} element which syntax highlights the provided content with the provided highlighting rules 
 */
function highlight(props) {
    const container = document.createElement("pre");
    container.classList.add("ace_syntax_highlighter", "ace_show_gutter");
    if (props.className) {
        container.classList.add(props.className);
    }

    const tokenizer = new SimpleTokenizer(props.content, new Tokenizer(props.highlightRules.getRules()));

    for (let lineIndex = 0; lineIndex < tokenizer.getLength(); lineIndex++) {
        const lineElement = document.createElement("div");
        lineElement.className = "ace_line";
        
        const gutterElement = document.createElement("span");
        gutterElement.className = "ace_gutter ace_gutter_cell";
        lineElement.appendChild(gutterElement);

        const codeElement = document.createElement("code");
        const lineTokens = tokenizer.getTokens(lineIndex);
        lineTokens.forEach((token) => {
            const textNode = document.createTextNode(token.value);
            let tokenElement = textNode;
            if (!isTextToken(token.type)) {
                const span = document.createElement("span");
                span.className = "ace_" + token.type.replace(/\./g, " ace_");
                span.appendChild(textNode);
                tokenElement = span;
            }
            codeElement.appendChild(tokenElement);
        });
        
        lineElement.appendChild(codeElement);
        container.appendChild(lineElement);
    }

    return container;
};

module.exports = highlight;