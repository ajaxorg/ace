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

    var annotationLabels = {
        error: {singular: "error", plural: "errors"}, 
        warning: {singular: "warning", plural: "warnings"},
        info: {singular: "information message", plural: "information messages"}
    };

    function showTooltip() {
        var row = mouseEvent.getDocumentPosition().row;
        var rowAnnotation = gutter.$annotations[row];
        var annotation;

        if (rowAnnotation)
            annotation = {text: [...rowAnnotation.text], type: [...rowAnnotation.type]};

        // If the tooltip is for a row which has a closed fold, check whether there are
        // annotations in the folded lines. If so, add a summary to the list of annotations.
        var fold = gutter.session.getNextFoldLine(row);
        if (fold){
            var foldedAnnotationMessages = {error: [], warning: [], info: []};
            var mostSevereFoldedAnnotationType;

            for (var i = row + 1; i <= fold.end.row; i++){
                if (!gutter.$annotations[i])
                    continue;

                for (var j = 0; j < gutter.$annotations[i].text.length; j++) {
                    var annotationType = gutter.$annotations[i].type[j];
                    foldedAnnotationMessages[annotationType].push(gutter.$annotations[i].text[j]);

                    if (!mostSevereFoldedAnnotationType){
                        mostSevereFoldedAnnotationType = annotationType;
                        continue;
                    }

                    if (annotationType == "error"){
                        mostSevereFoldedAnnotationType = annotationType;
                        continue;
                    }

                    if (annotationType == "warning" && mostSevereFoldedAnnotationType == "info"){
                        mostSevereFoldedAnnotationType = annotationType;
                        continue;
                    }
                }
            }
            var summaryFoldedAnnotations = `${annotationsToSummaryString(foldedAnnotationMessages)} in folded code.`;

            if (mostSevereFoldedAnnotationType == "error" || mostSevereFoldedAnnotationType == "warning"){
                if (!annotation)
                    annotation = {text: [], type: []};

                annotation.text.push(summaryFoldedAnnotations);
                annotation.type.push(mostSevereFoldedAnnotationType);
            }
        }
        
        if (!annotation || annotation.text == 0){
            return hideTooltip();
        }

        var maxRow = editor.session.getLength();
        if (row == maxRow) {
            var screenRow = editor.renderer.pixelToScreenCoordinates(0, mouseEvent.y).row;
            var pos = mouseEvent.$pos;
            if (screenRow > editor.session.documentToScreenRow(pos.row, pos.column))
                return hideTooltip();
        }

        var annotationMessages = {error: [], warning: [], info: []};
        var iconClassName = gutter.$useSvgGutterIcons ? "ace_icon_svg" : "ace_icon";

        // Construct the contents of the tooltip.
        for (var i = 0; i < annotation.text.length; i++) {
            var line = `<span class='ace_${annotation.type[i]} ${iconClassName}' aria-label='${annotationLabels[annotation.type[i]].singular}' role=img> </span> ${annotation.text[i]}`;
            annotationMessages[annotation.type[i]].push(line);
        }
        tooltipAnnotation = [].concat(annotationMessages.error, annotationMessages.warning, annotationMessages.info).join("<br>");
 
        tooltip.setHtml(tooltipAnnotation);
        tooltip.setClassName("ace_gutter-tooltip");
        tooltip.$element.setAttribute("aria-live", "polite");
        
        tooltip.show();
        editor._signal("showGutterTooltip", tooltip);
        editor.on("mousewheel", hideTooltip);

        if (mouseHandler.$tooltipFollowsMouse) {
            moveTooltip(mouseEvent);
        } else {
            var gutterElement = gutter.$lines.cells[row].element.children[1];
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

    function annotationsToSummaryString(annotations) {
        var isMoreThanOneAnnotationType = false;
        var summaryString = "";
        for (var i = 0; i < 3; i++){
            var annotationType = ['error', 'warning', 'info'][i];
            if (annotations[annotationType].length > 0){
                var label = annotations[annotationType].length === 1 ? annotationLabels[annotationType].singular : annotationLabels[annotationType].plural;
                summaryString += `${isMoreThanOneAnnotationType ? ', ' : ''}${annotations[annotationType].length} ${label}`;
                isMoreThanOneAnnotationType = true;
            } 
        }
        return summaryString;
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
