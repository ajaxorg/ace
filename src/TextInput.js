if (!window.ace)
    ace = {};

ace.TextInput = function(parentNode, host) {

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
                if (text.value)
                    host.onTextInput(text.value);
                text.value = "";
            }
        }, 0);
    };

    var onCompositionStart = function(e) {
        inCompostion = true;

        if (text.value)
            host.onTextInput(text.value);
        text.value = "";

        host.onCompositionStart();
        setTimeout(onCompositionUpdate, 0);
    };

    var onCompositionUpdate = function() {
        host.onCompositionUpdate(text.value);
    };

    var onCompositionEnd = function() {
        inCompostion = false;
        host.onCompositionEnd();
        onTextInput();
    };

    var onCopy = function() {
        text.value = host.getCopyText();
        text.select();
    };

    var onCut = function() {
        text.value = host.getCopyText();
        host.onCut();
        text.select();
    };

    ace.addListener(text, "keypress", onTextInput, false);
    ace.addListener(text, "textInput", onTextInput, false);
    ace.addListener(text, "paste", onTextInput, false);
    ace.addListener(text, "propertychange", onTextInput, false);

    ace.addListener(text, "copy", onCopy, false);
    ace.addListener(text, "cut", onCut, false);

    ace.addListener(text, "compositionstart", onCompositionStart, false);
    ace.addListener(text, "compositionupdate", onCompositionUpdate, false);
    ace.addListener(text, "compositionend", onCompositionEnd, false);

    ace.addListener(text, "blur", function() {
        host.onBlur();
    }, false);

    ace.addListener(text, "focus", function() {
        host.onFocus();
    }, false);


    this.focus = function() {
        text.focus();
    };

    this.blur = function() {
        this.blur();
    };
};