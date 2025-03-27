import type {Fold} from "./src/edit_session/fold";
import type {FoldLine} from "./src/edit_session/fold_line";
import type {Editor} from "./src/editor";
import type {Range} from "./src/range";
import type {EditSession} from "./src/edit_session";
import type {VirtualRenderer} from "./src/virtual_renderer";
import type {SearchBox} from "./src/ext/searchbox";
import type {HashHandler} from "./src/keyboard/hash_handler";
import type {Tokenizer} from "./src/tokenizer";
import type {Autocomplete, Completion, FilteredList} from "./src/autocomplete";
import type {Anchor} from "./src/anchor";
import type {RangeList} from "./src/range_list";
import type {ElasticTabstopsLite} from "./src/ext/elastic_tabstops_lite";
import type {MouseEvent} from "./src/mouse/mouse_event";
export type AfterLoadCallback = (err: Error | null, module: unknown) => void;
export type LoaderFunction = (moduleName: string, afterLoad: AfterLoadCallback) => void;
import type {GutterKeyboardEvent} from "./src/keyboard/gutter_handler";
import type {GutterTooltip} from "./src/mouse/default_gutter_handler";

export interface ConfigOptions {
    packaged: boolean,
    workerPath: string | null,
    modePath: string | null,
    themePath: string | null,
    basePath: string,
    suffix: string,
    $moduleUrls: { [url: string]: string },
    loadWorkerFromBlob: boolean,
    sharedPopups: boolean,
    useStrictCSP: boolean | null
}

export interface Theme {
    cssClass?: string;
    cssText?: string;
    $id?: string;
    padding?: number | string;
    isDark?: boolean;
}

export interface ScrollBar {
    setVisible(visible: boolean): void;

    [key: string]: any;
}

export interface HScrollbar extends ScrollBar {
    setWidth(width: number): void;
}

export interface VScrollbar extends ScrollBar {
    setHeight(width: number): void;
}

export interface LayerConfig {
    width: number,
    padding: number,
    firstRow: number,
    firstRowScreen: number,
    lastRow: number,
    lineHeight: number,
    characterWidth: number,
    minHeight: number,
    maxHeight: number,
    offset: number,
    height: number,
    gutterOffset: number
}

export interface HardWrapOptions {
    startRow: number;
    endRow: number;
    allowMerge?: boolean;
    column?: number;
}

export interface CommandBarOptions {
    maxElementsOnTooltip: number;
    alwaysShow: boolean;
    showDelay: number;
    hideDelay: number;
}

export interface ScreenCoordinates {
    row: number,
    column: number,
    side?: 1 | -1,
    offsetX?: number
}

export interface Folding {
    $foldData: FoldLine[];

    /**
     * Looks up a fold at a given row/column. Possible values for side:
     *   -1: ignore a fold if fold.start = row/column
     *   +1: ignore a fold if fold.end = row/column
     **/
    getFoldAt(row: number, column: number, side?: number): Fold;

    /**
     * Returns all folds in the given range. Note, that this will return folds
     **/
    getFoldsInRange(range: Range | Delta): Fold[];

    getFoldsInRangeList(ranges: Range[] | Range): Fold[];

    /**
     * Returns all folds in the document
     */
    getAllFolds(): Fold[];

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
    getFoldStringAt(row: number, column: number, trim?: number, foldLine?: FoldLine): string | null;

    getFoldLine(docRow: number, startFoldLine?: FoldLine): null | FoldLine;

    /**
     * Returns the fold which starts after or contains docRow
     */
    getNextFoldLine(docRow: number, startFoldLine?: FoldLine): null | FoldLine;

    getFoldedRowCount(first: number, last: number): number;

    $addFoldLine(foldLine: FoldLine): FoldLine;

    /**
     * Adds a new fold.
     * @returns {Fold}
     *      The new created Fold object or an existing fold object in case the
     *      passed in range fits an existing fold exactly.
     */
    addFold(placeholder: Fold | string, range?: Range): Fold;

    $modified: boolean;

    addFolds(folds: Fold[]): void;

    removeFold(fold: Fold): void;

    removeFolds(folds: Fold[]): void;

    expandFold(fold: Fold): void;

    expandFolds(folds: Fold[]): void;

    unfold(location?: number | null | Point | Range | Range[], expandInner?: boolean): Fold[] | undefined;

    /**
     * Checks if a given documentRow is folded. This is true if there are some
     * folded parts such that some parts of the line is still visible.
     **/
    isRowFolded(docRow: number, startFoldRow?: FoldLine): boolean;

