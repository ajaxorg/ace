"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var VerseHighlightRules = require("./verse_highlight_rules").VerseHighlightRules;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var PythonFoldMode = require("./folding/pythonic").FoldMode;

var Mode = function() {
    this.HighlightRules = VerseHighlightRules;
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = this.$defaultBehaviour;
    this.foldingRules = new PythonFoldMode("\\:|=");
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "#";
    this.blockComment = {start: "<#", end: "#>", nestable: true};

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        if (Array.isArray(state) && state[0] == "indented_comment") {
            // lines stay part of a <#> comment while they are indented below it
            if (indent.replace(/\t/g, "    ").length <= state[1])
                indent += tab;
            return indent;
        }
        if (state != "start")
            return indent;

        var tokens = this.getTokenizer().getLineTokens(line, state).tokens;
        var last = tokens.pop();
        while (last && (last.type == "comment.line" || /^\s*$/.test(last.value)))
            last = tokens.pop();

        // blocks open after "if (X):", "F():void =" and brackets
        if (last && !/string|comment/.test(last.type) && /[:=([{]$/.test(last.value))
            indent += tab;
        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };

    this.$id = "ace/mode/verse";
}).call(Mode.prototype);

exports.Mode = Mode;
