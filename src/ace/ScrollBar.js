ace.provide("ace.ScrollBar");

ace.ScrollBar = function(parent) {
    this.element = document.createElement("div");
    this.element.className = "sb";

    this.inner = document.createElement("div");
    this.element.appendChild(this.inner);

    parent.appendChild(this.element);

    this.width = ace.scrollbarWidth();
    this.element.style.width = this.width;

    ace.addListener(this.element, "scroll", ace.bind(this.onScroll, this));
};

(function() {

    ace.implement(this, ace.MEventEmitter);

    this.onScroll = function() {
      this.$dispatchEvent("scroll", {data: this.element.scrollTop});
    };

    this.getWidth = function() {
        return this.width;
    };

    this.setHeight = function(height) {
        this.element.style.height = Math.max(0, height - this.width) + "px";
    };

    this.setInnerHeight = function(height) {
        this.inner.style.height = height + "px";
    };

    this.setScrollTop = function(scrollTop) {
        this.element.scrollTop = scrollTop;
    };

}).call(ace.ScrollBar.prototype);