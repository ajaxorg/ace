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
 *      Fabian Jakobs <fabian@ajax.org>
 *      Irakli Gozalishvili <rfobic@gmail.com> (http://jeditoolkit.com)
 *      Julian Viereck <julian.viereck@gmail.com>
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

var oop = require("pilot/oop");
var dom = require("pilot/dom");
var event = require("pilot/event");
var useragent = require("pilot/useragent");
var GutterLayer = require("ace/view/layer/gutter").Gutter;
var MarkerLayer = require("ace/view/layer/marker").Marker;
var TextLayer = require("ace/view/layer/text").Text;
var CursorLayer = require("ace/view/layer/cursor").Cursor;
var ScrollBar = require("ace/scrollbar").ScrollBar;
var RenderLoop = require("ace/renderloop").RenderLoop;
var MeasureText = require("ace/view/measure_text").MeasureText;
var EventEmitter = require("pilot/event_emitter").EventEmitter;
var editorCss = require("text!ace/view/css/editor.css");

// import CSS once
dom.importCssString(editorCss);

var WindowView = function(windowModel, container) {
    this.model = windowModel;
    this.container = container;
    dom.addCssClass(this.container, "ace_editor");

    this.$gutter = dom.createElement("div");
    this.$gutter.className = "ace_gutter";
    this.container.appendChild(this.$gutter);

    this.scroller = dom.createElement("div");
    this.scroller.className = "ace_scroller";
    this.container.appendChild(this.scroller);

    this.content = dom.createElement("div");
    this.content.className = "ace_content";
    this.scroller.appendChild(this.content);

    this.$gutterLayer = new GutterLayer(windowModel, this.$gutter);
    this.$markerBack = new MarkerLayer(windowModel, this.content);

    var textLayer = this.$textLayer = new TextLayer(windowModel, this.content);
    this.canvas = textLayer.element;

    this.$markerFront = new MarkerLayer(windowModel, this.content);

    var measureText = this.$measureText = new MeasureText(this.container, 300);
    measureText.on("changeCharacterSize", function() {
        windowModel.setComputedCharacterSize(measureText.getCharacterSize());
    });
    windowModel.setComputedCharacterSize(measureText.getCharacterSize());

    this.$cursorLayer = new CursorLayer(windowModel, this.content);
    this.$horizScroll = true;

    this.scrollTop = 0;
    this.scrollLeft = 0;
    this.scrollBar = new ScrollBar(container);
    this.scrollBar.addEventListener("scroll", this.onScroll.bind(this));
    
    var _self = this;
    event.addListener(this.scroller, "scroll", function() {
        _self.scrollToX(_self.scroller.scrollLeft);
    });

    event.addListener(this.$gutter, "click", this.$onGutterClick.bind(this));
    event.addListener(this.$gutter, "dblclick", this.$onGutterClick.bind(this));
    
    this.$loop = new RenderLoop(this.$renderChanges.bind(this));
    this.$loop.schedule(this.CHANGE_FULL);

    this.updatePadding();
    this.updatePrintMargin();
    this.updateHorizScroll();
    this.updateCharacterSize();
    this.updateTheme();
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

    oop.implement(this, EventEmitter);

    this.setSession = function(session) {
        this.session = session;
        this.$cursorLayer.setSession(session);
        this.$markerBack.setSession(session);
        this.$markerFront.setSession(session);
        this.$gutterLayer.setSession(session);
        this.$textLayer.setSession(session);
        this.$loop.schedule(this.CHANGE_FULL);
    };

    /**
     * Triggers partial update of the text layer
     */
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

        this.$loop.schedule(this.CHANGE_LINES);
    };

    /**
     * Triggers full update of the text layer
     */
    this.updateText = function() {
        this.$loop.schedule(this.CHANGE_TEXT);
    };

    /**
     * Triggers a full update of all layers
     */
    this.updateFull = function() {
        this.$loop.schedule(this.CHANGE_FULL);
    };

    this.updateFontSize = function() {
        this.$textLayer.checkForSizeChanges();
    };

    /**
     * Triggers resize of the editor
     */
    this.onResize = function(force) {
        if (!this.scroller || !this.container || !this.session)
            return;
            
        var changes = this.CHANGE_SIZE;
        var size = this.model.size;

        var height = dom.getInnerHeight(this.container);
        if (force || size.height != height) {
            size.height = height;

            this.scroller.style.height = height + "px";
            size.scrollerHeight = this.scroller.clientHeight;
            this.scrollBar.setHeight(size.scrollerHeight);

            if (this.session) {
                this.scrollToY(this.getScrollTop());
                changes = changes | this.CHANGE_FULL;
            }
        }

        var width = dom.getInnerWidth(this.container);
        if (force || size.width != width) {
            size.width = width;

            var gutterWidth = this.model.showGutter ? this.$gutter.offsetWidth : 0;
            this.scroller.style.left = gutterWidth + "px";
            size.scrollerWidth = Math.max(0, width - gutterWidth - this.scrollBar.getWidth())
            this.scroller.style.width = size.scrollerWidth + "px";

            if (this.session.getUseWrapMode() && this.adjustWrapLimit() || force)
                changes = changes | this.CHANGE_FULL;
        }

        this.$loop.schedule(changes);
    };

    this.adjustWrapLimit = function(){
        var availableWidth = this.model.size.scrollerWidth - this.model.padding * 2;
        var limit = Math.floor(availableWidth / this.characterWidth) - 1;
        return this.session.adjustWrapLimit(limit);
    };

    this.$onGutterClick = function(e) {
        var pageX = event.getDocumentX(e);
        var pageY = event.getDocumentY(e);

        this._dispatchEvent("gutter" + e.type, {
            row: this.screenToTextCoordinates(pageX, pageY).row,
            htmlEvent: e
        });
    };

    this.updateShowInvisibles = function() {
        this.$loop.schedule(this.CHANGE_TEXT);
    };

    this.updateShowGutter = function(){
        this.$gutter.style.display = this.model.showGutter ? "block" : "none";
        this.onResize(true);
    };

    this.updatePrintMargin = function() {
        var containerEl;

        if (!this.model.showPrintMargin && !this.$printMarginEl)
            return;

        if (!this.$printMarginEl) {
            containerEl = dom.createElement("div");
            containerEl.className = "ace_print_margin_layer";
            this.$printMarginEl = dom.createElement("div");
            this.$printMarginEl.className = "ace_print_margin";
            containerEl.appendChild(this.$printMarginEl);
            this.content.insertBefore(containerEl, this.$textLayer.element);
        }

        var style = this.$printMarginEl.style;
        style.left = ((this.characterWidth * this.model.printMarginColumn) + this.model.padding * 2) + "px";
        style.visibility = this.model.showPrintMargin ? "visible" : "hidden";
    };

    this.getContainerElement = function() {
        return this.container;
    };

    this.getMouseEventTarget = function() {
        return this.content;
    };

    this.getTextAreaContainer = function() {
        return this.container;
    };

    this.moveTextAreaToCursor = function(textarea) {
        // in IE the native cursor always shines through
        if (useragent.isIE)
            return;

        var pos = this.model.getCursorPixelPosition();
        if (!pos)
            return;

        var bounds = this.content.getBoundingClientRect();
        var offset = this.model.layerConfig.offset;

        textarea.style.left = (bounds.left + pos.left + this.model.padding) + "px";
        textarea.style.top = (bounds.top + pos.top - this.scrollTop + offset) + "px";
    };

    this.updatePadding = function() {
        this.$textLayer.element.style.padding = "0 " + this.model.padding + "px";
        this.$loop.schedule(this.CHANGE_FULL);
        this.updatePrintMargin();
    };
    
    this.updateHorizScroll = function() {
        if (!this.model.horizScrollAlwaysVisible || !this.$horizScroll)
            this.$loop.schedule(this.CHANGE_SCROLL);
    };

    this.updateCharacterSize = function() {
        var size = this.$measureText.getCharacterSize();
        this.characterWidth = size.width;
        this.lineHeight = size.height;
        
        this.updatePrintMargin();
        this.onResize(true);
        this.$loop.schedule(this.CHANGE_FULL);
    };

    this.onScroll = function(e) {
        this.scrollToY(e.data);
    };

    this.$updateScrollBar = function() {
        this.scrollBar.setInnerHeight(this.model.layerConfig.maxHeight);
        this.scrollBar.setScrollTop(this.scrollTop);
    };

    this.$renderChanges = function(changes) {
        if (!changes || !this.session)
            return;

        // text, scrolling and resize changes can cause the view port size to change
        if (changes & this.CHANGE_FULL ||
            changes & this.CHANGE_SIZE ||
            changes & this.CHANGE_TEXT ||
            changes & this.CHANGE_LINES ||
            changes & this.CHANGE_SCROLL
        )
            this.$computeLayerConfig();

        // full
        if (changes & this.CHANGE_FULL) {
            this.$textLayer.update(this.model.layerConfig);
            if (this.model.showGutter)
                this.$gutterLayer.update(this.model.layerConfig);
            this.$markerBack.update(this.model.layerConfig);
            this.$markerFront.update(this.model.layerConfig);
            this.$cursorLayer.update(this.model.layerConfig);
            this.$updateScrollBar();
            return;
        }

        // scrolling
        if (changes & this.CHANGE_SCROLL) {
            if (changes & this.CHANGE_TEXT || changes & this.CHANGE_LINES)
                this.$textLayer.update(this.model.layerConfig);
            else
                this.$textLayer.scrollLines(this.model.layerConfig);

            if (this.model.showGutter)
                this.$gutterLayer.update(this.model.layerConfig);
            this.$markerBack.update(this.model.layerConfig);
            this.$markerFront.update(this.model.layerConfig);
            this.$cursorLayer.update(this.model.layerConfig);
            this.$updateScrollBar();
            return;
        }

        if (changes & this.CHANGE_TEXT) {
            this.$textLayer.update(this.model.layerConfig);
            if (this.model.showGutter)
                this.$gutterLayer.update(this.model.layerConfig);
        }
        else if (changes & this.CHANGE_LINES) {
            this.$updateLines();
            this.$updateScrollBar();
            if (this.model.showGutter)
                this.$gutterLayer.update(this.model.layerConfig);
        } else if (changes & this.CHANGE_GUTTER) {
            if (this.model.showGutter)
                this.$gutterLayer.update(this.model.layerConfig);
        }

        if (changes & this.CHANGE_CURSOR)
            this.$cursorLayer.update(this.model.layerConfig);

        if (changes & (this.CHANGE_MARKER | this.CHANGE_MARKER_FRONT)) {
            this.$markerFront.update(this.model.layerConfig);
        }

        if (changes & (this.CHANGE_MARKER | this.CHANGE_MARKER_BACK)) {
            this.$markerBack.update(this.model.layerConfig);
        }

        if (changes & this.CHANGE_SIZE)
            this.$updateScrollBar();
    };

    this.$computeLayerConfig = function() {
        var session = this.session;

        var offset = this.scrollTop % this.lineHeight;
        var minHeight = this.model.size.scrollerHeight + this.lineHeight;

        var longestLine = this.$getLongestLine();
        var widthChanged = this.model.layerConfig.width != longestLine;

        var horizScroll = this.model.horizScrollAlwaysVisible || this.model.size.scrollerWidth - longestLine < 0;
        var horizScrollChanged = this.$horizScroll !== horizScroll;
        this.$horizScroll = horizScroll;
        if (horizScrollChanged)
            this.scroller.style.overflowX = horizScroll ? "scroll" : "hidden";

        var maxHeight = this.session.getScreenLength() * this.lineHeight;
        this.scrollTop = Math.max(0, Math.min(this.scrollTop, maxHeight - this.model.size.scrollerHeight));

        var lineCount = Math.ceil(minHeight / this.lineHeight) - 1;
        var firstRow = Math.max(0, Math.round((this.scrollTop - offset) / this.lineHeight));
        var lastRow = firstRow + lineCount;

        // Map lines on the screen to lines in the document.
        var firstRowScreen, firstRowHeight;
        var lineHeight = { lineHeight: this.lineHeight };
        firstRow = session.screenToDocumentRow(firstRow, 0);

        // Check if firstRow is inside of a foldLine. If true, then use the first
        // row of the foldLine.
        var foldLine = session.getFoldLine(firstRow);
        if (foldLine) {
            firstRow = foldLine.start.row;
        }

        firstRowScreen = session.documentToScreenRow(firstRow, 0);
        firstRowHeight = session.getRowHeight(lineHeight, firstRow);

        lastRow = Math.min(session.screenToDocumentRow(lastRow, 0), session.getLength() - 1);
        minHeight = this.model.size.scrollerHeight + session.getRowHeight(lineHeight, lastRow)+
                                                firstRowHeight;

        offset = this.scrollTop - firstRowScreen * this.lineHeight;

        this.model.layerConfig = {
            width : longestLine,
            padding : this.model.padding,
            firstRow : firstRow,
            firstRowScreen: firstRowScreen,
            lastRow : lastRow,
            lineHeight : this.lineHeight,
            characterWidth : this.characterWidth,
            minHeight : minHeight,
            maxHeight : maxHeight,
            offset : offset,
            height : this.model.size.scrollerHeight
        };

        // For debugging.
        // console.log(JSON.stringify(this.layerConfig));

        this.$gutterLayer.element.style.marginTop = (-offset) + "px";
        this.content.style.marginTop = (-offset) + "px";
        this.content.style.width = longestLine + "px";
        this.content.style.height = minHeight + "px";

        // scroller.scrollWidth was smaller than scrollLeft we needed
        if (this.$desiredScrollLeft) {
            this.scrollToX(this.$desiredScrollLeft);
            this.$desiredScrollLeft = 0;
        }

        // Horizontal scrollbar visibility may have changed, which changes
        // the client height of the scroller
        if (horizScrollChanged)
            this.onResize(true);
    };

    this.$updateLines = function() {
        var firstRow = this.$changedLines.firstRow;
        var lastRow = this.$changedLines.lastRow;
        this.$changedLines = null;

        var layerConfig = this.model.layerConfig;

        // if the update changes the width of the document do a full redraw
        if (layerConfig.width != this.$getLongestLine())
            return this.$textLayer.update(layerConfig);

        if (firstRow > layerConfig.lastRow + 1) { return; }
        if (lastRow < layerConfig.firstRow) { return; }

        // if the last row is unknown -> redraw everything
        if (lastRow === Infinity) {
            if (this.model.showGutter)
                this.$gutterLayer.update(layerConfig);
            this.$textLayer.update(layerConfig);
            return;
        }

        // else update only the changed rows
        this.$textLayer.updateLines(layerConfig, firstRow, lastRow);
    };

    this.$getLongestLine = function() {
        var charCount = this.session.getScreenWidth() + 1;
        if (this.model.showInvisibles)
            charCount += 1;

        return Math.max(this.model.size.scrollerWidth, Math.round(charCount * this.characterWidth));
    };

    this.updateFrontMarkers = function() {
        this.$markerFront.setMarkers(this.session.getMarkers(true));
        this.$loop.schedule(this.CHANGE_MARKER_FRONT);
    };

    this.updateBackMarkers = function() {
        this.$markerBack.setMarkers(this.session.getMarkers());
        this.$loop.schedule(this.CHANGE_MARKER_BACK);
    };

    this.addGutterDecoration = function(row, className){
        this.$gutterLayer.addGutterDecoration(row, className);
        this.$loop.schedule(this.CHANGE_GUTTER);
    };

    this.removeGutterDecoration = function(row, className){
        this.$gutterLayer.removeGutterDecoration(row, className);
        this.$loop.schedule(this.CHANGE_GUTTER);
    };

    this.setBreakpoints = function(rows) {
        this.$gutterLayer.setBreakpoints(rows);
        this.$loop.schedule(this.CHANGE_GUTTER);
    };

    this.setAnnotations = function(annotations) {
        this.$gutterLayer.setAnnotations(annotations);
        this.$loop.schedule(this.CHANGE_GUTTER);
    };

    this.updateCursor = function() {
        this.$loop.schedule(this.CHANGE_CURSOR);
    };

    this.hideCursor = function() {
        this.$cursorLayer.hideCursor();
    };

    this.showCursor = function() {
        this.$cursorLayer.showCursor();
    };

    this.scrollCursorIntoView = function() {
        // the editor is not visible
        if (this.model.size.scrollerHeight === 0)
            return;

        var pos = this.model.getCursorPixelPosition();

        var left = pos.left;
        var top = pos.top;

        if (this.scrollTop > top) {
            this.scrollToY(top);
        }

        if (this.scrollTop + this.model.size.scrollerHeight < top + this.lineHeight) {
            this.scrollToY(top + this.lineHeight - this.model.size.scrollerHeight);
        }

        var scrollLeft = this.scrollLeft;

        if (scrollLeft > left) {
            this.scrollToX(left);
        }

        if (scrollLeft + this.model.size.scrollerWidth < left + this.characterWidth) {
            if (left > this.model.layerConfig.width)
                this.$desiredScrollLeft = left + 2 * this.characterWidth;
            else
                this.scrollToX(Math.round(left + this.characterWidth - this.model.size.scrollerWidth));
        }
    };

    this.getScrollTop = function() {
        return this.scrollTop;
    };

    this.getScrollLeft = function() {
        return this.scrollLeft;
    };

    this.getScrollTopRow = function() {
        return this.scrollTop / this.lineHeight;
    };

    this.getScrollBottomRow = function() {
        return Math.max(0, Math.floor((this.scrollTop + this.model.size.scrollerHeight) / this.lineHeight) - 1);
    };

    this.scrollToRow = function(row) {
        this.scrollToY(row * this.lineHeight);
    };

    this.scrollToLine = function(line, center) {
        var lineHeight = { lineHeight: this.lineHeight };
        var offset = 0;
        for (var l = 1; l < line; l++) {
            offset += this.session.getRowHeight(lineHeight, l-1);
        }

        if (center) {
            offset -= this.model.size.scrollerHeight / 2;
        }
        this.scrollToY(offset);
    };

    this.scrollToY = function(scrollTop) {
        // after calling scrollBar.setScrollTop
        // scrollbar sends us event with same scrollTop. ignore it
        scrollTop = Math.max(0, scrollTop);
        if (this.scrollTop !== scrollTop) {
            this.$loop.schedule(this.CHANGE_SCROLL);
            this.scrollTop = scrollTop;
        }
    };

    this.scrollToX = function(scrollLeft) {
        if (scrollLeft <= this.model.padding)
            scrollLeft = 0;

        if (this.scrollLeft === scrollLeft)
            return;
            
        this.scrollLeft = scrollLeft;
        this.scroller.scrollLeft = scrollLeft;
    };

    this.scrollBy = function(deltaX, deltaY) {
        deltaY && this.scrollToY(this.scrollTop + deltaY);
        deltaX && this.scrollToX(this.scrollLeft + deltaX);
    };

    this.screenToTextCoordinates = function(pageX, pageY) {
        var canvasPos = this.scroller.getBoundingClientRect();

        var col = Math.round((pageX + this.scrollLeft - canvasPos.left - this.model.padding - dom.getPageScrollLeft())
                / this.characterWidth);
        var row = Math.floor((pageY + this.scrollTop - canvasPos.top - dom.getPageScrollTop())
                / this.lineHeight);

        return this.session.screenToDocumentPosition(row, Math.max(col, 0));
    };

    this.textToScreenCoordinates = function(row, column) {
        var canvasPos = this.scroller.getBoundingClientRect();
        var pos = this.session.documentToScreenPosition(row, column);

        var x = this.model.padding + Math.round(pos.column * this.characterWidth);
        var y = pos.row * this.lineHeight;

        return {
            pageX: canvasPos.left + x - this.getScrollLeft(),
            pageY: canvasPos.top + y - this.getScrollTop()
        };
    };

    this.visualizeFocus = function() {
        dom.addCssClass(this.container, "ace_focus");
    };

    this.visualizeBlur = function() {
        dom.removeCssClass(this.container, "ace_focus");
    };

    this.showComposition = function(position) {
        if (!this.$composition) {
            this.$composition = dom.createElement("div");
            this.$composition.className = "ace_composition";
            this.content.appendChild(this.$composition);
        }

        this.$composition.innerHTML = "&#160;";

        var pos = this.model.getCursorPixelPosition();
        var style = this.$composition.style;
        style.top = pos.top + "px";
        style.left = (pos.left + this.model.padding) + "px";
        style.height = this.lineHeight + "px";

        this.hideCursor();
    };

    this.setCompositionText = function(text) {
        dom.setInnerText(this.$composition, text);
    };

    this.hideComposition = function() {
        this.showCursor();

        if (!this.$composition)
            return;

        var style = this.$composition.style;
        style.top = "-10000px";
        style.left = "-10000px";
    };

    this.updateTheme = function() {
        var theme = this.model.theme.cssClass;
        
        if (this.$theme == theme)
            return;
        
        if (this.$theme)
            this.unsetStyle(this.$theme);

        this.$theme = theme;

        if (this.$theme)
            this.setStyle(this.$theme);

        // force re-measure of the gutter width
        if (this.model.size) {
            this.model.size.width = 0;
            this.onResize();
        }
    };

    // Methods allows to add / remove CSS classnames to the editor element.
    // This feature can be used by plug-ins to provide a visual indication of
    // a certain mode that editor is in.

    this.setStyle = function setStyle(style) {
      dom.addCssClass(this.container, style);
    };

    this.unsetStyle = function unsetStyle(style) {
      dom.removeCssClass(this.container, style);
    };

    this.destroy = function() {
        this.$textLayer.destroy();
        this.$cursorLayer.destroy();
    };

}).call(WindowView.prototype);

exports.WindowView = WindowView;
});
