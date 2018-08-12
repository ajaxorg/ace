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
require("./ext/language_tools");

module.exports = {
   "test: highlighting in the popup" : function(done) {
        var editor = ace.edit(null, {
            value: "\narraysort alooooooooooooooooooooooooooooong_word",
            maxLines: 10,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        });
      //   editor.container.style.width = "500px";
       //  editor.container.style.height = "500px";
        document.body.appendChild(editor.container);
        assert.ok(!editor.container.querySelector("style"));
        
        // workaround for autocomplete using non-relative path
        editor.renderer.$themeId = "./theme/textmate";
        
        editor.execCommand("insertstring", "a");
        checkInnerHTML('<d "ace_line ace_selected"><s "ace_completion-highlight">a</s><s "ace_">rraysort</s><s "ace_completion-meta">local</s></d><d "ace_line"><s "ace_completion-highlight">a</s><s "ace_">looooooooooooooooooooooooooooong_word</s><s "ace_completion-meta">local</s></d>', function() {
            editor.execCommand("insertstring", "rr");
            checkInnerHTML('<d "ace_line ace_selected"><s "ace_completion-highlight">arr</s><s "ace_">aysort</s><s "ace_completion-meta">local</s></d>', function() {
                editor.execCommand("insertstring", "r");
                checkInnerHTML('<d "ace_line ace_selected"><s "ace_completion-highlight">arr</s><s "ace_">ayso</s><s "ace_completion-highlight">r</s><s "ace_">t</s><s "ace_completion-meta">local</s></d>', function() {
                    
                    editor.onCommandKey(null, 0, 13);
                    assert.equal(editor.getValue(), "arraysort\narraysort alooooooooooooooooooooooooooooong_word");
                    editor.execCommand("insertstring", " looooooooooooooooooooooooooooong_");
                    checkInnerHTML('<d "ace_line ace_selected"><s "ace_">a</s><s "ace_completion-highlight">looooooooooooooooooooooooooooong_</s><s "ace_">word</s><s "ace_completion-meta">local</s></d>', function() {
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
    }
};
});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
