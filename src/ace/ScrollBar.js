/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
require.def("ace/ScrollBar", ["ace/ace", "ace/MEventEmitter"], function(ace, MEventEmitter) {

var ScrollBar = function(parent) {
    this.element = document.createElement("div");
    this.element.className = "ace_sb";

    this.inner = document.createElement("div");
    this.element.appendChild(this.inner);

    parent.appendChild(this.element);

    this.width = ace.scrollbarWidth();
    this.element.style.width = this.width;

    ace.addListener(this.element, "scroll", ace.bind(this.onScroll, this));
};

(function() {
    ace.implement(this, MEventEmitter);

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

}).call(ScrollBar.prototype);

return ScrollBar;
});
