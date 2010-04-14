ace.provide("ace.mode.JavaScript");

ace.mode.JavaScript = function() {
    this.$tokenizer = new ace.Tokenizer(new ace.mode.JavaScriptHighlightRules().getRules());
};
ace.inherits(ace.mode.JavaScript, ace.mode.Text);

ace.mode.JavaScript.prototype.toggleCommentLines = function(doc, range) {
    var addedRows = doc.outdentRows(range, "//");
    if (addedRows == 0) {
        var addedRows = doc.indentRows(range, "//");
    };
    return addedRows;
};

ace.mode.JavaScript.prototype.increaseIndentPatterns = {
    "start" : /^(\s*).*[\{\(\[]\s*$/
};

ace.mode.JavaScript.prototype.getNextLineIndent = function(line, state, tab) {
    var re = this.increaseIndentPatterns[state];
    if (!re) return

    var match = line.match(re);
    if (match) {
        return (match[1] || "") + tab;
    }

    var match = line.match(/^(\s+).*$/);
    if (match) {
        return match[1];
    }

    return "";
};