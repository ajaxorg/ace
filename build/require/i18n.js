/*
 RequireJS i18n Copyright (c) 2010, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
(function() {
  function p(a, c) {
    c = c.nlsWaiting;
    return c[a] || (c[a] = c[c.push({_name:a}) - 1])
  }
  function n(a, c, e, b) {
    var d, i, h, k, j, g, f = "root";
    i = e.split("-");
    h = [];
    k = p(a, b);
    for(d = i.length;d > -1;d--) {
      j = d ? i.slice(0, d).join("-") : "root";
      if(g = c[j]) {
        if(e === b.config.locale && !k._match) {
          k._match = j
        }if(f === "root") {
          f = j
        }k[j] = j;
        if(g === true) {
          g = a.split("/");
          g.splice(-1, 0, j);
          g = g.join("/");
          if(!b.specified[g] && !(g in b.loaded) && !b.defined[g]) {
            b.defPlugin[g] = "i18n";
            h.push(g)
          }
        }
      }
    }if(f !== e) {
      if(b.defined[f]) {
        b.defined[e] = b.defined[f]
      }else {
        k[e] = f
      }
    }h.length && require(h, b.contextName)
  }
  var q = /(^.*(^|\/)nls(\/|$))([^\/]*)\/?([^\/]*)/, r = {};
  require.plugin({prefix:"i18n", require:function(a, c, e, b) {
    var d, i = b.defined[a];
    d = q.exec(a);
    if(d[5]) {
      a = d[1] + d[5];
      c = p(a, b);
      c[d[4]] = d[4];
      c = b.nls[a];
      if(!c) {
        b.defPlugin[a] = "i18n";
        require([a], b.contextName);
        c = b.nls[a] = {}
      }c[d[4]] = e
    }else {
      if(c = b.nls[a]) {
        require.mixin(c, i)
      }else {
        c = b.nls[a] = i
      }b.nlsRootLoaded[a] = true;
      if(d = b.nlsToLoad[a]) {
        delete b.nlsToLoad[a];
        for(e = 0;e < d.length;e++) {
          n(a, c, d[e], b)
        }
      }n(a, c, b.config.locale, b)
    }
  }, newContext:function(a) {
    require.mixin(a, {nlsWaiting:[], nls:{}, nlsRootLoaded:{}, nlsToLoad:{}});
    if(!a.config.locale) {
      a.config.locale = typeof navigator === "undefined" ? "root" : (navigator.language || navigator.userLanguage || "root").toLowerCase()
    }
  }, load:function(a, c) {
    var e = require.s.contexts[c], b;
    b = q.exec(a);
    var d = b[4];
    if(b[5]) {
      a = b[1] + b[5];
      b = e.nls[a];
      if(e.nlsRootLoaded[a] && b) {
        n(a, b, d, e)
      }else {
        (e.nlsToLoad[a] || (e.nlsToLoad[a] = [])).push(d);
        e.defPlugin[a] = "i18n";
        require([a], c)
      }
    }else {
      if(!e.nlsRootLoaded[a]) {
        e.defPlugin[a] = "i18n";
        require.load(a, c)
      }
    }
  }, checkDeps:function() {
  }, isWaiting:function(a) {
    return!!a.nlsWaiting.length
  }, orderDeps:function(a) {
    var c, e, b, d, i, h, k, j, g, f, o, m, s = a.nlsWaiting, l;
    a.nlsWaiting = [];
    a.nlsToLoad = {};
    for(c = 0;d = s[c];c++) {
      b = d._name;
      i = a.nls[b];
      o = null;
      h = b.split("/");
      g = h.slice(0, h.length - 1).join("/");
      k = h[h.length - 1];
      for(f in d) {
        if(f !== "_name" && !(f in r)) {
          if(f === "_match") {
            o = d[f]
          }else {
            if(d[f] !== f) {
              (l || (l = {}))[f] = d[f]
            }else {
              j = {};
              h = f.split("-");
              for(e = h.length;e > 0;e--) {
                m = h.slice(0, e).join("-");
                m !== "root" && i[m] && require.mixin(j, i[m])
              }i.root && require.mixin(j, i.root);
              a.defined[g + "/" + f + "/" + k] = j
            }
          }
        }
      }a.defined[b] = a.defined[g + "/" + o + "/" + k];
      if(l) {
        for(f in l) {
          f in r || (a.defined[g + "/" + f + "/" + k] = a.defined[g + "/" + l[f] + "/" + k])
        }
      }
    }
  }})
})();