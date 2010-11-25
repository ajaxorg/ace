/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

require("../../../support/paths");

var dom     = require('jsdom/level2/html').dom.level2.html;
var browser = require('jsdom/browser/index').windowAugmentation(dom);

global.document     = browser.document;
global.window       = browser.window;
global.self         = browser.self;
global.navigator    = browser.navigator;
global.location     = browser.location;

var Document        = require("../Document"),
    Editor          = require("../Editor"),
    MockRenderer    = require("./mockrenderer"),
    assert          = require("./assertions");
    

var Test = {
    createTextDocument : function(rows, cols) {
        var line = new Array(cols + 1).join("a");
        var text = new Array(rows).join(line + "\n") + line;
        return new Document(text);
    },

    "test: navigate to end of file should scroll the last line into view" : function() {
        var doc = this.createTextDocument(200, 10);
        var editor = new Editor(new MockRenderer(), doc);

        editor.navigateFileEnd();
        var cursor = editor.getCursorPosition();

        assert.true(editor.getFirstVisibleRow() <= cursor.row);
        assert.true(editor.getLastVisibleRow() >= cursor.row);
    },

    "test: navigate to start of file should scroll the first row into view" : function() {
        var doc = this.createTextDocument(200, 10);
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(editor.getLastVisibleRow() + 20);
        editor.navigateFileStart();

        assert.equal(editor.getFirstVisibleRow(), 0);
    },

    "test: goto hidden line should scroll the line into the middle of the viewport" : function() {
        var editor = new Editor(new MockRenderer(), this.createTextDocument(200, 5));

        editor.navigateTo(0, 0);
        editor.gotoLine(101);
        assert.position(editor.getCursorPosition(), 100, 0);
        assert.equal(editor.getFirstVisibleRow(), 90);

        editor.navigateTo(100, 0);
        editor.gotoLine(11);
        assert.position(editor.getCursorPosition(), 10, 0);
        assert.equal(editor.getFirstVisibleRow(), 0);

        editor.navigateTo(100, 0);
        editor.gotoLine(6);
        assert.position(editor.getCursorPosition(), 5, 0);
        assert.equal(0, editor.getFirstVisibleRow(), 0);

        editor.navigateTo(100, 0);
        editor.gotoLine(1);
        assert.position(editor.getCursorPosition(), 0, 0);
        assert.equal(editor.getFirstVisibleRow(), 0);

        editor.navigateTo(0, 0);
        editor.gotoLine(191);
        assert.position(editor.getCursorPosition(), 190, 0);
        assert.equal(editor.getFirstVisibleRow(), 180);

        editor.navigateTo(0, 0);
        editor.gotoLine(196);
        assert.position(editor.getCursorPosition(), 195, 0);
        assert.equal(editor.getFirstVisibleRow(), 180);
    },

    "test: goto visible line should only move the cursor and not scroll": function() {
        var editor = new Editor(new MockRenderer(), this.createTextDocument(200, 5));

        editor.navigateTo(0, 0);
        editor.gotoLine(12);
        assert.position(editor.getCursorPosition(), 11, 0);
        assert.equal(editor.getFirstVisibleRow(), 0);

        editor.navigateTo(30, 0);
        editor.gotoLine(33);
        assert.position(editor.getCursorPosition(), 32, 0);
        assert.equal(editor.getFirstVisibleRow(), 30);
    },

    "test: navigate from the end of a long line down to a short line and back should maintain the curser column": function() {
        var editor = new Editor(new MockRenderer(), new Document(["123456", "1"]));

        editor.navigateTo(0, 6);
        assert.position(editor.getCursorPosition(), 0, 6);

        editor.navigateDown();
        assert.position(editor.getCursorPosition(), 1, 1);

        editor.navigateUp();
        assert.position(editor.getCursorPosition(), 0, 6);
    },

    "test: reset desired column on navigate left or right": function() {
        var editor = new Editor(new MockRenderer(), new Document(["123456", "12"]));

        editor.navigateTo(0, 6);
        assert.position(editor.getCursorPosition(), 0, 6);

        editor.navigateDown();
        assert.position(editor.getCursorPosition(), 1, 2);

        editor.navigateLeft();
        assert.position(editor.getCursorPosition(), 1, 1);

        editor.navigateUp();
        assert.position(editor.getCursorPosition(), 0, 1);
    }
};

module.exports = require("async/test").testcase(Test)

if (module === require.main)
    module.exports.exec()