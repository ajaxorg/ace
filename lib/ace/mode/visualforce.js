/* caption: Visualforce; extensions: component,page,vfp */

define(["require", "exports", "module", "ace/mode/html", "./visualforce_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("ace/lib/oop");
var HtmlMode = require("ace/mode/html").Mode;
var VisualforceHighlightRules = require("./visualforce_highlight_rules").VisualforceHighlightRules;
var XmlBehaviour = require("ace/mode/behaviour/xml").XmlBehaviour;
var HtmlFoldMode = require("ace/mode/folding/html").FoldMode;

function VisualforceMode() {
    HtmlMode.call(this);

    this.HighlightRules = VisualforceHighlightRules;
    this.foldingRules = new HtmlFoldMode();
    this.$behaviour = new XmlBehaviour();
};

oop.inherits(VisualforceMode, HtmlMode);

VisualforceMode.prototype.emmetConfig = {
    profile: "xhtml"
};

exports.Mode = VisualforceMode;

});
