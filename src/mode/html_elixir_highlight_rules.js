"use strict";

    var oop = require("../lib/oop");
    var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;
    var ElixirHighlightRules = require("./elixir_highlight_rules").ElixirHighlightRules;

    var HtmlElixirHighlightRules = function() {
        HtmlHighlightRules.call(this);

        var startRules = [
            {
                regex: "<%%|%%>",
                token: "constant.language.escape"
            }, {
                token : "comment.start.eex",
                regex : "<%#",
                push  : [{
                    token : "comment.end.eex",
                    regex: "%>",
                    next: "pop",
                    defaultToken:"comment"
                }]
            }, {
                token : "support.elixir_tag",
                regex : "<%+(?!>)[-=]?",
                push  : "elixir-start"
            }
        ];

        var endRules = [
            {
                token : "support.elixir_tag",
                regex : "%>",
                next  : "pop"
            }, {
                token: "comment",
                regex: "#(?:[^%]|%[^>])*"
            }
        ];

        for (var key in this.$rules)
            this.$rules[key].unshift.apply(this.$rules[key], startRules);

        this.embedRules(ElixirHighlightRules, "elixir-", endRules, ["start"]);

        this.normalizeRules();
    };


    oop.inherits(HtmlElixirHighlightRules, HtmlHighlightRules);

    exports.HtmlElixirHighlightRules = HtmlElixirHighlightRules;
