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

var event = require("../lib/event");
function KineticModel() {

    var min = 0;
    var max = 1000;
    var timeConstant;
    var ticker;
    var lastPosition = 0;
    var velocity = 0;
    var timestamp = Date.now();

    function clamped(pos) {
        return (pos > max) ? max : (pos < min) ? min : pos;
    }

    function nop() {}

    this.duration = 1950;
    this.position = 0;
    this.updateInterval = 1000 / 30;

    this.onPositionChanged = nop;
    this.onScrollStarted = nop;
    this.onScrollStopped = nop;


    this.setRange = function (start, end) {
        min = start;
        max = end;
    };

    this.getRange = function () {
        return {min: min, max: max};
    };

    this.setPosition = function (pos) {
        var self = this;

        this.position = clamped(pos);
        this.onPositionChanged(this.position);

        if (!ticker) {
            // Track down the movement to compute the initial
            // scrolling velocity.
            ticker = window.setInterval(function () {
                var now = Date.now(),
                    elapsed = now - timestamp,
                    v = (self.position - lastPosition) * 1000 / elapsed;

                // Moving average to filter the speed.
                if (ticker && elapsed >= self.updateInterval) {
                    timestamp = now;
                    if (v > 1 || v < -1) {
                        velocity = 0.2 * (velocity) + 0.8 * v;
                        lastPosition = self.position;
                    }
                }
            }, this.updateInterval);
        }
    };

    this.resetSpeed = function () {
        velocity = 0;
        lastPosition = this.position;

        window.clearInterval(ticker);
        ticker = null;
    };

    this.release = function () {
        var self = this,
            amplitude = 4 * velocity,
            targetPosition = this.position + amplitude,
            timeConstant = 1 + this.duration / 6,
            timestamp = Date.now();

        window.clearInterval(ticker);
        ticker = null;

        if (velocity > 1 || velocity < -1) {

            this.onScrollStarted(self.position);

            window.clearInterval(ticker);
            ticker = window.setInterval(function () {
                var elapsed = Date.now() - timestamp;

                if (ticker) {
                    self.position = targetPosition - amplitude * Math.exp(-elapsed / timeConstant);
                    self.position = clamped(self.position);
                    self.onPositionChanged(self.position);

                    if (elapsed > self.duration) {
                        self.resetSpeed();
                        self.onScrollStopped(self.position);
                    }
                }
            }, this.updateInterval);
        }
    };
}


var TouchHandler = function(editor) {
    this.editor = editor;
    this.editor.on("mousedown", function(e) {
        if (editor.$hasActiveTouch || pressed)
            e.stop();
    });


    var ace = editor;
    var el = ace.container;
    var scroller = new KineticModel();
    var pressed = false;
    var refPos = 0;

    function adjustRange() {
        var max = ace.renderer.layerConfig.maxHeight;
        max -= window.innerHeight;
        scroller.setRange(0, max);
        scroller.position = ace.session.getScrollTop()
    }

    function tap(e) {
        if (e.targetTouches && (e.targetTouches.length > 1))
            return
        pressed = true;
        if (e.targetTouches && (e.targetTouches.length >= 1)) {
            refPos = e.targetTouches[0].clientY;
        } else {
            refPos = e.clientY;
        }
        adjustRange()
        scroller.resetSpeed();
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    function untap(e) {
        pressed = false;
        scroller.release();
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    function drag(e) {
        var pos, delta;

        if (!pressed) {
            return;
        }
if (e.targetTouches && (e.targetTouches.length > 1))
return
        if (e.targetTouches && (e.targetTouches.length >= 1)) {
            pos = e.targetTouches[0].clientY;
        } else {
            pos = e.clientY;
        }

        delta = refPos - pos;
        if (delta > 2 || delta < -2) {
            scroller.setPosition(scroller.position += delta);
            refPos = pos;
        }

        e.preventDefault();
        e.stopPropagation();
        return false;
    }


    scroller.onPositionChanged = function (y) {
        ace.session.setScrollTop(y)
    };


    el.addEventListener('mousedown', tap, true);
    el.addEventListener('mousemove', drag, true);
    el.addEventListener('mouseup', untap, true);

    if (typeof window.ontouchstart !== 'undefined') {
        el.addEventListener('touchstart', tap);
        el.addEventListener('touchmove', drag);
        el.addEventListener('touchend', untap);
    }
ace.textInput.getElement().style.fontSize="60px"










     event.addListener(editor.container, "click", function(e) {
        editor.focus();
    });




    return
    var inter
    editor.textInput.getElement().style.bottom=0
    event.addListener(editor.container, "click", function(e) {
        editor.focus();
    });
    var el = editor.renderer.getMouseEventTarget();
    el.addEventListener("touchstart", function(e) {
        scl = editor.session.getScrollLeft()
        sct = editor.session.getScrollTop()
      editor.focus()
      st = m = conv(e.touches[0], e)

      // if (e.touches.length < 2)
      // e.preventDefault()
      // inter = setInterval(move, 20)
    })
    el.addEventListener("touchend", function(e) {
      e.preventDefault()
      inter = clearInterval(inter)

    })
    el.addEventListener("touchmove", function(e) {
      m = conv(e.touches[0], e)
      move()
      e.preventDefault()
    })
    el.addEventListener("click", function(e) {
      editor.focus()
      e.preventDefault()
    })

    move = function() {
        var dx = m.x-st.x
        var dy = m.y-st.y

        setSc(scl + dx, sct + dy)

        st = m
    }

    conv = function(e, e1) {
        var rect = el.getBoundingClientRect()

        var x = e.clientX - rect.left
        var y = e.clientY - rect.right

        return {x:x,y:y,t: e1.timeStamp}
    }


    var scl = 0
    var sct = 0
    function setSc(x, y) {
        scl = x//Math.max(0, Math.min(sclm, x))
        sct = y//Math.max(0, Math.min(sctm, y))
        editor.session.setScrollLeft(scl)
        editor.session.setScrollTop(sct)
    }
};

(function() {

    this.onTouchMove = function(e) {
        e.preventDefault();
        if (e.touches.length == 1) {
            this.$moveCursor(e.touches[0]);
        }
        else if (e.touches.length == 2) {
            if (!this.$scroll)
                return;

            var touch = e.touches[0];
            var diffX = this.$scroll.pageX - touch.pageX;
            var diffY = this.$scroll.pageY - touch.pageY;
            this.editor.renderer.scrollBy(diffX, diffY);

            this.$scroll = {
                pageX: touch.pageX,
                pageY: touch.pageY,
                ts: new Date().getTime()
            }
        }
    };

    this.$moveCursor = function(touch) {
        var pageX = touch.pageX;
        var pageY = touch.pageY;

        var editor = this.editor;
        var pos = editor.renderer.screenToTextCoordinates(pageX, pageY);
        pos.row = Math.max(0, Math.min(pos.row, editor.session.getLength()-1));

        editor.moveCursorToPosition(pos);
        editor.renderer.scrollCursorIntoView();
    };

    this.onTouchEnd = function(e) {

    };

    this.onTouchStart = function(e) {
        this.editor.focus();
        if (e.touches.length == 1) {
            this.$moveCursor(e.touches[0]);
        }
        else if (e.touches.length == 2) {
            e.preventDefault();
            var touch = e.touches[0];
            this.$scroll = {
                pageX: touch.pageX,
                pageY: touch.pageY
            }
        }
    };

    this.onClick = function() {

    }

}).call(TouchHandler.prototype);

exports.TouchHandler = TouchHandler;
});