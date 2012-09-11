define(function(require, exports, module){// $ANTLR 3.3 Nov 30, 2010 12:50:56 /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g 2012-09-05 10:41:40

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
var XQDTLexer   = require("./XQDTLexer").XQDTLexer;


var XMLLexer = function(input, state) {
// alternate constructor @todo
// public XMLLexer(CharStream input)
// public XMLLexer(CharStream input, RecognizerSharedState state) {
    if (!state) {
        state = new org.antlr.runtime.RecognizerSharedState();
    }

    (function(){


        this.inElem = true;
        this.inAposAttr = false;
        this.inQuotAttr = false;

        this.isInElement = function()
        {
           return this.inElem;
        }

        this.isInAposAttribute = function()
        {
           return this.inAposAttr;
        }

        this.isInQuotAttr = function()
        {
           return this.inQuotAttr;
        }
            
        this.addToStack = function(stack) {
        	if (!this.inAposAttr && !this.inQuotAttr)
        		this.inElem = false;
        	stack.push(this);
        } 


        // dummy list for warning elimination
        //List<Stack<Object>> dummy = new ArrayList<Stack<Object>>();

        // when we start, the '<' has already been eaten by the other lexer
        //boolean inElem = true;
        //boolean inAposAttr = false;
        //boolean inQuotAttr = false;
        //
        //public boolean isInElement()
        //{
        //   return inElem;
        //}
        //
        //public boolean isInAposAttribute()
        //{
        //   return inAposAttr;
        //}
        //
        //public boolean isInQuotAttr()
        //{
        //   return inQuotAttr;
        //}
        //    
        //@Override
        //public void addToStack(List<XQDTLexer> stack) {
        //	if (!inAposAttr && !inQuotAttr)
        //		inElem = false;
        //	stack.add(this);
        //} 
        //
        //private boolean log() {
        //	System.out.println("inApos:\t" + inAposAttr);
        //	System.out.println("inQuot:\t" + inQuotAttr);
        //	System.out.println("inElem:\t" + inElem);
        //	System.out.println("---------------------");
        //	return false;
        //}


    }).call(this);

    this.dfa16 = new XMLLexer.DFA16(this);
    XMLLexer.superclass.constructor.call(this, input, state);


};

org.antlr.lang.augmentObject(XMLLexer, {
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
    NCNameUnprotected: 293,
    XMLDigit: 294
});

(function(){
var HIDDEN = org.antlr.runtime.Token.HIDDEN_CHANNEL,
    EOF = org.antlr.runtime.Token.EOF;
org.antlr.lang.extend(XMLLexer, XQDTLexer, {
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
    NCNameUnprotected : 293,
    XMLDigit : 294,
    getGrammarFileName: function() { return "/Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g"; }
});
org.antlr.lang.augmentObject(XMLLexer.prototype, {
    // $ANTLR start QUOT
    mQUOT: function()  {
        try {
            var _type = this.QUOT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:132:6: ({...}? => '\"' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:132:8: {...}? => '\"'
            if ( !(( this.inElem || this.inQuotAttr )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "QUOT", " this.inElem || this.inQuotAttr ");
            }
            this.match('\"'); 
             if (!this.inAposAttr) this.inQuotAttr = (!this.inQuotAttr); 



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
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:133:6: ({...}? => '\\'' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:133:8: {...}? => '\\''
            if ( !(( this.inElem || this.inAposAttr )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "APOS", " this.inElem || this.inAposAttr ");
            }
            this.match('\''); 
             if (!this.inQuotAttr) this.inAposAttr = !this.inAposAttr; 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "APOS",

    // $ANTLR start L_QuotAttrContentChar
    mL_QuotAttrContentChar: function()  {
        try {
            var _type = this.L_QuotAttrContentChar;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:136:2: ({...}? => ( '\\u0009' | '\\u000A' | '\\u000D' | '\\u0020' | '\\u0021' | '\\u0023' .. '\\u0025' | '\\u0028' .. '\\u003B' | '\\u003D' .. '\\u007A' | '\\u007C' .. '\\u007C' | '\\u007E' .. '\\uD7FF' | '\\uE000' .. '\\uFFFD' )+ )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:136:4: {...}? => ( '\\u0009' | '\\u000A' | '\\u000D' | '\\u0020' | '\\u0021' | '\\u0023' .. '\\u0025' | '\\u0028' .. '\\u003B' | '\\u003D' .. '\\u007A' | '\\u007C' .. '\\u007C' | '\\u007E' .. '\\uD7FF' | '\\uE000' .. '\\uFFFD' )+
            if ( !(( this.inQuotAttr )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "L_QuotAttrContentChar", " this.inQuotAttr ");
            }
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:137:3: ( '\\u0009' | '\\u000A' | '\\u000D' | '\\u0020' | '\\u0021' | '\\u0023' .. '\\u0025' | '\\u0028' .. '\\u003B' | '\\u003D' .. '\\u007A' | '\\u007C' .. '\\u007C' | '\\u007E' .. '\\uD7FF' | '\\uE000' .. '\\uFFFD' )+
            var cnt1=0;
            loop1:
            do {
                var alt1=2;
                var LA1_0 = this.input.LA(1);

                if ( ((LA1_0>='\t' && LA1_0<='\n')||LA1_0=='\r'||(LA1_0>=' ' && LA1_0<='!')||(LA1_0>='#' && LA1_0<='%')||(LA1_0>='(' && LA1_0<=';')||(LA1_0>='=' && LA1_0<='z')||LA1_0=='|'||(LA1_0>='~' && LA1_0<='\uD7FF')||(LA1_0>='\uE000' && LA1_0<='\uFFFD')) ) {
                    alt1=1;
                }


                switch (alt1) {
                case 1 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:
                    if ( (this.input.LA(1)>='\t' && this.input.LA(1)<='\n')||this.input.LA(1)=='\r'||(this.input.LA(1)>=' ' && this.input.LA(1)<='!')||(this.input.LA(1)>='#' && this.input.LA(1)<='%')||(this.input.LA(1)>='(' && this.input.LA(1)<=';')||(this.input.LA(1)>='=' && this.input.LA(1)<='z')||this.input.LA(1)=='|'||(this.input.LA(1)>='~' && this.input.LA(1)<='\uD7FF')||(this.input.LA(1)>='\uE000' && this.input.LA(1)<='\uFFFD') ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;

                default :
                    if ( cnt1 >= 1 ) {
                        break loop1;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(1, this.input);
                        throw eee;
                }
                cnt1++;
            } while (true);




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "L_QuotAttrContentChar",

    // $ANTLR start L_AposAttrContentChar
    mL_AposAttrContentChar: function()  {
        try {
            var _type = this.L_AposAttrContentChar;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:143:2: ({...}? => ( '\\u0009' | '\\u000A' | '\\u000D' | '\\u0020' | '\\u0021' | '\\u0023' .. '\\u0025' | '\\u0028' .. '\\u003B' | '\\u003D' .. '\\u007A' | '\\u007C' .. '\\u007C' | '\\u007E' .. '\\uD7FF' | '\\uE000' .. '\\uFFFD' )+ )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:143:4: {...}? => ( '\\u0009' | '\\u000A' | '\\u000D' | '\\u0020' | '\\u0021' | '\\u0023' .. '\\u0025' | '\\u0028' .. '\\u003B' | '\\u003D' .. '\\u007A' | '\\u007C' .. '\\u007C' | '\\u007E' .. '\\uD7FF' | '\\uE000' .. '\\uFFFD' )+
            if ( !(( this.inAposAttr )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "L_AposAttrContentChar", " this.inAposAttr ");
            }
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:144:3: ( '\\u0009' | '\\u000A' | '\\u000D' | '\\u0020' | '\\u0021' | '\\u0023' .. '\\u0025' | '\\u0028' .. '\\u003B' | '\\u003D' .. '\\u007A' | '\\u007C' .. '\\u007C' | '\\u007E' .. '\\uD7FF' | '\\uE000' .. '\\uFFFD' )+
            var cnt2=0;
            loop2:
            do {
                var alt2=2;
                var LA2_0 = this.input.LA(1);

                if ( ((LA2_0>='\t' && LA2_0<='\n')||LA2_0=='\r'||(LA2_0>=' ' && LA2_0<='!')||(LA2_0>='#' && LA2_0<='%')||(LA2_0>='(' && LA2_0<=';')||(LA2_0>='=' && LA2_0<='z')||LA2_0=='|'||(LA2_0>='~' && LA2_0<='\uD7FF')||(LA2_0>='\uE000' && LA2_0<='\uFFFD')) ) {
                    alt2=1;
                }


                switch (alt2) {
                case 1 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:
                    if ( (this.input.LA(1)>='\t' && this.input.LA(1)<='\n')||this.input.LA(1)=='\r'||(this.input.LA(1)>=' ' && this.input.LA(1)<='!')||(this.input.LA(1)>='#' && this.input.LA(1)<='%')||(this.input.LA(1)>='(' && this.input.LA(1)<=';')||(this.input.LA(1)>='=' && this.input.LA(1)<='z')||this.input.LA(1)=='|'||(this.input.LA(1)>='~' && this.input.LA(1)<='\uD7FF')||(this.input.LA(1)>='\uE000' && this.input.LA(1)<='\uFFFD') ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



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




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "L_AposAttrContentChar",

    // $ANTLR start L_ElementContentChar
    mL_ElementContentChar: function()  {
        try {
            var _type = this.L_ElementContentChar;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:151:2: ({...}? => ( '\\u0009' | '\\u000A' | '\\u000D' | '\\u0020' .. '\\u0025' | '\\u0027' .. '\\u003B' | '\\u003D' .. '\\u007A' | '\\u007C' | '\\u007E' .. '\\uD7FF' | '\\uE000' .. '\\uFFFD' )+ )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:151:4: {...}? => ( '\\u0009' | '\\u000A' | '\\u000D' | '\\u0020' .. '\\u0025' | '\\u0027' .. '\\u003B' | '\\u003D' .. '\\u007A' | '\\u007C' | '\\u007E' .. '\\uD7FF' | '\\uE000' .. '\\uFFFD' )+
            if ( !(( !this.inElem )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "L_ElementContentChar", " !this.inElem ");
            }
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:152:3: ( '\\u0009' | '\\u000A' | '\\u000D' | '\\u0020' .. '\\u0025' | '\\u0027' .. '\\u003B' | '\\u003D' .. '\\u007A' | '\\u007C' | '\\u007E' .. '\\uD7FF' | '\\uE000' .. '\\uFFFD' )+
            var cnt3=0;
            loop3:
            do {
                var alt3=2;
                var LA3_0 = this.input.LA(1);

                if ( ((LA3_0>='\t' && LA3_0<='\n')||LA3_0=='\r'||(LA3_0>=' ' && LA3_0<='%')||(LA3_0>='\'' && LA3_0<=';')||(LA3_0>='=' && LA3_0<='z')||LA3_0=='|'||(LA3_0>='~' && LA3_0<='\uD7FF')||(LA3_0>='\uE000' && LA3_0<='\uFFFD')) ) {
                    alt3=1;
                }


                switch (alt3) {
                case 1 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:
                    if ( (this.input.LA(1)>='\t' && this.input.LA(1)<='\n')||this.input.LA(1)=='\r'||(this.input.LA(1)>=' ' && this.input.LA(1)<='%')||(this.input.LA(1)>='\'' && this.input.LA(1)<=';')||(this.input.LA(1)>='=' && this.input.LA(1)<='z')||this.input.LA(1)=='|'||(this.input.LA(1)>='~' && this.input.LA(1)<='\uD7FF')||(this.input.LA(1)>='\uE000' && this.input.LA(1)<='\uFFFD') ) {
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




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "L_ElementContentChar",

    // $ANTLR start GREATER
    mGREATER: function()  {
        try {
            var _type = this.GREATER;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:158:2: ({...}? => '>' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:158:4: {...}? => '>'
            if ( !(( this.inElem )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "GREATER", " this.inElem ");
            }
            this.match('>'); 
             this.inElem = false; 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "GREATER",

    // $ANTLR start EMPTY_CLOSE_TAG
    mEMPTY_CLOSE_TAG: function()  {
        try {
            var _type = this.EMPTY_CLOSE_TAG;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:162:2: ({...}? => '/>' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:162:4: {...}? => '/>'
            if ( !(( this.inElem )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "EMPTY_CLOSE_TAG", " this.inElem ");
            }
            this.match("/>"); 

             this.inElem = false; 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "EMPTY_CLOSE_TAG",

    // $ANTLR start S
    mS: function()  {
        try {
            var _type = this.S;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:166:2: ({...}? => ( ' ' | '\\t' | '\\r' | '\\n' )+ )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:166:4: {...}? => ( ' ' | '\\t' | '\\r' | '\\n' )+
            if ( !(( this.inElem )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "S", " this.inElem ");
            }
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:166:24: ( ' ' | '\\t' | '\\r' | '\\n' )+
            var cnt4=0;
            loop4:
            do {
                var alt4=2;
                var LA4_0 = this.input.LA(1);

                if ( ((LA4_0>='\t' && LA4_0<='\n')||LA4_0=='\r'||LA4_0==' ') ) {
                    alt4=1;
                }


                switch (alt4) {
                case 1 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:
                    if ( (this.input.LA(1)>='\t' && this.input.LA(1)<='\n')||this.input.LA(1)=='\r'||this.input.LA(1)==' ' ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;

                default :
                    if ( cnt4 >= 1 ) {
                        break loop4;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(4, this.input);
                        throw eee;
                }
                cnt4++;
            } while (true);




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "S",

    // $ANTLR start L_NCName
    mL_NCName: function()  {
        try {
            var _type = this.L_NCName;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:172:2: ({...}? => NCNameUnprotected )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:172:4: {...}? => NCNameUnprotected
            if ( !(( this.inElem )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "L_NCName", " this.inElem ");
            }
            this.mNCNameUnprotected(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "L_NCName",

    // $ANTLR start NCNameUnprotected
    mNCNameUnprotected: function()  {
        try {
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:176:2: ( NCNameStartChar ( NCNameChar )* )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:176:4: NCNameStartChar ( NCNameChar )*
            this.mNCNameStartChar(); 
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:176:20: ( NCNameChar )*
            loop5:
            do {
                var alt5=2;
                var LA5_0 = this.input.LA(1);

                if ( ((LA5_0>='-' && LA5_0<='.')||(LA5_0>='0' && LA5_0<='9')||(LA5_0>='A' && LA5_0<='Z')||LA5_0=='_'||(LA5_0>='a' && LA5_0<='z')) ) {
                    alt5=1;
                }


                switch (alt5) {
                case 1 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:176:20: NCNameChar
                    this.mNCNameChar(); 


                    break;

                default :
                    break loop5;
                }
            } while (true);




        }
        finally {
        }
    },
    // $ANTLR end "NCNameUnprotected",

    // $ANTLR start NCNameStartChar
    mNCNameStartChar: function()  {
        try {
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:180:2: ( Letter | '_' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:
            if ( (this.input.LA(1)>='A' && this.input.LA(1)<='Z')||this.input.LA(1)=='_'||(this.input.LA(1)>='a' && this.input.LA(1)<='z') ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "NCNameStartChar",

    // $ANTLR start NCNameChar
    mNCNameChar: function()  {
        try {
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:184:2: ( Letter | XMLDigit | '.' | '-' | '_' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:
            if ( (this.input.LA(1)>='-' && this.input.LA(1)<='.')||(this.input.LA(1)>='0' && this.input.LA(1)<='9')||(this.input.LA(1)>='A' && this.input.LA(1)<='Z')||this.input.LA(1)=='_'||(this.input.LA(1)>='a' && this.input.LA(1)<='z') ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "NCNameChar",

    // $ANTLR start Letter
    mLetter: function()  {
        try {
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:188:2: ( 'a' .. 'z' | 'A' .. 'Z' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:
            if ( (this.input.LA(1)>='A' && this.input.LA(1)<='Z')||(this.input.LA(1)>='a' && this.input.LA(1)<='z') ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "Letter",

    // $ANTLR start XMLDigit
    mXMLDigit: function()  {
        try {
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:192:2: ( '0' .. '9' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:192:4: '0' .. '9'
            this.matchRange('0','9'); 



        }
        finally {
        }
    },
    // $ANTLR end "XMLDigit",

    // $ANTLR start EQUAL
    mEQUAL: function()  {
        try {
            var _type = this.EQUAL;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:207:7: ({...}? => '=' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:207:9: {...}? => '='
            if ( !(( this.inElem  )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "EQUAL", " this.inElem  ");
            }
            this.match('='); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "EQUAL",

    // $ANTLR start ESCAPE_APOS
    mESCAPE_APOS: function()  {
        try {
            var _type = this.ESCAPE_APOS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:208:13: ({...}? => '\\'\\'' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:208:15: {...}? => '\\'\\''
            if ( !(( this.inAposAttr )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "ESCAPE_APOS", " this.inAposAttr ");
            }
            this.match("''"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ESCAPE_APOS",

    // $ANTLR start ESCAPE_QUOT
    mESCAPE_QUOT: function()  {
        try {
            var _type = this.ESCAPE_QUOT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:209:13: ({...}? => '\"\"' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:209:15: {...}? => '\"\"'
            if ( !(( this.inQuotAttr )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "ESCAPE_QUOT", " this.inQuotAttr ");
            }
            this.match("\"\""); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ESCAPE_QUOT",

    // $ANTLR start ESCAPE_LBRACKET
    mESCAPE_LBRACKET: function()  {
        try {
            var _type = this.ESCAPE_LBRACKET;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:212:2: ({...}? => '{{' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:212:4: {...}? => '{{'
            if ( !(( !this.inElem || this.inAposAttr || this.inQuotAttr )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "ESCAPE_LBRACKET", " !this.inElem || this.inAposAttr || this.inQuotAttr ");
            }
            this.match("{{"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ESCAPE_LBRACKET",

    // $ANTLR start ESCAPE_RBRACKET
    mESCAPE_RBRACKET: function()  {
        try {
            var _type = this.ESCAPE_RBRACKET;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:216:2: ({...}? => '}}' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:216:4: {...}? => '}}'
            if ( !(( !this.inElem || this.inAposAttr || this.inQuotAttr )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "ESCAPE_RBRACKET", " !this.inElem || this.inAposAttr || this.inQuotAttr ");
            }
            this.match("}}"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ESCAPE_RBRACKET",

    // $ANTLR start LBRACKET
    mLBRACKET: function()  {
        try {
            var _type = this.LBRACKET;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:219:10: ({...}? => '{' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:219:12: {...}? => '{'
            if ( !(( !this.inElem || this.inAposAttr || this.inQuotAttr )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "LBRACKET", " !this.inElem || this.inAposAttr || this.inQuotAttr ");
            }
            this.match('{'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LBRACKET",

    // $ANTLR start RBRACKET
    mRBRACKET: function()  {
        try {
            var _type = this.RBRACKET;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:220:10: ({...}? => '}' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:220:12: {...}? => '}'
            if ( !(( !this.inElem || this.inAposAttr || this.inQuotAttr )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "RBRACKET", " !this.inElem || this.inAposAttr || this.inQuotAttr ");
            }
            this.match('}'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "RBRACKET",

    // $ANTLR start SMALLER
    mSMALLER: function()  {
        try {
            var _type = this.SMALLER;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:221:9: ( '<' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:221:11: '<'
            this.match('<'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SMALLER",

    // $ANTLR start CLOSE_TAG
    mCLOSE_TAG: function()  {
        try {
            var _type = this.CLOSE_TAG;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:222:11: ({...}? => '</' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:222:13: {...}? => '</'
            if ( !(( !this.inElem )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "CLOSE_TAG", " !this.inElem ");
            }
            this.match("</"); 

             this.inElem = true; 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "CLOSE_TAG",

    // $ANTLR start CDATA_START
    mCDATA_START: function()  {
        try {
            var _type = this.CDATA_START;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:224:13: ( '<![CDATA[' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:224:15: '<![CDATA['
            this.match("<![CDATA["); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "CDATA_START",

    // $ANTLR start CDATA_END
    mCDATA_END: function()  {
        try {
            var _type = this.CDATA_END;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:225:12: ( ']]>' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:225:14: ']]>'
            this.match("]]>"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "CDATA_END",

    // $ANTLR start L_CDataSection
    mL_CDataSection: function()  {
        try {
            var _type = this.L_CDataSection;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:229:3: ({...}? => CDATA_START ( options {greedy=false; } : ( . )* ) CDATA_END )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:229:5: {...}? => CDATA_START ( options {greedy=false; } : ( . )* ) CDATA_END
            if ( !(( !this.inElem )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "L_CDataSection", " !this.inElem ");
            }
            this.mCDATA_START(); 
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:229:38: ( options {greedy=false; } : ( . )* )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:229:65: ( . )*
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:229:65: ( . )*
            loop6:
            do {
                var alt6=2;
                var LA6_0 = this.input.LA(1);

                if ( (LA6_0==']') ) {
                    var LA6_1 = this.input.LA(2);

                    if ( (LA6_1==']') ) {
                        var LA6_3 = this.input.LA(3);

                        if ( (LA6_3=='>') ) {
                            alt6=2;
                        }
                        else if ( ((LA6_3>='\u0000' && LA6_3<='=')||(LA6_3>='?' && LA6_3<='\uFFFF')) ) {
                            alt6=1;
                        }


                    }
                    else if ( ((LA6_1>='\u0000' && LA6_1<='\\')||(LA6_1>='^' && LA6_1<='\uFFFF')) ) {
                        alt6=1;
                    }


                }
                else if ( ((LA6_0>='\u0000' && LA6_0<='\\')||(LA6_0>='^' && LA6_0<='\uFFFF')) ) {
                    alt6=1;
                }


                switch (alt6) {
                case 1 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:229:65: .
                    this.matchAny(); 


                    break;

                default :
                    break loop6;
                }
            } while (true);




            this.mCDATA_END(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "L_CDataSection",

    // $ANTLR start L_PredefinedEntityRef
    mL_PredefinedEntityRef: function()  {
        try {
            var _type = this.L_PredefinedEntityRef;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:237:2: ({...}? => '&' ( 'lt' | 'gt' | 'apos' | 'quot' | 'amp' ) ';' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:237:4: {...}? => '&' ( 'lt' | 'gt' | 'apos' | 'quot' | 'amp' ) ';'
            if ( !(( !this.inElem || this.inAposAttr || this.inQuotAttr )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "L_PredefinedEntityRef", " !this.inElem || this.inAposAttr || this.inQuotAttr ");
            }
            this.match('&'); 
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:237:67: ( 'lt' | 'gt' | 'apos' | 'quot' | 'amp' )
            var alt7=5;
            switch ( this.input.LA(1) ) {
            case 'l':
                alt7=1;
                break;
            case 'g':
                alt7=2;
                break;
            case 'a':
                var LA7_3 = this.input.LA(2);

                if ( (LA7_3=='p') ) {
                    alt7=3;
                }
                else if ( (LA7_3=='m') ) {
                    alt7=5;
                }
                else {
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 7, 3, this.input);

                    throw nvae;
                }
                break;
            case 'q':
                alt7=4;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 7, 0, this.input);

                throw nvae;
            }

            switch (alt7) {
                case 1 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:237:68: 'lt'
                    this.match("lt"); 



                    break;
                case 2 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:237:75: 'gt'
                    this.match("gt"); 



                    break;
                case 3 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:237:82: 'apos'
                    this.match("apos"); 



                    break;
                case 4 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:237:91: 'quot'
                    this.match("quot"); 



                    break;
                case 5 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:237:100: 'amp'
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
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:242:2: ({...}? => '&#' ( '0' .. '9' )+ ';' | '&#x' ( '0' .. '9' | 'a' .. 'f' | 'A' .. 'F' )+ ';' )
            var alt10=2;
            var LA10_0 = this.input.LA(1);

            if ( (LA10_0=='&') ) {
                var LA10_1 = this.input.LA(2);

                if ( (LA10_1=='#') ) {
                    var LA10_2 = this.input.LA(3);

                    if ( (LA10_2=='x') ) {
                        alt10=2;
                    }
                    else if ( ((LA10_2>='0' && LA10_2<='9')) && (( !this.inElem || this.inAposAttr || this.inQuotAttr ))) {
                        alt10=1;
                    }
                    else {
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 10, 2, this.input);

                        throw nvae;
                    }
                }
                else {
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 10, 1, this.input);

                    throw nvae;
                }
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 10, 0, this.input);

                throw nvae;
            }
            switch (alt10) {
                case 1 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:242:4: {...}? => '&#' ( '0' .. '9' )+ ';'
                    if ( !(( !this.inElem || this.inAposAttr || this.inQuotAttr )) ) {
                        throw new org.antlr.runtime.FailedPredicateException(this.input, "L_CharRef", " !this.inElem || this.inAposAttr || this.inQuotAttr ");
                    }
                    this.match("&#"); 

                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:242:68: ( '0' .. '9' )+
                    var cnt8=0;
                    loop8:
                    do {
                        var alt8=2;
                        var LA8_0 = this.input.LA(1);

                        if ( ((LA8_0>='0' && LA8_0<='9')) ) {
                            alt8=1;
                        }


                        switch (alt8) {
                        case 1 :
                            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:242:69: '0' .. '9'
                            this.matchRange('0','9'); 


                            break;

                        default :
                            if ( cnt8 >= 1 ) {
                                break loop8;
                            }
                                var eee = new org.antlr.runtime.EarlyExitException(8, this.input);
                                throw eee;
                        }
                        cnt8++;
                    } while (true);

                    this.match(';'); 


                    break;
                case 2 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:242:86: '&#x' ( '0' .. '9' | 'a' .. 'f' | 'A' .. 'F' )+ ';'
                    this.match("&#x"); 

                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:242:92: ( '0' .. '9' | 'a' .. 'f' | 'A' .. 'F' )+
                    var cnt9=0;
                    loop9:
                    do {
                        var alt9=2;
                        var LA9_0 = this.input.LA(1);

                        if ( ((LA9_0>='0' && LA9_0<='9')||(LA9_0>='A' && LA9_0<='F')||(LA9_0>='a' && LA9_0<='f')) ) {
                            alt9=1;
                        }


                        switch (alt9) {
                        case 1 :
                            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:
                            if ( (this.input.LA(1)>='0' && this.input.LA(1)<='9')||(this.input.LA(1)>='A' && this.input.LA(1)<='F')||(this.input.LA(1)>='a' && this.input.LA(1)<='f') ) {
                                this.input.consume();

                            }
                            else {
                                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                                this.recover(mse);
                                throw mse;}



                            break;

                        default :
                            if ( cnt9 >= 1 ) {
                                break loop9;
                            }
                                var eee = new org.antlr.runtime.EarlyExitException(9, this.input);
                                throw eee;
                        }
                        cnt9++;
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

    // $ANTLR start L_DirCommentConstructor
    mL_DirCommentConstructor: function()  {
        try {
            var _type = this.L_DirCommentConstructor;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:246:2: ({...}? => '<!--' ( options {greedy=false; } : ( . )* ) '-->' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:246:4: {...}? => '<!--' ( options {greedy=false; } : ( . )* ) '-->'
            if ( !(( !this.inElem )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "L_DirCommentConstructor", " !this.inElem ");
            }
            this.match("<!--"); 

            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:246:32: ( options {greedy=false; } : ( . )* )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:246:59: ( . )*
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:246:59: ( . )*
            loop11:
            do {
                var alt11=2;
                var LA11_0 = this.input.LA(1);

                if ( (LA11_0=='-') ) {
                    var LA11_1 = this.input.LA(2);

                    if ( (LA11_1=='-') ) {
                        var LA11_3 = this.input.LA(3);

                        if ( (LA11_3=='>') ) {
                            alt11=2;
                        }
                        else if ( ((LA11_3>='\u0000' && LA11_3<='=')||(LA11_3>='?' && LA11_3<='\uFFFF')) ) {
                            alt11=1;
                        }


                    }
                    else if ( ((LA11_1>='\u0000' && LA11_1<=',')||(LA11_1>='.' && LA11_1<='\uFFFF')) ) {
                        alt11=1;
                    }


                }
                else if ( ((LA11_0>='\u0000' && LA11_0<=',')||(LA11_0>='.' && LA11_0<='\uFFFF')) ) {
                    alt11=1;
                }


                switch (alt11) {
                case 1 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:246:59: .
                    this.matchAny(); 


                    break;

                default :
                    break loop11;
                }
            } while (true);




            this.match("-->"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "L_DirCommentConstructor",

    // $ANTLR start L_DirPIConstructor
    mL_DirPIConstructor: function()  {
        try {
            var _type = this.L_DirPIConstructor;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:249:2: ({...}? => '<?' ( SU )? NCNameUnprotected ( SU ( options {greedy=false; } : ( . )* ) )? '?>' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:249:4: {...}? => '<?' ( SU )? NCNameUnprotected ( SU ( options {greedy=false; } : ( . )* ) )? '?>'
            if ( !(( !this.inElem )) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "L_DirPIConstructor", " !this.inElem ");
            }
            this.match("<?"); 

            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:250:8: ( SU )?
            var alt12=2;
            var LA12_0 = this.input.LA(1);

            if ( ((LA12_0>='\t' && LA12_0<='\n')||LA12_0=='\r'||LA12_0==' ') ) {
                alt12=1;
            }
            switch (alt12) {
                case 1 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:250:8: SU
                    this.mSU(); 


                    break;

            }

            this.mNCNameUnprotected(); 
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:250:30: ( SU ( options {greedy=false; } : ( . )* ) )?
            var alt14=2;
            var LA14_0 = this.input.LA(1);

            if ( ((LA14_0>='\t' && LA14_0<='\n')||LA14_0=='\r'||LA14_0==' ') ) {
                alt14=1;
            }
            switch (alt14) {
                case 1 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:250:31: SU ( options {greedy=false; } : ( . )* )
                    this.mSU(); 
                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:250:34: ( options {greedy=false; } : ( . )* )
                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:250:61: ( . )*
                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:250:61: ( . )*
                    loop13:
                    do {
                        var alt13=2;
                        var LA13_0 = this.input.LA(1);

                        if ( (LA13_0=='?') ) {
                            var LA13_1 = this.input.LA(2);

                            if ( (LA13_1=='>') ) {
                                alt13=2;
                            }
                            else if ( ((LA13_1>='\u0000' && LA13_1<='=')||(LA13_1>='?' && LA13_1<='\uFFFF')) ) {
                                alt13=1;
                            }


                        }
                        else if ( ((LA13_0>='\u0000' && LA13_0<='>')||(LA13_0>='@' && LA13_0<='\uFFFF')) ) {
                            alt13=1;
                        }


                        switch (alt13) {
                        case 1 :
                            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:250:61: .
                            this.matchAny(); 


                            break;

                        default :
                            break loop13;
                        }
                    } while (true);






                    break;

            }

            this.match("?>"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "L_DirPIConstructor",

    // $ANTLR start SU
    mSU: function()  {
        try {
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:254:2: ( ( ' ' | '\\t' | '\\n' | '\\r' )+ )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:254:4: ( ' ' | '\\t' | '\\n' | '\\r' )+
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:254:4: ( ' ' | '\\t' | '\\n' | '\\r' )+
            var cnt15=0;
            loop15:
            do {
                var alt15=2;
                var LA15_0 = this.input.LA(1);

                if ( ((LA15_0>='\t' && LA15_0<='\n')||LA15_0=='\r'||LA15_0==' ') ) {
                    alt15=1;
                }


                switch (alt15) {
                case 1 :
                    // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:
                    if ( (this.input.LA(1)>='\t' && this.input.LA(1)<='\n')||this.input.LA(1)=='\r'||this.input.LA(1)==' ' ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;

                default :
                    if ( cnt15 >= 1 ) {
                        break loop15;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(15, this.input);
                        throw eee;
                }
                cnt15++;
            } while (true);




        }
        finally {
        }
    },
    // $ANTLR end "SU",

    // $ANTLR start COLON
    mCOLON: function()  {
        try {
            var _type = this.COLON;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:257:7: ( ':' )
            // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:257:9: ':'
            this.match(':'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "COLON",

    mTokens: function() {
        // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:8: ( QUOT | APOS | L_QuotAttrContentChar | L_AposAttrContentChar | L_ElementContentChar | GREATER | EMPTY_CLOSE_TAG | S | L_NCName | EQUAL | ESCAPE_APOS | ESCAPE_QUOT | ESCAPE_LBRACKET | ESCAPE_RBRACKET | LBRACKET | RBRACKET | SMALLER | CLOSE_TAG | CDATA_START | CDATA_END | L_CDataSection | L_PredefinedEntityRef | L_CharRef | L_DirCommentConstructor | L_DirPIConstructor | COLON )
        var alt16=26;
        alt16 = this.dfa16.predict(this.input);
        switch (alt16) {
            case 1 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:10: QUOT
                this.mQUOT(); 


                break;
            case 2 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:15: APOS
                this.mAPOS(); 


                break;
            case 3 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:20: L_QuotAttrContentChar
                this.mL_QuotAttrContentChar(); 


                break;
            case 4 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:42: L_AposAttrContentChar
                this.mL_AposAttrContentChar(); 


                break;
            case 5 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:64: L_ElementContentChar
                this.mL_ElementContentChar(); 


                break;
            case 6 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:85: GREATER
                this.mGREATER(); 


                break;
            case 7 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:93: EMPTY_CLOSE_TAG
                this.mEMPTY_CLOSE_TAG(); 


                break;
            case 8 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:109: S
                this.mS(); 


                break;
            case 9 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:111: L_NCName
                this.mL_NCName(); 


                break;
            case 10 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:120: EQUAL
                this.mEQUAL(); 


                break;
            case 11 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:126: ESCAPE_APOS
                this.mESCAPE_APOS(); 


                break;
            case 12 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:138: ESCAPE_QUOT
                this.mESCAPE_QUOT(); 


                break;
            case 13 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:150: ESCAPE_LBRACKET
                this.mESCAPE_LBRACKET(); 


                break;
            case 14 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:166: ESCAPE_RBRACKET
                this.mESCAPE_RBRACKET(); 


                break;
            case 15 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:182: LBRACKET
                this.mLBRACKET(); 


                break;
            case 16 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:191: RBRACKET
                this.mRBRACKET(); 


                break;
            case 17 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:200: SMALLER
                this.mSMALLER(); 


                break;
            case 18 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:208: CLOSE_TAG
                this.mCLOSE_TAG(); 


                break;
            case 19 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:218: CDATA_START
                this.mCDATA_START(); 


                break;
            case 20 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:230: CDATA_END
                this.mCDATA_END(); 


                break;
            case 21 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:240: L_CDataSection
                this.mL_CDataSection(); 


                break;
            case 22 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:255: L_PredefinedEntityRef
                this.mL_PredefinedEntityRef(); 


                break;
            case 23 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:277: L_CharRef
                this.mL_CharRef(); 


                break;
            case 24 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:287: L_DirCommentConstructor
                this.mL_DirCommentConstructor(); 


                break;
            case 25 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:311: L_DirPIConstructor
                this.mL_DirPIConstructor(); 


                break;
            case 26 :
                // /Users/wcandillon/28msec/xquery.js/xquery/XMLLexer.g:1:330: COLON
                this.mCOLON(); 


                break;

        }

    }

}, true); // important to pass true to overwrite default implementations

org.antlr.lang.augmentObject(XMLLexer, {
    DFA16_eotS:
        "\u0001\uffff\u0001\u0010\u0001\u0013\u0001\u0014\u0001\u0016\u0001"+
    "\u0017\u0001\u0018\u0001\u001a\u0001\u0016\u0001\u001d\u0001\u001f\u0001"+
    "\u0023\u0001\u0024\u0001\uffff\u0001\u0016\u0001\u0027\u0002\uffff\u0001"+
    "\u0029\u0002\uffff\u0001\u002e\u0003\uffff\u0001\u0018\u0001\uffff\u0001"+
    "\u0016\u0016\uffff\u0001\u0039\u000d\uffff\u0001\u0041\u0002\uffff",
    DFA16_eofS:
        "\u0043\uffff",
    DFA16_minS:
        "\u0009\u0009\u0001\u007b\u0001\u007d\u0001\u0021\u0001\u0009\u0001"+
    "\u0023\u0002\u0009\u0001\u0000\u0001\uffff\u0001\u0009\u0002\u0000\u0001"+
    "\u0009\u0003\u0000\u0001\u0009\u0001\u0000\u0001\u0009\u0005\uffff\u0001"+
    "\u002d\u0002\uffff\u0001\u0000\u0002\uffff\u0001\u0000\u0001\uffff\u0001"+
    "\u0000\u0004\uffff\u0001\u0000\u0003\uffff\u0001\u0009\u0001\u0043\u0005"+
    "\uffff\u0001\u0000\u0001\u0044\u0001\uffff\u0001\u0041\u0001\u0054\u0001"+
    "\u0041\u0001\u005b\u0001\u0000\u0002\uffff",
    DFA16_maxS:
        "\u0009\ufffd\u0001\u007b\u0001\u007d\u0001\u003f\u0001\ufffd\u0001"+
    "\u0071\u0002\ufffd\u0001\u0000\u0001\uffff\u0001\ufffd\u0002\u0000\u0001"+
    "\ufffd\u0003\u0000\u0001\ufffd\u0001\u0000\u0001\ufffd\u0005\uffff\u0001"+
    "\u005b\u0002\uffff\u0001\u0000\u0002\uffff\u0001\u0000\u0001\uffff\u0001"+
    "\u0000\u0004\uffff\u0001\u0000\u0003\uffff\u0001\ufffd\u0001\u0043\u0005"+
    "\uffff\u0001\u0000\u0001\u0044\u0001\uffff\u0001\u0041\u0001\u0054\u0001"+
    "\u0041\u0001\u005b\u0001\uffff\u0002\uffff",
    DFA16_acceptS:
        "\u0011\uffff\u0001\u0005\u000a\uffff\u0001\u000d\u0001\u000f\u0001"+
    "\u000e\u0001\u0010\u0001\u0012\u0001\uffff\u0001\u0019\u0001\u0011\u0001"+
    "\uffff\u0001\u0017\u0001\u0016\u0001\uffff\u0001\u0001\u0001\uffff\u0001"+
    "\u0002\u0001\u0003\u0001\u0004\u0001\u0006\u0001\uffff\u0001\u0008\u0001"+
    "\u0009\u0001\u000a\u0002\uffff\u0001\u0018\u0001\u001a\u0001\u000c\u0001"+
    "\u000b\u0001\u0007\u0002\uffff\u0001\u0014\u0005\uffff\u0001\u0013\u0001"+
    "\u0015",
    DFA16_specialS:
        "\u0001\u0000\u0001\u001f\u0001\u0022\u0001\u0004\u0001\u000d\u0001"+
    "\u001e\u0001\u0015\u0001\u0002\u0001\u000b\u0001\u0021\u0001\u0005\u0001"+
    "\u0011\u0001\u001b\u0001\u0020\u0001\u000c\u0001\u001a\u0001\u0009\u0001"+
    "\uffff\u0001\u0010\u0001\u000a\u0001\u001d\u0001\u0016\u0001\u000f\u0001"+
    "\u0018\u0001\u0019\u0001\u0003\u0001\u0017\u0001\u0008\u0005\uffff\u0001"+
    "\u0012\u0002\uffff\u0001\u000e\u0002\uffff\u0001\u0006\u0001\uffff\u0001"+
    "\u0007\u0004\uffff\u0001\u001c\u0003\uffff\u0001\u0013\u0006\uffff\u0001"+
    "\u0014\u0006\uffff\u0001\u0001\u0002\uffff}>",
    DFA16_transitionS: [
            "\u0002\u0005\u0002\uffff\u0001\u0005\u0012\uffff\u0001\u0005"+
            "\u0001\u000e\u0001\u0001\u0003\u000e\u0001\u000d\u0001\u0002"+
            "\u0007\u000e\u0001\u0004\u000a\u000e\u0001\u000c\u0001\u000e"+
            "\u0001\u000b\u0001\u0007\u0001\u0003\u0002\u000e\u001a\u0006"+
            "\u0002\u000e\u0001\u0008\u0001\u000e\u0001\u0006\u0001\u000e"+
            "\u001a\u0006\u0001\u0009\u0001\u000e\u0001\u000a\ud782\u000e"+
            "\u0800\uffff\u1ffe\u000e",
            "\u0002\u0011\u0002\uffff\u0001\u0011\u0012\uffff\u0002\u0011"+
            "\u0001\u000f\u0003\u0011\u0001\uffff\u0015\u0011\u0001\uffff"+
            "\u003e\u0011\u0001\uffff\u0001\u0011\u0001\uffff\ud782\u0011"+
            "\u0800\uffff\u1ffe\u0011",
            "\u0002\u0011\u0002\uffff\u0001\u0011\u0012\uffff\u0006\u0011"+
            "\u0001\uffff\u0001\u0012\u0014\u0011\u0001\uffff\u003e\u0011"+
            "\u0001\uffff\u0001\u0011\u0001\uffff\ud782\u0011\u0800\uffff"+
            "\u1ffe\u0011",
            "\u0002\u000e\u0002\uffff\u0001\u000e\u0012\uffff\u0002\u000e"+
            "\u0001\u0011\u0003\u000e\u0001\uffff\u0001\u0011\u0014\u000e"+
            "\u0001\uffff\u003e\u000e\u0001\uffff\u0001\u000e\u0001\uffff"+
            "\ud782\u000e\u0800\uffff\u1ffe\u000e",
            "\u0002\u000e\u0002\uffff\u0001\u000e\u0012\uffff\u0002\u000e"+
            "\u0001\u0011\u0003\u000e\u0001\uffff\u0001\u0011\u0014\u000e"+
            "\u0001\uffff\u0001\u000e\u0001\u0015\u003c\u000e\u0001\uffff"+
            "\u0001\u000e\u0001\uffff\ud782\u000e\u0800\uffff\u1ffe\u000e",
            "\u0002\u0005\u0002\uffff\u0001\u0005\u0012\uffff\u0001\u0005"+
            "\u0001\u000e\u0001\u0011\u0003\u000e\u0001\uffff\u0001\u0011"+
            "\u0014\u000e\u0001\uffff\u003e\u000e\u0001\uffff\u0001\u000e"+
            "\u0001\uffff\ud782\u000e\u0800\uffff\u1ffe\u000e",
            "\u0002\u000e\u0002\uffff\u0001\u000e\u0012\uffff\u0002\u000e"+
            "\u0001\u0011\u0003\u000e\u0001\uffff\u0001\u0011\u0005\u000e"+
            "\u0002\u0019\u0001\u000e\u000a\u0019\u0002\u000e\u0001\uffff"+
            "\u0004\u000e\u001a\u0019\u0004\u000e\u0001\u0019\u0001\u000e"+
            "\u001a\u0019\u0001\uffff\u0001\u000e\u0001\uffff\ud782\u000e"+
            "\u0800\uffff\u1ffe\u000e",
            "\u0002\u000e\u0002\uffff\u0001\u000e\u0012\uffff\u0002\u000e"+
            "\u0001\u0011\u0003\u000e\u0001\uffff\u0001\u0011\u0014\u000e"+
            "\u0001\uffff\u003e\u000e\u0001\uffff\u0001\u000e\u0001\uffff"+
            "\ud782\u000e\u0800\uffff\u1ffe\u000e",
            "\u0002\u000e\u0002\uffff\u0001\u000e\u0012\uffff\u0002\u000e"+
            "\u0001\u0011\u0003\u000e\u0001\uffff\u0001\u0011\u0014\u000e"+
            "\u0001\uffff\u0020\u000e\u0001\u001b\u001d\u000e\u0001\uffff"+
            "\u0001\u000e\u0001\uffff\ud782\u000e\u0800\uffff\u1ffe\u000e",
            "\u0001\u001c",
            "\u0001\u001e",
            "\u0001\u0021\u000d\uffff\u0001\u0020\u000f\uffff\u0001\u0022",
            "\u0002\u000e\u0002\uffff\u0001\u000e\u0012\uffff\u0002\u000e"+
            "\u0001\u0011\u0003\u000e\u0001\uffff\u0001\u0011\u0014\u000e"+
            "\u0001\uffff\u003e\u000e\u0001\uffff\u0001\u000e\u0001\uffff"+
            "\ud782\u000e\u0800\uffff\u1ffe\u000e",
            "\u0001\u0025\u003d\uffff\u0001\u0026\u0005\uffff\u0001\u0026"+
            "\u0004\uffff\u0001\u0026\u0004\uffff\u0001\u0026",
            "\u0002\u000e\u0002\uffff\u0001\u000e\u0012\uffff\u0002\u000e"+
            "\u0001\u0011\u0003\u000e\u0001\uffff\u0001\u0011\u0014\u000e"+
            "\u0001\uffff\u003e\u000e\u0001\uffff\u0001\u000e\u0001\uffff"+
            "\ud782\u000e\u0800\uffff\u1ffe\u000e",
            "\u0002\u0011\u0002\uffff\u0001\u0011\u0012\uffff\u0006\u0011"+
            "\u0001\uffff\u0015\u0011\u0001\uffff\u003e\u0011\u0001\uffff"+
            "\u0001\u0011\u0001\uffff\ud782\u0011\u0800\uffff\u1ffe\u0011",
            "\u0001\uffff",
            "",
            "\u0002\u0011\u0002\uffff\u0001\u0011\u0012\uffff\u0006\u0011"+
            "\u0001\uffff\u0015\u0011\u0001\uffff\u003e\u0011\u0001\uffff"+
            "\u0001\u0011\u0001\uffff\ud782\u0011\u0800\uffff\u1ffe\u0011",
            "\u0001\uffff",
            "\u0001\uffff",
            "\u0002\u000e\u0002\uffff\u0001\u000e\u0012\uffff\u0002\u000e"+
            "\u0001\u0011\u0003\u000e\u0001\uffff\u0001\u0011\u0014\u000e"+
            "\u0001\uffff\u003e\u000e\u0001\uffff\u0001\u000e\u0001\uffff"+
            "\ud782\u000e\u0800\uffff\u1ffe\u000e",
            "\u0001\uffff",
            "\u0001\uffff",
            "\u0001\uffff",
            "\u0002\u000e\u0002\uffff\u0001\u000e\u0012\uffff\u0002\u000e"+
            "\u0001\u0011\u0003\u000e\u0001\uffff\u0001\u0011\u0005\u000e"+
            "\u0002\u0019\u0001\u000e\u000a\u0019\u0002\u000e\u0001\uffff"+
            "\u0004\u000e\u001a\u0019\u0004\u000e\u0001\u0019\u0001\u000e"+
            "\u001a\u0019\u0001\uffff\u0001\u000e\u0001\uffff\ud782\u000e"+
            "\u0800\uffff\u1ffe\u000e",
            "\u0001\uffff",
            "\u0002\u000e\u0002\uffff\u0001\u000e\u0012\uffff\u0002\u000e"+
            "\u0001\u0011\u0003\u000e\u0001\uffff\u0001\u0011\u0014\u000e"+
            "\u0001\uffff\u0001\u000e\u0001\u0032\u003c\u000e\u0001\uffff"+
            "\u0001\u000e\u0001\uffff\ud782\u000e\u0800\uffff\u1ffe\u000e",
            "",
            "",
            "",
            "",
            "",
            "\u0001\u0034\u002d\uffff\u0001\u0033",
            "",
            "",
            "\u0001\uffff",
            "",
            "",
            "\u0001\uffff",
            "",
            "\u0001\uffff",
            "",
            "",
            "",
            "",
            "\u0001\uffff",
            "",
            "",
            "",
            "\u0002\u000e\u0002\uffff\u0001\u000e\u0012\uffff\u0002\u000e"+
            "\u0001\u0011\u0003\u000e\u0001\uffff\u0001\u0011\u0014\u000e"+
            "\u0001\uffff\u003e\u000e\u0001\uffff\u0001\u000e\u0001\uffff"+
            "\ud782\u000e\u0800\uffff\u1ffe\u000e",
            "\u0001\u003a",
            "",
            "",
            "",
            "",
            "",
            "\u0001\uffff",
            "\u0001\u003c",
            "",
            "\u0001\u003d",
            "\u0001\u003e",
            "\u0001\u003f",
            "\u0001\u0040",
            "\u0000\u0042",
            "",
            ""
    ]
});

org.antlr.lang.augmentObject(XMLLexer, {
    DFA16_eot:
        org.antlr.runtime.DFA.unpackEncodedString(XMLLexer.DFA16_eotS),
    DFA16_eof:
        org.antlr.runtime.DFA.unpackEncodedString(XMLLexer.DFA16_eofS),
    DFA16_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(XMLLexer.DFA16_minS),
    DFA16_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(XMLLexer.DFA16_maxS),
    DFA16_accept:
        org.antlr.runtime.DFA.unpackEncodedString(XMLLexer.DFA16_acceptS),
    DFA16_special:
        org.antlr.runtime.DFA.unpackEncodedString(XMLLexer.DFA16_specialS),
    DFA16_transition: (function() {
        var a = [],
            i,
            numStates = XMLLexer.DFA16_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(XMLLexer.DFA16_transitionS[i]));
        }
        return a;
    })()
});

XMLLexer.DFA16 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 16;
    this.eot = XMLLexer.DFA16_eot;
    this.eof = XMLLexer.DFA16_eof;
    this.min = XMLLexer.DFA16_min;
    this.max = XMLLexer.DFA16_max;
    this.accept = XMLLexer.DFA16_accept;
    this.special = XMLLexer.DFA16_special;
    this.transition = XMLLexer.DFA16_transition;
};

org.antlr.lang.extend(XMLLexer.DFA16, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "1:1: Tokens : ( QUOT | APOS | L_QuotAttrContentChar | L_AposAttrContentChar | L_ElementContentChar | GREATER | EMPTY_CLOSE_TAG | S | L_NCName | EQUAL | ESCAPE_APOS | ESCAPE_QUOT | ESCAPE_LBRACKET | ESCAPE_RBRACKET | LBRACKET | RBRACKET | SMALLER | CLOSE_TAG | CDATA_START | CDATA_END | L_CDataSection | L_PredefinedEntityRef | L_CharRef | L_DirCommentConstructor | L_DirPIConstructor | COLON );";
    },
    specialStateTransition: function(s, input) {
        var _s = s;
        /* bind to recognizer so semantic predicates can be evaluated */
        var retval = (function(s, input) {
            switch ( s ) {
                        case 0 : 
                            var LA16_0 = input.LA(1);

                             
                            var index16_0 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (LA16_0=='\"') && ((( this.inQuotAttr )||( this.inElem || this.inQuotAttr )||( !this.inElem )))) {s = 1;}

                            else if ( (LA16_0=='\'') && ((( this.inElem || this.inAposAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 2;}

                            else if ( (LA16_0=='>') && ((( this.inElem )||( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 3;}

                            else if ( (LA16_0=='/') && ((( this.inElem )||( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 4;}

                            else if ( ((LA16_0>='\t' && LA16_0<='\n')||LA16_0=='\r'||LA16_0==' ') && ((( this.inElem )||( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 5;}

                            else if ( ((LA16_0>='A' && LA16_0<='Z')||LA16_0=='_'||(LA16_0>='a' && LA16_0<='z')) && ((( this.inElem )||( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 6;}

                            else if ( (LA16_0=='=') && ((( this.inElem  )||( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 7;}

                            else if ( (LA16_0==']') ) {s = 8;}

                            else if ( (LA16_0=='{') && (( !this.inElem || this.inAposAttr || this.inQuotAttr ))) {s = 9;}

                            else if ( (LA16_0=='}') && (( !this.inElem || this.inAposAttr || this.inQuotAttr ))) {s = 10;}

                            else if ( (LA16_0=='<') ) {s = 11;}

                            else if ( (LA16_0==':') ) {s = 12;}

                            else if ( (LA16_0=='&') ) {s = 13;}

                            else if ( (LA16_0=='!'||(LA16_0>='#' && LA16_0<='%')||(LA16_0>='(' && LA16_0<='.')||(LA16_0>='0' && LA16_0<='9')||LA16_0==';'||(LA16_0>='?' && LA16_0<='@')||(LA16_0>='[' && LA16_0<='\\')||LA16_0=='^'||LA16_0=='`'||LA16_0=='|'||(LA16_0>='~' && LA16_0<='\uD7FF')||(LA16_0>='\uE000' && LA16_0<='\uFFFD')) && ((( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 14;}

                             
                            input.seek(index16_0);
                            if ( s>=0 ) return s;
                            break;
                        case 1 : 
                            var LA16_64 = input.LA(1);

                             
                            var index16_64 = input.index();
                            input.rewind();
                            s = -1;
                            if ( ((LA16_64>='\u0000' && LA16_64<='\uFFFF')) && (( !this.inElem ))) {s = 66;}

                            else s = 65;

                             
                            input.seek(index16_64);
                            if ( s>=0 ) return s;
                            break;
                        case 2 : 
                            var LA16_7 = input.LA(1);

                             
                            var index16_7 = input.index();
                            input.rewind();
                            s = -1;
                            if ( ((LA16_7>='\t' && LA16_7<='\n')||LA16_7=='\r'||(LA16_7>=' ' && LA16_7<='!')||(LA16_7>='#' && LA16_7<='%')||(LA16_7>='(' && LA16_7<=';')||(LA16_7>='=' && LA16_7<='z')||LA16_7=='|'||(LA16_7>='~' && LA16_7<='\uD7FF')||(LA16_7>='\uE000' && LA16_7<='\uFFFD')) && ((( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 14;}

                            else if ( (LA16_7=='\"'||LA16_7=='\'') && (( !this.inElem ))) {s = 17;}

                            else s = 26;

                             
                            input.seek(index16_7);
                            if ( s>=0 ) return s;
                            break;
                        case 3 : 
                            var LA16_25 = input.LA(1);

                             
                            var index16_25 = input.index();
                            input.rewind();
                            s = -1;
                            if ( ((LA16_25>='-' && LA16_25<='.')||(LA16_25>='0' && LA16_25<='9')||(LA16_25>='A' && LA16_25<='Z')||LA16_25=='_'||(LA16_25>='a' && LA16_25<='z')) && ((( this.inElem )||( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 25;}

                            else if ( (LA16_25=='\"'||LA16_25=='\'') && (( !this.inElem ))) {s = 17;}

                            else if ( ((LA16_25>='\t' && LA16_25<='\n')||LA16_25=='\r'||(LA16_25>=' ' && LA16_25<='!')||(LA16_25>='#' && LA16_25<='%')||(LA16_25>='(' && LA16_25<=',')||LA16_25=='/'||(LA16_25>=':' && LA16_25<=';')||(LA16_25>='=' && LA16_25<='@')||(LA16_25>='[' && LA16_25<='^')||LA16_25=='`'||LA16_25=='|'||(LA16_25>='~' && LA16_25<='\uD7FF')||(LA16_25>='\uE000' && LA16_25<='\uFFFD')) && ((( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 14;}

                            else s = 24;

                             
                            input.seek(index16_25);
                            if ( s>=0 ) return s;
                            break;
                        case 4 : 
                            var LA16_3 = input.LA(1);

                             
                            var index16_3 = input.index();
                            input.rewind();
                            s = -1;
                            if ( ((LA16_3>='\t' && LA16_3<='\n')||LA16_3=='\r'||(LA16_3>=' ' && LA16_3<='!')||(LA16_3>='#' && LA16_3<='%')||(LA16_3>='(' && LA16_3<=';')||(LA16_3>='=' && LA16_3<='z')||LA16_3=='|'||(LA16_3>='~' && LA16_3<='\uD7FF')||(LA16_3>='\uE000' && LA16_3<='\uFFFD')) && ((( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 14;}

                            else if ( (LA16_3=='\"'||LA16_3=='\'') && (( !this.inElem ))) {s = 17;}

                            else s = 20;

                             
                            input.seek(index16_3);
                            if ( s>=0 ) return s;
                            break;
                        case 5 : 
                            var LA16_10 = input.LA(1);

                             
                            var index16_10 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (LA16_10=='}') && (( !this.inElem || this.inAposAttr || this.inQuotAttr ))) {s = 30;}

                            else s = 31;

                             
                            input.seek(index16_10);
                            if ( s>=0 ) return s;
                            break;
                        case 6 : 
                            var LA16_39 = input.LA(1);

                             
                            var index16_39 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( !this.inElem )) ) {s = 17;}

                            else if ( (( this.inQuotAttr )) ) {s = 54;}

                             
                            input.seek(index16_39);
                            if ( s>=0 ) return s;
                            break;
                        case 7 : 
                            var LA16_41 = input.LA(1);

                             
                            var index16_41 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( !this.inElem )) ) {s = 17;}

                            else if ( (( this.inAposAttr )) ) {s = 55;}

                             
                            input.seek(index16_41);
                            if ( s>=0 ) return s;
                            break;
                        case 8 : 
                            var LA16_27 = input.LA(1);

                             
                            var index16_27 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (LA16_27=='>') ) {s = 50;}

                            else if ( ((LA16_27>='\t' && LA16_27<='\n')||LA16_27=='\r'||(LA16_27>=' ' && LA16_27<='!')||(LA16_27>='#' && LA16_27<='%')||(LA16_27>='(' && LA16_27<=';')||LA16_27=='='||(LA16_27>='?' && LA16_27<='z')||LA16_27=='|'||(LA16_27>='~' && LA16_27<='\uD7FF')||(LA16_27>='\uE000' && LA16_27<='\uFFFD')) && ((( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 14;}

                            else if ( (LA16_27=='\"'||LA16_27=='\'') && (( !this.inElem ))) {s = 17;}

                            else s = 22;

                             
                            input.seek(index16_27);
                            if ( s>=0 ) return s;
                            break;
                        case 9 : 
                            var LA16_16 = input.LA(1);

                             
                            var index16_16 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( this.inElem || this.inQuotAttr )) ) {s = 40;}

                            else if ( (( !this.inElem )) ) {s = 17;}

                             
                            input.seek(index16_16);
                            if ( s>=0 ) return s;
                            break;
                        case 10 : 
                            var LA16_19 = input.LA(1);

                             
                            var index16_19 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( this.inElem || this.inAposAttr )) ) {s = 42;}

                            else if ( (( !this.inElem )) ) {s = 17;}

                             
                            input.seek(index16_19);
                            if ( s>=0 ) return s;
                            break;
                        case 11 : 
                            var LA16_8 = input.LA(1);

                             
                            var index16_8 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (LA16_8==']') ) {s = 27;}

                            else if ( ((LA16_8>='\t' && LA16_8<='\n')||LA16_8=='\r'||(LA16_8>=' ' && LA16_8<='!')||(LA16_8>='#' && LA16_8<='%')||(LA16_8>='(' && LA16_8<=';')||(LA16_8>='=' && LA16_8<='\\')||(LA16_8>='^' && LA16_8<='z')||LA16_8=='|'||(LA16_8>='~' && LA16_8<='\uD7FF')||(LA16_8>='\uE000' && LA16_8<='\uFFFD')) && ((( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 14;}

                            else if ( (LA16_8=='\"'||LA16_8=='\'') && (( !this.inElem ))) {s = 17;}

                            else s = 22;

                             
                            input.seek(index16_8);
                            if ( s>=0 ) return s;
                            break;
                        case 12 : 
                            var LA16_14 = input.LA(1);

                             
                            var index16_14 = input.index();
                            input.rewind();
                            s = -1;
                            if ( ((LA16_14>='\t' && LA16_14<='\n')||LA16_14=='\r'||(LA16_14>=' ' && LA16_14<='!')||(LA16_14>='#' && LA16_14<='%')||(LA16_14>='(' && LA16_14<=';')||(LA16_14>='=' && LA16_14<='z')||LA16_14=='|'||(LA16_14>='~' && LA16_14<='\uD7FF')||(LA16_14>='\uE000' && LA16_14<='\uFFFD')) && ((( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 14;}

                            else if ( (LA16_14=='\"'||LA16_14=='\'') && (( !this.inElem ))) {s = 17;}

                            else s = 22;

                             
                            input.seek(index16_14);
                            if ( s>=0 ) return s;
                            break;
                        case 13 : 
                            var LA16_4 = input.LA(1);

                             
                            var index16_4 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (LA16_4=='>') && ((( this.inElem )||( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 21;}

                            else if ( ((LA16_4>='\t' && LA16_4<='\n')||LA16_4=='\r'||(LA16_4>=' ' && LA16_4<='!')||(LA16_4>='#' && LA16_4<='%')||(LA16_4>='(' && LA16_4<=';')||LA16_4=='='||(LA16_4>='?' && LA16_4<='z')||LA16_4=='|'||(LA16_4>='~' && LA16_4<='\uD7FF')||(LA16_4>='\uE000' && LA16_4<='\uFFFD')) && ((( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 14;}

                            else if ( (LA16_4=='\"'||LA16_4=='\'') && (( !this.inElem ))) {s = 17;}

                            else s = 22;

                             
                            input.seek(index16_4);
                            if ( s>=0 ) return s;
                            break;
                        case 14 : 
                            var LA16_36 = input.LA(1);

                             
                            var index16_36 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( this.inQuotAttr )) ) {s = 43;}

                            else if ( (( this.inAposAttr )) ) {s = 44;}

                            else if ( (( !this.inElem )) ) {s = 17;}

                            else if ( (true) ) {s = 53;}

                             
                            input.seek(index16_36);
                            if ( s>=0 ) return s;
                            break;
                        case 15 : 
                            var LA16_22 = input.LA(1);

                             
                            var index16_22 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( this.inQuotAttr )) ) {s = 43;}

                            else if ( (( this.inAposAttr )) ) {s = 44;}

                            else if ( (( !this.inElem )) ) {s = 17;}

                             
                            input.seek(index16_22);
                            if ( s>=0 ) return s;
                            break;
                        case 16 : 
                            var LA16_18 = input.LA(1);

                             
                            var index16_18 = input.index();
                            input.rewind();
                            s = -1;
                            if ( ((LA16_18>='\t' && LA16_18<='\n')||LA16_18=='\r'||(LA16_18>=' ' && LA16_18<='%')||(LA16_18>='\'' && LA16_18<=';')||(LA16_18>='=' && LA16_18<='z')||LA16_18=='|'||(LA16_18>='~' && LA16_18<='\uD7FF')||(LA16_18>='\uE000' && LA16_18<='\uFFFD')) && (( !this.inElem ))) {s = 17;}

                            else s = 41;

                             
                            input.seek(index16_18);
                            if ( s>=0 ) return s;
                            break;
                        case 17 : 
                            var LA16_11 = input.LA(1);

                             
                            var index16_11 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (LA16_11=='/') && (( !this.inElem ))) {s = 32;}

                            else if ( (LA16_11=='!') ) {s = 33;}

                            else if ( (LA16_11=='?') && (( !this.inElem ))) {s = 34;}

                            else s = 35;

                             
                            input.seek(index16_11);
                            if ( s>=0 ) return s;
                            break;
                        case 18 : 
                            var LA16_33 = input.LA(1);

                             
                            var index16_33 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (LA16_33=='[') ) {s = 51;}

                            else if ( (LA16_33=='-') && (( !this.inElem ))) {s = 52;}

                             
                            input.seek(index16_33);
                            if ( s>=0 ) return s;
                            break;
                        case 19 : 
                            var LA16_50 = input.LA(1);

                             
                            var index16_50 = input.index();
                            input.rewind();
                            s = -1;
                            if ( ((LA16_50>='\t' && LA16_50<='\n')||LA16_50=='\r'||(LA16_50>=' ' && LA16_50<='!')||(LA16_50>='#' && LA16_50<='%')||(LA16_50>='(' && LA16_50<=';')||(LA16_50>='=' && LA16_50<='z')||LA16_50=='|'||(LA16_50>='~' && LA16_50<='\uD7FF')||(LA16_50>='\uE000' && LA16_50<='\uFFFD')) && ((( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 14;}

                            else if ( (LA16_50=='\"'||LA16_50=='\'') && (( !this.inElem ))) {s = 17;}

                            else s = 57;

                             
                            input.seek(index16_50);
                            if ( s>=0 ) return s;
                            break;
                        case 20 : 
                            var LA16_57 = input.LA(1);

                             
                            var index16_57 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( this.inQuotAttr )) ) {s = 43;}

                            else if ( (( this.inAposAttr )) ) {s = 44;}

                            else if ( (( !this.inElem )) ) {s = 17;}

                            else if ( (true) ) {s = 59;}

                             
                            input.seek(index16_57);
                            if ( s>=0 ) return s;
                            break;
                        case 21 : 
                            var LA16_6 = input.LA(1);

                             
                            var index16_6 = input.index();
                            input.rewind();
                            s = -1;
                            if ( ((LA16_6>='-' && LA16_6<='.')||(LA16_6>='0' && LA16_6<='9')||(LA16_6>='A' && LA16_6<='Z')||LA16_6=='_'||(LA16_6>='a' && LA16_6<='z')) && ((( this.inElem )||( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 25;}

                            else if ( (LA16_6=='\"'||LA16_6=='\'') && (( !this.inElem ))) {s = 17;}

                            else if ( ((LA16_6>='\t' && LA16_6<='\n')||LA16_6=='\r'||(LA16_6>=' ' && LA16_6<='!')||(LA16_6>='#' && LA16_6<='%')||(LA16_6>='(' && LA16_6<=',')||LA16_6=='/'||(LA16_6>=':' && LA16_6<=';')||(LA16_6>='=' && LA16_6<='@')||(LA16_6>='[' && LA16_6<='^')||LA16_6=='`'||LA16_6=='|'||(LA16_6>='~' && LA16_6<='\uD7FF')||(LA16_6>='\uE000' && LA16_6<='\uFFFD')) && ((( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 14;}

                            else s = 24;

                             
                            input.seek(index16_6);
                            if ( s>=0 ) return s;
                            break;
                        case 22 : 
                            var LA16_21 = input.LA(1);

                             
                            var index16_21 = input.index();
                            input.rewind();
                            s = -1;
                            if ( ((LA16_21>='\t' && LA16_21<='\n')||LA16_21=='\r'||(LA16_21>=' ' && LA16_21<='!')||(LA16_21>='#' && LA16_21<='%')||(LA16_21>='(' && LA16_21<=';')||(LA16_21>='=' && LA16_21<='z')||LA16_21=='|'||(LA16_21>='~' && LA16_21<='\uD7FF')||(LA16_21>='\uE000' && LA16_21<='\uFFFD')) && ((( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 14;}

                            else if ( (LA16_21=='\"'||LA16_21=='\'') && (( !this.inElem ))) {s = 17;}

                            else s = 46;

                             
                            input.seek(index16_21);
                            if ( s>=0 ) return s;
                            break;
                        case 23 : 
                            var LA16_26 = input.LA(1);

                             
                            var index16_26 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( this.inQuotAttr )) ) {s = 43;}

                            else if ( (( this.inAposAttr )) ) {s = 44;}

                            else if ( (( !this.inElem )) ) {s = 17;}

                            else if ( (( this.inElem  )) ) {s = 49;}

                             
                            input.seek(index16_26);
                            if ( s>=0 ) return s;
                            break;
                        case 24 : 
                            var LA16_23 = input.LA(1);

                             
                            var index16_23 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( this.inQuotAttr )) ) {s = 43;}

                            else if ( (( this.inAposAttr )) ) {s = 44;}

                            else if ( (( !this.inElem )) ) {s = 17;}

                            else if ( (( this.inElem )) ) {s = 47;}

                             
                            input.seek(index16_23);
                            if ( s>=0 ) return s;
                            break;
                        case 25 : 
                            var LA16_24 = input.LA(1);

                             
                            var index16_24 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( this.inQuotAttr )) ) {s = 43;}

                            else if ( (( this.inAposAttr )) ) {s = 44;}

                            else if ( (( !this.inElem )) ) {s = 17;}

                            else if ( (( this.inElem )) ) {s = 48;}

                             
                            input.seek(index16_24);
                            if ( s>=0 ) return s;
                            break;
                        case 26 : 
                            var LA16_15 = input.LA(1);

                             
                            var index16_15 = input.index();
                            input.rewind();
                            s = -1;
                            if ( ((LA16_15>='\t' && LA16_15<='\n')||LA16_15=='\r'||(LA16_15>=' ' && LA16_15<='%')||(LA16_15>='\'' && LA16_15<=';')||(LA16_15>='=' && LA16_15<='z')||LA16_15=='|'||(LA16_15>='~' && LA16_15<='\uD7FF')||(LA16_15>='\uE000' && LA16_15<='\uFFFD')) && (( !this.inElem ))) {s = 17;}

                            else s = 39;

                             
                            input.seek(index16_15);
                            if ( s>=0 ) return s;
                            break;
                        case 27 : 
                            var LA16_12 = input.LA(1);

                             
                            var index16_12 = input.index();
                            input.rewind();
                            s = -1;
                            if ( ((LA16_12>='\t' && LA16_12<='\n')||LA16_12=='\r'||(LA16_12>=' ' && LA16_12<='!')||(LA16_12>='#' && LA16_12<='%')||(LA16_12>='(' && LA16_12<=';')||(LA16_12>='=' && LA16_12<='z')||LA16_12=='|'||(LA16_12>='~' && LA16_12<='\uD7FF')||(LA16_12>='\uE000' && LA16_12<='\uFFFD')) && ((( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 14;}

                            else if ( (LA16_12=='\"'||LA16_12=='\'') && (( !this.inElem ))) {s = 17;}

                            else s = 36;

                             
                            input.seek(index16_12);
                            if ( s>=0 ) return s;
                            break;
                        case 28 : 
                            var LA16_46 = input.LA(1);

                             
                            var index16_46 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( this.inQuotAttr )) ) {s = 43;}

                            else if ( (( this.inAposAttr )) ) {s = 44;}

                            else if ( (( !this.inElem )) ) {s = 17;}

                            else if ( (( this.inElem )) ) {s = 56;}

                             
                            input.seek(index16_46);
                            if ( s>=0 ) return s;
                            break;
                        case 29 : 
                            var LA16_20 = input.LA(1);

                             
                            var index16_20 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (( this.inQuotAttr )) ) {s = 43;}

                            else if ( (( this.inAposAttr )) ) {s = 44;}

                            else if ( (( !this.inElem )) ) {s = 17;}

                            else if ( (( this.inElem )) ) {s = 45;}

                             
                            input.seek(index16_20);
                            if ( s>=0 ) return s;
                            break;
                        case 30 : 
                            var LA16_5 = input.LA(1);

                             
                            var index16_5 = input.index();
                            input.rewind();
                            s = -1;
                            if ( ((LA16_5>='\t' && LA16_5<='\n')||LA16_5=='\r'||LA16_5==' ') && ((( this.inElem )||( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 5;}

                            else if ( (LA16_5=='\"'||LA16_5=='\'') && (( !this.inElem ))) {s = 17;}

                            else if ( (LA16_5=='!'||(LA16_5>='#' && LA16_5<='%')||(LA16_5>='(' && LA16_5<=';')||(LA16_5>='=' && LA16_5<='z')||LA16_5=='|'||(LA16_5>='~' && LA16_5<='\uD7FF')||(LA16_5>='\uE000' && LA16_5<='\uFFFD')) && ((( this.inQuotAttr )||( this.inAposAttr )||( !this.inElem )))) {s = 14;}

                            else s = 23;

                             
                            input.seek(index16_5);
                            if ( s>=0 ) return s;
                            break;
                        case 31 : 
                            var LA16_1 = input.LA(1);

                             
                            var index16_1 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (LA16_1=='\"') && ((( this.inQuotAttr )||( !this.inElem )))) {s = 15;}

                            else if ( ((LA16_1>='\t' && LA16_1<='\n')||LA16_1=='\r'||(LA16_1>=' ' && LA16_1<='!')||(LA16_1>='#' && LA16_1<='%')||(LA16_1>='\'' && LA16_1<=';')||(LA16_1>='=' && LA16_1<='z')||LA16_1=='|'||(LA16_1>='~' && LA16_1<='\uD7FF')||(LA16_1>='\uE000' && LA16_1<='\uFFFD')) && (( !this.inElem ))) {s = 17;}

                            else s = 16;

                             
                            input.seek(index16_1);
                            if ( s>=0 ) return s;
                            break;
                        case 32 : 
                            var LA16_13 = input.LA(1);

                             
                            var index16_13 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (LA16_13=='#') ) {s = 37;}

                            else if ( (LA16_13=='a'||LA16_13=='g'||LA16_13=='l'||LA16_13=='q') && (( !this.inElem || this.inAposAttr || this.inQuotAttr ))) {s = 38;}

                             
                            input.seek(index16_13);
                            if ( s>=0 ) return s;
                            break;
                        case 33 : 
                            var LA16_9 = input.LA(1);

                             
                            var index16_9 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (LA16_9=='{') && (( !this.inElem || this.inAposAttr || this.inQuotAttr ))) {s = 28;}

                            else s = 29;

                             
                            input.seek(index16_9);
                            if ( s>=0 ) return s;
                            break;
                        case 34 : 
                            var LA16_2 = input.LA(1);

                             
                            var index16_2 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (LA16_2=='\'') && ((( this.inAposAttr )||( !this.inElem )))) {s = 18;}

                            else if ( ((LA16_2>='\t' && LA16_2<='\n')||LA16_2=='\r'||(LA16_2>=' ' && LA16_2<='%')||(LA16_2>='(' && LA16_2<=';')||(LA16_2>='=' && LA16_2<='z')||LA16_2=='|'||(LA16_2>='~' && LA16_2<='\uD7FF')||(LA16_2>='\uE000' && LA16_2<='\uFFFD')) && (( !this.inElem ))) {s = 17;}

                            else s = 19;

                             
                            input.seek(index16_2);
                            if ( s>=0 ) return s;
                            break;
            }
        }).call(this.recognizer, s, input);
        if (!org.antlr.lang.isUndefined(retval)) {
            return retval;
        }
        var nvae =
            new org.antlr.runtime.NoViableAltException(this.getDescription(), 16, _s, input);
        this.error(nvae);
        throw nvae;
    },
    dummy: null
});
 
})();
exports.XMLLexer = XMLLexer; });
