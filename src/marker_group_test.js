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
   "test: show markers": function() {
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
    tearDown: function() {
        editor.destroy();
    }
};

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
