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

    "test: caseInsensitive: false keeps a rule case-sensitive in a case-insensitive state" : function() {
        var t = new Tokenizer({
            start: [{
                token: "keyword",
                regex: /FOO/,
                caseInsensitive: false
            }, {
                token: "keyword",
                regex: /BAR/,
                caseInsensitive: true
            }, {
                token: ["kw", "text", "name"],
                regex: /(SET)(\s+)([a-z]+)/
            }, {
                defaultToken: "text"
            }]
        });
        var tokens = t.getLineTokens("foo FOO bar BAR set X", "start").tokens;
        assert.deepEqual(tokens, [
            {type: "text", value: "foo "},
            {type: "keyword", value: "FOO"},
            {type: "text", value: " "},
            {type: "keyword", value: "bar"},
            {type: "text", value: " "},
            {type: "keyword", value: "BAR"},
            {type: "text", value: " "},
            {type: "kw", value: "set"},
            {type: "text", value: " "},
            {type: "name", value: "X"}
        ]);
    },

    "test: caseInsensitive on one rule still applies to the rules without the option" : function() {
        var t = new Tokenizer({
            start: [{
                token: "keyword",
                regex: /FOO/
            }, {
                token: "keyword",
                regex: /BAR/,
                caseInsensitive: true
            }, {
                defaultToken: "text"
            }]
        });
        var tokens = t.getLineTokens("foo bar", "start").tokens;
        assert.deepEqual(tokens, [
            {type: "keyword", value: "foo"},
            {type: "text", value: " "},
            {type: "keyword", value: "bar"}
        ]);
    },

    "test: caseInsensitiveRegex" : function() {
        var t = new Tokenizer({});
        assert.equal(t.caseInsensitiveRegex("ab1"), "[aA][bB]1");
        // escapes and group syntax are left alone
        assert.equal(t.caseInsensitiveRegex("\\bx\\w+\\x4a\\u004a\\cJ\\1"), "\\b[xX]\\w+\\x4a\\u004a\\cJ\\1");
        assert.equal(t.caseInsensitiveRegex("(?:a)(?=b)(?!c)(?<=d)(?<!e)(?<name>f)\\k<name>"),
            "(?:[aA])(?=[bB])(?![cC])(?<=[dD])(?<![eE])(?<name>[fF])\\k<name>");
        assert.equal(t.caseInsensitiveRegex("\\p{Lu}\\u{61}x", true), "\\p{Lu}\\u{61}[xX]");
        // character classes get the other case of their letters and letter ranges
        assert.equal(t.caseInsensitiveRegex("[a-f0-9_]"), "[A-Fa-f0-9_]");
        assert.equal(t.caseInsensitiveRegex("[^xY\\]]"), "[^XyxY\\]]");
        assert.equal(t.caseInsensitiveRegex("[-a]"), "[-aA]");
        assert.equal(t.caseInsensitiveRegex("[a-]"), "[Aa-]");
        assert.equal(t.caseInsensitiveRegex("[X-c]"), "[x-zA-CX-c]");
        assert.equal(t.caseInsensitiveRegex("[-a-]"), "(?:[-a-]|[A])");
        assert.equal(t.caseInsensitiveRegex("[^-a-]"), "(?:(?![A])[^-a-])");
        assert.equal(t.caseInsensitiveRegex("[\\x41-\\x43]"), "[\\x41-\\x43]");

        var re = new RegExp("^(?:" + t.caseInsensitiveRegex("[X-c]+") + ")$");
        assert.ok(re.test("XYZ[\\]^_`abcxyzABC"));
        assert.notOk(re.test("d"));
        re = new RegExp("^(?:" + t.caseInsensitiveRegex("[^a-c]+") + ")$");
        assert.ok(re.test("dD-"));
        assert.notOk(re.test("dB"));
        re = new RegExp("^(?:" + t.caseInsensitiveRegex("[^-a-]+") + ")$");
        assert.ok(re.test("bB"));
        assert.notOk(re.test("bA"));
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