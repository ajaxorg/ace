define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var lang = require("../lib/lang");
var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;
var CSharpHighlightRules = require("./csharp_highlight_rules").CSharpHighlightRules;

var blockPrefix = 'razor-block-';
var RazorLangHighlightRules = function() {
    CSharpHighlightRules.call(this);

    var processPotentialCallback = function(value, stackItem) {
        if (typeof stackItem === "function")
            return stackItem(value);

        return stackItem;
    };

    var inBraces = 'in-braces';
    this.$rules.start.unshift({
        regex: '[\\[({]',
        onMatch: function(value, state, stack) {
            var prefix = /razor-[^\-]+-/.exec(state)[0];

            stack.unshift(value);
            stack.unshift(prefix + inBraces);
            this.next = prefix + inBraces;
            return 'paren.lparen';
        }
    });

    var parentCloseMap = {
        '{': '}',
        '[': ']',
        '(': ')'
    };

    this.$rules[inBraces] = lang.deepCopy(this.$rules.start);
    this.$rules[inBraces].unshift({
        regex: '[\\])}]',
        onMatch: function(value, state, stack) {
            var open = stack[1];
            if (parentCloseMap[open] !== value)
                return 'invalid.illegal';

            stack.shift(); // exit in-braces block
            stack.shift(); // exit brace marker
            this.next = processPotentialCallback(value, stack[0]) || 'start';
            return 'paren.rparen';
        }
    });
};

oop.inherits(RazorLangHighlightRules, CSharpHighlightRules);

var RazorHighlightRules = function() {
    HtmlHighlightRules.call(this);

    // 'Blocks': @{}, @(), @functions{}

    var blockStartRule = {
        regex: '@[({]|@functions{',
        onMatch: function(value, state, stack) {
            stack.unshift(value);
            stack.unshift('razor-block-start');
            this.next = 'razor-block-start';
            return 'punctuation.block.razor';
        }
    };

    var blockEndMap = {
        '@{': '}',
        '@(': ')',
        '@functions{':'}'
    };

    var blockEndRule = {
        regex: '[})]',
        onMatch: function(value, state, stack) {
            var blockStart = stack[1];
            if (blockEndMap[blockStart] !== value)
                return 'invalid.illegal';

            stack.shift(); // exit razor block
            stack.shift(); // remove block type marker
            this.next = stack.shift() || 'start';
            return 'punctuation.block.razor';
        }
    };

    // Short: @Abc.Cde(Xyz).Ef

    var shortStartRule = {
        regex: "@(?![{(])",
        onMatch: function(value, state, stack) {
            stack.unshift("razor-short-start");
            this.next = "razor-short-start";
            return 'punctuation.short.razor';
        }
    };

    var shortEndRule = {
        token: "",
        regex: "(?=[^A-Za-z_\\.()\\[\\]])",
        next: 'pop'
    };

    // Control flow: @if, etc

    var ifStartRule = {
        regex: "@(?=if)",
        onMatch: function(value, state, stack) {
            stack.unshift(function(value) {
                if (value !== '}')
                    return 'start';

                return stack.shift() || 'start';
            });
            this.next = 'razor-block-start';
            return 'punctuation.control.razor';
        }
    };

    // Combined:

    var razorStartRules = [
        {
            token: ["meta.directive.razor", "text", "identifier"],
            regex: "^(\\s*@model)(\\s+)(.+)$"
        },
        blockStartRule,
        //ifStartRule,
        shortStartRule
    ];

    for (var key in this.$rules)
        this.$rules[key].unshift.apply(this.$rules[key], razorStartRules);

    this.embedRules(RazorLangHighlightRules, "razor-block-", [blockEndRule], ["start"]);
    this.embedRules(RazorLangHighlightRules, "razor-short-", [shortEndRule], ["start"]);

    this.normalizeRules();
};

oop.inherits(RazorHighlightRules, HtmlHighlightRules);

exports.RazorHighlightRules = RazorHighlightRules;
exports.RazorLangHighlightRules = RazorLangHighlightRules;
});
