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
var editor2;
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
    },
    {
        value: "f should not show inline",
        score: 0,
        hideInlinePreview: true
    },
    {
        value: "long\nlong\nlong\nlong\nlong\nlong",
        score: 0
    },
    {
        value: "long\nlong\nlong\nlong\nlong\nlong".repeat(100),
        score: 0
    }
];

var getAllLines = function(editorOverride) {
    editorOverride = editorOverride || editor;
    return editorOverride.renderer.$textLayer.element.childNodes.map(function (node) {
        return node.textContent;
    }).join("\n");
};

var createEditor = function(element) {
    var renderer = new VirtualRenderer(element);
    var session = new EditSession("");
    return new Editor(renderer, session);
};

module.exports = {
    setUp: function(done) {
        var el = document.createElement("div");
        el.style.left = "20px";
        el.style.top = "30px";
        el.style.width = "500px";
        el.style.height = "500px";
        document.body.appendChild(el);
        editor = createEditor(el);
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
    "test: boundary tests": function(done) {
        var noRenderTestCases = [
            [null, null, null],
            [editor, null, null],
            [editor, null, ""],
            [null, completions[3], ""]
        ];
        var result;
        noRenderTestCases.forEach(function(params) {
            result = inline.show(params[0], params[1], params[2]);
            editor.renderer.$loop._flush();
            assert.notOk(result);
            assert.equal(editor.renderer.$ghostText, null);
            assert.equal(editor.renderer.$ghostTextWidget, null);
        });

        var renderTestCases = [
            [editor, completions[1], undefined],
            [editor, completions[1], null],
            [editor, completions[1], ""]
        ];
        renderTestCases.forEach(function(params) {
            result = inline.show(params[0], params[1], params[2]);
            editor.renderer.$loop._flush();
            assert.ok(result);
            assert.strictEqual(editor.renderer.$ghostText.text, "function");
            assert.strictEqual(getAllLines(), textBase + "ffunction");
            assert.equal(editor.renderer.$ghostTextWidget, null);
        });

        result = inline.show(editor, completions[0], "foo");
        editor.renderer.$loop._flush();
        assert.ok(result);
        assert.equal(editor.renderer.$ghostText, null);
        assert.equal(editor.renderer.$ghostTextWidget, null);
        
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

        inline.show(editor, completions[1], "function");
        editor.renderer.$loop._flush();
        assert.strictEqual(getAllLines(), textBase + "f");
        assert.strictEqual(inline.isOpen(), false);
        done();
    },
    "test: does not hide previous ghost text if cannot show current one": function(done) {
        inline.show(editor, completions[1], "f");
        editor.renderer.$loop._flush();
        assert.equal(getAllLines(), textBase + "function");
        assert.strictEqual(inline.isOpen(), true);
        inline.show(editor, null, "");
        editor.renderer.$loop._flush();
        assert.equal(getAllLines(), textBase + "function");
        assert.strictEqual(inline.isOpen(), true);
        inline.hide();
        editor.renderer.$loop._flush();
        assert.strictEqual(getAllLines(), textBase + "f");
        assert.strictEqual(inline.isOpen(), false);
        done();
    },
    "test: removes ghost text from previous editor if new valid editor is passed to show function": function(done) {
        var el = document.createElement("div");
        el.style.left = "520px";
        el.style.top = "530px";
        el.style.width = "500px";
        el.style.height = "500px";
        document.body.appendChild(el);
        editor2 = createEditor(el);
        var editor2Text = "different text\n\n    f";
        editor2.execCommand("insertstring", editor2Text);

        inline.show(editor, completions[1], "f");
        editor.renderer.$loop._flush();
        editor2.renderer.$loop._flush();
        assert.strictEqual(getAllLines(), textBase + "function");
        assert.strictEqual(getAllLines(editor2), editor2Text);
        assert.strictEqual(inline.isOpen(), true);

        inline.show(editor2, completions[2], "f");
        editor.renderer.$loop._flush();
        editor2.renderer.$loop._flush();
        assert.strictEqual(getAllLines(), textBase + "f");
        assert.strictEqual(getAllLines(editor2), editor2Text + "oobar");
        assert.strictEqual(inline.isOpen(), true);

        inline.show(null, completions[2], "f");
        editor.renderer.$loop._flush();
        editor2.renderer.$loop._flush();
        assert.strictEqual(getAllLines(), textBase + "f");
        assert.strictEqual(getAllLines(editor2), editor2Text + "oobar");
        assert.strictEqual(inline.isOpen(), true);

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
    "test: should respect hideInlinePreview": function(done) {
        // By default, this option is set to hide.
        inline.show(editor, completions[5], "f");
        editor.renderer.$loop._flush();
        assert.equal(getAllLines(), textBase + "f");
        assert.strictEqual(inline.isOpen(), false);
        inline.hide();
        editor.renderer.$loop._flush();

        // Now it should be shown.
        completions[5].hideInlinePreview = false;

        inline.show(editor, completions[5], "f");
        editor.renderer.$loop._flush();
        assert.equal(getAllLines(), textBase + "f should not show inline");
        assert.strictEqual(inline.isOpen(), true);
        inline.hide();
        editor.renderer.$loop._flush();

        // Now it should be shown.
        completions[5].hideInlinePreview = undefined;

        inline.show(editor, completions[5], "f");
        editor.renderer.$loop._flush();
        assert.equal(getAllLines(), textBase + "f should not show inline");
        assert.strictEqual(inline.isOpen(), true);
        inline.hide();
        editor.renderer.$loop._flush();

        // Reset to state before test.
        completions[5].hideInlinePreview = true;

        done();
    },
    "test: should scroll if inline preview outside": function(done) {
        // Fill the editor with new lines to get the cursor to the bottom
        // of the container
        editor.execCommand("insertstring", "\n".repeat(200));

        var deltaY;
        var initialScrollBy = editor.renderer.scrollBy;
        editor.renderer.scrollBy = function(varX, varY) {
            deltaY = varY;
        };

        inline.show(editor, completions[6], "l");
        editor.renderer.$loop._flush();
        
        setTimeout(() => {
            // Should scroll 5 lines to get the inline preview into view
            assert.strictEqual(deltaY, 50);

            inline.hide();
            editor.renderer.$loop._flush();

            inline.show(editor, completions[7], "l");
            editor.renderer.$loop._flush();

            setTimeout(() => {
                // Should scroll as much as possbile while keeping the cursor on screen
                assert.strictEqual(deltaY, 490);
                editor.renderer.scrollBy = initialScrollBy;
                done();
            }, 50); 
        }, 50);  
    },
    tearDown: function() {
        inline.destroy();
        editor.destroy();
        if (editor2) {
            editor2.destroy();
        }
    }
};

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
