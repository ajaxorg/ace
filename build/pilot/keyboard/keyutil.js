define(function(i, e) {
  var h = i("pilot/event"), j = i("pilot/useragent");
  e.KeyHelper = function() {
    var a = {MODIFIER_KEYS:{16:"shift", 17:"ctrl", 18:"alt", 224:"meta"}, FUNCTION_KEYS:{8:"backspace", 9:"tab", 13:"return", 19:"pause", 27:"escape", 33:"pageup", 34:"pagedown", 35:"end", 36:"home", 37:"left", 38:"up", 39:"right", 40:"down", 44:"printscreen", 45:"insert", 46:"delete", 112:"f1", 113:"f2", 114:"f3", 115:"f4", 116:"f5", 117:"f7", 119:"f8", 120:"f9", 121:"f10", 122:"f11", 123:"f12", 144:"numlock", 145:"scrolllock"}, PRINTABLE_KEYS:{32:" ", 48:"0", 49:"1", 50:"2", 51:"3", 52:"4", 53:"5", 
    54:"6", 55:"7", 56:"8", 57:"9", 59:";", 61:"=", 65:"a", 66:"b", 67:"c", 68:"d", 69:"e", 70:"f", 71:"g", 72:"h", 73:"i", 74:"j", 75:"k", 76:"l", 77:"m", 78:"n", 79:"o", 80:"p", 81:"q", 82:"r", 83:"s", 84:"t", 85:"u", 86:"v", 87:"w", 88:"x", 89:"y", 90:"z", 107:"+", 109:"-", 110:".", 188:",", 190:".", 191:"/", 192:"`", 219:"[", 220:"\\", 221:"]", 222:'"'}, PRINTABLE_KEYS_CHARCODE:{}, KEY:{}};
    for(var f in a.PRINTABLE_KEYS) {
      var c = a.PRINTABLE_KEYS[f];
      a.PRINTABLE_KEYS_CHARCODE[c.charCodeAt(0)] = f;
      if(c.toUpperCase() != c) {
        a.PRINTABLE_KEYS_CHARCODE[c.toUpperCase().charCodeAt(0)] = f
      }
    }for(f in a.FUNCTION_KEYS) {
      c = a.FUNCTION_KEYS[f].toUpperCase();
      a.KEY[c] = parseInt(f, 10)
    }return a
  }();
  var m = function(a) {
    return!!(a.altKey || a.ctrlKey || a.metaKey || a.charCode !== a.which && e.KeyHelper.FUNCTION_KEYS[a.which])
  };
  e.commandCodes = function(a, f) {
    var c = a._keyCode || a.keyCode, b = a._charCode === undefined ? a.charCode : a._charCode, d = null, k = null, g = "", l = true;
    if(c === 0 && a.which === 0) {
      return false
    }if(b !== 0) {
      return false
    }if(e.KeyHelper.MODIFIER_KEYS[b]) {
      return[e.KeyHelper.MODIFIER_KEYS[b], null]
    }if(c) {
      d = e.KeyHelper.FUNCTION_KEYS[c];
      if(!d && (a.altKey || a.ctrlKey || a.metaKey)) {
        d = e.KeyHelper.PRINTABLE_KEYS[c];
        if(c > 47 && c < 58) {
          l = a.altKey
        }
      }if(d) {
        if(a.altKey) {
          g += "alt_"
        }if(a.ctrlKey) {
          g += "ctrl_"
        }if(a.metaKey) {
          g += "meta_"
        }
      }else {
        if(a.ctrlKey || a.metaKey) {
          return false
        }
      }
    }if(!d) {
      c = a.which;
      k = d = String.fromCharCode(c);
      c = d.toLowerCase();
      if(a.metaKey) {
        g = "meta_";
        d = c
      }else {
        d = null
      }
    }if(a.shiftKey && d && l) {
      g += "shift_"
    }if(d) {
      d = g + d
    }if(!f && d) {
      d = d.replace(/ctrl_meta|meta/, "ctrl")
    }return[d, k]
  };
  e.addKeyDownListener = function(a, f) {
    var c = function(b) {
      var d = f(b);
      d && h.stopEvent(b);
      return d
    };
    h.addListener(a, "keydown", function(b) {
      if(j.isGecko) {
        if(e.KeyHelper.FUNCTION_KEYS[b.keyCode]) {
          return true
        }else {
          if((b.ctrlKey || b.metaKey) && e.KeyHelper.PRINTABLE_KEYS[b.keyCode]) {
            return true
          }
        }
      }if(m(b)) {
        return c(b)
      }return true
    });
    h.addListener(a, "keypress", function(b) {
      if(j.isGecko) {
        if(e.KeyHelper.FUNCTION_KEYS[b.keyCode]) {
          return c(b)
        }else {
          if((b.ctrlKey || b.metaKey) && e.KeyHelper.PRINTABLE_KEYS_CHARCODE[b.charCode]) {
            b._keyCode = e.KeyHelper.PRINTABLE_KEYS_CHARCODE[b.charCode];
            b._charCode = 0;
            return c(b)
          }
        }
      }if(b.charCode !== undefined && b.charCode === 0) {
        return true
      }return c(b)
    })
  }
});