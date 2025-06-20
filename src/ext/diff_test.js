"use strict";

var assert = require("../test/assertions");
require("../test/mockdom");

var {InlineDiffView} = require("./diff/inline_diff_view");
var {SplitDiffView} = require("./diff/split_diff_view");
const {createDiffView} = require("./diff");

var diffView;

module.exports = {
    tearDown: function () {
        if (diffView) {
            diffView.destroy();
            diffView = null;
        }
    },
    "test: diff wrapper test": function () {
        diffView = createDiffView({inline: "a"});
        assert.ok(diffView instanceof InlineDiffView);
        diffView.destroy();
        diffView = createDiffView({});
        assert.ok(diffView instanceof SplitDiffView);
    },
    "test: diff setOptions": function () {
        diffView = createDiffView({}, {
            maxDiffs: 1000,
            ignoreTrimWhitespace: true
        });
        assert.ok(diffView.getOption("maxDiffs"), 1000);
        assert.ok(diffView.getOption("ignoreTrimWhitespace"), true);
    }
};

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
