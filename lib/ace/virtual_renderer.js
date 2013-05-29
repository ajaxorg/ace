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

var oop = require("./lib/oop");
var dom = require("./lib/dom");
var event = require("./lib/event");
var useragent = require("./lib/useragent");
var config = require("./config");
var GutterLayer = require("./layer/gutter").Gutter;
var MarkerLayer = require("./layer/marker").Marker;
var TextLayer = require("./layer/text").Text;
var CursorLayer = require("./layer/cursor").Cursor;
var ScrollBar = require("./scrollbar").ScrollBar;
var RenderLoop = require("./renderloop").RenderLoop;
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var editorCss = require("./requirejs/text!./css/editor.css");

dom.importCssString(editorCss, "ace_editor");

/**
 * The class that is responsible for drawing everything you see on the screen!
 * @class VirtualRenderer
 **/

/**
 * Constructs a new `VirtualRenderer` within the `container` specified, applying the given `theme`.
 * @param {DOMElement} container The root element of the editor
 * @param {String} theme The starting theme
 *
 * @constructor
 **/

var VirtualRenderer = function(container, theme) {
    var _self = this;

    this.container = container || dom.createElement("div");

    // TODO: this breaks rendering in Cloud9 with multiple ace instances
    // // Imports CSS once per DOM document ('ace_editor' serves as an identifier).
    // dom.importCssString(editorCss, "ace_editor", container.ownerDocument);

    // in IE <= 9 the native cursor always shines through
    this.$keepTextAreaAtCursor = !useragent.isIE;

    dom.addCssClass(this.container, "ace_editor");

    this.setTheme(theme);

    this.$gutter = dom.createElement("div");
    this.$gutter.className = "ace_gutter";
    this.container.appendChild(this.$gutter);

    this.scroller = dom.createElement("div");
    this.scroller.className = "ace_scroller";
    this.container.appendChild(this.scroller);

    this.content = dom.createElement("div");
    this.content.className = "ace_content";
    this.scroller.appendChild(this.content);

    this.$gutterLayer = new GutterLayer(this.$gutter);
    this.$gutterLayer.on("changeGutterWidth", this.onGutterResize.bind(this));

    this.$markerBack = new MarkerLayer(this.content);

    var textLayer = this.$textLayer = new TextLayer(this.content);
    this.canvas = textLayer.element;

    this.$markerFront = new MarkerLayer(this.content);

    this.$cursorLayer = new CursorLayer(this.content);

    // Indicates whether the horizontal scrollbar is visible
    this.$horizScroll = false;

    this.scrollBar = new ScrollBar(this.container);
    this.scrollBar.addEventListener("scroll", function(e) {
        if (!_self.$scrollAnimation)
            _self.session.setScrollTop(e.data);
    });

    this.scrollTop = 0;
    this.scrollLeft = 0;

    event.addListener(this.scroller, "scroll", function() {
        var scrollLeft = _self.scroller.scrollLeft;
        _self.scrollLeft = scrollLeft;
        _self.session.setScrollLeft(scrollLeft);
    });

    this.cursorPos = {
        row : 0,
        column : 0
    };

    this.$textLayer.addEventListener("changeCharacterSize", function() {
        _self.updateCharacterSize();
        _self.onResize(true);
    });

    this.$size = {
        width: 0,
        height: 0,
        scrollerHeight: 0,
        scrollerWidth: 0
    };

    this.layerConfig = {
        width : 1,
        padding : 0,
        firstRow : 0,
        firstRowScreen: 0,
        lastRow : 0,
        lineHeight : 1,
        characterWidth : 1,
        minHeight : 1,
        maxHeight : 1,
        offset : 0,
        height : 1
    };

    this.$loop = new RenderLoop(
        this.$renderChanges.bind(this),
        this.container.ownerDocument.defaultView
    );
    this.$loop.schedule(this.CHANGE_FULL);

    this.updateCharacterSize();
    this.setPadding(4);
    config.resetOptions(this);
    config._emit("renderer", this);
};

