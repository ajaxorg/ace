if (typeof process !== "undefined") {
    require("amd-loader");
}

"use strict";

var EditSession = require("./edit_session").EditSession;
var JavaScriptMode = require("./mode/javascript").Mode;
var LuaMode = require("./mode/lua").Mode;
var Range = require("./range").Range;
var assert = require("./test/assertions");

function forceTokenize(session, startLine) {
    for (var i = startLine || 0, l = session.getLength(); i < l; i++)
        session.getTokens(i);
}

function testStates(session, states) {
    for (var i = 0, l = session.getLength(); i < l; i++)
        assert.equal(session.bgTokenizer.states[i], states[i]);
    assert.ok(l == states.length);
}

module.exports = {

    "test background tokenizer update on session change" : function() {
        var doc = new EditSession([
            "/*",
            "*/",
            "var juhu"
        ]);
        doc.setMode("./mode/javascript");  
        
        forceTokenize(doc);
        testStates(doc, ["comment1", "start", "no_regex"]);
        
        doc.remove(new Range(0,2,1,2));
        testStates(doc, [null, "no_regex"]);
        
        forceTokenize(doc);
        testStates(doc, ["comment1", "comment1"]);
        
        doc.insert({row:0, column:2}, "\n*/");
        testStates(doc, [undefined, undefined, "comment1"]);
        
        forceTokenize(doc);
        testStates(doc, ["comment1", "start", "no_regex"]);
    },
    "test background tokenizer sends update event" : function() {
        var doc = new EditSession([
            "/*",
            "var",
            "juhu",
            "*/"
        ]);
        doc.setMode("./mode/javascript");
        
        var updateEvent = null;
        doc.bgTokenizer.on("update", function(e) {
            updateEvent = e.data;
        });
        function checkEvent(first, last) {
            assert.ok(!updateEvent, "unneccessary update event");
            doc.bgTokenizer.running = 1;
            doc.bgTokenizer.$worker();
            assert.ok(updateEvent);
            assert.equal([first, last] + "", 
                [updateEvent.first, updateEvent.last] + "");
            updateEvent = null;
        }
        
        forceTokenize(doc);
        var comment = "comment1";
        testStates(doc, [comment, comment, comment, "start"]);
        
        doc.remove(new Range(0,0,0,2));
        testStates(doc, [comment, comment, comment, "start"]);
        
        checkEvent(0, 3);
        testStates(doc, ["start", "no_regex", "no_regex", "regex"]);
        
        // insert /* and and press down several times quickly
        doc.insert({row:0, column:0}, "/*");
        doc.getTokens(0);
        doc.getTokens(1);
        doc.getTokens(2);
        checkEvent(0, 3);
        
        forceTokenize(doc);
        testStates(doc, [comment, comment, comment, "start"]);
    },
    "test background tokenizer sends update event 2" : function(next) {
        var doc = new EditSession([
            "-[[",
            "juhu",
            "kinners]]--",
            ""
        ]);
        doc.setMode("./mode/lua");
        forceTokenize(doc);
        var string = "bracketedString,2,start";
        var comment = "bracketedComment,2,start";
        testStates(doc, [string, string, "start", "start"]);
        
        doc.insert({row:0, column:0}, "-");
        forceTokenize(doc);
        doc.bgTokenizer.once("update", function(e) {
            assert.equal([0, 4] + "", [e.data.first, e.data.last] + "");
            testStates(doc, [comment, comment, "start", "start"]);
            next();
        });
        doc.bgTokenizer.running = 1;
        doc.bgTokenizer.$worker();
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
