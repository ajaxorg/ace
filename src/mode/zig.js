"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var ZigHighlightRules = require("./zig_highlight_rules").ZigHighlightRules;
var FoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = ZigHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "//";
    this.$id = "ace/mode/zig";
}).call(Mode.prototype);

exports.Mode = Mode;
