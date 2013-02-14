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
var dom = require("../lib/dom");
var event = require("../lib/event");

function GutterHandler(mouseHandler) {
    var editor = mouseHandler.editor;
    var gutter = editor.renderer.$gutterLayer;

    mouseHandler.editor.setDefaultHandler("guttermousedown", function(e) {
        if (!editor.isFocused())
            return;
        var gutterRegion = gutter.getRegion(e);

        if (gutterRegion == "foldWidgets")
            return;

        var row = e.getDocumentPosition().row;
        var selection = editor.session.selection;

        if (e.getShiftKey())
            selection.selectTo(row, 0);
        else {
            if (e.domEvent.detail == 2) {
                editor.selectAll();
                return e.preventDefault();
            }
            mouseHandler.$clickSelection = editor.selection.getLineRange(row);
        }
        mouseHandler.captureMouse(e, "selectByLines");
        return e.preventDefault();
    });


    var tooltipTimeout, mouseEvent, tooltip, tooltipAnnotation;
    function createTooltip() {
        tooltip = dom.createElement("div");
        tooltip.className = "ace_gutter-tooltip";
        tooltip.style.display = "none";
        editor.container.appendChild(tooltip);
    }

    function showTooltip() {
        if (!tooltip) {
            createTooltip();
        }
        var row = mouseEvent.getDocumentPosition().row;
        var annotation = gutter.$annotations[row];
        if (!annotation)
            return hideTooltip();

        var maxRow = editor.session.getLength();
        if (row == maxRow) {
            var screenRow = editor.renderer.pixelToScreenCoordinates(0, mouseEvent.y).row;
            var pos = mouseEvent.$pos;
            if (screenRow > editor.session.documentToScreenRow(pos.row, pos.column))
                return hideTooltip();
        }

        if (tooltipAnnotation == annotation)
            return;
        tooltipAnnotation = annotation.text.join("<br/>");

        tooltip.style.display = "block";
        tooltip.innerHTML = tooltipAnnotation;
        editor.on("mousewheel", hideTooltip);

        moveTooltip(mouseEvent);
    }

    function hideTooltip() {
        if (tooltipTimeout)
            tooltipTimeout = clearTimeout(tooltipTimeout);
        if (tooltipAnnotation) {
            tooltip.style.display = "none";
            tooltipAnnotation = null;
            editor.removeEventListener("mousewheel", hideTooltip);
        }
    }

    function moveTooltip(e) {
        var rect = editor.renderer.$gutter.getBoundingClientRect();
        tooltip.style.left = e.x + 15 + "px";
        if (e.y + 3 * editor.renderer.lineHeight + 15 < rect.bottom) {
            tooltip.style.bottom =  "";
            tooltip.style.top =  e.y + 15 + "px";
        } else {
            tooltip.style.top =  "";
            tooltip.style.bottom = rect.bottom - e.y + 5 + "px";
        }
    }

    mouseHandler.editor.setDefaultHandler("guttermousemove", function(e) {
        var target = e.domEvent.target || e.domEvent.srcElement;
        if (dom.hasCssClass(target, "ace_fold-widget"))
            return hideTooltip();

        if (tooltipAnnotation)
            moveTooltip(e);

        mouseEvent = e;
        if (tooltipTimeout)
            return;
        tooltipTimeout = setTimeout(function() {
            tooltipTimeout = null;
            if (mouseEvent && !mouseHandler.isMousePressed)
                showTooltip();
            else
                hideTooltip();
        }, 50);
    });

    event.addListener(editor.renderer.$gutter, "mouseout", function(e) {
        mouseEvent = null;
        if (!tooltipAnnotation || tooltipTimeout)
            return;

        tooltipTimeout = setTimeout(function() {
            tooltipTimeout = null;
            hideTooltip();
        }, 50);
    });

}

exports.GutterHandler = GutterHandler;

});
