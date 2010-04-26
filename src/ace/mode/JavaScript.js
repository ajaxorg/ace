ace.provide("ace.mode.JavaScript");

ace.mode.JavaScript = function() {
    this.$tokenizer = new ace.Tokenizer(new ace.mode.JavaScriptHighlightRules().getRules());
};
ace.inherits(ace.mode.JavaScript, ace.mode.Text);

(function() {

    this.toggleCommentLines = function(doc, range, state) {
        var addedRows = doc.outdentRows(range, "//");
        if (addedRows == 0) {
            var addedRows = doc.indentRows(range, "//");
        };
        return addedRows;
    };

    this.getNextLineIndent = function(line, state, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.$tokenizer.getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        var endState = tokenizedLine.state;

        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }

        if (state == "start") {
            var match = line.match(/^.*[\{\(\[]\s*$/);
            if (match) {
                indent += tab;
            }
        } else if (state == "doc-comment") {
            if (endState == "start") {
                return "";
            }
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

}).call(ace.mode.JavaScript.prototype);