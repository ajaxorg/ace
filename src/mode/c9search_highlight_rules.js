"use strict";

var oop = require("../lib/oop");
var lang = require("../lib/lang");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

function safeCreateRegexp(source, flag) {
    try {
        return new RegExp(source, flag);
    } catch(e) {}
}

var C9SearchHighlightRules = function() {

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used
    this.$rules = {
        "start" : [
            {
                tokenNames : ["c9searchresults.constant.numeric", "c9searchresults.text", "c9searchresults.text", "c9searchresults.keyword"],
                regex : /(^\s+[0-9]+)(:)(\d*\s?)([^\r\n]+)/,
                onMatch : function(val, state, stack) {
                    var values = this.splitRegex.exec(val);
                    var types = this.tokenNames;
                    var tokens = [{
                        type: types[0],
                        value: values[1]
                    }, {
                        type: types[1],
                        value: values[2]
                    }];
                    
                    if (values[3]) {
                        if (values[3] == " ")
                            tokens[1] = { type: types[1], value: values[2] + " " };
                        else
                            tokens.push({ type: types[1], value: values[3] });
                    }
                    var regex = stack[1];
                    var str = values[4];
                    
                    var m;
                    var last = 0;
                    if (regex && regex.exec) {
                        regex.lastIndex = 0;
                        while (m = regex.exec(str)) {
                            var skipped = str.substring(last, m.index);
                            last = regex.lastIndex;
                            if (skipped)
                                tokens.push({type: types[2], value: skipped});
                            if (m[0])
                                tokens.push({type: types[3], value: m[0]});
                            else if (!skipped)
                                break;
                        }
                    }
                    if (last < str.length)
                        tokens.push({type: types[2], value: str.substr(last)});
                    return tokens;
                }
            },
            {
                regex : "^Searching for [^\\r\\n]*$",
                onMatch: function(val, state, stack) {
                    var parts = val.split("\x01");
                    if (parts.length < 3)
                        return "text";

                    var options, search;
                    
                    var i = 0;
                    var tokens = [{
                        value: parts[i++] + "'",
                        type: "text"
                    }, {
                        value: search = parts[i++],
                        type: "text" // "c9searchresults.keyword"
                    }, {
                        value: "'" + parts[i++],
                        type: "text"
                    }];
                    
                    // replaced
                    if (parts[2] !== " in") {
                        tokens.push({
                            value: "'" + parts[i++] + "'",
                            type: "text"
                        }, {
                            value: parts[i++],
                            type: "text"
                        });
                    }
                    // path
                    tokens.push({
                        value: " " + parts[i++] + " ",
                        type: "text"
                    });
                    // options
                    if (parts[i+1]) {
                        options = parts[i+1];
                        tokens.push({
                            value: "(" + parts[i+1] + ")",
                            type: "text"
                        });
                        i += 1;
                    } else {
                        i -= 1;
                    }
                    while (i++ < parts.length) {
                        parts[i] && tokens.push({
                            value: parts[i],
                            type: "text"
                        });
                    }
                    
                    if (search) {
                        if (!/regex/.test(options))
                            search = lang.escapeRegExp(search);
                        if (/whole/.test(options))
                            search = "\\b" + search + "\\b";
                    }
                    
                    var regex = search && safeCreateRegexp(
                        "(" + search + ")",
                        / sensitive/.test(options) ? "g" : "ig"
                    );
                    if (regex) {
                        stack[0] = state;
                        stack[1] = regex;
                    }
                    
                    return tokens;
                }
            },
            {
                regex : "^(?=Found \\d+ matches)",
                token : "text",
                next : "numbers"
            },
            {
                token : "string", // single line
                regex : "^\\S:?[^:]+",
                next : "numbers"
            }
        ],
        numbers:[{
            regex : "\\d+",
            token : "constant.numeric"
        }, {
            regex : "$",
            token : "text",
            next : "start"
        }]
    };
    this.normalizeRules();
};

oop.inherits(C9SearchHighlightRules, TextHighlightRules);

exports.C9SearchHighlightRules = C9SearchHighlightRules;
