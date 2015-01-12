define(function(require, exports, module) {
"use strict";

var WORD_REGEX = /^[a-zа-яё]+/i,
    // % * <foo@bar.com> 2015-01-12T00:17:27.829Z:
    DISCUSSION_COMMENT_REGEXP = /^\s*%\s([\*\^])\s\<(.+)\>\s(.+):$/;

var LatexParser = exports.LatexParser = function(bgTokenizer) {
    this.myErrors = [];
    this.myDiscussions = [];
    this.myTokenizer = bgTokenizer;
};

(function(){
    this.setSpellingCheckDictionary = function(dictionary) {
        this.myDictionary = dictionary;
    };

    /**
     * Parse the document
     * @param doc              document object
     * @param doSpellcheck     true if we want spellcheck
     * @param doGetDiscussions true if we want get text comments
     */
    this.go = function(doc, doSpellcheck, doGetDiscussions) {
        if (doSpellcheck && this.myDictionary == null) {
            // can't spellcheck without dictionary
            doSpellcheck = false;
        }
        if (!doSpellcheck && !doGetDiscussions) {
            // there is nothing to do
            return;
        }

        var lines = doc.getAllLines();

        this.myErrors = [];
        this.myDiscussions = [];
        this.myLastReadDiscussionComment = null;

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
                        doGetDiscussions && parseRowForDiscussions.call(this, token.value, row);
                        doSpellcheck && parseRowForSpellcheck.call(this, token.value, row, column);
                        break;
                    case "text":
                        doGetDiscussions && saveLastReadDiscussionComment.call(this);
                        doSpellcheck && parseRowForSpellcheck.call(this, token.value, row, column);
                        break;
                    default:
                        // Skip tokens we don't want to parse
                        doGetDiscussions && saveLastReadDiscussionComment.call(this);
                        break;
                }
            }
        }
        // save last read comment in case of the document ends with this comment
        doGetDiscussions && saveLastReadDiscussionComment.call(this);

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

        function parseRowForDiscussions(tokenValue, row) {
            // comment format: % TYPE <AUTHOR> DATETIME:
            // {
            //     TYPE: '*' for the first comment in discussion, '^' for replies
            //     AUTHOR: any string, e.g. email
            //     DATETIME: any string
            // }
            var matchComment = tokenValue.match(DISCUSSION_COMMENT_REGEXP);
            if (matchComment) {
                saveLastReadDiscussionComment.call(this);
                this.myLastReadDiscussionComment = {
                    type: matchComment[1],
                    author: matchComment[2],
                    datetime: matchComment[3],
                    row: row,
                    text: []
                };
            } else if (this.myLastReadDiscussionComment != null) {
                this.myLastReadDiscussionComment.text.push(tokenValue);
            }
        }

        function saveLastReadDiscussionComment() {
            if (this.myLastReadDiscussionComment != null) {
                this.myDiscussions.push(this.myLastReadDiscussionComment);
            }
            this.myLastReadDiscussionComment = null;
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

    this.getDiscussions = function() {
        return this.myDiscussions;
    };

}).call(LatexParser.prototype);

});
