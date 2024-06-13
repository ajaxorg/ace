"use strict";
var oop = require("../../lib/oop");
var Behaviour = require("../behaviour").Behaviour;
var TokenIterator = require("../../token_iterator").TokenIterator;
var lang = require("../../lib/lang");

var SAFE_INSERT_IN_TOKENS =
    ["text", "paren.rparen", "rparen", "paren", "punctuation.operator"];
var SAFE_INSERT_BEFORE_TOKENS =
    ["text", "paren.rparen", "rparen", "paren", "punctuation.operator", "comment"];

var context;
var contextCache = {};
var defaultQuotes = {'"' : '"', "'" : "'"};

var initContext = function(editor) {
    var id = -1;
    if (editor.multiSelect) {
        id = editor.selection.index;
        if (contextCache.rangeCount != editor.multiSelect.rangeCount)
            contextCache = {rangeCount: editor.multiSelect.rangeCount};
    }
    if (contextCache[id])
        return context = contextCache[id];
    context = contextCache[id] = {
        autoInsertedBrackets: 0,
        autoInsertedRow: -1,
        autoInsertedLineEnd: "",
        maybeInsertedBrackets: 0,
        maybeInsertedRow: -1,
        maybeInsertedLineStart: "",
        maybeInsertedLineEnd: ""
    };
};

var getWrapped = function(selection, selected, opening, closing) {
    var rowDiff = selection.end.row - selection.start.row;
    return {
        text: opening + selected + closing,
        selection: [
                0,
                selection.start.column + 1,
                rowDiff,
                selection.end.column + (rowDiff ? 0 : 1)
            ]
    };
};
/**
 * Creates a new Cstyle behaviour object with the specified options.
 * @constructor
 * @param {Object} [options] - The options for the Cstyle behaviour object.
 * @param {boolean} [options.braces] - Whether to force braces auto-pairing.
 * @param {boolean} [options.closeDocComment] - enables automatic insertion of closing tags for documentation comments.
 */
