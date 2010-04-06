function TextInput(parentNode, host) {
  
  var text = document.createElement("textarea");
  var style = text.style;
  style.position = "absolute";
  style.left = "-10000px";
  style.top = "-10000px";
  parentNode.appendChild(text);
  
  var inCompostion = false;
  
  var onTextInput = function(e) {
    setTimeout(function() {
      if (!inCompostion) {
        if (text.value) host.onTextInput(text.value);
        text.value = "";
      }
    }, 0)
  }

  var onCompositionStart = function(e) 
  {
    inCompostion = true;

    if (text.value) host.onTextInput(text.value);
    text.value = "";
    
    host.onCompositionStart();
    setTimeout(onCompositionUpdate, 0);
  }

  var onCompositionUpdate = function() {
    host.onCompositionUpdate(text.value);
  }

  var onCompositionEnd = function() 
  { 
    inCompostion = false;
    host.onCompositionEnd();
    onTextInput();
  }

  addListener(text, "keypress", onTextInput, false);
  addListener(text, "textInput", onTextInput, false);
  addListener(text, "paste", onTextInput, false);
  addListener(text, "propertychange", onTextInput, false);

  addListener(text, "compositionstart", onCompositionStart, false);
  addListener(text, "compositionupdate", onCompositionUpdate, false);
  addListener(text, "compositionend", onCompositionEnd, false);
  
  addListener(text, "blur", function() {
    host.onBlur();
  }, false);
  
  addListener(text, "focus", function() {
    host.onFocus();
  }, false);
  
  
  this.focus = function() {
    text.focus();
  }
  
  this.blur = function() {
    this.blur();
  }
};

var keys = {
  UP: 38,
  RIGHT: 39,
  DOWN: 40,  
  LEFT: 37,
  POS1: 36,
  END: 35,
  DELETE: 46,
  BACKSPACE: 8,
  TAB: 9
}

function KeyBinding(element, host)
{
  addListener(element, "keydown", function(e)
  {
    var key = e.keyCode;
    
    switch (key) 
    {      
      case keys.UP:
        host.moveUp();
        return stopEvent(e);
        
      case keys.DOWN:
        host.moveDown();
        return stopEvent(e);
        
      case keys.LEFT:
        host.moveLeft();
        return stopEvent(e);
        
      case keys.RIGHT:
        host.moveRight();
        return stopEvent(e);
        
      case keys.POS1:
        host.moveLineStart();
        return stopEvent(e);

      case keys.END:
        host.moveLineEnd();
        return stopEvent(e);
                  
      case keys.DELETE:
        host.removeRight();
        return stopEvent(e);
        
      case keys.BACKSPACE:
        host.removeLeft();
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
  
  var textInput = new TextInput(container, this);
  new KeyBinding(container, this);
  
  var self = this;
  addListener(container, "mousedown", function(e) {
    textInput.focus();
    self.placeCursorToMouse(e.pageX, e.pageY);
    return preventDefault(e);
  });
  
  addListener(container, "mousewheel", function(e) {
    var delta = e.wheelDeltaY;
    self.renderer.scrollToY(self.renderer.getScrollTop() - (delta/10));
    return preventDefault(e);
  });
  
  this.cursor = {
    row: 0,
    column: 0
  }
  this.doc = doc;
  renderer.setDocument(doc);
  
  this.draw();
}

Editor.prototype = 
{
  draw : function()
  {
    this.renderer.draw();
    this.renderer.updateCursor(this.cursor);
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
  
  placeCursorToMouse : function(pageX, pageY)
  {
    var pos = this.renderer.screenToTextCoordinates(pageX, pageY);    
    this.moveTo(pos.row, pos.column);
  },
  
  onTextInput: function(text)
  {    
    this.cursor = this.doc.insert(this.cursor, text);    
    this.draw();
    this.renderer.scrollCursorIntoView();
  },
  
  removeRight : function()
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
    
    this.draw();
    this.renderer.scrollCursorIntoView();
  },
  
  removeLeft : function()
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
    
    this.draw();
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
  
  moveBy : function(rows, chars) {
    this.moveTo(this.cursor.row+rows, this.cursor.column+chars);
  },
  
  moveTo : function(row, column) 
  {
    this.cursor.row = Math.min(this.doc.getLength()-1, Math.max(0, row));
    this.cursor.column = Math.min(this.doc.getLine(this.cursor.row).length, Math.max(0, column));
    this.updateCursor();
  }  
}