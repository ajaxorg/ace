require.def("ace/TextInput", ["ace/ace"], function(ace) {

var TextInput = function(parentNode, host) {

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

    ace.addListener(text, "keypress", onTextInput);
    ace.addListener(text, "textInput", onTextInput);
    ace.addListener(text, "paste", onTextInput);
    ace.addListener(text, "propertychange", onTextInput);

    ace.addListener(text, "copy", onCopy);
    ace.addListener(text, "cut", onCut);

    ace.addListener(text, "compositionstart", onCompositionStart);
    ace.addListener(text, "compositionupdate", onCompositionUpdate);
    ace.addListener(text, "compositionend", onCompositionEnd);

    ace.addListener(text, "blur", function() {
        host.onBlur();
    });

    ace.addListener(text, "focus", function() {
        host.onFocus();
    });

    this.focus = function() {
        text.focus();
    };

    this.blur = function() {
        text.blur();
    };
};

return TextInput;
});