var CstyleBehaviour;
CstyleBehaviour = function(options) {
    options = options || {};
    this.add("braces", "insertion", function(state, action, editor, session, text) {
        var cursor = editor.getCursorPosition();
        var line = session.doc.getLine(cursor.row);
        if (text == '{') {
            initContext(editor);
            var selection = editor.getSelectionRange();
            var selected = session.doc.getTextRange(selection);
            var token = session.getTokenAt(cursor.row, cursor.column);
            if (selected !== "" && selected !== "{" && editor.getWrapBehavioursEnabled()) {
                return getWrapped(selection, selected, '{', '}');
            }
            else if (token && /(?:string)\.quasi|\.xml/.test(token.type)) {
                let excludeTokens = [
                    /tag\-(?:open|name)/, /attribute\-name/
                ];
                if (excludeTokens.some((el) => el.test(token.type)) || /(string)\.quasi/.test(token.type)
                    && token.value[cursor.column - token.start - 1] !== '$') return;

                CstyleBehaviour.recordAutoInsert(editor, session, "}");
                return {
                    text: '{}',
                    selection: [1, 1]
                };
            } else if (CstyleBehaviour.isSaneInsertion(editor, session)) {
                if (/[\]\}\)]/.test(line[cursor.column]) || editor.inMultiSelectMode || options.braces) {
                    CstyleBehaviour.recordAutoInsert(editor, session, "}");
                    return {
                        text: '{}',
                        selection: [1, 1]
                    };
                } else {
                    CstyleBehaviour.recordMaybeInsert(editor, session, "{");
                    return {
                        text: '{',
                        selection: [1, 1]
                    };
                }
            }
        } else if (text == '}') {
            initContext(editor);
            var rightChar = line.substring(cursor.column, cursor.column + 1);
            if (rightChar == '}') {
                var matching = session.$findOpeningBracket('}', {column: cursor.column + 1, row: cursor.row});
                if (matching !== null && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) {
                    CstyleBehaviour.popAutoInsertedClosing();
                    return {
                        text: '',
                        selection: [1, 1]
                    };
                }
            }
        } else if (text == "\n" || text == "\r\n") {
            initContext(editor);
            var closing = "";
            if (CstyleBehaviour.isMaybeInsertedClosing(cursor, line)) {
                closing = lang.stringRepeat("}", context.maybeInsertedBrackets);
                CstyleBehaviour.clearMaybeInsertedClosing();
            }
            var rightChar = line.substring(cursor.column, cursor.column + 1);
            if (rightChar === '}') {
                var openBracePos = session.findMatchingBracket({row: cursor.row, column: cursor.column+1}, '}');
                if (!openBracePos)
                     return null;
                var next_indent = this.$getIndent(session.getLine(openBracePos.row));
            } else if (closing) {
                var next_indent = this.$getIndent(line);
            } else {
                CstyleBehaviour.clearMaybeInsertedClosing();
                return;
            }
            var indent = next_indent + session.getTabString();

            return {
                text: '\n' + indent + '\n' + next_indent + closing,
                selection: [1, indent.length, 1, indent.length]
            };
        } else {
            CstyleBehaviour.clearMaybeInsertedClosing();
        }
    });

    this.add("braces", "deletion", function(state, action, editor, session, range) {
        var selected = session.doc.getTextRange(range);
        if (!range.isMultiLine() && selected == '{') {
            initContext(editor);
            var line = session.doc.getLine(range.start.row);
            var rightChar = line.substring(range.end.column, range.end.column + 1);
            if (rightChar == '}') {
                range.end.column++;
                return range;
            } else {
                context.maybeInsertedBrackets--;
            }
        }
    });

    this.add("parens", "insertion", function(state, action, editor, session, text) {
        if (text == '(') {
            initContext(editor);
            var selection = editor.getSelectionRange();
            var selected = session.doc.getTextRange(selection);
            if (selected !== "" && editor.getWrapBehavioursEnabled()) {
                return getWrapped(selection, selected, '(', ')');
            } else if (CstyleBehaviour.isSaneInsertion(editor, session)) {
                CstyleBehaviour.recordAutoInsert(editor, session, ")");
                return {
                    text: '()',
                    selection: [1, 1]
                };
            }
        } else if (text == ')') {
            initContext(editor);
            var cursor = editor.getCursorPosition();
            var line = session.doc.getLine(cursor.row);
            var rightChar = line.substring(cursor.column, cursor.column + 1);
            if (rightChar == ')') {
                var matching = session.$findOpeningBracket(')', {column: cursor.column + 1, row: cursor.row});
                if (matching !== null && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) {
                    CstyleBehaviour.popAutoInsertedClosing();
                    return {
                        text: '',
                        selection: [1, 1]
                    };
                }
            }
        }
    });

    this.add("parens", "deletion", function(state, action, editor, session, range) {
        var selected = session.doc.getTextRange(range);
        if (!range.isMultiLine() && selected == '(') {
            initContext(editor);
            var line = session.doc.getLine(range.start.row);
            var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
            if (rightChar == ')') {
                range.end.column++;
                return range;
            }
        }
    });

    this.add("brackets", "insertion", function(state, action, editor, session, text) {
        if (text == '[') {
            initContext(editor);
            var selection = editor.getSelectionRange();
            var selected = session.doc.getTextRange(selection);
            if (selected !== "" && editor.getWrapBehavioursEnabled()) {
                return getWrapped(selection, selected, '[', ']');
            } else if (CstyleBehaviour.isSaneInsertion(editor, session)) {
                CstyleBehaviour.recordAutoInsert(editor, session, "]");
                return {
                    text: '[]',
                    selection: [1, 1]
                };
            }
        } else if (text == ']') {
            initContext(editor);
            var cursor = editor.getCursorPosition();
            var line = session.doc.getLine(cursor.row);
            var rightChar = line.substring(cursor.column, cursor.column + 1);
            if (rightChar == ']') {
                var matching = session.$findOpeningBracket(']', {column: cursor.column + 1, row: cursor.row});
                if (matching !== null && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) {
                    CstyleBehaviour.popAutoInsertedClosing();
                    return {
                        text: '',
                        selection: [1, 1]
                    };
                }
            }
        }
    });

    this.add("brackets", "deletion", function(state, action, editor, session, range) {
        var selected = session.doc.getTextRange(range);
        if (!range.isMultiLine() && selected == '[') {
            initContext(editor);
            var line = session.doc.getLine(range.start.row);
            var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
            if (rightChar == ']') {
                range.end.column++;
                return range;
            }
        }
    });

    this.add("string_dquotes", "insertion", function(state, action, editor, session, text) {
        var quotes = session.$mode.$quotes || defaultQuotes;
        if (text.length == 1 && quotes[text]) {
            if (this.lineCommentStart && this.lineCommentStart.indexOf(text) != -1) 
                return;
            initContext(editor);
            var quote = text;
            var selection = editor.getSelectionRange();
            var selected = session.doc.getTextRange(selection);
            if (selected !== "" && (selected.length != 1 || !quotes[selected]) && editor.getWrapBehavioursEnabled()) {
                return getWrapped(selection, selected, quote, quote);
            } else if (!selected) {
                var cursor = editor.getCursorPosition();
                var line = session.doc.getLine(cursor.row);
                var leftChar = line.substring(cursor.column-1, cursor.column);
                var rightChar = line.substring(cursor.column, cursor.column + 1);
                
                var token = session.getTokenAt(cursor.row, cursor.column);
                var rightToken = session.getTokenAt(cursor.row, cursor.column + 1);
                // We're escaped.
                if (leftChar == "\\" && token && /escape/.test(token.type))
                    return null;
                
                var stringBefore = token && /string|escape/.test(token.type);
                var stringAfter = !rightToken || /string|escape/.test(rightToken.type);
                
                var pair;
                if (rightChar == quote) {
                    pair = stringBefore !== stringAfter;
                    if (pair && /string\.end/.test(rightToken.type))
                        pair = false;
                } else {
                    if (stringBefore && !stringAfter)
                        return null; // wrap string with different quote
                    if (stringBefore && stringAfter)
                        return null; // do not pair quotes inside strings
                    var wordRe = session.$mode.tokenRe;
                    wordRe.lastIndex = 0;
                    var isWordBefore = wordRe.test(leftChar);
                    wordRe.lastIndex = 0;
                    var isWordAfter = wordRe.test(rightChar);

                    var pairQuotesAfter = session.$mode.$pairQuotesAfter;
                    var shouldPairQuotes = pairQuotesAfter && pairQuotesAfter[quote] && pairQuotesAfter[quote].test(leftChar);
                    
                    if ((!shouldPairQuotes && isWordBefore) || isWordAfter)
                        return null; // before or after alphanumeric
                    if (rightChar && !/[\s;,.})\]\\]/.test(rightChar))
                        return null; // there is rightChar and it isn't closing
                    var charBefore = line[cursor.column - 2];
                    if (leftChar == quote &&  (charBefore == quote || wordRe.test(charBefore)))
                        return null;
                    pair = true;
                }
                return {
                    text: pair ? quote + quote : "",
                    selection: [1,1]
                };
            }
        }
    });

    this.add("string_dquotes", "deletion", function(state, action, editor, session, range) {
        var quotes = session.$mode.$quotes || defaultQuotes;

        var selected = session.doc.getTextRange(range);
        if (!range.isMultiLine() && quotes.hasOwnProperty(selected)) {
            initContext(editor);
            var line = session.doc.getLine(range.start.row);
            var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
            if (rightChar == selected) {
                range.end.column++;
                return range;
            }
        }
    });
    
    if (options.closeDocComment !== false) {
        this.add("doc comment end", "insertion", function (state, action, editor, session, text) {
            if (state === "doc-start" && (text === "\n" || text === "\r\n") && editor.selection.isEmpty()) {
                var cursor = editor.getCursorPosition();
                if (cursor.column === 0) {
                    return;
                }
                var line = session.doc.getLine(cursor.row);
                var nextLine = session.doc.getLine(cursor.row + 1);
                var tokens = session.getTokens(cursor.row);
                var index = 0;
                for (var i = 0; i < tokens.length; i++) {
                    index += tokens[i].value.length;
                    var currentToken = tokens[i];
                    if (index >= cursor.column) {
                        if (index === cursor.column) {
                            if (!/\.doc/.test(currentToken.type)) {
                                return;
                            }
                            if (/\*\//.test(currentToken.value)) {
                                var nextToken = tokens[i + 1];
                                if (!nextToken || !/\.doc/.test(nextToken.type)) {
                                    return;
                                }
                            }
                        }
                        var cursorPosInToken = cursor.column - (index - currentToken.value.length);

                        // Check for the pattern `*/` followed by `/**` within the token
                        var closeDocPos = currentToken.value.indexOf("*/");
                        var openDocPos = currentToken.value.indexOf("/**", closeDocPos > - 1 ? closeDocPos + 2 : 0);
                        
                        if (openDocPos !== -1 && cursorPosInToken > openDocPos && cursorPosInToken < openDocPos + 3) {
                            return;
                        }
                        if (closeDocPos !== -1 && openDocPos !== -1 && cursorPosInToken >= closeDocPos
                            && cursorPosInToken <= openDocPos || !/\.doc/.test(currentToken.type)) {
                            return;
                        }
                        break;
                    }
                }
                var indent = this.$getIndent(line);
                if (/\s*\*/.test(nextLine)) {
                    if (/^\s*\*/.test(line)) {
                        return {
                            text: text + indent + "* ",
                            selection: [1, 2 + indent.length, 1, 2 + indent.length]
                        };
                    }
                    else {
                        return {
                            text: text + indent + " * ",
                            selection: [1, 3 + indent.length, 1, 3 + indent.length]
                        };
                    }

                }
                if (/\/\*\*/.test(line.substring(0, cursor.column))) {
                    return {
                        text: text + indent + " * " + text + " " + indent + "*/",
                        selection: [1, 4 + indent.length, 1, 4 + indent.length]
                    };
                }
            }
        });
    }
};

