function addListener(elem, type, callback) {
  if (elem.addEventListener) {
    return elem.addEventListener(type, callback, false);
  }
  if (elem.attachEvent) {
    elem.attachEvent("on" + type, function() {
      callback(window.event);
    });
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

bind = function(fcn, context) {
  return function() {
    return fcn.apply(context, arguments);
  }
}