"use strict";

var dom = require("./lib/dom");
var HoverTooltip = require("./tooltip").HoverTooltip;

/*
Potential improvements:
- cap the length of rendered marker range
- save rendered markers and only search through rendered markers when looking for hover match
- don't cut off total amount of markers at 500
*/

class TooltipMarkerGroup {
    constructor() {
        this.markers = [];
    }

    /**
     * Comparator for Array.sort function, which sorts marker definitions by priority descending.
     * If priority is not specifed or it's not a number, it will fallback to default value of 0.
     * 
     * @param {Ace.TooltipMarker} a first marker.
     * @param {Ace.TooltipMarker} b second marker.
     * @returns {number} negative number if a should be before b, positive number if b should be before a, 0 otherwise.
     */
    markersComparator(a, b) {
        const priorityA = typeof a.priority === 'number' ? a.priority : 0;
        const priorityB = typeof b.priority === 'number' ? b.priority : 0;
        return priorityB - priorityA;
    }

    /**
     * Sets marker definitions to be rendered. Limits the number of markers at MAX_MARKERS.
     * @param {Ace.TooltipMarker[]} markers an array of marker definitions.
     */
    setMarkers(markers) {
        this.markers = [...markers].sort(this.markersComparator).slice(0, this.MAX_MARKERS);
    }

    update(html, markerLayer, session, config) {
        if (!this.markers || !this.markers.length)
            return;
        const visibleRangeStartRow = config.firstRow, visibleRangeEndRow = config.lastRow;
        this.renderedMarkerRanges = {};

        // TODO: if there are markers with overlapping ranges, do we merge them? if yes, how do we merge them?

        for (var i = 0; i < this.markers.length; i++) {
            const marker = this.markers[i];

            const markerVisibleRange = marker.range.clipRows(visibleRangeStartRow, visibleRangeEndRow);
            if (markerVisibleRange.start.row === markerVisibleRange.end.row
                && markerVisibleRange.start.column === markerVisibleRange.end.column) {
                    continue; // visible range is empty
                }

            const rangeToAddMarkerTo = markerVisibleRange.toScreenRange(session);
            const rangeAsString = rangeToAddMarkerTo.toString();
            if (this.renderedMarkerRanges[rangeAsString]) continue;

            this.renderedMarkerRanges[rangeAsString] = true;
            if (rangeToAddMarkerTo.isMultiLine()) {
                markerLayer.drawTextMarker(html, rangeToAddMarkerTo, marker.className, config);
            } else {
                markerLayer.drawSingleLineMarker(html, rangeToAddMarkerTo, marker.className, config);
            }
        }
    };

};

// this caps total amount of markers at 500 - should it maybe be done only for rendered markers?
// on top of it, do we need to cap the length of a rendered marker range to avoid performance issues?
TooltipMarkerGroup.prototype.MAX_MARKERS = 500;

exports.TooltipMarkerGroup = TooltipMarkerGroup;


class TooltipMarkerManager {
    /**
     * Creates TooltipMarkerManager object. Creates HoverTooltip object and adds
     * hoverTooltip mouse event listener to editor, which will make it react to hover.
     * 
     * @param {Ace.Editor} editor hoverTooltip will listen to mouse events in this editor.
     */
    constructor(editor) {
        this.markerTooltipGroups = {};
        this.hoverTooltip = new HoverTooltip();
        this.hoverTooltip.setDataProvider((event, editor) => {
            const session = editor.session;
            if (!session) return;
            const docPos = event.getDocumentPosition();
            const hoveredMarker = this.getMarkerForPosition(docPos, session);
            if (!hoveredMarker) return;

            var domNode = dom.buildDom(["div", {class: "ace_marker-tooltip"},
                ["span", {}, hoveredMarker.tooltipText]]);
            this.hoverTooltip.showForRange(editor, hoveredMarker.range, domNode, event);
        });
        this.hoverTooltip.addToEditor(editor);
    }

    /**
     * Sets tooltip marker group for an edit session. When hover event occurs while that
     * session is active, markers from that group will be matched against hover position
     * in the document to determine which tooltip to display.
     * 
     * @param {Ace.TooltipMarkerGroup} tooltipMarkerGroup marker group.
     * @param {Ace.EditSession} session edit session.
     */
    setMarkerGroupForSession(tooltipMarkerGroup, session) {
        this.markerTooltipGroups[session.id] = tooltipMarkerGroup;
    }

    /**
     * Gets tooltip marker for document position in a provided session, if present.
     * 
     * @param {Object} pos The object with two properties: `row` and `column`.
     * @param {Ace.EditSession} session EditSession object.
     * @returns {Ace.TooltipMarker | undefined} Tooltip marker definition or undefined.
     */
    getMarkerForPosition(pos, session) {
        const markerGroupForSession = this.markerTooltipGroups[session.id];
        if (!markerGroupForSession) return;
        const markersForSession = markerGroupForSession.markers || [];
        return markersForSession.find((marker) => marker.range.contains(pos.row, pos.column));
    }

    /**
     * Removes the tooltip from the DOM.
     */
    destroy() {
        this.hoverTooltip.destroy();
    }
}

exports.TooltipMarkerManager = TooltipMarkerManager;
