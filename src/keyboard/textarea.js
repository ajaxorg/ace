"use strict";

var HashHandler = require("./hash_handler").HashHandler;
exports.handler = new HashHandler();

[{
    bindKey: "Shift-Tab|Tab",
    command: "passKeysToBrowser"
}, {
    bindKey: {win: "Ctrl-L", mac: "Cmd-L"},
    command: "passKeysToBrowser"
}, {
    bindKey: {win: "Ctrl-G", mac: "Cmd-G"},
    command: "gotoline"
}, {
    bindKey: {win: "Ctrl-T|Ctrl-Shift-T|Ctrl-K", mac: "Cmd-T|Cmd-Shift-T"},
    // TODO can't used shared passKeysToBrowser command since passEvent from it is ignored
    command: {
        name: "passKeysToBrowser",
        exec: function() {},
        passEvent: true,
        readOnly: true
    }
}, {
    bindKey: {win: "Ctrl-G", mac: "Cmd-G"},
    command: "passKeysToBrowser"
}, {
    bindKey: {win: "Ctrl-G", mac: "Cmd-G"},
    command: "passKeysToBrowser"
}, {
    command: "golineup",
    bindKey: {win: null, mac: "Ctrl-P"}
}, {
    command: "golinedown",
    bindKey: {win: null, mac: "Ctrl-N"}
}, {
    command: "gotoleft",    
    bindKey: {win: null, mac: "Ctrl-B"}
}, {
    command: "gotoright",
    bindKey: {win: null, mac: "Ctrl-F"}
}, {
    command: "gotolineend",
    bindKey: {win: null, mac: "Ctrl-E"}
}, {
    command: "gotolinestart",
    bindKey: {win: null, mac: "Ctrl-A"}
}
].forEach(function(k) {
    var bindKey = k.bindKey;
    if (typeof bindKey == "object")
        bindKey = bindKey[exports.handler.platform];
    exports.handler.bindKey(bindKey, k.command);
});
exports.handler["$id"] = "ace/keyboard/textarea";
