define(function(m) {
  var i = m("./core"), c = {};
  c.addListener = function(a, e, d) {
    if(a.addEventListener) {
      return a.addEventListener(e, d, false)
    }if(a.attachEvent) {
      var b = function() {
        d(window.event)
      };
      d.$$wrapper = b;
      a.attachEvent("on" + e, b)
    }
  };
  c.removeListener = function(a, e, d) {
    if(a.removeEventListener) {
      return a.removeEventListener(e, d, false)
    }if(a.detachEvent) {
      a.detachEvent("on" + e, d.$$wrapper || d)
    }
  };
  c.stopEvent = function(a) {
    c.stopPropagation(a);
    c.preventDefault(a);
    return false
  };
  c.stopPropagation = function(a) {
    if(a.stopPropagation) {
      a.stopPropagation()
    }else {
      a.cancelBubble = true
    }
  };
  c.preventDefault = function(a) {
    if(a.preventDefault) {
      a.preventDefault()
    }else {
      a.returnValue = false
    }
  };
  c.getDocumentX = function(a) {
    return a.clientX ? a.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft) : a.pageX
  };
  c.getDocumentY = function(a) {
    return a.clientY ? a.clientY + (document.documentElement.scrollTop || document.body.scrollTop) : a.pageX
  };
  c.getButton = function(a) {
    return a.preventDefault ? a.button : Math.max(a.button - 1, 2)
  };
  c.capture = document.documentElement.setCapture ? function(a, e, d) {
    function b(h) {
      e && e(h);
      d && d();
      c.removeListener(a, "mousemove", e);
      c.removeListener(a, "mouseup", b);
      c.removeListener(a, "losecapture", b);
      a.releaseCapture()
    }
    c.addListener(a, "mousemove", e);
    c.addListener(a, "mouseup", b);
    c.addListener(a, "losecapture", b);
    a.setCapture()
  } : function(a, e, d) {
    function b(f) {
      e(f);
      f.stopPropagation()
    }
    function h(f) {
      e && e(f);
      d && d();
      document.removeEventListener("mousemove", b, true);
      document.removeEventListener("mouseup", h, true);
      f.stopPropagation()
    }
    document.addEventListener("mousemove", b, true);
    document.addEventListener("mouseup", h, true)
  };
  c.addMouseWheelListener = function(a, e) {
    var d = function(b) {
      if(b.wheelDelta !== undefined) {
        if(b.wheelDeltaX !== undefined) {
          b.wheelX = -b.wheelDeltaX / 8;
          b.wheelY = -b.wheelDeltaY / 8
        }else {
          b.wheelX = 0;
          b.wheelY = -b.wheelDelta / 8
        }
      }else {
        if(b.axis && b.axis == b.HORIZONTAL_AXIS) {
          b.wheelX = (b.detail || 0) * 5;
          b.wheelY = 0
        }else {
          b.wheelX = 0;
          b.wheelY = (b.detail || 0) * 5
        }
      }e(b)
    };
    c.addListener(a, "DOMMouseScroll", d);
    c.addListener(a, "mousewheel", d)
  };
  c.addMultiMouseDownListener = function(a, e, d, b, h) {
    var f = 0, j, k, l = function(g) {
      f += 1;
      if(f == 1) {
        j = g.clientX;
        k = g.clientY;
        setTimeout(function() {
          f = 0
        }, b || 600)
      }if(c.getButton(g) != e || Math.abs(g.clientX - j) > 5 || Math.abs(g.clientY - k) > 5) {
        f = 0
      }if(f == d) {
        f = 0;
        h(g)
      }return c.preventDefault(g)
    };
    c.addListener(a, "mousedown", l);
    i.isIE && c.addListener(a, "dblclick", l)
  };
  c.addKeyListener = function(a, e) {
    var d = null;
    c.addListener(a, "keydown", function(b) {
      d = b.keyIdentifier || b.keyCode;
      return e(b)
    });
    i.isMac && i.isGecko && c.addListener(a, "keypress", function(b) {
      if(d !== (b.keyIdentifier || b.keyCode)) {
        return e(b)
      }else {
        d = null
      }
    })
  };
  return c
});