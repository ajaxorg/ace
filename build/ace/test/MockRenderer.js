/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def([], function() {
  MockRenderer = function(a) {
    this.container = document.createElement("div");
    this.cursor = {row:0, column:0};
    this.visibleRowCount = a || 20;
    this.layerConfig = {firstVisibleRow:0, lastVisibleRow:this.visibleRowCount}
  };
  MockRenderer.prototype.getFirstVisibleRow = function() {
    return this.layerConfig.firstVisibleRow
  };
  MockRenderer.prototype.getLastVisibleRow = function() {
    return this.layerConfig.lastVisibleRow
  };
  MockRenderer.prototype.getContainerElement = function() {
    return this.container
  };
  MockRenderer.prototype.getMouseEventTarget = function() {
    return this.container
  };
  MockRenderer.prototype.setDocument = function(a) {
    this.lines = a.lines
  };
  MockRenderer.prototype.setTokenizer = function() {
  };
  MockRenderer.prototype.updateCursor = function(a) {
    this.cursor.row = a.row;
    this.cursor.column = a.column
  };
  MockRenderer.prototype.scrollCursorIntoView = function() {
    if(this.cursor.row < this.layerConfig.firstVisibleRow) {
      this.scrollToRow(this.cursor.row)
    }else {
      this.cursor.row > this.layerConfig.lastVisibleRow && this.scrollToRow(this.cursor.row)
    }
  };
  MockRenderer.prototype.scrollToRow = function(a) {
    a = Math.min(this.lines.length - this.visibleRowCount, Math.max(0, a));
    this.layerConfig.firstVisibleRow = a;
    this.layerConfig.lastVisibleRow = a + this.visibleRowCount
  };
  MockRenderer.prototype.getScrollTopRow = function() {
    return this.layerConfig.firstVisibleRow
  };
  MockRenderer.prototype.draw = function() {
  };
  MockRenderer.prototype.updateLines = function() {
  };
  MockRenderer.prototype.addMarker = function() {
  };
  MockRenderer.prototype.setBreakpoints = function() {
  };
  return MockRenderer
});