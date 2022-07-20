if (typeof process !== "undefined") {
    require("amd-loader");
 }

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


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
