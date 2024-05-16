"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var CuttlefishHighlightRules = require("./cuttlefish_highlight_rules").CuttlefishHighlightRules;

var Mode = function() {
    this.HighlightRules = CuttlefishHighlightRules;
    this.foldingRules = null;
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "#";
    this.blockComment = null;
    this.$id = "ace/mode/cuttlefish";
}).call(Mode.prototype);

exports.Mode = Mode;
