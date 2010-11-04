/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def("ace/BackgroundTokenizer", ["ace/lib/oop", "ace/MEventEmitter"], function(i, j) {
  var h = function(a, c) {
    this.running = false;
    this.textLines = [];
    this.lines = [];
    this.currentLine = 0;
    this.tokenizer = a;
    var b = this;
    this.$worker = function() {
      if(b.running) {
        for(var e = new Date, f = b.currentLine, d = b.textLines, g = 0, k = c.getLastVisibleRow();b.currentLine < d.length;) {
          b.lines[b.currentLine] = b.$tokenizeRows(b.currentLine, b.currentLine)[0];
          b.currentLine++;
          g += 1;
          if(g % 5 == 0 && new Date - e > 20) {
            b.fireUpdateEvent(f, b.currentLine - 1);
            b.running = setTimeout(b.$worker, b.currentLine < k ? 20 : 100);
            return
          }
        }b.running = false;
        b.fireUpdateEvent(f, d.length - 1)
      }
    }
  };
  (function() {
    i.implement(this, j);
    this.setTokenizer = function(a) {
      this.tokenizer = a;
      this.lines = [];
      this.start(0)
    };
    this.setLines = function(a) {
      this.textLines = a;
      this.lines = [];
      this.stop()
    };
    this.fireUpdateEvent = function(a, c) {
      this.$dispatchEvent("update", {data:{first:a, last:c}})
    };
    this.start = function(a) {
      this.currentLine = Math.min(a || 0, this.currentLine, this.textLines.length);
      this.lines.splice(this.currentLine, this.lines.length);
      this.stop();
      this.running = setTimeout(this.$worker, 700)
    };
    this.stop = function() {
      this.running && clearTimeout(this.running);
      this.running = false
    };
    this.getTokens = function(a, c, b) {
      b(this.$tokenizeRows(a, c))
    };
    this.getState = function(a, c) {
      c(this.$tokenizeRows(a, a)[0].state)
    };
    this.$tokenizeRows = function(a, c) {
      var b = [], e = "start", f = false;
      if(a > 0 && this.lines[a - 1]) {
        e = this.lines[a - 1].state;
        f = true
      }for(a = a;a <= c;a++) {
        if(this.lines[a]) {
          d = this.lines[a];
          e = d.state;
          b.push(d)
        }else {
          var d = this.tokenizer.getLineTokens(this.textLines[a] || "", e);
          e = d.state;
          b.push(d);
          if(f) {
            this.lines[a] = d
          }
        }
      }return b
    }
  }).call(h.prototype);
  return h
});