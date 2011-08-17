/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

if (typeof process !== "undefined") {
    require("../support/paths");
}

define(function(require, exports, module) {

var Buffer = require("ace/model/buffer").Buffer;
var TextMode = require("ace/mode/text").Mode;
var JavaScriptMode = require("ace/mode/javascript").Mode;
var WindowViewMock = require("ace/view/window_view_mock").WindowViewMock;
var Window = require("ace/model/window").Window;
var WindowController = require("ace/window_controller").WindowController;
var assert = require("ace/test/assertions");

module.exports = {

    name: "window controller",
    
    setUp : function(next) {
        this.buffer1 = new Buffer(["abc", "def"]);
        this.buffer2 = new Buffer(["ghi", "jkl"]);
        
        this.win = new Window({});
        this.winController = new WindowController(this.win, new WindowViewMock());    
        
        next();
    },

    "test: change document" : function() {
        this.win.setBuffer(this.buffer1);
        assert.equal(this.win.getBuffer(), this.buffer1);

        this.win.setBuffer(this.buffer2);
        assert.equal(this.win.getBuffer(), this.buffer2);
    },

    "test: only changes to the new document should have effect" : function() {
        var called = false;
        this.winController.onDocumentChange = function() {
            called = true;
        };

        this.win.setBuffer(this.buffer1);
        this.win.setBuffer(this.buffer2);

        this.buffer1.duplicateLines(0, 0);
        assert.notOk(called);

        this.buffer2.duplicateLines(0, 0);
        assert.ok(called);
    },

    "test: should use cursor of new document" : function() {
        this.buffer1.getSelection().moveCursorTo(0, 1);
        this.buffer2.getSelection().moveCursorTo(1, 0);

        this.win.setBuffer(this.buffer1);
        assert.position(this.win.getCursorPosition(), 0, 1);

        this.win.setBuffer(this.buffer2);
        assert.position(this.win.getCursorPosition(), 1, 0);
    },

    "test: only changing the cursor of the new doc should not have an effect" : function() {
        this.winController.onChangeCursor = function() {
            called = true;
        };

        this.win.setBuffer(this.buffer1);
        this.win.setBuffer(this.buffer2);
        assert.position(this.win.getCursorPosition(), 0, 0);

        var called = false;
        this.buffer1.getSelection().moveCursorTo(0, 1);
        assert.position(this.win.getCursorPosition(), 0, 0);
        assert.notOk(called);

        this.buffer2.getSelection().moveCursorTo(1, 1);
        assert.position(this.win.getCursorPosition(), 1, 1);
        assert.ok(called);
    },

    "test: should use selection of new document" : function() {
        this.buffer1.getSelection().selectTo(0, 1);
        this.buffer2.getSelection().selectTo(1, 0);

        this.win.setBuffer(this.buffer1);
        assert.position(this.win.getSelection().getSelectionLead(), 0, 1);

        this.win.setBuffer(this.buffer2);
        assert.position(this.win.getSelection().getSelectionLead(), 1, 0);
    },

    "test: only changing the selection of the new doc should not have an effect" : function() {
        this.winController.onSelectionChange = function() {
            called = true;
        };

        this.win.setBuffer(this.buffer1);
        this.win.setBuffer(this.buffer2);
        assert.position(this.win.getSelection().getSelectionLead(), 0, 0);

        var called = false;
        this.buffer1.getSelection().selectTo(0, 1);
        assert.position(this.win.getSelection().getSelectionLead(), 0, 0);
        assert.notOk(called);

        this.buffer2.getSelection().selectTo(1, 1);
        assert.position(this.win.getSelection().getSelectionLead(), 1, 1);
        assert.ok(called);
    },

    "test: should use mode of new document" : function() {
        this.winController.view.updateText = function() {
            called = true;
        };
        this.win.setBuffer(this.buffer1);
        this.win.setBuffer(this.buffer2);

        var called = false;
        this.buffer1.setMode(new TextMode());
        assert.notOk(called);

        this.buffer2.setMode(new JavaScriptMode());
        assert.ok(called);
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec()
}