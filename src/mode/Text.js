ace.provide("ace.mode.Text");

ace.mode.Text = function() {
    var rules = {
        "start" : [ {
            token : "text",
            regex : ".+"
        } ]
    };
    this.$tokenizer = new ace.Tokenizer(rules);
};

ace.mode.Text.prototype.getTokenizer = function() {
    return this.$tokenizer;
};

ace.mode.Text.prototype.toggleCommentLines = function(doc, range, state) {
    return 0;
};

ace.mode.Text.prototype.getNextLineIndent = function(line, state, tab) {
    return "";
};