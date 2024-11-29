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
    type InlineAutocomplete = import("./src/ext/inline_autocomplete").InlineAutocomplete;
    type CompletionProvider = import("./src/autocomplete").CompletionProvider;
    type AcePopup = import("./src/autocomplete/popup").AcePopup;
    type AceInline = import("./src/autocomplete/inline").AceInline;
    type MouseEvent = import("./src/mouse/mouse_event").MouseEvent;
    type RangeList = import("./src/range_list").RangeList;
    type FilteredList = import("./src/autocomplete").FilteredList;
    type LineWidgets = import("./src/line_widgets").LineWidgets;
    type SearchBox = import("./src/ext/searchbox").SearchBox;
    type Occur = import("./src/occur").Occur;
    type DefaultHandlers = import("./src/mouse/default_handlers").DefaultHandlers;
    type GutterHandler = import("./src/mouse/default_gutter_handler").GutterHandler;
    type DragdropHandler = import("./src/mouse/dragdrop_handler").DragdropHandler;
    type AppConfig = import("./src/lib/app_config").AppConfig;
    type Config = typeof import("./src/config");

    type AfterLoadCallback = import("./interfaces").AfterLoadCallback
    type LoaderFunction = import("./interfaces").LoaderFunction;

    type ConfigOptions = import("./interfaces").ConfigOptions;

    type Theme = import("./interfaces").Theme;

    type ScrollBar = import("./interfaces").ScrollBar;

    type HScrollbar = import("./interfaces").HScrollbar;

    type VScrollbar = import("./interfaces").VScrollbar;

    type LayerConfig = import("./interfaces").LayerConfig;

    type HardWrapOptions = import("./interfaces").HardWrapOptions;

    type CommandBarOptions = import("./interfaces").CommandBarOptions;

    type ScreenCoordinates = import("./interfaces").ScreenCoordinates;

    type Folding = import("./interfaces").Folding;

    type BracketMatch = import("./interfaces").BracketMatch;

    type IRange = import("./interfaces").IRange;

    type LineWidget = import("./interfaces").LineWidget;

    type NewLineMode = import("./interfaces").NewLineMode;

    type EditSessionOptions = import("./interfaces").EditSessionOptions;

    type VirtualRendererOptions = import("./interfaces").VirtualRendererOptions;

    type MouseHandlerOptions = import("./interfaces").MouseHandlerOptions;

    type EditorOptions = import("./interfaces").EditorOptions;

    type EventsBase = import("./interfaces").EventsBase;

    type EditSessionEvents = import("./interfaces").EditSessionEvents;

    type EditorEvents = import("./interfaces").EditorEvents;

    type AcePopupEvents = import("./interfaces").AcePopupEvents;

    type DocumentEvents = import("./interfaces").DocumentEvents;

    type AnchorEvents = import("./interfaces").AnchorEvents;

    type BackgroundTokenizerEvents = import("./interfaces").BackgroundTokenizerEvents;

    type SelectionEvents = import("./interfaces").SelectionEvents;

    type MultiSelectionEvents = import("./interfaces").MultiSelectionEvents;

    type PlaceHolderEvents = import("./interfaces").PlaceHolderEvents;

    type GutterEvents = import("./interfaces").GutterEvents;

    type TextEvents = import("./interfaces").TextEvents;

    type VirtualRendererEvents = import("./interfaces").VirtualRendererEvents;

    type EventEmitter<T extends { [K in keyof T]: (...args: any[]) => any }> = import("./interfaces").EventEmitter<T>;

    type SearchOptions = import("./interfaces").SearchOptions;

    type Point = import("./interfaces").Point;

    type Position = Point;

    type Delta = import("./interfaces").Delta;

    type Annotation = import("./interfaces").Annotation;

    type MarkerGroupItem = import("./interfaces").MarkerGroupItem;

    type MarkerGroup = import("./src/marker_group").MarkerGroup;


    type Command = import("./interfaces").Command;

    type CommandLike = import("./interfaces").CommandLike;

    type KeyboardHandler = import("./interfaces").KeyboardHandler;

    type MarkerLike = import("./interfaces").MarkerLike;

    type MarkerRenderer = import("./interfaces").MarkerRenderer;

    type Token = import("./interfaces").Token;

    type BaseCompletion = import("./src/autocomplete").BaseCompletion;
    type SnippetCompletion = import("./src/autocomplete").SnippetCompletion;
    type ValueCompletion = import("./src/autocomplete").ValueCompletion;
    type Completion = import("./src/autocomplete").Completion;

    type HighlightRule = import("./interfaces").HighlightRule;

    type HighlightRulesMap = import("./interfaces").HighlightRulesMap;

    type KeywordMapper = import("./interfaces").KeywordMapper;

    type HighlightRules = import("./interfaces").HighlightRules;

    type FoldWidget = import("./interfaces").FoldWidget;

    type FoldMode = import("./interfaces").FoldMode;

    type BehaviorAction = import("./interfaces").BehaviorAction;
    type BehaviorMap = import("./interfaces").BehaviorMap;

    type Behaviour = import("./interfaces").Behaviour;

    type Outdent = import("./interfaces").Outdent;

    type SyntaxMode = import("./interfaces").SyntaxMode;

    type OptionsBase = import("./interfaces").OptionsBase;

    type OptionsProvider<T> = import("./interfaces").OptionsProvider<T>

    type KeyBinding = import("./src/keyboard/keybinding").KeyBinding;

    type CommandMap = import("./interfaces").CommandMap;

    type execEventHandler = import("./interfaces").execEventHandler;

    type CommandManagerEvents = import("./interfaces").CommandManagerEvents;

    type CommandManager = import("./src/commands/command_manager").CommandManager;

    type SavedSelection = import("./interfaces").SavedSelection;

    type TextInput = import("./interfaces").TextInput;

    type CompleterCallback = import("./interfaces").CompleterCallback;

    type Completer = import("./interfaces").Completer;

    type CompletionOptions = import("./interfaces").CompletionOptions;

    type CompletionProviderOptions = import("./interfaces").CompletionProviderOptions;

    type GatherCompletionRecord = import("./interfaces").GatherCompletionRecord;

    type CompletionCallbackFunction = import("./interfaces").CompletionCallbackFunction;
    type CompletionProviderCallback = import("./interfaces").CompletionProviderCallback;
    type AcePopupNavigation = import("./interfaces").AcePopupNavigation;

    type EditorMultiSelectProperties = import("./interfaces").EditorMultiSelectProperties;

    type CodeLenseProvider = import("./interfaces").CodeLenseProvider;

    type CodeLense = import("./interfaces").CodeLense;

    type CodeLenseEditorExtension = import("./interfaces").CodeLenseEditorExtension;

    type ElasticTabstopsEditorExtension = import("./interfaces").ElasticTabstopsEditorExtension;

    type TextareaEditorExtension = import("./interfaces").TextareaEditorExtension;

    type PromptEditorExtension = import("./interfaces").PromptEditorExtension;

    type OptionsEditorExtension = import("./interfaces").OptionsEditorExtension;

    type MultiSelectProperties = import("./interfaces").MultiSelectProperties;

    type AcePopupEventsCombined = import("./interfaces").AcePopupEventsCombined;
    type AcePopupWithEditor = import("./interfaces").AcePopupWithEditor;
    type InlineAutocompleteAction = import("./interfaces").InlineAutocompleteAction;

    type TooltipCommandFunction<T> = import("./interfaces").TooltipCommandFunction<T>;

    type TooltipCommand = import("./interfaces").TooltipCommand;

    export type CommandBarTooltip = import("./src/ext/command_bar").CommandBarTooltip;

    export type TokenizeResult = import("./interfaces").TokenizeResult;

    type StaticHighlightOptions = import("./interfaces").StaticHighlightOptions;
}

