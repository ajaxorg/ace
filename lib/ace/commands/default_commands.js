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
        bindKey: { win: "Ctrl-A", mac: "Command-A" },
        exec: function(env, args) { env.editor.selectAll(); }
    });
    gcli.addCommand({
        name: "removeline",
        bindKey: { win: "Ctrl-D", mac: "Command-D" },
        exec: function(env, args) { env.editor.removeLines(); }
    });
    gcli.addCommand({
        name: "gotoline",
        description: "Move the cursor to the given line",
        bindKey: { win: "Ctrl-L", mac: "Command-L" },
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
    gcli.addCommand({
        name: "togglecomment",
        bindKey: { win: "Ctrl-7", mac: "Command-7" },
        exec: function(env, args) { env.editor.toggleCommentLines(); }
    });
    gcli.addCommand({
        name: "findnext",
        bindKey: { win: "Ctrl-K", mac: "Command-G" },
        exec: function(env, args) { env.editor.findNext(); }
    });
    gcli.addCommand({
        name: "findprevious",
        bindKey: { win: "Ctrl-Shift-K", mac: "Command-Shift-G" },
        exec: function(env, args) { env.editor.findPrevious(); }
    });
    gcli.addCommand({
        name: "find",
        description: "Search for the next instance of a string",
        bindKey: { win: "Ctrl-F", mac: "Command-F" },
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
    gcli.addCommand({
        name: "replace",
        description: "Replace the next instance of a string with a given replacement",
        bindKey: { win: "Ctrl-R", mac: "Command-Option-F" },
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
    gcli.addCommand({
        name: "replaceall",
        description: "Replace all instances of a string with a given replacement",
        bindKey: { win: "Ctrl-Shift-R", mac: "Command-Shift-Option-F" },
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
    gcli.addCommand({
        name: "undo",
        bindKey: { win: "Ctrl-Z", mac: "Command-Z" },
        exec: function(env, args) { env.editor.undo(); }
    });
    gcli.addCommand({
        name: "redo",
        bindKey: { win: "Ctrl-Shift-Z|Ctrl-Y", mac: "Command-Shift-Z|Command-Y" },
        exec: function(env, args) { env.editor.redo(); }
    });
    gcli.addCommand({
        name: "overwrite",
        bindKey: { win: "Insert", mac: "Insert" },
        exec: function(env, args) { env.editor.toggleOverwrite(); }
    });
    gcli.addCommand({
        name: "copylinesup",
        bindKey: { win: "Ctrl-Alt-Up", mac: "Command-Option-Up" },
        exec: function(env, args) { env.editor.copyLinesUp(); }
    });
    gcli.addCommand({
        name: "movelinesup",
        bindKey: { win: "Alt-Up", mac: "Option-Up" },
        exec: function(env, args) { env.editor.moveLinesUp(); }
    });
    gcli.addCommand({
        name: "selecttostart",
        bindKey: { win: "Alt-Shift-Up", mac: "Command-Shift-Up" },
        exec: function(env, args) { env.editor.getSelection().selectFileStart(); }
    });
    gcli.addCommand({
        name: "gotostart",
        bindKey: { win: "Ctrl-Home|Ctrl-Up", mac: "Command-Home|Command-Up" },
        exec: function(env, args) { env.editor.navigateFileStart(); }
    });
    gcli.addCommand({
        name: "selectup",
        bindKey: { win: "Shift-Up", mac: "Shift-Up" },
        exec: function(env, args) { env.editor.getSelection().selectUp(); }
    });
    gcli.addCommand({
        name: "golineup",
        bindKey: { win: "Up", mac: "Up|Ctrl-P" },
        exec: function(env, args) { env.editor.navigateUp(args.times); }
    });
    gcli.addCommand({
        name: "copylinesdown",
        bindKey: { win: "Ctrl-Alt-Down", mac: "Command-Option-Down" },
        exec: function(env, args) { env.editor.copyLinesDown(); }
    });
    gcli.addCommand({
        name: "movelinesdown",
        bindKey: { win: "Alt-Down", mac: "Option-Down" },
        exec: function(env, args) { env.editor.moveLinesDown(); }
    });
    gcli.addCommand({
        name: "selecttoend",
        bindKey: { win: "Alt-Shift-Down", mac: "Command-Shift-Down" },
        exec: function(env, args) { env.editor.getSelection().selectFileEnd(); }
    });
    gcli.addCommand({
        name: "gotoend",
        bindKey: { win: "Ctrl-End|Ctrl-Down", mac: "Command-End|Command-Down" },
        exec: function(env, args) { env.editor.navigateFileEnd(); }
    });
    gcli.addCommand({
        name: "selectdown",
        bindKey: { win: "Shift-Down", mac: "Shift-Down" },
        exec: function(env, args) { env.editor.getSelection().selectDown(); }
    });
    gcli.addCommand({
        name: "golinedown",
        bindKey: { win: "Down", mac: "Down|Ctrl-N" },
        exec: function(env, args) { env.editor.navigateDown(args.times); }
    });
    gcli.addCommand({
        name: "selectwordleft",
        bindKey: { win: "Ctrl-Shift-Left", mac: "Option-Shift-Left" },
        exec: function(env, args) { env.editor.getSelection().selectWordLeft(); }
    });
    gcli.addCommand({
        name: "gotowordleft",
        bindKey: { win: "Ctrl-Left", mac: "Option-Left" },
        exec: function(env, args) { env.editor.navigateWordLeft(); }
    });
    gcli.addCommand({
        name: "selecttolinestart",
        bindKey: { win: "Alt-Shift-Left", mac: "Command-Shift-Left" },
        exec: function(env, args) { env.editor.getSelection().selectLineStart(); }
    });
    gcli.addCommand({
        name: "gotolinestart",
        bindKey: { win: "Alt-Left|Home", mac: "Command-Left|Home|Ctrl-A" },
        exec: function(env, args) { env.editor.navigateLineStart(); }
    });
    gcli.addCommand({
        name: "selectleft",
        bindKey: { win: "Shift-Left", mac: "Shift-Left" },
        exec: function(env, args) { env.editor.getSelection().selectLeft(); }
    });
    gcli.addCommand({
        name: "gotoleft",
        bindKey: { win: "Left", mac: "Left|Ctrl-B" },
        exec: function(env, args) { env.editor.navigateLeft(args.times); }
    });
    gcli.addCommand({
        name: "selectwordright",
        bindKey: { win: "Ctrl-Shift-Right", mac: "Option-Shift-Right" },
        exec: function(env, args) { env.editor.getSelection().selectWordRight(); }
    });
    gcli.addCommand({
        name: "gotowordright",
        bindKey: { win: "Ctrl-Right", mac: "Option-Right" },
        exec: function(env, args) { env.editor.navigateWordRight(); }
    });
    gcli.addCommand({
        name: "selecttolineend",
        bindKey: { win: "Alt-Shift-Right", mac: "Command-Shift-Right" },
        exec: function(env, args) { env.editor.getSelection().selectLineEnd(); }
    });
    gcli.addCommand({
        name: "gotolineend",
        bindKey: { win: "Alt-Right|End", mac: "Command-Right|End|Ctrl-E" },
        exec: function(env, args) { env.editor.navigateLineEnd(); }
    });
    gcli.addCommand({
        name: "selectright",
        bindKey: { win: "Shift-Right", mac: "Shift-Right" },
        exec: function(env, args) { env.editor.getSelection().selectRight(); }
    });
    gcli.addCommand({
        name: "gotoright",
        bindKey: { win: "Right", mac: "Right|Ctrl-F" },
        exec: function(env, args) { env.editor.navigateRight(args.times); }
    });
    gcli.addCommand({
        name: "selectpagedown",
        bindKey: { win: "Shift-PageDown", mac: "Shift-PageDown" },
        exec: function(env, args) { env.editor.selectPageDown(); }
    });
    gcli.addCommand({
        name: "pagedown",
        bindKey: { win: null, mac: "PageDown" },
        exec: function(env, args) { env.editor.scrollPageDown(); }
    });
    gcli.addCommand({
        name: "gotopagedown",
        bindKey: { win: "PageDown", mac: "Option-PageDown|Ctrl-V" },
        exec: function(env, args) { env.editor.gotoPageDown(); }
    });
    gcli.addCommand({
        name: "selectpageup",
        bindKey: { win: "Shift-PageUp", mac: "Shift-PageUp" },
        exec: function(env, args) { env.editor.selectPageUp(); }
    });
    gcli.addCommand({
        name: "pageup",
        bindKey: { win: null, mac: "PageUp" },
        exec: function(env, args) { env.editor.scrollPageUp(); }
    });
    gcli.addCommand({
        name: "gotopageup",
        bindKey: { win: "PageUp", mac: "Option-PageUp" },
        exec: function(env, args) { env.editor.gotoPageUp(); }
    });
    gcli.addCommand({
        name: "selectlinestart",
        bindKey: { win: "Shift-Home", mac: "Shift-Home" },
        exec: function(env, args) { env.editor.getSelection().selectLineStart(); }
    });
    gcli.addCommand({
        name: "selectlineend",
        bindKey: { win: "Shift-End", mac: "Shift-End" },
        exec: function(env, args) { env.editor.getSelection().selectLineEnd(); }
    });
    gcli.addCommand({
        name: "del",
        bindKey: { win: "Delete", mac: "Delete|Ctrl-D" },
        exec: function(env, args) { env.editor.removeRight(); }
    });
    gcli.addCommand({
        name: "backspace",
        bindKey: {
            win: "Ctrl-Backspace|Command-Backspace|Option-Backspace|Shift-Backspace|Backspace",
            mac: "Ctrl-Backspace|Command-Backspace|Shift-Backspace|Backspace|Ctrl-H"
        },
        exec: function(env, args) { env.editor.removeLeft(); }
    });
    gcli.addCommand({
        name: "removetolinestart",
        bindKey: { win: null, mac: "Option-Backspace" },
        exec: function(env, args) { env.editor.removeToLineStart(); }
    });
    gcli.addCommand({
        name: "removetolineend",
        bindKey: { win: null, mac: "Ctrl-K" },
        exec: function(env, args) { env.editor.removeToLineEnd(); }
    });
    gcli.addCommand({
        name: "removewordleft",
        bindKey: { win: null, mac: "Alt-Backspace|Ctrl-Alt-Backspace" },
        exec: function(env, args) { env.editor.removeWordLeft(); }
    });
    gcli.addCommand({
        name: "removewordright",
        bindKey: { win: null, mac: "Alt-Delete" },
        exec: function(env, args) { env.editor.removeWordRight(); }
    });
    gcli.addCommand({
        name: "outdent",
        bindKey: { win: "Shift-Tab", mac: "Shift-Tab" },
        exec: function(env, args) { env.editor.blockOutdent(); }
    });
    gcli.addCommand({
        name: "indent",
        bindKey: { win: "Tab", mac: "Tab" },
        exec: function(env, args) { env.editor.indent(); }
    });
    gcli.addCommand({
        name: "inserttext",
        exec: function(env, args) {
            env.editor.insert(lang.stringRepeat(args.text  || "", args.times || 1));
        }
    });
    gcli.addCommand({
        name: "centerselection",
        bindKey: { win: null, mac: "Ctrl-L" },
        exec: function(env, args) { env.editor.centerSelection(); }
    });
    gcli.addCommand({
        name: "splitline",
        bindKey: { win: null, mac: "Ctrl-O" },
        exec: function(env, args) { env.editor.splitLine(); }
    });
    gcli.addCommand({
        name: "transposeletters",
        bindKey: { win: "Ctrl-T", mac: "Ctrl-T" },
        exec: function(env, args) { env.editor.transposeLetters(); }
    });
};


exports.shutdown = function() {
    // TODO: unregister commands
};


});
