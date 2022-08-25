/* Derived from Python highlighing rules */

"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var FortranHighlightRules = function() {

    var keywords = (
        "call|case|contains|continue|cycle|do|else|elseif|end|enddo|endif|function|"+ 
        "if|implicit|in|include|inout|intent|module|none|only|out|print|program|return|"+ 
        "select|status|stop|subroutine|" +
        "return|then|use|while|write|"+
        "CALL|CASE|CONTAINS|CONTINUE|CYCLE|DO|ELSE|ELSEIF|END|ENDDO|ENDIF|FUNCTION|"+
        "IF|IMPLICIT|IN|INCLUDE|INOUT|INTENT|MODULE|NONE|ONLY|OUT|PRINT|PROGRAM|RETURN|"+
        "SELECT|STATUS|STOP|SUBROUTINE|" +
        "RETURN|THEN|USE|WHILE|WRITE"
    );

    var keywordOperators = (
        "and|or|not|eq|ne|gt|ge|lt|le|" +
        "AND|OR|NOT|EQ|NE|GT|GE|LT|LE" 
    );

    var builtinConstants = (
        "true|false|TRUE|FALSE"
    );

    var builtinFunctions = (
        "abs|achar|acos|acosh|adjustl|adjustr|aimag|aint|all|allocate|"+
        "anint|any|asin|asinh|associated|atan|atan2|atanh|"+
        "bessel_j0|bessel_j1|bessel_jn|bessel_y0|bessel_y1|bessel_yn|"+
        "bge|bgt|bit_size|ble|blt|btest|ceiling|char|cmplx|conjg|cos|cosh|"+
        "count|cpu_time|cshift|date_and_time|dble|deallocate|digits|dim|dot_product|dprod|"+
        "dshiftl|dshiftr|dsqrt|eoshift|epsilon|erf|erfc|erfc_scaled|exp|float|floor|"+
        "format|fraction|gamma|input|len|lge|lgt|lle|llt|log|log10|maskl|maskr|matmul|max|maxloc|maxval|"+
        "merge|min|minloc|minval|mod|modulo|nint|not|norm2|null|nullify|pack|parity|popcnt|poppar|"+
        "precision|present|product|radix|random_number|random_seed|range|repeat|reshape|round|"+
        "rrspacing|same_type_as|scale|scan|selected_char_kind|selected_int_kind|selected_real_kind|"+
        "set_exponent|shape|shifta|shiftl|shiftr|sign|sin|sinh|size|sngl|spacing|spread|"+
        "sqrt|sum|system_clock|tan|tanh|tiny|trailz|transfer|transpose|trim|ubound|unpack|verify|" +
        "ABS|ACHAR|ACOS|ACOSH|ADJUSTL|ADJUSTR|AIMAG|AINT|ALL|ALLOCATE|"+
        "ANINT|ANY|ASIN|ASINH|ASSOCIATED|ATAN|ATAN2|ATANH|"+
        "BESSEL_J0|BESSEL_J1|BESSEL_JN|BESSEL_Y0|BESSEL_Y1|BESSEL_YN|"+
        "BGE|BGT|BIT_SIZE|BLE|BLT|BTEST|CEILING|CHAR|CMPLX|CONJG|COS|COSH|"+
        "COUNT|CPU_TIME|CSHIFT|DATE_AND_TIME|DBLE|DEALLOCATE|DIGITS|DIM|DOT_PRODUCT|DPROD|"+
        "DSHIFTL|DSHIFTR|DSQRT|EOSHIFT|EPSILON|ERF|ERFC|ERFC_SCALED|EXP|FLOAT|FLOOR|"+
        "FORMAT|FRACTION|GAMMA|INPUT|LEN|LGE|LGT|LLE|LLT|LOG|LOG10|MASKL|MASKR|MATMUL|MAX|MAXLOC|MAXVAL|"+
        "MERGE|MIN|MINLOC|MINVAL|MOD|MODULO|NINT|NOT|NORM2|NULL|NULLIFY|PACK|PARITY|POPCNT|POPPAR|"+
        "PRECISION|PRESENT|PRODUCT|RADIX|RANDOM_NUMBER|RANDOM_SEED|RANGE|REPEAT|RESHAPE|ROUND|"+
        "RRSPACING|SAME_TYPE_AS|SCALE|SCAN|SELECTED_CHAR_KIND|SELECTED_INT_KIND|SELECTED_REAL_KIND|"+
        "SET_EXPONENT|SHAPE|SHIFTA|SHIFTL|SHIFTR|SIGN|SIN|SINH|SIZE|SNGL|SPACING|SPREAD|"+
        "SQRT|SUM|SYSTEM_CLOCK|TAN|TANH|TINY|TRAILZ|TRANSFER|TRANSPOSE|TRIM|UBOUND|UNPACK|VERIFY"
    );

    var storageType = (
        "logical|character|integer|real|type|" +
        "LOGICAL|CHARACTER|INTEGER|REAL|TYPE"    
    );

    var storageModifiers = ( 
        "allocatable|dimension|intent|parameter|pointer|target|private|public|" +
        "ALLOCATABLE|DIMENSION|INTENT|PARAMETER|POINTER|TARGET|PRIVATE|PUBLIC"
    );

    var keywordMapper = this.createKeywordMapper({
        "invalid.deprecated": "debugger",
        "support.function": builtinFunctions,
        "constant.language": builtinConstants,
        "keyword": keywords,
        "keyword.operator": keywordOperators,
        "storage.type": storageType,
        "storage.modifier" : storageModifiers
    }, "identifier");

    var strPre = "(?:r|u|ur|R|U|UR|Ur|uR)?";

    var decimalInteger = "(?:(?:[1-9]\\d*)|(?:0))";
    var octInteger = "(?:0[oO]?[0-7]+)";
    var hexInteger = "(?:0[xX][\\dA-Fa-f]+)";
    var binInteger = "(?:0[bB][01]+)";
    var integer = "(?:" + decimalInteger + "|" + octInteger + "|" + hexInteger + "|" + binInteger + ")";

    var exponent = "(?:[eE][+-]?\\d+)";
    var fraction = "(?:\\.\\d+)";
    var intPart = "(?:\\d+)";
    var pointFloat = "(?:(?:" + intPart + "?" + fraction + ")|(?:" + intPart + "\\.))";
    var exponentFloat = "(?:(?:" + pointFloat + "|" +  intPart + ")" + exponent + ")";
    var floatNumber = "(?:" + exponentFloat + "|" + pointFloat + ")";

    var stringEscape =  "\\\\(x[0-9A-Fa-f]{2}|[0-7]{3}|[\\\\abfnrtv'\"]|U[0-9A-Fa-f]{8}|u[0-9A-Fa-f]{4})";

    this.$rules = {
        "start" : [ {
            token : "comment",
            regex : "!.*$"
        }, {
            token : "string",           // multi line """ string start
            regex : strPre + '"{3}',
            next : "qqstring3"
        }, {
            token : "string",           // " string
            regex : strPre + '"(?=.)',
            next : "qqstring"
        }, {
            token : "string",           // multi line ''' string start
            regex : strPre + "'{3}",
            next : "qstring3"
        }, {
            token : "string",           // ' string
            regex : strPre + "'(?=.)",
            next : "qstring"
        }, {
            token : "constant.numeric", // imaginary
            regex : "(?:" + floatNumber + "|\\d+)[jJ]\\b"
        }, {
            token : "constant.numeric", // float
            regex : floatNumber
        }, {
            token : "constant.numeric", // long integer
            regex : integer + "[lL]\\b"
        }, {
            token : "constant.numeric", // integer
            regex : integer + "\\b"
        }, {
            token : "keyword", // pre-compiler directives
            regex : "#\\s*(?:include|import|define|undef|INCLUDE|IMPORT|DEFINE|UNDEF)\\b"
        }, {
            token : "keyword", // special case pre-compiler directive
            regex : "#\\s*(?:endif|ifdef|else|elseif|ifndef|ENDIF|IFDEF|ELSE|ELSEIF|IFNDEF)\\b"
        }, {
            token : keywordMapper,
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token : "keyword.operator",
            regex : "\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|%|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|="
        }, {
            token : "paren.lparen",
            regex : "[\\[\\(\\{]"
        }, {
            token : "paren.rparen",
            regex : "[\\]\\)\\}]"
        }, {
            token : "text",
            regex : "\\s+"
        } ],
        "qqstring3" : [ {
            token : "constant.language.escape",
            regex : stringEscape
        }, {
            token : "string", // multi line """ string end
            regex : '"{3}',
            next : "start"
        }, {
            defaultToken : "string"
        } ],
        "qstring3" : [ {
            token : "constant.language.escape",
            regex : stringEscape
        }, {
            token : "string", // multi line """ string end
            regex : '"{3}',
            next : "start"
        }, {
            defaultToken : "string"
        } ],
        "qqstring" : [{
            token : "constant.language.escape",
            regex : stringEscape
        }, {
            token : "string",
            regex : "\\\\$",
            next  : "qqstring"
        }, {
            token : "string",
            regex : '"|$',
            next  : "start"
        }, {
            defaultToken: "string"
        }],
        "qstring" : [{
            token : "constant.language.escape",
            regex : stringEscape
        }, {
            token : "string",
            regex : "\\\\$",
            next  : "qstring"
        }, {
            token : "string",
            regex : "'|$",
            next  : "start"
        }, {
            defaultToken: "string"
        }]
    };
};

oop.inherits(FortranHighlightRules, TextHighlightRules);

exports.FortranHighlightRules = FortranHighlightRules;
