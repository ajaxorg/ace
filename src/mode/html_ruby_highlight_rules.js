"use strict";

    var oop = require("../lib/oop");
    var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;
    var RubyHighlightRules = require("./ruby_highlight_rules").RubyHighlightRules;

    var HtmlRubyHighlightRules = function() {
        HtmlHighlightRules.call(this);

        var startRules = [
            {
                regex: "<%%|%%>",
                token: "constant.language.escape"
            }, {
                token : "comment.start.erb",
                regex : "<%#",
                push  : [{
                    token : "comment.end.erb",
                    regex: "%>",
                    next: "pop",
                    defaultToken:"comment"
                }]
            }, {
                token : "support.ruby_tag",
                regex : "<%+(?!>)[-=]?",
                push  : "ruby-start"
            }
        ];

        var endRules = [
            {
                token : "support.ruby_tag",
                regex : "%>",
                next  : "pop"
            }, {
                token: "comment",
                regex: "#(?:[^%]|%[^>])*"
            }
        ];

        for (var key in this.$rules)
            this.$rules[key].unshift.apply(this.$rules[key], startRules);

        this.embedRules(RubyHighlightRules, "ruby-", endRules, ["start"]);

        this.normalizeRules();
    };


    oop.inherits(HtmlRubyHighlightRules, HtmlHighlightRules);

    exports.HtmlRubyHighlightRules = HtmlRubyHighlightRules;