    getRowFoldEnd(docRow: number, startFoldRow?: FoldLine): number;

    getRowFoldStart(docRow: number, startFoldRow?: FoldLine): number;

    getFoldDisplayLine(foldLine: FoldLine, endRow?: number | null, endColumn?: number | null, startRow?: number | null, startColumn?: number | null): string;

    getDisplayLine(row: number, endColumn: number | null, startRow: number | null, startColumn: number | null): string;

    $cloneFoldData(): FoldLine[];

    toggleFold(tryToUnfold?: boolean): void;

    getCommentFoldRange(row: number, column: number, dir?: number): Range | undefined;

    foldAll(startRow?: number | null, endRow?: number | null, depth?: number | null, test?: Function): void;

    foldToLevel(level: number): void;

    foldAllComments(): void;

    $foldStyles: {
        manual: number;
        markbegin: number;
        markbeginend: number;
    };
    $foldStyle: string;

    setFoldStyle(style: string): void;

    $setFolding(foldMode: FoldMode): void;

    $foldMode: any;
    foldWidgets: any[];
    getFoldWidget: any;
    getFoldWidgetRange: any;
    $updateFoldWidgets: any;
    $tokenizerUpdateFoldWidgets: any;

    getParentFoldRangeData(row: number, ignoreCurrent?: boolean): {
        range?: Range;
        firstRange?: Range;
    };

    onFoldWidgetClick(row: number, e: any): void;

    $toggleFoldWidget(row: number, options: any): Fold | any;

    /**
     *
     * @param {boolean} [toggleParent]
     */
    toggleFoldWidget(toggleParent?: boolean): void;

    updateFoldWidgets(delta: Delta): void;

    tokenizerUpdateFoldWidgets(e: any): void;
}

export class BracketMatch {
    findMatchingBracket: (position: Point, chr?: string) => Point;

