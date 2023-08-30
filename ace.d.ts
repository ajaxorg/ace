/// <reference path="./ace-modes.d.ts" />

declare namespace Ace {
    interface FoldingProperties {
        $foldMode: FoldMode,
        foldWidgets: FoldWidget[],
        getFoldWidget: FoldMode.getFoldWidget,
        getFoldWidgetRange: FoldMode.getFoldWidgetRange,
        $updateFoldWidgets: (delta: Delta) => void,
        $tokenizerUpdateFoldWidgets: (e) => void,
        addFold: (placeholder: Fold|String, range?: Range) => Fold,
        removeFold: (fold: Fold) => void,
        removeFolds: (folds: Fold[]) => void,
        setFoldStyle: (style: string) => void,
        $setFolding: (foldMode: FoldMode) => void,
    }
    
    interface AcePopupProperties {
        setSelectOnHover?: (val: boolean) => void,
        setRow?: (line: number) => void,
        getRow?: () => number,
        getHoveredRow?: () => number,
        filterText?: string,
        isOpen?: boolean,
        isTopdown?: boolean,
        autoSelect?: boolean,
        data?: Completion[],
        setData?: (data: Completion[], filterText: string) => void,
        getData?: (row: number) => Completion,
        hide?: () => void,
        anchor?: "top" | "bottom",
        anchorPosition?: Point,
        tryShow?: (pos: any, lineHeight: number, anchor: "top" | "bottom" | undefined, forceShow?: boolean) => boolean,
        $borderSize?: number,
        show?: (pos: any, lineHeight: number, topdownOnly?: boolean) => void,
        goTo?: (where: AcePopupNavigation) => void,
        getTextLeftOffset?: () => number,
        $imageSize?: number,
        anchorPos?: any
    }
    interface ISelection {
        session: IEditSession;
        doc: IDocument;
        cursor: Anchor;
        anchor: Anchor;
        $silent: boolean;
        lead: Anchor;
        $cursorChanged?:boolean;
        $isEmpty?:boolean;
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
        session: IEditSession,
        html?: string,
        text?: string,
        className?: string,
        coverGutter?: boolean,
        pixelHeight?: number,
        $fold?: Fold,
        editor: IEditor,
        coverLine?: boolean,
        fixedWidth?: boolean,
        fullWidth?: boolean,
        screenWidth?: number,
        rowsAbove?: number,
    }
    
    interface EditorProperties {
        $mergeUndoDeltas?: any,
        $highlightSelectedWord?: boolean,
        $updatePlaceholder?: Function,
        $cursorStyle?: string,
        $readOnly?: any,
        searchBox?: any,
        $highlightActiveLine?: any,
        $enableAutoIndent?: any,
        $copyWithEmptySelection?: any
        $selectionStyle?: string,
        env?: any;
        widgetManager?: LineWidgets,
        completer?: Autocomplete,
        completers?: Completer[],
        $highlightTagPending?: boolean,
    }

