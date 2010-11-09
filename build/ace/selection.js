define(function(d) {
  var g = d("./lib/oop"), h = d("./lib/lang"), i = d("./event_emitter"), f = d("./range");
  d = function(a) {
    this.doc = a;
    this.clearSelection();
    this.selectionLead = {row:0, column:0}
  };
  (function() {
    g.implement(this, i);
    this.isEmpty = function() {
      return!this.selectionAnchor || this.selectionAnchor.row == this.selectionLead.row && this.selectionAnchor.column == this.selectionLead.column
    };
    this.isMultiLine = function() {
      if(this.isEmpty()) {
        return false
      }return this.getRange().isMultiLine()
    };
    this.getCursor = function() {
      return this.selectionLead
    };
    this.setSelectionAnchor = function(a, b) {
      a = this.$clipPositionToDocument(a, b);
      if(this.selectionAnchor) {
        if(this.selectionAnchor.row !== a.row || this.selectionAnchor.column !== a.column) {
          this.selectionAnchor = a;
          this.$dispatchEvent("changeSelection", {})
        }
      }else {
        this.selectionAnchor = a;
        this.$dispatchEvent("changeSelection", {})
      }
    };
    this.getSelectionAnchor = function() {
      return this.selectionAnchor ? this.$clone(this.selectionAnchor) : this.$clone(this.selectionLead)
    };
    this.getSelectionLead = function() {
      return this.$clone(this.selectionLead)
    };
    this.shiftSelection = function(a) {
      if(this.isEmpty()) {
        this.moveCursorTo(this.selectionLead.row, this.selectionLead.column + a)
      }else {
        var b = this.getSelectionAnchor(), c = this.getSelectionLead(), e = this.isBackwards();
        if(!e || b.column !== 0) {
          this.setSelectionAnchor(b.row, b.column + a)
        }if(e || c.column !== 0) {
          this.$moveSelection(function() {
            this.moveCursorTo(c.row, c.column + a)
          })
        }
      }
    };
    this.isBackwards = function() {
      var a = this.selectionAnchor || this.selectionLead, b = this.selectionLead;
      return a.row > b.row || a.row == b.row && a.column > b.column
    };
    this.getRange = function() {
      var a = this.selectionAnchor || this.selectionLead, b = this.selectionLead;
      return this.isBackwards() ? f.fromPoints(b, a) : f.fromPoints(a, b)
    };
    this.clearSelection = function() {
      if(this.selectionAnchor) {
        this.selectionAnchor = null;
        this.$dispatchEvent("changeSelection", {})
      }
    };
    this.selectAll = function() {
      var a = this.doc.getLength() - 1;
      this.setSelectionAnchor(a, this.doc.getLine(a).length);
      this.$moveSelection(function() {
        this.moveCursorTo(0, 0)
      })
    };
    this.setSelectionRange = function(a, b) {
      if(b) {
        this.setSelectionAnchor(a.end.row, a.end.column);
        this.selectTo(a.start.row, a.start.column)
      }else {
        this.setSelectionAnchor(a.start.row, a.start.column);
        this.selectTo(a.end.row, a.end.column)
      }
    };
    this.$moveSelection = function(a) {
      var b = false;
      if(!this.selectionAnchor) {
        b = true;
        this.selectionAnchor = this.$clone(this.selectionLead)
      }var c = this.$clone(this.selectionLead);
      a.call(this);
      if(c.row !== this.selectionLead.row || c.column !== this.selectionLead.column) {
        b = true
      }b && this.$dispatchEvent("changeSelection", {})
    };
    this.selectTo = function(a, b) {
      this.$moveSelection(function() {
        this.moveCursorTo(a, b)
      })
    };
    this.selectToPosition = function(a) {
      this.$moveSelection(function() {
        this.moveCursorToPosition(a)
      })
    };
    this.selectUp = function() {
      this.$moveSelection(this.moveCursorUp)
    };
    this.selectDown = function() {
      this.$moveSelection(this.moveCursorDown)
    };
    this.selectRight = function() {
      this.$moveSelection(this.moveCursorRight)
    };
    this.selectLeft = function() {
      this.$moveSelection(this.moveCursorLeft)
    };
    this.selectLineStart = function() {
      this.$moveSelection(this.moveCursorLineStart)
    };
    this.selectLineEnd = function() {
      this.$moveSelection(this.moveCursorLineEnd)
    };
    this.selectFileEnd = function() {
      this.$moveSelection(this.moveCursorFileEnd)
    };
    this.selectFileStart = function() {
      this.$moveSelection(this.moveCursorFileStart)
    };
    this.selectWordRight = function() {
      this.$moveSelection(this.moveCursorWordRight)
    };
    this.selectWordLeft = function() {
      this.$moveSelection(this.moveCursorWordLeft)
    };
    this.selectWord = function() {
      var a = this.selectionLead;
      this.setSelectionRange(this.doc.getWordRange(a.row, a.column))
    };
    this.selectLine = function() {
      this.setSelectionAnchor(this.selectionLead.row, 0);
      this.$moveSelection(function() {
        this.moveCursorTo(this.selectionLead.row + 1, 0)
      })
    };
    this.moveCursorUp = function() {
      this.moveCursorBy(-1, 0)
    };
    this.moveCursorDown = function() {
      this.moveCursorBy(1, 0)
    };
    this.moveCursorLeft = function() {
      if(this.selectionLead.column == 0) {
        this.selectionLead.row > 0 && this.moveCursorTo(this.selectionLead.row - 1, this.doc.getLine(this.selectionLead.row - 1).length)
      }else {
        this.moveCursorBy(0, -1)
      }
    };
    this.moveCursorRight = function() {
      if(this.selectionLead.column == this.doc.getLine(this.selectionLead.row).length) {
        this.selectionLead.row < this.doc.getLength() - 1 && this.moveCursorTo(this.selectionLead.row + 1, 0)
      }else {
        this.moveCursorBy(0, 1)
      }
    };
    this.moveCursorLineStart = function() {
      var a = this.selectionLead.row, b = this.selectionLead.column, c = this.doc.getLine(a).slice(0, b).match(/^\s*/);
      if(c[0].length == 0) {
        this.moveCursorTo(a, this.doc.getLine(a).match(/^\s*/)[0].length)
      }else {
        c[0].length >= b ? this.moveCursorTo(a, 0) : this.moveCursorTo(a, c[0].length)
      }
    };
    this.moveCursorLineEnd = function() {
      this.moveCursorTo(this.selectionLead.row, this.doc.getLine(this.selectionLead.row).length)
    };
    this.moveCursorFileEnd = function() {
      var a = this.doc.getLength() - 1, b = this.doc.getLine(a).length;
      this.moveCursorTo(a, b)
    };
    this.moveCursorFileStart = function() {
      this.moveCursorTo(0, 0)
    };
    this.moveCursorWordRight = function() {
      var a = this.selectionLead.row, b = this.selectionLead.column, c = this.doc.getLine(a), e = c.substring(b);
      this.doc.nonTokenRe.lastIndex = 0;
      this.doc.tokenRe.lastIndex = 0;
      if(b == c.length) {
        this.moveCursorRight()
      }else {
        if(this.doc.nonTokenRe.exec(e)) {
          b += this.doc.nonTokenRe.lastIndex;
          this.doc.nonTokenRe.lastIndex = 0
        }else {
          if(this.doc.tokenRe.exec(e)) {
            b += this.doc.tokenRe.lastIndex;
            this.doc.tokenRe.lastIndex = 0
          }
        }this.moveCursorTo(a, b)
      }
    };
    this.moveCursorWordLeft = function() {
      var a = this.selectionLead.row, b = this.selectionLead.column, c = this.doc.getLine(a);
      c = h.stringReverse(c.substring(0, b));
      this.doc.nonTokenRe.lastIndex = 0;
      this.doc.tokenRe.lastIndex = 0;
      if(b == 0) {
        this.moveCursorLeft()
      }else {
        if(this.doc.nonTokenRe.exec(c)) {
          b -= this.doc.nonTokenRe.lastIndex;
          this.doc.nonTokenRe.lastIndex = 0
        }else {
          if(this.doc.tokenRe.exec(c)) {
            b -= this.doc.tokenRe.lastIndex;
            this.doc.tokenRe.lastIndex = 0
          }
        }this.moveCursorTo(a, b)
      }
    };
    this.moveCursorBy = function(a, b) {
      this.moveCursorTo(this.selectionLead.row + a, this.selectionLead.column + b)
    };
    this.moveCursorToPosition = function(a) {
      this.moveCursorTo(a.row, a.column)
    };
    this.moveCursorTo = function(a, b) {
      a = this.$clipPositionToDocument(a, b);
      if(a.row !== this.selectionLead.row || a.column !== this.selectionLead.column) {
        this.selectionLead = a;
        this.$dispatchEvent("changeCursor", {data:this.getCursor()})
      }
    };
    this.moveCursorUp = function() {
      this.moveCursorBy(-1, 0)
    };
    this.$clipPositionToDocument = function(a, b) {
      var c = {};
      if(a >= this.doc.getLength()) {
        c.row = Math.max(0, this.doc.getLength() - 1);
        c.column = this.doc.getLine(c.row).length
      }else {
        if(a < 0) {
          c.row = 0;
          c.column = 0
        }else {
          c.row = a;
          c.column = Math.min(this.doc.getLine(c.row).length, Math.max(0, b))
        }
      }return c
    };
    this.$clone = function(a) {
      return{row:a.row, column:a.column}
    }
  }).call(d.prototype);
  return d
});