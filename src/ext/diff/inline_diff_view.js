"use strict";


const BaseDiffView = require("./base_diff_view").BaseDiffView;
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
        this.onSelect = this.onSelect.bind(this);
        this.onAfterRender = this.onAfterRender.bind(this);
        this.onChangeWrapLimit = this.onChangeWrapLimit.bind(this);
        

        this.$setupModels(diffModel);
        this.onChangeTheme();
        config.resetOptions(this);
        config["_signal"]("diffView", this);

        var padding = this.activeEditor.renderer.$padding;

        this.addGutterDecorators();

        this.otherEditor.renderer.setPadding(padding);
        this.textLayer = this.otherEditor.renderer.$textLayer;
        this.markerLayer = this.otherEditor.renderer.$markerBack;
        this.gutterLayer = this.otherEditor.renderer.$gutterLayer;
        this.cursorLayer = this.otherEditor.renderer.$cursorLayer;

        this.otherEditor.renderer.$updateCachedSize = function() {
        };

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
            gutterLayerElement.nextSibling
        );
        gutterLayerElement.style.position = "absolute";
        this.gutterLayer.element.style.position = "absolute";
        this.gutterLayer.element.style.width = "100%";
        this.gutterLayer.element.classList.add("ace_mini-diff_gutter_other");
        

        this.gutterLayer.$updateGutterWidth = function() {};
        this.initMouse();
        this.initTextInput();
        this.initTextLayer();

        this.$attachEventHandlers();
    }

    initTextLayer() {
        var renderLine = this.textLayer.$renderLine;
        var diffView = this;
        this.otherEditor.renderer.$textLayer.$renderLine = function(parent, row, foldLIne) {
            if (isVisibleRow(diffView.chunks, row)) {
                renderLine.call(this, parent, row, foldLIne);
            }
        };
        var side = this.showSideA ? "new" : "old";
        function isVisibleRow(chunks, row) {
            var min = 0;
            var max = chunks.length - 1;
            var result = -1;
            while (min < max) {
                var mid = Math.floor((min + max) / 2);
                var chunkStart = chunks[mid][side].start.row;
                if (chunkStart < row) {
                    result = mid;
                    min = mid + 1;
                } else if (chunkStart > row) {
                    max = mid - 1;
                } else {
                    result = mid;
                    break;
                }
            }
            if (chunks[result + 1] && chunks[result + 1][side].start.row <= row) {
                result++;
            }
            var range = chunks[result] && chunks[result][side];
            if (range && range.end.row > row) {
                return true;
            }
            return false;
        }
    }

    initTextInput(restore) {
        if (restore) {
            this.otherEditor.textInput = this.othertextInput;
            this.otherEditor.container = this.otherEditorContainer;
        } else {
            this.othertextInput = this.otherEditor.textInput;
            this.otherEditor.textInput = this.activeEditor.textInput;
            this.otherEditorContainer = this.otherEditor.container;
            this.otherEditor.container = this.activeEditor.container;
        }
    }

    selectEditor(editor) {
        if (editor == this.activeEditor) {
            this.otherEditor.selection.clearSelection();
            this.activeEditor.textInput.setHost(this.activeEditor);
            this.activeEditor.setStyle("ace_diff_other", false);
            this.cursorLayer.element.remove();
            this.activeEditor.renderer.$cursorLayer.element.style.display = "block";
            if (this.showSideA) {
                this.sessionA.removeMarker(this.syncSelectionMarkerA.id);
                this.sessionA.addDynamicMarker(this.syncSelectionMarkerA, true);
            }
        } else {
            this.activeEditor.selection.clearSelection();
            this.activeEditor.textInput.setHost(this.otherEditor);
            this.activeEditor.setStyle("ace_diff_other");
            this.activeEditor.renderer.$cursorLayer.element.parentNode.appendChild(
                this.cursorLayer.element
            );
            this.activeEditor.renderer.$cursorLayer.element.style.display = "none";
            if (this.activeEditor.$isFocused) {
                this.otherEditor.onFocus();
            }
            if (this.showSideA) {
                this.sessionA.removeMarker(this.syncSelectionMarkerA.id);
            }
        }
    }
    initMouse() {
        this.otherEditor.renderer.$loop = this.activeEditor.renderer.$loop;
        
        this.otherEditor.renderer.scroller = {
            getBoundingClientRect: () => {
                return this.activeEditor.renderer.scroller.getBoundingClientRect();
            },
            style: this.activeEditor.renderer.scroller.style,
        };
        
        var forwardEvent = (ev) => {
            if (!ev.domEvent) return; 
            var screenPos = ev.editor.renderer.pixelToScreenCoordinates(ev.clientX, ev.clientY);
            var sessionA = this.activeEditor.session;
            var sessionB = this.otherEditor.session;
            var posA = sessionA.screenToDocumentPosition(screenPos.row, screenPos.column, screenPos.offsetX); 
            var posB = sessionB.screenToDocumentPosition(screenPos.row, screenPos.column, screenPos.offsetX); 
        
            var posAx = sessionA.documentToScreenPosition(posA); 
            var posBx = sessionB.documentToScreenPosition(posB); 
            
            if (ev.editor == this.activeEditor) {
                if (posBx.row == screenPos.row && posAx.row != screenPos.row) {
                    if (ev.type == "mousedown") {
                        this.selectEditor(this.otherEditor);
                    }
                    ev.propagationStopped = true;
                    ev.defaultPrevented = true;
                    this.otherEditor.$mouseHandler.onMouseEvent(ev.type, ev.domEvent);
                } else if (ev.type == "mousedown") {
                    this.selectEditor(this.activeEditor);
                }
            }
        };
        
        
        var events = [
            "mousedown",
            "click",
            "mouseup",
            "dblclick",
            "tripleclick",
            "quadclick",
        ];
        events.forEach((event) => {
            this.activeEditor.on(event, forwardEvent, true);
            this.activeEditor.on("gutter" + event, forwardEvent, true);
        });

        var onFocus = (e) => {
            this.activeEditor.onFocus(e);
        };
        var onBlur = (e) => {
            this.activeEditor.onBlur(e);
        };
        this.otherEditor.on("focus", onFocus);
        this.otherEditor.on("blur", onBlur);

        this.onMouseDetach = () => {
            events.forEach((event) => {
                this.activeEditor.off(event, forwardEvent, true);
                this.activeEditor.off("gutter" + event, forwardEvent, true);
            });
            this.otherEditor.off("focus", onFocus);
            this.otherEditor.off("blur", onBlur);
        };
    }

    align() {
        var diffView = this;

        this.$initWidgets(diffView.editorA);
        this.$initWidgets(diffView.editorB);

        diffView.chunks.forEach(function (ch) {
            var diff1 = diffView.$screenRow(ch.old.end, diffView.sessionA)
                - diffView.$screenRow(ch.old.start, diffView.sessionA);
            var diff2 = diffView.$screenRow(ch.new.end, diffView.sessionB)
                - diffView.$screenRow(ch.new.start, diffView.sessionB);

            diffView.$addWidget(diffView.sessionA, {
                rowCount: diff2,
                rowsAbove: ch.old.end.row === 0 ? diff2 : 0,
                row: ch.old.end.row === 0 ? 0 : ch.old.end.row - 1
            });
            diffView.$addWidget(diffView.sessionB, {
                rowCount: diff1,
                rowsAbove: diff1,
                row: ch.new.start.row,
            });

        });
        diffView.sessionA["_emit"]("changeFold", {data: {start: {row: 0}}});
        diffView.sessionB["_emit"]("changeFold", {data: {start: {row: 0}}});
    }

    onChangeWrapLimit() {
        this.sessionB.adjustWrapLimit(this.sessionA.$wrapLimit);
        this.scheduleRealign();
    }

    $attachSessionsEventHandlers() {
        this.$attachSessionEventHandlers(this.editorA, this.markerA);
        this.$attachSessionEventHandlers(this.editorB, this.markerB);
        this.sessionA.on("changeWrapLimit", this.onChangeWrapLimit);
        this.sessionA.on("changeWrapMode", this.onChangeWrapLimit);
    }

    $attachSessionEventHandlers(editor, marker) {
        editor.session.on("changeFold", this.onChangeFold);
        editor.session.addDynamicMarker(marker);
        editor.selection.on("changeCursor", this.onSelect);
        editor.selection.on("changeSelection", this.onSelect);
    }

    $detachSessionsEventHandlers() {
        this.$detachSessionHandlers(this.editorA, this.markerA);
        this.$detachSessionHandlers(this.editorB, this.markerB);
        this.otherSession.bgTokenizer.lines.fill(undefined);
        this.sessionA.off("changeWrapLimit", this.onChangeWrapLimit);
        this.sessionA.off("changeWrapMode", this.onChangeWrapLimit);
    }

    $detachSessionHandlers(editor, marker) {
        editor.session.removeMarker(marker.id);
        editor.selection.off("changeCursor", this.onSelect);
        editor.selection.off("changeSelection", this.onSelect);
        editor.session.off("changeFold", this.onChangeFold);
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

        this.textLayer.element.textContent = "";
        this.textLayer.element.remove();
        this.gutterLayer.element.textContent = "";
        this.gutterLayer.element.remove();
        this.markerLayer.element.textContent = "";
        this.markerLayer.element.remove();

        this.onMouseDetach();

        this.selectEditor(this.activeEditor);
        this.clearSelectionMarkers();
        this.otherEditor.setSession(null);
        this.otherEditor.renderer.$loop = null;
        this.initTextInput(true);

        this.otherEditor.destroy();
    }

    /**
     * @param {number} changes
     * @param {import("ace-code").VirtualRenderer} renderer
     */
    onAfterRender(changes, renderer) {
        var config = renderer.layerConfig;

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
        
        cloneRenderer.$cursorLayer.config = newConfig;
        cloneRenderer.$cursorLayer.update(newConfig);

        if (changes & cloneRenderer.CHANGE_LINES
            || changes & cloneRenderer.CHANGE_FULL
            || changes & cloneRenderer.CHANGE_SCROLL
            || changes & cloneRenderer.CHANGE_TEXT
        )
            this.textLayer.update(newConfig);

        this.markerLayer.setMarkers(this.otherSession.getMarkers());
        this.markerLayer.update(newConfig);
    }
}

exports.InlineDiffView = InlineDiffView;
