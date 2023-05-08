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

function emit(keyCode) {
    var data = {bubbles: true, keyCode};
    var event = new KeyboardEvent("keydown", data);

    var el = document.activeElement;
    el.dispatchEvent(event);
}

module.exports = {
    setUp : function(done) {
        this.editor = new Editor(new VirtualRenderer());
        this.editor.container.style.position = "absolute";
        this.editor.container.style.height = "500px";
        this.editor.container.style.width = "500px";
        this.editor.container.style.left = "50px";
        this.editor.container.style.top = "10px";
        document.body.appendChild(this.editor.container);
        done();
    },
    "test: keyboard code folding: basic functionality" : function(done) {
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
        emit(keys["enter"]);

        setTimeout(function() {
            assert.equal(document.activeElement, lines.cells[0].element.childNodes[1]);

            // Click the fold widget.
            emit(keys["enter"]);

            setTimeout(function() {
                // Check that code is folded.
                editor.renderer.$loop._flush();
                assert.ok(/ace_closed/.test(toggler.className));
                assert.equal(lines.cells[1].element.textContent, "52");

                // After escape focus should be back to the gutter.
                emit(keys["escape"]);
                assert.equal(document.activeElement, editor.renderer.$gutter);

                done();
            }, 20);
        }, 20);
    },
    "test: keyboard code folding: multiple folds" : function(done) {
        var editor = this.editor;
        var value = "\n x {" + "\n".repeat(5) + "}\n";
        value = value.repeat(50);
        editor.session.setMode(new Mode());
        editor.setValue(value, -1);
        editor.setOption("enableKeyboardAccessibility", true);
        editor.renderer.$loop._flush();

        var lines = editor.renderer.$gutterLayer.$lines;
  
        // Set focus to the gutter div.
        editor.renderer.$gutter.focus();
        assert.equal(document.activeElement, editor.renderer.$gutter);

        assert.equal(lines.cells[2].element.textContent, "3");

        // Focus on the fold widgets.
        emit(keys["enter"]);

        setTimeout(function() {
            assert.equal(document.activeElement, lines.cells[1].element.childNodes[1]);

            // Click the first fold widget.
            emit(keys["enter"]);

            setTimeout(function() {
                // Check that code is folded.
                editor.renderer.$loop._flush();
                assert.equal(lines.cells[2].element.textContent, "8");

                // Move to the next fold widget.
                emit(keys["down"]);
                assert.equal(document.activeElement, lines.cells[3].element.childNodes[1]);
                assert.equal(lines.cells[4].element.textContent, "10");

                // Click the fold widget.
                emit(keys["enter"]);

                setTimeout(function() {
                    // Check that code is folded.
                    assert.equal(lines.cells[4].element.textContent, "15");

                    // Move back up one fold widget.
                    emit(keys["up"]);
                    assert.equal(document.activeElement, lines.cells[1].element.childNodes[1]);

                    done();
                }, 20);
            }, 20);
        }, 20);
    },
    "test: keyboard annotation: basic functionality" : function(done) {
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
        emit(keys["enter"]);
        
        setTimeout(function() {
            emit(keys["left"]);
            assert.equal(document.activeElement, lines.cells[0].element.childNodes[2]);

            // Click annotation.
            emit(keys["enter"]);
            
            setTimeout(function() {
                // Check annotation is rendered.
                editor.renderer.$loop._flush();
                var tooltip = editor.container.querySelector(".ace_tooltip");
                assert.ok(/error test/.test(tooltip.textContent));

                // Press escape to dismiss the tooltip.
                emit(keys["escape"]);

                // After escape again focus should be back to the gutter.
                emit(keys["escape"]);
                assert.equal(document.activeElement, editor.renderer.$gutter);

                done();
            }, 20);
        }, 20);
    },"test: keyboard annotation: multiple annotations" : function(done) {
        var editor = this.editor;
        var value = "x {" + "\n".repeat(50) + "}\n";
        value = value.repeat(50);
        editor.session.setMode(new Mode());
        editor.setOption("enableKeyboardAccessibility", true);
        editor.setValue(value, -1);
        editor.session.setAnnotations([
            {row: 1, column: 0, text: "error test", type: "error"},
            {row: 2, column: 0, text: "warning test", type: "warning"}
        ]);
        editor.renderer.$loop._flush();

        var lines = editor.renderer.$gutterLayer.$lines;

        // Set focus to the gutter div.
        editor.renderer.$gutter.focus();
        assert.equal(document.activeElement, editor.renderer.$gutter);

        // Focus on the annotation.
        emit(keys["enter"]);
        
        setTimeout(function() {
            emit(keys["left"]);
            assert.equal(document.activeElement, lines.cells[1].element.childNodes[2]);

            // Click annotation.
            emit(keys["enter"]);
            
            setTimeout(function() {
                // Check annotation is rendered.
                editor.renderer.$loop._flush();
                var tooltip = editor.container.querySelector(".ace_tooltip");
                assert.ok(/error test/.test(tooltip.textContent));

                // Press escape to dismiss the tooltip.
                emit(keys["escape"]);

                // Press down to move to next annotation.
                emit(keys["down"]);
                assert.equal(document.activeElement, lines.cells[2].element.childNodes[2]);

                // Click annotation.
                emit(keys["enter"]);

                setTimeout(function() {
                    // Check annotation is rendered.
                    editor.renderer.$loop._flush();
                    var tooltip = editor.container.querySelector(".ace_tooltip");
                    assert.ok(/warning test/.test(tooltip.textContent));

                    // Press escape to dismiss the tooltip.
                    emit(keys["escape"]);

                    // Move back up one annotation.
                    emit(keys["up"]);
                    assert.equal(document.activeElement, lines.cells[1].element.childNodes[2]);

                    // Move back to the folds, focus should be on the fold on line 1.
                    emit(keys["right"]);
                    assert.equal(document.activeElement, lines.cells[0].element.childNodes[1]);

                    done();
                }, 20);
            }, 20);
        }, 20);
    },"test: keyboard annotation: no folds" : function(done) {
        var editor = this.editor;
        var value = "x\n";
        value = value.repeat(50);
        editor.session.setMode(new Mode());
        editor.setOption("enableKeyboardAccessibility", true);
        editor.setValue(value, -1);
        editor.session.setAnnotations([{row: 1, column: 0, text: "error test", type: "error"}]);
        editor.renderer.$loop._flush();

        var lines = editor.renderer.$gutterLayer.$lines;

        // Set focus to the gutter div.
        editor.renderer.$gutter.focus();
        assert.equal(document.activeElement, editor.renderer.$gutter);

        // Focus on gutter interaction.
        emit(keys["enter"]);
        
        setTimeout(function() {
            // Focus should be on the annotation directly.
            assert.equal(document.activeElement, lines.cells[1].element.childNodes[2]);
            done();
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
