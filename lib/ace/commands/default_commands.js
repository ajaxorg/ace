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
var keybinding = require('ace/keyboard/keybinding');

/**
 * TODO: This could be done more concisely and reversibly
 */
exports.startup = function() {
    gcli.addCommand({
        name: "null",
        exec: function(env, args) {  }
    });

    gcli.addCommand({
        name: "selectall",
        exec: function(env, args) { env.editor.selectAll(); }
    });
    keybinding.bindCommand({ win: "Ctrl-A", mac: "Command-A" }, "selectall");

    gcli.addCommand({
        name: "removeline",
        exec: function(env, args) { env.editor.removeLines(); }
    });
    keybinding.bindCommand({ win: "Ctrl-D", mac: "Command-D" }, "removeline");

    gcli.addCommand({
        name: "gotoline",
        description: "Move the cursor to the given line",
        params: [
            { name: "line", type: "number", description: "The line number to jump to" }
        ],
        exec: function(env, args) {
            // TODO: manual params should not be needed
            if (!args.line) {
                while (!isNaN(args.line)) {
                    args.line = parseInt(prompt("Enter line number:"));
                }
            }
            env.editor.gotoLine(args.line);
        }
    });
    keybinding.bindCommand({ win: "Ctrl-L", mac: "Command-L" }, "gotoline");

    gcli.addCommand({
        name: "togglecomment",
        exec: function(env, args) { env.editor.toggleCommentLines(); }
    });
    keybinding.bindCommand({ win: "Ctrl-7", mac: "Command-7" }, "togglecomment");

    gcli.addCommand({
        name: "findnext",
        exec: function(env, args) { env.editor.findNext(); }
    });
    keybinding.bindCommand({ win: "Ctrl-K", mac: "Command-G" }, "findnext");

    gcli.addCommand({
        name: "findprevious",
        exec: function(env, args) { env.editor.findPrevious(); }
    });
    keybinding.bindCommand({ win: "Ctrl-Shift-K", mac: "Command-Shift-G" }, "findprevious");

    gcli.addCommand({
        name: "find",
        description: "Search for the next instance of a string",
        params: [
            { name: "findWhat", type: "string", description: "The text to search for" }
        ],
        exec: function(env, args) {
            // TODO: manual params should not be needed
            if (!args.findWhat) {
                args.findWhat = prompt("Find:");
            }
            env.editor.find(args.findWhat);
        }
    });
    keybinding.bindCommand({ win: "Ctrl-F", mac: "Command-F" }, "find");

    gcli.addCommand({
        name: "replace",
        description: "Replace the next instance of a string with a given replacement",
        params: [
            { name: "findWhat", type: "string", description: "The text to search for" },
            { name: "replacement", type: "string", description: "The replacement text" }
        ],
        exec: function(env, args) {
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
    keybinding.bindCommand({ win: "Ctrl-R", mac: "Command-Option-F" }, "replace");

    gcli.addCommand({
        name: "replaceall",
        description: "Replace all instances of a string with a given replacement",
        params: [
            { name: "findWhat", type: "string", description: "The text to search for" },
            { name: "replacement", type: "string", description: "The replacement text" }
        ],
        exec: function(env, args) {
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
    keybinding.bindCommand({ win: "Ctrl-Shift-R", mac: "Command-Shift-Option-F" }, "replaceall");

    gcli.addCommand({
        name: "undo",
        exec: function(env, args) { env.editor.undo(); }
    });
    keybinding.bindCommand({ win: "Ctrl-Z", mac: "Command-Z" }, "undo");

    gcli.addCommand({
        name: "redo",
        exec: function(env, args) { env.editor.redo(); }
    });
    keybinding.bindCommand({ win: "Ctrl-Shift-Z|Ctrl-Y", mac: "Command-Shift-Z|Command-Y" }, "redo");

    gcli.addCommand({
        name: "overwrite",
        exec: function(env, args) { env.editor.toggleOverwrite(); }
    });
    keybinding.bindCommand({ win: "Insert", mac: "Insert" }, "overwrite");

    gcli.addCommand({
        name: "copylinesup",
        exec: function(env, args) { env.editor.copyLinesUp(); }
    });
    keybinding.bindCommand({ win: "Ctrl-Alt-Up", mac: "Command-Option-Up" }, "copylinesup");

    gcli.addCommand({
        name: "movelinesup",
        exec: function(env, args) { env.editor.moveLinesUp(); }
    });
    keybinding.bindCommand({ win: "Alt-Up", mac: "Option-Up" }, "movelinesup");

    gcli.addCommand({
        name: "selecttostart",
        exec: function(env, args) { env.editor.getSelection().selectFileStart(); }
    });
    keybinding.bindCommand({ win: "Alt-Shift-Up", mac: "Command-Shift-Up" }, "selecttostart");

    gcli.addCommand({
        name: "gotostart",
        exec: function(env, args) { env.editor.navigateFileStart(); }
    });
    keybinding.bindCommand({ win: "Ctrl-Home|Ctrl-Up", mac: "Command-Home|Command-Up" }, "gotostart");

    gcli.addCommand({
        name: "selectup",
        exec: function(env, args) { env.editor.getSelection().selectUp(); }
    });
    keybinding.bindCommand({ win: "Shift-Up", mac: "Shift-Up" }, "selectup");

    gcli.addCommand({
        name: "golineup",
        exec: function(env, args) { env.editor.navigateUp(args.times); }
    });
    keybinding.bindCommand({ win: "Up", mac: "Up|Ctrl-P" }, "golineup");

    gcli.addCommand({
        name: "copylinesdown",
        exec: function(env, args) { env.editor.copyLinesDown(); }
    });
    keybinding.bindCommand({ win: "Ctrl-Alt-Down", mac: "Command-Option-Down" }, "copylinesdown");

    gcli.addCommand({
        name: "movelinesdown",
        exec: function(env, args) { env.editor.moveLinesDown(); }
    });
    keybinding.bindCommand({ win: "Alt-Down", mac: "Option-Down" }, "movelinesdown");

    gcli.addCommand({
        name: "selecttoend",
        exec: function(env, args) { env.editor.getSelection().selectFileEnd(); }
    });
    keybinding.bindCommand({ win: "Alt-Shift-Down", mac: "Command-Shift-Down" }, "selecttoend");

    gcli.addCommand({
        name: "gotoend",
        exec: function(env, args) { env.editor.navigateFileEnd(); }
    });
    keybinding.bindCommand({ win: "Ctrl-End|Ctrl-Down", mac: "Command-End|Command-Down" }, "gotoend");

    gcli.addCommand({
        name: "selectdown",
        exec: function(env, args) { env.editor.getSelection().selectDown(); }
    });
    keybinding.bindCommand({ win: "Shift-Down", mac: "Shift-Down" }, "selectdown");

    gcli.addCommand({
        name: "golinedown",
        exec: function(env, args) { env.editor.navigateDown(args.times); }
    });
    keybinding.bindCommand({ win: "Down", mac: "Down|Ctrl-N" }, "golinedown");

    gcli.addCommand({
        name: "selectwordleft",
        exec: function(env, args) { env.editor.getSelection().selectWordLeft(); }
    });
    keybinding.bindCommand({ win: "Ctrl-Shift-Left", mac: "Option-Shift-Left" }, "selectwordleft");

    gcli.addCommand({
        name: "gotowordleft",
        exec: function(env, args) { env.editor.navigateWordLeft(); }
    });
    keybinding.bindCommand({ win: "Ctrl-Left", mac: "Option-Left" }, "gotowordleft");

    gcli.addCommand({
        name: "selecttolinestart",
        exec: function(env, args) { env.editor.getSelection().selectLineStart(); }
    });
    keybinding.bindCommand({ win: "Alt-Shift-Left", mac: "Command-Shift-Left" }, "selecttolinestart");

    gcli.addCommand({
        name: "gotolinestart",
        exec: function(env, args) { env.editor.navigateLineStart(); }
    });
    keybinding.bindCommand({ win: "Alt-Left|Home", mac: "Command-Left|Home|Ctrl-A" }, "");

    gcli.addCommand({
        name: "selectleft",
        exec: function(env, args) { env.editor.getSelection().selectLeft(); }
    });
    keybinding.bindCommand({ win: "Shift-Left", mac: "Shift-Left" }, "gotolinestart");

    gcli.addCommand({
        name: "gotoleft",
        exec: function(env, args) { env.editor.navigateLeft(args.times); }
    });
    keybinding.bindCommand({ win: "Left", mac: "Left|Ctrl-B" }, "gotoleft");

    gcli.addCommand({
        name: "selectwordright",
        exec: function(env, args) { env.editor.getSelection().selectWordRight(); }
    });
    keybinding.bindCommand({ win: "Ctrl-Shift-Right", mac: "Option-Shift-Right" }, "selectwordright");

    gcli.addCommand({
        name: "gotowordright",
        exec: function(env, args) { env.editor.navigateWordRight(); }
    });
    keybinding.bindCommand({ win: "Ctrl-Right", mac: "Option-Right" }, "");

    gcli.addCommand({
        name: "selecttolineend",
        exec: function(env, args) { env.editor.getSelection().selectLineEnd(); }
    });
    keybinding.bindCommand({ win: "Alt-Shift-Right", mac: "Command-Shift-Right" }, "gotowordright");

    gcli.addCommand({
        name: "gotolineend",
        exec: function(env, args) { env.editor.navigateLineEnd(); }
    });
    keybinding.bindCommand({ win: "Alt-Right|End", mac: "Command-Right|End|Ctrl-E" }, "gotolineend");

    gcli.addCommand({
        name: "selectright",
        exec: function(env, args) { env.editor.getSelection().selectRight(); }
    });
    keybinding.bindCommand({ win: "Shift-Right", mac: "Shift-Right" }, "selectright");

    gcli.addCommand({
        name: "gotoright",
        exec: function(env, args) { env.editor.navigateRight(args.times); }
    });
    keybinding.bindCommand({ win: "Right", mac: "Right|Ctrl-F" }, "gotoright");

    gcli.addCommand({
        name: "selectpagedown",
        exec: function(env, args) { env.editor.selectPageDown(); }
    });
    keybinding.bindCommand({ win: "Shift-PageDown", mac: "Shift-PageDown" }, "selectpagedown");

    gcli.addCommand({
        name: "pagedown",
        exec: function(env, args) { env.editor.scrollPageDown(); }
    });
    keybinding.bindCommand({ win: null, mac: "PageDown" }, "pagedown");

    gcli.addCommand({
        name: "gotopagedown",
        exec: function(env, args) { env.editor.gotoPageDown(); }
    });
    keybinding.bindCommand({ win: "PageDown", mac: "Option-PageDown|Ctrl-V" }, "gotopagedown");

    gcli.addCommand({
        name: "selectpageup",
        exec: function(env, args) { env.editor.selectPageUp(); }
    });
    keybinding.bindCommand({ win: "Shift-PageUp", mac: "Shift-PageUp" }, "selectpageup");

    gcli.addCommand({
        name: "pageup",
        exec: function(env, args) { env.editor.scrollPageUp(); }
    });
    keybinding.bindCommand({ win: null, mac: "PageUp" }, "pageup");

    gcli.addCommand({
        name: "gotopageup",
        exec: function(env, args) { env.editor.gotoPageUp(); }
    });
    keybinding.bindCommand({ win: "PageUp", mac: "Option-PageUp" }, "gotopageup");

    gcli.addCommand({
        name: "selectlinestart",
        exec: function(env, args) { env.editor.getSelection().selectLineStart(); }
    });
    keybinding.bindCommand({ win: "Shift-Home", mac: "Shift-Home" }, "selectlinestart");

    gcli.addCommand({
        name: "selectlineend",
        exec: function(env, args) { env.editor.getSelection().selectLineEnd(); }
    });
    keybinding.bindCommand({ win: "Shift-End", mac: "Shift-End" }, "selectlineend");

    gcli.addCommand({
        name: "del",
        exec: function(env, args) { env.editor.removeRight(); }
    });
    keybinding.bindCommand({ win: "Delete", mac: "Delete|Ctrl-D" }, "del");

    gcli.addCommand({
        name: "backspace",
        exec: function(env, args) { env.editor.removeLeft(); }
    });
    keybinding.bindCommand({
        win: "Ctrl-Backspace|Command-Backspace|Option-Backspace|Shift-Backspace|Backspace",
        mac: "Ctrl-Backspace|Command-Backspace|Shift-Backspace|Backspace|Ctrl-H"
    }, "backspace");

    gcli.addCommand({
        name: "removetolinestart",
        exec: function(env, args) { env.editor.removeToLineStart(); }
    });
    keybinding.bindCommand({ win: null, mac: "Option-Backspace" }, "removetolinestart");

    gcli.addCommand({
        name: "removetolineend",
        exec: function(env, args) { env.editor.removeToLineEnd(); }
    });
    keybinding.bindCommand({ win: null, mac: "Ctrl-K" }, "removetolineend");

    gcli.addCommand({
        name: "removewordleft",
        exec: function(env, args) { env.editor.removeWordLeft(); }
    });
    keybinding.bindCommand({ win: null, mac: "Alt-Backspace|Ctrl-Alt-Backspace" }, "removewordleft");

    gcli.addCommand({
        name: "removewordright",
        exec: function(env, args) { env.editor.removeWordRight(); }
    });
    keybinding.bindCommand({ win: null, mac: "Alt-Delete" }, "removewordright");

    gcli.addCommand({
        name: "outdent",
        exec: function(env, args) { env.editor.blockOutdent(); }
    });
    keybinding.bindCommand({ win: "Shift-Tab", mac: "Shift-Tab" }, "outdent");

    gcli.addCommand({
        name: "indent",
        exec: function(env, args) { env.editor.indent(); }
    });
    keybinding.bindCommand({ win: "Tab", mac: "Tab" }, "indent");

    gcli.addCommand({
        name: "inserttext",
        exec: function(env, args) {
            env.editor.insert(lang.stringRepeat(args.text  || "", args.times || 1));
        }
    });

    gcli.addCommand({
        name: "centerselection",
        exec: function(env, args) { env.editor.centerSelection(); }
    });
    keybinding.bindCommand({ win: null, mac: "Ctrl-L" }, "centerselection");

    gcli.addCommand({
        name: "splitline",
        exec: function(env, args) { env.editor.splitLine(); }
    });
    keybinding.bindCommand({ win: null, mac: "Ctrl-O" }, "splitline");

    gcli.addCommand({
        name: "transposeletters",
        exec: function(env, args) { env.editor.transposeLetters(); }
    });
    keybinding.bindCommand({ win: "Ctrl-T", mac: "Ctrl-T" }, "transposeletters");
};


exports.shutdown = function() {
    // TODO: unregister commands
};


});
