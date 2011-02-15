/* vim:ts=4:sts=4:sw=4:
 * ***** BEGIN LICENSE BLOCK *****
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
 * Mihai Sucan.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Mihai Sucan <mihai.sucan@gmail.com>
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

define(function(require, exports, module) {

var EditSession     = require("ace/edit_session").EditSession,
    Editor          = require("../editor").Editor,
    MockRenderer    = require("./mockrenderer"),
    TextMode        = require("ace/mode/text").Mode,
    assert          = require("./assertions"),
    async           = require("asyncjs");

var lipsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
             "Mauris at arcu mi, eu lobortis mauris. Quisque ut libero eget " +
             "diam congue vehicula. Quisque ut odio ut mi aliquam tincidunt. " +
             "Duis lacinia aliquam lorem eget eleifend. Morbi eget felis mi. " +
             "Duis quam ligula, consequat vitae convallis volutpat, blandit " +
             "nec neque. Nulla facilisi. Etiam suscipit lorem ac justo " +
             "sollicitudin tristique. Phasellus ut posuere nunc. Aliquam " +
             "scelerisque mollis felis non gravida. Vestibulum lacus sem, " +
             "posuere non bibendum id, luctus non dolor. Aenean id metus " +
             "lorem, vel dapibus est. Donec gravida feugiat augue nec " +
             "accumsan.Lorem ipsum dolor sit amet, consectetur adipiscing " +
             "elit. Nulla vulputate, velit vitae tincidunt congue, nunc " +
             "augue accumsan velit, eu consequat turpis lectus ac orci. " +
             "Pellentesque ornare dolor feugiat dui auctor eu varius nulla " +
             "fermentum. Sed aliquam odio at velit lacinia vel fermentum " +
             "felis sodales. In dignissim magna eget nunc lobortis non " +
             "fringilla nibh ullamcorper. Donec facilisis malesuada elit " +
             "at egestas. Etiam bibendum, diam vitae tempor aliquet, dui " +
             "libero vehicula odio, eget bibendum mauris velit eu lorem.";

var Test = {
    setUp: function() {
        this.session = new EditSession(lipsum);
        this.editor = new Editor(new MockRenderer(), this.session);
        this.selection = this.session.getSelection();
    },

    "issue 57: highlight selected words by default": function() {
        assert.equal(this.editor.getHighlightSelectedWord(), true);
    },

    "issue 57: higlight a word": function() {
        this.selection.moveCursorTo(0, 9);
        this.selection.selectWord();

        var range = this.selection.getRange();
        assert.equal(this.session.getTextRange(range), "ipsum");
        assert.equal(this.session.$selectionOccurrences.length, 1);
    },

    "issue 57: higlight another word": function() {
        this.selection.moveCursorTo(0, 14);
        this.selection.selectWord();

        var range = this.selection.getRange();
        assert.equal(this.session.getTextRange(range), "dolor");
        assert.equal(this.session.$selectionOccurrences.length, 3);
    },

    "issue 57: no selection, no highlight": function() {
        this.selection.clearSelection();
        assert.equal(this.session.$selectionOccurrences.length, 0);
    },

    "issue 57: select a word, no highlight": function() {
        this.editor.setHighlightSelectedWord(false);
        this.selection.moveCursorTo(0, 14);
        this.selection.selectWord();

        var range = this.selection.getRange();
        assert.equal(this.session.getTextRange(range), "dolor");
        assert.equal(this.session.$selectionOccurrences.length, 0);
    }
};

module.exports = require("asyncjs/test").testcase(Test);
});

if (typeof module !== "undefined" && module === require.main) {
    require("../../../support/paths");
    exports.exec()
}
