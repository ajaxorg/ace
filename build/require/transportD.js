require.define = function(c, d) {
  var b, a;
  for(b in c) {
    if(c.hasOwnProperty(b)) {
      a = c[b];
      require.def(b, (a.injects || ["require", "exports", "module"]).concat(d || []), typeof a === "function" ? a : a.factory)
    }
  }
};