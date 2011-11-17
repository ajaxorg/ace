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

var lang = require("../lib/lang");

function bindKey(win, mac) {
    return {
        win: win,
        mac: mac
    };
}

exports.commands = [{
    name: "selectall",
    bindKey: bindKey("Ctrl-A", "Command-A"),
    exec: function(editor) { editor.selectAll(); }
}, {
    name: "removeline",
    bindKey: bindKey("Ctrl-D", "Command-D"),
    exec: function(editor) { editor.removeLines(); }
}, {
    name: "gotoline",
    bindKey: bindKey("Ctrl-L", "Command-L"),
    exec: function(editor) {
        var line = parseInt(prompt("Enter line number:"));
        if (!isNaN(line)) {
            editor.gotoLine(line);
        }
    }
}, {
    name: "togglecomment",
    bindKey: bindKey("Ctrl-7", "Command-7"),
    exec: function(editor) { editor.toggleCommentLines(); }
}, {
    name: "findnext",
    bindKey: bindKey("Ctrl-K", "Command-G"),
    exec: function(editor) { editor.findNext(); }
}, {
    name: "findprevious",
    bindKey: bindKey("Ctrl-Shift-K", "Command-Shift-G"),
    exec: function(editor) { editor.findPrevious(); }
}, {
    name: "find",
    bindKey: bindKey("Ctrl-F", "Command-F"),
    exec: function(editor) {
        var needle = prompt("Find:", editor.getCopyText());
        editor.find(needle);
    }
}, {
    name: "replace",
    bindKey: bindKey("Ctrl-R", "Command-Option-F"),
    exec: function(editor) {
        var needle = prompt("Find:", editor.getCopyText());
        if (!needle)
            return;
        var replacement = prompt("Replacement:");
        if (!replacement)
            return;
        editor.replace(replacement, {needle: needle});
    }
}, {
    name: "replaceall",
    bindKey: bindKey("Ctrl-Shift-R", "Command-Shift-Option-F"),
    exec: function(editor) {
        var needle = prompt("Find:");
        if (!needle)
            return;
        var replacement = prompt("Replacement:");
        if (!replacement)
            return;
        editor.replaceAll(replacement, {needle: needle});
    }
}, {
    name: "undo",
    bindKey: bindKey("Ctrl-Z", "Command-Z"),
    exec: function(editor) { editor.undo(); }
}, {
    name: "redo",
    bindKey: bindKey("Ctrl-Shift-Z|Ctrl-Y", "Command-Shift-Z|Command-Y"),
    exec: function(editor) { editor.redo(); }
}, {
    name: "overwrite",
    bindKey: bindKey("Insert", "Insert"),
    exec: function(editor) { editor.toggleOverwrite(); }
}, {
    name: "copylinesup",
    bindKey: bindKey("Ctrl-Alt-Up", "Command-Option-Up"),
    exec: function(editor) { editor.copyLinesUp(); }
}, {
    name: "movelinesup",
    bindKey: bindKey("Alt-Up", "Option-Up"),
    exec: function(editor) { editor.moveLinesUp(); }
}, {
    name: "selecttostart",
    bindKey: bindKey("Ctrl-Shift-Home|Alt-Shift-Up", "Command-Shift-Up"),
    exec: function(editor) { editor.getSelection().selectFileStart(); }
}, {
    name: "gotostart",
    bindKey: bindKey("Ctrl-Home|Ctrl-Up", "Command-Home|Command-Up"),
    exec: function(editor) { editor.navigateFileStart(); }
}, {
    name: "selectup",
    bindKey: bindKey("Shift-Up", "Shift-Up"),
    exec: function(editor) { editor.getSelection().selectUp(); }
}, {
    name: "golineup",
    bindKey: bindKey("Up", "Up|Ctrl-P"),
    exec: function(editor, args) { editor.navigateUp(args.times); }
}, {
    name: "copylinesdown",
    bindKey: bindKey("Ctrl-Alt-Down", "Command-Option-Down"),
    exec: function(editor) { editor.copyLinesDown(); }
}, {
    name: "movelinesdown",
    bindKey: bindKey("Alt-Down", "Option-Down"),
    exec: function(editor) { editor.moveLinesDown(); }
}, {
    name: "selecttoend",
    bindKey: bindKey("Ctrl-Shift-End|Alt-Shift-Down", "Command-Shift-Down"),
    exec: function(editor) { editor.getSelection().selectFileEnd(); }
}, {
    name: "gotoend",
    bindKey: bindKey("Ctrl-End|Ctrl-Down", "Command-End|Command-Down"),
    exec: function(editor) { editor.navigateFileEnd(); }
}, {
    name: "selectdown",
    bindKey: bindKey("Shift-Down", "Shift-Down"),
    exec: function(editor) { editor.getSelection().selectDown(); }
}, {
    name: "golinedown",
    bindKey: bindKey("Down", "Down|Ctrl-N"),
    exec: function(editor, args) { editor.navigateDown(args.times); }
}, {
    name: "selectwordleft",
    bindKey: bindKey("Ctrl-Shift-Left", "Option-Shift-Left"),
    exec: function(editor) { editor.getSelection().selectWordLeft(); }
}, {
    name: "gotowordleft",
    bindKey: bindKey("Ctrl-Left", "Option-Left"),
    exec: function(editor) { editor.navigateWordLeft(); }
}, {
    name: "selecttolinestart",
    bindKey: bindKey("Alt-Shift-Left", "Command-Shift-Left"),
    exec: function(editor) { editor.getSelection().selectLineStart(); }
}, {
    name: "gotolinestart",
    bindKey: bindKey("Alt-Left|Home", "Command-Left|Home|Ctrl-A"),
    exec: function(editor) { editor.navigateLineStart(); }
}, {
    name: "selectleft",
    bindKey: bindKey("Shift-Left", "Shift-Left"),
    exec: function(editor) { editor.getSelection().selectLeft(); }
}, {
    name: "gotoleft",
    bindKey: bindKey("Left", "Left|Ctrl-B"),
    exec: function(editor, args) { editor.navigateLeft(args.times); }
}, {
    name: "selectwordright",
    bindKey: bindKey("Ctrl-Shift-Right", "Option-Shift-Right"),
    exec: function(editor) { editor.getSelection().selectWordRight(); }
}, {
    name: "gotowordright",
    bindKey: bindKey("Ctrl-Right", "Option-Right"),
    exec: function(editor) { editor.navigateWordRight(); }
}, {
    name: "selecttolineend",
    bindKey: bindKey("Alt-Shift-Right", "Command-Shift-Right"),
    exec: function(editor) { editor.getSelection().selectLineEnd(); }
}, {
    name: "gotolineend",
    bindKey: bindKey("Alt-Right|End", "Command-Right|End|Ctrl-E"),
    exec: function(editor) { editor.navigateLineEnd(); }
}, {
    name: "selectright",
    bindKey: bindKey("Shift-Right", "Shift-Right"),
    exec: function(editor) { editor.getSelection().selectRight(); }
}, {
    name: "gotoright",
    bindKey: bindKey("Right", "Right|Ctrl-F"),
    exec: function(editor, args) { editor.navigateRight(args.times); }
}, {
    name: "selectpagedown",
    bindKey: bindKey("Shift-PageDown", "Shift-PageDown"),
    exec: function(editor) { editor.selectPageDown(); }
}, {
    name: "pagedown",
    bindKey: bindKey(null, "PageDown"),
    exec: function(editor) { editor.scrollPageDown(); }
}, {
    name: "gotopagedown",
    bindKey: bindKey("PageDown", "Option-PageDown|Ctrl-V"),
    exec: function(editor) { editor.gotoPageDown(); }
}, {
    name: "selectpageup",
    bindKey: bindKey("Shift-PageUp", "Shift-PageUp"),
    exec: function(editor) { editor.selectPageUp(); }
}, {
    name: "pageup",
    bindKey: bindKey(null, "PageUp"),
    exec: function(editor) { editor.scrollPageUp(); }
}, {
    name: "gotopageup",
    bindKey: bindKey("PageUp", "Option-PageUp"),
    exec: function(editor) { editor.gotoPageUp(); }
}, {
    name: "selectlinestart",
    bindKey: bindKey("Shift-Home", "Shift-Home"),
    exec: function(editor) { editor.getSelection().selectLineStart(); }
}, {
    name: "selectlineend",
    bindKey: bindKey("Shift-End", "Shift-End"),
    exec: function(editor) { editor.getSelection().selectLineEnd(); }
}, {
    name: "del",
    bindKey: bindKey("Delete", "Delete|Ctrl-D"),
    exec: function(editor) { editor.remove("right"); }
}, {
    name: "backspace",
    bindKey: bindKey(
        "Ctrl-Backspace|Command-Backspace|Option-Backspace|Shift-Backspace|Backspace",
        "Ctrl-Backspace|Command-Backspace|Shift-Backspace|Backspace|Ctrl-H"
    ),
    exec: function(editor) { editor.remove("left"); }
}, {
    name: "removetolinestart",
    bindKey: bindKey("Alt-Backspace", "Option-Backspace"),
    exec: function(editor) { editor.removeToLineStart(); }
}, {
    name: "removetolineend",
    bindKey: bindKey("Alt-Delete", "Ctrl-K"),
    exec: function(editor) { editor.removeToLineEnd(); }
}, {
    name: "removewordleft",
    bindKey: bindKey("Ctrl-Backspace", "Alt-Backspace|Ctrl-Alt-Backspace"),
    exec: function(editor) { editor.removeWordLeft(); }
}, {
    name: "removewordright",
    bindKey: bindKey("Ctrl-Delete", "Alt-Delete"),
    exec: function(editor) { editor.removeWordRight(); }
}, {
    name: "outdent",
    bindKey: bindKey("Shift-Tab", "Shift-Tab"),
    exec: function(editor) { editor.blockOutdent(); }
}, {
    name: "indent",
    bindKey: bindKey("Tab", "Tab"),
    exec: function(editor) { editor.indent(); }
}, {
    name: "inserttext",
    exec: function(editor, args) {
        editor.insert(lang.stringRepeat(args.text  || "", args.times || 1));
    }
}, {
    name: "centerselection",
    bindKey: bindKey(null, "Ctrl-L"),
    exec: function(editor) { editor.centerSelection(); }
}, {
    name: "splitline",
    bindKey: bindKey(null, "Ctrl-O"),
    exec: function(editor) { editor.splitLine(); }
}, {
    name: "transposeletters",
    bindKey: bindKey("Ctrl-T", "Ctrl-T"),
    exec: function(editor) { editor.transposeLetters(); }
}, {
    name: "touppercase",
    bindKey: bindKey("Ctrl-U", "Ctrl-U"),
    exec: function(editor) { editor.toUpperCase(); }
}, {
    name: "tolowercase",
    bindKey: bindKey("Ctrl-Shift-U", "Ctrl-Shift-U"),
    exec: function(editor) { editor.toLowerCase(); }
}, {
    name: "fold",
    bindKey: bindKey("Alt-L", "Alt-L"),
    exec: function(editor) {
        editor.session.toggleFold(false);
    }
}, {
    name: "unfold",
    bindKey: bindKey("Alt-Shift-L", "Alt-Shift-L"),
    exec: function(editor) {
        editor.session.toggleFold(true);
    }
}, {
    name: "foldall",
    bindKey: bindKey("Alt-Shift-0", "Alt-Shift-0"),
    exec: function(editor) {
        editor.session.foldAll();
    }
}, {
    name: "unfoldall",
    bindKey: bindKey("Alt-Shift-0", "Alt-Shift-0"),
    exec: function(editor) {
        editor.session.unFoldAll();
    }
}];

});
