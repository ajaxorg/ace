"use strict";

var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var dom = require("../../lib/dom");
var config = require("../../config");

// @ts-ignore
var css = require("./styles-css.js").cssText;

var Editor = require("../../editor").Editor;
var Renderer = require("../../virtual_renderer").VirtualRenderer;
var UndoManager = require("../../undomanager").UndoManager;
require("../../theme/textmate");
// enable multiselect
require("../../multi_select");

var {EditSession} = require("../../edit_session");

var MinimalGutterDiffDecorator = require("./gutter_decorator").MinimalGutterDiffDecorator;

class BaseDiffView {
    /**
     * Constructs a new base DiffView instance.
     * @param {boolean} [inlineDiffEditor] - Whether to use an inline diff editor.
     * @param {HTMLElement} [container] - optional container element for the DiffView.
     */
    constructor(inlineDiffEditor, container) {
        this.onChangeTheme = this.onChangeTheme.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onChangeFold = this.onChangeFold.bind(this);
        this.realign = this.realign.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.realignPending = false;

        /**@type{{sessionA: EditSession, sessionB: EditSession, chunks: DiffChunk[]}}*/this.diffSession;
        /**@type DiffChunk[]*/this.chunks;
        this.inlineDiffEditor = inlineDiffEditor || false;
        this.currentDiffIndex = 0;
        this.diffProvider = {
            compute: function(val1, val2, options) {
                return [];
            }
        };

        if (container) {
            this.container = container;
        }

        dom.importCssString(css, "diffview.css");
        this.options = {
            ignoreTrimWhitespace: true,
            maxComputationTimeMs: 0, // time in milliseconds, 0 => no computation limit.
            syncSelections: false //experimental option
        };
        oop.mixin(this.options, {
            maxDiffs: 5000
        });

        this.markerB = new DiffHighlight(this, 1);
        this.markerA = new DiffHighlight(this, -1);
    }

    /**
     * @param {Object} options - The configuration options for the DiffView.
     * @param {boolean} [options.ignoreTrimWhitespace=true] - Whether to ignore whitespace changes when computing diffs.
     * @param {boolean} [options.foldUnchanged=false] - Whether to fold unchanged regions in the diff view.
     * @param {number} [options.maxComputationTimeMs=0] - The maximum time in milliseconds to spend computing diffs (0 means no limit).
     * @param {boolean} [options.syncSelections=false] - Whether to synchronize selections between the original and edited views.
     */
    setOptions(options) {
        this.options = {
            ignoreTrimWhitespace: options.ignoreTrimWhitespace || true,
            foldUnchanged: options.foldUnchanged || false,
            maxComputationTimeMs: options.maxComputationTimeMs || 0, // time in milliseconds, 0 => no computation limit.
            syncSelections: options.syncSelections || false //experimental option
        };
        oop.mixin(this.options, {
            maxDiffs: 5000
        });
        config.resetOptions(this);
    }

