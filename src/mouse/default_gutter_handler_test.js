if (typeof process !== "undefined") {
    require("amd-loader");
    require("../test/mockdom");
}

"use strict";

require("../multi_select");
require("../theme/textmate");
var Editor = require("../editor").Editor;
var Mode = require("../mode/java").Mode;
var VirtualRenderer = require("../virtual_renderer").VirtualRenderer;
var assert = require("../test/assertions");
var MouseEvent = function(type, opts){
    var e = document.createEvent("MouseEvents");
    e.initMouseEvent(/click|wheel/.test(type) ? type : "mouse" + type,
        true, true, window,
        opts.detail,
        opts.x, opts.y, opts.x, opts.y,
        opts.ctrl, opts.alt, opts.shift, opts.meta,
        opts.button || 0, opts.relatedTarget);
    return e;
};

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

    "test: gutter error tooltip" : function() {
        var editor = this.editor;
        var value = "";

        editor.session.setMode(new Mode());
        editor.setValue(value, -1);
        editor.session.setAnnotations([{row: 0, column: 0, text: "error test", type: "error"}]);
        editor.renderer.$loop._flush();

        var lines = editor.renderer.$gutterLayer.$lines;
        var annotation = lines.cells[0].element;
        assert.ok(/ace_error/.test(annotation.className));

        var rect = annotation.getBoundingClientRect();
        annotation.dispatchEvent(new MouseEvent("move", {clientX: rect.left, clientY: rect.top}));

        // Wait for the tooltip to appear after its timeout.
        setTimeout(function() {
            editor.renderer.$loop._flush();
            var tooltipHeader = editor.container.querySelector(".ace_gutter-tooltip_header");
            var tooltipBody = editor.container.querySelector(".ace_gutter-tooltip_body");
            assert.ok(/1 error/.test(tooltipHeader.textContent));
            assert.ok(/error test/.test(tooltipBody.textContent));
        }, 100); 
    },
    "test: gutter warning tooltip" : function() {
        var editor = this.editor;
        var value = "";

        editor.session.setMode(new Mode());
        editor.setValue(value, -1);
        editor.session.setAnnotations([{row: 0, column: 0, text: "warning test", type: "warning"}]);
        editor.renderer.$loop._flush();

        var lines = editor.renderer.$gutterLayer.$lines;
        var annotation = lines.cells[0].element;
        assert.ok(/ace_warning/.test(annotation.className));

        var rect = annotation.getBoundingClientRect();
        annotation.dispatchEvent(new MouseEvent("move", {clientX: rect.left, clientY: rect.top}));

        // Wait for the tooltip to appear after its timeout.
        setTimeout(function() {
            editor.renderer.$loop._flush();
            var tooltipHeader = editor.container.querySelector(".ace_gutter-tooltip_header");
            var tooltipBody = editor.container.querySelector(".ace_gutter-tooltip_body");
            assert.ok(/1 warning/.test(tooltipHeader.textContent));
            assert.ok(/warning test/.test(tooltipBody.textContent));
        }, 100); 
    },
    "test: gutter info tooltip" : function() {
        var editor = this.editor;
        var value = "";

        editor.session.setMode(new Mode());
        editor.setValue(value, -1);
        editor.session.setAnnotations([{row: 0, column: 0, text: "info test", type: "info"}]);
        editor.renderer.$loop._flush();

        var lines = editor.renderer.$gutterLayer.$lines;
        var annotation = lines.cells[0].element;
        assert.ok(/ace_info/.test(annotation.className));

        var rect = annotation.getBoundingClientRect();
        annotation.dispatchEvent(new MouseEvent("move", {clientX: rect.left, clientY: rect.top}));

        // Wait for the tooltip to appear after its timeout.
        setTimeout(function() {
            editor.renderer.$loop._flush();
            var tooltipHeader = editor.container.querySelector(".ace_gutter-tooltip_header");
            var tooltipBody = editor.container.querySelector(".ace_gutter-tooltip_body");
            assert.ok(/1 information message/.test(tooltipHeader.textContent));
            assert.ok(/info test/.test(tooltipBody.textContent));
        }, 100); 
    },
    
    tearDown : function() {
        this.editor.destroy();
        document.body.removeChild(this.editor.container);
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
