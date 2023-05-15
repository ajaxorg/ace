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


define(function (require, exports, module) {

	var PHP = {Constants: {}};

	PHP.Constants.T_THROW = 317
	PHP.Constants.T_INCLUDE = 272
	PHP.Constants.T_INCLUDE_ONCE = 273
	PHP.Constants.T_EVAL = 274
	PHP.Constants.T_REQUIRE = 275
	PHP.Constants.T_REQUIRE_ONCE = 276
	PHP.Constants.T_LOGICAL_OR = 277
	PHP.Constants.T_LOGICAL_XOR = 278
	PHP.Constants.T_LOGICAL_AND = 279
	PHP.Constants.T_PRINT = 280
	PHP.Constants.T_YIELD = 281
	PHP.Constants.T_DOUBLE_ARROW = 386
	PHP.Constants.T_YIELD_FROM = 282
	PHP.Constants.T_PLUS_EQUAL = 352
	PHP.Constants.T_MINUS_EQUAL = 353
	PHP.Constants.T_MUL_EQUAL = 354
	PHP.Constants.T_DIV_EQUAL = 355
	PHP.Constants.T_CONCAT_EQUAL = 356
	PHP.Constants.T_MOD_EQUAL = 357
	PHP.Constants.T_AND_EQUAL = 358
	PHP.Constants.T_OR_EQUAL = 359
	PHP.Constants.T_XOR_EQUAL = 360
	PHP.Constants.T_SL_EQUAL = 361
	PHP.Constants.T_SR_EQUAL = 362
	PHP.Constants.T_POW_EQUAL = 402
	PHP.Constants.T_COALESCE_EQUAL = 363
	PHP.Constants.T_COALESCE = 400
	PHP.Constants.T_BOOLEAN_OR = 364
	PHP.Constants.T_BOOLEAN_AND = 365
	PHP.Constants.T_AMPERSAND_NOT_FOLLOWED_BY_VAR_OR_VARARG = 404
	PHP.Constants.T_AMPERSAND_FOLLOWED_BY_VAR_OR_VARARG = 403
	PHP.Constants.T_IS_EQUAL = 366
	PHP.Constants.T_IS_NOT_EQUAL = 367
	PHP.Constants.T_IS_IDENTICAL = 368
	PHP.Constants.T_IS_NOT_IDENTICAL = 369
	PHP.Constants.T_SPACESHIP = 372
	PHP.Constants.T_IS_SMALLER_OR_EQUAL = 370
	PHP.Constants.T_IS_GREATER_OR_EQUAL = 371
	PHP.Constants.T_SL = 373
	PHP.Constants.T_SR = 374
	PHP.Constants.T_INSTANCEOF = 283
	PHP.Constants.T_INC = 375
	PHP.Constants.T_DEC = 376
	PHP.Constants.T_INT_CAST = 377
	PHP.Constants.T_DOUBLE_CAST = 378
	PHP.Constants.T_STRING_CAST = 379
	PHP.Constants.T_ARRAY_CAST = 380
	PHP.Constants.T_OBJECT_CAST = 381
	PHP.Constants.T_BOOL_CAST = 382
	PHP.Constants.T_UNSET_CAST = 383
	PHP.Constants.T_POW = 401
	PHP.Constants.T_NEW = 284
	PHP.Constants.T_CLONE = 285
	PHP.Constants.T_EXIT = 286
	PHP.Constants.T_IF = 287
	PHP.Constants.T_ELSEIF = 288
	PHP.Constants.T_ELSE = 289
	PHP.Constants.T_ENDIF = 290
	PHP.Constants.T_LNUMBER = 260
	PHP.Constants.T_DNUMBER = 261
	PHP.Constants.T_STRING = 262
	PHP.Constants.T_STRING_VARNAME = 270
	PHP.Constants.T_VARIABLE = 266
	PHP.Constants.T_NUM_STRING = 271
	PHP.Constants.T_INLINE_HTML = 267
	PHP.Constants.T_ENCAPSED_AND_WHITESPACE = 268
	PHP.Constants.T_CONSTANT_ENCAPSED_STRING = 269
	PHP.Constants.T_ECHO = 291
	PHP.Constants.T_DO = 292
	PHP.Constants.T_WHILE = 293
	PHP.Constants.T_ENDWHILE = 294
	PHP.Constants.T_FOR = 295
	PHP.Constants.T_ENDFOR = 296
	PHP.Constants.T_FOREACH = 297
	PHP.Constants.T_ENDFOREACH = 298
	PHP.Constants.T_DECLARE = 299
	PHP.Constants.T_ENDDECLARE = 300
	PHP.Constants.T_AS = 301
	PHP.Constants.T_SWITCH = 302
	PHP.Constants.T_MATCH = 306
	PHP.Constants.T_ENDSWITCH = 303
	PHP.Constants.T_CASE = 304
	PHP.Constants.T_DEFAULT = 305
	PHP.Constants.T_BREAK = 307
	PHP.Constants.T_CONTINUE = 308
	PHP.Constants.T_GOTO = 309
	PHP.Constants.T_FUNCTION = 310
	PHP.Constants.T_FN = 311
	PHP.Constants.T_CONST = 312
	PHP.Constants.T_RETURN = 313
	PHP.Constants.T_TRY = 314
	PHP.Constants.T_CATCH = 315
	PHP.Constants.T_FINALLY = 316
	PHP.Constants.T_THROW = 317
	PHP.Constants.T_USE = 318
	PHP.Constants.T_INSTEADOF = 319
	PHP.Constants.T_GLOBAL = 320
	PHP.Constants.T_STATIC = 321
	PHP.Constants.T_ABSTRACT = 322
	PHP.Constants.T_FINAL = 323
	PHP.Constants.T_PRIVATE = 324
	PHP.Constants.T_PROTECTED = 325
	PHP.Constants.T_PUBLIC = 326
	PHP.Constants.T_READONLY = 327
	PHP.Constants.T_VAR = 328
	PHP.Constants.T_UNSET = 329
	PHP.Constants.T_ISSET = 330
	PHP.Constants.T_EMPTY = 331
	PHP.Constants.T_HALT_COMPILER = 332
	PHP.Constants.T_CLASS = 333
	PHP.Constants.T_TRAIT = 334
	PHP.Constants.T_INTERFACE = 335
	PHP.Constants.T_ENUM = 336
	PHP.Constants.T_EXTENDS = 337
	PHP.Constants.T_IMPLEMENTS = 338
	PHP.Constants.T_OBJECT_OPERATOR = 384
	PHP.Constants.T_NULLSAFE_OBJECT_OPERATOR = 385
	PHP.Constants.T_DOUBLE_ARROW = 386
	PHP.Constants.T_LIST = 340
	PHP.Constants.T_ARRAY = 341
	PHP.Constants.T_CALLABLE = 342
	PHP.Constants.T_CLASS_C = 346
	PHP.Constants.T_TRAIT_C = 347
	PHP.Constants.T_METHOD_C = 348
	PHP.Constants.T_FUNC_C = 349
	PHP.Constants.T_LINE = 343
	PHP.Constants.T_FILE = 344
	PHP.Constants.T_START_HEREDOC = 393
	PHP.Constants.T_END_HEREDOC = 394
	PHP.Constants.T_DOLLAR_OPEN_CURLY_BRACES = 395
	PHP.Constants.T_CURLY_OPEN = 396
	PHP.Constants.T_PAAMAYIM_NEKUDOTAYIM = 397
	PHP.Constants.T_NAMESPACE = 339
	PHP.Constants.T_NS_C = 350
	PHP.Constants.T_DIR = 345
	PHP.Constants.T_NS_SEPARATOR = 398
	PHP.Constants.T_ELLIPSIS = 399
	PHP.Constants.T_NAME_FULLY_QUALIFIED = 263
	PHP.Constants.T_NAME_QUALIFIED = 265
	PHP.Constants.T_NAME_RELATIVE = 264
	PHP.Constants.T_ATTRIBUTE = 351
	PHP.Constants.T_ENUM = 336
	PHP.Constants.T_BAD_CHARACTER = 405
	PHP.Constants.T_COMMENT = 387
	PHP.Constants.T_DOC_COMMENT = 388
	PHP.Constants.T_OPEN_TAG = 389
	PHP.Constants.T_OPEN_TAG_WITH_ECHO = 390
	PHP.Constants.T_CLOSE_TAG = 391
	PHP.Constants.T_WHITESPACE = 392

	PHP.Lexer = function (src, ini) {
		var heredoc, heredocEndAllowed,

			stateStack = ['INITIAL'], stackPos = 0,
			swapState = function (state) {
				stateStack[stackPos] = state;
			},
			pushState = function (state) {
				stateStack[++stackPos] = state;
			},
			popState = function () {
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
			stringRegexPart = function (quote) {
				// Matches non-interpolated portion of interpolated string
				return '[^' + quote + '\\\\${]*(?:(?:\\\\[\\s\\S]|\\$(?!\\{|[a-zA-Z_\\x7f-\\uffff])|\\{(?!\\$))[^' + quote + '\\\\${]*)*';
			},

			sharedStringTokens = [
				{
					value: PHP.Constants.T_VARIABLE,
					re: new RegExp('^\\$' + labelRegexPart + '(?=\\[)'),
					func: function () {
						pushState('VAR_OFFSET');
					}
				},
				{
					value: PHP.Constants.T_VARIABLE,
					re: new RegExp('^\\$' + labelRegexPart + '(?=->' + labelRegexPart + ')'),
					func: function () {
						pushState('LOOKING_FOR_PROPERTY');
					}
				},
				{
					value: PHP.Constants.T_DOLLAR_OPEN_CURLY_BRACES,
					re: new RegExp('^\\$\\{(?=' + labelRegexPart + '[\\[}])'),
					func: function () {
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
					func: function () {
						pushState('IN_SCRIPTING');
					}
				},
				{
					value: PHP.Constants.T_CURLY_OPEN,
					re: /^\{(?=\$)/,
					func: function () {
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
						func: function () {
							swapState('IN_SCRIPTING');
						}
					},
					{
						value: PHP.Constants.T_OPEN_TAG,
						re: openTag,
						func: function () {
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
						value: PHP.Constants.T_ENUM,
						re: /^enum\b/i
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
						value: PHP.Constants.T_ENUM,
						re: /^enum\b/i
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
						value: PHP.Constants.T_FN,
						re: /^fn\b/i
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
						value: PHP.Constants.T_MATCH,
						re: /^match\b/i
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
						value: PHP.Constants.T_READONLY,
						re: /^readonly\b/i
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
						value: PHP.Constants.T_AMPERSAND_FOLLOWED_BY_VAR_OR_VARARG,
						re: /^&(?=[$])/
					},
					{
						value: PHP.Constants.T_AMPERSAND_NOT_FOLLOWED_BY_VAR_OR_VARARG,
						re: /^(&)(?=[^\$|^&])/
					},
					{
						value: PHP.Constants.T_BOOLEAN_OR,
						re: /^\|\|/
					},
					{
						value: PHP.Constants.T_CLOSE_TAG,
						re: /^(?:\?>|<\/script>)(\r\n|\r|\n)?/i,
						func: function () {
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
						func: function (result) {
							heredoc = result[1];
							swapState('NOWDOC');
						}
					},
					{
						value: PHP.Constants.T_START_HEREDOC,
						re: new RegExp('^[bB]?<<<[ \\t]*("?)(' + labelRegexPart + ')\\1(?:\\r\\n|\\r|\\n)'),
						func: function (result) {
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
						func: function () {
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
						value: PHP.Constants.T_COALESCE_EQUAL,
						re: /^\?\?=/
					},
					{
						value: PHP.Constants.T_COALESCE,
						re: /^\?\?/
					},
					{
						value: PHP.Constants.T_NULLSAFE_OBJECT_OPERATOR,
						re: /^\?->/
					},
					{
						value: PHP.Constants.T_NAME_FULLY_QUALIFIED,
						re: /^\\\w+(?:\\\w+)*/
					},
					{
						value: PHP.Constants.T_NAME_QUALIFIED,
						re: /^\w+\\\w+(?:\\\w+)*/
					},
					{
						value: PHP.Constants.T_NAME_RELATIVE,
						re: /^namespace\\\w+(?:\\\w+)*/
					},
					{
						value: PHP.Constants.T_NAMESPACE,
						re: /^namespace\b/i
					},
					{
						value: PHP.Constants.T_ATTRIBUTE,
						re: /^#\[([\S\s]*?)]/
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
						func: function () {
							swapState('DOUBLE_QUOTES');
						}
					},
					{
						value: -1,
						re: /^`/,
						func: function () {
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
						func: function () {
							pushState('IN_SCRIPTING');
						}
					},
					{
						value: -1,
						re: /^\}/,
						func: function () {
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
						func: function () {
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
						func: function () {
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
						func: function () {
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
						func: function () {
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
						func: function () {
							swapState('IN_SCRIPTING');
						}
					}
				],
				'NOWDOC': [
					{
						value: PHP.Constants.T_END_HEREDOC,
						matchFunc: function (src) {
							var re = new RegExp('^' + heredoc + '(?=;?[\\r\\n])');
							if (src.match(re)) {
								return [src.substr(0, heredoc.length)];
							} else {
								return null;
							}
						},
						func: function () {
							swapState('IN_SCRIPTING');
						}
					},
					{
						value: PHP.Constants.T_ENCAPSED_AND_WHITESPACE,
						matchFunc: function (src) {
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
						matchFunc: function (src) {
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
						func: function () {
							swapState('IN_SCRIPTING');
						}
					},
					{
						value: PHP.Constants.T_ENCAPSED_AND_WHITESPACE,
						matchFunc: function (src) {
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
			cancel = tokens.some(function (token) {
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


	PHP.Parser = function (preprocessedTokens, evaluate) {

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

		this.tokenMap = this.createTokenMap();

		this.dropTokens = {};
		this.dropTokens[PHP.Constants.T_WHITESPACE] = 1;
		this.dropTokens[PHP.Constants.T_OPEN_TAG] = 1;
		var tokens = [];

		// pre-process
		preprocessedTokens.forEach(function (token, index) {
			if (typeof token === "object" && token[0] === PHP.Constants.T_OPEN_TAG_WITH_ECHO) {
				tokens.push([
					PHP.Constants.T_OPEN_TAG,
					token[1],
					token[2]
				]);
				tokens.push([
					PHP.Constants.T_ECHO,
					token[1],
					token[2]
				]);
			} else {
				tokens.push(token);
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
		var attributeStack = [this.startAttributes];

		// Start off in the initial state and keep a stack of previous states
		var state = 0;
		var stateStack = [state];

		// AST stack
		this.yyastk = [];

		// Current position in the stack(s)
		this.stackPos = 0;

		var yyn;

		var origTokenId;


		for (; ;) {

			if (yybase[state] === 0) {
				yyn = yydefault[state];
			} else {
				if (tokenId === this.TOKEN_NONE) {
					// fetch the next token id from the lexer and fetch additional info by-ref
					origTokenId = this.getNextToken();

					// map the lexer token id to the internally used token id's
					tokenId = (origTokenId >= 0 && origTokenId < this.TOKEN_MAP_SIZE) ? translate[origTokenId] : this.TOKEN_INVALID;

					attributeStack[this.stackPos] = this.startAttributes;
				}

				if (((yyn = yybase[state] + tokenId) >= 0
						&& yyn < this.YYLAST && yycheck[yyn] === tokenId
						|| (state < this.YY2TBLSTATE
							&& (yyn = yybase[state + this.YYNLSTATES] + tokenId) >= 0
							&& yyn < this.YYLAST
							&& yycheck[yyn] === tokenId))
					&& (yyn = yyaction[yyn]) !== this.YYDEFAULT) {
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

						stateStack[this.stackPos] = state = yyn;
						this.yyastk[this.stackPos] = this.tokenValue;
						attributeStack[this.stackPos] = this.startAttributes;
						tokenId = this.TOKEN_NONE;

						if (yyn < this.YYNLSTATES)
							continue;

						/* $yyn >= YYNLSTATES means shift-and-reduce */
						yyn -= this.YYNLSTATES;
					} else {
						yyn = -yyn;
					}
				} else {
					yyn = yydefault[state];
				}
			}

			for (; ;) {
				/* reduce/error */

				if (yyn === 0) {
					/* accept */
					return this.yyval;
				} else if (yyn !== this.YYUNEXPECTED) {
					/* reduce */
					for (var attr in this.endAttributes) {
						attributeStack[this.stackPos - yylen[yyn]][attr] = this.endAttributes[attr];
					}

					// We do not build an AST!
					// this['yyn' + yyn](attributeStack[ this.stackPos - yylen[ yyn ] ]);

					/* Goto - shift nonterminal */
					this.stackPos -= yylen[yyn];
					yyn = yylhs[yyn];
					if ((yyp = yygbase[yyn] + stateStack[this.stackPos]) >= 0
						&& yyp < this.YYGLAST
						&& yygcheck[yyp] === yyn) {
						state = yygoto[yyp];
					} else {
						state = yygdefault[yyn];
					}

					++this.stackPos;

					stateStack[this.stackPos] = state;
					this.yyastk[this.stackPos] = this.yyval;
					attributeStack[this.stackPos] = this.startAttributes;
				} else {
					/* error */
					if (evaluate !== true) {

						var expected = [];

						for (var i = 0; i < this.TOKEN_MAP_SIZE; ++i) {
							if ((yyn = yybase[state] + i) >= 0 && yyn < this.YYLAST && yycheck[yyn] == i
								|| state < this.YY2TBLSTATE
								&& (yyn = yybase[state + this.YYNLSTATES] + i)
								&& yyn < this.YYLAST && yycheck[yyn] == i
							) {
								if (yyaction[yyn] != this.YYUNEXPECTED) {
									if (expected.length == 4) {
										/* Too many expected tokens */
										expected = [];
										break;
									}

									expected.push(this.terminals[i]);
								}
							}
						}

						var expectedString = '';
						if (expected.length) {
							expectedString = ', expecting ' + expected.join(' or ');
						}
						throw new PHP.ParseError('syntax error, unexpected ' + terminals[tokenId] + expectedString, this.startAttributes['startLine']);
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

	PHP.ParseError = function (msg, line) {
		this.message = msg;
		this.line = line;
	};

	PHP.Parser.prototype.getNextToken = function () {

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


				this.line += ((tmp = token[1].match(/\n/g)) === null) ? 0 : tmp.length;

				if (PHP.Constants.T_COMMENT === token[0]) {

					if (!Array.isArray(this.startAttributes['comments'])) {
						this.startAttributes['comments'] = [];
					}

					this.startAttributes['comments'].push({
						type: "comment",
						comment: token[1],
						line: token[2]
					});

				}
				else if (PHP.Constants.T_ATTRIBUTE === token[0]) {
					this.tokenValue = token[1];
					this.startAttributes['startLine'] = token[2];
					this.endAttributes['endLine'] = this.line;
				} else if (PHP.Constants.T_DOC_COMMENT === token[0]) {
					this.startAttributes['comments'].push(new PHPParser_Comment_Doc(token[1], token[2]));
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

	PHP.Parser.prototype.tokenName = function (token) {
		var constants = ["T_THROW","T_INCLUDE","T_INCLUDE_ONCE","T_EVAL","T_REQUIRE","T_REQUIRE_ONCE","T_LOGICAL_OR","T_LOGICAL_XOR","T_LOGICAL_AND","T_PRINT","T_YIELD","T_DOUBLE_ARROW","T_YIELD_FROM","T_PLUS_EQUAL","T_MINUS_EQUAL","T_MUL_EQUAL","T_DIV_EQUAL","T_CONCAT_EQUAL","T_MOD_EQUAL","T_AND_EQUAL","T_OR_EQUAL","T_XOR_EQUAL","T_SL_EQUAL","T_SR_EQUAL","T_POW_EQUAL","T_COALESCE_EQUAL","T_COALESCE","T_BOOLEAN_OR","T_BOOLEAN_AND","T_AMPERSAND_NOT_FOLLOWED_BY_VAR_OR_VARARG","T_AMPERSAND_FOLLOWED_BY_VAR_OR_VARARG","T_IS_EQUAL","T_IS_NOT_EQUAL","T_IS_IDENTICAL","T_IS_NOT_IDENTICAL","T_SPACESHIP","T_IS_SMALLER_OR_EQUAL","T_IS_GREATER_OR_EQUAL","T_SL","T_SR","T_INSTANCEOF","T_INC","T_DEC","T_INT_CAST","T_DOUBLE_CAST","T_STRING_CAST","T_ARRAY_CAST","T_OBJECT_CAST","T_BOOL_CAST","T_UNSET_CAST","T_POW","T_NEW","T_CLONE","T_EXIT","T_IF","T_ELSEIF","T_ELSE","T_ENDIF","T_LNUMBER","T_DNUMBER","T_STRING","T_STRING_VARNAME","T_VARIABLE","T_NUM_STRING","T_INLINE_HTML","T_ENCAPSED_AND_WHITESPACE","T_CONSTANT_ENCAPSED_STRING","T_ECHO","T_DO","T_WHILE","T_ENDWHILE","T_FOR","T_ENDFOR","T_FOREACH","T_ENDFOREACH","T_DECLARE","T_ENDDECLARE","T_AS","T_SWITCH","T_MATCH","T_ENDSWITCH","T_CASE","T_DEFAULT","T_BREAK","T_CONTINUE","T_GOTO","T_FUNCTION","T_FN","T_CONST","T_RETURN","T_TRY","T_CATCH","T_FINALLY","T_THROW","T_USE","T_INSTEADOF","T_GLOBAL","T_STATIC","T_ABSTRACT","T_FINAL","T_PRIVATE","T_PROTECTED","T_PUBLIC","T_READONLY","T_VAR","T_UNSET","T_ISSET","T_EMPTY","T_HALT_COMPILER","T_CLASS","T_TRAIT","T_INTERFACE","T_ENUM","T_EXTENDS","T_IMPLEMENTS","T_OBJECT_OPERATOR","T_NULLSAFE_OBJECT_OPERATOR","T_DOUBLE_ARROW","T_LIST","T_ARRAY","T_CALLABLE","T_CLASS_C","T_TRAIT_C","T_METHOD_C","T_FUNC_C","T_LINE","T_FILE","T_START_HEREDOC","T_END_HEREDOC","T_DOLLAR_OPEN_CURLY_BRACES","T_CURLY_OPEN","T_PAAMAYIM_NEKUDOTAYIM","T_NAMESPACE","T_NS_C","T_DIR","T_NS_SEPARATOR","T_ELLIPSIS","T_NAME_FULLY_QUALIFIED","T_NAME_QUALIFIED","T_NAME_RELATIVE","T_ATTRIBUTE","T_ENUM","T_BAD_CHARACTER","T_COMMENT","T_DOC_COMMENT","T_OPEN_TAG","T_OPEN_TAG_WITH_ECHO","T_CLOSE_TAG","T_WHITESPACE"];
		var current = "UNKNOWN";
		constants.some(function (constant) {
			if (PHP.Constants[constant] === token) {
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

	PHP.Parser.prototype.createTokenMap = function () {
		var tokenMap = {},
			name,
			i;
		// 256 is the minimum possible token number, as everything below
		// it is an ASCII value
		for (i = 256; i < 1000; ++i) {
			// T_OPEN_TAG_WITH_ECHO with dropped T_OPEN_TAG results in T_ECHO
			if (PHP.Constants.T_OPEN_TAG_WITH_ECHO === i) {
				tokenMap[i] = PHP.Constants.T_ECHO;
				// T_CLOSE_TAG is equivalent to ';'
			} else if (PHP.Constants.T_CLOSE_TAG === i) {
				tokenMap[i] = 59;
				// and the others can be mapped directly
			} else if ('UNKNOWN' !== (name = this.tokenName(i))) {
				tokenMap[i] = this[name];
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
	PHP.Parser.prototype.TOKEN_INVALID = 175;

	PHP.Parser.prototype.TOKEN_MAP_SIZE = 403;

	PHP.Parser.prototype.YYLAST       = 1196;
	PHP.Parser.prototype.YY2TBLSTATE  = 420;
	PHP.Parser.prototype.YYGLAST      = 545;
	PHP.Parser.prototype.YYNLSTATES   = 710;
	PHP.Parser.prototype.YYUNEXPECTED = 32767;
	PHP.Parser.prototype.YYDEFAULT    = -32766;

// {{{ Tokens
	PHP.Parser.prototype.YYERRTOK = 256;
	PHP.Parser.prototype.T_THROW = 257;
	PHP.Parser.prototype.T_INCLUDE = 258;
	PHP.Parser.prototype.T_INCLUDE_ONCE = 259;
	PHP.Parser.prototype.T_EVAL = 260;
	PHP.Parser.prototype.T_REQUIRE = 261;
	PHP.Parser.prototype.T_REQUIRE_ONCE = 262;
	PHP.Parser.prototype.T_LOGICAL_OR = 263;
	PHP.Parser.prototype.T_LOGICAL_XOR = 264;
	PHP.Parser.prototype.T_LOGICAL_AND = 265;
	PHP.Parser.prototype.T_PRINT = 266;
	PHP.Parser.prototype.T_YIELD = 267;
	PHP.Parser.prototype.T_DOUBLE_ARROW = 268;
	PHP.Parser.prototype.T_YIELD_FROM = 269;
	PHP.Parser.prototype.T_PLUS_EQUAL = 270;
	PHP.Parser.prototype.T_MINUS_EQUAL = 271;
	PHP.Parser.prototype.T_MUL_EQUAL = 272;
	PHP.Parser.prototype.T_DIV_EQUAL = 273;
	PHP.Parser.prototype.T_CONCAT_EQUAL = 274;
	PHP.Parser.prototype.T_MOD_EQUAL = 275;
	PHP.Parser.prototype.T_AND_EQUAL = 276;
	PHP.Parser.prototype.T_OR_EQUAL = 277;
	PHP.Parser.prototype.T_XOR_EQUAL = 278;
	PHP.Parser.prototype.T_SL_EQUAL = 279;
	PHP.Parser.prototype.T_SR_EQUAL = 280;
	PHP.Parser.prototype.T_POW_EQUAL = 281;
	PHP.Parser.prototype.T_COALESCE_EQUAL = 282;
	PHP.Parser.prototype.T_COALESCE = 283;
	PHP.Parser.prototype.T_BOOLEAN_OR = 284;
	PHP.Parser.prototype.T_BOOLEAN_AND = 285;
	PHP.Parser.prototype.T_AMPERSAND_NOT_FOLLOWED_BY_VAR_OR_VARARG = 286;
	PHP.Parser.prototype.T_AMPERSAND_FOLLOWED_BY_VAR_OR_VARARG = 287;
	PHP.Parser.prototype.T_IS_EQUAL = 288;
	PHP.Parser.prototype.T_IS_NOT_EQUAL = 289;
	PHP.Parser.prototype.T_IS_IDENTICAL = 290;
	PHP.Parser.prototype.T_IS_NOT_IDENTICAL = 291;
	PHP.Parser.prototype.T_SPACESHIP = 292;
	PHP.Parser.prototype.T_IS_SMALLER_OR_EQUAL = 293;
	PHP.Parser.prototype.T_IS_GREATER_OR_EQUAL = 294;
	PHP.Parser.prototype.T_SL = 295;
	PHP.Parser.prototype.T_SR = 296;
	PHP.Parser.prototype.T_INSTANCEOF = 297;
	PHP.Parser.prototype.T_INC = 298;
	PHP.Parser.prototype.T_DEC = 299;
	PHP.Parser.prototype.T_INT_CAST = 300;
	PHP.Parser.prototype.T_DOUBLE_CAST = 301;
	PHP.Parser.prototype.T_STRING_CAST = 302;
	PHP.Parser.prototype.T_ARRAY_CAST = 303;
	PHP.Parser.prototype.T_OBJECT_CAST = 304;
	PHP.Parser.prototype.T_BOOL_CAST = 305;
	PHP.Parser.prototype.T_UNSET_CAST = 306;
	PHP.Parser.prototype.T_POW = 307;
	PHP.Parser.prototype.T_NEW = 308;
	PHP.Parser.prototype.T_CLONE = 309;
	PHP.Parser.prototype.T_EXIT = 310;
	PHP.Parser.prototype.T_IF = 311;
	PHP.Parser.prototype.T_ELSEIF = 312;
	PHP.Parser.prototype.T_ELSE = 313;
	PHP.Parser.prototype.T_ENDIF = 314;
	PHP.Parser.prototype.T_LNUMBER = 315;
	PHP.Parser.prototype.T_DNUMBER = 316;
	PHP.Parser.prototype.T_STRING = 317;
	PHP.Parser.prototype.T_STRING_VARNAME = 318;
	PHP.Parser.prototype.T_VARIABLE = 319;
	PHP.Parser.prototype.T_NUM_STRING = 320;
	PHP.Parser.prototype.T_INLINE_HTML = 321;
	PHP.Parser.prototype.T_ENCAPSED_AND_WHITESPACE = 322;
	PHP.Parser.prototype.T_CONSTANT_ENCAPSED_STRING = 323;
	PHP.Parser.prototype.T_ECHO = 324;
	PHP.Parser.prototype.T_DO = 325;
	PHP.Parser.prototype.T_WHILE = 326;
	PHP.Parser.prototype.T_ENDWHILE = 327;
	PHP.Parser.prototype.T_FOR = 328;
	PHP.Parser.prototype.T_ENDFOR = 329;
	PHP.Parser.prototype.T_FOREACH = 330;
	PHP.Parser.prototype.T_ENDFOREACH = 331;
	PHP.Parser.prototype.T_DECLARE = 332;
	PHP.Parser.prototype.T_ENDDECLARE = 333;
	PHP.Parser.prototype.T_AS = 334;
	PHP.Parser.prototype.T_SWITCH = 335;
	PHP.Parser.prototype.T_MATCH = 336;
	PHP.Parser.prototype.T_ENDSWITCH = 337;
	PHP.Parser.prototype.T_CASE = 338;
	PHP.Parser.prototype.T_DEFAULT = 339;
	PHP.Parser.prototype.T_BREAK = 340;
	PHP.Parser.prototype.T_CONTINUE = 341;
	PHP.Parser.prototype.T_GOTO = 342;
	PHP.Parser.prototype.T_FUNCTION = 343;
	PHP.Parser.prototype.T_FN = 344;
	PHP.Parser.prototype.T_CONST = 345;
	PHP.Parser.prototype.T_RETURN = 346;
	PHP.Parser.prototype.T_TRY = 347;
	PHP.Parser.prototype.T_CATCH = 348;
	PHP.Parser.prototype.T_FINALLY = 349;
	PHP.Parser.prototype.T_USE = 350;
	PHP.Parser.prototype.T_INSTEADOF = 351;
	PHP.Parser.prototype.T_GLOBAL = 352;
	PHP.Parser.prototype.T_STATIC = 353;
	PHP.Parser.prototype.T_ABSTRACT = 354;
	PHP.Parser.prototype.T_FINAL = 355;
	PHP.Parser.prototype.T_PRIVATE = 356;
	PHP.Parser.prototype.T_PROTECTED = 357;
	PHP.Parser.prototype.T_PUBLIC = 358;
	PHP.Parser.prototype.T_READONLY = 359;
	PHP.Parser.prototype.T_VAR = 360;
	PHP.Parser.prototype.T_UNSET = 361;
	PHP.Parser.prototype.T_ISSET = 362;
	PHP.Parser.prototype.T_EMPTY = 363;
	PHP.Parser.prototype.T_HALT_COMPILER = 364;
	PHP.Parser.prototype.T_CLASS = 365;
	PHP.Parser.prototype.T_TRAIT = 366;
	PHP.Parser.prototype.T_INTERFACE = 367;
	PHP.Parser.prototype.T_ENUM = 368;
	PHP.Parser.prototype.T_EXTENDS = 369;
	PHP.Parser.prototype.T_IMPLEMENTS = 370;
	PHP.Parser.prototype.T_OBJECT_OPERATOR = 371;
	PHP.Parser.prototype.T_NULLSAFE_OBJECT_OPERATOR = 372;
	PHP.Parser.prototype.T_LIST = 373;
	PHP.Parser.prototype.T_ARRAY = 374;
	PHP.Parser.prototype.T_CALLABLE = 375;
	PHP.Parser.prototype.T_CLASS_C = 376;
	PHP.Parser.prototype.T_TRAIT_C = 377;
	PHP.Parser.prototype.T_METHOD_C = 378;
	PHP.Parser.prototype.T_FUNC_C = 379;
	PHP.Parser.prototype.T_LINE = 380;
	PHP.Parser.prototype.T_FILE = 381;
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
	PHP.Parser.prototype.T_NAME_FULLY_QUALIFIED = 392;
	PHP.Parser.prototype.T_NAME_QUALIFIED = 393;
	PHP.Parser.prototype.T_NAME_RELATIVE = 394;
	PHP.Parser.prototype.T_ATTRIBUTE = 395;
	PHP.Parser.prototype.T_BAD_CHARACTER = 396;
	PHP.Parser.prototype.T_COMMENT = 397;
	PHP.Parser.prototype.T_DOC_COMMENT = 398;
	PHP.Parser.prototype.T_OPEN_TAG = 399;
	PHP.Parser.prototype.T_OPEN_TAG_WITH_ECHO = 400;
	PHP.Parser.prototype.T_CLOSE_TAG = 401;
	PHP.Parser.prototype.T_WHITESPACE = 402;
// }}}

	/* @var array Map of token ids to their respective names */
	PHP.Parser.prototype.terminals = [
		"EOF",
		"error",
		"T_THROW",
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
		"T_COALESCE_EQUAL",
		"'?'",
		"':'",
		"T_COALESCE",
		"T_BOOLEAN_OR",
		"T_BOOLEAN_AND",
		"'|'",
		"'^'",
		"T_AMPERSAND_NOT_FOLLOWED_BY_VAR_OR_VARARG",
		"T_AMPERSAND_FOLLOWED_BY_VAR_OR_VARARG",
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
		"T_MATCH",
		"T_ENDSWITCH",
		"T_CASE",
		"T_DEFAULT",
		"T_BREAK",
		"T_CONTINUE",
		"T_GOTO",
		"T_FUNCTION",
		"T_FN",
		"T_CONST",
		"T_RETURN",
		"T_TRY",
		"T_CATCH",
		"T_FINALLY",
		"T_USE",
		"T_INSTEADOF",
		"T_GLOBAL",
		"T_STATIC",
		"T_ABSTRACT",
		"T_FINAL",
		"T_PRIVATE",
		"T_PROTECTED",
		"T_PUBLIC",
		"T_READONLY",
		"T_VAR",
		"T_UNSET",
		"T_ISSET",
		"T_EMPTY",
		"T_HALT_COMPILER",
		"T_CLASS",
		"T_TRAIT",
		"T_INTERFACE",
		"T_ENUM",
		"T_EXTENDS",
		"T_IMPLEMENTS",
		"T_OBJECT_OPERATOR",
		"T_NULLSAFE_OBJECT_OPERATOR",
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
		"T_NAME_FULLY_QUALIFIED",
		"T_NAME_QUALIFIED",
		"T_NAME_RELATIVE",
		"T_ATTRIBUTE",
		"';'",
		"']'",
		"'{'",
		"'}'",
		"'('",
		"')'",
		"'`'",
		"'\"'",
		"'$'",
		"T_BAD_CHARACTER",
		"T_COMMENT",
		"T_DOC_COMMENT",
		"T_OPEN_TAG",
		"T_OPEN_TAG_WITH_ECHO",
		"T_CLOSE_TAG",
		"T_WHITESPACE"
		, "???"
	];

	/* @var Map which translates lexer tokens to internal tokens */
	PHP.Parser.prototype.translate = [
		0,  175,  175,  175,  175,  175,  175,  175,  175,  175,
		175,  175,  175,  175,  175,  175,  175,  175,  175,  175,
		175,  175,  175,  175,  175,  175,  175,  175,  175,  175,
		175,  175,  175,   56,  166,  175,  167,   55,  175,  175,
		163,  164,   53,   50,    8,   51,   52,   54,  175,  175,
		175,  175,  175,  175,  175,  175,  175,  175,   31,  159,
		44,   16,   46,   30,   68,  175,  175,  175,  175,  175,
		175,  175,  175,  175,  175,  175,  175,  175,  175,  175,
		175,  175,  175,  175,  175,  175,  175,  175,  175,  175,
		175,   70,  175,  160,   36,  175,  165,  175,  175,  175,
		175,  175,  175,  175,  175,  175,  175,  175,  175,  175,
		175,  175,  175,  175,  175,  175,  175,  175,  175,  175,
		175,  175,  175,  161,   35,  162,   58,  175,  175,  175,
		175,  175,  175,  175,  175,  175,  175,  175,  175,  175,
		175,  175,  175,  175,  175,  175,  175,  175,  175,  175,
		175,  175,  175,  175,  175,  175,  175,  175,  175,  175,
		175,  175,  175,  175,  175,  175,  175,  175,  175,  175,
		175,  175,  175,  175,  175,  175,  175,  175,  175,  175,
		175,  175,  175,  175,  175,  175,  175,  175,  175,  175,
		175,  175,  175,  175,  175,  175,  175,  175,  175,  175,
		175,  175,  175,  175,  175,  175,  175,  175,  175,  175,
		175,  175,  175,  175,  175,  175,  175,  175,  175,  175,
		175,  175,  175,  175,  175,  175,  175,  175,  175,  175,
		175,  175,  175,  175,  175,  175,  175,  175,  175,  175,
		175,  175,  175,  175,  175,  175,  175,  175,  175,  175,
		175,  175,  175,  175,  175,  175,    1,    2,    3,    4,
		5,    6,    7,    9,   10,   11,   12,   13,   14,   15,
		17,   18,   19,   20,   21,   22,   23,   24,   25,   26,
		27,   28,   29,   32,   33,   34,   37,   38,   39,   40,
		41,   42,   43,   45,   47,   48,   49,   57,   59,   60,
		61,   62,   63,   64,   65,   66,   67,   69,   71,   72,
		73,   74,   75,   76,   77,   78,   79,   80,   81,   82,
		83,   84,   85,   86,   87,   88,   89,   90,   91,   92,
		93,   94,   95,   96,   97,   98,   99,  100,  101,  102,
		103,  104,  105,  106,  107,  108,  109,  110,  111,  112,
		113,  114,  115,  116,  117,  118,  119,  120,  121,  122,
		123,  124,  125,  126,  127,  128,  129,  130,  131,  132,
		133,  134,  135,  136,  137,  138,  139,  140,  141,  142,
		143,  144,  145,  146,  147,  148,  149,  150,  151,  152,
		153,  154,  155,  156,  157,  158,  168,  169,  170,  171,
		172,  173,  174
	];

	PHP.Parser.prototype.yyaction = [
		132,  133,  134,  569,  135,  136,    0,  722,  723,  724,
		137,   37,  834,  911,  835,  469,-32766,-32766,-32766,-32767,
		-32767,-32767,-32767,  101,  102,  103,  104,  105, 1068, 1069,
		1070, 1067, 1066, 1065, 1071,  716,  715,-32766,-32766,-32766,
		-32766,-32766,-32766,-32766,-32766,-32766,-32767,-32767,-32767,-32767,
		-32767,  545,  546,-32766,-32766,  725,-32766,-32766,-32766,  998,
		999,  806,  922,  447,  448,  449,  370,  371,    2,  267,
		138,  396,  729,  730,  731,  732,  414,-32766,  420,-32766,
		-32766,-32766,-32766,-32766,  990,  733,  734,  735,  736,  737,
		738,  739,  740,  741,  742,  743,  763,  570,  764,  765,
		766,  767,  755,  756,  336,  337,  758,  759,  744,  745,
		746,  748,  749,  750,  346,  790,  791,  792,  793,  794,
		795,  751,  752,  571,  572,  784,  775,  773,  774,  787,
		770,  771,  283,  420,  573,  574,  769,  575,  576,  577,
		578,  579,  580,  598, -575,  470,   14,  798,  772,  581,
		582, -575,  139,-32766,-32766,-32766,  132,  133,  134,  569,
		135,  136, 1017,  722,  723,  724,  137,   37, 1060,-32766,
		-32766,-32766, 1303,  696,-32766, 1304,-32766,-32766,-32766,-32766,
		-32766,-32766,-32766, 1068, 1069, 1070, 1067, 1066, 1065, 1071,
		-32766,  716,  715,  372,  371, 1258,-32766,-32766,-32766, -572,
		106,  107,  108,  414,  270,  891, -572,  240, 1193, 1192,
		1194,  725,-32766,-32766,-32766, 1046,  109,-32766,-32766,-32766,
		-32766,  986,  985,  984,  987,  267,  138,  396,  729,  730,
		731,  732,   12,-32766,  420,-32766,-32766,-32766,-32766,  998,
		999,  733,  734,  735,  736,  737,  738,  739,  740,  741,
		742,  743,  763,  570,  764,  765,  766,  767,  755,  756,
		336,  337,  758,  759,  744,  745,  746,  748,  749,  750,
		346,  790,  791,  792,  793,  794,  795,  751,  752,  571,
		572,  784,  775,  773,  774,  787,  770,  771,  881,  321,
		573,  574,  769,  575,  576,  577,  578,  579,  580,-32766,
		82,   83,   84, -575,  772,  581,  582, -575,  148,  747,
		717,  718,  719,  720,  721, 1278,  722,  723,  724,  760,
		761,   36, 1277,   85,   86,   87,   88,   89,   90,   91,
		92,   93,   94,   95,   96,   97,   98,   99,  100,  101,
		102,  103,  104,  105,  106,  107,  108,  996,  270,  150,
		-32766,-32766,-32766,  455,  456,   81,   34, -264, -572, 1016,
		109,  320, -572,  893,  725,  682,  803,  128,  998,  999,
		592,-32766, 1044,-32766,-32766,-32766,  809,  151,  726,  727,
		728,  729,  730,  731,  732,  -88, 1198,  796,  278, -526,
		283,-32766,-32766,-32766,  733,  734,  735,  736,  737,  738,
		739,  740,  741,  742,  743,  763,  786,  764,  765,  766,
		767,  755,  756,  757,  785,  758,  759,  744,  745,  746,
		748,  749,  750,  789,  790,  791,  792,  793,  794,  795,
		751,  752,  753,  754,  784,  775,  773,  774,  787,  770,
		771,  144,  804,  762,  768,  769,  776,  777,  779,  778,
		780,  781, -314, -526, -526, -193, -192,  772,  783,  782,
		49,   50,   51,  500,   52,   53,  239,  807, -526,  -86,
		54,   55, -111,   56,  996,  253,-32766, -111,  800, -111,
		-526,  541, -532, -352,  300, -352,  304, -111, -111, -111,
		-111, -111, -111, -111, -111,  998,  999,  998,  999,  153,
		-32766,-32766,-32766, 1191,  807,  126,  306, 1293,   57,   58,
		103,  104,  105, -111,   59, 1218,   60,  246,  247,   61,
		62,   63,   64,   65,   66,   67,   68, -525,   27,  268,
		69,  436,  501, -328,  808,  -86, 1224, 1225,  502, 1189,
		807, 1198, 1230,  293, 1222,   41,   24,  503,   74,  504,
		953,  505,  320,  506,  802,  154,  507,  508,  279,  684,
		280,   43,   44,  437,  367,  366,  891,   45,  509,   35,
		249,  -16, -566,  358,  332,  318, -566, 1198, 1193, 1192,
		1194, -527,  510,  511,  512,  333, -524, 1274,   48,  716,
		715, -525, -525,  334,  513,  514,  807, 1212, 1213, 1214,
		1215, 1209, 1210,  292,  360,  284, -525,  285, -314, 1216,
		1211, -193, -192, 1193, 1192, 1194,  293,  891, -525,  364,
		-531,   70,  807,  316,  317,  320,   31,  110,  111,  112,
		113,  114,  115,  116,  117,  118,  119,  120,  121,  122,
		-153, -153, -153,  638,   25, -527, -527,  687,  379,  881,
		-524, -524,  296,  297,  891, -153,  432, -153,  807, -153,
		-527, -153,  716,  715,  433, -524,  798,  363, -111, 1105,
		1107,  365, -527,  434,  891,  140,  435, -524,  954,  127,
		-524,  320, -111, -111,  688,  813,  381, -529,   11,  834,
		155,  835,  867, -111, -111, -111, -111,   47,  293,-32766,
		881,  654,  655,   74,  689, 1191, 1045,  320,  708,  149,
		399,  157,-32766,-32766,-32766,   32,-32766,  -79,-32766,  123,
		-32766,  716,  715,-32766,  893,  891,  682, -153,-32766,-32766,
		-32766,  716,  715,  891,-32766,-32766,  124,  881,  129,   74,
		-32766,  411,  130,  320, -524, -524,  143,  141,  -75,-32766,
		158, -529, -529,  320,   27,  691,  159,  881,  160, -524,
		161,  294,  295,  698,  368,  369,  807,  -73,-32766,  -72,
		1222, -524,  373,  374, 1191,  893,  -71,  682, -529,   73,
		-70,-32766,-32766,-32766,  -69,-32766,  -68,-32766,  125,-32766,
		630,  631,-32766,  -67,  -66,  -47,  -51,-32766,-32766,-32766,
		-18,  147,  271,-32766,-32766,  277,  697,  700,  881,-32766,
		411,  890,  893,  146,  682,  282,  881,  907,-32766,  281,
		513,  514,  286, 1212, 1213, 1214, 1215, 1209, 1210,  326,
		131,  145,  939,  287,  682, 1216, 1211,  109,  270,-32766,
		798,  807,-32766,  662,  639, 1191,  657,   72,  675, 1075,
		317,  320,-32766,-32766,-32766, 1305,-32766,  301,-32766,  628,
		-32766,  431,  543,-32766,-32766,  923,  555,  924,-32766,-32766,
		-32766, 1229,  549,-32766,-32766,-32766,   -4,  891, -490, 1191,
		-32766,  411,  644,  893,  299,  682,-32766,-32766,-32766,-32766,
		-32766,  893,-32766,  682,-32766,   13, 1231,-32766,  452,  480,
		645,  909,-32766,-32766,-32766,-32766,  658, -480,-32766,-32766,
		0, 1191,    0,    0,-32766,  411,    0,  298,-32766,-32766,
		-32766,  305,-32766,-32766,-32766,    0,-32766,    0,  806,-32766,
		0,    0,    0,  475,-32766,-32766,-32766,-32766,    0,    7,
		-32766,-32766,   16, 1191,  561,  596,-32766,  411, 1219,  891,
		-32766,-32766,-32766,  362,-32766,-32766,-32766,  818,-32766, -267,
		881,-32766,   39,  293,    0,    0,-32766,-32766,-32766,   40,
		705,  706,-32766,-32766,  872,  963,  940,  947,-32766,  411,
		937,  948,  365,  870,  427,  891,  935,-32766, 1049,  291,
		1244, 1052, 1053, -111, -111, 1050, 1051, 1057, -560, 1262,
		1296,  633,    0,  826, -111, -111, -111, -111,   33,  315,
		-32766,  361,  683,  686,  690,  692, 1191,  693,  694,  695,
		699,  685,  320,-32766,-32766,-32766,    9,-32766,  702,-32766,
		868,-32766,  881, 1300,-32766,  893, 1302,  682,   -4,-32766,
		-32766,-32766,  829,  828,  837,-32766,-32766,  916, -242, -242,
		-242,-32766,  411,  955,  365,   27,  836, 1301,  915,  917,
		-32766,  914, 1177,  900,  910, -111, -111,  807,  881,  898,
		945, 1222,  946, 1299, 1256,  867, -111, -111, -111, -111,
		1245, 1263, 1269, 1272, -241, -241, -241, -558, -532, -531,
		365, -530,    1,   28,   29,   38,   42,   46,   71,    0,
		75, -111, -111,   76,   77,   78,   79,  893,   80,  682,
		-242,  867, -111, -111, -111, -111,  142,  152,  156,  245,
		322,  347,  514,  348, 1212, 1213, 1214, 1215, 1209, 1210,
		349,  350,  351,  352,  353,  354, 1216, 1211,  355,  356,
		357,  359,  428,  893, -265,  682, -241, -264,   72,    0,
		18,  317,  320,   19,   20,   21,   23,  398,  471,  472,
		479,  482,  483,  484,  485,  489,  490,  491,  498,  669,
		1202, 1145, 1220, 1019, 1018, 1181, -269, -103,   17,   22,
		26,  290,  397,  589,  593,  620,  674, 1149, 1197, 1146,
		1275,    0, -494, 1162,    0, 1223
	];

	PHP.Parser.prototype.yycheck = [
		2,    3,    4,    5,    6,    7,    0,    9,   10,   11,
		12,   13,  106,    1,  108,   31,    9,   10,   11,   44,
		45,   46,   47,   48,   49,   50,   51,   52,  116,  117,
		118,  119,  120,  121,  122,   37,   38,   30,  116,   32,
		33,   34,   35,   36,   37,   38,   39,   40,   41,   42,
		43,  117,  118,    9,   10,   57,    9,   10,   11,  137,
		138,  155,  128,  129,  130,  131,  106,  107,    8,   71,
		72,   73,   74,   75,   76,   77,  116,   30,   80,   32,
		33,   34,   35,   36,    1,   87,   88,   89,   90,   91,
		92,   93,   94,   95,   96,   97,   98,   99,  100,  101,
		102,  103,  104,  105,  106,  107,  108,  109,  110,  111,
		112,  113,  114,  115,  116,  117,  118,  119,  120,  121,
		122,  123,  124,  125,  126,  127,  128,  129,  130,  131,
		132,  133,   30,   80,  136,  137,  138,  139,  140,  141,
		142,  143,  144,   51,    1,  161,  101,   80,  150,  151,
		152,    8,  154,    9,   10,   11,    2,    3,    4,    5,
		6,    7,  164,    9,   10,   11,   12,   13,  123,    9,
		10,   11,   80,  161,   30,   83,   32,   33,   34,   35,
		36,   37,   38,  116,  117,  118,  119,  120,  121,  122,
		30,   37,   38,  106,  107,    1,    9,   10,   11,    1,
		53,   54,   55,  116,   57,    1,    8,   14,  155,  156,
		157,   57,    9,   10,   11,  162,   69,   30,  116,   32,
		33,  119,  120,  121,  122,   71,   72,   73,   74,   75,
		76,   77,    8,   30,   80,   32,   33,   34,   35,  137,
		138,   87,   88,   89,   90,   91,   92,   93,   94,   95,
		96,   97,   98,   99,  100,  101,  102,  103,  104,  105,
		106,  107,  108,  109,  110,  111,  112,  113,  114,  115,
		116,  117,  118,  119,  120,  121,  122,  123,  124,  125,
		126,  127,  128,  129,  130,  131,  132,  133,   84,   70,
		136,  137,  138,  139,  140,  141,  142,  143,  144,    9,
		9,   10,   11,  160,  150,  151,  152,  164,  154,    2,
		3,    4,    5,    6,    7,    1,    9,   10,   11,   12,
		13,   30,    8,   32,   33,   34,   35,   36,   37,   38,
		39,   40,   41,   42,   43,   44,   45,   46,   47,   48,
		49,   50,   51,   52,   53,   54,   55,  116,   57,   14,
		9,   10,   11,  134,  135,  161,    8,  164,  160,    1,
		69,  167,  164,  159,   57,  161,   80,    8,  137,  138,
		1,   30,    1,   32,   33,   34,    1,   14,   71,   72,
		73,   74,   75,   76,   77,   31,    1,   80,   30,   70,
		30,    9,   10,   11,   87,   88,   89,   90,   91,   92,
		93,   94,   95,   96,   97,   98,   99,  100,  101,  102,
		103,  104,  105,  106,  107,  108,  109,  110,  111,  112,
		113,  114,  115,  116,  117,  118,  119,  120,  121,  122,
		123,  124,  125,  126,  127,  128,  129,  130,  131,  132,
		133,    8,  156,  136,  137,  138,  139,  140,  141,  142,
		143,  144,    8,  134,  135,    8,    8,  150,  151,  152,
		2,    3,    4,    5,    6,    7,   97,   82,  149,   31,
		12,   13,  101,   15,  116,    8,  116,  106,   80,  108,
		161,   85,  163,  106,  113,  108,    8,  116,  117,  118,
		119,  120,  121,  122,  123,  137,  138,  137,  138,   14,
		9,   10,   11,   80,   82,   14,    8,   85,   50,   51,
		50,   51,   52,  128,   56,    1,   58,   59,   60,   61,
		62,   63,   64,   65,   66,   67,   68,   70,   70,   71,
		72,   73,   74,  162,  159,   97,   78,   79,   80,  116,
		82,    1,  146,  158,   86,   87,   88,   89,  163,   91,
		31,   93,  167,   95,  156,   14,   98,   99,   35,  161,
		37,  103,  104,  105,  106,  107,    1,  109,  110,  147,
		148,   31,  160,  115,  116,    8,  164,    1,  155,  156,
		157,   70,  124,  125,  126,    8,   70,    1,   70,   37,
		38,  134,  135,    8,  136,  137,   82,  139,  140,  141,
		142,  143,  144,  145,    8,   35,  149,   37,  164,  151,
		152,  164,  164,  155,  156,  157,  158,    1,  161,    8,
		163,  163,   82,  165,  166,  167,   16,   17,   18,   19,
		20,   21,   22,   23,   24,   25,   26,   27,   28,   29,
		75,   76,   77,   75,   76,  134,  135,   31,    8,   84,
		134,  135,  134,  135,    1,   90,    8,   92,   82,   94,
		149,   96,   37,   38,    8,  149,   80,  149,  128,   59,
		60,  106,  161,    8,    1,  161,    8,  161,  159,  161,
		70,  167,  117,  118,   31,    8,  106,   70,  108,  106,
		14,  108,  127,  128,  129,  130,  131,   70,  158,   74,
		84,   75,   76,  163,   31,   80,  159,  167,  161,  101,
		102,   14,   87,   88,   89,   14,   91,   31,   93,   16,
		95,   37,   38,   98,  159,    1,  161,  162,  103,  104,
		105,   37,   38,    1,  109,  110,   16,   84,   16,  163,
		115,  116,   16,  167,  134,  135,   16,  161,   31,  124,
		16,  134,  135,  167,   70,   31,   16,   84,   16,  149,
		16,  134,  135,   31,  106,  107,   82,   31,   74,   31,
		86,  161,  106,  107,   80,  159,   31,  161,  161,  154,
		31,   87,   88,   89,   31,   91,   31,   93,  161,   95,
		111,  112,   98,   31,   31,   31,   31,  103,  104,  105,
		31,   31,   31,  109,  110,   31,   31,   31,   84,  115,
		116,   31,  159,   31,  161,   37,   84,   38,  124,   35,
		136,  137,   35,  139,  140,  141,  142,  143,  144,   35,
		31,   70,  159,   37,  161,  151,  152,   69,   57,   74,
		80,   82,   85,   77,   90,   80,   94,  163,   92,   82,
		166,  167,   87,   88,   89,   83,   91,  114,   93,  113,
		95,  128,   85,   98,  116,  128,  153,  128,  103,  104,
		105,  146,   89,   74,  109,  110,    0,    1,  149,   80,
		115,  116,   96,  159,  133,  161,   87,   88,   89,  124,
		91,  159,   93,  161,   95,   97,  146,   98,   97,   97,
		100,  154,  103,  104,  105,   74,  100,  149,  109,  110,
		-1,   80,   -1,   -1,  115,  116,   -1,  132,   87,   88,
		89,  132,   91,  124,   93,   -1,   95,   -1,  155,   98,
		-1,   -1,   -1,  102,  103,  104,  105,   74,   -1,  149,
		109,  110,  149,   80,   81,  153,  115,  116,  160,    1,
		87,   88,   89,  149,   91,  124,   93,  160,   95,  164,
		84,   98,  159,  158,   -1,   -1,  103,  104,  105,  159,
		159,  159,  109,  110,  159,  159,  159,  159,  115,  116,
		159,  159,  106,  159,  108,    1,  159,  124,  159,  113,
		160,  159,  159,  117,  118,  159,  159,  159,  163,  160,
		160,  160,   -1,  127,  128,  129,  130,  131,  161,  161,
		74,  161,  161,  161,  161,  161,   80,  161,  161,  161,
		161,  161,  167,   87,   88,   89,  150,   91,  162,   93,
		162,   95,   84,  162,   98,  159,  162,  161,  162,  103,
		104,  105,  162,  162,  162,  109,  110,  162,  100,  101,
		102,  115,  116,  162,  106,   70,  162,  162,  162,  162,
		124,  162,  162,  162,  162,  117,  118,   82,   84,  162,
		162,   86,  162,  162,  162,  127,  128,  129,  130,  131,
		162,  162,  162,  162,  100,  101,  102,  163,  163,  163,
		106,  163,  163,  163,  163,  163,  163,  163,  163,   -1,
		163,  117,  118,  163,  163,  163,  163,  159,  163,  161,
		162,  127,  128,  129,  130,  131,  163,  163,  163,  163,
		163,  163,  137,  163,  139,  140,  141,  142,  143,  144,
		163,  163,  163,  163,  163,  163,  151,  152,  163,  163,
		163,  163,  163,  159,  164,  161,  162,  164,  163,   -1,
		164,  166,  167,  164,  164,  164,  164,  164,  164,  164,
		164,  164,  164,  164,  164,  164,  164,  164,  164,  164,
		164,  164,  164,  164,  164,  164,  164,  164,  164,  164,
		164,  164,  164,  164,  164,  164,  164,  164,  164,  164,
		164,   -1,  165,  165,   -1,  166
	];

	PHP.Parser.prototype.yybase = [
		0,   -2,  154,  565,  876,  948,  984,  514,   53,  398,
		837,  307,  307,   67,  307,  307,  307,  653,  724,  724,
		732,  724,  616,  673,  204,  204,  204,  625,  625,  625,
		625,  694,  694,  831,  831,  863,  799,  765,  936,  936,
		936,  936,  936,  936,  936,  936,  936,  936,  936,  936,
		936,  936,  936,  936,  936,  936,  936,  936,  936,  936,
		936,  936,  936,  936,  936,  936,  936,  936,  936,  936,
		936,  936,  936,  936,  936,  936,  936,  936,  936,  936,
		936,  936,  936,  936,  936,  936,  936,  936,  936,  936,
		936,  936,  936,  936,  936,  936,  936,  936,  936,  936,
		936,  936,  936,  936,  936,  936,  936,  936,  936,  936,
		936,  936,  936,  936,  936,  936,  936,  936,  936,  936,
		936,  936,  936,  936,  936,  936,  936,  936,  936,  936,
		936,  936,  936,  936,  936,  936,  936,  936,  936,  936,
		936,  936,  936,  936,  936,  936,  936,  936,  936,  936,
		936,  936,  936,  936,  936,  936,  936,  936,  936,  936,
		936,  936,  375,  519,  369,  701, 1017, 1023, 1019, 1024,
		1015, 1014, 1018, 1020, 1025,  911,  912,  782,  918,  919,
		920,  921, 1021,  841, 1016, 1022,  291,  291,  291,  291,
		291,  291,  291,  291,  291,  291,  291,  291,  291,  291,
		291,  291,  291,  291,  291,  291,  291,  291,  291,  291,
		291,  291,  290,  491,   44,  382,  382,  382,  382,  382,
		382,  382,  382,  382,  382,  382,  382,  382,  382,  382,
		382,  382,  382,  382,  382,  160,  160,  160,  187,  684,
		684,  341,  203,  610,   47,  985,  985,  985,  985,  985,
		985,  985,  985,  985,  985,  144,  144,    7,    7,    7,
		7,    7,  371,  -25,  -25,  -25,  -25,  540,  385,  102,
		576,  358,   45,  377,  460,  460,  360,  231,  231,  231,
		231,  231,  231,  -78,  -78,  -78,  -78,  -78,  -66,  319,
		457,  -94,  396,  423,  586,  586,  586,  586,  423,  423,
		423,  423,  750, 1029,  423,  423,  423,  511,  516,  516,
		518,  147,  147,  147,  516,  583,  777,  422,  583,  422,
		194,   92,  748,  -40,   87,  412,  748,  617,  627,  198,
		143,  773,  658,  773, 1013,  757,  764,  717,  838,  860,
		1026,  800,  908,  806,  910,  219,  686, 1012, 1012, 1012,
		1012, 1012, 1012, 1012, 1012, 1012, 1012, 1012,  855,  552,
		1013,  286,  855,  855,  855,  552,  552,  552,  552,  552,
		552,  552,  552,  552,  552,  679,  286,  568,  626,  286,
		794,  552,  375,  758,  375,  375,  375,  375,  958,  375,
		375,  375,  375,  375,  375,  970,  769,  -16,  375,  519,
		12,   12,  547,   83,   12,   12,   12,   12,  375,  375,
		375,  658,  781,  713,  666,  792,  448,  781,  781,  781,
		438,  444,  193,  447,  570,  523,  580,  760,  760,  767,
		929,  929,  760,  759,  760,  767,  934,  760,  929,  805,
		359,  648,  577,  611,  656,  929,  478,  760,  760,  760,
		760,  665,  760,  467,  433,  760,  760,  785,  774,  789,
		60,  929,  929,  929,  789,  596,  751,  751,  751,  811,
		812,  746,  771,  567,  498,  677,  348,  779,  771,  771,
		760,  640,  746,  771,  746,  771,  747,  771,  771,  771,
		746,  771,  759,  585,  771,  734,  668,  224,  771,    6,
		935,  937,  354,  940,  932,  941,  979,  942,  943,  851,
		956,  933,  945,  931,  930,  780,  703,  720,  790,  729,
		928,  768,  768,  768,  925,  768,  768,  768,  768,  768,
		768,  768,  768,  703,  788,  804,  733,  783,  960,  722,
		726,  725,  868, 1027, 1028,  737,  739,  958, 1006,  953,
		803,  730,  992,  967,  866,  848,  968,  969,  993, 1007,
		1008,  871,  761,  874,  880,  797,  971,  852,  768,  935,
		943,  933,  945,  931,  930,  763,  762,  753,  755,  749,
		745,  736,  738,  770, 1009,  924,  835,  830,  970,  926,
		703,  839,  986,  847,  994,  995,  850,  801,  772,  840,
		881,  972,  975,  976,  853, 1010,  810,  989,  795,  996,
		802,  882,  997,  998,  999, 1000,  885,  854,  856,  857,
		815,  754,  980,  786,  891,  335,  787,  796,  978,  363,
		957,  858,  894,  895, 1001, 1002, 1003,  896,  954,  816,
		990,  752,  991,  983,  817,  818,  485,  784,  778,  541,
		676,  897,  899,  900,  955,  775,  766,  821,  822, 1011,
		901,  697,  824,  740,  902, 1005,  742,  744,  756,  859,
		793,  743,  798,  977,  776,  827,  907,  829,  832,  833,
		1004,  836,    0,    0,    0,    0,    0,    0,    0,    0,
		0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
		0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
		0,  458,  458,  458,  458,  458,  458,  307,  307,  307,
		307,    0,    0,  307,    0,    0,    0,  458,  458,  458,
		458,  458,  458,  458,  458,  458,  458,  458,  458,  458,
		458,  458,  458,  458,  458,  458,  458,  458,  458,  458,
		458,  458,  458,  458,  458,  458,  458,  458,  458,  458,
		458,  458,  458,  458,  458,  458,  458,  458,  458,  458,
		458,  458,  458,  458,  458,  458,  458,  458,  458,  458,
		458,  458,  458,  458,  458,  458,  458,  458,  458,  458,
		458,  458,  458,  458,  458,  458,  458,  458,  458,  458,
		458,  458,  458,  458,  458,  458,  458,  458,  458,  458,
		458,  458,  458,  458,  458,  458,  458,  458,  458,  458,
		458,  458,  458,  458,  458,  458,  458,  458,  458,  458,
		458,  458,  458,  458,  458,  458,  458,  458,  458,  458,
		458,  458,  458,  458,  458,  458,  458,  458,  458,  458,
		458,  458,  458,  458,  458,  458,  458,  458,  458,  458,
		458,  458,  458,  458,  458,  458,  458,  458,  458,  458,
		458,  458,  291,  291,  291,  291,  291,  291,  291,  291,
		291,  291,  291,  291,  291,  291,  291,  291,  291,  291,
		291,  291,  291,  291,  291,  291,    0,    0,    0,    0,
		0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
		0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
		0,    0,  291,  291,  291,  291,  291,  291,  291,  291,
		291,  291,  291,  291,  291,  291,  291,  291,  291,  291,
		291,  291,  291,  291,  291,  291,  291,  291,  291,  423,
		423,  291,  291,    0,  291,  423,  423,  423,  423,  423,
		423,  423,  423,  423,  423,  291,  291,  291,  291,  291,
		291,  291,  805,  147,  147,  147,  147,  423,  423,  423,
		423,  423,  -88,  -88,  147,  147,  423,  423,  423,  423,
		423,  423,  423,  423,  423,  423,  423,  423,    0,    0,
		0,  286,  422,    0,  759,  759,  759,  759,    0,    0,
		0,    0,  422,  422,    0,    0,    0,    0,    0,    0,
		0,    0,    0,    0,    0,  286,  422,    0,  286,    0,
		759,  759,  423,  805,  805,  314,  423,    0,    0,    0,
		0,  286,  759,  286,  552,  422,  552,  552,   12,  375,
		314,  608,  608,  608,  608,    0,  658,  805,  805,  805,
		805,  805,  805,  805,  805,  805,  805,  805,  759,    0,
		805,    0,  759,  759,  759,    0,    0,    0,    0,    0,
		0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
		759,    0,    0,  929,    0,    0,    0,    0,  760,    0,
		0,    0,    0,    0,    0,  760,  934,    0,    0,    0,
		0,    0,    0,  759,    0,    0,    0,    0,    0,    0,
		0,    0,  768,  801,    0,  801,    0,  768,  768,  768
	];

	PHP.Parser.prototype.yydefault = [
		3,32767,  103,32767,32767,32767,32767,32767,32767,32767,
		32767,32767,  101,32767,32767,32767,32767,32767,32767,32767,
		32767,32767,32767,32767,32767,32767,32767,  578,  578,  578,
		578,32767,32767,  246,  103,32767,32767,  454,  372,  372,
		372,32767,32767,  522,  522,  522,  522,  522,  522,32767,
		32767,32767,32767,32767,32767,  454,32767,32767,32767,32767,
		32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
		32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
		32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
		32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
		32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
		32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
		32767,32767,32767,32767,32767,32767,32767,32767,  101,32767,
		32767,32767,   37,    7,    8,   10,   11,   50,   17,  310,
		32767,32767,32767,32767,  103,32767,32767,32767,32767,32767,
		32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
		32767,32767,32767,32767,32767,  571,32767,32767,32767,32767,
		32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
		32767,32767,32767,32767,32767,32767,  458,  437,  438,  440,
		441,  371,  523,  577,  313,  574,  370,  146,  325,  315,
		234,  316,  250,  459,  251,  460,  463,  464,  211,  279,
		367,  150,  401,  455,  403,  453,  457,  402,  377,  382,
		383,  384,  385,  386,  387,  388,  389,  390,  391,  392,
		393,  394,  375,  376,  456,  434,  433,  432,  399,32767,
		32767,  400,  404,  374,  407,32767,32767,32767,32767,32767,
		32767,32767,32767,  103,32767,  405,  406,  423,  424,  421,
		422,  425,32767,  426,  427,  428,  429,32767,32767,  302,
		32767,32767,  351,  349,  414,  415,  302,32767,32767,32767,
		32767,32767,32767,32767,32767,32767,32767,32767,32767,  516,
		431,32767,32767,32767,32767,32767,32767,32767,32767,32767,
		32767,32767,32767,32767,  103,32767,  101,  518,  396,  398,
		486,  409,  410,  408,  378,32767,  493,32767,  103,  495,
		32767,32767,32767,  112,32767,32767,32767,  517,32767,  524,
		524,32767,  479,  101,  194,32767,  194,  194,32767,32767,
		32767,32767,32767,32767,32767,  585,  479,  111,  111,  111,
		111,  111,  111,  111,  111,  111,  111,  111,32767,  194,
		111,32767,32767,32767,  101,  194,  194,  194,  194,  194,
		194,  194,  194,  194,  194,  189,32767,  260,  262,  103,
		539,  194,32767,  498,32767,32767,32767,32767,32767,32767,
		32767,32767,32767,32767,32767,32767,  491,32767,32767,32767,
		32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
		32767,  479,  419,  139,32767,  139,  524,  411,  412,  413,
		481,  524,  524,  524,  298,  281,32767,32767,32767,32767,
		496,  496,  101,  101,  101,  101,  491,32767,32767,  112,
		100,  100,  100,  100,  100,  104,  102,32767,32767,32767,
		32767,  100,32767,  102,  102,32767,32767,  217,  208,  215,
		102,32767,  543,  544,  215,  102,  219,  219,  219,  239,
		239,  470,  304,  102,  100,  102,  102,  196,  304,  304,
		32767,  102,  470,  304,  470,  304,  198,  304,  304,  304,
		470,  304,32767,  102,  304,  210,  100,  100,  304,32767,
		32767,32767,  481,32767,32767,32767,32767,32767,32767,32767,
		32767,32767,32767,32767,32767,32767,32767,  511,32767,  528,
		541,  417,  418,  420,  526,  442,  443,  444,  445,  446,
		447,  448,  450,  573,32767,  485,32767,32767,32767,32767,
		324,  583,32767,  583,32767,32767,32767,32767,32767,32767,
		32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
		32767,  584,32767,  524,32767,32767,32767,32767,  416,    9,
		76,   43,   44,   52,   58,  502,  503,  504,  505,  499,
		500,  506,  501,32767,32767,  507,  549,32767,32767,  525,
		576,32767,32767,32767,32767,32767,32767,  139,32767,32767,
		32767,32767,32767,32767,32767,32767,32767,32767,  511,32767,
		137,32767,32767,32767,32767,32767,32767,32767,32767,32767,
		32767,32767,  524,32767,32767,32767,  300,  301,32767,32767,
		32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
		32767,32767,32767,  524,32767,32767,32767,  283,  284,32767,
		32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
		32767,32767,32767,  278,32767,32767,  366,32767,32767,32767,
		32767,  345,32767,32767,32767,32767,32767,32767,32767,32767,
		32767,32767,  152,  152,    3,    3,  327,  152,  152,  152,
		327,  152,  327,  327,  327,  152,  152,  152,  152,  152,
		152,  272,  184,  254,  257,  239,  239,  152,  337,  152
	];

	PHP.Parser.prototype.yygoto = [
		194,  194,  670,  422,  643,  463, 1264, 1265, 1022,  416,
		308,  309,  329,  563,  314,  421,  330,  423,  622,  801,
		678,  637,  586,  651,  652,  653,  165,  165,  165,  165,
		218,  195,  191,  191,  175,  177,  213,  191,  191,  191,
		191,  191,  192,  192,  192,  192,  192,  192,  186,  187,
		188,  189,  190,  215,  213,  216,  521,  522,  412,  523,
		525,  526,  527,  528,  529,  530,  531,  532, 1091,  166,
		167,  168,  193,  169,  170,  171,  164,  172,  173,  174,
		176,  212,  214,  217,  235,  238,  241,  242,  244,  255,
		256,  257,  258,  259,  260,  261,  263,  264,  265,  266,
		274,  275,  311,  312,  313,  417,  418,  419,  568,  219,
		220,  221,  222,  223,  224,  225,  226,  227,  228,  229,
		230,  231,  232,  233,  178,  234,  179,  196,  197,  198,
		236,  186,  187,  188,  189,  190,  215, 1091,  199,  180,
		181,  182,  200,  196,  183,  237,  201,  199,  163,  202,
		203,  184,  204,  205,  206,  185,  207,  208,  209,  210,
		211,  323,  323,  323,  323,  827,  608,  608,  824,  547,
		538,  342, 1221, 1221, 1221, 1221, 1221, 1221, 1221, 1221,
		1221, 1221, 1239, 1239,  288,  288,  288,  288, 1239, 1239,
		1239, 1239, 1239, 1239, 1239, 1239, 1239, 1239,  388,  538,
		547,  556,  557,  395,  566,  588,  602,  603,  832,  825,
		880,  875,  876,  889,   15,  833,  877,  830,  878,  879,
		831,  799,  251,  251,  883,  919,  992, 1000, 1004, 1001,
		1005, 1237, 1237,  938, 1043, 1039, 1040, 1237, 1237, 1237,
		1237, 1237, 1237, 1237, 1237, 1237, 1237,  858,  248,  248,
		248,  248,  250,  252,  533,  533,  533,  533,  487,  590,
		488, 1190, 1190,  997, 1190,  997,  494, 1290, 1290,  560,
		997,  997,  997,  997,  997,  997,  997,  997,  997,  997,
		997,  997, 1261, 1261, 1290, 1261,  340, 1190,  930,  402,
		677, 1279, 1190, 1190, 1190, 1190,  959,  345, 1190, 1190,
		1190, 1271, 1271, 1271, 1271,  606,  640,  345,  345, 1273,
		1273, 1273, 1273,  820,  820,  805,  896,  884,  840,  885,
		897,  345,  345,    5,  345,    6, 1306,  384,  535,  535,
		559,  535,  415,  852,  597, 1257,  839,  540,  524,  524,
		345, 1289, 1289,  642,  524,  524,  524,  524,  524,  524,
		524,  524,  524,  524,  445,  805, 1140,  805, 1289,  932,
		932,  932,  932, 1063, 1064,  445,  926,  933,  386,  390,
		548,  587,  591, 1030, 1292,  331,  554, 1259, 1259, 1030,
		704,  621,  623,  823,  641, 1250,  319,  303,  660,  664,
		973,  668,  676,  969,  429,  553,  962,  936,  936,  934,
		936,  703,  601,  537,  971,  966,  343,  344,  663,  817,
		595,  609,  612,  613,  614,  615,  634,  635,  636,  680,
		439, 1186,  845,  454,  454,  439,  439, 1266, 1267,  820,
		901, 1079,  454,  394,  539,  551, 1183,  605,  540,  539,
		842,  551,  978,  272,  387,  618,  619,  981,  536,  536,
		844,  707,  646,  957,  567,  457,  458,  459,  838,  850,
		254,  254, 1297, 1298,  400,  401,  976,  976,  464,  649,
		1182,  650, 1028,  404,  405,  406, 1187,  661,  424, 1032,
		407,  564,  600,  815,  338,  424,  854,  848,  853,  841,
		1027, 1031, 1009, 1002, 1006, 1003, 1007, 1185,  941, 1188,
		1247, 1248,  943,    0, 1074,  439,  439,  439,  439,  439,
		439,  439,  439,  439,  439,  439,    0,  468,  439,  585,
		1056,  931,  681,  667,  667,    0,  495,  673, 1054, 1171,
		912,    0,    0, 1172, 1175,  913, 1176,    0,    0,    0,
		0,    0,    0, 1072,  857
	];

	PHP.Parser.prototype.yygcheck = [
		42,   42,   72,   65,   65,  166,  166,  166,  119,   65,
		65,   65,   65,   65,   65,   65,   65,   65,   65,    7,
		9,   84,  122,   84,   84,   84,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,   42,   42,   42,
		42,   23,   23,   23,   23,   15,  104,  104,   26,   75,
		75,   93,  104,  104,  104,  104,  104,  104,  104,  104,
		104,  104,  160,  160,   24,   24,   24,   24,  160,  160,
		160,  160,  160,  160,  160,  160,  160,  160,   75,   75,
		75,   75,   75,   75,   75,   75,   75,   75,   15,   27,
		15,   15,   15,   15,   75,   15,   15,   15,   15,   15,
		15,    6,    5,    5,   15,   87,   87,   87,   87,   87,
		87,  161,  161,   49,   15,   15,   15,  161,  161,  161,
		161,  161,  161,  161,  161,  161,  161,   45,    5,    5,
		5,    5,    5,    5,  103,  103,  103,  103,  147,  103,
		147,   72,   72,   72,   72,   72,  147,  173,  173,  162,
		72,   72,   72,   72,   72,   72,   72,   72,   72,   72,
		72,   72,  122,  122,  173,  122,  169,   72,   89,   89,
		89,  171,   72,   72,   72,   72,   99,   14,   72,   72,
		72,    9,    9,    9,    9,   55,   55,   14,   14,  122,
		122,  122,  122,   22,   22,   12,   72,   64,   35,   64,
		72,   14,   14,   46,   14,   46,   14,   61,   19,   19,
		100,   19,   13,   35,   13,  122,   35,   14,  163,  163,
		14,  172,  172,   63,  163,  163,  163,  163,  163,  163,
		163,  163,  163,  163,   19,   12,  143,   12,  172,   19,
		19,   19,   19,  136,  136,   19,   19,   19,   58,   58,
		58,   58,   58,  122,  172,   29,   48,  122,  122,  122,
		48,   48,   48,   25,   48,   14,  159,  159,   48,   48,
		48,   48,   48,   48,  109,    9,   25,   25,   25,   25,
		25,   25,    9,   25,   25,   25,   93,   93,   14,   18,
		79,   79,   79,   79,   79,   79,   79,   79,   79,   79,
		23,   20,   39,  141,  141,   23,   23,  168,  168,   22,
		17,   17,  141,   28,    9,    9,  152,   17,   14,    9,
		37,    9,   17,   24,    9,   83,   83,  106,   24,   24,
		17,   95,   17,   17,    9,    9,    9,    9,   17,    9,
		5,    5,    9,    9,   80,   80,  103,  103,  149,   80,
		17,   80,  121,   80,   80,   80,   20,   80,  113,  124,
		80,    2,    2,   20,   80,  113,   41,    9,   16,   16,
		16,   16,  113,  113,  113,  113,  113,   14,   16,   20,
		20,   20,   92,   -1,  139,   23,   23,   23,   23,   23,
		23,   23,   23,   23,   23,   23,   -1,   82,   23,    8,
		8,   16,    8,    8,    8,   -1,    8,    8,    8,   78,
		78,   -1,   -1,   78,   78,   78,   78,   -1,   -1,   -1,
		-1,   -1,   -1,   16,   16
	];

	PHP.Parser.prototype.yygbase = [
		0,    0, -203,    0,    0,  221,  208,   10,  512,    7,
		0,    0,   24,    1,    5, -174,   47,  -23,  105,   61,
		38,    0,  -10,  158,  181,  379,  164,  205,  102,   84,
		0,    0,    0,    0,    0,  -43,    0,  107,    0,  104,
		0,   54,   -1,    0,    0,  235, -384,    0, -307,  210,
		0,    0,    0,    0,    0,  266,    0,    0,  324,    0,
		0,  286,    0,  103,  298, -236,    0,    0,    0,    0,
		0,    0,   -6,    0,    0, -167,    0,    0,  129,   62,
		-14,    0,   53,  -22, -669,    0,    0,  -52,    0,  -11,
		0,    0,   68, -299,    0,   52,    0,    0,    0,  262,
		288,    0,    0,  227,  -73,    0,   87,    0,    0,  118,
		0,    0,    0,  209,    0,    0,    0,    0,    0,    6,
		0,  108,   15,    0,   46,    0,    0,    0,    0,    0,
		0,    0,    0,    0,    0,    0,   91,    0,    0,   69,
		0,  390,    0,   86,    0,    0,    0, -224,    0,   37,
		0,    0,   77,    0,    0,    0,    0,    0,    0,   70,
		-57,   -8,  241,   99,    0,    0, -290,    0,   65,  257,
		0,  261,   39,  -35,    0,    0
	];

	PHP.Parser.prototype.yygdefault = [
		-32768,  499,  711,    4,  712,  905,  788,  797,  583,  515,
		679,  339,  610,  413, 1255,  882, 1078,  565,  816, 1199,
		1207,  446,  819,  324,  701,  864,  865,  866,  391,  376,
		382,  389,  632,  611,  481,  851,  442,  843,  473,  846,
		441,  855,  162,  410,  497,  859,    3,  861,  542,  892,
		377,  869,  378,  656,  871,  550,  873,  874,  385,  392,
		393, 1083,  558,  607,  886,  243,  552,  887,  375,  888,
		895,  380,  383,  665,  453,  492,  486,  403, 1058,  594,
		629,  450,  467,  617,  616,  604,  466,  425,  408,  928,
		474,  451,  942,  341,  950,  709, 1090,  624,  476,  958,
		625,  965,  968,  516,  517,  465,  980,  269,  983,  477,
		1015,  647,  648,  995,  626,  627, 1013,  460,  584, 1021,
		443, 1029, 1243,  444, 1033,  262, 1036,  276,  409,  426,
		1041, 1042,    8, 1048,  671,  672,   10,  273,  496, 1073,
		666,  440, 1089,  430, 1159, 1161,  544,  478, 1179, 1178,
		659,  493, 1184, 1246,  438,  518,  461,  310,  519,  302,
		327,  307,  534,  289,  328,  520,  462, 1252, 1260,  325,
		30, 1280, 1291,  335,  562,  599
	];

	PHP.Parser.prototype.yylhs = [
		0,    1,    3,    3,    2,    5,    5,    6,    6,    6,
		6,    6,    6,    6,    6,    6,    6,    6,    6,    6,
		6,    6,    6,    6,    6,    6,    6,    6,    6,    6,
		6,    6,    6,    6,    6,    6,    6,    6,    6,    6,
		6,    6,    6,    6,    6,    6,    6,    6,    6,    6,
		6,    6,    6,    6,    6,    6,    6,    6,    6,    6,
		6,    6,    6,    6,    6,    6,    6,    6,    6,    6,
		6,    6,    6,    6,    6,    6,    6,    6,    7,    7,
		7,    7,    7,    7,    7,    7,    8,    8,    9,   10,
		11,   11,   11,   12,   12,   13,   13,   14,   15,   15,
		16,   16,   17,   17,   18,   18,   21,   21,   22,   23,
		23,   24,   24,    4,    4,    4,    4,    4,    4,    4,
		4,    4,    4,    4,   29,   29,   30,   30,   32,   34,
		34,   28,   36,   36,   33,   38,   38,   35,   35,   37,
		37,   39,   39,   31,   40,   40,   41,   43,   44,   44,
		45,   46,   46,   48,   47,   47,   47,   47,   49,   49,
		49,   49,   49,   49,   49,   49,   49,   49,   49,   49,
		49,   49,   49,   49,   49,   49,   49,   49,   49,   49,
		49,   49,   25,   25,   68,   68,   71,   71,   70,   69,
		69,   62,   74,   74,   75,   75,   76,   76,   77,   77,
		78,   78,   26,   26,   27,   27,   27,   27,   86,   86,
		88,   88,   81,   81,   81,   82,   82,   85,   85,   83,
		83,   89,   90,   90,   56,   56,   64,   64,   67,   67,
		67,   66,   91,   91,   92,   57,   57,   57,   57,   93,
		93,   94,   94,   95,   95,   96,   97,   97,   98,   98,
		99,   99,   54,   54,   50,   50,  101,   52,   52,  102,
		51,   51,   53,   53,   63,   63,   63,   63,   79,   79,
		105,  105,  107,  107,  108,  108,  108,  108,  106,  106,
		106,  110,  110,  110,  110,   87,   87,  113,  113,  113,
		111,  111,  114,  114,  112,  112,  115,  115,  116,  116,
		116,  116,  109,  109,   80,   80,   80,   20,   20,   20,
		118,  117,  117,  119,  119,  119,  119,   59,  120,  120,
		121,   60,  123,  123,  124,  124,  125,  125,   84,  126,
		126,  126,  126,  126,  126,  131,  131,  132,  132,  133,
		133,  133,  133,  133,  134,  135,  135,  130,  130,  127,
		127,  129,  129,  137,  137,  136,  136,  136,  136,  136,
		136,  136,  128,  138,  138,  140,  139,  139,   61,  100,
		141,  141,   55,   55,   42,   42,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,   42,   42,   42,
		42,   42,   42,   42,   42,   42,   42,  148,  142,  142,
		147,  147,  150,  151,  151,  152,  153,  153,  153,   19,
		19,   72,   72,   72,   72,  143,  143,  143,  143,  155,
		155,  144,  144,  146,  146,  146,  149,  149,  160,  160,
		160,  160,  160,  160,  160,  160,  160,  161,  161,  104,
		163,  163,  163,  163,  145,  145,  145,  145,  145,  145,
		145,  145,   58,   58,  158,  158,  158,  158,  164,  164,
		154,  154,  154,  165,  165,  165,  165,  165,  165,   73,
		73,   65,   65,   65,   65,  122,  122,  122,  122,  168,
		167,  157,  157,  157,  157,  157,  157,  157,  156,  156,
		156,  166,  166,  166,  166,  103,  162,  170,  170,  169,
		169,  171,  171,  171,  171,  171,  171,  171,  171,  159,
		159,  159,  159,  173,  174,  172,  172,  172,  172,  172,
		172,  172,  172,  175,  175,  175,  175
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
		1,    1,    1,    1,    1,    1,    1,    1,    1,    1,
		1,    1,    1,    1,    1,    1,    1,    1,    1,    1,
		0,    1,    0,    1,    1,    2,    1,    3,    4,    1,
		2,    0,    1,    1,    1,    1,    1,    3,    5,    4,
		3,    4,    2,    3,    1,    1,    7,    6,    2,    3,
		1,    2,    3,    1,    2,    3,    1,    1,    3,    1,
		3,    1,    2,    2,    3,    1,    3,    2,    3,    1,
		3,    2,    0,    1,    1,    1,    1,    1,    3,    7,
		10,    5,    7,    9,    5,    3,    3,    3,    3,    3,
		3,    1,    2,    5,    7,    9,    6,    5,    6,    3,
		2,    1,    1,    1,    0,    2,    1,    3,    8,    0,
		4,    2,    1,    3,    0,    1,    0,    1,    0,    1,
		3,    1,    8,    9,    8,    7,    6,    8,    0,    2,
		0,    2,    1,    2,    2,    0,    2,    0,    2,    0,
		2,    2,    1,    3,    1,    4,    1,    4,    1,    1,
		4,    2,    1,    3,    3,    3,    4,    4,    5,    0,
		2,    4,    3,    1,    1,    7,    0,    2,    1,    3,
		3,    4,    1,    4,    0,    2,    5,    0,    2,    6,
		0,    2,    0,    3,    1,    2,    1,    1,    2,    0,
		1,    3,    0,    2,    1,    1,    1,    1,    6,    8,
		6,    1,    2,    1,    1,    1,    1,    1,    1,    1,
		3,    3,    3,    3,    3,    3,    3,    3,    1,    2,
		1,    1,    0,    1,    0,    2,    2,    2,    4,    3,
		1,    1,    3,    1,    2,    2,    3,    2,    3,    1,
		1,    2,    3,    1,    1,    3,    2,    0,    1,    5,
		5,   10,    3,    5,    1,    1,    3,    0,    2,    4,
		5,    4,    4,    4,    3,    1,    1,    1,    1,    1,
		1,    0,    1,    1,    2,    1,    1,    1,    1,    1,
		1,    1,    2,    1,    3,    1,    1,    3,    2,    2,
		3,    1,    0,    1,    1,    3,    3,    3,    4,    1,
		1,    2,    3,    3,    3,    3,    3,    3,    3,    3,
		3,    3,    3,    3,    3,    2,    2,    2,    2,    3,
		3,    3,    3,    3,    3,    3,    3,    3,    3,    3,
		3,    3,    3,    3,    3,    3,    3,    2,    2,    2,
		2,    3,    3,    3,    3,    3,    3,    3,    3,    3,
		3,    3,    5,    4,    3,    4,    4,    2,    2,    4,
		2,    2,    2,    2,    2,    2,    2,    2,    2,    2,
		2,    1,    3,    2,    1,    2,    4,    2,    2,    8,
		9,    8,    9,    9,   10,    9,   10,    8,    3,    2,
		0,    4,    2,    1,    3,    2,    2,    2,    4,    1,
		1,    1,    1,    1,    1,    1,    1,    3,    1,    1,
		1,    0,    3,    0,    1,    1,    0,    1,    1,    1,
		1,    1,    1,    1,    1,    1,    1,    3,    3,    3,
		4,    1,    1,    3,    1,    1,    1,    1,    1,    3,
		2,    3,    0,    1,    1,    3,    1,    1,    1,    1,
		1,    3,    1,    1,    4,    4,    1,    4,    4,    0,
		1,    1,    1,    3,    3,    1,    4,    2,    2,    1,
		3,    1,    4,    4,    3,    3,    3,    3,    1,    3,
		1,    1,    3,    1,    1,    4,    1,    1,    1,    3,
		1,    1,    2,    1,    3,    4,    3,    2,    0,    2,
		2,    1,    2,    1,    1,    1,    4,    3,    3,    3,
		3,    6,    3,    1,    1,    2,    1
	];



	exports.PHP = PHP;
});
