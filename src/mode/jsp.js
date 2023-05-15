"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var JspHighlightRules = require("./jsp_highlight_rules").JspHighlightRules;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = JspHighlightRules;
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = this.$defaultBehaviour;
    this.foldingRules = new CStyleFoldMode();
};
oop.inherits(Mode, TextMode);

(function() {

    this.$id = "ace/mode/jsp";
    this.snippetFileId = "ace/snippets/jsp";
}).call(Mode.prototype);

exports.Mode = Mode;
