/// <reference path="./ace-modes.d.ts" />
/// <reference path="./ace-extensions.d.ts" />

export namespace Ace {
    type Anchor = import("./src/anchor").Anchor;
    type Editor = import("./src/editor").Editor;
    type EditSession = import("./src/edit_session").EditSession;
    type Document = import("./src/document").Document;
    type Fold = import("./src/edit_session/fold").Fold;
    type FoldLine = import("./src/edit_session/fold_line").FoldLine;
    type Range = import("./src/range").Range;
    type VirtualRenderer = import("./src/virtual_renderer").VirtualRenderer;
    type UndoManager = import("./src/undomanager").UndoManager;
    type Tokenizer = import("./src/tokenizer").Tokenizer;
    type TokenIterator = import("./src/token_iterator").TokenIterator;
    type Selection = import("./src/selection").Selection;
    type Autocomplete = import("./src/autocomplete").Autocomplete;
    type CompletionProvider = import("./src/autocomplete").CompletionProvider;
    type AcePopup = import("./src/autocomplete/popup").AcePopup;
    type Config = import("./src/config").Config;
    type AceInline = import("./src/autocomplete/inline").AceInline;
    type MouseEvent = import("./src/mouse/mouse_event").MouseEvent;
    type RangeList = import("./src/range_list").RangeList;
    type FilteredList = import("./src/autocomplete").FilteredList;
    interface Theme {
        cssClass?: string;
        cssText?: string;
        $id?: string;
        padding?: number | string;
        isDark?: boolean;
    }
    interface ScrollBar {
        setVisible(visible: boolean): void;
        [key: string]: any;
    }

    interface HScrollbar extends ScrollBar {
        setWidth(width: number): void;
    }

    interface VScrollbar extends ScrollBar {
        setHeight(width: number): void;
    }

    interface LayerConfig {
        width : number,
        padding : number,
        firstRow : number,
        firstRowScreen: number,
        lastRow : number,
        lineHeight : number,
        characterWidth : number,
        minHeight : number,
        maxHeight : number,
        offset : number,
        height : number,
        gutterOffset: number
    }
    interface HardWrapOptions {
        startRow: number;
        endRow: number;
        allowMerge?: boolean;
        column?: number;
    }

    interface CommandBarOptions {
        maxElementsOnTooltip: number;
        alwaysShow: boolean;
        showDelay: number;
        hideDelay: number;
    }
    interface ScreenCoordinates {
        row: number,
        column: number,
        side?: 1 | -1,
        offsetX?: number
    }

