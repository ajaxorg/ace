/*jslint indent: 4, maxerr: 50, white: true, browser: true, vars: true*/
/*global define, require */

/**
 * Show Keyboard Shortcuts
 * @fileOverview Show Keyboard Shortcuts <br />
 * Generates a menu which displays the keyboard shortcuts.
 * @author <a href="mailto:matthewkastor@gmail.com">
 *  Matthew Christopher Kastor-Inare III </a><br />
 *  ☭ Hial Atropa!! ☭
 */

"use strict";

var Editor = require("../editor").Editor;

/**
 * Generates a menu which displays the keyboard shortcuts.
 * @author <a href="mailto:matthewkastor@gmail.com">
 *  Matthew Christopher Kastor-Inare III </a><br />
 *  ☭ Hial Atropa!! ☭
 * @param {Editor} editor An instance of the ace editor.
 */
function showKeyboardShortcuts(editor) {
    // make sure the menu isn't open already.
    if (!document.getElementById('kbshortcutmenu')) {
        var overlayPage = require('./menu_tools/overlay_page').overlayPage;
        var getEditorKeybordShortcuts = require('./menu_tools/get_editor_keyboard_shortcuts').getEditorKeybordShortcuts;
        var kb = getEditorKeybordShortcuts(editor);
        var el = document.createElement('div');
        var commands = kb.reduce(function (previous, current) {
            return previous + '<div class="ace_optionsMenuEntry"><span class="ace_optionsMenuCommand">'
                + current.command + '</span> : '
                + '<span class="ace_optionsMenuKey">' + current.key + '</span></div>';
        }, '');

        el.id = 'kbshortcutmenu';
        el.innerHTML = '<h1>Keyboard Shortcuts</h1>' + commands + '</div>';
        overlayPage(editor, el);
    }
}

/**
 * @param {Editor} editor
 */
module.exports.init = function (editor) {
    Editor.prototype.showKeyboardShortcuts = function () {
        showKeyboardShortcuts(this);
    };
    editor.commands.addCommands([{
        name: "showKeyboardShortcuts",
        bindKey: {
            win: "Ctrl-Alt-h",
            mac: "Command-Alt-h"
        },
        exec:
            /**
             * 
             * @param {Editor} editor
             * @param [line]
             */
            function (editor, line) {
            editor.showKeyboardShortcuts();
        }
    }]);
};
