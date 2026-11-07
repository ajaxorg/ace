if (typeof process !== "undefined") {
    require("../test/mockdom");
}

"use strict";

var assert = require("../test/assertions");
var EditSession = require("../edit_session").EditSession;
var TextLayer = require("./text").Text;
var JavaScriptMode = require("../mode/javascript").Mode;
var Range = require("../range").Range;

require("./text_markers");

function normalize(str) {
    return str.replace(/\s/gm, "");
}

function getText(nodes) {
    var markedContent = "";
    nodes.forEach(node => {
        markedContent += node.textContent;
    });

    return markedContent;
}

module.exports = {
    setUp: function () {
        this.session = new EditSession("");
        this.session.setMode(new JavaScriptMode());

        this.container = document.createElement("div");
        this.textLayer = new TextLayer(this.container);
        this.textLayer.setSession(this.session);
        this.textLayer.config = {
            characterWidth: 10,
            lineHeight: 20,
            firstRow: 0,
            lastRow: 10,
            firstRowScreen: 0,
            padding: 0,
            offset: 0
        };
    },

    "test: marker splits single token into multiple DOM nodes": function () {
        this.session.setValue('var functionName = "test";');

        this.textLayer.update(this.textLayer.config);

        this.session.addTextMarker(new Range(0, 6, 0, 10), "split-token-marker");

        this.textLayer.$applyTextMarkers();

        var markerSpans = this.textLayer.element.querySelectorAll('.split-token-marker');
        assert.equal(markerSpans.length, 1);
        assert.equal(getText(markerSpans), "ncti");

        var result = normalize(`<span class="ace_storage ace_type">var</span>
            <span class="ace_identifier">fu<span class=" split-token-marker">ncti</span>onName</span> <span
                class="ace_keyword ace_operator">=</span> <span class="ace_string">"test"</span><span
                class="ace_punctuation ace_operator">;</span>`);
        var actual = normalize(this.textLayer.element.childNodes[0].innerHTML);
        assert.equal(actual, result);
    },

    "test: marker partially overlaps multiple tokens": function () {
        this.session.setValue('var test = 123;');

        this.textLayer.update(this.textLayer.config);

        this.session.addTextMarker(new Range(0, 6, 0, 12), "overlap-marker");

        this.textLayer.$applyTextMarkers();

        var markerSpans = this.textLayer.element.querySelectorAll('.overlap-marker');
        assert.equal(getText(markerSpans), "st = 1");

        var result = normalize(`<span class="ace_storage ace_type">var</span> <span class="ace_identifier">te
    <span class=" overlap-marker">st</span></span><span class=" overlap-marker"> </span>
    <span class="ace_keyword ace_operator">
    <span class=" overlap-marker">=</span></span><span class=" overlap-marker"> </span><span class="ace_constant ace_numeric">
    <span class=" overlap-marker">1</span>23</span><span class="ace_punctuation ace_operator">;</span>`);
        var actual = normalize(this.textLayer.element.childNodes[0].innerHTML);
        assert.equal(actual, result);
    },

    "test: multiple overlapping markers split tokens differently": function () {
        this.session.setValue('var longVariableName = 42;');

        this.textLayer.update(this.textLayer.config);

        this.session.addTextMarker(new Range(0, 4, 0, 12), "marker-1");
        this.session.addTextMarker(new Range(0, 8, 0, 16), "marker-2");
        this.session.addTextMarker(new Range(0, 6, 0, 14), "marker-3");

        this.textLayer.$applyTextMarkers();

        var line = this.textLayer.element.childNodes[0];

        // Verify all markers are applied
        assert.ok(line.querySelectorAll('.marker-1').length > 0);
        assert.ok(line.querySelectorAll('.marker-2').length > 0);
        assert.ok(line.querySelectorAll('.marker-3').length > 0);

        assert.equal(line.textContent, 'var longVariableName = 42;');

        var result = normalize(`<span class="ace_storage ace_type">var</span> <span class="ace_identifier">
            <span class=" marker-1">lo</span><span class=" marker-1 marker-3">ng</span>
            <span class=" marker-1 marker-2 marker-3">Vari</span><span class=" marker-2 marker-3">ab</span>
            <span class=" marker-2">le</span>Name</span> <span class="ace_keyword ace_operator">=</span> 
            <span class="ace_constant ace_numeric">42</span><span class="ace_punctuation ace_operator">;</span>`);
        var actual = normalize(this.textLayer.element.childNodes[0].innerHTML);
        assert.equal(actual, result);
    },

    "test: marker with tab characters and invisible rendering": function () {
        this.session.setValue("func\t\ttest");
        this.textLayer.setShowInvisibles("tab");
        this.textLayer.$computeTabString();

        this.textLayer.update(this.textLayer.config);

        this.session.addTextMarker(new Range(0, 3, 0, 7), "tab-marker");

        this.textLayer.$applyTextMarkers();

        //preserve whitespaces
        var result = `<span class="ace_identifier">fun<span class=" tab-marker">c</span></span><span class=" tab-marker">    </span><span class=" tab-marker">    </span><span class="ace_identifier"><span class=" tab-marker">t</span>est</span>`;
        var actual = this.textLayer.element.childNodes[0].innerHTML;
        assert.equal(actual, result);
    },

    "test: marker with CJK characters and proper width calculation": function () {
        this.session.setValue("测试function测试");

        this.textLayer.update(this.textLayer.config);

        this.session.addTextMarker(new Range(0, 1, 0, 11), "cjk-marker");

        this.textLayer.$applyTextMarkers();

        var line = this.textLayer.element.childNodes[0];
        var cjkMarkers = line.querySelectorAll('.cjk-marker');
        assert.ok(cjkMarkers.length > 0, "CJK marker should be present");

        var markedText = "";
        cjkMarkers.forEach(span => {
            markedText += span.textContent;
        });
        assert.equal(markedText, "试function测");

        var result = normalize(`<spanclass="ace_identifier">测<spanclass="cjk-marker">试function测</span>试</span>`);
        var actual = normalize(this.textLayer.element.childNodes[0].innerHTML);
        assert.equal(actual, result);
    },

    "test: marker removal properly cleans up split tokens": function() {
        this.session.setValue('var functionName = "test";');

        this.textLayer.update(this.textLayer.config);

        var markerId = this.session.addTextMarker(new Range(0, 6, 0, 10), "temp-marker");

        this.textLayer.$applyTextMarkers();

        var line = this.textLayer.element.childNodes[0];

        var markerSpans = line.querySelectorAll('.temp-marker');
        assert.ok(markerSpans.length > 0, "Marker should be present");

        this.session.removeTextMarker(markerId);

        this.textLayer.update(this.textLayer.config);
        this.textLayer.$applyTextMarkers();

        var newLine = this.textLayer.element.childNodes[0];

        markerSpans = newLine.querySelectorAll('.temp-marker');
        assert.equal(markerSpans.length, 0, "Marker should be removed");
    },

    "test: invisible marker with mixed whitespace and complete cleanup verification": function() {
        var value = "function\t  test() { //test     comment\n    var x = 1;\n}";
        this.session.setValue(value);
        this.textLayer.setRenderWhitespaceMarkers(true);

        this.textLayer.update(this.textLayer.config);

        var markerId = this.session.addTextMarker(new Range(0, 8, 0, 30), "invisible-marker", "invisible");

        this.textLayer.$applyTextMarkers();

        var markerElements = this.textLayer.element.querySelectorAll('.invisible-marker');
        assert.ok(markerElements.length > 0, "Invisible marker should be applied");

        var line = this.textLayer.element.childNodes[0];

        var hasTabSymbol = line.innerHTML.includes(this.textLayer.TAB_CHAR);
        var hasSpaceSymbol = line.innerHTML.includes(this.textLayer.SPACE_CHAR);
        assert.ok(hasTabSymbol, "Should contain TAB_CHAR symbol");
        assert.ok(hasSpaceSymbol, "Should contain SPACE_CHAR symbol");

        markerElements.forEach(element => {
            assert.ok(element.classList.contains("ace_invisible"));
            assert.ok(!element.classList.contains("ace_invisible_hidden"));
        });

        var tabMarker = line.querySelector(".ace_invisible_tab.invisible-marker");
        assert.ok(tabMarker, "Tab marker should be applied");
        assert.equal(tabMarker["charCount"], 1, "Tab marker should preserve its logical length");

        var hiddenElements = line.querySelectorAll(".ace_invisible_hidden");
        assert.ok(hiddenElements.length > 0, "Whitespace outside the marker should remain hidden");

        this.session.removeTextMarker(markerId);
        this.textLayer.$applyTextMarkers();

        markerElements = this.textLayer.element.querySelectorAll('.invisible-marker');
        assert.equal(markerElements.length, 0, "Marker class should be removed");

        var finalLine = this.textLayer.element.childNodes[0];
        assert.ok(finalLine.innerHTML.includes(this.textLayer.TAB_CHAR),
            "TAB_CHAR should remain in the stable DOM");
        assert.ok(finalLine.innerHTML.includes(this.textLayer.SPACE_CHAR),
            "SPACE_CHAR should remain in the stable DOM");

        var visibleWhitespace = Array.from(finalLine.querySelectorAll(".ace_invisible")).filter(element => {
            return !element.classList.contains("ace_invisible_hidden")
                && (element.classList.contains("ace_invisible_space")
                    || element.classList.contains("ace_invisible_tab"));
        });
        assert.equal(visibleWhitespace.length, 0, "All whitespace glyphs should be hidden after cleanup");
    },

    "test: invisible marker splits a pre-rendered whitespace run": function() {
        this.session.setValue("//a     b");
        this.textLayer.setRenderWhitespaceMarkers(true);
        this.textLayer.update(this.textLayer.config);

        this.session.addTextMarker(new Range(0, 5, 0, 7), "invisible-marker", "invisible");
        this.textLayer.$applyTextMarkers();

        var line = this.textLayer.element.childNodes[0];
        var markerElements = line.querySelectorAll(".invisible-marker");
        assert.equal(markerElements.length, 1);
        assert.equal(markerElements[0].textContent, this.textLayer.SPACE_CHAR.repeat(2));

        var hiddenElements = line.querySelectorAll(".ace_invisible_hidden");
        assert.equal(hiddenElements.length, 2);
        assert.equal(hiddenElements[0].textContent, this.textLayer.SPACE_CHAR.repeat(2));
        assert.equal(hiddenElements[1].textContent, this.textLayer.SPACE_CHAR);
    },

    "test: splitting an indent guide preserves one guide decoration": function() {
        this.session.setValue("      value");
        this.textLayer.setRenderWhitespaceMarkers(true);
        this.textLayer.update(this.textLayer.config);

        this.session.addTextMarker(new Range(0, 1, 0, 3), "invisible-marker", "invisible");
        this.textLayer.$applyTextMarkers();

        var line = this.textLayer.element.childNodes[0];
        assert.equal(line.querySelectorAll(".ace_indent-guide").length, 1);
        assert.equal(
            line.querySelector(".invisible-marker").textContent,
            this.textLayer.SPACE_CHAR.repeat(2)
        );
        this.textLayer.$setIndentGuideActive(this.textLayer.$lines.cells[0], 1);
        assert.equal(line.querySelectorAll(".ace_indent-guide-active").length, 1);
    },

    "test: invisible marker does not modify globally visible whitespace": function() {
        this.session.setValue("a  b");
        this.textLayer.setRenderWhitespaceMarkers(true);
        this.textLayer.setShowInvisibles(true);
        this.textLayer.update(this.textLayer.config);

        this.session.addTextMarker(new Range(0, 1, 0, 3), "invisible-marker", "invisible");
        this.textLayer.$applyTextMarkers();

        var line = this.textLayer.element.childNodes[0];
        assert.equal(line.querySelectorAll(".invisible-marker").length, 0);
        assert.equal(line.querySelectorAll(".ace_invisible_hidden").length, 0);
        assert.equal(
            line.querySelector(".ace_invisible_space").textContent,
            this.textLayer.SPACE_CHAR.repeat(2)
        );

        this.textLayer.setShowInvisibles(false);
        this.textLayer.update(this.textLayer.config);
        this.textLayer.$applyTextMarkers();

        assert.equal(
            this.textLayer.element.querySelectorAll(".invisible-marker").length,
            1,
            "The retained marker should reveal whitespace when global invisibles are hidden"
        );
    },

    "test: invisible marker supports pre-rendered CJK spaces": function() {
        this.session.setValue("a　b");
        this.textLayer.setRenderWhitespaceMarkers(true);
        this.textLayer.update(this.textLayer.config);

        this.session.addTextMarker(new Range(0, 1, 0, 2), "invisible-marker", "invisible");
        this.textLayer.$applyTextMarkers();

        var marker = this.textLayer.element.querySelector(".invisible-marker");
        assert.ok(marker);
        assert.equal(marker.textContent, this.textLayer.CJK_SPACE_CHAR);
        assert.ok(!marker.classList.contains("ace_invisible_hidden"));
    },
};

require("../test/run")(module);
