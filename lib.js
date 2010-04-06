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