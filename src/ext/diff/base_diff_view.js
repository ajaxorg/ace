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

var {
    AceDiff,
    DiffHighlight,
} = require("./ace_diff");
var {EditSession} = require("../../edit_session");

var MinimalGutterDiffDecorator = require("./gutter_decorator").MinimalGutterDiffDecorator;

class BaseDiffView {
    /**
     * Constructs a new base DiffView instance.
     * @param {boolean} [inlineDiffEditor] - Whether to use an inline diff editor.
     * @param {HTMLElement} [container] - optional container element for the DiffView.
     */
    constructor(inlineDiffEditor, container) {
        /**@type{{sessionA: EditSession, sessionB: EditSession, chunks: AceDiff[]}}*/this.diffSession;
        /**@type AceDiff[]*/this.chunks;
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
            foldUnchanged: false,
            maxComputationTimeMs: 0, // time in milliseconds, 0 => no computation limit.
            syncSelections: false //experimental option
        };
        oop.mixin(this.options, {
            showDiffs: true,
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
            showDiffs: true,
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
        const diffEditorOptions = {
            "scrollPastEnd": 0.5,
            "highlightActiveLine": false,
            "highlightGutterLine": false,
            "animatedScroll": true,
            "customScrollbar": true,
            "vScrollBarAlwaysVisible": true,
            fadeFoldWidgets: true,
        };

        if (!this.inlineDiffEditor || diffModel.showSideA) {
            this.editorA = diffModel.editorA || this.$setupModel(diffModel.sessionA, diffModel.valueA);
            this.container && this.container.appendChild(this.editorA.container);
            this.editorA.setOptions(diffEditorOptions);
            //this.editorA.renderer.setOption("decoratorType", "diff");
        }
        if (!this.inlineDiffEditor || !diffModel.showSideA) {
            this.editorB = diffModel.editorB || this.$setupModel(diffModel.sessionB, diffModel.valueB);
            this.container && this.container.appendChild(this.editorB.container);
            this.editorB.setOptions(diffEditorOptions);
            //this.editorB.renderer.setOption("decoratorType", "diff");
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
        this.diffSession.sessionA.unfold();
        this.diffSession.sessionB.unfold();

        var chunks = this.chunks;
        var sep = "---";
        var prev = {
            old: new Range(0, 0, 0, 0),
            new: new Range(0, 0, 0, 0)
        };
        for (var i = 0; i < chunks.length + 1; i++) {
            let current = chunks[i] || {
                old: new Range(this.diffSession.sessionA.getLength(), 0, this.diffSession.sessionA.getLength(), 0),
                new: new Range(this.diffSession.sessionB.getLength(), 0, this.diffSession.sessionB.getLength(), 0)
            };
            var l = current.new.start.row - prev.new.end.row - 5;
            if (l > 2) {
                var s = prev.old.end.row + 2;
                var f1 = this.diffSession.sessionA.addFold(sep, new Range(s, 0, s + l, Number.MAX_VALUE));
                s = prev.new.end.row + 2;
                var f2 = this.diffSession.sessionB.addFold(sep, new Range(s, 0, s + l, Number.MAX_VALUE));
                if (f2 && f1) {
                    f1["other"] = f2;
                    f2["other"] = f1;
                }
            }

            prev = current;
        }

    }

    /**
     * @param {{ sessionA: any; sessionB: EditSession; chunks: AceDiff[] }} session
     */
    setDiffSession(session) {
        if (this.diffSession) {
            this.$detachSessionsEventHandlers();
        }
        this.diffSession = session;
        if (this.diffSession) {
            this.chunks = this.diffSession.chunks;
            this.editorA && this.editorA.setSession(session.sessionA);
            this.editorB && this.editorB.setSession(session.sessionB);
            this.$attachSessionsEventHandlers();
        }
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

    resize() {
        this.editorA && this.editorA.resize();
        this.editorB && this.editorB.resize();
    }

    onInput() {
        var val1 = this.diffSession.sessionA.doc.getAllLines();
        var val2 = this.diffSession.sessionB.doc.getAllLines();

        this.selectionSetBy = false;
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

        if (this["$alignDiffs"]) this.align();

        this.editorA && this.editorA.renderer.updateBackMarkers();
        this.editorB && this.editorB.renderer.updateBackMarkers();

        //this.updateScrollBarDecorators();

        if (this.options.foldUnchanged) {
            this.foldUnchanged();
        }
    }

   /* updateScrollBarDecorators() {
        if (this.editorA) {
            this.editorA.renderer.$scrollDecorator.zones = [];
        }
        if (this.editorB) {
            this.editorB.renderer.$scrollDecorator.zones = [];
        }
        const updateDecorators = (editor, editorChange, operation) => {
            if (editor) {
                let startRow = editorChange.start.row;
                let endRow = editorChange.end.row;
                let range = new Range(startRow, 0, endRow - 1, 1 << 30);
                editor.renderer.$scrollDecorator.addZone(range.start.row, range.end.row, operation);
            }
        };

        this.chunks.forEach((lineChange) => {
            updateDecorators(this.editorA, lineChange["old"], "delete");
            updateDecorators(this.editorB, lineChange["new"], "insert");
        });

        //TODO: hack for decorators to be forcely updated until we got new change type in VirtualRenderer
        //editor.renderer.$scrollDecorator.$updateDecorators(config);
    }*/

    /**
     *
     * @param {string[]} val1
     * @param {string[]} val2
     * @return {AceDiff[]}
     */
    $diffLines(val1, val2) {
        return this.diffProvider.compute(val1, val2, {
            ignoreTrimWhitespace: this.options.ignoreTrimWhitespace,
            maxComputationTimeMs: this.options.maxComputationTimeMs
        });
    }

    /**
     * @param {import("../../../diff0/diff_providers").DiffProvider} provider
     */
    setProvider(provider) {
        this.diffProvider = provider;
    }

    /** scroll locking
     * @abstract
     **/
    align() {
    }

    /**
     * @param ev
     * @param {EditSession} session
     */
    onChangeFold(ev, session) {
        var fold = ev.data;
        if (this.$syncFold || !fold || !ev.action) return;

        const isOrig = session === this.diffSession.sessionA;
        const other = isOrig ? this.diffSession.sessionB : this.diffSession.sessionA;

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
                this.$syncFold = true;

                fold.other = other.addFold("---", range);
                fold.other.other = fold;

                this.$syncFold = false;

            }
        }
    }

    detach() {
        this.$detachEventHandlers();
        this.$removeLineWidgets(this.diffSession.sessionA);
        this.$removeLineWidgets(this.diffSession.sessionB);
        this.gutterDecoratorA && this.gutterDecoratorA.dispose();
        this.gutterDecoratorB && this.gutterDecoratorB.dispose();
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

    gotoNext(dir) { //TODO: wouldn't work in inline diff editor
        var orig = false;
        var ace = orig ? this.editorA : this.editorB;
        var row = ace.selection.lead.row;
        var i = this.findChunkIndex(this.chunks, row, orig);
        var chunk = this.chunks[i + dir] || this.chunks[i];

        var scrollTop = ace.session.getScrollTop();
        if (chunk) {
            var line = Math.max(chunk.new.start.row, chunk.new.end.row - 1);
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
     * @param {import("ace-code").Ace.Range} range
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

        var clonePos = this.diffSession.sessionB.doc.clonePos;
        var result = clonePos(pos);

        var [from, to] = isOriginal ? ["old", "new"] : ["new", "old"];
        var deltaChar = 0;
        var ignoreIndent = false;

        if (chunk) {
            if (chunk[from].end.row <= pos.row) {
                result.row -= chunk[from].end.row - chunk[to].end.row;
            }
            else {
                if (chunk.charChanges) {
                    for (let i = 0; i < chunk.charChanges.length; i++) {
                        let change = chunk.charChanges[i];

                        let fromRange = change.getChangeRange(from);
                        let toRange = change.getChangeRange(to);

                        if (fromRange.end.row < pos.row) continue;

                        if (fromRange.start.row > pos.row) break;

                        if (fromRange.isMultiLine() && fromRange.contains(pos.row, pos.column)) {
                            result.row = toRange.start.row + pos.row - fromRange.start.row;
                            var maxRow = toRange.end.row;
                            if (toRange.end.column === 0) maxRow--;

                            if (result.row > maxRow) {
                                result.row = maxRow;
                                result.column = (isOriginal ? this.diffSession.sessionB : this.diffSession.sessionA).getLine(maxRow).length;
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
            }
        }


        if (!ignoreIndent) { //TODO:
            var [fromEditSession, toEditSession] = isOriginal ? [this.diffSession.sessionA, this.diffSession.sessionB] : [
                this.diffSession.sessionB, this.diffSession.sessionA
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
     * @param {AceDiff[]} chunks
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
}

/*** options ***/
config.defineOptions(BaseDiffView.prototype, "editor", {
    alignDiffs: {
        set: function (val) {
            if (val) this.align();
        },
        initialValue: true
    }
});

exports.BaseDiffView = BaseDiffView;
