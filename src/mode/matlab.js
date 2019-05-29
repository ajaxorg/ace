"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var MatlabHighlightRules = require("./matlab_highlight_rules").MatlabHighlightRules;

var Mode = function() {
    this.HighlightRules = MatlabHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = "%";
    this.blockComment = {start: "%{", end: "%}"};

    this.$id = "ace/mode/matlab";
}).call(Mode.prototype);

exports.Mode = Mode;
