/* vim:ts=4:sts=4:sw=4:
 * ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *      Irakli Gozalishvili <rfobic@gmail.com> (http://jeditoolkit.com)
 *      Julian Viereck <julian.viereck@gmail.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
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
//var TouchHandler = require("./touch_handler").TouchHandler;
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
 * Some editor stuff. TODO
 *
 **/

/**
 * new Editor(renderer, session)
 * - renderer (VirtualRenderer):
 * - session (EditSession):
 *
 * Creates a new `Editor`. TODO
 *
 **/
var Editor = function(renderer, session) {
    var container = renderer.getContainerElement();
    this.container = container;
    this.renderer = renderer;
    
    /**
     * Editor.textInput -> TextInput
     *
     * The current text editable area of the document.
     *
     **/
    this.textInput  = new TextInput(renderer.getTextAreaContainer(), this);
    this.keyBinding = new KeyBinding(this);

    // TODO detect touch event support
    if (useragent.isIPad) {
        //this.$mouseHandler = new TouchHandler(this);
    } else {
        this.$mouseHandler = new MouseHandler(this);
        new FoldHandler(this);
    }

    this.$blockScrolling = 0;
    this.$search = new Search().set({
        wrap: true
    });

    this.commands = new CommandManager(useragent.isMac ? "mac" : "win", defaultCommands);
    this.setSession(session || new EditSession(""));
};

