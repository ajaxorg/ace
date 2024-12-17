/*global CustomEvent*/
 
"use strict";

var assert = require("./../test/assertions");
var Range = require("../range").Range;
require("./../test/mockdom");
var ace = require("../ace");
var vim = require("./vim");
var editor, changes, textarea;
var user = require("../test/user");

function testSelection(editor, data) {
    assert.equal(getSelection(editor) + "", data + "");
}

function setSelection(editor, data) {
    if (typeof data[0] == "number")
        data = [data];
    editor.selection.fromJSON(data.map(function(x) {
        var start = {row: x[0], column: x[1]};
        var end = x.length == 2 ? start : {row: x[2], column: x[3]};
        var isBackwards = Range.comparePoints(start, end) > 0;
        return isBackwards ? {
            start: end,
            end: start,
            isBackwards: true
        } : {
            start: start,
            end: end,
            isBackwards: true
        };
    }));
}

function getSelection(editor) {
    var data = editor.multiSelect.toJSON();
    if (!data.length) data = [data];
    data = data.map(function(x) {
        var a, c;
        if (x.isBackwards) {
            a = x.end;
            c = x.start;
        } else {
            c = x.end;
            a = x.start;
        }
        return Range.comparePoints(a, c) 
            ? [a.row, a.column, c.row, c.column]
            : [a.row, a.column];
    });
    return data.length > 1 ? data : data[0];
}

function testValue(editor, value) {
    assert.equal(editor.getValue(), value);
}

function applyEvent(data) {
    if (typeof data == "function")
        return data();
    
    var type = data._;
    var event = new CustomEvent(type);
    for (var i in data.key || {})
        event[i] = data.key[i];
    data.modifier && data.modifier.split("-").map(function(m) {
        if (m) event[m + "Key"] = true;
    });
    if (/input|select|composition/.test(type)) {
        textarea.value = data.value;
        textarea.setSelectionRange(data.range[0], data.range[1]);
    }
    textarea.dispatchEvent(event); 
    if (data.value != null)
        assert.equal(textarea.value, data.value);
    
    if (data.range != null) {
        assert.equal(textarea.selectionStart, data.range[0]);
        assert.equal(textarea.selectionEnd, data.range[1]);
    }
    editor.resize(true);
}

function scrollTop() {
    editor.endOperation();
    editor.renderer.$loop._flush();
    return editor.renderer.scrollTop / editor.renderer.lineHeight;
}

