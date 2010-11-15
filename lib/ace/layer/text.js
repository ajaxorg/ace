/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org Services B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {

var oop = require("ace/lib/oop").oop;
var dom = require("ace/lib/dom").dom;
var MEventEmitter = require("ace/event_emitter").MEventEmitter;

var Text = function(parentEl) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_text-layer";
    parentEl.appendChild(this.element);

    this.$characterSize = this.$measureSizes();
    this.$pollSizeChanges();
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
        var _self = this;
        this.tokenizer.getTokens(first, last, function(tokens) {
            for ( var i = first; i <= last; i++) {
                var lineElement = lineElements[i - layerConfig.firstRow];
                if (!lineElement) 
                    continue;

                var html = [];
                _self.$renderLine(html, i, tokens[i-first].tokens);
                lineElement.innerHTML = html.join("");
            }
        });
    };

    this.scrollLines = function(config) {
        var _self = this;

        this.$computeTabString();
        var oldConfig = this.config;
        this.config = config;

        if (!oldConfig || oldConfig.lastRow < config.firstRow)
            return this.update(config);

        if (config.lastRow < oldConfig.firstRow)
            return this.update(config);

        var el = this.element;

        if (oldConfig.firstRow < config.firstRow)
            for (var row=oldConfig.firstRow; row<config.firstRow; row++)
                el.removeChild(el.firstChild);

        if (oldConfig.lastRow > config.lastRow)
            for (var row=config.lastRow+1; row<=oldConfig.lastRow; row++)
                el.removeChild(el.lastChild);

        appendTop(appendBottom);

        function appendTop(callback) {
            if (config.firstRow < oldConfig.firstRow) {
                _self.$renderLinesFragment(config, config.firstRow, oldConfig.firstRow - 1, function(fragment) {
                    if (el.firstChild)
                        el.insertBefore(fragment, el.firstChild);
                    else
                        el.appendChild(fragment);
                    callback();
                });
            }
            else
                callback();
        }

        function appendBottom() {
            if (config.lastRow > oldConfig.lastRow) {
                _self.$renderLinesFragment(config, oldConfig.lastRow + 1, config.lastRow, function(fragment) {
                    el.appendChild(fragment);
                });
            }
        }
    };

    this.$renderLinesFragment = function(config, firstRow, lastRow, callback) {
        var fragment = document.createDocumentFragment();
        var _self = this;
        this.tokenizer.getTokens(firstRow, lastRow, function(tokens) {
            for (var row=firstRow; row<=lastRow; row++) {
                var lineEl = document.createElement("div");
                lineEl.className = "ace_line";
                var style = lineEl.style;
                style.height = _self.$characterSize.height + "px";
                style.width = config.width + "px";

                var html = [];
                _self.$renderLine(html, row, tokens[row-firstRow].tokens);
                lineEl.innerHTML = html.join("");
                fragment.appendChild(lineEl);
            }
            callback(fragment);
        });
    };

    this.update = function(config) {
        this.$computeTabString();

        var html = [];
        var _self = this;
        this.tokenizer.getTokens(config.firstRow, config.lastRow, function(tokens) {
            for ( var i = config.firstRow; i <= config.lastRow; i++) {
                html.push("<div class='ace_line' style='height:" + _self.$characterSize.height + "px;", "width:",
                        config.width, "px'>");
                _self.$renderLine(html, i, tokens[i-config.firstRow].tokens), html.push("</div>");
            }

            _self.element.innerHTML = html.join("");
        });
    };

    this.$textToken = {
        "text": true,
        "rparen": true,
        "lparen": true
    };

    this.$renderLine = function(stringBuilder, row, tokens) {
//        if (this.$showInvisibles) {
//            var self = this;
//            var spaceRe = /[\v\f \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]+/g;
//            var spaceReplace = function(space) {
//                var space = new Array(space.length+1).join(self.SPACE_CHAR);
//                return "<span class='ace_invisible'>" + space + "</span>";
//            };
//        }
//        else {
            var spaceRe = /[\v\f \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]/g;
            var spaceReplace = "&nbsp;";
//        }

        for ( var i = 0; i < tokens.length; i++) {
            var token = tokens[i];

            var output = token.value
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(spaceRe, spaceReplace)
                .replace(/\t/g, this.$tabString);

            if (!this.$textToken[token.type]) {
                var classes = "ace_" + token.type.replace(/\./g, " ace_");
                stringBuilder.push("<span class='", classes, "'>", output, "</span>");
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

exports.Text = Text;

});
