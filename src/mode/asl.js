"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var ASLHighlightRules = require("./asl_highlight_rules").ASLHighlightRules;
var FoldMode = require("./folding/cstyle").FoldMode;
var DocCommentBehaviour = require("../mode/behaviour/doc_comment").DocCommentBehaviour;

var Mode = function () {
    this.HighlightRules = ASLHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = new DocCommentBehaviour();
};
oop.inherits(Mode, TextMode);

(function () {
    this.$id = "ace/mode/asl";
}).call(Mode.prototype);

exports.Mode = Mode;
