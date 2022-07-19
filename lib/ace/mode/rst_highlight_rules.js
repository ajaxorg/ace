"use strict";

var oop = require("../lib/oop");
var lang = require("../lib/lang");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var RSTHighlightRules = function() {

  var tokens = {
    title: "markup.heading",
    list: "markup.heading",
    table: "constant",
    directive: "keyword.operator",
    entity: "string",
    link: "markup.underline.list",
    bold: "markup.bold",
    italic: "markup.italic",
    literal: "support.function",
    comment: "comment"
  };

  var startStringPrefix = "(^|\\s|[\"'(<\\[{\\-/:])";
  var endStringSuffix = "(?:$|(?=\\s|[\\\\.,;!?\\-/:\"')>\\]}]))";

  this.$rules = {
    "start": [
      /* NB: Only the underline of the heading is highlighted.
       * ACE tokenizer does not allow backtracking, the underlined text of the
       * heading cannot be highlighted. */
      {
        token : tokens.title,
        regex : "(^)([\\=\\-`:\\.'\"~\\^_\\*\\+#])(\\2{2,}\\s*$)"
      },
      /* Generic directive syntax (e.g. .. code-block:: c)
       * All of the directive body is highlighted as a code block. */
      {
        token : ["text", tokens.directive, tokens.literal],
        regex : "(^\\s*\\.\\. )([^: ]+::)(.*$)",
        next  : "codeblock"
      },
      {
        token : tokens.directive,
        regex : "::$",
        next  : "codeblock"
      },
      /* Link/anchor definitions */
      {
        token : [tokens.entity, tokens.link],
        regex : "(^\\.\\. _[^:]+:)(.*$)"
      },
      {
        token : [tokens.entity, tokens.link],
        regex : "(^__ )(https?://.*$)"
      },
      /* Footnote definition */
      {
        token : tokens.entity,
        regex : "^\\.\\. \\[[^\\]]+\\] "
      },
      /* Comment block start */
      {
        token : tokens.comment,
        regex : "^\\.\\. .*$",
        next  : "comment"
      },
      /* List items */
      {
        token : tokens.list,
        regex : "^\\s*[\\*\\+-] "
      },
      {
        token : tokens.list,
        regex : "^\\s*(?:[A-Za-z]|[0-9]+|[ivxlcdmIVXLCDM]+)\\. "
      },
      {
        token : tokens.list,
        regex : "^\\s*\\(?(?:[A-Za-z]|[0-9]+|[ivxlcdmIVXLCDM]+)\\) "
      },
      /* "Simple" tables */
      {
        token : tokens.table,
        regex : "^={2,}(?: +={2,})+$"
      },
      /* "Grid" tables */
      {
        token : tokens.table,
        regex : "^\\+-{2,}(?:\\+-{2,})+\\+$"
      },
      {
        token : tokens.table,
        regex : "^\\+={2,}(?:\\+={2,})+\\+$"
      },
      /* Inline markup */
      {
        token : ["text", tokens.literal],
        regex : startStringPrefix + "(``)(?=\\S)",
        next  : "code"
      },
      {
        token : ["text", tokens.bold],
        regex : startStringPrefix + "(\\*\\*)(?=\\S)",
        next  : "bold"
      },
      {
        token : ["text", tokens.italic],
        regex : startStringPrefix + "(\\*)(?=\\S)",
        next  : "italic"
      },
      /* Substitution reference */
      {
        token : tokens.entity,
        regex : "\\|[\\w\\-]+?\\|"
      },
      /* Link/footnote references */
      {
        token : tokens.entity,
        regex : ":[\\w-:]+:`\\S",
        next  : "entity"
      },
      {
        token : ["text", tokens.entity],
        regex : startStringPrefix + "(_`)(?=\\S)",
        next  : "entity"
      },
      {
        token : tokens.entity,
        regex : "_[A-Za-z0-9\\-]+?"
      },
      {
        token : ["text", tokens.link],
        regex : startStringPrefix + "(`)(?=\\S)",
        next  : "link"
      },
      {
        token : tokens.link,
        regex : "[A-Za-z0-9\\-]+?__?"
      },
      {
        token : tokens.link,
        regex : "\\[[^\\]]+?\\]_"
      },
      {
        token : tokens.link,
        regex : "https?://\\S+"
      },
      /* "Grid" tables column separator
       * This is at the end to make it lower priority over all other rules. */
      {
        token : tokens.table,
        regex : "\\|"
      }
    ],

    /* This state is used for all directive bodies and literal blocks.
     * The parser returns to the "start" state when reaching the first
     * non-empty line that does not start with at least one space. */
    "codeblock": [
      {
        token : tokens.literal,
        regex : "^ +.+$",
        next : "codeblock"
      },
      {
        token : tokens.literal,
        regex : '^$',
        next: "codeblock"
      },
      {
        token : "empty",
        regex : "",
        next : "start"
      }
    ],

    /* Inline code
     * The parser returns to the "start" state when reaching "``" */
    "code": [
      {
        token : tokens.literal,
        regex : "\\S``" + endStringSuffix,
        next  : "start"
      },
      {
        defaultToken: tokens.literal
      }
    ],

    /* Bold (strong) text
     * The parser returns to the "start" state when reaching "**" */
    "bold": [
      {
        token : tokens.bold,
        regex : "\\S\\*\\*" + endStringSuffix,
        next  : "start"
      },
      {
        defaultToken: tokens.bold
      }
    ],

    /* Italic (emphasis) text
     * The parser returns to the "start" state when reaching "*" */
    "italic": [
      {
        token : tokens.italic,
        regex : "\\S\\*" + endStringSuffix,
        next  : "start"
      },
      {
        defaultToken: tokens.italic
      }
    ],

    /* Explicit role/class text or link anchor definition
     * The parser returns to the "start" state when reaching "`" */
    "entity": [
      {
        token : tokens.entity,
        regex : "\\S`" + endStringSuffix,
        next  : "start"
      },
      {
        defaultToken: tokens.entity
      }
    ],

    /* Link reference
     * The parser returns to the "start" state when reaching "`_" or "`__" */
    "link": [
      {
        token : tokens.link,
        regex : "\\S`__?" + endStringSuffix,
        next  : "start"
      },
      {
        defaultToken: tokens.link
      }
    ],

    /* Comment block.
     * The parser returns to the "start" state when reaching the first
     * non-empty line that does not start with at least one space. */
    "comment": [
      {
        token : tokens.comment,
        regex : "^ +.+$",
        next : "comment"
      },
      {
        token : tokens.comment,
        regex : '^$',
        next: "comment"
      },
      {
        token : "empty",
        regex : "",
        next : "start"
      }
    ]
  };
};
oop.inherits(RSTHighlightRules, TextHighlightRules);

exports.RSTHighlightRules = RSTHighlightRules;
