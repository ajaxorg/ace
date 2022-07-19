if (typeof process !== "undefined")
    require("amd-loader");

"use strict";

var HtmlMode = require("../html").Mode;
var EditSession = require("../../edit_session").EditSession;
var assert = require("../../test/assertions");

module.exports = {

    "test: fold mixed html and javascript": function() {
        var session = new EditSession([
            '<script type="text/javascript"> ',
            'function() foo {',
            '    var bar = 1;',
            '}',
            '</script>'
        ]);
        
        var mode = new HtmlMode();
        session.setMode(mode);
        session.setFoldStyle("markbeginend");
        
        assert.equal(session.getFoldWidget(0), "start");
        assert.equal(session.getFoldWidget(1), "start");
        assert.equal(session.getFoldWidget(2), "");
        assert.equal(session.getFoldWidget(3), "end");
        assert.equal(session.getFoldWidget(4), "end");
        
        assert.range(session.getFoldWidgetRange(0), 0, 31, 4, 0);
        assert.range(session.getFoldWidgetRange(4), 0, 31, 4, 0);
        
        assert.range(session.getFoldWidgetRange(1), 1, 16, 3, 0);
        assert.range(session.getFoldWidgetRange(3), 1, 16, 3, 0);
    },
    
    "test: fold mixed html and css": function() {
        var session = new EditSession([
            '<style type="text/css">',
            '    .text-layer {',
            '        font-family: Monaco, "Courier New", monospace;',
            '    }',
            '</style>'
        ]);
        
        var mode = new HtmlMode();
        session.setMode(mode);
        session.setFoldStyle("markbeginend");
        
        assert.equal(session.getFoldWidget(0), "start");
        assert.equal(session.getFoldWidget(1), "start");
        assert.equal(session.getFoldWidget(2), "");
        assert.equal(session.getFoldWidget(3), "end");
        assert.equal(session.getFoldWidget(4), "end");
        
        assert.range(session.getFoldWidgetRange(0), 0, 23, 4, 0);
        assert.range(session.getFoldWidgetRange(4), 0, 23, 4, 0);
        
        assert.range(session.getFoldWidgetRange(1), 1, 17, 3, 4);
        assert.range(session.getFoldWidgetRange(3), 1, 17, 3, 4);
    },
    
    "test: fold should skip self closing elements": function() {
        var session = new EditSession([
            '<body>',
            '<br />',
            '</body>'
        ]);
        
        var mode = new HtmlMode();
        session.setMode(mode);
        session.setFoldStyle("markbeginend");
        
        assert.equal(session.getFoldWidget(0), "start");
        assert.equal(session.getFoldWidget(1), "");
        assert.equal(session.getFoldWidget(2), "end");
        
        assert.range(session.getFoldWidgetRange(0), 0, 6, 2, 0);
        assert.range(session.getFoldWidgetRange(2), 0, 6, 2, 0);
    },
    
    "test: fold should skip void elements": function() {
        var session = new EditSession([
            '<body>',
            '<br>',
            '</body>'
        ]);
        
        var mode = new HtmlMode();
        session.setMode(mode);
        session.setFoldStyle("markbeginend");
        
        assert.equal(session.getFoldWidget(0), "start");
        assert.equal(session.getFoldWidget(1), "");
        assert.equal(session.getFoldWidget(2), "end");
        
        assert.range(session.getFoldWidgetRange(0), 0, 6, 2, 0);
        assert.range(session.getFoldWidgetRange(2), 0, 6, 2, 0);
    },
    
    "test: fold multiple unclosed elements": function() {
        var session = new EditSession([
            '<div>',
            '<p>',
            'juhu',
            '<p>',
            'kinners',
            '</div>'
        ]);
        
        var mode = new HtmlMode();
        session.setMode(mode);
        session.setFoldStyle("markbeginend");
        
        assert.equal(session.getFoldWidget(0), "start");
        assert.equal(session.getFoldWidget(1), "start");
        assert.equal(session.getFoldWidget(2), "");
        assert.equal(session.getFoldWidget(3), "start");
        assert.equal(session.getFoldWidget(4), "");
        assert.equal(session.getFoldWidget(5), "end");
        
        assert.range(session.getFoldWidgetRange(0), 0, 5, 5, 0);
        assert.range(session.getFoldWidgetRange(5), 0, 5, 5, 0);
    },
    
    "test: fold multiple nested optional elements": function() {
        var session = new EditSession([
            '<p>',
            '<li>',
            '<p>juhu',
            '<p>',
            'kinners',
            '</li>'
        ]);
        
        var mode = new HtmlMode();
        session.setMode(mode);
        session.setFoldStyle("markbeginend");
        
        assert.equal(session.getFoldWidget(0), "start");
        assert.equal(session.getFoldWidget(1), "start");
        assert.equal(session.getFoldWidget(2), "start");
        assert.equal(session.getFoldWidget(3), "start");
        assert.equal(session.getFoldWidget(4), "");
        assert.equal(session.getFoldWidget(5), "end");
        
        assert.range(session.getFoldWidgetRange(1), 1, 4, 5, 0);
    }
};


if (typeof module !== "undefined" && module === require.main)
    require("asyncjs").test.testcase(module.exports).exec();
