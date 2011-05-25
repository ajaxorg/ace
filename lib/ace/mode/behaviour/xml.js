define(function(require, exports, module) {

var oop = require("pilot/oop");
var Behaviour = require('ace/mode/behaviour').Behaviour;
var CstyleBehaviour = require('ace/mode/behaviour/cstyle').CstyleBehaviour;

var XmlBehaviour = function () {
    
    this.inherit(CstyleBehaviour, ["string_dquotes"]); // Get string behaviour
    
    this.add("brackets", "insertion", function (state, action, editor, session, text) {
        if (text == '<') {
            var selection = editor.getSelectionRange();
            var selected = session.doc.getTextRange(selection);
            if (selected !== "") {
                return false;
            } else {
                return {
                    text: '<>',
                    selection: [1, 1]
                }
            }
        } else if (text == '>') {
            var cursor = editor.getCursorPosition();
            var line = session.doc.getLine(cursor.row);
            var rightChar = line.substring(cursor.column, cursor.column + 1);
            if (rightChar == '>') { // need some kind of matching check here
                return {
                    text: '',
                    selection: [1, 1]
                }
            }
        } else if (text == "\n") {
            var cursor = editor.getCursorPosition();
            var line = session.doc.getLine(cursor.row);
            var rightChars = line.substring(cursor.column, cursor.column + 2);
            if (rightChars == '</') {
                var indent = this.$getIndent(session.doc.getLine(cursor.row)) + session.getTabString();
                var next_indent = this.$getIndent(session.doc.getLine(cursor.row));

                return {
                    text: '\n' + indent + '\n' + next_indent,
                    selection: [1, indent.length, 1, indent.length]
                }
            }
        }
        return false;
    });
    
}
oop.inherits(XmlBehaviour, Behaviour);

exports.XmlBehaviour = XmlBehaviour;
});