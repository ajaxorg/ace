/*
 LatexParser unit tests

 run with node:
 ```
    node latex_parser_test.js
 ```

 @author: alexandr.gudulin@gmail.com
*/

if (typeof process !== "undefined") {
    require("amd-loader");
}

define(function(require, exports, module) {
"use strict";

var assert = require("../test/assertions");

var Document = require("../document").Document;
var LatexParser = require("./latex_parser").LatexParser;
var Tokenizer = require("../tokenizer").Tokenizer;
var BackgroundTokenizer = require("../background_tokenizer").BackgroundTokenizer;
var LatexHighlightRules = require("./latex_highlight_rules").LatexHighlightRules;
var highlighter = new LatexHighlightRules();
var myBgTokenizer = new BackgroundTokenizer(new Tokenizer(highlighter.getRules()));

function createParser(doc) {
    myBgTokenizer.setDocument(doc);
    myBgTokenizer.start(0);
    return new LatexParser(myBgTokenizer);
}

module.exports = {

    name: "Papeeria::LatexParser",

    "test: empty document": function() {
        var doc = new Document([]);
        var parser = createParser(doc);
        parser.go(doc, false, true);
        var discussions = parser.getDiscussions();

        assert.equal(discussions.length, 0);
    },

    "test: one discussion": function() {
        var doc = new Document([
            "context line",
            "% * <foo@gmail.com> dt1:",
            "% foo comment"
        ]);
        var parser = createParser(doc);
        parser.go(doc, false, true);
        var discussions = parser.getDiscussions();

        assert.equal(discussions.length, 1);

        var discussion = discussions[0];
        assert.equal(discussion.type, '*');
        assert.equal(discussion.author, 'foo@gmail.com');
        assert.equal(discussion.datetime, 'dt1');
        assert.equal(JSON.stringify(discussion.text), JSON.stringify(['foo comment']));
        assert.equal(discussion.replies.length, 0);
    },

    "test: one discussion with reply": function() {
        var doc = new Document([
            "context line",
            "% * <foo@gmail.com> dt1:",
            "% foo comment",
            "% ^ <bar@gmail.com> dt2:",
            "% bar reply"
        ]);
        var parser = createParser(doc);
        parser.go(doc, false, true);
        var discussions = parser.getDiscussions();

        assert.equal(discussions.length, 1);

        var discussion = discussions[0];
        assert.equal(discussion.replies.length, 1);

        var reply = discussion.replies[0];
        assert.equal(reply.type, '^');
        assert.equal(reply.author, 'bar@gmail.com');
        assert.equal(reply.datetime, 'dt2');
        assert.equal(JSON.stringify(reply.text), JSON.stringify(['bar reply']));
    },
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec()
}
