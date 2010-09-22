/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
require.def("ace/layer/Marker", ["ace/Range"], function(Range) {

var Marker = function(parentEl) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_marker-layer";
    parentEl.appendChild(this.element);

    this.markers = {};
    this.$markerId = 1;
};

(function() {

    this.setDocument = function(doc) {
        this.doc = doc;
    };

    this.addMarker = function(range, clazz, type) {
        var id = this.$markerId++;
        this.markers[id] = {
            range : range,
            type : type || "line",
            clazz : clazz
        };

        this.update();
        return id;
    };

    this.removeMarker = function(markerId) {
        var marker = this.markers[markerId];
        if (marker) {
            delete (this.markers[markerId]);
            this.update();
        }
    };

    this.update = function(config) {
        var config = config || this.config;
        if (!config)
            return;

        this.config = config;

        var html = [];
        for ( var key in this.markers) {
            var marker = this.markers[key];

            var range = marker.range.clipRows(config.firstRow, config.lastRow);
            if (range.isEmpty()) continue;

            if (range.isMultiLine()) {
                if (marker.type == "text") {
                    this.drawTextMarker(html, range, marker.clazz, config);
                } else {
                    this.drawMultiLineMarker(html, range, marker.clazz, config);
                }
            }
            else {
                this.drawSingleLineMarker(html, range, marker.clazz, config);
            }
        }
        this.element.innerHTML = html.join("");
    };

    this.drawTextMarker = function(stringBuilder, range, clazz, layerConfig) {

        // selection start
        var row = range.start.row;
        var lineRange = new Range(row, range.start.column, row, this.doc.getLine(row).length);
        this.drawSingleLineMarker(stringBuilder, lineRange, clazz, layerConfig);

        // selection end
        var row = range.end.row;
        var lineRange = new Range(row, 0, row, range.end.column);
        this.drawSingleLineMarker(stringBuilder, lineRange, clazz, layerConfig);

        for (var row = range.start.row + 1; row < range.end.row; row++) {
            lineRange.start.row = row;
            lineRange.end.row = row;
            lineRange.end.column = this.doc.getLine(row).length;
            this.drawSingleLineMarker(stringBuilder, lineRange, clazz, layerConfig);
        }
    };

    this.drawMultiLineMarker = function(stringBuilder, range, clazz, layerConfig) {
        var range = range.toScreenRange(this.doc);

        // from selection start to the end of the line
        var height = layerConfig.lineHeight;
        var width = Math.round(layerConfig.width - (range.start.column * layerConfig.characterWidth));
        var top = (range.start.row - layerConfig.firstRow) * layerConfig.lineHeight;
        var left = Math.round(range.start.column * layerConfig.characterWidth);

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "width:", width, "px;",
            "top:", top, "px;",
            "left:", left, "px;'></div>"
        );

        // from start of the last line to the selection end
        var top = (range.end.row - layerConfig.firstRow) * layerConfig.lineHeight;
        var width = Math.round(range.end.column * layerConfig.characterWidth);

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "top:", top, "px;",
            "width:", width, "px;'></div>"
        );

        // all the complete lines
        var height = (range.end.row - range.start.row - 1) * layerConfig.lineHeight;
        if (height < 0)
            return;
        var top = (range.start.row + 1 - layerConfig.firstRow) * layerConfig.lineHeight;

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "width:", layerConfig.width, "px;",
            "top:", top, "px;'></div>"
        );
    };

    this.drawSingleLineMarker = function(stringBuilder, range, clazz, layerConfig) {
        var range = range.toScreenRange(this.doc);

        var height = layerConfig.lineHeight;
        var width = Math.round((range.end.column - range.start.column) * layerConfig.characterWidth);
        var top = (range.start.row - layerConfig.firstRow) * layerConfig.lineHeight;
        var left = Math.round(range.start.column * layerConfig.characterWidth);

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "width:", width, "px;",
            "top:", top, "px;",
            "left:", left,"px;'></div>"
        );
    };

}).call(Marker.prototype);

return Marker;
});
