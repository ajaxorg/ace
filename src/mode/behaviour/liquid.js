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
                while (!token.type != 'meta.tag.punctuation.tag-open') {
                    token = iterator.stepBackward();
                    if (token.value == '{%') {
                        while(true) {
                            token = iterator.stepForward();

                            if (token.type === 'meta.tag.punctuation.tag-open') {
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
