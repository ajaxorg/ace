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

var oop = require("ace/lib/oop");
var dom = require("ace/lib/dom");
var event = require("ace/lib/event");
var useragent = require("ace/lib/useragent");
var GutterLayer = require("ace/view/layer/gutter").Gutter;
var MarkerLayer = require("ace/view/layer/marker").Marker;
var TextLayer = require("ace/view/layer/text").Text;
var CursorLayer = require("ace/view/layer/cursor").Cursor;
var ScrollBar = require("ace/scrollbar").ScrollBar;
var RenderLoop = require("ace/renderloop").RenderLoop;
var MeasureText = require("ace/view/measure_text").MeasureText;
var EventEmitter = require("ace/lib/event_emitter").EventEmitter;
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

    var _self = this;
    this.scrollBar = new ScrollBar(container);
    this.scrollBar.addEventListener("scroll", function(e) {
        _self.model.scrollToY(e.data);
    });

    event.addListener(this.scroller, "scroll", function() {
        windowModel.scrollToX(_self.scroller.scrollLeft);
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

    // TODO refctor
    // remove
    this.setSession = function(session) {
        this.$textLayer.setSession(session);
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

    this.measureSizes = function() {
        var width = dom.getInnerWidth(this.container);
        var gutterWidth = this.model.showGutter ? this.$gutter.offsetWidth : 0;
        return {
            width: width,
            height: dom.getInnerHeight(this.container),
            scrollerHeight: this.scroller.clientHeight,
            scrollerWidth: Math.max(0, width - gutterWidth - this.scrollBar.getWidth()),
            gutterWidth: gutterWidth
        }
    };

    this.updateHeight = function() {
        var size = this.model.size;
        
        this.scroller.style.height = size.height + "px";
        this.scrollBar.setHeight(size.scrollerHeight);

        var changes = this.CHANGE_SIZE;
        if (this.model.buffer) {
            this.model.scrollToY(this.model.scrollTop);
            changes = changes | this.CHANGE_FULL;
        }
        this.$loop.schedule(changes);
    };
    
    this.updateWidth = function() {
        var size = this.model.size;
        
        var changes = this.CHANGE_SIZE;

        this.scroller.style.left = size.gutterWidth + "px";
        this.scroller.style.width = size.scrollerWidth + "px";

        // TODO refactor
        // move to the model
        if (this.model.buffer.getUseWrapMode() && this.adjustWrapLimit())
            changes = changes | this.CHANGE_FULL;

        this.$loop.schedule(changes);
    }

    this.adjustWrapLimit = function(){
        var availableWidth = this.model.size.scrollerWidth - this.model.padding * 2;
        var limit = Math.floor(availableWidth / this.model.charSize.width) - 1;
        return this.model.buffer.adjustWrapLimit(limit);
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
        this._emit("resize");
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
        style.left = ((this.model.charSize.width * this.model.printMarginColumn) + this.model.padding * 2) + "px";
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
        textarea.style.top = (bounds.top + pos.top - this.model.scrollTop + offset) + "px";
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
        this.updatePrintMargin();
        this._emit("resize");
        this.$loop.schedule(this.CHANGE_FULL);
    };

    this.$updateScrollBar = function() {
        this.scrollBar.setInnerHeight(this.model.layerConfig.maxHeight);
        this.scrollBar.setScrollTop(this.model.scrollTop);
    };

    this.$renderChanges = function(changes) {
        if (!changes || !this.model.buffer)
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
            this.$textLayer.update();
            if (this.model.showGutter)
                this.$gutterLayer.update();
            this.$markerBack.update();
            this.$markerFront.update();
            this.$cursorLayer.update();
            this.$updateScrollBar();
            return;
        }

        // scrolling
        if (changes & this.CHANGE_SCROLL) {
            if (changes & this.CHANGE_TEXT || changes & this.CHANGE_LINES)
                this.$textLayer.update();
            else
                this.$textLayer.scrollLines();

            if (this.model.showGutter)
                this.$gutterLayer.update();
            this.$markerBack.update();
            this.$markerFront.update();
            this.$cursorLayer.update();
            this.$updateScrollBar();
            return;
        }

        if (changes & this.CHANGE_TEXT) {
            this.$textLayer.update();
            if (this.model.showGutter)
                this.$gutterLayer.update();
        }
        else if (changes & this.CHANGE_LINES) {
            this.$updateLines();
            this.$updateScrollBar();
            if (this.model.showGutter)
                this.$gutterLayer.update();
        } else if (changes & this.CHANGE_GUTTER) {
            if (this.model.showGutter)
                this.$gutterLayer.update();
        }

        if (changes & this.CHANGE_CURSOR)
            this.$cursorLayer.update();

        if (changes & (this.CHANGE_MARKER | this.CHANGE_MARKER_FRONT)) {
            this.$markerFront.update();
        }

        if (changes & (this.CHANGE_MARKER | this.CHANGE_MARKER_BACK)) {
            this.$markerBack.update();
        }

        if (changes & this.CHANGE_SIZE)
            this.$updateScrollBar();
    };

    this.$computeLayerConfig = function() {
        var buffer = this.model.buffer;

        var charSize = this.model.charSize;
        var offset = this.model.scrollTop % charSize.height;
        var minHeight = this.model.size.scrollerHeight + charSize.height;

        var longestLine = this.$getLongestLine();
        var widthChanged = this.model.layerConfig.width != longestLine;

        var horizScroll = this.model.horizScrollAlwaysVisible || this.model.size.scrollerWidth - longestLine < 0;
        var horizScrollChanged = this.$horizScroll !== horizScroll;
        this.$horizScroll = horizScroll;
        if (horizScrollChanged)
            this.scroller.style.overflowX = horizScroll ? "scroll" : "hidden";

        var maxHeight = buffer.getScreenLength() * charSize.height;
        this.model.scrollToY(Math.max(0, Math.min(this.model.scrollTop, maxHeight - this.model.size.scrollerHeight)));

        var lineCount = Math.ceil(minHeight / charSize.height) - 1;
        var firstRow = Math.max(0, Math.round((this.model.scrollTop - offset) / charSize.height));
        var lastRow = firstRow + lineCount;

        // Map lines on the screen to lines in the document.
        var firstRowScreen, firstRowHeight;
        firstRow = buffer.screenToDocumentRow(firstRow, 0);

        // Check if firstRow is inside of a foldLine. If true, then use the first
        // row of the foldLine.
        var foldLine = buffer.getFoldLine(firstRow);
        if (foldLine) {
            firstRow = foldLine.start.row;
        }

        firstRowScreen = buffer.documentToScreenRow(firstRow, 0);
        firstRowHeight = this.model.getRowHeight(firstRow);

        lastRow = Math.min(buffer.screenToDocumentRow(lastRow, 0), buffer.getLength() - 1);
        minHeight = this.model.size.scrollerHeight
            + this.model.getRowHeight(lastRow)
            + firstRowHeight;

        offset = this.model.scrollTop - firstRowScreen * charSize.height;

        this.model.layerConfig = {
            width : longestLine,
            padding : this.model.padding,
            firstRow : firstRow,
            firstRowScreen: firstRowScreen,
            lastRow : lastRow,
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

        // Horizontal scrollbar visibility may have changed, which changes
        // the client height of the scroller
        if (horizScrollChanged)
            this._emit("resize");
    };

    this.$updateLines = function() {
        var firstRow = this.$changedLines.firstRow;
        var lastRow = this.$changedLines.lastRow;
        this.$changedLines = null;

        var layerConfig = this.model.layerConfig;

        // if the update changes the width of the document do a full redraw
        if (layerConfig.width != this.$getLongestLine())
            return this.$textLayer.update();

        if (firstRow > layerConfig.lastRow + 1) { return; }
        if (lastRow < layerConfig.firstRow) { return; }

        // if the last row is unknown -> redraw everything
        if (lastRow === Infinity) {
            if (this.model.showGutter)
                this.$gutterLayer.update();
            this.$textLayer.update(layerConfig);
            return;
        }

        // else update only the changed rows
        this.$textLayer.updateLines(firstRow, lastRow);
    };

    this.$getLongestLine = function() {
        var charCount = this.model.buffer.getScreenWidth() + 1;
        if (this.model.showInvisibles)
            charCount += 1;

        return Math.max(this.model.size.scrollerWidth, Math.round(charCount * this.model.charSize.width));
    };

    this.updateFrontMarkers = function() {
        this.$markerFront.setMarkers(this.model.buffer.getMarkers(true));
        this.$loop.schedule(this.CHANGE_MARKER_FRONT);
    };

    this.updateBackMarkers = function() {
        this.$markerBack.setMarkers(this.model.buffer.getMarkers());
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

    this.updateScrollLeft = function() {
        this.scroller.scrollLeft = this.model.scrollLeft;
    };
    
    this.updateScrollTop = function() {
        this.$loop.schedule(this.CHANGE_SCROLL);
    };

    this.screenToTextCoordinates = function(pageX, pageY) {
        var canvasPos = this.scroller.getBoundingClientRect();

        var col = Math.round((pageX + this.model.scrollLeft - canvasPos.left - this.model.padding - dom.getPageScrollLeft())
                / this.model.charSize.width);
        var row = Math.floor((pageY + this.model.scrollTop - canvasPos.top - dom.getPageScrollTop())
                / this.model.charSize.height);

        return this.model.buffer.screenToDocumentPosition(row, Math.max(col, 0));
    };

    this.textToScreenCoordinates = function(row, column) {
        var charSize = this.model.charSize;
        var canvasPos = this.scroller.getBoundingClientRect();
        var pos = this.model.buffer.documentToScreenPosition(row, column);

        var x = this.model.padding + Math.round(pos.column * charSize.width);
        var y = pos.row * charSize.height;

        return {
            pageX: canvasPos.left + x - this.model.scrollLeft,
            pageY: canvasPos.top + y - this.model.scrollTop
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
        style.height = this.model.charSize.height + "px";

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
            this._emit("resize");
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
