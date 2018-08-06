/* caption: Apex; extensions: apex,cls,trigger,tgr */

define(function(require, exports, module) {
"use strict";

var oop = require("ace/lib/oop");
var TextMode = require("ace/mode/text").Mode;
var ApexHighlightRules = require("./apex_highlight_rules").ApexHighlightRules;
var FoldMode = require("ace/mode/folding/cstyle").FoldMode;
var CstyleBehaviour = require("ace/mode/behaviour/cstyle").CstyleBehaviour;

function ApexMode() {
    TextMode.call(this);

    this.HighlightRules = ApexHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = new CstyleBehaviour();
};

oop.inherits(ApexMode, TextMode);

ApexMode.prototype.lineCommentStart = "//";

ApexMode.prototype.blockComment = {
    start: "/*",
    end: "*/"
};

exports.Mode = ApexMode;

});
