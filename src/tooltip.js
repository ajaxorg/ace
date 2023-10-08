"use strict";

var dom = require("./lib/dom");
var Range = require("./range").Range;

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
    }

    /**
     * @returns {HTMLElement}
     **/
    getElement() {
        return this.$element || this.$init();
    }

    /**
     * @param {String} text
     **/
    setText(text) {
        this.getElement().textContent = text;
    }

    /**
     * @param {String} html
     **/
    setHtml(html) {
        this.getElement().innerHTML = html;
    }

    /**
     * @param {Number} x
     * @param {Number} y
     **/
    setPosition(x, y) {
        this.getElement().style.left = x + "px";
        this.getElement().style.top = y + "px";
    }

    /**
     * @param {String} className
     **/
    setClassName(className) {
        dom.addCssClass(this.getElement(), className);
    }

    setTheme(theme) {
        this.$element.className = CLASSNAME + " " +
            (theme.isDark? "ace_dark " : "") + (theme.cssClass || "");
    }

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
    }

    hide() {
        if (this.isOpen) {
            this.getElement().style.display = "none";
            this.getElement().className = CLASSNAME;
            this.isOpen = false;
        }
    }

    /**
     * @returns {Number}
     **/
    getHeight() {
        return this.getElement().offsetHeight;
    }

    /**
     * @returns {Number}
     **/
    getWidth() {
        return this.getElement().offsetWidth;
    }
    
    destroy() {
        this.isOpen = false;
        if (this.$element && this.$element.parentNode) {
            this.$element.parentNode.removeChild(this.$element);
        }
    }

}

class PopupManager {
    constructor () {
        this.popups = [];
    }
    
    addPopup(popup) {
        this.popups.push(popup);
        this.updatePopups();
    }

    removePopup(popup) {
        const index = this.popups.indexOf(popup);
        if (index !== -1) {
            this.popups.splice(index, 1);
            this.updatePopups();
        }
    }

    updatePopups() {
        this.popups.sort((a, b) => b.priority - a.priority);
        let visiblepopups = [];

        for (let popup of this.popups) {
            let shouldDisplay = true;
            for (let visiblePopup of visiblepopups) {
                if (this.doPopupsOverlap(visiblePopup, popup)) {
                    shouldDisplay = false;
                    break;
                }
            }
            
            if (shouldDisplay) {
                visiblepopups.push(popup);
            } else {
                popup.hide();
            }
        }
    }

    doPopupsOverlap (popupA, popupB) {
        const rectA = popupA.getElement().getBoundingClientRect();
        const rectB = popupB.getElement().getBoundingClientRect();

        return (rectA.left < rectB.right && rectA.right > rectB.left && rectA.top < rectB.bottom && rectA.bottom
            > rectB.top);
    }
}

var popupManager = new PopupManager();
exports.popupManager = popupManager;

exports.Tooltip = Tooltip;


class HoverTooltip extends Tooltip {
    constructor(parentNode=document.body) {
        super(parentNode);
        
        this.timeout = undefined;
        this.lastT = 0;
        this.idleTime = 350;
        this.lastEvent = undefined;
        
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.waitForHover = this.waitForHover.bind(this);
        this.hide = this.hide.bind(this);
        
        var el = this.getElement();
        el.style.whiteSpace = "pre-wrap";
        el.style.pointerEvents = "auto";
        el.addEventListener("mouseout", this.onMouseOut);
        el.tabIndex = -1;
        
        el.addEventListener("blur", function() {
            if (!el.contains(document.activeElement)) this.hide();
        }.bind(this));
    }
    
    addToEditor(editor) {
        editor.on("mousemove", this.onMouseMove);
        editor.on("mousedown", this.hide);
        editor.renderer.getMouseEventTarget().addEventListener("mouseout", this.onMouseOut, true);
    }

