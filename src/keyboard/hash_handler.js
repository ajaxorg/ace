"use strict";

/**
 * @typedef {import("../../ace-internal").Ace.Command} Command
 * @typedef {import("../../ace-internal").Ace.CommandLike} CommandLike
*/

/** @type {any} */var keyUtil = require("../lib/keys");
var useragent = require("../lib/useragent");
var KEY_MODS = keyUtil.KEY_MODS;

class MultiHashHandler {
    /**
     * @param {Record<string, CommandLike> | Command[]} [config]
     * @param {string} [platform]
     */
    constructor(config, platform) {
        this.$init(config, platform, false);
    }

    /**
     * @param {Record<string, CommandLike> | Command[]} config
     * @param {string} [platform]
     * @param {boolean} [$singleCommand]
     */
    $init(config, platform, $singleCommand) {
        this.platform = platform || (useragent.isMac ? "mac" : "win");
        /**@type {Record<string, Command>}*/
        this.commands = {};
        this.commandKeyBinding = {};
        this.addCommands(config);
        this.$singleCommand = $singleCommand;
    }

    /**
     * @param {Command} command
     */
    addCommand(command) {
        if (this.commands[command.name])
            this.removeCommand(command);

        this.commands[command.name] = command;

        if (command.bindKey)
            this._buildKeyHash(command);
    }

    /**
     * @param {Command | string} command
     * @param {boolean} [keepCommand]
     */
    removeCommand(command, keepCommand) {
        var name = command && (typeof command === 'string' ? command : command.name);
        command = this.commands[name];
        if (!keepCommand)
            delete this.commands[name];

        // exhaustive search is brute force but since removeCommand is
        // not a performance critical operation this should be OK
        var ckb = this.commandKeyBinding;
        for (var keyId in ckb) {
            var cmdGroup = ckb[keyId];
            if (cmdGroup == command) {
                delete ckb[keyId];
            } else if (Array.isArray(cmdGroup)) {
                var i = cmdGroup.indexOf(command);
                if (i != -1) {
                    cmdGroup.splice(i, 1);
                    if (cmdGroup.length == 1)
                        ckb[keyId] = cmdGroup[0];
                }
            }
        }
    }

    /**
     * @param {string | { win?: string; mac?: string; position?:number}} key
     * @param {CommandLike | string} command
     * @param {number} [position]
     */
    bindKey(key, command, position) {
        if (typeof key == "object" && key) {
            if (position == undefined)
                position = key.position;
            key = key[this.platform];
        }
        if (!key)
            return;
        if (typeof command == "function")
            return this.addCommand({exec: command, bindKey: key, name: command.name || /**@type{string}*/(key)});
        
        /**@type{string}*/(key).split("|").forEach(function(keyPart) {
            var chain = "";
            if (keyPart.indexOf(" ") != -1) {
                var parts = keyPart.split(/\s+/);
                keyPart = parts.pop();
                parts.forEach(function(keyPart) {
                    var binding = this.parseKeys(keyPart);
                    var id = KEY_MODS[binding.hashId] + binding.key;
                    chain += (chain ? " " : "") + id;
                    this._addCommandToBinding(chain, "chainKeys");
                }, this);
                chain += " ";
            }
            var binding = this.parseKeys(keyPart);
            var id = KEY_MODS[binding.hashId] + binding.key;
            this._addCommandToBinding(chain + id, command, position);
        }, this);
    }

    /**
     * @param {string} keyId
     * @param {any} command
     * @param {number} position
     */
    _addCommandToBinding(keyId, command, position) {
        var ckb = this.commandKeyBinding, i;
        if (!command) {
            delete ckb[keyId];
        } else if (!ckb[keyId] || this.$singleCommand) {
            ckb[keyId] = command;
        } else {
            if (!Array.isArray(ckb[keyId])) {
                ckb[keyId] = [ckb[keyId]];
            } else if ((i = ckb[keyId].indexOf(command)) != -1) {
                ckb[keyId].splice(i, 1);
            }
            
            if (typeof position != "number") {
                position = getPosition(command);
            }

            var commands = ckb[keyId];
            for (i = 0; i < commands.length; i++) {
                var other = commands[i];
                var otherPos = getPosition(other);
                if (otherPos > position)
                    break;
            }
            commands.splice(i, 0, command);
        }
    }

