/*global CustomEvent*/
 
if (typeof process !== "undefined") {
    require("amd-loader");
}

"use strict";

var assert = require("./../test/assertions");
require("./../test/mockdom");
var ace = require("../ace");
var editor, changes, textarea;

module.exports = {
    setUp: function() {
        if (!editor) {
            editor = ace.edit(null);
            document.body.appendChild(editor.container);
            editor.container.style.height = "200px";
            editor.container.style.width = "300px";
            editor.container.style.position = "absolute";
            editor.container.style.outline = "solid";
            editor.on("change", function(e) {
                changes.push(e);
            });
        }
        changes = [];
        editor.focus();
    },
    tearDown: function() {
        if (editor) {
            editor.destroy();
            editor.container.remove();
            editor = textarea = null;
        }
    },
    "test: simple text input": function() {
        editor.session.setValue("1\nerror 2 warning\n3\n4 info\n5\n6\n");
        editor.execCommand("goToNextError");
        editor.resize(true);
        assert.ok(/Looks good/.test(editor.container.innerHTML));
        
        editor.$search.$options.needle = /[a-z]+/gim;
        var ranges = editor.$search.findAll(editor.session);
        
        editor.session.setAnnotations(ranges.map(function(r) {
            var type = editor.session.getTextRange(r);
            return {
                row: r.start.row,
                column: r.start.column,
                text: type + " " + r,
                type: type
            };
        }));
        editor.execCommand("goToNextError");
        editor.renderer.$loop._flush();
        assert.ok(/error_widget/.test(editor.container.innerHTML));
        editor.execCommand("insertstring", "\n");
        editor.renderer.$loop._flush();
        assert.notOk(/error_widget/.test(editor.container.innerHTML));
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
