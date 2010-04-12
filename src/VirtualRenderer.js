if (!window.ace)
    ace = {};

ace.VirtualRenderer = function(container) {
    this.container = container;
    this.container.className += "editor";

    this.scroller = document.createElement("div");
    this.scroller.className = "scroller";
    this.container.appendChild(this.scroller);

    this.gutter = document.createElement("div");
    this.gutter.className = "gutter";
    this.container.appendChild(this.gutter);

    this.gutterLayer = new ace.GutterLayer(this.gutter);
    this.markerLayer = new ace.MarkerLayer(this.scroller);

    var textLayer = this.textLayer = new ace.TextLayer(this.scroller);
    this.canvas = textLayer.element;

    this.characterWidth = textLayer.getCharacterWidth();
    this.lineHeight = textLayer.getLineHeight();

    this.cursorLayer = new ace.CursorLayer(this.scroller);

    this.layers = [ this.markerLayer, textLayer, this.cursorLayer ];

    this.scrollTop = 0;

    this.cursorPos = {
        row : 0,
        column : 0
    };
};

ace.VirtualRenderer.prototype.setDocument = function(doc) {
    this.lines = doc.lines;
    this.doc = doc;
};

ace.VirtualRenderer.prototype.setTokenizer = function(tokenizer) {
    this.textLayer.setTokenizer(tokenizer);
};

ace.VirtualRenderer.prototype.getContainerElement = function() {
    return this.container;
};

ace.VirtualRenderer.prototype.getFirstVisibleRow = function() {
    return this.layerConfig.firstRow || 0;
};

ace.VirtualRenderer.prototype.getLastVisibleRow = function() {
    return this.layerConfig.lastRow || 0;
};

ace.VirtualRenderer.prototype.updateLines = function(firstRow, lastRow) {
    var layerConfig = this.layerConfig;

    // if the first row is below the viewport -> ignore it
    if (firstRow > layerConfig.lastRow + 1) { return; }

    // if the last row is unknow -> redraw everything
    if (lastRow === undefined) {
        this.draw();
        return;
    }

    // else update only the changed rows
    this.textLayer.updateLines(layerConfig, firstRow, lastRow);
};

ace.VirtualRenderer.prototype.draw = function() {
    var lines = this.lines;

    var offset = this.scrollTop % this.lineHeight;
    var minHeight = this.scroller.clientHeight + offset;

    var longestLine = Math.max(this.scroller.clientWidth, Math.round(this.doc
            .getWidth()
            * this.characterWidth));

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
    }
    ;

    this.gutterLayer.element.style.marginTop = (-offset) + "px";
    this.gutterLayer.element.style.height = minHeight + "px";
    this.gutterLayer.update(layerConfig);
};

ace.VirtualRenderer.prototype.addMarker = function(range, clazz) {
    return this.markerLayer.addMarker(range, clazz);
};

ace.VirtualRenderer.prototype.removeMarker = function(markerId) {
    this.markerLayer.removeMarker(markerId);
};

ace.VirtualRenderer.prototype.updateCursor = function(position) {
    this.cursorLayer.setCursor(position);
    this.cursorLayer.update(this.layerConfig);
};

ace.VirtualRenderer.prototype.hideCursor = function() {
    this.cursorLayer.hideCursor();
};

ace.VirtualRenderer.prototype.showCursor = function() {
    this.cursorLayer.showCursor();
};

ace.VirtualRenderer.prototype.scrollCursorIntoView = function() {
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

ace.VirtualRenderer.prototype.getScrollTop = function() {
    return this.scrollTop;
};

ace.VirtualRenderer.prototype.scrollToRow = function(row) {
    this.scrollToY(row * this.lineHeight);
};

ace.VirtualRenderer.prototype.scrollToY = function(scrollTop) {
    var maxHeight = this.lines.length * this.lineHeight
            - this.scroller.clientHeight;
    var scrollTop = Math.max(0, Math.min(maxHeight, scrollTop));

    if (this.scrollTop !== scrollTop) {
        this.scrollTop = scrollTop;
        this.draw();
    }
};

ace.VirtualRenderer.prototype.screenToTextCoordinates = function(pageX, pageY) {
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

ace.VirtualRenderer.prototype.visualizeFocus = function() {
    this.container.className = "editor focus";
};

ace.VirtualRenderer.prototype.visualizeBlur = function() {
    this.container.className = "editor";
};

ace.VirtualRenderer.prototype.showComposition = function(position) {
};

ace.VirtualRenderer.prototype.setCompositionText = function(text) {
};

ace.VirtualRenderer.prototype.hideComposition = function() {
};