/**
 * @this {CstyleBehaviour}
 */
// @ts-ignore
CstyleBehaviour.isSaneInsertion = function(editor, session) {
    var cursor = editor.getCursorPosition();
    var iterator = new TokenIterator(session, cursor.row, cursor.column);
    
    // Don't insert in the middle of a keyword/identifier/lexical
    if (!this.$matchTokenType(iterator.getCurrentToken() || "text", SAFE_INSERT_IN_TOKENS)) {
        if (/[)}\]]/.test(editor.session.getLine(cursor.row)[cursor.column]))
            return true;
        // Look ahead in case we're at the end of a token
        var iterator2 = new TokenIterator(session, cursor.row, cursor.column + 1);
        if (!this.$matchTokenType(iterator2.getCurrentToken() || "text", SAFE_INSERT_IN_TOKENS))
            return false;
    }
    
    // Only insert in front of whitespace/comments
    iterator.stepForward();
    return iterator.getCurrentTokenRow() !== cursor.row ||
        this.$matchTokenType(iterator.getCurrentToken() || "text", SAFE_INSERT_BEFORE_TOKENS);
};
CstyleBehaviour["$matchTokenType"] = function(token, types) {
    return types.indexOf(token.type || token) > -1;
};

CstyleBehaviour["recordAutoInsert"] = function(editor, session, bracket) {
    var cursor = editor.getCursorPosition();
    var line = session.doc.getLine(cursor.row);
    // Reset previous state if text or context changed too much
    if (!this["isAutoInsertedClosing"](cursor, line, context.autoInsertedLineEnd[0]))
        context.autoInsertedBrackets = 0;
    context.autoInsertedRow = cursor.row;
    context.autoInsertedLineEnd = bracket + line.substr(cursor.column);
    context.autoInsertedBrackets++;
};

