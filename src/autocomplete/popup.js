"use strict";
var Renderer = require("../virtual_renderer").VirtualRenderer;
var Editor = require("../editor").Editor;
var Range = require("../range").Range;
var event = require("../lib/event");
var lang = require("../lib/lang");
var dom = require("../lib/dom");
var nls = require("../config").nls;
var userAgent = require("./../lib/useragent");

var getAriaId = function (index) {
    return `suggest-aria-id:${index}`;
};

// Safari requires different ARIA A11Y attributes compared to other browsers
var popupAriaRole = userAgent.isSafari ? "menu" : "listbox";
var optionAriaRole = userAgent.isSafari ? "menuitem" : "option";
var ariaActiveState = userAgent.isSafari ? "aria-current" : "aria-selected";

/**
 *
 * @param {HTMLElement} [el]
 * @return {Editor}
 */
var $singleLineEditor = function(el) {
    var renderer = new Renderer(el);

    renderer.$maxLines = 4;
    var editor = new Editor(renderer);

    editor.setHighlightActiveLine(false);
    editor.setShowPrintMargin(false);
    editor.renderer.setShowGutter(false);
    editor.renderer.setHighlightGutterLine(false);

    editor.$mouseHandler.$focusTimeout = 0;
    editor.$highlightTagPending = true;

    return editor;
};

/**
 * This object is used in some places where needed to show popups - like prompt; autocomplete etc.
 */
