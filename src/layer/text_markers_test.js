if (typeof process !== "undefined") {
    require("amd-loader");
    require("../test/mockdom");
}

"use strict";

var assert = require("../test/assertions");
var EditSession = require("../edit_session").EditSession;
var TextLayer = require("./text").Text;
var JavaScriptMode = require("../mode/javascript").Mode;
var dom = require("../lib/dom");
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
    setUp: function (next) {
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

        next();
    },

    "test: marker splits single token into multiple DOM nodes": function () {
        this.session.setValue('var functionName = "test";');

        this.textLayer.update(this.textLayer.config);

        this.session.addTextMarker(new Range(0, 6, 0, 10), "split-token-marker");

        this.textLayer.$applyTextMarkers();

        var markerSpans = this.textLayer.element.querySelectorAll('.split-token-marker');
        assert.equal(markerSpans.length, 1);
        assert.equal(getText(markerSpans), "ncti");

        const result = normalize(`<span class="ace_storage ace_type">var</span>
            <span class="ace_identifier">fu<span class=" split-token-marker">ncti</span>onName</span> <span
                class="ace_keyword ace_operator">=</span> <span class="ace_string">"test"</span><span
                class="ace_punctuation ace_operator">;</span>`);
        const actual = normalize(this.textLayer.element.childNodes[0].innerHTML);
        assert.equal(actual, result);
    },

    "test: marker partially overlaps multiple tokens": function () {
        this.session.setValue('var test = 123;');

        this.textLayer.update(this.textLayer.config);

        this.session.addTextMarker(new Range(0, 6, 0, 12), "overlap-marker");

        this.textLayer.$applyTextMarkers();

        var markerSpans = this.textLayer.element.querySelectorAll('.overlap-marker');
        assert.equal(getText(markerSpans), "st = 1");

        const result = normalize(`<span class="ace_storage ace_type">var</span> <span class="ace_identifier">te
    <span class=" overlap-marker">st</span></span><span class=" overlap-marker"> </span>
    <span class="ace_keyword ace_operator">
    <span class=" overlap-marker">=</span></span><span class=" overlap-marker"> </span><span class="ace_constant ace_numeric">
    <span class=" overlap-marker">1</span>23</span><span class="ace_punctuation ace_operator">;</span>`);
        const actual = normalize(this.textLayer.element.childNodes[0].innerHTML);
        assert.equal(actual, result);
    },

    "test: multiple overlapping markers split tokens differently": function () {
        this.session.setValue('var longVariableName = 42;');

        this.textLayer.update(this.textLayer.config);

        this.session.addTextMarker(new Range(0, 4, 0, 12), "marker-1");
        this.session.addTextMarker(new Range(0, 8, 0, 16), "marker-2");
        this.session.addTextMarker(new Range(0, 6, 0, 14), "marker-3");

        this.textLayer.$applyTextMarkers();

        const line = this.textLayer.element.childNodes[0];

        // Verify all markers are applied
        assert.ok(line.querySelectorAll('.marker-1').length > 0);
        assert.ok(line.querySelectorAll('.marker-2').length > 0);
        assert.ok(line.querySelectorAll('.marker-3').length > 0);

        assert.equal(line.textContent, 'var longVariableName = 42;');

        const result = normalize(`<span class="ace_storage ace_type">var</span> <span class="ace_identifier">
            <span class=" marker-1">lo</span><span class=" marker-1 marker-3">ng</span>
            <span class=" marker-1 marker-2 marker-3">Vari</span><span class=" marker-2 marker-3">ab</span>
            <span class=" marker-2">le</span>Name</span> <span class="ace_keyword ace_operator">=</span> 
            <span class="ace_constant ace_numeric">42</span><span class="ace_punctuation ace_operator">;</span>`);
        const actual = normalize(this.textLayer.element.childNodes[0].innerHTML);
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
        const result = `<span class="ace_identifier">fun<span class=" tab-marker">c</span></span><span class=" tab-marker">    </span><span class=" tab-marker">    </span><span class="ace_identifier"><span class=" tab-marker">t</span>est</span>`;
        const actual = this.textLayer.element.childNodes[0].innerHTML;
        assert.equal(actual, result);
    },

    "test: marker with CJK characters and proper width calculation": function () {
        this.session.setValue("测试function测试");

        this.textLayer.update(this.textLayer.config);

        this.session.addTextMarker(new Range(0, 1, 0, 11), "cjk-marker");

        this.textLayer.$applyTextMarkers();

        const line = this.textLayer.element.childNodes[0];
        var cjkMarkers = line.querySelectorAll('.cjk-marker');
        assert.ok(cjkMarkers.length > 0, "CJK marker should be present");

        var markedText = "";
        cjkMarkers.forEach(span => {
            markedText += span.textContent;
        });
        assert.equal(markedText, "试function测");

        const result = normalize(`<span class="ace_identifier"><span class="ace_cjk" style="width: 20px;">测</span>
            <span class="ace_cjk cjk-marker" style="width: 20px;">试</span><span class=" cjk-marker">function</span>
            <span class="ace_cjk cjk-marker" style="width: 20px;">测</span>
            <span class="ace_cjk" style="width: 20px;">试</span></span>`);
        const actual = normalize(this.textLayer.element.childNodes[0].innerHTML);
        assert.equal(actual, result);
    },

    "test: marker removal properly cleans up split tokens": function() {
        this.session.setValue('var functionName = "test";');

        this.textLayer.update(this.textLayer.config);

        var markerId = this.session.addTextMarker(new Range(0, 6, 0, 10), "temp-marker");

        this.textLayer.$applyTextMarkers();

        const line = this.textLayer.element.childNodes[0];

        var markerSpans = line.querySelectorAll('.temp-marker');
        assert.ok(markerSpans.length > 0, "Marker should be present");

        this.session.removeTextMarker(markerId);

        this.textLayer.update(this.textLayer.config);
        this.textLayer.$applyTextMarkers();

        const newLine = this.textLayer.element.childNodes[0];

        markerSpans = newLine.querySelectorAll('.temp-marker');
        assert.equal(markerSpans.length, 0, "Marker should be removed");
    },
};

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}