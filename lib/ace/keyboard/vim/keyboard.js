
define(function(require, exports, module) {


var keyUtil  = require("../../lib/keys");
var cmds = require("./commands");
var coreCommands = cmds.coreCommands;


var startCommands = {
    'i': {
        command: coreCommands.start
    },
    'I': {
        command: coreCommands.startBeginning
    },
    'a': {
        command: coreCommands.append
    },
    'A': {
        command: coreCommands.appendEnd
    }
};

exports.handler = {
    handleKeyboard: function(data, hashId, key, keyCode, e) {
        // ignore command keys (shift, ctrl etc.)
        // Otherwise "shift-" is added to the buffer, and later on "shift-g"
        // which results in "shift-shift-g" which doesn't make sense.
        if (hashId != 0 && (key == "" || key == "\x00"))
            return null;

        if (hashId == 1)
            key = 'ctrl-' + key;

        if (data.state == 'start') {
            if (hashId == -1 || hashId == 1) {
                if (cmds.inputBuffer.idle && startCommands[key])
                    return startCommands[key];

                return { command: {
                    exec: function(editor) {cmds.inputBuffer.push(editor, key);}
                } };
            } // wait for input
            else if (key.length == 1 && (hashId == 0 || hashId == 4)) { //no modifier || shift
                return {command: "null", stopEvent: false};
            } else if (key == 'esc') {
                return {command: coreCommands.stop};
            }
        } else {
            if (key == 'esc' || key == 'ctrl-[') {
                data.state = 'start';
                return {command: coreCommands.stop};
            }
        }
    }
};

});