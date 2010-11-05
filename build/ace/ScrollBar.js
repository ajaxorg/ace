/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def("ace/ScrollBar", ["ace/lib/oop", "ace/lib/lang", "ace/lib/dom", "ace/lib/event", "ace/MEventEmitter"], function(c, d, e, f, g) {
  var b = function(a) {
    this.element = document.createElement("div");
    this.element.className = "ace_sb";
    this.inner = document.createElement("div");
    this.element.appendChild(this.inner);
    a.appendChild(this.element);
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
    this.setHeight = function(a) {
      this.element.style.height = Math.max(0, a - this.width) + "px"
    };
    this.setInnerHeight = function(a) {
      this.inner.style.height = a + "px"
    };
    this.setScrollTop = function(a) {
      this.element.scrollTop = a
    }
  }).call(b.prototype);
  return b
});