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

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var HighlightRules = require("./diff_highlight_rules").DiffHighlightRules;
var FoldMode = require("./folding/diff").FoldMode;
var Range = require("../range").Range;

var Mode = function() {
    this.HighlightRules = HighlightRules;
    this.foldingRules = new FoldMode(["diff", "index", "\\+{3}", "@@|\\*{5}"], "i");
};
oop.inherits(Mode, TextMode);

(function() {

    this.$id = "ace/mode/diff";
    
    this.attachToSession = function(session) {
        if (!session.meta) session.meta = {};
        if (session.meta.diffModeBackgroundMarker)
            session.removeMarker(session.meta.diffModeBackgroundMarker.id);
        session.meta.diffModeBackgroundMarker = new DiffHighlight();
        session.addDynamicMarker(session.meta.diffModeBackgroundMarker);
    };
    
}).call(Mode.prototype);

var DiffHighlight = function() {    
};

(function() {

    this.update = function(html, markerLayer, session, config) {
        var first = config.firstRow;
        var last = config.lastRow;
        var states = session.bgTokenizer.lines;
        var range = new Range(0, 0, 0, 1);
        var lastType = "";
        if (!states)
            return;
        var fold = session.getNextFoldLine(first);
        var foldStart = fold ? fold.start.row : Infinity;
        var row = first || 0;
        while (true) {
            if (row > foldStart) {
                row = fold.end.row + 1;
                fold = session.getNextFoldLine(row, fold);
                foldStart = fold ? fold.start.row : Infinity;
            }
            var token = row <= last && states[row] && states[row][0]
            var type = token ? token.type : "";
            if (lastType != type) {
                if (lastType) {
                    markerLayer.drawFullLineMarker(html, range.toScreenRange(session),
                        "unidiff marker " + lastType, config);
                }
                if (type == "diff.insert" || type == "diff.remove" || type == "diff.header") {
                    range.start.row = row;
                    lastType = type
                } else {
                    lastType = "";
                }
            }
            if (row > last) {
                break;
            }
            range.end.row = row;
            
            row++;
        }
    };

}).call(DiffHighlight.prototype);


exports.Mode = Mode;

});
