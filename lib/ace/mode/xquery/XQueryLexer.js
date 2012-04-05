// $ANTLR 3.3 Nov 30, 2010 12:50:56 XQueryLexer.g 2012-04-03 22:00:03


define(function(require, exports, module){

var org =  require("./antlr3-all").org;
var XQDTLexer   = require("./XQDTLexer").XQDTLexer;

var XQueryLexer = exports.XQueryLexer = function(input, state) {
// alternate constructor @todo
// public XQueryLexer(CharStream input)
// public XQueryLexer(CharStream input, RecognizerSharedState state) {
    if (!state) {
        state = new org.antlr.runtime.RecognizerSharedState();
    }

    (function(){


        this.inStr = false;

        this.isInString = function(){ return inStr; };
        // dummy list for warning elimination
        //List<Stack<Object>> dummy = new ArrayList<Stack<Object>>();

        // when we start, the '<' has already been eaten by the other lexer
        //boolean inStr = false;
        //
        //public boolean isInString()
        //{
        //   return inStr;
        //}


    }).call(this);

    this.dfa19 = new XQueryLexer.DFA19(this);
    XQueryLexer.superclass.constructor.call(this, input, state);


};

org.antlr.lang.augmentObject(XQueryLexer, {
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
    OF: 79,
    OPTION: 80,
    OR: 81,
    ORDER: 82,
    ORDERED: 83,
    ORDERING: 84,
    PARENT: 85,
    PRECEDING: 86,
    PRECEDING_SIBLING: 87,
    PRESERVE: 88,
    PROCESSING_INSTRUCTION: 89,
    RETURN: 90,
    SATISFIES: 91,
    SCHEMA: 92,
    SCHEMA_ATTRIBUTE: 93,
    SCHEMA_ELEMENT: 94,
    SELF: 95,
    SOME: 96,
    STABLE: 97,
    STRICT: 98,
    STRIP: 99,
    TEXT: 100,
    THEN: 101,
    TO: 102,
    TREAT: 103,
    TYPESWITCH: 104,
    UNION: 105,
    UNORDERED: 106,
    VALIDATE: 107,
    VARIABLE: 108,
    VERSION: 109,
    WHERE: 110,
    XQUERY: 111,
    ALLOWING: 112,
    CATCH: 113,
    CONTEXT: 114,
    COUNT: 115,
    DECIMAL_FORMAT: 116,
    DECIMAL_SEPARATOR: 117,
    DETERMINISTIC: 118,
    DIGIT: 119,
    END: 120,
    GROUP: 121,
    GROUPING_SEPARATOR: 122,
    INFINITY: 123,
    MINUS_SIGN: 124,
    NAMESPACE_NODE: 125,
    NAN: 126,
    NEXT: 127,
    ONLY: 128,
    PATTERN_SEPARATOR: 129,
    PERCENT: 130,
    PER_MILLE: 131,
    PREVIOUS: 132,
    SLIDING: 133,
    START: 134,
    SWITCH: 135,
    TRY: 136,
    TUMBLING: 137,
    TYPE: 138,
    WHEN: 139,
    WINDOW: 140,
    ZERO_DIGIT: 141,
    AFTER: 142,
    BEFORE: 143,
    COPY: 144,
    DELETE: 145,
    FIRST: 146,
    INSERT: 147,
    INTO: 148,
    LAST: 149,
    MODIFY: 150,
    NODES: 151,
    RENAME: 152,
    REPLACE: 153,
    REVALIDATION: 154,
    SKIP: 155,
    UPDATING: 156,
    VALUE: 157,
    WITH: 158,
    ALL: 159,
    ANY: 160,
    CONTAINS: 161,
    CONTENT: 162,
    DIACRITICS: 163,
    DIFFERENT: 164,
    DISTANCE: 165,
    ENTIRE: 166,
    EXACTLY: 167,
    FROM: 168,
    FT_OPTION: 169,
    FTAND: 170,
    FTNOT: 171,
    FTOR: 172,
    INSENSITIVE: 173,
    LANGUAGE: 174,
    LEVELS: 175,
    LOWERCASE: 176,
    MOST: 177,
    NO: 178,
    NOT: 179,
    OCCURS: 180,
    PARAGRAPH: 181,
    PARAGRAPHS: 182,
    PHRASE: 183,
    RELATIONSHIP: 184,
    SAME: 185,
    SCORE: 186,
    SENSITIVE: 187,
    SENTENCE: 188,
    SENTENCES: 189,
    STEMMING: 190,
    STOP: 191,
    THESAURUS: 192,
    TIMES: 193,
    UPPERCASE: 194,
    USING: 195,
    WEIGHT: 196,
    WILDCARDS: 197,
    WITHOUT: 198,
    WORD: 199,
    WORDS: 200,
    BREAK: 201,
    CONTINUE: 202,
    EXIT: 203,
    LOOP: 204,
    RETURNING: 205,
    WHILE: 206,
    CHECK: 207,
    COLLECTION: 208,
    CONSTRAINT: 209,
    FOREACH: 210,
    FOREIGN: 211,
    INDEX: 212,
    INTEGRITY: 213,
    KEY: 214,
    ON: 215,
    UNIQUE: 216,
    BINARY: 217,
    AMP_ER: 218,
    APOS_ER: 219,
    QUOT_ER: 220,
    LPAREN: 221,
    RPAREN: 222,
    DOLLAR: 223,
    LBRACKET: 224,
    RBRACKET: 225,
    LSQUARE: 226,
    RSQUARE: 227,
    EQUAL: 228,
    BIND: 229,
    NOTEQUAL: 230,
    ANN_PERCENT: 231,
    HASH: 232,
    AMP: 233,
    COMMA: 234,
    QUESTION: 235,
    STAR: 236,
    PLUS: 237,
    MINUS: 238,
    SMALLER: 239,
    GREATER: 240,
    SMALLEREQ: 241,
    GREATEREQ: 242,
    SMALLER_SMALLER: 243,
    GREATER_GREATER: 244,
    SLASH: 245,
    SLASH_SLASH: 246,
    DOT: 247,
    DOT_DOT: 248,
    COLON: 249,
    COLON_COLON: 250,
    EMPTY_CLOSE_TAG: 251,
    CLOSE_TAG: 252,
    SEMICOLON: 253,
    VBAR: 254,
    PRAGMA_START: 255,
    PRAGMA_END: 256,
    XML_COMMENT_START: 257,
    XML_COMMENT_END: 258,
    PI_START: 259,
    PI_END: 260,
    ATTR_SIGN: 261,
    CHARREF_DEC: 262,
    CHARREF_HEX: 263,
    APOS: 264,
    QUOT: 265,
    NCNameStartChar: 266,
    NCNameChar: 267,
    L_NCName: 268,
    Letter: 269,
    HexLetter: 270,
    Digit: 271,
    Digits: 272,
    S: 273,
    SU: 274,
    L_Pragma: 275,
    L_DirCommentConstructor: 276,
    L_DirPIConstructor: 277,
    L_IntegerLiteral: 278,
    L_DecimalLiteral: 279,
    L_DoubleLiteral: 280,
    L_Comment: 281,
    L_AnyChar: 282
});

(function(){
var HIDDEN = org.antlr.runtime.Token.HIDDEN_CHANNEL,
    EOF = org.antlr.runtime.Token.EOF;
org.antlr.lang.extend(XQueryLexer, XQDTLexer, {
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
    OF : 79,
    OPTION : 80,
    OR : 81,
    ORDER : 82,
    ORDERED : 83,
    ORDERING : 84,
    PARENT : 85,
    PRECEDING : 86,
    PRECEDING_SIBLING : 87,
    PRESERVE : 88,
    PROCESSING_INSTRUCTION : 89,
    RETURN : 90,
    SATISFIES : 91,
    SCHEMA : 92,
    SCHEMA_ATTRIBUTE : 93,
    SCHEMA_ELEMENT : 94,
    SELF : 95,
    SOME : 96,
    STABLE : 97,
    STRICT : 98,
    STRIP : 99,
    TEXT : 100,
    THEN : 101,
    TO : 102,
    TREAT : 103,
    TYPESWITCH : 104,
    UNION : 105,
    UNORDERED : 106,
    VALIDATE : 107,
    VARIABLE : 108,
    VERSION : 109,
    WHERE : 110,
    XQUERY : 111,
    ALLOWING : 112,
    CATCH : 113,
    CONTEXT : 114,
    COUNT : 115,
    DECIMAL_FORMAT : 116,
    DECIMAL_SEPARATOR : 117,
    DETERMINISTIC : 118,
    DIGIT : 119,
    END : 120,
    GROUP : 121,
    GROUPING_SEPARATOR : 122,
    INFINITY : 123,
    MINUS_SIGN : 124,
    NAMESPACE_NODE : 125,
    NAN : 126,
    NEXT : 127,
    ONLY : 128,
    PATTERN_SEPARATOR : 129,
    PERCENT : 130,
    PER_MILLE : 131,
    PREVIOUS : 132,
    SLIDING : 133,
    START : 134,
    SWITCH : 135,
    TRY : 136,
    TUMBLING : 137,
    TYPE : 138,
    WHEN : 139,
    WINDOW : 140,
    ZERO_DIGIT : 141,
    AFTER : 142,
    BEFORE : 143,
    COPY : 144,
    DELETE : 145,
    FIRST : 146,
    INSERT : 147,
    INTO : 148,
    LAST : 149,
    MODIFY : 150,
    NODES : 151,
    RENAME : 152,
    REPLACE : 153,
    REVALIDATION : 154,
    SKIP : 155,
    UPDATING : 156,
    VALUE : 157,
    WITH : 158,
    ALL : 159,
    ANY : 160,
    CONTAINS : 161,
    CONTENT : 162,
    DIACRITICS : 163,
    DIFFERENT : 164,
    DISTANCE : 165,
    ENTIRE : 166,
    EXACTLY : 167,
    FROM : 168,
    FT_OPTION : 169,
    FTAND : 170,
    FTNOT : 171,
    FTOR : 172,
    INSENSITIVE : 173,
    LANGUAGE : 174,
    LEVELS : 175,
    LOWERCASE : 176,
    MOST : 177,
    NO : 178,
    NOT : 179,
    OCCURS : 180,
    PARAGRAPH : 181,
    PARAGRAPHS : 182,
    PHRASE : 183,
    RELATIONSHIP : 184,
    SAME : 185,
    SCORE : 186,
    SENSITIVE : 187,
    SENTENCE : 188,
    SENTENCES : 189,
    STEMMING : 190,
    STOP : 191,
    THESAURUS : 192,
    TIMES : 193,
    UPPERCASE : 194,
    USING : 195,
    WEIGHT : 196,
    WILDCARDS : 197,
    WITHOUT : 198,
    WORD : 199,
    WORDS : 200,
    BREAK : 201,
    CONTINUE : 202,
    EXIT : 203,
    LOOP : 204,
    RETURNING : 205,
    WHILE : 206,
    CHECK : 207,
    COLLECTION : 208,
    CONSTRAINT : 209,
    FOREACH : 210,
    FOREIGN : 211,
    INDEX : 212,
    INTEGRITY : 213,
    KEY : 214,
    ON : 215,
    UNIQUE : 216,
    BINARY : 217,
    AMP_ER : 218,
    APOS_ER : 219,
    QUOT_ER : 220,
    LPAREN : 221,
    RPAREN : 222,
    DOLLAR : 223,
    LBRACKET : 224,
    RBRACKET : 225,
    LSQUARE : 226,
    RSQUARE : 227,
    EQUAL : 228,
    BIND : 229,
    NOTEQUAL : 230,
    ANN_PERCENT : 231,
    HASH : 232,
    AMP : 233,
    COMMA : 234,
    QUESTION : 235,
    STAR : 236,
    PLUS : 237,
    MINUS : 238,
    SMALLER : 239,
    GREATER : 240,
    SMALLEREQ : 241,
    GREATEREQ : 242,
    SMALLER_SMALLER : 243,
    GREATER_GREATER : 244,
    SLASH : 245,
    SLASH_SLASH : 246,
    DOT : 247,
    DOT_DOT : 248,
    COLON : 249,
    COLON_COLON : 250,
    EMPTY_CLOSE_TAG : 251,
    CLOSE_TAG : 252,
    SEMICOLON : 253,
    VBAR : 254,
    PRAGMA_START : 255,
    PRAGMA_END : 256,
    XML_COMMENT_START : 257,
    XML_COMMENT_END : 258,
    PI_START : 259,
    PI_END : 260,
    ATTR_SIGN : 261,
    CHARREF_DEC : 262,
    CHARREF_HEX : 263,
    APOS : 264,
    QUOT : 265,
    NCNameStartChar : 266,
    NCNameChar : 267,
    L_NCName : 268,
    Letter : 269,
    HexLetter : 270,
    Digit : 271,
    Digits : 272,
    S : 273,
    SU : 274,
    L_Pragma : 275,
    L_DirCommentConstructor : 276,
    L_DirPIConstructor : 277,
    L_IntegerLiteral : 278,
    L_DecimalLiteral : 279,
    L_DoubleLiteral : 280,
    L_Comment : 281,
    L_AnyChar : 282,
    getGrammarFileName: function() { return "XQueryLexer.g"; }
});
org.antlr.lang.augmentObject(XQueryLexer.prototype, {
    // $ANTLR start ANCESTOR
    mANCESTOR: function()  {
        try {
            var _type = this.ANCESTOR;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:49:29: ( 'ancestor' )
            // XQueryLexer.g:49:31: 'ancestor'
            this.match("ancestor"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ANCESTOR",

    // $ANTLR start ANCESTOR_OR_SELF
    mANCESTOR_OR_SELF: function()  {
        try {
            var _type = this.ANCESTOR_OR_SELF;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:50:29: ( 'ancestor-or-self' )
            // XQueryLexer.g:50:31: 'ancestor-or-self'
            this.match("ancestor-or-self"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ANCESTOR_OR_SELF",

    // $ANTLR start AND
    mAND: function()  {
        try {
            var _type = this.AND;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:51:29: ( 'and' )
            // XQueryLexer.g:51:31: 'and'
            this.match("and"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "AND",

    // $ANTLR start AS
    mAS: function()  {
        try {
            var _type = this.AS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:52:29: ( 'as' )
            // XQueryLexer.g:52:31: 'as'
            this.match("as"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "AS",

    // $ANTLR start ASCENDING
    mASCENDING: function()  {
        try {
            var _type = this.ASCENDING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:53:29: ( 'ascending' )
            // XQueryLexer.g:53:31: 'ascending'
            this.match("ascending"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ASCENDING",

    // $ANTLR start AT
    mAT: function()  {
        try {
            var _type = this.AT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:54:29: ( 'at' )
            // XQueryLexer.g:54:31: 'at'
            this.match("at"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "AT",

    // $ANTLR start ATTRIBUTE
    mATTRIBUTE: function()  {
        try {
            var _type = this.ATTRIBUTE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:55:29: ( 'attribute' )
            // XQueryLexer.g:55:31: 'attribute'
            this.match("attribute"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ATTRIBUTE",

    // $ANTLR start BASE_URI
    mBASE_URI: function()  {
        try {
            var _type = this.BASE_URI;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:56:29: ( 'base-uri' )
            // XQueryLexer.g:56:31: 'base-uri'
            this.match("base-uri"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "BASE_URI",

    // $ANTLR start BOUNDARY_SPACE
    mBOUNDARY_SPACE: function()  {
        try {
            var _type = this.BOUNDARY_SPACE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:57:29: ( 'boundary-space' )
            // XQueryLexer.g:57:31: 'boundary-space'
            this.match("boundary-space"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "BOUNDARY_SPACE",

    // $ANTLR start BY
    mBY: function()  {
        try {
            var _type = this.BY;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:58:29: ( 'by' )
            // XQueryLexer.g:58:31: 'by'
            this.match("by"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "BY",

    // $ANTLR start CASE
    mCASE: function()  {
        try {
            var _type = this.CASE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:59:29: ( 'case' )
            // XQueryLexer.g:59:31: 'case'
            this.match("case"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "CASE",

    // $ANTLR start CAST
    mCAST: function()  {
        try {
            var _type = this.CAST;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:60:29: ( 'cast' )
            // XQueryLexer.g:60:31: 'cast'
            this.match("cast"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "CAST",

    // $ANTLR start CASTABLE
    mCASTABLE: function()  {
        try {
            var _type = this.CASTABLE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:61:29: ( 'castable' )
            // XQueryLexer.g:61:31: 'castable'
            this.match("castable"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "CASTABLE",

    // $ANTLR start CHILD
    mCHILD: function()  {
        try {
            var _type = this.CHILD;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:62:29: ( 'child' )
            // XQueryLexer.g:62:31: 'child'
            this.match("child"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "CHILD",

    // $ANTLR start COLLATION
    mCOLLATION: function()  {
        try {
            var _type = this.COLLATION;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:63:29: ( 'collation' )
            // XQueryLexer.g:63:31: 'collation'
            this.match("collation"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "COLLATION",

    // $ANTLR start COMMENT
    mCOMMENT: function()  {
        try {
            var _type = this.COMMENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:64:29: ( 'comment' )
            // XQueryLexer.g:64:31: 'comment'
            this.match("comment"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "COMMENT",

    // $ANTLR start CONSTRUCTION
    mCONSTRUCTION: function()  {
        try {
            var _type = this.CONSTRUCTION;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:65:29: ( 'construction' )
            // XQueryLexer.g:65:31: 'construction'
            this.match("construction"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "CONSTRUCTION",

    // $ANTLR start COPY_NAMESPACES
    mCOPY_NAMESPACES: function()  {
        try {
            var _type = this.COPY_NAMESPACES;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:66:29: ( 'copy-namespaces' )
            // XQueryLexer.g:66:31: 'copy-namespaces'
            this.match("copy-namespaces"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "COPY_NAMESPACES",

    // $ANTLR start DECLARE
    mDECLARE: function()  {
        try {
            var _type = this.DECLARE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:67:29: ( 'declare' )
            // XQueryLexer.g:67:31: 'declare'
            this.match("declare"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DECLARE",

    // $ANTLR start DEFAULT
    mDEFAULT: function()  {
        try {
            var _type = this.DEFAULT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:68:29: ( 'default' )
            // XQueryLexer.g:68:31: 'default'
            this.match("default"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DEFAULT",

    // $ANTLR start DESCENDANT
    mDESCENDANT: function()  {
        try {
            var _type = this.DESCENDANT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:69:29: ( 'descendant' )
            // XQueryLexer.g:69:31: 'descendant'
            this.match("descendant"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DESCENDANT",

    // $ANTLR start DESCENDANT_OR_SELF
    mDESCENDANT_OR_SELF: function()  {
        try {
            var _type = this.DESCENDANT_OR_SELF;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:70:29: ( 'descendant-or-self' )
            // XQueryLexer.g:70:31: 'descendant-or-self'
            this.match("descendant-or-self"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DESCENDANT_OR_SELF",

    // $ANTLR start DESCENDING
    mDESCENDING: function()  {
        try {
            var _type = this.DESCENDING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:71:29: ( 'descending' )
            // XQueryLexer.g:71:31: 'descending'
            this.match("descending"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DESCENDING",

    // $ANTLR start DIV
    mDIV: function()  {
        try {
            var _type = this.DIV;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:72:29: ( 'div' )
            // XQueryLexer.g:72:31: 'div'
            this.match("div"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DIV",

    // $ANTLR start DOCUMENT
    mDOCUMENT: function()  {
        try {
            var _type = this.DOCUMENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:73:29: ( 'document' )
            // XQueryLexer.g:73:31: 'document'
            this.match("document"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DOCUMENT",

    // $ANTLR start DOCUMENT_NODE
    mDOCUMENT_NODE: function()  {
        try {
            var _type = this.DOCUMENT_NODE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:74:29: ( 'document-node' )
            // XQueryLexer.g:74:31: 'document-node'
            this.match("document-node"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DOCUMENT_NODE",

    // $ANTLR start ELEMENT
    mELEMENT: function()  {
        try {
            var _type = this.ELEMENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:75:29: ( 'element' )
            // XQueryLexer.g:75:31: 'element'
            this.match("element"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ELEMENT",

    // $ANTLR start ELSE
    mELSE: function()  {
        try {
            var _type = this.ELSE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:76:29: ( 'else' )
            // XQueryLexer.g:76:31: 'else'
            this.match("else"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ELSE",

    // $ANTLR start EMPTY
    mEMPTY: function()  {
        try {
            var _type = this.EMPTY;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:77:29: ( 'empty' )
            // XQueryLexer.g:77:31: 'empty'
            this.match("empty"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "EMPTY",

    // $ANTLR start EMPTY_SEQUENCE
    mEMPTY_SEQUENCE: function()  {
        try {
            var _type = this.EMPTY_SEQUENCE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:78:29: ( 'empty-sequence' )
            // XQueryLexer.g:78:31: 'empty-sequence'
            this.match("empty-sequence"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "EMPTY_SEQUENCE",

    // $ANTLR start ENCODING
    mENCODING: function()  {
        try {
            var _type = this.ENCODING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:79:29: ( 'encoding' )
            // XQueryLexer.g:79:31: 'encoding'
            this.match("encoding"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ENCODING",

    // $ANTLR start EQ
    mEQ: function()  {
        try {
            var _type = this.EQ;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:80:29: ( 'eq' )
            // XQueryLexer.g:80:31: 'eq'
            this.match("eq"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "EQ",

    // $ANTLR start EVERY
    mEVERY: function()  {
        try {
            var _type = this.EVERY;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:81:29: ( 'every' )
            // XQueryLexer.g:81:31: 'every'
            this.match("every"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "EVERY",

    // $ANTLR start EXCEPT
    mEXCEPT: function()  {
        try {
            var _type = this.EXCEPT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:82:29: ( 'except' )
            // XQueryLexer.g:82:31: 'except'
            this.match("except"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "EXCEPT",

    // $ANTLR start EXTERNAL
    mEXTERNAL: function()  {
        try {
            var _type = this.EXTERNAL;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:83:29: ( 'external' )
            // XQueryLexer.g:83:31: 'external'
            this.match("external"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "EXTERNAL",

    // $ANTLR start FOLLOWING
    mFOLLOWING: function()  {
        try {
            var _type = this.FOLLOWING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:84:29: ( 'following' )
            // XQueryLexer.g:84:31: 'following'
            this.match("following"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "FOLLOWING",

    // $ANTLR start FOLLOWING_SIBLING
    mFOLLOWING_SIBLING: function()  {
        try {
            var _type = this.FOLLOWING_SIBLING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:85:29: ( 'following-sibling' )
            // XQueryLexer.g:85:31: 'following-sibling'
            this.match("following-sibling"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "FOLLOWING_SIBLING",

    // $ANTLR start FOR
    mFOR: function()  {
        try {
            var _type = this.FOR;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:86:29: ( 'for' )
            // XQueryLexer.g:86:31: 'for'
            this.match("for"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "FOR",

    // $ANTLR start FUNCTION
    mFUNCTION: function()  {
        try {
            var _type = this.FUNCTION;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:87:29: ( 'function' )
            // XQueryLexer.g:87:31: 'function'
            this.match("function"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "FUNCTION",

    // $ANTLR start GE
    mGE: function()  {
        try {
            var _type = this.GE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:88:29: ( 'ge' )
            // XQueryLexer.g:88:31: 'ge'
            this.match("ge"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "GE",

    // $ANTLR start GREATEST
    mGREATEST: function()  {
        try {
            var _type = this.GREATEST;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:89:29: ( 'greatest' )
            // XQueryLexer.g:89:31: 'greatest'
            this.match("greatest"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "GREATEST",

    // $ANTLR start GT
    mGT: function()  {
        try {
            var _type = this.GT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:90:29: ( 'gt' )
            // XQueryLexer.g:90:31: 'gt'
            this.match("gt"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "GT",

    // $ANTLR start IDIV
    mIDIV: function()  {
        try {
            var _type = this.IDIV;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:91:29: ( 'idiv' )
            // XQueryLexer.g:91:31: 'idiv'
            this.match("idiv"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "IDIV",

    // $ANTLR start IF
    mIF: function()  {
        try {
            var _type = this.IF;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:92:29: ( 'if' )
            // XQueryLexer.g:92:31: 'if'
            this.match("if"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "IF",

    // $ANTLR start IMPORT
    mIMPORT: function()  {
        try {
            var _type = this.IMPORT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:93:29: ( 'import' )
            // XQueryLexer.g:93:31: 'import'
            this.match("import"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "IMPORT",

    // $ANTLR start IN
    mIN: function()  {
        try {
            var _type = this.IN;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:94:29: ( 'in' )
            // XQueryLexer.g:94:31: 'in'
            this.match("in"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "IN",

    // $ANTLR start INHERIT
    mINHERIT: function()  {
        try {
            var _type = this.INHERIT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:95:29: ( 'inherit' )
            // XQueryLexer.g:95:31: 'inherit'
            this.match("inherit"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "INHERIT",

    // $ANTLR start INSTANCE
    mINSTANCE: function()  {
        try {
            var _type = this.INSTANCE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:96:29: ( 'instance' )
            // XQueryLexer.g:96:31: 'instance'
            this.match("instance"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "INSTANCE",

    // $ANTLR start INTERSECT
    mINTERSECT: function()  {
        try {
            var _type = this.INTERSECT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:97:29: ( 'intersect' )
            // XQueryLexer.g:97:31: 'intersect'
            this.match("intersect"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "INTERSECT",

    // $ANTLR start IS
    mIS: function()  {
        try {
            var _type = this.IS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:98:29: ( 'is' )
            // XQueryLexer.g:98:31: 'is'
            this.match("is"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "IS",

    // $ANTLR start ITEM
    mITEM: function()  {
        try {
            var _type = this.ITEM;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:99:29: ( 'item' )
            // XQueryLexer.g:99:31: 'item'
            this.match("item"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ITEM",

    // $ANTLR start LAX
    mLAX: function()  {
        try {
            var _type = this.LAX;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:100:29: ( 'lax' )
            // XQueryLexer.g:100:31: 'lax'
            this.match("lax"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LAX",

    // $ANTLR start LE
    mLE: function()  {
        try {
            var _type = this.LE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:101:29: ( 'le' )
            // XQueryLexer.g:101:31: 'le'
            this.match("le"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LE",

    // $ANTLR start LEAST
    mLEAST: function()  {
        try {
            var _type = this.LEAST;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:102:29: ( 'least' )
            // XQueryLexer.g:102:31: 'least'
            this.match("least"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LEAST",

    // $ANTLR start LET
    mLET: function()  {
        try {
            var _type = this.LET;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:103:29: ( 'let' )
            // XQueryLexer.g:103:31: 'let'
            this.match("let"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LET",

    // $ANTLR start LT
    mLT: function()  {
        try {
            var _type = this.LT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:104:29: ( 'lt' )
            // XQueryLexer.g:104:31: 'lt'
            this.match("lt"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LT",

    // $ANTLR start MOD
    mMOD: function()  {
        try {
            var _type = this.MOD;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:105:29: ( 'mod' )
            // XQueryLexer.g:105:31: 'mod'
            this.match("mod"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "MOD",

    // $ANTLR start MODULE
    mMODULE: function()  {
        try {
            var _type = this.MODULE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:106:29: ( 'module' )
            // XQueryLexer.g:106:31: 'module'
            this.match("module"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "MODULE",

    // $ANTLR start NAMESPACE
    mNAMESPACE: function()  {
        try {
            var _type = this.NAMESPACE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:107:29: ( 'namespace' )
            // XQueryLexer.g:107:31: 'namespace'
            this.match("namespace"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "NAMESPACE",

    // $ANTLR start NE
    mNE: function()  {
        try {
            var _type = this.NE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:108:29: ( 'ne' )
            // XQueryLexer.g:108:31: 'ne'
            this.match("ne"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "NE",

    // $ANTLR start NO_INHERIT
    mNO_INHERIT: function()  {
        try {
            var _type = this.NO_INHERIT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:109:29: ( 'no-inherit' )
            // XQueryLexer.g:109:31: 'no-inherit'
            this.match("no-inherit"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "NO_INHERIT",

    // $ANTLR start NO_PRESERVE
    mNO_PRESERVE: function()  {
        try {
            var _type = this.NO_PRESERVE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:110:29: ( 'no-preserve' )
            // XQueryLexer.g:110:31: 'no-preserve'
            this.match("no-preserve"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "NO_PRESERVE",

    // $ANTLR start NODE
    mNODE: function()  {
        try {
            var _type = this.NODE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:111:29: ( 'node' )
            // XQueryLexer.g:111:31: 'node'
            this.match("node"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "NODE",

    // $ANTLR start OF
    mOF: function()  {
        try {
            var _type = this.OF;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:112:29: ( 'of' )
            // XQueryLexer.g:112:31: 'of'
            this.match("of"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "OF",

    // $ANTLR start OPTION
    mOPTION: function()  {
        try {
            var _type = this.OPTION;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:113:29: ( 'option' )
            // XQueryLexer.g:113:31: 'option'
            this.match("option"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "OPTION",

    // $ANTLR start OR
    mOR: function()  {
        try {
            var _type = this.OR;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:114:29: ( 'or' )
            // XQueryLexer.g:114:31: 'or'
            this.match("or"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "OR",

    // $ANTLR start ORDER
    mORDER: function()  {
        try {
            var _type = this.ORDER;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:115:29: ( 'order' )
            // XQueryLexer.g:115:31: 'order'
            this.match("order"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ORDER",

    // $ANTLR start ORDERED
    mORDERED: function()  {
        try {
            var _type = this.ORDERED;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:116:29: ( 'ordered' )
            // XQueryLexer.g:116:31: 'ordered'
            this.match("ordered"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ORDERED",

    // $ANTLR start ORDERING
    mORDERING: function()  {
        try {
            var _type = this.ORDERING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:117:29: ( 'ordering' )
            // XQueryLexer.g:117:31: 'ordering'
            this.match("ordering"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ORDERING",

    // $ANTLR start PARENT
    mPARENT: function()  {
        try {
            var _type = this.PARENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:118:29: ( 'parent' )
            // XQueryLexer.g:118:31: 'parent'
            this.match("parent"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "PARENT",

    // $ANTLR start PRECEDING
    mPRECEDING: function()  {
        try {
            var _type = this.PRECEDING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:119:29: ( 'preceding' )
            // XQueryLexer.g:119:31: 'preceding'
            this.match("preceding"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "PRECEDING",

    // $ANTLR start PRECEDING_SIBLING
    mPRECEDING_SIBLING: function()  {
        try {
            var _type = this.PRECEDING_SIBLING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:120:29: ( 'preceding-sibling' )
            // XQueryLexer.g:120:31: 'preceding-sibling'
            this.match("preceding-sibling"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "PRECEDING_SIBLING",

    // $ANTLR start PRESERVE
    mPRESERVE: function()  {
        try {
            var _type = this.PRESERVE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:121:29: ( 'preserve' )
            // XQueryLexer.g:121:31: 'preserve'
            this.match("preserve"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "PRESERVE",

    // $ANTLR start PROCESSING_INSTRUCTION
    mPROCESSING_INSTRUCTION: function()  {
        try {
            var _type = this.PROCESSING_INSTRUCTION;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:122:29: ( 'processing-instruction' )
            // XQueryLexer.g:122:31: 'processing-instruction'
            this.match("processing-instruction"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "PROCESSING_INSTRUCTION",

    // $ANTLR start RETURN
    mRETURN: function()  {
        try {
            var _type = this.RETURN;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:123:29: ( 'return' )
            // XQueryLexer.g:123:31: 'return'
            this.match("return"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "RETURN",

    // $ANTLR start SATISFIES
    mSATISFIES: function()  {
        try {
            var _type = this.SATISFIES;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:124:29: ( 'satisfies' )
            // XQueryLexer.g:124:31: 'satisfies'
            this.match("satisfies"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SATISFIES",

    // $ANTLR start SCHEMA
    mSCHEMA: function()  {
        try {
            var _type = this.SCHEMA;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:125:29: ( 'schema' )
            // XQueryLexer.g:125:31: 'schema'
            this.match("schema"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SCHEMA",

    // $ANTLR start SCHEMA_ATTRIBUTE
    mSCHEMA_ATTRIBUTE: function()  {
        try {
            var _type = this.SCHEMA_ATTRIBUTE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:126:29: ( 'schema-attribute' )
            // XQueryLexer.g:126:31: 'schema-attribute'
            this.match("schema-attribute"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SCHEMA_ATTRIBUTE",

    // $ANTLR start SCHEMA_ELEMENT
    mSCHEMA_ELEMENT: function()  {
        try {
            var _type = this.SCHEMA_ELEMENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:127:29: ( 'schema-element' )
            // XQueryLexer.g:127:31: 'schema-element'
            this.match("schema-element"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SCHEMA_ELEMENT",

    // $ANTLR start SELF
    mSELF: function()  {
        try {
            var _type = this.SELF;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:128:29: ( 'self' )
            // XQueryLexer.g:128:31: 'self'
            this.match("self"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SELF",

    // $ANTLR start SOME
    mSOME: function()  {
        try {
            var _type = this.SOME;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:129:29: ( 'some' )
            // XQueryLexer.g:129:31: 'some'
            this.match("some"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SOME",

    // $ANTLR start STABLE
    mSTABLE: function()  {
        try {
            var _type = this.STABLE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:130:29: ( 'stable' )
            // XQueryLexer.g:130:31: 'stable'
            this.match("stable"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "STABLE",

    // $ANTLR start STRICT
    mSTRICT: function()  {
        try {
            var _type = this.STRICT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:131:29: ( 'strict' )
            // XQueryLexer.g:131:31: 'strict'
            this.match("strict"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "STRICT",

    // $ANTLR start STRIP
    mSTRIP: function()  {
        try {
            var _type = this.STRIP;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:132:29: ( 'strip' )
            // XQueryLexer.g:132:31: 'strip'
            this.match("strip"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "STRIP",

    // $ANTLR start TEXT
    mTEXT: function()  {
        try {
            var _type = this.TEXT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:133:29: ( 'text' )
            // XQueryLexer.g:133:31: 'text'
            this.match("text"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "TEXT",

    // $ANTLR start THEN
    mTHEN: function()  {
        try {
            var _type = this.THEN;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:134:29: ( 'then' )
            // XQueryLexer.g:134:31: 'then'
            this.match("then"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "THEN",

    // $ANTLR start TO
    mTO: function()  {
        try {
            var _type = this.TO;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:135:29: ( 'to' )
            // XQueryLexer.g:135:31: 'to'
            this.match("to"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "TO",

    // $ANTLR start TREAT
    mTREAT: function()  {
        try {
            var _type = this.TREAT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:136:29: ( 'treat' )
            // XQueryLexer.g:136:31: 'treat'
            this.match("treat"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "TREAT",

    // $ANTLR start TYPESWITCH
    mTYPESWITCH: function()  {
        try {
            var _type = this.TYPESWITCH;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:137:29: ( 'typeswitch' )
            // XQueryLexer.g:137:31: 'typeswitch'
            this.match("typeswitch"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "TYPESWITCH",

    // $ANTLR start UNION
    mUNION: function()  {
        try {
            var _type = this.UNION;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:138:29: ( 'union' )
            // XQueryLexer.g:138:31: 'union'
            this.match("union"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "UNION",

    // $ANTLR start UNORDERED
    mUNORDERED: function()  {
        try {
            var _type = this.UNORDERED;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:139:29: ( 'unordered' )
            // XQueryLexer.g:139:31: 'unordered'
            this.match("unordered"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "UNORDERED",

    // $ANTLR start VALIDATE
    mVALIDATE: function()  {
        try {
            var _type = this.VALIDATE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:140:29: ( 'validate' )
            // XQueryLexer.g:140:31: 'validate'
            this.match("validate"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "VALIDATE",

    // $ANTLR start VARIABLE
    mVARIABLE: function()  {
        try {
            var _type = this.VARIABLE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:141:29: ( 'variable' )
            // XQueryLexer.g:141:31: 'variable'
            this.match("variable"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "VARIABLE",

    // $ANTLR start VERSION
    mVERSION: function()  {
        try {
            var _type = this.VERSION;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:142:29: ( 'version' )
            // XQueryLexer.g:142:31: 'version'
            this.match("version"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "VERSION",

    // $ANTLR start WHERE
    mWHERE: function()  {
        try {
            var _type = this.WHERE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:143:29: ( 'where' )
            // XQueryLexer.g:143:31: 'where'
            this.match("where"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "WHERE",

    // $ANTLR start XQUERY
    mXQUERY: function()  {
        try {
            var _type = this.XQUERY;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:144:29: ( 'xquery' )
            // XQueryLexer.g:144:31: 'xquery'
            this.match("xquery"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "XQUERY",

    // $ANTLR start ALLOWING
    mALLOWING: function()  {
        try {
            var _type = this.ALLOWING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:146:29: ( 'allowing' )
            // XQueryLexer.g:146:31: 'allowing'
            this.match("allowing"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ALLOWING",

    // $ANTLR start CATCH
    mCATCH: function()  {
        try {
            var _type = this.CATCH;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:147:29: ( 'catch' )
            // XQueryLexer.g:147:31: 'catch'
            this.match("catch"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "CATCH",

    // $ANTLR start CONTEXT
    mCONTEXT: function()  {
        try {
            var _type = this.CONTEXT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:148:29: ( 'context' )
            // XQueryLexer.g:148:31: 'context'
            this.match("context"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "CONTEXT",

    // $ANTLR start COUNT
    mCOUNT: function()  {
        try {
            var _type = this.COUNT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:149:29: ( 'count' )
            // XQueryLexer.g:149:31: 'count'
            this.match("count"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "COUNT",

    // $ANTLR start DECIMAL_FORMAT
    mDECIMAL_FORMAT: function()  {
        try {
            var _type = this.DECIMAL_FORMAT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:150:29: ( 'decimal-format' )
            // XQueryLexer.g:150:31: 'decimal-format'
            this.match("decimal-format"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DECIMAL_FORMAT",

    // $ANTLR start DECIMAL_SEPARATOR
    mDECIMAL_SEPARATOR: function()  {
        try {
            var _type = this.DECIMAL_SEPARATOR;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:151:29: ( 'decimal-separator' )
            // XQueryLexer.g:151:31: 'decimal-separator'
            this.match("decimal-separator"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DECIMAL_SEPARATOR",

    // $ANTLR start DETERMINISTIC
    mDETERMINISTIC: function()  {
        try {
            var _type = this.DETERMINISTIC;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:152:29: ( 'deterministic' )
            // XQueryLexer.g:152:31: 'deterministic'
            this.match("deterministic"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DETERMINISTIC",

    // $ANTLR start DIGIT
    mDIGIT: function()  {
        try {
            var _type = this.DIGIT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:153:29: ( 'digit' )
            // XQueryLexer.g:153:31: 'digit'
            this.match("digit"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DIGIT",

    // $ANTLR start END
    mEND: function()  {
        try {
            var _type = this.END;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:154:29: ( 'end' )
            // XQueryLexer.g:154:31: 'end'
            this.match("end"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "END",

    // $ANTLR start GROUP
    mGROUP: function()  {
        try {
            var _type = this.GROUP;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:155:29: ( 'group' )
            // XQueryLexer.g:155:31: 'group'
            this.match("group"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "GROUP",

    // $ANTLR start GROUPING_SEPARATOR
    mGROUPING_SEPARATOR: function()  {
        try {
            var _type = this.GROUPING_SEPARATOR;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:156:29: ( 'grouping-separator' )
            // XQueryLexer.g:156:31: 'grouping-separator'
            this.match("grouping-separator"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "GROUPING_SEPARATOR",

    // $ANTLR start INFINITY
    mINFINITY: function()  {
        try {
            var _type = this.INFINITY;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:157:29: ( 'infinity' )
            // XQueryLexer.g:157:31: 'infinity'
            this.match("infinity"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "INFINITY",

    // $ANTLR start MINUS_SIGN
    mMINUS_SIGN: function()  {
        try {
            var _type = this.MINUS_SIGN;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:158:29: ( 'minus-sign' )
            // XQueryLexer.g:158:31: 'minus-sign'
            this.match("minus-sign"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "MINUS_SIGN",

    // $ANTLR start NAMESPACE_NODE
    mNAMESPACE_NODE: function()  {
        try {
            var _type = this.NAMESPACE_NODE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:159:29: ( 'namespace-node' )
            // XQueryLexer.g:159:31: 'namespace-node'
            this.match("namespace-node"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "NAMESPACE_NODE",

    // $ANTLR start NAN
    mNAN: function()  {
        try {
            var _type = this.NAN;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:160:29: ( 'NaN' )
            // XQueryLexer.g:160:31: 'NaN'
            this.match("NaN"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "NAN",

    // $ANTLR start NEXT
    mNEXT: function()  {
        try {
            var _type = this.NEXT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:161:29: ( 'next' )
            // XQueryLexer.g:161:31: 'next'
            this.match("next"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "NEXT",

    // $ANTLR start ONLY
    mONLY: function()  {
        try {
            var _type = this.ONLY;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:162:29: ( 'only' )
            // XQueryLexer.g:162:31: 'only'
            this.match("only"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ONLY",

    // $ANTLR start PATTERN_SEPARATOR
    mPATTERN_SEPARATOR: function()  {
        try {
            var _type = this.PATTERN_SEPARATOR;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:163:29: ( 'pattern-separator' )
            // XQueryLexer.g:163:31: 'pattern-separator'
            this.match("pattern-separator"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "PATTERN_SEPARATOR",

    // $ANTLR start PERCENT
    mPERCENT: function()  {
        try {
            var _type = this.PERCENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:164:29: ( 'percent' )
            // XQueryLexer.g:164:31: 'percent'
            this.match("percent"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "PERCENT",

    // $ANTLR start PER_MILLE
    mPER_MILLE: function()  {
        try {
            var _type = this.PER_MILLE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:165:29: ( 'per-mille' )
            // XQueryLexer.g:165:31: 'per-mille'
            this.match("per-mille"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "PER_MILLE",

    // $ANTLR start PREVIOUS
    mPREVIOUS: function()  {
        try {
            var _type = this.PREVIOUS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:166:29: ( 'previous' )
            // XQueryLexer.g:166:31: 'previous'
            this.match("previous"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "PREVIOUS",

    // $ANTLR start SLIDING
    mSLIDING: function()  {
        try {
            var _type = this.SLIDING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:167:29: ( 'sliding' )
            // XQueryLexer.g:167:31: 'sliding'
            this.match("sliding"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SLIDING",

    // $ANTLR start START
    mSTART: function()  {
        try {
            var _type = this.START;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:168:29: ( 'start' )
            // XQueryLexer.g:168:31: 'start'
            this.match("start"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "START",

    // $ANTLR start SWITCH
    mSWITCH: function()  {
        try {
            var _type = this.SWITCH;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:169:29: ( 'switch' )
            // XQueryLexer.g:169:31: 'switch'
            this.match("switch"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SWITCH",

    // $ANTLR start TRY
    mTRY: function()  {
        try {
            var _type = this.TRY;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:170:29: ( 'try' )
            // XQueryLexer.g:170:31: 'try'
            this.match("try"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "TRY",

    // $ANTLR start TUMBLING
    mTUMBLING: function()  {
        try {
            var _type = this.TUMBLING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:171:29: ( 'tumbling' )
            // XQueryLexer.g:171:31: 'tumbling'
            this.match("tumbling"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "TUMBLING",

    // $ANTLR start TYPE
    mTYPE: function()  {
        try {
            var _type = this.TYPE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:172:29: ( 'type' )
            // XQueryLexer.g:172:31: 'type'
            this.match("type"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "TYPE",

    // $ANTLR start WHEN
    mWHEN: function()  {
        try {
            var _type = this.WHEN;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:173:29: ( 'when' )
            // XQueryLexer.g:173:31: 'when'
            this.match("when"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "WHEN",

    // $ANTLR start WINDOW
    mWINDOW: function()  {
        try {
            var _type = this.WINDOW;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:174:29: ( 'window' )
            // XQueryLexer.g:174:31: 'window'
            this.match("window"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "WINDOW",

    // $ANTLR start ZERO_DIGIT
    mZERO_DIGIT: function()  {
        try {
            var _type = this.ZERO_DIGIT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:175:29: ( 'zero-digit' )
            // XQueryLexer.g:175:31: 'zero-digit'
            this.match("zero-digit"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ZERO_DIGIT",

    // $ANTLR start AFTER
    mAFTER: function()  {
        try {
            var _type = this.AFTER;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:177:29: ( 'after' )
            // XQueryLexer.g:177:31: 'after'
            this.match("after"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "AFTER",

    // $ANTLR start BEFORE
    mBEFORE: function()  {
        try {
            var _type = this.BEFORE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:178:29: ( 'before' )
            // XQueryLexer.g:178:31: 'before'
            this.match("before"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "BEFORE",

    // $ANTLR start COPY
    mCOPY: function()  {
        try {
            var _type = this.COPY;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:179:29: ( 'copy' )
            // XQueryLexer.g:179:31: 'copy'
            this.match("copy"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "COPY",

    // $ANTLR start DELETE
    mDELETE: function()  {
        try {
            var _type = this.DELETE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:180:29: ( 'delete' )
            // XQueryLexer.g:180:31: 'delete'
            this.match("delete"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DELETE",

    // $ANTLR start FIRST
    mFIRST: function()  {
        try {
            var _type = this.FIRST;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:181:29: ( 'first' )
            // XQueryLexer.g:181:31: 'first'
            this.match("first"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "FIRST",

    // $ANTLR start INSERT
    mINSERT: function()  {
        try {
            var _type = this.INSERT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:182:29: ( 'insert' )
            // XQueryLexer.g:182:31: 'insert'
            this.match("insert"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "INSERT",

    // $ANTLR start INTO
    mINTO: function()  {
        try {
            var _type = this.INTO;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:183:29: ( 'into' )
            // XQueryLexer.g:183:31: 'into'
            this.match("into"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "INTO",

    // $ANTLR start LAST
    mLAST: function()  {
        try {
            var _type = this.LAST;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:184:29: ( 'last' )
            // XQueryLexer.g:184:31: 'last'
            this.match("last"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LAST",

    // $ANTLR start MODIFY
    mMODIFY: function()  {
        try {
            var _type = this.MODIFY;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:185:29: ( 'modify' )
            // XQueryLexer.g:185:31: 'modify'
            this.match("modify"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "MODIFY",

    // $ANTLR start NODES
    mNODES: function()  {
        try {
            var _type = this.NODES;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:186:29: ( 'nodes' )
            // XQueryLexer.g:186:31: 'nodes'
            this.match("nodes"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "NODES",

    // $ANTLR start RENAME
    mRENAME: function()  {
        try {
            var _type = this.RENAME;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:187:29: ( 'rename' )
            // XQueryLexer.g:187:31: 'rename'
            this.match("rename"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "RENAME",

    // $ANTLR start REPLACE
    mREPLACE: function()  {
        try {
            var _type = this.REPLACE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:188:29: ( 'replace' )
            // XQueryLexer.g:188:31: 'replace'
            this.match("replace"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "REPLACE",

    // $ANTLR start REVALIDATION
    mREVALIDATION: function()  {
        try {
            var _type = this.REVALIDATION;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:189:29: ( 'revalidation' )
            // XQueryLexer.g:189:31: 'revalidation'
            this.match("revalidation"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "REVALIDATION",

    // $ANTLR start SKIP
    mSKIP: function()  {
        try {
            var _type = this.SKIP;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:190:29: ( 'skip' )
            // XQueryLexer.g:190:31: 'skip'
            this.match("skip"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SKIP",

    // $ANTLR start UPDATING
    mUPDATING: function()  {
        try {
            var _type = this.UPDATING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:191:29: ( 'updating' )
            // XQueryLexer.g:191:31: 'updating'
            this.match("updating"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "UPDATING",

    // $ANTLR start VALUE
    mVALUE: function()  {
        try {
            var _type = this.VALUE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:192:29: ( 'value' )
            // XQueryLexer.g:192:31: 'value'
            this.match("value"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "VALUE",

    // $ANTLR start WITH
    mWITH: function()  {
        try {
            var _type = this.WITH;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:193:29: ( 'with' )
            // XQueryLexer.g:193:31: 'with'
            this.match("with"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "WITH",

    // $ANTLR start ALL
    mALL: function()  {
        try {
            var _type = this.ALL;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:195:29: ( 'all' )
            // XQueryLexer.g:195:31: 'all'
            this.match("all"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ALL",

    // $ANTLR start ANY
    mANY: function()  {
        try {
            var _type = this.ANY;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:196:29: ( 'any' )
            // XQueryLexer.g:196:31: 'any'
            this.match("any"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ANY",

    // $ANTLR start CONTAINS
    mCONTAINS: function()  {
        try {
            var _type = this.CONTAINS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:197:29: ( 'contains' )
            // XQueryLexer.g:197:31: 'contains'
            this.match("contains"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "CONTAINS",

    // $ANTLR start CONTENT
    mCONTENT: function()  {
        try {
            var _type = this.CONTENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:198:29: ( 'content' )
            // XQueryLexer.g:198:31: 'content'
            this.match("content"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "CONTENT",

    // $ANTLR start DIACRITICS
    mDIACRITICS: function()  {
        try {
            var _type = this.DIACRITICS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:199:29: ( 'diacritics' )
            // XQueryLexer.g:199:31: 'diacritics'
            this.match("diacritics"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DIACRITICS",

    // $ANTLR start DIFFERENT
    mDIFFERENT: function()  {
        try {
            var _type = this.DIFFERENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:200:29: ( 'different' )
            // XQueryLexer.g:200:31: 'different'
            this.match("different"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DIFFERENT",

    // $ANTLR start DISTANCE
    mDISTANCE: function()  {
        try {
            var _type = this.DISTANCE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:201:29: ( 'distance' )
            // XQueryLexer.g:201:31: 'distance'
            this.match("distance"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DISTANCE",

    // $ANTLR start ENTIRE
    mENTIRE: function()  {
        try {
            var _type = this.ENTIRE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:202:29: ( 'entire' )
            // XQueryLexer.g:202:31: 'entire'
            this.match("entire"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ENTIRE",

    // $ANTLR start EXACTLY
    mEXACTLY: function()  {
        try {
            var _type = this.EXACTLY;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:203:29: ( 'exactly' )
            // XQueryLexer.g:203:31: 'exactly'
            this.match("exactly"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "EXACTLY",

    // $ANTLR start FROM
    mFROM: function()  {
        try {
            var _type = this.FROM;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:204:29: ( 'from' )
            // XQueryLexer.g:204:31: 'from'
            this.match("from"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "FROM",

    // $ANTLR start FT_OPTION
    mFT_OPTION: function()  {
        try {
            var _type = this.FT_OPTION;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:205:29: ( 'ft-option' )
            // XQueryLexer.g:205:31: 'ft-option'
            this.match("ft-option"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "FT_OPTION",

    // $ANTLR start FTAND
    mFTAND: function()  {
        try {
            var _type = this.FTAND;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:206:29: ( 'ftand' )
            // XQueryLexer.g:206:31: 'ftand'
            this.match("ftand"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "FTAND",

    // $ANTLR start FTNOT
    mFTNOT: function()  {
        try {
            var _type = this.FTNOT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:207:29: ( 'ftnot' )
            // XQueryLexer.g:207:31: 'ftnot'
            this.match("ftnot"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "FTNOT",

    // $ANTLR start FTOR
    mFTOR: function()  {
        try {
            var _type = this.FTOR;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:208:29: ( 'ftor' )
            // XQueryLexer.g:208:31: 'ftor'
            this.match("ftor"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "FTOR",

    // $ANTLR start INSENSITIVE
    mINSENSITIVE: function()  {
        try {
            var _type = this.INSENSITIVE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:209:29: ( 'insensitive' )
            // XQueryLexer.g:209:31: 'insensitive'
            this.match("insensitive"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "INSENSITIVE",

    // $ANTLR start LANGUAGE
    mLANGUAGE: function()  {
        try {
            var _type = this.LANGUAGE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:210:29: ( 'language' )
            // XQueryLexer.g:210:31: 'language'
            this.match("language"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LANGUAGE",

    // $ANTLR start LEVELS
    mLEVELS: function()  {
        try {
            var _type = this.LEVELS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:211:29: ( 'levels' )
            // XQueryLexer.g:211:31: 'levels'
            this.match("levels"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LEVELS",

    // $ANTLR start LOWERCASE
    mLOWERCASE: function()  {
        try {
            var _type = this.LOWERCASE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:212:29: ( 'lowercase' )
            // XQueryLexer.g:212:31: 'lowercase'
            this.match("lowercase"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LOWERCASE",

    // $ANTLR start MOST
    mMOST: function()  {
        try {
            var _type = this.MOST;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:213:29: ( 'most' )
            // XQueryLexer.g:213:31: 'most'
            this.match("most"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "MOST",

    // $ANTLR start NO
    mNO: function()  {
        try {
            var _type = this.NO;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:214:29: ( 'no' )
            // XQueryLexer.g:214:31: 'no'
            this.match("no"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "NO",

    // $ANTLR start NOT
    mNOT: function()  {
        try {
            var _type = this.NOT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:215:29: ( 'not' )
            // XQueryLexer.g:215:31: 'not'
            this.match("not"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "NOT",

    // $ANTLR start OCCURS
    mOCCURS: function()  {
        try {
            var _type = this.OCCURS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:216:29: ( 'occurs' )
            // XQueryLexer.g:216:31: 'occurs'
            this.match("occurs"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "OCCURS",

    // $ANTLR start PARAGRAPH
    mPARAGRAPH: function()  {
        try {
            var _type = this.PARAGRAPH;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:217:29: ( 'paragraph' )
            // XQueryLexer.g:217:31: 'paragraph'
            this.match("paragraph"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "PARAGRAPH",

    // $ANTLR start PARAGRAPHS
    mPARAGRAPHS: function()  {
        try {
            var _type = this.PARAGRAPHS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:218:29: ( 'paragraphs' )
            // XQueryLexer.g:218:31: 'paragraphs'
            this.match("paragraphs"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "PARAGRAPHS",

    // $ANTLR start PHRASE
    mPHRASE: function()  {
        try {
            var _type = this.PHRASE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:219:29: ( 'phrase' )
            // XQueryLexer.g:219:31: 'phrase'
            this.match("phrase"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "PHRASE",

    // $ANTLR start RELATIONSHIP
    mRELATIONSHIP: function()  {
        try {
            var _type = this.RELATIONSHIP;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:220:29: ( 'relationship' )
            // XQueryLexer.g:220:31: 'relationship'
            this.match("relationship"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "RELATIONSHIP",

    // $ANTLR start SAME
    mSAME: function()  {
        try {
            var _type = this.SAME;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:221:29: ( 'same' )
            // XQueryLexer.g:221:31: 'same'
            this.match("same"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SAME",

    // $ANTLR start SCORE
    mSCORE: function()  {
        try {
            var _type = this.SCORE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:222:29: ( 'score' )
            // XQueryLexer.g:222:31: 'score'
            this.match("score"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SCORE",

    // $ANTLR start SENSITIVE
    mSENSITIVE: function()  {
        try {
            var _type = this.SENSITIVE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:223:29: ( 'sensitive' )
            // XQueryLexer.g:223:31: 'sensitive'
            this.match("sensitive"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SENSITIVE",

    // $ANTLR start SENTENCE
    mSENTENCE: function()  {
        try {
            var _type = this.SENTENCE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:224:29: ( 'sentence' )
            // XQueryLexer.g:224:31: 'sentence'
            this.match("sentence"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SENTENCE",

    // $ANTLR start SENTENCES
    mSENTENCES: function()  {
        try {
            var _type = this.SENTENCES;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:225:29: ( 'sentences' )
            // XQueryLexer.g:225:31: 'sentences'
            this.match("sentences"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SENTENCES",

    // $ANTLR start STEMMING
    mSTEMMING: function()  {
        try {
            var _type = this.STEMMING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:226:29: ( 'stemming' )
            // XQueryLexer.g:226:31: 'stemming'
            this.match("stemming"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "STEMMING",

    // $ANTLR start STOP
    mSTOP: function()  {
        try {
            var _type = this.STOP;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:227:29: ( 'stop' )
            // XQueryLexer.g:227:31: 'stop'
            this.match("stop"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "STOP",

    // $ANTLR start THESAURUS
    mTHESAURUS: function()  {
        try {
            var _type = this.THESAURUS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:228:29: ( 'thesaurus' )
            // XQueryLexer.g:228:31: 'thesaurus'
            this.match("thesaurus"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "THESAURUS",

    // $ANTLR start TIMES
    mTIMES: function()  {
        try {
            var _type = this.TIMES;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:229:29: ( 'times' )
            // XQueryLexer.g:229:31: 'times'
            this.match("times"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "TIMES",

    // $ANTLR start UPPERCASE
    mUPPERCASE: function()  {
        try {
            var _type = this.UPPERCASE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:230:29: ( 'uppercase' )
            // XQueryLexer.g:230:31: 'uppercase'
            this.match("uppercase"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "UPPERCASE",

    // $ANTLR start USING
    mUSING: function()  {
        try {
            var _type = this.USING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:231:29: ( 'using' )
            // XQueryLexer.g:231:31: 'using'
            this.match("using"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "USING",

    // $ANTLR start WEIGHT
    mWEIGHT: function()  {
        try {
            var _type = this.WEIGHT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:232:29: ( 'weight' )
            // XQueryLexer.g:232:31: 'weight'
            this.match("weight"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "WEIGHT",

    // $ANTLR start WILDCARDS
    mWILDCARDS: function()  {
        try {
            var _type = this.WILDCARDS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:233:29: ( 'wildcards' )
            // XQueryLexer.g:233:31: 'wildcards'
            this.match("wildcards"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "WILDCARDS",

    // $ANTLR start WITHOUT
    mWITHOUT: function()  {
        try {
            var _type = this.WITHOUT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:234:29: ( 'without' )
            // XQueryLexer.g:234:31: 'without'
            this.match("without"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "WITHOUT",

    // $ANTLR start WORD
    mWORD: function()  {
        try {
            var _type = this.WORD;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:235:29: ( 'word' )
            // XQueryLexer.g:235:31: 'word'
            this.match("word"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "WORD",

    // $ANTLR start WORDS
    mWORDS: function()  {
        try {
            var _type = this.WORDS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:236:29: ( 'words' )
            // XQueryLexer.g:236:31: 'words'
            this.match("words"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "WORDS",

    // $ANTLR start BREAK
    mBREAK: function()  {
        try {
            var _type = this.BREAK;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:238:29: ( 'break' )
            // XQueryLexer.g:238:31: 'break'
            this.match("break"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "BREAK",

    // $ANTLR start CONTINUE
    mCONTINUE: function()  {
        try {
            var _type = this.CONTINUE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:239:29: ( 'continue' )
            // XQueryLexer.g:239:31: 'continue'
            this.match("continue"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "CONTINUE",

    // $ANTLR start EXIT
    mEXIT: function()  {
        try {
            var _type = this.EXIT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:240:29: ( 'exit' )
            // XQueryLexer.g:240:31: 'exit'
            this.match("exit"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "EXIT",

    // $ANTLR start LOOP
    mLOOP: function()  {
        try {
            var _type = this.LOOP;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:241:29: ( 'loop' )
            // XQueryLexer.g:241:31: 'loop'
            this.match("loop"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LOOP",

    // $ANTLR start RETURNING
    mRETURNING: function()  {
        try {
            var _type = this.RETURNING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:242:29: ( 'returning' )
            // XQueryLexer.g:242:31: 'returning'
            this.match("returning"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "RETURNING",

    // $ANTLR start WHILE
    mWHILE: function()  {
        try {
            var _type = this.WHILE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:243:29: ( 'while' )
            // XQueryLexer.g:243:31: 'while'
            this.match("while"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "WHILE",

    // $ANTLR start CHECK
    mCHECK: function()  {
        try {
            var _type = this.CHECK;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:245:29: ( 'check' )
            // XQueryLexer.g:245:31: 'check'
            this.match("check"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "CHECK",

    // $ANTLR start COLLECTION
    mCOLLECTION: function()  {
        try {
            var _type = this.COLLECTION;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:246:29: ( 'collection' )
            // XQueryLexer.g:246:31: 'collection'
            this.match("collection"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "COLLECTION",

    // $ANTLR start CONSTRAINT
    mCONSTRAINT: function()  {
        try {
            var _type = this.CONSTRAINT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:247:29: ( 'constraint' )
            // XQueryLexer.g:247:31: 'constraint'
            this.match("constraint"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "CONSTRAINT",

    // $ANTLR start FOREACH
    mFOREACH: function()  {
        try {
            var _type = this.FOREACH;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:248:29: ( 'foreach' )
            // XQueryLexer.g:248:31: 'foreach'
            this.match("foreach"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "FOREACH",

    // $ANTLR start FOREIGN
    mFOREIGN: function()  {
        try {
            var _type = this.FOREIGN;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:249:29: ( 'foreign' )
            // XQueryLexer.g:249:31: 'foreign'
            this.match("foreign"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "FOREIGN",

    // $ANTLR start INDEX
    mINDEX: function()  {
        try {
            var _type = this.INDEX;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:250:29: ( 'index' )
            // XQueryLexer.g:250:31: 'index'
            this.match("index"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "INDEX",

    // $ANTLR start INTEGRITY
    mINTEGRITY: function()  {
        try {
            var _type = this.INTEGRITY;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:251:29: ( 'integrity' )
            // XQueryLexer.g:251:31: 'integrity'
            this.match("integrity"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "INTEGRITY",

    // $ANTLR start KEY
    mKEY: function()  {
        try {
            var _type = this.KEY;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:252:29: ( 'key' )
            // XQueryLexer.g:252:31: 'key'
            this.match("key"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "KEY",

    // $ANTLR start ON
    mON: function()  {
        try {
            var _type = this.ON;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:253:29: ( 'on' )
            // XQueryLexer.g:253:31: 'on'
            this.match("on"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ON",

    // $ANTLR start UNIQUE
    mUNIQUE: function()  {
        try {
            var _type = this.UNIQUE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:254:29: ( 'unique' )
            // XQueryLexer.g:254:31: 'unique'
            this.match("unique"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "UNIQUE",

    // $ANTLR start BINARY
    mBINARY: function()  {
        try {
            var _type = this.BINARY;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:256:29: ( 'binary' )
            // XQueryLexer.g:256:31: 'binary'
            this.match("binary"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "BINARY",

    // $ANTLR start AMP_ER
    mAMP_ER: function()  {
        try {
            var _type = this.AMP_ER;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:259:9: ( 'amp' )
            // XQueryLexer.g:259:11: 'amp'
            this.match("amp"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "AMP_ER",

    // $ANTLR start APOS_ER
    mAPOS_ER: function()  {
        try {
            var _type = this.APOS_ER;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:260:9: ( 'apos' )
            // XQueryLexer.g:260:11: 'apos'
            this.match("apos"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "APOS_ER",

    // $ANTLR start QUOT_ER
    mQUOT_ER: function()  {
        try {
            var _type = this.QUOT_ER;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:261:9: ( 'quot' )
            // XQueryLexer.g:261:11: 'quot'
            this.match("quot"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "QUOT_ER",

    // $ANTLR start LPAREN
    mLPAREN: function()  {
        try {
            var _type = this.LPAREN;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:268:25: ( '(' )
            // XQueryLexer.g:268:27: '('
            this.match('('); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LPAREN",

    // $ANTLR start RPAREN
    mRPAREN: function()  {
        try {
            var _type = this.RPAREN;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:269:25: ( ')' )
            // XQueryLexer.g:269:27: ')'
            this.match(')'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "RPAREN",

    // $ANTLR start DOLLAR
    mDOLLAR: function()  {
        try {
            var _type = this.DOLLAR;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:270:25: ( '$' )
            // XQueryLexer.g:270:27: '$'
            this.match('$'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DOLLAR",

    // $ANTLR start LBRACKET
    mLBRACKET: function()  {
        try {
            var _type = this.LBRACKET;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:271:25: ( '{' )
            // XQueryLexer.g:271:27: '{'
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
            // XQueryLexer.g:272:25: ( '}' )
            // XQueryLexer.g:272:27: '}'
            this.match('}'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "RBRACKET",

    // $ANTLR start LSQUARE
    mLSQUARE: function()  {
        try {
            var _type = this.LSQUARE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:273:25: ( '[' )
            // XQueryLexer.g:273:27: '['
            this.match('['); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LSQUARE",

    // $ANTLR start RSQUARE
    mRSQUARE: function()  {
        try {
            var _type = this.RSQUARE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:274:25: ( ']' )
            // XQueryLexer.g:274:27: ']'
            this.match(']'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "RSQUARE",

    // $ANTLR start EQUAL
    mEQUAL: function()  {
        try {
            var _type = this.EQUAL;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:275:25: ( '=' )
            // XQueryLexer.g:275:27: '='
            this.match('='); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "EQUAL",

    // $ANTLR start BIND
    mBIND: function()  {
        try {
            var _type = this.BIND;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:276:25: ( ':=' )
            // XQueryLexer.g:276:27: ':='
            this.match(":="); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "BIND",

    // $ANTLR start NOTEQUAL
    mNOTEQUAL: function()  {
        try {
            var _type = this.NOTEQUAL;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:277:25: ( '!=' )
            // XQueryLexer.g:277:27: '!='
            this.match("!="); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "NOTEQUAL",

    // $ANTLR start ANN_PERCENT
    mANN_PERCENT: function()  {
        try {
            var _type = this.ANN_PERCENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:278:25: ( '%' )
            // XQueryLexer.g:278:27: '%'
            this.match('%'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ANN_PERCENT",

    // $ANTLR start HASH
    mHASH: function()  {
        try {
            var _type = this.HASH;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:279:25: ( '#' )
            // XQueryLexer.g:279:27: '#'
            this.match('#'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "HASH",

    // $ANTLR start AMP
    mAMP: function()  {
        try {
            var _type = this.AMP;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:280:25: ( '&' )
            // XQueryLexer.g:280:27: '&'
            this.match('&'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "AMP",

    // $ANTLR start COMMA
    mCOMMA: function()  {
        try {
            var _type = this.COMMA;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:281:25: ( ',' )
            // XQueryLexer.g:281:27: ','
            this.match(','); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "COMMA",

    // $ANTLR start QUESTION
    mQUESTION: function()  {
        try {
            var _type = this.QUESTION;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:282:25: ( '?' )
            // XQueryLexer.g:282:27: '?'
            this.match('?'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "QUESTION",

    // $ANTLR start STAR
    mSTAR: function()  {
        try {
            var _type = this.STAR;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:283:25: ( '*' )
            // XQueryLexer.g:283:27: '*'
            this.match('*'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "STAR",

    // $ANTLR start PLUS
    mPLUS: function()  {
        try {
            var _type = this.PLUS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:284:25: ( '+' )
            // XQueryLexer.g:284:27: '+'
            this.match('+'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "PLUS",

    // $ANTLR start MINUS
    mMINUS: function()  {
        try {
            var _type = this.MINUS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:285:25: ( '-' )
            // XQueryLexer.g:285:27: '-'
            this.match('-'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "MINUS",

    // $ANTLR start SMALLER
    mSMALLER: function()  {
        try {
            var _type = this.SMALLER;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:286:25: ( '<' )
            // XQueryLexer.g:286:27: '<'
            this.match('<'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SMALLER",

    // $ANTLR start GREATER
    mGREATER: function()  {
        try {
            var _type = this.GREATER;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:287:25: ( '>' )
            // XQueryLexer.g:287:27: '>'
            this.match('>'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "GREATER",

    // $ANTLR start SMALLEREQ
    mSMALLEREQ: function()  {
        try {
            var _type = this.SMALLEREQ;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:288:25: ( '<=' )
            // XQueryLexer.g:288:27: '<='
            this.match("<="); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SMALLEREQ",

    // $ANTLR start GREATEREQ
    mGREATEREQ: function()  {
        try {
            var _type = this.GREATEREQ;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:289:25: ( '>=' )
            // XQueryLexer.g:289:27: '>='
            this.match(">="); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "GREATEREQ",

    // $ANTLR start SMALLER_SMALLER
    mSMALLER_SMALLER: function()  {
        try {
            var _type = this.SMALLER_SMALLER;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:290:25: ( '<<' )
            // XQueryLexer.g:290:27: '<<'
            this.match("<<"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SMALLER_SMALLER",

    // $ANTLR start GREATER_GREATER
    mGREATER_GREATER: function()  {
        try {
            var _type = this.GREATER_GREATER;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:291:25: ( '>>' )
            // XQueryLexer.g:291:27: '>>'
            this.match(">>"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "GREATER_GREATER",

    // $ANTLR start SLASH
    mSLASH: function()  {
        try {
            var _type = this.SLASH;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:292:25: ( '/' )
            // XQueryLexer.g:292:27: '/'
            this.match('/'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SLASH",

    // $ANTLR start SLASH_SLASH
    mSLASH_SLASH: function()  {
        try {
            var _type = this.SLASH_SLASH;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:293:25: ( '//' )
            // XQueryLexer.g:293:27: '//'
            this.match("//"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SLASH_SLASH",

    // $ANTLR start DOT
    mDOT: function()  {
        try {
            var _type = this.DOT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:294:25: ( '.' )
            // XQueryLexer.g:294:27: '.'
            this.match('.'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DOT",

    // $ANTLR start DOT_DOT
    mDOT_DOT: function()  {
        try {
            var _type = this.DOT_DOT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:295:25: ( '..' )
            // XQueryLexer.g:295:27: '..'
            this.match(".."); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DOT_DOT",

    // $ANTLR start COLON
    mCOLON: function()  {
        try {
            var _type = this.COLON;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:296:25: ( ':' )
            // XQueryLexer.g:296:27: ':'
            this.match(':'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "COLON",

    // $ANTLR start COLON_COLON
    mCOLON_COLON: function()  {
        try {
            var _type = this.COLON_COLON;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:297:25: ( '::' )
            // XQueryLexer.g:297:27: '::'
            this.match("::"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "COLON_COLON",

    // $ANTLR start EMPTY_CLOSE_TAG
    mEMPTY_CLOSE_TAG: function()  {
        try {
            var _type = this.EMPTY_CLOSE_TAG;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:298:25: ( '/>' )
            // XQueryLexer.g:298:27: '/>'
            this.match("/>"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "EMPTY_CLOSE_TAG",

    // $ANTLR start CLOSE_TAG
    mCLOSE_TAG: function()  {
        try {
            var _type = this.CLOSE_TAG;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:299:25: ( '</' )
            // XQueryLexer.g:299:27: '</'
            this.match("</"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "CLOSE_TAG",

    // $ANTLR start SEMICOLON
    mSEMICOLON: function()  {
        try {
            var _type = this.SEMICOLON;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:300:25: ( ';' )
            // XQueryLexer.g:300:27: ';'
            this.match(';'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SEMICOLON",

    // $ANTLR start VBAR
    mVBAR: function()  {
        try {
            var _type = this.VBAR;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:301:25: ( '|' )
            // XQueryLexer.g:301:27: '|'
            this.match('|'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "VBAR",

    // $ANTLR start PRAGMA_START
    mPRAGMA_START: function()  {
        try {
            var _type = this.PRAGMA_START;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:302:25: ( '(#' )
            // XQueryLexer.g:302:27: '(#'
            this.match("(#"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "PRAGMA_START",

    // $ANTLR start PRAGMA_END
    mPRAGMA_END: function()  {
        try {
            var _type = this.PRAGMA_END;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:303:25: ( '#)' )
            // XQueryLexer.g:303:27: '#)'
            this.match("#)"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "PRAGMA_END",

    // $ANTLR start XML_COMMENT_START
    mXML_COMMENT_START: function()  {
        try {
            var _type = this.XML_COMMENT_START;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:304:25: ( '<!--' )
            // XQueryLexer.g:304:27: '<!--'
            this.match("<!--"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "XML_COMMENT_START",

    // $ANTLR start XML_COMMENT_END
    mXML_COMMENT_END: function()  {
        try {
            var _type = this.XML_COMMENT_END;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:305:25: ( '-->' )
            // XQueryLexer.g:305:27: '-->'
            this.match("-->"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "XML_COMMENT_END",

    // $ANTLR start PI_START
    mPI_START: function()  {
        try {
            var _type = this.PI_START;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:306:25: ( '<?' )
            // XQueryLexer.g:306:27: '<?'
            this.match("<?"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "PI_START",

    // $ANTLR start PI_END
    mPI_END: function()  {
        try {
            var _type = this.PI_END;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:307:25: ( '?>' )
            // XQueryLexer.g:307:27: '?>'
            this.match("?>"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "PI_END",

    // $ANTLR start ATTR_SIGN
    mATTR_SIGN: function()  {
        try {
            var _type = this.ATTR_SIGN;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:308:25: ( '@' )
            // XQueryLexer.g:308:27: '@'
            this.match('@'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ATTR_SIGN",

    // $ANTLR start CHARREF_DEC
    mCHARREF_DEC: function()  {
        try {
            var _type = this.CHARREF_DEC;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:309:25: ( '&#' )
            // XQueryLexer.g:309:27: '&#'
            this.match("&#"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "CHARREF_DEC",

    // $ANTLR start CHARREF_HEX
    mCHARREF_HEX: function()  {
        try {
            var _type = this.CHARREF_HEX;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:310:25: ( '&#x' )
            // XQueryLexer.g:310:27: '&#x'
            this.match("&#x"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "CHARREF_HEX",

    // $ANTLR start APOS
    mAPOS: function()  {
        try {
            var _type = this.APOS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:311:25: ( '\\'' )
            // XQueryLexer.g:311:27: '\\''
            this.match('\''); 
             if (!this.inStr) this.inStr = true; 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "APOS",

    // $ANTLR start QUOT
    mQUOT: function()  {
        try {
            var _type = this.QUOT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:312:25: ( '\"' )
            // XQueryLexer.g:312:27: '\"'
            this.match('\"'); 
             if (!this.inStr) this.inStr = true; 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "QUOT",

    // $ANTLR start L_NCName
    mL_NCName: function()  {
        try {
            var _type = this.L_NCName;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:316:9: ( NCNameStartChar ( NCNameChar )* )
            // XQueryLexer.g:316:13: NCNameStartChar ( NCNameChar )*
            this.mNCNameStartChar(); 
            // XQueryLexer.g:316:29: ( NCNameChar )*
            loop1:
            do {
                var alt1=2;
                var LA1_0 = this.input.LA(1);

                if ( ((LA1_0>='-' && LA1_0<='.')||(LA1_0>='0' && LA1_0<='9')||(LA1_0>='A' && LA1_0<='Z')||LA1_0=='_'||(LA1_0>='a' && LA1_0<='z')) ) {
                    alt1=1;
                }


                switch (alt1) {
                case 1 :
                    // XQueryLexer.g:316:29: NCNameChar
                    this.mNCNameChar(); 


                    break;

                default :
                    break loop1;
                }
            } while (true);




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "L_NCName",

    // $ANTLR start Letter
    mLetter: function()  {
        try {
            // XQueryLexer.g:319:29: ( 'a' .. 'z' | 'A' .. 'Z' )
            // XQueryLexer.g:
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

    // $ANTLR start HexLetter
    mHexLetter: function()  {
        try {
            // XQueryLexer.g:320:29: ( 'a' .. 'f' | 'A' .. 'F' )
            // XQueryLexer.g:
            if ( (this.input.LA(1)>='A' && this.input.LA(1)<='F')||(this.input.LA(1)>='a' && this.input.LA(1)<='f') ) {
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
    // $ANTLR end "HexLetter",

    // $ANTLR start Digit
    mDigit: function()  {
        try {
            // XQueryLexer.g:321:29: ( '0' .. '9' )
            // XQueryLexer.g:321:31: '0' .. '9'
            this.matchRange('0','9'); 



        }
        finally {
        }
    },
    // $ANTLR end "Digit",

    // $ANTLR start Digits
    mDigits: function()  {
        try {
            // XQueryLexer.g:322:29: ( ( Digit )+ )
            // XQueryLexer.g:322:31: ( Digit )+
            // XQueryLexer.g:322:31: ( Digit )+
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
                    // XQueryLexer.g:322:31: Digit
                    this.mDigit(); 


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




        }
        finally {
        }
    },
    // $ANTLR end "Digits",

    // $ANTLR start NCNameStartChar
    mNCNameStartChar: function()  {
        try {
            // XQueryLexer.g:324:29: ( Letter | '_' )
            // XQueryLexer.g:
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
            // XQueryLexer.g:325:29: ( Letter | Digit | '.' | '-' | '_' )
            // XQueryLexer.g:
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

    // $ANTLR start S
    mS: function()  {
        try {
            var _type = this.S;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:328:9: ( ( '\\t' | ' ' | '\\n' | '\\r' )+ )
            // XQueryLexer.g:328:11: ( '\\t' | ' ' | '\\n' | '\\r' )+
            // XQueryLexer.g:328:11: ( '\\t' | ' ' | '\\n' | '\\r' )+
            var cnt3=0;
            loop3:
            do {
                var alt3=2;
                var LA3_0 = this.input.LA(1);

                if ( ((LA3_0>='\t' && LA3_0<='\n')||LA3_0=='\r'||LA3_0==' ') ) {
                    alt3=1;
                }


                switch (alt3) {
                case 1 :
                    // XQueryLexer.g:
                    if ( (this.input.LA(1)>='\t' && this.input.LA(1)<='\n')||this.input.LA(1)=='\r'||this.input.LA(1)==' ' ) {
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

             _channel = HIDDEN; 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "S",

    // $ANTLR start SU
    mSU: function()  {
        try {
            // XQueryLexer.g:331:9: ( ( '\\t' | ' ' | '\\n' | '\\r' )+ )
            // XQueryLexer.g:331:11: ( '\\t' | ' ' | '\\n' | '\\r' )+
            // XQueryLexer.g:331:11: ( '\\t' | ' ' | '\\n' | '\\r' )+
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
                    // XQueryLexer.g:
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




        }
        finally {
        }
    },
    // $ANTLR end "SU",

    // $ANTLR start L_Pragma
    mL_Pragma: function()  {
        try {
            var _type = this.L_Pragma;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:342:9: ( PRAGMA_START ( SU )? L_NCName COLON L_NCName ( SU ( options {greedy=false; } : . )* )? PRAGMA_END )
            // XQueryLexer.g:342:11: PRAGMA_START ( SU )? L_NCName COLON L_NCName ( SU ( options {greedy=false; } : . )* )? PRAGMA_END
            this.mPRAGMA_START(); 
            // XQueryLexer.g:342:24: ( SU )?
            var alt5=2;
            var LA5_0 = this.input.LA(1);

            if ( ((LA5_0>='\t' && LA5_0<='\n')||LA5_0=='\r'||LA5_0==' ') ) {
                alt5=1;
            }
            switch (alt5) {
                case 1 :
                    // XQueryLexer.g:342:24: SU
                    this.mSU(); 


                    break;

            }

            this.mL_NCName(); 
            this.mCOLON(); 
            this.mL_NCName(); 
            // XQueryLexer.g:342:52: ( SU ( options {greedy=false; } : . )* )?
            var alt7=2;
            var LA7_0 = this.input.LA(1);

            if ( ((LA7_0>='\t' && LA7_0<='\n')||LA7_0=='\r'||LA7_0==' ') ) {
                alt7=1;
            }
            switch (alt7) {
                case 1 :
                    // XQueryLexer.g:342:53: SU ( options {greedy=false; } : . )*
                    this.mSU(); 
                    // XQueryLexer.g:342:56: ( options {greedy=false; } : . )*
                    loop6:
                    do {
                        var alt6=2;
                        var LA6_0 = this.input.LA(1);

                        if ( (LA6_0=='#') ) {
                            var LA6_1 = this.input.LA(2);

                            if ( (LA6_1==')') ) {
                                alt6=2;
                            }
                            else if ( ((LA6_1>='\u0000' && LA6_1<='(')||(LA6_1>='*' && LA6_1<='\uFFFF')) ) {
                                alt6=1;
                            }


                        }
                        else if ( ((LA6_0>='\u0000' && LA6_0<='\"')||(LA6_0>='$' && LA6_0<='\uFFFF')) ) {
                            alt6=1;
                        }


                        switch (alt6) {
                        case 1 :
                            // XQueryLexer.g:342:83: .
                            this.matchAny(); 


                            break;

                        default :
                            break loop6;
                        }
                    } while (true);



                    break;

            }

            this.mPRAGMA_END(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "L_Pragma",

    // $ANTLR start L_DirCommentConstructor
    mL_DirCommentConstructor: function()  {
        try {
            var _type = this.L_DirCommentConstructor;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:352:9: ( XML_COMMENT_START ( options {greedy=false; } : ( . )* ) XML_COMMENT_END )
            // XQueryLexer.g:352:11: XML_COMMENT_START ( options {greedy=false; } : ( . )* ) XML_COMMENT_END
            this.mXML_COMMENT_START(); 
            // XQueryLexer.g:352:29: ( options {greedy=false; } : ( . )* )
            // XQueryLexer.g:352:56: ( . )*
            // XQueryLexer.g:352:56: ( . )*
            loop8:
            do {
                var alt8=2;
                var LA8_0 = this.input.LA(1);

                if ( (LA8_0=='-') ) {
                    var LA8_1 = this.input.LA(2);

                    if ( (LA8_1=='-') ) {
                        var LA8_3 = this.input.LA(3);

                        if ( (LA8_3=='>') ) {
                            alt8=2;
                        }
                        else if ( ((LA8_3>='\u0000' && LA8_3<='=')||(LA8_3>='?' && LA8_3<='\uFFFF')) ) {
                            alt8=1;
                        }


                    }
                    else if ( ((LA8_1>='\u0000' && LA8_1<=',')||(LA8_1>='.' && LA8_1<='\uFFFF')) ) {
                        alt8=1;
                    }


                }
                else if ( ((LA8_0>='\u0000' && LA8_0<=',')||(LA8_0>='.' && LA8_0<='\uFFFF')) ) {
                    alt8=1;
                }


                switch (alt8) {
                case 1 :
                    // XQueryLexer.g:352:56: .
                    this.matchAny(); 


                    break;

                default :
                    break loop8;
                }
            } while (true);




            this.mXML_COMMENT_END(); 



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
            // XQueryLexer.g:361:9: ( PI_START ( SU )? L_NCName ( SU ( options {greedy=false; } : ( . )* ) )? PI_END )
            // XQueryLexer.g:361:11: PI_START ( SU )? L_NCName ( SU ( options {greedy=false; } : ( . )* ) )? PI_END
            this.mPI_START(); 
            // XQueryLexer.g:361:20: ( SU )?
            var alt9=2;
            var LA9_0 = this.input.LA(1);

            if ( ((LA9_0>='\t' && LA9_0<='\n')||LA9_0=='\r'||LA9_0==' ') ) {
                alt9=1;
            }
            switch (alt9) {
                case 1 :
                    // XQueryLexer.g:361:20: SU
                    this.mSU(); 


                    break;

            }

            this.mL_NCName(); 
            // XQueryLexer.g:361:33: ( SU ( options {greedy=false; } : ( . )* ) )?
            var alt11=2;
            var LA11_0 = this.input.LA(1);

            if ( ((LA11_0>='\t' && LA11_0<='\n')||LA11_0=='\r'||LA11_0==' ') ) {
                alt11=1;
            }
            switch (alt11) {
                case 1 :
                    // XQueryLexer.g:361:34: SU ( options {greedy=false; } : ( . )* )
                    this.mSU(); 
                    // XQueryLexer.g:361:36: ( options {greedy=false; } : ( . )* )
                    // XQueryLexer.g:361:63: ( . )*
                    // XQueryLexer.g:361:63: ( . )*
                    loop10:
                    do {
                        var alt10=2;
                        var LA10_0 = this.input.LA(1);

                        if ( (LA10_0=='?') ) {
                            var LA10_1 = this.input.LA(2);

                            if ( (LA10_1=='>') ) {
                                alt10=2;
                            }
                            else if ( ((LA10_1>='\u0000' && LA10_1<='=')||(LA10_1>='?' && LA10_1<='\uFFFF')) ) {
                                alt10=1;
                            }


                        }
                        else if ( ((LA10_0>='\u0000' && LA10_0<='>')||(LA10_0>='@' && LA10_0<='\uFFFF')) ) {
                            alt10=1;
                        }


                        switch (alt10) {
                        case 1 :
                            // XQueryLexer.g:361:63: .
                            this.matchAny(); 


                            break;

                        default :
                            break loop10;
                        }
                    } while (true);






                    break;

            }

            this.mPI_END(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "L_DirPIConstructor",

    // $ANTLR start L_IntegerLiteral
    mL_IntegerLiteral: function()  {
        try {
            var _type = this.L_IntegerLiteral;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:369:9: ( Digits )
            // XQueryLexer.g:369:13: Digits
            this.mDigits(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "L_IntegerLiteral",

    // $ANTLR start L_DecimalLiteral
    mL_DecimalLiteral: function()  {
        try {
            var _type = this.L_DecimalLiteral;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:374:9: ( ( '.' Digits ) | ( Digits '.' ( Digit )* ) )
            var alt13=2;
            var LA13_0 = this.input.LA(1);

            if ( (LA13_0=='.') ) {
                alt13=1;
            }
            else if ( ((LA13_0>='0' && LA13_0<='9')) ) {
                alt13=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 13, 0, this.input);

                throw nvae;
            }
            switch (alt13) {
                case 1 :
                    // XQueryLexer.g:374:11: ( '.' Digits )
                    // XQueryLexer.g:374:11: ( '.' Digits )
                    // XQueryLexer.g:374:12: '.' Digits
                    this.match('.'); 
                    this.mDigits(); 





                    break;
                case 2 :
                    // XQueryLexer.g:374:26: ( Digits '.' ( Digit )* )
                    // XQueryLexer.g:374:26: ( Digits '.' ( Digit )* )
                    // XQueryLexer.g:374:27: Digits '.' ( Digit )*
                    this.mDigits(); 
                    this.match('.'); 
                    // XQueryLexer.g:374:38: ( Digit )*
                    loop12:
                    do {
                        var alt12=2;
                        var LA12_0 = this.input.LA(1);

                        if ( ((LA12_0>='0' && LA12_0<='9')) ) {
                            alt12=1;
                        }


                        switch (alt12) {
                        case 1 :
                            // XQueryLexer.g:374:38: Digit
                            this.mDigit(); 


                            break;

                        default :
                            break loop12;
                        }
                    } while (true);






                    break;

            }
            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "L_DecimalLiteral",

    // $ANTLR start L_DoubleLiteral
    mL_DoubleLiteral: function()  {
        try {
            var _type = this.L_DoubleLiteral;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:379:9: ( ( ( '.' Digits ) | ( Digits ( '.' ( Digit )* )? ) ) ( 'e' | 'E' ) ( '+' | '-' )? Digits )
            // XQueryLexer.g:379:11: ( ( '.' Digits ) | ( Digits ( '.' ( Digit )* )? ) ) ( 'e' | 'E' ) ( '+' | '-' )? Digits
            // XQueryLexer.g:379:11: ( ( '.' Digits ) | ( Digits ( '.' ( Digit )* )? ) )
            var alt16=2;
            var LA16_0 = this.input.LA(1);

            if ( (LA16_0=='.') ) {
                alt16=1;
            }
            else if ( ((LA16_0>='0' && LA16_0<='9')) ) {
                alt16=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 16, 0, this.input);

                throw nvae;
            }
            switch (alt16) {
                case 1 :
                    // XQueryLexer.g:379:12: ( '.' Digits )
                    // XQueryLexer.g:379:12: ( '.' Digits )
                    // XQueryLexer.g:379:13: '.' Digits
                    this.match('.'); 
                    this.mDigits(); 





                    break;
                case 2 :
                    // XQueryLexer.g:379:27: ( Digits ( '.' ( Digit )* )? )
                    // XQueryLexer.g:379:27: ( Digits ( '.' ( Digit )* )? )
                    // XQueryLexer.g:379:28: Digits ( '.' ( Digit )* )?
                    this.mDigits(); 
                    // XQueryLexer.g:379:35: ( '.' ( Digit )* )?
                    var alt15=2;
                    var LA15_0 = this.input.LA(1);

                    if ( (LA15_0=='.') ) {
                        alt15=1;
                    }
                    switch (alt15) {
                        case 1 :
                            // XQueryLexer.g:379:36: '.' ( Digit )*
                            this.match('.'); 
                            // XQueryLexer.g:379:40: ( Digit )*
                            loop14:
                            do {
                                var alt14=2;
                                var LA14_0 = this.input.LA(1);

                                if ( ((LA14_0>='0' && LA14_0<='9')) ) {
                                    alt14=1;
                                }


                                switch (alt14) {
                                case 1 :
                                    // XQueryLexer.g:379:40: Digit
                                    this.mDigit(); 


                                    break;

                                default :
                                    break loop14;
                                }
                            } while (true);



                            break;

                    }






                    break;

            }

            if ( this.input.LA(1)=='E'||this.input.LA(1)=='e' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}

            // XQueryLexer.g:379:63: ( '+' | '-' )?
            var alt17=2;
            var LA17_0 = this.input.LA(1);

            if ( (LA17_0=='+'||LA17_0=='-') ) {
                alt17=1;
            }
            switch (alt17) {
                case 1 :
                    // XQueryLexer.g:
                    if ( this.input.LA(1)=='+'||this.input.LA(1)=='-' ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;

            }

            this.mDigits(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "L_DoubleLiteral",

    // $ANTLR start L_Comment
    mL_Comment: function()  {
        try {
            var _type = this.L_Comment;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:384:9: ({...}? => '(:' ( options {greedy=false; } : L_Comment | . )* ':)' )
            // XQueryLexer.g:384:11: {...}? => '(:' ( options {greedy=false; } : L_Comment | . )* ':)'
            if ( !((!this.inStr)) ) {
                throw new org.antlr.runtime.FailedPredicateException(this.input, "L_Comment", "!this.inStr");
            }
            this.match("(:"); 

            // XQueryLexer.g:384:33: ( options {greedy=false; } : L_Comment | . )*
            loop18:
            do {
                var alt18=3;
                var LA18_0 = this.input.LA(1);

                if ( (LA18_0==':') ) {
                    var LA18_1 = this.input.LA(2);

                    if ( (LA18_1==')') ) {
                        alt18=3;
                    }
                    else if ( ((LA18_1>='\u0000' && LA18_1<='(')||(LA18_1>='*' && LA18_1<='\uFFFF')) ) {
                        alt18=2;
                    }


                }
                else if ( (LA18_0=='(') ) {
                    var LA18_2 = this.input.LA(2);

                    if ( (LA18_2==':') ) {
                        var LA18_5 = this.input.LA(3);

                        if ( ((!this.inStr)) ) {
                            alt18=1;
                        }
                        else if ( (true) ) {
                            alt18=2;
                        }


                    }
                    else if ( ((LA18_2>='\u0000' && LA18_2<='9')||(LA18_2>=';' && LA18_2<='\uFFFF')) ) {
                        alt18=2;
                    }


                }
                else if ( ((LA18_0>='\u0000' && LA18_0<='\'')||(LA18_0>=')' && LA18_0<='9')||(LA18_0>=';' && LA18_0<='\uFFFF')) ) {
                    alt18=2;
                }


                switch (alt18) {
                case 1 :
                    // XQueryLexer.g:384:59: L_Comment
                    this.mL_Comment(); 


                    break;
                case 2 :
                    // XQueryLexer.g:384:71: .
                    this.matchAny(); 


                    break;

                default :
                    break loop18;
                }
            } while (true);

            this.match(":)"); 

             _channel = HIDDEN; 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "L_Comment",

    // $ANTLR start L_AnyChar
    mL_AnyChar: function()  {
        try {
            var _type = this.L_AnyChar;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // XQueryLexer.g:387:11: ( . )
            // XQueryLexer.g:387:13: .
            this.matchAny(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "L_AnyChar",

    mTokens: function() {
        // XQueryLexer.g:1:8: ( ANCESTOR | ANCESTOR_OR_SELF | AND | AS | ASCENDING | AT | ATTRIBUTE | BASE_URI | BOUNDARY_SPACE | BY | CASE | CAST | CASTABLE | CHILD | COLLATION | COMMENT | CONSTRUCTION | COPY_NAMESPACES | DECLARE | DEFAULT | DESCENDANT | DESCENDANT_OR_SELF | DESCENDING | DIV | DOCUMENT | DOCUMENT_NODE | ELEMENT | ELSE | EMPTY | EMPTY_SEQUENCE | ENCODING | EQ | EVERY | EXCEPT | EXTERNAL | FOLLOWING | FOLLOWING_SIBLING | FOR | FUNCTION | GE | GREATEST | GT | IDIV | IF | IMPORT | IN | INHERIT | INSTANCE | INTERSECT | IS | ITEM | LAX | LE | LEAST | LET | LT | MOD | MODULE | NAMESPACE | NE | NO_INHERIT | NO_PRESERVE | NODE | OF | OPTION | OR | ORDER | ORDERED | ORDERING | PARENT | PRECEDING | PRECEDING_SIBLING | PRESERVE | PROCESSING_INSTRUCTION | RETURN | SATISFIES | SCHEMA | SCHEMA_ATTRIBUTE | SCHEMA_ELEMENT | SELF | SOME | STABLE | STRICT | STRIP | TEXT | THEN | TO | TREAT | TYPESWITCH | UNION | UNORDERED | VALIDATE | VARIABLE | VERSION | WHERE | XQUERY | ALLOWING | CATCH | CONTEXT | COUNT | DECIMAL_FORMAT | DECIMAL_SEPARATOR | DETERMINISTIC | DIGIT | END | GROUP | GROUPING_SEPARATOR | INFINITY | MINUS_SIGN | NAMESPACE_NODE | NAN | NEXT | ONLY | PATTERN_SEPARATOR | PERCENT | PER_MILLE | PREVIOUS | SLIDING | START | SWITCH | TRY | TUMBLING | TYPE | WHEN | WINDOW | ZERO_DIGIT | AFTER | BEFORE | COPY | DELETE | FIRST | INSERT | INTO | LAST | MODIFY | NODES | RENAME | REPLACE | REVALIDATION | SKIP | UPDATING | VALUE | WITH | ALL | ANY | CONTAINS | CONTENT | DIACRITICS | DIFFERENT | DISTANCE | ENTIRE | EXACTLY | FROM | FT_OPTION | FTAND | FTNOT | FTOR | INSENSITIVE | LANGUAGE | LEVELS | LOWERCASE | MOST | NO | NOT | OCCURS | PARAGRAPH | PARAGRAPHS | PHRASE | RELATIONSHIP | SAME | SCORE | SENSITIVE | SENTENCE | SENTENCES | STEMMING | STOP | THESAURUS | TIMES | UPPERCASE | USING | WEIGHT | WILDCARDS | WITHOUT | WORD | WORDS | BREAK | CONTINUE | EXIT | LOOP | RETURNING | WHILE | CHECK | COLLECTION | CONSTRAINT | FOREACH | FOREIGN | INDEX | INTEGRITY | KEY | ON | UNIQUE | BINARY | AMP_ER | APOS_ER | QUOT_ER | LPAREN | RPAREN | DOLLAR | LBRACKET | RBRACKET | LSQUARE | RSQUARE | EQUAL | BIND | NOTEQUAL | ANN_PERCENT | HASH | AMP | COMMA | QUESTION | STAR | PLUS | MINUS | SMALLER | GREATER | SMALLEREQ | GREATEREQ | SMALLER_SMALLER | GREATER_GREATER | SLASH | SLASH_SLASH | DOT | DOT_DOT | COLON | COLON_COLON | EMPTY_CLOSE_TAG | CLOSE_TAG | SEMICOLON | VBAR | PRAGMA_START | PRAGMA_END | XML_COMMENT_START | XML_COMMENT_END | PI_START | PI_END | ATTR_SIGN | CHARREF_DEC | CHARREF_HEX | APOS | QUOT | L_NCName | S | L_Pragma | L_DirCommentConstructor | L_DirPIConstructor | L_IntegerLiteral | L_DecimalLiteral | L_DoubleLiteral | L_Comment | L_AnyChar )
        var alt19=260;
        alt19 = this.dfa19.predict(this.input);
        switch (alt19) {
            case 1 :
                // XQueryLexer.g:1:10: ANCESTOR
                this.mANCESTOR(); 


                break;
            case 2 :
                // XQueryLexer.g:1:19: ANCESTOR_OR_SELF
                this.mANCESTOR_OR_SELF(); 


                break;
            case 3 :
                // XQueryLexer.g:1:36: AND
                this.mAND(); 


                break;
            case 4 :
                // XQueryLexer.g:1:40: AS
                this.mAS(); 


                break;
            case 5 :
                // XQueryLexer.g:1:43: ASCENDING
                this.mASCENDING(); 


                break;
            case 6 :
                // XQueryLexer.g:1:53: AT
                this.mAT(); 


                break;
            case 7 :
                // XQueryLexer.g:1:56: ATTRIBUTE
                this.mATTRIBUTE(); 


                break;
            case 8 :
                // XQueryLexer.g:1:66: BASE_URI
                this.mBASE_URI(); 


                break;
            case 9 :
                // XQueryLexer.g:1:75: BOUNDARY_SPACE
                this.mBOUNDARY_SPACE(); 


                break;
            case 10 :
                // XQueryLexer.g:1:90: BY
                this.mBY(); 


                break;
            case 11 :
                // XQueryLexer.g:1:93: CASE
                this.mCASE(); 


                break;
            case 12 :
                // XQueryLexer.g:1:98: CAST
                this.mCAST(); 


                break;
            case 13 :
                // XQueryLexer.g:1:103: CASTABLE
                this.mCASTABLE(); 


                break;
            case 14 :
                // XQueryLexer.g:1:112: CHILD
                this.mCHILD(); 


                break;
            case 15 :
                // XQueryLexer.g:1:118: COLLATION
                this.mCOLLATION(); 


                break;
            case 16 :
                // XQueryLexer.g:1:128: COMMENT
                this.mCOMMENT(); 


                break;
            case 17 :
                // XQueryLexer.g:1:136: CONSTRUCTION
                this.mCONSTRUCTION(); 


                break;
            case 18 :
                // XQueryLexer.g:1:149: COPY_NAMESPACES
                this.mCOPY_NAMESPACES(); 


                break;
            case 19 :
                // XQueryLexer.g:1:165: DECLARE
                this.mDECLARE(); 


                break;
            case 20 :
                // XQueryLexer.g:1:173: DEFAULT
                this.mDEFAULT(); 


                break;
            case 21 :
                // XQueryLexer.g:1:181: DESCENDANT
                this.mDESCENDANT(); 


                break;
            case 22 :
                // XQueryLexer.g:1:192: DESCENDANT_OR_SELF
                this.mDESCENDANT_OR_SELF(); 


                break;
            case 23 :
                // XQueryLexer.g:1:211: DESCENDING
                this.mDESCENDING(); 


                break;
            case 24 :
                // XQueryLexer.g:1:222: DIV
                this.mDIV(); 


                break;
            case 25 :
                // XQueryLexer.g:1:226: DOCUMENT
                this.mDOCUMENT(); 


                break;
            case 26 :
                // XQueryLexer.g:1:235: DOCUMENT_NODE
                this.mDOCUMENT_NODE(); 


                break;
            case 27 :
                // XQueryLexer.g:1:249: ELEMENT
                this.mELEMENT(); 


                break;
            case 28 :
                // XQueryLexer.g:1:257: ELSE
                this.mELSE(); 


                break;
            case 29 :
                // XQueryLexer.g:1:262: EMPTY
                this.mEMPTY(); 


                break;
            case 30 :
                // XQueryLexer.g:1:268: EMPTY_SEQUENCE
                this.mEMPTY_SEQUENCE(); 


                break;
            case 31 :
                // XQueryLexer.g:1:283: ENCODING
                this.mENCODING(); 


                break;
            case 32 :
                // XQueryLexer.g:1:292: EQ
                this.mEQ(); 


                break;
            case 33 :
                // XQueryLexer.g:1:295: EVERY
                this.mEVERY(); 


                break;
            case 34 :
                // XQueryLexer.g:1:301: EXCEPT
                this.mEXCEPT(); 


                break;
            case 35 :
                // XQueryLexer.g:1:308: EXTERNAL
                this.mEXTERNAL(); 


                break;
            case 36 :
                // XQueryLexer.g:1:317: FOLLOWING
                this.mFOLLOWING(); 


                break;
            case 37 :
                // XQueryLexer.g:1:327: FOLLOWING_SIBLING
                this.mFOLLOWING_SIBLING(); 


                break;
            case 38 :
                // XQueryLexer.g:1:345: FOR
                this.mFOR(); 


                break;
            case 39 :
                // XQueryLexer.g:1:349: FUNCTION
                this.mFUNCTION(); 


                break;
            case 40 :
                // XQueryLexer.g:1:358: GE
                this.mGE(); 


                break;
            case 41 :
                // XQueryLexer.g:1:361: GREATEST
                this.mGREATEST(); 


                break;
            case 42 :
                // XQueryLexer.g:1:370: GT
                this.mGT(); 


                break;
            case 43 :
                // XQueryLexer.g:1:373: IDIV
                this.mIDIV(); 


                break;
            case 44 :
                // XQueryLexer.g:1:378: IF
                this.mIF(); 


                break;
            case 45 :
                // XQueryLexer.g:1:381: IMPORT
                this.mIMPORT(); 


                break;
            case 46 :
                // XQueryLexer.g:1:388: IN
                this.mIN(); 


                break;
            case 47 :
                // XQueryLexer.g:1:391: INHERIT
                this.mINHERIT(); 


                break;
            case 48 :
                // XQueryLexer.g:1:399: INSTANCE
                this.mINSTANCE(); 


                break;
            case 49 :
                // XQueryLexer.g:1:408: INTERSECT
                this.mINTERSECT(); 


                break;
            case 50 :
                // XQueryLexer.g:1:418: IS
                this.mIS(); 


                break;
            case 51 :
                // XQueryLexer.g:1:421: ITEM
                this.mITEM(); 


                break;
            case 52 :
                // XQueryLexer.g:1:426: LAX
                this.mLAX(); 


                break;
            case 53 :
                // XQueryLexer.g:1:430: LE
                this.mLE(); 


                break;
            case 54 :
                // XQueryLexer.g:1:433: LEAST
                this.mLEAST(); 


                break;
            case 55 :
                // XQueryLexer.g:1:439: LET
                this.mLET(); 


                break;
            case 56 :
                // XQueryLexer.g:1:443: LT
                this.mLT(); 


                break;
            case 57 :
                // XQueryLexer.g:1:446: MOD
                this.mMOD(); 


                break;
            case 58 :
                // XQueryLexer.g:1:450: MODULE
                this.mMODULE(); 


                break;
            case 59 :
                // XQueryLexer.g:1:457: NAMESPACE
                this.mNAMESPACE(); 


                break;
            case 60 :
                // XQueryLexer.g:1:467: NE
                this.mNE(); 


                break;
            case 61 :
                // XQueryLexer.g:1:470: NO_INHERIT
                this.mNO_INHERIT(); 


                break;
            case 62 :
                // XQueryLexer.g:1:481: NO_PRESERVE
                this.mNO_PRESERVE(); 


                break;
            case 63 :
                // XQueryLexer.g:1:493: NODE
                this.mNODE(); 


                break;
            case 64 :
                // XQueryLexer.g:1:498: OF
                this.mOF(); 


                break;
            case 65 :
                // XQueryLexer.g:1:501: OPTION
                this.mOPTION(); 


                break;
            case 66 :
                // XQueryLexer.g:1:508: OR
                this.mOR(); 


                break;
            case 67 :
                // XQueryLexer.g:1:511: ORDER
                this.mORDER(); 


                break;
            case 68 :
                // XQueryLexer.g:1:517: ORDERED
                this.mORDERED(); 


                break;
            case 69 :
                // XQueryLexer.g:1:525: ORDERING
                this.mORDERING(); 


                break;
            case 70 :
                // XQueryLexer.g:1:534: PARENT
                this.mPARENT(); 


                break;
            case 71 :
                // XQueryLexer.g:1:541: PRECEDING
                this.mPRECEDING(); 


                break;
            case 72 :
                // XQueryLexer.g:1:551: PRECEDING_SIBLING
                this.mPRECEDING_SIBLING(); 


                break;
            case 73 :
                // XQueryLexer.g:1:569: PRESERVE
                this.mPRESERVE(); 


                break;
            case 74 :
                // XQueryLexer.g:1:578: PROCESSING_INSTRUCTION
                this.mPROCESSING_INSTRUCTION(); 


                break;
            case 75 :
                // XQueryLexer.g:1:601: RETURN
                this.mRETURN(); 


                break;
            case 76 :
                // XQueryLexer.g:1:608: SATISFIES
                this.mSATISFIES(); 


                break;
            case 77 :
                // XQueryLexer.g:1:618: SCHEMA
                this.mSCHEMA(); 


                break;
            case 78 :
                // XQueryLexer.g:1:625: SCHEMA_ATTRIBUTE
                this.mSCHEMA_ATTRIBUTE(); 


                break;
            case 79 :
                // XQueryLexer.g:1:642: SCHEMA_ELEMENT
                this.mSCHEMA_ELEMENT(); 


                break;
            case 80 :
                // XQueryLexer.g:1:657: SELF
                this.mSELF(); 


                break;
            case 81 :
                // XQueryLexer.g:1:662: SOME
                this.mSOME(); 


                break;
            case 82 :
                // XQueryLexer.g:1:667: STABLE
                this.mSTABLE(); 


                break;
            case 83 :
                // XQueryLexer.g:1:674: STRICT
                this.mSTRICT(); 


                break;
            case 84 :
                // XQueryLexer.g:1:681: STRIP
                this.mSTRIP(); 


                break;
            case 85 :
                // XQueryLexer.g:1:687: TEXT
                this.mTEXT(); 


                break;
            case 86 :
                // XQueryLexer.g:1:692: THEN
                this.mTHEN(); 


                break;
            case 87 :
                // XQueryLexer.g:1:697: TO
                this.mTO(); 


                break;
            case 88 :
                // XQueryLexer.g:1:700: TREAT
                this.mTREAT(); 


                break;
            case 89 :
                // XQueryLexer.g:1:706: TYPESWITCH
                this.mTYPESWITCH(); 


                break;
            case 90 :
                // XQueryLexer.g:1:717: UNION
                this.mUNION(); 


                break;
            case 91 :
                // XQueryLexer.g:1:723: UNORDERED
                this.mUNORDERED(); 


                break;
            case 92 :
                // XQueryLexer.g:1:733: VALIDATE
                this.mVALIDATE(); 


                break;
            case 93 :
                // XQueryLexer.g:1:742: VARIABLE
                this.mVARIABLE(); 


                break;
            case 94 :
                // XQueryLexer.g:1:751: VERSION
                this.mVERSION(); 


                break;
            case 95 :
                // XQueryLexer.g:1:759: WHERE
                this.mWHERE(); 


                break;
            case 96 :
                // XQueryLexer.g:1:765: XQUERY
                this.mXQUERY(); 


                break;
            case 97 :
                // XQueryLexer.g:1:772: ALLOWING
                this.mALLOWING(); 


                break;
            case 98 :
                // XQueryLexer.g:1:781: CATCH
                this.mCATCH(); 


                break;
            case 99 :
                // XQueryLexer.g:1:787: CONTEXT
                this.mCONTEXT(); 


                break;
            case 100 :
                // XQueryLexer.g:1:795: COUNT
                this.mCOUNT(); 


                break;
            case 101 :
                // XQueryLexer.g:1:801: DECIMAL_FORMAT
                this.mDECIMAL_FORMAT(); 


                break;
            case 102 :
                // XQueryLexer.g:1:816: DECIMAL_SEPARATOR
                this.mDECIMAL_SEPARATOR(); 


                break;
            case 103 :
                // XQueryLexer.g:1:834: DETERMINISTIC
                this.mDETERMINISTIC(); 


                break;
            case 104 :
                // XQueryLexer.g:1:848: DIGIT
                this.mDIGIT(); 


                break;
            case 105 :
                // XQueryLexer.g:1:854: END
                this.mEND(); 


                break;
            case 106 :
                // XQueryLexer.g:1:858: GROUP
                this.mGROUP(); 


                break;
            case 107 :
                // XQueryLexer.g:1:864: GROUPING_SEPARATOR
                this.mGROUPING_SEPARATOR(); 


                break;
            case 108 :
                // XQueryLexer.g:1:883: INFINITY
                this.mINFINITY(); 


                break;
            case 109 :
                // XQueryLexer.g:1:892: MINUS_SIGN
                this.mMINUS_SIGN(); 


                break;
            case 110 :
                // XQueryLexer.g:1:903: NAMESPACE_NODE
                this.mNAMESPACE_NODE(); 


                break;
            case 111 :
                // XQueryLexer.g:1:918: NAN
                this.mNAN(); 


                break;
            case 112 :
                // XQueryLexer.g:1:922: NEXT
                this.mNEXT(); 


                break;
            case 113 :
                // XQueryLexer.g:1:927: ONLY
                this.mONLY(); 


                break;
            case 114 :
                // XQueryLexer.g:1:932: PATTERN_SEPARATOR
                this.mPATTERN_SEPARATOR(); 


                break;
            case 115 :
                // XQueryLexer.g:1:950: PERCENT
                this.mPERCENT(); 


                break;
            case 116 :
                // XQueryLexer.g:1:958: PER_MILLE
                this.mPER_MILLE(); 


                break;
            case 117 :
                // XQueryLexer.g:1:968: PREVIOUS
                this.mPREVIOUS(); 


                break;
            case 118 :
                // XQueryLexer.g:1:977: SLIDING
                this.mSLIDING(); 


                break;
            case 119 :
                // XQueryLexer.g:1:985: START
                this.mSTART(); 


                break;
            case 120 :
                // XQueryLexer.g:1:991: SWITCH
                this.mSWITCH(); 


                break;
            case 121 :
                // XQueryLexer.g:1:998: TRY
                this.mTRY(); 


                break;
            case 122 :
                // XQueryLexer.g:1:1002: TUMBLING
                this.mTUMBLING(); 


                break;
            case 123 :
                // XQueryLexer.g:1:1011: TYPE
                this.mTYPE(); 


                break;
            case 124 :
                // XQueryLexer.g:1:1016: WHEN
                this.mWHEN(); 


                break;
            case 125 :
                // XQueryLexer.g:1:1021: WINDOW
                this.mWINDOW(); 


                break;
            case 126 :
                // XQueryLexer.g:1:1028: ZERO_DIGIT
                this.mZERO_DIGIT(); 


                break;
            case 127 :
                // XQueryLexer.g:1:1039: AFTER
                this.mAFTER(); 


                break;
            case 128 :
                // XQueryLexer.g:1:1045: BEFORE
                this.mBEFORE(); 


                break;
            case 129 :
                // XQueryLexer.g:1:1052: COPY
                this.mCOPY(); 


                break;
            case 130 :
                // XQueryLexer.g:1:1057: DELETE
                this.mDELETE(); 


                break;
            case 131 :
                // XQueryLexer.g:1:1064: FIRST
                this.mFIRST(); 


                break;
            case 132 :
                // XQueryLexer.g:1:1070: INSERT
                this.mINSERT(); 


                break;
            case 133 :
                // XQueryLexer.g:1:1077: INTO
                this.mINTO(); 


                break;
            case 134 :
                // XQueryLexer.g:1:1082: LAST
                this.mLAST(); 


                break;
            case 135 :
                // XQueryLexer.g:1:1087: MODIFY
                this.mMODIFY(); 


                break;
            case 136 :
                // XQueryLexer.g:1:1094: NODES
                this.mNODES(); 


                break;
            case 137 :
                // XQueryLexer.g:1:1100: RENAME
                this.mRENAME(); 


                break;
            case 138 :
                // XQueryLexer.g:1:1107: REPLACE
                this.mREPLACE(); 


                break;
            case 139 :
                // XQueryLexer.g:1:1115: REVALIDATION
                this.mREVALIDATION(); 


                break;
            case 140 :
                // XQueryLexer.g:1:1128: SKIP
                this.mSKIP(); 


                break;
            case 141 :
                // XQueryLexer.g:1:1133: UPDATING
                this.mUPDATING(); 


                break;
            case 142 :
                // XQueryLexer.g:1:1142: VALUE
                this.mVALUE(); 


                break;
            case 143 :
                // XQueryLexer.g:1:1148: WITH
                this.mWITH(); 


                break;
            case 144 :
                // XQueryLexer.g:1:1153: ALL
                this.mALL(); 


                break;
            case 145 :
                // XQueryLexer.g:1:1157: ANY
                this.mANY(); 


                break;
            case 146 :
                // XQueryLexer.g:1:1161: CONTAINS
                this.mCONTAINS(); 


                break;
            case 147 :
                // XQueryLexer.g:1:1170: CONTENT
                this.mCONTENT(); 


                break;
            case 148 :
                // XQueryLexer.g:1:1178: DIACRITICS
                this.mDIACRITICS(); 


                break;
            case 149 :
                // XQueryLexer.g:1:1189: DIFFERENT
                this.mDIFFERENT(); 


                break;
            case 150 :
                // XQueryLexer.g:1:1199: DISTANCE
                this.mDISTANCE(); 


                break;
            case 151 :
                // XQueryLexer.g:1:1208: ENTIRE
                this.mENTIRE(); 


                break;
            case 152 :
                // XQueryLexer.g:1:1215: EXACTLY
                this.mEXACTLY(); 


                break;
            case 153 :
                // XQueryLexer.g:1:1223: FROM
                this.mFROM(); 


                break;
            case 154 :
                // XQueryLexer.g:1:1228: FT_OPTION
                this.mFT_OPTION(); 


                break;
            case 155 :
                // XQueryLexer.g:1:1238: FTAND
                this.mFTAND(); 


                break;
            case 156 :
                // XQueryLexer.g:1:1244: FTNOT
                this.mFTNOT(); 


                break;
            case 157 :
                // XQueryLexer.g:1:1250: FTOR
                this.mFTOR(); 


                break;
            case 158 :
                // XQueryLexer.g:1:1255: INSENSITIVE
                this.mINSENSITIVE(); 


                break;
            case 159 :
                // XQueryLexer.g:1:1267: LANGUAGE
                this.mLANGUAGE(); 


                break;
            case 160 :
                // XQueryLexer.g:1:1276: LEVELS
                this.mLEVELS(); 


                break;
            case 161 :
                // XQueryLexer.g:1:1283: LOWERCASE
                this.mLOWERCASE(); 


                break;
            case 162 :
                // XQueryLexer.g:1:1293: MOST
                this.mMOST(); 


                break;
            case 163 :
                // XQueryLexer.g:1:1298: NO
                this.mNO(); 


                break;
            case 164 :
                // XQueryLexer.g:1:1301: NOT
                this.mNOT(); 


                break;
            case 165 :
                // XQueryLexer.g:1:1305: OCCURS
                this.mOCCURS(); 


                break;
            case 166 :
                // XQueryLexer.g:1:1312: PARAGRAPH
                this.mPARAGRAPH(); 


                break;
            case 167 :
                // XQueryLexer.g:1:1322: PARAGRAPHS
                this.mPARAGRAPHS(); 


                break;
            case 168 :
                // XQueryLexer.g:1:1333: PHRASE
                this.mPHRASE(); 


                break;
            case 169 :
                // XQueryLexer.g:1:1340: RELATIONSHIP
                this.mRELATIONSHIP(); 


                break;
            case 170 :
                // XQueryLexer.g:1:1353: SAME
                this.mSAME(); 


                break;
            case 171 :
                // XQueryLexer.g:1:1358: SCORE
                this.mSCORE(); 


                break;
            case 172 :
                // XQueryLexer.g:1:1364: SENSITIVE
                this.mSENSITIVE(); 


                break;
            case 173 :
                // XQueryLexer.g:1:1374: SENTENCE
                this.mSENTENCE(); 


                break;
            case 174 :
                // XQueryLexer.g:1:1383: SENTENCES
                this.mSENTENCES(); 


                break;
            case 175 :
                // XQueryLexer.g:1:1393: STEMMING
                this.mSTEMMING(); 


                break;
            case 176 :
                // XQueryLexer.g:1:1402: STOP
                this.mSTOP(); 


                break;
            case 177 :
                // XQueryLexer.g:1:1407: THESAURUS
                this.mTHESAURUS(); 


                break;
            case 178 :
                // XQueryLexer.g:1:1417: TIMES
                this.mTIMES(); 


                break;
            case 179 :
                // XQueryLexer.g:1:1423: UPPERCASE
                this.mUPPERCASE(); 


                break;
            case 180 :
                // XQueryLexer.g:1:1433: USING
                this.mUSING(); 


                break;
            case 181 :
                // XQueryLexer.g:1:1439: WEIGHT
                this.mWEIGHT(); 


                break;
            case 182 :
                // XQueryLexer.g:1:1446: WILDCARDS
                this.mWILDCARDS(); 


                break;
            case 183 :
                // XQueryLexer.g:1:1456: WITHOUT
                this.mWITHOUT(); 


                break;
            case 184 :
                // XQueryLexer.g:1:1464: WORD
                this.mWORD(); 


                break;
            case 185 :
                // XQueryLexer.g:1:1469: WORDS
                this.mWORDS(); 


                break;
            case 186 :
                // XQueryLexer.g:1:1475: BREAK
                this.mBREAK(); 


                break;
            case 187 :
                // XQueryLexer.g:1:1481: CONTINUE
                this.mCONTINUE(); 


                break;
            case 188 :
                // XQueryLexer.g:1:1490: EXIT
                this.mEXIT(); 


                break;
            case 189 :
                // XQueryLexer.g:1:1495: LOOP
                this.mLOOP(); 


                break;
            case 190 :
                // XQueryLexer.g:1:1500: RETURNING
                this.mRETURNING(); 


                break;
            case 191 :
                // XQueryLexer.g:1:1510: WHILE
                this.mWHILE(); 


                break;
            case 192 :
                // XQueryLexer.g:1:1516: CHECK
                this.mCHECK(); 


                break;
            case 193 :
                // XQueryLexer.g:1:1522: COLLECTION
                this.mCOLLECTION(); 


                break;
            case 194 :
                // XQueryLexer.g:1:1533: CONSTRAINT
                this.mCONSTRAINT(); 


                break;
            case 195 :
                // XQueryLexer.g:1:1544: FOREACH
                this.mFOREACH(); 


                break;
            case 196 :
                // XQueryLexer.g:1:1552: FOREIGN
                this.mFOREIGN(); 


                break;
            case 197 :
                // XQueryLexer.g:1:1560: INDEX
                this.mINDEX(); 


                break;
            case 198 :
                // XQueryLexer.g:1:1566: INTEGRITY
                this.mINTEGRITY(); 


                break;
            case 199 :
                // XQueryLexer.g:1:1576: KEY
                this.mKEY(); 


                break;
            case 200 :
                // XQueryLexer.g:1:1580: ON
                this.mON(); 


                break;
            case 201 :
                // XQueryLexer.g:1:1583: UNIQUE
                this.mUNIQUE(); 


                break;
            case 202 :
                // XQueryLexer.g:1:1590: BINARY
                this.mBINARY(); 


                break;
            case 203 :
                // XQueryLexer.g:1:1597: AMP_ER
                this.mAMP_ER(); 


                break;
            case 204 :
                // XQueryLexer.g:1:1604: APOS_ER
                this.mAPOS_ER(); 


                break;
            case 205 :
                // XQueryLexer.g:1:1612: QUOT_ER
                this.mQUOT_ER(); 


                break;
            case 206 :
                // XQueryLexer.g:1:1620: LPAREN
                this.mLPAREN(); 


                break;
            case 207 :
                // XQueryLexer.g:1:1627: RPAREN
                this.mRPAREN(); 


                break;
            case 208 :
                // XQueryLexer.g:1:1634: DOLLAR
                this.mDOLLAR(); 


                break;
            case 209 :
                // XQueryLexer.g:1:1641: LBRACKET
                this.mLBRACKET(); 


                break;
            case 210 :
                // XQueryLexer.g:1:1650: RBRACKET
                this.mRBRACKET(); 


                break;
            case 211 :
                // XQueryLexer.g:1:1659: LSQUARE
                this.mLSQUARE(); 


                break;
            case 212 :
                // XQueryLexer.g:1:1667: RSQUARE
                this.mRSQUARE(); 


                break;
            case 213 :
                // XQueryLexer.g:1:1675: EQUAL
                this.mEQUAL(); 


                break;
            case 214 :
                // XQueryLexer.g:1:1681: BIND
                this.mBIND(); 


                break;
            case 215 :
                // XQueryLexer.g:1:1686: NOTEQUAL
                this.mNOTEQUAL(); 


                break;
            case 216 :
                // XQueryLexer.g:1:1695: ANN_PERCENT
                this.mANN_PERCENT(); 


                break;
            case 217 :
                // XQueryLexer.g:1:1707: HASH
                this.mHASH(); 


                break;
            case 218 :
                // XQueryLexer.g:1:1712: AMP
                this.mAMP(); 


                break;
            case 219 :
                // XQueryLexer.g:1:1716: COMMA
                this.mCOMMA(); 


                break;
            case 220 :
                // XQueryLexer.g:1:1722: QUESTION
                this.mQUESTION(); 


                break;
            case 221 :
                // XQueryLexer.g:1:1731: STAR
                this.mSTAR(); 


                break;
            case 222 :
                // XQueryLexer.g:1:1736: PLUS
                this.mPLUS(); 


                break;
            case 223 :
                // XQueryLexer.g:1:1741: MINUS
                this.mMINUS(); 


                break;
            case 224 :
                // XQueryLexer.g:1:1747: SMALLER
                this.mSMALLER(); 


                break;
            case 225 :
                // XQueryLexer.g:1:1755: GREATER
                this.mGREATER(); 


                break;
            case 226 :
                // XQueryLexer.g:1:1763: SMALLEREQ
                this.mSMALLEREQ(); 


                break;
            case 227 :
                // XQueryLexer.g:1:1773: GREATEREQ
                this.mGREATEREQ(); 


                break;
            case 228 :
                // XQueryLexer.g:1:1783: SMALLER_SMALLER
                this.mSMALLER_SMALLER(); 


                break;
            case 229 :
                // XQueryLexer.g:1:1799: GREATER_GREATER
                this.mGREATER_GREATER(); 


                break;
            case 230 :
                // XQueryLexer.g:1:1815: SLASH
                this.mSLASH(); 


                break;
            case 231 :
                // XQueryLexer.g:1:1821: SLASH_SLASH
                this.mSLASH_SLASH(); 


                break;
            case 232 :
                // XQueryLexer.g:1:1833: DOT
                this.mDOT(); 


                break;
            case 233 :
                // XQueryLexer.g:1:1837: DOT_DOT
                this.mDOT_DOT(); 


                break;
            case 234 :
                // XQueryLexer.g:1:1845: COLON
                this.mCOLON(); 


                break;
            case 235 :
                // XQueryLexer.g:1:1851: COLON_COLON
                this.mCOLON_COLON(); 


                break;
            case 236 :
                // XQueryLexer.g:1:1863: EMPTY_CLOSE_TAG
                this.mEMPTY_CLOSE_TAG(); 


                break;
            case 237 :
                // XQueryLexer.g:1:1879: CLOSE_TAG
                this.mCLOSE_TAG(); 


                break;
            case 238 :
                // XQueryLexer.g:1:1889: SEMICOLON
                this.mSEMICOLON(); 


                break;
            case 239 :
                // XQueryLexer.g:1:1899: VBAR
                this.mVBAR(); 


                break;
            case 240 :
                // XQueryLexer.g:1:1904: PRAGMA_START
                this.mPRAGMA_START(); 


                break;
            case 241 :
                // XQueryLexer.g:1:1917: PRAGMA_END
                this.mPRAGMA_END(); 


                break;
            case 242 :
                // XQueryLexer.g:1:1928: XML_COMMENT_START
                this.mXML_COMMENT_START(); 


                break;
            case 243 :
                // XQueryLexer.g:1:1946: XML_COMMENT_END
                this.mXML_COMMENT_END(); 


                break;
            case 244 :
                // XQueryLexer.g:1:1962: PI_START
                this.mPI_START(); 


                break;
            case 245 :
                // XQueryLexer.g:1:1971: PI_END
                this.mPI_END(); 


                break;
            case 246 :
                // XQueryLexer.g:1:1978: ATTR_SIGN
                this.mATTR_SIGN(); 


                break;
            case 247 :
                // XQueryLexer.g:1:1988: CHARREF_DEC
                this.mCHARREF_DEC(); 


                break;
            case 248 :
                // XQueryLexer.g:1:2000: CHARREF_HEX
                this.mCHARREF_HEX(); 


                break;
            case 249 :
                // XQueryLexer.g:1:2012: APOS
                this.mAPOS(); 


                break;
            case 250 :
                // XQueryLexer.g:1:2017: QUOT
                this.mQUOT(); 


                break;
            case 251 :
                // XQueryLexer.g:1:2022: L_NCName
                this.mL_NCName(); 


                break;
            case 252 :
                // XQueryLexer.g:1:2031: S
                this.mS(); 


                break;
            case 253 :
                // XQueryLexer.g:1:2033: L_Pragma
                this.mL_Pragma(); 


                break;
            case 254 :
                // XQueryLexer.g:1:2042: L_DirCommentConstructor
                this.mL_DirCommentConstructor(); 


                break;
            case 255 :
                // XQueryLexer.g:1:2066: L_DirPIConstructor
                this.mL_DirPIConstructor(); 


                break;
            case 256 :
                // XQueryLexer.g:1:2085: L_IntegerLiteral
                this.mL_IntegerLiteral(); 


                break;
            case 257 :
                // XQueryLexer.g:1:2102: L_DecimalLiteral
                this.mL_DecimalLiteral(); 


                break;
            case 258 :
                // XQueryLexer.g:1:2119: L_DoubleLiteral
                this.mL_DoubleLiteral(); 


                break;
            case 259 :
                // XQueryLexer.g:1:2135: L_Comment
                this.mL_Comment(); 


                break;
            case 260 :
                // XQueryLexer.g:1:2145: L_AnyChar
                this.mL_AnyChar(); 


                break;

        }

    }

}, true); // important to pass true to overwrite default implementations

org.antlr.lang.augmentObject(XQueryLexer, {
    DFA19_eotS:
        "\u0001\uffff\u0018\u003f\u0001\u0092\u0007\uffff\u0001\u009c\u0001"+
    "\u0037\u0001\uffff\u0001\u00a0\u0001\u00a2\u0001\uffff\u0001\u00a5\u0002"+
    "\uffff\u0001\u00a9\u0001\u00af\u0001\u00b2\u0001\u00b5\u0001\u00b7\u0007"+
    "\uffff\u0001\u00bf\u0001\uffff\u0001\u003f\u0001\u00c7\u0001\u00c9\u0004"+
    "\u003f\u0001\uffff\u0002\u003f\u0001\u00d0\u000c\u003f\u0001\u00ee\u0007"+
    "\u003f\u0001\u00fd\u0001\u003f\u0001\u0100\u0001\u003f\u0001\u0102\u0001"+
    "\u003f\u0001\u0109\u0001\u010a\u0002\u003f\u0001\u0112\u0001\u0113\u0004"+
    "\u003f\u0001\u011b\u0001\u011f\u0001\u0120\u0001\u003f\u0001\u0123\u0001"+
    "\u0125\u0010\u003f\u0001\u0142\u0012\u003f\u0001\u015c\u0010\uffff\u0001"+
    "\u015f\u000c\uffff\u0001\u0161\u0009\uffff\u0001\u0163\u0007\uffff\u0001"+
    "\u00bf\u0001\u0163\u0001\uffff\u0001\u003f\u0001\u0166\u0001\u0167\u0001"+
    "\u003f\u0001\uffff\u0001\u003f\u0001\uffff\u0001\u016b\u0001\u003f\u0001"+
    "\u016d\u0003\u003f\u0001\uffff\u0011\u003f\u0001\u0185\u0009\u003f\u0001"+
    "\u018f\u0001\u003f\u0001\uffff\u0006\u003f\u0001\u0198\u0007\u003f\u0001"+
    "\uffff\u0002\u003f\u0001\uffff\u0001\u003f\u0001\uffff\u0006\u003f\u0002"+
    "\uffff\u0001\u003f\u0001\u01ac\u0003\u003f\u0001\u01b0\u0001\u003f\u0002"+
    "\uffff\u0002\u003f\u0001\u01b6\u0004\u003f\u0001\uffff\u0002\u003f\u0001"+
    "\u01be\u0002\uffff\u0002\u003f\u0001\uffff\u0001\u003f\u0001\uffff\u001c"+
    "\u003f\u0001\uffff\u0001\u003f\u0001\u01e6\u0013\u003f\u0001\u01fd\u0001"+
    "\u003f\u0001\u01ff\u0001\u003f\u0008\uffff\u0001\u0163\u0001\u003f\u0002"+
    "\uffff\u0003\u003f\u0001\uffff\u0001\u003f\u0001\uffff\u0001\u0207\u0005"+
    "\u003f\u0001\u020d\u0001\u020f\u0007\u003f\u0001\u021b\u0007\u003f\u0001"+
    "\uffff\u0006\u003f\u0001\u0229\u0002\u003f\u0001\uffff\u0005\u003f\u0001"+
    "\u0231\u0002\u003f\u0001\uffff\u0002\u003f\u0001\u0237\u0003\u003f\u0001"+
    "\u023b\u0002\u003f\u0001\u023e\u0005\u003f\u0001\u0246\u0002\u003f\u0001"+
    "\u0249\u0001\uffff\u0001\u024a\u0002\u003f\u0001\uffff\u0002\u003f\u0001"+
    "\u024f\u0002\u003f\u0001\uffff\u0001\u0252\u0002\u003f\u0001\u0255\u0002"+
    "\u003f\u0001\u0259\u0001\uffff\u0002\u003f\u0001\u025c\u0011\u003f\u0001"+
    "\u026e\u0002\u003f\u0001\u0271\u0002\u003f\u0001\u0274\u0004\u003f\u0001"+
    "\u027a\u0002\u003f\u0001\u027d\u0001\u027e\u0001\u027f\u0002\u003f\u0001"+
    "\uffff\u0001\u0283\u000d\u003f\u0001\u0291\u0002\u003f\u0001\u0295\u0002"+
    "\u003f\u0001\u0299\u0001\u003f\u0001\uffff\u0001\u003f\u0001\uffff\u0001"+
    "\u029c\u0001\u029d\u0004\u003f\u0001\u02a3\u0001\uffff\u0003\u003f\u0001"+
    "\u02a7\u0001\u003f\u0001\uffff\u0001\u003f\u0001\uffff\u0001\u02aa\u0001"+
    "\u02ab\u0001\u02ac\u0008\u003f\u0001\uffff\u0001\u02b6\u0006\u003f\u0001"+
    "\u02bd\u0005\u003f\u0001\uffff\u0001\u02c4\u0002\u003f\u0001\u02c7\u0003"+
    "\u003f\u0001\uffff\u0004\u003f\u0001\u02cf\u0001\uffff\u0001\u003f\u0001"+
    "\u02d1\u0001\u02d2\u0001\uffff\u0001\u003f\u0001\u02d5\u0001\uffff\u0007"+
    "\u003f\u0001\uffff\u0001\u003f\u0001\u02de\u0002\uffff\u0001\u003f\u0001"+
    "\u02e0\u0002\u003f\u0001\uffff\u0002\u003f\u0001\uffff\u0002\u003f\u0001"+
    "\uffff\u0002\u003f\u0001\u02e9\u0001\uffff\u0001\u003f\u0001\u02ed\u0001"+
    "\uffff\u0011\u003f\u0001\uffff\u0001\u003f\u0001\u0300\u0001\uffff\u0002"+
    "\u003f\u0001\uffff\u0001\u003f\u0001\u0304\u0001\u003f\u0001\u0306\u0001"+
    "\u003f\u0001\uffff\u0002\u003f\u0003\uffff\u0001\u003f\u0001\u030b\u0001"+
    "\u003f\u0001\uffff\u0001\u003f\u0001\u030e\u0001\u030f\u0004\u003f\u0001"+
    "\u0314\u0001\u003f\u0001\u0316\u0002\u003f\u0001\u0319\u0001\uffff\u0001"+
    "\u031a\u0002\u003f\u0001\uffff\u0002\u003f\u0001\u031f\u0001\uffff\u0002"+
    "\u003f\u0003\uffff\u0004\u003f\u0001\uffff\u0002\u003f\u0001\u0328\u0001"+
    "\uffff\u0001\u0329\u0001\u003f\u0003\uffff\u0009\u003f\u0001\uffff\u0005"+
    "\u003f\u0001\u033a\u0001\uffff\u0006\u003f\u0001\uffff\u0001\u003f\u0001"+
    "\u0342\u0001\uffff\u0001\u0343\u0006\u003f\u0001\uffff\u0001\u003f\u0002"+
    "\uffff\u0002\u003f\u0001\uffff\u0001\u034d\u0002\u003f\u0001\u0350\u0004"+
    "\u003f\u0001\uffff\u0001\u003f\u0001\uffff\u0001\u0356\u0001\u003f\u0001"+
    "\u0358\u0001\u0359\u0004\u003f\u0001\uffff\u0001\u035e\u0002\u003f\u0001"+
    "\uffff\u0001\u0361\u0001\u0362\u0008\u003f\u0001\u036b\u0001\u036d\u0001"+
    "\u036e\u0004\u003f\u0001\u0374\u0001\uffff\u0002\u003f\u0001\u0377\u0001"+
    "\uffff\u0001\u0378\u0001\uffff\u0002\u003f\u0001\u037b\u0001\u003f\u0001"+
    "\uffff\u0002\u003f\u0002\uffff\u0001\u037f\u0003\u003f\u0001\uffff\u0001"+
    "\u003f\u0001\uffff\u0002\u003f\u0002\uffff\u0001\u0386\u0002\u003f\u0001"+
    "\u0389\u0001\uffff\u0001\u038a\u0007\u003f\u0002\uffff\u0003\u003f\u0001"+
    "\u0395\u0002\u003f\u0001\u0398\u0001\u0399\u0003\u003f\u0001\u039d\u0001"+
    "\u003f\u0001\u039f\u0002\u003f\u0001\uffff\u0004\u003f\u0001\u03a7\u0002"+
    "\u003f\u0002\uffff\u0001\u003f\u0001\u03ab\u0001\u003f\u0001\u03ad\u0001"+
    "\u03ae\u0004\u003f\u0001\uffff\u0001\u03b3\u0001\u003f\u0001\uffff\u0005"+
    "\u003f\u0001\uffff\u0001\u003f\u0002\uffff\u0004\u003f\u0001\uffff\u0001"+
    "\u03bf\u0001\u003f\u0002\uffff\u0006\u003f\u0001\u03c7\u0001\u003f\u0001"+
    "\uffff\u0001\u003f\u0002\uffff\u0001\u03ca\u0004\u003f\u0001\uffff\u0002"+
    "\u003f\u0002\uffff\u0001\u003f\u0001\u03d3\u0001\uffff\u0003\u003f\u0001"+
    "\uffff\u0005\u003f\u0001\u03dc\u0001\uffff\u0001\u03dd\u0001\u003f\u0002"+
    "\uffff\u0001\u003f\u0001\u03e1\u0002\u003f\u0001\u03e4\u0001\u03e5\u0001"+
    "\u003f\u0001\u03e7\u0002\u003f\u0001\uffff\u0002\u003f\u0002\uffff\u0001"+
    "\u03ec\u0001\u03ed\u0001\u003f\u0001\uffff\u0001\u003f\u0001\uffff\u0005"+
    "\u003f\u0001\u03f6\u0001\u03f8\u0001\uffff\u0001\u003f\u0001\u03fa\u0001"+
    "\u03fb\u0001\uffff\u0001\u003f\u0002\uffff\u0001\u03fd\u0001\u003f\u0001"+
    "\u03ff\u0001\u003f\u0001\uffff\u0001\u0401\u0003\u003f\u0001\u0405\u0001"+
    "\u0406\u0005\u003f\u0001\uffff\u0001\u040c\u0003\u003f\u0001\u0410\u0001"+
    "\u0411\u0001\u003f\u0001\uffff\u0002\u003f\u0001\uffff\u0006\u003f\u0001"+
    "\u041c\u0001\u041d\u0001\uffff\u0002\u003f\u0001\u0420\u0001\u003f\u0001"+
    "\u0422\u0001\u003f\u0001\u0424\u0001\u0425\u0002\uffff\u0003\u003f\u0001"+
    "\uffff\u0001\u0429\u0001\u042a\u0002\uffff\u0001\u003f\u0001\uffff\u0001"+
    "\u042c\u0003\u003f\u0002\uffff\u0007\u003f\u0001\u0437\u0001\uffff\u0001"+
    "\u003f\u0001\uffff\u0001\u003f\u0002\uffff\u0001\u043b\u0001\uffff\u0001"+
    "\u043c\u0001\uffff\u0001\u003f\u0001\uffff\u0001\u003f\u0001\u043f\u0001"+
    "\u0440\u0002\uffff\u0001\u0441\u0001\u003f\u0001\u0444\u0002\u003f\u0001"+
    "\uffff\u0001\u0448\u0001\u003f\u0001\u044b\u0002\uffff\u0001\u003f\u0001"+
    "\u044d\u0001\u044e\u0002\u003f\u0001\u0451\u0002\u003f\u0001\u0454\u0001"+
    "\u0455\u0002\uffff\u0001\u0456\u0001\u003f\u0001\uffff\u0001\u0458\u0001"+
    "\uffff\u0001\u0459\u0002\uffff\u0001\u045a\u0002\u003f\u0002\uffff\u0001"+
    "\u003f\u0001\uffff\u0001\u045e\u0001\u003f\u0001\u0460\u0003\u003f\u0001"+
    "\u0465\u0001\u0466\u0001\u003f\u0001\u0468\u0001\uffff\u0003\u003f\u0002"+
    "\uffff\u0002\u003f\u0003\uffff\u0001\u046e\u0001\u003f\u0001\uffff\u0001"+
    "\u0470\u0001\u003f\u0001\u0472\u0001\uffff\u0002\u003f\u0001\uffff\u0001"+
    "\u003f\u0002\uffff\u0002\u003f\u0001\uffff\u0002\u003f\u0003\uffff\u0001"+
    "\u047a\u0003\uffff\u0001\u047b\u0002\u003f\u0001\uffff\u0001\u003f\u0001"+
    "\uffff\u0004\u003f\u0002\uffff\u0001\u003f\u0001\uffff\u0004\u003f\u0001"+
    "\u0488\u0001\uffff\u0001\u003f\u0001\uffff\u0001\u048a\u0001\uffff\u0007"+
    "\u003f\u0002\uffff\u0002\u003f\u0001\u0494\u0009\u003f\u0001\uffff\u0001"+
    "\u003f\u0001\uffff\u0003\u003f\u0001\u04a2\u0001\u04a3\u0004\u003f\u0001"+
    "\uffff\u0004\u003f\u0001\u04ac\u0001\u04ad\u0007\u003f\u0002\uffff\u0003"+
    "\u003f\u0001\u04b8\u0001\u003f\u0001\u04ba\u0002\u003f\u0002\uffff\u0001"+
    "\u04bd\u0002\u003f\u0001\u04c0\u0004\u003f\u0001\u04c5\u0001\u003f\u0001"+
    "\uffff\u0001\u04c7\u0001\uffff\u0002\u003f\u0001\uffff\u0002\u003f\u0001"+
    "\uffff\u0004\u003f\u0001\uffff\u0001\u04d0\u0001\uffff\u0007\u003f\u0001"+
    "\u04d8\u0001\uffff\u0001\u04d9\u0001\u003f\u0001\u04db\u0001\u003f\u0001"+
    "\u04dd\u0001\u04de\u0001\u003f\u0002\uffff\u0001\u04e0\u0001\uffff\u0001"+
    "\u04e1\u0002\uffff\u0001\u003f\u0002\uffff\u0003\u003f\u0001\u04e6\u0001"+
    "\uffff",
    DFA19_eofS:
        "\u04e7\uffff",
    DFA19_minS:
        "\u0001\u0000\u0001\u0066\u0002\u0061\u0001\u0065\u0001\u006c\u0001"+
    "\u0069\u0001\u0065\u0001\u0064\u0001\u0061\u0001\u0069\u0001\u0061\u0001"+
    "\u0063\u0001\u0061\u0001\u0065\u0001\u0061\u0001\u0065\u0001\u006e\u0001"+
    "\u0061\u0001\u0065\u0001\u0071\u0001\u0061\u0002\u0065\u0001\u0075\u0001"+
    "\u0023\u0007\uffff\u0001\u003a\u0001\u003d\u0001\uffff\u0001\u0029\u0001"+
    "\u0023\u0001\uffff\u0001\u003e\u0002\uffff\u0001\u002d\u0001\u0021\u0001"+
    "\u003d\u0001\u002f\u0001\u002e\u0007\uffff\u0001\u002e\u0001\uffff\u0001"+
    "\u0063\u0002\u002d\u0001\u006c\u0001\u0074\u0001\u0070\u0001\u006f\u0001"+
    "\uffff\u0001\u0073\u0001\u0075\u0001\u002d\u0001\u0066\u0001\u0065\u0001"+
    "\u006e\u0001\u0073\u0001\u0065\u0001\u006c\u0001\u0063\u0001\u0061\u0001"+
    "\u0063\u0001\u0065\u0001\u0070\u0001\u0063\u0001\u002d\u0001\u0065\u0001"+
    "\u0061\u0001\u006c\u0001\u006e\u0001\u0072\u0001\u006f\u0002\u002d\u0001"+
    "\u0065\u0001\u002d\u0001\u0069\u0001\u002d\u0001\u0070\u0002\u002d\u0001"+
    "\u0065\u0001\u006e\u0002\u002d\u0001\u006f\u0001\u0064\u0001\u006e\u0001"+
    "\u006d\u0003\u002d\u0001\u0074\u0002\u002d\u0001\u0063\u0001\u0072\u0001"+
    "\u0065\u0002\u0072\u0001\u006c\u0001\u006d\u0001\u0068\u0001\u006c\u0001"+
    "\u006d\u0001\u0061\u0003\u0069\u0001\u0078\u0001\u0065\u0001\u002d\u0001"+
    "\u0065\u0001\u0070\u0002\u006d\u0001\u0069\u0001\u0064\u0001\u0069\u0001"+
    "\u006c\u0001\u0072\u0001\u0065\u0001\u006c\u0001\u0069\u0001\u0072\u0001"+
    "\u0075\u0001\u004e\u0001\u0072\u0001\u0079\u0001\u006f\u0001\u0009\u0010"+
    "\uffff\u0001\u0078\u000b\uffff\u0001\u002d\u0001\u0009\u0009\uffff\u0001"+
    "\u0030\u0007\uffff\u0001\u002e\u0001\u0030\u0001\uffff\u0001\u0065\u0002"+
    "\u002d\u0001\u0065\u0001\uffff\u0001\u0072\u0001\uffff\u0001\u002d\u0001"+
    "\u0065\u0001\u002d\u0001\u0073\u0001\u0065\u0001\u006e\u0001\uffff\u0001"+
    "\u006f\u0002\u0061\u0001\u0065\u0001\u0063\u0001\u006c\u0001\u0063\u0001"+
    "\u006c\u0001\u006d\u0001\u0073\u0001\u0079\u0001\u006e\u0001\u0069\u0001"+
    "\u0061\u0001\u0063\u0002\u0065\u0001\u002d\u0001\u0069\u0001\u0063\u0001"+
    "\u0066\u0001\u0074\u0001\u0075\u0001\u006d\u0001\u0065\u0001\u0074\u0001"+
    "\u006f\u0001\u002d\u0001\u0069\u0001\uffff\u0001\u0072\u0002\u0065\u0001"+
    "\u0063\u0001\u0074\u0001\u006c\u0001\u002d\u0001\u0063\u0001\u0073\u0001"+
    "\u006d\u0001\u006f\u0001\u006e\u0001\u006f\u0001\u0072\u0001\uffff\u0001"+
    "\u0061\u0001\u0075\u0001\uffff\u0001\u0076\u0001\uffff\u0001\u006f\u0003"+
    "\u0065\u0001\u0069\u0001\u0065\u0002\uffff\u0001\u006d\u0001\u002d\u0001"+
    "\u0074\u0001\u0067\u0001\u0073\u0001\u002d\u0001\u0065\u0002\uffff\u0001"+
    "\u0065\u0001\u0070\u0001\u002d\u0001\u0074\u0001\u0075\u0001\u0065\u0001"+
    "\u0074\u0001\uffff\u0001\u0069\u0001\u0065\u0001\u002d\u0002\uffff\u0001"+
    "\u0069\u0001\u0065\u0001\uffff\u0001\u0079\u0001\uffff\u0001\u0075\u0001"+
    "\u0061\u0001\u0074\u0002\u0063\u0001\u002d\u0001\u0061\u0001\u0075\u0001"+
    "\u0061\u0001\u006c\u0002\u0061\u0001\u0069\u0002\u0065\u0001\u0072\u0001"+
    "\u0066\u0001\u0073\u0001\u0065\u0001\u0062\u0001\u0069\u0001\u006d\u0001"+
    "\u0070\u0001\u0064\u0001\u0074\u0001\u0070\u0001\u0074\u0001\u006e\u0001"+
    "\uffff\u0001\u0061\u0001\u002d\u0001\u0065\u0001\u0062\u0001\u0065\u0001"+
    "\u006f\u0001\u0072\u0001\u0061\u0001\u0065\u0001\u006e\u0002\u0069\u0001"+
    "\u0073\u0001\u006e\u0001\u006c\u0001\u0064\u0001\u0068\u0001\u0064\u0001"+
    "\u0067\u0001\u0064\u0001\u0065\u0001\u002d\u0001\u006f\u0001\u002d\u0001"+
    "\u0074\u0004\uffff\u0001\u002d\u0003\uffff\u0001\u0030\u0001\u0073\u0002"+
    "\uffff\u0001\u006e\u0001\u0069\u0001\u0077\u0001\uffff\u0001\u0072\u0001"+
    "\uffff\u0002\u002d\u0001\u0064\u0001\u0072\u0001\u006b\u0001\u0072\u0002"+
    "\u002d\u0001\u0068\u0001\u0064\u0001\u006b\u0001\u0061\u0001\u0065\u0001"+
    "\u0074\u0001\u0061\u0001\u002d\u0001\u0074\u0001\u0061\u0001\u006d\u0001"+
    "\u0075\u0001\u0065\u0001\u0072\u0001\u0074\u0001\uffff\u0001\u0074\u0001"+
    "\u0072\u0001\u0065\u0001\u0061\u0001\u006d\u0001\u0065\u0001\u002d\u0001"+
    "\u0079\u0001\u0064\u0001\uffff\u0001\u0072\u0001\u0079\u0001\u0070\u0001"+
    "\u0072\u0001\u0074\u0001\u002d\u0001\u006f\u0001\u0061\u0001\uffff\u0002"+
    "\u0074\u0001\u002d\u0001\u0070\u0001\u0064\u0001\u0074\u0001\u002d\u0001"+
    "\u0074\u0001\u0070\u0001\u002d\u0002\u0072\u0001\u0061\u0001\u006e\u0001"+
    "\u0067\u0001\u002d\u0001\u006e\u0001\u0078\u0001\u002d\u0001\uffff\u0001"+
    "\u002d\u0001\u0075\u0001\u0074\u0001\uffff\u0001\u006c\u0001\u0072\u0001"+
    "\u002d\u0001\u006c\u0001\u0066\u0001\uffff\u0001\u002d\u0002\u0073\u0001"+
    "\u002d\u0001\u006e\u0001\u0072\u0001\u002d\u0001\uffff\u0001\u006f\u0001"+
    "\u0072\u0001\u002d\u0001\u0072\u0001\u006e\u0001\u0067\u0003\u0065\u0001"+
    "\u0069\u0002\u0065\u0001\u006d\u0001\u0073\u0001\u0072\u0001\u006d\u0001"+
    "\u0061\u0001\u006c\u0001\u0074\u0001\u0073\u0001\u002d\u0001\u006d\u0001"+
    "\u0065\u0001\u002d\u0001\u0069\u0001\u0065\u0001\u002d\u0001\u006c\u0001"+
    "\u0074\u0001\u0063\u0001\u006d\u0001\u002d\u0001\u0069\u0001\u0063\u0003"+
    "\u002d\u0001\u0061\u0001\u0074\u0001\uffff\u0001\u002d\u0001\u006c\u0001"+
    "\u0073\u0001\u006e\u0001\u0075\u0001\u0064\u0001\u0074\u0001\u0072\u0001"+
    "\u0067\u0001\u0064\u0001\u0065\u0001\u0061\u0001\u0069\u0001\u0065\u0001"+
    "\u002d\u0001\u0065\u0001\u006f\u0001\u002d\u0001\u0063\u0001\u0068\u0001"+
    "\u002d\u0001\u0072\u0001\uffff\u0001\u002d\u0001\uffff\u0001\u002d\u0001"+
    "\u0000\u0001\u0074\u0001\u0064\u0001\u0062\u0001\u0069\u0001\u002d\u0001"+
    "\uffff\u0001\u0075\u0001\u0061\u0001\u0065\u0001\u002d\u0001\u0079\u0001"+
    "\uffff\u0001\u0062\u0001\uffff\u0003\u002d\u0001\u0074\u0001\u0063\u0001"+
    "\u006e\u0001\u0072\u0001\u006e\u0001\u0069\u0002\u006e\u0001\uffff\u0001"+
    "\u002d\u0001\u0072\u0001\u0061\u0001\u006c\u0001\u006e\u0001\u006d\u0001"+
    "\u0065\u0001\u002d\u0001\u0069\u0001\u0072\u0001\u006e\u0001\u0065\u0001"+
    "\u006e\u0001\uffff\u0001\u002d\u0001\u0069\u0001\u0065\u0001\u002d\u0001"+
    "\u0074\u0001\u006e\u0001\u006c\u0001\uffff\u0001\u0077\u0001\u0063\u0001"+
    "\u0067\u0001\u0069\u0001\u002d\u0001\uffff\u0001\u0074\u0002\u002d\u0001"+
    "\uffff\u0001\u0065\u0001\u002d\u0001\uffff\u0001\u0074\u0001\u0069\u0001"+
    "\u006e\u0001\u0074\u0002\u0073\u0001\u0072\u0001\uffff\u0001\u0069\u0001"+
    "\u002d\u0002\uffff\u0001\u0061\u0001\u002d\u0001\u0073\u0001\u0063\u0001"+
    "\uffff\u0001\u0065\u0001\u0079\u0001\uffff\u0001\u002d\u0001\u0070\u0001"+
    "\uffff\u0001\u0068\u0001\u0065\u0001\u002d\u0001\uffff\u0001\u006e\u0001"+
    "\u002d\u0001\uffff\u0001\u0073\u0001\u0074\u0002\u0072\u0001\u0064\u0001"+
    "\u0072\u0001\u006f\u0001\u0073\u0001\u006e\u0001\u0069\u0001\u0065\u0001"+
    "\u006e\u0001\u0065\u0001\u0063\u0002\u0069\u0001\u0066\u0001\uffff\u0001"+
    "\u0061\u0001\u002d\u0001\uffff\u0001\u0074\u0001\u006e\u0001\uffff\u0001"+
    "\u0065\u0001\u002d\u0001\u0074\u0001\u002d\u0001\u0069\u0001\uffff\u0001"+
    "\u006e\u0001\u0068\u0003\uffff\u0001\u0075\u0001\u002d\u0001\u0077\u0001"+
    "\uffff\u0001\u0069\u0002\u002d\u0002\u0065\u0001\u0069\u0001\u0063\u0001"+
    "\u002d\u0001\u0061\u0001\u002d\u0001\u0062\u0001\u006f\u0001\u002d\u0001"+
    "\uffff\u0001\u002d\u0001\u0077\u0001\u0075\u0001\uffff\u0001\u0061\u0001"+
    "\u0074\u0001\u002d\u0001\uffff\u0001\u0079\u0001\u0064\u0003\uffff\u0001"+
    "\u006f\u0001\u0069\u0001\u0075\u0001\u006e\u0001\uffff\u0002\u0072\u0001"+
    "\u002d\u0001\uffff\u0001\u002d\u0001\u006c\u0003\uffff\u0001\u0069\u0002"+
    "\u0074\u0001\u0061\u0002\u0074\u0001\u006e\u0001\u0075\u0001\u0061\u0001"+
    "\uffff\u0001\u0065\u0001\u006c\u0001\u0074\u0001\u0064\u0001\u0069\u0001"+
    "\u002d\u0001\uffff\u0001\u0074\u0001\u0065\u0001\u0063\u0001\u006e\u0001"+
    "\u0074\u0001\u0073\u0001\uffff\u0001\u006e\u0001\u002d\u0001\uffff\u0001"+
    "\u002d\u0001\u0061\u0001\u0079\u0001\u0069\u0001\u0068\u0001\u006e\u0001"+
    "\u006f\u0001\uffff\u0001\u0069\u0002\uffff\u0001\u0073\u0001\u006e\u0001"+
    "\uffff\u0001\u002d\u0001\u0074\u0001\u0063\u0001\u002d\u0001\u0069\u0001"+
    "\u0065\u0001\u0069\u0001\u0074\u0001\uffff\u0001\u0067\u0001\uffff\u0001"+
    "\u002d\u0001\u0061\u0002\u002d\u0001\u0073\u0001\u0061\u0001\u0065\u0001"+
    "\u0073\u0001\uffff\u0001\u002d\u0001\u0064\u0001\u006e\u0001\uffff\u0002"+
    "\u002d\u0001\u0061\u0001\u006e\u0001\u0069\u0001\u0076\u0001\u0075\u0001"+
    "\u0073\u0001\u0074\u0001\u006c\u0003\u002d\u0001\u0065\u0001\u0064\u0001"+
    "\u006f\u0001\u0069\u0001\u002d\u0001\uffff\u0001\u0069\u0001\u0063\u0001"+
    "\u002d\u0001\uffff\u0001\u002d\u0001\uffff\u0001\u006e\u0001\u0067\u0001"+
    "\u002d\u0001\u0072\u0001\uffff\u0001\u0069\u0001\u006e\u0002\uffff\u0001"+
    "\u002d\u0001\u0072\u0001\u006e\u0001\u0061\u0001\uffff\u0001\u0074\u0001"+
    "\uffff\u0001\u006c\u0001\u006e\u0002\uffff\u0001\u002d\u0001\u0074\u0001"+
    "\u0072\u0001\u002d\u0001\uffff\u0001\u002d\u0001\u0069\u0001\u0072\u0001"+
    "\u006e\u0001\u0074\u0001\u0067\u0001\u0069\u0001\u0079\u0002\uffff\u0001"+
    "\u0065\u0001\u006f\u0001\u0069\u0001\u002d\u0001\u0063\u0001\u0069\u0002"+
    "\u002d\u0001\u0073\u0001\u0065\u0001\u006d\u0003\u002d\u0001\u0061\u0001"+
    "\u006e\u0001\uffff\u0001\u0069\u0001\u006e\u0001\u0065\u0001\u0074\u0001"+
    "\u002d\u0001\u0065\u0001\u0067\u0002\uffff\u0001\u006c\u0001\u002d\u0001"+
    "\u006e\u0002\u002d\u0001\u006e\u0001\u006f\u0001\u0074\u0001\u0067\u0001"+
    "\uffff\u0001\u002d\u0001\u0065\u0001\uffff\u0001\u0074\u0001\u0063\u0001"+
    "\u0074\u0001\u0079\u0001\u0065\u0001\uffff\u0001\u0073\u0002\uffff\u0001"+
    "\u0069\u0001\u0063\u0001\u0072\u0001\u0065\u0001\uffff\u0001\u002d\u0001"+
    "\u0067\u0002\uffff\u0001\u0070\u0001\u002d\u0001\u006e\u0001\u0065\u0001"+
    "\u0073\u0001\u0069\u0001\u002d\u0001\u006c\u0001\uffff\u0001\u006e\u0002"+
    "\uffff\u0001\u002d\u0001\u0061\u0001\u006e\u0001\u0065\u0001\u0061\u0001"+
    "\uffff\u0001\u0076\u0001\u0065\u0002\uffff\u0001\u0067\u0001\u002d\u0001"+
    "\uffff\u0001\u0075\u0001\u0074\u0001\u0067\u0001\uffff\u0001\u0065\u0001"+
    "\u0067\u0001\u0073\u0002\u0065\u0001\u002d\u0001\uffff\u0001\u002d\u0001"+
    "\u0064\u0002\uffff\u0001\u0067\u0001\u002d\u0001\u0067\u0001\u0065\u0004"+
    "\u002d\u0001\u006e\u0001\u006f\u0001\uffff\u0001\u0074\u0001\u006e\u0002"+
    "\uffff\u0002\u002d\u0001\u0065\u0001\uffff\u0001\u0066\u0001\uffff\u0002"+
    "\u006e\u0001\u0069\u0001\u0063\u0001\u0074\u0002\u002d\u0001\uffff\u0001"+
    "\u0071\u0002\u002d\u0001\uffff\u0001\u0067\u0002\uffff\u0001\u002d\u0001"+
    "\u006e\u0002\u002d\u0001\uffff\u0001\u002d\u0001\u0069\u0001\u0074\u0001"+
    "\u0079\u0002\u002d\u0001\u0065\u0001\u0067\u0001\u0065\u0001\u0069\u0001"+
    "\u0072\u0001\uffff\u0001\u002d\u0001\u0068\u0001\u0073\u0001\u0067\u0002"+
    "\u002d\u0001\u006e\u0001\uffff\u0001\u0065\u0001\u0067\u0001\uffff\u0001"+
    "\u0074\u0002\u0073\u0001\u0074\u0001\u006c\u0001\u0065\u0002\u002d\u0001"+
    "\uffff\u0001\u0073\u0001\u0063\u0001\u002d\u0001\u0064\u0001\u002d\u0001"+
    "\u0065\u0002\u002d\u0002\uffff\u0001\u0073\u0001\u0069\u0001\u006f\u0001"+
    "\uffff\u0002\u002d\u0002\uffff\u0001\u0073\u0001\uffff\u0001\u002d\u0001"+
    "\u006e\u0001\u0069\u0001\u0074\u0002\uffff\u0001\u0073\u0001\u006f\u0001"+
    "\u0065\u0001\u0074\u0001\u0067\u0002\u0073\u0001\u002d\u0001\uffff\u0001"+
    "\u006e\u0001\uffff\u0001\u0075\u0002\uffff\u0001\u002d\u0001\uffff\u0001"+
    "\u002d\u0001\uffff\u0001\u0073\u0001\uffff\u0001\u0076\u0002\u002d\u0002"+
    "\uffff\u0001\u002d\u0001\u006e\u0001\u002d\u0001\u0074\u0001\u0076\u0001"+
    "\uffff\u0001\u002d\u0001\u0065\u0001\u002d\u0002\uffff\u0001\u0067\u0002"+
    "\u002d\u0001\u0069\u0001\u0068\u0001\u002d\u0001\u0074\u0001\u0065\u0002"+
    "\u002d\u0002\uffff\u0001\u002d\u0001\u0068\u0001\uffff\u0001\u002d\u0001"+
    "\uffff\u0001\u002d\u0002\uffff\u0001\u002d\u0001\u0074\u0001\u0072\u0002"+
    "\uffff\u0001\u0070\u0001\uffff\u0001\u002d\u0001\u006f\u0001\u002d\u0001"+
    "\u0070\u0001\u0072\u0001\u0070\u0002\u002d\u0001\u0074\u0001\u002d\u0001"+
    "\uffff\u0001\u006f\u0001\u0065\u0001\u0073\u0002\uffff\u0002\u0065\u0003"+
    "\uffff\u0001\u002d\u0001\u006e\u0001\uffff\u0001\u002d\u0001\u0065\u0001"+
    "\u002d\u0001\uffff\u0001\u0070\u0001\u0073\u0001\uffff\u0001\u002d\u0002"+
    "\uffff\u0001\u006f\u0001\u0069\u0001\uffff\u0001\u0072\u0001\u006d\u0003"+
    "\uffff\u0001\u002d\u0003\uffff\u0002\u002d\u0001\u0061\u0001\uffff\u0001"+
    "\u006e\u0001\uffff\u0001\u0061\u0001\u006d\u0001\u0061\u0001\u006f\u0002"+
    "\uffff\u0001\u0069\u0001\uffff\u0001\u0064\u0001\u006e\u0001\u0069\u0001"+
    "\u0070\u0001\u002d\u0001\uffff\u0001\u006f\u0001\uffff\u0001\u002d\u0001"+
    "\uffff\u0001\u0061\u0002\u0069\u0001\u006e\u0001\u0070\u0001\u0069\u0001"+
    "\u0065\u0002\uffff\u0001\u0073\u0001\u0063\u0001\u002d\u0001\u0063\u0001"+
    "\u0061\u0002\u0072\u0001\u0063\u0001\u0065\u0001\u0063\u0001\u0062\u0001"+
    "\u0061\u0001\uffff\u0001\u0064\u0001\uffff\u0001\u0072\u0001\u0062\u0001"+
    "\u006e\u0002\u002d\u0001\u0062\u0001\u006e\u0002\u0065\u0001\uffff\u0001"+
    "\u0065\u0001\u0074\u0001\u0061\u0003\u002d\u0001\u0065\u0001\u006c\u0001"+
    "\u0072\u0001\u0065\u0001\u0061\u0001\u006c\u0001\u0073\u0002\uffff\u0001"+
    "\u0075\u0001\u0074\u0001\u006c\u0001\u002d\u0001\u0073\u0001\u002d\u0001"+
    "\u0074\u0001\u0073\u0002\uffff\u0001\u002d\u0001\u0069\u0001\u0061\u0001"+
    "\u002d\u0001\u0074\u0001\u0069\u0002\u0074\u0001\u002d\u0001\u0066\u0001"+
    "\uffff\u0001\u002d\u0001\uffff\u0001\u006f\u0001\u0065\u0001\uffff\u0001"+
    "\u006e\u0001\u0074\u0001\uffff\u0001\u006f\u0001\u006e\u0001\u0072\u0001"+
    "\u0065\u0001\uffff\u0001\u002d\u0001\uffff\u0001\u0072\u0001\u006c\u0001"+
    "\u0067\u0001\u006f\u0001\u0072\u0001\u0067\u0001\u0075\u0001\u002d\u0001"+
    "\uffff\u0001\u002d\u0001\u0066\u0001\u002d\u0001\u0072\u0002\u002d\u0001"+
    "\u0063\u0002\uffff\u0001\u002d\u0001\uffff\u0001\u002d\u0002\uffff\u0001"+
    "\u0074\u0002\uffff\u0001\u0069\u0001\u006f\u0001\u006e\u0001\u002d\u0001"+
    "\uffff",
    DFA19_maxS:
        "\u0001\uffff\u0001\u0074\u0001\u0079\u0002\u006f\u0001\u0078\u0001"+
    "\u0075\u0003\u0074\u0002\u006f\u0002\u0072\u0001\u0065\u0001\u0077\u0001"+
    "\u0079\u0001\u0073\u0001\u0065\u0001\u006f\u0001\u0071\u0001\u0061\u0002"+
    "\u0065\u0001\u0075\u0001\u003a\u0007\uffff\u0002\u003d\u0001\uffff\u0001"+
    "\u0029\u0001\u0023\u0001\uffff\u0001\u003e\u0002\uffff\u0001\u002d\u0001"+
    "\u003f\u0002\u003e\u0001\u0039\u0007\uffff\u0001\u0065\u0001\uffff\u0001"+
    "\u0079\u0002\u007a\u0001\u006c\u0001\u0074\u0001\u0070\u0001\u006f\u0001"+
    "\uffff\u0001\u0073\u0001\u0075\u0001\u007a\u0001\u0066\u0001\u0065\u0001"+
    "\u006e\u0001\u0074\u0001\u0069\u0001\u0075\u0001\u0074\u0001\u0076\u0001"+
    "\u0063\u0001\u0073\u0001\u0070\u0001\u0074\u0001\u007a\u0001\u0065\u0001"+
    "\u0074\u0001\u0072\u0001\u006e\u0001\u0072\u0002\u006f\u0001\u007a\u0001"+
    "\u006f\u0001\u007a\u0001\u0069\u0001\u007a\u0001\u0070\u0002\u007a\u0001"+
    "\u0065\u0001\u0078\u0002\u007a\u0001\u0077\u0001\u0073\u0001\u006e\u0001"+
    "\u006d\u0003\u007a\u0001\u0074\u0002\u007a\u0001\u0063\u0001\u0074\u0001"+
    "\u006f\u0002\u0072\u0001\u0076\u0001\u0074\u0001\u006f\u0001\u006e\u0001"+
    "\u006d\u0001\u0072\u0003\u0069\u0001\u0078\u0001\u0065\u0001\u007a\u0001"+
    "\u0079\u0001\u0070\u0002\u006d\u0001\u006f\u0001\u0070\u0001\u0069\u0002"+
    "\u0072\u0001\u0069\u0001\u0074\u0001\u0069\u0001\u0072\u0001\u0075\u0001"+
    "\u004e\u0001\u0072\u0001\u0079\u0001\u006f\u0001\u007a\u0010\uffff\u0001"+
    "\u0078\u000b\uffff\u0001\u002d\u0001\u007a\u0009\uffff\u0001\u0065\u0007"+
    "\uffff\u0002\u0065\u0001\uffff\u0001\u0065\u0002\u007a\u0001\u0065\u0001"+
    "\uffff\u0001\u0072\u0001\uffff\u0001\u007a\u0001\u0065\u0001\u007a\u0001"+
    "\u0073\u0001\u0065\u0001\u006e\u0001\uffff\u0001\u006f\u0002\u0061\u0001"+
    "\u0074\u0001\u0063\u0001\u006c\u0001\u0063\u0001\u006c\u0001\u006d\u0001"+
    "\u0074\u0001\u0079\u0001\u006e\u0001\u006c\u0001\u0061\u0001\u0063\u0002"+
    "\u0065\u0001\u007a\u0001\u0069\u0001\u0063\u0001\u0066\u0001\u0074\u0001"+
    "\u0075\u0001\u006d\u0001\u0065\u0001\u0074\u0001\u006f\u0001\u007a\u0001"+
    "\u0069\u0001\uffff\u0001\u0072\u0002\u0065\u0001\u0063\u0001\u0074\u0001"+
    "\u006c\u0001\u007a\u0001\u0063\u0001\u0073\u0001\u006d\u0001\u006f\u0001"+
    "\u006e\u0001\u006f\u0001\u0072\u0001\uffff\u0001\u0061\u0001\u0075\u0001"+
    "\uffff\u0001\u0076\u0001\uffff\u0001\u006f\u0001\u0065\u0001\u0074\u0001"+
    "\u006f\u0001\u0069\u0001\u0065\u0002\uffff\u0001\u006d\u0001\u007a\u0001"+
    "\u0074\u0001\u0067\u0001\u0073\u0001\u007a\u0001\u0065\u0002\uffff\u0001"+
    "\u0065\u0001\u0070\u0001\u007a\u0001\u0074\u0001\u0075\u0001\u0065\u0001"+
    "\u0074\u0001\uffff\u0001\u0070\u0001\u0065\u0001\u007a\u0002\uffff\u0001"+
    "\u0069\u0001\u0065\u0001\uffff\u0001\u0079\u0001\uffff\u0001\u0075\u0001"+
    "\u0065\u0001\u0074\u0001\u0076\u0002\u0063\u0001\u0061\u0001\u0075\u0001"+
    "\u0061\u0001\u006c\u0002\u0061\u0001\u0069\u0002\u0065\u0001\u0072\u0001"+
    "\u0066\u0001\u0074\u0001\u0065\u0001\u0072\u0001\u0069\u0001\u006d\u0001"+
    "\u0070\u0001\u0064\u0001\u0074\u0001\u0070\u0001\u0074\u0001\u0073\u0001"+
    "\uffff\u0001\u0061\u0001\u007a\u0001\u0065\u0001\u0062\u0001\u0065\u0001"+
    "\u0071\u0001\u0072\u0001\u0061\u0001\u0065\u0001\u006e\u0001\u0075\u0001"+
    "\u0069\u0001\u0073\u0001\u0072\u0001\u006c\u0001\u0064\u0001\u0068\u0001"+
    "\u0064\u0001\u0067\u0001\u0064\u0001\u0065\u0001\u007a\u0001\u006f\u0001"+
    "\u007a\u0001\u0074\u0004\uffff\u0001\u002d\u0003\uffff\u0001\u0065\u0001"+
    "\u0073\u0002\uffff\u0001\u006e\u0001\u0069\u0001\u0077\u0001\uffff\u0001"+
    "\u0072\u0001\uffff\u0001\u007a\u0001\u002d\u0001\u0064\u0001\u0072\u0001"+
    "\u006b\u0001\u0072\u0002\u007a\u0001\u0068\u0001\u0064\u0001\u006b\u0002"+
    "\u0065\u0001\u0074\u0001\u0069\u0001\u007a\u0001\u0074\u0001\u0061\u0001"+
    "\u006d\u0001\u0075\u0001\u0065\u0001\u0072\u0001\u0074\u0001\uffff\u0001"+
    "\u0074\u0001\u0072\u0001\u0065\u0001\u0061\u0001\u006d\u0001\u0065\u0001"+
    "\u007a\u0001\u0079\u0001\u0064\u0001\uffff\u0001\u0072\u0001\u0079\u0001"+
    "\u0070\u0001\u0072\u0001\u0074\u0001\u007a\u0001\u006f\u0001\u0069\u0001"+
    "\uffff\u0002\u0074\u0001\u007a\u0001\u0070\u0001\u0064\u0001\u0074\u0001"+
    "\u007a\u0001\u0074\u0001\u0070\u0001\u007a\u0002\u0072\u0001\u0061\u0002"+
    "\u0072\u0001\u007a\u0001\u006e\u0001\u0078\u0001\u007a\u0001\uffff\u0001"+
    "\u007a\u0001\u0075\u0001\u0074\u0001\uffff\u0001\u006c\u0001\u0072\u0001"+
    "\u007a\u0001\u006c\u0001\u0066\u0001\uffff\u0001\u007a\u0002\u0073\u0001"+
    "\u007a\u0001\u006e\u0001\u0072\u0001\u007a\u0001\uffff\u0001\u006f\u0001"+
    "\u0072\u0001\u007a\u0001\u0072\u0001\u006e\u0001\u0067\u0003\u0065\u0001"+
    "\u0069\u0002\u0065\u0001\u006d\u0001\u0073\u0001\u0072\u0001\u006d\u0001"+
    "\u0061\u0001\u006c\u0001\u0074\u0001\u0073\u0001\u007a\u0001\u006d\u0001"+
    "\u0065\u0001\u007a\u0001\u0069\u0001\u0065\u0001\u007a\u0001\u006c\u0001"+
    "\u0074\u0001\u0070\u0001\u006d\u0001\u007a\u0001\u0069\u0001\u0063\u0003"+
    "\u007a\u0001\u0061\u0001\u0074\u0001\uffff\u0001\u007a\u0001\u006c\u0001"+
    "\u0073\u0001\u006e\u0001\u0075\u0001\u0064\u0001\u0074\u0001\u0072\u0001"+
    "\u0067\u0001\u0064\u0001\u0065\u0001\u0061\u0001\u0069\u0001\u0065\u0001"+
    "\u007a\u0001\u0065\u0001\u006f\u0001\u007a\u0001\u0063\u0001\u0068\u0001"+
    "\u007a\u0001\u0072\u0001\uffff\u0001\u002d\u0001\uffff\u0001\u007a\u0001"+
    "\uffff\u0001\u0074\u0001\u0064\u0001\u0062\u0001\u0069\u0001\u007a\u0001"+
    "\uffff\u0001\u0075\u0001\u0061\u0001\u0065\u0001\u007a\u0001\u0079\u0001"+
    "\uffff\u0001\u0062\u0001\uffff\u0003\u007a\u0001\u0074\u0001\u0063\u0001"+
    "\u006e\u0001\u0072\u0001\u0078\u0001\u0069\u0002\u006e\u0001\uffff\u0001"+
    "\u007a\u0001\u0072\u0001\u0061\u0001\u006c\u0001\u006e\u0001\u006d\u0001"+
    "\u0065\u0001\u007a\u0001\u0069\u0001\u0072\u0001\u006e\u0001\u0065\u0001"+
    "\u006e\u0001\uffff\u0001\u007a\u0001\u0069\u0001\u0065\u0001\u007a\u0001"+
    "\u0074\u0001\u006e\u0001\u006c\u0001\uffff\u0001\u0077\u0001\u0063\u0001"+
    "\u0067\u0001\u0069\u0001\u007a\u0001\uffff\u0001\u0074\u0002\u007a\u0001"+
    "\uffff\u0001\u0065\u0001\u007a\u0001\uffff\u0001\u0074\u0001\u0069\u0001"+
    "\u006e\u0001\u0074\u0002\u0073\u0001\u0072\u0001\uffff\u0001\u0069\u0001"+
    "\u007a\u0002\uffff\u0001\u0061\u0001\u007a\u0001\u0073\u0001\u0063\u0001"+
    "\uffff\u0001\u0065\u0001\u0079\u0001\uffff\u0001\u002d\u0001\u0070\u0001"+
    "\uffff\u0001\u0068\u0001\u0065\u0001\u007a\u0001\uffff\u0001\u006e\u0001"+
    "\u007a\u0001\uffff\u0001\u0073\u0001\u0074\u0002\u0072\u0001\u0064\u0001"+
    "\u0072\u0001\u006f\u0001\u0073\u0001\u006e\u0001\u0069\u0001\u0065\u0001"+
    "\u006e\u0001\u0065\u0001\u0063\u0002\u0069\u0001\u0066\u0001\uffff\u0001"+
    "\u0061\u0001\u007a\u0001\uffff\u0001\u0074\u0001\u006e\u0001\uffff\u0001"+
    "\u0065\u0001\u007a\u0001\u0074\u0001\u007a\u0001\u0069\u0001\uffff\u0001"+
    "\u006e\u0001\u0068\u0003\uffff\u0001\u0075\u0001\u007a\u0001\u0077\u0001"+
    "\uffff\u0001\u0069\u0002\u007a\u0002\u0065\u0001\u0069\u0001\u0063\u0001"+
    "\u007a\u0001\u0061\u0001\u007a\u0001\u0062\u0001\u006f\u0001\u007a\u0001"+
    "\uffff\u0001\u007a\u0001\u0077\u0001\u0075\u0001\uffff\u0001\u0061\u0001"+
    "\u0074\u0001\u007a\u0001\uffff\u0001\u0079\u0001\u0064\u0003\uffff\u0001"+
    "\u006f\u0001\u0069\u0001\u0075\u0001\u006e\u0001\uffff\u0002\u0072\u0001"+
    "\u007a\u0001\uffff\u0001\u007a\u0001\u006c\u0003\uffff\u0001\u0069\u0002"+
    "\u0074\u0001\u0075\u0002\u0074\u0001\u006e\u0001\u0075\u0001\u0061\u0001"+
    "\uffff\u0001\u0065\u0001\u006c\u0001\u0074\u0001\u0064\u0001\u0069\u0001"+
    "\u007a\u0001\uffff\u0001\u0074\u0001\u0065\u0001\u0063\u0001\u006e\u0001"+
    "\u0074\u0001\u0073\u0001\uffff\u0001\u006e\u0001\u007a\u0001\uffff\u0001"+
    "\u007a\u0001\u0061\u0001\u0079\u0001\u0069\u0001\u0068\u0001\u006e\u0001"+
    "\u006f\u0001\uffff\u0001\u0069\u0002\uffff\u0001\u0073\u0001\u006e\u0001"+
    "\uffff\u0001\u007a\u0001\u0074\u0001\u0063\u0001\u007a\u0001\u0069\u0001"+
    "\u0065\u0001\u0069\u0001\u0074\u0001\uffff\u0001\u0067\u0001\uffff\u0001"+
    "\u007a\u0001\u0061\u0002\u007a\u0001\u0073\u0001\u0061\u0001\u0065\u0001"+
    "\u0073\u0001\uffff\u0001\u007a\u0001\u0064\u0001\u006e\u0001\uffff\u0002"+
    "\u007a\u0001\u0061\u0001\u006e\u0001\u0069\u0001\u0076\u0001\u0075\u0001"+
    "\u0073\u0001\u0074\u0001\u006c\u0003\u007a\u0001\u0065\u0001\u0064\u0001"+
    "\u006f\u0001\u0069\u0001\u007a\u0001\uffff\u0001\u0069\u0001\u0063\u0001"+
    "\u007a\u0001\uffff\u0001\u007a\u0001\uffff\u0001\u006e\u0001\u0067\u0001"+
    "\u007a\u0001\u0072\u0001\uffff\u0001\u0069\u0001\u006e\u0002\uffff\u0001"+
    "\u007a\u0001\u0072\u0001\u006e\u0001\u0061\u0001\uffff\u0001\u0074\u0001"+
    "\uffff\u0001\u006c\u0001\u006e\u0002\uffff\u0001\u007a\u0001\u0074\u0001"+
    "\u0072\u0001\u007a\u0001\uffff\u0001\u007a\u0001\u0069\u0001\u0072\u0001"+
    "\u006e\u0001\u0074\u0001\u0067\u0001\u0069\u0001\u0079\u0002\uffff\u0001"+
    "\u0065\u0001\u006f\u0001\u0069\u0001\u007a\u0001\u0063\u0001\u0069\u0002"+
    "\u007a\u0001\u0073\u0001\u0065\u0001\u006d\u0001\u007a\u0001\u002d\u0001"+
    "\u007a\u0001\u0069\u0001\u006e\u0001\uffff\u0001\u0069\u0001\u006e\u0001"+
    "\u0065\u0001\u0074\u0001\u007a\u0001\u0065\u0001\u0067\u0002\uffff\u0001"+
    "\u006c\u0001\u007a\u0001\u006e\u0002\u007a\u0001\u006e\u0001\u006f\u0001"+
    "\u0074\u0001\u0067\u0001\uffff\u0001\u007a\u0001\u0065\u0001\uffff\u0001"+
    "\u0074\u0001\u0063\u0001\u0074\u0001\u0079\u0001\u0065\u0001\uffff\u0001"+
    "\u0073\u0002\uffff\u0001\u0069\u0001\u0063\u0001\u0072\u0001\u0065\u0001"+
    "\uffff\u0001\u007a\u0001\u0067\u0002\uffff\u0001\u0070\u0001\u002d\u0001"+
    "\u006e\u0001\u0065\u0001\u0073\u0001\u0069\u0001\u007a\u0001\u006c\u0001"+
    "\uffff\u0001\u006e\u0002\uffff\u0001\u007a\u0001\u0061\u0001\u006e\u0002"+
    "\u0065\u0001\uffff\u0001\u0076\u0001\u0065\u0002\uffff\u0001\u0067\u0001"+
    "\u007a\u0001\uffff\u0001\u0075\u0001\u0074\u0001\u0067\u0001\uffff\u0001"+
    "\u0065\u0001\u0067\u0001\u0073\u0002\u0065\u0001\u007a\u0001\uffff\u0001"+
    "\u007a\u0001\u0064\u0002\uffff\u0001\u0067\u0001\u007a\u0001\u0067\u0001"+
    "\u0065\u0002\u007a\u0001\u002d\u0001\u007a\u0001\u006e\u0001\u006f\u0001"+
    "\uffff\u0001\u0074\u0001\u006e\u0002\uffff\u0002\u007a\u0001\u0065\u0001"+
    "\uffff\u0001\u0073\u0001\uffff\u0002\u006e\u0001\u0069\u0001\u0063\u0001"+
    "\u0074\u0002\u007a\u0001\uffff\u0001\u0071\u0002\u007a\u0001\uffff\u0001"+
    "\u0067\u0002\uffff\u0001\u007a\u0001\u006e\u0001\u007a\u0001\u002d\u0001"+
    "\uffff\u0001\u007a\u0001\u0069\u0001\u0074\u0001\u0079\u0002\u007a\u0001"+
    "\u0065\u0001\u0067\u0001\u0065\u0001\u0069\u0001\u0072\u0001\uffff\u0001"+
    "\u007a\u0001\u0068\u0001\u0073\u0001\u0067\u0002\u007a\u0001\u006e\u0001"+
    "\uffff\u0001\u0065\u0001\u0067\u0001\uffff\u0001\u0074\u0002\u0073\u0001"+
    "\u0074\u0001\u006c\u0001\u0065\u0002\u007a\u0001\uffff\u0001\u0073\u0001"+
    "\u0063\u0001\u007a\u0001\u0064\u0001\u007a\u0001\u0065\u0002\u007a\u0002"+
    "\uffff\u0001\u0073\u0001\u0069\u0001\u006f\u0001\uffff\u0002\u007a\u0002"+
    "\uffff\u0001\u0073\u0001\uffff\u0001\u007a\u0001\u006e\u0001\u0069\u0001"+
    "\u0074\u0002\uffff\u0001\u0073\u0001\u006f\u0001\u0065\u0001\u0074\u0001"+
    "\u0067\u0002\u0073\u0001\u007a\u0001\uffff\u0001\u006e\u0001\uffff\u0001"+
    "\u0075\u0002\uffff\u0001\u007a\u0001\uffff\u0001\u007a\u0001\uffff\u0001"+
    "\u0073\u0001\uffff\u0001\u0076\u0002\u007a\u0002\uffff\u0001\u007a\u0001"+
    "\u006e\u0001\u007a\u0001\u0074\u0001\u0076\u0001\uffff\u0001\u007a\u0001"+
    "\u0065\u0001\u007a\u0002\uffff\u0001\u0067\u0002\u007a\u0001\u0069\u0001"+
    "\u0068\u0001\u007a\u0001\u0074\u0001\u0065\u0002\u007a\u0002\uffff\u0001"+
    "\u007a\u0001\u0068\u0001\uffff\u0001\u007a\u0001\uffff\u0001\u007a\u0002"+
    "\uffff\u0001\u007a\u0001\u0074\u0001\u0072\u0002\uffff\u0001\u0070\u0001"+
    "\uffff\u0001\u007a\u0001\u006f\u0001\u007a\u0001\u0070\u0001\u0072\u0001"+
    "\u0070\u0002\u007a\u0001\u0074\u0001\u007a\u0001\uffff\u0001\u006f\u0001"+
    "\u0065\u0001\u0073\u0002\uffff\u0002\u0065\u0003\uffff\u0001\u007a\u0001"+
    "\u006e\u0001\uffff\u0001\u007a\u0001\u0065\u0001\u007a\u0001\uffff\u0001"+
    "\u0070\u0001\u0073\u0001\uffff\u0001\u002d\u0002\uffff\u0001\u006f\u0001"+
    "\u0069\u0001\uffff\u0001\u0072\u0001\u006d\u0003\uffff\u0001\u007a\u0003"+
    "\uffff\u0001\u007a\u0001\u002d\u0001\u0061\u0001\uffff\u0001\u006e\u0001"+
    "\uffff\u0001\u0061\u0001\u006d\u0001\u0061\u0001\u006f\u0002\uffff\u0001"+
    "\u0069\u0001\uffff\u0001\u0064\u0001\u006e\u0001\u0069\u0001\u0070\u0001"+
    "\u007a\u0001\uffff\u0001\u006f\u0001\uffff\u0001\u007a\u0001\uffff\u0001"+
    "\u0061\u0002\u0069\u0001\u006e\u0001\u0070\u0001\u0069\u0001\u0065\u0002"+
    "\uffff\u0001\u0073\u0001\u0063\u0001\u007a\u0001\u0063\u0001\u0061\u0002"+
    "\u0072\u0001\u0063\u0001\u0065\u0001\u0063\u0001\u0062\u0001\u0061\u0001"+
    "\uffff\u0001\u0064\u0001\uffff\u0001\u0072\u0001\u0062\u0001\u006e\u0002"+
    "\u007a\u0001\u0062\u0001\u006e\u0002\u0065\u0001\uffff\u0001\u0065\u0001"+
    "\u0074\u0001\u0061\u0001\u002d\u0002\u007a\u0001\u0065\u0001\u006c\u0001"+
    "\u0072\u0001\u0065\u0001\u0061\u0001\u006c\u0001\u0073\u0002\uffff\u0001"+
    "\u0075\u0001\u0074\u0001\u006c\u0001\u007a\u0001\u0073\u0001\u007a\u0001"+
    "\u0074\u0001\u0073\u0002\uffff\u0001\u007a\u0001\u0069\u0001\u0061\u0001"+
    "\u007a\u0001\u0074\u0001\u0069\u0002\u0074\u0001\u007a\u0001\u0066\u0001"+
    "\uffff\u0001\u007a\u0001\uffff\u0001\u006f\u0001\u0065\u0001\uffff\u0001"+
    "\u006e\u0001\u0074\u0001\uffff\u0001\u006f\u0001\u006e\u0001\u0072\u0001"+
    "\u0065\u0001\uffff\u0001\u007a\u0001\uffff\u0001\u0072\u0001\u006c\u0001"+
    "\u0067\u0001\u006f\u0001\u0072\u0001\u0067\u0001\u0075\u0001\u007a\u0001"+
    "\uffff\u0001\u007a\u0001\u0066\u0001\u007a\u0001\u0072\u0002\u007a\u0001"+
    "\u0063\u0002\uffff\u0001\u007a\u0001\uffff\u0001\u007a\u0002\uffff\u0001"+
    "\u0074\u0002\uffff\u0001\u0069\u0001\u006f\u0001\u006e\u0001\u007a\u0001"+
    "\uffff",
    DFA19_acceptS:
        "\u001a\uffff\u0001\u00cf\u0001\u00d0\u0001\u00d1\u0001\u00d2\u0001"+
    "\u00d3\u0001\u00d4\u0001\u00d5\u0002\uffff\u0001\u00d8\u0002\uffff\u0001"+
    "\u00db\u0001\uffff\u0001\u00dd\u0001\u00de\u0005\uffff\u0001\u00ee\u0001"+
    "\u00ef\u0001\u00f6\u0001\u00f9\u0001\u00fa\u0001\u00fb\u0001\u00fc\u0001"+
    "\uffff\u0001\u0104\u0007\uffff\u0001\u00fb\u0051\uffff\u0001\u0103\u0001"+
    "\u00ce\u0001\u00cf\u0001\u00d0\u0001\u00d1\u0001\u00d2\u0001\u00d3\u0001"+
    "\u00d4\u0001\u00d5\u0001\u00d6\u0001\u00eb\u0001\u00ea\u0001\u00d7\u0001"+
    "\u00d8\u0001\u00f1\u0001\u00d9\u0001\uffff\u0001\u00da\u0001\u00db\u0001"+
    "\u00f5\u0001\u00dc\u0001\u00dd\u0001\u00de\u0001\u00f3\u0001\u00df\u0001"+
    "\u00e2\u0001\u00e4\u0001\u00ed\u0002\uffff\u0001\u00e0\u0001\u00e3\u0001"+
    "\u00e5\u0001\u00e1\u0001\u00e7\u0001\u00ec\u0001\u00e6\u0001\u00e9\u0001"+
    "\u00e8\u0001\uffff\u0001\u00ee\u0001\u00ef\u0001\u00f6\u0001\u00f9\u0001"+
    "\u00fa\u0001\u00fc\u0001\u0100\u0002\uffff\u0001\u0102\u0004\uffff\u0001"+
    "\u0004\u0001\uffff\u0001\u0006\u0006\uffff\u0001\u000a\u001d\uffff\u0001"+
    "\u0020\u000e\uffff\u0001\u0028\u0002\uffff\u0001\u002a\u0001\uffff\u0001"+
    "\u002c\u0006\uffff\u0001\u002e\u0001\u0032\u0007\uffff\u0001\u0035\u0001"+
    "\u0038\u0007\uffff\u0001\u003c\u0003\uffff\u0001\u00a3\u0001\u0040\u0002"+
    "\uffff\u0001\u0042\u0001\uffff\u0001\u00c8\u001c\uffff\u0001\u0057\u0019"+
    "\uffff\u0001\u00f0\u0001\u00fd\u0001\u00f8\u0001\u00f7\u0001\uffff\u0001"+
    "\u00f4\u0001\u00ff\u0001\u0101\u0002\uffff\u0001\u0003\u0001\u0091\u0003"+
    "\uffff\u0001\u0090\u0001\uffff\u0001\u00cb\u0017\uffff\u0001\u0018\u0009"+
    "\uffff\u0001\u0069\u0008\uffff\u0001\u0026\u0013\uffff\u0001\u0034\u0003"+
    "\uffff\u0001\u0037\u0005\uffff\u0001\u0039\u0007\uffff\u0001\u00a4\u0027"+
    "\uffff\u0001\u0079\u0016\uffff\u0001\u006f\u0001\uffff\u0001\u00c7\u0007"+
    "\uffff\u0001\u00cc\u0005\uffff\u0001\u000b\u0001\uffff\u0001\u000c\u000b"+
    "\uffff\u0001\u0081\u000d\uffff\u0001\u001c\u0007\uffff\u0001\u00bc\u0005"+
    "\uffff\u0001\u0099\u0003\uffff\u0001\u009d\u0002\uffff\u0001\u002b\u0007"+
    "\uffff\u0001\u0085\u0002\uffff\u0001\u0033\u0001\u0086\u0004\uffff\u0001"+
    "\u00bd\u0002\uffff\u0001\u00a2\u0002\uffff\u0001\u0070\u0003\uffff\u0001"+
    "\u003f\u0002\uffff\u0001\u0071\u0011\uffff\u0001\u00aa\u0002\uffff\u0001"+
    "\u0050\u0002\uffff\u0001\u0051\u0005\uffff\u0001\u00b0\u0002\uffff\u0001"+
    "\u008c\u0001\u0055\u0001\u0056\u0003\uffff\u0001\u007b\u000d\uffff\u0001"+
    "\u007c\u0003\uffff\u0001\u008f\u0003\uffff\u0001\u00b8\u0002\uffff\u0001"+
    "\u00cd\u0001\u00f2\u0001\u00fe\u0004\uffff\u0001\u007f\u0003\uffff\u0001"+
    "\u00ba\u0002\uffff\u0001\u0062\u0001\u000e\u0001\u00c0\u0009\uffff\u0001"+
    "\u0064\u0006\uffff\u0001\u0068\u0006\uffff\u0001\u001d\u0002\uffff\u0001"+
    "\u0021\u0007\uffff\u0001\u0083\u0001\uffff\u0001\u009b\u0001\u009c\u0002"+
    "\uffff\u0001\u006a\u0008\uffff\u0001\u00c5\u0001\uffff\u0001\u0036\u0008"+
    "\uffff\u0001\u0088\u0003\uffff\u0001\u0043\u0012\uffff\u0001\u00ab\u0003"+
    "\uffff\u0001\u0077\u0001\uffff\u0001\u0054\u0004\uffff\u0001\u0058\u0002"+
    "\uffff\u0001\u00b2\u0001\u005a\u0004\uffff\u0001\u00b4\u0001\uffff\u0001"+
    "\u008e\u0002\uffff\u0001\u005f\u0001\u00bf\u0004\uffff\u0001\u00b9\u0008"+
    "\uffff\u0001\u0080\u0001\u00ca\u0010\uffff\u0001\u0082\u0007\uffff\u0001"+
    "\u0097\u0001\u0022\u0009\uffff\u0001\u002d\u0002\uffff\u0001\u0084\u0005"+
    "\uffff\u0001\u00a0\u0001\uffff\u0001\u003a\u0001\u0087\u0004\uffff\u0001"+
    "\u0041\u0002\uffff\u0001\u00a5\u0001\u0046\u0008\uffff\u0001\u00a8\u0001"+
    "\uffff\u0001\u004b\u0001\u0089\u0005\uffff\u0001\u004d\u0002\uffff\u0001"+
    "\u0052\u0001\u0053\u0002\uffff\u0001\u0078\u0003\uffff\u0001\u00c9\u0006"+
    "\uffff\u0001\u007d\u0002\uffff\u0001\u00b5\u0001\u0060\u000a\uffff\u0001"+
    "\u0010\u0002\uffff\u0001\u0063\u0001\u0093\u0003\uffff\u0001\u0013\u0001"+
    "\uffff\u0001\u0014\u0007\uffff\u0001\u001b\u0003\uffff\u0001\u0098\u0001"+
    "\uffff\u0001\u00c3\u0001\u00c4\u0004\uffff\u0001\u002f\u000b\uffff\u0001"+
    "\u0044\u0007\uffff\u0001\u0073\u0002\uffff\u0001\u008a\u0008\uffff\u0001"+
    "\u0076\u0008\uffff\u0001\u005e\u0001\u00b7\u0003\uffff\u0001\u0001\u0002"+
    "\uffff\u0001\u0061\u0001\u0008\u0001\uffff\u0001\u000d\u0004\uffff\u0001"+
    "\u0092\u0001\u00bb\u0008\uffff\u0001\u0096\u0001\uffff\u0001\u0019\u0001"+
    "\uffff\u0001\u001f\u0001\u0023\u0001\uffff\u0001\u0027\u0001\uffff\u0001"+
    "\u0029\u0001\uffff\u0001\u0030\u0003\uffff\u0001\u006c\u0001\u009f\u0005"+
    "\uffff\u0001\u0045\u0003\uffff\u0001\u0049\u0001\u0075\u000a\uffff\u0001"+
    "\u00ad\u0001\u00af\u0002\uffff\u0001\u007a\u0001\uffff\u0001\u008d\u0001"+
    "\uffff\u0001\u005c\u0001\u005d\u0003\uffff\u0001\u0005\u0001\u0007\u0001"+
    "\uffff\u0001\u000f\u000a\uffff\u0001\u0095\u0003\uffff\u0001\u0024\u0001"+
    "\u009a\u0002\uffff\u0001\u0031\u0001\u00c6\u0001\u00a1\u0002\uffff\u0001"+
    "\u003b\u0003\uffff\u0001\u00a6\u0002\uffff\u0001\u0047\u0001\uffff\u0001"+
    "\u0074\u0001\u00be\u0002\uffff\u0001\u004c\u0002\uffff\u0001\u00ac\u0001"+
    "\u00ae\u0001\u00b1\u0001\uffff\u0001\u005b\u0001\u00b3\u0001\u00b6\u0003"+
    "\uffff\u0001\u00c1\u0001\uffff\u0001\u00c2\u0004\uffff\u0001\u0015\u0001"+
    "\u0017\u0001\uffff\u0001\u0094\u0005\uffff\u0001\u006d\u0001\uffff\u0001"+
    "\u003d\u0001\uffff\u0001\u00a7\u0007\uffff\u0001\u0059\u0001\u007e\u000c"+
    "\uffff\u0001\u009e\u0001\uffff\u0001\u003e\u0009\uffff\u0001\u0011\u000d"+
    "\uffff\u0001\u008b\u0001\u00a9\u0008\uffff\u0001\u0067\u0001\u001a\u000a"+
    "\uffff\u0001\u0009\u0001\uffff\u0001\u0065\u0002\uffff\u0001\u001e\u0002"+
    "\uffff\u0001\u006e\u0004\uffff\u0001\u004f\u0001\uffff\u0001\u0012\u0008"+
    "\uffff\u0001\u0002\u0007\uffff\u0001\u004e\u0001\u0066\u0001\uffff\u0001"+
    "\u0025\u0001\uffff\u0001\u0072\u0001\u0048\u0001\uffff\u0001\u0016\u0001"+
    "\u006b\u0004\uffff\u0001\u004a",
    DFA19_specialS:
        "\u0001\u0001\u0018\uffff\u0001\u0000\u01e7\uffff\u0001\u0002\u02e5"+
    "\uffff}>",
    DFA19_transitionS: [
            "\u0009\u0037\u0002\u0035\u0002\u0037\u0001\u0035\u0012\u0037"+
            "\u0001\u0035\u0001\u0022\u0001\u0033\u0001\u0024\u0001\u001b"+
            "\u0001\u0023\u0001\u0025\u0001\u0032\u0001\u0019\u0001\u001a"+
            "\u0001\u0028\u0001\u0029\u0001\u0026\u0001\u002a\u0001\u002e"+
            "\u0001\u002d\u000a\u0036\u0001\u0021\u0001\u002f\u0001\u002b"+
            "\u0001\u0020\u0001\u002c\u0001\u0027\u0001\u0031\u000d\u0034"+
            "\u0001\u0015\u000c\u0034\u0001\u001e\u0001\u0037\u0001\u001f"+
            "\u0001\u0037\u0001\u0034\u0001\u0037\u0001\u0001\u0001\u0002"+
            "\u0001\u0003\u0001\u0004\u0001\u0005\u0001\u0006\u0001\u0007"+
            "\u0001\u0034\u0001\u0008\u0001\u0034\u0001\u0017\u0001\u0009"+
            "\u0001\u000a\u0001\u000b\u0001\u000c\u0001\u000d\u0001\u0018"+
            "\u0001\u000e\u0001\u000f\u0001\u0010\u0001\u0011\u0001\u0012"+
            "\u0001\u0013\u0001\u0014\u0001\u0034\u0001\u0016\u0001\u001c"+
            "\u0001\u0030\u0001\u001d\uff82\u0037",
            "\u0001\u003c\u0005\uffff\u0001\u003b\u0001\u003d\u0001\u0038"+
            "\u0001\uffff\u0001\u003e\u0002\uffff\u0001\u0039\u0001\u003a",
            "\u0001\u0040\u0003\uffff\u0001\u0043\u0003\uffff\u0001\u0045"+
            "\u0005\uffff\u0001\u0041\u0002\uffff\u0001\u0044\u0006\uffff"+
            "\u0001\u0042",
            "\u0001\u0046\u0006\uffff\u0001\u0047\u0006\uffff\u0001\u0048",
            "\u0001\u0049\u0003\uffff\u0001\u004a\u0005\uffff\u0001\u004b",
            "\u0001\u004c\u0001\u004d\u0001\u004e\u0002\uffff\u0001\u004f"+
            "\u0004\uffff\u0001\u0050\u0001\uffff\u0001\u0051",
            "\u0001\u0054\u0005\uffff\u0001\u0052\u0002\uffff\u0001\u0055"+
            "\u0001\uffff\u0001\u0056\u0001\u0053",
            "\u0001\u0057\u000c\uffff\u0001\u0058\u0001\uffff\u0001\u0059",
            "\u0001\u005a\u0001\uffff\u0001\u005b\u0006\uffff\u0001\u005c"+
            "\u0001\u005d\u0004\uffff\u0001\u005e\u0001\u005f",
            "\u0001\u0060\u0003\uffff\u0001\u0061\u0009\uffff\u0001\u0063"+
            "\u0004\uffff\u0001\u0062",
            "\u0001\u0065\u0005\uffff\u0001\u0064",
            "\u0001\u0066\u0003\uffff\u0001\u0067\u0009\uffff\u0001\u0068",
            "\u0001\u006d\u0002\uffff\u0001\u0069\u0007\uffff\u0001\u006c"+
            "\u0001\uffff\u0001\u006a\u0001\uffff\u0001\u006b",
            "\u0001\u006e\u0003\uffff\u0001\u0070\u0002\uffff\u0001\u0071"+
            "\u0009\uffff\u0001\u006f",
            "\u0001\u0072",
            "\u0001\u0073\u0001\uffff\u0001\u0074\u0001\uffff\u0001\u0075"+
            "\u0005\uffff\u0001\u007a\u0001\u0078\u0002\uffff\u0001\u0076"+
            "\u0004\uffff\u0001\u0077\u0002\uffff\u0001\u0079",
            "\u0001\u007b\u0002\uffff\u0001\u007c\u0001\u0081\u0005\uffff"+
            "\u0001\u007d\u0002\uffff\u0001\u007e\u0002\uffff\u0001\u0080"+
            "\u0003\uffff\u0001\u007f",
            "\u0001\u0082\u0001\uffff\u0001\u0083\u0002\uffff\u0001\u0084",
            "\u0001\u0085\u0003\uffff\u0001\u0086",
            "\u0001\u0089\u0002\uffff\u0001\u0087\u0001\u0088\u0005\uffff"+
            "\u0001\u008a",
            "\u0001\u008b",
            "\u0001\u008c",
            "\u0001\u008d",
            "\u0001\u008e",
            "\u0001\u008f",
            "\u0001\u0090\u0016\uffff\u0001\u0091",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "\u0001\u009b\u0002\uffff\u0001\u009a",
            "\u0001\u009d",
            "",
            "\u0001\u009f",
            "\u0001\u00a1",
            "",
            "\u0001\u00a4",
            "",
            "",
            "\u0001\u00a8",
            "\u0001\u00ad\u000d\uffff\u0001\u00ac\u000c\uffff\u0001\u00ab"+
            "\u0001\u00aa\u0001\uffff\u0001\u00ae",
            "\u0001\u00b0\u0001\u00b1",
            "\u0001\u00b3\u000e\uffff\u0001\u00b4",
            "\u0001\u00b6\u0001\uffff\u000a\u00b8",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "\u0001\u00c1\u0001\uffff\u000a\u00c0\u000b\uffff\u0001\u00c2"+
            "\u001f\uffff\u0001\u00c2",
            "",
            "\u0001\u00c3\u0001\u00c4\u0014\uffff\u0001\u00c5",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u0002\u003f\u0001\u00c6"+
            "\u0017\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u0013\u003f\u0001\u00c8"+
            "\u0006\u003f",
            "\u0001\u00ca",
            "\u0001\u00cb",
            "\u0001\u00cc",
            "\u0001\u00cd",
            "",
            "\u0001\u00ce",
            "\u0001\u00cf",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u00d1",
            "\u0001\u00d2",
            "\u0001\u00d3",
            "\u0001\u00d4\u0001\u00d5",
            "\u0001\u00d7\u0003\uffff\u0001\u00d6",
            "\u0001\u00d8\u0001\u00d9\u0001\u00da\u0001\uffff\u0001\u00db"+
            "\u0004\uffff\u0001\u00dc",
            "\u0001\u00dd\u0002\uffff\u0001\u00de\u0005\uffff\u0001\u00e1"+
            "\u0006\uffff\u0001\u00df\u0001\u00e0",
            "\u0001\u00e4\u0004\uffff\u0001\u00e5\u0001\u00e3\u000b\uffff"+
            "\u0001\u00e6\u0002\uffff\u0001\u00e2",
            "\u0001\u00e7",
            "\u0001\u00e8\u000d\uffff\u0001\u00e9",
            "\u0001\u00ea",
            "\u0001\u00eb\u0001\u00ec\u000f\uffff\u0001\u00ed",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u00ef",
            "\u0001\u00f2\u0001\uffff\u0001\u00f0\u0005\uffff\u0001\u00f3"+
            "\u000a\uffff\u0001\u00f1",
            "\u0001\u00f4\u0005\uffff\u0001\u00f5",
            "\u0001\u00f6",
            "\u0001\u00f7",
            "\u0001\u00f8",
            "\u0001\u00f9\u0033\uffff\u0001\u00fa\u000c\uffff\u0001\u00fb"+
            "\u0001\u00fc",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u00fe\u0009\uffff\u0001\u00ff",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0101",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0103",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u0003\u003f\u0001\u0108"+
            "\u0001\u003f\u0001\u0107\u0001\u003f\u0001\u0104\u000a\u003f"+
            "\u0001\u0105\u0001\u0106\u0006\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u010b",
            "\u0001\u010e\u0004\uffff\u0001\u010d\u0004\uffff\u0001\u010c",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u0001\u010f\u0012\u003f"+
            "\u0001\u0110\u0001\u003f\u0001\u0111\u0004\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0115\u0007\uffff\u0001\u0114",
            "\u0001\u0116\u000e\uffff\u0001\u0117",
            "\u0001\u0118",
            "\u0001\u0119",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u0017\u003f\u0001\u011a"+
            "\u0002\u003f",
            "\u0001\u011c\u0001\u003f\u0001\uffff\u000a\u003f\u0007\uffff"+
            "\u001a\u003f\u0004\uffff\u0001\u003f\u0001\uffff\u0003\u003f"+
            "\u0001\u011d\u000f\u003f\u0001\u011e\u0006\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0121",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u0003\u003f\u0001\u0122"+
            "\u0016\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u000b\u003f\u0001\u0124"+
            "\u000e\u003f",
            "\u0001\u0126",
            "\u0001\u0127\u0001\uffff\u0001\u0128",
            "\u0001\u0129\u0009\uffff\u0001\u012a",
            "\u0001\u012b",
            "\u0001\u012c",
            "\u0001\u0131\u0001\uffff\u0001\u012e\u0001\uffff\u0001\u012f"+
            "\u0003\uffff\u0001\u012d\u0001\uffff\u0001\u0130",
            "\u0001\u0133\u0006\uffff\u0001\u0132",
            "\u0001\u0134\u0006\uffff\u0001\u0135",
            "\u0001\u0136\u0001\uffff\u0001\u0137",
            "\u0001\u0138",
            "\u0001\u0139\u0003\uffff\u0001\u013b\u0009\uffff\u0001\u013c"+
            "\u0002\uffff\u0001\u013a",
            "\u0001\u013d",
            "\u0001\u013e",
            "\u0001\u013f",
            "\u0001\u0140",
            "\u0001\u0141",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0143\u0013\uffff\u0001\u0144",
            "\u0001\u0145",
            "\u0001\u0146",
            "\u0001\u0147",
            "\u0001\u0148\u0005\uffff\u0001\u0149",
            "\u0001\u014a\u000b\uffff\u0001\u014b",
            "\u0001\u014c",
            "\u0001\u014d\u0005\uffff\u0001\u014e",
            "\u0001\u014f",
            "\u0001\u0150\u0003\uffff\u0001\u0151",
            "\u0001\u0154\u0001\uffff\u0001\u0152\u0005\uffff\u0001\u0153",
            "\u0001\u0155",
            "\u0001\u0156",
            "\u0001\u0157",
            "\u0001\u0158",
            "\u0001\u0159",
            "\u0001\u015a",
            "\u0001\u015b",
            "\u0002\u015d\u0002\uffff\u0001\u015d\u0012\uffff\u0001\u015d"+
            "\u0020\uffff\u001a\u015d\u0004\uffff\u0001\u015d\u0001\uffff"+
            "\u001a\u015d",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "\u0001\u015e",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "\u0001\u0160",
            "\u0002\u0162\u0002\uffff\u0001\u0162\u0012\uffff\u0001\u0162"+
            "\u0020\uffff\u001a\u0162\u0004\uffff\u0001\u0162\u0001\uffff"+
            "\u001a\u0162",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "\u000a\u00b8\u000b\uffff\u0001\u00c2\u001f\uffff\u0001\u00c2",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "\u0001\u00c1\u0001\uffff\u000a\u00c0\u000b\uffff\u0001\u00c2"+
            "\u001f\uffff\u0001\u00c2",
            "\u000a\u0164\u000b\uffff\u0001\u00c2\u001f\uffff\u0001\u00c2",
            "",
            "\u0001\u0165",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0168",
            "",
            "\u0001\u0169",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u000e\u003f\u0001\u016a"+
            "\u000b\u003f",
            "\u0001\u016c",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u016e",
            "\u0001\u016f",
            "\u0001\u0170",
            "",
            "\u0001\u0171",
            "\u0001\u0172",
            "\u0001\u0173",
            "\u0001\u0174\u000e\uffff\u0001\u0175",
            "\u0001\u0176",
            "\u0001\u0177",
            "\u0001\u0178",
            "\u0001\u0179",
            "\u0001\u017a",
            "\u0001\u017b\u0001\u017c",
            "\u0001\u017d",
            "\u0001\u017e",
            "\u0001\u0180\u0002\uffff\u0001\u017f",
            "\u0001\u0181",
            "\u0001\u0182",
            "\u0001\u0183",
            "\u0001\u0184",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0186",
            "\u0001\u0187",
            "\u0001\u0188",
            "\u0001\u0189",
            "\u0001\u018a",
            "\u0001\u018b",
            "\u0001\u018c",
            "\u0001\u018d",
            "\u0001\u018e",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0190",
            "",
            "\u0001\u0191",
            "\u0001\u0192",
            "\u0001\u0193",
            "\u0001\u0194",
            "\u0001\u0195",
            "\u0001\u0196",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u0004\u003f\u0001\u0197"+
            "\u0015\u003f",
            "\u0001\u0199",
            "\u0001\u019a",
            "\u0001\u019b",
            "\u0001\u019c",
            "\u0001\u019d",
            "\u0001\u019e",
            "\u0001\u019f",
            "",
            "\u0001\u01a0",
            "\u0001\u01a1",
            "",
            "\u0001\u01a2",
            "",
            "\u0001\u01a3",
            "\u0001\u01a4",
            "\u0001\u01a6\u000e\uffff\u0001\u01a5",
            "\u0001\u01a7\u0009\uffff\u0001\u01a8",
            "\u0001\u01a9",
            "\u0001\u01aa",
            "",
            "",
            "\u0001\u01ab",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u01ad",
            "\u0001\u01ae",
            "\u0001\u01af",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u01b1",
            "",
            "",
            "\u0001\u01b2",
            "\u0001\u01b3",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u0008\u003f\u0001\u01b5"+
            "\u000b\u003f\u0001\u01b4\u0005\u003f",
            "\u0001\u01b7",
            "\u0001\u01b8",
            "\u0001\u01b9",
            "\u0001\u01ba",
            "",
            "\u0001\u01bb\u0006\uffff\u0001\u01bc",
            "\u0001\u01bd",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "",
            "\u0001\u01bf",
            "\u0001\u01c0",
            "",
            "\u0001\u01c1",
            "",
            "\u0001\u01c2",
            "\u0001\u01c4\u0003\uffff\u0001\u01c3",
            "\u0001\u01c5",
            "\u0001\u01c6\u000f\uffff\u0001\u01c7\u0002\uffff\u0001\u01c8",
            "\u0001\u01c9",
            "\u0001\u01cb\u0035\uffff\u0001\u01ca",
            "\u0001\u01cc",
            "\u0001\u01cd",
            "\u0001\u01ce",
            "\u0001\u01cf",
            "\u0001\u01d0",
            "\u0001\u01d1",
            "\u0001\u01d2",
            "\u0001\u01d3",
            "\u0001\u01d4",
            "\u0001\u01d5",
            "\u0001\u01d6",
            "\u0001\u01d7\u0001\u01d8",
            "\u0001\u01d9",
            "\u0001\u01da\u000f\uffff\u0001\u01db",
            "\u0001\u01dc",
            "\u0001\u01dd",
            "\u0001\u01de",
            "\u0001\u01df",
            "\u0001\u01e0",
            "\u0001\u01e1",
            "\u0001\u01e2",
            "\u0001\u01e3\u0004\uffff\u0001\u01e4",
            "",
            "\u0001\u01e5",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u01e7",
            "\u0001\u01e8",
            "\u0001\u01e9",
            "\u0001\u01ea\u0001\uffff\u0001\u01eb",
            "\u0001\u01ec",
            "\u0001\u01ed",
            "\u0001\u01ee",
            "\u0001\u01ef",
            "\u0001\u01f0\u000b\uffff\u0001\u01f1",
            "\u0001\u01f2",
            "\u0001\u01f3",
            "\u0001\u01f5\u0003\uffff\u0001\u01f4",
            "\u0001\u01f6",
            "\u0001\u01f7",
            "\u0001\u01f8",
            "\u0001\u01f9",
            "\u0001\u01fa",
            "\u0001\u01fb",
            "\u0001\u01fc",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u01fe",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0200",
            "",
            "",
            "",
            "",
            "\u0001\u0201",
            "",
            "",
            "",
            "\u000a\u0164\u000b\uffff\u0001\u00c2\u001f\uffff\u0001\u00c2",
            "\u0001\u0202",
            "",
            "",
            "\u0001\u0203",
            "\u0001\u0204",
            "\u0001\u0205",
            "",
            "\u0001\u0206",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0208",
            "\u0001\u0209",
            "\u0001\u020a",
            "\u0001\u020b",
            "\u0001\u020c",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u0001\u020e\u0019\u003f",
            "\u0001\u0210",
            "\u0001\u0211",
            "\u0001\u0212",
            "\u0001\u0213\u0003\uffff\u0001\u0214",
            "\u0001\u0215",
            "\u0001\u0216",
            "\u0001\u0218\u0003\uffff\u0001\u0217\u0003\uffff\u0001\u0219",
            "\u0001\u021a\u0001\u003f\u0001\uffff\u000a\u003f\u0007\uffff"+
            "\u001a\u003f\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u021c",
            "\u0001\u021d",
            "\u0001\u021e",
            "\u0001\u021f",
            "\u0001\u0220",
            "\u0001\u0221",
            "\u0001\u0222",
            "",
            "\u0001\u0223",
            "\u0001\u0224",
            "\u0001\u0225",
            "\u0001\u0226",
            "\u0001\u0227",
            "\u0001\u0228",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u022a",
            "\u0001\u022b",
            "",
            "\u0001\u022c",
            "\u0001\u022d",
            "\u0001\u022e",
            "\u0001\u022f",
            "\u0001\u0230",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0232",
            "\u0001\u0233\u0007\uffff\u0001\u0234",
            "",
            "\u0001\u0235",
            "\u0001\u0236",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0238",
            "\u0001\u0239",
            "\u0001\u023a",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u023c",
            "\u0001\u023d",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u023f",
            "\u0001\u0240",
            "\u0001\u0241",
            "\u0001\u0243\u0003\uffff\u0001\u0242",
            "\u0001\u0245\u000a\uffff\u0001\u0244",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0247",
            "\u0001\u0248",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u024b",
            "\u0001\u024c",
            "",
            "\u0001\u024d",
            "\u0001\u024e",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0250",
            "\u0001\u0251",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0253",
            "\u0001\u0254",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0256",
            "\u0001\u0257",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u0012\u003f\u0001\u0258"+
            "\u0007\u003f",
            "",
            "\u0001\u025a",
            "\u0001\u025b",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u025d",
            "\u0001\u025e",
            "\u0001\u025f",
            "\u0001\u0260",
            "\u0001\u0261",
            "\u0001\u0262",
            "\u0001\u0263",
            "\u0001\u0264",
            "\u0001\u0265",
            "\u0001\u0266",
            "\u0001\u0267",
            "\u0001\u0268",
            "\u0001\u0269",
            "\u0001\u026a",
            "\u0001\u026b",
            "\u0001\u026c",
            "\u0001\u026d",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u026f",
            "\u0001\u0270",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0272",
            "\u0001\u0273",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0275",
            "\u0001\u0276",
            "\u0001\u0277\u000c\uffff\u0001\u0278",
            "\u0001\u0279",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u027b",
            "\u0001\u027c",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0280",
            "\u0001\u0281",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u0012\u003f\u0001\u0282"+
            "\u0007\u003f",
            "\u0001\u0284",
            "\u0001\u0285",
            "\u0001\u0286",
            "\u0001\u0287",
            "\u0001\u0288",
            "\u0001\u0289",
            "\u0001\u028a",
            "\u0001\u028b",
            "\u0001\u028c",
            "\u0001\u028d",
            "\u0001\u028e",
            "\u0001\u028f",
            "\u0001\u0290",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0292",
            "\u0001\u0293",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u000e\u003f\u0001\u0294"+
            "\u000b\u003f",
            "\u0001\u0296",
            "\u0001\u0297",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u0012\u003f\u0001\u0298"+
            "\u0007\u003f",
            "\u0001\u029a",
            "",
            "\u0001\u029b",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0000\u029e",
            "\u0001\u029f",
            "\u0001\u02a0",
            "\u0001\u02a1",
            "\u0001\u02a2",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0001\u02a4",
            "\u0001\u02a5",
            "\u0001\u02a6",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u02a8",
            "",
            "\u0001\u02a9",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u02ad",
            "\u0001\u02ae",
            "\u0001\u02af",
            "\u0001\u02b0",
            "\u0001\u02b2\u0009\uffff\u0001\u02b1",
            "\u0001\u02b3",
            "\u0001\u02b4",
            "\u0001\u02b5",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u02b7",
            "\u0001\u02b8",
            "\u0001\u02b9",
            "\u0001\u02ba",
            "\u0001\u02bb",
            "\u0001\u02bc",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u02be",
            "\u0001\u02bf",
            "\u0001\u02c0",
            "\u0001\u02c1",
            "\u0001\u02c2",
            "",
            "\u0001\u02c3\u0001\u003f\u0001\uffff\u000a\u003f\u0007\uffff"+
            "\u001a\u003f\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u02c5",
            "\u0001\u02c6",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u02c8",
            "\u0001\u02c9",
            "\u0001\u02ca",
            "",
            "\u0001\u02cb",
            "\u0001\u02cc",
            "\u0001\u02cd",
            "\u0001\u02ce",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0001\u02d0",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0001\u02d3",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u0008\u003f\u0001\u02d4"+
            "\u0011\u003f",
            "",
            "\u0001\u02d6",
            "\u0001\u02d7",
            "\u0001\u02d8",
            "\u0001\u02d9",
            "\u0001\u02da",
            "\u0001\u02db",
            "\u0001\u02dc",
            "",
            "\u0001\u02dd",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "",
            "\u0001\u02df",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u02e1",
            "\u0001\u02e2",
            "",
            "\u0001\u02e3",
            "\u0001\u02e4",
            "",
            "\u0001\u02e5",
            "\u0001\u02e6",
            "",
            "\u0001\u02e7",
            "\u0001\u02e8",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0001\u02ea",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u0004\u003f\u0001\u02eb"+
            "\u0003\u003f\u0001\u02ec\u0011\u003f",
            "",
            "\u0001\u02ee",
            "\u0001\u02ef",
            "\u0001\u02f0",
            "\u0001\u02f1",
            "\u0001\u02f2",
            "\u0001\u02f3",
            "\u0001\u02f4",
            "\u0001\u02f5",
            "\u0001\u02f6",
            "\u0001\u02f7",
            "\u0001\u02f8",
            "\u0001\u02f9",
            "\u0001\u02fa",
            "\u0001\u02fb",
            "\u0001\u02fc",
            "\u0001\u02fd",
            "\u0001\u02fe",
            "",
            "\u0001\u02ff",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0001\u0301",
            "\u0001\u0302",
            "",
            "\u0001\u0303",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0305",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0307",
            "",
            "\u0001\u0308",
            "\u0001\u0309",
            "",
            "",
            "",
            "\u0001\u030a",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u030c",
            "",
            "\u0001\u030d",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0310",
            "\u0001\u0311",
            "\u0001\u0312",
            "\u0001\u0313",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0315",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0317",
            "\u0001\u0318",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u031b",
            "\u0001\u031c",
            "",
            "\u0001\u031d",
            "\u0001\u031e",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0001\u0320",
            "\u0001\u0321",
            "",
            "",
            "",
            "\u0001\u0322",
            "\u0001\u0323",
            "\u0001\u0324",
            "\u0001\u0325",
            "",
            "\u0001\u0326",
            "\u0001\u0327",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u032a",
            "",
            "",
            "",
            "\u0001\u032b",
            "\u0001\u032c",
            "\u0001\u032d",
            "\u0001\u032f\u0013\uffff\u0001\u032e",
            "\u0001\u0330",
            "\u0001\u0331",
            "\u0001\u0332",
            "\u0001\u0333",
            "\u0001\u0334",
            "",
            "\u0001\u0335",
            "\u0001\u0336",
            "\u0001\u0337",
            "\u0001\u0338",
            "\u0001\u0339",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0001\u033b",
            "\u0001\u033c",
            "\u0001\u033d",
            "\u0001\u033e",
            "\u0001\u033f",
            "\u0001\u0340",
            "",
            "\u0001\u0341",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0344",
            "\u0001\u0345",
            "\u0001\u0346",
            "\u0001\u0347",
            "\u0001\u0348",
            "\u0001\u0349",
            "",
            "\u0001\u034a",
            "",
            "",
            "\u0001\u034b",
            "\u0001\u034c",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u034e",
            "\u0001\u034f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0351",
            "\u0001\u0352",
            "\u0001\u0353",
            "\u0001\u0354",
            "",
            "\u0001\u0355",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0357",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u035a",
            "\u0001\u035b",
            "\u0001\u035c",
            "\u0001\u035d",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u035f",
            "\u0001\u0360",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0363",
            "\u0001\u0364",
            "\u0001\u0365",
            "\u0001\u0366",
            "\u0001\u0367",
            "\u0001\u0368",
            "\u0001\u0369",
            "\u0001\u036a",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u0008\u003f\u0001\u036c"+
            "\u0011\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u036f",
            "\u0001\u0370",
            "\u0001\u0371",
            "\u0001\u0372",
            "\u0001\u0373\u0001\u003f\u0001\uffff\u000a\u003f\u0007\uffff"+
            "\u001a\u003f\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0001\u0375",
            "\u0001\u0376",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0001\u0379",
            "\u0001\u037a",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u037c",
            "",
            "\u0001\u037d",
            "\u0001\u037e",
            "",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0380",
            "\u0001\u0381",
            "\u0001\u0382",
            "",
            "\u0001\u0383",
            "",
            "\u0001\u0384",
            "\u0001\u0385",
            "",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0387",
            "\u0001\u0388",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u038b",
            "\u0001\u038c",
            "\u0001\u038d",
            "\u0001\u038e",
            "\u0001\u038f",
            "\u0001\u0390",
            "\u0001\u0391",
            "",
            "",
            "\u0001\u0392",
            "\u0001\u0393",
            "\u0001\u0394",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0396",
            "\u0001\u0397",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u039a",
            "\u0001\u039b",
            "\u0001\u039c",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u039e",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u03a0\u0007\uffff\u0001\u03a1",
            "\u0001\u03a2",
            "",
            "\u0001\u03a3",
            "\u0001\u03a4",
            "\u0001\u03a5",
            "\u0001\u03a6",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u03a8",
            "\u0001\u03a9",
            "",
            "",
            "\u0001\u03aa",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u03ac",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u03af",
            "\u0001\u03b0",
            "\u0001\u03b1",
            "\u0001\u03b2",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u03b4",
            "",
            "\u0001\u03b5",
            "\u0001\u03b6",
            "\u0001\u03b7",
            "\u0001\u03b8",
            "\u0001\u03b9",
            "",
            "\u0001\u03ba",
            "",
            "",
            "\u0001\u03bb",
            "\u0001\u03bc",
            "\u0001\u03bd",
            "\u0001\u03be",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u03c0",
            "",
            "",
            "\u0001\u03c1",
            "\u0001\u03c2",
            "\u0001\u03c3",
            "\u0001\u03c4",
            "\u0001\u03c5",
            "\u0001\u03c6",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u03c8",
            "",
            "\u0001\u03c9",
            "",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u03cb",
            "\u0001\u03cc",
            "\u0001\u03cd",
            "\u0001\u03ce\u0003\uffff\u0001\u03cf",
            "",
            "\u0001\u03d0",
            "\u0001\u03d1",
            "",
            "",
            "\u0001\u03d2",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0001\u03d4",
            "\u0001\u03d5",
            "\u0001\u03d6",
            "",
            "\u0001\u03d7",
            "\u0001\u03d8",
            "\u0001\u03d9",
            "\u0001\u03da",
            "\u0001\u03db",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u03de",
            "",
            "",
            "\u0001\u03df",
            "\u0001\u03e0\u0001\u003f\u0001\uffff\u000a\u003f\u0007\uffff"+
            "\u001a\u003f\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u03e2",
            "\u0001\u03e3",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u03e6",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u03e8",
            "\u0001\u03e9",
            "",
            "\u0001\u03ea",
            "\u0001\u03eb",
            "",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u03ee",
            "",
            "\u0001\u03ef\u000c\uffff\u0001\u03f0",
            "",
            "\u0001\u03f1",
            "\u0001\u03f2",
            "\u0001\u03f3",
            "\u0001\u03f4",
            "\u0001\u03f5",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u03f7\u0001\u003f\u0001\uffff\u000a\u003f\u0007\uffff"+
            "\u001a\u003f\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0001\u03f9",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0001\u03fc",
            "",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u03fe",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0400",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0402",
            "\u0001\u0403",
            "\u0001\u0404",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0407",
            "\u0001\u0408",
            "\u0001\u0409",
            "\u0001\u040a",
            "\u0001\u040b",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u040d",
            "\u0001\u040e",
            "\u0001\u040f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0412",
            "",
            "\u0001\u0413",
            "\u0001\u0414",
            "",
            "\u0001\u0415",
            "\u0001\u0416",
            "\u0001\u0417",
            "\u0001\u0418",
            "\u0001\u0419",
            "\u0001\u041a",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u0012\u003f\u0001\u041b"+
            "\u0007\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0001\u041e",
            "\u0001\u041f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0421",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0423",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "",
            "\u0001\u0426",
            "\u0001\u0427",
            "\u0001\u0428",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "",
            "\u0001\u042b",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u042d",
            "\u0001\u042e",
            "\u0001\u042f",
            "",
            "",
            "\u0001\u0430",
            "\u0001\u0431",
            "\u0001\u0432",
            "\u0001\u0433",
            "\u0001\u0434",
            "\u0001\u0435",
            "\u0001\u0436",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0001\u0438",
            "",
            "\u0001\u0439",
            "",
            "",
            "\u0001\u043a\u0001\u003f\u0001\uffff\u000a\u003f\u0007\uffff"+
            "\u001a\u003f\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0001\u043d",
            "",
            "\u0001\u043e",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0442",
            "\u0001\u0443\u0001\u003f\u0001\uffff\u000a\u003f\u0007\uffff"+
            "\u001a\u003f\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0445",
            "\u0001\u0446",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u0012\u003f\u0001\u0447"+
            "\u0007\u003f",
            "\u0001\u0449",
            "\u0001\u044a\u0001\u003f\u0001\uffff\u000a\u003f\u0007\uffff"+
            "\u001a\u003f\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "",
            "\u0001\u044c",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u044f",
            "\u0001\u0450",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0452",
            "\u0001\u0453",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0457",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u045b",
            "\u0001\u045c",
            "",
            "",
            "\u0001\u045d",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u045f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0461",
            "\u0001\u0462",
            "\u0001\u0463",
            "\u0001\u0464\u0001\u003f\u0001\uffff\u000a\u003f\u0007\uffff"+
            "\u001a\u003f\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0467",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0001\u0469",
            "\u0001\u046a",
            "\u0001\u046b",
            "",
            "",
            "\u0001\u046c",
            "\u0001\u046d",
            "",
            "",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u046f",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0471",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0001\u0473",
            "\u0001\u0474",
            "",
            "\u0001\u0475",
            "",
            "",
            "\u0001\u0476",
            "\u0001\u0477",
            "",
            "\u0001\u0478",
            "\u0001\u0479",
            "",
            "",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u047c",
            "\u0001\u047d",
            "",
            "\u0001\u047e",
            "",
            "\u0001\u047f",
            "\u0001\u0480",
            "\u0001\u0481",
            "\u0001\u0482",
            "",
            "",
            "\u0001\u0483",
            "",
            "\u0001\u0484",
            "\u0001\u0485",
            "\u0001\u0486",
            "\u0001\u0487",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0001\u0489",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0001\u048b",
            "\u0001\u048c",
            "\u0001\u048d",
            "\u0001\u048e",
            "\u0001\u048f",
            "\u0001\u0490",
            "\u0001\u0491",
            "",
            "",
            "\u0001\u0492",
            "\u0001\u0493",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u0495",
            "\u0001\u0496",
            "\u0001\u0497",
            "\u0001\u0498",
            "\u0001\u0499",
            "\u0001\u049a",
            "\u0001\u049b",
            "\u0001\u049c",
            "\u0001\u049d",
            "",
            "\u0001\u049e",
            "",
            "\u0001\u049f",
            "\u0001\u04a0",
            "\u0001\u04a1",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u04a4",
            "\u0001\u04a5",
            "\u0001\u04a6",
            "\u0001\u04a7",
            "",
            "\u0001\u04a8",
            "\u0001\u04a9",
            "\u0001\u04aa",
            "\u0001\u04ab",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u04ae",
            "\u0001\u04af",
            "\u0001\u04b0",
            "\u0001\u04b1",
            "\u0001\u04b2",
            "\u0001\u04b3",
            "\u0001\u04b4",
            "",
            "",
            "\u0001\u04b5",
            "\u0001\u04b6",
            "\u0001\u04b7",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u04b9",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u04bb",
            "\u0001\u04bc",
            "",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u04be",
            "\u0001\u04bf",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u04c1",
            "\u0001\u04c2",
            "\u0001\u04c3",
            "\u0001\u04c4",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u04c6",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0001\u04c8",
            "\u0001\u04c9",
            "",
            "\u0001\u04ca",
            "\u0001\u04cb",
            "",
            "\u0001\u04cc",
            "\u0001\u04cd",
            "\u0001\u04ce",
            "\u0001\u04cf",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0001\u04d1",
            "\u0001\u04d2",
            "\u0001\u04d3",
            "\u0001\u04d4",
            "\u0001\u04d5",
            "\u0001\u04d6",
            "\u0001\u04d7",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u04da",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u04dc",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "\u0001\u04df",
            "",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            "",
            "",
            "\u0001\u04e2",
            "",
            "",
            "\u0001\u04e3",
            "\u0001\u04e4",
            "\u0001\u04e5",
            "\u0002\u003f\u0001\uffff\u000a\u003f\u0007\uffff\u001a\u003f"+
            "\u0004\uffff\u0001\u003f\u0001\uffff\u001a\u003f",
            ""
    ]
});

org.antlr.lang.augmentObject(XQueryLexer, {
    DFA19_eot:
        org.antlr.runtime.DFA.unpackEncodedString(XQueryLexer.DFA19_eotS),
    DFA19_eof:
        org.antlr.runtime.DFA.unpackEncodedString(XQueryLexer.DFA19_eofS),
    DFA19_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(XQueryLexer.DFA19_minS),
    DFA19_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(XQueryLexer.DFA19_maxS),
    DFA19_accept:
        org.antlr.runtime.DFA.unpackEncodedString(XQueryLexer.DFA19_acceptS),
    DFA19_special:
        org.antlr.runtime.DFA.unpackEncodedString(XQueryLexer.DFA19_specialS),
    DFA19_transition: (function() {
        var a = [],
            i,
            numStates = XQueryLexer.DFA19_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(XQueryLexer.DFA19_transitionS[i]));
        }
        return a;
    })()
});

XQueryLexer.DFA19 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 19;
    this.eot = XQueryLexer.DFA19_eot;
    this.eof = XQueryLexer.DFA19_eof;
    this.min = XQueryLexer.DFA19_min;
    this.max = XQueryLexer.DFA19_max;
    this.accept = XQueryLexer.DFA19_accept;
    this.special = XQueryLexer.DFA19_special;
    this.transition = XQueryLexer.DFA19_transition;
};

org.antlr.lang.extend(XQueryLexer.DFA19, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "1:1: Tokens : ( ANCESTOR | ANCESTOR_OR_SELF | AND | AS | ASCENDING | AT | ATTRIBUTE | BASE_URI | BOUNDARY_SPACE | BY | CASE | CAST | CASTABLE | CHILD | COLLATION | COMMENT | CONSTRUCTION | COPY_NAMESPACES | DECLARE | DEFAULT | DESCENDANT | DESCENDANT_OR_SELF | DESCENDING | DIV | DOCUMENT | DOCUMENT_NODE | ELEMENT | ELSE | EMPTY | EMPTY_SEQUENCE | ENCODING | EQ | EVERY | EXCEPT | EXTERNAL | FOLLOWING | FOLLOWING_SIBLING | FOR | FUNCTION | GE | GREATEST | GT | IDIV | IF | IMPORT | IN | INHERIT | INSTANCE | INTERSECT | IS | ITEM | LAX | LE | LEAST | LET | LT | MOD | MODULE | NAMESPACE | NE | NO_INHERIT | NO_PRESERVE | NODE | OF | OPTION | OR | ORDER | ORDERED | ORDERING | PARENT | PRECEDING | PRECEDING_SIBLING | PRESERVE | PROCESSING_INSTRUCTION | RETURN | SATISFIES | SCHEMA | SCHEMA_ATTRIBUTE | SCHEMA_ELEMENT | SELF | SOME | STABLE | STRICT | STRIP | TEXT | THEN | TO | TREAT | TYPESWITCH | UNION | UNORDERED | VALIDATE | VARIABLE | VERSION | WHERE | XQUERY | ALLOWING | CATCH | CONTEXT | COUNT | DECIMAL_FORMAT | DECIMAL_SEPARATOR | DETERMINISTIC | DIGIT | END | GROUP | GROUPING_SEPARATOR | INFINITY | MINUS_SIGN | NAMESPACE_NODE | NAN | NEXT | ONLY | PATTERN_SEPARATOR | PERCENT | PER_MILLE | PREVIOUS | SLIDING | START | SWITCH | TRY | TUMBLING | TYPE | WHEN | WINDOW | ZERO_DIGIT | AFTER | BEFORE | COPY | DELETE | FIRST | INSERT | INTO | LAST | MODIFY | NODES | RENAME | REPLACE | REVALIDATION | SKIP | UPDATING | VALUE | WITH | ALL | ANY | CONTAINS | CONTENT | DIACRITICS | DIFFERENT | DISTANCE | ENTIRE | EXACTLY | FROM | FT_OPTION | FTAND | FTNOT | FTOR | INSENSITIVE | LANGUAGE | LEVELS | LOWERCASE | MOST | NO | NOT | OCCURS | PARAGRAPH | PARAGRAPHS | PHRASE | RELATIONSHIP | SAME | SCORE | SENSITIVE | SENTENCE | SENTENCES | STEMMING | STOP | THESAURUS | TIMES | UPPERCASE | USING | WEIGHT | WILDCARDS | WITHOUT | WORD | WORDS | BREAK | CONTINUE | EXIT | LOOP | RETURNING | WHILE | CHECK | COLLECTION | CONSTRAINT | FOREACH | FOREIGN | INDEX | INTEGRITY | KEY | ON | UNIQUE | BINARY | AMP_ER | APOS_ER | QUOT_ER | LPAREN | RPAREN | DOLLAR | LBRACKET | RBRACKET | LSQUARE | RSQUARE | EQUAL | BIND | NOTEQUAL | ANN_PERCENT | HASH | AMP | COMMA | QUESTION | STAR | PLUS | MINUS | SMALLER | GREATER | SMALLEREQ | GREATEREQ | SMALLER_SMALLER | GREATER_GREATER | SLASH | SLASH_SLASH | DOT | DOT_DOT | COLON | COLON_COLON | EMPTY_CLOSE_TAG | CLOSE_TAG | SEMICOLON | VBAR | PRAGMA_START | PRAGMA_END | XML_COMMENT_START | XML_COMMENT_END | PI_START | PI_END | ATTR_SIGN | CHARREF_DEC | CHARREF_HEX | APOS | QUOT | L_NCName | S | L_Pragma | L_DirCommentConstructor | L_DirPIConstructor | L_IntegerLiteral | L_DecimalLiteral | L_DoubleLiteral | L_Comment | L_AnyChar );";
    },
    specialStateTransition: function(s, input) {
        var _s = s;
        /* bind to recognizer so semantic predicates can be evaluated */
        var retval = (function(s, input) {
            switch ( s ) {
                        case 0 : 
                            var LA19_25 = input.LA(1);

                             
                            var index19_25 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (LA19_25=='#') ) {s = 144;}

                            else if ( (LA19_25==':') && ((!this.inStr))) {s = 145;}

                            else s = 146;

                             
                            input.seek(index19_25);
                            if ( s>=0 ) return s;
                            break;
                        case 1 : 
                            var LA19_0 = input.LA(1);

                            s = -1;
                            if ( (LA19_0=='a') ) {s = 1;}

                            else if ( (LA19_0=='b') ) {s = 2;}

                            else if ( (LA19_0=='c') ) {s = 3;}

                            else if ( (LA19_0=='d') ) {s = 4;}

                            else if ( (LA19_0=='e') ) {s = 5;}

                            else if ( (LA19_0=='f') ) {s = 6;}

                            else if ( (LA19_0=='g') ) {s = 7;}

                            else if ( (LA19_0=='i') ) {s = 8;}

                            else if ( (LA19_0=='l') ) {s = 9;}

                            else if ( (LA19_0=='m') ) {s = 10;}

                            else if ( (LA19_0=='n') ) {s = 11;}

                            else if ( (LA19_0=='o') ) {s = 12;}

                            else if ( (LA19_0=='p') ) {s = 13;}

                            else if ( (LA19_0=='r') ) {s = 14;}

                            else if ( (LA19_0=='s') ) {s = 15;}

                            else if ( (LA19_0=='t') ) {s = 16;}

                            else if ( (LA19_0=='u') ) {s = 17;}

                            else if ( (LA19_0=='v') ) {s = 18;}

                            else if ( (LA19_0=='w') ) {s = 19;}

                            else if ( (LA19_0=='x') ) {s = 20;}

                            else if ( (LA19_0=='N') ) {s = 21;}

                            else if ( (LA19_0=='z') ) {s = 22;}

                            else if ( (LA19_0=='k') ) {s = 23;}

                            else if ( (LA19_0=='q') ) {s = 24;}

                            else if ( (LA19_0=='(') ) {s = 25;}

                            else if ( (LA19_0==')') ) {s = 26;}

                            else if ( (LA19_0=='$') ) {s = 27;}

                            else if ( (LA19_0=='{') ) {s = 28;}

                            else if ( (LA19_0=='}') ) {s = 29;}

                            else if ( (LA19_0=='[') ) {s = 30;}

                            else if ( (LA19_0==']') ) {s = 31;}

                            else if ( (LA19_0=='=') ) {s = 32;}

                            else if ( (LA19_0==':') ) {s = 33;}

                            else if ( (LA19_0=='!') ) {s = 34;}

                            else if ( (LA19_0=='%') ) {s = 35;}

                            else if ( (LA19_0=='#') ) {s = 36;}

                            else if ( (LA19_0=='&') ) {s = 37;}

                            else if ( (LA19_0==',') ) {s = 38;}

                            else if ( (LA19_0=='?') ) {s = 39;}

                            else if ( (LA19_0=='*') ) {s = 40;}

                            else if ( (LA19_0=='+') ) {s = 41;}

                            else if ( (LA19_0=='-') ) {s = 42;}

                            else if ( (LA19_0=='<') ) {s = 43;}

                            else if ( (LA19_0=='>') ) {s = 44;}

                            else if ( (LA19_0=='/') ) {s = 45;}

                            else if ( (LA19_0=='.') ) {s = 46;}

                            else if ( (LA19_0==';') ) {s = 47;}

                            else if ( (LA19_0=='|') ) {s = 48;}

                            else if ( (LA19_0=='@') ) {s = 49;}

                            else if ( (LA19_0=='\'') ) {s = 50;}

                            else if ( (LA19_0=='\"') ) {s = 51;}

                            else if ( ((LA19_0>='A' && LA19_0<='M')||(LA19_0>='O' && LA19_0<='Z')||LA19_0=='_'||LA19_0=='h'||LA19_0=='j'||LA19_0=='y') ) {s = 52;}

                            else if ( ((LA19_0>='\t' && LA19_0<='\n')||LA19_0=='\r'||LA19_0==' ') ) {s = 53;}

                            else if ( ((LA19_0>='0' && LA19_0<='9')) ) {s = 54;}

                            else if ( ((LA19_0>='\u0000' && LA19_0<='\b')||(LA19_0>='\u000B' && LA19_0<='\f')||(LA19_0>='\u000E' && LA19_0<='\u001F')||LA19_0=='\\'||LA19_0=='^'||LA19_0=='`'||(LA19_0>='~' && LA19_0<='\uFFFF')) ) {s = 55;}

                            if ( s>=0 ) return s;
                            break;
                        case 2 : 
                            var LA19_513 = input.LA(1);

                            s = -1;
                            if ( ((LA19_513>='\u0000' && LA19_513<='\uFFFF')) ) {s = 670;}

                            else s = 669;

                            if ( s>=0 ) return s;
                            break;
            }
        }).call(this.recognizer, s, input);
        if (!org.antlr.lang.isUndefined(retval)) {
            return retval;
        }
        var nvae =
            new org.antlr.runtime.NoViableAltException(this.getDescription(), 19, _s, input);
        this.error(nvae);
        throw nvae;
    },
    dummy: null
});
 
})();

});
