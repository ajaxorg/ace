"use strict";

var LineWidgets = require("../../line_widgets").LineWidgets;
var Editor = require("../../editor").Editor;
var Renderer = require("../../virtual_renderer").VirtualRenderer;

const {BaseDiffView} = require("./base_diff_view");
const config = require("../../config");

class InlineDiffView extends BaseDiffView {
    /**
     * Constructs a new inline DiffView instance.
     * @param {Object} [diffModel] - The model for the diff view.
     * @param {import("ace-code").Editor} [diffModel.editorA] - The editor for the original view.
     * @param {import("ace-code").Editor} [diffModel.editorB] - The editor for the edited view.
     * @param {import("ace-code").EditSession} [diffModel.sessionA] - The edit session for the original view.
     * @param {import("ace-code").EditSession} [diffModel.sessionB] - The edit session for the edited view.
     * @param {string} [diffModel.valueA] - The original content.
     * @param {string} [diffModel.valueB] - The modified content.
     * @param {boolean} [diffModel.showSideA] - Whether to show the original view or modified view.
     * @param {HTMLElement} [container] - optional container element for the DiffView.
     */
    constructor(diffModel, container) {
        diffModel = diffModel || {};
        super( true, container);
        this.init(diffModel);
    }

    init(diffModel) {
        this.showSideA = diffModel.showSideA == undefined ? true : diffModel.showSideA;

        this.onSelect = this.onSelect.bind(this);
        this.onAfterRender = this.onAfterRender.bind(this);

        this.$setupModels(diffModel);
        this.onChangeTheme();
        config.resetOptions(this);
        config["_signal"]("diffView", this);

        var padding = this.activeEditor.renderer.$padding;

        this.otherEditor = new Editor(new Renderer(null), this.otherSession, this.activeEditor.getOptions());
        if (this.showSideA) {
            this.editorB = this.otherEditor;
        } else {
            this.editorA = this.otherEditor;
        }
        this.addGutterDecorators();

        this.otherEditor.renderer.setPadding(padding);
        this.textLayer = this.otherEditor.renderer.$textLayer;
        this.markerLayer = this.otherEditor.renderer.$markerBack;
        this.gutterLayer = this.otherEditor.renderer.$gutterLayer;

        var textLayerElement = this.activeEditor.renderer.$textLayer.element;
        textLayerElement.parentNode.insertBefore(
            this.textLayer.element,
            textLayerElement
        );

        var markerLayerElement = this.activeEditor.renderer.$markerBack.element;
        markerLayerElement.parentNode.insertBefore(
            this.markerLayer.element,
            markerLayerElement.nextSibling
        );

        var gutterLayerElement = this.activeEditor.renderer.$gutterLayer.element;
        gutterLayerElement.parentNode.insertBefore(
            this.gutterLayer.element,
            gutterLayerElement
        );
        gutterLayerElement.style.position = "absolute";
        this.gutterLayer.element.style.position = "absolute";
        this.gutterLayer.element.style.width = "100%";

        this.gutterLayer.$updateGutterWidth = function() {};

        this.$attachEventHandlers();
    }

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
            var diff1 = diffView.sessionA.documentToScreenPosition(ch.old.end).row
                - diffView.sessionA.documentToScreenPosition(ch.old.start).row;
            var diff2 = diffView.sessionB.documentToScreenPosition(ch.new.end).row
                - diffView.sessionB.documentToScreenPosition(ch.new.start).row;

