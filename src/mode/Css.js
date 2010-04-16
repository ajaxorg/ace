ace.provide("ace.mode.Css");

ace.mode.Css = function() {
    this.$tokenizer = new ace.Tokenizer(new ace.mode.CssHighlightRules().getRules());
};
ace.inherits(ace.mode.Css, ace.mode.Text);