    getBracketRange: (pos: Point) => null | Range;
    /**
     * Returns:
     * * null if there is no any bracket at `pos`;
     * * two Ranges if there is opening and closing brackets;
     * * one Range if there is only one bracket
     */
    getMatchingBracketRanges: (pos: Point, isBackwards?: boolean) => null | Range[];
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
    $findOpeningBracket: (bracket: string, position: Point, typeRe?: RegExp) => Point | null;
    $findClosingBracket: (bracket: string, position: Point, typeRe?: RegExp) => Point | null;
    /**
     * Returns [[Range]]'s for matching tags and tag names, if there are any
     */
    getMatchingTags: (pos: Point) => {
        closeTag: Range;
        closeTagName: Range;
        openTag: Range;
        openTagName: Range;
    };
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

export interface IRange {
    start: Point;
    end: Point;
}

export interface LineWidget {
    editor?: Editor,
    el?: HTMLElement;
    rowCount?: number;
    hidden?: boolean;
    _inDocument?: boolean;
    column?: number;
    row: number;
    $oldWidget?: LineWidget,
    session?: EditSession,
    html?: string,
    text?: string,
    className?: string,
    coverGutter?: boolean,
    pixelHeight?: number,
    $fold?: Fold,
    type?: any,
    destroy?: () => void;
    coverLine?: boolean,
    fixedWidth?: boolean,
    fullWidth?: boolean,
    screenWidth?: number,
    rowsAbove?: number,
    lenses?: any[],
}

type NewLineMode = 'auto' | 'unix' | 'windows';

export interface EditSessionOptions {
    wrap: "off" | "free" | "printmargin" | boolean | number;
    wrapMethod: 'code' | 'text' | 'auto';
    indentedSoftWrap: boolean;
    firstLineNumber: number;
    useWorker: boolean;
    useSoftTabs: boolean;
    tabSize: number;
    navigateWithinSoftTabs: boolean;
    foldStyle: 'markbegin' | 'markbeginend' | 'manual';
    overwrite: boolean;
    newLineMode: NewLineMode;
    mode: string;
}

export interface VirtualRendererOptions {
    animatedScroll: boolean;
    showInvisibles: boolean;
    showPrintMargin: boolean;
    printMarginColumn: number;
    printMargin: boolean | number;
    showGutter: boolean;
    fadeFoldWidgets: boolean;
    showFoldWidgets: boolean;
    showLineNumbers: boolean;
    displayIndentGuides: boolean;
    highlightIndentGuides: boolean;
    highlightGutterLine: boolean;
    hScrollBarAlwaysVisible: boolean;
    vScrollBarAlwaysVisible: boolean;
    fontSize: string | number;
    fontFamily: string;
    maxLines: number;
    minLines: number;
    scrollPastEnd: number;
    fixedWidthGutter: boolean;
    customScrollbar: boolean;
    theme: string;
    hasCssTransforms: boolean;
    maxPixelHeight: number;
    useSvgGutterIcons: boolean;
    showFoldedAnnotations: boolean;
    useResizeObserver: boolean;
}

export interface MouseHandlerOptions {
    scrollSpeed: number;
    dragDelay: number;
    dragEnabled: boolean;
    focusTimeout: number;
    tooltipFollowsMouse: boolean;
}

export interface EditorOptions extends EditSessionOptions,
    MouseHandlerOptions,
    VirtualRendererOptions {
    selectionStyle: "fullLine" | "screenLine" | "text" | "line";
    highlightActiveLine: boolean;
    highlightSelectedWord: boolean;
    readOnly: boolean;
    copyWithEmptySelection: boolean;
    cursorStyle: 'ace' | 'slim' | 'smooth' | 'wide';
    mergeUndoDeltas: true | false | 'always';
    behavioursEnabled: boolean;
    wrapBehavioursEnabled: boolean;
    enableAutoIndent: boolean;
    enableBasicAutocompletion: boolean | Completer[];
    enableLiveAutocompletion: boolean | Completer[];
    liveAutocompletionDelay: number;
    liveAutocompletionThreshold: number;
    enableSnippets: boolean;
    autoScrollEditorIntoView: boolean;
    keyboardHandler: string | null;
    placeholder: string;
    value: string;
    session: EditSession;
    relativeLineNumbers: boolean;
    enableMultiselect: boolean;
    enableKeyboardAccessibility: boolean;
    enableCodeLens: boolean;
    textInputAriaLabel: string;
    enableMobileMenu: boolean;
}

export interface EventsBase {
    [key: string]: any;
}

export interface EditSessionEvents {
    /**
     * Emitted when the document changes.
     * @param delta
     */
    "change": (delta: Delta) => void;
    /**
     * Emitted when the tab size changes, via [[EditSession.setTabSize]].
     */
    "changeTabSize": () => void;
    /**
     * Emitted when the ability to overwrite text changes, via [[EditSession.setOverwrite]].
     * @param overwrite
     */
    "changeOverwrite": (overwrite: boolean) => void;
    /**
     * Emitted when the gutter changes, either by setting or removing breakpoints, or when the gutter decorations change.
     * @param e
     */
    "changeBreakpoint": (e?: { row?: number, breakpoint?: boolean }) => void;
    /**
     * Emitted when a front marker changes.
     */
    "changeFrontMarker": () => void;
    /**
     * Emitted when a back marker changes.
     */
    "changeBackMarker": () => void;
    /**
     * Emitted when an annotation changes, like through [[EditSession.setAnnotations]].
     */
    "changeAnnotation": (e: {}) => void;
    /**
     * Emitted when a background tokenizer asynchronously processes new rows.
     */
    "tokenizerUpdate": (e: { data: { first: number, last: number } }) => void;
    /**
     * Emitted when the current mode changes.
     * @param e
     */
    "changeMode": (e: any) => void;
    /**
     * Emitted when the wrap mode changes.
     * @param e
     */
    "changeWrapMode": (e: any) => void;
    /**
     * Emitted when the wrapping limit changes.
     * @param e
     */
    "changeWrapLimit": (e: any) => void;
    /**
     * Emitted when a code fold is added or removed.
     * @param e
     */
    "changeFold": (e: any, session?: EditSession) => void;
    /**
     * Emitted when the scroll top changes.
     * @param scrollTop The new scroll top value
     **/
    "changeScrollTop": (scrollTop: number) => void;
    /**
     * Emitted when the scroll left changes.
     * @param scrollLeft The new scroll left value
     **/
    "changeScrollLeft": (scrollLeft: number) => void;
    "changeEditor": (e: { editor?: Editor, oldEditor?: Editor }) => void;
    "changeSelection": () => void;
    "startOperation": (op?: { command?: { name?: string }, args?: any }) => void;
    "endOperation": (op?: any) => void;
    "beforeEndOperation": () => void;
}

export interface EditorEvents {
    "change": (delta: Delta) => void;
    "changeSelection": () => void;
    "input": () => void;
    /**
     * Emitted whenever the [[EditSession]] changes.
     * @param e An object with two properties, `oldSession` and `session`, that represent the old and new [[EditSession]]s.
     **/
    "changeSession": (e: { oldSession: EditSession, session: EditSession }) => void;
    "blur": (e: any) => void;
    "mousedown": (e: MouseEvent) => void;
    "mousemove": (e: MouseEvent & { scrollTop?: any }, editor?: Editor) => void;
    "changeStatus": (e: any) => void;
    "keyboardActivity": (e: any) => void;
    "mousewheel": (e: MouseEvent) => void;
    "mouseup": (e: MouseEvent) => void;
    "beforeEndOperation": (e: any) => void;
    "nativecontextmenu": (e: any) => void;
    "destroy": (e: any) => void;
    "focus": (e?: any) => void;
    /**
     * Emitted when text is copied.
     * @param text The copied text
     **/
    "copy": (e: { text: string }) => void;
    /**
     * Emitted when text is pasted.
     **/
    "paste": (e: { text: string, event?: ClipboardEvent }) => void;
    /**
     * Emitted when the selection style changes, via [[Editor.setSelectionStyle]].
     * @param data Contains one property, `data`, which indicates the new selection style
     **/
    "changeSelectionStyle": (data: "fullLine" | "screenLine" | "text" | "line") => void;
    "changeMode": (e: { mode?: SyntaxMode, oldMode?: SyntaxMode }) => void;

