"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var RSTHighlightRules = require("./rst_highlight_rules").RSTHighlightRules;

var Mode = function() {
    this.HighlightRules = RSTHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {
    this.type = "text";

    this.$id = "ace/mode/rst";
    this.snippetFileId = "ace/snippets/rst";
}).call(Mode.prototype);

exports.Mode = Mode;
