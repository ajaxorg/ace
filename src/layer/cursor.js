"use strict";
/**
 * @typedef {import("../edit_session").EditSession} EditSession
 */
var dom = require("../lib/dom");


class Cursor {
    /**
     * @param {HTMLElement} parentEl
     */
    constructor(parentEl) {
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
    }

    /**
     * @param {boolean} [val]
     */
    $updateOpacity(val) {
        var cursors = this.cursors;
        for (var i = cursors.length; i--; )
            dom.setStyle(cursors[i].style, "opacity", val ? "" : "0");
    }

    $startCssAnimation() {
        var cursors = this.cursors;
        for (var i = cursors.length; i--; )
            cursors[i].style.animationDuration = this.blinkInterval + "ms";

        this.$isAnimating = true;
        setTimeout(function() {
            if (this.$isAnimating) {
                dom.addCssClass(this.element, "ace_animate-blinking");
            }
        }.bind(this));
    }
    
    $stopCssAnimation() {
        this.$isAnimating = false;
        dom.removeCssClass(this.element, "ace_animate-blinking");
    }

    /**
     * @param {number} padding
     */
    setPadding(padding) {
        this.$padding = padding;
    }

    /**
     * @param {EditSession} session
     */
    setSession(session) {
        this.session = session;
    }

    /**
     * @param {boolean} blinking
     */
    setBlinking(blinking) {
        if (blinking != this.isBlinking) {
            this.isBlinking = blinking;
            this.restartTimer();
        }
    }

    /**
     * @param {number} blinkInterval
     */
    setBlinkInterval(blinkInterval) {
        if (blinkInterval != this.blinkInterval) {
            this.blinkInterval = blinkInterval;
            this.restartTimer();
        }
    }

    /**
     * @param {boolean} smoothBlinking
     */
    setSmoothBlinking(smoothBlinking) {
        if (smoothBlinking != this.smoothBlinking) {
            this.smoothBlinking = smoothBlinking;
            dom.setCssClass(this.element, "ace_smooth-blinking", smoothBlinking);
            this.$updateCursors(true);
            this.restartTimer();
        }
    }

    addCursor() {
        var el = dom.createElement("div");
        el.className = "ace_cursor";
        this.element.appendChild(el);
        this.cursors.push(el);
        return el;
    }

    removeCursor() {
        if (this.cursors.length > 1) {
            var el = this.cursors.pop();
            el.parentNode.removeChild(el);
            return el;
        }
    }

    hideCursor() {
        this.isVisible = false;
        dom.addCssClass(this.element, "ace_hidden-cursors");
        this.restartTimer();
    }

    showCursor() {
        this.isVisible = true;
        dom.removeCssClass(this.element, "ace_hidden-cursors");
        this.restartTimer();
    }

    restartTimer() {
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
            var blink = /**@this{Cursor}*/function(){
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
    }

    /**
     * @param {import("../../ace-internal").Ace.Point} [position]
     * @param {boolean} [onScreen]
     */
    getPixelPosition(position, onScreen) {
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
    }

    isCursorInView(pixelPos, config) {
        return pixelPos.top >= 0 && pixelPos.top < config.maxHeight;
    }

    update(config) {
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
    }

    /**
     * @param {boolean} overwrite
     */
    $setOverwrite(overwrite) {
        if (overwrite != this.overwrite) {
            this.overwrite = overwrite;
            if (overwrite)
                dom.addCssClass(this.element, "ace_overwrite-cursors");
            else
                dom.removeCssClass(this.element, "ace_overwrite-cursors");
        }
    }

    destroy() {
        clearInterval(this.intervalId);
        clearTimeout(this.timeoutId);
    }

}

Cursor.prototype.$padding = 0;
Cursor.prototype.drawCursor = null;


exports.Cursor = Cursor;
