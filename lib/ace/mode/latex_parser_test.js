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

function getDiscussions(doc) {
    myBgTokenizer.setDocument(doc);
    myBgTokenizer.start(0);
    var parser = new LatexParser(myBgTokenizer);

    parser.go(doc, false, true);
    return parser.getDiscussions();
}

module.exports = {

    name: "Papeeria::LatexParser",

    "test: empty document": function() {
        var doc = new Document([]);
        var discussions = getDiscussions(doc);

        assert.equal(discussions.length, 0);
    },

    "test: one discussion": function() {
        var doc = new Document([
            "context line",
            "% * <foo@gmail.com> dt1:",
            "% foo comment"
        ]);
        var discussions = getDiscussions(doc);

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
        var discussions = getDiscussions(doc);

        assert.equal(discussions.length, 1);

        var discussion = discussions[0];
        assert.equal(discussion.replies.length, 1);

        var reply = discussion.replies[0];
        assert.equal(reply.type, '^');
        assert.equal(reply.author, 'bar@gmail.com');
        assert.equal(reply.datetime, 'dt2');
        assert.equal(JSON.stringify(reply.text), JSON.stringify(['bar reply']));
    },

    "test: one discussion with multiple replies": function() {
        var doc = new Document([
            "context line",
            "% * <foo@gmail.com> dt1:",
            "% foo comment",
            "% ^ <bar2@gmail.com> dt2:",
            "% bar2 reply",
            "% ^ <bar3@gmail.com> dt3:",
            "% bar3 reply",
            "% ^ <bar4@gmail.com> dt4:",
            "% bar4 reply"
        ]);
        var discussions = getDiscussions(doc);

        assert.equal(discussions.length, 1);

        var discussion = discussions[0];
        assert.equal(discussion.replies.length, 3);

        var reply = discussion.replies[1];
        assert.equal(reply.type, '^');
        assert.equal(reply.author, 'bar3@gmail.com');
        assert.equal(reply.datetime, 'dt3');
        assert.equal(JSON.stringify(reply.text), JSON.stringify(['bar3 reply']));
    },

    "test: multiple discussions": function() {
        var doc = new Document([
            "context line",
            "% * <foo@gmail.com> dt1:",
            "% foo comment",
            "context line",
            "% * <bar@gmail.com> dt2:",
            "% bar comment"
        ]);
        var discussions = getDiscussions(doc);

        assert.equal(discussions.length, 2);

        var discussion1 = discussions[0];
        assert.equal(discussion1.author, 'foo@gmail.com');
        assert.equal(JSON.stringify(discussion1.text), JSON.stringify(['foo comment']));

        var discussion2 = discussions[1];
        assert.equal(discussion2.author, 'bar@gmail.com');
        assert.equal(JSON.stringify(discussion2.text), JSON.stringify(['bar comment']));
    },

    "test: discussion starts on the context line": function() {
        var doc = new Document([
            "context line % * <foo@gmail.com> dt1:",
            "% foo comment"
        ]);
        var discussions = getDiscussions(doc);

        assert.equal(discussions.length, 0);
    },

    "test: correct discussion heading format": function() {
        var doc = new Document([
            "no colon after datetime:",
            "% * <foo@gmail.com> dt1",
            "% foo comment",

            "unknown discussion type:",
            "% x <foo@gmail.com> dt1:",
            "% foo comment",

            "author name/email isn't inside angle brackets:",
            "% * foo@gmail.com dt1:",
            "% foo comment"
        ]);
        var discussions = getDiscussions(doc);

        assert.equal(discussions.length, 0);
    },

    "test: reply to nothing": function() {
        var doc = new Document([
            "% ^ <foo@gmail.com> dt1:",
            "% foo reply to nothing"
        ]);
        var discussions = getDiscussions(doc);

        assert.equal(discussions.length, 0);
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
