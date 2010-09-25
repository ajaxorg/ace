/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
require.def("ace/commands/DefaultCommands",
    ["ace/PluginManager"], function(PluginManager) {

PluginManager.registerCommand("selectall", function(editor, selection) {
    selection.selectAll();
});
PluginManager.registerCommand("removeline", function(editor, selection) {
    editor.removeLines();
});
PluginManager.registerCommand("gotoline", function(editor, selection) {
    var line = parseInt(prompt("Enter line number:"));
    if (!isNaN(line)) {
        editor.gotoLine(line);
    }
});
PluginManager.registerCommand("togglecomment", function(editor, selection) {
    editor.toggleCommentLines();
});
PluginManager.registerCommand("findnext", function(editor, selection) {
    editor.findNext();
});
PluginManager.registerCommand("findprevious", function(editor, selection) {
    editor.findPrevious();
});
PluginManager.registerCommand("find", function(editor, selection) {
    var needle = prompt("Find:");
    editor.find(needle);
});
PluginManager.registerCommand("undo", function(editor, selection) {
    editor.undo();
});
PluginManager.registerCommand("redo", function(editor, selection) {
    editor.redo();
});
PluginManager.registerCommand("redo", function(editor, selection) {
    editor.redo();
});
PluginManager.registerCommand("overwrite", function(editor, selection) {
    editor.toggleOverwrite();
});
PluginManager.registerCommand("copylinesup", function(editor, selection) {
    editor.copyLinesUp();
});
PluginManager.registerCommand("movelinesup", function(editor, selection) {
    editor.moveLinesUp();
});
PluginManager.registerCommand("selecttostart", function(editor, selection) {
    selection.selectFileStart();
});
PluginManager.registerCommand("gotostart", function(editor, selection) {
    editor.navigateFileStart();
});
PluginManager.registerCommand("selectup", function(editor, selection) {
    selection.selectUp();
});
PluginManager.registerCommand("golineup", function(editor, selection) {
    editor.navigateUp();
});
PluginManager.registerCommand("copylinesdown", function(editor, selection) {
    editor.copyLinesDown();
});
PluginManager.registerCommand("movelinsedown", function(editor, selection) {
    editor.moveLinesDown();
});
PluginManager.registerCommand("selecttoend", function(editor, selection) {
    selection.selectFileEnd();
});
PluginManager.registerCommand("gotoend", function(editor, selection) {
    editor.navigateFileEnd();
});
PluginManager.registerCommand("selectdown", function(editor, selection) {
    selection.selectDown();
});
PluginManager.registerCommand("godown", function(editor, selection) {
    editor.navigateDown();
});
PluginManager.registerCommand("selectwordleft", function(editor, selection) {
    selection.selectWordLeft();
});
PluginManager.registerCommand("gotowordleft", function(editor, selection) {
    editor.navigateWordLeft();
});
PluginManager.registerCommand("selecttolinestart", function(editor, selection) {
    selection.selectLineStart();
});
PluginManager.registerCommand("gotolinestart", function(editor, selection) {
    editor.navigateLineStart();
});
PluginManager.registerCommand("selectleft", function(editor, selection) {
    selection.selectLeft();
});
PluginManager.registerCommand("gotoleft", function(editor, selection) {
    editor.navigateLeft();
});
PluginManager.registerCommand("selectwordright", function(editor, selection) {
    selection.selectWordRight();
});
PluginManager.registerCommand("gotowordright", function(editor, selection) {
    editor.navigateWordRight();
});
PluginManager.registerCommand("selecttolineend", function(editor, selection) {
    selection.selectLineEnd();
});
PluginManager.registerCommand("gotolineend", function(editor, selection) {
    editor.navigateLineEnd();
});
PluginManager.registerCommand("selectright", function(editor, selection) {
    selection.selectRight();
});
PluginManager.registerCommand("gotoright", function(editor, selection) {
    editor.navigateRight();
});
PluginManager.registerCommand("selectpagedown", function(editor, selection) {
    editor.selectPageDown();
});
PluginManager.registerCommand("pagedown", function(editor, selection) {
    editor.scrollPageDown();
});
PluginManager.registerCommand("selectpageup", function(editor, selection) {
    editor.selectPageUp();
});
PluginManager.registerCommand("pageup", function(editor, selection) {
    editor.scrollPageUp();
});
PluginManager.registerCommand("selectlinestart", function(editor, selection) {
    selection.selectLineStart();
});
PluginManager.registerCommand("gotolinestart", function(editor, selection) {
    editor.navigateLineStart();
});
PluginManager.registerCommand("selectlineend", function(editor, selection) {
    selection.selectLineEnd();
});
PluginManager.registerCommand("gotolineend", function(editor, selection) {
    editor.navigateLineEnd();
});
PluginManager.registerCommand("del", function(editor, selection) {
    editor.removeRight();
});
PluginManager.registerCommand("backspace", function(editor, selection) {
    editor.removeLeft();
});
PluginManager.registerCommand("outdent", function(editor, selection) {
    editor.blockOutdent();
});
PluginManager.registerCommand("indent", function(editor, selection) {
    if (selection.isMultiLine()) {
        editor.blockIndent();
    }
    else {
        editor.onTextInput("\t");
    }
});

});