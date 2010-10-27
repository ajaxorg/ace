/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

if (!require.def) require.def = require("requireJS-node")(module);

require.def("ace/lib/event", ["ace/lib/core"], function(core) {

    var event = {};

    event.addListener = function(elem, type, callback) {
        if (elem.addEventListener) {
            return elem.addEventListener(type, callback, false);
        }
        if (elem.attachEvent) {
            var wrapper = function() {
                callback(window.event);
            };
            callback.$$wrapper = wrapper;
            elem.attachEvent("on" + type, wrapper);
        }
    };

    event.removeListener = function(elem, type, callback) {
        if (elem.removeEventListener) {
            return elem.removeEventListener(type, callback, false);
        }
        if (elem.detachEvent) {
            elem.detachEvent("on" + type, callback.$$wrapper || callback);
        }
    };

    event.stopEvent = function(e) {
        event.stopPropagation(e);
        event.preventDefault(e);
        return false;
    };

    event.stopPropagation = function(e) {
        if (e.stopPropagation)
            e.stopPropagation();
        else
            e.cancelBubble = true;
    };

    event.preventDefault = function(e) {
        if (e.preventDefault)
            e.preventDefault();
        else
            e.returnValue = false;
    };

    event.getDocumentX = function(e) {
        if (e.clientX) {
            var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
            return e.clientX + scrollLeft;
        } else {
            return e.pageX;
        }
    };

    event.getDocumentY = function(e) {
        if (e.clientY) {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            return e.clientY + scrollTop;
        } else {
            return e.pageX;
        }
    };

    /**
     * @return {Number} 0 for left button, 1 for middle button, 2 for right button
     */
    event.getButton = function(e) {
        // DOM Event
        if (e.preventDefault) {
            return e.button;
        }
        // old IE
        else {
            return Math.max(e.button - 1, 2)
        }
    };
    
    if (document.documentElement.setCapture) {
        event.capture = function(el, eventHandler, releaseCaptureHandler) {
            function onMouseMove(e) {
                eventHandler(e);
                return event.stopPropagation(e);
            }

            function onReleaseCapture(e) {
                eventHandler && eventHandler(e);
                releaseCaptureHandler && releaseCaptureHandler();

                event.removeListener(el, "mousemove", eventHandler);
                event.removeListener(el, "mouseup", onReleaseCapture);
                event.removeListener(el, "losecapture", onReleaseCapture);

                el.releaseCapture();
            }

            event.addListener(el, "mousemove", eventHandler);
            event.addListener(el, "mouseup", onReleaseCapture);
            event.addListener(el, "losecapture", onReleaseCapture);
            el.setCapture();
        };
    }
    else {
        event.capture = function(el, eventHandler, releaseCaptureHandler) {
            function onMouseMove(e) {
                eventHandler(e);
                e.stopPropagation();
            }

            function onMouseUp(e) {
                eventHandler && eventHandler(e);
                releaseCaptureHandler && releaseCaptureHandler();

                document.removeEventListener("mousemove", onMouseMove, true);
                document.removeEventListener("mouseup", onMouseUp, true);

                e.stopPropagation();
            }

            document.addEventListener("mousemove", onMouseMove, true);
            document.addEventListener("mouseup", onMouseUp, true);
        };
    }

    event.addMouseWheelListener = function(el, callback) {
        var listener = function(e) {
            if (e.wheelDelta !== undefined) {
                if (e.wheelDeltaX !== undefined) {
                    e.wheelX = -e.wheelDeltaX / 8;
                    e.wheelY = -e.wheelDeltaY / 8;
                } else {
                    e.wheelX = 0;
                    e.wheelY = -e.wheelDelta / 8;
                }
            }
            else {
                if (e.axis && e.axis == e.HORIZONTAL_AXIS) {
                    e.wheelX = (e.detail || 0) * 5;
                    e.wheelY = 0;
                } else {
                    e.wheelX = 0;
                    e.wheelY = (e.detail || 0) * 5;
                }
            }
            callback(e);
        };
        event.addListener(el, "DOMMouseScroll", listener);
        event.addListener(el, "mousewheel", listener);
    };

    event.addMultiMouseDownListener = function(el, count, timeout, callback) {
        var clicks = 0;
        var startX, startY;

        var listener = function(e) {
            clicks += 1;
            if (clicks == 1) {
                startX = e.clientX;
                startY = e.clientY;

                setTimeout(function() {
                    clicks = 0;
                }, timeout || 600);
            }

            if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5)
                clicks = 0;

            if (clicks == count) {
                clicks = 0;
                callback(e);
            }
            return event.preventDefault(e);
        };

        event.addListener(el, "mousedown", listener);
        core.isIE && event.addListener(el, "dblclick", listener);
    };

    event.addKeyListener = function(el, callback) {
        var lastDown = null;

        event.addListener(el, "keydown", function(e) {
            lastDown = e.keyIdentifier || e.keyCode;
            return callback(e);
        });

        // repeated keys are fired as keypress and not keydown events
        if (core.isMac && core.isGecko) {
            event.addListener(el, "keypress", function(e) {
                var keyId = e.keyIdentifier || e.keyCode;
                if (lastDown !== keyId) {
                    return callback(e);
                } else {
                    lastDown = null;
                }
            });
        }
    };

    return event;
});