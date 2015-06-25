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

define(function(require, exports, module) {
var dom = require("ace/lib/dom");
var Range = require("ace/range").Range;
function warn() {
    var s = (new Error()).stack || "";
    s = s.split("\n");
    if (s[1] == "Error") s.shift(); // remove error description on chrome
    s.shift(); // remove warn
    s.shift(); // remove the getter
    s = s.join("\n");
    // allow easy access to ace in console, but not in ace code
    if (!/at Object.InjectedScript.|@debugger eval|snippets:\/{3}|<anonymous>:\d+:\d+/.test(s)) {
        console.error("trying to access to global variable");
    }
}
function def(o, key, get) {
    try {
        Object.defineProperty(o, key, {
            configurable: true, 
            get: get,
            set: function(val) {
                delete o[key];
                o[key] = val;
            }
        });
    } catch(e) {
        console.error(e);
    }
}
def(window, "ace", function(){ warn(); return window.env.editor });
def(window, "editor", function(){ warn(); return window.env.editor });
def(window, "session", function(){ warn(); return window.env.editor.session });
def(window, "split", function(){ warn(); return window.env.split });


def(window, "devUtil", function(){ warn(); return exports });
exports.showTextArea = function(argument) {
    dom.importCssString("\
      .ace_text-input {\
        position: absolute;\
        z-index: 10!important;\
        width: 6em!important;\
        height: 1em;\
        opacity: 1!important;\
        background: rgba(0, 92, 255, 0.11);\
        border: none;\
        font: inherit;\
        padding: 0 1px;\
        margin: 0 -1px;\
        text-indent: 0em;\
    }\
    ");
};

exports.addGlobals = function() {
    window.oop = require("ace/lib/oop");
    window.dom = require("ace/lib/dom");
    window.Range = require("ace/range").Range;
    window.Editor = require("ace/editor").Editor;
    window.assert = require("ace/test/asyncjs/assert");
    window.asyncjs = require("ace/test/asyncjs/async");
    window.UndoManager = require("ace/undomanager").UndoManager;
    window.EditSession = require("ace/edit_session").EditSession;
    window.MockRenderer = require("ace/test/mockrenderer").MockRenderer;
    window.EventEmitter = require("ace/lib/event_emitter").EventEmitter;
    
    window.getSelection = getSelection;
    window.setSelection = setSelection;
    window.testSelection = testSelection;
};

function getSelection(editor) {
    var data = editor.multiSelect.toJSON();
    if (!data.length) data = [data];
    data = data.map(function(x) {
        var a, c;
        if (x.isBackwards) {
            a = x.end;
            c = x.start;
        } else {
            c = x.end;
            a = x.start;
        }
        return Range.comparePoints(a, c) 
            ? [a.row, a.column, c.row, c.column]
            : [a.row, a.column];
    });
    return data.length > 1 ? data : data[0];
}
function setSelection(editor, data) {
    if (typeof data[0] == "number")
        data = [data];
    editor.selection.fromJSON(data.map(function(x) {
        var start = {row: x[0], column: x[1]};
        var end = x.length == 2 ? start : {row: x[2], column: x[3]};
        var isBackwards = Range.comparePoints(start, end) > 0;
        return isBackwards ? {
            start: end,
            end: start,
            isBackwards: true
        } : {
            start: start,
            end: end,
            isBackwards: true
        };
    }));
}
function testSelection(editor, data) {
    assert.equal(getSelection(editor) + "", data + "");
}

exports.recordTestCase = function() {
    exports.addGlobals();
    var editor = window.editor;
    var testcase = window.testcase = [];
    var assert;

    testcase.push({
        type: "setValue",
        data: editor.getValue()
    }, {
        type: "setSelection",
        data: getSelection(editor)
    });
    editor.commands.on("afterExec", function(e) {
        testcase.push({
            type: "exec",
            data: e
        });
        testcase.push({
            type: "value",
            data: editor.getValue()
        });
        testcase.push({
            type: "selection",
            data: getSelection(editor)
        });
    });
    editor.on("mouseup", function() {
        testcase.push({
            type: "setSelection",
            data: getSelection(editor)
        });
    });
    
    testcase.toString = function() {
        var lastValue = "";
        // var lastSelection = ""
        var str = this.map(function(x) {
            var data = x.data;
            switch (x.type) {
                case "exec": 
                    return 'editor.execCommand("' 
                        + data.command.name
                        + (data.args ? '", ' + JSON.stringify(data.args) : '"')
                    + ')';
                case "setSelection":
                    return 'setSelection(editor, ' + JSON.stringify(data)  + ')';
                case "setValue":
                    if (lastValue != data) {
                        lastValue = data;
                        return 'editor.setValue(' + JSON.stringify(data) + ', -1)';
                    }
                    return;
                case "selection":
                    return 'testSelection(editor, ' + JSON.stringify(data) + ')';
                case "value":
                    if (lastValue != data) {
                        lastValue = data;
                        return 'assert.equal('
                            + 'editor.getValue(),'
                            + JSON.stringify(data)
                        + ')';
                    }
                    return;
            }
        }).filter(Boolean).join("\n");
        
        return getSelection + "\n"
            + testSelection + "\n"
            + setSelection + "\n"
            + "\n" + str + "\n";
    };
};


});
