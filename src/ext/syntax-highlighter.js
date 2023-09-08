// Version 1 using EditSession + TextLayer 156kB

// "use strict";
// const EditSession = require("../edit_session").EditSession;
// const TextLayer = require("../layer/text").Text;

// const styling = require("./static-css");
// const dom = require("../lib/dom");
// dom.useStrictCSP(true);
// dom.importCssString(styling);

// /**
//  * TODO document the function
//  */
//  function highlight(props) {
//     const session = new EditSession(props.input, props.mode);
//     session.setUseWorker(false);
//     const textLayer = new TextLayer(document.createElement("div"));
//     textLayer.setSession(session);

//     const container = document.createElement("div");
//     container.classList.add("ace_static_highlight", "ace_show_gutter", props.className);
    
//     for (let lineIndex = 0; lineIndex < session.getLength(); lineIndex++) {
//         const lineElement = document.createElement("div");
//         lineElement.className = "ace_line";
        
//         const gutterElement = document.createElement("span");
//         gutterElement.className = "ace_gutter ace_gutter_cell";
//         lineElement.appendChild(gutterElement);

//         textLayer.$renderLine(lineElement, lineIndex, false);
//         container.appendChild(lineElement);
//     }

//     return container;
// };

// ----------------------------------------------------------------------------
// Version 2 without EditSession 80kB


// "use strict";
// const TextLayer = require("../layer/text").Text;
// const BackgroundTokenizer = require("../background_tokenizer").BackgroundTokenizer;
// const Document = require("../document").Document;

// const styling = require("./static-css");
// const dom = require("../lib/dom");
// dom.useStrictCSP(true);
// dom.importCssString(styling);

// /**
//  * TODO document the function
//  */
//  function highlight(props) {
//     const backgroundTokenizer = new BackgroundTokenizer(props.mode.getTokenizer(), {});
//     const aceDocument = new Document(props.input);
//     backgroundTokenizer.setDocument(aceDocument);

//     const textLayer = new TextLayer(document.createElement("div"));
//     textLayer.setDisplayIndentGuides(false);
//     textLayer.setSession({
//         getUseWrapMode: () => false,
//         getRowSplitData: () => undefined, 
//         getTabSize: () => 4,
//         getTokens: (row) => backgroundTokenizer.getTokens(row),
//     });
    
//     const container = document.createElement("div");
//     container.classList.add("ace_static_highlight", "ace_show_gutter", props.className);
    
//     for (let lineIndex = 0; lineIndex < aceDocument.getLength(); lineIndex++) {
//         const lineElement = document.createElement("div");
//         lineElement.className = "ace_line";
        
//         const gutterElement = document.createElement("span");
//         gutterElement.className = "ace_gutter ace_gutter_cell";
//         lineElement.appendChild(gutterElement);

//         textLayer.$renderLine(lineElement, lineIndex, false);
//         container.appendChild(lineElement);
//     }

//     return container;
// };

// ----------------------------------------------------------------------------
// Version 3 without TextLayer 66kB

// "use strict";
// const isTextToken = require("../layer/text_util").isTextToken;
// const BackgroundTokenizer = require("../background_tokenizer").BackgroundTokenizer;
// const Document = require("../document").Document;

// const styling = require("./static-css");
// const dom = require("../lib/dom");
// dom.useStrictCSP(true);
// dom.importCssString(styling);

// /**
//  * TODO document the function
//  */
//  function highlight(props) {
//     const backgroundTokenizer = new BackgroundTokenizer(props.mode.getTokenizer(), {});
//     const aceDocument = new Document(props.input);
//     backgroundTokenizer.setDocument(aceDocument);

//     const container = document.createElement("div");
//     container.classList.add("ace_static_highlight", "ace_show_gutter", props.className);
    
//     for (let lineIndex = 0; lineIndex < aceDocument.getLength(); lineIndex++) {
//         const lineElement = document.createElement("div");
//         lineElement.className = "ace_line";
        
//         const gutterElement = document.createElement("span");
//         gutterElement.className = "ace_gutter ace_gutter_cell";
//         lineElement.appendChild(gutterElement);

//         const lineTokens = backgroundTokenizer.getTokens(lineIndex);
//         lineTokens.forEach((token) => {
//             const textNode = dom.createTextNode(token.value, container);
//             let tokenElement = textNode;
//             if (!isTextToken(token.type)) {
//                 const span = dom.createElement("span");
//                 span.className = "ace_" + token.type.replace(/\./g, " ace_");
//                 span.appendChild(textNode);
//                 tokenElement = span;
//             }
//             lineElement.appendChild(tokenElement);
//         });

//         container.appendChild(lineElement);
//     }

