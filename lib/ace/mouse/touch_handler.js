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

var MouseEvent = require("./mouse_event").MouseEvent;

exports.addTouchListeners = function(el, editor) {
    var mode = "scroll";
    var startX;
    var startY;
    var touchStartT;
    var lastT;
    var longTouchTimer;
    var animationTimer;
    var animationSteps = 0;
    var pos;
    var clickCount = 0;
    var vX = 0;
    var vY = 0;
    var pressed;
    function handleLongTap() {
        longTouchTimer = null;
        clearTimeout(longTouchTimer);
        if (editor.selection.isEmpty())
            editor.selection.moveToPosition(pos);
        mode = "wait";
    }
    function switchToSelectionMode() {
        longTouchTimer = null;
        clearTimeout(longTouchTimer);
        editor.selection.moveToPosition(pos);
        var range = clickCount >= 2
            ? editor.selection.getLineRange(pos.row)
            : editor.session.getBracketRange(pos);
        if (range && !range.isEmpty()) {
            editor.selection.setRange(range);
        } else {
            editor.selection.selectWord();
        }
        mode = "wait";
    }
    el.addEventListener("contextmenu", function(e) {
        if (!pressed) return;
        var textarea = editor.textInput.getElement();
        textarea.focus();
    });
    el.addEventListener("touchstart", function (e) {
        var touches = e.touches;
        if (longTouchTimer || touches.length > 1) {
            clearTimeout(longTouchTimer);
            longTouchTimer = null;
            mode = "zoom";
            return;
        }
        
        pressed = true;
        var touchObj = touches[0];
        startX = touchObj.clientX;
        startY = touchObj.clientY;
        vX = vY = 0;

        e.clientX = touchObj.clientX;
        e.clientY = touchObj.clientY;

        var t = e.timeStamp;
        lastT = t;
        
        var ev = new MouseEvent(e, editor);
        pos = ev.getDocumentPosition();

        if (t - touchStartT < 500 && touches.length == 1 && !animationSteps) {
            clickCount++;
            e.preventDefault();
            e.button = 0;
            switchToSelectionMode();
        } else {
            clickCount = 0;
            longTouchTimer = setTimeout(handleLongTap, 450);
            var cursor = editor.selection.cursor;
            var anchor = editor.selection.isEmpty() ? cursor : editor.selection.anchor;
            
            var cursorPos = editor.renderer.$cursorLayer.getPixelPosition(cursor, true);
            var anchorPos = editor.renderer.$cursorLayer.getPixelPosition(anchor, true);
            var rect = editor.renderer.scroller.getBoundingClientRect();
            var h = editor.renderer.layerConfig.lineHeight;
            var w = editor.renderer.layerConfig.lineHeight;
            var weightedDistance = function(x, y) {
                x = x / w;
                y = y / h - 0.75;
                return x * x + y * y;
            };
            
            var diff1 = weightedDistance(
                e.clientX - rect.left - cursorPos.left,
                e.clientY - rect.top - cursorPos.top
            );
            var diff2 = weightedDistance(
                e.clientX - rect.left - anchorPos.left,
                e.clientY - rect.top - anchorPos.top
            );
            if (diff1 < 3.5 && diff2 < 3.5)
                mode = diff1 > diff2 ? "cursor" : "anchor";
                
            if (diff2 < 3.5)
                mode = "anchor";
            else if (diff1 < 3.5)
                mode = "cursor";
            else
                mode = "scroll";
        }
        touchStartT = t;
    });

    el.addEventListener("touchend", function (e) {
        pressed = false;
        if (animationTimer) clearInterval(animationTimer);
        if (mode == "zoom") {
            mode = "";
            animationSteps = 0;
        } else if (longTouchTimer) {
            editor.selection.moveToPosition(pos);
            animationSteps = 0;
        } else if (mode == "scroll") {
            animate();
            e.preventDefault();
        }
        clearTimeout(longTouchTimer);
        longTouchTimer = null;
    });
    el.addEventListener("touchmove", function (e) {
        if (longTouchTimer) {
            clearTimeout(longTouchTimer);
            longTouchTimer = null;
        }
        var touches = e.touches;
        if (touches.length > 1 || mode == "zoom") return;

        var touchObj = touches[0];

        var wheelX = startX - touchObj.clientX;
        var wheelY = startY - touchObj.clientY;

        if (mode == "wait") {
            if (wheelX * wheelX + wheelY * wheelY > 4)
                mode = "cursor";
            else
                return e.preventDefault();
        }

        startX = touchObj.clientX;
        startY = touchObj.clientY;

        e.clientX = touchObj.clientX;
        e.clientY = touchObj.clientY;

        var t = e.timeStamp;
        var dt = t - lastT;
        lastT = t;
        if (mode == "scroll") {
            var mouseEvent = new MouseEvent(e, editor);
            mouseEvent.speed = 1;
            mouseEvent.wheelX = wheelX;
            mouseEvent.wheelY = wheelY;
            if (10 * Math.abs(wheelX) < Math.abs(wheelY)) wheelX = 0;
            if (10 * Math.abs(wheelY) < Math.abs(wheelX)) wheelY = 0;
            if (dt != 0) {
                vX = wheelX / dt;
                vY = wheelY / dt;
            }
            editor._emit("mousewheel", mouseEvent);
            if (!mouseEvent.propagationStopped) {
                vX = vY = 0;
            }
        }
        else {
            var ev = new MouseEvent(e, editor);
            var pos = ev.getDocumentPosition();
            if (mode == "cursor")
                editor.selection.moveCursorToPosition(pos);
            else if (mode == "anchor")
                editor.selection.setSelectionAnchor(pos.row, pos.column);
            editor.renderer.scrollCursorIntoView(pos);
            e.preventDefault();
        }
    });

    function animate() {
        animationSteps += 60;
        animationTimer = setInterval(function() {
            if (animationSteps-- <= 0) {
                clearInterval(animationTimer);
                animationTimer = null;
            }
            if (Math.abs(vX) < 0.01) vX = 0;
            if (Math.abs(vY) < 0.01) vY = 0;
            if (animationSteps < 20) vX = 0.9 * vX;
            if (animationSteps < 20) vY = 0.9 * vY;
            editor.renderer.scrollBy(10 * vX, 10 * vY);
        }, 10);
    }
};

});
