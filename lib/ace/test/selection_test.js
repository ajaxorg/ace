/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

require("../../../support/paths");

var Document    = require("../document"),
    assert      = require("./assertions");

var Test = {
    createTextDocument : function(rows, cols) {
        var line = new Array(cols + 1).join("a");
        var text = new Array(rows).join(line + "\n") + line;
        return new Document(text);
    },

    "test: move cursor to end of file should place the cursor on last row and column" : function() {
        var doc = this.createTextDocument(200, 10);
        var selection = doc.getSelection();

        selection.moveCursorFileEnd();
        assert.position(selection.getCursor(), 199, 10);
    },

    "test: moveCursor to start of file should place the cursor on the first row and column" : function() {
        var doc = this.createTextDocument(200, 10);
        var selection = doc.getSelection();

        selection.moveCursorFileStart();
        assert.position(selection.getCursor(), 0, 0);
    },

    "test: move selection lead to end of file" : function() {
        var doc = this.createTextDocument(200, 10);
        var selection = doc.getSelection();

        selection.moveCursorTo(100, 5);
        selection.selectFileEnd();

        var range = selection.getRange();

        assert.position(range.start, 100, 5);
        assert.position(range.end, 199, 10);
    },

    "test: move selection lead to start of file" : function() {
        var doc = this.createTextDocument(200, 10);
        var selection = doc.getSelection();

        selection.moveCursorTo(100, 5);
        selection.selectFileStart();

        var range = selection.getRange();

        assert.position(range.start, 0, 0);
        assert.position(range.end, 100, 5);
    },

    "test: move cursor word right" : function() {
        var doc = new Document( ["ab",
                " Juhu Kinners (abc, 12)", " cde"].join("\n"));
        var selection = doc.getSelection();

        selection.moveCursorDown();
        assert.position(selection.getCursor(), 1, 0);

        selection.moveCursorWordRight();
        assert.position(selection.getCursor(), 1, 1);

        selection.moveCursorWordRight();
        assert.position(selection.getCursor(), 1, 5);

        selection.moveCursorWordRight();
        assert.position(selection.getCursor(), 1, 6);

        selection.moveCursorWordRight();
        assert.position(selection.getCursor(), 1, 13);

        selection.moveCursorWordRight();
        assert.position(selection.getCursor(), 1, 15);

        selection.moveCursorWordRight();
        assert.position(selection.getCursor(), 1, 18);

        selection.moveCursorWordRight();
        assert.position(selection.getCursor(), 1, 20);

        selection.moveCursorWordRight();
        assert.position(selection.getCursor(), 1, 22);

        selection.moveCursorWordRight();
        assert.position(selection.getCursor(), 1, 23);

        // wrap line
        selection.moveCursorWordRight();
        assert.position(selection.getCursor(), 2, 0);
    },

    "test: select word right if cursor in word" : function() {
        var doc = new Document("Juhu Kinners");
        var selection = doc.getSelection();

        selection.moveCursorTo(0, 2);
        selection.moveCursorWordRight();

        assert.position(selection.getCursor(), 0, 4);
    },

    "test: moveCursor word left" : function() {
        var doc = new Document( ["ab",
                                         " Juhu Kinners (abc, 12)", " cde"].join("\n"));
        var selection = doc.getSelection();

        selection.moveCursorDown();
        selection.moveCursorLineEnd();
        assert.position(selection.getCursor(), 1, 23);

        selection.moveCursorWordLeft();
        assert.position(selection.getCursor(), 1, 22);

        selection.moveCursorWordLeft();
        assert.position(selection.getCursor(), 1, 20);

        selection.moveCursorWordLeft();
        assert.position(selection.getCursor(), 1, 18);

        selection.moveCursorWordLeft();
        assert.position(selection.getCursor(), 1, 15);

        selection.moveCursorWordLeft();
        assert.position(selection.getCursor(), 1, 13);

        selection.moveCursorWordLeft();
        assert.position(selection.getCursor(), 1, 6);

        selection.moveCursorWordLeft();
        assert.position(selection.getCursor(), 1, 5);

        selection.moveCursorWordLeft();
        assert.position(selection.getCursor(), 1, 1);

        selection.moveCursorWordLeft();
        assert.position(selection.getCursor(), 1, 0);

        // wrap line
        selection.moveCursorWordLeft();
        assert.position(selection.getCursor(), 0, 2);
    },

    "test: select word left if cursor in word" : function() {
        var doc = new Document("Juhu Kinners");
        var selection = doc.getSelection();

        selection.moveCursorTo(0, 8);

        selection.moveCursorWordLeft();
        assert.position(selection.getCursor(), 0, 5);
    },

    "test: select word right and select" : function() {
        var doc = new Document("Juhu Kinners");
        var selection = doc.getSelection();

        selection.moveCursorTo(0, 0);
        selection.selectWordRight();

        var range = selection.getRange();

        assert.position(range.start, 0, 0);
        assert.position(range.end, 0, 4);
    },

    "test: select word left and select" : function() {
        var doc = new Document("Juhu Kinners");
        var selection = doc.getSelection();

        selection.moveCursorTo(0, 3);
        selection.selectWordLeft();

        var range = selection.getRange();

        assert.position(range.start, 0, 0);
        assert.position(range.end, 0, 3);
    },

    "test: select word with cursor in word should select the word" : function() {
        var doc = new Document("Juhu Kinners 123");
        var selection = doc.getSelection();

        selection.moveCursorTo(0, 8);
        selection.selectWord();

        var range = selection.getRange();
        assert.position(range.start, 0, 5);
        assert.position(range.end, 0, 12);
    },

    "test: select word with cursor betwen white space and word should select the word" : function() {
        var doc = new Document("Juhu Kinners");
        var selection = doc.getSelection();

        selection.moveCursorTo(0, 4);
        selection.selectWord();

        var range = selection.getRange();
        assert.position(range.start, 0, 0);
        assert.position(range.end, 0, 4);

        selection.moveCursorTo(0, 5);
        selection.selectWord();

        var range = selection.getRange();
        assert.position(range.start, 0, 5);
        assert.position(range.end, 0, 12);
    },

    "test: select word with cursor in white space should select white space" : function() {
        var doc = new Document("Juhu  Kinners");
        var selection = doc.getSelection();

        selection.moveCursorTo(0, 5);
        selection.selectWord();

        var range = selection.getRange();
        assert.position(range.start, 0, 4);
        assert.position(range.end, 0, 6);
    },

    "test: moving cursor should fire a 'changeCursor' event" : function() {
        var doc = new Document("Juhu  Kinners");
        var selection = doc.getSelection();

        selection.moveCursorTo(0, 5);

        var called = false;
        selection.addEventListener("changeCursor", function() {
           called = true;
        });

        selection.moveCursorTo(0, 6);
        assert.true(called);
    },

    "test: calling setCursor with the same position should not fire an event": function() {
        var doc = new Document("Juhu  Kinners");
        var selection = doc.getSelection();

        selection.moveCursorTo(0, 5);

        var called = false;
        selection.addEventListener("changeCursor", function() {
           called = true;
        });

        selection.moveCursorTo(0, 5);
        assert.false(called);
    }
};

module.exports = require("async/test").testcase(Test);

if (module === require.main)
    module.exports.exec()