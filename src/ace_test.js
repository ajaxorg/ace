if (typeof process !== "undefined") {
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
    },
    "test: resizeObserver": function(done) {
        var mockObserver = {
            disconnect: function() { mockObserver.target = null; },
            observe: function(el) {
                mockObserver.target = el;
            },
            $create: function(fn) {
                mockObserver.callback = fn;
                return mockObserver;
            },
            call: function() {
                setTimeout(function() {
                    if (mockObserver.target)
                        mockObserver.callback([{contentRect: mockObserver.target.getBoundingClientRect()}]);
                });
            }
        };
        if (!window.ResizeObserver) {
            window.ResizeObserver = mockObserver.$create;
        }
        var editor = ace.edit(null);
        document.body.appendChild(editor.container);
        editor.container.style.width = "100px";
        editor.container.style.height = "100px";
        mockObserver.call();
        editor.resize(true);
        assert.ok(!editor.renderer.$resizeTimer.isPending());
        assert.equal(editor.renderer.$size.width, 100);
        editor.container.style.width = "200px";
        mockObserver.call();
        setTimeout(function() {
            if (editor.renderer.$resizeTimer.isPending())
                editor.renderer.$resizeTimer.call();
            assert.equal(editor.renderer.$size.width, 200);
            editor.container.style.height = "200px";
            mockObserver.call();
            setTimeout(function() {
                assert.ok(editor.renderer.$resizeTimer.isPending());
                editor.container.style.height = "100px";
                mockObserver.call();
                setTimeout(function() {
                    assert.ok(!editor.renderer.$resizeTimer.isPending());
                    editor.setOption("useResizeObserver", false);
                    editor.container.style.height = "300px";
                    mockObserver.call();
                    assert.ok(!editor.renderer.$resizeObserver);
                    editor.setOption("useResizeObserver", true);
                    assert.ok(editor.renderer.$resizeObserver);
                    if (window.ResizeObserver === mockObserver.$create)
                        window.ResizeObserver = undefined;
                    done();
                }, 15);
            }, 15);
        }, 15);
    },
    "test: edit template" : function() {
        var template = document.createElement("template");
        var div = document.createElement("div");
        template.content = document.createDocumentFragment();
        template.content.appendChild(div);
        var fragment = template.content.cloneNode(true);
        var el = fragment.firstChild;
        //emulating template content document fragment behaviour in browser
        //which cause #4634 issue (virtual Document that doesn't have `documentElement`)
        el.ownerDocument = {};
        var editor = ace.edit(el);
        assert.equal(editor.container, el);
        editor.destroy();
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
