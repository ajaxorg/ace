"use strict";

var oop = require("../lib/oop");
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;
var JavaScriptHighlightRules = require("./javascript_highlight_rules").JavaScriptHighlightRules;

var EjsHighlightRules = function(start, end) {
    HtmlHighlightRules.call(this);
    
    if (!start)
        start = "(?:<%|<\\?|{{)";
    if (!end)
        end = "(?:%>|\\?>|}})";

    for (var i in this.$rules) {
        this.$rules[i].unshift({
            token : "markup.list.meta.tag",
            regex : start + "(?![>}])[-=]?",
            push  : "ejs-start"
        });
    }
    
    this.embedRules(new JavaScriptHighlightRules({jsx: false}).getRules(), "ejs-", [{
        token : "markup.list.meta.tag",
        regex : "-?" + end,
        next  : "pop"
    }, {
        token: "comment",
        regex: "//.*?" + end,
        next: "pop"
    }]);
    
    this.normalizeRules();
};


oop.inherits(EjsHighlightRules, HtmlHighlightRules);

exports.EjsHighlightRules = EjsHighlightRules;


var oop = require("../lib/oop");
var HtmlMode = require("./html").Mode;
var JavaScriptMode = require("./javascript").Mode;
var CssMode = require("./css").Mode;
var RubyMode = require("./ruby").Mode;

var Mode = function() {
    HtmlMode.call(this);
    this.HighlightRules = EjsHighlightRules;    
    this.createModeDelegates({
        "js-": JavaScriptMode,
        "css-": CssMode,
        "ejs-": JavaScriptMode
    });
};
oop.inherits(Mode, HtmlMode);

(function() {

    this.$id = "ace/mode/ejs";
}).call(Mode.prototype);

exports.Mode = Mode;