    //from searchbox extension
    "findSearchBox": (e: { match: boolean }) => void;

    //from code_lens extension
    "codeLensClick": (e: any) => void;

    "select": () => void;
    "gutterkeydown": (e: GutterKeyboardEvent) => void;
    "gutterclick": (e: MouseEvent) => void;
    "showGutterTooltip": (e: GutterTooltip) => void;
    "hideGutterTooltip": (e: GutterTooltip) => void;
    "compositionStart": () => void;
}

export interface AcePopupEvents {
    "click": (e: MouseEvent) => void;
    "dblclick": (e: MouseEvent) => void;
    "tripleclick": (e: MouseEvent) => void;
    "quadclick": (e: MouseEvent) => void;
    "show": () => void;
    "hide": () => void;
    "select": (hide: boolean) => void;
    "changeHoverMarker": (e: any) => void;
}

export interface DocumentEvents {
    /**
     * Fires whenever the document changes.
     * Several methods trigger different `"change"` events. Below is a list of each action type, followed by each property that's also available:
     *  * `"insert"`
     *    * `range`: the [[Range]] of the change within the document
     *    * `lines`: the lines being added
     *  * `"remove"`
     *    * `range`: the [[Range]] of the change within the document
     *    * `lines`: the lines being removed
     *
     **/
    "change": (e: Delta) => void;
    "changeNewLineMode": () => void;
}

export interface AnchorEvents {
    /**
     * Fires whenever the anchor position changes.
     * Both of these objects have a `row` and `column` property corresponding to the position.
     * Events that can trigger this function include [[Anchor.setPosition `setPosition()`]].
     * @param {Object} e  An object containing information about the anchor position. It has two properties:
     *  - `old`: An object describing the old Anchor position
     *  - `value`: An object describing the new Anchor position
     **/
    "change": (e: { old: Point, value: Point }) => void;
}

export interface BackgroundTokenizerEvents {
    /**
     * Fires whenever the background tokeniziers between a range of rows are going to be updated.
     * @param e An object containing two properties, `first` and `last`, which indicate the rows of the region being updated.
     **/
    "update": (e: {
        data: { first: number, last: number }
    }) => void;
}

export interface SelectionEvents {
    /**
     * Emitted when the cursor position changes.
     **/
    "changeCursor": () => void;
    /**
     * Emitted when the cursor selection changes.
     **/
    "changeSelection": () => void;
}

export interface MultiSelectionEvents extends SelectionEvents {
    "multiSelect": () => void;
    "addRange": (e: { range: Range }) => void;
    "removeRange": (e: { ranges: Range[] }) => void;
    "singleSelect": () => void;
}

export interface PlaceHolderEvents {
    "cursorEnter": (e: any) => void;
    "cursorLeave": (e: any) => void;
}

export interface GutterEvents {
    "changeGutterWidth": (width: number) => void;
    "afterRender": () => void;
}

export interface TextEvents {
    "changeCharacterSize": (e: any) => void;
}

export interface VirtualRendererEvents {
    "afterRender": (e?: any, renderer?: VirtualRenderer) => void;
    "beforeRender": (e: any, renderer?: VirtualRenderer) => void;
    "themeLoaded": (e: { theme: string | Theme }) => void;
    "themeChange": (e: { theme: string | Theme }) => void;
    "scrollbarVisibilityChanged": () => void;
    "changeCharacterSize": (e: any) => void;
    "resize": (e?: any) => void;
    "autosize": () => void;
}

export class EventEmitter<T extends { [K in keyof T]: (...args: any[]) => any }> {
    once<K extends keyof T>(name: K, callback: T[K]): void;

