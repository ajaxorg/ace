if (!window.ace)
    ace = {};

ace.provide = function(namespace) {
    var parts = namespace.split(".");
    var obj = window;
    for (var i=0; i<parts.length; i++) {
        var part = parts[i];
        if (!obj[part]) {
            obj[part] = {};
        }
        obj = obj[part];
    }
};

ace.inherits = function(ctor, superCtor) {
    var tempCtor = function() {};
    tempCtor.prototype = superCtor.prototype;
    ctor.super_ = superCtor.prototype;
    ctor.prototype = new tempCtor();
    ctor.prototype.constructor = ctor;
};

ace.implement = function(proto, mixin) {
    mixin.call(proto);
};

ace.addListener = function(elem, type, callback) {
    if (elem.addEventListener) {
        return elem.addEventListener(type, callback, false);
    }
    if (elem.attachEvent) {
        var wrapper = function() {
            callback(window.event);
        };
        callback.$$wrapper = wrapper;
        elem.attachEvent("on" + type, wrapper);
    }
};

ace.removeListener = function(elem, type, callback) {
    if (elem.removeEventListener) {
        return elem.removeEventListener(type, callback, false);
    }
    if (elem.detachEvent) {
        elem.detachEvent("on" + type, callback.$$wrapper || callback);
    }
};

ace.setText = function(elem, text) {
    if (elem.innerText !== undefined) {
        elem.innerText = text;
    }
    if (elem.textContent !== undefined) {
        elem.textContent = text;
    }
};

ace.stopEvent = function(e) {
    ace.stopPropagation(e);
    ace.preventDefault(e);
    return false;
};

ace.stopPropagation = function(e) {
    if (e.stopPropagation)
        e.stopPropagation();
    else
        e.cancelBubble = true;
};

ace.preventDefault = function(e) {
    if (e.preventDefault)
        e.preventDefault();
    else
        e.returnValue = false;
};


ace.hasCssClass = function(el, name) {
    var classes = el.className.split(/\s*/g);
    return ace.arrayIndexOf(classes, name) !== -1;
};


ace.addCssClass = function(el, name) {
    if (!ace.hasCssClass(el, name)) {
        el.className += " " + name;
    }
};

ace.removeCssClass = function(el, name) {
    var classes = el.className.split(/\s+/g);
    while (true) {
        var index = ace.arrayIndexOf(classes, name);
        if (index == -1) {
            break;
        }
        classes.splice(index, 1);
    }
    el.className = classes.join(" ");
};

ace.getInnerWidth = function(element) {
    return (parseInt(ace.computedStyle(element, "paddingLeft"))
            + parseInt(ace.computedStyle(element, "paddingRight")) + element.clientWidth);
};

ace.getInnerHeight = function(element) {
    return (parseInt(ace.computedStyle(element, "paddingTop"))
            + parseInt(ace.computedStyle(element, "paddingBottom")) + element.clientHeight);
};

ace.computedStyle = function(element, style) {
    if (window.getComputedStyle) {
        return (window.getComputedStyle(element, null))[style];
    }
    else {
        return element.currentStyle[style];
    }
};

ace.scrollbarWidth = function() {

    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement("div");
    var style = outer.style;

    style.position = "absolute";
    style.left = "-10000px";
    style.overflow = "hidden";
    style.width = "200px";
    style.height = "150px";

    outer.appendChild(inner);
    document.body.appendChild(outer);
    var noScrollbar = inner.offsetWidth;

    style.overflow = "scroll";
    var withScrollbar = inner.offsetWidth;

    if (noScrollbar == withScrollbar) {
        withScrollbar = outer.clientWidth;
    }

    document.body.removeChild(outer);

    return noScrollbar-withScrollbar;
};

ace.stringReverse = function(string) {
    return string.split("").reverse().join("");
};

if (Array.prototype.indexOf) {
    ace.arrayIndexOf = function(array, searchElement) {
        return array.indexOf(searchElement);
    };
}
else {
    ace.arrayIndexOf = function(array, searchElement) {
        for (var i=0; i<array.length; i++) {
            if (array[i] == searchElement) {
                return i;
            }
        }
        return -1;
    };
}

ace.bind = function(fcn, context) {
    return function() {
        return fcn.apply(context, arguments);
    };
};

ace.getDocumentX = function(event) {
    if (event.clientX) {
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        return event.clientX + scrollLeft;
    } else {
        return event.pageX;
    }
};

ace.getDocumentY = function(event) {
    if (event.clientY) {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        return event.clientY + scrollTop;
    } else {
        return event.pageX;
    }
};

if (document.documentElement.setCapture) {
    ace.capture = function(el, eventHandler, releaseCaptureHandler) {
        function onMouseMove(e) {
            eventHandler(e);
            return ace.stopPropagation(e);
        }

        function onReleaseCapture(e) {
            eventHandler && eventHandler(e);
            releaseCaptureHandler && releaseCaptureHandler();

            ace.removeListener(el, "mousemove", eventHandler);
            ace.removeListener(el, "mouseup", onReleaseCapture);
            ace.removeListener(el, "losecapture", onReleaseCapture);

            el.releaseCapture();
        }

        ace.addListener(el, "mousemove", eventHandler);
        ace.addListener(el, "mouseup", onReleaseCapture);
        ace.addListener(el, "losecapture", onReleaseCapture);
        el.setCapture();
    };
}
else {
    ace.capture = function(el, eventHandler, releaseCaptureHandler) {
        function onMouseMove(e) {
            eventHandler(e);
            e.stopPropagation();
        }

        function onMouseUp(e) {
            eventHandler && eventHandler(e);
            releaseCaptureHandler && releaseCaptureHandler();

            document.removeEventListener("mousemove", onMouseMove, true);
            document.removeEventListener("mouseup", onMouseUp, true);

            e.stopPropagation();
        }

        document.addEventListener("mousemove", onMouseMove, true);
        document.addEventListener("mouseup", onMouseUp, true);
    };
}

ace.addMouseWheelListener = function(el, callback) {
    var listener = function(e) {
        e.wheel = (e.wheelDelta) ? e.wheelDelta / 120
                : -(e.detail || 0) / 3;
        callback(e);
    };
    ace.addListener(el, "DOMMouseScroll", listener);
    ace.addListener(el, "mousewheel", listener);
};

ace.autoremoveListener = function(el, type, callback, timeout) {
    var listener = function(e) {
        clearTimeout(timeoutId);
        remove();
        callback(e);
    };

    var remove = function() {
        ace.removeListener(el, type, listener);
    };

    ace.addListener(el, type, listener);
    var timeoutId = setTimeout(remove, timeout);
};

ace.addTripleClickListener = function(el, callback) {
    ace.addListener(el, "mousedown", function() {
        ace.autoremoveListener(el, "mousedown", function() {
            ace.autoremoveListener(el, "mousedown", callback, 300);
        }, 300);
    });
};

ace.addKeyListener = function(el, callback) {
  var lastDown = null;

  ace.addListener(el, "keydown", function(e) {
      lastDown = e.keyCode;
      return callback(e);
  });

  ace.addListener(el, "keypress", function(e) {
      var keyId = e.keyCode;
      if (lastDown !== keyId) {
          return callback(e);
      } else {
          lastDown = null;
      }
  });
};