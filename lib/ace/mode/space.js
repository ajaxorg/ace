define(function(require, exports, module) {
"use strict";
var oop = require("../lib/oop");
// defines the parent mode
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var FoldMode = require("./folding/coffee").FoldMode;
// defines the language specific highlighters and folding rules
var SpaceHighlightRules = require("./space_highlight_rules").SpaceHighlightRules;
var Mode = function() {
    // set everything up
    var highlighter = new SpaceHighlightRules();
    this.$tokenizer = new Tokenizer(highlighter.getRules());
    this.foldingRules = new FoldMode();
};
oop.inherits(Mode, TextMode);
(function() {
    
    // todo: code folding, multiline value support.
    
    
    // Extra logic goes here--we won't be covering all of this
    /* These are all optional pieces of code!
    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);
        return indent;
    };
    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };
    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };
    this.createWorker = function(session) {
        var worker = new WorkerClient(["ace"], "ace/mode/mynew_worker", "NewWorker");
        worker.attachToDocument(session.getDocument());
        return worker;
    };
    */
}).call(Mode.prototype);
exports.Mode = Mode;
});
