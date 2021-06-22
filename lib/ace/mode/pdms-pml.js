define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var pdms_pmlHighlightRules = require("./pdms_pml_highlight_rules").pdms_pmlHighlightRules;
var Range = require("../range").Range;

var Mode = function() {
    this.HighlightRules = pdms_pmlHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = "--";

    this.$id = "ace/mode/pdms_pml";
}).call(Mode.prototype);

exports.Mode = Mode;

});
