"use strict";

var Range = require("../../range").Range;
var LineWidgets = require("../../line_widgets").LineWidgets;

const { BaseDiffView } = require("./base_diff_view");
const config = require("../../config");

class SideBySideDiffView extends BaseDiffView {
    /**
     * Constructs a new side by side DiffView instance.
     *
     * @param {Object} [diffModel] - The model for the diff view.
     * @param {import("ace-code").Editor} [diffModel.editorA] - The editor for the original view.
     * @param {import("ace-code").Editor} [diffModel.editorB] - The editor for the edited view.
     * @param {import("ace-code").EditSession} [diffModel.sessionA] - The edit session for the original view.
     * @param {import("ace-code").EditSession} [diffModel.sessionB] - The edit session for the edited view.
     * @param {string} [diffModel.valueA] - The original content.
     * @param {string} [diffModel.valueB] - The modified content.
     */
    constructor(diffModel) {
        diffModel = diffModel || {};
        super();
        this.init(diffModel);
    }

    init(diffModel) {
        this.onChangeTheme = this.onChangeTheme.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onSelect = this.onSelect.bind(this);

        this.$setupModels(diffModel);

        this.syncSelectionMarkerA = new SyncSelectionMarker();
        this.syncSelectionMarkerB = new SyncSelectionMarker();
        this.editorA.session.addDynamicMarker(this.syncSelectionMarkerA, true);
        this.editorB.session.addDynamicMarker(this.syncSelectionMarkerB, true);

        this.addGutterDecorators();

        this.onChangeTheme();

        config.resetOptions(this);
        config["_signal"]("diffView", this);

        this.$attachEventHandlers();
    }

    /*** scroll locking ***/
    align() {
        var diffView = this;

        function add(session, w) {
            let lineWidget = session.lineWidgets[w.row];
            if (lineWidget) {
                w.rowsAbove += lineWidget.rowsAbove > w.rowsAbove ? lineWidget.rowsAbove : w.rowsAbove;
                w.rowCount += lineWidget.rowCount;
            }
            session.lineWidgets[w.row] = w;
            session.widgetManager.lineWidgets[w.row] = w;
            session.$resetRowCache(w.row);
            var fold = session.getFoldAt(w.row, 0);
            if (fold) {
                session.widgetManager.updateOnFold({
                    data: fold,
                    action: "add",
                }, session);
            }
        }

        function init(editor) {
            var session = editor.session;
            if (!session.widgetManager) {
                session.widgetManager = new LineWidgets(session);
                session.widgetManager.attach(editor);
            }
            editor.session.lineWidgets = [];
            editor.session.widgetManager.lineWidgets = [];
            editor.session.$resetRowCache(0);
        }

        init(diffView.editorA);
        init(diffView.editorB);

        diffView.chunks.forEach(function (ch) {
            var diff1 = diffView.sessionA.documentToScreenPosition(ch.old.start).row
            var diff2 = diffView.sessionB.documentToScreenPosition(ch.new.start).row 

            if (diff1 < diff2) {
                add(diffView.sessionA, {
                    rowCount: diff2 - diff1,
                    rowsAbove: ch.old.start.row === 0 ? diff2 - diff1 : 0,
                    row: ch.old.start.row === 0 ? 0 : ch.old.start.row - 1
                });
            }
            else if (diff1 > diff2) {
                add(diffView.sessionB, {
                    rowCount: diff1 - diff2,
                    rowsAbove: ch.new.start.row === 0 ? diff1 - diff2 : 0,
                    row: ch.new.start.row === 0 ? 0 : ch.new.start.row - 1
                });
            }

            var diff1 = diffView.sessionA.documentToScreenPosition(ch.old.end).row
            var diff2 = diffView.sessionB.documentToScreenPosition(ch.new.end).row 
            if (diff1 < diff2) {
                add(diffView.sessionA, {
                    rowCount: diff2 - diff1,
                    rowsAbove: ch.old.end.row === 0 ? diff2 - diff1 : 0,
                    row: ch.old.end.row === 0 ? 0 : ch.old.end.row - 1
                });
            }
            else if (diff1 > diff2) {
                add(diffView.sessionB, {
                    rowCount: diff1 - diff2,
                    rowsAbove: ch.new.end.row === 0 ? diff1 - diff2 : 0,
                    row: ch.new.end.row === 0 ? 0 : ch.new.end.row - 1
                });
            }
        });
        diffView.sessionA["_emit"]("changeFold", {data: {start: {row: 0}}});
        diffView.sessionB["_emit"]("changeFold", {data: {start: {row: 0}}});
    }

    onSelect(e, selection) {
        this.searchHighlight(selection);
        this.syncSelect(selection);
    }

