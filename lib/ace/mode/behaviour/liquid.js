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
    
    var oop = require("../../lib/oop");
    var Behaviour = require("../behaviour").Behaviour;
    var XmlBehaviour = require("./xml").XmlBehaviour;
    var TokenIterator = require("../../token_iterator").TokenIterator;
    var lang = require("../../lib/lang");
    
    function is(token, type) {
        return token && token.type.lastIndexOf(type + ".xml") > -1;
    }
    
    var LiquidBehaviour = function () {
        XmlBehaviour.call(this);
        this.add("autoBraceTagClosing","insertion", function (state, action, editor, session, text) {
            if (text == '}') {
                var position = editor.getSelectionRange().start;
                var iterator = new TokenIterator(session, position.row, position.column);
                var token = iterator.getCurrentToken() || iterator.stepBackward();

                // exit if we're not in a tag
                if (!token || !( token.value.trim() === '%' || is(token, "tag-name") || is(token, "tag-whitespace") || is(token, "attribute-name") || is(token, "attribute-equals") || is(token, "attribute-value")))
                    return;
    
                // exit if we're inside of a quoted attribute value
                if (is(token, "reference.attribute-value"))
                    return;

                if (is(token, "attribute-value")) {
                    var tokenEndColumn = iterator.getCurrentTokenColumn() + token.value.length;
                    if (position.column < tokenEndColumn)
                        return;
                    if (position.column == tokenEndColumn) {
                        var nextToken = iterator.stepForward();
                        // TODO also handle non-closed string at the end of the line
                        if (nextToken && is(nextToken, "attribute-value"))
                            return;
                        iterator.stepBackward();
                    }
                }
                // exit if the tag is empty 
                if (/{%\s*%/.test(session.getLine(position.row))) return;
                if (/^\s*}/.test(session.getLine(position.row).slice(position.column)))
                    return;

                // find tag name
                while (!token.type != 'keyword.block') {
                    token = iterator.stepBackward();
                    if (token.value == '{%') {
                        while(true) {
                            token = iterator.stepForward();

                            if (token.type === 'keyword.block') {
                                break;
                            } else if (token.value.trim() == '%') {
                                token = null;
                                break;
                            }
                        }
                        break; 
                    }
                }
                if (!token ) return ;
                var tokenRow = iterator.getCurrentTokenRow();
                var tokenColumn = iterator.getCurrentTokenColumn();

                // exit if the tag is ending
                if (is(iterator.stepBackward(), "end-tag-open"))
                return;
                
                var element = token.value;
                if (tokenRow == position.row)
                    element = element.substring(0, position.column - tokenColumn);
    
                if (this.voidElements.hasOwnProperty(element.toLowerCase()))
                     return;
                return {
                   text: "}" + "{% end" + element + " %}",
                   selection: [1, 1]
                };
            }
        });
    
    };

    oop.inherits(LiquidBehaviour, Behaviour);
    
    exports.LiquidBehaviour = LiquidBehaviour;
    });
    