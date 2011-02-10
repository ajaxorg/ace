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

var oop = require("pilot/oop");
var EventEmitter = require("pilot/event_emitter").EventEmitter;

/**
 * An Anchor is a floating pointer in the document. Whenever text is inserted or
 * deleted before the cursor, the position of the cursor is updated
 */
var Anchor = exports.Anchor = function(doc, row, column) {
    this.document = doc;
    this.pos = {
        row: row,
        column: column
    };
    doc.on("change", this.onChange.bind(this));
};

(function() {

    oop.implement(this, EventEmitter);
    
    this.getPosition = function() {
        return {
            row: this.pos.row,
            column: this.pos.column
        };
    };
    
    this.getDocument = function() {
        return this.document;
    };
    
    this.onChange = function(e) {
        var delta = e.data;
        var range = delta.range;
            
        if (range.start.row == range.end.row && range.start.row != this.pos.row)
            return;
            
        if (range.start.row > this.pos.row)
            return;
            
        if (range.start.row == this.pos.row && range.start.column > this.pos.column)
            return;
    
        var pos = this.getPosition();
        if (delta.action === "insertText") {
            if (range.start.row === pos.row && range.start.column <= pos.column) {
                if (range.start.row === range.end.row) {
                    pos.column += range.end.column - range.start.column;
                }
                else {
                    pos.column -= range.start.column;
                    pos.row += range.end.row - range.start.row;
                }
            }
            else if (range.start.row !== range.end.row && range.start.row < pos.row) {
                pos.row += range.end.row - range.start.row;
            }
        } else if (delta.action === "insertLines") {
            if (range.start.row <= pos.row) {
                pos.row += range.end.row - range.start.row;
            }
        }
        else if (delta.action == "removeText") {
            if (range.start.row == pos.row && range.start.column < pos.column) {
                if (range.end.column >= pos.column)
                    pos.column = range.start.column;
                else
                    pos.column = Math.max(0, pos.column - (range.end.column - range.start.column));
                
            } else if (range.start.row !== range.end.row && range.start.row < pos.row) {
                if (range.end.row == pos.row) {
                    pos.column = Math.max(0, pos.column - range.end.column) + range.start.column;
                }
                pos.row -= (range.end.row - range.start.row);
            }
            else if (range.end.row == pos.row) {
                pos.row -= range.end.row - range.start.row;
                pos.column = Math.max(0, pos.column - range.end.column) + range.start.column;
            }
        } else if (delta.action == "removeLines") {
            if (range.start.row <= pos.row) {
                if (range.end.row <= pos.row)
                    pos.row -= range.end.row - range.start.row;
                else {
                    pos.row = range.start.row;
                    pos.column = 0;
                }
            }
        }

        // clip
        var len = this.document.getLength();
        if (pos.row > len) {
            pos.row = len - 1;
            pos.column = this.document.getLine(len-1).length;
        }
        
        this.setPosition(pos);
    };

    this.setPosition = function(pos) {
        if (this.pos.row == pos.row && this.pos.column == pos.column)
            return;
            
        this.pos = pos;
        this._dispatchEvent("change");
    };
    
}).call(Anchor.prototype);

});