    setDefaultHandler(name: string, callback: Function): void;

    removeDefaultHandler(name: string, callback: Function): void;

    on<K extends keyof T>(name: K, callback: T[K], capturing?: boolean): T[K];

    addEventListener<K extends keyof T>(name: K, callback: T[K], capturing?: boolean): T[K];

    off<K extends keyof T>(name: K, callback: T[K]): void;

    removeListener<K extends keyof T>(name: K, callback: T[K]): void;

    removeEventListener<K extends keyof T>(name: K, callback: T[K]): void;

    removeAllListeners(name?: string): void;

    _signal<K extends keyof T>(eventName: K, ...args: Parameters<T[K]>): void;

    _emit<K extends keyof T>(eventName: K, ...args: Parameters<T[K]>): void;

    _dispatchEvent<K extends keyof T>(eventName: K, ...args: Parameters<T[K]>): void;
}

export interface SearchOptions {
    /**The string or regular expression you're looking for*/
    needle: string | RegExp;
    preventScroll: boolean;
    /**Whether to search backwards from where cursor currently is*/
    backwards: boolean;
    /**The starting [[Range]] or cursor position to begin the search*/
    start: Range;
    /**Whether or not to include the current line in the search*/
    skipCurrent: boolean;
    /**The [[Range]] to search within. Set this to `null` for the whole document*/
    range: Range | null;
    preserveCase: boolean;
    /**Whether the search is a regular expression or not*/
    regExp: boolean;
    /**Whether the search matches only on whole words*/
    wholeWord: boolean;
    /**Whether the search ought to be case-sensitive*/
    caseSensitive: boolean;
    /**Whether to wrap the search back to the beginning when it hits the end*/
    wrap: boolean;
    re: any;
    /**true, if needle has \n or \r\n*/
    $isMultiLine: boolean;
    /**
     * internal property, determine if browser supports unicode flag
     * @private
     * */
    $supportsUnicodeFlag: boolean;
}

export interface Point {
    row: number;
    column: number;
}

export type Position = Point;

export interface Delta {
    action: 'insert' | 'remove';
    start: Point;
    end: Point;
    lines: string[];
    id?: number,
    folds?: Fold[]
}

export interface Annotation {
    row: number;
    column: number;
    text: string;
    type: string;
}

export interface MarkerGroupItem {
    range: Range;
    className: string;
}

export interface Command {
    name?: string;
    bindKey?: string | { mac?: string, win?: string };
    readOnly?: boolean;
    exec?: (editor?: Editor | any, args?: any) => void;
    isAvailable?: (editor: Editor) => boolean;
    description?: string,
    multiSelectAction?: "forEach" | "forEachLine" | Function,
    scrollIntoView?: true | "cursor" | "center" | "selectionPart" | "animate" | "selection" | "none",
    aceCommandGroup?: string,
    passEvent?: boolean,
    level?: number,
    action?: string,
}

export type CommandLike = Command | ((editor: Editor) => void) | ((sb: SearchBox) => void);

export type KeyboardHandler = Partial<HashHandler> & {
    attach?: (editor: Editor) => void;
    detach?: (editor: Editor) => void;
    getStatusText?: (editor?: any, data?: any) => string;
}

export interface MarkerLike {
    range?: Range;
    type: string;
    renderer?: MarkerRenderer;
    clazz: string;
    inFront?: boolean;
    id?: number;
    update?: (html: string[],
              // TODO maybe define Marker class
              marker: any,
              session: EditSession,
              config: any) => void;

    [key: string]: any;
}

export type MarkerRenderer = (html: string[],
                              range: Range,
                              left: number,
                              top: number,
                              config: any) => void;

export interface Token {
    type: string;
    value: string;
    index?: number;
    start?: number;
}

export type HighlightRule = ({ defaultToken: string } | { include: string } | { todo: string } | {
    token: string | string[] | ((value: string) => string);
    regex: string | RegExp;
    next?: string | (() => void);
    push?: string;
    comment?: string;
    caseInsensitive?: boolean;
    nextState?: string;
}) & { [key: string]: any };

export type HighlightRulesMap = Record<string, HighlightRule[]>;

export type KeywordMapper = (keyword: string) => string;

export interface HighlightRules {
    $rules: HighlightRulesMap;
    $embeds: string[];
    $keywords: any[];
    $keywordList: string[];

