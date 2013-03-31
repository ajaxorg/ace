/*jslint
    indent: 4,
    maxerr: 50,
    white: true,
    browser: true,
    vars: true
*/
/*global
    define,
    require
*/

/**
 * Get Editor Keyboard Shortcuts
 * @fileOverview Get Editor Keyboard Shortcuts <br />
 * Gets a map of keyboard shortcuts to command names for the current platform.
 * @author <a href="mailto:matthewkastor@gmail.com">
 *  Matthew Christopher Kastor-Inare III </a><br />
 *  ☭ Hial Atropa!! ☭
 */
 
define(function(require, exports, module) {
"use strict";
/**
 * Gets a map of keyboard shortcuts to command names for the current platform.
 * @author <a href="mailto:matthewkastor@gmail.com">
 *  Matthew Christopher Kastor-Inare III </a><br />
 *  ☭ Hial Atropa!! ☭
 * @param {ace.Editor} editor An editor instance.
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
module.exports.getEditorKeybordShortcuts = function getEditorKeybordShortcuts (editor) {
    var commands = editor.commands.byName;
    var commandName;
    var key;
    var platform = editor.commands.platform;
    var kb = [];
    for (commandName in commands) {
        try {
            key = commands[commandName].bindKey[platform];
            if (key) {
               kb.push({
                    'command' : commandName,
                    'key' : key
               });
            }
        } catch (e) {
            // errors on properties without bindKey we don't want them
            // so the errors don't need handling.
        }
    }
    return kb;
};

});