/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {

var config = require("../config"),
    Occur = require("../occur").Occur;

// These commands can be installed in a normal command handler to start occur:
var occurStartCommands = [{
    name: "occur",
    exec: function(editor, options) {
        if (!options.needle) return;
        var handler = new OccurKeyboardHandler();
        editor.keyBinding.addKeyboardHandler(handler);
        editor.commands.addCommands(occurCommands);
        var occur = new Occur();
        occur.display(editor.session, options);
    },
    readOnly: true
}];

var occurCommands = [{
    name: "occurexit",
    bindKey: 'esc|Ctrl-G',
    exec: function(editor) {
        // if (!options.needle) return;
        var session = editor.session, occur = session.doc.$occur;
        if (occur) occur.displayOriginal(session);
        editor.commands.removeCommands(occurCommands);
        var handler = editor.getKeyboardHandler();
        if (handler.isOccurHandler) editor.keyBinding.removeKeyboardHandler(handler);
    },
    readOnly: true
}];

var HashHandler = require("../keyboard/hash_handler").HashHandler;
var oop = require("../lib/oop");

function OccurKeyboardHandler() {}

oop.inherits(OccurKeyboardHandler, HashHandler);

;(function() {

    this.isOccurHandler = true;

    this.attach = function(editor) {
        HashHandler.call(this, occurCommands, editor.commands.platform);
        this.$editor = editor;
    }

    this.detach = function() {}

    var handleKeyboard$super = this.handleKeyboard;
    this.handleKeyboard = function(data, hashId, key, keyCode) {
        var cmd = handleKeyboard$super.call(this, data, hashId, key, keyCode);
        return (cmd && cmd.command) ? cmd : {command: "null"};
    }

}).call(OccurKeyboardHandler.prototype);

exports.commands = occurStartCommands;

});
