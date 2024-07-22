"use strict";
/**
 * @typedef {import("./edit_session").EditSession} EditSession
 * @typedef {import("../ace-internal").Ace.Point} Point
 * @typedef {import("../ace-internal").Ace.Theme} Theme
 */
var oop = require("./lib/oop");
var dom = require("./lib/dom");
var lang = require("./lib/lang");
var config = require("./config");
var GutterLayer = require("./layer/gutter").Gutter;
var MarkerLayer = require("./layer/marker").Marker;
var TextLayer = require("./layer/text").Text;
var CursorLayer = require("./layer/cursor").Cursor;
var HScrollBar = require("./scrollbar").HScrollBar;
var VScrollBar = require("./scrollbar").VScrollBar;
var HScrollBarCustom = require("./scrollbar_custom").HScrollBar;
var VScrollBarCustom = require("./scrollbar_custom").VScrollBar;
var RenderLoop = require("./renderloop").RenderLoop;
var FontMetrics = require("./layer/font_metrics").FontMetrics;
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var editorCss = require("./css/editor-css");
var Decorator = require("./layer/decorators").Decorator;

var useragent = require("./lib/useragent");
const isTextToken = require("./layer/text_util").isTextToken;

dom.importCssString(editorCss, "ace_editor.css", false);

/**
 * The class that is responsible for drawing everything you see on the screen!
 * @related editor.renderer 
 **/
class VirtualRenderer {
    /**
     * Constructs a new `VirtualRenderer` within the `container` specified, applying the given `theme`.
     * @param {HTMLElement | null} [container] The root element of the editor
     * @param {String} [theme] The starting theme
     
     **/
    constructor(container, theme) {
        var _self = this;
        this.container = container || dom.createElement("div");

        dom.addCssClass(this.container, "ace_editor");
        if (dom.HI_DPI) dom.addCssClass(this.container, "ace_hidpi");

        this.setTheme(theme);
        if (config.get("useStrictCSP") == null)
            config.set("useStrictCSP", false);

        this.$gutter = dom.createElement("div");
        this.$gutter.className = "ace_gutter";
        this.container.appendChild(this.$gutter);
        this.$gutter.setAttribute("aria-hidden", "true");
        /**@type {HTMLElement}*/
        this.scroller = dom.createElement("div");
        this.scroller.className = "ace_scroller";

        this.container.appendChild(this.scroller);
        /**@type {HTMLElement}*/
        this.content = dom.createElement("div");
        this.content.className = "ace_content";
        this.scroller.appendChild(this.content);

        this.$gutterLayer = new GutterLayer(this.$gutter);
        this.$gutterLayer.on("changeGutterWidth", this.onGutterResize.bind(this));

        this.$markerBack = new MarkerLayer(this.content);
        var textLayer = this.$textLayer = new TextLayer(this.content);
        this.canvas = textLayer.element;

        this.$markerFront = new MarkerLayer(this.content);

        this.$cursorLayer = new CursorLayer(this.content);

        // Indicates whether the horizontal scrollbar is visible
        this.$horizScroll = false;
        this.$vScroll = false;

        this.scrollBar =
            this.scrollBarV = new VScrollBar(this.container, this);
        this.scrollBarH = new HScrollBar(this.container, this);
        this.scrollBarV.on("scroll", function(e) {
            if (!_self.$scrollAnimation)
                _self.session.setScrollTop(e.data - _self.scrollMargin.top);
        });
        this.scrollBarH.on("scroll", function(e) {
            if (!_self.$scrollAnimation)
                _self.session.setScrollLeft(e.data - _self.scrollMargin.left);
        });

        this.scrollTop = 0;
        this.scrollLeft = 0;

        this.cursorPos = {
            row : 0,
            column : 0
        };

        this.$fontMetrics = new FontMetrics(this.container);
        this.$textLayer.$setFontMetrics(this.$fontMetrics);
        this.$textLayer.on("changeCharacterSize", function(e) {
            _self.updateCharacterSize();
            _self.onResize(true, _self.gutterWidth, _self.$size.width, _self.$size.height);
            _self._signal("changeCharacterSize", e);
        });

        this.$size = {
            width: 0,
            height: 0,
            scrollerHeight: 0,
            scrollerWidth: 0,
            $dirty: true
        };

        this.layerConfig = {
            width : 1,
            padding : 0,
            firstRow : 0,
            firstRowScreen: 0,
            lastRow : 0,
            lineHeight : 0,
            characterWidth : 0,
            minHeight : 1,
            maxHeight : 1,
            offset : 0,
            height : 1,
            gutterOffset: 1
        };

        this.scrollMargin = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            v: 0,
            h: 0
        };

