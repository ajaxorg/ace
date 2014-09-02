/*
(C) 2013 Ezhil Language Project
(C) 2013 Sridhar Ganesan
*/
define(function(require, exports, module) {
"use strict";
var oop = require("../lib/oop");
// defines the parent mode
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
// defines the language specific highlighters and folding rules
var EzhilHighlightRules = require("./ezhil_highlight_rules").EzhilHighlightRules;
var EzhilFoldMode = require("./folding/ezhil_fold").EzhilFoldMode;
var Mode = function() {
    // set everything up
    var highlighter = new EzhilHighlightRules();
    this.$outdent = new MatchingBraceOutdent();
    //this.foldingRules = new EzhilFoldMode();
    this.$tokenizer = new Tokenizer(highlighter.getRules());
};
oop.inherits(Mode, TextMode);
(function() {
    // configure comment start/end characters
    this.lineCommentStart = "#";
	
    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.$tokenizer.getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;

        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }

        if (state == "start") {
            var match = line.match(/^.*[\{\(\[\:]\s*$/);
            if (match) {
                indent += tab;
            }
        }

        return indent;
    };

    var outdents = {
        "pass": 1,
        "return": 1,
        "raise": 1,
        "break": 1,
        "continue": 1
    };
    
    this.checkOutdent = function(state, line, input) {
        if (input !== "\r\n" && input !== "\r" && input !== "\n")
            return false;

        var tokens = this.$tokenizer.getLineTokens(line.trim(), state).tokens;
        
        if (!tokens)
            return false;
        
        // ignore trailing comments
        do {
            var last = tokens.pop();
        } while (last && (last.type == "comment" || (last.type == "text" && last.value.match(/^\s+$/))));
        
        if (!last)
            return false;
        
        return (last.type == "keyword" && outdents[last.value]);
    };

    this.autoOutdent = function(state, doc, row) {
        // outdenting in python is slightly different because it always applies
        // to the next line and only of a new line is inserted
        
        row += 1;
        var indent = this.$getIndent(doc.getLine(row));
        var tab = doc.getTabString();
        if (indent.slice(-tab.length) == tab)
            doc.remove(new Range(row, indent.length-tab.length, row, indent.length));
    };
    
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