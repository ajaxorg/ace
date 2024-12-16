"use strict";

var assert = require("./../test/assertions");
require("./../test/mockdom");
var ace = require("../ace");
var hardWrap = require("./hardwrap").hardWrap;
var editor;

module.exports = {
    setUp: function() {
        if (!editor) {
            editor = ace.edit(null);
        }
        editor.focus();
    },
    tearDown: function() {
        if (editor) {
            editor.destroy();
            editor.container.remove();
            editor = null;
        }
    },
    "test: split lines": function() {
        editor.setValue("line 1 longword line 2");
        hardWrap(editor, {column: 12, startRow: 0, endRow: 2});
        assert.equal(editor.getValue(), "line 1\nlongword\nline 2");
        
        editor.setValue("line1longword line 2");
        hardWrap(editor, {column: 12, startRow: 0, endRow: 2});
        assert.equal(editor.getValue(), "line1longword\nline 2");
        
        editor.setValue("line1longword    ");
        hardWrap(editor, {column: 12, startRow: 0, endRow: 2});
        assert.equal(editor.getValue(), "line1longword\n");
        
        editor.setValue("line 1               line 2");
        hardWrap(editor, {column: 12, startRow: 0, endRow: 2});
        assert.equal(editor.getValue(), "line 1\nline 2");
        
        editor.setValue("line 1  line 2");
        hardWrap(editor, {column: 6, startRow: 0, endRow: 2});
        assert.equal(editor.getValue(), "line 1\nline 2");
        
        editor.setValue("line 1");
        hardWrap(editor, {column: 10, startRow: 0, endRow: 2});
        assert.equal(editor.getValue(), "line 1");
    },
    
    "test: merge lines": function() {
        editor.setValue("line \n \t 1   \nlongword\nline \n 2");
        hardWrap(editor, {column: 12, startRow: 0, endRow: 4});
        assert.equal(editor.getValue(), "line 1\nlongword\nline 2");
        
        editor.setValue("line \n 1 \n longword \n line \n2 a longer line");
        hardWrap(editor, {column: 12, startRow: 0, endRow: 4, allowMerge: false});
        assert.equal(editor.getValue(), "line \n 1 \n longword \n line \n2 a longer\nline");
    },

    "test: keep indentation": function() {
        var value = "hello\n    long long text\n unchanged next line";
        editor.setValue(value);
        hardWrap(editor, {column: 12, startRow: 1, endRow: 1});
        assert.equal(editor.getValue(), "hello\n    long\n    long\n    text\n unchanged next line");
        hardWrap(editor, {column: 80, startRow: 1, endRow: 3});
        assert.equal(editor.getValue(), value);
    },

    "test: wrap as you type": function() {
        editor.setValue("hello\n    long long text\n unchanged next line", -1);
        editor.execCommand("golinedown");
        editor.execCommand("gotolineend");
        editor.execCommand("insertstring", " ");
        editor.execCommand("insertstring", "t");
        assert.equal(editor.session.getLine(1), "    long long text t");
        editor.setOptions({printMargin: 12, hardWrap: true});
        editor.execCommand("insertstring", " ");
        assert.equal(editor.session.getLine(1), "    long long text t ");
        editor.execCommand("insertstring", "x");
        assert.equal(editor.getValue(), "hello\n    long\n    long\n    text t x\n unchanged next line");
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
