"use strict";
/**
 * @typedef {import("../../ace-internal").Ace.LayerConfig} LayerConfig
 * @typedef {import("../edit_session").EditSession} EditSession
 */
var oop = require("../lib/oop");
var dom = require("../lib/dom");
var lang = require("../lib/lang");
var Lines = require("./lines").Lines;
var EventEmitter = require("../lib/event_emitter").EventEmitter;
var nls = require("../config").nls;
const isTextToken = require("./text_util").isTextToken;

class Text {
    /**
     * @param {HTMLElement} parentEl
     */
    constructor(parentEl) {
        this.dom = dom;
        this.element = this.dom.createElement("div");
        this.element.className = "ace_layer ace_text-layer";
        parentEl.appendChild(this.element);
        this.$updateEolChar = this.$updateEolChar.bind(this);
        this.$lines = new Lines(this.element);
    }
    
    $updateEolChar() {
        var doc = this.session.doc;
        var unixMode = doc.getNewLineCharacter() == "\n" && doc.getNewLineMode() != "windows";
        var EOL_CHAR = unixMode ? this.EOL_CHAR_LF : this.EOL_CHAR_CRLF;
        if (this.EOL_CHAR != EOL_CHAR) {
            this.EOL_CHAR = EOL_CHAR;
            return true;
        }
    }

    /**
     * @param {number} padding
     */
    setPadding(padding) {
        this.$padding = padding;
        this.element.style.margin = "0 " + padding + "px";
    }
    
    /**
     * @returns {number}
     */
    getLineHeight() {
        return this.$fontMetrics.$characterSize.height || 0;
    }

    /**
     * @returns {number}
     */
    getCharacterWidth() {
        return this.$fontMetrics.$characterSize.width || 0;
    }

    /**
     * @param {any} measure
     */
    $setFontMetrics(measure) {
        this.$fontMetrics = measure;
        this.$fontMetrics.on("changeCharacterSize",
            /**
             * @this {Text}
             */
            function (e) {
                this._signal("changeCharacterSize", e);
        }.bind(this));
        this.$pollSizeChanges();
    }

    checkForSizeChanges() {
        this.$fontMetrics.checkForSizeChanges();
    }
    $pollSizeChanges() {
        return this.$pollSizeChangesTimer = this.$fontMetrics.$pollSizeChanges();
    }

    /**
     * @param {EditSession} session
     */
    setSession(session) {
        /**@type {EditSession}*/
        this.session = session;
        if (session)
            this.$computeTabString();
    }

    /**
     * @param {string} showInvisibles
     */
    setShowInvisibles(showInvisibles) {
        if (this.showInvisibles == showInvisibles)
            return false;

        this.showInvisibles = showInvisibles;
        if (typeof showInvisibles == "string") {
            this.showSpaces = /tab/i.test(showInvisibles);
            this.showTabs = /space/i.test(showInvisibles);
            this.showEOL = /eol/i.test(showInvisibles);
        } else {
            this.showSpaces = this.showTabs = this.showEOL = showInvisibles;
        }
        this.$computeTabString();
        return true;
    }

    /**
     * @param {boolean} display
     */
    setDisplayIndentGuides(display) {
        if (this.displayIndentGuides == display)
            return false;

        this.displayIndentGuides = display;
        this.$computeTabString();
        return true;
    }

    /**
     * @param {boolean} highlight
     */
    setHighlightIndentGuides(highlight) {
        if (this.$highlightIndentGuides === highlight) return false;

        this.$highlightIndentGuides = highlight;
        return highlight;
    }
    
