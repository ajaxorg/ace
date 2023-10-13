"use strict";

var oop = require("../lib/oop");
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;
var JavascriptHighlightRules = require("./javascript_highlight_rules").JavaScriptHighlightRules;

var AstroHighlightRules = function () {
  HtmlHighlightRules.call(this);

  var astro = {
    token: "paren.quasi.start.astro.level3",
    regex: /{/,
    next: "inline-js-start"
  };

  for (var key in this.$rules) {
    if (key.startsWith("js") || key.startsWith("css") || key.startsWith("comment")) continue;
    this.$rules[key].unshift(astro);
  }

  this.$rules.start.unshift({
    token: "comment",
    regex: "---",
    onMatch: function (value, state, stack) {
      stack.splice(0);
      return this.token;
    },
    next: "js-start"
  });

  this.embedRules(JavascriptHighlightRules, "js-", [{
    regex: "---",
    token: "comment",
    next: "start",
    onMatch: function (value, state, stack) {
      stack.splice(0);
      return this.token;
    }
  }]);

  this.embedRules(JavascriptHighlightRules, "inline-js-", [{
    regex: /}/,
    token: "paren.quasi.end.astro.level3",
    onMatch: function (value, state, stack) {
      if (stack.length) {
        if (stack.includes("inline-js-start")) {
          stack.shift();
          this.next = stack.shift();
          if (this.next.indexOf("string") !== -1) return "paren.quasi.end";
          return "paren.rparen";
        } else {
          if (stack.includes("string.attribute-value.xml0")) {
            this.next = "string.attribute-value.xml0";
          }
          else if (stack.includes("tag_stuff")) {
            this.next = "tag_stuff";
          }
          return this.token;
        }
      } else {
        this.next = this.nextState;
        return this.token;
      }
    },
    nextState: "start"
  }, {
    regex: /{/,
    token: "paren.lparen",
    push: "inline-js-start"
  }]);

  var overwriteJSXendRule = function (prefix) {
    for (var index in this.$rules[prefix + "jsxAttributes"]) {
      if (this.$rules[prefix + "jsxAttributes"][index].token === "meta.tag.punctuation.tag-close.xml") {
        this.$rules[prefix + "jsxAttributes"][index].onMatch = function (value, currentState, stack) {
          if (currentState == stack[0])
            stack.shift();
          if (value.length == 2) {
            if (stack[0] == this.nextState)
              stack[1]--;
            if (!stack[1] || stack[1] < 0) {
              stack.splice(0, 2);
            }
          }
          this.next = stack[0] || prefix + "start";
          return [{ type: this.token, value: value }];
        };
        break;
      }
    }
  };

  overwriteJSXendRule.call(this, "js-");
  overwriteJSXendRule.call(this, "inline-js-");

  this.normalizeRules();
};

oop.inherits(AstroHighlightRules, HtmlHighlightRules);
exports.AstroHighlightRules = AstroHighlightRules;
