"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var FtlHighlightRules = require("./ftl_highlight_rules").FtlHighlightRules;

var Mode = function() {
    this.HighlightRules = FtlHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {

    this.$id = "ace/mode/ftl";
}).call(Mode.prototype);

exports.Mode = Mode;
