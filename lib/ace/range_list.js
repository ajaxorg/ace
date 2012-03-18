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

var RangeList = function(startRow, startColumn, endRow, endColumn) {
    this.ranges = [];
};

(function() {
    oop.implement(this, EventEmitter);

    this.comparePoints = function(p1, p2) {
        return p1.row - p2.row || p1.column - p2.column
    };

    this.pointIndex = function(pos, startIndex) {
        var list = this.ranges;

        for (var i = startIndex || 0; i < list.length; i++) {
            var range = list[i];
            var cmp = this.comparePoints(pos, range.end);

            if (cmp > 0)
                continue;
            if (cmp == 0)
                return i;
            cmp = this.comparePoints(pos, range.start);
            if (cmp >= 0)
                return i;

            return -i-1;
        }
        return -i - 1
    };

    this.add = function(range) {
       var startIndex = this.pointIndex(range.start);
        if (startIndex < 0)
            startIndex = -startIndex - 1;

        var endIndex = this.pointIndex(range.end, startIndex);

        if (endIndex < 0)
            endIndex = -endIndex - 1;
        else
            endIndex++;

        var removed = this.ranges.splice(startIndex, endIndex - startIndex, range);
        this._emit("remove", {ranges: removed});
        return startIndex;
    };

    this.addList = function(list) {
        list.forEach(this.add, this);
    };

    this.substractPoint = function(pos) {
        var i = this.pointIndex(pos);
        if (i > 0){
            var removed = this.splice(i, 1);
            this._emit("remove", {ranges: removed});
        }
    };

    // merge overlapping ranges
    this.merge = function() {
        var removed = [];
        var list = this.ranges;
        var next = list[0], range;
        for (var i = 1; i < list.length; i++) {
            range = next;
            next = list[i];
            if (this.comparePoints(range.end, next.start) > 0) {
                if (this.comparePoints(range.end, next.end) < 0) {
                    range.end.row = next.end.row;
                    range.end.column = next.end.column;
                }

                list.splice(i, 1);
                removed.push(next);
                next = range;
                i--;
            }
        }

        if (removed.length)
            this._emit("remove", {ranges: removed});
    };

    this.contains = function(row, column) {
        return this.pointIndex({row: row, column: column}) >= 0;
    };

    this.containsPoint = function(pos) {
        return this.pointIndex(pos) >= 0;
    };


    this.clipRows = function(startRow, endRow) {
        var list = this.ranges;
        if (list[0].start.row > endRow || list[list.length - 1].start.row < startRow)
            return [];

        var startIndex = this.pointIndex({row: startRow, column: 0});
        if (startIndex < 0)
            startIndex = -startIndex - 1;
        var endIndex = this.pointIndex({row: endRow, column: 0}, startIndex);
        if (endIndex < 0)
            endIndex = -endIndex - 1;

        var clipped = [];
        for (var i = startIndex; i < endIndex; i++) {
            clipped.push(list[i]);
        }
        return clipped;
    };


    this.attach = function(session) {
        if (this.session)
            this.dettach();

        this.session = session;
        this.onChange = this.$onChange.bind(this);

        this.session.on('change', this.onChange);
    };

    this.dettach = function() {
        if (!this.session)
            return;
        this.session.removeListener('change', this.onChange)
        this.session = null
    };

    this.$onChange = function(e) {
        // todo
    };

}).call(RangeList.prototype);

exports.RangeList = RangeList;
});
