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
  addListener(element, "keydown", function(e)
  {
    var key = e.keyCode;
    
    switch (key) 
    { 
      case keys.A:
        if (e.metaKey) 
        {
          host.selectAll();
          return stopEvent(e);
        }
        break;
        
      case keys.UP:
        if (e.shiftKey) {
          host.selectUp();
        } else {
          host.clearSelection();
          host.moveUp();
        }
        return stopEvent(e);
        
      case keys.DOWN:
        if (e.shiftKey) {
          host.selectDown();
        } else {
          host.clearSelection();
          host.moveDown();
        }
        return stopEvent(e);
        
      case keys.LEFT:
        if (e.metaKey && e.shiftKey) {
          host.selectLineStart();
        } else if (e.metaKey) {
          host.clearSelection();
          host.moveLineStart();
        } else if (e.shiftKey) {
          host.selectLeft();
        } else {
          host.clearSelection();
          host.moveLeft();
        }
        return stopEvent(e);
        
      case keys.RIGHT:
        if (e.metaKey && e.shiftKey) {
          host.selectLineEnd();
        } else if (e.metaKey) {
          host.clearSelection();
          host.moveLineEnd();
        } else if (e.shiftKey) {
          host.selectRight();
        } else {
          host.clearSelection();
          host.moveRight();
        }
        return stopEvent(e);
        
      case keys.POS1:
        if (e.shiftKey) {
          host.selectLineStart();
        } else {
          host.clearSelection();
          host.moveLineStart();
        }
        return stopEvent(e);

      case keys.END:
        if (e.shiftKey) {
          host.selectLineEnd();
        } else {
          host.clearSelection();
          host.moveLineEnd();
        }
        return stopEvent(e);
                  
      case keys.DELETE:        
        host.removeRight();
        host.clearSelection();
        return stopEvent(e);
        
      case keys.BACKSPACE:        
        host.removeLeft();
        host.clearSelection();
        return stopEvent(e);
        
      case keys.TAB:
        host.onTextInput("    ");
        return stopEvent(e);
    }
  });
};

function Editor(doc, renderer) 
{
  var container = renderer.getContainerElement();
  this.renderer = renderer;
  
  this.textInput = new TextInput(container, this);
  new KeyBinding(container, this);
  
  addListener(container, "mousedown", bind(this.onMouseDown, this));
  addListener(container, "dblclick", bind(this.onMouseDoubleClick, this));
  addListener(container, "mousewheel", bind(this.onMouseWheel, this));
  addTripleClickListener(container, bind(this.selectCurrentLine, this));
  
  this.doc = doc;
  doc.addChangeListener(bind(this.onDocumentChange, this));
  renderer.setDocument(doc);
  
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
  
  onDocumentChange : function(startRow, endRow) {
    this.renderer.updateLines(startRow, endRow);
  },  
  
  onMouseDown : function(e) 
  {
    this.textInput.focus();
    
    var pos = this.renderer.screenToTextCoordinates(e.pageX, e.pageY);    
    this.moveTo(pos.row, pos.column);
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
        _self.moveTo(selectionLead.row, selectionLead.column);
      });
      _self.renderer.scrollCursorIntoView();      
    };
    
    capture(this.container, onMouseSelection, onMouseSelectionEnd);
    var timerId = setInterval(onSelectionInterval, 20 );
        
    return preventDefault(e);
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
      this.moveTo(this.cursor.row, end);
    });
  },
  
  onMouseWheel : function(e) 
  {
    var delta = e.wheelDeltaY;
    this.renderer.scrollToY(this.renderer.getScrollTop() - (delta/10));
    return preventDefault(e);
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
  
  moveUp : function() {
    this.moveBy(-1, 0);
    this.renderer.scrollCursorIntoView();
  },

  moveDown : function() {
    this.moveBy(1, 0);
    this.renderer.scrollCursorIntoView();
  },

  moveLeft : function()
  {
    if (this.cursor.column == 0) {
      if (this.cursor.row > 0) {
        this.moveTo(this.cursor.row-1, this.doc.getLine(this.cursor.row-1).length);
      }
    } else {
      this.moveBy(0, -1);
    }
    this.renderer.scrollCursorIntoView();
  },

  moveRight : function() 
  {    
    if (this.cursor.column == this.doc.getLine(this.cursor.row).length) {
      if (this.cursor.row < this.doc.getLength()-1) {
        this.moveTo(this.cursor.row+1, 0);
      }
    } else {
      this.moveBy(0, 1);
    }
    this.renderer.scrollCursorIntoView(); 
  },
  
  moveLineStart : function() 
  {
    this.moveTo(this.cursor.row, 0);
    this.renderer.scrollCursorIntoView();
  },
  
  moveLineEnd : function() {
    this.moveTo(this.cursor.row, this.doc.getLine(this.cursor.row).length);
    this.renderer.scrollCursorIntoView();
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
      this.moveTo(0, 0);
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
  },
  
  selectUp : function() {
    this._moveSelection(this.moveUp);
  },
  
  selectDown : function() {
    this._moveSelection(this.moveDown);
  },
  
  selectRight : function() {
    this._moveSelection(this.moveRight);
  },
  
  selectLeft : function() {
    this._moveSelection(this.moveLeft);
  },
  
  selectLineStart : function() {
    this._moveSelection(this.moveLineStart);
  },
  
  selectLineEnd : function() {
    this._moveSelection(this.moveLineEnd);
  },
  
  selectCurrentLine : function() 
  {
    this.setSelectionAnchor(this.cursor.row, 0);
    this._moveSelection(function() {
      this.moveTo(this.cursor.row+1, 0);
    });
  },
  
  moveBy : function(rows, chars) {
    this.moveTo(this.cursor.row+rows, this.cursor.column+chars);
  },
  
  moveTo : function(row, column) 
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
  }  
}