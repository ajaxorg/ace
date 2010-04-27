ace.provide("ace.mode.Html");

ace.mode.Html = function() {
    this.$tokenizer = new ace.Tokenizer(new ace.mode.HtmlHighlightRules().getRules());

    this.$js = new ace.mode.JavaScript();
    this.$css = new ace.mode.Css();
};
ace.inherits(ace.mode.Html, ace.mode.Text);

(function() {

    this.toggleCommentLines = function(state, doc, range) {
        return this.$delegate("toggleCommentLines", arguments, function() {
            return 0;
        });
    };

    this.getNextLineIndent = function(state, line, tab) {
        return this.$delegate("getNextLineIndent", arguments, function() {
            return "";
        });
    };

    this.checkOutdent = function(state, line, input) {
        return this.$delegate("checkOutdent", arguments, function() {
            return false;
        });
    };

    this.autoOutdent = function(state, doc, row) {
        return this.$delegate("autoOutdent", arguments);
    };

    this.$delegate = function(method, args, defaultHandler) {
        var state = args[0];
        var split = state.split("js-");

        if (!split[0] && split[1]) {
            args[0] = split[1];
            return this.$js[method].apply(this.$js, args);
        }

        var split = state.split("css-");
        if (!split[0] && split[1]) {
            args[0] = split[1];
            return this.$css[method].apply(this.$css, args);
        }

        return defaultHandler ? defaultHandler() : undefined;
    };

}).call(ace.mode.Html.prototype);