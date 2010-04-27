ace.provide("ace.mode.Css");

ace.mode.Css = function() {
    this.$tokenizer = new ace.Tokenizer(new ace.mode.CssHighlightRules().getRules());
    this.$outdent = new ace.mode.MatchingBraceOutdent();
};
ace.inherits(ace.mode.Css, ace.mode.Text);

(function() {

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        // ignore braces in comments
        var tokens = this.$tokenizer.getLineTokens(line, state).tokens;
        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }

        var match = line.match(/^.*\{\s*$/);
        if (match) {
            indent += tab;
        }

        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        return this.$outdent.autoOutdent(doc, row);
    };

}).call(ace.mode.Css.prototype);