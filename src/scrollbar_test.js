if (typeof process !== "undefined") {
    require("amd-loader");
    require("./test/mockdom");
}

"use strict";

var assert = require("./test/assertions");
var VirtualRenderer = require("./virtual_renderer").VirtualRenderer;
var Editor = require("./editor").Editor;
var MouseEvent = function (type, opts) {
    var e = document.createEvent("MouseEvents");
    e.initMouseEvent(/click|wheel/.test(type) ? type : "mouse" + type, true, true, window, opts.detail, opts.x, opts.y,
        opts.x, opts.y, opts.ctrl, opts.alt, opts.shift, opts.meta, opts.button || 0, opts.relatedTarget
    );
    return e;
};
var WheelEvent = function (opts) {
    var e = new MouseEvent("wheel", opts);
    e.DOM_DELTA_PIXEL = 0;
    e.DOM_DELTA_LINE = 1;
    e.DOM_DELTA_PAGE = 2;
    e.deltaMode = e["DOM_DELTA_" + opts.mode.toUpperCase()];
    e.deltaX = opts.x || 0;
    e.deltaY = opts.y || 0;
    return e;
};
var editor = null;
var renderer = null;
module.exports = {
    name: "ACE scrollbar_custom.js",
    setUp: function () {
        if (editor) editor.destroy();
        var el = document.createElement("div");

        el.style.left = "20px";
        el.style.top = "30px";
        el.style.width = "300px";
        el.style.height = "100px";
        document.body.appendChild(el);
        renderer = new VirtualRenderer(el);
        renderer.scrollHeight = 50;
        renderer.layerConfig.maxHeight = 200;
        renderer.layerConfig.lineHeight = 14;
        editor = new Editor(renderer);
        editor.on("destroy", function () {
            document.body.removeChild(el);
        });
        editor.setOptions({
            customScrollbar: true
        });
    },
    tearDown: function () {
        editor && editor.destroy();
        editor = null;
    },
    "test: vertical scrolling": function () {
        editor.setValue("a" + "\n".repeat(100) + "b" + "\nxxxxxx", -1);
        renderer.$loop._flush();
        renderer.scrollBarV.element.dispatchEvent(MouseEvent("down", {
            x: 0,
            y: 80,
            button: 0
        }));
        renderer.$loop._flush();
        var thumbTop = renderer.scrollBarV.thumbTop;
        assert.ok(thumbTop > 0);
        editor.container.dispatchEvent(WheelEvent({
            mode: "line",
            y: 50
        }));
        renderer.$loop._flush();
        assert.ok(renderer.scrollBarV.thumbTop > thumbTop);
    },
    "test: dragging vertical scroll thumb": function (done) {
        editor.setValue("a" + "\n".repeat(100) + "b" + "\nxxxxxx", -1);
        renderer.$loop._flush();

        renderer.scrollBarV.inner.dispatchEvent(MouseEvent("down", {
            x: 5,
            y: 10,
            button: 0
        }));
        renderer.$loop._flush();

        renderer.scrollBarV.inner.dispatchEvent(MouseEvent("move", {
            x: 5,
            y: 80,
            button: 0
        }));

        setTimeout(function () {
            assert.ok(renderer.scrollBarV.thumbTop > 0);
            done();
        }, 200);
    },
    "test: horizontal scrolling": function () {
        assert.ok(!renderer.scrollBarH.isVisible);
        editor.setValue("a".repeat(1000), -1);

        renderer.$loop._flush();
        assert.ok(renderer.scrollBarH.isVisible);
        renderer.scrollBarH.element.dispatchEvent(MouseEvent("down", {
            x: 80,
            y: 0,
            button: 0
        }));
        renderer.$loop._flush();

        assert.ok(renderer.scrollBarH.thumbLeft > 0);
    },
    "test: dragging horizontal scroll thumb": function (done) {
        editor.setValue("a".repeat(1000), -1);
        renderer.$loop._flush();

        renderer.scrollBarH.inner.dispatchEvent(MouseEvent("down", {
            x: 5,
            y: 5,
            button: 0
        }));
        renderer.$loop._flush();

        renderer.scrollBarH.inner.dispatchEvent(MouseEvent("move", {
            x: 80,
            y: 5,
            button: 0
        }));

        setTimeout(function () {
            assert.ok(renderer.scrollBarH.thumbLeft > 0);
            done();
        }, 200);
    }

};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
