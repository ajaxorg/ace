"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var LatexHighlightRules = require("./latex_highlight_rules").LatexHighlightRules;
var CstyleBehaviour = require("./behaviour/cstyle").CstyleBehaviour;
var LatexFoldMode = require("./folding/latex").FoldMode;

var Mode = function() {
    this.HighlightRules = LatexHighlightRules;
    this.foldingRules = new LatexFoldMode();
    this.$behaviour = new CstyleBehaviour({ braces: true });
};
oop.inherits(Mode, TextMode);

(function() {
    this.type = "text";
    
    this.lineCommentStart = "%";

    this.$id = "ace/mode/latex";

    this.snippetFileId = "ace/snippets/latex";
    
    this.getMatching = function(session, row, column) {
        if (row == undefined)
            row = session.selection.lead;
        if (typeof row == "object") {
            column = row.column;
            row = row.row;
        }

        var startToken = session.getTokenAt(row, column);
        if (!startToken)
            return;
        if (startToken.value == "\\begin" || startToken.value == "\\end") {
            return this.foldingRules.latexBlock(session, row, column, true);
        }
    };

    function wordDistances(doc, pos) {
        var macroName = /\\[a-zA-Z0-9]*/g;

        var words = [...doc.getValue().matchAll(macroName)];
        var wordScores = Object.create(null);

        var textBefore = doc.getTextRange(Range.fromPoints({
            row: 0,
            column: 0
        }, pos));
        var prefixPos = [...textBefore.matchAll(macroName)].length - 1;

        var words = [...doc.getValue().matchAll(macroName)];
        var wordScores = Object.create(null);

        var currentWord = words[prefixPos];

        words.forEach(function (word, idx) {
            if (!word || word === currentWord || word === "\\") return;

            var distance = Math.abs(prefixPos - idx);
            var score = words.length - distance;
            wordScores[word] = Math.max(score, wordScores[word] ?? 0);
        });
        return wordScores;
    }

    this.completer = {
        identifierRegexps: [/[\\a-zA-Z0-0]/],
        getCompletions: (editor, session, pos, prefix, callback) => {
            var wordScores = wordDistances(session, pos);
            var wordList = Object.keys(wordScores);
            callback(null, wordList.map(function (word) {
                return {
                    caption: word,
                    value: word,
                    score: wordScores[word],
                    meta: "macro",
                    completer: this,
                    completerId: this.id,
                };
            }, this));
        },
        triggerCharacters: ["\\"],
        id: "latexMacroCompleter",
    };
}).call(Mode.prototype);

exports.Mode = Mode;
