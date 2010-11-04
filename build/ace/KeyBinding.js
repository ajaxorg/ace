/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def("ace/KeyBinding", ["ace/lib/core", "ace/lib/event", "ace/conf/keybindings/default_mac", "ace/conf/keybindings/default_win", "ace/PluginManager", "ace/commands/DefaultCommands"], function(m, k, n, o, p) {
  var l = function(i, g, j) {
    this.setConfig(j);
    var a = this;
    k.addKeyListener(i, function(b) {
      var c = (a.config.reverse[0 | (b.ctrlKey ? 1 : 0) | (b.altKey ? 2 : 0) | (b.shiftKey ? 4 : 0) | (b.metaKey ? 8 : 0)] || {})[(a.keyNames[b.keyCode] || String.fromCharCode(b.keyCode)).toLowerCase()];
      if(c = p.commands[c]) {
        c(g, g.getSelection());
        return k.stopEvent(b)
      }
    })
  };
  (function() {
    function i(a, b, c, e) {
      return(e && a.toLowerCase() || a).replace(/(?:^\s+|\n|\s+$)/g, "").split(new RegExp("[\\s ]*" + b + "[\\s ]*", "g"), c || 999)
    }
    function g(a, b, c) {
      var e, f = 0;
      a = i(a, "\\-", null, true);
      for(var d = 0, h = a.length;d < h;++d) {
        if(this.keyMods[a[d]]) {
          f |= this.keyMods[a[d]]
        }else {
          e = a[d] || "-"
        }
      }(c[f] || (c[f] = {}))[e] = b;
      return c
    }
    function j(a, b) {
      var c, e, f, d, h = {};
      for(c in a) {
        d = a[c];
        if(b && typeof d == "string") {
          d = d.split(b);
          e = 0;
          for(f = d.length;e < f;++e) {
            g.call(this, d[e], c, h)
          }
        }else {
          g.call(this, d, c, h)
        }
      }return h
    }
    this.keyMods = {ctrl:1, alt:2, option:2, shift:4, meta:8, command:8};
    this.keyNames = {"8":"Backspace", "9":"Tab", "13":"Enter", "27":"Esc", "32":"Space", "33":"PageUp", "34":"PageDown", "35":"End", "36":"Home", "37":"Left", "38":"Up", "39":"Right", "40":"Down", "45":"Insert", "46":"Delete", "107":"+", "112":"F1", "113":"F2", "114":"F3", "115":"F4", "116":"F5", "117":"F6", "118":"F7", "119":"F8", "120":"F9", "121":"F10", "122":"F11", "123":"F12"};
    this.setConfig = function(a) {
      this.config = a || (m.isMac ? n : o);
      if(typeof this.config.reverse == "undefined") {
        this.config.reverse = j.call(this, this.config, "|")
      }
    }
  }).call(l.prototype);
  return l
});