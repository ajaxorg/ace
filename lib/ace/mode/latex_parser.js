define(function(require, exports, module) {
"use strict";

var WORD_PATTERN = "[a-zA-Zа-яА-ЯёЁ]+";
var WORD_REGEX = new RegExp("^" + WORD_PATTERN);

var LatexParser = exports.LatexParser = function(bgTokenizer) {
    this.myErrors = [];
    this.myTokenizer = bgTokenizer;
};

(function(){

    this.go = function(doc, dictionary){
        if (dictionary == null) {
            return;
        }
        var lines = doc.getAllLines();

        this.myErrors = [];

        for (var row = 0, linesLength = lines.length; row < linesLength; ++row) {
            var line = lines[row];
            var tokens = this.myTokenizer.getTokens(row);

            var column = 0;
            for (var j = 0, tokenLength = tokens.length; j < tokenLength; ++j) {
                var token = tokens[j];

                var tokenColumn = line.slice(column).indexOf(token.value);
                if (tokenColumn != -1) {
                    column += tokenColumn;
                }

                switch(token.type) {
                    case "text": case "comment":
                        var words = this.splitTextToWords(token.value, row, column);
                        for (var i = 0, wordsLength = words.length; i < wordsLength; ++i) {
                            if (!dictionary.check(words[i].value)) {
                                this.myErrors.push({
                                    row: words[i].row,
                                    column: words[i].column,
                                    text: "grammar error",
                                    type: "error",
                                    raw: words[i].value
                                });
                            }
                        }
                        break;
                    default:
                        // Skip tokens we don't want to spellcheck
                        break;
                }
            }
        }
    };

    this.splitTextToWords = function(text, row, column) {
        var words = [];
        var pos = 0;
        while (pos < text.length) {
            var match = WORD_REGEX.exec(text.substr(pos));
            if (match) {
                words.push({
                    value: match[0],
                    row: row,
                    column: column + pos
                });
                pos += match[0].length;
            } else {
                pos++;
            }
        }
        return words;
    };

    this.getErrors = function() {
        return this.myErrors;
    };

}).call(LatexParser.prototype);

});
