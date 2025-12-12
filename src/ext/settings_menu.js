/**
 * ## Interactive Settings Menu Extension
 *
 * Provides settings interface for the Ace editor that displays dynamically generated configuration options based on
 * the current editor state. The menu appears as an overlay panel allowing users to modify editor options, themes,
 * modes, and other settings through an intuitive graphical interface.
 *
 * **Usage:**
 * ```javascript
 * editor.showSettingsMenu();
 * ```
 *
 * The extension automatically registers the `showSettingsMenu` command and method
 * on the editor instance when initialized.
 *
 * @author <a href="mailto:matthewkastor@gmail.com">
 *  Matthew Christopher Kastor-Inare III </a><br />
 *
 * @module
 */

/*jslint indent: 4, maxerr: 50, white: true, browser: true, vars: true*/
/*global define, require */

"use strict";
var OptionPanel = require("./options").OptionPanel;
var overlayPage = require('./menu_tools/overlay_page').overlayPage;

/**
 * This displays the settings menu if it is not already being shown.
 * @author <a href="mailto:matthewkastor@gmail.com">
 *  Matthew Christopher Kastor-Inare III </a><br />
 *  ☭ Hial Atropa!! ☭
 * @param {import("../editor").Editor} editor An instance of the ace editor.
 */
function showSettingsMenu(editor) {
    // show if the menu isn't open already.
    if (!document.getElementById('ace_settingsmenu')) {
        var options = new OptionPanel(editor);
        options.render();
        options.container.id = "ace_settingsmenu";
        overlayPage(editor, options.container);
        // @ts-ignore
        options.container.querySelector("select,input,button,checkbox").focus();
    }
}

/**
 * Initializes the settings menu extension. It adds the showSettingsMenu
 *  method to the given editor object and adds the showSettingsMenu command
 *  to the editor with appropriate keyboard shortcuts.
 */
module.exports.init = function() {
    var Editor = require("../editor").Editor;
    Editor.prototype.showSettingsMenu = function() {
        showSettingsMenu(this);
    };
};
