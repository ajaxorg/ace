ace.provide("ace.mode.JavaScript");

ace.mode.JavaScript = function() {
    this.$tokenizer = new ace.Tokenizer(new ace.mode.JavaScriptHighlightRules().getRules());
    this.$outdent = new ace.mode.MatchingBraceOutdent();
};
ace.inherits(ace.mode.JavaScript, ace.mode.Text);

(function() {

    this.toggleCommentLines = function(state, doc, range) {
        var addedRows = doc.outdentRows(range, "//");
        if (addedRows == 0) {
            var addedRows = doc.indentRows(range, "//");
        };
        return addedRows;
    };

    this.getNextLineIndent = function(state, line, tab) {
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
        } else if (state == "doc-start") {
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

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        return this.$outdent.autoOutdent(doc, row);
    };

}).call(ace.mode.JavaScript.prototype);