
if (typeof process !== "undefined") {
    require("amd-loader");
    require("../test/mockdom");
}

"use strict";

var Editor = require("../editor").Editor;
var EditSession = require("../edit_session").EditSession;
var InlineAutocomplete = require("./inline_autocomplete").InlineAutocomplete;
const { Autocomplete } = require("../autocomplete");
var assert = require("../test/assertions");
var BUTTON_CLASS_NAME = require("./command_bar").BUTTON_CLASS_NAME;
var type = require("../test/user").type;
var VirtualRenderer = require("../virtual_renderer").VirtualRenderer;

var editor;
var autocomplete;
var inlineTooltip;
var wrapperEl;

function simulateClick(node) {
    node.dispatchEvent(new window.CustomEvent("click", { bubbles: true }));
}


var getAllLines = function() {
    var text = Array.from(editor.renderer.$textLayer.element.childNodes).map(function (node) {
        return node.textContent;
    }).join("\n");
    if (editor.renderer.$ghostTextWidget) {
        return text + "\n" + editor.renderer.$ghostTextWidget.el.innerHTML;
    }
    return text;
};

var typeAndChange = function(...args) {
    assert.equal(autocomplete.changeTimer.isPending(), null);
    type(args);
    assert.ok(autocomplete.changeTimer.isPending);
    autocomplete.changeTimer.call();
};

var completions = [
    {
        value: "foo"
    },
    {
        value: "foobar"
    },
    {
        value: "function"
    },
    {
        value: "fundraiser"
    },
    {
        snippet: "function foo() {\n    console.log('test');\n}",
        caption: "func"
    },
    {
        value: "foobar2"
    }
];

var mockCompleter = {
    getCompletions: function(_1, _2, _3, _4, callback) {
        callback(null, completions);
    }
};

var setupInlineTooltip = function() {
    inlineTooltip = autocomplete.getInlineTooltip();
    inlineTooltip.setAlwaysShow(true);
    // Workaround: non-standard width and height hints for mock dom (mock dom does not work well with flex elements)
    // When running in the browser, these are ignored
    inlineTooltip.tooltip.getElement().style.widthHint = 150;
    inlineTooltip.tooltip.getElement().style.heightHint = editor.renderer.lineHeight * 2;
    inlineTooltip.moreOptions.getElement().style.widthHint = 150;
    inlineTooltip.moreOptions.getElement().style.heightHint = editor.renderer.lineHeight * 2;
};

