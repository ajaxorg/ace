"use strict";

var oop = require("../lib/oop");
var HtmlMode = require("./html").Mode;
var SoyTemplateHighlightRules = require("./soy_template_highlight_rules").SoyTemplateHighlightRules;

var Mode = function() {
    HtmlMode.call(this);
    this.HighlightRules = SoyTemplateHighlightRules;
};
oop.inherits(Mode, HtmlMode);

(function() {
    this.lineCommentStart = "//";
    this.blockComment = {start: "/*", end: "*/"};
    this.$id = "ace/mode/soy_template";
}).call(Mode.prototype);

exports.Mode = Mode;
