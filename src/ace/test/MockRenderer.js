/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

require.def([], function() {

MockRenderer = function(visibleRowCount) {
    this.container = document.createElement("div");
    this.cursor = {
        row : 0,
        column : 0
    };

    this.visibleRowCount = visibleRowCount || 20;

    this.layerConfig = {
        firstVisibleRow : 0,
        lastVisibleRow : this.visibleRowCount
    };
};


MockRenderer.prototype.getFirstVisibleRow = function() {
    return this.layerConfig.firstVisibleRow;
};

MockRenderer.prototype.getLastVisibleRow = function() {
    return this.layerConfig.lastVisibleRow;
};

MockRenderer.prototype.getContainerElement = function() {
    return this.container;
};

MockRenderer.prototype.getMouseEventTarget = function() {
    return this.container;
};

MockRenderer.prototype.setDocument = function(doc) {
    this.lines = doc.lines;
};

MockRenderer.prototype.setTokenizer = function() {
};

MockRenderer.prototype.updateCursor = function(position) {
    this.cursor.row = position.row;
    this.cursor.column = position.column;
};

MockRenderer.prototype.scrollCursorIntoView = function() {
    if (this.cursor.row < this.layerConfig.firstVisibleRow) {
        this.scrollToRow(this.cursor.row);
    }
    else if (this.cursor.row > this.layerConfig.lastVisibleRow) {
        this.scrollToRow(this.cursor.row);
    }
};

MockRenderer.prototype.scrollToRow = function(row) {
    var row = Math.min(this.lines.length - this.visibleRowCount, Math.max(0,
                                                                          row));
    this.layerConfig.firstVisibleRow = row;
    this.layerConfig.lastVisibleRow = row + this.visibleRowCount;
};

MockRenderer.prototype.getScrollTopRow = function() {
  return this.layerConfig.firstVisibleRow;
};

MockRenderer.prototype.draw = function() {
};

MockRenderer.prototype.updateLines = function(startRow, endRow) {
};

MockRenderer.prototype.addMarker = function() {
};

MockRenderer.prototype.setBreakpoints = function() {
};

return MockRenderer;
});
