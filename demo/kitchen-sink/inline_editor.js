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
"use strict";

var LineWidgets = require("ace/line_widgets").LineWidgets;
var Editor = require("ace/editor").Editor;
var Renderer = require("ace/virtual_renderer").VirtualRenderer;
var dom = require("ace/lib/dom");


require("ace/commands/default_commands").commands.push({
    name: "openInlineEditor",
    bindKey: "F3",
    exec: function(editor) {
        var split = window.env.split;
        var s = editor.session;
        var inlineEditor = new Editor(new Renderer());
        var splitSession = split.$cloneSession(s);

        var row = editor.getCursorPosition().row;
        if (editor.session.lineWidgets && editor.session.lineWidgets[row]) {
            editor.session.lineWidgets[row].destroy();
            return;
        }
        
        var rowCount = 10;
        var w = {
            row: row, 
           // rowCount: rowCount, 
            fixedWidth: true,
            el: dom.createElement("div"),
            editor: inlineEditor
        };
        var el = w.el;
        el.appendChild(inlineEditor.container);

        if (!editor.session.widgetManager) {
            editor.session.widgetManager = new LineWidgets(editor.session);
            editor.session.widgetManager.attach(editor);
        }
        
        var h = rowCount*editor.renderer.layerConfig.lineHeight;
        inlineEditor.container.style.height = h + "px";

        el.style.position = "absolute";
        el.style.zIndex = "4";
        el.style.borderTop = "solid blue 2px";
        el.style.borderBottom = "solid blue 2px";
        
        inlineEditor.setSession(splitSession);
        editor.session.widgetManager.addLineWidget(w);
        
        var kb = {
            handleKeyboard:function(_,hashId, keyString) {
                if (hashId === 0 && keyString === "esc") {
                    w.destroy();
                    return true;
                }
            }
        };
        
        w.destroy = function() {
            editor.keyBinding.removeKeyboardHandler(kb);
            s.widgetManager.removeLineWidget(w);
        };
        
        editor.keyBinding.addKeyboardHandler(kb);
        inlineEditor.keyBinding.addKeyboardHandler(kb);
        inlineEditor.setTheme("ace/theme/solarized_light");
    }
});
});
