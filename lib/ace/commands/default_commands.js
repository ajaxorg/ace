/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org Services B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {

var PluginManager = require("ace/plugin_manager");

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
PluginManager.registerCommand("movelinesdown", function(editor, selection) {
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
PluginManager.registerCommand("gotopagedown", function(editor, selection) {
    editor.gotoPageDown();
});
PluginManager.registerCommand("selectpageup", function(editor, selection) {
    editor.selectPageUp();
});
PluginManager.registerCommand("pageup", function(editor, selection) {
    editor.scrollPageUp();
});
PluginManager.registerCommand("gotopageup", function(editor, selection) {
    editor.gotoPageUp();
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
    editor.indent();
});

});