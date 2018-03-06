declare namespace Ace {
  export type NewLineMode = 'auto' | 'unix' | 'windows';

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
    session: EditSession;

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
    newLineMode: NewLineMode;
    useWorker: boolean;
    useSoftTabs: boolean;
    navigateWithinSoftTabs: boolean;
    tabSize: number;
    wrap: boolean | number;
    indentedSoftWrap: boolean;
    foldStyle: 'markbegin' | 'markbeginend' | 'manual';
    mode: string;
  }

  export abstract class EventEmitter {
    once(name: string, callback: Function): void;
    setDefaultHandler(name: string, callback: Function): void;
    removeDefaultHandler(name: string, callback: Function): void;
    on(name: string, callback: Function, capturing?: boolean): void;
    addEventListener(name: string, callback: Function, capturing?: boolean): void;
    off(name: string, callback: Function): void;
    removeListener(name: string, callback: Function): void;
    removeEventListener(name: string, callback: Function): void;
  }

  export interface Point {
    row: number;
    column: number;
  }

  export interface Delta {
    action: 'insert' | 'remove';
    start: Point;
    end: Point;
    lines: string[];
  }

  export interface Annotation {
    row?: number;
    column?: number;
    text: string;
    type: string;
  }

  export interface Command {
    name?: string;
    bindKey?: string | { mac?: string, win?: string };
    exec: (editor: Editor) => void;
  }

  export type CommandLike = Command | ((editor: Editor) => void);

  export interface KeyboardHandler {
    handleKeyboard: Function;
  }

  export interface MarkerLike {
    range: Range;
    type: string;
    renderer?: MarkerRenderer;
    clazz: string;
    inFront: boolean;
    id: number;
    update?: (html: string[],
              // TODO maybe define Marker class
              marker: any,
              session: EditSession,
              config: any) => void;
  }

  export type MarkerRenderer = (html: string[],
                                range: Range,
                                left: number,
                                top: number,
                                config: any) => void;

  export class EditSession extends EventEmitter {
    public selection: Selection;

    public constructor(text: string | Document, mode?: TextMode);

    public setDocument(doc: Document): void;
    public getDocument(): Document;
    public resetCaches(): void;
    public setValue(text: string): void;
    public getValue(): string;
    public getSelection(): Selection;
    public getState(row: number): string;
    public getTokens(row: number): Token[];
    public getTokenAt(row: number, column: number): Token;
    public setUndoManager(undoManager: UndoManager): void;
    public markUndoGroup(): void;
    public getUndoManager(): UndoManager;
    public getTabString(): string;
    public setUseSoftTabs(val: boolean): void;
    public getUseSoftTabs(): boolean;
    public setTabSize(tabSize: number): void;
    public getTabSize(): number;
    public isTabStop(position: Position): boolean;
    public setNavigateWithinSoftTabs(navigateWithinSoftTabs: boolean): void;
    public getNavigateWithinSoftTabs(): boolean;
    public setOverwrite(overwrite: boolean): void;
    public getOverwrite(): boolean;
    public toggleOverwrite(): void;
    public addGutterDecoration(row: number, className: string): void;
    public removeGutterDecoration(row: number, className: string): void;
    public getBreakpoints(): string[];
    public setBreakpoints(rows: number[]): void;
    public clearBreakpoints(): void;
    public setBreakpoint(row: number, className: string): void;
    public clearBreakpoint(row: number): void;
    public addMarker(range: Range,
                     clazz: string,
                     type: MarkerRenderer,
                     inFront: boolean): number;
    public addDynamicMarker(marker: MarkerLike, inFront: boolean): MarkerLike;
    public removeMarker(markerId: number): void;
    public getMarkers(inFront?: boolean): MarkerLike[];
    public highlight(re: RegExp): void;
    public highlightLines(startRow: number,
                          endRow: number,
                          clazz: string,
                          inFront?: boolean): Range;
    public setAnnotations(annotations: Annotation[]): void;
    public getAnnotations(): Annotation[];
    public clearAnnotations(): void;
    public getWordRange(row: number, column: number): Range;
    public getAWordRange(row: number, column: number): Range;
    public setNewLineMode(newLineMode: NewLineMode): void;
    public getNewLineMode(): NewLineMode;
    public setUseWorker(useWorker: boolean): void;
    public getUseWorker(): boolean;
    public setMode(mode: TextMode | string, callback?: () => void): void;
    public getMode(): TextMode;
    public setScrollTop(scrollTop: number): void;
    public getScrollTop(): number;
    public setScrollLeft(scrollLeft: number): void;
    public getScrollLeft(): number;
    public getScreenWidth(): number;
    public getLineWidgetMaxWidth(): number;
    public getLine(row: number): string;
    public getLines(firstRow: number, lastRow: number): string[];
    public getLength(): number;
    public getTextRange(range: Range): string;
    public insert(position: Position, text: string): void;
    public remove(range: Range): void;
    public removeFullLines(firstRow: number, lastRow: number): void;
    public undoChanges(deltas: Delta[], dontSelect?: boolean): void;
    public redoChanges(deltas: Delta[], dontSelect?: boolean): void;
    public setUndoSelect(enable: boolean): void;
    public replace(range: Range, text: string): void;
    public moveText(fromRange: Range, toPosition: Position, copy?: boolean): void;
    public indentRows(startRow: number, endRow: number, indentString: string): void;
    public outdentRows(range: Range): void;
    public moveLinesUp(firstRow: number, lastRow, number): void;
    public moveLinesDown(firstRow: number, lastRow: number): void;
    public duplicateLines(firstRow: number, lastRow: number): void;
    public setUseWrapMode(useWrapMode: boolean): void;
    public getUseWrapMode(): boolean;
    public setWrapLimitRange(min: number, max: number): void;
    public adjustWrapLimit(desiredLimit: number): boolean;
    public getWrapLimit(): number;
    public setWrapLimit(limit: number): void;
    public getWrapLimitRange(): { min: number, max: number };
    public getRowLineCount(row: number): number;
    public getRowWrapIndent(screenRow: number): number;
    public getScreenLastRowColumn(screenRow: number): number;
    public getDocumentLastRowColumn(docRow: number, docColumn: number): number;
    public getdocumentLastRowColumnPosition(docRow: number, docColumn: number): Position;
    public getRowSplitData(row: number): string | undefined;
    public getScreenTabSize(screenColumn: number): number;
    public screenToDocumentRow(screenRow: number, screenColumn: number): number;
    public screenToDocumentColumn(screenRow: number, screenColumn: number): number;
    public screenToDocumentPosition(screenRow: number,
                                    screenColumn: number,
                                    offsetX?: number): Position;
    public documentToScreenPosition(docRow, docColumn): Position;
    public documentToScreenColumn(row: number, docColumn: number): number;
    public documentToScreenRow(docRow: number, docColumn: number): number;
    public getScreenLength(): number;
    public destroy(): void;
  }

  export class KeyBinding {
    public setDefaultHandler(handler: KeyboardHandler): void;
    public setKeyboardHandler(handler: KeyboardHandler): void;
    public addKeyboardHandler(handler: KeyboardHandler, pos: number): void;
    public removeKeyboardHandler(handler: KeyboardHandler): boolean;
    public getKeyboardHandler(): KeyboardHandler;
    public getStatusText(): string;
  }

  export class CommandManager extends EventEmitter {
    public constructor(platform: 'mac' | 'win', commands: Array<string | CommandLike>);

    public on(name: 'changeStatus', callback: () => void): void;
    public on(name: 'exec',
              callback: (obj: {
                editor: Editor,
                command: Command,
                args: any[] }) => void): void;

    public exec(command: string, editor: Editor, args: any[]): boolean;
    public toggleRecording(editor: Editor): void;
    public replay(editor: Editor): void;
    public addCommand(command: Command): void;
    public removeCommand(command: Command, keepCommand?: boolean): void;
    public bindKey(key: string | { mac?: string, win?: string},
                   command: CommandLike,
                   position?: number): void;
  }

  export class VirtualRenderer extends EventEmitter {
    public container: HTMLElement;

    public constructor(container: HTMLElement, theme?: string);

    public setSession(session: EditSession): void;
    public updateLines(firstRow: number, lastRow: number, force?: boolean): void;
    public updateText(): void;
    public updateFull(force?: boolean): void;
    public updateFontSize(): void;
    public adjustWrapLimit(): boolean;
    public setAnimatedScroll(shouldAnimate: boolean): void;
    public getAnimatedScroll(): boolean;
    public setShowInvisibles(showInvisibles: boolean): void;
    public getShowInvisibles(): boolean;
    public setDisplayIndentGuides(display: boolean): void;
    public getDisplayIndentGuides(): boolean;
    public setShowPrintMargin(showPrintMargin: boolean): void;
    public getShowPrintMargin(): boolean;
    public setPrintMarginColumn(showPrintMargin: boolean): void;
    public getPrintMarginColumn(): boolean;
    public setShowGutter(show: boolean): void;
    public getShowGutter(): boolean;
    public setFadeFoldWidgets(show: boolean): void;
    public getFadeFoldWidgets(): boolean;
    public setHighlightGutterLine(shouldHighlight: boolean): void;
    public getHighlightGutterLine(): boolean;
    public getContainerElement(): HTMLElement;
    public getMouseEventTarget(): HTMLElement;
    public getTextAreaContainer(): HTMLElement;
    public getFirstVisibleRow(): number;
    public getFirstFullyVisibleRow(): number;
    public getLastFullyVisibleRow(): number;
    public getLastVisibleRow(): number;
    public setPadding(padding: number): void;
    public setScrollMargin(top: number,
                           bottom: number,
                           left: number,
                           right: number): void;
    public setHScrollBarAlwaysVisible(alwaysVisible: boolean): void;
    public getHScrollBarAlwaysVisible(): boolean;
    public setVScrollBarAlwaysVisible(alwaysVisible: boolean): void;
    public getVScrollBarAlwaysVisible(): boolean;
    public freeze(): void;
    public unfreeze(): void;
    public updateFrontMarkers(): void;
    public updateBackMarkers(): void;
    public updateBreakpoints(): void;
    public setAnnotations(annotations: Annotation[]): void;
    public updateCursor(): void;
    public hideCursor(): void;
    public showCursor(): void;
    public scrollSelectionIntoView(anchor: Position,
                                   lead: Position,
                                   offset?: number): void;
    public scrollCursorIntoView(cursor: Position, offset?: number): void;
    public getScrollTop(): number;
    public getScrollLeft(): number;
    public getScrollTopRow(): number;
    public getScrollBottomRow(): number;
    public scrollToRow(row: number): void;
    public alignCursor(cursor: Position | number, alignment: number): number;
    public scrollToLine(line: number,
                        center: boolean,
                        animate: boolean,
                        callback: () => void): void;
    public animateScrolling(fromValue: number, callback: () => void): void;
    public scrollToY(scrollTop: number): void;
    public scrollToX(scrollLeft: number): void;
    public scrollTo(x: number, y: number): void;
    public scrollBy(deltaX: number, deltaY: number): void;
    public isScrollableBy(deltaX: number, deltaY: number): boolean;
    public textToScreenCoordinates(row: number, column: number):
      { pageX: number, pageY: number};
    public visualizeFocus(): void;
    public visualizeBlur(): void;
    public showComposition(position: number): void;
    public setCompositionText(text: string): void;
    public hideComposition(): void;
    public setTheme(theme: string, callback?: () => void): void;
    public getTheme(): string;
    public setStyle(style: string, include?: boolean): void;
    public unsetStyle(style: string): void;
    public setCursorStyle(style: string): void;
    public setMouseCursor(cursorStyle: string): void;
    public attachToShadowRoot(): void;
    public destroy(): void;
  }

  export class Editor extends EventEmitter {
    public container: HTMLElement;
    public renderer: VirtualRenderer;
    public id: string;
    public commands: CommandManager;
    public keyBinding: KeyBinding;

    public constructor(renderer: VirtualRenderer,
                       session: EditSession,
                       options?: Partial<IEditorOptions>);

    public on(name: 'blur', callback: (e: Event) => void): void;
    public on(name: 'change', callback: (delta: Delta) => void): void;
    public on(name: 'changeSelectionStyle',
              callback: (obj: { data: string }) => void): void;
    public on(name: 'changeSession',
              callback: (obj: { session: EditSession, oldSession: EditSession }) => void): void;
    public on(name: 'copy', callback: (obj: { text: string }) => void): void;
    public on(name: 'focus', callback: (e: Event) => void): void;
    public on(name: 'paste', callback: (obj: { text: string }) => void): void;

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
    public unsetStyle(style: string): void;
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
    public moveText(range: Range, toPosition: Point, copy?: boolean): Range;
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
    public getCursorPosition(): Point;
    public getCursorPositionScreen(): Point;
    public getSelectionRange(): Range;
    public selectAll(): void;
    public clearSelection(): void;
    public moveCursorTo(row: number, column: number): void;
    public moveCursorToPosition(pos: Point): void;
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
