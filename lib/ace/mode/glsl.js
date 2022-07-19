"use strict";

var oop = require("../lib/oop");
var CMode = require("./c_cpp").Mode;
var glslHighlightRules = require("./glsl_highlight_rules").glslHighlightRules;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var Range = require("../range").Range;
var CstyleBehaviour = require("./behaviour/cstyle").CstyleBehaviour;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = glslHighlightRules;
    
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = new CstyleBehaviour();
    this.foldingRules = new CStyleFoldMode();
};
oop.inherits(Mode, CMode);

(function() {
    this.$id = "ace/mode/glsl";
}).call(Mode.prototype);

exports.Mode = Mode;
