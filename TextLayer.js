function TextLayer(parentEl)
{
  this.element = document.createElement("div");
  this.element.className = "layer text-layer";
  parentEl.appendChild(this.element);
  
  this._measureSizes();
}

TextLayer.prototype.setDocument = function(doc) {
  this.lines = doc.lines;
  this.doc = doc;
};

TextLayer.prototype.getLineHeight = function() {
  return this.lineHeight;
};

TextLayer.prototype.getCharacterWidth = function() {
  return this.characterWidth;
};

TextLayer.prototype._measureSizes = function()
{
  var measureNode = document.createElement("div");
  var style = measureNode.style;
  style.width = style.height = "auto";
  style.left = style.top = "-1000px";
  style.visibility = "hidden";
  style.position = "absolute";
  style.overflow = "visible";
    
  measureNode.innerHTML = "X<br>X";
  this.element.appendChild(measureNode);
  
  this.lineHeight = Math.round(measureNode.offsetHeight / 2);
  this.characterWidth = measureNode.offsetWidth;
    
  this.element.removeChild(measureNode);
};

TextLayer.prototype.update = function(config)
{
  var html = [];
  for (var i=config.firstRow; i<config.lastRow; i++)
  {
    html.push(
      "<div class='line ",
      i % 2 == 0 ? "even" : "odd",
      "' style='height:" + this.lineHeight + "px;",
      "width:", config.width, "px'>"
    );
    this.renderLine(html, i),
    html.push("</div>");
  }
  
  this.element.innerHTML = html.join("");  
};

TextLayer.prototype.renderLine = function(stringBuilder, row)
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