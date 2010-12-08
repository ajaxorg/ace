/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
require.def("ace/mode/Python",
    [
        "ace/lib/oop",
        "ace/mode/Text",
        "ace/Tokenizer",
        "ace/mode/PythonHighlightRules",
        "ace/mode/MatchingBraceOutdent",
        "ace/Range"
    ], function(oop, TextMode, Tokenizer, PythonHighlightRules, MatchingBraceOutdent, Range) {

var Python = function() {
    this.$tokenizer = new Tokenizer(new PythonHighlightRules().getRules());
    this.$outdent = new MatchingBraceOutdent();
};
oop.inherits(Python, TextMode);

(function() {

    this.toggleCommentLines = function(state, doc, range) {
        var outdent = true;
        var outentedRows = [];
        var re = /^(\s*)#/;

        for (var i=range.start.row; i<= range.end.row; i++) {
            if (!re.test(doc.getLine(i))) {
                outdent = false;
                break;
            }
        }

        if (outdent) {
            var deleteRange = new Range(0, 0, 0, 0);
            for (var i=range.start.row; i<= range.end.row; i++)
            {
                var line = doc.getLine(i).replace(re, "$1");
                deleteRange.start.row = i;
                deleteRange.end.row = i;
                deleteRange.end.column = line.length + 2;
                doc.replace(deleteRange, line);
            }
            return -2;
        }
        else {
            return doc.indentRows(range, "#");
        }
    };

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.$tokenizer.getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        var endState = tokenizedLine.state;

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

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        return this.$outdent.autoOutdent(doc, row);
    };

}).call(Python.prototype);

return Python;
});
