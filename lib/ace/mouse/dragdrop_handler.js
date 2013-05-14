/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

var dom = require("../lib/dom");
var event = require("../lib/event");
var useragent = require("../lib/useragent");

// Safari accepts either image or element (but it must present in the DOM)
var proxy = dom.createElement('img');
// Safari crashes without image data
proxy.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

function DragdropHandler(mouseHandler) {

    var editor = mouseHandler.editor;

    if (useragent.isOpera) {
        proxy.style.cssText = 'width:1px;height:1px;position:fixed;top:0;z-index:-1';
        editor.container.appendChild(proxy);
    }

    var exports = ["dragWait", "dragWaitEnd", "startDrag"];
 
     exports.forEach(function(x) {
         mouseHandler[x] = this[x];
    }, this);

    var mouseTarget = editor.renderer.getMouseEventTarget();
    editor.addEventListener("mousedown", this.onMouseDown.bind(mouseHandler));

    var dragSelectionMarker, x, y;
    var timerId, range;
    var dragCursor, counter = 0;
    var dragOperation;

    this.onDragStart = function(e) {
        this.isDragWait = false;

        var dataTransfer = e.dataTransfer;
        range = editor.getSelectionRange();

        dataTransfer.effectAllowed = "copyMove";
        dataTransfer.setDragImage && dataTransfer.setDragImage(proxy, 0, 0);
        dataTransfer.setData("Text", editor.session.getTextRange());

        editor.renderer.$cursorLayer.setBlinking(false);
        this.setState("drag");
    };

    this.onDragEnd = function(e) {
        mouseTarget.draggable = false;
        var dropEffect = e.dataTransfer.dropEffect;
        if (!dragOperation && dropEffect == "move")
            editor.session.remove(editor.getSelectionRange());
        editor.renderer.$cursorLayer.setBlinking(true);
        this.setState("null");
    }

    this.onDragEnter = function(e) {
        if (editor.getReadOnly() || !canAccept(e.dataTransfer))
            return;
        if (!dragSelectionMarker)
            addDragMarker();
        counter++;

        e.dataTransfer.dropEffect = dragOperation = getDropEffect(e);
        return event.preventDefault(e);
    };

    this.onDragOver = function(e) {
        if (editor.getReadOnly() || !canAccept(e.dataTransfer))
            return;
        // Opera doesn't trigger dragenter event on drag start
        if (!dragSelectionMarker) {
            addDragMarker();
            counter++;
        }
        if (onMouseMoveTimer !== null)
            onMouseMoveTimer = null;
        x = e.clientX;
        y = e.clientY;

        e.dataTransfer.dropEffect = dragOperation = getDropEffect(e);
        return event.preventDefault(e);
    };

    this.onDragLeave = function(e) {
        counter--;
        if (counter <= 0 && dragSelectionMarker) {
            clearDragMarker();
            dragOperation = null;
            return event.preventDefault(e);
        }
    };

    this.onDrop = function(e) {
        if (!dragSelectionMarker)
            return;
        var dataTransfer = e.dataTransfer;
        if (this.state !== "drag") {
            var dropData = dataTransfer.getData('Text');
            range = {
                start: dragCursor,
                end: editor.session.insert(dragCursor, dropData)
            };
            editor.focus();
            dragOperation = null;
        } else {
            if (dragOperation == "move"){
                if (range.contains(dragCursor.row, dragCursor.column)) {
                    range = {
                        start: dragCursor,
                        end: dragCursor
                    };
                } else {
                    range = editor.moveText(range, dragCursor);
                }
            } else {
                range = editor.moveText(range, dragCursor, true);
            }
        }
        clearDragMarker();
        return event.preventDefault(e);
    };

    event.addListener(mouseTarget, "dragstart", this.onDragStart.bind(mouseHandler));
    event.addListener(mouseTarget, "dragend", this.onDragEnd.bind(mouseHandler));
    event.addListener(mouseTarget, "dragenter", this.onDragEnter.bind(mouseHandler));
    event.addListener(mouseTarget, "dragover", this.onDragOver.bind(mouseHandler));
    event.addListener(mouseTarget, "dragleave", this.onDragLeave.bind(mouseHandler));
    event.addListener(mouseTarget, "drop", this.onDrop.bind(mouseHandler));

    function onDragInterval() {
        dragCursor = editor.renderer.screenToTextCoordinates(x, y);
        editor.moveCursorToPosition(dragCursor);
        editor.renderer.scrollCursorIntoView();
    }

    function addDragMarker() {
        range = editor.selection.toOrientedRange();
        dragSelectionMarker = editor.session.addMarker(range, "ace_selection", editor.getSelectionStyle());
        editor.clearSelection();
        clearInterval(timerId);
        timerId = setInterval(onDragInterval, 20);
        counter = 0;
        event.addListener(document, "mousemove", onMouseMove);
        editor.setStyle("ace_dragging");
    }

    function clearDragMarker() {
        clearInterval(timerId);
        editor.session.removeMarker(dragSelectionMarker);
        dragSelectionMarker = null;
        editor.selection.fromOrientedRange(range);
        range = null;
        counter = 0;
        event.removeListener(document, "mousemove", onMouseMove);
        editor.unsetStyle("ace_dragging");
    }

    // sometimes other code on the page can stop dragleave event leaving editor stuck in the drag state
    var onMouseMoveTimer = null;
    function onMouseMove() {
        if (onMouseMoveTimer == null) {
            onMouseMoveTimer = setTimeout(function() {
                if (onMouseMoveTimer != null && dragSelectionMarker)
                    clearDragMarker();
            }, 20);
        }
    }

    function canAccept(dataTransfer) {
        var types = dataTransfer.types;
        return !types || Array.prototype.some.call(types, function(type) {
            return type == 'text/plain' || type == 'Text';
        });
    }

    function getDropEffect(e) {
        var copyAllowed = ['copy', 'copymove', 'all', 'uninitialized'];
        var moveAllowed = ['move', 'copymove', 'linkmove', 'all', 'uninitialized'];

        var copyModifierState = useragent.isMac ? e.altKey : e.ctrlKey;

        // IE throws error while dragging from another app
        try{
            var effectAllowed = e.dataTransfer.effectAllowed.toLowerCase();
        } catch (e) {
            var effectAllowed = "uninitialized";
        }
        var dropEffect = "none";

        if (copyModifierState && copyAllowed.indexOf(effectAllowed) >= 0)
            dropEffect = "copy";
        else if (moveAllowed.indexOf(effectAllowed) >= 0)
            dropEffect = "move"
        else if (copyAllowed.indexOf(effectAllowed) >= 0)
            dropEffect = "copy";

        return dropEffect;
    }
}

