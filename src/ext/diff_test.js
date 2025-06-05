"use strict";

var assert = require("../test/assertions");
require("../test/mockdom");

var {InlineDiffView} = require("./diff/inline_diff_view");
var {DiffView} = require("./diff/diff_view");
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
        diffView = createDiffView({}, true);
        assert.ok(diffView instanceof InlineDiffView);
        diffView.destroy();
        diffView = createDiffView({}, false);
        assert.ok(diffView instanceof DiffView);
    }
};

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
