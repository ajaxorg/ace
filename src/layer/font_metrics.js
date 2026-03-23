var oop = require("../lib/oop");
var dom = require("../lib/dom");
var lang = require("../lib/lang");
var event = require("../lib/event");
var useragent = require("../lib/useragent");
var EventEmitter = require("../lib/event_emitter").EventEmitter;

var CHAR_COUNT = 512;
var USE_OBSERVER = typeof ResizeObserver == "function";
var L = 200;

class FontMetrics {

    /**
     * @param {HTMLElement} parentEl
     */
    constructor(parentEl, textLayer) {
        this.config = {characterWidth: 1};
        this.$characterSize = {width: 0, height: 0};
        this.textLayer = textLayer;

        this.el = dom.createElement("div");
        this.$setMeasureNodeStyles(this.el.style, true);

        this.$main = dom.createElement("div");
        this.$setMeasureNodeStyles(this.$main.style);

        this.$measureNode = dom.createElement("div");
        this.$setMeasureNodeStyles(this.$measureNode.style);


        this.el.appendChild(this.$main);
        this.el.appendChild(this.$measureNode);
        parentEl.appendChild(this.el);

        this.$measureNode.textContent = lang.stringRepeat("X", CHAR_COUNT);

        if (USE_OBSERVER)
            this.$addObserver();
        else
            this.checkForSizeChanges();

        this.textLayer.$setFontMetrics(this);
    }
    
    $setMeasureNodeStyles(style, isRoot) {
        style.width = style.height = "auto";
        style.left = style.top = "0px";
        style.visibility = "hidden";
        style.position = "absolute";
        style.whiteSpace = "pre";

        if (useragent.isIE < 8) {
            style["font-family"] = "inherit";
        } else {
            style.font = "inherit";
        }
        style.overflow = isRoot ? "hidden" : "visible";
    }

    /**
     * @param {{height: number, width: number} | null} [size]
     */
    checkForSizeChanges(size) {
        if (size === undefined)
            size = this.$measureSizes();
        if (size && (this.$characterSize.width !== size.width || this.$characterSize.height !== size.height)) {
            this.$measureNode.style.fontWeight = "bold";
            var boldSize = this.$measureSizes();
            this.$measureNode.style.fontWeight = "";
            this.$characterSize = size;
            this.charSizes = Object.create(null);
            this.allowBoldFonts = boldSize && boldSize.width === size.width && boldSize.height === size.height;
            this._emit("changeCharacterSize", {data: size});
        }
    }

    $addObserver() {
        var self = this;
        this.$observer = new window.ResizeObserver(function(e) {
            // e[0].contentRect is broken on safari when zoomed;
            self.checkForSizeChanges();
        });
        this.$observer.observe(this.$measureNode);
    }

    /**
     * @return {number}
     */
    $pollSizeChanges() {
        if (this.$pollSizeChangesTimer || this.$observer)
            return this.$pollSizeChangesTimer;
        var self = this;
        
        return this.$pollSizeChangesTimer = event.onIdle(function cb() {
            self.checkForSizeChanges();
            event.onIdle(cb, 500);
        }, 500);
    }

    /**
     * @param {boolean} val
     */
    setPolling(val) {
        if (val) {
            this.$pollSizeChanges();
        } else if (this.$pollSizeChangesTimer) {
            clearInterval(this.$pollSizeChangesTimer);
            this.$pollSizeChangesTimer = 0;
        }
    }

    $measureSizes(node) {
        var size = {
            height: (node || this.$measureNode).clientHeight,
            width: (node || this.$measureNode).clientWidth / CHAR_COUNT
        };
        
        // Size and width can be null if the editor is not visible or
        // detached from the document
        if (size.width === 0 || size.height === 0)
            return null;
        return size;
    }

    $measureCharWidth(ch) {
        this.$main.textContent = lang.stringRepeat(ch, CHAR_COUNT);
        var rect = this.$main.getBoundingClientRect();
        return rect.width / CHAR_COUNT;
    }
    
