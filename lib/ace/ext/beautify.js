/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
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

// [WIP]

define(function(require, exports, module) {
"use strict";
    
var TokenIterator = require("ace/token_iterator").TokenIterator;

function is(token, type) {
    return token.type.lastIndexOf(type + ".xml") > -1;
}

exports.singleTags = ["!doctype", "area", "base", "br", "hr", "input", "img", "link", "meta"];
exports.blockTags = ["body", "div", "form", "head", "html", "ol", "p", "script", "style", "ul"];

exports.beautify = function(session) {
    var iterator = new TokenIterator(session, 0, 0);
    var token = iterator.getCurrentToken();
    var tabString = session.getTabString();
    var singleTags = exports.singleTags;
    var blockTags = exports.blockTags;
    var nextToken;
    var breakBefore = false;
    var code = "";
    var value = "";
    var indent = 0;
    var isBlockTag = false;
    var isSingleTag = false;
    var inComment = false;
    var inCase = false;
    var caseLine = false;
    var row;
    var curRow = 0;
    var rowsToAdd = 0;
    var rowTokens = [];
    var parenCount = 0;
    var abort = false;
    var i;
    
    while (token!==null) {
        if(!token) {
            token = iterator.stepForward();
            continue;
        }
        
        curRow = iterator.getCurrentTokenRow();
        rowTokens = iterator.$rowTokens;
        nextToken = iterator.stepForward();
        value = token.value;
        
        // html indentation
        if (is(token, "tag-open") && value === '</')
            indent--;
        else if (is(token, "tag-name") && singleTags.indexOf(value) !== -1)
            indent--;
        
        // are we in a block tag or single tag
        if (is(token, "tag-open")) {
            if (nextToken) {
                isBlockTag = (blockTags.indexOf(nextToken.value) !== -1);
                isSingleTag = (singleTags.indexOf(nextToken.value) !== -1);
            }
        }
        
        // comments
        if (is(token, "comment.start")) {
            inComment = true;
            isBlockTag = true;
        } else if (is(token, "comment.end")) {
            inComment = false;
            isBlockTag = false;
        }
        
        // switch case
        caseLine = false;
        if (token.type === "keyword" && ["case", "default"].indexOf(value)!==-1) {
            caseLine = true;
            inCase = true;
        } else if (token.type === "keyword" && ["break"].indexOf(value)!==-1)
            inCase = false;
        
        // line break before closing tag unless we just had one
        if (is(token, "tag-open") && value === '</' && isBlockTag && !breakBefore)
            rowsToAdd++;
        
        // new rows
        if (curRow != row)
            rowsToAdd = curRow - row;
        
        if (rowsToAdd) {
            code = code.trimRight();
            for (; rowsToAdd > 0; rowsToAdd--) {
                code += "\n";
            }
            
            breakBefore = true;
            
            // trim value if not in a comment
            if (!inComment)
               value = value.trimLeft();
        }
        
        if (value) {
            // unindent if first paren is closing
            parenCount = 0;
            if (curRow != row) {
                if (rowTokens) {
                    abort = false;
                    for (i = 0; i<rowTokens.length && !abort; i++) {
                        if (rowTokens[i].type == "paren.rparen") {
                            indent--;
                            // need to account for the closed paren
                            parenCount++;
                            abort = true;
                        } else if (rowTokens[i].type == "paren.lparen")
                            abort = true;
                    }
                }
            }
            
            // add indent to code
            if (breakBefore && !is(token, "comment")) {
                var count = indent;
                if (inCase && !caseLine)
                    count++;
                
                for (i = 0; i < count; i++) {
                    code += tabString;
                }
            }
            
            // indent if there are more opening parens
            if (curRow != row) {
                if (rowTokens) {
                    for (i = rowTokens.length-1; i>=0; i--) {
                        if (rowTokens[i].type == "paren.rparen") {
                            parenCount -= (rowTokens[i].value.match(/\}/g) || []).length;
                            parenCount -= (rowTokens[i].value.match(/\)/g) || []).length;
                        } else if (rowTokens[i].type == "paren.lparen") {
                            parenCount += (rowTokens[i].value.match(/\{/g) || []).length;
                            parenCount += (rowTokens[i].value.match(/\(/g) || []).length;
                        }
                    }
                    
                    if (parenCount>0)
                        indent++;
                }
            }
        
            code += value;
            breakBefore = false;
            
            // line break after opening block tag, single tag or doctype
            if (
                (is(token, "tag-close") && (isBlockTag || isSingleTag)) || 
                (is(token, "doctype") && value=='>')
            ) {
                // hack to prevent linebreak if tag is immediately closed
                if (nextToken && nextToken.value === '</')
                    rowsToAdd--;
                else
                    rowsToAdd++;
            }
            
            // html indentation
            if (is(token, "tag-open") && value === '<')
                indent++;
                
            row = curRow;
        }
        
        token = nextToken;
    }
    
    code = code.trim();
    
    session.doc.setValue(code);
};

exports.commands = [{
    name: "beautify",
    exec: function(editor) {
        exports.beautify(editor.session);
    },
    bindKey: "Ctrl-Shift-B"
}];

});
