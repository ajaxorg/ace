"use strict";

var oop = require("./lib/oop");
var dom = require("./lib/dom");
var event = require("./lib/event");
var EventEmitter = require("./lib/event_emitter").EventEmitter;
// on ie maximal element height is smaller than what we get from 4-5K line document
// so scrollbar doesn't work, as a workaround we do not set height higher than MAX_SCROLL_H
// and rescale scrolltop
var MAX_SCROLL_H = 0x8000;

/**
 * An abstract class representing a native scrollbar control.
 **/
class Scrollbar {
    /**
     * Creates a new `ScrollBar`. `parent` is the owner of the scroll bar.
     * @param {Element} parent A DOM element
     * @param {string} classSuffix
     **/
    constructor(parent, classSuffix) {
        this.element = dom.createElement("div");
        this.element.className = "ace_scrollbar ace_scrollbar" + classSuffix;

        this.inner = dom.createElement("div");
        this.inner.className = "ace_scrollbar-inner";
        // on safari scrollbar is not shown for empty elements
        this.inner.textContent = "\xa0";
        this.element.appendChild(this.inner);

        parent.appendChild(this.element);

        this.setVisible(false);
        this.skipEvent = false;

        // @ts-expect-error
        event.addListener(this.element, "scroll", this.onScroll.bind(this));
        event.addListener(this.element, "mousedown", event.preventDefault);
    }
    
    setVisible(isVisible) {
        this.element.style.display = isVisible ? "" : "none";
        this.isVisible = isVisible;
        this.coeff = 1;
    }
}
oop.implement(Scrollbar.prototype, EventEmitter);

/**
 * Represents a vertical scroll bar.
 **/
class VScrollBar extends Scrollbar {
    /**
     * Creates a new `VScrollBar`. `parent` is the owner of the scroll bar.
     * @param {Element} parent A DOM element
     * @param {Object} renderer An editor renderer
     **/
    constructor(parent, renderer) {
        super(parent, '-v');
        this.scrollTop = 0;
        this.scrollHeight = 0;

        // in OSX lion the scrollbars appear to have no width. In this case resize the
        // element to show the scrollbar but still pretend that the scrollbar has a width
        // of 0px
        // in Firefox 6+ scrollbar is hidden if element has the same width as scrollbar
        // make element a little bit wider to retain scrollbar when page is zoomed 
        renderer.$scrollbarWidth =
            this.width = dom.scrollbarWidth(parent.ownerDocument);
        this.inner.style.width =
            this.element.style.width = (this.width || 15) + 5 + "px";
        this.$minWidth = 0;
    }
    

    /**
     * Emitted when the scroll bar, well, scrolls.
     * @event scroll
     **/

    onScroll() {
        if (!this.skipEvent) {
            this.scrollTop = this.element.scrollTop;
            if (this.coeff != 1) {
                var h = this.element.clientHeight / this.scrollHeight;
                this.scrollTop = this.scrollTop * (1 - h) / (this.coeff - h);
            }
            this._emit("scroll", {data: this.scrollTop});
        }
        this.skipEvent = false;
    }

    /**
     * Returns the width of the scroll bar.
     * @returns {Number}
     **/
    getWidth() {
        return Math.max(this.isVisible ? this.width : 0, this.$minWidth || 0);
    }

    /**
     * Sets the height of the scroll bar, in pixels.
     * @param {Number} height The new height
     **/
    setHeight(height) {
        this.element.style.height = height + "px";
    }
    
    /**
     * Sets the scroll height of the scroll bar, in pixels.
     * @param {Number} height The new scroll height
     **/
    setScrollHeight(height) {
        this.scrollHeight = height;
        if (height > MAX_SCROLL_H) {
            this.coeff = MAX_SCROLL_H / height;
            height = MAX_SCROLL_H;
        } else if (this.coeff != 1) {
            this.coeff = 1;
        }
        this.inner.style.height = height + "px";
    }


    /**
     * Sets the scroll top of the scroll bar.
     * @param {Number} scrollTop The new scroll top
     **/
    setScrollTop(scrollTop) {
        // on chrome 17+ for small zoom levels after calling this function
        // this.element.scrollTop != scrollTop which makes page to scroll up.
        if (this.scrollTop != scrollTop) {
            this.skipEvent = true;
            this.scrollTop = scrollTop;
            this.element.scrollTop = scrollTop * this.coeff;
        }
    }

}

/**
 * Sets the inner height of the scroll bar, in pixels.
 * @param {Number} height The new inner height
 * @deprecated Use setScrollHeight instead
 **/
VScrollBar.prototype.setInnerHeight = VScrollBar.prototype.setScrollHeight;

/**
 * Represents a horisontal scroll bar.
 **/
class HScrollBar extends Scrollbar {
    /**
     * Creates a new `HScrollBar`. `parent` is the owner of the scroll bar.
     * @param {Element} parent A DOM element
     * @param {Object} renderer An editor renderer
     **/
    constructor(parent, renderer) {
        super(parent, '-h');
        this.scrollLeft = 0;

        // in OSX lion the scrollbars appear to have no width. In this case resize the
        // element to show the scrollbar but still pretend that the scrollbar has a width
        // of 0px
        // in Firefox 6+ scrollbar is hidden if element has the same width as scrollbar
        // make element a little bit wider to retain scrollbar when page is zoomed 
        this.height = renderer.$scrollbarWidth;
        this.inner.style.height =
            this.element.style.height = (this.height || 15) + 5 + "px";
    }
    
    /**
     * Emitted when the scroll bar, well, scrolls.
     * @event scroll
     **/
    onScroll() {
        if (!this.skipEvent) {
            this.scrollLeft = this.element.scrollLeft;
            this._emit("scroll", {data: this.scrollLeft});
        }
        this.skipEvent = false;
    }

    /**
     * Returns the height of the scroll bar.
     * @returns {Number}
     **/
    getHeight() {
        return this.isVisible ? this.height : 0;
    }

    /**
     * Sets the width of the scroll bar, in pixels.
     * @param {Number} width The new width
     **/
    setWidth(width) {
        this.element.style.width = width + "px";
    }

    /**
     * Sets the inner width of the scroll bar, in pixels.
     * @param {Number} width The new inner width
     * @deprecated Use setScrollWidth instead
     **/
    setInnerWidth(width) {
        this.inner.style.width = width + "px";
    }

    /**
     * Sets the scroll width of the scroll bar, in pixels.
     * @param {Number} width The new scroll width
     **/
    setScrollWidth(width) {
        this.inner.style.width = width + "px";
    }

    /**
     * Sets the scroll left of the scroll bar.
     * @param {Number} scrollLeft The new scroll left
     **/
    setScrollLeft(scrollLeft) {
        // on chrome 17+ for small zoom levels after calling this function
        // this.element.scrollTop != scrollTop which makes page to scroll up.
        if (this.scrollLeft != scrollLeft) {
            this.skipEvent = true;
            this.scrollLeft = this.element.scrollLeft = scrollLeft;
        }
    }

}


exports.ScrollBar = VScrollBar; // backward compatibility
exports.ScrollBarV = VScrollBar; // backward compatibility
exports.ScrollBarH = HScrollBar; // backward compatibility

exports.VScrollBar = VScrollBar;
exports.HScrollBar = HScrollBar;
