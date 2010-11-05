/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def("ace/PluginManager", [], function() {
  return{commands:{}, registerCommand:function(a, b) {
    this.commands[a] = b
  }}
});