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
var event = require("../lib/event");

var TouchHandler = function(editor) {
    this.editor = editor;
    this.editor.on("mousedown", function(e) {
        if (editor.$hasActiveTouch) {
            e.stop();
        }
        e.defaultPrevented = true;
    });

    editor.on("focus", function() {
        editor.focusedFromTouch = editor.fromTouch;
    });

    editor.on("blur", function() {
        editor.focusedFromTouch = false;
    });


    var el = editor.container;
    var st = null, m = null, inter, vintX = 0, vintY = 0;
    var st0, vX = 0, vY = 0, vprevX = 0, vprevY = 0;

    var dt, t = 0, t1, c;

    var dbClick, stickyX = false, stickyY = false;
    var touches;
    el.addEventListener("touchstart", function(e) {
        editor.touchMoved = false;
        st0 = st = m = conv(e.touches[0], e);
        if (ticker) {
            ticker = clearInterval(ticker);
            vintX = vmidX;
            vintY = vmidY;
        } else {
            vintX = 0;
            vintY = 0;
            stickyX = true;
            stickyY = true;
        }
        vmidX = vmidY = 0;
        vprevX = vX = vprevY = vY = 0;
        t = e.timeStamp;
        // if (e.touches.length < 2)

        if (editor.focusedFromTouch) {
            if (e.touches.length < 2)
                e.preventDefault();
        }
    });
    el.addEventListener("touchend", function(e) {
        inter = clearInterval(inter);

        m = conv(e.changedTouches[0], e);
        move(m);
        if (vmidX * vintX > 0 || vmidY * vintY > 0) {
            c = (Math.abs(vmidY) + Math.abs(vintY)) / Math.abs(vmidY);
        } else {
            c = 1;
        }
        k = k0;
        animate(e);
    });

    var k0 = 0.1, k = k0;
    var ticker;
    function animate(e) {
        clearInterval(ticker);
        var vmidX0 = vmidX;
        var vmidY0 = vmidY;
        var t0 = m.t;

        vmidY0 = ((m.y-st0.y)/(m.t-st0.t));

        if (Math.abs(vmidX) < 0.001 && Math.abs(vmidY) < 0.001) {
            moveCursor(e.changedTouches[0]);
            return;
        }

        ticker = function() {
            t1 = t;
            t = Date.now();
            var dt = t - t1;

            var dy = vmidY * dt;
            var dx = vmidX * dt;

            var d = ((1 - c) * 1 / (1 + 0.6 * (t-t0)) + c) * Math.exp(- k0 * (t-t0) / 50);

            vmidX -= k * vmidX * dt / 20;
            vmidY -= k * vmidY * dt / 20;

            vmidX = d * vmidX0;
            vmidY = d * vmidY0;

            if (k < k0)
                k += k0 * (k0 - k);
            
            if (Math.abs(dx) + Math.abs(dy) < 1) {
                return ticker = clearInterval(ticker);
            }
            scrollBy(dx, dy);
            // output.innerHTML = sct
            if (ticker)
                setTimeout(ticker, 30);
        };
        ticker();
    }

    el.addEventListener("touchmove", function(e) {
        m = conv(e.touches[0], e);
        editor.touchMoved = true;
        move(m);
        e.preventDefault();
    });

    var vmidX, vmidY, vprevX = 0, vprevY = 0, dtPrev = 0;
    function move(m) {
        var dx = m.x-st.x;
        var dy = m.y-st.y;
        var t1 = m.t;
        if (t1 <= t) return;

        if (Math.abs(dx) + Math.abs(dy) > 3) {
            if (stickyX && stickyY) {
                if (Math.abs(dy) > 1.5 * Math.abs(dx)) {
                    stickyY = false;
                } else if (Math.abs(dx) > 1.5 * Math.abs(dy)) {
                    stickyX = false;
                } else {
                    stickyX = stickyY = false;
                }
            } else if (stickyX) {
                if (Math.abs(m.x - st0.x) > 3 * Math.abs(m.y - st0.y))
                    stickyX = false;
            } else if (stickyY) {
                if (Math.abs(m.y - st0.y) > 3 * Math.abs(m.x - st0.x))
                    stickyY = false;
            }
            
        }
        if (stickyX) dx = 0;
        if (stickyY) dy = 0;

        dt = (t1 - t );
        t = t1;

        vX = dx / dt;
        vY = dy / dt;
        var  d = 0.4 * dtPrev / (dtPrev + dt);

        m.vX = vX;
        m.vY = vY;
        m.dt = dt;
        vmidX = d * vprevX + (1-d) * vX;
        vmidY = d * vprevY + (1-d) * vY * 10;
        if (isNaN(vmidY))debugger;

        dtPrev = dt;
        vprevX = vX;
        vprevY = vY;
        scrollBy(dx, dy);
        st = m;
    }

    function conv(e, e1) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.right;

        return {x: x, y: y, t: e1.timeStamp};
    }



    editor.textInput.getElement().style.fontSize = "60px";


    event.addListener(editor.container, "click", function(e) {

        if (editor.touchMoved)
            return;
        editor.fromTouch = true;
        editor.focus();
        editor.fromTouch = false;
    });

    var scrollBy = function(x, y) {
        var s = editor.session;
        s.setScrollLeft(s.getScrollLeft() - x);
        s.setScrollTop(s.getScrollTop() - y);
    };

    var moveCursor = function(touch) {
        var x = touch.clientX;
        var y = touch.clientY;

       // var editor = this.editor;
        var pos = editor.renderer.screenToTextCoordinates(x, y);
        editor.moveCursorToPosition(pos);
        editor.selection.clearSelection();
        editor.renderer.scrollCursorIntoView();
    };
};

(function() {
    
}).call(TouchHandler.prototype);

exports.TouchHandler = TouchHandler;
});