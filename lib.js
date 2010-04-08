function addListener(elem, type, callback) {
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

function removeListener(elem, type, callback) {
  if (elem.removeEventListener) {
    return elem.removeEventListener(type, callback, false);
  }
  if (elem.detachEvent) {
    elem.detachEvent("on" + type, callback.$$wrapper || callback);
  }
}

function setText(elem, text) {
  if (elem.innerText !== undefined) {
    elem.innerText = text;
  }
  if (elem.textContent !== undefined) {
    elem.textContent = text;
  }
}    
    
function stopEvent(e) {
  stopPropagation(e);
  preventDefault(e);
  return false;
}

function stopPropagation(e) {
  if (e.stopPropagation)
    e.stopPropagation();
  else
    e.cancelBubble = true;
}

function preventDefault (e)
{
  if (e.preventDefault)
    e.preventDefault();
  else
    e.returnValue = false;
}

inherits = function (ctor, superCtor) {
  var tempCtor = function(){};
  tempCtor.prototype = superCtor.prototype;
  ctor.super_ = superCtor.prototype;
  ctor.prototype = new tempCtor();
  ctor.prototype.constructor = ctor;
};

getInnerWidth = function(element)
{  
  return (
    parseInt(computedStyle(element, "paddingLeft")) +
    parseInt(computedStyle(element, "paddingRight")) +
    element.clientWidth
  );  
};

getInnerHeight = function(element)
{  
  return (
    parseInt(computedStyle(element, "paddingTop")) +
    parseInt(computedStyle(element, "paddingBottom")) +
    element.clientHeight
  );  
};

computedStyle = function(element, style) 
{
  if (window.getComputedStyle) {
    return (window.getComputedStyle(element, null))[style];
  } else {
    return element.currentStyle[style];
  }
}

scrollbarHeight = function() {
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

bind = function(fcn, context) {
  return function() {
    return fcn.apply(context, arguments);
  }
}

capture = function(el, eventHandler, releaseCaptureHandler)
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

function autoRemoveListener(el, type, callback, timeout)
{
  var listener = function(e)
  {
    clearTimeout(timeoutId);
    remove();
    callback(e);
  }

  var remove = function() {
    removeListener(el, type, listener);
  };

  addListener(el, type, listener);  
  var timeoutId = setTimeout(remove, timeout);  
}

function addTripleClickListener(el, callback)
{
  addListener(el, "mousedown", function() { 
    autoRemoveListener(el, "mousedown", function() {
      autoRemoveListener(el, "mousedown", callback, 300);
    }, 300);
  });
}