        this.margin = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            v: 0,
            h: 0
        };

        this.$keepTextAreaAtCursor = !useragent.isIOS;

        this.$loop = new RenderLoop(
            this.$renderChanges.bind(this),
            this.container.ownerDocument.defaultView
        );
        this.$loop.schedule(this.CHANGE_FULL);

        this.updateCharacterSize();
        this.setPadding(4);
        this.$addResizeObserver();
        config.resetOptions(this);
        config._signal("renderer", this);
    }


    // this.$logChanges = function(changes) {
    //     var a = ""
    //     if (changes & this.CHANGE_CURSOR) a += " cursor";
    //     if (changes & this.CHANGE_MARKER) a += " marker";
    //     if (changes & this.CHANGE_GUTTER) a += " gutter";
    //     if (changes & this.CHANGE_SCROLL) a += " scroll";
    //     if (changes & this.CHANGE_LINES) a += " lines";
    //     if (changes & this.CHANGE_TEXT) a += " text";
    //     if (changes & this.CHANGE_SIZE) a += " size";
    //     if (changes & this.CHANGE_MARKER_BACK) a += " marker_back";
    //     if (changes & this.CHANGE_MARKER_FRONT) a += " marker_front";
    //     if (changes & this.CHANGE_FULL) a += " full";
    //     if (changes & this.CHANGE_H_SCROLL) a += " h_scroll";
    //     console.log(a.trim())
    // };

    updateCharacterSize() {
        // @ts-expect-error TODO: missing property initialization anywhere in codebase
        if (this.$textLayer.allowBoldFonts != this.$allowBoldFonts) {
            // @ts-expect-error TODO: missing property initialization anywhere in codebase
            this.$allowBoldFonts = this.$textLayer.allowBoldFonts;
            this.setStyle("ace_nobold", !this.$allowBoldFonts);
        }

        this.layerConfig.characterWidth =
        this.characterWidth = this.$textLayer.getCharacterWidth();
        this.layerConfig.lineHeight =
        this.lineHeight = this.$textLayer.getLineHeight();
        this.$updatePrintMargin();
        // set explicit line height to avoid normal resolving to different values based on text
        dom.setStyle(this.scroller.style, "line-height", this.lineHeight + "px");
    }

    /**
     *
     * Associates the renderer with an [[EditSession `EditSession`]].
     * @param {EditSession} session The session to associate with
     **/
    setSession(session) {
        if (this.session)
            this.session.doc.off("changeNewLineMode", this.onChangeNewLineMode);
            
        this.session = session;
        if (session && this.scrollMargin.top && session.getScrollTop() <= 0)
            session.setScrollTop(-this.scrollMargin.top);

        this.$cursorLayer.setSession(session);
        this.$markerBack.setSession(session);
        this.$markerFront.setSession(session);
        this.$gutterLayer.setSession(session);
        this.$textLayer.setSession(session);
        if (!session)
            return;
        
        this.$loop.schedule(this.CHANGE_FULL);
        this.session.$setFontMetrics(this.$fontMetrics);
        this.scrollBarH.scrollLeft = this.scrollBarV.scrollTop = null;
        
        this.onChangeNewLineMode = this.onChangeNewLineMode.bind(this);
        this.onChangeNewLineMode();
        this.session.doc.on("changeNewLineMode", this.onChangeNewLineMode);
    }

    /**
     * Triggers a partial update of the text, from the range given by the two parameters.
     * @param {Number} firstRow The first row to update
     * @param {Number} lastRow The last row to update
     * @param {boolean} [force]
     **/
    updateLines(firstRow, lastRow, force) {
        if (lastRow === undefined)
            lastRow = Infinity;

        if (!this.$changedLines) {
            this.$changedLines = {
                firstRow: firstRow,
                lastRow: lastRow
            };
        }
        else {
            if (this.$changedLines.firstRow > firstRow)
                this.$changedLines.firstRow = firstRow;

            if (this.$changedLines.lastRow < lastRow)
                this.$changedLines.lastRow = lastRow;
        }

        // If the change happened offscreen above us then it's possible
        // that a new line wrap will affect the position of the lines on our
        // screen so they need redrawn.
        // TODO: better solution is to not change scroll position when text is changed outside of visible area
        if (this.$changedLines.lastRow < this.layerConfig.firstRow) {
            if (force)
                this.$changedLines.lastRow = this.layerConfig.lastRow;
            else
                return;
        }
        if (this.$changedLines.firstRow > this.layerConfig.lastRow)
            return;
        this.$loop.schedule(this.CHANGE_LINES);
    }

    onChangeNewLineMode() {
        this.$loop.schedule(this.CHANGE_TEXT);
        this.$textLayer.$updateEolChar();
        this.session.$bidiHandler.setEolChar(this.$textLayer.EOL_CHAR);
    }
    
    onChangeTabSize() {
        this.$loop.schedule(this.CHANGE_TEXT | this.CHANGE_MARKER);
        this.$textLayer.onChangeTabSize();
    }

    /**
     * Triggers a full update of the text, for all the rows.
     **/
    updateText() {
        this.$loop.schedule(this.CHANGE_TEXT);
    }

    /**
     * Triggers a full update of all the layers, for all the rows.
     * @param {Boolean} [force] If `true`, forces the changes through
     
     **/
    updateFull(force) {
        if (force)
            this.$renderChanges(this.CHANGE_FULL, true);
        else
            this.$loop.schedule(this.CHANGE_FULL);
    }

    /**
     * Updates the font size.
     **/
    updateFontSize() {
        this.$textLayer.checkForSizeChanges();
    }

    $updateSizeAsync() {
        if (this.$loop.pending)
            this.$size.$dirty = true;
        else
            this.onResize();
    }
    /**
     * [Triggers a resize of the editor.]{: #VirtualRenderer.onResize}
     * @param {Boolean} [force] If `true`, recomputes the size, even if the height and width haven't changed
     * @param {Number} [gutterWidth] The width of the gutter in pixels
     * @param {Number} [width] The width of the editor in pixels
     * @param {Number} [height] The hiehgt of the editor, in pixels
     
     **/
    onResize(force, gutterWidth, width, height) {
        if (this.resizing > 2)
            return;
        else if (this.resizing > 0)
            this.resizing++;
        else
            this.resizing = force ? 1 : 0;
        // `|| el.scrollHeight` is required for autosizing editors on ie
        // where elements with clientHeight = 0 also have clientWidth = 0
        var el = this.container;
        if (!height)
            height = el.clientHeight || el.scrollHeight;
        if (!height && this.$maxLines && this.lineHeight > 1) {
            // if we are supposed to fit to content set height at least to 1
            // so that render does not exit early before calling $autosize
            if (!el.style.height || el.style.height == "0px") {
                el.style.height = "1px";
                height = el.clientHeight || el.scrollHeight;
            }
        }
        if (!width)
            width = el.clientWidth || el.scrollWidth;
        var changes = this.$updateCachedSize(force, gutterWidth, width, height);

        if (this.$resizeTimer) this.$resizeTimer.cancel();
        
        if (!this.$size.scrollerHeight || (!width && !height))
            return this.resizing = 0;

        if (force)
            this.$gutterLayer.$padding = null;

        if (force)
            this.$renderChanges(changes | this.$changes, true);
        else
            this.$loop.schedule(changes | this.$changes);

        if (this.resizing)
            this.resizing = 0;
        // reset cached values on scrollbars, needs to be removed when switching to non-native scrollbars
        // see https://github.com/ajaxorg/ace/issues/2195
        this.scrollBarH.scrollLeft = this.scrollBarV.scrollTop = null;
        if (this.$customScrollbar) {
            this.$updateCustomScrollbar(true);
        }
    }

    /**
     * @param [force]
     * @param [gutterWidth]
     * @param [width]
     * @param [height]
     * @return {number}
     
     */
    $updateCachedSize(force, gutterWidth, width, height) {
        height -= (this.$extraHeight || 0);
        var changes = 0;
        var size = this.$size;
        var oldSize = {
            width: size.width,
            height: size.height,
            scrollerHeight: size.scrollerHeight,
            scrollerWidth: size.scrollerWidth
        };
        if (height && (force || size.height != height)) {
            size.height = height;
            changes |= this.CHANGE_SIZE;

            size.scrollerHeight = size.height;
            if (this.$horizScroll)
                size.scrollerHeight -= this.scrollBarH.getHeight();
                
            this.scrollBarV.setHeight(size.scrollerHeight);
            this.scrollBarV.element.style.bottom = this.scrollBarH.getHeight() + "px";

            changes = changes | this.CHANGE_SCROLL;
        }

        if (width && (force || size.width != width)) {
            changes |= this.CHANGE_SIZE;
            size.width = width;
            
            if (gutterWidth == null)
                gutterWidth = this.$showGutter ? this.$gutter.offsetWidth : 0;
            
            this.gutterWidth = gutterWidth;
            
            dom.setStyle(this.scrollBarH.element.style, "left", gutterWidth + "px");
            dom.setStyle(this.scroller.style, "left", gutterWidth + this.margin.left + "px");
            size.scrollerWidth = Math.max(0, width - gutterWidth - this.scrollBarV.getWidth() - this.margin.h);
            dom.setStyle(this.$gutter.style, "left", this.margin.left + "px");
            
            var right = this.scrollBarV.getWidth() + "px";
            dom.setStyle(this.scrollBarH.element.style, "right", right);
            dom.setStyle(this.scroller.style, "right", right);
            dom.setStyle(this.scroller.style, "bottom", this.scrollBarH.getHeight());
                
            this.scrollBarH.setWidth(size.scrollerWidth);

            if (this.session && this.session.getUseWrapMode() && this.adjustWrapLimit() || force) {
                changes |= this.CHANGE_FULL;
            }
        }
        
        size.$dirty = !width || !height;

        if (changes)
            this._signal("resize", oldSize);

        return changes;
    }

    /**
     * 
     * @param {number} width
     
     */
    onGutterResize(width) {
        var gutterWidth = this.$showGutter ? width : 0;
        if (gutterWidth != this.gutterWidth)
            this.$changes |= this.$updateCachedSize(true, gutterWidth, this.$size.width, this.$size.height);

        if (this.session.getUseWrapMode() && this.adjustWrapLimit()) {
            this.$loop.schedule(this.CHANGE_FULL);
        } else if (this.$size.$dirty) {
            this.$loop.schedule(this.CHANGE_FULL);
        } else {
            this.$computeLayerConfig();
        }
    }

    /**
     * Adjusts the wrap limit, which is the number of characters that can fit within the width of the edit area on screen.
     
     **/
    adjustWrapLimit() {
        var availableWidth = this.$size.scrollerWidth - this.$padding * 2;
        var limit = Math.floor(availableWidth / this.characterWidth);
        return this.session.adjustWrapLimit(limit, this.$showPrintMargin && this.$printMarginColumn);
    }

    /**
     * Identifies whether you want to have an animated scroll or not.
     * @param {Boolean} shouldAnimate Set to `true` to show animated scrolls
     
     **/
    setAnimatedScroll(shouldAnimate){
        this.setOption("animatedScroll", shouldAnimate);
    }

    /**
     * Returns whether an animated scroll happens or not.
     * @returns {Boolean}
     
     **/
    getAnimatedScroll() {
        return this.$animatedScroll;
    }

    /**
     * Identifies whether you want to show invisible characters or not.
     * @param {Boolean} showInvisibles Set to `true` to show invisibles
     
     **/
    setShowInvisibles(showInvisibles) {
        this.setOption("showInvisibles", showInvisibles);
        this.session.$bidiHandler.setShowInvisibles(showInvisibles);
    }

    /**
     * Returns whether invisible characters are being shown or not.
     * @returns {Boolean}
     
     **/
    getShowInvisibles() {
        return this.getOption("showInvisibles");
    }

    /**
     * @return {boolean}
     
     */
    getDisplayIndentGuides() {
        return this.getOption("displayIndentGuides");
    }

    /**
     * @param {boolean} display
     
     */
    setDisplayIndentGuides(display) {
        this.setOption("displayIndentGuides", display);
    }

    /**
     
     * @return {boolean}
     */
    getHighlightIndentGuides() {
        return this.getOption("highlightIndentGuides");
    }

    /**
     
     * @param {boolean} highlight
     */
    setHighlightIndentGuides(highlight) {
        this.setOption("highlightIndentGuides", highlight);
    }

    /**
     * Identifies whether you want to show the print margin or not.
     * @param {Boolean} showPrintMargin Set to `true` to show the print margin
     
     **/
    setShowPrintMargin(showPrintMargin) {
        this.setOption("showPrintMargin", showPrintMargin);
    }

    /**
     * Returns whether the print margin is being shown or not.
     * @returns {Boolean}
     
     **/
    getShowPrintMargin() {
        return this.getOption("showPrintMargin");
    }
    /**
     * Identifies whether you want to show the print margin column or not.
     * @param {number} printMarginColumn Set to `true` to show the print margin column
     
     **/
    setPrintMarginColumn(printMarginColumn) {
        this.setOption("printMarginColumn", printMarginColumn);
    }

    /**
     * Returns whether the print margin column is being shown or not.
     * @returns {number}
     
     **/
    getPrintMarginColumn() {
        return this.getOption("printMarginColumn");
    }

    /**
     * Returns `true` if the gutter is being shown.
     * @returns {Boolean}
     
     **/
    getShowGutter(){
        return this.getOption("showGutter");
    }

    /**
     * Identifies whether you want to show the gutter or not.
     * @param {Boolean} show Set to `true` to show the gutter
     
     **/
    setShowGutter(show){
        return this.setOption("showGutter", show);
    }

    /**
     
     * @returns {boolean}
     */
    getFadeFoldWidgets(){
        return this.getOption("fadeFoldWidgets");
    }

    /**
     
     * @param {boolean} show
     */
    setFadeFoldWidgets(show) {
        this.setOption("fadeFoldWidgets", show);
    }

    /**
      *
     * @param {boolean} shouldHighlight
     */
    setHighlightGutterLine(shouldHighlight) {
        this.setOption("highlightGutterLine", shouldHighlight);
    }

    /**
     
     * @returns {boolean}
     */
    getHighlightGutterLine() {
        return this.getOption("highlightGutterLine");
    }

    /**
     
     */
    $updatePrintMargin() {
        if (!this.$showPrintMargin && !this.$printMarginEl)
            return;

        if (!this.$printMarginEl) {
            var containerEl = dom.createElement("div");
            containerEl.className = "ace_layer ace_print-margin-layer";
            this.$printMarginEl = dom.createElement("div");
            this.$printMarginEl.className = "ace_print-margin";
            containerEl.appendChild(this.$printMarginEl);
            this.content.insertBefore(containerEl, this.content.firstChild);
        }

        var style = this.$printMarginEl.style;
        style.left = Math.round(this.characterWidth * this.$printMarginColumn + this.$padding) + "px";
        style.visibility = this.$showPrintMargin ? "visible" : "hidden";
        
        if (this.session && this.session.$wrap == -1)
            this.adjustWrapLimit();
    }

    /**
     *
     * Returns the root element containing this renderer.
     * @returns {HTMLElement}
     **/
    getContainerElement() {
        return this.container;
    }

    /**
     *
     * Returns the element that the mouse events are attached to
     * @returns {HTMLElement}
     **/
    getMouseEventTarget() {
        return this.scroller;
    }

    /**
     *
     * Returns the element to which the hidden text area is added.
     * @returns {HTMLElement}
     **/
    getTextAreaContainer() {
        return this.container;
    }

    // move text input over the cursor
    // this is required for IME
    /**
     
     */
    $moveTextAreaToCursor() {
        if (this.$isMousePressed) return;
        var style = this.textarea.style;
        var composition = this.$composition;
        if (!this.$keepTextAreaAtCursor && !composition) {
            dom.translate(this.textarea, -100, 0);
            return;
        }
        var pixelPos = this.$cursorLayer.$pixelPos;
        if (!pixelPos)
            return;
        if (composition && composition.markerRange)
            pixelPos = this.$cursorLayer.getPixelPosition(composition.markerRange.start, true);
        
        var config = this.layerConfig;
        var posTop = pixelPos.top;
        var posLeft = pixelPos.left;
        posTop -= config.offset;

        var h = composition && composition.useTextareaForIME || useragent.isMobile ? this.lineHeight : 1;
        if (posTop < 0 || posTop > config.height - h) {
            dom.translate(this.textarea, 0, 0);
            return;
        }

        var w = 1;
        var maxTop = this.$size.height - h;
        if (!composition) {
            posTop += this.lineHeight;
        }
        else {
            if (composition.useTextareaForIME) {
                var val = this.textarea.value;
                w = this.characterWidth * (this.session.$getStringScreenWidth(val)[0]);
            }
            else {
                posTop += this.lineHeight + 2;
            }
        }
        
        posLeft -= this.scrollLeft;
        if (posLeft > this.$size.scrollerWidth - w)
            posLeft = this.$size.scrollerWidth - w;

        posLeft += this.gutterWidth + this.margin.left;

        dom.setStyle(style, "height", h + "px");
        dom.setStyle(style, "width", w + "px");
        dom.translate(this.textarea, Math.min(posLeft, this.$size.scrollerWidth - w), Math.min(posTop, maxTop));
    }

    /**
     * [Returns the index of the first visible row.]{: #VirtualRenderer.getFirstVisibleRow}
     * @returns {Number}
     **/
    getFirstVisibleRow() {
        return this.layerConfig.firstRow;
    }

    /**
     *
     * Returns the index of the first fully visible row. "Fully" here means that the characters in the row are not truncated; that the top and the bottom of the row are on the screen.
     * @returns {Number}
     **/
    getFirstFullyVisibleRow() {
        return this.layerConfig.firstRow + (this.layerConfig.offset === 0 ? 0 : 1);
    }

    /**
     *
     * Returns the index of the last fully visible row. "Fully" here means that the characters in the row are not truncated; that the top and the bottom of the row are on the screen.
     * @returns {Number}
     **/
    getLastFullyVisibleRow() {
        var config = this.layerConfig;
        var lastRow = config.lastRow;
        var top = this.session.documentToScreenRow(lastRow, 0) * config.lineHeight;
        if (top - this.session.getScrollTop() > config.height - config.lineHeight)
            return lastRow - 1;
        return lastRow;
    }

    /**
     *
     * [Returns the index of the last visible row.]{: #VirtualRenderer.getLastVisibleRow}
     * @returns {Number}
     **/
    getLastVisibleRow() {
        return this.layerConfig.lastRow;
    }

    /**
     * Sets the padding for all the layers.
     * @param {Number} padding A new padding value (in pixels)
     
     **/
    setPadding(padding) {
        this.$padding = padding;
        this.$textLayer.setPadding(padding);
        this.$cursorLayer.setPadding(padding);
        this.$markerFront.setPadding(padding);
        this.$markerBack.setPadding(padding);
        this.$loop.schedule(this.CHANGE_FULL);
        this.$updatePrintMargin();
    }

    /**
     * 
     * @param {number} [top]
     * @param {number} [bottom]
     * @param {number} [left]
     * @param {number} [right]
     
     */
    setScrollMargin(top, bottom, left, right) {
        var sm = this.scrollMargin;
        sm.top = top|0;
        sm.bottom = bottom|0;
        sm.right = right|0;
        sm.left = left|0;
        sm.v = sm.top + sm.bottom;
        sm.h = sm.left + sm.right;
        if (sm.top && this.scrollTop <= 0 && this.session)
            this.session.setScrollTop(-sm.top);
        this.updateFull();
    }

    /**
     *
     * @param {number} [top]
     * @param {number} [bottom]
     * @param {number} [left]
     * @param {number} [right]
     
     */
    setMargin(top, bottom, left, right) {
        var sm = this.margin;
        sm.top = top|0;
        sm.bottom = bottom|0;
        sm.right = right|0;
        sm.left = left|0;
        sm.v = sm.top + sm.bottom;
        sm.h = sm.left + sm.right;
        this.$updateCachedSize(true, this.gutterWidth, this.$size.width, this.$size.height);
        this.updateFull();
    }

    /**
     * Returns whether the horizontal scrollbar is set to be always visible.
     * @returns {Boolean}
     
     **/
    getHScrollBarAlwaysVisible() {
        return this.$hScrollBarAlwaysVisible;
    }

    /**
     * Identifies whether you want to show the horizontal scrollbar or not.
     * @param {Boolean} alwaysVisible Set to `true` to make the horizontal scroll bar visible
     
     **/
    setHScrollBarAlwaysVisible(alwaysVisible) {
        this.setOption("hScrollBarAlwaysVisible", alwaysVisible);
    }
    /**
     * Returns whether the horizontal scrollbar is set to be always visible.
     * @returns {Boolean}
     
     **/
    getVScrollBarAlwaysVisible() {
        return this.$vScrollBarAlwaysVisible;
    }

    /**
     * Identifies whether you want to show the horizontal scrollbar or not.
     * @param {Boolean} alwaysVisible Set to `true` to make the horizontal scroll bar visible
     **/
    setVScrollBarAlwaysVisible(alwaysVisible) {
        this.setOption("vScrollBarAlwaysVisible", alwaysVisible);
    }

    /**
     
     */
    $updateScrollBarV() {
        var scrollHeight = this.layerConfig.maxHeight;
        var scrollerHeight = this.$size.scrollerHeight;
        if (!this.$maxLines && this.$scrollPastEnd) {
            scrollHeight -= (scrollerHeight - this.lineHeight) * this.$scrollPastEnd;
            if (this.scrollTop > scrollHeight - scrollerHeight) {
                scrollHeight = this.scrollTop + scrollerHeight;
                this.scrollBarV.scrollTop = null;
            }
        }
        this.scrollBarV.setScrollHeight(scrollHeight + this.scrollMargin.v);
        this.scrollBarV.setScrollTop(this.scrollTop + this.scrollMargin.top);
    }
    $updateScrollBarH() {
        this.scrollBarH.setScrollWidth(this.layerConfig.width + 2 * this.$padding + this.scrollMargin.h);
        this.scrollBarH.setScrollLeft(this.scrollLeft + this.scrollMargin.left);
    }

    freeze() {
        this.$frozen = true;
    }
    
    unfreeze() {
        this.$frozen = false;
    }

    /**
     * 
     * @param {number} changes
     * @param {boolean} [force]
     * @returns {number}
     
     */
    $renderChanges(changes, force) {
        if (this.$changes) {
            changes |= this.$changes;
            this.$changes = 0;
        }
        if ((!this.session || !this.container.offsetWidth || this.$frozen) || (!changes && !force)) {
            this.$changes |= changes;
            return; 
        } 
        if (this.$size.$dirty) {
            this.$changes |= changes;
            return this.onResize(true);
        }
        if (!this.lineHeight) {
            this.$textLayer.checkForSizeChanges();
        }
        // this.$logChanges(changes);
        
        this._signal("beforeRender", changes);
        
        if (this.session && this.session.$bidiHandler)
            this.session.$bidiHandler.updateCharacterWidths(this.$fontMetrics);

        var config = this.layerConfig;
        // text, scrolling and resize changes can cause the view port size to change
        if (changes & this.CHANGE_FULL ||
            changes & this.CHANGE_SIZE ||
            changes & this.CHANGE_TEXT ||
            changes & this.CHANGE_LINES ||
            changes & this.CHANGE_SCROLL ||
            changes & this.CHANGE_H_SCROLL
        ) {
            changes |= this.$computeLayerConfig() | this.$loop.clear();
            // If a change is made offscreen and wrapMode is on, then the onscreen
            // lines may have been pushed down. If so, the first screen row will not
            // have changed, but the first actual row will. In that case, adjust 
            // scrollTop so that the cursor and onscreen content stays in the same place.
            // TODO: find a better way to handle this, that works non wrapped case and doesn't compute layerConfig twice
            if (config.firstRow != this.layerConfig.firstRow && config.firstRowScreen == this.layerConfig.firstRowScreen) {
                var st = this.scrollTop + (config.firstRow - Math.max(this.layerConfig.firstRow, 0)) * this.lineHeight;
                if (st > 0) {
                    // this check is needed as a workaround for the documentToScreenRow returning -1 if document.length == 0
                    this.scrollTop = st;
                    changes = changes | this.CHANGE_SCROLL;
                    changes |= this.$computeLayerConfig() | this.$loop.clear();
                }
            }
            config = this.layerConfig;
            // update scrollbar first to not lose scroll position when gutter calls resize
            this.$updateScrollBarV();
            if (changes & this.CHANGE_H_SCROLL)
                this.$updateScrollBarH();
            
            dom.translate(this.content, -this.scrollLeft, -config.offset);
            
            var width = config.width + 2 * this.$padding + "px";
            var height = config.minHeight + "px";
            
            dom.setStyle(this.content.style, "width", width);
            dom.setStyle(this.content.style, "height", height);
        }
        
        // horizontal scrolling
        if (changes & this.CHANGE_H_SCROLL) {
            dom.translate(this.content, -this.scrollLeft, -config.offset);
            this.scroller.className = this.scrollLeft <= 0 ? "ace_scroller " : "ace_scroller ace_scroll-left ";
            if (this.enableKeyboardAccessibility)
                this.scroller.className += this.keyboardFocusClassName;
        }

        // full
        if (changes & this.CHANGE_FULL) {
            this.$changedLines = null;
            this.$textLayer.update(config);
            if (this.$showGutter)
                this.$gutterLayer.update(config);
            if (this.$customScrollbar) {
                this.$scrollDecorator.$updateDecorators(config);
            }
            this.$markerBack.update(config);
            this.$markerFront.update(config);
            this.$cursorLayer.update(config);
            this.$moveTextAreaToCursor();
            this._signal("afterRender", changes);
            return;
        }

        // scrolling
        if (changes & this.CHANGE_SCROLL) {
            this.$changedLines = null;
            if (changes & this.CHANGE_TEXT || changes & this.CHANGE_LINES)
                this.$textLayer.update(config);
            else
                this.$textLayer.scrollLines(config);

            if (this.$showGutter) {
                if (changes & this.CHANGE_GUTTER || changes & this.CHANGE_LINES)
                    this.$gutterLayer.update(config);
                else
                    this.$gutterLayer.scrollLines(config);
            }
            if (this.$customScrollbar) {
                this.$scrollDecorator.$updateDecorators(config);
            }
            this.$markerBack.update(config);
            this.$markerFront.update(config);
            this.$cursorLayer.update(config);
            this.$moveTextAreaToCursor();
            this._signal("afterRender", changes);
            return;
        }

        if (changes & this.CHANGE_TEXT) {
            this.$changedLines = null;
            this.$textLayer.update(config);
            if (this.$showGutter)
                this.$gutterLayer.update(config);
            if (this.$customScrollbar) {
                this.$scrollDecorator.$updateDecorators(config);
            }
        }
        else if (changes & this.CHANGE_LINES) {
            if (this.$updateLines() || (changes & this.CHANGE_GUTTER) && this.$showGutter)
                this.$gutterLayer.update(config);
            if (this.$customScrollbar) {
                this.$scrollDecorator.$updateDecorators(config);
            }
        }
        else if (changes & this.CHANGE_TEXT || changes & this.CHANGE_GUTTER) {
            if (this.$showGutter)
                this.$gutterLayer.update(config);
            if (this.$customScrollbar) {
                this.$scrollDecorator.$updateDecorators(config);
            }
        }
        else if (changes & this.CHANGE_CURSOR) {
            if (this.$highlightGutterLine)
                // @ts-expect-error TODO: potential wrong param
                this.$gutterLayer.updateLineHighlight(config);
            if (this.$customScrollbar) {
                this.$scrollDecorator.$updateDecorators(config);
            }
        }

        if (changes & this.CHANGE_CURSOR) {
            this.$cursorLayer.update(config);
            this.$moveTextAreaToCursor();
        }

        if (changes & (this.CHANGE_MARKER | this.CHANGE_MARKER_FRONT)) {
            this.$markerFront.update(config);
        }

        if (changes & (this.CHANGE_MARKER | this.CHANGE_MARKER_BACK)) {
            this.$markerBack.update(config);
        }

        this._signal("afterRender", changes);
    }

    /**
     
     */
    $autosize() {
        var height = this.session.getScreenLength() * this.lineHeight;
        var maxHeight = this.$maxLines * this.lineHeight;
        var desiredHeight = Math.min(maxHeight, 
            Math.max((this.$minLines || 1) * this.lineHeight, height)
        ) + this.scrollMargin.v + (this.$extraHeight || 0);
        if (this.$horizScroll)
            desiredHeight += this.scrollBarH.getHeight();
        if (this.$maxPixelHeight && desiredHeight > this.$maxPixelHeight)
            desiredHeight = this.$maxPixelHeight;
        
        var hideScrollbars = desiredHeight <= 2 * this.lineHeight;
        var vScroll = !hideScrollbars && height > maxHeight;
        
        if (desiredHeight != this.desiredHeight ||
            this.$size.height != this.desiredHeight || vScroll != this.$vScroll) {
            if (vScroll != this.$vScroll) {
                this.$vScroll = vScroll;
                this.scrollBarV.setVisible(vScroll);
            }
            
            var w = this.container.clientWidth;
            this.container.style.height = desiredHeight + "px";
            this.$updateCachedSize(true, this.$gutterWidth, w, desiredHeight);
            // this.$loop.changes = 0;
            this.desiredHeight = desiredHeight;
            
            this._signal("autosize");
        }
    }

    /**
     
     * @returns {number}
     */
    $computeLayerConfig() {
        var session = this.session;
        var size = this.$size;
        
        var hideScrollbars = size.height <= 2 * this.lineHeight;
        var screenLines = this.session.getScreenLength();
        var maxHeight = screenLines * this.lineHeight;

        var longestLine = this.$getLongestLine();
        
        var horizScroll = !hideScrollbars && (this.$hScrollBarAlwaysVisible ||
            size.scrollerWidth - longestLine - 2 * this.$padding < 0);

        var hScrollChanged = this.$horizScroll !== horizScroll;
        if (hScrollChanged) {
            this.$horizScroll = horizScroll;
            this.scrollBarH.setVisible(horizScroll);
        }
        var vScrollBefore = this.$vScroll; // autosize can change vscroll value in which case we need to update longestLine
        // autoresize only after updating hscroll to include scrollbar height in desired height
        if (this.$maxLines && this.lineHeight > 1)
            this.$autosize();

        var minHeight = size.scrollerHeight + this.lineHeight;
        
        var scrollPastEnd = !this.$maxLines && this.$scrollPastEnd
            ? (size.scrollerHeight - this.lineHeight) * this.$scrollPastEnd
            : 0;
        maxHeight += scrollPastEnd;
        
        var sm = this.scrollMargin;
        this.session.setScrollTop(Math.max(-sm.top,
            Math.min(this.scrollTop, maxHeight - size.scrollerHeight + sm.bottom)));

        this.session.setScrollLeft(Math.max(-sm.left, Math.min(this.scrollLeft, 
            longestLine + 2 * this.$padding - size.scrollerWidth + sm.right)));
        
        var vScroll = !hideScrollbars && (this.$vScrollBarAlwaysVisible ||
            size.scrollerHeight - maxHeight + scrollPastEnd < 0 || this.scrollTop > sm.top);
        var vScrollChanged = vScrollBefore !== vScroll;
        if (vScrollChanged) {
            this.$vScroll = vScroll;
            this.scrollBarV.setVisible(vScroll);
        }

        var offset = this.scrollTop % this.lineHeight;
        var lineCount = Math.ceil(minHeight / this.lineHeight) - 1;
        var firstRow = Math.max(0, Math.round((this.scrollTop - offset) / this.lineHeight));
        var lastRow = firstRow + lineCount;

        // Map lines on the screen to lines in the document.
        var firstRowScreen, firstRowHeight;
        var lineHeight = this.lineHeight;
        firstRow = session.screenToDocumentRow(firstRow, 0);

        // Check if firstRow is inside of a foldLine. If true, then use the first
        // row of the foldLine.
        var foldLine = session.getFoldLine(firstRow);
        if (foldLine) {
            firstRow = foldLine.start.row;
        }

        firstRowScreen = session.documentToScreenRow(firstRow, 0);
        firstRowHeight = session.getRowLength(firstRow) * lineHeight;

        lastRow = Math.min(session.screenToDocumentRow(lastRow, 0), session.getLength() - 1);
        minHeight = size.scrollerHeight + session.getRowLength(lastRow) * lineHeight +
                                                firstRowHeight;

        offset = this.scrollTop - firstRowScreen * lineHeight;

        var changes = 0;
        if (this.layerConfig.width != longestLine || hScrollChanged) 
            changes = this.CHANGE_H_SCROLL;
        // Horizontal scrollbar visibility may have changed, which changes
        // the client height of the scroller
        if (hScrollChanged || vScrollChanged) {
            changes |= this.$updateCachedSize(true, this.gutterWidth, size.width, size.height);
            this._signal("scrollbarVisibilityChanged");
            if (vScrollChanged)
                longestLine = this.$getLongestLine();
        }
        
        this.layerConfig = {
            width : longestLine,
            padding : this.$padding,
            firstRow : firstRow,
            firstRowScreen: firstRowScreen,
            lastRow : lastRow,
            lineHeight : lineHeight,
            characterWidth : this.characterWidth,
            minHeight : minHeight,
            maxHeight : maxHeight,
            offset : offset,
            gutterOffset : lineHeight ? Math.max(0, Math.ceil((offset + size.height - size.scrollerHeight) / lineHeight)) : 0,
            height : this.$size.scrollerHeight
        };

        if (this.session.$bidiHandler)
            this.session.$bidiHandler.setContentWidth(longestLine - this.$padding);
        // For debugging.
        // console.log(JSON.stringify(this.layerConfig));

        return changes;
    }

    /**
     * @returns {boolean | undefined}
     
     */
    $updateLines() {
        if (!this.$changedLines) return;
        var firstRow = this.$changedLines.firstRow;
        var lastRow = this.$changedLines.lastRow;
        this.$changedLines = null;

        var layerConfig = this.layerConfig;

        if (firstRow > layerConfig.lastRow + 1) { return; }
        if (lastRow < layerConfig.firstRow) { return; }

        // if the last row is unknown -> redraw everything
        if (lastRow === Infinity) {
            if (this.$showGutter)
                this.$gutterLayer.update(layerConfig);
            this.$textLayer.update(layerConfig);
            return;
        }

        // else update only the changed rows
        this.$textLayer.updateLines(layerConfig, firstRow, lastRow);
        return true;
    }

    /**
     * 
     * @returns {number}
     
     */
    $getLongestLine() {
        var charCount = this.session.getScreenWidth();
        if (this.showInvisibles && !this.session.$useWrapMode)
            charCount += 1;
            
        if (this.$textLayer && charCount > this.$textLayer.MAX_LINE_LENGTH)
            charCount = this.$textLayer.MAX_LINE_LENGTH + 30;

        return Math.max(this.$size.scrollerWidth - 2 * this.$padding, Math.round(charCount * this.characterWidth));
    }

    /**
     * Schedules an update to all the front markers in the document.
     **/
    updateFrontMarkers() {
        this.$markerFront.setMarkers(this.session.getMarkers(true));
        this.$loop.schedule(this.CHANGE_MARKER_FRONT);
    }

    /**
     *
     * Schedules an update to all the back markers in the document.
     **/
    updateBackMarkers() {
        this.$markerBack.setMarkers(this.session.getMarkers());
        this.$loop.schedule(this.CHANGE_MARKER_BACK);
    }

    /**
     *
     * Deprecated; (moved to [[EditSession]])
     * @deprecated
     **/
    addGutterDecoration(row, className){
        this.$gutterLayer.addGutterDecoration(row, className);
    }

    /**
     * Deprecated; (moved to [[EditSession]])
     * @deprecated
     **/
    removeGutterDecoration(row, className){
        this.$gutterLayer.removeGutterDecoration(row, className);
    }

    /**
     * 
     * Redraw breakpoints.
     * @param {any} [rows]
     */
    updateBreakpoints(rows) {
        this._rows = rows;
        this.$loop.schedule(this.CHANGE_GUTTER);
    }

    /**
     * Sets annotations for the gutter.
     * @param {import("../ace-internal").Ace.Annotation[]} annotations An array containing annotations
     *
     **/
    setAnnotations(annotations) {
        this.$gutterLayer.setAnnotations(annotations);
        this.$loop.schedule(this.CHANGE_GUTTER);
    }

    /**
     *
     * Updates the cursor icon.
     **/
    updateCursor() {
        this.$loop.schedule(this.CHANGE_CURSOR);
    }

    /**
     *
     * Hides the cursor icon.
     **/
    hideCursor() {
        this.$cursorLayer.hideCursor();
    }

    /**
     *
     * Shows the cursor icon.
     **/
    showCursor() {
        this.$cursorLayer.showCursor();
    }

    /**
     * 
     * @param {Point} anchor
     * @param {Point} lead
     * @param {number} [offset]
     */
    scrollSelectionIntoView(anchor, lead, offset) {
        // first scroll anchor into view then scroll lead into view
        this.scrollCursorIntoView(anchor, offset);
        this.scrollCursorIntoView(lead, offset);
    }

    /**
     * 
     * Scrolls the cursor into the first visibile area of the editor
     * @param {Point} [cursor]
     * @param {number} [offset]
     * @param {{ top?: any; bottom?: any; }} [$viewMargin]
     */
    scrollCursorIntoView(cursor, offset, $viewMargin) {
        // the editor is not visible
        if (this.$size.scrollerHeight === 0)
            return;

        var pos = this.$cursorLayer.getPixelPosition(cursor);

        var newLeft = pos.left;
        var newTop = pos.top;

        var topMargin = $viewMargin && $viewMargin.top || 0;
        var bottomMargin = $viewMargin && $viewMargin.bottom || 0;

        if (this.$scrollAnimation) {
            this.$stopAnimation = true;
        }

        var currentTop = this.$scrollAnimation ? this.session.getScrollTop() : this.scrollTop;

        if (currentTop + topMargin > newTop) {
            if (offset && currentTop + topMargin > newTop + this.lineHeight)
                newTop -= offset * this.$size.scrollerHeight;
            if (newTop === 0)
                newTop = -this.scrollMargin.top;
            this.session.setScrollTop(newTop);
        } else if (currentTop + this.$size.scrollerHeight - bottomMargin < newTop + this.lineHeight) {
            if (offset && currentTop + this.$size.scrollerHeight - bottomMargin < newTop -  this.lineHeight)
                newTop += offset * this.$size.scrollerHeight;
            this.session.setScrollTop(newTop + this.lineHeight + bottomMargin - this.$size.scrollerHeight);
        }

        var currentLeft = this.scrollLeft;
        // Show 2 context characters of the line when moving to it
        var twoCharsWidth = 2 * this.layerConfig.characterWidth;

        if (newLeft - twoCharsWidth < currentLeft) {
            newLeft -= twoCharsWidth;
            if (newLeft < this.$padding + twoCharsWidth) {
                newLeft = -this.scrollMargin.left;
            }
            this.session.setScrollLeft(newLeft);
        } else {
            newLeft += twoCharsWidth;
            if (currentLeft + this.$size.scrollerWidth < newLeft + this.characterWidth) {
                this.session.setScrollLeft(Math.round(newLeft + this.characterWidth - this.$size.scrollerWidth));
            } else if (currentLeft <= this.$padding && newLeft - currentLeft < this.characterWidth) {
                this.session.setScrollLeft(0);
            }
        }
    }

    /**
     * {:EditSession.getScrollTop}
     * @related EditSession.getScrollTop
     * @returns {Number}
     **/
    getScrollTop() {
        return this.session.getScrollTop();
    }

    /**
     * {:EditSession.getScrollLeft}
     * @related EditSession.getScrollLeft
     * @returns {Number}
     **/
    getScrollLeft() {
        return this.session.getScrollLeft();
    }

    /**
     * Returns the first visible row, regardless of whether it's fully visible or not.
     * @returns {Number}
     **/
    getScrollTopRow() {
        return this.scrollTop / this.lineHeight;
    }

    /**
     * Returns the last visible row, regardless of whether it's fully visible or not.
     * @returns {Number}
     **/
    getScrollBottomRow() {
        return Math.max(0, Math.floor((this.scrollTop + this.$size.scrollerHeight) / this.lineHeight) - 1);
    }

    /**
     * Gracefully scrolls from the top of the editor to the row indicated.
     * @param {Number} row A row id
     *
     * @related EditSession.setScrollTop
     **/
    scrollToRow(row) {
        this.session.setScrollTop(row * this.lineHeight);
    }

    /**
     * 
     * @param {Point} cursor
     * @param {number} [alignment]
     * @returns {number}
     */
    alignCursor(cursor, alignment) {
        if (typeof cursor == "number")
            cursor = {row: cursor, column: 0};

        var pos = this.$cursorLayer.getPixelPosition(cursor);
        var h = this.$size.scrollerHeight - this.lineHeight;
        var offset = pos.top - h * (alignment || 0);

        this.session.setScrollTop(offset);
        return offset;
    }

    /**
     * 
     * @param {number} fromValue
     * @param {number} toValue
     * @returns {*[]}
     */
    $calcSteps(fromValue, toValue){
        var i = 0;
        var l = this.STEPS;
        var steps = [];

        var func  = function(t, x_min, dx) {
            return dx * (Math.pow(t - 1, 3) + 1) + x_min;
        };

        for (i = 0; i < l; ++i)
            steps.push(func(i / this.STEPS, fromValue, toValue - fromValue));

        return steps;
    }

    /**
     * Gracefully scrolls the editor to the row indicated.
     * @param {Number} line A line number
     * @param {Boolean} center If `true`, centers the editor the to indicated line
     * @param {Boolean} animate If `true` animates scrolling
     * @param {() => void} [callback] Function to be called after the animation has finished
     
     **/
    scrollToLine(line, center, animate, callback) {
        var pos = this.$cursorLayer.getPixelPosition({row: line, column: 0});
        var offset = pos.top;
        if (center)
            offset -= this.$size.scrollerHeight / 2;

        var initialScroll = this.scrollTop;
        this.session.setScrollTop(offset);
        if (animate !== false)
            this.animateScrolling(initialScroll, callback);
    }

    /**
     * 
     * @param fromValue
     * @param [callback]
     
     */
    animateScrolling(fromValue, callback) {
        var toValue = this.scrollTop;
        if (!this.$animatedScroll)
            return;
        var _self = this;
        
        if (fromValue == toValue)
            return;
        
        if (this.$scrollAnimation) {
            var oldSteps = this.$scrollAnimation.steps;
            if (oldSteps.length) {
                fromValue = oldSteps[0];
                if (fromValue == toValue)
                    return;
            }
        }
        
        var steps = _self.$calcSteps(fromValue, toValue);
        this.$scrollAnimation = {from: fromValue, to: toValue, steps: steps};

        clearInterval(this.$timer);

        _self.session.setScrollTop(steps.shift());
        // trick session to think it's already scrolled to not loose toValue
        _self.session.$scrollTop = toValue;
        
        function endAnimation() {
            // @ts-ignore
            _self.$timer = clearInterval(_self.$timer);
            _self.$scrollAnimation = null;
            _self.$stopAnimation = false;
            callback && callback();
        }
        
        this.$timer = setInterval(function() {
            if (_self.$stopAnimation) {
                endAnimation();
                return;
            }

            if (!_self.session) 
                return clearInterval(_self.$timer);
            if (steps.length) {
                _self.session.setScrollTop(steps.shift());
                _self.session.$scrollTop = toValue;
            } else if (toValue != null) {
                _self.session.$scrollTop = -1;
                _self.session.setScrollTop(toValue);
                toValue = null;
            } else {
                // do this on separate step to not get spurious scroll event from scrollbar
                endAnimation();
            }
        }, 10);
    }

    /**
     * Scrolls the editor to the y pixel indicated.
     * @param {Number} scrollTop The position to scroll to
     **/
    scrollToY(scrollTop) {
        // after calling scrollBar.setScrollTop
        // scrollbar sends us event with same scrollTop. ignore it
        if (this.scrollTop !== scrollTop) {
            this.$loop.schedule(this.CHANGE_SCROLL);
            this.scrollTop = scrollTop;
        }
    }

    /**
     * Scrolls the editor across the x-axis to the pixel indicated.
     * @param {Number} scrollLeft The position to scroll to
     **/
    scrollToX(scrollLeft) {
        if (this.scrollLeft !== scrollLeft)
            this.scrollLeft = scrollLeft;
        this.$loop.schedule(this.CHANGE_H_SCROLL);
    }

    /**
     * Scrolls the editor across both x- and y-axes.
     * @param {Number} x The x value to scroll to
     * @param {Number} y The y value to scroll to
     **/
    scrollTo(x, y) {
        this.session.setScrollTop(y);
        this.session.setScrollLeft(x);
    }
    
    /**
     * Scrolls the editor across both x- and y-axes.
     * @param {Number} deltaX The x value to scroll by
     * @param {Number} deltaY The y value to scroll by
     **/
    scrollBy(deltaX, deltaY) {
        deltaY && this.session.setScrollTop(this.session.getScrollTop() + deltaY);
        deltaX && this.session.setScrollLeft(this.session.getScrollLeft() + deltaX);
    }

    /**
     * Returns `true` if you can still scroll by either parameter; in other words, you haven't reached the end of the file or line.
     * @param {Number} deltaX The x value to scroll by
     * @param {Number} deltaY The y value to scroll by
     *
     * @returns {Boolean}
     **/
    isScrollableBy(deltaX, deltaY) {
        if (deltaY < 0 && this.session.getScrollTop() >= 1 - this.scrollMargin.top)
           return true;
        if (deltaY > 0 && this.session.getScrollTop() + this.$size.scrollerHeight
            - this.layerConfig.maxHeight < -1 + this.scrollMargin.bottom)
           return true;
        if (deltaX < 0 && this.session.getScrollLeft() >= 1 - this.scrollMargin.left)
            return true;
        if (deltaX > 0 && this.session.getScrollLeft() + this.$size.scrollerWidth
            - this.layerConfig.width < -1 + this.scrollMargin.right)
           return true;
    }

    /**
     * 
     * @param {number} x
     * @param {number} y
     * @returns {import("../ace-internal").Ace.ScreenCoordinates}
     
     */
    pixelToScreenCoordinates(x, y) {
        var canvasPos;
        if (this.$hasCssTransforms) {
            canvasPos = {top:0, left: 0};
            var p = this.$fontMetrics.transformCoordinates([x, y]);
            x = p[1] - this.gutterWidth - this.margin.left;
            y = p[0];
        } else {
            canvasPos = this.scroller.getBoundingClientRect();
        }
        
        var offsetX = x + this.scrollLeft - canvasPos.left - this.$padding;
        var offset = offsetX / this.characterWidth;
        var row = Math.floor((y + this.scrollTop - canvasPos.top) / this.lineHeight);
        var col = this.$blockCursor ? Math.floor(offset) : Math.round(offset);

        return {row: row, column: col, side: offset - col > 0 ? 1 : -1, offsetX:  offsetX};
    }

    /**
     * 
     * @param {number} x
     * @param {number} y
     * @returns {Point}
     
     */
    screenToTextCoordinates(x, y) {
        var canvasPos;
        if (this.$hasCssTransforms) {
            canvasPos = {top:0, left: 0};
            var p = this.$fontMetrics.transformCoordinates([x, y]);
            x = p[1] - this.gutterWidth - this.margin.left;
            y = p[0];
        } else {
            canvasPos = this.scroller.getBoundingClientRect();
        }

        var offsetX = x + this.scrollLeft - canvasPos.left - this.$padding;
        var offset = offsetX / this.characterWidth;
        var col = this.$blockCursor ? Math.floor(offset) : Math.round(offset);

        var row = Math.floor((y + this.scrollTop - canvasPos.top) / this.lineHeight);

        return this.session.screenToDocumentPosition(row, Math.max(col, 0), offsetX);
    }

    /**
     * Returns an object containing the `pageX` and `pageY` coordinates of the document position.
     * @param {Number} row The document row position
     * @param {Number} column The document column position
     *
     * @returns {{ pageX: number, pageY: number}}
     **/
    textToScreenCoordinates(row, column) {
        var canvasPos = this.scroller.getBoundingClientRect();
        var pos = this.session.documentToScreenPosition(row, column);

        var x = this.$padding + (this.session.$bidiHandler.isBidiRow(pos.row, row)
             ? this.session.$bidiHandler.getPosLeft(pos.column)
             : Math.round(pos.column * this.characterWidth));
        
        var y = pos.row * this.lineHeight;

        return {
            pageX: canvasPos.left + x - this.scrollLeft,
            pageY: canvasPos.top + y - this.scrollTop
        };
    }

    /**
     *
     * Focuses the current container.
     **/
    visualizeFocus() {
        dom.addCssClass(this.container, "ace_focus");
    }

    /**
     *
     * Blurs the current container.
     **/
    visualizeBlur() {
        dom.removeCssClass(this.container, "ace_focus");
    }

    /**
     * @param {Object} composition
     
     **/
    showComposition(composition) {
        this.$composition = composition;
        if (!composition.cssText) {
            composition.cssText = this.textarea.style.cssText;
        }
        if (composition.useTextareaForIME == undefined)
            composition.useTextareaForIME = this.$useTextareaForIME;
        
        if (this.$useTextareaForIME) {
            dom.addCssClass(this.textarea, "ace_composition");
            this.textarea.style.cssText = "";
            this.$moveTextAreaToCursor();
            this.$cursorLayer.element.style.display = "none";
        }
        else {
            composition.markerId = this.session.addMarker(composition.markerRange, "ace_composition_marker", "text");
        }
    }

    /**
     * @param {String} text A string of text to use
     *
     * Sets the inner text of the current composition to `text`.
     
     **/
    setCompositionText(text) {
        var cursor = this.session.selection.cursor;
        this.addToken(text, "composition_placeholder", cursor.row, cursor.column);
        this.$moveTextAreaToCursor();
    }

    /**
     *
     * Hides the current composition.
     
     **/
    hideComposition() {
        if (!this.$composition)
            return;
        
        if (this.$composition.markerId)
            this.session.removeMarker(this.$composition.markerId);

        dom.removeCssClass(this.textarea, "ace_composition");
        this.textarea.style.cssText = this.$composition.cssText;
        var cursor = this.session.selection.cursor;
        this.removeExtraToken(cursor.row, cursor.column);
        this.$composition = null;
        this.$cursorLayer.element.style.display = "";
    }

    /**
     * @param {string} text
     * @param {Point} [position]
     */
    setGhostText(text, position) {
        var cursor = this.session.selection.cursor;
        var insertPosition = position || { row: cursor.row, column: cursor.column };

        this.removeGhostText();
        
        var textChunks = this.$calculateWrappedTextChunks(text, insertPosition);
        this.addToken(textChunks[0].text, "ghost_text", insertPosition.row, insertPosition.column);
        
        this.$ghostText = {
            text: text,
            position: {
                row: insertPosition.row,
                column: insertPosition. column
            }
        };
        
        var widgetDiv = dom.createElement("div");
        if (textChunks.length > 1) {
            // If there are tokens to the right of the cursor, hide those.
            var hiddenTokens = this.hideTokensAfterPosition(insertPosition.row, insertPosition.column);

            var lastLineDiv;
            textChunks.slice(1).forEach(el => {
                var chunkDiv = dom.createElement("div");
                var chunkSpan = dom.createElement("span");
                chunkSpan.className = "ace_ghost_text";            

                // If the line is wider than the viewport, wrap the line
                if (el.wrapped) chunkDiv.className = "ghost_text_line_wrapped";

                // If a given line doesn't have text (e.g. it's a line of whitespace), set a space as the 
                // textcontent so that browsers render the empty line div.
                if (el.text.length === 0) el.text = " "; 
                
                chunkSpan.appendChild(dom.createTextNode(el.text));
                chunkDiv.appendChild(chunkSpan);
                widgetDiv.appendChild(chunkDiv);

                // Overwrite lastLineDiv every iteration so at the end it points to 
                // the last added element.
                lastLineDiv = chunkDiv;
            });

            // Add the hidden tokens to the last line of the ghost text.
            hiddenTokens.forEach(token => {
                var element = dom.createElement("span");
                if (!isTextToken(token.type)) element.className = "ace_" + token.type.replace(/\./g, " ace_");
                element.appendChild(dom.createTextNode(token.value));
                lastLineDiv.appendChild(element);
            });
            
            this.$ghostTextWidget = {
                el: widgetDiv,
                row: insertPosition.row,
                column: insertPosition.column,
                className: "ace_ghost_text_container"
            };
            this.session.widgetManager.addLineWidget(this.$ghostTextWidget);

            // Check wether the line widget fits in the part of the screen currently in view
            var pixelPosition = this.$cursorLayer.getPixelPosition(insertPosition, true);
            var el = this.container;
            var height = el.getBoundingClientRect().height;
            var ghostTextHeight = textChunks.length * this.lineHeight;
            var fitsY = ghostTextHeight < (height - pixelPosition.top);

            // If it fits, no action needed
            if (fitsY) return;
            
            // If it can fully fit in the screen, scroll down until it fits on the screen
            // if it cannot fully fit, scroll so that the row with the cursor
            // is at the top of the screen.
            if (ghostTextHeight < height) {
                this.scrollBy(0, (textChunks.length - 1) * this.lineHeight);
            } else {
                this.scrollToRow(insertPosition.row);
            }   
        }
        
    }

    /**
     * Calculates and organizes text into wrapped chunks. Initially splits the text by newline characters, 
     * then further processes each line based on display tokens and session settings for tab size and wrapping limits.
     *
     * @param {string} text
     * @param {Point} position
     * @return {{text: string, wrapped: boolean}[]}
     */
    $calculateWrappedTextChunks(text, position) {
        var availableWidth = this.$size.scrollerWidth - this.$padding * 2;
        var limit = Math.floor(availableWidth / this.characterWidth) - 2;
        limit = limit <= 0 ? 60 : limit; // this is a hack to prevent the editor from crashing when the window is too small

        var textLines = text.split(/\r?\n/);
        var textChunks = [];
        for (var i = 0; i < textLines.length; i++) {
            var displayTokens = this.session.$getDisplayTokens(textLines[i], position.column);
            var wrapSplits = this.session.$computeWrapSplits(displayTokens, limit, this.session.$tabSize);

            if (wrapSplits.length > 0) {
                var start = 0;
                wrapSplits.push(textLines[i].length);

                for (var j = 0; j < wrapSplits.length; j++) {
                    let textSlice = textLines[i].slice(start, wrapSplits[j]);
                    textChunks.push({text: textSlice, wrapped: true});
                    start = wrapSplits[j];
                }
            }
            else {
                textChunks.push({text: textLines[i], wrapped: false});
            }
        }
        return textChunks;
    }

    removeGhostText() {
        if (!this.$ghostText) return;

        var position = this.$ghostText.position;
        this.removeExtraToken(position.row, position.column);
        if (this.$ghostTextWidget) {
            this.session.widgetManager.removeLineWidget(this.$ghostTextWidget);
            this.$ghostTextWidget = null;
        }
        this.$ghostText = null;
    }

    /**
     * @param {string} text
     * @param {string} type
     * @param {number} row
     * @param {number} [column]
     */
    addToken(text, type, row, column) {
        var session = this.session;
        session.bgTokenizer.lines[row] = null;
        var newToken = {type: type, value: text};
        var tokens = session.getTokens(row);
        if (column == null || !tokens.length) {
            tokens.push(newToken);
        } else {
            var l = 0;
            for (var i =0; i < tokens.length; i++) {
                var token = tokens[i];
                l += token.value.length;
                if (column <= l) {
                    var diff = token.value.length - (l - column);
                    var before = token.value.slice(0, diff);
                    var after = token.value.slice(diff);
    
                    tokens.splice(i, 1, {type: token.type, value: before},  newToken,  {type: token.type, value: after});
                    break;
                }
            }
        }
        this.updateLines(row, row);
    }

    // Hide all non-ghost-text tokens to the right of a given position.
    hideTokensAfterPosition(row, column) {
        var tokens = this.session.getTokens(row);
        var l = 0;
        var hasPassedCursor = false;
        var hiddenTokens = [];
        // Loop over all tokens and track at what position in the line they end.
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            l += token.value.length;

            if (token.type === "ghost_text") continue;

            // If we've already passed the current cursor position, mark all of them as hidden.
            if (hasPassedCursor) {
                hiddenTokens.push({type: token.type, value: token.value});
                token.type = "hidden_token";
                continue;
            }
            // We call this method after we call addToken, so we are guaranteed a new token starts at the cursor position.
            // Once we reached that point in the loop, flip the flag. 
            if (l === column) {
                hasPassedCursor = true;
            } 
        }
        this.updateLines(row, row);
        return hiddenTokens;
    }

    removeExtraToken(row, column) {
        this.session.bgTokenizer.lines[row] = null;
        this.updateLines(row, row);
    }

    /**
     * [Sets a new theme for the editor. `theme` should exist, and be a directory path, like `ace/theme/textmate`.]{: #VirtualRenderer.setTheme}
     * @param {String | Theme} [theme] The path to a theme
     * @param {() => void} [cb] optional callback
     
     **/
    setTheme(theme, cb) {
        var _self = this;
        /**@type {any}*/
        this.$themeId = theme;
        _self._dispatchEvent('themeChange',{theme:theme});

        if (!theme || typeof theme == "string") {
            // @ts-ignore
            var moduleName = theme || this.$options.theme.initialValue;
            config.loadModule(["theme", moduleName], afterLoad);
        } else {
            afterLoad(theme);
        }

        /**
         * @param {Theme} module
         */
        function afterLoad(module) {
            if (_self.$themeId != theme)
                return cb && cb();
            if (!module || !module.cssClass)
                throw new Error("couldn't load module " + theme + " or it didn't call define");
            if (module.$id)
                _self.$themeId = module.$id;
            dom.importCssString(
                module.cssText,
                module.cssClass,
                _self.container
            );
            if (_self.theme)
                dom.removeCssClass(_self.container, _self.theme.cssClass);
            /**@type {any}*/
            var padding = "padding" in module ? module.padding 
                : "padding" in (_self.theme || {}) ? 4 : _self.$padding;
            if (_self.$padding && padding != _self.$padding)
                _self.setPadding(padding);
                
            // this is kept only for backwards compatibility
            _self.$theme = module.cssClass;

            _self.theme = module;
            dom.addCssClass(_self.container, module.cssClass);
            dom.setCssClass(_self.container, "ace_dark", module.isDark);

            // force re-measure of the gutter width
            if (_self.$size) {
                _self.$size.width = 0;
                _self.$updateSizeAsync();
            }

            _self._dispatchEvent('themeLoaded', {theme:module});
            cb && cb();

            // workaround for safari not redrawing the editor
            // https://github.com/ajaxorg/ace/issues/5569
            if (useragent.isSafari && _self.scroller) {
                _self.scroller.style.background = "red";
                _self.scroller.style.background = "";
            }
        }
    }

    /**
     * [Returns the path of the current theme.]{: #VirtualRenderer.getTheme}
     * @returns {String}
     **/
    getTheme() {
        return this.$themeId;
    }

    // Methods allows to add / remove CSS classnames to the editor element.
    // This feature can be used by plug-ins to provide a visual indication of
    // a certain mode that editor is in.

    /**
     * [Adds a new class, `style`, to the editor.]{: #VirtualRenderer.setStyle}
     * @param {String} style A class name
     * @param {boolean}[include]
     **/
    setStyle(style, include) {
        dom.setCssClass(this.container, style, include !== false);
    }

    /**
     * [Removes the class `style` from the editor.]{: #VirtualRenderer.unsetStyle}
     * @param {String} style A class name
     *
     **/
    unsetStyle(style) {
        dom.removeCssClass(this.container, style);
    }

    /**
     * @param {string} style
     */
    setCursorStyle(style) {
        dom.setStyle(this.scroller.style, "cursor", style);
    }

    /**
     * @param {String} cursorStyle A css cursor style
     **/
    setMouseCursor(cursorStyle) {
        dom.setStyle(this.scroller.style, "cursor", cursorStyle);
    }
    
    attachToShadowRoot() {
        dom.importCssString(editorCss, "ace_editor.css", this.container);
    }

    /**
     * Destroys the text and cursor layers for this renderer.
     
     **/
    destroy() {
        this.freeze();
        this.$fontMetrics.destroy();
        this.$cursorLayer.destroy();
        this.removeAllListeners();
        this.container.textContent = "";
        this.setOption("useResizeObserver", false);
    }

    /**
     * 
     * @param {boolean} [val]
     */
    $updateCustomScrollbar(val) {
        var _self = this;
        this.$horizScroll = this.$vScroll = null;
        this.scrollBarV.element.remove();
        this.scrollBarH.element.remove();
        if (this.$scrollDecorator) {
            delete this.$scrollDecorator;
        }
        if (val === true) {
            /**@type {import("../ace-internal").Ace.VScrollbar}*/
            this.scrollBarV = new VScrollBarCustom(this.container, this);
            /**@type {import("../ace-internal").Ace.HScrollbar}*/
            this.scrollBarH = new HScrollBarCustom(this.container, this);
            this.scrollBarV.setHeight(this.$size.scrollerHeight);
            this.scrollBarH.setWidth(this.$size.scrollerWidth);

            this.scrollBarV.addEventListener("scroll", function (e) {
                if (!_self.$scrollAnimation) _self.session.setScrollTop(e.data - _self.scrollMargin.top);
            });
            this.scrollBarH.addEventListener("scroll", function (e) {
                if (!_self.$scrollAnimation) _self.session.setScrollLeft(e.data - _self.scrollMargin.left);
            });
            this.$scrollDecorator = new Decorator(this.scrollBarV, this);
            this.$scrollDecorator.$updateDecorators();
        }
        else {
            this.scrollBarV = new VScrollBar(this.container, this);
            this.scrollBarH = new HScrollBar(this.container, this);
            this.scrollBarV.addEventListener("scroll", function (e) {
                if (!_self.$scrollAnimation) _self.session.setScrollTop(e.data - _self.scrollMargin.top);
            });
            this.scrollBarH.addEventListener("scroll", function (e) {
                if (!_self.$scrollAnimation) _self.session.setScrollLeft(e.data - _self.scrollMargin.left);
            });
        }
    }

    /**
     
     */
    $addResizeObserver() {
        if (!window.ResizeObserver || this.$resizeObserver) return;
        var self = this;
        this.$resizeTimer = lang.delayedCall(function() {
            if (!self.destroyed)  self.onResize();
        }, 50);
        this.$resizeObserver = new window.ResizeObserver(function(e) {
            var w = e[0].contentRect.width;
            var h = e[0].contentRect.height;
            if (
                Math.abs(self.$size.width - w) > 1
                || Math.abs(self.$size.height - h) > 1
            ) {
                self.$resizeTimer.delay();
            } else {
                self.$resizeTimer.cancel();
            }
        });
        this.$resizeObserver.observe(this.container);
    }

}

