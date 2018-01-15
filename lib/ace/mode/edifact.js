define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var EdifactHighlightRules = require("./edifact_highlight_rules").EdifactHighlightRules;

var Mode = function() {
    this.HighlightRules = EdifactHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    
    this.$id = "ace/mode/edifact";
}).call(Mode.prototype);

exports.Mode = Mode;
});