(function() {

    this.dragWait = function(e) {
        if (this.isDragWait)
            return;

        var editor = this.editor;
        var distance = calcDistance(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
        var interval = (new Date()).getTime() - this.mousedownEvent.time;

        if (distance > 0)
            this.startSelect();
        else if (interval > editor.getDragDelay())
            this.startDrag();
    };

    this.dragWaitEnd = function(e) {
        this.isDragWait = false;
        var editor = this.editor;
        var target = editor.renderer.getMouseEventTarget();
        this.mousedownEvent.domEvent = e;
        dom.removeCssClass(editor.container, "ace_dragging");

        if (typeof target.draggable !== "undefined")
            target.draggable = false;

        this.startSelect();
    };

    this.startDrag = function(){
        this.isDragWait = true;
        var editor = this.editor;
        var target = editor.renderer.getMouseEventTarget();

        target.draggable = true;
        if (target.dragDrop)
            target.dragDrop();
    };

    this.onMouseDown = function(e) {
        var inSelection = e.inSelection();
        var pos = e.getDocumentPosition();
        this.mousedownEvent = e;
        var editor = this.editor;

        var button = e.getButton();
        if (button === 0 && inSelection) {
            this.mousedownEvent.time = (new Date()).getTime();
            this.setState("dragWait");
            this.captureMouse(e);

            if (useragent.isOpera) {
                var cancelSelection = function(e){
                    document.getSelection().removeAllRanges();
                    editor.container.removeEventListener("mousemove", cancelSelection);
                };
                editor.container.addEventListener("mousemove", cancelSelection);
            }
            e.defaultPrevented = true;
        }
    }

    function calcDistance(ax, ay, bx, by) {
        return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
    }
}).call(DragdropHandler.prototype);

exports.DragdropHandler = DragdropHandler;

});