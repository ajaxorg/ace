ace.provide("ace.layer.Text");

ace.layer.Text = function(parentEl) {
    this.element = document.createElement("div");
    this.element.className = "layer text-layer";
    parentEl.appendChild(this.element);

    this.$measureSizes();
};

(function() {

//    this.ENTER_CHAR = "&para;";
    this.ENTER_CHAR = "&not;";
    this.TAB_CHAR = "&#x2023;";

    this.setTokenizer = function(tokenizer) {
        this.tokenizer = tokenizer;
    };

    this.getLineHeight = function() {
        return this.lineHeight;
    };

    this.getCharacterWidth = function() {
        return this.characterWidth;
    };

    this.$measureSizes = function() {
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

    this.setDocument = function(doc) {
        this.doc = doc;
    };

    this.$showInvisibles = true;
    this.setShowInvisibles = function(showInvisibles) {
        this.$showInvisibles = showInvisibles;
    };

    this.$computeTabString = function() {
        var tabSize = this.doc.getTabSize();
        if (this.$showInvisibles) {
            this.$tabString = "<span class='invisible'>" + this.TAB_CHAR + new Array(tabSize).join("&nbsp;") + "</span>";
        } else {
            this.$tabString = new Array(tabSize+1).join("&nbsp;");
        }
    };

    this.updateLines = function(layerConfig, firstRow, lastRow) {
        this.$computeTabString();

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

    this.update = function(config) {
        this.$computeTabString();

        var html = [];
        for ( var i = config.firstRow; i <= config.lastRow; i++) {
            html.push("<div class='line' style='height:" + this.lineHeight + "px;", "width:",
                      config.width, "px'>");
            this.renderLine(html, i), html.push("</div>");
        }

        this.element.innerHTML = html.join("");
    };

    this.renderLine = function(stringBuilder, row) {
        var tokens = this.tokenizer.getTokens(row);
        for ( var i = 0; i < tokens.length; i++) {
            var token = tokens[i];

            var output = token.value
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/ /g, "&nbsp;")
                .replace(/\t/g, this.$tabString);
            // TODO: proper space matching!

            if (token.type !== "text") {
                stringBuilder.push("<span class='", token.type, "'>", output, "</span>");
            }
            else {
                stringBuilder.push(output);
            }
        };

        if (this.$showInvisibles && row !== this.doc.getLength() - 1)
            stringBuilder.push("<span class='invisible'>" + this.ENTER_CHAR + "</span>");
    };

}).call(ace.layer.Text.prototype);