    /**
     * @param {Object} [diffModel] - The model for the diff view.
     * @param {Editor} [diffModel.editorA] - The editor for the original view.
     * @param {Editor} [diffModel.editorB] - The editor for the edited view.
     * @param {EditSession} [diffModel.sessionA] - The edit session for the original view.
     * @param {EditSession} [diffModel.sessionB] - The edit session for the edited view.
     * @param {string} [diffModel.valueA] - The original content.
     * @param {string} [diffModel.valueB] - The modified content.
     * @param {boolean} [diffModel.showSideA] - Whether to show the original view or modified view.
     */
    $setupModels(diffModel) {
        this.showSideA = diffModel.showSideA == undefined ? true : diffModel.showSideA;
        var diffEditorOptions = /**@type {Partial<import("../../../ace-internal").Ace.EditorOptions>}*/({
            scrollPastEnd: 0.5,
            highlightActiveLine: false,
            highlightGutterLine: false,
            animatedScroll: true,
            customScrollbar: true,
            vScrollBarAlwaysVisible: true,
            fadeFoldWidgets: true,
            selectionStyle: "text",
        });

        this.savedOptionsA = diffModel.editorA && diffModel.editorA.getOptions(diffEditorOptions);
        this.savedOptionsB = diffModel.editorB && diffModel.editorB.getOptions(diffEditorOptions);

        if (!this.inlineDiffEditor || diffModel.showSideA) {
            this.editorA = diffModel.editorA || this.$setupModel(diffModel.sessionA, diffModel.valueA);
            this.container && this.container.appendChild(this.editorA.container);
            this.editorA.setOptions(diffEditorOptions);
        }
        if (!this.inlineDiffEditor || !diffModel.showSideA) {
            this.editorB = diffModel.editorB || this.$setupModel(diffModel.sessionB, diffModel.valueB);
            this.container && this.container.appendChild(this.editorB.container);
            this.editorB.setOptions(diffEditorOptions);
        }
        
        if (this.inlineDiffEditor) {
            this.activeEditor = diffModel.showSideA ? this.editorA : this.editorB;
            this.otherSession = diffModel.showSideA ? this.sessionB : this.sessionA;
            var cloneOptions = this.activeEditor.getOptions();
            cloneOptions.readOnly = true;
            delete cloneOptions.mode;
            this.otherEditor = new Editor(new Renderer(null), undefined, cloneOptions);
            if (diffModel.showSideA) {
                this.editorB = this.otherEditor;
            } else {
                this.editorA = this.otherEditor;
            }
        }

        this.setDiffSession({
            sessionA: diffModel.sessionA || (diffModel.editorA ? diffModel.editorA.session : new EditSession(
                diffModel.valueA || "")),
            sessionB: diffModel.sessionB || (diffModel.editorB ? diffModel.editorB.session : new EditSession(
                diffModel.valueB || "")),
            chunks: []
        });
    }

    addGutterDecorators() { 
        if (!this.gutterDecoratorA)
            this.gutterDecoratorA = new MinimalGutterDiffDecorator(this.editorA, -1);
        if (!this.gutterDecoratorB)
            this.gutterDecoratorB = new MinimalGutterDiffDecorator(this.editorB, 1);
    }

    /**
     * @param {EditSession} [session]
     * @param {string} [value]
     */
    $setupModel(session, value) {
        var editor = new Editor(new Renderer(), session);
        editor.session.setUndoManager(new UndoManager());
        // editor.renderer.setOption("decoratorType", "diff");
        if (value) {
            editor.setValue(value, -1);
        }
        return editor;
    }

    foldUnchanged() {
        this.sessionA.unfold();
        this.sessionB.unfold();

        var chunks = this.chunks;
        var placeholder = "-".repeat(120);
        var prev = {
            old: new Range(0, 0, 0, 0),
            new: new Range(0, 0, 0, 0)
        };
        for (var i = 0; i < chunks.length + 1; i++) {
            let current = chunks[i] || {
                old: new Range(this.sessionA.getLength(), 0, this.sessionA.getLength(), 0),
                new: new Range(this.sessionB.getLength(), 0, this.sessionB.getLength(), 0)
            };
            var l = current.new.start.row - prev.new.end.row - 5;
            if (l > 2) {
                var s = prev.old.end.row + 2;
                var fold1 = this.sessionA.addFold(placeholder, new Range(s, 0, s + l, Number.MAX_VALUE));
                s = prev.new.end.row + 2;
                var fold2 = this.sessionB.addFold(placeholder, new Range(s, 0, s + l, Number.MAX_VALUE));
                if (fold2 && fold1) {
                    fold1["other"] = fold2;
                    fold2["other"] = fold1;
                }
            }

            prev = current;
        }

    }

