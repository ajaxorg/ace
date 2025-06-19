/**
 * ## Simple tokenizer extension
 *
 * Provides standalone tokenization functionality that can parse code content using Ace's highlight rules without
 * requiring a full editor instance. This is useful for generating syntax-highlighted tokens for external rendering,
 * static code generation, or testing tokenization rules. The tokenizer processes text line by line and returns
 * structured token data with CSS class names compatible with Ace themes.
 *
 * **Usage:**
 * ```javascript
 * const { tokenize } = require("ace/ext/simple_tokenizer");
 * const { JsonHighlightRules } = require("ace/mode/json_highlight_rules");
 *
 * const content = '{"name": "value"}';
 * const tokens = tokenize(content, new JsonHighlightRules());
 * // Returns: [[{className: "ace_paren ace_lparen", value: "{"}, ...]]
 * ```
 *
 * @module
 */

"use strict";
const { Tokenizer } = require("../tokenizer");
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
     * @returns {import("../../ace-internal").Ace.Token[]}
     */
    getTokens(row) {
        const line = this._lines[row];
        const previousState = this._states[row - 1];
        
        const data = this._tokenizer.getLineTokens(line, previousState);
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
 * Parses provided content according to provided highlighting rules and return tokens. 
 * Tokens either have the className set according to Ace themes or have no className if they are just pure text tokens.
 * Result is a list of list of tokens, where each line from the provided content is a separate list of tokens.
 * 
 * @param {string} content to tokenize 
 * @param {import("../../ace-internal").Ace.HighlightRules} highlightRules defining the language grammar 
 * @returns {import("../../ace-internal").Ace.TokenizeResult} tokenization result containing a list of token for each of the lines from content
 */
function tokenize(content, highlightRules) {
    const tokenizer = new SimpleTokenizer(content, new Tokenizer(highlightRules.getRules()));
    
    let result = [];
    for (let lineIndex = 0; lineIndex < tokenizer.getLength(); lineIndex++) {
        const lineTokens = tokenizer.getTokens(lineIndex);
        result.push(lineTokens.map((token) => ({
            className: isTextToken(token.type) ? undefined : "ace_" + token.type.replace(/\./g, " ace_"),
            value: token.value
        })));
    }
    return result;
}

exports.tokenize = tokenize;