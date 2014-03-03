/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2014, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

if (typeof process !== "undefined") {
    require("amd-loader");
}

define(function(require, exports, module) {
"use strict";

function repeat(str, times) {
    return new Array(times + 1).join(str);
}

var EditSession = require("./../edit_session").EditSession,
    Editor = require("./../editor").Editor,
    UndoManager = require("./../undomanager").UndoManager,
    MockRenderer = require("./../test/mockrenderer").MockRenderer,
    assert = require("./../test/assertions"),
    keys = require("./../lib/keys"),
    vim = require("./vim"),
    editor,
    keyCodeByFuncKey = {},
    tests = {};

//Helper functions

function initKeyCodeByFuncKey() {
    for (var keyCode in keys.FUNCTION_KEYS) {
        var funcKey = keys.FUNCTION_KEYS[keyCode];
        keyCodeByFuncKey[funcKey] = keyCode;
    }
}

function initEditor(docString) {
    var session = new EditSession(docString.split("\n"));
    var undoManager = new UndoManager();
    session.setUndoManager(undoManager);
    editor = new Editor(new MockRenderer(), session);
    editor.setKeyboardHandler(vim.handler);
}

function sendKeys() {
    //Vim handler needs to be sent a key at a time for undo to work
    //Handle any mix of command keys and text input arguments
    for (var argInt=0; argInt<arguments.length; argInt++) {
        var arg = arguments[argInt];
        var keyMods = arg.split(/[\-]/);
        var trailingKeys = keyMods.pop();
        var hashId = 0;
        for (var keyModIndex in keyMods) {
            var keyMod = keyMods[keyModIndex];
            var lowerKeyMod = keyMod.toLowerCase();
            if (keys.KEY_MODS.hasOwnProperty(lowerKeyMod)) {
                hashId |= keys.KEY_MODS[lowerKeyMod];
            }
        }
        if (hashId === 0) {
            trailingKeys = arg;
        }
        var keyCode;
        if (keyCodeByFuncKey.hasOwnProperty(trailingKeys)) {
            keyCode = keyCodeByFuncKey[trailingKeys];
            editor.onCommandKey({}, hashId, keyCode);
        } else {
            if (hashId !== 0) {
                keyCode = trailingKeys.toUpperCase().charCodeAt(0);
                editor.onCommandKey({}, hashId, keyCode);
            } else {
                for (var i=0; i<trailingKeys.length; i++) {
                    var key = trailingKeys.charAt(i);
                    editor.onTextInput(key);
                    editor.session.$syncInformUndoManager();
                }
            }
        }
    }
}

function assertContent(expectedText) {
    var actualText = editor.session.toString();
    assert.strictEqual(actualText, expectedText, "Content expected: " + expectedText + ", actual: " + actualText);
}

function assertPosition(expectedRow, expectedCol) {
    var actualPosition = editor.getCursorPosition();
    var actualRow = actualPosition.row;
    var actualCol = actualPosition.column;
    assert.strictEqual(actualRow, expectedRow, "Row expected: " + expectedRow + ", actual: " + actualRow);
    assert.strictEqual(actualCol, expectedCol, "Column expected: " + expectedCol + ", actual: " + actualCol);
}

function addTest(title, chapter, section, testFunction) {
    var href = "http://vimdoc.sourceforge.net/htmldoc/usr_" + chapter + ".html#" + chapter + "." + section;
    var testName;
    if (location.protocol === "file:") { //running in console mode
        testName = "test " + title + " (See " + href + ")";
    } else {
        testName = "test <a href=\"" + href + "\" target=\"_blank\">" + title + "</a>";
    }
    tests[testName] = testFunction;
}

//Define the tests

initKeyCodeByFuncKey();

addTest("Insert text", "02", "2", function() {
    var text = "A very intelligent turtle\nFound programming UNIX a hurdle";
    initEditor("");
    sendKeys("i", text, "Esc");
    assertContent(text);
    sendKeys("Esc", "Esc");
    assertContent(text);
});

addTest("Moving around", "02", "3", function() {
    initEditor(" k \nh l\n j ");
    sendKeys("hjj");
    assertPosition(2, 0);
    sendKeys("jll");
    assertPosition(2, 2);
    sendKeys("lkk");
    assertPosition(0, 2);
    sendKeys("khh");
    assertPosition(0, 0);
});

addTest("Deleting characters", "02", "4", function() {
    var text = "A very intelligent turtle\nFound programming UNIX a hurdle";
    initEditor(text);
    sendKeys("xxxxxxx");
    assertContent(text.substring(7));
    sendKeys("iA young ", "Esc");
    assertContent("A young intelligent turtle\nFound programming UNIX a hurdle");
    sendKeys("dd");
    assertContent("Found programming UNIX a hurdle");
    sendKeys("ddiA young intelligent\nturtle", "Esc", "kJ");
    assertContent("A young intelligent turtle");
});

addTest("Undo and Redo [PARTIAL]", "02", "5", function() {
    var text = "A young intelligent turtle";
    initEditor(text);
    sendKeys("ddu");
    assertContent(text);
    sendKeys("0xxxxxxx");
    assertContent(text.substring(7));
    for (var i=6; i>=0; i--) {
        sendKeys("u");
        assertContent(text.substring(i));
    }
    sendKeys("ctrl-r", "ctrl-r");
    assertContent(text.substring(2));
    text = "A very intelligent turtle";
    sendKeys("ddi", text, "Esc");
    sendKeys("0wxxxxxwwxxxxxx");
    assertContent("A intelligent ");
/* "U" fails
    sendKeys("U");
    assertContent(text);
    sendKeys("u");
    assertContent("A intelligent ");
*/
});

addTest("Other editing commands [PARTIAL]", "02", "6", function() {
    var text = "and that's not saying much for the turtle.";
    initEditor(text);
    sendKeys("$xa!!!", "Esc");
    assertContent(text.slice(0, -1) + "!!!");
    var text1 = "A very intelligent turtle";
    var text2 = "Found programming UNIX a hurdle";
    sendKeys("ddi", text1 + "\n" + text2, "Esc");
    var text3 = "That liked using Vim";
    sendKeys("ko", text3, "Esc");
    assertContent([text1, text3, text2].join("\n"));
    sendKeys("O", "Esc");
    assertContent([text1, "", text3, text2].join("\n"));
/* "3a!" fails
    sendKeys("3a!", "Esc");
*/
    sendKeys("a!!!", "Esc");
    assertContent([text1, "!!!", text3, text2].join("\n"));
    sendKeys("hhh3x");
    assertContent([text1, "", text3, text2].join("\n"));
});

addTest("Getting out [PARTIAL]", "02", "7", function() {
    initEditor("");
    sendKeys("ZZ");
    /*
    sendKeys("aSome text", "Esc");
    sendKeys(":q", "Return");
    sendKeys(":q!", "Return");

    sendKeys(":e!", "Return");
    */
});

addTest("Finding help [PARTIAL]", "02", "8", function() {
    initEditor("");
    sendKeys(":help", "Return");
    sendKeys("F1");
});

addTest("Word movement [PARTIAL]", "03", "1", function() {
    var text = "This is a line with example text";
    initEditor(text);
    sendKeys("www3w");
    assertPosition(0, 28);
    sendKeys("b2b");
    assertPosition(0, 10);
    sendKeys("3le");
    assertPosition(0, 18);
/* "ge" fails
    sendKeys("2ge");
    assertPosition(0, 8);
 TODO: What iskeyword behavior is assumed for Ace?
 Need to test "b,w,ge,e,gE, B, W, E" behaviors
    sendKeys("ddaThis is-a line, with special/separated/words (and some more).", "Esc");
    sendKeys("$4b");
    assertPosition(0, 21);
*/
});

addTest("Moving to the start or end of a line", "03", "2", function() {
    var text = "     This is a line with example text";
    var textLength = text.length;
    initEditor(text);
    sendKeys("$");
    assertPosition(0, 36);
    sendKeys("0");
    assertPosition(0, 0);
    sendKeys("End");
    assertPosition(0, 36);
    sendKeys("Home");
    assertPosition(0, 0);
    sendKeys("^");
    assertPosition(0, 5);
    sendKeys("$^");
    assertPosition(0, 5);
    sendKeys("ddaA young intelligent turtle\nFound programming UNIX a hurdle", "Esc", "k0");
    assertPosition(0, 0);
    sendKeys("2$");
    assertPosition(1, 30);
});

addTest("Moving to a character [PARTIAL]", "03", "3", function() {
    var text = "To err is human.  To really foul up you need a computer.";
    initEditor(repeat(text, 2));
    sendKeys("fh");
    assertPosition(0, 10);
    sendKeys("3fl");
    assertPosition(0, 31);
    sendKeys("Fh");
    assertPosition(0, 10);
    sendKeys("Fh");
    assertPosition(0, 10);
    sendKeys("2tn");
    assertPosition(0, 39);
    sendKeys("Th");
    assertPosition(0, 11);
    sendKeys("tn");
    assertPosition(0, 13);
    sendKeys(";");
    assertPosition(0, 39);
/* Problem with mockrenderer?
    sendKeys(";");
    assertPosition(0, 39);
*/
    sendKeys(",");
    assertPosition(0, 15);
    sendKeys("0f", "Esc", "w");
    assertPosition(0, 3);
});

addTest("Matching a parenthesis", "03", "4", function() {
    var text = "if (a == (b * c) / d)\nif [a == [b * c] / d]\nif {a == {b * c} / d}";
    initEditor(text);
    sendKeys("%");
    assertPosition(0, 20);
    sendKeys("%");
    assertPosition(0, 3);
    sendKeys("0j%");
    assertPosition(1, 20);
    sendKeys("%");
    assertPosition(1, 3);
    sendKeys("0j%");
    assertPosition(2, 20);
    sendKeys("%");
    assertPosition(2, 3);
});

addTest("Moving to a specific line [PARTIAL]", "03", "5", function() {
    var text = "first line of a file\n" + repeat("text text text text\n", 8) + "last line of a file";
    initEditor(text);
    sendKeys("7G");
    assertPosition(6, 0);
    sendKeys("gg");
    assertPosition(0, 0);
    sendKeys("G");
    assertPosition(9, 0);
/* <percent>% motion fails
    sendKeys("50%");
    assertPosition(4, 0);
    sendKeys("90%");
    assertPosition(8, 0);
"H, M, L" motion supported, but mockrenderer.js has no 'getScrollBottomRow', etc.
    sendKeys("L");
    assertPosition(9, 0);
    sendKeys("M");
    assertPosition(4, 0);
    sendKeys("H");
    assertPosition(0, 0);
*/
});

addTest("Telling where you are [PARTIAL]", "03", "6", function() {
    // Ctrl-G, :set commands not implemented?
});

addTest("Scrolling around [PARTIAL]", "03", "7", function() {
    /* Ctrl-D, Ctrl-U, Ctrl-E, Ctrl-Y, zz, zt, zb cannot be tested with mockrenderer
    var text = repeat("some text\n", 4) + "\n123456\n7890\n" + repeat("\nexample", 4); 
    initEditor(text);
    sendKeys("Ctrl-D");
    */
});

addTest("Simple searches [PARTIAL]", "03", "8", function() {
    var text = repeat("To find the word #include\n", 10);
    initEditor(text);
/* Search fails, (is a command line really necessary for this to work?
    sendKeys("/include", "Return");
    assertPosition(0, 18);
    sendKeys("/#include", "Return");
    assertPosition(1, 17);
    sendKeys("nnn");
    assertPosition(4, 17);
    sendKeys("3n");
    assertPosition(7, 17);
    sendKeys("?word", "Return");
    assertPosition(7, 12);
    sendKeys("N");
    assertPosition(8, 12);
    sendKeys("/#include", "Return");
    assertPosition(8, 17);
    sendKeys("N");
    assertPosition(7, 17);
    //Skipping ':set ignorecase' and ':set noignorecase'
    //Skipping search history
    //TODO additional search tests
*" and "#" searches fail, no getPixelPosition in mockrenderer
    sendKeys("gg*");
    assertPosition(1, 5);
*/
});

addTest("Simple search patterns [PARTIAL]", "03", "9", function() {
});

addTest("Using marks [PARTIAL]", "03", "10", function() {
/* '', ``, Ctrl-O, Ctrl-I fail
    var text1 = "example text\n" 
    var text2 = "line 33 text\n"
    var text3 = "There you are\n"
    var text = repeat(text1, 32) + text2 + repeat(text1, 2) + text3 + text1;
    initEditor(text);
    sendKeys("G");
    sendKeys("``");
    assertPosition(0, 0);
    sendKeys("``");
    assertPosition(37, 0);
    sendKeys("10k``");
    assertPosition(0, 0);
    sendKeys("33G");
    assertPosition(33, 0);
    sendKeys("/^The");
    assertPosition((36, 0);
    sendKeys("Ctrl-O");
    assertPosition(33, 0);
    sendKeys("Ctrl-O");
    assertPosition(0, 0);
    sendKeys("Ctrl-I");
    assertPosition(33, 0);
    sendKeys("Ctrl-I");
    assertPosition(36, 0);
    sendKeys(":0$msG$me's");
    assertPosition(0, 0);
    sendKeys("`s");
    assertPosition(0, 11);
    sendKeys("'e");
    assertPosition(36, 0);
    sendKeys("`e"):
    assertPosition(36, 11);
*/
});

addTest("Operators and motions [PARTIAL]", "04", "1", function() {
    initEditor("To err is human. To really foul up you need a computer.");
    sendKeys("5wd4w");
    assertContent("To err is human. you need a computer.");
/* "d<count>e" fails
    sendKeys("d2e");
    assertContent("To err is human.  a computer.");

    sendKeys("2hd$");
    assertContent("To err is human");
*/
});

addTest("Changing text [PARTIAL]", "04", "2", function() {
    initEditor("To err is human");
/*
// "c<count>w" fails
//  sendKeys("wc2wbe", "Esc");
//  assertContent("To be human");
    sendKeys("uccabc def", "Esc");
    assertContent("abc def");
    sendKeys("0c$123", "Esc");
    assertContent("123");
    sendKeys("hx");
    assertContent("13");
    sendKeys("X");
    assertContent("3");
    sendKeys("a 2 1", "Esc", "0wD");
    assertContent("3 ");
    sendKeys("a2 1", "Esc", "0wC4 5", "Esc");
    assertContent("3 4 5");
    sendKeys("0ws6", "Esc");
    assertContent("3 6 5");
    sendKeys("S1 3 2", "Esc");
    assertContent("1 3 2");
    sendKeys("$a4 6 5", "Esc", "03d2w");
    assertContent("");
    sendKeys("athere is somerhing grong here", "Esc", "0rTww4lrtwrw");
    assertContent("There is something wrong here");
    sendKeys("03w5rx");
    assertContent("There is something xxxxx here");
// "r<Return>" fails - also replaces trailing space
    sendKeys("r", "Return");
    assertContent("There is something xxxx\n here");
    //TODO - 4r<Return>
*/
});

addTest("Repeating a change [PARTIAL]", "04", "3", function() {
/*
    initEditor("To <B>generate</B> a table of <B>contents");
    sendKeys("f<df>f<.f<."); //strangeness after this
    assertContent("To generate a table of contents");;
    sendKeys("dd");
    assertContent("");
sendKeys("Esc", "Esc");
    sendKeys("afind");
    var text = "find the first \"four\"\n" +
            "change the word to \"five\"\n" +
            "find the next \"four\"\n" +
            "repeat the change to \"five\"\n" +
            "find the next \"four\"\n" +
            "repeat the change\n" +
            "etc.";
    sendKeys(text);
assertContent(text);
    sendKeys("Esc");
    sendKeys("0");
// search doesn't work with mockrenderer
    sendKeys("/four", "<Return>", "cwfive", "Esc", "n.n.");
    text.replace(/four/g, "five");
    assertContent(text);
*/
});

addTest("Visual mode [PARTIAL]", "04", "4", function() {
});

addTest("Moving text [PARTIAL]", "04", "5", function() {
});

addTest("Copying text [PARTIAL]", "04", "6", function() {
});

addTest("Using the clipboard [PARTIAL]", "04", "7", function() {
});

addTest("Text objects [PARTIAL]", "04", "8", function() {
});

addTest("Replace mode [PARTIAL]", "04", "9", function() {
});

tests.name = "vim_test.js";

module.exports = tests;

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
