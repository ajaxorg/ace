/* global define */

define(function(require, exports, module) {
  "use strict";

  var oop = require("../lib/oop");
  var CssHighlightRules = require("./css_highlight_rules").CssHighlightRules;
  var JavaScriptHighlightRules = require("./javascript_highlight_rules").JavaScriptHighlightRules;
  var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
  var xmlUtil = require("./xml_util");

  var MustacheHighlightRules = function() {

    this.$rules = {
        start : [{
            token : "comment",          // comment
            regex : "{{!",
            next : "comment_start"
        }, {
            token : "support.function", // begin section
            regex : "{{#",
            next : "mustache_start"
        }, {
            token : "support.function", // begin inverted section
            regex : "{{\\^",
            next : "mustache_start"
        }, {
            token : "support.function", // end section
            regex : "{{/",
            next : "mustache_start"
        }, {
            token : "support.function", // unescaped variable
            regex : "{{&",
            next : "mustache_start"
        }, {
            token : "support.function", // unescaped variable
            regex : "{{{",
            next : "unescaped_start"
        }, {
            token : "support.function", // variable
            regex : "{{",
            next : "mustache_start"
        }, {
            token : "comment",
            regex : "<\\!--",
            next : "comment"
        }, {
            token : "meta.tag",
            regex : "<(?=\\s*script\\b)",
            next : "script"
        }, {
            token : "meta.tag",
            regex : "<(?=\\s*style\\b)",
            next : "style"
        }, {
            token : "meta.tag",
            regex : "<\\/?",
            next : "tag"
        }, {
            token : "text",
            regex : "\\s+"
        }, {
            token : "text",
            regex : "[^<]+"
        }],

        comment : [{
            token : "comment",
            regex : ".*?-->",
            next : "start"
        }, {
            token : "comment",
            regex : ".+"
        }],

        comment_start : [{
            token : "comment",
            regex : ".*?}}",
            next : "start"
        }, {
            token : "comment",
            regex : ".+"
        }],

        unescaped_start : [{
            token : "support.function",
            regex : "}}}",
            next : "start"
        }, {
            token : "variable.parameter",
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*"
        }],

        mustache_start : [{
            token : "support.function",
            regex : "}}",
            next : "start"
        }, {
            token : "variable.parameter",
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*"
        }]
    };

    xmlUtil.tag(this.$rules, "tag", "start");
    xmlUtil.tag(this.$rules, "style", "css-start");
    xmlUtil.tag(this.$rules, "script", "js-start");

    this.embedRules(JavaScriptHighlightRules, "js-", [{
        token: "comment",
        regex: "\\/\\/.*(?=<\\/script>)",
        next: "tag"
    }, {
        token: "meta.tag",
        regex: "<\\/(?=script)",
        next: "tag"
    }]);

    this.embedRules(CssHighlightRules, "css-", [{
        token: "meta.tag",
        regex: "<\\/(?=style)",
        next: "tag"
    }]);

  };

  oop.inherits(MustacheHighlightRules, TextHighlightRules);

  exports.MustacheHighlightRules = MustacheHighlightRules;
});
