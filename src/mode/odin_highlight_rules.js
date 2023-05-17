var oop = require("../lib/oop");
var DocCommentHighlightRules =
  require("./doc_comment_highlight_rules").DocCommentHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var OdinHighlightRules = function () {
  var keywords =
    "using|transmute|cast|distinct|opaque|where|" +
    "struct|enum|union|bit_field|bit_set|" +
    "if|when|else|do|switch|case|break|fallthrough|" +
    "size_of|offset_of|type_info_if|typeid_of|type_of|align_of|" +
    "or_return|or_else|inline|no_inline|" +
    "import|package|foreign|defer|auto_cast|map|matrix|proc|" +
    "for|continue|not_in|in";

  const cartesian = (...a) =>
    a
      .reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())))
      .map((parts) => parts.join(""));

  var builtinTypes = [
    "int",
    "uint",
    "uintptr",
    "typeid",
    "rawptr",
    "string",
    "cstring",
    "i8",
    "u8",
    "any",
    "byte",
    "rune",
    "bool",
    "b8",
    "b16",
    "b32",
    "b64",
    ...cartesian(["i", "u"], ["16", "32", "64", "128"], ["", "le", "be"]),
    ...cartesian(["f"], ["16", "32", "64"], ["", "le", "be"]),
    ...cartesian(["complex"], ["32", "64", "128"]),
    ...cartesian(["quaternion"], ["64", "128", "256"])
  ].join("|");

  var operators = [
    "\\*",
    "/",
    "%",
    "%%",
    "<<",
    ">>",
    "&",
    "&~",
    "\\+",
    "\\-",
    "~",
    "\\|",
    ">",
    "<",
    "<=",
    ">=",
    "==",
    "!="
  ]
    .concat(":")
    .map((operator) => operator + "=")
    .concat("=", ":=", "::", "->", "\\^", "&", ":")
    .join("|");

  var builtinFunctions = "new|cap|copy|panic|len|make|delete|append|free";
  var builtinConstants = "nil|true|false";

  var keywordMapper = this.createKeywordMapper(
    {
      keyword: keywords,
      "constant.language": builtinConstants,
      "support.function": builtinFunctions,
      "support.type": builtinTypes
    },
    ""
  );

  var stringEscapeRe =
    "\\\\(?:[0-7]{3}|x\\h{2}|u{4}|U\\h{6}|[abfnrtv'\"\\\\])".replace(
      /\\h/g,
      "[a-fA-F\\d]"
    );

  this.$rules = {
    start: [
      {
        token: "comment",
        regex: /\/\/.*$/
      },
      DocCommentHighlightRules.getStartRule("doc-start"),
      {
        token: "comment.start", // multi line comment
        regex: "\\/\\*",
        next: "comment"
      },
      {
        token: "string", // single line
        regex: /"(?:[^"\\]|\\.)*?"/
      },
      {
        token: "string", // raw
        regex: "`",
        next: "bqstring"
      },
      {
        token: "support.constant",
        regex: /#[a-z_]+/
      },
      {
        token: "constant.numeric", // rune
        regex:
          "'(?:[^\\'\uD800-\uDBFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|" +
          stringEscapeRe.replace('"', "") +
          ")'"
      },
      {
        token: "constant.numeric", // hex
        regex: "0[xX][0-9a-fA-F]+\\b"
      },
      {
        token: "constant.numeric", // float
        regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
      },
      {
        token: [
          "entity.name.function",
          "text",
          "keyword.operator",
          "text",
          "keyword"
        ],
        regex: "([a-zA-Z_$][a-zA-Z0-9_$]*)(\\s+)(::)(\\s+)(proc)\\b"
      },
      {
        token: function (val) {
          if (val[val.length - 1] == "(") {
            return [
              {
                type: keywordMapper(val.slice(0, -1)) || "support.function",
                value: val.slice(0, -1)
              },
              {
                type: "paren.lparen",
                value: val.slice(-1)
              }
            ];
          }

          return keywordMapper(val) || "identifier";
        },
        regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b\\(?"
      },
      {
        token: "keyword.operator",
        regex: operators
      },
      {
        token: "punctuation.operator",
        regex: "\\?|\\,|\\;|\\."
      },
      {
        token: "paren.lparen",
        regex: "[[({]"
      },
      {
        token: "paren.rparen",
        regex: "[\\])}]"
      },
      {
        token: "text",
        regex: "\\s+"
      }
    ],
    comment: [
      {
        token: "comment.end",
        regex: "\\*\\/",
        next: "start"
      },
      {
        defaultToken: "comment"
      }
    ],
    bqstring: [
      {
        token: "string",
        regex: "`",
        next: "start"
      },
      {
        defaultToken: "string"
      }
    ]
  };

  this.embedRules(DocCommentHighlightRules, "doc-", [
    DocCommentHighlightRules.getEndRule("start")
  ]);
};
oop.inherits(OdinHighlightRules, TextHighlightRules);

exports.OdinHighlightRules = OdinHighlightRules;