    syncSelect(selection) {
        if (this.$updatingSelection) return;
        var isOrig = selection.session === this.sessionA;
        var selectionRange = selection.getRange();

        var currSelectionRange = isOrig ? this.selectionRangeA : this.selectionRangeB;
        if (currSelectionRange && selectionRange.isEqual(currSelectionRange))
            return;

        if (isOrig) {
            this.selectionRangeA = selectionRange;
        } else {
            this.selectionRangeB = selectionRange;
        }

        this.$updatingSelection = true;
        var newRange = this.transformRange(selectionRange, isOrig);

        if (this.options.syncSelections) {
            (isOrig ? this.editorB : this.editorA).session.selection.setSelectionRange(newRange);
        }
        this.$updatingSelection = false;

        if (isOrig) {
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

    onScroll(e, session) {
        this.syncScroll(this.sessionA === session ? this.editorA.renderer : this.editorB.renderer);
    }

    /**
     * @param {import("../../virtual_renderer").VirtualRenderer} renderer
     */
    syncScroll(renderer) {
        if (this.$syncScroll == false) return;

        var r1 = this.editorA.renderer;
        var r2 = this.editorB.renderer;
        var isOrig = renderer == r1;
        if (r1["$scrollAnimation"] && r2["$scrollAnimation"]) return;

        var now = Date.now();
        if (this.scrollSetBy != renderer && now - this.scrollSetAt < 500) return;

        var r = isOrig ? r1 : r2;
        if (this.scrollSetBy != renderer) {
            if (isOrig && this.scrollA == r.session.getScrollTop()) return; else if (!isOrig && this.scrollB
                == r.session.getScrollTop()) return;
        }
        var rOther = isOrig ? r2 : r1;

        var targetPos = r.session.getScrollTop();

        this.$syncScroll = false;

        if (isOrig) {
            this.scrollA = r.session.getScrollTop();
            this.scrollB = targetPos;
        }
        else {
            this.scrollA = targetPos;
            this.scrollB = r.session.getScrollTop();
        }
        this.scrollSetBy = renderer;
        rOther.session.setScrollTop(targetPos);
        this.$syncScroll = true;
        this.scrollSetAt = now;
    }

    onMouseWheel(ev) {
        if (ev.getAccelKey()) return;
        if (ev.getShiftKey() && ev.wheelY && !ev.wheelX) {
            ev.wheelX = ev.wheelY;
            ev.wheelY = 0;
        }

        var editor = ev.editor;
        var isScrolable = editor.renderer.isScrollableBy(ev.wheelX * ev.speed, ev.wheelY * ev.speed);
        if (!isScrolable) {
            var other = editor == this.editorA ? this.editorB : this.editorA;
            if (other.renderer.isScrollableBy(ev.wheelX * ev.speed, ev.wheelY * ev.speed)) other.renderer.scrollBy(
                ev.wheelX * ev.speed, ev.wheelY * ev.speed);
            return ev.stop();
        }
    }

    $attachSessionsEventHandlers() {
        this.$attachSessionEventHandlers(this.editorA, this.markerA);
        this.$attachSessionEventHandlers(this.editorB, this.markerB);
    }

    /**
     * @param {import("../../editor").Editor} editor
     * @param {import("./ace_diff").DiffHighlight} marker
     */
    $attachSessionEventHandlers(editor, marker) {
        editor.session.on("changeScrollTop", this.onScroll);
        editor.session.on("changeFold", this.onChangeFold);
        // @ts-expect-error
        editor.session.addDynamicMarker(marker);
        editor.selection.on("changeCursor", this.onSelect);
        editor.selection.on("changeSelection", this.onSelect);
    }

    $detachSessionsEventHandlers() {
        this.$detachSessionHandlers(this.editorA, this.markerA);
        this.$detachSessionHandlers(this.editorB, this.markerB);
    }

    /**
     * @param {import("../../editor").Editor} editor
     * @param {import("./ace_diff").DiffHighlight} marker
     */
    $detachSessionHandlers(editor, marker) {
        editor.session.off("changeScrollTop", this.onScroll);
        editor.session.off("changeFold", this.onChangeFold);
        editor.session.removeMarker(marker.id);
        editor.selection.off("changeCursor", this.onSelect);
        editor.selection.off("changeSelection", this.onSelect);
    }

    $attachEventHandlers() {
        this.editorA.renderer.on("themeLoaded", this.onChangeTheme);

        this.editorA.on("mousewheel", this.onMouseWheel);
        this.editorB.on("mousewheel", this.onMouseWheel);

        this.editorA.on("input", this.onInput);
        this.editorB.on("input", this.onInput);

    }

    $detachEventHandlers() {
        this.$detachSessionsEventHandlers();
        this.editorA.renderer.off("themeLoaded", this.onChangeTheme);
        this.$detachEditorEventHandlers(this.editorA);
        this.$detachEditorEventHandlers(this.editorB);
    }

    $detachEditorEventHandlers(editor) {
        editor.off("mousewheel", this.onMouseWheel);
        editor.off("input", this.onInput);
        editor.session.removeMarker(this.syncSelectionMarkerA.id);
        editor.session.removeMarker(this.syncSelectionMarkerB.id);
        editor.renderer["$scrollDecorator"].zones = [];
        editor.renderer["$scrollDecorator"].$updateDecorators(editor.renderer.layerConfig);
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

exports.SideBySideDiffView = SideBySideDiffView;
