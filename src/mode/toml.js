"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var TomlHighlightRules = require("./toml_highlight_rules").TomlHighlightRules;
var FoldMode = require("./folding/ini").FoldMode;

var Mode = function() {
    this.HighlightRules = TomlHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "#";
    this.$id = "ace/mode/toml";
}).call(Mode.prototype);

exports.Mode = Mode;