    removeFromEditor(editor) {
        editor.off("mousemove", this.onMouseMove);
        editor.off("mousedown", this.hide);
        editor.renderer.getMouseEventTarget().removeEventListener("mouseout", this.onMouseOut, true);
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    onMouseMove(e, editor) {
        this.lastEvent = e;
        this.lastT = Date.now();
        var isMousePressed = editor.$mouseHandler.isMousePressed;
        if (this.isOpen) {
            var pos = this.lastEvent && this.lastEvent.getDocumentPosition();
            if (
                !this.range 
                || !this.range.contains(pos.row, pos.column)
                || isMousePressed
                || this.isOutsideOfText(this.lastEvent)
            ) {
                this.hide();
            }
        }
        if (this.timeout || isMousePressed) return;
        this.lastEvent = e;
        this.timeout = setTimeout(this.waitForHover, this.idleTime);
    }
    waitForHover() {
        if (this.timeout) clearTimeout(this.timeout);
        var dt = Date.now() - this.lastT;
        if (this.idleTime - dt > 10) {
            this.timeout = setTimeout(this.waitForHover, this.idleTime - dt);
            return;
        }
        
        this.timeout = null;
        if (this.lastEvent && !this.isOutsideOfText(this.lastEvent)) {
            this.$gatherData(this.lastEvent, this.lastEvent.editor);
        }
    }

    isOutsideOfText(e) {
        var editor = e.editor;
        var docPos = e.getDocumentPosition();
        var line = editor.session.getLine(docPos.row);
        if (docPos.column == line.length) {
            var screenPos = editor.renderer.pixelToScreenCoordinates(e.clientX, e.clientY);
            var clippedPos = editor.session.documentToScreenPosition(docPos.row, docPos.column);
            if (
                clippedPos.column != screenPos.column
                || clippedPos.row != screenPos.row
            ) {
                return true;
            }
        }
        return false;
    }
    
    setDataProvider(value) {
        this.$gatherData = value;
    }
    
    showForRange(editor, range, domNode, startingEvent) {
        if (startingEvent && startingEvent != this.lastEvent) return;
        if (this.isOpen && document.activeElement == this.getElement()) return;
        
        var renderer = editor.renderer;
        if (!this.isOpen) {
            popupManager.addPopup(this);
            this.$registerCloseEvents();
            this.setTheme(renderer.theme);
        }
        this.isOpen = true;
        
        this.addMarker(range, editor.session);
        this.range = Range.fromPoints(range.start, range.end);
        
        var element = this.getElement();
        element.innerHTML = "";
        element.appendChild(domNode);
        element.style.display = "block";
        
        var position = renderer.textToScreenCoordinates(range.start.row, range.start.column);
        
        var labelHeight = element.clientHeight;
        var rect = renderer.scroller.getBoundingClientRect();

        let isAbove = true;
        if (position.pageY - labelHeight < 0) {
            // does not fit in window
            isAbove = false;
        }
        if (isAbove) {
            position.pageY -= labelHeight;
        } else {
            position.pageY += renderer.lineHeight;
        }

        element.style.maxWidth = rect.width - (position.pageX - rect.left) + "px";

        this.setPosition(position.pageX, position.pageY);
    }
    
    addMarker(range, session) {
        if (this.marker) {
            this.$markerSession.removeMarker(this.marker);
        }
        this.$markerSession = session;
        this.marker = session && session.addMarker(range, "ace_highlight-marker", "text");
    }
    
    hide(e) {
        if (!e && document.activeElement == this.getElement())
            return;
        if (e && e.target && (e.type != "keydown" || e.ctrlKey || e.metaKey) && this.$element.contains(e.target))
            return;
        this.lastEvent = null;
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = null;
        this.addMarker(null);
        if (this.isOpen) {
            this.$removeCloseEvents();
            this.getElement().style.display = "none";
            this.isOpen = false;
            popupManager.removePopup(this);
        }
    }

    $registerCloseEvents() {
        window.addEventListener("keydown", this.hide, true);
        window.addEventListener("mousewheel", this.hide, true);
        window.addEventListener("mousedown", this.hide, true);
    }

    $removeCloseEvents() {
        window.removeEventListener("keydown", this.hide, true);
        window.removeEventListener("mousewheel", this.hide, true);
        window.removeEventListener("mousedown", this.hide, true);
    }

    onMouseOut(e) {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.lastEvent = null;
        if (!this.isOpen) return;

        if (!e.relatedTarget || e.relatedTarget == this.getElement()) return;

        if (e && e.currentTarget.contains(e.relatedTarget)) return;
        if (!e.relatedTarget.classList.contains("ace_content")) this.hide();
    }
}

exports.HoverTooltip = HoverTooltip;