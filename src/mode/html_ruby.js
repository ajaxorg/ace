"use strict";

var oop = require("../lib/oop");
var HtmlRubyHighlightRules = require("./html_ruby_highlight_rules").HtmlRubyHighlightRules;
var HtmlMode = require("./html").Mode;
var JavaScriptMode = require("./javascript").Mode;
var CssMode = require("./css").Mode;
var RubyMode = require("./ruby").Mode;

var Mode = function() {
    HtmlMode.call(this);   
    this.HighlightRules = HtmlRubyHighlightRules;    
    this.createModeDelegates({
        "js-": JavaScriptMode,
        "css-": CssMode,
        "ruby-": RubyMode
    });
};
oop.inherits(Mode, HtmlMode);

(function() {

    this.$id = "ace/mode/html_ruby";
}).call(Mode.prototype);

exports.Mode = Mode;
