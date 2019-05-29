"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var MixalHighlightRules = require("./mixal_highlight_rules").MixalHighlightRules;

var Mode = function() {
    this.HighlightRules = MixalHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {
    this.$id = "ace/mode/mixal";
    this.lineCommentStart = "*";
}).call(Mode.prototype);

exports.Mode = Mode;
