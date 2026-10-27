"use strict";

var EditSession = require("../edit_session").EditSession;
var VerseMode = require("./verse").Mode;
var assert = require("../test/assertions");

function tokenize(tokenizer, lines) {
    var state = "start";
    return lines.map(function(line) {
        var data = tokenizer.getLineTokens(line, state);
        state = data.state;
        return data;
    });
}

function types(data) {
    return data.tokens.map(function(token) {
        return token.type;
    });
}

module.exports = {
    setUp : function() {
        this.mode = new VerseMode();
    },

    "test: block comments nest" : function() {
        var data = tokenize(this.mode.getTokenizer(), ["<# a <# b #> c #> X := 1"]);
        assert.equal(data[0].tokens[0].value, "<# a <# b #> c #>");
        assert.equal(data[0].tokens[0].type, "comment.block");
        assert.equal(data[0].tokens[2].type, "identifier");
        assert.equal(data[0].state, "start");
    },

    "test: indented comment covers the lines indented below it" : function() {
        var data = tokenize(this.mode.getTokenizer(), [
            "<#>",
            "    Everything indented here",
            "        is part of the comment.",
            "",
            "X := 1"
        ]);
        assert.deepEqual(types(data[1]), ["comment.block"]);
        assert.deepEqual(types(data[2]), ["comment.block"]);
        assert.equal(data[4].tokens[0].type, "identifier");
        assert.equal(data[4].state, "start");
    },

    "test: indented comment ends at a line with the same indentation" : function() {
        var data = tokenize(this.mode.getTokenizer(), [
            "Main():void =",
            "    <#>",
            "        Not compiled.",
            "    Print(\"compiled\")"
        ]);
        assert.deepEqual(types(data[2]), ["comment.block"]);
        assert.deepEqual(types(data[3]), ["text", "entity.name.function", "paren.lparen", "string", "paren.rparen"]);
        assert.equal(data[3].state, "start");
    },

    "test: string interpolation may span lines" : function() {
        var data = tokenize(this.mode.getTokenizer(), [
            "LongMessage := \"This is a multi-line {",
            "}string that continues across {",
            "    # This comment is ignored",
            "}multiple lines.\""
        ]);
        assert.equal(data[0].tokens[5].type, "paren.quasi.start");
        assert.equal(data[1].tokens[0].type, "paren.quasi.end");
        assert.deepEqual(types(data[2]), ["text", "comment.line"]);
        assert.deepEqual(types(data[3]), ["paren.quasi.end", "string"]);
        assert.equal(data[3].state, "start");
    },

    "test: braces and strings nest inside an interpolation" : function() {
        var line = "Label := \"{array{1, 2}.Length <# items #>} {\"{Name}!\"}\"";
        var data = tokenize(this.mode.getTokenizer(), [line]);
        assert.ok(data[0].tokens.some(function(token) {
            return token.type == "comment.block" && token.value == "<# items #>";
        }));
        var braces = data[0].tokens.filter(function(token) {
            return /paren/.test(token.type) && /[{}]/.test(token.value);
        }).map(function(token) {
            return token.type + " " + token.value;
        });
        assert.deepEqual(braces, [
            "paren.quasi.start {", "paren.lparen {", "paren.rparen }", "paren.quasi.end }",
            "paren.quasi.start {", "paren.quasi.start {", "paren.quasi.end }", "paren.quasi.end }"
        ]);
        assert.equal(data[0].state, "start");
    },

    "test: escapes and comments inside strings" : function() {
        var data = tokenize(this.mode.getTokenizer(), ["Text := \"a<#hidden#>b \\{x\\} \\<# kept\""]);
        assert.deepEqual(types(data[0]).slice(4), [
            "string", "comment.block", "string", "constant.language.escape", "string",
            "constant.language.escape", "string", "constant.language.escape", "string"
        ]);
        assert.equal(data[0].state, "start");
    },

    "test: char literals and code points" : function() {
        var line = "Literals := ('a', '\\'', '😀', 0o61, 0u1F600, 0x1F, 2.5e+3, 12.34f64)";
        var tokens = tokenize(this.mode.getTokenizer(), [line])[0].tokens;
        var values = tokens.filter(function(token) {
            return /string|escape|numeric/.test(token.type);
        }).map(function(token) {
            return token.type + " " + token.value;
        });
        assert.deepEqual(values, [
            "string 'a'", "string '", "constant.language.escape \\'", "string '", "string '😀'",
            "string 0o61", "string 0u1F600", "constant.numeric 0x1F", "constant.numeric 2.5e+3",
            "constant.numeric 12.34f64"
        ]);
    },

    "test: specifiers, attributes and qualifiers" : function() {
        var tokenizer = this.mode.getTokenizer();
        var data = tokenize(tokenizer, ["Spend<public>(Amount:int)<transacts><decides>:void ="]);
        assert.deepEqual(types(data[0]).slice(0, 2), ["entity.name.function", "storage.modifier"]);
        assert.equal(data[0].tokens[7].value, "<transacts><decides>");
        assert.equal(tokenize(tokenizer, ["@editable"])[0].tokens[0].type, "storage.type.annotation");
        assert.equal(tokenize(tokenizer, ["(super:)Describe()"])[0].tokens[0].type, "variable.language");
        assert.deepEqual(types(tokenize(tokenizer, ["using { /Verse.org/Simulation }"])[0]), [
            "keyword", "text", "paren.lparen", "text", "constant.language.path", "text", "paren.rparen"
        ]);
    },

    "test: keywords are not highlighted as function names" : function() {
        var data = tokenize(this.mode.getTokenizer(), ["if (not Ready?) { Print(\"wait\") }"]);
        assert.equal(data[0].tokens[0].type, "keyword.control");
        assert.equal(data[0].tokens[3].type, "keyword.operator");
        assert.equal(data[0].tokens[11].type, "entity.name.function");
    },

    "test: indent after a colon, an equals sign or an open bracket" : function() {
        assert.equal(this.mode.getNextLineIndent("start", "    if (Ready?):", "    "), "        ");
        assert.equal(this.mode.getNextLineIndent("start", "Run()<suspends>:void =", "    "), "    ");
        assert.equal(this.mode.getNextLineIndent("start", "race: # first arm wins", "    "), "    ");
        assert.equal(this.mode.getNextLineIndent("start", "Items := array{", "    "), "    ");
        assert.equal(this.mode.getNextLineIndent("start", "Print(\"Ready:\")", "    "), "");
        assert.equal(this.mode.getNextLineIndent("start", "    X := 1", "    "), "    ");
    },

    "test: indent the body of an indented comment" : function() {
        var session = new EditSession(["    <#>", "        Note.", ""], this.mode);
        var tab = session.getTabString();
        session.getTokens(0);
        session.getTokens(1);
        assert.equal(this.mode.getNextLineIndent(session.getState(0), session.getLine(0), tab), "        ");
        assert.equal(this.mode.getNextLineIndent(session.getState(1), session.getLine(1), tab), "        ");
    },

    "test: fold indented blocks" : function() {
        var session = new EditSession([
            "Run()<suspends>:void =",
            "    race:",
            "        Sleep(1.0)",
            "        Sleep(2.0)",
            "X := 1"
        ], this.mode);
        session.setFoldStyle("markbeginend");
        assert.equal(session.getFoldWidget(0), "start");
        assert.equal(session.getFoldWidget(1), "start");
        assert.range(session.getFoldWidgetRange(1), 1, 9, 3, 18);
        assert.range(session.getFoldWidgetRange(0), 0, 22, 3, 18);
    },

    "test: auto outdent a closing brace" : function() {
        var session = new EditSession(["Items := array{", "    1", "    }"], this.mode);
        assert.ok(this.mode.checkOutdent("start", "    ", "}"));
        this.mode.autoOutdent("start", session, 2);
        assert.equal(session.getLine(2), "}");
    }
};

require("../test/run")(module);
