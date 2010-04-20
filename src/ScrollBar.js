ace.provide("ace.ScrollBar");

ace.ScrollBar = function(parent) {
    this.$initEvents();

    this.element = document.createElement("div");
    this.element.className = "scrollbar";

    this.inner = document.createElement("div");
    this.element.appendChild(this.inner);

    parent.appendChild(this.element);

    this.width = ace.scrollbarWidth();
    this.element.style.width = this.width;

    ace.addListener(this.element, "scroll", ace.bind(this.onScroll, this));
};

ace.mixin(ace.ScrollBar.prototype, ace.MEventEmitter);

ace.ScrollBar.prototype.onScroll = function() {
  this.$dispatchEvent("scroll", {data: this.element.scrollTop});
};

ace.ScrollBar.prototype.getWidth = function() {
    return this.width;
};

ace.ScrollBar.prototype.setHeight = function(height) {
    this.element.style.height = (height - this.width) + "px";
};

ace.ScrollBar.prototype.setInnerHeight = function(height) {
    this.inner.style.height = height + "px";
};

ace.ScrollBar.prototype.setScrollTop = function(scrollTop) {
    this.element.scrollTop = scrollTop;
};