if (typeof process !== "undefined") {
    require("amd-loader");
    require("../test/mockdom");
}

"use strict";

var assert = require("../test/assertions");
var AceInline = require("./inline").AceInline;
var Editor = require("../ace").Editor;
var EditSession = require("../ace").EditSession;
var VirtualRenderer = require("../ace").VirtualRenderer;

var editor;
var inline;

var textBase = "abc123\n\n    ";

var completions = [
    {
        value: "foo",
        score: 4
    },
    {
        value: "function",
        score: 3
    },
    {
        value: "foobar",
        score: 2
    },
    {
        snippet: "function foo() {\n    console.log('test');\n}",
        score: 1
    },
    {
        snippet: "foobar2",
        score: 0
    }
];

var getAllLines = function() {
    return editor.renderer.$textLayer.element.childNodes.map(function (node) {
        return node.textContent;
    }).join("\n");
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
        editor.execCommand("insertstring", textBase + "f");
        inline = new AceInline();
        editor.getSelection().moveCursorFileEnd();
        editor.renderer.$loop._flush();
        done();
    },
    "test: displays the ghost text in the editor on show": function(done) {
        inline.show(editor, completions[0], "f");
        editor.renderer.$loop._flush();
        assert.equal(getAllLines(), textBase + "foo");
        done();
    },
    "test: replaces the ghost text in the editor with the latest show": function(done) {
        inline.show(editor, completions[0], "f");
        editor.renderer.$loop._flush();
        assert.equal(getAllLines(), textBase + "foo");
        inline.show(editor, completions[1], "f");
        editor.renderer.$loop._flush();
        assert.equal(getAllLines(), textBase + "function");
        done();
    },
    "test: renders multi-line ghost text indentation": function(done) {
        assert.equal(editor.renderer.$ghostTextWidget, null);
        inline.show(editor, completions[3], "f");
        editor.renderer.$loop._flush();
        assert.strictEqual(getAllLines(), textBase + "function foo() {");
        assert.strictEqual(editor.renderer.$ghostTextWidget.text, "        console.log('test');\n    }");
        assert.strictEqual(editor.renderer.$ghostTextWidget.el.textContent, "        console.log('test');\n    }");
        done();
    },
    "test: boundary conditions": function(done) {
        inline.show(null, null, null);
        inline.show(editor, null, null);
        inline.show(editor, completions[1], null);
        inline.show(editor, null, "");
        inline.show(editor, completions[1], "");
        inline.show(null, completions[3], "");
        done();
    },
    "test: only renders the ghost text without the prefix": function(done) {
        inline.show(editor, completions[1], "fun");
        editor.renderer.$loop._flush();
        assert.equal(getAllLines(), textBase + "fction");
        done();
    },
    "test: verify explicit and implicit hide": function(done) {
        inline.show(editor, completions[1], "f");
        editor.renderer.$loop._flush();
        assert.equal(getAllLines(), textBase + "function");
        assert.strictEqual(inline.isOpen(), true);
        inline.hide();
        editor.renderer.$loop._flush();
        assert.strictEqual(getAllLines(), textBase + "f");
        assert.strictEqual(inline.isOpen(), false);

        inline.show(editor, completions[1], "f");
        editor.renderer.$loop._flush();
        assert.equal(getAllLines(), textBase + "function");
        assert.strictEqual(inline.isOpen(), true);
        inline.show(editor, null, "f");
        editor.renderer.$loop._flush();
        assert.strictEqual(getAllLines(), textBase + "f");
        assert.strictEqual(inline.isOpen(), false);
        done();
    },
    "test: verify destroy": function(done) {
        inline.show(editor, completions[0], "f");
        editor.renderer.$loop._flush();
        assert.strictEqual(getAllLines(), textBase + "foo");

        inline.destroy();
        editor.renderer.$loop._flush();
        assert.strictEqual(inline.isOpen(), false);
        assert.strictEqual(getAllLines(), textBase + "f");

        inline.destroy();
        editor.renderer.$loop._flush();
        assert.strictEqual(inline.isOpen(), false);
        assert.strictEqual(getAllLines(), textBase + "f");

        inline.hide();
        editor.renderer.$loop._flush();
        assert.strictEqual(inline.isOpen(), false);
        assert.strictEqual(getAllLines(), textBase + "f");
        done();
    },
    tearDown: function() {
        inline.destroy();
        editor.destroy();
    }
};

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
