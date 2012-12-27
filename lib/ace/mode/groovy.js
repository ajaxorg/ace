define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var JavaScriptMode = require("./javascript").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var GroovyHighlightRules = require("./groovy_highlight_rules").GroovyHighlightRules;

var Mode = function() {
    JavaScriptMode.call(this);
    var highlighter = new GroovyHighlightRules();
    this.$tokenizer = new Tokenizer(highlighter.getRules());
    this.$keywordList = highlighter.$keywordList;
};
oop.inherits(Mode, JavaScriptMode);

(function() {

    this.createWorker = function(session) {
        return null;
    };

}).call(Mode.prototype);

exports.Mode = Mode;
});
