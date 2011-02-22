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
    "selectall": "Ctrl-A",
    "removeline": "Ctrl-D",
    "gotoline": "Ctrl-L",
    "togglecomment": "Ctrl-7",
    "findnext": "Ctrl-K",
    "findprevious": "Ctrl-Shift-K",
    "find": "Ctrl-F",
    "replace": "Alt-Ctrl-R",
    "undo": "Ctrl-Z",
    "redo": "Ctrl-Shift-Z|Ctrl-Y",
    "overwrite": "Insert",
    "copylinesup": "Ctrl-Alt-Up",
    "movelinesup": "Alt-Up",
    "selecttostart": "Alt-Shift-Up",
    "gotostart": "Ctrl-Home|Ctrl-Up",
    "selectup": "Shift-Up",
    "golineup": "Up",
    "copylinesdown": "Ctrl-Alt-Down",
    "movelinesdown": "Alt-Down",
    "selecttoend": "Alt-Shift-Down",
    "gotoend": "Ctrl-End|Ctrl-Down",
    "selectdown": "Shift-Down",
    "golinedown": "Down",
    "selectwordleft": "Ctrl-Shift-Left",
    "gotowordleft": "Ctrl-Left",
    "selecttolinestart": "Alt-Shift-Left",
    "gotolinestart": "Alt-Left|Home",
    "selectleft": "Shift-Left",
    "gotoleft": "Left",
    "selectwordright": "Ctrl-Shift-Right",
    "gotowordright": "Ctrl-Right",
    "selecttolineend": "Alt-Shift-Right",
    "gotolineend": "Alt-Right|End",
    "selectright": "Shift-Right",
    "gotoright": "Right",
    "selectpagedown": "Shift-PageDown",
    "gotopagedown": "PageDown",
    "selectpageup": "Shift-PageUp",
    "gotopageup": "PageUp",
    "selectlinestart": "Shift-Home",
    "selectlineend": "Shift-End",
    "del": "Delete",
    "backspace": "Ctrl-Backspace|Command-Backspace|Option-Backspace|Shift-Backspace|Backspace",
    "outdent": "Shift-Tab",
    "indent": "Tab"
};

});
