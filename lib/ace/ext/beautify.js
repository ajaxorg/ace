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
var TokenIterator = require("../token_iterator").TokenIterator;

function is(token, type) {
    return token.type.lastIndexOf(type + ".xml") > -1;
}

// do not indent after singleton tags or <html>
exports.singletonTags = ["area", "base", "br", "col", "command", "embed", "hr", "html", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"];

// insert a line break after block level tags
exports.blockTags = ["article", "aside", "blockquote", "body", "div", "dl", "fieldset", "footer", "form", "head", "header", "html", "nav", "ol", "p", "script", "section", "style", "table", "tbody", "tfoot", "thead", "ul"];

exports.beautify = function(session) {
    var iterator = new TokenIterator(session, 0, 0);
    var token = iterator.getCurrentToken();
    var tabString = session.getTabString();
    var singletonTags = exports.singletonTags;
    var blockTags = exports.blockTags;
    var nextToken;
    var breakBefore = false;
    var spaceBefore = false;
    var spaceAfter = false;
    var code = "";
    var value = "";
    var tagName = "";
    var depth = 0;
    var lastDepth = 0;
    var lastIndent = 0;
    var indent = 0;
    var unindent = false;
    var roundDepth = 0;
    var onCaseLine = false;
    var row;
    var curRow = 0;
    var rowsToAdd = 0;
    var rowTokens = [];
    var abort = false;
    var i;
    var indentNextLine = false;
    var inTag = false;
    var inCSS = false;
    var inBlock = false;
    var inCase = false;

    var trimNext = function() {
        if (nextToken && nextToken.value && nextToken.type !== 'string.regexp')
            nextToken.value = nextToken.value.trim();
    };

    var trimLine = function() {
        code = code.replace(/ +$/, "");
    };

    while (token !== null) {
        curRow = iterator.getCurrentTokenRow();
        rowTokens = iterator.$rowTokens;
        nextToken = iterator.stepForward();

        if (typeof token !== "undefined") {
            value = token.value;
            unindent = false;

            // mode
            inCSS = (tagName === "style" || session.$modeId === "ace/mode/css");

            // in tag
            if (is(token, "tag-open")) {
                inTag = true;

                // are we in a block tag
                if (nextToken)
                    inBlock = (blockTags.indexOf(nextToken.value) !== -1);

                // html indentation
                if (value === "</") {
                    // line break before closing tag unless we just had one
                    if (inBlock && !breakBefore && rowsToAdd < 1)
                        rowsToAdd++;

                    if (inCSS)
                        rowsToAdd = 1;

                    unindent = true;
                    inBlock = false;
                }
            } else if (is(token, "tag-close")) {
                inTag = false;
            // comments
            } else if (is(token, "comment.start")) {
                inBlock = true;
            } else if (is(token, "comment.end")) {
                inBlock = false;
            }

            // line break before }
            if (!inTag && !rowsToAdd && token.type === "paren.rparen" && token.value.substr(0, 1) === "}") {
                rowsToAdd++;
            }

            // switch case
            onCaseLine = false;
            if (token.type === "keyword" && value.match(/^(case|default)$/)) {
                onCaseLine = true;
                inCase = true;
            } else if (token.type === "keyword" && value === "break")
                inCase = false;

            // add rows
            if (curRow !== row) {
                rowsToAdd = curRow;

                if (row)
                    rowsToAdd -= row;
            }

            if (rowsToAdd) {
                code = code.trimRight();
                for (; rowsToAdd > 0; rowsToAdd--)
                    code += "\n";

                breakBefore = true;

                // trim value if not in a comment or string
                if (!is(token, "comment") && !token.type.match(/^(comment|string)$/))
                   value = value.trimLeft();
            }

            if (value) {
                // whitespace
                if (token.type === "keyword" && value.match(/^(if|else|elseif|for|while|switch)$/)) {
                    spaceAfter = true;
                    trimNext();

                    // space before else, elseif
                    if (value.match(/^(else|elseif)$/)) {
                        if (code.match(/\}[\s]*$/)) {
                            code = code.trimRight();
                            breakBefore = false;
                            spaceBefore = true;
                        }
                    }
                // trim value after opening paren
                } else if (token.type === "paren.lparen") {
                    trimNext();

                    // whitespace after {
                    if (value.substr(-1) === "{") {
                        spaceAfter = true;
                        indentNextLine = false;

                        if(!inTag)
                            rowsToAdd = 1;
                    }

                    // ensure curly brace is preceeded by whitespace
                    if (value.substr(0, 1) === "{") {
                        spaceBefore = true;

                        // collapse square and curly brackets together
                        if (code.substr(-1) !== '[' && code.trimRight().substr(-1) === '[') {
                            spaceBefore = false;
                            code = code.trim();
                            breakBefore = false;
                        } else if (code.trimRight().substr(-1) === ')') {
                            code = code.trimRight();
                            breakBefore = false;
                        } else {
                            trimLine();
                        }
                    }
                // remove space before closing paren
                } else if (token.type === "paren.rparen") {
                    // ensure curly brace is preceeded by whitespace
                    if (value.substr(0, 1) === "}") {
                        if (code.trimRight().substr(-1) === '{') {
                            breakBefore = false;
                            code = code.trimRight();
                        } else {
                            spaceBefore = true;

                            if (inCSS)
                                rowsToAdd+=2;
                        }
                    }

                    // collapse square and curly brackets together
                    if (value.substr(0, 1) === "]") {
                        if (code.substr(-1) !== '}' && code.trimRight().substr(-1) === '}') {
                            breakBefore = false;
                            spaceBefore = false;
                            indent++;
                            code = code.trimRight();
                        }
                    }

                    // collapse round brackets together
                    if (value.substr(0, 1) === ")") {
                        if (code.substr(-1) !== '(' && code.trimRight().substr(-1) === '(') {
                            breakBefore = false;
                            spaceBefore = false;
                            indent++;
                            code = code.trimRight();
                        }
                    }

                    trimLine();
                // add spaces around conditional operators
                } else if ((token.type === "keyword.operator" || token.type === "keyword") && value.match(/^(=|==|===|!=|!==|&&|\|\||and|or|xor|\+=|.=|>|>=|<|<=|=>)$/)) {
                    code = code.trimRight();
                    spaceBefore = true;
                    spaceAfter = true;
                    trimNext();
                // remove space before semicolon
                } else if (token.type === "punctuation.operator" && value === ';') {
                    code = code.trimRight();
                    spaceAfter = true;
                    trimNext();

                    if (inCSS)
                        rowsToAdd++;
                // space after colon or comma
                } else if (token.type === "punctuation.operator" && value.match(/^(:|,)$/)) {
                    code = code.trimRight();
                    spaceAfter = true;
                    trimNext();
                // ensure space before php closing tag
                } else if (token.type === "support.php_tag" && value === "?>" && !breakBefore) {
                    code = code.trimRight();
                    spaceBefore = true;
                // remove excess space before HTML attribute
                } else if (is(token, "attribute-name") && code.substr(-1).match(/^\s$/)) {
                    spaceBefore = true;
                // remove space around attribute equals
                } else if (is(token, "attribute-equals")) {
                    trimLine();
                    trimNext();
                // remove space before HTML closing tag
                } else if (is(token, "tag-close")) {
                    trimLine();
                    if(value === "/>")
                        spaceBefore = true;
                }

                // unindent after paren
                if (token.type === "paren.rparen")
                    unindent = true;

                // add indent to code unless multiline string or comment
                if (breakBefore && !(token.type.match(/^(comment)$/) && !value.substr(0, 1).match(/^[/#]$/)) && !(token.type.match(/^(string)$/) && !value.substr(0, 1).match(/^['"]$/))) {

                    indent = lastIndent;

                    if(depth > lastDepth)
                        indent++;
                    else if(depth < lastDepth)
                        indent--;

                    lastDepth = depth;
                    lastIndent = indent;

                    if(unindent)
                        indent--;

                    if (inCase && !onCaseLine)
                        indent++;

                    if (indentNextLine && !roundDepth) {
                        indent++;
                        indentNextLine = false;
                    }

                    for (i = 0; i < indent; i++)
                        code += tabString;
                }

                // indent one line after if or else
                if (token.type === "paren.lparen") {
                    roundDepth += (value.match(/\(/g) || []).length;
                    depth += value.length;
                }

                if (token.type === "keyword" && value.match(/^(if|else|elseif|for|while)$/)) {
                    indentNextLine = true;
                    roundDepth = 0;
                } else if (!roundDepth && value.trim() && token.type !== "comment")
                    indentNextLine = false;

                if (token.type === "paren.rparen") {
                    roundDepth -= (value.match(/\)/g) || []).length;
                    depth -= value.length;
                }

                // add to code
                if (spaceBefore && !breakBefore) {
                    trimLine();
                    if (code.substr(-1) !== "\n")
                        code += " ";
                }

                code += value;

                if (spaceAfter)
                    code += " ";

                breakBefore = false;
                spaceBefore = false;
                spaceAfter = false;

                // line break after block tag or doctype
                if ((is(token, "tag-close") && (inBlock || blockTags.indexOf(tagName) !== -1)) || (is(token, "doctype") && value === ">")) {
                    // undo linebreak if tag is immediately closed
                    if (inBlock && nextToken && nextToken.value === "</")
                        rowsToAdd = -1;
                    else
                        rowsToAdd = 1;
                }

                // html indentation
                if (is(token, "tag-open") && value === "</") {
                    depth--;
                // indent after opening tag
                } else if (is(token, "tag-open") && value === "<" && singletonTags.indexOf(nextToken.value) === -1) {
                    depth++;
                // remove indent if unknown singleton
                } else if (is(token, "tag-name")) {
                    tagName = value;
                } else if (is(token, "tag-close") && value === "/>" && singletonTags.indexOf(tagName) === -1){
                    depth--;
                }

                row = curRow;
            }
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
