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
    require("./test/mockdom");
}

define(function(require, exports, module) {
"use strict";

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
    }
};
});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
