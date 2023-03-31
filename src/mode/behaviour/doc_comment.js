"use strict";

var oop = require("../../lib/oop");
var CstyleBehaviour = require("./cstyle").CstyleBehaviour;

var DocCommentBehaviour = function () {

    this.inherit(CstyleBehaviour);
    
    this.add("doc comment end", "insertion", function (state, action, editor, session, text) {
        if (state === "doc-start" && (text === "\n" || text === "\r\n") && editor.selection.isEmpty()) {
            var cursor = editor.getCursorPosition();
            var line = session.doc.getLine(cursor.row);
            var nextLine = session.doc.getLine(cursor.row + 1);
            var indent = this.$getIndent(line);
            if (/\s*\*/.test(nextLine)) {
                if (/^\s*\*/.test(line)) {
                    return {
                        text: text + indent + "* ",
                        selection: [1, 3 + indent.length, 1, 3 + indent.length]
                    };
                }
                else {
                    return {
                        text: text + indent + " * ",
                        selection: [1, 3 + indent.length, 1, 3 + indent.length]
                    };
                }

            }
            if (/\/\*\*/.test(line.substring(0, cursor.column))) {
                return {
                    text: text + indent + " * " + text + " " + indent + "*/",
                    selection: [1, 4 + indent.length, 1, 4 + indent.length]
                };
            }
        }
    });

};
oop.inherits(DocCommentBehaviour, CstyleBehaviour);

exports.DocCommentBehaviour = DocCommentBehaviour;
