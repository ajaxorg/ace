"use strict";

var snippetManager = require("../snippets").snippetManager;

/**
 * This object is used to manage inline code completions rendered into an editor with ghost text.
 * @class
 */

/**
 * Creates the inline completion renderer which renders the inline code completions directly in the target editor.
 * @constructor
 */

var AceInline = function() {
    this.editor = null;
};

(function() {

    /**
     * Renders the completion as ghost text to the current cursor position
     * @param {Editor} editor
     * @param {Completion} completion
     * @param {string} prefix
     * @returns {boolean} True if the completion could be rendered to the editor, false otherwise
     */
    this.show = function(editor, completion, prefix) {
        prefix = prefix || "";
        if (editor && this.editor && this.editor !== editor) {
            this.hide();
            this.editor = null;
        }
        if (!editor || !completion) {
            return false;
        }
        var displayText = completion.snippet ? snippetManager.getDisplayTextForSnippet(editor, completion.snippet) : completion.value;
        if (!displayText || !displayText.startsWith(prefix)) {
            return false;
        }
        this.editor = editor;
        displayText = displayText.slice(prefix.length);
        if (displayText === "") {
            editor.removeGhostText();
        } else {
            editor.setGhostText(displayText);
        }
        return true;
    };

    this.isOpen = function() {
        if (!this.editor) {
            return false;
        }
        return !!this.editor.renderer.$ghostText;
    };

    this.hide = function() {
        if (!this.editor) {
            return false;
        }
        this.editor.removeGhostText();
        return true;
    };

    this.destroy = function() {
        this.hide();
        this.editor = null;
    };
}).call(AceInline.prototype);


exports.AceInline = AceInline;