CstyleBehaviour["recordMaybeInsert"] = function(editor, session, bracket) {
    var cursor = editor.getCursorPosition();
    var line = session.doc.getLine(cursor.row);
    if (!this["isMaybeInsertedClosing"](cursor, line))
        context.maybeInsertedBrackets = 0;
    context.maybeInsertedRow = cursor.row;
    context.maybeInsertedLineStart = line.substr(0, cursor.column) + bracket;
    context.maybeInsertedLineEnd = line.substr(cursor.column);
    context.maybeInsertedBrackets++;
};

CstyleBehaviour["isAutoInsertedClosing"] = function(cursor, line, bracket) {
    return context.autoInsertedBrackets > 0 &&
        cursor.row === context.autoInsertedRow &&
        bracket === context.autoInsertedLineEnd[0] &&
        line.substr(cursor.column) === context.autoInsertedLineEnd;
};

CstyleBehaviour["isMaybeInsertedClosing"] = function(cursor, line) {
    return context.maybeInsertedBrackets > 0 &&
        cursor.row === context.maybeInsertedRow &&
        line.substr(cursor.column) === context.maybeInsertedLineEnd &&
        line.substr(0, cursor.column) == context.maybeInsertedLineStart;
};

CstyleBehaviour["popAutoInsertedClosing"] = function() {
    context.autoInsertedLineEnd = context.autoInsertedLineEnd.substr(1);
    context.autoInsertedBrackets--;
};

CstyleBehaviour["clearMaybeInsertedClosing"] = function() {
    if (context) {
        context.maybeInsertedBrackets = 0;
        context.maybeInsertedRow = -1;
    }
};



oop.inherits(CstyleBehaviour, Behaviour);

exports.CstyleBehaviour = CstyleBehaviour;