    /**
     * @param {{ sessionA: any; sessionB: EditSession; chunks: DiffChunk[] }} session
     */
    setDiffSession(session) {
        if (this.diffSession) {
            this.$detachSessionsEventHandlers();
            this.clearSelectionMarkers();
        }
        this.diffSession = session;
        this.sessionA = this.sessionB = null;
        if (this.diffSession) {
            this.chunks = this.diffSession.chunks;
            this.editorA && this.editorA.setSession(session.sessionA);
            this.editorB && this.editorB.setSession(session.sessionB);
            this.sessionA = this.diffSession.sessionA;
            this.sessionB = this.diffSession.sessionB;
            this.$attachSessionsEventHandlers();
            this.initSelectionMarkers();
        }

        this.otherSession = this.showSideA ? this.sessionB : this.sessionA;
    }

    /**
     * @abstract
     */
    $attachSessionsEventHandlers() {
    }

    /**
     * @abstract
     */
    $detachSessionsEventHandlers() {
    }

    getDiffSession() {
        return this.diffSession;
    }

    setTheme(theme) {
        this.editorA && this.editorA.setTheme(theme);
        this.editorB && this.editorB.setTheme(theme);
    }

    getTheme() {
        return (this.editorA || this.editorB).getTheme();
    }

    onChangeTheme() {
        this.editorA && this.editorA.setTheme(this.getTheme());
        this.editorB && this.editorB.setTheme(this.getTheme());
    }

    resize(force) {
        this.editorA && this.editorA.resize(force);
        this.editorB && this.editorB.resize(force);
    }

    onInput() {
        var val1 = this.sessionA.doc.getAllLines();
        var val2 = this.sessionB.doc.getAllLines();

        this.selectionRangeA = null;
        this.selectionRangeB = null;

        var chunks = this.$diffLines(val1, val2);

        this.diffSession.chunks = this.chunks = chunks;
        this.gutterDecoratorA && this.gutterDecoratorA.setDecorations(chunks);
        this.gutterDecoratorB && this.gutterDecoratorB.setDecorations(chunks);
        // if we"re dealing with too many chunks, fail silently
        if (this.chunks && this.chunks.length > this.options.maxDiffs) {
            return;
        }

        this.align();

        this.editorA && this.editorA.renderer.updateBackMarkers();
        this.editorB && this.editorB.renderer.updateBackMarkers();

        //this.updateScrollBarDecorators();

        if (this.options.foldUnchanged) {
            this.foldUnchanged();
        }
    }

    /**
     *
     * @param {string[]} val1
     * @param {string[]} val2
     * @return {DiffChunk[]}
     */
    $diffLines(val1, val2) {
        return this.diffProvider.compute(val1, val2, {
            ignoreTrimWhitespace: this.options.ignoreTrimWhitespace,
            maxComputationTimeMs: this.options.maxComputationTimeMs
        });
    }

    /**
     * @param {import("./providers/default").DiffProvider} provider
     */
    setProvider(provider) {
        this.diffProvider = provider;
    }

    /** scroll locking
     * @abstract
     **/
    align() {
    }
    onSelect(e, selection) {
        this.searchHighlight(selection);
        this.syncSelect(selection);
    }

    syncSelect(selection) {
        if (this.$updatingSelection) return;
        var isOld = selection.session === this.sessionA;
        var selectionRange = selection.getRange();

        var currSelectionRange = isOld ? this.selectionRangeA : this.selectionRangeB;
        if (currSelectionRange && selectionRange.isEqual(currSelectionRange))
            return;

        if (isOld) {
            this.selectionRangeA = selectionRange;
        } else {
            this.selectionRangeB = selectionRange;
        }

        this.$updatingSelection = true;
        var newRange = this.transformRange(selectionRange, isOld);

        if (this.options.syncSelections) {
            (isOld ? this.editorB : this.editorA).session.selection.setSelectionRange(newRange);
        }
        this.$updatingSelection = false;

        if (isOld) {
            this.selectionRangeA = selectionRange;
            this.selectionRangeB = newRange;
        } else {
            this.selectionRangeA = newRange;
            this.selectionRangeB = selectionRange;
        }

        this.updateSelectionMarker(this.syncSelectionMarkerA, this.sessionA, this.selectionRangeA);
        this.updateSelectionMarker(this.syncSelectionMarkerB, this.sessionB, this.selectionRangeB);
    }

