/**
 * ## Show whitespaces in the current selection
 *
 * This extension adds a configuration option `showWhitespacesInSelection` to the editor
 * that highlights whitespaces within the current selection. When enabled, it adds a
 * marker to the selection that makes whitespaces visible.
 */

"use strict";

require("../layer/text_markers");
const Editor = require("../editor").Editor;
const config = require("../config");
const dom = require("../lib/dom");
const whitespacesCss = require("./whitespaces_in_selection-css");
dom.importCssString(whitespacesCss, "ace_whitespaces_in_selection", false);

config.defineOptions(Editor.prototype, "editor", {
    showWhitespacesInSelection: {
        set: function(val) {
            this.$showWhitespacesInSelection = val;

            if (!this.$boundChangeSelectionForWhitespace) {
                this.$boundChangeSelectionForWhitespace = $onChangeSelectionForWhitespace.bind(this);
            }

            if (val) {
                this.on("changeSelection", this.$boundChangeSelectionForWhitespace);
            } else {
                this.off("changeSelection", this.$boundChangeSelectionForWhitespace);

                if (this.session && this.session.$invisibleMarkerId) {
                    this.session.removeTextMarker(this.session.$invisibleMarkerId);
                    this.session.$invisibleMarkerId = null;
                }
            }
        },
        get: function() {
            return this.$showWhitespacesInSelection;
        },
        initialValue: false
    }
});

function $onChangeSelectionForWhitespace() {
    let invisibleMarkerId = this.session.$invisibleMarkerId;
    if (invisibleMarkerId) {
        this.session.removeTextMarker(invisibleMarkerId);
        this.session.$invisibleMarkerId = null;
    }

    var currentRange = this.selection.getRange();
    if (!currentRange.isEmpty()) {
        this.session.$invisibleMarkerId = this.session.addTextMarker(
            currentRange,
            "ace_whitespaces_in_selection",
            "invisible"
        );
    }
}