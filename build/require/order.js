/*
 RequireJS order Copyright (c) 2010, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
(function() {
  function g(a) {
    var b = a.currentTarget || a.srcElement, c, d, e, f;
    if(a.type === "load" || h.test(b.readyState)) {
      d = b.getAttribute("data-requirecontext");
      c = b.getAttribute("data-requiremodule");
      a = require.s.contexts[d];
      e = a.orderWaiting;
      f = a.orderCached;
      f[c] = true;
      for(c = 0;f[e[c]];c++);c > 0 && require(e.splice(0, c), d);
      if(!e.length) {
        a.orderCached = {}
      }setTimeout(function() {
        b.parentNode.removeChild(b)
      }, 15)
    }
  }
  var i = window.opera && Object.prototype.toString.call(window.opera) === "[object Opera]" || "MozAppearance" in document.documentElement.style, h = /^(complete|loaded)$/;
  require.plugin({prefix:"order", require:function() {
  }, newContext:function(a) {
    require.mixin(a, {orderWaiting:[], orderCached:{}})
  }, load:function(a, b) {
    var c = require.s.contexts[b], d = require.nameToUrl(a, null, b);
    require.s.skipAsync[d] = true;
    if(i) {
      require([a], b)
    }else {
      c.orderWaiting.push(a);
      c.loaded[a] = false;
      require.attach(d, b, a, g, "script/cache")
    }
  }, checkDeps:function() {
  }, isWaiting:function(a) {
    return!!a.orderWaiting.length
  }, orderDeps:function() {
  }})
})();