    updateSelectionMarker(marker, session, range) {
        marker.setRange(range);
        session._signal("changeFrontMarker");
    }

    /**
     * @param ev
     * @param {EditSession} session
     */
    onChangeFold(ev, session) {
        var fold = ev.data;
        if (this.$syncingFold || !fold || !ev.action) return;
        if (!this.realignPending) {
            this.realignPending = true;
            this.editorA.renderer.on("beforeRender", this.realign);
            this.editorB.renderer.on("beforeRender", this.realign);
        }

        const isOrig = session === this.sessionA;
        const other = isOrig ? this.sessionB : this.sessionA;

        if (ev.action === "remove") {
            if (fold.other) {
                fold.other.other = null;
                other.removeFold(fold.other);
            }
            else if (fold.lineWidget) {
                other.widgetManager.addLineWidget(fold.lineWidget);
                fold.lineWidget = null;
                if (other["$editor"]) {
                    other["$editor"].renderer.updateBackMarkers();
                }
            }
        }

        if (ev.action === "add") {
            const range = this.transformRange(fold.range, isOrig);
            if (range.isEmpty()) {
                const row = range.start.row + 1;
                if (other.lineWidgets[row]) {
                    fold.lineWidget = other.lineWidgets[row];
                    other.widgetManager.removeLineWidget(fold.lineWidget);
                    if (other["$editor"]) {
                        other["$editor"].renderer.updateBackMarkers();
                    }
                }
            }
            else {
                this.$syncingFold = true;

                fold.other = other.addFold(fold.placeholder, range);
                if (fold.other) {
                    fold.other.other = fold;
                }
                this.$syncingFold = false;
            }
        }
    }

    realign() {
        this.realignPending = true;
        this.editorA.renderer.off("beforeRender", this.realign);
        this.editorB.renderer.off("beforeRender", this.realign);
        this.align();
        this.realignPending = false;
    }

    detach() {
        if (!this.editorA || !this.editorB) return;
        this.editorA.setOptions(this.savedOptionsA);
        this.editorB.setOptions(this.savedOptionsB);
        this.editorA.renderer.off("beforeRender", this.realign);
        this.editorB.renderer.off("beforeRender", this.realign);
        this.$detachEventHandlers();
        this.$removeLineWidgets(this.sessionA);
        this.$removeLineWidgets(this.sessionB);
        this.gutterDecoratorA && this.gutterDecoratorA.dispose();
        this.gutterDecoratorB && this.gutterDecoratorB.dispose();
        this.sessionA.selection.clearSelection();
        this.sessionB.selection.clearSelection();
        this.editorA = this.editorB = null;
        
    }

    $removeLineWidgets(session) {
        // TODO remove only our widgets
        // session.widgetManager.removeLineWidget
        session.lineWidgets = [];
        session.widgetManager.lineWidgets = [];
        session._signal("changeFold", {data: {start: {row: 0}}});
    }

    /**
     * @abstract
     */
    $detachEventHandlers() {

    }

    destroy() {
        this.detach();
        this.editorA && this.editorA.destroy();
        this.editorB && this.editorB.destroy();
    }

    gotoNext(dir) {
        var ace = this.activeEditor || this.editorA;
        if (this.inlineDiffEditor) {
            ace = this.editorA;
        }
        var sideA = ace == this.editorA;

        var row = ace.selection.lead.row;
        var i = this.findChunkIndex(this.chunks, row, sideA);
        var chunk = this.chunks[i + dir] || this.chunks[i];

        var scrollTop = ace.session.getScrollTop();
        if (chunk) {
            var range = chunk[sideA ? "old" : "new"];
            var line = Math.max(range.start.row, range.end.row - 1);
            ace.selection.setRange(new Range(line, 0, line, 0));
        }
        ace.renderer.scrollSelectionIntoView(ace.selection.lead, ace.selection.anchor, 0.5);
        ace.renderer.animateScrolling(scrollTop);
    }


    firstDiffSelected() {
        return this.currentDiffIndex <= 1;
    }

