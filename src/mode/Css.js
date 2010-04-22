ace.provide("ace.mode.Css");

ace.mode.Css = function() {
    this.$tokenizer = new ace.Tokenizer(new ace.mode.CssHighlightRules().getRules());
};
ace.inherits(ace.mode.Css, ace.mode.Text);

(function() {

    this.getNextLineIndent = function(line, state, tab) {
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

}).call(ace.mode.Css.prototype);