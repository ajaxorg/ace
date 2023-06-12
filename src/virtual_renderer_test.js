if (typeof process !== "undefined") {
    require("amd-loader");
    require("./test/mockdom");
}

"use strict";

var Range = require("./range").Range;
var Editor = require("./editor").Editor;
var EditSession = require("./edit_session").EditSession;
var VirtualRenderer = require("./virtual_renderer").VirtualRenderer;
var vim = require("./keyboard/vim");
var assert = require("./test/assertions");

function setScreenPosition(node, rect) {
    node.style.left = rect[0] + "px";
    node.style.top = rect[1] + "px";
    node.style.width = rect[2] + "px";
    node.style.height = rect[3] + "px";
}

var editor = null;
module.exports = {
    setUp: function() {
        require("./config").setLoader(function(moduleName, cb) {
            if (moduleName == "ace/ext/error_marker")
                return cb(null, require("./ext/error_marker"));
            if (moduleName == "ace/mode/javascript")
                return cb(null, require("./mode/javascript"));
            throw new Error("module not configured " + moduleName);
        });
        
        if (editor)
            editor.destroy();
        var el = document.createElement("div");

        el.style.left = "20px";
        el.style.top = "30px";
        el.style.width = "300px";
        el.style.height = "100px";
        document.body.appendChild(el);
        var renderer = new VirtualRenderer(el);
        editor = new Editor(renderer);
        editor.on("destroy", function() {
            document.body.removeChild(el);
        });
    },
    tearDown: function() {
        editor && editor.destroy();
        editor = null;
    },
    "test: screen2text the column should be rounded to the next character edge" : function(done) {
        var renderer = editor.renderer;

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
        done();
    },
    "test: handle css transforms" : function(done) {
        var renderer = editor.renderer;
        var fontMetrics = renderer.$fontMetrics;
        setScreenPosition(editor.container, [20, 30, 300, 100]);
        var measureNode = fontMetrics.$measureNode;
        setScreenPosition(measureNode, [0, 0, 10 * measureNode.textContent.length, 15]);
        setScreenPosition(fontMetrics.$main, [0, 0, 10 * measureNode.textContent.length, 15]);
        
        fontMetrics.$characterSize.width = 10;
        renderer.setPadding(0);
        renderer.onResize(true);
        
        assert.equal(fontMetrics.getCharacterWidth(), 1);
        
        renderer.characterWidth = 10;
        renderer.lineHeight = 15;
        
        renderer.gutterWidth = 40;
        editor.setOption("hasCssTransforms", true);
        editor.container.style.transform = "matrix3d(0.7, 0, 0, -0.00066, 0, 0.82, 0, -0.001, 0, 0, 1, 0, -100, -20, 10, 1)";
        editor.container.style.zoom = 1.5;
        var pos = renderer.pixelToScreenCoordinates(100, 200);
        
        var els = fontMetrics.els;
        var rects = [
            [0, 0],
            [-37.60084843635559, 161.62494659423828],
            [114.50254130363464, -6.890693664550781],
            [98.85665202140808, 179.16063690185547]
        ];
        rects.forEach(function(rect, i) {
            els[i].getBoundingClientRect = function() { 
                return { left: rect[0], top: rect[1] };
            };
        });
        
        var r0 = els[0].getBoundingClientRect();
        pos = renderer.pixelToScreenCoordinates(r0.left + 100, r0.top + 200);
        assert.position(pos, 10, 11);
        
        var pos1 = fontMetrics.transformCoordinates(null, [0, 200]);
        assert.ok(pos1[0] - rects[2][0] < 10e-6);
        assert.ok(pos1[1] - rects[2][1] < 10e-6);
        editor.renderer.$loop._flush();
        
        done();
    },
    
    "test scrollmargin + autosize": function(done) {
        editor.setOptions({
            maxLines: 100,
            wrap: true
        });        
        editor.renderer.setScrollMargin(10, 10);
        editor.setValue("\n\n");
        editor.setValue("\n\n\n\n");
        editor.renderer.once("afterRender", function() {
            setTimeout(function() {
                done();
            }, 0);
        });
    },
    
    "test invalid valus of minLines": function() {
        editor.setOptions({
            maxLines: Infinity,
            minLines: Infinity
        });
        editor.renderer.$loop._flush();
        editor.setOptions({
            maxLines: NaN,
            minLines: NaN
        });
        editor.renderer.$loop._flush();
        editor.setOptions({
            maxLines: Number.MAX_SAFE_INTEGER + 1,
            minLines: Number.MAX_SAFE_INTEGER + 1
        });
        editor.renderer.$loop._flush();
    },
    
    "test line widgets": function() {
        editor.session.setValue("a\nb|c\nd");
        editor.session.setAnnotations([{row: 1, column: 2, type: "error"}]);
        editor.execCommand(editor.commands.byName.goToNextError);
        assert.position(editor.getCursorPosition(), 1, 2);
        editor.renderer.$loop._flush();
        assert.ok(editor.session.lineWidgets[1]);
    },
    
    "test wrapped text rendering": function() {
        editor.setValue("a".repeat(452) + "\n" + "b".repeat(100) + "\nxxxxxx", -1);
        editor.container.style.height = "500px";
        editor.setOption("wrap", 40);
        editor.resize(true);
        editor.renderer.$loop._flush();
        
        assert.equal(editor.renderer.$changedLines, null);
        editor.session.remove(new Range(0, 10, 0, 350));
        editor.session.insert({row: 1, column: 1}, "l".repeat(350));
        editor.renderer.$loop._flush();
        var lines = editor.renderer.$textLayer.element.children;
        assert.notEqual(lines[0].style.height, lines[1].style.height);
        assert.equal(lines[0].style.height, lines[1].style.top);
    },
    
    "test resize": function() {
        editor.setValue("Juhu kinners!");
        editor.resize(true);
    },

    "test placeholder": function() {
        editor.setOption("placeholder", "hello");
        assert.equal(editor.renderer.content.textContent, "hello");

        editor.setOption("placeholder", "new");
        assert.equal(editor.renderer.content.textContent, "new");

        editor.setValue("test");
        editor.renderer.$loop._flush();
        assert.equal(editor.renderer.content.textContent, "test");

        editor.setOption("placeholder", "only visible for empty value");
        assert.equal(editor.renderer.content.textContent, "test");

        editor.setValue("");
        editor.renderer.$loop._flush();
        editor._signal("input", {});
        assert.equal(editor.renderer.content.textContent, "only visible for empty value");
    },
    "test: highlight indent guide": function () {
        editor.session.setValue(
            "function Test() {\n" + "    function Inner() {\n" + "        \n" + "        \n" + "    }\n" + "}");
        editor.setOption("highlightIndentGuides", false);
        editor.session.selection.$setSelection(1, 22, 1, 22);
        editor.resize(true);

        function assertIndentGuides(activeIndentGuidesCount) {
            var activeIndentGuides = editor.container.querySelectorAll(".ace_indent-guide-active");
            assert.equal(activeIndentGuides.length, activeIndentGuidesCount);
        }

        assertIndentGuides( 0);

        editor.setOption("highlightIndentGuides", true);
        assertIndentGuides( 2);

        editor.session.selection.clearSelection();
        editor.session.selection.$setSelection(1, 15, 1, 15);
        editor.resize(true);
        assertIndentGuides( 0);
    },
    "test annotation marks": function() {
        function findPointFillStyle(imageData, x, y) {
            var data = imageData.slice(4 * y, 4 * (y + 1));
            var a = Math.round(data[3] / 256 * 100);
            if (a == 100) return "rgb(" + data.slice(0, 3).join(",") + ")";
            return "rgba(" + data.slice(0, 3).join(",") + "," + (a / 100) + ")";
        }

        function assertCoordsColor(expected) {
            var imageData = context.getImageData(0, 0, 1, 100).data;
            for (var el of expected) {
                assert.equal(findPointFillStyle(imageData, el.x, el.y), el.color);
            }
        }

        var renderer = editor.renderer;
        renderer.container.scrollHeight = 100;
        renderer.layerConfig.maxHeight = 200;
        renderer.layerConfig.lineHeight = 14;

        editor.setOptions({
            customScrollbar: true,
            vScrollBarAlwaysVisible: true
        });
        editor.setValue("a" + "\n".repeat(100) + "b" + "\nxxxxxx", -1);
        editor.session.setAnnotations([
            {
                row: 1,
                column: 2,
                type: "error"
            }, {
                row: 4,
                column: 1,
                type: "warning"
            }, {
                row: 20,
                column: 1,
                type: "info"
            }
        ]);
        renderer.$loop._flush();
        var context = renderer.$scrollDecorator.canvas.getContext("2d");
        var scrollDecoratorColors = renderer.$scrollDecorator.colors.light;
        var values = [
            // reflects cursor position on canvas
            {x: 0, y: 0, color: "rgba(0,0,0,0.5)"},
            // reflects error annotation mark on canvas overlapped by cursor
            {x: 0, y: 2, color: scrollDecoratorColors.error},
            // default value
            {x: 0, y: 3, color: "rgba(0,0,0,0)"},
            // reflects warning annotation mark on canvas
            {x: 0, y: 4, color: scrollDecoratorColors.warning},
            {x: 0, y: 5, color: scrollDecoratorColors.warning},
            {x: 0, y: 6, color: "rgba(0,0,0,0)"},
            {x: 0, y: 20, color: scrollDecoratorColors.info},
            {x: 0, y: 21, color: scrollDecoratorColors.info}
        ];
        assertCoordsColor(values);
        editor.moveCursorTo(5, 6);
        renderer.$loop._flush();
        values = [
            {x: 0, y: 0, color: "rgba(0,0,0,0)"},
            {x: 0, y: 1, color: scrollDecoratorColors.error},
            {x: 0, y: 2, color: scrollDecoratorColors.error},
            {x: 0, y: 3, color: "rgba(0,0,0,0)"},
            {x: 0, y: 4, color: scrollDecoratorColors.warning},
            {x: 6, y: 6, color: "rgba(0,0,0,0.5)"}
        ];
        assertCoordsColor(values);
        renderer.session.addFold("...", new Range(0, 0, 3, 2));
        editor.moveCursorTo(10, 0);
        renderer.$loop._flush();
        values = [
            {x: 0, y: 0, color: scrollDecoratorColors.error},
            {x: 0, y: 1, color: scrollDecoratorColors.error},
            {x: 0, y: 2, color: scrollDecoratorColors.warning},
            {x: 0, y: 3, color: "rgba(0,0,0,0)"},
            {x: 0, y: 4, color: "rgba(0,0,0,0)"},
            {x: 0, y: 5, color: "rgba(0,0,0,0)"},
            {x: 0, y: 6, color: "rgba(0,0,0,0)"}
        ];
        assertCoordsColor(values);
    },
    "test ghost text": function() {
        editor.session.setValue("abcdef");
        editor.setGhostText("Ghost");

        editor.renderer.$loop._flush();
        assert.equal(editor.renderer.content.textContent, "Ghostabcdef");

        editor.setGhostText("Ghost", {row: 0, column: 3});

        editor.renderer.$loop._flush();
        assert.equal(editor.renderer.content.textContent, "abcGhostdef");

        editor.setGhostText("Ghost", {row: 0, column: 6});

        editor.renderer.$loop._flush();
        assert.equal(editor.renderer.content.textContent, "abcdefGhost");

        editor.removeGhostText();

        editor.renderer.$loop._flush();
        assert.equal(editor.renderer.content.textContent, "abcdef");
    },

    "test multiline ghost text": function() {
        editor.session.setValue("abcdef");
        editor.renderer.$loop._flush();

        editor.setGhostText("Ghost1\nGhost2\nGhost3", {row: 0, column: 6});

        editor.renderer.$loop._flush();
        assert.equal(editor.renderer.content.textContent, "abcdefGhost1");
        
        assert.equal(editor.session.lineWidgets[0].el.textContent, "Ghost2\nGhost3");

        editor.removeGhostText();

        editor.renderer.$loop._flush();
        assert.equal(editor.renderer.content.textContent, "abcdef");
        
        assert.equal(editor.session.lineWidgets, null);
    },
    "test: brackets highlighting": function (done) {
        var renderer = editor.renderer;
        editor.session.setValue(
            "function Test() {\n" + "    function Inner(){\n" + "        \n" + "        \n" + "    }\n" + "}");
        editor.session.selection.$setSelection(1, 21, 1, 21);
        renderer.$loop._flush();

        setTimeout(function () {
            assert.ok(editor.session.$bracketHighlight);
            assert.range(editor.session.$bracketHighlight.ranges[0], 1, 20, 1, 21);
            assert.range(editor.session.$bracketHighlight.ranges[1], 4, 4, 4, 5);

            editor.session.selection.$setSelection(1, 16, 1, 16);
            setTimeout(function () {
                assert.ok(editor.session.$bracketHighlight == null);
                editor.setKeyboardHandler(vim.handler);
                editor.session.selection.$setSelection(1, 20, 1, 20);
                setTimeout(function () {
                    assert.ok(editor.session.$bracketHighlight);
                    assert.range(editor.session.$bracketHighlight.ranges[0], 1, 20, 1, 21);
                    assert.range(editor.session.$bracketHighlight.ranges[1], 4, 4, 4, 5);
                    done();
                }, 60);
            }, 60);
        }, 60);
    },
    "test: scroll cursor into view": function() {
        function X(n) {
            return "X".repeat(n);
        }
        editor.session.setValue(`${X(10)}\n${X(1000)}}`);

        var initialContentLeft = editor.renderer.content.getBoundingClientRect().left;

        // Scroll so far to the right that the first line is completely hidden
        editor.session.selection.$setSelection(1, 1000, 1, 1000);
        editor.renderer.scrollCursorIntoView();
        editor.renderer.$loop._flush();

        editor.session.selection.$setSelection(0, 10, 0, 10);
        editor.renderer.scrollCursorIntoView();
        editor.renderer.$loop._flush();

        var contentLeft = editor.renderer.content.getBoundingClientRect().left;
        var scrollDelta = initialContentLeft - contentLeft;

        const leftBoundPixelPos = editor.renderer.$cursorLayer.getPixelPosition({row: 0, column: 8}).left;
        const rightBoundPixelPos = editor.renderer.$cursorLayer.getPixelPosition({row: 0, column: 9}).left;
        assert.ok(
            scrollDelta >= leftBoundPixelPos && scrollDelta < rightBoundPixelPos,
            "Expected content to have been scrolled two characters beyond the cursor"
        );
    },
    "test: set gutter class": function(done) {
        editor.session.setMode("ace/mode/javascript", function() {
            editor.session.setValue("x = {\n  foo: 1\n}");
            editor.execCommand("toggleFoldWidget");
            editor.renderer.$loop._flush();
            assert.equal(editor.renderer.$loop.changes, 0);
            var cell = editor.renderer.$gutterLayer.$lines.cells[0];
            assert.equal(cell.element.childNodes[1].className, "ace_fold-widget ace_start ace_closed");
            assert.equal(cell.element.className.trim(), "ace_gutter-cell ace_gutter-active-line");

            editor.session.setBreakpoint(0, "hello");
            assert.notEqual(editor.renderer.$loop.changes, 0);
            editor.renderer.$loop._flush();

            cell = editor.renderer.$gutterLayer.$lines.cells[0];
            assert.equal(editor.renderer.$loop.changes, 0);
            assert.equal(cell.element.className, "ace_gutter-cell ace_gutter-active-line hello");
            done();
        });
    }

    // change tab size after setDocument (for text layer)
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
