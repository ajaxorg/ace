"use strict";

var oop = require("./oop");


var Keys = {
    MODIFIER_KEYS: {
        16: 'Shift', 17: 'Ctrl', 18: 'Alt', 224: 'Meta',
        91: 'MetaLeft', 92: 'MetaRight', 93: 'ContextMenu'
    },

    KEY_MODS: {
        "ctrl": 1, "alt": 2, "option" : 2, "shift": 4,
        "super": 8, "meta": 8, "command": 8, "cmd": 8, 
        "control": 1
    },

    FUNCTION_KEYS : {
        8  : "Backspace",
        9  : "Tab",
        13 : "Return",
        19 : "Pause",
        27 : "Esc",
        32 : "Space",
        33 : "PageUp",
        34 : "PageDown",
        35 : "End",
        36 : "Home",
        37 : "Left",
        38 : "Up",
        39 : "Right",
        40 : "Down",
        44 : "Print",
        45 : "Insert",
        46 : "Delete",
        '-13': "NumpadEnter",
        144: "Numlock",
        145: "Scrolllock"
    },

    PRINTABLE_KEYS: {
        32: ' ',  59: ';',  61: '=', 107: '+', 109: '-', 110: '.',
        186: ';', 187: '=', 188: ',', 189: '-', 190: '.', 191: '/', 192: '`',
        219: '[', 220: '\\',221: ']', 222: "'", 111: '/', 106: '*'
    }
};

var codeToKeyCode = {
    Command: 224,
    Backspace: 8,
    Tab: 9,
    Return: 13,
    Enter: 13,
    Pause: 19,
    Escape: 27,
    PageUp: 33,
    PageDown: 34,
    End: 35,
    Home: 36,
    Insert: 45,
    Delete: 46,
    ArrowLeft: 37,
    ArrowUp: 38,
    ArrowRight: 39,
    ArrowDown: 40,
    // special keys
    Backquote: 192,
    Minus: 189,
    Equal: 187,
    BracketLeft: 219,
    Backslash: 220,
    BracketRight: 221,
    Semicolon: 186,
    Quote: 222,
    Comma: 188,
    Period: 190,
    Slash: 191,
    Space: 32,
    NumpadAdd: 107,
    NumpadDecimal: 110,
    NumpadSubtract: 109,
    NumpadDivide: 111,
    NumpadMultiply: 106
};
for (var i = 0; i < 10; i++) {
    codeToKeyCode["Digit" + i] = 48 + i;
    codeToKeyCode["Numpad" + i] = 96 + i;
    Keys.PRINTABLE_KEYS[48 + i] = "" + i;
    Keys.FUNCTION_KEYS[96 + i] = "Numpad" + i;
}
for (var i = 65; i < 91; i++) {
    var chr = String.fromCharCode(i + 32);
    codeToKeyCode["Key" + chr.toUpperCase()] = i;
    Keys.PRINTABLE_KEYS[i] = chr;
}
for (var i = 1; i < 13; i++) {
    codeToKeyCode["F" + i] = 111 + i;
    Keys.FUNCTION_KEYS[111 + i] = "F" + i;
}
var modifiers = { 
    Shift: 16,
    Control: 17,
    Alt: 18,
    Meta: 224
};
for (var mod in modifiers) {
    codeToKeyCode[mod] = codeToKeyCode[mod + "Left"]
        = codeToKeyCode[mod + "Right"] = modifiers[mod];
}
exports.$codeToKeyCode = codeToKeyCode;

// workaround for firefox bug
Keys.PRINTABLE_KEYS[173] = '-';

// A reverse map of FUNCTION_KEYS
for (var j in Keys.FUNCTION_KEYS) {
    var name = Keys.FUNCTION_KEYS[j].toLowerCase();
    Keys[name] = parseInt(j, 10);
}

// A reverse map of PRINTABLE_KEYS
for (var j in Keys.PRINTABLE_KEYS) {
    var name = Keys.PRINTABLE_KEYS[j].toLowerCase();
    Keys[name] = parseInt(j, 10);
}

// Add the MODIFIER_KEYS, FUNCTION_KEYS and PRINTABLE_KEYS to the KEY
// variables as well.
oop.mixin(Keys, Keys.MODIFIER_KEYS);
oop.mixin(Keys, Keys.PRINTABLE_KEYS);
oop.mixin(Keys, Keys.FUNCTION_KEYS);

// aliases
Keys.enter = Keys["return"];
Keys.escape = Keys.esc;
Keys.del = Keys["delete"];

(function() {
    var mods = ["cmd", "ctrl", "alt", "shift"];
    for (var i = Math.pow(2, mods.length); i--;) {
        Keys.KEY_MODS[i] = mods.filter(function(x) {
            return i & Keys.KEY_MODS[x];
        }).join("-") + "-";
    }
})();

Keys.KEY_MODS[0] = "";
Keys.KEY_MODS[-1] = "input-";


oop.mixin(exports, Keys);

exports.default = exports;

// @ts-ignore
exports.keyCodeToString = function(keyCode) {
    // Language-switching keystroke in Chrome/Linux emits keyCode 0.
    var keyString = Keys[keyCode];
    if (typeof keyString != "string")
        keyString = String.fromCharCode(keyCode);
    return keyString.toLowerCase();
};
