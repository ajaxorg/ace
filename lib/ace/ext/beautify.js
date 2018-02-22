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

// do not indent after singleton tags or <html>
exports.singletonTags = ["area", "base", "br", "col", "command", "embed", "hr", "html", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"];

// insert a line break after block level tags
exports.blockTags = ["article", "blockquote", "body", "div", "dl", "fieldset", "footer", "form", "head", "header", "html", "nav", "ol", "p", "script", "section", "style", "table", "ul"];

exports.beautify = function(session) {
    var iterator = new TokenIterator(session, 0, 0);
    var token = iterator.getCurrentToken();
    var tabString = session.getTabString();
    var singletonTags = exports.singletonTags;
    var blockTags = exports.blockTags;
    var nextToken;
    var breakBefore = false;
    var code = "";
    var value = "";
    var tagName = "";
    var indent = 0;
    var inBlock = false;
    var inComment = false;
    var inCase = false;
    var onCaseLine = false;
    var row;
    var curRow = 0;
    var rowsToAdd = 0;
    var rowTokens = [];
    var openParenCount = 0;
    var abort = false;
    var i;
    var indentNextLine = false;
    
    while (token!==null) {
        value = token.value;
        curRow = iterator.getCurrentTokenRow();
        rowTokens = iterator.$rowTokens;
        nextToken = iterator.stepForward();
        
        if (is(token, "tag-name"))
            tagName = value;
        
        // html indentation
        if (is(token, "tag-open") && value === '</')
            indent--;
        
        // are we in a block tag
        if (is(token, "tag-open") && nextToken)
            inBlock = (blockTags.indexOf(nextToken.value) !== -1);
        
        // comments
        if (is(token, "comment.start")) {
            inComment = true;
            inBlock = true;
        } else if (is(token, "comment.end")) {
            inComment = false;
            inBlock = false;
        }
        
        // switch case
        onCaseLine = false;
        if (token.type === "keyword" && ["case", "default"].indexOf(value)!==-1) {
            onCaseLine = true;
            inCase = true;
        } else if (token.type === "keyword" && ["break"].indexOf(value)!==-1)
            inCase = false;
        
        // line break before closing tag unless we just had one
        if (is(token, "tag-open") && value === '</' && inBlock && !breakBefore)
            rowsToAdd++;
        
        // add rows
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
            if (curRow != row && rowTokens) {
                openParenCount = 0;
                abort = false;
                for (i = 0; i<rowTokens.length && !abort; i++) {
                    if (rowTokens[i].type == "paren.rparen") {
                        indent--;
                        // account for the closed paren
                        openParenCount++;
                        abort = true;
                    } else if (rowTokens[i].type == "paren.lparen")
                        abort = true;
                }
            }
            
            // add indent to code
            if (breakBefore && !is(token, "comment")) {
                var count = indent;
                if (inCase && !onCaseLine)
                    count++;
                    
                if (indentNextLine) {
                    count++;
                    indentNextLine = false;
                }
                
                for (i = 0; i < count; i++) {
                    code += tabString;
                }
            }
            
            // indent one line after if or else
            if (token.type === 'keyword' && ["if", "else", "elseif"].indexOf(value) !== -1)
                indentNextLine = true;
            
            // indent if there are more opening parens
            if (curRow != row && rowTokens) {
                for (i = rowTokens.length-1; i>=0; i--) {
                    if (rowTokens[i].type == "paren.rparen")
                        openParenCount -= (rowTokens[i].value.match(/[\)\}]/g) || []).length;
                    else if (rowTokens[i].type == "paren.lparen")
                        openParenCount += (rowTokens[i].value.match(/[\(\{]/g) || []).length;
                }
                
                if (openParenCount>0) {
                    indentNextLine = false;
                    indent++;
                }
            }
        
            code += value;
            breakBefore = false;
            
            // line break after opening block tag or doctype
            if (
                (is(token, "tag-close") && inBlock) || 
                (is(token, "doctype") && value=='>')
            ) {
                // hack to prevent linebreak if tag is immediately closed
                if (inBlock && nextToken && nextToken.value === '</')
                    rowsToAdd--;
                else
                    rowsToAdd++;
            }
            
            // indent after opening tag
            if (is(token, "tag-open") && value === '<' && singletonTags.indexOf(nextToken.value) === -1)
                indent++;
                
            // remove indent if unknown singleton
            if (is(token, "tag-close") && value === '/>' && singletonTags.indexOf(tagName) === -1)
                indent--;
            
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
