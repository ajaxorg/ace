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
    require("../../support/paths");
}

define(function(require, exports, module) {

var Buffer = require("ace/model/buffer").Buffer;
var Window = require("ace/model/window").Window;
var WindowController = require("ace/window_controller").WindowController;
var WindowViewMock = require("ace/view/window_view_mock").WindowViewMock;
var assert = require("ace/test/assertions");

module.exports = {
    
    name: "editor navigation",
    
    setUp: function() {
        this.win = new Window({});
        this.winController = new WindowController(this.win, new WindowViewMock());
        this.win.setSizes({
            heigth: 410,
            width: 640,
            scrollerHeight: 400,
            scrollerWidth: 600
        });
        this.win.setComputedCharacterSize({width: 10, height: 20});
        this.update();
    },
    
    createBuffer : function(rows, cols) {
        var line = new Array(cols + 1).join("a");
        var text = new Array(rows).join(line + "\n") + line;
        return new Buffer(text);
    },
    
    update: function() {
        this.win.updateLayerConfig();
    },

    "test: navigate to end of file should scroll the last line into view" : function() {
        var win = this.win;
        win.setBuffer(this.createBuffer(200, 10));

        win.navigateFileEnd();
        this.update();
        var cursor = win.getCursorPosition();

        assert.ok(win.getFirstVisibleRow() <= cursor.row);
        assert.ok(win.getLastVisibleRow() >= cursor.row);
    },

    "test: navigate to start of file should scroll the first row into view" : function() {
        var win = this.win;
        win.setBuffer(this.createBuffer(200, 10));

        win.moveCursorTo(win.getLastVisibleRow() + 20);
        this.update();
        win.navigateFileStart();
        this.update();

        assert.equal(win.getFirstVisibleRow(), 0);
    },

    "test: goto hidden line should scroll the line into the middle of the viewport" : function() {
        var win = this.win;
        win.setBuffer(this.createBuffer(200, 5));

        win.navigateTo(0, 0);
        this.update();
        win.gotoLine(101);
        this.update()
        assert.position(win.getCursorPosition(), 100, 0);
        assert.equal(win.getFirstVisibleRow(), 90);

        win.navigateTo(100, 0);
        this.update();
        win.gotoLine(11);
        this.update();
        assert.position(win.getCursorPosition(), 10, 0);
        assert.equal(win.getFirstVisibleRow(), 0);

        win.navigateTo(100, 0);
        this.update();
        win.gotoLine(6);
        this.update();
        assert.position(win.getCursorPosition(), 5, 0);
        assert.equal(0, win.getFirstVisibleRow(), 0);

        win.navigateTo(100, 0);
        this.update();
        win.gotoLine(1);
        this.update();
        assert.position(win.getCursorPosition(), 0, 0);
        assert.equal(win.getFirstVisibleRow(), 0);

        win.navigateTo(0, 0);
        this.update();
        win.gotoLine(191);
        this.update();
        assert.position(win.getCursorPosition(), 190, 0);
        assert.equal(win.getFirstVisibleRow(), 180);

        win.navigateTo(0, 0);
        this.update();
        win.gotoLine(196);
        this.update();
        assert.position(win.getCursorPosition(), 195, 0);
        assert.equal(win.getFirstVisibleRow(), 180);
    },

    "test: goto visible line should only move the cursor and not scroll": function() {
        var win = this.win;
        win.setBuffer(this.createBuffer(200, 5));
        
        win.navigateTo(0, 0);
        this.update();
        win.gotoLine(12);
        this.update();
        assert.position(win.getCursorPosition(), 11, 0);
        assert.equal(win.getFirstVisibleRow(), 0);

        win.navigateTo(30, 0);
        this.update();
        assert.equal(win.getFirstVisibleRow(), 11);
        win.gotoLine(25);
        this.update();
        assert.position(win.getCursorPosition(), 24, 0);
        assert.equal(win.getFirstVisibleRow(), 11);
    },

    "test: navigate from the end of a long line down to a short line and back should maintain the curser column": function() {
        var win = this.win;
        win.setBuffer(new Buffer(["123456", "1"]));

        win.navigateTo(0, 6);
        assert.position(win.getCursorPosition(), 0, 6);

        win.navigateDown();
        assert.position(win.getCursorPosition(), 1, 1);

        win.navigateUp();
        assert.position(win.getCursorPosition(), 0, 6);
    },

    "test: reset desired column on navigate left or right": function() {
        var win = this.win;
        win.setBuffer(new Buffer(["123456", "12"]));

        win.navigateTo(0, 6);
        assert.position(win.getCursorPosition(), 0, 6);

        win.navigateDown();
        assert.position(win.getCursorPosition(), 1, 2);

        win.navigateLeft();
        assert.position(win.getCursorPosition(), 1, 1);

        win.navigateUp();
        assert.position(win.getCursorPosition(), 0, 1);
    },
    
    "test: typing text should update the desired column": function() {
        var win = this.win;
        win.setBuffer(new Buffer(["1234", "1234567890"]));

        win.navigateTo(0, 3);
        win.insert("juhu");
        
        win.navigateDown();
        assert.position(win.getCursorPosition(), 1, 7);
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec()
}