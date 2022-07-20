"use strict";

var oop = require("../lib/oop");
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;


var CurlyHighlightRules = function() {
    HtmlHighlightRules.call(this);

    this.$rules["start"].unshift({
        token: "variable",
        regex: "{{",
        push: "curly-start"
    });

    this.$rules["curly-start"] = [{
        token: "variable",
        regex: "}}",
        next: "pop"
    }];

    this.normalizeRules();
};

oop.inherits(CurlyHighlightRules, HtmlHighlightRules);

exports.CurlyHighlightRules = CurlyHighlightRules;
