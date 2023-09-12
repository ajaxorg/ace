// Tokens for which Ace just uses a simple TextNode and does not add any special className.
const textTokens = new Set(["text", "rparen", "lparen"]);

exports.isTextToken = function(tokenType) {
    return textTokens.has(tokenType);
};
