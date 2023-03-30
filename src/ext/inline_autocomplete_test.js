
if (typeof process !== "undefined") {
    require("amd-loader");
    require("../test/mockdom");
}

"use strict";

var Editor = require("../editor").Editor;
var EditSession = require("../edit_session").EditSession;
var InlineAutocomplete = require("./inline_autocomplete").InlineAutocomplete;
var assert = require("../test/assertions");
var type = require("../test/user").type;
var VirtualRenderer = require("../virtual_renderer").VirtualRenderer;

var editor;
var autocomplete;

var getAllLines = function() {
    var text = Array.from(editor.renderer.$textLayer.element.childNodes).map(function (node) {
        return node.textContent;
    }).join("\n");
    if (editor.renderer.$ghostTextWidget) {
        return text + "\n" + editor.renderer.$ghostTextWidget.text;
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

module.exports = {
    setUp: function(done) {
        var el = document.createElement("div");
        el.style.left = "20px";
        el.style.top = "30px";
        el.style.width = "500px";
        el.style.height = "500px";
        document.body.appendChild(el);
        var renderer = new VirtualRenderer(el);
        var session = new EditSession("");
        editor = new Editor(renderer, session);
        editor.execCommand("insertstring", "f");
        editor.getSelection().moveCursorFileEnd();
        editor.renderer.$loop._flush();
        editor.completers = [mockCompleter];
        autocomplete = InlineAutocomplete.for(editor);
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
    "test: autocomplete tooltip is shown according to the selected option": function(done) {
        assert.equal(autocomplete.inlineTooltip, null);

        autocomplete.show(editor);
        assert.strictEqual(autocomplete.inlineTooltip.isShown(), true);

        autocomplete.detach();
        assert.strictEqual(autocomplete.inlineTooltip.isShown(), false);
        done();
    },
    "test: autocomplete navigation works": function(done) {
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
        assert.strictEqual(autocomplete.getIndex(), 5);
        assert.strictEqual(autocomplete.getData().value, "fundraiser");
        assert.strictEqual(getAllLines(), "fundraiser");

        autocomplete.goTo("first");
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), 0);
        assert.strictEqual(autocomplete.getData().value, "foo");
        assert.strictEqual(getAllLines(), "foo");

        autocomplete.goTo("prev");
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.getIndex(), 0);
        assert.strictEqual(autocomplete.getData().value, "foo");
        assert.strictEqual(getAllLines(), "foo");
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
    "test: incremental typing filters results": function(done) {
        autocomplete.show(editor);
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.isOpen(), true);
        assert.equal(getAllLines(), "foo");

        typeAndChange("u", "n");
        editor.renderer.$loop._flush();
        assert.strictEqual(autocomplete.isOpen(), true);
        assert.equal(getAllLines(), "function foo() {\n    console.log('test');\n}");

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
    }
};

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
