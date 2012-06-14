define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;
var LuaHighlightRules = require("./lua_highlight_rules").LuaHighlightRules;

var LuaPageHighlightRules = function() {
    this.$rules = new HtmlHighlightRules().getRules();
    
    for (var i in this.$rules){ // Thanks to Harutyun Amirjanyan for this fix.
        this.$rules[i].unshift({
            token: "keyword",
            regex: "<\\%\\=?",
            next: "lua-start"
        }, {
            token: "keyword",
            regex: "<\\?lua\\=?",
            next: "lua-start"
        });
    }
    this.embedRules(LuaHighlightRules, "lua-", [
		{
			token: "keyword",
			regex: "\\%>",
			next: "start"
		},
		{
			token: "keyword",
			regex: "\\?>",
			next: "start"
		}
	]);
};

oop.inherits(LuaPageHighlightRules, HtmlHighlightRules);

exports.LuaPageHighlightRules = LuaPageHighlightRules;

});