"use strict";
  
var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var RobotHighlightRules = require("./robot_highlight_rules").RobotHighlightRules;
var FoldMode = require("./folding/pythonic").FoldMode;

var Mode = function() {
  this.HighlightRules = RobotHighlightRules;
  this.foldingRules = new FoldMode();
  this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
  this.lineCommentStart = "#";
  this.$id = "ace/mode/robot";
  this.snippetFileId = "ace/snippets/robot";
}).call(Mode.prototype);

exports.Mode = Mode;
