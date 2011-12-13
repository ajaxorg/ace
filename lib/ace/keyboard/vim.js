define(function(require, exports, module) {
"use strict";

"never use strict";

var commands = require("./vim/commands");
var util = require("./vim/maps/util");

exports.handler = require("./vim/keyboard").handler;

exports.onCursorMove = function(e) {
    commands.onCursorMove(e.editor);
    exports.onCursorMove.scheduled = false;
};

exports.handler.attach = function(editor) {
    editor.on("click", exports.onCursorMove);
    if (util.currentMode !== "insert")
        commands.coreCommands.stop.exec(editor);
};

exports.handler.detach = function(editor) {
    editor.removeListener("click", exports.onCursorMove);
    commands.coreCommands.start.exec(editor);
    util.currentMode = "normal";
};

});
