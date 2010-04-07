function VirtualRenderer(containerId)
{
  this.container = document.getElementById(containerId);
  this.container.className += "editor";
  
  var textLayer = this.textLayer = new TextLayer(this.container);
  this.canvas = textLayer.element;
  
  this.characterWidth = textLayer.getCharacterWidth();
  this.lineHeight = textLayer.getLineHeight(); 
  
  this.cursorLayer = new CursorLayer(this.container);
  this.markerLayer = new MarkerLayer(this.container);
  
  this.layers = [this.markerLayer, textLayer, this.cursorLayer];
  
  this.scrollTop = 0;
    
  this.cursorPos = {
    row: 0,
    column: 0
  };
}

VirtualRenderer.prototype.setDocument = function(doc)
{
  this.lines = doc.lines;
  this.textLayer.setDocument(doc);
};

VirtualRenderer.prototype.getContainerElement = function() {
  return this.container;
};

VirtualRenderer.prototype.getLongestLineWidth = function(lines)
{
  var longestLine = this.container.clientWidth;
  for (var i=0; i < lines.length; i++) {
    longestLine = Math.max(longestLine, (lines[i].length * this.characterWidth));
  }    
  return longestLine;
};

VirtualRenderer.prototype.draw = function() 
{    
  var lines = this.lines;
  
  var offset = this.scrollTop % this.lineHeight;
  var minHeight = this.container.clientHeight + offset;
  
  var longestLine = this.getLongestLineWidth(lines);
  var lineCount = Math.ceil(minHeight / this.lineHeight);
  var firstRow = Math.round((this.scrollTop - offset) / this.lineHeight);
  var lastRow = Math.min(lines.length, firstRow+lineCount);

  var layerConfig = this.layerConfig = {
    width: longestLine,
    firstRow: firstRow,
    lastRow: lastRow,
    lineHeight: this.lineHeight,
    characterWidth: this.characterWidth
  };

  for (var i=0; i < this.layers.length; i++) 
  {
    var layer = this.layers[i];

    var style = layer.element.style;    
    style.marginTop = (-offset) + "px";
    style.height = minHeight + "px";
    style.width = longestLine + "px";

    layer.update(layerConfig);    
  };
}

VirtualRenderer.prototype.addMarker = function(range, clazz) {
  return this.markerLayer.addMarker(range, clazz);
};

VirtualRenderer.prototype.removeMarker = function(markerId) {
  this.markerLayer.removeMarker(markerId);
};

VirtualRenderer.prototype.updateCursor = function(position) 
{
  this.cursorLayer.setCursor(position);
  this.cursorLayer.update(this.layerConfig);
};

VirtualRenderer.prototype.hideCursor = function() {
  this.cursorLayer.hideCursor();
};

VirtualRenderer.prototype.showCursor = function() {
  this.cursorLayer.showCursor();
};

VirtualRenderer.prototype.scrollCursorIntoView = function()
{
  var pos = this.cursorLayer.getPixelPosition();
  
  var left = pos.left
  var top = pos.top;
  
  if (this.getScrollTop() > top) {
    this.scrollToY(top);
  }
  
  if (this.getScrollTop() + this.container.clientHeight < top + this.lineHeight) {
    this.scrollToY(top + this.lineHeight - this.container.clientHeight);
  }  
  
  if (this.container.scrollLeft > left) {
    this.container.scrollLeft = left;
  }
  
  if (this.container.scrollLeft + this.container.clientWidth < left + this.characterWidth) {
    this.container.scrollLeft = left + this.characterWidth - this.container.clientWidth;
  }
},

VirtualRenderer.prototype.getScrollTop = function() {
  return this.scrollTop;
};

VirtualRenderer.prototype.scrollToY = function(scrollTop)
{
  var maxHeight = this.lines.length * this.lineHeight - this.container.offsetHeight;
  var scrollTop = Math.max(0, Math.min(maxHeight, scrollTop));
  
  if (this.scrollTop !== scrollTop) {
    this.scrollTop = scrollTop;
    this.draw();
  }
};

VirtualRenderer.prototype.screenToTextCoordinates = function(pageX, pageY) 
{
  var canvasPos = this.container.getBoundingClientRect();
    
  var col = Math.floor((pageX + this.container.scrollLeft - canvasPos.left) / this.characterWidth);
  var row = Math.floor((pageY + this.scrollTop - canvasPos.top) / this.lineHeight);
  
  return {
    row: row,
    column: col      
  }
};

VirtualRenderer.prototype.visualizeFocus = function() {
  this.container.className = "editor focus";
};

VirtualRenderer.prototype.visualizeBlur = function() {
  this.container.className = "editor";
};

VirtualRenderer.prototype.showComposition = function(position) {
};

VirtualRenderer.prototype.setCompositionText = function(text) {
};

VirtualRenderer.prototype.hideComposition = function() {
};