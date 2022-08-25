"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var MELHighlightRules = require("./mel_highlight_rules").MELHighlightRules;
var CstyleBehaviour = require("./behaviour/cstyle").CstyleBehaviour;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = MELHighlightRules;
    this.$behaviour = new CstyleBehaviour();
    this.foldingRules = new CStyleFoldMode();
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = "//";
    this.blockComment = {start: "/*", end: "*/"};
    this.$id = "ace/mode/mel";
}).call(Mode.prototype);

exports.Mode = Mode;
