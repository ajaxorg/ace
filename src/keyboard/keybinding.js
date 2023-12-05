"use strict";
/**
 * @typedef {import("../editor").Editor} Editor
 * @typedef {import("../../ace-internal").Ace.KeyboardHandler} KeyboardHandler
 */
var keyUtil  = require("../lib/keys");
var event = require("../lib/event");


class KeyBinding {
    /**
     * @param {Editor} editor
     */
    constructor(editor) {
        this.$editor = editor;
        this.$data = {editor: editor};
        /**@type {(KeyboardHandler)[]}*/
        this.$handlers = [];
        this.setDefaultHandler(editor.commands);
    }

    /**
     * @param {KeyboardHandler} kb
     */
    setDefaultHandler(kb) {
        this.removeKeyboardHandler(this.$defaultHandler);
        this.$defaultHandler = kb;
        this.addKeyboardHandler(kb, 0);
    }

    /**
     * @param {KeyboardHandler} kb
     */
    setKeyboardHandler(kb) {
        var h = this.$handlers;
        if (h[h.length - 1] == kb)
            return;

        while (h[h.length - 1] && h[h.length - 1] != this.$defaultHandler)
            this.removeKeyboardHandler(h[h.length - 1]);

        this.addKeyboardHandler(kb, 1);
    }

    /**
     * @param {KeyboardHandler & {attach?: (editor: any) => void, detach?: (editor: any) => void;}} [kb]
     * @param {number} [pos]
     */
    addKeyboardHandler(kb, pos) {
        if (!kb)
            return;
        // @ts-ignore
        if (typeof kb == "function" && !kb.handleKeyboard)
            // @ts-ignore
            kb.handleKeyboard = kb;
        var i = this.$handlers.indexOf(kb);
        if (i != -1)
            this.$handlers.splice(i, 1);

        if (pos == undefined)
            this.$handlers.push(kb);
        else
            this.$handlers.splice(pos, 0, kb);

        if (i == -1 && kb.attach)
            kb.attach(this.$editor);
    }

    /**
     * @param {KeyboardHandler & {attach?: (editor: any) => void, detach?: (editor: any) => void;}} kb
     * @returns {boolean}
     */
    removeKeyboardHandler(kb) {
        var i = this.$handlers.indexOf(kb);
        if (i == -1)
            return false;
        this.$handlers.splice(i, 1);
        kb.detach && kb.detach(this.$editor);
        return true;
    }

    /**
     * @return {KeyboardHandler}
     */
    getKeyboardHandler() {
        return this.$handlers[this.$handlers.length - 1];
    }
    
    getStatusText() {
        var data = this.$data;
        var editor = data.editor;
        return this.$handlers.map(function(h) {
            return h.getStatusText && h.getStatusText(editor, data) || "";
        }).filter(Boolean).join(" ");
    }

    $callKeyboardHandlers(hashId, keyString, keyCode, e) {
        var toExecute;
        var success = false;
        var commands = this.$editor.commands;

        for (var i = this.$handlers.length; i--;) {
            toExecute = this.$handlers[i].handleKeyboard(
                // @ts-expect-error TODO: could be wrong arguments amount
                this.$data, hashId, keyString, keyCode, e
            );
            if (!toExecute || !toExecute.command)
                continue;
            
            // allow keyboardHandler to consume keys
            if (toExecute.command == "null") {
                success = true;
            } else {
                // @ts-expect-error //TODO: potential wrong arguments amount
                success = commands.exec(toExecute.command, this.$editor, toExecute.args, e);
            }
            // do not stop input events to not break repeating
            if (success && e && hashId != -1 && 
                toExecute["passEvent"] != true && toExecute.command["passEvent"] != true
            ) {
                event.stopEvent(e);
            }
            if (success)
                break;
        }
        
        if (!success && hashId == -1) {
            toExecute = {command: "insertstring"};
            success = commands.exec("insertstring", this.$editor, keyString);
        }
        
        if (success && this.$editor._signal)
            this.$editor._signal("keyboardActivity", toExecute);
        
        return success;
    }

    /**
     * @param {any} e
     * @param {number} hashId
     * @param {number} keyCode
     * @return {boolean}
     */
    onCommandKey(e, hashId, keyCode) {
        var keyString = keyUtil.keyCodeToString(keyCode);
        return this.$callKeyboardHandlers(hashId, keyString, keyCode, e);
    }

    /**
     * @param {string} text
     * @return {boolean}
     */
    onTextInput(text) {
        return this.$callKeyboardHandlers(-1, text);
    }

}

exports.KeyBinding = KeyBinding;