class AcePopup {
    /**
     * Creates and renders single line editor in popup window. If `parentNode` param is isset, then attaching it to this element.
     * @param {Element} [parentNode]
     */
    constructor(parentNode) {
        var el = dom.createElement("div");
        /**@type {AcePopup}*/
        // @ts-ignore
        var popup = $singleLineEditor(el);

        if (parentNode) {
            parentNode.appendChild(el);
        }
        el.style.display = "none";
        popup.renderer.content.style.cursor = "default";
        popup.renderer.setStyle("ace_autocomplete");

        // Set aria attributes for the popup
        popup.renderer.$textLayer.element.setAttribute("role", popupAriaRole);
        popup.renderer.$textLayer.element.setAttribute("aria-roledescription", nls("autocomplete.popup.aria-roledescription", "Autocomplete suggestions"));
        popup.renderer.$textLayer.element.setAttribute("aria-label", nls("autocomplete.popup.aria-label", "Autocomplete suggestions"));
        popup.renderer.textarea.setAttribute("aria-hidden", "true");

        popup.setOption("displayIndentGuides", false);
        popup.setOption("dragDelay", 150);

        var noop = function(){};

        popup.focus = noop;
        popup.$isFocused = true;

        popup.renderer.$cursorLayer.restartTimer = noop;
        popup.renderer.$cursorLayer.element.style.opacity = "0";

        popup.renderer.$maxLines = 8;
        popup.renderer.$keepTextAreaAtCursor = false;

        popup.setHighlightActiveLine(false);
        // set default highlight color
        // @ts-ignore
        popup.session.highlight("");
        popup.session.$searchHighlight.clazz = "ace_highlight-marker";

        popup.on("mousedown", function(e) {
            var pos = e.getDocumentPosition();
            popup.selection.moveToPosition(pos);
            selectionMarker.start.row = selectionMarker.end.row = pos.row;
            e.stop();
        });

        var lastMouseEvent;
        var hoverMarker = new Range(-1, 0, -1, Infinity);
        var selectionMarker = new Range(-1, 0, -1, Infinity);
        selectionMarker.id = popup.session.addMarker(selectionMarker, "ace_active-line", "fullLine");
        popup.setSelectOnHover = function (val) {
            if (!val) {
                hoverMarker.id = popup.session.addMarker(hoverMarker, "ace_line-hover", "fullLine");
            } else if (hoverMarker.id) {
                popup.session.removeMarker(hoverMarker.id);
                hoverMarker.id = null;
            }
        };
        popup.setSelectOnHover(false);
        popup.on("mousemove", function(e) {
            if (!lastMouseEvent) {
                lastMouseEvent = e;
                return;
            }
            if (lastMouseEvent.x == e.x && lastMouseEvent.y == e.y) {
                return;
            }
            lastMouseEvent = e;
            lastMouseEvent.scrollTop = popup.renderer.scrollTop;
            popup.isMouseOver = true;
            var row = lastMouseEvent.getDocumentPosition().row;
            if (hoverMarker.start.row != row) {
                if (!hoverMarker.id)
                    popup.setRow(row);
                setHoverMarker(row);
            }
        });
        popup.renderer.on("beforeRender", function() {
            if (lastMouseEvent && hoverMarker.start.row != -1) {
                lastMouseEvent.$pos = null;
                var row = lastMouseEvent.getDocumentPosition().row;
                if (!hoverMarker.id)
                    popup.setRow(row);
                setHoverMarker(row, true);
            }
        });
        popup.renderer.on("afterRender", function () {
            var row = popup.getRow();
            var t = popup.renderer.$textLayer;
            var selected = /** @type {HTMLElement|null} */(t.element.childNodes[row - t.config.firstRow]);
            var el = document.activeElement; // Active element is textarea of main editor
            if (selected !== popup.selectedNode && popup.selectedNode) {
                dom.removeCssClass(popup.selectedNode, "ace_selected");
                el.removeAttribute("aria-activedescendant");
                popup.selectedNode.removeAttribute(ariaActiveState);
                popup.selectedNode.removeAttribute("id");
            }
            popup.selectedNode = selected;
            if (selected) {
                dom.addCssClass(selected, "ace_selected");
                var ariaId = getAriaId(row);
                selected.id = ariaId;
                t.element.setAttribute("aria-activedescendant", ariaId);
                el.setAttribute("aria-activedescendant", ariaId);
                selected.setAttribute("role", optionAriaRole);
                selected.setAttribute("aria-roledescription", nls("autocomplete.popup.item.aria-roledescription", "item"));
                selected.setAttribute("aria-label", popup.getData(row).caption || popup.getData(row).value);
                selected.setAttribute("aria-setsize", popup.data.length);
                selected.setAttribute("aria-posinset", row + 1);
                selected.setAttribute("aria-describedby", "doc-tooltip");
                selected.setAttribute(ariaActiveState, "true");
            }
        });
        var hideHoverMarker = function() { setHoverMarker(-1); };
        var setHoverMarker = function(row, suppressRedraw) {
            if (row !== hoverMarker.start.row) {
                hoverMarker.start.row = hoverMarker.end.row = row;
                if (!suppressRedraw)
                    popup.session._emit("changeBackMarker");
                popup._emit("changeHoverMarker");
            }
        };
        popup.getHoveredRow = function() {
            return hoverMarker.start.row;
        };

        event.addListener(popup.container, "mouseout", function() {
            popup.isMouseOver = false;
            hideHoverMarker();
        });
        popup.on("hide", hideHoverMarker);
        popup.on("changeSelection", hideHoverMarker);

        popup.session.doc.getLength = function() {
            return popup.data.length;
        };
        popup.session.doc.getLine = function(i) {
            var data = popup.data[i];
            if (typeof data == "string")
                return data;
            return (data && data.value) || "";
        };

        var bgTokenizer = popup.session.bgTokenizer;
        bgTokenizer.$tokenizeRow = function(row) {
            /**@type {import("../../ace-internal").Ace.Completion &{name?, className?, matchMask?, message?}}*/
            var data = popup.data[row];
            var tokens = [];
            if (!data)
                return tokens;
            if (typeof data == "string")
                data = {value: data};
            var caption = data.caption || data.value || data.name;

            function addToken(value, className) {
                value && tokens.push({
                    type: (data.className || "") + (className || ""),
                    value: value
                });
            }

            var lower = caption.toLowerCase();
            var filterText = (popup.filterText || "").toLowerCase();
            var lastIndex = 0;
            var lastI = 0;
            for (var i = 0; i <= filterText.length; i++) {
                if (i != lastI && (data.matchMask & (1 << i) || i == filterText.length)) {
                    var sub = filterText.slice(lastI, i);
                    lastI = i;
                    var index = lower.indexOf(sub, lastIndex);
                    if (index == -1) continue;
                    addToken(caption.slice(lastIndex, index), "");
                    lastIndex = index + sub.length;
                    addToken(caption.slice(index, lastIndex), "completion-highlight");
                }
            }
            addToken(caption.slice(lastIndex, caption.length), "");

            tokens.push({type: "completion-spacer", value: " "});
            if (data.meta)
                tokens.push({type: "completion-meta", value: data.meta});
            if (data.message)
                tokens.push({type: "completion-message", value: data.message});

            return tokens;
        };
        bgTokenizer.$updateOnChange = noop;
        bgTokenizer.start = noop;

        popup.session.$computeWidth = function() {
            return this.screenWidth = 0;
        };

        // public
        popup.isOpen = false;
        popup.isTopdown = false;
        popup.autoSelect = true;
        popup.filterText = "";
        popup.isMouseOver = false;

        popup.data = [];
        popup.setData = function(list, filterText) {
            popup.filterText = filterText || "";
            popup.setValue(lang.stringRepeat("\n", list.length), -1);
            popup.data = list || [];
            popup.setRow(0);
        };
        popup.getData = function(row) {
            return popup.data[row];
        };

        popup.getRow = function() {
            return selectionMarker.start.row;
        };
        popup.setRow = function(line) {
            line = Math.max(this.autoSelect ? 0 : -1, Math.min(this.data.length - 1, line));
            if (selectionMarker.start.row != line) {
                popup.selection.clearSelection();
                selectionMarker.start.row = selectionMarker.end.row = line || 0;
                popup.session._emit("changeBackMarker");
                popup.moveCursorTo(line || 0, 0);
                if (popup.isOpen)
                    popup._signal("select");
            }
        };

        popup.on("changeSelection", function() {
            if (popup.isOpen)
                popup.setRow(popup.selection.lead.row);
            popup.renderer.scrollCursorIntoView();
        });

        popup.hide = function() {
            this.container.style.display = "none";
            popup.anchorPos = null;
            popup.anchor = null;
            if (popup.isOpen) {
                popup.isOpen = false;
                this._signal("hide");
            }
        };

        /**
         * Tries to show the popup anchored to the given position and anchors.
         * If the anchor is not specified it tries to align to bottom and right as much as possible.
         * If the popup does not have enough space to be rendered with the given anchors, it returns false without rendering the popup.
         * The forceShow flag can be used to render the popup in these cases, which slides the popup so it entirely fits on the screen.
         * @param {{top: number, left: number}} pos
         * @param {number} lineHeight
         * @param {"top" | "bottom" | undefined} anchor
         * @param {boolean} forceShow
         * @returns {boolean}
         */
        popup.tryShow = function(pos, lineHeight, anchor, forceShow) {
            if (!forceShow && popup.isOpen && popup.anchorPos && popup.anchor &&
                popup.anchorPos.top === pos.top && popup.anchorPos.left === pos.left &&
                popup.anchor === anchor
            ) {
                return true;
            }

            var el = this.container;
            var screenHeight = window.innerHeight;
            var screenWidth = window.innerWidth;
            var renderer = this.renderer;
            // var maxLines = Math.min(renderer.$maxLines, this.session.getLength());
            var maxH = renderer.$maxLines * lineHeight * 1.4;
            var dims = { top: 0, bottom: 0, left: 0 };

            var spaceBelow = screenHeight - pos.top - 3 * this.$borderSize - lineHeight;
            var spaceAbove = pos.top - 3 * this.$borderSize;
            if (!anchor) {
                if (spaceAbove <= spaceBelow || spaceBelow >= maxH) {
                    anchor = "bottom";
                } else {
                    anchor = "top";
                }
            }

            if (anchor === "top") {
                dims.bottom = pos.top - this.$borderSize;
                dims.top = dims.bottom - maxH;
            } else if (anchor === "bottom") {
                dims.top = pos.top + lineHeight + this.$borderSize;
                dims.bottom = dims.top + maxH;
            }

            var fitsX = dims.top >= 0 && dims.bottom <= screenHeight;

            if (!forceShow && !fitsX) {
                return false;
            }

            if (!fitsX) {
                if (anchor === "top") {
                    renderer.$maxPixelHeight = spaceAbove;
                } else {
                    renderer.$maxPixelHeight = spaceBelow;
                }
            } else {
                renderer.$maxPixelHeight = null;
            }


            if (anchor === "top") {
                el.style.top = "";
                el.style.bottom = (screenHeight - dims.bottom) + "px";
                popup.isTopdown = false;
            } else {
                el.style.top = dims.top + "px";
                el.style.bottom = "";
                popup.isTopdown = true;
            }

            el.style.display = "";

            var left = pos.left;
            if (left + el.offsetWidth > screenWidth)
                left = screenWidth - el.offsetWidth;

            el.style.left = left + "px";
            el.style.right = "";

            if (!popup.isOpen) {
                popup.isOpen = true;
                this._signal("show");
                lastMouseEvent = null;
            }

            popup.anchorPos = pos;
            popup.anchor = anchor;

            return true;
        };

        popup.show = function(pos, lineHeight, topdownOnly) {
            this.tryShow(pos, lineHeight, topdownOnly ? "bottom" : undefined, true);
        };

        popup.goTo = function(where) {
            var row = this.getRow();
            var max = this.session.getLength() - 1;

            switch(where) {
                case "up": row = row <= 0 ? max : row - 1; break;
                case "down": row = row >= max ? -1 : row + 1; break;
                case "start": row = 0; break;
                case "end": row = max; break;
            }

            this.setRow(row);
        };


        popup.getTextLeftOffset = function() {
            return this.$borderSize + this.renderer.$padding + this.$imageSize;
        };

        popup.$imageSize = 0;
        popup.$borderSize = 1;

        return popup;
    }
}

