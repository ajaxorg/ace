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
/*jslint
   indent: 4,
   maxerr: 50,
   white: true,
   vars: true,
   browser: true
*/
/*global
    define,
    FileReader
*/

define(function(require, exports, module) {
"use strict";

/**
 * Supports loading a file by dropping it on the editor.
 * @param {ace.Editor} editor An instance of the ace editor.
 * @param {function} onDropFn Optional. A callback function called after the
 *  file contents have been loaded into the editor. It receives two arguments,
 *  the file object from the drop event and the FileReader instance used to
 *  read the file's contents.
 * @example
 *  // add script tags to load both src-noconflict/ace.js and 
 *  // src-noconflict/drop_load.js
 *  var editor = ace.edit("editor");
 *  ace.require('ace/ext/drop_load').init(editor, function (file, reader) {
 *      // console.log(arguments);
 *  });
 *  editor.setTheme("ace/theme/twilight");
 *  editor.getSession().setMode("ace/mode/javascript");
 */
module.exports.init = function (editor, onDropFn) {
    var event = require("ace/lib/event");
    var container = editor.container;
    var callback = onDropFn || function () {
        // var mode = modelist.getModeFromPath(file.name).mode;
        // editor.session.setMode(mode);
    };
    
    /************** dragover ***************************/
    event.addListener(container, "dragover", function(e) {
        var types = e.dataTransfer.types;
        if (types && Array.prototype.indexOf.call(types, 'Files') !== -1) {
            return event.preventDefault(e);
        }
    });

    event.addListener(container, "drop", function(e) {
        var file;
        try {
            file = e.dataTransfer.files[0];
            if (window.FileReader) {
                var reader = new FileReader();
                reader.onload = function() {
                    editor.session.setValue(reader.result);
                    callback(file, reader);
                };
                reader.readAsText(file);
            }
            return event.preventDefault(e);
        } catch(err) {
            return event.stopEvent(e);
        }
    });
};

});