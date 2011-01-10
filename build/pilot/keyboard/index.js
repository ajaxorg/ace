define(function(m, f) {
  require("pilot/console");
  require("pilot/stacktrace");
  var o = require("pilot/keyboard/keyutil"), p = require("canon/history"), q = require("canon/request").Request, r = require("environment").env;
  f.keymappings = {};
  f.addKeymapping = function(a) {
    f.keymappings[a.name] = a
  };
  f.removeKeymapping = function(a) {
    delete f.keymapping[a]
  };
  f.startup = function(a) {
    a.env.settings.settingChange.add({match:"customKeymapping", ref:f.keyboardManager, func:f.keyboardManager._customKeymappingChanged.bind(f.keyboardManager)})
  };
  f.shutdown = function(a) {
    a.env.settings.settingChange.remove(f.keyboardManager)
  };
  f.buildFlags = function(a) {
    a.context = r.contexts[0];
    return a
  };
  m = function() {
  };
  m.prototype = {_customKeymappingCache:{states:{}}, processKeyEvent:function(a, b, c) {
    a = o.commandCodes(a, true)[0];
    if(util.none(a)) {
      return false
    }f.buildFlags(c);
    c.isCommandKey = true;
    return this._matchCommand(a, b, c)
  }, _matchCommand:function(a, b, c) {
    var d = this._findCommandExtension(a, b, c);
    if(d && d.commandExt !== "no command") {
      c.isTextView && b.resetKeyBuffers();
      var e = d.commandExt;
      e.load(function(h) {
        h = new q({command:h, commandExt:e});
        p.execute(d.args, h)
      });
      return true
    }return d && d.commandExt === "no command" ? true : false
  }, _buildBindingsRegex:function(a) {
    a.forEach(function(b) {
      if(util.none(b.key)) {
        if(Array.isArray(b.regex)) {
          b.key = new RegExp("^" + b.regex[1] + "$");
          b.regex = new RegExp(b.regex.join("") + "$")
        }else {
          b.regex = new RegExp(b.regex + "$")
        }
      }else {
        b.key = new RegExp("^" + b.key + "$")
      }
    })
  }, _buildKeymappingRegex:function(a) {
    for(state in a.states) {
      this._buildBindingsRegex(a.states[state])
    }a._convertedRegExp = true
  }, _findCommandExtension:function(a, b, c) {
    if(c.isTextView) {
      var d = b._keyState;
      if(!c.isCommandKey || a.indexOf("alt_") === -1) {
        b._keyBuffer += a.replace(/ctrl_meta|meta/, "ctrl");
        b._keyMetaBuffer += a
      }var e = [this._customKeymappingCache];
      e = e.concat(catalog.getExtensions("keymapping"));
      for(var h = 0;h < e.length;h++) {
        if(!util.none(e[h].states[d])) {
          util.none(e[h]._convertedRegExp) && this._buildKeymappingRegex(e[h]);
          var k = this._bindingsMatch(a, c, b, e[h]);
          if(!util.none(k)) {
            return k
          }
        }
      }
    }b = catalog.getExtensions("command");
    var i = null;
    d = {};
    a = a.replace(/ctrl_meta|meta/, "ctrl");
    b.some(function(g) {
      if(this._commandMatches(g, a, c)) {
        i = g;
        return true
      }return false
    }.bind(this));
    return util.none(i) ? null : {commandExt:i, args:d}
  }, _bindingsMatch:function(a, b, c, d) {
    var e, h = null, k = {}, i;
    i = util.none(d.hasMetaKey) ? c._keyMetaBuffer : c._keyBuffer;
    if(a.indexOf("alt_") === 0 && b.isCommandKey) {
      i += a
    }d.states[c._keyState].some(function(g) {
      if(g.key && !g.key.test(a)) {
        return false
      }if(g.regex && !(e = g.regex.exec(i))) {
        return false
      }if(g.disallowMatches) {
        for(var n = 0;n < g.disallowMatches.length;n++) {
          if(e[g.disallowMatches[n]]) {
            return true
          }
        }
      }if(!f.flagsMatch(g.predicates, b)) {
        return false
      }if(g.exec) {
        h = catalog.getExtensionByKey("command", g.exec);
        if(util.none(h)) {
          throw new Error("Can't find command " + g.exec + " in state=" + c._keyState + ", symbolicName=" + a);
        }if(g.params) {
          var l;
          g.params.forEach(function(j) {
            l = !util.none(j.match) && !util.none(e) ? e[j.match] || j.defaultValue : j.defaultValue;
            if(j.type === "number") {
              l = parseInt(l, 10)
            }k[j.name] = l
          })
        }c.resetKeyBuffers()
      }if(g.then) {
        c._keyState = g.then;
        c.resetKeyBuffers()
      }if(util.none(h)) {
        h = "no command"
      }return true
    });
    if(util.none(h)) {
      return null
    }return{commandExt:h, args:k}
  }, _commandMatches:function(a, b, c) {
    var d = a.key;
    if(!d) {
      return false
    }if(!f.flagsMatch(a.predicates, c)) {
      return false
    }if(typeof d === "string") {
      if(d != b) {
        return false
      }return true
    }if(!Array.isArray(d)) {
      d = [d];
      a.key = d
    }for(a = 0;a < d.length;a++) {
      var e = d[a];
      if(typeof e === "string") {
        if(e == b) {
          return true
        }
      }else {
        if(e.key == b) {
          return f.flagsMatch(e.predicates, c)
        }
      }
    }return false
  }, _customKeymappingChanged:function(a, b) {
    a = this._customKeymappingCache = JSON.parse(b);
    a.states = a.states || {};
    for(state in a.states) {
      this._buildBindingsRegex(a.states[state])
    }a._convertedRegExp = true
  }};
  f.flagsMatch = function(a, b) {
    if(util.none(a)) {
      return true
    }if(!b) {
      return false
    }for(var c in a) {
      if(b[c] !== a[c]) {
        return false
      }
    }return true
  };
  f.keyboardManager = new m
});