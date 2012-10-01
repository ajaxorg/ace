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
var useragent = require("../lib/useragent");
var dom = require("../lib/dom");

var TextInput = function(parentNode, host) {
    var text = dom.createElement("textarea");
    text.className = "ace_text-input";
    /*/ debug
    text.style.opacity = 1
    text.style.background = "rgba(0, 250, 0, 0.3)"
    text.style.outline = "rgba(0, 250, 0, 0.8) solid 1px"
    text.style.outlineOffset = "3px"
    /**/
    if (useragent.isTouchPad)
        text.setAttribute("x-palm-disable-auto-cap", true);

    text.wrap = "off";
    text.spellcheck = false;

    text.style.top = "-2em";
    parentNode.insertBefore(text, parentNode.firstChild);

    var PLACEHOLDER = useragent.isIE ? "\x01" : "\x00";
    reset(true);
    if (isFocused())
        host.onFocus();

    var inCompostion = false;
    var copied = false;
    var pasted = false;
    var tempStyle = '';

    function reset(full) {
        try {
            if (full) {
                text.value = PLACEHOLDER;
                text.selectionStart = 0;
                text.selectionEnd = 1;
            } else 
                text.select();
        } catch (e) {}
    }

    function sendText(valueToSend) {
        if (!copied) {
            var value = valueToSend || text.value;
            if (value) {
                if (value.length > 1) {
                    if (value.charAt(0) == PLACEHOLDER)
                        value = value.substr(1);
                    else if (value.charAt(value.length - 1) == PLACEHOLDER)
                        value = value.slice(0, -1);
                }

                if (value && value != PLACEHOLDER) {
                    if (pasted)
                        host.onPaste(value);
                    else
                        host.onTextInput(value);
                }
            }
        }

        copied = false;
        pasted = false;

        // Safari doesn't fire copy events if no text is selected
        reset(true);
    }

    var onTextInput = function(e) {
        if (!inCompostion)
            sendText(e.data);
        setTimeout(function () {
            if (!inCompostion)
                reset(true);
        }, 0);
    };

    var onPropertyChange = function(e) {
        setTimeout(function() {
            if (!inCompostion)
                if(text.value != "") {
                    sendText();
                }
        }, 0);
    };

    var onCompositionStart = function(e) {
        inCompostion = true;
        host.onCompositionStart();
        setTimeout(onCompositionUpdate, 0);
    };

    var onCompositionUpdate = function() {
        if (!inCompostion) return;
        host.onCompositionUpdate(text.value);
    };

    var onCompositionEnd = function(e) {
        inCompostion = false;
        host.onCompositionEnd();
    };

    var onCopy = function(e) {
        copied = true;
        var copyText = host.getCopyText();
        if(copyText)
            text.value = copyText;
        else
            e.preventDefault();
        reset();
        setTimeout(function () {
            sendText();
        }, 0);
    };

    var onCut = function(e) {
        copied = true;
        var copyText = host.getCopyText();
        if(copyText) {
            text.value = copyText;
            host.onCut();
        } else
            e.preventDefault();
        reset();
        setTimeout(function () {
            sendText();
        }, 0);
    };

    event.addCommandKeyListener(text, host.onCommandKey.bind(host));
    event.addListener(text, "input", onTextInput);
    
    if (useragent.isOldIE) {
        var keytable = { 13:1, 27:1 };
        event.addListener(text, "keyup", function (e) {
            if (inCompostion && (!text.value || keytable[e.keyCode]))
                setTimeout(onCompositionEnd, 0);
            if ((text.value.charCodeAt(0)|0) < 129) {
                return;
            }
            inCompostion ? onCompositionUpdate() : onCompositionStart();
        });
        
        event.addListener(text, "propertychange", function() {
            if (text.value != PLACEHOLDER)
                setTimeout(sendText, 0);
        });
    }

    event.addListener(text, "paste", function(e) {
        // Mark that the next input text comes from past.
        pasted = true;
        // Some browsers support the event.clipboardData API. Use this to get
        // the pasted content which increases speed if pasting a lot of lines.
        if (e.clipboardData && e.clipboardData.getData) {
            sendText(e.clipboardData.getData("text/plain"));
            e.preventDefault();
        } 
        else {
            // If a browser doesn't support any of the things above, use the regular
            // method to detect the pasted input.
            onPropertyChange();
        }
    });

    if ("onbeforecopy" in text && typeof clipboardData !== "undefined") {
        event.addListener(text, "beforecopy", function(e) {
            if (tempStyle)
                return; // without this text is copied when contextmenu is shown
            var copyText = host.getCopyText();
            if (copyText)
                clipboardData.setData("Text", copyText);
            else
                e.preventDefault();
        });
        event.addListener(parentNode, "keydown", function(e) {
            if (e.ctrlKey && e.keyCode == 88) {
                var copyText = host.getCopyText();
                if (copyText) {
                    clipboardData.setData("Text", copyText);
                    host.onCut();
                }
                event.preventDefault(e);
            }
        });
        event.addListener(text, "cut", onCut); // for ie9 context menu
    }
    else if (useragent.isOpera && !("KeyboardEvent" in window)) {
        event.addListener(parentNode, "keydown", function(e) {
            if ((useragent.isMac && !e.metaKey) || !e.ctrlKey)
                return;

            if ((e.keyCode == 88 || e.keyCode == 67)) {
                var copyText = host.getCopyText();
                if (copyText) {
                    text.value = copyText;
                    text.select();
                    if (e.keyCode == 88)
                        host.onCut();
                }
            }
        });
    }
    else {
        event.addListener(text, "copy", onCopy);
        event.addListener(text, "cut", onCut);
    }

    event.addListener(text, "compositionstart", onCompositionStart);
    if (useragent.isGecko) {
        event.addListener(text, "text", onCompositionUpdate);
    }
    if (useragent.isWebKit) {
        event.addListener(text, "keyup", onCompositionUpdate);
    }
    event.addListener(text, "compositionend", onCompositionEnd);

    event.addListener(text, "blur", function() {
        host.onBlur();
    });

    event.addListener(text, "focus", function() {
        host.onFocus();
        reset();
    });

    this.focus = function() {
        reset();
        text.focus();
    };

    this.blur = function() {
        text.blur();
    };

    function isFocused() {
        return document.activeElement === text;
    }
    this.isFocused = isFocused;

    this.getElement = function() {
        return text;
    };

    this.onContextMenu = function(e) {
        if (!tempStyle)
            tempStyle = text.style.cssText;

        text.style.cssText =
            "position:fixed; z-index:100000;" + 
            (useragent.isIE ? "background:rgba(0, 0, 0, 0.03); opacity:0.1;" : "") + //"background:rgba(250, 0, 0, 0.3); opacity:1;" +
            "left:" + (e.clientX - 2) + "px; top:" + (e.clientY - 2) + "px;";

        if (host.selection.isEmpty())
            text.value = "";
        else
            reset(true);

        if (e.type != "mousedown")
            return;

        if (host.renderer.$keepTextAreaAtCursor)
            host.renderer.$keepTextAreaAtCursor = null;

        // on windows context menu is opened after mouseup
        if (useragent.isWin && (useragent.isGecko || useragent.isIE))
            event.capture(host.container, function(e) {
                text.style.left = e.clientX - 2 + "px";
                text.style.top = e.clientY - 2 + "px";
            }, onContextMenuClose);
    };

    function onContextMenuClose() {
        setTimeout(function () {
            if (tempStyle) {
                text.style.cssText = tempStyle;
                tempStyle = '';
            }
            sendText();
            if (host.renderer.$keepTextAreaAtCursor == null) {
                host.renderer.$keepTextAreaAtCursor = true;
                host.renderer.$moveTextAreaToCursor();
            }
        }, 0);
    };
    this.onContextMenuClose = onContextMenuClose;

    // firefox fires contextmenu event after opening it
    if (!useragent.isGecko)
        event.addListener(text, "contextmenu", function(e) {
            host.textInput.onContextMenu(e);
            onContextMenuClose()
        });
};

exports.TextInput = TextInput;
});
