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

function easymotion_forward(editor, char) {
    var cursor = editor.getCursorPosition(),
        lastVisibleRow = editor.session.getScreenLength();

    var text = editor.session.getTextRange(new Range(cursor.row, cursor.column, lastVisibleRow, 0));

    var currentRow = cursor.row,
        currentColumn = cursor.column;

    var findings = [];

    while (text.length > 0) {
        currentColumn = currentColumn + 1;
        if (text[0] === "\n") {
            currentRow = currentRow + 1;
            currentColumn = 0;
        }
        if (text[0] === char) {
            findings.push({row: currentRow, column: currentColumn});
        }
        text = text.slice(1, text.length);
    }

    if (findings.length > 0) {
        editor.session.selection.moveCursorTo(findings[0].row, findings[0].column - 1);
    }
};

var query_html = "<div><input type=\"text\" id=\"easymotion-query-input\" /></div>";

exports.easymotion_setup = function(editor) {
    if(!document.getElementById("easymotion-query")) {
        var overlayPage = require('./menu_tools/overlay_page').overlayPage;

        var el = document.createElement("div");

        el.id = "ace_easymotion_menu";
        el.innerHTML = query_html;

        var input = el.querySelector("#easymotion-query-input");
        input.addEventListener("keydown", function (event) {
            if (String.fromCharCode(event.keyCode).match(/[^ -~]/) === null) {
                console.log("querying " + String.fromCharCode(event.keyCode));
                el.parentElement.querySelector(".ace_closeButton").click()
                easymotion_forward(editor, String.fromCharCode(event.keyCode));
            }
        });

        overlayPage(editor, el, '0', '0', '0', null);

        input.focus();
    }
};

exports.commands = [{
    name: "easymotion-setup",
    exec: function(editor) {
        exports.easymotion_setup(editor);
    },
    bindKey: "Ctrl-Shift+F"
}];

var cssText = require("../../requirejs/text!./easymotion/easymotion.css");
require("ace/lib/dom").importCssString(cssText);

});
