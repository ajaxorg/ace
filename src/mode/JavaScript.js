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

ace.mode.JavaScript.prototype.getNextLineIndent = function(line, state, tab) {
    if (state == "start") {
        var re = /^(\s*).*[\{\(\[]\s*$/;
        var match = line.match(re);
        if (match) {
            return (match[1] || "") + tab;
        }
    } else if (state == "doc-comment") {
        var re = /^(\s*)(\/?)\*.*$/;
        var match = line.match(re);
        if (match) {
            var indent = match[1];
            if (match[2]) {
                indent += " ";
            }
            return indent + "* ";
        }
    }

    var match = line.match(/^(\s+).*$/);
    if (match) {
        return match[1];
    }

    return "";
};