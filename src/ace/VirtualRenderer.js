/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
require.def("ace/VirtualRenderer",
    [
         "ace/ace",
         "ace/lib/oop",
         "ace/lib/lang",
         "ace/layer/Gutter",
         "ace/layer/Marker",
         "ace/layer/Text",
         "ace/layer/Cursor",
         "ace/ScrollBar",
         "ace/MEventEmitter"
    ], function(ace, oop, lang, GutterLayer, MarkerLayer, TextLayer, CursorLayer, ScrollBar, MEventEmitter) {

var VirtualRenderer = function(container) {
    this.container = container;
    ace.addCssClass(this.container, "ace_editor");

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

    this.$drawCallbacks = [];

    this.$updatePrintMargin();
    this.onResize();

    var self = this;
    this.$textLayer.addEventListener("changeCharaterSize", function() {
        self.characterWidth = textLayer.getCharacterWidth();
        self.lineHeight = textLayer.getLineHeight();
        self.onResize();
    });
    ace.addListener(this.$gutter, "click", lang.bind(this.$onGutterClick, this));
    ace.addListener(this.$gutter, "dblclick", lang.bind(this.$onGutterClick, this));
};

(function() {

    ace.implement(this, MEventEmitter);

    this.setDocument = function(doc) {
        this.lines = doc.lines;
        this.doc = doc;
        this.$cursorLayer.setDocument(doc);
        this.$markerLayer.setDocument(doc);
        this.$textLayer.setDocument(doc);
    };

    this.setTokenizer = function(tokenizer) {
        this.$textLayer.setTokenizer(tokenizer);
    };

    this.$onGutterClick = function(e) {
        var pageX = ace.getDocumentX(e);
        var pageY = ace.getDocumentY(e);

        var event = {
            row: this.screenToTextCoordinates(pageX, pageY).row,
            htmlEvent: e
        };

        var type = "gutter" + e.type;
        this.$dispatchEvent(type, event);
    };

    this.$showInvisibles = true;
    this.setShowInvisibles = function(showInvisibles) {
        this.$showInvisibles = showInvisibles;
        this.$textLayer.setShowInvisibles(showInvisibles);
    };

    this.getShowInvisibles = function() {
        return this.showInvisibles;
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
            this.content.insertBefore(this.$printMarginEl, this.$cursorLayer.element);
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
        return this.layerConfig.firstRow || 0;
    };

    this.getLastVisibleRow = function() {
        return this.layerConfig.lastRow || 0;
    };

    this.onResize = function()
    {
        var height = ace.getInnerHeight(this.container);
        this.scroller.style.height = height + "px";
        this.scrollBar.setHeight(height);

        var width = ace.getInnerWidth(this.container);
        var gutterWidth = this.$gutter.offsetWidth;
        this.scroller.style.left = gutterWidth + "px";
        this.scroller.style.width = Math.max(0, width - gutterWidth - this.scrollBar.getWidth()) + "px";

        if (this.doc) {
            this.$updateScrollBar();
            this.scrollToY(this.getScrollTop());
            this.draw();
        }
    };

    this.onScroll = function(e) {
        this.scrollToY(e.data);
    };

    this.$updateScrollBar = function() {
        this.scrollBar.setInnerHeight(this.doc.getLength() * this.lineHeight);
        this.scrollBar.setScrollTop(this.scrollTop);
    };

    this.updateLines = function(firstRow, lastRow) {
        var layerConfig = this.layerConfig;

        // if the update changes the width of the document do a full redraw
        if (layerConfig.width != this.$getLongestLine())
            return this.$draw(false);

        if (firstRow > layerConfig.lastRow + 1) { return; }
        if (lastRow < layerConfig.firstRow) { return; }

        // if the last row is unknown -> redraw everything
        if (lastRow === undefined) {
            this.draw();
            return;
        }

        // else update only the changed rows
        this.$textLayer.updateLines(layerConfig, firstRow, lastRow);
    };

    this.draw = function(scrollOnly, callback) {
        this.$draw(scrollOnly);
        callback && callback();
//        if (this.$drawTimer) {
//            clearInterval(this.$drawTimer);
//            this.scrollOnly = this.scrollOnly && scrollOnly;
//        } else {
//            this.scollOnly = scrollOnly;
//        }
//
//        if (callback)
//            this.$drawCallbacks.push(callback);
//
//        var _self = this;
//        this.$drawTimer = setTimeout(function() {
//            _self.$draw(_self.scrollOnly);
//            for (var i=0; i<_self.$drawCallbacks.length; i++)
//                _self.$drawCallbacks[i]();
//
//            _self.$drawCallbacks = [];
//            delete _self.$drawTimer;
//        }, 0);
    };

    this.$draw = function(scrollOnly) {
        //var start = new Date();

        var lines = this.lines;

        var offset = this.scrollTop % this.lineHeight;
        var minHeight = this.scroller.clientHeight + offset;

        var longestLine = this.$getLongestLine();
        var widthChanged = this.layerConfig && (this.layerConfig.width != longestLine);

        var lineCount = Math.ceil(minHeight / this.lineHeight);
        var firstRow = Math.round((this.scrollTop - offset) / this.lineHeight);
        var lastRow = Math.min(lines.length, firstRow + lineCount) - 1;

        var layerConfig = this.layerConfig = {
            width : longestLine,
            firstRow : firstRow,
            lastRow : lastRow,
            lineHeight : this.lineHeight,
            characterWidth : this.characterWidth,
            minHeight : minHeight,
            scrollOnly: !!scrollOnly
        };

        this.content.style.marginTop = (-offset) + "px";
        this.content.style.height = minHeight + "px";

        for ( var i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];

            if (widthChanged) {
                var style = layer.element.style;
                style.width = longestLine + "px";
            }

            layer.update(layerConfig);
        };

        this.$gutterLayer.element.style.marginTop = (-offset) + "px";
        this.$gutterLayer.update(layerConfig);

        //console.log("compute", new Date() - start, "ms")
        this.$updateScrollBar();
        //console.log("compute+render", new Date() - start, "ms")
    };

    this.$getLongestLine = function() {
        var charCount = this.doc.getScreenWidth();
        if (this.$showInvisibles)
            charCount += 1;

        return Math.max(this.scroller.clientWidth, Math.round(charCount * this.characterWidth));
    };

    this.addMarker = function(range, clazz, type) {
        return this.$markerLayer.addMarker(range, clazz, type);
    };

    this.removeMarker = function(markerId) {
        this.$markerLayer.removeMarker(markerId);
    };

    this.setBreakpoints = function(rows) {
        this.$gutterLayer.setBreakpoints(rows);
    };

    this.updateCursor = function(position, overwrite) {
        this.$cursorLayer.setCursor(position, overwrite);
        this.$cursorLayer.update(this.layerConfig);
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

        if (this.getScrollTop() + this.scroller.clientHeight < top
                + this.lineHeight) {
            this.scrollToY(top + this.lineHeight - this.scroller.clientHeight);
        }

        if (this.scroller.scrollLeft > left) {
            this.scroller.scrollLeft = left;
        }

        if (this.scroller.scrollLeft + this.scroller.clientWidth < left
                + this.characterWidth) {
            this.scroller.scrollLeft = Math.round(left + this.characterWidth
                    - this.scroller.clientWidth);
        }
    },

    this.getScrollTop = function() {
        return this.scrollTop;
    };

    this.getScrollTopRow = function() {
        return this.scrollTop / this.lineHeight;
    };

    this.scrollToRow = function(row) {
        this.scrollToY(row * this.lineHeight);
    };

    this.scrollToY = function(scrollTop) {
        var maxHeight = this.lines.length * this.lineHeight
                - this.scroller.clientHeight;
        var scrollTop = Math.max(0, Math.min(maxHeight, scrollTop));

        if (this.scrollTop !== scrollTop) {
            this.scrollTop = scrollTop;
            this.$updateScrollBar();
            this.draw(true);
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

    this.visualizeFocus = function() {
        ace.addCssClass(this.container, "ace_focus");
    };

    this.visualizeBlur = function() {
        ace.removeCssClass(this.container, "ace_focus");
    };

    this.showComposition = function(position) {
    };

    this.setCompositionText = function(text) {
    };

    this.hideComposition = function() {
    };

}).call(VirtualRenderer.prototype);

return VirtualRenderer;
});
