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

var PluginManager = require("ace/plugin_manager").PluginManager;

PluginManager.registerCommand("selectall", function(env, args, request) {
    env.selection.selectAll();
});
PluginManager.registerCommand("removeline", function(env, args, request) {
    env.editor.removeLines();
});
PluginManager.registerCommand("gotoline", function(env, args, request) {
    var line = parseInt(prompt("Enter line number:"));
    if (!isNaN(line)) {
        env.editor.gotoLine(line);
    }
});
PluginManager.registerCommand("togglecomment", function(env, args, request) {
    env.editor.toggleCommentLines();
});
PluginManager.registerCommand("findnext", function(env, args, request) {
    env.editor.findNext();
});
PluginManager.registerCommand("findprevious", function(env, args, request) {
    env.editor.findPrevious();
});
PluginManager.registerCommand("find", function(env, args, request) {
    var needle = prompt("Find:");
    env.editor.find(needle);
});
PluginManager.registerCommand("undo", function(env, args, request) {
    env.editor.undo();
});
PluginManager.registerCommand("redo", function(env, args, request) {
    env.editor.redo();
});
PluginManager.registerCommand("redo", function(env, args, request) {
    env.editor.redo();
});
PluginManager.registerCommand("overwrite", function(env, args, request) {
    env.editor.toggleOverwrite();
});
PluginManager.registerCommand("copylinesup", function(env, args, request) {
    env.editor.copyLinesUp();
});
PluginManager.registerCommand("movelinesup", function(env, args, request) {
    env.editor.moveLinesUp();
});
PluginManager.registerCommand("selecttostart", function(env, args, request) {
    env.selection.selectFileStart();
});
PluginManager.registerCommand("gotostart", function(env, args, request) {
    env.editor.navigateFileStart();
});
PluginManager.registerCommand("selectup", function(env, args, request) {
    env.selection.selectUp();
});
PluginManager.registerCommand("golineup", function(env, args, request) {
    env.editor.navigateUp();
});
PluginManager.registerCommand("copylinesdown", function(env, args, request) {
    env.editor.copyLinesDown();
});
PluginManager.registerCommand("movelinesdown", function(env, args, request) {
    env.editor.moveLinesDown();
});
PluginManager.registerCommand("selecttoend", function(env, args, request) {
    env.selection.selectFileEnd();
});
PluginManager.registerCommand("gotoend", function(env, args, request) {
    env.editor.navigateFileEnd();
});
PluginManager.registerCommand("selectdown", function(env, args, request) {
    env.selection.selectDown();
});
PluginManager.registerCommand("godown", function(env, args, request) {
    env.editor.navigateDown();
});
PluginManager.registerCommand("selectwordleft", function(env, args, request) {
    env.selection.selectWordLeft();
});
PluginManager.registerCommand("gotowordleft", function(env, args, request) {
    env.editor.navigateWordLeft();
});
PluginManager.registerCommand("selecttolinestart", function(env, args, request) {
    env.selection.selectLineStart();
});
PluginManager.registerCommand("gotolinestart", function(env, args, request) {
    env.editor.navigateLineStart();
});
PluginManager.registerCommand("selectleft", function(env, args, request) {
    env.selection.selectLeft();
});
PluginManager.registerCommand("gotoleft", function(env, args, request) {
    env.editor.navigateLeft();
});
PluginManager.registerCommand("selectwordright", function(env, args, request) {
    env.selection.selectWordRight();
});
PluginManager.registerCommand("gotowordright", function(env, args, request) {
    env.editor.navigateWordRight();
});
PluginManager.registerCommand("selecttolineend", function(env, args, request) {
    env.selection.selectLineEnd();
});
PluginManager.registerCommand("gotolineend", function(env, args, request) {
    env.editor.navigateLineEnd();
});
PluginManager.registerCommand("selectright", function(env, args, request) {
    env.selection.selectRight();
});
PluginManager.registerCommand("gotoright", function(env, args, request) {
    env.editor.navigateRight();
});
PluginManager.registerCommand("selectpagedown", function(env, args, request) {
    env.editor.selectPageDown();
});
PluginManager.registerCommand("pagedown", function(env, args, request) {
    env.editor.scrollPageDown();
});
PluginManager.registerCommand("gotopagedown", function(env, args, request) {
    env.editor.gotoPageDown();
});
PluginManager.registerCommand("selectpageup", function(env, args, request) {
    env.editor.selectPageUp();
});
PluginManager.registerCommand("pageup", function(env, args, request) {
    env.editor.scrollPageUp();
});
PluginManager.registerCommand("gotopageup", function(env, args, request) {
    env.editor.gotoPageUp();
});
PluginManager.registerCommand("selectlinestart", function(env, args, request) {
    env.selection.selectLineStart();
});
PluginManager.registerCommand("gotolinestart", function(env, args, request) {
    env.editor.navigateLineStart();
});
PluginManager.registerCommand("selectlineend", function(env, args, request) {
    env.selection.selectLineEnd();
});
PluginManager.registerCommand("gotolineend", function(env, args, request) {
    env.editor.navigateLineEnd();
});
PluginManager.registerCommand("del", function(env, args, request) {
    env.editor.removeRight();
});
PluginManager.registerCommand("backspace", function(env, args, request) {
    env.editor.removeLeft();
});
PluginManager.registerCommand("outdent", function(env, args, request) {
    env.editor.blockOutdent();
});
PluginManager.registerCommand("indent", function(env, args, request) {
    env.editor.indent();
});

});