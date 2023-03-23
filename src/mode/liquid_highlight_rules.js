"use strict";

var oop = require("../lib/oop");

var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var CssHighlightRules = require("./css_highlight_rules").CssHighlightRules;
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;
var JsonHighlightRules = require("./json_highlight_rules").JsonHighlightRules;
var JavaScriptHighlightRules =  require("./javascript_highlight_rules").JavaScriptHighlightRules;

var LiquidHighlightRules = function () {

  HtmlHighlightRules.call(this);

  /**
   * Embedded Matches
   *
   * Handles `onMatch` tokens and correct parses the
   * inner contents of the tag.
   */
  function onMatchEmbedded(name) {

    const length = name.length;

    return function (value) {

      const idx = value.indexOf(name);

      const x = [
        {
          type: "meta.tag.punctuation.tag-open",
          value: "{%"
        },
        {
          type: "text",
          value: value.slice(2, idx)
        },
        {
          type: "keyword.tag" + name + ".tag-name",
          value: value.slice(idx, idx + length)
        },
        {
          type: "text",
          value: value.slice(idx + length, value.indexOf("%}"))
        },
        {
          type: "meta.tag.punctuation.tag-close",
          value: "%}"
        }
      ];

      return x;
    };
  }


  for (var rule in this.$rules) {

    this.$rules[rule].unshift(
      {
        token: "comment.block",
        regex: /{%-?\s*comment\s*-?%}/,
        next: [
          {
            token: "comment.block",
            regex: /{%-?\s*endcomment\s*-?%}/,
            next: "pop"
          },
          {
            defaultToken: "comment",
            caseInsensitive: false
          }
        ]
      },
      {
        token: "comment.line",
        regex: /{%-?\s*#/,
        next: [
          {
            token: "comment.line",
            regex: /-?%}/,
            next: "pop"
          },
          {
            defaultToken: "comment",
            caseInsensitive: false
          }
        ]
      },
      {
        token: 'style.embedded.start',
        regex: /({%-?\s*\bstyle\b\s*-?%})/,
        next: "style-start",
        onMatch: onMatchEmbedded("style")
      },
      {
        regex: /({%-?\s*\bstylesheet\b\s*-?%})/,
        next: "stylesheet-start",
        onMatch: onMatchEmbedded("stylesheet")
      },
      {
        regex: /({%-?\s*\bschema\b\s*-?%})/,
        next: "schema-start",
        onMatch: onMatchEmbedded("schema")
      },
      {
        regex: /({%-?\s*\bjavascript\b\s*-?%})/,
        next: "javascript-start",
        onMatch: onMatchEmbedded("javascript")
      },
      {
        token: "meta.tag.punctuation.tag-open",
        regex: /({%)/,
        next: [
          {
              token: "keyword.block",
              regex: /-?\s*[a-zA-Z_$][a-zA-Z0-9_$]+\b/,
              next: 'liquid-start'
          },
          {
            token: "meta.tag.punctuation.tag-close",
            regex: /(-?)(%})/,
            next: "pop"
          }
        ]
      },
      {
        token: "meta.tag.punctuation.ouput-open",
        regex: /({{)/,
        push: "liquid-start"
      }
    );
  }

  /* -------------------------------------------- */
  /* EMBEDDED REGIONS                             */
  /* -------------------------------------------- */

  this.embedRules(JsonHighlightRules, "schema-", [
    {
      token: "schema-start",
      next: "pop",
      regex: /({%-?\s*\bendschema\b\s*-?%})/,
      onMatch: onMatchEmbedded("endschema")
    }
  ]);

  this.embedRules(JavaScriptHighlightRules, "javascript-", [
    {
      token: "javascript-start",
      next: "pop",
      regex: /({%-?\s*\bendjavascript\b\s*-?%})/,
      onMatch: onMatchEmbedded("endjavascript")
    }
  ]);



  this.embedRules(CssHighlightRules, "style-", [
    {
      token: "style-start",
      next: "pop",
      regex: /({%-?\s*\bendstyle\b\s*-?%})/,
      onMatch: onMatchEmbedded("endstyle")
    }
  ]);

  this.embedRules(CssHighlightRules, "stylesheet-", [
    {
      token: "stylesheet-start",
      next: "pop",
      regex: /({%-?\s*\bendstylesheet\b\s*-?%})/,
      onMatch: onMatchEmbedded("endstylesheet")
    }
  ]);

  /* -------------------------------------------- */
  /* LIQUID GRAMMARS                              */
  /* -------------------------------------------- */

  this.addRules({
    "liquid-start": [
      {
        token: "meta.tag.punctuation.ouput-close",
        regex: /}}/,
        next: "pop"
      },
      {
        token: "meta.tag.punctuation.tag-close",
        regex: /%}/,
        next: "pop"
      },
      {
        token: "string",
        regex: /['](?:(?:\\.)|(?:[^'\\]))*?[']/
      },
      {
        token: "string",
        regex: /["](?:(?:\\.)|(?:[^'\\]))*?["]/
      },
      {
        token: "constant.numeric",
        regex: /0[xX][0-9a-fA-F]+\b/
      },
      {
        token: "constant.numeric",
        regex: /[+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b/
      },
      {
        token: "keyword.operator",
        regex: /\*|\-|\+|=|!=|\?\|\:/
      },
      {
        token: "constant.language.boolean",
        regex: /(?:true|false|nil|empty)\b/
      },
      {
        token: "keyword.operator",
        regex: /\s+(?:and|contains|in|with)\b\s+/
      },
      {
        token: ["keyword.operator", "support.function"],
        regex: /(\|\s*)([a-zA-Z_]+)/

      },
      {
        token: "support.function",
        regex: /\s*([a-zA-Z_]+\b)(?=:)/
      },
      {
        token: "keyword.operator",
        regex:
          /(:)\s*(?=[a-zA-Z_])/
      },
      {
        token: [
          "support.class",
          "keyword.operator",
          "support.object",
          "keyword.operator",
          "variable.parameter"
        ],
        regex: /(\w+)(\.)(\w+)(\.)?(\w+)?/
      },
      {
        token: "variable.parameter",
        regex: /\.([a-zA-Z_$][a-zA-Z0-9_$]*\b)$/
      },
      {
        token: "support.class",
        regex: /(?:additional_checkout_buttons|content_for_additional_checkout_buttons)\b/
      },
      {
        token: "paren.lparen",
        regex: /[\[\({]/
      },
      {
        token: "paren.rparen",
        regex: /[\])}]/
      },
      {
        token: "text",
        regex: /\s+/
      }
    ]
  });

  this.normalizeRules();

};

oop.inherits(LiquidHighlightRules, TextHighlightRules);

exports.LiquidHighlightRules = LiquidHighlightRules;