(function(){

    oop.implement(this, EventEmitter);

    /**
	* Editor.setKeyboardHandler(keyboardHandler) -> Void
	* 
	* Sets a new keyboard handler.
	**/
	this.setKeyboardHandler = function(keyboardHandler) {
        this.keyBinding.setKeyboardHandler(keyboardHandler);
    };

    /**
	* Editor.getKeyboardHandler() -> String
	* 
	* TODO Returns a keyboard handler.
	**/
	this.getKeyboardHandler = function() {
        return this.keyBinding.getKeyboardHandler();
    };

    /**
	* Editor.setSession(session) -> Void
	* - session (EditSession): The new session to use
    *
	* Sets a new session to use. This method also emits the `'changeSession'` event.
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

        this.$onChangeTabSize = this.renderer.updateText.bind(this.renderer);
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

    /**
	* Editor.getSelection() -> String
	* 
	* TODO
	**/
	this.getSelection = function() {
        return this.selection;
    };

    /**related to: VirtualRenderer.onResize
	* Editor.resize() -> Void
	* 
	* 
	**/
	this.resize = function() {
        this.renderer.onResize();
    };

    /**
	* Editor.setTheme(theme) -> Void
	* 
	* (~VirtualRenderer.setTheme)
	**/
	this.setTheme = function(theme) {
        this.renderer.setTheme(theme);
    };

    /** related to: VirtualRenderer.getTheme
	* Editor.getTheme() -> String
	* 
	* (~VirtualRenderer.getTheme)
	**/
	this.getTheme = function() {
        return this.renderer.getTheme();
    };

    /** related to: VirtualRenderer.setStyle
	* Editor.setStyle(style) -> Void
	* 
	* (~VirtualRenderer.setStyle)
	**/
	this.setStyle = function(style) {
        this.renderer.setStyle(style);
    };

    /** related to: VirtualRenderer.unsetStyle
	* Editor.unsetStyle(style) -> Void
	* 
	* (~VirtualRenderer.unsetStyle)
	**/
	this.unsetStyle = function(style) {
        this.renderer.unsetStyle(style);
    };

    /**
	* Editor.setFontSize(size) -> Void
	* - size (Number): A font size 
	* 
    * Set a new font size (in pixels) for the editor text.
	**/
	this.setFontSize = function(size) {
        this.container.style.fontSize = size;
        this.renderer.updateFontSize();
    };

    /**
	* Editor.$highlightBrackets() -> Void
	* 
	* TODO Highlights matching 
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
        }, 10);
    };

    /**
	* Editor.focus() -> Void
	* 
	* Brings the current [[textInput `textInput`]] into focus.
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
	* Returns true if the current [[textInput `textInput`]] is in focus.
	**/
	this.isFocused = function() {
        return this.textInput.isFocused();
    };

    /**
	* Editor.blur() -> Void
	* 
	* Blurs the current [[textInput `textInput`]].
	**/
	this.blur = function() {
        this.textInput.blur();
    };

    /**
	* Editor@onFocus()
	* 
	* Emitted once the editor comes into focus.
	**/
	this.onFocus = function() {
        this.renderer.showCursor();
        this.renderer.visualizeFocus();
        this._emit("focus");
    };

    /**
	* Editor@onBlur()
	* 
	* Emitted once the editor has been blurred.
	**/
	this.onBlur = function() {
        this.renderer.hideCursor();
        this.renderer.visualizeBlur();
        this._emit("blur");
    };

    /**
	* Editor@onDocumentChange(e) 
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
        this.onCursorChange();
    };

    /**
	* Editor@onTokenizerUpdate(e)
    * - e (Object): Contains a single property, `data`, which indicates the changed rows
	* 
    * Emitted when the a tokenizer is updated.
	**/
	this.onTokenizerUpdate = function(e) {
        var rows = e.data;
        this.renderer.updateLines(rows.first, rows.last);
    };

    /**
	* Editor@onScrollTopChange() 
	* 
	* TODO Emitted when the top
	**/
	this.onScrollTopChange = function() {
        this.renderer.scrollToY(this.session.getScrollTop());
    };

    /**
	* Editor@onScrollLeftChange() 
	* 
	* TODO Emitted when 
	**/
	this.onScrollLeftChange = function() {
        this.renderer.scrollToX(this.session.getScrollLeft());
    };

    /**
	* Editor@onCursorChange() 
	* 
	* TODO Emitted whenever the cursor changes.
	**/
	this.onCursorChange = function() {
        this.renderer.updateCursor();

        if (!this.$blockScrolling) {
            this.renderer.scrollCursorIntoView();
        }

        // move text input over the cursor
        // this is required for iOS and IME
        this.renderer.moveTextAreaToCursor(this.textInput.getElement());

        this.$highlightBrackets();
        this.$updateHighlightActiveLine();
    };

	this.$updateHighlightActiveLine = function() {
        var session = this.getSession();

        if (session.$highlightLineMarker) {
            session.removeMarker(session.$highlightLineMarker);
        }
        session.$highlightLineMarker = null;

        if (this.getHighlightActiveLine() && (this.getSelectionStyle() != "line" || !this.selection.isMultiLine())) {
            var cursor = this.getCursorPosition(),
                foldLine = this.session.getFoldLine(cursor.row);
            var range;
            if (foldLine) {
                range = new Range(foldLine.start.row, 0, foldLine.end.row + 1, 0);
            } else {
                range = new Range(cursor.row, 0, cursor.row+1, 0);
            }
            session.$highlightLineMarker = session.addMarker(range, "ace_active_line", "background");
        }
    };

    /**
	* Editor@onSelectionChange(e) 
    * - e (Object): Contains a single property, `data`, which has the delta of changes
	* 
    * Emitted when a selection has changed.
	**/
	this.onSelectionChange = function(e) {
        var session = this.getSession();

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

        if (this.$highlightSelectedWord)
            this.session.getMode().highlightSelection(this);
    };

    /**
	* Editor@onChangeFrontMarker() 
	* 
	* Emitted when a front marker changes.
	**/
	this.onChangeFrontMarker = function() {
        this.renderer.updateFrontMarkers();
    };

    /**
	* Editor@onChangeBackMarker() 
	* 
	* Emitted when a back marker changes.
	**/
	this.onChangeBackMarker = function() {
        this.renderer.updateBackMarkers();
    };

    /**
	* Editor@onChangeBreakpoint() 
	* 
	* Emitted when a breakpoint changes.
	**/
	this.onChangeBreakpoint = function() {
        this.renderer.setBreakpoints(this.session.getBreakpoints());
    };

    /**
	* Editor@onChangeAnnotation() 
	* 
	* Emitted when an annotation changes.
	**/
	this.onChangeAnnotation = function() {
        this.renderer.setAnnotations(this.session.getAnnotations());
    };

    /**
	* Editor@onChangeMode() 
	* 
	* Emitted when the mode changes.
	**/
	this.onChangeMode = function() {
        this.renderer.updateText();
    };

    /**
	* Editor@onChangeWrapLimit() 
	* 
	* Emitted when the wrap limit changes.
	**/
	this.onChangeWrapLimit = function() {
        this.renderer.updateFull();
    };

    /**
	* Editor@onChangeWrapMode() 
	* 
	* Emitted when the wrap mode changes.
	**/
	this.onChangeWrapMode = function() {
        this.renderer.onResize(true);
    };

    /**
	* Editor@onChangeFold() 
	* 
	* Emitted when the code folds change.
	**/
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
	this.getCopyText = function() {
        var text = "";
        if (!this.selection.isEmpty())
            text = this.session.getTextRange(this.getSelectionRange());

        this._emit("copy", text);
        return text;
    };

    /**
	* Editor@onCut() 
	* 
	* Emitted whenever a text "cut" happens.
	**/
	this.onCut = function() {
        if (this.$readOnly)
            return;

        var range = this.getSelectionRange();
        this._emit("cut", range);

        if (!this.selection.isEmpty()) {
            this.session.remove(range);
            this.clearSelection();
        }
    };

    /**
	* Editor.insert(text) -> Void
	* - text (String): The new text to add
	* 
    * TODO Inserts `text` into wherever the cursor is pointing.
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
        var shouldOutdent = mode.checkOutdent(lineState, session.getLine(cursor.row), text);
        var line = session.getLine(cursor.row);
        var lineIndent = mode.getNextLineIndent(lineState, line.slice(0, cursor.column), session.getTabString());
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

        var lineState = session.getState(cursor.row);

        // TODO disabled multiline auto indent
        // possibly doing the indent before inserting the text
        // if (cursor.row !== end.row) {
        if (session.getDocument().isNewLine(text)) {
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

    /**
	* Editor@onTextInput(text, pasted) 
	* 
	* TODO
	**/
	this.onTextInput = function(text, pasted) {
        if (pasted)
            this._emit("paste", text);

        this.keyBinding.onTextInput(text, pasted);
    };

    /**
	* Editor@onCommandKey(e, hashId, keyCode) 
	* 
	* TODO
	**/
	this.onCommandKey = function(e, hashId, keyCode) {
        this.keyBinding.onCommandKey(e, hashId, keyCode);
    };

    /** related to: EditSession.setOverwrite
	* Editor.setOverwrite(overwrite) -> Void
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
	* Editor.toggleOverwrite() -> Void
    * 
    * Sets the value of overwrite to the opposite of whatever it currently is.
    **/
	this.toggleOverwrite = function() {
        this.session.toggleOverwrite();
    };

    /**
	* Editor.setScrollSpeed(speed) -> Void
	* - speed (Integer): A value indicating the new speed
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
	* Editor.setDragDelay(dragDelay) -> Void
	* - dragDelay (Number): A value indicating the new delay
	* 
    * TODO Sets the delay (in milliseconds) of the mouse drag.
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
	* Editor.setSelectionStyle(style) -> Void
	* - style (String): The new selection style
    *
    * Indicates how selections should occur. By default, selections are set to "line". This function also emits the `'changeSelectionStyle'` event.
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
	* Editor.setHighlightActiveLine(shouldHighlight) -> Void
	* - shouldHighlight (Boolean): Set to `true` to highlight the current line
    *
	* Determines whether or not the current line should be highlighted.
    *
	**/
	this.setHighlightActiveLine = function(shouldHighlight) {
        if (this.$highlightActiveLine == shouldHighlight) return;

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

    this.$highlightSelectedWord = true;
    /**
	* Editor.setHighlightSelectedWord(shouldHighlight) -> Void
	* - shouldHighlight (Boolean): Set to `true` to highlight the currently selected word
    *
	* Determines if the currently selected word should be highlighted.
	**/
	this.setHighlightSelectedWord = function(shouldHighlight) {
        if (this.$highlightSelectedWord == shouldHighlight)
            return;

        this.$highlightSelectedWord = shouldHighlight;
        if (shouldHighlight)
            this.session.getMode().highlightSelection(this);
        else
            this.session.getMode().clearSelectionHighlight(this);
    };

    /**
	* Editor.getHighlightSelectedWord() -> Boolean
	* 
	* Returns `true` if currently highlighted words are to be highlighted.
	**/
	this.getHighlightSelectedWord = function() {
        return this.$highlightSelectedWord;
    };

    /**
	* Editor.setShowInvisibles(showInvisibles) -> Void
	* - showInvisibles (Boolean): Specifies whether or not to show invisible characters
	* 
    * If `showInvisibiles` is set to `true`, invisible characters&mdash;like spaces or new lines&mdash;are show in the editor.
	**/
	this.setShowInvisibles = function(showInvisibles) {
        if (this.getShowInvisibles() == showInvisibles)
            return;

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

    /**
	* Editor.setShowPrintMargin(showPrintMargin) -> Void
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
	* Editor.setPrintMarginColumn(showPrintMargin) -> Void
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
	* Editor.setReadOnly(readOnly) -> Void
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
    * Editor.setBehavioursEnabled() -> Void
    * - enabled (Boolean)
    * 
    *TODO
    **/
    this.setBehavioursEnabled = function (enabled) {
        this.$modeBehaviours = enabled;
    };

    /**
    * Editor.getBehavioursEnabled() -> Boolean
    * 
    * TODO Returns `true` if the behaviours are currently enabled.
    **/

    this.getBehavioursEnabled = function () {
        return this.$modeBehaviours;
    };

    /**
	* Editor.setShowFoldWidgets(show) -> Void
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

    /**
	* Editor.remove(dir) -> Void
	* - dir (String): The direction of the deletion to occur, either "left" or "right"
	* 
    * Removes words of text from the editor. A "word" is defined as a string of characters bookended by whitespace.
    *
	**/
	this.remove = function(dir) {
        if (this.selection.isEmpty()){
            if(dir == "left")
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
	* Editor.removeWordRight() -> Void
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
	* Editor.removeWordLeft() -> Void
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
	* Editor.removeToLineStart() -> Void
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
	* Editor.removeToLineEnd() -> Void
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
	* Editor.splitLine() -> Void
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
	* Editor.transposeLetters() -> Void
	* 
	* Transposes the letters of the entire line . TODO
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
	* Editor.toLowerCase() -> Void
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
	* Editor.toUpperCase() -> Void
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
	* Editor.indent() -> Void
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
	* Editor.blockOutdent() -> Void
	* 
	* Outdents the current line.
	**/
	this.blockOutdent = function() {
        var selection = this.session.getSelection();
        this.session.outdentRows(selection.getRange());
    };

    /**
	* Editor.toggleCommentLines() -> Void
	* 
	* TODO
	**/
	this.toggleCommentLines = function() {
        var state = this.session.getState(this.getCursorPosition().row);
        var rows = this.$getSelectedRows();
        this.session.getMode().toggleCommentLines(state, this.session, rows.first, rows.last);
    };

    /** related to: EditSession.remove
	* Editor.removeLines() -> Void
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

    /** related to: EditSession.moveLinesDown
	* Editor.moveLinesDown() -> Number
	* 
	* Shifts all the selected lines down one row.
    *
    * #### Returns
    *
    * On success, it returns -1.
    *
	**/
	this.moveLinesDown = function() {
        this.$moveLines(function(firstRow, lastRow) {
            return this.session.moveLinesDown(firstRow, lastRow);
        });
    };

    /** related to: EditSession.moveLinesUp
    * Editor.moveLinesUp() -> Number
    * 
    * Shifts all the selected lines up one row.
    *
    * #### Returns
    *
    * On success, it returns -1.
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
    *
    * Moves a range of text from the given range to the given position. `toPosition` is an object that looks like this:
    *
    *    { row: newRowLocation, column: newColumnLocation }
    * 
    *
    * #### Returns
    *
    * The new range where the text was moved to.
    *
    **/
	this.moveText = function(range, toPosition) {
        if (this.$readOnly)
            return null;

        return this.session.moveText(range, toPosition);
    };

    /** related to: EditSession.duplicateLines
	* Editor.copyLinesUp() -> Number
	* 
	* Copies all the selected lines up one row.
    *
    * #### Returns
    *
    * On success, returns 0.
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
	* 
	* Copies all the selected lines down one row.
    *
    * #### Returns
    *
    * On success, returns the number of new rows added; in other words, `lastRow - firstRow + 1`.
    *
	**/
	this.copyLinesDown = function() {
        this.$moveLines(function(firstRow, lastRow) {
            return this.session.duplicateLines(firstRow, lastRow);
        });
    };


    /**
	* Editor.$moveLines(mover) -> Void
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

    /**
	* Editor@onCompositionStart(text) 
	* - text (String): The text being written
	* 
    * TODO
	**/
	this.onCompositionStart = function(text) {
        this.renderer.showComposition(this.getCursorPosition());
    };

    /**
	* Editor@onCompositionUpdate(text) 
    * - text (String): The text being written
    * 
    * TODO
	**/
	this.onCompositionUpdate = function(text) {
        this.renderer.setCompositionText(text);
    };

    /**
	* Editor@onCompositionEnd() 
	* 
	* TODO
	**/
	this.onCompositionEnd = function() {
        this.renderer.hideComposition();
    };

    /** related to: VirtualRenderer.getFirstVisibleRow
	* Editor.getFirstVisibleRow() -> Number
	* 
	* (~VirtualRenderer.getFirstVisibleRow)
	**/
	this.getFirstVisibleRow = function() {
        return this.renderer.getFirstVisibleRow();
    };

    /** related to: VirtualRenderer.getLastVisibleRow
	* Editor.getLastVisibleRow() -> Number
	* 
	* (~VirtualRenderer.getLastVisibleRow)
	**/
	this.getLastVisibleRow = function() {
        return this.renderer.getLastVisibleRow();
    };

    /**
	* Editor.isRowVisible(row) -> Boolean
	* - row (Number): The row to check
	* 
    * TODO Indicates if the row is currently visible.
	**/
	this.isRowVisible = function(row) {
        return (row >= this.getFirstVisibleRow() && row <= this.getLastVisibleRow());
    };

    /**
	* Editor.isRowFullyVisible(row) -> Boolean
    * - row (Number): The row to check
    * 
    * TODO Indicates if the row is currently visible.
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

	this.$getPageDownRow = function() {
        return this.renderer.getScrollBottomRow();
    };

	this.$getPageUpRow = function() {
        var firstRow = this.renderer.getScrollTopRow();
        var lastRow = this.renderer.getScrollBottomRow();

        return firstRow - (lastRow - firstRow);
    };

    /**
	* Editor.selectPageDown() -> Void
	* 
	* TODO
	**/
	this.selectPageDown = function() {
        var row = this.$getPageDownRow() + Math.floor(this.$getVisibleRowCount() / 2);

        this.scrollPageDown();

        var selection = this.getSelection();
        var leadScreenPos = this.session.documentToScreenPosition(selection.getSelectionLead());
        var dest = this.session.screenToDocumentPosition(row, leadScreenPos.column);
        selection.selectTo(dest.row, dest.column);
    };

    /**
	* Editor.selectPageUp() -> Void
	* 
	* TODO
	**/
	this.selectPageUp = function() {
        var visibleRows = this.renderer.getScrollTopRow() - this.renderer.getScrollBottomRow();
        var row = this.$getPageUpRow() + Math.round(visibleRows / 2);

        this.scrollPageUp();

        var selection = this.getSelection();
        var leadScreenPos = this.session.documentToScreenPosition(selection.getSelectionLead());
        var dest = this.session.screenToDocumentPosition(row, leadScreenPos.column);
        selection.selectTo(dest.row, dest.column);
    };

    /**
	* Editor.gotoPageDown() -> Void
	* 
	* TODO
	**/
	this.gotoPageDown = function() {
        var row = this.$getPageDownRow();
        var column = this.getCursorPositionScreen().column;

        this.scrollToRow(row);
        this.getSelection().moveCursorToScreen(row, column);
    };

    /**
	* Editor.gotoPageUp() -> Void
	* 
	* TODO
	**/
	this.gotoPageUp = function() {
        var row = this.$getPageUpRow();
        var column = this.getCursorPositionScreen().column;

       this.scrollToRow(row);
       this.getSelection().moveCursorToScreen(row, column);
    };

    /**
	* Editor.scrollPageDown() -> Void
	* 
	* TODO
	**/
	this.scrollPageDown = function() {
        this.scrollToRow(this.$getPageDownRow());
    };

    /**
	* Editor.scrollPageUp() -> Void
	* 
	* TODO
	**/
	this.scrollPageUp = function() {
        this.renderer.scrollToRow(this.$getPageUpRow());
    };

    /** related to: VirtualRenderer.scrollToRow
	* Editor.scrollToRow(row) -> Void
	* - row (Number): The row to move to
    *
    * Moves the editor to the specified row.
	* 
	**/
	this.scrollToRow = function(row) {
        this.renderer.scrollToRow(row);
    };

    /** related to: VirtualRenderer.scrollToLine
	* Editor.scrollToLine(line, center) -> Void
	* - line (Number):
    * - center (Boolean):
    *
	* TODO
	**/
	this.scrollToLine = function(line, center) {
        this.renderer.scrollToLine(line, center);
    };

    /**
	* Editor.centerSelection() -> Void
	* 
	* Moves the current cursor selection to the center of the line.
	**/
	this.centerSelection = function() {
        var range = this.getSelectionRange();
        var line = Math.floor(range.start.row + (range.end.row - range.start.row) / 2);
        this.renderer.scrollToLine(line, true);
    };

    /** related to: Selection.getCursor
	* Editor.getCursorPosition() -> Object
	* 
	* Gets the current position of the cursor.
    *
    * #### Returns
    *
    * This returns an object that looks something like this:
    *
    *      { row: currRow, column: currCol }
    *
	**/
	this.getCursorPosition = function() {
        return this.selection.getCursor();
    };

    /** related to: EditSession.documentToScreenPosition
	* Editor.getCursorPositionScreen() -> Number
	* 
	* TODO
	**/
	this.getCursorPositionScreen = function() {
        return this.session.documentToScreenPosition(this.getCursorPosition());
    };

    /** related to: Selection.getRange
	* Editor.getSelectionRange() -> Range
	* 
	* (~Selection.getRange)
	**/
	this.getSelectionRange = function() {
        return this.selection.getRange();
    };


    /** related to: Selection.selectAll
	* Editor.selectAll() -> Void
	* 
	* Selects all the text in editor.
	**/
	this.selectAll = function() {
        this.$blockScrolling += 1;
        this.selection.selectAll();
        this.$blockScrolling -= 1;
    };

    /** related to: Selection.clearSelection
	* Editor.clearSelection() -> Void
	* 
	* (~Selection.clearSelection)
	**/
	this.clearSelection = function() {
        this.selection.clearSelection();
    };

    /** related to: Selection.moveCursorTo
	* Editor.moveCursorTo(row, column) -> Void
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
	* Editor.moveCursorToPosition(pos) -> Void
	* - pos (Object): An object with two properties, row and column
	* 
    * Moves the cursor to the position indicated by `pos.row` and `pos.column`.
    *
	**/
	this.moveCursorToPosition = function(pos) {
        this.selection.moveCursorToPosition(pos);
    };

    /** related to: EditSession.findMatchingBracket
	* Editor.jumpToMatching() -> Void
	* 
	* Moves the cursor's row and column to the next matching bracket.
    *
	**/
	this.jumpToMatching = function() {
        var cursor = this.getCursorPosition();
        var pos = this.session.findMatchingBracket(cursor);
        if (!pos) {
            cursor.column += 1;
            pos = this.session.findMatchingBracket(cursor);
        }
        if (!pos) {
            cursor.column -= 2;
            pos = this.session.findMatchingBracket(cursor);
        }
        
        if (pos) {
            this.clearSelection();
            this.moveCursorTo(pos.row, pos.column);
        }
    };
    
    /**
	* Editor.gotoLine(lineNumber, column) -> Void
	* - lineNumber (Number): The line number to go to
    * - column (Number): A column number to go to
    *
    * Moves the cursor to the specified line number, and also into the indiciated column.
	* 
	**/
	this.gotoLine = function(lineNumber, column) {
        this.selection.clearSelection();
        this.session.unfold({row: lineNumber - 1, column: column || 0});

        this.$blockScrolling += 1;
        this.moveCursorTo(lineNumber-1, column || 0);
        this.$blockScrolling -= 1;
        if (!this.isRowFullyVisible(this.getCursorPosition().row))
            this.scrollToLine(lineNumber, true);
    };

    /** related to: Editor.moveCursorTo
	* Editor.navigateTo(row, column) -> Void
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
	* Editor.navigateUp(times) -> Void
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
	* Editor.navigateDown(times) -> Void
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
	* Editor.navigateLeft(times) -> Void
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
	* Editor.navigateRight(times) -> Void
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
	* Editor.navigateLineStart() -> Void
    * 
    * Moves the cursor to the start of the current line. Note that this does de-select the current selection.
    **/
	this.navigateLineStart = function() {
        this.selection.moveCursorLineStart();
        this.clearSelection();
    };

    /**
	* Editor.navigateLineEnd() -> Void
    * 
    * Moves the cursor to the end of the current line. Note that this does de-select the current selection.
    **/
	this.navigateLineEnd = function() {
        this.selection.moveCursorLineEnd();
        this.clearSelection();
    };

    /**
	* Editor.navigateFileEnd() -> Void
    * 
    * Moves the cursor to the end of the current file. Note that this does de-select the current selection.
    **/
	this.navigateFileEnd = function() {
        this.selection.moveCursorFileEnd();
        this.clearSelection();
    };

    /**
	* Editor.navigateFileStart() -> Void
    * 
    * Moves the cursor to the start of the current file. Note that this does de-select the current selection.
    **/
	this.navigateFileStart = function() {
        this.selection.moveCursorFileStart();
        this.clearSelection();
    };

    /**
	* Editor.navigateWordRight() -> Void
    * 
    * Moves the cursor to the word immediately to the right of the current position. Note that this does de-select the current selection.
    **/
	this.navigateWordRight = function() {
        this.selection.moveCursorWordRight();
        this.clearSelection();
    };

    /**
	* Editor.navigateWordLeft() -> Void
    * 
    * Moves the cursor to the word immediately to the left of the current position. Note that this does de-select the current selection.
    **/
	this.navigateWordLeft = function() {
        this.selection.moveCursorWordLeft();
        this.clearSelection();
    };

    /**
	* Editor.replace(replacement, options) -> Void
	* 
	* TODO
	**/
	this.replace = function(replacement, options) {
        if (options)
            this.$search.set(options);

        var range = this.$search.find(this.session);
        if (!range)
            return;

        this.$tryReplace(range, replacement);
        if (range !== null)
            this.selection.setSelectionRange(range);
    };

    /**
	* Editor.replaceAll(replacement, options) -> Void
	* 
	* TODO
	**/
	this.replaceAll = function(replacement, options) {
        if (options) {
            this.$search.set(options);
        }

        var ranges = this.$search.findAll(this.session);
        if (!ranges.length)
            return;

        var selection = this.getSelectionRange();
        this.clearSelection();
        this.selection.moveCursorTo(0, 0);

        this.$blockScrolling += 1;
        for (var i = ranges.length - 1; i >= 0; --i)
            this.$tryReplace(ranges[i], replacement);

        this.selection.setSelectionRange(selection);
        this.$blockScrolling -= 1;
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
	* (~Search.getOptions)
	**/
	this.getLastSearchOptions = function() {
        return this.$search.getOptions();
    };

    /** related to: Search.find
	* Editor.find(needle, options) -> Void
	* 
	* TODO
	**/
	this.find = function(needle, options) {
        this.clearSelection();
        options = options || {};
        options.needle = needle;
        this.$search.set(options);
        this.$find();
    };

    /** related to: Editor.find
	* Editor.findNext(options) -> Void
	* 
	* Performs another search for `needle` in the document.
	**/
	this.findNext = function(options) {
        options = options || {};
        if (typeof options.backwards == "undefined")
            options.backwards = false;
        this.$search.set(options);
        this.$find();
    };

    /** related to: Editor.find
	* Editor.findPrevious(options) -> Void
	* 
	* Performs a search for `needle` backwards.
	**/
	this.findPrevious = function(options) {
        options = options || {};
        if (typeof options.backwards == "undefined")
            options.backwards = true;
        this.$search.set(options);
        this.$find();
    };

    this.$find = function(backwards) {
        if (!this.selection.isEmpty())
            this.$search.set({needle: this.session.getTextRange(this.getSelectionRange())});

        if (typeof backwards != "undefined")
            this.$search.set({backwards: backwards});

        var range = this.$search.find(this.session);
        if (range) {
            this.session.unfold(range);
            this.selection.setSelectionRange(range); // this scrolls selection into view
        }
    };

    /** related to: UndoManager.undo
	* Editor.undo() -> Void
	* 
	* (~UndoManager.undo)
	**/
	this.undo = function() {
        this.session.getUndoManager().undo();
    };

    /** related to: UndoManager.redo
	* Editor.redo() -> Void
	* 
	* (~UndoManager.redo)
	**/
	this.redo = function() {
        this.session.getUndoManager().redo();
    };

    /**
	* Editor.destroy() -> Void
	* 
	* TODO
	**/
	this.destroy = function() {
        this.renderer.destroy();
    };

}).call(Editor.prototype);


exports.Editor = Editor;
});
