ace.provide("ace.mode.JavaScript");

ace.mode.JavaScript = function() {
    this.$tokenizer = new ace.Tokenizer(new ace.mode.JavaScriptHighlightRules().getRules());
};
ace.inherits(ace.mode.JavaScript, ace.mode.Text);

ace.mode.JavaScript.prototype.toggleCommentLines = function(doc, range, state) {
    var addedRows = doc.outdentRows(range, "//");
    if (addedRows == 0) {
        var addedRows = doc.indentRows(range, "//");
    };
    return addedRows;
};

ace.mode.JavaScript.prototype.getNextLineIndent = function(line, state, tab) {
    var indent = this.$getIndent(line);

    if (state == "start") {
        var match = line.match(/^.*[\{\(\[]\s*$/);
        if (match) {
            indent += tab;
        }
    } else if (state == "doc-comment") {
        var match = line.match(/^\s*(\/?)\*/);
        if (match) {
            if (match[1]) {
                indent += " ";
            }
            indent += "* ";
        }
    }

    return indent;
};