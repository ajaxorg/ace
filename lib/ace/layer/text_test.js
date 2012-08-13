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
    require("../test/mockdom");
}

define(function(require, exports, module) {
"use strict";

var assert = require("../test/assertions");
var EditSession = require("../edit_session").EditSession;
var TextLayer = require("./text").Text;
var JavaScriptMode = require("../mode/javascript").Mode;

module.exports = {

    setUp: function(next) {
        this.session = new EditSession("");
        this.session.setMode(new JavaScriptMode());
        this.textLayer = new TextLayer(document.createElement("div"));
        this.textLayer.setSession(this.session);
        this.textLayer.config = {
            characterWidth: 10,
            lineHeight: 20
        };
        next()
    },

    "test: render line with hard tabs should render the same as lines with soft tabs" : function() {
        this.session.setValue("a\ta\ta\t\na   a   a   \n");
        this.textLayer.$computeTabString();
        
        // row with hard tabs
        var stringBuilder = [];
        this.textLayer.$renderLine(stringBuilder, 0);
        
        // row with soft tabs
        var stringBuilder2 = [];
        this.textLayer.$renderLine(stringBuilder2, 1);
        assert.equal(stringBuilder.join(""), stringBuilder2.join(""));
    },
    
    "test rendering width of ideographic space (U+3000)" : function() {
        this.session.setValue("\u3000");
        
        var stringBuilder = [];
        this.textLayer.$renderLine(stringBuilder, 0, true);
        assert.equal(stringBuilder.join(""), "<span class='ace_cjk' style='width:20px'></span>");

        this.textLayer.setShowInvisibles(true);
        var stringBuilder = [];
        this.textLayer.$renderLine(stringBuilder, 0, true);
        assert.equal(
            stringBuilder.join(""),
            "<span class='ace_cjk ace_invisible' style='width:20px'>" + this.textLayer.SPACE_CHAR + "</span>"
            + "<span class='ace_invisible'>\xB6</span>"
        );
    },
    
    "test rendering of indent guides" : function() {       
        var textLayer = this.textLayer
        var EOL = "<span class='ace_invisible'>" + textLayer.EOL_CHAR + "</span>";
        var SPACE = function(i) {return Array(i+1).join("&#160;")}
        var TAB = function(i) {return textLayer.TAB_CHAR + SPACE(i-1)}
        function testRender(results) {
            for (var i = results.length; i--; ) {
                var stringBuilder = [];
                textLayer.$renderLine(stringBuilder, i, true);
                assert.equal(stringBuilder.join(""), results[i]);
            }
        }
        
        this.session.setValue("      \n\t\tf\n   ");
        testRender([
            "<span class='ace_indent-guide'>" + SPACE(4) + "</span>" + SPACE(2),
            "<span class='ace_indent-guide'>" + SPACE(4) + "</span>" + SPACE(4) + "<span class='ace_identifier'>f</span>",
            SPACE(3)
        ]);
        this.textLayer.setShowInvisibles(true);
        testRender([
            "<span class='ace_indent-guide ace_invisible'>" + SPACE(4) + "</span>" + SPACE(2) + EOL,
            "<span class='ace_indent-guide ace_invisible'>" + TAB(4) + "</span><span class='ace_invisible'>" + TAB(4) + "</span><span class='ace_identifier'>f</span>" + EOL,
        ]);
        this.textLayer.setDisplayIndentGuides(false);
        testRender([
            SPACE(6) + EOL,
            "<span class='ace_invisible'>" + TAB(4) + "</span><span class='ace_invisible'>" + TAB(4) + "</span><span class='ace_identifier'>f</span>" + EOL
        ]);
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec()
}
