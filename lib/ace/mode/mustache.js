/* global define */

define(function(require, exports, module) {
  "use strict";

  var oop = require("../lib/oop");
  var TextMode = require("./text").Mode;
  var JavaScriptMode = require("./javascript").Mode;
  var CssMode = require("./css").Mode;
  var Tokenizer = require("../tokenizer").Tokenizer;
  var MustacheHighlightRules = require("./mustache_highlight_rules").MustacheHighlightRules;
  var HtmlBehaviour = require("./behaviour/html").HtmlBehaviour;
  var HtmlFoldMode = require("./folding/html").FoldMode;

  var Mode = function() {
    var highlighter = new MustacheHighlightRules();
    this.$tokenizer = new Tokenizer(highlighter.getRules());
    this.$behaviour = new HtmlBehaviour();

    this.$embeds = highlighter.getEmbeds();
    this.createModeDelegates({
        "js-": JavaScriptMode,
        "css-": CssMode
    });

    this.foldingRules = new HtmlFoldMode();
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
