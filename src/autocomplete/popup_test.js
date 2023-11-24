if (typeof process !== "undefined") {
    require("amd-loader");
    require("../test/mockdom");
}

"use strict";

var assert = require("../test/assertions");
var AcePopup = require("./popup").AcePopup;

var popup;
var lineHeight = 14;
var renderHeight = 8 * lineHeight;
var renderWidth = 300;
var iframe;

var notEnoughSpaceOnRight = window.innerWidth - 50;
var notEnoughSpaceOnBottom = window.innerHeight - 50;

var originalDocument;

var completions = [];

for (var i = 0; i < 8; i++) {
    completions.push({ value: "foo" + i, caption: "foo" + i, name: "foo" + i, score: 4 });
}

var tryShowAndRender = function(pos, lineHeight, anchor, forceShow) {
    var result = popup.tryShow(pos, lineHeight, anchor, forceShow);
    popup.renderer.updateFull(true);
    return result;
};


var setupPopup = function() {
    popup = new AcePopup(document.body);

    // Mock the CSS behaviour
    popup.container.style.width = "300px";
    popup.setData(completions, "");
};

var tearDown = function(done) {
    if (popup) {
        var el = popup.container;
        if (el && el.parentNode)
            el.parentNode.removeChild(el);
    }
    if (iframe)
        document.body.removeChild(iframe);
    if (originalDocument) {
        window.document = originalDocument;
        originalDocument = null;
    }
    done && done();
};

