define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var VHDLHighlightRules = require("./vhdl_highlight_rules").VHDLHighlightRules;
var Range = require("../range").Range;

var Mode = function() {
    this.HighlightRules = VHDLHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = "--";

}).call(Mode.prototype);

exports.Mode = Mode;

});