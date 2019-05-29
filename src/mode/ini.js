"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var IniHighlightRules = require("./ini_highlight_rules").IniHighlightRules;
// TODO: pick appropriate fold mode
var FoldMode = require("./folding/ini").FoldMode;

var Mode = function() {
    this.HighlightRules = IniHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = ";";
    this.blockComment = null;
    this.$id = "ace/mode/ini";
}).call(Mode.prototype);

exports.Mode = Mode;
