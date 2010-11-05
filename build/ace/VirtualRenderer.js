/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def("ace/VirtualRenderer", ["ace/lib/oop", "ace/lib/lang", "ace/lib/dom", "ace/lib/event", "ace/layer/Gutter", "ace/layer/Marker", "ace/layer/Text", "ace/layer/Cursor", "ace/ScrollBar", "ace/RenderLoop", "ace/MEventEmitter", 'text!ace/css/editor.css!.ace_editor {\n  position: absolute;\n  overflow: hidden;\n\n  font-family: "Menlo", "Monaco", "Courier New", monospace;\n  font-size: 12px;  \n}\n\n.ace_scroller {\n  position: absolute;\n  overflow-x: scroll;\n  overflow-y: hidden;     \n}\n\n.ace_gutter {\n  position: absolute;\n  overflow-x: hidden;\n  overflow-y: hidden;\n  height: 100%;\n}\n\n.ace_editor .ace_sb {\n  position: absolute;\n  overflow-x: hidden;\n  overflow-y: scroll;\n  right: 0;\n}\n\n.ace_editor .ace_sb div {\n  position: absolute;\n  width: 1px;\n  left: 0px;\n}\n\n.ace_editor .ace_printMargin {\n  position: absolute;\n  height: 100%;\n}\n\n.ace_layer {\n  z-index: 0;\n  position: absolute;\n  overflow: hidden;  \n  white-space: nowrap;\n  height: 100%;\n}\n\n.ace_text-layer {\n  font-family: Monaco, "Courier New", monospace;\n  color: black;\n}\n\n.ace_cursor-layer {\n  cursor: text;\n}\n\n.ace_cursor {\n  z-index: 3;\n  position: absolute;\n}\n\n.ace_line {\n  white-space: nowrap;\n}\n\n.ace_marker-layer {\n}\n\n.ace_marker-layer .ace_step {\n  position: absolute;\n  z-index: 2;\n}\n\n.ace_marker-layer .ace_selection {\n  position: absolute;\n  z-index: 3;\n}\n\n.ace_marker-layer .ace_bracket {\n  position: absolute;\n  z-index: 4;\n}\n\n.ace_marker-layer .ace_active_line {\n  position: absolute;\n  z-index: 1;\n}'], 
function(k, h, e, i, l, m, n, o, p, q, r, j) {
  e.importCssString(j);
  j = function(a, b) {
    this.container = a;
    e.addCssClass(this.container, "ace_editor");
    this.setTheme(b);
    this.scroller = document.createElement("div");
    this.scroller.className = "ace_scroller";
    this.container.appendChild(this.scroller);
    this.$gutter = document.createElement("div");
    this.$gutter.className = "ace_gutter";
    this.container.appendChild(this.$gutter);
    this.content = document.createElement("div");
    this.content.style.position = "absolute";
    this.scroller.appendChild(this.content);
    this.$gutterLayer = new l(this.$gutter);
    this.$markerLayer = new m(this.content);
    var c = this.$textLayer = new n(this.content);
    this.canvas = c.element;
    this.characterWidth = c.getCharacterWidth();
    this.lineHeight = c.getLineHeight();
    this.$cursorLayer = new o(this.content);
    this.layers = [this.$markerLayer, c, this.$cursorLayer];
    this.scrollBar = new p(a);
    this.scrollBar.addEventListener("scroll", h.bind(this.onScroll, this));
    this.scrollTop = 0;
    this.cursorPos = {row:0, column:0};
    var d = this;
    this.$textLayer.addEventListener("changeCharaterSize", function() {
      d.characterWidth = c.getCharacterWidth();
      d.lineHeight = c.getLineHeight();
      d.$loop.schedule(d.CHANGE_FULL)
    });
    i.addListener(this.$gutter, "click", h.bind(this.$onGutterClick, this));
    i.addListener(this.$gutter, "dblclick", h.bind(this.$onGutterClick, this));
    this.$size = {width:0, height:0, scrollerHeight:0, scrollerWidth:0};
    this.$loop = new q(h.bind(this.$renderChanges, this));
    this.$loop.schedule(this.CHANGE_FULL);
    this.$updatePrintMargin();
    this.setPadding(4)
  };
  (function() {
    this.showGutter = true;
    this.CHANGE_CURSOR = 1;
    this.CHANGE_MARKER = 2;
    this.CHANGE_GUTTER = 4;
    this.CHANGE_SCROLL = 8;
    this.CHANGE_LINES = 16;
    this.CHANGE_TEXT = 32;
    this.CHANGE_SIZE = 64;
    this.CHANGE_FULL = 128;
    k.implement(this, r);
    this.setDocument = function(a) {
      this.lines = a.lines;
      this.doc = a;
      this.$cursorLayer.setDocument(a);
      this.$markerLayer.setDocument(a);
      this.$textLayer.setDocument(a);
      this.$loop.schedule(this.CHANGE_FULL)
    };
    this.updateLines = function(a, b) {
      if(b === undefined) {
        b = Infinity
      }if(this.$changedLines) {
        if(this.$changedLines.firstRow > a) {
          this.$changedLines.firstRow = a
        }if(this.$changedLines.lastRow < b) {
          this.$changedLines.lastRow = b
        }
      }else {
        this.$changedLines = {firstRow:a, lastRow:b}
      }this.$loop.schedule(this.CHANGE_LINES)
    };
    this.updateText = function() {
      this.$loop.schedule(this.CHANGE_TEXT)
    };
    this.updateFull = function() {
      this.$loop.schedule(this.CHANGE_FULL)
    };
    this.onResize = function() {
      this.$loop.schedule(this.CHANGE_SIZE);
      var a = e.getInnerHeight(this.container);
      if(this.$size.height != a) {
        this.$size.height = a;
        this.scroller.style.height = a + "px";
        this.scrollBar.setHeight(a);
        if(this.doc) {
          this.scrollToY(this.getScrollTop());
          this.$loop.schedule(this.CHANGE_FULL)
        }
      }a = e.getInnerWidth(this.container);
      if(this.$size.width != a) {
        this.$size.width = a;
        var b = this.showGutter ? this.$gutter.offsetWidth : 0;
        this.scroller.style.left = b + "px";
        this.scroller.style.width = Math.max(0, a - b - this.scrollBar.getWidth()) + "px"
      }this.$size.scrollerWidth = this.scroller.clientWidth;
      this.$size.scrollerHeight = this.scroller.clientHeight
    };
    this.setTokenizer = function(a) {
      this.$tokenizer = a;
      this.$textLayer.setTokenizer(a);
      this.$loop.schedule(this.CHANGE_TEXT)
    };
    this.$onGutterClick = function(a) {
      var b = i.getDocumentX(a), c = i.getDocumentY(a);
      this.$dispatchEvent("gutter" + a.type, {row:this.screenToTextCoordinates(b, c).row, htmlEvent:a})
    };
    this.$showInvisibles = true;
    this.setShowInvisibles = function(a) {
      this.$showInvisibles = a;
      this.$textLayer.setShowInvisibles(a);
      this.$loop.schedule(this.CHANGE_TEXT)
    };
    this.getShowInvisibles = function() {
      return this.$showInvisibles
    };
    this.$showPrintMargin = true;
    this.setShowPrintMargin = function(a) {
      this.$showPrintMargin = a;
      this.$updatePrintMargin()
    };
    this.getShowPrintMargin = function() {
      return this.$showPrintMargin
    };
    this.$printMarginColumn = 80;
    this.setPrintMarginColumn = function(a) {
      this.$printMarginColumn = a;
      this.$updatePrintMargin()
    };
    this.getPrintMarginColumn = function() {
      return this.$printMarginColumn
    };
    this.setShowGutter = function(a) {
      this.$gutter.style.display = a ? "block" : "none";
      this.showGutter = a;
      this.onResize()
    };
    this.$updatePrintMargin = function() {
      if(this.$showPrintMargin || this.$printMarginEl) {
        if(!this.$printMarginEl) {
          this.$printMarginEl = document.createElement("div");
          this.$printMarginEl.className = "ace_printMargin";
          this.content.insertBefore(this.$printMarginEl, this.$textLayer.element)
        }var a = this.$printMarginEl.style;
        a.left = this.characterWidth * this.$printMarginColumn + "px";
        a.visibility = this.$showPrintMargin ? "visible" : "hidden"
      }
    };
    this.getContainerElement = function() {
      return this.container
    };
    this.getMouseEventTarget = function() {
      return this.content
    };
    this.getFirstVisibleRow = function() {
      return(this.layerConfig || {}).firstRow || 0
    };
    this.getFirstFullyVisibleRow = function() {
      if(!this.layerConfig) {
        return 0
      }return this.layerConfig.firstRow + (this.layerConfig.offset == 0 ? 0 : 1)
    };
    this.getLastFullyVisibleRow = function() {
      if(!this.layerConfig) {
        return 0
      }return this.layerConfig.firstRow - 1 + Math.floor((this.layerConfig.height + this.layerConfig.offset) / this.layerConfig.lineHeight)
    };
    this.getLastVisibleRow = function() {
      return(this.layerConfig || {}).lastRow || 0
    };
    this.$padding = null;
    this.setPadding = function(a) {
      this.$padding = a;
      this.content.style.padding = "0 " + a + "px";
      this.$loop.schedule(this.CHANGE_FULL)
    };
    this.onScroll = function(a) {
      this.scrollToY(a.data)
    };
    this.$updateScrollBar = function() {
      this.scrollBar.setInnerHeight(this.doc.getLength() * this.lineHeight);
      this.scrollBar.setScrollTop(this.scrollTop)
    };
    this.$renderChanges = function(a) {
      if(!(!a || !this.doc || !this.$tokenizer)) {
        if(!this.layerConfig || a & this.CHANGE_FULL || a & this.CHANGE_SIZE || a & this.CHANGE_TEXT || a & this.CHANGE_LINES || a & this.CHANGE_SCROLL) {
          this.$computeLayerConfig()
        }if(a & this.CHANGE_FULL) {
          this.$textLayer.update(this.layerConfig);
          this.showGutter && this.$gutterLayer.update(this.layerConfig);
          this.$markerLayer.update(this.layerConfig);
          this.$cursorLayer.update(this.layerConfig);
          this.$updateScrollBar()
        }else {
          if(a & this.CHANGE_SCROLL) {
            a & this.CHANGE_TEXT || a & this.CHANGE_LINES ? this.$textLayer.scrollLines(this.layerConfig) : this.$textLayer.update(this.layerConfig);
            this.showGutter && this.$gutterLayer.update(this.layerConfig);
            this.$markerLayer.update(this.layerConfig);
            this.$cursorLayer.update(this.layerConfig);
            this.$updateScrollBar()
          }else {
            if(a & this.CHANGE_TEXT) {
              this.$textLayer.update(this.layerConfig);
              this.showGutter && this.$gutterLayer.update(this.layerConfig)
            }else {
              if(a & this.CHANGE_LINES) {
                this.$updateLines();
                this.$updateScrollBar()
              }else {
                if(a & this.CHANGE_SCROLL) {
                  this.$textLayer.scrollLines(this.layerConfig);
                  this.showGutter && this.$gutterLayer.update(this.layerConfig)
                }
              }
            }a & this.CHANGE_GUTTER && this.showGutter && this.$gutterLayer.update(this.layerConfig);
            a & this.CHANGE_CURSOR && this.$cursorLayer.update(this.layerConfig);
            a & this.CHANGE_MARKER && this.$markerLayer.update(this.layerConfig);
            a & this.CHANGE_SIZE && this.$updateScrollBar()
          }
        }
      }
    };
    this.$computeLayerConfig = function() {
      var a = this.scrollTop % this.lineHeight, b = this.$size.scrollerHeight + this.lineHeight, c = this.$getLongestLine(), d = !this.layerConfig ? true : this.layerConfig.width != c, g = Math.ceil(b / this.lineHeight), f = Math.max(0, Math.round((this.scrollTop - a) / this.lineHeight));
      g = Math.min(this.lines.length, f + g) - 1;
      this.layerConfig = {width:c, padding:this.$padding, firstRow:f, lastRow:g, lineHeight:this.lineHeight, characterWidth:this.characterWidth, minHeight:b, offset:a, height:this.$size.scrollerHeight};
      for(f = 0;f < this.layers.length;f++) {
        g = this.layers[f];
        if(d) {
          g.element.style.width = c + "px"
        }
      }this.$gutterLayer.element.style.marginTop = -a + "px";
      this.content.style.marginTop = -a + "px";
      this.content.style.width = c + "px";
      this.content.style.height = b + "px"
    };
    this.$updateLines = function() {
      var a = this.$changedLines.firstRow, b = this.$changedLines.lastRow;
      this.$changedLines = null;
      var c = this.layerConfig;
      if(c.width != this.$getLongestLine()) {
        return this.$textLayer.update(c)
      }if(!(a > c.lastRow + 1)) {
        if(!(b < c.firstRow)) {
          if(b === Infinity) {
            this.showGutter && this.$gutterLayer.update(c);
            this.$textLayer.update(c)
          }else {
            this.$textLayer.updateLines(c, a, b)
          }
        }
      }
    };
    this.$getLongestLine = function() {
      var a = this.doc.getScreenWidth();
      if(this.$showInvisibles) {
        a += 1
      }return Math.max(this.$size.scrollerWidth - this.$padding * 2, Math.round(a * this.characterWidth))
    };
    this.addMarker = function(a, b, c) {
      a = this.$markerLayer.addMarker(a, b, c);
      this.$loop.schedule(this.CHANGE_MARKER);
      return a
    };
    this.removeMarker = function(a) {
      this.$markerLayer.removeMarker(a);
      this.$loop.schedule(this.CHANGE_MARKER)
    };
    this.addGutterDecoration = function(a, b) {
      this.$gutterLayer.addGutterDecoration(a, b);
      this.$loop.schedule(this.CHANGE_GUTTER)
    };
    this.removeGutterDecoration = function(a, b) {
      this.$gutterLayer.removeGutterDecoration(a, b);
      this.$loop.schedule(this.CHANGE_GUTTER)
    };
    this.setBreakpoints = function(a) {
      this.$gutterLayer.setBreakpoints(a);
      this.$loop.schedule(this.CHANGE_GUTTER)
    };
    this.updateCursor = function(a, b) {
      this.$cursorLayer.setCursor(a, b);
      this.$loop.schedule(this.CHANGE_CURSOR)
    };
    this.hideCursor = function() {
      this.$cursorLayer.hideCursor()
    };
    this.showCursor = function() {
      this.$cursorLayer.showCursor()
    };
    this.scrollCursorIntoView = function() {
      var a = this.$cursorLayer.getPixelPosition(), b = a.left + this.$padding;
      a = a.top;
      this.getScrollTop() > a && this.scrollToY(a);
      this.getScrollTop() + this.$size.scrollerHeight < a + this.lineHeight && this.scrollToY(a + this.lineHeight - this.$size.scrollerHeight);
      this.scroller.scrollLeft > b && this.scrollToX(b);
      this.scroller.scrollLeft + this.$size.scrollerWidth < b + this.characterWidth && this.scrollToX(Math.round(b + this.characterWidth - this.$size.scrollerWidth))
    };
    this.getScrollTop = function() {
      return this.scrollTop
    };
    this.getScrollLeft = function() {
      return this.scroller.scrollLeft
    };
    this.getScrollTopRow = function() {
      return this.scrollTop / this.lineHeight
    };
    this.scrollToRow = function(a) {
      this.scrollToY(a * this.lineHeight)
    };
    this.scrollToY = function(a) {
      a = Math.max(0, Math.min(this.lines.length * this.lineHeight - this.$size.scrollerHeight, a));
      if(this.scrollTop !== a) {
        this.scrollTop = a;
        this.$loop.schedule(this.CHANGE_SCROLL)
      }
    };
    this.scrollToX = function(a) {
      if(a <= this.$padding) {
        a = 0
      }this.scroller.scrollLeft = a
    };
    this.scrollBy = function(a, b) {
      b && this.scrollToY(this.scrollTop + b);
      a && this.scrollToX(this.scroller.scrollLeft + a)
    };
    this.screenToTextCoordinates = function(a, b) {
      var c = this.scroller.getBoundingClientRect();
      a = Math.round((a + this.scroller.scrollLeft - c.left - this.$padding) / this.characterWidth);
      b = Math.floor((b + this.scrollTop - c.top) / this.lineHeight);
      return{row:b, column:this.doc.screenToDocumentColumn(Math.max(0, Math.min(b, this.doc.getLength() - 1)), a)}
    };
    this.textToScreenCoordinates = function(a, b) {
      var c = this.scroller.getBoundingClientRect();
      b = this.padding + Math.round(this.doc.documentToScreenColumn(a, b) * this.characterWidth);
      a = a * this.lineHeight;
      return{pageX:c.left + b - this.getScrollLeft(), pageY:c.top + a - this.getScrollTop()}
    };
    this.visualizeFocus = function() {
      e.addCssClass(this.container, "ace_focus")
    };
    this.visualizeBlur = function() {
      e.removeCssClass(this.container, "ace_focus")
    };
    this.showComposition = function() {
    };
    this.setCompositionText = function() {
    };
    this.hideComposition = function() {
    };
    this.setTheme = function(a) {
      function b(d) {
        c.$theme && e.removeCssClass(c.container, c.$theme);
        c.$theme = d ? d.cssClass : null;
        c.$theme && e.addCssClass(c.container, c.$theme);
        if(c.$size) {
          c.$size.width = 0;
          c.onResize()
        }
      }
      var c = this;
      if(!a || typeof a == "string") {
        a = a || "ace/theme/TextMate";
        require([a], function(d) {
          b(d)
        })
      }else {
        b(a)
      }c = this
    }
  }).call(j.prototype);
  return j
});