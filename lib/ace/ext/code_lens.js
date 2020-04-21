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
var event = require("../lib/event");
var lang = require("../lib/lang");
var dom = require("../lib/dom");

function clearLensElements(renderer) {
    var textLayer = renderer.$textLayer;
    var lensElements = textLayer.$lenses;
    if (lensElements)
        lensElements.forEach(function(el) {el.remove(); });
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
    var lensElements = textLayer.$lenses;
    if (!lineWidgets) {
        if (lensElements)
            clearLensElements(renderer);
        return;
    }

    var textCells = renderer.$textLayer.$lines.cells;
    var config = renderer.layerConfig;
    var padding = renderer.$padding;

    if (!lensElements)
        lensElements = textLayer.$lenses = [];


    var index = 0;
    for (var i = 0; i < textCells.length; i++) {
        var row = textCells[i].row;
        var widget = lineWidgets[row];
        var lenses = widget && widget.lenses;

        if (!lenses || !lenses.length) continue;

        var lensContainer = lensElements[index];
        if (!lensContainer) {
            lensContainer = lensElements[index]
                = dom.buildDom(["div", {class: "ace_codeLens"}], renderer.container);
        }
        lensContainer.style.height = config.lineHeight + "px";
        index++;

        for (var j = 0; j < lenses.length; j++) {
            var el = lensContainer.childNodes[2 * j];
            if (!el) {
                if (j != 0) lensContainer.appendChild(dom.createTextNode("\xa0|\xa0"));
                el = dom.buildDom(["a"], lensContainer);
            }
            el.textContent = lenses[j].title;
            el.lensCommand = lenses[j];
        }
        while (lensContainer.childNodes.length > 2 * j - 1)
            lensContainer.lastChild.remove();

        var top = renderer.$cursorLayer.getPixelPosition({
            row: row,
            column: 0
        }, true).top - config.lineHeight * widget.rowsAbove - config.offset;
        lensContainer.style.top = top + "px";

        var left = renderer.gutterWidth;
        var indent = session.getLine(row).search(/\S|$/);
        if (indent == -1)
            indent = 0;
        left += indent * config.characterWidth;
        left -= renderer.scrollLeft;
        lensContainer.style.paddingLeft = padding + left + "px";
    }
    while (index < lensElements.length)
        lensElements.pop().remove();
}

function clearCodeLensWidgets(session) {
    if (!session.lineWidgets) return;
    var widgetManager = session.widgetManager;
    session.lineWidgets.forEach(function(widget) {
        if (widget && widget.lenses)
            widgetManager.removeLineWidget(widget);
    });
}

exports.setLenses = function(session, lenses) {
    var firstRow = Number.MAX_VALUE;

    clearCodeLensWidgets(session);
    lenses && lenses.forEach(function(lens) {
        var row = lens.start.row;
        var column = lens.start.column;
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
        widget.lenses.push(lens.command);
        if (row < firstRow)
            firstRow = row;
    });
    session._emit("changeFold", {data: {start: {row: firstRow}}});
};

function attachToEditor(editor) {
    editor.codeLensProviders = [];
    editor.renderer.on("afterRender", renderWidgets);
    if (!editor.$codeLensClickHandler) {
        editor.$codeLensClickHandler = function(e) {
            var command = e.target.lensCommand;
            if (command)
                editor.execCommand(command.id, command.arguments);
        };
        event.addListener(editor.container, "click", editor.$codeLensClickHandler, editor);
    }
    editor.$updateLenses = function() {
        var session = editor.session;
        if (!session) return;

        if (!session.widgetManager) {
            session.widgetManager = new LineWidgets(session);
            session.widgetManager.attach(editor);
        }

        var providersToWaitNum = editor.codeLensProviders.length;
        var lenses = [];
        editor.codeLensProviders.forEach(function(provider) {
            provider.provideCodeLenses(session, function(err, payload) {
                if (err) return;
                payload.forEach(function(lens) {
                    lenses.push(lens);
                });
                providersToWaitNum--;
                if (providersToWaitNum == 0) {
                    applyLenses();
                }
            });
        });

        function applyLenses() {
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
        }
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
    if (editor.$codeLensClickHandler)
        editor.container.removeEventListener("click", editor.$codeLensClickHandler);
}

exports.registerCodeLensProvider = function(editor, codeLensProvider) {
    editor.setOption("enableCodeLens", true);
    editor.codeLensProviders.push(codeLensProvider);
    editor.$updateLensesOnInput();
};

exports.clear = function(session) {
    exports.setLenses(session, null);
};

var Editor = require("../editor").Editor;
require("../config").defineOptions(Editor.prototype, "editor", {
    enableCodeLens: {
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
.ace_codeLens {\
    position: absolute;\
    color: #aaa;\
    font-size: 88%;\
    background: inherit;\
    width: 100%;\
    display: flex;\
    align-items: flex-end;\
    pointer-events: none;\
}\
.ace_codeLens > a {\
    cursor: pointer;\
    pointer-events: auto;\
}\
.ace_codeLens > a:hover {\
    color: #0000ff;\
    text-decoration: underline;\
}\
.ace_dark > .ace_codeLens > a:hover {\
    color: #4e94ce;\
}\
", "");

});
