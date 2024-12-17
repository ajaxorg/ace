"use strict";

var XmlMode = require("../xml").Mode;
var EditSession = require("../../edit_session").EditSession;
var assert = require("../../test/assertions");

module.exports = {

    "test: fold multi line self closing element": function() {
        var session = new EditSession([
            '<person',
            '  firstname="fabian"',
            '  lastname="jakobs"/>'
        ]);
        
        var mode = new XmlMode();
        session.setFoldStyle("markbeginend");
        session.setMode(mode);
        
        assert.equal(session.getFoldWidget(0), "start");
        assert.equal(session.getFoldWidget(1), "");
        assert.equal(session.getFoldWidget(2), "end");
        
        assert.range(session.getFoldWidgetRange(0), 0, 8, 2, 19);
        assert.range(session.getFoldWidgetRange(2), 0, 8, 2, 19);
    },
    
    "test: fold should skip self closing elements": function() {
        var session = new EditSession([
            '<person>',
            '  <attrib value="fabian"/>',
            '</person>'
        ]);
        
        var mode = new XmlMode();
        session.setFoldStyle("markbeginend");
        session.setMode(mode);
        
        assert.equal(session.getFoldWidget(0), "start");
        assert.equal(session.getFoldWidget(1), "");
        assert.equal(session.getFoldWidget(2), "end");
        
        assert.range(session.getFoldWidgetRange(0), 0, 8, 2, 0);
        assert.range(session.getFoldWidgetRange(2), 0, 8, 2, 0);
    },
    
    "test: fold should skip multi line self closing elements": function() {
        var session = new EditSession([
            '<person>',
            '  <attib',
            '     key="name"',
            '     value="fabian"/>',
            '</person>'
        ]);
        
        var mode = new XmlMode();
        session.setMode(mode);
        session.setFoldStyle("markbeginend");
        
        assert.equal(session.getFoldWidget(0), "start");
        assert.equal(session.getFoldWidget(1), "start");
        assert.equal(session.getFoldWidget(2), "");
        assert.equal(session.getFoldWidget(3), "end");
        assert.equal(session.getFoldWidget(4), "end");
        
        assert.range(session.getFoldWidgetRange(0), 0, 8, 4, 0);
        assert.range(session.getFoldWidgetRange(1), 1, 9, 3, 19);
        assert.range(session.getFoldWidgetRange(3), 1, 9, 3, 19);
        assert.range(session.getFoldWidgetRange(4), 0, 8, 4, 0);
    },
    "test: fold should handle multi-line comments inside nested elements correctly": function () {
        var session = new EditSession([
            '<parentElement>', '  <childElement>', '    text <!--', '      This is a multi-line comment',
            '      that spans multiple lines', '    -->', '  </childElement>', '  <anotherChildElement>',
            '    <!-- Another comment -->', '  </anotherChildElement>', '</parentElement>'
        ]);

        var mode = new XmlMode();
        session.setMode(mode);
        session.setFoldStyle("markbeginend");

        // Checks for the parentElement
        assert.equal(session.getFoldWidget(0), "start");
        assert.equal(session.getFoldWidget(10), "end");

        // Checks for multi-line comment folding
        assert.equal(session.getFoldWidget(2), "start");

        // Checks for anotherChildElement folding (with single-line comment)
        assert.equal(session.getFoldWidget(7), "start");
        assert.equal(session.getFoldWidget(8), "");
        assert.equal(session.getFoldWidget(9), "end");

        // Verifying fold ranges
        assert.range(session.getFoldWidgetRange(0), 0, 15, 10, 0);
        assert.range(session.getFoldWidgetRange(2), 2, 13, 5, 4);
        assert.equal(session.getFoldWidgetRange(8), "");
    }

};


if (typeof module !== "undefined" && module === require.main)
    require("asyncjs").test.testcase(module.exports).exec();
