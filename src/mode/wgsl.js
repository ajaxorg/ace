"use strict";

var oop = require("../lib/oop");
var RustMode = require("./rust").Mode;
var WgslHighlightRules = require("./wgsl_highlight_rules").WgslHighlightRules;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var FoldMode = require("./folding/cstyle").FoldMode;

var Mode = function () {
  this.HighlightRules = WgslHighlightRules;
  this.foldingRules = new FoldMode();
  this.$outdent = new MatchingBraceOutdent();
  this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, RustMode);

(function () {
  this.lineCommentStart = "//";
  this.blockComment = { start: "/*", end: "*/", nestable: true };
  this.$id = "ace/mode/wgsl";
}).call(Mode.prototype);

exports.Mode = Mode;