export type InlineAutocomplete = Ace.InlineAutocomplete;
export type CommandBarTooltip = Ace.CommandBarTooltip;

declare global {
    interface Element {
        setAttribute(name: string, value: boolean): void;

        setAttribute(name: string, value: number): void;
    }
}

declare module "./src/anchor" {

    export interface Anchor extends Ace.EventEmitter<Ace.AnchorEvents> {
        markerId?: number;
        document: Ace.Document;
    }

}

declare module "./src/autocomplete" {
    export interface Autocomplete {
        popup: Ace.AcePopup;
        emptyMessage?: Function,
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
    export interface Document extends Ace.EventEmitter<Ace.DocumentEvents> {
    }

}

declare module "./src/editor" {
    export interface Editor extends Ace.EditorMultiSelectProperties, Ace.OptionsProvider<Ace.EditorOptions>,
        Ace.EventEmitter<Ace.EditorEvents>, Ace.CodeLenseEditorExtension, Ace.ElasticTabstopsEditorExtension,
        Ace.TextareaEditorExtension, Ace.PromptEditorExtension, Ace.OptionsEditorExtension {
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
        widgetManager?: Ace.LineWidgets,
        completer?: Ace.Autocomplete | Ace.InlineAutocomplete,
        completers: Ace.Completer[],
        $highlightTagPending?: boolean,
        showKeyboardShortcuts?: () => void,
        showSettingsMenu?: () => void,
        searchBox?: Ace.SearchBox,
        _eventRegistry?: any,
    }
}

declare module "./src/edit_session" {
    export interface EditSession extends Ace.EventEmitter<Ace.EditSessionEvents>,
        Ace.OptionsProvider<Ace.EditSessionOptions>,
        Ace.Folding, Ace.BracketMatch {
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
        $bracketHighlight?: any,
        $selectionMarker?: number,
        lineWidgetsWidth?: number,
        $getWidgetScreenLength?: () => number,
        _changedWidgets?: any,
        $options: any,
        $wrapMethod?: any,
        $enableVarChar?: any,
        $wrap?: any,
        $navigateWithinSoftTabs?: boolean,
        $selectionMarkers?: any[],
        gutterRenderer?: any,
        $firstLineNumber?: number,
        $emacsMark?: any,
        selectionMarkerCount?: number,
        multiSelect?: any,
        $occurHighlight?: any,
        $occur?: Ace.Occur,
        $occurMatchingLines?: any,
        $useEmacsStyleLineStart?: boolean,
        $selectLongWords?: boolean,

        getSelectionMarkers(): any[],
    }

}

declare module "./src/edit_session/fold" {
    export interface Fold {
        collapseChildren?: number;
    }
}

declare module "./src/placeholder" {
    export interface PlaceHolder extends Ace.EventEmitter<Ace.PlaceHolderEvents> {
    }
}

declare module "./src/scrollbar" {
    export interface VScrollBar extends Ace.EventEmitter<any> {
    }

