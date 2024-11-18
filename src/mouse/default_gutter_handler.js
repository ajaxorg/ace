"use strict";
/**
 * @typedef {import("./mouse_handler").MouseHandler} MouseHandler
 */
var dom = require("../lib/dom");
var event = require("../lib/event");
var Tooltip = require("../tooltip").Tooltip;
var nls = require("../config").nls;
var lang = require("../lib/lang");

/**
 * @param {MouseHandler} mouseHandler
 * @this {MouseHandler}
 */
function GutterHandler(mouseHandler) {
    var editor = mouseHandler.editor;
    var gutter = editor.renderer.$gutterLayer;
    var tooltip = new GutterTooltip(editor);

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

    var tooltipTimeout, mouseEvent;

    function showTooltip() {
        var row = mouseEvent.getDocumentPosition().row;

        var maxRow = editor.session.getLength();
        if (row == maxRow) {
            var screenRow = editor.renderer.pixelToScreenCoordinates(0, mouseEvent.y).row;
            var pos = mouseEvent.$pos;
            if (screenRow > editor.session.documentToScreenRow(pos.row, pos.column))
                return hideTooltip();
        }

        tooltip.showTooltip(row);

        if (!tooltip.isOpen)
            return;

        editor.on("mousewheel", hideTooltip);

        if (mouseHandler.$tooltipFollowsMouse) {
            moveTooltip(mouseEvent);
        } else {
            var gutterRow = mouseEvent.getGutterRow();
            var gutterCell = gutter.$lines.get(gutterRow);
            if (gutterCell) {
                var gutterElement = gutterCell.element.querySelector(".ace_gutter_annotation");
                var rect = gutterElement.getBoundingClientRect();
                var style = tooltip.getElement().style;
                style.left = rect.right + "px";
                style.top = rect.bottom + "px";
            } else {
                moveTooltip(mouseEvent);
            }
        }
    }

    function hideTooltip() {
        if (tooltipTimeout)
            tooltipTimeout = clearTimeout(tooltipTimeout);
        if (tooltip.isOpen) {
            tooltip.hideTooltip();
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

        if (tooltip.isOpen && mouseHandler.$tooltipFollowsMouse)
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
        if (!tooltip.isOpen || tooltipTimeout)
            return;

        tooltipTimeout = setTimeout(function() {
            tooltipTimeout = null;
            hideTooltip();
        }, 50);
    }, editor);
    
    editor.on("changeSession", hideTooltip);
    editor.on("input", hideTooltip);
}

exports.GutterHandler = GutterHandler;

class GutterTooltip extends Tooltip {
    constructor(editor) {
        super(editor.container);
        this.editor = editor;
    }

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
    
    static get annotationLabels() {
        return {
            error: {
                singular: nls("gutter-tooltip.aria-label.error.singular", "error"),
                plural: nls("gutter-tooltip.aria-label.error.plural", "errors")
            },
            security: {
                singular: nls("gutter-tooltip.aria-label.security.singular", "security finding"),
                plural: nls("gutter-tooltip.aria-label.security.plural", "security findings")
            },
            warning: {
                singular: nls("gutter-tooltip.aria-label.warning.singular", "warning"),
                plural: nls("gutter-tooltip.aria-label.warning.plural", "warnings")
            },
            info: {
                singular: nls("gutter-tooltip.aria-label.info.singular", "information message"),
                plural: nls("gutter-tooltip.aria-label.info.plural", "information messages")
            },
            hint: {
                singular: nls("gutter-tooltip.aria-label.hint.singular", "suggestion"),
                plural: nls("gutter-tooltip.aria-label.hint.plural", "suggestions")
            }
        };
    }