VirtualRenderer.prototype.CHANGE_CURSOR = 1;
VirtualRenderer.prototype.CHANGE_MARKER = 2;
VirtualRenderer.prototype.CHANGE_GUTTER = 4;
VirtualRenderer.prototype.CHANGE_SCROLL = 8;
VirtualRenderer.prototype.CHANGE_LINES = 16;
VirtualRenderer.prototype.CHANGE_TEXT = 32;
VirtualRenderer.prototype.CHANGE_SIZE = 64;
VirtualRenderer.prototype.CHANGE_MARKER_BACK = 128;
VirtualRenderer.prototype.CHANGE_MARKER_FRONT = 256;
VirtualRenderer.prototype.CHANGE_FULL = 512;
VirtualRenderer.prototype.CHANGE_H_SCROLL = 1024;
VirtualRenderer.prototype.$changes = 0;
VirtualRenderer.prototype.$padding = null;
VirtualRenderer.prototype.$frozen = false;
VirtualRenderer.prototype.STEPS = 8;

oop.implement(VirtualRenderer.prototype, EventEmitter);

config.defineOptions(VirtualRenderer.prototype, "renderer", {
    useResizeObserver: {
        /**
         * @param value
         * @this{VirtualRenderer}
         */
        set: function(value) {
            if (!value && this.$resizeObserver) {
                this.$resizeObserver.disconnect();
                this.$resizeTimer.cancel();
                this.$resizeTimer = this.$resizeObserver = null;
            } else if (value && !this.$resizeObserver) {
                this.$addResizeObserver();
            }
        }
    },
    animatedScroll: {initialValue: false},
    showInvisibles: {
        set: function(value) {
            if (this.$textLayer.setShowInvisibles(value))
                this.$loop.schedule(this.CHANGE_TEXT);
        },
        initialValue: false
    },
    showPrintMargin: {
        set: function() { this.$updatePrintMargin(); },
        initialValue: true
    },
    printMarginColumn: {
        set: function() { this.$updatePrintMargin(); },
        initialValue: 80
    },
    printMargin: {
        /**
         * @param val
         * @this{VirtualRenderer}
         */
        set: function(val) {
            if (typeof val == "number")
                this.$printMarginColumn = val;
            this.$showPrintMargin = !!val;
            this.$updatePrintMargin();
        },
        get: function() {
            return this.$showPrintMargin && this.$printMarginColumn; 
        }
    },
    showGutter: {
        set: function(show){
            this.$gutter.style.display = show ? "block" : "none";
            this.$loop.schedule(this.CHANGE_FULL);
            this.onGutterResize();
        },
        initialValue: true
    },
    useSvgGutterIcons: {
        set: function(value){
            this.$gutterLayer.$useSvgGutterIcons = value;
        },
        initialValue: false
    },
    showFoldedAnnotations: {
        set: function(value){
            this.$gutterLayer.$showFoldedAnnotations = value;
        },
        initialValue: false
    },
    fadeFoldWidgets: {
        set: function(show) {
            dom.setCssClass(this.$gutter, "ace_fade-fold-widgets", show);
        },
        initialValue: false
    },
    showFoldWidgets: {
        set: function(show) {
            this.$gutterLayer.setShowFoldWidgets(show);
            this.$loop.schedule(this.CHANGE_GUTTER);
        },
        initialValue: true
    },
    displayIndentGuides: {
        set: function(show) {
            if (this.$textLayer.setDisplayIndentGuides(show))
                this.$loop.schedule(this.CHANGE_TEXT);
        },
        initialValue: true
    },
    highlightIndentGuides: {
        set: function (show) {
            if (this.$textLayer.setHighlightIndentGuides(show) == true) {
                this.$textLayer.$highlightIndentGuide();
            }
            else {
                this.$textLayer.$clearActiveIndentGuide(this.$textLayer.$lines.cells);
            }
        },
        initialValue: true
    },
    highlightGutterLine: {
        set: function(shouldHighlight) {
            this.$gutterLayer.setHighlightGutterLine(shouldHighlight);
            this.$loop.schedule(this.CHANGE_GUTTER);
        },
        initialValue: true
    },
    hScrollBarAlwaysVisible: {
        set: function(val) {
            if (!this.$hScrollBarAlwaysVisible || !this.$horizScroll)
                this.$loop.schedule(this.CHANGE_SCROLL);
        },
        initialValue: false
    },
    vScrollBarAlwaysVisible: {
        set: function(val) {
            if (!this.$vScrollBarAlwaysVisible || !this.$vScroll)
                this.$loop.schedule(this.CHANGE_SCROLL);
        },
        initialValue: false
    },
    fontSize: {
        set: function(size) {
            if (typeof size == "number")
                size = size + "px";
            this.container.style.fontSize = size;
            this.updateFontSize();
        },
        initialValue: 12
    },
    fontFamily: {
        set: function(name) {
            this.container.style.fontFamily = name;
            this.updateFontSize();
        }
    },
    maxLines: {
        set: function(val) {
            this.updateFull();
        }
    },
    minLines: {
        /**
         * @param val
         * @this{VirtualRenderer}
         */
        set: function(val) {
            if (!(this.$minLines < 0x1ffffffffffff))
                this.$minLines = 0;
            this.updateFull();
        }
    },
    maxPixelHeight: {
        set: function(val) {
            this.updateFull();
        },
        initialValue: 0
    },
    scrollPastEnd: {
        /**
         * @param val
         * @this{VirtualRenderer}
         */
        set: function(val) {
            val = +val || 0;
            if (this.$scrollPastEnd == val)
                return;
            this.$scrollPastEnd = val;
            this.$loop.schedule(this.CHANGE_SCROLL);
        },
        initialValue: 0,
        handlesSet: true
    },
    fixedWidthGutter: {
        set: function(val) {
            this.$gutterLayer.$fixedWidth = !!val;
            this.$loop.schedule(this.CHANGE_GUTTER);
        }
    },
    customScrollbar: {
        set: function(val) {
            this.$updateCustomScrollbar(val);
        },
        initialValue: false
    },
    theme: {
        set: function(val) { this.setTheme(val); },
        get: function() { return this.$themeId || this.theme; },
        initialValue: "./theme/textmate",
        handlesSet: true
    },
    hasCssTransforms: {
    },
    useTextareaForIME: {
        initialValue: !useragent.isMobile && !useragent.isIE
    }
});

exports.VirtualRenderer = VirtualRenderer;
