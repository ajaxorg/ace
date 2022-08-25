if (typeof process !== "undefined") {
    require("amd-loader");
    require("./test/mockdom");
}

"use strict";

var EditSession = require("./edit_session").EditSession;
var Editor = require("./editor").Editor;
var Text = require("./mode/text").Mode;
var JavaScriptMode = require("./mode/javascript").Mode;
var CssMode = require("./mode/css").Mode;
var HtmlMode = require("./mode/html").Mode;
var MockRenderer = require("./test/mockrenderer").MockRenderer;
var assert = require("./test/assertions");

module.exports = {

    setUp : function(next) {
        this.session1 = new EditSession(["abc", "def"]);
        this.session2 = new EditSession(["ghi", "jkl"]);
        
        
        this.editor = new Editor(new MockRenderer());
        next();
    },

    "test: change document" : function() {
        this.editor.setSession(this.session1);
        assert.equal(this.editor.getSession(), this.session1);

        this.editor.setSession(this.session2);
        assert.equal(this.editor.getSession(), this.session2);
    },

    "test: only changes to the new document should have effect" : function() {
        var called = false;
        this.editor.onDocumentChange = function() {
            called = true;
        };

        this.editor.setSession(this.session1);
        this.editor.setSession(this.session2);

        this.session1.duplicateLines(0, 0);
        assert.notOk(called);

        this.session2.duplicateLines(0, 0);
        assert.ok(called);
    },

    "test: should use cursor of new document" : function() {
        this.session1.getSelection().moveCursorTo(0, 1);
        this.session2.getSelection().moveCursorTo(1, 0);

        this.editor.setSession(this.session1);
        assert.position(this.editor.getCursorPosition(), 0, 1);

        this.editor.setSession(this.session2);
        assert.position(this.editor.getCursorPosition(), 1, 0);
    },

    "test: only changing the cursor of the new doc should not have an effect" : function() {
        this.editor.onCursorChange = function() {
            called = true;
        };

        this.editor.setSession(this.session1);
        this.editor.setSession(this.session2);
        assert.position(this.editor.getCursorPosition(), 0, 0);

        var called = false;
        this.session1.getSelection().moveCursorTo(0, 1);
        assert.position(this.editor.getCursorPosition(), 0, 0);
        assert.notOk(called);

        this.session2.getSelection().moveCursorTo(1, 1);
        assert.position(this.editor.getCursorPosition(), 1, 1);
        assert.ok(called);
    },

    "test: should use selection of new document" : function() {
        this.session1.getSelection().selectTo(0, 1);
        this.session2.getSelection().selectTo(1, 0);

        this.editor.setSession(this.session1);
        assert.position(this.editor.getSelection().getSelectionLead(), 0, 1);

        this.editor.setSession(this.session2);
        assert.position(this.editor.getSelection().getSelectionLead(), 1, 0);
    },

    "test: only changing the selection of the new doc should not have an effect" : function() {
        this.editor.onSelectionChange = function() {
            called = true;
        };

        this.editor.setSession(this.session1);
        this.editor.setSession(this.session2);
        assert.position(this.editor.getSelection().getSelectionLead(), 0, 0);

        var called = false;
        this.session1.getSelection().selectTo(0, 1);
        assert.position(this.editor.getSelection().getSelectionLead(), 0, 0);
        assert.notOk(called);

        this.session2.getSelection().selectTo(1, 1);
        assert.position(this.editor.getSelection().getSelectionLead(), 1, 1);
        assert.ok(called);
    },

    "test: should use mode of new document" : function() {
        this.editor.onChangeMode = function() {
            called = true;
        };
        this.editor.setSession(this.session1);
        this.editor.setSession(this.session2);

        var called = false;
        this.session1.setMode(new Text());
        assert.notOk(called);

        this.session2.setMode(new JavaScriptMode());
        assert.ok(called);
    },
    
    "test: should use stop worker of old document" : function(next) {
        var self = this;
        
        // 1. Open an editor and set the session to CssMode
        self.editor.setSession(self.session1);
        self.session1.setMode(new CssMode());
        
        // 2. Add a line or two of valid CSS.
        self.session1.setValue("DIV { color: red; }");
        
        // 3. Clear the session value.
        self.session1.setValue("");
        
        // 4. Set the session to HtmlMode
        self.session1.setMode(new HtmlMode());

        // 5. Try to type valid HTML
        self.session1.insert({row: 0, column: 0}, "<html></html>");
        
        setTimeout(function() {
            assert.equal(Object.keys(self.session1.getAnnotations()).length, 0);
            next();
        }, 600);
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
