define(function(a, c) {
  var d = a("pilot/oop"), e = a("pilot/dom"), f = a("pilot/event"), g = a("pilot/event_emitter").EventEmitter;
  a = function(b) {
    this.element = document.createElement("div");
    this.element.className = "ace_sb";
    this.inner = document.createElement("div");
    this.element.appendChild(this.inner);
    b.appendChild(this.element);
    this.width = e.scrollbarWidth();
    this.element.style.width = this.width;
    f.addListener(this.element, "scroll", this.onScroll.bind(this))
  };
  (function() {
    d.implement(this, g);
    this.onScroll = function() {
      this._dispatchEvent("scroll", {data:this.element.scrollTop})
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
  c.ScrollBar = a
});