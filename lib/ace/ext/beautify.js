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
    var abort = false;
    var i;
    var indentNextLine = false;

    while (token !== null) {
        value = token.value;
        curRow = iterator.getCurrentTokenRow();
        rowTokens = iterator.$rowTokens;
        nextToken = iterator.stepForward();

        // html indentation
        if (is(token, "tag-open") && value === "</")
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
        if (token.type === "keyword" && value.match(/^(case|default)$/)) {
            onCaseLine = true;
            inCase = true;
        } else if (token.type === "keyword" && value === "break")
            inCase = false;

        // line break before closing tag unless we just had one
        if (is(token, "tag-open") && value === "</" && inBlock && !breakBefore)
            rowsToAdd++;

        // add rows
        if (curRow != row)
            rowsToAdd = curRow - row;

        if (rowsToAdd) {
            code = code.trimRight();
            for (; rowsToAdd > 0; rowsToAdd--)
                code += "\n";

            breakBefore = true;

            // trim value if not in a comment
            if (!inComment)
               value = value.trimLeft();
        }

        if (value) {
            // whitespace
            if (token.type === "keyword" && value.match(/^(if|else|elseif|for|while|switch)$/)) {
                value += " ";
                nextToken.value = nextToken.value.trim();

                // space before else, elseif
                if (!breakBefore && token.type === "keyword" && value.trim().match(/^(else|elseif)$/)) {
                    code = code.trimRight();
                    value = " "+value;
                }
            // trim value after opening paren
            } else if (token.type === "paren.lparen") {
                nextToken.value = nextToken.value.trim();

                // whitepace after {
                if (value.substr(-1) === "{") {
                    code = code.replace(/ +$/, "");
                    value = value + " ";
                }

                // ensure curly brace is preceeded by whitespace
                if (value.substr(0, 1) === "{" && !code.match(/\s$/))
                    value = " " + value;
            // remove space before closing paren
            } else if (token.type === "paren.rparen") {
                code = code.replace(/ +$/, "");

                // ensure curly brace is preceeded by whitespace
                if (value.substr(0, 1) === "}" && !code.match(/\s$/))
                    value = " " + value;
            // add spaces around conditional operators
            } else if ((token.type === "keyword.operator" || token.type === "keyword") && value.match(/^(=|==|===|!=|!==|&&|\|\||and|or|xor|\+=|.=|>|>=|<|<=)$/)) {
                code = code.trimRight();
                value = " " + value + " ";
                nextToken.value = nextToken.value.trim();
            } else if (token.type === "support.php_tag" && value === "?>" && !breakBefore) {
                code = code.trimRight();
                value = " " + value;
            }

            // unindent if first paren is closing
            if (curRow != row && rowTokens) {
                abort = false;
                for (i = 0; i<rowTokens.length && !abort; i++) {
                    if (rowTokens[i].type == "paren.rparen") {
                        indent--;
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

                for (i = 0; i < count; i++)
                    code += tabString;
            }

            // indent if there are last paren is opening
            if (curRow != row && rowTokens) {
                indentNextLine = null;
                abort = false;
                for (i = rowTokens.length-1; i>=0 && !abort; i--) {
                    if (rowTokens[i].type == "paren.rparen") {
                        abort = true;
                    } else if (rowTokens[i].type == "paren.lparen") {
                        indent++;
                        indentNextLine = false;
                        abort = true;
                    }
                }
            }

            // indent one line after if or else
            if (indentNextLine !== false && token.type === "keyword" && value.trim().match(/^(if|else|elseif|for|while)$/))
                indentNextLine = true;

            // add to code
            code += value;
            breakBefore = false;

            // line break after opening block tag or doctype
            if ((is(token, "tag-close") && inBlock) || (is(token, "doctype") && value==">")) {
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
