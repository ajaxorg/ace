define(function(e) {
  var m = e("./lib/core"), l = e("./lib/event"), n = e("./conf/keybindings/default_mac"), o = e("./conf/keybindings/default_win"), p = e("./plugin_manager");
  e("./commands/default_commands");
  e = function(j, h, k) {
    this.setConfig(k);
    var a = this;
    l.addKeyListener(j, function(b) {
      var c = (a.config.reverse[0 | (b.ctrlKey ? 1 : 0) | (b.altKey ? 2 : 0) | (b.shiftKey ? 4 : 0) | (b.metaKey ? 8 : 0)] || {})[(a.keyNames[b.keyCode] || String.fromCharCode(b.keyCode)).toLowerCase()];
      if(c = p.commands[c]) {
        c(h, h.getSelection());
        return l.stopEvent(b)
      }
    })
  };
  (function() {
    function j(a, b, c, f) {
      return(f && a.toLowerCase() || a).replace(/(?:^\s+|\n|\s+$)/g, "").split(new RegExp("[\\s ]*" + b + "[\\s ]*", "g"), c || 999)
    }
    function h(a, b, c) {
      var f, g = 0;
      a = j(a, "\\-", null, true);
      for(var d = 0, i = a.length;d < i;++d) {
        if(this.keyMods[a[d]]) {
          g |= this.keyMods[a[d]]
        }else {
          f = a[d] || "-"
        }
      }(c[g] || (c[g] = {}))[f] = b;
      return c
    }
    function k(a, b) {
      var c, f, g, d, i = {};
      for(c in a) {
        d = a[c];
        if(b && typeof d == "string") {
          d = d.split(b);
          f = 0;
          for(g = d.length;f < g;++f) {
            h.call(this, d[f], c, i)
          }
        }else {
          h.call(this, d, c, i)
        }
      }return i
    }
    this.keyMods = {ctrl:1, alt:2, option:2, shift:4, meta:8, command:8};
    this.keyNames = {"8":"Backspace", "9":"Tab", "13":"Enter", "27":"Esc", "32":"Space", "33":"PageUp", "34":"PageDown", "35":"End", "36":"Home", "37":"Left", "38":"Up", "39":"Right", "40":"Down", "45":"Insert", "46":"Delete", "107":"+", "112":"F1", "113":"F2", "114":"F3", "115":"F4", "116":"F5", "117":"F6", "118":"F7", "119":"F8", "120":"F9", "121":"F10", "122":"F11", "123":"F12"};
    this.setConfig = function(a) {
      this.config = a || (m.isMac ? n : o);
      if(typeof this.config.reverse == "undefined") {
        this.config.reverse = k.call(this, this.config, "|")
      }
    }
  }).call(e.prototype);
  return e
});