"use strict";

var oop = require("../lib/oop");
var HtmlMode = require("./html").Mode;
var AstroHighlightRules = require("./astro_highlight_rules").AstroHighlightRules;
var HtmlBehaviour = require("./behaviour/html").HtmlBehaviour;

var Mode = function() {
  HtmlMode.call(this);
  this.HighlightRules = AstroHighlightRules;
  this.$behaviour = new HtmlBehaviour();
};

oop.inherits(Mode, HtmlMode);

(function() {
  this.$id = "ace/mode/astro";
}).call(Mode.prototype);

exports.Mode = Mode;