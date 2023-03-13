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
     */
    this.show = function(editor, completion, prefix) {
        if (this.editor && this.editor !== editor) {
            this.hide();
            this.editor = null;
        }
        if (!editor) {
            return false;
        }
        this.editor = editor;
        if (!completion) {
            editor.removeGhostText();
            return false;
        }
        var displayText = completion.snippet ? snippetManager.getDisplayTextForSnippet(editor, completion.snippet) : completion.value;
        if (!displayText || !displayText.startsWith(prefix)) {
            editor.removeGhostText();
            return false;
        }
        displayText = displayText.slice(prefix.length);
        editor.setGhostText(displayText);
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
