/* vim:ts=4:sts=4:sw=4:
 * ***** BEGIN LICENSE BLOCK *****
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
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *      Julian Viereck <julian.viereck@gmail.com>
 *      Mihai Sucan <mihai.sucan@gmail.com>
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

var oop = require("pilot/oop");
var dom = require("pilot/dom");
var lang = require("pilot/lang");
var EventEmitter = require("pilot/event_emitter").EventEmitter;

var Text = function(parentEl) {
    this.element = dom.createElement("div");
    this.element.className = "ace_layer ace_text-layer";
    parentEl.appendChild(this.element);

    this.$characterSize = this.$measureSizes();
    this.$pollSizeChanges();
};

(function() {

    oop.implement(this, EventEmitter);

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
                self._dispatchEvent("changeCharaterSize", {data: size});
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
        var n = 1000;
        if (!this.$measureNode) {
            var measureNode = this.$measureNode = dom.createElement("div");
            var style = measureNode.style;

            style.width = style.height = "auto";
            style.left = style.top = (-n * 40)  + "px";

            style.visibility = "hidden";
            style.position = "absolute";
            style.overflow = "visible";
            style.whiteSpace = "nowrap";

            // in FF 3.6 monospace fonts can have a fixed sub pixel width.
            // that's why we have to measure many characters
            // Note: characterWidth can be a float!
            measureNode.innerHTML = lang.stringRepeat("Xy", n);

            var container = this.element.parentNode;
            while (!dom.hasCssClass(container, "ace_editor"))
                container = container.parentNode;

            container.appendChild(measureNode);
        }

        var style = this.$measureNode.style;
        for (var prop in this.$fontStyles) {
            var value = dom.computedStyle(this.element, prop);
            style[prop] = value;
        }

        var size = {
            height: this.$measureNode.offsetHeight,
            width: this.$measureNode.offsetWidth / (n * 2)
        };
        return size;
    };

    this.setSession = function(session) {
        this.session = session;
    };

    this.showInvisibles = false;
    this.setShowInvisibles = function(showInvisibles) {
        if (this.showInvisibles == showInvisibles)
            return false;

        this.showInvisibles = showInvisibles;
        return true;
    };

    this.$computeTabString = function() {
        var tabSize = this.session.getTabSize();
        if (this.showInvisibles) {
            var halfTab = (tabSize) / 2;
            this.$tabString = "<span class='ace_invisible'>"
                + new Array(Math.floor(halfTab)).join("&#160;")
                + this.TAB_CHAR
                + new Array(Math.ceil(halfTab)+1).join("&#160;")
                + "</span>";
        } else {
            this.$tabString = new Array(tabSize+1).join("&#160;");
        }
    };

    this.updateLines = function(config, firstRow, lastRow) {
        this.$computeTabString();
        // Due to wrap line changes there can be new lines if e.g.
        // the line to updated wrapped in the meantime.
        if (this.config.lastRow != config.lastRow ||
            this.config.firstRow != config.firstRow) {
            this.scrollLines(config);
        }
        this.config = config;

        var first = Math.max(firstRow, config.firstRow);
        var last = Math.min(lastRow, config.lastRow);

        var lineElements = this.element.childNodes;
        var tokens = this.tokenizer.getTokens(first, last);
        for (var i=first; i<=last; i++) {
            var lineElement = lineElements[i - config.firstRow];
            if (!lineElement)
                continue;

            var html = [];
            this.$renderLine(html, i, tokens[i-first].tokens);
            lineElement = dom.setInnerHtml(lineElement, html.join(""));
            lineElement.style.height =
                    this.session.getRowHeight(config, i) + "px";
        }
    };

    this.scrollLines = function(config) {
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
        var tokens = this.tokenizer.getTokens(firstRow, lastRow);
        for (var row=firstRow; row<=lastRow; row++) {
            var lineEl = dom.createElement("div");
            lineEl.className = "ace_line";
            var style = lineEl.style;
            style.height = this.session.getRowHeight(config, row) + "px";
            style.width = config.width + "px";

            var html = [];
            if (tokens.length > row-firstRow)
                this.$renderLine(html, row, tokens[row-firstRow].tokens);
            // don't use setInnerHtml since we are working with an empty DIV
            lineEl.innerHTML = html.join("");
            fragment.appendChild(lineEl);
        }
        return fragment;
    };

    this.update = function(config) {
        this.$computeTabString();
        this.config = config;

        var html = [];
        var tokens = this.tokenizer.getTokens(config.firstRow, config.lastRow)
        var fragment = this.$renderLinesFragment(config, config.firstRow, config.lastRow);

        // Clear the current content of the element and add the rendered fragment.
        this.element.innerHTML =  "";
        this.element.appendChild(fragment);
    };

    this.$textToken = {
        "text": true,
        "rparen": true,
        "lparen": true
    };

    this.$renderLine = function(stringBuilder, row, tokens) {
        if (this.showInvisibles) {
            var self = this;
            var spaceRe = /( +)|([\v\f \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000])/g;
            var spaceReplace = function(space) {
                if (space.charCodeAt(0) == 32)
                    return new Array(space.length+1).join("&#160;");
                else {
                    var space = new Array(space.length+1).join(self.SPACE_CHAR);
                    return "<span class='ace_invisible'>" + space + "</span>";
                }

            };
        }
        else {
            var spaceRe = /[\v\f \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]/g;
            var spaceReplace = "&#160;";
        }

        var _self = this;
        var characterWidth = this.config.characterWidth;
        function addToken(token, value) {
            var output = value
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(spaceRe, spaceReplace)
                .replace(/\t/g, _self.$tabString)
                .replace(/[\u3040-\u309F]|[\u30A0-\u30FF]|[\u4E00-\u9FFF\uF900-\uFAFF\u3400-\u4DBF]/g, function(c) {
                    return "<span class='ace_cjk' style='width:" + (characterWidth * 2) + "px'>" + c + "</span>"
                });

            if (!_self.$textToken[token.type]) {
                var classes = "ace_" + token.type.replace(/\./g, " ace_");
                stringBuilder.push("<span class='", classes, "'>", output, "</span>");
            }
            else {
                stringBuilder.push(output);
            }
        }

        var splits = this.session.getRowSplitData(row);
        var chars = 0, split = 0, splitChars;

        if (!splits || splits.length == 0) {
            splitChars = Number.MAX_VALUE;
        } else {
            splitChars = splits[0];
        }

        stringBuilder.push("<div style='height:",
            this.config.lineHeight, "px",
            "'>");
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            var value = token.value;

            if (chars + value.length < splitChars) {
                addToken(token, value);
                chars += value.length;
            } else {
                while (chars + value.length >= splitChars) {
                    addToken(token, value.substring(0, splitChars - chars));
                    value = value.substring(splitChars - chars);
                    chars = splitChars;
                    stringBuilder.push("</div>",
                        "<div style='height:",
                        this.config.lineHeight, "px",
                        "'>");
                    split ++;
                    splitChars = splits[split] || Number.MAX_VALUE;
                }
                if (value.length != 0) {
                    chars += value.length;
                    addToken(token, value);
                }
            }
        };

        if (this.showInvisibles) {
            if (row !== this.session.getLength() - 1) {
                stringBuilder.push("<span class='ace_invisible'>" + this.EOL_CHAR + "</span>");
            } else {
                stringBuilder.push("<span class='ace_invisible'>" + this.EOF_CHAR + "</span>");
            }
        }
        stringBuilder.push("</div>");
    };

}).call(Text.prototype);

exports.Text = Text;

});
