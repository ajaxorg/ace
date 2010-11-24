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

var Document        = require("../document"),
    Editor          = require("../editor"),
    Text            = require("../mode/text"),
    JavaScriptMode  = require("../mode/javascript"),
    MockRenderer    = require("./mockrenderer"),
    assert          = require("./assertions");

var Test = {
    setUp : function() {
        this.doc1 = new Document(["abc", "def"].join("\n"));
        this.doc2 = new Document(["ghi", "jkl"].join("\n"));
        this.editor = new Editor(new MockRenderer());
    },
    
    "test: change document" : function() {
        this.editor.setDocument(this.doc1);
        assert.equal(this.editor.getDocument(), this.doc1);
        
        this.editor.setDocument(this.doc2);
        assert.equal(this.editor.getDocument(), this.doc2);
    },

    "test: only changes to the new document should have effect" : function() {
        var called = false;
        this.editor.onDocumentChange = function() {
            called = true;
        };

        this.editor.setDocument(this.doc1);
        this.editor.setDocument(this.doc2);

        this.doc1.duplicateLines(0, 0);
        assert.false(called);

        this.doc2.duplicateLines(0, 0);
        assert.true(called);
    },

    "test: should use cursor of new document" : function() {
        this.doc1.getSelection().moveCursorTo(0, 1);
        this.doc2.getSelection().moveCursorTo(1, 0);

        this.editor.setDocument(this.doc1);
        assert.position(this.editor.getCursorPosition(), 0, 1);

        this.editor.setDocument(this.doc2);
        assert.position(this.editor.getCursorPosition(), 1, 0);
    },

    "test: only changing the cursor of the new doc should not have an effect" : function() {
        this.editor.onCursorChange = function() {
            called = true;
        };

        this.editor.setDocument(this.doc1);
        this.editor.setDocument(this.doc2);
        assert.position(this.editor.getCursorPosition(), 0, 0);

        var called = false;
        this.doc1.getSelection().moveCursorTo(0, 1);
        assert.position(this.editor.getCursorPosition(), 0, 0);
        assert.false(called);

        this.doc2.getSelection().moveCursorTo(1, 1);
        assert.position(this.editor.getCursorPosition(), 1, 1);
        assert.true(called);
    },

    "test: should use selection of new document" : function() {
        this.doc1.getSelection().selectTo(0, 1);
        this.doc2.getSelection().selectTo(1, 0);

        this.editor.setDocument(this.doc1);
        assert.position(this.editor.getSelection().getSelectionLead(), 0, 1);

        this.editor.setDocument(this.doc2);
        assert.position(this.editor.getSelection().getSelectionLead(), 1, 0);
    },

    "test: only changing the selection of the new doc should not have an effect" : function() {
        this.editor.onSelectionChange = function() {
            called = true;
        };

        this.editor.setDocument(this.doc1);
        this.editor.setDocument(this.doc2);
        assert.position(this.editor.getSelection().getSelectionLead(), 0, 0);

        var called = false;
        this.doc1.getSelection().selectTo(0, 1);
        assert.position(this.editor.getSelection().getSelectionLead(), 0, 0);
        assert.false(called);

        this.doc2.getSelection().selectTo(1, 1);
        assert.position(this.editor.getSelection().getSelectionLead(), 1, 1);
        assert.true(called);
    },

    "test: should use mode of new document" : function() {
        this.editor.onDocumentModeChange = function() {
            called = true;
        };
        this.editor.setDocument(this.doc1);
        this.editor.setDocument(this.doc2);

        var called = false;
        this.doc1.setMode(new Text());
        assert.false(called);

        this.doc2.setMode(new JavaScriptMode());
        assert.true(called);
    }
};

module.exports = require("async/test").testcase(Test);

if (module === require.main)
    module.exports.exec()