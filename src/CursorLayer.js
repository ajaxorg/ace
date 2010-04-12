if (!window.ace)
    ace = {};

ace.CursorLayer = function(parentEl) {
    this.element = document.createElement("div");
    this.element.className = "layer cursor-layer";
    parentEl.appendChild(this.element);

    this.cursor = document.createElement("div");
    this.cursor.className = "cursor";

    this.isVisible = false;
}

ace.CursorLayer.prototype.setCursor = function(position) {
    this.position = {
        row : position.row,
        column : position.column
    };
};

ace.CursorLayer.prototype.hideCursor = function() {
    this.isVisible = false;
    if (this.cursor.parentNode) {
        this.cursor.parentNode.removeChild(this.cursor);
    }
    clearInterval(this.blinkId);
};

ace.CursorLayer.prototype.showCursor = function() {
    this.isVisible = true;
    this.element.appendChild(this.cursor);

    var cursor = this.cursor;
    cursor.style.visibility = "visible";

    this.blinkId = setInterval(function() {
        cursor.style.visibility = "hidden";
        setTimeout(function() {
            cursor.style.visibility = "visible";
        }, 400);
    }, 1000);
};

ace.CursorLayer.prototype.getPixelPosition = function() {
    return this.pixelPos || {
        left : 0,
        top : 0
    };
}

ace.CursorLayer.prototype.update = function(config) {
    if (!this.position)
        return;

    var cursorLeft = Math.round(this.position.column * config.characterWidth);
    var cursorTop = this.position.row * config.lineHeight;

    this.pixelPos = {
        left : cursorLeft,
        top : cursorTop
    };

    this.cursor.style.left = cursorLeft + "px";
    this.cursor.style.top = (cursorTop - (config.firstRow * config.lineHeight))
            + "px";
    this.cursor.style.height = config.lineHeight + "px";

    if (this.isVisible) {
        this.element.appendChild(this.cursor);
    }
};