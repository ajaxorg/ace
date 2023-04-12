"use strict";

/*
Potential improvements:
- cap the length of rendered marker range
- save rendered markers and only search through rendered markers when looking for hover match
- don't cut off total amount of markers at 500
*/

class MarkerGroup {
    constructor(session) {
        this.markers = [];
        this.session = session;
        session.addDynamicMarker(this);
    }

    getMarkerAtPosition(pos) {
        return this.markers.find(function(marker) {
            return marker.range.contains(pos.row, pos.column);
        });
    }

    /**
     * Comparator for Array.sort function, which sorts marker definitions by their positions
     * 
     * @param {Ace.TooltipMarker} a first marker.
     * @param {Ace.TooltipMarker} b second marker.
     * @returns {number} negative number if a should be before b, positive number if b should be before a, 0 otherwise.
     */
    markersComparator(a, b) {
        return a.range.start.row - b.range.start.row;
    }

    /**
     * Sets marker definitions to be rendered. Limits the number of markers at MAX_MARKERS.
     * @param {Ace.TooltipMarker[]} markers an array of marker definitions.
     */
    setMarkers(markers) {
        this.markers = markers.sort(this.markersComparator).slice(0, this.MAX_MARKERS);
        this.session._signal("changeBackMarker");
    }

    update(html, markerLayer, session, config) {
        if (!this.markers || !this.markers.length)
            return;
        var visibleRangeStartRow = config.firstRow, visibleRangeEndRow = config.lastRow;
        this.renderedMarkerRanges = {};

        // TODO: if there are markers with overlapping ranges, do we merge them? if yes, how do we merge them?

        for (var i = 0; i < this.markers.length; i++) {
            var marker = this.markers[i];

            if (marker.range.end.row < visibleRangeStartRow) continue;
            if (marker.range.start.row > visibleRangeEndRow) continue;

            var markerVisibleRange = marker.range.clipRows(visibleRangeStartRow, visibleRangeEndRow);
            if (markerVisibleRange.start.row === markerVisibleRange.end.row
                && markerVisibleRange.start.column === markerVisibleRange.end.column) {
                    continue; // visible range is empty
                }

            var rangeToAddMarkerTo = markerVisibleRange.toScreenRange(session);
            var rangeAsString = rangeToAddMarkerTo.toString();
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
MarkerGroup.prototype.MAX_MARKERS = 500;

exports.MarkerGroup = MarkerGroup;

