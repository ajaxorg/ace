function MarkerLayer(parentEl)
{
  this.element = document.createElement("div");
  this.element.className = "layer marker-layer";
  parentEl.appendChild(this.element);
  
  this.markers = {};
  this._markerId = 1;
}

MarkerLayer.prototype.addMarker = function(range, clazz)
{
  var id = this._markerId++;
  this.markers[id] = {
    range: range,
    type: "line",
    clazz: clazz
  };
  
  this.update();
  return id;
};

MarkerLayer.prototype.removeMarker = function(markerId) 
{
  var marker = this.markers[markerId];
  if (marker) {
    delete(this.markers[markerId]);
    this.update();
  }
};

MarkerLayer.prototype.update = function(config)
{
  var config = config || this.config;
  if (!config) return;
  
  this.config = config;  
  
  var html = [];
  for (var key in this.markers) 
  {
    var marker = this.markers[key];
    var range = marker.range;
    
    if (range.start.row !== range.end.row)
    {
      if (range.start.row >= config.firstRow && range.start.row <= config.lastRow)
      {
        html.push(
          "<div class='", marker.clazz, "' style='",
          "height:", config.lineHeight, "px;",
          "width:", Math.round(config.width - (range.start.column * config.characterWidth)), "px;",
          "top:", (range.start.row-config.firstRow)  * config.lineHeight, "px;",        
          "left:", Math.round(range.start.column * config.characterWidth), "px;'></div>"
        );
      }
        
      if (range.end.row >= config.firstRow && range.end.row <= config.lastRow)
      {
        html.push(
          "<div class='", marker.clazz, "' style='",
          "height:", config.lineHeight, "px;",
          "top:", (range.end.row-config.firstRow) * config.lineHeight, "px;",
          "width:", Math.round(range.end.column * config.characterWidth), "px;'></div>"
        );
      };
      
      for (var row=range.start.row+1; row < range.end.row; row++)
      {
        if (row >= config.firstRow && row <= config.lastRow)
        {
          html.push(
            "<div class='", marker.clazz, "' style='",
            "height:", config.lineHeight, "px;",
            "width:", config.width, "px;",
            "top:", (row-config.firstRow) * config.lineHeight, "px;'></div>"
          );
        }
      };
    }
    else
    {
      if (range.start.row >= config.firstRow && range.start.row <= config.lastRow)
      {
        html.push(
          "<div class='", marker.clazz, "' style='",
          "height:", config.lineHeight, "px;",
          "width:", Math.round((range.end.column - range.start.column) * config.characterWidth), "px;",
          "top:", (range.start.row-config.firstRow)  * config.lineHeight, "px;",        
          "left:", Math.round(range.start.column * config.characterWidth), "px;'></div>"
        );
      }
    }
  }
  this.element.innerHTML = html.join("");
};