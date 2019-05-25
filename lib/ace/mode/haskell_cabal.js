/**
* Haskell Cabal files mode (https://www.haskell.org/cabal/users-guide/developing-packages.html)
**/

"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var CabalHighlightRules = require("./haskell_cabal_highlight_rules").CabalHighlightRules;
var FoldMode = require("./folding/haskell_cabal").FoldMode;

var Mode = function() {
    this.HighlightRules = CabalHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "--";
    this.blockComment = null;
    this.$id = "ace/mode/haskell_cabal";
}).call(Mode.prototype);

exports.Mode = Mode;
