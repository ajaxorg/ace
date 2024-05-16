
/**
 * commands to enter multiselect mode
 * @type {import("../../ace-internal").Ace.Command[]}
 */
exports.defaultCommands = [{
    name: "addCursorAbove",
    description: "Add cursor above",
    exec: function(editor) { editor.selectMoreLines(-1); },
    bindKey: {win: "Ctrl-Alt-Up", mac: "Ctrl-Alt-Up"},
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "addCursorBelow",
    description: "Add cursor below",
    exec: function(editor) { editor.selectMoreLines(1); },
    bindKey: {win: "Ctrl-Alt-Down", mac: "Ctrl-Alt-Down"},
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "addCursorAboveSkipCurrent",
    description: "Add cursor above (skip current)",
    exec: function(editor) { editor.selectMoreLines(-1, true); },
    bindKey: {win: "Ctrl-Alt-Shift-Up", mac: "Ctrl-Alt-Shift-Up"},
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "addCursorBelowSkipCurrent",
    description: "Add cursor below (skip current)",
    exec: function(editor) { editor.selectMoreLines(1, true); },
    bindKey: {win: "Ctrl-Alt-Shift-Down", mac: "Ctrl-Alt-Shift-Down"},
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selectMoreBefore",
    description: "Select more before",
    exec: function(editor) { editor.selectMore(-1); },
    bindKey: {win: "Ctrl-Alt-Left", mac: "Ctrl-Alt-Left"},
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selectMoreAfter",
    description: "Select more after",
    exec: function(editor) { editor.selectMore(1); },
    bindKey: {win: "Ctrl-Alt-Right", mac: "Ctrl-Alt-Right"},
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selectNextBefore",
    description: "Select next before",
    exec: function(editor) { editor.selectMore(-1, true); },
    bindKey: {win: "Ctrl-Alt-Shift-Left", mac: "Ctrl-Alt-Shift-Left"},
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selectNextAfter",
    description: "Select next after",
    exec: function(editor) { editor.selectMore(1, true); },
    bindKey: {win: "Ctrl-Alt-Shift-Right", mac: "Ctrl-Alt-Shift-Right"},
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "toggleSplitSelectionIntoLines",
    description: "Split selection into lines",
    exec: function(editor) {
        if (editor.multiSelect.rangeCount > 1)
            editor.multiSelect.joinSelections();
        else
            editor.multiSelect.splitIntoLines();
    },
    bindKey: {win: "Ctrl-Alt-L", mac: "Ctrl-Alt-L"},
    readOnly: true
}, {
    name: "splitSelectionIntoLines",
    description: "Split into lines",
    exec: function(editor) { editor.multiSelect.splitIntoLines(); },
    readOnly: true
}, {
    name: "alignCursors",
    description: "Align cursors",
    exec: function(editor) { editor.alignCursors(); },
    bindKey: {win: "Ctrl-Alt-A", mac: "Ctrl-Alt-A"},
    scrollIntoView: "cursor"
}, {
    name: "findAll",
    description: "Find all",
    exec: function(editor) { editor.findAll(); },
    bindKey: {win: "Ctrl-Alt-K", mac: "Ctrl-Alt-G"},
    scrollIntoView: "cursor",
    readOnly: true
}];

/**
 * commands active only in multiselect mode
 * @type {import("../../ace-internal").Ace.Command[]}
 */
exports.multiSelectCommands = [{
    name: "singleSelection",
    description: "Single selection",
    bindKey: "esc",
    exec: function(editor) { editor.exitMultiSelectMode(); },
    scrollIntoView: "cursor",
    readOnly: true,
    isAvailable: function(editor) {return editor && editor.inMultiSelectMode;}
}];

var HashHandler = require("../keyboard/hash_handler").HashHandler;
exports.keyboardHandler = new HashHandler(exports.multiSelectCommands);
