if (typeof process !== "undefined")
    require("amd-loader");

"use strict";

var MarkdownMode = require("../markdown").Mode;
var EditSession = require("../../edit_session").EditSession;
var assert = require("../../test/assertions");

module.exports = {

    "test: markdown folding": function() {
        var session = new EditSession([
            "# heading 1",
            "## heading 2",
            "something",
            "### heading 3",
            "#### heading4",
            "other",
            "",
            "article 1",
            "======",
            "A Paragraph.",
            "level 2",
            "--------",
            "A Paragraph."
        ]);
        var expected = "[0/11][5/5],[1/12][5/5],,[3/13][5/5],[4/13][5/5],,,,[8/6][12/12],,,[11/8][12/12],";

        var mode = new MarkdownMode();
        session.setFoldStyle("markbeginend");
        session.setMode(mode);

        var ranges = session.doc.getAllLines().map(function(_, i) {
            return session.getFoldWidgetRange(i); 
        });

        assert.equal(ranges.toString().replace(/Range:|[\s]|->/g, ""), expected);
    }
};


if (typeof module !== "undefined" && module === require.main)
    require("asyncjs").test.testcase(module.exports).exec();
