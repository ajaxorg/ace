function VirtualRenderer(containerId)
{
  DumbRenderer.call(this, containerId);
  this.scrollTop = 0;
  this.firstRow = 0;
  
  this.cursorPos = {
    row: 0,
    column: 0
  };
}
inherits(VirtualRenderer, DumbRenderer);

VirtualRenderer.prototype.draw = function() 
{    
  var lines = this.lines;
  
  var offset = this.scrollTop % this.lineHeight;
  var minHeight = this.container.clientHeight + offset;
  
  var longestLine = this.getLongestLineWidth(lines);
    
  this.canvas.style.marginTop = (-offset) + "px";
  this.canvas.style.height = minHeight + "px";
  this.canvas.style.width = longestLine + "px";
  
  var lineCount = Math.ceil(minHeight / this.lineHeight);
  this.firstRow = firstRow = Math.round((this.scrollTop - offset) / this.lineHeight);
  var lastRow = Math.min(lines.length, firstRow+lineCount);
  
  var html = [];
  for (var i=firstRow; i<lastRow; i++)
  {
    html.push(
      "<div class='line ",
      i % 2 == 0 ? "even" : "odd",
      "' style='height:" + this.lineHeight + "px;",
      "width:", longestLine, "px'>"
    );
    this.renderLine(html, i),
    html.push("</div>");
  }
  
  this.canvas.innerHTML = html.join("");
  
  this.updateCursor(this.cursorPos);
}

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
    
  if (pageX < canvasPos.left || pageX > canvasPos.right) {
    col = null;
  } else {
    var col = Math.floor((pageX + this.container.scrollLeft - canvasPos.left) / this.characterWidth);
  }
  
  if (pageY < canvasPos.top || pageY > canvasPos.bottom) {
    row = null;
  } else {    
    var row = Math.floor((pageY + this.scrollTop - canvasPos.top) / this.lineHeight);
  }
  
  return {
    row: row,
    column: col      
  }
};