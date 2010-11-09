define(function(k) {
  var m = k("../lib/oop"), n = k("../lib/dom"), o = k("../event_emitter");
  k = function(a) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_text-layer";
    a.appendChild(this.element);
    this.$characterSize = this.$measureSizes();
    this.$pollSizeChanges()
  };
  (function() {
    m.implement(this, o);
    this.EOF_CHAR = "&para;";
    this.EOL_CHAR = "&not;";
    this.TAB_CHAR = "&rarr;";
    this.SPACE_CHAR = "&middot;";
    this.setTokenizer = function(a) {
      this.tokenizer = a
    };
    this.getLineHeight = function() {
      return this.$characterSize.height || 1
    };
    this.getCharacterWidth = function() {
      return this.$characterSize.width || 1
    };
    this.$pollSizeChanges = function() {
      var a = this;
      setInterval(function() {
        var b = a.$measureSizes();
        if(a.$characterSize.width !== b.width || a.$characterSize.height !== b.height) {
          a.$characterSize = b;
          a.$dispatchEvent("changeCharaterSize", {data:b})
        }
      }, 500)
    };
    this.$fontStyles = {fontFamily:1, fontSize:1, fontWeight:1, fontStyle:1, lineHeight:1};
    this.$measureSizes = function() {
      var a = document.createElement("div"), b = a.style;
      b.width = b.height = "auto";
      b.left = b.top = "-1000px";
      b.visibility = "hidden";
      b.position = "absolute";
      b.overflow = "visible";
      for(var e in this.$fontStyles) {
        var f = n.computedStyle(this.element, e);
        b[e] = f
      }a.innerHTML = (new Array(1E3)).join("Xy");
      document.body.insertBefore(a, document.body.firstChild);
      b = {height:a.offsetHeight, width:a.offsetWidth / 2E3};
      document.body.removeChild(a);
      return b
    };
    this.setDocument = function(a) {
      this.doc = a
    };
    this.$showInvisibles = false;
    this.setShowInvisibles = function(a) {
      this.$showInvisibles = a
    };
    this.$computeTabString = function() {
      var a = this.doc.getTabSize();
      if(this.$showInvisibles) {
        a = a / 2;
        this.$tabString = "<span class='ace_invisible'>" + (new Array(Math.floor(a))).join("&nbsp;") + this.TAB_CHAR + (new Array(Math.ceil(a) + 1)).join("&nbsp;") + "</span>"
      }else {
        this.$tabString = (new Array(a + 1)).join("&nbsp;")
      }
    };
    this.updateLines = function(a, b, e) {
      this.$computeTabString();
      var f = Math.max(b, a.firstRow), c = Math.min(e, a.lastRow), d = this.element.childNodes, h = this;
      this.tokenizer.getTokens(f, c, function(i) {
        for(var g = f;g <= c;g++) {
          var j = d[g - a.firstRow];
          if(j) {
            var l = [];
            h.$renderLine(l, g, i[g - f].tokens);
            j.innerHTML = l.join("")
          }
        }
      })
    };
    this.scrollLines = function(a) {
      function b(i) {
        a.firstRow < c.firstRow ? f.$renderLinesFragment(a, a.firstRow, c.firstRow - 1, function(g) {
          d.firstChild ? d.insertBefore(g, d.firstChild) : d.appendChild(g);
          i()
        }) : i()
      }
      function e() {
        a.lastRow > c.lastRow && f.$renderLinesFragment(a, c.lastRow + 1, a.lastRow, function(i) {
          d.appendChild(i)
        })
      }
      var f = this;
      this.$computeTabString();
      var c = this.config;
      this.config = a;
      if(!c || c.lastRow < a.firstRow) {
        return this.update(a)
      }if(a.lastRow < c.firstRow) {
        return this.update(a)
      }var d = this.element;
      if(c.firstRow < a.firstRow) {
        for(var h = c.firstRow;h < a.firstRow;h++) {
          d.removeChild(d.firstChild)
        }
      }if(c.lastRow > a.lastRow) {
        for(h = a.lastRow + 1;h <= c.lastRow;h++) {
          d.removeChild(d.lastChild)
        }
      }b(e)
    };
    this.$renderLinesFragment = function(a, b, e, f) {
      var c = document.createDocumentFragment(), d = this;
      this.tokenizer.getTokens(b, e, function(h) {
        for(var i = b;i <= e;i++) {
          var g = document.createElement("div");
          g.className = "ace_line";
          var j = g.style;
          j.height = d.$characterSize.height + "px";
          j.width = a.width + "px";
          j = [];
          d.$renderLine(j, i, h[i - b].tokens);
          g.innerHTML = j.join("");
          c.appendChild(g)
        }f(c)
      })
    };
    this.update = function(a) {
      this.$computeTabString();
      var b = [], e = this;
      this.tokenizer.getTokens(a.firstRow, a.lastRow, function(f) {
        for(var c = a.firstRow;c <= a.lastRow;c++) {
          b.push("<div class='ace_line' style='height:" + e.$characterSize.height + "px;", "width:", a.width, "px'>");
          e.$renderLine(b, c, f[c - a.firstRow].tokens);
          b.push("</div>")
        }e.element.innerHTML = b.join("")
      })
    };
    this.$textToken = {text:true, rparen:true, lparen:true};
    this.$renderLine = function(a, b, e) {
      for(var f = /[\v\f \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]/g, c = 0;c < e.length;c++) {
        var d = e[c], h = d.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(f, "&nbsp;").replace(/\t/g, this.$tabString);
        if(this.$textToken[d.type]) {
          a.push(h)
        }else {
          d = "ace_" + d.type.replace(/\./g, " ace_");
          a.push("<span class='", d, "'>", h, "</span>")
        }
      }if(this.$showInvisibles) {
        b !== this.doc.getLength() - 1 ? a.push("<span class='ace_invisible'>" + this.EOL_CHAR + "</span>") : a.push("<span class='ace_invisible'>" + this.EOF_CHAR + "</span>")
      }
    }
  }).call(k.prototype);
  return k
});