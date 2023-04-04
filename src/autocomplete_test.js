if (typeof process !== "undefined") {
    require("amd-loader");
    require("./test/mockdom");
}

"use strict";

var ace = require("./ace");
var assert = require("./test/assertions");
var Range = require("./range").Range;
require("./ext/language_tools");

function initEditor(value) {
    var editor = ace.edit(null, {
        value: value,
        maxLines: 10,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true
    });
    document.body.appendChild(editor.container);

    // workaround for autocomplete using non-relative path
    editor.renderer.$themeId = "./theme/textmate";
    return editor;
}

module.exports = {
    "test: highlighting in the popup": function (done) {
        var editor = initEditor("\narraysort alooooooooooooooooooooooooooooong_word");
        //   editor.container.style.width = "500px";
        //  editor.container.style.height = "500px";

        assert.ok(!editor.container.querySelector("style"));

        editor.execCommand("insertstring", "a");
        checkInnerHTML('<d "ace_line ace_selected" id="suggest-aria-id:0" role="option" aria-label="arraysort" aria-setsize=2 aria-posinset=0><s "ace_completion-highlight">a</s><s "ace_">rraysort</s><s "ace_completion-meta">local</s></d><d "ace_line"><s "ace_completion-highlight">a</s><s "ace_">looooooooooooooooooooooooooooong_word</s><s "ace_completion-meta">local</s></d>', function() {
            editor.execCommand("insertstring", "rr");
            checkInnerHTML('<d "ace_line ace_selected" id="suggest-aria-id:0" role="option" aria-label="arraysort" aria-setsize=1 aria-posinset=0><s "ace_completion-highlight">arr</s><s "ace_">aysort</s><s "ace_completion-meta">local</s></d>', function() {
                editor.execCommand("insertstring", "r");
                checkInnerHTML('<d "ace_line ace_selected" id="suggest-aria-id:0" role="option" aria-label="arraysort" aria-setsize=1 aria-posinset=0><s "ace_completion-highlight">arr</s><s "ace_">ayso</s><s "ace_completion-highlight">r</s><s "ace_">t</s><s "ace_completion-meta">local</s></d>', function() {
                    
                    editor.onCommandKey(null, 0, 13);
                    assert.equal(editor.getValue(), "arraysort\narraysort alooooooooooooooooooooooooooooong_word");
                    editor.execCommand("insertstring", " looooooooooooooooooooooooooooong_");
                    checkInnerHTML('<d "ace_line ace_selected" id="suggest-aria-id:0" role="option" aria-label="alooooooooooooooooooooooooooooong_word" aria-setsize=1 aria-posinset=0><s "ace_">a</s><s "ace_completion-highlight">looooooooooooooooooooooooooooong_</s><s "ace_">word</s><s "ace_completion-meta">local</s></d>', function() {
                        editor.onCommandKey(null, 0, 13);
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
                            range: new Range(0, 4, 0, 6)
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
        editor.execCommand("insertstring", "w");
        var popup = editor.completer.popup;
        check(function () {
            assert.equal(popup.data.length, 1);
            editor.onCommandKey(null, 0, 13);
            assert.equal(popup.data.length, 2);
            assert.equal(editor.getValue(), "goodwill: ");
            check(function () {
                editor.onCommandKey(null, 0, 13);
                assert.equal(editor.getValue(), "goodwill-here");
                editor.destroy();
                editor.container.remove();
                done();
            });
        });

        function check(callback) {
            popup = editor.completer.popup;
            popup.renderer.on("afterRender", function wait() {
                popup.renderer.off("afterRender", wait);
                callback();
            });
        }
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

        editor.execCommand("insertstring", "c");
        var popup = editor.completer.popup;
        check(function () {
            assert.equal(popup.data.length, 4);
            assert.equal(document.body.lastChild.innerHTML, firstDoc);
            editor.onCommandKey(null, 0, 40);
            check(function () {
                assert.equal(document.body.lastChild.innerHTML, secondDoc);
                editor.onCommandKey(null, 0, 40);
                check(function () {
                    assert.equal(document.body.lastChild.innerHTML, firstDoc);
                    editor.onCommandKey(null, 0, 40);
                    check(function () {
                        assert.equal(document.body.lastChild.innerHTML, secondDoc);
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
            }, 70);
        }
    }
};

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