    $computeTabString() {
        var tabSize = this.session.getTabSize();
        this.tabSize = tabSize;
        /**@type{any}*/var tabStr = this.$tabStrings = [0];
        for (var i = 1; i < tabSize + 1; i++) {
            if (this.showTabs) {
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
            var spaceClass = this.showSpaces ? " ace_invisible ace_invisible_space" : "";
            var spaceContent = this.showSpaces
                ? lang.stringRepeat(this.SPACE_CHAR, this.tabSize)
                : lang.stringRepeat(" ", this.tabSize);

            var tabClass = this.showTabs ? " ace_invisible ace_invisible_tab" : "";
            var tabContent = this.showTabs
                ? lang.stringRepeat(this.TAB_CHAR, this.tabSize)
                : spaceContent;

            var span = this.dom.createElement("span");
            span.className = className + spaceClass;
            span.textContent = spaceContent;
            this.$tabStrings[" "] = span;

            var span = this.dom.createElement("span");
            span.className = className + tabClass;
            span.textContent = tabContent;
            this.$tabStrings["\t"] = span;
        }
    }

    /**
     * @param {LayerConfig} config
     * @param {number} firstRow
     * @param {number} lastRow
     */
    updateLines(config, firstRow, lastRow) {
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

            /**@type{any}*/var lineElement = lineElements[lineElementsIdx++];
            if (lineElement) {
                this.dom.removeChildren(lineElement);
                this.$renderLine(
                    lineElement, row, row == foldStart ? foldLine : false
                );

                if (heightChanged)
                    lineElement.style.top = this.$lines.computeLineTop(row, config, this.session) + "px";

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
    }

    /**
     * @param {LayerConfig} config
     */
    scrollLines(config) {
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
        this.$highlightIndentGuide();
    }

    /**
     * @param {LayerConfig} config
     * @param {number} firstRow
     * @param {number} lastRow
     */
    $renderLinesFragment(config, firstRow, lastRow) {
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
    }

    /**
     * @param {LayerConfig} config
     */
    update(config) {
        this.$lines.moveContainer(config);

        this.config = config;

        var firstRow = config.firstRow;
        var lastRow = config.lastRow;

        var lines = this.$lines;
        while (lines.getLength())
            lines.pop();

        lines.push(this.$renderLinesFragment(config, firstRow, lastRow));
    }

    $renderToken(parent, screenColumn, token, value) {
        var self = this;
        var re = /(\t)|( +)|([\x00-\x1f\x80-\xa0\xad\u1680\u180E\u2000-\u200f\u2028\u2029\u202F\u205F\uFEFF\uFFF9-\uFFFC\u2066\u2067\u2068\u202A\u202B\u202D\u202E\u202C\u2069]+)|(\u3000)|([\u1100-\u115F\u11A3-\u11A7\u11FA-\u11FF\u2329-\u232A\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3001-\u303E\u3041-\u3096\u3099-\u30FF\u3105-\u312D\u3131-\u318E\u3190-\u31BA\u31C0-\u31E3\u31F0-\u321E\u3220-\u3247\u3250-\u32FE\u3300-\u4DBF\u4E00-\uA48C\uA490-\uA4C6\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFAFF\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFF01-\uFF60\uFFE0-\uFFE6]|[\uD800-\uDBFF][\uDC00-\uDFFF])/g;

        var valueFragment = this.dom.createFragment(this.element);

        var m;
        var i = 0;
        while (m = re.exec(value)) {
            var tab = m[1];
            var simpleSpace = m[2];
            var controlCharacter = m[3];
            var cjkSpace = m[4];
            var cjk = m[5];

            if (!self.showSpaces && simpleSpace)
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
                if (self.showSpaces) {
                    var span = this.dom.createElement("span");
                    span.className = "ace_invisible ace_invisible_space";
                    span.textContent = lang.stringRepeat(self.SPACE_CHAR, simpleSpace.length);
                    valueFragment.appendChild(span);
                } else {
                    valueFragment.appendChild(this.dom.createTextNode(simpleSpace, this.element));
                }
            } else if (controlCharacter) {
                var span = this.dom.createElement("span");
                span.className = "ace_invisible ace_invisible_space ace_invalid";
                span.textContent = lang.stringRepeat(self.SPACE_CHAR, controlCharacter.length);
                valueFragment.appendChild(span);
            } else if (cjkSpace) {
                // U+3000 is both invisible AND full-width, so must be handled uniquely
                screenColumn += 1;

                var span = this.dom.createElement("span");
                span.style.width = (self.config.characterWidth * 2) + "px";
                span.className = self.showSpaces ? "ace_cjk ace_invisible ace_invisible_space" : "ace_cjk";
                span.textContent = self.showSpaces ? self.SPACE_CHAR : cjkSpace;
                valueFragment.appendChild(span);
            } else if (cjk) {
                screenColumn += 1;
                var span = this.dom.createElement("span");
                span.style.width = (self.config.characterWidth * 2) + "px";
                span.className = "ace_cjk";
                span.textContent = cjk;
                valueFragment.appendChild(span);
            }
        }

        valueFragment.appendChild(this.dom.createTextNode(i ? value.slice(i) : value, this.element));

        if (!isTextToken(token.type)) {
            var classes = "ace_" + token.type.replace(/\./g, " ace_");
            var span = this.dom.createElement("span");
            if (token.type == "fold"){
                span.style.width = (token.value.length * this.config.characterWidth) + "px";
                span.setAttribute("title", nls("inline-fold.closed.title", "Unfold code"));
            }

            span.className = classes;
            span.appendChild(valueFragment);

            parent.appendChild(span);
        }
        else {
            parent.appendChild(valueFragment);
        }

        return screenColumn + value.length;
    }

    renderIndentGuide(parent, value, max) {
        var cols = value.search(this.$indentGuideRe);
        if (cols <= 0 || cols >= max)
            return value;
        if (value[0] == " ") {
            cols -= cols % this.tabSize;
            var count = cols/this.tabSize;
            for (var i=0; i<count; i++) {
                parent.appendChild(this.$tabStrings[" "].cloneNode(true));
            }
            this.$highlightIndentGuide();
            return value.substr(cols);
        } else if (value[0] == "\t") {
            for (var i=0; i<cols; i++) {
                parent.appendChild(this.$tabStrings["\t"].cloneNode(true));
            }
            this.$highlightIndentGuide();
            return value.substr(cols);
        }
        this.$highlightIndentGuide();
        return value;
    }

    $highlightIndentGuide() {
        if (!this.$highlightIndentGuides || !this.displayIndentGuides) return;
        /**@type {{ indentLevel?: number; start?: number; end?: number; dir?: number; }}*/
        this.$highlightIndentGuideMarker = {
            indentLevel: undefined,
            start: undefined,
            end: undefined,
            dir: undefined
        };
        var lines = this.session.doc.$lines;
        if (!lines) return;

        var cursor = this.session.selection.getCursor();
        var initialIndent = /^\s*/.exec(this.session.doc.getLine(cursor.row))[0].length;
        var elementIndentLevel = Math.floor(initialIndent / this.tabSize);
        this.$highlightIndentGuideMarker = {
            indentLevel: elementIndentLevel,
            start: cursor.row
        };

        var bracketHighlight = this.session.$bracketHighlight;
        if (bracketHighlight) {
            var ranges = this.session.$bracketHighlight.ranges;
            for (var i = 0; i < ranges.length; i++) {
                if (cursor.row !== ranges[i].start.row) {
                    this.$highlightIndentGuideMarker.end = ranges[i].start.row;
                    if (cursor.row > ranges[i].start.row) {
                        this.$highlightIndentGuideMarker.dir = -1;
                    }
                    else {
                        this.$highlightIndentGuideMarker.dir = 1;
                    }
                    break;
                }
            }
        }

        if (!this.$highlightIndentGuideMarker.end) {
            if (lines[cursor.row] !== '' && cursor.column === lines[cursor.row].length) {
                this.$highlightIndentGuideMarker.dir = 1;
                for (var i = cursor.row + 1; i < lines.length; i++) {
                    var line = lines[i];
                    var currentIndent = /^\s*/.exec(line)[0].length;
                    if (line !== '') {
                        this.$highlightIndentGuideMarker.end = i;
                        if (currentIndent <= initialIndent) break;
                    }
                }
            }
        }

        this.$renderHighlightIndentGuide();
    }

    $clearActiveIndentGuide() {
        var cells = this.$lines.cells;
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            var childNodes = cell.element.childNodes;
            if (childNodes.length > 0) {
                for (var j = 0; j < childNodes.length; j++) {
                    if (childNodes[j].classList && childNodes[j].classList.contains("ace_indent-guide-active")) {
                        childNodes[j].classList.remove("ace_indent-guide-active");
                        break;
                    }
                }
            }
        }
    }