module.exports = {
    setUp: function() {
        if (!editor) {
            editor = ace.edit(null);
            document.body.appendChild(editor.container);
            editor.container.style.height = "200px";
            editor.container.style.width = "300px";
            editor.container.style.position = "absolute";
            editor.container.style.outline = "solid";
            editor.resize(true);
            editor.on("change", function(e) {
                changes.push(e);
            });
            editor.setKeyboardHandler(vim.handler);
        }
        textarea = editor.textInput.getElement();
        changes = [];
        editor.focus();
    },
    tearDown: function() {
        if (editor) {
            editor.destroy();
            editor.container.remove();
            editor = textarea = null;
        }
    },
    "test: multiselect and composition": function() {
        editor.setValue("hello world\n\thello world");
        editor.execCommand("gotoend");
        [
            { _: "keydown", range: [12,12], value: "\thello world\n\n", key: { code: "ControlLeft", key: "Control", keyCode: 17}, modifier: "ctrl-"},
            { _: "keydown", range: [12,12], value: "\thello world\n\n", key: { code: "AltLeft", key: "Alt", keyCode: 18}, modifier: "ctrl-alt-"},
            { _: "keydown", range: [6,11], value: "hello world\n\n", key: { code: "KeyL", key: "ﬁ", keyCode: 76}, modifier: "ctrl-alt-"},

            { _: "keydown", range: [6,11], value: "hello world\n\n", key: { code: "KeyC", key: "c", keyCode: 67}},
            { _: "input", range: [7,7], value: "hello c\n\n"},
            { _: "keydown", range: [7,7], value: "hello c\n\n", key: { code: "KeyX", key: "x", keyCode: 88}},
            { _: "input", range: [8,8], value: "hello cx\n\n"},
            { _: "keydown", range: [6,6], value: "hello x\n\n", key: { code: "Escape", key: "Escape", keyCode: 27}},
            { _: "keydown", range: [6,6], value: "hello x\n\n", key: { code: "ShiftLeft", key: "Shift", keyCode: 16}, modifier: "shift-"},
            { _: "keydown", range: [6,6], value: "hello x\n\n", key: { code: "BracketRight", key: "Dead", keyCode: 229}, modifier: "shift-"},
            { _: "compositionstart", range: [6,6], value: "hello x\n\n"},
            { _: "compositionupdate", range: [6,6], value: "hello x\n\n"},
            { _: "compositionend", range: [7,7], value: "hello ^x\n\n"},
            { _: "input", range: [7,7], value: "hello ^x\n\n"},
            function() {
                testSelection(editor, [[0,0],[1,1]]);
            },
            { _: "keydown", range: [7,7], value: "hello ^x\n\n", key: { code: "Escape", key: "Escape", keyCode: 27}},
            { _: "keydown",  key: { code: "KeyH", key: "˛", keyCode: 72}, modifier: "ctrl-alt-"},

            { _: "keydown", range: [1,6], value: "\thello x\n\n", key: { code: "AltRight", key: "Alt", keyCode: 18}, modifier: "alt-"},
            { _: "keydown", range: [1,6], value: "\thello x\n\n", key: { code: "Digit4", key: "$", keyCode: 52}, modifier: "alt-"},

            { _: "input", range: [2,2], value: "\t$ x\n\n"},
            function() {
                testSelection(editor, [[1,5,1,8], [0,4,0,7]]);
            },
            { _: "keydown", key: { code: "Escape", key: "Escape", keyCode: 27}},
            function() {
                testSelection(editor, [[1,7],[0,6]]);
            },
            { _: "keydown", key: { code: "Escape", key: "Escape", keyCode: 27}},

        ].forEach(function(data) {
            applyEvent(data);
        });
        assert.equal(editor.getValue(), "hello x\n\thello x");
    },
    "test: vim virtual selection": function() {
        editor.setValue("hello world\n\thello world");
        editor.execCommand("gotoend");
        [
            { _: "keydown", range: [12,12], value: "\thello world\n\n", key: { code: "ControlLeft", key: "Control", keyCode: 17}, modifier: "ctrl-"},
            { _: "keydown", range: [12,12], value: "\thello world\n\n", key: { code: "AltLeft", key: "Alt", keyCode: 18}, modifier: "ctrl-alt-"},
            { _: "keydown", range: [6,11], value: "hello world\n\n", key: { code: "KeyL", key: "ﬁ", keyCode: 76}, modifier: "ctrl-alt-"},

            { _: "keydown", range: [6,11], value: "hello world\n\n", key: { code: "KeyC", key: "c", keyCode: 67}},
            { _: "input", range: [7,7], value: "hello c\n\n"},
            { _: "keydown", range: [7,7], value: "hello c\n\n", key: { code: "KeyX", key: "x", keyCode: 88}},
            { _: "input", range: [8,8], value: "hello cx\n\n"},
            { _: "keydown", range: [6,6], value: "hello x\n\n", key: { code: "Escape", key: "Escape", keyCode: 27}},
            { _: "keydown", range: [6,6], value: "hello x\n\n", key: { code: "ShiftLeft", key: "Shift", keyCode: 16}, modifier: "shift-"},
            { _: "keydown", range: [6,6], value: "hello x\n\n", key: { code: "BracketRight", key: "Dead", keyCode: 229}, modifier: "shift-"},
            { _: "compositionstart", range: [6,6], value: "hello x\n\n"},
            { _: "compositionupdate", range: [6,6], value: "hello x\n\n"},
            { _: "compositionend", range: [7,7], value: "hello ^x\n\n"},
            { _: "input", range: [7,7], value: "hello ^x\n\n"},
            function() {
                testSelection(editor, [[0,0],[1,1]]);
            },
            { _: "keydown", range: [7,7], value: "hello ^x\n\n", key: { code: "Escape", key: "Escape", keyCode: 27}},
            { _: "keydown",  key: { code: "KeyH", key: "˛", keyCode: 72}, modifier: "ctrl-alt-"},

            { _: "keydown", range: [1,6], value: "\thello x\n\n", key: { code: "AltRight", key: "Alt", keyCode: 18}, modifier: "alt-"},
            { _: "keydown", range: [1,6], value: "\thello x\n\n", key: { code: "Digit4", key: "$", keyCode: 52}, modifier: "alt-"},

            { _: "input", range: [2,2], value: "\t$ x\n\n"},
            function() {
                testSelection(editor, [[1,5,1,8], [0,4,0,7]]);
            },
            { _: "keydown", key: { code: "Escape", key: "Escape", keyCode: 27}},
            function() {
                testSelection(editor, [[1,7],[0,6]]);
            },
            { _: "keydown", key: { code: "Escape", key: "Escape", keyCode: 27}},

        ].forEach(function(data) {
            applyEvent(data);
        });
        assert.equal(editor.getValue(), "hello x\n\thello x");
    },
    "test: vim visual selection": function() {
        editor.setValue("xxx\nccc\n\nzzz\nccc");
        setSelection(editor, [2,0]);
        [
            { _: "input", range: [1,1], value: "V\n\n"},
            { _: "keyup", range: [1,1], value: "V\n\n", key: { code: "KeyV", key: "V", keyCode: 86}, modifier: "shift-"},
            { _: "keyup", range: [1,1], value: "V\n\n", key: { code: "ShiftLeft", key: "Shift", keyCode: 16}},
            { _: "keydown", range: [1,1], value: "V\n\n", key: { code: "KeyK", key: "k", keyCode: 75}},
            { _: "keypress", range: [1,1], value: "V\n\n", key: { code: "KeyK", key: "k", keyCode: 107}},
            { _: "input", range: [2,2], value: "Vk\n\n"},
            { _: "keyup", range: [2,2], value: "Vk\n\n", key: { code: "KeyK", key: "k", keyCode: 75}},
            { _: "keydown", range: [2,2], value: "Vk\n\n", key: { code: "KeyC", key: "c", keyCode: 67}},
            { _: "keypress", range: [2,2], value: "Vk\n\n", key: { code: "KeyC", key: "c", keyCode: 99}},
            { _: "input", range: [3,3], value: "Vkc\n\n"},
            { _: "keyup", range: [3,3], value: "Vkc\n\n", key: { code: "KeyC", key: "c", keyCode: 67}},
            { _: "keydown", range: [3,3], value: "Vkc\n\n", key: { code: "KeyO", key: "o", keyCode: 79}},
            { _: "keypress", range: [3,3], value: "Vkc\n\n", key: { code: "KeyO", key: "o", keyCode: 111}},
            { _: "input", range: [4,4], value: "Vkco\n\n"},
            { _: "keyup", range: [4,4], value: "Vkco\n\n", key: { code: "KeyO", key: "o", keyCode: 79}},
            function() {
                testValue(editor, "xxx\nozzz\nccc")
                testSelection(editor, [1,1])
            },
            { _: "keydown", range: [0,0], value: "ozzz\n\n", key: { code: "Escape", key: "Escape", keyCode: 27}},
            { _: "keyup", range: [0,0], value: "ozzz\n\n", key: { code: "Escape", key: "Escape", keyCode: 27}},
            { _: "keydown", range: [0,0], value: "ozzz\n\n", key: { code: "ControlLeft", key: "Control", keyCode: 17}, modifier: "ctrl-"},

            { _: "keydown", range: [0,1], value: "ozzz\n\n", key: { code: "KeyV", key: "v", keyCode: 86}, modifier: "ctrl-"},
            { _: "select", range: [0,1], value: "ozzz\n\n"},
            { _: "keyup", range: [0,1], value: "ozzz\n\n", key: { code: "KeyV", key: "v", keyCode: 86}, modifier: "ctrl-"},
            { _: "keyup", range: [0,1], value: "ozzz\n\n", key: { code: "ControlLeft", key: "Control", keyCode: 17}},

            { _: "keydown", range: [0,1], value: "ccc\n\n", key: { code: "ArrowDown", key: "ArrowDown", keyCode: 40}},
            { _: "select", range: [0,1], value: "ccc\n\n"},
            { _: "keyup", range: [0,1], value: "ccc\n\n", key: { code: "ArrowDown", key: "ArrowDown", keyCode: 40}},
            function() {
                testValue(editor, "xxx\nozzz\nccc")
                testSelection(editor, [[2,1,2,0],[1,1,1,0]])
            },
            { _: "keydown", range: [0,1], value: "ccc\n\n", key: { code: "Period", key: ".", keyCode: 190}},
            { _: "keypress", range: [0,1], value: "ccc\n\n", key: { code: "Period", key: ".", keyCode: 46}},

            { _: "input", range: [1,1], value: ".cc\n\n"},
            { _: "keyup", range: [1,1], value: ".cc\n\n", key: { code: "Period", key: ".", keyCode: 190}},
            function() {
                testValue(editor, "xxx\no");
                testSelection(editor, [1,0]);
            }
        ].forEach(function(data) {
            applyEvent(data);
        });
    },
    "test vim gq": function() {
        editor.setValue(
            "1\n2\nhello world\n"
             + "xxx ".repeat(20) + "\nyyy"
             + "\n\nnext\nparagraph"
        );
        editor.selection.moveTo(2,5)
        editor.focus()
        user.type("gqgq")
        assert.deepEqual(editor.getCursorPosition(), {row: 2, column: 0})
        assert.equal(editor.session.getLine(2), "hello world")

        user.type("gqj")
        assert.deepEqual(editor.getCursorPosition(), {row: 3, column: 0})
        assert.equal(editor.session.getLine(3), "xxx xxx xxx ")

        user.type("gq}")
        assert.deepEqual(editor.getCursorPosition(), {row: 4, column: 0})
        assert.equal(editor.session.getLine(3), "xxx xxx xxx yyy")

        user.type("gqG")
        user.type("gqgg")
        user.type(":set tw=15\n")

        user.type("gg")
        user.type("V")
        user.type("gq")
        assert.equal(editor.session.getLine(0), "1 2 hello world")

        assert.equal(editor.session.getLine(5), "xxx xxx xxx xxx yyy")
        user.type(":6\n")
        user.type("gqq")

        assert.equal(editor.session.getLine(6), "yyy")
    },
    "test vim search": function() {
        editor.renderer.setOption("animatedScroll", false);
        editor.setValue(
            "very\nlong\n\ntext\n".repeat(10)
            + "needle "
            + "some\nmore\ntext\n".repeat(6),
            -1
        );

        editor.focus();
        var screenSize = editor.renderer.layerConfig.height / editor.renderer.lineHeight;

        user.type("Escape", "gg");
        assert.equal(scrollTop(), 0);
        user.type("/", "needle");
        assert.ok(scrollTop() > 40 - screenSize);
        editor.endOperation();
        user.type("Escape");
        assert.equal(scrollTop(), 0);

        user.type("/", "needle", "Enter");
        assert.ok(scrollTop() > 40 - screenSize);
        assert.ok(scrollTop() < 40);
        user.type("6", "/", "more", "Enter");
        editor.endOperation();
        assert.ok(scrollTop() > 40 + 16 - screenSize);
    },
    "test: vim normal mode brackets highlighting": function () {
        editor.setValue("{((hello, world))}");
        editor.focus();

        var handler = editor.getKeyboardHandler();
        var vimDirectionFunc = handler && handler.$getDirectionForHighlight;
        assert.ok(vimDirectionFunc);
        var values = [
            {isBackwards: true, anchorRow: 0, anchorColumn: 0, cursorRow: 0, cursorColumn: 0,
                startRow: 0, startColumn: 17, endRow: 0, endColumn: 18},
            {isBackwards: true, anchorRow: 0, anchorColumn: 2, cursorRow: 0, cursorColumn: 2,
                startRow: 0, startColumn: 15, endRow: 0, endColumn: 16},
            {isBackwards: false, anchorRow: 0, anchorColumn: 15, cursorRow: 0, cursorColumn: 17,
                startRow: 0, startColumn: 1, endRow: 0, endColumn: 2},
            {isBackwards: true, anchorRow: 0, anchorColumn: 17, cursorRow: 0, cursorColumn: 16,
                startRow: 0, startColumn: 1, endRow: 0, endColumn: 2}
        ];
        values.forEach((el) => {
            editor.session.selection.$setSelection(el.anchorRow, el.anchorColumn, el.cursorRow, el.cursorColumn);
            var isBackwards = vimDirectionFunc(editor);
            assert.ok(isBackwards === el.isBackwards);
            var ranges = editor.session.getMatchingBracketRanges({
                row: el.cursorRow,
                column: el.cursorColumn
            }, isBackwards);
            assert.range(ranges[1], el.startRow, el.startColumn, el.endRow, el.endColumn);
        });
    },
    "test: gotoline": function () {
        editor.renderer.setOption("animatedScroll", false);
        editor.setValue(
            "very\nlong\n\ntext\n".repeat(20),
            -1
        );

        editor.focus();
        var screenSize = editor.renderer.layerConfig.height / editor.renderer.lineHeight;

        assert.equal(scrollTop(), 0);
        user.type(":30", "Enter");
        editor.endOperation();

        assert.ok(scrollTop() > 30 - screenSize);
        assert.ok(scrollTop() < 30);
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
