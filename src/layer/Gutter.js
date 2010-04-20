ace.provide("ace.layer.Gutter");

ace.layer.Gutter = function(parentEl) {
    this.element = document.createElement("div");
    this.element.className = "layer gutter-layer";
    parentEl.appendChild(this.element);
};

ace.layer.Gutter.prototype.update = function(config) {
    var html = [];
    for ( var i = config.firstRow; i <= config.lastRow; i++) {
        html.push("<div class='gutter-cell' style='height:" + config.lineHeight
                + "px;'>", (i+1), "</div>");
        html.push("</div>");
    }

    this.element.innerHTML = html.join("");
};