define(function(f, c) {
  c.setText = function(a, b) {
    if(a.innerText !== undefined) {
      a.innerText = b
    }if(a.textContent !== undefined) {
      a.textContent = b
    }
  };
  c.hasCssClass = function(a, b) {
    return a.className.split(/\s+/g).indexOf(b) !== -1
  };
  c.addCssClass = function(a, b) {
    c.hasCssClass(a, b) || (a.className += " " + b)
  };
  c.setCssClass = function(a, b, d) {
    d ? c.addCssClass(a, b) : c.removeCssClass(a, b)
  };
  c.removeCssClass = function(a, b) {
    for(var d = a.className.split(/\s+/g);;) {
      var e = d.indexOf(b);
      if(e == -1) {
        break
      }d.splice(e, 1)
    }a.className = d.join(" ")
  };
  c.importCssString = function(a, b) {
    b = b || document;
    if(b.createStyleSheet) {
      b.createStyleSheet().cssText = a
    }else {
      var d = b.createElement("style");
      d.appendChild(b.createTextNode(a));
      b.getElementsByTagName("head")[0].appendChild(d)
    }
  };
  c.getInnerWidth = function(a) {
    return parseInt(c.computedStyle(a, "paddingLeft")) + parseInt(c.computedStyle(a, "paddingRight")) + a.clientWidth
  };
  c.getInnerHeight = function(a) {
    return parseInt(c.computedStyle(a, "paddingTop")) + parseInt(c.computedStyle(a, "paddingBottom")) + a.clientHeight
  };
  c.computedStyle = function(a, b) {
    return window.getComputedStyle ? (window.getComputedStyle(a, "") || {})[b] || "" : a.currentStyle[b]
  };
  c.scrollbarWidth = function() {
    var a = document.createElement("p");
    a.style.width = "100%";
    a.style.height = "200px";
    var b = document.createElement("div"), d = b.style;
    d.position = "absolute";
    d.left = "-10000px";
    d.overflow = "hidden";
    d.width = "200px";
    d.height = "150px";
    b.appendChild(a);
    document.body.appendChild(b);
    var e = a.offsetWidth;
    d.overflow = "scroll";
    a = a.offsetWidth;
    if(e == a) {
      a = b.clientWidth
    }document.body.removeChild(b);
    return e - a
  };
  c.setInnerHtml = function(a, b) {
    var d = a.cloneNode(false);
    d.innerHTML = b;
    a.parentNode.replaceChild(d, a);
    return d
  };
  c.getParentWindow = function(a) {
    return a.defaultView || a.parentWindow
  }
});