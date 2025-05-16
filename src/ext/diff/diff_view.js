"use strict";

var LineWidgets = require("../../line_widgets").LineWidgets;

var BaseDiffView = require("./base_diff_view").BaseDiffView;
var config = require("../../config");
var Range = require("../../range").Range;

class DiffView extends BaseDiffView {
    /**
     * Constructs a new side by side DiffView instance.
     *
     * @param {Object} [diffModel] - The model for the diff view.
     * @param {import("../../editor").Editor} [diffModel.editorA] - The editor for the original view.
     * @param {import("../../editor").Editor} [diffModel.editorB] - The editor for the edited view.
     * @param {import("../../edit_session").EditSession} [diffModel.sessionA] - The edit session for the original view.
     * @param {import("../../edit_session").EditSession} [diffModel.sessionB] - The edit session for the edited view.
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

        this.$setupModels(diffModel);

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
            var diff1 = diffView.sessionA.documentToScreenPosition(ch.old.start).row;
            var diff2 = diffView.sessionB.documentToScreenPosition(ch.new.start).row; 

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

            var diff1 = diffView.sessionA.documentToScreenPosition(ch.old.end).row;
            var diff2 = diffView.sessionB.documentToScreenPosition(ch.new.end).row; 
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

    initSelectionMarkers() {
        super.initSelectionMarkers();

        this.syncSelectionColumnMarkerA = new SyncSelectionColumnMarker();
        this.syncSelectionColumnMarkerB = new SyncSelectionColumnMarker();
        this.sessionA.addDynamicMarker(this.syncSelectionColumnMarkerA, true);
        this.sessionB.addDynamicMarker(this.syncSelectionColumnMarkerB, true);
    }
    clearSelectionMarkers() {
        super.clearSelectionMarkers();

        this.sessionA.removeMarker(this.syncSelectionColumnMarkerA.id);
        this.sessionB.removeMarker(this.syncSelectionColumnMarkerB.id);
    }

    syncSelect(selection) {
        super.syncSelect(selection);

        let isSessionA = selection.session === this.diffSession.sessionA;

        let triangleSelectionRangeA, triangleSelectionRangeB;

        if (!this.options.syncSelections) {
            isSessionA
                ? triangleSelectionRangeB = this.selectionRangeB
                : triangleSelectionRangeA = this.selectionRangeA;
        }

        this.updateSelectionMarker(this.syncSelectionColumnMarkerA, this.diffSession.sessionA, triangleSelectionRangeA);
        this.updateSelectionMarker(this.syncSelectionColumnMarkerB, this.diffSession.sessionB, triangleSelectionRangeB);
    }

    $attachSessionsEventHandlers() {
        this.$attachSessionEventHandlers(this.editorA, this.markerA);
        this.$attachSessionEventHandlers(this.editorB, this.markerB);
    }

    /**
     * @param {import("../../editor").Editor} editor
     * @param {import("./base_diff_view").DiffHighlight} marker
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
     * @param {import("./base_diff_view").DiffHighlight} marker
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
        this.clearSelectionMarkers();
        this.editorA.renderer.off("themeLoaded", this.onChangeTheme);
        this.$detachEditorEventHandlers(this.editorA);
        this.$detachEditorEventHandlers(this.editorB);
    }

    $detachEditorEventHandlers(editor) {
        editor.off("mousewheel", this.onMouseWheel);
        editor.off("input", this.onInput);
    }
}

class SyncSelectionColumnMarker {
    constructor() {
        /**@type{number}*/this.id;
        this.type = "";
        this.clazz = "ace_diff double-triangle";
    }

    update(html, markerLayer, session, config) {
    }

    /**
     * @param {Range} range
     */
    setRange(range) {//TODO
        if (!range) {
            this.range = null;
            return;
        }
        let newRange = range.clone();
        newRange.end.column++;

        this.range = newRange;
    }
}


exports.DiffView = DiffView;