    lastDiffSelected() {
        return this.currentDiffIndex > this.chunks.length - 1;
    }

    /**
     * @param {Range} range
     * @param {boolean} isOriginal
     */
    transformRange(range, isOriginal) {
        return Range.fromPoints(this.transformPosition(range.start, isOriginal), this.transformPosition(range.end, isOriginal));
    }

    /**
     * @param {import("ace-code").Ace.Point} pos
     * @param {boolean} isOriginal
     * @return {import("ace-code").Ace.Point}
     */
    transformPosition(pos, isOriginal) {
        var chunkIndex = this.findChunkIndex(this.chunks, pos.row, isOriginal);

        var chunk = this.chunks[chunkIndex];

        var clonePos = this.sessionB.doc.clonePos;
        var result = clonePos(pos);

        var [from, to] = isOriginal ? ["old", "new"] : ["new", "old"];
        var deltaChar = 0;
        var ignoreIndent = false;

        if (chunk) {
            if (chunk[from].end.row <= pos.row) {
                result.row -= chunk[from].end.row - chunk[to].end.row;
            }
            else if (chunk.charChanges) {
                for (let i = 0; i < chunk.charChanges.length; i++) {
                    let change = chunk.charChanges[i];

                    let fromRange = change[from];
                    let toRange = change[to];

                    if (fromRange.end.row < pos.row) continue;

                    if (fromRange.start.row > pos.row) break;

                    if (fromRange.isMultiLine() && fromRange.contains(pos.row, pos.column)) {
                        result.row = toRange.start.row + pos.row - fromRange.start.row;
                        var maxRow = toRange.end.row;
                        if (toRange.end.column === 0) maxRow--;

                        if (result.row > maxRow) {
                            result.row = maxRow;
                            result.column = (isOriginal ? this.sessionB : this.sessionA).getLine(maxRow).length;
                            ignoreIndent = true;
                        }
                        result.row = Math.min(result.row, maxRow);
                    }
                    else {
                        result.row = toRange.start.row;
                        if (fromRange.start.column > pos.column) break;
                        ignoreIndent = true;

                        if (!fromRange.isEmpty() && fromRange.contains(pos.row, pos.column)) {
                            result.column = toRange.start.column;
                            deltaChar = pos.column - fromRange.start.column;
                            deltaChar = Math.min(deltaChar, toRange.end.column - toRange.start.column);
                        }
                        else {
                            result = clonePos(toRange.end);
                            deltaChar = pos.column - fromRange.end.column;
                        }
                    }
                }
            }
            else if (chunk[from].start.row <= pos.row) {
                result.row += chunk[to].start.row - chunk[from].start.row;
                if (result.row >= chunk[to].end.row) {
                    result.row = chunk[to].end.row - 1;
                    result.column = (isOriginal ? this.sessionB : this.sessionA).getLine(result.row).length;
                }
            }
        }


        if (!ignoreIndent) { //TODO:
            var [fromEditSession, toEditSession] = isOriginal ? [this.sessionA, this.sessionB] : [
                this.sessionB, this.sessionA
            ];
            deltaChar -= this.$getDeltaIndent(fromEditSession, toEditSession, pos.row, result.row);
        }

        result.column += deltaChar;
        return result;
    }

    /**
     * @param {EditSession} fromEditSession
     * @param {EditSession} toEditSession
     * @param {number} fromLine
     * @param {number} toLine
     */
    $getDeltaIndent(fromEditSession, toEditSession, fromLine, toLine) {
        let origIndent = this.$getIndent(fromEditSession, fromLine);
        let editIndent = this.$getIndent(toEditSession, toLine);
        return origIndent - editIndent;
    }

    /**
     * @param {EditSession} editSession
     * @param {number} line
     */
    $getIndent(editSession, line) {
        return editSession.getLine(line).match(/^\s*/)[0].length;
    }

    printDiffs() {
        this.chunks.forEach((diff) => {
            console.log(diff.toString());
        });
    }

