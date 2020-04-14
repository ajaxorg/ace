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
var event = require("../lib/event");
var dom = require("../lib/dom");

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
    var contextMenu;
    
    function createContextMenu() {
        var clipboard = window.navigator && window.navigator.clipboard;
        var isOpen = false;
        var updateMenu = function() {
            var selected = editor.getCopyText();
            var hasUndo = editor.session.getUndoManager().hasUndo();
            contextMenu.replaceChild(
                dom.buildDom(isOpen ? ["span",
                    !selected && ["span", { class: "ace_mobile-button", action: "selectall" }, "Select All"],
                    selected && ["span", { class: "ace_mobile-button", action: "copy" }, "Copy"],
                    selected && ["span", { class: "ace_mobile-button", action: "cut" }, "Cut"],
                    clipboard && ["span", { class: "ace_mobile-button", action: "paste" }, "Paste"],
                    hasUndo && ["span", { class: "ace_mobile-button", action: "undo" }, "Undo"],
                    ["span", { class: "ace_mobile-button", action: "find" }, "Find"],
                    ["span", { class: "ace_mobile-button", action: "openCommandPallete" }, "Pallete"]
                ] : ["span"]),
                contextMenu.firstChild
            );
        };
        var handleClick = function(e) {
            var action = e.target.getAttribute("action");

            if (action == "more" || !isOpen) {
                isOpen = !isOpen;
                return updateMenu();
            }
            if (action == "paste") {
                clipboard.readText().then(function (text) {
                    editor.execCommand(action, text);
                });
            }
            else if (action) {
                if (action == "cut" || action == "copy") {
                    if (clipboard)
                        clipboard.writeText(editor.getCopyText());
                    else
                        document.execCommand("copy");
                }
                editor.execCommand(action);
            }
            contextMenu.firstChild.style.display = "none";
            isOpen = false;
            if (action != "openCommandPallete")
                editor.focus();
        };
        contextMenu = dom.buildDom(["div",
            {
                class: "ace_mobile-menu",
                ontouchstart: function(e) {
                    mode = "menu";
                    e.stopPropagation();
                    e.preventDefault();
                    editor.textInput.focus();
                },
                ontouchend: function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    handleClick(e);
                },
                onclick: handleClick
            },
            ["span"],
            ["span", { class: "ace_mobile-button", action: "more" }, "..."]
        ], editor.container);
    }
    function showContextMenu() {
        if (!contextMenu) createContextMenu();
        var cursor = editor.selection.cursor;
        var pagePos = editor.renderer.textToScreenCoordinates(cursor.row, cursor.column);
        var leftOffset = editor.renderer.textToScreenCoordinates(0, 0).pageX;
        var scrollLeft = editor.renderer.scrollLeft;
        var rect = editor.container.getBoundingClientRect();
        contextMenu.style.top = pagePos.pageY - rect.top - 3 + "px";
        if (pagePos.pageX - rect.left < rect.width - 70) {
            contextMenu.style.left = "";
            contextMenu.style.right = "10px";
        } else {
            contextMenu.style.right = "";
            contextMenu.style.left = leftOffset + scrollLeft - rect.left + "px";
        }
        contextMenu.style.display = "";
        contextMenu.firstChild.style.display = "none";
        editor.on("input", hideContextMenu);
    }
    function hideContextMenu(e) {
        if (contextMenu)
            contextMenu.style.display = "none";
        editor.off("input", hideContextMenu);
    }

    function handleLongTap() {
        longTouchTimer = null;
        clearTimeout(longTouchTimer);
        var range = editor.selection.getRange();
        var inSelection = range.contains(pos.row, pos.column);
        if (range.isEmpty() || !inSelection) {
            editor.selection.moveToPosition(pos);
            editor.selection.selectWord();
        }
        mode = "wait";
        showContextMenu();
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
    event.addListener(el, "contextmenu", function(e) {
        if (!pressed) return;
        var textarea = editor.textInput.getElement();
        textarea.focus();
    }, editor);
    event.addListener(el, "touchstart", function (e) {
        var touches = e.touches;
        if (longTouchTimer || touches.length > 1) {
            clearTimeout(longTouchTimer);
            longTouchTimer = null;
            touchStartT = -1;
            mode = "zoom";
            return;
        }
        
        pressed = editor.$mouseHandler.isMousePressed = true;
        var h = editor.renderer.layerConfig.lineHeight;
        var w = editor.renderer.layerConfig.lineHeight;
        var t = e.timeStamp;
        lastT = t;
        var touchObj = touches[0];
        var x = touchObj.clientX;
        var y = touchObj.clientY;
        // reset clickCount if the new touch is far from the old one
        if (Math.abs(startX - x) + Math.abs(startY - y) > h)
            touchStartT = -1;
        
        startX = e.clientX = x;
        startY = e.clientY = y;
        vX = vY = 0;
        
        var ev = new MouseEvent(e, editor);
        pos = ev.getDocumentPosition();

        if (t - touchStartT < 500 && touches.length == 1 && !animationSteps) {
            clickCount++;
            e.preventDefault();
            e.button = 0;
            switchToSelectionMode();
        } else {
            clickCount = 0;
            var cursor = editor.selection.cursor;
            var anchor = editor.selection.isEmpty() ? cursor : editor.selection.anchor;
            
            var cursorPos = editor.renderer.$cursorLayer.getPixelPosition(cursor, true);
            var anchorPos = editor.renderer.$cursorLayer.getPixelPosition(anchor, true);
            var rect = editor.renderer.scroller.getBoundingClientRect();
            var offsetTop = editor.renderer.layerConfig.offset;
            var offsetLeft = editor.renderer.scrollLeft;
            var weightedDistance = function(x, y) {
                x = x / w;
                y = y / h - 0.75;
                return x * x + y * y;
            };
            
            if (e.clientX < rect.left) {
                mode = "zoom";
                return;
            }
            
            var diff1 = weightedDistance(
                e.clientX - rect.left - cursorPos.left + offsetLeft,
                e.clientY - rect.top - cursorPos.top + offsetTop
            );
            var diff2 = weightedDistance(
                e.clientX - rect.left - anchorPos.left + offsetLeft,
                e.clientY - rect.top - anchorPos.top + offsetTop
            );
            if (diff1 < 3.5 && diff2 < 3.5)
                mode = diff1 > diff2 ? "cursor" : "anchor";
                
            if (diff2 < 3.5)
                mode = "anchor";
            else if (diff1 < 3.5)
                mode = "cursor";
            else
                mode = "scroll";
            longTouchTimer = setTimeout(handleLongTap, 450);
        }
        touchStartT = t;
    }, editor);

    event.addListener(el, "touchend", function (e) {
        pressed = editor.$mouseHandler.isMousePressed = false;
        if (animationTimer) clearInterval(animationTimer);
        if (mode == "zoom") {
            mode = "";
            animationSteps = 0;
        } else if (longTouchTimer) {
            editor.selection.moveToPosition(pos);
            animationSteps = 0;
            showContextMenu();
        } else if (mode == "scroll") {
            animate();
            hideContextMenu();
        } else {
            showContextMenu();
        }
        clearTimeout(longTouchTimer);
        longTouchTimer = null;
    }, editor);
    event.addListener(el, "touchmove", function (e) {
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
    }, editor);

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
            var oldScrollTop = editor.session.getScrollTop();
            editor.renderer.scrollBy(10 * vX, 10 * vY);
            if (oldScrollTop == editor.session.getScrollTop())
                animationSteps = 0;
        }, 10);
    }
};

});
