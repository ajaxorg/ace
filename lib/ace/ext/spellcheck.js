define(function(require, exports, module) {
"use strict";

exports.contextMenuHandler = function(e){
    var host = e.target;
    var text = host.textInput.getElement();
    if (!host.selection.isEmpty())
        return;
    var c = host.getCursorPosition();
    var r = host.session.getWordRange(c.row, c.column);
    var w = host.session.getTextRange(r);

    host.session.tokenRe.lastIndex = 0;
    if (!host.session.tokenRe.test(w))
        return;
    var PLACEHOLDER = "\x01\x01";
    var value = w + " " + PLACEHOLDER;
    text.value = value;
    text.setSelectionRange(w.length + 1, w.length + 1);
    text.setSelectionRange(0, 0);

    host.textInput.setInputHandler(function(newVal) {
        if (newVal == value)
            return '';
        if (newVal.lastIndexOf(value) == newVal.length - value.length)
            return newVal.slice(0, -value.length);
        if (newVal.indexOf(value) === 0)
            return newVal.slice(value.length);
        if (newVal.slice(-2) == PLACEHOLDER) {
            var val = newVal.slice(0, -2);
            if (val.slice(-1) == " ") {
                val = val.slice(0, -1);
                host.session.replace(r, val);
                return "";
            }
        }
        
        return newVal;
    });
};
// todo support highlighting with typo.js
var Editor = require("../editor").Editor;
require("../config").defineOptions(Editor.prototype, "editor", {
    spellcheck: {
        set: function(val) {
            var text = this.textInput.getElement();
            text.spellcheck = !!val;
            if (!val)
                this.removeListener("nativecontextmenu", exports.contextMenuHandler);
            else
                this.on("nativecontextmenu", exports.contextMenuHandler);            
        },
        value: true
    }
});

});

