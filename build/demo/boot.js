var config = {packagePaths:{"../support/cockpit/lib":[{name:"cockpit", main:"index", lib:"."}], "../support/cockpit/support/pilot/lib":[{name:"pilot", main:"index", lib:"."}]}, paths:{demo:"../demo", ace:"../lib/ace"}}, deps = ["pilot/fixoldbrowsers", "pilot/plugin_manager", "pilot/settings", "pilot/environment", "demo/startup"];
require(config, deps, function() {
  var a = require("pilot/plugin_manager").catalog;
  a.registerPlugins(["pilot/index", "cockpit/index"]).then(function() {
    var b = require("pilot/environment").create();
    a.startupPlugins({env:b}).then(function() {
      require("demo/startup").launch(b)
    })
  })
});