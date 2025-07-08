const Text = require("./text").Text;

/**
 * @typedef TextMarker
 * @property {import("../../ace-internal").Ace.IRange} range
 * @property {number} id
 * @property {string} className
 */

const textMarkerMixin = {
    /**
     * @param {string} className
     * @this {Text}
     */
    $removeClass(className) {
        if (!this.element) return;
        const selectedElements = this.element.querySelectorAll('.' + className);
        for (let i = 0; i < selectedElements.length; i++) {
            selectedElements[i].classList.remove(className);
        }
    },
    /**
     * @this {Text}
     */
    $applyTextMarkers() {
        if (this.session.$scheduleForRemove) {
            this.session.$scheduleForRemove.forEach(className => {
                this.$removeClass(className);
            });

            this.session.$scheduleForRemove = new Set();
        }

        const textMarkers = this.session.getTextMarkers();

        if (textMarkers.length === 0) {
            return;
        }

        const classNameGroups = new Set();
        textMarkers.forEach(marker => {
            classNameGroups.add(marker.className);
        });

        classNameGroups.forEach(className => {
            this.$removeClass(className);
        });

        textMarkers.forEach((marker) => {
            for (let row = marker.range.start.row; row <= marker.range.end.row; row++) {
                const cell = this.$lines.cells.find((el) => el.row === row);

                if (cell) {
                    this.$modifyDomForMarkers(cell.element, row, marker);
                }
            }
        });
    },
    /**
     * @param {HTMLElement} lineElement
     * @param {number} row
     * @param {TextMarker} marker
     * @this {Text}
     */
    $modifyDomForMarkers(lineElement, row, marker) {
        const lineLength = this.session.getLine(row).length;
        let startCol = row > marker.range.start.row ? 0 : marker.range.start.column;
        let endCol = row < marker.range.end.row ? lineLength : marker.range.end.column;

        var lineElements = [];
        if (lineElement.classList.contains('ace_line_group')) {
            lineElements = Array.from(lineElement.childNodes);
        }
        else {
            lineElements = [lineElement];
        }

        var currentColumn = 0;
        lineElements.forEach((lineElement) => {
            const childNodes = Array.from(lineElement.childNodes);
            for (let i = 0; i < childNodes.length; i++) {
                let subChildNodes = [childNodes[i]];
                let parentNode = lineElement;
                if (childNodes[i].childNodes && childNodes[i].childNodes.length > 0) {
                    subChildNodes = Array.from(childNodes[i].childNodes);
                    parentNode = childNodes[i];
                }
                for (let j = 0; j < subChildNodes.length; j++) {
                    const node = subChildNodes[j];
                    const nodeText = node.textContent || '';
                    const contentLength = node["charCount"] || node.parentNode["charCount"] || nodeText.length;
                    const nodeStart = currentColumn;
                    const nodeEnd = currentColumn + contentLength;

                    if (node["charCount"] === 0 || contentLength === 0) {
                        continue;
                    }

                    if (nodeStart < endCol && nodeEnd > startCol) {
                        if (node.nodeType === 3) { //text node
                            const beforeSelection = Math.max(0, startCol - nodeStart);
                            const afterSelection = Math.max(0, nodeEnd - endCol);
                            const selectionLength = contentLength - beforeSelection - afterSelection;

                            if (beforeSelection > 0 || afterSelection > 0) {
                                const fragment = this.dom.createFragment(this.element);

                                if (beforeSelection > 0) {
                                    fragment.appendChild(
                                        this.dom.createTextNode(nodeText.substring(0, beforeSelection), this.element));
                                }

                                if (selectionLength > 0) {
                                    const selectedSpan = this.dom.createElement('span');
                                    selectedSpan.classList.add(marker.className);
                                    selectedSpan.textContent = nodeText.substring(
                                        beforeSelection,
                                        beforeSelection + selectionLength
                                    );
                                    fragment.appendChild(selectedSpan);
                                }

                                if (afterSelection > 0) {
                                    fragment.appendChild(
                                        this.dom.createTextNode(
                                            nodeText.substring(beforeSelection + selectionLength),
                                            this.element
                                        ));
                                }

                                parentNode.replaceChild(fragment, node);
                            }
                            else {
                                const selectedSpan = this.dom.createElement('span');
                                selectedSpan.classList.add(marker.className);
                                selectedSpan.textContent = nodeText;
                                selectedSpan["charCount"] = node["charCount"];
                                parentNode.replaceChild(selectedSpan, node);
                            }
                        }
                        else if (node.nodeType === 1) { //element node
                            if (nodeStart >= startCol && nodeEnd <= endCol) {
                                // @ts-ignore
                                node.classList.add(marker.className);
                            }
                            else {
                                const beforeSelection = Math.max(0, startCol - nodeStart);
                                const afterSelection = Math.max(0, nodeEnd - endCol);
                                const selectionLength = contentLength - beforeSelection - afterSelection;

                                if (beforeSelection > 0 || afterSelection > 0) {
                                    // @ts-ignore
                                    const nodeClasses = node.className;
                                    const fragment = this.dom.createFragment(this.element);

                                    if (beforeSelection > 0) {
                                        const beforeSpan = this.dom.createElement('span');
                                        beforeSpan.className = nodeClasses;
                                        beforeSpan.textContent = nodeText.substring(0, beforeSelection);
                                        fragment.appendChild(beforeSpan);
                                    }

                                    if (selectionLength > 0) {
                                        const selectedSpan = this.dom.createElement('span');
                                        selectedSpan.className = nodeClasses + ' ' + marker.className;
                                        selectedSpan.textContent = nodeText.substring(
                                            beforeSelection,
                                            beforeSelection + selectionLength
                                        );
                                        fragment.appendChild(selectedSpan);
                                    }

                                    if (afterSelection > 0) {
                                        const afterSpan = this.dom.createElement('span');
                                        afterSpan.className = nodeClasses;
                                        afterSpan.textContent = nodeText.substring(beforeSelection + selectionLength);
                                        fragment.appendChild(afterSpan);
                                    }

                                    parentNode.replaceChild(fragment, node);
                                }
                            }
                        }
                    }
                    currentColumn = nodeEnd;
                }
            }
        });
    }
};
Object.assign(Text.prototype, textMarkerMixin);

