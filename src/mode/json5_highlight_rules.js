"use strict";

var oop = require("../lib/oop");
var JsonHighlightRules = require("./json_highlight_rules").JsonHighlightRules;

var Json5HighlightRules = function() {
    JsonHighlightRules.call(this);

    var startRules = [{
        token : "variable",
        regex : /[a-zA-Z$_\u00a1-\uffff][\w$\u00a1-\uffff]*\s*(?=:)/
    }, {
        token : "variable",
        regex : /['](?:(?:\\.)|(?:[^'\\]))*?[']\s*(?=:)/
    }, {
        token : "constant.language.boolean",
        regex : /(?:null)\b/
    }, {
        token : "string",
        regex : /'/,
        next  : [{
            token : "constant.language.escape",
            regex : /\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|["\/bfnrt]|$)/,
            consumeLineEnd  : true
        }, {
            token : "string",
            regex : /'|$/,
            next  : "start"
        }, {
            defaultToken : "string"
        }]
    }, {
        token : "string",
        regex : /"(?![^"]*":)/,
        next  : [{
            token : "constant.language.escape",
            regex : /\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|["\/bfnrt]|$)/,
            consumeLineEnd  : true
        }, {
            token : "string",
            regex : /"|$/,
            next  : "start"
        }, {
            defaultToken : "string"
        }]
    }, {
        token : "constant.numeric",
        regex : /[+-]?(?:Infinity|NaN)\b/
    }];

    for (var key in this.$rules)
        this.$rules[key].unshift.apply(this.$rules[key], startRules);

    this.normalizeRules();
};

oop.inherits(Json5HighlightRules, JsonHighlightRules);

exports.Json5HighlightRules = Json5HighlightRules;
