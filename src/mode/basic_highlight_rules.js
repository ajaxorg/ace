"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var BasicHighlightRules = function () {

    var keywordMapper = this.createKeywordMapper({
        "keyword.control": "FOR|TO|NEXT|GOSUB|RETURN|IF|THEN|ELSE|GOTO|ON|WHILE|WEND|TRON|TROFF",
        "entity.name": "Auto|Call|Chain|Clear|Close|Common|Cont|Data|MERGE|ALL|Delete|DIM|EDIT|END|ERASE|ERROR|FIELD|"
            + "GET|INPUT|KILL|LET|LIST|LLIST|LOAD|LSET|RSET|MERGE|NEW|NULL|OPEN|OUT|POKE|PRINT|PUT|RANDOMIZE|READ|"
            + "RENUM|RESTORE|RESUME|RUN|SAVE|STOP|SWAP|WAIT|WIDTH",
        "keyword.operator": "Mod|And|Not|Or|Xor|Eqv|Imp",
        "support.function": "ABS|ASC|ATN|CDBL|CINT|COS|CSNG|CVI|CVS|CVD|EOF|EXP|FIX|FRE|INP|INSTR|INT|LEN|LOC|LOG|LPOS|"
            + "PEEK|POS|RND|SGN|SIN|SPC|SQR|TAB|TAN|USR|VAL|VARPTR"
    }, "identifier", true);

    this.$rules = {
        "start": [
            {
                token: "string",
                regex: /"(?:\\.|[^"\\])*"/
            },
            {
                token: "support.function",
                regex: /(HEX|CHR|INPUT|LEFT|MID|MKI|MKS|MKD|OCT|RIGHT|SPACE|STR|STRING)\$/
            }, {
                token: "entity.name",
                regex: /(?:DEF\s(?:SEG|USR|FN[a-zA-Z]+)|LINE\sINPUT|L?PRINT#?(?:\sUSING)?|MID\$|ON\sERROR\sGOTO|OPTION\sBASE|WRITE#?|DATE\$|INKEY\$|TIME\$)/
            }, {
                token: "variable",
                regex: /[a-zA-Z][a-zA-Z0-9_]{0,38}[$%!#]?(?=\s*=)/
            }, {
                token: "keyword.operator",
                regex: /\\|=|\^|\*|\/|\+|\-|<|>|-/
            }, {
                token: "paren.lparen",
                regex: /[([]/
            }, {
                token: "paren.rparen",
                regex: /[\)\]]/
            }, {
                token: "constant.numeric",
                regex: /[+-]?\d+(\.\d+)?([ED][+-]?\d+)?(?:[!#])?/
            }, {
                token: "constant.numeric", //hexal, octal
                regex: /&[HO]?[0-9A-F]+/
            }, {
                token: "comment",
                regex: /REM\s+.*$/
            }, {
                regex: "\\w+",
                token: keywordMapper
            },{
                token: "punctiation",
                regex: /[,;]/

            }
        ]

    };
    this.normalizeRules();
};

oop.inherits(BasicHighlightRules, TextHighlightRules);

exports.BasicHighlightRules = BasicHighlightRules;
