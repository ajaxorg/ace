/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
if(!require.def) {
  require.def = require("requireJS-node")(module, require)
}require.def("ace/lib/core", function() {
  var a = {}, d = (navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase();
  a.isWin = d == "win";
  a.isMac = d == "mac";
  a.isLinux = d == "linux";
  a.isIE = !+"\u000b1";
  a.isGecko = window.controllers && window.navigator.product === "Gecko";
  a.provide = function(b) {
    b = b.split(".");
    for(var c = window, e = 0;e < b.length;e++) {
      var f = b[e];
      c[f] || (c[f] = {});
      c = c[f]
    }
  };
  return a
});