    addRules(rules: HighlightRulesMap, prefix?: string): void;

    getRules(): HighlightRulesMap;

    embedRules(rules: (new () => HighlightRules) | HighlightRulesMap, prefix: string, escapeRules?: boolean, append?: boolean): void;

    getEmbeds(): string[];

    normalizeRules(): void;

    createKeywordMapper(map: Record<string, string>, defaultToken?: string, ignoreCase?: boolean, splitChar?: string): KeywordMapper;
}

export type FoldWidget = "start" | "end" | ""

export interface FoldMode {
    foldingStartMarker: RegExp;
    foldingStopMarker?: RegExp;

    getFoldWidget(session: EditSession, foldStyle: string, row: number): FoldWidget;

    getFoldWidgetRange(session: EditSession, foldStyle: string, row: number): Range | undefined;

    indentationBlock(session: EditSession, row: number, column?: number): Range | undefined;

    openingBracketBlock(session: EditSession, bracket: string, row: number, column: number, typeRe?: RegExp): Range | undefined;

    closingBracketBlock(session: EditSession, bracket: string, row: number, column: number, typeRe?: RegExp): Range | undefined;
}

export type BehaviorAction = (state: string | string[], action: string, editor: Editor, session: EditSession, text: string | Range) => ({
    text: string,
    selection: number[]
} | Range) & { [key: string]: any } | undefined;
type BehaviorMap = Record<string, Record<string, BehaviorAction>>;

export interface Behaviour {
    $behaviours: { [behaviour: string]: any }

    add(name: string, action: string, callback: BehaviorAction): void;

    addBehaviours(behaviours: BehaviorMap): void;

    remove(name: string): void;

    inherit(mode: SyntaxMode | (new () => SyntaxMode), filter: string[]): void;

    getBehaviours(filter?: string[]): BehaviorMap;
}

export interface Outdent {
    checkOutdent(line: string, input: string): boolean;

    autoOutdent(doc: Document, row: number): number | undefined;
}

export interface SyntaxMode {
    /**
     * quotes used by language mode
     */
    $quotes: { [quote: string]: string };
    HighlightRules: {
        new(config?: any): HighlightRules
    }; //TODO: fix this
    foldingRules?: FoldMode;
    $behaviour?: Behaviour;
    $defaultBehaviour?: Behaviour;
    /**
     * characters that indicate the start of a line comment
     */
    lineCommentStart?: string;
    /**
     * characters that indicate the start and end of a block comment
     */
    blockComment?: { start: string, end: string }
    tokenRe?: RegExp;
    nonTokenRe?: RegExp;
    /**
     * An object containing conditions to determine whether to apply matching quote or not.
     */
    $pairQuotesAfter: { [quote: string]: RegExp }
    $tokenizer: Tokenizer;
    $highlightRules: HighlightRules;
    $embeds?: string[];
    $modes?: SyntaxMode[];
    $keywordList?: string[];
    $highlightRuleConfig?: any;
    completionKeywords: string[];
    transformAction: BehaviorAction;
    path?: string;

    getTokenizer(): Tokenizer;

    toggleCommentLines(state: string | string[],
                       session: EditSession,
                       startRow: number,
                       endRow: number): void;

    toggleBlockComment(state: string | string[],
                       session: EditSession,
                       range: Range,
                       cursor: Point): void;

    getNextLineIndent(state: string | string[], line: string, tab: string): string;

    checkOutdent(state: string | string[], line: string, input: string): boolean;

    autoOutdent(state: string | string[], doc: EditSession, row: number): void;

    // TODO implement WorkerClient types
    createWorker(session: EditSession): any;

    createModeDelegates(mapping: { [key: string]: string }): void;

    getKeywords(append?: boolean): Array<string | RegExp>;

    getCompletions(state: string | string[],
                   session: EditSession,
                   pos: Point,
                   prefix: string): Completion[];

    $getIndent(line: string): string;

    $createKeywordList(): string[];

    $delegator(method: string, args: IArguments, defaultHandler: any): any;

}

export interface OptionsBase {
    [key: string]: any;
}

export class OptionsProvider<T> {
    setOptions(optList: Partial<T>): void;

    getOptions(optionNames?: Array<keyof T> | Partial<T>): Partial<T>;

    setOption<K extends keyof T>(name: K, value: T[K]): void;

