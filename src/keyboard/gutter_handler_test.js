if (typeof process !== "undefined") {
    require("amd-loader");
    require("../test/mockdom");
}

var keys = require('../lib/keys');

"use strict";

require("../multi_select");
require("../theme/textmate");
var Editor = require("../editor").Editor;
var Mode = require("../mode/java").Mode;
var VirtualRenderer = require("../virtual_renderer").VirtualRenderer;
var assert = require("../test/assertions");

function emit(keyCode, shift) {
    var data = {bubbles: true, cancelable: true};
    data.keyCode = keyCode;
    data.which = data.keyCode;
    data.shiftKey = shift;
    data.ctrlKey = false;
    data.altKey = false;

    var event = new KeyboardEvent("keydown", data);

    var el = document.activeElement;
    el.dispatchEvent(event);
}

var editor;

module.exports = {
    setUp : function(next) {
        this.editor = new Editor(new VirtualRenderer());
        this.editor.container.style.position = "absolute";
        this.editor.container.style.height = "500px";
        this.editor.container.style.width = "500px";
        this.editor.container.style.left = "50px";
        this.editor.container.style.top = "10px";
        document.body.appendChild(this.editor.container);
        editor = this.editor;
        next();
    },
    /* TO DO; fix test
    "test: keyboard code folding" : function() {
        var editor = this.editor;
        var value = "x {" + "\n".repeat(50) + "}\n";
        value = value.repeat(50);
        editor.session.setMode(new Mode());
        editor.setValue(value, -1);
        editor.setOption("enableKeyboardAccessibility", true);
        editor.renderer.$loop._flush();

        var lines = editor.renderer.$gutterLayer.$lines;
        var toggler = lines.cells[0].element.children[1];

        // Set focus to the gutter div.
        editor.renderer.$gutter.focus();
        assert.equal(document.activeElement, editor.renderer.$gutter);

        // Focus on the fold widget.
        emit(keys["enter"], false);
        
        setTimeout(function() {
            assert.equal(document.activeElement, lines.cells[0].element.childNodes[1]);
    
            // Click the fold the widget.
            emit(keys["enter"], false);

            setTimeout(function() {
                // Check that code is folded.
                editor.renderer.$loop._flush();
                assert.ok(/ace_closed/.test(toggler.className));
                assert.equal(lines.cells[1].element.textContent, "52");
            }, 20);
        }, 20);
    },
    */
    "test: keyboard annotation" : function() {
        var editor = this.editor;
        var value = "x {" + "\n".repeat(50) + "}\n";
        value = value.repeat(50);
        editor.session.setMode(new Mode());
        editor.setOption("enableKeyboardAccessibility", true);
        editor.setValue(value, -1);
        editor.session.setAnnotations([{row: 0, column: 0, text: "error test", type: "error"}]);
        editor.renderer.$loop._flush();

        var lines = editor.renderer.$gutterLayer.$lines;

        // Set focus to the gutter div.
        editor.renderer.$gutter.focus();
        assert.equal(document.activeElement, editor.renderer.$gutter);

        // Focus on the annotation.
        emit(keys["enter"], false);
        
        setTimeout(function() {
            emit(keys["left"], false);
            assert.equal(document.activeElement, lines.cells[0].element.childNodes[2]);

            // Click annotation.
            emit(keys["enter"], false);
            
            setTimeout(function() {
                // Check annotation is rendered.
                editor.renderer.$loop._flush();
                var tooltip = editor.container.querySelector(".ace_tooltip");
                assert.ok(/error test/.test(tooltip.textContent));
            }, 20);
        }, 20);
    },
    
    tearDown : function() {
        this.editor.destroy();
        document.body.removeChild(this.editor.container);
    }
};

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
