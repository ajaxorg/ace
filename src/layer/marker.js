"use strict";

var Range = require("../range").Range;
var dom = require("../lib/dom");

var Marker = function(parentEl) {
    this.element = dom.createElement("div");
    this.element.className = "ace_layer ace_marker-layer";
    parentEl.appendChild(this.element);
};

(function() {

    this.$padding = 0;

    this.setPadding = function(padding) {
        this.$padding = padding;
    };
    this.setSession = function(session) {
        this.session = session;
    };
    
    this.setMarkers = function(markers) {
        this.markers = markers;
    };
    
    this.elt = function(className, css) {
        var x = this.i != -1 && this.element.childNodes[this.i];
        if (!x) {
            x = document.createElement("div");
            this.element.appendChild(x);
            this.i = -1;
        } else {
            this.i++;
        }
        x.style.cssText = css;
        x.className = className;
    };

    this.update = function(config) {
        if (!config) return;

        this.config = config;

        this.i = 0;
        var html;
        for (var key in this.markers) {
            var marker = this.markers[key];

            if (!marker.range) {
                marker.update(html, this, this.session, config);
                continue;
            }

            var range = marker.range.clipRows(config.firstRow, config.lastRow);
            if (range.isEmpty()) continue;

            range = range.toScreenRange(this.session);
            if (marker.renderer) {
                var top = this.$getTop(range.start.row, config);
                var left = this.$padding + range.start.column * config.characterWidth;
                marker.renderer(html, range, left, top, config);
            } else if (marker.type == "fullLine") {
                this.drawFullLineMarker(html, range, marker.clazz, config);
            } else if (marker.type == "screenLine") {
                this.drawScreenLineMarker(html, range, marker.clazz, config);
            } else if (range.isMultiLine()) {
                if (marker.type == "text")
                    this.drawTextMarker(html, range, marker.clazz, config);
                else
                    this.drawMultiLineMarker(html, range, marker.clazz, config);
            } else {
                this.drawSingleLineMarker(html, range, marker.clazz + " ace_start" + " ace_br15", config);
            }
        }
        if (this.i !=-1) {
            while (this.i < this.element.childElementCount)
                this.element.removeChild(this.element.lastChild);
        }
    };

    this.$getTop = function(row, layerConfig) {
        return (row - layerConfig.firstRowScreen) * layerConfig.lineHeight;
    };

    function getBorderClass(tl, tr, br, bl) {
        return (tl ? 1 : 0) | (tr ? 2 : 0) | (br ? 4 : 0) | (bl ? 8 : 0);
    }
    // Draws a marker, which spans a range of text on multiple lines 
    this.drawTextMarker = function(stringBuilder, range, clazz, layerConfig, extraStyle) {
        var session = this.session;
        var start = range.start.row;
        var end = range.end.row;
        var row = start;
        var prev = 0; 
        var curr = 0;
        var next = session.getScreenLastRowColumn(row);
        var lineRange = new Range(row, range.start.column, row, curr);
        for (; row <= end; row++) {
            lineRange.start.row = lineRange.end.row = row;
            lineRange.start.column = row == start ? range.start.column : session.getRowWrapIndent(row);
            lineRange.end.column = next;
            prev = curr;
            curr = next;
            next = row + 1 < end ? session.getScreenLastRowColumn(row + 1) : row == end ? 0 : range.end.column;
            this.drawSingleLineMarker(stringBuilder, lineRange, 
                clazz + (row == start  ? " ace_start" : "") + " ace_br"
                    + getBorderClass(row == start || row == start + 1 && range.start.column, prev < curr, curr > next, row == end),
                layerConfig, row == end ? 0 : 1, extraStyle);
        }
    };

    // Draws a multi line marker, where lines span the full width
    this.drawMultiLineMarker = function(stringBuilder, range, clazz, config, extraStyle) {
        // from selection start to the end of the line
        var padding = this.$padding;
        var height = config.lineHeight;
        var top = this.$getTop(range.start.row, config);
        var left = padding + range.start.column * config.characterWidth;
        extraStyle = extraStyle || "";

        if (this.session.$bidiHandler.isBidiRow(range.start.row)) {
           var range1 = range.clone();
           range1.end.row = range1.start.row;
           range1.end.column = this.session.getLine(range1.start.row).length;
           this.drawBidiSingleLineMarker(stringBuilder, range1, clazz + " ace_br1 ace_start", config, null, extraStyle);
        } else {
            this.elt(
                clazz + " ace_br1 ace_start",
                "height:"+ height+ "px;"+ "right:0;"+ "top:"+top+ "px;left:"+ left+ "px;" + (extraStyle || "")
            );
        }
        // from start of the last line to the selection end
        if (this.session.$bidiHandler.isBidiRow(range.end.row)) {
           var range1 = range.clone();
           range1.start.row = range1.end.row;
           range1.start.column = 0;
           this.drawBidiSingleLineMarker(stringBuilder, range1, clazz + " ace_br12", config, null, extraStyle);
        } else {
            top = this.$getTop(range.end.row, config);
            var width = range.end.column * config.characterWidth;

            this.elt(
                clazz + " ace_br12",
                "height:"+ height+ "px;"+
                "width:"+ width+ "px;"+
                "top:"+ top+ "px;"+
                "left:"+ padding+ "px;"+ (extraStyle || "")
            );
        }
        // all the complete lines
        height = (range.end.row - range.start.row - 1) * config.lineHeight;
        if (height <= 0)
            return;
        top = this.$getTop(range.start.row + 1, config);
        
        var radiusClass = (range.start.column ? 1 : 0) | (range.end.column ? 0 : 8);

        this.elt(
            clazz + (radiusClass ? " ace_br" + radiusClass : ""),
            "height:"+ height+ "px;"+
            "right:0;"+
            "top:"+ top+ "px;"+
            "left:"+ padding+ "px;"+ (extraStyle || "")
        );
    };

    // Draws a marker which covers part or whole width of a single screen line
    this.drawSingleLineMarker = function(stringBuilder, range, clazz, config, extraLength, extraStyle) {
        if (this.session.$bidiHandler.isBidiRow(range.start.row))
            return this.drawBidiSingleLineMarker(stringBuilder, range, clazz, config, extraLength, extraStyle);
        var height = config.lineHeight;
        var width = (range.end.column + (extraLength || 0) - range.start.column) * config.characterWidth;

        var top = this.$getTop(range.start.row, config);
        var left = this.$padding + range.start.column * config.characterWidth;

        this.elt(
            clazz,
            "height:"+ height+ "px;"+
            "width:"+ width+ "px;"+
            "top:"+ top+ "px;"+
            "left:"+ left+ "px;"+ (extraStyle || "")
        );
    };

    // Draws Bidi marker which covers part or whole width of a single screen line
    this.drawBidiSingleLineMarker = function(stringBuilder, range, clazz, config, extraLength, extraStyle) {
        var height = config.lineHeight, top = this.$getTop(range.start.row, config), padding = this.$padding;
        var selections = this.session.$bidiHandler.getSelections(range.start.column, range.end.column);

        selections.forEach(function(selection) {
            this.elt(
                clazz,
                "height:" + height + "px;" +
                "width:" + selection.width + (extraLength || 0) + "px;" +
                "top:" + top + "px;" +
                "left:" + (padding + selection.left) + "px;" + (extraStyle || "")
            );
        }, this);
    };

    this.drawFullLineMarker = function(stringBuilder, range, clazz, config, extraStyle) {
        var top = this.$getTop(range.start.row, config);
        var height = config.lineHeight;
        if (range.start.row != range.end.row)
            height += this.$getTop(range.end.row, config) - top;

        this.elt(
            clazz,
            "height:"+ height+ "px;"+
            "top:"+ top+ "px;"+
            "left:0;right:0;"+ (extraStyle || "")
        );
    };
    
    this.drawScreenLineMarker = function(stringBuilder, range, clazz, config, extraStyle) {
        var top = this.$getTop(range.start.row, config);
        var height = config.lineHeight;

        this.elt(
            clazz,
            "height:"+ height+ "px;"+
            "top:"+ top+ "px;"+
            "left:0;right:0;"+ (extraStyle || "")
        );
    };

}).call(Marker.prototype);

exports.Marker = Marker;
