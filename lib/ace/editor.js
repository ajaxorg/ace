/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

require("./lib/fixoldbrowsers");

var oop = require("./lib/oop");
var lang = require("./lib/lang");
var useragent = require("./lib/useragent");
var TextInput = require("./keyboard/textinput").TextInput;
var MouseHandler = require("./mouse/mouse_handler").MouseHandler;
var FoldHandler = require("./mouse/fold_handler").FoldHandler;
var KeyBinding = require("./keyboard/keybinding").KeyBinding;
var EditSession = require("./edit_session").EditSession;
var Search = require("./search").Search;
var Range = require("./range").Range;
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var CommandManager = require("./commands/command_manager").CommandManager;
var defaultCommands = require("./commands/default_commands").commands;

/**
 * class Editor
 *
 * The main entry point into the Ace functionality. The `Editor` manages the `EditSession` (which manages `Document`s), as well as the `VirtualRenderer`, which draws everything to the screen. Event sessions dealing with the mouse and keyboard are bubbled up from `Document` to the `Editor`, which decides what to do with them.
 *
 **/

/**
 * new Editor(renderer, session)
 * - renderer (VirtualRenderer): Associated `VirtualRenderer` that draws everything
 * - session (EditSession): The `EditSession` to refer to
 *
 * Creates a new `Editor` object.
 *
 **/
var Editor = function(renderer, session) {
    var container = renderer.getContainerElement();
    this.container = container;
    this.renderer = renderer;

    this.commands = new CommandManager(useragent.isMac ? "mac" : "win", defaultCommands);
    this.textInput  = new TextInput(renderer.getTextAreaContainer(), this);
    this.renderer.textarea = this.textInput.getElement();
    this.keyBinding = new KeyBinding(this);

    // TODO detect touch event support
    this.$mouseHandler = new MouseHandler(this);
    new FoldHandler(this);

    this.$blockScrolling = 0;
    this.$search = new Search().set({
        wrap: true
    });

    this.setSession(session || new EditSession(""));
};

