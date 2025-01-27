/* This file is generated using `npm run update-types` */

declare module "ace-code/src/layer/font_metrics" {
    export class FontMetrics {
        constructor(parentEl: HTMLElement);
        el: HTMLDivElement;
        checkForSizeChanges(size: any): void;
        charSizes: any;
        allowBoldFonts: boolean;
        setPolling(val: boolean): void;
        getCharacterWidth(ch: any): any;
        destroy(): void;
        els: any[] | HTMLElement | Text;
        transformCoordinates(clientPos: any, elPos: any): any[];
    }
    namespace Ace {
        type EventEmitter<T extends {
            [K in keyof T]: (...args: any[]) => any;
        }> = import("ace-code").Ace.EventEmitter<T>;
    }
    export interface FontMetrics extends Ace.EventEmitter<any> {
    }
}
declare module "ace-code/src/apply_delta" {
    export function applyDelta(docLines: string[], delta: import("ace-code").Ace.Delta, doNotValidate?: any): void;
}
declare module "ace-code/src/document" {
    /**
     * Contains the text of the document. Document can be attached to several [[EditSession `EditSession`]]s.
     * At its core, `Document`s are just an array of strings, with each row in the document matching up to the array index.
     **/
    export class Document {
        /**
         *
         * Creates a new `Document`. If `text` is included, the `Document` contains those strings; otherwise, it's empty.
         * @param {String | String[]} textOrLines text The starting text
         **/
        constructor(textOrLines: string | string[]);
        /**
         * Replaces all the lines in the current `Document` with the value of `text`.
         *
         * @param {String} text The text to use
         **/
        setValue(text: string): void;
        /**
         * Returns all the lines in the document as a single string, joined by the new line character.
         **/
        getValue(): string;
        /**
         * Creates a new `Anchor` to define a floating point in the document.
         * @param {Number} row The row number to use
         * @param {Number} column The column number to use
         **/
        createAnchor(row: number, column: number): Anchor;
        /**
         * Returns the newline character that's being used, depending on the value of `newLineMode`.
         * @returns {String} If `newLineMode == windows`, `\r\n` is returned.
         *  If `newLineMode == unix`, `\n` is returned.
         *  If `newLineMode == auto`, the value of `autoNewLine` is returned.
         *
         **/
        getNewLineCharacter(): string;
        /**
         * [Sets the new line mode.]{: #Document.setNewLineMode.desc}
         * @param {NewLineMode} newLineMode [The newline mode to use; can be either `windows`, `unix`, or `auto`]
         **/
        setNewLineMode(newLineMode: NewLineMode): void;
        /**
         * Returns the type of newlines being used; either `windows`, `unix`, or `auto`
         **/
        getNewLineMode(): NewLineMode;
        /**
         * Returns `true` if `text` is a newline character (either `\r\n`, `\r`, or `\n`).
         * @param {String} text The text to check
         **/
        isNewLine(text: string): boolean;
        /**
         * Returns a verbatim copy of the given line as it is in the document
         * @param {Number} row The row index to retrieve
         **/
        getLine(row: number): string;
        /**
         * Returns an array of strings of the rows between `firstRow` and `lastRow`. This function is inclusive of `lastRow`.
         * @param {Number} firstRow The first row index to retrieve
         * @param {Number} lastRow The final row index to retrieve
         **/
        getLines(firstRow: number, lastRow: number): string[];
        /**
         * Returns all lines in the document as string array.
         **/
        getAllLines(): string[];
        /**
         * Returns the number of rows in the document.
         **/
        getLength(): number;
        /**
         * Returns all the text within `range` as a single string.
         * @param {IRange} range The range to work with.
         *
         **/
        getTextRange(range: IRange): string;
        /**
         * Returns all the text within `range` as an array of lines.
         * @param {IRange} range The range to work with.
         *
         **/
        getLinesForRange(range: IRange): string[];
        /**
         * @deprecated
         */
        insertLines(row: any, lines: any): void;
        /**
         * @deprecated
         */
        removeLines(firstRow: any, lastRow: any): string[];
        /**
         * @deprecated
         */
        insertNewLine(position: any): Point;
        /**
         * Inserts a block of `text` at the indicated `position`.
         * @param {Point} position The position to start inserting at; it's an object that looks like `{ row: row, column: column}`
         * @param {String} text A chunk of text to insert
         * @returns {Point} The position ({row, column}) of the last line of `text`. If the length of `text` is 0, this function simply returns `position`.
         **/
        insert(position: Point, text: string): Point;
        /**
         * Inserts `text` into the `position` at the current row. This method also triggers the `"change"` event.
         *
         * This differs from the `insert` method in two ways:
         *   1. This does NOT handle newline characters (single-line text only).
         *   2. This is faster than the `insert` method for single-line text insertions.
         *
         * @param {Point} position The position to insert at; it's an object that looks like `{ row: row, column: column}`
         * @param {String} text A chunk of text without new lines
         * @returns {Point} Returns the position of the end of the inserted text
         **/
        insertInLine(position: Point, text: string): Point;
        clippedPos(row: number, column: number): Point;
        clonePos(pos: Point): Point;
        pos(row: number, column: number): Point;
        /**
         * Inserts the elements in `lines` into the document as full lines (does not merge with existing line), starting at the row index given by `row`. This method also triggers the `"change"` event.
         * @param {Number} row The index of the row to insert at
         * @param {string[]} lines An array of strings
         **/
        insertFullLines(row: number, lines: string[]): void;
        /**
         * Inserts the elements in `lines` into the document, starting at the position index given by `row`. This method also triggers the `"change"` event.
         * @param {string[]} lines An array of strings
         * @returns {Point} Contains the final row and column, like this:
         *   ```
         *   {row: endRow, column: 0}
         *   ```
         *   If `lines` is empty, this function returns an object containing the current row, and column, like this:
         *   ```
         *   {row: row, column: 0}
         *   ```
         **/
        insertMergedLines(position: Point, lines: string[]): Point;
        /**
         * Removes the `range` from the document.
         * @param {IRange} range A specified Range to remove
         * @returns {Point} Returns the new `start` property of the range, which contains `startRow` and `startColumn`. If `range` is empty, this function returns the unmodified value of `range.start`.
         **/
        remove(range: IRange): Point;
        /**
         * Removes the specified columns from the `row`. This method also triggers a `"change"` event.
         * @param {Number} row The row to remove from
         * @param {Number} startColumn The column to start removing at
         * @param {Number} endColumn The column to stop removing at
         * @returns {Point} Returns an object containing `startRow` and `startColumn`, indicating the new row and column values.<br/>If `startColumn` is equal to `endColumn`, this function returns nothing.
         **/
        removeInLine(row: number, startColumn: number, endColumn: number): Point;
        /**
         * Removes a range of full lines. This method also triggers the `"change"` event.
         * @param {Number} firstRow The first row to be removed
         * @param {Number} lastRow The last row to be removed
         * @returns {String[]} Returns all the removed lines.
         **/
        removeFullLines(firstRow: number, lastRow: number): string[];
        /**
         * Removes the new line between `row` and the row immediately following it. This method also triggers the `"change"` event.
         * @param {Number} row The row to check
         *
         **/
        removeNewLine(row: number): void;
        /**
         * Replaces a range in the document with the new `text`.
         * @param {Range | IRange} range A specified Range to replace
         * @param {String} text The new text to use as a replacement
         * @returns {Point} Returns an object containing the final row and column, like this:
         *     {row: endRow, column: 0}
         * If the text and range are empty, this function returns an object containing the current `range.start` value.
         * If the text is the exact same as what currently exists, this function returns an object containing the current `range.end` value.
         *
         **/
        replace(range: Range | IRange, text: string): Point;
        /**
         * Applies all changes in `deltas` to the document.
         * @param {Delta[]} deltas An array of delta objects (can include "insert" and "remove" actions)
         **/
        applyDeltas(deltas: Delta[]): void;
        /**
         * Reverts all changes in `deltas` from the document.
         * @param {Delta[]} deltas An array of delta objects (can include "insert" and "remove" actions)
         **/
        revertDeltas(deltas: Delta[]): void;
        /**
         * Applies `delta` to the document.
         * @param {Delta} delta A delta object (can include "insert" and "remove" actions)
         **/
        applyDelta(delta: Delta, doNotValidate?: boolean): void;
        /**
         * Reverts `delta` from the document.
         * @param {Delta} delta A delta object (can include "insert" and "remove" actions)
         **/
        revertDelta(delta: Delta): void;
        /**
         * Converts an index position in a document to a `{row, column}` object.
         *
         * Index refers to the "absolute position" of a character in the document. For example:
         *
         * ```javascript
         * var x = 0; // 10 characters, plus one for newline
         * var y = -1;
         * ```
         *
         * Here, `y` is an index 15: 11 characters for the first row, and 5 characters until `y` in the second.
         *
         * @param {Number} index An index to convert
         * @param {Number} [startRow=0] The row from which to start the conversion
         * @returns {Point} A `{row, column}` object of the `index` position
         */
        indexToPosition(index: number, startRow?: number): Point;
        /**
         * Converts the `{row, column}` position in a document to the character's index.
         *
         * Index refers to the "absolute position" of a character in the document. For example:
         *
         * ```javascript
         * var x = 0; // 10 characters, plus one for newline
         * var y = -1;
         * ```
         *
         * Here, `y` is an index 15: 11 characters for the first row, and 5 characters until `y` in the second.
         *
         * @param {Point} pos The `{row, column}` to convert
         * @param {Number} [startRow=0] The row from which to start the conversion
         * @returns {Number} The index position in the document
         */
        positionToIndex(pos: Point, startRow?: number): number;
    }
    export type Delta = import("ace-code").Ace.Delta;
    export type Point = import("ace-code").Ace.Point;
    export type IRange = import("ace-code").Ace.IRange;
    export type NewLineMode = import("ace-code").Ace.NewLineMode;
    import { Anchor } from "ace-code/src/anchor";
    import { Range } from "ace-code/src/range";
    namespace Ace {
        type EventEmitter<T extends {
            [K in keyof T]: (...args: any[]) => any;
        }> = import("ace-code").Ace.EventEmitter<T>;
        type DocumentEvents = import("ace-code").Ace.DocumentEvents;
    }
    export interface Document extends Ace.EventEmitter<Ace.DocumentEvents> {
    }
}
declare module "ace-code/src/anchor" {
    /**
     * Defines a floating pointer in the document. Whenever text is inserted or deleted before the cursor, the position of the anchor is updated.
     **/
    export class Anchor {
        /**
         * Creates a new `Anchor` and associates it with a document.
         *
         * @param {Document} doc The document to associate with the anchor
         * @param {Number|import("ace-code").Ace.Point} row The starting row position
         * @param {Number} [column] The starting column position
         **/
        constructor(doc: Document, row: number | import("ace-code").Ace.Point, column?: number);
        /**
         * Returns an object identifying the `row` and `column` position of the current anchor.
         **/
        getPosition(): import("ace-code").Ace.Point;
        /**
         *
         * Returns the current document.
         **/
        getDocument(): Document;
        /**
         * Sets the anchor position to the specified row and column. If `noClip` is `true`, the position is not clipped.
         * @param {Number} row The row index to move the anchor to
         * @param {Number} column The column index to move the anchor to
         * @param {Boolean} [noClip] Identifies if you want the position to be clipped
         **/
        setPosition(row: number, column: number, noClip?: boolean): void;
        row: any;
        column: number;
        /**
         * When called, the `"change"` event listener is removed.
         *
         **/
        detach(): void;
        /**
         * When called, the `"change"` event listener is appended.
         * @param {Document} doc The document to associate with
         *
         **/
        attach(doc: Document): void;
        document: Document;
        markerId?: number;
    }
    export type Document = import("ace-code/src/document").Document;
    namespace Ace {
        type EventEmitter<T extends {
            [K in keyof T]: (...args: any[]) => any;
        }> = import("ace-code").Ace.EventEmitter<T>;
        type AnchorEvents = import("ace-code").Ace.AnchorEvents;
        type Document = import("ace-code").Ace.Document;
    }
    export interface Anchor extends Ace.EventEmitter<Ace.AnchorEvents> {
        markerId?: number;
        document: Ace.Document;
    }
}
declare module "ace-code/src/config" {
    const _exports: {
        defineOptions(obj: any, path: string, options: {
            [key: string]: any;
        }): import("ace-code").Ace.AppConfig;
        resetOptions(obj: any): void;
        setDefaultValue(path: string, name: string, value: any): boolean;
        setDefaultValues(path: string, optionHash: {
            [key: string]: any;
        }): void;
        setMessages(value: any, options?: {
            placeholders?: "dollarSigns" | "curlyBrackets";
        }): void;
        nls(key: string, defaultString: string, params?: {
            [x: string]: any;
        }): any;
        warn: (message: any, ...args: any[]) => void;
        reportError: (msg: any, data: any) => void;
        once<K extends string | number | symbol>(name: K, callback: any): void;
        setDefaultHandler(name: string, callback: Function): void;
        removeDefaultHandler(name: string, callback: Function): void;
        on<K extends string | number | symbol>(name: K, callback: any, capturing?: boolean): any;
        addEventListener<K extends string | number | symbol>(name: K, callback: any, capturing?: boolean): any;
        off<K extends string | number | symbol>(name: K, callback: any): void;
        removeListener<K extends string | number | symbol>(name: K, callback: any): void;
        removeEventListener<K extends string | number | symbol>(name: K, callback: any): void;
        removeAllListeners(name?: string): void;
        /**
         * @param {K} key - The key of the config option to retrieve.
         * @returns {import("ace-code").Ace.ConfigOptions[K]} - The value of the config option.
         */
        get: <K extends keyof import("ace-code").Ace.ConfigOptions>(key: K) => import("ace-code").Ace.ConfigOptions[K];
        set: <K extends keyof import("ace-code").Ace.ConfigOptions>(key: K, value: import("ace-code").Ace.ConfigOptions[K]) => void;
        all: () => import("ace-code").Ace.ConfigOptions;
        /**
         * module loading
         */
        moduleUrl: (name: string, component?: string) => string;
        setModuleUrl: (name: string, subst: string) => string;
        /** @arg {(name: string, callback: (error: any, module: any) => void) => void} cb */
        setLoader: (cb: (name: string, callback: (error: any, module: any) => void) => void) => void;
        dynamicModules: any;
        loadModule: (moduleId: string | [
            string,
            string
        ], onLoad: (module: any) => void) => void;
        setModuleLoader: (moduleName: any, onLoad: any) => void;
        version: "1.37.5";
    };
    export = _exports;
}
declare module "ace-code/src/layer/lines" {
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    export type LayerConfig = import("ace-code").Ace.LayerConfig;
    export class Lines {
        constructor(element: HTMLElement, canvasHeight?: number);
        element: HTMLElement;
        canvasHeight: number;
        cells: any[];
        cellCache: any[];
        moveContainer(config: LayerConfig): void;
        pageChanged(oldConfig: LayerConfig, newConfig: LayerConfig): boolean;
        computeLineTop(row: number, config: Partial<LayerConfig>, session: EditSession): number;
        computeLineHeight(row: number, config: LayerConfig, session: EditSession): number;
        getLength(): number;
        get(index: number): any;
        shift(): void;
        pop(): void;
        push(cell: any): void;
        unshift(cell: any): void;
        last(): any;
        createCell(row: any, config: any, session: any, initElement: any): any;
    }
}
declare module "ace-code/src/layer/gutter" {
    export class Gutter {
        constructor(parentEl: HTMLElement);
        element: HTMLDivElement;
        gutterWidth: number;
        setSession(session: EditSession): void;
        session: import("ace-code/src/edit_session").EditSession;
        addGutterDecoration(row: number, className: string): void;
        removeGutterDecoration(row: number, className: string): void;
        setAnnotations(annotations: any[]): void;
        update(config: LayerConfig): void;
        config: import("ace-code").Ace.LayerConfig;
        oldLastRow: number;
        updateLineHighlight(): void;
        scrollLines(config: LayerConfig): void;
        setHighlightGutterLine(highlightGutterLine: boolean): void;
        setShowLineNumbers(show: boolean): void;
        getShowLineNumbers(): boolean;
        setShowFoldWidgets(show?: boolean): void;
        getShowFoldWidgets(): boolean;
        getRegion(point: {
            x: number;
        }): "markers" | "foldWidgets";
    }
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    export type LayerConfig = import("ace-code").Ace.LayerConfig;
    import { Lines } from "ace-code/src/layer/lines";
    namespace Ace {
        type EventEmitter<T extends {
            [K in keyof T]: (...args: any[]) => any;
        }> = import("ace-code").Ace.EventEmitter<T>;
        type GutterEvents = import("ace-code").Ace.GutterEvents;
    }
    export interface Gutter extends Ace.EventEmitter<Ace.GutterEvents> {
    }
}
declare module "ace-code/src/layer/marker" {
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    export type LayerConfig = import("ace-code").Ace.LayerConfig;
    export class Marker {
        constructor(parentEl: HTMLElement);
        element: HTMLDivElement;
        setPadding(padding: number): void;
        setSession(session: EditSession): void;
        session: import("ace-code/src/edit_session").EditSession;
        setMarkers(markers: {
            [x: number]: import("ace-code").Ace.MarkerLike;
        }): void;
        markers: {
            [x: number]: import("ace-code").Ace.MarkerLike;
        };
        elt(className: string, css: string): void;
        i: number;
        update(config: LayerConfig): void;
        config: import("ace-code").Ace.LayerConfig;
        drawTextMarker(stringBuilder: undefined, range: Range, clazz: string, layerConfig: Partial<LayerConfig>, extraStyle?: string): void;
        drawMultiLineMarker(stringBuilder: undefined, range: Range, clazz: string, config: LayerConfig, extraStyle?: string): void;
        drawSingleLineMarker(stringBuilder: undefined, range: Range, clazz: string, config: Partial<LayerConfig>, extraLength?: number, extraStyle?: string): void;
        drawBidiSingleLineMarker(stringBuilder: undefined, range: Range, clazz: string, config: Partial<LayerConfig>, extraLength: number, extraStyle: string): void;
        drawFullLineMarker(stringBuilder: undefined, range: Range, clazz: string, config: Partial<LayerConfig>, extraStyle?: undefined): void;
        drawScreenLineMarker(stringBuilder: undefined, range: Range, clazz: string, config: Partial<LayerConfig>, extraStyle?: undefined): void;
    }
    import { Range } from "ace-code/src/range";
}
declare module "ace-code/src/layer/text_util" {
    export function isTextToken(tokenType: any): boolean;
}
declare module "ace-code/src/layer/text" {
    export class Text {
        constructor(parentEl: HTMLElement);
        dom: typeof dom;
        element: HTMLDivElement;
        EOL_CHAR: any;
        setPadding(padding: number): void;
        getLineHeight(): number;
        getCharacterWidth(): number;
        checkForSizeChanges(): void;
        setSession(session: EditSession): void;
        session: EditSession;
        setShowInvisibles(showInvisibles: string): boolean;
        showInvisibles: any;
        showSpaces: boolean;
        showTabs: boolean;
        showEOL: boolean;
        setDisplayIndentGuides(display: boolean): boolean;
        displayIndentGuides: any;
        setHighlightIndentGuides(highlight: boolean): boolean;
        tabSize: number;
        updateLines(config: LayerConfig, firstRow: number, lastRow: number): void;
        config: import("ace-code").Ace.LayerConfig;
        scrollLines(config: LayerConfig): void;
        update(config: LayerConfig): void;
        renderIndentGuide(parent: any, value: any, max: any): any;
        EOF_CHAR: string;
        EOL_CHAR_LF: string;
        EOL_CHAR_CRLF: string;
        TAB_CHAR: string;
        SPACE_CHAR: string;
        MAX_LINE_LENGTH: number;
        destroy: {};
        onChangeTabSize: () => void;
    }
    export type LayerConfig = import("ace-code").Ace.LayerConfig;
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    import dom = require("ace-code/src/lib/dom");
    import { Lines } from "ace-code/src/layer/lines";
    namespace Ace {
        type EventEmitter<T extends {
            [K in keyof T]: (...args: any[]) => any;
        }> = import("ace-code").Ace.EventEmitter<T>;
        type TextEvents = import("ace-code").Ace.TextEvents;
        type LayerConfig = import("ace-code").Ace.LayerConfig;
    }
    export interface Text extends Ace.EventEmitter<Ace.TextEvents> {
        config: Ace.LayerConfig;
    }
}
declare module "ace-code/src/layer/cursor" {
    export class Cursor {
        constructor(parentEl: HTMLElement);
        element: HTMLDivElement;
        isVisible: boolean;
        isBlinking: boolean;
        blinkInterval: number;
        smoothBlinking: boolean;
        cursors: any[];
        cursor: HTMLDivElement;
        setPadding(padding: number): void;
        setSession(session: EditSession): void;
        session: import("ace-code/src/edit_session").EditSession;
        setBlinking(blinking: boolean): void;
        setBlinkInterval(blinkInterval: number): void;
        setSmoothBlinking(smoothBlinking: boolean): void;
        addCursor(): HTMLDivElement;
        removeCursor(): any;
        hideCursor(): void;
        showCursor(): void;
        restartTimer(): void;
        intervalId: number;
        getPixelPosition(position?: import("ace-code").Ace.Point, onScreen?: boolean): {
            left: number;
            top: number;
        };
        isCursorInView(pixelPos: any, config: any): boolean;
        update(config: any): void;
        config: any;
        overwrite: any;
        destroy(): void;
        drawCursor: any;
        timeoutId?: number;
    }
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    export interface Cursor {
        timeoutId?: number;
    }
}
declare module "ace-code/src/scrollbar" {
    const VScrollBar_base: typeof Scrollbar;
    /**
     * Represents a vertical scroll bar.
     **/
    export class VScrollBar extends Scrollbar {
        /**
         * Creates a new `VScrollBar`. `parent` is the owner of the scroll bar.
         * @param {Element} parent A DOM element
         * @param {Object} renderer An editor renderer
         **/
        constructor(parent: Element, renderer: any);
        scrollTop: number;
        scrollHeight: number;
        width: number;
        /**
         * Returns the width of the scroll bar.
         **/
        getWidth(): number;
        /**
         * Sets the height of the scroll bar, in pixels.
         * @param {Number} height The new height
         **/
        setHeight(height: number): void;
        /**
         * Sets the scroll height of the scroll bar, in pixels.
         * @param {Number} height The new scroll height
         **/
        setScrollHeight(height: number): void;
        /**
         * Sets the scroll top of the scroll bar.
         * @param {Number} scrollTop The new scroll top
         **/
        setScrollTop(scrollTop: number): void;
        /**
         * Sets the inner height of the scroll bar, in pixels.
         * @param {Number} height The new inner height
         * @deprecated Use setScrollHeight instead
         **/
        setInnerHeight: (height: number) => void;
    }
    const HScrollBar_base: typeof Scrollbar;
    /**
     * Represents a horisontal scroll bar.
     **/
    export class HScrollBar extends Scrollbar {
        /**
         * Creates a new `HScrollBar`. `parent` is the owner of the scroll bar.
         * @param {Element} parent A DOM element
         * @param {Object} renderer An editor renderer
         **/
        constructor(parent: Element, renderer: any);
        scrollLeft: number;
        height: any;
        /**
         * Returns the height of the scroll bar.
         **/
        getHeight(): number;
        /**
         * Sets the width of the scroll bar, in pixels.
         * @param {Number} width The new width
         **/
        setWidth(width: number): void;
        /**
         * Sets the inner width of the scroll bar, in pixels.
         * @param {Number} width The new inner width
         * @deprecated Use setScrollWidth instead
         **/
        setInnerWidth(width: number): void;
        /**
         * Sets the scroll width of the scroll bar, in pixels.
         * @param {Number} width The new scroll width
         **/
        setScrollWidth(width: number): void;
        /**
         * Sets the scroll left of the scroll bar.
         * @param {Number} scrollLeft The new scroll left
         **/
        setScrollLeft(scrollLeft: number): void;
    }
    /**
     * An abstract class representing a native scrollbar control.
     **/
    class Scrollbar {
        /**
         * Creates a new `ScrollBar`. `parent` is the owner of the scroll bar.
         * @param {Element} parent A DOM element
         **/
        constructor(parent: Element, classSuffix: string);
        element: HTMLDivElement;
        inner: HTMLDivElement;
        skipEvent: boolean;
        setVisible(isVisible: any): void;
        isVisible: any;
        coeff: number;
    }
    export { VScrollBar as ScrollBar, VScrollBar as ScrollBarV, HScrollBar as ScrollBarH };
    namespace Ace {
        type EventEmitter<T extends {
            [K in keyof T]: (...args: any[]) => any;
        }> = import("ace-code").Ace.EventEmitter<T>;
    }
    export interface VScrollBar extends Ace.EventEmitter<any> {
    }
    export interface HScrollBar extends Ace.EventEmitter<any> {
    }
}
declare module "ace-code/src/scrollbar_custom" {
    const VScrollBar_base: typeof ScrollBar;
    /**
     * Represents a vertical scroll bar.
     * @class VScrollBar
     **/
    /**
     * Creates a new `VScrollBar`. `parent` is the owner of the scroll bar.
     * @param {Element} parent A DOM element
     * @param {Object} renderer An editor renderer
     *
     * @constructor
     **/
    export class VScrollBar extends ScrollBar {
        constructor(parent: any, renderer: any);
        scrollTop: number;
        scrollHeight: number;
        parent: any;
        width: number;
        renderer: any;
        getHeight(): number;
        /**
         * Returns new top for scroll thumb
         **/
        scrollTopFromThumbTop(thumbTop: number): number;
        /**
         * Returns the width of the scroll bar.
         **/
        getWidth(): number;
        /**
         * Sets the height of the scroll bar, in pixels.
         * @param {Number} height The new height
         **/
        setHeight(height: number): void;
        height: number;
        slideHeight: number;
        viewHeight: number;
        /**
         * Sets the inner and scroll height of the scroll bar, in pixels.
         * @param {Number} height The new inner height
         *
         * @param {boolean} force Forcely update height
         **/
        setScrollHeight(height: number, force: boolean): void;
        pageHeight: any;
        thumbHeight: number;
        /**
         * Sets the scroll top of the scroll bar.
         * @param {Number} scrollTop The new scroll top
         **/
        setScrollTop(scrollTop: number): void;
        thumbTop: number;
        setInnerHeight: (height: number, force: boolean) => void;
    }
    const HScrollBar_base: typeof ScrollBar;
    /**
     * Represents a horizontal scroll bar.
     **/
    export class HScrollBar extends ScrollBar {
        /**
         * Creates a new `HScrollBar`. `parent` is the owner of the scroll bar.
         * @param {Element} parent A DOM element
         * @param {Object} renderer An editor renderer
         **/
        constructor(parent: Element, renderer: any);
        scrollLeft: number;
        scrollWidth: number;
        height: number;
        renderer: any;
        /**
         * Returns the height of the scroll bar.
         **/
        getHeight(): number;
        /**
         * Returns new left for scroll thumb
         **/
        scrollLeftFromThumbLeft(thumbLeft: number): number;
        /**
         * Sets the width of the scroll bar, in pixels.
         * @param {Number} width The new width
         **/
        setWidth(width: number): void;
        width: number;
        slideWidth: number;
        viewWidth: number;
        /**
         * Sets the inner and scroll width of the scroll bar, in pixels.
         * @param {Number} width The new inner width
         * @param {boolean} force Forcely update width
         **/
        setScrollWidth(width: number, force: boolean): void;
        pageWidth: any;
        thumbWidth: number;
        /**
         * Sets the scroll left of the scroll bar.
         * @param {Number} scrollLeft The new scroll left
         **/
        setScrollLeft(scrollLeft: number): void;
        thumbLeft: number;
        setInnerWidth: (width: number, force: boolean) => void;
    }
    /**
     * An abstract class representing a native scrollbar control.
     **/
    class ScrollBar {
        /**
         * Creates a new `ScrollBar`. `parent` is the owner of the scroll bar.
         * @param {Element} parent A DOM element
         **/
        constructor(parent: Element, classSuffix: string);
        element: HTMLDivElement;
        inner: HTMLDivElement;
        VScrollWidth: number;
        HScrollHeight: number;
        skipEvent: boolean;
        setVisible(isVisible: any): void;
        isVisible: any;
        coeff: number;
    }
    export { VScrollBar as ScrollBar, VScrollBar as ScrollBarV, HScrollBar as ScrollBarH };
    namespace Ace {
        type EventEmitter<T extends {
            [K in keyof T]: (...args: any[]) => any;
        }> = import("ace-code").Ace.EventEmitter<T>;
    }
    export interface VScrollBar extends Ace.EventEmitter<any> {
    }
    export interface HScrollBar extends Ace.EventEmitter<any> {
    }
}
declare module "ace-code/src/renderloop" {
    /**
     * Batches changes (that force something to be redrawn) in the background.
     **/
    export class RenderLoop {
        constructor(onRender: any, win: any);
        onRender: any;
        pending: boolean;
        changes: number;
        window: any;
        schedule(change: any): void;
        clear(change: any): number;
    }
}
declare module "ace-code/src/css/editor-css" {
    const _exports: string;
    export = _exports;
}
declare module "ace-code/src/layer/decorators" {
    export class Decorator {
        constructor(parent: any, renderer: any);
        canvas: HTMLCanvasElement;
        renderer: any;
        pixelRatio: number;
        maxHeight: any;
        lineHeight: any;
        canvasHeight: any;
        heightRatio: number;
        canvasWidth: any;
        minDecorationHeight: number;
        halfMinDecorationHeight: number;
        colors: {};
        compensateFoldRows(row: any, foldData: any): number;
    }
}
declare module "ace-code/src/virtual_renderer" {
    /**
     * The class that is responsible for drawing everything you see on the screen!
     * @related editor.renderer
     **/
    export class VirtualRenderer {
        /**
         * Constructs a new `VirtualRenderer` within the `container` specified, applying the given `theme`.
         * @param {HTMLElement | null} [container] The root element of the editor
         * @param {String} [theme] The starting theme
         **/
        constructor(container?: HTMLElement | null, theme?: string);
        container: HTMLElement;
        scroller: HTMLElement;
        content: HTMLElement;
        canvas: HTMLDivElement;
        scrollBar: VScrollBar;
        scrollBarV: import("ace-code").Ace.VScrollbar;
        scrollBarH: import("ace-code").Ace.HScrollbar;
        scrollTop: number;
        scrollLeft: number;
        cursorPos: {
            row: number;
            column: number;
        };
        layerConfig: {
            width: number;
            padding: number;
            firstRow: number;
            firstRowScreen: number;
            lastRow: number;
            lineHeight: number;
            characterWidth: number;
            minHeight: number;
            maxHeight: number;
            offset: number;
            height: number;
            gutterOffset: number;
        };
        scrollMargin: {
            left: number;
            right: number;
            top: number;
            bottom: number;
            v: number;
            h: number;
        };
        margin: {
            left: number;
            right: number;
            top: number;
            bottom: number;
            v: number;
            h: number;
        };
        updateCharacterSize(): void;
        characterWidth: number;
        lineHeight: number;
        /**
         *
         * Associates the renderer with an [[EditSession `EditSession`]].
         * @param {EditSession} session The session to associate with
         **/
        setSession(session: EditSession): void;
        session: import("ace-code/src/edit_session").EditSession;
        /**
         * Triggers a partial update of the text, from the range given by the two parameters.
         * @param {Number} firstRow The first row to update
         * @param {Number} lastRow The last row to update
         **/
        updateLines(firstRow: number, lastRow: number, force?: boolean): void;
        /**
         * Triggers a full update of the text, for all the rows.
         **/
        updateText(): void;
        /**
         * Triggers a full update of all the layers, for all the rows.
         * @param {Boolean} [force] If `true`, forces the changes through
         **/
        updateFull(force?: boolean): void;
        /**
         * Updates the font size.
         **/
        updateFontSize(): void;
        resizing: number;
        gutterWidth: any;
        /**
         * Adjusts the wrap limit, which is the number of characters that can fit within the width of the edit area on screen.
         **/
        adjustWrapLimit(): boolean;
        /**
         * Identifies whether you want to have an animated scroll or not.
         * @param {Boolean} shouldAnimate Set to `true` to show animated scrolls
         **/
        setAnimatedScroll(shouldAnimate: boolean): void;
        /**
         * Returns whether an animated scroll happens or not.
         **/
        getAnimatedScroll(): boolean;
        /**
         * Identifies whether you want to show invisible characters or not.
         * @param {Boolean} showInvisibles Set to `true` to show invisibles
         **/
        setShowInvisibles(showInvisibles: boolean): void;
        /**
         * Returns whether invisible characters are being shown or not.
         **/
        getShowInvisibles(): boolean;
        getDisplayIndentGuides(): boolean;
        setDisplayIndentGuides(display: boolean): void;
        getHighlightIndentGuides(): boolean;
        setHighlightIndentGuides(highlight: boolean): void;
        /**
         * Identifies whether you want to show the print margin or not.
         * @param {Boolean} showPrintMargin Set to `true` to show the print margin
         **/
        setShowPrintMargin(showPrintMargin: boolean): void;
        /**
         * Returns whether the print margin is being shown or not.
         **/
        getShowPrintMargin(): boolean;
        /**
         * Identifies whether you want to show the print margin column or not.
         * @param {number} printMarginColumn Set to `true` to show the print margin column
         **/
        setPrintMarginColumn(printMarginColumn: number): void;
        /**
         * Returns whether the print margin column is being shown or not.
         **/
        getPrintMarginColumn(): number;
        /**
         * Returns `true` if the gutter is being shown.
         **/
        getShowGutter(): boolean;
        /**
         * Identifies whether you want to show the gutter or not.
         * @param {Boolean} show Set to `true` to show the gutter
         **/
        setShowGutter(show: boolean): void;
        getFadeFoldWidgets(): boolean;
        setFadeFoldWidgets(show: boolean): void;
        setHighlightGutterLine(shouldHighlight: boolean): void;
        getHighlightGutterLine(): boolean;
        /**
         *
         * Returns the root element containing this renderer.
         **/
        getContainerElement(): HTMLElement;
        /**
         *
         * Returns the element that the mouse events are attached to
         **/
        getMouseEventTarget(): HTMLElement;
        /**
         *
         * Returns the element to which the hidden text area is added.
         **/
        getTextAreaContainer(): HTMLElement;
        /**
         * [Returns the index of the first visible row.]{: #VirtualRenderer.getFirstVisibleRow}
         **/
        getFirstVisibleRow(): number;
        /**
         *
         * Returns the index of the first fully visible row. "Fully" here means that the characters in the row are not truncated; that the top and the bottom of the row are on the screen.
         **/
        getFirstFullyVisibleRow(): number;
        /**
         *
         * Returns the index of the last fully visible row. "Fully" here means that the characters in the row are not truncated; that the top and the bottom of the row are on the screen.
         **/
        getLastFullyVisibleRow(): number;
        /**
         *
         * [Returns the index of the last visible row.]{: #VirtualRenderer.getLastVisibleRow}
         **/
        getLastVisibleRow(): number;
        /**
         * Sets the padding for all the layers.
         * @param {Number} padding A new padding value (in pixels)
         **/
        setPadding(padding: number): void;
        setScrollMargin(top?: number, bottom?: number, left?: number, right?: number): void;
        setMargin(top?: number, bottom?: number, left?: number, right?: number): void;
        /**
         * Returns whether the horizontal scrollbar is set to be always visible.
         **/
        getHScrollBarAlwaysVisible(): boolean;
        /**
         * Identifies whether you want to show the horizontal scrollbar or not.
         * @param {Boolean} alwaysVisible Set to `true` to make the horizontal scroll bar visible
         **/
        setHScrollBarAlwaysVisible(alwaysVisible: boolean): void;
        /**
         * Returns whether the horizontal scrollbar is set to be always visible.
         **/
        getVScrollBarAlwaysVisible(): boolean;
        /**
         * Identifies whether you want to show the horizontal scrollbar or not.
         * @param {Boolean} alwaysVisible Set to `true` to make the horizontal scroll bar visible
         **/
        setVScrollBarAlwaysVisible(alwaysVisible: boolean): void;
        freeze(): void;
        unfreeze(): void;
        desiredHeight: any;
        /**
         * Schedules an update to all the front markers in the document.
         **/
        updateFrontMarkers(): void;
        /**
         *
         * Schedules an update to all the back markers in the document.
         **/
        updateBackMarkers(): void;
        /**
         *
         * Deprecated; (moved to [[EditSession]])
         * @deprecated
         **/
        addGutterDecoration(row: any, className: any): void;
        /**
         * Deprecated; (moved to [[EditSession]])
         * @deprecated
         **/
        removeGutterDecoration(row: any, className: any): void;
        /**
         *
         * Redraw breakpoints.
         */
        updateBreakpoints(rows?: any): void;
        /**
         * Sets annotations for the gutter.
         * @param {import("ace-code").Ace.Annotation[]} annotations An array containing annotations
         *
         **/
        setAnnotations(annotations: import("ace-code").Ace.Annotation[]): void;
        /**
         *
         * Updates the cursor icon.
         **/
        updateCursor(): void;
        /**
         *
         * Hides the cursor icon.
         **/
        hideCursor(): void;
        /**
         *
         * Shows the cursor icon.
         **/
        showCursor(): void;
        scrollSelectionIntoView(anchor: Point, lead: Point, offset?: number): void;
        /**
         *
         * Scrolls the cursor into the first visibile area of the editor
         */
        scrollCursorIntoView(cursor?: Point, offset?: number, $viewMargin?: {
            top?: any;
            bottom?: any;
        }): void;
        /**
         * {:EditSession.getScrollTop}
         * @related EditSession.getScrollTop
         **/
        getScrollTop(): number;
        /**
         * {:EditSession.getScrollLeft}
         * @related EditSession.getScrollLeft
         **/
        getScrollLeft(): number;
        /**
         * Returns the first visible row, regardless of whether it's fully visible or not.
         **/
        getScrollTopRow(): number;
        /**
         * Returns the last visible row, regardless of whether it's fully visible or not.
         **/
        getScrollBottomRow(): number;
        /**
         * Gracefully scrolls from the top of the editor to the row indicated.
         * @param {Number} row A row id
         *
         * @related EditSession.setScrollTop
         **/
        scrollToRow(row: number): void;
        alignCursor(cursor: Point, alignment?: number): number;
        /**
         * Gracefully scrolls the editor to the row indicated.
         * @param {Number} line A line number
         * @param {Boolean} center If `true`, centers the editor the to indicated line
         * @param {Boolean} animate If `true` animates scrolling
         * @param {() => void} [callback] Function to be called after the animation has finished
         **/
        scrollToLine(line: number, center: boolean, animate: boolean, callback?: () => void): void;
        animateScrolling(fromValue: any, callback?: any): void;
        /**
         * Scrolls the editor to the y pixel indicated.
         * @param {Number} scrollTop The position to scroll to
         **/
        scrollToY(scrollTop: number): void;
        /**
         * Scrolls the editor across the x-axis to the pixel indicated.
         * @param {Number} scrollLeft The position to scroll to
         **/
        scrollToX(scrollLeft: number): void;
        /**
         * Scrolls the editor across both x- and y-axes.
         * @param {Number} x The x value to scroll to
         * @param {Number} y The y value to scroll to
         **/
        scrollTo(x: number, y: number): void;
        /**
         * Scrolls the editor across both x- and y-axes.
         * @param {Number} deltaX The x value to scroll by
         * @param {Number} deltaY The y value to scroll by
         **/
        scrollBy(deltaX: number, deltaY: number): void;
        /**
         * Returns `true` if you can still scroll by either parameter; in other words, you haven't reached the end of the file or line.
         * @param {Number} deltaX The x value to scroll by
         * @param {Number} deltaY The y value to scroll by
         *
         **/
        isScrollableBy(deltaX: number, deltaY: number): boolean;
        pixelToScreenCoordinates(x: number, y: number): import("ace-code").Ace.ScreenCoordinates;
        screenToTextCoordinates(x: number, y: number): Point;
        /**
         * Returns an object containing the `pageX` and `pageY` coordinates of the document position.
         * @param {Number} row The document row position
         * @param {Number} column The document column position
         *
         **/
        textToScreenCoordinates(row: number, column: number): {
            pageX: number;
            pageY: number;
        };
        /**
         *
         * Focuses the current container.
         **/
        visualizeFocus(): void;
        /**
         *
         * Blurs the current container.
         **/
        visualizeBlur(): void;
        showComposition(composition: any): void;
        /**
         * @param {String} text A string of text to use
         *
         * Sets the inner text of the current composition to `text`.
         **/
        setCompositionText(text: string): void;
        /**
         *
         * Hides the current composition.
         **/
        hideComposition(): void;
        setGhostText(text: string, position?: Point): void;
        removeGhostText(): void;
        addToken(text: string, type: string, row: number, column?: number): void;
        hideTokensAfterPosition(row: any, column: any): {
            type: string;
            value: string;
        }[];
        removeExtraToken(row: any, column: any): void;
        /**
         * [Sets a new theme for the editor. `theme` should exist, and be a directory path, like `ace/theme/textmate`.]{: #VirtualRenderer.setTheme}
         * @param {String | Theme} [theme] The path to a theme
         * @param {() => void} [cb] optional callback
         **/
        setTheme(theme?: string | Theme, cb?: () => void): void;
        /**
         * [Returns the path of the current theme.]{: #VirtualRenderer.getTheme}
         **/
        getTheme(): string;
        /**
         * [Adds a new class, `style`, to the editor.]{: #VirtualRenderer.setStyle}
         * @param {String} style A class name
         **/
        setStyle(style: string, include?: boolean): void;
        /**
         * [Removes the class `style` from the editor.]{: #VirtualRenderer.unsetStyle}
         * @param {String} style A class name
         *
         **/
        unsetStyle(style: string): void;
        setCursorStyle(style: string): void;
        /**
         * @param {String} cursorStyle A css cursor style
         **/
        setMouseCursor(cursorStyle: string): void;
        attachToShadowRoot(): void;
        /**
         * Destroys the text and cursor layers for this renderer.
         **/
        destroy(): void;
        CHANGE_CURSOR: number;
        CHANGE_MARKER: number;
        CHANGE_GUTTER: number;
        CHANGE_SCROLL: number;
        CHANGE_LINES: number;
        CHANGE_TEXT: number;
        CHANGE_SIZE: number;
        CHANGE_MARKER_BACK: number;
        CHANGE_MARKER_FRONT: number;
        CHANGE_FULL: number;
        CHANGE_H_SCROLL: number;
        STEPS: number;
        textarea: HTMLTextAreaElement;
        enableKeyboardAccessibility?: boolean;
        showInvisibles?: boolean;
        theme?: any;
        destroyed?: boolean;
        keyboardFocusClassName?: string;
    }
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    export type Point = import("ace-code").Ace.Point;
    export type Theme = import("ace-code").Ace.Theme;
    import { Gutter as GutterLayer } from "ace-code/src/layer/gutter";
    import { Marker as MarkerLayer } from "ace-code/src/layer/marker";
    import { Text as TextLayer } from "ace-code/src/layer/text";
    import { Cursor as CursorLayer } from "ace-code/src/layer/cursor";
    import { VScrollBar } from "ace-code/src/scrollbar";
    import { FontMetrics } from "ace-code/src/layer/font_metrics";
    import { RenderLoop } from "ace-code/src/renderloop";
    import { Decorator } from "ace-code/src/layer/decorators";
    namespace Ace {
        type EventEmitter<T extends {
            [K in keyof T]: (...args: any[]) => any;
        }> = import("ace-code").Ace.EventEmitter<T>;
        type VirtualRendererEvents = import("ace-code").Ace.VirtualRendererEvents;
        type OptionsProvider<T> = import("ace-code").Ace.OptionsProvider<T>;
        type VirtualRendererOptions = import("ace-code").Ace.VirtualRendererOptions;
        type EditSession = import("ace-code").Ace.EditSession;
    }
    export interface VirtualRenderer extends Ace.EventEmitter<Ace.VirtualRendererEvents>, Ace.OptionsProvider<Ace.VirtualRendererOptions> {
        textarea: HTMLTextAreaElement;
        enableKeyboardAccessibility?: boolean;
        showInvisibles?: boolean;
        theme?: any;
        destroyed?: boolean;
        session: Ace.EditSession;
        keyboardFocusClassName?: string;
    }
}
declare module "ace-code/src/selection" {
    export class Selection {
        /**
         * Creates a new `Selection` object.
         * @param {EditSession} session The session to use
         * @constructor
         **/
        constructor(session: EditSession);
        session: EditSession;
        doc: import("ace-code/src/document").Document;
        cursor: Anchor;
        lead: Anchor;
        anchor: Anchor;
        /**
         * Returns `true` if the selection is empty.
         **/
        isEmpty(): boolean;
        /**
         * Returns `true` if the selection is a multi-line.
         **/
        isMultiLine(): boolean;
        /**
         * Returns an object containing the `row` and `column` current position of the cursor.
         **/
        getCursor(): Point;
        /**
         * Sets the row and column position of the anchor. This function also emits the `'changeSelection'` event.
         * @param {Number} row The new row
         * @param {Number} column The new column
         *
         **/
        setAnchor(row: number, column: number): void;
        /**
         * Returns an object containing the `row` and `column` of the calling selection anchor.
         *
         * @related Anchor.getPosition
         **/
        getAnchor(): Point;
        /**
         * Returns an object containing the `row` and `column` of the calling selection lead.
         **/
        getSelectionLead(): any;
        /**
         * Returns `true` if the selection is going backwards in the document.
         **/
        isBackwards(): boolean;
        /**
         * [Returns the [[Range]] for the selected text.]{: #Selection.getRange}
         **/
        getRange(): Range;
        /**
         * [Empties the selection (by de-selecting it). This function also emits the `'changeSelection'` event.]{: #Selection.clearSelection}
         **/
        clearSelection(): void;
        /**
         * Selects all the text in the document.
         **/
        selectAll(): void;
        /**
         * Sets the selection to the provided range.
         * @param {import("ace-code").Ace.IRange} range The range of text to select
         * @param {Boolean} [reverse] Indicates if the range should go backwards (`true`) or not
         **/
        setRange(range: import("ace-code").Ace.IRange, reverse?: boolean): void;
        /**
         * Moves the selection cursor to the indicated row and column.
         * @param {Number} row The row to select to
         * @param {Number} column The column to select to
         **/
        selectTo(row: number, column: number): void;
        /**
         * Moves the selection cursor to the row and column indicated by `pos`.
         * @param {Point} pos An object containing the row and column
         **/
        selectToPosition(pos: Point): void;
        /**
         * Moves the selection cursor to the indicated row and column.
         * @param {Number} row The row to select to
         * @param {Number} column The column to select to
         **/
        moveTo(row: number, column: number): void;
        /**
         * Moves the selection cursor to the row and column indicated by `pos`.
         * @param {Object} pos An object containing the row and column
         **/
        moveToPosition(pos: any): void;
        /**
         * Moves the selection up one row.
         **/
        selectUp(): void;
        /**
         * Moves the selection down one row.
         **/
        selectDown(): void;
        /**
         * Moves the selection right one column.
         **/
        selectRight(): void;
        /**
         * Moves the selection left one column.
         **/
        selectLeft(): void;
        /**
         * Moves the selection to the beginning of the current line.
         **/
        selectLineStart(): void;
        /**
         * Moves the selection to the end of the current line.
         **/
        selectLineEnd(): void;
        /**
         * Moves the selection to the end of the file.
         **/
        selectFileEnd(): void;
        /**
         * Moves the selection to the start of the file.
         **/
        selectFileStart(): void;
        /**
         * Moves the selection to the first word on the right.
         **/
        selectWordRight(): void;
        /**
         * Moves the selection to the first word on the left.
         **/
        selectWordLeft(): void;
        /**
         * Moves the selection to highlight the entire word.
         * @related EditSession.getWordRange
         **/
        getWordRange(row: any, column: any): Range;
        /**
         * Selects an entire word boundary.
         **/
        selectWord(): void;
        /**
         * Selects a word, including its right whitespace.
         * @related EditSession.getAWordRange
         **/
        selectAWord(): void;
        getLineRange(row: any, excludeLastChar: any): Range;
        /**
         * Selects the entire line.
         **/
        selectLine(): void;
        /**
         * Moves the cursor up one row.
         **/
        moveCursorUp(): void;
        /**
         * Moves the cursor down one row.
         **/
        moveCursorDown(): void;
        /**
         *
         * Returns `true` if moving the character next to the cursor in the specified direction is a soft tab.
         * @param {Point} cursor the current cursor position
         * @param {Number} tabSize the tab size
         * @param {Number} direction 1 for right, -1 for left
         */
        wouldMoveIntoSoftTab(cursor: Point, tabSize: number, direction: number): boolean;
        /**
         * Moves the cursor left one column.
         **/
        moveCursorLeft(): void;
        /**
         * Moves the cursor right one column.
         **/
        moveCursorRight(): void;
        /**
         * Moves the cursor to the start of the line.
         **/
        moveCursorLineStart(): void;
        /**
         * Moves the cursor to the end of the line.
         **/
        moveCursorLineEnd(): void;
        /**
         * Moves the cursor to the end of the file.
         **/
        moveCursorFileEnd(): void;
        /**
         * Moves the cursor to the start of the file.
         **/
        moveCursorFileStart(): void;
        /**
         * Moves the cursor to the word on the right.
         **/
        moveCursorLongWordRight(): void;
        /**
        *
        * Moves the cursor to the word on the left.
        **/
        moveCursorLongWordLeft(): void;
        moveCursorShortWordRight(): void;
        moveCursorShortWordLeft(): void;
        moveCursorWordRight(): void;
        moveCursorWordLeft(): void;
        /**
         * Moves the cursor to position indicated by the parameters. Negative numbers move the cursor backwards in the document.
         * @param {Number} rows The number of rows to move by
         * @param {Number} chars The number of characters to move by
         *
         * @related EditSession.documentToScreenPosition
         **/
        moveCursorBy(rows: number, chars: number): void;
        /**
         * Moves the selection to the position indicated by its `row` and `column`.
         * @param {Point} position The position to move to
         **/
        moveCursorToPosition(position: Point): void;
        /**
         * Moves the cursor to the row and column provided. [If `preventUpdateDesiredColumn` is `true`, then the cursor stays in the same column position as its original point.]{: #preventUpdateBoolDesc}
         * @param {Number} row The row to move to
         * @param {Number} column The column to move to
         **/
        moveCursorTo(row: number, column: number, keepDesiredColumn?: boolean): void;
        /**
         * Moves the cursor to the screen position indicated by row and column. {:preventUpdateBoolDesc}
         * @param {Number} row The row to move to
         * @param {Number} column The column to move to
         **/
        moveCursorToScreen(row: number, column: number, keepDesiredColumn: boolean): void;
        detach(): void;
        fromOrientedRange(range: Range & {
            desiredColumn?: number;
        }): void;
        toOrientedRange(range?: Range & {
            desiredColumn?: number;
        }): Range & {
            desiredColumn?: number;
        };
        /**
         * Saves the current cursor position and calls `func` that can change the cursor
         * postion. The result is the range of the starting and eventual cursor position.
         * Will reset the cursor position.
         * @param {Function} func The callback that should change the cursor position
         **/
        getRangeOfMovements(func: Function): Range;
        toJSON(): Range | Range[];
        fromJSON(data: any): void;
        isEqual(data: any): boolean;
        /**
         * Left for backward compatibility
         * @deprecated
         */
        setSelectionAnchor: (row: number, column: number) => void;
        /**
         * Left for backward compatibility
         * @deprecated
         */
        getSelectionAnchor: () => Point;
        setSelectionRange: (range: import("ace-code").Ace.IRange, reverse?: boolean) => void;
    }
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    export type Anchor = import("ace-code/src/anchor").Anchor;
    export type Point = import("ace-code").Ace.Point;
    import { Range } from "ace-code/src/range";
    namespace Ace {
        type EventEmitter<T extends {
            [K in keyof T]: (...args: any[]) => any;
        }> = import("ace-code").Ace.EventEmitter<T>;
        type MultiSelectionEvents = import("ace-code").Ace.MultiSelectionEvents;
        type MultiSelectProperties = import("ace-code").Ace.MultiSelectProperties;
    }
    export interface Selection extends Ace.EventEmitter<Ace.MultiSelectionEvents>, Ace.MultiSelectProperties {
    }
}
declare module "ace-code/src/clipboard" {
    export let lineMode: string | false;
    export function pasteCancelled(): boolean;
    export function cancel(): void;
}
declare module "ace-code/src/keyboard/textinput" {
    export function $setUserAgentForTests(_isMobile: any, _isIOS: any): void;
    export var TextInput: any;
}
declare module "ace-code/src/mouse/mouse_event" {
    export class MouseEvent {
        constructor(domEvent: any, editor: any);
        speed: number;
        wheelX: number;
        wheelY: number;
        domEvent: any;
        editor: any;
        x: any;
        clientX: any;
        y: any;
        clientY: any;
        propagationStopped: boolean;
        defaultPrevented: boolean;
        stopPropagation(): void;
        preventDefault(): void;
        stop(): void;
        /**
         * Get the document position below the mouse cursor
         *
         * @return {Object} 'row' and 'column' of the document position
         */
        getDocumentPosition(): any;
        /**
         * Get the relative position within the gutter.
         *
         * @return {Number} 'row' within the gutter.
         */
        getGutterRow(): number;
        /**
         * Check if the mouse cursor is inside of the text selection
         *
         * @return {Boolean} whether the mouse cursor is inside of the selection
         */
        inSelection(): boolean;
        /**
         * Get the clicked mouse button
         *
         * @return {Number} 0 for left button, 1 for middle button, 2 for right button
         */
        getButton(): number;
        /**
         * @return {Boolean} whether the shift key was pressed when the event was emitted
         */
        getShiftKey(): boolean;
        getAccelKey(): any;
        time?: number;
    }
    export interface MouseEvent {
        time?: number;
    }
}
declare module "ace-code/src/mouse/default_handlers" {
    export type MouseHandler = import("ace-code/src/mouse/mouse_handler").MouseHandler;
    export type MouseEvent = import("ace-code/src/mouse/mouse_event").MouseEvent;
    export class DefaultHandlers {
        constructor(mouseHandler: MouseHandler);
        onMouseDown(this: import("ace-code/src/mouse/mouse_handler").MouseHandler, ev: MouseEvent): void;
        mousedownEvent: import("ace-code/src/mouse/mouse_event").MouseEvent;
        startSelect(this: import("ace-code/src/mouse/mouse_handler").MouseHandler, pos?: import("ace-code").Ace.Position, waitForClickSelection?: boolean): void;
        select(this: import("ace-code/src/mouse/mouse_handler").MouseHandler): void;
        extendSelectionBy(this: import("ace-code/src/mouse/mouse_handler").MouseHandler, unitName: string | number): void;
        selectByLinesEnd(this: import("ace-code/src/mouse/mouse_handler").MouseHandler): void;
        focusWait(this: import("ace-code/src/mouse/mouse_handler").MouseHandler): void;
        onDoubleClick(this: import("ace-code/src/mouse/mouse_handler").MouseHandler, ev: MouseEvent): void;
        onTripleClick(this: import("ace-code/src/mouse/mouse_handler").MouseHandler, ev: MouseEvent): void;
        onQuadClick(this: import("ace-code/src/mouse/mouse_handler").MouseHandler, ev: MouseEvent): void;
        onMouseWheel(this: import("ace-code/src/mouse/mouse_handler").MouseHandler, ev: MouseEvent): void;
        selectEnd: (this: import("ace-code/src/mouse/mouse_handler").MouseHandler) => void;
        selectAllEnd: (this: import("ace-code/src/mouse/mouse_handler").MouseHandler) => void;
        selectByWordsEnd: (this: import("ace-code/src/mouse/mouse_handler").MouseHandler) => void;
    }
}
declare module "ace-code/src/tooltip" {
    export class HoverTooltip extends Tooltip {
        constructor(parentNode?: HTMLElement);
        timeout: number;
        lastT: number;
        idleTime: number;
        lastEvent: import("ace-code/src/mouse/mouse_event").MouseEvent;
        waitForHover(): void;
        addToEditor(editor: Editor): void;
        removeFromEditor(editor: Editor): void;
        isOutsideOfText(e: MouseEvent): boolean;
        setDataProvider(value: (event: MouseEvent, editor: Editor) => void): void;
        showForRange(editor: Editor, range: Range, domNode: HTMLElement, startingEvent: MouseEvent): void;
        range: Range;
        addMarker(range: Range, session?: EditSession): void;
        marker: number;
        row: number;
    }
    export type Editor = import("ace-code/src/editor").Editor;
    export type MouseEvent = import("ace-code/src/mouse/mouse_event").MouseEvent;
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    export var popupManager: PopupManager;
    export class Tooltip {
        constructor(parentNode: Element);
        isOpen: boolean;
        getElement(): HTMLElement;
        setText(text: string): void;
        setHtml(html: string): void;
        setPosition(x: number, y: number): void;
        setClassName(className: string): void;
        setTheme(theme: import("ace-code").Ace.Theme): void;
        show(text?: string, x?: number, y?: number): void;
        hide(e: any): void;
        getHeight(): number;
        getWidth(): number;
        destroy(): void;
    }
    import { Range } from "ace-code/src/range";
    class PopupManager {
        popups: Tooltip[];
        addPopup(popup: Tooltip): void;
        removePopup(popup: Tooltip): void;
        updatePopups(): void;
        doPopupsOverlap(popupA: Tooltip, popupB: Tooltip): boolean;
    }
    export interface HoverTooltip {
        row: number;
    }
}
declare module "ace-code/src/mouse/default_gutter_handler" {
    export function GutterHandler(this: import("ace-code/src/mouse/mouse_handler").MouseHandler, mouseHandler: MouseHandler): void;
    export interface GutterHandler {
    }
    export type MouseHandler = import("ace-code/src/mouse/mouse_handler").MouseHandler;
    export class GutterTooltip extends Tooltip {
        static get annotationLabels(): {
            error: {
                singular: any;
                plural: any;
            };
            security: {
                singular: any;
                plural: any;
            };
            warning: {
                singular: any;
                plural: any;
            };
            info: {
                singular: any;
                plural: any;
            };
            hint: {
                singular: any;
                plural: any;
            };
        };
        static annotationsToSummaryString(annotations: any): string;
        constructor(editor: any);
        editor: any;
        visibleTooltipRow: number | undefined;
        setPosition(x: any, y: any): void;
        showTooltip(row: any): void;
        hideTooltip(): void;
    }
    import { Tooltip } from "ace-code/src/tooltip";
    export interface GutterHandler {
    }
}
declare module "ace-code/src/mouse/dragdrop_handler" {
    export type MouseHandler = import("ace-code/src/mouse/mouse_handler").MouseHandler;
    export function DragdropHandler(mouseHandler: MouseHandler): void;
    export class DragdropHandler {
        constructor(mouseHandler: MouseHandler);
        onDragStart: (this: import("ace-code/src/mouse/mouse_handler").MouseHandler, e: any) => any;
        onDragEnd: (this: import("ace-code/src/mouse/mouse_handler").MouseHandler, e: any) => any;
        onDragEnter: (this: import("ace-code/src/mouse/mouse_handler").MouseHandler, e: any) => any;
        onDragOver: (this: import("ace-code/src/mouse/mouse_handler").MouseHandler, e: any) => any;
        onDragLeave: (e: any) => void;
        onDrop: (this: import("ace-code/src/mouse/mouse_handler").MouseHandler, e: any) => any;
    }
}
declare module "ace-code/src/mouse/touch_handler" {
    export function addTouchListeners(el: any, editor: any): void;
}
declare module "ace-code/src/mouse/mouse_handler" {
    export class MouseHandler {
        constructor(editor: Editor);
        mouseEvent: MouseEvent;
        editor: import("ace-code/src/editor").Editor;
        onMouseEvent(name: any, e: any): void;
        onMouseMove(name: any, e: any): void;
        onMouseWheel(name: any, e: {
            wheelX: number;
            wheelY: number;
        }): void;
        setState(state: any): void;
        state: any;
        captureMouse(ev: any, mouseMoveHandler: any): number;
        x: any;
        y: any;
        isMousePressed: boolean;
        releaseMouse: (e: any) => void;
        cancelContextMenu(): void;
        destroy(): void;
        cancelDrag?: boolean;
        mousedownEvent?: import("ace-code").Ace.MouseEvent;
        startSelect?: (pos?: import("ace-code").Ace.Point, waitForClickSelection?: boolean) => void;
        select?: () => void;
        selectEnd?: () => void;
    }
    export type Editor = import("ace-code/src/editor").Editor;
    import { MouseEvent } from "ace-code/src/mouse/mouse_event";
    namespace Ace {
        type Range = import("ace-code").Ace.Range;
        type MouseEvent = import("ace-code").Ace.MouseEvent;
        type Point = import("ace-code").Ace.Point;
    }
    export interface MouseHandler {
        cancelDrag?: boolean;
        mousedownEvent?: Ace.MouseEvent;
        startSelect?: (pos?: Ace.Point, waitForClickSelection?: boolean) => void;
        select?: () => void;
        selectEnd?: () => void;
    }
}
declare module "ace-code/src/mouse/fold_handler" {
    export class FoldHandler {
        constructor(editor: any);
    }
}
declare module "ace-code/src/keyboard/keybinding" {
    export type Editor = import("ace-code/src/editor").Editor;
    export type KeyboardHandler = import("ace-code").Ace.KeyboardHandler;
    export class KeyBinding {
        constructor(editor: Editor);
        setDefaultHandler(kb: KeyboardHandler): void;
        setKeyboardHandler(kb: KeyboardHandler): void;
        addKeyboardHandler(kb?: KeyboardHandler & {
            attach?: (editor: any) => void;
            detach?: (editor: any) => void;
        }, pos?: number): void;
        removeKeyboardHandler(kb: KeyboardHandler & {
            attach?: (editor: any) => void;
            detach?: (editor: any) => void;
        }): boolean;
        getKeyboardHandler(): KeyboardHandler;
        getStatusText(): string;
    }
}
declare module "ace-code/src/search" {
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    export type SearchOptions = import("ace-code").Ace.SearchOptions;
    /**
     * A class designed to handle all sorts of text searches within a [[Document `Document`]].
     **/
    export class Search {
        /**
         * Sets the search options via the `options` parameter.
         * @param {Partial<SearchOptions>} options An object containing all the new search properties
         * @chainable
        **/
        set(options: Partial<SearchOptions>): Search;
        /**
         * [Returns an object containing all the search options.]{: #Search.getOptions}
        **/
        getOptions(): Partial<SearchOptions>;
        /**
         * Sets the search options via the `options` parameter.
         * @param {Partial<SearchOptions>} options object containing all the search propertie
         * @related Search.set
        **/
        setOptions(options: Partial<SearchOptions>): void;
        /**
         * Searches for `options.needle`. If found, this method returns the [[Range `Range`]] where the text first occurs. If `options.backwards` is `true`, the search goes backwards in the session.
         * @param {EditSession} session The session to search with
         **/
        find(session: EditSession): Range | null | false;
        /**
         * Searches for all occurrances `options.needle`. If found, this method returns an array of [[Range `Range`s]] where the text first occurs. If `options.backwards` is `true`, the search goes backwards in the session.
         * @param {EditSession} session The session to search with
        **/
        findAll(session: EditSession): Range[];
        /**
         * Searches for `options.needle` in `input`, and, if found, replaces it with `replacement`.
         * @param {String} input The text to search in
         * @param {any} replacement The replacing text
         * + (String): If `options.regExp` is `true`, this function returns `input` with the replacement already made. Otherwise, this function just returns `replacement`.<br/>
         * If `options.needle` was not found, this function returns `null`.
         *
         *
        **/
        replace(input: string, replacement: any): string;
    }
    import { Range } from "ace-code/src/range";
}
declare module "ace-code/src/keyboard/hash_handler" {
    export type Command = import("ace-code").Ace.Command;
    export type CommandLike = import("ace-code").Ace.CommandLike;
    export class HashHandler extends MultiHashHandler {
    }
    export namespace HashHandler {
        function call(thisArg: any, config: any, platform: any): void;
    }
    export class MultiHashHandler {
        constructor(config?: Record<string, CommandLike> | Command[], platform?: string);
        platform: string;
        commands: Record<string, Command>;
        commandKeyBinding: {};
        addCommand(command: Command): void;
        removeCommand(command: Command | string, keepCommand?: boolean): void;
        bindKey(key: string | {
            win?: string;
            mac?: string;
            position?: number;
        }, command: CommandLike | string, position?: number): void;
        addCommands(commands?: Record<string, CommandLike> | Command[]): void;
        removeCommands(commands: Record<string, CommandLike | string>): void;
        bindKeys(keyList: Record<string, CommandLike | string>): void;
        /**
         * Accepts keys in the form ctrl+Enter or ctrl-Enter
         * keys without modifiers or shift only
         */
        parseKeys(keys: string): {
            key: string;
            hashId: number;
        } | false;
        findKeyCommand(hashId: number, keyString: string): Command;
        handleKeyboard(data: any, hashId: number, keyString: string, keyCode: number): {
            command: string;
        } | void;
        getStatusText(editor?: any, data?: any): string;
    }
    export namespace MultiHashHandler {
        function call(thisArg: any, config: any, platform: any): void;
    }
}
declare module "ace-code/src/commands/command_manager" {
    const CommandManager_base: typeof MultiHashHandler;
    export class CommandManager extends MultiHashHandler {
        /**
         * new CommandManager(platform, commands)
         * @param {String} platform Identifier for the platform; must be either `"mac"` or `"win"`
         * @param {any[]} commands A list of commands
         **/
        constructor(platform: string, commands: any[]);
        byName: Record<string, import("ace-code").Ace.Command>;
        exec(command: string | string[] | import("ace-code").Ace.Command, editor: Editor, args: any): boolean;
        canExecute(command: string | import("ace-code").Ace.Command, editor: Editor): boolean;
        toggleRecording(editor: Editor): boolean;
        macro: any;
        recording: boolean;
        oldMacro: any;
        replay(editor: Editor): boolean;
        trimMacro(m: any): any;
    }
    export type Editor = import("ace-code/src/editor").Editor;
    import { MultiHashHandler } from "ace-code/src/keyboard/hash_handler";
    namespace Ace {
        type EventEmitter<T extends {
            [K in keyof T]: (...args: any[]) => any;
        }> = import("ace-code").Ace.EventEmitter<T>;
    }
    export interface CommandManager extends Ace.EventEmitter<any> {
    }
}
declare module "ace-code/src/commands/default_commands" {
    export const commands: import("ace-code").Ace.Command[];
}
declare module "ace-code/src/token_iterator" {
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    /**
     * This class provides an essay way to treat the document as a stream of tokens, and provides methods to iterate over these tokens.
     **/
    export class TokenIterator {
        /**
         * Creates a new token iterator object. The inital token index is set to the provided row and column coordinates.
         * @param {EditSession} session The session to associate with
         * @param {Number} initialRow The row to start the tokenizing at
         * @param {Number} initialColumn The column to start the tokenizing at
         **/
        constructor(session: EditSession, initialRow: number, initialColumn: number);
        /**
         * Moves iterator position to the start of previous token.
         **/
        stepBackward(): import("ace-code").Ace.Token | null;
        /**
         * Moves iterator position to the start of next token.
         **/
        stepForward(): import("ace-code").Ace.Token | null;
        /**
         *
         * Returns current token.
         **/
        getCurrentToken(): import("ace-code").Ace.Token;
        /**
         *
         * Returns the current row.
         **/
        getCurrentTokenRow(): number;
        /**
         *
         * Returns the current column.
         **/
        getCurrentTokenColumn(): number;
        /**
         * Return the current token position.
         */
        getCurrentTokenPosition(): import("ace-code").Ace.Point;
        /**
         * Return the current token range.
         */
        getCurrentTokenRange(): Range;
    }
    import { Range } from "ace-code/src/range";
}
declare module "ace-code/src/keyboard/gutter_handler" {
    export class GutterKeyboardHandler {
        constructor(editor: any);
        editor: any;
        gutterLayer: any;
        element: any;
        lines: any;
        activeRowIndex: any;
        activeLane: string;
        annotationTooltip: GutterTooltip;
        addListener(): void;
        removeListener(): void;
        lane: any;
    }
    export class GutterKeyboardEvent {
        constructor(domEvent: any, gutterKeyboardHandler: any);
        gutterKeyboardHandler: any;
        domEvent: any;
        /**
         * Returns the key that was presssed.
         *
         * @return {string} the key that was pressed.
         */
        getKey(): string;
        /**
         * Returns the row in the gutter that was focused after the keyboard event was handled.
         *
         * @return {number} the key that was pressed.
         */
        getRow(): number;
        /**
         * Returns whether focus is on the annotation lane after the keyboard event was handled.
         *
         * @return {boolean} true if focus was on the annotation lane after the keyboard event.
         */
        isInAnnotationLane(): boolean;
        /**
         * Returns whether focus is on the fold lane after the keyboard event was handled.
         *
         * @return {boolean} true if focus was on the fold lane after the keyboard event.
         */
        isInFoldLane(): boolean;
    }
    import { GutterTooltip } from "ace-code/src/mouse/default_gutter_handler";
}
declare module "ace-code/src/editor" {
    /**
     * The main entry point into the Ace functionality.
     *
     * The `Editor` manages the [[EditSession]] (which manages [[Document]]s), as well as the [[VirtualRenderer]], which draws everything to the screen.
     *
     * Event sessions dealing with the mouse and keyboard are bubbled up from `Document` to the `Editor`, which decides what to do with them.
     **/
    export class Editor {
        /**
         * Creates a new `Editor` object.
         *
         * @param {VirtualRenderer} renderer Associated `VirtualRenderer` that draws everything
         * @param {EditSession} [session] The `EditSession` to refer to
         * @param {Partial<import("ace-code").Ace.EditorOptions>} [options] The default options
         **/
        constructor(renderer: VirtualRenderer, session?: EditSession, options?: Partial<import("ace-code").Ace.EditorOptions>);
        session: EditSession;
        container: HTMLElement & {
            env?: any;
            value?: any;
        };
        renderer: VirtualRenderer;
        id: string;
        commands: CommandManager;
        textInput: any;
        keyBinding: KeyBinding;
        startOperation(commandEvent: any): void;
        /**
         * @arg e
         */
        endOperation(e: any): void;
        onStartOperation(commandEvent: any): void;
        curOp: {};
        prevOp: {};
        previousCommand: any;
        /**
         * @arg e
         */
        onEndOperation(e: any): void;
        mergeNextCommand: boolean;
        sequenceStartTime: number;
        /**
         * Sets a new key handler, such as "vim" or "windows".
         * @param {String | import("ace-code").Ace.KeyboardHandler | null} keyboardHandler The new key handler
         **/
        setKeyboardHandler(keyboardHandler: string | import("ace-code").Ace.KeyboardHandler | null, cb?: () => void): void;
        /**
         * Returns the keyboard handler, such as "vim" or "windows".
         **/
        getKeyboardHandler(): any;
        /**
         * Sets a new editsession to use. This method also emits the `'changeSession'` event.
         * @param {EditSession} [session] The new session to use
         **/
        setSession(session?: EditSession): void;
        selection: import("ace-code/src/selection").Selection;
        /**
         * Returns the current session being used.
         **/
        getSession(): EditSession;
        /**
         * Sets the current document to `val`.
         * @param {String} val The new value to set for the document
         * @param {Number} [cursorPos] Where to set the new value. `undefined` or 0 is selectAll, -1 is at the document start, and 1 is at the end
         *
         * @returns {String} The current document value
         * @related Document.setValue
         **/
        setValue(val: string, cursorPos?: number): string;
        /**
         * Returns the current session's content.
         *
         * @related EditSession.getValue
         **/
        getValue(): string;
        /**
         *
         * Returns the currently highlighted selection.
         * @returns {Selection} The selection object
         **/
        getSelection(): Selection;
        /**
         * {:VirtualRenderer.onResize}
         * @param {Boolean} [force] If `true`, recomputes the size, even if the height and width haven't changed
         * @related VirtualRenderer.onResize
         **/
        resize(force?: boolean): void;
        /**
         * {:VirtualRenderer.setTheme}
         * @param {string | import("ace-code").Ace.Theme} theme The path to a theme
         * @param {() => void} [cb] optional callback called when theme is loaded
         **/
        setTheme(theme: string | import("ace-code").Ace.Theme, cb?: () => void): void;
        /**
         * {:VirtualRenderer.getTheme}
         *
         * @returns {String} The set theme
         * @related VirtualRenderer.getTheme
         **/
        getTheme(): string;
        /**
         * {:VirtualRenderer.setStyle}
         * @param {String} style A class name
         * @related VirtualRenderer.setStyle
         **/
        setStyle(style: string): void;
        /**
         * {:VirtualRenderer.unsetStyle}
         * @related VirtualRenderer.unsetStyle
         */
        unsetStyle(style: string): void;
        /**
         * Gets the current font size of the editor text.
         */
        getFontSize(): string | number;
        /**
         * Set a new font size (in pixels) for the editor text.
         * @param {String | number} size A font size ( _e.g._ "12px")
         **/
        setFontSize(size: string | number): void;
        /**
         *
         * Brings the current `textInput` into focus.
         **/
        focus(): void;
        /**
         * Returns `true` if the current `textInput` is in focus.
         **/
        isFocused(): boolean;
        /**
         *
         * Blurs the current `textInput`.
         **/
        blur(): void;
        /**
         * Returns the string of text currently highlighted.
         **/
        getCopyText(): string;
        execCommand(command: string | string[], args?: any): boolean;
        /**
         * Inserts `text` into wherever the cursor is pointing.
         * @param {String} text The new text to add
         **/
        insert(text: string, pasted?: boolean): void;
        autoIndent(): void;
        applyComposition(text?: string, composition?: any): void;
        /**
         * Pass in `true` to enable overwrites in your session, or `false` to disable. If overwrites is enabled, any text you enter will type over any text after it. If the value of `overwrite` changes, this function also emits the `changeOverwrite` event.
         * @param {Boolean} overwrite Defines whether or not to set overwrites
         * @related EditSession.setOverwrite
         **/
        setOverwrite(overwrite: boolean): void;
        /**
         * Returns `true` if overwrites are enabled; `false` otherwise.
         * @related EditSession.getOverwrite
         **/
        getOverwrite(): boolean;
        /**
         * Sets the value of overwrite to the opposite of whatever it currently is.
         * @related EditSession.toggleOverwrite
         **/
        toggleOverwrite(): void;
        /**
         * Sets how fast the mouse scrolling should do.
         * @param {Number} speed A value indicating the new speed (in milliseconds)
         **/
        setScrollSpeed(speed: number): void;
        /**
         * Returns the value indicating how fast the mouse scroll speed is (in milliseconds).
         **/
        getScrollSpeed(): number;
        /**
         * Sets the delay (in milliseconds) of the mouse drag.
         * @param {Number} dragDelay A value indicating the new delay
         **/
        setDragDelay(dragDelay: number): void;
        /**
         * Returns the current mouse drag delay.
         **/
        getDragDelay(): number;
        /**
         * Draw selection markers spanning whole line, or only over selected text. Default value is "line"
         * @param {"fullLine" | "screenLine" | "text" | "line"} val The new selection style "line"|"text"
         **/
        setSelectionStyle(val: "fullLine" | "screenLine" | "text" | "line"): void;
        /**
         * Returns the current selection style.
         **/
        getSelectionStyle(): import("ace-code").Ace.EditorOptions["selectionStyle"];
        /**
         * Determines whether or not the current line should be highlighted.
         * @param {Boolean} shouldHighlight Set to `true` to highlight the current line
         **/
        setHighlightActiveLine(shouldHighlight: boolean): void;
        /**
         * Returns `true` if current lines are always highlighted.
         **/
        getHighlightActiveLine(): boolean;
        setHighlightGutterLine(shouldHighlight: boolean): void;
        getHighlightGutterLine(): boolean;
        /**
         * Determines if the currently selected word should be highlighted.
         * @param {Boolean} shouldHighlight Set to `true` to highlight the currently selected word
         **/
        setHighlightSelectedWord(shouldHighlight: boolean): void;
        /**
         * Returns `true` if currently highlighted words are to be highlighted.
         **/
        getHighlightSelectedWord(): boolean;
        setAnimatedScroll(shouldAnimate: boolean): void;
        getAnimatedScroll(): boolean;
        /**
         * If `showInvisibles` is set to `true`, invisible characters&mdash;like spaces or new lines&mdash;are show in the editor.
         * @param {Boolean} showInvisibles Specifies whether or not to show invisible characters
         **/
        setShowInvisibles(showInvisibles: boolean): void;
        /**
         * Returns `true` if invisible characters are being shown.
         **/
        getShowInvisibles(): boolean;
        setDisplayIndentGuides(display: boolean): void;
        getDisplayIndentGuides(): boolean;
        setHighlightIndentGuides(highlight: boolean): void;
        getHighlightIndentGuides(): boolean;
        /**
         * If `showPrintMargin` is set to `true`, the print margin is shown in the editor.
         * @param {Boolean} showPrintMargin Specifies whether or not to show the print margin
         *
         **/
        setShowPrintMargin(showPrintMargin: boolean): void;
        /**
         * Returns `true` if the print margin is being shown.
         **/
        getShowPrintMargin(): boolean;
        /**
         * Sets the column defining where the print margin should be.
         * @param {Number} showPrintMargin Specifies the new print margin
         *
         **/
        setPrintMarginColumn(showPrintMargin: number): void;
        /**
         * Returns the column number of where the print margin is.
         **/
        getPrintMarginColumn(): number;
        /**
         * If `readOnly` is true, then the editor is set to read-only mode, and none of the content can change.
         * @param {Boolean} readOnly Specifies whether the editor can be modified or not
         **/
        setReadOnly(readOnly: boolean): void;
        /**
         * Returns `true` if the editor is set to read-only mode.
         **/
        getReadOnly(): boolean;
        /**
         * Specifies whether to use behaviors or not. ["Behaviors" in this case is the auto-pairing of special characters, like quotation marks, parenthesis, or brackets.]{: #BehaviorsDef}
         * @param {Boolean} enabled Enables or disables behaviors
         **/
        setBehavioursEnabled(enabled: boolean): void;
        /**
         * Returns `true` if the behaviors are currently enabled. {:BehaviorsDef}
         **/
        getBehavioursEnabled(): boolean;
        /**
         * Specifies whether to use wrapping behaviors or not, i.e. automatically wrapping the selection with characters such as brackets
         * when such a character is typed in.
         * @param {Boolean} enabled Enables or disables wrapping behaviors
         **/
        setWrapBehavioursEnabled(enabled: boolean): void;
        /**
         * Returns `true` if the wrapping behaviors are currently enabled.
         **/
        getWrapBehavioursEnabled(): boolean;
        /**
         * Indicates whether the fold widgets should be shown or not.
         * @param {Boolean} show Specifies whether the fold widgets are shown
         **/
        setShowFoldWidgets(show: boolean): void;
        /**
         * Returns `true` if the fold widgets are shown.
         **/
        getShowFoldWidgets(): boolean;
        setFadeFoldWidgets(fade: boolean): void;
        getFadeFoldWidgets(): boolean;
        /**
         * Removes the current selection or one character.
         * @param {'left' | 'right'} [dir] The direction of the deletion to occur, either "left" or "right"
         **/
        remove(dir?: "left" | "right"): void;
        /**
         * Removes the word directly to the right of the current selection.
         **/
        removeWordRight(): void;
        /**
         * Removes the word directly to the left of the current selection.
         **/
        removeWordLeft(): void;
        /**
         * Removes all the words to the left of the current selection, until the start of the line.
         **/
        removeToLineStart(): void;
        /**
         * Removes all the words to the right of the current selection, until the end of the line.
         **/
        removeToLineEnd(): void;
        /**
         * Splits the line at the current selection (by inserting an `'\n'`).
         **/
        splitLine(): void;
        /**
         * Set the "ghost" text in provided position. "Ghost" text is a kind of
         * preview text inside the editor which can be used to preview some code
         * inline in the editor such as, for example, code completions.
         *
         * @param {String} text Text to be inserted as "ghost" text
         * @param {Point} [position] Position to insert text to
         */
        setGhostText(text: string, position?: Point): void;
        /**
         * Removes "ghost" text currently displayed in the editor.
         */
        removeGhostText(): void;
        /**
         * Transposes current line.
         **/
        transposeLetters(): void;
        /**
         * Converts the current selection entirely into lowercase.
         **/
        toLowerCase(): void;
        /**
         * Converts the current selection entirely into uppercase.
         **/
        toUpperCase(): void;
        /**
         * Inserts an indentation into the current cursor position or indents the selected lines.
         *
         * @related EditSession.indentRows
         **/
        indent(): void;
        /**
         * Indents the current line.
         * @related EditSession.indentRows
         **/
        blockIndent(): void;
        /**
         * Outdents the current line.
         * @related EditSession.outdentRows
         **/
        blockOutdent(): void;
        sortLines(): void;
        /**
         * Given the currently selected range, this function either comments all the lines, or uncomments all of them.
         **/
        toggleCommentLines(): void;
        toggleBlockComment(): void;
        /**
         * Works like [[EditSession.getTokenAt]], except it returns a number.
         **/
        getNumberAt(row: any, column: any): any;
        /**
         * If the character before the cursor is a number, this functions changes its value by `amount`.
         * @param {Number} amount The value to change the numeral by (can be negative to decrease value)
         **/
        modifyNumber(amount: number): void;
        toggleWord(): void;
        /**
         * Finds link at defined {row} and {column}
         **/
        findLinkAt(row: any, column: any): string;
        /**
         * Open valid url under cursor in another tab
         **/
        openLink(): boolean;
        /**
         * Removes all the lines in the current selection
         * @related EditSession.remove
         **/
        removeLines(): void;
        duplicateSelection(): void;
        /**
         * Shifts all the selected lines down one row.
         *
         * @related EditSession.moveLinesUp
         **/
        moveLinesDown(): void;
        /**
         * Shifts all the selected lines up one row.
         * @related EditSession.moveLinesDown
         **/
        moveLinesUp(): void;
        /**
         * Moves a range of text from the given range to the given position. `toPosition` is an object that looks like this:
         * ```json
         *    { row: newRowLocation, column: newColumnLocation }
         * ```
         * @param {Range} range The range of text you want moved within the document
         * @param {Point} toPosition The location (row and column) where you want to move the text to
         *
         * @returns {Range} The new range where the text was moved to.
         * @related EditSession.moveText
         **/
        moveText(range: Range, toPosition: Point, copy?: boolean): Range;
        /**
         * Copies all the selected lines up one row.
         *
         **/
        copyLinesUp(): void;
        /**
         * Copies all the selected lines down one row.
         * @related EditSession.duplicateLines
         *
         **/
        copyLinesDown(): void;
        inVirtualSelectionMode: boolean;
        /**
         * {:VirtualRenderer.getFirstVisibleRow}
         *
         * @related VirtualRenderer.getFirstVisibleRow
         **/
        getFirstVisibleRow(): number;
        /**
         * {:VirtualRenderer.getLastVisibleRow}
         *
         * @related VirtualRenderer.getLastVisibleRow
         **/
        getLastVisibleRow(): number;
        /**
         * Indicates if the row is currently visible on the screen.
         * @param {Number} row The row to check
         *
         **/
        isRowVisible(row: number): boolean;
        /**
         * Indicates if the entire row is currently visible on the screen.
         * @param {Number} row The row to check
         *
         *
         **/
        isRowFullyVisible(row: number): boolean;
        /**
         * Selects the text from the current position of the document until where a "page down" finishes.
         **/
        selectPageDown(): void;
        /**
         * Selects the text from the current position of the document until where a "page up" finishes.
         **/
        selectPageUp(): void;
        /**
         * Shifts the document to wherever "page down" is, as well as moving the cursor position.
         **/
        gotoPageDown(): void;
        /**
         * Shifts the document to wherever "page up" is, as well as moving the cursor position.
         **/
        gotoPageUp(): void;
        /**
         * Scrolls the document to wherever "page down" is, without changing the cursor position.
         **/
        scrollPageDown(): void;
        /**
         * Scrolls the document to wherever "page up" is, without changing the cursor position.
         **/
        scrollPageUp(): void;
        /**
         * Moves the editor to the specified row.
         * @related VirtualRenderer.scrollToRow
         */
        scrollToRow(row: number): void;
        /**
         * Scrolls to a line. If `center` is `true`, it puts the line in middle of screen (or attempts to).
         * @param {Number} line The line to scroll to
         * @param {Boolean} center If `true`
         * @param {Boolean} animate If `true` animates scrolling
         * @param {() => void} [callback] Function to be called when the animation has finished
         *
         * @related VirtualRenderer.scrollToLine
         **/
        scrollToLine(line: number, center: boolean, animate: boolean, callback?: () => void): void;
        /**
         * Attempts to center the current selection on the screen.
         **/
        centerSelection(): void;
        /**
         * Gets the current position of the cursor.
         * @returns {Point} An object that looks something like this:
         *
         * ```json
         * { row: currRow, column: currCol }
         * ```
         *
         * @related Selection.getCursor
         **/
        getCursorPosition(): Point;
        /**
         * Returns the screen position of the cursor.
         * @related EditSession.documentToScreenPosition
         **/
        getCursorPositionScreen(): Point;
        /**
         * {:Selection.getRange}
         * @related Selection.getRange
         **/
        getSelectionRange(): Range;
        /**
         * Selects all the text in editor.
         * @related Selection.selectAll
         **/
        selectAll(): void;
        /**
         * {:Selection.clearSelection}
         * @related Selection.clearSelection
         **/
        clearSelection(): void;
        /**
         * Moves the cursor to the specified row and column. Note that this does not de-select the current selection.
         * @param {Number} row The new row number
         * @param {Number} column The new column number
         * @related Selection.moveCursorTo
         **/
        moveCursorTo(row: number, column: number): void;
        /**
         * Moves the cursor to the position indicated by `pos.row` and `pos.column`.
         * @param {Point} pos An object with two properties, row and column
         * @related Selection.moveCursorToPosition
         **/
        moveCursorToPosition(pos: Point): void;
        /**
         * Moves the cursor's row and column to the next matching bracket or HTML tag.
         */
        jumpToMatching(select?: boolean, expand?: boolean): void;
        /**
         * Moves the cursor to the specified line number, and also into the indicated column.
         * @param {Number} lineNumber The line number to go to
         * @param {Number} [column] A column number to go to
         * @param {Boolean} [animate] If `true` animates scolling
         **/
        gotoLine(lineNumber: number, column?: number, animate?: boolean): void;
        /**
         * Moves the cursor to the specified row and column. Note that this does de-select the current selection.
         * @param {Number} row The new row number
         * @param {Number} column The new column number
         *
         * @related Editor.moveCursorTo
         **/
        navigateTo(row: number, column: number): void;
        /**
         * Moves the cursor up in the document the specified number of times. Note that this does de-select the current selection.
         * @param {Number} [times] The number of times to change navigation
         *
         **/
        navigateUp(times?: number): void;
        /**
         * Moves the cursor down in the document the specified number of times. Note that this does de-select the current selection.
         * @param {Number} [times] The number of times to change navigation
         *
         **/
        navigateDown(times?: number): void;
        /**
         * Moves the cursor left in the document the specified number of times. Note that this does de-select the current selection.
         * @param {Number} [times] The number of times to change navigation
         *
         **/
        navigateLeft(times?: number): void;
        /**
         * Moves the cursor right in the document the specified number of times. Note that this does de-select the current selection.
         * @param {Number} [times] The number of times to change navigation
         *
         **/
        navigateRight(times?: number): void;
        /**
         *
         * Moves the cursor to the start of the current line. Note that this does de-select the current selection.
         **/
        navigateLineStart(): void;
        /**
         *
         * Moves the cursor to the end of the current line. Note that this does de-select the current selection.
         **/
        navigateLineEnd(): void;
        /**
         *
         * Moves the cursor to the end of the current file. Note that this does de-select the current selection.
         **/
        navigateFileEnd(): void;
        /**
         *
         * Moves the cursor to the start of the current file. Note that this does de-select the current selection.
         **/
        navigateFileStart(): void;
        /**
         *
         * Moves the cursor to the word immediately to the right of the current position. Note that this does de-select the current selection.
         **/
        navigateWordRight(): void;
        /**
         *
         * Moves the cursor to the word immediately to the left of the current position. Note that this does de-select the current selection.
         **/
        navigateWordLeft(): void;
        /**
         * Replaces the first occurrence of `options.needle` with the value in `replacement`.
         * @param {String} [replacement] The text to replace with
         * @param {Partial<SearchOptions>} [options] The [[Search `Search`]] options to use
         **/
        replace(replacement?: string, options?: Partial<SearchOptions>): number;
        /**
         * Replaces all occurrences of `options.needle` with the value in `replacement`.
         * @param {String} [replacement] The text to replace with
         * @param {Partial<SearchOptions>} [options] The [[Search `Search`]] options to use
         **/
        replaceAll(replacement?: string, options?: Partial<SearchOptions>): number;
        /**
         * {:Search.getOptions} For more information on `options`, see [[Search `Search`]].
         * @related Search.getOptions
         **/
        getLastSearchOptions(): Partial<SearchOptions>;
        /**
         * Attempts to find `needle` within the document. For more information on `options`, see [[Search `Search`]].
         * @param {String|RegExp|Object} needle The text to search for (optional)
         * @param {Partial<SearchOptions>} [options] An object defining various search properties
         * @param {Boolean} [animate] If `true` animate scrolling
         * @related Search.find
         **/
        find(needle: string | RegExp | any, options?: Partial<SearchOptions>, animate?: boolean): false | Range;
        /**
         * Performs another search for `needle` in the document. For more information on `options`, see [[Search `Search`]].
         * @param {Partial<SearchOptions>} [options] search options
         * @param {Boolean} [animate] If `true` animate scrolling
         *
         * @related Editor.find
         **/
        findNext(options?: Partial<SearchOptions>, animate?: boolean): void;
        /**
         * Performs a search for `needle` backwards. For more information on `options`, see [[Search `Search`]].
         * @param {Partial<SearchOptions>} [options] search options
         * @param {Boolean} [animate] If `true` animate scrolling
         *
         * @related Editor.find
         **/
        findPrevious(options?: Partial<SearchOptions>, animate?: boolean): void;
        revealRange(range: Range, animate?: boolean): void;
        /**
         * {:UndoManager.undo}
         * @related UndoManager.undo
         **/
        undo(): void;
        /**
         * {:UndoManager.redo}
         * @related UndoManager.redo
         **/
        redo(): void;
        /**
         *
         * Cleans up the entire editor.
         **/
        destroy(): void;
        /**
         * Enables automatic scrolling of the cursor into view when editor itself is inside scrollable element
         * @param {Boolean} enable default true
         **/
        setAutoScrollEditorIntoView(enable: boolean): void;
        /**
         * opens a prompt displaying message
         **/
        prompt(message: any, options: any, callback: any): void;
        env?: any;
        widgetManager?: import("ace-code").Ace.LineWidgets;
        completer?: import("ace-code").Ace.Autocomplete | import("ace-code").Ace.InlineAutocomplete;
        completers: import("ace-code").Ace.Completer[];
        showKeyboardShortcuts?: () => void;
        showSettingsMenu?: () => void;
        searchBox?: import("ace-code").Ace.SearchBox;
    }
    export namespace Editor {
        export { $uid };
    }
    export type VirtualRenderer = import("ace-code/src/virtual_renderer").VirtualRenderer;
    export type Selection = import("ace-code/src/selection").Selection;
    export type Point = import("ace-code").Ace.Point;
    export type SearchOptions = import("ace-code").Ace.SearchOptions;
    import { EditSession } from "ace-code/src/edit_session";
    import { CommandManager } from "ace-code/src/commands/command_manager";
    import { MouseHandler } from "ace-code/src/mouse/mouse_handler";
    import { KeyBinding } from "ace-code/src/keyboard/keybinding";
    import { Search } from "ace-code/src/search";
    import { Range } from "ace-code/src/range";
    var $uid: number;
    namespace Ace {
        type EditorMultiSelectProperties = import("ace-code").Ace.EditorMultiSelectProperties;
        type OptionsProvider<T> = import("ace-code").Ace.OptionsProvider<T>;
        type EditorOptions = import("ace-code").Ace.EditorOptions;
        type EventEmitter<T extends {
            [K in keyof T]: (...args: any[]) => any;
        }> = import("ace-code").Ace.EventEmitter<T>;
        type EditorEvents = import("ace-code").Ace.EditorEvents;
        type CodeLenseEditorExtension = import("ace-code").Ace.CodeLenseEditorExtension;
        type ElasticTabstopsEditorExtension = import("ace-code").Ace.ElasticTabstopsEditorExtension;
        type TextareaEditorExtension = import("ace-code").Ace.TextareaEditorExtension;
        type PromptEditorExtension = import("ace-code").Ace.PromptEditorExtension;
        type OptionsEditorExtension = import("ace-code").Ace.OptionsEditorExtension;
        type EditSession = import("ace-code").Ace.EditSession;
        type LineWidgets = import("ace-code").Ace.LineWidgets;
        type Autocomplete = import("ace-code").Ace.Autocomplete;
        type InlineAutocomplete = import("ace-code").Ace.InlineAutocomplete;
        type Completer = import("ace-code").Ace.Completer;
        type SearchBox = import("ace-code").Ace.SearchBox;
    }
    export interface Editor extends Ace.EditorMultiSelectProperties, Ace.OptionsProvider<Ace.EditorOptions>, Ace.EventEmitter<Ace.EditorEvents>, Ace.CodeLenseEditorExtension, Ace.ElasticTabstopsEditorExtension, Ace.TextareaEditorExtension, Ace.PromptEditorExtension, Ace.OptionsEditorExtension {
        session: Ace.EditSession;
        env?: any;
        widgetManager?: Ace.LineWidgets;
        completer?: Ace.Autocomplete | Ace.InlineAutocomplete;
        completers: Ace.Completer[];
        showKeyboardShortcuts?: () => void;
        showSettingsMenu?: () => void;
        searchBox?: Ace.SearchBox;
    }
}
declare module "ace-code/src/undomanager" {
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    export type Delta = import("ace-code").Ace.Delta;
    export type Point = import("ace-code").Ace.Point;
    export type IRange = import("ace-code").Ace.IRange;
    /**
     * This object maintains the undo stack for an [[EditSession `EditSession`]].
     **/
    export class UndoManager {
        addSession(session: EditSession): void;
        /**
         * Provides a means for implementing your own undo manager. `options` has one property, `args`, an [[Array `Array`]], with two elements:
         *
         * - `args[0]` is an array of deltas
         * - `args[1]` is the document to associate with
         *
         **/
        add(delta: import("ace-code").Ace.Delta, allowMerge: boolean, session?: EditSession): void;
        lastDeltas: any[];
        addSelection(selection: any, rev?: number): void;
        startNewGroup(): any;
        markIgnored(from: number, to?: number): void;
        getSelection(rev: number, after?: boolean): {
            value: string;
            rev: number;
        };
        getRevision(): number;
        getDeltas(from: number, to?: number): import("ace-code").Ace.Delta[];
        getChangedRanges(from: number, to?: number): void;
        getChangedLines(from: number, to?: number): void;
        /**
         * [Perform an undo operation on the document, reverting the last change.]{: #UndoManager.undo}
         **/
        undo(session: EditSession, dontSelect?: boolean): void;
        /**
         * [Perform a redo operation on the document, reimplementing the last change.]{: #UndoManager.redo}
         *
         **/
        redo(session: EditSession, dontSelect?: boolean): void;
        /**
         * Destroys the stack of undo and redo redo operations.
         **/
        reset(): void;
        mark: number;
        selections: any[];
        /**
         * Returns `true` if there are undo operations left to perform.
         **/
        canUndo(): boolean;
        /**
         * Returns `true` if there are redo operations left to perform.
         **/
        canRedo(): boolean;
        /**
         * Marks the current status clean
         */
        bookmark(rev?: number): void;
        /**
         * Returns if the current status is clean
         **/
        isAtBookmark(): boolean;
        /**
         * Returns an object which can be safely stringified into JSON
         */
        toJSON(): object;
        /**
         * Takes in an object which was returned from the toJSON method above,
         * and resets the current undoManager instance to use the previously exported
         * instance state.
         */
        fromJSON(json: object): void;
        hasUndo: () => boolean;
        hasRedo: () => boolean;
        isClean: () => boolean;
        markClean: (rev?: number) => void;
    }
}
declare module "ace-code/src/tokenizer" {
    /**
     * This class takes a set of highlighting rules, and creates a tokenizer out of them. For more information, see [the wiki on extending highlighters](https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode#wiki-extendingTheHighlighter).
     **/
    export class Tokenizer {
        /**
         * Constructs a new tokenizer based on the given rules and flags.
         * @param {Object} rules The highlighting rules
         **/
        constructor(rules: any);
        splitRegex: RegExp;
        states: any;
        regExps: {};
        matchMappings: {};
        removeCapturingGroups(src: string): string;
        createSplitterRegexp(src: string, flag: string): RegExp;
        /**
         * Returns an object containing two properties: `tokens`, which contains all the tokens; and `state`, the current state.
         */
        getLineTokens(line: string, startState: string | string[]): {
            tokens: import("ace-code").Ace.Token[];
            state: string | string[];
        };
        reportError: (msg: any, data: any) => void;
    }
}
declare module "ace-code/src/autocomplete/popup" {
    /**
     * This object is used in some places where needed to show popups - like prompt; autocomplete etc.
     */
    export class AcePopup {
        /**
         * Creates and renders single line editor in popup window. If `parentNode` param is isset, then attaching it to this element.
         */
        constructor(parentNode?: Element);
        setSelectOnHover: (val: boolean) => void;
        setRow: (line: number) => void;
        getRow: () => number;
        getHoveredRow: () => number;
        filterText: string;
        isOpen: boolean;
        isTopdown: boolean;
        autoSelect: boolean;
        data: import("ace-code").Ace.Completion[];
        setData: (data: import("ace-code").Ace.Completion[], filterText?: string) => void;
        getData: (row: number) => import("ace-code").Ace.Completion;
        hide: () => void;
        anchor: "top" | "bottom";
        anchorPosition: import("ace-code").Ace.Point;
        tryShow: (pos: any, lineHeight: number, anchor: "top" | "bottom", forceShow?: boolean) => boolean;
        show: (pos: any, lineHeight: number, topdownOnly?: boolean) => void;
        goTo: (where: import("ace-code").Ace.AcePopupNavigation) => void;
        getTextLeftOffset: () => number;
        anchorPos: any;
        isMouseOver?: boolean;
        selectedNode?: HTMLElement;
    }
    export function $singleLineEditor(el?: HTMLElement): Editor;
    export function getAriaId(index: any): string;
    import { Editor } from "ace-code/src/editor";
    namespace Ace {
        type AcePopupWithEditor = import("ace-code").Ace.AcePopupWithEditor;
        type Completion = import("ace-code").Ace.Completion;
        type Point = import("ace-code").Ace.Point;
        type AcePopupNavigation = import("ace-code").Ace.AcePopupNavigation;
    }
    export interface AcePopup extends Ace.AcePopupWithEditor {
        setSelectOnHover: (val: boolean) => void;
        setRow: (line: number) => void;
        getRow: () => number;
        getHoveredRow: () => number;
        filterText: string;
        isOpen: boolean;
        isTopdown: boolean;
        autoSelect: boolean;
        data: Ace.Completion[];
        setData: (data: Ace.Completion[], filterText?: string) => void;
        getData: (row: number) => Ace.Completion;
        hide: () => void;
        anchor: "top" | "bottom";
        anchorPosition: Ace.Point;
        tryShow: (pos: any, lineHeight: number, anchor: "top" | "bottom", forceShow?: boolean) => boolean;
        show: (pos: any, lineHeight: number, topdownOnly?: boolean) => void;
        goTo: (where: Ace.AcePopupNavigation) => void;
        getTextLeftOffset: () => number;
        anchorPos: any;
        isMouseOver?: boolean;
        selectedNode?: HTMLElement;
    }
}
declare module "ace-code/src/range_list" {
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    export type Point = import("ace-code").Ace.Point;
    export class RangeList {
        ranges: any[];
        pointIndex(pos: Point, excludeEdges?: boolean, startIndex?: number): number;
        add(range: Range): any[];
        addList(list: Range[]): any[];
        substractPoint(pos: Point): any[];
        merge(): any[];
        contains(row: number, column: number): boolean;
        containsPoint(pos: Point): boolean;
        rangeAtPoint(pos: Point): any;
        clipRows(startRow: number, endRow: number): any[];
        removeAll(): any[];
        attach(session: EditSession): void;
        session: import("ace-code/src/edit_session").EditSession;
        onChange: any;
        detach(): void;
        comparePoints: (p1: import("ace-code/src/range").Point, p2: import("ace-code/src/range").Point) => number;
    }
    import { Range } from "ace-code/src/range";
}
declare module "ace-code/src/snippets" {
    export const snippetManager: SnippetManager;
    export type Snippet = {
        content?: string;
        replaceBefore?: string;
        replaceAfter?: string;
        startRe?: RegExp;
        endRe?: RegExp;
        triggerRe?: RegExp;
        endTriggerRe?: RegExp;
        trigger?: string;
        endTrigger?: string;
        matchBefore?: string[];
        matchAfter?: string[];
        name?: string;
        tabTrigger?: string;
        guard?: string;
        endGuard?: string;
    };
    class SnippetManager {
        snippetMap: {};
        snippetNameMap: {};
        variables: {
            CURRENT_WORD: (editor: any) => any;
            SELECTION: (editor: any, name: any, indentation: any) => any;
            CURRENT_LINE: (editor: any) => any;
            PREV_LINE: (editor: any) => any;
            LINE_INDEX: (editor: any) => any;
            LINE_NUMBER: (editor: any) => any;
            SOFT_TABS: (editor: any) => "YES" | "NO";
            TAB_SIZE: (editor: any) => any;
            CLIPBOARD: (editor: any) => any;
            FILENAME: (editor: any) => string;
            FILENAME_BASE: (editor: any) => string;
            DIRECTORY: (editor: any) => string;
            FILEPATH: (editor: any) => string;
            WORKSPACE_NAME: () => string;
            FULLNAME: () => string;
            BLOCK_COMMENT_START: (editor: any) => any;
            BLOCK_COMMENT_END: (editor: any) => any;
            LINE_COMMENT: (editor: any) => any;
            CURRENT_YEAR: any;
            CURRENT_YEAR_SHORT: any;
            CURRENT_MONTH: any;
            CURRENT_MONTH_NAME: any;
            CURRENT_MONTH_NAME_SHORT: any;
            CURRENT_DATE: any;
            CURRENT_DAY_NAME: any;
            CURRENT_DAY_NAME_SHORT: any;
            CURRENT_HOUR: any;
            CURRENT_MINUTE: any;
            CURRENT_SECOND: any;
        };
        getTokenizer(): Tokenizer;
        createTokenizer(): any;
        tokenizeTmSnippet(str: any, startState: any): (string | import("ace-code").Ace.Token)[];
        getVariableValue(editor: any, name: any, indentation: any): any;
        tmStrFormat(str: any, ch: any, editor: any): any;
        tmFormatFunction(str: any, ch: any, editor: any): any;
        resolveVariables(snippet: any, editor: any): any[];
        getDisplayTextForSnippet(editor: any, snippetText: any): any;
        insertSnippetForSelection(editor: any, snippetText: any, options?: {}): void;
        insertSnippet(editor: any, snippetText: any, options?: {}): void;
        getActiveScopes(editor: any): any[];
        expandWithTab(editor: any, options: any): any;
        expandSnippetForSelection(editor: any, options: any): boolean;
        findMatchingSnippet(snippetList: Snippet[], before: string, after: string): Snippet;
        register(snippets: any[], scope: string): void;
        unregister(snippets: any, scope: any): void;
        parseSnippetFile(str: any): Snippet[];
        getSnippetByName(name: any, editor: any): undefined;
    }
    import { Tokenizer } from "ace-code/src/tokenizer";
    namespace Ace {
        type EventEmitter<T extends {
            [K in keyof T]: (...args: any[]) => any;
        }> = import("ace-code").Ace.EventEmitter<T>;
    }
    interface SnippetManager extends Ace.EventEmitter<any> {
    }
}
declare module "ace-code/src/autocomplete/inline_screenreader" {
    /**
     * This object is used to communicate inline code completions rendered into an editor with ghost text to screen reader users.
     */
    export class AceInlineScreenReader {
        /**
         * Creates the off-screen div in which the ghost text content in redered and which the screen reader reads.
         */
        constructor(editor: import("ace-code/src/editor").Editor);
        editor: import("ace-code/src/editor").Editor;
        screenReaderDiv: HTMLDivElement;
        /**
         * Set the ghost text content to the screen reader div
         */
        setScreenReaderContent(content: string): void;
        popup: import("ace-code/src/autocomplete/popup").AcePopup;
        destroy(): void;
        /**
         * Take this._lines, render it as <code> blocks and add those to the screen reader div.
         */
        createCodeBlock(): HTMLPreElement;
    }
}
declare module "ace-code/src/autocomplete/inline" {
    export type Editor = import("ace-code/src/editor").Editor;
    /**
     * This object is used to manage inline code completions rendered into an editor with ghost text.
     */
    export class AceInline {
        editor: any;
        /**
         * Renders the completion as ghost text to the current cursor position
         * @returns {boolean} True if the completion could be rendered to the editor, false otherwise
         */
        show(editor: Editor, completion: import("ace-code").Ace.Completion, prefix: string): boolean;
        inlineScreenReader: AceInlineScreenReader;
        isOpen(): boolean;
        hide(): boolean;
        destroy(): void;
    }
    import { AceInlineScreenReader } from "ace-code/src/autocomplete/inline_screenreader";
}
declare module "ace-code/src/autocomplete/util" {
    export function parForEach(array: any, fn: any, callback: any): void;
    export function retrievePrecedingIdentifier(text: any, pos: any, regex: any): string;
    export function retrieveFollowingIdentifier(text: any, pos: any, regex: any): any[];
    export function getCompletionPrefix(editor: any): string;
    export function triggerAutocomplete(editor: Editor, previousChar?: string): boolean;
    export type Editor = import("ace-code/src/editor").Editor;
}
declare module "ace-code/src/autocomplete" {
    /**
     * This object controls the autocompletion components and their lifecycle.
     * There is an autocompletion popup, an optional inline ghost text renderer and a docuent tooltip popup inside.
     */
    export class Autocomplete {
        static get completionsForLoading(): {
            caption: any;
            value: string;
        }[];
        static for(editor: Editor): Autocomplete;
        autoInsert: boolean;
        autoSelect: boolean;
        autoShown: boolean;
        exactMatch: boolean;
        inlineEnabled: boolean;
        keyboardHandler: HashHandler;
        parentNode: any;
        setSelectOnHover: boolean;
        /**
         *  @property {Boolean} showLoadingState - A boolean indicating whether the loading states of the Autocompletion should be shown to the end-user. If enabled
         * it shows a loading indicator on the popup while autocomplete is loading.
         *
         * Experimental: This visualisation is not yet considered stable and might change in the future.
         */
        showLoadingState: boolean;
        /**
         *  @property {number} stickySelectionDelay - a numerical value that determines after how many ms the popup selection will become 'sticky'.
         *  Normally, when new elements are added to an open popup, the selection is reset to the first row of the popup. If sticky, the focus will remain
         *  on the currently selected item when new items are added to the popup. Set to a negative value to disable this feature and never set selection to sticky.
         */
        stickySelectionDelay: number;
        blurListener(e: any): void;
        changeListener(e: any): void;
        mousedownListener(e: any): void;
        mousewheelListener(e: any): void;
        changeTimer: {
            (timeout?: number): void;
            delay(timeout?: number): void;
            schedule: any;
            call(): void;
            cancel(): void;
            isPending(): any;
        };
        tooltipTimer: {
            (timeout?: number): void;
            delay(timeout?: number): void;
            schedule: any;
            call(): void;
            cancel(): void;
            isPending(): any;
        };
        popupTimer: {
            (timeout?: number): void;
            delay(timeout?: number): void;
            schedule: any;
            call(): void;
            cancel(): void;
            isPending(): any;
        };
        stickySelectionTimer: {
            (timeout?: number): void;
            delay(timeout?: number): void;
            schedule: any;
            call(): void;
            cancel(): void;
            isPending(): any;
        };
        popup: AcePopup;
        inlineRenderer: AceInline;
        getPopup(): AcePopup;
        stickySelection: boolean;
        observeLayoutChanges(): void;
        unObserveLayoutChanges(): void;
        openPopup(editor: Editor, prefix: string, keepPopupPosition?: boolean): void;
        /**
         * Detaches all elements from the editor, and cleans up the data for the session
         */
        detach(): void;
        activated: boolean;
        completionProvider: CompletionProvider;
        completions: FilteredList;
        base: import("ace-code/src/anchor").Anchor;
        mouseOutListener(e: any): void;
        goTo(where: any): void;
        insertMatch(data: Completion, options?: undefined): boolean | void;
        /**
         * This is the entry point for the autocompletion class, triggers the actions which collect and display suggestions
         */
        showPopup(editor: Editor, options?: CompletionOptions): void;
        editor: import("ace-code/src/editor").Editor;
        getCompletionProvider(initialPosition?: {
            pos: Position;
            prefix: string;
        }): CompletionProvider;
        /**
         * This method is deprecated, it is only kept for backwards compatibility.
         * Use the same method include CompletionProvider instead for the same functionality.
         * @deprecated
         */
        gatherCompletions(editor: any, callback: any): boolean;
        updateCompletions(keepPopupPosition: boolean, options?: CompletionOptions): void;
        cancelContextMenu(): void;
        updateDocTooltip(): void;
        showDocTooltip(item: any): void;
        tooltipNode: HTMLDivElement;
        hideDocTooltip(): void;
        destroy(): void;
        commands: {
            Up: (editor: any) => void;
            Down: (editor: any) => void;
            "Ctrl-Up|Ctrl-Home": (editor: any) => void;
            "Ctrl-Down|Ctrl-End": (editor: any) => void;
            Esc: (editor: any) => void;
            Return: (editor: any) => any;
            "Shift-Return": (editor: any) => void;
            Tab: (editor: any) => any;
            Backspace: (editor: any) => void;
            PageUp: (editor: any) => void;
            PageDown: (editor: any) => void;
        };
        emptyMessage?: Function;
    }
    /**
     * This class is responsible for providing completions and inserting them to the editor
     */
    export class CompletionProvider {
        constructor(initialPosition?: {
            pos: Position;
            prefix: string;
        });
        initialPosition: {
            pos: Position;
            prefix: string;
        };
        active: boolean;
        insertByIndex(editor: Editor, index: number, options?: CompletionProviderOptions): boolean;
        insertMatch(editor: Editor, data: Completion, options?: CompletionProviderOptions): boolean;
        gatherCompletions(editor: Editor, callback: import("ace-code").Ace.CompletionCallbackFunction): boolean;
        completers: import("ace-code").Ace.Completer[];
        /**
         * This is the entry point to the class, it gathers, then provides the completions asynchronously via callback.
         * The callback function may be called multiple times, the last invokation is marked with a `finished` flag
         */
        provideCompletions(editor: Editor, options: CompletionProviderOptions, callback: (err: Error | undefined, completions: FilteredList | [
        ], finished: boolean) => void): void;
        detach(): void;
        completions: import("ace-code").Ace.FilteredList;
    }
    export type Editor = import("ace-code/src/editor").Editor;
    export type CompletionProviderOptions = import("ace-code").Ace.CompletionProviderOptions;
    export type CompletionOptions = import("ace-code").Ace.CompletionOptions;
    export type Position = import("ace-code").Ace.Position;
    export type BaseCompletion = {
        /**
         * - a numerical value that determines the order in which completions would be displayed.
         * A lower score means that the completion would be displayed further from the start
         */
        score?: number;
        /**
         * - a short description of the completion
         */
        meta?: string;
        /**
         * - the text that would be displayed in the completion list. If omitted, value or snippet
         * would be shown instead.
         */
        caption?: string;
        /**
         * - an HTML string that would be displayed as an additional popup
         */
        docHTML?: string;
        /**
         * - a plain text that would be displayed as an additional popup. If `docHTML` exists,
         * it would be used instead of `docText`.
         */
        docText?: string;
        /**
         * - the identifier of the completer
         */
        completerId?: string;
        /**
         * - An object specifying the range of text to be replaced with the new completion value (experimental)
         */
        range?: import("ace-code").Ace.IRange;
        /**
         * - A command to be executed after the completion is inserted (experimental)
         */
        command?: any;
        /**
         * - a text snippet that would be inserted when the completion is selected
         */
        snippet?: string;
        /**
         * - The text that would be inserted when selecting this completion.
         */
        value?: string;
        completer?: import("ace-code").Ace.Completer;
        hideInlinePreview?: boolean;
    };
    export type SnippetCompletion = BaseCompletion & {
        snippet: string;
    };
    export type ValueCompletion = BaseCompletion & {
        value: string;
    };
    /**
     * Represents a suggested text snippet intended to complete a user's input
     */
    export type Completion = SnippetCompletion | ValueCompletion;
    import { HashHandler } from "ace-code/src/keyboard/hash_handler";
    import { AcePopup } from "ace-code/src/autocomplete/popup";
    import { AceInline } from "ace-code/src/autocomplete/inline";
    export class FilteredList {
        constructor(array: any, filterText?: string);
        all: any;
        filtered: any;
        filterText: string;
        exactMatch: boolean;
        ignoreCaption: boolean;
        setFilter(str: any): void;
        filterCompletions(items: any, needle: any): any[];
    }
    export namespace startCommand {
        let name: string;
        function exec(editor: any, options: any): void;
        let bindKey: string;
    }
    namespace Ace {
        type AcePopup = import("ace-code").Ace.AcePopup;
        type FilteredList = import("ace-code").Ace.FilteredList;
    }
    export interface Autocomplete {
        popup: Ace.AcePopup;
        emptyMessage?: Function;
    }
    export interface CompletionProvider {
        completions: Ace.FilteredList;
    }
}
declare module "ace-code/src/autocomplete/text_completer" {
    export function getCompletions(editor: any, session: any, pos: any, prefix: any, callback: any): void;
}
declare module "ace-code/src/line_widgets" {
    export class LineWidgets {
        constructor(session: EditSession);
        session: import("ace-code/src/edit_session").EditSession;
        updateOnChange(delta: import("ace-code").Ace.Delta): void;
        renderWidgets(e: any, renderer: VirtualRenderer): void;
        measureWidgets(e: any, renderer: VirtualRenderer): void;
        getRowLength(row: number): number;
        attach(editor: Editor): void;
        editor: Editor;
        detach(e: any): void;
        updateOnFold(e: any, session: EditSession): void;
        addLineWidget(w: LineWidget): LineWidget;
        removeLineWidget(w: LineWidget): void;
        getWidgetsAtRow(row: number): LineWidget[];
        firstRow: number;
        lastRow: number;
        lineWidgets: import("ace-code").Ace.LineWidget[];
    }
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    export type Editor = import("ace-code/src/editor").Editor;
    export type VirtualRenderer = import("ace-code/src/virtual_renderer").VirtualRenderer;
    export type LineWidget = import("ace-code").Ace.LineWidget;
    namespace Ace {
        type LineWidget = import("ace-code").Ace.LineWidget;
        type Editor = import("ace-code").Ace.Editor;
    }
    export interface LineWidgets {
        lineWidgets: Ace.LineWidget[];
        editor: Ace.Editor;
    }
}
declare module "ace-code/src/search_highlight" {
    export type Marker = import("ace-code/src/layer/marker").Marker;
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    export class SearchHighlight {
        constructor(regExp: any, clazz: string, type?: string);
        clazz: string;
        type: string;
        setRegexp(regExp: any): void;
        regExp: any;
        cache: any[];
        update(html: any, markerLayer: Marker, session: EditSession, config: Partial<import("ace-code").Ace.LayerConfig>): void;
        MAX_RANGES: number;
    }
}
declare module "ace-code/src/occur" {
    export type Editor = import("ace-code/src/editor").Editor;
    export type Point = import("ace-code").Ace.Point;
    export type SearchOptions = import("ace-code").Ace.SearchOptions;
    /**
     * Finds all lines matching a search term in the current [[Document
     * `Document`]] and displays them instead of the original `Document`. Keeps
     * track of the mapping between the occur doc and the original doc.
     **/
    export class Occur extends Search {
        /**
         * Enables occur mode. expects that `options.needle` is a search term.
         * This search term is used to filter out all the lines that include it
         * and these are then used as the content of a new [[Document
         * `Document`]]. The current cursor position of editor will be translated
         * so that the cursor is on the matching row/column as it was before.
         * @param {Object} options options.needle should be a String
         * @return {Boolean} Whether occur activation was successful
         *
         **/
        enter(editor: Editor, options: any): boolean;
        /**
         * Disables occur mode. Resets the [[Sessions `EditSession`]] [[Document
         * `Document`]] back to the original doc. If options.translatePosition is
         * truthy also maps the [[Editors `Editor`]] cursor position accordingly.
         * @param {Object} options options.translatePosition
         * @return {Boolean} Whether occur deactivation was successful
         *
         **/
        exit(editor: Editor, options: any): boolean;
        highlight(sess: EditSession, regexp: RegExp): void;
        displayOccurContent(editor: Editor, options: Partial<SearchOptions>): void;
        displayOriginalContent(editor: Editor): void;
        /**
        * Translates the position from the original document to the occur lines in
        * the document or the beginning if the doc {row: 0, column: 0} if not
        * found.
        * @param {EditSession} session The occur session
        * @param {Point} pos The position in the original document
        * @return {Point} position in occur doc
        **/
        originalToOccurPosition(session: EditSession, pos: Point): Point;
        /**
        * Translates the position from the occur document to the original document
        * or `pos` if not found.
        * @param {EditSession} session The occur session
        * @param {Point} pos The position in the occur session document
        **/
        occurToOriginalPosition(session: EditSession, pos: Point): Point;
        matchingLines(session: EditSession, options: Partial<SearchOptions>): any[];
    }
    import { Search } from "ace-code/src/search";
    import { EditSession } from "ace-code/src/edit_session";
}
declare module "ace-code/src/marker_group" {
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    export type MarkerGroupItem = {
        range: import("ace-code/src/range").Range;
        className: string;
    };
    export type LayerConfig = import("ace-code").Ace.LayerConfig;
    export type Marker = import("ace-code/src/layer/marker").Marker;
    export class MarkerGroup {
        /**
         * @param {{markerType: "fullLine" | "line" | undefined}} [options] Options controlling the behvaiour of the marker.
         * User `markerType` to control how the markers which are part of this group will be rendered:
         * - `undefined`: uses `text` type markers where only text characters within the range will be highlighted.
         * - `fullLine`: will fully highlight all the rows within the range, including the characters before and after the range on the respective rows.
         * - `line`: will fully highlight the lines within the range but will only cover the characters between the start and end of the range.
         */
        constructor(session: EditSession, options?: {
            markerType: "fullLine" | "line" | undefined;
        });
        markerType: "line" | "fullLine";
        markers: import("ace-code").Ace.MarkerGroupItem[];
        session: EditSession;
        /**
         * Finds the first marker containing pos
         */
        getMarkerAtPosition(pos: import("ace-code").Ace.Point): import("ace-code").Ace.MarkerGroupItem | undefined;
        /**
         * Comparator for Array.sort function, which sorts marker definitions by their positions
         *
         * @param {MarkerGroupItem} a first marker.
         * @param {MarkerGroupItem} b second marker.
         * @returns {number} negative number if a should be before b, positive number if b should be before a, 0 otherwise.
         */
        markersComparator(a: MarkerGroupItem, b: MarkerGroupItem): number;
        /**
         * Sets marker definitions to be rendered. Limits the number of markers at MAX_MARKERS.
         * @param {MarkerGroupItem[]} markers an array of marker definitions.
         */
        setMarkers(markers: MarkerGroupItem[]): void;
        update(html: any, markerLayer: Marker, session: EditSession, config: LayerConfig): void;
        MAX_MARKERS: number;
    }
}
declare module "ace-code/src/edit_session/fold" {
    export class Fold extends RangeList {
        constructor(range: Range, placeholder: any);
        foldLine: import("ace-code/src/edit_session/fold_line").FoldLine;
        placeholder: any;
        range: import("ace-code/src/range").Range;
        start: import("ace-code").Ace.Point;
        end: import("ace-code").Ace.Point;
        sameRow: boolean;
        subFolds: Fold[];
        setFoldLine(foldLine: FoldLine): void;
        clone(): Fold;
        addSubFold(fold: Fold): any;
        restoreRange(range: IRange): void;
        collapseChildren?: number;
    }
    export type FoldLine = import("ace-code/src/edit_session/fold_line").FoldLine;
    export type Range = import("ace-code/src/range").Range;
    export type Point = import("ace-code").Ace.Point;
    export type IRange = import("ace-code").Ace.IRange;
    import { RangeList } from "ace-code/src/range_list";
    export interface Fold {
        collapseChildren?: number;
    }
}
declare module "ace-code/src/edit_session/fold_line" {
    export type Fold = import("ace-code/src/edit_session/fold").Fold;
    export class FoldLine {
        /**
         * If an array is passed in, the folds are expected to be sorted already.
         */
        constructor(foldData: FoldLine[], folds: Fold[] | Fold);
        foldData: FoldLine[];
        folds: Fold[];
        range: Range;
        start: import("ace-code").Ace.Point;
        end: import("ace-code").Ace.Point;
        /**
         * Note: This doesn't update wrapData!
         */
        shiftRow(shift: number): void;
        addFold(fold: Fold): void;
        containsRow(row: number): boolean;
        walk(callback: Function, endRow: number, endColumn: number): void;
        getNextFoldTo(row: number, column: number): {
            fold: Fold;
            kind: string;
        } | null;
        addRemoveChars(row: number, column: number, len: number): void;
        split(row: number, column: number): FoldLine | null;
        merge(foldLineNext: FoldLine): void;
        toString(): string;
        idxToPosition(idx: number): import("ace-code").Ace.Point;
    }
    import { Range } from "ace-code/src/range";
}
declare module "ace-code/src/bidihandler" {
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    /**
     * This object is used to ensure Bi-Directional support (for languages with text flowing from right to left, like Arabic or Hebrew)
     * including correct caret positioning, text selection mouse and keyboard arrows functioning
     **/
    export class BidiHandler {
        /**
         * Creates a new `BidiHandler` object
         * @param {EditSession} session The session to use
         **/
        constructor(session: EditSession);
        session: import("ace-code/src/edit_session").EditSession;
        bidiMap: {};
        currentRow: any;
        bidiUtil: typeof bidiUtil;
        charWidths: any[];
        EOL: string;
        showInvisibles: boolean;
        isRtlDir: boolean;
        line: string;
        wrapIndent: number;
        EOF: string;
        RLE: string;
        contentWidth: number;
        fontMetrics: any;
        rtlLineOffset: number;
        wrapOffset: number;
        isMoveLeftOperation: boolean;
        seenBidi: boolean;
        /**
         * Returns 'true' if row contains Bidi characters, in such case
         * creates Bidi map to be used in operations related to selection
         * (keyboard arrays, mouse click, select)
         * @param {Number} screenRow the screen row to be checked
         * @param {Number} [docRow] the document row to be checked [optional]
         * @param {Number} [splitIndex] the wrapped screen line index [ optional]
        **/
        isBidiRow(screenRow: number, docRow?: number, splitIndex?: number): any;
        getDocumentRow(): number;
        getSplitIndex(): number;
        updateRowLine(docRow: any, splitIndex: any): void;
        updateBidiMap(): void;
        /**
         * Resets stored info related to current screen row
        **/
        markAsDirty(): void;
        /**
         * Updates array of character widths
         * @param {Object} fontMetrics metrics
         *
        **/
        updateCharacterWidths(fontMetrics: any): void;
        characterWidth: any;
        setShowInvisibles(showInvisibles: any): void;
        setEolChar(eolChar: any): void;
        setContentWidth(width: any): void;
        isRtlLine(row: any): boolean;
        setRtlDirection(editor: any, isRtlDir: any): void;
        /**
         * Returns offset of character at position defined by column.
         * @param {Number} col the screen column position
         *
         * @return {Number} horizontal pixel offset of given screen column
         **/
        getPosLeft(col: number): number;
        /**
         * Returns 'selections' - array of objects defining set of selection rectangles
         * @param {Number} startCol the start column position
         * @param {Number} endCol the end column position
         *
         * @return {Object[]} Each object contains 'left' and 'width' values defining selection rectangle.
        **/
        getSelections(startCol: number, endCol: number): any[];
        /**
         * Converts character coordinates on the screen to respective document column number
         * @param {Number} posX character horizontal offset
         *
         * @return {Number} screen column number corresponding to given pixel offset
        **/
        offsetToCol(posX: number): number;
    }
    import bidiUtil = require("ace-code/src/lib/bidiutil");
}
declare module "ace-code/src/background_tokenizer" {
    /**
     * Tokenizes the current [[Document `Document`]] in the background, and caches the tokenized rows for future use.
     *
     * If a certain row is changed, everything below that row is re-tokenized.
     **/
    export class BackgroundTokenizer {
        /**
         * Creates a new `BackgroundTokenizer` object.
         * @param {Tokenizer} tokenizer The tokenizer to use
         * @param {EditSession} [session] The editor session to associate with
         **/
        constructor(tokenizer: Tokenizer, session?: EditSession);
        running: false | number;
        lines: any[];
        states: string[] | string[][];
        currentLine: number;
        tokenizer: import("ace-code/src/tokenizer").Tokenizer;
        /**
         * Sets a new tokenizer for this object.
         * @param {Tokenizer} tokenizer The new tokenizer to use
         **/
        setTokenizer(tokenizer: Tokenizer): void;
        /**
         * Sets a new document to associate with this object.
         * @param {Document} doc The new document to associate with
         **/
        setDocument(doc: Document): void;
        doc: import("ace-code/src/document").Document;
        /**
         * Emits the `'update'` event. `firstRow` and `lastRow` are used to define the boundaries of the region to be updated.
         * @param {Number} firstRow The starting row region
         * @param {Number} lastRow The final row region
         **/
        fireUpdateEvent(firstRow: number, lastRow: number): void;
        /**
         * Starts tokenizing at the row indicated.
         * @param {Number} startRow The row to start at
         **/
        start(startRow: number): void;
        /**
         * Sets pretty long delay to prevent the tokenizer from interfering with the user
         */
        scheduleStart(): void;
        /**
         * Stops tokenizing.
         **/
        stop(): void;
        /**
         * Gives list of [[Token]]'s of the row. (tokens are cached)
         * @param {Number} row The row to get tokens at
         **/
        getTokens(row: number): import("ace-code").Ace.Token[];
        /**
         * Returns the state of tokenization at the end of a row.
         * @param {Number} row The row to get state at
         **/
        getState(row: number): string | string[];
        cleanup(): void;
    }
    export type Document = import("ace-code/src/document").Document;
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    export type Tokenizer = import("ace-code/src/tokenizer").Tokenizer;
    namespace Ace {
        type EventEmitter<T extends {
            [K in keyof T]: (...args: any[]) => any;
        }> = import("ace-code").Ace.EventEmitter<T>;
        type BackgroundTokenizerEvents = import("ace-code").Ace.BackgroundTokenizerEvents;
    }
    export interface BackgroundTokenizer extends Ace.EventEmitter<Ace.BackgroundTokenizerEvents> {
    }
}
declare module "ace-code/src/edit_session/folding" {
    export type IFolding = import("ace-code/src/edit_session").EditSession & import("ace-code").Ace.Folding;
    export type Delta = import("ace-code").Ace.Delta;
    export function Folding(this: IFolding): void;
    export class Folding {
        /**
         * Looks up a fold at a given row/column. Possible values for side:
         *   -1: ignore a fold if fold.start = row/column
         *   +1: ignore a fold if fold.end = row/column
         **/
        getFoldAt: (row: number, column: number, side?: number) => import("ace-code").Ace.Fold;
        /**
         * Returns all folds in the given range. Note, that this will return folds
         **/
        getFoldsInRange: (range: import("ace-code").Ace.Range | import("ace-code").Ace.Delta) => import("ace-code").Ace.Fold[];
        getFoldsInRangeList: (ranges: import("ace-code").Ace.Range[] | import("ace-code").Ace.Range) => import("ace-code").Ace.Fold[];
        /**
         * Returns all folds in the document
         */
        getAllFolds: () => import("ace-code").Ace.Fold[];
        /**
         * Returns the string between folds at the given position.
         * E.g.
         *  foo<fold>b|ar<fold>wolrd -> "bar"
         *  foo<fold>bar<fold>wol|rd -> "world"
         *  foo<fold>bar<fo|ld>wolrd -> <null>
         *
         * where | means the position of row/column
         *
         * The trim option determs if the return string should be trimed according
         * to the "side" passed with the trim value:
         *
         * E.g.
         *  foo<fold>b|ar<fold>wolrd -trim=-1> "b"
         *  foo<fold>bar<fold>wol|rd -trim=+1> "rld"
         *  fo|o<fold>bar<fold>wolrd -trim=00> "foo"
         */
        getFoldStringAt: (row: number, column: number, trim?: number, foldLine?: import("ace-code").Ace.FoldLine) => string | null;
        getFoldLine: (docRow: number, startFoldLine?: import("ace-code").Ace.FoldLine) => null | import("ace-code").Ace.FoldLine;
        /**
         * Returns the fold which starts after or contains docRow
         */
        getNextFoldLine: (docRow: number, startFoldLine?: import("ace-code").Ace.FoldLine) => null | import("ace-code").Ace.FoldLine;
        getFoldedRowCount: (first: number, last: number) => number;
        /**
         * Adds a new fold.
         *
         *      The new created Fold object or an existing fold object in case the
         *      passed in range fits an existing fold exactly.
         */
        addFold: (placeholder: import("ace-code").Ace.Fold | string, range?: import("ace-code").Ace.Range) => import("ace-code").Ace.Fold;
        addFolds: (folds: import("ace-code").Ace.Fold[]) => void;
        removeFold: (fold: import("ace-code").Ace.Fold) => void;
        removeFolds: (folds: import("ace-code").Ace.Fold[]) => void;
        expandFold: (fold: import("ace-code").Ace.Fold) => void;
        expandFolds: (folds: import("ace-code").Ace.Fold[]) => void;
        unfold: (location?: number | null | import("ace-code").Ace.Point | import("ace-code").Ace.Range | import("ace-code").Ace.Range[], expandInner?: boolean) => import("ace-code").Ace.Fold[] | undefined;
        /**
         * Checks if a given documentRow is folded. This is true if there are some
         * folded parts such that some parts of the line is still visible.
         **/
        isRowFolded: (docRow: number, startFoldRow?: import("ace-code").Ace.FoldLine) => boolean;
        getRowFoldEnd: (docRow: number, startFoldRow?: import("ace-code").Ace.FoldLine) => number;
        getRowFoldStart: (docRow: number, startFoldRow?: import("ace-code").Ace.FoldLine) => number;
        getFoldDisplayLine: (foldLine: import("ace-code").Ace.FoldLine, endRow?: number | null, endColumn?: number | null, startRow?: number | null, startColumn?: number | null) => string;
        getDisplayLine: (row: number, endColumn: number | null, startRow: number | null, startColumn: number | null) => string;
        toggleFold: (tryToUnfold?: boolean) => void;
        getCommentFoldRange: (row: number, column: number, dir?: number) => import("ace-code").Ace.Range | undefined;
        foldAll: (startRow?: number | null, endRow?: number | null, depth?: number | null, test?: Function) => void;
        foldToLevel: (level: number) => void;
        foldAllComments: () => void;
        setFoldStyle: (style: string) => void;
        getParentFoldRangeData: (row: number, ignoreCurrent?: boolean) => {
            range?: import("ace-code").Ace.Range;
            firstRange?: import("ace-code").Ace.Range;
        };
        onFoldWidgetClick: (row: number, e: any) => void;
        toggleFoldWidget: (toggleParent?: boolean) => void;
        updateFoldWidgets: (delta: import("ace-code").Ace.Delta) => void;
        tokenizerUpdateFoldWidgets: (e: any) => void;
    }
}
declare module "ace-code/src/edit_session/bracket_match" {
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    export type Point = import("ace-code/src/edit_session").Point;
    export function BracketMatch(): void;
    export class BracketMatch {
        findMatchingBracket: (this: import("ace-code/src/edit_session").EditSession, position: Point, chr?: string) => import("ace-code").Ace.Point;
        getBracketRange: (this: import("ace-code/src/edit_session").EditSession, pos: Point) => null | Range;
        /**
         * Returns:
         * * null if there is no any bracket at `pos`;
         * * two Ranges if there is opening and closing brackets;
         * * one Range if there is only one bracket
         *
         */
        getMatchingBracketRanges: (this: import("ace-code/src/edit_session").EditSession, pos: Point, isBackwards?: boolean) => null | Range[];
        /**
         * Returns [[Range]]'s for matching tags and tag names, if there are any
         */
        getMatchingTags: (this: import("ace-code/src/edit_session").EditSession, pos: Point) => {
            closeTag: Range;
            closeTagName: Range;
            openTag: Range;
            openTagName: Range;
        } | undefined;
    }
    import { Range } from "ace-code/src/range";
}
declare module "ace-code/src/edit_session" {
    /**
     * Stores all the data about [[Editor `Editor`]] state providing easy way to change editors state.
     *
     * `EditSession` can be attached to only one [[Document `Document`]]. Same `Document` can be attached to several `EditSession`s.
     **/
    export class EditSession {
        /**
        * Returns a new instance of EditSession with state from JSON.
        * @method fromJSON
        * @param {string|object} session The EditSession state.
        */
        static fromJSON(session: string | object): EditSession;
        /**
         * Sets up a new `EditSession` and associates it with the given `Document` and `Mode`.
         **/
        constructor(text?: Document | string, mode?: SyntaxMode);
        doc: Document;
        prevOp: {};
        id: string;
        bgTokenizer: BackgroundTokenizer;
        selection: Selection;
        destroyed: boolean;
        curOp: import("ace-code").Ace.Operation | null;
        /**
         * Start an Ace operation, which will then batch all the subsequent changes (to either content or selection) under a single atomic operation.
         * @param {{command?: {name?: string}, args?: any}|undefined} [commandEvent] Optional name for the operation
         */
        startOperation(commandEvent?: {
            command?: {
                name?: string;
            };
            args?: any;
        } | undefined): void;
        /**
         * End current Ace operation.
         * Emits "beforeEndOperation" event just before clearing everything, where the current operation can be accessed through `curOp` property.
         */
        endOperation(e?: any): void;
        /**
         * Sets the `EditSession` to point to a new `Document`. If a `BackgroundTokenizer` exists, it also points to `doc`.
         *
         * @param {Document} doc The new `Document` to use
         *
         **/
        setDocument(doc: Document): void;
        /**
         * Returns the `Document` associated with this session.
         **/
        getDocument(): Document;
        /**
         * Set "widgetManager" in EditSession
         *
         */
        set widgetManager(value: LineWidgets);
        /**
         * Get "widgetManager" from EditSession
         *
         */
        get widgetManager(): LineWidgets;
        resetCaches(): void;
        mergeUndoDeltas: boolean;
        onSelectionChange(): void;
        /**
         * Sets the session text.
         * @param {String} text The new text to place
         **/
        setValue(text: string): void;
        /**
         * Returns the current edit session.
         * @method toJSON
         */
        toJSON(): any;
        /**
         * Returns selection object.
         **/
        getSelection(): Selection;
        /**
         * {:BackgroundTokenizer.getState}
         * @param {Number} row The row to start at
         * @related BackgroundTokenizer.getState
         **/
        getState(row: number): string | string[];
        /**
         * Starts tokenizing at the row indicated. Returns a list of objects of the tokenized rows.
         * @param {Number} row The row to start at
         **/
        getTokens(row: number): import("ace-code").Ace.Token[];
        /**
         * Returns an object indicating the token at the current row. The object has two properties: `index` and `start`.
         * @param {Number} row The row number to retrieve from
         * @param {Number} column The column number to retrieve from
         *
         **/
        getTokenAt(row: number, column: number): import("ace-code").Ace.Token;
        /**
         * Sets the undo manager.
         * @param {UndoManager} undoManager The new undo manager
         **/
        setUndoManager(undoManager: UndoManager): void;
        /**
         * starts a new group in undo history
         **/
        markUndoGroup(): void;
        /**
         * Returns the current undo manager.
         **/
        getUndoManager(): UndoManager;
        /**
         * Returns the current value for tabs. If the user is using soft tabs, this will be a series of spaces (defined by [[EditSession.getTabSize `getTabSize()`]]); otherwise it's simply `'\t'`.
         **/
        getTabString(): string;
        /**
         * Pass `true` to enable the use of soft tabs. Soft tabs means you're using spaces instead of the tab character (`'\t'`).
         * @param {Boolean} val Value indicating whether or not to use soft tabs
         **/
        setUseSoftTabs(val: boolean): void;
        /**
         * Returns `true` if soft tabs are being used, `false` otherwise.
         **/
        getUseSoftTabs(): boolean;
        /**
         * Set the number of spaces that define a soft tab; for example, passing in `4` transforms the soft tabs to be equivalent to four spaces. This function also emits the `changeTabSize` event.
         * @param {Number} tabSize The new tab size
         **/
        setTabSize(tabSize: number): void;
        /**
         * Returns the current tab size.
         **/
        getTabSize(): number;
        /**
         * Returns `true` if the character at the position is a soft tab.
         * @param {Point} position The position to check
         **/
        isTabStop(position: Point): boolean;
        /**
         * Set whether keyboard navigation of soft tabs moves the cursor within the soft tab, rather than over
         * @param {Boolean} navigateWithinSoftTabs Value indicating whether or not to navigate within soft tabs
         **/
        setNavigateWithinSoftTabs(navigateWithinSoftTabs: boolean): void;
        /**
         * Returns `true` if keyboard navigation moves the cursor within soft tabs, `false` if it moves the cursor over soft tabs.
         **/
        getNavigateWithinSoftTabs(): boolean;
        /**
         * Pass in `true` to enable overwrites in your session, or `false` to disable.
         *
         * If overwrites is enabled, any text you enter will type over any text after it. If the value of `overwrite` changes, this function also emits the `changeOverwrite` event.
         *
         * @param {Boolean} overwrite Defines whether or not to set overwrites
         *
         **/
        setOverwrite(overwrite: boolean): void;
        /**
         * Returns `true` if overwrites are enabled; `false` otherwise.
         **/
        getOverwrite(): boolean;
        /**
         * Sets the value of overwrite to the opposite of whatever it currently is.
         **/
        toggleOverwrite(): void;
        /**
         * Adds `className` to the `row`, to be used for CSS stylings and whatnot.
         * @param {Number} row The row number
         * @param {String} className The class to add
         **/
        addGutterDecoration(row: number, className: string): void;
        /**
         * Removes `className` from the `row`.
         * @param {Number} row The row number
         * @param {String} className The class to add
         **/
        removeGutterDecoration(row: number, className: string): void;
        /**
         * Returns an array of strings, indicating the breakpoint class (if any) applied to each row.
         **/
        getBreakpoints(): string[];
        /**
         * Sets a breakpoint on every row number given by `rows`. This function also emites the `'changeBreakpoint'` event.
         * @param {number[]} rows An array of row indices
         **/
        setBreakpoints(rows: number[]): void;
        /**
         * Removes all breakpoints on the rows. This function also emits the `'changeBreakpoint'` event.
         **/
        clearBreakpoints(): void;
        /**
         * Sets a breakpoint on the row number given by `row`. This function also emits the `'changeBreakpoint'` event.
         * @param {Number} row A row index
         * @param {String} className Class of the breakpoint
         **/
        setBreakpoint(row: number, className: string): void;
        /**
         * Removes a breakpoint on the row number given by `row`. This function also emits the `'changeBreakpoint'` event.
         * @param {Number} row A row index
         **/
        clearBreakpoint(row: number): void;
        /**
         * Adds a new marker to the given `Range`. If `inFront` is `true`, a front marker is defined, and the `'changeFrontMarker'` event fires; otherwise, the `'changeBackMarker'` event fires.
         * @param {Range} range Define the range of the marker
         * @param {String} clazz Set the CSS class for the marker
         * @param {import("ace-code").Ace.MarkerRenderer | "fullLine" | "screenLine" | "text" | "line"} [type] Identify the renderer type of the marker. If string provided, corresponding built-in renderer is used. Supported string types are "fullLine", "screenLine", "text" or "line". If a Function is provided, that Function is used as renderer.
         * @param {Boolean} [inFront] Set to `true` to establish a front marker
         *
         * @return {Number} The new marker id
         **/
        addMarker(range: Range, clazz: string, type?: import("ace-code").Ace.MarkerRenderer | "fullLine" | "screenLine" | "text" | "line", inFront?: boolean): number;
        /**
         * Adds a dynamic marker to the session.
         * @param {import("ace-code").Ace.MarkerLike} marker object with update method
         * @param {Boolean} [inFront] Set to `true` to establish a front marker
         *
         * @return {import("ace-code").Ace.MarkerLike} The added marker
         **/
        addDynamicMarker(marker: import("ace-code").Ace.MarkerLike, inFront?: boolean): import("ace-code").Ace.MarkerLike;
        /**
         * Removes the marker with the specified ID. If this marker was in front, the `'changeFrontMarker'` event is emitted. If the marker was in the back, the `'changeBackMarker'` event is emitted.
         * @param {Number} markerId A number representing a marker
         **/
        removeMarker(markerId: number): void;
        /**
         * Returns an object containing all of the markers, either front or back.
         * @param {Boolean} [inFront] If `true`, indicates you only want front markers; `false` indicates only back markers
         *
         **/
        getMarkers(inFront?: boolean): {
            [id: number]: import("ace-code").Ace.MarkerLike;
        };
        highlight(re: RegExp): void;
        /**
         * experimental
         */
        highlightLines(startRow: number, endRow: number, clazz: string, inFront?: boolean): Range;
        /**
         * Sets annotations for the `EditSession`. This functions emits the `'changeAnnotation'` event.
         * @param {import("ace-code").Ace.Annotation[]} annotations A list of annotations
         **/
        setAnnotations(annotations: import("ace-code").Ace.Annotation[]): void;
        /**
         * Returns the annotations for the `EditSession`.
         **/
        getAnnotations(): import("ace-code").Ace.Annotation[];
        /**
         * Clears all the annotations for this session. This function also triggers the `'changeAnnotation'` event.
         **/
        clearAnnotations(): void;
        /**
         * Given a starting row and column, this method returns the `Range` of the first word boundary it finds.
         * @param {Number} row The row to start at
         * @param {Number} column The column to start at
         *
         **/
        getWordRange(row: number, column: number): Range;
        /**
         * Gets the range of a word, including its right whitespace.
         * @param {Number} row The row number to start from
         * @param {Number} column The column number to start from
         *
         **/
        getAWordRange(row: number, column: number): Range;
        /**
         * {:Document.setNewLineMode.desc}
         *
         *
         * @related Document.setNewLineMode
         **/
        setNewLineMode(newLineMode: import("ace-code").Ace.NewLineMode): void;
        /**
         *
         * Returns the current new line mode.
         * @related Document.getNewLineMode
         **/
        getNewLineMode(): import("ace-code").Ace.NewLineMode;
        /**
         * Identifies if you want to use a worker for the `EditSession`.
         * @param {Boolean} useWorker Set to `true` to use a worker
         **/
        setUseWorker(useWorker: boolean): void;
        /**
         * Returns `true` if workers are being used.
         **/
        getUseWorker(): boolean;
        /**
         * Sets a new text mode for the `EditSession`. This method also emits the `'changeMode'` event. If a [[BackgroundTokenizer `BackgroundTokenizer`]] is set, the `'tokenizerUpdate'` event is also emitted.
         * @param {SyntaxMode | string} mode Set a new text mode
         * @param {() => void} [cb] optional callback
         **/
        setMode(mode: SyntaxMode | string, cb?: () => void): void;
        tokenRe: RegExp;
        nonTokenRe: RegExp;
        /**
         * Returns the current text mode.
         * @returns {TextMode} The current text mode
         **/
        getMode(): TextMode;
        /**
         * This function sets the scroll top value. It also emits the `'changeScrollTop'` event.
         * @param {Number} scrollTop The new scroll top value
         **/
        setScrollTop(scrollTop: number): void;
        /**
         * [Returns the value of the distance between the top of the editor and the topmost part of the visible content.]{: #EditSession.getScrollTop}
         **/
        getScrollTop(): number;
        /**
         * [Sets the value of the distance between the left of the editor and the leftmost part of the visible content.]{: #EditSession.setScrollLeft}
         */
        setScrollLeft(scrollLeft: number): void;
        /**
         * [Returns the value of the distance between the left of the editor and the leftmost part of the visible content.]{: #EditSession.getScrollLeft}
         **/
        getScrollLeft(): number;
        /**
         * Returns the width of the screen.
         **/
        getScreenWidth(): number;
        getLineWidgetMaxWidth(): number;
        lineWidgetWidth: number;
        screenWidth: any;
        /**
         * Returns a verbatim copy of the given line as it is in the document
         * @param {Number} row The row to retrieve from
         **/
        getLine(row: number): string;
        /**
         * Returns an array of strings of the rows between `firstRow` and `lastRow`. This function is inclusive of `lastRow`.
         * @param {Number} firstRow The first row index to retrieve
         * @param {Number} lastRow The final row index to retrieve
         *
         *
         **/
        getLines(firstRow: number, lastRow: number): string[];
        /**
         * Returns the number of rows in the document.
         **/
        getLength(): number;
        /**
         * {:Document.getTextRange.desc}
         * @param {IRange} [range] The range to work with
         *
         **/
        getTextRange(range?: IRange): string;
        /**
         * Inserts a block of `text` and the indicated `position`.
         * @param {Point} position The position {row, column} to start inserting at
         * @param {String} text A chunk of text to insert
         * @returns {Point} The position of the last line of `text`. If the length of `text` is 0, this function simply returns `position`.
         **/
        insert(position: Point, text: string): Point;
        /**
         * Removes the `range` from the document.
         * @param {IRange} range A specified Range to remove
         * @returns {Point} The new `start` property of the range, which contains `startRow` and `startColumn`. If `range` is empty, this function returns the unmodified value of `range.start`.
         **/
        remove(range: IRange): Point;
        /**
         * Removes a range of full lines. This method also triggers the `'change'` event.
         * @param {Number} firstRow The first row to be removed
         * @param {Number} lastRow The last row to be removed
         * @returns {String[]} Returns all the removed lines.
         *
         * @related Document.removeFullLines
         *
         **/
        removeFullLines(firstRow: number, lastRow: number): string[];
        /**
         * Reverts previous changes to your document.
         * @param {Delta[]} deltas An array of previous changes
         * @param {Boolean} [dontSelect] If `true`, doesn't select the range of where the change occured
         **/
        undoChanges(deltas: Delta[], dontSelect?: boolean): void;
        /**
         * Re-implements a previously undone change to your document.
         * @param {Delta[]} deltas An array of previous changes
         **/
        redoChanges(deltas: Delta[], dontSelect?: boolean): void;
        /**
         * Enables or disables highlighting of the range where an undo occurred.
         * @param {Boolean} enable If `true`, selects the range of the reinserted change
         *
         **/
        setUndoSelect(enable: boolean): void;
        /**
         * Replaces a range in the document with the new `text`.
         *
         * @param {IRange} range A specified Range to replace
         * @param {String} text The new text to use as a replacement
         * @returns {Point} An object containing the final row and column, like this:
         * ```
         * {row: endRow, column: 0}
         * ```
         * If the text and range are empty, this function returns an object containing the current `range.start` value.
         * If the text is the exact same as what currently exists, this function returns an object containing the current `range.end` value.
         *
         * @related Document.replace
         **/
        replace(range: IRange, text: string): Point;
        /**
         * Moves a range of text from the given range to the given position. `toPosition` is an object that looks like this:
         *  ```json
         *    { row: newRowLocation, column: newColumnLocation }
         *  ```
         * @param {Range} fromRange The range of text you want moved within the document
         * @param {Point} toPosition The location (row and column) where you want to move the text to
         * @returns {Range} The new range where the text was moved to.
         **/
        moveText(fromRange: Range, toPosition: Point, copy?: boolean): Range;
        /**
         * Indents all the rows, from `startRow` to `endRow` (inclusive), by prefixing each row with the token in `indentString`.
         *
         * If `indentString` contains the `'\t'` character, it's replaced by whatever is defined by [[EditSession.getTabString `getTabString()`]].
         * @param {Number} startRow Starting row
         * @param {Number} endRow Ending row
         * @param {String} indentString The indent token
         **/
        indentRows(startRow: number, endRow: number, indentString: string): void;
        /**
         * Outdents all the rows defined by the `start` and `end` properties of `range`.
         * @param {Range} range A range of rows
         **/
        outdentRows(range: Range): void;
        /**
         * Shifts all the lines in the document up one, starting from `firstRow` and ending at `lastRow`.
         * @param {Number} firstRow The starting row to move up
         * @param {Number} lastRow The final row to move up
         * @returns {Number} If `firstRow` is less-than or equal to 0, this function returns 0. Otherwise, on success, it returns -1.
         **/
        moveLinesUp(firstRow: number, lastRow: number): number;
        /**
         * Shifts all the lines in the document down one, starting from `firstRow` and ending at `lastRow`.
         * @param {Number} firstRow The starting row to move down
         * @param {Number} lastRow The final row to move down
         * @returns {Number} If `firstRow` is less-than or equal to 0, this function returns 0. Otherwise, on success, it returns -1.
         **/
        moveLinesDown(firstRow: number, lastRow: number): number;
        /**
         * Duplicates all the text between `firstRow` and `lastRow`.
         * @param {Number} firstRow The starting row to duplicate
         * @param {Number} lastRow The final row to duplicate
         * @returns {Number} Returns the number of new rows added; in other words, `lastRow - firstRow + 1`.
         **/
        duplicateLines(firstRow: number, lastRow: number): number;
        /**
         * Sets whether or not line wrapping is enabled. If `useWrapMode` is different than the current value, the `'changeWrapMode'` event is emitted.
         * @param {Boolean} useWrapMode Enable (or disable) wrap mode
         **/
        setUseWrapMode(useWrapMode: boolean): void;
        /**
         * Returns `true` if wrap mode is being used; `false` otherwise.
         **/
        getUseWrapMode(): boolean;
        /**
         * Sets the boundaries of wrap. Either value can be `null` to have an unconstrained wrap, or, they can be the same number to pin the limit. If the wrap limits for `min` or `max` are different, this method also emits the `'changeWrapMode'` event.
         * @param {Number} min The minimum wrap value (the left side wrap)
         * @param {Number} max The maximum wrap value (the right side wrap)
         **/
        setWrapLimitRange(min: number, max: number): void;
        /**
         * This should generally only be called by the renderer when a resize is detected.
         * @param {Number} desiredLimit The new wrap limit
         **/
        adjustWrapLimit(desiredLimit: number, $printMargin?: any): boolean;
        /**
         * Returns the value of wrap limit.
         * @returns {Number} The wrap limit.
         **/
        getWrapLimit(): number;
        /**
         * Sets the line length for soft wrap in the editor. Lines will break
         *  at a minimum of the given length minus 20 chars and at a maximum
         *  of the given number of chars.
         * @param {number} limit The maximum line length in chars, for soft wrapping lines.
         */
        setWrapLimit(limit: number): void;
        /**
         * Returns an object that defines the minimum and maximum of the wrap limit; it looks something like this:
         *
         *     { min: wrapLimitRange_min, max: wrapLimitRange_max }
         *
         **/
        getWrapLimitRange(): {
            min: number;
            max: number;
        };
        /**
         * Returns number of screenrows in a wrapped line.
         * @param {Number} row The row number to check
         **/
        getRowLength(row: number): number;
        getRowLineCount(row: number): number;
        getRowWrapIndent(screenRow: number): number;
        /**
         * Returns the position (on screen) for the last character in the provided screen row.
         * @param {Number} screenRow The screen row to check
         *
         * @related EditSession.documentToScreenColumn
         **/
        getScreenLastRowColumn(screenRow: number): number;
        /**
         * For the given document row and column, this returns the column position of the last screen row.
         **/
        getDocumentLastRowColumn(docRow: number, docColumn: number): number;
        /**
         * For the given document row and column, this returns the document position of the last row.
         **/
        getDocumentLastRowColumnPosition(docRow: number, docColumn: number): Point;
        /**
         * For the given row, this returns the split data.
         */
        getRowSplitData(row: number): string | undefined;
        /**
         * The distance to the next tab stop at the specified screen column.
         * @param {Number} screenColumn The screen column to check
         *
         **/
        getScreenTabSize(screenColumn: number): number;
        screenToDocumentRow(screenRow: number, screenColumn: number): number;
        screenToDocumentColumn(screenRow: number, screenColumn: number): number;
        /**
         * Converts characters coordinates on the screen to characters coordinates within the document. [This takes into account code folding, word wrap, tab size, and any other visual modifications.]{: #conversionConsiderations}
         * @param {Number} screenRow The screen row to check
         * @param {Number} screenColumn The screen column to check
         * @param {Number} [offsetX] screen character x-offset [optional]
         *
         * @returns {Point} The object returned has two properties: `row` and `column`.
         *
         * @related EditSession.documentToScreenPosition
         **/
        screenToDocumentPosition(screenRow: number, screenColumn: number, offsetX?: number): Point;
        /**
         * Converts document coordinates to screen coordinates. {:conversionConsiderations}
         * @param {Number|Point} docRow The document row to check
         * @param {Number|undefined} [docColumn] The document column to check
         * @returns {Point} The object returned by this method has two properties: `row` and `column`.
         *
         * @related EditSession.screenToDocumentPosition
         **/
        documentToScreenPosition(docRow: number | Point, docColumn?: number | undefined): Point;
        /**
         * For the given document row and column, returns the screen column.
         **/
        documentToScreenColumn(row: number | Point, docColumn?: number): number;
        /**
         * For the given document row and column, returns the screen row.
         **/
        documentToScreenRow(docRow: number | Point, docColumn?: number): number;
        /**
         * Returns the length of the screen.
         **/
        getScreenLength(): number;
        /**
         * @returns {string} the last character preceding the cursor in the editor
         */
        getPrecedingCharacter(): string;
        destroy(): void;
        /**
         * Returns the current [[Document `Document`]] as a string.
         * @method getValue
         * @alias EditSession.toString
         **/
        getValue: () => string;
        lineWidgets: null | import("ace-code").Ace.LineWidget[];
        isFullWidth: typeof isFullWidth;
        lineWidgetsWidth?: number;
        gutterRenderer?: any;
        selectionMarkerCount?: number;
        multiSelect?: any;
        getSelectionMarkers(): any[];
    }
    export namespace EditSession {
        export { $uid };
    }
    export type FontMetrics = import("ace-code/src/layer/font_metrics").FontMetrics;
    export type FoldLine = import("ace-code/src/edit_session/fold_line").FoldLine;
    export type Point = import("ace-code").Ace.Point;
    export type Delta = import("ace-code").Ace.Delta;
    export type IRange = import("ace-code").Ace.IRange;
    export type SyntaxMode = import("ace-code").Ace.SyntaxMode;
    export type LineWidget = import("ace-code").Ace.LineWidget;
    export type TextMode = SyntaxMode;
    import { Document } from "ace-code/src/document";
    import { BackgroundTokenizer } from "ace-code/src/background_tokenizer";
    import { Selection } from "ace-code/src/selection";
    import { BidiHandler } from "ace-code/src/bidihandler";
    import { Range } from "ace-code/src/range";
    import { LineWidgets } from "ace-code/src/line_widgets";
    import { UndoManager } from "ace-code/src/undomanager";
    function isFullWidth(c: any): boolean;
    var $uid: number;
    namespace Ace {
        type EventEmitter<T extends {
            [K in keyof T]: (...args: any[]) => any;
        }> = import("ace-code").Ace.EventEmitter<T>;
        type EditSessionEvents = import("ace-code").Ace.EditSessionEvents;
        type OptionsProvider<T> = import("ace-code").Ace.OptionsProvider<T>;
        type EditSessionOptions = import("ace-code").Ace.EditSessionOptions;
        type Folding = import("ace-code").Ace.Folding;
        type BracketMatch = import("ace-code").Ace.BracketMatch;
        type Document = import("ace-code").Ace.Document;
        type Point = import("ace-code").Ace.Point;
        type Occur = import("ace-code").Ace.Occur;
        type Operation = import("ace-code").Ace.Operation;
    }
    export interface EditSession extends Ace.EventEmitter<Ace.EditSessionEvents>, Ace.OptionsProvider<Ace.EditSessionOptions>, Ace.Folding, Ace.
        BracketMatch {
        doc: Ace.Document;
        lineWidgetsWidth?: number;
        gutterRenderer?: any;
        selectionMarkerCount?: number;
        multiSelect?: any;
        curOp: Ace.Operation | null;
        getSelectionMarkers(): any[];
    }
}
declare module "ace-code/src/range" {
    /**
     * This object is used in various places to indicate a region within the editor. To better visualize how this works, imagine a rectangle. Each quadrant of the rectangle is analogous to a range, as ranges contain a starting row and starting column, and an ending row, and ending column.
     **/
    export class Range {
        /**
         * Creates a new `Range` object with the given starting and ending rows and columns.
         * @param {Number} [startRow] The starting row
         * @param {Number} [startColumn] The starting column
         * @param {Number} [endRow] The ending row
         * @param {Number} [endColumn] The ending column
         * @constructor
         **/
        constructor(startRow?: number, startColumn?: number, endRow?: number, endColumn?: number);
        start: Point;
        end: Point;
        /**
         * Returns `true` if and only if the starting row and column, and ending row and column, are equivalent to those given by `range`.
         * @param {IRange} range A range to check against
         **/
        isEqual(range: IRange): boolean;
        /**
         * Returns a string containing the range's row and column information, given like this:
         * ```
         *    [start.row/start.column] -> [end.row/end.column]
         * ```
         **/
        toString(): string;
        /**
         * Returns `true` if the `row` and `column` provided are within the given range. This can better be expressed as returning `true` if:
         * ```javascript
         *    this.start.row <= row <= this.end.row &&
         *    this.start.column <= column <= this.end.column
         * ```
         * @param {Number} row A row to check for
         * @param {Number} column A column to check for
         * @related [[Range.compare]]
         **/
        contains(row: number, column: number): boolean;
        /**
         * Compares `this` range (A) with another range (B).
         * @param {IRange} range A range to compare with
         * @related [[Range.compare]]
         * @returns {Number} This method returns one of the following numbers:
         * * `-2`: (B) is in front of (A), and doesn't intersect with (A)
         * * `-1`: (B) begins before (A) but ends inside of (A)
         * * `0`: (B) is completely inside of (A)
         * * `+1`: (B) begins inside of (A) but ends outside of (A)
         * * `+2`: (B) is after (A) and doesn't intersect with (A)
         * * `42`: FTW state: (B) ends in (A) but starts outside of (A)
         **/
        compareRange(range: IRange): number;
        /**
         * Compares the row and column of `p` with the starting and ending [[Point]]'s of the calling range (by calling [[Range.compare]]).
         * @param {Point} p A point to compare with
         * @related [[Range.compare]]
         **/
        comparePoint(p: Point): number;
        /**
         * Checks the start and end [[Point]]'s of `range` and compares them to the calling range. Returns `true` if the `range` is contained within the caller's range.
         * @param {IRange} range A range to compare with
         * @related [[Range.comparePoint]]
         **/
        containsRange(range: IRange): boolean;
        /**
         * Returns `true` if passed in `range` intersects with the one calling this method.
         * @param {IRange} range A range to compare with
         **/
        intersects(range: IRange): boolean;
        /**
         * Returns `true` if the caller's ending row is the same as `row`, and if the caller's ending column is the same as `column`.
         * @param {Number} row A row to compare with
         * @param {Number} column A column to compare with
         **/
        isEnd(row: number, column: number): boolean;
        /**
         * Returns `true` if the caller's starting row is the same as `row`, and if the caller's starting column is the same as `column`.
         * @param {Number} row A row to compare with
         * @param {Number} column A column to compare with
         **/
        isStart(row: number, column: number): boolean;
        /**
         * Sets the starting row and column for the range.
         * @param {Number|Point} row A row to set
         * @param {Number} [column] A column to set
         *
         **/
        setStart(row: number | Point, column?: number): void;
        /**
         * Sets the starting row and column for the range.
         * @param {Number|Point} row A row to set
         * @param {Number} [column] A column to set
         *
         **/
        setEnd(row: number | Point, column?: number): void;
        /**
         * Returns `true` if the `row` and `column` are within the given range.
         * @param {Number} row A row to compare with
         * @param {Number} column A column to compare with
         * @related [[Range.compare]]
         **/
        inside(row: number, column: number): boolean;
        /**
         * Returns `true` if the `row` and `column` are within the given range's starting [[Point]].
         * @param {Number} row A row to compare with
         * @param {Number} column A column to compare with
         * @related [[Range.compare]]
         **/
        insideStart(row: number, column: number): boolean;
        /**
         * Returns `true` if the `row` and `column` are within the given range's ending [[Point]].
         * @param {Number} row A row to compare with
         * @param {Number} column A column to compare with
         * @related [[Range.compare]]
         *
         **/
        insideEnd(row: number, column: number): boolean;
        /**
         * Compares the `row` and `column` with the starting and ending [[Point]]'s of the calling range.
         * @param {Number} row A row to compare with
         * @param {Number} column A column to compare with
         * @returns {Number} This method returns one of the following numbers:
         * * `1` if `row` is greater than the calling range
         * * `-1` if `row` is less then the calling range
         * * `0` otherwise
         *
         * If the starting row of the calling range is equal to `row`, and:
         * * `column` is greater than or equal to the calling range's starting column, this returns `0`
         * * Otherwise, it returns -1
         *
         * If the ending row of the calling range is equal to `row`, and:
         * * `column` is less than or equal to the calling range's ending column, this returns `0`
         * * Otherwise, it returns 1
         **/
        compare(row: number, column: number): number;
        /**
         * Compares the `row` and `column` with the starting and ending [[Point]]'s of the calling range.
         * @param {Number} row A row to compare with
         * @param {Number} column A column to compare with
         * @returns {Number} This method returns one of the following numbers:
         * * `-1` if calling range's starting column and calling range's starting row are equal `row` and `column`
         * * Otherwise, it returns the value after calling [[Range.compare `compare()`]].
         **/
        compareStart(row: number, column: number): number;
        /**
         * Compares the `row` and `column` with the starting and ending [[Point]]'s of the calling range.
         * @param {Number} row A row to compare with
         * @param {Number} column A column to compare with
         * @returns {Number} This method returns one of the following numbers:
         * * `1` if calling range's ending column and calling range's ending row are equal `row` and `column`.
         * * Otherwise, it returns the value after calling [[Range.compare `compare()`]].
         */
        compareEnd(row: number, column: number): number;
        /**
         * Compares the `row` and `column` with the start and end [[Point]]'s of the calling range.
         * @param {Number} row A row to compare with
         * @param {Number} column A column to compare with
         * @returns {Number} This method returns one of the following numbers:
         * * `1` if the ending row of the calling range is equal to `row`, and the ending column of the calling range is equal to `column`
         * * `-1` if the starting row of the calling range is equal to `row`, and the starting column of the calling range is equal to `column`
         * * Otherwise, it returns the value after calling [[Range.compare `compare()`]].
         **/
        compareInside(row: number, column: number): number;
        /**
         * Returns the part of the current `Range` that occurs within the boundaries of `firstRow` and `lastRow` as a new `Range` object.
         * @param {Number} firstRow The starting row
         * @param {Number} lastRow The ending row
        **/
        clipRows(firstRow: number, lastRow: number): Range;
        /**
         * Changes the `row` and `column` for the calling range for both the starting and ending [[Point]]'s.
         * @param {Number} row A new row to extend to
         * @param {Number} column A new column to extend to
         * @returns {Range} The original range with the new row
        **/
        extend(row: number, column: number): Range;
        /**
         * Returns `true` if the calling range is empty (starting [[Point]] == ending [[Point]]).
         **/
        isEmpty(): boolean;
        /**
         * Returns `true` if the range spans across multiple lines.
        **/
        isMultiLine(): boolean;
        /**
         * Returns a duplicate of the calling range.
        **/
        clone(): Range;
        /**
         * Returns a range containing the starting and ending rows of the original range, but with a column value of `0`.
        **/
        collapseRows(): Range;
        /**
         * Given the current `Range`, this function converts those starting and ending [[Point]]'s into screen positions, and then returns a new `Range` object.
         * @param {EditSession} session The `EditSession` to retrieve coordinates from
        **/
        toScreenRange(session: EditSession): Range;
        /**
         * Shift the calling range by `row` and `column` values.
         * @experimental
         */
        moveBy(row: number, column: number): void;
        id?: number;
        cursor?: import("ace-code").Ace.Point;
        isBackwards?: boolean;
    }
    export namespace Range {
        export { fromPoints, comparePoints };
    }
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    export type IRange = import("ace-code").Ace.IRange;
    export type Point = import("ace-code").Ace.Point;
    /**
     * Creates and returns a new `Range` based on the `start` [[Point]] and `end` [[Point]] of the given parameters.
     * @param {Point} start A starting point to use
     * @param {Point} end An ending point to use
    **/
    function fromPoints(start: Point, end: Point): Range;
    /**
     * Compares `p1` and `p2` [[Point]]'s, useful for sorting
     */
    function comparePoints(p1: Point, p2: Point): number;
    namespace Ace {
        type Point = import("ace-code").Ace.Point;
    }
    export interface Range {
        id?: number;
        cursor?: Ace.Point;
        isBackwards?: boolean;
    }
}
declare module "ace-code/src/worker/worker_client" {
    export var WorkerClient: any;
}
declare module "ace-code/src/placeholder" {
    export class PlaceHolder {
        constructor(session: EditSession, length: number, pos: import("ace-code").Ace.Point, others: any[], mainClass: string, othersClass: string);
        length: number;
        session: import("ace-code/src/edit_session").EditSession;
        doc: import("ace-code/src/document").Document;
        mainClass: string;
        othersClass: string;
        /**
         * PlaceHolder.setup()
         *
         * TODO
         *
         **/
        setup(): void;
        selectionBefore: Range | Range[];
        pos: import("ace-code/src/anchor").Anchor;
        others: any[];
        /**
         * PlaceHolder.showOtherMarkers()
         *
         * TODO
         *
         **/
        showOtherMarkers(): void;
        othersActive: boolean;
        /**
         * PlaceHolder.hideOtherMarkers()
         *
         * Hides all over markers in the [[EditSession `EditSession`]] that are not the currently selected one.
         *
         **/
        hideOtherMarkers(): void;
        updateAnchors(delta: import("ace-code").Ace.Delta): void;
        updateMarkers(): void;
        /**
         * PlaceHolder.detach()
         *
         * TODO
         *
         **/
        detach(): void;
        /**
         * PlaceHolder.cancel()
         *
         * TODO
         *
         **/
        cancel(): void;
    }
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    import { Range } from "ace-code/src/range";
    namespace Ace {
        type EventEmitter<T extends {
            [K in keyof T]: (...args: any[]) => any;
        }> = import("ace-code").Ace.EventEmitter<T>;
        type PlaceHolderEvents = import("ace-code").Ace.PlaceHolderEvents;
    }
    export interface PlaceHolder extends Ace.EventEmitter<Ace.PlaceHolderEvents> {
    }
}
declare module "ace-code/src/mouse/multi_select_handler" {
    export function onMouseDown(e: any): any;
}
declare module "ace-code/src/commands/multi_select_commands" {
    export const defaultCommands: import("ace-code").Ace.Command[];
    export const multiSelectCommands: import("ace-code").Ace.Command[];
    export const keyboardHandler: HashHandler;
    import { HashHandler } from "ace-code/src/keyboard/hash_handler";
}
declare module "ace-code/src/multi_select" {
    export const commands: import("ace-code").Ace.Command[];
    export const onSessionChange: (e: any) => void;
    export type Anchor = import("ace-code/src/anchor").Anchor;
    export type Point = import("ace-code").Ace.Point;
    export type ScreenCoordinates = import("ace-code").Ace.ScreenCoordinates;
    export function MultiSelect(editor: Editor): void;
    import { Editor } from "ace-code/src/editor";
}
declare module "ace-code/src/commands/occur_commands" {
    export namespace occurStartCommand {
        let name: string;
        function exec(editor: any, options: any): void;
        let readOnly: boolean;
    }
}
declare module "ace-code/src/commands/incremental_search_commands" {
    export const iSearchStartCommands: ({
        name: string;
        bindKey: {
            win: string;
            mac: string;
        };
        exec: (editor: any, options: any) => void;
        readOnly: boolean;
    } | {
        name: string;
        exec: (editor: any, jumpToNext: any) => void;
        readOnly: boolean;
        bindKey?: undefined;
    })[];
    export const iSearchCommands: ({
        name: string;
        bindKey: {
            win: string;
            mac: string;
        };
        exec: (iSearch: any, options: any) => void;
    } | {
        name: string;
        exec: (iSearch: any, string: any) => void;
        bindKey?: undefined;
    } | {
        name: string;
        bindKey: string;
        exec: (iSearch: any) => void;
    })[];
    export function IncrementalSearchKeyboardHandler(iSearch: any): void;
    export class IncrementalSearchKeyboardHandler {
        constructor(iSearch: any);
    }
}
declare module "ace-code/src/incremental_search" {
    /**
     * Implements immediate searching while the user is typing. When incremental
     * search is activated, keystrokes into the editor will be used for composing
     * a search term. Immediately after every keystroke the search is updated:
     * - so-far-matching characters are highlighted
     * - the cursor is moved to the next match
     *
     **/
    export class IncrementalSearch extends Search {
        activate(editor: any, backwards: boolean): void;
        deactivate(reset?: boolean): void;
        selectionFix(editor: Editor): void;
        highlight(regexp: RegExp): void;
        cancelSearch(reset?: boolean): Range;
        highlightAndFindWithNeedle(moveToNext: boolean, needleUpdateFunc: Function): false | Range;
        addString(s: string): false | Range;
        removeChar(c: any): false | Range;
        next(options: any): false | Range;
        convertNeedleToRegExp(): false | Range;
        convertNeedleToString(): false | Range;
        statusMessage(found: any): void;
        message(msg: any): void;
    }
    import { Search } from "ace-code/src/search";
    import iSearchCommandModule = require("ace-code/src/commands/incremental_search_commands");
    import { Editor } from "ace-code/src/editor";
    import { Range } from "ace-code/src/range";
}
declare module "ace-code/src/split" {
    export type ISplit = import("ace-code").Ace.EventEmitter<any> & {
        [key: string]: any;
    };
    export var Split: any;
}
declare module "ace-code/src/tokenizer_dev" {
    export class Tokenizer extends BaseTokenizer {
        /**
         * Returns an object containing two properties: `tokens`, which contains all the tokens; and `state`, the current state.
         **/
        getLineTokens(line: any, startState: any): any;
    }
    import { Tokenizer as BaseTokenizer } from "ace-code/src/tokenizer";
}
declare module "ace-code/src/unicode" {
    export const wordChars: any;
}
declare module "ace-code/src/keyboard/textarea" {
    export const handler: HashHandler;
    import { HashHandler } from "ace-code/src/keyboard/hash_handler";
}
