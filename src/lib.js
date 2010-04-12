(function() {

window.lib = {};

lib.addListener = function(elem, type, callback) {
  if (elem.addEventListener) {
    return elem.addEventListener(type, callback, false);
  }
  if (elem.attachEvent) {
    var wrapper = function() {
      callback(window.event);
    }
    callback.$$wrapper = wrapper;
    elem.attachEvent("on" + type, wrapper);
  }
}

lib.removeListener = function(elem, type, callback) {
  if (elem.removeEventListener) {
    return elem.removeEventListener(type, callback, false);
  }
  if (elem.detachEvent) {
    elem.detachEvent("on" + type, callback.$$wrapper || callback);
  }
}

lib.setText = function(elem, text) {
  if (elem.innerText !== undefined) {
    elem.innerText = text;
  }
  if (elem.textContent !== undefined) {
    elem.textContent = text;
  }
}    
    
lib.stopEvent = function(e) {
  lib.stopPropagation(e);
  lib.preventDefault(e);
  return false;
}

lib.stopPropagation = function(e) {
  if (e.stopPropagation)
    e.stopPropagation();
  else
    e.cancelBubble = true;
}

lib.preventDefault = function(e)
{
  if (e.preventDefault)
    e.preventDefault();
  else
    e.returnValue = false;
}

lib.inherits = function(ctor, superCtor) {
  var tempCtor = function(){};
  tempCtor.prototype = superCtor.prototype;
  ctor.super_ = superCtor.prototype;
  ctor.prototype = new tempCtor();
  ctor.prototype.constructor = ctor;
};

lib.getInnerWidth = function(element)
{  
  return (
    parseInt(lib.computedStyle(element, "paddingLeft")) +
    parseInt(lib.computedStyle(element, "paddingRight")) +
    element.clientWidth
  );  
};

lib.getInnerHeight = function(element)
{  
  return (
    parseInt(lib.computedStyle(element, "paddingTop")) +
    parseInt(lib.computedStyle(element, "paddingBottom")) +
    element.clientHeight
  );  
};

lib.computedStyle = function(element, style) 
{
  if (window.getComputedStyle) {
    return (window.getComputedStyle(element, null))[style];
  } else {
    return element.currentStyle[style];
  }
}

lib.scrollbarHeight = function() {
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
}

lib.bind = function(fcn, context) {
  return function() {
    return fcn.apply(context, arguments);
  }
}

lib.capture = function(el, eventHandler, releaseCaptureHandler)
{
  function onMouseMove(e) 
  {    
    eventHandler(e);
    e.stopPropagation();
  }
  
  function onMouseUp(e) 
  {
    eventHandler && eventHandler(e);
    releaseCaptureHandler && releaseCaptureHandler();

    document.removeEventListener("mousemove", onMouseMove, true);
    document.removeEventListener("mouseup", onMouseUp, true);
    
    e.stopPropagation();
  }
  
  document.addEventListener("mousemove", onMouseMove, true);
  document.addEventListener("mouseup", onMouseUp, true);
}

lib.addMouseWheelListener = function(el, callback)
{
  var listener = function(e) {
    e.wheel = (e.wheelDelta) ? e.wheelDelta / 120 : -(e.detail || 0) / 3;
    callback(e);
  }
  lib.addListener(el, "DOMMouseScroll", listener);
  lib.addListener(el, "mousewheel", listener);
};

lib.autoremoveListener = function(el, type, callback, timeout)
{
  var listener = function(e)
  {
    clearTimeout(timeoutId);
    remove();
    callback(e);
  }

  var remove = function() {
    lib.removeListener(el, type, listener);
  };

  lib.addListener(el, type, listener);  
  var timeoutId = setTimeout(remove, timeout);  
}

lib.addTripleClickListener = function(el, callback)
{
  lib.addListener(el, "mousedown", function() { 
    lib.autoremoveListener(el, "mousedown", function() {
      lib.autoremoveListener(el, "mousedown", callback, 300);
    }, 300);
  });
}

})();