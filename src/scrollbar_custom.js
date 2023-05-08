"use strict";

var oop = require("./lib/oop");
var dom = require("./lib/dom");
var event = require("./lib/event");
var EventEmitter = require("./lib/event_emitter").EventEmitter;

dom.importCssString(`.ace_editor>.ace_sb-v div, .ace_editor>.ace_sb-h div{
  position: absolute;
  background: rgba(128, 128, 128, 0.6);
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  border: 1px solid #bbb;
  border-radius: 2px;
  z-index: 8;
}
.ace_editor>.ace_sb-v, .ace_editor>.ace_sb-h {
  position: absolute;
  z-index: 6;
  background: none;
  overflow: hidden!important;
}
.ace_editor>.ace_sb-v {
  z-index: 6;
  right: 0;
  top: 0;
  width: 12px;
}
.ace_editor>.ace_sb-v div {
  z-index: 8;
  right: 0;
  width: 100%;
}
.ace_editor>.ace_sb-h {
  bottom: 0;
  left: 0;
  height: 12px;
}
.ace_editor>.ace_sb-h div {
  bottom: 0;
  height: 100%;
}
.ace_editor>.ace_sb_grabbed {
  z-index: 8;
  background: #000;
}`, "ace_scrollbar.css", false);

/**
 * An abstract class representing a native scrollbar control.
 **/
class ScrollBar {
    /**
     * Creates a new `ScrollBar`. `parent` is the owner of the scroll bar.
     * @param {Element} parent A DOM element
     * @param {string} classSuffix
     **/
    constructor(parent, classSuffix) {
        this.element = dom.createElement("div");
        this.element.className = "ace_sb" + classSuffix;
        this.inner = dom.createElement("div");
        this.inner.className = "";
        this.element.appendChild(this.inner);
        this.VScrollWidth = 12;
        this.HScrollHeight = 12;

        parent.appendChild(this.element);
        this.setVisible(false);
        this.skipEvent = false;

        event.addMultiMouseDownListener(this.element, [500, 300, 300], this, "onMouseDown");
    }

    setVisible(isVisible) {
        this.element.style.display = isVisible ? "" : "none";
        this.isVisible = isVisible;
        this.coeff = 1;
    }
}

oop.implement(ScrollBar.prototype, EventEmitter);
/**
 * Represents a vertical scroll bar.
 * @class VScrollBar
 **/

/**
 * Creates a new `VScrollBar`. `parent` is the owner of the scroll bar.
 * @param {Element} parent A DOM element
 * @param {Object} renderer An editor renderer
 *
 * @constructor
 **/
class VScrollBar extends ScrollBar {
    
    constructor(parent, renderer) {
        super(parent, '-v');
        this.scrollTop = 0;
        this.scrollHeight = 0;
        this.parent = parent;
        this.width = this.VScrollWidth;
        this.renderer = renderer;
        this.inner.style.width = this.element.style.width = (this.width || 15) + "px";
        this.$minWidth = 0;
    }
    
    /**
     * Emitted when the scroll thumb dragged or scrollbar canvas clicked.
     **/
    onMouseDown(eType, e) {
        if (eType !== "mousedown") return;

        if (event.getButton(e) !== 0 || e.detail === 2) {
            return;
        }

        if (e.target === this.inner) {
            var self = this;
            var mousePageY = e.clientY;

            var onMouseMove = function (e) {
                mousePageY = e.clientY;
            };

            var onMouseUp = function () {
                clearInterval(timerId);
            };
            var startY = e.clientY;
            var startTop = this.thumbTop;

            var onScrollInterval = function () {
                if (mousePageY === undefined) return;
                var scrollTop = self.scrollTopFromThumbTop(startTop + mousePageY - startY);
                if (scrollTop === self.scrollTop) return;
                self._emit("scroll", {data: scrollTop});
            };

            event.capture(this.inner, onMouseMove, onMouseUp);
            var timerId = setInterval(onScrollInterval, 20);
            return event.preventDefault(e);
        }
        var top = e.clientY - this.element.getBoundingClientRect().top - this.thumbHeight / 2;
        this._emit("scroll", {data: this.scrollTopFromThumbTop(top)});
        return event.preventDefault(e);
    }

    getHeight() {
        return this.height;
    }

    /**
     * Returns new top for scroll thumb
     * @param {Number}thumbTop
     * @returns {Number}
     **/
    scrollTopFromThumbTop(thumbTop) {
        var scrollTop = thumbTop * (this.pageHeight - this.viewHeight) / (this.slideHeight - this.thumbHeight);
        scrollTop = scrollTop >> 0;
        if (scrollTop < 0) {
            scrollTop = 0;
        }
        else if (scrollTop > this.pageHeight - this.viewHeight) {
            scrollTop = this.pageHeight - this.viewHeight;
        }
        return scrollTop;
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
        this.height = Math.max(0, height);
        this.slideHeight = this.height;
        this.viewHeight = this.height;

        this.setScrollHeight(this.pageHeight, true);
    }

    /**
     * Sets the inner and scroll height of the scroll bar, in pixels.
     * @param {Number} height The new inner height
     *
     * @param {boolean} force Forcely update height
     **/
    setScrollHeight(height, force) {
        if (this.pageHeight === height && !force) return;
        this.pageHeight = height;
        this.thumbHeight = this.slideHeight * this.viewHeight / this.pageHeight;

        if (this.thumbHeight > this.slideHeight) this.thumbHeight = this.slideHeight;
        if (this.thumbHeight < 15) this.thumbHeight = 15;

        this.inner.style.height = this.thumbHeight + "px";

        if (this.scrollTop > (this.pageHeight - this.viewHeight)) {
            this.scrollTop = (this.pageHeight - this.viewHeight);
            if (this.scrollTop < 0) this.scrollTop = 0;
            this._emit("scroll", {data: this.scrollTop});
        }
    }

