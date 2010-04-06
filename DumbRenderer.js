function DumbRenderer(containerId) 
{
  this.container = document.getElementById(containerId);
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
}

DumbRenderer.prototype =
{
  setDocument : function(doc) {
    this.lines = doc.lines;
    this.doc = doc;
  },
  
  getContainerElement : function() {
    return this.container;
  },

  _measureSizes : function()
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
  },
  
  getLongestLineWidth : function(lines)
  {
    var longestLine = this.container.clientWidth;
    for (var i=0; i < lines.length; i++) {
      longestLine = Math.max(longestLine, (lines[i].length * this.characterWidth));
    }    
    return longestLine;
  },
  
  draw : function()
  {
    var lines = this.lines;
    var longestLine = this.getLongestLineWidth(lines);
    
    var html = [];
    for (var i=0; i < lines.length; i++) 
    {
      html.push(
        "<div class='line ",
        i % 2 == 0 ? "even" : "odd",
        "' style='height:" + this.lineHeight + "px;",
        "width:", longestLine, "px'>",
        lines[i].
          replace(/&/g, "&amp;").
          replace(/</g, "&lt;").
          replace(/\s/g, "&nbsp;"),
        "</div>"
      );
    };
    this.canvas.innerHTML = html.join("");
    
    this.canvas.appendChild(this.cursor);
  },
  
  updateCursor : function(position) 
  {
    var left = this.cursorLeft = position.column * this.characterWidth;
    var top = this.cursorTop = position.row * this.lineHeight;
    
    this.cursor.style.left = left + "px";
    this.cursor.style.top = top + "px";
    
    if (this.cursorVisible) {
      this.canvas.appendChild(this.cursor);
    }
  },
  
  hideCursor : function() 
  {
    this.cursorVisible = true;
    if (this.cursor.parentNode) {
      this.cursor.parentNode.removeChild(this.cursor);
    }
  },
  
  showCursor : function()
  {
    this.cursorVisible = true;
    this.canvas.appendChild(this.cursor);
  },
  
  getScrollTop : function() {
    return this.container.scrollTop;
  },
  
  scrollToY : function(scrollTop) {
    return this.container.scrollTop = scrollTop;
  },
  
  scrollCursorIntoView : function()
  {
    var left = this.cursorLeft;
    var top = this.cursorTop;
    
    if (this.container.scrollLeft > left) {
      this.container.scrollLeft = left;
    }
    
    if (this.container.scrollLeft + this.container.clientWidth < left + this.characterWidth) {
      this.container.scrollLeft = left + this.characterWidth - this.container.clientWidth;
    }

    if (this.container.scrollTop > top) {
      this.container.scrollTop = top;
    }
    
    if (this.container.scrollTop + this.container.clientHeight < top + this.lineHeight) {
      this.container.scrollTop = top + this.lineHeight - this.container.clientHeight;
    }
  },
  
  screenToTextCoordinates : function(pageX, pageY)
  {
    var canvasPos = this.container.getBoundingClientRect();
    
    if (pageY < canvasPos.top || pageY > canvasPos.bottom) {
      row = null;
    } else {    
      var row = Math.floor((pageY + this.container.scrollTop - canvasPos.top) / this.lineHeight);
    }

    if (pageX < canvasPos.left || pageX > canvasPos.right) {
      col = null;
    } else {
      var col = Math.floor((pageX + this.container.scrollLeft - canvasPos.left) / this.characterWidth);
    }
    
    return {
      row: row,
      column: col      
    }    
  },
  
  visualizeFocus : function() {
    this.container.className = "focus";
  },
  
  visualizeBlur : function() {
    this.container.className = "";
  },
  
  addMarker : function(range, clazz)
  {
    var id = this._markerId++;
    this.markers[id] = {
      range: range,
      type: "line",
      clazz: clazz
    };
    
    this.draw();
    
    return id;
  },
  
  removeMarker : function(markerId) 
  {
    var marker = this.markers[markerId];
    if (marker) {
      delete(this.markers[markerId]);
      this.draw();
    }
  },
  
  updateMarker : function(markerId, range)
  {
    var marker = this.markers[markerId];
    if (marker) {
      marker.range = range;
      this.draw(); 
    }   
  },
  
  showComposition : function(position)
  {
    setText(this.composition, "");
    
    this.composition.style.left = (position.column * this.characterWidth+1) + "px";
    this.composition.style.top = (position.row * this.lineHeight+1) + "px";    
      
    this.container.appendChild(this.composition);
  },
  
  setCompositionText : function(text) {
    setText(this.composition, text);
  },
  
  hideComposition : function() {
    if (this.composition.parentNode) {
      this.container.removeChild(this.composition);
    }
  }
}