    /**
     * @param {Record<string, CommandLike> | Command[]} [commands]
     */
    addCommands(commands) {
        commands && Object.keys(commands).forEach(function(name) {
            var command = commands[name];
            if (!command)
                return;
            
            if (typeof command === "string")
                return this.bindKey(command, name);

            if (typeof command === "function")
                command = { exec: command };

            if (typeof command !== "object")
                return;

            if (!command.name)
                command.name = name;

            this.addCommand(command);
        }, this);
    }

    /**
     * @param {Record<string, CommandLike>} commands
     */
    removeCommands(commands) {
        Object.keys(commands).forEach(function(name) {
            this.removeCommand(commands[name]);
        }, this);
    }

    /**
     * @param {Record<string, CommandLike>} keyList
     */
    bindKeys(keyList) {
        Object.keys(keyList).forEach(function(key) {
            this.bindKey(key, keyList[key]);
        }, this);
    }

    _buildKeyHash(command) {
        this.bindKey(command.bindKey, command);
    }

    /**
     * Accepts keys in the form ctrl+Enter or ctrl-Enter
     * keys without modifiers or shift only
     * @param {string} keys
     * @returns {{key: string, hashId: number} | false}
     */
    parseKeys(keys) {
        var parts = keys.toLowerCase().split(/[\-\+]([\-\+])?/).filter(function(x){return x;});
        var key = parts.pop();

        var keyCode = keyUtil[key];
        if (keyUtil.FUNCTION_KEYS[keyCode])
            key = keyUtil.FUNCTION_KEYS[keyCode].toLowerCase();
        else if (!parts.length)
            return {key: key, hashId: -1};
        else if (parts.length == 1 && parts[0] == "shift")
            return {key: key.toUpperCase(), hashId: -1};

        var hashId = 0;
        for (var i = parts.length; i--;) {
            var modifier = keyUtil.KEY_MODS[parts[i]];
            if (modifier == null) {
                if (typeof console != "undefined")
                    console.error("invalid modifier " + parts[i] + " in " + keys);
                return false;
            }
            hashId |= modifier;
        }
        return {key: key, hashId: hashId};
    }

    /**
     * @param {number} hashId
     * @param {string} keyString
     * @returns {Command}
     */
    findKeyCommand(hashId, keyString) {
        var key = KEY_MODS[hashId] + keyString;
        return this.commandKeyBinding[key];
    }

    /**
     * @param {{ $keyChain: string | any[]; }} data
     * @param {number} hashId
     * @param {string} keyString
     * @param {number} keyCode
     * @returns {{command: string} | void}
     */
    handleKeyboard(data, hashId, keyString, keyCode) {
        if (keyCode < 0) return;
        var key = KEY_MODS[hashId] + keyString;
        var command = this.commandKeyBinding[key];
        if (data.$keyChain) {
            data.$keyChain += " " + key;
            command = this.commandKeyBinding[data.$keyChain] || command;
        }
        
        if (command) {
            if (command == "chainKeys" || command[command.length - 1] == "chainKeys") {
                data.$keyChain = data.$keyChain || key;
                return {command: "null"};
            }
        }
        
        if (data.$keyChain) {
            if ((!hashId || hashId == 4) && keyString.length == 1)
                data.$keyChain = data.$keyChain.slice(0, -key.length - 1); // wait for input
            else if (hashId == -1 || keyCode > 0)
                data.$keyChain = ""; // reset keyChain
        }
        return {command: command};
    }

    /**
     * @param {any} [editor]
     * @param {any} [data]
     * @returns {string}
     */
    getStatusText(editor, data) {
        return data.$keyChain || "";
    }

}

function getPosition(command) {
    return typeof command == "object" && command.bindKey
        && command.bindKey.position 
        || (command.isDefault ? -100 : 0);
}

class HashHandler extends MultiHashHandler {
    /**
     * @param {Record<string, CommandLike> | Command[]} [config]
     * @param {string} [platform]
     */
    constructor(config, platform) {
        super(config, platform);
        this.$singleCommand = true;
    }
}

HashHandler.call = function(thisArg, config, platform) {
    MultiHashHandler.prototype.$init.call(thisArg, config, platform, true);
};
MultiHashHandler.call = function(thisArg, config, platform) {
    MultiHashHandler.prototype.$init.call(thisArg, config, platform, false);
};

exports.HashHandler = HashHandler;
exports.MultiHashHandler = MultiHashHandler;
