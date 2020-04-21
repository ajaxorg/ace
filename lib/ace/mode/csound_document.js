define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var CsoundDocumentHighlightRules = require("./csound_document_highlight_rules").CsoundDocumentHighlightRules;

var Mode = function() {
    this.HighlightRules = CsoundDocumentHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {
    this.$id = "ace/mode/csound_document";
    this.snippetFileId = "ace/snippets/csound_document";
}).call(Mode.prototype);

exports.Mode = Mode;
});
