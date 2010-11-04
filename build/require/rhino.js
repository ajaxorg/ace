/*
 RequireJS rhino Copyright (c) 2010, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
require.load = function(b, a) {
  var c = require.nameToUrl(b, null, a);
  a = require.s.contexts[a];
  require.s.isDone = false;
  a.loaded[b] = false;
  load(c);
  require.completeLoad(b, a)
};