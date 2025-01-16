/* This file is generated using `npm run update-types` */

/// <reference path="./types/ace-lib.d.ts" />
/// <reference path="./types/ace-modules.d.ts" />
/// <reference path="./types/ace-theme.d.ts" />
/// <reference path="./types/ace-ext.d.ts" />
/// <reference path="./types/ace-snippets.d.ts" />
/// <reference path="./ace-modes.d.ts" />
declare module "ace-code" {
    export namespace Ace {
        type Anchor = import("ace-code/src/anchor").Anchor;
        type Editor = import("ace-code/src/editor").Editor;
        type EditSession = import("ace-code/src/edit_session").EditSession;
        type Document = import("ace-code/src/document").Document;
        type Fold = import("ace-code/src/edit_session/fold").Fold;
        type FoldLine = import("ace-code/src/edit_session/fold_line").FoldLine;
        type Range = import("ace-code/src/range").Range;
        type VirtualRenderer = import("ace-code/src/virtual_renderer").VirtualRenderer;
        type UndoManager = import("ace-code/src/undomanager").UndoManager;
        type Tokenizer = import("ace-code/src/tokenizer").Tokenizer;
        type TokenIterator = import("ace-code/src/token_iterator").TokenIterator;
        type Selection = import("ace-code/src/selection").Selection;
        type Autocomplete = import("ace-code/src/autocomplete").Autocomplete;
        type InlineAutocomplete = import("ace-code/src/ext/inline_autocomplete").InlineAutocomplete;
        type CompletionProvider = import("ace-code/src/autocomplete").CompletionProvider;
        type AcePopup = import("ace-code/src/autocomplete/popup").AcePopup;
        type AceInline = import("ace-code/src/autocomplete/inline").AceInline;
        type MouseEvent = import("ace-code/src/mouse/mouse_event").MouseEvent;
        type RangeList = import("ace-code/src/range_list").RangeList;
        type FilteredList = import("ace-code/src/autocomplete").FilteredList;
        type LineWidgets = import("ace-code/src/line_widgets").LineWidgets;
        type SearchBox = import("ace-code/src/ext/searchbox").SearchBox;
        type Occur = import("ace-code/src/occur").Occur;
        type DefaultHandlers = import("ace-code/src/mouse/default_handlers").DefaultHandlers;
        type GutterHandler = import("ace-code/src/mouse/default_gutter_handler").GutterHandler;
        type DragdropHandler = import("ace-code/src/mouse/dragdrop_handler").DragdropHandler;
        type AppConfig = import("ace-code/src/lib/app_config").AppConfig;
        type Config = typeof import("ace-code/src/config");
        type GutterTooltip = import("ace-code/src/mouse/default_gutter_handler").GutterTooltip;
        type GutterKeyboardEvent = import("ace-code/src/keyboard/gutter_handler").GutterKeyboardEvent;
        type AfterLoadCallback = (err: Error | null, module: unknown) => void;
        type LoaderFunction = (moduleName: string, afterLoad: AfterLoadCallback) => void;
        export interface ConfigOptions {
            packaged: boolean;
            workerPath: string | null;
            modePath: string | null;
            themePath: string | null;
            basePath: string;
            suffix: string;
            loadWorkerFromBlob: boolean;
            sharedPopups: boolean;
            useStrictCSP: boolean | null;
        }
        interface Theme {
            cssClass?: string;
            cssText?: string;
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
            row: number;
            column: number;
            side?: 1 | -1;
            offsetX?: number;
        }
        interface Folding {
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
            /**
             * Adds a new fold.
             *      The new created Fold object or an existing fold object in case the
             *      passed in range fits an existing fold exactly.
             */
            addFold(placeholder: Ace.Fold | string, range?: Ace.Range): Ace.Fold;
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
            toggleFold(tryToUnfold?: boolean): void;
            getCommentFoldRange(row: number, column: number, dir?: number): Ace.Range | undefined;
            foldAll(startRow?: number | null, endRow?: number | null, depth?: number | null, test?: Function): void;
            foldToLevel(level: number): void;
            foldAllComments(): void;
            setFoldStyle(style: string): void;
            foldWidgets: any[];
            getFoldWidget: any;
            getFoldWidgetRange: any;
            getParentFoldRangeData(row: number, ignoreCurrent?: boolean): {
                range?: Ace.Range;
                firstRange?: Ace.Range;
            };
            onFoldWidgetClick(row: number, e: any): void;
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
            /**
             * Returns [[Range]]'s for matching tags and tag names, if there are any
             */
            getMatchingTags: (pos: Point) => {
                closeTag: Range;
                closeTagName: Range;
                openTag: Range;
                openTagName: Range;
            };
        }
        interface IRange {
            start: Point;
            end: Point;
        }
        interface LineWidget {
            editor?: Editor;
            el?: HTMLElement;
            rowCount?: number;
            hidden?: boolean;
            column?: number;
            row: number;
            session?: EditSession;
            html?: string;
            text?: string;
            className?: string;
            coverGutter?: boolean;
            pixelHeight?: number;
            type?: any;
            destroy?: () => void;
            coverLine?: boolean;
            fixedWidth?: boolean;
            fullWidth?: boolean;
            screenWidth?: number;
            rowsAbove?: number;
            lenses?: any[];
        }
        type NewLineMode = "auto" | "unix" | "windows";
        interface EditSessionOptions {
            wrap: "off" | "free" | "printmargin" | boolean | number;
            wrapMethod: "code" | "text" | "auto";
            indentedSoftWrap: boolean;
            firstLineNumber: number;
            useWorker: boolean;
            useSoftTabs: boolean;
            tabSize: number;
            navigateWithinSoftTabs: boolean;
            foldStyle: "markbegin" | "markbeginend" | "manual";
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
        interface MouseHandlerOptions {
            scrollSpeed: number;
            dragDelay: number;
            dragEnabled: boolean;
            focusTimeout: number;
            tooltipFollowsMouse: boolean;
        }
        interface EditorOptions extends EditSessionOptions, MouseHandlerOptions, VirtualRendererOptions {
            selectionStyle: "fullLine" | "screenLine" | "text" | "line";
            highlightActiveLine: boolean;
            highlightSelectedWord: boolean;
            readOnly: boolean;
            copyWithEmptySelection: boolean;
            cursorStyle: "ace" | "slim" | "smooth" | "wide";
            mergeUndoDeltas: true | false | "always";
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
        interface EventsBase {
            [key: string]: any;
        }
        interface EditSessionEvents {
            /**
             * Emitted when the document changes.
             */
            "change": (delta: Delta) => void;
            /**
             * Emitted when the tab size changes, via [[EditSession.setTabSize]].
             */
            "changeTabSize": () => void;
            /**
             * Emitted when the ability to overwrite text changes, via [[EditSession.setOverwrite]].
             */
            "changeOverwrite": (overwrite: boolean) => void;
            /**
             * Emitted when the gutter changes, either by setting or removing breakpoints, or when the gutter decorations change.
             */
            "changeBreakpoint": (e?: {
                row?: number;
                breakpoint?: boolean;
            }) => void;
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
            "tokenizerUpdate": (e: {
                data: {
                    first: number;
                    last: number;
                };
            }) => void;
            /**
             * Emitted when the current mode changes.
             */
            "changeMode": (e: any) => void;
            /**
             * Emitted when the wrap mode changes.
             */
            "changeWrapMode": (e: any) => void;
            /**
             * Emitted when the wrapping limit changes.
             */
            "changeWrapLimit": (e: any) => void;
            /**
             * Emitted when a code fold is added or removed.
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
            "changeEditor": (e: {
                editor?: Editor;
                oldEditor?: Editor;
            }) => void;
            "changeSelection": () => void;
            "startOperation": (op?: {
                command?: {
                    name?: string;
                };
                args?: any;
            }) => void;
            "endOperation": (op?: any) => void;
            "beforeEndOperation": () => void;
        }
        interface EditorEvents {
            "change": (delta: Delta) => void;
            "changeSelection": () => void;
            "input": () => void;
            /**
             * Emitted whenever the [[EditSession]] changes.
             * @param e An object with two properties, `oldSession` and `session`, that represent the old and new [[EditSession]]s.
             **/
            "changeSession": (e: {
                oldSession: EditSession;
                session: EditSession;
            }) => void;
            "blur": (e: any) => void;
            "mousedown": (e: MouseEvent) => void;
            "mousemove": (e: MouseEvent & {
                scrollTop?: any;
            }, editor?: Editor) => void;
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
            "copy": (e: {
                text: string;
            }) => void;
            /**
             * Emitted when text is pasted.
             **/
            "paste": (text: string, event: any) => void;
            /**
             * Emitted when the selection style changes, via [[Editor.setSelectionStyle]].
             * @param data Contains one property, `data`, which indicates the new selection style
             **/
            "changeSelectionStyle": (data: "fullLine" | "screenLine" | "text" | "line") => void;
            "changeMode": (e: {
                mode?: Ace.SyntaxMode;
                oldMode?: Ace.SyntaxMode;
            }) => void;
            //from searchbox extension
            "findSearchBox": (e: {
                match: boolean;
            }) => void;
            //from code_lens extension
            "codeLensClick": (e: any) => void;
            "select": () => void;
            "gutterkeydown": (e: GutterKeyboardEvent) => void;
            "gutterclick": (e: MouseEvent) => void;
            "showGutterTooltip": (e: GutterTooltip) => void;
            "hideGutterTooltip": (e: GutterTooltip) => void;
        }
        interface AcePopupEvents {
            "click": (e: MouseEvent) => void;
            "dblclick": (e: MouseEvent) => void;
            "tripleclick": (e: MouseEvent) => void;
            "quadclick": (e: MouseEvent) => void;
            "show": () => void;
            "hide": () => void;
            "select": (hide: boolean) => void;
            "changeHoverMarker": (e: any) => void;
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
            "change": (e: {
                old: Point;
                value: Point;
            }) => void;
        }
        interface BackgroundTokenizerEvents {
            /**
             * Fires whenever the background tokeniziers between a range of rows are going to be updated.
             * @param e An object containing two properties, `first` and `last`, which indicate the rows of the region being updated.
             **/
            "update": (e: {
                data: {
                    first: number;
                    last: number;
                };
            }) => void;
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
        interface MultiSelectionEvents extends SelectionEvents {
            "multiSelect": () => void;
            "addRange": (e: {
                range: Range;
            }) => void;
            "removeRange": (e: {
                ranges: Range[];
            }) => void;
            "singleSelect": () => void;
        }
        interface PlaceHolderEvents {
            "cursorEnter": (e: any) => void;
            "cursorLeave": (e: any) => void;
        }
        interface GutterEvents {
            "changeGutterWidth": (width: number) => void;
            "afterRender": () => void;
        }
        interface TextEvents {
            "changeCharacterSize": (e: any) => void;
        }
        interface VirtualRendererEvents {
            "afterRender": (e?: any, renderer?: VirtualRenderer) => void;
            "beforeRender": (e: any, renderer?: VirtualRenderer) => void;
            "themeLoaded": (e: {
                theme: string | Theme;
            }) => void;
            "themeChange": (e: {
                theme: string | Theme;
            }) => void;
            "scrollbarVisibilityChanged": () => void;
            "changeCharacterSize": (e: any) => void;
            "resize": (e?: any) => void;
            "autosize": () => void;
        }
        export class EventEmitter<T extends {
            [K in keyof T]: (...args: any[]) => any;
        }> {
            once<K extends keyof T>(name: K, callback: T[K]): void;
            setDefaultHandler(name: string, callback: Function): void;
            removeDefaultHandler(name: string, callback: Function): void;
            on<K extends keyof T>(name: K, callback: T[K], capturing?: boolean): T[K];
            addEventListener<K extends keyof T>(name: K, callback: T[K], capturing?: boolean): T[K];
            off<K extends keyof T>(name: K, callback: T[K]): void;
            removeListener<K extends keyof T>(name: K, callback: T[K]): void;
            removeEventListener<K extends keyof T>(name: K, callback: T[K]): void;
            removeAllListeners(name?: string): void;
        }
        interface SearchOptions {
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
        }
        interface Point {
            row: number;
            column: number;
        }
        type Position = Point;
        interface Delta {
            action: "insert" | "remove";
            start: Point;
            end: Point;
            lines: string[];
            id?: number;
            folds?: Fold[];
        }
        interface Annotation {
            row: number;
            column: number;
            text: string;
            type: string;
        }
        export interface MarkerGroupItem {
            range: Range;
            className: string;
        }
        type MarkerGroup = import("ace-code/src/marker_group").MarkerGroup;
        export interface Command {
            name?: string;
            bindKey?: string | {
                mac?: string;
                win?: string;
            };
            readOnly?: boolean;
            exec?: (editor?: Editor | any, args?: any) => void;
            isAvailable?: (editor: Editor) => boolean;
            description?: string;
            multiSelectAction?: "forEach" | "forEachLine" | Function;
            scrollIntoView?: true | "cursor" | "center" | "selectionPart" | "animate" | "selection" | "none";
            aceCommandGroup?: string;
            passEvent?: boolean;
            level?: number;
            action?: string;
        }
        type CommandLike = Command | ((editor: Editor) => void) | ((sb: SearchBox) => void);
        type KeyboardHandler = Partial<import("ace-code/src/keyboard/hash_handler").HashHandler> & {
            attach?: (editor: Editor) => void;
            detach?: (editor: Editor) => void;
            getStatusText?: (editor?: any, data?: any) => string;
        };
        export interface MarkerLike {
            range?: Range;
            type: string;
            renderer?: MarkerRenderer;
            clazz: string;
            inFront?: boolean;
            id?: number;
            update?: (html: string[],
                // TODO maybe define Marker class
                marker: any, session: EditSession, config: any) => void;
            [key: string]: any;
        }
        type MarkerRenderer = (html: string[], range: Range, left: number, top: number, config: any) => void;
        interface Token {
            type: string;
            value: string;
            index?: number;
            start?: number;
        }
        type BaseCompletion = import("ace-code/src/autocomplete").BaseCompletion;
        type SnippetCompletion = import("ace-code/src/autocomplete").SnippetCompletion;
        type ValueCompletion = import("ace-code/src/autocomplete").ValueCompletion;
        type Completion = import("ace-code/src/autocomplete").Completion;
        type HighlightRule = ({
            defaultToken: string;
        } | {
            include: string;
        } | {
            todo: string;
        } | {
            token: string | string[] | ((value: string) => string);
            regex: string | RegExp;
            next?: string | (() => void);
            push?: string;
            comment?: string;
            caseInsensitive?: boolean;
            nextState?: string;
        }) & {
            [key: string]: any;
        };
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
        type FoldWidget = "start" | "end" | "";
        interface FoldMode {
            foldingStartMarker: RegExp;
            foldingStopMarker?: RegExp;
            getFoldWidget(session: EditSession, foldStyle: string, row: number): FoldWidget;
            getFoldWidgetRange(session: EditSession, foldStyle: string, row: number): Range | undefined;
            indentationBlock(session: EditSession, row: number, column?: number): Range | undefined;
            openingBracketBlock(session: EditSession, bracket: string, row: number, column: number, typeRe?: RegExp): Range | undefined;
            closingBracketBlock(session: EditSession, bracket: string, row: number, column: number, typeRe?: RegExp): Range | undefined;
        }
        type BehaviorAction = (state: string | string[], action: string, editor: Editor, session: EditSession, text: string | Range) => ({
            text: string;
            selection: number[];
        } | Range) & {
            [key: string]: any;
        } | undefined;
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
            HighlightRules: {
                new(config?: any): HighlightRules;
            }; //TODO: fix this
            foldingRules?: FoldMode;
            /**
             * characters that indicate the start of a line comment
             */
            lineCommentStart?: string;
            /**
             * characters that indicate the start and end of a block comment
             */
            blockComment?: {
                start: string;
                end: string;
            };
            tokenRe?: RegExp;
            nonTokenRe?: RegExp;
            completionKeywords: string[];
            transformAction: BehaviorAction;
            path?: string;
            getTokenizer(): Tokenizer;
            toggleCommentLines(state: string | string[], session: EditSession, startRow: number, endRow: number): void;
            toggleBlockComment(state: string | string[], session: EditSession, range: Range, cursor: Point): void;
            getNextLineIndent(state: string | string[], line: string, tab: string): string;
            checkOutdent(state: string | string[], line: string, input: string): boolean;
            autoOutdent(state: string | string[], doc: EditSession, row: number): void;
            // TODO implement WorkerClient types
            createWorker(session: EditSession): any;
            createModeDelegates(mapping: {
                [key: string]: string;
            }): void;
            getKeywords(append?: boolean): Array<string | RegExp>;
            getCompletions(state: string | string[], session: EditSession, pos: Point, prefix: string): Completion[];
        }
        interface OptionsBase {
            [key: string]: any;
        }
        class OptionsProvider<T> {
            setOptions(optList: Partial<T>): void;
            getOptions(optionNames?: Array<keyof T> | Partial<T>): Partial<T>;
            setOption<K extends keyof T>(name: K, value: T[K]): void;
            getOption<K extends keyof T>(name: K): T[K];
        }
        type KeyBinding = import("ace-code/src/keyboard/keybinding").KeyBinding;
        interface CommandMap {
            [name: string]: Command;
        }
        type execEventHandler = (obj: {
            editor: Editor;
            command: Command;
            args: any[];
        }) => void;
        interface CommandManagerEvents {
            on(name: "exec", callback: execEventHandler): Function;
            on(name: "afterExec", callback: execEventHandler): Function;
        }
        type CommandManager = import("ace-code/src/commands/command_manager").CommandManager;
        interface SavedSelection {
            start: Point;
            end: Point;
            isBackwards: boolean;
        }
        var Selection: {
            new(session: EditSession): Selection;
        };
        interface TextInput {
            resetSelection(): void;
            setAriaOption(options?: {
                activeDescendant: string;
                role: string;
                setLabel: any;
            }): void;
        }
        type CompleterCallback = (error: any, completions: Completion[]) => void;
        interface Completer {
            identifierRegexps?: Array<RegExp>;
            getCompletions(editor: Editor, session: EditSession, position: Point, prefix: string, callback: CompleterCallback): void;
            getDocTooltip?(item: Completion): void | string | Completion;
            onSeen?: (editor: Ace.Editor, completion: Completion) => void;
            onInsert?: (editor: Ace.Editor, completion: Completion) => void;
            cancel?(): void;
            id?: string;
            triggerCharacters?: string[];
            hideInlinePreview?: boolean;
            insertMatch?: (editor: Editor, data: Completion) => void;
        }
        interface CompletionOptions {
            matches?: Completion[];
        }
        type CompletionProviderOptions = {
            exactMatch?: boolean;
            ignoreCaption?: boolean;
        };
        type GatherCompletionRecord = {
            prefix: string;
            matches: Completion[];
            finished: boolean;
        };
        type CompletionCallbackFunction = (err: Error | undefined, data: GatherCompletionRecord) => void;
        type CompletionProviderCallback = (this: import("ace-code/src/autocomplete").Autocomplete, err: Error | undefined, completions: import("ace-code/src/autocomplete").FilteredList, finished: boolean) => void;
        type AcePopupNavigation = "up" | "down" | "start" | "end";
        interface EditorMultiSelectProperties {
            inMultiSelectMode?: boolean;
            /**
             * Updates the cursor and marker layers.
             **/
            updateSelectionMarkers: () => void;
            /**
             * Adds the selection and cursor.
             * @param orientedRange A range containing a cursor
             **/
            addSelectionMarker: (orientedRange: Ace.Range & {
                marker?: any;
            }) => Ace.Range & {
                marker?: any;
            };
            /**
             * Removes the selection marker.
             * @param range The selection range added with [[Editor.addSelectionMarker `addSelectionMarker()`]].
             **/
            removeSelectionMarker: (range: Ace.Range & {
                marker?: any;
            }) => void;
            removeSelectionMarkers: (ranges: (Ace.Range & {
                marker?: any;
            })[]) => void;
            /**
             * Executes a command for each selection range.
             * @param cmd The command to execute
             * @param [args] Any arguments for the command
             **/
            forEachSelection: (cmd: Object, args?: string, options?: Object) => void;
            /**
             * Removes all the selections except the last added one.
             **/
            exitMultiSelectMode: () => void;
            getSelectedText: () => string;
            /**
             * Finds and selects all the occurrences of `needle`.
             * @param needle The text to find
             * @param options The search options
             * @param additive keeps
             * @returns {Number} The cumulative count of all found matches
             **/
            findAll: (needle?: string, options?: Partial<Ace.SearchOptions>, additive?: boolean) => number;
            /**
             * Adds a cursor above or below the active cursor.
             * @param dir The direction of lines to select: -1 for up, 1 for down
             * @param [skip] If `true`, removes the active selection range
             */
            selectMoreLines: (dir: number, skip?: boolean) => void;
            /**
             * Transposes the selected ranges.
             * @param {Number} dir The direction to rotate selections
             **/
            transposeSelections: (dir: number) => void;
            /**
             * Finds the next occurrence of text in an active selection and adds it to the selections.
             * @param {Number} dir The direction of lines to select: -1 for up, 1 for down
             * @param {Boolean} [skip] If `true`, removes the active selection range
             **/
            selectMore: (dir: number, skip?: boolean, stopAtFirst?: boolean) => void;
            /**
             * Aligns the cursors or selected text.
             **/
            alignCursors: () => void;
            multiSelect?: any;
        }
        interface CodeLenseProvider {
            provideCodeLenses: (session: EditSession, callback: (err: any, payload: CodeLense[]) => void) => void;
        }
        interface CodeLense {
            start: Point;
            command: any;
        }
        interface CodeLenseEditorExtension {
            codeLensProviders?: CodeLenseProvider[];
        }
        interface ElasticTabstopsEditorExtension {
            elasticTabstops?: import("ace-code/src/ext/elastic_tabstops_lite").ElasticTabstopsLite;
        }
        interface TextareaEditorExtension {
            setDisplaySettings?: (settings: any) => void;
        }
        interface PromptEditorExtension {
            cmdLine?: Editor;
        }
        interface OptionsEditorExtension {
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
            rangeCount: number;
            /**
             * Returns a concatenation of all the ranges.
             **/
            getAllRanges(): Ace.Range[];
            /**
             * Splits all the ranges into lines.
             **/
            splitIntoLines(): void;
            joinSelections(): void;
            toggleBlockSelection(): void;
            /**
             *
             * Gets list of ranges composing rectangular block on the screen
             *
             * @param {Ace.ScreenCoordinates} screenCursor The cursor to use
             * @param {Ace.ScreenCoordinates} screenAnchor The anchor to use
             * @param {Boolean} [includeEmptyLines] If true, this includes ranges inside the block which are empty due to clipping
             **/
            rectangularRangeBlock(screenCursor: Ace.ScreenCoordinates, screenAnchor: Ace.ScreenCoordinates, includeEmptyLines?: boolean): Ace.Range[];
            index?: number;
        }
        type AcePopupEventsCombined = Ace.EditorEvents & Ace.AcePopupEvents;
        type AcePopupWithEditor = Ace.EventEmitter<AcePopupEventsCombined> & Ace.Editor;
        type InlineAutocompleteAction = "prev" | "next" | "first" | "last";
        type TooltipCommandFunction<T> = (editor: Ace.Editor) => T;
        export interface TooltipCommand extends Ace.Command {
            enabled?: TooltipCommandFunction<boolean> | boolean;
            getValue?: TooltipCommandFunction<any>;
            type: "button" | "text" | "checkbox";
            iconCssClass?: string;
            cssClass?: string;
        }
        export type CommandBarTooltip = import("ace-code/src/ext/command_bar").CommandBarTooltip;
        export type TokenizeResult = Array<Array<{
            className?: string;
            value: string;
        }>>;
        export interface StaticHighlightOptions {
            mode?: string | SyntaxMode;
            theme?: string | Theme;
            trim?: boolean;
            firstLineNumber?: number;
            showGutter?: boolean;
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
    }
    export const config: typeof import("ace-code/src/config");
    export function edit(el?: string | (HTMLElement & {
        env?: any;
        value?: any;
    }) | null, options?: any): Editor;
    export function createEditSession(text: import("ace-code/src/document").Document | string, mode?: import("ace-code").Ace.SyntaxMode): EditSession;
    import { Editor } from "ace-code/src/editor";
    import { EditSession } from "ace-code/src/edit_session";
    import { Range } from "ace-code/src/range";
    import { UndoManager } from "ace-code/src/undomanager";
    import { VirtualRenderer as Renderer } from "ace-code/src/virtual_renderer";
    export var version: "1.37.5";
    export { Range, Editor, EditSession, UndoManager, Renderer as VirtualRenderer };
}
