if (typeof process !== "undefined")
    require("amd-loader");

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
    }
};


if (typeof module !== "undefined" && module === require.main)
    require("asyncjs").test.testcase(module.exports).exec();
