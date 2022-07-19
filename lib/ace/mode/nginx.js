"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var NginxHighlightRules = require("./nginx_highlight_rules").NginxHighlightRules;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;

var Mode = function () {
    TextMode.call(this);
    this.HighlightRules = NginxHighlightRules;
    this.foldingRules = new CStyleFoldMode();
    this.$behaviour = this.$defaultBehaviour;
};

oop.inherits(Mode, TextMode);


(function () {
    this.lineCommentStart = "#";

    this.$id = "ace/mode/nginx";
}).call(Mode.prototype);

exports.Mode = Mode;