    /**
     *
     * @param {DiffChunk[]} chunks
     * @param {number} row
     * @param {boolean} isOriginal
     * @return {number}
     */
    findChunkIndex(chunks, row, isOriginal) {
        for (var i = 0; i < chunks.length; i++) {
            var ch = chunks[i];
            var chunk = isOriginal ? ch.old : ch.new;
            if (chunk.end.row < row) continue;
            if (chunk.start.row > row) break;
        }

        this.currentDiffIndex = i;

        return i - 1;
    }

    searchHighlight(selection) {
        if (this.options.syncSelections || this.inlineDiffEditor) {
            return;
        }
        let currSession = selection.session;
        let otherSession = currSession === this.sessionA
            ? this.sessionB : this.sessionA;
        otherSession.highlight(currSession.$searchHighlight.regExp);
        otherSession._signal("changeBackMarker");
    }

    initSelectionMarkers() {
        this.syncSelectionMarkerA = new SyncSelectionMarker();
        this.syncSelectionMarkerB = new SyncSelectionMarker();
        this.sessionA.addDynamicMarker(this.syncSelectionMarkerA, true);
        this.sessionB.addDynamicMarker(this.syncSelectionMarkerB, true);
    }
    clearSelectionMarkers() {
        this.sessionA.removeMarker(this.syncSelectionMarkerA.id);
        this.sessionB.removeMarker(this.syncSelectionMarkerB.id);
    }

}

/*** options ***/

config.defineOptions(BaseDiffView.prototype, "DiffView", {
    showOtherLineNumbers: {
        set: function(value) {
            if (this.gutterLayer) {
                this.gutterLayer.$renderer = value ?  null : emptyGutterRenderer;
            }
        },
        initialValue: false
    },
    folding: {
        set: function(value) {
            this.editorA.setOption("fadeFoldWidgets", value);
            this.editorB.setOption("fadeFoldWidgets", value);
            this.editorA.setOption("showFoldWidgets", value);
            this.editorB.setOption("showFoldWidgets", value);
        }
    },
    syncSelections: {
        set: function(value) {
            this.options.syncSelections = value;
        },
    },
    ignoreTrimWhitespace: {
        set: function(value) {
            this.options.ignoreTrimWhitespace = value;
        },
    },
});

var emptyGutterRenderer =  {
    getText: function name(params) {
        return "";
    },
    getWidth() {
        return 0;
    }
};

exports.BaseDiffView = BaseDiffView;


class DiffChunk {
    /**
     * @param {Range} originalRange
     * @param {Range} modifiedRange
     * @param {{originalStartLineNumber: number, originalStartColumn: number,
     * originalEndLineNumber: number, originalEndColumn: number, modifiedStartLineNumber: number,
     * modifiedStartColumn: number, modifiedEndLineNumber: number, modifiedEndColumn: number}[]} [charChanges]
     */
    constructor(originalRange, modifiedRange, charChanges) {
        this.old = originalRange;
        this.new = modifiedRange;
        this.charChanges = charChanges && charChanges.map(m => new DiffChunk(
            new Range(m.originalStartLineNumber, m.originalStartColumn,
                m.originalEndLineNumber, m.originalEndColumn
            ), new Range(m.modifiedStartLineNumber, m.modifiedStartColumn,
                m.modifiedEndLineNumber, m.modifiedEndColumn
            )));
    }
}

class DiffHighlight {
    /**
     * @param {import("./base_diff_view").BaseDiffView} diffView
     * @param type
     */
    constructor(diffView, type) {
        /**@type{number}*/this.id;
        this.diffView = diffView;
        this.type = type;
    }

