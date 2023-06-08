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
    }
};


if (typeof module !== "undefined" && module === require.main)
    require("asyncjs").test.testcase(module.exports).exec();
