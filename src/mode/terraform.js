"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var TerraformHighlightRules = require("./terraform_highlight_rules").TerraformHighlightRules;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;

var Mode = function () {
    TextMode.call(this);
    this.HighlightRules = TerraformHighlightRules;
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = this.$defaultBehaviour;
    this.foldingRules = new CStyleFoldMode();
};

oop.inherits(Mode, TextMode);


(function () {
    this.lineCommentStart = ["#", "//"];
    this.blockComment = {start: "/*", end: "*/"};
    
    this.$id = "ace/mode/terraform";
}).call(Mode.prototype);

exports.Mode = Mode;
