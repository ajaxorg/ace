define(function() {
  var d = function(a) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_gutter-layer";
    a.appendChild(this.element);
    this.$breakpoints = [];
    this.$decorations = []
  };
  (function() {
    this.addGutterDecoration = function(a, b) {
      this.$decorations[a] || (this.$decorations[a] = "");
      this.$decorations[a] += " ace_" + b
    };
    this.removeGutterDecoration = function(a, b) {
      this.$decorations[a] = this.$decorations[a].replace(" ace_" + b, "")
    };
    this.setBreakpoints = function(a) {
      this.$breakpoints = a.concat()
    };
    this.update = function(a) {
      this.$config = a;
      for(var b = [], c = a.firstRow;c <= a.lastRow;c++) {
        b.push("<div class='ace_gutter-cell", this.$decorations[c] || "", this.$breakpoints[c] ? " ace_breakpoint" : "", "' style='height:", a.lineHeight, "px;'>", c + 1, "</div>");
        b.push("</div>")
      }this.element.innerHTML = b.join("");
      this.element.style.height = a.minHeight + "px"
    }
  }).call(d.prototype);
  return d
});