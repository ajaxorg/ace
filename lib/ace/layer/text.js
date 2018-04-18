/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var dom = require("../lib/dom");
var lang = require("../lib/lang");
var Lines = require("./lines").Lines;
var EventEmitter = require("../lib/event_emitter").EventEmitter;

var Text = function(parentEl) {
    this.dom = dom; 
    this.element = this.dom.createElement("div");
    this.element.className = "ace_layer ace_text-layer";
    parentEl.appendChild(this.element);
    this.$updateEolChar = this.$updateEolChar.bind(this);
    this.$lines = new Lines(this.element);
};

(function() {

    oop.implement(this, EventEmitter);

    this.EOF_CHAR = "\xB6";
    this.EOL_CHAR_LF = "\xAC";
    this.EOL_CHAR_CRLF = "\xa4";
    this.EOL_CHAR = this.EOL_CHAR_LF;
    this.TAB_CHAR = "\u2014"; //"\u21E5";
    this.SPACE_CHAR = "\xB7";
    this.$padding = 0;
    this.MAX_LINE_LENGTH = 10000;

    this.$updateEolChar = function() {
        var doc = this.session.doc;
        var unixMode = doc.getNewLineCharacter() == "\n" && doc.getNewLineMode() != "windows";
        var EOL_CHAR = unixMode ? this.EOL_CHAR_LF : this.EOL_CHAR_CRLF;
        if (this.EOL_CHAR != EOL_CHAR) {
            this.EOL_CHAR = EOL_CHAR;
            return true;
        }
    };

    this.setPadding = function(padding) {
        this.$padding = padding;
        this.element.style.margin = "0 " + padding + "px";
    };

    this.getLineHeight = function() {
        return this.$fontMetrics.$characterSize.height || 0;
    };

    this.getCharacterWidth = function() {
        return this.$fontMetrics.$characterSize.width || 0;
    };
    
    this.$setFontMetrics = function(measure) {
        this.$fontMetrics = measure;
        this.$fontMetrics.on("changeCharacterSize", function(e) {
            this._signal("changeCharacterSize", e);
        }.bind(this));
        this.$pollSizeChanges();
    };

    this.checkForSizeChanges = function() {
        this.$fontMetrics.checkForSizeChanges();
    };
    this.$pollSizeChanges = function() {
        return this.$pollSizeChangesTimer = this.$fontMetrics.$pollSizeChanges();
    };
    this.setSession = function(session) {
        this.session = session;
        if (session)
            this.$computeTabString();
    };

    this.showInvisibles = false;
    this.setShowInvisibles = function(showInvisibles) {
        if (this.showInvisibles == showInvisibles)
            return false;

        this.showInvisibles = showInvisibles;
        this.$computeTabString();
        return true;
    };

    this.displayIndentGuides = true;
    this.setDisplayIndentGuides = function(display) {
        if (this.displayIndentGuides == display)
            return false;

        this.displayIndentGuides = display;
        this.$computeTabString();
        return true;
    };

    this.$tabStrings = [];
    this.onChangeTabSize =
    this.$computeTabString = function() {
        var tabSize = this.session.getTabSize();
        this.tabSize = tabSize;
        var tabStr = this.$tabStrings = [0];
        for (var i = 1; i < tabSize + 1; i++) {
            if (this.showInvisibles) {
                var span = this.dom.createElement("span");
                span.className = "ace_invisible ace_invisible_tab";
                span.textContent = lang.stringRepeat(this.TAB_CHAR, i);
                tabStr.push(span);
            } else {
                tabStr.push(this.dom.createTextNode(lang.stringRepeat(" ", i), this.element));
            }
        }
        if (this.displayIndentGuides) {
            this.$indentGuideRe =  /\s\S| \t|\t |\s$/;
            var className = "ace_indent-guide";
            var spaceClass = "";
            var tabClass = "";
            if (this.showInvisibles) {
                className += " ace_invisible";
                spaceClass = " ace_invisible_space";
                tabClass = " ace_invisible_tab";
                var spaceContent = lang.stringRepeat(this.SPACE_CHAR, this.tabSize);
                var tabContent = lang.stringRepeat(this.TAB_CHAR, this.tabSize);
            } else {
                var spaceContent = lang.stringRepeat(" ", this.tabSize);
                var tabContent = spaceContent;
            }

            var span = this.dom.createElement("span");
            span.className = className + spaceClass;
            span.textContent = spaceContent;
            this.$tabStrings[" "] = span;
            
            var span = this.dom.createElement("span");
            span.className = className + tabClass;
            span.textContent = tabContent;
            this.$tabStrings["\t"] = span;
        }
    };

    this.updateLines = function(config, firstRow, lastRow) {
        // Due to wrap line changes there can be new lines if e.g.
        // the line to updated wrapped in the meantime.
        if (this.config.lastRow != config.lastRow ||
            this.config.firstRow != config.firstRow) {
            return this.update(config);
        }
        
        this.config = config;

        var first = Math.max(firstRow, config.firstRow);
        var last = Math.min(lastRow, config.lastRow);

        var lineElements = this.element.childNodes;
        var lineElementsIdx = 0;

        for (var row = config.firstRow; row < first; row++) {
            var foldLine = this.session.getFoldLine(row);
            if (foldLine) {
                if (foldLine.containsRow(first)) {
                    first = foldLine.start.row;
                    break;
                } else {
                    row = foldLine.end.row;
                }
            }
            lineElementsIdx ++;
        }

        var heightChanged = false;
        var row = first;
        var foldLine = this.session.getNextFoldLine(row);
        var foldStart = foldLine ? foldLine.start.row : Infinity;

        while (true) {
            if (row > foldStart) {
                row = foldLine.end.row+1;
                foldLine = this.session.getNextFoldLine(row, foldLine);
                foldStart = foldLine ? foldLine.start.row :Infinity;
            }
            if (row > last)
                break;

            var lineElement = lineElements[lineElementsIdx++];
            if (lineElement) {
                this.dom.removeChildren(lineElement);
                this.$renderLine(
                    lineElement, row, row == foldStart ? foldLine : false
                );
                var height = (config.lineHeight * this.session.getRowLength(row)) + "px";
                if (lineElement.style.height != height) {
                    heightChanged = true;
                    lineElement.style.height = height;
                }
            }
            row++;
        }
        if (heightChanged) {
            while (lineElementsIdx < this.$lines.cells.length) {
                var cell = this.$lines.cells[lineElementsIdx++];
                cell.element.style.top = this.$lines.computeLineTop(cell.row, config, this.session) + "px";
            }
        }
    };

    this.scrollLines = function(config) {
        var oldConfig = this.config;
        this.config = config;

        if (this.$lines.pageChanged(oldConfig, config))
            return this.update(config);
            
        this.$lines.moveContainer(config);
        
        var lastRow = config.lastRow;
        var oldLastRow = oldConfig ? oldConfig.lastRow : -1;

        if (!oldConfig || oldLastRow < config.firstRow)
            return this.update(config);

        if (lastRow < oldConfig.firstRow)
            return this.update(config);

        if (!oldConfig || oldConfig.lastRow < config.firstRow)
            return this.update(config);

        if (config.lastRow < oldConfig.firstRow)
            return this.update(config);

        if (oldConfig.firstRow < config.firstRow)
            for (var row=this.session.getFoldedRowCount(oldConfig.firstRow, config.firstRow - 1); row>0; row--)
                this.$lines.shift();

        if (oldConfig.lastRow > config.lastRow)
            for (var row=this.session.getFoldedRowCount(config.lastRow + 1, oldConfig.lastRow); row>0; row--)
                this.$lines.pop();

        if (config.firstRow < oldConfig.firstRow) {
            this.$lines.unshift(this.$renderLinesFragment(config, config.firstRow, oldConfig.firstRow - 1));
        }

        if (config.lastRow > oldConfig.lastRow) {
            this.$lines.push(this.$renderLinesFragment(config, oldConfig.lastRow + 1, config.lastRow));
        }
    };

    this.$renderLinesFragment = function(config, firstRow, lastRow) {
        var fragment = [];
        var row = firstRow;
        var foldLine = this.session.getNextFoldLine(row);
        var foldStart = foldLine ? foldLine.start.row : Infinity;

        while (true) {
            if (row > foldStart) {
                row = foldLine.end.row+1;
                foldLine = this.session.getNextFoldLine(row, foldLine);
                foldStart = foldLine ? foldLine.start.row : Infinity;
            }
            if (row > lastRow)
                break;

            var line = this.$lines.createCell(row, config, this.session);
            
            var lineEl = line.element;
            this.dom.removeChildren(lineEl);
            dom.setStyle(lineEl.style, "height", this.$lines.computeLineHeight(row, config, this.session) + "px");
            dom.setStyle(lineEl.style, "top", this.$lines.computeLineTop(row, config, this.session) + "px");

            // Get the tokens per line as there might be some lines in between
            // beeing folded.
            this.$renderLine(lineEl, row, row == foldStart ? foldLine : false);

            if (this.$useLineGroups()) {
                lineEl.className = "ace_line_group";
            } else {
                lineEl.className = "ace_line";
            }
            fragment.push(line);

            row++;
        }
        return fragment;
    };

    this.update = function(config) {
        this.$lines.moveContainer(config);
        
        this.config = config;

        var firstRow = config.firstRow;
        var lastRow = config.lastRow;

        var lines = this.$lines;
        while (lines.getLength())
            lines.pop();
            
        lines.push(this.$renderLinesFragment(config, firstRow, lastRow));
    };

    this.$textToken = {
        "text": true,
        "rparen": true,
        "lparen": true
    };

    this.$renderToken = function(parent, screenColumn, token, value) {
        var self = this;
        var re = /(\t)|( +)|([\x00-\x1f\x80-\xa0\xad\u1680\u180E\u2000-\u200f\u2028\u2029\u202F\u205F\uFEFF\uFFF9-\uFFFC]+)|(\u3000)|([\u1100-\u115F\u11A3-\u11A7\u11FA-\u11FF\u2329-\u232A\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3001-\u303E\u3041-\u3096\u3099-\u30FF\u3105-\u312D\u3131-\u318E\u3190-\u31BA\u31C0-\u31E3\u31F0-\u321E\u3220-\u3247\u3250-\u32FE\u3300-\u4DBF\u4E00-\uA48C\uA490-\uA4C6\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFAFF\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFF01-\uFF60\uFFE0-\uFFE6]|[\uD800-\uDBFF][\uDC00-\uDFFF])/g;
        
        var valueFragment = this.dom.createFragment(this.element);

        var m;
        var i = 0;
        while (m = re.exec(value)) {
            var tab = m[1];
            var simpleSpace = m[2];
            var controlCharacter = m[3];
            var cjkSpace = m[4];
            var cjk = m[5];
            
            if (!self.showInvisibles && simpleSpace)
                continue;

            var before = i != m.index ? value.slice(i, m.index) : "";

            i = m.index + m[0].length;
            
            if (before) {
                valueFragment.appendChild(this.dom.createTextNode(before, this.element));
            }
                
            if (tab) {
                var tabSize = self.session.getScreenTabSize(screenColumn + m.index);
                valueFragment.appendChild(self.$tabStrings[tabSize].cloneNode(true));
                screenColumn += tabSize - 1;
            } else if (simpleSpace) {
                if (self.showInvisibles) {
                    var span = this.dom.createElement("span");
                    span.className = "ace_invisible ace_invisible_space";
                    span.textContent = lang.stringRepeat(self.SPACE_CHAR, simpleSpace.length);
                    valueFragment.appendChild(span);
                } else {
                    valueFragment.appendChild(this.com.createTextNode(simpleSpace, this.element));
                }
            } else if (controlCharacter) {
                var span = this.dom.createElement("span");
                span.className = "ace_invisible ace_invisible_space ace_invalid";
                span.textContent = lang.stringRepeat(self.SPACE_CHAR, controlCharacter.length);
                valueFragment.appendChild(span);
            } else if (cjkSpace) {
                // U+3000 is both invisible AND full-width, so must be handled uniquely
                var space = self.showInvisibles ? self.SPACE_CHAR : "";
                screenColumn += 1;
                
                var span = this.dom.createElement("span");
                span.style.width = (self.config.characterWidth * 2) + "px";
                span.className = self.showInvisibles ? "ace_cjk ace_invisible ace_invisible_space" : "ace_cjk";
                span.textContent = self.showInvisibles ? self.SPACE_CHAR : "";
                valueFragment.appendChild(span);
            } else if (cjk) {
                screenColumn += 1;
                var span = dom.createElement("span");
                span.style.width = (self.config.characterWidth * 2) + "px";
                span.className = "ace_cjk";
                span.textContent = cjk;
                valueFragment.appendChild(span);
            }
        }
        
        valueFragment.appendChild(this.dom.createTextNode(i ? value.slice(i) : value, this.element));

        if (!this.$textToken[token.type]) {
            var classes = "ace_" + token.type.replace(/\./g, " ace_");
            var span = this.dom.createElement("span");
            if (token.type == "fold")
                span.style.width = (token.value.length * this.config.characterWidth) + "px";
                
            span.className = classes;
            span.appendChild(valueFragment);
            
            parent.appendChild(span);
        }
        else {
            parent.appendChild(valueFragment);
        }
        
        return screenColumn + value.length;
    };

    this.renderIndentGuide = function(parent, value, max) {
        var cols = value.search(this.$indentGuideRe);
        if (cols <= 0 || cols >= max)
            return value;
        if (value[0] == " ") {
            cols -= cols % this.tabSize;
            var count = cols/this.tabSize;
            for (var i=0; i<count; i++) {
                parent.appendChild(this.$tabStrings[" "].cloneNode(true));
            }
            return value.substr(cols);
        } else if (value[0] == "\t") {
            for (var i=0; i<cols; i++) {
                parent.appendChild(this.$tabStrings["\t"].cloneNode(true));
            }
            return value.substr(cols);
        }
        return value;
    };

    this.$createLineElement = function(parent) {
        var lineEl = this.dom.createElement("div");
        lineEl.className = "ace_line";
        lineEl.style.height = this.config.lineHeight + "px";
        
        return lineEl;
    };

    this.$renderWrappedLine = function(parent, tokens, splits) {
        var chars = 0;
        var split = 0;
        var splitChars = splits[0];
        var screenColumn = 0;

        var lineEl = this.$createLineElement();
        parent.appendChild(lineEl);
        
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            var value = token.value;
            if (i == 0 && this.displayIndentGuides) {
                chars = value.length;
                value = this.renderIndentGuide(lineEl, value, splitChars);
                if (!value)
                    continue;
                chars -= value.length;
            }

            if (chars + value.length < splitChars) {
                screenColumn = this.$renderToken(lineEl, screenColumn, token, value);
                chars += value.length;
            } else {
                while (chars + value.length >= splitChars) {
                    screenColumn = this.$renderToken(
                        lineEl, screenColumn,
                        token, value.substring(0, splitChars - chars)
                    );
                    value = value.substring(splitChars - chars);
                    chars = splitChars;

                    lineEl = this.$createLineElement();
                    parent.appendChild(lineEl);

                    lineEl.appendChild(this.dom.createTextNode(lang.stringRepeat("\xa0", splits.indent), this.element));

                    split ++;
                    screenColumn = 0;
                    splitChars = splits[split] || Number.MAX_VALUE;
                }
                if (value.length != 0) {
                    chars += value.length;
                    screenColumn = this.$renderToken(
                        lineEl, screenColumn, token, value
                    );
                }
            }
        }
    };

    this.$renderSimpleLine = function(parent, tokens) {
        var screenColumn = 0;
        var token = tokens[0];
        var value = token.value;
        if (this.displayIndentGuides)
            value = this.renderIndentGuide(parent, value);
        if (value)
            screenColumn = this.$renderToken(parent, screenColumn, token, value);
        for (var i = 1; i < tokens.length; i++) {
            token = tokens[i];
            value = token.value;
            if (screenColumn + value.length > this.MAX_LINE_LENGTH)
                return this.$renderOverflowMessage(parent, screenColumn, token, value);
            screenColumn = this.$renderToken(parent, screenColumn, token, value);
        }
    };
    
    this.$renderOverflowMessage = function(parent, screenColumn, token, value) {
        this.$renderToken(parent, screenColumn, token,
            value.slice(0, this.MAX_LINE_LENGTH - screenColumn));
            
        var overflowEl = this.dom.createElement("span");
        overflowEl.className = "ace_inline_button ace_keyword ace_toggle_wrap";
        overflowEl.style.position = "absolute";
        overflowEl.style.right = "0";
        overflowEl.textContent = "<click to see more...>";
        
        parent.appendChild(overflowEl);        
    };

    // row is either first row of foldline or not in fold
    this.$renderLine = function(parent, row, foldLine) {
        if (!foldLine && foldLine != false)
            foldLine = this.session.getFoldLine(row);

        if (foldLine)
            var tokens = this.$getFoldLineTokens(row, foldLine);
        else
            var tokens = this.session.getTokens(row);

        var lastLineEl = parent;
        if (tokens.length) {
            var splits = this.session.getRowSplitData(row);
            if (splits && splits.length) {
                this.$renderWrappedLine(parent, tokens, splits);
                var lastLineEl = parent.lastChild;
            } else {
                var lastLineEl = parent;
                if (this.$useLineGroups()) {
                    lastLineEl = this.$createLineElement();
                    parent.appendChild(lastLineEl);
                }
                this.$renderSimpleLine(lastLineEl, tokens);
            }
        } else if (this.$useLineGroups()) {
            lastLineEl = this.$createLineElement();
            parent.appendChild(lastLineEl);
        }

        if (this.showInvisibles && lastLineEl) {
            if (foldLine)
                row = foldLine.end.row;

            var invisibleEl = this.dom.createElement("span");
            invisibleEl.className = "ace_invisible ace_invisible_eol";
            invisibleEl.textContent = row == this.session.getLength() - 1 ? this.EOF_CHAR : this.EOL_CHAR;
            
            lastLineEl.appendChild(invisibleEl);
        }
    };

    this.$getFoldLineTokens = function(row, foldLine) {
        var session = this.session;
        var renderTokens = [];

        function addTokens(tokens, from, to) {
            var idx = 0, col = 0;
            while ((col + tokens[idx].value.length) < from) {
                col += tokens[idx].value.length;
                idx++;

                if (idx == tokens.length)
                    return;
            }
            if (col != from) {
                var value = tokens[idx].value.substring(from - col);
                // Check if the token value is longer then the from...to spacing.
                if (value.length > (to - from))
                    value = value.substring(0, to - from);

                renderTokens.push({
                    type: tokens[idx].type,
                    value: value
                });

                col = from + value.length;
                idx += 1;
            }

            while (col < to && idx < tokens.length) {
                var value = tokens[idx].value;
                if (value.length + col > to) {
                    renderTokens.push({
                        type: tokens[idx].type,
                        value: value.substring(0, to - col)
                    });
                } else
                    renderTokens.push(tokens[idx]);
                col += value.length;
                idx += 1;
            }
        }

        var tokens = session.getTokens(row);
        foldLine.walk(function(placeholder, row, column, lastColumn, isNewRow) {
            if (placeholder != null) {
                renderTokens.push({
                    type: "fold",
                    value: placeholder
                });
            } else {
                if (isNewRow)
                    tokens = session.getTokens(row);

                if (tokens.length)
                    addTokens(tokens, lastColumn, column);
            }
        }, foldLine.end.row, this.session.getLine(foldLine.end.row).length);

        return renderTokens;
    };

    this.$useLineGroups = function() {
        // For the updateLines function to work correctly, it's important that the
        // child nodes of this.element correspond on a 1-to-1 basis to rows in the
        // document (as distinct from lines on the screen). For sessions that are
        // wrapped, this means we need to add a layer to the node hierarchy (tagged
        // with the class name ace_line_group).
        return this.session.getUseWrapMode();
    };

    this.destroy = function() {
        clearInterval(this.$pollSizeChangesTimer);
        if (this.$measureNode)
            this.$measureNode.parentNode.removeChild(this.$measureNode);
        delete this.$measureNode;
    };

}).call(Text.prototype);

exports.Text = Text;

});
