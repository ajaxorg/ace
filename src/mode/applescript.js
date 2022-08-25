"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var AppleScriptHighlightRules = require("./applescript_highlight_rules").AppleScriptHighlightRules;
var FoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = AppleScriptHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "--";
    this.blockComment = {start: "(*", end: "*)"};
    this.$id = "ace/mode/applescript";
    // Extra logic goes here.
}).call(Mode.prototype);

exports.Mode = Mode;
