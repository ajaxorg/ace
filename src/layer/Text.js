ace.provide("ace.layer.Text");

ace.layer.Text = function(parentEl) {
    this.element = document.createElement("div");
    this.element.className = "layer text-layer";
    parentEl.appendChild(this.element);

    this._measureSizes();
    this._tabString = " ";
};

ace.layer.Text.prototype.setTokenizer = function(tokenizer) {
    this.tokenizer = tokenizer;
};

ace.layer.Text.prototype.getLineHeight = function() {
    return this.lineHeight;
};

ace.layer.Text.prototype.getCharacterWidth = function() {
    return this.characterWidth;
};

ace.layer.Text.prototype._measureSizes = function() {
    var measureNode = document.createElement("div");
    var style = measureNode.style;
    style.width = style.height = "auto";
    style.left = style.top = "-1000px";
    style.visibility = "hidden";
    style.position = "absolute";
    style.overflow = "visible";

    measureNode.innerHTML = new Array(1000).join("Xy");
    this.element.appendChild(measureNode);

    // in FF 3.6 monospace fonts can have a fixed sub pixel width.
    // that's why we have to measure many characters
    // Note: characterWidth can be a float!
    this.lineHeight = measureNode.offsetHeight;
    this.characterWidth = measureNode.offsetWidth / 2000;

    this.element.removeChild(measureNode);
};

ace.layer.Text.prototype.setTabSize = function(tabSize) {
    this._tabString = new Array(tabSize+1).join("&nbsp;");
};

ace.layer.Text.prototype.updateLines = function(layerConfig, firstRow, lastRow) {
    var first = Math.max(firstRow, layerConfig.firstRow);
    var last = Math.min(lastRow, layerConfig.lastRow);

    var lineElements = this.element.childNodes;

    for ( var i = first; i <= last; i++) {
        var html = [];
        this.renderLine(html, i);

        var lineElement = lineElements[i - layerConfig.firstRow];
        lineElement.innerHTML = html.join("");
    };
};

ace.layer.Text.prototype.update = function(config) {
    var html = [];
    for ( var i = config.firstRow; i <= config.lastRow; i++) {
        html.push("<div class='line' style='height:" + this.lineHeight + "px;", "width:",
                  config.width, "px'>");
        this.renderLine(html, i), html.push("</div>");
    }

    this.element.innerHTML = html.join("");
};

ace.layer.Text.prototype.renderLine = function(stringBuilder, row) {
    var tokens = this.tokenizer.getTokens(row);
    for ( var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        var output = token.value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/\t/g, this._tabString)
            .replace(/\s/g, "&nbsp;");

        if (token.type !== "text") {
            stringBuilder.push("<span class='", token.type, "'>", output,
                               "</span>");
        }
        else {
            stringBuilder.push(output);
        }
    };
};