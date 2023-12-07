"use strict";
/**
 * @typedef {import("./edit_session").EditSession} EditSession
 * @typedef {{range: import("./range").Range, className: string}} MarkerGroupItem
 */
/**
 * @typedef {import("./layer/marker").Marker} Marker
 */

/*
Potential improvements:
- use binary search when looking for hover match
*/

class MarkerGroup {
    /**
     * @param {EditSession} session
     */
    constructor(session) {
        this.markers = [];
        /**@type {EditSession}*/
        this.session = session;
        // @ts-expect-error TODO: could potential error here, or most likely missing checks in other places
        session.addDynamicMarker(this);
    }

    /**
     * Finds the first marker containing pos
     * @param {import("../ace-internal").Ace.Point} pos 
     * @returns import("../ace-internal").Ace.MarkerGroupItem
     */
    getMarkerAtPosition(pos) {
        return this.markers.find(function(marker) {
            return marker.range.contains(pos.row, pos.column);
        });
    }

    /**
     * Comparator for Array.sort function, which sorts marker definitions by their positions
     * 
     * @param {MarkerGroupItem} a first marker.
     * @param {MarkerGroupItem} b second marker.
     * @returns {number} negative number if a should be before b, positive number if b should be before a, 0 otherwise.
     */
    markersComparator(a, b) {
        return a.range.start.row - b.range.start.row;
    }

    /**
     * Sets marker definitions to be rendered. Limits the number of markers at MAX_MARKERS.
     * @param {MarkerGroupItem[]} markers an array of marker definitions.
     */
    setMarkers(markers) {
        this.markers = markers.sort(this.markersComparator).slice(0, this.MAX_MARKERS);
        this.session._signal("changeBackMarker");
    }

    /**
     * @param {any} html
     * @param {Marker} markerLayer
     * @param {EditSession} session
     * @param {{ firstRow: any; lastRow: any; }} config
     */
    update(html, markerLayer, session, config) {
        if (!this.markers || !this.markers.length)
            return;
        var visibleRangeStartRow = config.firstRow, visibleRangeEndRow = config.lastRow;
        var foldLine;
        var markersOnOneLine = 0;
        var lastRow = 0;

        for (var i = 0; i < this.markers.length; i++) {
            var marker = this.markers[i];

            if (marker.range.end.row < visibleRangeStartRow) continue;
            if (marker.range.start.row > visibleRangeEndRow) continue;

            if (marker.range.start.row === lastRow) {
                markersOnOneLine++;
            } else {
                lastRow = marker.range.start.row;
                markersOnOneLine = 0;
            }
            // do not render too many markers on one line
            // because we do not have virtual scroll for horizontal direction
            if (markersOnOneLine > 200) {
                continue;
            }

            var markerVisibleRange = marker.range.clipRows(visibleRangeStartRow, visibleRangeEndRow);
            if (markerVisibleRange.start.row === markerVisibleRange.end.row
                && markerVisibleRange.start.column === markerVisibleRange.end.column) {
                    continue; // visible range is empty
                }

            var screenRange = markerVisibleRange.toScreenRange(session);
            if (screenRange.isEmpty()) {
                // we are inside a fold
                foldLine = session.getNextFoldLine(markerVisibleRange.end.row, foldLine);
                if (foldLine && foldLine.end.row > markerVisibleRange.end.row) {
                    visibleRangeStartRow = foldLine.end.row;
                }
                continue;
            }

            if (screenRange.isMultiLine()) {
                markerLayer.drawTextMarker(html, screenRange, marker.className, config);
            } else {
                markerLayer.drawSingleLineMarker(html, screenRange, marker.className, config);
            }
        }
    }

}

// this caps total amount of markers at 10K
MarkerGroup.prototype.MAX_MARKERS = 10000;

exports.MarkerGroup = MarkerGroup;

