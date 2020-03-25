define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var CsoundOrchestraHighlightRules = require("./csound_orchestra_highlight_rules").CsoundOrchestraHighlightRules;

var Mode = function() {
    this.HighlightRules = CsoundOrchestraHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = ";";
    this.blockComment = {start: "/*", end: "*/"};

    this.$id = "ace/mode/csound_orchestra";
    this.snippetFileId = "ace/snippets/csound_orchestra";
}).call(Mode.prototype);

exports.Mode = Mode;
});