dom.importCssString(`
.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {
    background-color: #CAD6FA;
    z-index: 1;
}
.ace_dark.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {
    background-color: #3a674e;
}
.ace_editor.ace_autocomplete .ace_line-hover {
    border: 1px solid #abbffe;
    margin-top: -1px;
    background: rgba(233,233,253,0.4);
    position: absolute;
    z-index: 2;
}
.ace_dark.ace_editor.ace_autocomplete .ace_line-hover {
    border: 1px solid rgba(109, 150, 13, 0.8);
    background: rgba(58, 103, 78, 0.62);
}
.ace_completion-meta {
    opacity: 0.5;
    margin-left: 0.9em;
}
.ace_completion-message {
    margin-left: 0.9em;
    color: blue;
}
.ace_editor.ace_autocomplete .ace_completion-highlight{
    color: #2d69c7;
}
.ace_dark.ace_editor.ace_autocomplete .ace_completion-highlight{
    color: #93ca12;
}
.ace_editor.ace_autocomplete {
    width: 300px;
    z-index: 200000;
    border: 1px lightgray solid;
    position: fixed;
    box-shadow: 2px 3px 5px rgba(0,0,0,.2);
    line-height: 1.4;
    background: #fefefe;
    color: #111;
}
.ace_dark.ace_editor.ace_autocomplete {
    border: 1px #484747 solid;
    box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.51);
    line-height: 1.4;
    background: #25282c;
    color: #c1c1c1;
}
.ace_autocomplete .ace_text-layer  {
    width: calc(100% - 8px);
}
.ace_autocomplete .ace_line {
    display: flex;
    align-items: center;
}
.ace_autocomplete .ace_line > * {
    min-width: 0;
    flex: 0 0 auto;
}
.ace_autocomplete .ace_line .ace_ {
    flex: 0 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
}
.ace_autocomplete .ace_completion-spacer {
    flex: 1;
}
.ace_autocomplete.ace_loading:after  {
    content: "";
    position: absolute;
    top: 0px;
    height: 2px;
    width: 8%;
    background: blue;
    z-index: 100;
    animation: ace_progress 3s infinite linear;
    animation-delay: 300ms;
    transform: translateX(-100%) scaleX(1);
}
@keyframes ace_progress {
    0% { transform: translateX(-100%) scaleX(1) }
    50% { transform: translateX(625%) scaleX(2) } 
    100% { transform: translateX(1500%) scaleX(3) } 
}
@media (prefers-reduced-motion) {
    .ace_autocomplete.ace_loading:after {
        transform: translateX(625%) scaleX(2);
        animation: none;
     }
}
`, "autocompletion.css", false);

exports.AcePopup = AcePopup;
exports.$singleLineEditor = $singleLineEditor;
exports.getAriaId = getAriaId;
