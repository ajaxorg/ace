/* ***** BEGIN LICENSE BLOCK *****
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

var oop = require("./lib/oop");
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var Range = require("./range").Range;
var Anchor = require("./anchor").Anchor;

/**
 * class Document
 *
 * Contains the text of the document. Document can be attached to several [[EditSession `EditSession`]]s. At its core, `Document`s are just an array of strings, with each row in the document matching up to the array index.
 *
 *
 **/

 /**
 * new Document([text])
 * - text (String | Array): The starting text
 *
 * Creates a new `Document`. If `text` is included, the `Document` contains those strings; otherwise, it's empty.
 *
 **/
var Document = function(text) {
    this.$lines = [];

    // There has to be one line at least in the document. If you pass an empty
    // string to the insert function, nothing will happen. Workaround.
    if (text.length == 0) {
        this.$lines = [""];
    } else if (Array.isArray(text)) {
        this.insertLines(0, text);
    } else {
        this.insert({row: 0, column:0}, text);
    }
};

(function() {

    oop.implement(this, EventEmitter);

    /**
    * Document.setValue(text) -> Void
    * - text (String): The text to use
    *
    * Replaces all the lines in the current `Document` with the value of `text`.
    **/
    this.setValue = function(text) {
        var len = this.getLength();
        this.remove(new Range(0, 0, len, this.getLine(len-1).length));
        this.insert({row: 0, column:0}, text);
    };

    /**
    * Document.getValue() -> String
    * 
    * Returns all the lines in the document as a single string, split by the new line character.
    **/
    this.getValue = function() {
        return this.getAllLines().join(this.getNewLineCharacter());
    };

    /** 
    * Document.createAnchor(row, column) -> Anchor
    * - row (Number): The row number to use
    * - column (Number): The column number to use
    *
    * Creates a new `Anchor` to define a floating point in the document.
    **/
    this.createAnchor = function(row, column) {
        return new Anchor(this, row, column);
    };

    /** internal, hide
    * Document.$split(text) -> [String]
    * - text (String): The text to work with
    * + ([String]): A String array, with each index containing a piece of the original `text` string.
    * 
    * Splits a string of text on any newline (`\n`) or carriage-return ('\r') characters.
    *
    *
    **/

    // check for IE split bug
    if ("aaa".split(/a/).length == 0)
        this.$split = function(text) {
            return text.replace(/\r\n|\r/g, "\n").split("\n");
        }
    else
        this.$split = function(text) {
            return text.split(/\r\n|\r|\n/);
        };


    /** internal, hide
    * Document.$detectNewLine(text) -> Void
    * 
    * 
    **/
    this.$detectNewLine = function(text) {
        var match = text.match(/^.*?(\r\n|\r|\n)/m);
        if (match) {
            this.$autoNewLine = match[1];
        } else {
            this.$autoNewLine = "\n";
        }
    };

    /**
    * Document.getNewLineCharacter() -> String
    * + (String): If `newLineMode == windows`, `\r\n` is returned.<br/>
    *  If `newLineMode == unix`, `\n` is returned.<br/>
    *  If `newLineMode == auto`, the value of `autoNewLine` is returned.
    * 
    * Returns the newline character that's being used, depending on the value of `newLineMode`. 
    *
    * 
    * 
    **/
    this.getNewLineCharacter = function() {
      switch (this.$newLineMode) {
          case "windows":
              return "\r\n";

          case "unix":
              return "\n";

          case "auto":
              return this.$autoNewLine;
      }
    };

    this.$autoNewLine = "\n";
    this.$newLineMode = "auto";
    /**
     * Document.setNewLineMode(newLineMode) -> Void
     * - newLineMode(String): [The newline mode to use; can be either `windows`, `unix`, or `auto`]{: #Document.setNewLineMode.param}
     * 
     * [Sets the new line mode.]{: #Document.setNewLineMode.desc}
     **/
    this.setNewLineMode = function(newLineMode) {
        if (this.$newLineMode === newLineMode)
            return;

        this.$newLineMode = newLineMode;
    };

    /**
    * Document.getNewLineMode() -> String
    * 
    * [Returns the type of newlines being used; either `windows`, `unix`, or `auto`]{: #Document.getNewLineMode}
    *
    **/
    this.getNewLineMode = function() {
        return this.$newLineMode;
    };

    /**
    * Document.isNewLine(text) -> Boolean
    * - text (String): The text to check
    *
    * Returns `true` if `text` is a newline character (either `\r\n`, `\r`, or `\n`).
    *
    **/
    this.isNewLine = function(text) {
        return (text == "\r\n" || text == "\r" || text == "\n");
    };

    /**
    * Document.getLine(row) -> String
    * - row (Number): The row index to retrieve
    * 
    * Returns a verbatim copy of the given line as it is in the document
    *
    **/
    this.getLine = function(row) {
        return this.$lines[row] || "";
    };

    /**
    * Document.getLines(firstRow, lastRow) -> [String]
    * - firstRow (Number): The first row index to retrieve
    * - lastRow (Number): The final row index to retrieve
    * 
    * Returns an array of strings of the rows between `firstRow` and `lastRow`. This function is inclusive of `lastRow`.
    *
    **/
    this.getLines = function(firstRow, lastRow) {
        return this.$lines.slice(firstRow, lastRow + 1);
    };

    /**
    * Document.getAllLines() -> [String]
    * 
    * Returns all lines in the document as string array. Warning: The caller should not modify this array!
    **/
    this.getAllLines = function() {
        return this.getLines(0, this.getLength());
    };

    /**
    * Document.getLength() -> Number
    * 
    * Returns the number of rows in the document.
    **/
    this.getLength = function() {
        return this.$lines.length;
    };

    /**
    * Document.getTextRange(range) -> String
    * - range (Range): The range to work with
    * 
    * [Given a range within the document, this function returns all the text within that range as a single string.]{: #Document.getTextRange.desc}
    **/
    this.getTextRange = function(range) {
        if (range.start.row == range.end.row) {
            return this.$lines[range.start.row].substring(range.start.column,
                                                         range.end.column);
        }
        else {
            var lines = this.getLines(range.start.row+1, range.end.row-1);
            lines.unshift((this.$lines[range.start.row] || "").substring(range.start.column));
            lines.push((this.$lines[range.end.row] || "").substring(0, range.end.column));
            return lines.join(this.getNewLineCharacter());
        }
    };

    /** internal, hide
    * Document.$clipPosition(position) -> Number
    * 
    * 
    **/
    this.$clipPosition = function(position) {
        var length = this.getLength();
        if (position.row >= length) {
            position.row = Math.max(0, length - 1);
            position.column = this.getLine(length-1).length;
        }
        return position;
    };

    /**
    * Document.insert(position, text) -> Number
    * - position (Number): The position to start inserting at 
    * - text (String): A chunk of text to insert
    * + (Number): The position of the last line of `text`. If the length of `text` is 0, this function simply returns `position`. 
    * Inserts a block of `text` and the indicated `position`.
    *
    * 
    **/
    this.insert = function(position, text) {
        if (!text || text.length === 0)
            return position;

        position = this.$clipPosition(position);

        // only detect new lines if the document has no line break yet
        if (this.getLength() <= 1)
            this.$detectNewLine(text);

        var lines = this.$split(text);
        var firstLine = lines.splice(0, 1)[0];
        var lastLine = lines.length == 0 ? null : lines.splice(lines.length - 1, 1)[0];

        position = this.insertInLine(position, firstLine);
        if (lastLine !== null) {
            position = this.insertNewLine(position); // terminate first line
            position = this.insertLines(position.row, lines);
            position = this.insertInLine(position, lastLine || "");
        }
        return position;
    };

    /**
    * Document.insertLines(row, lines) -> Object
    * - row (Number): The index of the row to insert at
    * - lines (Array): An array of strings
    * + (Object): Returns an object containing the final row and column, like this:<br/>
    *   ```{row: endRow, column: 0}```<br/>
    *   If `lines` is empty, this function returns an object containing the current row, and column, like this:<br/>
    *   ```{row: row, column: 0}```
    *
    * Inserts the elements in `lines` into the document, starting at the row index given by `row`. This method also triggers the `'change'` event.
    *
    *
    **/
    this.insertLines = function(row, lines) {
        if (lines.length == 0)
            return {row: row, column: 0};

        // apply doesn't work for big arrays (smallest threshold is on safari 0xFFFF)
        // to circumvent that we have to break huge inserts into smaller chunks here
        if (lines.length > 0xFFFF) {
            var end = this.insertLines(row, lines.slice(0xFFFF));
            lines = lines.slice(0, 0xFFFF);
        }

        var args = [row, 0];
        args.push.apply(args, lines);
        this.$lines.splice.apply(this.$lines, args);

        var range = new Range(row, 0, row + lines.length, 0);
        var delta = {
            action: "insertLines",
            range: range,
            lines: lines
        };
        this._emit("change", { data: delta });
        return end || range.end;
    };

    /**
    * Document.insertNewLine(position) -> Object
    * - position (String): The position to insert at
    * + (Object): Returns an object containing the final row and column, like this:<br/>
    *    ```{row: endRow, column: 0}```
    * 
    * Inserts a new line into the document at the current row's `position`. This method also triggers the `'change'` event. 
    *
    *   
    *
    **/
    this.insertNewLine = function(position) {
        position = this.$clipPosition(position);
        var line = this.$lines[position.row] || "";

        this.$lines[position.row] = line.substring(0, position.column);
        this.$lines.splice(position.row + 1, 0, line.substring(position.column, line.length));

        var end = {
            row : position.row + 1,
            column : 0
        };

        var delta = {
            action: "insertText",
            range: Range.fromPoints(position, end),
            text: this.getNewLineCharacter()
        };
        this._emit("change", { data: delta });

        return end;
    };

    /**
    * Document.insertInLine(position, text) -> Object | Number
    * - position (Number): The position to insert at
    * - text (String): A chunk of text
    * + (Object): Returns an object containing the final row and column, like this:<br/>
    *     ```{row: endRow, column: 0}```
    * + (Number): If `text` is empty, this function returns the value of `position`
    * 
    * Inserts `text` into the `position` at the current row. This method also triggers the `'change'` event.
    *
    *
    *
    **/
    this.insertInLine = function(position, text) {
        if (text.length == 0)
            return position;

        var line = this.$lines[position.row] || "";

        this.$lines[position.row] = line.substring(0, position.column) + text
                + line.substring(position.column);

        var end = {
            row : position.row,
            column : position.column + text.length
        };

        var delta = {
            action: "insertText",
            range: Range.fromPoints(position, end),
            text: text
        };
        this._emit("change", { data: delta });

        return end;
    };

    /**
    * Document.remove(range) -> Object
    * - range (Range): A specified Range to remove
    * + (Object): Returns the new `start` property of the range, which contains `startRow` and `startColumn`. If `range` is empty, this function returns the unmodified value of `range.start`.
    * 
    * Removes the `range` from the document.
    *
    *
    **/
    this.remove = function(range) {
        // clip to document
        range.start = this.$clipPosition(range.start);
        range.end = this.$clipPosition(range.end);

        if (range.isEmpty())
            return range.start;

        var firstRow = range.start.row;
        var lastRow = range.end.row;

        if (range.isMultiLine()) {
            var firstFullRow = range.start.column == 0 ? firstRow : firstRow + 1;
            var lastFullRow = lastRow - 1;

            if (range.end.column > 0)
                this.removeInLine(lastRow, 0, range.end.column);

            if (lastFullRow >= firstFullRow)
                this.removeLines(firstFullRow, lastFullRow);

            if (firstFullRow != firstRow) {
                this.removeInLine(firstRow, range.start.column, this.getLine(firstRow).length);
                this.removeNewLine(range.start.row);
            }
        }
        else {
            this.removeInLine(firstRow, range.start.column, range.end.column);
        }
        return range.start;
    };

    /**
    * Document.removeInLine(row, startColumn, endColumn) -> Object
    * - row (Number): The row to remove from
    * - startColumn (Number): The column to start removing at 
    * - endColumn (Number): The column to stop removing at
    * + (Object): Returns an object containing `startRow` and `startColumn`, indicating the new row and column values.<br/>If `startColumn` is equal to `endColumn`, this function returns nothing.
    *
    * Removes the specified columns from the `row`. This method also triggers the `'change'` event.
    *
    * 
    **/
    this.removeInLine = function(row, startColumn, endColumn) {
        if (startColumn == endColumn)
            return;

        var range = new Range(row, startColumn, row, endColumn);
        var line = this.getLine(row);
        var removed = line.substring(startColumn, endColumn);
        var newLine = line.substring(0, startColumn) + line.substring(endColumn, line.length);
        this.$lines.splice(row, 1, newLine);

        var delta = {
            action: "removeText",
            range: range,
            text: removed
        };
        this._emit("change", { data: delta });
        return range.start;
    };

    /**
    * Document.removeLines(firstRow, lastRow) -> [String]
    * - firstRow (Number): The first row to be removed
    * - lastRow (Number): The last row to be removed
    * + ([String]): Returns all the removed lines.
    * 
    * Removes a range of full lines. This method also triggers the `'change'` event.
    * 
    *
    **/
    this.removeLines = function(firstRow, lastRow) {
        var range = new Range(firstRow, 0, lastRow + 1, 0);
        var removed = this.$lines.splice(firstRow, lastRow - firstRow + 1);

        var delta = {
            action: "removeLines",
            range: range,
            nl: this.getNewLineCharacter(),
            lines: removed
        };
        this._emit("change", { data: delta });
        return removed;
    };

    /**
    * Document.removeNewLine(row) -> Void
    * - row (Number): The row to check
    * 
    * Removes the new line between `row` and the row immediately following it. This method also triggers the `'change'` event.
    *
    **/
    this.removeNewLine = function(row) {
        var firstLine = this.getLine(row);
        var secondLine = this.getLine(row+1);

        var range = new Range(row, firstLine.length, row+1, 0);
        var line = firstLine + secondLine;

        this.$lines.splice(row, 2, line);

        var delta = {
            action: "removeText",
            range: range,
            text: this.getNewLineCharacter()
        };
        this._emit("change", { data: delta });
    };

    /**
    * Document.replace(range, text) -> Object
    * - range (Range): A specified Range to replace
    * - text (String): The new text to use as a replacement
    * + (Object): Returns an object containing the final row and column, like this:
    *     {row: endRow, column: 0}
    * If the text and range are empty, this function returns an object containing the current `range.start` value.
    * If the text is the exact same as what currently exists, this function returns an object containing the current `range.end` value.
    *
    * Replaces a range in the document with the new `text`.
    *
    **/
    this.replace = function(range, text) {
        if (text.length == 0 && range.isEmpty())
            return range.start;

        // Shortcut: If the text we want to insert is the same as it is already
        // in the document, we don't have to replace anything.
        if (text == this.getTextRange(range))
            return range.end;

        this.remove(range);
        if (text) {
            var end = this.insert(range.start, text);
        }
        else {
            end = range.start;
        }

        return end;
    };

    /**
    * Document.applyDeltas(deltas) -> Void
    * 
    * Applies all the changes previously accumulated. These can be either `'includeText'`, `'insertLines'`, `'removeText'`, and `'removeLines'`.
    **/
    this.applyDeltas = function(deltas) {
        for (var i=0; i<deltas.length; i++) {
            var delta = deltas[i];
            var range = Range.fromPoints(delta.range.start, delta.range.end);

            if (delta.action == "insertLines")
                this.insertLines(range.start.row, delta.lines);
            else if (delta.action == "insertText")
                this.insert(range.start, delta.text);
            else if (delta.action == "removeLines")
                this.removeLines(range.start.row, range.end.row - 1);
            else if (delta.action == "removeText")
                this.remove(range);
        }
    };

    /**
    * Document.revertDeltas(deltas) -> Void
    * 
    * Reverts any changes previously applied. These can be either `'includeText'`, `'insertLines'`, `'removeText'`, and `'removeLines'`.
    **/
    this.revertDeltas = function(deltas) {
        for (var i=deltas.length-1; i>=0; i--) {
            var delta = deltas[i];

            var range = Range.fromPoints(delta.range.start, delta.range.end);

            if (delta.action == "insertLines")
                this.removeLines(range.start.row, range.end.row - 1);
            else if (delta.action == "insertText")
                this.remove(range);
            else if (delta.action == "removeLines")
                this.insertLines(range.start.row, delta.lines);
            else if (delta.action == "removeText")
                this.insert(range.start, delta.text);
        }
    };

}).call(Document.prototype);

exports.Document = Document;
});
