/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
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

var EditSession = require("../edit_session").EditSession;
var Renderer = require("../virtual_renderer").VirtualRenderer;
var Editor = require("../editor").Editor;
var Range = require("../range").Range;
var event = require("../lib/event");
var lang = require("../lib/lang");
var dom = require("../lib/dom");

var $singleLineEditor = function(el) {
    var renderer = new Renderer(el);

    renderer.$maxLines = 4;
    
    var editor = new Editor(renderer);

    editor.setHighlightActiveLine(false);
    editor.setShowPrintMargin(false);
    editor.renderer.setShowGutter(false);
    editor.renderer.setHighlightGutterLine(false);

    editor.$mouseHandler.$focusWaitTimout = 0;

    return editor;
};

var AcePopup = function(parentNode) {
    var el = dom.createElement("div");
    var popup = new $singleLineEditor(el);
    
    if (parentNode)
        parentNode.appendChild(el);
    el.style.display = "none";
    popup.renderer.content.style.cursor = "default";
    popup.renderer.setStyle("ace_autocomplete");

    var noop = function(){};

    popup.focus = noop;
    popup.$isFocused = true;

    popup.renderer.$cursorLayer.restartTimer = noop;
    popup.renderer.$cursorLayer.element.style.opacity = 0;

    popup.renderer.$maxLines = 8;
    popup.renderer.$keepTextAreaAtCursor = false;

    popup.setHighlightActiveLine(true);
    // set default highlight color
    popup.session.highlight("");
    popup.session.$searchHighlight.clazz = "ace_highlight-marker";

    popup.on("mousedown", function(e) {
        var pos = e.getDocumentPosition();
        popup.moveCursorToPosition(pos);
        popup.selection.clearSelection();
        e.stop();
    });

    var hoverMarker = new Range(-1,0,-1,Infinity);
    hoverMarker.id = popup.session.addMarker(hoverMarker, "ace_line-hover", "fullLine");
    popup.on("mousemove", function(e) {
        //if (popup.lastOpened)
        var row = e.getDocumentPosition().row;
        hoverMarker.start.row = hoverMarker.end.row = row;
        popup.session._emit("changeBackMarker");
    });
    var hideHoverMarker = function() {
        hoverMarker.start.row = hoverMarker.end.row = -1;
        popup.session._emit("changeBackMarker");
    };
    event.addListener(popup.container, "mouseout", hideHoverMarker);
    popup.on("hide", hideHoverMarker);
    popup.on("changeSelection", hideHoverMarker);
    popup.on("mousewheel", function(e) {
        setTimeout(function() {
            popup._signal("mousemove", e);
        });
    });

    popup.session.doc.getLength = function() {
        return popup.data.length;
    };
    popup.session.doc.getLine = function(i) {
        var data = popup.data[i];
        if (typeof data == "string")
            return data;
        return (data && data.value) || "";
    };

    var bgTokenizer = popup.session.bgTokenizer;
    bgTokenizer.$tokenizeRow = function(i) {
        var data = popup.data[i];
        var tokens = [];
        if (!data)
            return tokens;
        if (typeof data == "string")
            data = {value: data};
        if (!data.caption)
            data.caption = data.value;

        tokens.push({type: data.className || "", value: data.caption});
        if (data.meta) {
            var maxW = popup.renderer.$size.scrollerWidth / popup.renderer.layerConfig.characterWidth;
            if (data.meta.length + data.caption.length < maxW - 2)
                tokens.push({type: "rightAlignedText", value: data.meta});
        }
        return tokens;
    };
    bgTokenizer.$updateOnChange = noop;
    
    popup.session.$computeWidth = function() {
        return this.screenWidth = 0;
    }

    // public
    popup.data = [];
    popup.setData = function(list) {
        popup.data = list || [];
        popup.setValue(lang.stringRepeat("\n", list.length), -1);
    };
    popup.getData = function(row) {
        return popup.data[row];
    };
	
	popup.getRow = function() {
        var line = this.getCursorPosition().row;
        if (line == 0 && !this.getHighlightActiveLine())
            line = -1;
        return line;
    };
    popup.setRow = function(line) {
        popup.setHighlightActiveLine(line != -1);
        popup.selection.clearSelection();
        popup.moveCursorTo(line, 0 || 0);
    };

    popup.setHighlight = function(re) {
        popup.session.highlight(re);
        popup.session._emit("changeFrontMarker");
    };

    popup.hide = function() {
        this.container.style.display = "none";
        this._signal("hide");
    };
    popup.show = function(pos, lineHeight) {
        var el = this.container;
        if (pos.top > window.innerHeight / 2  + lineHeight) {
            el.style.top = "";
            el.style.bottom = window.innerHeight - pos.top + "px";
        } else {
            pos.top += lineHeight;
            el.style.top = pos.top + "px";
            el.style.bottom = "";
        }

        el.style.left = pos.left + "px";
        el.style.display = "";
        this.renderer.$textLayer.checkForSizeChanges();

        this._signal("show");
    };

    return popup;
};

dom.importCssString("\
.ace_autocomplete.ace-tm .ace_marker-layer .ace_active-line {\
    background-color: #abbffe;\
}\
.ace_autocomplete.ace-tm .ace_line-hover {\
    border: 1px solid #abbffe;\
    position: absolute;\
    background: rgba(233,233,253,0.4);\
    z-index: 2;\
    margin-top: -1px;\
}\
.ace_rightAlignedText {\
    color: gray;\
    display: inline-block;\
    position: absolute;\
    right: 4px;\
    text-align: right;\
    z-index: -1;\
}\
.ace_autocomplete {\
    width: 200px;\
    z-index: 200000;\
    background: #f8f8f8;\
    border: 1px lightgray solid;\
    position: fixed;\
    box-shadow: 2px 3px 5px rgba(0,0,0,.2);\
}");

exports.AcePopup = AcePopup;

});