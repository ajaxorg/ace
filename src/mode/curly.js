"use strict";

var oop = require("../lib/oop");
// defines the parent mode
var HtmlMode = require("./html").Mode;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var HtmlFoldMode = require("./folding/html").FoldMode;

// defines the language specific highlighters and folding rules
var CurlyHighlightRules = require("./curly_highlight_rules").CurlyHighlightRules;

var Mode = function() {
    HtmlMode.call(this);
    this.HighlightRules = CurlyHighlightRules;
    this.$outdent = new MatchingBraceOutdent();
    this.foldingRules = new HtmlFoldMode();
};
oop.inherits(Mode, HtmlMode);

(function() {
    this.$id = "ace/mode/curly";
}).call(Mode.prototype);

exports.Mode = Mode;