    update(html, markerLayer, session, config) {
        let dir, operation, opOperation;
        var diffView = this.diffView;
        if (this.type === -1) {// original editor
            dir = "old";
            operation = "delete";
            opOperation = "insert";
        }
        else { //modified editor
            dir = "new";
            operation = "insert";
            opOperation = "delete";
        }

        var ignoreTrimWhitespace = diffView.options.ignoreTrimWhitespace;
        var lineChanges = diffView.chunks;

        if (session.lineWidgets && !diffView.inlineDiffEditor) {
            for (var row = config.firstRow; row <= config.lastRow; row++) {
                var lineWidget = session.lineWidgets[row];
                if (!lineWidget || lineWidget.hidden)
                    continue;

                let start = session.documentToScreenRow(row, 0);

                if (lineWidget.rowsAbove > 0) {
                    start -= lineWidget.rowsAbove;
                } else {
                    start++;
                }
                let end = start + lineWidget.rowCount - 1;
                var range = new Range(start, 0, end, Number.MAX_VALUE);
                markerLayer.drawFullLineMarker(html, range, "ace_diff aligned_diff", config);
            }
        }

        lineChanges.forEach((lineChange) => {
            let startRow = lineChange[dir].start.row;
            let endRow = lineChange[dir].end.row;
            if (endRow < config.firstRow || startRow > config.lastRow)
                return;
            let range = new Range(startRow, 0, endRow - 1, 1 << 30);
            if (startRow !== endRow) {
                range = range.toScreenRange(session);

                markerLayer.drawFullLineMarker(html, range, "ace_diff " + operation, config);
            }

            if (lineChange.charChanges) {
                for (var i = 0; i < lineChange.charChanges.length; i++) {
                    var changeRange = lineChange.charChanges[i][dir];
                    if (changeRange.end.column == 0 && changeRange.end.row > changeRange.start.row && changeRange.end.row == lineChange[dir].end.row ) {
                        changeRange.end.row --;
                        changeRange.end.column = Number.MAX_VALUE;
                    }
                        
                    if (ignoreTrimWhitespace) {
                        for (let lineNumber = changeRange.start.row;
                             lineNumber <= changeRange.end.row; lineNumber++) {
                            let startColumn;
                            let endColumn;
                            let sessionLineStart = session.getLine(lineNumber).match(/^\s*/)[0].length;
                            let sessionLineEnd = session.getLine(lineNumber).length;

                            if (lineNumber === changeRange.start.row) {
                                startColumn = changeRange.start.column;
                            }
                            else {
                                startColumn = sessionLineStart;
                            }
                            if (lineNumber === changeRange.end.row) {
                                endColumn = changeRange.end.column;
                            }
                            else {
                                endColumn = sessionLineEnd;
                            }
                            let range = new Range(lineNumber, startColumn, lineNumber, endColumn);
                            var screenRange = range.toScreenRange(session);

                            if (sessionLineStart === startColumn && sessionLineEnd === endColumn) {
                                continue;
                            }

                            let cssClass = "inline " + operation;
                            if (range.isEmpty() && startColumn !== 0) {
                                cssClass = "inline " + opOperation + " empty";
                            }

                            markerLayer.drawSingleLineMarker(html, screenRange, "ace_diff " + cssClass, config);
                        }
                    }
                    else {
                        let range = new Range(changeRange.start.row, changeRange.start.column,
                            changeRange.end.row, changeRange.end.column
                        );
                        var screenRange = range.toScreenRange(session);
                        let cssClass = "inline " + operation;
                        if (range.isEmpty() && changeRange.start.column !== 0) {
                            cssClass = "inline empty " + opOperation;
                        }

                        if (screenRange.isMultiLine()) {
                            markerLayer.drawTextMarker(html, screenRange, "ace_diff " + cssClass, config);
                        }
                        else {
                            markerLayer.drawSingleLineMarker(html, screenRange, "ace_diff " + cssClass, config);
                        }
                    }
                }
            }
        });
    }
}

class SyncSelectionMarker {
    constructor() {
        /**@type{number}*/this.id;
        this.type = "fullLine";
        this.clazz = "ace_diff selection";
    }

    update(html, markerLayer, session, config) {
    }

    /**
     * @param {Range} range
     */
    setRange(range) {//TODO
        var newRange = range.clone();
        newRange.end.column++;

        this.range = newRange;
    }
}

exports.DiffChunk = DiffChunk;
exports.DiffHighlight = DiffHighlight;