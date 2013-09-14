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

function DragdropHandler(mouseHandler) {

    var editor = mouseHandler.editor;

    // Safari accepts either image or element (but it must present in the DOM)
    var proxy = dom.createElement("img");
    // Safari crashes without image data
    proxy.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

    if (useragent.isOpera) {
        proxy.style.cssText = "width:1px;height:1px;position:fixed;top:0;left:0;z-index:2147483647;opacity:0;visibility:hidden";
        editor.container.appendChild(proxy);
    }

    var exports = ["dragWait", "dragWaitEnd", "startDrag", "dragReadyEnd"];

     exports.forEach(function(x) {
         mouseHandler[x] = this[x];
    }, this);
    editor.addEventListener("mousedown", this.onMouseDown.bind(mouseHandler));


    var mouseTarget = editor.container;
    var dragSelectionMarker, x, y;
    var timerId, range;
    var dragCursor, counter = 0;
    var dragOperation;

    this.onDragStart = function(e) {
        // webkit workaround, see this.onMouseDown
        if (this.cancelDrag || !mouseTarget.draggable) {
            var self = this;
            setTimeout(function(){
                self.startSelect();
                self.captureMouse(e);
            }, 0);
            return e.preventDefault();
        }
        if (useragent.isOpera) {
            proxy.style.visibility = "visible";
            setTimeout(function(){
                proxy.style.visibility = "hidden";
            }, 0);
        }
        range = editor.getSelectionRange();

        var dataTransfer = e.dataTransfer;
        dataTransfer.effectAllowed = editor.getReadOnly() ? "copy" : "copyMove";
        dataTransfer.setDragImage && dataTransfer.setDragImage(proxy, 0, 0);
        dataTransfer.setData("Text", editor.session.getTextRange());

        this.setState("drag");
    };

    this.onDragEnd = function(e) {
        mouseTarget.draggable = false;
        this.setState(null);
        if (!editor.getReadOnly()) {
            var dropEffect = e.dataTransfer.dropEffect;
            if (!dragOperation && dropEffect == "move")
                // text was dragged outside the editor
                editor.session.remove(editor.getSelectionRange());
            editor.renderer.$cursorLayer.setBlinking(true);
        }
        this.editor.unsetStyle("ace_dragging");
    };

    this.onDragEnter = function(e) {
        if (editor.getReadOnly() || !canAccept(e.dataTransfer))
            return;
        if (!dragSelectionMarker)
            addDragMarker();
        counter++;
        // dataTransfer object does not save dropEffect across events on IE, so we store it in dragOperation
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
        var isInternal = this.state == "drag";
        if (isInternal) {
            switch (dragOperation) {
                case "move":
                    if (range.contains(dragCursor.row, dragCursor.column)) {
                        // clear selection
                        range = {
                            start: dragCursor,
                            end: dragCursor
                        };
                    } else {
                        // move text
                        range = editor.moveText(range, dragCursor);
                    }
                    break;
                case "copy":
                    // copy text
                    range = editor.moveText(range, dragCursor, true);
                    break;
            }
        } else {
            var dropData = dataTransfer.getData('Text');
            range = {
                start: dragCursor,
                end: editor.session.insert(dragCursor, dropData)
            };
            editor.focus();
            dragOperation = null;
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
        var lineHeight = editor.renderer.layerConfig.lineHeight;
        var characterWidth = editor.renderer.layerConfig.characterWidth;
        var editorRect = editor.renderer.scroller.getBoundingClientRect();
        var offsets = {
           x: {
               left: x - editorRect.left,
               right: editorRect.right - x
           },
           y: {
               top: y - editorRect.top,
               bottom: editorRect.bottom - y
           }
        };
        var nearestXOffset = Math.min(offsets.x.left, offsets.x.right);
        var nearestYOffset = Math.min(offsets.y.top, offsets.y.bottom);
        var scrollCursor = {row: dragCursor.row, column: dragCursor.column};
        if (nearestXOffset / characterWidth <= 2) {
            scrollCursor.column += (offsets.x.left < offsets.x.right ? -3 : +2);
        }
        if (nearestYOffset / lineHeight <= 1) {
            scrollCursor.row += (offsets.y.top < offsets.y.bottom ? -1 : +1);
        }
        editor.moveCursorToPosition(dragCursor);
        editor.renderer.scrollCursorIntoView(scrollCursor);
    }

    function addDragMarker() {
        range = editor.selection.toOrientedRange();
        dragSelectionMarker = editor.session.addMarker(range, "ace_selection", editor.getSelectionStyle());
        editor.clearSelection();
        clearInterval(timerId);
        timerId = setInterval(onDragInterval, 20);
        counter = 0;
        event.addListener(document, "mousemove", onMouseMove);
    }

    function clearDragMarker() {
        clearInterval(timerId);
        editor.session.removeMarker(dragSelectionMarker);
        dragSelectionMarker = null;
        editor.$blockScrolling += 1;
        editor.selection.fromOrientedRange(range);
        editor.$blockScrolling -= 1;
        range = null;
        counter = 0;
        event.removeListener(document, "mousemove", onMouseMove);
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
        var effectAllowed = "uninitialized";
        try {
            effectAllowed = e.dataTransfer.effectAllowed.toLowerCase();
        } catch (e) {}
        var dropEffect = "none";

        if (copyModifierState && copyAllowed.indexOf(effectAllowed) >= 0)
            dropEffect = "copy";
        else if (moveAllowed.indexOf(effectAllowed) >= 0)
            dropEffect = "move";
        else if (copyAllowed.indexOf(effectAllowed) >= 0)
            dropEffect = "copy";

        return dropEffect;
    }
}

(function() {

    this.dragWait = function() {
        var editor = this.editor;
        var distance = calcDistance(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
        var interval = (new Date()).getTime() - this.mousedownEvent.time;

        if (distance > 0)
            this.startSelect(this.mousedownEvent.getDocumentPosition());
        else if (interval > editor.getDragDelay())
            this.startDrag();
    };

    this.dragWaitEnd = function() {
        this.startSelect(this.mousedownEvent.getDocumentPosition(), true);
        this.selectEnd();
    };

    this.startDrag = function(){
        var target = this.editor.container;
        this.setState("dragReady");
        this.editor.renderer.$cursorLayer.setBlinking(false);
        target.draggable = true;
        this.editor.setStyle("ace_dragging");
        if (useragent.isIE) {
            // IE does not handle [draggable] attribute set after mousedown
            event.addListener(target, "mousemove", forceDragIE);
        }
    };

    this.dragReadyEnd = function(e) {
        var target = this.editor.container;
        target.draggable = false;
        this.editor.unsetStyle("ace_dragging");
        if (useragent.isIE) {
            event.removeListener(target, "mousemove", forceDragIE);
        }
        this.editor.renderer.$cursorLayer.setBlinking(!this.editor.getReadOnly());
        this.startSelect(this.mousedownEvent.getDocumentPosition(), true);
        this.selectEnd();
    };

    this.onMouseDown = function(e) {
        if (!this.$dragEnabled)
            return;
        var inSelection = e.inSelection();
        var editor = this.editor;
        this.mousedownEvent = e;

        var button = e.getButton();
        if (button === 0 && inSelection) {
            this.mousedownEvent.time = (new Date()).getTime();
            if (editor.getDragDelay()) {
                // https://code.google.com/p/chromium/issues/detail?id=286700
                if (useragent.isWebKit) {
                    var self = this;
                    self.cancelDrag = true;
                    var mouseTarget = editor.container;
                    mouseTarget.draggable = true;
                    setTimeout(function(){
                        self.cancelDrag = false;
                        mouseTarget.draggable = false;
                    }, 8);
                }
                this.captureMouse(e, "dragWait");
            } else {
                this.startDrag();
                this.captureMouse(e);
            }

            if (useragent.isOpera) {
                var cancelSelection = function(e){
                    document.getSelection().removeAllRanges();
                    editor.container.removeEventListener("mousemove", cancelSelection);
                };
                editor.container.addEventListener("mousemove", cancelSelection);
            }
            // TODO: a better way to prevent default handler without preventing browser default action
            e.defaultPrevented = true;
        }
    };

    function forceDragIE() {
        event.removeListener(this, "mousemove", forceDragIE);
        this.dragDrop();
    }

    function calcDistance(ax, ay, bx, by) {
        return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
    }
}).call(DragdropHandler.prototype);

exports.DragdropHandler = DragdropHandler;

});