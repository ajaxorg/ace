if (typeof process !== "undefined") {
    require("amd-loader");
    require("./test/mockdom");
}

"use strict";

var EditSession = require("./edit_session").EditSession;
var Editor = require("./editor").Editor;
var MockRenderer = require("./test/mockrenderer").MockRenderer;
var assert = require("./test/assertions");

module.exports = {
    createEditSession : function(rows, cols) {
        var line = new Array(cols + 1).join("a");
        var text = new Array(rows).join(line + "\n") + line;
        return new EditSession(text);
    },

    "test: navigate to end of file should scroll the last line into view" : function() {
        var doc = this.createEditSession(200, 10);
        var editor = new Editor(new MockRenderer(), doc);

        editor.execCommand("gotoend");
        var cursor = editor.getCursorPosition();

        assert.ok(editor.getFirstVisibleRow() <= cursor.row);
        assert.ok(editor.getLastVisibleRow() >= cursor.row);
    },

    "test: navigate to start of file should scroll the first row into view" : function() {
        var doc = this.createEditSession(200, 10);
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(editor.getLastVisibleRow() + 20);
        editor.execCommand("gotostart");

        assert.equal(editor.getFirstVisibleRow(), 0);
    },

    "test: goto hidden line should scroll the line into the middle of the viewport" : function() {
        var editor = new Editor(new MockRenderer(), this.createEditSession(200, 5));

        editor.navigateTo(0, 0);
        editor.renderer.scrollCursorIntoView();
        editor.gotoLine(101);
        assert.position(editor.getCursorPosition(), 100, 0);
        assert.equal(editor.getFirstVisibleRow(), 89);

        editor.navigateTo(100, 0);
        editor.renderer.scrollCursorIntoView();
        editor.gotoLine(11);
        assert.position(editor.getCursorPosition(), 10, 0);
        assert.equal(editor.getFirstVisibleRow(), 0);

        editor.navigateTo(100, 0);
        editor.renderer.scrollCursorIntoView();
        editor.gotoLine(6);
        assert.position(editor.getCursorPosition(), 5, 0);
        assert.equal(0, editor.getFirstVisibleRow(), 0);

        editor.navigateTo(100, 0);
        editor.renderer.scrollCursorIntoView();
        editor.gotoLine(1);
        assert.position(editor.getCursorPosition(), 0, 0);
        assert.equal(editor.getFirstVisibleRow(), 0);

        editor.navigateTo(0, 0);
        editor.renderer.scrollCursorIntoView();
        editor.gotoLine(191);
        assert.position(editor.getCursorPosition(), 190, 0);
        assert.equal(editor.getFirstVisibleRow(), 179);

        editor.navigateTo(0, 0);
        editor.renderer.scrollCursorIntoView();
        editor.gotoLine(196);
        assert.position(editor.getCursorPosition(), 195, 0);
        assert.equal(editor.getFirstVisibleRow(), 180);
    },

    "test: goto visible line should only move the cursor and not scroll": function() {
        var editor = new Editor(new MockRenderer(), this.createEditSession(200, 5));

        editor.navigateTo(0, 0);
        editor.renderer.scrollCursorIntoView();
        editor.gotoLine(12);
        assert.position(editor.getCursorPosition(), 11, 0);
        assert.equal(editor.getFirstVisibleRow(), 0);

        editor.navigateTo(30, 0);
        editor.renderer.scrollCursorIntoView();
        editor.gotoLine(33);
        assert.position(editor.getCursorPosition(), 32, 0);
        assert.equal(editor.getFirstVisibleRow(), 30);
    },

    "test: navigate from the end of a long line down to a short line and back should maintain the curser column": function() {
        var editor = new Editor(new MockRenderer(), new EditSession(["123456", "1"]));

        editor.navigateTo(0, 6);
        assert.position(editor.getCursorPosition(), 0, 6);

        editor.navigateDown();
        assert.position(editor.getCursorPosition(), 1, 1);

        editor.navigateUp();
        assert.position(editor.getCursorPosition(), 0, 6);
    },

    "test: reset desired column on navigate left or right": function() {
        var editor = new Editor(new MockRenderer(), new EditSession(["123456", "12"]));

        editor.navigateTo(0, 6);
        assert.position(editor.getCursorPosition(), 0, 6);

        editor.navigateDown();
        assert.position(editor.getCursorPosition(), 1, 2);

        editor.navigateLeft();
        assert.position(editor.getCursorPosition(), 1, 1);

        editor.navigateUp();
        assert.position(editor.getCursorPosition(), 0, 1);
    },

    "test: navigate within soft tabs based on setting": function() {
        var editor = new Editor(new MockRenderer(), new EditSession(["        "]));

        editor.getSession().setUseSoftTabs(true);
        editor.getSession().setTabSize(4);

        editor.navigateTo(0, 0);
        editor.navigateRight();
        assert.position(editor.getCursorPosition(), 0, 4);

        editor.navigateLeft();
        assert.position(editor.getCursorPosition(), 0, 0);

        editor.getSession().setNavigateWithinSoftTabs(true);

        editor.navigateRight();
        assert.position(editor.getCursorPosition(), 0, 1);

        editor.navigateTo(0, 4);
        editor.navigateLeft();
        assert.position(editor.getCursorPosition(), 0, 3);
    },
    
    "test: typing text should update the desired column": function() {
        var editor = new Editor(new MockRenderer(), new EditSession(["1234", "1234567890"]));

        editor.navigateTo(0, 3);
        editor.insert("juhu");
        
        editor.navigateDown();
        assert.position(editor.getCursorPosition(), 1, 7);
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
