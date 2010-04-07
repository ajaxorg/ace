function VirtualRenderer(containerId)
{
  this.container = document.getElementById(containerId);
  this.container.className += "editor";
  
  this.canvas = document.createElement("div");
  this.canvas.className = "canvas";
  this.container.appendChild(this.canvas);
  
  this._measureSizes();  
  
  this.composition = document.createElement("div");
  this.composition.className = "composition";
  this.composition.style.height = this.lineHeight + "px";  
  
  this.cursor = document.createElement("div");
  this.cursor.className = "cursor";
  this.cursor.style.height = this.lineHeight + "px";
  
  this.markers = {};
  this._markerId = 1;
    
  this.scrollTop = 0;
  this.firstRow = 0;
    
  this.cursorPos = {
    row: 0,
    column: 0
  };
  
  this.layers = [];
  this.layers.push({
    element: this.canvas,
    update: this.updateLines
  });

  this.markerEl = document.createElement("div");
  this.markerEl.className = "markers";
  this.container.appendChild(this.markerEl);
  
  this.layers.push({
    element: this.markerEl,
    update: this.updateMarkers
  });
}

VirtualRenderer.prototype.setDocument = function(doc) {
  this.lines = doc.lines;
  this.doc = doc;
};

VirtualRenderer.prototype.getContainerElement = function() {
  return this.container;
};

VirtualRenderer.prototype._measureSizes = function()
{
  var measureNode = document.createElement("div");
  var style = measureNode.style;
  style.width = style.height = "auto";
  style.left = style.top = "-1000px";
  style.visibility = "hidden";
  style.position = "absolute";
  style.overflow = "visible";
    
  measureNode.innerHTML = "X<br>X";
  this.canvas.appendChild(measureNode);
  
  this.lineHeight = Math.round(measureNode.offsetHeight / 2);
  this.characterWidth = measureNode.offsetWidth;
    
  this.canvas.removeChild(measureNode);
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
  this.firstRow = firstRow = Math.round((this.scrollTop - offset) / this.lineHeight);
  var lastRow = Math.min(lines.length, firstRow+lineCount);

  for (var i=0; i < this.layers.length; i++) 
  {
    var layer = this.layers[i];

    var style = layer.element.style;    
    style.marginTop = (-offset) + "px";
    style.height = minHeight + "px";
    style.width = longestLine + "px";

    layer.update.call(this, layer.element, firstRow, lastRow, longestLine);    
  };

  this.updateCursor(this.cursorPos);
}

VirtualRenderer.prototype.updateLines = function(element, firstRow, lastRow, width)
{
  var html = [];
  for (var i=firstRow; i<lastRow; i++)
  {
    html.push(
      "<div class='line ",
      i % 2 == 0 ? "even" : "odd",
      "' style='height:" + this.lineHeight + "px;",
      "width:", width, "px'>"
    );
    this.renderLine(html, i),
    html.push("</div>");
  }
  
  element.innerHTML = html.join("");  
};

VirtualRenderer.prototype.renderLine = function(stringBuilder, row)
{
  var tokens = this.doc.getLineTokens(row);
  for (var i=0; i < tokens.length; i++)
  {
    var token = tokens[i];

    var output = token.value.
      replace(/&/g, "&amp;").
      replace(/</g, "&lt;").
      replace(/\s/g, "&nbsp;");
    
    if (token.type !== "text") {
      stringBuilder.push("<span class='", token.type, "'>", output, "</span>");
    } else {
      stringBuilder.push(output);
    }
  };
};


VirtualRenderer.prototype.updateMarkers = function(element, firstRow, lastRow, width)
{
  var html = [];
  for (var key in this.markers) 
  {
    var marker = this.markers[key];
    var range = marker.range;
    
    if (range.start.row !== range.end.row)
    {
      if (range.start.row >= firstRow && range.start.row <= lastRow)
      {
        html.push(
          "<div class='", marker.clazz, "' style='",
          "height:", this.lineHeight, "px;",
          "width:", width - (range.start.column * this.characterWidth), "px;",
          "top:", (range.start.row-firstRow)  * this.lineHeight, "px;",        
          "left:", range.start.column * this.characterWidth, "px;'></div>"
        );
      }
        
      if (range.end.row >= firstRow && range.end.row <= lastRow)
      {
        html.push(
          "<div class='", marker.clazz, "' style='",
          "height:", this.lineHeight, "px;",
          "top:", (range.end.row-firstRow) * this.lineHeight, "px;",
          "width:", range.end.column * this.characterWidth, "px;'></div>"
        );
      };
      
      for (var row=range.start.row+1; row < range.end.row; row++)
      {
        if (row >= firstRow && row <= lastRow)
        {
          html.push(
            "<div class='", marker.clazz, "' style='",
            "height:", this.lineHeight, "px;",
            "width:", width, "px;",
            "top:", (row-firstRow) * this.lineHeight, "px;'></div>"
          );
        }
      };
    }
    else
    {
      if (range.start.row >= firstRow && range.start.row <= lastRow)
      {
        html.push(
          "<div class='", marker.clazz, "' style='",
          "height:", this.lineHeight, "px;",
          "width:", (range.end.column - range.start.column) * this.characterWidth, "px;",
          "top:", (range.start.row-firstRow)  * this.lineHeight, "px;",        
          "left:", range.start.column * this.characterWidth, "px;'></div>"
        );
      }
    }
  }
  element.innerHTML = html.join("");
};

VirtualRenderer.prototype.addMarker = function(range, clazz)
{
  var id = this._markerId++;
  this.markers[id] = {
    range: range,
    type: "line",
    clazz: clazz
  };
  
  this.draw();
  
  return id;
};

VirtualRenderer.prototype.removeMarker = function(markerId) 
{
  var marker = this.markers[markerId];
  if (marker) {
    delete(this.markers[markerId]);
    this.draw();
  }
};

VirtualRenderer.prototype.updateCursor = function(position)
{
  this.cursorPos = {
    row: position.row,
    column: position.column
  }
  
  var left = this.cursorLeft = position.column * this.characterWidth;
  var top = this.cursorTop = position.row * this.lineHeight;

  this.cursor.style.left = left + "px";
  this.cursor.style.top = (top - (this.firstRow * this.lineHeight)) + "px";  

  if (this.cursorVisible) {
    this.canvas.appendChild(this.cursor);
  }
};

VirtualRenderer.prototype.hideCursor = function() 
{
  this.cursorVisible = true;
  if (this.cursor.parentNode) {
    this.cursor.parentNode.removeChild(this.cursor);
  }
};

VirtualRenderer.prototype.showCursor = function()
{
  this.cursorVisible = true;
  this.canvas.appendChild(this.cursor);
};

VirtualRenderer.prototype.scrollCursorIntoView = function()
{
  var left = this.cursorLeft;
  var top = this.cursorTop;
  
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

VirtualRenderer.prototype.showComposition = function(position)
{
  setText(this.composition, "");
  
  this.composition.style.left = (position.column * this.characterWidth+1) + "px";
  this.composition.style.top = (position.row * this.lineHeight+1) + "px";    
    
  this.container.appendChild(this.composition);
};

VirtualRenderer.prototype.setCompositionText = function(text) {
  setText(this.composition, text);
};

VirtualRenderer.prototype.hideComposition = function() {
  if (this.composition.parentNode) {
    this.container.removeChild(this.composition);
  }
};