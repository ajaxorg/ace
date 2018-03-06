declare namespace Ace {
  export interface IEditorOptions {
    selectionStyle: string;
    highlightActiveLine: boolean;
    highlightSelectedWord: boolean;
    readOnly: boolean;
    copyWithEmptySelection: boolean;
    cursorStyle: 'ace' | 'slim' | 'smooth' | 'wide';
    mergeUndoDeltas: true | false | 'always';
    behavioursEnabled: boolean;
    wrapBehavioursEnabled: boolean;
    autoScrollEditorIntoView: boolean;
    keyboardHandler: string;
    value: string;
    session: ace.EditSession;

    // Pass-through to VirtualRenderer
    hScrollBarAlwaysVisible: boolean;
    vScrollBarAlwaysVisible: boolean;
    highlightGutterLine: boolean;
    animatedScroll: boolean;
    showInvisibles: boolean;
    showPrintMargin: boolean;
    printMarginColumn: number;
    printMargin: boolean | number;
    fadeFoldWidgets: boolean;
    showFoldWidgets: boolean;
    showLineNumbers: boolean;
    showGutter: boolean;
    displayIndentGuides: boolean;
    fontSize: number;
    fontFamily: string;
    maxLines: number;
    minLines: number;
    scrollPastEnd: boolean;
    fixedWidthGutter: boolean;
    theme: string;
    hasCssTransforms: boolean;

    // Pass-through to MouseHandler
    scrollSpeed: number;
    dragDelay: number;
    dragEnabled: boolean;
    focusTimeout: number;
    tooltipFollowsMouse: boolean;

    // Pass-through to EditSession
    firstLineNumber: number;
    overwrite: boolean;
    newLineMode: 'auto' | 'unix' | 'windows';
    useWorker: boolean;
    useSoftTabs: boolean;
    navigateWithinSoftTabs: boolean;
    tabSize: number;
    wrap: boolean | number;
    indentedSoftWrap: boolean;
    foldStyle: 'markbegin' | 'markbeginend' | 'manual';
    mode: string;
  }

  export class Editor {
    public container: HTMLElement;
    public renderer: VirtualRenderer;
    public id: string;
    public commands: CommandManager;
    public keyBinding: KeyBinding;

    constructor(renderer: VirtualRenderer,
                session: EditSession,
                options?: Partial<IEditorOptions>);

    public setKeyboardHandler(keyboardHandler: string, callback?: () => void);

    public getKeyboardHandler(): string;

    public setSession(session: EditSession): void;

    public getSession(): EditSession;

    public setValue(val: string, cursorPos?: number): string;

    public getValue(): string;

    public getSelection(): Selection;

    public resize(force?: boolean): void;

    public setTheme(theme: string, callback?: () => void);

    public getTheme(): string;

    public setStyle(style: string): void;

    public unsetStyle(style: string): vooid;

    public getFontSize(): string;

    public setFontSize(size: string): void;

    public focus(): void;

    public isFocused(): boolean;

    public flur(): void;

    public getSelectedText(): string;

    public getCopyText(): string;

    public execCommand(command: string | string[], args: any): boolean;

    public insert(text: string, pasted?: boolean): void;

    public setOverwrite(overwrite: boolean): void;

    public getOverwrite(): boolean;

    public toggleOverwrite(): void;

    public setScrollSpeed(speed: number): void;

    public getScrollSpeed(): number;

    public setDragDelay(dragDelay: number): void;

    public getDragDelay(): number;

    public setSelectionStyle(val: string): void;

    public getSelectionStyle(): string;

    public setHighlightActiveLine(shouldHighlight: boolean): void;

    public getHighlightActiveLine(): boolean;

    public setHighlightGutterLine(shouldHighlight: boolean): void;

    public getHighlightGutterLine(): boolean;

    public setHighlightSelectedWord(shouldHighlight: boolean): void;

    public getHighlightSelectedWord(): boolean;

    public setAnimatedScroll(shouldAnimate: boolean): void;

    public getAnimatedScroll(): boolean;

    public setShowInvisibles(showInvisibles: boolean): void;

    public getShowInvisibles(): boolean;

    public setDisplayIndentGuides(display: boolean): void;

    public getDisplayIndentGuides(): boolean;

    public setShowPrintMargin(showPrintMargin: boolean): void;

    public getShowPrintMargin(): boolean;

    public setPrintMarginColumn(showPrintMargin: number): void;

    public getPrintMarginColumn(): number;

    public setReadOnly(readOnly: boolean): void;

    public getReadOnly(): boolean;

    public setBehavioursEnabled(enabled: boolean): void;

    public getBehavioursEnabled(): boolean;

    public setWrapBehavioursEnabled(enabled: boolean): void;

    public getWrapBehavioursEnabled(): boolean;

    public setShowFoldWidgets(show: boolean): void;

    public getShowFoldWidgets(): boolean;

    public setFadeFoldWidgets(fade: boolean): void;

    public getFadeFoldWidgets(): boolean;

    public remove(dir?: 'left' | 'right'): void;

    public removeWordRight(): void;

    public removeWordLeft(): void;

    public removeLineToEnd(): void;

    public splitLine(): void;

    public transposeLetters(): void;

    public toLowerCase(): void;

    public toUpperCase(): void;

    public indent(): void;

    public blockIndent(): void;

    public blockOutdent(): void;

    public sortLines(): void;

    public toggleCommentLines(): void;

    public toggleBlockComment(): void;

    public modifyNumber(amount: number): void;

    public removeLines(): void;

    public duplicateSelection(): void;

    public moveLinesDown(): void;

    public moveLinesUp(): void;

    public moveText(range: Range, toPosition: { row: number, column: number }, copy?: boolean): Range;

    public copyLinesUp(): void;

    public copyLinesDown(): void;

    public getFirstVisibleRow(): number;

    public getLastVisibleRow(): number;

    public isRowVisible(row: number): boolean;

    public isRowFullyVisible(row: number): boolean;

    public selectPageDown(): void;

    public selectPageUp(): void;

    public gotoPageDown(): void;

    public gotoPageUp(): void;

    public scrollPageDown(): void;

    public scrollPageUp(): void;

    public scrollToRow(row: number): void;

    public scrollToLine(line: number, center: boolean, animate: boolean, callback: () => void): void;

    public centerSelection(): void;

    public getCursorPosition(): { row: number, column: number };

    public getCursorPositionScreen(): { row: number, column: number };

    public getSelectionRange(): Range;

    public selectAll(): void;

    public clearSelection(): void;

    public moveCursorTo(row: number, column: number): void;

    public moveCursorToPosition(pos: { row: number, column: number }): void;

    public jumpToMatching(select: boolean, expand: boolean): void;

    public gotoLine(lineNumber: number, column: number, animate: boolean): void;

    public navigateTo(row: number, column: number): void;

    public navigateUp(): void;

    public navigateDown(): void;

    public navigateLeft(): void;

    public navigateRight(): void;

    public navigateLineStart(): void;

    public navigateLineEnd(): void;

    public navigateFileEnd(): void;

    public navigateFileStart(): void;

    public navigateWordRight(): void;

    public navigateWordLeft(): void;

    public replace(replacement: string, options?: Partial<ISearchOptions>): number;

    public replaceAll(replacement: string, options?: Partial<ISearchOptions>): number;

    public getLastSearchOptions(): Partial<ISearchOptions>;

    public find(needle: string, options?: Partial<ISearchOptions>, animate?: boolean): void;

    public findNext(options?: Partial<ISearchOptions>, animate?: boolean): void;

    public findPrevious(options?: Partial<ISearchOptions>, animate?: boolean): void;

    public undo(): void;

    public redo(): void;

    public destroy(): void;

    public setAutoScrollEditorIntoView(enable: boolean): void;
  }

  export interface AceStatic {
    version: string;
    require(name: string): any;
    edit(el: Element | string, options?: Partial<IEditorOptions>): Editor;
    createEditSession(text: Document | string, mode: TextMode): EditSession;
    config: Config;

    Range: typeof Range;
    EditSession: typeof EditSession;
    UndoManager: typeof UndoManager;
    VirtualRenderer: typeof VirtualRenderer;
  }
}

declare const ace: Ace.AceStatic;
