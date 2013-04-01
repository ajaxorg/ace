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
 * Show Keyboard Shortcuts
 * @fileOverview Show Keyboard Shortcuts <br />
 * Generates a menu which displays the keyboard shortcuts.
 * @author <a href="mailto:matthewkastor@gmail.com">
 *  Matthew Christopher Kastor-Inare III </a><br />
 *  ☭ Hial Atropa!! ☭
 */

define(function(require, exports, module) {
    "use strict";
    var overlayPage = require('./overlay_page').overlayPage;
    var getEditorKeybordShortcuts = require('./get_editor_keyboard_shortcuts').getEditorKeybordShortcuts;
    /**
     * Generates a menu which displays the keyboard shortcuts.
     * @author <a href="mailto:matthewkastor@gmail.com">
     *  Matthew Christopher Kastor-Inare III </a><br />
     *  ☭ Hial Atropa!! ☭
     * @param {ace.Editor} editor An instance of the ace editor.
     */
    module.exports = function showKeyboardShortcuts (editor) {
        var kb = getEditorKeybordShortcuts(editor);
        var el = document.createElement('div');
        el.innerHTML = '<h1 style="padding-top:0; margin-top:0;">' +
            'Keyboard Shortcuts</h1><div>' +
            JSON.stringify(kb, null, '    ') +
            '</div>';
        el.style.cssText = 'margin:0; padding:0; ' +
            'background-color:white; color:black; ' +
            'white-space: pre-wrap;';
        overlayPage(el, '0', '0', '0', null);
    };
});