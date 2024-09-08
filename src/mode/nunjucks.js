"use strict";

var oop = require("../lib/oop");
var HtmlMode = require("./html").Mode;
var NunjucksHighlightRules = require("./nunjucks_highlight_rules").NunjucksHighlightRules;

var Mode = function() {
    HtmlMode.call(this);
    this.HighlightRules = NunjucksHighlightRules;
};

oop.inherits(Mode, HtmlMode);

(function() {
    this.$id = "ace/mode/nunjucks";
}).call(Mode.prototype);

exports.Mode = Mode;