    $setIndentGuideActive(cell, indentLevel) {
        var line = this.session.doc.getLine(cell.row);
        if (line !== "") {
            var childNodes = cell.element.childNodes;
            if (childNodes) {
                let node = childNodes[indentLevel - 1];
                if (node && node.classList && node.classList.contains("ace_indent-guide")) node.classList.add(
                    "ace_indent-guide-active");
            }
        }
    }

    $renderHighlightIndentGuide() {
        if (!this.$lines) return;
        var cells = this.$lines.cells;
        this.$clearActiveIndentGuide();
        var indentLevel = this.$highlightIndentGuideMarker.indentLevel;
        if (indentLevel !== 0) {
            if (this.$highlightIndentGuideMarker.dir === 1) {
                for (var i = 0; i < cells.length; i++) {
                    var cell = cells[i];
                    if (this.$highlightIndentGuideMarker.end && cell.row >= this.$highlightIndentGuideMarker.start
                        + 1) {
                        if (cell.row >= this.$highlightIndentGuideMarker.end) break;
                        this.$setIndentGuideActive(cell, indentLevel);
                    }
                }
            }
            else {
                for (var i = cells.length - 1; i >= 0; i--) {
                    var cell = cells[i];
                    if (this.$highlightIndentGuideMarker.end && cell.row < this.$highlightIndentGuideMarker.start) {
                        if (cell.row <= this.$highlightIndentGuideMarker.end) break;
                        this.$setIndentGuideActive(cell, indentLevel);
                    }
                }
            }
        }
    }