    showTooltip(row) {
        var gutter = this.editor.renderer.$gutterLayer;
        var annotationsInRow = gutter.$annotations[row];
        var annotation;

        if (annotationsInRow)
            annotation = {
                displayText: Array.from(annotationsInRow.displayText),
                type: Array.from(annotationsInRow.type)
            };
        else annotation = {displayText: [], type: []};

        // If the tooltip is for a row which has a closed fold, check whether there are
        // annotations in the folded lines. If so, add a summary to the list of annotations.
        var fold = gutter.session.getFoldLine(row);
        if (fold && gutter.$showFoldedAnnotations) {
            var annotationsInFold = {error: [], security: [], warning: [], info: [], hint: []};
            var severityRank = {error: 1, security: 2, warning: 3, info: 4, hint: 5};
            var mostSevereAnnotationTypeInFold;

            for (let i = row + 1; i <= fold.end.row; i++) {
                if (!gutter.$annotations[i]) continue;

                for (var j = 0; j < gutter.$annotations[i].text.length; j++) {
                    var annotationType = gutter.$annotations[i].type[j];
                    annotationsInFold[annotationType].push(gutter.$annotations[i].text[j]);

                    if (
                        !mostSevereAnnotationTypeInFold ||
                        severityRank[annotationType] < severityRank[mostSevereAnnotationTypeInFold]
                    ) {
                        mostSevereAnnotationTypeInFold = annotationType;
                    }
                }
            }

            if (["error", "security", "warning"].includes(mostSevereAnnotationTypeInFold)) {
                var summaryFoldedAnnotations = `${GutterTooltip.annotationsToSummaryString(
                    annotationsInFold
                )} in folded code.`;

                annotation.displayText.push(summaryFoldedAnnotations);
                annotation.type.push(mostSevereAnnotationTypeInFold + "_fold");
            }
        }

        if (annotation.displayText.length === 0) return this.hide();

        var annotationMessages = {error: [], security: [], warning: [], info: [], hint: []};
        var iconClassName = gutter.$useSvgGutterIcons ? "ace_icon_svg" : "ace_icon";

        // Construct the contents of the tooltip.
        for (let i = 0; i < annotation.displayText.length; i++) {
            var lineElement = dom.createElement("span");

            var iconElement = dom.createElement("span");
            iconElement.classList.add(...[`ace_${annotation.type[i]}`, iconClassName]);
            iconElement.setAttribute(
                "aria-label",
                `${GutterTooltip.annotationLabels[annotation.type[i].replace("_fold", "")].singular}`
            );
            iconElement.setAttribute("role", "img");
            // Set empty content to the img span to get it to show up
            iconElement.appendChild(dom.createTextNode(" "));

            lineElement.appendChild(iconElement);
            lineElement.appendChild(dom.createTextNode(annotation.displayText[i]));
            lineElement.appendChild(dom.createElement("br"));

            annotationMessages[annotation.type[i].replace("_fold", "")].push(lineElement);
        }

        // Clear the current tooltip content
        var tooltipElement = this.getElement();
        dom.removeChildren(tooltipElement);

        // Update the tooltip content
        annotationMessages.error.forEach((el) => tooltipElement.appendChild(el));
        annotationMessages.security.forEach((el) => tooltipElement.appendChild(el));
        annotationMessages.warning.forEach((el) => tooltipElement.appendChild(el));
        annotationMessages.info.forEach((el) => tooltipElement.appendChild(el));
        annotationMessages.hint.forEach((el) => tooltipElement.appendChild(el));

        tooltipElement.setAttribute("aria-live", "polite");

        if (!this.isOpen) {
            this.setTheme(this.editor.renderer.theme);
            this.setClassName("ace_gutter-tooltip");
        }

        this.show();
        this.editor._signal("showGutterTooltip", this);
    }

    hideTooltip() {
        this.$element.removeAttribute("aria-live");
        this.hide();
        this.editor._signal("hideGutterTooltip", this);
    }

    static annotationsToSummaryString(annotations) {
        const summary = [];
        const annotationTypes = ["error", "security", "warning", "info", "hint"];
        for (const annotationType of annotationTypes) {
            if (!annotations[annotationType].length) continue;
            const label = annotations[annotationType].length === 1 ? GutterTooltip.annotationLabels[annotationType].singular : GutterTooltip.annotationLabels[annotationType].plural;
            summary.push(`${annotations[annotationType].length} ${label}`);
        }
        return summary.join(", ");
    }
}

exports.GutterTooltip = GutterTooltip;