var EditSession = require("../edit_session").EditSession;
const editSessionTextMarkerMixin = {
    /**
     * Adds a text marker to the current edit session.
     *
     * @param {import("../../ace-internal").Ace.IRange} range - The range to mark in the document
     * @param {string} className - The CSS class name to apply to the marked text
     * @returns {number} The unique identifier for the added text marker
     *
     * @this {EditSession}
     */
    addTextMarker(range, className) {
        /**@type{number}*/
        this.$textMarkerId = this.$textMarkerId || 0;
        this.$textMarkerId++;
        var marker = {
            range: range,
            id: this.$textMarkerId,
            className: className
        };
        if (!this.$textMarkers) {
            this.$textMarkers = [];
        }
        this.$textMarkers[marker.id] = marker;
        return marker.id;
    },
    /**
     * Removes a text marker from the current edit session.
     *
     * @param {number} markerId - The unique identifier of the text marker to remove
     *
     * @this {EditSession}
     */
    removeTextMarker(markerId) {
        if (!this.$textMarkers) {
            return;
        }

        const marker = this.$textMarkers[markerId];
        if (!marker) {
            return;
        }
        if (!this.$scheduleForRemove) {
            this.$scheduleForRemove = new Set();
        }
        this.$scheduleForRemove.add(marker.className);
        delete this.$textMarkers[markerId];
    },
    /**
     * Retrieves the text markers associated with the current edit session.
     *
     * @returns {TextMarker[]} An array of text markers, or an empty array if no markers exist
     *
     * @this {EditSession}
     */
    getTextMarkers() {
        return this.$textMarkers || [];
    }
};
Object.assign(EditSession.prototype, editSessionTextMarkerMixin);


const onAfterRender = (e, renderer) => {
    renderer.$textLayer.$applyTextMarkers();
};

const Editor = require("../editor").Editor;
require("../config").defineOptions(Editor.prototype, "editor", {
    enableTextMarkers: {
        /**
         * @param {boolean} val
         * @this {Editor}
         */
        set: function (val) {
            if (val) {
                this.renderer.on("afterRender", onAfterRender);
            }
            else {
                this.renderer.off("afterRender", onAfterRender);
            }
        },
        value: true
    }
});

exports.textMarkerMixin = textMarkerMixin;
exports.editSessionTextMarkerMixin = editSessionTextMarkerMixin;