define(function(require, exports, module) {
'use strict';

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var LuceneHighlightRules = require("./lucene_highlight_rules").LuceneHighlightRules;

var Mode = function() {
    this.$tokenizer =  new Tokenizer(new LuceneHighlightRules().getRules());
};

oop.inherits(Mode, TextMode);

exports.Mode = Mode;
});