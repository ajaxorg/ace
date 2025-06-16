"use strict";

var EditSession = require("../edit_session").EditSession;
var Tokenizer = require("../tokenizer").Tokenizer;
var JavaScriptMode = require("./javascript").Mode;
var assert = require("../test/assertions");

module.exports = {
    setUp : function() {    
        this.mode = new JavaScriptMode();
    },

    "test: getTokenizer() (smoke test)" : function() {
        var tokenizer = this.mode.getTokenizer();

        assert.ok(tokenizer instanceof Tokenizer);

        var tokens = tokenizer.getLineTokens("'juhu'", "start").tokens;
        assert.equal("string", tokens[0].type);
    },

    "test: toggle comment lines should prepend '//' to each line" : function() {
        var session = new EditSession(["  abc", "cde", "fg"]);
        session.setTabSize(1);

        this.mode.toggleCommentLines("start", session, 0, 1);
        assert.equal(["//   abc", "// cde", "fg"].join("\n"), session.toString());
    },

    "test: toggle comment on commented lines should remove leading '//' chars" : function() {
        var session = new EditSession(["//  abc", "//cde", "fg"]);
        session.setTabSize(1);

        this.mode.toggleCommentLines("start", session, 0, 1);
        assert.equal([" abc", "cde", "fg"].join("\n"), session.toString());
    },
    
    "test: toggle comment on all empty lines" : function() {
        var session = new EditSession(["  ", " ", "  "]);
        session.setTabSize(1);

        this.mode.toggleCommentLines("start", session, 0, 1);
        assert.equal([" //  ", " // ", "  "].join("\n"), session.toString());
    },
    
    "test: toggle comment with empty lines" : function() {
        var session = new EditSession([
            "        abc",
            "",
            "    cde", 
            "    fg"]);
        
        var initial = session.toString();
        this.mode.toggleCommentLines("start", session, 0, 3);
        assert.equal([
            "    //     abc",
            "",
            "    // cde", 
            "    // fg"].join("\n"),
            session.toString()
        );
        this.mode.toggleCommentLines("start", session, 0, 3);
        assert.equal(initial, session.toString());
    },

    "test: toggle comment lines twice should return the original text" : function() {
        var session = new EditSession(["  abc", "cde", "fg"]);

        this.mode.toggleCommentLines("start", session, 0, 2);
        this.mode.toggleCommentLines("start", session, 0, 2);
        assert.equal(["  abc", "cde", "fg"].join("\n"), session.toString());
    },

    "test: toggle comment on multiple lines with one commented line prepend '//' to each line" : function() {
        var session = new EditSession(["  //  abc", "  //cde", "    fg"]);
        session.setTabSize(1);
        this.mode.toggleCommentLines("start", session, 0, 2);
        assert.equal(["  // //  abc", "  // //cde", "  //   fg"].join("\n"), session.toString());
    },

    "test: toggle comment on a comment line with leading white space": function() {
        var session = new EditSession(["//cde", "  //fg"]);

        this.mode.toggleCommentLines("start", session, 0, 1);
        assert.equal(["cde", "  fg"].join("\n"), session.toString());
    },

    "test: toggle comment lines should take tabsize into account" : function() {
        var session = new EditSession(["  //  abc", "  // cde", "//    fg"]);
        session.setTabSize(2);
        this.mode.toggleCommentLines("start", session, 0, 2);
        assert.equal(["    abc", "  cde", "    fg"].join("\n"), session.toString());
        session.setTabSize(4);
        this.mode.toggleCommentLines("start", session, 0, 2);
        assert.equal(["//     abc", "//   cde", "//     fg"].join("\n"), session.toString());
        this.mode.toggleCommentLines("start", session, 0, 2);
        assert.equal(["    abc", "  cde", "    fg"].join("\n"), session.toString());
        
        session.insert({row: 0, column: 0}, " ");
        this.mode.toggleCommentLines("start", session, 0, 2);
        assert.equal(["//      abc", "//   cde", "//     fg"].join("\n"), session.toString());        
    },
    //there doesn't seem to be any way to make this work
    "!test: togglecomment on line with one space" : function() {
        var session = new EditSession([" abc", "  // cde", "//    fg"]);
        var initialValue = session + "";
        session.setTabSize(4);
        this.mode.toggleCommentLines("start", session, 0, 0);
        this.mode.toggleCommentLines("start", session, 0, 0);
        assert.equal(initialValue, session.toString());
    },

    "test: auto indent after opening brace" : function() {
        assert.equal("  ", this.mode.getNextLineIndent("start", "if () {", "  "));
    },
    
    "test: auto indent after case" : function() {
        assert.equal("  ", this.mode.getNextLineIndent("start", "case 'juhu':", "  "));
    },

    "test: no auto indent in object literal" : function() {
        assert.equal("", this.mode.getNextLineIndent("start", "{ 'juhu':", "  "));
    },

    "test: no auto indent after opening brace in multi line comment" : function() {
        assert.equal("", this.mode.getNextLineIndent("start", "/*if () {", "  "));
        assert.equal("  ", this.mode.getNextLineIndent("comment", "  abcd", "  "));
    },

    "test: no auto indent after opening brace in single line comment" : function() {
        assert.equal("", this.mode.getNextLineIndent("start", "//if () {", "  "));
        assert.equal("  ", this.mode.getNextLineIndent("start", "  //if () {", "  "));
    },

    "test: no auto indent should add to existing indent" : function() {
        assert.equal("      ", this.mode.getNextLineIndent("start", "    if () {", "  "));
        assert.equal("    ", this.mode.getNextLineIndent("start", "    cde", "  "));
        assert.equal("    ", this.mode.getNextLineIndent("start", "function foo(items) {", "    "));
    },
    
    "test: no indent after doc comments" : function() {
        assert.equal("", this.mode.getNextLineIndent("doc-start", "   */", "  "));
    },

    "test: trigger outdent if line is space and new text starts with closing brace" : function() {
        assert.ok(this.mode.checkOutdent("start", "   ", " }"));
        assert.ok(!this.mode.checkOutdent("start", " a  ", " }"));
        assert.ok(!this.mode.checkOutdent("start", "", "}"));
        assert.ok(!this.mode.checkOutdent("start", "   ", "a }"));
        assert.ok(!this.mode.checkOutdent("start", "   }", "}"));
    },

    "test: auto outdent should indent the line with the same indent as the line with the matching opening brace" : function() {
        var session = new EditSession(["  function foo() {", "    bla", "    }"], new JavaScriptMode());
        this.mode.autoOutdent("start", session, 2);
        assert.equal("  }", session.getLine(2));
    },

    "test: no auto outdent if no matching brace is found" : function() {
        var session = new EditSession(["  function foo()", "    bla", "    }"]);
        this.mode.autoOutdent("start", session, 2);
        assert.equal("    }", session.getLine(2));
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