//     return container;
// };

// ----------------------------------------------------------------------------
// Version 4 - separate CSS file, no BackgroundTokenizer and no Document 55kB
// using SyntaxMode directly 50KB
// 
// "use strict";
// const isTextToken = require("../layer/text_util").isTextToken;

// class SimpleTokenizer {
//     /**
//      * 
//      * @param {string} content 
//      * @param {Tokenizer} tokenizer 
//      */
//     constructor(content, tokenizer) {
//         this._lines = content.split(/\r\n|\r|\n/);
//         this._states = [];
//         this._tokenizer = tokenizer;
//     }   

//     /**
//      * 
//      * @param {number} row 
//      * @returns {Token[]}
//      */
//     getTokens(row) {
//         const line = this._lines[row];
//         const previousState = this._states[row - 1];
        
//         const data = this._tokenizer.getLineTokens(line, previousState, row);
//         this._states[row] = data.state;

//         return data.tokens;
//     }

//     /**
//      * @returns {number} 
//      */
//     getLength() {
//         return this._lines.length;
//     }
// }

// /**
//  * TODO document the function
//  */
//  function highlight(props) {
//     const container = document.createElement("div");
//     container.classList.add("ace_sytax_highlighter", "ace_show_gutter", props.className);
//     const tokenizer = new SimpleTokenizer(props.input, props.mode.getTokenizer());

//     for (let lineIndex = 0; lineIndex < tokenizer.getLength(); lineIndex++) {
//         const lineElement = document.createElement("div");
//         lineElement.className = "ace_line";
        
//         const gutterElement = document.createElement("span");
//         gutterElement.className = "ace_gutter ace_gutter_cell";
//         lineElement.appendChild(gutterElement);

//         const lineTokens = tokenizer.getTokens(lineIndex);
//         lineTokens.forEach((token) => {
//             const textNode = document.createTextNode(token.value);
//             let tokenElement = textNode;
//             if (!isTextToken(token.type)) {
//                 const span = document.createElement("span");
//                 span.className = "ace_" + token.type.replace(/\./g, " ace_");
//                 span.appendChild(textNode);
//                 tokenElement = span;
//             }
//             lineElement.appendChild(tokenElement);
//         });

//         container.appendChild(lineElement);
//     }

//     return container;
// };

// ----------------------------------------------------------------------------
// Version 5 - using HighlightRules directly - 26KB
// "use strict";

// const { Tokenizer } = require("../tokenizer");

// const isTextToken = require("../layer/text_util").isTextToken;

// class SimpleTokenizer {
//     /**
//      * 
//      * @param {string} content 
//      * @param {Tokenizer} tokenizer 
//      */
//     constructor(content, tokenizer) {
//         this._lines = content.split(/\r\n|\r|\n/);
//         this._states = [];
//         this._tokenizer = tokenizer;
//     }   

//     /**
//      * 
//      * @param {number} row 
//      * @returns {Token[]}
//      */
//     getTokens(row) {
//         const line = this._lines[row];
//         const previousState = this._states[row - 1];
        
//         const data = this._tokenizer.getLineTokens(line, previousState, row);
//         this._states[row] = data.state;

//         return data.tokens;
//     }

//     /**
//      * @returns {number} 
//      */
//     getLength() {
//         return this._lines.length;
//     }
// }

// /**
//  * TODO document the function
//  */
//  function highlight(props) {
//     const container = document.createElement("div");
//     container.classList.add("ace_sytax_highlighter", "ace_show_gutter", props.className);

//     const tokenizer = new SimpleTokenizer(props.input, new Tokenizer(props.highlightRules.getRules()));

//     for (let lineIndex = 0; lineIndex < tokenizer.getLength(); lineIndex++) {
//         const lineElement = document.createElement("div");
//         lineElement.className = "ace_line";
        
//         const gutterElement = document.createElement("span");
//         gutterElement.className = "ace_gutter ace_gutter_cell";
//         lineElement.appendChild(gutterElement);

//         const lineTokens = tokenizer.getTokens(lineIndex);
//         lineTokens.forEach((token) => {
//             const textNode = document.createTextNode(token.value);
//             let tokenElement = textNode;
//             if (!isTextToken(token.type)) {
//                 const span = document.createElement("span");
//                 span.className = "ace_" + token.type.replace(/\./g, " ace_");
//                 span.appendChild(textNode);
//                 tokenElement = span;
//             }
//             lineElement.appendChild(tokenElement);
//         });

//         container.appendChild(lineElement);
//     }

//     return container;
// };

// ----------------------------------------------------------------------------
// Version 6 - using tokenizer_internal - 9.8KB
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