/* vim:ts=4:sts=4:sw=4:
 * ***** BEGIN LICENSE BLOCK *****
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
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *      Julian Viereck <julian.viereck@gmail.com>
 *      Mihai Sucan <mihai.sucan@gmail.com>
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

var lang = require("pilot/lang");
var canon = require("pilot/canon");

canon.addCommand({
    name: "null",
    exec: function(env, args, request) {  }
});

canon.addCommand({
    name: "selectall",
    exec: function(env, args, request) { env.editor.selectAll(); }
});
canon.addCommand({
    name: "removeline",
    exec: function(env, args, request) { env.editor.removeLines(); }
});
canon.addCommand({
    name: "gotoline",
    exec: function(env, args, request) {
        var line = parseInt(prompt("Enter line number:"));
        if (!isNaN(line)) {
            env.editor.gotoLine(line);
        }
    }
});
canon.addCommand({
    name: "togglecomment",
    exec: function(env, args, request) { env.editor.toggleCommentLines(); }
});
canon.addCommand({
    name: "findnext",
    exec: function(env, args, request) { env.editor.findNext(); }
});
canon.addCommand({
    name: "findprevious",
    exec: function(env, args, request) { env.editor.findPrevious(); }
});
canon.addCommand({
    name: "find",
    exec: function(env, args, request) {
        var needle = prompt("Find:");
        env.editor.find(needle);
    }
});
canon.addCommand({
    name: "replace",
    exec: function(env, args, request) {
        var needle = prompt("Find:");
        if (!needle)
            return;
        var replacement = prompt("Replacement:");
        if (!replacement)
            return;
        env.editor.replace(replacement, {needle: needle});
    }
});
canon.addCommand({
    name: "replaceall",
    exec: function(env, args, request) {
        var needle = prompt("Find:");
        if (!needle)
            return;
        var replacement = prompt("Replacement:");
        if (!replacement)
            return;
        env.editor.replaceAll(replacement, {needle: needle});
    }
});
canon.addCommand({
    name: "undo",
    exec: function(env, args, request) { env.editor.undo(); }
});
canon.addCommand({
    name: "redo",
    exec: function(env, args, request) { env.editor.redo(); }
});
canon.addCommand({
    name: "redo",
    exec: function(env, args, request) { env.editor.redo(); }
});
canon.addCommand({
    name: "overwrite",
    exec: function(env, args, request) { env.editor.toggleOverwrite(); }
});
canon.addCommand({
    name: "copylinesup",
    exec: function(env, args, request) { env.editor.copyLinesUp(); }
});
canon.addCommand({
    name: "movelinesup",
    exec: function(env, args, request) { env.editor.moveLinesUp(); }
});
canon.addCommand({
    name: "selecttostart",
    exec: function(env, args, request) { env.editor.getSelection().selectFileStart(); }
});
canon.addCommand({
    name: "gotostart",
    exec: function(env, args, request) { env.editor.navigateFileStart(); }
});
canon.addCommand({
    name: "selectup",
    exec: function(env, args, request) { env.editor.getSelection().selectUp(); }
});
canon.addCommand({
    name: "golineup",
    exec: function(env, args, request) { env.editor.navigateUp(args.times); }
});
canon.addCommand({
    name: "copylinesdown",
    exec: function(env, args, request) { env.editor.copyLinesDown(); }
});
canon.addCommand({
    name: "movelinesdown",
    exec: function(env, args, request) { env.editor.moveLinesDown(); }
});
canon.addCommand({
    name: "selecttoend",
    exec: function(env, args, request) { env.editor.getSelection().selectFileEnd(); }
});
canon.addCommand({
    name: "gotoend",
    exec: function(env, args, request) { env.editor.navigateFileEnd(); }
});
canon.addCommand({
    name: "selectdown",
    exec: function(env, args, request) { env.editor.getSelection().selectDown(); }
});
canon.addCommand({
    name: "golinedown",
    exec: function(env, args, request) { env.editor.navigateDown(args.times); }
});
canon.addCommand({
    name: "selectwordleft",
    exec: function(env, args, request) { env.editor.getSelection().selectWordLeft(); }
});
canon.addCommand({
    name: "gotowordleft",
    exec: function(env, args, request) { env.editor.navigateWordLeft(); }
});
canon.addCommand({
    name: "selecttolinestart",
    exec: function(env, args, request) { env.editor.getSelection().selectLineStart(); }
});
canon.addCommand({
    name: "gotolinestart",
    exec: function(env, args, request) { env.editor.navigateLineStart(); }
});
canon.addCommand({
    name: "selectleft",
    exec: function(env, args, request) { env.editor.getSelection().selectLeft(); }
});
canon.addCommand({
    name: "gotoleft",
    exec: function(env, args, request) { env.editor.navigateLeft(args.times); }
});
canon.addCommand({
    name: "selectwordright",
    exec: function(env, args, request) { env.editor.getSelection().selectWordRight(); }
});
canon.addCommand({
    name: "gotowordright",
    exec: function(env, args, request) { env.editor.navigateWordRight(); }
});
canon.addCommand({
    name: "selecttolineend",
    exec: function(env, args, request) { env.editor.getSelection().selectLineEnd(); }
});
canon.addCommand({
    name: "gotolineend",
    exec: function(env, args, request) { env.editor.navigateLineEnd(); }
});
canon.addCommand({
    name: "selectright",
    exec: function(env, args, request) { env.editor.getSelection().selectRight(); }
});
canon.addCommand({
    name: "gotoright",
    exec: function(env, args, request) { env.editor.navigateRight(args.times); }
});
canon.addCommand({
    name: "selectpagedown",
    exec: function(env, args, request) { env.editor.selectPageDown(); }
});
canon.addCommand({
    name: "pagedown",
    exec: function(env, args, request) { env.editor.scrollPageDown(); }
});
canon.addCommand({
    name: "gotopagedown",
    exec: function(env, args, request) { env.editor.gotoPageDown(); }
});
canon.addCommand({
    name: "selectpageup",
    exec: function(env, args, request) { env.editor.selectPageUp(); }
});
canon.addCommand({
    name: "pageup",
    exec: function(env, args, request) { env.editor.scrollPageUp(); }
});
canon.addCommand({
    name: "gotopageup",
    exec: function(env, args, request) { env.editor.gotoPageUp(); }
});
canon.addCommand({
    name: "selectlinestart",
    exec: function(env, args, request) { env.editor.getSelection().selectLineStart(); }
});
canon.addCommand({
    name: "gotolinestart",
    exec: function(env, args, request) { env.editor.navigateLineStart(); }
});
canon.addCommand({
    name: "selectlineend",
    exec: function(env, args, request) { env.editor.getSelection().selectLineEnd(); }
});
canon.addCommand({
    name: "gotolineend",
    exec: function(env, args, request) { env.editor.navigateLineEnd(); }
});
canon.addCommand({
    name: "del",
    exec: function(env, args, request) { env.editor.removeRight(); }
});
canon.addCommand({
    name: "backspace",
    exec: function(env, args, request) { env.editor.removeLeft(); }
});
canon.addCommand({
    name: "removetolinestart",
    exec: function(env, args, request) { env.editor.removeToLineStart(); }
});
canon.addCommand({
    name: "removetolineend",
    exec: function(env, args, request) { env.editor.removeToLineEnd(); }
});
canon.addCommand({
    name: "removewordleft",
    exec: function(env, args, request) { env.editor.removeWordLeft(); }
});
canon.addCommand({
    name: "removewordright",
    exec: function(env, args, request) { env.editor.removeWordRight(); }
});
canon.addCommand({
    name: "outdent",
    exec: function(env, args, request) { env.editor.blockOutdent(); }
});
canon.addCommand({
    name: "indent",
    exec: function(env, args, request) { env.editor.indent(); }
});
canon.addCommand({
    name: "inserttext",
    exec: function(env, args, request) {
        env.editor.insert(lang.stringRepeat(args.text  || "", args.times || 1));
    }
});
canon.addCommand({
    name: "centerselection",
    exec: function(env, args, request) { env.editor.centerSelection(); }
});
canon.addCommand({
    name: "splitline",
    exec: function(env, args, request) { env.editor.splitLine(); }
});
canon.addCommand({
    name: "transposeletters",
    exec: function(env, args, request) { env.editor.transposeLetters(); }
});


});
