/*
  php.js 0.1.0 <http://phpjs.hertzen.com/>
  Copyright (c) 2013 Niklas von Hertzen

  Released under MIT License

  This file contains:
  - [var PHP = {Constants:{}};]
  - src/modules/tokenizer/constants.js
  - src/parser/lexer.js
  - src/parser/parser.js
  - src/parser/yyn.js
  - src/parser/yyn_stmt.js
  - src/parser/yyn_expr.js
  - src/parser/yyn_scalar.js
*/



define(function(require, exports, module) {

var PHP = {Constants:{}};

PHP.Constants.T_INCLUDE = 257;
PHP.Constants.T_INCLUDE_ONCE = 258;
PHP.Constants.T_EVAL = 259;
PHP.Constants.T_REQUIRE = 260;
PHP.Constants.T_REQUIRE_ONCE = 261;
PHP.Constants.T_LOGICAL_OR = 262;
PHP.Constants.T_LOGICAL_XOR = 263;
PHP.Constants.T_LOGICAL_AND = 264;
PHP.Constants.T_PRINT = 265;
PHP.Constants.T_YIELD = 266;
PHP.Constants.T_DOUBLE_ARROW = 267;
PHP.Constants.T_YIELD_FROM = 268;
PHP.Constants.T_PLUS_EQUAL = 269;
PHP.Constants.T_MINUS_EQUAL = 270;
PHP.Constants.T_MUL_EQUAL = 271;
PHP.Constants.T_DIV_EQUAL = 272;
PHP.Constants.T_CONCAT_EQUAL = 273;
PHP.Constants.T_MOD_EQUAL = 274;
PHP.Constants.T_AND_EQUAL = 275;
PHP.Constants.T_OR_EQUAL = 276;
PHP.Constants.T_XOR_EQUAL = 277;
PHP.Constants.T_SL_EQUAL = 278;
PHP.Constants.T_SR_EQUAL = 279;
PHP.Constants.T_POW_EQUAL = 280;
PHP.Constants.T_COALESCE = 281;
PHP.Constants.T_BOOLEAN_OR = 282;
PHP.Constants.T_BOOLEAN_AND = 283;
PHP.Constants.T_IS_EQUAL = 284;
PHP.Constants.T_IS_NOT_EQUAL = 285;
PHP.Constants.T_IS_IDENTICAL = 286;
PHP.Constants.T_IS_NOT_IDENTICAL = 287;
PHP.Constants.T_SPACESHIP = 288;
PHP.Constants.T_IS_SMALLER_OR_EQUAL = 289;
PHP.Constants.T_IS_GREATER_OR_EQUAL = 290;
PHP.Constants.T_SL = 291;
PHP.Constants.T_SR = 292;
PHP.Constants.T_INSTANCEOF = 293;
PHP.Constants.T_INC = 294;
PHP.Constants.T_DEC = 295;
PHP.Constants.T_INT_CAST = 296;
PHP.Constants.T_DOUBLE_CAST = 297;
PHP.Constants.T_STRING_CAST = 298;
PHP.Constants.T_ARRAY_CAST = 299;
PHP.Constants.T_OBJECT_CAST = 300;
PHP.Constants.T_BOOL_CAST = 301;
PHP.Constants.T_UNSET_CAST = 302;
PHP.Constants.T_POW = 303;
PHP.Constants.T_NEW = 304;
PHP.Constants.T_CLONE = 305;
PHP.Constants.T_EXIT = 306;
PHP.Constants.T_IF = 307;
PHP.Constants.T_ELSEIF = 308;
PHP.Constants.T_ELSE = 309;
PHP.Constants.T_ENDIF = 310;
PHP.Constants.T_LNUMBER = 311;
PHP.Constants.T_DNUMBER = 312;
PHP.Constants.T_STRING = 313;
PHP.Constants.T_STRING_VARNAME = 314;
PHP.Constants.T_VARIABLE = 315;
PHP.Constants.T_NUM_STRING = 316;
PHP.Constants.T_INLINE_HTML = 317;
PHP.Constants.T_CHARACTER = 318;
PHP.Constants.T_BAD_CHARACTER = 319;
PHP.Constants.T_ENCAPSED_AND_WHITESPACE = 320;
PHP.Constants.T_CONSTANT_ENCAPSED_STRING = 321;
PHP.Constants.T_ECHO = 322;
PHP.Constants.T_DO = 323;
PHP.Constants.T_WHILE = 324;
PHP.Constants.T_ENDWHILE = 325;
PHP.Constants.T_FOR = 326;
PHP.Constants.T_ENDFOR = 327;
PHP.Constants.T_FOREACH = 328;
PHP.Constants.T_ENDFOREACH = 329;
PHP.Constants.T_DECLARE = 330;
PHP.Constants.T_ENDDECLARE = 331;
PHP.Constants.T_AS = 332;
PHP.Constants.T_SWITCH = 333;
PHP.Constants.T_ENDSWITCH = 334;
PHP.Constants.T_CASE = 335;
PHP.Constants.T_DEFAULT = 336;
PHP.Constants.T_BREAK = 337;
PHP.Constants.T_CONTINUE = 338;
PHP.Constants.T_GOTO = 339;
PHP.Constants.T_FUNCTION = 340;
PHP.Constants.T_CONST = 341;
PHP.Constants.T_RETURN = 342;
PHP.Constants.T_TRY = 343;
PHP.Constants.T_CATCH = 344;
PHP.Constants.T_FINALLY = 345;
PHP.Constants.T_THROW = 346;
PHP.Constants.T_USE = 347;
PHP.Constants.T_INSTEADOF = 348;
PHP.Constants.T_GLOBAL = 349;
PHP.Constants.T_STATIC = 350;
PHP.Constants.T_ABSTRACT = 351;
PHP.Constants.T_FINAL = 352;
PHP.Constants.T_PRIVATE = 353;
PHP.Constants.T_PROTECTED = 354;
PHP.Constants.T_PUBLIC = 355;
PHP.Constants.T_VAR = 356;
PHP.Constants.T_UNSET = 357;
PHP.Constants.T_ISSET = 358;
PHP.Constants.T_EMPTY = 359;
PHP.Constants.T_HALT_COMPILER = 360;
PHP.Constants.T_CLASS = 361;
PHP.Constants.T_TRAIT = 362;
PHP.Constants.T_INTERFACE = 363;
PHP.Constants.T_EXTENDS = 364;
PHP.Constants.T_IMPLEMENTS = 365;
PHP.Constants.T_OBJECT_OPERATOR = 366;
PHP.Constants.T_LIST = 367;
PHP.Constants.T_ARRAY = 368;
PHP.Constants.T_CALLABLE = 369;
PHP.Constants.T_CLASS_C = 370;
PHP.Constants.T_TRAIT_C = 371;
PHP.Constants.T_METHOD_C = 372;
PHP.Constants.T_FUNC_C = 373;
PHP.Constants.T_LINE = 374;
PHP.Constants.T_FILE = 375;
PHP.Constants.T_COMMENT = 376;
PHP.Constants.T_DOC_COMMENT = 377;
PHP.Constants.T_OPEN_TAG = 378;
PHP.Constants.T_OPEN_TAG_WITH_ECHO = 379;
PHP.Constants.T_CLOSE_TAG = 380;
PHP.Constants.T_WHITESPACE = 381;
PHP.Constants.T_START_HEREDOC = 382;
PHP.Constants.T_END_HEREDOC = 383;
PHP.Constants.T_DOLLAR_OPEN_CURLY_BRACES = 384;
PHP.Constants.T_CURLY_OPEN = 385;
PHP.Constants.T_PAAMAYIM_NEKUDOTAYIM = 386;
PHP.Constants.T_NAMESPACE = 387;
PHP.Constants.T_NS_C = 388;
PHP.Constants.T_DIR = 389;
PHP.Constants.T_NS_SEPARATOR = 390;
PHP.Constants.T_ELLIPSIS = 391;

PHP.Lexer = function(src, ini) {
    var heredoc, heredocEndAllowed,

    stateStack = ['INITIAL'], stackPos = 0,
    swapState = function(state) {
        stateStack[stackPos] = state;
    },
    pushState = function(state) {
        stateStack[++stackPos] = state;
    },
    popState = function() {
        --stackPos;
    },

    shortOpenTag = ini === undefined || /^(on|true|1)$/i.test(ini.short_open_tag),
    openTag = shortOpenTag
        ? /^(\<\?php(?:\r\n|[ \t\r\n])|<\?|\<script language\=('|")?php('|")?\>)/i
        : /^(\<\?php(?:\r\n|[ \t\r\n])|\<script language\=('|")?php('|")?\>)/i,
    inlineHtml = shortOpenTag
        ? /[^<]*(?:<(?!\?|script language\=('|")?php('|")?\>)[^<]*)*/i
        : /[^<]*(?:<(?!\?=|\?php[ \t\r\n]|script language\=('|")?php('|")?\>)[^<]*)*/i,
    labelRegexPart = '[a-zA-Z_\\x7f-\\uffff][a-zA-Z0-9_\\x7f-\\uffff]*',
    stringRegexPart = function(quote) {
        // Matches non-interpolated portion of interpolated string
        return '[^' + quote + '\\\\${]*(?:(?:\\\\[\\s\\S]|\\$(?!\\{|[a-zA-Z_\\x7f-\\uffff])|\\{(?!\\$))[^' + quote + '\\\\${]*)*';
    },

    sharedStringTokens = [
        {
            value: PHP.Constants.T_VARIABLE,
            re: new RegExp('^\\$' + labelRegexPart + '(?=\\[)'),
            func: function() {
                pushState('VAR_OFFSET');
            }
        },
        {
            value: PHP.Constants.T_VARIABLE,
            re: new RegExp('^\\$' + labelRegexPart + '(?=->' + labelRegexPart + ')'),
            func: function() {
                pushState('LOOKING_FOR_PROPERTY');
            }
        },
        {
            value: PHP.Constants.T_DOLLAR_OPEN_CURLY_BRACES,
            re: new RegExp('^\\$\\{(?=' + labelRegexPart + '[\\[}])'),
            func: function() {
                pushState('LOOKING_FOR_VARNAME');
            }
        },
        {
            value: PHP.Constants.T_VARIABLE,
            re: new RegExp('^\\$' + labelRegexPart)
        },
        {
            value: PHP.Constants.T_DOLLAR_OPEN_CURLY_BRACES,
            re: /^\$\{/,
            func: function() {
                pushState('IN_SCRIPTING');
            }
        },
        {
            value: PHP.Constants.T_CURLY_OPEN,
            re: /^\{(?=\$)/,
            func: function() {
                pushState('IN_SCRIPTING');
            }
        }
    ],
    data = {
        // Outside of PHP
        'INITIAL': [
            {
                value: PHP.Constants.T_OPEN_TAG_WITH_ECHO,
                re: /^<\?=/i,
                func: function() {
                    swapState('IN_SCRIPTING');
                }
            },
            {
                value: PHP.Constants.T_OPEN_TAG,
                re: openTag,
                func: function() {
                    swapState('IN_SCRIPTING');
                }
            },
            {
                value: PHP.Constants.T_INLINE_HTML,
                re: inlineHtml
            },
        ],
        // In normal PHP code
        'IN_SCRIPTING': [
            // Match whitespace first
            {
                value: PHP.Constants.T_WHITESPACE,
                re: /^[ \n\r\t]+/
            },

			// Keywords, sorted alphabetically
            {
                value: PHP.Constants.T_ABSTRACT,
                re: /^abstract\b/i
            },
            {
                value: PHP.Constants.T_LOGICAL_AND,
                re: /^and\b/i
            },
            {
                value: PHP.Constants.T_ARRAY,
                re: /^array\b/i
            },
            {
                value: PHP.Constants.T_AS,
                re: /^as\b/i
            },
            {
                value: PHP.Constants.T_BREAK,
                re: /^break\b/i
            },
            {
                value: PHP.Constants.T_CALLABLE,
                re: /^callable\b/i
            },
            {
                value: PHP.Constants.T_CASE,
                re: /^case\b/i
            },
            {
                value: PHP.Constants.T_CATCH,
                re: /^catch\b/i
            },
            {
                value: PHP.Constants.T_CLASS,
                re: /^class\b/i,
            },
            {
                value: PHP.Constants.T_CLONE,
                re: /^clone\b/i
            },
            {
                value: PHP.Constants.T_CONST,
                re: /^const\b/i
            },
            {
                value: PHP.Constants.T_CONTINUE,
                re: /^continue\b/i
            },
            {
                value: PHP.Constants.T_DECLARE,
                re: /^declare\b/i
            },
            {
                value: PHP.Constants.T_DEFAULT,
                re: /^default\b/i
            },
            {
                value: PHP.Constants.T_DO,
                re: /^do\b/i
            },
            {
                value: PHP.Constants.T_ECHO,
                re: /^echo\b/i
            },
            {
                value: PHP.Constants.T_ELSE,
                re: /^else\b/i
            },
            {
                value: PHP.Constants.T_ELSEIF,
                re: /^elseif\b/i
            },
            {
                value: PHP.Constants.T_ENDDECLARE,
                re: /^enddeclare\b/i
            },
            {
                value: PHP.Constants.T_ENDFOR,
                re: /^endfor\b/i
            },
            {
                value: PHP.Constants.T_ENDFOREACH,
                re: /^endforeach\b/i
            },
            {
                value: PHP.Constants.T_ENDIF,
                re: /^endif\b/i
            },
            {
                value: PHP.Constants.T_ENDSWITCH,
                re: /^endswitch\b/i
            },
            {
                value: PHP.Constants.T_ENDWHILE,
                re: /^endwhile\b/i
            },
            {
                value: PHP.Constants.T_EMPTY,
                re: /^empty\b/i
            },
            {
                value: PHP.Constants.T_EVAL,
                re: /^eval\b/i
            },
            {
                value: PHP.Constants.T_EXIT,
                re: /^(?:exit|die)\b/i
            },
            {
                value: PHP.Constants.T_EXTENDS,
                re: /^extends\b/i
            },
            {
                value: PHP.Constants.T_FINAL,
                re: /^final\b/i
            },
            {
                value: PHP.Constants.T_FINALLY,
                re: /^finally\b/i
            },
            {
                value: PHP.Constants.T_FOR,
                re: /^for\b/i
            },
            {
                value: PHP.Constants.T_FOREACH,
                re: /^foreach\b/i
            },
            {
                value: PHP.Constants.T_FUNCTION,
                re: /^function\b/i
            },
            {
                value: PHP.Constants.T_GLOBAL,
                re: /^global\b/i
            },
            {
                value: PHP.Constants.T_GOTO,
                re: /^goto\b/i
            },
            {
                value: PHP.Constants.T_IF,
                re: /^if\b/i
            },
            {
                value: PHP.Constants.T_IMPLEMENTS,
                re: /^implements\b/i
            },
            {
                value: PHP.Constants.T_INCLUDE,
                re: /^include\b/i
            },
            {
                value: PHP.Constants.T_INCLUDE_ONCE,
                re: /^include_once\b/i
            },
            {
                value: PHP.Constants.T_INSTANCEOF,
                re: /^instanceof\b/i
            },
            {
                value: PHP.Constants.T_INSTEADOF,
                re: /^insteadof\b/i
            },
            {
                value: PHP.Constants.T_INTERFACE,
                re: /^interface\b/i
            },
            {
                value: PHP.Constants.T_ISSET,
                re: /^isset\b/i
            },
            {
                value: PHP.Constants.T_LIST,
                re: /^list\b/i
            },
            {
                value: PHP.Constants.T_NAMESPACE,
                re: /^namespace\b/i
            },
            {
                value: PHP.Constants.T_NEW,
                re: /^new\b/i
            },
            {
                value: PHP.Constants.T_LOGICAL_OR,
                re: /^or\b/i
            },
            {
                value: PHP.Constants.T_PRINT,
                re: /^print\b/i
            },
            {
                value: PHP.Constants.T_PRIVATE,
                re: /^private\b/i
            },
            {
                value: PHP.Constants.T_PROTECTED,
                re: /^protected\b/i
            },
            {
                value: PHP.Constants.T_PUBLIC,
                re: /^public\b/i
            },
            {
                value: PHP.Constants.T_REQUIRE,
                re: /^require\b/i
            },
            {
                value: PHP.Constants.T_REQUIRE_ONCE,
                re: /^require_once\b/i
            },
            {
                value: PHP.Constants.T_STATIC,
                re: /^static\b/i
            },
            {
                value: PHP.Constants.T_SWITCH,
                re: /^switch\b/i
            },
            {
                value: PHP.Constants.T_THROW,
                re: /^throw\b/i
            },
            {
                value: PHP.Constants.T_TRAIT,
                re: /^trait\b/i,
            },
            {
                value: PHP.Constants.T_TRY,
                re: /^try\b/i
            },
            {
                value: PHP.Constants.T_UNSET,
                re: /^unset\b/i
            },
            {
                value: PHP.Constants.T_USE,
                re: /^use\b/i
            },
            {
                value: PHP.Constants.T_VAR,
                re: /^var\b/i
            },
            {
                value: PHP.Constants.T_WHILE,
                re: /^while\b/i
            },
            {
                value: PHP.Constants.T_LOGICAL_XOR,
                re: /^xor\b/i
            },
            {
                value: PHP.Constants.T_YIELD_FROM,
                re: /^yield\s+from\b/i
            },
            {
                value: PHP.Constants.T_YIELD,
                re: /^yield\b/i
            },
            {
                value: PHP.Constants.T_RETURN,
                re: /^return\b/i
            },
            {
                value: PHP.Constants.T_METHOD_C,
                re: /^__METHOD__\b/i
            },
            {
                value: PHP.Constants.T_LINE,
                re: /^__LINE__\b/i
            },
            {
                value: PHP.Constants.T_FILE,
                re: /^__FILE__\b/i
            },
            {
                value: PHP.Constants.T_FUNC_C,
                re: /^__FUNCTION__\b/i
            },
            {
                value: PHP.Constants.T_NS_C,
                re: /^__NAMESPACE__\b/i
            },
            {
                value: PHP.Constants.T_TRAIT_C,
                re: /^__TRAIT__\b/i
            },
            {
                value: PHP.Constants.T_DIR,
                re: /^__DIR__\b/i
            },
            {
                value: PHP.Constants.T_CLASS_C,
                re: /^__CLASS__\b/i
            },
			
            // Other tokens
            {
                value: PHP.Constants.T_AND_EQUAL,
                re: /^&=/
            },
            {
                value: PHP.Constants.T_ARRAY_CAST,
                re: /^\([ \t]*array[ \t]*\)/i
            },
            {
                value: PHP.Constants.T_BOOL_CAST,
                re: /^\([ \t]*(?:bool|boolean)[ \t]*\)/i
            },
            {
                value: PHP.Constants.T_DOUBLE_CAST,
                re: /^\([ \t]*(?:real|float|double)[ \t]*\)/i
            },
            {
                value: PHP.Constants.T_INT_CAST,
                re: /^\([ \t]*(?:int|integer)[ \t]*\)/i
            },
            {
                value: PHP.Constants.T_OBJECT_CAST,
                re: /^\([ \t]*object[ \t]*\)/i
            },
            {
                value: PHP.Constants.T_STRING_CAST,
                re: /^\([ \t]*(?:binary|string)[ \t]*\)/i
            },
            {
                value: PHP.Constants.T_UNSET_CAST,
                re: /^\([ \t]*unset[ \t]*\)/i
            },
            {
                value: PHP.Constants.T_BOOLEAN_AND,
                re: /^&&/
            },
            {
                value: PHP.Constants.T_BOOLEAN_OR,
                re: /^\|\|/
            },
            {
                value: PHP.Constants.T_CLOSE_TAG,
                re: /^(?:\?>|<\/script>)(\r\n|\r|\n)?/i,
                func: function() {
                    swapState('INITIAL');
                }
            },
            {
                value: PHP.Constants.T_DOUBLE_ARROW,
                re: /^=>/
            },
            {
                value: PHP.Constants.T_PAAMAYIM_NEKUDOTAYIM,
                re: /^::/
            },
            {
                value: PHP.Constants.T_INC,
                re: /^\+\+/
            },
            {
                value: PHP.Constants.T_DEC,
                re: /^--/
            },
            {
                value: PHP.Constants.T_CONCAT_EQUAL,
                re: /^\.=/
            },
            {
                value: PHP.Constants.T_DIV_EQUAL,
                re: /^\/=/
            },
            {
                value: PHP.Constants.T_XOR_EQUAL,
                re: /^\^=/
            },
            {
                value: PHP.Constants.T_MUL_EQUAL,
                re: /^\*=/
            },
            {
                value: PHP.Constants.T_MOD_EQUAL,
                re: /^%=/
            },
            {
                value: PHP.Constants.T_SL_EQUAL,
                re: /^<<=/
            },
            {
                value: PHP.Constants.T_START_HEREDOC,
                re: new RegExp('^[bB]?<<<[ \\t]*\'(' + labelRegexPart + ')\'(?:\\r\\n|\\r|\\n)'),
                func: function(result) {
                    heredoc = result[1];
                    swapState('NOWDOC');
                }
            },
            {
                value: PHP.Constants.T_START_HEREDOC,
                re: new RegExp('^[bB]?<<<[ \\t]*("?)(' + labelRegexPart + ')\\1(?:\\r\\n|\\r|\\n)'),
                func: function(result) {
                    heredoc = result[2];
                    heredocEndAllowed = true;
                    swapState('HEREDOC');
                }
            },
            {
                value: PHP.Constants.T_SL,
                re: /^<</
            },
            {
                value: PHP.Constants.T_SPACESHIP,
                re: /^<=>/
            },
            {
                value: PHP.Constants.T_IS_SMALLER_OR_EQUAL,
                re: /^<=/
            },
            {
                value: PHP.Constants.T_SR_EQUAL,
                re: /^>>=/
            },
            {
                value: PHP.Constants.T_SR,
                re: /^>>/
            },
            {
                value: PHP.Constants.T_IS_GREATER_OR_EQUAL,
                re: /^>=/
            },
            {
                value: PHP.Constants.T_OR_EQUAL,
                re: /^\|=/
            },
            {
                value: PHP.Constants.T_PLUS_EQUAL,
                re: /^\+=/
            },
            {
                value: PHP.Constants.T_MINUS_EQUAL,
                re: /^-=/
            },
            {
                value: PHP.Constants.T_OBJECT_OPERATOR,
                re: new RegExp('^->(?=[ \n\r\t]*' + labelRegexPart + ')'),
                func: function() {
                    pushState('LOOKING_FOR_PROPERTY');
                }
            },
            {
                value: PHP.Constants.T_OBJECT_OPERATOR,
                re: /^->/i
            },
            {
                value: PHP.Constants.T_ELLIPSIS,
                re: /^\.\.\./
            },
            {
                value: PHP.Constants.T_POW_EQUAL,
                re: /^\*\*=/
            },
            {
                value: PHP.Constants.T_POW,
                re: /^\*\*/
            },
            {
                value: PHP.Constants.T_COALESCE,
                re: /^\?\?/
            },
            {
                value: PHP.Constants.T_COMMENT,
                re: /^\/\*([\S\s]*?)(?:\*\/|$)/
            },
            {
                value: PHP.Constants.T_COMMENT,
                re: /^(?:\/\/|#)[^\r\n?]*(?:\?(?!>)[^\r\n?]*)*(?:\r\n|\r|\n)?/
            },
            {
                value: PHP.Constants.T_IS_IDENTICAL,
                re: /^===/
            },
            {
                value: PHP.Constants.T_IS_EQUAL,
                re: /^==/
            },
            {
                value: PHP.Constants.T_IS_NOT_IDENTICAL,
                re: /^!==/
            },
            {
                value: PHP.Constants.T_IS_NOT_EQUAL,
                re: /^(!=|<>)/
            },
            {
                value: PHP.Constants.T_DNUMBER,
                re: /^(?:[0-9]+\.[0-9]*|\.[0-9]+)(?:[eE][+-]?[0-9]+)?/
            },
            {
                value: PHP.Constants.T_DNUMBER,
                re: /^[0-9]+[eE][+-]?[0-9]+/
            },
            {
                value: PHP.Constants.T_LNUMBER,
                re: /^(?:0x[0-9A-F]+|0b[01]+|[0-9]+)/i
            },
            {
                value: PHP.Constants.T_VARIABLE,
                re: new RegExp('^\\$' + labelRegexPart)
            },
            {
                value: PHP.Constants.T_CONSTANT_ENCAPSED_STRING,
                re: /^[bB]?'[^'\\]*(?:\\[\s\S][^'\\]*)*'/,
            },
            {
                value: PHP.Constants.T_CONSTANT_ENCAPSED_STRING,
                re: new RegExp('^[bB]?"' + stringRegexPart('"') + '"')
            },
            {
                value: -1,
                re: /^[bB]?"/,
                func: function() {
                    swapState('DOUBLE_QUOTES');
                }
            },
            {
                value: -1,
                re: /^`/,
                func: function() {
                    swapState('BACKTICKS');
                }
            },
            {
                value: PHP.Constants.T_NS_SEPARATOR,
                re: /^\\/
            },
            {
                value: PHP.Constants.T_STRING,
                re: /^[a-zA-Z_\x7f-\uffff][a-zA-Z0-9_\x7f-\uffff]*/
            },
            {
                value: -1,
                re: /^\{/,
                func: function() {
                    pushState('IN_SCRIPTING');
                }
            },
            {
                value: -1,
                re: /^\}/,
                func: function() {
                    if (stackPos > 0) {
                        popState();
                    }
                }
            },
            {
                value: -1,
                re: /^[\[\];:?()!.,><=+-/*|&@^%"'$~]/
            }
        ],
        'DOUBLE_QUOTES': sharedStringTokens.concat([
            {
                value: -1,
                re: /^"/,
                func: function() {
                    swapState('IN_SCRIPTING');
                }
            },
            {
                value: PHP.Constants.T_ENCAPSED_AND_WHITESPACE,
                re: new RegExp('^' + stringRegexPart('"'))
            }
        ]),
        'BACKTICKS': sharedStringTokens.concat([
            {
                value: -1,
                re: /^`/,
                func: function() {
                    swapState('IN_SCRIPTING');
                }
            },
            {
                value: PHP.Constants.T_ENCAPSED_AND_WHITESPACE,
                re: new RegExp('^' + stringRegexPart('`'))
            }
        ]),
        'VAR_OFFSET': [
            {
                value: -1,
                re: /^\]/,
                func: function() {
                    popState();
                }
            },
            {
                value: PHP.Constants.T_NUM_STRING,
                re: /^(?:0x[0-9A-F]+|0b[01]+|[0-9]+)/i
            },
            {
                value: PHP.Constants.T_VARIABLE,
                re: new RegExp('^\\$' + labelRegexPart)
            },
            {
                value: PHP.Constants.T_STRING,
                re: new RegExp('^' + labelRegexPart)
            },
            {
                value: -1,
                re: /^[;:,.\[()|^&+-/*=%!~$<>?@{}"`]/
            }
        ],
        'LOOKING_FOR_PROPERTY': [
            {
                value: PHP.Constants.T_OBJECT_OPERATOR,
                re: /^->/
            },
            {
                value: PHP.Constants.T_STRING,
                re: new RegExp('^' + labelRegexPart),
                func: function() {
                    popState();
                }
            },
            {
                value: PHP.Constants.T_WHITESPACE,
                re: /^[ \n\r\t]+/
            }
        ],
        'LOOKING_FOR_VARNAME': [
            {
                value: PHP.Constants.T_STRING_VARNAME,
                re: new RegExp('^' + labelRegexPart + '(?=[\\[}])'),
                func: function() {
                    swapState('IN_SCRIPTING');
                }
            }
        ],
        'NOWDOC': [
            {
                value: PHP.Constants.T_END_HEREDOC,
                matchFunc: function(src) {
                    var re = new RegExp('^' + heredoc + '(?=;?[\\r\\n])');
                    if (src.match(re)) {
                        return [src.substr(0, heredoc.length)];
                    } else {
                        return null;
                    }
                },
                func: function() {
                    swapState('IN_SCRIPTING');
                }
            },
            {
                value: PHP.Constants.T_ENCAPSED_AND_WHITESPACE,
                matchFunc: function(src) {
                    var re = new RegExp('[\\r\\n]' + heredoc + '(?=;?[\\r\\n])');
                    var result = re.exec(src);
                    var end = result ? result.index + 1 : src.length;
                    return [src.substring(0, end)];
                }
            }
        ],
        'HEREDOC': sharedStringTokens.concat([
            {
                value: PHP.Constants.T_END_HEREDOC,
                matchFunc: function(src) {
                    if (!heredocEndAllowed) {
                        return null;
                    }
                    var re = new RegExp('^' + heredoc + '(?=;?[\\r\\n])');
                    if (src.match(re)) {
                        return [src.substr(0, heredoc.length)];
                    } else {
                        return null;
                    }
                },
                func: function() {
                    swapState('IN_SCRIPTING');
                }
            },
            {
                value: PHP.Constants.T_ENCAPSED_AND_WHITESPACE,
                matchFunc: function(src) {
                    var end = src.length;
                    // Find next interpolation
                    var re = new RegExp('^' + stringRegexPart(''));
                    var result = re.exec(src);
                    if (result) {
                        end = result[0].length;
                    }
                    // Find heredoc end
                    re = new RegExp('([\\r\\n])' + heredoc + '(?=;?[\\r\\n])');
                    result = re.exec(src.substring(0, end));
                    if (result) {
                        end = result.index + 1;
                        heredocEndAllowed = true;
                    } else {
                        heredocEndAllowed = false;
                    }
                    if (end == 0) {
                        return null;
                    }
                    return [src.substring(0, end)];
                }
            }
        ])
    };

    var results = [],
    line = 1,
    cancel = true;

    if (src === null) {
        return results;
    }

    if (typeof src !== "string") {
        src = src.toString();
    }

    while (src.length > 0 && cancel === true) {
        var state = stateStack[stackPos];
        var tokens = data[state];
        cancel = tokens.some(function(token){
            var result = token.matchFunc !== undefined
                ? token.matchFunc(src)
                : src.match(token.re);
            if (result !== null) {
                if (result[0].length == 0) {
                    // Error in the lexer definition, prevent infinite loop
                    throw new Error("empty match");
                }

                if (token.func !== undefined) {
                    token.func(result);
                }

                if (token.value === -1) {
                    // character token
                    results.push(result[0]);
                } else {
                    var resultString = result[0];
                    results.push([
                        parseInt(token.value, 10),
                        resultString,
                        line
                        ]);
                    line += resultString.split('\n').length - 1;
                }

                src = src.substring(result[0].length);

                return true;
            }
            return false;
        });
    }

    return results;
};

/*
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 15.6.2012
 * @website http://hertzen.com
 */

/*
 * The skeleton for this parser was written by Moriyoshi Koizumi and is based on
 * the work by Masato Bito and is in the PUBLIC DOMAIN.
 * Ported to JavaScript by Niklas von Hertzen
 */


PHP.Parser = function ( preprocessedTokens, eval ) {

    var yybase = this.yybase,
    yydefault = this.yydefault,
    yycheck = this.yycheck,
    yyaction = this.yyaction,
    yylen = this.yylen,
    yygbase = this.yygbase,
    yygcheck = this.yygcheck,
    yyp = this.yyp,
    yygoto = this.yygoto,
    yylhs = this.yylhs,
    terminals = this.terminals,
    translate = this.translate,
    yygdefault = this.yygdefault;


    this.pos = -1;
    this.line = 1;

    this.tokenMap = this.createTokenMap( );

    this.dropTokens = {};
    this.dropTokens[ PHP.Constants.T_WHITESPACE ] = 1;
    this.dropTokens[ PHP.Constants.T_OPEN_TAG ] = 1;
    var tokens = [];

    // pre-process
    preprocessedTokens.forEach( function( token, index ) {
        if ( typeof token === "object" && token[ 0 ] === PHP.Constants.T_OPEN_TAG_WITH_ECHO) {
            tokens.push([
                PHP.Constants.T_OPEN_TAG,
                token[ 1 ],
                token[ 2 ]
                ]);
            tokens.push([
                PHP.Constants.T_ECHO,
                token[ 1 ],
                token[ 2 ]
                ]);
        } else {
            tokens.push( token );
        }
    });
    this.tokens = tokens;

    // We start off with no lookahead-token
    var tokenId = this.TOKEN_NONE;

    // The attributes for a node are taken from the first and last token of the node.
    // From the first token only the startAttributes are taken and from the last only
    // the endAttributes. Both are merged using the array union operator (+).
    this.startAttributes = {
        'startLine': 1
    };

    this.endAttributes = {};

    // In order to figure out the attributes for the starting token, we have to keep
    // them in a stack
    var attributeStack = [ this.startAttributes ];

    // Start off in the initial state and keep a stack of previous states
    var state = 0;
    var stateStack = [ state ];

    // AST stack
    this.yyastk = [];

    // Current position in the stack(s)
    this.stackPos  = 0;

    var yyn;

    var origTokenId;


    for (;;) {

        if ( yybase[ state ] === 0 ) {
            yyn = yydefault[ state ];
        } else {
            if (tokenId === this.TOKEN_NONE ) {
                // fetch the next token id from the lexer and fetch additional info by-ref
                origTokenId = this.getNextToken( );

                // map the lexer token id to the internally used token id's
                tokenId = (origTokenId >= 0 && origTokenId < this.TOKEN_MAP_SIZE) ? translate[ origTokenId ] : this.TOKEN_INVALID;

                attributeStack[ this.stackPos ] = this.startAttributes;
            }

            if (((yyn = yybase[ state ] + tokenId) >= 0
                && yyn < this.YYLAST && yycheck[ yyn ] === tokenId
                || (state < this.YY2TBLSTATE
                    && (yyn = yybase[state + this.YYNLSTATES] + tokenId) >= 0
                    && yyn < this.YYLAST
                    && yycheck[ yyn ] === tokenId))
            && (yyn = yyaction[ yyn ]) !== this.YYDEFAULT ) {
                /*
                 * >= YYNLSTATE: shift and reduce
                 * > 0: shift
                 * = 0: accept
                 * < 0: reduce
                 * = -YYUNEXPECTED: error
                 */
                if (yyn > 0) {
                    /* shift */
                    ++this.stackPos;

                    stateStack[ this.stackPos ] = state = yyn;
                    this.yyastk[ this.stackPos ] = this.tokenValue;
                    attributeStack[ this.stackPos ] = this.startAttributes;
                    tokenId = this.TOKEN_NONE;

                    if (yyn < this.YYNLSTATES)
                        continue;

                    /* $yyn >= YYNLSTATES means shift-and-reduce */
                    yyn -= this.YYNLSTATES;
                } else {
                    yyn = -yyn;
                }
            } else {
                yyn = yydefault[ state ];
            }
        }

        for (;;) {
            /* reduce/error */

            if ( yyn === 0 ) {
                /* accept */
                return this.yyval;
            } else if (yyn !== this.YYUNEXPECTED ) {
                /* reduce */
                for (var attr in this.endAttributes) {
                    attributeStack[ this.stackPos - yylen[ yyn ] ][ attr ] = this.endAttributes[ attr ];
                }
                
                // We do not build an AST!
                // this['yyn' + yyn](attributeStack[ this.stackPos - yylen[ yyn ] ]);

                /* Goto - shift nonterminal */
                this.stackPos -= yylen[ yyn ];
                yyn = yylhs[ yyn ];
                if ((yyp = yygbase[ yyn ] + stateStack[ this.stackPos ]) >= 0
                    && yyp < this.YYGLAST
                    && yygcheck[ yyp ] === yyn) {
                    state = yygoto[ yyp ];
                } else {
                    state = yygdefault[ yyn ];
                }

                ++this.stackPos;

                stateStack[ this.stackPos ] = state;
                this.yyastk[ this.stackPos ] = this.yyval;
                attributeStack[ this.stackPos ] = this.startAttributes;
            } else {
                /* error */
                if (eval !== true) {

                    var expected = [];

                    for (var i = 0; i < this.TOKEN_MAP_SIZE; ++i) {
                        if ((yyn = yybase[ state ] + i) >= 0 && yyn < this.YYLAST && yycheck[ yyn ] == i
                         || state < this.YY2TBLSTATE
                            && (yyn = yybase[ state + this.YYNLSTATES] + i)
                            && yyn < this.YYLAST && yycheck[ yyn ] == i
                        ) {
                            if (yyaction[ yyn ] != this.YYUNEXPECTED) {
                                if (expected.length == 4) {
                                    /* Too many expected tokens */
                                    expected = [];
                                    break;
                                }

                                expected.push( this.terminals[ i ] );
                            }
                        }
                    }

                    var expectedString = '';
                    if (expected.length) {
                        expectedString = ', expecting ' + expected.join(' or ');
                    }
                    throw new PHP.ParseError('syntax error, unexpected ' + terminals[ tokenId ] + expectedString, this.startAttributes['startLine']);
                } else {
                    return this.startAttributes['startLine'];
                }

            }

            if (state < this.YYNLSTATES)
                break;
            /* >= YYNLSTATES means shift-and-reduce */
            yyn = state - this.YYNLSTATES;
        }
    }
};

PHP.ParseError = function( msg, line ) {
    this.message = msg;
    this.line = line;
};

PHP.Parser.prototype.getNextToken = function( ) {

    this.startAttributes = {};
    this.endAttributes = {};

    var token,
    tmp;

    while (this.tokens[++this.pos] !== undefined) {
        token = this.tokens[this.pos];

        if (typeof token === "string") {
            this.startAttributes['startLine'] = this.line;
            this.endAttributes['endLine'] = this.line;

            // bug in token_get_all
            if ('b"' === token) {
                this.tokenValue = 'b"';
                return '"'.charCodeAt(0);
            } else {
                this.tokenValue = token;
                return token.charCodeAt(0);
            }
        } else {



            this.line += ((tmp = token[ 1 ].match(/\n/g)) === null) ? 0 : tmp.length;

            if (PHP.Constants.T_COMMENT === token[0]) {

                if (!Array.isArray(this.startAttributes['comments'])) {
                    this.startAttributes['comments'] = [];
                }

                this.startAttributes['comments'].push( {
                    type: "comment",
                    comment: token[1],
                    line: token[2]
                });

            } else if (PHP.Constants.T_DOC_COMMENT === token[0]) {
                this.startAttributes['comments'].push( new PHPParser_Comment_Doc(token[1], token[2]) );
            } else if (this.dropTokens[token[0]] === undefined) {
                this.tokenValue = token[1];
                this.startAttributes['startLine'] = token[2];
                this.endAttributes['endLine'] = this.line;

                return this.tokenMap[token[0]];
            }
        }
    }

    this.startAttributes['startLine'] = this.line;

    // 0 is the EOF token
    return 0;
};

PHP.Parser.prototype.tokenName = function( token ) {
    var constants = ["T_INCLUDE","T_INCLUDE_ONCE","T_EVAL","T_REQUIRE","T_REQUIRE_ONCE","T_LOGICAL_OR","T_LOGICAL_XOR","T_LOGICAL_AND","T_PRINT","T_YIELD","T_DOUBLE_ARROW","T_YIELD_FROM","T_PLUS_EQUAL","T_MINUS_EQUAL","T_MUL_EQUAL","T_DIV_EQUAL","T_CONCAT_EQUAL","T_MOD_EQUAL","T_AND_EQUAL","T_OR_EQUAL","T_XOR_EQUAL","T_SL_EQUAL","T_SR_EQUAL","T_POW_EQUAL","T_COALESCE","T_BOOLEAN_OR","T_BOOLEAN_AND","T_IS_EQUAL","T_IS_NOT_EQUAL","T_IS_IDENTICAL","T_IS_NOT_IDENTICAL","T_SPACESHIP","T_IS_SMALLER_OR_EQUAL","T_IS_GREATER_OR_EQUAL","T_SL","T_SR","T_INSTANCEOF","T_INC","T_DEC","T_INT_CAST","T_DOUBLE_CAST","T_STRING_CAST","T_ARRAY_CAST","T_OBJECT_CAST","T_BOOL_CAST","T_UNSET_CAST","T_POW","T_NEW","T_CLONE","T_EXIT","T_IF","T_ELSEIF","T_ELSE","T_ENDIF","T_LNUMBER","T_DNUMBER","T_STRING","T_STRING_VARNAME","T_VARIABLE","T_NUM_STRING","T_INLINE_HTML","T_CHARACTER","T_BAD_CHARACTER","T_ENCAPSED_AND_WHITESPACE","T_CONSTANT_ENCAPSED_STRING","T_ECHO","T_DO","T_WHILE","T_ENDWHILE","T_FOR","T_ENDFOR","T_FOREACH","T_ENDFOREACH","T_DECLARE","T_ENDDECLARE","T_AS","T_SWITCH","T_ENDSWITCH","T_CASE","T_DEFAULT","T_BREAK","T_CONTINUE","T_GOTO","T_FUNCTION","T_CONST","T_RETURN","T_TRY","T_CATCH","T_FINALLY","T_THROW","T_USE","T_INSTEADOF","T_GLOBAL","T_STATIC","T_ABSTRACT","T_FINAL","T_PRIVATE","T_PROTECTED","T_PUBLIC","T_VAR","T_UNSET","T_ISSET","T_EMPTY","T_HALT_COMPILER","T_CLASS","T_TRAIT","T_INTERFACE","T_EXTENDS","T_IMPLEMENTS","T_OBJECT_OPERATOR","T_DOUBLE_ARROW","T_LIST","T_ARRAY","T_CALLABLE","T_CLASS_C","T_TRAIT_C","T_METHOD_C","T_FUNC_C","T_LINE","T_FILE","T_COMMENT","T_DOC_COMMENT","T_OPEN_TAG","T_OPEN_TAG_WITH_ECHO","T_CLOSE_TAG","T_WHITESPACE","T_START_HEREDOC","T_END_HEREDOC","T_DOLLAR_OPEN_CURLY_BRACES","T_CURLY_OPEN","T_PAAMAYIM_NEKUDOTAYIM","T_NAMESPACE","T_NS_C","T_DIR","T_NS_SEPARATOR","T_ELLIPSIS"];
    var current = "UNKNOWN";
    constants.some(function( constant ) {
        if (PHP.Constants[ constant ] === token) {
            current = constant;
            return true;
        } else {
            return false;
        }
    });

    return current;
};

/**
 * Creates the token map.
 *
 * The token map maps the PHP internal token identifiers
 * to the identifiers used by the PHP.Parser. Additionally it
 * maps T_OPEN_TAG_WITH_ECHO to T_ECHO and T_CLOSE_TAG to ';'.
 *
 * @return array The token map
 */

PHP.Parser.prototype.createTokenMap = function() {
    var tokenMap = {},
    name,
    i;
    // 256 is the minimum possible token number, as everything below
    // it is an ASCII value
    for ( i = 256; i < 1000; ++i ) {
        // T_OPEN_TAG_WITH_ECHO with dropped T_OPEN_TAG results in T_ECHO
        if( PHP.Constants.T_OPEN_TAG_WITH_ECHO === i ) {
            tokenMap[ i ] = PHP.Constants.T_ECHO;
        // T_CLOSE_TAG is equivalent to ';'
        } else if( PHP.Constants.T_CLOSE_TAG === i ) {
            tokenMap[ i ] = 59;
        // and the others can be mapped directly
        } else if ( 'UNKNOWN' !== (name = this.tokenName( i ) ) ) { 
            tokenMap[ i ] =  this[name];
        }
    }
    return tokenMap;
};


/* This is an automatically GENERATED file, which should not be manually edited.
 * Instead edit one of the following:
 *  * the grammar file grammar/zend_language_parser.jsy
 *  * the parser skeleton grammar/kymacc.js.parser
 *  * the preprocessing script grammar/rebuildParser.php
 *
 * The skeleton for this parser was written by Moriyoshi Koizumi and is based on
 * the work by Masato Bito and is in the PUBLIC DOMAIN.
 * Ported to JavaScript by Niklas von Hertzen
 */

PHP.Parser.prototype.TOKEN_NONE    = -1;
PHP.Parser.prototype.TOKEN_INVALID = 157;

PHP.Parser.prototype.TOKEN_MAP_SIZE = 392;

PHP.Parser.prototype.YYLAST       = 889;
PHP.Parser.prototype.YY2TBLSTATE  = 337;
PHP.Parser.prototype.YYGLAST      = 410;
PHP.Parser.prototype.YYNLSTATES   = 564;
PHP.Parser.prototype.YYUNEXPECTED = 32767;
PHP.Parser.prototype.YYDEFAULT    = -32766;

// {{{ Tokens
PHP.Parser.prototype.YYERRTOK = 256;
PHP.Parser.prototype.T_INCLUDE = 257;
PHP.Parser.prototype.T_INCLUDE_ONCE = 258;
PHP.Parser.prototype.T_EVAL = 259;
PHP.Parser.prototype.T_REQUIRE = 260;
PHP.Parser.prototype.T_REQUIRE_ONCE = 261;
PHP.Parser.prototype.T_LOGICAL_OR = 262;
PHP.Parser.prototype.T_LOGICAL_XOR = 263;
PHP.Parser.prototype.T_LOGICAL_AND = 264;
PHP.Parser.prototype.T_PRINT = 265;
PHP.Parser.prototype.T_YIELD = 266;
PHP.Parser.prototype.T_DOUBLE_ARROW = 267;
PHP.Parser.prototype.T_YIELD_FROM = 268;
PHP.Parser.prototype.T_PLUS_EQUAL = 269;
PHP.Parser.prototype.T_MINUS_EQUAL = 270;
PHP.Parser.prototype.T_MUL_EQUAL = 271;
PHP.Parser.prototype.T_DIV_EQUAL = 272;
PHP.Parser.prototype.T_CONCAT_EQUAL = 273;
PHP.Parser.prototype.T_MOD_EQUAL = 274;
PHP.Parser.prototype.T_AND_EQUAL = 275;
PHP.Parser.prototype.T_OR_EQUAL = 276;
PHP.Parser.prototype.T_XOR_EQUAL = 277;
PHP.Parser.prototype.T_SL_EQUAL = 278;
PHP.Parser.prototype.T_SR_EQUAL = 279;
PHP.Parser.prototype.T_POW_EQUAL = 280;
PHP.Parser.prototype.T_COALESCE = 281;
PHP.Parser.prototype.T_BOOLEAN_OR = 282;
PHP.Parser.prototype.T_BOOLEAN_AND = 283;
PHP.Parser.prototype.T_IS_EQUAL = 284;
PHP.Parser.prototype.T_IS_NOT_EQUAL = 285;
PHP.Parser.prototype.T_IS_IDENTICAL = 286;
PHP.Parser.prototype.T_IS_NOT_IDENTICAL = 287;
PHP.Parser.prototype.T_SPACESHIP = 288;
PHP.Parser.prototype.T_IS_SMALLER_OR_EQUAL = 289;
PHP.Parser.prototype.T_IS_GREATER_OR_EQUAL = 290;
PHP.Parser.prototype.T_SL = 291;
PHP.Parser.prototype.T_SR = 292;
PHP.Parser.prototype.T_INSTANCEOF = 293;
PHP.Parser.prototype.T_INC = 294;
PHP.Parser.prototype.T_DEC = 295;
PHP.Parser.prototype.T_INT_CAST = 296;
PHP.Parser.prototype.T_DOUBLE_CAST = 297;
PHP.Parser.prototype.T_STRING_CAST = 298;
PHP.Parser.prototype.T_ARRAY_CAST = 299;
PHP.Parser.prototype.T_OBJECT_CAST = 300;
PHP.Parser.prototype.T_BOOL_CAST = 301;
PHP.Parser.prototype.T_UNSET_CAST = 302;
PHP.Parser.prototype.T_POW = 303;
PHP.Parser.prototype.T_NEW = 304;
PHP.Parser.prototype.T_CLONE = 305;
PHP.Parser.prototype.T_EXIT = 306;
PHP.Parser.prototype.T_IF = 307;
PHP.Parser.prototype.T_ELSEIF = 308;
PHP.Parser.prototype.T_ELSE = 309;
PHP.Parser.prototype.T_ENDIF = 310;
PHP.Parser.prototype.T_LNUMBER = 311;
PHP.Parser.prototype.T_DNUMBER = 312;
PHP.Parser.prototype.T_STRING = 313;
PHP.Parser.prototype.T_STRING_VARNAME = 314;
PHP.Parser.prototype.T_VARIABLE = 315;
PHP.Parser.prototype.T_NUM_STRING = 316;
PHP.Parser.prototype.T_INLINE_HTML = 317;
PHP.Parser.prototype.T_CHARACTER = 318;
PHP.Parser.prototype.T_BAD_CHARACTER = 319;
PHP.Parser.prototype.T_ENCAPSED_AND_WHITESPACE = 320;
PHP.Parser.prototype.T_CONSTANT_ENCAPSED_STRING = 321;
PHP.Parser.prototype.T_ECHO = 322;
PHP.Parser.prototype.T_DO = 323;
PHP.Parser.prototype.T_WHILE = 324;
PHP.Parser.prototype.T_ENDWHILE = 325;
PHP.Parser.prototype.T_FOR = 326;
PHP.Parser.prototype.T_ENDFOR = 327;
PHP.Parser.prototype.T_FOREACH = 328;
PHP.Parser.prototype.T_ENDFOREACH = 329;
PHP.Parser.prototype.T_DECLARE = 330;
PHP.Parser.prototype.T_ENDDECLARE = 331;
PHP.Parser.prototype.T_AS = 332;
PHP.Parser.prototype.T_SWITCH = 333;
PHP.Parser.prototype.T_ENDSWITCH = 334;
PHP.Parser.prototype.T_CASE = 335;
PHP.Parser.prototype.T_DEFAULT = 336;
PHP.Parser.prototype.T_BREAK = 337;
PHP.Parser.prototype.T_CONTINUE = 338;
PHP.Parser.prototype.T_GOTO = 339;
PHP.Parser.prototype.T_FUNCTION = 340;
PHP.Parser.prototype.T_CONST = 341;
PHP.Parser.prototype.T_RETURN = 342;
PHP.Parser.prototype.T_TRY = 343;
PHP.Parser.prototype.T_CATCH = 344;
PHP.Parser.prototype.T_FINALLY = 345;
PHP.Parser.prototype.T_THROW = 346;
PHP.Parser.prototype.T_USE = 347;
PHP.Parser.prototype.T_INSTEADOF = 348;
PHP.Parser.prototype.T_GLOBAL = 349;
PHP.Parser.prototype.T_STATIC = 350;
PHP.Parser.prototype.T_ABSTRACT = 351;
PHP.Parser.prototype.T_FINAL = 352;
PHP.Parser.prototype.T_PRIVATE = 353;
PHP.Parser.prototype.T_PROTECTED = 354;
PHP.Parser.prototype.T_PUBLIC = 355;
PHP.Parser.prototype.T_VAR = 356;
PHP.Parser.prototype.T_UNSET = 357;
PHP.Parser.prototype.T_ISSET = 358;
PHP.Parser.prototype.T_EMPTY = 359;
PHP.Parser.prototype.T_HALT_COMPILER = 360;
PHP.Parser.prototype.T_CLASS = 361;
PHP.Parser.prototype.T_TRAIT = 362;
PHP.Parser.prototype.T_INTERFACE = 363;
PHP.Parser.prototype.T_EXTENDS = 364;
PHP.Parser.prototype.T_IMPLEMENTS = 365;
PHP.Parser.prototype.T_OBJECT_OPERATOR = 366;
PHP.Parser.prototype.T_LIST = 367;
PHP.Parser.prototype.T_ARRAY = 368;
PHP.Parser.prototype.T_CALLABLE = 369;
PHP.Parser.prototype.T_CLASS_C = 370;
PHP.Parser.prototype.T_TRAIT_C = 371;
PHP.Parser.prototype.T_METHOD_C = 372;
PHP.Parser.prototype.T_FUNC_C = 373;
PHP.Parser.prototype.T_LINE = 374;
PHP.Parser.prototype.T_FILE = 375;
PHP.Parser.prototype.T_COMMENT = 376;
PHP.Parser.prototype.T_DOC_COMMENT = 377;
PHP.Parser.prototype.T_OPEN_TAG = 378;
PHP.Parser.prototype.T_OPEN_TAG_WITH_ECHO = 379;
PHP.Parser.prototype.T_CLOSE_TAG = 380;
PHP.Parser.prototype.T_WHITESPACE = 381;
PHP.Parser.prototype.T_START_HEREDOC = 382;
PHP.Parser.prototype.T_END_HEREDOC = 383;
PHP.Parser.prototype.T_DOLLAR_OPEN_CURLY_BRACES = 384;
PHP.Parser.prototype.T_CURLY_OPEN = 385;
PHP.Parser.prototype.T_PAAMAYIM_NEKUDOTAYIM = 386;
PHP.Parser.prototype.T_NAMESPACE = 387;
PHP.Parser.prototype.T_NS_C = 388;
PHP.Parser.prototype.T_DIR = 389;
PHP.Parser.prototype.T_NS_SEPARATOR = 390;
PHP.Parser.prototype.T_ELLIPSIS = 391;
// }}}

/* @var array Map of token ids to their respective names */
PHP.Parser.prototype.terminals = [
    "$EOF",
    "error",
    "T_INCLUDE",
    "T_INCLUDE_ONCE",
    "T_EVAL",
    "T_REQUIRE",
    "T_REQUIRE_ONCE",
    "','",
    "T_LOGICAL_OR",
    "T_LOGICAL_XOR",
    "T_LOGICAL_AND",
    "T_PRINT",
    "T_YIELD",
    "T_DOUBLE_ARROW",
    "T_YIELD_FROM",
    "'='",
    "T_PLUS_EQUAL",
    "T_MINUS_EQUAL",
    "T_MUL_EQUAL",
    "T_DIV_EQUAL",
    "T_CONCAT_EQUAL",
    "T_MOD_EQUAL",
    "T_AND_EQUAL",
    "T_OR_EQUAL",
    "T_XOR_EQUAL",
    "T_SL_EQUAL",
    "T_SR_EQUAL",
    "T_POW_EQUAL",
    "'?'",
    "':'",
    "T_COALESCE",
    "T_BOOLEAN_OR",
    "T_BOOLEAN_AND",
    "'|'",
    "'^'",
    "'&'",
    "T_IS_EQUAL",
    "T_IS_NOT_EQUAL",
    "T_IS_IDENTICAL",
    "T_IS_NOT_IDENTICAL",
    "T_SPACESHIP",
    "'<'",
    "T_IS_SMALLER_OR_EQUAL",
    "'>'",
    "T_IS_GREATER_OR_EQUAL",
    "T_SL",
    "T_SR",
    "'+'",
    "'-'",
    "'.'",
    "'*'",
    "'/'",
    "'%'",
    "'!'",
    "T_INSTANCEOF",
    "'~'",
    "T_INC",
    "T_DEC",
    "T_INT_CAST",
    "T_DOUBLE_CAST",
    "T_STRING_CAST",
    "T_ARRAY_CAST",
    "T_OBJECT_CAST",
    "T_BOOL_CAST",
    "T_UNSET_CAST",
    "'@'",
    "T_POW",
    "'['",
    "T_NEW",
    "T_CLONE",
    "T_EXIT",
    "T_IF",
    "T_ELSEIF",
    "T_ELSE",
    "T_ENDIF",
    "T_LNUMBER",
    "T_DNUMBER",
    "T_STRING",
    "T_STRING_VARNAME",
    "T_VARIABLE",
    "T_NUM_STRING",
    "T_INLINE_HTML",
    "T_ENCAPSED_AND_WHITESPACE",
    "T_CONSTANT_ENCAPSED_STRING",
    "T_ECHO",
    "T_DO",
    "T_WHILE",
    "T_ENDWHILE",
    "T_FOR",
    "T_ENDFOR",
    "T_FOREACH",
    "T_ENDFOREACH",
    "T_DECLARE",
    "T_ENDDECLARE",
    "T_AS",
    "T_SWITCH",
    "T_ENDSWITCH",
    "T_CASE",
    "T_DEFAULT",
    "T_BREAK",
    "T_CONTINUE",
    "T_GOTO",
    "T_FUNCTION",
    "T_CONST",
    "T_RETURN",
    "T_TRY",
    "T_CATCH",
    "T_FINALLY",
    "T_THROW",
    "T_USE",
    "T_INSTEADOF",
    "T_GLOBAL",
    "T_STATIC",
    "T_ABSTRACT",
    "T_FINAL",
    "T_PRIVATE",
    "T_PROTECTED",
    "T_PUBLIC",
    "T_VAR",
    "T_UNSET",
    "T_ISSET",
    "T_EMPTY",
    "T_HALT_COMPILER",
    "T_CLASS",
    "T_TRAIT",
    "T_INTERFACE",
    "T_EXTENDS",
    "T_IMPLEMENTS",
    "T_OBJECT_OPERATOR",
    "T_LIST",
    "T_ARRAY",
    "T_CALLABLE",
    "T_CLASS_C",
    "T_TRAIT_C",
    "T_METHOD_C",
    "T_FUNC_C",
    "T_LINE",
    "T_FILE",
    "T_START_HEREDOC",
    "T_END_HEREDOC",
    "T_DOLLAR_OPEN_CURLY_BRACES",
    "T_CURLY_OPEN",
    "T_PAAMAYIM_NEKUDOTAYIM",
    "T_NAMESPACE",
    "T_NS_C",
    "T_DIR",
    "T_NS_SEPARATOR",
    "T_ELLIPSIS",
    "';'",
    "'{'",
    "'}'",
    "'('",
    "')'",
    "'`'",
    "']'",
    "'\"'",
    "'$'"
    , "???"
];

/* @var Map which translates lexer tokens to internal tokens */
PHP.Parser.prototype.translate = [
        0,  157,  157,  157,  157,  157,  157,  157,  157,  157,
      157,  157,  157,  157,  157,  157,  157,  157,  157,  157,
      157,  157,  157,  157,  157,  157,  157,  157,  157,  157,
      157,  157,  157,   53,  155,  157,  156,   52,   35,  157,
      151,  152,   50,   47,    7,   48,   49,   51,  157,  157,
      157,  157,  157,  157,  157,  157,  157,  157,   29,  148,
       41,   15,   43,   28,   65,  157,  157,  157,  157,  157,
      157,  157,  157,  157,  157,  157,  157,  157,  157,  157,
      157,  157,  157,  157,  157,  157,  157,  157,  157,  157,
      157,   67,  157,  154,   34,  157,  153,  157,  157,  157,
      157,  157,  157,  157,  157,  157,  157,  157,  157,  157,
      157,  157,  157,  157,  157,  157,  157,  157,  157,  157,
      157,  157,  157,  149,   33,  150,   55,  157,  157,  157,
      157,  157,  157,  157,  157,  157,  157,  157,  157,  157,
      157,  157,  157,  157,  157,  157,  157,  157,  157,  157,
      157,  157,  157,  157,  157,  157,  157,  157,  157,  157,
      157,  157,  157,  157,  157,  157,  157,  157,  157,  157,
      157,  157,  157,  157,  157,  157,  157,  157,  157,  157,
      157,  157,  157,  157,  157,  157,  157,  157,  157,  157,
      157,  157,  157,  157,  157,  157,  157,  157,  157,  157,
      157,  157,  157,  157,  157,  157,  157,  157,  157,  157,
      157,  157,  157,  157,  157,  157,  157,  157,  157,  157,
      157,  157,  157,  157,  157,  157,  157,  157,  157,  157,
      157,  157,  157,  157,  157,  157,  157,  157,  157,  157,
      157,  157,  157,  157,  157,  157,  157,  157,  157,  157,
      157,  157,  157,  157,  157,  157,    1,    2,    3,    4,
        5,    6,    8,    9,   10,   11,   12,   13,   14,   16,
       17,   18,   19,   20,   21,   22,   23,   24,   25,   26,
       27,   30,   31,   32,   36,   37,   38,   39,   40,   42,
       44,   45,   46,   54,   56,   57,   58,   59,   60,   61,
       62,   63,   64,   66,   68,   69,   70,   71,   72,   73,
       74,   75,   76,   77,   78,   79,   80,   81,  157,  157,
       82,   83,   84,   85,   86,   87,   88,   89,   90,   91,
       92,   93,   94,   95,   96,   97,   98,   99,  100,  101,
      102,  103,  104,  105,  106,  107,  108,  109,  110,  111,
      112,  113,  114,  115,  116,  117,  118,  119,  120,  121,
      122,  123,  124,  125,  126,  127,  128,  129,  130,  131,
      132,  133,  134,  135,  136,  137,  157,  157,  157,  157,
      157,  157,  138,  139,  140,  141,  142,  143,  144,  145,
      146,  147
];

PHP.Parser.prototype.yyaction = [
      569,  570,  571,  572,  573,  215,  574,  575,  576,  612,
      613,    0,   27,   99,  100,  101,  102,  103,  104,  105,
      106,  107,  108,  109,  110,-32766,-32766,-32766,   95,   96,
       97,   24,  240,  226, -267,-32766,-32766,-32766,-32766,-32766,
    -32766,  530,  344,  114,   98,-32766,  286,-32766,-32766,-32766,
    -32766,-32766,  577,  870,  872,-32766,-32766,-32766,-32766,-32766,
    -32766,-32766,-32766,  224,-32766,  714,  578,  579,  580,  581,
      582,  583,  584,-32766,  264,  644,  840,  841,  842,  839,
      838,  837,  585,  586,  587,  588,  589,  590,  591,  592,
      593,  594,  595,  615,  616,  617,  618,  619,  607,  608,
      609,  610,  611,  596,  597,  598,  599,  600,  601,  602,
      638,  639,  640,  641,  642,  643,  603,  604,  605,  606,
      636,  627,  625,  626,  622,  623,  116,  614,  620,  621,
      628,  629,  631,  630,  632,  633,   42,   43,  381,   44,
       45,  624,  635,  634, -214,   46,   47,  289,   48,-32767,
    -32767,-32767,-32767,   90,   91,   92,   93,   94,  267,  241,
       22,  840,  841,  842,  839,  838,  837,  832,-32766,-32766,
    -32766,  306, 1000, 1000, 1037,  120,  966,  436, -423,  244,
      797,   49,   50,  660,  661,  272,  362,   51,-32766,   52,
      219,  220,   53,   54,   55,   56,   57,   58,   59,   60,
     1016,   22,  238,   61,  351,  945,-32766,-32766,-32766,  967,
      968,  646,  705, 1000,   28, -456,  125,  966,-32766,-32766,
    -32766,  715,  398,  399,  216, 1000,-32766,  339,-32766,-32766,
    -32766,-32766,   25,  222,  980,  552,  355,  378,-32766, -423,
    -32766,-32766,-32766,  121,   65, 1045,  408, 1047, 1046,  274,
      274,  131,  244, -423,  394,  395,  358,  519,  945,  537,
     -423,  111, -426,  398,  399,  130,  972,  973,  974,  975,
      969,  970,  243,  128, -422, -421, 1013,  409,  976,  971,
      353,  791,  792,    7, -162,   63,  124,  255,  701,  256,
      274,  382, -122, -122, -122,   -4,  715,  383,  646, 1042,
     -421,  704,  274, -219,   33,   17,  384, -122,  385, -122,
      386, -122,  387, -122,  369,  388, -122, -122, -122,   34,
       35,  389,  352,  520,   36,  390,  353,  702,   62,  112,
      818,  287,  288,  391,  392, -422, -421, -161,  350,  393,
       40,   38,  690,  735,  396,  397,  361,   22,  122, -422,
     -421,-32766,-32766,-32766,  791,  792, -422, -421, -425, 1000,
     -456, -421, -238,  966,  409,   41,  382,  353,  717,  535,
     -122,-32766,  383,-32766,-32766, -421,  704,   21,  813,   33,
       17,  384, -421,  385, -466,  386,  224,  387, -467,  273,
      388,  367,  945, -458,   34,   35,  389,  352,  345,   36,
      390,  248,  247,   62,  254,  715,  287,  288,  391,  392,
      399,-32766,-32766,-32766,  393,  295, 1000,  652,  735,  396,
      397,  117,  115,  113,  814,  119,   72,   73,   74, -162,
      764,   65,  240,  541,  370,  518,  274,  118,  270,   92,
       93,   94,  242,  717,  535,   -4,   26, 1000,   75,   76,
       77,   78,   79,   80,   81,   82,   83,   84,   85,   86,
       87,   88,   89,   90,   91,   92,   93,   94,   95,   96,
       97,  547,  240,  713,  715,  382,  276,-32766,-32766,  126,
      945,  383, -161,  938,   98,  704,  225,  659,   33,   17,
      384,  346,  385,  274,  386,  728,  387,  221,  120,  388,
      505,  506,  540,   34,   35,  389,  715, -238,   36,  390,
     1017,  223,   62,  494,   18,  287,  288,  127,  297,  376,
        6,   98,  798,  393,  274,  660,  661,  490,  491, -466,
       39, -466,  514, -467,  539, -467,   16,  458, -458,  315,
      791,  792,  829,  553,  382,  817,  563,  653,  538,  765,
      383,  449,  751,  535,  704,  448,  435,   33,   17,  384,
      430,  385,  646,  386,  359,  387,  357,  647,  388,  673,
      429, 1040,   34,   35,  389,  715,  382,   36,  390,  941,
      492,   62,  383,  503,  287,  288,  704,  434,  440,   33,
       17,  384,  393,  385,-32766,  386,  445,  387,  495,  509,
      388,   10,  529,  542,   34,   35,  389,  715,  515,   36,
      390,  499,  500,   62,  214,  -80,  287,  288,  452,  269,
      736,  717,  535,  488,  393,  356,  266,  979,  265,  730,
      982,  722,  358,  338,  493,  548,    0,  294,  737,    0,
        3,    0,  309,    0,    0,  382,    0,    0,  271,    0,
        0,  383,    0,  717,  535,  704,  227,    0,   33,   17,
      384,    9,  385,    0,  386,    0,  387, -382,    0,  388,
        0,    0,  325,   34,   35,  389,  715,  382,   36,  390,
      321,  341,   62,  383,  340,  287,  288,  704,   22,  320,
       33,   17,  384,  393,  385,  442,  386,  337,  387,  562,
     1000,  388,   32,   31,  966,   34,   35,  389,  823,  657,
       36,  390,  656,  821,   62,  703,  711,  287,  288,  561,
      822,  825,  717,  535,  695,  393,  747,  749,  693,  759,
      758,  752,  767,  945,  824,  706,  700,  712,  699,  698,
      658,    0,  263,  262,  559,  558,  382,  556,  554,  551,
      398,  399,  383,  550,  717,  535,  704,  546,  545,   33,
       17,  384,  543,  385,  536,  386,   71,  387,  933,  932,
      388,   30,   65,  731,   34,   35,  389,  274,  724,   36,
      390,  830,  734,   62,  663,  662,  287,  288,-32766,-32766,
    -32766,  733,  732,  934,  393,  665,  664,  756,  555,  691,
     1041, 1001,  994, 1006, 1011, 1014,  757, 1043,-32766,  654,
    -32766,-32766,-32766,-32766,-32766,-32766,-32767,-32767,-32767,-32767,
    -32767,  655, 1044,  717,  535, -446,  926,  348,  343,  268,
      237,  236,  235,  234,  218,  217,  132,  129, -426, -425,
     -424,  123,   20,   23,   70,   69,   29,   37,   64,   68,
       66,   67, -448,    0,   15,   19,  250,  910,  296, -217,
      467,  484,  909,  472,  528,  913,   11,  964,  955, -215,
      525,  379,  375,  373,  371,   14,   13,   12, -214,    0,
     -393,    0, 1005, 1039,  992,  993,  963,    0,  981
];

PHP.Parser.prototype.yycheck = [
        2,    3,    4,    5,    6,   13,    8,    9,   10,   11,
       12,    0,   15,   16,   17,   18,   19,   20,   21,   22,
       23,   24,   25,   26,   27,    8,    9,   10,   50,   51,
       52,    7,   54,    7,   79,    8,    9,   10,    8,    9,
       10,   77,    7,   13,   66,   28,    7,   30,   31,   32,
       33,   34,   54,   56,   57,   28,    8,   30,   31,   32,
       33,   34,   35,   35,  109,    1,   68,   69,   70,   71,
       72,   73,   74,  118,    7,   77,  112,  113,  114,  115,
      116,  117,   84,   85,   86,   87,   88,   89,   90,   91,
       92,   93,   94,   95,   96,   97,   98,   99,  100,  101,
      102,  103,  104,  105,  106,  107,  108,  109,  110,  111,
      112,  113,  114,  115,  116,  117,  118,  119,  120,  121,
      122,  123,  124,  125,  126,  127,    7,  129,  130,  131,
      132,  133,  134,  135,  136,  137,    2,    3,    4,    5,
        6,  143,  144,  145,  152,   11,   12,    7,   14,   41,
       42,   43,   44,   45,   46,   47,   48,   49,  109,    7,
       67,  112,  113,  114,  115,  116,  117,  118,    8,    9,
       10,   79,   79,   79,   82,  147,   83,   82,   67,   28,
      152,   47,   48,  102,  103,    7,    7,   53,   28,   55,
       56,   57,   58,   59,   60,   61,   62,   63,   64,   65,
        1,   67,   68,   69,   70,  112,    8,    9,   10,   75,
       76,   77,  148,   79,   13,    7,   67,   83,    8,    9,
       10,    1,  129,  130,   13,   79,   28,  146,   30,   31,
       32,   33,  140,  141,  139,   29,  102,    7,   28,  128,
       30,   31,   32,  149,  151,   77,  112,   79,   80,  156,
      156,   15,   28,  142,  120,  121,  146,   77,  112,  149,
      149,   15,  151,  129,  130,   15,  132,  133,  134,  135,
      136,  137,  138,   15,   67,   67,   77,  143,  144,  145,
      146,  130,  131,    7,    7,  151,   15,  153,  148,  155,
      156,   71,   72,   73,   74,    0,    1,   77,   77,  150,
       67,   81,  156,  152,   84,   85,   86,   87,   88,   89,
       90,   91,   92,   93,   29,   95,   96,   97,   98,   99,
      100,  101,  102,  143,  104,  105,  146,  148,  108,   15,
      150,  111,  112,  113,  114,  128,  128,    7,    7,  119,
       67,   67,  122,  123,  124,  125,    7,   67,  149,  142,
      142,    8,    9,   10,  130,  131,  149,  149,  151,   79,
      152,  128,    7,   83,  143,    7,   71,  146,  148,  149,
      150,   28,   77,   30,   31,  142,   81,    7,  148,   84,
       85,   86,  149,   88,    7,   90,   35,   92,    7,   33,
       95,    7,  112,    7,   99,  100,  101,  102,  103,  104,
      105,  128,  128,  108,  109,    1,  111,  112,  113,  114,
      130,    8,    9,   10,  119,  142,   79,  122,  123,  124,
      125,   15,  149,  149,  148,   29,    8,    9,   10,  152,
       29,  151,   54,   29,  149,   79,  156,   15,  143,   47,
       48,   49,   29,  148,  149,  150,   28,   79,   30,   31,
       32,   33,   34,   35,   36,   37,   38,   39,   40,   41,
       42,   43,   44,   45,   46,   47,   48,   49,   50,   51,
       52,   29,   54,   29,    1,   71,   67,    8,    9,   29,
      112,   77,  152,  152,   66,   81,   35,  148,   84,   85,
       86,  123,   88,  156,   90,   35,   92,   35,  147,   95,
       72,   73,   29,   99,  100,  101,    1,  152,  104,  105,
      152,   35,  108,   72,   73,  111,  112,   97,   98,  102,
      103,   66,  152,  119,  156,  102,  103,  106,  107,  152,
       67,  154,   74,  152,   29,  154,  152,  128,  152,   78,
      130,  131,  148,  149,   71,  148,  149,  148,  149,  148,
       77,   77,  148,  149,   81,   77,   77,   84,   85,   86,
       77,   88,   77,   90,   77,   92,   77,   77,   95,   77,
       77,   77,   99,  100,  101,    1,   71,  104,  105,   79,
       79,  108,   77,   79,  111,  112,   81,   79,   82,   84,
       85,   86,  119,   88,   82,   90,   86,   92,   87,   96,
       95,   94,   89,   29,   99,  100,  101,    1,   91,  104,
      105,   93,   96,  108,   94,   94,  111,  112,   94,  110,
      123,  148,  149,  109,  119,  102,  127,  139,  126,  147,
      139,  150,  146,  149,  154,   29,   -1,  142,  123,   -1,
      142,   -1,  146,   -1,   -1,   71,   -1,   -1,  126,   -1,
       -1,   77,   -1,  148,  149,   81,   35,   -1,   84,   85,
       86,  142,   88,   -1,   90,   -1,   92,  142,   -1,   95,
       -1,   -1,  146,   99,  100,  101,    1,   71,  104,  105,
      146,  146,  108,   77,  146,  111,  112,   81,   67,  146,
       84,   85,   86,  119,   88,  146,   90,  149,   92,  148,
       79,   95,  148,  148,   83,   99,  100,  101,  148,  148,
      104,  105,  148,  148,  108,  148,  148,  111,  112,  148,
      148,  148,  148,  149,  148,  119,  148,  148,  148,  148,
      148,  148,  148,  112,  148,  148,  148,  148,  148,  148,
      148,   -1,  149,  149,  149,  149,   71,  149,  149,  149,
      129,  130,   77,  149,  148,  149,   81,  149,  149,   84,
       85,   86,  149,   88,  149,   90,  149,   92,  150,  150,
       95,  151,  151,  150,   99,  100,  101,  156,  150,  104,
      105,  150,  150,  108,  150,  150,  111,  112,    8,    9,
       10,  150,  150,  150,  119,  150,  150,  150,  150,  150,
      150,  150,  150,  150,  150,  150,  150,  150,   28,  150,
       30,   31,   32,   33,   34,   35,   36,   37,   38,   39,
       40,  150,  150,  148,  149,  151,  153,  151,  151,  151,
      151,  151,  151,  151,  151,  151,  151,  151,  151,  151,
      151,  151,  151,  151,  151,  151,  151,  151,  151,  151,
      151,  151,  151,   -1,  152,  152,  152,  152,  152,  152,
      152,  152,  152,  152,  152,  152,  152,  152,  152,  152,
      152,  152,  152,  152,  152,  152,  152,  152,  152,   -1,
      153,   -1,  154,  154,  154,  154,  154,   -1,  155
];

PHP.Parser.prototype.yybase = [
        0,  220,  295,   94,  180,  560,   -2,   -2,   -2,   -2,
      -36,  473,  574,  606,  574,  505,  404,  675,  675,  675,
       28,  351,  462,  462,  462,  461,  396,  476,  451,  134,
      134,  134,  134,  134,  134,  134,  134,  134,  134,  134,
      134,  134,  134,  134,  134,  134,  134,  134,  134,  134,
      134,  134,  134,  134,  134,  134,  134,  134,  134,  134,
      134,  134,  134,  134,  134,  134,  134,  134,  134,  134,
      134,  134,  134,  134,  134,  134,  134,  134,  134,  134,
      134,  134,  134,  134,  134,  134,  134,  134,  134,  134,
      134,  134,  134,  134,  134,  134,  134,  134,  134,  134,
      134,  134,  134,  134,  134,  134,  134,  134,  134,  134,
      134,  134,  134,  134,  134,  134,  134,  134,  134,  134,
      134,  134,  134,  134,  134,  134,  134,  134,  134,  134,
      134,  134,  134,  401,   64,  201,  568,  704,  713,  708,
      702,  714,  520,  706,  705,  211,  650,  651,  450,  652,
      653,  654,  655,  709,  480,  703,  712,  418,  418,  418,
      418,  418,  418,  418,  418,  418,  418,  418,  418,  418,
      418,  418,  418,   48,   30,  469,  403,  403,  403,  403,
      403,  403,  403,  403,  403,  403,  403,  403,  403,  403,
      403,  403,  403,  403,  403,  160,  160,  160,  343,  210,
      208,  198,   17,  233,   27,  780,  780,  780,  780,  780,
      108,  108,  108,  108,  621,  621,   93,  280,  280,  280,
      280,  280,  280,  280,  280,  280,  280,  280,  632,  641,
      642,  643,  392,  392,  151,  151,  151,  151,  368,  -45,
      146,  224,  224,   95,  410,  491,  733,  199,  199,  111,
      207,  -22,  -22,  -22,   81,  506,   92,   92,  233,  233,
      273,  233,  423,  423,  423,  221,  221,  221,  221,  221,
      110,  221,  221,  221,  617,  512,  168,  516,  647,  397,
      503,  656,  274,  381,  377,  538,  535,  337,  523,  337,
      421,  441,  428,  525,  337,  337,  285,  401,  394,  378,
      567,  474,  339,  564,  140,  179,  409,  399,  384,  594,
      561,  711,  330,  710,  358,  149,  378,  378,  378,  370,
      593,  548,  355,   -8,  646,  484,  277,  417,  386,  645,
      635,  230,  634,  276,  331,  356,  565,  485,  485,  485,
      485,  485,  485,  460,  485,  483,  691,  691,  478,  501,
      460,  696,  460,  485,  691,  460,  460,  502,  485,  522,
      522,  483,  508,  499,  691,  691,  499,  478,  460,  571,
      551,  514,  482,  413,  413,  514,  460,  413,  501,  413,
       11,  697,  699,  444,  700,  695,  698,  676,  694,  493,
      615,  497,  515,  684,  683,  693,  479,  489,  620,  692,
      549,  592,  487,  246,  314,  498,  463,  689,  523,  486,
      455,  455,  455,  463,  687,  455,  455,  455,  455,  455,
      455,  455,  455,  732,   24,  495,  510,  591,  590,  589,
      406,  588,  496,  524,  422,  599,  488,  549,  549,  649,
      727,  673,  490,  682,  716,  690,  555,  119,  271,  681,
      648,  543,  492,  534,  680,  598,  246,  715,  494,  672,
      549,  671,  455,  674,  701,  730,  731,  688,  728,  722,
      152,  526,  587,  178,  729,  659,  596,  595,  554,  725,
      707,  721,  720,  178,  576,  511,  717,  518,  677,  504,
      678,  613,  258,  657,  686,  584,  724,  723,  726,  583,
      582,  609,  608,  250,  236,  685,  442,  458,  517,  581,
      500,  628,  604,  679,  580,  579,  623,  619,  718,  521,
      486,  519,  509,  507,  513,  600,  618,  719,  206,  578,
      586,  573,  481,  572,  631,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,  134,  134,   -2,   -2,   -2,
        0,    0,    0,    0,   -2,  134,  134,  134,  134,  134,
      134,  134,  134,  134,  134,  134,  134,  134,  134,  134,
      134,  134,  134,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,  418,  418,  418,
      418,  418,  418,  418,  418,  418,  418,  418,  418,  418,
      418,  418,  418,  418,  418,  418,  418,  418,  418,  418,
      418,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,  418,  418,  418,
      418,  418,  418,  418,  418,  418,  418,  418,  418,  418,
      418,  418,  418,  418,  418,  418,  418,  418,  418,  418,
      418,  418,  418,  418,   -3,  418,  418,   -3,  418,  418,
      418,  418,  418,  418,  -22,  -22,  -22,  -22,  221,  221,
      221,  221,  221,  221,  221,  221,  221,  221,  221,  221,
      221,  221,   49,   49,   49,   49,  -22,  -22,  221,  221,
      221,  221,  221,   49,  221,  221,  221,   92,  221,   92,
       92,  337,  337,    0,    0,    0,    0,    0,  485,   92,
        0,    0,    0,    0,    0,    0,  485,  485,  485,    0,
        0,    0,    0,    0,  485,    0,    0,    0,  337,   92,
        0,  420,  420,  178,  420,  420,    0,    0,    0,  485,
      485,    0,  508,    0,    0,    0,    0,  691,    0,    0,
        0,    0,    0,  455,  119,  682,    0,   39,    0,    0,
        0,    0,    0,  490,   39,   26,    0,   26,    0,    0,
      455,  455,  455,    0,  490,  490,    0,    0,   67,  490,
        0,    0,    0,   67,   35,    0,   35,    0,    0,    0,
      178
];

PHP.Parser.prototype.yydefault = [
        3,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,  468,  468,  468,32767,32767,32767,32767,  285,
      460,  285,  285,32767,  419,  419,  419,  419,  419,  419,
      419,  460,32767,32767,32767,32767,32767,  364,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,  465,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,  347,  348,  350,
      351,  284,  420,  237,  464,  283,  116,  246,  239,  191,
      282,  223,  119,  312,  365,  314,  363,  367,  313,  290,
      294,  295,  296,  297,  298,  299,  300,  301,  302,  303,
      304,  305,  288,  289,  366,  344,  343,  342,  310,  311,
      287,  315,  317,  287,  316,  333,  334,  331,  332,  335,
      336,  337,  338,  339,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,  269,  269,
      269,  269,  324,  325,  229,  229,  229,  229,32767,  270,
    32767,  229,32767,32767,32767,32767,32767,32767,32767,  413,
      341,  319,  320,  318,32767,  392,32767,  394,  307,  309,
      387,  291,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,  389,  421,  421,32767,32767,32767,  381,32767,
      159,  210,  212,  397,32767,32767,32767,32767,32767,  329,
    32767,32767,32767,32767,32767,32767,  474,32767,32767,32767,
    32767,32767,  421,32767,32767,32767,  321,  322,  323,32767,
    32767,32767,  421,  421,32767,32767,  421,32767,  421,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,  163,32767,32767,  395,  395,32767,32767,
      163,  390,  163,32767,32767,  163,  163,  176,32767,  174,
      174,32767,32767,  178,32767,  435,  178,32767,  163,  196,
      196,  373,  165,  231,  231,  373,  163,  231,32767,  231,
    32767,32767,32767,   82,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
      383,32767,32767,32767,  401,32767,  414,  433,  381,32767,
      327,  328,  330,32767,  423,  352,  353,  354,  355,  356,
      357,  358,  360,32767,  461,  386,32767,32767,32767,32767,
    32767,32767,   84,  108,  245,32767,  473,   84,  384,32767,
      473,32767,32767,32767,32767,32767,32767,  286,32767,32767,
    32767,   84,32767,   84,32767,32767,  457,32767,32767,  421,
      385,32767,  326,  398,  439,32767,32767,  422,32767,32767,
      218,   84,32767,  177,32767,32767,32767,32767,32767,32767,
      401,32767,32767,  179,32767,32767,  421,32767,32767,32767,
    32767,32767,  281,32767,32767,32767,32767,32767,  421,32767,
    32767,32767,32767,  222,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,   82,
       60,32767,  263,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,  121,  121,    3,    3,  121,
      121,  121,  121,  121,  121,  121,  121,  121,  121,  121,
      121,  121,  121,  121,  248,  154,  248,  204,  248,  248,
      207,  196,  196,  255
];

PHP.Parser.prototype.yygoto = [
      163,  163,  135,  135,  135,  146,  148,  179,  164,  161,
      145,  161,  161,  161,  162,  162,  162,  162,  162,  162,
      162,  145,  157,  158,  159,  160,  176,  174,  177,  410,
      411,  299,  412,  415,  416,  417,  418,  419,  420,  421,
      422,  857,  136,  137,  138,  139,  140,  141,  142,  143,
      144,  147,  173,  175,  178,  195,  198,  199,  201,  202,
      204,  205,  206,  207,  208,  209,  210,  211,  212,  213,
      232,  233,  251,  252,  253,  316,  317,  318,  462,  180,
      181,  182,  183,  184,  185,  186,  187,  188,  189,  190,
      191,  192,  193,  149,  194,  150,  165,  166,  167,  196,
      168,  151,  152,  153,  169,  154,  197,  133,  170,  155,
      171,  172,  156,  521,  200,  257,  246,  464,  432,  687,
      649,  278,  481,  482,  527,  200,  437,  437,  437,  766,
        5,  746,  650,  557,  437,  426,  775,  770,  428,  431,
      444,  465,  466,  468,  483,  279,  651,  336,  450,  453,
      437,  560,  485,  487,  508,  511,  763,  516,  517,  777,
      524,  762,  526,  532,  773,  534,  480,  480,  965,  965,
      965,  965,  965,  965,  965,  965,  965,  965,  965,  965,
      413,  413,  413,  413,  413,  413,  413,  413,  413,  413,
      413,  413,  413,  413,  942,  502,  478,  496,  512,  456,
      298,  437,  437,  451,  471,  437,  437,  674,  437,  229,
      456,  230,  231,  463,  828,  533,  681,  438,  513,  826,
      461,  475,  460,  414,  414,  414,  414,  414,  414,  414,
      414,  414,  414,  414,  414,  414,  414,  301,  674,  674,
      443,  454, 1033, 1033, 1034, 1034,  425,  531,  425,  708,
      750,  800,  457,  372, 1033,  943, 1034, 1026,  300, 1018,
      497,    8,  313,  904,  796,  944,  996,  785,  789, 1007,
      285,  670, 1036,  329,  307,  310,  804,  668,  544,  332,
      935,  940,  366,  807,  678,  477,  377,  754,  844,    0,
      667,  667,  675,  675,  675,  677,    0,  666,  323,  498,
      328,  312,  312,  258,  259,  283,  459,  261,  322,  284,
      326,  486,  280,  281,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,  790,  790,  790,  790,  946,    0,  946,
      790,  790, 1004,  790, 1004,    0,    0,    0,    0,  836,
        0, 1015, 1015,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,  744,  744,  744,  720,  744,    0,
      739,  745,  721,  780,  780, 1023,    0,    0, 1002,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,  806,    0,  806,    0,    0,    0,    0, 1008, 1009
];

PHP.Parser.prototype.yygcheck = [
       23,   23,   23,   23,   23,   23,   23,   23,   23,   23,
       23,   23,   23,   23,   23,   23,   23,   23,   23,   23,
       23,   23,   23,   23,   23,   23,   23,   23,   23,   23,
       23,   23,   23,   23,   23,   23,   23,   23,   23,   23,
       23,   23,   23,   23,   23,   23,   23,   23,   23,   23,
       23,   23,   23,   23,   23,   23,   23,   23,   23,   23,
       23,   23,   23,   23,   23,   23,   23,   23,   23,   23,
       23,   23,   23,   23,   23,   23,   23,   23,   23,   23,
       23,   23,   23,   23,   23,   23,   23,   23,   23,   23,
       23,   23,   23,   23,   23,   23,   23,   23,   23,   23,
       23,   23,   23,   23,   23,   23,   23,   23,   23,   23,
       23,   23,   23,   52,   45,  112,  112,   80,    8,   10,
       10,   64,   55,   55,   55,   45,    8,    8,    8,   10,
       92,   10,   11,   10,    8,   10,   10,   10,   38,   38,
       38,   38,   38,   38,   62,   62,   12,   62,   28,    8,
        8,   28,   28,   28,   28,   28,   28,   28,   28,   28,
       28,   28,   28,   28,   28,   28,   70,   70,   70,   70,
       70,   70,   70,   70,   70,   70,   70,   70,   70,   70,
      113,  113,  113,  113,  113,  113,  113,  113,  113,  113,
      113,  113,  113,  113,   76,   56,   35,   35,   56,   69,
       56,    8,    8,    8,    8,    8,    8,   19,    8,   60,
       69,   60,   60,    7,    7,    7,   25,    8,    7,    7,
        2,    2,    8,  115,  115,  115,  115,  115,  115,  115,
      115,  115,  115,  115,  115,  115,  115,   53,   19,   19,
       53,   53,  123,  123,  124,  124,  109,    5,  109,   44,
       29,   78,  114,   53,  123,   76,  124,  122,   41,  120,
       43,   53,   42,   96,   74,   76,   76,   72,   75,  117,
       14,   21,  123,   18,    9,   13,   79,   20,   66,   17,
      102,  104,   58,   81,   22,   59,  100,   63,   94,   -1,
       19,   19,   19,   19,   19,   19,   -1,   19,   45,   45,
       45,   45,   45,   45,   45,   45,   45,   45,   45,   45,
       45,   45,   64,   64,   -1,   -1,   -1,   -1,   -1,   -1,
       -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,
       -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,
       -1,   -1,   -1,   52,   52,   52,   52,   52,   -1,   52,
       52,   52,   80,   52,   80,   -1,   -1,   -1,   -1,   92,
       -1,   80,   80,   -1,   -1,   -1,   -1,   -1,   -1,   -1,
       -1,   -1,   -1,   -1,   52,   52,   52,   52,   52,   -1,
       52,   52,   52,   69,   69,   69,   -1,   -1,   80,   -1,
       -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,
       -1,   80,   -1,   80,   -1,   -1,   -1,   -1,   80,   80
];

PHP.Parser.prototype.yygbase = [
        0,    0, -317,    0,    0,  237,    0,  210, -136,    4,
      118,  130,  144,  -10,   16,    0,    0,  -59,   10,  -47,
       -9,    7,  -77,  -20,    0,  209,    0,    0, -388,  234,
        0,    0,    0,    0,    0,  165,    0,    0,  103,    0,
        0,  225,   44,   45,  235,   84,    0,    0,    0,    0,
        0,    0,  109, -115,    0, -113, -179,    0,  -78,  -81,
     -347,    0, -122,  -80, -249,    0,  -19,    0,    0,  169,
      -48,    0,   26,    0,   22,   24,  -99,    0,  230,  -13,
      114,  -79,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,  120,    0,  -90,    0,   23,    0,    0,    0,
      -89,    0,  -67,    0,  -69,    0,    0,    0,    0,    8,
        0,    0, -140,  -34,  229,    9,    0,   21,    0,    0,
      218,    0,  233,   -3,   -1,    0
];

PHP.Parser.prototype.yygdefault = [
    -32768,  380,  565,    2,  566,  637,  645,  504,  400,  433,
      748,  688,  689,  303,  342,  401,  302,  330,  324,  676,
      669,  671,  679,  134,  333,  682,    1,  684,  439,  716,
      291,  692,  292,  507,  694,  446,  696,  697,  427,  304,
      305,  447,  311,  479,  707,  203,  308,  709,  290,  710,
      719,  335,  293,  510,  489,  469,  501,  402,  363,  476,
      228,  455,  473,  753,  277,  761,  549,  769,  772,  403,
      404,  470,  784,  368,  794,  788,  960,  319,  799,  805,
      991,  808,  811,  349,  331,  327,  815,  816,    4,  820,
      522,  523,  835,  239,  843,  856,  347,  923,  925,  441,
      374,  936,  360,  334,  939,  995,  354,  405,  364,  952,
      260,  282,  245,  406,  423,  249,  407,  365,  998,  314,
     1019,  424, 1027, 1035,  275,  474
];

PHP.Parser.prototype.yylhs = [
        0,    1,    3,    3,    2,    5,    5,    5,    5,    5,
        5,    5,    5,    5,    5,    5,    5,    5,    5,    5,
        5,    5,    5,    5,    5,    5,    5,    5,    5,    5,
        5,    5,    5,    5,    5,    5,    5,    5,    5,    5,
        5,    5,    5,    5,    5,    5,    5,    5,    5,    5,
        5,    5,    5,    5,    5,    5,    5,    5,    5,    5,
        5,    5,    5,    5,    5,    5,    5,    5,    5,    5,
        5,    5,    5,    6,    6,    6,    6,    6,    6,    6,
        7,    7,    8,    8,    9,    4,    4,    4,    4,    4,
        4,    4,    4,    4,    4,    4,   14,   14,   15,   15,
       15,   15,   17,   17,   13,   13,   18,   18,   19,   19,
       20,   20,   21,   21,   16,   16,   22,   24,   24,   25,
       26,   26,   28,   27,   27,   27,   27,   29,   29,   29,
       29,   29,   29,   29,   29,   29,   29,   29,   29,   29,
       29,   29,   29,   29,   29,   29,   29,   29,   29,   29,
       29,   29,   10,   10,   48,   48,   51,   51,   50,   49,
       49,   42,   42,   53,   53,   54,   54,   11,   12,   12,
       12,   57,   57,   57,   58,   58,   61,   61,   59,   59,
       62,   62,   36,   36,   44,   44,   47,   47,   47,   46,
       46,   63,   37,   37,   37,   37,   64,   64,   65,   65,
       66,   66,   34,   34,   30,   30,   67,   32,   32,   68,
       31,   31,   33,   33,   43,   43,   43,   43,   55,   55,
       71,   71,   72,   72,   74,   74,   75,   75,   75,   73,
       73,   56,   56,   76,   76,   77,   77,   78,   78,   78,
       39,   39,   79,   40,   40,   81,   81,   60,   60,   82,
       82,   82,   82,   87,   87,   88,   88,   89,   89,   89,
       89,   89,   90,   91,   91,   86,   86,   83,   83,   85,
       85,   93,   93,   92,   92,   92,   92,   92,   92,   84,
       84,   94,   94,   41,   41,   35,   35,   23,   23,   23,
       23,   23,   23,   23,   23,   23,   23,   23,   23,   23,
       23,   23,   23,   23,   23,   23,   23,   23,   23,   23,
       23,   23,   23,   23,   23,   23,   23,   23,   23,   23,
       23,   23,   23,   23,   23,   23,   23,   23,   23,   23,
       23,   23,   23,   23,   23,   23,   23,   23,   23,   23,
       23,   23,   23,   23,   23,   23,   23,   23,   23,   23,
       23,   23,   23,   23,   23,   23,   23,   23,   23,   23,
       23,   23,   23,   23,   23,   23,   23,   23,   23,   23,
      101,   95,   95,  100,  100,  103,  103,  104,  105,  105,
      105,  109,  109,   52,   52,   52,   96,   96,  107,  107,
       97,   97,   99,   99,   99,  102,  102,  113,  113,   70,
      115,  115,  115,   98,   98,   98,   98,   98,   98,   98,
       98,   98,   98,   98,   98,   98,   98,   98,   98,   38,
       38,  111,  111,  111,  106,  106,  106,  116,  116,  116,
      116,  116,  116,   45,   45,   45,   80,   80,   80,  118,
      110,  110,  110,  110,  110,  110,  108,  108,  108,  117,
      117,  117,  117,   69,  119,  119,  120,  120,  120,  120,
      120,  114,  121,  121,  122,  122,  122,  122,  122,  112,
      112,  112,  112,  124,  123,  123,  123,  123,  123,  123,
      123,  125,  125,  125
];

PHP.Parser.prototype.yylen = [
        1,    1,    2,    0,    1,    1,    1,    1,    1,    1,
        1,    1,    1,    1,    1,    1,    1,    1,    1,    1,
        1,    1,    1,    1,    1,    1,    1,    1,    1,    1,
        1,    1,    1,    1,    1,    1,    1,    1,    1,    1,
        1,    1,    1,    1,    1,    1,    1,    1,    1,    1,
        1,    1,    1,    1,    1,    1,    1,    1,    1,    1,
        1,    1,    1,    1,    1,    1,    1,    1,    1,    1,
        1,    1,    1,    1,    1,    1,    1,    1,    1,    1,
        1,    1,    1,    3,    1,    1,    1,    1,    1,    3,
        5,    4,    3,    4,    2,    3,    1,    1,    7,    8,
        6,    7,    3,    1,    3,    1,    3,    1,    1,    3,
        1,    2,    1,    2,    3,    1,    3,    3,    1,    3,
        2,    0,    1,    1,    1,    1,    1,    3,    7,   10,
        5,    7,    9,    5,    3,    3,    3,    3,    3,    3,
        1,    2,    5,    7,    9,    5,    6,    3,    3,    2,
        2,    1,    1,    1,    0,    2,    1,    3,    8,    0,
        4,    1,    3,    0,    1,    0,    1,   10,    7,    6,
        5,    1,    2,    2,    0,    2,    0,    2,    0,    2,
        1,    3,    1,    4,    1,    4,    1,    1,    4,    1,
        3,    3,    3,    4,    4,    5,    0,    2,    4,    3,
        1,    1,    1,    4,    0,    2,    5,    0,    2,    6,
        0,    2,    0,    3,    1,    2,    1,    1,    1,    0,
        1,    3,    4,    6,    1,    2,    1,    1,    1,    0,
        1,    0,    2,    2,    3,    1,    3,    1,    2,    2,
        3,    1,    1,    3,    1,    1,    3,    2,    0,    3,
        4,    9,    3,    1,    3,    0,    2,    4,    5,    4,
        4,    4,    3,    1,    1,    1,    3,    1,    1,    0,
        1,    1,    2,    1,    1,    1,    1,    1,    1,    1,
        3,    1,    3,    3,    1,    0,    1,    1,    3,    3,
        3,    4,    1,    2,    3,    3,    3,    3,    3,    3,
        3,    3,    3,    3,    3,    3,    2,    2,    2,    2,
        3,    3,    3,    3,    3,    3,    3,    3,    3,    3,
        3,    3,    3,    3,    3,    3,    3,    2,    2,    2,
        2,    3,    3,    3,    3,    3,    3,    3,    3,    3,
        3,    3,    5,    4,    3,    4,    4,    2,    2,    4,
        2,    2,    2,    2,    2,    2,    2,    2,    2,    2,
        2,    1,    3,    2,    1,    2,    4,    2,   10,   11,
        7,    3,    2,    0,    4,    1,    3,    2,    2,    2,
        4,    1,    1,    1,    2,    3,    1,    1,    1,    1,
        0,    3,    0,    1,    1,    0,    1,    1,    3,    3,
        4,    1,    1,    1,    1,    1,    1,    1,    1,    1,
        1,    1,    1,    1,    1,    3,    2,    3,    3,    0,
        1,    1,    3,    1,    1,    3,    1,    1,    4,    4,
        4,    1,    4,    1,    1,    3,    1,    4,    2,    3,
        1,    4,    4,    3,    3,    3,    1,    3,    1,    1,
        3,    1,    1,    4,    3,    1,    1,    1,    3,    3,
        0,    1,    3,    1,    3,    1,    4,    2,    0,    2,
        2,    1,    2,    1,    1,    4,    3,    3,    3,    6,
        3,    1,    1,    1
];



exports.PHP = PHP;
});
