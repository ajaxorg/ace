if (typeof process !== "undefined") {
    require("./test/mockdom");
}
"use strict";
var EditSession = require("./edit_session").EditSession;
var Editor = require("./editor").Editor;
var MockRenderer = require("./test/mockrenderer").MockRenderer;
var MultiSelect = require("./multi_select").MultiSelect;

var snippetManager = require("./snippets").snippetManager;
var assert = require("./test/assertions");

module.exports = {
    setUp : function(next) {
        this.editor = new Editor(new MockRenderer());
        next();
    },
    
    "test: textmate style format strings" : function() {
        var fmt = snippetManager.tmStrFormat;
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
        assert.equal(tokens.length, 15);
        assert.equal(tokens[4], tokens[14]);
        assert.equal(tokens[2].tabstopId, 2);

        var content = "\\}${var/as\\/d/\\ul\\//g:s}";
        var tokens = snippetManager.tokenizeTmSnippet(content);
        assert.equal(tokens.length, 4);
        assert.equal(tokens[1], tokens[3]);
        assert.equal(tokens[2], "s");
        assert.equal(tokens[1].text, "var");
        assert.equal(tokens[1].fmt, "\\ul\\/");
        assert.equal(tokens[1].guard, "as\\/d");
        assert.equal(tokens[1].flag, "g");
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
    }
};
if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
