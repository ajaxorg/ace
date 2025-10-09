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
var user = require("../test/user");

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
    "test: gutter error tooltip" : function(done) {
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
        annotation.dispatchEvent(new MouseEvent("move", {x: rect.left + rect.width/2, y: rect.top + rect.height/2}));

        // Wait for the tooltip to appear after its timeout.
        setTimeout(function() {
            editor.renderer.$loop._flush();
            var tooltip = findVisibleTooltip();

            assert.ok(/error test/.test(tooltip.textContent));
            annotation.dispatchEvent(new MouseEvent("move", {x: 0, y: 0}));
            done();
        }, 100);
    },
    "test: gutter security tooltip" : function(done) {
        var editor = this.editor;
        var value = "";

        editor.session.setMode(new Mode());
        editor.setValue(value, -1);
        editor.session.setAnnotations([{row: 0, column: 0, text: "security finding test", type: "security"}]);
        editor.renderer.$loop._flush();

        var lines = editor.renderer.$gutterLayer.$lines;
        var annotation = lines.cells[0].element;
        assert.ok(/ace_security/.test(annotation.className));

        var rect = annotation.getBoundingClientRect();
        annotation.dispatchEvent(new MouseEvent("move", {x: rect.left + rect.width/2, y: rect.top + rect.height/2}));

        // Wait for the tooltip to appear after its timeout.
        setTimeout(function() {
            editor.renderer.$loop._flush();
            var tooltip = findVisibleTooltip();
            assert.ok(/security finding test/.test(tooltip.textContent));
            done();
        }, 100);
    },
    "test: gutter warning tooltip" : function(done) {
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
        annotation.dispatchEvent(new MouseEvent("move", {x: rect.left + rect.width/2, y: rect.top + rect.height/2}));

        // Wait for the tooltip to appear after its timeout.
        setTimeout(function() {
            editor.renderer.$loop._flush();
            var tooltip = findVisibleTooltip();
            assert.ok(/warning test/.test(tooltip.textContent));
            done();
        }, 100);
    },
    "test: gutter info tooltip" : function(done) {
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
        annotation.dispatchEvent(new MouseEvent("move", {x: rect.left + rect.width/2, y: rect.top + rect.height/2}));

        // Wait for the tooltip to appear after its timeout.
        setTimeout(function() {
            editor.renderer.$loop._flush();
            var tooltip = findVisibleTooltip();
            assert.ok(/info test/.test(tooltip.textContent));
            done();
        }, 100);
    },
    "test: gutter hint tooltip" : function(done) {
        var editor = this.editor;
        var value = "";

        editor.session.setMode(new Mode());
        editor.setValue(value, -1);
        editor.session.setAnnotations([{row: 0, column: 0, text: "suggestion test", type: "hint"}]);
        editor.renderer.$loop._flush();

        var lines = editor.renderer.$gutterLayer.$lines;
        var annotation = lines.cells[0].element;
        assert.ok(/ace_hint/.test(annotation.className));

        var rect = annotation.getBoundingClientRect();
        annotation.dispatchEvent(new MouseEvent("move", {x: rect.left + rect.width/2, y: rect.top + rect.height/2}));

        // Wait for the tooltip to appear after its timeout.
        setTimeout(function() {
            editor.renderer.$loop._flush();
            var tooltip = findVisibleTooltip();
            assert.ok(/suggestion test/.test(tooltip.textContent));
            done();
        }, 100);
    },
    "test: gutter svg icons" : function() {
        var editor = this.editor;
        var value = "";

        editor.session.setMode(new Mode());
        editor.setOption("useSvgGutterIcons", true);
        editor.setValue(value, -1);
        editor.session.setAnnotations([{row: 0, column: 0, type: "error", text: "error test"}]);
        editor.renderer.$loop._flush();

        var lines = editor.renderer.$gutterLayer.$lines;
        var line = lines.cells[0].element;
        assert.ok(/ace_gutter-cell_svg-icons/.test(line.className));

        var annotation = line.children[2].firstChild;
        assert.ok(/ace_icon_svg/.test(annotation.className));
    },
    "test: error show up in fold" : function(done) {
        var editor = this.editor;
        var value = "x {" + "\n".repeat(50) + "}";
        value = value.repeat(50);
        editor.session.setMode(new Mode());
        editor.setOption("showFoldedAnnotations", true);
        editor.setValue(value, -1);
        editor.session.setAnnotations([{row: 1, column: 0, type: "error", text: "error test"}]);
        editor.renderer.$loop._flush();

        // Fold the line containing the annotation.
        var lines = editor.renderer.$gutterLayer.$lines;
        assert.equal(lines.cells[1].element.textContent, "2");
        var toggler = lines.cells[0].element.querySelector(".ace_fold-widget");
        var rect = toggler.getBoundingClientRect();
        if (!rect.left) rect.left = 100; // for mockdom
        toggler.dispatchEvent(new MouseEvent("click", {x: rect.left, y: rect.top}));
        editor.renderer.$loop._flush();
        assert.ok(/ace_closed/.test(toggler.className));
        assert.equal(lines.cells[1].element.textContent, "51");

        // Annotation node should have fold class.
        var annotation = lines.cells[0].element.children[2].firstChild;
        assert.ok(/ace_error_fold/.test(annotation.className));

        var row = lines.cells[0].row;
        editor.$mouseHandler.$tooltip.showTooltip(row);

        // Wait for the tooltip to appear after its timeout.
        setTimeout(function() {
            editor.renderer.$loop._flush();
            var tooltip = findVisibleTooltip();
            assert.ok(/error in folded/.test(tooltip.textContent));
            done();
        }, 100);
    },
    "test: security show up in fold" : function(done) {
        var editor = this.editor;
        var value = "x {" + "\n".repeat(50) + "}";
        value = value.repeat(50);
        editor.session.setMode(new Mode());
        editor.setOption("showFoldedAnnotations", true);
        editor.setValue(value, -1);
        editor.session.setAnnotations([{row: 1, column: 0, type: "security", text: "security finding test"}]);
        editor.renderer.$loop._flush();

        // Fold the line containing the annotation.
        var lines = editor.renderer.$gutterLayer.$lines;
        assert.equal(lines.cells[1].element.textContent, "2");
        var toggler = lines.cells[0].element.querySelector(".ace_fold-widget");
        var rect = toggler.getBoundingClientRect();
        if (!rect.left) rect.left = 100; // for mockdom
        toggler.dispatchEvent(new MouseEvent("click", {x: rect.left, y: rect.top}));
        editor.renderer.$loop._flush();
        assert.ok(/ace_closed/.test(toggler.className));
        assert.equal(lines.cells[1].element.textContent, "51");

        // Annotation node should have fold class.
        var annotation = lines.cells[0].element.children[2].firstChild;
        assert.ok(/ace_security_fold/.test(annotation.className));

        var row = lines.cells[0].row;
        editor.$mouseHandler.$tooltip.showTooltip(row);

        // Wait for the tooltip to appear after its timeout.
        setTimeout(function() {
            editor.renderer.$loop._flush();
            var tooltip = findVisibleTooltip();
            assert.ok(/security finding in folded/.test(tooltip.textContent));
            done();
        }, 100);
    },
    "test: warning show up in fold" : function(done) {
        var editor = this.editor;
        var value = "x {" + "\n".repeat(50) + "}";
        value = value.repeat(50);
        editor.session.setMode(new Mode());
        editor.setOption("showFoldedAnnotations", true);
        editor.setValue(value, -1);
        editor.session.setAnnotations([{row: 1, column: 0, type: "warning", text: "warning test"}]);
        editor.renderer.$loop._flush();

        // Fold the line containing the annotation.
        var lines = editor.renderer.$gutterLayer.$lines;
        assert.equal(lines.cells[1].element.textContent, "2");
        var toggler = lines.cells[0].element.querySelector(".ace_fold-widget");
        var rect = toggler.getBoundingClientRect();
        if (!rect.left) rect.left = 100; // for mockdom
        toggler.dispatchEvent(new MouseEvent("click", {x: rect.left, y: rect.top}));
        editor.renderer.$loop._flush();
        assert.ok(/ace_closed/.test(toggler.className));
        assert.equal(lines.cells[1].element.textContent, "51");

        // Annotation node should have fold class.
        var annotation = lines.cells[0].element.children[2].firstChild;
        assert.ok(/ace_warning_fold/.test(annotation.className));

        var row = lines.cells[0].row;
        editor.$mouseHandler.$tooltip.showTooltip(row);

        // Wait for the tooltip to appear after its timeout.
        setTimeout(function() {
            editor.renderer.$loop._flush();
            var tooltip = findVisibleTooltip();
            assert.ok(/warning in folded/.test(tooltip.textContent));
            done();
        }, 100);
    },
    "test: info not show up in fold" : function() {
        var editor = this.editor;
        var value = "x {" + "\n".repeat(50) + "}";
        value = value.repeat(50);
        editor.session.setMode(new Mode());
        editor.setOption("showFoldedAnnotations", true);
        editor.setValue(value, -1);
        editor.session.setAnnotations([{row: 1, column: 0, type: "info", text: "info test"}]);
        editor.renderer.$loop._flush();

        // Fold the line containing the annotation.
        var lines = editor.renderer.$gutterLayer.$lines;
        assert.equal(lines.cells[1].element.textContent, "2");
        var toggler = lines.cells[0].element.querySelector(".ace_fold-widget");
        var rect = toggler.getBoundingClientRect();
        if (!rect.left) rect.left = 100; // for mockdom
        toggler.dispatchEvent(new MouseEvent("click", {x: rect.left, y: rect.top}));
        editor.renderer.$loop._flush();
        assert.ok(/ace_closed/.test(toggler.className));
        assert.equal(lines.cells[1].element.textContent, "51");

        // Annotation node should NOT have fold class.
        var annotation = lines.cells[0].element.children[2];
        assert.notOk(/fold/.test(annotation.className));
    },
    "test: hint not show up in fold" : function() {
        var editor = this.editor;
        var value = "x {" + "\n".repeat(50) + "}";
        value = value.repeat(50);
        editor.session.setMode(new Mode());
        editor.setOption("showFoldedAnnotations", true);
        editor.setValue(value, -1);
        editor.session.setAnnotations([{row: 1, column: 0, type: "hint", text: "suggestion test"}]);
        editor.renderer.$loop._flush();

        // Fold the line containing the annotation.
        var lines = editor.renderer.$gutterLayer.$lines;
        assert.equal(lines.cells[1].element.textContent, "2");
        var toggler = lines.cells[0].element.querySelector(".ace_fold-widget");
        var rect = toggler.getBoundingClientRect();
        if (!rect.left) rect.left = 100; // for mockdom
        toggler.dispatchEvent(new MouseEvent("click", {x: rect.left, y: rect.top}));
        editor.renderer.$loop._flush();
        assert.ok(/ace_closed/.test(toggler.className));
        assert.equal(lines.cells[1].element.textContent, "51");

        // Annotation node should NOT have fold class.
        var annotation = lines.cells[0].element.children[2];
        assert.notOk(/fold/.test(annotation.className));
    },
    "test: severities are correctly ordered/ranked when folding": function() {
        var editor = this.editor;
        var value = "x {" + "\n".repeat(50) + "}";
        value = value.repeat(50);
        editor.session.setMode(new Mode());
        editor.setOption("showFoldedAnnotations", true);
        editor.setValue(value, -1);
        // Rank is: Error > Security > Warning
        editor.session.setAnnotations([
            {row: 1, column: 0, type: "warning", text: "warning test"},
            {row: 1, column: 0, type: "security", text: "security finding test"},
            {row: 1, column: 0, type: "error", text: "error test"}
        ]);
        editor.renderer.$loop._flush();

        // Fold the line containing the annotation.
        var lines = editor.renderer.$gutterLayer.$lines;
        assert.equal(lines.cells[1].element.textContent, "2");
        var firstLineGutterElement = lines.cells[0].element;
        var toggler = firstLineGutterElement.querySelector(".ace_fold-widget");
        var rect = toggler.getBoundingClientRect();
        if (!rect.left) rect.left = 100; // for mockdom
        toggler.dispatchEvent(new MouseEvent("click", {x: rect.left, y: rect.top}));
        editor.renderer.$loop._flush();
        assert.ok(/ace_closed/.test(toggler.className));
        assert.equal(lines.cells[1].element.textContent, "51");

        // Annotation node should have Error fold class
        assert.ok(/ace_error_fold/.test(firstLineGutterElement.className));
        assert.notOk(/ace_security_fold/.test(firstLineGutterElement.className));
        assert.notOk(/ace_warning_fold/.test(firstLineGutterElement.className));

        // Annotation node should have Security fold class
        editor.session.setAnnotations([
            {row: 1, column: 0, type: "security", text: "security finding test"},
            {row: 1, column: 0, type: "warning", text: "warning test"}
        ]);
        editor.renderer.$loop._flush();
        assert.notOk(/ace_error_fold/.test(firstLineGutterElement.className));
        assert.ok(/ace_security_fold/.test(firstLineGutterElement.className));
        assert.notOk(/ace_warning_fold/.test(firstLineGutterElement.className));

        // Annotation node should have Warning fold class
        editor.session.setAnnotations([
            {row: 1, column: 0, type: "warning", text: "warning test"}
        ]);
        editor.renderer.$loop._flush();
        assert.notOk(/ace_error_fold/.test(firstLineGutterElement.className));
        assert.notOk(/ace_security_fold/.test(firstLineGutterElement.className));
        assert.ok(/ace_warning_fold/.test(firstLineGutterElement.className));
    },
    "test: gutter tooltip should properly display special characters (\" ' & <)" : function(done) {
        var editor = this.editor;
        var value = "";

        editor.session.setMode(new Mode());
        editor.setValue(value, -1);
        editor.session.setAnnotations([{row: 0, column: 0, text: "special characters \" ' & <", type: "error"}]);
        editor.renderer.$loop._flush();

        var lines = editor.renderer.$gutterLayer.$lines;
        var annotation = lines.cells[0].element;
        assert.ok(/ace_error/.test(annotation.className));

        var rect = annotation.getBoundingClientRect();
        annotation.dispatchEvent(new MouseEvent("move", {x: rect.left + rect.width/2, y: rect.top + rect.height/2}));

        // Wait for the tooltip to appear after its timeout.
        setTimeout(function() {
            editor.renderer.$loop._flush();
            var tooltip = findVisibleTooltip();
            assert.ok(/special characters " ' & </.test(tooltip.textContent));
            done();
        }, 100);
    },
    "test: gutter hover tooltip should remain open when pressing ctrl key combination" : function(done) {
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
        annotation.dispatchEvent(new MouseEvent("move", {x: rect.left + rect.width/2, y: rect.top + rect.height/2}));

        // Wait for the tooltip to appear after its timeout.
        setTimeout(function () {
            editor.renderer.$loop._flush();
            var tooltip = findVisibleTooltip();
            assert.ok(/error test/.test(tooltip.textContent));
            tooltip.focus();
            user.type("Ctrl-C");
            tooltip = findVisibleTooltip();
            assert.ok(/error test/.test(tooltip.textContent));
            // also verify if it closes when presses another key
            user.type("Escape");
            tooltip = document.body.querySelector(".ace_gutter-tooltip");
            assert.strictEqual(tooltip.style.display, "none");
            done();
        }, 100);
    },
    "test: gutter tooltip aria-describedby attribute": function(done) {
        var editor = this.editor;
        var value = "";

        editor.session.setMode(new Mode());
        editor.setValue(value, -1);
        editor.session.setAnnotations([{row: 0, column: 0, text: "error test", type: "error"}]);
        editor.renderer.$loop._flush();

        var lines = editor.renderer.$gutterLayer.$lines;
        var element = lines.cells[0].element;
        var annotation = element.childNodes[2];
        assert.ok(/ace_error/.test(element.className));

        var rect = element.getBoundingClientRect();
        element.dispatchEvent(new MouseEvent("move", {x: rect.left + rect.width/2, y: rect.top + rect.height/2}));

        // Wait for the tooltip to appear after its timeout.
        setTimeout(function() {
            editor.renderer.$loop._flush();
            var tooltip = findVisibleTooltip();
            assert.ok(/error test/.test(tooltip.textContent));

            var ariaDescribedBy = annotation.getAttribute("aria-describedby");
            assert.ok(ariaDescribedBy, "aria-describedby should be set when tooltip is shown");
            assert.equal(ariaDescribedBy, tooltip.id, "aria-describedby should match tooltip id");

            editor.container.dispatchEvent(new MouseEvent("wheel", {}));

            setTimeout(function() {
                editor.renderer.$loop._flush();
                assert.equal(annotation.getAttribute("aria-describedby"), "", "aria-describedby should be removed when tooltip is hidden");
                done();
            }, 100);
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
