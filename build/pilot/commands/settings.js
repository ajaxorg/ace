define(function(j, g) {
  var h = {name:"set", params:[{name:"setting", type:"setting", description:"The name of the setting to display or alter", defaultValue:null}, {name:"value", type:"settingValue", description:"The new value for the chosen setting", defaultValue:null}], description:"define and show settings", exec:function(d, a, e) {
    var b;
    if(a.setting) {
      if(a.value === undefined) {
        b = "<strong>" + setting.name + "</strong> = " + setting.get()
      }else {
        a.setting.set(a.value);
        b = "Setting: <strong>" + a.setting.name + "</strong> = " + a.setting.get()
      }
    }else {
      a = d.settings.getSettingNames();
      b = "";
      a.sort(function(c, k) {
        return c.localeCompare(k)
      });
      a.forEach(function(c) {
        c = d.settings.getSetting(c);
        b += '<a class="setting" href="' + ("https://wiki.mozilla.org/Labs/Skywriter/Settings#" + c.name) + '" title="View external documentation on setting: ' + c.name + '" target="_blank">' + c.name + "</a> = " + c.value + "<br/>"
      })
    }e.done(b)
  }}, i = {name:"unset", params:[{name:"setting", type:"setting", description:"The name of the setting to return to defaults"}], description:"unset a setting entirely", exec:function(d, a, e) {
    var b = d.settings.get(a.setting);
    if(b) {
      b.reset();
      e.done("Reset " + b.name + " to default: " + d.settings.get(a.setting))
    }else {
      e.doneWithError("No setting with the name <strong>" + a.setting + "</strong>.")
    }
  }}, f = j("pilot/canon");
  g.startup = function() {
    f.addCommand(h);
    f.addCommand(i)
  };
  g.shutdown = function() {
    f.removeCommand(h);
    f.removeCommand(i)
  }
});