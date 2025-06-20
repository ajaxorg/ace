"use strict";

var BaseDiffView = require("./base_diff_view").BaseDiffView;
var config = require("../../config");

class SplitDiffView extends BaseDiffView {
    /**
     * Constructs a new side by side DiffView instance.
     *
     * @param {import("../diff").DiffModel} [diffModel] - The model for the diff view.
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

    onChangeWrapLimit() {
        this.scheduleRealign();
    }

    /*** scroll locking ***/
    align() {
        var diffView = this;

        this.$initWidgets(diffView.editorA);
        this.$initWidgets(diffView.editorB);

        diffView.chunks.forEach(function (ch) {
            var diff1 = diffView.$screenRow(ch.old.start, diffView.sessionA);
            var diff2 = diffView.$screenRow(ch.new.start, diffView.sessionB); 

            if (diff1 < diff2) {
                diffView.$addWidget(diffView.sessionA, {
                    rowCount: diff2 - diff1,
                    rowsAbove: ch.old.start.row === 0 ? diff2 - diff1 : 0,
                    row: ch.old.start.row === 0 ? 0 : ch.old.start.row - 1
                });
            }
            else if (diff1 > diff2) {
                diffView.$addWidget(diffView.sessionB, {
                    rowCount: diff1 - diff2,
                    rowsAbove: ch.new.start.row === 0 ? diff1 - diff2 : 0,
                    row: ch.new.start.row === 0 ? 0 : ch.new.start.row - 1
                });
            }

            var diff1 = diffView.$screenRow(ch.old.end, diffView.sessionA);
            var diff2 = diffView.$screenRow(ch.new.end, diffView.sessionB); 
            if (diff1 < diff2) {
                diffView.$addWidget(diffView.sessionA, {
                    rowCount: diff2 - diff1,
                    rowsAbove: ch.old.end.row === 0 ? diff2 - diff1 : 0,
                    row: ch.old.end.row === 0 ? 0 : ch.old.end.row - 1
                });
            }
            else if (diff1 > diff2) {
                diffView.$addWidget(diffView.sessionB, {
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

        editor.session.on("changeWrapLimit", this.onChangeWrapLimit);
        editor.session.on("changeWrapMode", this.onChangeWrapLimit);
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

        editor.session.off("changeWrapLimit", this.onChangeWrapLimit);
        editor.session.off("changeWrapMode", this.onChangeWrapLimit);
    }

    $attachEventHandlers() {
        this.editorA.renderer.on("themeChange", this.onChangeTheme);
        this.editorB.renderer.on("themeChange", this.onChangeTheme);

        this.editorA.on("mousewheel", this.onMouseWheel);
        this.editorB.on("mousewheel", this.onMouseWheel);

        this.editorA.on("input", this.onInput);
        this.editorB.on("input", this.onInput);

    }

    $detachEventHandlers() {
        this.$detachSessionsEventHandlers();
        this.clearSelectionMarkers();
        this.editorA.renderer.off("themeChange", this.onChangeTheme);
        this.editorB.renderer.off("themeChange", this.onChangeTheme);
        this.$detachEditorEventHandlers(this.editorA);
        this.$detachEditorEventHandlers(this.editorB);
    }

    $detachEditorEventHandlers(editor) {
        editor.off("mousewheel", this.onMouseWheel);
        editor.off("input", this.onInput);
    }
}


exports.SplitDiffView = SplitDiffView;
