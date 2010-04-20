ace.provide("ace.mode.Html");

ace.mode.Html = function() {
    this.$tokenizer = new ace.Tokenizer(new ace.mode.HtmlHighlightRules().getRules());

    this._js = new ace.mode.JavaScript();
    this._css = new ace.mode.Css();
};
ace.inherits(ace.mode.Html, ace.mode.Text);

ace.mode.Html.prototype.toggleCommentLines = function(doc, range, state) {
    var split = state.split("js-");
    if (!split[0] && split[1]) {
        return this._js.toggleCommentLines(doc, range, state);
    }

    var split = state.split("css-");
    if (!split[0] && split[1]) {
        return this._css.toggleCommentLines(doc, range, state);
    }

    return 0;
};

ace.mode.Html.prototype.getNextLineIndent = function(line, state, tab) {
    var split = state.split("js-");
    if (!split[0] && split[1]) {
        return this._js.getNextLineIndent(line, split[1], tab);
    }

    var split = state.split("css-");
    if (!split[0] && split[1]) {
        return this._css.getNextLineIndent(line, split[1], tab);
    }

    return "";
};