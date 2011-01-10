define(function(a) {
  a("pilot/fixoldbrowsers");
  var b = a("pilot/plugin_manager").catalog, d = a("pilot/plugin_manager").REASONS.APP_STARTUP;
  a("pilot/settings");
  b.registerPlugins(["pilot/index", "cockpit/index"]).then(function() {
    var c = a("pilot/environment").create();
    b.startupPlugins({env:c}, d).then(function() {
      a("demo/startup").launch(c)
    })
  })
});