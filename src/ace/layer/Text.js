/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
require.def("ace/layer/Text", ["ace/lib/oop", "ace/lib/dom", "ace/MEventEmitter"], function(oop, dom, MEventEmitter) {

var Text = function(parentEl) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_text-layer";
    parentEl.appendChild(this.element);

    this.$characterSize = this.$measureSizes();
    //this.$pollSizeChanges();
};

(function() {

    oop.implement(this, MEventEmitter);

    this.EOF_CHAR = "&para;";
    this.EOL_CHAR = "&not;";
    this.TAB_CHAR = "&rarr;";
    this.SPACE_CHAR = "&middot;";

    this.setTokenizer = function(tokenizer) {
        this.tokenizer = tokenizer;
    };

    this.getLineHeight = function() {
        return this.$characterSize.height || 1;
    };

    this.getCharacterWidth = function() {
        return this.$characterSize.width || 1;
    };

    this.$pollSizeChanges = function() {
        var self = this;
        setInterval(function() {
            var size = self.$measureSizes();
            if (self.$characterSize.width !== size.width || self.$characterSize.height !== size.height) {
                self.$characterSize = size;
                self.$dispatchEvent("changeCharaterSize", {data: size});
            }
        }, 500);
    };

    this.$fontStyles = {
        fontFamily : 1,
        fontSize : 1,
        fontWeight : 1,
        fontStyle : 1,
        lineHeight : 1
    },

    this.$measureSizes = function() {
        var measureNode = document.createElement("div");
        var style = measureNode.style;

        style.width = style.height = "auto";
        style.left = style.top = "-1000px";
        style.visibility = "hidden";
        style.position = "absolute";
        style.overflow = "visible";

        for (var prop in this.$fontStyles) {
            var value = dom.computedStyle(this.element, prop);
            style[prop] = value;
        }

        // in FF 3.6 monospace fonts can have a fixed sub pixel width.
        // that's why we have to measure many characters
        // Note: characterWidth can be a float!
        measureNode.innerHTML = new Array(1000).join("Xy");
        document.body.insertBefore(measureNode, document.body.firstChild);

        var size = {
            height: measureNode.offsetHeight,
            width: measureNode.offsetWidth / 2000
        };

        document.body.removeChild(measureNode);
        return size;
    };

    this.setDocument = function(doc) {
        this.doc = doc;
    };

    this.$showInvisibles = false;
    this.setShowInvisibles = function(showInvisibles) {
        this.$showInvisibles = showInvisibles;
    };

    this.$computeTabString = function() {
        var tabSize = this.doc.getTabSize();
        if (this.$showInvisibles) {
            var halfTab = (tabSize) / 2;
            this.$tabString = "<span class='ace_invisible'>"
                + new Array(Math.floor(halfTab)).join("&nbsp;")
                + this.TAB_CHAR
                + new Array(Math.ceil(halfTab)+1).join("&nbsp;")
                + "</span>";
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

    this.$scrollLines = function(oldConfig, config) {
        if (oldConfig.lastRow < config.firstRow)
            return this.$fullUpdate(config);

        if (config.lastRow < oldConfig.firstRow)
            return this.$fullUpdate(config);

        var el = this.element;

        if (oldConfig.firstRow < config.firstRow)
            for (var row=oldConfig.firstRow; row<config.firstRow; row++)
                el.removeChild(el.firstChild);

        if (oldConfig.lastRow > config.lastRow)
            for (var row=config.lastRow+1; row<=oldConfig.lastRow; row++)
                el.removeChild(el.lastChild);

        if (config.firstRow < oldConfig.firstRow) {
            var fragment = this.$renderLinesFragment(config, config.firstRow, oldConfig.firstRow - 1);
            if (el.firstChild)
                el.insertBefore(fragment, el.firstChild);
            else
                el.appendChild(fragment);
        }

        if (config.lastRow > oldConfig.lastRow) {
            var fragment = this.$renderLinesFragment(config, oldConfig.lastRow + 1, config.lastRow);
            el.appendChild(fragment);
        }
    };

    this.$renderLinesFragment = function(config, firstRow, lastRow) {
        var fragment = document.createDocumentFragment();
        for (var row=firstRow; row<=lastRow; row++) {
            var lineEl = document.createElement("div");
            lineEl.className = "ace_line";
            var style = lineEl.style;
            style.height = this.$characterSize.height + "px";
            style.width = config.width + "px";

            var html = [];
            this.renderLine(html, row);
            lineEl.innerHTML = html.join("");
            fragment.appendChild(lineEl);
        }
        return fragment;
    };

    this.update = function(config) {
        if (!config.minHeight)
            return;

        this.$computeTabString();

        if (this.config && config.scrollOnly) {
            this.$scrollLines(this.config, config);
        } else {
            this.$fullUpdate(config);
        }

        this.config = config;
    };

    this.$fullUpdate = function(config) {
        var html = [];
        for ( var i = config.firstRow; i <= config.lastRow; i++) {
            html.push("<div class='ace_line' style='height:" + this.$characterSize.height + "px;", "width:",
                    config.width, "px'>");
            this.renderLine(html, i), html.push("</div>");
        }

        this.element.innerHTML = html.join("");
    };

    this.$textToken = {
        "text": true,
        "rparen": true,
        "lparen": true
    };

    this.renderLine = function(stringBuilder, row) {
        var tokens = this.tokenizer.getTokens(row);

        if (this.$showInvisibles) {
            var self = this;
            var spaceRe = /[\v\f \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]+/g;
            var spaceReplace = function(space) {
                var space = new Array(space.length+1).join(self.SPACE_CHAR);
                return "<span class='ace_invisible'>" + space + "</span>";
            };
        }
        else {
            var spaceRe = /[\v\f \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]/g;
            var spaceReplace = "&nbsp;";
        }

        for ( var i = 0; i < tokens.length; i++) {
            var token = tokens[i];

            var output = token.value
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(spaceRe, spaceReplace)
                .replace(/\t/g, this.$tabString);

            if (!this.$textToken[token.type]) {
                stringBuilder.push("<span class='ace_", token.type, "'>", output, "</span>");
            }
            else {
                stringBuilder.push(output);
            }
        };

        if (this.$showInvisibles) {
            if (row !== this.doc.getLength() - 1) {
                stringBuilder.push("<span class='ace_invisible'>" + this.EOL_CHAR + "</span>");
            } else {
                stringBuilder.push("<span class='ace_invisible'>" + this.EOF_CHAR + "</span>");
            }
        }
    };

}).call(Text.prototype);

return Text;
});
