"use strict";

require("../test/mockdom");
var assert = require("assert");
var EditSession = require("../edit_session").EditSession;
var Editor = require("../editor").Editor;
var MockRenderer = require("../test/mockrenderer").MockRenderer;
require("./whitespaces_in_selection");

module.exports = {
    setUp: function() {
        this.session = new EditSession("hello world\n    with spaces");
        this.editor = new Editor(new MockRenderer(), this.session);
    },

    tearDown: function() {
        this.session.destroy();
    },

    "test: turning on extension": function() {
        assert.equal(this.editor.getOption("showWhitespacesInSelection"), false);
        this.editor.setOption("showWhitespacesInSelection", true);
        assert.equal(this.editor.getOption("showWhitespacesInSelection"), true);

        assert.ok(this.editor.$boundChangeSelectionForWhitespace);
    },

    "test: turning off extension": function() {
        this.editor.setOption("showWhitespacesInSelection", true);
        assert.equal(this.editor.getOption("showWhitespacesInSelection"), true);
        this.editor.selection.setRange({start: {row: 0, column: 0}, end: {row: 0, column: 5}});

        this.editor.setOption("showWhitespacesInSelection", false);
        assert.equal(this.editor.getOption("showWhitespacesInSelection"), false);

        assert.equal(this.editor.$boundChangeSelectionForWhitespace, null);
    },

    "test: marker present after selection": function() {
        this.editor.setOption("showWhitespacesInSelection", true);

        this.editor.selection.setRange({start: {row: 0, column: 0}, end: {row: 0, column: 5}});

        assert.ok(this.session.$invisibleMarkerId);

        var markers = this.session.getTextMarkers();
        assert.ok(markers[this.session.$invisibleMarkerId]);
        assert.equal(markers[this.session.$invisibleMarkerId].className, "ace_whitespaces_in_selection");
    }
};

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}