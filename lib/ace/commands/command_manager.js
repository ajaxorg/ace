define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var HashHandler = require("../keyboard/hash_handler").HashHandler;

var CommandManager = function(platform, commands) {
    this.platform = platform;
    this.commands = {};
    this.commmandKeyBinding = {};

    this.addCommands(commands);
};

oop.inherits(CommandManager, HashHandler);

(function() {


    this.exec = function(command, editor, args) {
        if (typeof command === 'string')
            command = this.commands[command];

        if (!command)
            return false;

        if (editor && editor.$readOnly && !command.readOnly)
            return false;

        command.exec(editor, args || {});
        return true;
    };

    this.toggleRecording = function() {
        if (this.$inReplay)
            return;
        if (this.recording) {
            this.macro.pop();
            this.exec = this.normal_exec;

            if (!this.macro.length)
                this.macro = this.oldMacro;

            return this.recording = false;
        }
        this.oldMacro = this.macro;
        this.macro = [];
        this.normal_exec = this.exec;
        this.exec = function(command, editor, args) {
            this.macro.push([command, args]);
            return this.normal_exec(command, editor, args);
        };
        return this.recording = true;
    };

    this.replay = function(editor) {
        if (this.$inReplay || !this.macro)
            return;

        if (this.recording)
            return this.toggleRecording();

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
    };

    this.trimMacro = function(m) {
        return m.map(function(x){
            if (typeof x[0] != "string")
                x[0] = x[0].name;
            if (!x[1])
                x = x[0];
            return x;
        });
    };

}).call(CommandManager.prototype);

exports.CommandManager = CommandManager;

});
