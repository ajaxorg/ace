/*
 RequireJS jsonp Copyright (c) 2010, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
(function() {
  var j = 0;
  require._jsonp = {};
  require.plugin({prefix:"jsonp", require:function() {
  }, newContext:function(a) {
    require.mixin(a, {jsonpWaiting:[]})
  }, load:function(a, d) {
    var b = a.indexOf("?"), c = a.substring(0, b);
    b = a.substring(b + 1, a.length);
    var f = require.s.contexts[d], i = {name:a}, g = "f" + j++, h = require.s.head, e = h.ownerDocument.createElement("script");
    require._jsonp[g] = function(k) {
      i.value = k;
      f.loaded[a] = true;
      setTimeout(function() {
        h.removeChild(e);
        delete require._jsonp[g]
      }, 15)
    };
    f.jsonpWaiting.push(i);
    c = require.nameToUrl(c, "?", d);
    c += (c.indexOf("?") === -1 ? "?" : "") + b.replace("?", "require._jsonp." + g);
    f.loaded[a] = false;
    e.type = "text/javascript";
    e.charset = "utf-8";
    e.src = c;
    e.async = true;
    h.appendChild(e)
  }, checkDeps:function() {
  }, isWaiting:function(a) {
    return!!a.jsonpWaiting.length
  }, orderDeps:function(a) {
    var d, b, c = a.jsonpWaiting;
    a.jsonpWaiting = [];
    for(d = 0;b = c[d];d++) {
      a.defined[b.name] = b.value
    }
  }})
})();