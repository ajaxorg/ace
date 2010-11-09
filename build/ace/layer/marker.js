define(function(h) {
  var i = h("../range");
  h = function(c) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_marker-layer";
    c.appendChild(this.element);
    this.markers = {};
    this.$markerId = 1
  };
  (function() {
    this.setDocument = function(c) {
      this.doc = c
    };
    this.addMarker = function(c, a, e) {
      var b = this.$markerId++;
      this.markers[b] = {range:c, type:e || "line", clazz:a};
      return b
    };
    this.removeMarker = function(c) {
      this.markers[c] && delete this.markers[c]
    };
    this.update = function(c) {
      if(c = c || this.config) {
        this.config = c;
        var a = [];
        for(var e in this.markers) {
          var b = this.markers[e], d = b.range.clipRows(c.firstRow, c.lastRow);
          if(!d.isEmpty()) {
            if(d.isMultiLine()) {
              b.type == "text" ? this.drawTextMarker(a, d, b.clazz, c) : this.drawMultiLineMarker(a, d, b.clazz, c)
            }else {
              this.drawSingleLineMarker(a, d, b.clazz, c)
            }
          }
        }this.element.innerHTML = a.join("")
      }
    };
    this.drawTextMarker = function(c, a, e, b) {
      var d = a.start.row, f = new i(d, a.start.column, d, this.doc.getLine(d).length);
      this.drawSingleLineMarker(c, f, e, b);
      d = a.end.row;
      f = new i(d, 0, d, a.end.column);
      this.drawSingleLineMarker(c, f, e, b);
      for(d = a.start.row + 1;d < a.end.row;d++) {
        f.start.row = d;
        f.end.row = d;
        f.end.column = this.doc.getLine(d).length;
        this.drawSingleLineMarker(c, f, e, b)
      }
    };
    this.drawMultiLineMarker = function(c, a, e, b) {
      a = a.toScreenRange(this.doc);
      var d = b.lineHeight, f = Math.round(b.width - a.start.column * b.characterWidth), g = (a.start.row - b.firstRow) * b.lineHeight, j = Math.round(a.start.column * b.characterWidth);
      c.push("<div class='", e, "' style='", "height:", d, "px;", "width:", f, "px;", "top:", g, "px;", "left:", j, "px;'></div>");
      g = (a.end.row - b.firstRow) * b.lineHeight;
      f = Math.round(a.end.column * b.characterWidth);
      c.push("<div class='", e, "' style='", "height:", d, "px;", "top:", g, "px;", "width:", f, "px;'></div>");
      d = (a.end.row - a.start.row - 1) * b.lineHeight;
      if(!(d < 0)) {
        g = (a.start.row + 1 - b.firstRow) * b.lineHeight;
        c.push("<div class='", e, "' style='", "height:", d, "px;", "width:", b.width, "px;", "top:", g, "px;'></div>")
      }
    };
    this.drawSingleLineMarker = function(c, a, e, b) {
      a = a.toScreenRange(this.doc);
      var d = b.lineHeight, f = Math.round((a.end.column - a.start.column) * b.characterWidth), g = (a.start.row - b.firstRow) * b.lineHeight;
      a = Math.round(a.start.column * b.characterWidth);
      c.push("<div class='", e, "' style='", "height:", d, "px;", "width:", f, "px;", "top:", g, "px;", "left:", a, "px;'></div>")
    }
  }).call(h.prototype);
  return h
});