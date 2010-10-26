/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
require.def("ace/VirtualRenderer",
    [
         "ace/lib/oop",
         "ace/lib/lang",
         "ace/lib/dom",
         "ace/lib/event",
         "ace/layer/Gutter",
         "ace/layer/Marker",
         "ace/layer/Text",
         "ace/layer/Cursor",
         "ace/ScrollBar",
         "ace/RenderLoop",
         "ace/MEventEmitter",
         "text!ace/css/editor.css"
    ], function(
        oop, lang, dom, event, GutterLayer, MarkerLayer, TextLayer,
        CursorLayer, ScrollBar, RenderLoop, MEventEmitter, editorCss) {

// import CSS once
dom.importCssString(editorCss);

var VirtualRenderer = function(container, theme) {
    this.container = container;
    dom.addCssClass(this.container, "ace_editor");

    this.setTheme(theme);

    this.scroller = document.createElement("div");
    this.scroller.className = "ace_scroller";
    this.container.appendChild(this.scroller);

    this.$gutter = document.createElement("div");
    this.$gutter.className = "ace_gutter";
    this.container.appendChild(this.$gutter);

    this.content = document.createElement("div");
    this.content.style.position = "absolute";
    this.scroller.appendChild(this.content);

    this.$gutterLayer = new GutterLayer(this.$gutter);
    this.$markerLayer = new MarkerLayer(this.content);

    var textLayer = this.$textLayer = new TextLayer(this.content);
    this.canvas = textLayer.element;

    this.characterWidth = textLayer.getCharacterWidth();
    this.lineHeight = textLayer.getLineHeight();

    this.$cursorLayer = new CursorLayer(this.content);

    this.layers = [ this.$markerLayer, textLayer, this.$cursorLayer ];

    this.scrollBar = new ScrollBar(container);
    this.scrollBar.addEventListener("scroll", lang.bind(this.onScroll, this));

    this.scrollTop = 0;

    this.cursorPos = {
        row : 0,
        column : 0
    };

    var self = this;
    this.$textLayer.addEventListener("changeCharaterSize", function() {
        self.characterWidth = textLayer.getCharacterWidth();
        self.lineHeight = textLayer.getLineHeight();

        self.$loop.schedule(self.CHANGE_FULL);
    });
    event.addListener(this.$gutter, "click", lang.bind(this.$onGutterClick, this));
    event.addListener(this.$gutter, "dblclick", lang.bind(this.$onGutterClick, this));

    this.$size = {
        width: 0,
        height: 0,
        scrollerHeight: 0,
        scrollerWidth: 0
    };

    this.$updatePrintMargin();

    this.$loop = new RenderLoop(lang.bind(this.$renderChanges, this));
    this.$loop.schedule(this.CHANGE_FULL);
};

(function() {

    this.CHANGE_CURSOR = 1;
    this.CHANGE_MARKER = 2;
    this.CHANGE_GUTTER = 4;
    this.CHANGE_SCROLL = 8;
    this.CHANGE_LINES = 16;
    this.CHANGE_TEXT = 32;
    this.CHANGE_SIZE = 64;
    this.CHANGE_FULL = 128;

    oop.implement(this, MEventEmitter);

    this.setDocument = function(doc) {
        this.lines = doc.lines;
        this.doc = doc;
        this.$cursorLayer.setDocument(doc);
        this.$markerLayer.setDocument(doc);
        this.$textLayer.setDocument(doc);

        this.$loop.schedule(this.CHANGE_FULL);
    };

    /**
     * Triggers partial update of the text layer
     */
    this.updateLines = function(firstRow, lastRow) {
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
        if (this.$changedLines.lastRow === undefined)
            this.$changedLines.lastRow = Infinity;

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

    /**
     * Triggers resize of the editor
     */
    this.onResize = function() {
        this.$loop.schedule(this.CHANGE_SIZE);

        var height = dom.getInnerHeight(this.container);
        if (this.$size.height != height) {
            this.$size.height = height;

            this.scroller.style.height = height + "px";
            this.scrollBar.setHeight(height);

            if (this.doc) {
                this.scrollToY(this.getScrollTop());
                this.$loop.schedule(this.CHANGE_FULL);
            }
        }

        var width = dom.getInnerWidth(this.container);
        if (this.$size.width != width) {
            this.$size.width = width;

            var gutterWidth = this.$gutter.offsetWidth;
            this.scroller.style.left = gutterWidth + "px";
            this.scroller.style.width = Math.max(0, width - gutterWidth - this.scrollBar.getWidth()) + "px";
        }

        this.$size.scrollerWidth = this.scroller.clientWidth;
        this.$size.scrollerHeight = this.scroller.clientHeight;
    };

    this.setTokenizer = function(tokenizer) {
        this.$textLayer.setTokenizer(tokenizer);
        this.$loop.schedule(this.CHANGE_TEXT);
    };

    this.$onGutterClick = function(e) {
        var pageX = event.getDocumentX(e);
        var pageY = event.getDocumentY(e);

        this.$dispatchEvent("gutter" + e.type, {
            row: this.screenToTextCoordinates(pageX, pageY).row,
            htmlEvent: e
        });
    };

    this.$showInvisibles = true;
    this.setShowInvisibles = function(showInvisibles) {
        this.$showInvisibles = showInvisibles;
        this.$textLayer.setShowInvisibles(showInvisibles);

        this.$loop.schedule(this.CHANGE_TEXT);
    };

    this.getShowInvisibles = function() {
        return this.$showInvisibles;
    };

    this.$showPrintMargin = true;
    this.setShowPrintMargin = function(showPrintMargin) {
        this.$showPrintMargin = showPrintMargin;
        this.$updatePrintMargin();
    };

    this.getShowPrintMargin = function() {
        return this.$showPrintMargin;
    };

    this.$printMarginColumn = 80;
    this.setPrintMarginColumn = function(showPrintMargin) {
        this.$printMarginColumn = showPrintMargin;
        this.$updatePrintMargin();
    };

    this.getPrintMarginColumn = function() {
        return this.$printMarginColumn;
    };

    this.$updatePrintMargin = function() {
        if (!this.$showPrintMargin && !this.$printMarginEl)
            return;

        if (!this.$printMarginEl) {
            this.$printMarginEl = document.createElement("div");
            this.$printMarginEl.className = "ace_printMargin";
            this.content.insertBefore(this.$printMarginEl, this.$textLayer.element);
        }

        var style = this.$printMarginEl.style;
        style.left = (this.characterWidth * this.$printMarginColumn) + "px";
        style.visibility = this.$showPrintMargin ? "visible" : "hidden";
    };

    this.getContainerElement = function() {
        return this.container;
    };

    this.getMouseEventTarget = function() {
        return this.content;
    };

    this.getFirstVisibleRow = function() {
        return (this.layerConfig || {}).firstRow || 0;
    };

    this.getLastVisibleRow = function() {
        return (this.layerConfig || {}).lastRow || 0;
    };

    this.onScroll = function(e) {
        this.scrollToY(e.data);
    };

    this.$updateScrollBar = function() {
        this.scrollBar.setInnerHeight(this.doc.getLength() * this.lineHeight);
        this.scrollBar.setScrollTop(this.scrollTop);
    };

    this.$renderChanges = function(changes) {
        if (!changes)
            return;

        // text, scrolling and resize changes can cause the view port size to change
        if (!this.layerConfig ||
            changes & this.CHANGE_FULL ||
            changes & this.CHANGE_SIZE ||
            changes & this.CHANGE_TEXT ||
            changes & this.CHANGE_LINES ||
            changes & this.CHANGE_SCROLL
        )
            this.$computeLayerConfig();

        // full
        if (changes & this.CHANGE_FULL) {
            this.$textLayer.update(this.layerConfig);
            this.$gutterLayer.update(this.layerConfig);
            this.$markerLayer.update(this.layerConfig);
            this.$cursorLayer.update(this.layerConfig);
            this.$updateScrollBar();
            return;
        }

        // scrolling
        if (changes & this.CHANGE_SCROLL) {
            if (changes & this.CHANGE_TEXT || changes & this.CHANGE_LINES) {
                this.$textLayer.scrollLines(this.layerConfig);
                this.$gutterLayer.update(this.layerConfig);
                this.$markerLayer.update(this.layerConfig);
                this.$cursorLayer.update(this.layerConfig);
            }
            else {
                this.$textLayer.update(this.layerConfig);
                this.$gutterLayer.update(this.layerConfig);
                this.$markerLayer.update(this.layerConfig);
                this.$cursorLayer.update(this.layerConfig);
            }
            this.$updateScrollBar();
            return;
        }

        if (changes & this.CHANGE_TEXT) {
            this.$textLayer.update(this.layerConfig);
            this.$gutterLayer.update(this.layerConfig);
        }
        else if (changes & this.CHANGE_LINES) {
            this.$updateLines();     
            this.$updateScrollBar();       
        }
        else if (changes & this.CHANGE_SCROLL) {
            this.$textLayer.scrollLines(this.layerConfig);
            this.$gutterLayer.update(this.layerConfig);
        } if (changes & this.CHANGE_GUTTER) {
            this.$gutterLayer.update(this.layerConfig);
        }

        if (changes & this.CHANGE_CURSOR)
            this.$cursorLayer.update(this.layerConfig);

        if (changes & this.CHANGE_MARKER) {
            this.$markerLayer.update(this.layerConfig);
        }

        if (changes & this.CHANGE_SIZE)
            this.$updateScrollBar();
    };

    this.$computeLayerConfig = function() {
        var offset = this.scrollTop % this.lineHeight;
        var minHeight = this.$size.scrollerHeight + this.lineHeight;

        var longestLine = this.$getLongestLine();
        var widthChanged = !this.layerConfig ? true : (this.layerConfig.width != longestLine);

        var lineCount = Math.ceil(minHeight / this.lineHeight);
        var firstRow = Math.round((this.scrollTop - offset) / this.lineHeight);
        var lastRow = Math.min(this.lines.length, firstRow + lineCount) - 1;

        var layerConfig = this.layerConfig = {
            width : longestLine,
            firstRow : firstRow,
            lastRow : lastRow,
            lineHeight : this.lineHeight,
            characterWidth : this.characterWidth,
            minHeight : minHeight
        };

        for ( var i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            if (widthChanged) {
                var style = layer.element.style;
                style.width = longestLine + "px";
            }
        };

        this.$gutterLayer.element.style.marginTop = (-offset) + "px";
        this.content.style.marginTop = (-offset) + "px";
        this.content.style.height = minHeight + "px";
    };

    this.$updateLines = function() {
        var firstRow = this.$changedLines.firstRow;
        var lastRow = this.$changedLines.lastRow;
        this.$changedLines = {
            firstRow: 0,
            lastRow: Infinity
        };

        var layerConfig = this.layerConfig;

        // if the update changes the width of the document do a full redraw
        if (layerConfig.width != this.$getLongestLine())
            return this.$textLayer.update(layerConfig);

        if (firstRow > layerConfig.lastRow + 1) { return; }
        if (lastRow < layerConfig.firstRow) { return; }

        // if the last row is unknown -> redraw everything
        if (lastRow === Infinity) {
            this.$gutterLayer.update(layerConfig);
            this.$textLayer.update(layerConfig);
            return;
        }

        // else update only the changed rows
        this.$textLayer.updateLines(layerConfig, firstRow, lastRow);
    };

    this.$getLongestLine = function() {
        var charCount = this.doc.getScreenWidth();
        if (this.$showInvisibles)
            charCount += 1;

        return Math.max(this.$size.scrollerWidth, Math.round(charCount * this.characterWidth));
    };

    this.addMarker = function(range, clazz, type) {
        return this.$markerLayer.addMarker(range, clazz, type);
        this.$loop.schedule(this.CHANGE_MARKER);
    };

    this.removeMarker = function(markerId) {
        this.$markerLayer.removeMarker(markerId);
        this.$loop.schedule(this.CHANGE_MARKER);
    };

    this.setBreakpoints = function(rows) {
        this.$gutterLayer.setBreakpoints(rows);
        this.$loop.schedule(this.CHANGE_GUTTER);
    };

    this.updateCursor = function(position, overwrite) {
        this.$cursorLayer.setCursor(position, overwrite);
        this.$loop.schedule(this.CHANGE_CURSOR);
    };

    this.hideCursor = function() {
        this.$cursorLayer.hideCursor();
    };

    this.showCursor = function() {
        this.$cursorLayer.showCursor();
    };

    this.scrollCursorIntoView = function() {
        var pos = this.$cursorLayer.getPixelPosition();

        var left = pos.left;
        var top = pos.top;

        if (this.getScrollTop() > top) {
            this.scrollToY(top);
        }

        if (this.getScrollTop() + this.$size.scrollerHeight < top
                + this.lineHeight) {
            this.scrollToY(top + this.lineHeight - this.$size.scrollerHeight);
        }

        if (this.scroller.scrollLeft > left) {
            this.scroller.scrollLeft = left;
        }

        if (this.scroller.scrollLeft + this.$size.scrollerWidth < left
                + this.characterWidth) {
            this.scroller.scrollLeft = Math.round(left + this.characterWidth
                    - this.$size.scrollerWidth);
        }
    },

    this.getScrollTop = function() {
        return this.scrollTop;
    };
    
    this.getScrollLeft = function() {
        return this.scroller.scrollLeft;
    };

    this.getScrollTopRow = function() {
        return this.scrollTop / this.lineHeight;
    };

    this.scrollToRow = function(row) {
        this.scrollToY(row * this.lineHeight);
    };

    this.scrollToY = function(scrollTop) {
        var maxHeight = this.lines.length * this.lineHeight - this.$size.scrollerHeight;
        var scrollTop = Math.max(0, Math.min(maxHeight, scrollTop));

        if (this.scrollTop !== scrollTop) {
            this.scrollTop = scrollTop;
            this.$loop.schedule(this.CHANGE_SCROLL);
        }
    };

    this.scrollBy = function(deltaX, deltaY) {
        deltaY && this.scrollToY(this.scrollTop + deltaY);
        deltaX && (this.scroller.scrollLeft += deltaX);
    };

    this.screenToTextCoordinates = function(pageX, pageY) {
        var canvasPos = this.scroller.getBoundingClientRect();

        var col = Math.round((pageX + this.scroller.scrollLeft - canvasPos.left)
                / this.characterWidth);
        var row = Math.floor((pageY + this.scrollTop - canvasPos.top)
                / this.lineHeight);

        return {
            row : row,
            column : this.doc.screenToDocumentColumn(Math.max(0, Math.min(row, this.doc.getLength()-1)), col)
        };
    };

    this.textToScreenCoordinates = function(row, column) {
        var canvasPos = this.scroller.getBoundingClientRect();
        
        var x = Math.round(this.doc.documentToScreenColumn(row, column) * this.characterWidth);
        var y = row * this.lineHeight;
        
        return {
            pageX: canvasPos.left + x - this.getScrollLeft(),
            pageY: canvasPos.top + y - this.getScrollTop()
        }
    };

    this.visualizeFocus = function() {
        dom.addCssClass(this.container, "ace_focus");
    };

    this.visualizeBlur = function() {
        dom.removeCssClass(this.container, "ace_focus");
    };

    this.showComposition = function(position) {
    };

    this.setCompositionText = function(text) {
    };

    this.hideComposition = function() {
    };

    this.setTheme = function(theme) {
        var _self = this;
        if (!theme || typeof theme == "string") {
            theme = theme || "ace/theme/TextMate";
            require([theme], function(theme) {
                afterLoad(theme);
            });
        } else {
            afterLoad(theme);
        }

        var _self = this;
        function afterLoad(theme) {
            if (_self.$theme)
                dom.removeCssClass(_self.container, _self.$theme);

            _self.$theme = theme ? theme.cssClass : null;

            if (_self.$theme)
                dom.addCssClass(_self.container, _self.$theme);

            // force re-measure of the gutter width
            if (_self.$size) {
                _self.$size.width = 0;
                _self.onResize();
            }
        }
    };

}).call(VirtualRenderer.prototype);

return VirtualRenderer;
});
