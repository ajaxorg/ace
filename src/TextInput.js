function TextInput(parentNode, host) {
  
  var text = document.createElement("textarea");
  var style = text.style;
  style.position = "absolute";
  style.left = "-10000px";
  style.top = "-10000px";
  parentNode.appendChild(text);
  
  var inCompostion = false;
  
  var onTextInput = function(e) {
    setTimeout(function() {
      if (!inCompostion) {
        if (text.value) host.onTextInput(text.value);
        text.value = "";
      }
    }, 0)
  }

  var onCompositionStart = function(e) 
  {
    inCompostion = true;

    if (text.value) host.onTextInput(text.value);
    text.value = "";
    
    host.onCompositionStart();
    setTimeout(onCompositionUpdate, 0);
  }

  var onCompositionUpdate = function() {
    host.onCompositionUpdate(text.value);
  }

  var onCompositionEnd = function() 
  { 
    inCompostion = false;
    host.onCompositionEnd();
    onTextInput();
  }
  
  var onCopy = function() {
    text.value = host.getCopyText();
    text.select();
  }
  
  var onCut = function() {
    text.value = host.getCopyText();
    host.onCut();
    text.select();    
  }

  lib.addListener(text, "keypress", onTextInput, false);
  lib.addListener(text, "textInput", onTextInput, false);
  lib.addListener(text, "paste", onTextInput, false);  
  lib.addListener(text, "propertychange", onTextInput, false);

  lib.addListener(text, "copy", onCopy, false);  
  lib.addListener(text, "cut", onCut, false);  

  lib.addListener(text, "compositionstart", onCompositionStart, false);
  lib.addListener(text, "compositionupdate", onCompositionUpdate, false);
  lib.addListener(text, "compositionend", onCompositionEnd, false);
  
  lib.addListener(text, "blur", function() {
    host.onBlur();
  }, false);
  
  lib.addListener(text, "focus", function() {
    host.onFocus();
  }, false);
  
  
  this.focus = function() {
    text.focus();
  }
  
  this.blur = function() {
    this.blur();
  }
};