    interface Folding {
        $foldData: FoldLine[];
        /**
         * Looks up a fold at a given row/column. Possible values for side:
         *   -1: ignore a fold if fold.start = row/column
         *   +1: ignore a fold if fold.end = row/column
         **/
        getFoldAt(row: number, column: number, side?: number): Ace.Fold;
        /**
         * Returns all folds in the given range. Note, that this will return folds
         **/
        getFoldsInRange(range: Ace.Range | Ace.Delta): Ace.Fold[];
        getFoldsInRangeList(ranges: Ace.Range[] | Ace.Range): Ace.Fold[];
        /**
         * Returns all folds in the document
         */
        getAllFolds(): Ace.Fold[];
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
        getFoldStringAt(row: number, column: number, trim?: number, foldLine?: Ace.FoldLine): string | null;
        getFoldLine(docRow: number, startFoldLine?: Ace.FoldLine): null | Ace.FoldLine;
        /**
         * Returns the fold which starts after or contains docRow
         */
        getNextFoldLine(docRow: number, startFoldLine?: Ace.FoldLine): null | Ace.FoldLine;
        getFoldedRowCount(first: number, last: number): number;
        $addFoldLine(foldLine: FoldLine): Ace.FoldLine;
        /**
         * Adds a new fold.
         * @returns {Ace.Fold}
         *      The new created Fold object or an existing fold object in case the
         *      passed in range fits an existing fold exactly.
         */
        addFold(placeholder: Ace.Fold | string, range?: Ace.Range): Ace.Fold;
        $modified: boolean;
        addFolds(folds: Ace.Fold[]): void;
        removeFold(fold: Ace.Fold): void;
        removeFolds(folds: Ace.Fold[]): void;
        expandFold(fold: Ace.Fold): void;
        expandFolds(folds: Ace.Fold[]): void;
        unfold(location?: number | null | Ace.Point | Ace.Range | Ace.Range[], expandInner?: boolean): Ace.Fold[] | undefined;
        /**
         * Checks if a given documentRow is folded. This is true if there are some
         * folded parts such that some parts of the line is still visible.
         **/
        isRowFolded(docRow: number, startFoldRow?: Ace.FoldLine): boolean;
        getRowFoldEnd(docRow: number, startFoldRow?: Ace.FoldLine): number;
        getRowFoldStart(docRow: number, startFoldRow?: Ace.FoldLine): number;
        getFoldDisplayLine(foldLine: Ace.FoldLine, endRow?: number | null, endColumn?: number | null, startRow?: number | null, startColumn?: number | null): string;
        getDisplayLine(row: number, endColumn: number | null, startRow: number | null, startColumn: number | null): string;
        $cloneFoldData(): Ace.FoldLine[];
        toggleFold(tryToUnfold?: boolean): void;
        getCommentFoldRange(row: number, column: number, dir?: number): Ace.Range | undefined;
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
        $setFolding(foldMode: Ace.FoldMode): void;
        $foldMode: any;
        foldWidgets: any[];
        getFoldWidget: any;
        getFoldWidgetRange: any;
        $updateFoldWidgets: any;
        $tokenizerUpdateFoldWidgets: any;
        getParentFoldRangeData(row: number, ignoreCurrent?: boolean): {
            range?: Ace.Range;
            firstRange?: Ace.Range;
        };
        onFoldWidgetClick(row: number, e: any): void;
        $toggleFoldWidget(row: number, options: any): Fold | any;
        /**
         *
         * @param {boolean} [toggleParent]
         */
        toggleFoldWidget(toggleParent?: boolean): void;
        updateFoldWidgets(delta: Ace.Delta): void;
        tokenizerUpdateFoldWidgets(e: any): void;
    }

    interface BracketMatch {
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
    interface IRange {
        start: Point;
        end: Point;
    }
    interface LineWidget {
        el: HTMLElement;
        rowCount: number;
        hidden: boolean;
        _inDocument: boolean;
        column?: number;
        row?: number;
        $oldWidget?: LineWidget,
        session: EditSession,
        html?: string,
        text?: string,
        className?: string,
        coverGutter?: boolean,
        pixelHeight?: number,
        $fold?: Fold,
        editor: Editor,
        coverLine?: boolean,
        fixedWidth?: boolean,
        fullWidth?: boolean,
        screenWidth?: number,
        rowsAbove?: number,
        lenses?: any[],
    }

    type NewLineMode = 'auto' | 'unix' | 'windows';

    interface EditSessionOptions {
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

    interface VirtualRendererOptions {
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
        fontSize: string;
        fontFamily: string;
        maxLines: number;
        minLines: number;
        scrollPastEnd: boolean;
        fixedWidthGutter: boolean;
        customScrollbar: boolean;
        theme: string;
        hasCssTransforms: boolean;
        maxPixelHeight: number;
        useSvgGutterIcons: boolean;
        showFoldedAnnotations: boolean;
        useResizeObserver: boolean;
    }

    interface MouseHandlerOptions {
        scrollSpeed: number;
        dragDelay: number;
        dragEnabled: boolean;
        focusTimeout: number;
        tooltipFollowsMouse: boolean;
    }

    interface EditorOptions extends EditSessionOptions,
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
    }

    interface EventsBase {
        [key: string]: any;
    }