    /**
     * Sets the scroll top of the scroll bar.
     * @param {Number} scrollTop The new scroll top
     **/
    setScrollTop(scrollTop) {
        this.scrollTop = scrollTop;
        if (scrollTop < 0) scrollTop = 0;
        this.thumbTop = scrollTop * (this.slideHeight - this.thumbHeight) / (this.pageHeight - this.viewHeight);
        this.inner.style.top = this.thumbTop + "px";
    }
}

VScrollBar.prototype.setInnerHeight = VScrollBar.prototype.setScrollHeight;

/**
 * Represents a horizontal scroll bar.
 **/
class HScrollBar extends ScrollBar {
    /**
     * Creates a new `HScrollBar`. `parent` is the owner of the scroll bar.
     * @param {Element} parent A DOM element
     * @param {Object} renderer An editor renderer
     **/
    constructor(parent, renderer) {
        super(parent, '-h');
        this.scrollLeft = 0;
        this.scrollWidth = 0;
        this.height = this.HScrollHeight;
        this.inner.style.height = this.element.style.height = (this.height || 12) + "px";
        this.renderer = renderer;
    }
    
    /**
     * Emitted when the scroll thumb dragged or scrollbar canvas clicked.
     **/
    onMouseDown(eType, e) {
        if (eType !== "mousedown") return;

        if (event.getButton(e) !== 0 || e.detail === 2) {
            return;
        }


        if (e.target === this.inner) {
            var self = this;
            var mousePageX = e.clientX;

            var onMouseMove = function (e) {
                mousePageX = e.clientX;
            };

            var onMouseUp = function () {
                clearInterval(timerId);
            };
            var startX = e.clientX;
            var startLeft = this.thumbLeft;

            var onScrollInterval = function () {
                if (mousePageX === undefined) return;
                var scrollLeft = self.scrollLeftFromThumbLeft(startLeft + mousePageX - startX);
                if (scrollLeft === self.scrollLeft) return;
                self._emit("scroll", {data: scrollLeft});
            };

            event.capture(this.inner, onMouseMove, onMouseUp);
            var timerId = setInterval(onScrollInterval, 20);
            return event.preventDefault(e);
        }

        var left = e.clientX - this.element.getBoundingClientRect().left - this.thumbWidth / 2;
        this._emit("scroll", {data: this.scrollLeftFromThumbLeft(left)});
        return event.preventDefault(e);
    }

    /**
     * Returns the height of the scroll bar.
     * @returns {Number}
     **/
    getHeight() {
        return this.isVisible ? this.height : 0;
    }

    /**
     * Returns new left for scroll thumb
     * @param {Number} thumbLeft
     * @returns {Number}
     **/
    scrollLeftFromThumbLeft(thumbLeft) {
        var scrollLeft = thumbLeft * (this.pageWidth - this.viewWidth) / (this.slideWidth - this.thumbWidth);
        scrollLeft = scrollLeft >> 0;
        if (scrollLeft < 0) {
            scrollLeft = 0;
        }
        else if (scrollLeft > this.pageWidth - this.viewWidth) {
            scrollLeft = this.pageWidth - this.viewWidth;
        }
        return scrollLeft;
    }

    /**
     * Sets the width of the scroll bar, in pixels.
     * @param {Number} width The new width
     **/
    setWidth(width) {
        this.width = Math.max(0, width);
        this.element.style.width = this.width + "px";
        this.slideWidth = this.width;
        this.viewWidth = this.width;

        this.setScrollWidth(this.pageWidth, true);
    }

    /**
     * Sets the inner and scroll width of the scroll bar, in pixels.
     * @param {Number} width The new inner width
     * @param {boolean} force Forcely update width
     **/
     setScrollWidth(width, force) {
        if (this.pageWidth === width && !force) return;
        this.pageWidth = width;
        this.thumbWidth = this.slideWidth * this.viewWidth / this.pageWidth;

        if (this.thumbWidth > this.slideWidth) this.thumbWidth = this.slideWidth;
        if (this.thumbWidth < 15) this.thumbWidth = 15;
        this.inner.style.width = this.thumbWidth + "px";

        if (this.scrollLeft > (this.pageWidth - this.viewWidth)) {
            this.scrollLeft = (this.pageWidth - this.viewWidth);
            if (this.scrollLeft < 0) this.scrollLeft = 0;
            this._emit("scroll", {data: this.scrollLeft});
        }
    }


    /**
     * Sets the scroll left of the scroll bar.
     * @param {Number} scrollLeft The new scroll left
     **/
    setScrollLeft(scrollLeft) {
        this.scrollLeft = scrollLeft;
        if (scrollLeft < 0) scrollLeft = 0;
        this.thumbLeft = scrollLeft * (this.slideWidth - this.thumbWidth) / (this.pageWidth - this.viewWidth);
        this.inner.style.left = (this.thumbLeft) + "px";
    }

}

HScrollBar.prototype.setInnerWidth = HScrollBar.prototype.setScrollWidth;

exports.ScrollBar = VScrollBar; // backward compatibility
exports.ScrollBarV = VScrollBar; // backward compatibility
exports.ScrollBarH = HScrollBar; // backward compatibility

exports.VScrollBar = VScrollBar;
exports.HScrollBar = HScrollBar;
