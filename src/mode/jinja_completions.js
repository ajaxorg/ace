
"use strict";

var TokenIterator = require("../token_iterator").TokenIterator;

var jinjaFilters = [
  "abs", "float", "lower", "round", "tojson", "attr",
  "forceescape", "map", "safe", "trim", "batch", "format",
  "max", "select", "truncate", "capitalize", "groupby", "min",
  "selectattr", "unique", "center", "indent", "pprint", "slice",
  "upper", "default", "int", "random", "sort", "urlencode",
  "dictsort", "join", "reject", "string", "urlize", "escape",
  "last", "rejectattr", "striptags", "wordcount", "filesizeformat",
  "length", "replace", "sum", "wordwrap", "first", "list", "reverse",
  "title", "xmlattr"
];

var JinjaCompletions = function() {

};

(function() {

    this.getCompletions = function(keywordList, state, session, pos, prefix) {
        var token = session.getTokenAt(pos.row, pos.column);

        if (!token)
            return [];

        if (this.mayBeJinjaKeyword(token)) {
            return this.getKeywordCompletions(keywordList, state, session, pos, prefix);
        }

        if (this.mayBeJinjaFilter(token)) {
            return this.getFilterCompletions(state, session, pos, prefix);
        }

        if (this.mayBeJinjaVariable(token)) {
            return this.getVariableCompletions(state, session, pos, prefix);
        }

        return [];
    };

      this.mayBeJinjaKeyword = function(token) {
        return token.type === "meta.scope.jinja.tag";
      };

      this.mayBeJinjaFilter = function(token) {
        return token.type === "support.function.other.jinja.filter";
      };

      this.mayBeJinjaVariable = function(token) {
        return token.type === "variable";
      };

      this.getKeywordCompletions = function(keywordList, state, session, pos, prefix) {
        return keywordList.map(function(keyword) {
          return {
            caption: keyword,
            snippet: keyword,
            meta: "keyword",
            score: 1000000
          };
        });
      };

      this.getFilterCompletions = function(state, session, pos, prefix) {
        return jinjaFilters.map(function(filter) {
          return {
            caption: filter,
            snippet: filter,
            meta: "filter",
            score: 1000000
          };
        });
      };

      this.getVariableCompletions = function(state, session, pos, prefix) {
        // This is a placeholder. In a real implementation, you'd need to
        // analyze the context to suggest relevant variables.
        return [
          { caption: "loop", snippet: "loop", meta: "Nunjucks loop object", score: 1000000 },
          { caption: "super", snippet: "super()", meta: "Nunjucks super function", score: 1000000 }
        ];
      };
}).call(JinjaCompletions.prototype);

exports.JinjaCompletions = JinjaCompletions;
