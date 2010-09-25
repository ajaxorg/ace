/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
require.def("ace/TextInput", ["ace/lib/event"], function(event) {

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

    event.addListener(text, "keypress", onTextInput);
    event.addListener(text, "textInput", onTextInput);
    event.addListener(text, "paste", onTextInput);
    event.addListener(text, "propertychange", onTextInput);

    event.addListener(text, "copy", onCopy);
    event.addListener(text, "cut", onCut);

    event.addListener(text, "compositionstart", onCompositionStart);
    event.addListener(text, "compositionupdate", onCompositionUpdate);
    event.addListener(text, "compositionend", onCompositionEnd);

    event.addListener(text, "blur", function() {
        host.onBlur();
    });

    event.addListener(text, "focus", function() {
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