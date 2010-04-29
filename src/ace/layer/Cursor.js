ace.provide("ace.layer.Cursor");

ace.layer.Cursor = function(parentEl) {
    this.element = document.createElement("div");
    this.element.className = "layer cursor-layer";
    parentEl.appendChild(this.element);

    this.cursor = document.createElement("div");
    this.cursor.className = "cursor";

    this.isVisible = false;
};

(function() {

    this.setCursor = function(position, overwrite) {
        this.position = {
            row : position.row,
            column : position.column
        };
        if (overwrite) {
            ace.addCssClass(this.cursor, "overwrite");
        } else {
            ace.removeCssClass(this.cursor, "overwrite");
        }
    };

    this.hideCursor = function() {
        this.isVisible = false;
        if (this.cursor.parentNode) {
            this.cursor.parentNode.removeChild(this.cursor);
        }
        clearInterval(this.blinkId);
    };

    this.showCursor = function() {
        this.isVisible = true;
        this.element.appendChild(this.cursor);

        var cursor = this.cursor;
        cursor.style.visibility = "visible";
        this.restartTimer();
    };

    this.restartTimer = function() {
        clearInterval(this.blinkId);
        if (!this.isVisible) {
            return;
        }

        var cursor = this.cursor;
        this.blinkId = setInterval(function() {
            cursor.style.visibility = "hidden";
            setTimeout(function() {
                cursor.style.visibility = "visible";
            }, 400);
        }, 1000);
    };

    this.getPixelPosition = function() {
        return this.pixelPos || {
            left : 0,
            top : 0
        };
    };

    this.update = function(config) {
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
        this.cursor.style.width = config.characterWidth + "px";
        this.cursor.style.height = config.lineHeight + "px";

        if (this.isVisible) {
            this.element.appendChild(this.cursor);
        }
        this.restartTimer();
    };

}).call(ace.layer.Cursor.prototype);