"use strict";

var oop = require("../lib/oop");
var HtmlMode = require("./html").Mode;
var LatteHighlightRules = require("./latte_highlight_rules").LatteHighlightRules;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;

var Mode = function() {
    HtmlMode.call(this);
    this.HighlightRules = LatteHighlightRules;
    this.$outdent = new MatchingBraceOutdent();
};
oop.inherits(Mode, HtmlMode);

(function() {
    this.blockComment = {start: "{*", end: "*}"};

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        if (state == "start") {
            var match = line.match(/^.*\{(?:if|else|elseif|ifset|elseifset|ifchanged|switch|case|foreach|iterateWhile|for|while|first|last|sep|try|capture|spaceless|snippet|block|define|embed|snippetArea)\b[^{]*$/);
            if (match) {
                indent += tab;
            }
        }

        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return /^\s+\{\/$/.test(line + input);
    };

    this.autoOutdent = function(state, doc, row) {
    };

    this.$id = "ace/mode/latte";
}).call(Mode.prototype);

exports.Mode = Mode;
