// LuaPage implements the LuaPage markup as described by the Kepler Project's CGILua
// documentation: http://keplerproject.github.com/cgilua/manual.html#templates
define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;
var LuaHighlightRules = require("./lua_highlight_rules").LuaHighlightRules;

var LuaPageHighlightRules = function() {
    this.$rules = new HtmlHighlightRules().getRules();
    
    for (var i in this.$rules) {
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