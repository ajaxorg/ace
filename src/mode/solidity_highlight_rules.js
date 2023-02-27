// rules were taken from https://github.com/raphaelhuefner/ace-mode-solidity
// all credits to @raphaelhuefner

"use strict";

var oop = require("../lib/oop");
var deepCopy = require("../lib/lang").deepCopy;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var SolidityHighlightRules = function() {
    var intTypes = 'byte|int|uint';
    for (var width = 8; width <= 256; width += 8) {
        intTypes += '|bytes' + (width / 8) + '|uint' + width + '|int' + width;
    }
    var mainKeywordsByType = {
        "variable.language":
            "this|super",
        "keyword":
            "as|emit|from|import|returns",
        "keyword.control":
            "break|continue|do|else|for|if|return|while",
        "keyword.control.deprecated":
            "throw",
        "keyword.operator":
            "delete|new",
        "keyword.other.reserved": // see https://solidity.readthedocs.io/en/develop/miscellaneous.html#reserved-keywords
            "abstract|after|alias|apply|auto|case|catch|copyof|default|" +
            "define|final|immutable|implements|in|inline|let|macro|match|" +
            "mutable|null|of|override|partial|promise|reference|relocatable|" +
            "sealed|sizeof|static|supports|switch|try|type|typedef|typeof|" +
            "unchecked",
        "storage.type":
            "contract|library|interface|function|constructor|event|modifier|" +
            "struct|mapping|enum|" +
            "var|bool|address|" + intTypes,
        "storage.type.array.dynamic":
            "bytes|string",
        "storage.modifier.inheritance":
            "is",
        "storage.modifier.storagelocation":
            "storage|memory|calldata",
        "storage.modifier.statemutability":
            "constant|payable|pure|view",
        "storage.modifier.visibility":
            "private|public|external|internal",
        "storage.modifier.event":
            "anonymous|indexed",
        "support.function":
            "addmod|assert|blockhash|ecrecover|gasleft|keccak256|mulmod|" +
            "require|revert|ripemd160|selfdestruct|sha256",
        "support.function.deprecated":
            "sha3|suicide",
        "support.variable":
            "now",
        "constant.language.boolean":
            "true|false",
        "constant.numeric.other.unit.currency":
            "wei|szabo|finney|ether",
        "constant.numeric.other.unit.time":
            "seconds|minutes|hours|days|weeks",
        "constant.numeric.other.unit.time.deprecated":
            "years"
    };
    var mainKeywordMapper = this.createKeywordMapper(mainKeywordsByType, "identifier");

    // The purpose of this flag and all related code is that in function
    // argument lists only the function parameter names get tokenized as
    // "variable.parameter", and all other non-keyword identifiers as
    // "identifier".
    var hasSeenFirstFunctionArgumentKeyword = false;

    var functionArgumentsKeywordMapper = function functionArgumentsKeywordMapper(value) {
        var mainKeywordToken = mainKeywordMapper(value);
        if (
        hasSeenFirstFunctionArgumentKeyword
        &&
        (mainKeywordToken == "identifier")
        ) {
        mainKeywordToken = "variable.parameter";
        }
        hasSeenFirstFunctionArgumentKeyword = true;
        return mainKeywordToken;
    };

    var identifierRe = "[a-zA-Z_$][a-zA-Z_$0-9]*\\b|\\$"; // Single "$" can't have a word boundary since it's not a word char.

    var escapedRe = "\\\\(?:x[0-9a-fA-F]{2}|" + // hex
        "u[0-9a-fA-F]{4}|" + // unicode
        ".)"; // stuff like "\r" "\n" "\t" etc.

    var commentWipMarkerRule = function commentWipMarkerRule(commentType) {
        return {
            token : "comment." + commentType + ".doc.documentation.tag.storage.type",
            regex : "\\b(?:TODO|FIXME|XXX|HACK)\\b"
        };
    };

    var natSpecRule = function natSpecRule(commentType) {
        return {
            token : "comment." + commentType + ".doc.documentation.tag",
            regex : "\\B@(?:author|dev|notice|param|return|title)\\b"
        };
    };

    // Copied from ace/mode/text_highlight_rules and then "augmented".
    var pushFunctionArgumentsState = function(currentState, stack) {
        if (currentState != "start" || stack.length)
            stack.unshift("function_arguments", currentState);
        hasSeenFirstFunctionArgumentKeyword = false;
        return "function_arguments";
    };

    this.$rules = {
        "start" : [
            {
                token : "comment.block.doc.documentation", // doc comment
                regex : "\\/\\*(?=\\*)",
                push  : "doc_comment"
            }, {
                token : "comment.line.triple-slash.double-slash.doc.documentation", // triple slash "NatSpec" doc comment
                regex : "\\/\\/\\/",
                push  : "doc_line_comment"
            }, {
                token : "comment.block", // multi line comment
                regex : "\\/\\*",
                push  : "comment"
            }, {
                token : "comment.line.double-slash",
                regex : "\\/\\/",
                push  : "line_comment"
            }, {
                token : "text",
                regex : "\\s+|^$"
            }, {
                token : "string.quoted.single",
                regex : "'(?=.)",
                push  : "qstring"
            }, {
                token : "string.quoted.double",
                regex : '"(?=.)',
                push  : "qqstring"
            }, {
                token : "storage.type.reserved", // TODO really "reserved"? Compiler 0.4.24 says "UnimplementedFeatureError: Not yet implemented - FixedPointType."
                regex : "u?fixed(?:" +
                        "8x[0-8]|" + // Docs say 0-80 for the fractional part. It's unclear whether 0-80 bits or 0-80 decimal places.
                        "16x(?:1[0-6]|[0-9])|" + // Longest match has to be first alternative.
                        "24x(?:2[0-4]|1[0-9]|[0-9])|" +
                        "32x(?:3[0-2]|[1-2][0-9]|[0-9])|" +
                        "40x(?:40|[1-3][0-9]|[0-9])|" +
                        "48x(?:4[0-8]|[1-3][0-9]|[0-9])|" +
                        "56x(?:5[0-6]|[1-4][0-9]|[0-9])|" +
                        "64x(?:6[0-4]|[1-5][0-9]|[0-9])|" +
                        "72x(?:7[0-2]|[1-6][0-9]|[0-9])|" +
                        "(?:80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)x(?:80|[1-7][0-9]|[0-9])" +
                        ")?",
                inheritingStateRuleId : "fixedNumberType"
            }, {
                token : "keyword.control", // PlaceholderStatement in ModifierDefinition
                regex : /\b_\b/
            }, {
                token : [ // HexLiteral
                    "string.other.hex", "string.other.hex", "string.other.hex",
                    "string.other.hex", "string.other.hex"
                ],
                regex : /(\b)(hex)(['"])((?:[0-9a-fA-F]{2})*)(\3)/
            }, {
                token : "constant.numeric.hex", // hex
                regex : /0[xX][0-9a-fA-F]+\b/
            }, {
                token : "constant.numeric", // float
                regex : /[+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b/
            }, {
                token : ["keyword", "text", "keyword", "text", "constant.other"],
                regex : "(pragma)(\\s+)(solidity|experimental)(\\s+)([^;]+)"
            }, {
                token : ["keyword", "text", "identifier", "text", "keyword", "text", "identifier"], // UsingForDeclaration
                regex : "(using)(\\s+)(" + identifierRe + ")(\\s+)(for)(\\s+)(" + identifierRe + "|\\*)"
            }, {
                token : "support.function.deprecated", // Not in keywordMapper because of ".". Longest match has to be first alternative.
                regex : /block\s*\.\s*blockhash|\.\s*callcode/
            }, {
                token : "support.function", // Not in keywordMapper because of ".". Longest match has to be first alternative.
                regex : /abi\s*\.\s*(?:encodeWithSignature|encodeWithSelector|encodePacked|encode)|\.\s*(?:delegatecall|transfer|call|send)/
            }, {
                token : "support.variable", // Not in keywordMapper because of ".". Longest match has to be first alternative.
                regex : /block\s*\.\s*(?:difficulty|timestamp|coinbase|gaslimit|number)|msg\s*\.\s*(?:sender|value|data)|tx\s*\.\s*(?:gasprice|origin)|\.\s*balance/
            }, {
                token : "support.variable.deprecated", // Not in keywordMapper because of ".". Longest match has to be first alternative.
                regex : /msg\s*\.\s*gas/
            }, {
                token : [ // FunctionDefinition
                    "storage.type", "text", "entity.name.function", "text", "paren.lparen"
                ],
                regex : "(function)(\\s+)(" + identifierRe + ")(\\s*)(\\()",
                next  : pushFunctionArgumentsState
            }, {
                token : ["storage.type", "text", "paren.lparen"], // FunctionTypeName && fallback function definition
                regex : "(function)(\\s*)(\\()",
                next  : pushFunctionArgumentsState
            }, {
                token : ["keyword", "text", "paren.lparen"], // "returns" clause
                regex : "(returns)(\\s*)(\\()",
                next  : pushFunctionArgumentsState
            }, {
                token : mainKeywordMapper,
                regex : identifierRe,
                inheritingStateRuleId : "keywordMapper"
            }, {
                token : "keyword.operator",
                regex : /--|\*\*|\+\+|=>|<<|>>|<<=|>>=|&&|\|\||[!&|+\-*\/%~^<>=]=?/
            }, {
                token : "punctuation.operator",
                regex : /[?:;]/
            }, {
                token : "punctuation.operator", // keep "." and "," separate for easier cloning and modifying into "function_arguments"
                regex : /[.,]/,
                inheritingStateRuleId : "punctuation"
            }, {
                token : "paren.lparen",
                regex : /[\[{]/
            }, {
                token : "paren.lparen", // keep "(" separate for easier cloning and modifying into "function_arguments"
                regex : /[(]/,
                inheritingStateRuleId : "lparen"
            }, {
                token : "paren.rparen",
                regex : /[\]}]/
            }, {
                token : "paren.rparen", // keep ")" separate for easier cloning and modifying into "function_arguments"
                regex : /[)]/,
                inheritingStateRuleId : "rparen"
            }
        ],
        "comment" : [
            commentWipMarkerRule("block"),
            {
                token : "comment.block",
                regex : "\\*\\/",
                next  : "pop"
            }, {
                defaultToken : "comment.block",
                caseInsensitive : true
            }
        ],
        "line_comment" : [
            commentWipMarkerRule("line"),
            {
                token : "comment.line.double-slash",
                regex : "$|^",
                next  : "pop"
            }, {
                defaultToken : "comment.line.double-slash",
                caseInsensitive : true
            }
        ],
        "doc_comment" : [
            commentWipMarkerRule("block"),
            natSpecRule("block"),
            {
                token : "comment.block.doc.documentation", // closing comment
                regex : "\\*\\/",
                next  : "pop"
            }, {
                defaultToken : "comment.block.doc.documentation",
                caseInsensitive : true
            }
        ],
        "doc_line_comment" : [
            commentWipMarkerRule("line"),
            natSpecRule("line"),
            {
                token : "comment.line.triple-slash.double-slash.doc.documentation",
                regex : "$|^",
                next  : "pop"
            }, {
                defaultToken : "comment.line.triple-slash.double-slash.doc.documentation",
                caseInsensitive : true
            }
        ],
        "qqstring" : [
            {
                token : "constant.language.escape",
                regex : escapedRe
            }, {
                token : "string.quoted.double", // Multi-line string by ending line with back-slash, i.e. escaping \n.
                regex : "\\\\$",
                next  : "qqstring"
            }, {
                token : "string.quoted.double",
                regex : '"|$',
                next  : "pop"
            }, {
                defaultToken : "string.quoted.double"
            }
        ],
        "qstring" : [
            {
                token : "constant.language.escape",
                regex : escapedRe
            }, {
                token : "string.quoted.single", // Multi-line string by ending line with back-slash, i.e. escaping \n.
                regex : "\\\\$",
                next  : "qstring"
            }, {
                token : "string.quoted.single",
                regex : "'|$",
                next  : "pop"
            }, {
                defaultToken : "string.quoted.single"
            }
        ]
    };

    // The "function_arguments" state "inherits" from the "start" state.
    // Since states are not classes, we do the inheritance manually here.
    // The rules which get overwritten or modified by the "child" state are
    // identified by "inheritingStateRuleId" properties.
    var functionArgumentsRules = deepCopy(this.$rules["start"]);
    functionArgumentsRules.forEach(function(rule, ruleIndex) {
        if (rule.inheritingStateRuleId) {
            switch (rule.inheritingStateRuleId) {
                case "keywordMapper":
                    rule.token = functionArgumentsKeywordMapper;
                    break;
                case "punctuation":
                    rule.onMatch = function onFunctionArgumentsPunctuationMatch(value, currentState, stack) {
                        hasSeenFirstFunctionArgumentKeyword = false;
                        return rule.token;
                    };
                    break;
                case "lparen":
                    rule.next = pushFunctionArgumentsState;
                    break;
                case "rparen":
                    rule.next = "pop";
                    break;
                case "fixedNumberType":
                    rule.onMatch = function onFunctionArgumentsFixedNumberTypeMatch(value, currentState, stack) {
                        hasSeenFirstFunctionArgumentKeyword = true;
                        return rule.token;
                    };
                    break;
            }
            delete rule.inheritingStateRuleId;
            delete this.$rules["start"][ruleIndex].inheritingStateRuleId; // TODO Keep id if there will be more "child" states.
            functionArgumentsRules[ruleIndex] = rule;
        }
    }, this);
    this.$rules["function_arguments"] = functionArgumentsRules;

    this.normalizeRules();
};

oop.inherits(SolidityHighlightRules, TextHighlightRules);

exports.SolidityHighlightRules = SolidityHighlightRules;