(function() {

    this.CHANGE_CURSOR = 1;
    this.CHANGE_MARKER = 2;
    this.CHANGE_GUTTER = 4;
    this.CHANGE_SCROLL = 8;
    this.CHANGE_LINES = 16;
    this.CHANGE_TEXT = 32;
    this.CHANGE_SIZE = 64;
    this.CHANGE_MARKER_BACK = 128;
    this.CHANGE_MARKER_FRONT = 256;
    this.CHANGE_FULL = 512;
    this.CHANGE_H_SCROLL = 1024;

    oop.implement(this, EventEmitter);

    this.updateCharacterSize = function() {
        if (this.$textLayer.allowBoldFonts != this.$allowBoldFonts) {
            this.$allowBoldFonts = this.$textLayer.allowBoldFonts;
            this.setStyle("ace_nobold", !this.$allowBoldFonts);
        }

        this.characterWidth = this.$textLayer.getCharacterWidth();
        this.lineHeight = this.$textLayer.getLineHeight();
        this.$updatePrintMargin();
    };

    /**
    *
    * Associates the renderer with an [[EditSession `EditSession`]].
    **/
    this.setSession = function(session) {
        this.session = session;

        this.scroller.className = "ace_scroller";

        this.$cursorLayer.setSession(session);
        this.$markerBack.setSession(session);
        this.$markerFront.setSession(session);
        this.$gutterLayer.setSession(session);
        this.$textLayer.setSession(session);
        this.$loop.schedule(this.CHANGE_FULL);

    };

    /**
    * Triggers a partial update of the text, from the range given by the two parameters.
    * @param {Number} firstRow The first row to update
    * @param {Number} lastRow The last row to update
    *
    *
    **/
    this.updateLines = function(firstRow, lastRow) {
        if (lastRow === undefined)
            lastRow = Infinity;

        if (!this.$changedLines) {
            this.$changedLines = {
                firstRow: firstRow,
                lastRow: lastRow
            };
        }
        else {
            if (this.$changedLines.firstRow > firstRow)
                this.$changedLines.firstRow = firstRow;

            if (this.$changedLines.lastRow < lastRow)
                this.$changedLines.lastRow = lastRow;
        }

        if (this.$changedLines.firstRow > this.layerConfig.lastRow ||
            this.$changedLines.lastRow < this.layerConfig.firstRow)
            return;
        this.$loop.schedule(this.CHANGE_LINES);
    };

    this.onChangeTabSize = function() {
        this.$loop.schedule(this.CHANGE_TEXT | this.CHANGE_MARKER);
        this.$textLayer.onChangeTabSize();
    };

    /**
    * Triggers a full update of the text, for all the rows.
    **/
    this.updateText = function() {
        this.$loop.schedule(this.CHANGE_TEXT);
    };

    /**
    * Triggers a full update of all the layers, for all the rows.
    * @param {Boolean} force If `true`, forces the changes through
    *
    *
    **/
    this.updateFull = function(force) {
        if (force)
            this.$renderChanges(this.CHANGE_FULL, true);
        else
            this.$loop.schedule(this.CHANGE_FULL);
    };

    /**
    *
    * Updates the font size.
    **/
    this.updateFontSize = function() {
        this.$textLayer.checkForSizeChanges();
    };

    /**
    * [Triggers a resize of the editor.]{: #VirtualRenderer.onResize}
    * @param {Boolean} force If `true`, recomputes the size, even if the height and width haven't changed
    * @param {Number} gutterWidth The width of the gutter in pixels
    * @param {Number} width The width of the editor in pixels
    * @param {Number} height The hiehgt of the editor, in pixels
    *
    *
    **/
    this.onResize = function(force, gutterWidth, width, height) {
        var changes = 0;
        var size = this.$size;

        if (this.resizing > 2)
            return;
        else if (this.resizing > 1)
            this.resizing++;
        else
            this.resizing = force ? 1 : 0;
        if (!height)
            height = dom.getInnerHeight(this.container);

        if (height && (force || size.height != height)) {
            size.height = height;
            changes = this.CHANGE_SIZE;

            size.scrollerHeight = this.scroller.clientHeight;
            if (force || !size.scrollerHeight) {
                size.scrollerHeight = size.height;
                if (this.$horizScroll)
                    size.scrollerHeight -= this.scrollBar.getWidth();
            }
            this.scrollBar.setHeight(size.scrollerHeight);

            if (this.session) {
                this.session.setScrollTop(this.getScrollTop());
                changes = changes | this.CHANGE_FULL;
            }
        }

        if (!width)
            width = dom.getInnerWidth(this.container);

        if (width && (force || this.resizing > 1 || size.width != width)) {
            changes = this.CHANGE_SIZE;
            size.width = width;

            var gutterWidth = this.$showGutter ? this.$gutter.offsetWidth : 0;
            this.scroller.style.left = gutterWidth + "px";
            size.scrollerWidth = Math.max(0, width - gutterWidth - this.scrollBar.getWidth());
            this.scroller.style.right = this.scrollBar.getWidth() + "px";

            if (this.session && this.session.getUseWrapMode() && this.adjustWrapLimit() || force)
                changes = changes | this.CHANGE_FULL;
        }

        if (!this.$size.scrollerHeight)
            return;

        if (force)
            this.$renderChanges(changes, true);
        else
            this.$loop.schedule(changes);

        if (force)
            this.$gutterLayer.$padding = null;

        if (force)
            delete this.resizing;
    };

    this.onGutterResize = function() {
        var width = this.$size.width;
        var gutterWidth = this.$showGutter ? this.$gutter.offsetWidth : 0;
        this.scroller.style.left = gutterWidth + "px";
        this.$size.scrollerWidth = Math.max(0, width - gutterWidth - this.scrollBar.getWidth());

        if (this.session.getUseWrapMode() && this.adjustWrapLimit())
            this.$loop.schedule(this.CHANGE_FULL);
        else
            this.$loop.schedule(this.CHANGE_MARKER);
    };

    /**
    * Adjusts the wrap limit, which is the number of characters that can fit within the width of the edit area on screen.
    **/
    this.adjustWrapLimit = function() {
        var availableWidth = this.$size.scrollerWidth - this.$padding * 2;
        var limit = Math.floor(availableWidth / this.characterWidth);
        return this.session.adjustWrapLimit(limit, this.$showPrintMargin && this.$printMarginColumn);
    };

    /**
    * Identifies whether you want to have an animated scroll or not.
    * @param {Boolean} shouldAnimate Set to `true` to show animated scrolls
    *
    **/
    this.setAnimatedScroll = function(shouldAnimate){
        this.setOption("animatedScroll", shouldAnimate);
    };

    /**
    * Returns whether an animated scroll happens or not.
    * @returns {Boolean}
    **/
    this.getAnimatedScroll = function() {
        return this.$animatedScroll;
    };

    /**
    * Identifies whether you want to show invisible characters or not.
    * @param {Boolean} showInvisibles Set to `true` to show invisibles
    *
    **/
    this.setShowInvisibles = function(showInvisibles) {
        this.setOption("showInvisibles", showInvisibles);
    };

    /**
    * Returns whether invisible characters are being shown or not.
    * @returns {Boolean}
    **/
    this.getShowInvisibles = function() {
        return this.getOption("showInvisibles");
    };
    this.getDisplayIndentGuides = function() {
        return this.getOption("displayIndentGuides");
    };

    this.setDisplayIndentGuides = function(display) {
        this.setOption("displayIndentGuides", display);
    };

    /**
    * Identifies whether you want to show the print margin or not.
    * @param {Boolean} showPrintMargin Set to `true` to show the print margin
    *
    **/
    this.setShowPrintMargin = function(showPrintMargin) {
        this.setOption("showPrintMargin", showPrintMargin);
    };

    /**
    * Returns whether the print margin is being shown or not.
    * @returns {Boolean}
    **/
    this.getShowPrintMargin = function() {
        return this.getOption("showPrintMargin");
    };
    /**
    * Identifies whether you want to show the print margin column or not.
    * @param {Boolean} showPrintMargin Set to `true` to show the print margin column
    *
    **/
    this.setPrintMarginColumn = function(showPrintMargin) {
        this.setOption("printMarginColumn", showPrintMargin);
    };

    /**
    * Returns whether the print margin column is being shown or not.
    * @returns {Boolean}
    **/
    this.getPrintMarginColumn = function() {
        return this.getOption("printMarginColumn");
    };

    /**
    * Returns `true` if the gutter is being shown.
    * @returns {Boolean}
    **/
    this.getShowGutter = function(){
        return this.getOption("showGutter");
    };

    /**
    * Identifies whether you want to show the gutter or not.
    * @param {Boolean} show Set to `true` to show the gutter
    *
    **/
    this.setShowGutter = function(show){
        return this.setOption("showGutter", show);
    };

    this.getFadeFoldWidgets = function(){
        return this.getOption("fadeFoldWidgets")
    };

    this.setFadeFoldWidgets = function(show) {
        this.setOption("fadeFoldWidgets", show);
    };

    this.setHighlightGutterLine = function(shouldHighlight) {
        this.setOption("highlightGutterLine", shouldHighlight);
    };

    this.getHighlightGutterLine = function() {
        return this.getOption("highlightGutterLine");
    };

    this.$updateGutterLineHighlight = function() {
        var pos = this.$cursorLayer.$pixelPos;
        var height = this.layerConfig.lineHeight;
        if (this.session.getUseWrapMode()) {
            var cursor = this.session.selection.getCursor();
            cursor.column = 0;
            pos = this.$cursorLayer.getPixelPosition(cursor, true);
            height *= this.session.getRowLength(cursor.row);
        }
        this.$gutterLineHighlight.style.top = pos.top - this.layerConfig.offset + "px";
        this.$gutterLineHighlight.style.height = height + "px";
    };

    this.$updatePrintMargin = function() {
        if (!this.$showPrintMargin && !this.$printMarginEl)
            return;

        if (!this.$printMarginEl) {
            var containerEl = dom.createElement("div");
            containerEl.className = "ace_layer ace_print-margin-layer";
            this.$printMarginEl = dom.createElement("div");
            this.$printMarginEl.className = "ace_print-margin";
            containerEl.appendChild(this.$printMarginEl);
            this.content.insertBefore(containerEl, this.content.firstChild);
        }

        var style = this.$printMarginEl.style;
        style.left = ((this.characterWidth * this.$printMarginColumn) + this.$padding) + "px";
        style.visibility = this.$showPrintMargin ? "visible" : "hidden";
        
        if (this.session && this.session.$wrap == -1)
            this.adjustWrapLimit();
    };

    /**
    *
    * Returns the root element containing this renderer.
    * @returns {DOMElement}
    **/
    this.getContainerElement = function() {
        return this.container;
    };

    /**
    *
    * Returns the element that the mouse events are attached to
    * @returns {DOMElement}
    **/
    this.getMouseEventTarget = function() {
        return this.content;
    };

    /**
    *
    * Returns the element to which the hidden text area is added.
    * @returns {DOMElement}
    **/
    this.getTextAreaContainer = function() {
        return this.container;
    };

    // move text input over the cursor
    // this is required for iOS and IME
    this.$moveTextAreaToCursor = function() {
        if (!this.$keepTextAreaAtCursor)
            return;
        var config = this.layerConfig;
        var posTop = this.$cursorLayer.$pixelPos.top;
        var posLeft = this.$cursorLayer.$pixelPos.left;
        posTop -= config.offset;

        var h = this.lineHeight;
        if (posTop < 0 || posTop > config.height - h)
            return;

        var w = this.characterWidth;
        if (this.$composition) {
            var val = this.textarea.value.replace(/^\x01+/, "");
            w *= (this.session.$getStringScreenWidth(val)[0]+2);
            h += 2;
            posTop -= 1;
        }
        posLeft -= this.scrollLeft;
        if (posLeft > this.$size.scrollerWidth - w)
            posLeft = this.$size.scrollerWidth - w;

        posLeft -= this.scrollBar.width;

        this.textarea.style.height = h + "px";
        this.textarea.style.width = w + "px";
        this.textarea.style.right = Math.max(0, this.$size.scrollerWidth - posLeft - w) + "px";
        this.textarea.style.bottom = Math.max(0, this.$size.height - posTop - h) + "px";
    };

    /**
    *
    * [Returns the index of the first visible row.]{: #VirtualRenderer.getFirstVisibleRow}
    * @returns {Number}
    **/
    this.getFirstVisibleRow = function() {
        return this.layerConfig.firstRow;
    };

    /**
    *
    * Returns the index of the first fully visible row. "Fully" here means that the characters in the row are not truncated; that the top and the bottom of the row are on the screen.
    * @returns {Number}
    **/
    this.getFirstFullyVisibleRow = function() {
        return this.layerConfig.firstRow + (this.layerConfig.offset === 0 ? 0 : 1);
    };

    /**
    *
    * Returns the index of the last fully visible row. "Fully" here means that the characters in the row are not truncated; that the top and the bottom of the row are on the screen.
    * @returns {Number}
    **/
    this.getLastFullyVisibleRow = function() {
        var flint = Math.floor((this.layerConfig.height + this.layerConfig.offset) / this.layerConfig.lineHeight);
        return this.layerConfig.firstRow - 1 + flint;
    };

    /**
    *
    * [Returns the index of the last visible row.]{: #VirtualRenderer.getLastVisibleRow}
    * @returns {Number}
    **/
    this.getLastVisibleRow = function() {
        return this.layerConfig.lastRow;
    };

    this.$padding = null;

    /**
    * Sets the padding for all the layers.
    * @param {Number} padding A new padding value (in pixels)
    *
    *
    *
    **/
    this.setPadding = function(padding) {
        this.$padding = padding;
        this.$textLayer.setPadding(padding);
        this.$cursorLayer.setPadding(padding);
        this.$markerFront.setPadding(padding);
        this.$markerBack.setPadding(padding);
        this.$loop.schedule(this.CHANGE_FULL);
        this.$updatePrintMargin();
    };

    /**
    *
    * Returns whether the horizontal scrollbar is set to be always visible.
    * @returns {Boolean}
    **/
    this.getHScrollBarAlwaysVisible = function() {
        return this.$hScrollBarAlwaysVisible;
    };

    /**
    * Identifies whether you want to show the horizontal scrollbar or not.
    * @param {Boolean} alwaysVisible Set to `true` to make the horizontal scroll bar visible
    *
    *
    **/
    this.setHScrollBarAlwaysVisible = function(alwaysVisible) {
        this.setOption("hScrollBarAlwaysVisible", alwaysVisible);
    };

    this.$updateScrollBar = function() {
        this.scrollBar.setInnerHeight(this.layerConfig.maxHeight);
        this.scrollBar.setScrollTop(this.scrollTop);
    };

    this.$renderChanges = function(changes, force) {
        if (!force && (!changes || !this.session || !this.container.offsetWidth))
            return;

        this._signal("beforeRender");
        // text, scrolling and resize changes can cause the view port size to change
        if (changes & this.CHANGE_FULL ||
            changes & this.CHANGE_SIZE ||
            changes & this.CHANGE_TEXT ||
            changes & this.CHANGE_LINES ||
            changes & this.CHANGE_SCROLL
        )
            this.$computeLayerConfig();

        // horizontal scrolling
        if (changes & this.CHANGE_H_SCROLL) {
            this.scroller.scrollLeft = this.scrollLeft;

            // read the value after writing it since the value might get clipped
            var scrollLeft = this.scroller.scrollLeft;
            this.scrollLeft = scrollLeft;
            this.session.setScrollLeft(scrollLeft);

            this.scroller.className = this.scrollLeft == 0 ? "ace_scroller" : "ace_scroller ace_scroll-left";
        }

        // full
        if (changes & this.CHANGE_FULL) {
            this.$textLayer.checkForSizeChanges();
            // update scrollbar first to not lose scroll position when gutter calls resize
            this.$updateScrollBar();
            this.$textLayer.update(this.layerConfig);
            if (this.$showGutter)
                this.$gutterLayer.update(this.layerConfig);
            this.$markerBack.update(this.layerConfig);
            this.$markerFront.update(this.layerConfig);
            this.$cursorLayer.update(this.layerConfig);
            this.$moveTextAreaToCursor();
            this.$highlightGutterLine && this.$updateGutterLineHighlight();
            this._signal("afterRender");
            return;
        }

        // scrolling
        if (changes & this.CHANGE_SCROLL) {
            if (changes & this.CHANGE_TEXT || changes & this.CHANGE_LINES)
                this.$textLayer.update(this.layerConfig);
            else
                this.$textLayer.scrollLines(this.layerConfig);

            if (this.$showGutter)
                this.$gutterLayer.update(this.layerConfig);
            this.$markerBack.update(this.layerConfig);
            this.$markerFront.update(this.layerConfig);
            this.$cursorLayer.update(this.layerConfig);
            this.$highlightGutterLine && this.$updateGutterLineHighlight();
            this.$moveTextAreaToCursor();
            this.$updateScrollBar();
            this._signal("afterRender");
            return;
        }

        if (changes & this.CHANGE_TEXT) {
            this.$textLayer.update(this.layerConfig);
            if (this.$showGutter)
                this.$gutterLayer.update(this.layerConfig);
        }
        else if (changes & this.CHANGE_LINES) {
            if (this.$updateLines() || (changes & this.CHANGE_GUTTER) && this.$showGutter)
                this.$gutterLayer.update(this.layerConfig);
        }
        else if (changes & this.CHANGE_TEXT || changes & this.CHANGE_GUTTER) {
            if (this.$showGutter)
                this.$gutterLayer.update(this.layerConfig);
        }

        if (changes & this.CHANGE_CURSOR) {
            this.$cursorLayer.update(this.layerConfig);
            this.$moveTextAreaToCursor();
            this.$highlightGutterLine && this.$updateGutterLineHighlight();
        }

        if (changes & (this.CHANGE_MARKER | this.CHANGE_MARKER_FRONT)) {
            this.$markerFront.update(this.layerConfig);
        }

        if (changes & (this.CHANGE_MARKER | this.CHANGE_MARKER_BACK)) {
            this.$markerBack.update(this.layerConfig);
        }

        if (changes & this.CHANGE_SIZE)
            this.$updateScrollBar();

        this._signal("afterRender");
    };

    this.$computeLayerConfig = function() {
        if (!this.$size.scrollerHeight)
            return this.onResize(true);

        var session = this.session;

        var offset = this.scrollTop % this.lineHeight;
        var minHeight = this.$size.scrollerHeight + this.lineHeight;

        var longestLine = this.$getLongestLine();

        var horizScroll = this.$hScrollBarAlwaysVisible || this.$size.scrollerWidth - longestLine < 0;
        var horizScrollChanged = this.$horizScroll !== horizScroll;
        this.$horizScroll = horizScroll;
        if (horizScrollChanged) {
            this.scroller.style.overflowX = horizScroll ? "scroll" : "hidden";
            // when we hide scrollbar scroll event isn't emited
            // leaving session with wrong scrollLeft value
            if (!horizScroll)
                this.session.setScrollLeft(0);
        }
        var maxHeight = this.session.getScreenLength() * this.lineHeight;
        this.session.setScrollTop(Math.max(0, Math.min(this.scrollTop, maxHeight - this.$size.scrollerHeight)));

        var lineCount = Math.ceil(minHeight / this.lineHeight) - 1;
        var firstRow = Math.max(0, Math.round((this.scrollTop - offset) / this.lineHeight));
        var lastRow = firstRow + lineCount;

        // Map lines on the screen to lines in the document.
        var firstRowScreen, firstRowHeight;
        var lineHeight = this.lineHeight;
        firstRow = session.screenToDocumentRow(firstRow, 0);

        // Check if firstRow is inside of a foldLine. If true, then use the first
        // row of the foldLine.
        var foldLine = session.getFoldLine(firstRow);
        if (foldLine) {
            firstRow = foldLine.start.row;
        }

        firstRowScreen = session.documentToScreenRow(firstRow, 0);
        firstRowHeight = session.getRowLength(firstRow) * lineHeight;

        lastRow = Math.min(session.screenToDocumentRow(lastRow, 0), session.getLength() - 1);
        minHeight = this.$size.scrollerHeight + session.getRowLength(lastRow) * lineHeight +
                                                firstRowHeight;

        offset = this.scrollTop - firstRowScreen * lineHeight;

        this.layerConfig = {
            width : longestLine,
            padding : this.$padding,
            firstRow : firstRow,
            firstRowScreen: firstRowScreen,
            lastRow : lastRow,
            lineHeight : lineHeight,
            characterWidth : this.characterWidth,
            minHeight : minHeight,
            maxHeight : maxHeight,
            offset : offset,
            height : this.$size.scrollerHeight
        };

        // For debugging.
        // console.log(JSON.stringify(this.layerConfig));

        this.$gutterLayer.element.style.marginTop = (-offset) + "px";
        this.content.style.marginTop = (-offset) + "px";
        this.content.style.width = longestLine + 2 * this.$padding + "px";
        this.content.style.height = minHeight + "px";

        // Horizontal scrollbar visibility may have changed, which changes
        // the client height of the scroller
        if (horizScrollChanged)
            this.onResize(true);
    };

    this.$updateLines = function() {
        var firstRow = this.$changedLines.firstRow;
        var lastRow = this.$changedLines.lastRow;
        this.$changedLines = null;

        var layerConfig = this.layerConfig;

        if (firstRow > layerConfig.lastRow + 1) { return; }
        if (lastRow < layerConfig.firstRow) { return; }

        // if the last row is unknown -> redraw everything
        if (lastRow === Infinity) {
            if (this.$showGutter)
                this.$gutterLayer.update(layerConfig);
            this.$textLayer.update(layerConfig);
            return;
        }

        // else update only the changed rows
        this.$textLayer.updateLines(layerConfig, firstRow, lastRow);
        return true;
    };

    this.$getLongestLine = function() {
        var charCount = this.session.getScreenWidth();
        if (this.$textLayer.showInvisibles)
            charCount += 1;

        return Math.max(this.$size.scrollerWidth - 2 * this.$padding, Math.round(charCount * this.characterWidth));
    };

    /**
    *
    * Schedules an update to all the front markers in the document.
    **/
    this.updateFrontMarkers = function() {
        this.$markerFront.setMarkers(this.session.getMarkers(true));
        this.$loop.schedule(this.CHANGE_MARKER_FRONT);
    };

    /**
    *
    * Schedules an update to all the back markers in the document.
    **/
    this.updateBackMarkers = function() {
        this.$markerBack.setMarkers(this.session.getMarkers());
        this.$loop.schedule(this.CHANGE_MARKER_BACK);
    };

    /**
    *
    * Deprecated; (moved to [[EditSession]])
    * @deprecated
    **/
    this.addGutterDecoration = function(row, className){
        this.$gutterLayer.addGutterDecoration(row, className);
    };

    /**
    * Deprecated; (moved to [[EditSession]])
    * @deprecated
    **/
    this.removeGutterDecoration = function(row, className){
        this.$gutterLayer.removeGutterDecoration(row, className);
    };

    /**
    *
    * Redraw breakpoints.
    **/
    this.updateBreakpoints = function(rows) {
        this.$loop.schedule(this.CHANGE_GUTTER);
    };

    /**
    *
    * Sets annotations for the gutter.
    * @param {Array} annotations An array containing annotations
    *
    *
    **/
    this.setAnnotations = function(annotations) {
        this.$gutterLayer.setAnnotations(annotations);
        this.$loop.schedule(this.CHANGE_GUTTER);
    };

    /**
    *
    * Updates the cursor icon.
    **/
    this.updateCursor = function() {
        this.$loop.schedule(this.CHANGE_CURSOR);
    };

    /**
    *
    * Hides the cursor icon.
    **/
    this.hideCursor = function() {
        this.$cursorLayer.hideCursor();
    };

    /**
    *
    * Shows the cursor icon.
    **/
    this.showCursor = function() {
        this.$cursorLayer.showCursor();
    };

    this.scrollSelectionIntoView = function(anchor, lead, offset) {
        // first scroll anchor into view then scroll lead into view
        this.scrollCursorIntoView(anchor, offset);
        this.scrollCursorIntoView(lead, offset);
    };

    /**
    *
    * Scrolls the cursor into the first visibile area of the editor
    **/
    this.scrollCursorIntoView = function(cursor, offset) {
        // the editor is not visible
        if (this.$size.scrollerHeight === 0)
            return;

        var pos = this.$cursorLayer.getPixelPosition(cursor);

        var left = pos.left;
        var top = pos.top;

        if (this.scrollTop > top) {
            if (offset)
                top -= offset * this.$size.scrollerHeight;
            this.session.setScrollTop(top);
        } else if (this.scrollTop + this.$size.scrollerHeight < top + this.lineHeight) {
            if (offset)
                top += offset * this.$size.scrollerHeight;
            this.session.setScrollTop(top + this.lineHeight - this.$size.scrollerHeight);
        }

        var scrollLeft = this.scrollLeft;

        if (scrollLeft > left) {
            if (left < this.$padding + 2 * this.layerConfig.characterWidth)
                left = 0;
            this.session.setScrollLeft(left);
        } else if (scrollLeft + this.$size.scrollerWidth < left + this.characterWidth) {
            this.session.setScrollLeft(Math.round(left + this.characterWidth - this.$size.scrollerWidth));
        }
    };

    /**
    * {:EditSession.getScrollTop}
    * @related EditSession.getScrollTop
    * @returns {Number}
    **/
    this.getScrollTop = function() {
        return this.session.getScrollTop();
    };

    /**
    * {:EditSession.getScrollLeft}
    * @related EditSession.getScrollLeft
    * @returns {Number}
    **/
    this.getScrollLeft = function() {
        return this.session.getScrollLeft();
    };

    /**
    *
    * Returns the first visible row, regardless of whether it's fully visible or not.
    * @returns {Number}
    **/
    this.getScrollTopRow = function() {
        return this.scrollTop / this.lineHeight;
    };

    /**
    *
    * Returns the last visible row, regardless of whether it's fully visible or not.
    * @returns {Number}
    **/
    this.getScrollBottomRow = function() {
        return Math.max(0, Math.floor((this.scrollTop + this.$size.scrollerHeight) / this.lineHeight) - 1);
    };

    /**
    * Gracefully scrolls from the top of the editor to the row indicated.
    * @param {Number} row A row id
    *
    *
    * @related EditSession.setScrollTop
    **/
    this.scrollToRow = function(row) {
        this.session.setScrollTop(row * this.lineHeight);
    };

    this.alignCursor = function(cursor, alignment) {
        if (typeof cursor == "number")
            cursor = {row: cursor, column: 0};

        var pos = this.$cursorLayer.getPixelPosition(cursor);
        var h = this.$size.scrollerHeight - this.lineHeight;
        var offset = pos.top - h * (alignment || 0);

        this.session.setScrollTop(offset);
        return offset;
    };

    this.STEPS = 8;
    this.$calcSteps = function(fromValue, toValue){
        var i = 0;
        var l = this.STEPS;
        var steps = [];

        var func  = function(t, x_min, dx) {
            return dx * (Math.pow(t - 1, 3) + 1) + x_min;
        };

        for (i = 0; i < l; ++i)
            steps.push(func(i / this.STEPS, fromValue, toValue - fromValue));

        return steps;
    };

    /**
    * Gracefully scrolls the editor to the row indicated.
    * @param {Number} line A line number
    * @param {Boolean} center If `true`, centers the editor the to indicated line
    * @param {Boolean} animate If `true` animates scrolling
    * @param {Function} callback Function to be called after the animation has finished
    *
    *
    **/
    this.scrollToLine = function(line, center, animate, callback) {
        var pos = this.$cursorLayer.getPixelPosition({row: line, column: 0});
        var offset = pos.top;
        if (center)
            offset -= this.$size.scrollerHeight / 2;

        var initialScroll = this.scrollTop;
        this.session.setScrollTop(offset);
        if (animate !== false)
            this.animateScrolling(initialScroll, callback);
    };

    this.animateScrolling = function(fromValue, callback) {
        var toValue = this.scrollTop;
        if (this.$animatedScroll) {
            var _self = this;
            var steps = _self.$calcSteps(fromValue, toValue);
            this.$scrollAnimation = {from: fromValue, to: toValue};

            clearInterval(this.$timer);

            _self.session.setScrollTop(steps.shift());
            this.$timer = setInterval(function() {
                if (steps.length) {
                    _self.session.setScrollTop(steps.shift());
                    // trick session to think it's already scrolled to not loose toValue
                    _self.session.$scrollTop = toValue;
                } else if (toValue != null) {
                    _self.session.$scrollTop = -1;
                    _self.session.setScrollTop(toValue);
                    toValue = null;
                } else {
                    // do this on separate step to not get spurious scroll event from scrollbar
                    _self.$timer = clearInterval(_self.$timer);
                    _self.$scrollAnimation = null;
                    callback && callback();
                }
            }, 10);
        }
    };

    /**
    * Scrolls the editor to the y pixel indicated.
    * @param {Number} scrollTop The position to scroll to
    *
    *
    * @returns {Number}
    **/
    this.scrollToY = function(scrollTop) {
        // after calling scrollBar.setScrollTop
        // scrollbar sends us event with same scrollTop. ignore it
        if (this.scrollTop !== scrollTop) {
            this.$loop.schedule(this.CHANGE_SCROLL);
            this.scrollTop = scrollTop;
        }
    };

    /**
    * Scrolls the editor across the x-axis to the pixel indicated.
    * @param {Number} scrollLeft The position to scroll to
    *
    *
    * @returns {Number}
    **/
    this.scrollToX = function(scrollLeft) {
        if (scrollLeft < 0)
            scrollLeft = 0;

        if (this.scrollLeft !== scrollLeft)
            this.scrollLeft = scrollLeft;
        this.$loop.schedule(this.CHANGE_H_SCROLL);
    };

    /**
    * Scrolls the editor across both x- and y-axes.
    * @param {Number} deltaX The x value to scroll by
    * @param {Number} deltaY The y value to scroll by
    *
    *
    **/
    this.scrollBy = function(deltaX, deltaY) {
        deltaY && this.session.setScrollTop(this.session.getScrollTop() + deltaY);
        deltaX && this.session.setScrollLeft(this.session.getScrollLeft() + deltaX);
    };

    /**
    * Returns `true` if you can still scroll by either parameter; in other words, you haven't reached the end of the file or line.
    * @param {Number} deltaX The x value to scroll by
    * @param {Number} deltaY The y value to scroll by
    *
    *
    * @returns {Boolean}
    **/
    this.isScrollableBy = function(deltaX, deltaY) {
        if (deltaY < 0 && this.session.getScrollTop() >= 1)
           return true;
        if (deltaY > 0 && this.session.getScrollTop() + this.$size.scrollerHeight - this.layerConfig.maxHeight < -1)
           return true;
        // todo: handle horizontal scrolling
    };

    this.pixelToScreenCoordinates = function(x, y) {
        var canvasPos = this.scroller.getBoundingClientRect();

        var offset = (x + this.scrollLeft - canvasPos.left - this.$padding) / this.characterWidth;
        var row = Math.floor((y + this.scrollTop - canvasPos.top) / this.lineHeight);
        var col = Math.round(offset);

        return {row: row, column: col, side: offset - col > 0 ? 1 : -1};
    };

    this.screenToTextCoordinates = function(x, y) {
        var canvasPos = this.scroller.getBoundingClientRect();

        var col = Math.round(
            (x + this.scrollLeft - canvasPos.left - this.$padding) / this.characterWidth
        );
        var row = Math.floor(
            (y + this.scrollTop - canvasPos.top) / this.lineHeight
        );

        return this.session.screenToDocumentPosition(row, Math.max(col, 0));
    };

    /**
    * Returns an object containing the `pageX` and `pageY` coordinates of the document position.
    * @param {Number} row The document row position
    * @param {Number} column The document column position
    *
    *
    *
    * @returns {Object}
    **/
    this.textToScreenCoordinates = function(row, column) {
        var canvasPos = this.scroller.getBoundingClientRect();
        var pos = this.session.documentToScreenPosition(row, column);

        var x = this.$padding + Math.round(pos.column * this.characterWidth);
        var y = pos.row * this.lineHeight;

        return {
            pageX: canvasPos.left + x - this.scrollLeft,
            pageY: canvasPos.top + y - this.scrollTop
        };
    };

    /**
    *
    * Focuses the current container.
    **/
    this.visualizeFocus = function() {
        dom.addCssClass(this.container, "ace_focus");
    };

    /**
    *
    * Blurs the current container.
    **/
    this.visualizeBlur = function() {
        dom.removeCssClass(this.container, "ace_focus");
    };

    /**
    * @param {Number} position
    *
    * @private
    **/
    this.showComposition = function(position) {
        if (!this.$composition)
            this.$composition = {
                keepTextAreaAtCursor: this.$keepTextAreaAtCursor,
                cssText: this.textarea.style.cssText
            };

        this.$keepTextAreaAtCursor = true;
        dom.addCssClass(this.textarea, "ace_composition");
        this.textarea.style.cssText = "";
        this.$moveTextAreaToCursor();
    };

    /**
    * @param {String} text A string of text to use
    *
    * Sets the inner text of the current composition to `text`.
    **/
    this.setCompositionText = function(text) {
        this.$moveTextAreaToCursor();
    };

    /**
    *
    * Hides the current composition.
    **/
    this.hideComposition = function() {
        if (!this.$composition)
            return;

        dom.removeCssClass(this.textarea, "ace_composition");
        this.$keepTextAreaAtCursor = this.$composition.keepTextAreaAtCursor;
        this.textarea.style.cssText = this.$composition.cssText;
        this.$composition = null;
    };

    /**
    * [Sets a new theme for the editor. `theme` should exist, and be a directory path, like `ace/theme/textmate`.]{: #VirtualRenderer.setTheme}
    * @param {String} theme The path to a theme
    *
    *
    **/
    this.setTheme = function(theme) {
        var _self = this;
        this.$themeValue = theme;
        _self._dispatchEvent('themeChange',{theme:theme});

        if (!theme || typeof theme == "string") {
            var moduleName = theme || "ace/theme/textmate";
            config.loadModule(["theme", moduleName], afterLoad);
        } else {
            afterLoad(theme);
        }

        function afterLoad(module) {
            if (_self.$themeValue != theme)
                return;
            if (!module.cssClass)
                return;
            dom.importCssString(
                module.cssText,
                module.cssClass,
                _self.container.ownerDocument
            );

            if (_self.theme)
                dom.removeCssClass(_self.container, _self.theme.cssClass);

            // this is kept only for backwards compatibility
            _self.$theme = module.cssClass;

            _self.theme = module;
            dom.addCssClass(_self.container, module.cssClass);
            dom.setCssClass(_self.container, "ace_dark", module.isDark);

            var padding = module.padding || 4;
            if (_self.$padding && padding != _self.$padding)
                _self.setPadding(padding);

            // force re-measure of the gutter width
            if (_self.$size) {
                _self.$size.width = 0;
                _self.onResize();
            }

            _self._dispatchEvent('themeLoaded',{theme:module});
        }
    };

    /**
    * [Returns the path of the current theme.]{: #VirtualRenderer.getTheme}
    * @returns {String}
    **/
    this.getTheme = function() {
        return this.$themeValue;
    };

    // Methods allows to add / remove CSS classnames to the editor element.
    // This feature can be used by plug-ins to provide a visual indication of
    // a certain mode that editor is in.

    /**
    * [Adds a new class, `style`, to the editor.]{: #VirtualRenderer.setStyle}
    * @param {String} style A class name
    *
    *
    **/
    this.setStyle = function setStyle(style, include) {
        dom.setCssClass(this.container, style, include != false);
    };

    /**
    * [Removes the class `style` from the editor.]{: #VirtualRenderer.unsetStyle}
    * @param {String} style A class name
    *
    *
    **/
    this.unsetStyle = function unsetStyle(style) {
        dom.removeCssClass(this.container, style);
    };

    /**
    *
    * Destroys the text and cursor layers for this renderer.
    **/
    this.destroy = function() {
        this.$textLayer.destroy();
        this.$cursorLayer.destroy();
    };

}).call(VirtualRenderer.prototype);


