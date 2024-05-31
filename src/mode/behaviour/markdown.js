"use strict";

var oop = require("../../lib/oop");
var CstyleBehaviour = require("./cstyle").CstyleBehaviour;
var TokenIterator = require("../../token_iterator").TokenIterator;
var Range = require("../../range").Range;

var MarkdownBehaviour = function (options) {
    CstyleBehaviour.call(this);

    this.add("autoindent", "insertion", function (scope, action, editor, session, text) {
        if (scope.parent && scope.parent.name === "listBlock" && /\s{2,}/.test(text)) {
            var cursor = editor.getCursorPosition();
            if (cursor.row === 0) return;
            var line = session.getLine(cursor.row);
            var previousLine = session.getLine(cursor.row - 1);
            if (!/^\s*(?:[*+-]|\d{1,9}[.)])/.test(previousLine)) {
                return;
            }
            var iterator = new TokenIterator(session, cursor.row, cursor.column);
            var token = iterator.getCurrentToken();
            if (token && (/^markup\.list/.test(token.type) || token.type.indexOf("support.variable") !== -1)) {
                var indent = this.$getIndent(line);
                var nextIndent = indent + session.getTabString();
                var trimmedLine = line.replace(/^\s*/, "");
                let delta = cursor.column - indent.length;
                if (/^\s*\d{1,9}[.)]/.test(line)) { //numeric list
                    trimmedLine = trimmedLine.replace(/\d{1,9}([.)])/, "1$1");
                }
                session.doc.replace(new Range(cursor.row, 0, cursor.row, line.length - 1), nextIndent + trimmedLine);
                return {
                    text: "",
                    selection: [0, nextIndent.length + delta, 0, nextIndent.length + delta]
                };
            }
        }
    });

};

oop.inherits(MarkdownBehaviour, CstyleBehaviour);

exports.MarkdownBehaviour = MarkdownBehaviour;
