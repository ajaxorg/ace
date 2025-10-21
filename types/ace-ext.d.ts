/* This file is generated using `npm run update-types` */

declare module "ace-code/src/ext/command_bar" {
    /**
     * Displays a command tooltip above the currently active line selection, with clickable elements.
     *
     * Internally it is a composite of two tooltips, one for the main tooltip and one for the
     * overflowing commands.
     * The commands are added sequentially in registration order.
     * When attached to an editor, it is either always shown or only when the active line is hovered
     * with mouse, depending on the alwaysShow property.
     */
    export class CommandBarTooltip {
        constructor(parentNode: HTMLElement, options?: Partial<import("ace-code").Ace.CommandBarOptions>);
        parentNode: HTMLElement;
        tooltip: Tooltip;
        moreOptions: Tooltip;
        maxElementsOnTooltip: number;
        eventListeners: {};
        elements: {};
        commands: {};
        tooltipEl: HTMLDivElement;
        moreOptionsEl: HTMLDivElement;
        /**
         * Registers a command on the command bar tooltip.
         *
         * The commands are added in sequential order. If there is not enough space on the main
         * toolbar, the remaining elements are added to the overflow menu.
         *
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
         */
        setAlwaysShow(alwaysShow: boolean): void;
        /**
         * Attaches the clickable command bar tooltip to an editor
         *
         * Depending on the alwaysShow parameter it either displays the tooltip immediately,
         * or subscribes to the necessary events to display the tooltip on hover.
         *
         */
        attach(editor: Editor): void;
        editor: import("ace-code/src/editor").Editor;
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
        destroy(): void;
    }
    export type Editor = import("ace-code/src/editor").Editor;
    export type TooltipCommand = import("ace-code").Ace.TooltipCommand;
    import { Tooltip } from "ace-code/src/tooltip";
    export var TOOLTIP_CLASS_NAME: string;
    export var BUTTON_CLASS_NAME: string;
    namespace Ace {
        type EventEmitter<T extends {
            [K in keyof T]: (...args: any[]) => any;
        }> = import("ace-code").Ace.EventEmitter<T>;
        type CommandBarEvents = import("ace-code").Ace.CommandBarEvents;
    }
    export interface CommandBarTooltip extends Ace.EventEmitter<Ace.CommandBarEvents> {
    }
}
declare module "ace-code/src/ext/language_tools" {
    export function setCompleters(val?: import("ace-code").Ace.Completer[]): void;
    export function addCompleter(completer: import("ace-code").Ace.Completer): void;
    import textCompleter = require("ace-code/src/autocomplete/text_completer");
    export var keyWordCompleter: import("ace-code").Ace.Completer;
    export var snippetCompleter: import("ace-code").Ace.Completer;
    import { MarkerGroup } from "ace-code/src/marker_group";
    export { textCompleter, MarkerGroup };
}
declare module "ace-code/src/ext/inline_autocomplete" {
    /**
     * This class controls the inline-only autocompletion components and their lifecycle.
     * This is more lightweight than the popup-based autocompletion, as it can only work with exact prefix matches.
     * There is an inline ghost text renderer and an optional command bar tooltip inside.
     */
    export class InlineAutocomplete {
        constructor(editor: Editor);
        editor: Editor;
        keyboardHandler: HashHandler;
        blurListener(e: any): void;
        changeListener(e: any): void;
        changeTimer: {
            (timeout?: number): void;
            delay(timeout?: number): void;
            schedule: any;
            call(): void;
            cancel(): void;
            isPending(): any;
        };
        getInlineRenderer(): AceInline;
        inlineRenderer: AceInline;
        getInlineTooltip(): CommandBarTooltip;
        inlineTooltip: CommandBarTooltip;
        /**
         * This function is the entry point to the class. This triggers the gathering of the autocompletion and displaying the results;
         */
        show(options: import("ace-code").Ace.CompletionOptions): void;
        activated: boolean;
        insertMatch(): boolean;
        goTo(where: import("ace-code").Ace.InlineAutocompleteAction): void;
        getLength(): any;
        getData(index?: number): import("ace-code").Ace.Completion | undefined;
        getIndex(): number;
        isOpen(): boolean;
        setIndex(value: number): void;
        getCompletionProvider(initialPosition: any): CompletionProvider;
        completionProvider: CompletionProvider;
        updateCompletions(options?: import("ace-code").Ace.CompletionOptions): void;
        base: import("ace-code/src/anchor").Anchor;
        completions: FilteredList;
        detach(): void;
        destroy(): void;
        updateDocTooltip(): void;
        commands: {
            [key: string]: import("ace-code").Ace.Command;
        };
    }
    export namespace InlineAutocomplete {
        function _for(editor: any): any;
        export { _for as for };
        export namespace startCommand {
            let name: string;
            function exec(editor: any, options: any): void;
            export namespace bindKey {
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
    import { Editor } from "ace-code/src/editor";
    import { HashHandler } from "ace-code/src/keyboard/hash_handler";
    import { AceInline } from "ace-code/src/autocomplete/inline";
    import { CommandBarTooltip } from "ace-code/src/ext/command_bar";
    import { CompletionProvider } from "ace-code/src/autocomplete";
    import { FilteredList } from "ace-code/src/autocomplete";
}
declare module "ace-code/src/ext/searchbox-css" {
    const _exports: string;
    export = _exports;
}
declare module "ace-code/src/ext/searchbox" {
    export function Search(editor: Editor, isReplace?: boolean): void;
    export type Editor = import("ace-code/src/editor").Editor;
    export class SearchBox {
        constructor(editor: Editor, range?: never, showReplaceForm?: never);
        activeInput: HTMLInputElement;
        element: HTMLDivElement;
        setSession(e: any): void;
        setEditor(editor: Editor): void;
        editor: Editor;
        searchRange: any;
        onEditorInput(): void;
        searchBox: HTMLElement;
        replaceBox: HTMLElement;
        searchOption: HTMLInputElement;
        replaceOption: HTMLInputElement;
        regExpOption: HTMLInputElement;
        caseSensitiveOption: HTMLInputElement;
        wholeWordOption: HTMLInputElement;
        searchInput: HTMLInputElement;
        replaceInput: HTMLInputElement;
        searchCounter: HTMLElement;
        /**
         * 
         * @external
        */
        $onChange: {
            schedule: (timeout?: number) => void;
        };
        setSearchRange(range: any): void;
        searchRangeMarker: number;
        /**
         * @external
         */
        $syncOptions(preventScroll?: boolean): void;
        highlight(re?: RegExp): void;
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
        show(value: string, isReplace?: boolean): void;
        isFocused(): boolean;
    }
    import { HashHandler } from "ace-code/src/keyboard/hash_handler";
}
declare module "ace-code/src/ext/diff/scroll_diff_decorator" {
    export class ScrollDiffDecorator extends Decorator {
        constructor(scrollbarV: import("ace-code").Ace.VScrollbar, renderer: import("ace-code/src/virtual_renderer").VirtualRenderer, forInlineDiff?: boolean);
        addZone(startRow: number, endRow: number, type: "delete" | "insert"): void;
        setSessions(sessionA: import("ace-code/src/edit_session").EditSession, sessionB: import("ace-code/src/edit_session").EditSession): void;
        sessionA: import("ace-code/src/edit_session").EditSession;
        sessionB: import("ace-code/src/edit_session").EditSession;
    }
    import { Decorator } from "ace-code/src/layer/decorators";
}
declare module "ace-code/src/ext/diff/styles-css" {
    export const cssText: "\n/*\n * Line Markers\n */\n.ace_diff {\n    position: absolute;\n    z-index: 0;\n}\n.ace_diff.inline {\n    z-index: 20;\n}\n/*\n * Light Colors \n */\n.ace_diff.insert {\n    background-color: #EFFFF1;\n}\n.ace_diff.delete {\n    background-color: #FFF1F1;\n}\n.ace_diff.aligned_diff {\n    background: rgba(206, 194, 191, 0.26);\n    background: repeating-linear-gradient(\n                45deg,\n              rgba(122, 111, 108, 0.26),\n              rgba(122, 111, 108, 0.26) 5px,\n              rgba(0, 0, 0, 0) 5px,\n              rgba(0, 0, 0, 0) 10px \n    );\n}\n\n.ace_diff.insert.inline {\n    background-color:  rgb(74 251 74 / 18%); \n}\n.ace_diff.delete.inline {\n    background-color: rgb(251 74 74 / 15%);\n}\n\n.ace_diff.delete.inline.empty {\n    background-color: rgba(255, 128, 79, 0.7);\n    width: 2px !important;\n}\n\n.ace_diff.insert.inline.empty {\n    background-color: rgba(49, 230, 96, 0.7);\n    width: 2px !important;\n}\n\n.ace_diff-active-line {\n    border-bottom: 1px solid;\n    border-top: 1px solid;\n    background: transparent;\n    position: absolute;\n    box-sizing: border-box;\n    border-color: #9191ac;\n}\n\n.ace_dark .ace_diff-active-line {\n    background: transparent;\n    border-color: #75777a;\n}\n \n\n/* gutter changes */\n.ace_mini-diff_gutter-enabled > .ace_gutter-cell,\n.ace_mini-diff_gutter-enabled > .ace_gutter-cell_svg-icons {\n    padding-right: 13px;\n}\n\n.ace_mini-diff_gutter_other > .ace_gutter-cell,\n.ace_mini-diff_gutter_other > .ace_gutter-cell_svg-icons  {\n    display: none;\n}\n\n.ace_mini-diff_gutter_other {\n    pointer-events: none;\n}\n\n\n.ace_mini-diff_gutter-enabled > .mini-diff-added {\n    background-color: #EFFFF1;\n    border-left: 3px solid #2BB534;\n    padding-left: 16px;\n    display: block;\n}\n\n.ace_mini-diff_gutter-enabled > .mini-diff-deleted {\n    background-color: #FFF1F1;\n    border-left: 3px solid #EA7158;\n    padding-left: 16px;\n    display: block;\n}\n\n\n.ace_mini-diff_gutter-enabled > .mini-diff-added:after {\n    position: absolute;\n    right: 2px;\n    content: \"+\";\n    background-color: inherit;\n}\n\n.ace_mini-diff_gutter-enabled > .mini-diff-deleted:after {\n    position: absolute;\n    right: 2px;\n    content: \"-\";\n    background-color: inherit;\n}\n.ace_fade-fold-widgets:hover > .ace_folding-enabled > .mini-diff-added:after,\n.ace_fade-fold-widgets:hover > .ace_folding-enabled > .mini-diff-deleted:after {\n    display: none;\n}\n\n.ace_diff_other .ace_selection {\n    filter: drop-shadow(1px 2px 3px darkgray);\n}\n\n.ace_hidden_marker-layer .ace_bracket,\n.ace_hidden_marker-layer .ace_error_bracket {\n    display: none;\n}\n\n\n\n/*\n * Dark Colors \n */\n\n.ace_dark .ace_diff.insert {\n    background-color: #212E25;\n}\n.ace_dark .ace_diff.delete {\n    background-color: #3F2222;\n}\n\n.ace_dark .ace_mini-diff_gutter-enabled > .mini-diff-added {\n    background-color: #212E25;\n    border-left-color:#00802F;\n}\n\n.ace_dark .ace_mini-diff_gutter-enabled > .mini-diff-deleted {\n    background-color: #3F2222;\n    border-left-color: #9C3838;\n}\n\n";
}
declare module "ace-code/src/ext/diff/gutter_decorator" {
    export class MinimalGutterDiffDecorator {
        constructor(editor: import("ace-code/src/editor").Editor, type: number);
        gutterClass: string;
        gutterCellsClasses: {
            add: string;
            delete: string;
        };
        editor: import("ace-code/src/editor").Editor;
        type: number;
        chunks: any[];
        attachToEditor(): void;
        renderGutters(e: any, gutterLayer: any): void;
        setDecorations(changes: any): void;
        dispose(): void;
    }
}
declare module "ace-code/src/ext/diff/inline_diff_view" {
    export class InlineDiffView extends BaseDiffView {
        /**
         * Constructs a new inline DiffView instance.
         * @param {import("ace-code/src/diff").DiffModel} [diffModel] - The model for the diff view.
         * @param {HTMLElement} [container] - optional container element for the DiffView.
         */
        constructor(diffModel?: import("ace-code/src/ext/diff").DiffModel, container?: HTMLElement);
        init(diffModel: any): void;
        onAfterRender(changes: number, renderer: import("ace-code").VirtualRenderer): void;
        textLayer: any;
        markerLayer: any;
        gutterLayer: any;
        cursorLayer: any;
        initRenderer(restore: any): void;
        initTextLayer(): void;
        initTextInput(restore: any): void;
        othertextInput: any;
        otherEditorContainer: any;
        selectEditor(editor: any): void;
        removeBracketHighlight(editor: any): void;
        initMouse(): void;
        onMouseDetach: () => void;
        onChangeWrapLimit(): void;
    }
    import { BaseDiffView } from "ace-code/src/ext/diff/base_diff_view";
}
declare module "ace-code/src/ext/diff/split_diff_view" {
    export class SplitDiffView extends BaseDiffView {
        /**
         * Constructs a new side by side DiffView instance.
         *
         * @param {import("ace-code/src/diff").DiffModel} [diffModel] - The model for the diff view.
         */
        constructor(diffModel?: import("ace-code/src/ext/diff").DiffModel);
        init(diffModel: any): void;
        onMouseWheel(ev: any): any;
        onScroll(e: any, session: any): void;
        onChangeWrapLimit(): void;
        syncScroll(renderer: import("ace-code/src/virtual_renderer").VirtualRenderer): void;
        scrollA: any;
        scrollB: any;
        scrollSetBy: any;
        scrollSetAt: number;
    }
    import { BaseDiffView } from "ace-code/src/ext/diff/base_diff_view";
}
declare module "ace-code/src/ext/diff/providers/default" {
    export function computeDiff(originalLines: any, modifiedLines: any, options: any): any;
    /**
     * VSCode’s computeDiff provider
     */
    export class DiffProvider {
        compute(originalLines: any, modifiedLines: any, opts: any): any;
    }
}
declare module "ace-code/src/ext/diff" {
    /**
     * Interface representing a model for handling differences between two views or states.
     */
    export type DiffModel = {
        /**
         * - The editor for the original view.
         */
        editorA?: import("ace-code/src/editor").Editor;
        /**
         * - The editor for the edited view.
         */
        editorB?: import("ace-code/src/editor").Editor;
        /**
         * - The edit session for the original view.
         */
        sessionA?: import("ace-code/src/edit_session").EditSession;
        /**
         * - The edit session for the edited view.
         */
        sessionB?: import("ace-code/src/edit_session").EditSession;
        /**
         * - The original content.
         */
        valueA?: string;
        /**
         * - The modified content.
         */
        valueB?: string;
        /**
         * - Whether to show the original view("a") or modified view("b") for inline diff view
         */
        inline?: "a" | "b";
        /**
         * - Provider for computing differences between original and modified content.
         */
        diffProvider?: IDiffProvider;
    };
    export type DiffViewOptions = {
        /**
         * - Whether to show line numbers in the other editor's gutter
         */
        showOtherLineNumbers?: boolean;
        /**
         * - Whether to enable code folding widgets
         */
        folding?: boolean;
        /**
         * - Whether to synchronize selections between both editors
         */
        syncSelections?: boolean;
        /**
         * - Whether to ignore trimmed whitespace when computing diffs
         */
        ignoreTrimWhitespace?: boolean;
        /**
         * - Whether to enable word wrapping in both editors
         */
        wrap?: boolean;
        /**
         * - Maximum number of diffs to compute before failing silently
         */
        maxDiffs?: number;
        /**
         * - Theme to apply to both editors
         */
        theme?: string | import("ace-code").Ace.Theme;
    };
    export type IDiffProvider = {
        /**
         * - Computes differences between original and modified lines
         */
        compute: (originalLines: string[], modifiedLines: string[], opts?: any) => import("ace-code/src/ext/diff/base_diff_view").DiffChunk[];
    };
    import { InlineDiffView } from "ace-code/src/ext/diff/inline_diff_view";
    import { SplitDiffView } from "ace-code/src/ext/diff/split_diff_view";
    import { DiffProvider } from "ace-code/src/ext/diff/providers/default";
    /**
     * Interface representing a model for handling differences between two views or states.
     * @property {import("ace-code/src/editor").Editor} [editorA] - The editor for the original view.
     * @property {import("ace-code/src/editor").Editor} [editorB] - The editor for the edited view.
     * @property {import("ace-code/src/edit_session").EditSession} [sessionA] - The edit session for the original view.
     * @property {import("ace-code/src/edit_session").EditSession} [sessionB] - The edit session for the edited view.
     * @property {string} [valueA] - The original content.
     * @property {string} [valueB] - The modified content.
     * @property {"a"|"b"} [inline] - Whether to show the original view("a") or modified view("b") for inline diff view
     * @property {IDiffProvider} [diffProvider] - Provider for computing differences between original and modified content.
     */
    /**
     * @property {boolean} [showOtherLineNumbers=true] - Whether to show line numbers in the other editor's gutter
     * @property {boolean} [folding] - Whether to enable code folding widgets
     * @property {boolean} [syncSelections] - Whether to synchronize selections between both editors
     * @property {boolean} [ignoreTrimWhitespace] - Whether to ignore trimmed whitespace when computing diffs
     * @property {boolean} [wrap] - Whether to enable word wrapping in both editors
     * @property {number} [maxDiffs=5000] - Maximum number of diffs to compute before failing silently
     * @property {string|import("ace-code").Ace.Theme} [theme] - Theme to apply to both editors
     */
    /**
     * @property {(originalLines: string[], modifiedLines: string[], opts?: any) => import("ace-code/src/diff/base_diff_view").DiffChunk[]} compute - Computes differences between original and modified lines
     */
    /**
     * Creates a diff view for comparing code.
     * @param {DiffModel} [diffModel] model for the diff view
     * @param {DiffViewOptions} [options] options for the diff view
     * @returns {InlineDiffView|SplitDiffView} Configured diff view instance
     */
    export function createDiffView(diffModel?: DiffModel, options?: DiffViewOptions): InlineDiffView | SplitDiffView;
    export { InlineDiffView, SplitDiffView, DiffProvider };
}
declare module "ace-code/src/ext/diff/base_diff_view" {
    export class BaseDiffView {
        /**
         * Constructs a new base DiffView instance.
         * @param {boolean} [inlineDiffEditor] - Whether to use an inline diff editor.
         * @param {HTMLElement} [container] - optional container element for the DiffView.
         */
        constructor(inlineDiffEditor?: boolean, container?: HTMLElement);
        onChangeTheme(e: any): void;
        onInput(): void;
        onChangeFold(ev: any, session: EditSession): void;
        realign(): void;
        onSelect(e: any, selection: any): void;
        onChangeWrapLimit(e: any, session: any): void;
        realignPending: boolean;
        diffSession: {
            sessionA: EditSession;
            sessionB: EditSession;
            chunks: DiffChunk[];
        };
        /**@type DiffChunk[]*/ chunks: DiffChunk[];
        inlineDiffEditor: boolean;
        currentDiffIndex: number;
        diffProvider: {
            compute: (val1: any, val2: any, options: any) => any[];
        };
        container: HTMLElement;
        markerB: DiffHighlight;
        markerA: DiffHighlight;
        showSideA: boolean;
        savedOptionsA: Partial<import("ace-code").Ace.EditorOptions>;
        savedOptionsB: Partial<import("ace-code").Ace.EditorOptions>;
        editorA: any;
        editorB: any;
        activeEditor: any;
        otherSession: EditSession;
        otherEditor: any;
        addGutterDecorators(): void;
        gutterDecoratorA: MinimalGutterDiffDecorator;
        gutterDecoratorB: MinimalGutterDiffDecorator;
        foldUnchanged(): boolean;
        unfoldUnchanged(): void;
        toggleFoldUnchanged(): void;
        setDiffSession(session: {
            sessionA: any;
            sessionB: EditSession;
            chunks: DiffChunk[];
        }): void;
        sessionA: EditSession;
        sessionB: EditSession;
        getDiffSession(): {
            sessionA: EditSession;
            sessionB: EditSession;
            chunks: DiffChunk[];
        };
        setTheme(theme: any): void;
        getTheme(): any;
        resize(force: any): void;
        scheduleOnInput(): void;
        selectionRangeA: any;
        selectionRangeB: any;
        setupScrollbars(): void;
        updateScrollBarDecorators(): void;
        setProvider(provider: import("ace-code/src/ext/diff").DiffProvider): void;
        /**
         * scroll locking
         * @abstract
         **/
        align(): void;
        syncSelect(selection: any): void;
        updateSelectionMarker(marker: any, session: any, range: any): void;
        scheduleRealign(): void;
        detach(): void;
        destroy(): void;
        gotoNext(dir: any): void;
        firstDiffSelected(): boolean;
        lastDiffSelected(): boolean;
        transformRange(range: Range, isOriginal: boolean): Range;
        transformPosition(pos: import("ace-code").Ace.Point, isOriginal: boolean): import("ace-code").Ace.Point;
        printDiffs(): void;
        findChunkIndex(chunks: DiffChunk[], row: number, isOriginal: boolean): number;
        searchHighlight(selection: any): void;
        initSelectionMarkers(): void;
        syncSelectionMarkerA: SyncSelectionMarker;
        syncSelectionMarkerB: SyncSelectionMarker;
        clearSelectionMarkers(): void;
    }
    import { EditSession } from "ace-code/src/edit_session";
    export class DiffChunk {
        /**
         * @param {{originalStartLineNumber: number, originalStartColumn: number,
         * originalEndLineNumber: number, originalEndColumn: number, modifiedStartLineNumber: number,
         * modifiedStartColumn: number, modifiedEndLineNumber: number, modifiedEndColumn: number}[]} [charChanges]
         */
        constructor(originalRange: Range, modifiedRange: Range, charChanges?: {
            originalStartLineNumber: number;
            originalStartColumn: number;
            originalEndLineNumber: number;
            originalEndColumn: number;
            modifiedStartLineNumber: number;
            modifiedStartColumn: number;
            modifiedEndLineNumber: number;
            modifiedEndColumn: number;
        }[]);
        old: Range;
        new: Range;
        charChanges: DiffChunk[];
    }
    export class DiffHighlight {
        constructor(diffView: import("ace-code/src/ext/diff/base_diff_view").BaseDiffView, type: any);
        id: number;
        diffView: BaseDiffView;
        type: any;
        update(html: any, markerLayer: any, session: any, config: any): void;
    }
    import { MinimalGutterDiffDecorator } from "ace-code/src/ext/diff/gutter_decorator";
    import { Editor } from "ace-code/src/editor";
    import { Range } from "ace-code/src/range";
    class SyncSelectionMarker {
        id: number;
        type: string;
        clazz: string;
        update(html: any, markerLayer: any, session: any, config: any): void;
        setRange(range: Range): void;
        range: Range;
    }
    namespace Ace {
        type OptionsProvider<T> = import("ace-code").Ace.OptionsProvider<T>;
    }
    export interface BaseDiffView extends Ace.OptionsProvider<import("ace-code/src/ext/diff").DiffViewOptions> {
    }
}
declare module "ace-code/src/ext/elastic_tabstops_lite" {
    export class ElasticTabstopsLite {
        constructor(editor: Editor);
        onAfterExec: () => void;
        onExec: () => void;
        onChange: (delta: any) => void;
        processRows(rows: number[]): void;
    }
    import { Editor } from "ace-code/src/editor";
}
declare module "ace-code/src/ext/menu_tools/settings_menu.css" {
    const _exports: string;
    export = _exports;
}
declare module "ace-code/src/ext/menu_tools/overlay_page" {
    export function overlayPage(editor: import("ace-code/src/editor").Editor, contentElement: HTMLElement, callback?: () => void): {
        close: () => void;
        setIgnoreFocusOut: (ignore: boolean) => void;
    };
}
declare module "ace-code/src/ext/modelist" {
    /**
     * Suggests a mode based on the file extension present in the given path
     * @param {string} path The path to the file
     * @returns {Mode} Returns an object containing information about the
     *  suggested mode.
     */
    export function getModeForPath(path: string): Mode;
    /**
     * Represents an array to store various syntax modes.
     *
     * 
     */
    export var modes: Mode[];
    /**
     * An object that serves as a mapping of mode names to their corresponding mode data.
     * The keys of this object are mode names (as strings), and the values are expected
     * to represent data associated with each mode.
     *
     * This structure can be used for quick lookups of mode information by name.
     * 
     */
    export var modesByName: Record<string, Mode>;
    class Mode {
        constructor(name: string, caption: string, extensions: string);
        name: string;
        caption: string;
        mode: string;
        extensions: string;
        extRe: RegExp;
        supportsFile(filename: string): RegExpMatchArray | null;
    }
}
declare module "ace-code/src/ext/themelist" {
    export const themesByName: {
        [x: string]: Theme;
    };
    export const themes: Theme[];
    export type Theme = {
        /**
         * - The display caption of the theme.
         */
        caption: string;
        /**
         * - The path or identifier for the ACE theme.
         */
        theme: string;
        /**
         * - Indicates whether the theme is dark or light.
         */
        isDark: boolean;
        /**
         * - The normalized name used as the key.
         */
        name: string;
    };
}
declare module "ace-code/src/ext/options" {
    /**
     * Option panel component for configuring settings or options.
     * The panel is designed to integrate with an editor and render various UI controls based on provided configuration.
     */
    export class OptionPanel {
        constructor(editor: Editor, element?: HTMLElement);
        editor: import("ace-code/src/editor").Editor;
        container: HTMLElement;
        groups: any[];
        options: {};
        add(config: any): void;
        render(): void;
        renderOptionGroup(group: any): any[];
        renderOptionControl(key: string, option: any): any;
        renderOption(key: any, option: any): (string | any[] | {
            class: string;
        })[];
        setOption(option: string | number | any, value: string | number | boolean): void;
        getOption(option: any): any;
    }
    export type Editor = import("ace-code/src/editor").Editor;
    export namespace optionGroups {
        let Main: {
            Mode: {
                path: string;
                type: string;
                items: {
                    caption: string;
                    value: string;
                }[];
            };
            Theme: {
                path: string;
                type: string;
                items: {
                    Bright: any[];
                    Dark: any[];
                };
            };
            Keybinding: {
                type: string;
                path: string;
                items: {
                    caption: string;
                    value: string;
                }[];
            };
            "Font Size": {
                path: string;
                type: string;
                defaultValue: number;
                defaults: {
                    caption: string;
                    value: number;
                }[];
            };
            "Soft Wrap": {
                type: string;
                path: string;
                items: {
                    caption: string;
                    value: string;
                }[];
            };
            "Cursor Style": {
                path: string;
                items: {
                    caption: string;
                    value: string;
                }[];
            };
            Folding: {
                path: string;
                items: {
                    caption: string;
                    value: string;
                }[];
            };
            "Soft Tabs": ({
                path: string;
                ariaLabel?: undefined;
                type?: undefined;
                values?: undefined;
            } | {
                ariaLabel: string;
                path: string;
                type: string;
                values: number[];
            })[];
            Overscroll: {
                type: string;
                path: string;
                items: {
                    caption: string;
                    value: number;
                }[];
            };
        };
        let More: {
            "Atomic soft tabs": {
                path: string;
            };
            "Enable Behaviours": {
                path: string;
            };
            "Wrap with quotes": {
                path: string;
            };
            "Enable Auto Indent": {
                path: string;
            };
            "Full Line Selection": {
                type: string;
                values: string;
                path: string;
            };
            "Highlight Active Line": {
                path: string;
            };
            "Show Invisibles": {
                path: string;
            };
            "Show Indent Guides": {
                path: string;
            };
            "Highlight Indent Guides": {
                path: string;
            };
            "Persistent HScrollbar": {
                path: string;
            };
            "Persistent VScrollbar": {
                path: string;
            };
            "Animate scrolling": {
                path: string;
            };
            "Show Gutter": {
                path: string;
            };
            "Show Line Numbers": {
                path: string;
            };
            "Relative Line Numbers": {
                path: string;
            };
            "Fixed Gutter Width": {
                path: string;
            };
            "Show Print Margin": ({
                path: string;
                ariaLabel?: undefined;
                type?: undefined;
            } | {
                ariaLabel: string;
                type: string;
                path: string;
            })[];
            "Indented Soft Wrap": {
                path: string;
            };
            "Highlight selected word": {
                path: string;
            };
            "Fade Fold Widgets": {
                path: string;
            };
            "Use textarea for IME": {
                path: string;
            };
            "Merge Undo Deltas": {
                path: string;
                items: {
                    caption: string;
                    value: string;
                }[];
            };
            "Elastic Tabstops": {
                path: string;
            };
            "Incremental Search": {
                path: string;
            };
            "Read-only": {
                path: string;
            };
            "Copy without selection": {
                path: string;
            };
            "Live Autocompletion": {
                path: string;
            };
            "Custom scrollbar": {
                path: string;
            };
            "Use SVG gutter icons": {
                path: string;
            };
            "Annotations for folded lines": {
                path: string;
            };
            "Keyboard Accessibility Mode": {
                path: string;
            };
        };
    }
    namespace Ace {
        type EventEmitter<T extends {
            [K in keyof T]: (...args: any[]) => any;
        }> = import("ace-code").Ace.EventEmitter<T>;
        type OptionPanelEvents = import("ace-code").Ace.OptionPanelEvents;
    }
    export interface OptionPanel extends Ace.EventEmitter<Ace.OptionPanelEvents> {
    }
}
declare module "ace-code/src/ext/error_marker" {
    export function showErrorMarker(editor: import("ace-code/src/editor").Editor, dir: number): void;
}
declare module "ace-code/src/ext/beautify" {
    export const singletonTags: string[];
    export const blockTags: string[];
    export const formatOptions: {
        lineBreaksAfterCommasInCurlyBlock?: boolean;
    };
    export function beautify(session: import("ace-code/src/edit_session").EditSession): void;
    export const commands: import("ace-code").Ace.Command[];
}
declare module "ace-code/src/ext/code_lens" {
    export function setLenses(session: EditSession, lenses: import("ace-code").Ace.CodeLense[]): number;
    export function registerCodeLensProvider(editor: import("ace-code/src/editor").Editor, codeLensProvider: import("ace-code").Ace.CodeLenseProvider): void;
    export function clear(session: EditSession): void;
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    export type VirtualRenderer = import("ace-code/src/virtual_renderer").VirtualRenderer & {
    };
    export type CodeLenseCommand = import("ace-code").Ace.CodeLenseCommand;
    export type CodeLense = import("ace-code").Ace.CodeLense;
    import { Editor } from "ace-code/src/editor";
}
declare module "ace-code/src/ext/emmet" {
    export const commands: HashHandler;
    export function runEmmetCommand(editor: Editor): ReturnType<typeof setTimeout> | boolean;
    export function updateCommands(editor: Editor, enabled?: boolean): void;
    export function isSupportedMode(mode: any | string): boolean;
    export function isAvailable(editor: Editor, command: string): boolean;
    export function load(cb?: Function): boolean;
    export function setCore(e: string | any): void;
    import { HashHandler } from "ace-code/src/keyboard/hash_handler";
    import { Editor } from "ace-code/src/editor";
    /**
     * Implementation of {@link IEmmetEditor} interface for Ace
     */
    export class AceEmmetEditor {
        setupContext(editor: Editor): void;
        ace: Editor;
        indentation: string;
        /**
         * Returns character indexes of selected text: object with <code>start</code>
         * and <code>end</code> properties. If there's no selection, should return
         * object with <code>start</code> and <code>end</code> properties referring
         * to current caret position
         * @example
         * var selection = editor.getSelectionRange();
         * alert(selection.start + ', ' + selection.end);
         */
        getSelectionRange(): any;
        /**
         * Creates selection from <code>start</code> to <code>end</code> character
         * indexes. If <code>end</code> is ommited, this method should place caret
         * and <code>start</code> index
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
         * @example
         * var range = editor.getCurrentLineRange();
         * alert(range.start + ', ' + range.end);
         */
        getCurrentLineRange(): any;
        /**
         * Returns current caret position
         */
        getCaretPos(): number | null;
        /**
         * Set new caret position
         * @param {Number} index Caret position
         */
        setCaretPos(index: number): void;
        /**
         * Returns content of current line
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
         */
        getContent(): string;
        /**
         * Returns current editor's syntax mode
         */
        getSyntax(): string;
        /**
         * Returns current output profile name (@see emmet#setupProfile)
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
         * @since 0.65
         */
        getSelection(): string;
        /**
         * Returns current editor's file path
         * @since 0.65
         */
        getFilePath(): string;
    }
}
declare module "ace-code/src/ext/hardwrap" {
    /**
     * Wraps lines at specified column limits and optionally merges short adjacent lines.
     *
     * Processes text within the specified row range, breaking lines that exceed the maximum column
     * width at appropriate word boundaries while preserving indentation. When merge is enabled,
     * combines short consecutive lines that can fit within the column limit. Automatically adjusts
     * the end row when new line breaks are inserted to ensure all affected content is processed.
     *
     * @param {import("ace-code/src/editor").Editor} editor - The editor instance containing the text to wrap
     * @param {import("ace-code").Ace.HardWrapOptions} options - Configuration options for wrapping behavior
     */
    export function hardWrap(editor: import("ace-code/src/editor").Editor, options: import("ace-code").Ace.HardWrapOptions): void;
    import { Editor } from "ace-code/src/editor";
}
declare module "ace-code/src/ext/menu_tools/get_editor_keyboard_shortcuts" {
    export function getEditorKeybordShortcuts(editor: import("ace-code/src/editor").Editor): any[];
}
declare module "ace-code/src/ext/keybinding_menu" {
    export function init(editor: Editor): void;
    import { Editor } from "ace-code/src/editor";
}
declare module "ace-code/src/ext/linking" { }
declare module "ace-code/src/ext/prompt" {
    export type PromptOptions = {
        /**
         * Prompt name.
         */
        name: string;
        /**
         * Defines which part of the predefined value should be highlighted.
         */
        selection: [
            number,
            number
        ];
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
    export type Editor = import("ace-code/src/editor").Editor;
    /**
     * @property {String} name             Prompt name.
     * @property {String} $type            Use prompt of specific type (gotoLine|commands|modes or default if empty).
     * @property {[number, number]} selection  Defines which part of the predefined value should be highlighted.
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
         * Displays a "Go to Line" prompt for navigating to specific line and column positions with selection support.
         *
         * @param {Editor} editor - The editor instance to navigate within
         */
        function gotoLine(editor: Editor, callback?: Function): void;
        /**
         * Displays a searchable command palette for executing editor commands with keyboard shortcuts and history.
         *
         * @param {Editor} editor - The editor instance to execute commands on
         */
        function commands(editor: Editor, callback?: Function): void;
        /**
         * Shows an interactive prompt containing all available syntax highlighting modes
         * that can be applied to the editor session. Users can type to filter through the modes list
         * and select one to change the editor's syntax highlighting mode. The prompt includes real-time
         * filtering based on mode names and captions.
         *
         * @param {Editor} editor - The editor instance to change the language mode for
         */
        function modes(editor: Editor, callback?: Function): void;
    }
}
declare module "ace-code/src/ext/rtl" {
}
declare module "ace-code/src/ext/settings_menu" {
    export function init(): void;
}
declare module "ace-code/src/ext/simple_tokenizer" {
    /**
     * Parses provided content according to provided highlighting rules and return tokens.
     * Tokens either have the className set according to Ace themes or have no className if they are just pure text tokens.
     * Result is a list of list of tokens, where each line from the provided content is a separate list of tokens.
     *
     * @param {string} content to tokenize
     * @param {import("ace-code").Ace.HighlightRules} highlightRules defining the language grammar
     * @returns {import("ace-code").Ace.TokenizeResult} tokenization result containing a list of token for each of the lines from content
     */
    export function tokenize(content: string, highlightRules: import("ace-code").Ace.HighlightRules): import("ace-code").Ace.TokenizeResult;
}
declare module "ace-code/src/ext/spellcheck" {
    export function contextMenuHandler(e: any): void;
}
declare module "ace-code/src/ext/split" {
    const _exports: typeof import("ace-code/src/split");
    export = _exports;
}
declare module "ace-code/src/ext/static-css" {
    const _exports: string;
    export = _exports;
}
declare module "ace-code/src/ext/static_highlight" {
    /**
     * Applies syntax highlighting to an HTML element containing code.
     *
     * Automatically detects the language from CSS class names (e.g., 'lang-javascript') or uses
     * the specified mode. Transforms the element's content into syntax-highlighted HTML with
     * CSS styling and preserves any existing child elements by repositioning them after highlighting.
     *
     * @param {HTMLElement} el - The HTML element containing code to highlight
     * @param {import("ace-code").Ace.StaticHighlightOptions} opts - Highlighting options
     * @param {function} [callback] - Optional callback executed after highlighting is complete
     * @returns {boolean} Returns false if no valid mode is found, otherwise true
     */
    function highlight(el: HTMLElement, opts: import("ace-code").Ace.StaticHighlightOptions, callback?: Function): boolean;
    export namespace highlight {
        export { render, renderSync, highlight, SyntaxMode, Theme };
    }
    /**
     * Transforms a given input code snippet into HTML using the given mode
     *
     * @param {string} input Code snippet
     * @param {string | SyntaxMode} mode String specifying the mode to load such as
     *  `ace/mode/javascript` or, a mode loaded from `/ace/mode`
     *  (use 'ServerSideHiglighter.getMode').
     * @param {string | Theme} theme String specifying the theme to load such as
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
    function render(input: string, mode: string | SyntaxMode, theme: string | Theme, lineStart: number, disableGutter: boolean, callback?: Function): object;
    /**
     * Transforms a given input code snippet into HTML using the given mode
     * @param {string} input Code snippet
     * @param {SyntaxMode | string} mode Mode loaded from /ace/mode (use 'ServerSideHiglighter.getMode')
     * @returns {object} An object containing: html, css
     */
    function renderSync(input: string, mode: SyntaxMode | string, theme: Theme, lineStart: any, disableGutter: boolean): object;
    type SyntaxMode = import("ace-code").Ace.SyntaxMode;
    type Theme = import("ace-code").Ace.Theme;
}
declare module "ace-code/src/ext/statusbar" {
    export type Editor = import("ace-code/src/editor").Editor;
    /** simple statusbar **/
    export class StatusBar {
        constructor(editor: Editor, parentNode: HTMLElement);
        element: HTMLDivElement;
        updateStatus(editor: Editor): void;
    }
}
declare module "ace-code/src/ext/whitespace" {
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
    export type EditSession = import("ace-code/src/edit_session").EditSession;
}
