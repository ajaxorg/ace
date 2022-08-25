"use strict";

/* global window, KeyboardEvent */

var keyCodeToKey = {};
var keyCodeToCode = {};

var alias = {};
alias.Ctrl = "Control";
alias.Option = "Alt";
alias.Cmd = alias.Super = alias.Meta = "Command";

var controlKeys = {
    Shift: 16, Control: 17, Alt: 18, Meta: 224, Command: 224,
    Backspace:8, Tab:9, Return: 13, Enter: 13,
    Pause: 19, Escape: 27, PageUp: 33, PageDown: 34, End: 35, Home: 36,
    Left: 37, Up: 38, Right: 39, Down: 40, Insert: 45, Delete: 46,
    ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40
};

var shiftedKeys = {};
var printableKeys = {};
var specialKeys = {
    Backquote: [192, "`", "~"], Minus: [189, "-", "_"], Equal: [187, "=", "+"],
    BracketLeft: [219, "[", "{"], Backslash: [220, "\\", "|"], BracketRight: [221, "]", "}"],
    Semicolon: [186, ";", ":"], Quote: [222, "'", '"'], Comma: [188, ",", "<"],
    Period: [190, ".", ">"], Slash: [191, "/", "?"], Space: [32, " "], NumpadAdd: [107, "+"],
    NumpadDecimal: [110, "."], NumpadSubtract: [109, "-"], NumpadDivide: [111, "/"], NumpadMultiply: [106, "*"]
};
for (var i in specialKeys) {
    var key = specialKeys[i];
    printableKeys[i] = printableKeys[key[1]] = shiftedKeys[key[2]] = key[0];
    keyCodeToCode[key[0]] = i;
}
for (var i = 0; i < 10; i++) {
    printableKeys[i] = shiftedKeys["!@#$%^&*()"[i]] = 48 + i;
    keyCodeToCode[48 + i] = "Digit" + i;
}
for (var i = 65; i < 91; i++) {
    var chr = String.fromCharCode(i + 32);
    printableKeys[chr] = shiftedKeys[chr.toUpperCase()] = i;
    keyCodeToCode[i] = "Key" + chr.toUpperCase();
}
for (var i = 1; i < 13; i++) {
    controlKeys["F" + i] = 111 + i;
}

for (var i in controlKeys) {
    keyCodeToKey[controlKeys[i]] = i;
    keyCodeToCode[controlKeys[i]] = i;
}
controlKeys["\n"] = controlKeys.Return;

var shift = false;
var ctrl = false;
var meta = false;
var alt = false;
function reset() {
    shift = ctrl = meta = alt = false;
}
function updateModifierStates(keyCode) {
    if (keyCode == controlKeys.Shift)
        return shift = true;
    if (keyCode == controlKeys.Control)
        return ctrl = true;
    if (keyCode == controlKeys.Meta)
        return meta = true;
    if (keyCode == controlKeys.Alt)
        return alt = true;
}

function sendKey(letter, timeout) {
    var keyCode = controlKeys[letter] || printableKeys[letter] || shiftedKeys[letter];
    var isModifier = updateModifierStates(keyCode);
            
    var text = letter;
    if (ctrl || alt || meta || controlKeys[letter]) {
        text = "";
    }
    else if (shift) {
        text = text.toUpperCase();
    }

    var target = document.activeElement;
    var prevented = emit("keydown", true);
    if (isModifier) return;
    if (text) emit("keypress", true);
    if (!prevented) updateTextInput();
    // if (timeout != undefined) await wait(timeout)
    emit("keyup", true);
            
    function emit(type, bubbles) {
        var data = {bubbles: bubbles, cancelable:true};
        data.charCode = text.charCodeAt(0);
        data.keyCode = type == "keypress" ? data.charCode : keyCode;
        data.which = data.keyCode;
        data.shiftKey = shift || shiftedKeys[text];
        data.ctrlKey = ctrl;
        data.altKey = alt;
        data.metaKey = meta;
        data.key = text || keyCodeToKey[keyCode];
        data.code = keyCodeToCode[keyCode];
        var event = new KeyboardEvent(type, data);
        
        var el = document.activeElement;
        el.dispatchEvent(event);
        return event.defaultPrevented;
    }
    
    function updateTextInput() {
        var el = target;
        var isTextarea = "selectionStart" in el && typeof el.value == "string";
        var isContentEditable = /text|true/.test(el.contentEditable);
        if (!isTextarea && !isContentEditable) return;
                
        var s = el.selectionStart;
        var e = el.selectionEnd;
        var value = el.value;
                
        if (isContentEditable) {
            value = el.textContent;
            var range = window.getSelection().getRangeAt(0);
            s = range.startOffset;
            e = range.endOffset;
        }
                
        if (!text) {
            if (keyCode == 13) { // enter
                text = "\n";
            }
            else if (keyCode == 8) { // backspace
                if (s != e) s = Math.max(s-1, 0);
            }
            else if (keyCode == 46) { // delete
                if (s != e) e = Math.min(e+1, value.length);
            }
            else {
                return;
            }
        }
        var newValue = value.slice(0, s) + text + value.slice(e);
        s = e = s + text.length;
        if (newValue != value) {
            if (isContentEditable) {
                el.textContent = newValue;
                range.setStart(el.firstChild, s);
                range.setEnd(el.firstChild, e);
            }
            else {
                el.value = newValue;
                el.setSelectionRange(s, e);
            }
            emit("input", false);
        }
    }
}

function type() {
    var keys = Array.prototype.slice.call(arguments);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (Array.isArray(key)) {
            type.apply(null, key);
            continue;
        }
        reset();
        if (key.length > 1) {
            var isKeyName = controlKeys[key] || printableKeys[key] || shiftedKeys[key];
            if (!isKeyName) {
                var parts = key.split("-");
                var modifier = alias[parts[0]] || parts[0];
                if (!updateModifierStates(controlKeys[modifier])) {
                    type.apply(null, key.split(""));
                    continue;
                } 
                key = parts.pop();
                parts.forEach(function(part) {
                    var keyCode = controlKeys[part];
                    updateModifierStates(keyCode);
                });
            }
        }
        sendKey(key);
    }
}

exports.type = type;
