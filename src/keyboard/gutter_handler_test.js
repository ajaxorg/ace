if (typeof process !== "undefined") {
    require("amd-loader");
    require("../test/mockdom");
}

"use strict";
 
require("../multi_select");
require("../theme/textmate");
var user = require("../test/user");
var Editor = require("../editor").Editor;
var Mode = require("../mode/java").Mode;
var VirtualRenderer = require("../virtual_renderer").VirtualRenderer;
var assert = require("../test/assertions");

function findVisibleTooltip() {
    const tooltips = document.body.querySelectorAll(".ace_gutter-tooltip");
    for (let i = 0; i < tooltips.length; i++) {
        if (window.getComputedStyle(tooltips[i]).display === "block") {
            return tooltips[i];
        }
    }
    return null;
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
        var toggler = lines.cells[0].element.querySelector(".ace_fold-widget");

        // Set focus to the gutter div.
        editor.renderer.$gutter.focus();
        assert.equal(document.activeElement, editor.renderer.$gutter);

        // Focus on the fold widget.
        user.type("Enter");

        setTimeout(function() {
            assert.equal(document.activeElement, lines.cells[0].element.childNodes[1]);

            // Click the fold widget.
            user.type("Enter");

            setTimeout(function() {
                // Check that code is folded.
                editor.renderer.$loop._flush();
                assert.ok(/ace_closed/.test(toggler.className));
                assert.equal(lines.cells[1].element.textContent, "52");

                // After escape focus should be back to the gutter.
                user.type("Escape");
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
        user.type("Enter");

        setTimeout(function() {
            assert.equal(document.activeElement, lines.cells[1].element.childNodes[1]);

            // Click the first fold widget.
            user.type("Enter");

            setTimeout(function() {
                // Check that code is folded.
                editor.renderer.$loop._flush();
                assert.equal(lines.cells[2].element.textContent, "8");

                // Move to the next fold widget.
                user.type("Down");
                assert.equal(document.activeElement, lines.cells[3].element.childNodes[1]);
                assert.equal(lines.cells[4].element.textContent, "10");

                // Click the fold widget.
                user.type("Enter");

                setTimeout(function() {
                    // Check that code is folded.
                    assert.equal(lines.cells[4].element.textContent, "15");

                    // Move back up one fold widget.
                    user.type("Up");
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
        user.type("Enter");
        
        setTimeout(function() {
            user.type("Left");
            assert.equal(document.activeElement, lines.cells[0].element.childNodes[2]);

            // Click annotation.
            user.type("Enter");

            setTimeout(function() {
                // Check annotation is rendered.
                editor.renderer.$loop._flush();
                var tooltip = findVisibleTooltip();
                assert.ok(/error test/.test(tooltip.textContent));

                // Press escape to dismiss the tooltip.
                user.type("Escape");

                // After escape again focus should be back to the gutter.
                user.type("Escape");
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
        user.type("Enter");
        
        setTimeout(function() {
            user.type("Left");
            assert.equal(document.activeElement, lines.cells[1].element.childNodes[2]);

            // Click annotation.
            user.type("Enter");
            
            setTimeout(function() {
                // Check annotation is rendered.
                editor.renderer.$loop._flush();
                var tooltip = findVisibleTooltip();
                assert.ok(/error test/.test(tooltip.textContent));

                // Press escape to dismiss the tooltip.
                user.type("Escape");

                // Press down to move to next annotation.
                user.type("Down");
                assert.equal(document.activeElement, lines.cells[2].element.childNodes[2]);

                // Click annotation.
                user.type("Enter");

                setTimeout(function() {
                    // Check annotation is rendered.
                    editor.renderer.$loop._flush();
                    var tooltip = findVisibleTooltip();
                    assert.ok(/warning test/.test(tooltip.textContent));

                    // Press escape to dismiss the tooltip.
                    user.type("Escape");

                    // Move back up one annotation.
                    user.type("Up");
                    assert.equal(document.activeElement, lines.cells[1].element.childNodes[2]);

                    // Move back to the folds, focus should be on the fold on line 1.
                    user.type("Right");
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
        user.type("Enter");
        
        setTimeout(function() {
            // Focus should be on the annotation directly.
            assert.equal(document.activeElement, lines.cells[1].element.childNodes[2]);
            done();
        }, 20);
    },
    "test: aria attributes mode with getFoldWidgetRange" : function() {
        var editor = this.editor;
        var value = "x {" + "\n".repeat(5) + "}";
        editor.session.setMode(new Mode());
        editor.setOption("enableKeyboardAccessibility", true);
        editor.setValue(value, -1);
        editor.renderer.$loop._flush();

        var lines = editor.renderer.$gutterLayer.$lines;
        var toggler = lines.cells[0].element.querySelector(".ace_fold-widget");

        assert.equal(toggler.getAttribute("aria-label"), "Toggle code folding, rows 1 through 6");
        assert.equal(toggler.getAttribute("aria-expanded"), "true");
        assert.equal(toggler.getAttribute("title"), "Fold code");

        editor.session.$toggleFoldWidget(0, {});
        editor.renderer.$loop._flush();

        assert.equal(toggler.getAttribute("aria-label"), "Toggle code folding, rows 1 through 6");
        assert.equal(toggler.getAttribute("aria-expanded"), "false");
        assert.equal(toggler.getAttribute("title"), "Unfold code");    
    },
    "test: aria attributes mode without getFoldWidgetRange" : function() {
        var editor = this.editor;
        var value = "x {" + "\n".repeat(5) + "}";
        var mode = new Mode();
        mode.foldingRules.getFoldWidgetRange = function(session, foldStyle, row) {
            return null;
        };
        editor.session.setMode(mode);
        editor.setOption("enableKeyboardAccessibility", true);
        editor.setValue(value, -1);
        editor.renderer.$loop._flush();

        var lines = editor.renderer.$gutterLayer.$lines;
        var toggler = lines.cells[0].element.querySelector(".ace_fold-widget");

        assert.equal(toggler.getAttribute("aria-label"), "Toggle code folding, row 1");
        assert.equal(toggler.getAttribute("aria-expanded"), "true");
        assert.equal(toggler.getAttribute("title"), "Fold code"); 
    },
    "test: should signal keyboard event" : function(done) {
        var editor = this.editor;
        var value = "x {" + "\n".repeat(50) + "}\n";
        value = value.repeat(50);
        editor.session.setMode(new Mode());
        editor.setOption("enableKeyboardAccessibility", true);
        editor.setValue(value, -1);
        editor.session.setAnnotations([{row: 0, column: 0, text: "error test", type: "error"}]);

        var row, isAnnotation, isFold, key;
        editor.on("gutterkeydown", function(event) {
            row = event.getRow();
            isAnnotation = event.isInAnnotationLane();
            isFold = event.isInFoldLane();
            key = event.getKey();
        });

        editor.renderer.$loop._flush();

        var lines = editor.renderer.$gutterLayer.$lines;

        // Set focus to the gutter div.
        editor.renderer.$gutter.focus();
        assert.equal(document.activeElement, editor.renderer.$gutter);

        // Focus on the annotation.
        user.type("Enter");
        
        setTimeout(function() {
            user.type("Left");
            assert.equal(document.activeElement, lines.cells[0].element.childNodes[2]);
            
            setTimeout(function() {
                assert.equal(row, 0);
                assert.equal(isAnnotation, true);
                assert.equal(isFold, false);
                assert.equal(key, "left");
                done();
            }, 20);
        }, 20);
    },
    "test: switching lanes with the custom widget should work" : function(done) {
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

        editor.renderer.$gutterLayer.$addCustomWidget(1, {
            className: "ace_users_css",
            label: "Open_label",
            title: "Open_title",
        });

        // Focus on the annotation.
        user.type("Enter");
        
        setTimeout(function() {
            user.type("Left");
            assert.equal(document.activeElement, lines.cells[1].element.childNodes[2]);

            // Click annotation.
            user.type("Enter");
            
            setTimeout(function() {
                // Check annotation is rendered.
                editor.renderer.$loop._flush();
                var tooltip = findVisibleTooltip();
                assert.ok(/error test/.test(tooltip.textContent));

                // Press escape to dismiss the tooltip.
                user.type("Escape");

                // Switch lane move to custom widget 
                user.type("Right");
                assert.equal(document.activeElement, lines.cells[1].element.childNodes[3]);

                // Move back to the annotations, focus should be on the annotation on line 1.
                user.type("Left");
                assert.equal(document.activeElement, lines.cells[1].element.childNodes[2]);    
                done();
            }, 20);
        }, 20);
    }, 
    "test: moving up and down to custom widget and checking onclick callback as well" : function(done) {
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

        let firstCallbackCalledCount=0;
        const firstCallback = (e) =>{ 
            firstCallbackCalledCount++;
            e.stopPropagation();
        };

        editor.renderer.$gutterLayer.$addCustomWidget(2, {
            className: "ace_users_css",
            label: "Open_label",
            title: "Open_title",
            callbacks: {
                onClick: firstCallback
            }
        });

        // Focus on the fold widgets.
        user.type("Enter");

        setTimeout(function() {
            assert.equal(document.activeElement, lines.cells[1].element.childNodes[1]);

            // Move down to the custom widget.
            user.type("Down");
            assert.equal(document.activeElement, lines.cells[2].element.childNodes[3]);

            user.type("Enter");
            assert.equal(firstCallbackCalledCount,1);
            
            // Move up to the previous fold widget.
            user.type("Up");
            assert.equal(document.activeElement, lines.cells[1].element.childNodes[1]);
            done();
        }, 20);
    },
    "test: add several custom widgets" : function() {
        var editor = this.editor;
        var value = "x {" + "\n".repeat(5) + "}\n";
        value = value.repeat(50);
        editor.session.setMode(new Mode());
        editor.setValue(value, -1);
        editor.execCommand("toggleFoldWidget");
        editor.renderer.$loop._flush();

        
        editor.renderer.$gutterLayer.$addCustomWidget(100, {
            className: "widget1",
        });
        editor.renderer.$gutterLayer.$addCustomWidget(4, {
            className: "widget2",
        });
        editor.renderer.$loop._flush();
        
        assert.ok(!editor.container.querySelector(".widget1"));
        assert.ok(editor.container.querySelector(".widget2"));

        editor.navigateTo(100, 0);
        editor.renderer.scrollCursorIntoView();

        editor.renderer.$loop._flush();
        assert.ok(editor.container.querySelector(".widget1"));
        assert.ok(!editor.container.querySelector(".widget2"));

    },
    
    tearDown : function() {
        this.editor.destroy();
        document.body.removeChild(this.editor.container);
    }
    
};

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
