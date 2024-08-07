"use strict";
/**
 *
 * @typedef {import("../editor").Editor} Editor
 */
var oop = require("../lib/oop");
var MultiHashHandler = require("../keyboard/hash_handler").MultiHashHandler;
var EventEmitter = require("../lib/event_emitter").EventEmitter;

class CommandManager extends MultiHashHandler{
    /**
     * new CommandManager(platform, commands)
     * @param {String} platform Identifier for the platform; must be either `"mac"` or `"win"`
     * @param {any[]} commands A list of commands
     **/
    constructor(platform, commands) {
        super(commands, platform);
        this.byName = this.commands;
        this.setDefaultHandler("exec", function(e) {
            if (!e.args) {
                return e.command.exec(e.editor, {}, e.event, true);
            }
            return e.command.exec(e.editor, e.args, e.event, false);
        });
    }

    /**
     * 
     * @param {string | string[] | import("../../ace-internal").Ace.Command} command
     * @param {Editor} editor
     * @param {any} args
     * @returns {boolean}
     */
    exec(command, editor, args) {
        if (Array.isArray(command)) {
            for (var i = command.length; i--; ) {
                if (this.exec(command[i], editor, args)) return true;
            }
            return false;
        }
        
        if (typeof command === "string")
            command = this.commands[command];

        if (!this.canExecute(command, editor)) {
            return false; 
        }
        
        var e = {editor: editor, command: command, args: args};
        e.returnValue = this._emit("exec", e);
        this._signal("afterExec", e);

        return e.returnValue === false ? false : true;
    }

    /**
     *
     * @param {string | import("../../ace-internal").Ace.Command} command
     * @param {Editor} editor
     * @returns {boolean}
     */
    canExecute(command, editor) {
        if (typeof command === "string")
            command = this.commands[command];
        
        if (!command)
            return false;

        if (editor && editor.$readOnly && !command.readOnly)
            return false;

        if (this.$checkCommandState != false && command.isAvailable && !command.isAvailable(editor))
            return false;
        
        return true;
    }
    

    /**
     * @param {Editor} editor
     * @returns {boolean}
     */
    toggleRecording(editor) {
        if (this.$inReplay)
            return;

        editor && editor._emit("changeStatus");
        if (this.recording) {
            this.macro.pop();
            this.off("exec", this.$addCommandToMacro);

            if (!this.macro.length)
                this.macro = this.oldMacro;

            return this.recording = false;
        }
        if (!this.$addCommandToMacro) {
            this.$addCommandToMacro = function(e) {
                this.macro.push([e.command, e.args]);
            }.bind(this);
        }

        this.oldMacro = this.macro;
        this.macro = [];
        this.on("exec", this.$addCommandToMacro);
        return this.recording = true;
    }

    /**
     * @param {Editor} editor
     */
    replay(editor) {
        if (this.$inReplay || !this.macro)
            return;

        if (this.recording)
            return this.toggleRecording(editor);

        try {
            this.$inReplay = true;
            this.macro.forEach(function(x) {
                if (typeof x == "string")
                    this.exec(x, editor);
                else
                    this.exec(x[0], editor, x[1]);
            }, this);
        } finally {
            this.$inReplay = false;
        }
    }

    trimMacro(m) {
        return m.map(function(x){
            if (typeof x[0] != "string")
                x[0] = x[0].name;
            if (!x[1])
                x = x[0];
            return x;
        });
    }

}
oop.implement(CommandManager.prototype, EventEmitter);

exports.CommandManager = CommandManager;
