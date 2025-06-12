/**
 * ## Editor Keyboard Shortcuts Utility
 *
 * Provides functionality to extract and format keyboard shortcuts from an Ace editor instance. Analyzes all registered
 * command handlers and their key bindings to generate a list of available keyboard shortcuts for the
 * current platform. Returns formatted key combinations with proper modifier key representations and handles multiple
 * bindings per command with pipe-separated notation.
 *
 * **Usage:**
 * ```javascript
 * var getKbShortcuts = require('ace/ext/menu_tools/get_editor_keyboard_shortcuts');
 * var shortcuts = getKbShortcuts.getEditorKeybordShortcuts(editor);
 * console.log(shortcuts);
 * // [
 * //     {'command': 'selectall', 'key': 'Ctrl-A'},
 * //     {'command': 'copy', 'key': 'Ctrl-C|Ctrl-Insert'}
 * // ]
 * ```
 *
 * @module
 */

/*jslint indent: 4, maxerr: 50, white: true, browser: true, vars: true*/
/*global define, require */

"use strict";

/** @type{any} */var keys = require("../../lib/keys");

/**
 * Gets a map of keyboard shortcuts to command names for the current platform.
 * @author <a href="mailto:matthewkastor@gmail.com">
 *  Matthew Christopher Kastor-Inare III </a><br />
 *  ☭ Hial Atropa!! ☭
 * @param {import("../../editor").Editor} editor An editor instance.
 * @returns {Array} Returns an array of objects representing the keyboard
 *  shortcuts for the given editor.
 * @example
 * var getKbShortcuts = require('./get_keyboard_shortcuts');
 * console.log(getKbShortcuts(editor));
 * // [
 * //     {'command' : aCommand, 'key' : 'Control-d'},
 * //     {'command' : aCommand, 'key' : 'Control-d'}
 * // ]
 */
module.exports.getEditorKeybordShortcuts = function(editor) {
    var KEY_MODS = keys.KEY_MODS;
    var keybindings = [];
    var commandMap = {};
    editor.keyBinding.$handlers.forEach(function(handler) {
        var ckb = handler["commandKeyBinding"];
        for (var i in ckb) {
            var key = i.replace(/(^|-)\w/g, function(x) { return x.toUpperCase(); });
            var commands = ckb[i];
            if (!Array.isArray(commands))
                commands = [commands];
            commands.forEach(function(command) {
                if (typeof command != "string")
                    command  = command.name;
                if (commandMap[command]) {
                    commandMap[command].key += "|" + key;
                } else {
                    commandMap[command] = {key: key, command: command};
                    keybindings.push(commandMap[command]);
                }         
            });
        }
    });
    return keybindings;
};
