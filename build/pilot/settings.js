define(function(d, e) {
  function f(a, b) {
    this._settings = b;
    Object.keys(a).forEach(function(c) {
      this[c] = a[c]
    }, this);
    this.type = k.getType(this.type);
    if(this.type == null) {
      throw new Error("In " + this.name + ": can't find type for: " + JSON.stringify(a.type));
    }if(!this.name) {
      throw new Error("Setting.name == undefined. Ignoring.", this);
    }if(!this.defaultValue === undefined) {
      throw new Error("Setting.defaultValue == undefined", this);
    }this.value = this.defaultValue
  }
  function g(a) {
    this._deactivated = {};
    this._settings = {};
    this._settingNames = [];
    a && this.setPersister(a)
  }
  function h() {
  }
  var l = d("pilot/console"), m = d("pilot/oop"), k = d("pilot/types"), n = d("pilot/event_emitter").EventEmitter, i = d("pilot/catalog"), j = {name:"setting", description:"A setting is something that the application offers as a way to customize how it works", register:"env.settings.addSetting", indexOn:"name"};
  e.startup = function() {
    i.addExtensionSpec(j)
  };
  e.shutdown = function() {
    i.removeExtensionSpec(j)
  };
  f.prototype = {get:function() {
    return this.value
  }, set:function(a) {
    if(this.value !== a) {
      this.value = a;
      this._settings.persister && this._settings.persister.persistValue(this._settings, this.name, a);
      this._dispatchEvent("change", {setting:this, value:a})
    }
  }, resetValue:function() {
    this.set(this.defaultValue)
  }};
  m.implement(f.prototype, n);
  g.prototype = {addSetting:function(a) {
    a = new f(a, this);
    this._settings[a.name] = a;
    this._settingNames.push(a.name);
    this._settingNames.sort()
  }, removeSetting:function(a) {
    a = typeof a === "string" ? a : a.name;
    delete this._settings[a];
    util.arrayRemove(this._settingNames, a)
  }, getSettingNames:function() {
    return this._settingNames
  }, getSetting:function(a) {
    return this._settings[a]
  }, setPersister:function(a) {
    (this._persister = a) && a.loadInitialValues(this)
  }, resetAll:function() {
    this.getSettingNames().forEach(function(a) {
      this.resetValue(a)
    }, this)
  }, _list:function() {
    var a = [];
    this.getSettingNames().forEach(function(b) {
      a.push({key:b, value:this.getSetting(b).get()})
    }, this);
    return a
  }, _loadDefaultValues:function() {
    this._loadFromObject(this._getDefaultValues())
  }, _loadFromObject:function(a) {
    for(var b in a) {
      if(a.hasOwnProperty(b)) {
        var c = this._settings[b];
        if(c) {
          c = c.type.parse(a[b]);
          this.set(b, c)
        }else {
          this.set(b, a[b])
        }
      }
    }
  }, _saveToObject:function() {
    return this.getSettingNames().map(function(a) {
      return this._settings[a].type.stringify(this.get(a))
    }.bind(this))
  }, _getDefaultValues:function() {
    return this.getSettingNames().map(function(a) {
      return this._settings[a].spec.defaultValue
    }.bind(this))
  }};
  e.settings = new g;
  h.prototype = {loadInitialValues:function(a) {
    a._loadDefaultValues();
    var b = cookie.get("settings");
    a._loadFromObject(JSON.parse(b))
  }, persistValue:function(a) {
    try {
      var b = JSON.stringify(a._saveToObject());
      cookie.set("settings", b)
    }catch(c) {
      l.error("Unable to JSONify the settings! " + c)
    }
  }};
  e.CookiePersister = h
});