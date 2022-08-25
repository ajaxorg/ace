"use strict";

var MockRenderer = exports.MockRenderer = function(visibleRowCount) {
    if (typeof document == "object") {
        this.container = document.createElement("div");
        this.scroller = document.createElement("div");
        this.$gutter = document.createElement("div");
    }
    this.visibleRowCount = visibleRowCount || 20;

    this.layerConfig = {
        firstVisibleRow : 0,
        lastVisibleRow : this.visibleRowCount
    };

    this.isMockRenderer = true;
};


MockRenderer.prototype.getFirstVisibleRow = function() {
    return this.layerConfig.firstVisibleRow;
};

MockRenderer.prototype.getLastVisibleRow = function() {
    return this.layerConfig.lastVisibleRow;
};

MockRenderer.prototype.getFirstFullyVisibleRow = function() {
    return this.layerConfig.firstVisibleRow;
};

MockRenderer.prototype.getLastFullyVisibleRow = function() {
    return this.layerConfig.lastVisibleRow;
};

MockRenderer.prototype.getContainerElement = function() {
    return this.container;
};

MockRenderer.prototype.getMouseEventTarget = function() {
    return this.container;
};

MockRenderer.prototype.getTextAreaContainer = function() {
    return this.container;
};

MockRenderer.prototype.addGutterDecoration = function() {
};

MockRenderer.prototype.removeGutterDecoration = function() {
};

MockRenderer.prototype.moveTextAreaToCursor = function() {
};

MockRenderer.prototype.setSession = function(session) {
    this.session = session;
};

MockRenderer.prototype.getSession = function(session) {
    return this.session;
};

MockRenderer.prototype.setTokenizer = function() {
};

MockRenderer.prototype.on = function() {
};

MockRenderer.prototype.updateCursor = function() {
};

MockRenderer.prototype.animateScrolling = function(fromValue, callback) {
    callback && callback();
};

MockRenderer.prototype.scrollToX = function(scrollTop) {};
MockRenderer.prototype.scrollToY = function(scrollLeft) {};

MockRenderer.prototype.scrollToLine = function(line, center) {
    var lineHeight = 16;
    var row = 0;
    for (var l = 1; l < line; l++) {
        row += this.session.getRowLength(l-1);
    }

    if (center) {
        row -= this.visibleRowCount / 2;
    }
    this.scrollToRow(row);
};

MockRenderer.prototype.scrollSelectionIntoView = function() {
};

MockRenderer.prototype.scrollCursorIntoView = function() {
    var cursor = this.session.getSelection().getCursor();
    if (cursor.row < this.layerConfig.firstVisibleRow) {
        this.scrollToRow(cursor.row);
    }
    else if (cursor.row > this.layerConfig.lastVisibleRow) {
        this.scrollToRow(cursor.row);
    }
};

MockRenderer.prototype.scrollToRow = function(row) {
    var row = Math.min(this.session.getLength() - this.visibleRowCount, Math.max(0,
                                                                          row));
    this.layerConfig.firstVisibleRow = row;
    this.layerConfig.lastVisibleRow = row + this.visibleRowCount;
};

MockRenderer.prototype.getScrollTopRow = function() {
  return this.layerConfig.firstVisibleRow;
};

MockRenderer.prototype.draw = function() {
};

MockRenderer.prototype.onChangeTabSize = function(startRow, endRow) {
};

MockRenderer.prototype.updateLines = function(startRow, endRow) {
};

MockRenderer.prototype.updateBackMarkers = function() {
};

MockRenderer.prototype.updateFrontMarkers = function() {
};

MockRenderer.prototype.updateBreakpoints = function() {
};

MockRenderer.prototype.onResize = function() {
};

MockRenderer.prototype.updateFull = function() {
};

MockRenderer.prototype.updateText = function() {
};

MockRenderer.prototype.showCursor = function() {
};

MockRenderer.prototype.visualizeFocus = function() {
};

MockRenderer.prototype.setAnnotations = function() {
};

MockRenderer.prototype.setStyle = function() {
};

MockRenderer.prototype.unsetStyle = function() {
};

MockRenderer.prototype.textToScreenCoordinates = function() {
    return {
        pageX: 0,
        pageY: 0
    };
};

MockRenderer.prototype.screenToTextCoordinates = function() {
    return {
        row: 0,
        column: 0
    };
};

MockRenderer.prototype.adjustWrapLimit = function () {

};

MockRenderer.prototype.getHighlightIndentGuides = function() {
};

MockRenderer.prototype.setHighlightIndentGuides = function() {
};
