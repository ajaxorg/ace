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

 /*global CustomEvent*/
 
if (typeof process !== "undefined") {
    require("amd-loader");
}

define(function(require, exports, module) {
"use strict";

var assert = require("./../test/assertions");
require("./../test/mockdom");
var ace = require("../ace");
var editor, changes, textarea;

var MouseEvent = function(type, opts) {
    var e = document.createEvent("MouseEvents");
    e.initMouseEvent("mouse" + type,
        true, true, window,
        opts.detail,
        opts.x, opts.y, opts.x, opts.y,
        opts.ctrl, opts.alt, opts.shift, opts.meta,
        opts.button || 0, opts.relatedTarget);
    return e;
};

function applyEvent(data) {
    if (typeof data == "function")
        return data();
    
    var type = data._;
    var event = new CustomEvent(type);
    for (var i in data.key || {})
        event[i] = data.key[i];
    data.modifier && data.modifier.split("-").map(function(m) {
        if (m) event[m + "Key"] = true;
    });
    if (/input|select|composition/.test(type) || data.key && /Esc/.test(data.key.key)) {
        textarea.value = data.value;
        textarea.selectionEnd = data.range[1];
        textarea.selectionStart = data.range[0];
    }
    textarea.dispatchEvent(event); 
    if (data.value != null)
        assert.equal(textarea.value, data.value);
    
    if (data.range != null) {
        assert.equal(textarea.selectionStart, data.range[0]);
        assert.equal(textarea.selectionEnd, data.range[1]);
        if (/\n\n$/.test(textarea.value) && (!data.key || data.key.keyCode != 27)) {
            assert.ok(textarea.selectionEnd < textarea.value.length);
        }
    }
    editor.resize(true);
}

module.exports = {
    setUp: function() {
        if (editor) this.tearDown();
        
        editor = ace.edit(null);
        document.body.appendChild(editor.container);
        editor.container.style.height = "200px";
        editor.container.style.width = "300px";
        editor.container.style.position = "absolute";
        editor.container.style.outline = "solid";
        editor.resize(true);
        editor.on("change", function(e) {
            changes.push(e);
        });
        editor.setOption("useTextareaForIME", true);
        textarea = editor.textInput.getElement();
        changes = [];
        editor.focus();
    },
    tearDown: function() {
        if (editor) {
            editor.destroy();
            editor.container.remove();
            editor = textarea = null;
        }
    },
    "test: simple text input": function() {
        [
            { _: "input", range: [1,1], value: "a\n\n"},
            { _: "input", range: [2,2], value: "aa\n\n"},
            { _: "input", range: [3,3], value: "aaa\n\n"},
            { _: "keydown", range: [0,0], value: "aaa\n\n", key: { code: "Home", key: "Home", keyCode: 36}},
            { _: "input", range: [1,1], value: "aaaa\n\n"},
            { _: "input", range: [2,2], value: "aaaaa\n\n"},
            { _: "keydown", range: [1,2], value: "aaaaa\n\n", key: { code: "ArrowLeft", key: "ArrowLeft", keyCode: 37}, modifier: "shift-"},
            { _: "input", range: [2,2], value: "aaaaa\n\n"}
        ].forEach(function(data) {
            applyEvent(data);
        });
        editor.resize(true);
        assert.equal(changes.filter(function(d) { return d.action == "insert"; }).length, 6);
        assert.equal(changes.filter(function(d) { return d.action == "remove"; }).length, 1);
    },
    
    "test: composition with visible textarea": function() {
        var data = [
            // select ll
            { _: "keydown", range: [4,4], value: "hello\n\n", key: { code: "ArrowLeft", key: "ArrowLeft", keyCode: 37}},
            { _: "keydown", range: [4,4], value: "hello\n\n", key: { code: "ShiftLeft", key: "Shift", keyCode: 16}, modifier: "shift-"},
            { _: "keydown", range: [3,4], value: "hello\n\n", key: { code: "ArrowLeft", key: "ArrowLeft", keyCode: 37}, modifier: "shift-"},
            { _: "keydown", range: [2,4], value: "hello\n\n", key: { code: "ArrowLeft", key: "ArrowLeft", keyCode: 37}, modifier: "shift-"},
            // start composition
            { _: "keydown", range: [2,4], value: "hello\n\n", key: { code: "KeyK", key: "Process", keyCode: 229}},
            { _: "compositionstart", range: [0,0], value: ""},
            { _: "compositionupdate", range: [0,0], value: ""},
            { _: "input", range: [1,1], value: "ｋ"},
            { _: "keyup", range: [1,1], value: "ｋ", key: { code: "KeyK", key: "k", keyCode: 75}},
            { _: "keydown", range: [1,1], value: "ｋ", key: { code: "KeyI", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [0,1], value: "ｋ"},
            { _: "input", range: [1,1], value: "き"},
            { _: "keyup", range: [1,1], value: "き", key: { code: "KeyI", key: "i", keyCode: 73}},
            { _: "keydown", range: [1,1], value: "き", key: { code: "KeyM", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [0,1], value: "き"},
            { _: "input", range: [2,2], value: "きｍ"},
            { _: "keyup", range: [2,2], value: "きｍ", key: { code: "KeyM", key: "m", keyCode: 77}},
            { _: "keydown", range: [2,2], value: "きｍ", key: { code: "KeyO", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [0,2], value: "きｍ"},
            { _: "input", range: [2,2], value: "きも"},
            { _: "keyup", range: [2,2], value: "きも", key: { code: "KeyO", key: "o", keyCode: 79}},
            { _: "keydown", range: [2,2], value: "きも", key: { code: "KeyN", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [0,2], value: "きも"},
            { _: "input", range: [3,3], value: "きもｎ"},
            { _: "keyup", range: [3,3], value: "きもｎ", key: { code: "KeyN", key: "n", keyCode: 78}},
            { _: "keydown", range: [3,3], value: "きもｎ", key: { code: "KeyO", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [0,3], value: "きもｎ"},
            { _: "input", range: [3,3], value: "きもの"},
            { _: "keyup", range: [3,3], value: "きもの", key: { code: "KeyO", key: "o", keyCode: 79}},
            { _: "keydown", range: [3,3], value: "きもの", key: { code: "Enter", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [0,3], value: "きもの"},
            { _: "input", range: [3,3], value: "きもの"},
            function() {
                assert.ok(editor.renderer.$composition);
                assert.ok(Math.abs(parseFloat(textarea.style.width) - editor.renderer.characterWidth * 6) < 1);
                assert.ok(Math.abs(parseFloat(textarea.style.height) - (editor.renderer.lineHeight + 2)) < 1);
                assert.ok(Math.abs(parseFloat(textarea.style.top)) < 1);
                assert.ok(/ace_composition/.test(textarea.className));
            },
            { _: "compositionend", range: [3,3], value: "きもの"},
            { _: "keydown", range: [3,3], value: "きもの", key: { code: "KeyK", key: "Process", keyCode: 229}},
            { _: "compositionstart", range: [0,0], value: ""},
            { _: "compositionupdate", range: [0,0], value: ""},
            { _: "input", range: [1,1], value: "ｋ"},
            { _: "keyup", range: [1,1], value: "ｋ", key: { code: "KeyK", key: "k", keyCode: 75}},
            { _: "keydown", range: [1,1], value: "ｋ", key: { code: "Enter", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [0,1], value: "ｋ"},
            { _: "input", range: [1,1], value: "ｋ"},
            { _: "compositionend", range: [1,1], value: "ｋ"},
            { _: "keydown", range: [1,1], value: "ｋ", key: { code: "Enter", key: "Enter", keyCode: 13}},
            { _: "keypress", range: [1,1], value: "ｋ", key: { code: "Enter", key: "Enter", keyCode: 13}},
            { _: "input", range: [0,0], value: "o\n\n"},
            { _: "select", range: [0,0], value: "o\n\n"},
            { _: "keyup", range: [0,0], value: "o\n\n", key: { code: "Enter", key: "Enter", keyCode: 13}},
            { _: "keydown", range: [0,0], value: "o\n\n", key: { code: "Space", key: "Process", keyCode: 229}},
            { _: "input", range: [1,1], value: "　o\n\n"},
            { _: "keyup", range: [1,1], value: "　o\n\n", key: { code: "Space", key: " ", keyCode: 32}},
            { _: "keydown", range: [1,1], value: "　o\n\n", key: { code: "KeyK", key: "Process", keyCode: 229}},
            { _: "compositionstart", range: [0,0], value: ""},
            { _: "compositionupdate", range: [0,0], value: ""},
            { _: "input", range: [1,1], value: "ｋ"},
            { _: "keyup", range: [1,1], value: "ｋ", key: { code: "KeyK", key: "k", keyCode: 75}},
            { _: "keydown", range: [1,1], value: "ｋ", key: { code: "ControlLeft", key: "Control", keyCode: 17}, modifier: "ctrl-"},
            { _: "keydown", range: [1,1], value: "ｋ", key: { code: "ControlLeft", key: "Control", keyCode: 17}, modifier: "ctrl-"},
            { _: "keydown", range: [1,1], value: "ｋ", key: { code: "ControlLeft", key: "Control", keyCode: 17}, modifier: "ctrl-"},
            { _: "keydown", range: [1,1], value: "ｋ", key: { code: "ControlLeft", key: "Control", keyCode: 17}, modifier: "ctrl-"},
            { _: "keydown", range: [1,1], value: "ｋ", key: { code: "ControlLeft", key: "Control", keyCode: 17}, modifier: "ctrl-"},
            { _: "keydown", range: [1,1], value: "ｋ", key: { code: "ControlLeft", key: "Control", keyCode: 17}, modifier: "ctrl-"},
            { _: "keydown", range: [1,1], value: "ｋ", key: { code: "KeyZ", key: "Process", keyCode: 229}, modifier: "ctrl-"},
            { _: "compositionupdate", range: [0,1], value: "ｋ"},
            { _: "input", range: [0,0], value: ""},
            { _: "compositionend", range: [0,0], value: ""},
            { _: "keyup", range: [0,0], value: "", key: { code: "KeyZ", key: "z", keyCode: 90}, modifier: "ctrl-"},
            { _: "keyup", range: [0,0], value: "", key: { code: "ControlLeft", key: "Control", keyCode: 17}}
        ];
        
        editor.setValue("hello", 1);
        editor.setOption("useTextareaForIME", true);
        data.forEach(function(data) {
            applyEvent(data);
        });
        assert.ok(!editor.renderer.$composition);
        assert.notOk(/ace_composition/.test(textarea.className));
    },
    
    "test: composition with hidden textarea": function() {
        var checkRenderer = {};
        var data = [
            { _: "keydown", range: [4,4], value: "hello\n\n", key: { code: "ArrowLeft", key: "ArrowLeft", keyCode: 37}},
            { _: "select", range: [4,4], value: "hello\n\n"},
            { _: "keyup", range: [4,4], value: "hello\n\n", key: { code: "ArrowLeft", key: "ArrowLeft", keyCode: 37}},
            { _: "keydown", range: [4,4], value: "hello\n\n", key: { code: "ShiftLeft", key: "Shift", keyCode: 16}, modifier: "shift-"},
            { _: "keydown", range: [3,4], value: "hello\n\n", key: { code: "ArrowLeft", key: "ArrowLeft", keyCode: 37}, modifier: "shift-"},
            { _: "select", range: [3,4], value: "hello\n\n"},
            { _: "keyup", range: [3,4], value: "hello\n\n", key: { code: "ArrowLeft", key: "ArrowLeft", keyCode: 37}, modifier: "shift-"},
            { _: "keydown", range: [2,4], value: "hello\n\n", key: { code: "ArrowLeft", key: "ArrowLeft", keyCode: 37}, modifier: "shift-"},
            { _: "select", range: [2,4], value: "hello\n\n"},
            { _: "keyup", range: [2,4], value: "hello\n\n", key: { code: "ArrowLeft", key: "ArrowLeft", keyCode: 37}, modifier: "shift-"},
            { _: "keyup", range: [2,4], value: "hello\n\n", key: { code: "ShiftLeft", key: "Shift", keyCode: 16}},
            { _: "keydown", range: [2,4], value: "hello\n\n", key: { code: "KeyK", key: "Process", keyCode: 229}},
            { _: "compositionstart", range: [2,4], value: "hello\n\n"},
            { _: "compositionupdate", range: [2,4], value: "hello\n\n"},
            { _: "input", range: [3,3], value: "heｋo\n\n"},
            { _: "keyup", range: [3,3], value: "heｋo\n\n", key: { code: "KeyK", key: "k", keyCode: 75}},
            { _: "keydown", range: [3,3], value: "heｋo\n\n", key: { code: "KeyI", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [2,3], value: "heｋo\n\n"},
            { _: "input", range: [3,3], value: "heきo\n\n"},
            { _: "keyup", range: [3,3], value: "heきo\n\n", key: { code: "KeyI", key: "i", keyCode: 73}},
            { _: "keydown", range: [3,3], value: "heきo\n\n", key: { code: "KeyM", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [2,3], value: "heきo\n\n"},
            { _: "input", range: [4,4], value: "heきｍo\n\n"},
            { _: "keyup", range: [4,4], value: "heきｍo\n\n", key: { code: "KeyM", key: "m", keyCode: 77}},
            { _: "keydown", range: [4,4], value: "heきｍo\n\n", key: { code: "KeyO", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [2,4], value: "heきｍo\n\n"},
            { _: "input", range: [4,4], value: "heきもo\n\n"},
            { _: "keyup", range: [4,4], value: "heきもo\n\n", key: { code: "KeyO", key: "o", keyCode: 79}},
            { _: "keydown", range: [4,4], value: "heきもo\n\n", key: { code: "KeyN", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [2,4], value: "heきもo\n\n"},
            { _: "input", range: [5,5], value: "heきもｎo\n\n"},
            { _: "keyup", range: [5,5], value: "heきもｎo\n\n", key: { code: "KeyN", key: "n", keyCode: 78}},
            { _: "keydown", range: [5,5], value: "heきもｎo\n\n", key: { code: "KeyO", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [2,5], value: "heきもｎo\n\n"},
            { _: "input", range: [5,5], value: "heきものo\n\n"},
            { _: "keyup", range: [5,5], value: "heきものo\n\n", key: { code: "KeyO", key: "o", keyCode: 79}},
            { _: "keydown", range: [5,5], value: "heきものo\n\n", key: { code: "Space", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [2,5], value: "heきものo\n\n"},
            { _: "input", range: [4,4], value: "he着物o\n\n"},
            { _: "keyup", range: [4,4], value: "he着物o\n\n", key: { code: "Space", key: " ", keyCode: 32}},
            { _: "keydown", range: [4,4], value: "he着物o\n\n", key: { code: "Enter", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [2,4], value: "he着物o\n\n"},
            { _: "input", range: [4,4], value: "he着物o\n\n"},
            function() {
                assert.ok(editor.renderer.$composition);
                assert.ok(textarea.style.fontSize, "1px");
                assert.notOk(/ace_composition/.test(textarea.className));
                assert.ok(/composition_marker/.test(editor.renderer.$markerBack.element.innerHTML));
                assert.notOk(/ace_composition/.test(textarea.className));
                assert.equal(textarea.style.height, "1px");
                assert.equal(textarea.style.top, editor.renderer.lineHeight + 2 + "px");
            },
            { _: "compositionend", range: [4,4], value: "he着物o\n\n"},
            { _: "keydown", range: [4,4], value: "he着物o\n\n", key: { code: "Space", key: "Process", keyCode: 229}},
            { _: "input", range: [5,5], value: "he着物　o\n\n"},
            { _: "keyup", range: [5,5], value: "he着物　o\n\n", key: { code: "Space", key: " ", keyCode: 32}},
            { _: "keydown", range: [5,5], value: "he着物　o\n\n", key: { code: "KeyK", key: "Process", keyCode: 229}},
            { _: "compositionstart", range: [5,5], value: "he着物　o\n\n"},
            { _: "compositionupdate", range: [5,5], value: "he着物　o\n\n"},
            { _: "input", range: [6,6], value: "he着物　ｋo\n\n"},
            { _: "keyup", range: [6,6], value: "he着物　ｋo\n\n", key: { code: "KeyK", key: "k", keyCode: 75}},
            { _: "keydown", range: [6,6], value: "he着物　ｋo\n\n", key: { code: "KeyA", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [5,6], value: "he着物　ｋo\n\n"},
            { _: "input", range: [6,6], value: "he着物　かo\n\n"},
            { _: "keyup", range: [6,6], value: "he着物　かo\n\n", key: { code: "KeyA", key: "a", keyCode: 65}},
            { _: "keydown", range: [6,6], value: "he着物　かo\n\n", key: { code: "KeyT", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [5,6], value: "he着物　かo\n\n"},
            { _: "input", range: [7,7], value: "he着物　かｔo\n\n"},
            { _: "keyup", range: [7,7], value: "he着物　かｔo\n\n", key: { code: "KeyT", key: "t", keyCode: 84}},
            { _: "keydown", range: [7,7], value: "he着物　かｔo\n\n", key: { code: "KeyA", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [5,7], value: "he着物　かｔo\n\n"},
            { _: "input", range: [7,7], value: "he着物　かたo\n\n"},
            { _: "keyup", range: [7,7], value: "he着物　かたo\n\n", key: { code: "KeyA", key: "a", keyCode: 65}},
            { _: "keydown", range: [7,7], value: "he着物　かたo\n\n", key: { code: "KeyN", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [5,7], value: "he着物　かたo\n\n"},
            { _: "input", range: [8,8], value: "he着物　かたｎo\n\n"},
            { _: "keyup", range: [8,8], value: "he着物　かたｎo\n\n", key: { code: "KeyN", key: "n", keyCode: 78}},
            { _: "keydown", range: [8,8], value: "he着物　かたｎo\n\n", key: { code: "KeyA", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [5,8], value: "he着物　かたｎo\n\n"},
            { _: "input", range: [8,8], value: "he着物　かたなo\n\n"},
            { _: "keyup", range: [8,8], value: "he着物　かたなo\n\n", key: { code: "KeyA", key: "a", keyCode: 65}},
            { _: "keydown", range: [8,8], value: "he着物　かたなo\n\n", key: { code: "Space", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [5,8], value: "he着物　かたなo\n\n"},
            { _: "input", range: [6,6], value: "he着物　刀o\n\n"},
            { _: "keyup", range: [6,6], value: "he着物　刀o\n\n", key: { code: "Space", key: " ", keyCode: 32}},
            { _: "keydown", range: [6,6], value: "he着物　刀o\n\n", key: { code: "Space", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [5,6], value: "he着物　刀o\n\n"},
            { _: "input", range: [8,8], value: "he着物　過多なo\n\n"},
            { _: "keyup", range: [8,8], value: "he着物　過多なo\n\n", key: { code: "Space", key: "Process", keyCode: 229}},
            { _: "keydown", range: [8,8], value: "he着物　過多なo\n\n", key: { code: "Space", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [5,8], value: "he着物　過多なo\n\n"},
            { _: "input", range: [8,8], value: "he着物　夥多なo\n\n"},
            { _: "keyup", range: [8,8], value: "he着物　夥多なo\n\n", key: { code: "Space", key: "Process", keyCode: 229}},
            { _: "keydown", range: [8,8], value: "he着物　夥多なo\n\n", key: { code: "Space", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [5,8], value: "he着物　夥多なo\n\n"},
            { _: "input", range: [8,8], value: "he着物　かたなo\n\n"},
            { _: "keyup", range: [8,8], value: "he着物　かたなo\n\n", key: { code: "Space", key: "Process", keyCode: 229}},
            { _: "keydown", range: [8,8], value: "he着物　かたなo\n\n", key: { code: "Space", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [5,8], value: "he着物　かたなo\n\n"},
            { _: "input", range: [8,8], value: "he着物　カタナo\n\n"},
            { _: "keyup", range: [8,8], value: "he着物　カタナo\n\n", key: { code: "Space", key: "Process", keyCode: 229}},
            { _: "keydown", range: [8,8], value: "he着物　カタナo\n\n", key: { code: "Space", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [5,8], value: "he着物　カタナo\n\n"},
            { _: "input", range: [6,6], value: "he着物　刀o\n\n"},
            { _: "keyup", range: [6,6], value: "he着物　刀o\n\n", key: { code: "Space", key: "Process", keyCode: 229}},
            { _: "keydown", range: [6,6], value: "he着物　刀o\n\n", key: { code: "Enter", key: "Process", keyCode: 229}},
            { _: "compositionupdate", range: [5,6], value: "he着物　刀o\n\n"},
            { _: "input", range: [6,6], value: "he着物　刀o\n\n"},
            { _: "compositionend", range: [6,6], value: "he着物　刀o\n\n"}
        ];
        editor.setValue("hello", 1);
        editor.setOption("useTextareaForIME", false);
        data.forEach(function(data) {
            applyEvent(data);
        });
        assert.ok(!editor.renderer.$composition);
        assert.notOk(/ace_composition/.test(textarea.className));
    },
    
    "test: selection synchronization": function() {
        editor.session.setValue("juhu\nkinners\n");
        [
            { _: "keydown", range: [1,1], value: "juhu\n\n", key: { code: "ArrowRight", key: "ArrowRight", keyCode: 39}},
            { _: "keydown", range: [2,2], value: "juhu\n\n", key: { code: "ArrowRight", key: "ArrowRight", keyCode: 39}},
            { _: "keydown", range: [2,2], value: "juhu\n\n", key: { code: "ShiftLeft", key: "Shift", keyCode: 16}, modifier: "shift-"},
            { _: "keydown", range: [2,3], value: "juhu\n\n", key: { code: "ArrowRight", key: "ArrowRight", keyCode: 39}, modifier: "shift-"},
            { _: "keydown", range: [2,4], value: "juhu\n\n", key: { code: "ArrowRight", key: "ArrowRight", keyCode: 39}, modifier: "shift-"},
            { _: "keydown", range: [2,5], value: "juhu\nkinners\n\n", key: { code: "ArrowRight", key: "ArrowRight", keyCode: 39}, modifier: "shift-"},
            { _: "keydown", range: [2,6], value: "juhu\nkinners\n\n", key: { code: "ArrowRight", key: "ArrowRight", keyCode: 39}, modifier: "shift-"},
            { _: "keydown", range: [2,7], value: "juhu\nkinners\n\n", key: { code: "ArrowRight", key: "ArrowRight", keyCode: 39}, modifier: "shift-"},
            { _: "keydown", range: [2,8], value: "juhu\nkinners\n\n", key: { code: "ArrowRight", key: "ArrowRight", keyCode: 39}, modifier: "shift-"},
            { _: "keydown", range: [0,8], value: "kinners\n\n\n", key: { code: "ArrowDown", key: "ArrowDown", keyCode: 40}, modifier: "shift-"},
            { _: "keydown", range: [0,0], value: "\n\n", key: { code: "ArrowDown", key: "ArrowDown", keyCode: 40}},
            { _: "keydown", range: [0,0], value: "\n\n", key: { code: "ShiftLeft", key: "Shift", keyCode: 16}, modifier: "shift-"},
            { _: "keydown", range: [3,8], value: "kinners\n\n\n", key: { code: "ArrowUp", key: "ArrowUp", keyCode: 38}, modifier: "shift-"},
            { _: "keydown", range: [3,12], value: "juhu\nkinners\n\n", key: { code: "ArrowUp", key: "ArrowUp", keyCode: 38}, modifier: "shift-"}
        ].forEach(function(data) {
            applyEvent(data);
        });
        // test overflow
        editor.session.setValue("0123456789".repeat(80));
        editor.execCommand("gotoright");
        editor.execCommand("selectright");
        assert.equal([textarea.value.length, textarea.selectionStart, textarea.selectionEnd].join(","), "402,1,2");
        editor.execCommand("gotolineend");
        assert.equal([textarea.value.length, textarea.selectionStart, textarea.selectionEnd].join(","), "3,0,1");
        editor.execCommand("selectleft");
        assert.equal([textarea.value.length, textarea.selectionStart, textarea.selectionEnd].join(","), "3,0,1");
    },
    
    "test: chinese ime on ie": function() {
        editor.setOption("useTextareaForIME", false);
        [
            { _: "keydown", range: [0,0], value: "\n\n", key: { key: "Backspace", keyCode: 8}},
            { _: "keyup", range: [0,0], value: "\n\n", key: { key: "Backspace", keyCode: 8}},
            { _: "keydown", range: [0,0], value: "\n\n", key: { key: "k", keyCode: 229}},
            { _: "compositionstart", range: [0,0], value: "\n\n"},
            { _: "compositionupdate", range: [1,1], value: "k\n\n"},
            { _: "input", range: [1,1], value: "k\n\n"},
            { _: "keyup", range: [1,1], value: "k\n\n", key: { key: "k", keyCode: 75}},
            { _: "keydown", range: [1,1], value: "k\n\n", key: { key: "i", keyCode: 229}},
            { _: "compositionupdate", range: [2,2], value: "ki\n\n"},
            { _: "input", range: [2,2], value: "ki\n\n"},
            { _: "keyup", range: [2,2], value: "ki\n\n", key: { key: "i", keyCode: 73}},
            { _: "keydown", range: [2,2], value: "ki\n\n", key: { key: "i", keyCode: 229}},
            { _: "compositionupdate", range: [3,3], value: "kii\n\n"},
            { _: "input", range: [3,3], value: "kii\n\n"},
            { _: "keyup", range: [3,3], value: "kii\n\n", key: { key: "i", keyCode: 73}},
            { _: "keydown", range: [3,3], value: "kii\n\n", key: { key: "i", keyCode: 229}},
            { _: "compositionupdate", range: [4,4], value: "kiii\n\n"},
            { _: "input", range: [4,4], value: "kiii\n\n"},
            { _: "keyup", range: [4,4], value: "kiii\n\n", key: { key: "i", keyCode: 73}},
            { _: "keydown", range: [4,4], value: "kiii\n\n", key: { key: "2", keyCode: 229}},
            { _: "compositionupdate", range: [4,4], value: "开iii\n\n"},
            { _: "input", range: [4,4], value: "开iii\n\n"},
            { _: "keyup", range: [4,4], value: "开iii\n\n", key: { key: "2", keyCode: 98}},
            { _: "keydown", range: [4,4], value: "开iii\n\n", key: { key: "Backspace", keyCode: 229}},
            { _: "compositionupdate", range: [3,3], value: "开ii\n\n"},
            { _: "input", range: [3,3], value: "开ii\n\n"},
            { _: "keyup", range: [3,3], value: "开ii\n\n", key: { key: "Backspace", keyCode: 8}},
            { _: "keydown", range: [3,3], value: "开ii\n\n", key: { key: "r", keyCode: 229}},
            { _: "compositionupdate", range: [4,4], value: "开iir\n\n"},
            { _: "input", range: [4,4], value: "开iir\n\n"},
            { _: "keyup", range: [4,4], value: "开iir\n\n", key: { key: "r", keyCode: 82}},
            { _: "keydown", range: [4,4], value: "开iir\n\n", key: { key: "d", keyCode: 229}},
            { _: "compositionupdate", range: [5,5], value: "开iird\n\n"},
            { _: "input", range: [5,5], value: "开iird\n\n"},
            { _: "keyup", range: [5,5], value: "开iird\n\n", key: { key: "d", keyCode: 68}},
            { _: "keydown", range: [5,5], value: "开iird\n\n", key: { key: "Spacebar", keyCode: 229}},
            { _: "compositionend", range: [5,5], value: "开iird\n\n"},
            { _: "keyup", range: [5,5], value: "开iird\n\n", key: { key: "Spacebar", keyCode: 32}},
            { _: "keyup", range: [5,5], value: "开iird\n\n", key: { key: "Spacebar", keyCode: 32}},
            { _: "keydown", range: [5,5], value: "开iird\n\n", key: { key: "i", keyCode: 229}},
            { _: "compositionstart", range: [5,5], value: "开iird\n\n"},
            { _: "compositionupdate", range: [6,6], value: "开iirdi\n\n"},
            { _: "input", range: [6,6], value: "开iirdi\n\n"},
            { _: "keyup", range: [6,6], value: "开iirdi\n\n", key: { key: "i", keyCode: 73}},
            { _: "keydown", range: [6,6], value: "开iirdi\n\n", key: { key: "i", keyCode: 229}},
            { _: "compositionupdate", range: [7,7], value: "开iirdii\n\n"},
            { _: "input", range: [7,7], value: "开iirdii\n\n"},
            { _: "keyup", range: [7,7], value: "开iirdii\n\n", key: { key: "i", keyCode: 73}},
            { _: "keydown", range: [7,7], value: "开iirdii\n\n", key: { key: "Backspace", keyCode: 229}},
            { _: "compositionupdate", range: [6,6], value: "开iirdi\n\n"},
            { _: "input", range: [6,6], value: "开iirdi\n\n"},
            { _: "keyup", range: [6,6], value: "开iirdi\n\n", key: { key: "Backspace", keyCode: 8}},
            { _: "keydown", range: [6,6], value: "开iirdi\n\n", key: { key: "r", keyCode: 229}},
            { _: "compositionupdate", range: [7,7], value: "开iirdir\n\n"},
            { _: "input", range: [7,7], value: "开iirdir\n\n"},
            { _: "keyup", range: [7,7], value: "开iirdir\n\n", key: { key: "r", keyCode: 82}},
            { _: "keydown", range: [7,7], value: "开iirdir\n\n", key: { key: "e", keyCode: 229}},
            { _: "compositionupdate", range: [8,8], value: "开iirdire\n\n"},
            { _: "input", range: [8,8], value: "开iirdire\n\n"},
            { _: "keyup", range: [8,8], value: "开iirdire\n\n", key: { key: "e", keyCode: 69}},
            { _: "keydown", range: [8,8], value: "开iirdire\n\n", key: { key: "Backspace", keyCode: 229}},
            { _: "compositionupdate", range: [7,7], value: "开iirdir\n\n"},
            { _: "input", range: [7,7], value: "开iirdir\n\n"},
            { _: "keyup", range: [7,7], value: "开iirdir\n\n", key: { key: "Backspace", keyCode: 8}},
            { _: "keydown", range: [7,7], value: "开iirdir\n\n", key: { key: "Backspace", keyCode: 229}},
            { _: "compositionupdate", range: [6,6], value: "开iirdi\n\n"},
            { _: "input", range: [6,6], value: "开iirdi\n\n"},
            { _: "keyup", range: [6,6], value: "开iirdi\n\n", key: { key: "Backspace", keyCode: 8}},
            { _: "keydown", range: [6,6], value: "开iirdi\n\n", key: { key: "Backspace", keyCode: 229}},
            { _: "compositionend", range: [5,5], value: "开iird\n\n"},
            { _: "input", range: [5,5], value: "开iird\n\n"},
            { _: "keyup", range: [5,5], value: "开iird\n\n", key: { key: "Backspace", keyCode: 8}},
            { _: "keyup", range: [5,5], value: "开iird\n\n", key: { key: "Backspace", keyCode: 8}},
            { _: "keydown", range: [5,5], value: "开iird\n\n", key: { key: "d", keyCode: 229}},
            { _: "compositionstart", range: [5,5], value: "开iird\n\n"},
            { _: "compositionupdate", range: [6,6], value: "开iirdd\n\n"},
            { _: "input", range: [6,6], value: "开iirdd\n\n"},
            { _: "keyup", range: [6,6], value: "开iirdd\n\n", key: { key: "d", keyCode: 68}},
            { _: "keydown", range: [6,6], value: "开iirdd\n\n", key: { key: "d", keyCode: 229}},
            { _: "compositionupdate", range: [7,7], value: "开iirddd\n\n"},
            { _: "input", range: [7,7], value: "开iirddd\n\n"},
            { _: "keyup", range: [7,7], value: "开iirddd\n\n", key: { key: "d", keyCode: 68}},
            { _: "keydown", range: [7,7], value: "开iirddd\n\n", key: { key: "d", keyCode: 229}},
            { _: "compositionupdate", range: [8,8], value: "开iirdddd\n\n"},
            { _: "input", range: [8,8], value: "开iirdddd\n\n"},
            { _: "keyup", range: [8,8], value: "开iirdddd\n\n", key: { key: "d", keyCode: 68}},
            { _: "keydown", range: [8,8], value: "开iirdddd\n\n", key: { key: "d", keyCode: 229}},
            { _: "compositionupdate", range: [9,9], value: "开iirddddd\n\n"},
            { _: "input", range: [9,9], value: "开iirddddd\n\n"},
            { _: "keyup", range: [9,9], value: "开iirddddd\n\n", key: { key: "d", keyCode: 68}},
            { _: "keydown", range: [9,9], value: "开iirddddd\n\n", key: { key: "d", keyCode: 229}},
            { _: "compositionupdate", range: [10,10], value: "开iirdddddd\n\n"},
            { _: "input", range: [10,10], value: "开iirdddddd\n\n"},
            { _: "keyup", range: [10,10], value: "开iirdddddd\n\n", key: { key: "d", keyCode: 68}},
            { _: "keydown", range: [10,10], value: "开iirdddddd\n\n", key: { key: "d", keyCode: 229}},
            { _: "compositionupdate", range: [11,11], value: "开iird大大dddd\n\n"},
            { _: "input", range: [11,11], value: "开iird大大dddd\n\n"},
            { _: "keyup", range: [11,11], value: "开iird大大dddd\n\n", key: { key: "d", keyCode: 68}},
            { _: "keydown", range: [11,11], value: "开iird大大dddd\n\n", key: { key: "1", keyCode: 229}},
            { _: "compositionupdate", range: [11,11], value: "开iird大大得到当地\n\n"},
            { _: "input", range: [11,11], value: "开iird大大得到当地\n\n"},
            { _: "keyup", range: [11,11], value: "开iird大大得到当地\n\n", key: { key: "1", keyCode: 97}},
            { _: "keydown", range: [11,11], value: "开iird大大得到当地\n\n", key: { key: "Esc", keyCode: 229}},
            function() {
                assert.equal(editor.getValue(), "开iird大大得到当地");
            },
            { _: "compositionend", range: [5,5], value: "开iird\n\n"},
            { _: "input", range: [5,5], value: "开iird\n\n"},
            { _: "keyup", range: [5,5], value: "开iird\n\n", key: { key: "Esc", keyCode: 27}},
            { _: "keyup", range: [5,5], value: "开iird\n\n", key: { key: "Esc", keyCode: 27}},
            { _: "keydown", range: [5,5], value: "开iird\n\n", key: { key: "Esc", keyCode: 27}},
            { _: "keypress", range: [2,2], value: "\n\n", key: { key: "Esc", keyCode: 27}}/*,
            { _: "keyup", range: [4,4], value: "\n\n", key: { key: "Esc", keyCode: 27}},
            { _: "keydown", range: [4,4], value: "\n\n", key: { key: "4", keyCode: 229}},
            { _: "compositionstart", range: [4,4], value: "\n\n"},
            { _: "compositionend", range: [1,1], value: "4\n\n"},
            { _: "input", range: [1,1], value: "4\n\n"},
            { _: "keyup", range: [1,1], value: "4\n\n", key: { key: "4", keyCode: 100}},
            { _: "keyup", range: [1,1], value: "4\n\n", key: { key: "4", keyCode: 100}},*/

        ].forEach(function(data, i) {
             
            applyEvent(data);
        });
        assert.equal(editor.getValue(), "开iird");
    },
    /*
{ _: "keydown", range: [0,0], value: "\n\n", key: { key: "Backspace", keyCode: 8}},
{ _: "keyup", range: [0,0], value: "\n\n", key: { key: "Backspace", keyCode: 8}},
{ _: "keydown", range: [0,0], value: "\n\n", key: { key: "a", keyCode: 229}},
{ _: "compositionstart", range: [0,0], value: "\n\n"},
{ _: "compositionupdate", range: [1,1], value: "a\n\n"},
{ _: "input", range: [1,1], value: "a\n\n"},
{ _: "keyup", range: [1,1], value: "a\n\n", key: { key: "a", keyCode: 65}},
{ _: "keydown", range: [1,1], value: "a\n\n", key: { key: "s", keyCode: 229}},
{ _: "compositionupdate", range: [2,2], value: "as\n\n"},
{ _: "input", range: [2,2], value: "as\n\n"},
{ _: "keyup", range: [2,2], value: "as\n\n", key: { key: "s", keyCode: 83}},
{ _: "keydown", range: [2,2], value: "as\n\n", key: { key: "d", keyCode: 229}},
{ _: "compositionupdate", range: [3,3], value: "asd\n\n"},
{ _: "input", range: [3,3], value: "asd\n\n"},
{ _: "keyup", range: [3,3], value: "asd\n\n", key: { key: "d", keyCode: 68}},
{ _: "keydown", range: [3,3], value: "asd\n\n", key: { key: "1", keyCode: 229}},
{ _: "compositionupdate", range: [3,3], value: "阿苏大\n\n"},
{ _: "input", range: [3,3], value: "阿苏大\n\n"},
{ _: "keyup", range: [3,3], value: "阿苏大\n\n", key: { key: "1", keyCode: 97}},
{ _: "keydown", range: [3,3], value: "阿苏大\n\n", key: { key: "d", keyCode: 229}},
{ _: "compositionupdate", range: [4,4], value: "阿苏大d\n\n"},
{ _: "input", range: [4,4], value: "阿苏大d\n\n"},
{ _: "keyup", range: [4,4], value: "阿苏大d\n\n", key: { key: "d", keyCode: 68}},
{ _: "keydown", range: [4,4], value: "阿苏大d\n\n", key: { key: "a", keyCode: 229}},
{ _: "compositionupdate", range: [5,5], value: "阿苏大da\n\n"},
{ _: "input", range: [5,5], value: "阿苏大da\n\n"},
{ _: "keyup", range: [5,5], value: "阿苏大da\n\n", key: { key: "a", keyCode: 65}},
{ _: "keydown", range: [5,5], value: "阿苏大da\n\n", key: { key: "s", keyCode: 229}},
{ _: "compositionupdate", range: [6,6], value: "阿苏大das\n\n"},
{ _: "input", range: [6,6], value: "阿苏大das\n\n"},
{ _: "keyup", range: [6,6], value: "阿苏大das\n\n", key: { key: "s", keyCode: 83}},
{ _: "keydown", range: [6,6], value: "阿苏大das\n\n", key: { key: "d", keyCode: 229}},
{ _: "compositionupdate", range: [7,7], value: "阿苏大dasd\n\n"},
{ _: "input", range: [7,7], value: "阿苏大dasd\n\n"},
{ _: "keyup", range: [7,7], value: "阿苏大dasd\n\n", key: { key: "d", keyCode: 68}},
{ _: "keydown", range: [7,7], value: "阿苏大dasd\n\n", key: { key: "2", keyCode: 229}},
{ _: "compositionupdate", range: [6,6], value: "阿苏大大蒜d\n\n"},
{ _: "input", range: [6,6], value: "阿苏大大蒜d\n\n"},
{ _: "keyup", range: [6,6], value: "阿苏大大蒜d\n\n", key: { key: "2", keyCode: 98}},
{ _: "compositionupdate", range: [6,6], value: "阿苏大大蒜的\n\n"},
{ _: "compositionend", range: [6,6], value: "阿苏大大蒜的\n\n"},
{ _: "input", range: [6,6], value: "阿苏大大蒜的\n\n"},
    
    
    */
    "test: contextmenu": function() {
        var value = "juhu\nkinners\n";
        editor.setValue(value);
        editor.execCommand("gotoright");
        editor.resize(true);
        var target = editor.renderer.getMouseEventTarget();
        
        // select all
        textarea.setSelectionRange(0, 1000);
        textarea.dispatchEvent(new CustomEvent("select"));
        assert.ok(editor.getSelectedText(), value);
        
        // delete
        target.dispatchEvent(MouseEvent("down", {x: 0, y: 0, button: 2}));
        target.dispatchEvent(new CustomEvent("contextmenu"));
        textarea.value = textarea.value.slice(textarea.selectionEnd);
        textarea.setSelectionRange(0, 0);
        textarea.dispatchEvent(new CustomEvent("input"));        
        assert.equal(editor.getValue(), "");
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