    interface EditSessionEvents {
        /**
         * Emitted when the document changes.
         * @param delta
         */
        "change": (delta: Delta) => void;
        /**
         * Emitted when the tab size changes, via [[EditSession.setTabSize]].
         * @param tabSize
         */
        "changeTabSize": (tabSize: number) => void;
        /**
         * Emitted when the ability to overwrite text changes, via [[EditSession.setOverwrite]].
         * @param overwrite
         */
        "changeOverwrite": (overwrite: boolean) => void;
        /**
         * Emitted when the gutter changes, either by setting or removing breakpoints, or when the gutter decorations change.
         * @param e
         */
        "changeBreakpoint": (e: { row: number, breakpoint: boolean }) => void;
        /**
         * Emitted when a front marker changes.
         * @param e
         */
        "changeFrontMarker": (e: { row: number, marker: boolean }) => void;
        /**
         * Emitted when a back marker changes.
         * @param e
         */
        "changeBackMarker": (e: { row: number, marker: boolean }) => void;
        /**
         * Emitted when an annotation changes, like through [[EditSession.setAnnotations]].
         * @param e
         */
        "changeAnnotation": (e: { row: number, lines: string[] }) => void;
        /**
         * Emitted when a background tokenizer asynchronously processes new rows.
         */
        "tokenizerUpdate": (e: {data: { first: string, last: string }}) => void;
        /**
         * Emitted when the current mode changes.
         * @param e
         */
        "changeMode": (e) => void;
        /**
         * Emitted when the wrap mode changes.
         * @param e
         */
        "changeWrapMode": (e) => void;
        /**
         * Emitted when the wrapping limit changes.
         * @param e
         */
        "changeWrapLimit": (e) => void;
        /**
         * Emitted when a code fold is added or removed.
         * @param e
         */
        "changeFold": (e, session: EditSession) => void;
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
        "changeEditor": (e: { editor: Editor }) => void;
    }

    interface EditorEvents{
        "change": (delta: Delta) => void;
        "changeSelection": () => void;
        "input": () => void;
        /**
         * Emitted whenever the [[EditSession]] changes.
         * @param e An object with two properties, `oldSession` and `session`, that represent the old and new [[EditSession]]s.
         **/
        "changeSession": (e: {oldSession: EditSession, session: EditSession}) => void;
        "blur": (e) => void;
        "mousedown": (e: MouseEvent) => void;
        "mousemove": (e: MouseEvent & {scrollTop?}) => void;
        "changeStatus": () => void;
        "keyboardActivity": () => void;
        "mousewheel": (e: MouseEvent) => void;
        "mouseup": (e: MouseEvent) => void;
        "beforeEndOperation": (e) => void;
        "nativecontextmenu": (e) => void;
        "destroy": () => void;
        "focus": () => void;
        /**
         * Emitted when text is copied.
         * @param text The copied text
         **/
        "copy": (text: string) => void;
        /**
         * Emitted when text is pasted.
         **/
        "paste": (text: string, event) => void;
        /**
         * Emitted when the selection style changes, via [[Editor.setSelectionStyle]].
         * @param data Contains one property, `data`, which indicates the new selection style
         **/
        "changeSelectionStyle": (data: "fullLine" | "screenLine" | "text" | "line") => void;
    }

    interface AcePopupEvents{
        "click": (e: MouseEvent) => void;
        "dblclick": (e: MouseEvent) => void;
        "tripleclick": (e: MouseEvent) => void;
        "quadclick": (e: MouseEvent) => void;
        "show": () => void;
        "hide": () => void;
        "select": (hide: boolean) => void;
        "changeHoverMarker": (e) => void;
    }

    interface DocumentEvents {
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

    interface AnchorEvents {
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

    interface BackgroundTokenizerEvents {
        /**
         * Fires whenever the background tokeniziers between a range of rows are going to be updated.
         * @param {Object} e An object containing two properties, `first` and `last`, which indicate the rows of the region being updated.
         **/
        "update": (e: {first:number, last:number}) => void;
    }

    interface SelectionEvents {
        /**
         * Emitted when the cursor position changes.
         **/
        "changeCursor": () => void;
        /**
         * Emitted when the cursor selection changes.
         **/
        "changeSelection": () => void;
    }

    interface PlaceHolderEvents {

    }

    interface GutterEvents {
        "changeGutterWidth": (width: number) => void;
    }

    interface TextEvents {
        "changeCharacterSize": (e) => void;
    }

    interface VirtualRendererEvents {
        "afterRender": (e, renderer: VirtualRenderer) => void;
        "beforeRender": (e, renderer: VirtualRenderer) => void;
    }

    class EventEmitter<T extends EventsBase> {
        once<K extends keyof T>(name: K, callback: T[K]): void;

        setDefaultHandler(name: string, callback: Function): void;

        removeDefaultHandler(name: string, callback: Function): void;

        on<K extends keyof T>(name: K, callback: T[K], capturing?: boolean): T[K];

        addEventListener<K extends keyof T>(name: K, callback: T[K], capturing?: boolean): T[K];

        off<K extends keyof T>(name: K, callback: T[K]): void;

