define(function(d, e) {
  var i = d("pilot/types/basic").SelectionType, j = d("pilot/types/basic").DeferredType, b = d("pilot/types"), k = d("pilot/settings").settings, c, g = new i({name:"setting", data:function() {
    return f.settings.getSettingNames()
  }, stringify:function(a) {
    c = a;
    return a.name
  }, fromString:function(a) {
    return c = k.getSetting(a)
  }, noMatch:function() {
    c = null
  }}), h = new j({name:"settingValue", defer:function() {
    return c ? c.type : b.getType("text")
  }}), f;
  e.startup = function(a) {
    f = a.env;
    b.registerType(g);
    b.registerType(h)
  };
  e.shutdown = function() {
    b.unregisterType(g);
    b.unregisterType(h)
  }
});