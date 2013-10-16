define(function(require, exports, module) {
"use strict";

var LaTeXLexer = exports.LaTeXLexer = function(rules) {
    this.$rules = [];
    this.$buffer = "";
    this.$position = 0;
    this.$row = 0;
    this.$column = 0;

    this.setRules(rules);
};

(function(){

    this.setInput = function(buffer, position) {
        this.$position = typeof position !== 'undefined' ? position : 0;
        this.$buffer = buffer;
        this.$row = 0;
        this.$column = 0;
    }

    this.setRules = function(rules) {
        for (var i = 0; i < rules.length; ++i) {
            this.addRule({
                regex: new RegExp("^" + rules[i].regex),
                token: rules[i].token
            });
        }
    }

    this.addRule = function(rule) {
        this.$rules.push(rule);
    }

    this.nextToken = function() {
        // end of document
        if (this.$position >= this.$buffer.length) {
            return null;
        }

        this.$skipSpacesAndNewLines();

        for (var i = 0; i < this.$rules.length; ++i) {
            var rule = this.$rules[i];
            var match = rule.regex.exec(this.$buffer.substr(this.$position));
            if (match) {
                var token = {
                    name: rule.token,
                    value: match[0],
                    row: this.$row,
                    column: this.$column,
                    position: this.$position
                };
                this.$position += match[0].length;
                this.$column += match[0].length;
                return token;
            }
        }

        // It should be sort of magic to reach this place (because we set token OTHER with ".*" regex, but anyway
        throw Error("Can't match a token at position " + this.$position + " ( " + this.$row + " : " + this.$column + ")");
    }

    this.$skipSpacesAndNewLines = function() {
        while (this.$position < this.$buffer.length) {
            var c = this.$buffer.charAt(this.$position);
            if (c == ' ' || c == '\t') {
                this.$position++;
                this.$column++;
            } else if (c == '\r' || c == '\n'){
                this.$position++;
                this.$row++;
                this.$column = 0;
            } else {
                break;
            }
        }
    }

}).call(LaTeXLexer.prototype);

});
