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

ace.inherits = function(ctor, superCtor) {
    var tempCtor = function() {};
    tempCtor.prototype = superCtor.prototype;
    ctor.super_ = superCtor.prototype;
    ctor.prototype = new tempCtor();
    ctor.prototype.constructor = ctor;
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

ace.scrollbarHeight = function() {
    var el = document.createElement("div");
    var style = el.style;

    style.position = "absolute";
    style.left = "-10000px";
    style.overflow = "scroll";
    style.height = "100px";

    document.body.appendChild(el);
    var height = el.offsetHeight - el.clientHeight;
    document.body.removeChild(el);

    return height;
};

ace.stringReverse = function(string) {
    return string.split("").reverse().join("");
};

ace.bind = function(fcn, context) {
    return function() {
        return fcn.apply(context, arguments);
    };
};

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