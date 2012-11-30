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

var MobileScroll = function(parentEl) {
    this.parentOverflowEl = dom.createElement("div");
    this.parentOverflowEl.className = "ace_layer ace_mobile_scroll-layer";
    this.element = dom.createElement("div");
    this.parentOverflowEl.appendChild(this.element);
    parentEl.appendChild(this.parentOverflowEl);

    var _self = this;

    var movementDiff = 0, lastMovementPos = 0;
    var timeDiff = 0, lastTime = 0;
    var waitingForLastScroll = false;
    var stopInertialScrolling = false;

    this.parentOverflowEl.onscroll = function(e) {
        if (stopInertialScrolling) {
            _self.parentOverflowEl.scrollTop = _self.session.getScrollTop();
            return false;
        }

        if (_self.session)
            _self.session.setScrollTop(_self.parentOverflowEl.scrollTop);
    };

    document.addEventListener("touchmove", function(e) {
        movementDiff = _self.parentOverflowEl.scrollTop - lastMovementPos;
        lastMovementPos = _self.parentOverflowEl.scrollTop;

        timeDiff = e.timeStamp - lastTime;
        lastTime = e.timeStamp;
    });

    var movingTimer;
    var touchStartedWithAce = false;
    document.addEventListener("touchstart", function(e) {
        if (e.target.className.split(" ").indexOf("ace_content") === -1)
            return true;

        touchStartedWithAce = true;
        stopInertialScrolling = false;

        clearInterval(movingTimer);

        waitingForLastScroll = false;
        movementDiff = 0, lastMovementPos = 0;
        timeDiff = 0, lastTime = 0;
    }, false);

    document.addEventListener("touchend", function(e) {
        if (!touchStartedWithAce)
            return true;
        touchStartedWithAce = false;
        waitingForLastScroll = true;

        var position = _self.parentOverflowEl.scrollTop;
        var velocity = movementDiff;

        movingTimer = setInterval(function() {
            position += velocity;
            velocity *= 0.949;
            _self.session.setScrollTop(position);
            _self.parentOverflowEl.scrollTop = position;
            if (Math.abs(velocity) < 4) {
                clearInterval(movingTimer);
                stopInertialScrolling = true;
            }
        }, 5);
    }, false);
};

(function() {
    this.setSession = function(session) {
        this.session = session;
    };

    this.$padding = 0;
    this.setPadding = function(padding) {
        this.$padding = padding;
        this.element.style.padding = "0 " + padding + "px";
    };

    this.setScrollTop = function(top) {
        this.parentOverflowEl.scrollTop = top;
    };

    this.update = function(config) {
        this.element.style.height = config.lineHeight * this.session.getScreenLength() + "px";
    };

}).call(MobileScroll.prototype);

exports.MobileScroll = MobileScroll;

});
