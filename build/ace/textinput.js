define(function(l) {
  var b = l("./lib/event");
  return function(m, c) {
    function e() {
      if(!f) {
        var d = a.value;
        if(d) {
          if(d.charCodeAt(d.length - 1) == j.charCodeAt(0)) {
            (d = d.slice(0, -1)) && c.onTextInput(d)
          }else {
            c.onTextInput(d)
          }
        }
      }f = false;
      a.value = j;
      a.select()
    }
    var a = document.createElement("textarea"), h = a.style;
    h.position = "absolute";
    h.left = "-10000px";
    h.top = "-10000px";
    m.appendChild(a);
    var j = String.fromCharCode(0);
    e();
    var i = false, f = false, g = function() {
      setTimeout(function() {
        i || e()
      }, 0)
    }, k = function() {
      c.onCompositionUpdate(a.value)
    };
    b.addListener(a, "keypress", g);
    b.addListener(a, "textInput", g);
    b.addListener(a, "paste", g);
    b.addListener(a, "propertychange", g);
    b.addListener(a, "copy", function() {
      f = true;
      a.value = c.getCopyText();
      a.select();
      f = true;
      setTimeout(e, 0)
    });
    b.addListener(a, "cut", function() {
      f = true;
      a.value = c.getCopyText();
      c.onCut();
      a.select();
      setTimeout(e, 0)
    });
    b.addListener(a, "compositionstart", function() {
      i = true;
      e();
      a.value = "";
      c.onCompositionStart();
      setTimeout(k, 0)
    });
    b.addListener(a, "compositionupdate", k);
    b.addListener(a, "compositionend", function() {
      i = false;
      c.onCompositionEnd();
      g()
    });
    b.addListener(a, "blur", function() {
      c.onBlur()
    });
    b.addListener(a, "focus", function() {
      c.onFocus();
      a.select()
    });
    this.focus = function() {
      c.onFocus();
      a.select();
      a.focus()
    };
    this.blur = function() {
      a.blur()
    }
  }
});