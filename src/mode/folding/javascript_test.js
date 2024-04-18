if (typeof process !== "undefined")
    require("amd-loader");

"use strict";

var JavaScriptMode = require("../javascript").Mode;
var EditSession = require("../../edit_session").EditSession;
var assert = require("../../test/assertions");

module.exports = {
    "test: fold jsdoc style comments": function() {
        var session = new EditSession([
            '/**',
             ' *',
             ' * @param {string[]} items',
             ' * @param nada',
             '*/ '
        ]);

        var mode = new JavaScriptMode();
        session.setFoldStyle("markbeginend");
        session.setMode(mode);

        assert.equal(session.getFoldWidget(0), "start");
        assert.equal(session.getFoldWidget(1), "");
        assert.equal(session.getFoldWidget(2), "");
        assert.equal(session.getFoldWidget(3), "");
        assert.equal(session.getFoldWidget(4), "end");

        assert.range(session.getFoldWidgetRange(0), 0, 2, 4, 0);
        assert.range(session.getFoldWidgetRange(4), 0, 2, 4, 0);
    },
    "test: fold mixed js and jsx": function () {
        var session = new EditSession([
            'function Greeting(props) {', '    return (', '        <div>', '            {/* Comment inside JSX */}',
            '            <h1>Hello, {props.name}</h1>', '            <p>You are {props.age} years old.</p>',
            '        </div>', '    );', '}', ''
        ]);

        var mode = new JavaScriptMode();
        session.setFoldStyle("markbeginend");
        session.setMode(mode);

        assert.equal(session.getFoldWidget(0), "start");
        assert.equal(session.getFoldWidget(1), "start");
        assert.equal(session.getFoldWidget(2), "start");
        assert.equal(session.getFoldWidget(3), "");
        assert.equal(session.getFoldWidget(4), "");
        assert.equal(session.getFoldWidget(5), "");
        assert.equal(session.getFoldWidget(6), "end");
        assert.equal(session.getFoldWidget(7), "end");
        assert.equal(session.getFoldWidget(8), "end");

        assert.range(session.getFoldWidgetRange(0), 0, 26, 8, 0);
        assert.range(session.getFoldWidgetRange(1), 1, 12, 7, 4);
        assert.range(session.getFoldWidgetRange(2), 2, 13, 6, 8);
    }

};


if (typeof module !== "undefined" && module === require.main)
    require("asyncjs").test.testcase(module.exports).exec();
