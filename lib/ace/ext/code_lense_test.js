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
    require("../test/mockdom");
}

define(function(require, exports, module) {
"use strict";

var ace = require("../ace");
var codeLense = require("./code_lense");
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
    
    "test code lense": function() {
        editor.session.setValue("a\nb|c\nd" + "\n".repeat(100) + "\txxx");
        
        var commandId = "codeLenseAction";
        var called = null;
        editor.commands.addCommand({
            name: commandId,
            exec: function(editor, args) {
                called = args;
            }
        });

        codeLense.setCodeLenseProvider(editor, {
            provideCodeLenses: function(session) {
                return [{
                    range: {
                        startLineNumber: 1
                    },
                    command: {
                        id: commandId,
                        title: "1",
                        arguments: "line"
                    }
                }, {
                    range: {
                        startLineNumber: 1
                    },
                    command: {
                        id: commandId,
                        title: "2",
                        arguments: "column"
                    }
                }, {
                    range: {
                        startLineNumber: editor.session.getLength() - 1
                    },
                    command: {
                        id: commandId,
                        title: "last",
                        arguments: "last"
                    }
                }];
            }
        });
        editor.renderer.$loop._flush();
        var lense = editor.container.querySelector(".ace_codeLense");
        assert.equal(lense.textContent, "1\xa0|\xa02");
        assert.equal(lense.childNodes.length, 3);
        click(lense.childNodes[0]);
        assert.equal(called, "line");
        click(lense.childNodes[2]);
        assert.equal(called, "column");
        
        editor.gotoLine(10);
        editor.renderer.$loop._flush();
        lense = editor.container.querySelector(".ace_codeLense");
        assert.ok(!lense);

        editor.gotoLine(200);
        editor.renderer.$loop._flush();
        lense = editor.container.querySelector(".ace_codeLense");
        assert.equal(lense.textContent, "last");
        
        editor.setSession(ace.createEditSession("\n".repeat(100)));
        editor.renderer.$loop._flush();
        lense = editor.container.querySelector(".ace_codeLense");
        assert.ok(!lense);
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
