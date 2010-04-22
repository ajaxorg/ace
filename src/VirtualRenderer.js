ace.provide("ace.VirtualRenderer");

ace.VirtualRenderer = function(container) {
    this.container = container;
    ace.addCssClass(this.container, "editor");

    this.scroller = document.createElement("div");
    this.scroller.className = "scroller";
    this.container.appendChild(this.scroller);

    this.gutter = document.createElement("div");
    this.gutter.className = "gutter";
    this.container.appendChild(this.gutter);

    this.gutterLayer = new ace.layer.Gutter(this.gutter);
    this.markerLayer = new ace.layer.Marker(this.scroller);

    var textLayer = this.textLayer = new ace.layer.Text(this.scroller);
    this.canvas = textLayer.element;

    this.characterWidth = textLayer.getCharacterWidth();
    this.lineHeight = textLayer.getLineHeight();

    this.cursorLayer = new ace.layer.Cursor(this.scroller);

    this.layers = [ this.markerLayer, textLayer, this.cursorLayer ];

    this.scrollBar = new ace.ScrollBar(container);
    this.scrollBar.addEventListener("scroll", ace.bind(this.onScroll, this));

    this.scrollTop = 0;

    this.cursorPos = {
        row : 0,
        column : 0
    };

    this.onResize();
};

(function() {

    this.setDocument = function(doc) {
        this.lines = doc.lines;
        this.doc = doc;
        this.markerLayer.setDocument(doc);
        this.textLayer.setTabSize(doc.getTabSize());
    };

    this.setTokenizer = function(tokenizer) {
        this.textLayer.setTokenizer(tokenizer);
    };

    this.getContainerElement = function() {
        return this.container;
    };

    this.getMouseEventTarget = function() {
        return this.scroller;
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
        this.gutter.style.height = height + "px";
        this.scroller.style.height = height + "px";
        this.scrollBar.setHeight(height);

        var width = ace.getInnerWidth(this.container);
        var gutterWidth = this.gutter.offsetWidth;
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

        if (firstRow > layerConfig.lastRow + 1) { return; }
        if (lastRow < layerConfig.firstRow) { return; }

        // if the last row is unknown -> redraw everything
        if (lastRow === undefined) {
            this.draw();
            return;
        }

        // else update only the changed rows
        this.textLayer.updateLines(layerConfig, firstRow, lastRow);
    };

    this.draw = function() {
        var lines = this.lines;

        var offset = this.scrollTop % this.lineHeight;
        var minHeight = this.scroller.clientHeight + offset;

        var longestLine = Math.max(this.scroller.clientWidth, Math.round(this.doc.getWidth() * this.characterWidth));

        var lineCount = Math.ceil(minHeight / this.lineHeight);
        var firstRow = Math.round((this.scrollTop - offset) / this.lineHeight);
        var lastRow = Math.min(lines.length, firstRow + lineCount) - 1;

        var layerConfig = this.layerConfig = {
            width : longestLine,
            firstRow : firstRow,
            lastRow : lastRow,
            lineHeight : this.lineHeight,
            characterWidth : this.characterWidth
        };

        for ( var i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];

            var style = layer.element.style;
            style.marginTop = (-offset) + "px";
            style.height = minHeight + "px";
            style.width = longestLine + "px";

            layer.update(layerConfig);
        };

        this.gutterLayer.element.style.marginTop = (-offset) + "px";
        this.gutterLayer.element.style.height = minHeight + "px";
        this.gutterLayer.update(layerConfig);

        this.$updateScrollBar();
    };

    this.addMarker = function(range, clazz, type) {
        return this.markerLayer.addMarker(range, clazz, type);
    };

    this.removeMarker = function(markerId) {
        this.markerLayer.removeMarker(markerId);
    };

    this.updateCursor = function(position) {
        this.cursorLayer.setCursor(position);
        this.cursorLayer.update(this.layerConfig);
    };

    this.hideCursor = function() {
        this.cursorLayer.hideCursor();
    };

    this.showCursor = function() {
        this.cursorLayer.showCursor();
    };

    this.scrollCursorIntoView = function() {
        var pos = this.cursorLayer.getPixelPosition();

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
            this.draw();
        }
    };

    this.screenToTextCoordinates = function(pageX, pageY) {
        var canvasPos = this.scroller.getBoundingClientRect();

        var col = Math.floor((pageX + this.scroller.scrollLeft - canvasPos.left)
                / this.characterWidth);
        var row = Math.floor((pageY + this.scrollTop - canvasPos.top)
                / this.lineHeight);

        return {
            row : row,
            column : col
        };
    };

    this.visualizeFocus = function() {
        ace.addCssClass(this.container, "focus");
    };

    this.visualizeBlur = function() {
        ace.removeCssClass(this.container, "focus");
    };

    this.showComposition = function(position) {
    };

    this.setCompositionText = function(text) {
    };

    this.hideComposition = function() {
    };

}).call(ace.VirtualRenderer.prototype);