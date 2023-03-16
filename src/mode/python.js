"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var PythonHighlightRules = require("./python_highlight_rules").PythonHighlightRules;
var PythonFoldMode = require("./folding/pythonic").FoldMode;
var Range = require("../range").Range;

var Mode = function() {
    this.HighlightRules = PythonHighlightRules;
    this.foldingRules = new PythonFoldMode("\\:");
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = "#";
    this.$pairQuotesAfter = {
        "'": /[ruf]/i,
        '"': /[ruf]/i
    };

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

        var tokens = this.getTokenizer().getLineTokens(line.trim(), state).tokens;
        
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

    this.$id = "ace/mode/python";
    this.snippetFileId = "ace/snippets/python";
}).call(Mode.prototype);

exports.Mode = Mode;
