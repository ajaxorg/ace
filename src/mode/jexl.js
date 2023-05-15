"use strict";

var oop = require("../lib/oop");
var JexlHighlightRules = require("./jexl_highlight_rules").JexlHighlightRules;
var TextMode = require("./text").Mode;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;

var Mode = function () {
    this.HighlightRules = JexlHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
    this.foldingRules = new CStyleFoldMode();
};
oop.inherits(Mode, TextMode);

(function () {
    this.lineCommentStart = ["//", "##"];
    this.blockComment = {start: "/*", end: "*/"};

    this.$id = "ace/mode/jexl";
}).call(Mode.prototype);

exports.Mode = Mode;
