"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var EiffelHighlightRules = require("./eiffel_highlight_rules").EiffelHighlightRules;

var Mode = function() {
    this.HighlightRules = EiffelHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "--";
    this.$id = "ace/mode/eiffel";
}).call(Mode.prototype);

exports.Mode = Mode;
