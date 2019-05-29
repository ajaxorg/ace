"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var GraphQLSchemaHighlightRules = function() {

    var keywords = (
      "type|interface|union|enum|schema|input|implements|extends|scalar"
    );

    var dataTypes = (
      "Int|Float|String|ID|Boolean"
    );

    var keywordMapper = this.createKeywordMapper({
        "keyword": keywords,
        "storage.type": dataTypes
    }, "identifier");

    this.$rules = {
      "start" : [ {
        token : "comment",
        regex : "#.*$"
      }, {
        token : "paren.lparen",
        regex : /[\[({]/,
        next  : "start"
      }, {
        token : "paren.rparen",
        regex : /[\])}]/
      }, {
        token : keywordMapper,
        regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
      } ]
    };
    this.normalizeRules();
};

oop.inherits(GraphQLSchemaHighlightRules, TextHighlightRules);

exports.GraphQLSchemaHighlightRules = GraphQLSchemaHighlightRules;
