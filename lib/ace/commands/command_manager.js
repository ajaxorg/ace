define(function(require, exports, module) {

var keyUtil = require("../lib/keys");

var CommandManager = function(platform, commands) {
    if (typeof platform !== "string")
        throw new TypeError("'platform' argument must be either 'mac' or 'win'");

    this.platform = platform;
    this.commands = {};
    this.commmandKeyBinding = {};
    
    if (commands)
        commands.forEach(this.addCommand, this);
};

(function() {

    this.addCommand = function(command) {
        if (this.commands[command.name])
            this.removeCommand(command);

        this.commands[command.name] = command;

        if (command.bindKey) {
            this._buildKeyHash(command);   
        }
    };
    
    this.removeCommand = function(command) {
        var name = (typeof command === 'string' ? command : command.name);
        command = this.commands[name];
        delete this.commands[name];

        // exaustive search is brute force but since removeCommand is
        // not a performance critical operation this should be OK
        var ckb = this.commmandKeyBinding;
        for (var hashId in ckb) {
            for (var key in ckb[hashId]) {
                if (ckb[hashId][key] == command)
                    delete ckb[hashId][key];
            }
        }
    };

    this._buildKeyHash = function(command) {
        var binding = command.bindKey;
        var key = binding[this.platform];
        var ckb = this.commmandKeyBinding;

        if(!binding[this.platform]) {
            return;
        }
    
        key.split("|").forEach(function(keyPart) {
            var binding = parseKeys(keyPart, command);
            var hashId = binding.hashId;
            (ckb[hashId] || (ckb[hashId] = {}))[binding.key] = command;
        });
    }

    function parseKeys(keys, val, ret) {
        var key;
        var hashId = 0;
        var parts = splitSafe(keys);

        for (var i=0, l = parts.length; i < l; i++) {
            if (keyUtil.KEY_MODS[parts[i]])
                hashId = hashId | keyUtil.KEY_MODS[parts[i]];
            else
                key = parts[i] || "-"; //when empty, the splitSafe removed a '-'
        }
    
        return {
            key: key,
            hashId: hashId
        }   
    }

    function splitSafe(s, separator) {
        return (s.toLowerCase()
            .trim()
            .split(new RegExp("[\\s ]*\\-[\\s ]*", "g"), 999));
    }

    this.findKeyCommand = function findKeyCommand(hashId, textOrKey) {
        // Convert keyCode to the string representation.
        if (typeof textOrKey == "number") {
            textOrKey = keyUtil.keyCodeToString(textOrKey);
        }

        var ckbr = this.commmandKeyBinding;
        return ckbr[hashId] && ckbr[hashId][textOrKey.toLowerCase()];
    }

    this.exec = function(command, editor, args) {
        if (typeof command === 'string')
            command = this.commands[command];
        
        if (!command)
            return false;
            
        command.exec(editor, args || {});
        return true;
    };

}).call(CommandManager.prototype);

exports.CommandManager = CommandManager;

});