    export interface HScrollBar extends Ace.EventEmitter<any> {
    }
}

declare module "./src/scrollbar_custom" {
    export interface VScrollBar extends Ace.EventEmitter<any> {
    }

    export interface HScrollBar extends Ace.EventEmitter<any> {
    }
}

declare module "./src/line_widgets" {
    export interface LineWidgets {
        lineWidgets: Ace.LineWidget[];
        editor: Ace.Editor;
    }
}

declare module "./src/selection" {
    export interface Selection extends Ace.EventEmitter<Ace.MultiSelectionEvents>, Ace.MultiSelectProperties {
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
    export interface VirtualRenderer extends Ace.EventEmitter<Ace.VirtualRendererEvents>, Ace.OptionsProvider<Ace.VirtualRendererOptions> {
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
        keyboardFocusClassName?: string,
    }

}

declare module "./src/snippets" {
    interface SnippetManager extends Ace.EventEmitter<any> {
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

    export interface AcePopup extends Ace.AcePopupWithEditor {
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
        tryShow: (pos: any, lineHeight: number, anchor: "top" | "bottom", forceShow?: boolean) => boolean,
        $borderSize: number,
        show: (pos: any, lineHeight: number, topdownOnly?: boolean) => void,
        goTo: (where: Ace.AcePopupNavigation) => void,
        getTextLeftOffset: () => number,
        $imageSize: number,
        anchorPos: any,
        isMouseOver?: boolean,
        selectedNode?: HTMLElement,
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

declare module "./src/mouse/mouse_event" {
    export interface MouseEvent {
        time?: number;
    }
}

declare module "./src/mouse/mouse_handler" {

    export interface MouseHandler {
        $tooltipFollowsMouse?: boolean,
        cancelDrag?: boolean
        //from DefaultHandlers
        $clickSelection?: Ace.Range,
        mousedownEvent?: Ace.MouseEvent,
        startSelect?: (pos?: Ace.Point, waitForClickSelection?: boolean) => void,
        select?: () => void
        $lastScroll?: { t: number, vx: number, vy: number, allowed: number }
        selectEnd?: () => void
    }
}

declare module "./src/ext/options" {
    export interface OptionPanel extends Ace.EventEmitter<any> {
    }
}

declare module "./src/layer/font_metrics" {
    export interface FontMetrics extends Ace.EventEmitter<any> {
    }
}

declare module "./src/tooltip" {
    export interface HoverTooltip {
        row: number;
    }
}

declare module "./src/mouse/default_gutter_handler" {
    export interface GutterHandler {
    }
}

declare module "./src/lib/keys" {
    // export function keyCodeToString(keyCode: number): string;
}

