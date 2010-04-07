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

  addListener(text, "keypress", onTextInput, false);
  addListener(text, "textInput", onTextInput, false);
  addListener(text, "paste", onTextInput, false);  
  addListener(text, "propertychange", onTextInput, false);

  addListener(text, "copy", onCopy, false);  
  addListener(text, "cut", onCut, false);  

  addListener(text, "compositionstart", onCompositionStart, false);
  addListener(text, "compositionupdate", onCompositionUpdate, false);
  addListener(text, "compositionend", onCompositionEnd, false);
  
  addListener(text, "blur", function() {
    host.onBlur();
  }, false);
  
  addListener(text, "focus", function() {
    host.onFocus();
  }, false);
  
  
  this.focus = function() {
    text.focus();
  }
  
  this.blur = function() {
    this.blur();
  }
};