/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
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
    require("./test/mockdom");
}

define(function(require, exports, module) {
"use strict";
var Editor = require("./editor").Editor;
var MockRenderer = require("./test/mockrenderer").MockRenderer;
var JavascriptMode = require("./mode/javascript").Mode;
require("./multi_select");
require("./ext/language_tools");

var snippetManager = require("./snippets").snippetManager;
var assert = require("./test/assertions");
var config = require("./config");
var loadModule = config.loadModule;

module.exports = {
    setUp : function(next) {
        this.editor = new Editor(new MockRenderer());
        next();
    },
    tearDown: function() {
        config.loadModule = loadModule;
    },
    
    "test: textmate style format strings" : function() {
        snippetManager.tmStrFormat("hello", {
            guard: "(..)(.)(.)",
            flag:"g",
            fmt: "a\\UO\\l$1\\E$2"
        }) == "aOHElo";
    },
    "test: parse snipmate file" : function() {
        var expected = [{
            name: "a",
            guard: "(?:(=)|(:))?\\s*)",
            trigger: "\\(?f",
            endTrigger: "\\)",
            endGuard: "",
            content: "{$0}\n"
         }, {
            tabTrigger: "f",
            name: "f function",
            content: "function"
        }];
        
        var parsed = snippetManager.parseSnippetFile(
            "name a\nregex /(?:(=)|(:))?\\s*)/\\(?f/\\)/\n\t{$0}" +
            "\n\t\n\n#function\nsnippet f function\n\tfunction"
        );

        assert.equal(JSON.stringify(expected, null, 4), JSON.stringify(parsed, null, 4));
    },
    "test: parse snippet": function() {
        var content = "-\\$$2a${1:x${$2:y$3\\}\\n\\}$TM_SELECTION}";
        var tokens = snippetManager.tokenizeTmSnippet(content);
        assert.equal(tokens.length, 14);
        assert.equal(tokens[4], tokens[13]);
        assert.equal(tokens[2].tabstopId, 2);

        var content = "\\}${var/as\\/d/\\ul\\//g}s";
        var tokens = snippetManager.tokenizeTmSnippet(content);
        snippetManager.resolveVariables(tokens, this.editor);
        assert.equal(tokens.length, 7);
        assert.equal(tokens[1], tokens[5]);
        assert.equal(tokens[6], "s");
        assert.equal(tokens[1].text, "var");
        assert.equal(tokens[1].fmt.length, 3);
        assert.equal(tokens[1].fmt[0].changeCase, "u");
        assert.equal(tokens[1].fmt[1], "l");
        assert.equal(tokens[1].fmt[2], "\\/");
        assert.equal(tokens[1].guard, "as\\/d");
        assert.equal(tokens[1].flag, "g");
    },
    "test: register snippets in json format": function() {
        config.loadModule = function() {};
        this.editor.setOption("enableSnippets", true);
        this.editor.session.setMode(new JavascriptMode());
        
        snippetManager.register({
            "Snippet 1": {
                prefix: "xy",
                body: [
                    "x",
                    "$0",
                    "y"
                ]
            },
            "Snippet 2": {
                prefix: "s",
                body: "$0expanded"
            }
        }, "javascript");
        
        this.editor.execCommand("paste", "xy");
        this.editor.onCommandKey(null, 0, 9);
        this.editor.execCommand("paste", "s");
        this.editor.onCommandKey(null, 0, 9);
        assert.equal(this.editor.getValue(), "x\nexpanded\ny");
        assert.position(this.editor.getCursorPosition(), 1, 0);
    },
    "test: expand snippet with nested tabstops": function() {
        var content = "-${1}-${1:t\n1}--${2:2 ${3} 2}-${3:3 $1 3}-${4:4 $2 4}";
        this.editor.setValue("");
        snippetManager.insertSnippet(this.editor, content);
        assert.equal(this.editor.getValue(), [
            "-t",
            "1-t",
            "1--2 3 t",
            "1 3 2-3 t",
            "1 3-4 2 3 t",
            "1 3 2 4"
        ].join("\n"));
        
        assert.equal(this.editor.getSelectedText(), "t\n1\nt\n1\nt\n1\nt\n1\nt\n1");
        this.editor.tabstopManager.tabNext();
        assert.equal(this.editor.getSelectedText(), "2 3 t\n1 3 2\n2 3 t\n1 3 2");
        this.editor.tabstopManager.tabNext();
        assert.equal(this.editor.getSelectedText(), "3 t\n1 3\n3 t\n1 3\n3 t\n1 3");
        this.editor.tabstopManager.tabNext();
        assert.equal(this.editor.getSelectedText(), "4 2 3 t\n1 3 2 4");
        this.editor.tabstopManager.tabNext();
        assert.equal(this.editor.getSelectedText(), "");
        
        this.editor.setValue("");
        snippetManager.insertSnippet(this.editor, "-${1:a$2}-${2:b$1}");
        assert.equal(this.editor.getValue(), "-ab-ba");
        
        assert.equal(this.editor.getSelectedText(), "ab\na");
        this.editor.tabstopManager.tabNext();
        assert.equal(this.editor.getSelectedText(), "b\nba");
        this.editor.tabstopManager.tabNext();
        assert.equal(this.editor.getSelectedText(), "");
    },
    "test prevent infinite recursion": function() {
        var editor = this.editor;
        editor.setValue("");
        editor.setValue("");
        editor.insertSnippet("CASE ${1:v} ${4:WHEN ${5:p} $10 $2$3\n$4\n"
            + "THEN ${6:r}  } ${7:ELSE ${8:d}} END"
        );
        assert.equal(this.editor.getValue(), "CASE v WHEN p  \n\nTHEN r   ELSE d END");
    },
    "test: nested format strings": function() {
        var editor = this.editor;
        editor.setValue("");
        editor.insertSnippet([
            "$1 --  ${1/(.)(\\d)?(\\w\\w?)?/",
            "${3:?",
            "    letter is ${3/(.)/\\u$1/}, ${2:?number is $2: number is missing}:",
            "    letter is missing ${2:? but number is $2: number is missing too}}," ,
            "    prefix is $1; text is ${0:/upcase};/g}",
            "$0"
        ].join("\n"));
        assert.equal(editor.getValue().length, 6);
        editor.execCommand("insertstring", "q");
        assert.equal(editor.getValue().length, 82);
        editor.execCommand("insertstring", "1");
        assert.equal(editor.getValue().length, 78);
        editor.execCommand("insertstring", "w");
        assert.equal(editor.getValue().length, 70);
        editor.execCommand("insertstring", "a");
        editor.execCommand("insertstring", "l");
        editor.execCommand("insertstring", "s");
        editor.execCommand("insertstring", "t");
        assert.equal(editor.getValue(), [
            "q1walst --  ",
            "",
            "    letter is Wa, number is 1,",
            "    prefix is q; text is Q1WA;",
            "",
            "    letter is St,  number is missing,",
            "    prefix is l; text is LST;",
            ""
        ].join("\n")); 
    },
    "test: format if/else": function() {
        var editor = this.editor;
        var snippetText = [
            "${CURRENT_LINE/.*/1 ${0:else}/i}",
            "${CURRENT_LINE/.*/2 ${0:-else}/i}",
            "${CURRENT_LINE/.*/3 ${0:+if}/i}",
            "${CURRENT_LINE/.*/4 ${0:?if:else}/i}",
            "${CURRENT_LINE/.*/5 ${0:/downcase}/i}"
        ].join("\n");
        editor.setValue("");
        editor.insertSnippet(snippetText);
        assert.equal(editor.getValue(), "1 else\n2 else\n3 \n4 else\n5 ");
        editor.setValue("ACE");
        editor.insertSnippet(snippetText);
        assert.equal(editor.getValue(), "1 ACE\n2 ACE\n3 if\n4 if\n5 ace");
    },
    "test: file paths": function() {
        var editor = this.editor;
        snippetManager.variables.FILEPATH = function() { return "/dir/base name.ext"; };
        editor.setValue("");
        editor.insertSnippet(
            "${TM_FILENAME/^(.)|(?:[-_\\s](.))|(\\.\\w*$)/${1:/upcase}${2:/upcase}/g}"
            + "\n$FILENAME_BASE\n$DIRECTORY\n$FILEPATH\n$FILENAME"
        );
        assert.equal(editor.getValue(), "BaseName\nbase name\n/dir/\n/dir/base name.ext\nbase name.ext");
    },
    "test: selected text": function() {
        var editor = this.editor;
        editor.setValue("foo\nbar");
        editor.selectAll();
        editor.insertSnippet("<div>\n\t${1:$TM_SELECTED_TEXT}\n</div>");
        editor.insertSnippet("<div>\n\t${1:$TM_SELECTED_TEXT}\n</div>");
        editor.insertSnippet("<span>${1:$TM_SELECTED_TEXT}</span>");
        assert.equal(editor.getValue(), [
            "<div>",
            "    <div>",
            "        <span>foo",
            "        bar</span>",
            "    </div>",
            "</div>"
        ].join("\n"));
    },
    "test: date variables": function() {
        var editor = this.editor;
        editor.setValue("foo\nbar");
        editor.selectAll();
        var D = Date;
        var d = new Date(0);
        d.setHours(4);
        d.setMinutes(0);
        Date = function() { return d; }; // eslint-disable-line
        try {
            editor.insertSnippet([
                "$CURRENT_YEAR",
                "$CURRENT_YEAR_SHORT",
                "$CURRENT_MONTH",
                "$CURRENT_MONTH_NAME",
                "$CURRENT_MONTH_NAME_SHORT",
                "$CURRENT_DATE",
                "$CURRENT_DAY_NAME",
                "$CURRENT_DAY_NAME_SHORT",
                "$CURRENT_HOUR",
                "$CURRENT_MINUTE",
                "$CURRENT_SECOND"
            ].join("\n"));
        } finally {
            Date = D;  // eslint-disable-line
        }
        
        assert.equal(editor.getValue(), "1970\n70\n01\nJanuary\nJan\n01\nThursday\nThu\n04\n00\n00");
    },
    "test: choice": function() {
        var editor = this.editor;
        editor.setValue("");
        editor.insertSnippet("${3:${1|and\\|\\,\\\\,another,trigger|}  ${2:$1}}");
        assert.equal(editor.getValue(), "and|,\\  and|,\\");
        editor.execCommand("insertstring", "q");
        assert.equal(editor.getValue(), "q  q");
        this.editor.tabstopManager.tabNext();
        editor.execCommand("insertstring", "s");
        assert.equal(editor.getValue(), "q  s");
        this.editor.tabstopManager.tabNext();
        editor.execCommand("insertstring", "t");
        assert.equal(editor.getValue(), "t");
    },
    "test: deletion": function() {
        var editor = this.editor;
        editor.setValue("");
        editor.insertSnippet("CASE ${1:value} ${4:WHEN ${5:option2} "
            + "THEN ${6:result2}} ${7:ELSE ${8:default}} END"
        );
        editor.onCommandKey(null, 0, 9);
        editor.onCommandKey(null, 0, 8);
        editor.onCommandKey(null, 0, 9);
        assert.equal(editor.getSelectedText(), "ELSE default");
        editor.onCommandKey(null, 4, 9);
        assert.equal(editor.getSelectedText(), "");
        editor.onCommandKey(null, 4, 9);
        assert.equal(editor.getSelectedText(), "value");
        assert.ok(editor.tabstopManager);
        editor.onCommandKey(null, 0, 27);
        assert.ok(!editor.tabstopManager);
    },
    "test: multiple cursors": function() {
        var editor = this.editor;
        
        editor.setValue("\n");
        editor.selection.splitIntoLines();
        editor.insertSnippet("a-${1:1}-\na-$1-\n${2:x}");
        editor.insertSnippet("b=$1-\na-${1:2}-\n${2:y}");
        editor.tabstopManager.tabNext();
        assert.equal(editor.getCopyText(), "y\ny\ny\ny");
        editor.tabstopManager.tabNext();
        editor.tabstopManager.tabNext();
        assert.equal(editor.getCopyText(), "x\nx");

        editor.tabstopManager.tabNext(-4);
        editor.execCommand("insertstring", ".");
        editor.tabstopManager.tabNext(2);
        assert.equal(editor.tabstopManager, null);
        
        assert.equal(editor.getValue(), "a-.-\na-.-\nx\na-.-\na-.-\nx");
    },
    "test: insert snippet inside snippet": function() {
        var editor = this.editor;
        
        editor.session.setValue("");
        editor.insertSnippet("1+${1:-}\n1+$1\ne+${2:end}");
        editor.insertSnippet("2+${1:-}\n2+$1\n3+${2:3}");

        function testTabstop(tabstop, expected) {
            assert.equal(tabstop.join().replace(/Range: | -/g, ""), expected);
        }
        var tabstops = editor.tabstopManager.tabstops;
        
        testTabstop(tabstops[0], "[6/5]> [6/5]");
        testTabstop(tabstops[1], "[0/2]> [2/3],[3/2]> [5/3]");
        testTabstop(tabstops[2], "[4/2]> [4/3],[3/4]> [3/5],[0/4]> [0/5],[1/2]> [1/3]");
        testTabstop(tabstops[3], "[5/2]> [5/3],[2/2]> [2/3]");
        testTabstop(tabstops[4], "[5/3]> [5/3],[2/3]> [2/3]");
        testTabstop(tabstops[5], "[6/2]> [6/5]");
    },
    "test: linking": function() {
        var editor = this.editor;
        editor.setOption("enableMultiselect", false);
        editor.setValue("");
        editor.insertSnippet("${1:x} $1 $1");
        assert.equal(editor.getValue(), "x x x");
        editor.execCommand("insertstring", "qt");
        assert.equal(editor.getValue(), "qt qt qt");
        this.editor.tabstopManager.tabNext();
        editor.execCommand("insertstring", ".");
        assert.equal(editor.getValue(), "qt qt qt.");
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
