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
    require("ace/test/mockdom");
}

define(function(require, exports, module) {

var assert = require("ace/test/assertions");
var Window = require("ace/model/window").Window;
var Buffer = require("ace/model/buffer").Buffer;

module.exports = {

    setUp: function() {
        this.win = new Window();
        this.win.setBuffer(this.createBuffer(200, 5));
        this.win.setSizes({
            heigth: 410,
            width: 640,
            scrollerHeight: 400,
            scrollerWidth: 600
        });
        this.win.setComputedCharacterSize({width: 10, height: 20});    
        this.win.updateLayerConfig();
    },
    
    createBuffer: function(rows, cols) {
        var line = new Array(cols + 1).join("a");
        var text = new Array(rows).join(line + "\n") + line;
        return new Buffer(text);
    },
    
    "test setting a buffer chould emit a change event": function() {
        assert.eventFired(this.win, "changeBuffer", function() {
            this.win.setBuffer(new Buffer(""));
        }, this);
    },
    
    "test compute layer config when scrolled to the top": function() {
        var config = this.win.layerConfig;
        assert.equal(config.width, 600);
        assert.equal(config.height, 400);
        assert.equal(config.minHeight, 440); // ??
        assert.equal(config.maxHeight, 200*20);
        assert.equal(config.offset, 0);
        assert.equal(config.firstRow, 0);
        assert.equal(config.lastRow, 20);
    },
    
    "test get last visible row": function() {
        assert.equal(this.win.getLastVisibleRow(), 19);
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec()
}