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
    require("amd-loader");
    require("./test/mockdom");
}

define(function(require, exports, module) {
"use strict";

var EditSession = require("./edit_session").EditSession;
var VirtualRenderer = require("./virtual_renderer").VirtualRenderer;
var assert = require("./test/assertions");

module.exports = {
    "test: screen2text the column should be rounded to the next character edge" : function() {
        var el = document.createElement("div");

        if (!el.getBoundingClientRect) {
            console.log("Skipping test: This test only runs in the browser");
            return;
        }

        el.style.left = "20px";
        el.style.top = "30px";
        el.style.width = "300px";
        el.style.height = "100px";
        document.body.appendChild(el);

        var renderer = new VirtualRenderer(el);
        renderer.setPadding(0);
        renderer.setSession(new EditSession("1234"));

        var r = renderer.scroller.getBoundingClientRect();
        function testPixelToText(x, y, row, column) {
            assert.position(renderer.screenToTextCoordinates(x+r.left, y+r.top), row, column);
        }

        renderer.characterWidth = 10;
        renderer.lineHeight = 15;

        testPixelToText(4, 0, 0, 0);
        testPixelToText(5, 0, 0, 1);
        testPixelToText(9, 0, 0, 1);
        testPixelToText(10, 0, 0, 1);
        testPixelToText(14, 0, 0, 1);
        testPixelToText(15, 0, 0, 2);
        document.body.removeChild(el);
    }

    // change tab size after setDocument (for text layer)
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec()
}
