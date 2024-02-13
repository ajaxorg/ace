"use strict";

var oop = require("../lib/oop");
var {CssHighlightRules} = require("./css_highlight_rules");
var {TypeScriptHighlightRules} = require("./typescript_highlight_rules");
var {CoffeeHighlightRules} = require("./coffee_highlight_rules");
var {HtmlHighlightRules} = require("./html_highlight_rules");
var {JavaScriptHighlightRules} = require("./javascript_highlight_rules");
var {StylusHighlightRules} = require("./stylus_highlight_rules");
var {SassHighlightRules} = require("./sass_highlight_rules");
var {ScssHighlightRules} = require("./scss_highlight_rules");
var {LessHighlightRules} = require("./less_highlight_rules");
const {Tokenizer} = require("../tokenizer");

var JavaScriptMode = require("./javascript").Mode;

var VueHighlightRules = function (options) {

    /**
     * @param {{new(): Ace.HighlightRules}|Ace.HighlightRulesMap} HighlightRules
     * @param {string} tag
     * @param {string} value
     * @param {string} [attribute]
     */
    this.embedLangRules = function (HighlightRules, tag, value, attribute) {
        var condition = attribute ? "(?=[^>]*" + attribute + "\\s*=\\s*['\"]" + value + "['\"]))" : "(?=\\s|>|$))";
        this.$rules.start.unshift({
            token: ["meta.tag.punctuation.tag-open.xml", "meta.tag." + tag + ".tag-name.xml"],
            regex: "(<)(" + tag + condition,
            next: [
                {
                    token: "meta.tag.punctuation.tag-close." + tag + ".xml",
                    regex: "/?>",
                    next: value + "-start"
                }, {include: "attributes"}
            ]
        });

        this.$rules[tag + "-end"] = [
            {include: "attributes"}, {
                token: "meta.tag.punctuation.tag-close.xml",
                regex: "/?>",
                next: "start",
                onMatch: function (value, currentState, stack) {
                    stack.splice(0);
                    return this.token;
                }
            }
        ];

        this.embedRules(HighlightRules, value + "-", [
            {
                token: ["meta.tag.punctuation.end-tag-open.xml", "meta.tag." + tag + ".tag-name.xml"],
                regex: "(</)(" + tag + "(?=\\s|>|$))",
                next: tag + "-end"
            }, {
                token: "string.cdata.xml",
                regex: "<\\!\\[CDATA\\["
            }, {
                token: "string.cdata.xml",
                regex: "\\]\\]>"
            }
        ]);
    };

    var vueRules = [
        {
            token: "punctuation",
            regex: /\{\{\{?/,
            next: "js-interpolation-start"
        }
    ];

    var VueRules = new HtmlHighlightRules().getRules();
    VueRules.start = vueRules.concat(VueRules.start);
    var self = this;
    VueRules.tag_stuff.unshift({
        token: /*"string"*/[
            "entity.other.attribute-name.html", "punctuation.separator.key-value.html",
            "entity.other.attribute-name.html", "entity.other.attribute-name.html", "entity.other.attribute-name.html",
            "text", "punctuation.separator.key-value.html", "text", "lparen.paren"
        ],
        regex: /(?:\b(v-)|(:|@))([a-zA-Z\-.]+)(?:\:([a-zA-Z\-]+))?(?:\.([a-zA-Z\-]+))*(\s*)(=)(\s*)(["'])/,
        onMatch: function (value, currentState, stack) {
            var quote = value[value.length - 1];
            stack.unshift(quote, currentState);
            return this.token;
        },
        next: [
            {
                token: "string",
                regex: /$/,
                next: "tag_stuff"
            }, {
                token: "string",
                regex: /.*/,
                onMatch: function (value, currentState, stack, line) {
                    var quote = stack[0];
                    var parts = value.split(quote);
                    let text = parts[0];
                    this.next = "";
                    if (parts.length > 1) {
                        stack.shift();
                        var nextState = stack.shift();
                        var currentData = new Tokenizer(self.$rules).getLineTokens(
                            parts.slice(1).join(quote), nextState);
                        currentData.tokens.unshift({
                            type: "string",
                            value: quote
                        });
                        this.next = Array.isArray(currentData.state) ? currentData.state[currentData.state.length - 1]
                            : currentData.state;
                    }
                    var data = new JavaScriptMode().getTokenizer().getLineTokens(text, "start");
                    var tokens = data.tokens;
                    if (currentData) {
                        tokens.push(...currentData.tokens);
                    }
                    return tokens;
                }
            }
        ]
    });
    this.$rules = VueRules;

    this.embedRules(JavaScriptHighlightRules, "js-interpolation-", [
        {
            token: "punctuation",
            regex: /\}\}\}?/,
            next: "start"
        }
    ]);

    this.embedLangRules(CssHighlightRules, "style", "css");
    this.embedLangRules(StylusHighlightRules, "style", "stylus", "lang");
    //TODO: postcss is missing: this.embedLangRules(StylusHighlightRules, "style", "lang", "postcss");
    this.embedLangRules(SassHighlightRules, "style", "sass", "lang");
    this.embedLangRules(ScssHighlightRules, "style", "scss", "lang");
    this.embedLangRules(LessHighlightRules, "style", "less", "lang");
    this.embedLangRules(TypeScriptHighlightRules, "script", "ts", "lang");
    this.embedLangRules(CoffeeHighlightRules, "script", "coffee", "lang");
    //TODO: this.embedLangRules(CoffeeHighlightRules, "script", "livescript", "lang");

    this.normalizeRules();
};

oop.inherits(VueHighlightRules, HtmlHighlightRules);

exports.VueHighlightRules = VueHighlightRules;