module.exports = {
    "test: verify width and height": function(done) {
        setupPopup();
        tryShowAndRender({ top: 0, left: 0 }, lineHeight, "bottom");
        renderHeight = popup.container.offsetHeight;
        assert.strictEqual(popup.isOpen, true);
        assert.strictEqual(renderHeight > 0, true);
        popup.hide();
        assert.strictEqual(popup.isOpen, false);
        done();
    },
    "test: tryShow does not display popup if there is not enough space on the anchor side": function(done) {
        setupPopup();
        var result = tryShowAndRender({ top: notEnoughSpaceOnBottom, left: 0}, lineHeight, "bottom");
        assert.strictEqual(result, false);
        assert.strictEqual(popup.isOpen, false);
        result = tryShowAndRender({ top: 50, left: 0}, lineHeight, "top");
        assert.strictEqual(result, false);
        assert.strictEqual(popup.isOpen, false);
        done();
    },
    "test: tryShow slides popup on the X axis if there are not enough space on the right": function(done) {
        setupPopup();
        
        var result = tryShowAndRender({ top: 0, left: notEnoughSpaceOnRight }, lineHeight, "bottom");
        assert.strictEqual(result, true);
        assert.strictEqual(popup.isOpen, true);
        assert.strictEqual(popup.container.getBoundingClientRect().right, window.innerWidth);
        assert.strictEqual(Math.abs(popup.container.getBoundingClientRect().width - renderWidth) < 5, true);
        popup.hide();
        assert.strictEqual(popup.isOpen, false);

        result = tryShowAndRender({ top: notEnoughSpaceOnBottom, left: notEnoughSpaceOnRight }, lineHeight, "top");
        assert.strictEqual(result, true);
        assert.strictEqual(popup.isOpen, true);
        assert.strictEqual(popup.container.getBoundingClientRect().right, window.innerWidth);
        assert.strictEqual(Math.abs(popup.container.getBoundingClientRect().width - renderWidth) < 5, true);
        popup.hide();
        assert.strictEqual(popup.isOpen, false);
        done();
    },
    "test: tryShow called with forceShow resizes popup height to fit popup": function(done) {
        setupPopup();
        
        var result = tryShowAndRender({ top: notEnoughSpaceOnBottom, left: 0 }, lineHeight, "bottom", true);
        assert.strictEqual(result, true);
        assert.strictEqual(popup.isOpen, true);
        assert.notEqual(popup.container.style.display, "none");
        assert.strictEqual(popup.container.getBoundingClientRect().height <= 50, true);
        assert.strictEqual(popup.container.getBoundingClientRect().top > notEnoughSpaceOnBottom + lineHeight, true);
        assert.strictEqual(Math.abs(popup.container.getBoundingClientRect().width - renderWidth) < 5, true);
        popup.hide();
        assert.strictEqual(popup.isOpen, false);

        result = tryShowAndRender({ top: 50, left: 0 }, lineHeight, "top", true);
        assert.strictEqual(result, true);
        assert.strictEqual(popup.isOpen, true);
        assert.notEqual(popup.container.style.display, "none");
        assert.strictEqual(popup.container.getBoundingClientRect().height <= 50, true);
        assert.strictEqual(popup.container.getBoundingClientRect().bottom <= 50, true);
        assert.strictEqual(Math.abs(popup.container.getBoundingClientRect().width - renderWidth) < 5, true);
        popup.hide();
        assert.strictEqual(popup.isOpen, false);
        done();
    },
    "test: show displays popup in all 4 corners correctly without topdownOnly specified": function(done) {
        setupPopup();
        popup.show({ top: 50, left: 0 }, lineHeight);
        popup.renderer.updateFull(true);
        assert.notEqual(popup.container.style.display, "none");
        assert.strictEqual(popup.container.getBoundingClientRect().height, renderHeight);
        assert.ok(popup.container.getBoundingClientRect().top >= 50 + lineHeight);
        popup.hide();
        assert.strictEqual(popup.container.style.display, "none");

        popup.show({ top: notEnoughSpaceOnBottom, left: 0 }, lineHeight);
        popup.renderer.updateFull(true);
        assert.notEqual(popup.container.style.display, "none");
        assert.strictEqual(popup.container.getBoundingClientRect().height, renderHeight);
        assert.ok(popup.container.getBoundingClientRect().bottom <= notEnoughSpaceOnBottom);
        popup.hide();
        assert.strictEqual(popup.container.style.display, "none");

        popup.show({ top: 50, left: notEnoughSpaceOnRight }, lineHeight);
        popup.renderer.updateFull(true);
        assert.notEqual(popup.container.style.display, "none");
        assert.strictEqual(popup.container.getBoundingClientRect().height, renderHeight);
        assert.ok(popup.container.getBoundingClientRect().top >= 50 + lineHeight);
        popup.hide();
        assert.strictEqual(popup.container.style.display, "none");

        popup.show({ top: notEnoughSpaceOnBottom, left: notEnoughSpaceOnRight }, lineHeight);
        popup.renderer.updateFull(true);
        assert.notEqual(popup.container.style.display, "none");
        assert.strictEqual(popup.container.getBoundingClientRect().height, renderHeight);
        assert.ok(popup.container.getBoundingClientRect().bottom <= notEnoughSpaceOnBottom);
        popup.hide();
        assert.strictEqual(popup.container.style.display, "none");
        done();
    },
    "test: show displays popup in all 4 corners correctly with topdownOnly specified": function(done) {
        setupPopup();
        popup.show({ top: 50, left: 0 }, lineHeight, true);
        popup.renderer.updateFull(true);
        assert.notEqual(popup.container.style.display, "none");
        assert.strictEqual(popup.container.getBoundingClientRect().height, renderHeight);
        assert.ok(popup.container.getBoundingClientRect().top >= 50 + lineHeight);
        popup.hide();
        assert.strictEqual(popup.container.style.display, "none");

        popup.show({ top: 50, left: notEnoughSpaceOnRight }, lineHeight);
        popup.renderer.updateFull(true);
        assert.notEqual(popup.container.style.display, "none");
        assert.strictEqual(popup.container.getBoundingClientRect().height, renderHeight);
        assert.ok(popup.container.getBoundingClientRect().top >= 50 + lineHeight);
        popup.hide();
        assert.strictEqual(popup.container.style.display, "none");

        popup.show({ top: notEnoughSpaceOnBottom, left: 0 }, lineHeight, true);
        popup.renderer.updateFull(true);
        assert.notEqual(popup.container.style.display, "none");
        assert.ok(popup.container.getBoundingClientRect().height <= 50);
        assert.ok(popup.container.getBoundingClientRect().top >= notEnoughSpaceOnBottom + lineHeight);
        popup.hide();
        assert.strictEqual(popup.container.style.display, "none");

        popup.show({ top: notEnoughSpaceOnBottom, left: notEnoughSpaceOnRight }, lineHeight, true);
        popup.renderer.updateFull(true);
        assert.notEqual(popup.container.style.display, "none");
        assert.ok(popup.container.getBoundingClientRect().height <= 50);
        assert.ok(popup.container.getBoundingClientRect().top >= notEnoughSpaceOnBottom + lineHeight);
        popup.hide();
        assert.strictEqual(popup.container.style.display, "none");
        done();
    },
    "test: resets popup size if space is available again": function(done) {
        setupPopup();
        popup.show({ top: notEnoughSpaceOnBottom, left: notEnoughSpaceOnRight }, lineHeight, true);
        popup.renderer.updateFull(true);
        assert.notEqual(popup.container.style.display, "none");
        assert.ok(popup.container.getBoundingClientRect().height <= 50);
        assert.ok(popup.container.getBoundingClientRect().top >= notEnoughSpaceOnBottom + lineHeight);
        popup.hide();
        assert.strictEqual(popup.container.style.display, "none");

        popup.show({ top: 50, left: notEnoughSpaceOnRight }, lineHeight);
        popup.renderer.updateFull(true);
        assert.notEqual(popup.container.style.display, "none");
        assert.ok(popup.container.getBoundingClientRect().height, renderHeight);
        assert.ok(popup.container.getBoundingClientRect().top >= 50 + lineHeight);
        popup.hide();
        assert.strictEqual(popup.container.style.display, "none");
        done();
    },
    tearDown: tearDown
};

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