        removeListener<K extends keyof T>(name: K, callback: T[K]): void;

        removeEventListener<K extends keyof T>(name: K, callback: T[K]): void;

        removeAllListeners(name?: string): void;

        _signal(eventName: string, e: any): void;

        _emit(eventName: string, e: any): void;
        _dispatchEvent(eventName: string, e: any): void;
    }

    interface SearchOptions {
        needle: string | RegExp;
        preventScroll: boolean;
        backwards: boolean;
        start: Range;
        skipCurrent: boolean;
        range: Range;
        preserveCase: boolean;
        regExp: boolean;
        wholeWord: boolean;
        caseSensitive: boolean;
        wrap: boolean;
        re: RegExp;
    }

    interface Point {
        row: number;
        column: number;
    }

    type Position = Point;

    interface Delta {
        action: 'insert' | 'remove';
        start: Point;
        end: Point;
        lines: string[];
        id?: number,
        folds?: Fold[]
    }

    interface Annotation {
        row?: number;
        column?: number;
        text: string;
        type: string;
    }

    export interface MarkerGroupItem {
        range: Range;
        className: string;
    }

    type MarkerGroup = import("./src/marker_group").MarkerGroup;


    export interface Command {
        name?: string;
        bindKey?: string | { mac?: string, win?: string };
        readOnly?: boolean;
        exec?: (editor?: Editor | any, args?: any) => void;
        isAvailable?: (editor: Editor) => boolean;
        description?: string,
        multiSelectAction?: "forEach"|"forEachLine"|Function,
        scrollIntoView?: true|"cursor"|"center"|"selectionPart"|"animate"|"selection"|"none",
        aceCommandGroup?: string,
        passEvent?: boolean,
        level?: number,
        action?: string,
    }

    type CommandLike = Command | ((editor: Editor) => void);

