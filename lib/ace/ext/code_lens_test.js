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

/* global Promise */

if (typeof process !== "undefined") {
    require("amd-loader");
    require("../test/mockdom");
}

define(function(require, exports, module) {
"use strict";

var ace = require("../ace");
var codeLens = require("./code_lens");
var assert = require("../test/assertions");
require("./error_marker");

function click(node) {
    node.dispatchEvent(new window.CustomEvent("click", {bubbles: true}));
}

var editor = null;
module.exports = {
    setUp: function() {
        if (editor)
            editor.destroy();
        var el = document.createElement("div");

        el.style.left = "20px";
        el.style.top = "30px";
        el.style.width = "300px";
        el.style.height = "100px";
        document.body.appendChild(el);
        editor = ace.edit(el);
        editor.on("destroy", function() {
            document.body.removeChild(el);
        });
    },
    tearDown: function() {
        editor && editor.destroy();
        editor = null;
    },

    "test code lens": function() {
        editor.session.setValue("a\nb|c\nd" + "\n".repeat(100) + "\txxx");

        var commandId = "codeLensAction";
        var called = null;
        editor.commands.addCommand({
            name: commandId,
            exec: function(editor, args) {
                called = args;
            }
        });

        codeLens.registerCodeLensProvider(editor, {
            provideCodeLenses: function(session, callback) {
                callback(null, [{
                    start: {
                        row: 1
                    },
                    command: {
                        id: commandId,
                        title: "1",
                        arguments: "line"
                    }
                }, {
                    start: {
                        row: 1
                    },
                    command: {
                        id: commandId,
                        title: "2",
                        arguments: "column"
                    }
                }, {
                    start: {
                        row: session.getLength() - 1
                    },
                    command: {
                        id: commandId,
                        title: "last",
                        arguments: "last"
                    }
                }]);
            }
        });
        editor.$updateLenses();
        editor.renderer.$loop._flush();
        var lens = editor.container.querySelector(".ace_codeLens");
        assert.equal(lens.textContent, "1\xa0|\xa02");
        assert.equal(lens.childNodes.length, 3);
        click(lens.childNodes[0]);
        assert.equal(called, "line");
        click(lens.childNodes[2]);
        assert.equal(called, "column");

        // Scroll down so that first lines go beyond the viewport
        editor.gotoLine(10);
        editor.renderer.$loop._flush();
        lens = editor.container.querySelector(".ace_codeLens");
        assert.ok(!lens);

        editor.gotoLine(200);
        editor.renderer.$loop._flush();
        lens = editor.container.querySelector(".ace_codeLens");
        assert.equal(lens.textContent, "last");

        editor.setSession(ace.createEditSession("\n".repeat(100)));
        editor.renderer.$loop._flush();
        lens = editor.container.querySelector(".ace_codeLens");
        assert.ok(!lens);
    },

    "test async code lens": function(next) {
        editor.session.setValue("a\nb\nc");
        new Promise(function(resolve) {
                codeLens.registerCodeLensProvider(editor, {
                    provideCodeLenses: function(session, callback) {
                        setTimeout(function() {
                            callback(null, [{
                                start: { row: 1 },
                                command: { title: "code lens" }
                            }]);
                            resolve();
                        });
                    }
                });
                editor.$updateLenses();
            })
            .then(function() {
                editor.renderer.$loop._flush();
                var lens = editor.container.querySelector(".ace_codeLens");
                assert.equal(lens.textContent, "code lens");
                next();
            })
            .catch(next);
    },

    "test multiple code lens providers": function(next) {
        editor.session.setValue("a\nb\nc\nd");
        new Promise(function(resolve) {
                codeLens.registerCodeLensProvider(editor, {
                    provideCodeLenses: function(session, callback) {
                        callback(null, [{
                            start: { row: 1 },
                            command: { title: "1" }
                        }]);
                    }
                });
                codeLens.registerCodeLensProvider(editor, {
                    provideCodeLenses: function(session, callback) {
                        setTimeout(function() {
                            callback(null, [{
                                start: { row: 2 },
                                command: { title: "2" }
                            }]);
                            resolve();
                        });
                    }
                });
                editor.$updateLenses();
            })
            .then(function() {
                editor.renderer.$loop._flush();
                var lens = editor.container.querySelectorAll(".ace_codeLens");
                assert.equal(lens[0].textContent, "1");
                assert.equal(lens[1].textContent, "2");
                next();
            })
            .catch(next);
    },

    "test multiple code lens providers on the same line": function() {
        editor.session.setValue("a\nb\nc");
        codeLens.registerCodeLensProvider(editor, {
            provideCodeLenses: function(session, callback) {
                callback(null, [{
                    start: { row: 1 },
                    command: { title: "1" }
                }]);
            }
        });
        codeLens.registerCodeLensProvider(editor, {
            provideCodeLenses: function(session, callback) {
                callback(null, [{
                    start: { row: 1 },
                    command: { title: "2" }
                }]);
            }
        });
        editor.$updateLenses();
        editor.renderer.$loop._flush();
        var lens = editor.container.querySelector(".ace_codeLens");
        assert.equal(lens.textContent, "1\xa0|\xa02");
    },

    "test code lens behavior with multiple sessions": function() {
        editor.session.setValue("a\nb");
        codeLens.registerCodeLensProvider(editor, {
            provideCodeLenses: function(session, callback) {
                callback(null, [{
                    start: { row: 1 },
                    command: { title: session.doc.$lines[0] }
                }]);
            }
        });
        editor.$updateLenses();
        editor.renderer.$loop._flush();
        var lens = editor.container.querySelector(".ace_codeLens");
        assert.equal(lens.textContent, "a");

        editor.setSession(ace.createEditSession("c\nd"));
        editor.$updateLenses();
        editor.renderer.$loop._flush();
        var lens = editor.container.querySelector(".ace_codeLens");
        assert.equal(lens.textContent, "c");
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