    getCharacterWidth(ch) {
        var w = this.charSizes[ch];
        if (w === undefined) {
            w = this.charSizes[ch] = this.$measureCharWidth(ch) / this.$characterSize.width;
        }
        return w;
    }

    destroy() {
        clearInterval(this.$pollSizeChangesTimer);
        if (this.$observer)
            this.$observer.disconnect();
        if (this.el && this.el.parentNode)
            this.el.parentNode.removeChild(this.el);
    }

    
    $getZoom(element) {
        if (!element || !element.parentElement) return 1;
        return (Number(window.getComputedStyle(element)["zoom"]) || 1) * this.$getZoom(element.parentElement);
    }
    
    $initTransformMeasureNodes() {
        var t = function(t, l) {
            return ["div", {
                style: "position: absolute;top:" + t + "px;left:" + l + "px;"
            }];
        };
        this.els = dom.buildDom([t(0, 0), t(L, 0), t(0, L), t(L, L)], this.el);
    }
    // general transforms from element coordinates x to screen coordinates u have the form
    // | m1[0] m2[0] t[0] |   | x |       | u |
    // | m1[1] m2[1] t[1] | . | y |  == k | v |
    // | h[0]  h[1]  1    |   | 1 |       | 1 |
    // this function finds the coeeficients of the matrix using positions of four points
    //  
    transformCoordinates(clientPos, elPos) {
        if (clientPos) {
            var zoom = this.$getZoom(this.el);
            clientPos = mul(1 / zoom, clientPos);
        }
        function solve(l1, l2, r) {
            var det = l1[1] * l2[0] - l1[0] * l2[1];
            return [
                (-l2[1] * r[0] + l2[0] * r[1]) / det,
                (+l1[1] * r[0] - l1[0] * r[1]) / det
            ];
        }
        function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
        function add(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
        function mul(a, b) { return [a * b[0], a * b[1]]; }

        if (!this.els)
            this.$initTransformMeasureNodes();
        
        function p(el) {
            var r = el.getBoundingClientRect();
            return [r.left, r.top];
        }

        var a = p(this.els[0]);
        var b = p(this.els[1]);
        var c = p(this.els[2]);
        var d = p(this.els[3]);

        var h = solve(sub(d, b), sub(d, c), sub(add(b, c), add(d, a)));

        var m1 = mul(1 + h[0], sub(b, a));
        var m2 = mul(1 + h[1], sub(c, a));
        
        if (elPos) {
            var x = elPos;
            var k = h[0] * x[0] / L + h[1] * x[1] / L + 1;
            var ut = add(mul(x[0], m1), mul(x[1], m2));
            return  add(mul(1 / k / L, ut), a);
        }
        var u = sub(clientPos, a);
        var f = solve(sub(m1, mul(h[0], u)), sub(m2, mul(h[1], u)), u);
        return mul(L, f);
    }

    /**
     * Finds and returns the DOM element corresponding to a given screen row.
     *
     * @param {number} screenRow - The screen row number for which to find the element.
     * @returns {HTMLElement|null} The DOM element corresponding to the screen row, or null if not found.
     */
    $findElementForScreenRow(screenRow) {
        var textLayer = this.textLayer;
        if (!this.config) return null; // not initialized yet
        var data = textLayer.$lines.$getCellByScreenRow(screenRow, this.config);
        var lineElement = data && data.cell.element;

        if (lineElement && textLayer.$useLineGroups()) {
            var index = Math.floor(data.offset / this.config.lineHeight);
            lineElement =  lineElement.children[Math.max(index, 0)];
        }
        return lineElement;
    }
    
    /**
     * Calculates the width of the text up to a specific scrrenColumn on a given screen row.
     *
     * @param {number} screenRow - The row index on the screen for which the text width is calculated.
     * @param {number} screenColumn - The column index up to which the text width is measured.
     * @returns {number} The width of the text in pixels up to the specified column.
     */
    textWidth(screenRow, screenColumn) {
        var lineElement = this.$findElementForScreenRow(screenRow);
        if (!lineElement || !document.createRange) {
            // Fallback for lines not currently rendered
            return screenColumn * this.config.characterWidth;
        }
        return this.$measureLineToColumn(lineElement, screenColumn);
    }

    /**
     * Measures the horizontal position (in pixels) of a specific screen column
     * within a given line element. This method calculates the pixel offset
     * from the left edge of the text layer's container to the specified column.
     *
     * @param {HTMLElement} lineElement - The DOM element representing the line of text.
     * @param {number} screenColumn - The screen column index to measure.
     * @returns {number} The horizontal position (in pixels) of the specified column
     * relative to the left edge of the text layer's container. If the position cannot
     * be determined, it falls back to an approximation based on the character width.
     */
    $measureLineToColumn(lineElement, screenColumn) {
        var textLayer = this.textLayer;
        if (!this.$scratchRange) {
            this.$scratchRange = document.createRange();
        }

        try {
            var position = this.$findColumnPosition(lineElement, screenColumn);
            if (!position) {
                return screenColumn * this.config.characterWidth;
            }

            this.$scratchRange.setStart(position.node, position.offset);
            this.$scratchRange.setEnd(position.node, position.offset);

            var rangeRect = this.$scratchRange.getBoundingClientRect();
            var rect = textLayer.element.getBoundingClientRect(); 
            return rangeRect.left - rect.left + position.overflow * this.config.characterWidth;
        } catch (e) {
            console.error("Error measuring text width:", e);
            return screenColumn * this.config.characterWidth;
        }
    }

    /**
     * Finds the position of a specific column within a line element.
     *
     * This method traverses the text nodes within the given line element to locate
     * the node and offset corresponding to the specified screen column. If the
     * column exceeds the total length of the text, it returns the last node and its length.
     *
     * @param {HTMLElement} lineElement - The DOM element representing the line of text.
     * @param {number} screenColumn - The target column position within the line (0-based).
     * @returns {{node: Node, offset: number, overflow: number} | null} An object containing the text node and the offset
     * within that node corresponding to the column position, or `null` if no nodes are found.
     */
    $findColumnPosition(lineElement, screenColumn) {
        var walker = document.createTreeWalker(lineElement, NodeFilter.SHOW_TEXT, null);

        var currentColumn = 0;
        var node, lastNode;

        while (node = walker.nextNode()) {
            var nodeText = node.nodeValue;
            var nodeLength = nodeText.length;

            if (currentColumn + nodeLength >= screenColumn) {
                return {
                    node: node,
                    offset: screenColumn - currentColumn,
                    overflow: 0
                };
            }
            currentColumn += nodeLength;
            lastNode = node;
        }
        
        return lastNode && {
            node: lastNode,
            offset: lastNode.nodeValue.length,
            overflow: screenColumn - currentColumn,
        };
    }

    /**
     * Converts a pixel position (x-coordinate) to a screen column index within a given row.
     *
     * @param {number} screenRow - The row index on the screen.
     * @param {number} screenColumn1 - The initial screen column index.
     * @param {number} x - The x-coordinate (in pixels) to convert to a column index.
     * @param {boolean} blockCursor - Whether the cursor is in block mode.
     * @returns {number} The calculated screen column index corresponding to the x-coordinate.
     */
    $pixelToColumn(screenRow, screenColumn1, x, blockCursor) {
        var scratchRange = this.$scratchRange;
        var lineElement = this.$findElementForScreenRow(screenRow);
        if (!lineElement) return screenColumn1;

        var screenColumn = 0;
        function getRects(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                scratchRange.setStart(node, 0);
                scratchRange.setEnd(node, node.nodeValue.length);
                return scratchRange.getClientRects();
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                return node.getClientRects();
            }
            return [];
        }
        function search(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                var textLength = node.nodeValue.length;
                for (var j = 0; j < textLength; j++) {
                    scratchRange.setStart(node, j);
                    scratchRange.setEnd(node, j + 1);
                    let rect = scratchRange.getBoundingClientRect();
                    if (rect.left <= x && x <= rect.right) {
                        screenColumn += j;
                        if (!blockCursor && x > rect.left + rect.width / 2) {
                            screenColumn++;
                        }
                        return screenColumn;
                    }
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                var childNodes = node.childNodes;

                for (var i = 0; i < childNodes.length; i++) {
                    var child = childNodes[i];
                    var rects = getRects(child);
                    for (var j = 0; j < rects.length; j++) {
                        let rect = rects[j];
                        if (rect.left < x && x < rect.left + rect.width) {
                            search(child);
                            return screenColumn;
                        }
                    }
                    screenColumn += child.nodeType === Node.TEXT_NODE ? child.nodeValue.length : child.textContent.length;
                }
            }
        }
        search(lineElement);

        return screenColumn;
    } 

