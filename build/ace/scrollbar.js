define(function(a) {
  var c = a("./lib/oop"), d = a("./lib/lang"), e = a("./lib/dom"), f = a("./lib/event"), g = a("./event_emitter");
  a = function(b) {
    this.element = document.createElement("div");
    this.element.className = "ace_sb";
    this.inner = document.createElement("div");
    this.element.appendChild(this.inner);
    b.appendChild(this.element);
    this.width = e.scrollbarWidth();
    this.element.style.width = this.width;
    f.addListener(this.element, "scroll", d.bind(this.onScroll, this))
  };
  (function() {
    c.implement(this, g);
    this.onScroll = function() {
      this.$dispatchEvent("scroll", {data:this.element.scrollTop})
    };
    this.getWidth = function() {
      return this.width
    };
    this.setHeight = function(b) {
      this.element.style.height = Math.max(0, b - this.width) + "px"
    };
    this.setInnerHeight = function(b) {
      this.inner.style.height = b + "px"
    };
    this.setScrollTop = function(b) {
      this.element.scrollTop = b
    }
  }).call(a.prototype);
  return a
});