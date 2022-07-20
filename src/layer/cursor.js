"use strict";

var dom = require("../lib/dom");

var Cursor = function(parentEl) {
    this.element = dom.createElement("div");
    this.element.className = "ace_layer ace_cursor-layer";
    parentEl.appendChild(this.element);
    
    this.isVisible = false;
    this.isBlinking = true;
    this.blinkInterval = 1000;
    this.smoothBlinking = false;

    this.cursors = [];
    this.cursor = this.addCursor();
    dom.addCssClass(this.element, "ace_hidden-cursors");
    this.$updateCursors = this.$updateOpacity.bind(this);
};

(function() {
    
    this.$updateOpacity = function(val) {
        var cursors = this.cursors;
        for (var i = cursors.length; i--; )
            dom.setStyle(cursors[i].style, "opacity", val ? "" : "0");
    };

    this.$startCssAnimation = function() {
        var cursors = this.cursors;
        for (var i = cursors.length; i--; )
            cursors[i].style.animationDuration = this.blinkInterval + "ms";

        this.$isAnimating = true;
        setTimeout(function() {
            if (this.$isAnimating) {
                dom.addCssClass(this.element, "ace_animate-blinking");
            }
        }.bind(this));
    };
    
    this.$stopCssAnimation = function() {
        this.$isAnimating = false;
        dom.removeCssClass(this.element, "ace_animate-blinking");
    };

    this.$padding = 0;
    this.setPadding = function(padding) {
        this.$padding = padding;
    };

    this.setSession = function(session) {
        this.session = session;
    };

    this.setBlinking = function(blinking) {
        if (blinking != this.isBlinking) {
            this.isBlinking = blinking;
            this.restartTimer();
        }
    };

    this.setBlinkInterval = function(blinkInterval) {
        if (blinkInterval != this.blinkInterval) {
            this.blinkInterval = blinkInterval;
            this.restartTimer();
        }
    };

    this.setSmoothBlinking = function(smoothBlinking) {
        if (smoothBlinking != this.smoothBlinking) {
            this.smoothBlinking = smoothBlinking;
            dom.setCssClass(this.element, "ace_smooth-blinking", smoothBlinking);
            this.$updateCursors(true);
            this.restartTimer();
        }
    };

    this.addCursor = function() {
        var el = dom.createElement("div");
        el.className = "ace_cursor";
        this.element.appendChild(el);
        this.cursors.push(el);
        return el;
    };

    this.removeCursor = function() {
        if (this.cursors.length > 1) {
            var el = this.cursors.pop();
            el.parentNode.removeChild(el);
            return el;
        }
    };

    this.hideCursor = function() {
        this.isVisible = false;
        dom.addCssClass(this.element, "ace_hidden-cursors");
        this.restartTimer();
    };

    this.showCursor = function() {
        this.isVisible = true;
        dom.removeCssClass(this.element, "ace_hidden-cursors");
        this.restartTimer();
    };

    this.restartTimer = function() {
        var update = this.$updateCursors;
        clearInterval(this.intervalId);
        clearTimeout(this.timeoutId);
        this.$stopCssAnimation();

        if (this.smoothBlinking) {
            this.$isSmoothBlinking = false;
            dom.removeCssClass(this.element, "ace_smooth-blinking");
        }
        
        update(true);

        if (!this.isBlinking || !this.blinkInterval || !this.isVisible) {
            this.$stopCssAnimation();
            return;
        }

        if (this.smoothBlinking) {
            this.$isSmoothBlinking = true;
            setTimeout(function() {
                if (this.$isSmoothBlinking) {
                    dom.addCssClass(this.element, "ace_smooth-blinking");
                }
            }.bind(this));
        }
        
        if (dom.HAS_CSS_ANIMATION) {
            this.$startCssAnimation();
        } else {
            var blink = function(){
                this.timeoutId = setTimeout(function() {
                    update(false);
                }, 0.6 * this.blinkInterval);
            }.bind(this);
    
            this.intervalId = setInterval(function() {
                update(true);
                blink();
            }, this.blinkInterval);
            blink();
        }
    };

    this.getPixelPosition = function(position, onScreen) {
        if (!this.config || !this.session)
            return {left : 0, top : 0};

        if (!position)
            position = this.session.selection.getCursor();
        var pos = this.session.documentToScreenPosition(position);
        var cursorLeft = this.$padding + (this.session.$bidiHandler.isBidiRow(pos.row, position.row)
            ? this.session.$bidiHandler.getPosLeft(pos.column)
            : pos.column * this.config.characterWidth);

        var cursorTop = (pos.row - (onScreen ? this.config.firstRowScreen : 0)) *
            this.config.lineHeight;

        return {left : cursorLeft, top : cursorTop};
    };

    this.isCursorInView = function(pixelPos, config) {
        return pixelPos.top >= 0 && pixelPos.top < config.maxHeight;
    };

    this.update = function(config) {
        this.config = config;

        var selections = this.session.$selectionMarkers;
        var i = 0, cursorIndex = 0;

        if (selections === undefined || selections.length === 0){
            selections = [{cursor: null}];
        }

        for (var i = 0, n = selections.length; i < n; i++) {
            var pixelPos = this.getPixelPosition(selections[i].cursor, true);
            if ((pixelPos.top > config.height + config.offset ||
                 pixelPos.top < 0) && i > 1) {
                continue;
            }

            var element = this.cursors[cursorIndex++] || this.addCursor();
            var style = element.style;
            
            if (!this.drawCursor) {
                if (!this.isCursorInView(pixelPos, config)) {
                    dom.setStyle(style, "display", "none");
                } else {
                    dom.setStyle(style, "display", "block");
                    dom.translate(element, pixelPos.left, pixelPos.top);
                    dom.setStyle(style, "width", Math.round(config.characterWidth) + "px");
                    dom.setStyle(style, "height", config.lineHeight + "px");
                }
            } else {
                this.drawCursor(element, pixelPos, config, selections[i], this.session);
            }
        }
        while (this.cursors.length > cursorIndex)
            this.removeCursor();

        var overwrite = this.session.getOverwrite();
        this.$setOverwrite(overwrite);

        // cache for textarea and gutter highlight
        this.$pixelPos = pixelPos;
        this.restartTimer();
    };
    
    this.drawCursor = null;

    this.$setOverwrite = function(overwrite) {
        if (overwrite != this.overwrite) {
            this.overwrite = overwrite;
            if (overwrite)
                dom.addCssClass(this.element, "ace_overwrite-cursors");
            else
                dom.removeCssClass(this.element, "ace_overwrite-cursors");
        }
    };

    this.destroy = function() {
        clearInterval(this.intervalId);
        clearTimeout(this.timeoutId);
    };

}).call(Cursor.prototype);

exports.Cursor = Cursor;
