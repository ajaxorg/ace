"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var HjsonHighlightRules = require("./hjson_highlight_rules").HjsonHighlightRules;
var FoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = HjsonHighlightRules;
    this.foldingRules = new FoldMode();
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "//";
    this.blockComment = { start: "/*", end: "*/" };
    this.$id = "ace/mode/hjson";
}).call(Mode.prototype);

exports.Mode = Mode;
