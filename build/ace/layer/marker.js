define(function(h, j) {
  var i = h("ace/range").Range, k = h("pilot/dom");
  h = function(d) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_marker-layer";
    d.appendChild(this.element);
    this.markers = {};
    this.$markerId = 1
  };
  (function() {
    this.setDocument = function(d) {
      this.doc = d
    };
    this.addMarker = function(d, a, e) {
      var b = this.$markerId++;
      this.markers[b] = {range:d, type:e || "line", clazz:a};
      return b
    };
    this.removeMarker = function(d) {
      this.markers[d] && delete this.markers[d]
    };
    this.update = function(d) {
      if(d = d || this.config) {
        this.config = d;
        var a = [];
        for(var e in this.markers) {
          var b = this.markers[e], c = b.range.clipRows(d.firstRow, d.lastRow);
          if(!c.isEmpty()) {
            if(c.isMultiLine()) {
              b.type == "text" ? this.drawTextMarker(a, c, b.clazz, d) : this.drawMultiLineMarker(a, c, b.clazz, d)
            }else {
              this.drawSingleLineMarker(a, c, b.clazz, d)
            }
          }
        }this.element = k.setInnerHtml(this.element, a.join(""))
      }
    };
    this.drawTextMarker = function(d, a, e, b) {
      var c = a.start.row, f = new i(c, a.start.column, c, this.doc.getLine(c).length);
      this.drawSingleLineMarker(d, f, e, b, 1);
      c = a.end.row;
      f = new i(c, 0, c, a.end.column);
      this.drawSingleLineMarker(d, f, e, b);
      for(c = a.start.row + 1;c < a.end.row;c++) {
        f.start.row = c;
        f.end.row = c;
        f.end.column = this.doc.getLine(c).length;
        this.drawSingleLineMarker(d, f, e, b, 1)
      }
    };
    this.drawMultiLineMarker = function(d, a, e, b) {
      a = a.toScreenRange(this.doc);
      var c = b.lineHeight, f = Math.round(b.width - a.start.column * b.characterWidth), g = (a.start.row - b.firstRow) * b.lineHeight, l = Math.round(a.start.column * b.characterWidth);
      d.push("<div class='", e, "' style='", "height:", c, "px;", "width:", f, "px;", "top:", g, "px;", "left:", l, "px;'></div>");
      g = (a.end.row - b.firstRow) * b.lineHeight;
      f = Math.round(a.end.column * b.characterWidth);
      d.push("<div class='", e, "' style='", "height:", c, "px;", "top:", g, "px;", "width:", f, "px;'></div>");
      c = (a.end.row - a.start.row - 1) * b.lineHeight;
      if(!(c < 0)) {
        g = (a.start.row + 1 - b.firstRow) * b.lineHeight;
        d.push("<div class='", e, "' style='", "height:", c, "px;", "width:", b.width, "px;", "top:", g, "px;'></div>")
      }
    };
    this.drawSingleLineMarker = function(d, a, e, b, c) {
      a = a.toScreenRange(this.doc);
      var f = b.lineHeight;
      c = Math.round((a.end.column + (c || 0) - a.start.column) * b.characterWidth);
      var g = (a.start.row - b.firstRow) * b.lineHeight;
      a = Math.round(a.start.column * b.characterWidth);
      d.push("<div class='", e, "' style='", "height:", f, "px;", "width:", c, "px;", "top:", g, "px;", "left:", a, "px;'></div>")
    }
  }).call(h.prototype);
  j.Marker = h
});