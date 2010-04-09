var keys = {
  UP: 38,
  RIGHT: 39,
  DOWN: 40,  
  LEFT: 37,
  POS1: 36,
  END: 35,
  DELETE: 46,
  BACKSPACE: 8,
  TAB: 9,
  A: 65
}

function KeyBinding(element, host)
{
  lib.addListener(element, "keydown", function(e)
  {
    var key = e.keyCode;
    
    switch (key) 
    { 
      case keys.A:
        if (e.metaKey) 
        {
          host.selectAll();
          return lib.stopEvent(e);
        }
        break;
        
      case keys.UP:
        if (e.shiftKey) {
          host.selectUp();
        } else {
          host.navigateUp();
        }
        return lib.stopEvent(e);
        
      case keys.DOWN:
        if (e.shiftKey) {
          host.selectDown();
        } else {
          host.navigateDown();
        }
        return lib.stopEvent(e);
        
      case keys.LEFT:
        if (e.metaKey && e.shiftKey) {
          host.selectLineStart();
        } else if (e.metaKey) {
          host.navigateLineStart();
        } else if (e.shiftKey) {
          host.selectLeft();
        } else {
          host.navigateLeft();
        }
        return lib.stopEvent(e);
        
      case keys.RIGHT:
        if (e.metaKey && e.shiftKey) {
          host.selectLineEnd();
        } else if (e.metaKey) {
          host.navigateLineEnd();
        } else if (e.shiftKey) {
          host.selectRight();
        } else {
          host.navigateRight();
        }
        return lib.stopEvent(e);
        
      case keys.POS1:
        if (e.shiftKey) {
          host.selectLineStart();
        } else {
          host.navigateLineStart();
        }
        return lib.stopEvent(e);

      case keys.END:
        if (e.shiftKey) {
          host.selectLineEnd();
        } else {
          host.navigateLineEnd();
        }
        return lib.stopEvent(e);
                  
      case keys.DELETE:        
        host.removeRight();
        return lib.stopEvent(e);
        
      case keys.BACKSPACE:        
        host.removeLeft();
        return lib.stopEvent(e);
        
      case keys.TAB:
        host.onTextInput("    ");
        return lib.stopEvent(e);
    }
  });
};

