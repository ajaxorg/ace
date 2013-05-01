define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var SnippetHighlightRules = function() {

    var builtins = "SELECTION|CURRENT_WORD|SELECTED_TEXT|CURRENT_LINE|LINE_INDEX|" +
        "LINE_NUMBER|SOFT_TABS|TAB_SIZE|FILENAME|FILEPATH|FULLNAME";

    this.$rules = {
        "start" : [
            {token:"constant.language.escape", regex: /\\[\$}`\\]/},
            {token:"keyword", regex: "\\$(?:TM_)?(?:" + builtins + ")\\b"},
            {token:"variable", regex: "\\$\\w+"},
            {onMatch: function(value, state, stack) {
                if (stack[1])
                    stack[1]++;
                else
                    stack.unshift(state, 1);
                return this.tokenName;
            }, tokenName: "markup.list", regex: "\\${", next: "varDecl"},
            {onMatch: function(value, state, stack) {
                if (!stack[1])
                    return "text";
                stack[1]--;
                if (!stack[1])
                    stack.splice(0,2);
                return this.tokenName;
            }, tokenName: "markup.list", regex: "}"},
            {token: "doc.comment", regex:/^\${2}-{5,}$/}
        ],
        "varDecl" : [
            {regex: /\d+\b/, token: "constant.numeric"},
            {token:"keyword", regex: "(?:TM_)?(?:" + builtins + ")\\b"},
            {token:"variable", regex: "\\w+"},
            {regex: /:/, token: "punctuation.operator", next: "start"},
            {regex: /\//, token: "string.regex", next: "regexp"},
            {regex: "", next: "start"}
        ],
        "regexp" : [
            {regex: /\\./, token: "escape"},
            {regex: /\[/, token: "regex.start", next: "charClass"},
            {regex: "/", token: "string.regex", next: "format"},
            //{"default": "string.regex"},
            {"token": "string.regex", regex:"."}
        ],
        charClass : [
            {regex: "\\.", token: "escape"},
            {regex: "\\]", token: "regex.end", next: "regexp"},
            {"token": "string.regex", regex:"."}
        ],
        "format" : [
            {regex: /\\[ulULE]/, token: "keyword"},
            {regex: /\$\d+/, token: "variable"},
            {regex: "/[gim]*:?", token: "string.regex", next: "start"},
            // {"default": "string"},
            {"token": "string", regex:"."}
        ]
    };
};
oop.inherits(SnippetHighlightRules, TextHighlightRules);

exports.SnippetHighlightRules = SnippetHighlightRules;

var SnippetGroupHighlightRules = function() {
    this.$rules = {
        "start" : [
			{token: "text", regex: "^\\t", next: "sn-start"},
			{token:"invalid", regex: /^ \s*/},
            {token:"comment", regex: /^#.*/},
            {token:"constant.language.escape", regex: "^regex ", next: "regex"},
            {token:"constant.language.escape", regex: "^(trigger|endTrigger|name|snippet|guard|endGuard|tabTrigger|key)\\b"}
        ],
		"regex" : [
			{token:"text", regex: "\\."},
			{token:"keyword", regex: "/"},
			{token:"empty", regex: "$", next: "start"}
		]
    };
	this.embedRules(SnippetHighlightRules, "sn-", [
		{token: "text", regex: "^\\t", next: "sn-start"},
		{onMatch: function(value, state, stack) {
			stack.splice(stack.length);
			return this.tokenName;
		}, tokenName: "text", regex: "^(?!\t)", next: "start"},
	])
	
};

oop.inherits(SnippetGroupHighlightRules, TextHighlightRules);

exports.SnippetGroupHighlightRules = SnippetGroupHighlightRules;

var FoldMode = require("./folding/coffee").FoldMode;

var Mode = function() {
    var highlighter = new SnippetGroupHighlightRules();
    this.foldingRules = new FoldMode();
    this.$tokenizer = new Tokenizer(highlighter.getRules());
};
oop.inherits(Mode, TextMode);

(function() {
    this.getNextLineIndent = function(state, line, tab) {
        return this.$getIndent(line);
    };
}).call(Mode.prototype);
exports.Mode = Mode;


});
