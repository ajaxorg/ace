define(function(d, b) {
  var c = {name:"historyLength", description:"How many typed commands do we recall for reference?", type:"number", defaultValue:50};
  b.startup = function(a) {
    a.env.settings.addSetting(c)
  };
  b.shutdown = function(a) {
    a.env.settings.removeSetting(c)
  }
});