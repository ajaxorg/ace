define(function(g, r) {
  var s = g("pilot/oop"), e = g("pilot/event"), t = g("pilot/lang"), u = g("ace/textinput").TextInput, v = g("ace/keybinding").KeyBinding, w = g("ace/document").Document, x = g("ace/search").Search, y = g("ace/background_tokenizer").BackgroundTokenizer, o = g("ace/range").Range, z = g("pilot/event_emitter").EventEmitter;
  g = function(a, b) {
    var d = a.getContainerElement();
    this.container = d;
    this.renderer = a;
    this.textInput = new u(d, this);
    this.keyBinding = new v(d, this);
    var c = this;
    e.addListener(d, "mousedown", function(i) {
      setTimeout(function() {
        c.focus()
      });
      return e.preventDefault(i)
    });
    e.addListener(d, "selectstart", function(i) {
      return e.preventDefault(i)
    });
    a = a.getMouseEventTarget();
    e.addListener(a, "mousedown", this.onMouseDown.bind(this));
    e.addMultiMouseDownListener(a, 0, 2, 500, this.onMouseDoubleClick.bind(this));
    e.addMultiMouseDownListener(a, 0, 3, 600, this.onMouseTripleClick.bind(this));
    e.addMouseWheelListener(a, this.onMouseWheel.bind(this));
    this.$highlightLineMarker = this.$selectionMarker = null;
    this.$blockScrolling = false;
    this.$search = (new x).set({wrap:true});
    this.setDocument(b || new w(""));
    this.focus()
  };
  (function() {
    s.implement(this, z);
    this.$forwardEvents = {gutterclick:1, gutterdblclick:1};
    this.$originalAddEventListener = this.addEventListener;
    this.$originalRemoveEventListener = this.removeEventListener;
    this.addEventListener = function(a, b) {
      return this.$forwardEvents[a] ? this.renderer.addEventListener(a, b) : this.$originalAddEventListener(a, b)
    };
    this.removeEventListener = function(a, b) {
      return this.$forwardEvents[a] ? this.renderer.removeEventListener(a, b) : this.$originalRemoveEventListener(a, b)
    };
    this.setDocument = function(a) {
      if(this.doc != a) {
        if(this.doc) {
          this.doc.removeEventListener("change", this.$onDocumentChange);
          this.doc.removeEventListener("changeMode", this.$onDocumentModeChange);
          this.doc.removeEventListener("changeTabSize", this.$onDocumentChangeTabSize);
          this.doc.removeEventListener("changeBreakpoint", this.$onDocumentChangeBreakpoint);
          var b = this.doc.getSelection();
          b.removeEventListener("changeCursor", this.$onCursorChange);
          b.removeEventListener("changeSelection", this.$onSelectionChange);
          this.doc.setScrollTopRow(this.renderer.getScrollTopRow())
        }this.doc = a;
        this.$onDocumentChange = this.onDocumentChange.bind(this);
        a.addEventListener("change", this.$onDocumentChange);
        this.renderer.setDocument(a);
        this.$onDocumentModeChange = this.onDocumentModeChange.bind(this);
        a.addEventListener("changeMode", this.$onDocumentModeChange);
        this.$onDocumentChangeTabSize = this.renderer.updateText.bind(this.renderer);
        a.addEventListener("changeTabSize", this.$onDocumentChangeTabSize);
        this.$onDocumentChangeBreakpoint = this.onDocumentChangeBreakpoint.bind(this);
        this.doc.addEventListener("changeBreakpoint", this.$onDocumentChangeBreakpoint);
        this.selection = a.getSelection();
        this.$desiredColumn = 0;
        this.$onCursorChange = this.onCursorChange.bind(this);
        this.selection.addEventListener("changeCursor", this.$onCursorChange);
        this.$onSelectionChange = this.onSelectionChange.bind(this);
        this.selection.addEventListener("changeSelection", this.$onSelectionChange);
        this.onDocumentModeChange();
        this.bgTokenizer.setLines(this.doc.lines);
        this.bgTokenizer.start(0);
        this.onCursorChange();
        this.onSelectionChange();
        this.onDocumentChangeBreakpoint();
        this.renderer.scrollToRow(a.getScrollTopRow());
        this.renderer.updateFull()
      }
    };
    this.getDocument = function() {
      return this.doc
    };
    this.getSelection = function() {
      return this.selection
    };
    this.resize = function() {
      this.renderer.onResize()
    };
    this.setTheme = function(a) {
      this.renderer.setTheme(a)
    };
    this.$highlightBrackets = function() {
      if(this.$bracketHighlight) {
        this.renderer.removeMarker(this.$bracketHighlight);
        this.$bracketHighlight = null
      }if(!this.$highlightPending) {
        var a = this;
        this.$highlightPending = true;
        setTimeout(function() {
          a.$highlightPending = false;
          var b = a.doc.findMatchingBracket(a.getCursorPosition());
          if(b) {
            b = new o(b.row, b.column, b.row, b.column + 1);
            a.$bracketHighlight = a.renderer.addMarker(b, "ace_bracket")
          }
        }, 10)
      }
    };
    this.focus = function() {
      this.textInput.focus()
    };
    this.blur = function() {
      this.textInput.blur()
    };
    this.onFocus = function() {
      this.renderer.showCursor();
      this.renderer.visualizeFocus()
    };
    this.onBlur = function() {
      this.renderer.hideCursor();
      this.renderer.visualizeBlur()
    };
    this.onDocumentChange = function(a) {
      a = a.data;
      this.bgTokenizer.start(a.firstRow);
      this.renderer.updateLines(a.firstRow, a.lastRow);
      this.renderer.updateCursor(this.getCursorPosition(), this.$overwrite)
    };
    this.onTokenizerUpdate = function(a) {
      a = a.data;
      this.renderer.updateLines(a.first, a.last)
    };
    this.onCursorChange = function(a) {
      this.$highlightBrackets();
      this.renderer.updateCursor(this.getCursorPosition(), this.$overwrite);
      if(!this.$blockScrolling && (!a || !a.blockScrolling)) {
        this.renderer.scrollCursorIntoView()
      }this.$updateHighlightActiveLine()
    };
    this.$updateHighlightActiveLine = function() {
      this.$highlightLineMarker && this.renderer.removeMarker(this.$highlightLineMarker);
      this.$highlightLineMarker = null;
      if(this.getHighlightActiveLine() && (this.getSelectionStyle() != "line" || !this.selection.isMultiLine())) {
        var a = this.getCursorPosition();
        this.$highlightLineMarker = this.renderer.addMarker(new o(a.row, 0, a.row + 1, 0), "ace_active_line", "line")
      }
    };
    this.onSelectionChange = function(a) {
      this.$selectionMarker && this.renderer.removeMarker(this.$selectionMarker);
      this.$selectionMarker = null;
      if(!this.selection.isEmpty()) {
        var b = this.selection.getRange(), d = this.getSelectionStyle();
        this.$selectionMarker = this.renderer.addMarker(b, "ace_selection", d)
      }this.onCursorChange(a)
    };
    this.onDocumentChangeBreakpoint = function() {
      this.renderer.setBreakpoints(this.doc.getBreakpoints())
    };
    this.onDocumentModeChange = function() {
      var a = this.doc.getMode();
      if(this.mode != a) {
        this.mode = a;
        a = a.getTokenizer();
        if(this.bgTokenizer) {
          this.bgTokenizer.setTokenizer(a)
        }else {
          var b = this.onTokenizerUpdate.bind(this);
          this.bgTokenizer = new y(a, this);
          this.bgTokenizer.addEventListener("update", b)
        }this.renderer.setTokenizer(this.bgTokenizer)
      }
    };
    this.onMouseDown = function(a) {
      var b = e.getDocumentX(a), d = e.getDocumentY(a);
      b = this.renderer.screenToTextCoordinates(b, d);
      b.row = Math.max(0, Math.min(b.row, this.doc.getLength() - 1));
      if(e.getButton(a) != 0) {
        this.selection.isEmpty() && this.moveCursorToPosition(b)
      }else {
        if(a.shiftKey) {
          this.selection.selectToPosition(b)
        }else {
          this.moveCursorToPosition(b);
          this.$clickSelection || this.selection.clearSelection(b.row, b.column)
        }this.renderer.scrollCursorIntoView();
        var c = this, i, n;
        e.capture(this.container, function(h) {
          i = e.getDocumentX(h);
          n = e.getDocumentY(h)
        }, function() {
          clearInterval(f);
          c.$clickSelection = null
        });
        var f = setInterval(function() {
          if(!(i === undefined || n === undefined)) {
            var h = c.renderer.screenToTextCoordinates(i, n);
            h.row = Math.max(0, Math.min(h.row, c.doc.getLength() - 1));
            if(c.$clickSelection) {
              if(c.$clickSelection.contains(h.row, h.column)) {
                c.selection.setSelectionRange(c.$clickSelection)
              }else {
                var j = c.$clickSelection.compare(h.row, h.column) == -1 ? c.$clickSelection.end : c.$clickSelection.start;
                c.selection.setSelectionAnchor(j.row, j.column);
                c.selection.selectToPosition(h)
              }
            }else {
              c.selection.selectToPosition(h)
            }c.renderer.scrollCursorIntoView()
          }
        }, 20);
        return e.preventDefault(a)
      }
    };
    this.onMouseDoubleClick = function() {
      this.selection.selectWord();
      this.$clickSelection = this.getSelectionRange();
      this.$updateDesiredColumn()
    };
    this.onMouseTripleClick = function() {
      this.selection.selectLine();
      this.$clickSelection = this.getSelectionRange();
      this.$updateDesiredColumn()
    };
    this.onMouseWheel = function(a) {
      var b = this.$scrollSpeed * 2;
      this.renderer.scrollBy(a.wheelX * b, a.wheelY * b);
      return e.preventDefault(a)
    };
    this.getCopyText = function() {
      return this.selection.isEmpty() ? "" : this.doc.getTextRange(this.getSelectionRange())
    };
    this.onCut = function() {
      if(!this.$readOnly) {
        if(!this.selection.isEmpty()) {
          this.moveCursorToPosition(this.doc.remove(this.getSelectionRange()));
          this.clearSelection()
        }
      }
    };
    this.onTextInput = function(a) {
      if(!this.$readOnly) {
        var b = this.getCursorPosition();
        a = a.replace("\t", this.doc.getTabString());
        if(this.selection.isEmpty()) {
          if(this.$overwrite) {
            var d = new o.fromPoints(b, b);
            d.end.column += a.length;
            this.doc.remove(d)
          }
        }else {
          b = this.doc.remove(this.getSelectionRange());
          this.clearSelection()
        }this.clearSelection();
        var c = this;
        this.bgTokenizer.getState(b.row, function(i) {
          var n = c.mode.checkOutdent(i, c.doc.getLine(b.row), a), f = c.doc.getLine(b.row), h = c.mode.getNextLineIndent(i, f.slice(0, b.column), c.doc.getTabString()), j = c.doc.insert(b, a);
          c.bgTokenizer.getState(b.row, function(p) {
            if(b.row !== j.row) {
              p = c.doc.getTabSize();
              for(var q = Number.MAX_VALUE, l = b.row + 1;l <= j.row;++l) {
                var m = 0;
                f = c.doc.getLine(l);
                for(var k = 0;k < f.length;++k) {
                  if(f.charAt(k) == "\t") {
                    m += p
                  }else {
                    if(f.charAt(k) == " ") {
                      m += 1
                    }else {
                      break
                    }
                  }
                }if(/[^\s]/.test(f)) {
                  q = Math.min(m, q)
                }
              }for(l = b.row + 1;l <= j.row;++l) {
                m = q;
                f = c.doc.getLine(l);
                for(k = 0;k < f.length && m > 0;++k) {
                  if(f.charAt(k) == "\t") {
                    m -= p
                  }else {
                    if(f.charAt(k) == " ") {
                      m -= 1
                    }
                  }
                }c.doc.replace(new o(l, 0, l, f.length), f.substr(k))
              }j.column += c.doc.indentRows(b.row + 1, j.row, h)
            }else {
              if(n) {
                j.column += c.mode.autoOutdent(p, c.doc, b.row)
              }
            }c.moveCursorToPosition(j);
            c.renderer.scrollCursorIntoView()
          })
        })
      }
    };
    this.$overwrite = false;
    this.setOverwrite = function(a) {
      if(this.$overwrite != a) {
        this.$overwrite = a;
        this.$blockScrolling = true;
        this.onCursorChange();
        this.$blockScrolling = false;
        this._dispatchEvent("changeOverwrite", {data:a})
      }
    };
    this.getOverwrite = function() {
      return this.$overwrite
    };
    this.toggleOverwrite = function() {
      this.setOverwrite(!this.$overwrite)
    };
    this.$scrollSpeed = 1;
    this.setScrollSpeed = function(a) {
      this.$scrollSpeed = a
    };
    this.getScrollSpeed = function() {
      return this.$scrollSpeed
    };
    this.$selectionStyle = "line";
    this.setSelectionStyle = function(a) {
      if(this.$selectionStyle != a) {
        this.$selectionStyle = a;
        this.onSelectionChange();
        this._dispatchEvent("changeSelectionStyle", {data:a})
      }
    };
    this.getSelectionStyle = function() {
      return this.$selectionStyle
    };
    this.$highlightActiveLine = true;
    this.setHighlightActiveLine = function(a) {
      if(this.$highlightActiveLine != a) {
        this.$highlightActiveLine = a;
        this.$updateHighlightActiveLine()
      }
    };
    this.getHighlightActiveLine = function() {
      return this.$highlightActiveLine
    };
    this.setShowInvisibles = function(a) {
      this.getShowInvisibles() != a && this.renderer.setShowInvisibles(a)
    };
    this.getShowInvisibles = function() {
      return this.renderer.getShowInvisibles()
    };
    this.setShowPrintMargin = function(a) {
      this.renderer.setShowPrintMargin(a)
    };
    this.getShowPrintMargin = function() {
      return this.renderer.getShowPrintMargin()
    };
    this.setPrintMarginColumn = function(a) {
      this.renderer.setPrintMarginColumn(a)
    };
    this.getPrintMarginColumn = function() {
      return this.renderer.getPrintMarginColumn()
    };
    this.$readOnly = false;
    this.setReadOnly = function(a) {
      this.$readOnly = a
    };
    this.getReadOnly = function() {
      return this.$readOnly
    };
    this.removeRight = function() {
      if(!this.$readOnly) {
        this.selection.isEmpty() && this.selection.selectRight();
        this.moveCursorToPosition(this.doc.remove(this.getSelectionRange()));
        this.clearSelection()
      }
    };
    this.removeLeft = function() {
      if(!this.$readOnly) {
        this.selection.isEmpty() && this.selection.selectLeft();
        this.moveCursorToPosition(this.doc.remove(this.getSelectionRange()));
        this.clearSelection()
      }
    };
    this.indent = function() {
      if(!this.$readOnly) {
        var a = this.doc, b = this.getSelectionRange();
        if(b.start.row < b.end.row || b.start.column < b.end.column) {
          b = this.$getSelectedRows();
          a = a.indentRows(b.first, b.last, "\t");
          this.selection.shiftSelection(a)
        }else {
          if(this.doc.getUseSoftTabs()) {
            b = a.getTabSize();
            var d = this.getCursorPosition();
            a = a.documentToScreenColumn(d.row, d.column);
            a = b - a % b;
            a = t.stringRepeat(" ", a)
          }else {
            a = "\t"
          }return this.onTextInput(a)
        }
      }
    };
    this.blockOutdent = function() {
      if(!this.$readOnly) {
        var a = this.doc.getSelection(), b = this.doc.outdentRows(a.getRange());
        a.setSelectionRange(b, a.isBackwards());
        this.$updateDesiredColumn()
      }
    };
    this.toggleCommentLines = function() {
      if(!this.$readOnly) {
        var a = this;
        this.bgTokenizer.getState(this.getCursorPosition().row, function(b) {
          var d = a.$getSelectedRows();
          b = a.mode.toggleCommentLines(b, a.doc, d.first, d.last);
          a.selection.shiftSelection(b)
        })
      }
    };
    this.removeLines = function() {
      if(!this.$readOnly) {
        var a = this.$getSelectedRows();
        this.selection.setSelectionAnchor(a.last + 1, 0);
        this.selection.selectTo(a.first, 0);
        this.doc.remove(this.getSelectionRange());
        this.clearSelection()
      }
    };
    this.moveLinesDown = function() {
      this.$readOnly || this.$moveLines(function(a, b) {
        return this.doc.moveLinesDown(a, b)
      })
    };
    this.moveLinesUp = function() {
      this.$readOnly || this.$moveLines(function(a, b) {
        return this.doc.moveLinesUp(a, b)
      })
    };
    this.copyLinesUp = function() {
      this.$readOnly || this.$moveLines(function(a, b) {
        this.doc.duplicateLines(a, b);
        return 0
      })
    };
    this.copyLinesDown = function() {
      this.$readOnly || this.$moveLines(function(a, b) {
        return this.doc.duplicateLines(a, b)
      })
    };
    this.$moveLines = function(a) {
      var b = this.$getSelectedRows(), d = a.call(this, b.first, b.last), c = this.selection;
      c.setSelectionAnchor(b.last + d + 1, 0);
      c.$moveSelection(function() {
        c.moveCursorTo(b.first + d, 0)
      })
    };
    this.$getSelectedRows = function() {
      var a = this.getSelectionRange().collapseRows();
      return{first:a.start.row, last:a.end.row}
    };
    this.onCompositionStart = function() {
      this.renderer.showComposition(this.getCursorPosition())
    };
    this.onCompositionUpdate = function(a) {
      this.renderer.setCompositionText(a)
    };
    this.onCompositionEnd = function() {
      this.renderer.hideComposition()
    };
    this.getFirstVisibleRow = function() {
      return this.renderer.getFirstVisibleRow()
    };
    this.getLastVisibleRow = function() {
      return this.renderer.getLastVisibleRow()
    };
    this.isRowVisible = function(a) {
      return a >= this.getFirstVisibleRow() && a <= this.getLastVisibleRow()
    };
    this.getVisibleRowCount = function() {
      return this.getLastVisibleRow() - this.getFirstVisibleRow() + 1
    };
    this.getPageDownRow = function() {
      return this.renderer.getLastVisibleRow() - 1
    };
    this.getPageUpRow = function() {
      var a = this.renderer.getFirstVisibleRow(), b = this.renderer.getLastVisibleRow();
      return a - (b - a) + 1
    };
    this.selectPageDown = function() {
      var a = this.getPageDownRow() + Math.floor(this.getVisibleRowCount() / 2);
      this.scrollPageDown();
      var b = this.getSelection();
      b.$moveSelection(function() {
        b.moveCursorTo(a, b.getSelectionLead().column)
      })
    };
    this.selectPageUp = function() {
      var a = this.getLastVisibleRow() - this.getFirstVisibleRow(), b = this.getPageUpRow() + Math.round(a / 2);
      this.scrollPageUp();
      var d = this.getSelection();
      d.$moveSelection(function() {
        d.moveCursorTo(b, d.getSelectionLead().column)
      })
    };
    this.gotoPageDown = function() {
      var a = this.getPageDownRow(), b = Math.min(this.getCursorPosition().column, this.doc.getLine(a).length);
      this.scrollToRow(a);
      this.getSelection().moveCursorTo(a, b)
    };
    this.gotoPageUp = function() {
      var a = this.getPageUpRow(), b = Math.min(this.getCursorPosition().column, this.doc.getLine(a).length);
      this.scrollToRow(a);
      this.getSelection().moveCursorTo(a, b)
    };
    this.scrollPageDown = function() {
      this.scrollToRow(this.getPageDownRow())
    };
    this.scrollPageUp = function() {
      this.renderer.scrollToRow(this.getPageUpRow())
    };
    this.scrollToRow = function(a) {
      this.renderer.scrollToRow(a)
    };
    this.getCursorPosition = function() {
      return this.selection.getCursor()
    };
    this.getSelectionRange = function() {
      return this.selection.getRange()
    };
    this.clearSelection = function() {
      this.selection.clearSelection();
      this.$updateDesiredColumn()
    };
    this.moveCursorTo = function(a, b) {
      this.selection.moveCursorTo(a, b);
      this.$updateDesiredColumn()
    };
    this.moveCursorToPosition = function(a) {
      this.selection.moveCursorToPosition(a);
      this.$updateDesiredColumn()
    };
    this.gotoLine = function(a, b) {
      this.selection.clearSelection();
      this.$blockScrolling = true;
      this.moveCursorTo(a - 1, b || 0);
      this.$blockScrolling = false;
      this.isRowVisible(this.getCursorPosition().row) || this.scrollToRow(a - 1 - Math.floor(this.getVisibleRowCount() / 2))
    };
    this.navigateTo = function(a, b) {
      this.clearSelection();
      this.moveCursorTo(a, b);
      this.$updateDesiredColumn(b)
    };
    this.navigateUp = function() {
      this.selection.clearSelection();
      this.selection.moveCursorBy(-1, 0);
      if(this.$desiredColumn) {
        var a = this.getCursorPosition(), b = this.doc.screenToDocumentColumn(a.row, this.$desiredColumn);
        this.selection.moveCursorTo(a.row, b)
      }
    };
    this.navigateDown = function() {
      this.selection.clearSelection();
      this.selection.moveCursorBy(1, 0);
      if(this.$desiredColumn) {
        var a = this.getCursorPosition(), b = this.doc.screenToDocumentColumn(a.row, this.$desiredColumn);
        this.selection.moveCursorTo(a.row, b)
      }
    };
    this.$updateDesiredColumn = function() {
      var a = this.getCursorPosition();
      this.$desiredColumn = this.doc.documentToScreenColumn(a.row, a.column)
    };
    this.navigateLeft = function() {
      this.selection.isEmpty() ? this.selection.moveCursorLeft() : this.moveCursorToPosition(this.getSelectionRange().start);
      this.clearSelection()
    };
    this.navigateRight = function() {
      this.selection.isEmpty() ? this.selection.moveCursorRight() : this.moveCursorToPosition(this.getSelectionRange().end);
      this.clearSelection()
    };
    this.navigateLineStart = function() {
      this.selection.moveCursorLineStart();
      this.clearSelection()
    };
    this.navigateLineEnd = function() {
      this.selection.moveCursorLineEnd();
      this.clearSelection()
    };
    this.navigateFileEnd = function() {
      this.selection.moveCursorFileEnd();
      this.clearSelection()
    };
    this.navigateFileStart = function() {
      this.selection.moveCursorFileStart();
      this.clearSelection()
    };
    this.navigateWordRight = function() {
      this.selection.moveCursorWordRight();
      this.clearSelection()
    };
    this.navigateWordLeft = function() {
      this.selection.moveCursorWordLeft();
      this.clearSelection()
    };
    this.replace = function(a, b) {
      b && this.$search.set(b);
      b = this.$search.find(this.doc);
      this.$tryReplace(b, a);
      b !== null && this.selection.setSelectionRange(b);
      this.$updateDesiredColumn()
    };
    this.replaceAll = function(a, b) {
      b && this.$search.set(b);
      b = this.$search.findAll(this.doc);
      if(b.length) {
        this.clearSelection();
        this.selection.moveCursorTo(0, 0);
        for(var d = b.length - 1;d >= 0;--d) {
          this.$tryReplace(b[d], a)
        }b[0] !== null && this.selection.setSelectionRange(b[0]);
        this.$updateDesiredColumn()
      }
    };
    this.$tryReplace = function(a, b) {
      b = this.$search.replace(this.doc.getTextRange(a), b);
      if(b !== null) {
        a.end = this.doc.replace(a, b);
        return a
      }else {
        return null
      }
    };
    this.getLastSearchOptions = function() {
      return this.$search.getOptions()
    };
    this.find = function(a, b) {
      this.clearSelection();
      b = b || {};
      b.needle = a;
      this.$search.set(b);
      this.$find()
    };
    this.findNext = function(a) {
      a = a || {};
      if(typeof a.backwards == "undefined") {
        a.backwards = false
      }this.$search.set(a);
      this.$find()
    };
    this.findPrevious = function(a) {
      a = a || {};
      if(typeof a.backwards == "undefined") {
        a.backwards = true
      }this.$search.set(a);
      this.$find()
    };
    this.$find = function(a) {
      this.selection.isEmpty() || this.$search.set({needle:this.doc.getTextRange(this.getSelectionRange())});
      typeof a != "undefined" && this.$search.set({backwards:a});
      if(a = this.$search.find(this.doc)) {
        this.gotoLine(a.end.row + 1, a.end.column);
        this.$updateDesiredColumn();
        this.selection.setSelectionRange(a)
      }
    };
    this.undo = function() {
      this.doc.getUndoManager().undo()
    };
    this.redo = function() {
      this.doc.getUndoManager().redo()
    }
  }).call(g.prototype);
  r.Editor = g
});