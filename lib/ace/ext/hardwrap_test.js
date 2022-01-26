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
}

define(function(require, exports, module) {
"use strict";

var assert = require("./../test/assertions");
require("./../test/mockdom");
var ace = require("../ace");
var hardWrap = require("./hardwrap").hardWrap;
var editor;

module.exports = {
    setUp: function() {
        if (!editor) {
            editor = ace.edit(null);
        }
        editor.focus();
    },
    tearDown: function() {
        if (editor) {
            editor.destroy();
            editor.container.remove();
            editor = null;
        }
    },
    "test: split lines": function() {
        editor.setValue("line 1 longword line 2");
        hardWrap(editor, {column: 12, startRow: 0, endRow: 2});
        assert.equal(editor.getValue(), "line 1\nlongword\nline 2");
        
        editor.setValue("line1longword line 2");
        hardWrap(editor, {column: 12, startRow: 0, endRow: 2});
        assert.equal(editor.getValue(), "line1longword\nline 2");
        
        editor.setValue("line1longword    ");
        hardWrap(editor, {column: 12, startRow: 0, endRow: 2});
        assert.equal(editor.getValue(), "line1longword\n");
        
        editor.setValue("line 1               line 2");
        hardWrap(editor, {column: 12, startRow: 0, endRow: 2});
        assert.equal(editor.getValue(), "line 1\nline 2");
        
        editor.setValue("line 1  line 2");
        hardWrap(editor, {column: 6, startRow: 0, endRow: 2});
        assert.equal(editor.getValue(), "line 1\nline 2");
        
        editor.setValue("line 1");
        hardWrap(editor, {column: 10, startRow: 0, endRow: 2});
        assert.equal(editor.getValue(), "line 1");
    },
    
    "test: merge lines": function() {
        editor.setValue("line \n \t 1   \nlongword\nline \n 2");
        hardWrap(editor, {column: 12, startRow: 0, endRow: 4});
        assert.equal(editor.getValue(), "line 1\nlongword\nline 2");
        
        editor.setValue("line \n 1 \n longword \n line \n2 a longer line");
        hardWrap(editor, {column: 12, startRow: 0, endRow: 4, allowMerge: false});
        assert.equal(editor.getValue(), "line \n 1 \n longword \n line \n2 a longer\nline");
    },

    "test: keep indentation": function() {
        var value = "hello\n    long long text\n unchanged next line";
        editor.setValue(value);
        hardWrap(editor, {column: 12, startRow: 1, endRow: 1});
        assert.equal(editor.getValue(), "hello\n    long\n    long\n    text\n unchanged next line");
        hardWrap(editor, {column: 80, startRow: 1, endRow: 3});
        assert.equal(editor.getValue(), value);
    },

    "test: wrap as you type": function() {
        editor.setValue("hello\n    long long text\n unchanged next line", -1);
        editor.execCommand("golinedown");
        editor.execCommand("gotolineend");
        editor.execCommand("insertstring", " ");
        editor.execCommand("insertstring", "t");
        assert.equal(editor.session.getLine(1), "    long long text t");
        editor.setOptions({printMargin: 12, hardWrap: true});
        editor.execCommand("insertstring", " ");
        assert.equal(editor.session.getLine(1), "    long long text t ");
        editor.execCommand("insertstring", "x");
        assert.equal(editor.getValue(), "hello\n    long\n    long\n    text t x\n unchanged next line");
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