    getOption<K extends keyof T>(name: K): T[K];
}

export interface CommandMap {
    [name: string]: Command;
}

export type execEventHandler = (obj: {
    editor: Editor,
    command: Command,
    args: any[]
}) => void;

export interface CommandManagerEvents {
    "exec": execEventHandler
    "afterExec": execEventHandler;
    "commandUnavailable": execEventHandler;
}

export interface SavedSelection {
    start: Point;
    end: Point;
    isBackwards: boolean;
}

export var Selection: {
    new(session: EditSession): Selection;
}

export interface TextInput {
    resetSelection(): void;

    setAriaOption(options?: { activeDescendant: string, role: string, setLabel: any }): void;
}

export type CompleterCallback = (error: any, completions: Completion[]) => void;

export interface Completer {
    identifierRegexps?: Array<RegExp>,

    getCompletions(editor: Editor,
                   session: EditSession,
                   position: Point,
                   prefix: string,
                   callback: CompleterCallback): void;

    getDocTooltip?(item: Completion): void | string | Completion;

    onSeen?: (editor: Editor, completion: Completion) => void;
    onInsert?: (editor: Editor, completion: Completion) => void;

    cancel?(): void;

    id?: string;
    triggerCharacters?: string[];
    hideInlinePreview?: boolean;
    insertMatch?: (editor: Editor, data: Completion) => void;
}

export interface CompletionOptions {
    matches?: Completion[];
}

export type CompletionProviderOptions = {
    exactMatch?: boolean;
    ignoreCaption?: boolean;
}

export type GatherCompletionRecord = {
    prefix: string;
    matches: Completion[];
    finished: boolean;
}

export type CompletionCallbackFunction = (err: Error | undefined, data: GatherCompletionRecord) => void;
export type CompletionProviderCallback = (this: Autocomplete, err: Error | undefined, completions: FilteredList, finished: boolean) => void;

export type AcePopupNavigation = "up" | "down" | "start" | "end";

export interface EditorMultiSelectProperties {
    inMultiSelectMode?: boolean,
    /**
     * Updates the cursor and marker layers.
     **/
    updateSelectionMarkers: () => void,
    /**
     * Adds the selection and cursor.
     * @param orientedRange A range containing a cursor
     **/
    addSelectionMarker: (orientedRange: Range & { marker?: any }) => Range & { marker?: any },
    /**
     * Removes the selection marker.
     * @param range The selection range added with [[Editor.addSelectionMarker `addSelectionMarker()`]].
     **/
    removeSelectionMarker: (range: Range & { marker?: any }) => void,
    removeSelectionMarkers: (ranges: (Range & { marker?: any })[]) => void,
    $onAddRange: (e: any) => void,
    $onRemoveRange: (e: any) => void,
    $onMultiSelect: (e: any) => void,
    $onSingleSelect: (e: any) => void,
    $onMultiSelectExec: (e: any) => void,
    /**
     * Executes a command for each selection range.
     * @param cmd The command to execute
     * @param [args] Any arguments for the command
     **/
    forEachSelection: (cmd: Object, args?: string, options?: Object) => void,
    /**
     * Removes all the selections except the last added one.
     **/
    exitMultiSelectMode: () => void,
    getSelectedText: () => string,
    $checkMultiselectChange: (e: any, anchor: Anchor) => void,
    /**
     * Finds and selects all the occurrences of `needle`.
     * @param needle The text to find
     * @param options The search options
     * @param additive keeps
     * @returns {Number} The cumulative count of all found matches
     **/
    findAll: (needle?: string, options?: Partial<SearchOptions>, additive?: boolean) => number,
    /**
     * Adds a cursor above or below the active cursor.
     * @param dir The direction of lines to select: -1 for up, 1 for down
     * @param [skip] If `true`, removes the active selection range
     */
    selectMoreLines: (dir: number, skip?: boolean) => void,
    /**
     * Transposes the selected ranges.
     * @param {Number} dir The direction to rotate selections
     **/
    transposeSelections: (dir: number) => void,
    /**
     * Finds the next occurrence of text in an active selection and adds it to the selections.
     * @param {Number} dir The direction of lines to select: -1 for up, 1 for down
     * @param {Boolean} [skip] If `true`, removes the active selection range
     * @param {Boolean} [stopAtFirst]
     **/
    selectMore: (dir: number, skip?: boolean, stopAtFirst?: boolean) => void,
    /**
     * Aligns the cursors or selected text.
     **/
    alignCursors: () => void,
    $reAlignText: (lines: string[], forceLeft: boolean) => string[],
    multiSelect?: any,
    $multiselectOnSessionChange?: any,
    $blockSelectEnabled?: boolean,
}

export interface CodeLenseProvider {
    provideCodeLenses: (session: EditSession, callback: (err: any, payload: CodeLense[]) => void) => void;
}

export interface CodeLense {
    start: Point,
    command: any
}

export interface CodeLenseEditorExtension {
    codeLensProviders?: CodeLenseProvider[];
    $codeLensClickHandler?: any;
    $updateLenses?: () => void;
    $updateLensesOnInput?: () => void;
}

export interface ElasticTabstopsEditorExtension {
    elasticTabstops?: ElasticTabstopsLite;
}

export interface TextareaEditorExtension {
    setDisplaySettings?: (settings: any) => void;
}

export interface PromptEditorExtension {
    cmdLine?: Editor;
}

export interface OptionsEditorExtension {
    $options?: any;
}

export interface MultiSelectProperties {
    ranges: Range[] | null;
    rangeList: RangeList | null;

