
define(function(require, exports, module) {

"never use strict";

var StateHandler = require("ace/keyboard/state_handler").StateHandler;
var cmds = require("./commands");
var coreCommands = cmds.coreCommands;

var matchChar = function(buffer, hashId, key, symbolicName, keyId) {
    // If no command keys are pressed, then catch the input.
    // If only the shift key is pressed and a character key, then
    // catch that input as well.
    // Otherwise, we let the input got through.
    var matched = ((hashId === 0) || (((hashId === 1) || (hashId === 4)) && key.length === 1));
    //console.log("INFO", arguments)

    if (matched) {
        if (keyId) {
            keyId = String.fromCharCode(parseInt(keyId.replace("U+", "0x"), 10));
        }

        coreCommands.builder.exec = function(editor) {
            cmds.inputBuffer.push.call(cmds.inputBuffer, editor, symbolicName, keyId);
        }
    }
    return matched;
};

var inIdleState = function() {
    if (cmds.inputBuffer.idle) {
        return true;
    }
    return false;
};

var states = exports.states = {
    start: [ // normal mode
        {
            key: "esc",
            exec: coreCommands.stop,
            then: "start"
        },
        {
            regex: "^i$",
            match: inIdleState,
            exec: coreCommands.start,
            then: "insertMode"
        },
        {
            regex: "^shift-i$",
            match: inIdleState,
            exec: coreCommands.startBeginning,
            then: "insertMode"
        },
        {
            regex: "^a$",
            match: inIdleState,
            exec: coreCommands.append,
            then: "insertMode"
        },
        {
            regex: "^shift-a$",
            match: inIdleState,
            exec: coreCommands.appendEnd,
            then: "insertMode"
        },
        {
            // The rest of input will be processed here
            match: matchChar,
            exec: coreCommands.builder
        }
    ],
    insertMode: [
        {
            key: "esc",
            exec: coreCommands.stop,
            then: "start"
        },
        {
            key: "backspace",
            exec: "backspace"
        }
    ]
};

exports.handler = new StateHandler(states);
});
