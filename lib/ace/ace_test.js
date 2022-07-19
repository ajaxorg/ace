if (typeof process !== "undefined") {
    require("amd-loader");
    require("./test/mockdom");
}

"use strict";

var dom = require("./lib/dom");
var ace = require("./ace");
var assert = require("./test/assertions");

module.exports = {
   "test: ace edit" : function() {
        var editor = ace.edit(null, {
            value: "Helo world"
        });
        assert.equal(editor.getValue(), "Helo world");
        
        var session = ace.createEditSession("Juhu kinners!");
        editor.setSession(session);
        assert.equal(editor.getValue(), "Juhu kinners!");
        
        assert.equal(editor, ace.edit(editor.container));
        editor.destroy();
    },
    "test: edit textarea" : function() {
        var el = document.createElement("textarea");
        document.body.appendChild(el);
        var editor = ace.edit(el);
        assert.notEqual(editor.container, el);
        
        editor.container.id = "editor1";
        assert.equal(editor, ace.edit("editor1"));
        editor.destroy();
        document.body.removeChild(editor.container);
    },
    "test: edit element by id" : function() {
        var el = document.createElement("div");
        document.body.appendChild(el);
        var editor = null;
        try {
            editor = ace.edit("x");
        } catch(e) {
        }
        assert.equal(editor, null);
        
        el.id = "editor2";
        el.textContent = "h";
        editor = ace.edit("editor2");
        assert.equal(el, editor.container);
        assert.equal("h", editor.getValue());
        document.body.removeChild(el);
    },
    "test: destroy": function(done) {
        var editor = ace.edit();
        var mouseTarget = editor.renderer.getMouseEventTarget();
        var textarea = editor.textInput.getElement();
        
        // editor.curOp is undefined after commands
        sendText(textarea, "x");
        assert.ok(!editor.curOp);
        assert.equal(editor.getValue(), "x");
        
        // editor.curOp is defined if api is used without endOperation
        editor.insert("1");
        assert.ok(editor.curOp);
        
        // clicking on editor calls focus
        var focusCalled = 0;
        editor.focus = function() { focusCalled++; };
        click(mouseTarget);
        assert.equal(focusCalled, 1);
        
        editor.destroy();

        // clicking on destroyed editor doesn't call focus
        click(mouseTarget);
        assert.equal(focusCalled, 1);

        setTimeout(function() {
            assert.notOk(!!editor.curOp);
            
            // input commands on destroed editor without session do not throw errors
            editor.setSession(null);
            sendText(textarea, "2");
            
            done();
        });
    },
    "test: useStrictCSP": function() {
        ace.config.set("useStrictCSP", undefined);
        function getStyleNode() {
            return document.getElementById("test.css");
        }
        assert.ok(!getStyleNode());
        dom.importCssString("test{}", "test.css", false);
        assert.ok(!getStyleNode());

        ace.config.set("useStrictCSP", true);
        assert.ok(!getStyleNode());

        ace.config.set("useStrictCSP", false);
        assert.ok(getStyleNode());
    }
};

/*global CustomEvent*/
function click(node) {
    node.dispatchEvent(new CustomEvent("mousedown"));
}

function sendText(textarea, text) {
    textarea.value = textarea.value.slice(0, textarea.selectionStart) + text
        +  textarea.value.slice(textarea.selectionEnd);
    textarea.dispatchEvent(new CustomEvent("input"));
}


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
