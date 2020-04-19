define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var MediaWikiHighlightRules = require("./mediawiki_highlight_rules").MediaWikiHighlightRules;

var Mode = function() {
    this.HighlightRules = MediaWikiHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {
    this.type = "text";
    this.blockComment = {start: "<!--", end: "-->"};
    this.$id = "ace/mode/mediawiki";
}).call(Mode.prototype);

exports.Mode = Mode;
});
