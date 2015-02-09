/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
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
"use strict";

var Range = require("ace/range").Range;

var cleanupMarkerIds = [];
var findings = [];

function easymotionMark(editor, char) {
    var cursor = editor.getCursorPosition(),
        lastVisibleRow = editor.session.getScreenLength();

    var text = editor.session.getTextRange(new Range(cursor.row, cursor.column, lastVisibleRow, 0));

    var currentRow = cursor.row,
        currentColumn = cursor.column;

    text = text.slice(1, text.length);

    findings = [];

    while (text.length > 0) {
        currentColumn = currentColumn + 1;
        if (text[0] === "\n") {
            currentRow = currentRow + 1;
            currentColumn = 0;
            text = text.slice(1, text.length);
        }
        if (text[0] === char) {
            findings.push({row: currentRow, column: currentColumn});
        }
        text = text.slice(1, text.length);
    }

    var i;
    for (i = 0; i < findings.length; i += 1) {
      var range = new Range(findings[i].row, findings[i].column, findings[i].row, findings[i].column + 1);
      var id = editor.session.addMarker(range, "ace_easymotion-char", "text", true, i + 1);
      cleanupMarkerIds.push(id);
    }
};

function easymotionJump(editor, char) {
    var idx = (Number(char)||0) - 1;
    editor.moveCursorTo(findings[idx].row, findings[idx].column);
    editor.selection.clearSelection();
}

var query_html = "<div><input type=\"text\" id=\"easymotion-query-input\" /></div>";

var easymotionPhase = 0;

function easymotionHandler(data, hashId, key, keyCode) {
    var editor = data.editor;
    if (keyCode == -1) return;
    if (key.length > 1) {
      if (key == "space") key = " ";
      if (key[0] == "n") key = key.replace("numpad", "");
    }
    if ((hashId === 0 || hashId === 4) && key.length == 1)
        return {command: "null", passEvent: true}; // wait until input event
    if (hashId == -1)  {
      // easymotion functionality in two phases
      if (easymotionPhase === 0) {
        easymotionMark(editor, key);
        easymotionPhase++;
      } else if (easymotionPhase === 1) {
        easymotionJump(editor, key);
        easymotionHandlerCleanup({editor: editor});
        easymotionPhase = 0;
      }
      return {command: "null"}
    } else {
        // some other key: exit easymotion mode
        easymotionHandlerCleanup({editor: editor});
        return {command: "null"}
    }
};

function easymotionHandlerSetup(editor) {
    editor.keyBinding.addKeyboardHandler(easymotionHandler);
    editor.on("mousedown", easymotionHandlerCleanup);
}

function easymotionHandlerCleanup(event) {
    var editor = event.editor;
    editor.keyBinding.removeKeyboardHandler(easymotionHandler)
    editor.off("mousedown", easymotionHandlerCleanup)
    console.log(cleanupMarkerIds);

    var i;
    for (i = 0; i < cleanupMarkerIds.length; i++) {
      editor.session.removeMarker(cleanupMarkerIds[i]);
    }
}

exports.easymotionSetup = function(editor) {
    easymotionHandlerSetup(editor);
};

exports.commands = [{
    name: "easymotion-setup",
    exec: function(editor) {
        exports.easymotionSetup(editor);
    },
    bindKey: "Ctrl-Super+F"
}];

// var cssText = require("../../requirejs/text!./easymotion/easymotion.css");
// require("ace/lib/dom").importCssString(cssText);

});
