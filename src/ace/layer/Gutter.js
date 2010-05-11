ace.provide("ace.layer.Gutter");

ace.layer.Gutter = function(parentEl) {
    this.element = document.createElement("div");
    this.element.className = "layer gutter-layer";
    parentEl.appendChild(this.element);

    this.$breakpoints = [];
};

(function() {

    this.setBreakpoints = function(rows) {
        this.$breakpoints = rows.concat();

        if (this.$config)
            this.update(this.$config);
    };

    this.update = function(config) {
        this.$config = config;

        var html = [];
        for ( var i = config.firstRow; i <= config.lastRow; i++) {
            html.push("<div class='gutter-cell",
                this.$breakpoints[i] ? " breakpoint" : "",
                "' style='height:", config.lineHeight, "px;'>", (i+1), "</div>");
            html.push("</div>");
        }

        this.element.innerHTML = html.join("");
        this.element.style.height = config.minHeight + "px";
    };

}).call(ace.layer.Gutter.prototype);