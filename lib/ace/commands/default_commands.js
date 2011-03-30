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
var gcli = require("cockpit/index");

function bindKey(win, mac) {
    return {
        win: win,
        mac: mac,
        sender: "editor"
    };
}

/**
 * TODO: This could be done more concisely and reversibly
 */
exports.startup = function() {
    gcli.addCommand({
        name: "null",
        exec: function(env, args, request) {  }
    });

    gcli.addCommand({
        name: "selectall",
        bindKey: bindKey("Ctrl-A", "Command-A"),
        exec: function(env, args, request) { env.editor.selectAll(); }
    });
    gcli.addCommand({
        name: "removeline",
        bindKey: bindKey("Ctrl-D", "Command-D"),
        exec: function(env, args, request) { env.editor.removeLines(); }
    });
    gcli.addCommand({
        name: "gotoline",
        description: "Move the cursor to the given line",
        bindKey: bindKey("Ctrl-L", "Command-L"),
        params: [
            { name: "line", type: "number", description: "The line number to jump to" }
        ],
        exec: function(env, args, request) {
            // TODO: manual params should not be needed
            if (!args.line) {
                while (!isNaN(args.line)) {
                    args.line = parseInt(prompt("Enter line number:"));
                }
            }
            env.editor.gotoLine(args.line);
        }
    });
    gcli.addCommand({
        name: "togglecomment",
        bindKey: bindKey("Ctrl-7", "Command-7"),
        exec: function(env, args, request) { env.editor.toggleCommentLines(); }
    });
    gcli.addCommand({
        name: "findnext",
        bindKey: bindKey("Ctrl-K", "Command-G"),
        exec: function(env, args, request) { env.editor.findNext(); }
    });
    gcli.addCommand({
        name: "findprevious",
        bindKey: bindKey("Ctrl-Shift-K", "Command-Shift-G"),
        exec: function(env, args, request) { env.editor.findPrevious(); }
    });
    gcli.addCommand({
        name: "find",
        description: "Search for the next instance of a string",
        bindKey: bindKey("Ctrl-F", "Command-F"),
        params: [
            { name: "findWhat", type: "string", description: "The text to search for" }
        ],
        exec: function(env, args, request) {
            // TODO: manual params should not be needed
            if (!args.findWhat) {
                args.findWhat = prompt("Find:");
            }
            env.editor.find(args.findWhat);
        }
    });
    gcli.addCommand({
        name: "replace",
        description: "Replace the next instance of a string with a given replacement",
        bindKey: bindKey("Ctrl-R", "Command-Option-F"),
        params: [
            { name: "findWhat", type: "string", description: "The text to search for" },
            { name: "replacement", type: "string", description: "The replacement text" }
        ],
        exec: function(env, args, request) {
            // TODO: manual params should not be needed
            if (!args.findWhat) {
                args.findWhat = prompt("Find:");
                if (!args.findWhat) {
                    return;
                }
                args.replacement = prompt("Replacement:");
                if (!args.replacement) {
                    return;
                }
            }
            env.editor.replace(args.replacement, {needle: args.findWhat});
        }
    });
    gcli.addCommand({
        name: "replaceall",
        description: "Replace all instances of a string with a given replacement",
        bindKey: bindKey("Ctrl-Shift-R", "Command-Shift-Option-F"),
        params: [
            { name: "findWhat", type: "string", description: "The text to search for" },
            { name: "replacement", type: "string", description: "The replacement text" }
        ],
        exec: function(env, args, request) {
            // TODO: manual params should not be needed
            if (!args.findWhat) {
                args.findWhat = prompt("Find:");
                if (!args.findWhat) {
                    return;
                }
                args.replacement = prompt("Replacement:");
                if (!args.replacement) {
                    return;
                }
            }
            env.editor.replaceAll(args.replacement, {needle: args.findWhat});
        }
    });
    gcli.addCommand({
        name: "undo",
        bindKey: bindKey("Ctrl-Z", "Command-Z"),
        exec: function(env, args, request) { env.editor.undo(); }
    });
    gcli.addCommand({
        name: "redo",
        bindKey: bindKey("Ctrl-Shift-Z|Ctrl-Y", "Command-Shift-Z|Command-Y"),
        exec: function(env, args, request) { env.editor.redo(); }
    });
    gcli.addCommand({
        name: "overwrite",
        bindKey: bindKey("Insert", "Insert"),
        exec: function(env, args, request) { env.editor.toggleOverwrite(); }
    });
    gcli.addCommand({
        name: "copylinesup",
        bindKey: bindKey("Ctrl-Alt-Up", "Command-Option-Up"),
        exec: function(env, args, request) { env.editor.copyLinesUp(); }
    });
    gcli.addCommand({
        name: "movelinesup",
        bindKey: bindKey("Alt-Up", "Option-Up"),
        exec: function(env, args, request) { env.editor.moveLinesUp(); }
    });
    gcli.addCommand({
        name: "selecttostart",
        bindKey: bindKey("Alt-Shift-Up", "Command-Shift-Up"),
        exec: function(env, args, request) { env.editor.getSelection().selectFileStart(); }
    });
    gcli.addCommand({
        name: "gotostart",
        bindKey: bindKey("Ctrl-Home|Ctrl-Up", "Command-Home|Command-Up"),
        exec: function(env, args, request) { env.editor.navigateFileStart(); }
    });
    gcli.addCommand({
        name: "selectup",
        bindKey: bindKey("Shift-Up", "Shift-Up"),
        exec: function(env, args, request) { env.editor.getSelection().selectUp(); }
    });
    gcli.addCommand({
        name: "golineup",
        bindKey: bindKey("Up", "Up|Ctrl-P"),
        exec: function(env, args, request) { env.editor.navigateUp(args.times); }
    });
    gcli.addCommand({
        name: "copylinesdown",
        bindKey: bindKey("Ctrl-Alt-Down", "Command-Option-Down"),
        exec: function(env, args, request) { env.editor.copyLinesDown(); }
    });
    gcli.addCommand({
        name: "movelinesdown",
        bindKey: bindKey("Alt-Down", "Option-Down"),
        exec: function(env, args, request) { env.editor.moveLinesDown(); }
    });
    gcli.addCommand({
        name: "selecttoend",
        bindKey: bindKey("Alt-Shift-Down", "Command-Shift-Down"),
        exec: function(env, args, request) { env.editor.getSelection().selectFileEnd(); }
    });
    gcli.addCommand({
        name: "gotoend",
        bindKey: bindKey("Ctrl-End|Ctrl-Down", "Command-End|Command-Down"),
        exec: function(env, args, request) { env.editor.navigateFileEnd(); }
    });
    gcli.addCommand({
        name: "selectdown",
        bindKey: bindKey("Shift-Down", "Shift-Down"),
        exec: function(env, args, request) { env.editor.getSelection().selectDown(); }
    });
    gcli.addCommand({
        name: "golinedown",
        bindKey: bindKey("Down", "Down|Ctrl-N"),
        exec: function(env, args, request) { env.editor.navigateDown(args.times); }
    });
    gcli.addCommand({
        name: "selectwordleft",
        bindKey: bindKey("Ctrl-Shift-Left", "Option-Shift-Left"),
        exec: function(env, args, request) { env.editor.getSelection().selectWordLeft(); }
    });
    gcli.addCommand({
        name: "gotowordleft",
        bindKey: bindKey("Ctrl-Left", "Option-Left"),
        exec: function(env, args, request) { env.editor.navigateWordLeft(); }
    });
    gcli.addCommand({
        name: "selecttolinestart",
        bindKey: bindKey("Alt-Shift-Left", "Command-Shift-Left"),
        exec: function(env, args, request) { env.editor.getSelection().selectLineStart(); }
    });
    gcli.addCommand({
        name: "gotolinestart",
        bindKey: bindKey("Alt-Left|Home", "Command-Left|Home|Ctrl-A"),
        exec: function(env, args, request) { env.editor.navigateLineStart(); }
    });
    gcli.addCommand({
        name: "selectleft",
        bindKey: bindKey("Shift-Left", "Shift-Left"),
        exec: function(env, args, request) { env.editor.getSelection().selectLeft(); }
    });
    gcli.addCommand({
        name: "gotoleft",
        bindKey: bindKey("Left", "Left|Ctrl-B"),
        exec: function(env, args, request) { env.editor.navigateLeft(args.times); }
    });
    gcli.addCommand({
        name: "selectwordright",
        bindKey: bindKey("Ctrl-Shift-Right", "Option-Shift-Right"),
        exec: function(env, args, request) { env.editor.getSelection().selectWordRight(); }
    });
    gcli.addCommand({
        name: "gotowordright",
        bindKey: bindKey("Ctrl-Right", "Option-Right"),
        exec: function(env, args, request) { env.editor.navigateWordRight(); }
    });
    gcli.addCommand({
        name: "selecttolineend",
        bindKey: bindKey("Alt-Shift-Right", "Command-Shift-Right"),
        exec: function(env, args, request) { env.editor.getSelection().selectLineEnd(); }
    });
    gcli.addCommand({
        name: "gotolineend",
        bindKey: bindKey("Alt-Right|End", "Command-Right|End|Ctrl-E"),
        exec: function(env, args, request) { env.editor.navigateLineEnd(); }
    });
    gcli.addCommand({
        name: "selectright",
        bindKey: bindKey("Shift-Right", "Shift-Right"),
        exec: function(env, args, request) { env.editor.getSelection().selectRight(); }
    });
    gcli.addCommand({
        name: "gotoright",
        bindKey: bindKey("Right", "Right|Ctrl-F"),
        exec: function(env, args, request) { env.editor.navigateRight(args.times); }
    });
    gcli.addCommand({
        name: "selectpagedown",
        bindKey: bindKey("Shift-PageDown", "Shift-PageDown"),
        exec: function(env, args, request) { env.editor.selectPageDown(); }
    });
    gcli.addCommand({
        name: "pagedown",
        bindKey: bindKey(null, "PageDown"),
        exec: function(env, args, request) { env.editor.scrollPageDown(); }
    });
    gcli.addCommand({
        name: "gotopagedown",
        bindKey: bindKey("PageDown", "Option-PageDown|Ctrl-V"),
        exec: function(env, args, request) { env.editor.gotoPageDown(); }
    });
    gcli.addCommand({
        name: "selectpageup",
        bindKey: bindKey("Shift-PageUp", "Shift-PageUp"),
        exec: function(env, args, request) { env.editor.selectPageUp(); }
    });
    gcli.addCommand({
        name: "pageup",
        bindKey: bindKey(null, "PageUp"),
        exec: function(env, args, request) { env.editor.scrollPageUp(); }
    });
    gcli.addCommand({
        name: "gotopageup",
        bindKey: bindKey("PageUp", "Option-PageUp"),
        exec: function(env, args, request) { env.editor.gotoPageUp(); }
    });
    gcli.addCommand({
        name: "selectlinestart",
        bindKey: bindKey("Shift-Home", "Shift-Home"),
        exec: function(env, args, request) { env.editor.getSelection().selectLineStart(); }
    });
    gcli.addCommand({
        name: "selectlineend",
        bindKey: bindKey("Shift-End", "Shift-End"),
        exec: function(env, args, request) { env.editor.getSelection().selectLineEnd(); }
    });
    gcli.addCommand({
        name: "del",
        bindKey: bindKey("Delete", "Delete|Ctrl-D"),
        exec: function(env, args, request) { env.editor.removeRight(); }
    });
    gcli.addCommand({
        name: "backspace",
        bindKey: bindKey(
            "Ctrl-Backspace|Command-Backspace|Option-Backspace|Shift-Backspace|Backspace",
            "Ctrl-Backspace|Command-Backspace|Shift-Backspace|Backspace|Ctrl-H"
        ),
        exec: function(env, args, request) { env.editor.removeLeft(); }
    });
    gcli.addCommand({
        name: "removetolinestart",
        bindKey: bindKey(null, "Option-Backspace"),
        exec: function(env, args, request) { env.editor.removeToLineStart(); }
    });
    gcli.addCommand({
        name: "removetolineend",
        bindKey: bindKey(null, "Ctrl-K"),
        exec: function(env, args, request) { env.editor.removeToLineEnd(); }
    });
    gcli.addCommand({
        name: "removewordleft",
        bindKey: bindKey(null, "Alt-Backspace|Ctrl-Alt-Backspace"),
        exec: function(env, args, request) { env.editor.removeWordLeft(); }
    });
    gcli.addCommand({
        name: "removewordright",
        bindKey: bindKey(null, "Alt-Delete"),
        exec: function(env, args, request) { env.editor.removeWordRight(); }
    });
    gcli.addCommand({
        name: "outdent",
        bindKey: bindKey("Shift-Tab", "Shift-Tab"),
        exec: function(env, args, request) { env.editor.blockOutdent(); }
    });
    gcli.addCommand({
        name: "indent",
        bindKey: bindKey("Tab", "Tab"),
        exec: function(env, args, request) { env.editor.indent(); }
    });
    gcli.addCommand({
        name: "inserttext",
        exec: function(env, args, request) {
            env.editor.insert(lang.stringRepeat(args.text  || "", args.times || 1));
        }
    });
    gcli.addCommand({
        name: "centerselection",
        bindKey: bindKey(null, "Ctrl-L"),
        exec: function(env, args, request) { env.editor.centerSelection(); }
    });
    gcli.addCommand({
        name: "splitline",
        bindKey: bindKey(null, "Ctrl-O"),
        exec: function(env, args, request) { env.editor.splitLine(); }
    });
    gcli.addCommand({
        name: "transposeletters",
        bindKey: bindKey("Ctrl-T", "Ctrl-T"),
        exec: function(env, args, request) { env.editor.transposeLetters(); }
    });
};


});
