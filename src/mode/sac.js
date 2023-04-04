"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var SaCHighlightRules = require("./sac_highlight_rules").sacHighlightRules;
var FoldMode = require("./folding/cstyle").FoldMode;
var CstyleBehaviour = require("../mode/behaviour/cstyle").CstyleBehaviour;

var Mode = function() {
  this.HighlightRules = SaCHighlightRules;
  this.foldingRules = new FoldMode();
  this.$behaviour = new CstyleBehaviour({closeDocComment: true});
};
oop.inherits(Mode, TextMode);

(function() {
  this.lineCommentStart = "//";
  this.blockComment = {start: "/*", end: "*/"};
  this.$id = "ace/mode/sac";
}).call(Mode.prototype);

exports.Mode = Mode;
