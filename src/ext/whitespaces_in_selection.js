/**
 * ## Show whitespaces in the current selection
 *
 * This extension adds a configuration option `showWhitespacesInSelection` to the editor
 * that highlights whitespaces within the current selection. When enabled, it adds a
 * marker to the selection that makes whitespaces visible.
 */

"use strict";

require("../layer/text_markers");
var Editor = require("../editor").Editor;
var config = require("../config");
var dom = require("../lib/dom");

dom.importCssString(`
.ace_whitespaces_in_selection {
    color: rgba(0,0,0,0.29) !important;
}

.ace_dark .ace_whitespaces_in_selection {
    color: rgba(187, 181, 181, 0.5) !important;
}
`, "ace_whitespaces_in_selection", false);

config.defineOptions(Editor.prototype, "editor", {
    showWhitespacesInSelection: {
        set: function(val) {
            this.$showWhitespacesInSelection = val;

            if (val) {
                if (!this.$boundChangeSelectionForWhitespace) {
                    this.$boundChangeSelectionForWhitespace = $onChangeSelectionForWhitespace.bind(this);
                }
                this.on("changeSelection", this.$boundChangeSelectionForWhitespace);
                $setRenderWhitespaceMarkers(this, true);
            } else {
                this.off("changeSelection", this.$boundChangeSelectionForWhitespace);

                $removeWhitespaceMarkers(this.session);

                this.$boundChangeSelectionForWhitespace = null;
                $setRenderWhitespaceMarkers(this, false);
            }
        },
        get: function() {
            return this.$showWhitespacesInSelection;
        },
        initialValue: false
    }
});

function $setRenderWhitespaceMarkers(editor, render) {
    var textLayer = editor.renderer && editor.renderer.$textLayer;
    if (!textLayer || typeof textLayer.setRenderWhitespaceMarkers !== "function")
        return;

    textLayer.setRenderWhitespaceMarkers(render);
    editor.renderer.updateText();
}

function $removeWhitespaceMarkers(session) {
    if (!session) return;

    var invisibleMarkerIds = session.$invisibleMarkerIds || [];
    for (var i = 0; i < invisibleMarkerIds.length; i++) {
        session.removeTextMarker(invisibleMarkerIds[i]);
    }
    session.$invisibleMarkerIds = [];
}

function $onChangeSelectionForWhitespace() {
    $removeWhitespaceMarkers(this.session);

    var ranges = typeof this.selection.getAllRanges === "function" ? this.selection.getAllRanges()
        : [this.selection.getRange()];

    for (var j = 0; j < ranges.length; j++) {
        if (!ranges[j].isEmpty()) {
            this.session.$invisibleMarkerIds.push(
                this.session.addTextMarker(ranges[j], "ace_whitespaces_in_selection", "invisible"));
        }
    }
}
