define(function(b) {
  var d = b("../lib/dom");
  b = function(a) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_cursor-layer";
    a.appendChild(this.element);
    this.cursor = document.createElement("div");
    this.cursor.className = "ace_cursor";
    this.isVisible = false
  };
  (function() {
    this.setDocument = function(a) {
      this.doc = a
    };
    this.setCursor = function(a, c) {
      this.position = {row:a.row, column:this.doc.documentToScreenColumn(a.row, a.column)};
      c ? d.addCssClass(this.cursor, "ace_overwrite") : d.removeCssClass(this.cursor, "ace_overwrite")
    };
    this.hideCursor = function() {
      this.isVisible = false;
      this.cursor.parentNode && this.cursor.parentNode.removeChild(this.cursor);
      clearInterval(this.blinkId)
    };
    this.showCursor = function() {
      this.isVisible = true;
      this.element.appendChild(this.cursor);
      this.cursor.style.visibility = "visible";
      this.restartTimer()
    };
    this.restartTimer = function() {
      clearInterval(this.blinkId);
      if(this.isVisible) {
        var a = this.cursor;
        this.blinkId = setInterval(function() {
          a.style.visibility = "hidden";
          setTimeout(function() {
            a.style.visibility = "visible"
          }, 400)
        }, 1E3)
      }
    };
    this.getPixelPosition = function() {
      if(!this.config || !this.position) {
        return{left:0, top:0}
      }var a = this.position.row * this.config.lineHeight;
      return{left:Math.round(this.position.column * this.config.characterWidth), top:a}
    };
    this.update = function(a) {
      if(this.position) {
        this.config = a;
        var c = Math.round(this.position.column * a.characterWidth), e = this.position.row * a.lineHeight;
        this.pixelPos = {left:c, top:e};
        this.cursor.style.left = c + "px";
        this.cursor.style.top = e - a.firstRow * a.lineHeight + "px";
        this.cursor.style.width = a.characterWidth + "px";
        this.cursor.style.height = a.lineHeight + "px";
        this.isVisible && this.element.appendChild(this.cursor);
        this.restartTimer()
      }
    }
  }).call(b.prototype);
  return b
});