define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var HtmlMode = require("./html").Mode;
var LuaMode = require("./lua").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var LuaPageHighlightRules = require("./luapage_highlight_rules").LuaPageHighlightRules;

var Mode = function() {
    var highlighter = new LuaPageHighlightRules();
    
    this.$tokenizer = new Tokenizer(new LuaPageHighlightRules().getRules());
    this.$embeds = highlighter.getEmbeds();
    this.createModeDelegates({
        "lua-": LuaMode
    });
};
oop.inherits(Mode, HtmlMode);

exports.Mode = Mode;
});