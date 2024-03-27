"use strict";

var oop = require("../../lib/oop");
const {TokenIterator} = require("../../token_iterator");
var CstyleBehaviour = require("../behaviour/cstyle").CstyleBehaviour;
var XmlBehaviour = require("../behaviour/xml").XmlBehaviour;
var JavaScriptBehaviour = function () {
    var xmlBehaviours = new XmlBehaviour({closeCurlyBraces: true}).getBehaviours();
    this.addBehaviours(xmlBehaviours);
    this.inherit(CstyleBehaviour);

    this.add("autoclosing-fragment", "insertion", function (state, action, editor, session, text) {
        if (text == '>') {
            var position = editor.getSelectionRange().start;
            var iterator = new TokenIterator(session, position.row, position.column);
            var token = iterator.getCurrentToken() || iterator.stepBackward();
            if (!token) return;
            if (token.value == '<') {
                return {
                    text: "></>",
                    selection: [1, 1]
                };
            }
        }
    });
};

oop.inherits(JavaScriptBehaviour, CstyleBehaviour);

exports.JavaScriptBehaviour = JavaScriptBehaviour;
