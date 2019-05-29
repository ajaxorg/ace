"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var VerilogHighlightRules = require("./verilog_highlight_rules").VerilogHighlightRules;
var Range = require("../range").Range;

var Mode = function() {
    this.HighlightRules = VerilogHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = "//";
    this.blockComment = {start: "/*", end: "*/"};
    this.$quotes = { '"': '"' };


    this.$id = "ace/mode/verilog";
}).call(Mode.prototype);

exports.Mode = Mode;
