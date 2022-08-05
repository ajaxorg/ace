"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var NimHighlightRules = require("./nim_highlight_rules").NimHighlightRules;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;

var Mode = function () {
    TextMode.call(this);
    this.HighlightRules = NimHighlightRules;
    this.foldingRules = new CStyleFoldMode();
    this.$behaviour = this.$defaultBehaviour;
};

oop.inherits(Mode, TextMode);


(function () {
    this.lineCommentStart = "#";
    this.blockComment = {start: "#[", end: "]#", nestable: true};


    this.$id = "ace/mode/nim";
}).call(Mode.prototype);

exports.Mode = Mode;
