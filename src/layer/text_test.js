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

module.exports = {

    setUp: function(next) {
        this.session = new EditSession("");
        this.session.setMode(new JavaScriptMode());
        this.textLayer = new TextLayer(document.createElement("div"));
        this.textLayer.setSession(this.session);
        this.textLayer.config = {
            characterWidth: 10,
            lineHeight: 20
        };
        next();
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
        assert.domNode(parent, ["div", {}, ["span", {class: "ace_cjk", style: "width: 20px;"}, "\u3000"]]);

        this.textLayer.setShowInvisibles(true);
        var parent = dom.createElement("div");
        this.textLayer.$renderLine(parent, 0);
        assert.domNode(parent, ["div", {},
            ["span", {class: "ace_cjk ace_invisible ace_invisible_space", style: "width: 20px;"}, this.textLayer.SPACE_CHAR],
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
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
