const Text = require("./text").Text;
var lang = require("../lib/lang");
/**
 * @typedef TextMarker
 * @property {import("../../ace-internal").Ace.IRange} range
 * @property {number} id
 * @property {string} className
 * @property {string} [type]
 */

/**
 * @typedef SelectionSegment
 * @property {number} beforeSelection - Characters before selection
 * @property {number} selectionLength - Length of selection
 * @property {number} afterSelection - Characters after selection
 */

const textMarkerMixin = {
    /**
     * @param {string} className
     * @this {Text}
     */
    $removeClass(className) {
        if (!this.element || !className) return;
        const selectedElements = this.element.querySelectorAll('.' + className);
        for (let i = 0; i < selectedElements.length; i++) {
            const element = selectedElements[i];
            element.classList.remove(className);

            if (element.hasAttribute('data-whitespace')) {
                const originalWhitespace = element.getAttribute('data-whitespace');
                const textNode = this.dom.createTextNode(originalWhitespace, this.element);
                textNode["charCount"] = element["charCount"];
                element.parentNode.replaceChild(textNode, element);
            }
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
     * Modifies the DOM for marker rendering.
     * @param {HTMLElement} lineElement - The line element to modify
     * @param {number} row - The row being processed
     * @param {TextMarker} marker - The marker to apply
     */
    $modifyDomForMarkers(lineElement, row, marker) {
        const lineLength = this.session.getLine(row).length;
        let startCol = row > marker.range.start.row ? 0 : marker.range.start.column;
        let endCol = row < marker.range.end.row ? lineLength : marker.range.end.column;
        if (startCol === endCol) {
            return;
        }

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
                    if (node.parentNode["charCount"]) {
                        node["charCount"] = node.parentNode["charCount"];
                    }
                    const contentLength = node["charCount"] || nodeText.length;
                    const nodeStart = currentColumn;
                    const nodeEnd = currentColumn + contentLength;

                    if (node["charCount"] === 0 || contentLength === 0) {
                        continue;
                    }

                    if (nodeStart < endCol && nodeEnd > startCol) {
                        const beforeSelection = Math.max(0, startCol - nodeStart);
                        const afterSelection = Math.max(0, nodeEnd - endCol);
                        const selectionLength = contentLength - beforeSelection - afterSelection;

                        if (marker.type === "invisible") {
                            this.$processInvisibleMarker(node, parentNode, {
                                beforeSelection,
                                selectionLength,
                                afterSelection
                            }, marker);
                        }
                        else {
                            this.$processRegularMarker(node, parentNode, {
                                beforeSelection,
                                selectionLength,
                                afterSelection
                            }, marker, nodeStart, startCol, endCol);
                        }
                    }
                    currentColumn = nodeEnd;
                }
            }
        });
    },

    /**
     * Process text nodes for invisible markers (whitespace visualization)
     * @param {Node} node - The DOM node to process
     * @param {Node} parentNode - The parent node
     * @param {SelectionSegment} selectionSegment
     * @param {object} marker - The marker being applied
     */
    $processInvisibleMarker(node, parentNode, selectionSegment, marker) {
        const nodeText = node.textContent || '';
        if (node.nodeType === 3) { // Text node
            const fragment = this.dom.createFragment(this.element);

            if (selectionSegment.beforeSelection > 0) {
                fragment.appendChild(
                    this.dom.createTextNode(nodeText.substring(0, selectionSegment.beforeSelection), this.element));
            }

            if (selectionSegment.selectionLength > 0) {
                const selectedText = selectionSegment.beforeSelection === 0 && selectionSegment.afterSelection === 0
                    ? nodeText : nodeText.substring(
                        selectionSegment.beforeSelection,
                        selectionSegment.beforeSelection + selectionSegment.selectionLength
                    );

                const segments = selectedText.match(/\s+|[^\s]+/g) || [];

                for (let k = 0; k < segments.length; k++) {
                    const segment = segments[k];
                    let span;
                    if (/^\s+$/.test(segment)) {
                        span = this.dom.createElement("span");
                        span.className = marker.className;
                        const symbol = node["charCount"] ? this.TAB_CHAR : this.SPACE_CHAR;
                        span.textContent = lang.stringRepeat(symbol, segment.length);
                        span.setAttribute("data-whitespace", segment);
                        fragment.appendChild(span);
                    }
                    else {
                        span = this.dom.createElement("span");
                        span.textContent = segment;
                    }
                    if (node["charCount"] && segments.length === 1) { //this is for real tabs
                        span["charCount"] = node["charCount"];
                    }
                    fragment.appendChild(span);
                }
            }

            if (selectionSegment.afterSelection > 0) {
                fragment.appendChild(this.dom.createTextNode(
                    nodeText.substring(selectionSegment.beforeSelection + selectionSegment.selectionLength),
                    this.element
                ));
            }

            parentNode.replaceChild(fragment, node);
        }
        else if (node.nodeType === 1) { // Element node
            const nodeText = node.textContent || '';
            const segments = nodeText.match(/\s+|[^\s]+/g) || [];

            if (segments.length > 1) {
                // @ts-ignore
                const nodeClasses = node.className;
                const fragment = this.dom.createFragment(this.element);

                for (let k = 0; k < segments.length; k++) {
                    const segment = segments[k];

                    if (/^\s+$/.test(segment)) {
                        const span = this.dom.createElement("span");
                        span.className = nodeClasses + marker.className;
                        span.textContent = lang.stringRepeat(this.SPACE_CHAR, segment.length);
                        span.setAttribute("data-whitespace", segment);
                        fragment.appendChild(span);
                    }
                    else {
                        const span = this.dom.createElement("span");
                        span.className = nodeClasses;
                        span.textContent = segment;
                        fragment.appendChild(span);
                    }
                }

                parentNode.replaceChild(fragment, node);
            }
        }
    },

    /**
     * Process nodes for regular markers (not invisible whitespace)
     * @param {Node} node - The DOM node to process
     * @param {Node} parentNode - The parent node
     * @param {SelectionSegment} selectionSegment
     * @param {TextMarker} marker - The marker being applied
     * @param {number} nodeStart - Starting column of the node
     * @param {number} startCol - Starting column of the selection
     * @param {number} endCol - Ending column of the selection
     */
    $processRegularMarker(node, parentNode, selectionSegment, marker, nodeStart, startCol, endCol) {
        const nodeText = node.textContent || '';
        if (node.nodeType === 3) { // Text node
            if (selectionSegment.beforeSelection > 0 || selectionSegment.afterSelection > 0) {
                const fragment = this.dom.createFragment(this.element);

                if (selectionSegment.beforeSelection > 0) {
                    fragment.appendChild(
                        this.dom.createTextNode(nodeText.substring(0, selectionSegment.beforeSelection), this.element));
                }

                if (selectionSegment.selectionLength > 0) {
                    const selectedSpan = this.dom.createElement('span');
                    selectedSpan.classList.add(marker.className);
                    selectedSpan.textContent = nodeText.substring(
                        selectionSegment.beforeSelection,
                        selectionSegment.beforeSelection + selectionSegment.selectionLength
                    );
                    fragment.appendChild(selectedSpan);
                }

                if (selectionSegment.afterSelection > 0) {
                    fragment.appendChild(this.dom.createTextNode(
                        nodeText.substring(selectionSegment.beforeSelection + selectionSegment.selectionLength),
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
        else if (node.nodeType === 1) { // Element node
            if (nodeStart >= startCol && nodeStart + (nodeText.length || 0) <= endCol) {
                // @ts-ignore
                node.classList.add(marker.className);
            }
            else {
                if (selectionSegment.beforeSelection > 0 || selectionSegment.afterSelection > 0) {
                    // @ts-ignore
                    const nodeClasses = node.className;
                    const fragment = this.dom.createFragment(this.element);

                    if (selectionSegment.beforeSelection > 0) {
                        const beforeSpan = this.dom.createElement('span');
                        beforeSpan.className = nodeClasses;
                        beforeSpan.textContent = nodeText.substring(0, selectionSegment.beforeSelection);
                        fragment.appendChild(beforeSpan);
                    }

                    if (selectionSegment.selectionLength > 0) {
                        const selectedSpan = this.dom.createElement('span');
                        selectedSpan.className = nodeClasses + ' ' + marker.className;
                        selectedSpan.textContent = nodeText.substring(
                            selectionSegment.beforeSelection,
                            selectionSegment.beforeSelection + selectionSegment.selectionLength
                        );
                        fragment.appendChild(selectedSpan);
                    }

                    if (selectionSegment.afterSelection > 0) {
                        const afterSpan = this.dom.createElement('span');
                        afterSpan.className = nodeClasses;
                        afterSpan.textContent = nodeText.substring(selectionSegment.beforeSelection + selectionSegment.selectionLength);
                        fragment.appendChild(afterSpan);
                    }

                    parentNode.replaceChild(fragment, node);
                }
            }
        }
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
     * @param {string} [type] - The type of marker (e.g. "invisible" for whitespace rendering)
     * @returns {number} The unique identifier for the added text marker
     *
     * @this {EditSession}
     */
    addTextMarker(range, className, type) {
        /**@type{number}*/
        this.$textMarkerId = this.$textMarkerId || 0;
        this.$textMarkerId++;
        var marker = {
            range: range,
            id: this.$textMarkerId,
            className: className,
            type: type
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