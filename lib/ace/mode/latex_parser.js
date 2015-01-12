define(function(require, exports, module) {
"use strict";

var WORD_REGEX = /^[a-zа-яё]+/i,
    // % * <foo@bar.com> 2015-01-12T00:17:27.829Z:
    COMMENT_REGEXP = /^\s*%\s([\*\^])\s\<(.+)\>\s(.+):$/;

var LatexParser = exports.LatexParser = function(bgTokenizer) {
    this.myErrors = [];
    this.myComments = [];
    this.myTokenizer = bgTokenizer;
};

(function(){
    this.setSpellingCheckDictionary = function(dictionary) {
        this.myDictionary = dictionary;
    };

    /**
     * Parse the document
     * @param doc           document object
     * @param doSpellcheck  true if we want spellcheck
     * @param doGetComments true if we want get text comments
     */
    this.go = function(doc, doSpellcheck, doGetComments) {
        if (doSpellcheck && this.myDictionary == null) {
            // can't spellcheck without dictionary
            doSpellcheck = false;
        }
        if (!doSpellcheck && !doGetComments) {
            // there is nothing to do
            return;
        }

        var lines = doc.getAllLines();

        this.myErrors = [];
        this.myComments = [];
        this.myUnfinishedCommentParsing = false;

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
                    case "comment":
                        doGetComments && parseRowForTextComments.call(this, token.value, row);
                        doSpellcheck && parseRowForSpellcheck.call(this, token.value, row, column);
                        break;
                    case "text":
                        doSpellcheck && parseRowForSpellcheck.call(this, token.value, row, column);
                        this.myUnfinishedCommentParsing = false;
                        break;
                    default:
                        // Skip tokens we don't want to parse
                        this.myUnfinishedCommentParsing = false;
                        break;
                }
            }
        }

        function parseRowForSpellcheck(tokenValue, row, column) {
            var words = this.splitTextToWords(tokenValue, row, column);
            for (var i = 0, wordsLength = words.length; i < wordsLength; ++i) {
                if (!this.myDictionary.check(words[i].value)) {
                    this.myErrors.push({
                        row: words[i].row,
                        column: words[i].column,
                        text: "grammar error",
                        type: "error",
                        raw: words[i].value
                    });
                }
            }
        };

        function parseRowForTextComments(tokenValue, row) {
            // comment format: % TYPE <EMAIL> DATETIME:
            // {
            //     TYPE: '*' for the first comment in discussion, '^' for replies
            //     EMAIL: any string
            //     DATETIME: any string
            // }
            var matchComment = tokenValue.match(COMMENT_REGEXP);
            if (matchComment) {
                this.myComments.push({
                    type: matchComment[1],
                    email: matchComment[2],
                    datetime: matchComment[3],
                    row: row,
                    text: []
                });
                this.myUnfinishedCommentParsing = true;
            } else if (this.myUnfinishedCommentParsing) {
                this.myComments[this.myComments.length - 1].text.push(tokenValue);
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

    this.getComments = function() {
        return this.myComments;
    };

}).call(LatexParser.prototype);

});
