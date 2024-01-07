declare module "lib/useragent" {
    export namespace OS {
        let LINUX: string;
        let MAC: string;
        let WINDOWS: string;
    }
    export function getOS(): string;
    export const isWin: boolean;
    export const isMac: boolean;
    export const isLinux: boolean;
    export const isIE: number;
    export const isOldIE: boolean;
    export const isGecko: any;
    export const isMozilla: any;
    export const isOpera: boolean;
    export const isWebKit: number;
    export const isChrome: number;
    export const isSafari: true;
    export const isEdge: number;
    export const isAIR: boolean;
    export const isAndroid: boolean;
    export const isChromeOS: boolean;
    export const isIOS: boolean;
    export const isMobile: boolean;
}
declare module "lib/dom" {
    export function buildDom(arr: any, parent?: HTMLElement, refs?: any): HTMLElement | Text | any[];
    export function getDocumentHead(doc?: Document): HTMLHeadElement | HTMLElement;
    export function createElement<T extends keyof HTMLElementTagNameMap>(tag: string | T, ns?: string): HTMLElementTagNameMap[T];
    export function removeChildren(element: HTMLElement): void;
    export function createTextNode(textContent: string, element?: HTMLElement): Text;
    export function createFragment(element?: HTMLElement): DocumentFragment;
    export function hasCssClass(el: HTMLElement, name: string): boolean;
    export function addCssClass(el: HTMLElement, name: string): void;
    export function removeCssClass(el: HTMLElement, name: string): void;
    export function toggleCssClass(el: HTMLElement, name: string): boolean;
    export function setCssClass(node: HTMLElement, className: string, include: boolean): void;
    export function hasCssString(id: string, doc?: Document): boolean;
    export function removeElementById(id: string, doc?: Document): void;
    export function useStrictCSP(value: any): void;
    export function importCssStylsheet(uri: string, doc?: Document): void;
    export function scrollbarWidth(doc?: Document): number;
    export function computedStyle(element: Element, style?: any): Partial<CSSStyleDeclaration>;
    export function setStyle(styles: CSSStyleDeclaration, property: string, value: string): void;
    export const HAS_CSS_ANIMATION: boolean;
    export const HAS_CSS_TRANSFORMS: boolean;
    export const HI_DPI: boolean;
    export function translate(element: any, tx: any, ty: any): void;
    export function importCssString(cssText: any, id: any, target: any): number;
}
declare module "lib/oop" {
    export function inherits(ctor: any, superCtor: any): void;
    export function mixin<T>(obj: T, mixin: any): any;
    export function implement<T>(proto: T, mixin: any): any;
}
declare module "lib/deep_copy" {
    export function deepCopy(obj: any): any;
}
declare module "lib/lang" {
    export function last(a: any): any;
    export function stringReverse(string: any): any;
    export function stringRepeat(string: any, count: any): string;
    export function stringTrimLeft(string: any): any;
    export function stringTrimRight(string: any): any;
    export function copyObject(obj: any): {};
    export function copyArray(array: any): any[];
    export const deepCopy: (obj: any) => any;
    export function arrayToMap(arr: any): {};
    export function createMap(props: any): any;
    export function arrayRemove(array: any, value: any): void;
    export function escapeRegExp(str: any): any;
    export function escapeHTML(str: any): string;
    export function getMatchOffsets(string: any, regExp: any): any[];
    export function deferredCall(fcn: any): {
        (timeout: any): any;
        schedule: any;
        call(): any;
        cancel(): any;
        isPending(): any;
    };
    export function delayedCall(fcn: any, defaultTimeout: any): {
        (timeout: any): void;
        delay(timeout: any): void;
        schedule: any;
        call(): void;
        cancel(): void;
        isPending(): any;
    };
    export function supportsLookbehind(): boolean;
    export function skipEmptyMatch(line: any, last: any, supportsUnicodeFlag: any): 1 | 2;
}
declare module "lib/keys" {
    export default "lib/keys";
    export function keyCodeToString(keyCode: any): any;
    namespace ___workspaces_ace_src_lib_keys_ { }
}
declare module "lib/event" {
    export function addListener(elem: any, type: any, callback: any, destroyer: any | null): void;
    export function removeListener(elem: any, type: any, callback: any): void;
    export function stopEvent(e: any): boolean;
    export function stopPropagation(e: any): void;
    export function preventDefault(e: any): void;
    export function getButton(e: any): any;
    export function capture(el: any, eventHandler: any, releaseCaptureHandler: any): (e: any) => void;
    export function addMouseWheelListener(el: any, callback: any, destroyer?: any): void;
    export function addMultiMouseDownListener(elements: any, timeouts: any, eventHandler: any, callbackName: any, destroyer?: any): void;
    export function getModifierString(e: any): any;
    export function addCommandKeyListener(el: any, callback: any, destroyer?: any): void;
    export function nextTick(callback: any, win: any): void;
    export const $idleBlocked: boolean;
    export function onIdle(cb: any, timeout: any): number;
    export const $idleBlockId: number;
    export function blockIdle(delay: any): void;
    export const nextFrame: any;
}
declare module "lib/event_emitter" {
    /**@type {any}*/
    export var EventEmitter: any;
}
declare module "layer/font_metrics" {
    const FontMetrics_base: undefined;
    export class FontMetrics extends FontMetrics_base {
        /**
         * @param {HTMLElement} parentEl
         */
        constructor(parentEl: HTMLElement);
        el: HTMLDivElement;
        $main: HTMLDivElement;
        $measureNode: HTMLDivElement;
        $characterSize: {
            width: number;
            height: number;
        };
        $setMeasureNodeStyles(style: any, isRoot: any): void;
        /**
         * @param size
         */
        checkForSizeChanges(size: any): void;
        charSizes: any;
        allowBoldFonts: boolean;
        $addObserver(): void;
        $observer: ResizeObserver;
        /**
         * @return {number}
         */
        $pollSizeChanges(): number;
        $pollSizeChangesTimer: number;
        /**
         * @param {boolean} val
         */
        setPolling(val: boolean): void;
        $measureSizes(node: any): {
            height: any;
            width: number;
        };
        $measureCharWidth(ch: any): number;
        getCharacterWidth(ch: any): any;
        destroy(): void;
        $getZoom(element: any): any;
        $initTransformMeasureNodes(): void;
        els: any[] | HTMLElement | Text;
        transformCoordinates(clientPos: any, elPos: any): any[];
    }
    export {};
}
declare module "apply_delta" {
    export function applyDelta(docLines: string[], delta: import("../ace-internal").Ace.Delta, doNotValidate?: any): void;
}
declare module "document" {
    const Document_base: undefined;
    /**
     * Contains the text of the document. Document can be attached to several [[EditSession `EditSession`]]s.
     * At its core, `Document`s are just an array of strings, with each row in the document matching up to the array index.
     **/
    export class Document extends Document_base {
        /**
         *
         * Creates a new `Document`. If `text` is included, the `Document` contains those strings; otherwise, it's empty.
         * @param {String | String[]} textOrLines text The starting text
         **/
        constructor(textOrLines: string | string[]);
        /**@type {string[]}*/
        $lines: string[];
        /**
         * Replaces all the lines in the current `Document` with the value of `text`.
         *
         * @param {String} text The text to use
         **/
        setValue(text: string): void;
        /**
         * Returns all the lines in the document as a single string, joined by the new line character.
         * @returns {String}
         **/
        getValue(): string;
        /**
         * Creates a new `Anchor` to define a floating point in the document.
         * @param {Number} row The row number to use
         * @param {Number} column The column number to use
         * @returns {Anchor}
         **/
        createAnchor(row: number, column: number): Anchor;
        /**
         * @param {string} text
         */
        $detectNewLine(text: string): void;
        $autoNewLine: string;
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
         * @param {NewLineMode} newLineMode [The newline mode to use; can be either `windows`, `unix`, or `auto`]{: #Document.setNewLineMode.param}
         
         **/
        setNewLineMode(newLineMode: NewLineMode): void;
        $newLineMode: any;
        /**
         * [Returns the type of newlines being used; either `windows`, `unix`, or `auto`]{: #Document.getNewLineMode}
         * @returns {NewLineMode}
         **/
        getNewLineMode(): NewLineMode;
        /**
         * Returns `true` if `text` is a newline character (either `\r\n`, `\r`, or `\n`).
         * @param {String} text The text to check
         * @returns {boolean}
         **/
        isNewLine(text: string): boolean;
        /**
         * Returns a verbatim copy of the given line as it is in the document
         * @param {Number} row The row index to retrieve
         * @returns {string}
         **/
        getLine(row: number): string;
        /**
         * Returns an array of strings of the rows between `firstRow` and `lastRow`. This function is inclusive of `lastRow`.
         * @param {Number} firstRow The first row index to retrieve
         * @param {Number} lastRow The final row index to retrieve
         * @returns {string[]}
         **/
        getLines(firstRow: number, lastRow: number): string[];
        /**
         * Returns all lines in the document as string array.
         * @returns {string[]}
         **/
        getAllLines(): string[];
        /**
         * Returns the number of rows in the document.
         * @returns {Number}
         **/
        getLength(): number;
        /**
         * Returns all the text within `range` as a single string.
         * @param {IRange} range The range to work with.
         *
         * @returns {String}
         **/
        getTextRange(range: IRange): string;
        /**
         * Returns all the text within `range` as an array of lines.
         * @param {IRange} range The range to work with.
         *
         * @returns {string[]}
         **/
        getLinesForRange(range: IRange): string[];
        /**
         * @param row
         * @param lines
         
         * @deprecated
         */
        insertLines(row: any, lines: any): void;
        /**
         * @param firstRow
         * @param lastRow
         * @returns {String[]}
         
         * @deprecated
         */
        removeLines(firstRow: any, lastRow: any): string[];
        /**
         * @param position
         * @returns {Point}
         
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
        /**
         *
         * @param {number} row
         * @param {number} column
         * @return {Point}
         */
        clippedPos(row: number, column: number): Point;
        /**
         * @param {Point} pos
         * @return {Point}
         */
        clonePos(pos: Point): Point;
        /**
         * @param {number} row
         * @param {number} column
         * @return {Point}
         */
        pos(row: number, column: number): Point;
        /**
         * @param {Point} position
         * @return {Point}
         * @private
         */
        private $clipPosition;
        /**
         * Inserts the elements in `lines` into the document as full lines (does not merge with existing line), starting at the row index given by `row`. This method also triggers the `"change"` event.
         * @param {Number} row The index of the row to insert at
         * @param {string[]} lines An array of strings
         
         **/
        insertFullLines(row: number, lines: string[]): void;
        /**
         * Inserts the elements in `lines` into the document, starting at the position index given by `row`. This method also triggers the `"change"` event.
         * @param {Point} position
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
         * @param {boolean} [doNotValidate]
         **/
        applyDelta(delta: Delta, doNotValidate?: boolean): void;
        /**
         * @param {Delta} delta
         */
        $safeApplyDelta(delta: Delta): void;
        /**
         *
         * @param {Delta} delta
         * @param {number} MAX
         */
        $splitAndapplyLargeDelta(delta: Delta, MAX: number): void;
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
        /**
         * Splits a string of text on any newline (`\n`) or carriage-return (`\r`) characters.
         *
         * @method $split
         * @param {String} text The text to work with
         * @returns {String[]} A String array, with each index containing a piece of the original `text` string.
         *
         **/
        $split(text: string): string[];
    }
    export type Delta = import("../ace-internal").Ace.Delta;
    export type Point = import("../ace-internal").Ace.Point;
    export type IRange = import("../ace-internal").Ace.IRange;
    export type NewLineMode = import("../ace-internal").Ace.NewLineMode;
    import Anchor_1 = require("anchor");
    import Anchor = Anchor_1.Anchor;
    import Range_1 = require("range");
    import Range = Range_1.Range;
    export {};
}
declare module "anchor" {
    const Anchor_base: undefined;
    /**
     * Defines a floating pointer in the document. Whenever text is inserted or deleted before the cursor, the position of the anchor is updated.
     **/
    export class Anchor extends Anchor_base {
        /**
         * Creates a new `Anchor` and associates it with a document.
         *
         * @param {Document} doc The document to associate with the anchor
         * @param {Number|import("../ace-internal").Ace.Point} row The starting row position
         * @param {Number} [column] The starting column position
         **/
        constructor(doc: Document, row: number | import("../ace-internal").Ace.Point, column?: number);
        $onChange: any;
        /**
         * Returns an object identifying the `row` and `column` position of the current anchor.
         * @returns {import("../ace-internal").Ace.Point}
         **/
        getPosition(): import("../ace-internal").Ace.Point;
        /**
         *
         * Returns the current document.
         * @returns {Document}
         **/
        getDocument(): Document;
        /**
         * Internal function called when `"change"` event fired.
         * @param {import("../ace-internal").Ace.Delta} delta
         */
        onChange(delta: import("../ace-internal").Ace.Delta): void;
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
        /**@type{Document}*/
        document: Document;
        /**
         * Clips the anchor position to the specified row and column.
         * @param {Number} row The row index to clip the anchor to
         * @param {Number} column The column index to clip the anchor to
         * @returns {import("../ace-internal").Ace.Point}
         *
         **/
        $clipPositionToDocument(row: number, column: number): import("../ace-internal").Ace.Point;
        /**
         * experimental: allows anchor to stick to the next on the left
         */
        $insertRight: boolean;
        markerId?: number;
    }
    export type Document = import("document").Document;
    export {};
}
declare module "lib/net" {
    export function get(url: any, callback: any): void;
    export function loadScript(path: any, callback: any): void;
    export function qualifyURL(url: any): string;
}
declare module "lib/report_error" {
    export function reportError(msg: any, data: any): void;
}
declare module "lib/app_config" {
    const AppConfig_base: undefined;
    export class AppConfig extends AppConfig_base {
        $defaultOptions: {};
        /**
         * @param {Object} obj
         * @param {string} path
         * @param {{ [key: string]: any }} options
         * @returns {AppConfig}
         */
        defineOptions(obj: any, path: string, options: {
            [key: string]: any;
        }): AppConfig;
        /**
         * @param {Object} obj
         */
        resetOptions(obj: any): void;
        /**
         * @param {string} path
         * @param {string} name
         * @param {any} value
         */
        setDefaultValue(path: string, name: string, value: any): boolean;
        /**
         * @param {string} path
         * @param {{ [key: string]: any; }} optionHash
         */
        setDefaultValues(path: string, optionHash: {
            [key: string]: any;
        }): void;
        /**
         * @param {any} value
         */
        setMessages(value: any): void;
        /**
         * @param {string} string
         * @param {{ [x: string]: any; }} [params]
         */
        nls(string: string, params?: {
            [x: string]: any;
        }): any;
        warn: typeof warn;
        reportError: (msg: any, data: any) => void;
    }
    function warn(message: any, ...args: any[]): void;
    export {};
}
declare module "theme/textmate-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/textmate" {
    export const isDark: false;
    export const cssClass: "ace-tm";
    export const cssText: string;
    export const $id: "ace/theme/textmate";
}
declare module "config" {
    const _exports: {
        $defaultOptions: {};
        defineOptions(obj: any, path: string, options: {
            [key: string]: any;
        }): AppConfig;
        resetOptions(obj: any): void;
        setDefaultValue(path: string, name: string, value: any): boolean;
        setDefaultValues(path: string, optionHash: {
            [key: string]: any;
        }): void;
        setMessages(value: any): void;
        nls(string: string, params?: {
            [x: string]: any;
        }): any;
        warn: (message: any, ...args: any[]) => void;
        reportError: (msg: any, data: any) => void;
        once<K extends string | number | symbol>(name: K, callback: any): void;
        setDefaultHandler(name: string, callback: Function): void;
        removeDefaultHandler(name: string, callback: Function): void;
        on<K_1 extends string | number | symbol>(name: K_1, callback: any, capturing?: boolean): any;
        addEventListener<K_2 extends string | number | symbol>(name: K_2, callback: any, capturing?: boolean): any;
        off<K_3 extends string | number | symbol>(name: K_3, callback: any): void;
        removeListener<K_4 extends string | number | symbol>(name: K_4, callback: any): void;
        removeEventListener<K_5 extends string | number | symbol>(name: K_5, callback: any): void;
        removeAllListeners(name?: string): void;
        _signal(eventName: string, e: any): void;
        _emit(eventName: string, e: any): void;
        _dispatchEvent(eventName: string, e: any): void;
        /**
         * @param {string} key
         * @return {*}
         */
        get: (key: string) => any;
        /**
         * @param {string} key
         * @param value
         */
        set: (key: string, value: any) => void;
        /**
         * @return {{[key: string]: any}}
         */
        all: () => {
            [key: string]: any;
        };
        $modes: {};
        /**
         * module loading
         * @param {string} name
         * @param {string} [component]
         * @returns {string}
         */
        moduleUrl: (name: string, component?: string) => string;
        /**
         * @param {string} name
         * @param {string} subst
         * @returns {string}
         */
        setModuleUrl: (name: string, subst: string) => string;
        /**
         * @param {(moduleName: string, afterLoad: (err: Error | null, module: unknown) => void) => void}cb
         */
        setLoader: (cb: (moduleName: string, afterLoad: (err: Error | null, module: unknown) => void) => void) => void;
        dynamicModules: any;
        $loading: {};
        $loaded: {};
        /**
         * @param {string | [string, string]} moduleId
         * @param {(module: any) => void} onLoad
         */
        loadModule: (moduleId: string | [string, string], onLoad: (module: any) => void) => void;
        $require: (moduleName: any) => any;
        setModuleLoader: (moduleName: any, onLoad: any) => void;
        version: "1.32.2";
    };
    export = _exports;
    export function get(key: string): any;
    export function set(key: string, value: any): void;
    export function all(): {
        [key: string]: any;
    };
    export const $modes: {};
    export function moduleUrl(name: string, component?: string): string;
    export function setModuleUrl(name: string, subst: string): string;
    export function setLoader(cb: (moduleName: string, afterLoad: (err: Error | null, module: unknown) => void) => void): void;
    export const dynamicModules: any;
    export const $loading: {};
    export const $loaded: {};
    export function loadModule(moduleId: string | [string, string], onLoad: (module: any) => void): void;
    export function $require(moduleName: any): any;
    export function setModuleLoader(moduleName: any, onLoad: any): void;
    export const version: "1.32.2";
    import AppConfig_1 = require("lib/app_config");
    import AppConfig = AppConfig_1.AppConfig;
}
declare module "layer/lines" {
    export type EditSession = import("edit_session").EditSession;
    export type LayerConfig = import("../ace-internal").Ace.LayerConfig;
    export class Lines {
        /**
         * @param {HTMLElement} element
         * @param {number} [canvasHeight]
         */
        constructor(element: HTMLElement, canvasHeight?: number);
        element: HTMLElement;
        canvasHeight: number;
        cells: any[];
        cellCache: any[];
        $offsetCoefficient: number;
        /**
         * @param {LayerConfig} config
         */
        moveContainer(config: LayerConfig): void;
        /**
         * @param {LayerConfig} oldConfig
         * @param {LayerConfig} newConfig
         */
        pageChanged(oldConfig: LayerConfig, newConfig: LayerConfig): boolean;
        /**
         * @param {number} row
         * @param {Partial<LayerConfig>} config
         * @param {EditSession} session
         */
        computeLineTop(row: number, config: Partial<LayerConfig>, session: EditSession): number;
        /**
         * @param {number} row
         * @param {LayerConfig} config
         * @param {EditSession} session
         */
        computeLineHeight(row: number, config: LayerConfig, session: EditSession): number;
        getLength(): number;
        /**
         * @param {number} index
         */
        get(index: number): any;
        shift(): void;
        pop(): void;
        push(cell: any): void;
        unshift(cell: any): void;
        last(): any;
        $cacheCell(cell: any): void;
        createCell(row: any, config: any, session: any, initElement: any): any;
    }
}
declare module "layer/gutter" {
    const Gutter_base: undefined;
    export class Gutter extends Gutter_base {
        /**
         * @param {HTMLElement} parentEl
         */
        constructor(parentEl: HTMLElement);
        element: HTMLDivElement;
        gutterWidth: number;
        $annotations: any[];
        /**
         * @param {import("../../ace-internal").Ace.Delta} delta
         */
        $updateAnnotations(delta: import("../../ace-internal").Ace.Delta): void;
        $lines: Lines;
        /**
         * @param {EditSession} session
         */
        setSession(session: EditSession): void;
        session: import("edit_session").EditSession;
        /**
         * @param {number} row
         * @param {string} className
         */
        addGutterDecoration(row: number, className: string): void;
        /**
         * @param {number} row
         * @param {string} className
         */
        removeGutterDecoration(row: number, className: string): void;
        /**
         * @param {any[]} annotations
         */
        setAnnotations(annotations: any[]): void;
        /**
         * @param {LayerConfig} config
         */
        update(config: LayerConfig): void;
        config: import("../../ace-internal").Ace.LayerConfig;
        oldLastRow: number;
        /**
         * @param {LayerConfig} config
         */
        $updateGutterWidth(config: LayerConfig): void;
        $updateCursorRow(): void;
        $cursorRow: any;
        updateLineHighlight(): void;
        $cursorCell: any;
        /**
         * @param {LayerConfig} config
         */
        scrollLines(config: LayerConfig): void;
        /**
         * @param {LayerConfig} config
         * @param {number} firstRow
         * @param {number} lastRow
         */
        $renderLines(config: LayerConfig, firstRow: number, lastRow: number): any[];
        /**
         * @param {any} cell
         * @param {LayerConfig} config
         * @param {import("../../ace-internal").Ace.IRange | undefined} fold
         * @param {number} row
         */
        $renderCell(cell: any, config: LayerConfig, fold: import("../../ace-internal").Ace.IRange | undefined, row: number): any;
        /**
         * @param {boolean} highlightGutterLine
         */
        setHighlightGutterLine(highlightGutterLine: boolean): void;
        $highlightGutterLine: boolean;
        /**
         * @param {boolean} show
         */
        setShowLineNumbers(show: boolean): void;
        $renderer: string | {
            getWidth: () => number;
            getText: () => string;
        };
        getShowLineNumbers(): boolean;
        /**
         * @param {boolean} [show]
         */
        setShowFoldWidgets(show?: boolean): void;
        $showFoldWidgets: boolean;
        $padding: {};
        getShowFoldWidgets(): boolean;
        $computePadding(): {};
        /**
         * @param {{ x: number; }} point
         */
        getRegion(point: {
            x: number;
        }): "markers" | "foldWidgets";
        $fixedWidth: boolean;
        $showLineNumbers: boolean;
        $useSvgGutterIcons?: boolean;
        $showFoldedAnnotations?: boolean;
    }
    export type EditSession = import("edit_session").EditSession;
    export type LayerConfig = import("../ace-internal").Ace.LayerConfig;
    import Lines_1 = require("layer/lines");
    import Lines = Lines_1.Lines;
    export {};
}
declare module "layer/marker" {
    export type EditSession = import("edit_session").EditSession;
    export type LayerConfig = import("../ace-internal").Ace.LayerConfig;
    export class Marker {
        /**
         * @param {HTMLElement} parentEl
         */
        constructor(parentEl: HTMLElement);
        element: HTMLDivElement;
        /**
         * @param {number} padding
         */
        setPadding(padding: number): void;
        $padding: number;
        /**
         * @param {EditSession} session
         */
        setSession(session: EditSession): void;
        session: import("edit_session").EditSession;
        /**
         * @param {{ [x: number]: import("../../ace-internal").Ace.MarkerLike; }} markers
         */
        setMarkers(markers: {
            [x: number]: import("../../ace-internal").Ace.MarkerLike;
        }): void;
        markers: {
            [x: number]: import("../../ace-internal").Ace.MarkerLike;
        };
        /**
         * @param {string} className
         * @param {string} css
         */
        elt(className: string, css: string): void;
        i: number;
        /**
         * @param {LayerConfig} config
         */
        update(config: LayerConfig): void;
        config: import("../../ace-internal").Ace.LayerConfig;
        /**
         * @param {number} row
         * @param {Partial<LayerConfig>} layerConfig
         */
        $getTop(row: number, layerConfig: Partial<LayerConfig>): number;
        /**
         * @param {undefined} stringBuilder
         * @param {Range} range
         * @param {string} clazz
         * @param {Partial<LayerConfig>} layerConfig
         * @param {string} [extraStyle]
         */
        drawTextMarker(stringBuilder: undefined, range: Range, clazz: string, layerConfig: Partial<LayerConfig>, extraStyle?: string): void;
        /**
         * @param {undefined} stringBuilder
         * @param {Range} range
         * @param {string} clazz
         * @param {LayerConfig} config
         * @param {string} [extraStyle]
         */
        drawMultiLineMarker(stringBuilder: undefined, range: Range, clazz: string, config: LayerConfig, extraStyle?: string): void;
        /**
         * @param {undefined} stringBuilder
         * @param {Range} range
         * @param {string} clazz
         * @param {Partial<LayerConfig>} config
         * @param {number} [extraLength]
         * @param {string} [extraStyle]
         */
        drawSingleLineMarker(stringBuilder: undefined, range: Range, clazz: string, config: Partial<LayerConfig>, extraLength?: number, extraStyle?: string): void;
        /**
         * @param {undefined} stringBuilder
         * @param {Range} range
         * @param {string} clazz
         * @param {Partial<LayerConfig>} config
         * @param {number} extraLength
         * @param {string} extraStyle
         */
        drawBidiSingleLineMarker(stringBuilder: undefined, range: Range, clazz: string, config: Partial<LayerConfig>, extraLength: number, extraStyle: string): void;
        /**
         * @param {undefined} stringBuilder
         * @param {Range} range
         * @param {string} clazz
         * @param {Partial<LayerConfig>} config
         * @param {undefined} [extraStyle]
         */
        drawFullLineMarker(stringBuilder: undefined, range: Range, clazz: string, config: Partial<LayerConfig>, extraStyle?: undefined): void;
        /**
         * @param {undefined} stringBuilder
         * @param {Range} range
         * @param {string} clazz
         * @param {Partial<LayerConfig>} config
         * @param {undefined} [extraStyle]
         */
        drawScreenLineMarker(stringBuilder: undefined, range: Range, clazz: string, config: Partial<LayerConfig>, extraStyle?: undefined): void;
    }
    import Range_2 = require("range");
    import Range = Range_2.Range;
}
declare module "layer/text_util" {
    export function isTextToken(tokenType: any): boolean;
}
declare module "layer/text" {
    const Text_base: undefined;
    export class Text extends Text_base {
        /**
         * @param {HTMLElement} parentEl
         */
        constructor(parentEl: HTMLElement);
        dom: typeof dom;
        element: HTMLDivElement;
        $updateEolChar(): boolean;
        $lines: Lines;
        EOL_CHAR: any;
        /**
         * @param {number} padding
         */
        setPadding(padding: number): void;
        $padding: number;
        /**
         * @returns {number}
         */
        getLineHeight(): number;
        /**
         * @returns {number}
         */
        getCharacterWidth(): number;
        /**
         * @param {any} measure
         */
        $setFontMetrics(measure: any): void;
        $fontMetrics: any;
        checkForSizeChanges(): void;
        $pollSizeChanges(): any;
        $pollSizeChangesTimer: any;
        /**
         * @param {EditSession} session
         */
        setSession(session: EditSession): void;
        /**@type {EditSession}*/
        session: EditSession;
        /**
         * @param {string} showInvisibles
         */
        setShowInvisibles(showInvisibles: string): boolean;
        showInvisibles: any;
        showSpaces: boolean;
        showTabs: boolean;
        showEOL: boolean;
        /**
         * @param {boolean} display
         */
        setDisplayIndentGuides(display: boolean): boolean;
        displayIndentGuides: any;
        /**
         * @param {boolean} highlight
         */
        setHighlightIndentGuides(highlight: boolean): boolean;
        $highlightIndentGuides: any;
        $computeTabString(): void;
        tabSize: number;
        $tabStrings: any;
        $indentGuideRe: RegExp;
        /**
         * @param {LayerConfig} config
         * @param {number} firstRow
         * @param {number} lastRow
         */
        updateLines(config: LayerConfig, firstRow: number, lastRow: number): void;
        config?: import("../../ace-internal").Ace.LayerConfig;
        /**
         * @param {LayerConfig} config
         */
        scrollLines(config: LayerConfig): void;
        /**
         * @param {LayerConfig} config
         * @param {number} firstRow
         * @param {number} lastRow
         */
        $renderLinesFragment(config: LayerConfig, firstRow: number, lastRow: number): any[];
        /**
         * @param {LayerConfig} config
         */
        update(config: LayerConfig): void;
        $renderToken(parent: any, screenColumn: any, token: any, value: any): any;
        renderIndentGuide(parent: any, value: any, max: any): any;
        $highlightIndentGuide(): void;
        /**@type {{ indentLevel?: number; start?: number; end?: number; dir?: number; }}*/
        $highlightIndentGuideMarker: {
            indentLevel?: number;
            start?: number;
            end?: number;
            dir?: number;
        };
        $clearActiveIndentGuide(): void;
        $setIndentGuideActive(cell: any, indentLevel: any): void;
        $renderHighlightIndentGuide(): void;
        $createLineElement(parent: any): HTMLDivElement;
        $renderWrappedLine(parent: any, tokens: any, splits: any): void;
        $renderSimpleLine(parent: any, tokens: any): void;
        $renderOverflowMessage(parent: any, screenColumn: any, token: any, value: any, hide: any): void;
        $renderLine(parent: any, row: any, foldLine: any): void;
        /**
         * @param {number} row
         * @param {import("../../ace-internal").Ace.FoldLine} foldLine
         * @return {import("../../ace-internal").Ace.Token[]}
         */
        $getFoldLineTokens(row: number, foldLine: import("../../ace-internal").Ace.FoldLine): import("../../ace-internal").Ace.Token[];
        $useLineGroups(): boolean;
        EOF_CHAR: string;
        EOL_CHAR_LF: string;
        EOL_CHAR_CRLF: string;
        TAB_CHAR: string;
        SPACE_CHAR: string;
        MAX_LINE_LENGTH: number;
        destroy: {};
        onChangeTabSize: () => void;
    }
    export type LayerConfig = import("../ace-internal").Ace.LayerConfig;
    export type EditSession = import("edit_session").EditSession;
    import dom = require("lib/dom");
    import Lines_2 = require("layer/lines");
    import Lines = Lines_2.Lines;
    export {};
}
declare module "layer/cursor" {
    export class Cursor {
        /**
         * @param {HTMLElement} parentEl
         */
        constructor(parentEl: HTMLElement);
        element: HTMLDivElement;
        isVisible: boolean;
        isBlinking: boolean;
        blinkInterval: number;
        smoothBlinking: boolean;
        cursors: any[];
        cursor: HTMLDivElement;
        $updateCursors: any;
        /**
         * @param {boolean} [val]
         */
        $updateOpacity(val?: boolean): void;
        $startCssAnimation(): void;
        $isAnimating: boolean;
        $stopCssAnimation(): void;
        /**
         * @param {number} padding
         */
        setPadding(padding: number): void;
        $padding: number;
        /**
         * @param {EditSession} session
         */
        setSession(session: EditSession): void;
        session: import("edit_session").EditSession;
        /**
         * @param {boolean} blinking
         */
        setBlinking(blinking: boolean): void;
        /**
         * @param {number} blinkInterval
         */
        setBlinkInterval(blinkInterval: number): void;
        /**
         * @param {boolean} smoothBlinking
         */
        setSmoothBlinking(smoothBlinking: boolean): void;
        addCursor(): HTMLDivElement;
        removeCursor(): any;
        hideCursor(): void;
        showCursor(): void;
        restartTimer(): void;
        $isSmoothBlinking: boolean;
        intervalId: number;
        /**
         * @param {import("../../ace-internal").Ace.Point} [position]
         * @param {boolean} [onScreen]
         */
        getPixelPosition(position?: import("../../ace-internal").Ace.Point, onScreen?: boolean): {
            left: number;
            top: number;
        };
        isCursorInView(pixelPos: any, config: any): boolean;
        update(config: any): void;
        config: any;
        $pixelPos: {
            left: number;
            top: number;
        };
        /**
         * @param {boolean} overwrite
         */
        $setOverwrite(overwrite: boolean): void;
        overwrite: any;
        destroy(): void;
        drawCursor: any;
        timeoutId?: number;
    }
    export type EditSession = import("edit_session").EditSession;
}
declare module "scrollbar" {
    const VScrollBar_base: typeof Scrollbar;
    /**
     * Represents a vertical scroll bar.
     **/
    export class VScrollBar extends Scrollbar, VScrollBar_base {
        /**
         * Creates a new `VScrollBar`. `parent` is the owner of the scroll bar.
         * @param {Element} parent A DOM element
         * @param {Object} renderer An editor renderer
         **/
        constructor(parent: Element, renderer: any);
        scrollTop: number;
        scrollHeight: number;
        width: number;
        $minWidth: number;
        /**
         * Emitted when the scroll bar, well, scrolls.
         * @event scroll
         **/
        onScroll(): void;
        /**
         * Returns the width of the scroll bar.
         * @returns {Number}
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
    export class HScrollBar extends Scrollbar, HScrollBar_base {
        /**
         * Creates a new `HScrollBar`. `parent` is the owner of the scroll bar.
         * @param {Element} parent A DOM element
         * @param {Object} renderer An editor renderer
         **/
        constructor(parent: Element, renderer: any);
        scrollLeft: number;
        height: any;
        /**
         * Emitted when the scroll bar, well, scrolls.
         * @event scroll
         **/
        onScroll(): void;
        /**
         * Returns the height of the scroll bar.
         * @returns {Number}
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
         * @param {string} classSuffix
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
}
declare module "scrollbar_custom" {
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
    export class VScrollBar extends ScrollBar, VScrollBar_base {
        constructor(parent: any, renderer: any);
        scrollTop: number;
        scrollHeight: number;
        parent: any;
        width: number;
        renderer: any;
        $minWidth: number;
        /**
         * Emitted when the scroll thumb dragged or scrollbar canvas clicked.
         **/
        onMouseDown(eType: any, e: any): void;
        getHeight(): number;
        /**
         * Returns new top for scroll thumb
         * @param {Number}thumbTop
         * @returns {Number}
         **/
        scrollTopFromThumbTop(thumbTop: number): number;
        /**
         * Returns the width of the scroll bar.
         * @returns {Number}
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
    export class HScrollBar extends ScrollBar, HScrollBar_base {
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
         * Emitted when the scroll thumb dragged or scrollbar canvas clicked.
         **/
        onMouseDown(eType: any, e: any): void;
        /**
         * Returns the height of the scroll bar.
         * @returns {Number}
         **/
        getHeight(): number;
        /**
         * Returns new left for scroll thumb
         * @param {Number} thumbLeft
         * @returns {Number}
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
         * @param {string} classSuffix
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
}
declare module "renderloop" {
    /**
     * Batches changes (that force something to be redrawn) in the background.
     **/
    export class RenderLoop {
        constructor(onRender: any, win: any);
        onRender: any;
        pending: boolean;
        changes: number;
        $recursionLimit: number;
        window: any;
        _flush: (ts: any) => void;
        schedule(change: any): void;
        clear(change: any): number;
    }
}
declare module "css/editor-css" {
    const _exports: string;
    export = _exports;
}
declare module "layer/decorators" {
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
        $updateDecorators(config: any): void;
        compensateFoldRows(row: any, foldData: any): number;
    }
}
declare module "virtual_renderer" {
    const VirtualRenderer_base: undefined;
    const VirtualRenderer_base_1: undefined;
    /**
     * The class that is responsible for drawing everything you see on the screen!
     * @related editor.renderer
     **/
    export class VirtualRenderer extends VirtualRenderer_base, VirtualRenderer_base_1 {
        /**
         * Constructs a new `VirtualRenderer` within the `container` specified, applying the given `theme`.
         * @param {HTMLElement | null} [container] The root element of the editor
         * @param {String} [theme] The starting theme
         
         **/
        constructor(container?: HTMLElement | null, theme?: string);
        container: HTMLElement;
        $gutter: HTMLDivElement;
        /**@type {HTMLElement}*/
        scroller: HTMLElement;
        /**@type {HTMLElement}*/
        content: HTMLElement;
        $gutterLayer: GutterLayer;
        $markerBack: MarkerLayer;
        $textLayer: TextLayer;
        canvas: HTMLDivElement;
        $markerFront: MarkerLayer;
        $cursorLayer: CursorLayer;
        $horizScroll: boolean;
        $vScroll: boolean;
        scrollBar: VScrollBar;
        scrollBarV: import("../ace-internal").Ace.VScrollbar;
        scrollBarH: import("../ace-internal").Ace.HScrollbar;
        scrollTop: number;
        scrollLeft: number;
        cursorPos: {
            row: number;
            column: number;
        };
        $fontMetrics: FontMetrics;
        $size: {
            width: number;
            height: number;
            scrollerHeight: number;
            scrollerWidth: number;
            $dirty: boolean;
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
        $keepTextAreaAtCursor: boolean;
        $loop: RenderLoop;
        updateCharacterSize(): void;
        $allowBoldFonts: any;
        characterWidth: number;
        lineHeight: number;
        /**
         *
         * Associates the renderer with an [[EditSession `EditSession`]].
         * @param {EditSession} session The session to associate with
         **/
        setSession(session: EditSession): void;
        session: import("edit_session").EditSession;
        onChangeNewLineMode(): void;
        /**
         * Triggers a partial update of the text, from the range given by the two parameters.
         * @param {Number} firstRow The first row to update
         * @param {Number} lastRow The last row to update
         * @param {boolean} [force]
         **/
        updateLines(firstRow: number, lastRow: number, force?: boolean): void;
        $changedLines: {
            firstRow: number;
            lastRow: number;
        };
        onChangeTabSize(): void;
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
        $updateSizeAsync(): void;
        /**
         * [Triggers a resize of the editor.]{: #VirtualRenderer.onResize}
         * @param {Boolean} [force] If `true`, recomputes the size, even if the height and width haven't changed
         * @param {Number} [gutterWidth] The width of the gutter in pixels
         * @param {Number} [width] The width of the editor in pixels
         * @param {Number} [height] The hiehgt of the editor, in pixels
         
         **/
        onResize(force?: boolean, gutterWidth?: number, width?: number, height?: number): number;
        resizing: number;
        /**
         * @param [force]
         * @param [gutterWidth]
         * @param [width]
         * @param [height]
         * @return {number}
         
         */
        $updateCachedSize(force?: any, gutterWidth?: any, width?: any, height?: any): number;
        gutterWidth: any;
        /**
         *
         * @param {number} width
         
         */
        onGutterResize(width: number): void;
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
         * @returns {Boolean}
         
         **/
        getAnimatedScroll(): boolean;
        /**
         * Identifies whether you want to show invisible characters or not.
         * @param {Boolean} showInvisibles Set to `true` to show invisibles
         
         **/
        setShowInvisibles(showInvisibles: boolean): void;
        /**
         * Returns whether invisible characters are being shown or not.
         * @returns {Boolean}
         
         **/
        getShowInvisibles(): boolean;
        /**
         * @return {boolean}
         
         */
        getDisplayIndentGuides(): boolean;
        /**
         * @param {boolean} display
         
         */
        setDisplayIndentGuides(display: boolean): void;
        /**
         
         * @return {boolean}
         */
        getHighlightIndentGuides(): boolean;
        /**
         
         * @param {boolean} highlight
         */
        setHighlightIndentGuides(highlight: boolean): void;
        /**
         * Identifies whether you want to show the print margin or not.
         * @param {Boolean} showPrintMargin Set to `true` to show the print margin
         
         **/
        setShowPrintMargin(showPrintMargin: boolean): void;
        /**
         * Returns whether the print margin is being shown or not.
         * @returns {Boolean}
         
         **/
        getShowPrintMargin(): boolean;
        /**
         * Identifies whether you want to show the print margin column or not.
         * @param {number} printMarginColumn Set to `true` to show the print margin column
         
         **/
        setPrintMarginColumn(printMarginColumn: number): void;
        /**
         * Returns whether the print margin column is being shown or not.
         * @returns {number}
         
         **/
        getPrintMarginColumn(): number;
        /**
         * Returns `true` if the gutter is being shown.
         * @returns {Boolean}
         
         **/
        getShowGutter(): boolean;
        /**
         * Identifies whether you want to show the gutter or not.
         * @param {Boolean} show Set to `true` to show the gutter
         
         **/
        setShowGutter(show: boolean): void;
        /**
         
         * @returns {boolean}
         */
        getFadeFoldWidgets(): boolean;
        /**
         
         * @param {boolean} show
         */
        setFadeFoldWidgets(show: boolean): void;
        /**
          *
         * @param {boolean} shouldHighlight
         */
        setHighlightGutterLine(shouldHighlight: boolean): void;
        /**
         
         * @returns {boolean}
         */
        getHighlightGutterLine(): boolean;
        /**
         
         */
        $updatePrintMargin(): void;
        $printMarginEl: HTMLDivElement;
        /**
         *
         * Returns the root element containing this renderer.
         * @returns {HTMLElement}
         **/
        getContainerElement(): HTMLElement;
        /**
         *
         * Returns the element that the mouse events are attached to
         * @returns {HTMLElement}
         **/
        getMouseEventTarget(): HTMLElement;
        /**
         *
         * Returns the element to which the hidden text area is added.
         * @returns {HTMLElement}
         **/
        getTextAreaContainer(): HTMLElement;
        /**
         
         */
        $moveTextAreaToCursor(): void;
        /**
         * [Returns the index of the first visible row.]{: #VirtualRenderer.getFirstVisibleRow}
         * @returns {Number}
         **/
        getFirstVisibleRow(): number;
        /**
         *
         * Returns the index of the first fully visible row. "Fully" here means that the characters in the row are not truncated; that the top and the bottom of the row are on the screen.
         * @returns {Number}
         **/
        getFirstFullyVisibleRow(): number;
        /**
         *
         * Returns the index of the last fully visible row. "Fully" here means that the characters in the row are not truncated; that the top and the bottom of the row are on the screen.
         * @returns {Number}
         **/
        getLastFullyVisibleRow(): number;
        /**
         *
         * [Returns the index of the last visible row.]{: #VirtualRenderer.getLastVisibleRow}
         * @returns {Number}
         **/
        getLastVisibleRow(): number;
        /**
         * Sets the padding for all the layers.
         * @param {Number} padding A new padding value (in pixels)
         
         **/
        setPadding(padding: number): void;
        $padding: number;
        /**
         *
         * @param {number} [top]
         * @param {number} [bottom]
         * @param {number} [left]
         * @param {number} [right]
         
         */
        setScrollMargin(top?: number, bottom?: number, left?: number, right?: number): void;
        /**
         *
         * @param {number} [top]
         * @param {number} [bottom]
         * @param {number} [left]
         * @param {number} [right]
         
         */
        setMargin(top?: number, bottom?: number, left?: number, right?: number): void;
        /**
         * Returns whether the horizontal scrollbar is set to be always visible.
         * @returns {Boolean}
         
         **/
        getHScrollBarAlwaysVisible(): boolean;
        /**
         * Identifies whether you want to show the horizontal scrollbar or not.
         * @param {Boolean} alwaysVisible Set to `true` to make the horizontal scroll bar visible
         
         **/
        setHScrollBarAlwaysVisible(alwaysVisible: boolean): void;
        /**
         * Returns whether the horizontal scrollbar is set to be always visible.
         * @returns {Boolean}
         
         **/
        getVScrollBarAlwaysVisible(): boolean;
        /**
         * Identifies whether you want to show the horizontal scrollbar or not.
         * @param {Boolean} alwaysVisible Set to `true` to make the horizontal scroll bar visible
         **/
        setVScrollBarAlwaysVisible(alwaysVisible: boolean): void;
        /**
         
         */
        $updateScrollBarV(): void;
        $updateScrollBarH(): void;
        freeze(): void;
        $frozen: boolean;
        unfreeze(): void;
        /**
         *
         * @param {number} changes
         * @param {boolean} [force]
         * @returns {number}
         
         */
        $renderChanges(changes: number, force?: boolean): number;
        $changes: number;
        /**
         
         */
        $autosize(): void;
        desiredHeight: any;
        /**
         
         * @returns {number}
         */
        $computeLayerConfig(): number;
        /**
         * @returns {boolean | undefined}
         
         */
        $updateLines(): boolean | undefined;
        /**
         *
         * @returns {number}
         
         */
        $getLongestLine(): number;
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
         * @param {any} [rows]
         */
        updateBreakpoints(rows?: any): void;
        _rows: any;
        /**
         * Sets annotations for the gutter.
         * @param {import("../ace-internal").Ace.Annotation[]} annotations An array containing annotations
         *
         **/
        setAnnotations(annotations: import("../ace-internal").Ace.Annotation[]): void;
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
        /**
         *
         * @param {Point} anchor
         * @param {Point} lead
         * @param {number} [offset]
         */
        scrollSelectionIntoView(anchor: Point, lead: Point, offset?: number): void;
        /**
         *
         * Scrolls the cursor into the first visibile area of the editor
         * @param {Point} [cursor]
         * @param {number} [offset]
         * @param {{ top?: any; bottom?: any; }} [$viewMargin]
         */
        scrollCursorIntoView(cursor?: Point, offset?: number, $viewMargin?: {
            top?: any;
            bottom?: any;
        }): void;
        $stopAnimation: boolean;
        /**
         * {:EditSession.getScrollTop}
         * @related EditSession.getScrollTop
         * @returns {Number}
         **/
        getScrollTop(): number;
        /**
         * {:EditSession.getScrollLeft}
         * @related EditSession.getScrollLeft
         * @returns {Number}
         **/
        getScrollLeft(): number;
        /**
         * Returns the first visible row, regardless of whether it's fully visible or not.
         * @returns {Number}
         **/
        getScrollTopRow(): number;
        /**
         * Returns the last visible row, regardless of whether it's fully visible or not.
         * @returns {Number}
         **/
        getScrollBottomRow(): number;
        /**
         * Gracefully scrolls from the top of the editor to the row indicated.
         * @param {Number} row A row id
         *
         * @related EditSession.setScrollTop
         **/
        scrollToRow(row: number): void;
        /**
         *
         * @param {Point} cursor
         * @param {number} [alignment]
         * @returns {number}
         */
        alignCursor(cursor: Point, alignment?: number): number;
        /**
         *
         * @param {number} fromValue
         * @param {number} toValue
         * @returns {*[]}
         */
        $calcSteps(fromValue: number, toValue: number): any[];
        /**
         * Gracefully scrolls the editor to the row indicated.
         * @param {Number} line A line number
         * @param {Boolean} center If `true`, centers the editor the to indicated line
         * @param {Boolean} animate If `true` animates scrolling
         * @param {() => void} [callback] Function to be called after the animation has finished
         
         **/
        scrollToLine(line: number, center: boolean, animate: boolean, callback?: () => void): void;
        /**
         *
         * @param fromValue
         * @param [callback]
         
         */
        animateScrolling(fromValue: any, callback?: any): void;
        $scrollAnimation: {
            from: any;
            to: number;
            steps: any[];
        };
        $timer: number;
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
         * @returns {Boolean}
         **/
        isScrollableBy(deltaX: number, deltaY: number): boolean;
        /**
         *
         * @param {number} x
         * @param {number} y
         * @returns {import("../ace-internal").Ace.ScreenCoordinates}
         
         */
        pixelToScreenCoordinates(x: number, y: number): import("../ace-internal").Ace.ScreenCoordinates;
        /**
         *
         * @param {number} x
         * @param {number} y
         * @returns {Point}
         
         */
        screenToTextCoordinates(x: number, y: number): Point;
        /**
         * Returns an object containing the `pageX` and `pageY` coordinates of the document position.
         * @param {Number} row The document row position
         * @param {Number} column The document column position
         *
         * @returns {{ pageX: number, pageY: number}}
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
        /**
         * @param {Object} composition
         
         **/
        showComposition(composition: any): void;
        $composition: any;
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
        /**
         * @param {string} text
         * @param {Point} [position]
         */
        setGhostText(text: string, position?: Point): void;
        $ghostText: {
            text: string;
            position: {
                row: any;
                column: number;
            };
        };
        $ghostTextWidget: {
            text: string;
            row: any;
            column: number;
            className: string;
        };
        removeGhostText(): void;
        /**
         * @param {string} text
         * @param {string} type
         * @param {number} row
         * @param {number} [column]
         */
        addToken(text: string, type: string, row: number, column?: number): void;
        removeExtraToken(row: any, column: any): void;
        /**
         * [Sets a new theme for the editor. `theme` should exist, and be a directory path, like `ace/theme/textmate`.]{: #VirtualRenderer.setTheme}
         * @param {String | Theme} [theme] The path to a theme
         * @param {() => void} [cb] optional callback
         
         **/
        setTheme(theme?: string | Theme, cb?: () => void): void;
        /**@type {any}*/
        $themeId: any;
        /**
         * [Returns the path of the current theme.]{: #VirtualRenderer.getTheme}
         * @returns {String}
         **/
        getTheme(): string;
        /**
         * [Adds a new class, `style`, to the editor.]{: #VirtualRenderer.setStyle}
         * @param {String} style A class name
         * @param {boolean}[include]
         **/
        setStyle(style: string, include?: boolean): void;
        /**
         * [Removes the class `style` from the editor.]{: #VirtualRenderer.unsetStyle}
         * @param {String} style A class name
         *
         **/
        unsetStyle(style: string): void;
        /**
         * @param {string} style
         */
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
        /**
         *
         * @param {boolean} [val]
         */
        $updateCustomScrollbar(val?: boolean): void;
        $scrollDecorator: Decorator;
        /**
         
         */
        $addResizeObserver(): void;
        $resizeTimer: {
            (timeout: any): void;
            delay(timeout: any): void;
            schedule: any;
            call(): void;
            cancel(): void;
            isPending(): any;
        };
        $resizeObserver: ResizeObserver;
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
        $customScrollbar?: boolean;
        $extraHeight?: number;
        $showGutter?: boolean;
        $showPrintMargin?: boolean;
        $printMarginColumn?: number;
        $animatedScroll?: boolean;
        $isMousePressed?: boolean;
        textarea?: HTMLTextAreaElement;
        $hScrollBarAlwaysVisible?: boolean;
        $vScrollBarAlwaysVisible?: boolean;
        $maxLines?: number;
        $scrollPastEnd?: number;
        enableKeyboardAccessibility?: boolean;
        keyboardFocusClassName?: string;
        $highlightGutterLine?: boolean;
        $minLines?: number;
        $maxPixelHeight?: number;
        $gutterWidth?: number;
        showInvisibles?: boolean;
        $hasCssTransforms?: boolean;
        $blockCursor?: boolean;
        $useTextareaForIME?: boolean;
        theme?: any;
        $theme?: any;
        destroyed?: boolean;
    }
    export type EditSession = import("edit_session").EditSession;
    export type Point = import("../ace-internal").Ace.Point;
    export type Theme = import("../ace-internal").Ace.Theme;
    import GutterLayer_1 = require("layer/gutter");
    import GutterLayer = GutterLayer_1.Gutter;
    import MarkerLayer_1 = require("layer/marker");
    import MarkerLayer = MarkerLayer_1.Marker;
    import TextLayer_1 = require("layer/text");
    import TextLayer = TextLayer_1.Text;
    import CursorLayer_1 = require("layer/cursor");
    import CursorLayer = CursorLayer_1.Cursor;
    import VScrollBar_1 = require("scrollbar");
    import VScrollBar = VScrollBar_1.VScrollBar;
    import FontMetrics_1 = require("layer/font_metrics");
    import FontMetrics = FontMetrics_1.FontMetrics;
    import RenderLoop_1 = require("renderloop");
    import RenderLoop = RenderLoop_1.RenderLoop;
    import Decorator_1 = require("layer/decorators");
    import Decorator = Decorator_1.Decorator;
    export {};
}
declare module "selection" {
    const Selection_base: undefined;
    const Selection_base_1: undefined;
    /**
     * @typedef {import("./edit_session").EditSession} EditSession
     * @typedef {import("./anchor").Anchor} Anchor
     * @typedef {import("../ace-internal").Ace.Point} Point
     */
    export class Selection extends Selection_base, Selection_base_1 {
        /**
         * Creates a new `Selection` object.
         * @param {EditSession} session The session to use
         * @constructor
         **/
        constructor(session: EditSession);
        /**@type {EditSession}*/
        session: EditSession;
        /**@type {import("./document").Document}*/
        doc: import("document").Document;
        /**@type {Anchor}*/
        cursor: Anchor;
        lead: Anchor;
        /**@type {Anchor}*/
        anchor: Anchor;
        $silent: boolean;
        /**
         * Returns `true` if the selection is empty.
         * @returns {Boolean}
         **/
        isEmpty(): boolean;
        /**
         * Returns `true` if the selection is a multi-line.
         * @returns {Boolean}
         **/
        isMultiLine(): boolean;
        /**
         * Returns an object containing the `row` and `column` current position of the cursor.
         * @returns {Point}
         **/
        getCursor(): Point;
        /**
         * Sets the row and column position of the anchor. This function also emits the `'changeSelection'` event.
         * @param {Number} row The new row
         * @param {Number} column The new column
         *
         **/
        setAnchor(row: number, column: number): void;
        $isEmpty: boolean;
        /**
         * Returns an object containing the `row` and `column` of the calling selection anchor.
         *
         * @returns {Point}
         * @related Anchor.getPosition
         **/
        getAnchor(): Point;
        /**
         * Returns an object containing the `row` and `column` of the calling selection lead.
         * @returns {Object}
         **/
        getSelectionLead(): any;
        /**
         * Returns `true` if the selection is going backwards in the document.
         * @returns {Boolean}
         **/
        isBackwards(): boolean;
        /**
         * [Returns the [[Range]] for the selected text.]{: #Selection.getRange}
         * @returns {Range}
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
         * @param {import("../ace-internal").Ace.IRange} range The range of text to select
         * @param {Boolean} [reverse] Indicates if the range should go backwards (`true`) or not
         **/
        setRange(range: import("../ace-internal").Ace.IRange, reverse?: boolean): void;
        /**
         * @param {number} anchorRow
         * @param {number} anchorColumn
         * @param {number} cursorRow
         * @param {number} cursorColumn
         */
        $setSelection(anchorRow: number, anchorColumn: number, cursorRow: number, cursorColumn: number): void;
        $cursorChanged: boolean;
        $anchorChanged: boolean;
        $moveSelection(mover: any): void;
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
        $shortWordEndIndex(rightOfCursor: any): number;
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
        $desiredColumn: any;
        /**
         * Moves the selection to the position indicated by its `row` and `column`.
         * @param {Point} position The position to move to
         **/
        moveCursorToPosition(position: Point): void;
        /**
         * Moves the cursor to the row and column provided. [If `preventUpdateDesiredColumn` is `true`, then the cursor stays in the same column position as its original point.]{: #preventUpdateBoolDesc}
         * @param {Number} row The row to move to
         * @param {Number} column The column to move to
         * @param {Boolean} [keepDesiredColumn] [If `true`, the cursor move does not respect the previous column]{: #preventUpdateBool}
         **/
        moveCursorTo(row: number, column: number, keepDesiredColumn?: boolean): void;
        $keepDesiredColumnOnChange: boolean;
        /**
         * Moves the cursor to the screen position indicated by row and column. {:preventUpdateBoolDesc}
         * @param {Number} row The row to move to
         * @param {Number} column The column to move to
         * @param {Boolean} keepDesiredColumn {:preventUpdateBool}
         **/
        moveCursorToScreen(row: number, column: number, keepDesiredColumn: boolean): void;
        detach(): void;
        /**
         * @param {Range & {desiredColumn?: number}} range
         */
        fromOrientedRange(range: Range & {
            desiredColumn?: number;
        }): void;
        /**
         * @param {Range & {desiredColumn?: number}} [range]
         */
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
         * @returns {Range}
         **/
        getRangeOfMovements(func: Function): Range;
        /**
         *
         * @returns {Range|Range[]}
         */
        toJSON(): Range | Range[];
        /**
         *
         * @param data
         */
        fromJSON(data: any): void;
        /**
         *
         * @param data
         * @return {boolean}
         */
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
        setSelectionRange: (range: import("../ace-internal").Ace.IRange, reverse?: boolean) => void;
    }
    export type EditSession = import("edit_session").EditSession;
    export type Anchor = import("anchor").Anchor;
    export type Point = import("../ace-internal").Ace.Point;
    import Range_3 = require("range");
    import Range = Range_3.Range;
    export {};
}
declare module "clipboard" {
    export let lineMode: string | false;
    export function pasteCancelled(): boolean;
    export function cancel(): void;
}
declare module "keyboard/textinput" {
    export function $setUserAgentForTests(_isMobile: any, _isIOS: any): void;
    export var TextInput: any;
}
declare module "mouse/mouse_event" {
    export class MouseEvent {
        constructor(domEvent: any, editor: any);
        /** @type {number} */ speed: number;
        /** @type {number} */ wheelX: number;
        /** @type {number} */ wheelY: number;
        domEvent: any;
        editor: any;
        x: any;
        clientX: any;
        y: any;
        clientY: any;
        $pos: any;
        $inSelection: any;
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
}
declare module "mouse/default_handlers" {
    export type MouseHandler = import("mouse/mouse_handler").MouseHandler;
    export type MouseEvent = import("mouse/mouse_event").MouseEvent;
    export class DefaultHandlers {
        /**
         * @param {MouseHandler} mouseHandler
         */
        constructor(mouseHandler: MouseHandler);
        /**
         * @param {MouseEvent} ev
         * @this {MouseHandler}
         */
        onMouseDown(this: import("mouse/mouse_handler").MouseHandler, ev: MouseEvent): void;
        mousedownEvent: import("mouse/mouse_event").MouseEvent;
        /**
         *
         * @param {import("../../ace-internal").Ace.Position} [pos]
         * @param {boolean} [waitForClickSelection]
         * @this {MouseHandler}
         */
        startSelect(this: import("mouse/mouse_handler").MouseHandler, pos?: import("../../ace-internal").Ace.Position, waitForClickSelection?: boolean): void;
        /**
         * @this {MouseHandler}
         */
        select(this: import("mouse/mouse_handler").MouseHandler): void;
        /**
         * @param {string | number} unitName
         * @this {MouseHandler}
         */
        extendSelectionBy(this: import("mouse/mouse_handler").MouseHandler, unitName: string | number): void;
        /**
         * @this {MouseHandler}
         */
        selectByLinesEnd(this: import("mouse/mouse_handler").MouseHandler): void;
        $clickSelection: import("range").Range;
        /**
         * @this {MouseHandler}
         */
        focusWait(this: import("mouse/mouse_handler").MouseHandler): void;
        /**
         * @param {MouseEvent} ev
         * @this {MouseHandler}
         */
        onDoubleClick(this: import("mouse/mouse_handler").MouseHandler, ev: MouseEvent): void;
        /**
         * @param {MouseEvent} ev
         * @this {MouseHandler}
         */
        onTripleClick(this: import("mouse/mouse_handler").MouseHandler, ev: MouseEvent): void;
        /**
         * @param {MouseEvent} ev
         * @this {MouseHandler}
         */
        onQuadClick(this: import("mouse/mouse_handler").MouseHandler, ev: MouseEvent): void;
        /**
         * @param {MouseEvent} ev
         * @this {MouseHandler}
         */
        onMouseWheel(this: import("mouse/mouse_handler").MouseHandler, ev: MouseEvent): void;
        $lastScroll: {
            t: number;
            vx: number;
            vy: number;
            allowed: number;
        };
        selectEnd: (this: import("mouse/mouse_handler").MouseHandler) => void;
        selectAllEnd: (this: import("mouse/mouse_handler").MouseHandler) => void;
        selectByWordsEnd: (this: import("mouse/mouse_handler").MouseHandler) => void;
    }
}
declare module "lib/scroll" {
    export function preventParentScroll(event: any): void;
}
declare module "tooltip" {
    export class HoverTooltip extends Tooltip {
        constructor(parentNode?: HTMLElement);
        timeout: number;
        lastT: number;
        idleTime: number;
        lastEvent: import("mouse/mouse_event").MouseEvent;
        onMouseOut(e: any): void;
        /**
         * @param {MouseEvent} e
         * @param {Editor} editor
         */
        onMouseMove(e: MouseEvent, editor: Editor): void;
        waitForHover(): void;
        /**
         * @param {Editor} editor
         */
        addToEditor(editor: Editor): void;
        /**
         * @param {Editor} editor
         */
        removeFromEditor(editor: Editor): void;
        /**
         * @param {MouseEvent} e
         */
        isOutsideOfText(e: MouseEvent): boolean;
        /**
         * @param {any} value
         */
        setDataProvider(value: any): void;
        $gatherData: any;
        /**
         * @param {Editor} editor
         * @param {Range} range
         * @param {any} domNode
         * @param {MouseEvent} startingEvent
         */
        showForRange(editor: Editor, range: Range, domNode: any, startingEvent: MouseEvent): void;
        range: Range;
        /**
         * @param {Range} range
         * @param {EditSession} [session]
         */
        addMarker(range: Range, session?: EditSession): void;
        $markerSession: import("edit_session").EditSession;
        marker: number;
        $registerCloseEvents(): void;
        $removeCloseEvents(): void;
        row: number;
    }
    export type Editor = import("editor").Editor;
    export type MouseEvent = import("mouse/mouse_event").MouseEvent;
    export type EditSession = import("edit_session").EditSession;
    export var popupManager: PopupManager;
    export class Tooltip {
        /**
         * @param {Element} parentNode
         **/
        constructor(parentNode: Element);
        isOpen: boolean;
        $element: HTMLDivElement;
        $parentNode: Element;
        $init(): HTMLDivElement;
        /**
         * @returns {HTMLElement}
         **/
        getElement(): HTMLElement;
        /**
         * @param {String} text
         **/
        setText(text: string): void;
        /**
         * @param {String} html
         **/
        setHtml(html: string): void;
        /**
         * @param {Number} x
         * @param {Number} y
         **/
        setPosition(x: number, y: number): void;
        /**
         * @param {String} className
         **/
        setClassName(className: string): void;
        /**
         * @param {import("../ace-internal").Ace.Theme} theme
         */
        setTheme(theme: import("../ace-internal").Ace.Theme): void;
        /**
         * @param {String} [text]
         * @param {Number} [x]
         * @param {Number} [y]
         **/
        show(text?: string, x?: number, y?: number): void;
        hide(e: any): void;
        /**
         * @returns {Number}
         **/
        getHeight(): number;
        /**
         * @returns {Number}
         **/
        getWidth(): number;
        destroy(): void;
    }
    import Range_4 = require("range");
    import Range = Range_4.Range;
    class PopupManager {
        /**@type{Tooltip[]} */
        popups: Tooltip[];
        /**
         * @param {Tooltip} popup
         */
        addPopup(popup: Tooltip): void;
        /**
         * @param {Tooltip} popup
         */
        removePopup(popup: Tooltip): void;
        updatePopups(): void;
        /**
         * @param {Tooltip} popupA
         * @param {Tooltip} popupB
         * @return {boolean}
         */
        doPopupsOverlap(popupA: Tooltip, popupB: Tooltip): boolean;
    }
    export {};
}
declare module "mouse/default_gutter_handler" {
    /**
     * @param {MouseHandler} mouseHandler
     * @this {MouseHandler}
     */
    export function GutterHandler(this: import("mouse/mouse_handler").MouseHandler, mouseHandler: MouseHandler): void;
    export interface GutterHandler {
    }
    export type MouseHandler = import("mouse/mouse_handler").MouseHandler;
    export class GutterTooltip extends Tooltip {
        static get annotationLabels(): {
            error: {
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
        };
        static annotationsToSummaryString(annotations: any): string;
        constructor(editor: any);
        editor: any;
        setPosition(x: any, y: any): void;
        showTooltip(row: any): void;
        hideTooltip(): void;
    }
    import Tooltip_1 = require("tooltip");
    import Tooltip = Tooltip_1.Tooltip;
}
declare module "mouse/dragdrop_handler" {
    export type MouseHandler = import("mouse/mouse_handler").MouseHandler;
    /**
     * @param {MouseHandler} mouseHandler
     */
    export function DragdropHandler(mouseHandler: MouseHandler): void;
    export class DragdropHandler {
        /**
         * @param {MouseHandler} mouseHandler
         */
        constructor(mouseHandler: MouseHandler);
        /**
         * @param e
         * @this {MouseHandler}
         * @return {*}
         */
        onDragStart: (this: import("mouse/mouse_handler").MouseHandler, e: any) => any;
        /**
         * @param e
         * @this {MouseHandler}
         * @return {*}
         */
        onDragEnd: (this: import("mouse/mouse_handler").MouseHandler, e: any) => any;
        /**
         * @param e
         * @this {MouseHandler}
         * @return {*}
         */
        onDragEnter: (this: import("mouse/mouse_handler").MouseHandler, e: any) => any;
        /**
         * @param e
         * @this {MouseHandler}
         * @return {*}
         */
        onDragOver: (this: import("mouse/mouse_handler").MouseHandler, e: any) => any;
        onDragLeave: (e: any) => void;
        /**
         * @param e
         * @this {MouseHandler}
         * @return {*}
         */
        onDrop: (this: import("mouse/mouse_handler").MouseHandler, e: any) => any;
    }
}
declare module "mouse/touch_handler" {
    export function addTouchListeners(el: any, editor: any): void;
}
declare module "mouse/mouse_handler" {
    export class MouseHandler {
        /**
         * @param {Editor} editor
         */
        constructor(editor: Editor);
        /** @type {boolean} */ $dragDelay: boolean;
        /** @type {boolean} */ $dragEnabled: boolean;
        /** @type {boolean} */ $mouseMoved: boolean;
        /** @type {MouseEvent} */ mouseEvent: MouseEvent;
        /** @type {number} */ $focusTimeout: number;
        editor: import("editor").Editor;
        onMouseEvent(name: any, e: any): void;
        onMouseMove(name: any, e: any): void;
        /**
         * @param {string} name
         * @param {{ wheelX: number; wheelY: number; }} e
         */
        onMouseWheel(name: string, e: {
            wheelX: number;
            wheelY: number;
        }): void;
        setState(state: any): void;
        state: any;
        captureMouse(ev: any, mouseMoveHandler: any): number;
        x: any;
        y: any;
        isMousePressed: boolean;
        $onCaptureMouseMove: (e: any) => void;
        releaseMouse: (e: any) => void;
        cancelContextMenu(): void;
        destroy(): void;
        $tooltipFollowsMouse?: boolean;
        cancelDrag?: boolean;
        $clickSelection?: import("range").Range;
        mousedownEvent?: MouseEvent;
        startSelect?: (pos?: import("../../ace-internal").Ace.Point, waitForClickSelection?: boolean) => void;
        select?: () => void;
        $lastScroll?: {
            t: number;
            vx: number;
            vy: number;
            allowed: number;
        };
        selectEnd?: () => void;
    }
    export type Editor = import("editor").Editor;
    import MouseEvent_1 = require("mouse/mouse_event");
    import MouseEvent = MouseEvent_1.MouseEvent;
}
declare module "mouse/fold_handler" {
    export class FoldHandler {
        constructor(editor: any);
    }
}
declare module "keyboard/keybinding" {
    export type Editor = import("editor").Editor;
    export type KeyboardHandler = import("../ace-internal").Ace.KeyboardHandler;
    export class KeyBinding {
        /**
         * @param {Editor} editor
         */
        constructor(editor: Editor);
        $editor: import("editor").Editor;
        $data: {
            editor: import("editor").Editor;
        };
        /**@type {(KeyboardHandler)[]}*/
        $handlers: (KeyboardHandler)[];
        /**
         * @param {KeyboardHandler} kb
         */
        setDefaultHandler(kb: KeyboardHandler): void;
        $defaultHandler: import("../../ace-internal").Ace.KeyboardHandler;
        /**
         * @param {KeyboardHandler} kb
         */
        setKeyboardHandler(kb: KeyboardHandler): void;
        /**
         * @param {KeyboardHandler & {attach?: (editor: any) => void, detach?: (editor: any) => void;}} [kb]
         * @param {number} [pos]
         */
        addKeyboardHandler(kb?: Partial<import("keyboard/hash_handler").HashHandler> & {
            attach?: (editor: import("editor").Editor) => void;
            detach?: (editor: import("editor").Editor) => void;
            getStatusText?: (editor?: any, data?: any) => string;
        } & {
            attach?: (editor: any) => void;
            detach?: (editor: any) => void;
        }, pos?: number): void;
        /**
         * @param {KeyboardHandler & {attach?: (editor: any) => void, detach?: (editor: any) => void;}} kb
         * @returns {boolean}
         */
        removeKeyboardHandler(kb: Partial<import("keyboard/hash_handler").HashHandler> & {
            attach?: (editor: import("editor").Editor) => void;
            detach?: (editor: import("editor").Editor) => void;
            getStatusText?: (editor?: any, data?: any) => string;
        } & {
            attach?: (editor: any) => void;
            detach?: (editor: any) => void;
        }): boolean;
        /**
         * @return {KeyboardHandler}
         */
        getKeyboardHandler(): KeyboardHandler;
        getStatusText(): string;
        $callKeyboardHandlers(hashId: any, keyString: any, keyCode: any, e: any): boolean;
        /**
         * @param {any} e
         * @param {number} hashId
         * @param {number} keyCode
         * @return {boolean}
         */
        onCommandKey(e: any, hashId: number, keyCode: number): boolean;
        /**
         * @param {string} text
         * @return {boolean}
         */
        onTextInput(text: string): boolean;
    }
}
declare module "search" {
    export type EditSession = import("edit_session").EditSession;
    /**
     * A class designed to handle all sorts of text searches within a [[Document `Document`]].
     **/
    export class Search {
        /**@type {SearchOptions}*/
        $options: {
            /**
             * - The string or regular expression you're looking for
             */
            needle?: string | RegExp;
            /**
             * - Whether to search backwards from where cursor currently is
             */
            backwards?: boolean;
            /**
             * - Whether to wrap the search back to the beginning when it hits the end
             */
            wrap?: boolean;
            /**
             * - Whether the search ought to be case-sensitive
             */
            caseSensitive?: boolean;
            /**
             * - Whether the search matches only on whole words
             */
            wholeWord?: boolean;
            /**
             * - The [[Range]] to search within. Set this to `null` for the whole document
             */
            range?: Range | null;
            /**
             * - Whether the search is a regular expression or not
             */
            regExp?: boolean;
            /**
             * - The starting [[Range]] or cursor position to begin the search
             */
            start?: Range | import("../ace-internal").Ace.Position;
            /**
             * - Whether or not to include the current line in the search
             */
            skipCurrent?: boolean;
            /**
             * - true, if needle has \n or \r\n
             */
            $isMultiLine?: boolean;
            preserveCase?: boolean;
            preventScroll?: boolean;
            /**
             * - internal property, determine if browser supports unicode flag
             */
            $supportsUnicodeFlag?: boolean;
            /**
             * **
             */
            re?: any;
        };
        /**
         * Sets the search options via the `options` parameter.
         * @param {Partial<import("../ace-internal").Ace.SearchOptions>} options An object containing all the new search properties
         * @returns {Search}
         * @chainable
        **/
        set(options: Partial<import("../ace-internal").Ace.SearchOptions>): Search;
        /**
         * [Returns an object containing all the search options.]{: #Search.getOptions}
         * @returns {Partial<import("../ace-internal").Ace.SearchOptions>}
        **/
        getOptions(): Partial<import("../ace-internal").Ace.SearchOptions>;
        /**
         * Sets the search options via the `options` parameter.
         * @param {SearchOptions} options object containing all the search propertie
         * @related Search.set
        **/
        setOptions(options: {
            /**
             * - The string or regular expression you're looking for
             */
            needle?: string | RegExp;
            /**
             * - Whether to search backwards from where cursor currently is
             */
            backwards?: boolean;
            /**
             * - Whether to wrap the search back to the beginning when it hits the end
             */
            wrap?: boolean;
            /**
             * - Whether the search ought to be case-sensitive
             */
            caseSensitive?: boolean;
            /**
             * - Whether the search matches only on whole words
             */
            wholeWord?: boolean;
            /**
             * - The [[Range]] to search within. Set this to `null` for the whole document
             */
            range?: Range | null;
            /**
             * - Whether the search is a regular expression or not
             */
            regExp?: boolean;
            /**
             * - The starting [[Range]] or cursor position to begin the search
             */
            start?: Range | import("../ace-internal").Ace.Position;
            /**
             * - Whether or not to include the current line in the search
             */
            skipCurrent?: boolean;
            /**
             * - true, if needle has \n or \r\n
             */
            $isMultiLine?: boolean;
            preserveCase?: boolean;
            preventScroll?: boolean;
            /**
             * - internal property, determine if browser supports unicode flag
             */
            $supportsUnicodeFlag?: boolean;
            /**
             * **
             */
            re?: any;
        }): void;
        /**
         * Searches for `options.needle`. If found, this method returns the [[Range `Range`]] where the text first occurs. If `options.backwards` is `true`, the search goes backwards in the session.
         * @param {EditSession} session The session to search with
         * @returns {Range|false}
         **/
        find(session: EditSession): Range | false;
        /**
         * Searches for all occurrances `options.needle`. If found, this method returns an array of [[Range `Range`s]] where the text first occurs. If `options.backwards` is `true`, the search goes backwards in the session.
         * @param {EditSession} session The session to search with
         * @returns {Range[]}
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
         * @returns {String}
        **/
        replace(input: string, replacement: any): string;
        /**
         *
         * @param {SearchOptions} options
         * @param {boolean} [$disableFakeMultiline]
         * @return {RegExp|boolean|*[]|*}
         */
        $assembleRegExp(options: {
            /**
             * - The string or regular expression you're looking for
             */
            needle?: string | RegExp;
            /**
             * - Whether to search backwards from where cursor currently is
             */
            backwards?: boolean;
            /**
             * - Whether to wrap the search back to the beginning when it hits the end
             */
            wrap?: boolean;
            /**
             * - Whether the search ought to be case-sensitive
             */
            caseSensitive?: boolean;
            /**
             * - Whether the search matches only on whole words
             */
            wholeWord?: boolean;
            /**
             * - The [[Range]] to search within. Set this to `null` for the whole document
             */
            range?: Range | null;
            /**
             * - Whether the search is a regular expression or not
             */
            regExp?: boolean;
            /**
             * - The starting [[Range]] or cursor position to begin the search
             */
            start?: Range | import("../ace-internal").Ace.Position;
            /**
             * - Whether or not to include the current line in the search
             */
            skipCurrent?: boolean;
            /**
             * - true, if needle has \n or \r\n
             */
            $isMultiLine?: boolean;
            preserveCase?: boolean;
            preventScroll?: boolean;
            /**
             * - internal property, determine if browser supports unicode flag
             */
            $supportsUnicodeFlag?: boolean;
            /**
             * **
             */
            re?: any;
        }, $disableFakeMultiline?: boolean): RegExp | boolean | any[] | any;
        /**
         * @param {string} needle
         * @param {string} modifier
         */
        $assembleMultilineRegExp(needle: string, modifier: string): false | RegExp[];
        /**
         * @param {EditSession} session
         */
        $matchIterator(session: EditSession, options: any): false | {
            forEach: (callback: any) => void;
        };
    }
    import Range_5 = require("range");
    import Range = Range_5.Range;
}
declare module "keyboard/hash_handler" {
    export type Command = import("../ace-internal").Ace.Command;
    export type CommandLike = import("../ace-internal").Ace.CommandLike;
    export class HashHandler extends MultiHashHandler {
    }
    export namespace HashHandler {
        function call(thisArg: any, config: any, platform: any): void;
    }
    export class MultiHashHandler {
        /**
         * @param {Record<string, CommandLike> | Command[]} [config]
         * @param {string} [platform]
         */
        constructor(config?: Record<string, CommandLike> | Command[], platform?: string);
        /**
         * @param {Record<string, CommandLike> | Command[]} config
         * @param {string} [platform]
         * @param {boolean} [$singleCommand]
         */
        $init(config: Record<string, CommandLike> | Command[], platform?: string, $singleCommand?: boolean): void;
        platform: string;
        /**@type {Record<string, Command>}*/
        commands: Record<string, Command>;
        commandKeyBinding: {};
        $singleCommand: boolean;
        /**
         * @param {Command} command
         */
        addCommand(command: Command): void;
        /**
         * @param {Command | string} command
         * @param {boolean} [keepCommand]
         */
        removeCommand(command: Command | string, keepCommand?: boolean): void;
        /**
         * @param {string | { win?: string; mac?: string; position?:number}} key
         * @param {CommandLike | string} command
         * @param {number} [position]
         */
        bindKey(key: string | {
            win?: string;
            mac?: string;
            position?: number;
        }, command: CommandLike | string, position?: number): void;
        /**
         * @param {string} keyId
         * @param {any} command
         * @param {number} position
         */
        _addCommandToBinding(keyId: string, command: any, position: number): void;
        /**
         * @param {Record<string, CommandLike> | Command[]} [commands]
         */
        addCommands(commands?: Record<string, CommandLike> | Command[]): void;
        /**
         * @param {Record<string, CommandLike>} commands
         */
        removeCommands(commands: Record<string, CommandLike>): void;
        /**
         * @param {Record<string, CommandLike>} keyList
         */
        bindKeys(keyList: Record<string, CommandLike>): void;
        _buildKeyHash(command: any): void;
        /**
         * Accepts keys in the form ctrl+Enter or ctrl-Enter
         * keys without modifiers or shift only
         * @param {string} keys
         * @returns {{key: string, hashId: number} | false}
         */
        parseKeys(keys: string): {
            key: string;
            hashId: number;
        } | false;
        /**
         * @param {number} hashId
         * @param {string} keyString
         * @returns {Command}
         */
        findKeyCommand(hashId: number, keyString: string): Command;
        /**
         * @param {{ $keyChain: string | any[]; }} data
         * @param {number} hashId
         * @param {string} keyString
         * @param {number} keyCode
         * @returns {{command: string} | void}
         */
        handleKeyboard(data: {
            $keyChain: string | any[];
        }, hashId: number, keyString: string, keyCode: number): {
            command: string;
        } | void;
        /**
         * @param {any} [editor]
         * @param {any} [data]
         * @returns {string}
         */
        getStatusText(editor?: any, data?: any): string;
    }
    export namespace MultiHashHandler {
        function call(thisArg: any, config: any, platform: any): void;
    }
}
declare module "commands/command_manager" {
    const CommandManager_base: typeof MultiHashHandler;
    export class CommandManager extends MultiHashHandler, CommandManager_base {
        /**
         * new CommandManager(platform, commands)
         * @param {String} platform Identifier for the platform; must be either `"mac"` or `"win"`
         * @param {any[]} commands A list of commands
         **/
        constructor(platform: string, commands: any[]);
        byName: Record<string, import("../../ace-internal").Ace.Command>;
        /**
         *
         * @param {string | string[] | import("../../ace-internal").Ace.Command} command
         * @param {Editor} editor
         * @param {any} args
         * @returns {boolean}
         */
        exec(command: string | string[] | import("../../ace-internal").Ace.Command, editor: Editor, args: any): boolean;
        /**
         * @param {Editor} editor
         * @returns {boolean}
         */
        toggleRecording(editor: Editor): boolean;
        macro: any;
        recording: boolean;
        $addCommandToMacro: any;
        oldMacro: any;
        /**
         * @param {Editor} editor
         */
        replay(editor: Editor): boolean;
        $inReplay: boolean;
        trimMacro(m: any): any;
        $checkCommandState?: boolean;
    }
    export type Editor = import("editor").Editor;
    import MultiHashHandler_1 = require("keyboard/hash_handler");
    import MultiHashHandler = MultiHashHandler_1.MultiHashHandler;
    export {};
}
declare module "commands/default_commands" {
    export const commands: import("../ace-internal").Ace.Command[];
}
declare module "token_iterator" {
    export type EditSession = import("edit_session").EditSession;
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
        $session: import("edit_session").EditSession;
        $row: number;
        $rowTokens: import("../ace-internal").Ace.Token[];
        $tokenIndex: number;
        /**
         * Moves iterator position to the start of previous token.
         * @returns {import("../ace-internal").Ace.Token|null}
         **/
        stepBackward(): import("../ace-internal").Ace.Token | null;
        /**
         * Moves iterator position to the start of next token.
         * @returns {import("../ace-internal").Ace.Token|null}
         **/
        stepForward(): import("../ace-internal").Ace.Token | null;
        /**
         *
         * Returns current token.
         * @returns {import("../ace-internal").Ace.Token}
         **/
        getCurrentToken(): import("../ace-internal").Ace.Token;
        /**
         *
         * Returns the current row.
         * @returns {Number}
         **/
        getCurrentTokenRow(): number;
        /**
         *
         * Returns the current column.
         * @returns {Number}
         **/
        getCurrentTokenColumn(): number;
        /**
         * Return the current token position.
         * @returns {import("../ace-internal").Ace.Point}
         */
        getCurrentTokenPosition(): import("../ace-internal").Ace.Point;
        /**
         * Return the current token range.
         * @returns {Range}
         */
        getCurrentTokenRange(): Range;
    }
    import Range_6 = require("range");
    import Range = Range_6.Range;
}
declare module "line_widgets" {
    export class LineWidgets {
        /**
         * @param {EditSession} session
         */
        constructor(session: EditSession);
        session: import("edit_session").EditSession;
        /**
         *
         * @param {import("../ace-internal").Ace.Delta} delta
         */
        updateOnChange(delta: import("../ace-internal").Ace.Delta): void;
        /**
         * @param {any} e
         * @param {VirtualRenderer} renderer
         */
        renderWidgets(e: any, renderer: VirtualRenderer): void;
        /**
         * @param {any} e
         * @param {VirtualRenderer} renderer
         */
        measureWidgets(e: any, renderer: VirtualRenderer): void;
        $onChangeEditor(e: any): void;
        /**
         * @param {number} row
         * @return {number}
         */
        getRowLength(row: number): number;
        /**
         * @return {number}
         */
        $getWidgetScreenLength(): number;
        /**
         *
         * @param {Editor} editor
         */
        attach(editor: Editor): void;
        /**@type {Editor} */
        editor: Editor;
        detach(e: any): void;
        /**
         *
         * @param e
         * @param {EditSession} session
         */
        updateOnFold(e: any, session: EditSession): void;
        $updateRows(): void;
        /**
         *
         * @param {LineWidget} w
         * @return {LineWidget}
         */
        $registerLineWidget(w: LineWidget): LineWidget;
        /**
         *
         * @param {LineWidget} w
         * @return {LineWidget}
         */
        addLineWidget(w: LineWidget): LineWidget;
        /**
         * @param {LineWidget} w
         */
        removeLineWidget(w: LineWidget): void;
        /**
         *
         * @param {number} row
         * @return {LineWidget[]}
         */
        getWidgetsAtRow(row: number): LineWidget[];
        /**
         * @param {LineWidget} w
         */
        onWidgetChanged(w: LineWidget): void;
        firstRow: number;
        lastRow: number;
        lineWidgets: import("../ace-internal").Ace.LineWidget[];
    }
    export type EditSession = import("edit_session").EditSession;
    export type Editor = import("editor").Editor;
    export type VirtualRenderer = import("virtual_renderer").VirtualRenderer;
    export type LineWidget = import("../ace-internal").Ace.LineWidget;
}
declare module "keyboard/gutter_handler" {
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
        $onGutterKeyDown(e: any): void;
        $handleGutterKeyboardInteraction(e: any): void;
        lane: any;
        $blurGutter(): void;
        $isFoldWidgetVisible(index: any): boolean;
        $isAnnotationVisible(index: any): boolean;
        $getFoldWidget(index: any): any;
        $getAnnotation(index: any): any;
        $findNearestFoldWidget(index: any): any;
        $findNearestAnnotation(index: any): any;
        $focusFoldWidget(index: any): void;
        $focusAnnotation(index: any): void;
        $blurFoldWidget(index: any): void;
        $blurAnnotation(index: any): void;
        $moveFoldWidgetUp(): void;
        $moveFoldWidgetDown(): void;
        $moveAnnotationUp(): void;
        $moveAnnotationDown(): void;
        $switchLane(desinationLane: any): void;
        $rowIndexToRow(index: any): any;
        $rowToRowIndex(row: any): number;
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
    import GutterTooltip_1 = require("mouse/default_gutter_handler");
    import GutterTooltip = GutterTooltip_1.GutterTooltip;
}
declare module "editor" {
    const Editor_base: undefined;
    const Editor_base_1: undefined;
    const Editor_base_2: undefined;
    const Editor_base_3: undefined;
    const Editor_base_4: undefined;
    const Editor_base_5: undefined;
    const Editor_base_6: undefined;
    const Editor_base_7: undefined;
    /**
     * The main entry point into the Ace functionality.
     *
     * The `Editor` manages the [[EditSession]] (which manages [[Document]]s), as well as the [[VirtualRenderer]], which draws everything to the screen.
     *
     * Event sessions dealing with the mouse and keyboard are bubbled up from `Document` to the `Editor`, which decides what to do with them.
     **/
    export class Editor extends Editor_base, Editor_base_1, Editor_base_2, Editor_base_3, Editor_base_4, Editor_base_5, Editor_base_6, Editor_base_7 {
        /**
         * Creates a new `Editor` object.
         *
         * @param {VirtualRenderer} renderer Associated `VirtualRenderer` that draws everything
         * @param {EditSession} [session] The `EditSession` to refer to
         * @param {Partial<import("../ace-internal").Ace.EditorOptions>} [options] The default options
         **/
        constructor(renderer: VirtualRenderer, session?: EditSession, options?: Partial<import("../ace-internal").Ace.EditorOptions>);
        /**@type{EditSession}*/ session: EditSession;
        $toDestroy: any[];
        /**@type {HTMLElement & {env?, value?}}*/
        container: HTMLElement & {
            env?;
            value?;
        };
        /**@type {VirtualRenderer}*/
        renderer: VirtualRenderer;
        /**@type {string}*/
        id: string;
        commands: CommandManager;
        textInput: any;
        /**@type {MouseHandler}*/
        $mouseHandler: MouseHandler;
        /**@type {KeyBinding}*/
        keyBinding: KeyBinding;
        /**@type {Search}*/
        $search: Search;
        /**
         * @param e
         */
        $historyTracker(e: any): void;
        _$emitInputEvent: {
            (timeout: any): void;
            delay(timeout: any): void;
            schedule: any;
            call(): void;
            cancel(): void;
            isPending(): any;
        };
        $initOperationListeners(): void;
        $opResetTimer: {
            (timeout: any): void;
            delay(timeout: any): void;
            schedule: any;
            call(): void;
            cancel(): void;
            isPending(): any;
        };
        startOperation(commandEvent: any): void;
        prevOp: {};
        previousCommand: any;
        /**
         * @type {{[key: string]: any;}}
         */
        curOp: {
            [key: string]: any;
        };
        /**
         * @arg e
         */
        endOperation(e: any): any;
        $lastSel: Range | Range[];
        mergeNextCommand: boolean;
        sequenceStartTime: number;
        /**
         * Sets a new key handler, such as "vim" or "windows".
         * @param {String | import("../ace-internal").Ace.KeyboardHandler | null} keyboardHandler The new key handler
         * @param {() => void} [cb]
         **/
        setKeyboardHandler(keyboardHandler: string | import("../ace-internal").Ace.KeyboardHandler | null, cb?: () => void): void;
        $keybindingId: string;
        /**
         * Returns the keyboard handler, such as "vim" or "windows".
         * @returns {Object}
         **/
        getKeyboardHandler(): any;
        /**
         * Sets a new editsession to use. This method also emits the `'changeSession'` event.
         * @param {EditSession} [session] The new session to use
         **/
        setSession(session?: EditSession): void;
        $onDocumentChange: any;
        $onChangeMode: any;
        $onTokenizerUpdate: any;
        $onChangeTabSize: any;
        $onChangeWrapLimit: any;
        $onChangeWrapMode: any;
        $onChangeFold: any;
        $onChangeFrontMarker: any;
        $onChangeBackMarker: any;
        $onChangeBreakpoint: any;
        $onChangeAnnotation: any;
        $onCursorChange: any;
        $onScrollTopChange: any;
        $onScrollLeftChange: any;
        selection: import("selection").Selection;
        $onSelectionChange: any;
        /**
         * Returns the current session being used.
         * @returns {EditSession}
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
         * @returns {String}
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
         * @param {string | import("../ace-internal").Ace.Theme} theme The path to a theme
         * @param {() => void} [cb] optional callback called when theme is loaded
         **/
        setTheme(theme: string | import("../ace-internal").Ace.Theme, cb?: () => void): void;
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
         * @param {string} style
         */
        unsetStyle(style: string): void;
        /**
         * Gets the current font size of the editor text.
         * @return {string}
         */
        getFontSize(): string;
        /**
         * Set a new font size (in pixels) for the editor text.
         * @param {String} size A font size ( _e.g._ "12px")
         **/
        setFontSize(size: string): void;
        $highlightBrackets(): void;
        $highlightPending: boolean;
        /**
         *
         * Brings the current `textInput` into focus.
         **/
        focus(): void;
        /**
         * Returns `true` if the current `textInput` is in focus.
         * @return {Boolean}
         **/
        isFocused(): boolean;
        /**
         *
         * Blurs the current `textInput`.
         **/
        blur(): void;
        /**
         * Emitted once the editor comes into focus.
         **/
        onFocus(e: any): void;
        $isFocused: boolean;
        /**
         * Emitted once the editor has been blurred.
         **/
        onBlur(e: any): void;
        /**
         */
        $cursorChange(): void;
        /**
         * Emitted whenever the document is changed.
         * @param {import("../ace-internal").Ace.Delta} delta Contains a single property, `data`, which has the delta of changes
         **/
        onDocumentChange(delta: import("../ace-internal").Ace.Delta): void;
        onTokenizerUpdate(e: any): void;
        onScrollTopChange(): void;
        onScrollLeftChange(): void;
        /**
         * Emitted when the selection changes.
         **/
        onCursorChange(): void;
        /**
         */
        $updateHighlightActiveLine(): void;
        /**
         *
         * @param e
         */
        onSelectionChange(e: any): void;
        $getSelectionHighLightRegexp(): any;
        onChangeFrontMarker(): void;
        onChangeBackMarker(): void;
        onChangeBreakpoint(): void;
        onChangeAnnotation(): void;
        /**
         * @param e
         */
        onChangeMode(e: any): void;
        onChangeWrapLimit(): void;
        onChangeWrapMode(): void;
        /**
         */
        onChangeFold(): void;
        /**
         * Returns the string of text currently highlighted.
         * @returns {String}
         **/
        getCopyText(): string;
        /**
         * Called whenever a text "copy" happens.
         **/
        onCopy(): void;
        /**
         * Called whenever a text "cut" happens.
         **/
        onCut(): void;
        /**
         * Called whenever a text "paste" happens.
         * @param {String} text The pasted text
         * @param {any} event
         **/
        onPaste(text: string, event: any): void;
        /**
         *
         * @param e
         * @returns {boolean}
         */
        $handlePaste(e: any): boolean;
        /**
         *
         * @param {string | string[]} command
         * @param [args]
         * @return {boolean}
         */
        execCommand(command: string | string[], args?: any): boolean;
        /**
         * Inserts `text` into wherever the cursor is pointing.
         * @param {String} text The new text to add
         * @param {boolean} [pasted]
         **/
        insert(text: string, pasted?: boolean): void;
        autoIndent(): void;
        /**
         *
         * @param text
         * @param composition
         * @returns {*}
         */
        onTextInput(text: any, composition: any): any;
        /**
         * @param {string} [text]
         * @param {any} [composition]
         */
        applyComposition(text?: string, composition?: any): void;
        onCommandKey(e: any, hashId: any, keyCode: any): boolean;
        /**
         * Pass in `true` to enable overwrites in your session, or `false` to disable. If overwrites is enabled, any text you enter will type over any text after it. If the value of `overwrite` changes, this function also emits the `changeOverwrite` event.
         * @param {Boolean} overwrite Defines whether or not to set overwrites
         * @related EditSession.setOverwrite
         **/
        setOverwrite(overwrite: boolean): void;
        /**
         * Returns `true` if overwrites are enabled; `false` otherwise.
         * @returns {Boolean}
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
         * @returns {Number}
         **/
        getScrollSpeed(): number;
        /**
         * Sets the delay (in milliseconds) of the mouse drag.
         * @param {Number} dragDelay A value indicating the new delay
         **/
        setDragDelay(dragDelay: number): void;
        /**
         * Returns the current mouse drag delay.
         * @returns {Number}
         **/
        getDragDelay(): number;
        /**
         * Draw selection markers spanning whole line, or only over selected text. Default value is "line"
         * @param {"fullLine" | "screenLine" | "text" | "line"} val The new selection style "line"|"text"
         **/
        setSelectionStyle(val: "fullLine" | "screenLine" | "text" | "line"): void;
        /**
         * Returns the current selection style.
         * @returns {import("../ace-internal").Ace.EditorOptions["selectionStyle"]}
         **/
        getSelectionStyle(): import("../ace-internal").Ace.EditorOptions["selectionStyle"];
        /**
         * Determines whether or not the current line should be highlighted.
         * @param {Boolean} shouldHighlight Set to `true` to highlight the current line
         **/
        setHighlightActiveLine(shouldHighlight: boolean): void;
        /**
         * Returns `true` if current lines are always highlighted.
         * @return {Boolean}
         **/
        getHighlightActiveLine(): boolean;
        /**
         * @param {boolean} shouldHighlight
         */
        setHighlightGutterLine(shouldHighlight: boolean): void;
        /**
         * @returns {Boolean}
         */
        getHighlightGutterLine(): boolean;
        /**
         * Determines if the currently selected word should be highlighted.
         * @param {Boolean} shouldHighlight Set to `true` to highlight the currently selected word
         **/
        setHighlightSelectedWord(shouldHighlight: boolean): void;
        /**
         * Returns `true` if currently highlighted words are to be highlighted.
         * @returns {Boolean}
         **/
        getHighlightSelectedWord(): boolean;
        /**
         * @param {boolean} shouldAnimate
         */
        setAnimatedScroll(shouldAnimate: boolean): void;
        /**
         * @return {boolean}
         */
        getAnimatedScroll(): boolean;
        /**
         * If `showInvisibles` is set to `true`, invisible characters&mdash;like spaces or new lines&mdash;are show in the editor.
         * @param {Boolean} showInvisibles Specifies whether or not to show invisible characters
         **/
        setShowInvisibles(showInvisibles: boolean): void;
        /**
         * Returns `true` if invisible characters are being shown.
         * @returns {Boolean}
         **/
        getShowInvisibles(): boolean;
        /**
         * @param {boolean} display
         */
        setDisplayIndentGuides(display: boolean): void;
        /**
         * @return {boolean}
         */
        getDisplayIndentGuides(): boolean;
        /**
         * @param {boolean} highlight
         */
        setHighlightIndentGuides(highlight: boolean): void;
        /**
         * @return {boolean}
         */
        getHighlightIndentGuides(): boolean;
        /**
         * If `showPrintMargin` is set to `true`, the print margin is shown in the editor.
         * @param {Boolean} showPrintMargin Specifies whether or not to show the print margin
         *
         **/
        setShowPrintMargin(showPrintMargin: boolean): void;
        /**
         * Returns `true` if the print margin is being shown.
         * @returns {Boolean}
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
         * @returns {Number}
         **/
        getPrintMarginColumn(): number;
        /**
         * If `readOnly` is true, then the editor is set to read-only mode, and none of the content can change.
         * @param {Boolean} readOnly Specifies whether the editor can be modified or not
         **/
        setReadOnly(readOnly: boolean): void;
        /**
         * Returns `true` if the editor is set to read-only mode.
         * @returns {Boolean}
         **/
        getReadOnly(): boolean;
        /**
         * Specifies whether to use behaviors or not. ["Behaviors" in this case is the auto-pairing of special characters, like quotation marks, parenthesis, or brackets.]{: #BehaviorsDef}
         * @param {Boolean} enabled Enables or disables behaviors
         **/
        setBehavioursEnabled(enabled: boolean): void;
        /**
         * Returns `true` if the behaviors are currently enabled. {:BehaviorsDef}
         * @returns {Boolean}
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
         * @returns {boolean}
         **/
        getWrapBehavioursEnabled(): boolean;
        /**
         * Indicates whether the fold widgets should be shown or not.
         * @param {Boolean} show Specifies whether the fold widgets are shown
         **/
        setShowFoldWidgets(show: boolean): void;
        /**
         * Returns `true` if the fold widgets are shown.
         * @return {Boolean}
         **/
        getShowFoldWidgets(): boolean;
        /**
         * @param {boolean} fade
         */
        setFadeFoldWidgets(fade: boolean): void;
        /**
         * @returns {boolean}
         */
        getFadeFoldWidgets(): boolean;
        /**
         * Removes the current selection or one character.
         * @param {'left' | 'right'} [dir] The direction of the deletion to occur, either "left" or "right"
         **/
        remove(dir?: 'left' | 'right'): void;
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
         * @returns {any}
         **/
        getNumberAt(row: any, column: any): any;
        /**
         * If the character before the cursor is a number, this functions changes its value by `amount`.
         * @param {Number} amount The value to change the numeral by (can be negative to decrease value)
         **/
        modifyNumber(amount: number): void;
        /**
         */
        toggleWord(): void;
        /**
         * Finds link at defined {row} and {column}
         * @returns {String}
         **/
        findLinkAt(row: any, column: any): string;
        /**
         * Open valid url under cursor in another tab
         * @returns {Boolean}
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
         * @param {boolean} [copy]
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
        /**
         * for internal use
         * @ignore
         *
         **/
        $moveLines(dir: any, copy: any): void;
        inVirtualSelectionMode: boolean;
        /**
         * Returns an object indicating the currently selected rows. The object looks like this:
         *
         * ```json
         * { first: range.start.row, last: range.end.row }
         * ```
         *
         * @returns {Object}
         **/
        $getSelectedRows(range: any): any;
        onCompositionStart(compositionState: any): void;
        onCompositionUpdate(text: any): void;
        onCompositionEnd(): void;
        /**
         * {:VirtualRenderer.getFirstVisibleRow}
         *
         * @returns {Number}
         * @related VirtualRenderer.getFirstVisibleRow
         **/
        getFirstVisibleRow(): number;
        /**
         * {:VirtualRenderer.getLastVisibleRow}
         *
         * @returns {Number}
         * @related VirtualRenderer.getLastVisibleRow
         **/
        getLastVisibleRow(): number;
        /**
         * Indicates if the row is currently visible on the screen.
         * @param {Number} row The row to check
         *
         * @returns {Boolean}
         **/
        isRowVisible(row: number): boolean;
        /**
         * Indicates if the entire row is currently visible on the screen.
         * @param {Number} row The row to check
         *
         *
         * @returns {Boolean}
         **/
        isRowFullyVisible(row: number): boolean;
        /**
         * Returns the number of currently visible rows.
         * @returns {Number}
         **/
        $getVisibleRowCount(): number;
        $moveByPage(dir: any, select: any): void;
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
         * @param {number} row
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
         * @returns {Point}
         * @related EditSession.documentToScreenPosition
         **/
        getCursorPositionScreen(): Point;
        /**
         * {:Selection.getRange}
         * @returns {Range}
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
         * @param {boolean} [select]
         * @param {boolean} [expand]
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
         * @return {number}
         **/
        replace(replacement?: string, options?: Partial<SearchOptions>): number;
        /**
         * Replaces all occurrences of `options.needle` with the value in `replacement`.
         * @param {String} [replacement] The text to replace with
         * @param {Partial<SearchOptions>} [options] The [[Search `Search`]] options to use
         * @return {number}
         **/
        replaceAll(replacement?: string, options?: Partial<SearchOptions>): number;
        /**
         * @param {import("../ace-internal").Ace.IRange} range
         * @param {string} [replacement]
         */
        $tryReplace(range: import("../ace-internal").Ace.IRange, replacement?: string): import("../ace-internal").Ace.IRange;
        /**
         * {:Search.getOptions} For more information on `options`, see [[Search `Search`]].
         * @related Search.getOptions
         * @returns {Partial<SearchOptions>}
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
        /**
         *
         * @param {Range} range
         * @param {boolean} [animate]
         */
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
        $scrollAnchor: HTMLDivElement;
        $resetCursorStyle(): void;
        /**
         * opens a prompt displaying message
         **/
        prompt(message: any, options: any, callback: any): void;
        $mergeableCommands: string[];
        $toggleWordPairs: string[][];
        $mergeUndoDeltas?: any;
        $highlightSelectedWord?: boolean;
        $updatePlaceholder?: Function;
        $cursorStyle?: string; /**
         * @param {boolean} highlight
         */
        $readOnly?: any;
        $highlightActiveLine?: any;
        $enableAutoIndent?: any;
        $copyWithEmptySelection?: any;
        $selectionStyle?: string;
        env?: any;
        widgetManager?: LineWidgets;
        completer?: import("autocomplete").Autocomplete | import("ext/inline_autocomplete").InlineAutocomplete;
        completers: import("../ace-internal").Ace.Completer[];
        $highlightTagPending?: boolean;
        showKeyboardShortcuts?: () => void;
        showSettingsMenu?: () => void;
        searchBox?: import("ext/searchbox").SearchBox;
        _eventRegistry?: any;
    }
    namespace Editor {
        export { $uid };
    }
    export type VirtualRenderer = import("virtual_renderer").VirtualRenderer;
    export type Selection = import("selection").Selection;
    export type Point = import("../ace-internal").Ace.Point;
    export type SearchOptions = import("../ace-internal").Ace.SearchOptions;
    import EditSession_1 = require("edit_session");
    import EditSession = EditSession_1.EditSession;
    import CommandManager_1 = require("commands/command_manager");
    import CommandManager = CommandManager_1.CommandManager;
    import MouseHandler_1 = require("mouse/mouse_handler");
    import MouseHandler = MouseHandler_1.MouseHandler;
    import KeyBinding_1 = require("keyboard/keybinding");
    import KeyBinding = KeyBinding_1.KeyBinding;
    import Search_1 = require("search");
    import Search = Search_1.Search;
    import Range_7 = require("range");
    import Range = Range_7.Range;
    import LineWidgets_1 = require("line_widgets");
    import LineWidgets = LineWidgets_1.LineWidgets;
    var $uid: number;
    export {};
}
declare module "undomanager" {
    export type EditSession = import("edit_session").EditSession;
    export type Delta = import("../ace-internal").Ace.Delta;
    export type Point = import("../ace-internal").Ace.Point;
    export type IRange = import("../ace-internal").Ace.IRange;
    /**
     * @typedef {import("./edit_session").EditSession} EditSession
     * @typedef {import("../ace-internal").Ace.Delta} Delta
     * @typedef {import("../ace-internal").Ace.Point} Point
     * @typedef {import("../ace-internal").Ace.IRange} IRange
     */
    /**
     * This object maintains the undo stack for an [[EditSession `EditSession`]].
     **/
    export class UndoManager {
        /**@type {boolean}*/
        $keepRedoStack: boolean;
        $maxRev: number;
        $fromUndo: boolean;
        $undoDepth: number;
        /**
         *
         * @param {EditSession} session
         */
        addSession(session: EditSession): void;
        $session: import("edit_session").EditSession;
        /**
         * Provides a means for implementing your own undo manager. `options` has one property, `args`, an [[Array `Array`]], with two elements:
         *
         * - `args[0]` is an array of deltas
         * - `args[1]` is the document to associate with
         *
         * @param {import("../ace-internal").Ace.Delta} delta
         * @param {boolean} allowMerge
         * @param {EditSession} [session]
         **/
        add(delta: import("../ace-internal").Ace.Delta, allowMerge: boolean, session?: EditSession): void;
        lastDeltas: any[];
        $rev: any;
        $lastDelta: any;
        /**
         *
         * @param {any} selection
         * @param {number} [rev]
         */
        addSelection(selection: any, rev?: number): void;
        startNewGroup(): any;
        /**
         *
         * @param {number} from
         * @param {number} [to]
         */
        markIgnored(from: number, to?: number): void;
        /**
         *
         * @param {number} rev
         * @param {boolean} [after]
         * @return {{ value: string, rev: number }}
         */
        getSelection(rev: number, after?: boolean): {
            value: string;
            rev: number;
        };
        /**
         * @return {number}
         */
        getRevision(): number;
        /**
         *
         * @param {number} from
         * @param {number} [to]
         * @return {import("../ace-internal").Ace.Delta[]}
         */
        getDeltas(from: number, to?: number): import("../ace-internal").Ace.Delta[];
        /**
         *
         * @param {number} from
         * @param {number} [to]
         */
        getChangedRanges(from: number, to?: number): void;
        /**
         *
         * @param {number} from
         * @param {number} [to]
         */
        getChangedLines(from: number, to?: number): void;
        /**
         * [Perform an undo operation on the document, reverting the last change.]{: #UndoManager.undo}
         * @param {EditSession} session
         * @param {Boolean} [dontSelect] {:dontSelect}
         **/
        undo(session: EditSession, dontSelect?: boolean): void;
        $redoStack: any;
        /**
         * [Perform a redo operation on the document, reimplementing the last change.]{: #UndoManager.redo}
         * @param {EditSession} session
         * @param {Boolean} [dontSelect] {:dontSelect}
         *
         **/
        redo(session: EditSession, dontSelect?: boolean): void;
        $redoStackBaseRev: any;
        $syncRev(): void;
        /**
         * Destroys the stack of undo and redo redo operations.
         **/
        reset(): void;
        $undoStack: any;
        mark: number;
        selections: any[];
        /**
         * Returns `true` if there are undo operations left to perform.
         * @returns {Boolean}
         **/
        canUndo(): boolean;
        /**
         * Returns `true` if there are redo operations left to perform.
         * @returns {Boolean}
         **/
        canRedo(): boolean;
        /**
         * Marks the current status clean
         * @param {number} [rev]
         */
        bookmark(rev?: number): void;
        /**
         * Returns if the current status is clean
         * @returns {Boolean}
         **/
        isAtBookmark(): boolean;
        /**
         * Returns an object which can be safely stringified into JSON
         * @returns {object}
         */
        toJSON(): object;
        /**
         * Takes in an object which was returned from the toJSON method above,
         * and resets the current undoManager instance to use the previously exported
         * instance state.
         * @param {object} json
         */
        fromJSON(json: object): void;
        /**
         * @param {Delta} delta
         */
        $prettyPrint(delta: Delta): any;
        hasUndo: () => boolean;
        hasRedo: () => boolean;
        isClean: () => boolean;
        markClean: (rev?: number) => void;
    }
}
declare module "tokenizer" {
    /**
     * This class takes a set of highlighting rules, and creates a tokenizer out of them. For more information, see [the wiki on extending highlighters](https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode#wiki-extendingTheHighlighter).
     **/
    export class Tokenizer {
        /**
         * Constructs a new tokenizer based on the given rules and flags.
         * @param {Object} rules The highlighting rules
         **/
        constructor(rules: any);
        /**@type {RegExp}*/
        splitRegex: RegExp;
        states: any;
        regExps: {};
        matchMappings: {};
        /**
         * @param {number} m
         */
        $setMaxTokenCount(m: number): void;
        /**
         * @param {string} str
         * @return {import("../ace-internal").Ace.Token[]}
         */
        $applyToken(str: string): import("../ace-internal").Ace.Token[];
        /**
         * @param {string} str
         * @return {import("../ace-internal").Ace.Token[] | string}
         */
        $arrayTokens(str: string): import("../ace-internal").Ace.Token[] | string;
        /**
         * @param {string} src
         * @returns {string}
         */
        removeCapturingGroups(src: string): string;
        /**
         * @param {string} src
         * @param {string} flag
         */
        createSplitterRegexp(src: string, flag: string): RegExp;
        /**
         * Returns an object containing two properties: `tokens`, which contains all the tokens; and `state`, the current state.
         * @param {string} line
         * @param {string | string[]} startState
         * @returns {{tokens:import("../ace-internal").Ace.Token[], state: string|string[]}}
         */
        getLineTokens(line: string, startState: string | string[]): {
            tokens: import("../ace-internal").Ace.Token[];
            state: string | string[];
        };
        reportError: (msg: any, data: any) => void;
    }
}
declare module "autocomplete/popup" {
    const AcePopup_base: undefined;
    /**
     * This object is used in some places where needed to show popups - like prompt; autocomplete etc.
     */
    export class AcePopup extends AcePopup_base {
        /**
         * Creates and renders single line editor in popup window. If `parentNode` param is isset, then attaching it to this element.
         * @param {Element} [parentNode]
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
        data: import("autocomplete").Completion[];
        setData: (data: import("autocomplete").Completion[], filterText: string) => void;
        getData: (row: number) => import("autocomplete").Completion;
        hide: () => void;
        anchor: "bottom" | "top";
        anchorPosition: import("../../ace-internal").Ace.Point;
        tryShow: (pos: any, lineHeight: number, anchor: "bottom" | "top", forceShow?: boolean) => boolean;
        $borderSize: number;
        show: (pos: any, lineHeight: number, topdownOnly?: boolean) => void;
        goTo: (where: import("../../ace-internal").Ace.AcePopupNavigation) => void;
        getTextLeftOffset: () => number;
        $imageSize: number;
        anchorPos: any;
        isMouseOver?: boolean;
        selectedNode?: HTMLElement;
    }
    /**
     *
     * @param {HTMLElement} [el]
     * @return {Editor}
     */
    export function $singleLineEditor(el?: HTMLElement): Editor;
    export function getAriaId(index: any): string;
    import Editor_1 = require("editor");
    import Editor = Editor_1.Editor;
    export {};
}
declare module "range_list" {
    export type EditSession = import("edit_session").EditSession;
    export type Point = import("../ace-internal").Ace.Point;
    export class RangeList {
        ranges: any[];
        $bias: number;
        /**
         * @param {Point} pos
         * @param {boolean} [excludeEdges]
         * @param {number} [startIndex]
         * @return {number}
         */
        pointIndex(pos: Point, excludeEdges?: boolean, startIndex?: number): number;
        /**
         * @param {Range} range
         */
        add(range: Range): any[];
        /**
         * @param {Range[]} list
         */
        addList(list: Range[]): any[];
        /**
         * @param {Point} pos
         */
        substractPoint(pos: Point): any[];
        merge(): any[];
        /**
         * @param {number} row
         * @param {number} column
         */
        contains(row: number, column: number): boolean;
        /**
         * @param {Point} pos
         */
        containsPoint(pos: Point): boolean;
        /**
         * @param {Point} pos
         */
        rangeAtPoint(pos: Point): any;
        /**
         * @param {number} startRow
         * @param {number} endRow
         */
        clipRows(startRow: number, endRow: number): any[];
        removeAll(): any[];
        /**
         * @param {EditSession} session
         */
        attach(session: EditSession): void;
        session: import("edit_session").EditSession;
        onChange: any;
        detach(): void;
        /**
         * @param {import("../ace-internal").Ace.Delta} delta
         */
        $onChange(delta: import("../ace-internal").Ace.Delta): void;
        comparePoints: (p1: import("../ace-internal").Ace.Point, p2: import("../ace-internal").Ace.Point) => number;
    }
    import Range_8 = require("range");
    import Range = Range_8.Range;
}
declare module "snippets" {
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
    export interface SnippetManager extends  {
    }
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
        /**
         * @return {Tokenizer}
         */
        getTokenizer(): Tokenizer;
        createTokenizer(): any;
        tokenizeTmSnippet(str: any, startState: any): (string | import("../ace-internal").Ace.Token)[];
        getVariableValue(editor: any, name: any, indentation: any): any;
        tmStrFormat(str: any, ch: any, editor: any): any;
        tmFormatFunction(str: any, ch: any, editor: any): any;
        resolveVariables(snippet: any, editor: any): any[];
        getDisplayTextForSnippet(editor: any, snippetText: any): any;
        insertSnippetForSelection(editor: any, snippetText: any, options?: {}): void;
        insertSnippet(editor: any, snippetText: any, options?: {}): void;
        $getScope(editor: any): any;
        getActiveScopes(editor: any): any[];
        expandWithTab(editor: any, options: any): any;
        expandSnippetForSelection(editor: any, options: any): boolean;
        /**
         * @param {Snippet[]} snippetList
         * @param {string} before
         * @param {string} after
         * @return {Snippet}
         */
        findMatchingSnippet(snippetList: Snippet[], before: string, after: string): Snippet;
        /**
         * @param {any[]} snippets
         * @param {string} scope
         */
        register(snippets: any[], scope: string): void;
        unregister(snippets: any, scope: any): void;
        parseSnippetFile(str: any): Snippet[];
        getSnippetByName(name: any, editor: any): undefined;
    }
    import Tokenizer_1 = require("tokenizer");
    import Tokenizer = Tokenizer_1.Tokenizer;
    export {};
}
declare module "autocomplete/inline_screenreader" {
    /**
     * This object is used to communicate inline code completions rendered into an editor with ghost text to screen reader users.
     */
    export class AceInlineScreenReader {
        /**
         * Creates the off-screen div in which the ghost text content in redered and which the screen reader reads.
         * @param {import("../editor").Editor} editor
         */
        constructor(editor: import("../editor").Editor);
        editor: import("editor").Editor;
        screenReaderDiv: HTMLDivElement;
        /**
         * Set the ghost text content to the screen reader div
         * @param {string} content
         */
        setScreenReaderContent(content: string): void;
        popup: import("autocomplete/popup").AcePopup;
        _lines: string[];
        destroy(): void;
        /**
         * Take this._lines, render it as <code> blocks and add those to the screen reader div.
         */
        createCodeBlock(): HTMLPreElement;
    }
}
declare module "autocomplete/inline" {
    export type Editor = import("editor").Editor;
    /**
     * This object is used to manage inline code completions rendered into an editor with ghost text.
     */
    export class AceInline {
        editor: any;
        /**
         * Renders the completion as ghost text to the current cursor position
         * @param {Editor} editor
         * @param {import("../../ace-internal").Ace.Completion} completion
         * @param {string} prefix
         * @returns {boolean} True if the completion could be rendered to the editor, false otherwise
         */
        show(editor: Editor, completion: import("../../ace-internal").Ace.Completion, prefix: string): boolean;
        inlineScreenReader: AceInlineScreenReader;
        isOpen(): boolean;
        hide(): boolean;
        destroy(): void;
    }
    import AceInlineScreenReader_1 = require("autocomplete/inline_screenreader");
    import AceInlineScreenReader = AceInlineScreenReader_1.AceInlineScreenReader;
}
declare module "autocomplete/util" {
    export function parForEach(array: any, fn: any, callback: any): void;
    export function retrievePrecedingIdentifier(text: any, pos: any, regex: any): string;
    export function retrieveFollowingIdentifier(text: any, pos: any, regex: any): any[];
    export function getCompletionPrefix(editor: any): string;
    export function triggerAutocomplete(editor: any): any;
}
declare module "autocomplete" {
    /**
     * This object controls the autocompletion components and their lifecycle.
     * There is an autocompletion popup, an optional inline ghost text renderer and a docuent tooltip popup inside.
     */
    export class Autocomplete {
        static get completionsForLoading(): {
            caption: any;
            value: string;
        }[];
        autoInsert: boolean;
        autoSelect: boolean;
        autoShown: boolean;
        exactMatch: boolean;
        inlineEnabled: boolean;
        keyboardHandler: HashHandler;
        parentNode: any;
        setSelectOnHover: boolean;
        hasSeen: Set<any>;
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
        onLayoutChange(): void;
        changeTimer: {
            (timeout: any): void;
            delay(timeout: any): void;
            schedule: any;
            call(): void;
            cancel(): void; /**
             *  @property {Boolean} showLoadingState - A boolean indicating whether the loading states of the Autocompletion should be shown to the end-user. If enabled
             * it shows a loading indicator on the popup while autocomplete is loading.
             *
             * Experimental: This visualisation is not yet considered stable and might change in the future.
             */
            isPending(): any;
        };
        tooltipTimer: {
            (timeout: any): void;
            delay(timeout: any): void;
            schedule: any;
            call(): void;
            cancel(): void; /**
             *  @property {Boolean} showLoadingState - A boolean indicating whether the loading states of the Autocompletion should be shown to the end-user. If enabled
             * it shows a loading indicator on the popup while autocomplete is loading.
             *
             * Experimental: This visualisation is not yet considered stable and might change in the future.
             */
            isPending(): any;
        };
        popupTimer: {
            (timeout: any): void;
            delay(timeout: any): void;
            schedule: any;
            call(): void;
            cancel(): void; /**
             *  @property {Boolean} showLoadingState - A boolean indicating whether the loading states of the Autocompletion should be shown to the end-user. If enabled
             * it shows a loading indicator on the popup while autocomplete is loading.
             *
             * Experimental: This visualisation is not yet considered stable and might change in the future.
             */
            isPending(): any;
        };
        stickySelectionTimer: {
            (timeout: any): void;
            delay(timeout: any): void;
            schedule: any;
            call(): void;
            cancel(): void; /**
             *  @property {Boolean} showLoadingState - A boolean indicating whether the loading states of the Autocompletion should be shown to the end-user. If enabled
             * it shows a loading indicator on the popup while autocomplete is loading.
             *
             * Experimental: This visualisation is not yet considered stable and might change in the future.
             */
            isPending(): any;
        };
        $firstOpenTimer: {
            (timeout: any): void;
            delay(timeout: any): void;
            schedule: any;
            call(): void;
            cancel(): void; /**
             *  @property {Boolean} showLoadingState - A boolean indicating whether the loading states of the Autocompletion should be shown to the end-user. If enabled
             * it shows a loading indicator on the popup while autocomplete is loading.
             *
             * Experimental: This visualisation is not yet considered stable and might change in the future.
             */
            isPending(): any;
        };
        $init(): AcePopup;
        /**@type {AcePopup}**/
        popup: AcePopup;
        $initInline(): AceInline;
        inlineRenderer: AceInline;
        /**
         * @return {AcePopup}
         */
        getPopup(): AcePopup;
        $onHidePopup(): void;
        stickySelection: boolean;
        $seen(completion: any): void;
        $onPopupChange(hide: any): void;
        $onPopupRender(): void;
        $onPopupShow(hide: any): void;
        observeLayoutChanges(): void;
        $elements: ParentNode[];
        unObserveLayoutChanges(): void;
        $updatePopupPosition(): void;
        /**
         * @param {Editor} editor
         * @param {string} prefix
         * @param {boolean} [keepPopupPosition]
         */
        openPopup(editor: Editor, prefix: string, keepPopupPosition?: boolean): void;
        /**
         * Detaches all elements from the editor, and cleans up the data for the session
         */
        detach(): void;
        activated: boolean;
        completionProvider: CompletionProvider;
        completions: FilteredList;
        base: import("anchor").Anchor;
        mouseOutListener(e: any): void;
        goTo(where: any): void;
        /**
         * @param {Completion} data
         * @param {undefined} [options]
         * @return {boolean | void}
         */
        insertMatch(data: Completion, options?: undefined): boolean | void;
        /**
         * This is the entry point for the autocompletion class, triggers the actions which collect and display suggestions
         * @param {Editor} editor
         * @param {CompletionOptions} options
         */
        showPopup(editor: Editor, options: CompletionOptions): void;
        editor: import("editor").Editor;
        getCompletionProvider(initialPosition: any): CompletionProvider;
        /**
         * This method is deprecated, it is only kept for backwards compatibility.
         * Use the same method include CompletionProvider instead for the same functionality.
         * @deprecated
         */
        gatherCompletions(editor: any, callback: any): boolean;
        /**
         * @param {boolean} keepPopupPosition
         * @param {CompletionOptions} options
         */
        updateCompletions(keepPopupPosition: boolean, options: CompletionOptions): void;
        cancelContextMenu(): void;
        updateDocTooltip(): void;
        showDocTooltip(item: any): void;
        tooltipNode: HTMLDivElement;
        hideDocTooltip(): void;
        onTooltipClick(e: any): void;
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
            PageUp: (editor: any) => void;
            PageDown: (editor: any) => void;
        };
        emptyMessage?: Function;
    }
    namespace Autocomplete {
        export { _for as for, startCommand };
    }
    /**
     * This class is responsible for providing completions and inserting them to the editor
     */
    export class CompletionProvider {
        /**
         * @param {{pos: import("../ace-internal").Ace.Position, prefix: string}} initialPosition
         */
        constructor(initialPosition: {
            pos: import("../ace-internal").Ace.Position;
            prefix: string;
        });
        initialPosition: {
            pos: import("../ace-internal").Ace.Position;
            prefix: string;
        };
        active: boolean;
        /**
         * @param {Editor} editor
         * @param {number} index
         * @param {CompletionProviderOptions} [options]
         * @returns {boolean}
         */
        insertByIndex(editor: Editor, index: number, options?: CompletionProviderOptions): boolean;
        /**
         * @param {Editor} editor
         * @param {Completion} data
         * @param {CompletionProviderOptions} [options]
         * @returns {boolean}
         */
        insertMatch(editor: Editor, data: Completion, options?: CompletionProviderOptions): boolean;
        /**
         * @param {Editor} editor
         * @param {Completion} data
         */
        $insertString(editor: Editor, data: Completion): void;
        /**
         * @param {Editor} editor
         * @param {import("../ace-internal").Ace.CompletionCallbackFunction} callback
         */
        gatherCompletions(editor: Editor, callback: import("../ace-internal").Ace.CompletionCallbackFunction): boolean;
        completers: import("../ace-internal").Ace.Completer[];
        /**
         * This is the entry point to the class, it gathers, then provides the completions asynchronously via callback.
         * The callback function may be called multiple times, the last invokation is marked with a `finished` flag
         * @param {Editor} editor
         * @param {CompletionProviderOptions} options
         * @param {(err: Error | undefined, completions: FilteredList | [], finished: boolean) => void} callback
         */
        provideCompletions(editor: Editor, options: CompletionProviderOptions, callback: (err: Error | undefined, completions: FilteredList | [], finished: boolean) => void): void;
        detach(): void;
        completions: FilteredList;
    }
    export type Editor = import("editor").Editor;
    export type CompletionProviderOptions = import("../ace-internal").Ace.CompletionProviderOptions;
    export type CompletionOptions = import("../ace-internal").Ace.CompletionOptions;
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
        range?: import("../ace-internal").Ace.IRange;
        /**
         * - A command to be executed after the completion is inserted (experimental)
         */
        command?: string;
        /**
         * - a text snippet that would be inserted when the completion is selected
         */
        snippet?: string;
        /**
         * - The text that would be inserted when selecting this completion.
         */
        value?: string;
        completer?: import("../ace-internal").Ace.Completer & {
            insertMatch: (editor: Editor, data: Completion) => void;
        };
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
    import HashHandler_1 = require("keyboard/hash_handler");
    import HashHandler = HashHandler_1.HashHandler;
    import AcePopup_1 = require("autocomplete/popup");
    import AcePopup = AcePopup_1.AcePopup;
    import AceInline_1 = require("autocomplete/inline");
    import AceInline = AceInline_1.AceInline;
    export class FilteredList {
        constructor(array: any, filterText: any);
        all: any;
        filtered: any;
        filterText: any;
        exactMatch: boolean;
        ignoreCaption: boolean;
        setFilter(str: any): void;
        filterCompletions(items: any, needle: any): any[];
    }
    namespace startCommand {
        let name: string;
        function exec(editor: any, options: any): void;
        let bindKey: string;
    }
    export {};
}
declare module "ext/command_bar" {
    const CommandBarTooltip_base: undefined;
    /**
     * Displays a command tooltip above the currently active line selection, with clickable elements.
     *
     * Internally it is a composite of two tooltips, one for the main tooltip and one for the
     * overflowing commands.
     * The commands are added sequentially in registration order.
     * When attached to an editor, it is either always shown or only when the active line is hovered
     * with mouse, depending on the alwaysShow property.
     */
    export class CommandBarTooltip extends CommandBarTooltip_base {
        /**
         * @param {HTMLElement} parentNode
         * @param {Partial<import("../../ace-internal").Ace.CommandBarOptions>} [options]
         */
        constructor(parentNode: HTMLElement, options?: Partial<import("../../ace-internal").Ace.CommandBarOptions>);
        parentNode: HTMLElement;
        tooltip: Tooltip;
        moreOptions: Tooltip;
        maxElementsOnTooltip: number;
        $alwaysShow: boolean;
        eventListeners: {};
        elements: {};
        commands: {};
        tooltipEl: any[] | HTMLElement | Text;
        moreOptionsEl: any[] | HTMLElement | Text;
        $showTooltipTimer: {
            (timeout: any): void;
            delay(timeout: any): void;
            schedule: any;
            call(): void;
            cancel(): void;
            isPending(): any;
        };
        $hideTooltipTimer: {
            (timeout: any): void;
            delay(timeout: any): void;
            schedule: any;
            call(): void;
            cancel(): void;
            isPending(): any;
        };
        $tooltipEnter(): void;
        $onMouseMove(e: any): void;
        $onChangeScroll(): void;
        $onEditorChangeSession(e: any): void;
        $scheduleTooltipForHide(): void;
        $preventMouseEvent(e: any): void;
        /**
         * Registers a command on the command bar tooltip.
         *
         * The commands are added in sequential order. If there is not enough space on the main
         * toolbar, the remaining elements are added to the overflow menu.
         *
         * @param {string} id
         * @param {TooltipCommand} command
         */
        registerCommand(id: string, command: TooltipCommand): void;
        isShown(): boolean;
        isMoreOptionsShown(): boolean;
        getAlwaysShow(): boolean;
        /**
         * Sets the display mode of the tooltip
         *
         * When true, the tooltip is always displayed while it is attached to an editor.
         * When false, the tooltip is displayed only when the mouse hovers over the active editor line.
         *
         * @param {boolean} alwaysShow
         */
        setAlwaysShow(alwaysShow: boolean): void;
        /**
         * Attaches the clickable command bar tooltip to an editor
         *
         * Depending on the alwaysShow parameter it either displays the tooltip immediately,
         * or subscribes to the necessary events to display the tooltip on hover.
         *
         * @param {Editor} editor
         */
        attach(editor: Editor): void;
        editor: import("editor").Editor;
        /**
         * Updates the position of the command bar tooltip. It aligns itself above the active line in the editor.
         */
        updatePosition(): void;
        /**
         * Updates each command element in the tooltip.
         *
         * This is automatically called on certain events, but can be called manually as well.
         */
        update(): void;
        /**
         * Detaches the tooltip from the editor.
         */
        detach(): void;
        $mouseInTooltip: boolean;
        destroy(): void;
        /**
         * @param {string} id
         * @param {TooltipCommand} command
         * @param {boolean} forMainTooltip
         */
        $createCommand(id: string, command: TooltipCommand, forMainTooltip: boolean): void;
        /**
         * @param {boolean} visible
         */
        $setMoreOptionsVisibility(visible: boolean): void;
        /**
         * @param {boolean} [enableHover]
         */
        $updateOnHoverHandlers(enableHover?: boolean): void;
        $showTooltip(): void;
        $hideTooltip(): void;
        /**
         * @param {string} id
         */
        $updateElement(id: string): void;
        $shouldHideMoreOptions?: boolean;
    }
    export type Editor = import("editor").Editor;
    export type TooltipCommand = import("../ace-internal").Ace.TooltipCommand;
    import Tooltip_2 = require("tooltip");
    import Tooltip = Tooltip_2.Tooltip;
    export var TOOLTIP_CLASS_NAME: string;
    export var BUTTON_CLASS_NAME: string;
    export {};
}
declare module "autocomplete/text_completer" {
    export function getCompletions(editor: any, session: any, pos: any, prefix: any, callback: any): void;
}
declare module "ext/language_tools" {
    export function setCompleters(val: any): void;
    export function addCompleter(completer: any): void;
    import textCompleter = require("autocomplete/text_completer");
    /**@type {import("../../ace-internal").Ace.Completer}*/
    export var keyWordCompleter: import("../ace-internal").Ace.Completer;
    /**@type {import("../../ace-internal").Ace.Completer} */
    export var snippetCompleter: import("../ace-internal").Ace.Completer;
    export { textCompleter };
}
declare module "ext/inline_autocomplete" {
    /**
     * This class controls the inline-only autocompletion components and their lifecycle.
     * This is more lightweight than the popup-based autocompletion, as it can only work with exact prefix matches.
     * There is an inline ghost text renderer and an optional command bar tooltip inside.
     */
    export class InlineAutocomplete {
        /**
         * @param {Editor} editor
         */
        constructor(editor: Editor);
        editor: Editor;
        keyboardHandler: HashHandler;
        $index: number;
        blurListener(e: any): void;
        changeListener(e: any): void;
        changeTimer: {
            (timeout: any): void;
            delay(timeout: any): void;
            schedule: any;
            call(): void;
            cancel(): void;
            isPending(): any;
        };
        /**
         *
         * @return {AceInline}
         */
        getInlineRenderer(): AceInline;
        inlineRenderer: AceInline;
        /**
         * @return {CommandBarTooltip}
         */
        getInlineTooltip(): CommandBarTooltip;
        inlineTooltip: CommandBarTooltip;
        /**
         * This function is the entry point to the class. This triggers the gathering of the autocompletion and displaying the results;
         * @param {import("../../ace-internal").Ace.CompletionOptions} options
         */
        show(options: import("../../ace-internal").Ace.CompletionOptions): void;
        activated: boolean;
        $open(): void;
        insertMatch(): boolean;
        /**
         * @param {import("../../ace-internal").Ace.InlineAutocompleteAction} where
         */
        goTo(where: import("../../ace-internal").Ace.InlineAutocompleteAction): void;
        getLength(): any;
        /**
         * @param {number} [index]
         * @returns {import("../../ace-internal").Ace.Completion | undefined}
         */
        getData(index?: number): import("../../ace-internal").Ace.Completion | undefined;
        getIndex(): number;
        isOpen(): boolean;
        /**
         * @param {number} value
         */
        setIndex(value: number): void;
        /**
         * @return {CompletionProvider}
         */
        getCompletionProvider(initialPosition: any): CompletionProvider;
        completionProvider: CompletionProvider;
        $showCompletion(): void;
        /**
         * @return {any}
         */
        $updatePrefix(): any;
        /**
         * @param {import("../../ace-internal").Ace.CompletionOptions} [options]
         */
        updateCompletions(options?: import("../../ace-internal").Ace.CompletionOptions): void;
        base: import("anchor").Anchor;
        completions: FilteredList;
        detach(): void;
        destroy(): void;
        updateDocTooltip(): void;
        /**
         *
         * @type {{[key: string]: import("../../ace-internal").Ace.Command}}
         */
        commands: {
            [key: string]: import("../../ace-internal").Ace.Command;
        };
    }
    export namespace InlineAutocomplete {
        function _for(editor: any): any;
        export { _for as for };
        export namespace startCommand {
            let name: string;
            function exec(editor: any, options: any): void;
            namespace bindKey {
                let win: string;
                let mac: string;
            }
        }
        /**
         * Factory method to create a command bar tooltip for inline autocomplete.
         *
         * @param {HTMLElement} parentEl  The parent element where the tooltip HTML elements will be added.
         * @returns {CommandBarTooltip}   The command bar tooltip for inline autocomplete
         */
        export function createInlineTooltip(parentEl: HTMLElement): CommandBarTooltip;
    }
    import Editor_2 = require("editor");
    import Editor = Editor_2.Editor;
    import HashHandler_2 = require("keyboard/hash_handler");
    import HashHandler = HashHandler_2.HashHandler;
    import AceInline_2 = require("autocomplete/inline");
    import AceInline = AceInline_2.AceInline;
    import CommandBarTooltip_1 = require("ext/command_bar");
    import CommandBarTooltip = CommandBarTooltip_1.CommandBarTooltip;
    import CompletionProvider_1 = require("autocomplete");
    import CompletionProvider = CompletionProvider_1.CompletionProvider;
    import FilteredList_1 = require("autocomplete");
    import FilteredList = FilteredList_1.FilteredList;
}
declare module "ext/searchbox-css" {
    const _exports: string;
    export = _exports;
}
declare module "ext/searchbox" {
    export function Search(editor: Editor, isReplace?: boolean): void;
    export type Editor = import("editor").Editor;
    export class SearchBox {
        /**
         * @param {Editor} editor
         * @param {undefined} [range]
         * @param {undefined} [showReplaceForm]
         */
        constructor(editor: Editor, range?: undefined, showReplaceForm?: undefined);
        /**@type {any}*/
        activeInput: any;
        /**@type {any}*/
        element: any;
        setSession(e: any): void;
        /**
         * @param {Editor} editor
         */
        setEditor(editor: Editor): void;
        /**@type {Editor}*/
        editor: Editor;
        searchRange: any;
        /**
         * @param {HTMLElement} sb
         */
        $initElements(sb: HTMLElement): void;
        /**@type {HTMLElement}*/
        searchBox: HTMLElement;
        /**@type {HTMLElement}*/
        replaceBox: HTMLElement;
        /**@type {HTMLInputElement}*/
        searchOption: HTMLInputElement;
        /**@type {HTMLInputElement}*/
        replaceOption: HTMLInputElement;
        /**@type {HTMLInputElement}*/
        regExpOption: HTMLInputElement;
        /**@type {HTMLInputElement}*/
        caseSensitiveOption: HTMLInputElement;
        /**@type {HTMLInputElement}*/
        wholeWordOption: HTMLInputElement;
        /**@type {HTMLInputElement}*/
        searchInput: HTMLInputElement;
        /**@type {HTMLInputElement}*/
        replaceInput: HTMLInputElement;
        /**@type {HTMLElement}*/
        searchCounter: HTMLElement;
        $init(): void;
        $onChange: {
            (timeout: any): void;
            delay(timeout: any): void;
            schedule: any;
            call(): void;
            cancel(): void;
            isPending(): any;
        };
        setSearchRange(range: any): void;
        searchRangeMarker: number;
        /**
         * @param {boolean} [preventScroll]
         */
        $syncOptions(preventScroll?: boolean): void;
        /**
         * @param {RegExp} [re]
         */
        highlight(re?: RegExp): void;
        /**
         * @param {boolean} skipCurrent
         * @param {boolean} backwards
         * @param {any} [preventScroll]
         */
        find(skipCurrent: boolean, backwards: boolean, preventScroll?: any): void;
        updateCounter(): void;
        findNext(): void;
        findPrev(): void;
        findAll(): void;
        replace(): void;
        replaceAndFindNext(): void;
        replaceAll(): void;
        hide(): void;
        active: boolean;
        /**
         * @param {string} value
         * @param {boolean} [isReplace]
         */
        show(value: string, isReplace?: boolean): void;
        isFocused(): boolean;
        $searchBarKb: HashHandler;
        $closeSearchBarKb: HashHandler;
    }
    import HashHandler_3 = require("keyboard/hash_handler");
    import HashHandler = HashHandler_3.HashHandler;
}
declare module "search_highlight" {
    export type Marker = import("layer/marker").Marker;
    export type EditSession = import("edit_session").EditSession;
    export class SearchHighlight {
        /**
         * @param {any} regExp
         * @param {string} clazz
         */
        constructor(regExp: any, clazz: string, type?: string);
        clazz: string;
        type: string;
        setRegexp(regExp: any): void;
        regExp: any;
        cache: any[];
        /**
         * @param {any} html
         * @param {Marker} markerLayer
         * @param {EditSession} session
         * @param {Partial<import("../ace-internal").Ace.LayerConfig>} config
         */
        update(html: any, markerLayer: Marker, session: EditSession, config: Partial<import("../ace-internal").Ace.LayerConfig>): void;
        MAX_RANGES: number;
    }
}
declare module "occur" {
    export type Editor = import("editor").Editor;
    export type Point = import("../ace-internal").Ace.Point;
    export type SearchOptions = import("../ace-internal").Ace.SearchOptions;
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
         * @param {Editor} editor
         * @param {Object} options options.needle should be a String
         * @return {Boolean} Whether occur activation was successful
         *
         **/
        enter(editor: Editor, options: any): boolean;
        /**
         * Disables occur mode. Resets the [[Sessions `EditSession`]] [[Document
         * `Document`]] back to the original doc. If options.translatePosition is
         * truthy also maps the [[Editors `Editor`]] cursor position accordingly.
         * @param {Editor} editor
         * @param {Object} options options.translatePosition
         * @return {Boolean} Whether occur deactivation was successful
         *
         **/
        exit(editor: Editor, options: any): boolean;
        /**
         * @param {EditSession} sess
         * @param {RegExp} regexp
         */
        highlight(sess: EditSession, regexp: RegExp): void;
        /**
         * @param {Editor} editor
         * @param {Partial<SearchOptions>} options
         */
        displayOccurContent(editor: Editor, options: Partial<SearchOptions>): void;
        $originalSession: EditSession;
        $useEmacsStyleLineStart: boolean;
        /**
         * @param {Editor} editor
         */
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
        * @return {Point} position
        **/
        occurToOriginalPosition(session: EditSession, pos: Point): Point;
        /**
         * @param {EditSession} session
         * @param {Partial<SearchOptions>} options
         */
        matchingLines(session: EditSession, options: Partial<SearchOptions>): any[];
    }
    import Search_2 = require("search");
    import Search = Search_2.Search;
    import EditSession_2 = require("edit_session");
    import EditSession = EditSession_2.EditSession;
}
declare module "marker_group" {
    export type EditSession = import("edit_session").EditSession;
    export type MarkerGroupItem = {
        range: import("range").Range;
        className: string;
    };
    export type Marker = import("layer/marker").Marker;
    /**
     * @typedef {import("./edit_session").EditSession} EditSession
     * @typedef {{range: import("./range").Range, className: string}} MarkerGroupItem
     */
    /**
     * @typedef {import("./layer/marker").Marker} Marker
     */
    export class MarkerGroup {
        /**
         * @param {EditSession} session
         */
        constructor(session: EditSession);
        markers: any[];
        /**@type {EditSession}*/
        session: EditSession;
        /**
         * Finds the first marker containing pos
         * @param {import("../ace-internal").Ace.Point} pos
         * @returns import("../ace-internal").Ace.MarkerGroupItem
         */
        getMarkerAtPosition(pos: import("../ace-internal").Ace.Point): any;
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
        /**
         * @param {any} html
         * @param {Marker} markerLayer
         * @param {EditSession} session
         * @param {{ firstRow: any; lastRow: any; }} config
         */
        update(html: any, markerLayer: Marker, session: EditSession, config: {
            firstRow: any;
            lastRow: any;
        }): void;
        MAX_MARKERS: number;
    }
}
declare module "ext/elastic_tabstops_lite" {
    export class ElasticTabstopsLite {
        /**
         * @param {Editor} editor
         */
        constructor(editor: Editor);
        $editor: Editor;
        onAfterExec: () => void;
        onExec: () => void;
        onChange: (delta: any) => void;
        /**
         * @param {number[]} rows
         */
        processRows(rows: number[]): void;
        $inChange: boolean;
        /**
         * @param {number} row
         */
        $findCellWidthsForBlock(row: number): {
            cellWidths: number[][];
            firstRow: number;
        };
        /**
         * @param {number} row
         * @returns {number[]}
         */
        $cellWidthsForRow(row: number): number[];
        /**
         * @param {number} row
         * @returns {number[]}
         */
        $selectionColumnsForRow(row: number): number[];
        /**
         * @param {number[][]} cellWidths
         */
        $setBlockCellWidthsToMax(cellWidths: number[][]): number[][];
        /**
         * @param {number[]} selectionColumns
         * @param {number} cellRightEdge
         * @returns {number}
         */
        $rightmostSelectionInCell(selectionColumns: number[], cellRightEdge: number): number;
        /**
         * @param {number} row
         * @returns {number[]}
         */
        $tabsForRow(row: number): number[];
        /**
         * @param {number} row
         * @param {number[]} widths
         */
        $adjustRow(row: number, widths: number[]): void;
        /**
         * The is a (naive) Python port--but works for these purposes
         * @param {any[][]} iterables
         */
        $izip_longest(iterables: any[][]): any[][];
        /**
         * an even more (naive) Python port
         * @param {string | any[]} widths
         * @param {string | any[]} tabs
         */
        $izip(widths: string | any[], tabs: string | any[]): any[][];
    }
    import Editor_3 = require("editor");
    import Editor = Editor_3.Editor;
}
declare module "edit_session/fold" {
    export class Fold extends RangeList {
        /**
         * @param {Range} range
         * @param {any} placeholder
         */
        constructor(range: Range, placeholder: any);
        foldLine: import("edit_session/fold_line").FoldLine;
        placeholder: any;
        range: import("range").Range;
        start: import("../../ace-internal").Ace.Point;
        end: import("../../ace-internal").Ace.Point;
        sameRow: boolean;
        /**@type {Fold[]}*/
        subFolds: Fold[];
        /**
         * @param {FoldLine} foldLine
         */
        setFoldLine(foldLine: FoldLine): void;
        clone(): Fold;
        /**
         * @param {Fold} fold
         */
        addSubFold(fold: Fold): any;
        /**
         * @param {IRange} range
         */
        restoreRange(range: IRange): void;
        collapseChildren?: number;
    }
    export type FoldLine = import("edit_session/fold_line").FoldLine;
    export type Range = import("range").Range;
    export type Point = import("../ace-internal").Ace.Point;
    export type IRange = import("../ace-internal").Ace.IRange;
    import RangeList_1 = require("range_list");
    import RangeList = RangeList_1.RangeList;
}
declare module "edit_session/fold_line" {
    export type Fold = import("edit_session/fold").Fold;
    export class FoldLine {
        /**
         * If an array is passed in, the folds are expected to be sorted already.
         * @param {FoldLine[]} foldData
         * @param {Fold[]|Fold} folds
         */
        constructor(foldData: FoldLine[], folds: Fold[] | Fold);
        foldData: FoldLine[];
        /**@type {Fold[]} */
        folds: Fold[];
        range: Range;
        start: import("../../ace-internal").Ace.Point;
        end: import("../../ace-internal").Ace.Point;
        /**
         * Note: This doesn't update wrapData!
         * @param {number} shift
         */
        shiftRow(shift: number): void;
        /**
         * @param {Fold} fold
         */
        addFold(fold: Fold): void;
        /**
         * @param {number} row
         */
        containsRow(row: number): boolean;
        /**
         * @param {Function} callback
         * @param {number} endRow
         * @param {number} endColumn
         */
        walk(callback: Function, endRow: number, endColumn: number): void;
        /**
         * @param {number} row
         * @param {number} column
         * @return {{ fold: Fold, kind: string } | null}
         */
        getNextFoldTo(row: number, column: number): {
            fold: Fold;
            kind: string;
        } | null;
        /**
         * @param {number} row
         * @param {number} column
         * @param {number} len
         */
        addRemoveChars(row: number, column: number, len: number): void;
        /**
         * @param {number} row
         * @param {number} column
         * @return {FoldLine | null}
         */
        split(row: number, column: number): FoldLine | null;
        /**
         * @param {FoldLine} foldLineNext
         */
        merge(foldLineNext: FoldLine): void;
        toString(): string;
        /**
         * @param {number} idx
         * @return {import("../../ace-internal").Ace.Point}
         */
        idxToPosition(idx: number): import("../../ace-internal").Ace.Point;
    }
    import Range_9 = require("range");
    import Range = Range_9.Range;
}
declare module "lib/bidiutil" {
    export const ON_R: 3;
    export const AN: 4;
    export const R_H: 5;
    export const B: 6;
    export const RLE: 7;
    export const DOT: "·";
    export function doBidiReorder(text: string, textCharTypes: any[], isRtl: boolean): any;
    export function hasBidiCharacters(text: string, textCharTypes: any[]): boolean;
    export function getVisualFromLogicalIdx(logIdx: number, rowMap: any): number;
    export var L: number;
    export var R: number;
    export var EN: number;
}
declare module "bidihandler" {
    export type EditSession = import("edit_session").EditSession;
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
        session: import("edit_session").EditSession;
        bidiMap: {};
        currentRow: any;
        bidiUtil: typeof bidiUtil;
        charWidths: any[];
        EOL: string;
        showInvisibles: boolean;
        isRtlDir: boolean;
        $isRtl: boolean;
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
        onChange(delta: any): void;
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
    import bidiUtil = require("lib/bidiutil");
}
declare module "mode/text_highlight_rules" {
    /**@type {(new() => Partial<import("../../ace-internal").Ace.HighlightRules>) & {prototype: import("../../ace-internal").Ace.HighlightRules}}*/
    export var TextHighlightRules: (new () => Partial<import("../ace-internal").Ace.HighlightRules>) & {
        prototype: import("../ace-internal").Ace.HighlightRules;
    };
}
declare module "mode/behaviour" {
    export type IBehaviour = any;
    /**
     * @typedef {Behaviour & {[key: string]: any}} IBehaviour
     */
    /**@type {any}*/
    export var Behaviour: any;
}
declare module "mode/behaviour/cstyle" {
    /**
     * Creates a new Cstyle behaviour object with the specified options.
     * @constructor
     * @param {Object} [options] - The options for the Cstyle behaviour object.
     * @param {boolean} [options.braces] - Whether to force braces auto-pairing.
     * @param {boolean} [options.closeDocComment] - enables automatic insertion of closing tags for documentation comments.
     */
    export var CstyleBehaviour: any;
}
declare module "unicode" {
    export const wordChars: any;
}
declare module "mode/text" {
    export var Mode: any;
}
declare module "background_tokenizer" {
    const BackgroundTokenizer_base: undefined;
    /**
     * Tokenizes the current [[Document `Document`]] in the background, and caches the tokenized rows for future use.
     *
     * If a certain row is changed, everything below that row is re-tokenized.
     **/
    export class BackgroundTokenizer extends BackgroundTokenizer_base {
        /**
         * Creates a new `BackgroundTokenizer` object.
         * @param {Tokenizer} tokenizer The tokenizer to use
         * @param {EditSession} [session] The editor session to associate with
         **/
        constructor(tokenizer: Tokenizer, session?: EditSession);
        /**@type {false|number}*/
        running: false | number;
        lines: any[];
        states: any[];
        currentLine: number;
        tokenizer: import("tokenizer").Tokenizer;
        $worker: () => void;
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
        doc: import("document").Document;
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
         * @param {import("../ace-internal").Ace.Delta} delta
         */
        $updateOnChange(delta: import("../ace-internal").Ace.Delta): void;
        /**
         * Stops tokenizing.
         **/
        stop(): void;
        /**
         * Gives list of [[Token]]'s of the row. (tokens are cached)
         * @param {Number} row The row to get tokens at
         * @returns {import("../ace-internal").Ace.Token[]}
         **/
        getTokens(row: number): import("../ace-internal").Ace.Token[];
        /**
         * Returns the state of tokenization at the end of a row.
         * @param {Number} row The row to get state at
         * @returns {string}
         **/
        getState(row: number): string;
        /**
         * @param {number} row
         */
        $tokenizeRow(row: number): import("../ace-internal").Ace.Token[];
        cleanup(): void;
    }
    export type Document = import("document").Document;
    export type EditSession = import("edit_session").EditSession;
    export type Tokenizer = import("tokenizer").Tokenizer;
    export {};
}
declare module "edit_session/folding" {
    export type IFolding = import("edit_session").EditSession & import("../ace-internal").Ace.Folding;
    export type Delta = import("../ace-internal").Ace.Delta;
    /**
     * @typedef {import("../edit_session").EditSession & import("../../ace-internal").Ace.Folding} IFolding
     * @typedef {import("../../ace-internal").Ace.Delta } Delta
     */
    /**
     * @this {IFolding}
     * @type {IFolding}
     */
    export function Folding(this: IFolding): void;
    export class Folding {
        /**
         * Looks up a fold at a given row/column. Possible values for side:
         *   -1: ignore a fold if fold.start = row/column
         *   +1: ignore a fold if fold.end = row/column
         * @param {number} row
         * @param {number} column
         * @param {number} [side]
         * @return {Fold}
         **/
        getFoldAt: (row: number, column: number, side?: number) => Fold;
        /**
         * Returns all folds in the given range. Note, that this will return folds
         * @param {Range| Delta} range
         * @returns {Fold[]}
         **/
        getFoldsInRange: (range: import("../../ace-internal").Ace.Delta | Range) => Fold[];
        /**
         *
         * @param {Range[]|Range}ranges
         * @returns {Fold[]}
         */
        getFoldsInRangeList: (ranges: Range | Range[]) => Fold[];
        /**
         * Returns all folds in the document
         * @returns {Fold[]}
         */
        getAllFolds: () => Fold[];
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
         *  @param {number} row
         *  @param {number} column
         *  @param {number} [trim]
         *  @param {FoldLine} [foldLine]
         *  @returns {string | null}
         */
        getFoldStringAt: (row: number, column: number, trim?: number, foldLine?: FoldLine) => string;
        /**
         *
         * @param {number} docRow
         * @param {FoldLine} [startFoldLine]
         * @returns {null|FoldLine}
         */
        getFoldLine: (docRow: number, startFoldLine?: FoldLine) => FoldLine;
        /**
         * Returns the fold which starts after or contains docRow
         * @param {number} docRow
         * @param {FoldLine} [startFoldLine]
         * @returns {null|FoldLine}
         */
        getNextFoldLine: (docRow: number, startFoldLine?: FoldLine) => FoldLine;
        /**
         *
         * @param {number} first
         * @param {number} last
         * @return {number}
         */
        getFoldedRowCount: (first: number, last: number) => number;
        /**
         *
         * @param {FoldLine}foldLine
         * @return {FoldLine}
         */
        $addFoldLine: (foldLine: FoldLine) => FoldLine;
        /**
         * Adds a new fold.
         *
         * @param {Fold|string} placeholder
         * @param {Range} [range]
         * @returns {Fold}
         *      The new created Fold object or an existing fold object in case the
         *      passed in range fits an existing fold exactly.
         * @this {IFolding}
         */
        addFold: (placeholder: string | Fold, range?: Range) => Fold;
        /**
         * @param {Fold[]} folds
         */
        addFolds: (folds: Fold[]) => void;
        /**
         *
         * @param {Fold} fold
         */
        removeFold: (fold: Fold) => void;
        /**
         *
         * @param {Fold[]} folds
         */
        removeFolds: (folds: Fold[]) => void;
        /**
         * @param {Fold} fold
         */
        expandFold: (fold: Fold) => void;
        /**
         * @param {Fold[]}folds
         */
        expandFolds: (folds: Fold[]) => void;
        /**
         *
         * @param {number|null|import("../../ace-internal").Ace.Point|Range|Range[]} [location]
         * @param {boolean} [expandInner]
         * @return {Fold[]| undefined}
         */
        unfold: (location?: number | import("../../ace-internal").Ace.Point | Range | Range[], expandInner?: boolean) => Fold[];
        /**
         * Checks if a given documentRow is folded. This is true if there are some
         * folded parts such that some parts of the line is still visible.
         * @param {number} docRow
         * @param {FoldLine} [startFoldRow]
         * @returns {boolean}
         **/
        isRowFolded: (docRow: number, startFoldRow?: FoldLine) => boolean;
        /**
         *
         * @param {number} docRow
         * @param {FoldLine} [startFoldRow]
         * @return {number}
         */
        getRowFoldEnd: (docRow: number, startFoldRow?: FoldLine) => number;
        /**
         *
         * @param {number} docRow
         * @param {FoldLine} [startFoldRow]
         * @returns {number}
         */
        getRowFoldStart: (docRow: number, startFoldRow?: FoldLine) => number;
        /**
         *
         * @param {FoldLine} foldLine
         * @param {number | null} [endRow]
         * @param {number | null} [endColumn]
         * @param {number | null} [startRow]
         * @param {number | null} [startColumn]
         * @return {string}
         */
        getFoldDisplayLine: (foldLine: FoldLine, endRow?: number, endColumn?: number, startRow?: number, startColumn?: number) => string;
        /**
         *
         * @param {number} row
         * @param {number | null} endColumn
         * @param {number | null} startRow
         * @param {number | null} startColumn
         * @return {string}
         */
        getDisplayLine: (row: number, endColumn: number, startRow: number, startColumn: number) => string;
        /**
         * @return {FoldLine[]}
         */
        $cloneFoldData: () => FoldLine[];
        /**
         * @param {boolean} [tryToUnfold]
         */
        toggleFold: (tryToUnfold?: boolean) => void;
        /**
         *
         * @param {number} row
         * @param {number} column
         * @param {number} [dir]
         * @return {Range | undefined}
         */
        getCommentFoldRange: (row: number, column: number, dir?: number) => Range;
        /**
         *
         * @param {number | null} [startRow]
         * @param {number | null} [endRow]
         * @param {number | null} [depth]
         * @param {Function} [test]
         */
        foldAll: (startRow?: number, endRow?: number, depth?: number, test?: Function) => void;
        /**
         *
         * @param {number} level
         */
        foldToLevel: (level: number) => void;
        /**
         *
         */
        foldAllComments: () => void;
        $foldStyles: {
            manual: number;
            markbegin: number;
            markbeginend: number;
        };
        $foldStyle: string;
        /**
         * @param {string} style
         */
        setFoldStyle: (style: string) => void;
        /**
         * @param {import("../../ace-internal").Ace.FoldMode} foldMode
         */
        $setFolding: (foldMode: import("../../ace-internal").Ace.FoldMode) => void;
        /**
         * @param {number} row
         * @param {boolean} [ignoreCurrent]
         * @return {{range?: Range, firstRange?: Range}}
         */
        getParentFoldRangeData: (row: number, ignoreCurrent?: boolean) => {
            range?: Range;
            firstRange?: Range;
        };
        /**
         *
         * @param {number} row
         * @param {any} e
         */
        onFoldWidgetClick: (row: number, e: any) => void;
        /**
         *
         * @param {number} row
         * @param options
         * @return {Fold|*}
         */
        $toggleFoldWidget: (row: number, options: any) => any;
        /**
         *
         * @param {boolean} [toggleParent]
         */
        toggleFoldWidget: (toggleParent?: boolean) => void;
        /**
         * @param {Delta} delta
         */
        updateFoldWidgets: (delta: import("../../ace-internal").Ace.Delta) => void;
        /**
         * @param e
         */
        tokenizerUpdateFoldWidgets: (e: any) => void;
    }
    import Fold_1 = require("edit_session/fold");
    import Fold = Fold_1.Fold;
    import Range_10 = require("range");
    import Range = Range_10.Range;
    import FoldLine_1 = require("edit_session/fold_line");
    import FoldLine = FoldLine_1.FoldLine;
}
declare module "edit_session/bracket_match" {
    export type EditSession = import("edit_session").EditSession;
    export type Point = import("edit_session").Point;
    export function BracketMatch(): void;
    export class BracketMatch {
        /**
         *
         * @param {Point} position
         * @param {string} [chr]
         * @this {EditSession}
         */
        findMatchingBracket: (this: import("edit_session").EditSession, position: Point, chr?: string) => import("../../ace-internal").Ace.Point;
        /**
         * @param {Point} pos
         * @return {null|Range}
         * @this {EditSession}
         */
        getBracketRange: (this: import("edit_session").EditSession, pos: Point) => null | Range;
        /**
         * Returns:
         * * null if there is no any bracket at `pos`;
         * * two Ranges if there is opening and closing brackets;
         * * one Range if there is only one bracket
         *
         * @param {Point} pos
         * @param {boolean} [isBackwards]
         * @returns {null|Range[]}
         * @this {EditSession}
         */
        getMatchingBracketRanges: (this: import("edit_session").EditSession, pos: Point, isBackwards?: boolean) => null | Range[];
        $brackets: {
            ")": string;
            "(": string;
            "]": string;
            "[": string;
            "{": string;
            "}": string;
            "<": string;
            ">": string;
        };
        /**
         *
         * @param {string} bracket
         * @param {Point} position
         * @param {RegExp} [typeRe]
         * @return {Point|null}
         * @this {EditSession}
         */
        $findOpeningBracket: (this: import("edit_session").EditSession, bracket: string, position: Point, typeRe?: RegExp) => Point | null;
        /**
         *
         * @param {string} bracket
         * @param {Point} position
         * @param {RegExp} [typeRe]
         * @return {Point|null}
         * @this {EditSession}
         */
        $findClosingBracket: (this: import("edit_session").EditSession, bracket: string, position: Point, typeRe?: RegExp) => Point | null;
        /**
         * Returns [[Range]]'s for matching tags and tag names, if there are any
         * @param {Point} pos
         * @returns {{closeTag: Range, closeTagName: Range, openTag: Range, openTagName: Range} | undefined}
         * @this {EditSession}
         */
        getMatchingTags: (this: import("edit_session").EditSession, pos: Point) => {
            closeTag: Range;
            closeTagName: Range;
            openTag: Range;
            openTagName: Range;
        } | undefined;
        $findTagName: (iterator: any) => any;
        $findClosingTag: (iterator: any, token: any) => {
            openTag: Range;
            closeTag: Range;
            openTagName: Range;
            closeTagName: Range;
        };
        $findOpeningTag: (iterator: any, token: any) => {
            openTag: Range;
            closeTag: Range;
            openTagName: Range;
            closeTagName: Range;
        };
    }
    import Range_11 = require("range");
    import Range = Range_11.Range;
}
declare module "edit_session" {
    const EditSession_base: undefined;
    const EditSession_base_1: undefined;
    const EditSession_base_2: undefined;
    const EditSession_base_3: undefined;
    /**
     * @typedef TextMode
     * @type {SyntaxMode}
     */
    /**
     * Stores all the data about [[Editor `Editor`]] state providing easy way to change editors state.
     *
     * `EditSession` can be attached to only one [[Document `Document`]]. Same `Document` can be attached to several `EditSession`s.
     **/
    export class EditSession extends EditSession_base, EditSession_base_1, EditSession_base_2, EditSession_base_3 {
        /**
        * Returns a new instance of EditSession with state from JSON.
        * @method fromJSON
        * @param {string|object} session The EditSession state.
        * @returns {EditSession}
        */
        static fromJSON(session: string | object): EditSession;
        /**
         * Sets up a new `EditSession` and associates it with the given `Document` and `Mode`.
         * @param {Document | String} [text] [If `text` is a `Document`, it associates the `EditSession` with it. Otherwise, a new `Document` is created, with the initial text]{: #textParam}
         * @param {SyntaxMode} [mode] [The initial language mode to use for the document]{: #modeParam}
         **/
        constructor(text?: Document | string, mode?: SyntaxMode);
        /**@type {Document}*/ doc: Document;
        $breakpoints: any[];
        $decorations: any[];
        $frontMarkers: {};
        $backMarkers: {};
        $markerId: number;
        $undoSelect: boolean;
        id: string;
        bgTokenizer: BackgroundTokenizer;
        $onChange: any;
        selection: Selection;
        $bidiHandler: BidiHandler;
        destroyed: boolean;
        /**
         * Sets the `EditSession` to point to a new `Document`. If a `BackgroundTokenizer` exists, it also points to `doc`.
         *
         * @param {Document} doc The new `Document` to use
         *
         **/
        setDocument(doc: Document): void;
        /**
         * Returns the `Document` associated with this session.
         * @return {Document}
         **/
        getDocument(): Document;
        /**
         * @param {Number} docRow The row to work with
         *
         **/
        $resetRowCache(docRow: number): void;
        /** @type {number[]} */
        $docRowCache: number[];
        /** @type {number[]} */
        $screenRowCache: number[];
        $getRowCacheIndex(cacheArray: any, val: any): number;
        resetCaches(): void;
        $wrapData: any[];
        $rowLengthCache: any[];
        onChangeFold(e: any): void;
        /**
         *
         * @param {Delta} delta
         */
        onChange(delta: Delta): void;
        mergeUndoDeltas: boolean;
        /**
         * Sets the session text.
         * @param {String} text The new text to place
         **/
        setValue(text: string): void;
        /**
         * Returns the current edit session.
         * @method toJSON
         * @returns {Object}
         */
        toJSON(): any;
        /**
         * Returns selection object.
         * @returns {Selection}
         **/
        getSelection(): Selection;
        /**
         * {:BackgroundTokenizer.getState}
         * @param {Number} row The row to start at
         * @returns {string}
         * @related BackgroundTokenizer.getState
         **/
        getState(row: number): string;
        /**
         * Starts tokenizing at the row indicated. Returns a list of objects of the tokenized rows.
         * @param {Number} row The row to start at
         * @returns {import("../ace-internal").Ace.Token[]}
         **/
        getTokens(row: number): import("../ace-internal").Ace.Token[];
        /**
         * Returns an object indicating the token at the current row. The object has two properties: `index` and `start`.
         * @param {Number} row The row number to retrieve from
         * @param {Number} column The column number to retrieve from
         * @returns {import("../ace-internal").Ace.Token}
         *
         **/
        getTokenAt(row: number, column: number): import("../ace-internal").Ace.Token;
        /**
         * Sets the undo manager.
         * @param {UndoManager} undoManager The new undo manager
         **/
        setUndoManager(undoManager: UndoManager): void;
        $undoManager: UndoManager;
        $syncInformUndoManager: (() => void) | (() => void);
        $informUndoManager: {
            (timeout: any): void;
            delay(timeout: any): void;
            schedule: any;
            call(): void;
            cancel(): void;
            /**
             * Returns the `Document` associated with this session.
             * @return {Document}
             **/
            isPending(): any;
        };
        /**
         * starts a new group in undo history
         **/
        markUndoGroup(): void;
        /**
         * Returns the current undo manager.
         * @returns {UndoManager}
         **/
        getUndoManager(): UndoManager;
        /**
         * Returns the current value for tabs. If the user is using soft tabs, this will be a series of spaces (defined by [[EditSession.getTabSize `getTabSize()`]]); otherwise it's simply `'\t'`.
         * @returns {String}
         **/
        getTabString(): string;
        /**
         * Pass `true` to enable the use of soft tabs. Soft tabs means you're using spaces instead of the tab character (`'\t'`).
         * @param {Boolean} val Value indicating whether or not to use soft tabs
         **/
        setUseSoftTabs(val: boolean): void;
        /**
         * Returns `true` if soft tabs are being used, `false` otherwise.
         * @returns {Boolean}
         **/
        getUseSoftTabs(): boolean;
        /**
         * Set the number of spaces that define a soft tab; for example, passing in `4` transforms the soft tabs to be equivalent to four spaces. This function also emits the `changeTabSize` event.
         * @param {Number} tabSize The new tab size
         **/
        setTabSize(tabSize: number): void;
        /**
         * Returns the current tab size.
         * @return {number}
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
         * @returns {Boolean}
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
         * @returns {String[]}
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
         * @param {import("../ace-internal").Ace.MarkerRenderer | "fullLine" | "screenLine" | "text" | "line"} [type] Identify the renderer type of the marker. If string provided, corresponding built-in renderer is used. Supported string types are "fullLine", "screenLine", "text" or "line". If a Function is provided, that Function is used as renderer.
         * @param {Boolean} [inFront] Set to `true` to establish a front marker
         *
         * @return {Number} The new marker id
         **/
        addMarker(range: Range, clazz: string, type?: import("../ace-internal").Ace.MarkerRenderer | "fullLine" | "screenLine" | "text" | "line", inFront?: boolean): number;
        /**
         * Adds a dynamic marker to the session.
         * @param {import("../ace-internal").Ace.MarkerLike} marker object with update method
         * @param {Boolean} [inFront] Set to `true` to establish a front marker
         *
         * @return {import("../ace-internal").Ace.MarkerLike} The added marker
         **/
        addDynamicMarker(marker: import("../ace-internal").Ace.MarkerLike, inFront?: boolean): import("../ace-internal").Ace.MarkerLike;
        /**
         * Removes the marker with the specified ID. If this marker was in front, the `'changeFrontMarker'` event is emitted. If the marker was in the back, the `'changeBackMarker'` event is emitted.
         * @param {Number} markerId A number representing a marker
         **/
        removeMarker(markerId: number): void;
        /**
         * Returns an object containing all of the markers, either front or back.
         * @param {Boolean} [inFront] If `true`, indicates you only want front markers; `false` indicates only back markers
         *
         * @returns {{[id: number]: import("../ace-internal").Ace.MarkerLike}}
         **/
        getMarkers(inFront?: boolean): {
            [id: number]: import("../ace-internal").Ace.MarkerLike;
        };
        /**
         * @param {RegExp} re
         */
        highlight(re: RegExp): void;
        $searchHighlight: import("../ace-internal").Ace.MarkerLike;
        /**
         * experimental
         * @param {number} startRow
         * @param {number} endRow
         * @param {string} clazz
         * @param {boolean} [inFront]
         * @return {Range}
         */
        highlightLines(startRow: number, endRow: number, clazz: string, inFront?: boolean): Range;
        /**
         * Sets annotations for the `EditSession`. This functions emits the `'changeAnnotation'` event.
         * @param {import("../ace-internal").Ace.Annotation[]} annotations A list of annotations
         **/
        setAnnotations(annotations: import("../ace-internal").Ace.Annotation[]): void;
        $annotations: import("../ace-internal").Ace.Annotation[];
        /**
         * Returns the annotations for the `EditSession`.
         * @returns {import("../ace-internal").Ace.Annotation[]}
         **/
        getAnnotations(): import("../ace-internal").Ace.Annotation[];
        /**
         * Clears all the annotations for this session. This function also triggers the `'changeAnnotation'` event.
         **/
        clearAnnotations(): void;
        /**
         * If `text` contains either the newline (`\n`) or carriage-return ('\r') characters, `$autoNewLine` stores that value.
         * @param {String} text A block of text
         *
         **/
        $detectNewLine(text: string): void;
        $autoNewLine: string;
        /**
         * Given a starting row and column, this method returns the `Range` of the first word boundary it finds.
         * @param {Number} row The row to start at
         * @param {Number} column The column to start at
         *
         * @returns {Range}
         **/
        getWordRange(row: number, column: number): Range;
        /**
         * Gets the range of a word, including its right whitespace.
         * @param {Number} row The row number to start from
         * @param {Number} column The column number to start from
         *
         * @return {Range}
         **/
        getAWordRange(row: number, column: number): Range;
        /**
         * {:Document.setNewLineMode.desc}
         * @param {import("../ace-internal").Ace.NewLineMode} newLineMode {:Document.setNewLineMode.param}
         *
         *
         * @related Document.setNewLineMode
         **/
        setNewLineMode(newLineMode: import("../ace-internal").Ace.NewLineMode): void;
        /**
         *
         * Returns the current new line mode.
         * @returns {import("../ace-internal").Ace.NewLineMode}
         * @related Document.getNewLineMode
         **/
        getNewLineMode(): import("../ace-internal").Ace.NewLineMode;
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
         * Reloads all the tokens on the current session. This function calls [[BackgroundTokenizer.start `BackgroundTokenizer.start ()`]] to all the rows; it also emits the `'tokenizerUpdate'` event.
         **/
        onReloadTokenizer(e: any): void;
        /**
         * Sets a new text mode for the `EditSession`. This method also emits the `'changeMode'` event. If a [[BackgroundTokenizer `BackgroundTokenizer`]] is set, the `'tokenizerUpdate'` event is also emitted.
         * @param {SyntaxMode | string} mode Set a new text mode
         * @param {() => void} [cb] optional callback
         **/
        setMode(mode: SyntaxMode | string, cb?: () => void): void;
        $modeId: any;
        /**
         * @param mode
         * @param [$isPlaceholder]
         */
        $onChangeMode(mode: any, $isPlaceholder?: any): void;
        $mode: any;
        /**@type {RegExp}*/
        tokenRe: RegExp;
        /**@type {RegExp}*/
        nonTokenRe: RegExp;
        $stopWorker(): void;
        $worker: any;
        $startWorker(): void;
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
        $scrollTop: any;
        /**
         * [Returns the value of the distance between the top of the editor and the topmost part of the visible content.]{: #EditSession.getScrollTop}
         * @returns {Number}
         **/
        getScrollTop(): number;
        /**
         * [Sets the value of the distance between the left of the editor and the leftmost part of the visible content.]{: #EditSession.setScrollLeft}
         * @param {number} scrollLeft
         */
        setScrollLeft(scrollLeft: number): void;
        $scrollLeft: any;
        /**
         * [Returns the value of the distance between the left of the editor and the leftmost part of the visible content.]{: #EditSession.getScrollLeft}
         * @returns {Number}
         **/
        getScrollLeft(): number;
        /**
         * Returns the width of the screen.
         * @returns {Number}
         **/
        getScreenWidth(): number;
        /**
         * @return {number}
         */
        getLineWidgetMaxWidth(): number;
        lineWidgetWidth: number;
        /**
         * @param {boolean} [force]
         */
        $computeWidth(force?: boolean): any;
        screenWidth: any;
        /**
         * Returns a verbatim copy of the given line as it is in the document
         * @param {Number} row The row to retrieve from
         * @returns {String}
         **/
        getLine(row: number): string;
        /**
         * Returns an array of strings of the rows between `firstRow` and `lastRow`. This function is inclusive of `lastRow`.
         * @param {Number} firstRow The first row index to retrieve
         * @param {Number} lastRow The final row index to retrieve
         *
         * @returns {String[]}
         *
         **/
        getLines(firstRow: number, lastRow: number): string[];
        /**
         * Returns the number of rows in the document.
         * @returns {Number}
         **/
        getLength(): number;
        /**
         * {:Document.getTextRange.desc}
         * @param {IRange} [range] The range to work with
         *
         * @returns {String}
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
         * @param {Boolean} [dontSelect] [If `true`, doesn't select the range of where the change occured]{: #dontSelect}
         **/
        undoChanges(deltas: Delta[], dontSelect?: boolean): void;
        $fromUndo: boolean;
        /**
         * Re-implements a previously undone change to your document.
         * @param {Delta[]} deltas An array of previous changes
         * @param {Boolean} [dontSelect] {:dontSelect}
         **/
        redoChanges(deltas: Delta[], dontSelect?: boolean): void;
        /**
         * Enables or disables highlighting of the range where an undo occurred.
         * @param {Boolean} enable If `true`, selects the range of the reinserted change
         *
         **/
        setUndoSelect(enable: boolean): void;
        /**
         *
         * @param {Delta[]} deltas
         * @param {boolean} [isUndo]
         * @return {Range}
         */
        $getUndoSelection(deltas: Delta[], isUndo?: boolean): Range;
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
         * @param {boolean} [copy]
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
         *
         * @param {number} firstRow
         * @param {number} lastRow
         * @param [dir]
         * @returns {number}
         */
        $moveLines(firstRow: number, lastRow: number, dir?: any): number;
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
         * @param {number} row
         * @returns {number}
         */
        $clipRowToDocument(row: number): number;
        /**
         * @param {number} row
         * @param {number} column
         * @returns {number}
         */
        $clipColumnToRow(row: number, column: number): number;
        /**
         * @param {number} row
         * @param {number} column
         * @returns {Point}
         */
        $clipPositionToDocument(row: number, column: number): Point;
        /**
         * @param {Range} range
         * @returns {Range}
         */
        $clipRangeToDocument(range: Range): Range;
        /**
         * Sets whether or not line wrapping is enabled. If `useWrapMode` is different than the current value, the `'changeWrapMode'` event is emitted.
         * @param {Boolean} useWrapMode Enable (or disable) wrap mode
         **/
        setUseWrapMode(useWrapMode: boolean): void;
        $useWrapMode: any;
        /**
         * Returns `true` if wrap mode is being used; `false` otherwise.
         * @returns {Boolean}
         **/
        getUseWrapMode(): boolean;
        /**
         * Sets the boundaries of wrap. Either value can be `null` to have an unconstrained wrap, or, they can be the same number to pin the limit. If the wrap limits for `min` or `max` are different, this method also emits the `'changeWrapMode'` event.
         * @param {Number} min The minimum wrap value (the left side wrap)
         * @param {Number} max The maximum wrap value (the right side wrap)
         **/
        setWrapLimitRange(min: number, max: number): void;
        $wrapLimitRange: any;
        /**
         * This should generally only be called by the renderer when a resize is detected.
         * @param {Number} desiredLimit The new wrap limit
         * @param [$printMargin]
         * @returns {Boolean}
         **/
        adjustWrapLimit(desiredLimit: number, $printMargin?: any): boolean;
        $wrapLimit: any;
        /**
         *
         * @param {number} wrapLimit
         * @param {number} [min]
         * @param {number} [max]
         * @returns {number}
         */
        $constrainWrapLimit(wrapLimit: number, min?: number, max?: number): number;
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
         * @returns {{ min: number, max: number }}
         **/
        getWrapLimitRange(): {
            min: number;
            max: number;
        };
        /**
         * @param {Delta} delta
         */
        $updateInternalDataOnChange(delta: Delta): import("edit_session/fold").Fold[];
        $updating: boolean;
        /**
         * @param {number} firstRow
         * @param {number} lastRow
         */
        $updateRowLengthCache(firstRow: number, lastRow: number): void;
        /**
         * @param {number} firstRow
         * @param {number} lastRow
         */
        $updateWrapData(firstRow: number, lastRow: number): void;
        /**
         * @param {number[]}tokens
         * @param {number} wrapLimit
         * @param {number} tabSize
         * @returns {*[]}
         */
        $computeWrapSplits(tokens: number[], wrapLimit: number, tabSize: number): any[];
        /**
         * Given a string, returns an array of the display characters, including tabs and spaces.
         * @param {String} str The string to check
         * @param {Number} [offset] The value to start at
         * @returns {number[]}
         **/
        $getDisplayTokens(str: string, offset?: number): number[];
        /**
         * Calculates the width of the string `str` on the screen while assuming that the string starts at the first column on the screen.
         * @param {String} str The string to calculate the screen width of
         * @param {Number} [maxScreenColumn]
         * @param {Number} [screenColumn]
         * @returns {Number[]} Returns an `int[]` array with two elements:<br/>
         * The first position indicates the number of columns for `str` on screen.<br/>
         * The second value contains the position of the document column that this function read until.
         **/
        $getStringScreenWidth(str: string, maxScreenColumn?: number, screenColumn?: number): number[];
        /**
         * Returns number of screenrows in a wrapped line.
         * @param {Number} row The row number to check
         * @returns {Number}
         **/
        getRowLength(row: number): number;
        /**
         * @param {Number} row
         * @returns {Number}
         **/
        getRowLineCount(row: number): number;
        /**
         * @param {Number} screenRow
         * @returns {Number}
         **/
        getRowWrapIndent(screenRow: number): number;
        /**
         * Returns the position (on screen) for the last character in the provided screen row.
         * @param {Number} screenRow The screen row to check
         * @returns {Number}
         *
         * @related EditSession.documentToScreenColumn
         **/
        getScreenLastRowColumn(screenRow: number): number;
        /**
         * For the given document row and column, this returns the column position of the last screen row.
         * @param {Number} docRow
         * @param {Number} docColumn
         * @returns {number}
         **/
        getDocumentLastRowColumn(docRow: number, docColumn: number): number;
        /**
         * For the given document row and column, this returns the document position of the last row.
         * @param {Number} docRow
         * @param {Number} docColumn
         * @returns {Point}
         **/
        getDocumentLastRowColumnPosition(docRow: number, docColumn: number): Point;
        /**
         * For the given row, this returns the split data.
         * @param {number} row
         * @returns {String | undefined}
         */
        getRowSplitData(row: number): string | undefined;
        /**
         * The distance to the next tab stop at the specified screen column.
         * @param {Number} screenColumn The screen column to check
         *
         * @returns {Number}
         **/
        getScreenTabSize(screenColumn: number): number;
        /**
         * @param {number} screenRow
         * @param {number} screenColumn
         * @returns {number}
         */
        screenToDocumentRow(screenRow: number, screenColumn: number): number;
        /**
         * @param {number} screenRow
         * @param {number} screenColumn
         * @returns {number}
         */
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
         * @param {Number|Point} row
         * @param {Number} [docColumn]
         * @returns {Number}
         **/
        documentToScreenColumn(row: number | Point, docColumn?: number): number;
        /**
         * For the given document row and column, returns the screen row.
         * @param {Number|Point} docRow
         * @param {Number} [docColumn]
         * @returns {number}
         **/
        documentToScreenRow(docRow: number | Point, docColumn?: number): number;
        /**
         * Returns the length of the screen.
         * @returns {Number}
         **/
        getScreenLength(): number;
        /**
         * @param {FontMetrics} fm
         */
        $setFontMetrics(fm: FontMetrics): void;
        destroy(): void;
        $modes: {};
        /**
         * Returns the current [[Document `Document`]] as a string.
         * @method getValue
         * @returns {String}
         * @alias EditSession.toString
         **/
        getValue: () => string;
        $defaultUndoManager: {
            undo: () => void;
            redo: () => void;
            hasUndo: () => void;
            hasRedo: () => void;
            reset: () => void;
            add: () => void;
            addSelection: () => void;
            startNewGroup: () => void;
            addSession: () => void;
        };
        $overwrite: boolean;
        /**
         *
         * @type {null | import("../ace-internal").Ace.LineWidget[]}
         */
        lineWidgets: null | import("../ace-internal").Ace.LineWidget[];
        isFullWidth: typeof isFullWidth;
        $highlightLineMarker?: {
            start: import("../ace-internal").Ace.Point;
            end: import("../ace-internal").Ace.Point;
            id?: number;
        };
        $useSoftTabs?: boolean;
        $tabSize?: number;
        $useWorker?: boolean;
        $wrapAsCode?: boolean;
        $indentedSoftWrap?: boolean;
        widgetManager?: any;
        $bracketHighlight?: any;
        $selectionMarker?: number;
        curOp?: {
            [key: string]: any;
            command: {};
            args: string;
            scrollTop: number;
        };
        lineWidgetsWidth?: number;
        $getWidgetScreenLength?: () => number;
        _changedWidgets?: any;
        $options: any;
        $wrapMethod?: any;
        $enableVarChar?: any;
        $wrap?: any;
        $navigateWithinSoftTabs?: boolean;
        getSelectionMarkers(): any[];
        $selectionMarkers?: any[];
        gutterRenderer?: any;
        $firstLineNumber?: number;
        $emacsMark?: any;
        selectionMarkerCount?: number;
        multiSelect?: any;
        $occurHighlight?: any;
        $occur?: import("occur").Occur;
        $occurMatchingLines?: any;
        $useEmacsStyleLineStart?: boolean;
        $selectLongWords?: boolean;
    }
    namespace EditSession {
        export { $uid };
    }
    export type FontMetrics = import("layer/font_metrics").FontMetrics;
    export type FoldLine = import("edit_session/fold_line").FoldLine;
    export type Point = import("../ace-internal").Ace.Point;
    export type Delta = import("../ace-internal").Ace.Delta;
    export type IRange = import("../ace-internal").Ace.IRange;
    export type SyntaxMode = import("../ace-internal").Ace.SyntaxMode;
    export type TextMode = SyntaxMode;
    import Document_1 = require("document");
    import Document = Document_1.Document;
    import BackgroundTokenizer_1 = require("background_tokenizer");
    import BackgroundTokenizer = BackgroundTokenizer_1.BackgroundTokenizer;
    import Selection_1 = require("selection");
    import Selection = Selection_1.Selection;
    import BidiHandler_1 = require("bidihandler");
    import BidiHandler = BidiHandler_1.BidiHandler;
    import UndoManager_1 = require("undomanager");
    import UndoManager = UndoManager_1.UndoManager;
    import Range_12 = require("range");
    import Range = Range_12.Range;
    import TextMode_1 = require("mode/text");
    import TextMode = TextMode_1.Mode;
    function isFullWidth(c: any): boolean;
    var $uid: number;
    export {};
}
declare module "range" {
    /**
     * @typedef {import("./edit_session").EditSession} EditSession
     * @typedef {import("../ace-internal").Ace.IRange} IRange
     * @typedef {import("../ace-internal").Ace.Point} Point
     */
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
        /**@type {Point}*/
        start: Point;
        /**@type {Point}*/
        end: Point;
        /**
         * Returns `true` if and only if the starting row and column, and ending row and column, are equivalent to those given by `range`.
         * @param {IRange} range A range to check against
         * @return {Boolean}
         **/
        isEqual(range: IRange): boolean;
        /**
         * Returns a string containing the range's row and column information, given like this:
         * ```
         *    [start.row/start.column] -> [end.row/end.column]
         * ```
         * @return {String}
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
         * @returns {Boolean}
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
         * @returns {Number}
         **/
        comparePoint(p: Point): number;
        /**
         * Checks the start and end [[Point]]'s of `range` and compares them to the calling range. Returns `true` if the `range` is contained within the caller's range.
         * @param {IRange} range A range to compare with
         * @returns {Boolean}
         * @related [[Range.comparePoint]]
         **/
        containsRange(range: IRange): boolean;
        /**
         * Returns `true` if passed in `range` intersects with the one calling this method.
         * @param {IRange} range A range to compare with
         * @returns {Boolean}
         **/
        intersects(range: IRange): boolean;
        /**
         * Returns `true` if the caller's ending row is the same as `row`, and if the caller's ending column is the same as `column`.
         * @param {Number} row A row to compare with
         * @param {Number} column A column to compare with
         * @returns {Boolean}
         **/
        isEnd(row: number, column: number): boolean;
        /**
         * Returns `true` if the caller's starting row is the same as `row`, and if the caller's starting column is the same as `column`.
         * @param {Number} row A row to compare with
         * @param {Number} column A column to compare with
         * @returns {Boolean}
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
         * @returns {Boolean}
         * @related [[Range.compare]]
         **/
        inside(row: number, column: number): boolean;
        /**
         * Returns `true` if the `row` and `column` are within the given range's starting [[Point]].
         * @param {Number} row A row to compare with
         * @param {Number} column A column to compare with
         * @returns {Boolean}
         * @related [[Range.compare]]
         **/
        insideStart(row: number, column: number): boolean;
        /**
         * Returns `true` if the `row` and `column` are within the given range's ending [[Point]].
         * @param {Number} row A row to compare with
         * @param {Number} column A column to compare with
         * @returns {Boolean}
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
         * @returns {Range}
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
         * @returns {Boolean}
         **/
        isEmpty(): boolean;
        /**
         * Returns `true` if the range spans across multiple lines.
         * @returns {Boolean}
        **/
        isMultiLine(): boolean;
        /**
         * Returns a duplicate of the calling range.
         * @returns {Range}
        **/
        clone(): Range;
        /**
         * Returns a range containing the starting and ending rows of the original range, but with a column value of `0`.
         * @returns {Range}
        **/
        collapseRows(): Range;
        /**
         * Given the current `Range`, this function converts those starting and ending [[Point]]'s into screen positions, and then returns a new `Range` object.
         * @param {EditSession} session The `EditSession` to retrieve coordinates from
         * @returns {Range}
        **/
        toScreenRange(session: EditSession): Range;
        /**
         * Shift the calling range by `row` and `column` values.
         * @param {Number} row
         * @param {Number} column
         * @experimental
         */
        moveBy(row: number, column: number): void;
        id?: number;
        cursor?: import("../ace-internal").Ace.Point;
        isBackwards?: boolean;
    }
    namespace Range {
        export { fromPoints, comparePoints };
    }
    export type EditSession = import("edit_session").EditSession;
    export type IRange = import("../ace-internal").Ace.IRange;
    export type Point = import("../ace-internal").Ace.Point;
    /**
     * Creates and returns a new `Range` based on the `start` [[Point]] and `end` [[Point]] of the given parameters.
     * @param {Point} start A starting point to use
     * @param {Point} end An ending point to use
     * @returns {Range}
    **/
    function fromPoints(start: Point, end: Point): Range;
    /**
     * Compares `p1` and `p2` [[Point]]'s, useful for sorting
     * @param {Point} p1
     * @param {Point} p2
     * @returns {Number}
     */
    function comparePoints(p1: Point, p2: Point): number;
    export {};
}
declare module "worker/worker_client" {
    export var WorkerClient: any;
}
declare module "placeholder" {
    const PlaceHolder_base: undefined;
    export class PlaceHolder extends PlaceHolder_base {
        /**
         * @param {EditSession} session
         * @param {Number} length
         * @param {import("../ace-internal").Ace.Point} pos
         * @param {any[]} others
         * @param {String} mainClass
         * @param {String} othersClass
         **/
        constructor(session: EditSession, length: number, pos: import("../ace-internal").Ace.Point, others: any[], mainClass: string, othersClass: string);
        length: number;
        session: import("edit_session").EditSession;
        doc: import("document").Document;
        mainClass: string;
        othersClass: string;
        $onUpdate: any;
        $others: any[];
        $onCursorChange: () => void;
        $pos: import("../ace-internal").Ace.Point;
        $undoStackDepth: any;
        /**
         * PlaceHolder.setup()
         *
         * TODO
         *
         **/
        setup(): void;
        selectionBefore: Range | Range[];
        pos: import("anchor").Anchor;
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
        /**
         * PlaceHolder@onUpdate(e)
         *
         * Emitted when the place holder updates.
         * @param {import("../ace-internal").Ace.Delta} delta
         */
        onUpdate(delta: import("../ace-internal").Ace.Delta): void;
        $updating: boolean;
        /**
         * @param {import("../ace-internal").Ace.Delta} delta
         */
        updateAnchors(delta: import("../ace-internal").Ace.Delta): void;
        updateMarkers(): void;
        /**
         * PlaceHolder@onCursorChange(e)
         *
         * Emitted when the cursor changes.
         * @param {any} [event]
         */
        onCursorChange(event?: any): void;
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
    export type EditSession = import("edit_session").EditSession;
    import Range_13 = require("range");
    import Range = Range_13.Range;
    export {};
}
declare module "mouse/multi_select_handler" {
    export function onMouseDown(e: any): any;
}
declare module "commands/multi_select_commands" {
    export const defaultCommands: import("../ace-internal").Ace.Command[];
    export const multiSelectCommands: import("../ace-internal").Ace.Command[];
    export const keyboardHandler: HashHandler;
    import HashHandler_4 = require("keyboard/hash_handler");
    import HashHandler = HashHandler_4.HashHandler;
}
declare module "multi_select" {
    export const commands: import("../ace-internal").Ace.Command[];
    export const onSessionChange: (e: any) => void;
    export type Anchor = import("anchor").Anchor;
    export type Point = import("../ace-internal").Ace.Point;
    export type ScreenCoordinates = import("../ace-internal").Ace.ScreenCoordinates;
    /**
     * @param {Editor} editor
     */
    export function MultiSelect(editor: Editor): void;
    import Editor_4 = require("editor");
    import Editor = Editor_4.Editor;
}
declare module "mode/folding/fold_mode" {
    export function FoldMode(): void;
}
declare module "ext/error_marker" {
    export function showErrorMarker(editor: import("editor").Editor, dir: number): void;
}
declare module "ace" {
    export const config: {
        $defaultOptions: {};
        defineOptions(obj: any, path: string, options: {
            [key: string]: any;
        }): import("lib/app_config").AppConfig;
        resetOptions(obj: any): void;
        setDefaultValue(path: string, name: string, value: any): boolean;
        setDefaultValues(path: string, optionHash: {
            [key: string]: any;
        }): void;
        setMessages(value: any): void;
        nls(string: string, params?: {
            [x: string]: any;
        }): any;
        warn: (message: any, ...args: any[]) => void;
        reportError: (msg: any, data: any) => void;
        once<K extends string | number | symbol>(name: K, callback: any): void;
        setDefaultHandler(name: string, callback: Function): void;
        removeDefaultHandler(name: string, callback: Function): void;
        on<K_1 extends string | number | symbol>(name: K_1, callback: any, capturing?: boolean): any;
        addEventListener<K_2 extends string | number | symbol>(name: K_2, callback: any, capturing?: boolean): any;
        off<K_3 extends string | number | symbol>(name: K_3, callback: any): void;
        removeListener<K_4 extends string | number | symbol>(name: K_4, callback: any): void;
        removeEventListener<K_5 extends string | number | symbol>(name: K_5, callback: any): void;
        removeAllListeners(name?: string): void;
        _signal(eventName: string, e: any): void;
        _emit(eventName: string, e: any): void;
        _dispatchEvent(eventName: string, e: any): void;
        get: (key: string) => any;
        set: (key: string, value: any) => void;
        all: () => {
            [key: string]: any;
        };
        $modes: {};
        moduleUrl: (name: string, component?: string) => string;
        setModuleUrl: (name: string, subst: string) => string;
        setLoader: (cb: (moduleName: string, afterLoad: (err: Error, module: unknown) => void) => void) => void;
        dynamicModules: any;
        $loading: {};
        $loaded: {};
        loadModule: (moduleId: string | [string, string], onLoad: (module: any) => void) => void;
        $require: (moduleName: any) => any;
        setModuleLoader: (moduleName: any, onLoad: any) => void;
        version: "1.32.2";
    };
    export function edit(el: string | (HTMLElement & {
        env?;
        value?;
    }), options?: any): Editor;
    export function createEditSession(text: import("document").Document | string, mode?: import("../ace-internal").Ace.SyntaxMode): EditSession;
    import Editor_5 = require("editor");
    import Editor = Editor_5.Editor;
    import EditSession_3 = require("edit_session");
    import EditSession = EditSession_3.EditSession;
    import Range_14 = require("range");
    import Range = Range_14.Range;
    import UndoManager_2 = require("undomanager");
    import UndoManager = UndoManager_2.UndoManager;
    import Renderer_1 = require("virtual_renderer");
    import Renderer = Renderer_1.VirtualRenderer;
    export { Range, Editor, EditSession, UndoManager, Renderer as VirtualRenderer, version };
}
declare module "commands/occur_commands" {
    export namespace occurStartCommand {
        let name: string;
        function exec(editor: any, options: any): void;
        let readOnly: boolean;
    }
}
declare module "commands/incremental_search_commands" {
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
        $iSearch: any;
    }
}
declare module "incremental_search" {
    /**
     * Implements immediate searching while the user is typing. When incremental
     * search is activated, keystrokes into the editor will be used for composing
     * a search term. Immediately after every keystroke the search is updated:
     * - so-far-matching characters are highlighted
     * - the cursor is moved to the next match
     *
     **/
    export class IncrementalSearch extends Search {
        $options: {
            wrap: boolean;
            skipCurrent: boolean;
        };
        $keyboardHandler: iSearchCommandModule.IncrementalSearchKeyboardHandler;
        /**
         * @param {boolean} backwards
         */
        activate(editor: any, backwards: boolean): void;
        $editor: any;
        $startPos: any;
        $currentPos: any;
        $originalEditorOnPaste: any;
        $mousedownHandler: any;
        /**
         * @param {boolean} [reset]
         */
        deactivate(reset?: boolean): void;
        /**
         * @param {Editor} editor
         */
        selectionFix(editor: Editor): void;
        /**
         * @param {RegExp} regexp
         */
        highlight(regexp: RegExp): void;
        /**
         * @param {boolean} [reset]
         */
        cancelSearch(reset?: boolean): Range;
        $prevNeedle: any;
        /**
         * @param {boolean} moveToNext
         * @param {Function} needleUpdateFunc
         */
        highlightAndFindWithNeedle(moveToNext: boolean, needleUpdateFunc: Function): false | Range;
        /**
         * @param {string} s
         */
        addString(s: string): false | Range;
        /**
         * @param {any} c
         */
        removeChar(c: any): false | Range;
        next(options: any): false | Range;
        onMouseDown(evt: any): boolean;
        /**
         * @param {string} text
         */
        onPaste(text: string): void;
        convertNeedleToRegExp(): false | Range;
        convertNeedleToString(): false | Range;
        statusMessage(found: any): void;
        message(msg: any): void;
    }
    import Search_3 = require("search");
    import Search = Search_3.Search;
    import iSearchCommandModule = require("commands/incremental_search_commands");
    import Editor_6 = require("editor");
    import Editor = Editor_6.Editor;
    import Range_15 = require("range");
    import Range = Range_15.Range;
}
declare module "split" {
    export type ISplit = import("../ace-internal").Ace.EventEmitter<any> & {
        [key: string]: any;
    };
    /**
     * @typedef {import("../ace-internal").Ace.EventEmitter & {[key: string]: any}} ISplit
     */
    export var Split: any;
}
declare module "tokenizer_dev" {
    export class Tokenizer extends BaseTokenizer {
        /**
         * Returns an object containing two properties: `tokens`, which contains all the tokens; and `state`, the current state.
         * @returns {Object}
         **/
        getLineTokens(line: any, startState: any): any;
    }
    import BaseTokenizer_1 = require("tokenizer");
    import BaseTokenizer = BaseTokenizer_1.Tokenizer;
}
declare module "ext/beautify" {
    export const singletonTags: string[];
    export const blockTags: string[];
    export const formatOptions: {
        lineBreaksAfterCommasInCurlyBlock?: boolean;
    };
    export function beautify(session: import("edit_session").EditSession): void;
    export const commands: {
        name: string;
        description: string;
        exec: (editor: any) => void;
        bindKey: string;
    }[];
}
declare module "ext/code_lens" {
    export function setLenses(session: EditSession, lenses: any): number;
    export function registerCodeLensProvider(editor: import("editor").Editor, codeLensProvider: any): void;
    export function clear(session: EditSession): void;
    export type EditSession = import("edit_session").EditSession;
    export type VirtualRenderer = import("virtual_renderer").VirtualRenderer & {
        $textLayer: import("layer/text").Text & {
            $lenses;
        };
    };
}
declare module "ext/emmet" {
    export const commands: HashHandler;
    export function runEmmetCommand(editor: Editor): number | boolean;
    export function updateCommands(editor: Editor, enabled?: boolean): void;
    export function isSupportedMode(mode: any): boolean;
    export function isAvailable(editor: Editor, command: string): boolean;
    export function load(cb: any): boolean;
    export function setCore(e: any): void;
    import HashHandler_5 = require("keyboard/hash_handler");
    import HashHandler = HashHandler_5.HashHandler;
    import Editor_7 = require("editor");
    import Editor = Editor_7.Editor;
    /**
     * Implementation of {@link IEmmetEditor} interface for Ace
     */
    export class AceEmmetEditor {
        /**
         * @param {Editor} editor
         */
        setupContext(editor: Editor): void;
        ace: Editor;
        indentation: string;
        $syntax: string;
        /**
         * Returns character indexes of selected text: object with <code>start</code>
         * and <code>end</code> properties. If there's no selection, should return
         * object with <code>start</code> and <code>end</code> properties referring
         * to current caret position
         * @return {Object}
         * @example
         * var selection = editor.getSelectionRange();
         * alert(selection.start + ', ' + selection.end);
         */
        getSelectionRange(): any;
        /**
         * Creates selection from <code>start</code> to <code>end</code> character
         * indexes. If <code>end</code> is ommited, this method should place caret
         * and <code>start</code> index
         * @param {Number} start
         * @param {Number} [end]
         * @example
         * editor.createSelection(10, 40);
         *
         * //move caret to 15th character
         * editor.createSelection(15);
         */
        createSelection(start: number, end?: number): void;
        /**
         * Returns current line's start and end indexes as object with <code>start</code>
         * and <code>end</code> properties
         * @return {Object}
         * @example
         * var range = editor.getCurrentLineRange();
         * alert(range.start + ', ' + range.end);
         */
        getCurrentLineRange(): any;
        /**
         * Returns current caret position
         * @return {Number|null}
         */
        getCaretPos(): number | null;
        /**
         * Set new caret position
         * @param {Number} index Caret position
         */
        setCaretPos(index: number): void;
        /**
         * Returns content of current line
         * @return {String}
         */
        getCurrentLine(): string;
        /**
         * Replace editor's content or it's part (from <code>start</code> to
         * <code>end</code> index). If <code>value</code> contains
         * <code>caret_placeholder</code>, the editor will put caret into
         * this position. If you skip <code>start</code> and <code>end</code>
         * arguments, the whole target's content will be replaced with
         * <code>value</code>.
         *
         * If you pass <code>start</code> argument only,
         * the <code>value</code> will be placed at <code>start</code> string
         * index of current content.
         *
         * If you pass <code>start</code> and <code>end</code> arguments,
         * the corresponding substring of current target's content will be
         * replaced with <code>value</code>.
         * @param {String} value Content you want to paste
         * @param {Number} [start] Start index of editor's content
         * @param {Number} [end] End index of editor's content
         * @param {Boolean} [noIndent] Do not auto indent <code>value</code>
         */
        replaceContent(value: string, start?: number, end?: number, noIndent?: boolean): void;
        /**
         * Returns editor's content
         * @return {String}
         */
        getContent(): string;
        /**
         * Returns current editor's syntax mode
         * @return {String}
         */
        getSyntax(): string;
        /**
         * Returns current output profile name (@see emmet#setupProfile)
         * @return {String}
         */
        getProfileName(): string;
        /**
         * Ask user to enter something
         * @param {String} title Dialog title
         * @return {String} Entered data
         * @since 0.65
         */
        prompt(title: string): string;
        /**
         * Returns current selection
         * @return {String}
         * @since 0.65
         */
        getSelection(): string;
        /**
         * Returns current editor's file path
         * @return {String}
         * @since 0.65
         */
        getFilePath(): string;
        /**
         * @param {string} value
         */
        $updateTabstops(value: string): string;
    }
}
declare module "ext/hardwrap" {
    /**
     * @param {import("../editor").Editor} editor
     * @param {import("../../ace-internal").Ace.HardWrapOptions} options
     */
    export function hardWrap(editor: import("editor").Editor, options: import("../ace-internal").Ace.HardWrapOptions): void;
}
declare module "ext/menu_tools/settings_menu.css" {
    const _exports: string;
    export = _exports;
}
declare module "ext/menu_tools/overlay_page" {
    export function overlayPage(editor: any, contentElement: HTMLElement, callback?: any): {
        close: () => void;
        setIgnoreFocusOut: (ignore: boolean) => void;
    };
}
declare module "ext/menu_tools/get_editor_keyboard_shortcuts" {
    export function getEditorKeybordShortcuts(editor: import("editor").Editor): any[];
}
declare module "ext/keybinding_menu" {
    export function init(editor: Editor): void;
    import Editor_8 = require("editor");
    import Editor = Editor_8.Editor;
}
declare module "ext/linking" {
    export const previousLinkingHover: any;
    export { token as previousLinkingHover };
    var token: any;
}
declare module "ext/modelist" {
    /**
     * Suggests a mode based on the file extension present in the given path
     * @param {string} path The path to the file
     * @returns {Mode} Returns an object containing information about the
     *  suggested mode.
     */
    export function getModeForPath(path: string): Mode;
    export var modes: any[];
    export var modesByName: {};
    class Mode {
        /**
         * @param {string} name
         * @param {string} caption
         * @param {string} extensions
         */
        constructor(name: string, caption: string, extensions: string);
        name: string;
        caption: string;
        mode: string;
        extensions: string;
        extRe: RegExp;
        /**
         * @param {string} filename
         */
        supportsFile(filename: string): RegExpMatchArray;
    }
    export {};
}
declare module "ext/themelist" {
    export const themesByName: {};
    export const themes: {
        caption: string;
        theme: string;
        isDark: boolean;
        name: string;
    }[];
}
declare module "ext/options" {
    const OptionPanel_base: undefined;
    export class OptionPanel extends OptionPanel_base {
        /**
         *
         * @param {Editor} editor
         * @param {HTMLElement} [element]
         */
        constructor(editor: Editor, element?: HTMLElement);
        editor: import("editor").Editor;
        container: HTMLElement;
        groups: any[];
        options: {};
        add(config: any): void;
        render(): void;
        renderOptionGroup(group: any): any[];
        /**
         * @param {string} key
         * @param {Object} option
         */
        renderOptionControl(key: string, option: any): any;
        /**
         *
         * @param key
         * @param option
         */
        renderOption(key: any, option: any): (string | any[] | {
            class: string;
        })[];
        /**
         * @param {string | number | Object} option
         * @param {string | number | boolean} value
         */
        setOption(option: string | number | any, value: string | number | boolean): void;
        getOption(option: any): any;
    }
    export type Editor = import("editor").Editor;
    export {};
}
declare module "ext/prompt" {
    export type PromptOptions = {
        /**
         * Prompt name.
         */
        name: string;
        /**
         * Use prompt of specific type (gotoLine|commands|modes or default if empty).
         */
        $type: string;
        /**
         * Defines which part of the predefined value should be highlited.
         */
        selection: [start: number, end: number];
        /**
         * Set to true if prompt has description below input box.
         */
        hasDescription: boolean;
        /**
         * Description below input box.
         */
        prompt: string;
        /**
         * Placeholder for value.
         */
        placeholder: string;
        /**
         * Specific rules for input like password or regexp.
         */
        $rules: any;
        /**
         * Set to true to keep the prompt open when focus moves to another part of the editor.
         */
        ignoreFocusOut: boolean;
        /**
         * Function for defining list of options for value.
         */
        getCompletions: Function;
        /**
         * Function for defining current value prefix.
         */
        getPrefix: Function;
        /**
         * Function called when Enter is pressed.
         */
        onAccept: Function;
        /**
         * Function called when input is added to prompt input box.
         */
        onInput: Function;
        /**
         * Function called when Esc|Shift-Esc is pressed.
         */
        onCancel: Function;
        /**
         * Function for defining history list.
         */
        history: Function;
        maxHistoryCount: number;
        addToHistory: Function;
    };
    export type Editor = import("editor").Editor;
    /**
     * @typedef PromptOptions
     * @property {String} name             Prompt name.
     * @property {String} $type            Use prompt of specific type (gotoLine|commands|modes or default if empty).
     * @property {[start: number, end: number]} selection  Defines which part of the predefined value should be highlited.
     * @property {Boolean} hasDescription  Set to true if prompt has description below input box.
     * @property {String} prompt           Description below input box.
     * @property {String} placeholder      Placeholder for value.
     * @property {Object} $rules           Specific rules for input like password or regexp.
     * @property {Boolean} ignoreFocusOut  Set to true to keep the prompt open when focus moves to another part of the editor.
     * @property {Function} getCompletions Function for defining list of options for value.
     * @property {Function} getPrefix      Function for defining current value prefix.
     * @property {Function} onAccept       Function called when Enter is pressed.
     * @property {Function} onInput        Function called when input is added to prompt input box.
     * @property {Function} onCancel       Function called when Esc|Shift-Esc is pressed.
     * @property {Function} history        Function for defining history list.
     * @property {number} maxHistoryCount
     * @property {Function} addToHistory
     */
    /**
     * Prompt plugin is used for getting input from user.
     *
     * @param {Editor} editor                   Ouside editor related to this prompt. Will be blurred when prompt is open.
     * @param {String | Partial<PromptOptions>} message                  Predefined value of prompt input box.
     * @param {Partial<PromptOptions>} options                  Cusomizable options for this prompt.
     * @param {Function} [callback]               Function called after done.
     * */
    export function prompt(editor: Editor, message: string | Partial<PromptOptions>, options: Partial<PromptOptions>, callback?: Function): any;
    export namespace prompt {
        /**
         *
         * @param {Editor} editor
         * @param {Function} [callback]
         */
        function gotoLine(editor: import("editor").Editor, callback?: Function): void;
        /**
         *
         * @param {Editor} editor
         * @param {Function} [callback]
         */
        function commands(editor: import("editor").Editor, callback?: Function): void;
        /**
         *
         * @param {Editor} editor
         * @param {Function} [callback]
         */
        function modes(editor: import("editor").Editor, callback?: Function): void;
    }
}
declare module "ext/rtl" {
    export {};
}
declare module "ext/settings_menu" {
    export function init(): void;
}
declare module "ext/simple_tokenizer" {
    /**
     * Parses provided content according to provided highlighting rules and return tokens.
     * Tokens either have the className set according to Ace themes or have no className if they are just pure text tokens.
     * Result is a list of list of tokens, where each line from the provided content is a separate list of tokens.
     *
     * @param {string} content to tokenize
     * @param {import("../../ace-internal").Ace.HighlightRules} highlightRules defining the language grammar
     * @returns {import("../../ace-internal").Ace.TokenizeResult} tokenization result containing a list of token for each of the lines from content
     */
    export function tokenize(content: string, highlightRules: import("../ace-internal").Ace.HighlightRules): import("../ace-internal").Ace.TokenizeResult;
}
declare module "ext/spellcheck" {
    export function contextMenuHandler(e: any): void;
}
declare module "ext/split" {
    const _exports: typeof import("split");
    export = _exports;
}
declare module "ext/static-css" {
    const _exports: string;
    export = _exports;
}
declare module "ext/static_highlight" {
    export = highlight;
    /**
     *
     * @param {HTMLElement} el
     * @param opts
     * @param [callback]
     * @returns {boolean}
     */
    function highlight(el: HTMLElement, opts: any, callback?: any): boolean;
    namespace highlight {
        export { render, renderSync, highlight };
    }
    /**
     * Transforms a given input code snippet into HTML using the given mode
     *
     * @param {string} input Code snippet
     * @param {string|import("../../ace-internal").Ace.SyntaxMode} mode String specifying the mode to load such as
     *  `ace/mode/javascript` or, a mode loaded from `/ace/mode`
     *  (use 'ServerSideHiglighter.getMode').
     * @param {string} theme String specifying the theme to load such as
     *  `ace/theme/twilight` or, a theme loaded from `/ace/theme`.
     * @param {number} lineStart A number indicating the first line number. Defaults
     *  to 1.
     * @param {boolean} disableGutter Specifies whether or not to disable the gutter.
     *  `true` disables the gutter, `false` enables the gutter. Defaults to `false`.
     * @param {function} [callback] When specifying the mode or theme as a string,
     *  this method has no return value and you must specify a callback function. The
     *  callback will receive the rendered object containing the properties `html`
     *  and `css`.
     * @returns {object} An object containing the properties `html` and `css`.
     */
    function render(input: string, mode: string | import("../ace-internal").Ace.SyntaxMode, theme: string, lineStart: number, disableGutter: boolean, callback?: Function): object;
    /**
     * Transforms a given input code snippet into HTML using the given mode
     * @param {string} input Code snippet
     * @param {import("../../ace-internal").Ace.SyntaxMode|string} mode Mode loaded from /ace/mode (use 'ServerSideHiglighter.getMode')
     * @param {any} theme
     * @param {any} lineStart
     * @param {boolean} disableGutter
     * @returns {object} An object containing: html, css
     */
    function renderSync(input: string, mode: import("../ace-internal").Ace.SyntaxMode | string, theme: any, lineStart: any, disableGutter: boolean): object;
}
declare module "ext/statusbar" {
    export type Editor = import("editor").Editor;
    /** simple statusbar **/
    export class StatusBar {
        /**
         * @param {Editor} editor
         * @param {HTMLElement} parentNode
         */
        constructor(editor: Editor, parentNode: HTMLElement);
        element: HTMLDivElement;
        /**
         * @param {Editor} editor
         */
        updateStatus(editor: Editor): void;
    }
}
declare module "ext/textarea" {
    const _exports: {
        config: {
            $defaultOptions: {};
            defineOptions(obj: any, path: string, options: {
                [key: string]: any;
            }): import("lib/app_config").AppConfig;
            resetOptions(obj: any): void;
            setDefaultValue(path: string, name: string, value: any): boolean;
            setDefaultValues(path: string, optionHash: {
                [key: string]: any;
            }): void;
            setMessages(value: any): void;
            nls(string: string, params?: {
                [x: string]: any;
            }): any;
            warn: (message: any, ...args: any[]) => void;
            reportError: (msg: any, data: any) => void;
            once<K extends string | number | symbol>(name: K, callback: any): void;
            setDefaultHandler(name: string, callback: Function): void;
            removeDefaultHandler(name: string, callback: Function): void;
            on<K_1 extends string | number | symbol>(name: K_1, callback: any, capturing?: boolean): any;
            addEventListener<K_2 extends string | number | symbol>(name: K_2, callback: any, capturing?: boolean): any;
            off<K_3 extends string | number | symbol>(name: K_3, callback: any): void;
            removeListener<K_4 extends string | number | symbol>(name: K_4, callback: any): void;
            removeEventListener<K_5 extends string | number | symbol>(name: K_5, callback: any): void;
            removeAllListeners(name?: string): void;
            _signal(eventName: string, e: any): void;
            _emit(eventName: string, e: any): void;
            _dispatchEvent(eventName: string, e: any): void;
            get: (key: string) => any;
            set: (key: string, value: any) => void;
            all: () => {
                [key: string]: any;
            };
            $modes: {};
            moduleUrl: (name: string, component?: string) => string;
            setModuleUrl: (name: string, subst: string) => string;
            setLoader: (cb: (moduleName: string, afterLoad: (err: Error, module: unknown) => void) => void) => void;
            dynamicModules: any;
            $loading: {};
            $loaded: {};
            loadModule: (moduleId: string | [string, string], onLoad: (module: any) => void) => void;
            $require: (moduleName: any) => any;
            setModuleLoader: (moduleName: any, onLoad: any) => void;
            version: "1.32.2";
        };
        edit: (el: string | (HTMLElement & {
            env?: any;
            value?: any;
        }), options?: any) => ace.Editor;
        createEditSession: (text: string | import("document").Document, mode?: import("../../ace-internal").Ace.SyntaxMode) => ace.EditSession;
        Range: typeof ace.Range;
        Editor: typeof ace.Editor;
        EditSession: typeof ace.EditSession;
        UndoManager: typeof ace.UndoManager;
        VirtualRenderer: typeof ace.VirtualRenderer;
        version: "1.32.2";
        transformTextarea: (element: any, options: any) => ace.Editor;
        defaultOptions: {
            mode: string;
            theme: string;
            wrap: string;
            fontSize: string;
            showGutter: string;
            keybindings: string;
            showPrintMargin: string;
            useSoftTabs: string;
            showInvisibles: string;
        };
    };
    export = _exports;
    export function transformTextarea(element: any, options: any): ace.Editor;
    export namespace defaultOptions {
        let mode: string;
        let theme: string;
        let wrap: string;
        let fontSize: string;
        let showGutter: string;
        let keybindings: string;
        let showPrintMargin: string;
        let useSoftTabs: string;
        let showInvisibles: string;
    }
    import ace = require("ace");
}
declare module "ext/whitespace" {
    export function $detectIndentation(lines: string[], fallback?: any): {
        ch?: string;
        length?: number;
    };
    export function detectIndentation(session: EditSession): {
        ch?: string;
        length?: number;
    } | {};
    export function trimTrailingSpace(session: EditSession, options: {
        trimEmpty?: boolean;
        keepCursorPosition?: boolean;
    }): void;
    export function convertIndentation(session: EditSession, ch: string, len: number): void;
    export function $parseStringArg(text: string): {};
    export function $parseArg(arg: any): any;
    export const commands: {
        name: string;
        description: string;
        exec: (editor: any, args: any) => void;
    }[];
    export type EditSession = import("edit_session").EditSession;
}
declare module "keyboard/textarea" {
    export const handler: HashHandler;
    import HashHandler_6 = require("keyboard/hash_handler");
    import HashHandler = HashHandler_6.HashHandler;
}
declare function defineProp(obj: any, name: any, val: any): void;
declare module "lib/fixoldbrowsers" {
    export {};
}
declare module "snippets/abc.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/abc" {
    export const snippetText: string;
    export const scope: "abc";
}
declare module "snippets/actionscript.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/actionscript" {
    export const snippetText: string;
    export const scope: "actionscript";
}
declare module "snippets/c_cpp.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/c_cpp" {
    export const snippetText: string;
    export const scope: "c_cpp";
}
declare module "snippets/clojure.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/clojure" {
    export const snippetText: string;
    export const scope: "clojure";
}
declare module "snippets/coffee.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/coffee" {
    export const snippetText: string;
    export const scope: "coffee";
}
declare module "snippets/csound_document.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/csound_document" {
    export const snippetText: string;
    export const scope: "csound_document";
}
declare module "snippets/csound_orchestra.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/csound_orchestra" {
    export const snippetText: string;
    export const scope: "csound_orchestra";
}
declare module "snippets/css.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/css" {
    export const snippetText: string;
    export const scope: "css";
}
declare module "snippets/dart.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/dart" {
    export const snippetText: string;
    export const scope: "dart";
}
declare module "snippets/diff.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/diff" {
    export const snippetText: string;
    export const scope: "diff";
}
declare module "snippets/django.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/django" {
    export const snippetText: string;
    export const scope: "django";
}
declare module "snippets/drools.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/drools" {
    export const snippetText: string;
    export const scope: "drools";
}
declare module "snippets/edifact.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/edifact" {
    export const snippetText: string;
    export const scope: "edifact";
}
declare module "snippets/erlang.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/erlang" {
    export const snippetText: string;
    export const scope: "erlang";
}
declare module "snippets/fsl.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/fsl" {
    export const snippetText: string;
    export const scope: "fsl";
}
declare module "snippets/gobstones.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/gobstones" {
    export const snippetText: string;
    export const scope: "gobstones";
}
declare module "snippets/graphqlschema.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/graphqlschema" {
    export const snippetText: string;
    export const scope: "graphqlschema";
}
declare module "snippets/haml.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/haml" {
    export const snippetText: string;
    export const scope: "haml";
}
declare module "snippets/haskell.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/haskell" {
    export const snippetText: string;
    export const scope: "haskell";
}
declare module "snippets/html.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/html" {
    export const snippetText: string;
    export const scope: "html";
}
declare module "snippets/io" {
    export const snippets: ({
        content: string;
        name: string;
        scope: string;
        tabTrigger: string;
        keyEquivalent?: undefined;
    } | {
        content: string;
        keyEquivalent: string;
        name: string;
        scope: string;
        tabTrigger: string;
    } | {
        content: string;
        keyEquivalent: string;
        name: string;
        scope: string;
        tabTrigger?: undefined;
    })[];
    export const scope: "io";
}
declare module "snippets/java.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/java" {
    export const snippetText: string;
    export const scope: "java";
}
declare module "snippets/javascript.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/javascript" {
    export const snippetText: string;
    export const scope: "javascript";
}
declare module "snippets/jsp.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/jsp" {
    export const snippetText: string;
    export const scope: "jsp";
}
declare module "snippets/liquid.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/liquid" {
    export const snippetText: string;
    export const scope: "liquid";
}
declare module "snippets/lsl.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/lsl" {
    export const snippetText: string;
    export const scope: "lsl";
}
declare module "snippets/lua.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/lua" {
    export const snippetText: string;
    export const scope: "lua";
}
declare module "snippets/makefile.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/makefile" {
    export const snippetText: string;
    export const scope: "makefile";
}
declare module "snippets/markdown.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/markdown" {
    export const snippetText: string;
    export const scope: "markdown";
}
declare module "snippets/maze.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/maze" {
    export const snippetText: string;
    export const scope: "maze";
}
declare module "snippets/perl.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/perl" {
    export const snippetText: string;
    export const scope: "perl";
}
declare module "snippets/php.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/php" {
    export const snippetText: string;
    export const scope: "php";
}
declare module "snippets/python.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/python" {
    export const snippetText: string;
    export const scope: "python";
}
declare module "snippets/r.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/r" {
    export const snippetText: string;
    export const scope: "r";
}
declare module "snippets/razor.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/razor" {
    export const snippetText: string;
    export const scope: "razor";
}
declare module "snippets/robot.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/robot" {
    export const snippetText: string;
    export const scope: "robot";
}
declare module "snippets/rst.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/rst" {
    export const snippetText: string;
    export const scope: "rst";
}
declare module "snippets/ruby.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/ruby" {
    export const snippetText: string;
    export const scope: "ruby";
}
declare module "snippets/sh.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/sh" {
    export const snippetText: string;
    export const scope: "sh";
}
declare module "snippets/snippets.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/snippets" {
    export const snippetText: string;
    export const scope: "snippets";
}
declare module "snippets/sql.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/sql" {
    export const snippetText: string;
    export const scope: "sql";
}
declare module "snippets/sqlserver.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/sqlserver" {
    export const snippetText: string;
    export const scope: "sqlserver";
}
declare module "snippets/tcl.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/tcl" {
    export const snippetText: string;
    export const scope: "tcl";
}
declare module "snippets/tex.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/tex" {
    export const snippetText: string;
    export const scope: "tex";
}
declare module "snippets/textile.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/textile" {
    export const snippetText: string;
    export const scope: "textile";
}
declare module "snippets/vala" {
    export const snippets: {
        content: string;
        name: string;
        scope: string;
        tabTrigger: string;
    }[];
    export const scope: "";
}
declare module "snippets/velocity.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/velocity" {
    export const snippetText: string;
    export const scope: "velocity";
    export const includeScopes: string[];
}
declare module "snippets/wollok.snippets" {
    const _exports: string;
    export = _exports;
}
declare module "snippets/wollok" {
    export const snippetText: string;
    export const scope: "wollok";
}
declare module "theme/ambiance-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/ambiance" {
    export const isDark: true;
    export const cssClass: "ace-ambiance";
    export const cssText: string;
}
declare module "theme/chaos-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/chaos" {
    export const isDark: true;
    export const cssClass: "ace-chaos";
    export const cssText: string;
}
declare module "theme/chrome-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/chrome" {
    export const isDark: false;
    export const cssClass: "ace-chrome";
    export const cssText: string;
}
declare module "theme/cloud9_day-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/cloud9_day" {
    export const isDark: false;
    export const cssClass: "ace-cloud9-day";
    export const cssText: string;
}
declare module "theme/cloud9_night-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/cloud9_night" {
    export const isDark: true;
    export const cssClass: "ace-cloud9-night";
    export const cssText: string;
}
declare module "theme/cloud9_night_low_color-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/cloud9_night_low_color" {
    export const isDark: true;
    export const cssClass: "ace-cloud9-night-low-color";
    export const cssText: string;
}
declare module "theme/cloud_editor-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/cloud_editor" {
    export const isDark: false;
    export const cssClass: "ace-cloud_editor";
    export const cssText: string;
}
declare module "theme/cloud_editor_dark-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/cloud_editor_dark" {
    export const isDark: true;
    export const cssClass: "ace-cloud_editor_dark";
    export const cssText: string;
}
declare module "theme/clouds-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/clouds" {
    export const isDark: false;
    export const cssClass: "ace-clouds";
    export const cssText: string;
}
declare module "theme/clouds_midnight-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/clouds_midnight" {
    export const isDark: true;
    export const cssClass: "ace-clouds-midnight";
    export const cssText: string;
}
declare module "theme/cobalt-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/cobalt" {
    export const isDark: true;
    export const cssClass: "ace-cobalt";
    export const cssText: string;
}
declare module "theme/crimson_editor-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/crimson_editor" {
    export const isDark: false;
    export const cssText: string;
    export const cssClass: "ace-crimson-editor";
}
declare module "theme/dawn-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/dawn" {
    export const isDark: false;
    export const cssClass: "ace-dawn";
    export const cssText: string;
}
declare module "theme/dracula-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/dracula" {
    export const isDark: true;
    export const cssClass: "ace-dracula";
    export const cssText: string;
    export const $selectionColorConflict: true;
}
declare module "theme/dreamweaver-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/dreamweaver" {
    export const isDark: false;
    export const cssClass: "ace-dreamweaver";
    export const cssText: string;
}
declare module "theme/eclipse-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/eclipse" {
    export const isDark: false;
    export const cssText: string;
    export const cssClass: "ace-eclipse";
}
declare module "theme/github-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/github" {
    export const isDark: false;
    export const cssClass: "ace-github";
    export const cssText: string;
}
declare module "theme/github_dark-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/github_dark" {
    export const isDark: true;
    export const cssClass: "ace-github-dark";
    export const cssText: string;
}
declare module "theme/gob-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/gob" {
    export const isDark: true;
    export const cssClass: "ace-gob";
    export const cssText: string;
}
declare module "theme/gruvbox-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/gruvbox" {
    export const isDark: true;
    export const cssClass: "ace-gruvbox";
    export const cssText: string;
}
declare module "theme/gruvbox_dark_hard-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/gruvbox_dark_hard" {
    export const isDark: true;
    export const cssClass: "ace-gruvbox-dark-hard";
    export const cssText: string;
}
declare module "theme/gruvbox_light_hard-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/gruvbox_light_hard" {
    export const isDark: false;
    export const cssClass: "ace-gruvbox-light-hard";
    export const cssText: string;
}
declare module "theme/idle_fingers-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/idle_fingers" {
    export const isDark: true;
    export const cssClass: "ace-idle-fingers";
    export const cssText: string;
}
declare module "theme/iplastic-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/iplastic" {
    export const isDark: false;
    export const cssClass: "ace-iplastic";
    export const cssText: string;
}
declare module "theme/katzenmilch-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/katzenmilch" {
    export const isDark: false;
    export const cssClass: "ace-katzenmilch";
    export const cssText: string;
}
declare module "theme/kr_theme-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/kr_theme" {
    export const isDark: true;
    export const cssClass: "ace-kr-theme";
    export const cssText: string;
}
declare module "theme/kuroir-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/kuroir" {
    export const isDark: false;
    export const cssClass: "ace-kuroir";
    export const cssText: string;
}
declare module "theme/merbivore-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/merbivore" {
    export const isDark: true;
    export const cssClass: "ace-merbivore";
    export const cssText: string;
}
declare module "theme/merbivore_soft-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/merbivore_soft" {
    export const isDark: true;
    export const cssClass: "ace-merbivore-soft";
    export const cssText: string;
}
declare module "theme/mono_industrial-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/mono_industrial" {
    export const isDark: true;
    export const cssClass: "ace-mono-industrial";
    export const cssText: string;
}
declare module "theme/monokai-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/monokai" {
    export const isDark: true;
    export const cssClass: "ace-monokai";
    export const cssText: string;
}
declare module "theme/nord_dark-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/nord_dark" {
    export const isDark: true;
    export const cssClass: "ace-nord-dark";
    export const cssText: string;
    export const $selectionColorConflict: true;
}
declare module "theme/one_dark-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/one_dark" {
    export const isDark: true;
    export const cssClass: "ace-one-dark";
    export const cssText: string;
}
declare module "theme/pastel_on_dark-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/pastel_on_dark" {
    export const isDark: true;
    export const cssClass: "ace-pastel-on-dark";
    export const cssText: string;
}
declare module "theme/solarized_dark-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/solarized_dark" {
    export const isDark: true;
    export const cssClass: "ace-solarized-dark";
    export const cssText: string;
}
declare module "theme/solarized_light-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/solarized_light" {
    export const isDark: false;
    export const cssClass: "ace-solarized-light";
    export const cssText: string;
}
declare module "theme/sqlserver-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/sqlserver" {
    export const isDark: false;
    export const cssClass: "ace-sqlserver";
    export const cssText: string;
}
declare module "theme/terminal-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/terminal" {
    export const isDark: true;
    export const cssClass: "ace-terminal-theme";
    export const cssText: string;
}
declare module "theme/tomorrow-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/tomorrow" {
    export const isDark: false;
    export const cssClass: "ace-tomorrow";
    export const cssText: string;
}
declare module "theme/tomorrow_night-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/tomorrow_night" {
    export const isDark: true;
    export const cssClass: "ace-tomorrow-night";
    export const cssText: string;
}
declare module "theme/tomorrow_night_blue-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/tomorrow_night_blue" {
    export const isDark: true;
    export const cssClass: "ace-tomorrow-night-blue";
    export const cssText: string;
}
declare module "theme/tomorrow_night_bright-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/tomorrow_night_bright" {
    export const isDark: true;
    export const cssClass: "ace-tomorrow-night-bright";
    export const cssText: string;
}
declare module "theme/tomorrow_night_eighties-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/tomorrow_night_eighties" {
    export const isDark: true;
    export const cssClass: "ace-tomorrow-night-eighties";
    export const cssText: string;
}
declare module "theme/twilight-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/twilight" {
    export const isDark: true;
    export const cssClass: "ace-twilight";
    export const cssText: string;
}
declare module "theme/vibrant_ink-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/vibrant_ink" {
    export const isDark: true;
    export const cssClass: "ace-vibrant-ink";
    export const cssText: string;
}
declare module "theme/xcode-css" {
    const _exports: string;
    export = _exports;
}
declare module "theme/xcode" {
    export const isDark: false;
    export const cssClass: "ace-xcode";
    export const cssText: string;
}
