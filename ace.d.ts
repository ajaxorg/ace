/* This file is generated using `npm run update-types` */


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
export const config: typeof import("./src/config");

export function edit(el?: string | (HTMLElement & {
    env?: any;
    value?: any;
}) | null, options?: any): Editor;

export function createEditSession(text: import("./src/document").Document | string, mode?: import('./interfaces').SyntaxMode): EditSession;

import {Editor} from "./src/editor";
import {EditSession} from "./src/edit_session";
import {Range} from "./src/range";
import {UndoManager} from "./src/undomanager";
import {VirtualRenderer as Renderer} from "./src/virtual_renderer";

export var version: "1.36.5";
export {Range, Editor, EditSession, UndoManager, Renderer as VirtualRenderer};
