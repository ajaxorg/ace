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

var oop = require("../lib/oop");
var dom = require("../lib/dom");
var lang = require("../lib/lang");
var useragent = require("../lib/useragent");
var EventEmitter = require("../lib/event_emitter").EventEmitter;

var CHAR_COUNT = 0;

var FontMetrics = exports.FontMetrics = function(parentEl, interval) {
    this.el = dom.createElement("div");
    this.$setMeasureNodeStyles(this.el.style, true);
    
    this.$main = dom.createElement("div");
    this.$setMeasureNodeStyles(this.$main.style);
    
    this.$measureNode = dom.createElement("div");
    this.$setMeasureNodeStyles(this.$measureNode.style);
    
    
    this.el.appendChild(this.$main);
    this.el.appendChild(this.$measureNode);
    parentEl.appendChild(this.el);
    
    if (!CHAR_COUNT)
        this.$testFractionalRect();
    this.$measureNode.innerHTML = lang.stringRepeat("X", CHAR_COUNT);
    
    this.$characterSize = {width: 0, height: 0};
    this.checkForSizeChanges();
};

(function() {

    oop.implement(this, EventEmitter);
        
    this.$characterSize = {width: 0, height: 0};
    
    this.$testFractionalRect = function() {
        var el = dom.createElement("div");
        this.$setMeasureNodeStyles(el.style);
        el.style.width = "0.2px";
        document.documentElement.appendChild(el);
        var w = el.getBoundingClientRect().width;
        if (w > 0 && w < 1)
            CHAR_COUNT = 50;
        else
            CHAR_COUNT = 100;
        el.parentNode.removeChild(el);
    };
    
    this.$setMeasureNodeStyles = function(style, isRoot) {
        style.width = style.height = "auto";
        style.left = style.top = "0px";
        style.visibility = "hidden";
        style.position = "absolute";
        style.whiteSpace = "pre";

        if (useragent.isIE < 8) {
            style["font-family"] = "inherit";
        } else {
            style.font = "inherit";
        }
        style.overflow = isRoot ? "hidden" : "visible";
    };

    this.checkForSizeChanges = function() {
        var size = this.$measureSizes();
        if (size && (this.$characterSize.width !== size.width || this.$characterSize.height !== size.height)) {
            this.$measureNode.style.fontWeight = "bold";
            var boldSize = this.$measureSizes();
            this.$measureNode.style.fontWeight = "";
            this.$characterSize = size;
            this.charSizes = Object.create(null);
            this.allowBoldFonts = boldSize && boldSize.width === size.width && boldSize.height === size.height;
            this._emit("changeCharacterSize", {data: size});
        }
    };

    this.$pollSizeChanges = function() {
        if (this.$pollSizeChangesTimer)
            return this.$pollSizeChangesTimer;
        var self = this;
        return this.$pollSizeChangesTimer = setInterval(function() {
            self.checkForSizeChanges();
        }, 500);
    };
    
    this.setPolling = function(val) {
        if (val) {
            this.$pollSizeChanges();
        } else if (this.$pollSizeChangesTimer) {
            clearInterval(this.$pollSizeChangesTimer);
            this.$pollSizeChangesTimer = 0;
        }
    };

    this.$measureSizes = function() {
        if (CHAR_COUNT === 50) {
            var rect = null;
            try { 
               rect = this.$measureNode.getBoundingClientRect();
            } catch(e) {
               rect = {width: 0, height:0 };
            };
            var size = {
                height: rect.height,
                width: rect.width / CHAR_COUNT
            };
        } else {
            var size = {
                height: this.$measureNode.clientHeight,
                width: this.$measureNode.clientWidth / CHAR_COUNT
            };
        }
        // Size and width can be null if the editor is not visible or
        // detached from the document
        if (size.width === 0 || size.height === 0)
            return null;
        return size;
    };

    this.$measureCharWidth = function(ch) {
        this.$main.innerHTML = lang.stringRepeat(ch, CHAR_COUNT);
        var rect = this.$main.getBoundingClientRect();
        return rect.width / CHAR_COUNT;
    };
    
    this.getCharacterWidth = function(ch) {
        var w = this.charSizes[ch];
        if (w === undefined) {
            this.charSizes[ch] = this.$measureCharWidth(ch) / this.$characterSize.width;
        }
        return w;
    };
    
	/**
    * The distance to the next tab stop at the specified screen column.
    * @param {Number} screenColumn The screen column to check
    *
    *
    * @returns {Number}
    **/
    this.getScreenTabSize = function(screenColumn, tabSize) {
        return tabSize - screenColumn % tabSize;
    };
	
    this.getTextWidth = function(text, tabSize, maxTextLength, isRough) {
		var newText = '';
		var nonTabIdx = -1;
        maxTextLength = maxTextLength || Infinity;
		// If just checking for exceeding boundary, it is no need to check for actual extra long text width
        maxTextLength = Math.min(text.length, maxTextLength);
		for (var i=0; i<maxTextLength; i++) {
			if (text[i]=='\t') {
                if (i > nonTabIdx + 1)
                    newText += text.substring(nonTabIdx + 1, i);
				var tabSize = this.getScreenTabSize(newText.length, tabSize);
				newText += lang.stringRepeat(' ', tabSize);
                nonTabIdx = i;
			}
		}
        if (nonTabIdx < maxTextLength - 1)
            newText += text.substring(nonTabIdx + 1, maxTextLength);
        if (isRough) {
            // getBoundingClientRect().width is relative slow. Rough check the width and get the actual width when display
            return newText.length * this.$characterSize.width;
        }
        this.$main.textContent = newText;
        var rect = this.$main.getBoundingClientRect();
        return rect.width;
    };
    
    this.getMaxColumnInRect = function(text, width, tabSize) {
        var guestPos = Math.ceil(width / this.$characterSize.width);
        for (var i = Math.min(guestPos, text.length); i >= 0; i--) {
            if (text.charCodeAt(i) >= 0x4E00)    // First character of standard Chinese
                guestPos++;
            if (guestPos >= text.length)
                break;
        }
		var charLimit = 2 * guestPos;
        var pos = 0;
		var treshold = 0.01;
        var guestPosWidth = this.getTextWidth(text, tabSize, guestPos);
        width += treshold;
        if (guestPosWidth > width) {
            // Find until within limit
            for (var i = guestPos - 1; i >= 1; i--) {
                if (this.getTextWidth(text, tabSize, i) < width) {
                    pos = i;
                    break;
                }
            }
        } else {
            // Find until exceeds limit
            var maxLimit = Math.min(text.length, charLimit);
            pos = guestPos;
            for (var i = guestPos + 1; i < maxLimit; i++) {
                if (this.getTextWidth(text, tabSize, i) > width) {
                    pos = i - 1;
                    break;
                }
            }
        }
        return pos - 1;
    };

    this.destroy = function() {
        clearInterval(this.$pollSizeChangesTimer);
        if (this.el && this.el.parentNode)
            this.el.parentNode.removeChild(this.el);
    };

}).call(FontMetrics.prototype);

});
