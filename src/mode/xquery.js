"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var XQueryHighlightRules = require("./xquery_highlight_rules").XQueryHighlightRules;
var Range = require("../range").Range;
var XQueryBehaviour = require("./behaviour/xquery").XQueryBehaviour;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = XQueryHighlightRules;
    this.$behaviour   = new XQueryBehaviour();
    this.foldingRules = new CStyleFoldMode();
};

oop.inherits(Mode, TextMode);

(function() {

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);
        var match = line.match(/\s*(?:then|else|return|[{\(]|<\w+>)\s*$/);
        if (match)
            indent += tab;
        return indent;
    };
    
    this.checkOutdent = function(state, line, input) {
        if (! /^\s+$/.test(line))
            return false;

        return (/^\s*[\}\)]/).test(input);
    };
    
    this.autoOutdent = function(state, doc, row) {
        var line = doc.getLine(row);
        var match = line.match(/^(\s*[\}\)])/);

        if (!match) return 0;

        var column = match[1].length;
        var openBracePos = doc.findMatchingBracket({row: row, column: column});

        if (!openBracePos || openBracePos.row == row) return 0;

        var indent = this.$getIndent(doc.getLine(openBracePos.row));
        doc.replace(new Range(row, 0, row, column-1), indent);
    };

    this.toggleCommentLines = function(state, doc, startRow, endRow) {
        var i, line;
        var outdent = true;
        var re = /^\s*\(:(.*):\)/;

        for (i=startRow; i<= endRow; i++) {
            if (!re.test(doc.getLine(i))) {
                outdent = false;
                break;
            }
        }

        var range = new Range(0, 0, 0, 0);
        for (i=startRow; i<= endRow; i++) {
            line = doc.getLine(i);
            range.start.row  = i;
            range.end.row    = i;
            range.end.column = line.length;

            doc.replace(range, outdent ? line.match(re)[1] : "(:" + line + ":)");
        }
    };
    this.$id = "ace/mode/xquery";
}).call(Mode.prototype);

exports.Mode = Mode;
