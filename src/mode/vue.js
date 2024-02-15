"use strict";

var oop = require("../lib/oop");
const {FoldMode: HtmlFoldMode} = require("./folding/html");
const lang = require("../lib/lang");
const {XmlBehaviour} = require("./behaviour/xml");
const {HtmlCompletions} = require("./html_completions");
var HTMLMode = require("./html").Mode;
var VueHighlightRules = require("./vue_highlight_rules").VueHighlightRules;

var voidElements = [
    "area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "menuitem", "param", "source",
    "track", "wbr"
];
var optionalEndTags = ["li", "dt", "dd", "p", "rt", "rp", "optgroup", "option", "colgroup", "td", "th"];
var Mode = function () {
    this.HighlightRules = VueHighlightRules;
    this.foldingRules = new HtmlFoldMode(this.voidElements, lang.arrayToMap(optionalEndTags));
    this.$behaviour = new XmlBehaviour();
    this.$completer = new HtmlCompletions();
};
oop.inherits(Mode, HTMLMode);

(function () {
    this.blockComment = {
        start: "<!--",
        end: "-->"
    };
    this.voidElements = lang.arrayToMap(voidElements);

    this.getCompletions = function (state, session, pos, prefix) {
        return this.$completer.getCompletions(state, session, pos, prefix);
    };

    this.$id = "ace/mode/vue";
}).call(Mode.prototype);

exports.Mode = Mode;
