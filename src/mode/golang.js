var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var GolangHighlightRules = require("./golang_highlight_rules").GolangHighlightRules;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;
var Range = require("../range").Range;

var Mode = function() {
    this.HighlightRules = GolangHighlightRules;
    this.foldingRules = new CStyleFoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    
    this.lineCommentStart = "//";
    this.blockComment = {start: "/*", end: "*/"};

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        var endState = tokenizedLine.state;

        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }
        
        if (state == "start") {
            var match = line.match(/^.*[\{\(\[]\s*$/);
            if (match) {
                indent += tab;
            }
        }

        return indent;
    };//end getNextLineIndent

    this.checkOutdent = function(state, line, input) {
        if (!/^\s+$/.test(line))
            return false;

        return /^\s*[})]/.test(input);
    };

    this.autoOutdent = function (state, doc, row) {
        var line = doc.getLine(row);
        var match = line.match(/^(\s*[})])/);
        if (!match) return 0;
        var column = match[1].length;
        var openBracePos = doc.findMatchingBracket({
            row: row,
            column: column
        });
        if (!openBracePos || openBracePos.row == row) return 0;
        var indent = this.$getIndent(doc.getLine(openBracePos.row));
        doc.replace(new Range(row, 0, row, column - 1), indent);
    };

    this.$id = "ace/mode/golang";
}).call(Mode.prototype);

exports.Mode = Mode;