    type KeyboardHandler = import("./src/keyboard/hash_handler").HashHandler & {
        attach?: (editor: Editor) => void;
        detach?: (editor: Editor) => void;
        getStatusText?: (editor?: any, data?) => string;
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

    type MarkerRenderer = (html: string[],
                           range: Range,
                           left: number,
                           top: number,
                           config: any) => void;

    interface Token {
        type: string;
        value: string;
        index?: number;
        start?: number;
    }

    type BaseCompletion = import("./src/autocomplete").BaseCompletion;
    type SnippetCompletion = import("./src/autocomplete").SnippetCompletion;
    type ValueCompletion = import("./src/autocomplete").ValueCompletion;
    type Completion = import("./src/autocomplete").Completion;

    type HighlightRule = ({ defaultToken: string } | { include: string } | { todo: string } | {
        token: string | string[] | ((value: string) => string);
        regex: string | RegExp;
        next?: string | (() => void);
        push?: string;
        comment?: string;
        caseInsensitive?: boolean;
        nextState?: string;
    }) & { [key: string]: any };

    type HighlightRulesMap = Record<string, HighlightRule[]>;

    type KeywordMapper = (keyword: string) => string;

    interface HighlightRules {
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

    type FoldWidget = "start" | "end" | ""

    interface FoldMode {
        foldingStartMarker: RegExp;
        foldingStopMarker?: RegExp;

        getFoldWidget(session: EditSession, foldStyle: string, row: number): FoldWidget;

        getFoldWidgetRange(session: EditSession, foldStyle: string, row: number): Range | undefined;

        indentationBlock(session: EditSession, row: number, column?: number): Range | undefined;

        openingBracketBlock(session: EditSession, bracket: string, row: number, column: number, typeRe?: RegExp): Range | undefined;

        closingBracketBlock(session: EditSession, bracket: string, row: number, column: number, typeRe?: RegExp): Range | undefined;
    }

    type BehaviorAction = (state: string, action: string, editor: Editor, session: EditSession, text: string | Range) => ({ text: string, selection: number[] } | Range) & {[key: string]: any} | undefined;
    type BehaviorMap = Record<string, Record<string, BehaviorAction>>;

    interface Behaviour {
        add(name: string, action: string, callback: BehaviorAction): void;

        addBehaviours(behaviours: BehaviorMap): void;

        remove(name: string): void;

        inherit(mode: SyntaxMode | (new () => SyntaxMode), filter: string[]): void;

        getBehaviours(filter?: string[]): BehaviorMap;
    }

    interface Outdent {
        checkOutdent(line: string, input: string): boolean;

        autoOutdent(doc: Document, row: number): number | undefined;
    }

    interface SyntaxMode {
        /**
         * quotes used by language mode
         */
        $quotes: {[quote: string]: string};
        HighlightRules: {
            new(config: any): HighlightRules
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
        blockComment?: {start: string, end: string}
        tokenRe?: RegExp;
        nonTokenRe?: RegExp;
        /**
         * An object containing conditions to determine whether to apply matching quote or not.
         */
        $pairQuotesAfter: {[quote: string]: RegExp}
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

        toggleCommentLines(state: any,
                           session: EditSession,
                           startRow: number,
                           endRow: number): void;

        toggleBlockComment(state: any,
                           session: EditSession,
                           range: Range,
                           cursor: Point): void;

        getNextLineIndent(state: any, line: string, tab: string): string;

        checkOutdent(state: any, line: string, input: string): boolean;

        autoOutdent(state: any, doc: EditSession, row: number): void;

        // TODO implement WorkerClient types
        createWorker(session: EditSession): any;

        createModeDelegates(mapping: { [key: string]: string }): void;

        getKeywords(append?: boolean): Array<string | RegExp>;

        getCompletions(state: string,
                       session: EditSession,
                       pos: Point,
                       prefix: string): Completion[];

        $getIndent(line: string): string;
        $createKeywordList(): string[];
        $delegator(method: string, args: IArguments, defaultHandler): any;

    }

    interface OptionsBase {
        [key: string]: any;
    }

    class OptionsProvider<T extends OptionsBase> {
        setOptions(optList: Partial<T>): void;

        getOptions(optionNames?: Array<keyof T> | Partial<T>): Partial<T>;

        setOption<K extends keyof T>(name: K, value: T[K]): void;

        getOption<K extends keyof T>(name: K): T[K];
    }

    type KeyBinding = import("./src/keyboard/keybinding").KeyBinding;
    interface CommandMap {
        [name: string]: Command;
    }

    type execEventHandler = (obj: {
        editor: Editor,
        command: Command,
        args: any[]
    }) => void;

    interface CommandManagerEvents {
        on(name: 'exec', callback: execEventHandler): Function;
        on(name: 'afterExec', callback: execEventHandler): Function;
    }
    type CommandManager = import("./src/commands/command_manager").CommandManager;


    interface SavedSelection {
        start: Point;
        end: Point;
        isBackwards: boolean;
    }

    var Selection: {
        new(session: EditSession): Selection;
    }

    interface TextInput {
        resetSelection(): void;

        setAriaOption(options?: {activeDescendant: string, role: string, setLabel}): void;
    }

    type CompleterCallback = (error: any, completions: Completion[]) => void;

    interface Completer {
        identifierRegexps?: Array<RegExp>,

        getCompletions(editor: Editor,
                       session: EditSession,
                       position: Point,
                       prefix: string,
                       callback: CompleterCallback): void;

        getDocTooltip?(item: Completion): void | string | Completion;

        cancel?(): void;

        id?: string;
    triggerCharacters?: string[];
    hideInlinePreview?: boolean;
    }

    interface CompletionOptions {
        matches?: Completion[];
    }

    type CompletionProviderOptions = {
        exactMatch?: boolean;
        ignoreCaption?: boolean;
    }

    type GatherCompletionRecord = {
        prefix: string;
        matches: Completion[];
        finished: boolean;
    }

    type CompletionCallbackFunction = (err: Error | undefined, data: GatherCompletionRecord) => void;
    type CompletionProviderCallback = (this: import("./src/autocomplete").Autocomplete, err: Error | undefined, completions: import("./src/autocomplete").FilteredList, finished: boolean) => void;

    type AcePopupNavigation = "up" | "down" | "start" | "end";

}


export const version: string;
export const config: Ace.Config;
export function require(name: string): any;
export function edit(el: string | (Element & {
    env?;
    value?;
}), options?: Partial<Ace.EditorOptions>): Ace.Editor;
export function createEditSession(text: Ace.Document | string, mode: Ace.SyntaxMode): Ace.EditSession;
export const VirtualRenderer: {
    new(container: HTMLElement, theme?: string): Ace.VirtualRenderer;
};
export const EditSession: {
    new(text: string | Ace.Document, mode?: Ace.SyntaxMode): Ace.EditSession;
};
export const UndoManager: {
    new(): Ace.UndoManager;
};
export const Editor: {
    new(): Ace.Editor;
};
export const Range: {
    new(startRow: number, startColumn: number, endRow: number, endColumn: number): Ace.Range;
    fromPoints(start: Ace.Point, end: Ace.Point): Ace.Range;
    comparePoints(p1: Ace.Point, p2: Ace.Point): number;
};


type InlineAutocompleteAction = "prev" | "next" | "first" | "last";

type TooltipCommandFunction<T> = (editor: Ace.Editor) => T;

export interface TooltipCommand extends Ace.Command {
    enabled: TooltipCommandFunction<boolean> | boolean,
    getValue?: TooltipCommandFunction<any>,
    type: "button" | "text" | "checkbox"
    iconCssClass?: string,
    cssClass?: string
}

export type InlineAutocomplete = import("./src/ext/inline_autocomplete").InlineAutocomplete;
export type CommandBarTooltip = import("./src/ext/command_bar").CommandBarTooltip;


declare module "./src/anchor" {
    export interface Anchor extends Ace.EventEmitter<Ace.AnchorEvents> {
        markerId?: number;
    }
    

}

declare module "./src/autocomplete" {
    export interface Autocomplete {
        popup: Ace.AcePopup;
        setSelectOnHover: boolean;
        stickySelectionDelay: number;
    }
    
    export interface CompletionProvider {
        completions: Ace.FilteredList;
    }
}


declare module "./src/background_tokenizer" {
    export interface BackgroundTokenizer extends Ace.EventEmitter<Ace.BackgroundTokenizerEvents> {

    }
}

declare module "./src/document" {
    export interface Document extends
        Ace.EventEmitter<Ace.DocumentEvents> {

    }

}

declare module "./src/editor" {
    export interface Editor extends
        Ace.EventEmitter<Ace.EditorEvents>,
        Ace.OptionsProvider<Ace.EditorOptions>,
        EditorMultiSelectProperties
    {
        session: Ace.EditSession;
        $mergeUndoDeltas?: any,
        $highlightSelectedWord?: boolean,
        $updatePlaceholder?: Function,
        $cursorStyle?: string,
        $readOnly?: any,
        $highlightActiveLine?: any,
        $enableAutoIndent?: any,
        $copyWithEmptySelection?: any
        $selectionStyle?: string,
        env?: any;
        widgetManager?: import("./src/line_widgets").LineWidgets,
        completer?: import("./src/autocomplete").Autocomplete | import("./src/ext/inline_autocomplete").InlineAutocomplete,
        completers: Ace.Completer[],
        $highlightTagPending?: boolean,
        showKeyboardShortcuts?: () => void,
        showSettingsMenu?: () => void,
        searchBox?: import("./src/ext/searchbox").SearchBox,
        [key: string]: any;
    }

    interface EditorMultiSelectProperties {
        inMultiSelectMode?: boolean,
        /**
         * Updates the cursor and marker layers.
         **/
        updateSelectionMarkers: () => void,
        /**
         * Adds the selection and cursor.
         * @param orientedRange A range containing a cursor
         **/
        addSelectionMarker: (orientedRange: Ace.Range & {marker?}) => Ace.Range & {marker?},
        /**
         * Removes the selection marker.
         * @param range The selection range added with [[Editor.addSelectionMarker `addSelectionMarker()`]].
         **/
        removeSelectionMarker: (range: Ace.Range & {marker?}) => void,
        removeSelectionMarkers: (ranges: (Ace.Range & {marker?})[]) => void,
        $onAddRange: (e) => void,
        $onRemoveRange: (e) => void,
        $onMultiSelect: (e) => void,
        $onSingleSelect: (e) => void,
        $onMultiSelectExec: (e) => void,
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
        $checkMultiselectChange: (e, anchor: Ace.Anchor) => void,
        /**
         * Finds and selects all the occurrences of `needle`.
         * @param needle The text to find
         * @param options The search options
         * @param additive keeps
         * @returns {Number} The cumulative count of all found matches
         **/
        findAll: (needle?: string, options?: Partial<Ace.SearchOptions>, additive?: boolean) => number,
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
    }
}

declare module "./src/edit_session" {
    export interface EditSession extends
        Ace.EventEmitter<Ace.EditSessionEvents>,
        Ace.OptionsProvider<Ace.EditSessionOptions>,
        Ace.Folding, Ace.BracketMatch
    {
        doc: Ace.Document,
        $highlightLineMarker?: {
            start: Ace.Point,
            end: Ace.Point,
            id?: number
        }
        $useSoftTabs?: boolean,
        $tabSize?: number,
        $useWorker?: boolean,
        $wrapAsCode?: boolean,
        $indentedSoftWrap?: boolean,
        widgetManager?: any,
        $bracketHighlight?: any,
        $selectionMarker?: number,
        curOp?: {
            command: {},
            args: string,
            scrollTop: number,
            [key: string]: any;
        },
        lineWidgetsWidth?: number,
        $getWidgetScreenLength?: () => number,
        _changedWidgets?: any,
        $options:any,

        $wrapMethod?: any,
        $enableVarChar?: any,
        $wrap?:any,
        $navigateWithinSoftTabs?: boolean,
        getSelectionMarkers(): any[],
        [key: string]: any;
    }
}

declare module "./src/edit_session/fold" {
    export interface Fold {
        collapseChildren?: number;    
    }   
}

// @ts-expect-error
declare module "./src/placeholder" {
    export interface PlaceHolder extends Ace.EventEmitter<Ace.PlaceHolderEvents> {
    }
}

declare module "./src/scrollbar" {
    export interface Scrollbar extends Ace.EventEmitter<any> {
    }
    export interface VScrollBar extends Scrollbar {
    }
    export interface HScrollBar extends Scrollbar {
    }
}

declare module "./src/scrollbar_custom" {
    export interface Scrollbar extends Ace.EventEmitter<any> {
    }
    export interface VScrollBar extends Scrollbar {
    }
    export interface HScrollBar extends Scrollbar {
    }
}

declare module "./src/line_widgets" {
    export interface LineWidgets {
        lineWidgets: Ace.LineWidget[];
        editor: Ace.Editor;
    }
}

declare module "./src/selection" {
    export interface Selection extends Ace.EventEmitter<Ace.SelectionEvents>, MultiSelectProperties {
    }

    interface MultiSelectProperties {
        ranges: Ace.Range[] | null;
        rangeList: Ace.RangeList | null;
        /**
         * Adds a range to a selection by entering multiselect mode, if necessary.
         * @param {Ace.Range} range The new range to add
         * @param {Boolean} [$blockChangeEvents] Whether or not to block changing events
         **/
        addRange(range: Ace.Range, $blockChangeEvents?: boolean): any;
        inMultiSelectMode: boolean;
        /**
         * @param {Ace.Range} [range]
         **/
        toSingleRange(range?: Ace.Range): void;
        /**
         * Removes a Range containing pos (if it exists).
         * @param {Ace.Point} pos The position to remove, as a `{row, column}` object
         **/
        substractPoint(pos: Ace.Point): any;
        /**
         * Merges overlapping ranges ensuring consistency after changes
         **/
        mergeOverlappingRanges(): void;
        /**
         * @param {Ace.Range} range
         */
        $onAddRange(range: Ace.Range): void;
        rangeCount: number;
        /**
         *
         * @param {Ace.Range[]} removed
         */
        $onRemoveRange(removed: Ace.Range[]): void;
        /**
         * adds multicursor support to selection
         */
        $initRangeList(): void;
        /**
         * Returns a concatenation of all the ranges.
         * @returns {Ace.Range[]}
         **/
        getAllRanges(): Ace.Range[];
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
         * @param {Ace.ScreenCoordinates} screenCursor The cursor to use
         * @param {Ace.ScreenCoordinates} screenAnchor The anchor to use
         * @param {Boolean} [includeEmptyLines] If true, this includes ranges inside the block which are empty due to clipping
         * @returns {Ace.Range[]}
         **/
        rectangularRangeBlock(screenCursor: Ace.ScreenCoordinates, screenAnchor: Ace.ScreenCoordinates, includeEmptyLines?: boolean): Ace.Range[];

        _eventRegistry?: any;
        index?: number;
    }
}

declare module "./src/range" {
    export interface Range {
        id?: number;
        cursor?: Ace.Point;
        isBackwards?: boolean;
    }   
}

declare module "./src/virtual_renderer" {
    export interface VirtualRenderer extends
        Ace.EventEmitter<Ace.VirtualRendererEvents>, Ace.OptionsProvider<Ace.VirtualRendererOptions> {
        $customScrollbar?: boolean,
        $extraHeight?: number,
        $showGutter?: boolean,
        $showPrintMargin?: boolean,
        $printMarginColumn?: number,
        $animatedScroll?: boolean,
        $isMousePressed?: boolean,
        textarea?: HTMLTextAreaElement,
        $hScrollBarAlwaysVisible?: boolean,
        $vScrollBarAlwaysVisible?: boolean
        $maxLines?: number | null,
        $scrollPastEnd?: number,
        enableKeyboardAccessibility?: boolean,
        keyboardFocusClassName?: string,
        $highlightGutterLine?: boolean,
        $minLines?: number,
        $maxPixelHeight?: number,
        $gutterWidth?: number,
        showInvisibles?: boolean,
        $hasCssTransforms?: boolean,
        $blockCursor?: boolean,
        $useTextareaForIME?: boolean,
        theme?: any,
        $theme?: any,
        destroyed?: boolean,
        session: Ace.EditSession,
    }

}

declare module "./src/snippets" {
    export interface SnippetManager extends Ace.EventEmitter<any> {
    }
}

declare module "./src/ext/command_bar" {
    export interface CommandBarTooltip extends Ace.EventEmitter<any> {
        $shouldHideMoreOptions?: boolean,
    }
}

declare module "./src/commands/command_manager" {
    export interface CommandManager extends Ace.EventEmitter<any> {
        $checkCommandState?: boolean
    }
}

declare module "./src/autocomplete/popup" {
    type AcePopupEventsCombined = Ace.EditorEvents & Ace.AcePopupEvents;
    type AcePopupWithEditor = Ace.EventEmitter<AcePopupEventsCombined> & Ace.Editor;
    export interface AcePopup extends AcePopupWithEditor  {
        setSelectOnHover: (val: boolean) => void,
        setRow: (line: number) => void,
        getRow: () => number,
        getHoveredRow: () => number,
        filterText: string,
        isOpen: boolean,
        isTopdown: boolean,
        autoSelect: boolean,
        data: Ace.Completion[],
        setData: (data: Ace.Completion[], filterText: string) => void,
        getData: (row: number) => Ace.Completion,
        hide: () => void,
        anchor: "top" | "bottom",
        anchorPosition: Ace.Point,
        tryShow: (pos: any, lineHeight: number, anchor: "top" | "bottom" | undefined, forceShow?: boolean) => boolean,
        $borderSize: number,
        show: (pos: any, lineHeight: number, topdownOnly?: boolean) => void,
        goTo: (where: Ace.AcePopupNavigation) => void,
        getTextLeftOffset: () => number,
        $imageSize: number,
        anchorPos: any
    }
}

declare module "./src/layer/cursor" {
    export interface Cursor {
        timeoutId?: number;
    }
}

declare module "./src/layer/gutter" {
    export interface Gutter extends Ace.EventEmitter<Ace.GutterEvents> {
        $useSvgGutterIcons?: boolean,
        $showFoldedAnnotations?: boolean,
    }
}

declare module "./src/layer/text" {
    export interface Text extends Ace.EventEmitter<Ace.TextEvents> {
    }
}

declare module "./src/lib/app_config" {
    export interface AppConfig extends Ace.EventEmitter<any> {
    }
}

declare module "./src/mouse/mouse_handler" {
    type DefaultHandlers = import("./src/mouse/default_handlers").DefaultHandlers;
    //@ts-ignore
    type GutterHandler = import("./src/mouse/default_gutter_handler").GutterHandler;
    type DragdropHandler = import("./src/mouse/dragdrop_handler").DragdropHandler;

    export interface MouseHandler extends DefaultHandlers, GutterHandler, DragdropHandler {
        $tooltipFollowsMouse?: boolean,
        cancelDrag?: boolean
    }
}

// @ts-expect-error
declare module "./src/ext/options" {
    export interface OptionPanel extends Ace.EventEmitter<any> {
    }
}

declare module "./src/layer/font_metrics" {
    export interface FontMetrics extends Ace.EventEmitter<any> {
    }
}