(function(){

    oop.implement(this, EventEmitter);

    /**
     * Editor.setKeyboardHandler(keyboardHandler) 
     * 
     * Sets a new keyboard handler.
     **/
    this.setKeyboardHandler = function(keyboardHandler) {
        this.keyBinding.setKeyboardHandler(keyboardHandler);
    };

    /** related to: KeyBinding
     * Editor.getKeyboardHandler() -> String
     * 
     * Returns the keyboard handler.
     **/
    this.getKeyboardHandler = function() {
        return this.keyBinding.getKeyboardHandler();
    };

    /**
     * Editor.setSession(session) 
     * - session (EditSession): The new session to use
     *
     * Sets a new editsession to use. This method also emits the `'changeSession'` event.
     **/
    /**
     * Editor@changeSession(e) 
     * - e (Object): An object with two properties, `oldSession` and `session`, that represent the old and new [[EditSession]]s.
     *
     * Emitted whenever the [[EditSession]] changes.
     **/
    this.setSession = function(session) {
        if (this.session == session)
            return;

        if (this.session) {
            var oldSession = this.session;
            this.session.removeEventListener("change", this.$onDocumentChange);
            this.session.removeEventListener("changeMode", this.$onChangeMode);
            this.session.removeEventListener("tokenizerUpdate", this.$onTokenizerUpdate);
            this.session.removeEventListener("changeTabSize", this.$onChangeTabSize);
            this.session.removeEventListener("changeWrapLimit", this.$onChangeWrapLimit);
            this.session.removeEventListener("changeWrapMode", this.$onChangeWrapMode);
            this.session.removeEventListener("onChangeFold", this.$onChangeFold);
            this.session.removeEventListener("changeFrontMarker", this.$onChangeFrontMarker);
            this.session.removeEventListener("changeBackMarker", this.$onChangeBackMarker);
            this.session.removeEventListener("changeBreakpoint", this.$onChangeBreakpoint);
            this.session.removeEventListener("changeAnnotation", this.$onChangeAnnotation);
            this.session.removeEventListener("changeOverwrite", this.$onCursorChange);
            this.session.removeEventListener("changeScrollTop", this.$onScrollTopChange);
            this.session.removeEventListener("changeLeftTop", this.$onScrollLeftChange);

            var selection = this.session.getSelection();
            selection.removeEventListener("changeCursor", this.$onCursorChange);
            selection.removeEventListener("changeSelection", this.$onSelectionChange);
        }

        this.session = session;

        this.$onDocumentChange = this.onDocumentChange.bind(this);
        session.addEventListener("change", this.$onDocumentChange);
        this.renderer.setSession(session);

        this.$onChangeMode = this.onChangeMode.bind(this);
        session.addEventListener("changeMode", this.$onChangeMode);

        this.$onTokenizerUpdate = this.onTokenizerUpdate.bind(this);
        session.addEventListener("tokenizerUpdate", this.$onTokenizerUpdate);

        this.$onChangeTabSize = this.renderer.onChangeTabSize.bind(this.renderer);
        session.addEventListener("changeTabSize", this.$onChangeTabSize);

        this.$onChangeWrapLimit = this.onChangeWrapLimit.bind(this);
        session.addEventListener("changeWrapLimit", this.$onChangeWrapLimit);

        this.$onChangeWrapMode = this.onChangeWrapMode.bind(this);
        session.addEventListener("changeWrapMode", this.$onChangeWrapMode);

        this.$onChangeFold = this.onChangeFold.bind(this);
        session.addEventListener("changeFold", this.$onChangeFold);

        this.$onChangeFrontMarker = this.onChangeFrontMarker.bind(this);
        this.session.addEventListener("changeFrontMarker", this.$onChangeFrontMarker);

        this.$onChangeBackMarker = this.onChangeBackMarker.bind(this);
        this.session.addEventListener("changeBackMarker", this.$onChangeBackMarker);

        this.$onChangeBreakpoint = this.onChangeBreakpoint.bind(this);
        this.session.addEventListener("changeBreakpoint", this.$onChangeBreakpoint);

        this.$onChangeAnnotation = this.onChangeAnnotation.bind(this);
        this.session.addEventListener("changeAnnotation", this.$onChangeAnnotation);

        this.$onCursorChange = this.onCursorChange.bind(this);
        this.session.addEventListener("changeOverwrite", this.$onCursorChange);

        this.$onScrollTopChange = this.onScrollTopChange.bind(this);
        this.session.addEventListener("changeScrollTop", this.$onScrollTopChange);

        this.$onScrollLeftChange = this.onScrollLeftChange.bind(this);
        this.session.addEventListener("changeScrollLeft", this.$onScrollLeftChange);

        this.selection = session.getSelection();
        this.selection.addEventListener("changeCursor", this.$onCursorChange);

        this.$onSelectionChange = this.onSelectionChange.bind(this);
        this.selection.addEventListener("changeSelection", this.$onSelectionChange);

        this.onChangeMode();

        this.$blockScrolling += 1;
        this.onCursorChange();
        this.$blockScrolling -= 1;

        this.onScrollTopChange();
        this.onScrollLeftChange();
        this.onSelectionChange();
        this.onChangeFrontMarker();
        this.onChangeBackMarker();
        this.onChangeBreakpoint();
        this.onChangeAnnotation();
        this.session.getUseWrapMode() && this.renderer.adjustWrapLimit();
        this.renderer.updateFull();

        this._emit("changeSession", {
            session: session,
            oldSession: oldSession
        });
    };

    /**
     * Editor.getSession() -> EditSession
     * 
     * Returns the current session being used.
     **/
    this.getSession = function() {
        return this.session;
    };

    /** related to: Document.setValue
     * Editor.setValue(val [,cursorPos]) -> String
     * - val (String): The new value to set for the document
     * - cursorPos (Number): Where to set the new value. `undefined` or 0 is selectAll, -1 is at the document start, and 1 is at the end
     *
     * Sets the current document to `val`.
     **/
    this.setValue = function(val, cursorPos) {
        this.session.doc.setValue(val);

        if (!cursorPos)
            this.selectAll();
        else if (cursorPos == 1)
            this.navigateFileEnd();
        else if (cursorPos == -1)
            this.navigateFileStart();

        return val;
    };

    /** related to: EditSession.getValue
     * Editor.getValue() -> String
     *
     * Returns the current session's content.
     **/
    this.getValue = function() {
        return this.session.getValue();
    };

    /**
     * Editor.getSelection() -> String
     * 
     * Returns the currently highlighted selection.
     **/
    this.getSelection = function() {
        return this.selection;
    };

    /** related to: VirtualRenderer.onResize
     * Editor.resize(force) 
     * - force (Boolean): If `true`, recomputes the size, even if the height and width haven't changed
     *
     * {:VirtualRenderer.onResize}
     **/
    this.resize = function(force) {
        this.renderer.onResize(force);
    };

    /**
     * Editor.setTheme(theme) 
     * - theme (String): The path to a theme
     *
     * {:VirtualRenderer.setTheme}
     **/
    this.setTheme = function(theme) {
        this.renderer.setTheme(theme);
    };

    /** related to: VirtualRenderer.getTheme
     * Editor.getTheme() -> String
     * 
     * {:VirtualRenderer.getTheme}
     **/
    this.getTheme = function() {
        return this.renderer.getTheme();
    };

    /** related to: VirtualRenderer.setStyle
     * Editor.setStyle(style) 
     * - style (String): A class name
     *
     * {:VirtualRenderer.setStyle}
     **/
    this.setStyle = function(style) {
        this.renderer.setStyle(style);
    };

    /** related to: VirtualRenderer.unsetStyle
     * Editor.unsetStyle(style) 
     * 
     * {:VirtualRenderer.unsetStyle}
     **/
    this.unsetStyle = function(style) {
        this.renderer.unsetStyle(style);
    };

    /**
     * Editor.setFontSize(size) 
     * - size (Number): A font size 
     * 
     * Set a new font size (in pixels) for the editor text.
     **/
    this.setFontSize = function(size) {
        this.container.style.fontSize = size;
        this.renderer.updateFontSize();
    };

    /** internal, hide
     * Editor.$highlightBrackets() 
     *  
     **/
    this.$highlightBrackets = function() {
        if (this.session.$bracketHighlight) {
            this.session.removeMarker(this.session.$bracketHighlight);
            this.session.$bracketHighlight = null;
        }

        if (this.$highlightPending) {
            return;
        }

        // perform highlight async to not block the browser during navigation
        var self = this;
        this.$highlightPending = true;
        setTimeout(function() {
            self.$highlightPending = false;

            var pos = self.session.findMatchingBracket(self.getCursorPosition());
            if (pos) {
                var range = new Range(pos.row, pos.column, pos.row, pos.column+1);
                self.session.$bracketHighlight = self.session.addMarker(range, "ace_bracket", "text");
            }
        }, 50);
    };

    /**
     * Editor.focus() 
     * 
     * Brings the current `textInput` into focus.
     **/
    this.focus = function() {
        // Safari needs the timeout
        // iOS and Firefox need it called immediately
        // to be on the save side we do both
        var _self = this;
        setTimeout(function() {
            _self.textInput.focus();
        });
        this.textInput.focus();
    };

    /**
     * Editor.isFocused() -> Boolean
     * 
     * Returns true if the current `textInput` is in focus.
     **/
    this.isFocused = function() {
        return this.textInput.isFocused();
    };

    /**
     * Editor.blur() 
     * 
     * Blurs the current `textInput`.
     **/
    this.blur = function() {
        this.textInput.blur();
    };

    /**
     * Editor@focus()
     * 
     * Emitted once the editor comes into focus.
     **/
    this.onFocus = function() {
        if (this.$isFocused)
            return;
        this.$isFocused = true;
        this.renderer.showCursor();
        this.renderer.visualizeFocus();
        this._emit("focus");
    };

    /**
     * Editor@blur()
     * 
     * Emitted once the editor has been blurred.
     **/
    this.onBlur = function() {
        if (!this.$isFocused)
            return;
        this.$isFocused = false;
        this.renderer.hideCursor();
        this.renderer.visualizeBlur();
        this._emit("blur");
    };

    this.$cursorChange = function() {
        this.renderer.updateCursor();
    };

    /**
     * Editor@change(e) 
     * - e (Object): Contains a single property, `data`, which has the delta of changes
     *
     * Emitted whenever the document is changed. 
     * 
     **/
    this.onDocumentChange = function(e) {
        var delta = e.data;
        var range = delta.range;
        var lastRow;

        if (range.start.row == range.end.row && delta.action != "insertLines" && delta.action != "removeLines")
            lastRow = range.end.row;
        else
            lastRow = Infinity;
        this.renderer.updateLines(range.start.row, lastRow);

        this._emit("change", e);

        // update cursor because tab characters can influence the cursor position
        this.$cursorChange();
    };

    this.onTokenizerUpdate = function(e) {
        var rows = e.data;
        this.renderer.updateLines(rows.first, rows.last);
    };


    this.onScrollTopChange = function() {
        this.renderer.scrollToY(this.session.getScrollTop());
    };
    
    this.onScrollLeftChange = function() {
        this.renderer.scrollToX(this.session.getScrollLeft());
    };

    /**
     * Editor@changeSelection() 
     *
     * Emitted when the selection changes.
     * 
     **/
    this.onCursorChange = function() {
        this.$cursorChange();

        if (!this.$blockScrolling) {
            this.renderer.scrollCursorIntoView();
        }

        this.$highlightBrackets();
        this.$updateHighlightActiveLine();
        this._emit("changeSelection");
    };

    /** internal, hide
     * Editor.$updateHighlightActiveLine()
     * 
     * 
     **/
    this.$updateHighlightActiveLine = function() {
        var session = this.getSession();

        var highlight;
        if (this.$highlightActiveLine) {
            if ((this.$selectionStyle != "line" || !this.selection.isMultiLine()))
                highlight = this.getCursorPosition();
        }

        if (session.$highlightLineMarker && !highlight) {
            session.removeMarker(session.$highlightLineMarker.id);
            session.$highlightLineMarker = null;
        } else if (!session.$highlightLineMarker && highlight) {
            session.$highlightLineMarker = session.highlightLines(highlight.row, highlight.row, "ace_active-line");
        } else if (highlight) {
            session.$highlightLineMarker.start.row = highlight.row;
            session.$highlightLineMarker.end.row = highlight.row;
            session._emit("changeBackMarker");
        }
    };

    this.onSelectionChange = function(e) {
        var session = this.session;

        if (session.$selectionMarker) {
            session.removeMarker(session.$selectionMarker);
        }
        session.$selectionMarker = null;

        if (!this.selection.isEmpty()) {
            var range = this.selection.getRange();
            var style = this.getSelectionStyle();
            session.$selectionMarker = session.addMarker(range, "ace_selection", style);
        } else {
            this.$updateHighlightActiveLine();
        }

        var re = this.$highlightSelectedWord && this.$getSelectionHighLightRegexp()
        this.session.highlight(re);
        
        this._emit("changeSelection");
    };

    this.$getSelectionHighLightRegexp = function() {
        var session = this.session;

        var selection = this.getSelectionRange();
        if (selection.isEmpty() || selection.isMultiLine())
            return;

        var startOuter = selection.start.column - 1;
        var endOuter = selection.end.column + 1;
        var line = session.getLine(selection.start.row);
        var lineCols = line.length;
        var needle = line.substring(Math.max(startOuter, 0),
                                    Math.min(endOuter, lineCols));

        // Make sure the outer characters are not part of the word.
        if ((startOuter >= 0 && /^[\w\d]/.test(needle)) ||
            (endOuter <= lineCols && /[\w\d]$/.test(needle)))
            return;

        needle = line.substring(selection.start.column, selection.end.column);
        if (!/^[\w\d]+$/.test(needle))
            return;

        var re = this.$search.$assembleRegExp({
            wholeWord: true,
            caseSensitive: true,
            needle: needle
        });

        return re;
    };


    this.onChangeFrontMarker = function() {
        this.renderer.updateFrontMarkers();
    };

    this.onChangeBackMarker = function() {
        this.renderer.updateBackMarkers();
    };


    this.onChangeBreakpoint = function() {
        this.renderer.updateBreakpoints();
    };

    this.onChangeAnnotation = function() {
        this.renderer.setAnnotations(this.session.getAnnotations());
    };


    this.onChangeMode = function() {
        this.renderer.updateText();
    };


    this.onChangeWrapLimit = function() {
        this.renderer.updateFull();
    };

    this.onChangeWrapMode = function() {
        this.renderer.onResize(true);
    };


    this.onChangeFold = function() {
        // Update the active line marker as due to folding changes the current
        // line range on the screen might have changed.
        this.$updateHighlightActiveLine();
        // TODO: This might be too much updating. Okay for now.
        this.renderer.updateFull();
    };

    /**
     * Editor.getCopyText() -> String
     * 
     * Returns the string of text currently highlighted.
     **/
    /**
     * Editor@copy(text)
     * - text (String): The copied text
     *
     * Emitted when text is copied.
     **/
    this.getCopyText = function() {
        var text = "";
        if (!this.selection.isEmpty())
            text = this.session.getTextRange(this.getSelectionRange());

        this._emit("copy", text);
        return text;
    };

    /**
     * Editor.onCopy() 
     * 
     * Called whenever a text "copy" happens.
     **/
    this.onCopy = function() {
        this.commands.exec("copy", this);
    };

    /**
     * Editor.onCut() 
     * 
     * called whenever a text "cut" happens.
     **/
    this.onCut = function() {
        this.commands.exec("cut", this);
    };

    /**
     * Editor.onPaste(text) 
     * - text (String): The pasted text
     *
     * Called whenever a text "paste" happens.
     **/
    /**
     * Editor@paste(text)
     * - text (String): The pasted text
     *
     * Emitted when text is pasted.
     **/
    this.onPaste = function(text) {
        // todo this should change when paste becomes a command
        if (this.$readOnly) 
            return;
        this._emit("paste", text);
        this.insert(text);
    };


    this.execCommand = function(command, args) {
        this.commands.exec(command, this, args);
    };

    /**
     * Editor.insert(text) 
     * - text (String): The new text to add
     * 
     * Inserts `text` into wherever the cursor is pointing.
     **/
    this.insert = function(text) {
        var session = this.session;
        var mode = session.getMode();
        var cursor = this.getCursorPosition();

        if (this.getBehavioursEnabled()) {
            // Get a transform if the current mode wants one.
            var transform = mode.transformAction(session.getState(cursor.row), 'insertion', this, session, text);
            if (transform)
                text = transform.text;
        }

        text = text.replace("\t", this.session.getTabString());

        // remove selected text
        if (!this.selection.isEmpty()) {
            cursor = this.session.remove(this.getSelectionRange());
            this.clearSelection();
        }
        else if (this.session.getOverwrite()) {
            var range = new Range.fromPoints(cursor, cursor);
            range.end.column += text.length;
            this.session.remove(range);
        }

        this.clearSelection();

        var start = cursor.column;
        var lineState = session.getState(cursor.row);
        var line = session.getLine(cursor.row);
        var shouldOutdent = mode.checkOutdent(lineState, line, text);
        var end = session.insert(cursor, text);

        if (transform && transform.selection) {
            if (transform.selection.length == 2) { // Transform relative to the current column
                this.selection.setSelectionRange(
                    new Range(cursor.row, start + transform.selection[0],
                              cursor.row, start + transform.selection[1]));
            } else { // Transform relative to the current row.
                this.selection.setSelectionRange(
                    new Range(cursor.row + transform.selection[0],
                              transform.selection[1],
                              cursor.row + transform.selection[2],
                              transform.selection[3]));
            }
        }

        // TODO disabled multiline auto indent
        // possibly doing the indent before inserting the text
        // if (cursor.row !== end.row) {
        if (session.getDocument().isNewLine(text)) {
            var lineIndent = mode.getNextLineIndent(lineState, line.slice(0, cursor.column), session.getTabString());

            this.moveCursorTo(cursor.row+1, 0);

            var size = session.getTabSize();
            var minIndent = Number.MAX_VALUE;

            for (var row = cursor.row + 1; row <= end.row; ++row) {
                var indent = 0;

                line = session.getLine(row);
                for (var i = 0; i < line.length; ++i)
                    if (line.charAt(i) == '\t')
                        indent += size;
                    else if (line.charAt(i) == ' ')
                        indent += 1;
                    else
                        break;
                if (/[^\s]/.test(line))
                    minIndent = Math.min(indent, minIndent);
            }

            for (var row = cursor.row + 1; row <= end.row; ++row) {
                var outdent = minIndent;

                line = session.getLine(row);
                for (var i = 0; i < line.length && outdent > 0; ++i)
                    if (line.charAt(i) == '\t')
                        outdent -= size;
                    else if (line.charAt(i) == ' ')
                        outdent -= 1;
                session.remove(new Range(row, 0, row, i));
            }
            session.indentRows(cursor.row + 1, end.row, lineIndent);
        }
        if (shouldOutdent)
            mode.autoOutdent(lineState, session, cursor.row);
    };

    this.onTextInput = function(text) {
        this.keyBinding.onTextInput(text);
    };

    this.onCommandKey = function(e, hashId, keyCode) {
        this.keyBinding.onCommandKey(e, hashId, keyCode);
    };

    /** related to: EditSession.setOverwrite
     * Editor.setOverwrite(overwrite) 
     * - overwrite (Boolean): Defines wheter or not to set overwrites
     * 
     * Pass in `true` to enable overwrites in your session, or `false` to disable. If overwrites is enabled, any text you enter will type over any text after it. If the value of `overwrite` changes, this function also emites the `changeOverwrite` event.
     *
     **/
    this.setOverwrite = function(overwrite) {
        this.session.setOverwrite(overwrite);
    };

    /** related to: EditSession.getOverwrite
     * Editor.getOverwrite() -> Boolean
     * 
     * Returns `true` if overwrites are enabled; `false` otherwise.
     **/
    this.getOverwrite = function() {
        return this.session.getOverwrite();
    };

    /** related to: EditSession.toggleOverwrite
     * Editor.toggleOverwrite() 
     * 
     * Sets the value of overwrite to the opposite of whatever it currently is.
     **/
    this.toggleOverwrite = function() {
        this.session.toggleOverwrite();
    };

    /**
     * Editor.setScrollSpeed(speed) 
     * - speed (Number): A value indicating the new speed
     * 
     * Sets how fast the mouse scrolling should do.
     *
     **/
    this.setScrollSpeed = function(speed) {
        this.$mouseHandler.setScrollSpeed(speed);
    };

    /**
     * Editor.getScrollSpeed() -> Number
     * 
     * Returns the value indicating how fast the mouse scroll speed is.
     **/
    this.getScrollSpeed = function() {
        return this.$mouseHandler.getScrollSpeed();
    };

    /**
     * Editor.setDragDelay(dragDelay) 
     * - dragDelay (Number): A value indicating the new delay
     * 
     * Sets the delay (in milliseconds) of the mouse drag.
     *
     **/
    this.setDragDelay = function(dragDelay) {
        this.$mouseHandler.setDragDelay(dragDelay);
    };

    /**
     * Editor.getDragDelay() -> Number
     * 
     * Returns the current mouse drag delay.
     **/
    this.getDragDelay = function() {
        return this.$mouseHandler.getDragDelay();
    };

    this.$selectionStyle = "line";
    /**
     * Editor.setSelectionStyle(style) 
     * - style (String): The new selection style
     *
     * Indicates how selections should occur. By default, selections are set to "line". This function also emits the `'changeSelectionStyle'` event.
     * 
     **/
    /**
     * Editor@changeSelectionStyle(data) 
     * - data (Object): Contains one property, `data`, which indicates the new selection style
     *
     * Emitted when the selection style changes, via [[Editor.setSelectionStyle]].
     * 
     **/
    this.setSelectionStyle = function(style) {
        if (this.$selectionStyle == style) return;

        this.$selectionStyle = style;
        this.onSelectionChange();
        this._emit("changeSelectionStyle", {data: style});
    };

    /**
     * Editor.getSelectionStyle() -> String
     * 
     * Returns the current selection style.
     **/
    this.getSelectionStyle = function() {
        return this.$selectionStyle;
    };

    this.$highlightActiveLine = true;

    /**
     * Editor.setHighlightActiveLine(shouldHighlight) 
     * - shouldHighlight (Boolean): Set to `true` to highlight the current line
     *
     * Determines whether or not the current line should be highlighted.
     *
     **/
    this.setHighlightActiveLine = function(shouldHighlight) {
        if (this.$highlightActiveLine == shouldHighlight)
            return;

        this.$highlightActiveLine = shouldHighlight;
        this.$updateHighlightActiveLine();
    };

    /**
     * Editor.getHighlightActiveLine() -> Boolean
     * 
     * Returns `true` if current lines are always highlighted.
     **/
    this.getHighlightActiveLine = function() {
        return this.$highlightActiveLine;
    };

    this.$highlightGutterLine = true;
    this.setHighlightGutterLine = function(shouldHighlight) {
        if (this.$highlightGutterLine == shouldHighlight)
            return;

        this.renderer.setHighlightGutterLine(shouldHighlight);
        this.$highlightGutterLine = shouldHighlight;
    };

    this.getHighlightGutterLine = function() {
        return this.$highlightGutterLine;
    };

    this.$highlightSelectedWord = true;
    /**
     * Editor.setHighlightSelectedWord(shouldHighlight)
     * - shouldHighlight (Boolean): Set to `true` to highlight the currently selected word
     *
     * Determines if the currently selected word should be highlighted.
     **/
    this.setHighlightSelectedWord = function(shouldHighlight) {
        if (this.$highlightSelectedWord == shouldHighlight)
            return;

        this.$highlightSelectedWord = shouldHighlight;
        this.$onSelectionChange();
    };

    /**
     * Editor.getHighlightSelectedWord() -> Boolean
     *
     * Returns `true` if currently highlighted words are to be highlighted.
     **/
    this.getHighlightSelectedWord = function() {
        return this.$highlightSelectedWord;
    };

    this.setAnimatedScroll = function(shouldAnimate){
        this.renderer.setAnimatedScroll(shouldAnimate);
    };

    this.getAnimatedScroll = function(){
        return this.renderer.getAnimatedScroll();
    };

    /**
     * Editor.setShowInvisibles(showInvisibles) 
     * - showInvisibles (Boolean): Specifies whether or not to show invisible characters
     * 
     * If `showInvisibiles` is set to `true`, invisible characters&mdash;like spaces or new lines&mdash;are show in the editor.
     **/
    this.setShowInvisibles = function(showInvisibles) {
        this.renderer.setShowInvisibles(showInvisibles);
    };

    /**
     * Editor.getShowInvisibles() -> Boolean
     * 
     * Returns `true` if invisible characters are being shown.
     **/
    this.getShowInvisibles = function() {
        return this.renderer.getShowInvisibles();
    };

    this.setDisplayIndentGuides = function(display) {
        this.renderer.setDisplayIndentGuides(display);
    };

    this.getDisplayIndentGuides = function() {
        return this.renderer.getDisplayIndentGuides();
    };

    /**
     * Editor.setShowPrintMargin(showPrintMargin) 
     * - showPrintMargin (Boolean): Specifies whether or not to show the print margin
     * 
     * If `showPrintMargin` is set to `true`, the print margin is shown in the editor.
     **/
    this.setShowPrintMargin = function(showPrintMargin) {
        this.renderer.setShowPrintMargin(showPrintMargin);
    };

    /**
     * Editor.getShowPrintMargin() -> Boolean
     * 
     * Returns `true` if the print margin is being shown.
     **/
    this.getShowPrintMargin = function() {
        return this.renderer.getShowPrintMargin();
    };

    /**
     * Editor.setPrintMarginColumn(showPrintMargin) 
     * - showPrintMargin (Number): Specifies the new print margin
     *
     * Sets the column defining where the print margin should be.
     * 
     **/
    this.setPrintMarginColumn = function(showPrintMargin) {
        this.renderer.setPrintMarginColumn(showPrintMargin);
    };

    /**
     * Editor.getPrintMarginColumn() -> Number
     * 
     * Returns the column number of where the print margin is.
     **/
    this.getPrintMarginColumn = function() {
        return this.renderer.getPrintMarginColumn();
    };

    this.$readOnly = false;
    /**
     * Editor.setReadOnly(readOnly) 
     * - readOnly (Boolean): Specifies whether the editor can be modified or not
     * 
     * If `readOnly` is true, then the editor is set to read-only mode, and none of the content can change.
     **/
    this.setReadOnly = function(readOnly) {
        this.$readOnly = readOnly;
    };

    /**
     * Editor.getReadOnly() -> Boolean
     * 
     * Returns `true` if the editor is set to read-only mode.
     **/
    this.getReadOnly = function() {
        return this.$readOnly;
    };

    this.$modeBehaviours = true;

    /**
     * Editor.setBehavioursEnabled(enabled) 
     * - enabled (Boolean): Enables or disables behaviors
     * 
     * Specifies whether to use behaviors or not.
     * See [[Editor.setWrapBehavioursEnabled]].
     * ["Behaviors" in this case is the auto-pairing of special characters, like quotation marks, parenthesis, or brackets.]{: #BehaviorsDef}
     **/
    this.setBehavioursEnabled = function (enabled) {
        this.$modeBehaviours = enabled;
    };

    /**
     * Editor.getBehavioursEnabled() -> Boolean
     * 
     * Returns `true` if the behaviors are currently enabled. {:BehaviorsDef}
     **/
    this.getBehavioursEnabled = function () {
        return this.$modeBehaviours;
    };

    this.$modeWrapBehaviours = true;

    /**
     * Editor.setWrapBehavioursEnabled(enabled) 
     * - enabled (Boolean): Enables or disables wrapping behaviors
     * 
     * Specifies whether to use wrapping behaviors or not, i.e. automatically wrapping the selection with characters such as brackets
     * when such a character is typed in.
     **/
    this.setWrapBehavioursEnabled = function (enabled) {
        this.$modeWrapBehaviours = enabled;
    };

    /**
     * Editor.getWrapBehavioursEnabled() -> Boolean
     * 
     * Returns `true` if the wrapping behaviors are currently enabled.
     **/
    this.getWrapBehavioursEnabled = function () {
        return this.$modeWrapBehaviours;
    };

    /**
     * Editor.setShowFoldWidgets(show) 
     * - show (Boolean): Specifies whether the fold widgets are shown
     * 
     * Indicates whether the fold widgets are shown or not.
     **/
    this.setShowFoldWidgets = function(show) {
        var gutter = this.renderer.$gutterLayer;
        if (gutter.getShowFoldWidgets() == show)
            return;

        this.renderer.$gutterLayer.setShowFoldWidgets(show);
        this.$showFoldWidgets = show;
        this.renderer.updateFull();
    };

    /**
     * Editor.getShowFoldWidgets() -> Boolean
     * 
     * Returns `true` if the fold widgets are shown.
     **/
    this.getShowFoldWidgets = function() {
        return this.renderer.$gutterLayer.getShowFoldWidgets();
    };

    this.setFadeFoldWidgets = function(show) {
        this.renderer.setFadeFoldWidgets(show);
    };

    this.getFadeFoldWidgets = function() {
        return this.renderer.getFadeFoldWidgets();
    };

    /**
     * Editor.remove(dir) 
     * - dir (String): The direction of the deletion to occur, either "left" or "right"
     * 
     * Removes words of text from the editor. A "word" is defined as a string of characters bookended by whitespace.
     *
     **/
    this.remove = function(dir) {
        if (this.selection.isEmpty()){
            if (dir == "left")
                this.selection.selectLeft();
            else
                this.selection.selectRight();
        }

        var range = this.getSelectionRange();
        if (this.getBehavioursEnabled()) {
            var session = this.session;
            var state = session.getState(range.start.row);
            var new_range = session.getMode().transformAction(state, 'deletion', this, session, range);
            if (new_range)
                range = new_range;
        }

        this.session.remove(range);
        this.clearSelection();
    };

    /**
     * Editor.removeWordRight() 
     * 
     * Removes the word directly to the right of the current selection.
     **/
    this.removeWordRight = function() {
        if (this.selection.isEmpty())
            this.selection.selectWordRight();

        this.session.remove(this.getSelectionRange());
        this.clearSelection();
    };

    /**
     * Editor.removeWordLeft() 
     * 
     * Removes the word directly to the left of the current selection.
     **/
    this.removeWordLeft = function() {
        if (this.selection.isEmpty())
            this.selection.selectWordLeft();

        this.session.remove(this.getSelectionRange());
        this.clearSelection();
    };

    /**
     * Editor.removeToLineStart() 
     * 
     * Removes all the words to the left of the current selection, until the start of the line.
     **/
    this.removeToLineStart = function() {
        if (this.selection.isEmpty())
            this.selection.selectLineStart();

        this.session.remove(this.getSelectionRange());
        this.clearSelection();
    };

    /**
     * Editor.removeToLineEnd() 
     * 
     * Removes all the words to the right of the current selection, until the end of the line.
     **/
    this.removeToLineEnd = function() {
        if (this.selection.isEmpty())
            this.selection.selectLineEnd();

        var range = this.getSelectionRange();
        if (range.start.column == range.end.column && range.start.row == range.end.row) {
            range.end.column = 0;
            range.end.row++;
        }

        this.session.remove(range);
        this.clearSelection();
    };

    /**
     * Editor.splitLine() 
     * 
     * Splits the line at the current selection (by inserting an `'\n'`).
     **/
    this.splitLine = function() {
        if (!this.selection.isEmpty()) {
            this.session.remove(this.getSelectionRange());
            this.clearSelection();
        }

        var cursor = this.getCursorPosition();
        this.insert("\n");
        this.moveCursorToPosition(cursor);
    };

    /**
     * Editor.transposeLetters() 
     * 
     * Transposes current line.
     **/
    this.transposeLetters = function() {
        if (!this.selection.isEmpty()) {
            return;
        }

        var cursor = this.getCursorPosition();
        var column = cursor.column;
        if (column === 0)
            return;

        var line = this.session.getLine(cursor.row);
        var swap, range;
        if (column < line.length) {
            swap = line.charAt(column) + line.charAt(column-1);
            range = new Range(cursor.row, column-1, cursor.row, column+1);
        }
        else {
            swap = line.charAt(column-1) + line.charAt(column-2);
            range = new Range(cursor.row, column-2, cursor.row, column);
        }
        this.session.replace(range, swap);
    };

    /**
     * Editor.toLowerCase() 
     * 
     * Converts the current selection entirely into lowercase.
     **/
    this.toLowerCase = function() {
        var originalRange = this.getSelectionRange();
        if (this.selection.isEmpty()) {
            this.selection.selectWord();
        }

        var range = this.getSelectionRange();
        var text = this.session.getTextRange(range);
        this.session.replace(range, text.toLowerCase());
        this.selection.setSelectionRange(originalRange);
    };

    /**
     * Editor.toUpperCase() 
     * 
     * Converts the current selection entirely into uppercase.
     **/
    this.toUpperCase = function() {
        var originalRange = this.getSelectionRange();
        if (this.selection.isEmpty()) {
            this.selection.selectWord();
        }

        var range = this.getSelectionRange();
        var text = this.session.getTextRange(range);
        this.session.replace(range, text.toUpperCase());
        this.selection.setSelectionRange(originalRange);
    };

    /** related to: EditSession.indentRows
     * Editor.indent() 
     * 
     * Indents the current line.
     **/
    this.indent = function() {
        var session = this.session;
        var range = this.getSelectionRange();

        if (range.start.row < range.end.row || range.start.column < range.end.column) {
            var rows = this.$getSelectedRows();
            session.indentRows(rows.first, rows.last, "\t");
        } else {
            var indentString;

            if (this.session.getUseSoftTabs()) {
                var size        = session.getTabSize(),
                    position    = this.getCursorPosition(),
                    column      = session.documentToScreenColumn(position.row, position.column),
                    count       = (size - column % size);

                indentString = lang.stringRepeat(" ", count);
            } else
                indentString = "\t";
            return this.insert(indentString);
        }
    };

    /** related to: EditSession.outdentRows
     * Editor.blockOutdent() 
     * 
     * Outdents the current line.
     **/
    this.blockOutdent = function() {
        var selection = this.session.getSelection();
        this.session.outdentRows(selection.getRange());
    };

    // TODO: move out of core when we have good mechanism for managing extensions
    this.sortLines = function() {
        var rows = this.$getSelectedRows();
        var session = this.session;

        var lines = [];
        for (i = rows.first; i <= rows.last; i++)
            lines.push(session.getLine(i));

        lines.sort(function(a, b) {
            if (a.toLowerCase() < b.toLowerCase()) return -1;
            if (a.toLowerCase() > b.toLowerCase()) return 1;
            return 0;
        });

        var deleteRange = new Range(0, 0, 0, 0);
        for (var i = rows.first; i <= rows.last; i++) {
            var line = session.getLine(i);
            deleteRange.start.row = i;
            deleteRange.end.row = i;
            deleteRange.end.column = line.length;
            session.replace(deleteRange, lines[i-rows.first]);
        }
    };

    /**
     * Editor.toggleCommentLines() 
     * 
     * Given the currently selected range, this function either comments all the lines, or uncomments all of them.
     **/
    this.toggleCommentLines = function() {
        var state = this.session.getState(this.getCursorPosition().row);
        var rows = this.$getSelectedRows();
        this.session.getMode().toggleCommentLines(state, this.session, rows.first, rows.last);
    };

    /**
     * Editor.getNumberAt() -> Number
     * 
     * Works like [[Editor.getTokenAt]], except it returns a number.
     **/
    this.getNumberAt = function( row, column ) {
        var _numberRx = /[\-]?[0-9]+(?:\.[0-9]+)?/g
        _numberRx.lastIndex = 0

        var s = this.session.getLine(row)
        while(_numberRx.lastIndex < column - 1 ){
            var m = _numberRx.exec(s)
            if(m.index <= column && m.index+m[0].length >= column){
                var number = {
                    value: m[0],
                    start: m.index,
                    end: m.index+m[0].length

                }
                return number
            }
        }
        return null;
    };
    /**
     * Editor.modifyNumber(amount) 
     * - amount (Number): The value to change the numeral by (can be negative to decrease value)
     *
     * If the character before the cursor is a number, this functions changes its value by `amount`.
     **/
    this.modifyNumber = function(amount) {
        var row = this.selection.getCursor().row;
        var column = this.selection.getCursor().column;

        // get the char before the cursor
        var charRange = new Range(row, column-1, row, column);

        var c = this.session.getTextRange(charRange);
        // if the char is a digit
        if (!isNaN(parseFloat(c)) && isFinite(c)) {
            // get the whole number the digit is part of
            var nr = this.getNumberAt(row, column);
            // if number found
            if (nr) {
                var fp = nr.value.indexOf(".") >= 0 ? nr.start + nr.value.indexOf(".") + 1 : nr.end;
                var decimals = nr.start + nr.value.length - fp;

                var t = parseFloat(nr.value);
                t *= Math.pow(10, decimals);
                

                if(fp !== nr.end && column < fp){
                    amount *= Math.pow(10, nr.end - column - 1);
                } else {
                    amount *= Math.pow(10, nr.end - column);
                }
                
                t += amount;
                t /= Math.pow(10, decimals);
                var nnr = t.toFixed(decimals);

                //update number
                var replaceRange = new Range(row, nr.start, row, nr.end);
                this.session.replace(replaceRange, nnr);

                //reposition the cursor
                this.moveCursorTo(row, Math.max(nr.start +1, column + nnr.length - nr.value.length));

            }
        }
    };

    /** related to: EditSession.remove
     * Editor.removeLines() 
     * 
     * Removes all the lines in the current selection
     **/
    this.removeLines = function() {
        var rows = this.$getSelectedRows();
        var range;
        if (rows.first === 0 || rows.last+1 < this.session.getLength())
            range = new Range(rows.first, 0, rows.last+1, 0);
        else
            range = new Range(
                rows.first-1, this.session.getLine(rows.first-1).length,
                rows.last, this.session.getLine(rows.last).length
            );
        this.session.remove(range);
        this.clearSelection();
    };

    this.duplicateSelection = function() {
        var sel = this.selection;
        var doc = this.session;
        var range = sel.getRange();
        if (range.isEmpty()) {
            var row = range.start.row;
            doc.duplicateLines(row, row);
        } else {
            var reverse = sel.isBackwards()
            var point = sel.isBackwards() ? range.start : range.end;
            var endPoint = doc.insert(point, doc.getTextRange(range), false);
            range.start = point;
            range.end = endPoint;
            
            sel.setSelectionRange(range, reverse)
        }
    };
    
    /** related to: EditSession.moveLinesDown
     * Editor.moveLinesDown() -> Number
     * + (Number): On success, it returns -1.
     *
     * Shifts all the selected lines down one row.
     *
     * 
     *
     **/
    this.moveLinesDown = function() {
        this.$moveLines(function(firstRow, lastRow) {
            return this.session.moveLinesDown(firstRow, lastRow);
        });
    };

    /** related to: EditSession.moveLinesUp
     * Editor.moveLinesUp() -> Number
     * + (Number): On success, it returns -1.
     *
     * Shifts all the selected lines up one row.
     *
     *
     **/
    this.moveLinesUp = function() {
        this.$moveLines(function(firstRow, lastRow) {
            return this.session.moveLinesUp(firstRow, lastRow);
        });
    };

    /** related to: EditSession.moveText
     * Editor.moveText(fromRange, toPosition) -> Range
     * - fromRange (Range): The range of text you want moved within the document
     * - toPosition (Object): The location (row and column) where you want to move the text to
     * + (Range): The new range where the text was moved to.
     *
     * Moves a range of text from the given range to the given position. `toPosition` is an object that looks like this:
     *
     *    { row: newRowLocation, column: newColumnLocation }
     * 
     *
     **/
    this.moveText = function(range, toPosition) {
        if (this.$readOnly)
            return null;

        return this.session.moveText(range, toPosition);
    };

    /** related to: EditSession.duplicateLines
     * Editor.copyLinesUp() -> Number
     * + (Number): On success, returns 0.
     *
     * Copies all the selected lines up one row.
     *
     * 
     **/
    this.copyLinesUp = function() {
        this.$moveLines(function(firstRow, lastRow) {
            this.session.duplicateLines(firstRow, lastRow);
            return 0;
        });
    };

    /** related to: EditSession.duplicateLines
     * Editor.copyLinesDown() -> Number
     * + (Number): On success, returns the number of new rows added; in other words, `lastRow - firstRow + 1`.
     *
     * Copies all the selected lines down one row.
     *
     * 
     *
     **/
    this.copyLinesDown = function() {
        this.$moveLines(function(firstRow, lastRow) {
            return this.session.duplicateLines(firstRow, lastRow);
        });
    };


    /**
     * Editor.$moveLines(mover) 
     * - mover (Function): A method to call on each selected row
     * 
     * Executes a specific function, which can be anything that manipulates selected lines, such as copying them, duplicating them, or shifting them.
     *
     **/
    this.$moveLines = function(mover) {
        var rows = this.$getSelectedRows();
        var selection = this.selection;
        if (!selection.isMultiLine()) {
            var range = selection.getRange();
            var reverse = selection.isBackwards();
        }

        var linesMoved = mover.call(this, rows.first, rows.last);

        if (range) {
            range.start.row += linesMoved;
            range.end.row += linesMoved;
            selection.setSelectionRange(range, reverse);
        }
        else {
            selection.setSelectionAnchor(rows.last+linesMoved+1, 0);
            selection.$moveSelection(function() {
                selection.moveCursorTo(rows.first+linesMoved, 0);
            });
        }
    };

    /**
     * Editor.$getSelectedRows() -> Object
     * 
     * Returns an object indicating the currently selected rows. The object looks like this:
     *
     * { first: range.start.row, last: range.end.row }
     *
     **/
    this.$getSelectedRows = function() {
        var range = this.getSelectionRange().collapseRows();

        return {
            first: range.start.row,
            last: range.end.row
        };
    };

    this.onCompositionStart = function(text) {
        this.renderer.showComposition(this.getCursorPosition());
    };

    this.onCompositionUpdate = function(text) {
        this.renderer.setCompositionText(text);
    };

    this.onCompositionEnd = function() {
        this.renderer.hideComposition();
    };

    /** related to: VirtualRenderer.getFirstVisibleRow
     * Editor.getFirstVisibleRow() -> Number
     * 
     * {:VirtualRenderer.getFirstVisibleRow}
     **/
    this.getFirstVisibleRow = function() {
        return this.renderer.getFirstVisibleRow();
    };

    /** related to: VirtualRenderer.getLastVisibleRow
     * Editor.getLastVisibleRow() -> Number
     * 
     * {:VirtualRenderer.getLastVisibleRow}
     **/
    this.getLastVisibleRow = function() {
        return this.renderer.getLastVisibleRow();
    };

    /**
     * Editor.isRowVisible(row) -> Boolean
     * - row (Number): The row to check
     * 
     * Indicates if the row is currently visible on the screen.
     **/
    this.isRowVisible = function(row) {
        return (row >= this.getFirstVisibleRow() && row <= this.getLastVisibleRow());
    };

    /**
     * Editor.isRowFullyVisible(row) -> Boolean
     * - row (Number): The row to check
     * 
     * Indicates if the entire row is currently visible on the screen.
     **/
    this.isRowFullyVisible = function(row) {
        return (row >= this.renderer.getFirstFullyVisibleRow() && row <= this.renderer.getLastFullyVisibleRow());
    };

    /**
     * Editor.$getVisibleRowCount() -> Number
     * 
     * Returns the number of currently visibile rows.
     **/
    this.$getVisibleRowCount = function() {
        return this.renderer.getScrollBottomRow() - this.renderer.getScrollTopRow() + 1;
    };

    this.$moveByPage = function(dir, select) {
        var renderer = this.renderer;
        var config = this.renderer.layerConfig;
        var rows = dir * Math.floor(config.height / config.lineHeight);

        this.$blockScrolling++;
        if (select == true) {
            this.selection.$moveSelection(function(){
                this.moveCursorBy(rows, 0);
            });
        } else if (select == false) {
            this.selection.moveCursorBy(rows, 0);
            this.selection.clearSelection();
        }
        this.$blockScrolling--;

        var scrollTop = renderer.scrollTop;

        renderer.scrollBy(0, rows * config.lineHeight);
        if (select != null)
            renderer.scrollCursorIntoView(null, 0.5);

        renderer.animateScrolling(scrollTop);
    };

    /**
     * Editor.selectPageDown() 
     * 
     * Selects the text from the current position of the document until where a "page down" finishes.
     **/
    this.selectPageDown = function() {
        this.$moveByPage(1, true);
    };

    /**
     * Editor.selectPageUp() 
     * 
     * Selects the text from the current position of the document until where a "page up" finishes.
     **/
    this.selectPageUp = function() {
        this.$moveByPage(-1, true);
    };

    /**
     * Editor.gotoPageDown() 
     * 
     * Shifts the document to wherever "page down" is, as well as moving the cursor position.
     **/
    this.gotoPageDown = function() {
       this.$moveByPage(1, false);
    };

    /**
     * Editor.gotoPageUp() 
     * 
     * Shifts the document to wherever "page up" is, as well as moving the cursor position.
     **/
    this.gotoPageUp = function() {
        this.$moveByPage(-1, false);
    };

    /**
     * Editor.scrollPageDown() 
     * 
     * Scrolls the document to wherever "page down" is, without changing the cursor position.
     **/
    this.scrollPageDown = function() {
        this.$moveByPage(1);
    };

    /**
     * Editor.scrollPageUp() 
     * 
     * Scrolls the document to wherever "page up" is, without changing the cursor position.
     **/
    this.scrollPageUp = function() {
        this.$moveByPage(-1);
    };

    /** related to: VirtualRenderer.scrollToRow
     * Editor.scrollToRow(row) 
     * - row (Number): The row to move to
     *
     * Moves the editor to the specified row.
     * 
     **/
    this.scrollToRow = function(row) {
        this.renderer.scrollToRow(row);
    };

    /** related to: VirtualRenderer.scrollToLine
     * Editor.scrollToLine(line, center, animate, callback()) 
     * - line (Number): The line to scroll to
     * - center (Boolean): If `true` 
     * - animate (Boolean): If `true` animates scrolling
     * - callback (Function): Function to be called when the animation has finished
     *
     * TODO scrolls a to line, if center == true, puts line in middle of screen or attempts to)
     **/
    this.scrollToLine = function(line, center, animate, callback) {
        this.renderer.scrollToLine(line, center, animate, callback);
    };

    /**
     * Editor.centerSelection() 
     * 
     * Attempts to center the current selection on the screen.
     **/
    this.centerSelection = function() {
        var range = this.getSelectionRange();
        var pos = {
            row: Math.floor(range.start.row + (range.end.row - range.start.row) / 2),
            column: Math.floor(range.start.column + (range.end.column - range.start.column) / 2)
        }
        this.renderer.alignCursor(pos, 0.5);
    };

    /** related to: Selection.getCursor
     * Editor.getCursorPosition() -> Object
     * + (Object): This returns an object that looks something like this:<br/>
     * ```{ row: currRow, column: currCol }```
     *
     * Gets the current position of the cursor.
     *
     *    
     *
     **/
    this.getCursorPosition = function() {
        return this.selection.getCursor();
    };

    /** related to: EditSession.documentToScreenPosition
     * Editor.getCursorPositionScreen() -> Number
     * 
     * Returns the screen position of the cursor.
     **/
    this.getCursorPositionScreen = function() {
        return this.session.documentToScreenPosition(this.getCursorPosition());
    };

    /** related to: Selection.getRange
     * Editor.getSelectionRange() -> Range
     * 
     * {:Selection.getRange}
     **/
    this.getSelectionRange = function() {
        return this.selection.getRange();
    };


    /** related to: Selection.selectAll
     * Editor.selectAll() 
     * 
     * Selects all the text in editor.
     **/
    this.selectAll = function() {
        this.$blockScrolling += 1;
        this.selection.selectAll();
        this.$blockScrolling -= 1;
    };

    /** related to: Selection.clearSelection
     * Editor.clearSelection() 
     * 
     * {:Selection.clearSelection}
     **/
    this.clearSelection = function() {
        this.selection.clearSelection();
    };

    /** related to: Selection.moveCursorTo
     * Editor.moveCursorTo(row, column) 
     * - row (Number): The new row number
     * - column (Number): The new column number
     *
     * Moves the cursor to the specified row and column. Note that this does not de-select the current selection.
     *
     **/
    this.moveCursorTo = function(row, column) {
        this.selection.moveCursorTo(row, column);
    };

    /** related to: Selection.moveCursorToPosition
     * Editor.moveCursorToPosition(pos) 
     * - pos (Object): An object with two properties, row and column
     * 
     * Moves the cursor to the position indicated by `pos.row` and `pos.column`.
     *
     **/
    this.moveCursorToPosition = function(pos) {
        this.selection.moveCursorToPosition(pos);
    };

    /** 
     * Editor.jumpToMatching() 
     * 
     * Moves the cursor's row and column to the next matching bracket.
     *
     **/
    this.jumpToMatching = function(select) {
        var cursor = this.getCursorPosition();

        var range = this.session.getBracketRange(cursor);
        if (!range) {
            range = this.find({
                needle: /[{}()\[\]]/g,
                preventScroll:true,
                start: {row: cursor.row, column: cursor.column - 1}
            });
            if (!range)
                return;
            var pos = range.start;
            if (pos.row == cursor.row && Math.abs(pos.column - cursor.column) < 2)
                range = this.session.getBracketRange(pos);
        }
        
        pos = range && range.cursor || pos;
        if (pos) {
            if (select) {
                if (range && range.isEqual(this.getSelectionRange()))
                    this.clearSelection();
                else
                    this.selection.selectTo(pos.row, pos.column);
            } else {
                this.clearSelection();
                this.moveCursorTo(pos.row, pos.column);
            }
        }
    };

    /**
     * Editor.gotoLine(lineNumber, column, animate) 
     * - lineNumber (Number): The line number to go to
     * - column (Number): A column number to go to
     * - animate (Boolean): If `true` animates scolling
     *
     * Moves the cursor to the specified line number, and also into the indiciated column.
     * 
     **/
    this.gotoLine = function(lineNumber, column, animate) {
        this.selection.clearSelection();
        this.session.unfold({row: lineNumber - 1, column: column || 0});

        this.$blockScrolling += 1;
        this.moveCursorTo(lineNumber - 1, column || 0);
        this.$blockScrolling -= 1;

        if (!this.isRowFullyVisible(lineNumber - 1))
            this.scrollToLine(lineNumber - 1, true, animate);
    };

    /** related to: Editor.moveCursorTo
     * Editor.navigateTo(row, column) 
     * - row (Number): The new row number
     * - column (Number): The new column number
     *
     * Moves the cursor to the specified row and column. Note that this does de-select the current selection.
     *
     **/
    this.navigateTo = function(row, column) {
        this.clearSelection();
        this.moveCursorTo(row, column);
    };

    /**
     * Editor.navigateUp(times) 
     * - times (Number): The number of times to change navigation
     * 
     * Moves the cursor up in the document the specified number of times. Note that this does de-select the current selection.
     **/
    this.navigateUp = function(times) {
        this.selection.clearSelection();
        times = times || 1;
        this.selection.moveCursorBy(-times, 0);
    };

    /**
     * Editor.navigateDown(times) 
     * - times (Number): The number of times to change navigation
     * 
     * Moves the cursor down in the document the specified number of times. Note that this does de-select the current selection.
     **/
    this.navigateDown = function(times) {
        this.selection.clearSelection();
        times = times || 1;
        this.selection.moveCursorBy(times, 0);
    };

    /**
     * Editor.navigateLeft(times) 
     * - times (Number): The number of times to change navigation
     * 
     * Moves the cursor left in the document the specified number of times. Note that this does de-select the current selection.
     **/
    this.navigateLeft = function(times) {
        if (!this.selection.isEmpty()) {
            var selectionStart = this.getSelectionRange().start;
            this.moveCursorToPosition(selectionStart);
        }
        else {
            times = times || 1;
            while (times--) {
                this.selection.moveCursorLeft();
            }
        }
        this.clearSelection();
    };

    /**
     * Editor.navigateRight(times) 
     * - times (Number): The number of times to change navigation
     * 
     * Moves the cursor right in the document the specified number of times. Note that this does de-select the current selection.
     **/
    this.navigateRight = function(times) {
        if (!this.selection.isEmpty()) {
            var selectionEnd = this.getSelectionRange().end;
            this.moveCursorToPosition(selectionEnd);
        }
        else {
            times = times || 1;
            while (times--) {
                this.selection.moveCursorRight();
            }
        }
        this.clearSelection();
    };

    /**
     * Editor.navigateLineStart() 
     * 
     * Moves the cursor to the start of the current line. Note that this does de-select the current selection.
     **/
    this.navigateLineStart = function() {
        this.selection.moveCursorLineStart();
        this.clearSelection();
    };

    /**
     * Editor.navigateLineEnd() 
     * 
     * Moves the cursor to the end of the current line. Note that this does de-select the current selection.
     **/
    this.navigateLineEnd = function() {
        this.selection.moveCursorLineEnd();
        this.clearSelection();
    };

    /**
     * Editor.navigateFileEnd() 
     * 
     * Moves the cursor to the end of the current file. Note that this does de-select the current selection.
     **/
    this.navigateFileEnd = function() {
        var scrollTop = this.renderer.scrollTop;
        this.selection.moveCursorFileEnd();
        this.clearSelection();
        this.renderer.animateScrolling(scrollTop);
    };

    /**
     * Editor.navigateFileStart() 
     * 
     * Moves the cursor to the start of the current file. Note that this does de-select the current selection.
     **/
    this.navigateFileStart = function() {
        var scrollTop = this.renderer.scrollTop;
        this.selection.moveCursorFileStart();
        this.clearSelection();
        this.renderer.animateScrolling(scrollTop);
    };

    /**
     * Editor.navigateWordRight() 
     * 
     * Moves the cursor to the word immediately to the right of the current position. Note that this does de-select the current selection.
     **/
    this.navigateWordRight = function() {
        this.selection.moveCursorWordRight();
        this.clearSelection();
    };

    /**
     * Editor.navigateWordLeft() 
     * 
     * Moves the cursor to the word immediately to the left of the current position. Note that this does de-select the current selection.
     **/
    this.navigateWordLeft = function() {
        this.selection.moveCursorWordLeft();
        this.clearSelection();
    };

    /**
     * Editor.replace(replacement, options) 
     * - replacement (String): The text to replace with
     * - options (Object): The [[Search `Search`]] options to use
     *
     * Replaces the first occurance of `options.needle` with the value in `replacement`.
     **/
    this.replace = function(replacement, options) {
        if (options)
            this.$search.set(options);

        var range = this.$search.find(this.session);
        var replaced = 0;
        if (!range)
            return replaced;

        if (this.$tryReplace(range, replacement)) {
            replaced = 1;
        }
        if (range !== null) {
            this.selection.setSelectionRange(range);
            this.renderer.scrollSelectionIntoView(range.start, range.end);
        }

        return replaced;
    };

    /**
     * Editor.replaceAll(replacement, options) 
     * - replacement (String): The text to replace with
     * - options (Object): The [[Search `Search`]] options to use
     *
     * Replaces all occurances of `options.needle` with the value in `replacement`.
     **/
    this.replaceAll = function(replacement, options) {
        if (options) {
            this.$search.set(options);
        }

        var ranges = this.$search.findAll(this.session);
        var replaced = 0;
        if (!ranges.length)
            return replaced;

        this.$blockScrolling += 1;

        var selection = this.getSelectionRange();
        this.clearSelection();
        this.selection.moveCursorTo(0, 0);

        for (var i = ranges.length - 1; i >= 0; --i) {
            if(this.$tryReplace(ranges[i], replacement)) {
                replaced++;
            }
        }

        this.selection.setSelectionRange(selection);
        this.$blockScrolling -= 1;

        return replaced;
    };

    this.$tryReplace = function(range, replacement) {
        var input = this.session.getTextRange(range);
        replacement = this.$search.replace(input, replacement);
        if (replacement !== null) {
            range.end = this.session.replace(range, replacement);
            return range;
        } else {
            return null;
        }
    };

    /** related to: Search.getOptions
     * Editor.getLastSearchOptions() -> Object
     * 
     * {:Search.getOptions} For more information on `options`, see [[Search `Search`]].
     **/
    this.getLastSearchOptions = function() {
        return this.$search.getOptions();
    };

    /** related to: Search.find
     * Editor.find(needle, options, animate)
     * - needle (String): The text to search for (optional)
     * - options (Object): An object defining various search properties
     * - animate (Boolean): If `true` animate scrolling
     *
     * Attempts to find `needle` within the document. For more information on `options`, see [[Search `Search`]].
     **/
    this.find = function(needle, options, animate) {
        if (!options)
            options = {};

        if (typeof needle == "string" || needle instanceof RegExp)
            options.needle = needle;
        else if (typeof needle == "object")
            oop.mixin(options, needle);

        var range = this.selection.getRange();
        if (options.needle == null) {
            needle = this.session.getTextRange(range)
                || this.$search.$options.needle;
            if (!needle) {
                range = this.session.getWordRange(range.start.row, range.start.column);
                needle = this.session.getTextRange(range);
            }
            this.$search.set({needle: needle});
        }

        this.$search.set(options);
        if (!options.start)
            this.$search.set({start: range});

        var newRange = this.$search.find(this.session);
        if (options.preventScroll)
            return newRange;
        if (newRange) {
            this.revealRange(newRange, animate);
            return newRange;
        }
        // clear selection if nothing is found
        if (options.backwards)
            range.start = range.end;
        else
            range.end = range.start;
        this.selection.setRange(range);
    };

    /** related to: Editor.find
     * Editor.findNext(options, animate)
     * - options (Object): search options
     * - animate (Boolean): If `true` animate scrolling
     *
     * Performs another search for `needle` in the document. For more information on `options`, see [[Search `Search`]].
     **/
    this.findNext = function(options, animate) {
        this.find({skipCurrent: true, backwards: false}, options, animate);
    };

    /** related to: Editor.find
     * Editor.findPrevious(options, animate)
     * - options (Object): search options
     * - animate (Boolean): If `true` animate scrolling
     *
     * Performs a search for `needle` backwards. For more information on `options`, see [[Search `Search`]].
     **/
    this.findPrevious = function(options, animate) {
        this.find(options, {skipCurrent: true, backwards: true}, animate);
    };

    this.revealRange = function(range, animate) {
        this.$blockScrolling += 1;
        this.session.unfold(range);
        this.selection.setSelectionRange(range);
        this.$blockScrolling -= 1;

        var scrollTop = this.renderer.scrollTop;
        this.renderer.scrollSelectionIntoView(range.start, range.end, 0.5);
        if (animate != false)
            this.renderer.animateScrolling(scrollTop);
    };

    /** related to: UndoManager.undo
     * Editor.undo() 
     * 
     * {:UndoManager.undo}
     **/
    this.undo = function() {
        this.$blockScrolling++;
        this.session.getUndoManager().undo();
        this.$blockScrolling--;
        this.renderer.scrollCursorIntoView(null, 0.5);
    };

    /** related to: UndoManager.redo
     * Editor.redo() 
     * 
     * {:UndoManager.redo}
     **/
    this.redo = function() {
        this.$blockScrolling++;
        this.session.getUndoManager().redo();
        this.$blockScrolling--;
        this.renderer.scrollCursorIntoView(null, 0.5);
    };

    /** 
     * Editor.destroy() 
     * 
     * Cleans up the entire editor.
     **/
    this.destroy = function() {
        this.renderer.destroy();
    };

}).call(Editor.prototype);


exports.Editor = Editor;
});
