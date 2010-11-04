/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def("ace/Search", ["ace/lib/lang", "ace/lib/oop", "ace/Range"], function(o, q, r) {
  var l = function() {
    this.$options = {needle:"", backwards:false, wrap:false, caseSensitive:false, wholeWord:false, scope:l.ALL, regExp:false}
  };
  l.ALL = 1;
  l.SELECTION = 2;
  (function() {
    this.set = function(a) {
      q.mixin(this.$options, a);
      return this
    };
    this.getOptions = function() {
      return o.copyObject(this.$options)
    };
    this.find = function(a) {
      if(!this.$options.needle) {
        return null
      }var b = null;
      (this.$options.backwards ? this.$backwardMatchIterator(a) : this.$forwardMatchIterator(a)).forEach(function(c) {
        b = c;
        return true
      });
      return b
    };
    this.findAll = function(a) {
      if(!this.$options.needle) {
        return[]
      }var b = [];
      (this.$options.backwards ? this.$backwardMatchIterator(a) : this.$forwardMatchIterator(a)).forEach(function(c) {
        b.push(c)
      });
      return b
    };
    this.replace = function(a, b) {
      var c = this.$assembleRegExp(), g = c.exec(a);
      return g && g[0].length == a.length ? this.$options.regExp ? a.replace(c, b) : b : null
    };
    this.$forwardMatchIterator = function(a) {
      var b = this.$assembleRegExp(), c = this;
      return{forEach:function(g) {
        c.$forwardLineIterator(a).forEach(function(d, i, k) {
          if(i) {
            d = d.substring(i)
          }var j = [];
          d.replace(b, function(e) {
            j.push({str:e, offset:i + arguments[arguments.length - 2]});
            return e
          });
          for(d = 0;d < j.length;d++) {
            var h = j[d];
            h = c.$rangeFromMatch(k, h.offset, h.str.length);
            if(g(h)) {
              return true
            }
          }
        })
      }}
    };
    this.$backwardMatchIterator = function(a) {
      var b = this.$assembleRegExp(), c = this;
      return{forEach:function(g) {
        c.$backwardLineIterator(a).forEach(function(d, i, k) {
          if(i) {
            d = d.substring(i)
          }var j = [];
          d.replace(b, function(e, f) {
            j.push({str:e, offset:i + f});
            return e
          });
          for(d = j.length - 1;d >= 0;d--) {
            var h = j[d];
            h = c.$rangeFromMatch(k, h.offset, h.str.length);
            if(g(h)) {
              return true
            }
          }
        })
      }}
    };
    this.$rangeFromMatch = function(a, b, c) {
      return new r(a, b, a, b + c)
    };
    this.$assembleRegExp = function() {
      var a = this.$options.regExp ? this.$options.needle : o.escapeRegExp(this.$options.needle);
      if(this.$options.wholeWord) {
        a = "\\b" + a + "\\b"
      }var b = "g";
      this.$options.caseSensitive || (b += "i");
      return new RegExp(a, b)
    };
    this.$forwardLineIterator = function(a) {
      function b(e) {
        var f = a.getLine(e);
        if(c && e == g.end.row) {
          f = f.substring(0, g.end.column)
        }return f
      }
      var c = this.$options.scope == l.SELECTION, g = a.getSelection().getRange(), d = a.getSelection().getCursor(), i = c ? g.start.row : 0, k = c ? g.start.column : 0, j = c ? g.end.row : a.getLength() - 1, h = this.$options.wrap;
      return{forEach:function(e) {
        for(var f = d.row, m = b(f), n = d.column, p = false;!e(m, n, f);) {
          if(p) {
            return
          }f++;
          n = 0;
          if(f > j) {
            if(h) {
              f = i;
              n = k
            }else {
              return
            }
          }if(f == d.row) {
            p = true
          }m = b(f)
        }
      }}
    };
    this.$backwardLineIterator = function(a) {
      var b = this.$options.scope == l.SELECTION, c = a.getSelection().getRange(), g = b ? c.end : c.start, d = b ? c.start.row : 0, i = b ? c.start.column : 0, k = b ? c.end.row : a.getLength() - 1, j = this.$options.wrap;
      return{forEach:function(h) {
        for(var e = g.row, f = a.getLine(e).substring(0, g.column), m = 0, n = false;!h(f, m, e);) {
          if(n) {
            return
          }e--;
          m = 0;
          if(e < d) {
            if(j) {
              e = k
            }else {
              return
            }
          }if(e == g.row) {
            n = true
          }f = a.getLine(e);
          if(b) {
            if(e == d) {
              m = i
            }else {
              if(e == k) {
                f = f.substring(0, c.end.column)
              }
            }
          }
        }
      }}
    }
  }).call(l.prototype);
  return l
});