    interface EditSessionProperties {
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
            scrollTop: number
        },
        lineWidgetsWidth?: number,
        $getWidgetScreenLength?: () => number,
        _changedWidgets?: any,
        $options:any,
        $wrapMethod?: any,
        $enableVarChar?: any,
        $wrap?:any,
        $navigateWithinSoftTabs?: boolean
    }

    interface EditorMultiSelectProperties {
        inMultiSelectMode?: boolean,
        forEachSelection?: Function,
        exitMultiSelectMode?: Function
    }

    interface VirtualRendererProperties {
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
        $maxLines?: number,
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
        fontSize: number;
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
        selectionStyle: string;
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
    }

    class EventEmitter {
        once?(name: string, callback: Function): void;

        setDefaultHandler?(name: string, callback: Function): void;

        removeDefaultHandler?(name: string, callback: Function): void;

        on?(name: string, callback: Function, capturing?: boolean): Function;

        addEventListener?(name: string, callback: Function, capturing?: boolean): Function;

        off?(name: string, callback: Function): void;

        removeListener?(name: string, callback: Function): void;

        removeEventListener?(name: string, callback: Function): void;

        removeAllListeners?(name?: string): void;

        _signal?(eventName: string, e: any): void;

        _emit?(eventName: string, e: any): void;
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

    interface Command {
        name?: string;
        bindKey?: string | { mac?: string, win?: string };
        readOnly?: boolean;
        exec: (editor: Editor, args?: any) => void;
    }

    type CommandLike = Command | ((editor: Editor) => void);

    interface KeyboardHandler {
        handleKeyboard: Function;
    }

    interface MarkerLike {
        range?: Range;
        type?: string;
        renderer?: MarkerRenderer;
        clazz?: string;
        inFront?: boolean;
        id?: number;
        update?: (html: string[],
                  // TODO maybe define Marker class
                  marker: any,
                  session: EditSession,
                  config: any) => void;
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

    interface BaseCompletion {
        score?: number;
        meta?: string;
        caption?: string;
        docHTML?: string;
        docText?: string;
        completerId?: string;
    }

    interface SnippetCompletion extends BaseCompletion {
        snippet: string;
        value?: string;
    }

    interface ValueCompletion extends BaseCompletion {
        value: string;
        snippet?: string;
    }

    type Completion = SnippetCompletion | ValueCompletion



    type HighlightRule = { defaultToken: string } | { include: string } | { todo: string } | {
        token: string | string[] | ((value: string) => string);
        regex: string | RegExp;
        next?: string;
        push?: string;
        comment?: string;
        caseInsensitive?: boolean;
    }

    type HighlightRulesMap = Record<string, HighlightRule[]>;

    type KeywordMapper = (keyword: string) => string;

    interface HighlightRules {
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

        getFoldWidget(session: IEditSession, foldStyle: string, row: number): FoldWidget;

        getFoldWidgetRange(session: IEditSession, foldStyle: string, row: number): Range | undefined;

        indentationBlock(session: IEditSession, row: number, column?: number): Range | undefined;

        openingBracketBlock(session: IEditSession, bracket: string, row: number, column: number, typeRe?: RegExp): Range | undefined;

        closingBracketBlock(session: IEditSession, bracket: string, row: number, column: number, typeRe?: RegExp): Range | undefined;
    }

    type BehaviorAction = (state: string, action: string, editor: Editor, session: EditSession, text: string) => { text: string, selection: number[] } | Range | undefined;
    type BehaviorMap = Record<string, Record<string, BehaviorAction>>;

    interface Behaviour {
        add(name: string, action: string, callback: BehaviorAction): void;

        addBehaviours(behaviours: BehaviorMap): void;

        remove(name: string): void;

        inherit(mode: SyntaxMode | (new () => SyntaxMode), filter: string[]): void;

        getBehaviours(filter: string[]): BehaviorMap;
    }

    interface Outdent {
        checkOutdent(line: string, input: string): boolean;

        autoOutdent(doc: Document, row: number): number | undefined;
    }

    interface SyntaxMode {
        HighlightRules: HighlightRules;
        foldingRules?: FoldMode;
        $behaviour?: Behaviour;
        $defaultBehaviour?: Behaviour;
        lineCommentStart?: string;

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

        autoOutdent(state: any, doc: IEditSession, row: number): void;

        // TODO implement WorkerClient types
        createWorker(session: EditSession): any;

        createModeDelegates(mapping: { [key: string]: string }): void;

        transformAction: BehaviorAction;

        getKeywords(append?: boolean): Array<string | RegExp>;

        getCompletions(state: string,
                       session: EditSession,
                       pos: Point,
                       prefix: string): Completion[];
    }
    
    interface OptionsBase {
        [key: string]: any;
    }

    class OptionsProvider<T extends OptionsBase> {
        setOptions?(optList: Partial<T>): void;

        getOptions?(optionNames?: Array<keyof T> | Partial<T>): Partial<T>;

        setOption?<K extends keyof T>(name: K, value: K[T]): void;

        getOption?<K extends keyof T>(name: K): T[K];
    }


    interface KeyBinding {
        setDefaultHandler(handler: KeyboardHandler): void;

        setKeyboardHandler(handler: KeyboardHandler): void;

        addKeyboardHandler(handler: KeyboardHandler, pos?: number): void;

        removeKeyboardHandler(handler: KeyboardHandler): boolean;

        getKeyboardHandler(): KeyboardHandler;

        getStatusText(): string;

        onCommandKey(e: any, hashId: number, keyCode: number): boolean;

        onTextInput(text: string): boolean;
    }

    interface CommandMap {
        [name: string]: Command;
    }

    type execEventHandler = (obj: {
        editor: Editor,
        command: Command,
        args: any[]
    }) => void;

    interface CommandManager extends EventEmitter {
        byName: CommandMap,
        commands: CommandMap,

        on(name: 'exec', callback: execEventHandler): Function;

        on(name: 'afterExec', callback: execEventHandler): Function;

        once(name: string, callback: Function): void;

        setDefaultHandler(name: string, callback: Function): void;

        removeDefaultHandler(name: string, callback: Function): void;

        on(name: string, callback: Function, capturing?: boolean): void;

        addEventListener(name: string, callback: Function, capturing?: boolean): void;

        off(name: string, callback: Function): void;

        removeListener(name: string, callback: Function): void;

        removeEventListener(name: string, callback: Function): void;

        exec(command: string, editor: Editor, args: any): boolean;

        toggleRecording(editor: Editor): void;

        replay(editor: Editor): void;

        addCommand(command: Command): void;

        addCommands(command: Command[]): void;

        removeCommand(command: Command | string, keepCommand?: boolean): void;

        removeCommands(command: Command[]): void;

        bindKey(key: string | { mac?: string, win?: string },
                command: CommandLike,
                position?: number): void;

        bindKeys(keys: { [s: string]: Function }): void;

        parseKeys(keyPart: string): { key: string, hashId: number };

        findKeyCommand(hashId: number, keyString: string): string | undefined;

        handleKeyboard(data: {}, hashId: number, keyString: string, keyCode: string | number): void | { command: string };

        getStatusText(editor: Editor, data: {}): string;
    }

    interface VirtualRenderer extends OptionsProvider, EventEmitter {
        readonly container: HTMLElement;
        readonly scroller: HTMLElement;
        readonly content: HTMLElement;
        readonly characterWidth: number;
        readonly lineHeight: number;
        readonly scrollLeft: number;
        readonly scrollTop: number;
        readonly $padding: number;

        setOption<T extends keyof VirtualRendererOptions>(name: T, value: VirtualRendererOptions[T]): void;

        getOption<T extends keyof VirtualRendererOptions>(name: T): VirtualRendererOptions[T];

        setSession(session: EditSession): void;

        updateLines(firstRow: number, lastRow: number, force?: boolean): void;

        updateText(): void;

        updateFull(force?: boolean): void;

        updateFontSize(): void;

        adjustWrapLimit(): boolean;

        setAnimatedScroll(shouldAnimate: boolean): void;

        getAnimatedScroll(): boolean;

        setShowInvisibles(showInvisibles: boolean): void;

        getShowInvisibles(): boolean;

        setDisplayIndentGuides(display: boolean): void;

        getDisplayIndentGuides(): boolean;

        setShowPrintMargin(showPrintMargin: boolean): void;

        getShowPrintMargin(): boolean;

        setPrintMarginColumn(showPrintMargin: boolean): void;

        getPrintMarginColumn(): boolean;

        setShowGutter(show: boolean): void;

        getShowGutter(): boolean;

        setFadeFoldWidgets(show: boolean): void;

        getFadeFoldWidgets(): boolean;

        setHighlightGutterLine(shouldHighlight: boolean): void;

        getHighlightGutterLine(): boolean;

        getContainerElement(): HTMLElement;

        getMouseEventTarget(): HTMLElement;

        getTextAreaContainer(): HTMLElement;

        getFirstVisibleRow(): number;

        getFirstFullyVisibleRow(): number;

        getLastFullyVisibleRow(): number;

        getLastVisibleRow(): number;

        setPadding(padding: number): void;

        setScrollMargin(top: number,
                        bottom: number,
                        left: number,
                        right: number): void;

        setHScrollBarAlwaysVisible(alwaysVisible: boolean): void;

        getHScrollBarAlwaysVisible(): boolean;

        setVScrollBarAlwaysVisible(alwaysVisible: boolean): void;

        getVScrollBarAlwaysVisible(): boolean;

        freeze(): void;

        unfreeze(): void;

        updateFrontMarkers(): void;

        updateBackMarkers(): void;

        updateBreakpoints(): void;

        setAnnotations(annotations: Annotation[]): void;

        updateCursor(): void;

        hideCursor(): void;

        showCursor(): void;

        scrollSelectionIntoView(anchor: Position,
                                lead: Position,
                                offset?: number): void;

        scrollCursorIntoView(cursor: Position, offset?: number): void;

        getScrollTop(): number;

        getScrollLeft(): number;

        getScrollTopRow(): number;

        getScrollBottomRow(): number;

        scrollToRow(row: number): void;

        alignCursor(cursor: Position | number, alignment: number): number;

        scrollToLine(line: number,
                     center: boolean,
                     animate: boolean,
                     callback: () => void): void;

        animateScrolling(fromValue: number, callback: () => void): void;

        scrollToY(scrollTop: number): void;

        scrollToX(scrollLeft: number): void;

        scrollTo(x: number, y: number): void;

        scrollBy(deltaX: number, deltaY: number): void;

        isScrollableBy(deltaX: number, deltaY: number): boolean;

        textToScreenCoordinates(row: number, column: number): { pageX: number, pageY: number };

        pixelToScreenCoordinates(x: number, y: number): { row: number, column: number, side: 1 | -1, offsetX: number };

        visualizeFocus(): void;

        visualizeBlur(): void;

        showComposition(position: number): void;

        setCompositionText(text: string): void;

        hideComposition(): void;

        setGhostText(text: string, position: Point): void;

        removeGhostText(): void;

        setTheme(theme: string, callback?: () => void): void;

        getTheme(): string;

        setStyle(style: string, include?: boolean): void;

        unsetStyle(style: string): void;

        setCursorStyle(style: string): void;

        setMouseCursor(cursorStyle: string): void;

        attachToShadowRoot(): void;

        destroy(): void;
    }


    interface Selection extends EventEmitter {
        moveCursorWordLeft(): void;

        moveCursorWordRight(): void;

        fromOrientedRange(range: Range): void;

        setSelectionRange(match: any): void;

        getAllRanges(): Range[];

        addRange(range: Range): void;

        isEmpty(): boolean;

        isMultiLine(): boolean;

        setCursor(row: number, column: number): void;

        setAnchor(row: number, column: number): void;

        getAnchor(): Position;

        getCursor(): Position;

        isBackwards(): boolean;

        getRange(): Range;

        clearSelection(): void;

        selectAll(): void;

        setRange(range: Range, reverse?: boolean): void;

        selectTo(row: number, column: number): void;

        selectToPosition(pos: any): void;

        selectUp(): void;

        selectDown(): void;

        selectRight(): void;

        selectLeft(): void;

        selectLineStart(): void;

        selectLineEnd(): void;

        selectFileEnd(): void;

        selectFileStart(): void;

        selectWordRight(): void;

        selectWordLeft(): void;

        getWordRange(): void;

        selectWord(): void;

        selectAWord(): void;

        selectLine(): void;

        moveCursorUp(): void;

        moveCursorDown(): void;

        moveCursorLeft(): void;

        moveCursorRight(): void;

        moveCursorLineStart(): void;

        moveCursorLineEnd(): void;

        moveCursorFileEnd(): void;

        moveCursorFileStart(): void;

        moveCursorLongWordRight(): void;

        moveCursorLongWordLeft(): void;

        moveCursorBy(rows: number, chars: number): void;

        moveCursorToPosition(position: any): void;

        moveCursorTo(row: number, column: number, keepDesiredColumn?: boolean): void;

        moveCursorToScreen(row: number, column: number, keepDesiredColumn: boolean): void;

        toJSON(): SavedSelection | SavedSelection[];

        fromJSON(selection: SavedSelection | SavedSelection[]): void;
    }

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

        setAriaOption(activeDescendant: string, role: string): void;
    }
    
    type CompleterCallback = (error: any, completions: Completion[]) => void;

    interface Completer {
        identifierRegexps?: Array<RegExp>,

        getCompletions(editor: Editor,
                       session: EditSession,
                       position: Point,
                       prefix: string,
                       callback: CompleterCallback): void;

        getDocTooltip?(item: Completion): undefined | string | Completion;

        cancel?(): void;

        id?: string;
        triggerCharacters?: string[]
    }

    class AceInline {
        show(editor: Editor, completion: Completion, prefix: string): void;

        isOpen(): void;

        hide(): void;

        destroy(): void;
    }

    interface CompletionOptions {
        matches?: Completion[];
    }

    type CompletionProviderOptions = {
        exactMatch?: boolean;
        ignoreCaption?: boolean;
    }

    type CompletionRecord = {
        all: Completion[];
        filtered: Completion[];
        filterText: string;
    } | CompletionProviderOptions

    type GatherCompletionRecord = {
        prefix: string;
        matches: Completion[];
        finished: boolean;
    }

    type CompletionCallbackFunction = (err: Error | undefined, data: GatherCompletionRecord) => void;
    type CompletionProviderCallback = (this: Autocomplete, err: Error | undefined, completions: CompletionRecord, finished: boolean) => void;

    class CompletionProvider {
        insertByIndex(editor: Editor, index: number, options: CompletionProviderOptions): boolean;

        insertMatch(editor: Editor, data: Completion, options: CompletionProviderOptions): boolean;

        completions: CompletionRecord;



        detach(): void;
    }
    
    type AcePopupNavigation = "up" | "down" | "start" | "end";

    class AcePopup {
        constructor(parentNode: HTMLElement);

        setData(list: Completion[], filterText: string): void;

        getData(row: number): Completion;

        getRow(): number;
        getRow(line: number): void;

        hide(): void;

        show(pos: Point, lineHeight: number, topdownOnly: boolean): void;

        tryShow(pos: Point, lineHeight: number, anchor: "top" | "bottom" | undefined, forceShow?: boolean): boolean;

        goTo(where: AcePopupNavigation): void;
    }
}


