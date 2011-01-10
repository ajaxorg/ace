define(function(e, n) {
  var j = e("pilot/useragent"), m = e("pilot/event"), o = e("ace/conf/keybindings/default_mac").bindings, p = e("ace/conf/keybindings/default_win").bindings, q = e("pilot/canon");
  e("ace/commands/default_commands");
  e = function(k, i, l) {
    this.setConfig(l);
    var b = this;
    m.addKeyListener(k, function(a) {
      var d = (b.config.reverse[j.isOpera && j.isMac ? 0 | (a.metaKey ? 1 : 0) | (a.altKey ? 2 : 0) | (a.shiftKey ? 4 : 0) | (a.ctrlKey ? 8 : 0) : 0 | (a.ctrlKey ? 1 : 0) | (a.altKey ? 2 : 0) | (a.shiftKey ? 4 : 0) | (a.metaKey ? 8 : 0)] || {})[(b.keyNames[a.keyCode] || String.fromCharCode(a.keyCode)).toLowerCase()];
      if(q.exec(d, {editor:i})) {
        return m.stopEvent(a)
      }
    })
  };
  (function() {
    function k(b, a, d, f) {
      return(f && b.toLowerCase() || b).replace(/(?:^\s+|\n|\s+$)/g, "").split(new RegExp("[\\s ]*" + a + "[\\s ]*", "g"), d || 999)
    }
    function i(b, a, d) {
      var f, g = 0;
      b = k(b, "\\-", null, true);
      for(var c = 0, h = b.length;c < h;++c) {
        if(this.keyMods[b[c]]) {
          g |= this.keyMods[b[c]]
        }else {
          f = b[c] || "-"
        }
      }(d[g] || (d[g] = {}))[f] = a;
      return d
    }
    function l(b, a) {
      var d, f, g, c, h = {};
      for(d in b) {
        c = b[d];
        if(a && typeof c == "string") {
          c = c.split(a);
          f = 0;
          for(g = c.length;f < g;++f) {
            i.call(this, c[f], d, h)
          }
        }else {
          i.call(this, c, d, h)
        }
      }return h
    }
    this.keyMods = {ctrl:1, alt:2, option:2, shift:4, meta:8, command:8};
    this.keyNames = {"8":"Backspace", "9":"Tab", "13":"Enter", "27":"Esc", "32":"Space", "33":"PageUp", "34":"PageDown", "35":"End", "36":"Home", "37":"Left", "38":"Up", "39":"Right", "40":"Down", "45":"Insert", "46":"Delete", "107":"+", "112":"F1", "113":"F2", "114":"F3", "115":"F4", "116":"F5", "117":"F6", "118":"F7", "119":"F8", "120":"F9", "121":"F10", "122":"F11", "123":"F12"};
    this.setConfig = function(b) {
      this.config = b || (j.isMac ? o : p);
      if(typeof this.config.reverse == "undefined") {
        this.config.reverse = l.call(this, this.config, "|")
      }
    }
  }).call(e.prototype);
  n.KeyBinding = e
});