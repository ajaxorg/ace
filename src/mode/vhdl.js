"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var VHDLHighlightRules = require("./vhdl_highlight_rules").VHDLHighlightRules;

var Mode = function() {
    this.HighlightRules = VHDLHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = "--";

    this.$id = "ace/mode/vhdl";
}).call(Mode.prototype);

exports.Mode = Mode;
