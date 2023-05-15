"use strict";

var Rules = require("./lsl_highlight_rules").LSLHighlightRules;
var Outdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var TextMode = require("./text").Mode;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;
var oop = require("../lib/oop");

var Mode = function() {
    this.HighlightRules = Rules;
    this.$outdent = new Outdent();
    this.$behaviour = this.$defaultBehaviour;
    this.foldingRules = new CStyleFoldMode();
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = ["//"];

    this.blockComment = {
        start: "/*",
        end: "*/"
    };

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        var endState = tokenizedLine.state;

        if (tokens.length && tokens[tokens.length-1].type === "comment.block.lsl") {
            return indent;
        }

        if (state === "start") {
            var match = line.match(/^.*[\{\(\[]\s*$/);
            if (match) {
                indent += tab;
            }
        }

        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };

    this.$id = "ace/mode/lsl";
    this.snippetFileId = "ace/snippets/lsl";
}).call(Mode.prototype);

exports.Mode = Mode;
