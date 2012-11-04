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

var dom = require("ace/lib/dom");
var event = require("ace/lib/event");
var Range = require("ace/range").Range;

var tooltipNode;

var TokenTooltip = function(editor) {
    if (editor.tokenTooltip)
        return;
    editor.tokenTooltip = this;    
    this.editor = editor;
    
    editor.tooltip = tooltipNode || this.$init();

    this.update = this.update.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    event.addListener(editor.renderer.scroller, "mousemove", this.onMouseMove);
    event.addListener(editor.renderer.content, "mouseout", this.onMouseOut);
};

(function(){
    this.token = {};
    this.range = new Range();
    
    this.update = function() {
        this.$timer = null;
        
        var r = this.editor.renderer;
        if (this.lastT - (r.timeStamp || 0) > 1000) {
            r.rect = null;
            r.timeStamp = this.lastT;
            this.maxHeight = innerHeight;
            this.maxWidth = innerWidth;
        }

        var canvasPos = r.rect || (r.rect = r.scroller.getBoundingClientRect());
        var offset = (this.x + r.scrollLeft - canvasPos.left - r.$padding) / r.characterWidth;
        var row = Math.floor((this.y + r.scrollTop - canvasPos.top) / r.lineHeight);
        var col = Math.round(offset);

        var screenPos = {row: row, column: col, side: offset - col > 0 ? 1 : -1};
        var session = this.editor.session;
        var docPos = session.screenToDocumentPosition(screenPos.row, screenPos.column);
        var token = session.getTokenAt(docPos.row, docPos.column);

        if (!token && !session.getLine(docPos.row)) {
            token = {
                type: "",
                value: "",
                state: session.bgTokenizer.getState(0)
            };
        }
        if (!token) {
            session.removeMarker(this.marker);
            tooltipNode.style.display = "none";
            this.isOpen = false;
            return;
        }
        if (!this.isOpen) {
            tooltipNode.style.display = "";
            this.isOpen = true;
        }
        
        var tokenText = token.type;
        if (token.state)
            tokenText += "|" + token.state;
        if (token.merge)
            tokenText += "\n  merge";
        if (token.stateTransitions)
            tokenText += "\n  " + token.stateTransitions.join("\n  ");
        
        if (this.tokenText != tokenText) {
            tooltipNode.textContent = tokenText;
            this.tooltipWidth = tooltipNode.offsetWidth;
            this.tooltipHeight = tooltipNode.offsetHeight;
            this.tokenText = tokenText;
        }
        
        this.updateTooltipPosition(this.x, this.y);

        this.token = token;
        session.removeMarker(this.marker);
        this.range = new Range(docPos.row, token.start, docPos.row, token.start + token.value.length);
        this.marker = session.addMarker(this.range, "ace_bracket", "text");
    };
    
    this.onMouseMove = function(e) {
        this.x = e.clientX;
        this.y = e.clientY;
        if (this.isOpen) {
            this.lastT = e.timeStamp;
            this.updateTooltipPosition(this.x, this.y);
        }
        if (!this.$timer)
            this.$timer = setTimeout(this.update, 100);
    };
    
    this.onMouseOut = function(e) {
        var t = e && e.relatedTarget;
        var ct = e &&  e.currentTarget;
        while(t && (t = t.parentNode)) {
            if (t == ct)
                return;
        }
        tooltipNode.style.display = "none";
        this.editor.session.removeMarker(this.marker);
        this.$timer = clearTimeout(this.$timer);
        this.isOpen = false;
    };
    
    this.updateTooltipPosition = function(x, y) {
        var st = tooltipNode.style;
        if (x + 10 + this.tooltipWidth > this.maxWidth)
            x = innerWidth - this.tooltipWidth - 10;
        if (y > innerHeight * 0.75 || y + 20 + this.tooltipHeight > this.maxHeight)
            y = y - this.tooltipHeight - 30;
        
        st.left = x + 10 + "px";
        st.top = y + 20 + "px";
    };

    this.$init = function() {
        tooltipNode = document.documentElement.appendChild(dom.createElement("div"));
        var st = tooltipNode.style;
        st.position = "fixed";
        st.display = "none";
        st.background = "lightyellow";
        st.borderRadius = "";
        st.border = "1px solid gray";
        st.padding = "1px";
        st.zIndex = 1000;
        st.fontFamily = "monospace";
        st.whiteSpace = "pre-line";
        return tooltipNode;
    };

    this.destroy = function() {
        this.onMouseOut();
        event.removeListener(this.editor.renderer.scroller, "mousemove", this.onMouseMove);
        event.removeListener(this.editor.renderer.content, "mouseout", this.onMouseOut);
        delete this.editor.tokenTooltip;    
    };

}).call(TokenTooltip.prototype);

exports.TokenTooltip = TokenTooltip;

});

