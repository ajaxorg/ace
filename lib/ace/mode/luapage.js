define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var HtmlMode = require("./html").Mode;
var LuaMode = require("./lua").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var LuaPageHighlightRules = require("./luapage_highlight_rules").LuaPageHighlightRules;

var Mode = function() {
    this.HighlightRules = LuaPageHighlightRules;
    
    this.HighlightRules = LuaPageHighlightRules;
    this.createModeDelegates({
        "lua-": LuaMode
    });
};
oop.inherits(Mode, HtmlMode);

exports.Mode = Mode;
});