"use strict";

var oop = require("../lib/oop");
var HtmlElixirHighlightRules = require("./html_elixir_highlight_rules").HtmlElixirHighlightRules;
var HtmlMode = require("./html").Mode;
var JavaScriptMode = require("./javascript").Mode;
var CssMode = require("./css").Mode;
var ElixirMode = require("./elixir").Mode;

var Mode = function() {
    HtmlMode.call(this);   
    this.HighlightRules = HtmlElixirHighlightRules;
    this.createModeDelegates({
        "js-": JavaScriptMode,
        "css-": CssMode,
        "elixir-": ElixirMode
    });
};
oop.inherits(Mode, HtmlMode);

(function() {

    this.$id = "ace/mode/html_elixir";
}).call(Mode.prototype);

exports.Mode = Mode;
