"use strict";
/**
 * @typedef {import("./mouse_handler").MouseHandler} MouseHandler
 */
var dom = require("../lib/dom");
var MouseEvent = require("./mouse_event").MouseEvent;
var HoverTooltip = require("../tooltip").HoverTooltip;
var nls = require("../config").nls;
var Range = require("../range").Range;

/**
 * @param {MouseHandler} mouseHandler
 * @this {MouseHandler}
 */
function GutterHandler(mouseHandler) {
    var editor = mouseHandler.editor;
    var gutter = editor.renderer.$gutterLayer;
    mouseHandler.$tooltip = new GutterTooltip(editor);
    mouseHandler.$tooltip.addToEditor(editor);

    mouseHandler.$tooltip.setDataProvider(function(e, editor) {
        var row = e.getDocumentPosition().row;
        mouseHandler.$tooltip.showTooltip(row);
    });

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
}

exports.GutterHandler = GutterHandler;


class GutterTooltip extends HoverTooltip {
    /**
     * @param {import("../editor").Editor} editor
     */
    constructor(editor) {
        super(editor.container);
        this.id = "gt" + (++GutterTooltip.$uid);
        this.editor = editor;
        /**@type {Number | Undefined}*/
        this.visibleTooltipRow;
        var el = this.getElement();
        el.setAttribute("role", "tooltip");
        el.setAttribute("id", this.id);
        el.style.pointerEvents = "auto";
        this.idleTime = 50;

        this.onDomMouseMove = this.onDomMouseMove.bind(this);
        this.onDomMouseOut = this.onDomMouseOut.bind(this);

        this.setClassName("ace_gutter-tooltip");
    }
    
    onDomMouseMove(domEvent) {
        var aceEvent = new MouseEvent(domEvent, this.editor);
        this.onMouseMove(aceEvent, this.editor);
    }
    
    onDomMouseOut(domEvent) {
        var aceEvent = new MouseEvent(domEvent, this.editor);
        this.onMouseOut(aceEvent);
    }

    addToEditor(editor) {
        var gutter = editor.renderer.$gutter;
        gutter.addEventListener("mousemove", this.onDomMouseMove);
        gutter.addEventListener("mouseout", this.onDomMouseOut);
        super.addToEditor(editor);
    }

    removeFromEditor(editor) {
        var gutter = editor.renderer.$gutter;
        gutter.removeEventListener("mousemove", this.onDomMouseMove);
        gutter.removeEventListener("mouseout", this.onDomMouseOut);
        super.removeFromEditor(editor);
    }

    destroy() {
        if (this.editor) {
            this.removeFromEditor(this.editor);
        }
        super.destroy();
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

    /**
     * @param {number} row
     */
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

            for (var i = row + 1; i <= fold.end.row; i++) {
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
        for (var i = 0; i < annotation.displayText.length; i++) {
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

        var tooltipElement = dom.createElement("span");

        // Update the tooltip content
        annotationMessages.error.forEach((el) => tooltipElement.appendChild(el));
        annotationMessages.security.forEach((el) => tooltipElement.appendChild(el));
        annotationMessages.warning.forEach((el) => tooltipElement.appendChild(el));
        annotationMessages.info.forEach((el) => tooltipElement.appendChild(el));
        annotationMessages.hint.forEach((el) => tooltipElement.appendChild(el));

        tooltipElement.setAttribute("aria-live", "polite");

        var annotationNode = this.$findLinkedAnnotationNode(row);
        if (annotationNode) {
            annotationNode.setAttribute("aria-describedby", this.id);
        }

        var range = Range.fromPoints({row, column: 0}, {row, column: 0});
        this.showForRange(this.editor, range, tooltipElement);
        this.visibleTooltipRow = row;
        this.editor._signal("showGutterTooltip", this);
    }

    $setPosition(editor, _ignoredPosition, _withMarker, range) {
        var gutterCell = this.$findCellByRow(range.start.row);
        if (!gutterCell) return;
        var el = gutterCell && gutterCell.element;
        var anchorEl = el && (el.querySelector(".ace_gutter_annotation"));
        if (!anchorEl) return;
        var r = anchorEl.getBoundingClientRect();
        if (!r) return;
        var position = {
            pageX: r.right,
            pageY: r.top
        };
        //we don't need marker for gutter
        return super.$setPosition(editor, position, false, range);
    }

    $shouldPlaceAbove(labelHeight, anchorTop, spaceBelow) {
        return spaceBelow < labelHeight;
    }

    $findLinkedAnnotationNode(row) {
        var cell = this.$findCellByRow(row);
        if (cell) {
            var element = cell.element;
            if (element.childNodes.length > 2) {
                return element.childNodes[2];
            }
        }
    }

    $findCellByRow(row) {
        return this.editor.renderer.$gutterLayer.$lines.cells.find((el) => el.row === row);
    }

    hide(e) {
        if(!this.isOpen){
            return;
        }
        this.$element.removeAttribute("aria-live");

        if (this.visibleTooltipRow != undefined) {
            var annotationNode = this.$findLinkedAnnotationNode(this.visibleTooltipRow);
            if (annotationNode) {
                annotationNode.removeAttribute("aria-describedby");
            }
        }
        this.visibleTooltipRow = undefined;
        this.editor._signal("hideGutterTooltip", this);
        super.hide(e);
    }

    static annotationsToSummaryString(annotations) {
        var summary = [];
        var annotationTypes = ["error", "security", "warning", "info", "hint"];
        for (var annotationType of annotationTypes) {
            if (!annotations[annotationType].length) continue;
            var label = annotations[annotationType].length === 1 ? GutterTooltip.annotationLabels[annotationType].singular : GutterTooltip.annotationLabels[annotationType].plural;
            summary.push(`${annotations[annotationType].length} ${label}`);
        }
        return summary.join(", ");
    }

    /**
     * Check if cursor is outside gutter
     * @param e
     * @return {boolean}
     */
    isOutsideOfText(e) {
        var editor = e.editor;
        var rect = editor.renderer.$gutter.getBoundingClientRect();
        return !(e.clientX >= rect.left && e.clientX <= rect.right &&
               e.clientY >= rect.top && e.clientY <= rect.bottom);
    }
}

GutterTooltip.$uid = 0;

exports.GutterTooltip = GutterTooltip;
