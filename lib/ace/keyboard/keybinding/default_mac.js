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
 * Ajax.org B.V.
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

exports.bindings = {
    "selectall": "Command-A",
    "removeline": "Command-D",
    "gotoline": "Command-L",
    "togglecomment": "Command-7",
    "findnext": "Command-G",
    "findprevious": "Command-Shift-G",
    "find": "Command-F",
    "replace": "Alt-Command-R",
    "undo": "Command-Z",
    "redo": "Command-Shift-Z|Command-Y",
    "overwrite": "Insert",
    "copylinesup": "Command-Option-Up",
    "movelinesup": "Option-Up",
    "selecttostart": "Command-Shift-Up",
    "gotostart": "Command-Home|Command-Up",
    "selectup": "Shift-Up",
    "golineup": "Up|Ctrl-P",
    "copylinesdown": "Command-Option-Down",
    "movelinesdown": "Option-Down",
    "selecttoend": "Command-Shift-Down",
    "gotoend": "Command-End|Command-Down",
    "selectdown": "Shift-Down",
    "golinedown": "Down|Ctrl-N",
    "selectwordleft": "Option-Shift-Left",
    "gotowordleft": "Option-Left",
    "selecttolinestart": "Command-Shift-Left",
    "gotolinestart": "Command-Left|Home|Ctrl-A",
    "selectleft": "Shift-Left",
    "gotoleft": "Left|Ctrl-B",
    "selectwordright": "Option-Shift-Right",
    "gotowordright": "Option-Right",
    "selecttolineend": "Command-Shift-Right",
    "gotolineend": "Command-Right|End|Ctrl-E",
    "selectright": "Shift-Right",
    "gotoright": "Right|Ctrl-F",
    "selectpagedown": "Shift-PageDown",
    "pagedown": "PageDown",
    "gotopagedown": "Option-PageDown|Ctrl-V",
    "selectpageup": "Shift-PageUp",
    "pageup": "PageUp",
    "gotopageup": "Option-PageUp",
    "selectlinestart": "Shift-Home",
    "selectlineend": "Shift-End",
    "del": "Delete|Ctrl-D",
    "backspace": "Ctrl-Backspace|Command-Backspace|Shift-Backspace|Backspace|Ctrl-H",
    "removetolineend": "Ctrl-K",
    "removetolinestart": "Option-Backspace",
    "removewordleft": "Alt-Backspace|Ctrl-Alt-Backspace",
    "removewordright": "Alt-Delete",
    "outdent": "Shift-Tab",
    "indent": "Tab",
    "transposeletters": "Ctrl-T",
    "splitline": "Ctrl-O",
    "centerselection": "Ctrl-L"
};

});