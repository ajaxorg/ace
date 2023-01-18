"use strict";

var lang = require("./lib/lang");
var oop = require("./lib/oop");
var Range = require("./range").Range;

var SearchHighlight = function(regExp, clazz, type) {
    this.setRegexp(regExp);
    this.clazz = clazz;
    this.type = type || "text";
};

(function() {
    // needed to prevent long lines from freezing the browser
    this.MAX_RANGES = 500;
    
    this.setRegexp = function(regExp) {
        if (this.regExp+"" == regExp+"")
            return;
        this.regExp = regExp;
        this.cache = [];
    };
    
    this.isMultilineSearch = function() {
        var options = editor.getLastSearchOptions();
        if ('searchBox' in editor && editor.searchBox.active && editor.searchBox.element.contains(document.activeElement)) {
            var regexp = typeof options.regExp === 'undefined' ? false : options.regExp;
            return /\\r\\n|\\r|\\n/.test(options.re.source) && regexp;
        }
        else {
            return false;
        }
    };

    this.multiLine = function(start, end) {
        var line, chunk = 1;
        for (var row = start; row <= end;) {
            for (var i = 0; i < chunk; i++) {
                if (row > end)
                    break;
                var current = session.getLine(row++);
                line = line == null ? current : line + "\n" + current;
            }
            chunk = chunk * 2;
  
            var ranges = [];
            var match = this.regExp.exec(line);
            if (match) {
                var before = line.slice(0, match.index).split("\n");
                var inside = match[0].split("\n");
                var startRow = start + before.length - 1;
                var startCol = before[before.length - 1].length;
                var endRow = startRow + inside.length - 1;
                var endCol = inside.length == 1 ? startCol + inside[0].length : inside[inside.length - 1].length;
    
                ranges.push(new Range(startRow, startCol, endRow, endCol));
                if (ranges.length > this.MAX_RANGES)
                    ranges = ranges.slice(0, this.MAX_RANGES);
                return ranges;
            }
        }

        return ranges;
    };

    this.update = function(html, markerLayer, session, config) {
        if (!this.regExp)
            return;
        var start = config.firstRow, end = config.lastRow;
        var multiline = this.isMultilineSearch();
        var renderedMarkerRanges = {};

        for (var i = start; i <= end; i++) {
            var ranges = this.cache[i];
            if (ranges == null) {
                if (multiline) {
                    ranges = this.multiLine(i, end);
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

            for (var j = ranges.length; j --; ) {
                var rangeToAddMarkerTo = ranges[j].toScreenRange(session);
                var rangeAsString = rangeToAddMarkerTo.toString();
                if (renderedMarkerRanges[rangeAsString]) continue;

                renderedMarkerRanges[rangeAsString] = true;
                markerLayer[multiline ? 'drawMultiLineMarker' : 'drawSingleLineMarker'](
                    html, rangeToAddMarkerTo, this.clazz, config);
            }
        }
    };

}).call(SearchHighlight.prototype);

exports.SearchHighlight = SearchHighlight;
