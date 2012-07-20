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
"use strict";

var event = require("../lib/event");

var DragdropHandler = function(mouseHandler) {
    var editor = mouseHandler.editor;
    var dragSelectionMarker, x, y;
    var timerId, range, isBackwards;
    var dragCursor, counter = 0;

    var mouseTarget = editor.container;
    event.addListener(mouseTarget, "dragenter", function(e) {
        counter++;
        if (!dragSelectionMarker) {
            range = editor.getSelectionRange();
            isBackwards = editor.selection.isBackwards();
            var style = editor.getSelectionStyle();
            dragSelectionMarker = editor.session.addMarker(range, "ace_selection", style);
            editor.clearSelection();
            clearInterval(timerId);
            timerId = setInterval(onDragInterval, 20);
        }
        return event.preventDefault(e);
    });

    event.addListener(mouseTarget, "dragover", function(e) {
        x = e.clientX;
        y = e.clientY;
        return event.preventDefault(e);
    });
    
    var onDragInterval =  function() {
        dragCursor = editor.renderer.screenToTextCoordinates(x, y);
        editor.moveCursorToPosition(dragCursor);
        editor.renderer.scrollCursorIntoView();
    };
    
    event.addListener(mouseTarget, "dragleave", function(e) {
        counter--;
        if (counter > 0)
            return;
        console.log(e.type, counter,e.target);
        clearInterval(timerId);
        editor.session.removeMarker(dragSelectionMarker);
        dragSelectionMarker = null;
        editor.selection.setSelectionRange(range, isBackwards);
        return event.preventDefault(e);
    });
    
    event.addListener(mouseTarget, "drop", function(e) {
        console.log(e.type, counter,e.target);
        counter = 0;
        clearInterval(timerId);
        editor.session.removeMarker(dragSelectionMarker);
        dragSelectionMarker = null;

        range.end = editor.session.insert(dragCursor, e.dataTransfer.getData('Text'));
        range.start = dragCursor;
        editor.focus();
        editor.selection.setSelectionRange(range);
        return event.preventDefault(e);
    });

};

exports.DragdropHandler = DragdropHandler;
});
