if (typeof process !== "undefined") {
    require("./test/mockdom");
}

"use strict";

var sendKey = require("./test/user").type;
var {buildDom} = require("./lib/dom");
var ace = require("./ace");
var assert = require("./test/assertions");
var user = require("./test/user");
var Range = require("./range").Range;
require("./ext/language_tools");
var Autocomplete = require("./autocomplete").Autocomplete;

var editor;
function initEditor(value) {
    if (editor) {
        editor.destroy();
        editor.container.remove();
        editor = null;
    }
    editor = ace.edit(null, {
        value: value,
        maxLines: 10,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true
    });
    document.body.appendChild(editor.container);
    editor.focus();

    return editor;
}

function afterRenderCheck(popup, callback) {
    popup.renderer.on("afterRender", function wait() {
        popup.renderer.off("afterRender", wait);
        callback();
    });
}

module.exports = {
    tearDown: function() {
        if (editor) {
            editor.destroy();
            editor.container.remove();
            editor = null;
        }
    },
    "test: highlighting in the popup": function (done) {
        var editor = initEditor("\narraysort alooooooooooooooooooooooooooooong_word");
        //   editor.container.style.width = "500px";
        //  editor.container.style.height = "500px";

        assert.ok(!editor.container.querySelector("style"));

        sendKey("a");
        checkInnerHTML('<d "ace_line ace_selected" id="suggest-aria-id:0" role="option" aria-label="arraysort" aria-setsize="2" aria-posinset="1" aria-describedby="doc-tooltip"><s "ace_completion-highlight">a</s><s "ace_">rraysort</s><s "ace_completion-spacer"> </s><s "ace_completion-meta">local</s></d><d "ace_line"><s "ace_completion-highlight">a</s><s "ace_">looooooooooooooooooooooooooooong_word</s><s "ace_completion-spacer"> </s><s "ace_completion-meta">local</s></d>', function() {
            sendKey("rr");
            checkInnerHTML('<d "ace_line ace_selected" id="suggest-aria-id:0" role="option" aria-label="arraysort" aria-setsize="1" aria-posinset="1" aria-describedby="doc-tooltip"><s "ace_completion-highlight">arr</s><s "ace_">aysort</s><s "ace_completion-spacer"> </s><s "ace_completion-meta">local</s></d>', function() {
                sendKey("r");
                checkInnerHTML('<d "ace_line ace_selected" id="suggest-aria-id:0" role="option" aria-label="arraysort" aria-setsize="1" aria-posinset="1" aria-describedby="doc-tooltip"><s "ace_completion-highlight">arr</s><s "ace_">ayso</s><s "ace_completion-highlight">r</s><s "ace_">t</s><s "ace_completion-spacer"> </s><s "ace_completion-meta">local</s></d>', function() {
                    
                    sendKey("Return");
                    assert.equal(editor.getValue(), "arraysort\narraysort alooooooooooooooooooooooooooooong_word");
                    editor.execCommand("insertstring", " looooooooooooooooooooooooooooong_");
                    checkInnerHTML('<d "ace_line ace_selected" id="suggest-aria-id:0" role="option" aria-label="alooooooooooooooooooooooooooooong_word" aria-setsize="1" aria-posinset="1" aria-describedby="doc-tooltip"><s "ace_">a</s><s "ace_completion-highlight">looooooooooooooooooooooooooooong_</s><s "ace_">word</s><s "ace_completion-spacer"> </s><s "ace_completion-meta">local</s></d>', function() {
                        sendKey("Return");
                        editor.destroy();
                        editor.container.remove();
                        done();
                    });
                });
            });
        });
        
        var last;
        function checkInnerHTML(expected, callback) {
            var popup = editor.completer.popup;
         
            popup.renderer.on("afterRender", function wait() {
                var innerHTML = popup.renderer.$textLayer.element.innerHTML
                    .replace(/\s*style="[^"]+"|class=|(d)iv|(s)pan/g, "$1$2");
                if (innerHTML == last) 
                    return;
                assert.equal(innerHTML, expected);
                last = innerHTML;
                popup.renderer.off("afterRender", wait);
                callback();
            });
        }
    },
    "test: completions range and command properties": function (done) {
        var editor = initEditor("goods ");

        editor.completers = [
            {
                getCompletions: function (editor, session, pos, prefix, callback) {
                    var completions = [
                        {
                            caption: "will",
                            snippet: "will: $1",
                            meta: "snippet",
                            command: "startAutocomplete",
                            range: new Range(0, 4, 0, 7)
                        }, {
                            caption: "here",
                            value: "-here",
                            range: new Range(0, 8, 0, 10)
                        }
                    ];
                    callback(null, completions);
                }
            }
        ];

        editor.moveCursorTo(0, 6);
        sendKey("w");
        var popup = editor.completer.popup;
        afterRenderCheck(popup, function () {
            assert.equal(popup.data.length, 1);
            editor.onCommandKey(null, 0, 13);
            assert.equal(popup.data.length, 2);
            assert.equal(editor.getValue(), "goodwill: ");
            afterRenderCheck(popup, function () {
                editor.onCommandKey(null, 0, 13);
                assert.equal(editor.getValue(), "goodwill-here");
                editor.destroy();
                editor.container.remove();
                done();
            });
        });
    },
    "test: correct completion replacement range when filterText has more than one letter": function (done) {
        var editor = initEditor("<");

        editor.completers = [
            {
                getCompletions: function (editor, session, pos, prefix, callback) {
                    var completions = [
                        {
                            caption: "div",
                            value: "div",
                            range: new Range(0, 1, 0, 3)
                        }, {
                            caption: "dialog",
                            value: "dialog",
                            range: new Range(0, 1, 0, 3)
                        }
                    ];
                    callback(null, completions);
                }
            }
        ];

        editor.moveCursorTo(0, 1);
        sendKey("di");
        var popup = editor.completer.popup;
        check(function () {
            assert.equal(popup.data.length, 2);
            editor.onCommandKey(null, 0, 13);
            check(function () {
                assert.equal(editor.getValue(), "<dialog");
                editor.destroy();
                editor.container.remove();
                done();
            });
        });

        function check(callback) {
            setTimeout(function wait() {
                callback();
            }, 10);
        }
    },
    "test: filterText does not trigger selection range removal when completions range is present": function (done) {
        var editor = initEditor("{}");
        editor.completers = [
            {
                getCompletions: function (editor, session, pos, prefix, callback) {
                    var completions = [
                        {
                            caption: "apple",
                            snippet: "apple: $1",
                            meta: "snippet",
                            range: new Range(0, 1, 0, 2)
                        }, {
                            caption: "pineapple",
                            value: "pineapple",
                            range: new Range(0, 1, 0, 2)
                        }
                    ];
                    callback(null, completions);
                }
            }
        ];
        editor.moveCursorTo(0, 1);
        sendKey("a");
        var popup = editor.completer.popup;
        afterRenderCheck(popup, function () {
            assert.equal(popup.data.length, 2);
            editor.onCommandKey(null, 0, 13);
            assert.equal(editor.getValue(), "{apple: }");
            done();
            });
    },
    "test: different completers tooltips": function (done) {
        var editor = initEditor("");
        var firstDoc = "<b>First</b>";
        var secondDoc = "Second";
        editor.completers = [
            {
                getCompletions: function (editor, session, pos, prefix, callback) {
                    var completions = [
                        {
                            caption: "abc",
                            snippet: "ab: $1",
                            meta: "snippet",
                            completerId: "firstCompleter"
                        }, {
                            caption: "cde",
                            value: "cde",
                            completerId: "firstCompleter"
                        }
                    ];
                    callback(null, completions);
                },
                getDocTooltip: function (item) {
                    if (!item.docHTML) {
                        item.docHTML = firstDoc;
                    }
                },
                id: "firstCompleter"
            }, {
                getCompletions: function (editor, session, pos, prefix, callback) {
                    var completions = [
                        {
                            caption: "abcd",
                            snippet: "abcd: $1",
                            meta: "snippet",
                            completerId: "secondCompleter"
                        }, {
                            caption: "cdef",
                            value: "cdef",
                            completerId: "secondCompleter"
                        }
                    ];
                    callback(null, completions);
                },
                getDocTooltip: function (item) {
                    if (!item.docText) {
                        item.docText = secondDoc;
                    }
                },
                id: "secondCompleter"
            }
        ];
        
        

        sendKey("c");
        var popup = editor.completer.popup;
        check(function () {
            assert.equal(popup.data.length, 4);
            assert.equal(popup.container.lastChild.innerHTML, firstDoc);
            sendKey("Down");
            check(function () {
                assert.equal(popup.container.lastChild.innerHTML, secondDoc);
                sendKey("Down");
                check(function () {
                    assert.equal(popup.container.lastChild.innerHTML, firstDoc);
                    sendKey("Down");
                    check(function () {
                        assert.equal(popup.container.lastChild.innerHTML, secondDoc);
                        editor.destroy();
                        editor.container.remove();
                        done();
                    });
                });
            });
        });

        function check(callback) {
            setTimeout(function wait() {
                callback();
            }, 10);
        }
    },
    "test: slow and fast completers": function(done) {
        var syncCompleter={
            getCompletions: function(editor, session, pos, prefix, callback) {
                callback(null,[{
                    value: "test"
                }]);
            },
            id: "asyncCompleter"
        };

        var asyncCompleter = {
            getCompletions: function(editor, session, pos, prefix, callback) {
                setTimeout(() => {
                    callback(null,[{
                        value: "some"
                    }]);
                }, 10);
            },
            id: "asyncCompleter"
        };
        var editor = initEditor("");
        editor.completers=[
            syncCompleter,asyncCompleter
        ];
        editor.resize(true);
        editor.execCommand("insertstring", "o");
        assert.notOk(!!editor.completer.popup);
        setTimeout(function() {
            assert.ok(editor.completer.popup.isOpen);
            assert.equal(editor.completer.popup.renderer.scrollTop, 0);
            editor.completer.popup.renderer.$loop._flush();
            assert.equal(editor.completer.popup.renderer.scrollTop, 0);
            assert.equal(editor.completer.popup.renderer.scroller.textContent, "some ");
            sendKey("Return");
            assert.equal(editor.getValue(), "some");
            sendKey(" ");
            assert.equal(editor.completer.popup.isOpen, false);
            sendKey("t");
            assert.equal(editor.completer.popup.isOpen, true);
            sendKey("Return");
            sendKey(" ");
            sendKey("q");
            assert.equal(editor.completer.popup.isOpen, false);
            
            editor.destroy();
            editor.container.remove();
            done();
        }, 10);
    },
    "test: trigger autocomplete for specific characters": function (done) {
        var editor = initEditor("document");

        editor.completers = [
            {
                getCompletions: function (editor, session, pos, prefix, callback) {
                    var completions = [
                        {
                            caption: "append",
                            value: "append"
                        }, {
                            caption: "all",
                            value: "all"
                        }
                    ];
                    callback(null, completions);
                },
                triggerCharacters: ["."]
            }
        ];
        
        editor.moveCursorTo(0, 8);
        sendKey(".");
        var popup = editor.completer.popup;
        check(function () {
            assert.equal(popup.data.length, 2);
            editor.onCommandKey(null, 0, 13);
            assert.equal(editor.getValue(), "document.all");
            done();
        });

        function check(callback) {
            popup = editor.completer.popup;
            popup.renderer.on("afterRender", function wait() {
                popup.renderer.off("afterRender", wait);
                callback();
            });
        }
    },
    "test: empty message if no suggestions available": function(done) {
        var editor = initEditor("");
        var emptyMessageText = "No suggestions.";
        var autocomplete = Autocomplete.for(editor);
        autocomplete.emptyMessage = () => emptyMessageText;

        user.type("thereisnoautosuggestionforthisword");

        // Open autocompletion via key-binding and verify empty message
        user.type("Ctrl-Space");
        assert.equal(editor.completer.popup.isOpen, true);
        assert.equal(editor.completer.popup.data[0].caption, emptyMessageText);

        user.type("Return");
        assert.equal(editor.completer.popup.isOpen, false);

        done();
    },
    "test: liveAutocompleteDelay": function(done) {
        var editor = initEditor("hello world ");
        editor.setOptions({
            liveAutocompletionDelay: 10,
            liveAutocompletionThreshold: 2
        });
        
        editor.completers = [{
                getCompletions: function(editor, session, pos, prefix, callback) {
                    callback(null,[{
                        value: "test"
                    }]);
                }
            },
            {
                getCompletions: function(editor, session, pos, prefix, callback) {
                    this.timeout = setTimeout(() => {
                        callback(null,[{
                            value: "slow test"
                        }]);
                    }, 50);
                },
                cancel: function() {
                    clearTimeout(this.timeout);
                    this.timeout = null;
                }
            }
        ];
        
        user.type("t");
        user.type("e");
        assert.ok(!editor.completer || !editor.completer.popup.isOpen);
        setTimeout(function() {
            assert.ok(editor.completer.popup.isOpen);
            assert.ok(editor.completers[1].timeout);
            user.type("Home");
            setTimeout(function() {
                assert.ok(!editor.completer.popup.isOpen);
                assert.ok(!editor.completers[1].timeout);
                done();
            }, 0);
        }, 11);
    },
    "test: scroll and resize": function() {
        var editor = initEditor("hello world\n");
        user.type("Ctrl-Space");
        assert.equal(editor.completer.popup.isOpen, true);
        var called = false;
        editor.completer.$updatePopupPosition = function() {
            called = true;
        };
        editor.container.parentNode.dispatchEvent(new CustomEvent("scroll"));
        assert.ok(called);
        
        editor.destroy();
        editor.container.remove();
    }
};

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
