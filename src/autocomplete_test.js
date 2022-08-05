if (typeof process !== "undefined") {
    require("amd-loader");
    require("./test/mockdom");
}

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

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
