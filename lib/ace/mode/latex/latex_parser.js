define(function(require, exports, module) {
"use strict";

var LaTeXLexer = require("./latex_lexer").LaTeXLexer;
var Typo = require("../../lib/typo").Typo;
var net = require("../../lib/net");

var WORD_PATTERN = "[a-zA-Z]+(\-[a-zA-Z]+)?";
var WORD_REGEX = new RegExp("^" + WORD_PATTERN);

var LaTeXParser = exports.LaTeXParser = function() {
    this.$rules = [
        {
          // A tex command e.g. \foo
          token : "KEYWORD",
          regex : "\\\\(?:[^a-zA-Z]|[a-zA-Z]+)\\*?"
        }, {
          // Inline math between two $ symbols
          token : "STRING",
          regex : "\\$(?:(?:\\\\.)|(?:[^\\$\\\\]))*?\\$"
        }, {
          // A comment. Tex comments start with % and go to the end of the line
          token : "COMMENT",
          regex : "%.*"
        }, {
          // A simple word e.g. foobar or foo-bar
          token : "WORD",
          regex : WORD_PATTERN
        }, {
          // One of the symbols from: [{]}!"'#$%&()*+,-./:;<=>?@^_`{|}~ + whitespace
          token : "SYMBOL",
          regex : "[\\\[\\\{\\\]\\\}\\\!\\\"\\\'\\\#\\\$\\\%\\\&\\\(\\\)\\\*\\\+\\\,\\\-\\\.\\\/\\\:\\\;\\\<\\\=\\\>\\\?\\\@\\\^\\\_\\\`\\\|\\\~\\\s]"
        }, {
          // Word starting with a number e.g. 8-bit or 2pack
          token : "NUMBER_WORD",
          regex : "[0-9]+\-?[a-zA-Z]+"
        }, {
          token : "NUMBER",
          regex : "[0-9]+"
        }, {
          token : "OTHER",
          regex : ".*"
        }
    ];
    this.$lexer = new LaTeXLexer(this.$rules);
    this.$errors = [];
    this.$dictionary = null;
};

(function(){
    this.go = function(inputValue){
        if (!this.$dictionary) {
            return;
        }
        this.$lexer.setInput(inputValue);
        this.$errors = [];
        var token;
        while (token = this.$lexer.nextToken()) {
            switch(token.name) {
                case "WORD":
                    this.$spellCheck(token.value, token.row, token.column);
                    break;
                case "COMMENT":
                    var words = this.$splitCommentToWords(token);
                    for (var i in words) {
                        this.$spellCheck(words[i].value, words[i].row, words[i].column);
                    }
                    break;
                default:
                    // Skip tokens we don't want to spellcheck
                    break;
            }
        }
    };

    this.$spellCheck = function(word, row, column) {
        if (!this.$dictionary.check(word)) {
            this.$errors.push({
                row: row,
                column: column,
                text: "grammar error",
                type: "error",
                raw: word
            });
        }
    };

    this.$splitCommentToWords = function(token) {
        var words = [];
        var pos = 0;
        while (pos < token.value.length) {
            var match = WORD_REGEX.exec(token.value.substr(pos));
            if (match) {
                words.push({
                    value: match[0],
                    row: token.row,
                    column: token.column + pos
                });
                pos += match[0].length;
            } else {
                pos++;
            }
        }
        return words;
    };

    this.getErrors = function() {
        return this.$errors;
    };

    this.setDictionary = function(lang, dicPath, affPath) {
      net.get(dicPath, function(dicData){
          net.get(affPath, function(affData) {
              console.log("Dictionary has been loaded successfully");
              this.$dictionary = new Typo(lang, affData, dicData);
          });
      });
    };

}).call(LaTeXParser.prototype);

});
