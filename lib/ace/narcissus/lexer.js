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

/*
 * Narcissus - JS implemented in JS.
 *
 * Lexical scanner.
 */

 define(function(require, exports, module) {

var definitions = require('./definitions');

// Set constants in the local scope.
eval(definitions.consts);

// Build up a trie of operator tokens.
var opTokens = {};
for (var op in definitions.opTypeNames) {
    if (op === '\n' || op === '.')
        continue;

    var node = opTokens;
    for (var i = 0; i < op.length; i++) {
        var ch = op[i];
        if (!(ch in node))
            node[ch] = {};
        node = node[ch];
        node.op = op;
    }
}

/*
 * Since JavaScript provides no convenient way to determine if a
 * character is in a particular Unicode category, we use
 * metacircularity to accomplish this (oh yeaaaah!)
 */
function isValidIdentifierChar(ch, first) {
    // check directly for ASCII
    if (ch <= "\u007F") {
        if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '$' || ch === '_' ||
            (!first && (ch >= '0' && ch <= '9'))) {
            return true;
        }
        return false;
    }

    // create an object to test this in
    var x = {};
    x["x"+ch] = true;
    x[ch] = true;

    // then use eval to determine if it's a valid character
    var valid = false;
    try {
        valid = (Function("x", "return (x." + (first?"":"x") + ch + ");")(x) === true);
    } catch (ex) {}

    return valid;
}

function isIdentifier(str) {
    if (typeof str !== "string")
        return false;

    if (str.length === 0)
        return false;

    if (!isValidIdentifierChar(str[0], true))
        return false;

    for (var i = 1; i < str.length; i++) {
        if (!isValidIdentifierChar(str[i], false))
            return false;
    }

    return true;
}

/*
 * Tokenizer :: (source, filename, line number, boolean) -> Tokenizer
 */
function Tokenizer(s, f, l, allowHTMLComments) {
    this.cursor = 0;
    this.source = String(s);
    this.tokens = [];
    this.tokenIndex = 0;
    this.lookahead = 0;
    this.scanNewlines = false;
    this.filename = f || "";
    this.lineno = l || 1;
    this.allowHTMLComments = allowHTMLComments;
    this.blockComments = null;
}

Tokenizer.prototype = {
    get done() {
        // We need to set scanOperand to true here because the first thing
        // might be a regexp.
        return this.peek(true) === END;
    },

    get token() {
        return this.tokens[this.tokenIndex];
    },

    match: function (tt, scanOperand, keywordIsName) {
        return this.get(scanOperand, keywordIsName) === tt || this.unget();
    },

    mustMatch: function (tt, keywordIsName) {
        if (!this.match(tt, false, keywordIsName)) {
            throw this.newSyntaxError("Missing " +
                                      definitions.tokens[tt].toLowerCase());
        }
        return this.token;
    },

    peek: function (scanOperand) {
        var tt, next;
        if (this.lookahead) {
            next = this.tokens[(this.tokenIndex + this.lookahead) & 3];
            tt = (this.scanNewlines && next.lineno !== this.lineno)
                ? NEWLINE
                : next.type;
        } else {
            tt = this.get(scanOperand);
            this.unget();
        }
        return tt;
    },

    peekOnSameLine: function (scanOperand) {
        this.scanNewlines = true;
        var tt = this.peek(scanOperand);
        this.scanNewlines = false;
        return tt;
    },

    lastBlockComment: function() {
        var length = this.blockComments.length;
        return length ? this.blockComments[length - 1] : null;
    },

    // Eat comments and whitespace.
    skip: function () {
        var input = this.source;
        this.blockComments = [];
        for (;;) {
            var ch = input[this.cursor++];
            var next = input[this.cursor];
            // handle \r, \r\n and (always preferable) \n
            if (ch === '\r') {
                // if the next character is \n, we don't care about this at all
                if (next === '\n') continue;

                // otherwise, we want to consider this as a newline
                ch = '\n';
            }

            if (ch === '\n' && !this.scanNewlines) {
                this.lineno++;
            } else if (ch === '/' && next === '*') {
                var commentStart = ++this.cursor;
                for (;;) {
                    ch = input[this.cursor++];
                    if (ch === undefined)
                        throw this.newSyntaxError("Unterminated comment");

                    if (ch === '*') {
                        next = input[this.cursor];
                        if (next === '/') {
                            var commentEnd = this.cursor - 1;
                            this.cursor++;
                            break;
                        }
                    } else if (ch === '\n') {
                        this.lineno++;
                    }
                }
                this.blockComments.push(input.substring(commentStart, commentEnd));
            } else if ((ch === '/' && next === '/') ||
                       (this.allowHTMLComments && ch === '<' && next === '!' &&
                        input[this.cursor + 1] === '-' && input[this.cursor + 2] === '-' &&
                        (this.cursor += 2))) {
                this.cursor++;
                for (;;) {
                    ch = input[this.cursor++];
                    next = input[this.cursor];
                    if (ch === undefined)
                        return;

                    if (ch === '\r') {
                        // check for \r\n
                        if (next !== '\n') ch = '\n';
                    }

                    if (ch === '\n') {
                        if (this.scanNewlines) {
                            this.cursor--;
                        } else {
                            this.lineno++;
                        }
                        break;
                    }
                }
            } else if (!(ch in definitions.whitespace)) {
                this.cursor--;
                return;
            }
        }
    },

    // Lex the exponential part of a number, if present. Return true iff an
    // exponential part was found.
    lexExponent: function() {
        var input = this.source;
        var next = input[this.cursor];
        if (next === 'e' || next === 'E') {
            this.cursor++;
            ch = input[this.cursor++];
            if (ch === '+' || ch === '-')
                ch = input[this.cursor++];

            if (ch < '0' || ch > '9')
                throw this.newSyntaxError("Missing exponent");

            do {
                ch = input[this.cursor++];
            } while (ch >= '0' && ch <= '9');
            this.cursor--;

            return true;
        }

        return false;
    },

    lexZeroNumber: function (ch) {
        var token = this.token, input = this.source;
        token.type = NUMBER;

        ch = input[this.cursor++];
        if (ch === '.') {
            do {
                ch = input[this.cursor++];
            } while (ch >= '0' && ch <= '9');
            this.cursor--;

            this.lexExponent();
            token.value = parseFloat(
                input.substring(token.start, this.cursor));
        } else if (ch === 'x' || ch === 'X') {
            do {
                ch = input[this.cursor++];
            } while ((ch >= '0' && ch <= '9') || (ch >= 'a' && ch <= 'f') ||
                     (ch >= 'A' && ch <= 'F'));
            this.cursor--;

            token.value = parseInt(input.substring(token.start, this.cursor));
        } else if (ch >= '0' && ch <= '7') {
            do {
                ch = input[this.cursor++];
            } while (ch >= '0' && ch <= '7');
            this.cursor--;

            token.value = parseInt(input.substring(token.start, this.cursor));
        } else {
            this.cursor--;
            this.lexExponent();     // 0E1, &c.
            token.value = 0;
        }
    },

    lexNumber: function (ch) {
        var token = this.token, input = this.source;
        token.type = NUMBER;

        var floating = false;
        do {
            ch = input[this.cursor++];
            if (ch === '.' && !floating) {
                floating = true;
                ch = input[this.cursor++];
            }
        } while (ch >= '0' && ch <= '9');

        this.cursor--;

        var exponent = this.lexExponent();
        floating = floating || exponent;

        var str = input.substring(token.start, this.cursor);
        token.value = floating ? parseFloat(str) : parseInt(str);
    },

    lexDot: function (ch) {
        var token = this.token, input = this.source;
        var next = input[this.cursor];
        if (next >= '0' && next <= '9') {
            do {
                ch = input[this.cursor++];
            } while (ch >= '0' && ch <= '9');
            this.cursor--;

            this.lexExponent();

            token.type = NUMBER;
            token.value = parseFloat(
                input.substring(token.start, this.cursor));
        } else {
            token.type = DOT;
            token.assignOp = null;
            token.value = '.';
        }
    },

    lexString: function (ch) {
        var token = this.token, input = this.source;
        token.type = STRING;

        var hasEscapes = false;
        var delim = ch;
        if (input.length <= this.cursor)
            throw this.newSyntaxError("Unterminated string literal");
        while ((ch = input[this.cursor++]) !== delim) {
            if (ch == '\n' || ch == '\r')
                throw this.newSyntaxError("Unterminated string literal");
            if (this.cursor == input.length)
                throw this.newSyntaxError("Unterminated string literal");
            if (ch === '\\') {
                hasEscapes = true;
                if (++this.cursor == input.length)
                    throw this.newSyntaxError("Unterminated string literal");
            }
        }

        token.value = hasEscapes
            ? eval(input.substring(token.start, this.cursor))
            : input.substring(token.start + 1, this.cursor - 1);
    },

    lexRegExp: function (ch) {
        var token = this.token, input = this.source;
        token.type = REGEXP;

        do {
            ch = input[this.cursor++];
            if (ch === '\\') {
                this.cursor++;
            } else if (ch === '[') {
                do {
                    if (ch === undefined)
                        throw this.newSyntaxError("Unterminated character class");

                    if (ch === '\\')
                        this.cursor++;

                    ch = input[this.cursor++];
                } while (ch !== ']');
            } else if (ch === undefined) {
                throw this.newSyntaxError("Unterminated regex");
            }
        } while (ch !== '/');

        do {
            ch = input[this.cursor++];
        } while (ch >= 'a' && ch <= 'z');

        this.cursor--;

        token.value = eval(input.substring(token.start, this.cursor));
    },

    lexOp: function (ch) {
        var token = this.token, input = this.source;

        // A bit ugly, but it seems wasteful to write a trie lookup routine
        // for only 3 characters...
        var node = opTokens[ch];
        var next = input[this.cursor];
        if (next in node) {
            node = node[next];
            this.cursor++;
            next = input[this.cursor];
            if (next in node) {
                node = node[next];
                this.cursor++;
                next = input[this.cursor];
            }
        }

        var op = node.op;
        if (definitions.assignOps[op] && input[this.cursor] === '=') {
            this.cursor++;
            token.type = ASSIGN;
            token.assignOp = definitions.tokenIds[definitions.opTypeNames[op]];
            op += '=';
        } else {
            token.type = definitions.tokenIds[definitions.opTypeNames[op]];
            token.assignOp = null;
        }

        token.value = op;
    },

    // FIXME: Unicode escape sequences
    lexIdent: function (ch, keywordIsName) {
        var token = this.token;
        var id = ch;

        while ((ch = this.getValidIdentifierChar(false)) !== null) {
            id += ch;
        }

        token.type = IDENTIFIER;
        token.value = id;

        if (keywordIsName)
            return;

        var kw;

        if (this.parser.mozillaMode) {
            kw = definitions.mozillaKeywords[id];
            if (kw) {
                token.type = kw;
                return;
            }
        }

        if (this.parser.x.strictMode) {
            kw = definitions.strictKeywords[id];
            if (kw) {
                token.type = kw;
                return;
            }
        }

        kw = definitions.keywords[id];
        if (kw)
            token.type = kw;
    },

    /*
     * Tokenizer.get :: ([boolean[, boolean]]) -> token type
     *
     * Consume input *only* if there is no lookahead.
     * Dispatch to the appropriate lexing function depending on the input.
     */
    get: function (scanOperand, keywordIsName) {
        var token;
        while (this.lookahead) {
            --this.lookahead;
            this.tokenIndex = (this.tokenIndex + 1) & 3;
            token = this.tokens[this.tokenIndex];
            if (token.type !== NEWLINE || this.scanNewlines)
                return token.type;
        }

        this.skip();

        this.tokenIndex = (this.tokenIndex + 1) & 3;
        token = this.tokens[this.tokenIndex];
        if (!token)
            this.tokens[this.tokenIndex] = token = {};

        var input = this.source;
        if (this.cursor >= input.length)
            return token.type = END;

        token.start = this.cursor;
        token.lineno = this.lineno;

        var ich = this.getValidIdentifierChar(true);
        var ch = (ich === null) ? input[this.cursor++] : null;
        if (ich !== null) {
            this.lexIdent(ich, keywordIsName);
        } else if (scanOperand && ch === '/') {
            this.lexRegExp(ch);
        } else if (ch in opTokens) {
            this.lexOp(ch);
        } else if (ch === '.') {
            this.lexDot(ch);
        } else if (ch >= '1' && ch <= '9') {
            this.lexNumber(ch);
        } else if (ch === '0') {
            this.lexZeroNumber(ch);
        } else if (ch === '"' || ch === "'") {
            this.lexString(ch);
        } else if (this.scanNewlines && (ch === '\n' || ch === '\r')) {
            // if this was a \r, look for \r\n
            if (ch === '\r' && input[this.cursor] === '\n') this.cursor++;
            token.type = NEWLINE;
            token.value = '\n';
            this.lineno++;
        } else {
            throw this.newSyntaxError("Illegal token");
        }

        token.end = this.cursor;
        return token.type;
    },

    /*
     * Tokenizer.unget :: void -> undefined
     *
     * Match depends on unget returning undefined.
     */
    unget: function () {
        if (++this.lookahead === 4) throw "PANIC: too much lookahead!";
        this.tokenIndex = (this.tokenIndex - 1) & 3;
    },

    newSyntaxError: function (m) {
        m = (this.filename ? this.filename + ":" : "") + this.lineno + ": " + m;
        var e = new SyntaxError(m, this.filename, this.lineno);
        e.source = this.source;
        e.cursor = this.lookahead
            ? this.tokens[(this.tokenIndex + this.lookahead) & 3].start
            : this.cursor;
        return e;
    },


    /* Gets a single valid identifier char from the input stream, or null
     * if there is none.
     */
    getValidIdentifierChar: function(first) {
        var input = this.source;
        if (this.cursor >= input.length) return null;
        var ch = input[this.cursor];

        // first check for \u escapes
        if (ch === '\\' && input[this.cursor+1] === 'u') {
            // get the character value
            try {
                ch = String.fromCharCode(parseInt(
                    input.substring(this.cursor + 2, this.cursor + 6),
                    16));
            } catch (ex) {
                return null;
            }
            this.cursor += 5;
        }

        var valid = isValidIdentifierChar(ch, first);
        if (valid) this.cursor++;
        return (valid ? ch : null);
    },
};


exports.isIdentifier = isIdentifier;
exports.Tokenizer = Tokenizer;

});
