"use strict";

var lang = require("./lib/lang");
var Range = require("./range").Range;

class SearchHighlight {
    constructor(regExp, clazz, type = "text") {
        this.setRegexp(regExp);
        this.clazz = clazz;
        this.type = type;
    }
    
    setRegexp(regExp) {
        if (this.regExp+"" == regExp+"")
            return;
        this.regExp = regExp;
        this.cache = [];
    }

    update(html, markerLayer, session, config) {
        if (!this.regExp)
            return;
        var start = config.firstRow, end = config.lastRow;
        var renderedMarkerRanges = {};

        for (var i = start; i <= end; i++) {
            var ranges = this.cache[i];
            if (ranges == null) {
                ranges = lang.getMatchOffsets(session.getLine(i), this.regExp);
                if (ranges.length > this.MAX_RANGES)
                    ranges = ranges.slice(0, this.MAX_RANGES);
                ranges = ranges.map(function(match) {
                    return new Range(i, match.offset, i, match.offset + match.length);
                });
                this.cache[i] = ranges.length ? ranges : "";
            }

            for (var j = ranges.length; j --; ) {
                var rangeToAddMarkerTo = ranges[j].toScreenRange(session);
                var rangeAsString = rangeToAddMarkerTo.toString();
                if (renderedMarkerRanges[rangeAsString]) continue;

                renderedMarkerRanges[rangeAsString] = true;
                markerLayer.drawSingleLineMarker(
                    html, rangeToAddMarkerTo, this.clazz, config);
            }
        }
    }

}

// needed to prevent long lines from freezing the browser
SearchHighlight.prototype.MAX_RANGES = 500;

exports.SearchHighlight = SearchHighlight;
