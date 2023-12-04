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

module.exports = {
    tokenize
};
