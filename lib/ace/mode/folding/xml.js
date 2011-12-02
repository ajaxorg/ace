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

var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var BaseFoldMode = require("./fold_mode").FoldMode;
var TokenIterator = require("../../token_iterator").TokenIterator;

var FoldMode = exports.FoldMode = function(voidElements) {
    BaseFoldMode.call(this);
    this.voidElements = voidElements || {};
};
oop.inherits(FoldMode, BaseFoldMode);

(function() {

    this.getFoldWidget = function(session, row) {
        var tags = session.getTokens(row, row)[0].tokens
            .filter(function(token) {
                return token.type === "meta.tag";
            })
            .map(function(token) {
                return token.value;
            }).
            join("")
            .trim()
            .replace(/^<|>$|\s+/g, "")
            .split("><");
        
        var fold = tags[0];
        
        if (!fold || this.voidElements[fold])
            return "";
            
        if (fold.charAt(0) == "/")
            return "end";
            
        if (tags.indexOf("/" + fold) !== -1)
            return "";
            
        return "start";
    };
        
    this.getFoldWidgetRange = function(session, row) {
        var start, end;
        var stack = [];
        
        var iterator = new TokenIterator(session, row, 0);
        var step = "stepForward";
        var isBack = false;
            
        // http://dev.w3.org/html5/spec/syntax.html#optional-tags
        // TODO
//            var optionalTags = {
//                "html": 1,
//                "head": 1,
//                "body": 1,
//                "li": 1,
//                "dt": 1,
//                "dd": 1,
//                "p": 1,
//                "rt": 1,
//                "rp": 1,
//                "optgroup": 1,
//                "option": 1,
//                "colgroup": 1,
//                "thead": 1,
//                "tbody": 1,
//                "tfoot": 1,
//                "tr": 1,
//                "td": 1,
//                "th": 1
//            };
            
        // limited XML parsing to find matching tag
        do {
            var token = iterator.getCurrentToken();
            
            var value = token.value.trim();
            if (token && token.type == "meta.tag" && token.value !== ">") {
                var tagName = value.replace(/^[<\s]*|[\s*>]$/g, "");
                if (this.voidElements[tagName])
                    continue;
                    
                if (!start) {
                    if (tagName.charAt(0) == "/") {
                        tagName = tagName.slice(1);
                        step = "stepBackward";
                        isBack = true;
                    }
                    
                    start = {
                        row: row,
                        column: iterator.getCurrentTokenColumn() + (isBack ? 0 : value.length + 1)
                    };

//                    console.log("push", tagName)
                    stack.push(tagName);
                }
                else {
                    var close;
                    if (tagName.charAt(0) == "/") {
                        tagName = tagName.slice(1);
                        close = !isBack;
                    }
                    else
                        close = isBack;
                    
                    if (close) {
                        if (stack[stack.length-1] == tagName) {
//                            console.log("pop", tagName)
                            stack.pop();
                            if (stack.length === 0) {
                                end = {
                                    row: iterator.getCurrentTokenRow(),
                                    column: iterator.getCurrentTokenColumn() + (isBack ? value.length + 1 : 0)
                                };
                                if (isBack)
                                    return Range.fromPoints(end, start);
                                else
                                    return Range.fromPoints(start, end);
                            }
                        }
                        else {
                            console.error("unmatched tags!", tagName, stack);
                        }
                    }
                    else {
//                        console.log("push", tagName)
                        stack.push(tagName);
                    }
                }
            }
            
        } while(token = iterator[step]());
    };
    
}).call(FoldMode.prototype);

});