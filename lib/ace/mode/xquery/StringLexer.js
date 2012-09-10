define(function(require, exports, module){// $ANTLR 3.3 Nov 30, 2010 12:50:56 /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g 2012-09-05 10:41:39

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
  var org =  require("./antlr3-all").org;
  var XQDTLexer = require("./XQDTLexer").XQDTLexer;


var StringLexer = function(input, state) {
// alternate constructor @todo
// public StringLexer(CharStream input)
// public StringLexer(CharStream input, RecognizerSharedState state) {
    if (!state) {
        state = new org.antlr.runtime.RecognizerSharedState();
    }

    (function(){


        this.inQuotStr = false;
        this.inAposStr = false;

        //boolean inQuotStr = false;
        //boolean inAposStr = false;

        //public StringLexer(CharStream input, boolean isAposStr) {
        //	this(input, new RecognizerSharedState());
        //	this.inAposStr = isAposStr;
        //	this.inQuotStr = !isAposStr;
        //	setIsWsExplicit(true);
        //}

    }).call(this);

    this.dfa8 = new StringLexer.DFA8(this);
    StringLexer.superclass.constructor.call(this, input, state);


};

org.antlr.lang.augmentObject(StringLexer, {
    EOF: -1,
    L_QuotAttrContentChar: 4,
    L_AposAttrContentChar: 5,
    L_ElementContentChar: 6,
    L_CDataSection: 7,
    L_PredefinedEntityRef: 8,
    L_CharRef: 9,
    ESCAPE_LBRACKET: 10,
    ESCAPE_RBRACKET: 11,
    ESCAPE_APOS: 12,
    ESCAPE_QUOT: 13,
    CDATA_START: 14,
    CDATA_END: 15,
    ANCESTOR: 16,
    ANCESTOR_OR_SELF: 17,
    AND: 18,
    AS: 19,
    ASCENDING: 20,
    AT: 21,
    ATTRIBUTE: 22,
    BASE_URI: 23,
    BOUNDARY_SPACE: 24,
    BY: 25,
    CASE: 26,
    CAST: 27,
    CASTABLE: 28,
    CHILD: 29,
    COLLATION: 30,
    COMMENT: 31,
    CONSTRUCTION: 32,
    COPY_NAMESPACES: 33,
    DECLARE: 34,
    DEFAULT: 35,
    DESCENDANT: 36,
    DESCENDANT_OR_SELF: 37,
    DESCENDING: 38,
    DIV: 39,
    DOCUMENT: 40,
    DOCUMENT_NODE: 41,
    ELEMENT: 42,
    ELSE: 43,
    EMPTY: 44,
    EMPTY_SEQUENCE: 45,
    ENCODING: 46,
    EQ: 47,
    EVERY: 48,
    EXCEPT: 49,
    EXTERNAL: 50,
    FOLLOWING: 51,
    FOLLOWING_SIBLING: 52,
    FOR: 53,
    FUNCTION: 54,
    GE: 55,
    GREATEST: 56,
    GT: 57,
    IDIV: 58,
    IF: 59,
    IMPORT: 60,
    IN: 61,
    INHERIT: 62,
    INSTANCE: 63,
    INTERSECT: 64,
    IS: 65,
    ITEM: 66,
    LAX: 67,
    LE: 68,
    LEAST: 69,
    LET: 70,
    LT: 71,
    MOD: 72,
    MODULE: 73,
    NAMESPACE: 74,
    NE: 75,
    NO_INHERIT: 76,
    NO_PRESERVE: 77,
    NODE: 78,
    JSON: 79,
    OF: 80,
    OPTION: 81,
    OR: 82,
    ORDER: 83,
    ORDERED: 84,
    ORDERING: 85,
    PARENT: 86,
    PRECEDING: 87,
    PRECEDING_SIBLING: 88,
    PRESERVE: 89,
    PROCESSING_INSTRUCTION: 90,
    STRUCTURED_ITEM: 91,
    JSON_ITEM: 92,
    OBJECT: 93,
    ARRAY: 94,
    RETURN: 95,
    SATISFIES: 96,
    SCHEMA: 97,
    SCHEMA_ATTRIBUTE: 98,
    SCHEMA_ELEMENT: 99,
    SELF: 100,
    SOME: 101,
    STABLE: 102,
    STRICT: 103,
    STRIP: 104,
    TEXT: 105,
    THEN: 106,
    TO: 107,
    TREAT: 108,
    TYPESWITCH: 109,
    UNION: 110,
    UNORDERED: 111,
    VALIDATE: 112,
    VARIABLE: 113,
    VERSION: 114,
    WHERE: 115,
    XQUERY: 116,
    ALLOWING: 117,
    CATCH: 118,
    CONTEXT: 119,
    COUNT: 120,
    DECIMAL_FORMAT: 121,
    DECIMAL_SEPARATOR: 122,
    DIGIT: 123,
    END: 124,
    GROUP: 125,
    GROUPING_SEPARATOR: 126,
    INFINITY: 127,
    MINUS_SIGN: 128,
    NAMESPACE_NODE: 129,
    NAN: 130,
    NEXT: 131,
    ONLY: 132,
    PATTERN_SEPARATOR: 133,
    PERCENT: 134,
    PER_MILLE: 135,
    PREVIOUS: 136,
    SLIDING: 137,
    START: 138,
    SWITCH: 139,
    TRY: 140,
    TUMBLING: 141,
    TYPE: 142,
    WHEN: 143,
    WINDOW: 144,
    ZERO_DIGIT: 145,
    AFTER: 146,
    BEFORE: 147,
    COPY: 148,
    DELETE: 149,
    FIRST: 150,
    INSERT: 151,
    INTO: 152,
    POSITION: 153,
    APPEND: 154,
    LAST: 155,
    MODIFY: 156,
    NODES: 157,
    RENAME: 158,
    REPLACE: 159,
    REVALIDATION: 160,
    SKIP: 161,
    UPDATING: 162,
    VALUE: 163,
    WITH: 164,
    ALL: 165,
    ANY: 166,
    CONTAINS: 167,
    CONTENT: 168,
    DIACRITICS: 169,
    DIFFERENT: 170,
    DISTANCE: 171,
    ENTIRE: 172,
    EXACTLY: 173,
    FROM: 174,
    FT_OPTION: 175,
    FTAND: 176,
    FTNOT: 177,
    FTOR: 178,
    INSENSITIVE: 179,
    LANGUAGE: 180,
    LEVELS: 181,
    LOWERCASE: 182,
    MOST: 183,
    NO: 184,
    NOT: 185,
    OCCURS: 186,
    PARAGRAPH: 187,
    PARAGRAPHS: 188,
    PHRASE: 189,
    RELATIONSHIP: 190,
    SAME: 191,
    SCORE: 192,
    SENSITIVE: 193,
    SENTENCE: 194,
    SENTENCES: 195,
    STEMMING: 196,
    STOP: 197,
    THESAURUS: 198,
    TIMES: 199,
    UPPERCASE: 200,
    USING: 201,
    WEIGHT: 202,
    WILDCARDS: 203,
    WITHOUT: 204,
    WORD: 205,
    WORDS: 206,
    BREAK: 207,
    CONTINUE: 208,
    EXIT: 209,
    LOOP: 210,
    RETURNING: 211,
    WHILE: 212,
    CHECK: 213,
    COLLECTION: 214,
    CONSTRAINT: 215,
    FOREACH: 216,
    FOREIGN: 217,
    INDEX: 218,
    INTEGRITY: 219,
    KEY: 220,
    ON: 221,
    UNIQUE: 222,
    AMP_ER: 223,
    APOS_ER: 224,
    QUOT_ER: 225,
    CONCAT: 226,
    LPAREN: 227,
    RPAREN: 228,
    DOLLAR: 229,
    L_UNION_BRACKET: 230,
    R_UNION_BRACKET: 231,
    LBRACKET: 232,
    RBRACKET: 233,
    LSQUARE: 234,
    RSQUARE: 235,
    EQUAL: 236,
    BIND: 237,
    NOTEQUAL: 238,
    ANN_PERCENT: 239,
    HASH: 240,
    AMP: 241,
    COMMA: 242,
    QUESTION: 243,
    STAR: 244,
    PLUS: 245,
    MINUS: 246,
    SMALLER: 247,
    GREATER: 248,
    SMALLEREQ: 249,
    GREATEREQ: 250,
    SMALLER_SMALLER: 251,
    GREATER_GREATER: 252,
    SLASH: 253,
    SLASH_SLASH: 254,
    BANG: 255,
    DOT: 256,
    DOT_DOT: 257,
    COLON: 258,
    COLON_COLON: 259,
    EMPTY_CLOSE_TAG: 260,
    CLOSE_TAG: 261,
    SEMICOLON: 262,
    VBAR: 263,
    PRAGMA_START: 264,
    PRAGMA_END: 265,
    XML_COMMENT_START: 266,
    XML_COMMENT_END: 267,
    PI_START: 268,
    PI_END: 269,
    ATTR_SIGN: 270,
    Q: 271,
    CHARREF_DEC: 272,
    CHARREF_HEX: 273,
    APOS: 274,
    QUOT: 275,
    NCNameStartChar: 276,
    NCNameChar: 277,
    L_NCName: 278,
    Letter: 279,
    HexLetter: 280,
    Digit: 281,
    Digits: 282,
    S: 283,
    SU: 284,
    L_Pragma: 285,
    L_DirCommentConstructor: 286,
    L_DirPIConstructor: 287,
    L_IntegerLiteral: 288,
    L_DecimalLiteral: 289,
    L_DoubleLiteral: 290,
    L_Comment: 291,
    L_AnyChar: 292,
    L_QuotStringLiteralChar: 293,
    L_AposStringLiteralChar: 294
});

(function(){
var HIDDEN = org.antlr.runtime.Token.HIDDEN_CHANNEL,
    EOF = org.antlr.runtime.Token.EOF;
org.antlr.lang.extend(StringLexer, XQDTLexer, {
    EOF : -1,
    L_QuotAttrContentChar : 4,
    L_AposAttrContentChar : 5,
    L_ElementContentChar : 6,
    L_CDataSection : 7,
    L_PredefinedEntityRef : 8,
    L_CharRef : 9,
    ESCAPE_LBRACKET : 10,
    ESCAPE_RBRACKET : 11,
    ESCAPE_APOS : 12,
    ESCAPE_QUOT : 13,
    CDATA_START : 14,
    CDATA_END : 15,
    ANCESTOR : 16,
    ANCESTOR_OR_SELF : 17,
    AND : 18,
    AS : 19,
    ASCENDING : 20,
    AT : 21,
    ATTRIBUTE : 22,
    BASE_URI : 23,
    BOUNDARY_SPACE : 24,
    BY : 25,
    CASE : 26,
    CAST : 27,
    CASTABLE : 28,
    CHILD : 29,
    COLLATION : 30,
    COMMENT : 31,
    CONSTRUCTION : 32,
    COPY_NAMESPACES : 33,
    DECLARE : 34,
    DEFAULT : 35,
    DESCENDANT : 36,
    DESCENDANT_OR_SELF : 37,
    DESCENDING : 38,
    DIV : 39,
    DOCUMENT : 40,
    DOCUMENT_NODE : 41,
    ELEMENT : 42,
    ELSE : 43,
    EMPTY : 44,
    EMPTY_SEQUENCE : 45,
    ENCODING : 46,
    EQ : 47,
    EVERY : 48,
    EXCEPT : 49,
    EXTERNAL : 50,
    FOLLOWING : 51,
    FOLLOWING_SIBLING : 52,
    FOR : 53,
    FUNCTION : 54,
    GE : 55,
    GREATEST : 56,
    GT : 57,
    IDIV : 58,
    IF : 59,
    IMPORT : 60,
    IN : 61,
    INHERIT : 62,
    INSTANCE : 63,
    INTERSECT : 64,
    IS : 65,
    ITEM : 66,
    LAX : 67,
    LE : 68,
    LEAST : 69,
    LET : 70,
    LT : 71,
    MOD : 72,
    MODULE : 73,
    NAMESPACE : 74,
    NE : 75,
    NO_INHERIT : 76,
    NO_PRESERVE : 77,
    NODE : 78,
    JSON : 79,
    OF : 80,
    OPTION : 81,
    OR : 82,
    ORDER : 83,
    ORDERED : 84,
    ORDERING : 85,
    PARENT : 86,
    PRECEDING : 87,
    PRECEDING_SIBLING : 88,
    PRESERVE : 89,
    PROCESSING_INSTRUCTION : 90,
    STRUCTURED_ITEM : 91,
    JSON_ITEM : 92,
    OBJECT : 93,
    ARRAY : 94,
    RETURN : 95,
    SATISFIES : 96,
    SCHEMA : 97,
    SCHEMA_ATTRIBUTE : 98,
    SCHEMA_ELEMENT : 99,
    SELF : 100,
    SOME : 101,
    STABLE : 102,
    STRICT : 103,
    STRIP : 104,
    TEXT : 105,
    THEN : 106,
    TO : 107,
    TREAT : 108,
    TYPESWITCH : 109,
    UNION : 110,
    UNORDERED : 111,
    VALIDATE : 112,
    VARIABLE : 113,
    VERSION : 114,
    WHERE : 115,
    XQUERY : 116,
    ALLOWING : 117,
    CATCH : 118,
    CONTEXT : 119,
    COUNT : 120,
    DECIMAL_FORMAT : 121,
    DECIMAL_SEPARATOR : 122,
    DIGIT : 123,
    END : 124,
    GROUP : 125,
    GROUPING_SEPARATOR : 126,
    INFINITY : 127,
    MINUS_SIGN : 128,
    NAMESPACE_NODE : 129,
    NAN : 130,
    NEXT : 131,
    ONLY : 132,
    PATTERN_SEPARATOR : 133,
    PERCENT : 134,
    PER_MILLE : 135,
    PREVIOUS : 136,
    SLIDING : 137,
    START : 138,
    SWITCH : 139,
    TRY : 140,
    TUMBLING : 141,
    TYPE : 142,
    WHEN : 143,
    WINDOW : 144,
    ZERO_DIGIT : 145,
    AFTER : 146,
    BEFORE : 147,
    COPY : 148,
    DELETE : 149,
    FIRST : 150,
    INSERT : 151,
    INTO : 152,
    POSITION : 153,
    APPEND : 154,
    LAST : 155,
    MODIFY : 156,
    NODES : 157,
    RENAME : 158,
    REPLACE : 159,
    REVALIDATION : 160,
    SKIP : 161,
    UPDATING : 162,
    VALUE : 163,
    WITH : 164,
    ALL : 165,
    ANY : 166,
    CONTAINS : 167,
    CONTENT : 168,
    DIACRITICS : 169,
    DIFFERENT : 170,
    DISTANCE : 171,
    ENTIRE : 172,
    EXACTLY : 173,
    FROM : 174,
    FT_OPTION : 175,
    FTAND : 176,
    FTNOT : 177,
    FTOR : 178,
    INSENSITIVE : 179,
    LANGUAGE : 180,
    LEVELS : 181,
    LOWERCASE : 182,
    MOST : 183,
    NO : 184,
    NOT : 185,
    OCCURS : 186,
    PARAGRAPH : 187,
    PARAGRAPHS : 188,
    PHRASE : 189,
    RELATIONSHIP : 190,
    SAME : 191,
    SCORE : 192,
    SENSITIVE : 193,
    SENTENCE : 194,
    SENTENCES : 195,
    STEMMING : 196,
    STOP : 197,
    THESAURUS : 198,
    TIMES : 199,
    UPPERCASE : 200,
    USING : 201,
    WEIGHT : 202,
    WILDCARDS : 203,
    WITHOUT : 204,
    WORD : 205,
    WORDS : 206,
    BREAK : 207,
    CONTINUE : 208,
    EXIT : 209,
    LOOP : 210,
    RETURNING : 211,
    WHILE : 212,
    CHECK : 213,
    COLLECTION : 214,
    CONSTRAINT : 215,
    FOREACH : 216,
    FOREIGN : 217,
    INDEX : 218,
    INTEGRITY : 219,
    KEY : 220,
    ON : 221,
    UNIQUE : 222,
    AMP_ER : 223,
    APOS_ER : 224,
    QUOT_ER : 225,
    CONCAT : 226,
    LPAREN : 227,
    RPAREN : 228,
    DOLLAR : 229,
    L_UNION_BRACKET : 230,
    R_UNION_BRACKET : 231,
    LBRACKET : 232,
    RBRACKET : 233,
    LSQUARE : 234,
    RSQUARE : 235,
    EQUAL : 236,
    BIND : 237,
    NOTEQUAL : 238,
    ANN_PERCENT : 239,
    HASH : 240,
    AMP : 241,
    COMMA : 242,
    QUESTION : 243,
    STAR : 244,
    PLUS : 245,
    MINUS : 246,
    SMALLER : 247,
    GREATER : 248,
    SMALLEREQ : 249,
    GREATEREQ : 250,
    SMALLER_SMALLER : 251,
    GREATER_GREATER : 252,
    SLASH : 253,
    SLASH_SLASH : 254,
    BANG : 255,
    DOT : 256,
    DOT_DOT : 257,
    COLON : 258,
    COLON_COLON : 259,
    EMPTY_CLOSE_TAG : 260,
    CLOSE_TAG : 261,
    SEMICOLON : 262,
    VBAR : 263,
    PRAGMA_START : 264,
    PRAGMA_END : 265,
    XML_COMMENT_START : 266,
    XML_COMMENT_END : 267,
    PI_START : 268,
    PI_END : 269,
    ATTR_SIGN : 270,
    Q : 271,
    CHARREF_DEC : 272,
    CHARREF_HEX : 273,
    APOS : 274,
    QUOT : 275,
    NCNameStartChar : 276,
    NCNameChar : 277,
    L_NCName : 278,
    Letter : 279,
    HexLetter : 280,
    Digit : 281,
    Digits : 282,
    S : 283,
    SU : 284,
    L_Pragma : 285,
    L_DirCommentConstructor : 286,
    L_DirPIConstructor : 287,
    L_IntegerLiteral : 288,
    L_DecimalLiteral : 289,
    L_DoubleLiteral : 290,
    L_Comment : 291,
    L_AnyChar : 292,
    L_QuotStringLiteralChar : 293,
    L_AposStringLiteralChar : 294,
    getGrammarFileName: function() { return "/Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g"; }
});
org.antlr.lang.augmentObject(StringLexer.prototype, {
    // $ANTLR start QUOT
    mQUOT: function()  {
        try {
            var _type = this.QUOT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:66:6: ({...}? => '\"' )
            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:66:8: {...}? => '\"'
            if ( !(( this.inQuotStr )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "QUOT", " this.inQuotStr ");
            }
            this.match('\"'); 
             this.inQuotStr = !this.inQuotStr; 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "QUOT",

    // $ANTLR start APOS
    mAPOS: function()  {
        try {
            var _type = this.APOS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:67:6: ({...}? => '\\'' )
            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:67:8: {...}? => '\\''
            if ( !(( this.inAposStr )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "APOS", " this.inAposStr ");
            }
            this.match('\''); 
             this.inAposStr = !this.inAposStr; 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "APOS",

    // $ANTLR start ESCAPE_QUOT
    mESCAPE_QUOT: function()  {
        try {
            var _type = this.ESCAPE_QUOT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:68:13: ({...}? => '\"\"' )
            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:68:15: {...}? => '\"\"'
            if ( !(( this.inQuotStr )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "ESCAPE_QUOT", " this.inQuotStr ");
            }
            this.match("\"\""); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ESCAPE_QUOT",

    // $ANTLR start ESCAPE_APOS
    mESCAPE_APOS: function()  {
        try {
            var _type = this.ESCAPE_APOS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:69:13: ({...}? => '\\'\\'' )
            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:69:15: {...}? => '\\'\\''
            if ( !(( this.inAposStr )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "ESCAPE_APOS", " this.inAposStr ");
            }
            this.match("''"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ESCAPE_APOS",

    // $ANTLR start L_PredefinedEntityRef
    mL_PredefinedEntityRef: function()  {
        try {
            var _type = this.L_PredefinedEntityRef;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:73:2: ({...}? => '&' ( 'lt' | 'gt' | 'apos' | 'quot' | 'amp' ) ';' )
            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:73:4: {...}? => '&' ( 'lt' | 'gt' | 'apos' | 'quot' | 'amp' ) ';'
            if ( !(( this.inQuotStr | this.inAposStr )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "L_PredefinedEntityRef", " this.inQuotStr | this.inAposStr ");
            }
            this.match('&'); 
            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:73:48: ( 'lt' | 'gt' | 'apos' | 'quot' | 'amp' )
            var alt1=5;
            switch ( this.input.LA(1) ) {
            case 'l':
                alt1=1;
                break;
            case 'g':
                alt1=2;
                break;
            case 'a':
                var LA1_3 = this.input.LA(2);

                if ( (LA1_3=='p') ) {
                    alt1=3;
                }
                else if ( (LA1_3=='m') ) {
                    alt1=5;
                }
                else {
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 1, 3, this.input);

                    throw nvae;
                }
                break;
            case 'q':
                alt1=4;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 1, 0, this.input);

                throw nvae;
            }

            switch (alt1) {
                case 1 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:73:49: 'lt'
                    this.match("lt"); 



                    break;
                case 2 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:73:56: 'gt'
                    this.match("gt"); 



                    break;
                case 3 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:73:63: 'apos'
                    this.match("apos"); 



                    break;
                case 4 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:73:72: 'quot'
                    this.match("quot"); 



                    break;
                case 5 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:73:81: 'amp'
                    this.match("amp"); 



                    break;

            }

            this.match(';'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "L_PredefinedEntityRef",

    // $ANTLR start L_CharRef
    mL_CharRef: function()  {
        try {
            var _type = this.L_CharRef;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:78:2: ({...}? => '&#' ( '0' .. '9' )+ ';' | '&#x' ( '0' .. '9' | 'a' .. 'f' | 'A' .. 'F' )+ ';' )
            var alt4=2;
            var LA4_0 = this.input.LA(1);

            if ( (LA4_0=='&') ) {
                var LA4_1 = this.input.LA(2);

                if ( (LA4_1=='#') ) {
                    var LA4_2 = this.input.LA(3);

                    if ( (LA4_2=='x') ) {
                        alt4=2;
                    }
                    else if ( ((LA4_2>='0' && LA4_2<='9')) && (( this.inQuotStr | this.inAposStr ))) {
                        alt4=1;
                    }
                    else {
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 4, 2, this.input);

                        throw nvae;
                    }
                }
                else {
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 4, 1, this.input);

                    throw nvae;
                }
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 4, 0, this.input);

                throw nvae;
            }
            switch (alt4) {
                case 1 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:78:4: {...}? => '&#' ( '0' .. '9' )+ ';'
                    if ( !(( this.inQuotStr | this.inAposStr )) ) {
                        throw new org.antlr.runtime.FailedPredicateException(this.input, "L_CharRef", " this.inQuotStr | this.inAposStr ");
                    }
                    this.match("&#"); 

                    // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:78:49: ( '0' .. '9' )+
                    var cnt2=0;
                    loop2:
                    do {
                        var alt2=2;
                        var LA2_0 = this.input.LA(1);

                        if ( ((LA2_0>='0' && LA2_0<='9')) ) {
                            alt2=1;
                        }


                        switch (alt2) {
                        case 1 :
                            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:78:49: '0' .. '9'
                            this.matchRange('0','9'); 


                            break;

                        default :
                            if ( cnt2 >= 1 ) {
                                break loop2;
                            }
                                var eee = new org.antlr.runtime.EarlyExitException(2, this.input);
                                throw eee;
                        }
                        cnt2++;
                    } while (true);

                    this.match(';'); 


                    break;
                case 2 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:78:65: '&#x' ( '0' .. '9' | 'a' .. 'f' | 'A' .. 'F' )+ ';'
                    this.match("&#x"); 

                    // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:78:71: ( '0' .. '9' | 'a' .. 'f' | 'A' .. 'F' )+
                    var cnt3=0;
                    loop3:
                    do {
                        var alt3=2;
                        var LA3_0 = this.input.LA(1);

                        if ( ((LA3_0>='0' && LA3_0<='9')||(LA3_0>='A' && LA3_0<='F')||(LA3_0>='a' && LA3_0<='f')) ) {
                            alt3=1;
                        }


                        switch (alt3) {
                        case 1 :
                            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:
                            if ( (this.input.LA(1)>='0' && this.input.LA(1)<='9')||(this.input.LA(1)>='A' && this.input.LA(1)<='F')||(this.input.LA(1)>='a' && this.input.LA(1)<='f') ) {
                                this.input.consume();

                            }
                            else {
                                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                                this.recover(mse);
                                throw mse;}



                            break;

                        default :
                            if ( cnt3 >= 1 ) {
                                break loop3;
                            }
                                var eee = new org.antlr.runtime.EarlyExitException(3, this.input);
                                throw eee;
                        }
                        cnt3++;
                    } while (true);

                    this.match(';'); 


                    break;

            }
            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "L_CharRef",

    // $ANTLR start L_QuotStringLiteralChar
    mL_QuotStringLiteralChar: function()  {
        try {
            var _type = this.L_QuotStringLiteralChar;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:82:2: ({...}? => ( '\\u0009' | '\\u000A' | '\\u000D' | '\\u0020' .. '\\u0021' | '\\u0023' .. '\\u0025' | '\\u0027' .. '\\uD7FF' | '\\uE000' .. '\\uFFFD' )+ )
            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:82:4: {...}? => ( '\\u0009' | '\\u000A' | '\\u000D' | '\\u0020' .. '\\u0021' | '\\u0023' .. '\\u0025' | '\\u0027' .. '\\uD7FF' | '\\uE000' .. '\\uFFFD' )+
            if ( !(( this.inQuotStr )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "L_QuotStringLiteralChar", " this.inQuotStr ");
            }
            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:83:3: ( '\\u0009' | '\\u000A' | '\\u000D' | '\\u0020' .. '\\u0021' | '\\u0023' .. '\\u0025' | '\\u0027' .. '\\uD7FF' | '\\uE000' .. '\\uFFFD' )+
            var cnt5=0;
            loop5:
            do {
                var alt5=2;
                var LA5_0 = this.input.LA(1);

                if ( ((LA5_0>='\t' && LA5_0<='\n')||LA5_0=='\r'||(LA5_0>=' ' && LA5_0<='!')||(LA5_0>='#' && LA5_0<='%')||(LA5_0>='\'' && LA5_0<='\uD7FF')||(LA5_0>='\uE000' && LA5_0<='\uFFFD')) ) {
                    alt5=1;
                }


                switch (alt5) {
                case 1 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:
                    if ( (this.input.LA(1)>='\t' && this.input.LA(1)<='\n')||this.input.LA(1)=='\r'||(this.input.LA(1)>=' ' && this.input.LA(1)<='!')||(this.input.LA(1)>='#' && this.input.LA(1)<='%')||(this.input.LA(1)>='\'' && this.input.LA(1)<='\uD7FF')||(this.input.LA(1)>='\uE000' && this.input.LA(1)<='\uFFFD') ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;

                default :
                    if ( cnt5 >= 1 ) {
                        break loop5;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(5, this.input);
                        throw eee;
                }
                cnt5++;
            } while (true);




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "L_QuotStringLiteralChar",

    // $ANTLR start L_AposStringLiteralChar
    mL_AposStringLiteralChar: function()  {
        try {
            var _type = this.L_AposStringLiteralChar;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:88:2: ({...}? => ( '\\u0009' | '\\u000A' | '\\u000D' | '\\u0020' .. '\\u0025' | '\\u0028' .. '\\uD7FF' | '\\uE000' .. '\\uFFFD' )+ )
            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:88:4: {...}? => ( '\\u0009' | '\\u000A' | '\\u000D' | '\\u0020' .. '\\u0025' | '\\u0028' .. '\\uD7FF' | '\\uE000' .. '\\uFFFD' )+
            if ( !(( this.inAposStr )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "L_AposStringLiteralChar", " this.inAposStr ");
            }
            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:89:3: ( '\\u0009' | '\\u000A' | '\\u000D' | '\\u0020' .. '\\u0025' | '\\u0028' .. '\\uD7FF' | '\\uE000' .. '\\uFFFD' )+
            var cnt6=0;
            loop6:
            do {
                var alt6=2;
                var LA6_0 = this.input.LA(1);

                if ( ((LA6_0>='\t' && LA6_0<='\n')||LA6_0=='\r'||(LA6_0>=' ' && LA6_0<='%')||(LA6_0>='(' && LA6_0<='\uD7FF')||(LA6_0>='\uE000' && LA6_0<='\uFFFD')) ) {
                    alt6=1;
                }


                switch (alt6) {
                case 1 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:
                    if ( (this.input.LA(1)>='\t' && this.input.LA(1)<='\n')||this.input.LA(1)=='\r'||(this.input.LA(1)>=' ' && this.input.LA(1)<='%')||(this.input.LA(1)>='(' && this.input.LA(1)<='\uD7FF')||(this.input.LA(1)>='\uE000' && this.input.LA(1)<='\uFFFD') ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;

                default :
                    if ( cnt6 >= 1 ) {
                        break loop6;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(6, this.input);
                        throw eee;
                }
                cnt6++;
            } while (true);




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "L_AposStringLiteralChar",

    // $ANTLR start L_AnyChar
    mL_AnyChar: function()  {
        try {
            var _type = this.L_AnyChar;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:98:5: ({...}? => ( '\\u0009' | '\\u000A' | '\\u000D' | '\\u0020' .. '\\u0025' | '\\u0027' .. '\\u003B' | '\\u003D' .. '\\u007A' | '\\u007C' | '\\u007E' .. '\\uD7FF' | '\\uE000' .. '\\uFFFD' )+ )
            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:98:9: {...}? => ( '\\u0009' | '\\u000A' | '\\u000D' | '\\u0020' .. '\\u0025' | '\\u0027' .. '\\u003B' | '\\u003D' .. '\\u007A' | '\\u007C' | '\\u007E' .. '\\uD7FF' | '\\uE000' .. '\\uFFFD' )+
            if ( !(( !this.inQuotStr && !this.inAposStr )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "L_AnyChar", " !this.inQuotStr && !this.inAposStr ");
            }
            // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:99:9: ( '\\u0009' | '\\u000A' | '\\u000D' | '\\u0020' .. '\\u0025' | '\\u0027' .. '\\u003B' | '\\u003D' .. '\\u007A' | '\\u007C' | '\\u007E' .. '\\uD7FF' | '\\uE000' .. '\\uFFFD' )+
            var cnt7=0;
            loop7:
            do {
                var alt7=2;
                var LA7_0 = this.input.LA(1);

                if ( ((LA7_0>='\t' && LA7_0<='\n')||LA7_0=='\r'||(LA7_0>=' ' && LA7_0<='%')||(LA7_0>='\'' && LA7_0<=';')||(LA7_0>='=' && LA7_0<='z')||LA7_0=='|'||(LA7_0>='~' && LA7_0<='\uD7FF')||(LA7_0>='\uE000' && LA7_0<='\uFFFD')) ) {
                    alt7=1;
                }


                switch (alt7) {
                case 1 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:
                    if ( (this.input.LA(1)>='\t' && this.input.LA(1)<='\n')||this.input.LA(1)=='\r'||(this.input.LA(1)>=' ' && this.input.LA(1)<='%')||(this.input.LA(1)>='\'' && this.input.LA(1)<=';')||(this.input.LA(1)>='=' && this.input.LA(1)<='z')||this.input.LA(1)=='|'||(this.input.LA(1)>='~' && this.input.LA(1)<='\uD7FF')||(this.input.LA(1)>='\uE000' && this.input.LA(1)<='\uFFFD') ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;

                default :
                    if ( cnt7 >= 1 ) {
                        break loop7;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(7, this.input);
                        throw eee;
                }
                cnt7++;
            } while (true);




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "L_AnyChar",

    mTokens: function() {
        // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:1:8: ( QUOT | APOS | ESCAPE_QUOT | ESCAPE_APOS | L_PredefinedEntityRef | L_CharRef | L_QuotStringLiteralChar | L_AposStringLiteralChar | L_AnyChar )
        var alt8=9;
        alt8 = this.dfa8.predict(this.input);
        switch (alt8) {
            case 1 :
                // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:1:10: QUOT
                this.mQUOT(); 


                break;
            case 2 :
                // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:1:15: APOS
                this.mAPOS(); 


                break;
            case 3 :
                // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:1:20: ESCAPE_QUOT
                this.mESCAPE_QUOT(); 


                break;
            case 4 :
                // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:1:32: ESCAPE_APOS
                this.mESCAPE_APOS(); 


                break;
            case 5 :
                // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:1:44: L_PredefinedEntityRef
                this.mL_PredefinedEntityRef(); 


                break;
            case 6 :
                // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:1:66: L_CharRef
                this.mL_CharRef(); 


                break;
            case 7 :
                // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:1:76: L_QuotStringLiteralChar
                this.mL_QuotStringLiteralChar(); 


                break;
            case 8 :
                // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:1:100: L_AposStringLiteralChar
                this.mL_AposStringLiteralChar(); 


                break;
            case 9 :
                // /Users/wcandillon/28msec/xquery.js/xquery/StringLexer.g:1:124: L_AnyChar
                this.mL_AnyChar(); 


                break;

        }

    }

}, true); // important to pass true to overwrite default implementations

org.antlr.lang.augmentObject(StringLexer, {
    DFA8_eotS:
        "\u0001\uffff\u0001\u0007\u0001\u000c\u0001\uffff\u0001\u0011\u0001"+
    "\u0012\u0001\u0013\u0001\uffff\u0001\u0015\u0002\uffff\u0001\u0016\u0001"+
    "\uffff\u0001\u0018\u000d\uffff",
    DFA8_eofS:
        "\u001b\uffff",
    DFA8_minS:
        "\u0003\u0009\u0001\u0023\u0003\u0009\u0001\u0000\u0001\u0009\u0002"+
    "\uffff\u0001\u0009\u0001\u0000\u0001\u0009\u0003\uffff\u0003\u0000\u0001"+
    "\uffff\u0002\u0000\u0001\uffff\u0001\u0000\u0002\uffff",
    DFA8_maxS:
        "\u0003\ufffd\u0001\u0071\u0003\ufffd\u0001\u0000\u0001\ufffd\u0002"+
    "\uffff\u0001\ufffd\u0001\u0000\u0001\ufffd\u0003\uffff\u0003\u0000\u0001"+
    "\uffff\u0002\u0000\u0001\uffff\u0001\u0000\u0002\uffff",
    DFA8_acceptS:
        "\u0009\uffff\u0001\u0008\u0001\u0009\u0003\uffff\u0001\u0007\u0001"+
    "\u0006\u0001\u0005\u0003\uffff\u0001\u0001\u0002\uffff\u0001\u0002\u0001"+
    "\uffff\u0001\u0003\u0001\u0004",
    DFA8_specialS:
        "\u0001\u0007\u0001\u000e\u0001\u0000\u0001\u0004\u0001\u0011\u0001"+
    "\u000a\u0001\u0005\u0001\u0009\u0001\u0010\u0002\uffff\u0001\u000f\u0001"+
    "\u0008\u0001\u0006\u0003\uffff\u0001\u000d\u0001\u0003\u0001\u000b\u0001"+
    "\uffff\u0001\u0001\u0001\u000c\u0001\uffff\u0001\u0002\u0002\uffff}>",
    DFA8_transitionS: [
            "\u0002\u0004\u0002\uffff\u0001\u0004\u0012\uffff\u0002\u0004"+
            "\u0001\u0001\u0003\u0004\u0001\u0003\u0001\u0002\u0014\u0004"+
            "\u0001\u0005\u003e\u0004\u0001\u0005\u0001\u0004\u0001\u0005"+
            "\ud782\u0004\u0800\uffff\u1ffe\u0004",
            "\u0002\u0008\u0002\uffff\u0001\u0008\u0012\uffff\u0002\u0008"+
            "\u0001\u0006\u0003\u0008\u0001\uffff\u0001\u000a\u0014\u0008"+
            "\u0001\u0009\u003e\u0008\u0001\u0009\u0001\u0008\u0001\u0009"+
            "\ud782\u0008\u0800\uffff\u1ffe\u0008",
            "\u0002\u000d\u0002\uffff\u0001\u000d\u0012\uffff\u0002\u000d"+
            "\u0001\u000a\u0003\u000d\u0001\uffff\u0001\u000b\u0014\u000d"+
            "\u0001\u000e\u003e\u000d\u0001\u000e\u0001\u000d\u0001\u000e"+
            "\ud782\u000d\u0800\uffff\u1ffe\u000d",
            "\u0001\u000f\u003d\uffff\u0001\u0010\u0005\uffff\u0001\u0010"+
            "\u0004\uffff\u0001\u0010\u0004\uffff\u0001\u0010",
            "\u0002\u0004\u0002\uffff\u0001\u0004\u0012\uffff\u0002\u0004"+
            "\u0001\u0008\u0003\u0004\u0001\uffff\u0001\u000d\u0014\u0004"+
            "\u0001\u0005\u003e\u0004\u0001\u0005\u0001\u0004\u0001\u0005"+
            "\ud782\u0004\u0800\uffff\u1ffe\u0004",
            "\u0002\u0005\u0002\uffff\u0001\u0005\u0012\uffff\u0002\u0005"+
            "\u0001\u0009\u0003\u0005\u0001\uffff\u0001\u000e\ud7d8\u0005"+
            "\u0800\uffff\u1ffe\u0005",
            "\u0002\u0008\u0002\uffff\u0001\u0008\u0012\uffff\u0006\u0008"+
            "\u0001\uffff\u0001\u000a\u0014\u0008\u0001\u0009\u003e\u0008"+
            "\u0001\u0009\u0001\u0008\u0001\u0009\ud782\u0008\u0800\uffff"+
            "\u1ffe\u0008",
            "\u0001\uffff",
            "\u0002\u0008\u0002\uffff\u0001\u0008\u0012\uffff\u0006\u0008"+
            "\u0001\uffff\u0001\u000a\u0014\u0008\u0001\u0009\u003e\u0008"+
            "\u0001\u0009\u0001\u0008\u0001\u0009\ud782\u0008\u0800\uffff"+
            "\u1ffe\u0008",
            "",
            "",
            "\u0002\u000d\u0002\uffff\u0001\u000d\u0012\uffff\u0002\u000d"+
            "\u0001\u000a\u0003\u000d\u0001\uffff\u0015\u000d\u0001\u000e"+
            "\u003e\u000d\u0001\u000e\u0001\u000d\u0001\u000e\ud782\u000d"+
            "\u0800\uffff\u1ffe\u000d",
            "\u0001\uffff",
            "\u0002\u000d\u0002\uffff\u0001\u000d\u0012\uffff\u0002\u000d"+
            "\u0001\u000a\u0003\u000d\u0001\uffff\u0015\u000d\u0001\u000e"+
            "\u003e\u000d\u0001\u000e\u0001\u000d\u0001\u000e\ud782\u000d"+
            "\u0800\uffff\u1ffe\u000d",
            "",
            "",
            "",
            "\u0001\uffff",
            "\u0001\uffff",
            "\u0001\uffff",
            "",
            "\u0001\uffff",
            "\u0001\uffff",
            "",
            "\u0001\uffff",
            "",
            ""
    ]
});

org.antlr.lang.augmentObject(StringLexer, {
    DFA8_eot:
        org.antlr.runtime.DFA.unpackEncodedString(StringLexer.DFA8_eotS),
    DFA8_eof:
        org.antlr.runtime.DFA.unpackEncodedString(StringLexer.DFA8_eofS),
    DFA8_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(StringLexer.DFA8_minS),
    DFA8_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(StringLexer.DFA8_maxS),
    DFA8_accept:
        org.antlr.runtime.DFA.unpackEncodedString(StringLexer.DFA8_acceptS),
    DFA8_special:
        org.antlr.runtime.DFA.unpackEncodedString(StringLexer.DFA8_specialS),
    DFA8_transition: (function() {
        var a = [],
            i,
            numStates = StringLexer.DFA8_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(StringLexer.DFA8_transitionS[i]));
        }
        return a;
    })()
});

StringLexer.DFA8 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 8;
    this.eot = StringLexer.DFA8_eot;
    this.eof = StringLexer.DFA8_eof;
    this.min = StringLexer.DFA8_min;
    this.max = StringLexer.DFA8_max;
    this.accept = StringLexer.DFA8_accept;
    this.special = StringLexer.DFA8_special;
    this.transition = StringLexer.DFA8_transition;
};

org.antlr.lang.extend(StringLexer.DFA8, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "1:1: Tokens : ( QUOT | APOS | ESCAPE_QUOT | ESCAPE_APOS | L_PredefinedEntityRef | L_CharRef | L_QuotStringLiteralChar | L_AposStringLiteralChar | L_AnyChar );";
    },
    specialStateTransition: function(s, input) {
        var _s = s;
        /* bind to recognizer so semantic predicates can be evaluated */
        var retval = (function(s, input) {
            switch ( s ) {
                        case 0 : 
                            var LA8_2 = input.LA(1);

                             
                            var index8_2 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (LA8_2=='\'') && ((( this.inAposStr )||( this.inQuotStr )||( !this.inQuotStr && !this.inAposStr )))) {s = 11;}

                            else if ( ((LA8_2>='\t' && LA8_2<='\n')||LA8_2=='\r'||(LA8_2>=' ' && LA8_2<='!')||(LA8_2>='#' && LA8_2<='%')||(LA8_2>='(' && LA8_2<=';')||(LA8_2>='=' && LA8_2<='z')||LA8_2=='|'||(LA8_2>='~' && LA8_2<='\uD7FF')||(LA8_2>='\uE000' && LA8_2<='\uFFFD')) && ((( this.inQuotStr )||( !this.inQuotStr && !this.inAposStr )))) {s = 13;}

                            else if ( (LA8_2=='<'||LA8_2=='{'||LA8_2=='}') && (( this.inQuotStr ))) {s = 14;}

                            else if ( (LA8_2=='\"') && (( !this.inQuotStr && !this.inAposStr ))) {s = 10;}

                            else s = 12;

                             
                            input.seek(index8_2);
                            if ( s>=0 ) return s;
                            break;
                        case 1 : 
                            var LA8_21 = input.LA(1);

                             
                            var index8_21 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( this.inAposStr )) ) {s = 9;}

                            else if ( (( !this.inQuotStr && !this.inAposStr )) ) {s = 10;}

                             
                            input.seek(index8_21);
                            if ( s>=0 ) return s;
                            break;
                        case 2 : 
                            var LA8_24 = input.LA(1);

                             
                            var index8_24 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( this.inQuotStr )) ) {s = 14;}

                            else if ( (( !this.inQuotStr && !this.inAposStr )) ) {s = 10;}

                             
                            input.seek(index8_24);
                            if ( s>=0 ) return s;
                            break;
                        case 3 : 
                            var LA8_18 = input.LA(1);

                             
                            var index8_18 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( this.inQuotStr )) ) {s = 14;}

                            else if ( (( this.inAposStr )) ) {s = 9;}

                             
                            input.seek(index8_18);
                            if ( s>=0 ) return s;
                            break;
                        case 4 : 
                            var LA8_3 = input.LA(1);

                             
                            var index8_3 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (LA8_3=='#') ) {s = 15;}

                            else if ( (LA8_3=='a'||LA8_3=='g'||LA8_3=='l'||LA8_3=='q') && (( this.inQuotStr | this.inAposStr ))) {s = 16;}

                             
                            input.seek(index8_3);
                            if ( s>=0 ) return s;
                            break;
                        case 5 : 
                            var LA8_6 = input.LA(1);

                             
                            var index8_6 = input.index();
                            input.rewind();
                            s = -1;
                            if ( ((LA8_6>='\t' && LA8_6<='\n')||LA8_6=='\r'||(LA8_6>=' ' && LA8_6<='%')||(LA8_6>='(' && LA8_6<=';')||(LA8_6>='=' && LA8_6<='z')||LA8_6=='|'||(LA8_6>='~' && LA8_6<='\uD7FF')||(LA8_6>='\uE000' && LA8_6<='\uFFFD')) && ((( this.inAposStr )||( !this.inQuotStr && !this.inAposStr )))) {s = 8;}

                            else if ( (LA8_6=='<'||LA8_6=='{'||LA8_6=='}') && (( this.inAposStr ))) {s = 9;}

                            else if ( (LA8_6=='\'') && (( !this.inQuotStr && !this.inAposStr ))) {s = 10;}

                            else s = 19;

                             
                            input.seek(index8_6);
                            if ( s>=0 ) return s;
                            break;
                        case 6 : 
                            var LA8_13 = input.LA(1);

                             
                            var index8_13 = input.index();
                            input.rewind();
                            s = -1;
                            if ( ((LA8_13>='\t' && LA8_13<='\n')||LA8_13=='\r'||(LA8_13>=' ' && LA8_13<='!')||(LA8_13>='#' && LA8_13<='%')||(LA8_13>='\'' && LA8_13<=';')||(LA8_13>='=' && LA8_13<='z')||LA8_13=='|'||(LA8_13>='~' && LA8_13<='\uD7FF')||(LA8_13>='\uE000' && LA8_13<='\uFFFD')) && ((( this.inQuotStr )||( !this.inQuotStr && !this.inAposStr )))) {s = 13;}

                            else if ( (LA8_13=='<'||LA8_13=='{'||LA8_13=='}') && (( this.inQuotStr ))) {s = 14;}

                            else if ( (LA8_13=='\"') && (( !this.inQuotStr && !this.inAposStr ))) {s = 10;}

                            else s = 24;

                             
                            input.seek(index8_13);
                            if ( s>=0 ) return s;
                            break;
                        case 7 : 
                            var LA8_0 = input.LA(1);

                             
                            var index8_0 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (LA8_0=='\"') && ((( this.inAposStr )||( this.inQuotStr )||( !this.inQuotStr && !this.inAposStr )))) {s = 1;}

                            else if ( (LA8_0=='\'') && ((( this.inAposStr )||( this.inQuotStr )||( !this.inQuotStr && !this.inAposStr )))) {s = 2;}

                            else if ( (LA8_0=='&') ) {s = 3;}

                            else if ( ((LA8_0>='\t' && LA8_0<='\n')||LA8_0=='\r'||(LA8_0>=' ' && LA8_0<='!')||(LA8_0>='#' && LA8_0<='%')||(LA8_0>='(' && LA8_0<=';')||(LA8_0>='=' && LA8_0<='z')||LA8_0=='|'||(LA8_0>='~' && LA8_0<='\uD7FF')||(LA8_0>='\uE000' && LA8_0<='\uFFFD')) && ((( this.inAposStr )||( this.inQuotStr )||( !this.inQuotStr && !this.inAposStr )))) {s = 4;}

                            else if ( (LA8_0=='<'||LA8_0=='{'||LA8_0=='}') && ((( this.inAposStr )||( this.inQuotStr )))) {s = 5;}

                             
                            input.seek(index8_0);
                            if ( s>=0 ) return s;
                            break;
                        case 8 : 
                            var LA8_12 = input.LA(1);

                             
                            var index8_12 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( this.inAposStr )) ) {s = 23;}

                            else if ( (( this.inQuotStr )) ) {s = 14;}

                            else if ( (( !this.inQuotStr && !this.inAposStr )) ) {s = 10;}

                             
                            input.seek(index8_12);
                            if ( s>=0 ) return s;
                            break;
                        case 9 : 
                            var LA8_7 = input.LA(1);

                             
                            var index8_7 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( this.inQuotStr )) ) {s = 20;}

                            else if ( (( this.inAposStr )) ) {s = 9;}

                            else if ( (( !this.inQuotStr && !this.inAposStr )) ) {s = 10;}

                             
                            input.seek(index8_7);
                            if ( s>=0 ) return s;
                            break;
                        case 10 : 
                            var LA8_5 = input.LA(1);

                             
                            var index8_5 = input.index();
                            input.rewind();
                            s = -1;
                            if ( ((LA8_5>='\t' && LA8_5<='\n')||LA8_5=='\r'||(LA8_5>=' ' && LA8_5<='!')||(LA8_5>='#' && LA8_5<='%')||(LA8_5>='(' && LA8_5<='\uD7FF')||(LA8_5>='\uE000' && LA8_5<='\uFFFD')) && ((( this.inAposStr )||( this.inQuotStr )))) {s = 5;}

                            else if ( (LA8_5=='\'') && (( this.inQuotStr ))) {s = 14;}

                            else if ( (LA8_5=='\"') && (( this.inAposStr ))) {s = 9;}

                            else s = 18;

                             
                            input.seek(index8_5);
                            if ( s>=0 ) return s;
                            break;
                        case 11 : 
                            var LA8_19 = input.LA(1);

                             
                            var index8_19 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( this.inQuotStr )) ) {s = 25;}

                            else if ( (( this.inAposStr )) ) {s = 9;}

                            else if ( (( !this.inQuotStr && !this.inAposStr )) ) {s = 10;}

                             
                            input.seek(index8_19);
                            if ( s>=0 ) return s;
                            break;
                        case 12 : 
                            var LA8_22 = input.LA(1);

                             
                            var index8_22 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( this.inAposStr )) ) {s = 26;}

                            else if ( (( this.inQuotStr )) ) {s = 14;}

                            else if ( (( !this.inQuotStr && !this.inAposStr )) ) {s = 10;}

                             
                            input.seek(index8_22);
                            if ( s>=0 ) return s;
                            break;
                        case 13 : 
                            var LA8_17 = input.LA(1);

                             
                            var index8_17 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( this.inQuotStr )) ) {s = 14;}

                            else if ( (( this.inAposStr )) ) {s = 9;}

                            else if ( (( !this.inQuotStr && !this.inAposStr )) ) {s = 10;}

                             
                            input.seek(index8_17);
                            if ( s>=0 ) return s;
                            break;
                        case 14 : 
                            var LA8_1 = input.LA(1);

                             
                            var index8_1 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (LA8_1=='\"') && ((( this.inAposStr )||( this.inQuotStr )||( !this.inQuotStr && !this.inAposStr )))) {s = 6;}

                            else if ( ((LA8_1>='\t' && LA8_1<='\n')||LA8_1=='\r'||(LA8_1>=' ' && LA8_1<='!')||(LA8_1>='#' && LA8_1<='%')||(LA8_1>='(' && LA8_1<=';')||(LA8_1>='=' && LA8_1<='z')||LA8_1=='|'||(LA8_1>='~' && LA8_1<='\uD7FF')||(LA8_1>='\uE000' && LA8_1<='\uFFFD')) && ((( this.inAposStr )||( !this.inQuotStr && !this.inAposStr )))) {s = 8;}

                            else if ( (LA8_1=='<'||LA8_1=='{'||LA8_1=='}') && (( this.inAposStr ))) {s = 9;}

                            else if ( (LA8_1=='\'') && (( !this.inQuotStr && !this.inAposStr ))) {s = 10;}

                            else s = 7;

                             
                            input.seek(index8_1);
                            if ( s>=0 ) return s;
                            break;
                        case 15 : 
                            var LA8_11 = input.LA(1);

                             
                            var index8_11 = input.index();
                            input.rewind();
                            s = -1;
                            if ( ((LA8_11>='\t' && LA8_11<='\n')||LA8_11=='\r'||(LA8_11>=' ' && LA8_11<='!')||(LA8_11>='#' && LA8_11<='%')||(LA8_11>='\'' && LA8_11<=';')||(LA8_11>='=' && LA8_11<='z')||LA8_11=='|'||(LA8_11>='~' && LA8_11<='\uD7FF')||(LA8_11>='\uE000' && LA8_11<='\uFFFD')) && ((( this.inQuotStr )||( !this.inQuotStr && !this.inAposStr )))) {s = 13;}

                            else if ( (LA8_11=='<'||LA8_11=='{'||LA8_11=='}') && (( this.inQuotStr ))) {s = 14;}

                            else if ( (LA8_11=='\"') && (( !this.inQuotStr && !this.inAposStr ))) {s = 10;}

                            else s = 22;

                             
                            input.seek(index8_11);
                            if ( s>=0 ) return s;
                            break;
                        case 16 : 
                            var LA8_8 = input.LA(1);

                             
                            var index8_8 = input.index();
                            input.rewind();
                            s = -1;
                            if ( ((LA8_8>='\t' && LA8_8<='\n')||LA8_8=='\r'||(LA8_8>=' ' && LA8_8<='%')||(LA8_8>='(' && LA8_8<=';')||(LA8_8>='=' && LA8_8<='z')||LA8_8=='|'||(LA8_8>='~' && LA8_8<='\uD7FF')||(LA8_8>='\uE000' && LA8_8<='\uFFFD')) && ((( this.inAposStr )||( !this.inQuotStr && !this.inAposStr )))) {s = 8;}

                            else if ( (LA8_8=='<'||LA8_8=='{'||LA8_8=='}') && (( this.inAposStr ))) {s = 9;}

                            else if ( (LA8_8=='\'') && (( !this.inQuotStr && !this.inAposStr ))) {s = 10;}

                            else s = 21;

                             
                            input.seek(index8_8);
                            if ( s>=0 ) return s;
                            break;
                        case 17 : 
                            var LA8_4 = input.LA(1);

                             
                            var index8_4 = input.index();
                            input.rewind();
                            s = -1;
                            if ( ((LA8_4>='\t' && LA8_4<='\n')||LA8_4=='\r'||(LA8_4>=' ' && LA8_4<='!')||(LA8_4>='#' && LA8_4<='%')||(LA8_4>='(' && LA8_4<=';')||(LA8_4>='=' && LA8_4<='z')||LA8_4=='|'||(LA8_4>='~' && LA8_4<='\uD7FF')||(LA8_4>='\uE000' && LA8_4<='\uFFFD')) && ((( this.inAposStr )||( this.inQuotStr )||( !this.inQuotStr && !this.inAposStr )))) {s = 4;}

                            else if ( (LA8_4=='\'') && ((( this.inQuotStr )||( !this.inQuotStr && !this.inAposStr )))) {s = 13;}

                            else if ( (LA8_4=='\"') && ((( this.inAposStr )||( !this.inQuotStr && !this.inAposStr )))) {s = 8;}

                            else if ( (LA8_4=='<'||LA8_4=='{'||LA8_4=='}') && ((( this.inAposStr )||( this.inQuotStr )))) {s = 5;}

                            else s = 17;

                             
                            input.seek(index8_4);
                            if ( s>=0 ) return s;
                            break;
            }
        }).call(this.recognizer, s, input);
        if (!org.antlr.lang.isUndefined(retval)) {
            return retval;
        }
        var nvae =
            new org.antlr.runtime.NoViableAltException(this.getDescription(), 8, _s, input);
        this.error(nvae);
        throw nvae;
    },
    dummy: null
});
 
})();
exports.StringLexer = StringLexer; });
