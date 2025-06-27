"use strict";

var oop = require("../lib/oop");
var NunjucksFoldMode = require("./folding/nunjucks").FoldMode;
var lang = require("../lib/lang");
var HtmlMode = require("./html").Mode;
var NunjucksHighlightRules = require("./nunjucks_highlight_rules").NunjucksHighlightRules;

// http://www.w3.org/TR/html5/syntax.html#void-elements
var voidElements = [
    "area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "menuitem", "param", "source",
    "track", "wbr"
];
var optionalEndTags = ["li", "dt", "dd", "p", "rt", "rp", "optgroup", "option", "colgroup", "td", "th"];

var Mode = function () {
    this.HighlightRules = NunjucksHighlightRules;
    this.foldingRules = new NunjucksFoldMode(this.voidElements, lang.arrayToMap(optionalEndTags));
};

oop.inherits(Mode, HtmlMode);

(function () {
    this.$id = "ace/mode/nunjucks";
    this.voidElements = lang.arrayToMap(voidElements);

}).call(Mode.prototype);

exports.Mode = Mode;
