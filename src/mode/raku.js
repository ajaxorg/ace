"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var RakuHighlightRules = require("./raku_highlight_rules").RakuHighlightRules;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = RakuHighlightRules;

    this.$outdent = new MatchingBraceOutdent();
    this.foldingRules = new CStyleFoldMode({start: "^=(begin)\\b", end: "^=(end)\\b"});
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = "#";
    this.blockComment = [
        {start: "=begin", end: "=end", lineStartOnly: true},
        {start: "=item", end: "=end", lineStartOnly: true}
    ];


    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;

        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }

        if (state == "start") {
            var match = line.match(/^.*[\{\(\[:]\s*$/);
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

    this.$id = "ace/mode/raku";
}).call(Mode.prototype);

exports.Mode = Mode;
