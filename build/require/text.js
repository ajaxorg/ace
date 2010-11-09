/*
 RequireJS text Copyright (c) 2010, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
(function() {
  var j = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"], l = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, m = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im;
  if(!require.textStrip) {
    require.textStrip = function(a) {
      if(a) {
        a = a.replace(l, "");
        var c = a.match(m);
        if(c) {
          a = c[1]
        }
      }else {
        a = ""
      }return a
    }
  }if(!require.getXhr) {
    require.getXhr = function() {
      var a, c, b;
      if(typeof XMLHttpRequest !== "undefined") {
        return new XMLHttpRequest
      }else {
        for(c = 0;c < 3;c++) {
          b = j[c];
          try {
            a = new ActiveXObject(b)
          }catch(g) {
          }if(a) {
            j = [b];
            break
          }
        }
      }if(!a) {
        throw new Error("require.getXhr(): XMLHttpRequest not available");
      }return a
    }
  }if(!require.fetchText) {
    require.fetchText = function(a, c) {
      var b = require.getXhr();
      b.open("GET", a, true);
      b.onreadystatechange = function() {
        b.readyState === 4 && c(b.responseText)
      };
      b.send(null)
    }
  }require.plugin({prefix:"text", require:function() {
  }, newContext:function(a) {
    require.mixin(a, {text:{}, textWaiting:[]})
  }, load:function(a, c) {
    var b = false, g = null, e, d = a.indexOf("."), k = a.substring(0, d), h = a.substring(d + 1, a.length), f = require.s.contexts[c], i = f.textWaiting;
    d = h.indexOf("!");
    if(d !== -1) {
      b = h.substring(d + 1, h.length);
      h = h.substring(0, d);
      d = b.indexOf("!");
      if(d !== -1 && b.substring(0, d) === "strip") {
        g = b.substring(d + 1, b.length);
        b = "strip"
      }else {
        if(b !== "strip") {
          g = b;
          b = null
        }
      }
    }e = k + "!" + h;
    d = b ? e + "!" + b : e;
    if(g !== null && !f.text[e]) {
      f.defined[a] = f.text[e] = g
    }else {
      if(!f.text[e] && !f.textWaiting[e] && !f.textWaiting[d]) {
        i[d] || (i[d] = i[i.push({name:a, key:e, fullKey:d, strip:!!b}) - 1]);
        c = require.nameToUrl(k, "." + h, c);
        f.loaded[a] = false;
        require.fetchText(c, function(n) {
          f.text[e] = n;
          f.loaded[a] = true
        })
      }
    }
  }, checkDeps:function() {
  }, isWaiting:function(a) {
    return!!a.textWaiting.length
  }, orderDeps:function(a) {
    var c, b, g, e = a.textWaiting;
    a.textWaiting = [];
    for(c = 0;b = e[c];c++) {
      g = a.text[b.key];
      a.defined[b.name] = b.strip ? require.textStrip(g) : g
    }
  }})
})();