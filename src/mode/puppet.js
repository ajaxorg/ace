"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var PuppetHighlightRules = require("./puppet_highlight_rules").PuppetHighlightRules;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;

var Mode = function () {
    TextMode.call(this);
    this.HighlightRules = PuppetHighlightRules;
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = this.$defaultBehaviour;
    this.foldingRules = new CStyleFoldMode();
};

oop.inherits(Mode, TextMode);


(function () {
    this.lineCommentStart = "#";
    this.blockComment = {start: "/*", end: "*/"};
    
    this.$id = "ace/mode/puppet";
}).call(Mode.prototype);

exports.Mode = Mode;