            add(diffView.sessionA, {
                rowCount: diff2,
                rowsAbove: ch.old.end.row === 0 ? diff2 : 0,
                row: ch.old.end.row === 0 ? 0 : ch.old.end.row - 1
            });
            add(diffView.sessionB, {
                rowCount: diff1,
                rowsAbove: diff1,
                row: ch.new.start.row,
            });

        });
        diffView.sessionA["_emit"]("changeFold", {data: {start: {row: 0}}});
        diffView.sessionB["_emit"]("changeFold", {data: {start: {row: 0}}});
    }

    onSelect(e, selection) {
        var selectionRange = selection.getRange();
        this.findChunkIndex(this.chunks, selectionRange.start.row, false);
        this.searchHighlight(selection);
    }

    $attachSessionsEventHandlers() {
        if (this.showSideA) {
            this.activeEditor = this.editorA;
            this.otherSession = this.sessionB;
        } else {
            this.activeEditor = this.editorB;
            this.otherSession = this.sessionA;
        }

        let activeMarker, dynamicMarker;
        if (this.showSideA) {
            activeMarker = this.markerA;
            dynamicMarker = this.markerB;
        } else {
            activeMarker = this.markerB;
            dynamicMarker = this.markerA;
        }
        this.$attachSessionEventHandlers(this.activeEditor, activeMarker);
        this.otherSession.addDynamicMarker(dynamicMarker);
    }

    $attachSessionEventHandlers(editor, marker) {
        editor.session.on("changeFold", this.onChangeFold);
        editor.session.addDynamicMarker(marker);
        editor.selection.on("changeCursor", this.onSelect);
        editor.selection.on("changeSelection", this.onSelect);
    }

    $detachSessionsEventHandlers() {
        let activeMarker, dynamicMarker;//TODO: duplicate code
        if (this.showSideA) {
            activeMarker = this.markerA;
            dynamicMarker = this.markerB;
        } else {
            activeMarker = this.markerB;
            dynamicMarker = this.markerA;
        }
        this.$detachSessionEventHandlers(this.activeEditor, activeMarker);
        this.otherSession.removeMarker(dynamicMarker.id);
        this.otherSession.bgTokenizer.lines.fill(undefined);
        this.otherSession.bgTokenizer._signal("update", {data: {firstRow: 0, lastRow: this.otherSession.bgTokenizer.lines.length}});
    }

    $detachSessionEventHandlers(editor, marker) {
        editor.session.removeMarker(marker.id);
        editor.selection.off("changeCursor", this.onSelect);
        editor.selection.off("changeSelection", this.onSelect);
        editor.session.on("changeFold", this.onChangeFold);
    }

    $attachEventHandlers() {
        this.activeEditor.on("input", this.onInput);
        this.activeEditor.renderer.on("afterRender", this.onAfterRender);
        this.otherSession.on("change", this.onInput);
    }

    $detachEventHandlers() {
        this.$detachSessionsEventHandlers();
        this.activeEditor.off("input", this.onInput);
        this.activeEditor.renderer.off("afterRender", this.onAfterRender);
        this.otherSession.off("change", this.onInput);

        this.activeEditor.renderer["$scrollDecorator"].zones = [];
        this.activeEditor.renderer["$scrollDecorator"].$updateDecorators(this.activeEditor.renderer.layerConfig);

        this.textLayer.element.textContent = "";
        this.textLayer.element.remove();
        this.gutterLayer.element.textContent = "";
        this.gutterLayer.element.remove();
        this.markerLayer.element.textContent = "";
        this.markerLayer.element.remove();

        this.otherEditor.setSession(null);
        this.otherEditor.destroy();
    }

    /**
     * @param {number} changes
     * @param {import("ace-code").VirtualRenderer} renderer
     */
    onAfterRender(changes, renderer) {
        var config = renderer.layerConfig;
        var side = this.showSideA ? "new" : "old";

        function filterLines(lines, chunks) {
            var i = 0;
            var nextChunkIndex = 0;

            var nextChunk = chunks[nextChunkIndex] && chunks[nextChunkIndex][side];
            nextChunkIndex++;
            var nextStart = nextChunk ? nextChunk.start.row : lines.length;
            var nextEnd = nextChunk ? nextChunk.end.row : lines.length;
            while (i < lines.length) {
                while (i < nextStart) {
                    if (lines[i] && lines[i].length) lines[i].length = 0;
                    i++;
                }
                while (i < nextEnd) {
                    if (lines[i] && lines[i].length == 0) lines[i] = undefined;
                    i++;
                }
                nextChunk = chunks[nextChunkIndex] && chunks[nextChunkIndex][side];
                nextChunkIndex++;
                
                nextStart = nextChunk ? nextChunk.start.row : lines.length;
                nextEnd = nextChunk ? nextChunk.end.row : lines.length;
            }
        }

        filterLines(this.otherSession.bgTokenizer.lines, this.chunks);

        var session = this.otherSession;
        var cloneRenderer = this.otherEditor.renderer;

        session.$scrollTop = renderer.scrollTop;
        session.$scrollLeft = renderer.scrollLeft;

        [
            "characterWidth",
            "lineHeight",
            "scrollTop",
            "scrollLeft",
            "scrollMargin",
            "$padding",
            "$size",
            "layerConfig",
            "$horizScroll",
            "$vScroll",
        ]. forEach(function(prop) {
            cloneRenderer[prop] = renderer[prop];
        });

        cloneRenderer.$computeLayerConfig();

        var newConfig = cloneRenderer.layerConfig;
        
        this.gutterLayer.update(newConfig);

        newConfig.firstRowScreen = config.firstRowScreen;

        this.textLayer.update(newConfig);

        this.markerLayer.setMarkers(this.otherSession.getMarkers());
        this.markerLayer.update(newConfig);
    }

}



exports.InlineDiffView = InlineDiffView;
