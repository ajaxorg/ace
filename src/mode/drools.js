"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var DroolsHighlightRules = require("./drools_highlight_rules").DroolsHighlightRules;
var DroolsFoldMode = require("./folding/drools").FoldMode;
var DocCommentBehaviour = require("../mode/behaviour/doc_comment").DocCommentBehaviour;

var Mode = function() {
    this.HighlightRules = DroolsHighlightRules;
    this.foldingRules = new DroolsFoldMode();
    this.$behaviour = new DocCommentBehaviour();

};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "//";
    this.$id = "ace/mode/drools";
    this.snippetFileId = "ace/snippets/drools";
}).call(Mode.prototype);

exports.Mode = Mode;
