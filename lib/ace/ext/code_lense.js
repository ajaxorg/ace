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
var LineWidgets = require("../line_widgets").LineWidgets;
var lang = require("../lib/lang");
var dom = require("../lib/dom");

function clearLenseElements(renderer) {
    var textLayer = renderer.$textLayer;
    var lenseElements = textLayer.$lenses;
    if (lenseElements)
        lenseElements.forEach(function(el) {el.remove(); });
    textLayer.$lenses = null;
}

function renderWidgets(changes, renderer) {
    var changed = changes & renderer.CHANGE_LINES 
        || changes & renderer.CHANGE_FULL 
        || changes & renderer.CHANGE_SCROLL
        || changes & renderer.CHANGE_TEXT;
    if (!changed) 
        return;
    
    var session = renderer.session;
    var lineWidgets = renderer.session.lineWidgets;
    var textLayer = renderer.$textLayer;
    var lenseElements = textLayer.$lenses;
    if (!lineWidgets) {
        if (lenseElements)
            clearLenseElements(renderer);
        return;
    }

    var textCells = renderer.$textLayer.$lines.cells;
    var config = renderer.layerConfig;
    var padding = renderer.$padding;

    if (!lenseElements)
        lenseElements = textLayer.$lenses = [];


    var index = 0;
    for (var i = 0; i < textCells.length; i++) {
        var row = textCells[i].row;
        var widget = lineWidgets[row];
        var lenses = widget && widget.lenses;

        if (!lenses || !lenses.length) continue;

        var lenseContainer = lenseElements[index];
        if (!lenseContainer) {
            lenseContainer = lenseElements[index]
                = dom.buildDom(["div", {class: "ace_codeLense"}], renderer.container);
        }
        lenseContainer.style.height = config.lineHeight + "px";
        index++;

        for (var j = 0; j < lenses.length; j++) {
            var el = lenseContainer.childNodes[2 * j];
            if (!el) {
                if (j != 0) lenseContainer.appendChild(dom.createTextNode("\xa0|\xa0"));
                el = dom.buildDom(["a"], lenseContainer);
            }
            el.textContent = lenses[j].title;
            el.lenseCommand = lenses[j];
        }
        while (lenseContainer.childNodes.length > 2 * j - 1) 
            lenseContainer.lastChild.remove();

        var top = renderer.$cursorLayer.getPixelPosition({
            row: row,
            column: 0
        }, true).top - config.lineHeight * widget.rowsAbove - config.offset;
        lenseContainer.style.top = top + "px";
        
        var left = renderer.gutterWidth;
        var indent = session.getLine(row).search(/\S|$/);
        if (indent == -1)
            indent = 0;
        left += indent * config.characterWidth;
        left -= renderer.scrollLeft;
        lenseContainer.style.paddingLeft = padding + left + "px";
    }
    while (index < lenseElements.length)
        lenseElements.pop().remove();
}

function clearCodeLenseWidgets(session) {
    if (!session.lineWidgets) return;
    var widgetManager = session.widgetManager;
    session.lineWidgets.forEach(function(widget) {
        if (widget && widget.lenses)
            widgetManager.removeLineWidget(widget);
    });
}

exports.setLenses = function(session, lenses) {
    var firstRow = Number.MAX_VALUE;

    clearCodeLenseWidgets(session);
    lenses && lenses.forEach(function(lense) {
        var row = lense.start.row;
        var column = lense.start.column;
        var widget = session.lineWidgets && session.lineWidgets[row];
        if (!widget || !widget.lenses) {
            widget = session.widgetManager.$registerLineWidget({
                rowCount: 1,
                rowsAbove: 1,
                row: row,
                column: column,
                lenses: []
            });
        }
        widget.lenses.push(lense.command);
        if (row < firstRow)
            firstRow = row;
    });
    session._emit("changeFold", {data: {start: {row: firstRow}}});
    
    
};

function attachToEditor(editor) {
    var session = editor.session;
    if (!session.widgetManager) {
        session.widgetManager = new LineWidgets(session);
        session.widgetManager.attach(editor);
    }
    editor.renderer.on("afterRender", renderWidgets);
    editor.$codeLenseClickHandler = function(e) {
        var command = e.target.lenseCommand;
        if (command)
            editor.execCommand(command.id, command.arguments);
    };
    editor.container.addEventListener("click", editor.$codeLenseClickHandler);
    editor.$updateLenses = function() {
        var session = editor.session;
        if (!session) return;
        var codeLensProvider = session.codeLensProvider || session.$mode.codeLensProvider;
        var lenses = codeLensProvider && codeLensProvider.provideCodeLenses(session);
        
        var cursor = session.selection.cursor;
        var oldRow = session.documentToScreenRow(cursor);
        exports.setLenses(session, lenses);
        
        var lastDelta = session.$undoManager && session.$undoManager.$lastDelta;
        if (lastDelta && lastDelta.action == "remove" && lastDelta.lines.length > 1)
            return;
        var row = session.documentToScreenRow(cursor);
        var lineHeight = editor.renderer.layerConfig.lineHeight;
        var top = session.getScrollTop() + (row - oldRow) * lineHeight;
        session.setScrollTop(top);
    };
    var updateLenses = lang.delayedCall(editor.$updateLenses);
    editor.$updateLensesOnInput = function() {
        updateLenses.delay(250);
    };
    editor.on("input", editor.$updateLensesOnInput);
}

function detachFromEditor(editor) {
    editor.off("input", editor.$updateLensesOnInput);
    editor.renderer.off("afterRender", renderWidgets);
    if (editor.$codeLenseClickHandler)
        editor.container.removeEventListener("click", editor.$codeLenseClickHandler);
}

exports.setCodeLenseProvider = function(editor, codeLensProvider) {
    editor.setOption("enableCodeLense", true);
    editor.session.codeLensProvider = codeLensProvider;
    editor.$updateLensesOnInput();
};

exports.clear = function(session) {
    exports.setLenses(session, null);
};

var Editor = require("../editor").Editor;
require("../config").defineOptions(Editor.prototype, "editor", {
    enableCodeLense: {
        set: function(val) {
            if (val) {
                attachToEditor(this);
            } else {
                detachFromEditor(this);
            }
        }
    }
});

dom.importCssString("\
.ace_codeLense {\
    position: absolute;\
    color: #aaa;\
    font-size: 88%;\
    background: inherit;\
    width: 100%;\
    display: flex;\
    align-items: flex-end;\
    pointer-events: none;\
}\
.ace_codeLense > a {\
    cursor: pointer;\
    pointer-events: auto;\
}\
.ace_codeLense > a:hover {\
    color: #0000ff;\
    text-decoration: underline;\
}\
.ace_dark > .ace_codeLense > a:hover {\
    color: #4e94ce;\
}\
", "");

});
