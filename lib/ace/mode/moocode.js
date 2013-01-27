/* global define */

define(function(require, exports, module) {
  "use strict";

  var oop = require("../lib/oop");
  var TextMode = require("./text").Mode;
  var Tokenizer = require("../tokenizer").Tokenizer;
  var MoocodeHighlightRules = require("./moocode_highlight_rules").MoocodeHighlightRules;

  var Mode = function() {
    var highlighter = new MoocodeHighlightRules();

    this.$tokenizer = new Tokenizer(highlighter.getRules());
  };

  oop.inherits(Mode, TextMode);

  (function() {

    this.toggleCommentLines = function(state, doc, startRow, endRow) {
        return 0;
    };

    this.getNextLineIndent = function(state, line, tab) {
        return this.$getIndent(line);
    };

    this.checkOutdent = function(state, line, input) {
        return false;
    };

  }).call(Mode.prototype);

  exports.Mode = Mode;
});