module.exports = {
    setUp: function(done) {
        wrapperEl = document.createElement("div");
        wrapperEl.style.position = "fixed";
        wrapperEl.style.left = "400px";
        wrapperEl.style.top = "30px";
        wrapperEl.style.width = "500px";
        wrapperEl.style.height = "500px";
        document.body.appendChild(wrapperEl);
        var renderer = new VirtualRenderer(wrapperEl);
        var session = new EditSession("");
        editor = new Editor(renderer, session);
        editor.setOption("enableInlineAutocompletion", true);
        editor.execCommand("insertstring", "f");
        editor.getSelection().moveCursorFileEnd();
        editor.renderer.$loop._flush();
        editor.completers = [mockCompleter];
        autocomplete = InlineAutocomplete.for(editor);
        setupInlineTooltip();
        editor.focus();
        done();
    },
    "test: autocomplete completion shows up": function(done) {
        autocomplete.show(editor);
        assert.strictEqual(autocomplete.getIndex(), 0);
        assert.strictEqual(autocomplete.getData().value, "foo");
        editor.renderer.$loop._flush();
        assert.strictEqual(getAllLines(), "foo");
        done();
    },
    "test: autocomplete start keybinding works": function(done) {
        type("Alt-C");
        assert.strictEqual(autocomplete.isOpen(), true);
        assert.strictEqual(autocomplete.getIndex(), 0);
        assert.strictEqual(autocomplete.getData().value, "foo");
        editor.renderer.$loop._flush();
        assert.strictEqual(getAllLines(), "foo");
        autocomplete.detach();

        editor.setOption("enableInlineAutocompletion", false);

        type("Alt-C");
        assert.strictEqual(autocomplete.isOpen(), false);
        assert.strictEqual(autocomplete.getIndex(), -1);
        editor.renderer.$loop._flush();
        assert.strictEqual(getAllLines(), "f");

        done();
    },
    "test: replaces different autocomplete implementation for the editor when opened": function(done) {
        var completer = Autocomplete.for(editor);
        completer.showPopup(editor, {});
        assert.strictEqual(editor.completer, completer);
        assert.strictEqual(autocomplete.isOpen(), false);

        autocomplete = InlineAutocomplete.for(editor);
        autocomplete.show(editor);
        assert.strictEqual(editor.completer.isOpen(), true);
        editor.renderer.$loop._flush();
        assert.strictEqual(getAllLines(), "foo");

        done();
    },
    "test: autocomplete tooltip is shown according to the selected option": function(done) {
        autocomplete.show(editor);
        assert.strictEqual(inlineTooltip.isShown(), true);

        autocomplete.detach();
        assert.strictEqual(inlineTooltip.isShown(), false);
        done();
    },
    "test: autocomplete keyboard navigation works": function(done) {
        autocomplete.show(editor);
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), 0);
        assert.strictEqual(autocomplete.getData().value, "foo");
        assert.equal(getAllLines(), "foo");

        type("Alt-]");
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), 1);
        assert.strictEqual(autocomplete.getData().value, "foobar");
        assert.equal(getAllLines(), "foobar");

        type("Alt-[");
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), 0);
        assert.strictEqual(autocomplete.getData().value, "foo");
        assert.equal(getAllLines(), "foo");
        done();
    },
    "test: autocomplete tooltip navigation works": function(done) {
        autocomplete.show(editor);
        assert.strictEqual(autocomplete.getInlineTooltip().isShown(), true);

        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), 0);
        assert.strictEqual(autocomplete.getData().value, "foo");
        assert.strictEqual(getAllLines(), "foo");

        var buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));

        var prevButton = buttonElements[0];
        var nextButton = buttonElements[2];

        simulateClick(prevButton);

        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), 5);
        assert.strictEqual(autocomplete.getData().value, "fundraiser");
        assert.strictEqual(getAllLines(), "fundraiser");

        simulateClick(nextButton);

        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), 0);
        assert.strictEqual(autocomplete.getData().value, "foo");
        assert.strictEqual(getAllLines(), "foo");

        simulateClick(nextButton);

        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), 1);
        assert.strictEqual(autocomplete.getData().value, "foobar");
        assert.strictEqual(getAllLines(), "foobar");

        autocomplete.setIndex(5);
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getData().value, "fundraiser");
        assert.equal(getAllLines(), "fundraiser");

        simulateClick(nextButton);

        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), 0);
        assert.strictEqual(autocomplete.getData().value, "foo");
        assert.strictEqual(getAllLines(), "foo");

        simulateClick(prevButton);

        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), 5);
        assert.strictEqual(autocomplete.getData().value, "fundraiser");
        assert.strictEqual(getAllLines(), "fundraiser");

        simulateClick(prevButton);

        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), 4);
        assert.strictEqual(autocomplete.getData().value, "function");
        assert.strictEqual(getAllLines(), "function");

        done();
    },
    "test: verify goTo commands": function(done) {
        autocomplete.show(editor);
        autocomplete.setIndex(1);
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getData().value, "foobar");
        assert.equal(getAllLines(), "foobar");

        autocomplete.goTo("next");
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), 2);
        assert.strictEqual(autocomplete.getData().value, "foobar2");
        assert.strictEqual(getAllLines(), "foobar2");

        autocomplete.goTo("prev");
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), 1);
        assert.strictEqual(autocomplete.getData().value, "foobar");
        assert.strictEqual(getAllLines(), "foobar");

        autocomplete.goTo("last");
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), 5);
        assert.strictEqual(autocomplete.getData().value, "fundraiser");
        assert.strictEqual(getAllLines(), "fundraiser");

        autocomplete.goTo("next");
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), 0);
        assert.strictEqual(autocomplete.getData().value, "foo");
        assert.strictEqual(getAllLines(), "foo");

        autocomplete.setIndex(5);
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getData().value, "fundraiser");
        assert.equal(getAllLines(), "fundraiser");

        autocomplete.goTo("first");
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), 0);
        assert.strictEqual(autocomplete.getData().value, "foo");
        assert.strictEqual(getAllLines(), "foo");

        autocomplete.goTo("prev");
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), 5);
        assert.strictEqual(autocomplete.getData().value, "fundraiser");
        assert.strictEqual(getAllLines(), "fundraiser");
        done();
    },
    "test: set index to negative value hides suggestions": function(done) {
        autocomplete.show(editor);
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), 0);
        assert.strictEqual(getAllLines(), "foo");

        autocomplete.setIndex(-1);
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.isOpen(), false);
        assert.strictEqual(getAllLines(), "f");
        done();
    },
    "test: autocomplete can be closed": function(done) {
        autocomplete.show(editor);
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.isOpen(), true);
        assert.equal(getAllLines(), "foo");

        type("Escape");
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.isOpen(), false);
        assert.equal(getAllLines(), "f");
        done();
    },
    "test: autocomplete can be accepted": function(done) {
        autocomplete.show(editor);
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.isOpen(), true);
        assert.ok(document.querySelectorAll(".ace_ghost_text").length > 0);
        assert.strictEqual(getAllLines(), "foo");

        type("Tab");
        editor.renderer.$loop._flush();
        assert.equal(autocomplete.inlineCompleter, null);
        assert.equal(autocomplete.inlineTooltip.isShown(), false);
        assert.strictEqual(autocomplete.isOpen(), false);
        assert.equal(editor.renderer.$ghostText, null);
        assert.equal(editor.renderer.$ghostTextWidget, null);
        assert.strictEqual(document.querySelectorAll(".ace_ghost_text").length, 0);
        assert.strictEqual(getAllLines(), "foo");
        done();
    },
    "test: autocomplete can be accepted via tooltip": function(done) {
        autocomplete.show(editor);
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.isOpen(), true);
        assert.equal(autocomplete.inlineTooltip.isShown(), true);
        assert.ok(document.querySelectorAll(".ace_ghost_text").length > 0);
        assert.strictEqual(getAllLines(), "foo");

        var buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
        var acceptButton = buttonElements[3];

        simulateClick(acceptButton);

        editor.renderer.$loop._flush();
        assert.equal(autocomplete.inlineCompleter, null);
        assert.equal(autocomplete.inlineTooltip.isShown(), false);
        assert.strictEqual(autocomplete.isOpen(), false);
        assert.equal(editor.renderer.$ghostText, null);
        assert.equal(editor.renderer.$ghostTextWidget, null);
        assert.strictEqual(document.querySelectorAll(".ace_ghost_text").length, 0);
        assert.strictEqual(getAllLines(), "foo");
        done();
    },
    "test: incremental typing filters results": function(done) {
        autocomplete.show(editor);
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.isOpen(), true);
        assert.equal(getAllLines(), "foo");

        typeAndChange("u", "n");
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.isOpen(), true);
        assert.equal(getAllLines(), `function foo() {\n<div><span class="ace_ghost_text">    console.log('test');</span></div><div><span class="ace_ghost_text">}</span><span></span></div>`);

        typeAndChange("d");
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.isOpen(), true);
        assert.equal(getAllLines(), "fundraiser");

        typeAndChange("Backspace", "Backspace", "Backspace");
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.isOpen(), true);
        assert.equal(getAllLines(), "foo");

        typeAndChange("r");
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.isOpen(), false);
        assert.equal(getAllLines(), "fr");

        done();
    },
    "test: tooltip stays open on incremental typing": function(done) {
        autocomplete.show(editor);
        assert.strictEqual(inlineTooltip.isShown(), true);
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.isOpen(), true);
        assert.equal(getAllLines(), "foo");
        typeAndChange("u", "n");
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.isOpen(), true);
        assert.strictEqual(inlineTooltip.isShown(), true);
        done();
    },
    "test: can toggle tooltip display mode via tooltip button": function(done) {
        autocomplete.show(editor);
        assert.strictEqual(inlineTooltip.isShown(), true);

        var buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
        var moreOptionsButton = buttonElements[4];
        var showTooltipToggle = buttonElements[5];
        var showTooltipToggleCheckMark = showTooltipToggle.firstChild;

        assert.strictEqual(showTooltipToggle.ariaChecked.toString(), "true");
        assert.strictEqual(showTooltipToggleCheckMark.classList.contains("ace_checkmark"), true);
        assert.strictEqual(inlineTooltip.getAlwaysShow(), true);
        assert.strictEqual(inlineTooltip.isMoreOptionsShown(), false);

        simulateClick(moreOptionsButton);

        assert.strictEqual(inlineTooltip.isShown(), true);
        assert.strictEqual(showTooltipToggle.ariaChecked.toString(), "true");
        assert.strictEqual(showTooltipToggleCheckMark.classList.contains("ace_checkmark"), true);
        assert.strictEqual(inlineTooltip.getAlwaysShow(), true);
        assert.strictEqual(inlineTooltip.isMoreOptionsShown(), true);

        simulateClick(showTooltipToggle);

        assert.strictEqual(showTooltipToggle.ariaChecked.toString(), "false");
        assert.strictEqual(showTooltipToggleCheckMark.classList.contains("ace_checkmark"), false);
        assert.strictEqual(inlineTooltip.getAlwaysShow(), false);
        assert.strictEqual(inlineTooltip.isMoreOptionsShown(), false);
        done();
    },
    "test: verify detach": function(done) {
        autocomplete.show(editor);
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), 0);
        assert.strictEqual(getAllLines(), "foo");

        autocomplete.detach();
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), -1);
        assert.strictEqual(autocomplete.getLength(), 0);
        assert.strictEqual(autocomplete.isOpen(), false);
        assert.equal(autocomplete.base, null);
        assert.equal(autocomplete.completions, null);
        assert.equal(autocomplete.completionProvider, null);
        assert.strictEqual(getAllLines(), "f");
        done();
    },
    "test: verify destroy": function(done) {
        autocomplete.show(editor);
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), 0);
        assert.strictEqual(getAllLines(), "foo");
        assert.strictEqual(editor.completer, autocomplete);

        autocomplete.destroy();
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), -1);
        assert.strictEqual(autocomplete.getLength(), 0);
        assert.strictEqual(autocomplete.isOpen(), false);
        assert.equal(autocomplete.base, null);
        assert.equal(autocomplete.completions, null);
        assert.equal(autocomplete.completionProvider, null);
        assert.equal(autocomplete.editor, null);
        assert.equal(autocomplete.inlineTooltip, null);
        assert.equal(autocomplete.inlineRenderer, null);
        assert.strictEqual(editor.completer, null);
        assert.strictEqual(getAllLines(), "f");

        autocomplete.destroy();
        editor.renderer.$loop._flush();
        done();
    },

    tearDown: function() {
        autocomplete.destroy();
        editor.destroy();
        wrapperEl.parentElement.removeChild(wrapperEl);
    }
};

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
