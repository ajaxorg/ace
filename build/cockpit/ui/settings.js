define(function(b, c) {
  var d = b("pilot/types"), e = new (b("pilot/types/basic").SelectionType)({name:"direction", data:["above", "below"]}), f = {name:"hintDirection", description:"Are hints shown above or below the command line?", type:"direction", defaultValue:"above"}, g = {name:"outputDirection", description:"Is the output window shown above or below the command line?", type:"direction", defaultValue:"above"}, h = {name:"outputHeight", description:"What height should the output panel be?", type:"number", defaultValue:300};
  c.startup = function(a) {
    d.registerType(e);
    a.env.settings.addSetting(f);
    a.env.settings.addSetting(g);
    a.env.settings.addSetting(h)
  };
  c.shutdown = function(a) {
    d.unregisterType(e);
    a.env.settings.removeSetting(f);
    a.env.settings.removeSetting(g);
    a.env.settings.removeSetting(h)
  }
});