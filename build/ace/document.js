define(function(g) {
  var l = g("./lib/oop"), j = g("./lib/lang"), m = g("./event_emitter"), n = g("./selection"), o = g("./mode/text"), h = g("./range");
  g = function(a, b) {
    this.modified = true;
    this.lines = [];
    this.selection = new n(this);
    this.$breakpoints = [];
    this.listeners = [];
    b && this.setMode(b);
    j.isArray(a) ? this.$insertLines(0, a) : this.$insert({row:0, column:0}, a)
  };
  (function() {
    l.implement(this, m);
    this.$undoManager = null;
    this.$split = function(a) {
      return a.split(/\r\n|\r|\n/)
    };
    this.setValue = function(a) {
      var b = [0, this.lines.length];
      b.push.apply(b, this.$split(a));
      this.lines.splice.apply(this.lines, b);
      this.modified = true;
      this.fireChangeEvent(0)
    };
    this.toString = function() {
      return this.lines.join(this.$getNewLineCharacter())
    };
    this.getSelection = function() {
      return this.selection
    };
    this.fireChangeEvent = function(a, b) {
      this.$dispatchEvent("change", {data:{firstRow:a, lastRow:b}})
    };
    this.setUndoManager = function(a) {
      this.$undoManager = a;
      this.$deltas = [];
      this.$informUndoManager && this.$informUndoManager.cancel();
      if(a) {
        var b = this;
        this.$informUndoManager = j.deferredCall(function() {
          b.$deltas.length > 0 && a.execute({action:"aceupdate", args:[b.$deltas, b]});
          b.$deltas = []
        })
      }
    };
    this.$defaultUndoManager = {undo:function() {
    }, redo:function() {
    }};
    this.getUndoManager = function() {
      return this.$undoManager || this.$defaultUndoManager
    };
    this.getTabString = function() {
      return this.getUseSoftTabs() ? j.stringRepeat(" ", this.getTabSize()) : "\t"
    };
    this.$useSoftTabs = true;
    this.setUseSoftTabs = function(a) {
      if(this.$useSoftTabs !== a) {
        this.$useSoftTabs = a
      }
    };
    this.getUseSoftTabs = function() {
      return this.$useSoftTabs
    };
    this.$tabSize = 4;
    this.setTabSize = function(a) {
      if(!(isNaN(a) || this.$tabSize === a)) {
        this.modified = true;
        this.$tabSize = a;
        this.$dispatchEvent("changeTabSize")
      }
    };
    this.getTabSize = function() {
      return this.$tabSize
    };
    this.getBreakpoints = function() {
      return this.$breakpoints
    };
    this.setBreakpoints = function(a) {
      this.$breakpoints = [];
      for(var b = 0;b < a.length;b++) {
        this.$breakpoints[a[b]] = true
      }this.$dispatchEvent("changeBreakpoint", {})
    };
    this.clearBreakpoints = function() {
      this.$breakpoints = [];
      this.$dispatchEvent("changeBreakpoint", {})
    };
    this.setBreakpoint = function(a) {
      this.$breakpoints[a] = true;
      this.$dispatchEvent("changeBreakpoint", {})
    };
    this.clearBreakpoint = function(a) {
      delete this.$breakpoints[a];
      this.$dispatchEvent("changeBreakpoint", {})
    };
    this.$detectNewLine = function(a) {
      this.$autoNewLine = (a = a.match(/^.*?(\r?\n)/m)) ? a[1] : "\n"
    };
    this.tokenRe = /^[\w\d]+/g;
    this.nonTokenRe = /^[^\w\d]+/g;
    this.getWordRange = function(a, b) {
      var c = this.getLine(a), d = false;
      if(b > 0) {
        d = !!c.charAt(b - 1).match(this.tokenRe)
      }d || (d = !!c.charAt(b).match(this.tokenRe));
      d = d ? this.tokenRe : this.nonTokenRe;
      var e = b;
      if(e > 0) {
        do {
          e--
        }while(e >= 0 && c.charAt(e).match(d));
        e++
      }for(b = b;b < c.length && c.charAt(b).match(d);) {
        b++
      }return new h(a, e, a, b)
    };
    this.$getNewLineCharacter = function() {
      switch(this.$newLineMode) {
        case "windows":
          return"\r\n";
        case "unix":
          return"\n";
        case "auto":
          return this.$autoNewLine
      }
    };
    this.$autoNewLine = "\n";
    this.$newLineMode = "auto";
    this.setNewLineMode = function(a) {
      if(this.$newLineMode !== a) {
        this.$newLineMode = a
      }
    };
    this.getNewLineMode = function() {
      return this.$newLineMode
    };
    this.$mode = null;
    this.setMode = function(a) {
      if(this.$mode !== a) {
        this.$mode = a;
        this.$dispatchEvent("changeMode")
      }
    };
    this.getMode = function() {
      if(!this.$mode) {
        this.$mode = new o
      }return this.$mode
    };
    this.$scrollTop = 0;
    this.setScrollTopRow = function(a) {
      if(this.$scrollTop !== a) {
        this.$scrollTop = a;
        this.$dispatchEvent("changeScrollTop")
      }
    };
    this.getScrollTopRow = function() {
      return this.$scrollTop
    };
    this.getWidth = function() {
      this.$computeWidth();
      return this.width
    };
    this.getScreenWidth = function() {
      this.$computeWidth();
      return this.screenWith
    };
    this.$computeWidth = function() {
      if(this.modified) {
        this.modified = false;
        for(var a = this.lines, b = 0, c = 0, d = this.getTabSize(), e = 0;e < a.length;e++) {
          var f = a[e].length;
          b = Math.max(b, f);
          a[e].replace("\t", function(i) {
            f += d - 1;
            return i
          });
          c = Math.max(c, f)
        }this.width = b;
        this.screenWith = c
      }
    };
    this.getLine = function(a) {
      return this.lines[a] || ""
    };
    this.getDisplayLine = function(a) {
      var b = (new Array(this.getTabSize() + 1)).join(" ");
      return this.lines[a].replace(/\t/g, b)
    };
    this.getLines = function(a, b) {
      return this.lines.slice(a, b + 1)
    };
    this.getLength = function() {
      return this.lines.length
    };
    this.getTextRange = function(a) {
      if(a.start.row == a.end.row) {
        return this.lines[a.start.row].substring(a.start.column, a.end.column)
      }else {
        var b = [];
        b.push(this.lines[a.start.row].substring(a.start.column));
        b.push.apply(b, this.getLines(a.start.row + 1, a.end.row - 1));
        b.push(this.lines[a.end.row].substring(0, a.end.column));
        return b.join(this.$getNewLineCharacter())
      }
    };
    this.findMatchingBracket = function(a) {
      if(a.column == 0) {
        return null
      }var b = this.getLine(a.row).charAt(a.column - 1);
      if(b == "") {
        return null
      }b = b.match(/([\(\[\{])|([\)\]\}])/);
      if(!b) {
        return null
      }return b[1] ? this.$findClosingBracket(b[1], a) : this.$findOpeningBracket(b[2], a)
    };
    this.$brackets = {")":"(", "(":")", "]":"[", "[":"]", "{":"}", "}":"{"};
    this.$findOpeningBracket = function(a, b) {
      var c = this.$brackets[a], d = b.column - 2;
      b = b.row;
      for(var e = 1, f = this.getLine(b);;) {
        for(;d >= 0;) {
          var i = f.charAt(d);
          if(i == c) {
            e -= 1;
            if(e == 0) {
              return{row:b, column:d}
            }
          }else {
            if(i == a) {
              e += 1
            }
          }d -= 1
        }b -= 1;
        if(b < 0) {
          break
        }f = this.getLine(b);
        d = f.length - 1
      }return null
    };
    this.$findClosingBracket = function(a, b) {
      var c = this.$brackets[a], d = b.column;
      b = b.row;
      for(var e = 1, f = this.getLine(b), i = this.getLength();;) {
        for(;d < f.length;) {
          var k = f.charAt(d);
          if(k == c) {
            e -= 1;
            if(e == 0) {
              return{row:b, column:d}
            }
          }else {
            if(k == a) {
              e += 1
            }
          }d += 1
        }b += 1;
        if(b >= i) {
          break
        }f = this.getLine(b);
        d = 0
      }return null
    };
    this.insert = function(a, b, c) {
      b = this.$insert(a, b, c);
      this.fireChangeEvent(a.row, a.row == b.row ? a.row : undefined);
      return b
    };
    this.$insertLines = function(a, b, c) {
      if(b.length != 0) {
        var d = [a, 0];
        d.push.apply(d, b);
        this.lines.splice.apply(this.lines, d);
        if(!c && this.$undoManager) {
          c = this.$getNewLineCharacter();
          this.$deltas.push({action:"insertText", range:new h(a, 0, a + b.length, 0), text:b.join(c) + c});
          this.$informUndoManager.schedule()
        }
      }
    };
    this.$insert = function(a, b, c) {
      if(b.length == 0) {
        return a
      }this.modified = true;
      this.lines.length <= 1 && this.$detectNewLine(b);
      var d = this.$split(b);
      if(this.$isNewLine(b)) {
        var e = this.lines[a.row] || "";
        this.lines[a.row] = e.substring(0, a.column);
        this.lines.splice(a.row + 1, 0, e.substring(a.column));
        d = {row:a.row + 1, column:0}
      }else {
        if(d.length == 1) {
          e = this.lines[a.row] || "";
          this.lines[a.row] = e.substring(0, a.column) + b + e.substring(a.column);
          d = {row:a.row, column:a.column + b.length}
        }else {
          e = this.lines[a.row] || "";
          var f = e.substring(0, a.column) + d[0];
          e = d[d.length - 1] + e.substring(a.column);
          this.lines[a.row] = f;
          this.$insertLines(a.row + 1, [e], true);
          d.length > 2 && this.$insertLines(a.row + 1, d.slice(1, -1), true);
          d = {row:a.row + d.length - 1, column:d[d.length - 1].length}
        }
      }if(!c && this.$undoManager) {
        this.$deltas.push({action:"insertText", range:h.fromPoints(a, d), text:b});
        this.$informUndoManager.schedule()
      }return d
    };
    this.$isNewLine = function(a) {
      return a == "\r\n" || a == "\r" || a == "\n"
    };
    this.remove = function(a, b) {
      if(a.isEmpty()) {
        return a.start
      }this.$remove(a, b);
      this.fireChangeEvent(a.start.row, a.isMultiLine() ? undefined : a.start.row);
      return a.start
    };
    this.$remove = function(a, b) {
      if(!a.isEmpty()) {
        if(!b && this.$undoManager) {
          this.$getNewLineCharacter();
          this.$deltas.push({action:"removeText", range:a.clone(), text:this.getTextRange(a)});
          this.$informUndoManager.schedule()
        }this.modified = true;
        b = a.start.row;
        var c = a.end.row, d = this.getLine(b).substring(0, a.start.column) + this.getLine(c).substring(a.end.column);
        this.lines.splice(b, c - b + 1, d);
        return a.start
      }
    };
    this.undoChanges = function(a) {
      this.selection.clearSelection();
      for(var b = a.length - 1;b >= 0;b--) {
        var c = a[b];
        if(c.action == "insertText") {
          this.remove(c.range, true);
          this.selection.moveCursorToPosition(c.range.start)
        }else {
          this.insert(c.range.start, c.text, true);
          this.selection.clearSelection()
        }
      }
    };
    this.redoChanges = function(a) {
      this.selection.clearSelection();
      for(var b = 0;b < a.length;b++) {
        var c = a[b];
        if(c.action == "insertText") {
          this.insert(c.range.start, c.text, true);
          this.selection.setSelectionRange(c.range)
        }else {
          this.remove(c.range, true);
          this.selection.moveCursorToPosition(c.range.start)
        }
      }
    };
    this.replace = function(a, b) {
      this.$remove(a);
      b = b ? this.$insert(a.start, b) : a.start;
      var c = a.end.column == 0 ? a.end.column - 1 : a.end.column;
      this.fireChangeEvent(a.start.row, c == b.row ? c : undefined);
      return b
    };
    this.indentRows = function(a, b) {
      b.replace("\t", this.getTabString());
      for(var c = a.start.row;c <= a.end.row;c++) {
        this.$insert({row:c, column:0}, b)
      }this.fireChangeEvent(a.start.row, a.end.row);
      return b.length
    };
    this.outdentRows = function(a) {
      for(var b = new h(0, 0, 0, 0), c = this.getTabSize(), d = a.start.row;d <= a.end.row;++d) {
        var e = this.getLine(d);
        b.start.row = d;
        b.end.row = d;
        for(var f = 0;f < c;++f) {
          if(e.charAt(f) != " ") {
            break
          }
        }if(f < c && e.charAt(f) == "\t") {
          b.start.column = f;
          b.end.column = f + 1
        }else {
          b.start.column = 0;
          b.end.column = f
        }if(d == a.start.row) {
          a.start.column -= b.end.column - b.start.column
        }if(d == a.end.row) {
          a.end.column -= b.end.column - b.start.column
        }this.$remove(b)
      }this.fireChangeEvent(a.start.row, a.end.row);
      return a
    };
    this.moveLinesUp = function(a, b) {
      if(a <= 0) {
        return 0
      }var c = this.lines.slice(a, b + 1);
      this.$remove(new h(a, 0, b + 1, 0));
      this.$insertLines(a - 1, c);
      this.fireChangeEvent(a - 1, b);
      return-1
    };
    this.moveLinesDown = function(a, b) {
      if(b >= this.lines.length - 1) {
        return 0
      }var c = this.lines.slice(a, b + 1);
      this.$remove(new h(a, 0, b + 1, 0));
      this.$insertLines(a + 1, c);
      this.fireChangeEvent(a, b + 1);
      return 1
    };
    this.duplicateLines = function(a, b) {
      a = this.$clipRowToDocument(a);
      b = this.$clipRowToDocument(b);
      var c = this.getLines(a, b);
      this.$insertLines(a, c);
      b = b - a + 1;
      this.fireChangeEvent(a);
      return b
    };
    this.$clipRowToDocument = function(a) {
      return Math.max(0, Math.min(a, this.lines.length - 1))
    };
    this.documentToScreenColumn = function(a, b) {
      var c = this.getTabSize(), d = 0;
      b = b;
      a = this.getLine(a).split("\t");
      for(var e = 0;e < a.length;e++) {
        var f = a[e].length;
        if(b > f) {
          b -= f + 1;
          d += f + c
        }else {
          d += b;
          break
        }
      }return d
    };
    this.screenToDocumentColumn = function(a, b) {
      var c = this.getTabSize(), d = 0;
      b = b;
      a = this.getLine(a).split("\t");
      for(var e = 0;e < a.length;e++) {
        var f = a[e].length;
        if(b >= f + c) {
          b -= f + c;
          d += f + 1
        }else {
          d += b > f ? f : b;
          break
        }
      }return d
    }
  }).call(g.prototype);
  return g
});