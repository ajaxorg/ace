/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(function (require, exports) {
    var nls = require('./nls')

    
    'use strict';
    (function (ScanError) {
        ScanError[ScanError["None"] = 0] = "None";
        ScanError[ScanError["UnexpectedEndOfComment"] = 1] = "UnexpectedEndOfComment";
        ScanError[ScanError["UnexpectedEndOfString"] = 2] = "UnexpectedEndOfString";
        ScanError[ScanError["UnexpectedEndOfNumber"] = 3] = "UnexpectedEndOfNumber";
        ScanError[ScanError["InvalidUnicode"] = 4] = "InvalidUnicode";
        ScanError[ScanError["InvalidEscapeCharacter"] = 5] = "InvalidEscapeCharacter";
    })(exports.ScanError || (exports.ScanError = {}));
    var ScanError = exports.ScanError;
    (function (SyntaxKind) {
        SyntaxKind[SyntaxKind["Unknown"] = 0] = "Unknown";
        SyntaxKind[SyntaxKind["OpenBraceToken"] = 1] = "OpenBraceToken";
        SyntaxKind[SyntaxKind["CloseBraceToken"] = 2] = "CloseBraceToken";
        SyntaxKind[SyntaxKind["OpenBracketToken"] = 3] = "OpenBracketToken";
        SyntaxKind[SyntaxKind["CloseBracketToken"] = 4] = "CloseBracketToken";
        SyntaxKind[SyntaxKind["CommaToken"] = 5] = "CommaToken";
        SyntaxKind[SyntaxKind["ColonToken"] = 6] = "ColonToken";
        SyntaxKind[SyntaxKind["NullKeyword"] = 7] = "NullKeyword";
        SyntaxKind[SyntaxKind["TrueKeyword"] = 8] = "TrueKeyword";
        SyntaxKind[SyntaxKind["FalseKeyword"] = 9] = "FalseKeyword";
        SyntaxKind[SyntaxKind["StringLiteral"] = 10] = "StringLiteral";
        SyntaxKind[SyntaxKind["NumericLiteral"] = 11] = "NumericLiteral";
        SyntaxKind[SyntaxKind["LineCommentTrivia"] = 12] = "LineCommentTrivia";
        SyntaxKind[SyntaxKind["BlockCommentTrivia"] = 13] = "BlockCommentTrivia";
        SyntaxKind[SyntaxKind["LineBreakTrivia"] = 14] = "LineBreakTrivia";
        SyntaxKind[SyntaxKind["Trivia"] = 15] = "Trivia";
        SyntaxKind[SyntaxKind["EOF"] = 16] = "EOF";
    })(exports.SyntaxKind || (exports.SyntaxKind = {}));
    var SyntaxKind = exports.SyntaxKind;
    function createScanner(text, ignoreTrivia) {
        if (ignoreTrivia === void 0) { ignoreTrivia = false; }
        var pos = 0, len = text.length, value = '', tokenOffset = 0, token = SyntaxKind.Unknown, scanError = ScanError.None;
        function scanHexDigits(count, exact) {
            var digits = 0;
            var value = 0;
            while (digits < count || !exact) {
                var ch = text.charCodeAt(pos);
                if (ch >= CharacterCodes._0 && ch <= CharacterCodes._9) {
                    value = value * 16 + ch - CharacterCodes._0;
                }
                else if (ch >= CharacterCodes.A && ch <= CharacterCodes.F) {
                    value = value * 16 + ch - CharacterCodes.A + 10;
                }
                else if (ch >= CharacterCodes.a && ch <= CharacterCodes.f) {
                    value = value * 16 + ch - CharacterCodes.a + 10;
                }
                else {
                    break;
                }
                pos++;
                digits++;
            }
            if (digits < count) {
                value = -1;
            }
            return value;
        }
        function scanNumber() {
            var start = pos;
            if (text.charCodeAt(pos) === CharacterCodes._0) {
                pos++;
            }
            else {
                pos++;
                while (pos < text.length && isDigit(text.charCodeAt(pos))) {
                    pos++;
                }
            }
            if (pos < text.length && text.charCodeAt(pos) === CharacterCodes.dot) {
                pos++;
                if (pos < text.length && isDigit(text.charCodeAt(pos))) {
                    pos++;
                    while (pos < text.length && isDigit(text.charCodeAt(pos))) {
                        pos++;
                    }
                }
                else {
                    scanError = ScanError.UnexpectedEndOfNumber;
                    return text.substring(start, end);
                }
            }
            var end = pos;
            if (pos < text.length && (text.charCodeAt(pos) === CharacterCodes.E || text.charCodeAt(pos) === CharacterCodes.e)) {
                pos++;
                if (pos < text.length && text.charCodeAt(pos) === CharacterCodes.plus || text.charCodeAt(pos) === CharacterCodes.minus) {
                    pos++;
                }
                if (pos < text.length && isDigit(text.charCodeAt(pos))) {
                    pos++;
                    while (pos < text.length && isDigit(text.charCodeAt(pos))) {
                        pos++;
                    }
                    end = pos;
                }
                else {
                    scanError = ScanError.UnexpectedEndOfNumber;
                }
            }
            return text.substring(start, end);
        }
        function scanString() {
            var result = '', start = pos;
            while (true) {
                if (pos >= len) {
                    result += text.substring(start, pos);
                    scanError = ScanError.UnexpectedEndOfString;
                    break;
                }
                var ch = text.charCodeAt(pos);
                if (ch === CharacterCodes.doubleQuote) {
                    result += text.substring(start, pos);
                    pos++;
                    break;
                }
                if (ch === CharacterCodes.backslash) {
                    result += text.substring(start, pos);
                    pos++;
                    if (pos >= len) {
                        scanError = ScanError.UnexpectedEndOfString;
                        break;
                    }
                    ch = text.charCodeAt(pos++);
                    switch (ch) {
                        case CharacterCodes.doubleQuote:
                            result += '\"';
                            break;
                        case CharacterCodes.backslash:
                            result += '\\';
                            break;
                        case CharacterCodes.slash:
                            result += '/';
                            break;
                        case CharacterCodes.b:
                            result += '\b';
                            break;
                        case CharacterCodes.f:
                            result += '\f';
                            break;
                        case CharacterCodes.n:
                            result += '\n';
                            break;
                        case CharacterCodes.r:
                            result += '\r';
                            break;
                        case CharacterCodes.t:
                            result += '\t';
                            break;
                        case CharacterCodes.u:
                            var ch = scanHexDigits(4, true);
                            if (ch >= 0) {
                                result += String.fromCharCode(ch);
                            }
                            else {
                                scanError = ScanError.InvalidUnicode;
                            }
                            break;
                        default:
                            scanError = ScanError.InvalidEscapeCharacter;
                    }
                    start = pos;
                    continue;
                }
                if (isLineBreak(ch)) {
                    result += text.substring(start, pos);
                    scanError = ScanError.UnexpectedEndOfString;
                    break;
                }
                pos++;
            }
            return result;
        }
        function scanNext() {
            value = '';
            scanError = ScanError.None;
            tokenOffset = pos;
            if (pos >= len) {
                // at the end
                tokenOffset = len;
                return token = SyntaxKind.EOF;
            }
            var code = text.charCodeAt(pos);
            // trivia: whitespace
            if (isWhiteSpace(code)) {
                do {
                    pos++;
                    value += String.fromCharCode(code);
                    code = text.charCodeAt(pos);
                } while (isWhiteSpace(code));
                return token = SyntaxKind.Trivia;
            }
            // trivia: newlines
            if (isLineBreak(code)) {
                pos++;
                value += String.fromCharCode(code);
                if (code === CharacterCodes.carriageReturn && text.charCodeAt(pos) === CharacterCodes.lineFeed) {
                    pos++;
                    value += '\n';
                }
                return token = SyntaxKind.LineBreakTrivia;
            }
            switch (code) {
                // tokens: []{}:,
                case CharacterCodes.openBrace:
                    pos++;
                    return token = SyntaxKind.OpenBraceToken;
                case CharacterCodes.closeBrace:
                    pos++;
                    return token = SyntaxKind.CloseBraceToken;
                case CharacterCodes.openBracket:
                    pos++;
                    return token = SyntaxKind.OpenBracketToken;
                case CharacterCodes.closeBracket:
                    pos++;
                    return token = SyntaxKind.CloseBracketToken;
                case CharacterCodes.colon:
                    pos++;
                    return token = SyntaxKind.ColonToken;
                case CharacterCodes.comma:
                    pos++;
                    return token = SyntaxKind.CommaToken;
                // strings
                case CharacterCodes.doubleQuote:
                    pos++;
                    value = scanString();
                    return token = SyntaxKind.StringLiteral;
                // comments
                case CharacterCodes.slash:
                    var start = pos - 1;
                    // Single-line comment
                    if (text.charCodeAt(pos + 1) === CharacterCodes.slash) {
                        pos += 2;
                        while (pos < len) {
                            if (isLineBreak(text.charCodeAt(pos))) {
                                break;
                            }
                            pos++;
                        }
                        value = text.substring(start, pos);
                        return token = SyntaxKind.LineCommentTrivia;
                    }
                    // Multi-line comment
                    if (text.charCodeAt(pos + 1) === CharacterCodes.asterisk) {
                        pos += 2;
                        var safeLength = len - 1; // For lookahead.
                        var commentClosed = false;
                        while (pos < safeLength) {
                            var ch = text.charCodeAt(pos);
                            if (ch === CharacterCodes.asterisk && text.charCodeAt(pos + 1) === CharacterCodes.slash) {
                                pos += 2;
                                commentClosed = true;
                                break;
                            }
                            pos++;
                        }
                        if (!commentClosed) {
                            pos++;
                            scanError = ScanError.UnexpectedEndOfComment;
                        }
                        value = text.substring(start, pos);
                        return token = SyntaxKind.BlockCommentTrivia;
                    }
                    // just a single slash
                    value += String.fromCharCode(code);
                    pos++;
                    return token = SyntaxKind.Unknown;
                // numbers
                case CharacterCodes.minus:
                    value += String.fromCharCode(code);
                    pos++;
                    if (pos === len || !isDigit(text.charCodeAt(pos))) {
                        return token = SyntaxKind.Unknown;
                    }
                // found a minus, followed by a number so
                // we fall through to proceed with scanning
                // numbers
                case CharacterCodes._0:
                case CharacterCodes._1:
                case CharacterCodes._2:
                case CharacterCodes._3:
                case CharacterCodes._4:
                case CharacterCodes._5:
                case CharacterCodes._6:
                case CharacterCodes._7:
                case CharacterCodes._8:
                case CharacterCodes._9:
                    value += scanNumber();
                    return token = SyntaxKind.NumericLiteral;
                // literals and unknown symbols
                default:
                    // is a literal? Read the full word.
                    while (pos < len && isUnknownContentCharacter(code)) {
                        pos++;
                        code = text.charCodeAt(pos);
                    }
                    if (tokenOffset !== pos) {
                        value = text.substring(tokenOffset, pos);
                        // keywords: true, false, null
                        switch (value) {
                            case 'true': return token = SyntaxKind.TrueKeyword;
                            case 'false': return token = SyntaxKind.FalseKeyword;
                            case 'null': return token = SyntaxKind.NullKeyword;
                        }
                        return token = SyntaxKind.Unknown;
                    }
                    // some
                    value += String.fromCharCode(code);
                    pos++;
                    return token = SyntaxKind.Unknown;
            }
        }
        function isUnknownContentCharacter(code) {
            if (isWhiteSpace(code) || isLineBreak(code)) {
                return false;
            }
            switch (code) {
                case CharacterCodes.closeBrace:
                case CharacterCodes.closeBracket:
                case CharacterCodes.openBrace:
                case CharacterCodes.openBracket:
                case CharacterCodes.doubleQuote:
                case CharacterCodes.colon:
                case CharacterCodes.comma:
                    return false;
            }
            return true;
        }
        function scanNextNonTrivia() {
            var result;
            do {
                result = scanNext();
            } while (result >= SyntaxKind.LineCommentTrivia && result <= SyntaxKind.Trivia);
            return result;
        }
        return {
            getPosition: function () { return pos; },
            scan: ignoreTrivia ? scanNextNonTrivia : scanNext,
            getToken: function () { return token; },
            getTokenValue: function () { return value; },
            getTokenOffset: function () { return tokenOffset; },
            getTokenLength: function () { return pos - tokenOffset; },
            getTokenError: function () { return scanError; }
        };
    }
    exports.createScanner = createScanner;
    function isWhiteSpace(ch) {
        return ch === CharacterCodes.space || ch === CharacterCodes.tab || ch === CharacterCodes.verticalTab || ch === CharacterCodes.formFeed ||
            ch === CharacterCodes.nonBreakingSpace || ch === CharacterCodes.ogham || ch >= CharacterCodes.enQuad && ch <= CharacterCodes.zeroWidthSpace ||
            ch === CharacterCodes.narrowNoBreakSpace || ch === CharacterCodes.mathematicalSpace || ch === CharacterCodes.ideographicSpace || ch === CharacterCodes.byteOrderMark;
    }
    function isLineBreak(ch) {
        return ch === CharacterCodes.lineFeed || ch === CharacterCodes.carriageReturn || ch === CharacterCodes.lineSeparator || ch === CharacterCodes.paragraphSeparator;
    }
    function isDigit(ch) {
        return ch >= CharacterCodes._0 && ch <= CharacterCodes._9;
    }
    function isLetter(ch) {
        return ch >= CharacterCodes.a && ch <= CharacterCodes.z || ch >= CharacterCodes.A && ch <= CharacterCodes.Z;
    }
    exports.isLetter = isLetter;
    var CharacterCodes;
    (function (CharacterCodes) {
        CharacterCodes[CharacterCodes["nullCharacter"] = 0] = "nullCharacter";
        CharacterCodes[CharacterCodes["maxAsciiCharacter"] = 127] = "maxAsciiCharacter";
        CharacterCodes[CharacterCodes["lineFeed"] = 10] = "lineFeed";
        CharacterCodes[CharacterCodes["carriageReturn"] = 13] = "carriageReturn";
        CharacterCodes[CharacterCodes["lineSeparator"] = 8232] = "lineSeparator";
        CharacterCodes[CharacterCodes["paragraphSeparator"] = 8233] = "paragraphSeparator";
        // REVIEW: do we need to support this?  The scanner doesn't, but our IText does.  This seems
        // like an odd disparity?  (Or maybe it's completely fine for them to be different).
        CharacterCodes[CharacterCodes["nextLine"] = 133] = "nextLine";
        // Unicode 3.0 space characters
        CharacterCodes[CharacterCodes["space"] = 32] = "space";
        CharacterCodes[CharacterCodes["nonBreakingSpace"] = 160] = "nonBreakingSpace";
        CharacterCodes[CharacterCodes["enQuad"] = 8192] = "enQuad";
        CharacterCodes[CharacterCodes["emQuad"] = 8193] = "emQuad";
        CharacterCodes[CharacterCodes["enSpace"] = 8194] = "enSpace";
        CharacterCodes[CharacterCodes["emSpace"] = 8195] = "emSpace";
        CharacterCodes[CharacterCodes["threePerEmSpace"] = 8196] = "threePerEmSpace";
        CharacterCodes[CharacterCodes["fourPerEmSpace"] = 8197] = "fourPerEmSpace";
        CharacterCodes[CharacterCodes["sixPerEmSpace"] = 8198] = "sixPerEmSpace";
        CharacterCodes[CharacterCodes["figureSpace"] = 8199] = "figureSpace";
        CharacterCodes[CharacterCodes["punctuationSpace"] = 8200] = "punctuationSpace";
        CharacterCodes[CharacterCodes["thinSpace"] = 8201] = "thinSpace";
        CharacterCodes[CharacterCodes["hairSpace"] = 8202] = "hairSpace";
        CharacterCodes[CharacterCodes["zeroWidthSpace"] = 8203] = "zeroWidthSpace";
        CharacterCodes[CharacterCodes["narrowNoBreakSpace"] = 8239] = "narrowNoBreakSpace";
        CharacterCodes[CharacterCodes["ideographicSpace"] = 12288] = "ideographicSpace";
        CharacterCodes[CharacterCodes["mathematicalSpace"] = 8287] = "mathematicalSpace";
        CharacterCodes[CharacterCodes["ogham"] = 5760] = "ogham";
        CharacterCodes[CharacterCodes["_"] = 95] = "_";
        CharacterCodes[CharacterCodes["$"] = 36] = "$";
        CharacterCodes[CharacterCodes["_0"] = 48] = "_0";
        CharacterCodes[CharacterCodes["_1"] = 49] = "_1";
        CharacterCodes[CharacterCodes["_2"] = 50] = "_2";
        CharacterCodes[CharacterCodes["_3"] = 51] = "_3";
        CharacterCodes[CharacterCodes["_4"] = 52] = "_4";
        CharacterCodes[CharacterCodes["_5"] = 53] = "_5";
        CharacterCodes[CharacterCodes["_6"] = 54] = "_6";
        CharacterCodes[CharacterCodes["_7"] = 55] = "_7";
        CharacterCodes[CharacterCodes["_8"] = 56] = "_8";
        CharacterCodes[CharacterCodes["_9"] = 57] = "_9";
        CharacterCodes[CharacterCodes["a"] = 97] = "a";
        CharacterCodes[CharacterCodes["b"] = 98] = "b";
        CharacterCodes[CharacterCodes["c"] = 99] = "c";
        CharacterCodes[CharacterCodes["d"] = 100] = "d";
        CharacterCodes[CharacterCodes["e"] = 101] = "e";
        CharacterCodes[CharacterCodes["f"] = 102] = "f";
        CharacterCodes[CharacterCodes["g"] = 103] = "g";
        CharacterCodes[CharacterCodes["h"] = 104] = "h";
        CharacterCodes[CharacterCodes["i"] = 105] = "i";
        CharacterCodes[CharacterCodes["j"] = 106] = "j";
        CharacterCodes[CharacterCodes["k"] = 107] = "k";
        CharacterCodes[CharacterCodes["l"] = 108] = "l";
        CharacterCodes[CharacterCodes["m"] = 109] = "m";
        CharacterCodes[CharacterCodes["n"] = 110] = "n";
        CharacterCodes[CharacterCodes["o"] = 111] = "o";
        CharacterCodes[CharacterCodes["p"] = 112] = "p";
        CharacterCodes[CharacterCodes["q"] = 113] = "q";
        CharacterCodes[CharacterCodes["r"] = 114] = "r";
        CharacterCodes[CharacterCodes["s"] = 115] = "s";
        CharacterCodes[CharacterCodes["t"] = 116] = "t";
        CharacterCodes[CharacterCodes["u"] = 117] = "u";
        CharacterCodes[CharacterCodes["v"] = 118] = "v";
        CharacterCodes[CharacterCodes["w"] = 119] = "w";
        CharacterCodes[CharacterCodes["x"] = 120] = "x";
        CharacterCodes[CharacterCodes["y"] = 121] = "y";
        CharacterCodes[CharacterCodes["z"] = 122] = "z";
        CharacterCodes[CharacterCodes["A"] = 65] = "A";
        CharacterCodes[CharacterCodes["B"] = 66] = "B";
        CharacterCodes[CharacterCodes["C"] = 67] = "C";
        CharacterCodes[CharacterCodes["D"] = 68] = "D";
        CharacterCodes[CharacterCodes["E"] = 69] = "E";
        CharacterCodes[CharacterCodes["F"] = 70] = "F";
        CharacterCodes[CharacterCodes["G"] = 71] = "G";
        CharacterCodes[CharacterCodes["H"] = 72] = "H";
        CharacterCodes[CharacterCodes["I"] = 73] = "I";
        CharacterCodes[CharacterCodes["J"] = 74] = "J";
        CharacterCodes[CharacterCodes["K"] = 75] = "K";
        CharacterCodes[CharacterCodes["L"] = 76] = "L";
        CharacterCodes[CharacterCodes["M"] = 77] = "M";
        CharacterCodes[CharacterCodes["N"] = 78] = "N";
        CharacterCodes[CharacterCodes["O"] = 79] = "O";
        CharacterCodes[CharacterCodes["P"] = 80] = "P";
        CharacterCodes[CharacterCodes["Q"] = 81] = "Q";
        CharacterCodes[CharacterCodes["R"] = 82] = "R";
        CharacterCodes[CharacterCodes["S"] = 83] = "S";
        CharacterCodes[CharacterCodes["T"] = 84] = "T";
        CharacterCodes[CharacterCodes["U"] = 85] = "U";
        CharacterCodes[CharacterCodes["V"] = 86] = "V";
        CharacterCodes[CharacterCodes["W"] = 87] = "W";
        CharacterCodes[CharacterCodes["X"] = 88] = "X";
        CharacterCodes[CharacterCodes["Y"] = 89] = "Y";
        CharacterCodes[CharacterCodes["Z"] = 90] = "Z";
        CharacterCodes[CharacterCodes["ampersand"] = 38] = "ampersand";
        CharacterCodes[CharacterCodes["asterisk"] = 42] = "asterisk";
        CharacterCodes[CharacterCodes["at"] = 64] = "at";
        CharacterCodes[CharacterCodes["backslash"] = 92] = "backslash";
        CharacterCodes[CharacterCodes["bar"] = 124] = "bar";
        CharacterCodes[CharacterCodes["caret"] = 94] = "caret";
        CharacterCodes[CharacterCodes["closeBrace"] = 125] = "closeBrace";
        CharacterCodes[CharacterCodes["closeBracket"] = 93] = "closeBracket";
        CharacterCodes[CharacterCodes["closeParen"] = 41] = "closeParen";
        CharacterCodes[CharacterCodes["colon"] = 58] = "colon";
        CharacterCodes[CharacterCodes["comma"] = 44] = "comma";
        CharacterCodes[CharacterCodes["dot"] = 46] = "dot";
        CharacterCodes[CharacterCodes["doubleQuote"] = 34] = "doubleQuote";
        CharacterCodes[CharacterCodes["equals"] = 61] = "equals";
        CharacterCodes[CharacterCodes["exclamation"] = 33] = "exclamation";
        CharacterCodes[CharacterCodes["greaterThan"] = 62] = "greaterThan";
        CharacterCodes[CharacterCodes["lessThan"] = 60] = "lessThan";
        CharacterCodes[CharacterCodes["minus"] = 45] = "minus";
        CharacterCodes[CharacterCodes["openBrace"] = 123] = "openBrace";
        CharacterCodes[CharacterCodes["openBracket"] = 91] = "openBracket";
        CharacterCodes[CharacterCodes["openParen"] = 40] = "openParen";
        CharacterCodes[CharacterCodes["percent"] = 37] = "percent";
        CharacterCodes[CharacterCodes["plus"] = 43] = "plus";
        CharacterCodes[CharacterCodes["question"] = 63] = "question";
        CharacterCodes[CharacterCodes["semicolon"] = 59] = "semicolon";
        CharacterCodes[CharacterCodes["singleQuote"] = 39] = "singleQuote";
        CharacterCodes[CharacterCodes["slash"] = 47] = "slash";
        CharacterCodes[CharacterCodes["tilde"] = 126] = "tilde";
        CharacterCodes[CharacterCodes["backspace"] = 8] = "backspace";
        CharacterCodes[CharacterCodes["formFeed"] = 12] = "formFeed";
        CharacterCodes[CharacterCodes["byteOrderMark"] = 65279] = "byteOrderMark";
        CharacterCodes[CharacterCodes["tab"] = 9] = "tab";
        CharacterCodes[CharacterCodes["verticalTab"] = 11] = "verticalTab";
    })(CharacterCodes || (CharacterCodes = {}));
    /**
     * Takes JSON with JavaScript-style comments and remove
     * them. Optionally replaces every none-newline character
     * of comments with a replaceCharacter
     */
    function stripComments(text, replaceCh) {
        var _scanner = createScanner(text), parts = [], kind, offset = 0, pos;
        do {
            pos = _scanner.getPosition();
            kind = _scanner.scan();
            switch (kind) {
                case SyntaxKind.LineCommentTrivia:
                case SyntaxKind.BlockCommentTrivia:
                case SyntaxKind.EOF:
                    if (offset !== pos) {
                        parts.push(text.substring(offset, pos));
                    }
                    if (replaceCh !== void 0) {
                        parts.push(_scanner.getTokenValue().replace(/[^\r\n]/g, replaceCh));
                    }
                    offset = _scanner.getPosition();
                    break;
            }
        } while (kind !== SyntaxKind.EOF);
        return parts.join('');
    }
    exports.stripComments = stripComments;
    function parse(text, errors) {
        if (errors === void 0) { errors = []; }
        var noMatch = Object();
        var _scanner = createScanner(text, true);
        function scanNext() {
            var token = _scanner.scan();
            while (token === SyntaxKind.Unknown) {
                handleError(nls.localize('UnknownSymbol', 'Invalid symbol'));
                token = _scanner.scan();
            }
            return token;
        }
        function handleError(message, skipUntilAfter, skipUntil) {
            if (skipUntilAfter === void 0) { skipUntilAfter = []; }
            if (skipUntil === void 0) { skipUntil = []; }
            errors.push(message);
            if (skipUntilAfter.length + skipUntil.length > 0) {
                var token = _scanner.getToken();
                while (token !== SyntaxKind.EOF) {
                    if (skipUntilAfter.indexOf(token) !== -1) {
                        scanNext();
                        break;
                    }
                    else if (skipUntil.indexOf(token) !== -1) {
                        break;
                    }
                    token = scanNext();
                }
            }
        }
        function parseString() {
            if (_scanner.getToken() !== SyntaxKind.StringLiteral) {
                return noMatch;
            }
            var value = _scanner.getTokenValue();
            scanNext();
            return value;
        }
        function parseLiteral() {
            var value;
            switch (_scanner.getToken()) {
                case SyntaxKind.NumericLiteral:
                    try {
                        value = JSON.parse(_scanner.getTokenValue());
                        if (typeof value !== 'number') {
                            handleError(nls.localize('InvalidNumberFormat', 'Invalid number format'));
                            value = 0;
                        }
                    }
                    catch (e) {
                        value = 0;
                    }
                    break;
                case SyntaxKind.NullKeyword:
                    value = null;
                    break;
                case SyntaxKind.TrueKeyword:
                    value = true;
                    break;
                case SyntaxKind.FalseKeyword:
                    value = false;
                    break;
                default:
                    return noMatch;
            }
            scanNext();
            return value;
        }
        function parseProperty(result) {
            var key = parseString();
            if (key === noMatch) {
                handleError(nls.localize('PropertyExpected', 'Property name expected'), [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
                return false;
            }
            if (_scanner.getToken() === SyntaxKind.ColonToken) {
                scanNext(); // consume colon
                var value = parseValue();
                if (value !== noMatch) {
                    result[key] = value;
                }
                else {
                    handleError(nls.localize('ValueExpected', 'Value expected'), [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
                }
            }
            else {
                handleError(nls.localize('ColonExpected', 'Colon expected'), [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
            }
            return true;
        }
        function parseObject() {
            if (_scanner.getToken() !== SyntaxKind.OpenBraceToken) {
                return noMatch;
            }
            var obj = {};
            scanNext(); // consume open brace
            var needsComma = false;
            while (_scanner.getToken() !== SyntaxKind.CloseBraceToken && _scanner.getToken() !== SyntaxKind.EOF) {
                if (_scanner.getToken() === SyntaxKind.CommaToken) {
                    if (!needsComma) {
                        handleError(nls.localize('ValeExpected', 'Value expected'), [], []);
                    }
                    scanNext(); // consume comma
                }
                else if (needsComma) {
                    handleError(nls.localize('CommaExpected', 'Comma expected'), [], []);
                }
                var propertyParsed = parseProperty(obj);
                if (!propertyParsed) {
                    handleError(nls.localize('ValueExpected', 'Value expected'), [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
                }
                needsComma = true;
            }
            if (_scanner.getToken() !== SyntaxKind.CloseBraceToken) {
                handleError(nls.localize('CloseBraceExpected', 'Closing brace expected'), [SyntaxKind.CloseBraceToken], []);
            }
            else {
                scanNext(); // consume close brace
            }
            return obj;
        }
        function parseArray() {
            if (_scanner.getToken() !== SyntaxKind.OpenBracketToken) {
                return noMatch;
            }
            var arr = [];
            scanNext(); // consume open bracket
            var needsComma = false;
            while (_scanner.getToken() !== SyntaxKind.CloseBracketToken && _scanner.getToken() !== SyntaxKind.EOF) {
                if (_scanner.getToken() === SyntaxKind.CommaToken) {
                    if (!needsComma) {
                        handleError(nls.localize('ValeExpected', 'Value expected'), [], []);
                    }
                    scanNext(); // consume comma
                }
                else if (needsComma) {
                    handleError(nls.localize('CommaExpected', 'Comma expected'), [], []);
                }
                var value = parseValue();
                if (value === noMatch) {
                    handleError(nls.localize('ValueExpected', 'Value expected'), [], [SyntaxKind.CloseBracketToken, SyntaxKind.CommaToken]);
                }
                else {
                    arr.push(value);
                }
                needsComma = true;
            }
            if (_scanner.getToken() !== SyntaxKind.CloseBracketToken) {
                handleError(nls.localize('CloseBracketExpected', 'Closing bracket expected'), [SyntaxKind.CloseBracketToken], []);
            }
            else {
                scanNext(); // consume close bracket
            }
            return arr;
        }
        function parseValue() {
            var result = parseArray();
            if (result !== noMatch) {
                return result;
            }
            result = parseObject();
            if (result !== noMatch) {
                return result;
            }
            result = parseString();
            if (result !== noMatch) {
                return result;
            }
            return parseLiteral();
        }
        scanNext();
        var value = parseValue();
        if (value === noMatch) {
            handleError(nls.localize('ValueExpected', 'Value expected'), [], []);
            return void 0;
        }
        if (_scanner.getToken() !== SyntaxKind.EOF) {
            handleError(nls.localize('EOFExpected', 'End of content expected'), [], []);
        }
        return value;
    }
    exports.parse = parse;
});
