ace.provide("ace.GutterLayer");

ace.GutterLayer = function(parentEl) {
    this.element = document.createElement("div");
    this.element.className = "layer gutter-layer";
    parentEl.appendChild(this.element);
};

ace.GutterLayer.prototype.update = function(config) {
    var html = [];
    for ( var i = config.firstRow; i <= config.lastRow; i++) {
        html.push("<div class='gutter-cell' style='height:" + config.lineHeight
                + "px;'>", i, "</div>");
        html.push("</div>");
    }

    this.element.innerHTML = html.join("");
};