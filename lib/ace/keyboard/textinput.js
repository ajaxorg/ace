/* vim:ts=4:sts=4:sw=4:
 * ***** BEGIN LICENSE BLOCK *****
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
 *      Mihai Sucan <mihai DOT sucan AT gmail DOT com>
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
"use strict";

var event = require("../lib/event");
var useragent = require("../lib/useragent");
var dom = require("../lib/dom");

var TextInput = function(parentNode, host) {
    var text = dom.createElement("textarea");
    /*/ debug
    text.style.opacity = 1
    text.style.background = "rgba(0, 250, 0, 0.3)"
    text.style.outline = "rgba(0, 250, 0, 0.8) solid 1px"
    text.style.outlineOffset = "3px"
    /**/
    if (useragent.isTouchPad)
        text.setAttribute("x-palm-disable-auto-cap", true);

    text.setAttribute("wrap", "off");

    text.style.top = "-2em";
    parentNode.insertBefore(text, parentNode.firstChild);

    var PLACEHOLDER = useragent.isIE ? "\x01" : "\x01";
    sendText();

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
