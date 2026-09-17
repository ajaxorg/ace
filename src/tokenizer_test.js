"use strict";

var Tokenizer = require("./tokenizer").Tokenizer;
var assert = require("./test/assertions");

module.exports = {
    "test: createSplitterRegexp" : function() {
        var t = new Tokenizer({});
        var re = t.createSplitterRegexp("(a)(b)(?=[x)(])");
        assert.equal(re.source, "^(a)(b)$");
        var re = t.createSplitterRegexp("xc(?=([x)(]))");
        assert.equal(re.source, "^xc$");
        var re = t.createSplitterRegexp("(xc(?=([x)(])))");
        assert.equal(re.source, "^(xc)$");
        var re = t.createSplitterRegexp("(?=r)[(?=)](?=([x)(]))");
        assert.equal(re.source, "^(?=r)[(?=)]$");
        var re = t.createSplitterRegexp("(?=r)[(?=)](\\?=t)");
        assert.equal(re.source, "^(?=r)[(?=)](\\?=t)$");
        var re = t.createSplitterRegexp("[(?=)](\\?=t)");
        assert.equal(re.source, "^[(?=)](\\?=t)$");
    },

    "test: createSplitterRegexp removes leading lookbehind" : function() {
        var t = new Tokenizer({});
        var re = t.createSplitterRegexp("(?<=\\s)(a)(b)");
        assert.equal(re.source, "^(a)(b)$");
        var re = t.createSplitterRegexp("((?<=\\s)a)(b)");
        assert.equal(re.source, "^(a)(b)$");
        var re = t.createSplitterRegexp("(?<![x)(])(a)(b)");
        assert.equal(re.source, "^(a)(b)$");
        var re = t.createSplitterRegexp("(?:(?<=(x|\\)))a)(b)");
        assert.equal(re.source, "^(?:a)(b)$");
        var re = t.createSplitterRegexp("(?<=\\s)(?<!x)(a)(b)(?=c)");
        assert.equal(re.source, "^(a)(b)$");
        // a lookbehind after the start has context inside the match
        var re = t.createSplitterRegexp("(a)(?<=a)(b)");
        assert.equal(re.source, "^(a)(?<=a)(b)$");
        // character classes and named groups are not lookbehinds
        var re = t.createSplitterRegexp("[(?<=)](a)");
        assert.equal(re.source, "^[(?<=)](a)$");
        var re = t.createSplitterRegexp("(?<name>a)(b)");
        assert.equal(re.source, "^(?<name>a)(b)$");
    },

    "test: token array with a leading lookbehind" : function() {
        var t = new Tokenizer({
            start: [{
                token: ["option", "lbrk", "content", "rbrk"],
                regex: "(?<=\\s)(\\:[a-zA-Z][a-zA-Z0-9_-]+)([<({]+)([^>)}]+)([>)}]+)"
            }, {
                defaultToken: "text"
            }]
        });
        var line = "=document vvv :one-option<first> :second-option<<<<<second thing>>>>>";
        var tokens = t.getLineTokens(line, "start").tokens;
        assert.deepEqual(tokens, [
            {type: "text", value: "=document vvv "},
            {type: "option", value: ":one-option"},
            {type: "lbrk", value: "<"},
            {type: "content", value: "first"},
            {type: "rbrk", value: ">"},
            {type: "text", value: " "},
            {type: "option", value: ":second-option"},
            {type: "lbrk", value: "<<<<<"},
            {type: "content", value: "second thing"},
            {type: "rbrk", value: ">>>>>"}
        ]);

        // a token function uses the same splitter
        var t = new Tokenizer({
            start: [{
                token: function(option, value) {
                    return ["option", "value"];
                },
                regex: "(?<=\\s)(\\:\\w+)(=\\w+)"
            }, {
                defaultToken: "text"
            }]
        });
        var tokens = t.getLineTokens("x :key=value", "start").tokens;
        assert.deepEqual(tokens, [
            {type: "text", value: "x "},
            {type: "option", value: ":key"},
            {type: "value", value: "=value"}
        ]);
    },

    "test: removeCapturingGroups" : function() {
        var t = new Tokenizer({});
        var re = t.removeCapturingGroups("(ax(by))[()]");
        assert.equal(re, "(?:ax(?:by))[()]");
    },
    
    "test: broken highlight rules": function() {
        var t = new Tokenizer({
            start: [{ 
                token: 's',
                regex: '&&&|^^^' 
            }, {
                defaultToken: "def"
            }],
            state1: [{ 
                token: 'x',
                regex: /\b([\w]*)(\s*)((?::)?)/
            }]
        });
        var errorReports = 0;
        t.reportError = function() { errorReports++; };
        var tokens = t.getLineTokens("x|", "start");
        assert.deepEqual(tokens, {
            tokens: [{value: 'x|', type: 'overflow'}],
            state: 'start'
        });
        var tokens = t.getLineTokens("x|", "state1");
        assert.deepEqual(tokens, {
            tokens: [{value: 'x', type: 'x'}, {value: '|', type: 'overflow'}],
            state: 'start'
        });
        assert.equal(errorReports, 2);
    } 
};


require("./test/run")(module);