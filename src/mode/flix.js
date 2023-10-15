"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var FlixHighlightRules = require("./flix_highlight_rules").FlixHighlightRules;

var Mode = function() {
    this.HighlightRules = FlixHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {
    this.$id = "ace/mode/flix";
}).call(Mode.prototype);

exports.Mode = Mode;