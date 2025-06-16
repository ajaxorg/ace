var InlineDiffView = require("./diff/inline_diff_view").InlineDiffView;
var DiffView = require("./diff/diff_view").DiffView;
var DiffProvider = require("./diff/providers/default").DiffProvider;

/**
 * Creates a diff view for comparing code.
 * @param {import("../../ace-internal").Ace.DiffModel} [diffModel] model for the diff view
 * @param {import("../../ace-internal").Ace.DiffViewOptions} [options] options for the diff view
 * @returns {InlineDiffView|DiffView} Configured diff view instance
 */
function createDiffView(diffModel, options) {
    diffModel = diffModel || {};
    diffModel.diffProvider = diffModel.diffProvider || new DiffProvider(); //use default diff provider;
    let diffView;
    if (diffModel.inline) {
        diffView = new InlineDiffView(diffModel);
    }
    else {
        diffView = new DiffView(diffModel);
    }
    if (options) {
        diffView.setOptions(options);
    }

    return diffView;
}

exports.InlineDiffView = InlineDiffView;
exports.DiffView = DiffView;
exports.DiffProvider = DiffProvider;
exports.createDiffView = createDiffView;
