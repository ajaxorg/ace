define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var CsoundScoreHighlightRules = require("./csound_score_highlight_rules").CsoundScoreHighlightRules;

var Mode = function() {
    this.HighlightRules = CsoundScoreHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = ";";
    this.blockComment = {start: "/*", end: "*/"};

}).call(Mode.prototype);

exports.Mode = Mode;
});
