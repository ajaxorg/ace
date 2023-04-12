/*global CustomEvent*/
if (typeof process !== "undefined") {
    require("./test/mockdom");
}

"use strict";

var ace = require("./ace");
var assert = require("./test/assertions");
var EditSession = require("./edit_session").EditSession;
var Range = require("./range").Range;
var TooltipMarkerManager = require("./marker_group").TooltipMarkerManager;
var editor, tooltipMarkerManager;
var session1, session2;

module.exports = {
    setUp: function(next) {
        session1 = new EditSession(["Hello empty world", "This is a second line"]);
        session2 = new EditSession(["Single line"]);
        editor = ace.edit(null, {
            session: session1
        });
        document.body.appendChild(editor.container);
        editor.container.style.height = "200px";
        editor.container.style.width = "300px";
        tooltipMarkerManager = new TooltipMarkerManager(editor);
        const singleLineMarker = {
            range: new Range(0, 0, 0, 5),
            tooltipText: "Single line marker",
            className: "ace_tooltip-marker_test",
        };
        const multiLineMarker = {
            range: new Range(0, 12, 1, 4),
            tooltipText: "Multi line marker",
            className: "ace_tooltip-marker_test",
        };

        session1.setTooltipMarkers([singleLineMarker, multiLineMarker], tooltipMarkerManager);

        var css = '.ace_tooltip-marker_test { position: absolute; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');
        head.appendChild(style);
        style.appendChild(document.createTextNode(css));

        next();
    },
   "test: show tooltip marker": function(next) {
        editor.resize(true);
        tooltipMarkerManager.hoverTooltip.idleTime = 3;
        mouse("move", {row: 0, column: 1});
        setTimeout(function() {
            var nodes = document.querySelectorAll(".ace_marker-tooltip");
            assert.equal(nodes.length, 1);
            assert.equal(nodes[0].textContent, "Single line marker");
            assert.equal(tooltipMarkerManager.hoverTooltip.$element.style.display, "block");
            mouse("move", {row: 0, column: 9});
            setTimeout(function() {
                assert.equal(tooltipMarkerManager.hoverTooltip.$element.style.display, "none");
                mouse("move", {row: 0, column: 15});
                setTimeout(function() {
                    assert.equal(tooltipMarkerManager.hoverTooltip.$element.style.display, "block");
                    nodes = document.querySelectorAll(".ace_marker-tooltip");
                    assert.equal(nodes.length, 1);
                    assert.equal(nodes[0].textContent, "Multi line marker");
                    mouse("move", {row: 1, column: 1});
                    setTimeout(function() {
                        assert.equal(tooltipMarkerManager.hoverTooltip.$element.style.display, "block");
                        nodes = document.querySelectorAll(".ace_marker-tooltip");
                        assert.equal(nodes.length, 1);
                        assert.equal(nodes[0].textContent, "Multi line marker");
                        mouse("move", {row: 0, column: 9});
                        next();
                    }, 6);    
                }, 6);
            });
        }, 6);
    },
    "test: don't show tooltip in edit session without markers": function(next) {
        editor.resize(true);
        tooltipMarkerManager.hoverTooltip.idleTime = 3;
        mouse("move", {row: 0, column: 1});
        setTimeout(function() {
            var nodes = document.querySelectorAll(".ace_marker-tooltip");
            assert.equal(nodes.length, 1);
            assert.equal(nodes[0].textContent, "Single line marker");
            assert.equal(tooltipMarkerManager.hoverTooltip.$element.style.display, "block");
            mouse("move", {row: 0, column: 9});
            editor.setSession(session2);
            editor.resize(true);
            mouse("move", {row: 0, column: 1});
            setTimeout(function() {
                assert.equal(tooltipMarkerManager.hoverTooltip.$element.style.display, "none");
                next();
            }, 6);        
        }, 6);
    },
    tearDown: function() {
        editor.destroy();
        tooltipMarkerManager.destroy();
        editor = tooltipMarkerManager = null;
    }
};

function mouse(type, pos, properties) {
    var target = editor.renderer.getMouseEventTarget();
    var event = new CustomEvent("mouse" + type, {bubbles: true});

    if ("row" in pos) {
        var pagePos = editor.renderer.textToScreenCoordinates(pos.row, pos.column);
        event.clientX = pagePos.pageX;
        event.clientY = pagePos.pageY;
    } else {
        target = pos;
        var rect = target.getBoundingClientRect();
        event.clientX = rect.left + rect.width / 2;
        event.clientY = rect.top + rect.height / 2;
    }
    Object.assign(event, properties);
    target.dispatchEvent(event);
}


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
