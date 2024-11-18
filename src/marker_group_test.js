if (typeof process !== "undefined") {
    require("./test/mockdom");
}

"use strict";

var ace = require("./ace");
var dom = require("./lib/dom");
var assert = require("./test/assertions");
var EditSession = require("./edit_session").EditSession;
var Range = require("./range").Range;
var MarkerGroup = require("./marker_group").MarkerGroup;
var editor;
var session1, session2;

module.exports = {
    setUp: function(next) {
        var value = "Hello empty world\n"
            + "This is a second line"
            + "\n".repeat(100)
            + "line number 100";
        session1 = new EditSession(value);
        session2 = new EditSession("2 " + value);
        editor = ace.edit(null, {
            session: session1
        });
        document.body.appendChild(editor.container);
        editor.container.style.height = "200px";
        editor.container.style.width = "300px";
        dom.importCssString('.ace_tooltip-marker_test { position: absolute; }');

        next();
    },
   "test: should show and update markers": function() {
        editor.resize(true);
        editor.renderer.$loop._flush();
        var markerGroup = new MarkerGroup(session1);

        markerGroup.setMarkers([{
            range: new Range(0, 0, 0, 5),
            className: "ace_tooltip-marker_test m2"
        }, {
            range: new Range(0, 12, 1, 4),
            className: "ace_tooltip-marker_test m1",
            isSecond: true
        }]);
        assert.ok(markerGroup.getMarkerAtPosition({row: 1, column: 1}).isSecond);
        assert.ok(!markerGroup.getMarkerAtPosition({row: 3, column: 1}));
        editor.renderer.$loop._flush();
        assert.equal(editor.container.querySelectorAll(".m1").length, 2);
        assert.equal(editor.container.querySelectorAll(".m2").length, 1);
        editor.setSession(session2);
        editor.renderer.$loop._flush();
        assert.equal(editor.container.querySelectorAll(".m1").length, 0);
        editor.setSession(session1);
        editor.renderer.$loop._flush();
        assert.equal(editor.container.querySelectorAll(".m1").length, 2);
        editor.execCommand("gotoend");
        editor.renderer.$loop._flush();
        assert.equal(editor.container.querySelectorAll(".m1").length, 0);
        editor.execCommand("gotostart");
        editor.renderer.$loop._flush();
        assert.equal(editor.container.querySelectorAll(".m1").length, 2);
        markerGroup.setMarkers([]);
        editor.renderer.$loop._flush();
        assert.equal(editor.container.querySelectorAll(".m1").length, 0);
    },
    "test: should show markers of fullLine type": function() {
        editor.resize(true);
        editor.renderer.$loop._flush();
        var markerGroup = new MarkerGroup(session1, {markerType: "fullLine"});

        // this marker should be rendered as a full block across lines 1 and 2
        markerGroup.setMarkers([{
            range: new Range(0, 12, 1, 4),
            className: "ace_tooltip-marker_test m"
        }]);
        assert.ok(markerGroup.getMarkerAtPosition({row: 1, column: 1}));
        editor.renderer.$loop._flush();
        assert.equal(editor.container.querySelectorAll(".m").length, 1);

        // Get dimensions of the full line marker
        var markerSize = editor.container.querySelector(".m").getBoundingClientRect();
        var lineHeight = editor.renderer.lineHeight;

        // Height should be two lines
        assert.equal(markerSize.height, 2 * lineHeight);
        // Should start at the beginning of the line
        assert.equal(markerSize.left, 0);
        // Shoud be as wide as the marker layer itself.
        assert.equal(markerSize.width, editor.renderer.$markerBack.element.getBoundingClientRect().width);
    },
    "test: should show markers of line type": function() {
        editor.resize(true);
        editor.renderer.$loop._flush();
        var markerGroup = new MarkerGroup(session1, {markerType: "line"});

        // this marker should be rendered just covering the range, but extending to the edge of the editor on newlines
        markerGroup.setMarkers([{
            range: new Range(0, 12, 1, 4),
            className: "ace_tooltip-marker_test m"
        }]);
        assert.ok(markerGroup.getMarkerAtPosition({row: 1, column: 1}));
        editor.renderer.$loop._flush();
        // Should render two separate markers for each row
        assert.equal(editor.container.querySelectorAll(".m").length, 2);

        // Get dimensions of the first line marker
        var markerSize = editor.container.querySelectorAll(".m")[0].getBoundingClientRect();
        var lineHeight = editor.renderer.lineHeight;
        var characterWidth = editor.renderer.characterWidth;

        // Height should be one lines
        assert.equal(markerSize.height, lineHeight);
        // Should start at the 13th character (including 4px offset)
        assert.equal(markerSize.left, 12 * characterWidth + 4);
        // Shoud be as wide as the marker layer - 12 characters and the offset on both sides.
        assert.equal(markerSize.width, editor.renderer.$markerBack.element.getBoundingClientRect().width - 12 * characterWidth - 4 - 4);
    },
    "test: should default to markers of text type": function() {
        editor.resize(true);
        editor.renderer.$loop._flush();

        // We don't set options.markerType, should default to text markers
        var markerGroup = new MarkerGroup(session1);

        // this marker should be rendered just covering the range
        markerGroup.setMarkers([{
            range: new Range(0, 12, 1, 4),
            className: "ace_tooltip-marker_test m"
        }]);
        assert.ok(markerGroup.getMarkerAtPosition({row: 1, column: 1}));
        editor.renderer.$loop._flush();
        // Should render two separate markers for each row
        assert.equal(editor.container.querySelectorAll(".m").length, 2);

        // Get dimensions of the first line marker
        var markerSize = editor.container.querySelectorAll(".m")[0].getBoundingClientRect();
        var lineHeight = editor.renderer.lineHeight;
        var characterWidth = editor.renderer.characterWidth;

        // Height should be one lines
        assert.equal(markerSize.height, lineHeight);
        // Should start at the 13th character (including 4px offset)
        assert.equal(markerSize.left, 12 * characterWidth + 4);
        // Shoud be as wide as the remaining characters in the range on the first line.
        assert.equal(markerSize.width, 6 * characterWidth);
    },
    tearDown: function() {
        editor.destroy();
    }
};

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
