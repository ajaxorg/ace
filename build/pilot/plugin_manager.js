define(function(f, e) {
  var g = f("pilot/promise").Promise;
  e.REASONS = {APP_STARTUP:1, APP_SHUTDOWN:2, PLUGIN_ENABLE:3, PLUGIN_DISABLE:4, PLUGIN_INSTALL:5, PLUGIN_UNINSTALL:6, PLUGIN_UPGRADE:7, PLUGIN_DOWNGRADE:8};
  e.Plugin = function(b) {
    this.name = b;
    this.status = this.INSTALLED
  };
  e.Plugin.prototype = {NEW:0, INSTALLED:1, REGISTERED:2, STARTED:3, UNREGISTERED:4, SHUTDOWN:5, install:function(b, d) {
    var a = new g;
    if(this.status > this.NEW) {
      a.resolve(this);
      return a
    }f([this.name], function(c) {
      c.install && c.install(b, d);
      this.status = this.INSTALLED;
      a.resolve(this)
    }.bind(this));
    return a
  }, register:function(b, d) {
    var a = new g;
    if(this.status != this.INSTALLED) {
      a.resolve(this);
      return a
    }f([this.name], function(c) {
      c.register && c.register(b, d);
      this.status = this.REGISTERED;
      a.resolve(this)
    }.bind(this));
    return a
  }, startup:function(b, d) {
    var a = new g;
    if(this.status != this.REGISTERED) {
      a.resolve(this);
      return a
    }f([this.name], function(c) {
      c.startup && c.startup(b, d);
      this.status = this.STARTED;
      a.resolve(this)
    }.bind(this));
    return a
  }, shutdown:function(b, d) {
    if(this.status == this.STARTED) {
      pluginModule = f(this.name);
      pluginModule.shutdown && pluginModule.shutdown(b, d)
    }
  }};
  e.PluginCatalog = function() {
    this.plugins = {}
  };
  e.PluginCatalog.prototype = {registerPlugins:function(b, d, a) {
    var c = [];
    b.forEach(function(i) {
      var h = this.plugins[i];
      if(h === undefined) {
        h = new e.Plugin(i);
        this.plugins[i] = h;
        c.push(h.register(d, a))
      }
    }.bind(this));
    return g.group(c)
  }, startupPlugins:function(b, d) {
    var a = [];
    for(var c in this.plugins) {
      a.push(this.plugins[c].startup(b, d))
    }return g.group(a)
  }};
  e.catalog = new e.PluginCatalog
});