    /**
     * Calculates and returns an array of rectangles representing the visual positions
     * of a range of text between two screen positions within a text layer.
     *
     * @param {Object} startScreenPos - The starting screen position of the range.
     * @param {number} startScreenPos.row - The row index of the starting position.
     * @param {number} startScreenPos.column - The column index of the starting position.
     * @param {Object} endScreenPos - The ending screen position of the range.
     * @param {number} endScreenPos.row - The row index of the ending position.
     * @param {number} endScreenPos.column - The column index of the ending position.
     * @returns {Array<Object>} An array of rectangle objects representing the visual
     * positions of the text range. Each rectangle object contains:
     *   - `left` {number}: The left offset of the rectangle relative to the text layer.
     *   - `width` {number}: The width of the rectangle.
     * If an error occurs or the line element is not found, a fallback rectangle is returned
     * based on character width and column positions.
     */
    getRects(startScreenPos, endScreenPos) {
        var row = startScreenPos.row;
        var textLayer = this.textLayer;
        var lineElement = this.$findElementForScreenRow(row);

        if (lineElement) {
            try {
                var p1 = this.$findColumnPosition(lineElement, startScreenPos.column);
                var p2 = this.$findColumnPosition(lineElement, endScreenPos.column);
                if (p1 && p2) {
                    this.$scratchRange.setStart(p1.node, p1.offset);
                    this.$scratchRange.setEnd(p2.node, p2.offset);
                    var rangeRects = this.$scratchRange.getClientRects();
                    var rect = textLayer.element.getBoundingClientRect();
                    var merged = mergeTouchingRects(rangeRects).map(function(r) {
                        return {
                            left: r.left - rect.left,
                            width: r.right - r.left,
                        };
                    });
                    return merged;
                }
            } catch (e) {
                console.error("Error measuring text width:", e); 
            }
        }
        return [{
            left: startScreenPos.column * this.config.characterWidth,
            width: (endScreenPos.column - startScreenPos.column) * this.config.characterWidth,
        }];
    }
}


function mergeTouchingRects(rects) {
    var merged = [];
    for (var i = 0; i < rects.length; i++) {
        var rect = rects[i];
        var found = false;
        for (var j = 0; j < merged.length; j++) {
            var m = merged[j];
            if (
                (m.left <= rect.left && rect.left <= m.right) ||
                (m.left <= rect.right && rect.right <= m.right) ||
                (rect.left <= m.left && m.right <= rect.right)
            ) {
                m.left = Math.min(m.left, rect.left);
                m.right = Math.max(m.right, rect.right);
                found = true;
                break;
            }
        }
        if (!found) {
            merged.push({
                left: rect.left,
                right: rect.right,
                top: rect.top,
                height: rect.height,
            });
        }
    }
    return merged;
} 
 

oop.implement(FontMetrics.prototype, EventEmitter);

exports.FontMetrics = FontMetrics;
