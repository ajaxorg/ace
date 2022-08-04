"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var MazeHighlightRules = function() {
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        start: [{
            token: "keyword.control",
            regex: /##|``/,
            comment: "Wall"
        }, {
            token: "entity.name.tag",
            regex: /\.\./,
            comment: "Path"
        }, {
            token: "keyword.control",
            regex: /<>/,
            comment: "Splitter"
        }, {
            token: "entity.name.tag",
            regex: /\*[\*A-Za-z0-9]/,
            comment: "Signal"
        }, {
            token: "constant.numeric",
            regex: /[0-9]{2}/,
            comment: "Pause"
        }, {
            token: "keyword.control",
            regex: /\^\^/,
            comment: "Start"
        }, {
            token: "keyword.control",
            regex: /\(\)/,
            comment: "Hole"
        }, {
            token: "support.function",
            regex: />>/,
            comment: "Out"
        }, {
            token: "support.function",
            regex: />\//,
            comment: "Ln Out"
        }, {
            token: "support.function",
            regex: /<</,
            comment: "In"
        }, {
            token: "keyword.control",
            regex: /--/,
            comment: "One use"
        }, {
            token: "constant.language",
            regex: /%[LRUDNlrudn]/,
            comment: "Direction"
        }, {
            token: [
                "entity.name.function",
                "keyword.other",
                "keyword.operator",
                "keyword.other",
                "keyword.operator",
                "constant.numeric",
                "keyword.operator",
                "keyword.other",
                "keyword.operator",
                "constant.numeric",
                "string.quoted.double",
                "string.quoted.single"
            ],
            regex: /([A-Za-z][A-Za-z0-9])( *-> *)(?:([-+*\/]=)( *)((?:-)?)([0-9]+)|(=)( *)(?:((?:-)?)([0-9]+)|("[^"]*")|('[^']*')))/,
            comment: "Assignment function"
        }, {
            token: [
                "entity.name.function",
                "keyword.other",
                "keyword.control",
                "keyword.other",
                "keyword.operator",
                "keyword.other",
                "keyword.operator",
                "constant.numeric",
                "entity.name.tag",
                "keyword.other",
                "keyword.control",
                "keyword.other",
                "constant.language",
                "keyword.other",
                "keyword.control",
                "keyword.other",
                "constant.language"
            ],
            regex: /([A-Za-z][A-Za-z0-9])( *-> *)(IF|if)( *)(?:([<>]=?|==)( *)((?:-)?)([0-9]+)|(\*[\*A-Za-z0-9]))( *)(THEN|then)( *)(%[LRUDNlrudn])(?:( *)(ELSE|else)( *)(%[LRUDNlrudn]))?/,
            comment: "Equality Function"
        }, {
            token: "entity.name.function",
            regex: /[A-Za-z][A-Za-z0-9]/,
            comment: "Function cell"
        }, {
            token: "comment.line.double-slash",
            regex: / *\/\/.*/,
            comment: "Comment"
        }]
    };

    this.normalizeRules();
};

MazeHighlightRules.metaData = {
    fileTypes: ["mz"],
    name: "Maze",
    scopeName: "source.maze"
};


oop.inherits(MazeHighlightRules, TextHighlightRules);

exports.MazeHighlightRules = MazeHighlightRules;
