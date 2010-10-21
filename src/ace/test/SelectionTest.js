/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

require.def([
     "ace/Document"
 ], function(
     Document
 ) {

var SelectionTest = TestCase("SelectionTest",
{
    createTextDocument : function(rows, cols) {
        var line = new Array(cols + 1).join("a");
        var text = new Array(rows).join(line + "\n") + line;
        return new Document(text);
    },

    "test: move cursor to end of file should place the cursor on last row and column" : function() {
        var doc = this.createTextDocument(200, 10);
        var selection = doc.getSelection();

        selection.moveCursorFileEnd();
        assertPosition(199, 10, selection.getCursor());
    },

    "test: moveCursor to start of file should place the cursor on the first row and column" : function() {
        var doc = this.createTextDocument(200, 10);
        var selection = doc.getSelection();

        selection.moveCursorFileStart();
        assertPosition(0, 0, selection.getCursor());
    },

    "test: move selection lead to end of file" : function() {
        var doc = this.createTextDocument(200, 10);
        var selection = doc.getSelection();

        selection.moveCursorTo(100, 5);
        selection.selectFileEnd();

        var range = selection.getRange();

        assertPosition(100, 5, range.start);
        assertPosition(199, 10, range.end);
    },

    "test: move selection lead to start of file" : function() {
        var doc = this.createTextDocument(200, 10);
        var selection = doc.getSelection();

        selection.moveCursorTo(100, 5);
        selection.selectFileStart();

        var range = selection.getRange();

        assertPosition(0, 0, range.start);
        assertPosition(100, 5, range.end);
    },

    "test: move cursor word right" : function() {
        var doc = new Document( ["ab",
                " Juhu Kinners (abc, 12)", " cde"].join("\n"));
        var selection = doc.getSelection();

        selection.moveCursorDown();
        assertPosition(1, 0, selection.getCursor());

        selection.moveCursorWordRight();
        assertPosition(1, 1, selection.getCursor());

        selection.moveCursorWordRight();
        assertPosition(1, 5, selection.getCursor());

        selection.moveCursorWordRight();
        assertPosition(1, 6, selection.getCursor());

        selection.moveCursorWordRight();
        assertPosition(1, 13, selection.getCursor());

        selection.moveCursorWordRight();
        assertPosition(1, 15, selection.getCursor());

        selection.moveCursorWordRight();
        assertPosition(1, 18, selection.getCursor());

        selection.moveCursorWordRight();
        assertPosition(1, 20, selection.getCursor());

        selection.moveCursorWordRight();
        assertPosition(1, 22, selection.getCursor());

        selection.moveCursorWordRight();
        assertPosition(1, 23, selection.getCursor());

        // wrap line
        selection.moveCursorWordRight();
        assertPosition(2, 0, selection.getCursor());
    },

    "test: select word right if cursor in word" : function() {
        var doc = new Document("Juhu Kinners");
        var selection = doc.getSelection();

        selection.moveCursorTo(0, 2);
        selection.moveCursorWordRight();

        assertPosition(0, 4, selection.getCursor());
    },

    "test: moveCursor word left" : function() {
        var doc = new Document( ["ab",
                                         " Juhu Kinners (abc, 12)", " cde"].join("\n"));
        var selection = doc.getSelection();

        selection.moveCursorDown();
        selection.moveCursorLineEnd();
        assertPosition(1, 23, selection.getCursor());

        selection.moveCursorWordLeft();
        assertPosition(1, 22, selection.getCursor());

        selection.moveCursorWordLeft();
        assertPosition(1, 20, selection.getCursor());

        selection.moveCursorWordLeft();
        assertPosition(1, 18, selection.getCursor());

        selection.moveCursorWordLeft();
        assertPosition(1, 15, selection.getCursor());

        selection.moveCursorWordLeft();
        assertPosition(1, 13, selection.getCursor());

        selection.moveCursorWordLeft();
        assertPosition(1, 6, selection.getCursor());

        selection.moveCursorWordLeft();
        assertPosition(1, 5, selection.getCursor());

        selection.moveCursorWordLeft();
        assertPosition(1, 1, selection.getCursor());

        selection.moveCursorWordLeft();
        assertPosition(1, 0, selection.getCursor());

        // wrap line
        selection.moveCursorWordLeft();
        assertPosition(0, 2, selection.getCursor());
    },

    "test: select word left if cursor in word" : function() {
        var doc = new Document("Juhu Kinners");
        var selection = doc.getSelection();

        selection.moveCursorTo(0, 8);

        selection.moveCursorWordLeft();
        assertPosition(0, 5, selection.getCursor());
    },

    "test: select word right and select" : function() {
        var doc = new Document("Juhu Kinners");
        var selection = doc.getSelection();

        selection.moveCursorTo(0, 0);
        selection.selectWordRight();

        var range = selection.getRange();

        assertPosition(0, 0, range.start);
        assertPosition(0, 4, range.end);
    },

    "test: select word left and select" : function() {
        var doc = new Document("Juhu Kinners");
        var selection = doc.getSelection();

        selection.moveCursorTo(0, 3);
        selection.selectWordLeft();

        var range = selection.getRange();

        assertPosition(0, 0, range.start);
        assertPosition(0, 3, range.end);
    },

    "test: select word with cursor in word should select the word" : function() {
        var doc = new Document("Juhu Kinners 123");
        var selection = doc.getSelection();

        selection.moveCursorTo(0, 8);
        selection.selectWord();

        var range = selection.getRange();
        assertPosition(0, 5, range.start);
        assertPosition(0, 12, range.end);
    },

    "test: select word with cursor betwen white space and word should select the word" : function() {
        var doc = new Document("Juhu Kinners");
        var selection = doc.getSelection();

        selection.moveCursorTo(0, 4);
        selection.selectWord();

        var range = selection.getRange();
        assertPosition(0, 0, range.start);
        assertPosition(0, 4, range.end);

        selection.moveCursorTo(0, 5);
        selection.selectWord();

        var range = selection.getRange();
        assertPosition(0, 5, range.start);
        assertPosition(0, 12, range.end);
    },

    "test: select word with cursor in white space should select white space" : function() {
        var doc = new Document("Juhu  Kinners");
        var selection = doc.getSelection();

        selection.moveCursorTo(0, 5);
        selection.selectWord();

        var range = selection.getRange();
        assertPosition(0, 4, range.start);
        assertPosition(0, 6, range.end);
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
        assertTrue(called);
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
        assertFalse(called);
    }
});

});