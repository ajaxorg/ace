"use strict";
var dom = require("../lib/dom");
var event = require("../lib/event");
var Tooltip = require("../tooltip").Tooltip;

function GutterHandler(mouseHandler) {
    var editor = mouseHandler.editor;
    var gutter = editor.renderer.$gutterLayer;
    var tooltip = new GutterTooltip(editor.container);

    mouseHandler.editor.setDefaultHandler("guttermousedown", function(e) {
        if (!editor.isFocused() || e.getButton() != 0)
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
        mouseHandler.setState("selectByLines");
        mouseHandler.captureMouse(e);
        return e.preventDefault();
    });


    var tooltipTimeout, mouseEvent, tooltipAnnotation;

    function showTooltip() {
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

        var annotationMessages = {error: [], warning: [], info: []};
        var annotationLabels = {
            error: {singular: "error", plural: "errors"}, 
            warning: {singular: "warning", plural: "warnings"},
            info: {singular: "information message", plural: "information messages"}
        };

        var iconClassName = gutter.$useSvgGutterIcons ? "ace_icon_svg" : "ace_icon";

        // Construct the body of the tooltip.
        for (var i = 0; i < annotation.text.length; i++) {
            var line = `<span class='ace_${annotation.type[i]} ${iconClassName}' aria-label='${annotationLabels[annotation.type[i]].singular}' role=img> </span> ${annotation.text[i]}`;
            annotationMessages[annotation.type[i]].push(line);
        }
        var tooltipBody = "<div class='ace_gutter-tooltip_body'>";
        tooltipBody += [].concat(annotationMessages.error, annotationMessages.warning, annotationMessages.info).join("<br>");
        tooltipBody += '</div>';    
        
        // Construct the header of the tooltip.
        var isMoreThanOneAnnotationType = false;
        var tooltipHeader = "<div class='ace_gutter-tooltip_header'>";
        for (var i = 0; i < 3; i++){
            var annotationType = ['error', 'warning', 'info'][i];
            if (annotationMessages[annotationType].length > 0){
                var label = annotationMessages[annotationType].length === 1 ? annotationLabels[annotationType].singular : annotationLabels[annotationType].plural;
                tooltipHeader += `${isMoreThanOneAnnotationType ? ', ' : ''}${annotationMessages[annotationType].length} ${label}`;
                isMoreThanOneAnnotationType = true;
            } 
        }
        tooltipHeader += "</div>";

        tooltipAnnotation = tooltipHeader + tooltipBody;

        tooltip.setHtml(tooltipAnnotation);
        tooltip.setClassName("ace_gutter-tooltip");
        tooltip.$element.setAttribute("aria-live", "polite");
        
        tooltip.show();
        editor._signal("showGutterTooltip", tooltip);
        editor.on("mousewheel", hideTooltip);

        if (mouseHandler.$tooltipFollowsMouse) {
            moveTooltip(mouseEvent);
        } else {
            var gutterElement = mouseEvent.domEvent.target;
            var rect = gutterElement.getBoundingClientRect();
            var style = tooltip.getElement().style;
            style.left = rect.right + "px";
            style.top = rect.bottom + "px";
        }
    }

    function hideTooltip() {
        if (tooltipTimeout)
            tooltipTimeout = clearTimeout(tooltipTimeout);
        if (tooltipAnnotation) {
            tooltip.hide();
            tooltipAnnotation = null;
            editor._signal("hideGutterTooltip", tooltip);
            editor.off("mousewheel", hideTooltip);
        }
    }

    function moveTooltip(e) {
        tooltip.setPosition(e.x, e.y);
    }

    mouseHandler.editor.setDefaultHandler("guttermousemove", function(e) {
        var target = e.domEvent.target || e.domEvent.srcElement;
        if (dom.hasCssClass(target, "ace_fold-widget"))
            return hideTooltip();

        if (tooltipAnnotation && mouseHandler.$tooltipFollowsMouse)
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
    }, editor);
    
    editor.on("changeSession", hideTooltip);
}

class GutterTooltip extends Tooltip {
    setPosition(x, y) {
        var windowWidth = window.innerWidth || document.documentElement.clientWidth;
        var windowHeight = window.innerHeight || document.documentElement.clientHeight;
        var width = this.getWidth();
        var height = this.getHeight();
        x += 15;
        y += 15;
        if (x + width > windowWidth) {
            x -= (x + width) - windowWidth;
        }
        if (y + height > windowHeight) {
            y -= 20 + height;
        }
        Tooltip.prototype.setPosition.call(this, x, y);
    }

}

exports.GutterHandler = GutterHandler;
