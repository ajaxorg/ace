/*
(C) 2013 Ezhil Language Project
(C) 2013 Sridhar Ganesan
*/
define(function(require, exports, module) {
"use strict";
var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var EzhilHighlightRules = function() {
	
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

    var stringEscape =  "";
	
   this.$rules = {
        "start" : [ {
            token : "comment",
            regex : "#.*$"
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
            token : "support.function",
            regex : "abs|acos|len|assert|seed|exit|randint|choice|random|range"
        }, {
            token : "storage.type",
            regex : "float|int|string"
        }, {
            token : "constant.language",
            regex :  "None|True|False"
        }, {
            token : "keyword",
            regex :  "((?:\u0B86\u0BA9\u0BBE\u0BB2\u0BCD)|(?:\u0B8F\u0BA4\u0BC7\u0BA9\u0BBF\u0BB2\u0BCD)|(?:\u0BA4\u0BC7\u0BB0\u0BCD\u0BB5\u0BC1)|(?:\u0BAA\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BBF)|(?:\u0BA4\u0BC7\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4\u0BC6\u0B9F\u0BC1)|(?:\u0B87\u0BB2\u0BCD\u0BB2\u0BC8\u0B86\u0BA9\u0BBE\u0BB2\u0BCD)|(?:\u0B86\u0B95)|(?:\u0B87\u0BB2\u0BCD\u0BB2\u0BC8)|(?:\u0BB5\u0BB0\u0BC8)|(?:\u0B9A\u0BC6\u0BAF\u0BCD)|(?:\u0BAA\u0BBF\u0BA9\u0BCD\u0B95\u0BCA\u0B9F\u0BC1)|(?:\u0BAE\u0BC1\u0B9F\u0BBF)|(?:\u0BA8\u0BBF\u0BB0\u0BB2\u0BCD\u0BAA\u0BBE\u0B95\u0BAE\u0BCD)|(?:\u0BA4\u0BCA\u0B9F\u0BB0\u0BCD)|(?:\u0BAE\u0BC1\u0B9F\u0BBF\u0BAF\u0BC7\u0BA9\u0BBF\u0BB2\u0BCD)|(?:\u0B87\u0BB2\u0BCD)|(?:\u0B92\u0BB5\u0BCD\u0BB5\u0BCA\u0BA9\u0BCD\u0BB1\u0BBE\u0B95)|(?:\u0BA8\u0BBF\u0BB1\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1))"
        }, {
            token : "identifier",
            regex : "([\u0B80-\u0BFF\u0041-\u005A\u0061-\u007A\u0030-\u0039\u005F-\u005F])+"
        }, {
            token : "keyword.operator",
            regex : "\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|%|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|=|@"
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
            token : "string",  // multi line ''' string end
            regex : "'{3}",
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
oop.inherits(EzhilHighlightRules, TextHighlightRules);
exports.EzhilHighlightRules = EzhilHighlightRules;
});