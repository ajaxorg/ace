define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var CsoundDocumentHighlightRules = require("./csound_document_highlight_rules").CsoundDocumentHighlightRules;

var Mode = function() {
    this.HighlightRules = CsoundDocumentHighlightRules;
};
oop.inherits(Mode, TextMode);

exports.Mode = Mode;
});
