"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

// see http://cirru.org for more about this language
var CirruHighlightRules = function() {
    this.$rules = {
        start: [{
            token: 'constant.numeric',
            regex: /[\d\.]+/
        }, {
            token: 'comment.line.double-dash',
            regex: /--/,
            next: 'comment'
        }, {
            token: 'storage.modifier',
            regex: /\(/
        }, {
            token: 'storage.modifier',
            regex: /,/,
            next: 'line'
        }, {
            token: 'support.function',
            regex: /[^\(\)"\s{}\[\]]+/,
            next: 'line'
        }, {
            token: 'string.quoted.double',
            regex: /"/,
            next: 'string'
        }, {
            token: 'storage.modifier',
            regex: /\)/
        }],
        comment: [{
            token: 'comment.line.double-dash',
            regex: / +[^\n]+/,
            next: 'start'
        }],
        string: [{
            token: 'string.quoted.double',
            regex: /"/,
            next: 'line'
        }, {
            token: 'constant.character.escape',
            regex: /\\/,
            next: 'escape'
        }, {
            token: 'string.quoted.double',
            regex: /[^\\"]+/
        }],
        escape: [{
            token: 'constant.character.escape',
            regex: /./,
            next: 'string'
        }],
        line: [{
            token: 'constant.numeric',
            regex: /[\d\.]+/
        }, {
            token: 'markup.raw',
            regex: /^\s*/,
            next: 'start'
        }, {
            token: 'storage.modifier',
            regex: /\$/,
            next: 'start'
        }, {
            token: 'variable.parameter',
            regex: /[^\(\)"\s{}\[\]]+/
        }, {
            token: 'storage.modifier',
            regex: /\(/,
            next: 'start'
        }, {
            token: 'storage.modifier',
            regex: /\)/
        }, {
            token: 'markup.raw',
            regex: /^ */,
            next: 'start'
        }, {
            token: 'string.quoted.double',
            regex: /"/,
            next: 'string'
        }]
    };

};

oop.inherits(CirruHighlightRules, TextHighlightRules);

exports.CirruHighlightRules = CirruHighlightRules;
