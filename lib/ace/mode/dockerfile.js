"use strict";

var oop = require("../lib/oop");
var ShMode = require("./sh").Mode;
var DockerfileHighlightRules = require("./dockerfile_highlight_rules").DockerfileHighlightRules;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    ShMode.call(this);
    
    this.HighlightRules = DockerfileHighlightRules;
    this.foldingRules = new CStyleFoldMode();
};
oop.inherits(Mode, ShMode);

(function() {
    this.$id = "ace/mode/dockerfile";
}).call(Mode.prototype);

exports.Mode = Mode;