function Editor(doc, renderer) 
{
  var container = renderer.getContainerElement();
  this.renderer = renderer;
  
  this.textInput = new TextInput(container, this);
  new KeyBinding(container, this);
  
  lib.addListener(container, "mousedown", lib.bind(this.onMouseDown, this));
  lib.addListener(container, "dblclick", lib.bind(this.onMouseDoubleClick, this));
  lib.addMouseWheelListener(container, lib.bind(this.onMouseWheel, this));
  lib.addTripleClickListener(container, lib.bind(this.selectCurrentLine, this));
  
  this.doc = doc;
  doc.addChangeListener(lib.bind(this.onDocumentChange, this));
  renderer.setDocument(doc);
  
  this.tokenizer = new BackgroundTokenizer(
    new Tokenizer(XML.RULES),
    lib.bind(this.onTokenizerUpdate, this)
  );
  
  this.tokenizer.setLines(doc.lines);
  renderer.setTokenizer(this.tokenizer);
  
  this.cursor = {
    row: 0,
    column: 0
    };

    this.selectionAnchor = null;  
    this.selectionLead = null;
    this.selection = null;

    this.renderer.draw();
  }

  Editor.prototype = 
  {  
    resize : function() {
      this.renderer.draw();
    },

    updateCursor : function() {
      this.renderer.updateCursor(this.cursor);
    },

    onFocus : function() {
      this.renderer.showCursor();
    this.renderer.visualizeFocus();
  },
  
  onBlur : function() {
    this.renderer.hideCursor();
    this.renderer.visualizeBlur();
  },
  
  onDocumentChange : function(startRow, endRow)
  {
    this.tokenizer.start(startRow);
    this.renderer.updateLines(startRow, endRow);
  },
  
  onTokenizerUpdate : function(startRow, endRow) {
    this.renderer.updateLines(startRow, endRow);
  },
  
  onMouseDown : function(e) 
  {
    this.textInput.focus();
    
    var pos = this.renderer.screenToTextCoordinates(e.pageX, e.pageY);    
    this.moveCursorTo(pos.row, pos.column);
    this.setSelectionAnchor(pos.row, pos.column);
    this.renderer.scrollCursorIntoView();
  
    var _self = this;
    var mousePageX, mousePageY;
    
    var onMouseSelection = function(e) {
      mousePageX = e.pageX;
      mousePageY = e.pageY; 
    };
  
    var onMouseSelectionEnd = function() {
      clearInterval(timerId);
    };
    
    var onSelectionInterval = function() 
    {
      if (mousePageX === undefined || mousePageY === undefined) return;
      
      selectionLead = _self.renderer.screenToTextCoordinates(mousePageX, mousePageY);
      
      _self._moveSelection(function() {
        _self.moveCursorTo(selectionLead.row, selectionLead.column);
      });
      _self.renderer.scrollCursorIntoView();      
    };
    
    lib.capture(this.container, onMouseSelection, onMouseSelectionEnd);
    var timerId = setInterval(onSelectionInterval, 20 );
        
    return lib.preventDefault(e);
  },
  
  onMouseDoubleClick : function(e)
  {   
    var line = this.doc.getLine(this.cursor.row);
    var column = this.cursor.column;
    
    var tokenRe = /[a-zA-Z0-9_]+/g;
    var nonTokenRe = /[^a-zA-Z0-9_]+/g;
    
    var inToken = false;
    if (column > 0) {
      inToken = !!line.charAt(column-1).match(tokenRe);
    }

    if (!inToken) {
      inToken = !!line.charAt(column).match(tokenRe);
    }
    
    var re = inToken ? tokenRe : nonTokenRe;

    var start = column;
    if (start > 0) 
    {
      do {
        start--;
      } while (start >= 0 && line.charAt(start).match(re))
      start++;
    }
    
    var end = column;
    while (end < line.length && line.charAt(end).match(re)) {
      end++;
    }
    
    this.setSelectionAnchor(this.cursor.row, start);
    this._moveSelection(function() {
      this.moveCursorTo(this.cursor.row, end);
    });
  },
  
  onMouseWheel : function(e) 
  {
    var delta = e.wheel;
    this.renderer.scrollToY(this.renderer.getScrollTop() - (delta * 15));
    return lib.preventDefault(e);
  },
  
  getCopyText : function() 
  {
    if (this.hasSelection()) {
      return this.doc.getTextRange(this.getSelectionRange());
    } else {
      return "";
    }
  },
  
  onCut : function()
  {
    if (this.hasSelection())
    {
      this.cursor = this.doc.remove(this.getSelectionRange());
      this.clearSelection();
      this.renderer.updateCursor(this.cursor);
    }
  },
  
  onTextInput: function(text)
  {      
    if (this.hasSelection())
    {
      this.cursor = this.doc.replace(this.getSelectionRange(), text);
      this.clearSelection();
    } else {
      this.cursor = this.doc.insert(this.cursor, text);
    }
    this.renderer.updateCursor(this.cursor);
    this.renderer.scrollCursorIntoView();
  },
  
  removeRight : function()
  {
    if (this.hasSelection()) 
    {
      this.cursor = this.doc.remove(this.getSelectionRange());
      this.renderer.updateCursor(this.cursor);
      this.clearSelection();
    }
    else
    {
      var rangeEnd = {
        row: this.cursor.row,
        column: this.cursor.column + 1
      }
      if (rangeEnd.column > this.doc.getLine(this.cursor.row).length) {
        rangeEnd.row += 1;
        rangeEnd.column = 0;
      }
      this.doc.remove({start: this.cursor, end: renageEnd});      
    }
    
    this.renderer.scrollCursorIntoView();
  },
  
  removeLeft : function()
  {
    if (this.hasSelection()) 
    {
      this.cursor = this.doc.remove(this.getSelectionRange());
      this.clearSelection();
    }
    else
    {    
      if (this.cursor.row == 0 && this.cursor.column == 0) {
        return;
      }
    
      var rangeStart = {
        row: this.cursor.row,
        column: this.cursor.column + -1
      }
      if (rangeStart.column < 0) 
      {
        rangeStart.row -= 1;
        rangeStart.column = this.doc.getLine(this.cursor.row-1).length;
      }
      this.cursor = this.doc.remove({start: rangeStart, end: this.cursor});
    }
    
    this.renderer.updateCursor(this.cursor);
    this.renderer.scrollCursorIntoView();
  },  
  
  onCompositionStart : function()
  {      
    this.renderer.showComposition(this.cursor);
    this.onTextInput(" ");
  },
  
  onCompositionUpdate : function(text) {
    this.renderer.setCompositionText(text);
  },
  
  onCompositionEnd : function() {
    this.renderer.hideComposition();
    this.removeLeft();
  },
  
  navigateUp : function() 
  {
    this.clearSelection();
    this.moveCursorUp();
    this.renderer.scrollCursorIntoView();
  },
  
  navigateDown : function() {
    this.clearSelection();
    this.moveCursorDown();
    this.renderer.scrollCursorIntoView();    
  },
  
  navigateLeft : function()
  {
    if (this.hasSelection()) {
      var selectionStart = this.getSelectionRange().start;
      this.moveCursorTo(selectionStart.row, selectionStart.column);
    } else {
      this.moveCursorLeft();
    }
    this.clearSelection();
    
    this.renderer.scrollCursorIntoView();    
  },
  
  navigateRight : function()
  {
    if (this.hasSelection()) {
      var selectionEnd = this.getSelectionRange().end;
      this.moveCursorTo(selectionEnd.row, selectionEnd.column);
    } else {
      this.moveCursorRight();
    }
    this.clearSelection();
    
    this.renderer.scrollCursorIntoView();    
  },  
  
  navigateLineStart : function() 
  {
    this.clearSelection();
    this.moveCursorLineStart();
    this.renderer.scrollCursorIntoView();
  },
  
  navigateLineEnd : function() 
  {
    this.clearSelection();
    this.moveCursorLineEnd();
    this.renderer.scrollCursorIntoView();
  },
  
  moveCursorUp : function() {
    this.moveCursorBy(-1, 0);
  },

  moveCursorDown : function() {
    this.moveCursorBy(1, 0);
  },

  moveCursorLeft : function()
  {
    if (this.cursor.column == 0) {
      if (this.cursor.row > 0) {
        this.moveCursorTo(this.cursor.row-1, this.doc.getLine(this.cursor.row-1).length);
      }
    } else {
      this.moveCursorBy(0, -1);
    }
  },

  moveCursorRight : function() 
  {    
    if (this.cursor.column == this.doc.getLine(this.cursor.row).length) {
      if (this.cursor.row < this.doc.getLength()-1) {
        this.moveCursorTo(this.cursor.row+1, 0);
      }
    } else {
      this.moveCursorBy(0, 1);
    }
    this.renderer.scrollCursorIntoView(); 
  },
  
  moveCursorLineStart : function() 
  {
    this.moveCursorTo(this.cursor.row, 0);
    this.renderer.scrollCursorIntoView();
  },
  
  moveCursorLineEnd : function() {
    this.moveCursorTo(this.cursor.row, this.doc.getLine(this.cursor.row).length);
    this.renderer.scrollCursorIntoView();
  },
  
  moveCursorBy : function(rows, chars) {
    this.moveCursorTo(this.cursor.row+rows, this.cursor.column+chars);
  },
  
  moveCursorTo : function(row, column) 
  {
    if (row >= this.doc.getLength()) {
      this.cursor.row = this.doc.getLength()-1;
      this.cursor.column = this.doc.getLine(this.cursor.row).length;
    } else if (row < 0) {
      this.cursor.row = 0;
      this.cursor.column = 0;
    } else {
      this.cursor.row = row;
      this.cursor.column = Math.min(this.doc.getLine(this.cursor.row).length, Math.max(0, column));      
    }
    this.updateCursor();    
  },
  
  hasSelection : function() {
    return !!this.selectionLead;
  },
  
  setSelectionAnchor : function(row, column)
  {
    this.clearSelection();
    
    this.selectionAnchor = {
      row: Math.min(this.doc.getLength()-1, Math.max(0, row)),
      column: Math.min(this.doc.getLine(this.cursor.row).length, Math.max(0, column))
    };
    
    this.selectionLead = null;
  },
  
  getSelectionRange : function()
  {
    var anchor = this.selectionAnchor;
    var lead = this.selectionLead;
    
    if (!anchor) {
      return null;
    } else {
      if (anchor.row > lead.row || (anchor.row == lead.row && anchor.column > lead.column)) {
        return {
          start: lead,
          end: anchor
        }
      } else {
        return {
          start: anchor,
          end: lead
        }        
      }
    }
  },
  
  clearSelection : function() 
  {
    this.selectionLead = null;
    this.selectionAnchor = null;
    
    if (this.selection) {
      this.renderer.removeMarker(this.selection);
      this.selection = null;
    } 
  },
  
  selectAll : function()
  {
    var lastRow = this.doc.getLength()-1;    
    this.setSelectionAnchor(lastRow, this.doc.getLine(lastRow).length);
        
    this._moveSelection(function() {
      this.moveCursorTo(0, 0);
    });
  },
  
  _moveSelection : function(mover)
  {
    if (!this.selectionAnchor) {
      this.selectionAnchor = {
        row: this.cursor.row,
        column: this.cursor.column
      }
    }
    
    mover.call(this);
    
    this.selectionLead = {
      row: this.cursor.row,
      column: this.cursor.column
    }
    
    if (this.selection) {
      this.renderer.removeMarker(this.selection);
    }
    this.selection = this.renderer.addMarker(this.getSelectionRange(), "selection");
    this.renderer.scrollCursorIntoView();
  },
  
  selectUp : function() {
    this._moveSelection(this.moveCursorUp);
  },
  
  selectDown : function() {
    this._moveSelection(this.moveCursorDown);
  },
  
  selectRight : function() {
    this._moveSelection(this.moveCursorRight);
  },
  
  selectLeft : function() {
    this._moveSelection(this.moveCursorLeft);
  },
  
  selectLineStart : function() {
    this._moveSelection(this.moveCursorLineStart);
  },
  
  selectLineEnd : function() {
    this._moveSelection(this.moveCursorLineEnd);
  },
  
  selectCurrentLine : function() 
  {
    this.setSelectionAnchor(this.cursor.row, 0);
    this._moveSelection(function() {
      this.moveCursorTo(this.cursor.row+1, 0);
    });
  }
}