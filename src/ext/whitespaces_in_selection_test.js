"use strict";

require("../test/mockdom");
require("../multi_select");
var assert = require("assert");
var EditSession = require("../edit_session").EditSession;
var Editor = require("../editor").Editor;
var Range = require("../range").Range;
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

    "test: toggling extension updates whitespace marker rendering": function() {
        var renderValues = [];
        var updateCount = 0;
        this.editor.renderer.$textLayer = {
            setRenderWhitespaceMarkers: function(render) {
                renderValues.push(render);
            }
        };
        this.editor.renderer.updateText = function() {
            updateCount++;
        };

        this.editor.setOption("showWhitespacesInSelection", true);
        this.editor.setOption("showWhitespacesInSelection", false);

        assert.deepEqual(renderValues, [true, false]);
        assert.equal(updateCount, 2);
    },

    "test: turning off extension": function() {
        this.editor.setOption("showWhitespacesInSelection", true);
        assert.equal(this.editor.getOption("showWhitespacesInSelection"), true);
        this.editor.selection.setRange({start: {row: 0, column: 0}, end: {row: 0, column: 5}});
        this.editor.selection.addRange(new Range(1, 4, 1, 8));

        var markerIds = this.session.$invisibleMarkerIds.slice();
        assert.equal(markerIds.length, 2);
        markerIds.forEach(function(markerId) {
            assert.ok(this.session.getTextMarkers()[markerId]);
        }, this);

        this.editor.setOption("showWhitespacesInSelection", false);
        assert.equal(this.editor.getOption("showWhitespacesInSelection"), false);

        assert.equal(this.editor.$boundChangeSelectionForWhitespace, null);
        assert.deepEqual(this.session.$invisibleMarkerIds, []);
        markerIds.forEach(function(markerId) {
            assert.ok(!this.session.getTextMarkers()[markerId]);
        }, this);
    },

    "test: marker present after selection": function() {
        this.editor.setOption("showWhitespacesInSelection", true);

        this.editor.selection.setRange({start: {row: 0, column: 0}, end: {row: 0, column: 5}});

        assert.equal(this.session.$invisibleMarkerIds.length, 1);

        var markers = this.session.getTextMarkers();
        var marker = markers[this.session.$invisibleMarkerIds[0]];
        assert.ok(marker);
        assert.equal(marker.className, "ace_whitespaces_in_selection");
    },

    "test: markers present after multiple selections": function() {
        this.editor.setOption("showWhitespacesInSelection", true);

        this.editor.selection.setRange(new Range(0, 0, 0, 5));
        this.editor.selection.addRange(new Range(1, 4, 1, 8));

        assert.equal(this.session.$invisibleMarkerIds.length, 2);

        var markers = this.session.getTextMarkers();
        this.session.$invisibleMarkerIds.forEach(function(markerId) {
            assert.ok(markers[markerId]);
            assert.equal(markers[markerId].className, "ace_whitespaces_in_selection");
        });
    }
};

require("../test/run")(module);