declare const version: string;
declare const config: Ace.Config;

declare function require(name: string): any;



type InlineAutocompleteAction = "prev" | "next" | "first" | "last";

type TooltipCommandFunction<T> = (editor: Ace.Editor) => T;

interface TooltipCommand extends Ace.Command {
    enabled: TooltipCommandFunction<boolean> | boolean,
    getValue?: TooltipCommandFunction<any>,
    type: "button" | "text" | "checkbox"
    iconCssClass: string,
    cssClass: string
}

declare class InlineAutocomplete {
    constructor();

    getInlineRenderer(): Ace.AceInline;

    getInlineTooltip(): CommandBarTooltip;

    getCompletionProvider(): Ace.CompletionProvider;

    show(editor: Ace.Editor): void;

    isOpen(): boolean;

    detach(): void;

    destroy(): void;

    goTo(action: InlineAutocompleteAction): void;

    tooltipEnabled: boolean;
    commands: Record<string, Ace.Command>

    getIndex(): number;

    setIndex(value: number): void;

    getLength(): number;

    getData(index?: number): Ace.Completion | undefined;

    updateCompletions(options: Ace.CompletionOptions): void;
}

declare class CommandBarTooltip {
    constructor(parentElement: HTMLElement);

    registerCommand(id: string, command: TooltipCommand): void;

    attach(editor: Ace.Editor): void;

    updatePosition(): void;

    update(): void;

    isShown(): boolean;

    getAlwaysShow(): boolean;

    setAlwaysShow(alwaysShow: boolean): void;

    detach(): void;

    destroy(): void;
}
