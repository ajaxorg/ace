"use strict";
/**
 * @typedef {import("./layer/marker").Marker} Marker
 * @typedef {import("./edit_session").EditSession} EditSession
 */
var lang = require("./lib/lang");
var Range = require("./range").Range;

class SearchHighlight {
    /**
     * @param {any} regExp
     * @param {string} clazz
     */
    constructor(regExp, clazz, type = "text") {
        this.setRegexp(regExp);
        this.clazz = clazz;
        this.type = type;
        this.docLen = 0;
    }

    setRegexp(regExp) {
        if (this.regExp+"" == regExp+"")
            return;
        this.regExp = regExp;
        this.cache = [];
    }

    /**
     * @param {any} html
     * @param {Marker} markerLayer
     * @param {EditSession} session
     * @param {Partial<import("../ace-internal").Ace.LayerConfig>} config
     */
    update(html, markerLayer, session, config) {
        if (!this.regExp)
            return;
        var start = config.firstRow;
        var end = config.lastRow;
        var renderedMarkerRanges = {};
        var _search = session.$editor && session.$editor.$search;
        var mtSearch = _search && _search.$isMultilineSearch(session.$editor.getLastSearchOptions());

        for (var i = start; i <= end; i++) {
            var ranges = this.cache[i];
            if (ranges == null || session.getValue().length != this.docLen) {
                if (mtSearch) {
                    ranges = [];
                    var match = _search.$multiLineForward(session, this.regExp, i, end);
                    if (match) {
                        var end_row = match.endRow <= end ? match.endRow - 1 : end;
                        if (end_row > i)
                            i = end_row;
                        ranges.push(new Range(match.startRow, match.startCol, match.endRow, match.endCol));
                    }
                    if (ranges.length > this.MAX_RANGES)
                        ranges = ranges.slice(0, this.MAX_RANGES);
                }
                else {
                    ranges = lang.getMatchOffsets(session.getLine(i), this.regExp);
                    if (ranges.length > this.MAX_RANGES)
                        ranges = ranges.slice(0, this.MAX_RANGES);
                    ranges = ranges.map(function(match) {
                        return new Range(i, match.offset, i, match.offset + match.length);
                    });
                }
                this.cache[i] = ranges.length ? ranges : "";
            }

            if (ranges.length === 0) continue;

            for (var j = ranges.length; j --; ) {
                var rangeToAddMarkerTo = ranges[j].toScreenRange(session);
                var rangeAsString = rangeToAddMarkerTo.toString();
                if (renderedMarkerRanges[rangeAsString]) continue;

                renderedMarkerRanges[rangeAsString] = true;
                markerLayer.drawSingleLineMarker(
                    html, rangeToAddMarkerTo, this.clazz, config);
            }
        }
        this.docLen = session.getValue().length;
    }
}

// needed to prevent long lines from freezing the browser
SearchHighlight.prototype.MAX_RANGES = 500;

exports.SearchHighlight = SearchHighlight;
