define(function(a, c) {
  var d = a("pilot/canon"), g = a("pilot/types/basic").SelectionType, e = a("pilot/types"), f = new g({name:"command", data:function() {
    return d.getCommandNames()
  }, stringify:function(b) {
    return b.name
  }, fromString:function(b) {
    return d.getCommand(b)
  }});
  c.startup = function() {
    e.registerType(f)
  };
  c.shutdown = function() {
    e.unregisterType(f)
  }
});