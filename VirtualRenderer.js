function VirtualRenderer(containerId)
{
  this.container = document.getElementById(containerId);
  this.container.className += "editor";
  
  this.scroller = document.createElement("div");
  this.scroller.className = "scroller";
  this.container.appendChild(this.scroller);
  
  this.gutter = document.createElement("div");
  this.gutter.className = "gutter";
  this.container.appendChild(this.gutter);

  this.gutterLayer = new GutterLayer(this.gutter);  
  this.markerLayer = new MarkerLayer(this.scroller);

  var textLayer = this.textLayer = new TextLayer(this.scroller);
  this.canvas = textLayer.element;
  
  this.characterWidth = textLayer.getCharacterWidth();
  this.lineHeight = textLayer.getLineHeight(); 
  
  this.cursorLayer = new CursorLayer(this.scroller);
  
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
  this.doc = doc;
  this.textLayer.setDocument(doc);
};

VirtualRenderer.prototype.getContainerElement = function() {
  return this.container;
};

VirtualRenderer.prototype.draw = function() 
{    
  var lines = this.lines;
  
  var offset = this.scrollTop % this.lineHeight;
  var minHeight = this.scroller.clientHeight + offset;
  
  var longestLine = Math.max(
    this.scroller.clientWidth, 
    this.doc.getWidth() * this.characterWidth
  );
  
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
  
  this.gutterLayer.element.style.marginTop = (-offset) + "px";
  this.gutterLayer.element.style.height =  minHeight + "px";
  this.gutterLayer.update(layerConfig);
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
  
  if (this.getScrollTop() + this.scroller.clientHeight < top + this.lineHeight) {
    this.scrollToY(top + this.lineHeight - this.scroller.clientHeight);
  }  
  
  if (this.scroller.scrollLeft > left) {
    this.scroller.scrollLeft = left;
  }
  
  if (this.scroller.scrollLeft + this.scroller.clientWidth < left + this.characterWidth) {
    this.scroller.scrollLeft = left + this.characterWidth - this.scroller.clientWidth;
  }
},

VirtualRenderer.prototype.getScrollTop = function() {
  return this.scrollTop;
};

VirtualRenderer.prototype.scrollToY = function(scrollTop)
{
  var maxHeight = this.lines.length * this.lineHeight - this.scroller.offsetHeight;
  var scrollTop = Math.max(0, Math.min(maxHeight, scrollTop));
  
  if (this.scrollTop !== scrollTop) {
    this.scrollTop = scrollTop;
    this.draw();
  }
};

VirtualRenderer.prototype.screenToTextCoordinates = function(pageX, pageY) 
{
  var canvasPos = this.scroller.getBoundingClientRect();
    
  var col = Math.floor((pageX + this.scroller.scrollLeft - canvasPos.left) / this.characterWidth);
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