if (typeof process !== "undefined") {
    require("../test/mockdom");
}

"use strict";

var assert = require("../test/assertions");
var EditSession = require("../edit_session").EditSession;
var TextLayer = require("./text").Text;
var JavaScriptMode = require("../mode/javascript").Mode;
var dom = require("../lib/dom");

module.exports = {

    setUp: function() {
        this.session = new EditSession("");
        this.session.setMode(new JavaScriptMode());
        this.textLayer = new TextLayer(document.createElement("div"));
        this.textLayer.setSession(this.session);
        this.textLayer.config = {
            characterWidth: 10,
            lineHeight: 20
        };
    },

    "test: render line with hard tabs should render the same as lines with soft tabs" : function() {
        this.session.setValue("a\ta\ta\t\na   a   a   \n");
        this.textLayer.$computeTabString();
        
        // row with hard tabs
        var parent1 = dom.createElement("div");
        this.textLayer.$renderLine(parent1, 0);
        
        // row with soft tabs
        var parent2 = dom.createElement("div");
        this.textLayer.$renderLine(parent2, 1);
        assert.equal(parent1.innerHTML, parent2.innerHTML);
    },
    
    "test rendering width of ideographic space (U+3000)" : function() {
        this.session.setValue("\u3000");
        
        var parent = dom.createElement("div");
        this.textLayer.$renderLine(parent, 0);
        assert.domNode(parent, ["div", {}, "\u3000"]);

        this.textLayer.setShowInvisibles(true);
        var parent = dom.createElement("div");
        this.textLayer.$renderLine(parent, 0);
        assert.domNode(parent, ["div", {},
            ["span", {class: "ace_invisible ace_invisible_space"}, this.textLayer.CJK_SPACE_CHAR],
            ["span", {class: "ace_invisible ace_invisible_eol"}, "\xB6"]
        ]);
    },

    "test rendering of indent guides" : function() {
        var textLayer = this.textLayer;
        var EOL = "<span class=\"ace_invisible ace_invisible_eol\">" + textLayer.EOL_CHAR + "</span>";
        var SPACE = function(i) {return Array(i+1).join(" ");};
        var DOT = function(i) {return Array(i+1).join(textLayer.SPACE_CHAR);};
        var TAB = function(i) {return Array(i+1).join(textLayer.TAB_CHAR);};
        function testRender(results) {
            for (var i = results.length; i--; ) {
                var parent = dom.createElement("div");
                textLayer.$renderLine(parent, i);
                
                assert.equal(parent.innerHTML, results[i]);
            }
        }
        
        this.session.setValue("      \n\t\tf\n   ");
        testRender([
            "<span class=\"ace_indent-guide\">" + SPACE(4) + "</span>" + SPACE(2),
            "<span class=\"ace_indent-guide\">" + SPACE(4) + "</span>" + SPACE(4) + "<span class=\"ace_identifier\">f</span>",
            SPACE(3)
        ]);
        
        this.textLayer.setShowInvisibles(true);
        testRender([
            "<span class=\"ace_indent-guide ace_invisible ace_invisible_space\">" + DOT(4) + "</span><span class=\"ace_invisible ace_invisible_space\">" + DOT(2) + "</span>" + EOL,
            "<span class=\"ace_indent-guide ace_invisible ace_invisible_tab\">" + TAB(4) + "</span><span class=\"ace_invisible ace_invisible_tab\">" + TAB(4) + "</span><span class=\"ace_identifier\">f</span>" + EOL
        ]);
        
        this.textLayer.setDisplayIndentGuides(false);
        testRender([
            "<span class=\"ace_invisible ace_invisible_space\">" + DOT(6) + "</span>" + EOL,
            "<span class=\"ace_invisible ace_invisible_tab\">" + TAB(4) + "</span><span class=\"ace_invisible ace_invisible_tab\">" + TAB(4) + "</span><span class=\"ace_identifier\">f</span>" + EOL
        ]);
    },

    "test: align token boundaries to grapheme clusters": function() {
        var textLayer = this.textLayer;
        function values(tokens) {
            return textLayer.$alignTokensToClusters(tokens).map(function(t) {
                return t.value;
            });
        }
        function tokens(values) {
            return values.map(function(v) { return {type: "text", value: v}; });
        }

        // keycap emoji split after the ascii digit is merged back together
        assert.equal(JSON.stringify(values(tokens(["1", "\uFE0F\u20E3 rest"]))),
            JSON.stringify(["1\uFE0F\u20E3 rest"]));

        // ZWJ sequence split mid-cluster
        assert.equal(JSON.stringify(values(tokens(
            ["ab \u{1F468}", "\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466} cd"]))),
            JSON.stringify(["ab ", "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466} cd"]));

        // a mark-only token is swallowed by the previous cluster
        assert.equal(JSON.stringify(values(tokens(["a", "\u0300", "b"]))),
            JSON.stringify(["a\u0300", "b"]));

        // aligned tokens are returned unchanged (same array)
        var aligned = tokens(["hello ", "world \u{1F600}"]);
        assert.ok(textLayer.$alignTokensToClusters(aligned) === aligned);

        // plain ascii is returned unchanged
        var ascii = tokens(["plain", " ascii"]);
        assert.ok(textLayer.$alignTokensToClusters(ascii) === ascii);
    },

    "test: render line with cluster split across tokens": function() {
        // one grapheme cluster torn across two tokens must render whole
        this.session.setValue("1\uFE0F\u20E3x");
        var parent = dom.createElement("div");
        this.textLayer.$renderLine(parent, 0);
        assert.ok(parent.textContent.indexOf("1\uFE0F\u20E3x") != -1);
    },

    "test: tab stops on lines with grapheme clusters": function() {
        // tab stop must be computed from grapheme columns: \uD83D\uDE00 is one column,
        // so the tab at column 1 expands to the next stop at column 4
        this.session.setValue("\u{1F600}\tx");
        this.textLayer.$computeTabString();
        var parent = dom.createElement("div");
        this.textLayer.$renderLine(parent, 0);
        assert.equal(parent.textContent, "\u{1F600}   x");
    },

    "test: line-start RLE renders as plain text only in rtl modes": function() {
        var RLE = "\u202B";
        this.session.setValue(RLE + "abc");
        var parent = dom.createElement("div");
        this.textLayer.$renderLine(parent, 0);
        // by default the security highlighting flags it as an invalid dot
        assert.ok(parent.innerHTML.indexOf("ace_invalid") != -1);

        this.session.$bidiHandler.$rtlText = true;
        parent = dom.createElement("div");
        this.textLayer.$renderLine(parent, 0);
        assert.ok(parent.innerHTML.indexOf("ace_invalid") == -1);
        assert.ok(parent.textContent.indexOf(RLE) != -1);
        this.session.$bidiHandler.$rtlText = false;
    }
};


require("../test/run")(module);