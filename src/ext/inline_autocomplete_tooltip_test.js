if (typeof process !== "undefined") {
    require("amd-loader");
    require("../test/mockdom");
}

"use strict";

var TOOLTIP_ID = require("./inline_autocomplete").TOOLTIP_ID;
var BUTTON_CLASS_NAME = require("./inline_autocomplete").BUTTON_CLASS_NAME;
var InlineTooltip = require("./inline_autocomplete").InlineTooltip;
var Editor = require("../ace").Editor;
var EditSession = require("../ace").EditSession;
var VirtualRenderer = require("../ace").VirtualRenderer;
var assert = require("../test/assertions");

function mousedown(node) {
    node.dispatchEvent(new window.CustomEvent("mousedown", { bubbles: true }));
}

var editor;
var counters = {};
var inlineTooltip;
var testCommand2Enabled = true;
var commands = {
    "testCommand1": {
        name: "testCommand1",
        bindKey: "Alt-K",
        exec: function(editor) {
            if (!editor) {
                return;
            }
            if (!counters["testCommand1"]) {
            counters["testCommand1"] = 0;
            }
            counters["testCommand1"]++;
        },
        enabled: function(editor) {
            if (!editor) {
                return;
            }
            if (!counters["testEnabled1"]) {
                counters["testEnabled1"] = 0;
            }
            counters["testEnabled1"]++;
            return true;
        },
        position: 10
    },
    "testCommand2": {
        name: "testCommand2",
        bindKey: "Alt-L",
        exec: function(editor) {
            if (!editor) {
                return;
            }
            if (!counters["testCommand2"]) {
            counters["testCommand2"] = 0;
            }
            counters["testCommand2"]++;
        },
        enabled: function(editor) {
            if (!editor) {
                return;
            }
            if (!counters["testEnabled2"]) {
                counters["testEnabled2"] = 0;
            }
            counters["testEnabled2"]++;
            return testCommand2Enabled;
        },
        position: 20
    }
};

module.exports = {
    setUp: function() {
        var el = document.createElement("div");
        el.style.left = "20px";
        el.style.top = "30px";
        el.style.width = "500px";
        el.style.height = "500px";
        document.body.appendChild(el);
        var renderer = new VirtualRenderer(el);
        var session = new EditSession("abc123\n\nfunc");
        editor = new Editor(renderer, session);
        counters = {};
        inlineTooltip = new InlineTooltip(editor, document.body);
        inlineTooltip.setCommands(commands);
        testCommand2Enabled = true;
        editor.getSelection().moveCursorFileEnd();
        editor.renderer.$loop._flush();
    },
    "test: displays inline tooltip above cursor with commands": function(done) {
        var tooltipDomElement = document.getElementById(TOOLTIP_ID);
        assert.strictEqual(inlineTooltip.isShown(), false);
        assert.strictEqual(window.getComputedStyle(tooltipDomElement).display, "none");

        inlineTooltip.show(editor);
        tooltipDomElement = document.getElementById(TOOLTIP_ID);
        assert.strictEqual(window.getComputedStyle(tooltipDomElement).display, "");
        assert.strictEqual(inlineTooltip.isShown(), true);
        done();
    },
    "test: commands are clickable": function(done) {
        inlineTooltip.show(editor);
        assert.strictEqual(inlineTooltip.isShown(), true);
        assert.strictEqual(counters["testCommand1"], undefined);
        var buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
        assert.strictEqual(buttonElements.length, 2);
        mousedown(buttonElements[0]);
        mousedown(buttonElements[1]);
        assert.strictEqual(counters["testCommand1"], 1);
        done();
    },
    "test: commands are disabled when enable check is falsy": function(done) {
        inlineTooltip.show(editor);
        var buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
        var disabledButtonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME + "_disabled"));
        assert.strictEqual(buttonElements.length, 2);
        assert.strictEqual(disabledButtonElements.length, 0);
        assert.strictEqual(buttonElements.filter(function (button) { return !button.disabled; }).length, 2);
        assert.strictEqual(counters["testEnabled1"], 1);
        assert.strictEqual(counters["testEnabled2"], 1);

        testCommand2Enabled = false;
        inlineTooltip.updateButtons();
        buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
        disabledButtonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME + "_disabled"));
        assert.strictEqual(buttonElements.length, 1);
        assert.strictEqual(disabledButtonElements.length, 1);
        assert.strictEqual(disabledButtonElements.filter(function (button) { return button.disabled; }).length, 1);
        assert.strictEqual(buttonElements.filter(function (button) { return !button.disabled; }).length, 1);
        assert.strictEqual(counters["testEnabled1"], 2);
        assert.strictEqual(counters["testEnabled2"], 2);
        done();
    },
    "test: verify detach": function(done) {
        inlineTooltip.show(editor);
        var tooltipDomElement = document.getElementById(TOOLTIP_ID);
        assert.strictEqual(inlineTooltip.isShown(), true);

        inlineTooltip.detach();
        assert.strictEqual(inlineTooltip.isShown(), false);
        var tooltipDomElement = document.getElementById(TOOLTIP_ID);
        assert.strictEqual(window.getComputedStyle(tooltipDomElement).display, "none");
        done();
    },
    "test: verify destroy": function(done) {
        inlineTooltip.show(editor);
        var tooltipDomElement = document.getElementById(TOOLTIP_ID);
        assert.strictEqual(inlineTooltip.isShown(), true);
        assert.ok(tooltipDomElement);

        inlineTooltip.destroy();
        assert.strictEqual(inlineTooltip.isShown(), false);
        tooltipDomElement = document.getElementById(TOOLTIP_ID);
        assert.equal(tooltipDomElement, null);

        // Intentionally called twice
        inlineTooltip.destroy();
        assert.strictEqual(inlineTooltip.isShown(), false);
        tooltipDomElement = document.getElementById(TOOLTIP_ID);
        assert.equal(tooltipDomElement, null);
        done();
    },
    tearDown: function() {
        inlineTooltip.destroy();
        editor.destroy();
    }
};

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