    /**
     * Adds a range to a selection by entering multiselect mode, if necessary.
     * @param {Range} range The new range to add
     * @param {Boolean} [$blockChangeEvents] Whether or not to block changing events
     **/
    addRange(range: Range, $blockChangeEvents?: boolean): any;

    inMultiSelectMode: boolean;

    /**
     * @param {Range} [range]
     **/
    toSingleRange(range?: Range): void;

    /**
     * Removes a Range containing pos (if it exists).
     * @param {Point} pos The position to remove, as a `{row, column}` object
     **/
    substractPoint(pos: Point): any;

    /**
     * Merges overlapping ranges ensuring consistency after changes
     **/
    mergeOverlappingRanges(): void;

    /**
     * @param {Range} range
     */
    $onAddRange(range: Range): void;

    rangeCount: number;

    /**
     *
     * @param {Range[]} removed
     */
    $onRemoveRange(removed: Range[]): void;

    /**
     * adds multicursor support to selection
     */
    $initRangeList(): void;

    /**
     * Returns a concatenation of all the ranges.
     * @returns {Range[]}
     **/
    getAllRanges(): Range[];

    /**
     * Splits all the ranges into lines.
     **/
    splitIntoLines(): void;

    /**
     */
    joinSelections(): void;

    /**
     **/
    toggleBlockSelection(): void;

    /**
     *
     * Gets list of ranges composing rectangular block on the screen
     *
     * @param {ScreenCoordinates} screenCursor The cursor to use
     * @param {ScreenCoordinates} screenAnchor The anchor to use
     * @param {Boolean} [includeEmptyLines] If true, this includes ranges inside the block which are empty due to clipping
     * @returns {Range[]}
     **/
    rectangularRangeBlock(screenCursor: ScreenCoordinates, screenAnchor: ScreenCoordinates, includeEmptyLines?: boolean): Range[];

    _eventRegistry?: any;
    index?: number;
}

export type AcePopupEventsCombined = EditorEvents & AcePopupEvents;
export type AcePopupWithEditor = EventEmitter<AcePopupEventsCombined> & Editor;
export type InlineAutocompleteAction = "prev" | "next" | "first" | "last";

export type TooltipCommandFunction<T> = (editor: Editor) => T;

export interface TooltipCommand extends Command {
    enabled?: TooltipCommandFunction<boolean> | boolean,
    getValue?: TooltipCommandFunction<any>,
    type: "button" | "text" | "checkbox"
    iconCssClass?: string,
    cssClass?: string
}

export type TokenizeResult = Array<Array<{
    className?: string,
    value: string,
}>>

export interface StaticHighlightOptions {
    mode?: string | SyntaxMode,
    theme?: string | Theme,
    trim?: boolean,
    firstLineNumber?: number,
    showGutter?: boolean
}

export interface Operation {
    command: {
        name?: string;
    };
    args: any;
    selectionBefore?: Range | Range[];
    selectionAfter?: Range | Range[];
    docChanged?: boolean;
    selectionChanged?: boolean;
}

export interface CommandBarEvents {
    "hide": () => void;
    "show": () => void;
    "alwaysShow": (e: boolean) => void;
}

export interface FontMetricsEvents {
    "changeCharacterSize": (e: { data: { height: number, width: number } }) => void;
}

export interface OptionPanelEvents {
    "setOption": (e: { name: string, value: any }) => void;
}

export interface ScrollbarEvents {
    "scroll": (e: { data: number }) => void;
}