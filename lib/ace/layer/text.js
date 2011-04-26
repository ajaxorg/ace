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

    this.$characterSize = this.$measureSizes() || {width: 0, height: 0};
    this.$pollSizeChanges();
};

(function() {

    oop.implement(this, EventEmitter);

    this.EOF_CHAR = "&para;";
    this.EOL_CHAR = "&not;";
    this.TAB_CHAR = "&rarr;";
    this.SPACE_CHAR = "&middot;";

    this.getLineHeight = function() {
        return this.$characterSize.height || 1;
    };

    this.getCharacterWidth = function() {
        return this.$characterSize.width || 1;
    };

    this.checkForSizeChanges = function() {
        var size = this.$measureSizes();
        if (size && (this.$characterSize.width !== size.width || this.$characterSize.height !== size.height)) {
            this.$characterSize = size;
            this._dispatchEvent("changeCharaterSize", {data: size});
        }
    };

    this.$pollSizeChanges = function() {
        var self = this;
        setInterval(function() {
            self.checkForSizeChanges();
        }, 500);
    };

    this.$fontStyles = {
        fontFamily : 1,
        fontSize : 1,
        fontWeight : 1,
        fontStyle : 1,
        lineHeight : 1
    };

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

            if (document.body) {
                document.body.appendChild(measureNode);
            } else {
                var container = this.element.parentNode;
                while (!dom.hasCssClass(container, "ace_editor"))
                    container = container.parentNode;
                container.appendChild(measureNode);
            }

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

        // Size and width can be null if the editor is not visible or
        // detached from the document
        if (size.width == 0 && size.height == 0)
            return null;

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

    this.$tabStrings = [];
    this.$computeTabString = function() {
        var tabSize = this.session.getTabSize();
        var tabStr = this.$tabStrings = [0];
        for (var i = 1; i < tabSize + 1; i++) {
            if (this.showInvisibles) {
                tabStr.push("<span class='ace_invisible'>"
                    + this.TAB_CHAR
                    + new Array(i).join("&#160;")
                    + "</span>");
            } else {
                tabStr.push(new Array(i+1).join("&#160;"));
            }
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
        var tokens = this.session.getTokens(first, last);
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
        var tokens = this.session.getTokens(firstRow, lastRow);
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
        var tokens = this.session.getTokens(config.firstRow, config.lastRow)
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
        var _self = this,
            characterWidth = this.config.characterWidth,
            screenColumn = 0;

        function addToken(token, value) {
            var output = value
                    .replace(/\t|&|<|( +)|([\v\f \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000])|[\u1100-\u115F]|[\u11A3-\u11A7]|[\u11FA-\u11FF]|[\u2329-\u232A]|[\u2E80-\u2E99]|[\u2E9B-\u2EF3]|[\u2F00-\u2FD5]|[\u2FF0-\u2FFB]|[\u3000-\u303E]|[\u3041-\u3096]|[\u3099-\u30FF]|[\u3105-\u312D]|[\u3131-\u318E]|[\u3190-\u31BA]|[\u31C0-\u31E3]|[\u31F0-\u321E]|[\u3220-\u3247]|[\u3250-\u32FE]|[\u3300-\u4DBF]|[\u4E00-\uA48C]|[\uA490-\uA4C6]|[\uA960-\uA97C]|[\uAC00-\uD7A3]|[\uD7B0-\uD7C6]|[\uD7CB-\uD7FB]|[\uF900-\uFAFF]|[\uFE10-\uFE19]|[\uFE30-\uFE52]|[\uFE54-\uFE66]|[\uFE68-\uFE6B]|[\uFF01-\uFF60]|[\uFFE0-\uFFE6]/g, function(c, a, b, tabIdx, idx4) {
                        if (c.charCodeAt(0) == 32) {
                            return new Array(c.length+1).join("&#160;");
                        } else if (c == "\t") {
                            var tabSize = _self.session.
                                    getScreenTabSize(screenColumn + tabIdx);
                            screenColumn += tabSize - 1;
                            return _self.$tabStrings[tabSize];
                        } else if (c == "&") {
                            return "&amp";
                        } else if (c == "<") {
                            return "&lt;";
                        } else if (c.match(/[\v\f \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]/)) {
                            if (this.showInvisibles) {
                                var space = new Array(c.length+1).join(self.SPACE_CHAR);
                                return "<span class='ace_invisible'>" + space + "</span>";
                            } else {
                                return "&#160;"
                            }
                        } else {
                            screenColumn += 1;
                            return "<span class='ace_cjk' style='width:" + (characterWidth * 2) + "px'>" + c + "</span>"
                        }
                    });
                screenColumn += value.length;

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
                    screenColumn = 0;
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
