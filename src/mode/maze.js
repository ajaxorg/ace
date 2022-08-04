"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var MazeHighlightRules = require("./maze_highlight_rules").MazeHighlightRules;
var FoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = MazeHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "//";
    this.$id = "ace/mode/maze";
    this.snippetFileId = "ace/snippets/maze";
}).call(Mode.prototype);

exports.Mode = Mode;
