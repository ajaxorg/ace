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
    var indent = 0;
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
        if (nextToken && nextToken.value)
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

            // mode
            inCSS = (tagName === "style" || session.$modeId === "ace/mode/css");

            // in tag
            if (is(token, "tag-open"))
                inTag = true;

            if (is(token, "tag-close"))
                inTag = false;

            // are we in a block tag
            if (is(token, "tag-open") && value === "<" && nextToken)
                inBlock = (blockTags.indexOf(nextToken.value) !== -1);

            // comments
            if (is(token, "comment.start"))
                inBlock = true;
            else if (is(token, "comment.end"))
                inBlock = false;

            // html indentation
            if (is(token, "tag-open") && value === "</") {
                // line break before closing tag unless we just had one
                if (is(token, "tag-open") && value === "</" && inBlock && !breakBefore)
                    rowsToAdd++;

                if (inCSS)
                    rowsToAdd = 1;

                indent--;
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
            if (curRow != row) {
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
                    if (token.type === "keyword" && value.match(/^(else|elseif)$/)) {
                        if (code.match(/\}[\s]*$/)) {
                            code = code.trimRight();
                            breakBefore = false;
                            spaceBefore = true;
                        }
                    }
                // trim value after opening paren
                } else if (token.type === "paren.lparen") {
                    trimNext();

                    // no one off indent after {
                    if (value.indexOf("{") > -1)
                        indentNextLine = false;

                    // whitespace after {
                    if (value.substr(-1) === "{")
                        spaceAfter = true;

                    // ensure curly brace is preceeded by whitespace
                    if (value.substr(0, 1) === "{") {
                        spaceBefore = true;
                        breakBefore = false;

                        // collapse square and curly brackets together
                        if (code.substr(-1) !== '[' && code.trimRight().substr(-1) === '[') {
                            spaceBefore = false;
                            indent--;
                        }

                        code = code.trimRight();
                    }
                // remove space before closing paren
                } else if (token.type === "paren.rparen") {
                    // ensure curly brace is preceeded by whitespace
                    if (value.substr(0, 1) === "}") {
                        spaceBefore = true;
                        if (inCSS) {
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

                    trimLine();
                // add spaces around conditional operators
                } else if ((token.type === "keyword.operator" || token.type === "keyword") && value.match(/^(=|==|===|!=|!==|&&|\|\||and|or|xor|\+=|.=|>|>=|<|<=)$/)) {
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
                if (token.type === "paren.rparen") {
                    indent -= value.replace(/\}]/g, ')').length;
                }

                // add indent to code unless in multiline string or comment
                if (breakBefore && !(token.type.match(/^(comment)$/) && !value.substr(0, 1).match(/^[/#]$/)) && !(token.type.match(/^(string)$/) && !value.substr(0, 1).matc
                    var count = indent;
                    if (inCase && !onCaseLine)
                        count++;

                    if (indentNextLine) {
                        count++;
                        indentNextLine = false;
                    }

                    for (i = 0; i < count; i++)
                        code += tabString;
                }

                // indent after paren
                if (token.type === "paren.lparen") {
                    indent += value.replace(/\[{/g, '(').length;
                }

                // indent one line after if or else
                if (token.type === "keyword" && value.match(/^(if|else|elseif|for|while)$/))
                    indentNextLine = true;

                // add to code
                if (spaceBefore && !breakBefore) {
                    trimLine();
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
                        rowsToAdd--;
                    else
                        rowsToAdd++;
                }

                // indent after opening tag
                if (is(token, "tag-open") && value === "<" && singletonTags.indexOf(nextToken.value) === -1)
                    indent++;

                // remove indent if unknown singleton
                if (is(token, "tag-name"))
                    tagName = value;

                if (is(token, "tag-close") && value === "/>" && singletonTags.indexOf(tagName) === -1)
                    indent--;

                // line break after {
                if (!inTag && token.type === "paren.lparen" && value.substr(-1) === "{") {
                    rowsToAdd++;
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
