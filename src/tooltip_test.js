/*global CustomEvent*/
if (typeof process !== "undefined") {
    require("./test/mockdom");
}

"use strict";

var ace = require("./ace");
var assert = require("./test/assertions");
var HoverTooltip = require("./tooltip").HoverTooltip;
var Range = require("./range").Range;
var dom = require("./lib/dom");

var editor, docTooltip;
module.exports = {
    setUp: function() {
        docTooltip = new HoverTooltip();
        editor = ace.edit(null, {
            value: "Hello empty world"
        });
        document.body.appendChild(editor.container);
        editor.container.style.height = "200px";
        editor.container.style.width = "300px";
        
        docTooltip.setDataProvider(function(e, editor) {
            let session = editor.session;
            let docPos = e.getDocumentPosition();
            
            var range = session.getWordRange(docPos.row, docPos.column);

            var domNode = document.createElement("span");
            domNode.textContent = "tooltip " + range;
            domNode.className = "doc-tooltip";
            docTooltip.showForRange(editor, range, domNode, e);
        });
    },
    tearDown: function() {
        editor.destroy();
        docTooltip.destroy();
        editor = docTooltip = null;
    },
    "test: show doc tooltip" : function(next) {
        docTooltip.addToEditor(editor);
        
        editor.resize(true);
        docTooltip.idleTime = 3;
        mouse("move", {row: 0, column: 1});
        setTimeout(function() {
            var nodes = document.querySelectorAll(".doc-tooltip");
            assert.equal(nodes.length, 1);
            assert.equal(nodes[0].textContent, "tooltip Range: [0/0] -> [0/5]");
            assert.equal(docTooltip.$element.style.display, "block");
            mouse("move", {row: 0, column: 9});
            assert.equal(docTooltip.$element.style.display, "none");
            setTimeout(function() {
                assert.equal(docTooltip.$element.textContent, "tooltip Range: [0/6] -> [0/11]");
                assert.equal(docTooltip.$element.style.display, "block");
                mouse("down", docTooltip.$element, {button: 0});
                mouse("up", docTooltip.$element, {button: 0});
                assert.equal(docTooltip.$element.style.display, "block");
                mouse("down", {row: 0, column: 8}, {button: 0});
                assert.ok(editor.$mouseHandler.isMousePressed);
                assert.equal(docTooltip.$element.style.display, "none");
                setTimeout(function() {
                    assert.equal(docTooltip.$element.style.display, "none");
                    assert.ok(editor.$mouseHandler.isMousePressed);
                    mouse("move", {row: 0, column: 13}, {which: 1});
                    assert.ok(editor.$mouseHandler.isMousePressed);
                    setTimeout(function() {
                        assert.equal(docTooltip.$element.style.display, "none");
                        mouse("up", {row: 0, column: 13});
                        assert.ok(!editor.$mouseHandler.isMousePressed);
                        
                        docTooltip.idleTime = 20;
                        assert.ok(!docTooltip.timeout);
                        mouse("move", {row: 0, column: 1});
                        assert.ok(docTooltip.timeout);
                        docTooltip.lastT = Date.now();
                        docTooltip.waitForHover();
                        assert.equal(docTooltip.$element.style.display, "none");
                        mouse("move", {row: 0, column: 13});
                        docTooltip.lastT = Date.now() - docTooltip.idleTime;
                        docTooltip.waitForHover();
                        assert.equal(docTooltip.$element.style.display, "block");

                        assert.equal(docTooltip.$element.textContent, "tooltip Range: [0/12] -> [0/17]");
                        mouse("out", docTooltip.$element, {relatedTarget: document.body});
                        assert.equal(docTooltip.$element.style.display, "none");
                        assert.ok(!docTooltip.timeout);

                        docTooltip.idleTime = 3;
                        mouse("move", editor.container);
                        setTimeout(function() {
                            mouse("move", {row: 0, column: 13});
                            assert.equal(docTooltip.$element.style.display, "none");
                            setTimeout(function() {
                                assert.equal(docTooltip.$element.style.display, "block");
                                assert.equal(docTooltip.$element.textContent, "tooltip Range: [0/12] -> [0/17]");
                                mouse("move", editor.renderer.scroller);
                                assert.equal(docTooltip.$element.style.display, "none");
                                next();
                            }, 6);
                        }, 6);
                    }, 6);
                }, 6);
            }, 6);
        }, 6);
    },
    "test: find best position": function() {
        editor.resize(true); 
        editor.setValue("very long text ".repeat(100), 1);
        editor.renderer.scrollCursorIntoView();
        var domNode = dom.buildDom(["div"]);
        var w = window.innerWidth;
        var h = window.innerHeight;
        editor.resize(true); 
        
        // workaround for css styles not being applied in mockdom
        docTooltip.$element.style.maxWidth = "300px";
        
        // prefer showing above if possible
        editor.container.style.top = 20 + "px";
        editor.container.style.top = h / 3 + "px";
        domNode.style.width = 2 * w + "px";
        domNode.style.height = h / 4 + "px";
        var range = new Range(0, 0, 0, editor.session.getLine(0).length);
        docTooltip.showForRange(editor, range, domNode);
        
        var position = editor.renderer.textToScreenCoordinates(range.start.row, range.start.column);
        assert.ok(position.pageX < 0);
        var rect = docTooltip.$element.getBoundingClientRect();
        assert.ok(rect.left > 0);
        assert.ok(rect.top < h / 3);
        
        // show below if height is large
        domNode.style.height = 2 * h + "px";
        docTooltip.showForRange(editor, range, domNode);
        rect = docTooltip.$element.getBoundingClientRect();
        assert.ok(rect.top > h / 3);
        
        // show above if there is more space there
        editor.container.style.top = h / 2 + "px";
        domNode.style.height = 2 * h + "px";
        docTooltip.showForRange(editor, range, domNode);
        rect = docTooltip.$element.getBoundingClientRect();
        assert.ok(rect.top < h / 3);
        
        editor.container.style.left = w - 20 + "px";
        docTooltip.showForRange(editor, range, domNode);
        rect = docTooltip.$element.getBoundingClientRect();
        assert.ok(rect.left < w - 100);
    },
    "test: remove listeners": function() {
        var l = editor._eventRegistry.mousemove.length;
        docTooltip.addToEditor(editor);
        assert.ok(!docTooltip.timeout);
        assert.equal(editor._eventRegistry.mousemove.length, l + 1);
        mouse("move", {row: 0, column: 1});
        assert.ok(docTooltip.timeout);
        docTooltip.removeFromEditor(editor);
        assert.ok(!docTooltip.timeout);
        assert.equal(editor._eventRegistry.mousemove.length, l);
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