    $createLineElement(parent) {
        var lineEl = this.dom.createElement("div");
        lineEl.className = "ace_line";
        lineEl.style.height = this.config.lineHeight + "px";

        return lineEl;
    }

    $renderWrappedLine(parent, tokens, splits) {
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

        if (splits[splits.length - 1] > this.MAX_LINE_LENGTH)
            this.$renderOverflowMessage(lineEl, screenColumn, null, "", true);
    }

    $renderSimpleLine(parent, tokens) {
        var screenColumn = 0;

        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            var value = token.value;
            if (i == 0 && this.displayIndentGuides) {
                value = this.renderIndentGuide(parent, value);
                if (!value)
                    continue;
            }
            if (screenColumn + value.length > this.MAX_LINE_LENGTH)
                return this.$renderOverflowMessage(parent, screenColumn, token, value);
            screenColumn = this.$renderToken(parent, screenColumn, token, value);
        }
    }

    $renderOverflowMessage(parent, screenColumn, token, value, hide) {
        token && this.$renderToken(parent, screenColumn, token,
            value.slice(0, this.MAX_LINE_LENGTH - screenColumn));

        var overflowEl = this.dom.createElement("span");
        overflowEl.className = "ace_inline_button ace_keyword ace_toggle_wrap";
        overflowEl.textContent = hide ? "<hide>" : "<click to see more...>";

        parent.appendChild(overflowEl);
    }

    // row is either first row of foldline or not in fold
    $renderLine(parent, row, foldLine) {
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

        if (this.showEOL && lastLineEl) {
            if (foldLine)
                row = foldLine.end.row;

            var invisibleEl = this.dom.createElement("span");
            invisibleEl.className = "ace_invisible ace_invisible_eol";
            invisibleEl.textContent = row == this.session.getLength() - 1 ? this.EOF_CHAR : this.EOL_CHAR;

            lastLineEl.appendChild(invisibleEl);
        }
    }

    /**
     * @param {number} row
     * @param {import("../../ace-internal").Ace.FoldLine} foldLine
     * @return {import("../../ace-internal").Ace.Token[]}
     */
    $getFoldLineTokens(row, foldLine) {
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
    }

    $useLineGroups() {
        // For the updateLines function to work correctly, it's important that the
        // child nodes of this.element correspond on a 1-to-1 basis to rows in the
        // document (as distinct from lines on the screen). For sessions that are
        // wrapped, this means we need to add a layer to the node hierarchy (tagged
        // with the class name ace_line_group).
        return this.session.getUseWrapMode();
    }
}

Text.prototype.EOF_CHAR = "\xB6";
Text.prototype.EOL_CHAR_LF = "\xAC";
Text.prototype.EOL_CHAR_CRLF = "\xa4";
Text.prototype.EOL_CHAR = Text.prototype.EOL_CHAR_LF;
Text.prototype.TAB_CHAR = "\u2014"; //"\u21E5";
Text.prototype.SPACE_CHAR = "\xB7";
Text.prototype.$padding = 0;
Text.prototype.MAX_LINE_LENGTH = 10000;
Text.prototype.showInvisibles = false;
Text.prototype.showSpaces = false;
Text.prototype.showTabs = false;
Text.prototype.showEOL = false;
Text.prototype.displayIndentGuides = true;
Text.prototype.$highlightIndentGuides = true;
Text.prototype.$tabStrings = [];
Text.prototype.destroy = {};
Text.prototype.onChangeTabSize = Text.prototype.$computeTabString;

oop.implement(Text.prototype, EventEmitter);

exports.Text = Text;
