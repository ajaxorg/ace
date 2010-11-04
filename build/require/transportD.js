/*
 RequireJS transportD Copyright (c) 2010, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
require.define = function(c, d) {
  var b, a;
  for(b in c) {
    if(c.hasOwnProperty(b)) {
      a = c[b];
      require.def(b, (a.injects || ["require", "exports", "module"]).concat(d || []), typeof a === "function" ? a : a.factory)
    }
  }
};