"use strict";
const { TokenizerInternal } = require("../tokenizer_internal");
const isTextToken = require("../layer/text_util").isTextToken;

class SimpleTokenizer {
    /**
     * @param {string} content 
     * @param {TokenizerInternal} tokenizer 
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
 * @param {string} content 
 * @param {import("ace-code").Ace.HighlightRules} highlightRules 
 * 
 * @returns {import("ace-code/src/ext/syntax-highlighter").TokenizeResult} tokenization result containing a list of token for each of the lines from content
 */
function tokenize(content, highlightRules) {
    const tokenizer = new SimpleTokenizer(content, new TokenizerInternal(highlightRules.getRules()));
    
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