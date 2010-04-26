ace.provide("ace.mode.Html");

ace.mode.Html = function() {
    this.$tokenizer = new ace.Tokenizer(new ace.mode.HtmlHighlightRules().getRules());

    this.$js = new ace.mode.JavaScript();
    this.$css = new ace.mode.Css();
};
ace.inherits(ace.mode.Html, ace.mode.Text);

(function() {

    this.toggleCommentLines = function(doc, range, state) {
        var split = state.split("js-");
        if (!split[0] && split[1]) {
            return this.$js.toggleCommentLines(doc, range, state);
        }

        var split = state.split("css-");
        if (!split[0] && split[1]) {
            return this.$css.toggleCommentLines(doc, range, state);
        }

        return 0;
    };

    this.getNextLineIndent = function(line, state, tab) {
        var split = state.split("js-");
        if (!split[0] && split[1]) {
            return this.$js.getNextLineIndent(line, split[1], tab);
        }

        var split = state.split("css-");
        if (!split[0] && split[1]) {
            return this.$css.getNextLineIndent(line, split[1], tab);
        }

        return "";
    };

}).call(ace.mode.Html.prototype);