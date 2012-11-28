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

    var PLACEHOLDER = useragent.isIE || useragent.isOpera ? "\x01\x01" : "\x00\x00";

    resetValue();

    if (isFocused())
        host.onFocus();

    // Somehow fixes problem with firing onpropertychange on first typed char
    if (useragent.isOldIE) {
        resetSelection();
        resetValue();
        setTimeout(resetSelection);
    }

    var cut = false
    var copied = false;
    var pasted = false;

    var inCompostion = false;

    var resetTimeout = null;

    var tempStyle = '';

    function resetValue() {
        text.value = PLACEHOLDER;
        //http://code.google.com/p/chromium/issues/detail?id=76516
        if (useragent.isWebKit && !resetTimeout)
            resetTimeout = setTimeout(function(){
                text.value = PLACEHOLDER;
                resetSelection();
                resetTimeout = null;
            });
    };

    function resetSelection(isEmpty) {
        var selectionStart = isEmpty ? 2 : 1;
        var selectionEnd = 2;
        // on firefox this throws if textarea is hidden
        try {
            if (text.setSelectionRange) {
                text.setSelectionRange(selectionStart, selectionEnd);
            }
            // IE8 does not support setSelectionRange
            else if (text.createTextRange) {
                var range = text.createTextRange();
                range.collapse(true);
                range.moveEnd('character', selectionEnd);
                range.moveStart('character', selectionStart);
                range.select();
            }
        } catch(e){}
    };

    var onSelect = function(e) {
        if (cut) {
            cut = false;
            return;
        }
        if (copied) {
            copied = false;
            return;
        }
        if (text.selectionStart === 0 && text.selectionEnd === text.value.length) {
            host.selectAll();
            resetSelection();
        }
    };

    var onInput = function(e) {
        if (inCompostion)
            return;

        if (pasted) {
            var data = text.value;
            resetValue();
            if (data)
                host.onPaste(data);
            pasted = false;
            return;
        }

        var data = text.value;
        if (data.substring(0, 2) == PLACEHOLDER)
            data = data.substr(2);
        else
            data = data.substr(1);

        resetValue();
        if (data) {
            // can happen if undo in textarea isn't stopped
            if (data[data.length - 1] == PLACEHOLDER[0])
                data = data.slice(0, -1);
        if (data)
            host.onTextInput(data);
        } else
            host.onDelete();
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

    var onCut = function(e) {
        var data = host.getCopyText();
        if (!data) {
            event.preventDefault(e);
            return;
        }

        var clipboardData = e.clipboardData || window.clipboardData;

        if (clipboardData) {
            // Safari 5 has clipboardData object, but does not handle setData()
            var supported = clipboardData.setData("Text", data);
            if (supported) {
                host.onCut();
                event.preventDefault(e);
            }
        }

        if (!supported) {
            cut = true;
            text.value = data;
            text.select();
            setTimeout(function(){
                cut = false;
                resetValue();
                resetSelection();
                host.onCut();
            });
        }
    };

    var onCopy = function(e) {
        var data = host.getCopyText();
        if (!data) {
            event.preventDefault(e);
            return;
        }

        var clipboardData = e.clipboardData || window.clipboardData;

        if (clipboardData) {
            // Safari 5 has clipboardData object, but does not handle setData()
            var supported = clipboardData.setData("Text", data);
            if (supported) {
                host.onCopy();
                event.preventDefault(e);
            }
        }
        if (!supported) {
            copied = true;
            text.value = data;
            text.select();
            setTimeout(function(){
                copied = false;
                resetValue();
                resetSelection();
                host.onCopy();
            });
        }

        
    };

    var onPaste = function(e) {
        var clipboardData = e.clipboardData || window.clipboardData;

        if (clipboardData) {
            var data = clipboardData.getData("Text");
            if (data)
                host.onPaste(data);
            event.preventDefault(e);
        }
        else {
            text.value = "";
            pasted = true;
        }
    };

    event.addCommandKeyListener(text, host.onCommandKey.bind(host));

    event.addListener(text, "select", onSelect);

    event.addListener(text, "input", onInput);

    event.addListener(text, "cut", onCut);
    event.addListener(text, "copy", onCopy);
    event.addListener(text, "paste", onPaste);


    // Opera has no clipboard events
    if (!('oncut' in text) || !('oncopy' in text) || !('onpaste' in text)){
        event.addListener(parentNode, "keydown", function(e) {
            if ((useragent.isMac && !e.metaKey) || !e.ctrlKey)
            return;

            switch (e.keyCode) {
                case 67:
                    onCopy(e);
                    break;
                case 86:
                    onPaste(e);
                    break;
                case 88:
                    onCut(e);
                    break;
            }
        });
    }

    if (useragent.isOldIE) {
        event.addListener(text, "propertychange", function(e){
            if (text.value != "" && text.value != PLACEHOLDER)
                onInput(e);
        });

        var keytable = { 13:1, 27:1 };
        event.addListener(text, "keyup", function (e) {
            if (inCompostion && (!text.value || keytable[e.keyCode]))
                setTimeout(onCompositionEnd, 0);
            if ((text.value.charCodeAt(0)|0) < 129) {
                return;
            }
            inCompostion ? onCompositionUpdate() : onCompositionStart();
        });
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
        resetSelection();
    });

    this.focus = function() {
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

        resetSelection(host.selection.isEmpty());

        if (e.type != "mousedown")
            return;

        if (host.renderer.$keepTextAreaAtCursor)
            host.renderer.$keepTextAreaAtCursor = null;

        // on windows context menu is opened after mouseup
        if (useragent.isWin)
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
            onContextMenuClose();
        });
};

exports.TextInput = TextInput;
});
