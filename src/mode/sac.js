"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var SaCHighlightRules = require("./sac_highlight_rules").sacHighlightRules;
var FoldMode = require("./folding/cstyle").FoldMode;
var DocCommentBehaviour = require("../mode/behaviour/doc_comment").DocCommentBehaviour;

var Mode = function() {
  this.HighlightRules = SaCHighlightRules;
  this.foldingRules = new FoldMode();
  this.$behaviour = new DocCommentBehaviour();
};
oop.inherits(Mode, TextMode);

(function() {
  this.lineCommentStart = "//";
  this.blockComment = {start: "/*", end: "*/"};
  this.$id = "ace/mode/sac";
}).call(Mode.prototype);

exports.Mode = Mode;