config.defineOptions(VirtualRenderer.prototype, "renderer", {
    animatedScroll: {initialValue: false},
    showInvisibles: {
        set: function(value) {
            if (this.$textLayer.setShowInvisibles(value))
                this.$loop.schedule(this.CHANGE_TEXT);
        },
        initialValue: false
    },
    showPrintMargin: {
        set: function() { this.$updatePrintMargin(); },
        initialValue: true
    },
    printMarginColumn: {
        set: function() { this.$updatePrintMargin(); },
        initialValue: 80
    },
    printMargin: {
        set: function(val) {
            if (typeof val == "number")
                this.$printMarginColumn = val;
            this.$showPrintMargin = !!val;
            this.$updatePrintMargin();
        },
        get: function() {
            return this.$showPrintMargin && this.$printMarginColumn; 
        }
    },
    showGutter: {
        set: function(show){
            this.$gutter.style.display = show ? "block" : "none";
            this.onGutterResize();
        },
        initialValue: true
    },
    fadeFoldWidgets: {
        set: function(show) {
            dom.setCssClass(this.$gutter, "ace_fade-fold-widgets", show);
        },
        initialValue: false
    },
    showFoldWidgets: {
        set: function(show) {this.$gutterLayer.setShowFoldWidgets(show)},
        initialValue: true
    },
    displayIndentGuides: {
        set: function(show) {
            if (this.$textLayer.setDisplayIndentGuides(show))
                this.$loop.schedule(this.CHANGE_TEXT);
        },
        initialValue: true
    },
    highlightGutterLine: {
        set: function(shouldHighlight) {
            if (!this.$gutterLineHighlight) {
                this.$gutterLineHighlight = dom.createElement("div");
                this.$gutterLineHighlight.className = "ace_gutter-active-line";
                this.$gutter.appendChild(this.$gutterLineHighlight);
                return;
            }

            this.$gutterLineHighlight.style.display = shouldHighlight ? "" : "none";
            // if cursorlayer have never been updated there's nothing on screen to update
            if (this.$cursorLayer.$pixelPos)
                this.$updateGutterLineHighlight();
        },
        initialValue: false,
        value: true
    },
    hScrollBarAlwaysVisible: {
        set: function(alwaysVisible) {
            this.$hScrollBarAlwaysVisible = alwaysVisible;
            if (!this.$hScrollBarAlwaysVisible || !this.$horizScroll)
                this.$loop.schedule(this.CHANGE_SCROLL);
        },
        initialValue: false
    },
    fontSize:  {
        set: function(size) {
            if (typeof size == "number")
                size = size + "px";
            this.container.style.fontSize = size;
            this.updateFontSize();
        },
        initialValue: 12
    },
    fontFamily: {
        set: function(name) {
            this.container.style.fontFamily = name;
            this.updateFontSize();
        }
    }
});

exports.VirtualRenderer = VirtualRenderer;
});
