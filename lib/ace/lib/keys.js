/*! @license
==========================================================================
SproutCore -- JavaScript Application Framework
copyright 2006-2009, Sprout Systems Inc., Apple Inc. and contributors.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.

SproutCore and the SproutCore logo are trademarks of Sprout Systems, Inc.

For more information about SproutCore, visit http://www.sproutcore.com


==========================================================================
@license */

// Most of the following code is taken from SproutCore with a few changes.

define(function(require, exports, module) {
"use strict";

require("./fixoldbrowsers");

var oop = require("./oop");
var useragent = require("./useragent");

/*
 * Helper functions and hashes for key handling.
 */
var Keys = (function() {
    var ret = {
        MODIFIER_KEYS: {
            16: 'Shift', 17: 'Ctrl', 18: 'Alt', 224: 'Meta'
        },

        KEY_MODS: {
            "ctrl": 1, "alt": 2, "option" : 2, "shift": 4,
            "super": 8, "meta": 8, "command": 8, "cmd": 8
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
            96 : "Numpad0",
            97 : "Numpad1",
            98 : "Numpad2",
            99 : "Numpad3",
            100: "Numpad4",
            101: "Numpad5",
            102: "Numpad6",
            103: "Numpad7",
            104: "Numpad8",
            105: "Numpad9",
            '-13': "NumpadEnter",
            112: "F1",
            113: "F2",
            114: "F3",
            115: "F4",
            116: "F5",
            117: "F6",
            118: "F7",
            119: "F8",
            120: "F9",
            121: "F10",
            122: "F11",
            123: "F12",
            144: "Numlock",
            145: "Scrolllock"
        },

        PRINTABLE_KEYS: {
           32: ' ',  48: '0',  49: '1',  50: '2',  51: '3',  52: '4', 53:  '5',
           54: '6',  55: '7',  56: '8',  57: '9',  59: ';',  61: '=', 65:  'a',
           66: 'b',  67: 'c',  68: 'd',  69: 'e',  70: 'f',  71: 'g', 72:  'h',
           73: 'i',  74: 'j',  75: 'k',  76: 'l',  77: 'm',  78: 'n', 79:  'o',
           80: 'p',  81: 'q',  82: 'r',  83: 's',  84: 't',  85: 'u', 86:  'v',
           87: 'w',  88: 'x',  89: 'y',  90: 'z', 107: '+', 109: '-', 110: '.',
          187: '=', 188: ',', 189: '-', 190: '.', 191: '/', 192: '`', 219: '[',
          220: '\\',221: ']', 222: '\''
        }
    };

    // A reverse map of FUNCTION_KEYS
    var name, i;
    for (i in ret.FUNCTION_KEYS) {
        name = ret.FUNCTION_KEYS[i].toLowerCase();
        ret[name] = parseInt(i, 10);
    }

    // A reverse map of PRINTABLE_KEYS
    for (i in ret.PRINTABLE_KEYS) {
        name = ret.PRINTABLE_KEYS[i].toLowerCase();
        ret[name] = parseInt(i, 10);
    }

    // Add the MODIFIER_KEYS, FUNCTION_KEYS and PRINTABLE_KEYS to the KEY
    // variables as well.
    oop.mixin(ret, ret.MODIFIER_KEYS);
    oop.mixin(ret, ret.PRINTABLE_KEYS);
    oop.mixin(ret, ret.FUNCTION_KEYS);

    // aliases
    ret.enter = ret["return"];
    ret.escape = ret.esc;
    ret.del = ret["delete"];

    // workaround for firefox bug
    ret[173] = '-';

    (function() {
        var mods = ["cmd", "ctrl", "alt", "shift"];
        for (var i = Math.pow(2, mods.length); i--;) {            
            ret.KEY_MODS[i] = mods.filter(function(x) {
                return i & ret.KEY_MODS[x];
            }).join("-") + "-";
        }
    })();

    ret.KEY_MODS[0] = "";
    ret.KEY_MODS[-1] = "input";

    return ret;
})();
oop.mixin(exports, Keys);

var ts = 0;


var getModifierHash = useragent.isMac && useragent.isOpera && !("KeyboardEvent" in window)
    ? function(e) {
        return 0 | (e.metaKey ? 1 : 0) | (e.altKey ? 2 : 0) | (e.shiftKey ? 4 : 0) | (e.ctrlKey ? 8 : 0);
    }
    : function(e) {
        return 0 | (e.ctrlKey ? 1 : 0) | (e.altKey ? 2 : 0) | (e.shiftKey ? 4 : 0) | (e.metaKey ? 8 : 0);
    };

exports.getModifierString = function(e) {
    return Keys.KEY_MODS[getModifierHash(e)];
};

/**
 * Computes the "hashId" that is determined by the modifiers pressed. Will call
 * `callback` only the event qualifies as a "command key".
 * Will mutate `pressedKeys`!
 *
 * @param {Function} callback - Callback that takes parameters event, hashId, keyCode
 * @param {KeyEvent} keydown or keypress event
 * @param {Number} character code of the key pressed
 * @param {Object} pressedKeys - Map of key codes to truthy values for keeping track which keys were pressed
 * @return {Boolean} return value that'll be returned by the keydown/keypress event handler
 *
 **/
exports.normalizeCommandKeys = function normalizeCommandKeys(callback, e, keyCode, pressedKeys) {
    var hashId = getModifierHash(e);

    if (!useragent.isMac && pressedKeys) {
        if (pressedKeys[91] || pressedKeys[92])
            hashId |= 8;
        if (pressedKeys.altGr) {
            if ((3 & hashId) != 3)
                pressedKeys.altGr = 0;
            else
                return;
        }
        if (keyCode === 18 || keyCode === 17) {
            var location = "location" in e ? e.location : e.keyLocation;
            if (keyCode === 17 && location === 1) {
                ts = e.timeStamp;
            } else if (keyCode === 18 && hashId === 3 && location === 2) {
                var dt = -ts;
                ts = e.timeStamp;
                dt += ts;
                if (dt < 3)
                    pressedKeys.altGr = true;
            }
        }
    }

    if (keyCode in Keys.MODIFIER_KEYS) {
        switch (Keys.MODIFIER_KEYS[keyCode]) {
            case "Alt":
                hashId = 2;
                break;
            case "Shift":
                hashId = 4;
                break;
            case "Ctrl":
                hashId = 1;
                break;
            default:
                hashId = 8;
                break;
        }
        keyCode = -1;
    }

    if (hashId & 8 && (keyCode === 91 || keyCode === 93)) {
        keyCode = -1;
    }

    if (!hashId && keyCode === 13) {
        var location = "location" in e ? e.location : e.keyLocation;
        if (location === 3) {
            callback(e, hashId, -keyCode);
            if (e.defaultPrevented)
                return;
        }
    }

    if (useragent.isChromeOS && hashId & 8) {
        callback(e, hashId, keyCode);
        if (e.defaultPrevented)
            return;
        else
            hashId &= ~8;
    }

    // If there is no hashId and the keyCode is not a function key, then
    // we don't call the callback as we don't handle a command key here
    // (it's a normal key/character input).
    // 2014-03-11 rksm: command key == mac cmd? If just cmd is pressed hashId
    // will be -1 and callback will be called... please clarify.
    if (!hashId && !(keyCode in Keys.FUNCTION_KEYS) && !(keyCode in Keys.PRINTABLE_KEYS)) {
        return false;
    }

    return callback(e, hashId, keyCode);
}

exports.keyCodeToString = function(keyCode) {
    // Language-switching keystroke in Chrome/Linux emits keyCode 0.
    var keyString = Keys[keyCode];
    if (typeof keyString != "string")
        keyString = String.fromCharCode(keyCode);
    return keyString.toLowerCase();
};

var keyCodeCache = {};
function getKeyCodeForKey(key, type) {
    // reverse mapping, key -> code
    key = key.toLowerCase();
    if (keyCodeCache[key]) return keyCodeCache[key];
    var base = Keys;
    // "MODIFIER_KEYS","FUNCTION_KEYS","PRINTABLE_KEYS"
    if (type) base = Keys[type];
    for (var code in base)
        if (key === base[code].toLowerCase())
            return keyCodeCache[key] = typeof code === 'string' ?
                parseInt(code, 10) : code;
}

exports.isFunctionKey = function(string) {
    return !!getKeyCodeForKey(string, 'FUNCTION_KEYS');
};

exports.isModifierKey = function(string) {
    return !!getKeyCodeForKey(string, 'MODIFIER_KEYS');
};

exports.isPrintableKey = function(string) {
    return !!getKeyCodeForKey(string, 'PRINTABLE_KEYS');
};

exports.simulateKey = function(editor, key) {
    // 1. create a key event object. We first gather what properties need to be
    // passed to the event creator in terms of the keyboard state

    var spec = {
        keyString: '',
        keyCode: 0,
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
        altGraphKey: false
    };

    // 2. Are any modifier keys pressed?
    var keyMods = key.split(/[\-]/);
    var trailing = keyMods.pop();
    var isModified = false;
    var modsToEvent = {
        shift: "shiftKey",
        control: "ctrlKey",
        ctrl: "ctrlKey",
        alt: "altKey",
        meta: "metaKey",
        command: "metaKey",
        cmd: "metaKey"
    }
    keyMods.forEach(function(mod) {
        var modEventFlag = modsToEvent[mod.toLowerCase()];
        if (!modEventFlag) return;
        isModified = true;
        spec[modEventFlag] = true;
    });

    // 3. determine the key code and key string of the event.
    var isFunctionKey = exports.isFunctionKey(trailing);
    if (isFunctionKey) {
        spec.keyCode = getKeyCodeForKey(trailing, 'FUNCTION_KEYS');
    } else if (isModified) {
        spec.keyCode = trailing.toUpperCase().charCodeAt(0);
    } else {
        spec.keyString = trailing;
    }

    var event = require("./event");
    var e = event.createKeyboardEvent(spec);

    if (isFunctionKey || isModified) {
        exports.normalizeCommandKeys(editor.onCommandKey.bind(editor), e, e.keyCode, {});
    }
    if (!e.defaultPrevented && spec.keyString) {
        editor.onTextInput(spec.keyString);
        if (editor.session.$syncInformUndoManager) // FIXME for vim
            editor.session.$syncInformUndoManager();
    }
};

/*
 * usage: keys.simulateKeys(editor, "h i  t h e e Left r")
 * (should print "hi there")
 */
exports.simulateKeys = function(editor, keysString) {
    // there can be multiple pressed keys seperated by spaces. To simulate a
    // space press use a double space. split up the individual keys and
    // simulate each
    function ensureSpaces(s) { return s.length ? s : ' '; }
    var pressedKeys = keysString.length === 1 ?
        [keysString] :
        keysString.split(/ /g).map(ensureSpaces)
    pressedKeys.forEach(exports.simulateKey.bind(null,editor));
};

});
