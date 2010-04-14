ace.provide("ace.mode.Text");

ace.mode.Text = function() {
    this.$tokenizer = new ace.Tokenizer({});
};

ace.mode.Text.prototype.getTokenizer = function() {
    return this.$tokenizer;
};