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
 *      Satoshi Murakami <murky.satyr AT gmail DOT com>
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

var Tokenizer = require("ace/tokenizer").Tokenizer;
var Rules     = require("ace/mode/coffee_highlight_rules").CoffeeHighlightRules;
var Outdent   = require("ace/mode/matching_brace_outdent").MatchingBraceOutdent;
var Range     = require("ace/range").Range;
var TextMode  = require("ace/mode/text").Mode;
var oop       = require("pilot/oop")

function CoffeeMode() {
    this.$tokenizer = new Tokenizer(new Rules().getRules());
    this.$outdent   = new Outdent();
};

oop.inherits(CoffeeMode, TextMode);

var proto = CoffeeMode.prototype;
var indenter = /(?:[({[=:]|[-=]>|\b(?:else|switch|try|catch(?:\s*[$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*)?|finally))\s*$/;
var commentLine = /^(\s*)#/;
var hereComment = /^\s*###(?!#)/;
var indentation = /^\s*/;

proto.getNextLineIndent = function(state, line, tab) {
    var indent = this.$getIndent(line);
    var tokens = this.$tokenizer.getLineTokens(line, state).tokens;

    if (!(tokens.length && tokens[tokens.length - 1].type === 'comment') &&
        state === 'start' && indenter.test(line))
        indent += tab;
    return indent;
};

proto.toggleCommentLines = function(state, doc, startRow, endRow){
    console.log("toggle");
    var range = new Range(0, 0, 0, 0);
    for (var i = startRow; i <= endRow; ++i) {
        var line = doc.getLine(i);
        if (hereComment.test(line))
            continue;
            
        if (commentLine.test(line))
            line = line.replace(commentLine, '$1');
        else
            line = line.replace(indentation, '$&#');

        range.end.row = range.start.row = i;
        range.end.column = line.length + 1;
        doc.replace(range, line);
    }
};

proto.checkOutdent = function(state, line, input) {
    return this.$outdent.checkOutdent(line, input);
};

proto.autoOutdent = function(state, doc, row) {
    this.$outdent.autoOutdent(doc, row);
};

exports.Mode = CoffeeMode;

});