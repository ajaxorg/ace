if (typeof process !== "undefined") require("amd-loader");

"use strict";

var LatexMode = require("../latex").Mode;
var EditSession = require("../../edit_session").EditSession;
var assert = require("../../test/assertions");

module.exports = {
    "test: latex block folding": function () {
        var session = new EditSession([
            '\\usepackage{amsmath}', '\\title{\\LaTeX}', '\\date{}', '\\begin'
        ]);

        var mode = new LatexMode();
        session.setFoldStyle("markbegin");
        session.setMode(mode);

        assert.equal(session.getFoldWidget(0), "");
        assert.equal(session.getFoldWidget(1), "");
        assert.equal(session.getFoldWidget(2), "");
        assert.equal(session.getFoldWidget(3), "start");
        assert.equal(session.getFoldWidgetRange(3), null);

        session.setValue(session.getValue() + '{test}\nsome text here \n\\end{test}');

        assert.range(session.getFoldWidgetRange(3), 3, 12, 5, 0);
    }
};

if (typeof module !== "undefined" && module === require.main) require("asyncjs").test.testcase(module.exports).exec();
