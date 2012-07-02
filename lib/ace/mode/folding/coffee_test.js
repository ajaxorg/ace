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

if (typeof process !== "undefined")
    require("amd-loader");

define(function(require, exports, module) {
"use strict";

var CoffeeMode = require("../coffee").Mode;
var EditSession = require("../../edit_session").EditSession;
var assert = require("../../test/assertions");
function testFoldWidgets(array) {
    var session = array.filter(function(_, i){return i % 2 == 1});
    session = new EditSession(session);
    var mode = new CoffeeMode();
    session.setFoldStyle("markbeginend");
    session.setMode(mode);

    var widgets = array.filter(function(_, i){return i % 2 == 0});
    widgets.forEach(function(w, i){
        session.foldWidgets[i] = session.getFoldWidget(i);
    })
    widgets.forEach(function(w, i){
        w = w.split(",");
        var type = w[0] == ">" ? "start" : w[0] == "<" ? "end" : "";
        assert.equal(session.foldWidgets[i], type);
        if (!type)
            return;
        var range = session.getFoldWidgetRange(i);
        if (!w[1]) {
            assert.equal(range, null);
            return;
        }
        assert.equal(range.start.row, i);
        assert.equal(range.end.row - range.start.row, parseInt(w[1]));
        testColumn(w[2], range.start);
        testColumn(w[3], range.end);
    });

    function testColumn(w, pos) {
        if (!w)
            return;
        if (w == "l")
            w = session.getLine(pos.row).length;
        else
            w = parseInt(w);
        assert.equal(pos.column, w);
    }
}
module.exports = {
    "test: coffee script indentation based folding": function() {
       testFoldWidgets([
            '>,1,l,l',         ' ## indented comment',
            '',                '  # ',
            '',                '',
            '>,1,l,l',         ' # plain comment',
            '',                ' # ',
            '>,2',             ' function (x)=>',
            '',                '  ',
            '',                '  x++',
            '',                '  ',
            '',                '  ',
            '>,2',             ' bar = ',
            '',                '   foo: 1',
            '',                '   baz: lighter'
        ]);
    }
};

});

if (typeof module !== "undefined" && module === require.main)
    require("asyncjs").test.testcase(module.exports).exec();
