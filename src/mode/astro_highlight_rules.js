"use strict";

var oop = require("../lib/oop");
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;
var JavascriptHighlightRules =
  require("./javascript_highlight_rules").JavaScriptHighlightRules;

var AstroHighlightRules = function () {
  HtmlHighlightRules.call(this);

  var astro = {
    token: "paren.quasi.start",
    regex: /{/,
    next: function (state, stack) {
      if (state !== "start") {
        if (state.indexOf("attribute-equals") !== -1) {
          stack.splice(0);
          stack.unshift("tag_stuff");
        } else {
          stack.unshift(state);
        }
      }
      return "inline-js-start";
    }
  };

  for (var key in this.$rules) {
    if (
      key.startsWith("js") ||
      key.startsWith("css") ||
      key.startsWith("comment")
    )
      continue;
    this.$rules[key].unshift(astro);
  }

  this.$rules.start.unshift({
    token: "comment",
    regex: /^---$/,
    onMatch: function (value, state, stack) {
      stack.splice(0);
      return this.token;
    },
    next: "javascript-start"
  });

  this.embedRules(JavascriptHighlightRules, "javascript-", [
    {
      regex: /^---$/,
      token: "comment",
      next: "start",
      onMatch: function (value, state, stack) {
        stack.splice(0);
        return this.token;
      }
    }
  ]);

  this.embedRules(JavascriptHighlightRules, "inline-js-");

  var astroRules = [
    {
      regex: /}/,
      token: "paren.quasi.end",
      onMatch: function (value, state, stack) {
        if (stack[0] === "inline-js-start") {
          stack.shift();
          this.next = stack.shift();
          if (this.next.indexOf("string") !== -1) 
            return "paren.quasi.end";
          return "paren.rparen";
        } else {
          this.next = stack.shift() || "start";
          return this.token;
        }
      }
    },
    {
      regex: /{/,
      token: "paren.lparen",
      push: "inline-js-start"
    }
  ];

  this.$rules["inline-js-start"].unshift(astroRules);
  this.$rules["inline-js-no_regex"].unshift(astroRules);


  function overwriteJSXendRule(prefix) {
    for (var index in this.$rules[prefix + "jsxAttributes"]) {
      if (
        this.$rules[prefix + "jsxAttributes"][index].token ===
        "meta.tag.punctuation.tag-close.xml"
      ) {
        this.$rules[prefix + "jsxAttributes"][index].onMatch = function (
          value,
          currentState,
          stack
        ) {
          if (currentState == stack[0]) stack.shift();
          if (value.length == 2) {
            if (stack[0] == this.nextState) stack[1]--;
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
  }

  overwriteJSXendRule.call(this, "javascript-");
  overwriteJSXendRule.call(this, "inline-js-");

  this.normalizeRules();
};

oop.inherits(AstroHighlightRules, HtmlHighlightRules);
exports.AstroHighlightRules = AstroHighlightRules;