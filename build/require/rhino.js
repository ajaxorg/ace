require.load = function(b, a) {
  var c = require.nameToUrl(b, null, a);
  a = require.s.contexts[a];
  require.s.isDone = false;
  a.loaded[b] = false;
  load(c);
  require.completeLoad(b, a)
};