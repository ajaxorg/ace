declare module "ace-code/src/ext/command_bar" {
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
    export class CommandBarTooltip {
        /**
         * @param {HTMLElement} parentNode
         * @param {Partial<import("ace-code").Ace.CommandBarOptions>} [options]
         */
        constructor(parentNode: HTMLElement, options?: Partial<import("ace-code").Ace.CommandBarOptions>);
        parentNode: HTMLElement;
        tooltip: Tooltip;
        moreOptions: Tooltip;
        maxElementsOnTooltip: number;
        eventListeners: {};
        elements: {};
        commands: {};
        tooltipEl: any[] | HTMLElement | Text;
        moreOptionsEl: any[] | HTMLElement | Text;
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
    import Tooltip_2 = require("ace-code/src/tooltip");
    import Tooltip = Tooltip_2.Tooltip;
    export var TOOLTIP_CLASS_NAME: string;
    export var BUTTON_CLASS_NAME: string;
    export { };
    namespace Ace {
        type EventEmitter<T> = import("ace-code").Ace.EventEmitter<T>;
    }
    export interface CommandBarTooltip extends Ace.EventEmitter<any> {
    }
}
declare module "ace-code/src/ext/language_tools" {
    export function setCompleters(val: any): void;
    export function addCompleter(completer: any): void;
    import textCompleter = require("ace-code/src/autocomplete/text_completer");
    /**@type {import("ace-code").Ace.Completer}*/
    export var keyWordCompleter: import("ace-code").Ace.Completer;
    /**@type {import("ace-code").Ace.Completer} */
    export var snippetCompleter: import("ace-code").Ace.Completer;
    export { textCompleter };
}
declare module "ace-code/src/ext/inline_autocomplete" {
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
         * @param {import("ace-code").Ace.CompletionOptions} options
         */
        show(options: import("ace-code").Ace.CompletionOptions): void;
        activated: boolean;
        insertMatch(): boolean;
        /**
         * @param {import("ace-code").Ace.InlineAutocompleteAction} where
         */
        goTo(where: import("ace-code").Ace.InlineAutocompleteAction): void;
        getLength(): any;
        /**
         * @param {number} [index]
         * @returns {import("ace-code").Ace.Completion | undefined}
         */
        getData(index?: number): import("ace-code").Ace.Completion | undefined;
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
        /**
         * @param {import("ace-code").Ace.CompletionOptions} [options]
         */
        updateCompletions(options?: import("ace-code").Ace.CompletionOptions): void;
        base: import("ace-code/src/anchor").Anchor;
        completions: FilteredList;
        detach(): void;
        destroy(): void;
        updateDocTooltip(): void;
        /**
         *
         * @type {{[key: string]: import("ace-code").Ace.Command}}
         */
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
    import Editor_2 = require("ace-code/src/editor");
    import Editor = Editor_2.Editor;
    import HashHandler_2 = require("ace-code/src/keyboard/hash_handler");
    import HashHandler = HashHandler_2.HashHandler;
    import AceInline_2 = require("ace-code/src/autocomplete/inline");
    import AceInline = AceInline_2.AceInline;
    import CommandBarTooltip_1 = require("ace-code/src/ext/command_bar");
    import CommandBarTooltip = CommandBarTooltip_1.CommandBarTooltip;
    import CompletionProvider_1 = require("ace-code/src/autocomplete");
    import CompletionProvider = CompletionProvider_1.CompletionProvider;
    import FilteredList_1 = require("ace-code/src/autocomplete");
    import FilteredList = FilteredList_1.FilteredList;
}
declare module "ace-code/src/ext/searchbox-css" {
    const _exports: string;
    export = _exports;
}
declare module "ace-code/src/ext/searchbox" {
    export function Search(editor: Editor, isReplace?: boolean): void;
    export type Editor = import("ace-code/src/editor").Editor;
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
        setSearchRange(range: any): void;
        searchRangeMarker: number;
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
    }
    import HashHandler_3 = require("ace-code/src/keyboard/hash_handler");
    import HashHandler = HashHandler_3.HashHandler;
}
declare module "ace-code/src/ext/elastic_tabstops_lite" {
    export class ElasticTabstopsLite {
        /**
         * @param {Editor} editor
         */
        constructor(editor: Editor);
        onAfterExec: () => void;
        onExec: () => void;
        onChange: (delta: any) => void;
        /**
         * @param {number[]} rows
         */
        processRows(rows: number[]): void;
    }
    import Editor_3 = require("ace-code/src/editor");
    import Editor = Editor_3.Editor;
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
    export const commands: {
        name: string;
        description: string;
        exec: (editor: any) => void;
        bindKey: string;
    }[];
}
declare module "ace-code/src/ext/code_lens" {
    export function setLenses(session: EditSession, lenses: any): number;
    export function registerCodeLensProvider(editor: import("ace-code/src/editor").Editor, codeLensProvider: any): void;
    export function clear(session: EditSession): void;
    export type EditSession = import("ace-code/src/edit_session").EditSession;
    export type VirtualRenderer = import("ace-code/src/virtual_renderer").VirtualRenderer & {
    };
    import Editor_7 = require("ace-code/src/editor");
    import Editor = Editor_7.Editor;
}
declare module "ace-code/src/ext/emmet" {
    export const commands: HashHandler;
    export function runEmmetCommand(editor: Editor): number | boolean;
    export function updateCommands(editor: Editor, enabled?: boolean): void;
    export function isSupportedMode(mode: any): boolean;
    export function isAvailable(editor: Editor, command: string): boolean;
    export function load(cb: any): boolean;
    export function setCore(e: any): void;
    import HashHandler_5 = require("ace-code/src/keyboard/hash_handler");
    import HashHandler = HashHandler_5.HashHandler;
    import Editor_8 = require("ace-code/src/editor");
    import Editor = Editor_8.Editor;
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
    }
}
declare module "ace-code/src/ext/hardwrap" {
    /**
     * @param {import("ace-code/src/editor").Editor} editor
     * @param {import("ace-code").Ace.HardWrapOptions} options
     */
    export function hardWrap(editor: import("ace-code/src/editor").Editor, options: import("ace-code").Ace.HardWrapOptions): void;
    import Editor_9 = require("ace-code/src/editor");
    import Editor = Editor_9.Editor;
}
declare module "ace-code/src/ext/menu_tools/settings_menu.css" {
    const _exports: string;
    export = _exports;
}
declare module "ace-code/src/ext/menu_tools/overlay_page" {
    export function overlayPage(editor: any, contentElement: HTMLElement, callback?: any): {
        close: () => void;
        setIgnoreFocusOut: (ignore: boolean) => void;
    };
}
declare module "ace-code/src/ext/menu_tools/get_editor_keyboard_shortcuts" {
    export function getEditorKeybordShortcuts(editor: import("ace-code/src/editor").Editor): any[];
}
declare module "ace-code/src/ext/keybinding_menu" {
    export function init(editor: Editor): void;
    import Editor_10 = require("ace-code/src/editor");
    import Editor = Editor_10.Editor;
}
declare module "ace-code/src/ext/linking" { }
declare module "ace-code/src/ext/modelist" {
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
    export { };
}
declare module "ace-code/src/ext/themelist" {
    export const themesByName: {};
    export const themes: {
        caption: string;
        theme: string;
        isDark: boolean;
        name: string;
    }[];
}
declare module "ace-code/src/ext/options" {
    const OptionPanel_base: undefined;
    export class OptionPanel {
        /**
         *
         * @param {Editor} editor
         * @param {HTMLElement} [element]
         */
        constructor(editor: Editor, element?: HTMLElement);
        editor: import("ace-code/src/editor").Editor;
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
    export type Editor = import("ace-code/src/editor").Editor;
    export { };
    namespace Ace {
        type EventEmitter<T> = import("ace-code").Ace.EventEmitter<T>;
    }
    export interface OptionPanel extends Ace.EventEmitter<any> {
    }
}
declare module "ace-code/src/ext/prompt" {
    export type PromptOptions = {
        /**
         * Prompt name.
         */
        name: string;
        /**
         * Defines which part of the predefined value should be highlited.
         */
        selection: [
            start: number,
            end: number
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
        function gotoLine(editor: Editor, callback?: Function): void;
        /**
         *
         * @param {Editor} editor
         * @param {Function} [callback]
         */
        function commands(editor: Editor, callback?: Function): void;
        /**
         *
         * @param {Editor} editor
         * @param {Function} [callback]
         */
        function modes(editor: Editor, callback?: Function): void;
    }
}
declare module "ace-code/src/ext/rtl" {
    export { };
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
     *
     * @param {HTMLElement} el
     * @param opts
     * @param [callback]
     * @returns {boolean}
     */
    function highlight(el: HTMLElement, opts: any, callback?: any): boolean;
    export namespace highlight {
        export { render, renderSync, highlight };
    }
    /**
     * Transforms a given input code snippet into HTML using the given mode
     *
     * @param {string} input Code snippet
     * @param {string|import("ace-code").Ace.SyntaxMode} mode String specifying the mode to load such as
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
    function render(input: string, mode: string | import("ace-code").Ace.SyntaxMode, theme: string, lineStart: number, disableGutter: boolean, callback?: Function): object;
    /**
     * Transforms a given input code snippet into HTML using the given mode
     * @param {string} input Code snippet
     * @param {import("ace-code").Ace.SyntaxMode|string} mode Mode loaded from /ace/mode (use 'ServerSideHiglighter.getMode')
     * @param {any} theme
     * @param {any} lineStart
     * @param {boolean} disableGutter
     * @returns {object} An object containing: html, css
     */
    function renderSync(input: string, mode: import("ace-code").Ace.SyntaxMode | string, theme: any, lineStart: any, disableGutter: boolean): object;
}
declare module "ace-code/src/ext/statusbar" {
    export type Editor = import("ace-code/src/editor").Editor;
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
declare module "ace-code/src/ext/textarea" {
    const _exports: {
        config: {
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
            get: <K extends keyof import("ace-code").Ace.ConfigOptions>(key: K) => import("ace-code").Ace.ConfigOptions[K];
            set: <K extends keyof import("ace-code").Ace.ConfigOptions>(key: K, value: import("ace-code").Ace.ConfigOptions[K]) => void;
            all: () => import("ace-code").Ace.ConfigOptions;
            moduleUrl: (name: string, component?: string) => string;
            setModuleUrl: (name: string, subst: string) => string;
            setLoader: (cb: any) => void;
            dynamicModules: any;
            loadModule: (moduleId: string | [
                string,
                string
            ], onLoad: (module: any) => void) => void;
            setModuleLoader: (moduleName: any, onLoad: any) => void;
            version: "1.36.2";
        };
        edit: (el: string | (HTMLElement & {
            env?: any;
            value?: any;
        }), options?: any) => ace.Editor;
        createEditSession: (text: import("ace-code/src/document").Document | string, mode?: import("ace-code").Ace.SyntaxMode) => ace.EditSession;
        Range: typeof ace.Range;
        Editor: typeof ace.Editor;
        EditSession: typeof ace.EditSession;
        UndoManager: typeof ace.UndoManager;
        VirtualRenderer: typeof ace.VirtualRenderer;
        version: "1.36.2";
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
    import ace = require("ace-code");
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
