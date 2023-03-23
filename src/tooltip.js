"use strict";

var dom = require("./lib/dom");

var CLASSNAME = "ace_tooltip";

class Tooltip {
    /**
     * @param {Element} parentNode
     **/
    constructor(parentNode) {
        this.isOpen = false;
        this.$element = null;
        this.$parentNode = parentNode;
    }
    
    $init() {
        this.$element = dom.createElement("div");
        this.$element.className = CLASSNAME;
        this.$element.style.display = "none";
        this.$parentNode.appendChild(this.$element);
        return this.$element;
    };

    /**
     * @returns {Element}
     **/
    getElement() {
        return this.$element || this.$init();
    };

    /**
     * @param {String} text
     **/
    setText(text) {
        this.getElement().textContent = text;
    };

    /**
     * @param {String} html
     **/
    setHtml(html) {
        this.getElement().innerHTML = html;
    };

    /**
     * @param {Number} x
     * @param {Number} y
     **/
    setPosition(x, y) {
        this.getElement().style.left = x + "px";
        this.getElement().style.top = y + "px";
    };

    /**
     * @param {String} className
     **/
    setClassName(className) {
        dom.addCssClass(this.getElement(), className);
    };

    /**
     * @param {String} text
     * @param {Number} x
     * @param {Number} y
     **/
    show(text, x, y) {
        if (text != null)
            this.setText(text);
        if (x != null && y != null)
            this.setPosition(x, y);
        if (!this.isOpen) {
            this.getElement().style.display = "block";
            this.isOpen = true;
        }
    };

    hide() {
        if (this.isOpen) {
            this.getElement().style.display = "none";
            this.getElement().className = CLASSNAME;
            this.isOpen = false;
        }
    };

    /**
     * @returns {Number}
     **/
    getHeight() {
        return this.getElement().offsetHeight;
    };

    /**
     * @returns {Number}
     **/
    getWidth() {
        return this.getElement().offsetWidth;
    };
    
    destroy() {
        this.isOpen = false;
        if (this.$element && this.$element.parentNode) {
            this.$element.parentNode.removeChild(this.$element);
        }
    };

}

exports.Tooltip = Tooltip;
